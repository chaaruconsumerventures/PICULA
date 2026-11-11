
const products = [  
  { id: 1, name: "Elegant Kurti", category: "Fashion", price: 799, image: "images/elegant-kurti.png" },
  { id: 2, name: "Designer Top", category: "Fashion", price: 599, image: "images/designer-top.png" },
  { id: 3, name: "Casual Dress", category: "Fashion", price: 999, image: "images/casual-dress.png" },
  { id: 4,
    name: "Laddu Gopal Mukut",
    category: "Jewellery",
    price: 299,
    image: "images/laddu-mukut.png",
    options: ["Size 0", "Size 1", "Size 2", "Size 3"],
    optionLabel: "Size",
    description: "AI demo product. Decorative Laddu Gopal mukut with pearls, stones and peacock feather. Actual design and size will depend on available stock."
  },
  { id: 5,
    name: "Laddu Gopal Haar / Mala",
    category: "Jewellery",
    price: 699,
    image: "images/laddu-haar.png",
    options: ["Size 0", "Size 1", "Size 2", "Size 3"],
    optionLabel: "Size",
    description: "AI demo product. Decorative pearl mala with colourful stones for Laddu Gopal. Actual materials and dimensions are not confirmed."
  },
  { id: 6,
    name: "Laddu Gopal Bansuri & Jewellery Set",
    category: "Jewellery",
    price: 399,
    image: "images/laddu-bansuri-set.png",
    options: ["Size 0", "Size 1", "Size 2", "Size 3"],
    optionLabel: "Size",
    description: "AI demo product. Decorative bansuri and jewellery accessories for Laddu Gopal. Final set contents and sizes will be confirmed when stock is available."
  },
  {id:7,name:'Mini Handbag',category:'Accessories',price:899,options:['Beige','Black'],optionLabel:'Colour',description:'Sample handbag. Size and material will be updated.'},
  {id:8,name:'Hair Clips Set',category:'Accessories',price:199,options:['Pastel','Neutral'],optionLabel:'Colour',description:'Sample hair clips set. Actual colours and pack contents are pending.'},
  {id:9,name:'Fashion Scarf',category:'Accessories',price:349,options:['Beige','Pink'],optionLabel:'Colour',description:'Sample scarf. Actual fabric and measurements will be updated.'},
  {id:10,name:'Royal Poshak',category:'Laddu Gopal',price:499,options:['Size 0','Size 1','Size 2','Size 3'],optionLabel:'Poshak Size',image:'images/royal-poshak.webp',description:'Illustrative AI-generated image; sample Laddu Gopal poshak. Confirm measurements before making or ordering.'},
  {id:11,name:'Mukut Set',category:'Laddu Gopal',price:299,options:['Small','Medium'],optionLabel:'Size',image:'images/mukut-set.webp',description:'Illustrative AI-generated image; sample mukut set. Actual fit and dimensions will be confirmed.'},
  {id:12,name:'Shringar Set',category:'Laddu Gopal',price:599,options:['Small','Medium'],optionLabel:'Size',image:'images/shringar-set.webp',description:'Illustrative AI-generated image; sample shringar set. Final contents and measurements are pending.'}
];
const STORAGE_KEY = 'picula_demo_cart_v1';
const rupees = n => '₹' + n.toLocaleString('en-IN');
const el = (tag, text, className) => {const node=document.createElement(tag); if(text!==undefined) node.textContent=text; if(className) node.className=className; return node;};
function loadCart(){try {const value=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');if(!Array.isArray(value))return [];return value.filter(i=>Number.isInteger(i.id)&&products.some(p=>p.id===i.id)&&typeof i.option==='string'&&Number.isInteger(i.quantity)&&i.quantity>0&&i.quantity<=99).slice(0,100);}catch{return [];}}
let cart=loadCart();
let selectedCategory='All';
function saveCart(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(cart));}catch(e){console.warn('Cart storage unavailable',e);}}
function subtotal(){return cart.reduce((sum,item)=>{const p=products.find(p=>p.id===item.id);return sum+(p?p.price*item.quantity:0);},0);}
function shipping(){const n=subtotal();return n===0||n>=1000?0:n>=500?40:60;}
function itemCount(){return cart.reduce((sum,i)=>sum+i.quantity,0);}
function addToCart(id,option,quantity=1){const product=products.find(p=>p.id===id);if(!product||!product.options.includes(option)||!Number.isInteger(quantity)||quantity<1)return;const item=cart.find(i=>i.id===id&&i.option===option);if(item)item.quantity=Math.min(99,item.quantity+quantity);else cart.push({id,option,quantity:Math.min(99,quantity)});saveCart();renderCart();}
function changeQuantity(id,option,delta){const item=cart.find(i=>i.id===id&&i.option===option);if(!item)return;item.quantity=Math.min(99,item.quantity+delta);if(item.quantity<=0)cart=cart.filter(i=>i!==item);saveCart();renderCart();}
function renderProducts(){const root=document.getElementById('product-list');if(!root)return;root.replaceChildren();const filters=el('div',undefined,'product-filters');['All','Fashion','Jewellery','Accessories','Laddu Gopal'].forEach(category=>{const btn=el('button',category,selectedCategory===category?'active':'');btn.type='button';btn.onclick=()=>{selectedCategory=category;renderProducts();};filters.append(btn);});root.append(filters);const grid=el('div',undefined,'product-grid');products.filter(p=>selectedCategory==='All'||p.category===selectedCategory).forEach(p=>{const card=el('article',undefined,'product-card');const photo=p.image?el('div',undefined,'product-placeholder picula-photo-wrap'):el('div','PICULA · SAMPLE','product-placeholder');if(p.image){const img=el('img');img.src=p.image;img.alt='AI-generated sample styling for '+p.name;img.loading='lazy';photo.append(img,el('span','AI SAMPLE IMAGE','picula-sample-tag'));}const title=el('h3',p.name);const category=el('p',p.category+' · Demo product');const price=el('strong',rupees(p.price));const details=el('a','View Details','picula-details-link');details.href='product.html?id='+encodeURIComponent(p.id);const add=el('button','Add to Cart');add.type='button';add.onclick=()=>{addToCart(p.id,p.options[0]);add.textContent='Added ✓';setTimeout(()=>{if(add.isConnected)add.textContent='Add to Cart';},1000);};card.append(photo,title,category,price,details,add);grid.append(card);});root.append(grid);}
function renderProductPage(){const root=document.getElementById('picula-product-detail');if(!root)return;root.replaceChildren();const id=Number(new URLSearchParams(location.search).get('id'));const product=products.find(p=>p.id===id);if(!product){root.append(el('h1','Product not found'),el('p','Please choose a product from the collection.'));const link=el('a','Back to Shop');link.href='index.html#products';root.append(link);return;}document.title=product.name+' | PICULA';const back=el('a','← Back to Shop','picula-back');back.href='index.html#products';const layout=el('div',undefined,'picula-detail-grid');const photo=product.image?el('div',undefined,'picula-detail-image picula-photo-wrap'):el('div','PICULA · SAMPLE IMAGE','picula-detail-image');if(product.image){const img=el('img');img.src=product.image;img.alt='AI-generated sample styling for '+product.name;photo.append(img,el('span','AI SAMPLE IMAGE · NOT ACTUAL PRODUCT','picula-sample-tag'));}const info=el('div',undefined,'picula-detail-info');info.append(el('p',product.category+' · DEMO PRODUCT','picula-eyebrow'),el('h1',product.name),el('h2',rupees(product.price)),el('p',product.description));const optionLabel=el('label',product.optionLabel);optionLabel.htmlFor='picula-option';const select=el('select');select.id='picula-option';product.options.forEach(value=>{const opt=el('option',value);opt.value=value;select.append(opt);});const qtyLabel=el('label','Quantity');qtyLabel.htmlFor='picula-qty';const qty=el('input');qty.id='picula-qty';qty.type='number';qty.min='1';qty.max='99';qty.value='1';const button=el('button','Add to Cart','picula-primary');button.type='button';const message=el('p','This is a sample listing. Payments and orders are not active.','picula-muted');button.onclick=()=>{const amount=Number(qty.value);if(!Number.isInteger(amount)||amount<1||amount>99){message.textContent='Choose a quantity between 1 and 99.';return;}addToCart(product.id,select.value,amount);message.textContent='Added to cart! Open your cart below or return to the shop.';};info.append(optionLabel,select,qtyLabel,qty,button,message);layout.append(photo,info);root.append(back,layout);}
function renderCart(){let box=document.getElementById('picula-cart');const home=document.getElementById('products');const detail=document.getElementById('picula-product-detail');if(!box){if(!home&&!detail)return;box=el('section');box.id='picula-cart';(home||detail).append(box);}box.replaceChildren();box.append(el('h3',`Your Cart (${itemCount()})`));const old=document.getElementById('picula-checkout');if(old)old.remove();if(cart.length===0){box.append(el('p','Your cart is empty.'));return;}cart.forEach(item=>{const p=products.find(p=>p.id===item.id);if(!p)return;const row=el('div',undefined,'cart-item');row.append(el('strong',`${p.name} (${item.option}) — ${rupees(p.price)} each`));const controls=el('div',undefined,'cart-controls');const minus=el('button','−');minus.type='button';minus.onclick=()=>changeQuantity(item.id,item.option,-1);const count=el('span',String(item.quantity));const plus=el('button','+');plus.type='button';plus.onclick=()=>changeQuantity(item.id,item.option,1);const remove=el('button','Remove');remove.type='button';remove.onclick=()=>changeQuantity(item.id,item.option,-item.quantity);controls.append(minus,count,plus,remove);row.append(controls);box.append(row);});box.append(el('p','Products Subtotal: '+rupees(subtotal())),el('p','Shipping: '+(shipping()===0?'FREE':rupees(shipping()))),el('h3','Final Total: '+rupees(subtotal()+shipping())));const checkout=el('button','Enter Delivery Details');checkout.type='button';checkout.onclick=showCheckout;box.append(checkout,el('p','Demo only — no payment or order submission.'));}
function showCheckout(){if(!cart.length)return;const parent=document.getElementById('picula-cart');if(!parent)return;let section=document.getElementById('picula-checkout');if(!section){section=el('section');section.id='picula-checkout';parent.after(section);}section.replaceChildren();section.append(el('h3','Delivery Details — Demo'));const form=el('form',undefined,'checkout-form');const fields=[['customerName','Full Name','text'],['mobile','Mobile Number','tel'],['address','Delivery Address','text'],['city','City','text'],['state','State','text'],['pincode','PIN Code','text']];fields.forEach(([name,title,type])=>{const label=el('label',title);const input=el('input');input.name=name;input.type=type;input.placeholder=title;input.required=true;if(name==='mobile'){input.pattern='[6-9][0-9]{9}';input.maxLength=10;}if(name==='pincode'){input.pattern='[0-9]{6}';input.maxLength=6;}label.append(input);form.append(label);});const preview=el('button','Preview Order');preview.type='submit';form.append(preview);const result=el('div');result.id='checkout-result';form.onsubmit=event=>{event.preventDefault();result.replaceChildren();const name=String(new FormData(form).get('customerName')||'').trim();result.append(el('h3','Order Preview'),el('p','Customer: '+name),el('p','Items: '+itemCount()));cart.forEach(i=>{const p=products.find(p=>p.id===i.id);if(p)result.append(el('p',`${p.name} (${i.option}) × ${i.quantity} = ${rupees(p.price*i.quantity)}`));});result.append(el('p','Products Subtotal: '+rupees(subtotal())),el('p','Shipping: '+(shipping()===0?'FREE':rupees(shipping()))),el('h3','Final Total: '+rupees(subtotal()+shipping())),el('p','Demo preview only. No payment or order has been submitted.'));};section.append(form,result);section.scrollIntoView({behavior:'smooth',block:'start'});}
renderProducts();
renderProductPage();
renderCart();
