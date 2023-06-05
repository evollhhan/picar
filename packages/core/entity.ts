import type { ComponentInterface } from './component'
import { PIKA_EVENT } from './const'
import { Script } from './script'

/**
 * Entity is a container for components. 
 * 实体是组件的容器，一个或多个组件构成了一个实体。实体本质上只是一个概念，内部组成主要是组件。
 * 实现上内置了id，用于标识实体。还有一些组件的内置的方法，用于管理组件。
 */
export class BaseEntity {
  /**
   * Next id of the entity.
   */
  static nextId = 0

  /**
   * The id of the entity.
   * 实体id
   */
  readonly _id = ++BaseEntity.nextId
}

export type Entity<ComponentTypes = Record<string, any>> = BaseEntity & ComponentTypes & {
  component: ComponentInterface
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
    return new BaseEntity() as Entity
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
