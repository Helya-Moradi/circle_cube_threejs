import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GUI} from 'three/addons/libs/lil-gui.module.min.js';

const amount = 10;
const count = Math.pow(amount, 3);

const mouse = new THREE.Vector2(1, 1);
const raycaster = new THREE.Raycaster();

const color = new THREE.Color();
const white = new THREE.Color().setHex(0xffffff);


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(amount, amount, amount);
camera.lookAt(0, 0, 0);

const light = new THREE.HemisphereLight(0xffffff, 0x888888, 1);
light.position.set(0, 1, 0);
scene.add(light);

const geometry = new THREE.IcosahedronGeometry(0.5, 3);
const material = new THREE.MeshPhongMaterial({color: 0xffffff});

let mesh = new THREE.InstancedMesh(geometry, material, count);

let i = 0;
const offset = (amount - 1) / 2;

const matrix = new THREE.Matrix4();

for (let x = 0; x < amount; x++) {
    for (let y = 0; y < amount; y++) {
        for (let z = 0; z < amount; z++) {
            matrix.setPosition(offset - x, offset - y, offset - z);

            mesh.setMatrixAt(i, matrix);
            mesh.setColorAt(i, color);

            i++;
        }
    }
}

scene.add(mesh);

const gui = new GUI();
gui.add(mesh, 'count', 0, count);

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = false;

window.addEventListener('resize', windowResizeHandler);
document.addEventListener('mousemove', mouseMoveHandler);

function windowResizeHandler() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function mouseMoveHandler(event) {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

function animate() {
    requestAnimationFrame(animate);

    controls.update();

    raycaster.setFromCamera(mouse, camera);

    const intersection = raycaster.intersectObject( mesh );

    if (intersection.length > 0) {
        const instanceId = intersection[0].instanceId;

        mesh.getColorAt(instanceId, color);

        if (color.equals(white)) {
            mesh.setColorAt(instanceId, color.setHex(Math.random() * 0xffffff));

            mesh.instanceColor.needsUpdate = true;
        }
    }

    renderer.render(scene, camera);
}

animate();


