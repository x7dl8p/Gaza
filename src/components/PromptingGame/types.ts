export interface Pixel {
  x: number
  y: number
  size: number
  hit: boolean
}

export interface Ball {
  x: number
  y: number
  dx: number
  dy: number
  radius: number
}

export interface Paddle {
  x: number
  y: number
  width: number
  height: number
  targetY: number
  isVertical: boolean
}