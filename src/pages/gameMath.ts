import { Application } from 'pixi.js'
import FontFaceObserver from "fontfaceobserver";

import GameMath from '@/classes/GameMath'
import '../style.css'
import 'normalize.css'

const app = document.getElementById('app')
const canvas = document.getElementById('pixi-canvas')


let font = new FontFaceObserver('Roboto', {
  weight: 500,
  style: 'normal',
  stretch: 'normal'
});

console.log(app?.clientWidth)
function vwhToPixels(val: number, key: 'innerHeight' | 'innerWidth') {
  return Math.round(window[key] / (100 / val));
}
const vw = vwhToPixels(100, 'innerWidth')
const vh = vwhToPixels(100, 'innerHeight')

font.load().then(() => {
  const app = new Application({
    view: canvas as HTMLCanvasElement,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    antialias: true,
    backgroundColor: 0x0a0e12,
    width: vw,
    height: vh,
  })

  const gameMath = new GameMath(app)
  gameMath.drawGridLines()
}).catch(console.error)

