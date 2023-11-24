import {
  Camera,
  Color3,
  Engine,
  FreeCamera,
  HemisphericLight,
  Mesh,
  MeshBuilder,
  Scene,
  StandardMaterial,
  UniversalCamera,
  Vector3,
} from 'babylonjs'
import { smoothStep } from '@/lib/shapingFn'

const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement
const engine = new Engine(canvas, true, {
  preserveDrawingBuffer: true,
  antialias: true,
  stencil: true,
})

// let sphere!: Mesh
const aspectRatio = canvas.clientWidth / canvas.clientHeight
console.log(aspectRatio)
const createScene = () => {
  const scene = new Scene(engine)
  const camera = new UniversalCamera('camera1', new Vector3(0, 5, -10), scene)
  // camera.inputs.addMouseWheel()
  camera.setTarget(Vector3.Zero())
  camera.attachControl(canvas, false)
  camera.mode = Camera.ORTHOGRAPHIC_CAMERA
  camera.orthoTop = 4
  camera.orthoBottom = -4
  camera.orthoLeft = 4 * aspectRatio
  camera.orthoRight = -4 * aspectRatio
  const light = new HemisphericLight('light1', new Vector3(0, 1, 0), scene)
  // sphere = MeshBuilder.CreateSphere(
  //   'sphere1',
  //   { segments: 16, diameter: 2, sideOrientation: Mesh.FRONTSIDE },
  //   scene
  // )
  // sphere.position.y = 1

  // const ground = MeshBuilder.CreateGround(
  //   'ground1',
  //   { width: 6, height: 6, subdivisions: 2, updatable: false },
  //   scene
  // )

  return scene
}

// Variables
let elaspedTime = 0
let tick = 0

const scene = createScene()
scene.registerBeforeRender(() => {
  tick++
})

const spheres: Mesh[] = []

const sphereDiameter = 0.5
const sphereSegments = 16
const sphereStartPos = new Vector3(0, -4, 0)

const createSpheres = () => {
  for (let idx = 0; idx < 12; idx++) {
    const mesh = MeshBuilder.CreateSphere(`sphere${idx}`, {
      segments: sphereSegments,
      diameter: sphereDiameter,
      sideOrientation: Mesh.FRONTSIDE,
    })
    const offsetY = sphereStartPos.y + ((sphereDiameter + 0.1) * idx + 1)
    mesh.position.set(0, offsetY, 0)
    spheres.push(mesh)
  }
}

const positiveMaterial = new StandardMaterial('positiveMaterial', scene)
positiveMaterial.diffuseColor = new Color3(1, 0, 0)
const negativeMaterial = new StandardMaterial('negativeMaterial', scene)
negativeMaterial.diffuseColor = new Color3(0, 0, 1)

const bounceSpheres = (time: number) => {
  spheres.forEach((sphere, idx) => {
    const sign = idx % 2 === 0 ? -1 : 1

    sphere.position.x = Math.sin(time) * sign
    const offsetY = sphereStartPos.y + ((sphereDiameter + 0.1) * idx + 1)
    const delta = smoothStep(-1, 0, sphere.position.x)
    // sphere.position.y = offsetY
    const ySign = Math.sign(sphere.position.x)
    if (ySign === -1) {
      sphere.material = negativeMaterial
    } else {
      sphere.material = positiveMaterial
    }
  })
}

createSpheres()

engine.runRenderLoop(() => {
  scene.render()
  elaspedTime += scene.deltaTime / 1000
  bounceSpheres(elaspedTime)

  // sphere.position.y = Math.sin(elaspedTime)
})

window.addEventListener('resize', () => {
  engine.resize()
})
