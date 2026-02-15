/**
 * SoundManager.js
 * Manages game sound effects with toggle control
 */

export class SoundManager {
    constructor() {
        this.enabled = true;
        this.sounds = {};
        this.preloaded = false;
    }

    /**
     * Preload sound files
     * @param {object} soundPaths - Object mapping sound names to file paths
     */
    async preloadSounds(soundPaths = {}) {
        const defaultPaths = {
            correct: '../assets/sounds/correct.mp3',
            wrong: '../assets/sounds/wrong.mp3',
            win: '../assets/sounds/win.mp3'
        };

        const paths = { ...defaultPaths, ...soundPaths };

        // Create Audio objects for each sound
        for (const [name, path] of Object.entries(paths)) {
            try {
                const audio = new Audio(path);
                audio.preload = 'auto';
                this.sounds[name] = audio;
            } catch (error) {
                console.warn(`Failed to preload sound: ${name}`, error);
                // Create silent fallback
                this.sounds[name] = { play: () => { }, pause: () => { } };
            }
        }

        this.preloaded = true;
    }

    /**
     * Play correct answer sound
     */
    playCorrect() {
        this._play('correct');
    }

    /**
     * Play wrong answer sound
     */
    playWrong() {
        this._play('wrong');
    }

    /**
     * Play  win sound
     */
    playWin() {
        this._play('win');
    }

    /**
     * Internal play method
     * @private
     */
    _play(soundName) {
        if (!this.enabled) return;

        const sound = this.sounds[soundName];
        if (sound) {
            // Reset to start and play
            sound.currentTime = 0;
            sound.play().catch(err => {
                // Handle play errors (autoplay policy, etc.)
                console.warn(`Could not play sound: ${soundName}`, err);
            });
        }
    }

    /**
     * Toggle sound on/off
     * @returns {boolean} New enabled state
     */
    toggleSound() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    /**
     * Set sound enabled state
     * @param {boolean} enabled - Whether sounds should be enabled
     */
    setEnabled(enabled) {
        this.enabled = enabled;
    }

    /**
     * Get current enabled state
     * @returns {boolean} Whether sounds are enabled
     */
    isEnabled() {
        return this.enabled;
    }

    /**
     * Cleanup - stop all sounds
     */
    cleanup() {
        for (const sound of Object.values(this.sounds)) {
            if (sound.pause) {
                sound.pause();
                sound.currentTime = 0;
            }
        }
    }
}
