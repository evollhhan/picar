import { Pika, System } from '../core'
import { Entity } from '../core/entity'

// This demo shows a simple ecs usage.
// The application will create a entity that has a movement component.
// The movement component will update the x value of the entity every frame.
// When the x value is greater than 100, it will be reset to 0.

// Create Pika app.
const pika = new Pika({ useTicker: true })

// Register movement component.
pika.component('movement')

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
pika.script(new MovementSystem())
pika.script(new GameInit())

// Start app.
pika.start()