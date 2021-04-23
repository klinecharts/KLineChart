# 图形标记辅助API

此类api，一般只有在自定义图形标记的时候才会用的到。


## 引入
```javascript
import { ... } from 'klinecharts/lib/mark/graphicHelper'
```


## API列表
### getDistance(point1, point2)
获取两点间距离

- `point1` 第一个点
- `point2` 第二个点



### getRotatePoint(point, targetPoint, angle)
获取一点绕另一点旋转一定角度后新的点坐标

- `point` 需要旋转的点
- `targetPoint` 绕点
- `angle` 角度



### getLinearSlopeIntercept(point1, point2)
获取由两点确定的一次函数的斜率k和截距b，返回 { k: xxx, b: xxx }

- `point1` 第一个点
- `point2` 第二个点



### getLinearYFromPoints(point1, point2, targetPoint)
根据某点的x坐标获取在两点决定的一次函数上的y值。

- `point1` 一次函数的第一个点
- `point2 ` 一次函数的第二个点
- `targetPoint` 目标点



### getLinearYFromSlopeIntercept(kb, targetPoint)
根据某点的x坐标和斜率截距获取y值。

- `kb` 斜率和截距
- `targetPoint` 目标点



### checkPointOnStraightLine(point1, point2, targetPoint)
判断某点是否在由两点确定的直线上。

- `point1` 第一个点
- `point2` 第二个点
- `targetPoint` 目标点



### checkPointOnRayLine(point1, point2, targetPoint)
判断某点是否在由两点确定的射线上。

- `point1` 第一个点
- `point2` 第二个点
- `targetPoint` 目标点



### checkPointOnSegment(point1, point2, targetPoint)
判断某点是否在由两点确定的线段上。

- `point1` 第一个点
- `point2 ` 第二个点
- `targetPoint` 目标点



### checkPointOnArc(circleCenterPoint, radius, startAngle, endAngle, targetPoint)
判断某点是否在圆弧上。

- `circleCenterPoint` 圆心点
- `radius` 半径
- `startAngle` 开始角度
- `endAngle` 结束角度
- `targetPoint` 目标点



### checkPointInCircle(circleCenterPoint, radius, targetPoint)
判断某点是否在圆内。

- `circleCenterPoint` 圆心点
- `radius` 半径
- `targetPoint` 目标点



### checkPointOnCircle(circleCenterPoint, radius, targetPoint)
判断某点是否在圆上。

- `circleCenterPoint` 圆心点
- `radius` 半径
- `targetPoint` 目标点



### getRayLine(point1, point2, xyMax)
根据两点获取射线。

- `point1` 第一个点
- `point2` 第二个点
- `xyMax` 坐标上的极值左边



### getParallelLines(points, xyMax, extendParalleLineCount)
获取平行线。

- `points` 已确定的线上的点
- `xyMax` 坐标上的极值左边
- `extendParalleLineCount` 平行线条数
