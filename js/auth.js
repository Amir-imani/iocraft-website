// --- 1. SUPABASE IMPORTS ---
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// --- 2. SUPABASE CONFIGURATION ---
// آدرس URL و کلید Anon خودت رو از پنل سوپابیس اینجا جایگذاری کن
const supabaseUrl = 'https://gaoqutcpmklflhsbjhev.supabase.co'; 
const supabaseKey = 'sb_publishable_zUtKpIdr4VPunC2GeQOxBQ_3czW9Q2D';
const supabase = createClient(supabaseUrl, supabaseKey);

// --- 3. AUTHENTICATION LOGIC ---

// A. SIGN UP (ثبت نام با ایمیل)
const signupForm = document.getElementById('signupForm');
if(signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const name = document.getElementById('signupName').value;

        // ارسال درخواست ثبت نام به سوپابیس
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: name, // ذخیره اسم مهندس در دیتابیس
                }
            }
        });

        if (error) {
            alert("Error: " + error.message);
        } else {
            alert(`Welcome Engineer ${name}! Registration Successful.`);
            console.log("Registered:", data.user);
            window.location.href = "dashboard.html"; 
        }
    });
}

// B. LOGIN (ورود با ایمیل)
const loginForm = document.getElementById('loginForm');
if(loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        // ارسال درخواست ورود به سوپابیس
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            alert("Access Denied: " + error.message);
        } else {
            alert("Access Granted. System Initialized.");
            console.log("Logged in:", data.user);
            window.location.href = "dashboard.html";
        }
    });
}

// C. GOOGLE LOGIN (ورود با گوگل)
const googleBtn = document.getElementById('googleLoginBtn');
if(googleBtn) {
    googleBtn.addEventListener('click', async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
        });
        
        if (error) {
            alert("Google Auth Failed: " + error.message);
        }
    });
}



// --- 4. UI ANIMATIONS (The Particles & Switcher) ---


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