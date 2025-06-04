class LeaderboardManager {
    constructor() {
        this.categories = {
            'overall': 'Overall Ranking',
            'weekly': 'Weekly Champions',
            'daily': 'Daily Heroes',
            'accuracy': 'Sharpshooters',
            'winstreak': 'Win Streaks'
        };
        
        this.currentCategory = 'overall';
        this.leaderboardData = new Map();
        this.initializeLeaderboard();
    }

    initializeLeaderboard() {
        this.createLeaderboardUI();
        this.loadLeaderboardData();
        this.setupEventListeners();
    }

    createLeaderboardUI() {
        const container = document.createElement('div');
        container.className = 'leaderboard-container';
        container.innerHTML = `
            <div class="leaderboard-header">
                <h2>Leaderboards</h2>
                <div class="category-selector">
                    ${Object.entries(this.categories).map(([key, label]) => `
                        <button class="category-btn ${key === this.currentCategory ? 'active' : ''}" 
                                data-category="${key}">
                            ${label}
                        </button>
                    `).join('')}
                </div>
            </div>
            <div class="leaderboard-content">
                <div class="loading-spinner"></div>
            </div>
        `;

        document.querySelector('.main-content').appendChild(container);
    }

    loadLeaderboardData() {
        // Simulated API call to fetch leaderboard data
        setTimeout(() => {
            this.leaderboardData.set('overall', this.generateMockData('overall'));
            this.leaderboardData.set('weekly', this.generateMockData('weekly'));
            this.leaderboardData.set('daily', this.generateMockData('daily'));
            this.leaderboardData.set('accuracy', this.generateMockData('accuracy'));
            this.leaderboardData.set('winstreak', this.generateMockData('winstreak'));
            
            this.renderLeaderboard(this.currentCategory);
        }, 1000);
    }

    generateMockData(category) {
        const data = [];
        const metrics = {
            'overall': () => Math.floor(Math.random() * 10000),
            'weekly': () => Math.floor(Math.random() * 1000),
            'daily': () => Math.floor(Math.random() * 100),
            'accuracy': () => (Math.random() * 100).toFixed(2) + '%',
            'winstreak': () => Math.floor(Math.random() * 50)
        };

        for (let i = 0; i < 100; i++) {
            data.push({
                rank: i + 1,
                playerName: `Player${Math.floor(Math.random() * 9999)}`,
                score: metrics[category](),
                avatar: `avatar_${Math.floor(Math.random() * 10)}.png`,
                level: Math.floor(Math.random() * 100) + 1,
                clan: Math.random() > 0.5 ? `Clan${Math.floor(Math.random() * 100)}` : null
            });
        }

        return data;
    }

    renderLeaderboard(category) {
        const data = this.leaderboardData.get(category);
        const content = document.querySelector('.leaderboard-content');
        
        content.innerHTML = `
            <div class="leaderboard-table">
                <div class="top-players">
                    ${this.renderTopThree(data.slice(0, 3))}
                </div>
                <div class="player-list">
                    ${data.slice(3, 50).map(player => this.renderPlayerRow(player)).join('')}
                </div>
                ${this.renderCurrentPlayerStatus(data)}
            </div>
        `;
    }

    renderTopThree(topPlayers) {
        return `
            <div class="top-three">
                ${topPlayers.map((player, index) => `
                    <div class="top-player rank-${index + 1}">
                        <div class="crown-icon">${index === 0 ? '👑' : ''}</div>
                        <div class="player-avatar">
                            <img src="assets/avatars/${player.avatar}" alt="${player.playerName}">
                            <span class="rank-number">#${player.rank}</span>
                        </div>
                        <div class="player-info">
                            <div class="player-name">${player.playerName}</div>
                            ${player.clan ? `<div class="clan-tag">[${player.clan}]</div>` : ''}
                            <div class="player-score">${player.score}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderPlayerRow(player) {
        return `
            <div class="player-row ${player.playerName === window.platform.userState.playerName ? 'current-player' : ''}">
                <div class="rank">#${player.rank}</div>
                <div class="player-info">
                    <img src="assets/avatars/${player.avatar}" alt="${player.playerName}" class="small-avatar">
                    <div class="name-container">
                        <span class="player-name">${player.playerName}</span>
                        ${player.clan ? `<span class="clan-tag">[${player.clan}]</span>` : ''}
                    </div>
                </div>
                <div class="player-level">Lvl ${player.level}</div>
                <div class="player-score">${player.score}</div>
            </div>
        `;
    }

    renderCurrentPlayerStatus(data) {
        const currentPlayer = data.find(p => p.playerName === window.platform.userState.playerName);
        if (!currentPlayer) return '';

        return `
            <div class="current-player-status">
                <div class="status-header">Your Ranking</div>
                ${this.renderPlayerRow(currentPlayer)}
            </div>
        `;
    }

    setupEventListeners() {
        document.querySelector('.category-selector').addEventListener('click', (e) => {
            const btn = e.target.closest('.category-btn');
            if (!btn) return;

            document.querySelector('.category-btn.active').classList.remove('active');
            btn.classList.add('active');

            this.currentCategory = btn.dataset.category;
            this.renderLeaderboard(this.currentCategory);
        });
    }

    updatePlayerScore(category, score) {
        // Update player score and resort leaderboard
        const data = this.leaderboardData.get(category);
        const playerIndex = data.findIndex(p => p.playerName === window.platform.userState.playerName);
        
        if (playerIndex !== -1) {
            data[playerIndex].score = score;
            this.leaderboardData.set(category, data.sort((a, b) => b.score - a.score));
            this.renderLeaderboard(category);
        }
    }
}