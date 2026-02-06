import { Ball } from './Ball';
import { Paddle } from './Paddle';
import type { Difficulty } from '../types';
import { AI_CONFIGS } from '../types';

export class PingPongAI {
    private difficulty: Difficulty;
    private reactionDelay: number = 0;
    private targetX: number = 0;

    constructor(difficulty: Difficulty) {
        this.difficulty = difficulty;
    }

    public update(ball: Ball, paddle: Paddle, deltaTime: number) {
        const config = AI_CONFIGS[this.difficulty];

        // 更新反應延遲
        this.reactionDelay += deltaTime;

        // 只在球朝 AI 方向移動時才反應
        if (ball.state.velocity.z < 0) {
            // 反應時間到了才更新目標
            if (this.reactionDelay > config.reactionTime) {
                this.reactionDelay = 0;
                this.targetX = this.predictBallX(ball, config.accuracy);
            }

            // 移動到目標位置
            paddle.setTargetX(this.targetX);
        } else {
            // 球不在這邊時，回到中間
            paddle.setTargetX(0);
        }
    }

    private predictBallX(ball: Ball, accuracy: number): number {
        const { position, velocity } = ball.state;

        // 簡單預測：假設球以當前速度直線飛行
        const timeToReach = Math.abs(position.z / velocity.z);
        let predictedX = position.x + velocity.x * timeToReach;

        // 根據準確度添加誤差
        const error = (Math.random() - 0.5) * (1 - accuracy) * 0.4;
        predictedX += error;

        return predictedX;
    }

    public setDifficulty(difficulty: Difficulty) {
        this.difficulty = difficulty;
        this.reactionDelay = 0;
    }
}
