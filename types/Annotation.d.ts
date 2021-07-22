import { OverlayEvent, Point, Coordinate, Viewport } from './Common';

export declare interface AnnotationCheckParams {
  eventCoordinate?: Coordinate;
  coordinate?: Coordinate;
  size?: number;
}

export declare interface AnnotationDrawParams {
  ctx: CanvasRenderingContext2D;
  point?: Point;
  coordinate?: Coordinate;
  viewport?: Viewport;
  isActive?: boolean;
  styles?: any;
}

export declare interface Annotation {
  point: Point;
  styles?: any;
  checkEventCoordinateOnCustomSymbol?: (params: AnnotationCheckParams) => void;
  drawCustomSymbol?: (params: AnnotationDrawParams) => void;
  drawExtend?: (params: AnnotationDrawParams) => void;
  onClick?: (event: OverlayEvent) => void;
  onRightClick?: (event: OverlayEvent) => void;
  onMouseEnter?: (event: OverlayEvent) => void;
  onMouseLeave?: (event: OverlayEvent) => void;
}
