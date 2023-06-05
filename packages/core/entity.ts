import { Script } from './script'
import { PIKA_EVENT } from './const'

/**
 * Entity is a container for components.
 * 实体的组件容器，一个或多个组件可以构成一个实体
 */
export class Entity<Components = any> {
  /**
   * The number of entities created.
   */
  static IDs: number = 0

  /**
   * The id of the entity.
   */
  id: number = ++Entity.IDs

  /**
   * A observerable map of components. Initialize in entity system `create` method.
   * This property cannot be overwritten or deleted.
   */
  components!: Components
}

/**
 * Entity system is a script that manages entities.
 * 实体系统，用于管理所有实体
 */
export class EntitySystem extends Script {
  /**
   * All entities created by `create` method.
   * 所有通过create创建的实体
   */
  entities: Entity[] = []

  /**
   * Create an entity.
   * 创建实体
   */
  create () {
    const entity = new Entity()

    Object.defineProperty(entity, 'components', {
      value: this.app.components.create(),
      writable: false,
      configurable: false
    })

    return entity
  }

  /**
   * Add an entity to the system.
   * 添加实体
   * @param entity
   */
  add (entity: Entity) {
    this.entities.push(entity)

    // Emit global add event.
    this.emit(PIKA_EVENT.ADD_ENTITY, entity)
  }

  /**
   * Remove an entity from the system.
   * 移除实体
   * @param entity
   */
  remove (entity: Entity) {
    const index = this.entities.indexOf(entity)

    if (index < 0) {
      return
    }

    // Remove all components of the entity.
    entity.components.destroy()

    // Remove the entity from the system.
    this.entities.splice(index, 1)

    // Emit global remove event.
    this.emit(PIKA_EVENT.REMOVE_ENTITY, entity)
  }
}
