import { PIXEL_MAP } from "../data/pixelMap"
import { LETTER_SPACING, WORD_SPACING } from "../constants"
import { Ball, Paddle, Pixel } from "../types"

export const calculateWordWidth = (word: string, pixelSize: number) => {
  return (
    word.split("").reduce((width, letter) => {
      const letterWidth = PIXEL_MAP[letter as keyof typeof PIXEL_MAP]?.[0]?.length ?? 0
      return width + letterWidth * pixelSize + LETTER_SPACING * pixelSize
    }, 0) -
    LETTER_SPACING * pixelSize
  )
}

export const initializeGame = (
  canvas: HTMLCanvasElement,
  scale: number,
  pixelsRef: { current: Pixel[] },
  ballRef: { current: Ball },
  paddlesRef: { current: Paddle[] }
) => {
  const LARGE_PIXEL_SIZE = 8 * scale
  const SMALL_PIXEL_SIZE = 4 * scale
  const BALL_SPEED = 6 * scale

  pixelsRef.current = []
  const words = ["PROMPTING", "IS ALL YOU NEED"]

  const totalWidthLarge = calculateWordWidth(words[0], LARGE_PIXEL_SIZE)
  const totalWidthSmall = words[1].split(" ").reduce((width, word, index) => {
    return width + calculateWordWidth(word, SMALL_PIXEL_SIZE) + (index > 0 ? WORD_SPACING * SMALL_PIXEL_SIZE : 0)
  }, 0)
  const totalWidth = Math.max(totalWidthLarge, totalWidthSmall)
  const scaleFactor = (canvas.width * 0.8) / totalWidth

  const adjustedLargePixelSize = LARGE_PIXEL_SIZE * scaleFactor
  const adjustedSmallPixelSize = SMALL_PIXEL_SIZE * scaleFactor

  const largeTextHeight = 5 * adjustedLargePixelSize
  const smallTextHeight = 5 * adjustedSmallPixelSize
  const spaceBetweenLines = 5 * adjustedLargePixelSize
  const totalTextHeight = largeTextHeight + spaceBetweenLines + smallTextHeight

  let startY = (canvas.height - totalTextHeight) / 2

  words.forEach((word, wordIndex) => {
    const pixelSize = wordIndex === 0 ? adjustedLargePixelSize : adjustedSmallPixelSize
    const totalWidth =
      wordIndex === 0
        ? calculateWordWidth(word, adjustedLargePixelSize)
        : words[1].split(" ").reduce((width, w, index) => {
            return width + calculateWordWidth(w, adjustedSmallPixelSize) + (index > 0 ? WORD_SPACING * adjustedSmallPixelSize : 0)
          }, 0)

    let startX = (canvas.width - totalWidth) / 2

    if (wordIndex === 1) {
      word.split(" ").forEach((subWord) => {
        subWord.split("").forEach((letter) => {
          const pixelMap = PIXEL_MAP[letter as keyof typeof PIXEL_MAP]
          if (!pixelMap) return

          for (let i = 0; i < pixelMap.length; i++) {
            for (let j = 0; j < pixelMap[i].length; j++) {
              if (pixelMap[i][j]) {
                const x = startX + j * pixelSize
                const y = startY + i * pixelSize
                pixelsRef.current.push({ x, y, size: pixelSize, hit: false })
              }
            }
          }
          startX += (pixelMap[0].length + LETTER_SPACING) * pixelSize
        })
        startX += WORD_SPACING * adjustedSmallPixelSize
      })
    } else {
      word.split("").forEach((letter) => {
        const pixelMap = PIXEL_MAP[letter as keyof typeof PIXEL_MAP]
        if (!pixelMap) return

        for (let i = 0; i < pixelMap.length; i++) {
          for (let j = 0; j < pixelMap[i].length; j++) {
            if (pixelMap[i][j]) {
              const x = startX + j * pixelSize
              const y = startY + i * pixelSize
              pixelsRef.current.push({ x, y, size: pixelSize, hit: false })
            }
          }
        }
        startX += (pixelMap[0].length + LETTER_SPACING) * pixelSize
      })
    }
    startY += wordIndex === 0 ? largeTextHeight + spaceBetweenLines : 0
  })

  // Initialize ball position near the top right corner
  const ballStartX = canvas.width * 0.9
  const ballStartY = canvas.height * 0.1

  ballRef.current = {
    x: ballStartX,
    y: ballStartY,
    dx: -BALL_SPEED,
    dy: BALL_SPEED,
    radius: adjustedLargePixelSize / 2,
  }

  const paddleWidth = adjustedLargePixelSize
  const paddleLength = 10 * adjustedLargePixelSize

  paddlesRef.current = [
    {
      x: 0,
      y: canvas.height / 2 - paddleLength / 2,
      width: paddleWidth,
      height: paddleLength,
      targetY: canvas.height / 2 - paddleLength / 2,
      isVertical: true,
    },
    {
      x: canvas.width - paddleWidth,
      y: canvas.height / 2 - paddleLength / 2,
      width: paddleWidth,
      height: paddleLength,
      targetY: canvas.height / 2 - paddleLength / 2,
      isVertical: true,
    },
    {
      x: canvas.width / 2 - paddleLength / 2,
      y: 0,
      width: paddleLength,
      height: paddleWidth,
      targetY: canvas.width / 2 - paddleLength / 2,
      isVertical: false,
    },
    {
      x: canvas.width / 2 - paddleLength / 2,
      y: canvas.height - paddleWidth,
      width: paddleLength,
      height: paddleWidth,
      targetY: canvas.width / 2 - paddleLength / 2,
      isVertical: false,
    },
  ]
}