// Initialize Three.js scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Handle window resizing
window.addEventListener('resize', () => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;
    renderer.setSize(newWidth, newHeight);
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
});

// Add directional light to the scene
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Initialize player's spaceship
let playerShip;
const initPlayerShip = () => {
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshStandardMaterial({ map: spaceshipTexture, transparent: true });
    playerShip = new THREE.Mesh(geometry, material);
    scene.add(playerShip);
};

// Load the spaceship texture
const textureLoader = new THREE.TextureLoader();
const spaceshipTexture = textureLoader.load('./models/playerSpaceShip.png', () => {
    initPlayerShip(); // Initialize player's spaceship after texture is loaded
}, undefined, (error) => {
    console.error('An error occurred while loading the texture:', error);
});

// Set initial position for player's spaceship
let shipPositionX = 0;

// Handle keyboard input for player's spaceship movement
document.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'ArrowLeft':
            shipPositionX -= 0.1; // Move left
            break;
        case 'ArrowRight':
            shipPositionX += 0.1; // Move right
            break;
        default:
            break;
    }
});

// Game loop
const animate = function () {
    requestAnimationFrame(animate);

    // Update player's spaceship position based on keyboard input
    if (playerShip) {
        playerShip.position.x = shipPositionX;
    }

    renderer.render(scene, camera);
};

// Set camera position
camera.position.z = 5;

// Start the game loop
animate();
