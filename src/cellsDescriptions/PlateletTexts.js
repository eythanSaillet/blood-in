import * as THREE from 'three'
import font from 'three/examples/fonts/helvetiker_bold.typeface.json'

export default class PlateletTexts{
    constructor(){
        this.group = new THREE.Group()

        const lineGeometry = new THREE.PlaneGeometry(0.005, 0.5)
        const lineMaterial = new THREE.MeshBasicMaterial( 0xff0000 )
        const line = new THREE.Mesh(lineGeometry, lineMaterial)
        line.position.set(0.1, 0.12, 0)
        line.rotation.z = - Math.PI * 0.35

        const material = new THREE.MeshBasicMaterial({ color: 0xdddddd })

        const textGeometry = new THREE.TextGeometry(
            'Ni trop, ni pas assez',
            {
                font : new THREE.Font(font),
                size: 0.1,
                height: 0.005,
                curveSegments: 12,
                bevelEnabled: false
            }
        )
        const text = new THREE.Mesh(textGeometry, material)
        text.position.y = 0.3
        text.position.x = 0.35
        text.rotation.y = - Math.PI * 0.1

        const textGeometry2 = new THREE.TextGeometry(
            `Trop de plaquettes augmente le risque \nde formation de caillot de sang, et pas \nassez augmentent de risque d'hemoragie.`,
            {
                font : new THREE.Font(font),
                size: 0.05,
                height: 0.005,
                curveSegments: 12,
                bevelEnabled: false
            }
        )

        const text2 = new THREE.Mesh(textGeometry2, material)
        text2.position.x = 0.35
        text2.position.y = 0.1
        text2.rotation.y = - Math.PI * 0.1

        const line2 = new THREE.Mesh(lineGeometry, lineMaterial)
        line2.position.set(- 1.05, - 0.3, 0.18)
        line2.rotation.z = Math.PI * 0.35
        line2.rotation.y = Math.PI * 0.05

        const textGeometry3 = new THREE.TextGeometry(
            'Elles sont responsable de la coagulation \ndu sang, ce qui evite les trop gros \necoulement de sang en cas de blessures.',
            {
                font : new THREE.Font(font),
                size: 0.05,
                height: 0.005,
                curveSegments: 12,
                bevelEnabled: false
            }
        )

        const text3 = new THREE.Mesh(textGeometry3, material)
        text3.position.x = - 2.5
        text3.position.z = 0.6
        text3.position.y = 0.1
        text3.rotation.y = Math.PI * 0.1

        const textGeometry4 = new THREE.TextGeometry(
            'Les plaquettes',
            {
                font : new THREE.Font(font),
                size: 0.1,
                height: 0.005,
                curveSegments: 12,
                bevelEnabled: false
            }
        )

        const text4 = new THREE.Mesh(textGeometry4, material)
        text4.position.set(-2.5, 0.3, 0.6)
        text4.rotation.y = Math.PI * 0.1

        // Adding to the groups
        // Lines
        this.group.add(line)
        this.group.add(line2)
        // Titles
        this.group.add(text)
        this.group.add(text4)
        // Texts
        this.group.add(text2)
        this.group.add(text3)
    }
}