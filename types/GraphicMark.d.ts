export declare interface GraphicMarkViewport {
  width: number;
  height: number;
}

export declare interface CoordinatePoint {
  x: number;
  y: number;
}

export declare interface TimestampPricePoint {
  timestamp?: number;
  dataIndex?: number;
  price?: number;
}

export declare interface PriceVolumePrecision {
  price: number;
  volume: number;
}

export declare type GraphicMarkDataSourceDrawType = 'line' | 'text' | 'continuous_line' | 'polygon' | 'arc';

export declare type GraphicMarkDataSourceDrawStyle = 'stroke' | 'fill';

export declare interface GraphicMarkDataSourceItem extends CoordinatePoint {
  radius?: number;
  startAngle?: number;
  endAngle?: number;
  text?: string;
}

export declare interface GraphicMarkDataSource {
  type: GraphicMarkDataSourceDrawType;
  isDraw?: boolean;
  isCheck?: boolean;
  style?: GraphicMarkDataSourceDrawStyle;
  dataSource: GraphicMarkDataSourceItem[] | GraphicMarkDataSourceItem[][];
}

export declare interface CreateGraphicMarkOptions {
  points?: TimestampPricePoint[];
  onClick?: (id: string, event: any) => void;
  onRightClick?: (id: string, event: any) => boolean;
  onPressedMove?: (id: string, event: any) => void;
}

export declare interface GraphicMark {
  name: string;
  totalStep: number;
  checkMousePointOn: (type: GraphicMarkDataSourceDrawType, points: GraphicMarkDataSourceItem | GraphicMarkDataSourceItem[], mousePoint: CoordinatePoint) => boolean;
  createGraphicDataSource: (step: number, tpPoints: TimestampPricePoint[], coordinatePoints: CoordinatePoint[], viewport: GraphicMarkViewport, precision: PriceVolumePrecision, xAxis: any, yAxis: any) => GraphicMarkDataSource[];
  performMousePressedMove?: (tpPoints: TimestampPricePoint[], pressedPointIndex: number, data: TimestampPricePoint) => void;
  performMouseMoveForDrawing?: (step: number, tpPoints: TimestampPricePoint[], data: TimestampPricePoint) => void;
  drawExtend?: (ctx: CanvasRenderingContext2D, graphicMarkDataSources: GraphicMarkDataSource[], markOptions: any, viewport: GraphicMarkViewport ,precision: PriceVolumePrecision, xAxis: any, yAxis: any) => void;
}
