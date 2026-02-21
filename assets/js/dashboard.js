// assets/js/dashboard.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// --- 1. SUPABASE CONFIGURATION ---
// همون URL و Key که تو auth.js گذاشتی رو اینجا هم بذار
const supabaseUrl = 'https://gaoqutcpmklflhsbjhev.supabase.co'; 
const supabaseKey = 'sb_publishable_zUtKpIdr4VPunC2GeQOxBQ_3czW9Q2D';
const supabase = createClient(supabaseUrl, supabaseKey);

// 1. بررسی وضعیت لاگین (Security Check)
async function checkSession() {
    // گرفتن اطلاعات نشست (Session) فعلی از سوپابیس
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (session) {
        // کاربر لاگین است -> اطلاعاتش رو نشون بده
        updateDashboardUI(session.user);
    } else {
        // کاربر لاگین نیست -> برگردونش به صفحه لاگین
        window.location.href = "auth.html";
    }
}

// گوش دادن به تغییرات وضعیت (مثل زمانی که کاربر دکمه خروج رو میزنه)
supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT' || !session) {
        window.location.href = "auth.html";
    }
});

// 2. آپدیت کردن اسم و عکس کاربر
function updateDashboardUI(user) {
    const nameEl = document.getElementById('sidebarName');
    const avatarEl = document.getElementById('sidebarAvatar');
    const welcomeEl = document.getElementById('welcomeMsg');

    // تو سوپابیس، اسمی که موقع ثبت‌نام گرفتیم تو user_metadata ذخیره می‌شه
    const displayName = user.user_metadata?.full_name || user.email.split('@')[0];
    
    if(nameEl) nameEl.textContent = displayName;
    if(welcomeEl) welcomeEl.textContent = `Welcome Back, ${displayName}.`;
    if(avatarEl) avatarEl.textContent = displayName.charAt(0).toUpperCase();
}

// 3. دکمه خروج
const logoutBtn = document.getElementById('logoutBtn');
if(logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        const { error } = await supabase.auth.signOut();
        if(error) {
            console.error("Logout error", error);
        }
        // نیازی به ریدایرکت دستی نیست، onAuthStateChange خودش هندل می‌کنه
    });
}

// اجرای چک کردن سشن به محض لود شدن فایل
checkSession();