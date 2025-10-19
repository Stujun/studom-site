import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, get, child, push } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
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

// 로그인 및 Discord ID 확인
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "/login"; // 로그인 안 했으면 리다이렉트
    return;
  }

  // Discord ID가 있는지 확인
  const discordRef = ref(db, `UserDiscordOAuth/${user.uid}/discordUserId`);
   const snapshot= await get(discordRef);

  if (!snapshot.exists() || !snapshot.val()) {
    window.location.href = "/login"; // Discord ID 없으면 리다이렉트
    return;
  }

  const discordId = snapshot.val();

  // 상품 정보 가져오기
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  get(child(ref(db), `products/${productId}`))
    .then(snapshot => {
      if (snapshot.exists()) {
        const product = snapshot.val();
        document.getElementById("product-title").textContent = product.title;
        document.getElementById("product-delivery").textContent = product.delivery;
        document.getElementById("product_image").src = product.image;
        
        const price = product.price;

        if (!isNaN(price) && price.trim() !== "") {
          document.getElementById("product-total").textContent = `${product.price}로벅스`;
        } else {
          document.getElementById("product-total").textContent = price;
        };

        document.getElementById('buy-product').addEventListener('click', async () => {
          if (product.price === "무료" || product.price === 0 || product.price === "0") {
            await push(ref(db, "dmRequests"), {
              productId: productId,
              discordId: discordId,
              timestamp: Date.now(),
              userUid: user.uid
            });
            alert("");
            alert('DM 요청이 전송되었습니다!',);
          } else {
            alert('유료 상품은 지원하지 않습니다.');
          }
        });
      } else {
        document.querySelector(".buy-container").innerHTML = "<p>상품을 찾을 수 없습니다.</p>";
      }
    })
    .catch(error => {
      console.error("데이터 로딩 오류:", error);
      document.querySelector(".buy-container").innerHTML = "<p>오류가 발생했습니다.</p>";
    });
});