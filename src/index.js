import './style/main.styl'
import * as THREE from 'three'
import { TweenMax, TweenLite, TimelineLite, Linear, Power3, Power1} from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Menu from './Menu'

/**
 * Sizes
 */

const sizes = {}
sizes.width = window.innerWidth
sizes.height = window.innerHeight

/**
 * Cursor
 */

const cursor = { x: 0, y: 0 }
window.addEventListener('mousemove', (_event) =>
{
    cursor.x = (_event.clientX / window.innerWidth) * 2 - 1
    cursor.y = ((_event.clientY / window.innerHeight) * 2 - 1) * - 1
    cursor.speedX = _event.movementX
    cursor.speedY = - _event.movementY
    // console.log(_event)
})

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
const pointLight = new THREE.PointLight(0xff9999, 2, 30)
pointLight.position.set(0, 1, 9)
// scene.add(pointLight)
// Helper
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
scene.add( pointLightHelper )

// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.01)
scene.add(ambientLight)

/**
 * 3D Models
 */

let models =
{
    // Defin models that we are going to laod
    redCellGeometry: null,
    plateletGeometry: null,
    whiteCellGeometry: null,
    
    // Defin total number of medels for the loading progress
    numberOfModels: 3,

    // Define the loader
    gltfLoader: new GLTFLoader(),

    load()
    {
        // Load red cell
        this.gltfLoader.load(
            'models/redCell.glb',
            (glb) =>
            {
                console.log('success to load redCellGeometry')
        
                // Get the model and resize it
                this.redCellGeometry = glb.scene.children[0].children[0].geometry
                this.redCellGeometry.scale(0.25, 0.25, 0.25)
        
                launcher.launchIfLoadingComplete()
            },
        )
        
        // Load platelet
        this.gltfLoader.load(
            'models/platelet/blood_platelet.gltf',
            (gltf) =>
            {
                console.log('success to load plateletGeometry')
        
                // Get the model and resize it
                this.plateletGeometry = gltf.scene.children[0].children[0].children[0].children[0].children[0].children[0].geometry
                this.plateletGeometry.scale(0.0007, 0.0007, 0.0007)
        
                launcher.launchIfLoadingComplete()
            },
        )

        // Load white cell
        this.gltfLoader.load(
            'models/whiteCell.glb',
            (glb) =>
            {
                console.log('success to load white cell')
        
                // Get the model and resize it
                this.whiteCellGeometry = glb.scene.children[0].children[0].geometry
                this.whiteCellGeometry.scale(0.002, 0.002, 0.002)
        
                launcher.launchIfLoadingComplete()
            },
        )
    },
}
models.load()

/**
 * Audio
 */

let audio =
{
    numberOfAudio: 3,

    sources:
    {
        heartBeat: 'audio/heartBeat.mp3',
        sceneMusic: 'audio/sceneMusic.mp3',
        menuMusic: 'audio/menuMusic.mp3',
    },

    list:
    {
        heartBeat: null,
        sceneMusic: null,
        menuMusic: null,
    },

    load()
    {
        for (const _source in this.sources)
        {
            // Create the audio and pause it
            let audio = new Audio()
            audio.pause()

            // Add loading event for the website loader then set the source
            audio.addEventListener('canplaythrough', () =>
            {
                if (audio.isLoaded != true)
                {
                    launcher.launchIfLoadingComplete()
                }
                audio.isLoaded = true
            })
            audio.src = this.sources[_source]

            // Adding the audio to the list
            this.list[_source] = audio
        }
    }
}
audio.load()

/**
 * Menu
 */

let menu
let menuIsActive = false

/**
 * Website loader
 */

let launcher =
{
    numberOfFiles: models.numberOfModels + audio.numberOfAudio,
    numberOfLoadedFiles: 0,

    $loaderOverlay: document.querySelector('.loaderOverlay'),
    $loaderRedBg: document.querySelector('.loaderOverlay .dropBgRed'),
    $startInstruction: document.querySelector('.loaderOverlay .startInstruction'),
    $menuStartButton: document.querySelector('.menuOverlay .startButton'),
    $menuTitle: document.querySelector('.menuOverlay .title'),

    // Loading function that launch the project when every files are loaded
    launchIfLoadingComplete()
    {
        this.numberOfLoadedFiles++
        this.actualizeDomLoader()
        if (this.numberOfLoadedFiles == this.numberOfFiles)
        {
            setTimeout(() =>
            {
                // Make appear the start instruction
                TweenLite.to(this.$startInstruction, 1, {opacity: 1})

                // Then launch the project on any key press
                window.addEventListener('keypress', () =>
                {
                    // Make the loader overlay disappear
                    this.$loaderOverlay.style.pointerEvents = 'none'
                    TweenLite.to(this.$loaderOverlay, 0.7, {opacity: 0})

                    // Launch menu music
                    audio.list.menuMusic.loop = true
                    audio.list.menuMusic.volume = 0.4
                    audio.list.menuMusic.play()
    
                    // Launch menu three.js animation
                    menu = new Menu(scene, camera, cameraControls, models, materials, menuIsActive)
                    scene.add(menu.particlesGroup)
                    menuIsActive = true

                    // Launch scene when user click on explore menu button
                    this.$menuStartButton.addEventListener('click', () =>
                    {
                        /**
                         * LAUNCH PROJECT HERE
                         */
        
                        // document.querySelector('.launch').addEventListener('click', () => bloodParticlesSystem.setup())
        
                        /**
                         * LAUNCH PROJECT HERE
                         */
                    })
                })
            }, 700)
        }
    },

    // Actualize loading
    actualizeDomLoader()
    {
        TweenLite.to(this.$loaderRedBg, 0.3, {y: -(this.numberOfLoadedFiles / this.numberOfFiles * 100) + 102})
    }
}

/**
 * Materials
 */

let materials =
{
    // Debug normal material
    normalMaterial: new THREE.MeshNormalMaterial({
        side: THREE.DoubleSide,
    }),
    
    // Red cell material
    redCellMaterial: new THREE.MeshPhongMaterial({
        color : new THREE.Color(0x6D1A0B),
        shininess : 0,
    }),
    
    // Platelet material
    plateletMaterial: new THREE.MeshPhongMaterial({
        color : new THREE.Color(0xccaa00),
        shininess : 0,
    }),
    
    // White cell material
    whiteCellMaterial: new THREE.MeshPhongMaterial({
        color : new THREE.Color(0x5093e2),
        shininess : 0,
    }),
}


/**
 * Object
 */

// Tube
let tube = {

    // Tube properties
    length: 70,
    radius: 2,

    // Tube objects
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
        
        // Create the tube
        const tubeGeometry = new THREE.TubeGeometry(this.curve, 50, this.radius, 20)
        const tubeMaterial = new THREE.MeshPhongMaterial({
            color: new THREE.Color(0x6D1A0B),
            side: THREE.DoubleSide,
        })
        this.mesh = new THREE.Mesh(tubeGeometry, tubeMaterial)
        scene.add(this.mesh)
        this.mesh.position.z += 10


        // VISUALIZE THE CURVE
        const curvePoints = this.curve.getPoints(50)
        const curveObject = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curvePoints), new THREE.LineBasicMaterial({color : 0xff0000}))
        scene.add(curveObject)
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
        // Setting initial properties of the particle
        this.initialPos = - tube.length
        this.size = size
        this.referenceSpeed = speed
        this.speed = this.referenceSpeed
        this.referenceRotationSpeed = rotationSpeed
        this.rotationSpeed = this.referenceSpeed
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

            // Generate a random initial position in the tube
            let randomAngle = Math.random() * Math.PI * 2
            let x = Math.cos(randomAngle) * (Math.random() * (tube.radius - bloodParticlesSystem.middleSpace) + bloodParticlesSystem.middleSpace)
            let y = Math.sin(randomAngle) * (Math.random() * (tube.radius - 0.5 - bloodParticlesSystem.middleSpace) + bloodParticlesSystem.middleSpace)
            this.mesh.position.x = x
            this.mesh.position.y = y
        }

        // Make the particle rotate
        this.mesh.rotation.x += this.rotationSpeed
        this.mesh.rotation.z += this.rotationSpeed

        // Muliply by speed & rotation speed factor of the system to influence behaviour of all particles
        this.speed = this.referenceSpeed * bloodParticlesSystem.speedFactor
        this.rotationSpeed = this.referenceRotationSpeed * bloodParticlesSystem.rotationSpeedFactor

    }
}

let bloodParticlesSystem =
{
    group: new THREE.Group,
    list: [],
    listOfType: [],
    
    // System properties
    middleSpace: 0.5,
    speedFactor: 1,
    rotationSpeedFactor: 1,

    // Particles properties
    minSize: 0.5,
    maxSize: 1.5,
    minSpeed: 0.01,
    maxSpeed: 0.35,
    minRotationSpeed: 0.005,
    maxRotationSpeed: 0.07,

    // Animation properties
    inAnimation: false,
    previousDemo: null,
    actualDemo: 0,
    demoList: [],
    heartBeatRate: 800,

    setup()
    {
        // Setup what types of particles we want in the scene
        this.setupListOfType()

        // Create the natural particles flow
        this.setupNaturalFlow()

        // Adding the particle to the scene
        scene.add(this.group)

        // Setup the list of particles we want in the demonstrations
        this.setupListOfDemo()
        // Temporary event to lauch demo
        document.querySelector('.anim').addEventListener('click', () => this.goToDemo())

        // Set heartbeat : audio and light
        this.setHeartBeat()
    },

    setupListOfDemo()
    {
        // Define list of mesh particles we want to present in the demonstrations
        this.demoList =
        [
            new THREE.Mesh(models.redCellGeometry, materials.normalMaterial)
        ]
    },

    setupListOfType()
    {
        // Define types and numbers of each particles we want in the system
        this.listOfType =
        [
            {
                geometry: models.redCellGeometry,
                material: materials.redCellMaterial,
                number: 55,
            },
            {
                geometry: models.plateletGeometry,
                material: materials.plateletMaterial,
                number: 17,
            },
            {
                geometry: models.whiteCellGeometry,
                material: materials.whiteCellMaterial,
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
                let y = Math.sin(randomAngle) * (Math.random() * (tube.radius - 0.5 - this.middleSpace) + this.middleSpace)
                mesh.position.x = x
                mesh.position.y = y
    
                // Adding the particle to the group
                this.group.add(mesh)
            }
        }
    },

    goToDemo()
    {
        // If the animation is not playing and if the next demo is different from the actual demo then play
        if (!this.inAnimation && this.previousDemo != this.actualDemo)
        {
            this.inAnimation = true

            // Restore pos of the previous mesh
            if (this.previousDemo != null)
            {
                let previousMesh = this.demoList[this.previousDemo]
                TweenLite.to(previousMesh.position, 1, {z: 15})
                TweenLite.to(previousMesh.position, 0, {z: - tube.length}).delay(1)
            }
    
            // Add the mesh to the scene
            let mesh = this.demoList[this.actualDemo]
            mesh.position.z = - tube.length
            mesh.rotation.x = Math.PI * 0.15
            mesh.rotation.z = Math.PI * 0.1
            scene.add(mesh)
    
            // Play the animation
            let timeline = new TimelineLite({defaultEase: Power1.easeOut})
            timeline.to(bloodParticlesSystem, 2, {speedFactor: 10})
                    .to(pointLight.position, 2, {z: 20}, '-=2')
                    .to(mesh.position, 3, {z: 8.7, ease: Power3.easeOut}, '-=1')
                    .to(pointLight.position, 1, {z: 11}, '-=0.5')
                    .to(bloodParticlesSystem, 2.5, {speedFactor: 0.04}, '-=2.7')
                    .to(bloodParticlesSystem, 2, {rotationSpeedFactor: 0.08, onComplete: () => {this.inAnimation = false ; this.previousDemo = this.actualDemo}}, '-=2')
        }
    },

    setHeartBeat()
    {
        // Loop that play heartbeat sound according to the heartbeat rate
        setTimeout(() =>
        {
            audio.list['heartBeat'].pause()
            audio.list['heartBeat'].currentTime = 0.1
            audio.list['heartBeat'].play()
            this.setHeartBeat()
        }, this.heartBeatRate)
    }
}

// Raycaster

const raycaster = new THREE.Raycaster()

/**
 * Loop
 */

const loop = () =>
{
    window.requestAnimationFrame(loop)
    
    // CAMERA
    cameraControls.update()

    // Update scene particles states
    for (const _particle of bloodParticlesSystem.list)
    {
        _particle.udpateState()
    }

    // Update menu particles states
    if (menuIsActive)
    {
        for (const _particle of menu.particlesList)
        {
            _particle.updatePos()
        }
        // Raycaster
        raycaster.setFromCamera(cursor, camera)
        const intersects = raycaster.intersectObjects(scene.children)
        for (let i = 0; i < intersects.length; i++)
        {
            // scene.remove(intersects[i].object)
            for (const _particle of menu.particlesList)
            {
                if(_particle.mesh == intersects[i].object)
                {
                    _particle.acc.x = cursor.speedX / 2000
                    _particle.acc.y = cursor.speedY / 2000
                }
            }
        }
    }



    // Render
    renderer.render(scene, camera)
}
loop()