class LockerData {
    constructor() {
        this.rarityLevels = {
            legendary: { color: '#ffa500', weight: 4 },
            epic: { color: '#ff44ff', weight: 3 },
            rare: { color: '#4444ff', weight: 2 },
            common: { color: '#808080', weight: 1 }
        };

        this.itemTypes = {
            outfits: {
                name: 'Outfits',
                icon: '👕',
                slots: ['character'],
                preview3D: true
            },
            weapons: {
                name: 'Weapons',
                icon: '🔫',
                slots: ['primary', 'secondary'],
                preview3D: true
            },
            gliders: {
                name: 'Gliders',
                icon: '🪂',
                slots: ['mobility'],
                preview3D: true
            },
            emotes: {
                name: 'Emotes',
                icon: '💃',
                slots: ['emote1', 'emote2', 'emote3', 'emote4'],
                preview3D: false
            },
            wraps: {
                name: 'Wraps',
                icon: '🎨',
                slots: ['wrap'],
                preview3D: false
            }
        };

        this.defaultLoadout = {
            character: 'recruit_default',
            primary: 'rifle_basic',
            secondary: 'pistol_basic',
            mobility: 'glider_basic',
            emote1: 'wave',
            emote2: null,
            emote3: null,
            emote4: null,
            wrap: 'wrap_basic'
        };

        // Initialize collections
        this.items = new Map();
        this.collections = new Map();
        this.loadouts = new Map([['default', this.defaultLoadout]]);
    }

    async initialize() {
        try {
            await Promise.all([
                this.loadItemDefinitions(),
                this.loadCollections(),
                this.loadUserInventory()
            ]);
            return true;
        } catch (error) {
            console.error('Failed to initialize LockerData:', error);
            return false;
        }
    }

    async loadItemDefinitions() {
        const response = await fetch('/api/items/definitions');
        const data = await response.json();
        
        data.forEach(item => {
            this.items.set(item.id, {
                ...item,
                owned: false,
                favorited: false,
                unlockDate: null,
                variants: item.variants || []
            });
        });
    }

    async loadUserInventory() {
        const response = await fetch('/api/inventory');
        const data = await response.json();

        data.forEach(item => {
            const existingItem = this.items.get(item.id);
            if (existingItem) {
                existingItem.owned = true;
                existingItem.unlockDate = new Date(item.unlockDate);
                existingItem.favorited = item.favorited || false;
            }
        });
    }

    async loadCollections() {
        const response = await fetch('/api/collections');
        const data = await response.json();

        data.forEach(collection => {
            this.collections.set(collection.id, collection);
        });
    }

    getItemsByType(type) {
        return Array.from(this.items.values())
            .filter(item => item.type === type && item.owned);
    }

    getItemById(id) {
        return this.items.get(id);
    }

    getCollectionById(id) {
        return this.collections.get(id);
    }

    getItemsByCollection(collectionId) {
        return Array.from(this.items.values())
            .filter(item => item.collectionId === collectionId);
    }

    getItemsForSlot(slotType) {
        return Array.from(this.items.values())
            .filter(item => this.itemTypes[item.type].slots.includes(slotType));
    }

    toggleFavorite(itemId) {
        const item = this.items.get(itemId);
        if (item) {
            item.favorited = !item.favorited;
            this.saveUserPreferences();
            return item.favorited;
        }
        return false;
    }

    async saveUserPreferences() {
        const preferences = {
            favorites: Array.from(this.items.values())
                .filter(item => item.favorited)
                .map(item => item.id),
            loadouts: Array.from(this.loadouts.entries())
        };

        try {
            await fetch('/api/preferences', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(preferences)
            });
            return true;
        } catch (error) {
            console.error('Failed to save preferences:', error);
            return false;
        }
    }
}