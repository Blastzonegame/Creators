class SocialManager {
    constructor() {
        this.friends = new Map();
        this.onlineFriends = 0;
        this.initializeWebSocket();
        this.setupEventListeners();
    }

    initializeWebSocket() {
        // Simulated WebSocket for friend status updates
        this.wsConnection = {
            onmessage: (event) => this.handleStatusUpdate(event.data)
        };
    }

    loadFriendsList() {
        // Simulated friends data
        const friendsData = [
            { id: '1', name: 'CoolPlayer', status: 'online', activity: 'In Battle Royale', avatar: 'friend1.png' },
            { id: '2', name: 'ProGamer', status: 'in-game', activity: 'Playing Mega Tycoon', avatar: 'friend2.png' },
            { id: '3', name: 'GameMaster', status: 'away', activity: 'Last seen 5m ago', avatar: 'friend3.png' },
            { id: '4', name: 'BattleQueen', status: 'online', activity: 'In Lobby', avatar: 'friend4.png' },
            { id: '5', name: 'LootKing', status: 'offline', activity: 'Last seen 2h ago', avatar: 'friend5.png' }
        ];

        friendsData.forEach(friend => this.friends.set(friend.id, friend));
        this.renderFriendsList();
        this.updateOnlineCount();
    }

    renderFriendsList() {
        const friendList = document.querySelector('.friend-list');
        const friendsHtml = Array.from(this.friends.values()).map(friend => `
            <div class="friend-entry" data-id="${friend.id}">
                <div class="friend-avatar">
                    <img src="assets/avatars/${friend.avatar}" alt="${friend.name}'s avatar">
                    <span class="status-indicator ${friend.status}"></span>
                </div>
                <div class="friend-info">
                    <div class="friend-name">${friend.name}</div>
                    <div class="friend-activity">${friend.activity}</div>
                </div>
                <div class="friend-actions">
                    <button class="btn-invite" title="Invite to Party">
                        <span class="icon">👥</span>
                    </button>
                    <button class="btn-message" title="Send Message">
                        <span class="icon">💬</span>
                    </button>
                </div>
            </div>
        `).join('');

        friendList.innerHTML = friendsHtml;
    }

    updateOnlineCount() {
        const onlineCount = Array.from(this.friends.values())
            .filter(friend => ['online', 'in-game'].includes(friend.status)).length;
        
        document.querySelector('.online-count').textContent = `${onlineCount} Online`;
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            const friendEntry = e.target.closest('.friend-entry');
            if (!friendEntry) return;

            if (e.target.closest('.btn-invite')) {
                this.inviteFriend(friendEntry.dataset.id);
            } else if (e.target.closest('.btn-message')) {
                this.openChat(friendEntry.dataset.id);
            }
        });
    }

    inviteFriend(friendId) {
        const friend = this.friends.get(friendId);
        console.log(`Inviting ${friend.name} to party...`);
        // Add party invitation logic
    }

    openChat(friendId) {
        const friend = this.friends.get(friendId);
        console.log(`Opening chat with ${friend.name}...`);
        // Add chat window logic
    }

    handleStatusUpdate(data) {
        // Handle real-time friend status updates
        const { friendId, status, activity } = JSON.parse(data);
        if (this.friends.has(friendId)) {
            const friend = this.friends.get(friendId);
            friend.status = status;
            friend.activity = activity;
            this.renderFriendsList();
            this.updateOnlineCount();
        }
    }
}