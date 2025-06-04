class BlastbuxManager {
    constructor() {
        this.balance = 1000;
        this.transactions = [];
        this.packages = {
            starter: {
                amount: 1000,
                price: 0.99,
                bonus: 100,
                badge: '🌟'
            },
            pro: {
                amount: 5000,
                price: 4.99,
                bonus: 1000,
                badge: '💎'
            },
            ultimate: {
                amount: 12000,
                price: 9.99,
                bonus: 3000,
                badge: '👑'
            }
        };
        
        this.rewards = {
            dailyStreak: 0,
            lastLogin: null,
            multiplier: 1.0
        };
        
        this.initializeRewards();
        this.updateDisplay();
    }

    addBlastbux(amount, reason) {
        this.balance += amount;
        this.transactions.push({
            type: 'credit',
            amount: amount,
            reason: reason,
            timestamp: Date.now()
        });
        this.updateDisplay();
        this.showTransaction('+', amount);
    }

    spendBlastbux(amount, reason) {
        if (this.balance >= amount) {
            this.balance -= amount;
            this.transactions.push({
                type: 'debit',
                amount: amount,
                reason: reason,
                timestamp: Date.now()
            });
            this.updateDisplay();
            this.showTransaction('-', amount);
            return true;
        }
        return false;
    }

    updateDisplay() {
        const display = document.querySelector('.blastbux-amount');
        if (display) {
            display.textContent = this.balance.toLocaleString();
            // Add premium effect for large amounts
            if (this.balance >= 10000) {
                display.classList.add('premium');
            } else {
                display.classList.remove('premium');
            }
        }
    }

    showTransaction(type, amount) {
        const notification = document.createElement('div');
        notification.className = `blastbux-notification ${type === '+' ? 'credit' : 'debit'}`;
        notification.innerHTML = `
            <div class="blastbux-icon"></div>
            <span>${type}${amount.toLocaleString()}</span>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 2000);

        // Add sound effect
        const sound = new Audio(type === '+' ? 'assets/sounds/coin-add.mp3' : 'assets/sounds/coin-spend.mp3');
        sound.volume = 0.3;
        sound.play();
    }

    convertCurrency(amount, toCurrency) {
        const rates = {
            USD: 0.001,
            ROBUX: 0.1,
            VBUCKS: 0.8
        };
        
        return (amount * rates[toCurrency]).toFixed(2);
    }

    initializeRewards() {
        const saved = localStorage.getItem('blastbux_rewards');
        if (saved) {
            this.rewards = JSON.parse(saved);
        }
        this.checkDailyReward();
    }

    checkDailyReward() {
        const now = new Date();
        const last = this.rewards.lastLogin ? new Date(this.rewards.lastLogin) : null;
        
        if (!last || !this.isSameDay(now, last)) {
            if (last && this.isConsecutiveDay(now, last)) {
                this.rewards.dailyStreak++;
                this.rewards.multiplier = Math.min(2.0, 1 + (this.rewards.dailyStreak * 0.1));
            } else {
                this.rewards.dailyStreak = 1;
                this.rewards.multiplier = 1.0;
            }
            
            this.rewards.lastLogin = now.toISOString();
            this.claimDailyReward();
            this.saveRewards();
        }
    }

    isSameDay(date1, date2) {
        return date1.toDateString() === date2.toDateString();
    }

    isConsecutiveDay(today, lastLogin) {
        const diff = today.getTime() - lastLogin.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        return days === 1;
    }

    claimDailyReward() {
        const baseReward = 100;
        const bonusAmount = Math.floor(baseReward * this.rewards.multiplier);
        
        this.addBlastbux(bonusAmount, 'Daily Reward');
        this.showDailyRewardNotification(bonusAmount, this.rewards.dailyStreak);
    }

    showDailyRewardNotification(amount, streak) {
        const notification = document.createElement('div');
        notification.className = 'daily-reward-notification';
        notification.innerHTML = `
            <div class="reward-header">Daily Reward! 🎁</div>
            <div class="reward-amount">+${amount} Blastbux</div>
            <div class="reward-streak">🔥 ${streak} Day Streak</div>
            <div class="reward-multiplier">${this.rewards.multiplier}x Multiplier</div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    purchasePackage(packageId) {
        const pack = this.packages[packageId];
        if (!pack) return false;

        // Simulate purchase flow
        const confirmed = confirm(`Purchase ${packageId} package for $${pack.price}?`);
        if (confirmed) {
            const totalAmount = pack.amount + pack.bonus;
            this.addBlastbux(totalAmount, `${packageId} Package Purchase`);
            this.showPackagePurchaseEffect(pack);
            return true;
        }
        return false;
    }

    showPackagePurchaseEffect(pack) {
        const effect = document.createElement('div');
        effect.className = 'package-purchase-effect';
        effect.innerHTML = `
            <div class="package-icon">${pack.badge}</div>
            <div class="package-amount">+${pack.amount + pack.bonus}</div>
            <div class="package-bonus">+${pack.bonus} BONUS!</div>
        `;
        document.body.appendChild(effect);

        effect.addEventListener('animationend', () => effect.remove());
    }

    saveRewards() {
        localStorage.setItem('blastbux_rewards', JSON.stringify(this.rewards));
    }
}