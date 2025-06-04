export default class BaseModule {
    constructor(platform) {
        this.platform = platform;
        this.initialize();
    }

    initialize() {
        // Override in child classes
    }

    onNavigate(pageId) {
        // Override in child classes
    }

    destroy() {
        // Override in child classes
    }
}