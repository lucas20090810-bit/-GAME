import * as THREE from 'three';
import type { BallState } from '../types';
import { DEFAULT_CONFIG } from '../types';

export class Ball {
    public mesh: THREE.Mesh;
    public state: BallState;
    private shadow: THREE.Mesh;
    private lastBounceTime: number = 0; // 防止連續得分

    constructor(scene: THREE.Scene) {
        const { ballRadius } = DEFAULT_CONFIG;

        // 創建球體
        const geometry = new THREE.SphereGeometry(ballRadius, 32, 32);
        const material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.2,
            metalness: 0.1,
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = true;
        scene.add(this.mesh);

        // 創建陰影（投影到桌面）
        const shadowGeometry = new THREE.CircleGeometry(ballRadius * 1.5, 16);
        const shadowMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.3,
        });
        this.shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
        this.shadow.rotation.x = -Math.PI / 2;
        this.shadow.position.y = DEFAULT_CONFIG.tableHeight + 0.001;
        scene.add(this.shadow);

        // 初始化狀態
        this.state = {
            position: new THREE.Vector3(0, DEFAULT_CONFIG.tableHeight + 0.5, 0),
            velocity: new THREE.Vector3(0, 0, 0),
            spin: new THREE.Vector3(0, 0, 0),
        };

        this.updateMesh();
    }

    public reset(servingPlayer: 'player' | 'ai') {
        const { tableHeight, tableLength } = DEFAULT_CONFIG;

        // 重置位置（在發球方的一側）
        const zPos = servingPlayer === 'player' ? tableLength / 4 : -tableLength / 4;
        this.state.position.set(0, tableHeight + 0.3, zPos);

        // 重置速度（向對方發球）- 速度放慢很多
        const direction = servingPlayer === 'player' ? -1 : 1;
        this.state.velocity.set(0, 2.5, direction * 1.8); // 降低水平速度，提高初始向上速度
        this.state.spin.set(0, 0, 0);

        this.lastBounceTime = 0; // 重置計時

        this.updateMesh();
    }

    public update(deltaTime: number) {
        const { gravity, tableHeight, tableWidth, bounceFactor } = DEFAULT_CONFIG;

        // 應用重力（減緩重力）
        this.state.velocity.y -= gravity * 0.7 * deltaTime; // 降低重力影響

        // 更新位置
        this.state.position.add(
            this.state.velocity.clone().multiplyScalar(deltaTime)
        );

        // 與桌面碰撞
        if (this.state.position.y <= tableHeight && this.isOverTable()) {
            this.state.position.y = tableHeight;
            this.state.velocity.y = -this.state.velocity.y * bounceFactor;

            // 添加一點水平摩擦
            this.state.velocity.x *= 0.95;
            this.state.velocity.z *= 0.95;

            this.lastBounceTime = Date.now(); // 記錄彈跳時間
        }

        // 邊界檢查（左右）
        if (Math.abs(this.state.position.x) > tableWidth / 2 && this.state.position.y > tableHeight) {
            this.state.velocity.x *= -bounceFactor;
            this.state.position.x = Math.sign(this.state.position.x) * tableWidth / 2;
        }

        this.updateMesh();
    }

    public isOverTable(): boolean {
        const { tableWidth, tableLength } = DEFAULT_CONFIG;
        return (
            Math.abs(this.state.position.x) <= tableWidth / 2 &&
            Math.abs(this.state.position.z) <= tableLength / 2
        );
    }

    public isOutOfBounds(): boolean {
        const { tableHeight } = DEFAULT_CONFIG;

        // 防止剛發球就判定出界 - 必須至少過了0.5秒並且彈跳過一次
        const timeSinceLastBounce = Date.now() - this.lastBounceTime;
        if (timeSinceLastBounce < 500) {
            return false; // 發球後0.5秒內不判定出界
        }

        // 球落地且不在桌上，並且已經開始下落
        return this.state.position.y < (tableHeight - 0.2) && !this.isOverTable() && this.state.velocity.y < 0;
    }

    public hitByPaddle(paddleX: number, _paddleY: number, _paddleZ: number) {
        // 計算擊球偏移量（影響角度）
        const hitOffset = this.state.position.x - paddleX;
        const hitAngle = hitOffset * 3; // 降低角度影響

        // 反轉 Z 速度（反彈回去）- 降低加速
        this.state.velocity.z *= -0.95; //  降低反彈加速

        // 根據擊球位置調整角度
        this.state.velocity.x += hitAngle;

        // 給一點向上的速度
        this.state.velocity.y = Math.abs(this.state.velocity.y) * 0.8 + 2.0; // 更高的向上速度

        // 限制最大速度
        const maxSpeed = 5; // 降低最大速度
        const speed = this.state.velocity.length();
        if (speed > maxSpeed) {
            this.state.velocity.multiplyScalar(maxSpeed / speed);
        }

        this.lastBounceTime = Date.now(); // 記錄擊球時間
    }

    private updateMesh() {
        this.mesh.position.copy(this.state.position);

        // 更新陰影位置（投影到桌面）
        this.shadow.position.x = this.state.position.x;
        this.shadow.position.z = this.state.position.z;

        // 陰影大小隨距離變化
        const distanceToTable = Math.max(0.1, this.state.position.y - DEFAULT_CONFIG.tableHeight);
        const scale = 1 / (1 + distanceToTable * 0.5);
        this.shadow.scale.set(scale, scale, 1);
        (this.shadow.material as THREE.MeshBasicMaterial).opacity = 0.3 * scale;
    }

    public dispose(scene: THREE.Scene) {
        scene.remove(this.mesh);
        scene.remove(this.shadow);
        this.mesh.geometry.dispose();
        (this.mesh.material as THREE.Material).dispose();
        this.shadow.geometry.dispose();
        (this.shadow.material as THREE.Material).dispose();
    }
}
