import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const canvas = document.querySelector('#webgl-canvas');

const scene = new THREE.Scene();
scene.background = new THREE.Color('rgba(20, 24, 44, 1)');

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(2, 2, 3);

const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true // Згладжування країв (антиаліасинг)
});
renderer.setSize(window.innerWidth, window.innerHeight);
// щоб картинка була чіткою одразу
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;  // Плавне гальмування при обертанні
controls.dampingFactor = 0.05;

const clock = new THREE.Clock();

// розсіяне світло
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

// направлене світло
const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

const geometries = [
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.CylinderGeometry(0.5, 0.5, 1, 32),
    new THREE.ConeGeometry(0.6, 1, 4)
];

const textureLoader = new THREE.TextureLoader();

const luckyBlockTexture = textureLoader.load('./lucky_block.jpg');
luckyBlockTexture.colorSpace = THREE.SRGBColorSpace;


const luckyBlockMaterial = new THREE.MeshStandardMaterial({
    map: luckyBlockTexture,
    roughness: 0.2
});

const textureUrls = [
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/brick_diffuse.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/crate.gif',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/uv_grid_opengl.jpg'
];

const textures = textureUrls.map(url => {
    const tex = textureLoader.load(url);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
});

const materials = textures.map(tex => {
    return new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.3,
        metalness: 0.1
    });
});

const modularCube = new THREE.Group();
modularCube.rotation.y += 0.1;
scene.add(modularCube);

const ui = {
    sizeX: document.getElementById('input-x'),
    sizeY: document.getElementById('input-y'),
    sizeZ: document.getElementById('input-z'),
    generateBtn: document.getElementById('btn-generate'),
    explodeBtn: document.getElementById('btn-explode'),
    collectBtn: document.getElementById('btn-collect')
};

const OBJ_DATA = {
    cubes: [],
    targets: [],
    isExploded: false
};

function createVoxel(x, y, z) {
    const randomGeo = geometries[Math.floor(Math.random() * geometries.length)];

    let selectedMaterial;

    if (randomGeo === geometries[0]) {
        //  з шансом 50% ставимо текстуру luckyblock, або звичайну випадкову
        const isLuckyBlock = Math.random() > 0.5;
        selectedMaterial = isLuckyBlock
            ? luckyBlockMaterial
            : materials[Math.floor(Math.random() * materials.length)];
    }
    else {
        selectedMaterial = materials[Math.floor(Math.random() * materials.length)];
    }

    const mesh = new THREE.Mesh(randomGeo, selectedMaterial);
    mesh.position.set(x, y, z);
    mesh.userData.initialPos = mesh.position.clone();

    return mesh;
}


function generateModularCube(xCount = 3, yCount = 3, zCount = 3) {
    // очищаємо попередню сцену
    while (modularCube.children.length) {
        modularCube.remove(modularCube.children[0]);
    }
    OBJ_DATA.cubes = [];
    OBJ_DATA.targets = [];
    OBJ_DATA.isExploded = false;

    const offsetX = (xCount - 1) * 0.5;
    const offsetY = (yCount - 1) * 0.5;
    const offsetZ = (zCount - 1) * 0.5;

    // сітка фігур, де кожна фігура отримує свої координати в просторі
    for (let x = 0; x < xCount; x++) {
        for (let y = 0; y < yCount; y++) {
            for (let z = 0; z < zCount; z++) {
                // координати кожної фігури
                const mesh = createVoxel(
                    x - offsetX,
                    y - offsetY,
                    z - offsetZ
                );
                modularCube.add(mesh);
                OBJ_DATA.cubes.push(mesh);
            }
        }
    }
}

function explode() {
    OBJ_DATA.isExploded = true;
    OBJ_DATA.targets = [];

    OBJ_DATA.cubes.forEach((mesh) => {
        // вектор напрямку від центру сцени (0,0,0) до фігурки
        const direction = mesh.position.clone().normalize();

        // Якщо фігурка була в центрі (0,0,0) - задаємо випадковий напрямок
        if (direction.length() === 0) {
            direction.set(
                Math.random() - 0.5,
                Math.random() - 0.5,
                Math.random() - 0.5
            ).normalize();
        }

        // Відстань, на яку розлітаються шматочки (від 4 до 8 одиниць)
        const explosionDistance = 4 + Math.random() * 4;

        //  Кінцева точка розльоту фігур
        const targetX = mesh.position.x + direction.x * explosionDistance;
        const targetY = mesh.position.y + direction.y * explosionDistance;
        const targetZ = mesh.position.z + direction.z * explosionDistance;

        const randomRotX = mesh.rotation.x + (Math.random() - 0.5) * Math.PI * 4;
        const randomRotY = mesh.rotation.y + (Math.random() - 0.5) * Math.PI * 4;
        const randomRotZ = mesh.rotation.z + (Math.random() - 0.5) * Math.PI * 4;

        OBJ_DATA.targets.push({
            mesh: mesh,
            origPos: mesh.position.clone(),
            targetPos: new THREE.Vector3(targetX, targetY, targetZ),
            origRot: mesh.rotation.clone(),
            targetRot: new THREE.Euler(randomRotX, randomRotY, randomRotZ),
            duration: 800 + Math.random() * 400,
            startTime: clock.getElapsedTime() * 1000 + Math.random() * 200
        });
    });
}


function collect() {
    if (!OBJ_DATA.isExploded) return;
    OBJ_DATA.isExploded = false;
    OBJ_DATA.targets = [];

    OBJ_DATA.cubes.forEach(mesh => {
        OBJ_DATA.targets.push({
            mesh: mesh,
            origPos: mesh.position.clone(),
            targetPos: mesh.userData.initialPos.clone(),
            origRot: mesh.rotation.clone(),
            targetRot: new THREE.Euler(0, 0, 0),
            duration: 800 + Math.random() * 300,
            startTime: clock.getElapsedTime() * 1000 + Math.random() * 150
        });
    });
}

ui.generateBtn.addEventListener('click', () => {
    const x = Math.min(10, Math.max(1, parseInt(ui.sizeX.value))) || 3;
    const y = Math.min(10, Math.max(1, parseInt(ui.sizeY.value))) || 3;
    const z = Math.min(10, Math.max(1, parseInt(ui.sizeZ.value))) || 3;
    generateModularCube(x, y, z);
});

ui.explodeBtn.addEventListener('click', explode);
ui.collectBtn.addEventListener('click', collect);

generateModularCube();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});


function animate() {
    requestAnimationFrame(animate);
    controls.update();
    const now = clock.getElapsedTime() * 1000;

    for (let i = 0; i < OBJ_DATA.targets.length; i++) {
        const item = OBJ_DATA.targets[i];

        // Розраховуємо прогрес анімації від 0.0 до 1.0
        const elapsed = now - item.startTime;
        if (elapsed < 0) continue; // затримка
        const progress = Math.min(elapsed / item.duration, 1.0);
        // Функція плавності (Ease Out Cubic для красивого уповільнення)
        const ease = 1 - Math.pow(1 - progress, 3);
        // Плавно переміщуємо меш між origPos та targetPos
        item.mesh.position.lerpVectors(item.origPos, item.targetPos, ease);

        item.mesh.rotation.x = THREE.MathUtils.lerp(item.origRot.x, item.targetRot.x, ease);
        item.mesh.rotation.y = THREE.MathUtils.lerp(item.origRot.y, item.targetRot.y, ease);
        item.mesh.rotation.z = THREE.MathUtils.lerp(item.origRot.z, item.targetRot.z, ease);
    }
    renderer.render(scene, camera);
}

animate();