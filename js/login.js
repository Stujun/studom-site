import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword/*, signInWithPopup, GoogleAuthProvider */} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

function FinLogin(user) {
  console.log('스튜덤 샵 | 로그인 완료')
  window.location.href = "/";
}

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
// const provider = new GoogleAuthProvider();

document.querySelector('.signup-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.querySelector('input[type="email"]').value;
  const password = document.querySelector('input[type="password"]').value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      if (user.emailVerified) {
        FinLogin(user)
      } else {
        showError("이메일 인증이 완료되지 않았습니다. 인증 메일을 확인해주세요.");
        auth.signOut();
      }
    })
    .catch((error) => {
      const errorMessage = {
        "auth/invalid-email": "이메일 형식이 올바르지 않습니다.",
        "auth/user-not-found": "등록되지 않은 이메일입니다.",
        "auth/wrong-password": "비밀번호가 일치하지 않습니다.",
        "auth/user-disabled": "비활성화된 계정입니다.",
      }[error.code] || "로그인 중 문제가 발생했습니다.";
        console.error(error)
      showError(errorMessage);
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
//       localStorage.setItem('uid', user.uid);
//       window.location.href = "https://discord.com/oauth2/authorize?client_id=1373103920968241202&response_type=code&redirect_uri=https%3A%2F%2Fstudom.netlify.app%2Fdiscord&scope=identify";
//     } else {
//       FinLogin(user)
//     }
//   }).catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     const email = error.customData.email;
//     const credential = GoogleAuthProvider.credentialFromError(error);
//   });
// })

function showError(message) {
  let errorBox = document.getElementById('login-error');
  if (!errorBox) {
    errorBox = document.createElement('div');
    errorBox.id = 'login-error';
    errorBox.style.color = 'red';
    errorBox.style.marginTop = '10px';
    document.querySelector('.signup-form').appendChild(errorBox);
  }
  errorBox.textContent = message;
}
