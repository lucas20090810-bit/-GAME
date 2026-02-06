import { Paddle } from './Paddle';

export class TouchControls {
    private lastTouchX: number = 0;
    private isTouching: boolean = false;
    private canvas: HTMLCanvasElement;
    private paddle: Paddle;
    private sensitivity: number = 0.003;

    constructor(canvas: HTMLCanvasElement, paddle: Paddle) {
        this.canvas = canvas;
        this.paddle = paddle;

        this.setupListeners();
    }

    private setupListeners() {
        // 觸控事件
        this.canvas.addEventListener('touchstart', this.handleTouchStart);
        this.canvas.addEventListener('touchmove', this.handleTouchMove);
        this.canvas.addEventListener('touchend', this.handleTouchEnd);

        // 滑鼠事件（測試用）
        this.canvas.addEventListener('mousedown', this.handleMouseDown);
        this.canvas.addEventListener('mousemove', this.handleMouseMove);
        this.canvas.addEventListener('mouseup', this.handleMouseUp);
    }

    private handleTouchStart = (e: TouchEvent) => {
        e.preventDefault();
        this.isTouching = true;
        this.lastTouchX = e.touches[0].clientX;
    };

    private handleTouchMove = (e: TouchEvent) => {
        if (!this.isTouching) return;
        e.preventDefault();

        const touchX = e.touches[0].clientX;
        const deltaX = touchX - this.lastTouchX;

        // 更新球拍目標位置
        const currentTarget = this.paddle.state.targetPosition.x;
        this.paddle.setTargetX(currentTarget + deltaX * this.sensitivity);

        this.lastTouchX = touchX;
    };

    private handleTouchEnd = (e: TouchEvent) => {
        e.preventDefault();
        this.isTouching = false;
    };

    private handleMouseDown = (e: MouseEvent) => {
        this.isTouching = true;
        this.lastTouchX = e.clientX;
    };

    private handleMouseMove = (e: MouseEvent) => {
        if (!this.isTouching) return;

        const deltaX = e.clientX - this.lastTouchX;
        const currentTarget = this.paddle.state.targetPosition.x;
        this.paddle.setTargetX(currentTarget + deltaX * this.sensitivity);

        this.lastTouchX = e.clientX;
    };

    private handleMouseUp = () => {
        this.isTouching = false;
    };

    public dispose() {
        this.canvas.removeEventListener('touchstart', this.handleTouchStart);
        this.canvas.removeEventListener('touchmove', this.handleTouchMove);
        this.canvas.removeEventListener('touchend', this.handleTouchEnd);
        this.canvas.removeEventListener('mousedown', this.handleMouseDown);
        this.canvas.removeEventListener('mousemove', this.handleMouseMove);
        this.canvas.removeEventListener('mouseup', this.handleMouseUp);
    }
}
