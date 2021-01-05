export type GraphicMarkSeries = 'onePointLine' | 'twoPointLine' | 'threePointLine'

export interface GraphicMarkInfoViewport {
  width: number;
  height: number;
}

export interface XYPoint {
  x: number;
  y: number;
}

export interface TimestampPricePoint {
  timestamp?: number;
  dataIndex?: number;
  price?: number;
}

export interface PriceVolumePrecision {
  price: number;
  volume: number;
}

export interface GraphicMark {
  name: string;
  series: GraphicMarkSeries;
  checkMousePointOnLine: (point1: XYPoint, point2: XYPoint, mousePoint: XYPoint) => boolean;
  generatedLines: (xyPoints: XYPoint[], viewport: GraphicMarkInfoViewport) => XYPoint[][];
  performMarkPoints?: (tpPoints: TimestampPricePoint[], pressedPointIndex: number, data: TimestampPricePoint) => void;
  onMouseMoveForDrawingExtend?: (tpPoints: TimestampPricePoint[], data: TimestampPricePoint) => void;
  drawExtend?: (ctx: CanvasRenderingContext2D, lines: XYPoint[][], markOptions: any, precision: PriceVolumePrecision, xAxis: any, yAxis: any) => void;
}
