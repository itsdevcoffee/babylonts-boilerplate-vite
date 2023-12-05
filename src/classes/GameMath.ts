import { materialColors as color } from "@/utils/materialColors";
import { Application, Container, Graphics, ICanvas, Text } from "pixi.js";

type Vec2 = [number, number]

const vec2 = (x: number, y: number): Vec2 => {
  return [x, y]
}

class GameMath {
  app: Application<ICanvas>
  height: number
  width: number
  mX: number
  mY: number
  gridSize: number
  xLines: Graphics
  yLines: Graphics
  lines: Container
  points: Container
  pt: Graphics
  text!: Text

  constructor(app: Application<ICanvas>) {
    this.app = app
    this.height = app.screen.height
    this.width = app.screen.width
    this.mX = this.width / 2
    this.mY = this.height / 2
    this.gridSize = 100
    this.xLines = new Graphics()
    this.yLines = new Graphics()
    this.pt = new Graphics()
    this.lines = new Container()
    this.points = new Container()
    this.lines.addChild(this.xLines, this.yLines)
    this.points.addChild(this.pt)
    this.app.stage.addChild(this.lines, this.points)

    // Text
    const labelY = new Text(
      'y', {
      fontFamily: "Roboto",
      fontWeight: '400',
      fontStyle: 'normal',
      fontSize: 24,
      fill: 'white',
      align: 'left',
    }
    );
    labelY.position.set(this.mX + 18, 12);
    this.app.stage.addChild(labelY)

    const labelX = new Text(
      'x', {
      fontFamily: "Roboto",
      fontWeight: '400',
      fontStyle: 'normal',
      fontSize: 24,
      fill: 'white',
      align: 'left',
    }
    );
    labelX.position.set(this.width - 32, this.mY + 8);
    this.app.stage.addChild(labelX)
  }

  point(x: number, y: number, radius = 10) {
    const { pt } = this
    pt.lineStyle(2, 0xFFFFFF, 1);
    pt.beginFill(color.blueGrey[400], 1);
    pt.drawCircle(x, y, radius);
    pt.endFill();
  }

  line(xy1: Vec2, xy2: Vec2, col?: number, alpha = 1, thickness = 1, g = this.xLines) {
    g.lineStyle(thickness, col || color.blueGrey[300], alpha, 0)

    g.moveTo(...xy1)
    g.lineTo(...xy2)

    return g
  }

  drawGridLines(gridSize = this.gridSize) {
    let size = gridSize
    const { mX, mY, height: ht, width: wd } = this
    const lineXCount = Math.ceil(mX / size)
    const lineYCount = Math.ceil(mY / size)

    const colorArgs = [color.blueGrey[100], 0.3, 1] as const

    for (let i = 0; i < lineYCount; i++) {
      if (i === 0) {
        continue
      }
      const posY = mY + (i * size)
      const negY = mY + (i * -size)
      this.line(vec2(0, posY), vec2(wd, posY), ...colorArgs)
      this.line(vec2(0, negY), vec2(wd, negY), ...colorArgs)
    }

    for (let i = 0; i < lineXCount; i++) {
      if (i === 0) {
        continue
      }
      const posX = mX + (i * size)
      const negX = mX + (i * -size)
      this.line(vec2(posX, 0), vec2(posX, ht), ...colorArgs, this.yLines)
      this.line(vec2(negX, 0), vec2(negX, ht), ...colorArgs, this.yLines)
    }

    // Draw center lines
    const centerLineX = this.line(vec2(0, mY), vec2(wd, mY), color.blueGrey[200], 0.6, 2, new Graphics())
    const centerLineY = this.line(vec2(mX, 0), vec2(mX, ht), color.blueGrey[200], 0.6, 2, new Graphics())
    this.lines.addChild(centerLineX, centerLineY)


    this.point(mX, mY)
  }
}

export default GameMath
