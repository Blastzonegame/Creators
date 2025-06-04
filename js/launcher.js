class GameLauncher {
    constructor() {
        this.gameConfigs = {
            'battle-royale': {
                name: 'Blastzone Battle Royale',
                modes: ['solo', 'duos', 'squads'],
                maxPlayers: 100,
                startingHealth: 100,
                buildingEnabled: true
            },
            'tycoon': {
                name: 'Mega Tycoon',
                startingMoney: 500,
                autoSave: true,
                upgrades: ['miners', 'factories', 'automation']
            },
            'obstacle': {
                name: 'Speed Runner',
                difficulties: ['easy', 'medium', 'hard'],
                checkpoints: true,
                timeTrials: true
            }
        };
    }

    async launchGame(gameType, options = {}) {
        try {
            // Show loading screen
            document.getElementById('loadingScreen').style.display = 'flex';
            
            // Initialize game configuration
            const config = {
                ...this.gameConfigs[gameType],
                ...options
            };

            // Save game session
            sessionStorage.setItem('gameSession', JSON.stringify({
                type: gameType,
                config: config,
                timestamp: Date.now()
            }));

            // Redirect to game
            setTimeout(() => {
                window.location.href = 'game.html';
            }, 1500);

        } catch (error) {
            console.error('Failed to launch game:', error);
            alert('Failed to launch game. Please try again.');
        }
    }
}

// Initialize launcher
const launcher = new GameLauncher();
function launchGame(type, options) {
    launcher.launchGame(type, options);
}