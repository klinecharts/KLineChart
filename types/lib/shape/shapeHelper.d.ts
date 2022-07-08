type Coordinate = {
  x?: number;
  y?: number;
}

declare module "klinecharts/lib/shape/shapeHelper" {
  
  export function checkCoordinateOnSegment(coordinate1: Coordinate, coordinate2: Coordinate, targetCoordinate: Coordinate): boolean
}
