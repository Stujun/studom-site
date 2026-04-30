import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

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
const analytics = getAnalytics(app);
const auth = getAuth();
const provider = new GoogleAuthProvider();

const pwInput = document.getElementById('pw');
const emailInput = document.getElementById('signemail');
const errorMessageElement = document.getElementById('error-message');
const signupBtn = document.getElementById('signupbtn');

const lenCheck = document.getElementById('lenCheck');
const letterCheck = document.getElementById('letterCheck');
const numberCheck = document.getElementById('numberCheck');
const specialCheck = document.getElementById('specialCheck');

function updateCondition(element, isValid, label) {
  element.className = isValid ? 'valid' : 'invalid';
  element.innerHTML = (isValid ? '✅' : '❌') + ' ' + label;
}

function FinSignup(user) {
  localStorage.setItem('uid', user.uid);
  signOut(auth).then(() => {
    window.location.href = "/login";
  }).catch(() => {
    window.location.href = "/login";
  });
}

function validatePassword(pw) {
  const isValidLength = pw.length >= 8 && pw.length <= 20;
  const hasLetter = /[a-zA-Z]/.test(pw);
  const hasNumber = /[0-9]/.test(pw);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pw);

  updateCondition(lenCheck, isValidLength, "8~20자 길이");
  updateCondition(letterCheck, hasLetter, "영문자 포함");
  updateCondition(numberCheck, hasNumber, "숫자 포함");
  updateCondition(specialCheck, hasSpecial, "특수문자 포함");

  const allValid = isValidLength && hasLetter && hasNumber && hasSpecial;
  signupBtn.disabled = !allValid;

  return allValid;
}

pwInput.addEventListener('input', () => {
  validatePassword(pwInput.value);
});

document.querySelector('.signup-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const email = emailInput.value;
  const pw = pwInput.value;
  errorMessageElement.textContent = "";

  if (!validatePassword(pw)) return;

  createUserWithEmailAndPassword(auth, email, pw)
    .then((userCredential) => {
      const user = userCredential.user;
      sendEmailVerification(user)
        .then(() => {
          alert("이메일 인증 메일을 확인해주세요.");
          FinSignup(user);
        })
        .catch((error) => {
          console.error(error.code);
          alert("인증 메일 발송 실패: " + error.code);
          FinSignup(user);
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      console.error(errorCode);
      const friendlyMessage = {
        "auth/email-already-in-use": "이미 사용 중인 이메일입니다.",
        "auth/invalid-email": "유효하지 않은 이메일 형식입니다.",
        "auth/operation-not-allowed": "이메일 가입이 비활성화되어 있습니다.",
        "auth/weak-password": "비밀번호가 너무 약합니다.",
        "auth/too-many-requests": "요청이 너무 많습니다. 잠시 후 다시 시도해주세요."
      }[errorCode] || "오류 발생: " + errorCode;
      errorMessageElement.innerHTML = `<div>${friendlyMessage}</div>`;
    });
});