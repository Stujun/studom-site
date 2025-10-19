import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAwalsRxEy05oqGwn--H9kSvx0jJZ5LNLc",
  authDomain: "studom-website.firebaseapp.com",
  databaseURL: "https://studom-website-default-rtdb.firebaseio.com",
  projectId: "studom-website",
  storageBucket: "studom-website.appspot.com",
  messagingSenderId: "400999430125",
  appId: "1:400999430125:web:084474fa23a186025d59e4",
  measurementId: "G-PLYLJFT930"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const blogContainer = document.getElementById("blog-container");
const blogsRef = ref(db, "blogs");

function renderBlogs(data) {
  blogContainer.innerHTML = "";

  const listDiv = document.createElement("div");
  listDiv.className = "blog-list";

  Object.entries(data).forEach(([key, post]) => {
    const card = document.createElement("div");
    card.className = "blog-card";

    const img = document.createElement("img");
    img.className = "blog-image";
    img.src = post.imageUrl || "/images/logo.png";
    img.alt = post.title || "블로그 이미지";

    const textWrapper = document.createElement("div");
    textWrapper.className = "blog-text";

    const title = document.createElement("div");
    title.className = "blog-title";
    title.textContent = post.title || "제목 없음";

    const excerpt = document.createElement("div");
    excerpt.className = "excerpt";
    excerpt.textContent = post.excerpt_kr || "간추린 내용이 없습니다.";

    textWrapper.appendChild(title);
    textWrapper.appendChild(excerpt);

    card.appendChild(img);
    card.appendChild(textWrapper);

    card.addEventListener("click", () => {
      window.location.href = `/blog?id=${key}`;
    });

    listDiv.appendChild(card);
  });

  blogContainer.appendChild(listDiv);
}


onValue(blogsRef, (snapshot) => {
  const data = snapshot.val();
  if (data) {
    renderBlogs(data);
  } else {
    blogContainer.textContent = "등록된 블로그 글이 없습니다.";
  }
});
