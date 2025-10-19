import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getDatabase, ref, set, onValue, get, off } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";

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
const auth = getAuth();

const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');

auth.onAuthStateChanged(async (user) => {
  if (user && code) {
    const emailInput = document.getElementById('signemail');
    emailInput.value = user.email;
    const reqRef = ref(db, 'UserDiscordLoginReQuest/' + user.uid);
    const oauthRef = ref(db, 'UserDiscordOAuth/' + user.uid);

    await set(reqRef, { code });

    let hadValue = false;

    const onReqChange = async (snapshot) => {
      if (snapshot.exists()) {
        hadValue = true;
      } else if (hadValue) {
        off(reqRef, onReqChange);

        const oauthSnap = await get(oauthRef);
        if (oauthSnap.exists()) {;
          alert('디스코드 인증완료!');
          window.location.href = "/account";
        } else {
          alert('인증 실패. 다시 인증해주세요.');
          window.location.href = "/account";
        }
      }
    };

    onValue(reqRef, onReqChange);

  };
});
