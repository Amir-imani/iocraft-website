// assets/js/dashboard.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// --- 1. SUPABASE CONFIGURATION ---
const supabaseUrl = 'https://gaoqutcpmklflhsbjhev.supabase.co'; 
const supabaseKey = 'sb_publishable_zUtKpIdr4VPunC2GeQOxBQ_3czW9Q2D';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (session) {
        updateDashboardUI(session.user);
    } else {
        window.location.href = "auth.html";
    }
}

supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') {
        window.location.href = "auth.html";
    }
});

function updateDashboardUI(user) {
    const nameEl = document.getElementById('sidebarName');
    const avatarEl = document.getElementById('sidebarAvatar');
    const welcomeEl = document.getElementById('welcomeMsg');

    const displayName = user.user_metadata?.full_name || user.email.split('@')[0];
    
    if(nameEl) nameEl.textContent = displayName;
    if(welcomeEl) welcomeEl.textContent = `Welcome Back, ${displayName}.`;
    if(avatarEl) avatarEl.textContent = displayName.charAt(0).toUpperCase();
}

const logoutBtn = document.getElementById('logoutBtn');
if(logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        const { error } = await supabase.auth.signOut();
        if(error) {
            console.error("Logout error", error);
        }
    });
}

checkSession();