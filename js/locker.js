class CharacterLocker {
    constructor() {
        this.cosmetics = {
            outfits: [
                { id: 'default', name: 'Scout', rarity: 'uncommon', price: 0 },
                { id: 'ninja', name: 'Shadow Ninja', rarity: 'epic', price: 2000 },
                { id: 'knight', name: 'Royal Knight', rarity: 'legendary', price: 2800 },
                { id: 'agent', name: 'Secret Agent', rarity: 'rare', price: 1200 }
            ],
            backblings: [
                { id: 'shield', name: 'Battle Shield', rarity: 'epic', price: 1000 },
                { id: 'cape', name: 'Royal Cape', rarity: 'legendary', price: 1500 }
            ],
            pickaxes: [
                { id: 'default_axe', name: 'Basic Axe', rarity: 'uncommon', price: 0 },
                { id: 'rainbow_smasher', name: 'Rainbow Smasher', rarity: 'epic', price: 1200 }
            ],
            emotes: [
                { id: 'dance1', name: 'Victory Dance', rarity: 'rare', price: 500 },
                { id: 'flip', name: 'Backflip', rarity: 'epic', price: 800 }
            ]
        };

        // Add more character customization options
        this.styles = {
            outfits: {
                'ninja': [
                    { id: 'default', name: 'Default Style' },
                    { id: 'golden', name: 'Golden Style', requirement: 'level_100' },
                    { id: 'shadow', name: 'Shadow Style', requirement: 'battle_pass' }
                ],
                'knight': [
                    { id: 'default', name: 'Default Style' },
                    { id: 'corrupted', name: 'Corrupted', requirement: 'progressive' }
                ]
            },
            colors: {
                primary: '#ffffff',
                secondary: '#19d0ff',
                accent: '#9d4dff'
            }
        };

        this.equipped = {
            outfit: 'default',
            backbling: null,
            pickaxe: 'default_axe',
            emote: 'dance1'
        };

        this.progression = {
            level: 1,
            xp: 0,
            battlePass: false,
            unlockedStyles: [],
            achievements: []
        };

        // Add emote wheel configuration
        this.emoteWheel = {
            slots: [
                { index: 0, emoteId: 'dance1' },
                { index: 1, emoteId: null },
                { index: 2, emoteId: null },
                { index: 3, emoteId: null },
                { index: 4, emoteId: null },
                { index: 5, emoteId: 'flip' }
            ]
        };

        this.initializePreview();
        this.loadUserCosmetics();
        this.loadProgression();
        this.renderLockerGrid('outfits');
    }

    initializePreview() {
        const canvas = document.getElementById('characterPreview');
        // Initialize Three.js scene for character preview
        // (Add Three.js initialization code here)
    }

    loadUserCosmetics() {
        const savedCosmetics = localStorage.getItem('userCosmetics');
        this.userCosmetics = savedCosmetics ? JSON.parse(savedCosmetics) : {
            owned: ['default', 'default_axe', 'dance1'],
            equipped: this.equipped
        };
    }

    loadProgression() {
        const savedProgress = localStorage.getItem('userProgress');
        if (savedProgress) {
            this.progression = JSON.parse(savedProgress);
        }
    }

    renderLockerGrid(category) {
        const grid = document.getElementById('outfitsGrid');
        grid.innerHTML = this.cosmetics[category].map(item => `
            <div class="cosmetic-item ${this.userCosmetics.owned.includes(item.id) ? 'owned' : ''}"
                 data-rarity="${item.rarity}"
                 onclick="locker.equipItem('${category}', '${item.id}')">
                <img src="assets/cosmetics/${category}/${item.id}.png" alt="${item.name}">
                <div class="cosmetic-info">
                    <div class="cosmetic-name">${item.name}</div>
                    ${item.price > 0 ? `<div class="cosmetic-price">🪙 ${item.price}</div>` : ''}
                </div>
            </div>
        `).join('');
    }

    equipItem(category, itemId) {
        if (!this.userCosmetics.owned.includes(itemId)) {
            this.promptPurchase(category, itemId);
            return;
        }

        this.userCosmetics.equipped[category] = itemId;
        this.saveUserCosmetics();
        this.updateCharacterPreview();
    }

    promptPurchase(category, itemId) {
        const item = this.cosmetics[category].find(i => i.id === itemId);
        if (confirm(`Purchase ${item.name} for ${item.price} BZ?`)) {
            // Add purchase logic here
            this.userCosmetics.owned.push(itemId);
            this.equipItem(category, itemId);
        }
    }

    saveUserCosmetics() {
        localStorage.setItem('userCosmetics', JSON.stringify(this.userCosmetics));
    }

    saveProgression() {
        localStorage.setItem('userProgress', JSON.stringify(this.progression));
    }

    updateCharacterPreview() {
        const canvas = document.getElementById('characterPreview');
        const ctx = canvas.getContext('webgl2');
        
        // Initialize Three.js scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

        // Load character model based on equipped outfit
        const outfit = this.cosmetics.outfits.find(o => o.id === this.equipped.outfit);
        const modelPath = `assets/models/${outfit.id}.glb`;

        const loader = new THREE.GLTFLoader();
        loader.load(modelPath, (gltf) => {
            const model = gltf.scene;
            
            // Apply custom colors
            model.traverse((child) => {
                if (child.isMesh) {
                    child.material.color.setStyle(this.styles.colors.primary);
                }
            });

            // Add backbling if equipped
            if (this.equipped.backbling) {
                const backblingPath = `assets/models/backblings/${this.equipped.backbling}.glb`;
                loader.load(backblingPath, (backblingGltf) => {
                    const backbling = backblingGltf.scene;
                    model.add(backbling);
                });
            }

            scene.add(model);
        });

        // Add lighting
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(0, 10, 10);
        scene.add(light);
        scene.add(new THREE.AmbientLight(0x404040));

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            if (this.isEmoting) {
                // Play emote animation
                // ...animation code...
            }
            renderer.render(scene, camera);
        };
        animate();
    }

    setEmoteSlot(slotIndex, emoteId) {
        if (!this.userCosmetics.owned.includes(emoteId)) {
            this.promptPurchase('emotes', emoteId);
            return;
        }
        this.emoteWheel.slots[slotIndex].emoteId = emoteId;
        this.saveUserCosmetics();
    }

    unlockStyle(outfitId, styleId) {
        const outfit = this.styles.outfits[outfitId];
        const style = outfit.find(s => s.id === styleId);
        
        if (style.requirement === 'level_100' && this.progression.level < 100) {
            return false;
        }
        
        if (style.requirement === 'battle_pass' && !this.progression.battlePass) {
            return false;
        }
        
        if (style.requirement === 'progressive') {
            this.progression.unlockedStyles.push(`${outfitId}_${styleId}`);
            this.saveProgression();
        }
        
        return true;
    }

    renderStyleOptions(outfitId) {
        const styles = this.styles.outfits[outfitId] || [];
        return styles.map(style => `
            <div class="style-option ${this.isStyleUnlocked(outfitId, style.id) ? 'unlocked' : 'locked'}"
                 onclick="locker.applyStyle('${outfitId}', '${style.id}')">
                <img src="assets/styles/${outfitId}/${style.id}.png" alt="${style.name}">
                <div class="style-name">${style.name}</div>
                ${this.getStyleRequirementText(style)}
            </div>
        `).join('');
    }

    isStyleUnlocked(outfitId, styleId) {
        const style = this.styles.outfits[outfitId]?.find(s => s.id === styleId);
        if (!style) return false;

        if (style.requirement === 'level_100') {
            return this.progression.level >= 100;
        }
        if (style.requirement === 'battle_pass') {
            return this.progression.battlePass;
        }
        if (style.requirement === 'progressive') {
            return this.progression.unlockedStyles.includes(`${outfitId}_${styleId}`);
        }
        return true;
    }
}

// Initialize locker when page loads
const locker = new CharacterLocker();

// Tab switching
document.querySelectorAll('.locker-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelector('.locker-tab.active').classList.remove('active');
        tab.classList.add('active');
        locker.renderLockerGrid(tab.dataset.tab);
    });
});