
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
  { id: 11, name: "Muk​​ut Set", category: "Laddu Gopal", price: 299 },
  { id: 12, name: "Shringar Set", category: "Laddu Gopal", price: 599 }
];

let cart = [];
let selectedCategory = "All";

const productList = document.getElementById("product-list");

function renderProducts() {
  if (!productList) return;

  productList.innerHTML = "";

  const filters = document.createElement("div");
  filters.className = "product-filters";

  ["All", "Fashion", "Jewellery", "Accessories", "Laddu Gopal"]
    .forEach(category => {
      const button = document.createElement("button");
      button.textContent = category;
      button.className = selectedCategory === category ? "active" : "";
      button.onclick = () => {
        selectedCategory = category;
        renderProducts();
      };
      filters.appendChild(button);
    });

  productList.appendChild(filters);

  const grid = document.createElement("div");
  grid.className = "product-grid";

  products
    .filter(p => selectedCategory === "All" ||
      p.category === selectedCategory)
    .forEach(product => {
      const card = document.createElement("article");
      card.className = "product-card";

      const image = document.createElement("div");
      image.className = "product-placeholder";
      image.textContent = "PICULA";

      const title = document.createElement("h3");
      title.textContent = product.name;

      const category = document.createElement("p");
      category.textContent = product.category;

      const price = document.createElement("strong");
      price.textContent = `₹${product.price}`;

      const button = document.createElement("button");
      button.textContent = "Add to Cart";
      button.onclick = () => addToCart(product.id);

      card.append(image, title, category, price, button);
      grid.appendChild(card);
    });

  productList.appendChild(grid);
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  cart.push(product);
  renderCart();
}

function renderCart() {
  let cartBox = document.getElementById("picula-cart");

  if (!cartBox) {
    cartBox = document.createElement("div");
    cartBox.id = "picula-cart";
    document.getElementById("products").appendChild(cartBox);
  }

  cartBox.innerHTML = "";

  const heading = document.createElement("h3");
  heading.textContent = `Your Cart (${cart.length})`;
  cartBox.appendChild(heading);

  cart.forEach((product, index) => {
    const item = document.createElement("p");
    item.textContent = `${product.name} — ₹${product.price} `;

    const remove = document.createElement("button");
    remove.textContent = "Remove";
    remove.onclick = () => {
      cart.splice(index, 1);
      renderCart();
    };

    item.appendChild(remove);
    cartBox.appendChild(item);
  });

  const total = cart.reduce((sum, p) => sum + p.price, 0);
  const totalText = document.createElement("strong");
  totalText.textContent = `Demo Total: ₹${total}`;
  cartBox.appendChild(totalText);

  const notice = document.createElement("p");
  notice.textContent = "Demo cart only. Checkout is not available yet.";
  cartBox.appendChild(notice);
}

renderProducts();
renderCart();
