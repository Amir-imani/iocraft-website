// --- 1. FIREBASE IMPORTS ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    GoogleAuthProvider 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// --- 2. FIREBASE CONFIGURATION ---

const firebaseConfig = {
  apiKey: "AIzaSyDoNTs8yrAZgQDeKkjV5H86s2YvkdML28s",
  authDomain: "iocraft-auth.firebaseapp.com",
  projectId: "iocraft-auth",
  storageBucket: "iocraft-auth.firebasestorage.app",
  messagingSenderId: "272356682706",
  appId: "1:272356682706:web:148265d9625c78cbb8f60b",
  measurementId: "G-WDFW5QBLVD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// --- 3. AUTHENTICATION LOGIC ---

// A. SIGN UP (ثبت نام با ایمیل)
const signupForm = document.getElementById('signupForm');
if(signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const name = document.getElementById('signupName').value;

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // ثبت نام موفق
                const user = userCredential.user;
                alert(`Welcome Engineer ${name}! Registration Successful.`);
                console.log("Registered:", user);
                // اینجا بعداً رایرکت می‌کنیم به داشبورد
                 window.open("dashboard.html", "_blank"); 
            })
            .catch((error) => {
                alert("Error: " + error.message);
            });
    });
}

// B. LOGIN (ورود با ایمیل)
const loginForm = document.getElementById('loginForm');
if(loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // ورود موفق
                const user = userCredential.user;
                alert("Access Granted. System Initialized.");
                console.log("Logged in:", user);
                // رایرکت به صفحه اصلی یا داشبورد
                window.open("dashboard.html", "_blank");
            })
            .catch((error) => {
                alert("Access Denied: " + error.message);
            });
    });
}

// C. GOOGLE LOGIN (ورود با گوگل)
const googleBtn = document.getElementById('googleLoginBtn');
if(googleBtn) {
    googleBtn.addEventListener('click', () => {
        signInWithPopup(auth, googleProvider)
            .then((result) => {
                // ورود موفق با گوگل
                const user = result.user;
                alert(`Welcome ${user.displayName}! Google Authentication Verified.`);
                window.open("dashboard.html", "_blank");
            })
            .catch((error) => {
                alert("Google Auth Failed: " + error.message);
            });
    });
}


// --- 4. UI ANIMATIONS (The Particles & Switcher) ---
// (این بخش همون کدهای قبلی خودته که اینجا حفظشون کردیم)

document.addEventListener('DOMContentLoaded', () => {
    // Switch Logic
    const mainPanel = document.getElementById('mainPanel');
    const toSignup = document.getElementById('toSignup');
    const toLogin = document.getElementById('toLogin');

    if(toSignup && toLogin && mainPanel) {
        toSignup.addEventListener('click', () => mainPanel.classList.add('active'));
        toLogin.addEventListener('click', () => mainPanel.classList.remove('active'));
    }

    // Particle Logic
    const canvas = document.getElementById('backgroundCanvas');
    if(canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let mouse = { x: -100, y: -100 };
        let particles = [];
        const particleCount = 50;
        const repulsionRadius = 120;
        const repulsionForce = 5;

        const random = (min, max) => Math.random() * (max - min) + min;

        class Particle {
            constructor() {
                this.x = random(0, width);
                this.y = random(0, height);
                this.vx = random(-0.5, 0.5);
                this.vy = random(-0.5, 0.5);
                this.size = random(5, 15);
                this.baseX = this.x;
                this.baseY = this.y;
                this.angle = random(0, Math.PI * 2);
                this.shapeType = Math.floor(random(0, 3));
            }
            update() {
                this.baseX += this.vx;
                this.baseY += this.vy;
                if (this.baseX < 0 || this.baseX > width) this.vx *= -1;
                if (this.baseY < 0 || this.baseY > height) this.vy *= -1;

                let dx = mouse.x - this.baseX;
                let dy = mouse.y - this.baseY;
                let distance = Math.sqrt(dx * dx + dy * dy);
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                let force = (repulsionRadius - distance) / repulsionRadius;

                if (distance < repulsionRadius) {
                    this.x -= forceDirectionX * force * repulsionForce;
                    this.y -= forceDirectionY * force * repulsionForce;
                } else {
                    this.x += (this.baseX - this.x) * 0.05;
                    this.y += (this.baseY - this.y) * 0.05;
                }
                this.angle += 0.01;
            }
            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
                ctx.strokeStyle = 'rgba(255, 0, 60, 0.8)';
                ctx.lineWidth = 2;
                ctx.shadowColor = 'rgba(255, 0, 60, 1)';
                ctx.shadowBlur = 15;
                ctx.beginPath();
                if (this.shapeType === 0) ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                else if (this.shapeType === 1) ctx.rect(-this.size / 2, -this.size / 2, this.size, this.size);
                else if (this.shapeType === 2) {
                    ctx.moveTo(0, -this.size / 2);
                    ctx.lineTo(this.size / 2, this.size / 2);
                    ctx.lineTo(-this.size / 2, this.size / 2);
                    ctx.closePath();
                }
                ctx.stroke();
                ctx.restore();
            }
        }

        function initCanvas() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            particles = [];
            for (let i = 0; i < particleCount; i++) particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', initCanvas);
        window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
        window.addEventListener('mouseout', () => { mouse.x = -100; mouse.y = -100; });

        initCanvas();
        animate();
    }
});