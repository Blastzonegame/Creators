export class Platform {
    constructor() {
        this.modules = new Map();
        this.state = {
            currentPage: null,
            isLoading: false,
            theme: 'dark'
        };
        
        this.initialize();
    }

    async initialize() {
        try {
            // Initialize core modules
            await this.initModules([
                'navigation',
                'notifications',
                'locker',
                'settings'
            ]);

            // Setup event listeners
            this.setupEventListeners();
            
            // Load saved state
            this.loadPersistedState();
            
            // Initialize UI
            this.updateUI();
            
        } catch (error) {
            console.error('Platform initialization failed:', error);
            this.showErrorScreen();
        }
    }

    async initModules(moduleNames) {
        for (const name of moduleNames) {
            try {
                const module = await import(`./modules/${name}Module.js`);
                this.modules.set(name, new module.default(this));
            } catch (error) {
                console.error(`Failed to load module: ${name}`, error);
            }
        }
    }

    setupEventListeners() {
        // Navigation events
        document.querySelectorAll('[data-page]').forEach(element => {
            element.addEventListener('click', (e) => {
                this.navigate(e.currentTarget.dataset.page);
            });
        });

        // Theme toggle
        document.querySelector('.theme-toggle')?.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Handle back navigation
        window.addEventListener('popstate', (e) => {
            if (e.state?.page) {
                this.navigate(e.state.page, false);
            }
        });
    }

    navigate(pageId, addToHistory = true) {
        if (this.state.isLoading) return;
        
        // Hide all pages
        document.querySelectorAll('[data-page]').forEach(page => {
            page.classList.add('hidden');
        });

        // Show target page
        const targetPage = document.querySelector(`[data-page="${pageId}"]`);
        if (targetPage) {
            targetPage.classList.remove('hidden');
            this.state.currentPage = pageId;
            
            if (addToHistory) {
                history.pushState({ page: pageId }, '', `#${pageId}`);
            }

            // Notify modules of navigation
            this.modules.forEach(module => {
                if (module.onNavigate) {
                    module.onNavigate(pageId);
                }
            });
        }
    }

    toggleTheme() {
        const newTheme = this.state.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        this.state.theme = newTheme;
        this.persistState();
    }

    showErrorScreen() {
        const errorScreen = document.createElement('div');
        errorScreen.className = 'error-screen';
        errorScreen.innerHTML = `
            <div class="error-content">
                <h2>Something went wrong</h2>
                <p>Failed to initialize the platform. Please try refreshing the page.</p>
                <button onclick="location.reload()">Refresh Page</button>
            </div>
        `;
        document.body.appendChild(errorScreen);
    }

    persistState() {
        localStorage.setItem('platformState', JSON.stringify(this.state));
    }

    loadPersistedState() {
        try {
            const saved = localStorage.getItem('platformState');
            if (saved) {
                this.state = { ...this.state, ...JSON.parse(saved) };
                this.updateUI();
            }
        } catch (error) {
            console.error('Failed to load persisted state:', error);
        }
    }

    updateUI() {
        // Update theme
        document.documentElement.setAttribute('data-theme', this.state.theme);
        
        // Navigate to saved page or default
        const hash = window.location.hash.slice(1);
        this.navigate(hash || this.state.currentPage || 'home', false);
    }

    getModule(name) {
        return this.modules.get(name);
    }
}

// Initialize platform
window.platform = new Platform();