import * as THREE from 'three'
import font from 'three/examples/fonts/helvetiker_bold.typeface.json'

export default class WhiteCellTexts{
    constructor(){
        this.group = new THREE.Group()

        const lineGeometry = new THREE.PlaneGeometry(0.005, 0.5)
        const lineMaterial = new THREE.MeshBasicMaterial( 0xff0000 )
        const line = new THREE.Mesh(lineGeometry, lineMaterial)
        line.position.set(0.1, 0.12, 0)
        line.rotation.z = - Math.PI * 0.35

        const material = new THREE.MeshBasicMaterial({ color: 0xdddddd })

        const textGeometry = new THREE.TextGeometry(
            'Une vie de globule',
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
            `Les lymphocytes sont des leucocytes \nqui ont un rôle majeur dans le \nsystème immunitaire. Elles sont responsables \nde l'immunité cellulaire : les cellules \nreconnues comme étrangères sont \ndétruites par un mécanisme complexe.`,
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
            'Les granulocytes, autrefois qualifiés \nde polynucléaires, sont des globules \nblancs qualifiés de « non spécifiques » \ndans la mesure où ils ne sont \npas dirigés contre un seul antigène. \nIl existe différentes catégories de \ngranulocytes : les neutrophiles, \nles basophiles et les éosinophiles. ',
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
            'Un disque',
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