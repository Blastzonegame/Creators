class BlastzoneGame {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas'), antialias: true });
        
        // Game state
        this.gameMode = 'battle_royale'; // or 'build_mode', 'tycoon', 'obstacle_course'
        this.players = new Map();
        this.buildables = new Map();
        this.inventory = {
            materials: {
                wood: 0,
                brick: 0,
                metal: 0
            },
            weapons: [],
            coins: 0,
            robux: 0
        };

        // Game mechanics
        this.buildMode = false;
        this.isEmoting = false;
        this.stormRadius = 1000;
        this.stormDamage = 1;
        this.gravity = -9.8;

        this.init();
    }

    async init() {
        await this.loadAssets();
        this.setupWorld();
        this.setupPlayer();
        this.setupControls();
        this.startGameLoop();
    }

    setupWorld() {
        // Create terrain with Roblox-style blocks
        const terrainGeometry = new THREE.BoxGeometry(1, 1, 1);
        const terrainMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
        
        // Generate random terrain
        for(let x = -50; x < 50; x += 2) {
            for(let z = -50; z < 50; z += 2) {
                const height = Math.sin(x * 0.1) * Math.cos(z * 0.1) * 5;
                const block = new THREE.Mesh(terrainGeometry, terrainMaterial);
                block.position.set(x, height, z);
                this.scene.add(block);
            }
        }

        // Add Fortnite-style storm circle
        const stormGeometry = new THREE.RingGeometry(0, this.stormRadius, 32);
        const stormMaterial = new THREE.MeshBasicMaterial({
            color: 0x7B42F5,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        this.stormCircle = new THREE.Mesh(stormGeometry, stormMaterial);
        this.stormCircle.rotation.x = -Math.PI / 2;
        this.scene.add(this.stormCircle);
    }

    setupPlayer() {
        const playerGeometry = new THREE.BoxGeometry(1, 2, 1);
        const playerMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
        this.player = new THREE.Mesh(playerGeometry, playerMaterial);
        this.player.position.y = 2;
        this.scene.add(this.player);
        
        // Player stats
        this.playerStats = {
            health: 100,
            shield: 0,
            speed: 10,
            jumpForce: 15,
            isJumping: false
        };
    }

    update() {
        // Update storm
        this.stormRadius = Math.max(this.stormRadius - 0.1, 100);
        this.stormCircle.scale.set(this.stormRadius, this.stormRadius, 1);

        // Check if player is in storm
        const distanceFromCenter = new THREE.Vector2(
            this.player.position.x,
            this.player.position.z
        ).length();

        if (distanceFromCenter > this.stormRadius) {
            this.playerStats.health -= this.stormDamage * 0.016; // 60fps damage tick
        }

        // Update UI
        this.updateUI();
    }

    build(type) {
        if (!this.buildMode || this.inventory.materials[type] < 10) return;

        const buildGeometry = new THREE.BoxGeometry(2, 2, 0.2);
        const buildMaterial = new THREE.MeshPhongMaterial({
            color: type === 'wood' ? 0x8B4513 : type === 'brick' ? 0xA0522D : 0x708090
        });

        const building = new THREE.Mesh(buildGeometry, buildMaterial);
        building.position.copy(this.player.position);
        building.position.y += 1;
        building.lookAt(this.camera.position);

        this.scene.add(building);
        this.buildables.set(building.id, {
            type: type,
            health: type === 'wood' ? 100 : type === 'brick' ? 150 : 200
        });

        this.inventory.materials[type] -= 10;
    }

    emote(type) {
        if (this.isEmoting) return;
        this.isEmoting = true;

        // Play emote animation
        setTimeout(() => {
            this.isEmoting = false;
        }, 2000);
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.game = new BlastzoneGame();
});