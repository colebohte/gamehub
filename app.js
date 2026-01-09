let deferredPrompt = null;
const installBtn = document.getElementById("installBtn");

// Register service worker
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./service-worker.js");
    });
}

// Listen for install availability
window.addEventListener("beforeinstallprompt", (e) => {
    // Stop Chrome from auto showing anything
    e.preventDefault();

    deferredPrompt = e;

    // Show install button
    if (installBtn) {
        installBtn.hidden = false;
    }
});

// Handle install click
installBtn?.addEventListener("click", async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    console.log("Install result:", outcome);

    deferredPrompt = null;
    installBtn.hidden = true;
});

// Optional: hide button if already installed
window.addEventListener("appinstalled", () => {
    console.log("App installed");
    installBtn.hidden = true;
});

// Modal Handling
const installTrigger = document.getElementById("install-trigger");
const installModal = document.getElementById("install-modal");
const closeModal = document.getElementById("close-modal");

if (installTrigger && installModal && closeModal) {
    installTrigger.addEventListener("click", () => {
        installModal.showModal();
    });

    closeModal.addEventListener("click", () => {
        installModal.close();
    });

    // Close on backdrop click (Install Modal)
    installModal.addEventListener("click", (e) => {
        const rect = installModal.getBoundingClientRect();
        if (
            e.clientX < rect.left ||
            e.clientX > rect.right ||
            e.clientY < rect.top ||
            e.clientY > rect.bottom
        ) {
            installModal.close();
        }
    });
}

// Settings Modal Handling
const settingsTrigger = document.getElementById("settings-trigger");
const settingsModal = document.getElementById("settings-modal");
const closeSettings = document.getElementById("close-settings");
const themeBtns = document.querySelectorAll(".theme-btn");

if (settingsTrigger && settingsModal && closeSettings) {
    settingsTrigger.addEventListener("click", () => {
        settingsModal.showModal();
    });

    closeSettings.addEventListener("click", () => {
        settingsModal.close();
    });

    // Close on backdrop click (Settings Modal)
    settingsModal.addEventListener("click", (e) => {
        const rect = settingsModal.getBoundingClientRect();
        if (
            e.clientX < rect.left ||
            e.clientX > rect.right ||
            e.clientY < rect.top ||
            e.clientY > rect.bottom
        ) {
            settingsModal.close();
        }
    });
}

// Theme Handling
function setTheme(themeName) {
    document.body.classList.remove('theme-light', 'theme-dim', 'theme-terminal');
    if (themeName !== 'terminal') {
        document.body.classList.add(`theme-${themeName}`);
    }
    // Store in cookie for 1 year
    document.cookie = `gamehub-theme=${themeName}; path=/; max-age=31536000`;
    // Fallback: Also store in localStorage (cookies don't work on file://)
    localStorage.setItem('gamehub-theme', themeName);
}

// Font Handling
const fontBtns = document.querySelectorAll(".font-btn");
function setFont(fontName) {
    // fontName maps to vars: vt323, roboto, ibm
    document.body.style.setProperty('--font-current', `var(--font-${fontName})`);

    // Store in cookie for 1 year
    document.cookie = `gamehub-font=${fontName}; path=/; max-age=31536000`;
    // Fallback
    localStorage.setItem('gamehub-font', fontName);
}

// Bind Buttons
themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const theme = btn.getAttribute('data-theme');
        setTheme(theme);
    });
});

fontBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const font = btn.getAttribute('data-font');
        setFont(font);
    });
});

// Helper to get cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Load Saved Theme & Font
const savedTheme = getCookie('gamehub-theme') || localStorage.getItem('gamehub-theme');
if (savedTheme) {
    setTheme(savedTheme);
}

const savedFont = getCookie('gamehub-font') || localStorage.getItem('gamehub-font');
if (savedFont) {
    setFont(savedFont);
}
