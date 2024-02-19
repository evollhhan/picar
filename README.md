# Pikas - A Javascript ECS Framework

![pikas](https://github.com/evollhhan/pikas/assets/7286858/1aaf6930-af55-4bb1-bade-468b4dc3fcc9)

Pikas is a development framework based on the ECS concept. Its design goal is to provide a solution for interactive and game-like projects that separates data and logic, and uses a composition-based approach to build game objects.

## Quick Start

### Basic Usage

The following demo shows how to use pikas to create a simple application which has a rotating circle at the center of the canvas.

```javascript
import { Pikas } from '../core'

// This demo shows how to use pikas to create a simple application.
// The application will create a cirle that rotates around the center of the canvas.
// There is no ecs in this demo, only a simple script component.

// Create Pikas app.
const pikas = new Pikas({ useTicker: true })

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
pikas.script({
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
pikas.start()

```

### Ecs Example

This demo shows a simple ECS usage which creates an entity that has a movement component. The movement component will update the x value of the entity every frame. When the x value is greater than 100, it will be reset to 0.

```typescript
import { Pikas, System } from '../core'
import { Entity } from '../core/entity'

// Create Pikas app.
const pikas = new Pikas({ useTicker: true })

// Register movement component.
pikas.component('movement')

// Define target entity component map
interface SampleComponent {
  movement: {
    x: number
  }
}

// Movment system controls the movement of the entity.
class MovementSystem extends System {
  constructor () {
    super(['movement'])
  }

  onUpdateEntity(entity: Entity<SampleComponent>, deltaTime: number): void {
    let value = entity.movement.x + 1 * deltaTime
    if (value > 100) {
      value = 0
    }
    entity.movement.x = value
  }
}

// Game init system will create a entity that has a movement component.
class GameInit extends System {
  onLoad () {
    const e = this.app.entity()
    e.component.add('movement', { x: 0 })
  }
}

// Add system.
pikas.script(new MovementSystem())
pikas.script(new GameInit())

// Start app.
pikas.start()
```
