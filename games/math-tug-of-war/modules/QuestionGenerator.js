/**
 * QuestionGenerator.js
 * Generates math questions based on difficulty and operation type
 */

export class QuestionGenerator {
    constructor() {
        // Define difficulty ranges
        this.difficultyRanges = {
            easy: { min: 1, max: 10 },
            medium: { min: 1, max: 50 },
            hard: { min: 1, max: 100 }
        };
    }

    /**
     * Generate a math question
     * @param {string} operation - addition, subtraction, multiplication, division, or mixed
     * @param {string} difficulty - easy, medium, or hard
     * @returns {object} Question object with text, answer, and operation
     */
    generateQuestion(operation, difficulty = 'medium') {
        const selectedOp = operation === 'mixed'
            ? this._getRandomOperation()
            : operation;

        switch (selectedOp) {
            case 'addition':
                return this._generateAddition(difficulty);
            case 'subtraction':
                return this._generateSubtraction(difficulty);
            case 'multiplication':
                return this._generateMultiplication(difficulty);
            case 'division':
                return this._generateDivision(difficulty);
            default:
                return this._generateAddition(difficulty);
        }
    }

    /**
     * Validate user's answer
     * @param {string|number} userAnswer - User's input
     * @param {number} correctAnswer - Correct answer
     * @returns {boolean} True if correct
     */
    validateAnswer(userAnswer, correctAnswer) {
        // Handle empty or invalid input
        if (userAnswer === '' || userAnswer === null || userAnswer === undefined) {
            return false;
        }

        // Convert to number and check
        const numericAnswer = Number(userAnswer);

        // Check if it's a valid number
        if (isNaN(numericAnswer)) {
            return false;
        }

        // Compare with tolerance for floating point (in case of division)
        return Math.abs(numericAnswer - correctAnswer) < 0.01;
    }

    /**
     * Get random operation for mixed mode
     * @private
     */
    _getRandomOperation() {
        const operations = ['addition', 'subtraction', 'multiplication', 'division'];
        return operations[Math.floor(Math.random() * operations.length)];
    }

    /**
     * Get random number within difficulty range
     * @private
     */
    _getRandomNumber(difficulty) {
        const range = this.difficultyRanges[difficulty] || this.difficultyRanges.medium;
        return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    }

    /**
     * Generate addition question
     * @private
     */
    _generateAddition(difficulty) {
        const a = this._getRandomNumber(difficulty);
        const b = this._getRandomNumber(difficulty);

        return {
            text: `${a} + ${b}`,
            answer: a + b,
            operation: 'addition'
        };
    }

    /**
     * Generate subtraction question
     * Ensures result is non-negative
     * @private
     */
    _generateSubtraction(difficulty) {
        let a = this._getRandomNumber(difficulty);
        let b = this._getRandomNumber(difficulty);

        // Ensure a >= b for non-negative result
        if (a < b) {
            [a, b] = [b, a];
        }

        return {
            text: `${a} - ${b}`,
            answer: a - b,
            operation: 'subtraction'
        };
    }

    /**
     * Generate multiplication question
     * Adjusts range for easier multiplication in easy mode
     * @private
     */
    _generateMultiplication(difficulty) {
        let a, b;

        if (difficulty === 'easy') {
            // Easy: multiplication tables (1-10)
            a = Math.floor(Math.random() * 10) + 1;
            b = Math.floor(Math.random() * 10) + 1;
        } else if (difficulty === 'medium') {
            // Medium: one factor small, one medium
            a = Math.floor(Math.random() * 12) + 1;
            b = Math.floor(Math.random() * 10) + 1;
        } else {
            // Hard: both can be larger
            a = Math.floor(Math.random() * 20) + 1;
            b = Math.floor(Math.random() * 20) + 1;
        }

        return {
            text: `${a} × ${b}`,
            answer: a * b,
            operation: 'multiplication'
        };
    }

    /**
     * Generate division question
     * Ensures whole number result
     * @private
     */
    _generateDivision(difficulty) {
        let divisor, quotient, dividend;

        if (difficulty === 'easy') {
            // Easy division: divisors 1-10, quotients 1-10
            divisor = Math.floor(Math.random() * 9) + 2;  // 2-10
            quotient = Math.floor(Math.random() * 10) + 1; // 1-10
        } else if (difficulty === 'medium') {
            // Medium: larger ranges
            divisor = Math.floor(Math.random() * 9) + 2;   // 2-10
            quotient = Math.floor(Math.random() * 20) + 1; // 1-20
        } else {
            // Hard: even larger
            divisor = Math.floor(Math.random() * 12) + 2;  // 2-13
            quotient = Math.floor(Math.random() * 30) + 1; // 1-30
        }

        dividend = divisor * quotient;

        return {
            text: `${dividend} ÷ ${divisor}`,
            answer: quotient,
            operation: 'division'
        };
    }

    /**
     * Get operation symbol for display
     * @param {string} operation - Operation name
     * @returns {string} Symbol
     */
    getOperationSymbol(operation) {
        const symbols = {
            addition: '+',
            subtraction: '-',
            multiplication: '×',
            division: '÷'
        };
        return symbols[operation] || '+';
    }

    /**
     * Get difficulty description
     * @param {string} difficulty - Difficulty level
     * @returns {string} Description
     */
    getDifficultyDescription(difficulty) {
        const descriptions = {
            easy: 'Numbers 1-10 (Grades 1-3)',
            medium: 'Numbers 1-50 (Grades 4-6)',
            hard: 'Numbers 1-100 (Grades 7-8)'
        };
        return descriptions[difficulty] || descriptions.medium;
    }
}
