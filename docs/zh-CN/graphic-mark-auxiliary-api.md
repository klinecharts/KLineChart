# 图形标记辅助API

此类api，一般只有在自定义图形标记的时候才会用的到。


## 引入
```javascript
import { ... } from 'klinecharts/lib/mark/graphicHelper'
```


## API列表
### getDistance(coordinate1, coordinate2)
获取两点间距离
- `coordinate1` 第一个坐标
- `coordinate2` 第二个坐标


### getTriangleSquare(coordinate1, coordinate2, coordinate3)
根据三角形三个坐标获取三角形面积
- `coordinate1` 第一个坐标
- `coordinate2` 第二个坐标
- `coordinate3` 第三个坐标


### getRotateCoordinate(coordinate, targetCoordinate, angle)
获取一个坐标绕另一坐标旋转一定角度后新的点坐标
- `coordinate` 需要旋转的坐标
- `targetCoordinate` 目标坐标
- `angle` 角度


### getLinearSlopeIntercept(coordinate1, coordinate2)
获取由两坐标确定的一次函数的斜率k和截距b，返回 { k: xxx, b: xxx }
- `coordinate1` 第一个坐标
- `coordinate2` 第二个坐标


### getLinearYFromCoordinates(coordinate1, coordinate2, targetCoordinate)
根据某坐标的x坐标获取在两点决定的一次函数上的y值。
- `coordinate1` 第一个坐标
- `coordinate2` 第二个坐标
- `targetCoordinate` 目标坐标


### getLinearYFromSlopeIntercept(kb, targetCoordinate)
根据某坐标的x坐标和斜率截距获取y值。
- `kb` 斜率和截距
- `targetCoordinate` 目标坐标


### checkCoordinateOnStraightLine(coordinate1, coordinate2, targetCoordinate)
判断某坐标是否在由两坐标确定的直线上。
- `coordinate1` 第一个坐标
- `coordinate2` 第二个坐标
- `targetCoordinate` 目标坐标


### checkCoordinateOnRayLine(coordinate1, coordinate2, targetCoordinate)
判断某坐标是否在由两坐标确定的射线上。
- `coordinate1` 第一个坐标
- `coordinate2` 第二个坐标
- `targetCoordinate` 目标坐标


### checkCoordinateOnSegment(coordinate1, coordinate2, targetCoordinate)
判断某坐标是否在由两坐标确定的线段上。
- `coordinate1` 第一个坐标
- `coordinate2` 第二个坐标
- `targetCoordinate` 目标坐标


### checkCoordinateOnArc(circleCenterCoordinate, radius, startAngle, endAngle, targetCoordinate)
判断某坐标是否在圆弧上。
- `circleCenterCoordinate` 圆心坐标
- `radius` 半径
- `startAngle` 开始角度
- `endAngle` 结束角度
- `targetCoordinate` 目标坐标


### checkCoordinateInCircle(circleCenterCoordinate, radius, targetCoordinate)
判断某坐标是否在圆内。
- `circleCenterCoordinate` 圆心坐标
- `radius` 半径
- `targetCoordinate` 目标坐标


### checkCoordinateOnCircle(circleCenterCoordinate, radius, targetCoordinate)
判断某坐标是否在圆上。
- `circleCenterCoordinate` 圆心坐标
- `radius` 半径
- `targetCoordinate` 目标坐标


### checkCoordinateInTriangle(triangleCoordinates, targetCoordinate)
检查坐标是否在三角形内部
- `triangleCoordinates` 三角形的坐标
- `targetCoordinate` 目标坐标


### checkCoordinateInDiamond(centerCoordinate, width, height, targetCoordinate)
检查坐标是否在三角形菱形内部
- `centerCoordinate` 菱形中间坐标
- `width` 菱形宽
- `height` 菱形高
- `targetCoordinate` 目标坐标


### checkCoordinateInRect(coordinate1, coordinate2, targetCoordinate)
检查坐标是否在矩形内
- `coordinate1` 第一个坐标
- `coordinate2` 第二个坐标
- `targetCoordinate` 目标坐标


### getRayLine(coordinate1, coordinate2, xyMax)
根据两坐标获取射线。
- `coordinate1` 第一个坐标
- `coordinate2` 第二个坐标
- `xyMax` 坐标上的极值左边


### getParallelLines(coordinates, xyMax, extendParalleLineCount)
获取平行线。
- `coordinates` 已确定的线上的坐标
- `xyMax` 坐标上的极值左边
- `extendParalleLineCount` 平行线条数
