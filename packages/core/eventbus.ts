export interface EventListenerOptions {
  /**
   * Whether the event listener should be removed after the first time it is triggered
   */
  once?: boolean;
  /**
   * Whether the event listener should be triggered later on next event loop
   */
  later?: boolean;
}

export interface EventListener {
  /**
   * event name
   */
  name: string;
  /**
   * event handler
   */
  handler: any;
  /**
   * event listener options
   */
  options?: EventListenerOptions;
}

/**
 * manage events
 */
export class EventBus {
  /**
   * event map
   */
  protected evtMap: Record<string, EventListener[]> = {}


  /**
   * Add event listener
   * @param name event name
   * @param handler event handler
   * @param options event listener options
   */
  on (name: string, handler: any, options: EventListenerOptions = {}) {
    if (typeof handler !== 'function') {
      console.warn('[Pika] Event handler must be a function')
      return
    }

    const evts = this.evtMap[name] || []

    evts.push({
      name,
      handler,
      options
    })

    this.evtMap[name] = evts
  }

  /**
   * Remove event listener
   * @param name event name
   * @param handler event handler
   * @param all whether to remove all event listeners
   */
  off (name: string, handler: any, all?: boolean) {
    if (!handler || !(name in this.evtMap) || typeof handler !== 'function') {
      return
    }

    if (all) {
      this.evtMap[name] = []
      return
    }

    this.evtMap[name] = this.evtMap[name].filter((evt: EventListener) => evt.handler !== handler)
  }

  /**
   * Trigger an event with given name and arguments
   * @param name event name
   * @param args event arguments
   */
  emit (name: string, ...args: any[]) {
    const evts = this.evtMap[name] || []
    for (let i = 0; i < evts.length; i++) {
      // get each event listener
      const listener = evts[i]
      // get event handler options
      const { once, later } = listener.options || {}
      
      // trigger handler on next event loop
      if (later) {
        setTimeout(() => listener.handler(...args), 0)
      } else {
        listener.handler(...args)
      }

      // remove event listener if it is only triggered once
      if (once) {
        this.off(name, listener.handler)
      }
    }
  }

  /**
   * Return the number of event listeners for given event name.
   * If the event name is not in the event map, return -1
   * @param name event name
   */
  count (name: string) {
    return this.evtMap[name]?.length || -1
  }
}
