import { Precision, Viewport, Coordinate, Point, OverlayEvent } from './Common';

export declare type GraphicMarkDataSourceDrawType = 'line' | 'text' | 'continuous_line' | 'polygon' | 'arc';

export declare type GraphicMarkDataSourceDrawStyle = 'stroke' | 'fill' | 'dash' | 'solid';

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
  style?: GraphicMarkDataSourceDrawStyle;
  dataSource: GraphicMarkDataSourceItem[] | GraphicMarkDataSourceItem[][];
}

export declare interface GraphicMarkEvent extends OverlayEvent {
  step?: number;
}

export declare interface OverrideGraphicMark {
  id?: string;
  styles?: any;
  lock?: boolean;
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

export declare interface CustomGraphicMark {
  name: string;
  totalStep: number;
  checkMousePointOn: (key: string, type: GraphicMarkDataSourceDrawType, points: GraphicMarkDataSourceItem | GraphicMarkDataSourceItem[], mouseCoordinate: Coordinate) => boolean;
  createGraphicDataSource: (step: number, points: Point[], coordinates: Coordinate[], viewport: Viewport, precision: Precision, xAxis: any, yAxis: any) => GraphicMarkDataSource[];
  performMousePressedMove?: (points: Point[], pressedPointIndex: number, point: Point, xAxis: any, yAxis: any) => void;
  performMouseMoveForDrawing?: (step: number, points: Point[], point: Point, xAxis: any, yAxis: any) => void;
  drawExtend?: (ctx: CanvasRenderingContext2D, graphicMarkDataSources: GraphicMarkDataSource[], markOptions: any, viewport: Viewport ,precision: Precision, xAxis: any, yAxis: any) => void;
}
