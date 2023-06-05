import type { Pika } from './app'

export interface ScriptLifecycle {
  /**
   * Called when the script will be installed to the application.
   * 当脚本被注册到游戏程序中时执行
   */
  onInstalled?(): void | Promise<void>

  /**
   * Initialize the script. You can load resources or do other initialization work here.
   * The application will wait for all scripts to done the load work before starting.
   * 预加载阶段，大多数初始化工作例如加载资源等可以放在这里执行
   */
  onLoad?(): void | Promise<void>

  /**
   * Called when the all scripts are loaded. In this phase, the application state has been changed to running.
   * 所有脚本的预加载阶段已经完成
   */
  onLoaded?(): void | Promise<void>

  /**
   * Called on every frame, usually used to execute game logic. Note that you should use onUpdateEntity to update the entity instead of this method.
   * 帧更新，通常用于执行游戏逻辑。在系统中，请使用onUpdateEntity方法而不是这个。
   * @param deltaTime 更新时间
   */
  onUpdate?(deltaTime: number): void;

  /**
   * Called after the update phase is completed.
   * 延后更新，在帧更新全部执行完毕后执行
   * @param deltaTime
   */
  onLateUpdate?(): void;

  /**
   * Called when the application is stopped.
   * 当游戏暂停时触发
   */
  onStop?(): void | Promise<void>

  /**
   * Called when the application is resumed.
   * 当游戏恢复时触发
   */
  onResume?(): void | Promise<void>

  /**
   * Called when the application is destroyed.
   * 当销毁脚本时执行。
   */
  onDestroy?(): void | Promise<void>
}

/**
 * The base logic module of the application.
 * 脚本是构成应用的基础逻辑模块
 */
export class Script {
  /**
   * The current state of the script.
   * If the script is not active, it will not go into the update or lateUpdate phase.
   * 当前脚本是否是激活状态，未激活状态下，不相应update、lateUpdate阶段
   */
  actived = true

  /**
   * The application instance. It will be injected when the script is registerd to the application.
   * 应用实例，在注册时会被注入
   */
  app!: Pika

  /**
   * Add event listener
   * 监听事件
   */
  get on () {
    return this.app.on
  }

  /**
   * Trigger event
   * 触发事件
   */
  get emit () {
    return this.app.emit
  }

  /**
   * Remove event listener
   * 移除事件监听
   */
  get off () {
    return this.app.off
  }
}
