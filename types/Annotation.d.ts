import { OverlayEvent, TimestampPricePoint, CoordinatePoint, Viewport } from './Common';

export declare interface AnnotationCheckParams {
  point: TimestampPricePoint;
  coordinate: CoordinatePoint;
  size: number;
}

export declare interface AnnotationDrawParams {
  ctx: CanvasRenderingContext2D;
  point: TimestampPricePoint;
  coordinate: CoordinatePoint;
  viewport: Viewport;
  isActive: boolean;
  styles: any;
}

export declare interface Annotation {
  point: TimestampPricePoint;
  styles?: any;
  checkPointInCustomSymbol?: (params: AnnotationCheckParams) => void;
  drawCustomSymbol?: (params: AnnotationDrawParams) => void;
  drawExtend?: (params: AnnotationDrawParams) => void;
  onClick?: (event: OverlayEvent) => void;
  onRightClick?: (event: OverlayEvent) => void;
  onMouseEnter?: (event: OverlayEvent) => void;
  onMouseLeave?: (event: OverlayEvent) => void;
}
