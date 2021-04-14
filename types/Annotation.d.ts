import { OverlayEvent, TimestampPricePoint, CoordinatePoint, Viewport } from './Common';

export declare interface AnnotationCheckParams {
  point: TimestampPricePoint;
  coordinatePoint: CoordinatePoint;
  size: number;
}

export declare interface AnnotationDrawExtendParams {
  ctx: CanvasRenderingContext2D;
  point: TimestampPricePoint;
  coordinatePoint: CoordinatePoint;
  viewport: Viewport;
  isActive: boolean;
  styles: any;
}

export declare interface Annotation {
  point: TimestampPricePoint;
  checkPointInCustomSymbol?: (params: AnnotationCheckParams) => void;
  drawCustomSymbol?: (params: AnnotationDrawExtendParams) => void;
  onClick?: (event: OverlayEvent) => void;
  onRightClick?: (event: OverlayEvent) => void;
  onMouseEnter?: (event: OverlayEvent) => void;
  onMouseLeave?: (event: OverlayEvent) => void;
}
