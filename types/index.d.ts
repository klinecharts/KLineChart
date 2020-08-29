export declare type GraphicMarkType = 'none' | 'horizontalStraightLine' | 'verticalStraightLine' | 'straightLine' | 'horizontalRayLine' | 'verticalRayLine' | 'rayLine' | 'horizontalSegmentLine' | 'verticalSegmentLine' | 'segmentLine' | 'priceLine' | 'priceChannelLine' | 'parallelStraightLine' | 'fibonacciLine';
export declare type ChartType = 'candle_stick' | 'real_time';

export declare interface KLineData {
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
  timestamp: number;
  turnover?: number;
}

export declare type PictureType = 'png' | 'jpeg' | 'bmp';

export declare interface TechnicalIndicatorInfoPlot {
  key: string;
  type?: 'circle' | 'bar' | 'line';
  color?: (data: any, options?: any) => string;
  isStroke?: (data: any) => boolean;
}

export declare interface TechnicalIndicatorCustomRenderDataSource {
  from: number;
  to: number;
  kLineDataList: KLineData[];
  technicalIndicatorDataList: any[];
}

export declare interface TechnicalIndicatorCustomRenderViewport {
  width: number;
  height: number;
  dataSpace: number;
  barSpace: number;
}

export declare interface Axis {
  convertFromPixel: (pixel: number) => number;
  convertToPixel: (value: number) => number;
}

export declare interface TechnicalIndicatorInfo {
  name: string;
  calcTechnicalIndicator: (kLineDataList: KLineData[], calcParams: number[], plots: TechnicalIndicatorInfoPlot[]) => any[];
  series?: 'price' | 'volume' | 'normal'
  calcParams?: number[];
  plots?: TechnicalIndicatorInfoPlot[];
  precision?: number;
  shouldCheckParamCount?: boolean;
  shouldOhlc?: boolean;
  shouldFormatBigNumber?: boolean,
  baseValue?: number;
  minValue?: number;
  maxValue?: number;
  regeneratePlots?: (calcParams: number[]) => TechnicalIndicatorInfoPlot[];
  render?: (
    ctx: CanvasRenderingContext2D,
    dataSource: TechnicalIndicatorCustomRenderDataSource,
    viewport: TechnicalIndicatorCustomRenderViewport,
    styleOptions: any, xAxis: Axis, yAxis: Axis,
    isCandleStickTechnicalIndicator: boolean
  ) => void
}

export declare type DrawActionType = 'drawCandle' | 'drawTechnicalIndicator'

export declare interface DrawActionCallbackParams {
  ctx: CanvasRenderingContext2D;
  kLineData: KLineData;
  technicalIndicatorData?: any
  technicalIndicatorType?: string
  coordinate: any;
  barSpace: number;
  halfBarSpace: number;
  isCandleStick: boolean;
}

export declare interface Chart {
  setStyleOptions(options: any): void;
  getStyleOptions(): any;
  setTechnicalIndicatorParams(technicalIndicatorType: string, params: number[]): void;
  getTechnicalIndicatorParams(technicalIndicatorType?: string): any;
  setPrecision(pricePrecision: number, volumePrecision: number): void;
  setTechnicalIndicatorPrecision(precision: number, technicalIndicatorType?: string): void;
  setTimezone(timezone: string): void;
  getTimezone(): string;
  resize(): void;
  setOffsetRightSpace(space: number): void;
  setLeftMinVisibleBarCount(barCount: number): void;
  setRightMinVisibleBarCount(barCount: number): void;
  setDataSpace(space: number): void;
  clearData(): void;
  getDataList(): KLineData[];
  applyNewData(dataList: KLineData[], more?: boolean): void;
  applyMoreData(dataList: KLineData[], more?: boolean): void;
  updateData(data: KLineData): void;
  loadMore(cb: (timestamp: number) => void): void;
  setCandleStickChartType(chartType: ChartType): void;
  setCandleStickTechnicalIndicatorType(technicalIndicatorType: string): void;
  setTechnicalIndicatorType(tag: string, technicalIndicatorType: string): void;
  createTechnicalIndicator(technicalIndicatorType: string, height?: number, dragEnabled?: boolean): string | null;
  addCustomTechnicalIndicator(technicalIndicatorInfo: TechnicalIndicatorInfo)
  removeTechnicalIndicator(tag: string): void;
  addGraphicMark(graphicMarkType: GraphicMarkType): void;
  removeAllGraphicMark(): void;
  subscribeDrawAction (type: DrawActionType, callback: (params: DrawActionCallbackParams) => void);
  unsubscribeDrawAction (type: DrawActionType, callback: (params: DrawActionCallbackParams) => void);
  getConvertPictureUrl(includeFloatLayer?: boolean, includeGraphicMark?: boolean, type?: PictureType, backgroundColor?: string): string;
}

export declare function version(): string;

export declare function init(ds: HTMLDivElement | string, style?: any): Chart|null;

export declare function dispose(dcs: HTMLDivElement | Chart | string): void;
