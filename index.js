class SpaceGame {
    constructor() {
        this.initializeScene();
        this.setupRenderer();
        this.setupEventListeners();
        this.setupLighting();
        this.loadTexturesAndInitializeObjects();
        this.setupCameraPosition();
        this.startGameLoop();
    }

    initializeScene() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.playerShip = null;
        this.enemyShips = [];
        this.projectiles = [];
        this.shipPositionX = 0;
    }

    setupRenderer() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.handleWindowResize());
        document.addEventListener('keydown', (event) => this.handleKeyDown(event));
    }

    setupLighting() {
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
    }

    loadTexturesAndInitializeObjects() {
        const textureLoader = new THREE.TextureLoader();
        const spaceshipTexture = textureLoader.load('./models/playerSpaceShip.png', () => {
            this.initPlayerShip(spaceshipTexture);
            this.initEnemyShips(textureLoader);
        }, undefined, (error) => console.error('An error occurred:', error));
    }

    initPlayerShip(texture) {
        this.playerShip = this.createMesh(texture);
        this.scene.add(this.playerShip);
    }

    initEnemyShips(textureLoader) {
        const enemyTextures = [
            textureLoader.load('./models/enemyModel1.png'),
            textureLoader.load('./models/enemyModel2.png')
        ];
        enemyTextures.forEach((texture, i) => {
            const enemyShip = this.createMesh(texture);
            enemyShip.position.set((i - 0.5) * 2, 3, 0);
            this.scene.add(enemyShip);
            this.enemyShips.push(enemyShip);
        });
    }

    createMesh(texture) {
        const geometry = new THREE.PlaneGeometry(1, 1);
        const material = new THREE.MeshStandardMaterial({ map: texture, transparent: true });
        return new THREE.Mesh(geometry, material);
    }

    setupCameraPosition() {
        this.camera.position.z = 5;
    }

    startGameLoop() {
        this.animate();
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.updateEntities();
        this.renderer.render(this.scene, this.camera);
    }

    updateEntities() {
        this.updatePlayerShipPosition();
        this.updateEnemyShips();
        this.updateProjectiles();
    }

    handleWindowResize() {
        const { innerWidth: width, innerHeight: height } = window;
        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    handleKeyDown(event) {
        const actions = {
            'ArrowLeft': () => this.shipPositionX -= 0.1,
            'ArrowRight': () => this.shipPositionX += 0.1,
            'Space': () => this.createProjectile()
        };
        actions[event.code]?.();
    }

    createProjectile() {
        const projectile = this.createMesh(new THREE.MeshStandardMaterial({ color: 0xff0000 }));
        projectile.position.copy(this.playerShip.position);
        this.scene.add(projectile);
        this.projectiles.push(projectile);
    }

    updatePlayerShipPosition() {
        if (this.playerShip) this.playerShip.position.x = this.shipPositionX;
    }

    updateEnemyShips() {
        this.enemyShips.forEach((enemyShip) => {
            enemyShip.position.y -= 0.01;
            this.handleCollisionWithEnemy(enemyShip);
            this.removeOutOfViewEntities(this.enemyShips, enemyShip);
        });
    }

    handleCollisionWithEnemy(enemyShip) {
        this.projectiles.forEach((projectile, index) => {
            if (this.detectCollision(projectile, enemyShip)) this.handleCollision(projectile, enemyShip, index);
        });
    }

    detectCollision(obj1, obj2) {
        const tolerance = 0.5;
        return Math.abs(obj1.position.x - obj2.position.x) < tolerance &&
               Math.abs(obj1.position.y - obj2.position.y) < tolerance;
    }

    handleCollision(projectile, enemyShip, index) {
        this.scene.remove(projectile);
        this.scene.remove(enemyShip);
        this.projectiles.splice(index, 1);
        this.enemyShips.splice(this.enemyShips.indexOf(enemyShip), 1);
    }

    removeOutOfViewEntities(entities, entity) {
        if (entity.position.y < -3) {
            this.scene.remove(entity);
            entities.splice(entities.indexOf(entity), 1);
        }
    }

    updateProjectiles() {
        this.projectiles.forEach((projectile, index) => {
            projectile.position.y += 0.1;
            this.removeOutOfViewEntities(this.projectiles, projectile);
        });
    }
}

// Initialize the game
new SpaceGame();
