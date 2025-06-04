class ChallengeManager {
    constructor() {
        this.challenges = [];
        this.refreshInterval = null;
        this.startRefreshTimer();
    }

    loadDailyChallenges() {
        // Simulate loading challenges
        this.challenges = [
            {
                title: 'Win 3 Matches',
                progress: 1,
                total: 3,
                reward: 500
            },
            {
                title: 'Collect 100 Resources',
                progress: 45,
                total: 100,
                reward: 300
            }
        ];

        this.renderChallenges();
    }

    renderChallenges() {
        const challengeList = document.querySelector('.challenge-list');
        challengeList.innerHTML = this.challenges.map(challenge => `
            <div class="challenge-card">
                <div class="challenge-info">
                    <h4>${challenge.title}</h4>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${(challenge.progress/challenge.total)*100}%"></div>
                    </div>
                    <span class="progress-text">${challenge.progress}/${challenge.total}</span>
                </div>
                <div class="challenge-reward">
                    <span class="currency-icon">B</span>
                    ${challenge.reward}
                </div>
            </div>
        `).join('');
    }

    startRefreshTimer() {
        const timerElement = document.querySelector('.refresh-timer');
        let timeLeft = 12 * 3600 + 34 * 60 + 56; // 12:34:56

        this.refreshInterval = setInterval(() => {
            timeLeft--;
            const hours = Math.floor(timeLeft / 3600);
            const minutes = Math.floor((timeLeft % 3600) / 60);
            const seconds = timeLeft % 60;
            
            timerElement.textContent = `Refreshes in ${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            if (timeLeft <= 0) {
                this.loadDailyChallenges();
                timeLeft = 24 * 3600; // Reset to 24 hours
            }
        }, 1000);
    }
}