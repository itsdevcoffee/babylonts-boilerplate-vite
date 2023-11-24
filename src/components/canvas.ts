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
import { getAbsHighestEdge, smoothStep } from '@/lib/shapingFn'
import { hexToDecimalColor } from '@/lib/utils'

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

const posColor = new Color3(...hexToDecimalColor('#4CAF50'))
const negColor = new Color3(...hexToDecimalColor('#E91E63'))
const defaultColor = new Color3(...hexToDecimalColor('#3F51B5'))

const posMat = new StandardMaterial('posMat', scene)
posMat.diffuseColor = posColor
const negMat = new StandardMaterial('negMat', scene)
negMat.diffuseColor = negColor

const createSpheres = () => {
  for (let idx = 0; idx < 12; idx++) {
    const mesh = MeshBuilder.CreateSphere(`sphere${idx}`, {
      segments: sphereSegments,
      diameter: sphereDiameter,
      sideOrientation: Mesh.FRONTSIDE,
    })
    const offsetY = sphereStartPos.y + ((sphereDiameter + 0.1) * idx + 1)
    mesh.position.set(0, offsetY, 0)
    mesh.material = idx & 1 ? posMat : negMat
    spheres.push(mesh)
  }
}

const bounceSpheres = (time: number) => {
  spheres.forEach((sphere, idx) => {
    const sign = idx & 1 ? -1 : 1

    sphere.position.x = Math.sin(time) * sign
    const offsetY = sphereStartPos.y + ((sphereDiameter + 0.1) * idx + 1)
    const negDelta = -smoothStep(-sphereDiameter, -1, sphere.position.x)
    const posDelta = smoothStep(sphereDiameter, 1, sphere.position.x)

    const highestAbsY = getAbsHighestEdge(negDelta, posDelta)
    sphere.position.y = offsetY + highestAbsY

    const posYSign = Math.sign(sphere.position.y)
    if (idx === 0) {
      if (posDelta > negDelta * -1) {
        posMat.diffuseColor = Color3.Lerp(defaultColor, negColor, highestAbsY)
      } else {
        posMat.diffuseColor = Color3.Lerp(defaultColor, posColor, negDelta * -1)
      }
    } else if (idx === 1) {
      if (posDelta > negDelta * -1) {
        negMat.diffuseColor = Color3.Lerp(defaultColor, negColor, highestAbsY)
      } else {
        negMat.diffuseColor = Color3.Lerp(defaultColor, posColor, negDelta * -1)
      }
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
