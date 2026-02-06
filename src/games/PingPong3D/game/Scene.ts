import * as THREE from 'three';
import { DEFAULT_CONFIG } from '../types';

export class PingPongScene {
    public scene: THREE.Scene;
    public camera: THREE.PerspectiveCamera;
    public renderer: THREE.WebGLRenderer;

    constructor(canvas: HTMLCanvasElement) {
        // 創建場景
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e);

        // 設定攝影機（俯視斜角）
        const aspect = canvas.clientWidth / canvas.clientHeight;
        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
        this.camera.position.set(0, 8, 5.5); // 調高攝影機看更大範圍
        this.camera.lookAt(0, 0, 0);

        // 渲染器
        this.renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: false
        });
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // 光源
        this.setupLighting();

        // 創建桌球桌
        this.createTable();

        // 創建地板
        this.createFloor();
    }

    private setupLighting() {
        // 環境光
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // 主光源（上方斜照）
        const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
        mainLight.position.set(2, 8, 3);
        mainLight.castShadow = true;
        mainLight.shadow.camera.left = -5;
        mainLight.shadow.camera.right = 5;
        mainLight.shadow.camera.top = 5;
        mainLight.shadow.camera.bottom = -5;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        this.scene.add(mainLight);

        // 補光（減少陰影過重）
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(-2, 5, -3);
        this.scene.add(fillLight);
    }

    private createTable() {
        const { tableWidth, tableLength, tableHeight } = DEFAULT_CONFIG;

        // 桌面 - 深綠色啞光材質，帶細微紋理感
        const tableMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a5f3a,
            roughness: 0.7,
            metalness: 0.1,
        });

        const tableGeometry = new THREE.BoxGeometry(tableWidth, 0.03, tableLength);
        const table = new THREE.Mesh(tableGeometry, tableMaterial);
        table.position.set(0, tableHeight, 0);
        table.receiveShadow = true;
        table.castShadow = true;
        this.scene.add(table);

        // 白線材質 - 略微光澤
        const lineMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.5,
            metalness: 0.0,
        });

        // 中線
        const centerLine = new THREE.Mesh(
            new THREE.BoxGeometry(tableWidth, 0.031, 0.003),
            lineMaterial
        );
        centerLine.position.set(0, tableHeight + 0.001, 0);
        this.scene.add(centerLine);

        // 邊線
        const edgeThickness = 0.02;

        // 長邊
        [-tableLength / 2, tableLength / 2].forEach(z => {
            const edge = new THREE.Mesh(
                new THREE.BoxGeometry(tableWidth, 0.031, edgeThickness),
                lineMaterial
            );
            edge.position.set(0, tableHeight + 0.001, z);
            this.scene.add(edge);
        });

        // 短邊
        [-tableWidth / 2, tableWidth / 2].forEach(x => {
            const edge = new THREE.Mesh(
                new THREE.BoxGeometry(edgeThickness, 0.031, tableLength),
                lineMaterial
            );
            edge.position.set(x, tableHeight + 0.001, 0);
            this.scene.add(edge);
        });

        // 球網 - 深灰金屬材質
        const netMaterial = new THREE.MeshStandardMaterial({
            color: 0x2a2a3e,
            roughness: 0.6,
            metalness: 0.4,
            side: THREE.DoubleSide,
        });

        const netGeometry = new THREE.BoxGeometry(tableWidth + 0.05, 0.15, 0.01);
        const net = new THREE.Mesh(netGeometry, netMaterial);
        net.position.set(0, tableHeight + 0.075, 0);
        net.castShadow = true;
        this.scene.add(net);

        // 桌腳 - 深色木質感
        const legMaterial = new THREE.MeshStandardMaterial({
            color: 0x3a2f28,
            roughness: 0.8,
            metalness: 0.0,
        });

        const legGeometry = new THREE.CylinderGeometry(0.03, 0.04, tableHeight, 8);
        const legPositions = [
            [-tableWidth / 2 + 0.1, tableHeight / 2, -tableLength / 2 + 0.1],
            [tableWidth / 2 - 0.1, tableHeight / 2, -tableLength / 2 + 0.1],
            [-tableWidth / 2 + 0.1, tableHeight / 2, tableLength / 2 - 0.1],
            [tableWidth / 2 - 0.1, tableHeight / 2, tableLength / 2 - 0.1],
        ];

        legPositions.forEach(([x, y, z]) => {
            const leg = new THREE.Mesh(legGeometry, legMaterial);
            leg.position.set(x, y, z);
            leg.castShadow = true;
            this.scene.add(leg);
        });
    }

    private createFloor() {
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: 0x2a2a3e,
            roughness: 0.9,
            metalness: 0.0,
        });

        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(20, 20),
            floorMaterial
        );
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = 0;
        floor.receiveShadow = true;
        this.scene.add(floor);
    }

    public render() {
        this.renderer.render(this.scene, this.camera);
    }

    public dispose() {
        this.renderer.dispose();
    }

    public handleResize() {
        const canvas = this.renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
}
