class NavigationManager {
    constructor() {
        this.currentPage = 'home';
        this.sections = document.querySelectorAll('section[data-page]');
        this.pageHistory = ['home'];
        this.maxHistory = 10;
        this.isTransitioning = false;
        this.setupEventListeners();
        this.initializeBreadcrumb();
        this.setupMobileNavigation();
    }

    setupEventListeners() {
        // Navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = e.currentTarget.dataset.page;
                this.navigate(page);
            });
        });

        // Browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.page) {
                this.navigate(e.state.page, true);
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.altKey) {
                switch(e.key) {
                    case 'h': this.navigate('home'); break;
                    case 's': this.navigate('shop'); break;
                    case 'p': this.navigate('battle-pass'); break;
                    case 'g': this.navigate('games'); break;
                }
            }
        });

        // Submenu handling
        document.querySelectorAll('.nav-btn.has-submenu').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (e.target.closest('.submenu-item')) return;
                
                const wasExpanded = btn.classList.contains('expanded');
                
                // Close all other submenus
                document.querySelectorAll('.nav-btn.has-submenu.expanded').forEach(openBtn => {
                    if (openBtn !== btn) {
                        openBtn.classList.remove('expanded');
                    }
                });

                btn.classList.toggle('expanded', !wasExpanded);
            });
        });

        // Search functionality
        const searchInput = document.querySelector('.nav-search input');
        if (searchInput) {
            searchInput.addEventListener('input', this.handleSearch.bind(this));
        }
    }

    handleSearch(e) {
        const query = e.target.value.toLowerCase();
        document.querySelectorAll('.nav-btn, .submenu-item').forEach(item => {
            const text = item.textContent.toLowerCase();
            const parent = item.closest('.nav-submenu');
            
            if (text.includes(query)) {
                item.style.display = '';
                if (parent) {
                    parent.previousElementSibling.classList.add('expanded');
                }
            } else {
                item.style.display = 'none';
            }
        });
    }

    initializeBreadcrumb() {
        const breadcrumb = document.createElement('div');
        breadcrumb.className = 'breadcrumb';
        document.querySelector('.main-content').prepend(breadcrumb);
        this.updateBreadcrumb();
    }

    updateBreadcrumb() {
        const breadcrumb = document.querySelector('.breadcrumb');
        breadcrumb.innerHTML = this.pageHistory
            .map((page, index) => `
                <span class="breadcrumb-item ${index === this.pageHistory.length - 1 ? 'active' : ''}"
                      data-page="${page}">
                    ${this.formatPageName(page)}
                </span>
                ${index < this.pageHistory.length - 1 ? '<span class="separator">›</span>' : ''}
            `).join('');
    }

    formatPageName(page) {
        return page.split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    async navigate(page, isHistoryNavigation = false) {
        if (this.currentPage === page || this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.updateLoadingState(page, true);

        try {
            // Trigger exit animation
            await this.triggerExitAnimation();

            // Update history
            if (!isHistoryNavigation) {
                history.pushState({ page }, '', `#${page}`);
                this.pageHistory.push(page);
                if (this.pageHistory.length > this.maxHistory) {
                    this.pageHistory.shift();
                }
            }

            // Load new content
            await this.loadPageContent(page);
            
            // Update UI
            await this.updateUI(page);

        } catch (error) {
            console.error('Navigation failed:', error);
            this.showNavigationError(page);
        } finally {
            this.isTransitioning = false;
            this.updateLoadingState(page, false);
        }
    }

    updateLoadingState(page, isLoading) {
        const button = document.querySelector(`.nav-btn[data-page="${page}"]`);
        if (button) {
            button.classList.toggle('loading', isLoading);
            button.disabled = isLoading;
        }
    }

    async triggerExitAnimation() {
        const currentSection = document.querySelector(`section[data-page="${this.currentPage}"]`);
        if (!currentSection) return;

        currentSection.classList.add('exit');
        
        return new Promise(resolve => {
            currentSection.addEventListener('animationend', () => resolve(), { once: true });
            // Fallback if animation doesn't complete
            setTimeout(resolve, 300);
        });
    }

    async updateUI(page) {
        // Update active states
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.page === page);
            btn.setAttribute('aria-current', btn.dataset.page === page ? 'page' : 'false');
        });

        // Show new section
        this.sections.forEach(section => {
            const isCurrentPage = section.dataset.page === page;
            section.classList.toggle('hidden', !isCurrentPage);
            section.classList.remove('exit');
            
            if (isCurrentPage) {
                // Enable focus trap for modal sections
                if (section.hasAttribute('data-modal')) {
                    this.enableFocusTrap(section);
                }
                
                // Trigger entrance animation
                requestAnimationFrame(() => {
                    section.classList.add('enter');
                });
            }
        });

        this.currentPage = page;
        this.updateBreadcrumb();
        
        // Announce page change for screen readers
        this.announcePageChange(page);
    }

    enableFocusTrap(section) {
        const focusableElements = section.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length) {
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            firstElement.focus();
            
            section.addEventListener('keydown', e => {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstElement) {
                            lastElement.focus();
                            e.preventDefault();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            firstElement.focus();
                            e.preventDefault();
                        }
                    }
                }
            });
        }
    }

    announcePageChange(page) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.classList.add('sr-only');
        announcement.textContent = `Navigated to ${this.formatPageName(page)}`;
        
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
    }

    showNavigationError(page) {
        window.platform.notificationManager?.addNotification({
            type: 'error',
            title: 'Navigation Failed',
            message: `Failed to load ${this.formatPageName(page)}. Please try again.`,
            actions: [{
                label: 'Retry',
                onClick: () => this.navigate(page)
            }]
        });
    }

    loadPageContent(page) {
        // Save scroll position of current page
        const currentSection = document.querySelector(`section[data-page="${this.currentPage}"]`);
        if (currentSection) {
            this.saveScrollPosition(this.currentPage, currentSection.scrollTop);
        }

        switch(page) {
            case 'stats':
                window.platform.matchManager.renderMatchHistory();
                break;
            case 'shop':
                window.platform.shopManager.renderShop();
                break;
            case 'battle-pass':
                window.platform.battlePassManager.renderRewards();
                break;
            case 'locker':
                window.platform.lockerManager.renderLocker();
                break;
            case 'settings':
                window.platform.settingsManager.renderSettings();
                break;
            case 'creator':
                window.platform.creatorManager.renderStudio();
                break;
            case 'games':
                window.platform.gameManager.renderDiscoverPage();
                break;
        }

        // Restore scroll position
        this.restoreScrollPosition(page);
        
        // Track page view
        this.trackPageView(page);
    }

    saveScrollPosition(page, position) {
        sessionStorage.setItem(`scroll_${page}`, position);
    }

    restoreScrollPosition(page) {
        const position = sessionStorage.getItem(`scroll_${page}`);
        if (position) {
            const section = document.querySelector(`section[data-page="${page}"]`);
            if (section) {
                section.scrollTop = parseInt(position);
            }
        }
    }

    trackPageView(page) {
        // Analytics tracking
        const event = {
            type: 'page_view',
            page,
            timestamp: new Date().toISOString(),
            session_id: window.platform.sessionId
        };
        window.platform.analyticsManager?.trackEvent(event);
    }

    goBack() {
        if (this.pageHistory.length > 1) {
            this.pageHistory.pop();
            const previousPage = this.pageHistory[this.pageHistory.length - 1];
            this.navigate(previousPage);
        }
    }

    setupMobileNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const backdrop = document.createElement('div');
        backdrop.className = 'nav-backdrop';
        document.body.appendChild(backdrop);

        // Toggle menu
        navToggle?.addEventListener('click', () => {
            document.body.classList.toggle('nav-open');
            document.body.style.overflow = document.body.classList.contains('nav-open') ? 'hidden' : '';
        });

        // Close on backdrop click
        backdrop.addEventListener('click', () => {
            document.body.classList.remove('nav-open');
            document.body.style.overflow = '';
        });

        // Handle swipe gestures
        let touchStartX = 0;
        let touchEndX = 0;
        
        document.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        document.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, { passive: true });
    }

    handleSwipe() {
        const swipeThreshold = 100;
        const isOpen = document.body.classList.contains('nav-open');
        
        if (touchEndX - touchStartX > swipeThreshold && !isOpen) {
            // Swipe right, open menu
            document.body.classList.add('nav-open');
            document.body.style.overflow = 'hidden';
        } else if (touchStartX - touchEndX > swipeThreshold && isOpen) {
            // Swipe left, close menu
            document.body.classList.remove('nav-open');
            document.body.style.overflow = '';
        }
    }
}