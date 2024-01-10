class SpaceGame {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.playerShip = null;
        this.enemyShips = [];
        this.projectiles = [];
        this.shipPositionX = 0;

        this.initialize();
    }

    initialize() {
        this.setupRenderer();
        this.setupEventListeners();
        this.setupLighting();
        this.loadTexturesAndInitializeObjects();
        this.setupCameraPosition();
        this.startGameLoop();
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
        }, undefined, (error) => {
            console.error('An error occurred while loading the texture:', error);
        });
    }

    initPlayerShip(spaceshipTexture) {
        const geometry = new THREE.PlaneGeometry(1, 1);
        const material = new THREE.MeshStandardMaterial({ map: spaceshipTexture, transparent: true });
        this.playerShip = new THREE.Mesh(geometry, material);
        this.scene.add(this.playerShip);
    }

    initEnemyShips(textureLoader) {
        const enemyTextures = [
            textureLoader.load('./models/enemyModel1.png'),
            textureLoader.load('./models/enemyModel2.png')
        ];

        for (let i = 0; i < 2; i++) {
            const geometry = new THREE.PlaneGeometry(1, 1);
            const material = new THREE.MeshStandardMaterial({ map: enemyTextures[i], transparent: true });
            const enemyShip = new THREE.Mesh(geometry, material);
            enemyShip.position.x = (i - 0.5) * 2;
            enemyShip.position.y = 3;
            enemyShip.isDestroyed = false;
            this.scene.add(enemyShip);
            this.enemyShips.push(enemyShip);
        }
    }

    setupCameraPosition() {
        this.camera.position.z = 5;
    }

    startGameLoop() {
        this.animate();
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.updatePlayerShipPosition();
        this.updateEnemyShips();
        this.updateProjectiles();
        this.renderer.render(this.scene, this.camera);
    }

    handleWindowResize() {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        this.renderer.setSize(newWidth, newHeight);
        this.camera.aspect = newWidth / newHeight;
        this.camera.updateProjectionMatrix();
    }

    handleKeyDown(event) {
        switch (event.code) {
            case 'ArrowLeft':
                this.movePlayerShipLeft();
                break;
            case 'ArrowRight':
                this.movePlayerShipRight();
                break;
            case 'Space':
                this.createProjectile();
                break;
            default:
                break;
        }
    }

    movePlayerShipLeft() {
        this.shipPositionX -= 0.1;
    }

    movePlayerShipRight() {
        this.shipPositionX += 0.1;
    }

    createProjectile() {
        const geometry = new THREE.SphereGeometry(0.05, 32, 32);
        const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        const projectile = new THREE.Mesh(geometry, material);
        projectile.position.copy(this.playerShip.position);
        this.scene.add(projectile);
        this.projectiles.push(projectile);
    }

    updatePlayerShipPosition() {
        if (this.playerShip) {
            this.playerShip.position.x = this.shipPositionX;
        }
    }

    updateEnemyShips() {
        for (const enemyShip of this.enemyShips) {
            if (!enemyShip.isDestroyed) {
                enemyShip.position.y -= 0.01 / 3;

                if (enemyShip.position.y < -3) {
                    this.delayedRespawn(enemyShip);
                }

                this.handleEnemyShipCollision(enemyShip);
            } else {
                this.delayedRespawn(enemyShip);
            }
        }
    }

    delayedRespawn(enemyShip) {
        enemyShip.position.set(
            (Math.random() - 0.5) * 10,
            3
        );

        setTimeout(() => {
            enemyShip.isDestroyed = false;
        }, 2000);
    }

    handleEnemyShipCollision(enemyShip) {
        for (let i = 0; i < this.projectiles.length; i++) {
            const projectile = this.projectiles[i];
            if (
                projectile.position.x < enemyShip.position.x + 0.5 &&
                projectile.position.x > enemyShip.position.x - 0.5 &&
                projectile.position.y < enemyShip.position.y + 0.5 &&
                projectile.position.y > enemyShip.position.y - 0.5
            ) {
                this.handleCollision(projectile, enemyShip, i);
            }
        }
    }

    handleCollision(projectile, enemyShip, index) {
        this.scene.remove(projectile);
        enemyShip.isDestroyed = true;
        this.projectiles.splice(index, 1);
    }

    updateProjectiles() {
        for (let i = 0; i < this.projectiles.length; i++) {
            this.projectiles[i].position.y += 0.1;
            this.removeOutOfViewProjectiles(i);
        }
    }

    removeOutOfViewProjectiles(index) {
        if (this.projectiles[index].position.y > 10) {
            this.scene.remove(this.projectiles[index]);
            this.projectiles.splice(index, 1);
        }
    }
}

new SpaceGame();
