import * as THREE from 'three';

export interface BallState {
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    spin: THREE.Vector3;
}

export interface PaddleState {
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    targetPosition: THREE.Vector3;
}

export interface GameConfig {
    tableWidth: number;
    tableLength: number;
    tableHeight: number;
    ballRadius: number;
    paddleWidth: number;
    paddleHeight: number;
    gravity: number;
    bounceFactor: number;
}

export const DEFAULT_CONFIG: GameConfig = {
    tableWidth: 1.525,      // 標準桌球桌寬度（米）
    tableLength: 2.74,      // 標準桌球桌長度（米）
    tableHeight: 0.76,      // 桌面高度
    ballRadius: 0.02,       // 球半徑（40mm）
    paddleWidth: 0.15,      // 球拍寬度
    paddleHeight: 0.25,     // 球拍高度
    gravity: 9.8,           // 重力加速度
    bounceFactor: 0.7,      // 反彈係數
};

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface AIConfig {
    reactionTime: number;   // 反應時間（秒）
    accuracy: number;       // 準確度（0-1）
    speed: number;          // 移動速度倍數
}

export const AI_CONFIGS: Record<Difficulty, AIConfig> = {
    easy: {
        reactionTime: 0.4,
        accuracy: 0.5,
        speed: 2,
    },
    medium: {
        reactionTime: 0.2,
        accuracy: 0.75,
        speed: 4,
    },
    hard: {
        reactionTime: 0.1,
        accuracy: 0.95,
        speed: 7,
    },
};
