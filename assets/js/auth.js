document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SLIDING SWITCH LOGIC (Reverted to original style) ---
    const mainPanel = document.getElementById('mainPanel');
    const toSignup = document.getElementById('toSignup');
    const toLogin = document.getElementById('toLogin');

    toSignup.addEventListener('click', () => {
        mainPanel.classList.add('active');
    });

    toLogin.addEventListener('click', () => {
        mainPanel.classList.remove('active');
    });


    // --- 2. INTERACTIVE BACKGROUND PARTICLES (Brighter & Glowing) ---
    const canvas = document.getElementById('backgroundCanvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let mouse = { x: -100, y: -100 };
    let particles = [];

    // Configuration
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
            
            // --- BRIGHTER STROKE & GLOW ---
            ctx.strokeStyle = 'rgba(255, 0, 60, 0.8)'; // Much brighter red (0.8 opacity)
            ctx.lineWidth = 2;
            ctx.shadowColor = 'rgba(255, 0, 60, 1)'; // Full Neon Glow
            ctx.shadowBlur = 15; // Strength of the glow

            ctx.beginPath();
            if (this.shapeType === 0) {
                ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
            } else if (this.shapeType === 1) {
                ctx.rect(-this.size / 2, -this.size / 2, this.size, this.size);
            } else if (this.shapeType === 2) {
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
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', initCanvas);
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener('mouseout', () => {
        mouse.x = -100;
        mouse.y = -100;
    });

    initCanvas();
    animate();
});