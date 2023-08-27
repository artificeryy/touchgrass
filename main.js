import * as THREE from "three";
import './style.css'
import gsap from "gsap"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import grassVertexShader from './shaders/grass_vertex.glsl'
import grassFragmentShader from './shaders/grass_fragment.glsl'
import { CharacterControls } from './characterControls';

// Scene
const scene = new THREE.Scene()
const scene_width = 300
const scene_length = 300

// Grid Helper
const grassFloorTexture = new THREE.TextureLoader().load("textures/grass_floor.jpg");
grassFloorTexture.wrapS = grassFloorTexture.wrapT = THREE.RepeatWrapping;
grassFloorTexture.repeat.set(100, 100);
var grassFloorMaterial = new THREE.MeshStandardMaterial({ map: grassFloorTexture, side: THREE.DoubleSide });

var mesh = new THREE.Mesh(new THREE.PlaneGeometry(scene_width * 10, scene_length * 10), grassFloorMaterial);
mesh.position.y = 0.0;
mesh.rotation.x = - Math.PI / 2;
mesh.receiveShadow = true;
scene.add(mesh);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

// Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.castShadow = true;
light.position.set(0, 32, 64);
scene.add(light)

// Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000)
camera.position.z = 35
scene.add(camera)

// Renderer
const canvas = document.querySelector(".webgl")
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

// Controls
const orbitControls = new OrbitControls(camera, canvas);
orbitControls.enableDamping = true
orbitControls.minDistance = 5
orbitControls.maxDistance = 50
orbitControls.enablePan = false
orbitControls.enableZoom = true
orbitControls.maxPolarAngle = Math.PI / 2 - 0.05
orbitControls.update();

// Character control keys
const keysPressed = {}
window.addEventListener('keydown', (event) => {
  if (event.shiftKey && characterControls) {
    characterControls.switchRunToggle()
  }
  keysPressed[event.key.toLowerCase()] = true
}, false);
window.addEventListener('keyup', (event) => {
  keysPressed[event.key.toLowerCase()] = false
}, false);

// Model with animations
var characterControls
new GLTFLoader().load("models/Fox.glb", function (gltf) {
  const model = gltf.scene
  model.scale.set(0.03, 0.03, 0.03)
  model.traverse(function (obj) {
    if (obj.isMesh) obj.castShadow = true;
  });
  scene.add(model);

  const gltfAnimations = gltf.animations;
  console.log(gltfAnimations)
  const mixer = new THREE.AnimationMixer(model);
  const animationsMap = new Map()
  gltfAnimations.filter(a => a.name != 'TPose').forEach((a) => {
    console.log(a.name)
    animationsMap.set(a.name, mixer.clipAction(a))
  })

  characterControls = new CharacterControls(model, mixer, animationsMap, orbitControls, camera, 'Survey')
})

// Resize
window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  // Update cmaera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)

})

// Define clock
const clock = new THREE.Clock();

//////////////// Grass 1 ////////////////
// Import grass texture
const grassTexture1 = new THREE.TextureLoader().load("./textures/grass_texture.png")
const grassMask1 = new THREE.TextureLoader().load("./textures/grass_mask.png")

// define uniform data
const uniformData1 = {
  u_time: {
    type: 'f',
    value: clock.getElapsedTime(),
  },
  grassTexture: {
    value: grassTexture1
  },
  grassMask: {
    value: grassMask1
  }
};

// Create Mesh
const leavesMaterial1 = new THREE.ShaderMaterial({
  uniforms: uniformData1,
  vertexShader: grassVertexShader,
  fragmentShader: grassFragmentShader,
  side: THREE.DoubleSide
});

const grassDensity1 = 2500 // per 10x10 square
const instanceNumber1 = grassDensity1 * (scene_width / 10) * (scene_length / 10);
const dummy1 = new THREE.Object3D();

const geometry1 = new THREE.PlaneGeometry(0.1, 1, 1, 4);
geometry1.translate(0, 0.5, 0); // move grass blade geometry lowest point at 0.

const instancedMesh1 = new THREE.InstancedMesh(geometry1, leavesMaterial1, instanceNumber1);

scene.add(instancedMesh1);

// Position and scale the grass blade instances randomly.
for (let i = 0; i < instanceNumber1; i++) {

  dummy1.position.set(
    (Math.random() - 0.5) * scene_width,
    0,
    (Math.random() - 0.5) * scene_length
  );

  dummy1.scale.setScalar(0.5 + Math.random() * 0.5);

  dummy1.rotation.y = Math.random() * Math.PI;

  dummy1.updateMatrix();
  instancedMesh1.setMatrixAt(i, dummy1.matrix);

}

//////////////// Grass 2 ////////////////
const grassTexture2 = new THREE.TextureLoader().load("./textures/grass_texture_2.png")
const grassMask2 = new THREE.TextureLoader().load("./textures/grass_mask_2.png")

// define uniform data
const uniformData2 = {
  u_time: {
    type: 'f',
    value: clock.getElapsedTime(),
  },
  grassTexture: {
    value: grassTexture2
  },
  grassMask: {
    value: grassMask2
  }
};

// Create Mesh
const leavesMaterial2 = new THREE.ShaderMaterial({
  uniforms: uniformData2,
  vertexShader: grassVertexShader,
  fragmentShader: grassFragmentShader,
  side: THREE.DoubleSide
});

const grassDensity2 = 250 // per 10x10 square
const instanceNumber2 = grassDensity2 * (scene_width / 10) * (scene_length / 10);
const dummy2 = new THREE.Object3D();

const geometry2 = new THREE.PlaneGeometry(0.1, 1, 1, 4);
geometry2.translate(0, 0.5, 0); // move grass blade geometry lowest point at 0.

const instancedMesh2 = new THREE.InstancedMesh(geometry2, leavesMaterial2, instanceNumber2);

scene.add(instancedMesh2);

// Position and scale the grass blade instances randomly.
for (let i = 0; i < instanceNumber2; i++) {

  dummy2.position.set(
    (Math.random() - 0.5) * scene_width,
    0,
    (Math.random() - 0.5) * scene_length
  );

  dummy2.scale.setScalar(0.5 + Math.random() * 0.5);

  dummy2.rotation.y = Math.random() * Math.PI;

  dummy2.updateMatrix();
  instancedMesh2.setMatrixAt(i, dummy2.matrix);

}

//////////////// Grass 3 ////////////////
const grassTexture3 = new THREE.TextureLoader().load("./textures/grass_texture_3.png")
const grassMask3 = new THREE.TextureLoader().load("./textures/grass_mask_3.png")

// define uniform data
const uniformData3 = {
  u_time: {
    type: 'f',
    value: clock.getElapsedTime(),
  },
  grassTexture: {
    value: grassTexture3
  },
  grassMask: {
    value: grassMask3
  }
};

// Create Mesh
const leavesMaterial3 = new THREE.ShaderMaterial({
  uniforms: uniformData3,
  vertexShader: grassVertexShader,
  fragmentShader: grassFragmentShader,
  side: THREE.DoubleSide
});

const grassDensity3 = 250 // per 10x10 square
const instanceNumber3 = grassDensity3 * (scene_width / 10) * (scene_length / 10);
const dummy3 = new THREE.Object3D();

const geometry3 = new THREE.PlaneGeometry(0.1, 1, 1, 4);
geometry3.translate(0, 0.5, 0); // move grass blade geometry lowest point at 0.

const instancedMesh3 = new THREE.InstancedMesh(geometry3, leavesMaterial3, instanceNumber3);

scene.add(instancedMesh3);

// Position and scale the grass blade instances randomly.
for (let i = 0; i < instanceNumber3; i++) {

  dummy3.position.set(
    (Math.random() - 0.5) * scene_width,
    0,
    (Math.random() - 0.5) * scene_length
  );

  dummy3.scale.setScalar(0.5 + Math.random() * 0.5);

  dummy3.rotation.y = Math.random() * Math.PI;

  dummy3.updateMatrix();
  instancedMesh3.setMatrixAt(i, dummy3.matrix);

}

const animate = () => {
  let mixerUpdateDelta = clock.getDelta();
  if (characterControls) {
    characterControls.update(mixerUpdateDelta, keysPressed);
  }
  uniformData1.u_time.value = clock.getElapsedTime();
  uniformData2.u_time.value = clock.getElapsedTime();
  uniformData3.u_time.value = clock.getElapsedTime();
  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
}

animate();

// Timeline
const tl = gsap.timeline({ defaults: { duration: 1 } })
tl.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 })
tl.fromTo('nav', { y: "-100%" }, { y: "0%" })
tl.fromTo(".title", { opacity: 0 }, { opacity: 1 })