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

export type ComponentMap<Type = Record<string, any>> = {
  /**
   * The signature of the component map.
   * 组件签名
   */
  _signature: number
  /**
   * Add a component to the map.
   * @param name The name of the component.
   * @param initValue The initial value of the component.
   */
  add: (name: string, initValue: any) => void
  /**
   * Remove a component from the map.
   * @param name The name of the component.
   */
  remove: (name: string) => void
  /**
   * Remove all components of the entity.
   */
  destroy: () => void
} & Type

/**
 * Component Manager.
 * Component is the basic unit of data in ecs.
 */
export class Component extends Script {
  /**
   * Registered components.
   * 组件注册表
   */
  protected map: Record<string, ComponentPrototype> = {}

  /**
   * Signature module.
   * 签名模块
   */
  protected signature = new Signature()

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

    if (name in this.map) {
      throw new Error(`[Pika] The component "${name}" has been registered.`)
    }

    this.map[name] = {
      id: this.signature.register(),
      constructor
    }
  }

  /**
   * Get the component prototype by name.
   * 获取组件原型
   * @param name
   */
  getPrototype (name: string) {
    return this.map[name]
  }

  /**
   * Create a observerable component map.
   * 创建组件对象
   * @param sys entity system
   */
  create () {
    const components = { _signature: 0 } as ComponentMap

    return new Proxy(components, {
      set: (target, prop: string, value) => {
        // Ignore the signature and add/remove methods.
        if (prop === '_signature' || prop === 'add' || prop === 'remove' || prop === 'destroy') {
          return false
        }

        if (prop in target) {
          target[prop] = value
        } else {
          this.add(target, prop, value)
        }
        return true
      },
      get: (target, prop: string) => {
        if (prop === 'add') {
          return (name: string, initValue: any) => this.add(target, name, initValue)
        }

        if (prop === 'remove') {
          return (name: string) => this.remove(target, name)
        }

        if (prop === 'destroy') {
          return () => this.destroy(target)
        }

        return target[prop]
      }
    })
  }

  /**
   * Add component to the component map.
   * 添加组件
   * @param components The component map.
   * @param componentName The name of the component.
   * @param initValue The initial value of the component.
   */
  add (components: ComponentMap, componentName: string, initValue: any) {
    // Component has already been added.
    if (componentName in components) {
      console.warn(`[Pika] Component ${componentName} has already been added to`, components)
      return
    }

    // Get reigstered component info.
    const proto = this.getPrototype(componentName)

    if (!proto) {
      components[componentName] = initValue
      return
    }

    // Check if the component has indvidual constructor.
    const { constructor } = proto

    components[componentName] = constructor ? new constructor(initValue) : initValue

    // Update signature.
    components._signature = this.getSignatureByComponentNames(Object.keys(components))

    // Emit add event.
    this.emit(PIKA_EVENT.ADD_COMPONENT, components)
  }

  /**
   * Remove component from the component map.
   * 移除组件
   * @param components The component map.
   * @param componentName The name of the component.
   */
  remove (components: ComponentMap, componentName: string) {
    if (!(componentName in components)) {
      return
    }

    delete components[componentName]

    // Update signature.
    components._signature = this.getSignatureByComponentNames(Object.keys(components))

    // Emit remove event.
    this.emit(PIKA_EVENT.REMOVE_COMPONENT, components)
  }

  /**
   * Destroy all components of the entity.
   * 销毁组件
   * @param components The component map.
   */
  destroy (components: ComponentMap) {
    Object.keys(components).forEach((name) => this.remove(components, name))
  }

  /**
   * Get signature by component names.
   * 根据组件获取签名
   * @param names The names of the components.
   */
  getSignatureByComponentNames (names: string[]) {
    if (!names.length) {
      return 0
    }

    const arr = this.signature.create()

    names.forEach((name) => {
      const proto = this.getPrototype(name)
      if (proto) {
        this.signature.setBitAt(arr, proto.id, '1')
      }
    })

    return this.signature.parse(arr)
  }
}
