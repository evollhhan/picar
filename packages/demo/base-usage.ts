import { Pika } from '../core'

// This demo shows how to use pika to create a simple application.
// The application will create a cirle that rotates around the center of the canvas.
// There is no ecs in this demo, only a simple script component.

// Create Pika app.
const pika = new Pika({ useTicker: true })

// consts
const SIZE = 512

// Create a canvas to render imgs
const canvas = document.createElement('canvas')
canvas.width = canvas.height = SIZE
document.body.appendChild(canvas)

// Get canvas context.
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

// Create a cirle that rotates around the center of the canvas.
let radian = 0
let radius = SIZE

// Add script.
pika.script({
  onUpdate (deltaTime: number) {
    // Update the rotation angle of the cirle.
    radian += deltaTime * 0.01
    radius -= 0.2

    if (radius < 0) {
      radius = SIZE
    }

    // Clear canvas.
    ctx.fillStyle = '#fff'
    ctx.globalAlpha = 0.04
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.globalAlpha = 1

    // Draw cirle.
    ctx.fillStyle = '#8bc34a'
    ctx.save()
    ctx.translate(canvas.width / 2, canvas.height / 2) // Move to center.
    ctx.beginPath()
    const r = radius / 3
    const x = Math.cos(radian) * r
    const y = Math.sin(radian) * r
    ctx.arc(x, y, 8, 0, Math.PI * 2)
    ctx.fill()
    ctx.closePath()
    ctx.restore()
  }
})

// Start app.
pika.start()
