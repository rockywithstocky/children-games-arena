/**
 * GameState.js
 * Central state management for Math Tug-of-War
 * Handles all game state without memory leaks
 */

export class GameState {
    constructor() {
        this.reset();
    }

    /**
     * Initialize or reset game state to defaults
     */
    reset() {
        // Player management
        this.currentPlayer = 1;

        // Rope position: -10 (Player 1 wins) to +10 (Player 2 wins), 0 = center
        this.ropePosition = 0;

        // Score tracking
        this.scores = {
            player1: 0,
            player2: 0
        };

        // Game settings
        this.settings = {
            difficulty: 'medium',        // easy, medium, hard
            operation: 'mixed',          // addition, subtraction, multiplication, division, mixed
            timerEnabled: true,
            timerValue: 20,              // seconds per question
            soundEnabled: true,
            questionLimitEnabled: false,  // whether to limit number of questions
            questionLimit: 40             // default: 40 questions
        };

        // Game status
        this.gameStatus = 'idle';        // idle, playing, paused, ended

        // Current question data
        this.currentQuestion = {
            text: '',
            answer: null,
            operation: ''
        };

        // Statistics
        this.stats = {
            totalQuestions: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            timeouts: 0
        };

        // Win threshold
        this.WIN_THRESHOLD = 8;          // Rope must reach ±8 to win
        this.CORRECT_PULL_STRENGTH = 2;  // Pull 2 units toward player on correct
        this.WRONG_PULL_STRENGTH = 1;    // Pull 1 unit toward opponent on wrong
    }

    /**
     * Update rope position based on answer correctness
     * @param {boolean} isCorrect - Whether the answer was correct
     * @returns {number} New rope position
     */
    updateRopePosition(isCorrect) {
        const direction = this.currentPlayer === 1 ? -1 : 1;
        const strength = isCorrect ? this.CORRECT_PULL_STRENGTH : this.WRONG_PULL_STRENGTH;

        if (isCorrect) {
            // Correct answer: pull toward current player
            this.ropePosition += direction * strength;
        } else {
            // Wrong answer: pull toward opponent
            this.ropePosition -= direction * strength;
        }

        // Clamp position to valid range
        this.ropePosition = Math.max(-10, Math.min(10, this.ropePosition));

        return this.ropePosition;
    }

    /**
     * Switch to the other player
     */
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
    }

    /**
     * Increment score for a player
     * @param {number} player - Player number (1 or 2)
     */
    incrementScore(player) {
        if (player === 1) {
            this.scores.player1++;
        } else if (player === 2) {
            this.scores.player2++;
        }
    }

    /**
     * Update statistics
     * @param {boolean} isCorrect - Whether answer was correct
     * @param {boolean} isTimeout - Whether it was a timeout
     */
    updateStats(isCorrect, isTimeout = false) {
        this.stats.totalQuestions++;

        if (isTimeout) {
            this.stats.timeouts++;
        } else if (isCorrect) {
            this.stats.correctAnswers++;
        } else {
            this.stats.wrongAnswers++;
        }
    }

    /**
     * Check if game has reached win condition
     * @returns {string|null} Winner ('player1', 'player2') or null if no winner yet
     */
    checkWinCondition() {
        if (this.ropePosition <= -this.WIN_THRESHOLD) {
            return 'player1';
        } else if (this.ropePosition >= this.WIN_THRESHOLD) {
            return 'player2';
        }
        return null;
    }

    /**
     * Update game settings
     * @param {object} newSettings - Settings to update
     */
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
    }

    /**
     * Set current question
     * @param {object} question - Question object with text, answer, operation
     */
    setCurrentQuestion(question) {
        this.currentQuestion = question;
    }

    /**
     * Start the game
     */
    start() {
        this.gameStatus = 'playing';
    }

    /**
     * Pause the game
     */
    pause() {
        this.gameStatus = 'paused';
    }

    /**
     * Resume the game
     */
    resume() {
        this.gameStatus = 'playing';
    }

    /**
     * End the game
     */
    end() {
        this.gameStatus = 'ended';
    }

    /**
     * Get current state snapshot (for debugging/logging)
     * @returns {object} Current state
     */
    getState() {
        return {
            currentPlayer: this.currentPlayer,
            ropePosition: this.ropePosition,
            scores: { ...this.scores },
            gameStatus: this.gameStatus,
            settings: { ...this.settings },
            stats: { ...this.stats }
        };
    }

    /**
     * Cleanup (prevent memory leaks)
     */
    destroy() {
        this.currentQuestion = null;
        this.scores = null;
        this.settings = null;
        this.stats = null;
    }
}
