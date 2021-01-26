import React, { CSSProperties, useRef, useState } from 'react'
import { Shape } from '../Toolbar'
import './index.css'

interface CanvasProps {
  shape: Shape
}

interface Point {
  x: number
  y: number
}

const contextDefaults: Partial<Record<keyof CanvasRenderingContext2D, string>> = {
  lineWidth: '2',
  lineCap: 'round',
  strokeStyle: 'black'
}

const getCursorPosition = (canvas: HTMLCanvasElement, event: React.MouseEvent) => {
  const rect = canvas.getBoundingClientRect()
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  }
}

export const Canvas: React.FC<CanvasProps> = props => {
  const mainRef = useRef<HTMLCanvasElement>(null)
  const tempRef = useRef<HTMLCanvasElement>(null)
  const [points, setPoints] = useState<Point[]>([])
  const [drawing, setDrawing] = useState(false)
  const [startXY, setStartXY] = useState<Point>({ x: 0, y: 0 })
  const [tempStyle, setStyle] = useState<CSSProperties>({
    left: -5000
  })
  const [onMouseUpCallback, setOnMouseUpCallback] = useState<() => void>(null)

  const onMouseDown = (e: React.MouseEvent) => {
    const { x, y } = getCursorPosition(mainRef.current, e)
    setStartXY({ x, y })
    setStyle({ left: 0 })
    setDrawing(true)
  }

  const drawLine = (clientX: number, clientY: number, ctx: CanvasRenderingContext2D) => {
    ctx.lineTo(clientX, clientY)
    ctx.stroke()
    ctx.beginPath()
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(clientX, clientY)
  }
  
  const drawPen = (clientX: number, clientY: number, ctx: CanvasRenderingContext2D) => {
      drawLine(clientX, clientY, ctx)
      setPoints([...points, { x: clientX, y: clientY }])

      const drawLineCallback = () => {
        const mainCtx = mainRef.current.getContext('2d')
        const tempCtx = tempRef.current.getContext('2d')
        tempCtx.clearRect(0, 0, tempRef.current.width, tempRef.current.height)
        tempCtx.beginPath()
        mainCtx.beginPath()
        for (const point of points) {
          drawLine(point.x, point.y, mainCtx)
        }
      }
      setOnMouseUpCallback(() => drawLineCallback)
    }

  const drawRect = (clientX: number, clientY: number) => {
    const ctx = tempRef.current.getContext('2d')
    ctx.clearRect(0, 0, tempRef.current.width, tempRef.current.height)

    const rect = (ctx: CanvasRenderingContext2D) => {
      ctx.beginPath()
      ctx.rect(startXY.x, startXY.y, clientX - startXY.x, clientY - startXY.y)
      ctx.stroke()
    }

    rect(ctx)

    const cb = () => {
      rect(mainRef.current.getContext('2d'))
    }

    setOnMouseUpCallback(() => cb)
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (!drawing) {
      return
    }

    const ctx = tempRef.current.getContext('2d')

    const { x, y } = getCursorPosition(mainRef.current, e)

    if (props.shape === 'pen') {
      drawPen(x, y, ctx)
    }

    if (props.shape === 'rect') {
      drawRect(x, y)
    }
  }

  const onMouseUp = (e: React.MouseEvent) => {
    onMouseUpCallback()

    setDrawing(false)
    setPoints([])
    setStyle({ left: -5000 })

    // start new path for next shape
    const mainCtx = mainRef.current.getContext('2d')
    const tempCtx = tempRef.current.getContext('2d')
    tempCtx.beginPath()
    mainCtx.beginPath()
  }

  return (
    <div className='cy-draw__wrapper'>
      <canvas
        ref={mainRef}
        id='cy-draw__main--canvas'
        height='300'
        width='300'
        onMouseDown={onMouseDown}
      />

      <canvas
        ref={tempRef}
        id='cy-draw__temp--canvas'
        height='300'
        width='300'
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        style={tempStyle}
      />
    </div>
  )
}