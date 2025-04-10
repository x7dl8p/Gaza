"use client"

import { useEffect, useRef } from "react"
import { Ball, Paddle, Pixel } from "./types"
import { initializeneed } from "./utils/initialization"
import { drawneed, updateneed } from "./utils/needLoop"

export function Promptingneed() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pixelsRef = useRef<Pixel[]>([])
  const ballRef = useRef<Ball>({ x: 0, y: 0, dx: 0, dy: 0, radius: 0 })
  const paddlesRef = useRef<Paddle[]>([])
  const scaleRef = useRef(1)
 
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      scaleRef.current = Math.min(canvas.width / 1000, canvas.height / 1000)
      initializeneed(canvas, scaleRef.current, pixelsRef, ballRef, paddlesRef)
    }

    const needLoop = () => {
      updateneed(canvas, ballRef, paddlesRef, pixelsRef)
      drawneed(ctx, canvas, pixelsRef, ballRef, paddlesRef)
      requestAnimationFrame(needLoop)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    needLoop()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full"
      aria-label="Gaza Needs You: Fullscreen Pong need with pixel text"
    />
  )
}

export default Promptingneed