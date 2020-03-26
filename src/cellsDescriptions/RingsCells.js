import * as THREE from 'three'

export default class RingsCells{
    constructor(){
        this.group = new THREE.Group()

        const ringGeometry = new THREE.RingGeometry( 0.1, 0.12, 20, 1)
        const ringMaterial = new THREE.MeshBasicMaterial( 0xff0000 )

        const ring = new THREE.Mesh(ringGeometry, ringMaterial)
        ring.position.set( 0.2, 0, - 0.005)
        ring.rotation.y = - Math.PI * 0.1
        this.group.add(ring)

        const ring2 = new THREE.Mesh(ringGeometry, ringMaterial)
        ring2.position.set( - 0.3, - 0.4, 0.1)
        ring2.rotation.y = Math.PI * 0.1
        this.group.add(ring2) 
    }
}