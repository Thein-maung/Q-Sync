// Quantum AI PWA Management
class QuantumPWA {
    constructor() {
        this.deferredPrompt = null;
        this.isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        this.init();
    }

    init() {
        this.setupInstallPrompt();
        this.updatePWAStatus();
        this.setupOfflineDetection();
        console.log('🧠 Quantum AI PWA: Initialized');
    }

    setupInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
            console.log('📱 PWA install prompt available');
        });

        window.addEventListener('appinstalled', () => {
            this.deferredPrompt = null;
            this.hideInstallButton();
            console.log('✅ PWA installed successfully');
            this.showNotification('Quantum AI installed!', 'App is now ready for offline use.');
        });
    }

    showInstallButton() {
        const installBtn = document.getElementById('install-button');
        if (installBtn) {
            installBtn.style.display = 'block';
        }
    }

    hideInstallButton() {
        const installBtn = document.getElementById('install-button');
        if (installBtn) {
            installBtn.style.display = 'none';
        }
    }

    async installPWA() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            const { outcome } = await this.deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                console.log('✅ User accepted PWA installation');
            } else {
                console.log('❌ User dismissed PWA installation');
            }
            
            this.deferredPrompt = null;
            this.hideInstallButton();
        }
    }

    updatePWAStatus() {
        const pwaInfo = document.getElementById('pwa-info');
        const pwaStatus = document.getElementById('pwa-status');

        if (this.isStandalone) {
            if (pwaInfo) pwaInfo.textContent = 'PWA: Running as installed app';
            if (pwaStatus) {
                pwaStatus.textContent = '📱 Running as installed PWA';
                pwaStatus.style.color = 'green';
            }
        } else if (this.deferredPrompt) {
            if (pwaInfo) pwaInfo.textContent = 'PWA: Ready to install';
            if (pwaStatus) {
                pwaStatus.textContent = '📱 PWA available - Install for best experience';
                pwaStatus.style.color = 'blue';
            }
        } else {
            if (pwaInfo) pwaInfo.textContent = 'PWA: Browser mode';
            if (pwaStatus) {
                pwaStatus.textContent = '🌐 Running in browser';
                pwaStatus.style.color = 'gray';
            }
        }
    }

    setupOfflineDetection() {
        window.addEventListener('online', () => {
            this.showNotification('Quantum AI Online', 'Quantum entanglement restored.');
            this.updateConnectionStatus(true);
        });

        window.addEventListener('offline', () => {
            this.showNotification('Quantum AI Offline', 'Working in offline mode. Quantum states preserved.');
            this.updateConnectionStatus(false);
        });
    }

    updateConnectionStatus(online) {
        const status = document.getElementById('status');
        if (status) {
            if (online) {
                if (!status.textContent.includes('ENTANGLED')) {
                    status.textContent = '✅ QUANTUM AI READY (Online)';
                }
            } else {
                status.textContent = '🌐 QUANTUM AI (Offline Mode)';
                status.style.color = 'orange';
            }
        }
    }

    showNotification(title, body) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body: body,
                icon: '/icons/icon-192x192.png',
                badge: '/icons/icon-72x72.png'
            });
        }
    }

    async requestNotificationPermission() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }
        return false;
    }

    // Check storage usage
    async checkStorage() {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            const estimate = await navigator.storage.estimate();
            const usage = (estimate.usage / 1024 / 1024).toFixed(2);
            const quota = (estimate.quota / 1024 / 1024).toFixed(2);
            console.log(`💾 Storage: ${usage}MB / ${quota}MB used`);
            return { usage, quota };
        }
        return null;
    }

    // Clear cached data
    async clearCache() {
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map(name => caches.delete(name)));
            console.log('🗑️ All caches cleared');
            this.showNotification('Cache Cleared', 'Quantum AI cache has been cleared.');
        }
    }
}

// Initialize PWA manager
const quantumPWA = new QuantumPWA();

// Global install function
window.installPWA = () => quantumPWA.installPWA();

// Export for debug console
window.quantumPWA = quantumPWA;

console.log('🧠 Quantum AI PWA manager loaded');