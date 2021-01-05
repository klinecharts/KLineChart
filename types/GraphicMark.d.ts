export declare interface GraphicMarkViewport {
  width: number;
  height: number;
}

export declare interface XYPoint {
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

export interface GraphicMarkOptionDataSourceItem extends XYPoint {
  text?: string;
}

export interface GraphicMarkOption {
  type: 'line',
  isDraw?: true,
  isCheck?: true,
  dataSource: GraphicMarkOptionDataSourceItem[] | GraphicMarkOptionDataSourceItem[][]
}

export declare interface GraphicMark {
  name: string;
  totalStep: number;
  checkMousePointOn: (points: XYPoint | XYPoint[], mousePoint: XYPoint) => boolean;
  createGraphicOptions: (tpPoints: TimestampPricePoint[], xyPoints: XYPoint[], viewport: GraphicMarkViewport, precision: PriceVolumePrecision, xAxis: any, yAxis: any) => GraphicMarkOption[];
  performMousePressedMove?: (tpPoints: TimestampPricePoint[], pressedPointIndex: number, data: TimestampPricePoint) => void;
  performMouseMoveForDrawing?: (step: number, tpPoints: TimestampPricePoint[], data: TimestampPricePoint) => void;
  drawExtend?: (ctx: CanvasRenderingContext2D, graphicMarkOptions: GraphicMarkOption[], markOptions: any, viewport: GraphicMarkViewport ,precision: PriceVolumePrecision, xAxis: any, yAxis: any) => void;
}
