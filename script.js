
const products = [
  { id: 1, name: "Elegant Kurti", category: "Fashion", price: 799 },
  { id: 2, name: "Designer Top", category: "Fashion", price: 599 },
  { id: 3, name: "Casual Dress", category: "Fashion", price: 999 },
  { id: 4, name: "Pearl Earrings", category: "Jewellery", price: 299 },
  { id: 5, name: "Golden Necklace", category: "Jewellery", price: 699 },
  { id: 6, name: "Charm Bracelet", category: "Jewellery", price: 399 },
  { id: 7, name: "Mini Handbag", category: "Accessories", price: 899 },
  { id: 8, name: "Hair Clips Set", category: "Accessories", price: 199 },
  { id: 9, name: "Fashion Scarf", category: "Accessories", price: 349 },
  { id: 10, name: "Royal Poshak", category: "Laddu Gopal", price: 499 },
  { id: 11, name: "Mukut Set", category: "Laddu Gopal", price: 299 },
  { id: 12, name: "Shringar Set", category: "Laddu Gopal", price: 599 }
];

const cart = [];
let selectedCategory = "All";

const productList = document.getElementById("product-list");
const productSection = document.getElementById("products");

const rupees = amount =>
  "₹" + amount.toLocaleString("en-IN");

function makeElement(tag, text, className) {
  const element = document.createElement(tag);
  if (text !== undefined) element.textContent = text;
  if (className) element.className = className;
  return element;
}

function renderProducts() {
  if (!productList) return;
  productList.replaceChildren();

  const filters = makeElement("div", undefined, "product-filters");

  ["All", "Fashion", "Jewellery", "Accessories", "Laddu Gopal"]
    .forEach(category => {
      const button = makeElement("button", category);
      button.type = "button";

      if (selectedCategory === category) {
        button.className = "active";
      }

      button.onclick = () => {
        selectedCategory = category;
        renderProducts();
      };

      filters.appendChild(button);
    });

  productList.appendChild(filters);

  const grid = makeElement("div", undefined, "product-grid");

  products
    .filter(product =>
      selectedCategory === "All" ||
      product.category === selectedCategory
    )
    .forEach(product => {
      const card = makeElement("article", undefined, "product-card");
      const image = makeElement("div", "PICULA", "product-placeholder");
      const title = makeElement("h3", product.name);
      const category = makeElement("p", product.category);
      const price = makeElement("strong", rupees(product.price));
      const button = makeElement("button", "Add to Cart");

      button.type = "button";
      button.onclick = () => addToCart(product.id);

      card.append(image, title, category, price, button);
      grid.appendChild(card);
    });

  productList.appendChild(grid);
}

function addToCart(id) {
  const item = cart.find(item => item.id === id);

  if (item) {
    item.quantity++;
  } else {
    cart.push({ id, quantity: 1 });
  }

  renderCart();
}

function changeQuantity(id, amount) {
  const item = cart.find(item => item.id === id);
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    const index = cart.indexOf(item);
    cart.splice(index, 1);
  }

  renderCart();
}

function getCartTotal() {
  return cart.reduce((total, item) => {
    const product = products.find(p => p.id === item.id);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);
}


function getShippingCharge() {
  const subtotal = getCartTotal();

  if (subtotal === 0) return 0;
  if (subtotal >= 1000) return 0;
  if (subtotal >= 500) return 40;

  return 60;
}

function getFinalTotal() {
  return getCartTotal() + getShippingCharge();
}

function renderCart() {
  if (!productSection) return;

  let cartBox = document.getElementById("picula-cart");

  if (!cartBox) {
    cartBox = makeElement("div");
    cartBox.id = "picula-cart";
    productSection.appendChild(cartBox);
  }

  cartBox.replaceChildren();

  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartBox.appendChild(makeElement("h3", `Your Cart (${count})`));

  if (cart.length === 0) {
    cartBox.appendChild(makeElement("p", "Your cart is empty."));
    return;
  }

  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);
    if (!product) return;

    const row = makeElement("div", undefined, "cart-item");

    row.appendChild(
      makeElement("strong", `${product.name} — ${rupees(product.price)}`)
    );

    const controls = makeElement("div", undefined, "cart-controls");

    const minus = makeElement("button", "−");
    minus.type = "button";
    minus.onclick = () => changeQuantity(item.id, -1);

    const quantity = makeElement("span", String(item.quantity));

    const plus = makeElement("button", "+");
    plus.type = "button";
    plus.onclick = () => changeQuantity(item.id, 1);

    const remove = makeElement("button", "Remove");
    remove.type = "button";
    remove.onclick = () => {
      const index = cart.indexOf(item);
      cart.splice(index, 1);
      renderCart();
    };

    controls.append(minus, quantity, plus, remove);
    row.appendChild(controls);
    cartBox.appendChild(row);
  });

  cartBox.appendChild(
    makeElement("h3", `Demo Subtotal: ${rupees(getCartTotal())}`)
  );
    
  const shipping = getShippingCharge();
  
  cartBox.appendChild(
    makeElement(
      "p",
      `Shipping: ${shipping === 0 ? "FREE" : rupees(shipping)}`
    )
  );
  
  cartBox.appendChild(
    makeElement(
      "h3",
      `Final Total: ${rupees(getFinalTotal())}`
    )
  );


  
  const checkoutButton = makeElement("button", "Enter Delivery Details");
  checkoutButton.type = "button";
  checkoutButton.onclick = showCheckout;

  cartBox.appendChild(checkoutButton);
  cartBox.appendChild(
    makeElement("p", "Demo only. No payment or order is being processed.")
  );
}

function showCheckout() {
  if (!cart.length || !productSection) return;

  let checkout = document.getElementById("picula-checkout");

  if (!checkout) {
    checkout = makeElement("div");
    checkout.id = "picula-checkout";
    productSection.appendChild(checkout);
  }

  checkout.replaceChildren();
  checkout.appendChild(makeElement("h3", "Delivery Details"));

  const form = document.createElement("form");
  form.className = "checkout-form";

  const fields = [
    { name: "customerName", label: "Full Name", type: "text" },
    { name: "mobile", label: "Mobile Number", type: "tel" },
    { name: "address", label: "Delivery Address", type: "text" },
    { name: "city", label: "City", type: "text" },
    { name: "state", label: "State", type: "text" },
    { name: "pincode", label: "PIN Code", type: "text" }
  ];

  fields.forEach(field => {
    const label = makeElement("label", field.label);
    const input = document.createElement("input");

    input.name = field.name;
    input.type = field.type;
    input.required = true;
    input.placeholder = field.label;

    if (field.name === "mobile") {
      input.pattern = "[6-9][0-9]{9}";
      input.maxLength = 10;
      input.title = "Enter a valid 10-digit Indian mobile number";
    }

    if (field.name === "pincode") {
      input.pattern = "[0-9]{6}";
      input.maxLength = 6;
      input.title = "Enter a 6-digit PIN code";
    }

    label.appendChild(input);
    form.appendChild(label);
  });

  const submit = makeElement("button", "Preview Order");
  submit.type = "submit";
  form.appendChild(submit);

  const result = makeElement("div");
  result.id = "checkout-result";

  form.onsubmit = event => {
    event.preventDefault();

    const data = new FormData(form);
    const name = String(data.get("customerName")).trim();

    result.replaceChildren();

    result.appendChild(makeElement("h3", "Order Preview"));
    result.appendChild(makeElement("p", `Customer: ${name}`));
    result.appendChild(
      makeElement("p", `Items: ${cart.reduce((s, i) => s + i.quantity, 0)}`)
    );
    result.appendChild(
      makeElement("h3", `Demo Subtotal: ${rupees(getCartTotal())}`)
    );
    
result.appendChild(
  makeElement(
    "p",
    `Shipping: ${
      getShippingCharge() === 0
        ? "FREE"
        : rupees(getShippingCharge())
    }`
  )
);

result.appendChild(
  makeElement(
    "h3",
    `Final Total: ${rupees(getFinalTotal())}`
  )
);

result.appendChild(
  makeElement(
    "p",
    "Demo only. Payment is not enabled yet."
  )
);

    result.appendChild(
      makeElement(
        "p",
        "This is only a preview. No order has been submitted or confirmed."
      )
    );
  };

  checkout.append(form, result);
  checkout.scrollIntoView({ behavior: "smooth", block: "start" });
}

renderProducts();
renderCart();
