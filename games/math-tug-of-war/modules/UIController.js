/**
 * UIController.js
 * Manages all DOM manipulations and UI updates
 */

export class UIController {
    constructor(elements) {
        // Store DOM element references
        this.elements = elements;
        this.confettiActive = false;
    }

    /**
     * Update question display
     * @param {string} questionText - Question to display
     */
    updateQuestion(questionText) {
        if (this.elements.questionDisplay) {
            this.elements.questionDisplay.textContent = questionText;
            // Add appear animation
            this.elements.questionDisplay.classList.remove('fade-in');
            void this.elements.questionDisplay.offsetWidth; // Trigger reflow
            this.elements.questionDisplay.classList.add('fade-in');
        }
    }

    /**
     * Update current player indicator
     * @param {number} player - Current player (1 or 2)
     */
    updateCurrentPlayer(player) {
        const p1Indicator = this.elements.player1Indicator;
        const p2Indicator = this.elements.player2Indicator;

        if (p1Indicator && p2Indicator) {
            if (player === 1) {
                p1Indicator.classList.add('active');
                p2Indicator.classList.remove('active');
            } else {
                p2Indicator.classList.add('active');
                p1Indicator.classList.remove('active');
            }
        }
    }

    /**
     * Show feedback for answer (correct/wrong)
     * @param {boolean} isCorrect - Whether answer was correct
     * @param {number} correctAnswer - The correct answer
     * @param {string} userAnswer - User's answer
     */
    showFeedback(isCorrect, correctAnswer = null, userAnswer = null) {
        const feedback = this.elements.feedbackDisplay;
        if (!feedback) return;

        if (isCorrect) {
            feedback.textContent = '✅ Correct!';
            feedback.className = 'feedback correct';
        } else {
            let message = '❌ Wrong!';
            if (correctAnswer !== null && userAnswer) {
                message += ` You entered: ${userAnswer}. Correct answer: ${correctAnswer}`;
            }
            feedback.textContent = message;
            feedback.className = 'feedback wrong';

            // Shake animation
            if (this.elements.answerInput) {
                this.elements.answerInput.classList.add('shake');
                setTimeout(() => {
                    this.elements.answerInput.classList.remove('shake');
                }, 500);
            }
        }

        // Show feedback then hide
        feedback.style.display = 'block';
        setTimeout(() => {
            feedback.style.display = 'none';
        }, 2000);
    }

    /**
     * Update score display
     * @param {object} scores - Scores object {player1, player2}
     */
    displayScore(scores) {
        if (this.elements.score1Display) {
            this.elements.score1Display.textContent = scores.player1;
        }
        if (this.elements.score2Display) {
            this.elements.score2Display.textContent = scores.player2;
        }
    }

    /**
     * Update timer display
     * @param {number} seconds - Seconds remaining
     */
    updateTimer(seconds) {
        if (this.elements.timerDisplay) {
            this.elements.timerDisplay.textContent = seconds;

            // Add warning class when time is low
            if (seconds <= 5) {
                this.elements.timerDisplay.classList.add('warning');
            } else {
                this.elements.timerDisplay.classList.remove('warning');
            }
        }
    }

    /**
     * Show win overlay
     * @param {string} winner - 'player1' or 'player2'
     * @param {object} scores -  Final scores
     */
    showWinOverlay(winner, scores) {
        const overlay = this.elements.winOverlay;
        if (!overlay) return;

        const winnerText = winner === 'player1' ? 'Player 1' : 'Player 2';
        const winnerColor = winner === 'player1' ? '#EF4444' : '#3B82F6';

        // Update overlay content
        const winnerDisplay = overlay.querySelector('.winner-name');
        const scoreDisplay = overlay.querySelector('.final-score');

        if (winnerDisplay) {
            winnerDisplay.textContent = `${winnerText} Wins!`;
            winnerDisplay.style.color = winnerColor;
        }

        if (scoreDisplay) {
            scoreDisplay.textContent = `Final Score: ${scores.player1} - ${scores.player2}`;
        }

        // Show overlay with animation
        overlay.style.display = 'flex';
        overlay.classList.add('show');

        // Trigger confetti
        this.triggerConfetti();
    }

    /**
     * Hide win overlay
     */
    hideWinOverlay() {
        const overlay = this.elements.winOverlay;
        if (overlay) {
            overlay.classList.remove('show');
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 300);
        }
        this.stopConfetti();
    }

    /**
     * Trigger confetti animation
     */
    triggerConfetti() {
        if (this.confettiActive) return;

        this.confettiActive = true;
        const confettiContainer = this.elements.confettiContainer || document.body;

        // Create confetti pieces
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                this._createConfettiPiece(confettiContainer);
            }, i * 30);
        }
    }

    /**
     * Create single confetti piece
     * @private
     */
    _createConfettiPiece(container) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';

        // Random properties
        const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const animationDuration = 2 + Math.random() * 2;
        const size = 8 + Math.random() * 8;

        confetti.style.cssText = `
            position: fixed;
            left: ${left}%;
            top: -10px;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            z-index: 10000;
            animation: confettiFall ${animationDuration}s linear forwards;
            transform: rotate(${Math.random() * 360}deg);
        `;

        container.appendChild(confetti);

        // Remove after animation
        setTimeout(() => {
            confetti.remove();
        }, animationDuration * 1000);
    }

    /**
     * Stop confetti
     */
    stopConfetti() {
        this.confettiActive = false;
        document.querySelectorAll('.confetti').forEach(c => c.remove());
    }

    /**
     * Clear answer input
     */
    clearInput() {
        if (this.elements.answerInput) {
            this.elements.answerInput.value = '';
            this.elements.answerInput.focus();
        }
    }

    /**
     * Enable/disable input
     * @param {boolean} enabled - Whether input should be enabled
     */
    setInputEnabled(enabled) {
        if (this.elements.answerInput) {
            this.elements.answerInput.disabled = !enabled;
        }
        if (this.elements.submitBtn) {
            this.elements.submitBtn.disabled = !enabled;
        }
    }

    /**
     * Update sound toggle button
     * @param {boolean} enabled - Whether sound is enabled
     */
    updateSoundToggle(enabled) {
        if (this.elements.soundToggle) {
            this.elements.soundToggle.textContent = enabled ? '🔊' : '🔇';
            this.elements.soundToggle.setAttribute('aria-label',
                enabled ? 'Mute sounds' : 'Unmute sounds');
        }
    }

    /**
     * Show/hide teacher mode
     * @param {boolean} teacherMode - Whether teacher mode is active
     */
    toggleTeacherMode(teacherMode) {
        const gameContent = this.elements.gameContent;
        const teacherView = this.elements.teacherView;

        if (gameContent && teacherView) {
            if (teacherMode) {
                gameContent.style.display = 'none';
                teacherView.style.display = 'flex';
            } else {
                gameContent.style.display = 'block';
                teacherView.style.display = 'none';
            }
        }
    }

    /**
     * Update settings display (difficulty, operation)
     * @param {object} settings - Settings object
     */
    updateSettingsDisplay(settings) {
        if (this.elements.difficultyDisplay) {
            this.elements.difficultyDisplay.textContent =
                settings.difficulty.charAt(0).toUpperCase() + settings.difficulty.slice(1);
        }
        if (this.elements.operationDisplay) {
            const opNames = {
                addition: 'Addition',
                subtraction: 'Subtraction',
                multiplication: 'Multiplication',
                division: 'Division',
                mixed: 'Mixed Operations'
            };
            this.elements.operationDisplay.textContent = opNames[settings.operation] || 'Mixed';
        }
    }

    /**
     * Show/hide loading state
     * @param {boolean} loading - Whether game is loading
     */
    setLoading(loading) {
        if (this.elements.loadingIndicator) {
            this.elements.loadingIndicator.style.display = loading ? 'block' : 'none';
        }
    }
}
