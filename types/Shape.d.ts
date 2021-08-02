import { Precision, Viewport, Coordinate, Point, OverlayEvent } from './Common';

export declare type ShapeMode = 'normal' | 'weak_magnet' | 'strong_magnet';

export declare type ShapeElementType = 'line' | 'text' | 'continuous_line' | 'polygon' | 'arc';

export declare interface ShapeDataSourceItem extends Coordinate {
  radius?: number;
  startAngle?: number;
  endAngle?: number;
  text?: string;
}

export declare interface ShapeDataSource {
  key?: string;
  type: ShapeElementType;
  isDraw?: boolean;
  isCheck?: boolean;
  styles?: any;
  dataSource: ShapeDataSourceItem[] | ShapeDataSourceItem[][];
}

export declare interface ShapeEvent extends OverlayEvent {
  step?: number;
}

export declare interface OverrideShape {
  id?: string;
  styles?: any;
  lock?: boolean;
  mode?: ShapeMode;
}

export declare interface Shape extends OverrideShape {
  name: string;
  points?: Point[];
  onDrawStart?: (event: ShapeEvent) => void;
  onDrawing?: (event: ShapeEvent) => void;
  onDrawEnd?: (event: ShapeEvent) => void;
  onClick?: (event: ShapeEvent) => void;
  onRightClick?: (event: ShapeEvent) => boolean;
  onPressedMove?: (event: ShapeEvent) => void;
  onMouseEnter?: (event: ShapeEvent) => void;
  onMouseLeave?: (event: ShapeEvent) => void;
  onRemove?: (event: ShapeEvent) => void;
}

export declare interface ShapeCheckOnParams {
  key: string;
  type: ShapeElementType;
  dataSource: ShapeDataSourceItem | ShapeDataSourceItem[];
  eventCoordinate: Coordinate;
}

export declare interface ShapeCreateDataSourceParams {
  step: number;
  mode: ShapeMode;
  points: Point[];
  coordinates: Coordinate[];
  viewport: Viewport;
  precision: Precision;
  styles: any;
  xAxis: any;
  yAxis: any;
}

export declare interface ShapeEventPressMoveParams {
  mode: ShapeMode;
  points: Point[];
  pressPointIndex: number;
  pressPoint: Point;
  xAxis: any;
  yAxis: any;
}

export declare interface ShapeEventMoveDrawingParams {
  step: number;
  mode: ShapeMode;
  points: Point[];
  movePoint: Point;
  xAxis: any;
  yAxis: any;
}

export declare interface ShapeDrawExtendParams {
  ctx: CanvasRenderingContext2D;
  dataSource: ShapeDataSource[];
  styles: any;
  viewport: Viewport;
  precision: Precision;
  mode: ShapeMode;
  xAxis: any;
  yAxis: any;
}

export declare interface ShapeTemplate {
  name: string;
  totalStep: number;
  checkEventCoordinateOnShape: (params: ShapeCheckOnParams) => boolean;
  createShapeDataSource: (params: ShapeCreateDataSourceParams) => ShapeDataSource[];
  performEventPressedMove?: (params: ShapeEventPressMoveParams) => void;
  performEventMoveForDrawing?: (params: ShapeEventMoveDrawingParams) => void;
  drawExtend?: (params: ShapeDrawExtendParams) => void;
}
