import {Precision, Viewport, CoordinatePoint, TimestampPricePoint, OverlayEvent} from './Common';

export declare type GraphicMarkDataSourceDrawType = 'line' | 'text' | 'continuous_line' | 'polygon' | 'arc';

export declare type GraphicMarkDataSourceDrawStyle = 'stroke' | 'fill' | 'dash' | 'solid';

export declare interface GraphicMarkDataSourceItem extends CoordinatePoint {
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

export declare interface OverrideGraphicMarkOptions {
  styles?: any;
  lock?: boolean;
}

export declare interface CreateGraphicMarkOptions extends OverrideGraphicMarkOptions {
  id?: string;
  points?: TimestampPricePoint[];
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

export declare interface GraphicMark {
  name: string;
  totalStep: number;
  checkMousePointOn: (key: string, type: GraphicMarkDataSourceDrawType, points: GraphicMarkDataSourceItem | GraphicMarkDataSourceItem[], mousePoint: CoordinatePoint) => boolean;
  createGraphicDataSource: (step: number, tpPoints: TimestampPricePoint[], coordinatePoints: CoordinatePoint[], viewport: Viewport, precision: Precision, xAxis: any, yAxis: any) => GraphicMarkDataSource[];
  performMousePressedMove?: (tpPoints: TimestampPricePoint[], pressedPointIndex: number, data: TimestampPricePoint, xAxis: any, yAxis: any) => void;
  performMouseMoveForDrawing?: (step: number, tpPoints: TimestampPricePoint[], data: TimestampPricePoint, xAxis: any, yAxis: any) => void;
  drawExtend?: (ctx: CanvasRenderingContext2D, graphicMarkDataSources: GraphicMarkDataSource[], markOptions: any, viewport: Viewport ,precision: Precision, xAxis: any, yAxis: any) => void;
}
