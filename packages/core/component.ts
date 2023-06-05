import type { Entity } from './entity';
import { ArcheType } from './archetype';
import { PIKA_EVENT } from './const';
import { Script } from './script';
import { Signature } from './signature'

export interface ComponentPrototype {
  /**
   * The bit index of the component.
   */
  id: number;

  /**
   * The constructor of the component.
   */
  constructor?: any;
}

export class ComponentInterface {
  /**
   * A pointer to the component manager.
   */
  scope: Component

  /**
   * Indicate which entity the component belongs to.
   */
  belong: Entity

  /**
   * The signature of the entity.
   */
  signature: number = 0

  /**
   * The names of the component.
   */
  names: string[] = []

  constructor (scope: Component, entity: Entity) {
    this.scope = scope
    this.belong = entity
  }

  /**
   * Add a component to the entity.
   * @param componentName The name of the component.
   * @param initValue The initial value of the component.
   */
  add (componentName: string, initValue: any) {
    this.scope.add(this.belong, componentName, initValue)
  }

  /**
   * Remove a component from the entity.
   * @param componentName The name of the component.
   */
  remove (componentName: string) {
    this.scope.remove(this.belong, componentName)
  }

  /**
   * Remove all components.
   */
  destroy () {
    this.scope.destroy(this.belong)
  }
}

/**
 * Component Manager.
 * Component is the basic unit of data in ecs.
 */
export class Component extends Script {
  /**
   * Signature module.
   * 签名模块
   */
  protected signature = new Signature()

  /**
   * Registered components.
   * 组件注册表
   */
  protected components = new Map<string, ComponentPrototype>()

  /**
   * Archetypes.
   * 原型列表
   */
  protected archetypes = new Map<number, ArcheType>()

  /**
   * Register a component.
   * 注册组件
   * @param name The name of the component.
   * @param constructor The constructor of the component.
   */
  register (name: string, constructor?: any) {
    if (!name) {
      throw new Error('[Pika] The name of the component is required.')
    }

    if (name in this.components) {
      throw new Error(`[Pika] The component "${name}" has been registered.`)
    }

    this.components.set(name, {
      id: this.signature.register(),
      constructor
    })
  }

  /**
   * Get the component prototype by name.
   * 获取组件原型
   * @param name
   */
  getPrototype (name: string) {
    return this.components.get(name)
  }

  /**
   * Provide component interface to the entity.
   * 为实体提供组件接口
   */
  observe (entity: Entity) {
    const instance = new ComponentInterface(this, entity)
    return instance
  }

  /**
   * Add component to the entity.
   * 添加组件
   * @param entity The entity to add component.
   * @param componentName The name of the component.
   * @param initValue The initial value of the component.
   */
  add (entity: Entity, componentName: string, initValue: any) {
    // Currently, only one component of the same type can be added to the entity.
    if (componentName in entity) {
      console.warn(`[Pika] Component ${componentName} has already been added to`, entity)
    }

    // Get reigstered component info.
    const proto = this.getPrototype(componentName)

    // Update component names
    entity.component.names.push(componentName)

    // Check if the component has indvidual constructor.
    entity[componentName] = (proto && proto.constructor) ? new proto.constructor(initValue) : initValue

    // Update signature.
    entity.component.signature = this.getSignatureByComponentNames(entity.component.names)

    // Update archetype.
    Array.from(this.archetypes.values()).forEach((archetype) => archetype.add(entity))

    // Emit add event.
    this.emit(PIKA_EVENT.ADD_COMPONENT, entity, componentName)
  }

  /**
   * Remove component from the component map.
   * 移除组件
   * @param entity The entity to remove component.
   * @param componentName The name of the component.
   */
  remove (entity: Entity, componentName: string) {
    if (!(componentName in entity)) {
      return false
    }

    delete entity[componentName]

    // Update component names
    entity.component.names = entity.component.names.filter((name) => name !== componentName)

    // Update signature.
    entity.component.signature = this.getSignatureByComponentNames(entity.component.names)

    // Update archetype.
    Array.from(this.archetypes.values()).forEach((archetype) => archetype.remove(entity))

    // Emit remove event.
    this.emit(PIKA_EVENT.REMOVE_COMPONENT, entity, componentName)

    return true
  }

  /**
   * Destroy all components of the entity.
   * 销毁组件
   * @param components The component map.
   */
  destroy (entity: Entity) {
    entity.component.names.forEach((name) => this.remove(entity, name))
  }

  /**
   * Create an archetype with related components. Component should be registered before creating archetype.
   * @param componentNames The names of the components.
   */
  createArchetype (componentNames: string[]) {
    if (!componentNames || !componentNames.length) {
      throw new Error('[Pika] At least one component name is required to create an archetype.')
    }

    componentNames.forEach((name) => {
      if (!(name in this.components)) {
        throw new Error(`[Pika] Component "${name}" is not registered.`)
      }
    })

    const signature = this.getSignatureByComponentNames(componentNames)
    
    // Check if the archetype with the same signature has already been created.
    if (this.archetypes.has(signature)) {
      return this.archetypes.get(signature)
    }

    // Create archetype.
    const archetype = new ArcheType(signature)

    this.archetypes.set(signature, archetype)

    return archetype
  }

  /**
   * Get signature by component names.
   * 根据组件获取签名
   * @param componentNames The names of the components.
   */
  getSignatureByComponentNames (componentNames: string[]) {
    if (!componentNames.length) {
      return 0
    }

    const arr = this.signature.create()

    componentNames.forEach((name) => {
      const proto = this.getPrototype(name)
      if (proto) {
        this.signature.setBitAt(arr, proto.id, '1')
      }
    })

    return this.signature.parse(arr)
  }
}
