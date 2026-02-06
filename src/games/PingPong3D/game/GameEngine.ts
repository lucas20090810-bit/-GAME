import * as THREE from 'three';
import { PingPongScene } from './Scene';
import { Ball } from './Ball';
import { Paddle } from './Paddle';
import { PingPongAI } from './AI';
import { TouchControls } from './Controls';
import type { Difficulty } from '../types';

export interface GameState {
    playerScore: number;
    aiScore: number;
    isPlaying: boolean;
    servingPlayer: 'player' | 'ai';
}

export class PingPongGame {
    private scene: PingPongScene;
    private ball: Ball;
    private playerPaddle: Paddle;
    private aiPaddle: Paddle;
    private ai: PingPongAI;
    private controls: TouchControls;
    private clock: THREE.Clock;
    private animationId: number | null = null;

    public state: GameState;
    public onScoreUpdate?: (playerScore: number, aiScore: number) => void;
    public onGameEnd?: (winner: 'player' | 'ai') => void;

    constructor(canvas: HTMLCanvasElement, difficulty: Difficulty) {
        // 創建場景
        this.scene = new PingPongScene(canvas);

        // 創建遊戲實體
        this.ball = new Ball(this.scene.scene);
        this.playerPaddle = new Paddle(this.scene.scene, true);
        this.aiPaddle = new Paddle(this.scene.scene, false);

        // 創建 AI 和控制
        this.ai = new PingPongAI(difficulty);
        this.controls = new TouchControls(canvas, this.playerPaddle);

        // 初始化狀態
        this.state = {
            playerScore: 0,
            aiScore: 0,
            isPlaying: false,
            servingPlayer: 'player',
        };

        this.clock = new THREE.Clock();
    }

    public start() {
        this.state.isPlaying = true;
        this.ball.reset(this.state.servingPlayer);
        this.clock.start();
        this.animate();
    }

    public pause() {
        this.state.isPlaying = false;
        if (this.animationId !== null) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    public reset() {
        this.state.playerScore = 0;
        this.state.aiScore = 0;
        this.state.servingPlayer = 'player';
        this.ball.reset(this.state.servingPlayer);
        if (this.onScoreUpdate) {
            this.onScoreUpdate(0, 0);
        }
    }

    private animate = () => {
        this.animationId = requestAnimationFrame(this.animate);

        if (!this.state.isPlaying) return;

        const deltaTime = Math.min(this.clock.getDelta(), 0.1); // 限制最大 delta

        // 更新球
        this.ball.update(deltaTime);

        // 更新玩家球拍
        this.playerPaddle.update(deltaTime);

        // 更新 AI
        this.ai.update(this.ball, this.aiPaddle, deltaTime);
        this.aiPaddle.update(deltaTime);

        // 檢查碰撞
        this.checkCollisions();

        // 檢查得分
        this.checkScoring();

        // 渲染
        this.scene.render();
    };

    private checkCollisions() {
        // 玩家球拍碰撞
        if (this.playerPaddle.checkBallCollision(this.ball) && this.ball.state.velocity.z > 0) {
            this.ball.hitByPaddle(
                this.playerPaddle.state.position.x,
                this.playerPaddle.state.position.y,
                this.playerPaddle.state.position.z
            );
        }

        // AI 球拍碰撞
        if (this.aiPaddle.checkBallCollision(this.ball) && this.ball.state.velocity.z < 0) {
            this.ball.hitByPaddle(
                this.aiPaddle.state.position.x,
                this.aiPaddle.state.position.y,
                this.aiPaddle.state.position.z
            );
        }
    }

    private checkScoring() {
        if (this.ball.isOutOfBounds()) {
            // 判定得分
            if (this.ball.state.position.z > 0) {
                // 球在玩家這側出界 → AI 得分
                this.state.aiScore++;
                this.state.servingPlayer = 'ai';
            } else {
                // 球在 AI 這側出界 → 玩家得分
                this.state.playerScore++;
                this.state.servingPlayer = 'player';
            }

            // 通知分數更新
            if (this.onScoreUpdate) {
                this.onScoreUpdate(this.state.playerScore, this.state.aiScore);
            }

            // 檢查遊戲結束
            if (this.state.playerScore >= 11 || this.state.aiScore >= 11) {
                const winner = this.state.playerScore >= 11 ? 'player' : 'ai';
                this.pause();
                if (this.onGameEnd) {
                    this.onGameEnd(winner);
                }
            } else {
                // 重置球
                setTimeout(() => {
                    this.ball.reset(this.state.servingPlayer);
                }, 1000);
            }
        }
    }

    public setDifficulty(difficulty: Difficulty) {
        this.ai.setDifficulty(difficulty);
    }

    public dispose() {
        this.pause();
        this.controls.dispose();
        this.ball.dispose(this.scene.scene);
        this.playerPaddle.dispose(this.scene.scene);
        this.aiPaddle.dispose(this.scene.scene);
        this.scene.dispose();
    }
}
