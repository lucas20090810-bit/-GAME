import * as THREE from 'three';
import type { PaddleState } from '../types';
import { DEFAULT_CONFIG } from '../types';

export class Paddle {
    public mesh: THREE.Mesh;
    public state: PaddleState;

    constructor(scene: THREE.Scene, isPlayer: boolean) {
        const { paddleWidth, paddleHeight, tableHeight, tableLength } = DEFAULT_CONFIG;

        // 創建球拍（真實感橡膠材質）
        const geometry = new THREE.BoxGeometry(paddleWidth, 0.015, paddleHeight);
        const material = new THREE.MeshStandardMaterial({
            color: isPlayer ? 0xcc3333 : 0x3333cc,  // 玩家深紅色，AI深藍色
            roughness: 0.4,
            metalness: 0.2,
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        // 初始位置（玩家在下方，AI在上方）
        const zPos = isPlayer ? tableLength / 2 + 0.3 : -tableLength / 2 - 0.3;
        this.mesh.position.set(0, tableHeight + 0.01, zPos);

        scene.add(this.mesh);

        // 初始化狀態
        this.state = {
            position: this.mesh.position.clone(),
            velocity: new THREE.Vector3(0, 0, 0),
            targetPosition: this.mesh.position.clone(),
        };
    }

    public update(deltaTime: number) {
        const { tableWidth } = DEFAULT_CONFIG;
        const LERP_FACTOR = 8; // 平滑移動係數

        // 平滑移動到目標位置
        const diff = this.state.targetPosition.x - this.state.position.x;
        this.state.velocity.x = diff * LERP_FACTOR * deltaTime;
        this.state.position.x += this.state.velocity.x;

        // 邊界限制
        this.state.position.x = Math.max(
            -tableWidth / 2 + 0.075,
            Math.min(tableWidth / 2 - 0.075, this.state.position.x)
        );

        // 更新網格位置
        this.mesh.position.x = this.state.position.x;
    }

    public setTargetX(x: number) {
        this.state.targetPosition.x = x;
    }

    public checkBallCollision(ball: any): boolean {
        const { ballRadius, paddleWidth, paddleHeight } = DEFAULT_CONFIG;

        const ballPos = ball.state.position;
        const paddlePos = this.state.position;

        // 簡單的AABB碰撞檢測
        const dx = Math.abs(ballPos.x - paddlePos.x);
        const dz = Math.abs(ballPos.z - paddlePos.z);
        const dy = ballPos.y - paddlePos.y;

        return (
            dx < paddleWidth / 2 + ballRadius &&
            dz < paddleHeight / 2 + ballRadius &&
            dy < ballRadius + 0.02 &&
            dy > 0
        );
    }

    public dispose(scene: THREE.Scene) {
        scene.remove(this.mesh);
        this.mesh.geometry.dispose();
        (this.mesh.material as THREE.Material).dispose();
    }
}
