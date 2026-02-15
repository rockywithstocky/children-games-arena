/**
 * index.js
 * Main game controller - orchestrates all modules
 * Math Tug-of-War Game
 */

import { GameState } from './modules/GameState.js';
import { QuestionGenerator } from './modules/QuestionGenerator.js';
import { RopeRenderer } from './modules/RopeRenderer.js';
import { ScoreManager } from './modules/ScoreManager.js';
import { SoundManager } from './modules/SoundManager.js';
import { UIController } from './modules/UIController.js';

class MathTugOfWar {
    constructor() {
        // Initialize modules
        this.gameState = new GameState();
        this.questionGenerator = new QuestionGenerator();
        this.scoreManager = new ScoreManager();
        this.soundManager = new SoundManager();

        // Timer state
        this.timerInterval = null;
        this.timeRemaining = 0;

        // DOM elements (will be set in init)
        this.elements = {};
        this.uiController = null;
        this.ropeRenderer = null;

        // Bind methods
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    /**
     * Initialize the game
     */
    async init() {
        // Get all DOM elements
        this._cacheElements();

        // Initialize UI Controller
        this.uiController = new UIController(this.elements);

        // Initialize Rope Renderer
        this.ropeRenderer = new RopeRenderer(this.elements.ropeCanvas);

        // Preload sounds
        await this.soundManager.preloadSounds();

        // Setup event listeners
        this._setupEventListeners();

        // Initialize UI
        this._initializeUI();

        console.log('🎮 Math Tug-of-War initialized!');
    }

    /**
     * Cache all DOM elements
     * @private
     */
    _cacheElements() {
        this.elements = {
            // Game elements
            ropeCanvas: document.getElementById('ropeCanvas'),
            questionDisplay: document.getElementById('questionDisplay'),
            answerInput: document.getElementById('answerInput'),
            submitBtn: document.getElementById('submitBtn'),
            feedbackDisplay: document.getElementById('feedbackDisplay'),

            // Player indicators
            player1Indicator: document.getElementById('player1'),
            player2Indicator: document.getElementById('player2'),

            // Score displays
            score1Display: document.getElementById('score1'),
            score2Display: document.getElementById('score2'),

            // Timer
            timerDisplay: document.getElementById('timerDisplay'),

            // Controls
            startBtn: document.getElementById('startBtn'),
            pauseBtn: document.getElementById('pauseBtn'),
            resetBtn: document.getElementById('resetBtn'),
            soundToggle: document.getElementById('soundToggle'),
            teacherModeToggle: document.getElementById('teacherModeToggle'),

            // Settings toggle
            settingsToggle: document.getElementById('settingsToggle'),
            settingsPanel: document.getElementById('settingsPanel'),
            closeSettings: document.getElementById('closeSettings'),

            // Settings
            difficultySelect: document.getElementById('difficultySelect'),
            operationSelect: document.getElementById('operationSelect'),
            timerToggle: document.getElementById('timerToggle'),
            timerValueInput: document.getElementById('timerValue'),
            questionLimitToggle: document.getElementById('questionLimitToggle'),
            questionLimitInput: document.getElementById('questionLimit'),

            // Overlays
            winOverlay: document.getElementById('winOverlay'),
            playAgainBtn: document.getElementById('playAgainBtn'),

            // Views
            gameContent: document.getElementById('gameContent'),
            teacherView: document.getElementById('teacherView')
        };
    }

    /**
     * Setup all event listeners
     * @private
     */
    _setupEventListeners() {
        // Game controls
        if (this.elements.submitBtn) {
            this.elements.submitBtn.addEventListener('click', this.handleSubmit);
            this.elements.submitBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });
        }

        if (this.elements.answerInput) {
            this.elements.answerInput.addEventListener('keypress', this.handleKeyPress);
        }

        // Control buttons
        if (this.elements.startBtn) {
            this.elements.startBtn.addEventListener('click', () => this.startGame());
        }

        if (this.elements.pauseBtn) {
            this.elements.pauseBtn.addEventListener('click', () => this.togglePause());
        }

        if (this.elements.resetBtn) {
            this.elements.resetBtn.addEventListener('click', () => this.resetGame());
        }

        if (this.elements.soundToggle) {
            this.elements.soundToggle.addEventListener('click', () => this.toggleSound());
        }

        if (this.elements.teacherModeToggle) {
            this.elements.teacherModeToggle.addEventListener('click', () => this.toggleTeacherMode());
        }

        // Play again from win overlay
        if (this.elements.playAgainBtn) {
            this.elements.playAgainBtn.addEventListener('click', () => {
                this.uiController.hideWinOverlay();
                this.resetGame();
                this.startGame();
            });
        }

        // Settings changes
        if (this.elements.difficultySelect) {
            this.elements.difficultySelect.addEventListener('change', (e) => {
                this.gameState.updateSettings({ difficulty: e.target.value });
            });
        }

        if (this.elements.operationSelect) {
            this.elements.operationSelect.addEventListener('change', (e) => {
                this.gameState.updateSettings({ operation: e.target.value });
            });
        }

        if (this.elements.timerToggle) {
            this.elements.timerToggle.addEventListener('change', (e) => {
                this.gameState.updateSettings({ timerEnabled: e.target.checked });
            });
        }

        if (this.elements.timerValueInput) {
            this.elements.timerValueInput.addEventListener('change', (e) => {
                const value = parseInt(e.target.value);
                if (value >= 5 && value <= 60) {
                    this.gameState.updateSettings({ timerValue: value });
                }
            });
        }

        if (this.elements.questionLimitToggle) {
            this.elements.questionLimitToggle.addEventListener('change', (e) => {
                this.gameState.updateSettings({ questionLimitEnabled: e.target.checked });
            });
        }

        if (this.elements.questionLimitInput) {
            this.elements.questionLimitInput.addEventListener('change', (e) => {
                const value = parseInt(e.target.value);
                if (value >= 5 && value <= 100) {
                    this.gameState.updateSettings({ questionLimit: value });
                }
            });
        }

        // Settings panel toggle
        if (this.elements.settingsToggle) {
            this.elements.settingsToggle.addEventListener('click', () => this.toggleSettings());
        }

        if (this.elements.closeSettings) {
            this.elements.closeSettings.addEventListener('click', () => this.toggleSettings());
        }
    }

    /**
     * Initialize UI with default values
     * @private
     */
    _initializeUI() {
        this.uiController.displayScore(this.scoreManager.getScores());
        this.uiController.updateCurrentPlayer(1);
        this.uiController.setInputEnabled(false);
        this.uiController.updateSoundToggle(this.soundManager.isEnabled());
    }

    /**
     * Toggle settings panel visibility
     */
    toggleSettings() {
        if (this.elements.settingsPanel) {
            this.elements.settingsPanel.classList.toggle('open');
        }
    }

    /**
     * Hide settings panel
     */
    hideSettings() {
        if (this.elements.settingsPanel) {
            this.elements.settingsPanel.classList.remove('open');
        }
    }

    /**
     * Start the game
     */
    startGame() {
        // Disable settings during game
        this._setSettingsEnabled(false);

        // Hide settings panel to focus on game
        this.hideSettings();

        // Start game state
        this.gameState.start();

        // Generate first question
        this.nextQuestion();

        // Enable input
        this.uiController.setInputEnabled(true);

        // Update button states
        if (this.elements.startBtn) this.elements.startBtn.disabled = true;
        if (this.elements.pauseBtn) this.elements.pauseBtn.disabled = false;
    }

    /**
     * Generate and display next question
     */
    nextQuestion() {
        // Generate question
        const question = this.questionGenerator.generateQuestion(
            this.gameState.settings.operation,
            this.gameState.settings.difficulty
        );

        // Store in state
        this.gameState.setCurrentQuestion(question);

        // Update UI
        this.uiController.updateQuestion(`${question.text} = ?`);
        this.uiController.clearInput();
        this.uiController.updateCurrentPlayer(this.gameState.currentPlayer);

        // Start timer if enabled
        if (this.gameState.settings.timerEnabled) {
            this.startTimer();
        }
    }

    /**
     * Handle answer submission
     */
    handleSubmit() {
        if (this.gameState.gameStatus !== 'playing') return;

        // Stop timer
        this.stopTimer();

        // Get user answer
        const userAnswer = this.elements.answerInput.value;

        // Validate answer
        const isCorrect = this.questionGenerator.validateAnswer(
            userAnswer,
            this.gameState.currentQuestion.answer
        );

        // Process answer
        this.processAnswer(isCorrect, userAnswer);
    }

    /**
     * Process the answer (correct or wrong)
     * @param {boolean} isCorrect - Whether answer was correct
     * @param {string} userAnswer - User's answer
     */
    processAnswer(isCorrect, userAnswer = '') {
        // Update stats
        this.gameState.updateStats(isCorrect);

        // Update score if correct
        if (isCorrect) {
            this.scoreManager.updateScore(this.gameState.currentPlayer);
            this.soundManager.playCorrect();
        } else {
            this.soundManager.playWrong();
        }

        // Show feedback
        this.uiController.showFeedback(
            isCorrect,
            this.gameState.currentQuestion.answer,
            userAnswer
        );

        // Update score display
        this.uiController.displayScore(this.scoreManager.getScores());

        // Update rope position
        const newPosition = this.gameState.updateRopePosition(isCorrect);
        this.ropeRenderer.animateTo(newPosition);

        // Check win condition (rope position)
        const winner = this.gameState.checkWinCondition();
        if (winner) {
            this.handleWin(winner);
            return;
        }

        // Check question limit
        if (this.gameState.settings.questionLimitEnabled) {
            if (this.gameState.stats.totalQuestions >= this.gameState.settings.questionLimit) {
                // Game ends - determine winner by score
                const scoreWinner = this.scoreManager.determineWinner();
                if (scoreWinner === 'tie') {
                    // In case of tie, continue playing
                    console.log('Tie game - continuing...');
                } else {
                    this.handleWin(scoreWinner);
                    return;
                }
            }
        }

        // Switch player and continue
        this.gameState.switchPlayer();

        // Delay next question to show feedback
        setTimeout(() => {
            if (this.gameState.gameStatus === 'playing') {
                this.nextQuestion();
            }
        }, 2000);
    }

    /**
     * Handle keypress in answer input (Enter to submit)
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.handleSubmit();
        }
    }

    /**
     * Start countdown timer
     */
    startTimer() {
        this.stopTimer(); // Clear any existing timer

        this.timeRemaining = this.gameState.settings.timerValue;
        this.uiController.updateTimer(this.timeRemaining);

        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            this.uiController.updateTimer(this.timeRemaining);

            if (this.timeRemaining <= 0) {
                this.handleTimeout();
            }
        }, 1000);
    }

    /**
     * Stop countdown timer
     */
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    /**
     * Handle timer timeout
     */
    handleTimeout() {
        this.stopTimer();
        this.gameState.updateStats(false, true);
        this.processAnswer(false, '(timeout)');
    }

    /**
     * Toggle pause/resume
     */
    togglePause() {
        if (this.gameState.gameStatus === 'playing') {
            this.gameState.pause();
            this.stopTimer();
            this.uiController.setInputEnabled(false);
            if (this.elements.pauseBtn) {
                this.elements.pauseBtn.textContent = 'Resume';
            }
        } else if (this.gameState.gameStatus === 'paused') {
            this.gameState.resume();
            this.uiController.setInputEnabled(true);
            if (this.gameState.settings.timerEnabled) {
                this.startTimer();
            }
            if (this.elements.pauseBtn) {
                this.elements.pauseBtn.textContent = 'Pause';
            }
        }
    }

    /**
     * Reset game to initial state
     */
    resetGame() {
        // Stop timer
        this.stopTimer();

        // Reset all modules
        this.gameState.reset();
        this.scoreManager.reset();

        // Reset rope position
        this.ropeRenderer.animateTo(0);

        // Reset UI
        this.uiController.displayScore(this.scoreManager.getScores());
        this.uiController.updateCurrentPlayer(1);
        this.uiController.clearInput();
        this.uiController.setInputEnabled(false);
        this.uiController.hideWinOverlay();

        if (this.elements.questionDisplay) {
            this.elements.questionDisplay.textContent = 'Press Start to Begin!';
        }

        // Enable settings
        this._setSettingsEnabled(true);

        // Reset buttons
        if (this.elements.startBtn) this.elements.startBtn.disabled = false;
        if (this.elements.pauseBtn) {
            this.elements.pauseBtn.disabled = true;
            this.elements.pauseBtn.textContent = 'Pause';
        }
    }

    /**
     * Handle win condition
     * @param {string} winner - 'player1' or 'player2'
     */
    handleWin(winner) {
        this.gameState.end();
        this.stopTimer();
        this.uiController.setInputEnabled(false);

        // Play win sound
        this.soundManager.playWin();

        // Show win overlay
        this.uiController.showWinOverlay(winner, this.scoreManager.getScores());

        console.log(`🏆 ${winner} wins!`, this.gameState.getState());
    }

    /**
     * Toggle sound on/off
     */
    toggleSound() {
        const enabled = this.soundManager.toggleSound();
        this.uiController.updateSoundToggle(enabled);
        this.gameState.updateSettings({ soundEnabled: enabled });
    }

    /**
     * Toggle teacher mode
     */
    toggleTeacherMode() {
        const teacherMode = this.gameState.settings.teacherMode || false;
        const newMode = !teacherMode;
        this.gameState.updateSettings({ teacherMode: newMode });
        this.uiController.toggleTeacherMode(newMode);
    }

    /**
     * Enable/disable settings controls
     * @private
     */
    _setSettingsEnabled(enabled) {
        const settingsElements = [
            this.elements.difficultySelect,
            this.elements.operationSelect,
            this.elements.timerToggle,
            this.elements.timerValueInput
        ];

        settingsElements.forEach(el => {
            if (el) el.disabled = !enabled;
        });
    }

    /**
     * Cleanup - called when page is unloaded
     */
    cleanup() {
        this.stopTimer();
        if (this.ropeRenderer) {
            this.ropeRenderer.cleanup();
        }
        if (this.soundManager) {
            this.soundManager.cleanup();
        }
        if (this.gameState) {
            this.gameState.destroy();
        }
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    const game = new MathTugOfWar();
    await game.init();

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        game.cleanup();
    });

    // Expose to window for debugging
    window.mathGame = game;
});
