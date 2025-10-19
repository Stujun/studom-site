import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAwalsRxEy05oqGwn--H9kSvx0jJZ5LNLc",
  authDomain: "studom-website.firebaseapp.com",
  databaseURL: "https://studom-website-default-rtdb.firebaseio.com",
  projectId: "studom-website",
  storageBucket: "studom-website.firebasestorage.app",
  messagingSenderId: "400999430125",
  appId: "1:400999430125:web:084474fa23a186025d59e4",
  measurementId: "G-PLYLJFT930"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const listContainer = document.getElementById("productList");
const searchInput = document.getElementById("productSearch");

let allProducts = [];

function renderProducts(products) {
  listContainer.innerHTML = "";
  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";

    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.title;

    const tagDiv = document.createElement("div");
    tagDiv.className = "tag";
    tagDiv.textContent = product.tag;

    const titleEl = document.createElement("h3");
    titleEl.textContent = product.title;

    const priceEl = document.createElement("p");
    priceEl.textContent = product.price;

    card.addEventListener("click", () => {
      window.location.href = `/buy/?id=${product.id}`;
    });

    card.appendChild(img);
    card.appendChild(tagDiv);
    card.appendChild(titleEl);
    card.appendChild(priceEl);
    listContainer.appendChild(card);
  });
}

const productsRef = ref(db, 'products');
onValue(productsRef, snapshot => {
  const data = snapshot.val();
  allProducts = Object.values(data || {});
  renderProducts(allProducts);
});

searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase();
  const filtered = allProducts.filter(p =>
    p.title && p.title.toLowerCase().includes(keyword)
  );
  renderProducts(filtered);
});
