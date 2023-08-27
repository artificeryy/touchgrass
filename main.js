import * as THREE from "three";
import './style.css'
import gsap from "gsap"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

import grassVertexShader from './grass_vertex.glsl'
import grassFragmentShader from './grass_fragment.glsl'

// Scene
const scene = new THREE.Scene()

// Axes Helper
const axesHelper = new THREE.AxesHelper(16);
//scene.add(axesHelper);

// Grid Helper
const gridHelper = new THREE.GridHelper(100, 100);
scene.add(gridHelper);

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
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = true
controls.enableZoom = true
//controls.autoRotate = true
//controls.autoRotateSpeed = 5

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
// Import grass texture
const grassTexture = new THREE.TextureLoader().load("./textures/Grass-Blade_01.jpg")

// define uniform data
const uniformData = {
  u_time: {
    type: 'f',
    value: clock.getElapsedTime(),
  },
  grassTexture : {
    value: grassTexture
  }
};

// Create Mesh
const leavesMaterial = new THREE.ShaderMaterial({
  uniforms: uniformData,
  vertexShader: grassVertexShader,
  fragmentShader: grassFragmentShader,
  side: THREE.DoubleSide
});

const instanceNumber = 1;
const dummy = new THREE.Object3D();

const geometry = new THREE.PlaneGeometry( 0.1, 1, 1, 4 );
geometry.translate( 0, 0.5, 0 ); // move grass blade geometry lowest point at 0.

const instancedMesh = new THREE.InstancedMesh( geometry, leavesMaterial, instanceNumber );

scene.add( instancedMesh );

// Position and scale the grass blade instances randomly.


const animate = () => {
    controls.update()
    uniformData.u_time.value = clock.getElapsedTime();
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
}

animate();

// Timeline
const tl = gsap.timeline({ defaults: { duration: 1 } })
tl.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 })
tl.fromTo('nav', { y: "-100%" }, { y: "0%" })
tl.fromTo(".title", { opacity: 0 }, { opacity: 1 })