import { Application, Graphics } from 'pixi.js'
import { getSqArr } from './getSqArr'
import { easeIn, mix } from 'polished'
import { blend, random as randomColor } from 'chroma-js'

// Variables
const canvas = document.getElementById('pixi-canvas')
const layerInput = document.getElementById('layer-input') as HTMLInputElement
const layerBtn = document.getElementById('layer-btn') as HTMLButtonElement
const app = new Application({
    view: canvas as HTMLCanvasElement,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    backgroundColor: 0x6495ed,
    width: 640,
    height: 480,
})
const { width, height } = app.screen
const midWidth = width / 8
const midHeight = height / 8

type IState = {
    layers: number
}

const state = new Proxy<IState>(
    {
        layers: 3,
    },
    {
        set(props, key: keyof IState, value) {
            props[key] = value
            main()
            return true
        },
    }
)

const _window = window as any
_window._state = state

const sideLen = 10
const offset = 4
const graphSqArr: Graphics[] = []
const drawSq = (x: number, y: number, fill = '#00FF00', len = sideLen) => {
    const sq = new Graphics()
    sq.beginFill(fill)
    sq.lineStyle(1, '#000')
    sq.drawRect(0, 0, len, len)
    sq.endFill()
    sq.position.set(x, y)
    app.stage.addChild(sq)

    return sq
}
// drawSq(midWidth, midHeight)

const mixColor = (d: number) => {
    // const color = randomColor().hex()
    const color = mix(d, '#6200EA', '#F50057')
    // const color = mix(d, '#D500F9', '#AEEA00')

    return color
    // return mix(d, '#00FF00', '#FF0000')
}
mixColor(0.5)

const generateSqs = () => {
    for (let i = graphSqArr.length - 1; i >= 0; i--) {
        const graph = graphSqArr[i]
        graph.destroy()
        graphSqArr.splice(i, 1)
    }
    console.log(graphSqArr)
    const sideOffset = offset + sideLen
    const sqArr = getSqArr(state.layers)
    let prevNum = 0
    let prevDiff = 0
    let lastSq: Graphics | null = null
    const totalSqs = sqArr[sqArr.length - 1]

    sqArr.forEach((sqNum, idx) => {
        const diff = sqNum - prevNum
        const xDownNum = Math.ceil(diff / 2)
        lastSq = graphSqArr[graphSqArr.length - prevDiff]

        for (let i = 0; i < diff; i++) {
            const isDown = xDownNum - 1 >= i
            let xPos = idx === 0 ? midWidth : lastSq.position.x
            let yPos = idx === 0 ? midHeight : lastSq.position.y
            if (i === 0) {
                xPos += sideOffset
            } else {
                if (isDown) {
                    yPos += sideOffset
                } else {
                    xPos -= sideOffset
                }
                // if (isLeft) {
                //     xPos -= sideOffset
                // } else {
                //     yPos += sideOffset
                // }
            }

            const progress = Math.pow(sqNum / totalSqs, 2)
            const color = mixColor(progress)
            lastSq = drawSq(xPos, yPos, color)
            graphSqArr.push(lastSq)
        }

        prevNum = sqNum
        prevDiff = diff
    })
}

layerBtn.addEventListener('click', () => {
    const value = layerInput.valueAsNumber || 3
    state.layers = value
})
layerInput.value = String(state.layers)

const main = () => {
    generateSqs()
}
main()
