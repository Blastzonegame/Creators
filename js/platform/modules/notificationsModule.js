import BaseModule from './BaseModule.js';

export default class NotificationsModule extends BaseModule {
    initialize() {
        this.container = document.createElement('div');
        this.container.className = 'notifications-container';
        document.body.appendChild(this.container);
    }

    addNotification(options = {}) {
        const {
            type = 'info',
            title = '',
            message = '',
            duration = 5000
        } = options;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                ${title ? `<h4>${title}</h4>` : ''}
                <p>${message}</p>
            </div>
            <button class="notification-close">×</button>
        `;

        // Add to container
        this.container.appendChild(notification);

        // Setup auto-remove
        const timeout = setTimeout(() => {
            this.removeNotification(notification);
        }, duration);

        // Setup close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(timeout);
            this.removeNotification(notification);
        });

        // Animate in
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });
    }

    removeNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }
}

// Show a notification
window.platform.getModule('notifications').addNotification({
    type: 'success',
    title: 'Item Equipped',
    message: 'Successfully equipped the item'
});

// Navigate to a page
window.platform.navigate('locker');