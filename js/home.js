class HomePage {
    constructor() {
        this.carousel = {
            current: 0,
            slides: document.querySelectorAll('.carousel-slide'),
            interval: null
        };
        
        this.quests = {
            daily: [],
            refreshTime: new Date()
        };
        
        this.gameData = {
            playerCount: {
                'battle-royale': 12345,
                'team-match': 8421
            },
            modes: {
                'battle-royale': {
                    name: 'Battle Royale',
                    icon: '⚔️',
                    requiresPass: false
                },
                'team-match': {
                    name: 'Team Match',
                    icon: '👥',
                    requiresPass: false
                }
            }
        };

        this.initializeHome();
    }

    initializeHome() {
        this.initializeCarousel();
        this.initializeQuests();
        this.initializeGameModes();
        this.initializeFriends();
        this.updateTimers();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Game mode buttons
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.currentTarget.dataset.mode;
                this.launchGame(mode);
            });
        });

        // Play now button
        document.querySelector('.play-now-btn')?.addEventListener('click', () => {
            this.launchGame('battle-royale');
        });
    }

    launchGame(mode) {
        const gameConfig = this.gameData.modes[mode];
        if (!gameConfig) return;

        if (gameConfig.requiresPass && !this.hasActivePass()) {
            this.showPassRequired();
            return;
        }

        // Show loading screen
        this.showGameLoading(mode);

        // Simulate game launch
        setTimeout(() => {
            window.location.href = `game.html?mode=${mode}`;
        }, 1500);
    }

    showGameLoading(mode) {
        const loader = document.createElement('div');
        loader.className = 'game-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-spinner"></div>
                <h2>Loading ${this.gameData.modes[mode].name}</h2>
                <p>Preparing your battle...</p>
            </div>
        `;
        document.body.appendChild(loader);
    }

    initializeCarousel() {
        this.startCarousel();
        this.initializeCarouselControls();
    }

    startCarousel() {
        this.carousel.interval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }

    nextSlide() {
        this.carousel.current = (this.carousel.current + 1) % this.carousel.slides.length;
        this.updateCarousel();
    }

    updateCarousel() {
        this.carousel.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.carousel.current);
        });
    }

    initializeQuests() {
        // Initialize daily quests
        this.quests.daily = [
            {
                name: 'Win a Battle Royale match',
                progress: 0,
                target: 1,
                reward: 50
            },
            {
                name: 'Play 3 Team Matches',
                progress: 0,
                target: 3,
                reward: 30
            }
        ];
        
        this.renderQuests();
    }

    updatePlayerCounts() {
        Object.entries(this.gameData.playerCount).forEach(([mode, count]) => {
            const countElement = document.querySelector(`[data-mode="${mode}"] .player-count`);
            if (countElement) {
                countElement.textContent = count.toLocaleString();
            }
        });
    }

    renderQuests() {
        const questList = document.querySelector('.quest-list');
        if (!questList) return;

        questList.innerHTML = this.quests.daily.map(quest => `
            <div class="quest-item" data-quest-id="${quest.id}">
                <div class="quest-info">
                    <div class="quest-name">${quest.name}</div>
                    <div class="quest-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${(quest.progress / quest.target) * 100}%"></div>
                        </div>
                        <span class="progress-text">${quest.progress}/${quest.target}</span>
                    </div>
                </div>
                <div class="quest-reward">
                    <div class="blastbux-icon small"></div>
                    <span>${quest.reward}</span>
                </div>
            </div>
        `).join('');
    }

    updateTimers() {
        setInterval(() => {
            this.updateQuestTimer();
            this.updateFreePlayTimer();
        }, 1000);
    }

    updateQuestTimer() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setHours(24, 0, 0, 0);
        const timeLeft = tomorrow - now;

        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        const timer = document.querySelector('.refresh-timer');
        if (timer) {
            timer.textContent = `Refreshes in ${hours}:${minutes}:${seconds}`;
        }
    }
}

// Initialize home page when document is ready
document.addEventListener('DOMContentLoaded', () => {
    window.homePage = new HomePage();
});