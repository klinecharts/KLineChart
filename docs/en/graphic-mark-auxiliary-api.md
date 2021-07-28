# Graphic mark auxiliary API

Such apis are generally only used when customizing graphic marks.


## Introduction
```javascript
import { ... } from 'klinecharts/lib/mark/graphicHelper'
```


## API list
### getDistance(coordinate1, coordinate2)
Get the distance between two coordinates
- `coordinate1` the first coordinate
- `coordinate2` the second coordinate


### getTriangleSquare(coordinate1, coordinate2, coordinate3)
Obtain the triangle area according to the three coordinates of the triangle
-`coordinate1` the first coordinate
-`coordinate2` second coordinate
-`coordinate3` third coordinate


### getRotateCoordinate(coordinate, targetCoordinate, angle)
Get the new coordinates after one coordinate rotates a certain angle around another coordinate
- `coordinate` the coordinate to be rotated
- `targetCoordinate` detour coordinate
- `angle` angle


### getLinearSlopeIntercept(coordinate1, coordinate2)
Get the slope k and intercept b of the linear function determined by two coordinates, and return {k: xxx, b: xxx}
- `coordinate1` the first coordinate
- `coordinate2` the second coordinate


### getLinearYFromCoordinates(coordinate1, coordinate2, targetCoordinate)
Get the y value on the linear function determined by two coordinates according to the x coordinate.
- `coordinate1` the first coordinate
- `coordinate2` the second coordinate
- `targetCoordinate` target coordinate


### getLinearYFromSlopeIntercept(kb, targetCoordinate)
Get the y value based on the x coordinate and slope intercept of a coordinate.
- `kb` slope and intercept
- `targetCoordinate` target coordinate


### checkCoordinateOnStraightLine(coordinate1, coordinate2, targetCoordinate)
Determine whether a coordinate is on a straight line determined by two coordinates.
- `coordinate1` the first coordinate
- `coordinate2` the second coordinate
- `targetCoordinate` target coordinate


### checkCoordinateOnRayLine(coordinate1, coordinate2, targetCoordinate)
Determine whether a coordinate is on the ray determined by two coordinates.
- `coordinate1` the first coordinate
- `coordinate2` the second coordinate
- `targetCoordinate` target coordinate


### checkCoordinateOnSegment(coordinate1, coordinate2, targetCoordinate)
Determine whether a coordinate is on the line segment determined by two coordinates.
- `coordinate1` the first coordinate
- `coordinate2` the second coordinate
- `targetCoordinate` target coordinate


### checkCoordinateOnArc(circleCenterCoordinate, radius, startAngle, endAngle, targetCoordinate)
Determine whether a coordinate is on an arc.
- `circleCenterCoordinate` center coordinate
- `radius` radius
- `startAngle` start angle
- `endAngle` end angle
- `targetCoordinate` target coordinate


### checkCoordinateInCircle(circleCenterCoordinate, radius, targetCoordinate)
Determine whether a coordinate is inside the circle.
- `circleCenterCoordinate` center coordinate
- `radius` radius
- `targetCoordinate` target coordinate


### checkCoordinateOnCircle(circleCenterCoordinate, radius, targetCoordinate)
Determine whether a coordinate is on the circle.
- `circleCenterCoordinate` center coordinate
- `radius` radius
- `targetCoordinate` target coordinate


### checkCoordinateInTriangle(triangleCoordinates, targetCoordinate)
Check if the coordinates are inside the triangle
-`triangleCoordinates` the coordinates of the triangle
-`targetCoordinate` target coordinates


### checkCoordinateInDiamond(centerCoordinate, width, height, targetCoordinate)
Check if the coordinates are inside the triangle rhombus
-`centerCoordinate` the middle coordinate of the diamond
-`width` diamond width
-`height` diamond height
-`targetCoordinate` target coordinate


### checkCoordinateInRect(coordinate1, coordinate2, targetCoordinate)
Check if the coordinates are inside the rectangle
-`coordinate1` the first coordinate
-`coordinate2` second coordinate
-`targetCoordinate` target coordinate


### getRayLine(coordinate1, coordinate2, xyMax)
Obtain the ray from two coordinates.
- `coordinate1` the first coordinate
- `coordinate2` the second coordinate
- `xyMax` the extreme value on the coordinate


### getParallelLines(coordinates, xyMax, extendParalleLineCount)
Get parallel lines.
- `coordinates` The coordinates on the determined line
- `xyMax` the extreme value on the coordinate
- `extendParalleLineCount` number of parallel lines
