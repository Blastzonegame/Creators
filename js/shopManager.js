class ShopManager {
    constructor() {
        this.shopItems = new Map();
        this.featuredItems = new Set();
        this.categories = ['Featured', 'Characters', 'Weapons', 'Emotes', 'Bundles'];
        this.currentCategory = 'Featured';
        
        this.initializeShop();
    }

    initializeShop() {
        this.loadShopData();
        this.setupEventListeners();
        this.startDailyRotation();
    }

    loadShopData() {
        // Simulated shop data
        const items = [
            {
                id: 'char_ninja',
                name: 'Shadow Ninja',
                type: 'Characters',
                rarity: 'legendary',
                price: 2000,
                image: 'shop/characters/ninja.png',
                description: 'Master of stealth and precision',
                features: ['Custom animations', 'Unique voice lines']
            },
            // Add more items...
        ];

        items.forEach(item => this.shopItems.set(item.id, item));
        this.updateFeaturedItems();
    }

    updateFeaturedItems() {
        this.featuredItems.clear();
        const available = Array.from(this.shopItems.values())
            .filter(item => !item.owned);
        
        // Select random items for featured section
        for(let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * available.length);
            const item = available[randomIndex];
            this.featuredItems.add(item.id);
            available.splice(randomIndex, 1);
        }
    }

    renderShop() {
        const container = document.querySelector('.main-content');
        container.innerHTML = `
            <div class="shop-container">
                <div class="shop-categories">
                    ${this.categories.map(category => `
                        <button class="category-btn ${category === this.currentCategory ? 'active' : ''}"
                                data-category="${category}">
                            ${category}
                        </button>
                    `).join('')}
                </div>
                
                <div class="shop-grid">
                    ${this.getItemsByCategory(this.currentCategory)
                        .map(item => this.renderShopItem(item))
                        .join('')}
                </div>
            </div>
        `;
    }

    renderShopItem(item) {
        return `
            <div class="shop-item ${item.rarity}" data-id="${item.id}">
                <div class="item-image">
                    <img src="assets/${item.image}" alt="${item.name}">
                    ${this.featuredItems.has(item.id) ? '<span class="featured-badge">Featured</span>' : ''}
                </div>
                <div class="item-info">
                    <h3>${item.name}</h3>
                    <div class="item-rarity">${item.rarity}</div>
                    <div class="item-price">
                        <span class="currency-icon">B</span>
                        ${item.price}
                    </div>
                </div>
                <button class="btn-purchase" ${item.owned ? 'disabled' : ''}>
                    ${item.owned ? 'Owned' : 'Purchase'}
                </button>
            </div>
        `;
    }

    getItemsByCategory(category) {
        if (category === 'Featured') {
            return Array.from(this.featuredItems)
                .map(id => this.shopItems.get(id));
        }
        return Array.from(this.shopItems.values())
            .filter(item => item.type === category);
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            const categoryBtn = e.target.closest('.category-btn');
            if (categoryBtn) {
                this.currentCategory = categoryBtn.dataset.category;
                this.renderShop();
                return;
            }

            const purchaseBtn = e.target.closest('.btn-purchase');
            if (purchaseBtn && !purchaseBtn.disabled) {
                const itemId = purchaseBtn.closest('.shop-item').dataset.id;
                this.purchaseItem(itemId);
            }
        });
    }

    purchaseItem(itemId) {
        const item = this.shopItems.get(itemId);
        if (!item || item.owned) return;

        if (window.platform.currencyManager.canSpendBlastbux(item.price)) {
            window.platform.currencyManager.spendBlastbux(item.price);
            item.owned = true;
            this.renderShop();
            
            window.platform.notificationManager.addNotification({
                type: 'success',
                title: 'Purchase Successful!',
                message: `You now own ${item.name}!`,
                duration: 3000
            });
        } else {
            window.platform.notificationManager.addNotification({
                type: 'error',
                title: 'Insufficient Funds',
                message: 'You need more Blastbux to purchase this item.',
                duration: 3000
            });
        }
    }

    startDailyRotation() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setHours(24, 0, 0, 0);
        const timeUntilRotation = tomorrow - now;

        setTimeout(() => {
            this.updateFeaturedItems();
            this.renderShop();
            this.startDailyRotation();
        }, timeUntilRotation);
    }
}