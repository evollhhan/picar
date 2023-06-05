import { Entity } from './entity'
import { EventBus } from './eventbus'

/**
 * ArcheType is a set of entities that share the same component map.
 * e.g.: A set of entities that have the collision component and movement component.
 */
export class ArcheType<ComponentTypes = any> extends EventBus {
  /**
   * The signature of the arche type.
   * 原型签名，用于匹配对应的实体
   */
  readonly signature: number = 0

  /**
   * The entities of the arche type.
   * 实体列表
   */
  entities: Entity<ComponentTypes>[] = []

  /**
   * Create an arche type.
   * @param relatedComponents The related components of the system.
   */
  constructor (signature: number) {
    super()
    this.signature = signature
  }

  /**
   * Add an entity to the arche type.
   * 添加实体
   * @param entity The entity to add.
   */
  add (entity: Entity<ComponentTypes>) {
    if ((entity.component.signature & this.signature) === this.signature) {
      this.entities.push(entity)
      this.emit('add', entity)
    }
  }

  /**
   * Remove an entity from the arche type.
   * 移除实体，移除不需要校验签名
   * @param entity The entity to remove.
   */
  remove (entity: Entity<any>) {
    const index = this.entities.indexOf(entity)
    if (index !== -1) {
      this.entities.splice(index, 1)
      this.emit('remove', entity)
    }
  }
}
