import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

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

const container = document.getElementById("blog-detail-container");
const backBtn = document.getElementById("back-btn");

backBtn.addEventListener("click", () => {
  window.location.href = "/blogs";
});

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

if (!id) {
  container.textContent = "잘못된 접근입니다. ID가 없습니다.";
} else {
  const blogRef = ref(db, `blogs/${id}`);

  get(blogRef)
    .then(snapshot => {
      if (snapshot.exists()) {
        const post = snapshot.val();
        container.innerHTML = `
          <h1>${post.title || "제목 없음"}</h1>
          <article>${marked.parse(post.content || "")}</article>
        `;
      } else {
        container.textContent = "해당 블로그 글을 찾을 수 없습니다.";
      }
    })
    .catch(error => {
      container.textContent = `데이터를 불러오는 중 오류가 발생했습니다: ${error.message}`;
    });
}
