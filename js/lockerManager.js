class LockerManager {
    constructor() {
        this.currentTab = 'outfits';
        this.currentLoadout = 'default';
        this.rotationAngle = 0;
        this.inventory = {
            outfits: [],
            weapons: [],
            gliders: [],
            emotes: [],
            wraps: []
        };
        
        this.loadouts = new Map([
            ['default', {
                name: 'Default',
                outfit: 'recruit',
                weapon: 'basic_rifle',
                glider: 'basic_glider',
                emote: 'wave'
            }]
        ]);

        this.setupEventListeners();
        this.loadInventory();
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.locker-tabs .tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchTab(btn.dataset.tab);
            });
        });

        // Character rotation
        document.querySelectorAll('.rotate-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const direction = btn.classList.contains('left') ? -1 : 1;
                this.rotateCharacter(direction * 45);
            });
        });

        // Loadout slots
        document.querySelectorAll('.loadout-slots .slot').forEach(slot => {
            slot.addEventListener('click', () => {
                this.openSlotSelector(slot.dataset.type);
            });
        });

        // Search and filters
        const searchInput = document.querySelector('.search-bar input');
        searchInput?.addEventListener('input', (e) => this.filterItems(e.target.value));

        document.querySelectorAll('.filter-options select').forEach(select => {
            select.addEventListener('change', () => this.applyFilters());
        });

        // Preset management
        document.querySelector('.add-preset')?.addEventListener('click', () => {
            this.createNewPreset();
        });

        // Setup drag and drop
        this.setupDragAndDrop();
    }

    setupDragAndDrop() {
        const items = document.querySelectorAll('.item-card');
        const slots = document.querySelectorAll('.slot');

        items.forEach(item => {
            item.setAttribute('draggable', true);
            item.addEventListener('dragstart', (e) => {
                item.classList.add('dragging');
                e.dataTransfer.setData('text/plain', item.dataset.id);
            });
            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
            });
        });

        slots.forEach(slot => {
            slot.addEventListener('dragover', (e) => {
                e.preventDefault();
                slot.classList.add('drag-over');
            });
            slot.addEventListener('dragleave', () => {
                slot.classList.remove('drag-over');
            });
            slot.addEventListener('drop', (e) => {
                e.preventDefault();
                const itemId = e.dataTransfer.getData('text/plain');
                this.equipItem(itemId, slot.dataset.type);
                slot.classList.remove('drag-over');
            });
        });
    }

    async loadInventory() {
        try {
            // Simulate API call
            const response = await fetch('/api/inventory');
            const data = await response.json();
            this.inventory = data;
            this.renderItems(this.currentTab);
        } catch (error) {
            console.error('Failed to load inventory:', error);
            // Show error notification
            window.platform.notificationManager.addNotification({
                type: 'error',
                title: 'Loading Failed',
                message: 'Failed to load inventory items.'
            });
        }
    }

    switchTab(tab) {
        this.currentTab = tab;
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });
        this.renderItems(tab);
    }

    renderItems(category) {
        const grid = document.querySelector('.items-grid');
        if (!grid) return;

        grid.innerHTML = this.inventory[category]
            .map(item => this.createItemCard(item))
            .join('');

        // Re-setup drag and drop after rendering
        this.setupDragAndDrop();
    }

    createItemCard(item) {
        return `
            <div class="item-card ${item.rarity}" data-id="${item.id}">
                <img src="assets/items/${item.image}" alt="${item.name}">
                <div class="item-rarity ${item.rarity}">${item.rarity}</div>
                <div class="item-info">
                    <div class="item-name">${item.name}</div>
                    ${item.description ? `<div class="item-desc">${item.description}</div>` : ''}
                </div>
                ${this.isEquipped(item.id) ? '<div class="equipped"></div>' : ''}
            </div>
        `;
    }

    rotateCharacter(angle) {
        this.rotationAngle = (this.rotationAngle + angle) % 360;
        const model = document.querySelector('.character-model img');
        if (model) {
            model.style.transform = `rotate(${this.rotationAngle}deg)`;
        }
    }

    isEquipped(itemId) {
        const loadout = this.loadouts.get(this.currentLoadout);
        return Object.values(loadout).includes(itemId);
    }

    equipItem(itemId, slotType) {
        const loadout = this.loadouts.get(this.currentLoadout);
        if (loadout) {
            loadout[slotType] = itemId;
            this.updateLoadoutPreview();
            this.renderItems(this.currentTab);
        }
    }

    createNewPreset() {
        const name = `Loadout ${this.loadouts.size + 1}`;
        const defaultLoadout = this.loadouts.get('default');
        this.loadouts.set(name.toLowerCase(), { ...defaultLoadout, name });
        this.renderPresets();
    }

    updateLoadoutPreview() {
        const loadout = this.loadouts.get(this.currentLoadout);
        if (!loadout) return;

        // Update character model
        const model = document.querySelector('.character-model img');
        if (model) {
            model.src = `assets/characters/${loadout.outfit}_preview.png`;
        }

        // Update slot previews
        Object.entries(loadout).forEach(([type, itemId]) => {
            const slot = document.querySelector(`.slot[data-type="${type}"] img`);
            if (slot && itemId) {
                const item = this.findItem(itemId);
                if (item) {
                    slot.src = `assets/items/${item.icon}`;
                }
            }
        });
    }

    findItem(id) {
        return Object.values(this.inventory)
            .flat()
            .find(item => item.id === id);
    }

    filterItems(searchTerm) {
        const rarity = document.querySelector('.rarity-filter').value;
        const sortBy = document.querySelector('.sort-filter').value;
        
        let items = this.inventory[this.currentTab].filter(item => {
            const matchesSearch = !searchTerm || 
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description?.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesRarity = rarity === 'all' || item.rarity === rarity;
            
            return matchesSearch && matchesRarity;
        });

        // Apply sorting
        items = this.sortItems(items, sortBy);
        
        this.renderFilteredItems(items);
    }

    sortItems(items, sortBy) {
        switch(sortBy) {
            case 'newest':
                return [...items].sort((a, b) => b.addedDate - a.addedDate);
            case 'oldest':
                return [...items].sort((a, b) => a.addedDate - b.addedDate);
            case 'rarity':
                const rarityOrder = ['legendary', 'epic', 'rare', 'common'];
                return [...items].sort((a, b) => 
                    rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity));
            case 'name':
                return [...items].sort((a, b) => a.name.localeCompare(b.name));
            default:
                return items;
        }
    }

    renderFilteredItems(items) {
        const grid = document.querySelector('.items-grid');
        if (!grid) return;

        if (items.length === 0) {
            grid.innerHTML = `
                <div class="no-items">
                    <span class="icon">🔍</span>
                    <p>No items found</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = items.map(item => this.createItemCard(item)).join('');
        this.setupDragAndDrop();
    }

    previewItem(item) {
        const preview = document.createElement('div');
        preview.className = 'item-preview-modal';
        preview.innerHTML = `
            <div class="preview-content ${item.rarity}">
                <button class="close-preview">×</button>
                <div class="preview-image">
                    <img src="assets/items/${item.preview || item.image}" alt="${item.name}">
                </div>
                <div class="preview-info">
                    <h3>${item.name}</h3>
                    <span class="rarity-badge ${item.rarity}">${item.rarity}</span>
                    ${item.description ? `<p class="description">${item.description}</p>` : ''}
                    <div class="item-details">
                        ${item.details ? this.renderItemDetails(item.details) : ''}
                    </div>
                    <div class="preview-actions">
                        <button class="btn-equip" onclick="window.platform.lockerManager.equipItem('${item.id}', '${this.currentTab}')">
                            ${this.isEquipped(item.id) ? 'Equipped' : 'Equip'}
                        </button>
                        ${item.variants ? this.renderVariantSelector(item) : ''}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(preview);
        preview.querySelector('.close-preview').addEventListener('click', () => {
            preview.remove();
        });
    }

    renderItemDetails(details) {
        return `
            <div class="details-grid">
                ${Object.entries(details).map(([key, value]) => `
                    <div class="detail-item">
                        <span class="detail-label">${key}:</span>
                        <span class="detail-value">${value}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderVariantSelector(item) {
        return `
            <div class="variant-selector">
                <h4>Style Variants</h4>
                <div class="variant-options">
                    ${item.variants.map(variant => `
                        <button class="variant-btn ${variant.unlocked ? '' : 'locked'}"
                                data-variant="${variant.id}"
                                ${!variant.unlocked ? 'disabled' : ''}>
                            <img src="assets/items/${variant.icon}" alt="${variant.name}">
                            ${!variant.unlocked ? '<span class="lock-icon">🔒</span>' : ''}
                            <span class="variant-name">${variant.name}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    saveLoadout(name = null) {
        const loadout = this.loadouts.get(this.currentLoadout);
        if (!loadout) return;

        if (name) {
            loadout.name = name;
        }

        localStorage.setItem('loadouts', JSON.stringify(Array.from(this.loadouts.entries())));
        
        window.platform.notificationManager.addNotification({
            type: 'success',
            title: 'Loadout Saved',
            message: `${loadout.name} has been saved.`,
            duration: 3000
        });
    }

    loadSavedLoadouts() {
        const saved = localStorage.getItem('loadouts');
        if (saved) {
            this.loadouts = new Map(JSON.parse(saved));
            this.renderPresets();
            this.updateLoadoutPreview();
        }
    }
}