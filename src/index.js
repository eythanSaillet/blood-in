import './style/main.styl'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'


/**
 * Cursor
 */

const cursor = { x: 0, y: 0}
window.addEventListener('mousemove', (_event) =>
{
    cursor.x = _event.clientX / sizes.width - 0.5
    cursor.y = _event.clientY / sizes.height - 0.5
})


/**
 * Sizes
 */

const sizes = {}
sizes.width = window.innerWidth
sizes.height = window.innerHeight


/**
 * Scene
 */

const scene = new THREE.Scene()


/**
 * Camera
 */

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 20)
camera.position.z = 10
scene.add(camera)


/**
 * Lights
 */

const pointLight = new THREE.PointLight(0xff9000, 0.3, 10)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
scene.add(ambientLight)


/**
 * Object
 */

const normalMaterial = new THREE.MeshNormalMaterial()


// Torus Knot
const torusKnot = new THREE.Mesh(new THREE.TorusKnotGeometry(1.5, 0.5, 128, 16), normalMaterial)
scene.add(torusKnot)


/**
 * Renderer
 */

const renderer = new THREE.WebGLRenderer()
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild(renderer.domElement)
renderer.render(scene, camera)


/**
 * Camera Controls
 */

const cameraControls = new OrbitControls(camera, renderer.domElement)
cameraControls.zoomSpeed = 0.3
cameraControls.enableDamping = true


/**
 * Resize
 */

window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
})

/**
 * Loop
 */

const loop = () =>
{
    window.requestAnimationFrame(loop)
    
    // CAMERA
    cameraControls.update()

    // Render
    renderer.render(scene, camera)
}
loop()