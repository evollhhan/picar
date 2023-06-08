import type { Entity } from './entity'
import { ArcheType } from './archetype'
import { Script, ScriptLifecycle } from './script'

/**
 * System is a special script that contains a set of entities with same component map.
 * e.g.: A set of entities that have the collision component and movement component.
 * 系统是一种特殊的脚本，它包含一组具有相同组件的实体。
 */
export class System<ComponentTypes = Record<string, any>> extends Script implements ScriptLifecycle {
  /**
   * The archetype of the system.
   */
  archetype: ArcheType<ComponentTypes> | undefined

  /**
   * The related names of the components.
   */
  readonly componentNames: string[]

  /**
   * Create a system.
   * @param componentNames The names of the components. 关联组件名称
   */
  constructor (componentNames: string[] = []) {
    super()
    this.componentNames = componentNames
  }

  /**
   * Note that related components must be registered before the system is installed.
   */
  onInstalled () {
    if (this.componentNames.length) {
      this.archetype = this.app.Component.createArchetype(this.componentNames)
    }
  }

  /**
   * @param deltaTime
   */
  onUpdate (deltaTime: number) {
    this.archetype?.entities.forEach((entity, index) => this.onUpdateEntity(entity, deltaTime, index))
  }

  /**
   * @param entity
   * @param deltaTime
   */
  onUpdateEntity (entity: Entity<ComponentTypes>, deltaTime: number, index: number) {
    // implement this method to update the entity
  }
}
