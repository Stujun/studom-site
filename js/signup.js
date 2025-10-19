import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithPopup, GoogleAuthProvider} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

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
  console.log('스튜덤 샵 | 회원가입 완료');

  localStorage.setItem('uid', user.uid);
  signOut(auth)
  window.location.href = "/login";
}


function validatePassword(pw) {
  const isValidLength = pw.length >= 8 && pw.length <= 20;
  const hasLetter = /[a-zA-Z]/.test(pw);
  const hasNumber = /[0-9]/.test(pw);
  const hasSpecial = /[!@#$%^&*()+,.?":{}|<>]/.test(pw);

  updateCondition(lenCheck, isValidLength, "8~20자 길이");
  updateCondition(letterCheck, hasLetter, "영문자 포함");
  updateCondition(numberCheck, hasNumber, "숫자 포함");
  updateCondition(specialCheck, hasSpecial, "특수문자 포함");

  const allValid = isValidLength && hasLetter && hasNumber && hasSpecial;
  signupBtn.disabled = !allValid;

  return allValid;
}

pwInput.addEventListener('input', () => {
  const pw = pwInput.value;
  validatePassword(pw);
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
          FinSignup(user)
        })
        .catch(() => {
          alert("이메일 인증 메일을 보내는 데 실패했습니다. Studom 고객센터에 문의하세요.");
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      console.error(errorCode)
      const friendlyMessage = {
        "auth/email-already-in-use": "이미 사용 중인 이메일입니다.",
        "auth/invalid-email": "유효하지 않은 이메일 형식입니다.",
        "auth/operation-not-allowed": "이메일/비밀번호 가입이 비활성화되어 있습니다.",
        "auth/weak-password": "비밀번호가 너무 약합니다.",
      }[errorCode] || "회원가입 중 오류가 발생했습니다.";
      errorMessageElement.innerHTML = `<div>${friendlyMessage}</div>`;
    });
});

// document.getElementById('googlepopupbtn').addEventListener('click',() => {
//     signInWithPopup(auth, provider)
//   .then((result) => {
//     const credential = GoogleAuthProvider.credentialFromResult(result);
//     const token = credential.accessToken;
//     const user = result.user;
//     const additionalInfo = getAdditionalUserInfo(result);
//     if (additionalInfo?.isNewUser) {
//       FinSignup(user);
//     } else {
//         console.log('스튜덤 샵 | 로그인 완료')
//         window.location.href = "/";
//     }
//   }).catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     const email = error.customData.email;
//     const credential = GoogleAuthProvider.credentialFromError(error);
//   });
// })
