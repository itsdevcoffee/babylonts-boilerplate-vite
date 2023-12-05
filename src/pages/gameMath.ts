import { Application } from 'pixi.js'
import FontFaceObserver from "fontfaceobserver";

import GameMath from '@/classes/GameMath'
import '../style.css'

const canvas = document.getElementById('pixi-canvas')


let font = new FontFaceObserver('Roboto', {
  weight: 500,
  style: 'normal',
  stretch: 'normal'
});

font.load().then(() => {
  const app = new Application({
    view: canvas as HTMLCanvasElement,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    antialias: true,
    backgroundColor: 0x0a0e12,
    width: 800,
    height: 800,
  })

  const gameMath = new GameMath(app)
  gameMath.drawGridLines()
}).catch(console.error)

