class GameLoader {
    constructor() {
        this.loadingScreen = document.getElementById('loadingScreen');
        this.progressBar = document.querySelector('.progress-fill');
        this.loadingTips = document.querySelector('.loading-tips');
        this.progress = 0;
        
        this.tips = [
            "Use WASD to move around",
            "Press SPACE to jump",
            "Press 1-4 to switch weapons",
            "Collect resources to build",
            "Stay in the safe zone!"
        ];
    }

    async init() {
        try {
            await this.showLoadingScreen();
            await this.loadResources();
            await this.initializeGame();
            this.hideLoadingScreen();
        } catch (error) {
            console.error('Failed to load game:', error);
            this.showError();
        }
    }

    async showLoadingScreen() {
        this.loadingScreen.style.display = 'flex';
        this.updateTip();
        setInterval(() => this.updateTip(), 3000);
    }

    updateTip() {
        const tip = this.tips[Math.floor(Math.random() * this.tips.length)];
        this.loadingTips.textContent = `Tip: ${tip}`;
    }

    async loadResources() {
        const steps = [25, 50, 75, 100];
        for (const step of steps) {
            await new Promise(resolve => setTimeout(resolve, 500));
            this.updateProgress(step);
        }
    }

    updateProgress(value) {
        this.progress = value;
        this.progressBar.style.width = `${value}%`;
    }

    async initializeGame() {
        await new Promise(resolve => setTimeout(resolve, 1000));
        window.game = new Game3D();
    }

    hideLoadingScreen() {
        setTimeout(() => {
            this.loadingScreen.style.opacity = '0';
            setTimeout(() => {
                this.loadingScreen.style.display = 'none';
                document.getElementById('gameContainer').style.display = 'block';
            }, 500);
        }, 500);
    }

    showError() {
        this.loadingTips.innerHTML = `
            <div style="color: #ff3c00">
                Failed to load game. Please try refreshing the page.
                <button onclick="window.location.reload()" style="margin-top: 1rem">
                    Retry
                </button>
            </div>
        `;
    }
}