export function initializeScene(spaceGame) {
    spaceGame.scene = new THREE.Scene();
    spaceGame.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    spaceGame.playerShip = null;
    spaceGame.enemyShips = [];
    spaceGame.projectiles = [];
    spaceGame.shipPositionX = 0;
}
