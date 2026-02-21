// assets/js/dashboard.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = 'https://gaoqutcpmklflhsbjhev.supabase.co'; 
const supabaseKey = 'sb_publishable_zUtKpIdr4VPunC2GeQOxBQ_3czW9Q2D';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSession() {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
            console.error("Auth Error:", error.message);
            throw error;
        }

        if (user) {
            updateDashboardUI(user);
        } else {
            console.log("No active user found. Redirecting to auth...");
            window.location.replace("auth.html");
        }
    } catch (err) {
        window.location.replace("auth.html");
    }
}

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
        await supabase.auth.signOut();
        window.location.replace("auth.html");
    });
}

checkSession();