/**
 * RopeRenderer.js
 * Handles smooth rope animation using Canvas and requestAnimationFrame
 */

export class RopeRenderer {
    constructor(canvasElement) {
        this.canvas = canvasElement;
        this.ctx = this.canvas.getContext('2d');
        this.animationFrameId = null;
        this.currentPosition = 0; // -10 to +10

        // Animation state
        this.isAnimating = false;
        this.animationStart = null;
        this.animationDuration = 800; // ms
        this.startPos = 0;
        this.endPos = 0;

        // Setup canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // Initial draw
        this.draw(0);
    }

    /**
     * Resize canvas to match display size
     */
    resizeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * window.devicePixelRatio;
        this.canvas.height = rect.height * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        this.draw(this.currentPosition);
    }

    /**
     * Animate rope from current position to new position
     * @param {number} newPosition - Target position (-10 to +10)
     */
    animateTo(newPosition) {
        // Cancel any ongoing animation
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }

        this.isAnimating = true;
        this.startPos = this.currentPosition;
        this.endPos = Math.max(-10, Math.min(10, newPosition));
        this.animationStart = performance.now();

        // Start animation loop
        this._animate(performance.now());
    }

    /**
     * Animation loop using requestAnimationFrame
     * @private
     */
    _animate(currentTime) {
        if (!this.isAnimating) return;

        const elapsed = currentTime - this.animationStart;
        const progress = Math.min(elapsed / this.animationDuration, 1);

        // Easing function (easeInOutCubic)
        const eased = this._easeInOutCubic(progress);

        // Calculate current position
        this.currentPosition = this.startPos + (this.endPos - this.startPos) * eased;

        // Draw current state
        this.draw(this.currentPosition);

        // Continue animation or complete
        if (progress < 1) {
            this.animationFrameId = requestAnimationFrame((time) => this._animate(time));
        } else {
            this.isAnimating = false;
            this.currentPosition = this.endPos;
            this.animationFrameId = null;
        }
    }

    /**
     * Easing function for smooth animation
     * @private
     */
    _easeInOutCubic(t) {
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    /**
     * Draw rope at given position
     * @param {number} position - Current rope position (-10 to +10)
     */
    draw(position) {
        const rect = this.canvas.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        // Clear canvas
        this.ctx.clearRect(0, 0, width, height);

        // Calculate rope center based on position
        // position -10 = far left, 0 = center, +10 = far right
        const centerX = width / 2 + (position / 10) * (width * 0.35);
        const centerY = height / 2;

        // Draw victory zones
        this._drawVictoryZones(width, height);

        // Draw rope
        this._drawRope(centerX, centerY, width, height, position);

        // Draw players
        this._drawPlayers(centerX, centerY, width, height);

        // Draw center marker
        this._drawCenterMarker(width, height);
    }

    /**
     * Draw victory zones at ends
     * @private
     */
    _drawVictoryZones(width, height) {
        // Player 1 zone (left) - Red
        this.ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
        this.ctx.fillRect(0, 0, width * 0.15, height);

        // Player 2 zone (right) - Blue
        this.ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
        this.ctx.fillRect(width * 0.85, 0, width * 0.15, height);
    }

    /**
     * Draw the rope
     * @private
     */
    _drawRope(centerX, centerY, width, height, position) {
        // Rope configuration
        const ropeLength = width * 0.6;
        const ropeThickness = 12;
        const segments = 20;

        // Calculate rope endpoints
        const leftX = centerX - ropeLength / 2;
        const rightX = centerX + ropeLength / 2;

        // Draw rope with wave effect
        this.ctx.strokeStyle = '#8B7355';
        this.ctx.lineWidth = ropeThickness;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        this.ctx.beginPath();
        this.ctx.moveTo(leftX, centerY);

        // Create wavy rope effect
        for (let i = 0; i <= segments; i++) {
            const x = leftX + (ropeLength / segments) * i;
            const waveOffset = Math.sin(i * 0.5) * 3;
            this.ctx.lineTo(x, centerY + waveOffset);
        }

        this.ctx.stroke();

        // Draw rope center knot (red flag)
        const knotSize = 30;
        this.ctx.fillStyle = '#EF4444';
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, knotSize / 2, 0, Math.PI * 2);
        this.ctx.fill();

        // Add white center indicator on knot
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('🎯', centerX, centerY);
    }

    /**
     * Draw player indicators
     * @private
     */
    _drawPlayers(centerX, centerY, width, height) {
        const playerSize = 50;
        const ropeLength = width * 0.6;

        // Player 1 (left) - Red
        const p1X = centerX - ropeLength / 2 - playerSize;
        const p1Y = centerY;

        this.ctx.fillStyle = '#EF4444';
        this.ctx.font = `${playerSize}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('🔴', p1X, p1Y);

        // Player 2 (right) - Blue
        const p2X = centerX + ropeLength / 2 + playerSize;
        const p2Y = centerY;

        this.ctx.fillStyle = '#3B82F6';
        this.ctx.fillText('🔵', p2X, p2Y);
    }

    /**
     * Draw center reference marker
     * @private
     */
    _drawCenterMarker(width, height) {
        const centerX = width / 2;

        // Vertical dashed line at true center
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, 0);
        this.ctx.lineTo(centerX, height);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }

    /**
     * Get current position
     * @returns {number} Current rope position
     */
    getCurrentPosition() {
        return this.currentPosition;
    }

    /**
     * Cleanup - cancel animations and remove listeners
     */
    cleanup() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        window.removeEventListener('resize', this.resizeCanvas);
        this.isAnimating = false;
    }
}
