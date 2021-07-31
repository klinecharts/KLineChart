import { Precision, Viewport, Coordinate, Point, OverlayEvent } from './Common';

export declare type GraphicMarkMode = 'normal' | 'weak_magnet' | 'strong_magnet';

export declare type GraphicMarkDataSourceDrawType = 'line' | 'text' | 'continuous_line' | 'polygon' | 'arc';

export declare interface GraphicMarkDataSourceItem extends Coordinate {
  radius?: number;
  startAngle?: number;
  endAngle?: number;
  text?: string;
}

export declare interface GraphicMarkDataSource {
  key?: string;
  type: GraphicMarkDataSourceDrawType;
  isDraw?: boolean;
  isCheck?: boolean;
  styles?: any;
  dataSource: GraphicMarkDataSourceItem[] | GraphicMarkDataSourceItem[][];
}

export declare interface GraphicMarkEvent extends OverlayEvent {
  step?: number;
}

export declare interface OverrideGraphicMark {
  id?: string;
  styles?: any;
  lock?: boolean;
  mode?: GraphicMarkMode;
}

export declare interface GraphicMark extends OverrideGraphicMark {
  name: string;
  points?: Point[];
  onDrawStart?: (event: GraphicMarkEvent) => void;
  onDrawing?: (event: GraphicMarkEvent) => void;
  onDrawEnd?: (event: GraphicMarkEvent) => void;
  onClick?: (event: GraphicMarkEvent) => void;
  onRightClick?: (event: GraphicMarkEvent) => boolean;
  onPressedMove?: (event: GraphicMarkEvent) => void;
  onMouseEnter?: (event: GraphicMarkEvent) => void;
  onMouseLeave?: (event: GraphicMarkEvent) => void;
  onRemove?: (event: GraphicMarkEvent) => void;
}

export declare interface GraphicMarkCheckOnParams {
  key: string;
  type: GraphicMarkDataSourceDrawType;
  dataSource: GraphicMarkDataSourceItem | GraphicMarkDataSourceItem[];
  eventCoordinate: Coordinate;
}

export declare interface GraphicMarkCreateDataSourceParams {
  step: number;
  mode: GraphicMarkMode;
  points: Point[];
  coordinates: Coordinate[];
  viewport: Viewport;
  precision: Precision;
  styles: any;
  xAxis: any;
  yAxis: any;
}

export declare interface GraphicMarkEventPressMoveParams {
  mode: GraphicMarkMode;
  points: Point[];
  pressPointIndex: number;
  pressPoint: Point;
  xAxis: any;
  yAxis: any;
}

export declare interface GraphicMarkEventMoveDrawingParams {
  step: number;
  mode: GraphicMarkMode;
  points: Point[];
  movePoint: Point;
  xAxis: any;
  yAxis: any;
}

export declare interface GraphicMarkDrawExtendParams {
  ctx: CanvasRenderingContext2D;
  dataSource: GraphicMarkDataSource[];
  styles: any;
  viewport: Viewport;
  precision: Precision;
  mode: GraphicMarkMode;
  xAxis: any;
  yAxis: any;
}

export declare interface GraphicMarkTemplate {
  name: string;
  totalStep: number;
  checkEventCoordinateOnGraphic: (params: GraphicMarkCheckOnParams) => boolean;
  createGraphicDataSource: (params: GraphicMarkCreateDataSourceParams) => GraphicMarkDataSource[];
  performEventPressedMove?: (params: GraphicMarkEventPressMoveParams) => void;
  performEventMoveForDrawing?: (params: GraphicMarkEventMoveDrawingParams) => void;
  drawExtend?: (params: GraphicMarkDrawExtendParams) => void;
}
