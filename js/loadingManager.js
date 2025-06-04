class LoadingManager {
    constructor() {
        this.resources = {
            textures: [
                { name: 'ground', path: 'assets/textures/ground.jpg' },
                { name: 'sky', path: 'assets/textures/sky.jpg' }
            ],
            models: [
                { name: 'coin', path: 'assets/models/coin.glb' },
                { name: 'player', path: 'assets/models/player.glb' }
            ],
            sounds: [
                { name: 'collect', path: 'assets/sounds/collect.mp3' },
                { name: 'jump', path: 'assets/sounds/jump.mp3' }
            ]
        };

        this.loaded = {
            textures: new Map(),
            models: new Map(),
            sounds: new Map()
        };

        this.progressBar = document.querySelector('.progress-fill');
        this.loadingTips = document.querySelector('.loading-tips');
        this.totalItems = Object.values(this.resources).flat().length;
        this.loadedItems = 0;
    }

    async load() {
        const textureLoader = new THREE.TextureLoader();
        const modelLoader = new THREE.GLTFLoader();
        const audioLoader = new THREE.AudioLoader();

        try {
            // Load textures
            for (const texture of this.resources.textures) {
                const loadedTexture = await new Promise((resolve, reject) => {
                    textureLoader.load(
                        texture.path,
                        resolve,
                        this.onProgress.bind(this),
                        reject
                    );
                });
                this.loaded.textures.set(texture.name, loadedTexture);
            }

            // Load models
            for (const model of this.resources.models) {
                const loadedModel = await new Promise((resolve, reject) => {
                    modelLoader.load(
                        model.path,
                        resolve,
                        this.onProgress.bind(this),
                        reject
                    );
                });
                this.loaded.models.set(model.name, loadedModel);
            }

            // Load sounds
            for (const sound of this.resources.sounds) {
                const loadedSound = await new Promise((resolve, reject) => {
                    audioLoader.load(
                        sound.path,
                        resolve,
                        this.onProgress.bind(this),
                        reject
                    );
                });
                this.loaded.sounds.set(sound.name, loadedSound);
            }

            return this.loaded;
        } catch (error) {
            console.error('Error loading resources:', error);
            throw error;
        }
    }

    onProgress() {
        this.loadedItems++;
        const progress = (this.loadedItems / this.totalItems) * 100;
        this.updateProgress(progress);
        this.updateTip();
    }

    updateProgress(value) {
        this.progressBar.style.width = `${value}%`;
    }

    updateTip() {
        const tips = [
            "Use WASD to move around",
            "Press SPACE to jump",
            "Collect coins to increase your score",
            "Watch out for obstacles!",
            "Press ESC to open the menu"
        ];
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        this.loadingTips.textContent = `Tip: ${randomTip}`;
    }
}