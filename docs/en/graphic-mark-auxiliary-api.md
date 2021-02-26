# Graphic mark auxiliary API

Such apis are generally only used when customizing graphic marks.


## Introduction
```javascript
import { ... } from 'klinecharts/lib/mark/graphicHelper'
```


## API list
### getDistance(point1, point2)
Get the distance between two points
- `point1` the first point
- `point2` the second point


### getRotatePoint(point, targetPoint, angle)
Get the new point coordinates after one point rotates a certain angle around another point
- `point` the point to be rotated
- `targetPoint` detour point
- `angle` angle


### getLinearSlopeIntercept(point1, point2)
Get the slope k and intercept b of the linear function determined by two points, and return {k: xxx, b: xxx}
- `point1` the first point
- `point2` the second point


### getLinearYFromPoints(point1, point2, targetPoint)
Get the y value on the linear function determined by two points according to the x coordinate of a certain point.
- `point1` the first point of a function
- `point2` the second point of a function
- `targetPoint` target point


### getLinearYFromPoints(kb, targetPoint)
Get the y value based on the x coordinate and slope intercept of a point.
- `kb` slope and intercept
- `targetPoint` target point


### checkPointOnStraightLine(point1, point2, targetPoint)
Determine whether a point is on a straight line determined by two points.
- `point1` the first point
- `point2` the second point
- `targetPoint` target point


### checkPointOnRayLine(point1, point2, targetPoint)
Determine whether a point is on the ray determined by two points.
- `point1` the first point
- `point2` the second point
- `targetPoint` target point


### checkPointOnSegment(point1, point2, targetPoint)
Determine whether a point is on the line segment determined by two points.
- `point1` the first point
- `point2` the second point
- `targetPoint` target point


### checkPointOnArc(circleCenterPoint, radius, startAngle, endAngle, targetPoint)
Determine whether a point is on an arc.
- `circleCenterPoint` center point
- `radius` radius
- `startAngle` start angle
- `endAngle` end angle
- `targetPoint` target point



### checkPointInCircle(circleCenterPoint, radius, targetPoint)
Determine whether a point is inside the circle.

- `circleCenterPoint` center point
- `radius` radius
- `targetPoint` target point



### checkPointOnCircle(circleCenterPoint, radius, targetPoint)
Determine whether a point is on the circle.

- `circleCenterPoint` center point
- `radius` radius
- `targetPoint` target point



### getRayLine(point1, point2, xyMax)
Obtain the ray from two points.

- `point1` the first point
- `point2` the second point
- `xyMax` coordinates to the left of the extreme value



### getParallelLines(points, xyMax, extendParalleLineCount)
Get parallel lines.

- `points` The points on the determined line
- `xyMax` the left side of the extreme value on the coordinate
- `extendParalleLineCount` number of parallel lines
