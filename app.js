let deferredPrompt = null;
const installBtn = document.getElementById("installBtn");

// Register service worker
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/service-worker.js");
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
