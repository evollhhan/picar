# PIKA

> a javascript framework for game development, design based on the ECS-like architecture.


## FAQ

1. 什么时候需要用到```Component```和```System```？

答：虽然框架基于ECS架构，但是并不是所有的逻辑都需要用到```Entity```、```Component```或```System```。一些简单的项目只需要```Script```及其提供的生命周期即可。只有当你需要处理较为复杂的逻辑，譬如碰撞检测等，才需要用到ECS的相关概念。

2. 是否支持内置```ticker```？

答：目前暂不支持，一般的第三方渲染框架都会提供```ticker```，比如pixi.js的```ticker```，three.js的```clock```等。可以结合这些第三方的```ticker```来调用框架的```update```逻辑。

3. 是否支持```Singleton components```（单例组件）？

答：不需要，因为单例组件建议通过全局、或公共变量的方式来实现。对于一般项目实现来说，使用这种方式更加简单，而且不会影响到ECS的实现。