import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, get, child, push, update } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

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

// Discord ID를 가져오는 별도의 유틸리티 함수
async function fetchDiscordId(user) {
  if (!user) return null;
  const discordRef = ref(db, `UserDiscordOAuth/${user.uid}/discordUserId`);
  const snapshot = await get(discordRef);
  return snapshot.val();
}

onAuthStateChanged(auth, async (user) => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  if (!productId) return;

  try {
    const snapshot = await get(child(ref(db), `products/${productId}`));
    
    if (snapshot.exists()) {
      const product = snapshot.val();
      document.getElementById("product-title").textContent = product.title;
      document.getElementById("product-delivery").textContent = product.delivery;
      document.getElementById("product_image").src = product.image;
      
      const price = product.price;
      document.getElementById("product-total").textContent = 
        (!isNaN(price) && typeof price === 'string' && price.trim() !== "") 
        ? `${price}로벅스` : price;

      // 구매 버튼 클릭 이벤트
      document.getElementById('buy-product').onclick = async () => {
        if (!user) {
          alert("상품을 구매하기 전, 로그인을 해주셔야 합니다.");
          return;
        }

        const currentDiscordId = await fetchDiscordId(user);

        if (!currentDiscordId) {
          alert("상품을 구매하기 전, Discord 인증을 해주셔야 합니다.");
          return;
        }

        if (product.price === "무료" || product.price === 0 || product.price === "0") {
          await push(ref(db, "dmRequests"), {
            productId: productId,
            discordId: currentDiscordId, // 여기서 ReferenceError가 발생하지 않음
            timestamp: Date.now(),
            userUid: user.uid
          });
          alert('DM 요청이 전송되었습니다!');
        } else {
          alert('유료 상품은 지원하지 않습니다.');
        }
      };

    } else {
      document.querySelector(".buy-container").innerHTML = "<p>상품을 찾을 수 없습니다.</p>";
    }
  } catch (error) {
    console.error("오류 발생:", error);
  }
});