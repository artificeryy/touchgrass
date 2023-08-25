import * as THREE from "three";
import './style.css'
import gsap from "gsap"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

// Scene
const scene = new THREE.Scene()

// Axes Helper
const axesHelper = new THREE.AxesHelper(16);
scene.add(axesHelper);

// Create our sphere
const boxGeometry = new THREE.BoxGeometry(16, 16, 16, 16, 16, 16);
const boxMaterial = new THREE.ShaderMaterial({
    wireframe: true,
    vertexShader: `
      void main()	{
        // projectionMatrix, modelViewMatrix, position -> passed in from Three.js
        gl_Position = projectionMatrix
          * modelViewMatrix
          * vec4(position.x, position.y, position.z, 1.0);
      }
      `,
    fragmentShader: `
      void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
      }
      `,
});
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(boxMesh);

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
camera.position.z = 20
scene.add(camera)

// Renderer
const canvas = document.querySelector(".webgl")
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
controls.enableZoom = false
controls.autoRotate = true
controls.autoRotateSpeed = 5

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

const animate = () => {
    controls.update()
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
}

animate();

// Timeline
const tl = gsap.timeline({ defaults: { duration: 1 } })
tl.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 })
tl.fromTo('nav', { y: "-100%" }, { y: "0%" })
tl.fromTo(".title", { opacity: 0 }, { opacity: 1 })