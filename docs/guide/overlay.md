# 覆盖物
本文档介绍了图表内置的覆盖物和如何自定义一个覆盖物。

## 内置覆盖物类型
`horizontalRayLine` ， `horizontalSegment` ， `horizontalStraightLine` ， `verticalRayLine` ， `verticalSegment` ， `verticalStraightLine` ， `rayLine` ， `segment` ， `straightLine` ， `priceLine` ， `priceChannelLine` ， `parallelStraightLine` ， `fibonacciLine` ， `simpleAnnotation` ， `simpleTag`

## 自定义覆盖物
自定义一个覆盖物，然后通过 [registerOverlay](/api/chart/registerOverlay) 全局添加，添加到图表即可和内置覆盖物一样去使用。更多示例可参考 [https://github.com/klinecharts/KLineChart/tree/main/src/extension/overlay](https://github.com/klinecharts/KLineChart/tree/main/src/extension/overlay) 下的文件。
