const gameConfig = {
    blastzone: {
        path: '/games/blastzone/index.html',
        fullscreen: true
    },
    candycrush: {
        path: '/games/01-Candy-Crush-Game/index.html',
        fullscreen: false
    }
};

function launchGame(gameId) {
    const config = gameConfig[gameId];
    if (!config) {
        console.error(`Game ${gameId} not found`);
        return;
    }

    if (config.fullscreen) {
        // Launch in fullscreen
        const gameWindow = window.open(config.path, '_blank');
        if (gameWindow) {
            gameWindow.addEventListener('load', () => {
                try {
                    gameWindow.document.documentElement.requestFullscreen();
                } catch (e) {
                    console.warn('Fullscreen request failed:', e);
                }
            });
        }
    } else {
        // Launch in same window
        window.location.href = config.path;
    }
}

// Add loading state to buttons
document.querySelectorAll('.play-button').forEach(button => {
    button.addEventListener('click', function() {
        this.disabled = true;
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        
        // Reset button after 3 seconds if game hasn't launched
        setTimeout(() => {
            if (this.disabled) {
                this.disabled = false;
                this.innerHTML = '<i class="fas fa-play"></i> Play';
            }
        }, 3000);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('gameSearch');
    const gameCards = document.querySelectorAll('.game-card');
    const gamesGrid = document.querySelector('.games-grid');

    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        let hasResults = false;

        gameCards.forEach(card => {
            const title = card.querySelector('img').alt.toLowerCase();
            if (title.includes(searchTerm)) {
                card.style.display = 'block';
                card.style.opacity = '1';
                hasResults = true;
            } else {
                card.style.display = 'none';
                card.style.opacity = '0';
            }
        });

        // Adjust grid layout for search results
        if (searchTerm !== '') {
            gamesGrid.style.justifyContent = hasResults ? 'center' : 'flex-start';
        } else {
            gamesGrid.style.justifyContent = 'flex-start';
            gameCards.forEach(card => {
                card.style.display = 'block';
                card.style.opacity = '1';
            });
        }
    });
});