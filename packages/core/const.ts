/**
 * Common event types.
 * 内置事件类型
 */
export enum PIKA_EVENT {
  /**
   * The application is initializing.
   * In this phase, new script is not allowed to be registered.
   * 初始化阶段
   */
  INIT = 'pika:init',

  /**
   * The application is running.
   * 运行状态
   */
  RUNNING = 'pika:running',

  /**
   * The application has been stopped.
   * 停止状态
   */
  STOP = 'pika:stop',

  /**
   * The application has not been started.
   * 未启动状态
   */
  SHUT = 'pika:shut',

  /**
   * Entity is added to the system.
   * 添加实体事件
   */
  ADD_ENTITY = 'pika:add_entity',

  /**
   * Entity is removed from the system.
   * 移除实体事件
   */
  REMOVE_ENTITY = 'pika:remove_entity',

  /**
   * Add component to the entity.
   * 添加组件事件
   */
  ADD_COMPONENT = 'pika:add_component',

  /**
   * Remove component from the entity.
   * 移除组件事件
   */
  REMOVE_COMPONENT = 'pika:remove_component'
}
