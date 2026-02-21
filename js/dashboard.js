// assets/js/dashboard.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// --- تنظیمات فایربیس (همونی که تو auth.js داری) ---
const firebaseConfig = {
  apiKey: "AIzaSyDoNTs8yrAZgQDeKkjV5H86s2YvkdML28s",
  authDomain: "iocraft-auth.firebaseapp.com",
  projectId: "iocraft-auth",
  storageBucket: "iocraft-auth.firebasestorage.app",
  messagingSenderId: "272356682706",
  appId: "1:272356682706:web:148265d9625c78cbb8f60b",
  measurementId: "G-WDFW5QBLVD"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 1. بررسی وضعیت لاگین (Security Check)
onAuthStateChanged(auth, (user) => {
    if (user) {
        // کاربر لاگین است -> اطلاعاتش رو نشون بده
        updateDashboardUI(user);
    } else {
        // کاربر لاگین نیست -> برگردونش به صفحه لاگین
        window.location.href = "auth.html";
    }
});

// 2. آپدیت کردن اسم و عکس کاربر
function updateDashboardUI(user) {
    const nameEl = document.getElementById('sidebarName');
    const avatarEl = document.getElementById('sidebarAvatar');
    const welcomeEl = document.getElementById('welcomeMsg');

    // اگر اسم نداشت (ایمیل بود)، قسمتی از ایمیل رو نشون بده
    const displayName = user.displayName || user.email.split('@')[0];
    
    nameEl.textContent = displayName;
    welcomeEl.textContent = `Welcome Back, ${displayName}.`;
    avatarEl.textContent = displayName.charAt(0).toUpperCase(); // حرف اول اسم
}

// 3. دکمه خروج
const logoutBtn = document.getElementById('logoutBtn');
if(logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        signOut(auth).then(() => {
            // وقتی خارج شد، صفحه بسته میشه یا میره به ایندکس
            window.location.href = "index.html";
        }).catch((error) => {
            console.error("Logout error", error);
        });
    });
}