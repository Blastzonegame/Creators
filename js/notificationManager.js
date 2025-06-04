class NotificationManager {
    constructor() {
        this.notifications = [];
        this.createNotificationContainer();
        this.setupEventListeners();
    }

    createNotificationContainer() {
        const container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }

    addNotification(notification) {
        const { type, title, message, actions } = notification;
        const id = crypto.randomUUID();
        
        const notificationElement = this.createNotificationElement({
            id,
            type,
            title,
            message,
            actions
        });

        const container = document.querySelector('.notification-container');
        container.appendChild(notificationElement);

        // Auto dismiss non-action notifications
        if (!actions) {
            setTimeout(() => this.dismissNotification(id), 5000);
        }

        return id;
    }

    createNotificationElement({ id, type, title, message, actions }) {
        const element = document.createElement('div');
        element.className = `notification ${type}`;
        element.dataset.id = id;

        element.innerHTML = `
            <div class="notification-header">
                <span class="notification-title">${title}</span>
                <button class="notification-close">×</button>
            </div>
            <div class="notification-body">
                <p>${message}</p>
                ${actions ? `
                    <div class="notification-actions">
                        ${actions.map(action => `
                            <button class="btn-${action.type}" data-action="${action.id}">
                                ${action.text}
                            </button>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;

        // Add slide-in animation
        requestAnimationFrame(() => element.classList.add('show'));

        return element;
    }

    dismissNotification(id) {
        const notification = document.querySelector(`.notification[data-id="${id}"]`);
        if (notification) {
            notification.classList.add('dismiss');
            setTimeout(() => notification.remove(), 300);
        }
    }

    setupEventListeners() {
        document.querySelector('.notification-container').addEventListener('click', (e) => {
            const notification = e.target.closest('.notification');
            if (!notification) return;

            if (e.target.matches('.notification-close')) {
                this.dismissNotification(notification.dataset.id);
                return;
            }

            const actionButton = e.target.closest('[data-action]');
            if (actionButton) {
                const actionId = actionButton.dataset.action;
                this.handleAction(actionId, notification.dataset.id);
            }
        });
    }

    handleAction(actionId, notificationId) {
        // Handle different action types
        switch (actionId) {
            case 'accept-friend':
                console.log('Friend request accepted');
                break;
            case 'decline-friend':
                console.log('Friend request declined');
                break;
            case 'join-party':
                console.log('Joining party...');
                break;
            case 'decline-invite':
                console.log('Party invite declined');
                break;
        }

        this.dismissNotification(notificationId);
    }
}