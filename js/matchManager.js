class MatchManager {
    constructor() {
        this.matchHistory = [];
        this.currentMatch = null;
        this.stats = {
            totalMatches: 0,
            wins: 0,
            losses: 0,
            winStreak: 0,
            bestStreak: 0,
            averageScore: 0,
            totalPlaytime: 0,
            favoriteMode: null
        };
        
        this.loadMatchHistory();
    }

    startMatch(mode, map) {
        this.currentMatch = {
            id: crypto.randomUUID(),
            mode,
            map,
            startTime: Date.now(),
            endTime: null,
            score: 0,
            kills: 0,
            deaths: 0,
            assists: 0,
            accuracy: 0,
            result: null,
            highlights: []
        };
    }

    endMatch(result) {
        if (!this.currentMatch) return;

        this.currentMatch.endTime = Date.now();
        this.currentMatch.result = result;
        this.matchHistory.unshift(this.currentMatch);
        this.updateStats();
        this.saveMatchHistory();
        
        // Notify other systems
        window.platform.achievementManager.checkMatchAchievements(this.currentMatch);
        window.platform.leaderboardManager.updatePlayerScore('overall', this.stats.averageScore);
        
        this.currentMatch = null;
    }

    updateStats() {
        const stats = this.stats;
        stats.totalMatches++;
        
        if (this.currentMatch.result === 'victory') {
            stats.wins++;
            stats.winStreak++;
            stats.bestStreak = Math.max(stats.winStreak, stats.bestStreak);
        } else {
            stats.losses++;
            stats.winStreak = 0;
        }

        // Calculate average score
        const totalScore = this.matchHistory.reduce((sum, match) => sum + match.score, 0);
        stats.averageScore = totalScore / this.matchHistory.length;

        // Calculate total playtime
        stats.totalPlaytime = this.matchHistory.reduce((sum, match) => 
            sum + (match.endTime - match.startTime), 0);

        // Find favorite mode
        const modes = this.matchHistory.reduce((acc, match) => {
            acc[match.mode] = (acc[match.mode] || 0) + 1;
            return acc;
        }, {});
        stats.favoriteMode = Object.entries(modes)
            .sort((a, b) => b[1] - a[1])[0][0];
    }

    recordHighlight(type, data) {
        if (!this.currentMatch) return;
        
        this.currentMatch.highlights.push({
            type,
            timestamp: Date.now() - this.currentMatch.startTime,
            data
        });
    }

    getMatchHistory(limit = 10) {
        return this.matchHistory.slice(0, limit);
    }

    getMatchDetails(matchId) {
        return this.matchHistory.find(match => match.id === matchId);
    }

    renderMatchHistory() {
        const container = document.querySelector('.match-history');
        if (!container) return;

        container.innerHTML = `
            <div class="stats-summary">
                <div class="stat-card">
                    <div class="stat-value">${this.stats.wins}</div>
                    <div class="stat-label">Wins</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${(this.stats.wins / this.stats.totalMatches * 100).toFixed(1)}%</div>
                    <div class="stat-label">Win Rate</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${this.stats.winStreak}</div>
                    <div class="stat-label">Current Streak</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${this.formatPlaytime()}</div>
                    <div class="stat-label">Play Time</div>
                </div>
            </div>
            <div class="match-list">
                ${this.getMatchHistory().map(match => this.renderMatchCard(match)).join('')}
            </div>
        `;

        // Add event listeners for match details
        container.querySelectorAll('.match-card').forEach(card => {
            card.addEventListener('click', () => {
                this.showMatchDetails(card.dataset.matchId);
            });
        });
    }

    renderMatchCard(match) {
        const duration = (match.endTime - match.startTime) / 1000;
        return `
            <div class="match-card ${match.result}" data-match-id="${match.id}">
                <div class="match-mode">${match.mode}</div>
                <div class="match-details">
                    <div class="match-map">${match.map}</div>
                    <div class="match-stats">
                        <span>${match.kills}/${match.deaths}/${match.assists}</span>
                        <span>${match.accuracy}% ACC</span>
                    </div>
                </div>
                <div class="match-result">
                    <div class="result-text">${match.result}</div>
                    <div class="match-duration">${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}</div>
                </div>
            </div>
        `;
    }

    showMatchDetails(matchId) {
        const match = this.getMatchDetails(matchId);
        if (!match) return;

        const modal = document.createElement('div');
        modal.className = 'match-details-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Match Details</h2>
                    <button class="close-modal">×</button>
                </div>
                <div class="match-info">
                    <div class="match-header ${match.result}">
                        <h3>${match.mode} on ${match.map}</h3>
                        <div class="match-result">${match.result}</div>
                    </div>
                    <div class="detailed-stats">
                        <div class="stat-group">
                            <div class="stat">
                                <label>K/D/A</label>
                                <value>${match.kills}/${match.deaths}/${match.assists}</value>
                            </div>
                            <div class="stat">
                                <label>Score</label>
                                <value>${match.score}</value>
                            </div>
                            <div class="stat">
                                <label>Accuracy</label>
                                <value>${match.accuracy}%</value>
                            </div>
                        </div>
                    </div>
                    ${this.renderHighlights(match.highlights)}
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });
    }

    renderHighlights(highlights) {
        if (!highlights.length) return '';

        return `
            <div class="match-highlights">
                <h3>Match Highlights</h3>
                <div class="highlights-list">
                    ${highlights.map(highlight => `
                        <div class="highlight-item">
                            <span class="highlight-time">${this.formatTime(highlight.timestamp)}</span>
                            <span class="highlight-icon">${this.getHighlightIcon(highlight.type)}</span>
                            <span class="highlight-desc">${this.getHighlightDescription(highlight)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    formatTime(ms) {
        const seconds = Math.floor(ms / 1000);
        return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
    }

    formatPlaytime() {
        const hours = Math.floor(this.stats.totalPlaytime / (1000 * 60 * 60));
        const minutes = Math.floor((this.stats.totalPlaytime % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    }

    getHighlightIcon(type) {
        const icons = {
            'multikill': '⚔️',
            'objective': '🎯',
            'clutch': '💫',
            'achievement': '🏆'
        };
        return icons[type] || '✨';
    }

    getHighlightDescription(highlight) {
        switch (highlight.type) {
            case 'multikill':
                return `${highlight.data.count}x Multi-kill!`;
            case 'objective':
                return `Captured ${highlight.data.objective}`;
            case 'clutch':
                return `Clutched the round!`;
            default:
                return highlight.data.description || 'Amazing play!';
        }
    }

    saveMatchHistory() {
        localStorage.setItem('matchHistory', JSON.stringify({
            matches: this.matchHistory.slice(0, 100), // Keep last 100 matches
            stats: this.stats
        }));
    }

    loadMatchHistory() {
        const saved = localStorage.getItem('matchHistory');
        if (saved) {
            const data = JSON.parse(saved);
            this.matchHistory = data.matches;
            this.stats = data.stats;
        }
    }
}