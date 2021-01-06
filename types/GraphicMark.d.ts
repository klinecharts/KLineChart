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

export declare interface GraphicMarkDataSourceItem extends XYPoint {
  text?: string;
}

export declare interface GraphicMarkDataSource {
  type: 'line',
  isDraw?: true,
  isCheck?: true,
  dataSource: GraphicMarkDataSourceItem[] | GraphicMarkDataSourceItem[][]
}

export declare interface GraphicMark {
  name: string;
  totalStep: number;
  checkMousePointOn: (points: GraphicMarkDataSourceItem | GraphicMarkDataSourceItem[], mousePoint: XYPoint) => boolean;
  createGraphicDataSource: (tpPoints: TimestampPricePoint[], xyPoints: XYPoint[], viewport: GraphicMarkViewport, precision: PriceVolumePrecision, xAxis: any, yAxis: any) => GraphicMarkDataSource[];
  performMousePressedMove?: (tpPoints: TimestampPricePoint[], pressedPointIndex: number, data: TimestampPricePoint) => void;
  performMouseMoveForDrawing?: (step: number, tpPoints: TimestampPricePoint[], data: TimestampPricePoint) => void;
  drawExtend?: (ctx: CanvasRenderingContext2D, graphicMarkDataSources: GraphicMarkDataSource[], markOptions: any, viewport: GraphicMarkViewport ,precision: PriceVolumePrecision, xAxis: any, yAxis: any) => void;
}
