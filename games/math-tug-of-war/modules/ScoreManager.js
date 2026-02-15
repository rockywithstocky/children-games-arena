/**
 * ScoreManager.js
 * Manages player scores and win determination
 */

export class ScoreManager {
    constructor() {
        this.scores = {
            player1: 0,
            player2: 0
        };
    }

    /**
     * Update score for a player
     * @param {number} player - Player number (1 or 2)
     * @param {number} points - Points to add (default: 1)
     */
    updateScore(player, points = 1) {
        if (player === 1) {
            this.scores.player1 += points;
        } else if (player === 2) {
            this.scores.player2 += points;
        }
    }

    /**
     * Get current scores
     * @returns {object} Scores object
     */
    getScores() {
        return { ...this.scores };
    }

    /**
     * Get score for specific player
     * @param {number} player - Player number
     * @returns {number} Player's score
     */
    getPlayerScore(player) {
        return player === 1 ? this.scores.player1 : this.scores.player2;
    }

    /**
     * Determine winner based on current scores
     * @returns {string|null} 'player1', 'player2', or 'tie'
     */
    determineWinner() {
        if (this.scores.player1 > this.scores.player2) {
            return 'player1';
        } else if (this.scores.player2 > this.scores.player1) {
            return 'player2';
        }
        return 'tie';
    }

    /**
     * Format scores for display
     * @returns {string} Formatted score string
     */
    formatScoreDisplay() {
        return `${this.scores.player1} - ${this.scores.player2}`;
    }

    /**
     * Reset scores to zero
     */
    reset() {
        this.scores.player1 = 0;
        this.scores.player2 = 0;
    }

    /**
     * Get score difference
     * @returns {number} Absolute difference between scores
     */
    getScoreDifference() {
        return Math.abs(this.scores.player1 - this.scores.player2);
    }
}
