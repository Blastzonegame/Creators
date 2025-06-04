class BattlePassManager {
    constructor() {
        this.currentTier = 15;
        this.maxTier = 100;
        this.rewards = [];
    }

    loadProgress() {
        const rewardTrack = document.querySelector('.reward-track');
        rewardTrack.innerHTML = this.generateRewardTrack();
    }

    generateRewardTrack() {
        return `
            <div class="reward-scroll">
                ${Array.from({length: 5}, (_, i) => {
                    const tier = this.currentTier + i;
                    return `
                        <div class="reward-item ${tier <= this.currentTier ? 'claimed' : ''}">
                            <div class="tier-number">${tier}</div>
                            <div class="reward-icon">🎁</div>
                            <div class="reward-name">Reward ${tier}</div>
                        </div>
                    `;
                }).join('')}
            </div>
            <div class="battle-pass-progress">
                <div class="progress-bar">
                    <div class="progress" style="width: ${(this.currentTier/this.maxTier)*100}%"></div>
                </div>
                <span class="progress-text">${this.currentTier}/${this.maxTier}</span>
            </div>
        `;
    }
}