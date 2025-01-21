import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

/**
 * House
 */
const house = new THREE.Group()
scene.add(house)

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ color: '#a9c388' })
)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
house.add(floor)

// Walls
const wallsDepth = 4
const wallsHeight = 3
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, wallsHeight, wallsDepth),
    new THREE.MeshStandardMaterial({ color: '#F27900' })
)
walls.position.y = wallsHeight / 2
house.add(walls)

// roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({ color: 0x3d2412 })
)
roof.rotation.y = Math.PI / 4
roof.position.y = wallsHeight + 0.5
house.add(roof)

// Door
const doorTexture = textureLoader.load('/textures/door/color.jpg')
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 2),
    new THREE.MeshBasicMaterial({ 
        color: 0xffffff,
        map: doorTexture
    })
) 
door.position.z = (wallsDepth / 2) + 0.01
door.position.y = 1
house.add(door)

// door light
const pointLight = new THREE.PointLight('#ff7d46', 1, 7)
pointLight.position.set(0, 2.2, 2.7)
house.add(pointLight)

const sphereSize = 1
const pointLightHelper = new THREE.PointLightHelper(pointLight, 1)
// house.add(pointLightHelper)

// Bushes
const bushesArray = [
    {
        id: 1,
        position: [0.8, 0.2, 2.2],
        scale: [0.5, 0.5, 0.5],
    },
    {
        id: 2,
        position: [1.4, 0.1, 2.1],
        scale: [0.25, 0.25, 0.25],
    },
    {
        id: 3,
        position: [-0.8, 0.1, 2.2],
        scale: [0.4, 0.4, 0.4],
    },
    {
        id: 4,
        position: [-1, 0.05, 2.6],
        scale: [0.15, 0.15, 0.15],
    },
]

const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({ color: '#418c4c' })

bushesArray.forEach((bush) => {
    const bushMesh = new THREE.Mesh(bushGeometry, bushMaterial)
    bushMesh.position.set(...bush.position)
    bushMesh.scale.set(...bush.scale)

    house.add(bushMesh)
})

// Graves
const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({ color: '#b2b6b1' })

generateGraves()

function generateGraves() {
    for (let i = 0; i < 50; i++) {
        const grave = new THREE.Mesh(graveGeometry, graveMaterial)
        
        // random angle around home. Math.PI = half of circle
        const angle = Math.random() * Math.PI * 2
        
        const radius = 3 + Math.random() * 6
        const x = Math.sin(angle) * radius
        const z = Math.cos(angle) * radius
        grave.position.set(x, 0.3, z)
        grave.rotation.y = (Math.random() - 0.5) * 0.7
        grave.rotation.z = (Math.random() - 0.5) * 0.4
        graves.add(grave)
    }
}
/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()