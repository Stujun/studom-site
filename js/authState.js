import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

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
const auth = getAuth(app);

const navRight = document.querySelector(".nav-right");

onAuthStateChanged(auth, (user) => {
  navRight.innerHTML = ""; // 기존 버튼들 제거

  if (user) {
    console.log(user)
    // 로그인 상태일 때
    const accountBtn = document.createElement("a");
    accountBtn.href = "/account";
    accountBtn.textContent = "내 계정";

    const logoutBtn = document.createElement("a");
    logoutBtn.href = "#";
    logoutBtn.textContent = "로그아웃";
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      signOut(auth).then(() => {
        location.reload(); // 새로고침으로 UI 반영
      });
    });

    navRight.appendChild(accountBtn);
    navRight.appendChild(logoutBtn);
  } else {
    // 비로그인 상태일 때
    const signupBtn = document.createElement("a");
    signupBtn.href = "/signup";
    signupBtn.textContent = "회원가입";

    const loginBtn = document.createElement("a");
    loginBtn.href = "/login";
    loginBtn.textContent = "로그인";

    navRight.appendChild(signupBtn);
    navRight.appendChild(loginBtn);
  }
});
