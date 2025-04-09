import { BACKGROUND_COLOR, BALL_COLOR, COLOR, HIT_COLOR, PADDLE_COLOR } from "../constants"
import { Ball, Paddle, Pixel } from "../types"

export const updateGame = (
  canvas: HTMLCanvasElement,
  ballRef: { current: Ball },
  paddlesRef: { current: Paddle[] },
  pixelsRef: { current: Pixel[] }
) => {
  const ball = ballRef.current
  const paddles = paddlesRef.current

  ball.x += ball.dx
  ball.y += ball.dy

  // Ball collision with walls
  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
    ball.dy = -ball.dy
  }
  if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
    ball.dx = -ball.dx
  }

  // Ball collision with paddles
  paddles.forEach((paddle) => {
    if (paddle.isVertical) {
      if (
        ball.x - ball.radius < paddle.x + paddle.width &&
        ball.x + ball.radius > paddle.x &&
        ball.y > paddle.y &&
        ball.y < paddle.y + paddle.height
      ) {
        ball.dx = -ball.dx
      }
    } else {
      if (
        ball.y - ball.radius < paddle.y + paddle.height &&
        ball.y + ball.radius > paddle.y &&
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width
      ) {
        ball.dy = -ball.dy
      }
    }
  })

  // Update paddle positions
  paddles.forEach((paddle) => {
    if (paddle.isVertical) {
      paddle.targetY = ball.y - paddle.height / 2
      paddle.targetY = Math.max(0, Math.min(canvas.height - paddle.height, paddle.targetY))
      paddle.y += (paddle.targetY - paddle.y) * 0.1
    } else {
      paddle.targetY = ball.x - paddle.width / 2
      paddle.targetY = Math.max(0, Math.min(canvas.width - paddle.width, paddle.targetY))
      paddle.x += (paddle.targetY - paddle.x) * 0.1
    }
  })

  // Ball collision with pixels
  pixelsRef.current.forEach((pixel) => {
    if (
      !pixel.hit &&
      ball.x + ball.radius > pixel.x &&
      ball.x - ball.radius < pixel.x + pixel.size &&
      ball.y + ball.radius > pixel.y &&
      ball.y - ball.radius < pixel.y + pixel.size
    ) {
      pixel.hit = true
      const centerX = pixel.x + pixel.size / 2
      const centerY = pixel.y + pixel.size / 2
      if (Math.abs(ball.x - centerX) > Math.abs(ball.y - centerY)) {
        ball.dx = -ball.dx
      } else {
        ball.dy = -ball.dy
      }
    }
  })
}

export const drawGame = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  pixelsRef: { current: Pixel[] },
  ballRef: { current: Ball },
  paddlesRef: { current: Paddle[] }
) => {
  // Clear canvas
  ctx.fillStyle = BACKGROUND_COLOR
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Draw pixels
  pixelsRef.current.forEach((pixel) => {
    ctx.fillStyle = pixel.hit ? HIT_COLOR : COLOR
    ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size)
  })

  // Draw ball
  ctx.fillStyle = BALL_COLOR
  ctx.beginPath()
  ctx.arc(ballRef.current.x, ballRef.current.y, ballRef.current.radius, 0, Math.PI * 2)
  ctx.fill()

  // Draw paddles
  ctx.fillStyle = PADDLE_COLOR
  paddlesRef.current.forEach((paddle) => {
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height)
  })
}