
const products = [
  { id: 1, name: "Everyday Dress", category: "Fashion", price: 799 },
  { id: 2, name: "Elegant Kurti", category: "Fashion", price: 649 },
  { id: 3, name: "Classic Top", category: "Fashion", price: 499 },
  { id: 4, name: "Pearl Earrings", category: "Jewellery", price: 299 },
  { id: 5, name: "Gold Tone Necklace", category: "Jewellery", price: 599 },
  { id: 6, name: "Statement Ring", category: "Jewellery", price: 249 },
  { id: 7, name: "Mini Handbag", category: "Accessories", price: 899 },
  { id: 8, name: "Hair Clip Set", category: "Accessories", price: 199 },
  { id: 9, name: "Fashion Sunglasses", category: "Accessories", price: 399 },
  { id: 10, name: "Royal Poshak", category: "Devotional", price: 349 },
  { id: 11, name: "Laddu Gopal Mukut", category: "Devotional", price: 199 },
  { id: 12, name: "Shringar Set", category: "Devotional", price: 449 }
];

let cart = [];

function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  cart.push(product);
  updateCart();
  alert(product.name + " added to demo cart!");
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

function updateCart() {
  const count = document.getElementById("cart-count");
  const items = document.getElementById("cart-items");
  const totalElement = document.getElementById("cart-total");

  if (count) count.textContent = cart.length;

  if (items) {
    items.innerHTML = "";

    cart.forEach((product, index) => {
      const item = document.createElement("div");
      item.className = "cart-item";

      const name = document.createElement("span");
      name.textContent = product.name + " - ₹" + product.price;

      const remove = document.createElement("button");
      remove.textContent = "Remove";
      remove.addEventListener("click", () => removeFromCart(index));

      item.append(name, remove);
      items.appendChild(item);
    });
  }

  const total = cart.reduce((sum, p) => sum + p.price, 0);

  if (totalElement) {
    totalElement.textContent = "₹" + total;
  }
}

function toggleCart() {
  const panel = document.getElementById("cart-panel");
  if (panel) panel.classList.toggle("open");
}

function filterProducts(category) {
  document.querySelectorAll("[data-category]").forEach(card => {
    card.style.display =
      category === "All" || card.dataset.category === category
        ? ""
        : "none";
  });
}

function checkoutWhatsApp() {
  alert(
    "PICULA Demo Store: WhatsApp ordering will be enabled after products and business number are confirmed."
  );
}

document.addEventListener("DOMContentLoaded", updateCart);
