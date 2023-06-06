import { Script, ScriptLifecycle } from './script'

export interface TickerOptions {
  /**
   * The FPS of the app.
   * 应用的FPS
   */
  fps?: number
}

export class Ticker extends Script implements ScriptLifecycle {
  /**
   * The FPS of the app.
   */
  private _fps = 60

  /**
   * Update interval when fps changes.
   */
  set fps (val: number) {
    this._fps = val
    this.interval = 1000 / val
  }

  get fps () {
    return this._fps
  }

  /**
   * The interval of the ticker, calculated by FPS.
   */
  interval = 1000 / this.fps

  /**
   * Default status is not actived.
   */
  actived = false

  onLoad () {
    this.startTicker()
  }

  onStop () {
    this.stopTicker()
  }

  onResume () {
    this.startTicker()
  }

  onDestroy () {
    this.stopTicker()
  }

  /**
   * Create a built-in ticker
   * 创建内置的计时器
   * @param options
   */
  constructor (options: TickerOptions = {}) {
    super()

    if (options.fps) {
      this.fps = options.fps
    }
  }

  /**
   * Start the ticker.
   */
  startTicker () {
    if (this.actived) {
      // The ticker is already actived.
      return
    }

    this.actived = true

    let lastTime = Date.now()
    let currentTime = 0
    let deltaTime = 0

    const loop = () => {
      // The ticker will stop when the app is not actived.
      if (!this.actived) {
        return
      }

      currentTime = Date.now()

      deltaTime = currentTime - lastTime

      if (deltaTime > this.interval) {
        // update app
        this.app.update(deltaTime / this.interval)

        // update last time
        lastTime = currentTime
      }

      requestAnimationFrame(loop)
    }

    requestAnimationFrame(loop)
  }

  /**
   * Stop the ticker.
   */
  stopTicker () {
    this.actived = false
  }
}