import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';


const w = window.innerWidth;
const h = window.innerHeight;

const scene = new THREE.Scene({antialias: true});
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.set(4, 2.5, -1)
// camera.position.set(0, 4.5, 0)
camera.lookAt(0, 0, 0)

// const controls = new OrbitControls(camera, document.body);
// controls.enableDamping = true;
// controls.dampingFactor = 0.25;


const renderer = new THREE.WebGLRenderer()
renderer.setSize(w, h)
renderer.xr.enabled = true 

renderer.setClearColor(0x808080); // fondo blanco


document.body.appendChild(renderer.domElement)
document.body.appendChild(VRButton.createButton(renderer));


let rueda1, rueda2

const loader = new GLTFLoader()
let mixer
let animations
loader.load('molino.glb', (gltf) => {
    scene.add(gltf.scene);
    console.log(gltf.animations)
    rueda1 = gltf.scene.getObjectByName('rueda1')
    rueda2 = gltf.scene.getObjectByName('rueda2')
    
    mixer = new THREE.AnimationMixer(gltf.scene);
    animations = gltf.animations;

    animations.forEach((clip) => {
        const action = mixer.clipAction(clip);
        action.setLoop(THREE.LoopRepeat, Infinity); // Configurar loop infinito
        action.play(); // Reproducir la animación
    });
  });

function playAnimation() {
    animations.forEach((clip) => {
        const action = mixer.clipAction(clip);
        action.play();
        action.setLoop(THREE.LoopRepeat, Infinity);
    })
}
  

function rotateWheel() {
    if (rueda1 && rueda2) {
        rueda1.rotation.x -= 0.03;
        rueda2.rotation.x -= 0.03;
    }
}
// Luz ambiental para iluminar todo suavemente
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

// Luz direccional simulando el sol
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 10, 7);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Opcional: luz de relleno para eliminar sombras duras
const fillLight = new THREE.PointLight(0xffffff, 1);
fillLight.position.set(-5, 5, 5);
scene.add(fillLight);

const piso = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({ color: 0x444444 })
  );
  piso.rotation.x = -Math.PI / 2;
  piso.position.y = -2;
  scene.add(piso);
  

const clock = new THREE.Clock(); 
function animate(){
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    rotateWheel()
    // controls.update()
    const deltaTime = clock.getDelta(); 
    if (mixer) mixer.update(deltaTime); // Actualizar el mezclador de animaciones
    // playAnimation()
    
}
animate()