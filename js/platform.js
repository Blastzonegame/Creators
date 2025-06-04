class PlatformManager {
    constructor() {
        this.currentSection = 'home';
        this.sections = ['home', 'games', 'locker', 'store', 'battlepass', 'creator'];
        this.userState = {
            level: 1,
            xp: 0,
            xpNeeded: 1000,
            blastbux: 1000,
            freeLunches: 3, // Daily free features count
            lastFreeLunchDate: null,
            battlePass: {
                owned: false,
                level: 1,
                rewards: new Set()
            },
            inventory: {
                skins: ['default'],
                emotes: ['wave'],
                items: [],
                freebies: [] // Store claimed free items
            }
        };

        this.freeFeatures = {
            dailySpins: {
                enabled: true,
                cooldown: 24 * 60 * 60 * 1000, // 24 hours
                rewards: [
                    { type: 'blastbux', amount: 50, weight: 70 },
                    { type: 'xp', amount: 100, weight: 20 },
                    { type: 'emote', id: 'basic_dance', weight: 10 }
                ]
            },
            basicGames: [
                'practice_range',
                'team_deathmatch',
                'capture_point'
            ],
            starterPack: {
                skins: ['recruit', 'trainee'],
                emotes: ['wave', 'dance'],
                items: ['basic_pickaxe', 'starter_glider']
            }
        };

        this.initializeModules();
        this.setupEventListeners();
        this.loadInitialContent();
    }

    initializeModules() {
        this.navigationManager = new NavigationManager();
        this.challengeManager = new ChallengeManager();
        this.battlePassManager = new BattlePassManager();
        this.currencyManager = new CurrencyManager();
        this.socialManager = new SocialManager();
        this.notificationManager = new NotificationManager();
        this.achievementManager = new AchievementManager();
        this.leaderboardManager = new LeaderboardManager();
        this.matchManager = new MatchManager(); // Add this line
        this.shopManager = new ShopManager();
    }

    setupEventListeners() {
        // Navigation events
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.navigationManager.navigate(e.currentTarget.dataset.page);
            });
        });

        // Play button events
        document.querySelectorAll('.play-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.launchGame(e.currentTarget.closest('.mode-card'));
            });
        });
    }

    loadInitialContent() {
        this.challengeManager.loadDailyChallenges();
        this.battlePassManager.loadProgress();
        this.socialManager.loadFriendsList();
        this.currencyManager.updateDisplay();
    }

    launchGame(modeCard) {
        const modeName = modeCard.querySelector('h3').textContent;
        console.log(`Launching game mode: ${modeName}`);
        // Add game launch logic here
    }

    initializeCurrency() {
        // Update currency display when amount changes
        this.currencyManager.onBalanceChange = (newAmount) => {
            const amountElement = document.querySelector('.currency-amount');
            amountElement.textContent = newAmount.toLocaleString();
            amountElement.classList.add('updated');z
            setTimeout(() => amountElement.classList.remove('updated'), 300);
        };
    }

    initializePlatform() {
        // Handle navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                this.switchSection(section);
            });
        });

        // Initialize featured carousel
        this.initializeCarousel();

        // Load user data
        this.loadUserData();

        // Initialize animations
        this.initializeBackgroundEffects();
        
        // Start XP system
        this.startXPTimer();
        
        // Initialize notifications
        this.initializeNotifications();
    }

    initializeCurrencySection() {
        document.querySelectorAll('.buy-package').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const packageCard = e.target.closest('.package-card');
                if (packageCard) {
                    const packageType = packageCard.classList[1];
                    this.currencyManager.purchasePackage(packageType);
                }
            });
        });

        // Check daily rewards
        document.querySelector('.action-btn.rewards').addEventListener('click', () => {
            this.currencyManager.checkDailyReward();
        });
    }

    switchSection(sectionId) {
        // Update navigation
        document.querySelector('.nav-item.active').classList.remove('active');
        document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');

        // Load section content
        this.loadSectionContent(sectionId);
    }

    loadSectionContent(sectionId) {
        // Dynamic content loading based on section
        const contentArea = document.querySelector('.main-content');
        
        // Show loading state
        contentArea.innerHTML = '<div class="loading-spinner"></div>';

        // Simulate content loading
        setTimeout(() => {
            fetch(`sections/${sectionId}.html`)
                .then(response => response.text())
                .then(html => {
                    contentArea.innerHTML = html;
                    this.initializeSectionFeatures(sectionId);
                });
        }, 500);
    }

    initializeSectionFeatures(sectionId) {
        switch(sectionId) {
            case 'games':
                new GamesBrowser().initialize();
                break;
            case 'locker':
                new CharacterLocker().initialize();
                break;
            case 'store':
                new ItemShop().initialize();
                break;
            case 'battlepass':
                new BattlePass().initialize();
                break;
        }
    }

    initializeCarousel() {
        // Featured content carousel implementation
    }

    loadUserData() {
        // Load user profile, currency, etc.
    }

    initializeBackgroundEffects() {
        const scene = document.querySelector('.background-scene');
        
        // Create floating particles
        for(let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            particle.style.left = `${Math.random() * 100}vw`;
            particle.style.animationDuration = `${Math.random() * 3 + 2}s`;
            particle.style.animationDelay = `${Math.random() * 2}s`;
            scene.appendChild(particle);
        }

        // Add rift effects
        setInterval(() => {
            if(Math.random() > 0.7) {
                this.createRiftEffect();
            }
        }, 5000);
    }

    createRiftEffect() {
        const rift = document.createElement('div');
        rift.className = 'rift-effect';
        rift.style.left = `${Math.random() * 100}vw`;
        rift.style.top = `${Math.random() * 100}vh`;
        document.querySelector('.background-scene').appendChild(rift);
        
        setTimeout(() => rift.remove(), 4000);
    }

    startXPTimer() {
        setInterval(() => {
            this.addXP(10);
        }, 60000); // Add XP every minute
    }

    addXP(amount) {
        this.userState.xp += amount;
        if(this.userState.xp >= this.userState.xpNeeded) {
            this.levelUp();
        }
        this.updateXPDisplay();
        this.showXPNotification(amount);
    }

    levelUp() {
        this.userState.level++;
        this.userState.xp -= this.userState.xpNeeded;
        this.userState.xpNeeded = Math.floor(this.userState.xpNeeded * 1.2);
        this.showLevelUpAnimation();
    }

    showLevelUpAnimation() {
        const levelUp = document.createElement('div');
        levelUp.className = 'level-up-animation';
        levelUp.innerHTML = `
            <h2>LEVEL UP!</h2>
            <div class="level-number">${this.userState.level}</div>
            <div class="rewards-preview">
                ${this.getLevelUpRewards()}
            </div>
        `;
        document.body.appendChild(levelUp);
        
        setTimeout(() => levelUp.remove(), 3000);
    }

    initializeNotifications() {
        this.notifications = document.createElement('div');
        this.notifications.className = 'notification-container';
        document.body.appendChild(this.notifications);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = message;
        this.notifications.appendChild(notification);
        
        setTimeout(() => notification.remove(), 3000);
    }

    updateXPDisplay() {
        const xpBar = document.querySelector('.xp-bar-fill');
        const percentage = (this.userState.xp / this.userState.xpNeeded) * 100;
        xpBar.style.width = `${percentage}%`;
        
        document.querySelector('.level-display').textContent = this.userState.level;
        document.querySelector('.xp-display').textContent = 
            `${this.userState.xp}/${this.userState.xpNeeded} XP`;
    }

    initializeFreeFeatures() {
        // Reset free lunches daily
        const today = new Date().toDateString();
        if (this.userState.lastFreeLunchDate !== today) {
            this.userState.freeLunches = 3;
            this.userState.lastFreeLunchDate = today;
            this.saveUserState();
        }

        // Add free feature buttons
        this.addFreeFeatureButtons();
    }

    addFreeFeatureButtons() {
        const freeSection = document.createElement('div');
        freeSection.className = 'free-features-section';
        freeSection.innerHTML = `
            <h3>Free Features</h3>
            <div class="free-features-grid">
                <button class="feature-btn" data-feature="daily-spin">
                    🎲 Daily Spin
                    <span class="cooldown-timer"></span>
                </button>
                <button class="feature-btn" data-feature="practice">
                    🎯 Practice Range
                </button>
                <button class="feature-btn" data-feature="team-match">
                    ⚔️ Team Match
                </button>
            </div>
            <div class="free-lunches">
                Free Plays Left Today: ${this.userState.freeLunches}
            </div>
        `;

        document.querySelector('.main-content').prepend(freeSection);
        this.initializeFreeFeatureListeners();
    }

    initializeFreeFeatureListeners() {
        document.querySelectorAll('.feature-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const feature = e.target.dataset.feature;
                if (this.canUseFreeFeature(feature)) {
                    this.useFreeFeature(feature);
                } else {
                    this.showFeatureCooldown(feature);
                }
            });
        });
    }

    canUseFreeFeature(feature) {
        if (this.userState.freeLunches <= 0) {
            return false;
        }

        if (feature === 'daily-spin') {
            const lastSpin = localStorage.getItem('lastDailySpin');
            if (lastSpin) {
                const timeLeft = Date.now() - parseInt(lastSpin);
                return timeLeft >= this.freeFeatures.dailySpins.cooldown;
            }
        }

        return true;
    }

    useFreeFeature(feature) {
        switch (feature) {
            case 'daily-spin':
                this.executeDailySpin();
                break;
            case 'practice':
            case 'team-match':
                this.startFreeGame(feature);
                break;
        }

        this.userState.freeLunches--;
        this.updateFreeLunchDisplay();
        this.saveUserState();
    }

    executeDailySpin() {
        const rewards = this.freeFeatures.dailySpins.rewards;
        const totalWeight = rewards.reduce((sum, r) => sum + r.weight, 0);
        let random = Math.random() * totalWeight;
        
        let reward;
        for (const r of rewards) {
            random -= r.weight;
            if (random <= 0) {
                reward = r;
                break;
            }
        }

        this.grantReward(reward);
        localStorage.setItem('lastDailySpin', Date.now().toString());
    }

    grantReward(reward) {
        switch (reward.type) {
            case 'blastbux':
                this.currencyManager.addBlastbux(reward.amount, 'Daily Spin');
                break;
            case 'xp':
                this.addXP(reward.amount);
                break;
            case 'emote':
                this.userState.inventory.freebies.push(reward.id);
                break;
        }

        this.showRewardNotification(reward);
    }

    showRewardNotification(reward) {
        this.showNotification(`
            <div class="reward-notification">
                <h3>🎉 You Won!</h3>
                <div class="reward-content">
                    ${this.getRewardDisplay(reward)}
                </div>
            </div>
        `, 'reward');
    }

    // Example usage in your platform:
    showGameInvite(fromPlayer) {
        this.notificationManager.addNotification({
            type: 'info',
            title: 'Game Invite',
            message: `${fromPlayer} invited you to join their game!`,
            actions: [
                { id: 'join-party', type: 'accept', text: 'Join' },
                { id: 'decline-invite', type: 'decline', text: 'Decline' }
            ]
        });
    }

    showFriendRequest(fromPlayer) {
        this.notificationManager.addNotification({
            type: 'success',
            title: 'Friend Request',
            message: `${fromPlayer} wants to be your friend!`,
            actions: [
                { id: 'accept-friend', type: 'accept', text: 'Accept' },
                { id: 'decline-friend', type: 'decline', text: 'Decline' }
            ]
        });
    }
}

// Initialize platform when document is ready
document.addEventListener('DOMContentLoaded', () => {
    window.platform = new PlatformManager();
});