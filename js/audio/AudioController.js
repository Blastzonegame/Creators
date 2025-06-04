class AudioController {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.gainNode = this.audioContext.createGain();
        this.gainNode.connect(this.audioContext.destination);
        
        // Default gain value
        this.gainNode.gain.value = 0.5;
    }

    setGain(value) {
        // Clamp value between 0 and 1
        const gain = Math.max(0, Math.min(1, value));
        this.gainNode.gain.setValueAtTime(gain, this.audioContext.currentTime);
    }

    getGain() {
        return this.gainNode.gain.value;
    }

    // Connect an audio source to the gain node
    connectSource(source) {
        source.connect(this.gainNode);
    }
}