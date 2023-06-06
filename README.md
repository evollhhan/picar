# PIKA - A ECS Framework

![logo](https://i.postimg.cc/jjnp9FcY/Rectangle-9666.png)

## 介绍

PIKA是一个基于ECS思想的开发框架，它的设计目标是为互动、游戏类项目提供一套数据与逻辑分离的解决方案，并使用组合的方式来构建游戏对象。虽然框架的设计参考了ECS的思想，但是并不是完全按照ECS的标准来实现，你可以根据项目的实际需求进行调整。

## 一个简单的例子

以下代码展示了如何使用PIKA来创建一个简单的应用。这个应用会在画布中心创建一个旋转的圆圈。

```javascript
import { Pika } from '../core'

// This demo shows how to use pika to create a simple application.
// The application will create a cirle that rotates around the center of the canvas.
// There is no ecs in this demo, only a simple script component.

// Create Pika app.
const pika = new Pika({ useTicker: true })

// consts
const SIZE = 512

// Create a canvas to render imgs
const canvas = document.createElement('canvas')
canvas.width = canvas.height = SIZE
document.body.appendChild(canvas)

// Get canvas context.
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

// Create a cirle that rotates around the center of the canvas.
let radian = 0
let radius = SIZE

// Add script.
pika.script({
  onUpdate (deltaTime: number) {
    // Update the rotation angle of the cirle.
    radian += deltaTime * 0.01
    radius -= 0.2

    if (radius < 0) {
      radius = SIZE
    }

    // Clear canvas.
    ctx.fillStyle = '#fff'
    ctx.globalAlpha = 0.04
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.globalAlpha = 1

    // Draw cirle.
    ctx.fillStyle = '#8bc34a'
    ctx.save()
    ctx.translate(canvas.width / 2, canvas.height / 2) // Move to center.
    ctx.beginPath()
    const r = radius / 3
    const x = Math.cos(radian) * r
    const y = Math.sin(radian) * r
    ctx.arc(x, y, 8, 0, Math.PI * 2)
    ctx.fill()
    ctx.closePath()
    ctx.restore()
  }
})

// Start app.
pika.start()

```

## FAQ

1. 什么时候需要用到```Component```和```System```？

答：虽然框架基于ECS架构，但是并不是所有的逻辑都需要用到```Entity```、```Component```或```System```。一些简单的项目只需要```Script```及其提供的生命周期即可。只有当你需要处理较为复杂的逻辑，譬如碰撞检测等，才需要用到ECS的相关概念。

2. 是否支持```Singleton components```（单例组件）？

答：不需要，因为单例组件建议通过全局、或公共变量的方式来实现。对于一般项目实现来说，使用这种方式更加简单，而且不会影响到ECS的实现。