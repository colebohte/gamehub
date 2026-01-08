// Register Service Worker
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("")
            .then(reg => {
                console.log("SW registered:", reg.scope);
            })
            .catch(err => {
                console.error("SW registration failed:", err);
            });
    });
}

// Handle install prompt (Chrome / Edge / Android)
let deferredPrompt = null;

window.addEventListener("beforeinstallprompt", (e) => {
    // Stop the mini-infobar from showing automatically
    e.preventDefault();
    deferredPrompt = e;

    // You can now show your own "Install" button
    console.log("GameHub is installable");
});

// Call this when user clicks your install button
async function installApp() {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    console.log("Install outcome:", outcome);
    deferredPrompt = null;
}

// Optional: detect when app is installed
window.addEventListener("appinstalled", () => {
    console.log("GameHub installed successfully");
});
