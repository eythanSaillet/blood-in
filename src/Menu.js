import * as THREE from 'three'

export default class Menu
{
    constructor(scene, camera, cameraControls, models, materials, menuIsActive)
    {
        // System properties
        this.width = 10
        this.height = 6
        this.depth = 8
        this.depthPos = 50
        this.distanceOfTheCamera = 9
        this.numberOfParticles = 10
        this.particlesList = []
        this.particlesGroup = new THREE.Group()

        // Particles config
        this.typesOfParticle =
        [
            {
                geometry: models.redCellGeometry,
                material: materials.redCellMaterial,
                number: 70,
            },
            {
                geometry: models.plateletGeometry,
                material: materials.plateletMaterial,
                number: 30,
            },
            {
                geometry: models.whiteCellGeometry,
                material: materials.whiteCellMaterial,
                number: 20,
            },
        ]

        class Particle
        {
            constructor(geometry, material, width, height, depthPos, group)
            {
                // System properties
                this.width = width
                this.height = height
                this.depthPos = depthPos

                // Movement properties
                this.minSize = 0.5
                this.maxSize = 1
                this.minSpeed = 0.005
                this.maxSpeed = 0.007
                this.minRotationSpeed = 0.005
                this.maxRotationSpeed = 0.04

                // Define variables
                this.size = null
                this.pos = {x: null, y: null}
                this.refVel = {x: null, y: null}
                this.vel = {x: null, y: null}
                this.acc = {x: null, y: null}
                this.rotationVel = {x: null, z: null}

                // Set initial values
                // Random size
                this.size = Math.random() * (this.maxSize - this.minSize) + this.minSize
                // Random position
                this.pos.x = Math.random() * width * 2 - width
                this.pos.y = Math.random() * height * 2 - height
                // Random velocity
                this.vel.x = (Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed) * (Math.random() > 0.5 ? 1 : -1)
                this.vel.y = (Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed) * (Math.random() > 0.5 ? 1 : -1)
                // Random rotation velocity
                this.rotationVel.x = (Math.random() * (this.maxRotationSpeed - this.minRotationSpeed) + this.minRotationSpeed)
                this.rotationVel.z = (Math.random() * (this.maxRotationSpeed - this.minRotationSpeed) + this.minRotationSpeed)

                // Three.js properties
                this.mesh = new THREE.Mesh(geometry, material)
                this.mesh.position.set(this.pos.x, this.pos.y, this.depthPos)
                this.mesh.scale.set(this.size, this.size, this.size)
                group.add(this.mesh)
            }

            updatePos()
            {
                // Decrease velocity if it is superior to the maximum velocity
                this.vel.x > this.maxSpeed ? this.vel.x -= 0.005 : null
                this.vel.y > this.maxSpeed ? this.vel.y -= 0.005 : null

                // Adding acceleration to velocity
                this.vel.x += this.acc.x
                this.vel.y += this.acc.y

                // Adding velocity to position
                this.pos.x += this.vel.x
                this.pos.y += this.vel.y

                // Reset acceleration
                this.acc.x = 0
                this.acc.y = 0

                // Apply position and rotation of the mesh
                this.mesh.position.x = this.pos.x
                this.mesh.position.y = this.pos.y
                this.mesh.rotation.x += this.rotationVel.x
                this.mesh.rotation.z += this.rotationVel.z
                

                // Reset position if the particle leave the view
                this.pos.x > this.width / 2 ? this.pos.x = - this.width / 2 : null
                this.pos.x < - this.width / 2 ? this.pos.x = this.width / 2 : null
                this.pos.y > this.height / 2 ? this.pos.y = - this.height / 2 : null
                this.pos.y < - this.height / 2 ? this.pos.y = this.height / 2 : null
            }
        }



        // Set camera view
        camera.position.z = this.depthPos
        camera.rotation.x = Math.PI / 2

        // Light
        const pointLight = new THREE.PointLight(0xff9999, 3, 5)
        pointLight.position.set(0, 0, this.depthPos + 0.5)
        scene.add(pointLight)
        // Helper
        const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
        scene.add( pointLightHelper )


        //debug material
        let normalMaterial = new THREE.MeshNormalMaterial()

        for (const _type of this.typesOfParticle)
        {
            for (let i = 0; i < _type.number; i++)
            {
                this.particlesList.push(new Particle(_type.geometry, _type.material, this.width, this.height, this.depthPos - this.distanceOfTheCamera + Math.random() * this.depth, this.particlesGroup))
            }
        }

    }
}