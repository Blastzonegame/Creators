document.addEventListener('DOMContentLoaded', () => {
    // Create floating rifts
    const createRift = () => {
        const rift = document.createElement('div');
        rift.className = 'rift';
        rift.style.left = `${Math.random() * 100}vw`;
        rift.style.top = `${Math.random() * 100}vh`;
        document.querySelector('.background-scene').appendChild(rift);

        setTimeout(() => {
            rift.remove();
        }, 4000);
    };

    // Spawn rifts periodically
    setInterval(createRift, 6000);

    // Add hover sound effects
    document.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            const hoverSound = new Audio('assets/sounds/hover.mp3');
            hoverSound.volume = 0.1;
            hoverSound.play();
        });
    });
});