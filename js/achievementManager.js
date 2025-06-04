class AchievementManager {
    constructor() {
        this.achievements = new Map();
        this.playerStats = {
            gamesPlayed: 0,
            wins: 0,
            totalKills: 0,
            accuracy: 0,
            timePlayedMs: 0,
            highestStreak: 0,
            medals: new Map()
        };
        
        this.initializeAchievements();
        this.loadPlayerStats();
    }

    initializeAchievements() {
        this.addAchievement({
            id: 'first_blood',
            title: 'First Blood',
            description: 'Win your first match',
            icon: '🏆',
            requirement: 1,
            reward: { type: 'blastbux', amount: 100 }
        });

        this.addAchievement({
            id: 'sharpshooter',
            title: 'Sharpshooter',
            description: 'Maintain 70% accuracy in a match',
            icon: '🎯',
            requirement: 0.7,
            reward: { type: 'skin', id: 'precision_suit' }
        });

        // Add more achievements...
    }

    addAchievement(achievement) {
        this.achievements.set(achievement.id, {
            ...achievement,
            progress: 0,
            completed: false,
            dateCompleted: null
        });
    }

    updateProgress(achievementId, value) {
        const achievement = this.achievements.get(achievementId);
        if (!achievement || achievement.completed) return;

        achievement.progress = Math.min(value, achievement.requirement);
        
        if (achievement.progress >= achievement.requirement) {
            this.unlockAchievement(achievementId);
        }

        this.renderAchievements();
    }

    unlockAchievement(achievementId) {
        const achievement = this.achievements.get(achievementId);
        if (!achievement || achievement.completed) return;

        achievement.completed = true;
        achievement.dateCompleted = new Date();

        this.grantReward(achievement.reward);
        this.showUnlockNotification(achievement);
    }

    grantReward({ type, amount, id }) {
        switch (type) {
            case 'blastbux':
                window.platform.currencyManager.addBlastbux(amount, 'Achievement');
                break;
            case 'xp':
                window.platform.addXP(amount);
                break;
            case 'skin':
                window.platform.userState.inventory.skins.push(id);
                break;
        }
    }

    updateStats(stats) {
        Object.entries(stats).forEach(([key, value]) => {
            if (this.playerStats.hasOwnProperty(key)) {
                this.playerStats[key] = value;
            }
        });

        this.checkMedals();
        this.renderStats();
    }

    checkMedals() {
        // Check for new medals based on stats
        if (this.playerStats.accuracy >= 0.9) {
            this.awardMedal('precision', 'Precision Master', '🎯');
        }
        if (this.playerStats.wins >= 100) {
            this.awardMedal('veteran', 'Battle Veteran', '⚔️');
        }
        // Add more medal conditions...
    }

    awardMedal(id, title, icon) {
        if (!this.playerStats.medals.has(id)) {
            this.playerStats.medals.set(id, {
                title,
                icon,
                dateAwarded: new Date()
            });

            this.showMedalNotification(title, icon);
        }
    }

    renderAchievements() {
        const container = document.querySelector('.achievements-container');
        if (!container) return;

        container.innerHTML = Array.from(this.achievements.values())
            .map(achievement => `
                <div class="achievement-card ${achievement.completed ? 'completed' : ''}">
                    <div class="achievement-icon">${achievement.icon}</div>
                    <div class="achievement-info">
                        <h3>${achievement.title}</h3>
                        <p>${achievement.description}</p>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${(achievement.progress / achievement.requirement) * 100}%"></div>
                        </div>
                        <span class="progress-text">
                            ${achievement.progress}/${achievement.requirement}
                        </span>
                    </div>
                </div>
            `).join('');
    }

    renderStats() {
        const container = document.querySelector('.stats-container');
        if (!container) return;

        container.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">${this.playerStats.gamesPlayed}</div>
                    <div class="stat-label">Games Played</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${this.playerStats.wins}</div>
                    <div class="stat-label">Victories</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${Math.round(this.playerStats.accuracy * 100)}%</div>
                    <div class="stat-label">Accuracy</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${this.playerStats.highestStreak}</div>
                    <div class="stat-label">Best Streak</div>
                </div>
            </div>
            <div class="medals-showcase">
                ${Array.from(this.playerStats.medals.values())
                    .map(medal => `
                        <div class="medal" title="${medal.title}">
                            ${medal.icon}
                        </div>
                    `).join('')}
            </div>
        `;
    }

    showUnlockNotification(achievement) {
        window.platform.notificationManager.addNotification({
            type: 'success',
            title: 'Achievement Unlocked!',
            message: `${achievement.icon} ${achievement.title}\n${achievement.description}`,
            duration: 5000
        });
    }

    showMedalNotification(title, icon) {
        window.platform.notificationManager.addNotification({
            type: 'success',
            title: 'New Medal Earned!',
            message: `${icon} ${title}`,
            duration: 5000
        });
    }

    savePlayerStats() {
        localStorage.setItem('playerStats', JSON.stringify(this.playerStats));
    }

    loadPlayerStats() {
        const saved = localStorage.getItem('playerStats');
        if (saved) {
            this.playerStats = JSON.parse(saved);
        }
    }
}