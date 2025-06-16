let products = [
  { name: "Espresso", price: 3.00, image: "images/espresso.webp" },
  { name: "Latte", price: 4.00, image: "images/latte.webp" },
  { name: "Cappuccino", price: 4.50, image: "images/cappuccino.webp" },
  { name: "Mocha", price: 5.00, image: "images/mocha.webp" },
  { name: "Americano", price: 3.50, image: "images/americano.webp" },
  { name: "Cold Brew", price: 4.20, image: "images/coldbrew.webp" },
  { name: "Cortado", price: 5.50, image: "images/cortado.jpg" },
  { name: "Flat White", price: 8.50, image: "images/flat white.jpg" }
];

let cart = [];
let isAdmin = false;

const stored = localStorage.getItem('products');
if (stored) products = JSON.parse(stored);

function saveProducts() {
  localStorage.setItem('products', JSON.stringify(products));
}

function renderMenu() {
  const menu = document.getElementById('menu-items');
  const search = document.getElementById('search').value.toLowerCase();
  menu.innerHTML = '';

  products
    .filter(p => p.name.toLowerCase().includes(search))
    .forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'menu-item';
      div.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <h3>${item.name}</h3>
        <p>$${item.price.toFixed(2)}</p>
        <button class="btn" onclick="addToCart(${index})">Add to Cart</button>
        ${isAdmin ? `<button class="btn" style="background-color: red;" onclick="deleteProduct(${index})">Delete</button>` : ''}
      `;
      menu.appendChild(div);
    });
}

function renderCart() {
  const cartDiv = document.getElementById('cart-items');
  cartDiv.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      ${item.name} - $${item.price.toFixed(2)}
      <button onclick="removeFromCart(${index})">Remove</button>
    `;
    cartDiv.appendChild(div);
  });

  document.getElementById('total-price').innerText = total.toFixed(2);
}

function addToCart(index) {
  cart.push(products[index]);
  renderCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  let receiptHTML = "<table style='width:100%; border-collapse: collapse;'>";
  receiptHTML += "<tr><th style='border:1px solid #ccc;'>Item</th><th style='border:1px solid #ccc;'>Price</th></tr>";

  let total = 0;
  cart.forEach(item => {
    receiptHTML += `<tr>
                      <td style='border:1px solid #ccc; padding:5px;'>${item.name}</td>
                      <td style='border:1px solid #ccc; padding:5px;'>$${item.price.toFixed(2)}</td>
                    </tr>`;
    total += item.price;
  });

  receiptHTML += `<tr>
                    <td style='border:1px solid #ccc; padding:5px;'><strong>Total</strong></td>
                    <td style='border:1px solid #ccc; padding:5px;'><strong>$${total.toFixed(2)}</strong></td>
                  </tr>`;
  receiptHTML += "</table>";

  document.getElementById('receipt-details').innerHTML = receiptHTML;
  document.getElementById('receipt').style.display = 'block';

  cart = [];
  renderCart();
}

function printReceipt() {
  const printWindow = window.open('', '', 'height=500,width=600');
  printWindow.document.write('<html><head><title>Receipt</title></head><body>');
  printWindow.document.write(document.getElementById('receipt-details').innerHTML);
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  printWindow.print();
}

function adminLogin() {
  const password = prompt("Enter admin password:");
  if (password === "admin123") {
    isAdmin = true;
    document.querySelector('.admin').style.display = 'block';
    renderMenu();
  } else {
    alert("Incorrect password.");
  }
}

function deleteProduct(index) {
  if (confirm(`Delete ${products[index].name}?`)) {
    products.splice(index, 1);
    saveProducts();
    renderMenu();
  }
}

document.getElementById('admin-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const price = parseFloat(document.getElementById('price').value);
  const image = document.getElementById('image').value.trim();

  if (!name || isNaN(price) || !image) {
    alert("Please fill all fields correctly.");
    return;
  }

  products.push({ name, price, image });
  saveProducts();
  this.reset();
  renderMenu();
});

document.getElementById('inquiry-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const name = document.getElementById('inq-name').value.trim();
  const email = document.getElementById('inq-email').value.trim();
  const message = document.getElementById('inq-message').value.trim();

  if (!name || !email || !message) {
    alert("Please complete the form.");
    return;
  }

  alert("Thank you for your message! We'll get back to you soon.");
  this.reset();
});

renderMenu();
renderCart();
