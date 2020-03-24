import './style/main.styl'
import * as THREE from 'three'
import { TweenLite, TimelineLite, Linear} from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


/**
 * Cursor
 */

const cursor = { x: 0, y: 0 }
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

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 10
scene.add(camera)


/**
 * Lights
 */

 // Point light
const pointLight = new THREE.PointLight(0xffffff, 2, 30)
pointLight.position.set(0, 1, 9)
scene.add(pointLight)
// Helper
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
scene.add( pointLightHelper )

// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

/**
 * 3D Models
 */

const gltfLoader = new GLTFLoader()

let bloodCellGeometry
gltfLoader.load(
    'models/redCell.glb',
    (glb) =>
    {
        console.log('success')

        bloodCellGeometry = glb.scene.children[0].children[0].geometry
        // console.log(bloodCellGeometry)

        bloodParticlesSystem.setup()
    },
    (progress) =>
    {
        // console.log('progress')
        // console.log(progress)
    },
    (error) =>
    {
        console.log('error')
        console.log(error)
    }
)


/**
 * Object
 */

const normalMaterial = new THREE.MeshNormalMaterial({
    side: THREE.DoubleSide,
})

// Torus Knot
// const torusKnot = new THREE.Mesh(new THREE.TorusKnotGeometry(1.5, 0.5, 128, 16), normalMaterial)
// scene.add(torusKnot)

// Tube
let tube = {

    length: 70,
    radius: 2,

    curve: null,
    mesh: null,

    build()
    {
        // Create an empty array to stores the points
        const points = [];
        
        // Define points along Z axis
        for (let i = 0; i < this.length; i++ )
        {
            i == this.length - 1 ? points.push(new THREE.Vector3(0, -3, -i )) : points.push(new THREE.Vector3(0, 0, -i ))
        }
        // Create a curve based on the points
        this.curve = new THREE.CatmullRomCurve3(points)
        
        // VISUALIZE THE CURVE
        const curvePoints = this.curve.getPoints(50)
        const curveObject = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curvePoints), new THREE.LineBasicMaterial({color : 0xff0000}))
        scene.add(curveObject)

        // Create the tube
        const tubeGeometry = new THREE.TubeGeometry(this.curve, 50, this.radius, 20)
        const tubeMaterial = new THREE.MeshPhongMaterial({
            color: new THREE.Color(0x6D1A0B),
            side: THREE.DoubleSide,
        })
        this.mesh = new THREE.Mesh(tubeGeometry, tubeMaterial)
        scene.add(this.mesh)
        this.mesh.position.z += 10
    },
}
tube.build()



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
 * Animation
 */

class BloodParticle
{
    constructor(size, speed, rotationSpeed, mesh)
    {
        this.initialPos = - tube.length
        this.size = size
        this.referenceSpeed = speed
        this.speed = this.referenceSpeed
        this.rotationSpeed = rotationSpeed
        this.mesh = mesh

        // Setting initial properties of the particle's mesh
        this.mesh.position.z = this.initialPos
        this.mesh.scale.set(this.size, this.size, this.size)
    }

    udpateState()
    {
        // Make the particle moving and reset position if the particle reach the end of the tube
        this.mesh.position.z += this.speed
        if (this.mesh.position.z > 10)
        {
            this.mesh.position.z = this.initialPos
        }

        // Make the particle rotate
        this.mesh.rotation.x += this.rotationSpeed
        this.mesh.rotation.z += this.rotationSpeed

        //
        this.speed = this.referenceSpeed * bloodParticlesSystem.speedFactor

    }
}

// Default red material
let redCellMaterial = new THREE.MeshPhongMaterial({
    color : new THREE.Color(0x6D1A0B),
    shininess : 0,
})

let bloodParticlesSystem =
{
    group: new THREE.Group,
    list: [],
    listOfType: [],
    
    // System properties
    middleSpace: 0.3,
    speedFactor: 1,

    // Particles properties
    minSize: 0.1,
    maxSize: 0.3,
    minSpeed: 0.01,
    maxSpeed: 0.35,
    minRotationSpeed: 0.005,
    maxRotationSpeed: 0.07,

    setup()
    {
        this.setupListOfType()
        this.setupNaturalFlow()

        // Adding the particle to the scene
        scene.add(this.group)

        this.setTransitionEvent()
    },

    setupListOfType()
    {
        this.listOfType =
        [
            {
                geometry: bloodCellGeometry,
                material: redCellMaterial,
                number: 50,
            },
            {
                geometry: bloodCellGeometry,
                material: normalMaterial,
                number: 10,
            },
        ]
    },

    setupNaturalFlow()
    {
        // Creating particles for all types
        for (const _type of this.listOfType)
        {
            for (let i = 0; i < _type.number; i++)
            {
                // Generate random size, speed and rotationSpeed
                let randomSize = Math.random() * (this.maxSize - this.minSize) + this.minSize
                let randomSpeed = Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed
                let randomRotationSpeed = Math.random() * (this.maxRotationSpeed - this.minRotationSpeed) + this.minRotationSpeed

                // Creating mesh
                let mesh = new THREE.Mesh(_type.geometry, _type.material)
    
                // Push the particle in the list
                this.list.push(new BloodParticle(randomSize, randomSpeed, randomRotationSpeed, mesh))
    
                // Generate a random initial position in the tube
                let randomAngle = Math.random() * Math.PI * 2
                let x = Math.cos(randomAngle) * (Math.random() * (tube.radius - this.middleSpace) + this.middleSpace)
                let y = Math.sin(randomAngle) * (Math.random() * (tube.radius - this.middleSpace) + this.middleSpace)
                mesh.position.x = x
                mesh.position.y = y
    
                // Adding the particle to the group
                this.group.add(mesh)
            }
        }
    },

    setTransitionEvent()
    {
        // Define timeline
        let timeline = new TimelineLite()
        timeline.pause()
        timeline.to(bloodParticlesSystem, 3, {speedFactor: 20, ease: Linear.easeNone})
                .to(pointLight, 2, {intensity: 0.3}, '-=2.5')

        // Launching timeline when the space bar is pressed
        window.addEventListener('keydown', _event =>
        {
            if(_event.code == 'Space')
            {
                timeline.play()
            }
        })
        window.addEventListener('keyup', _event =>
        {
            if(_event.code == 'Space')
            {
                timeline.reverse(1.5)
            }
        })
    }
}

/**
 * Loop
 */

const loop = () =>
{
    window.requestAnimationFrame(loop)
    
    // CAMERA
    cameraControls.update()

    // Update particles pos
    for (const _particle of bloodParticlesSystem.list)
    {
        _particle.udpateState()
    }

    // Render
    renderer.render(scene, camera)
}
loop()