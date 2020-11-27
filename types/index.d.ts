export declare type GraphicMarkType = 'none' | 'horizontalStraightLine' | 'verticalStraightLine' | 'straightLine' | 'horizontalRayLine' | 'verticalRayLine' | 'rayLine' | 'horizontalSegmentLine' | 'verticalSegmentLine' | 'segmentLine' | 'priceLine' | 'priceChannelLine' | 'parallelStraightLine' | 'fibonacciLine';
export declare type PaneType = 'technicalIndicator'

export declare interface PaneOptions {
  technicalIndicatorType?: string;
  height?: number;
  dragEnabled?: boolean;
}

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

export declare type PlotType = 'circle' | 'bar' | 'line';

export declare interface TechnicalIndicatorInfoPlot {
  key: string;
  type?: PlotType;
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
    isCandleTechnicalIndicator: boolean
  ) => void
}

export declare type DrawActionType = 'drawCandle' | 'drawTechnicalIndicator'

export declare interface DrawActionCallbackParams {
  ctx: CanvasRenderingContext2D;
  kLineData: KLineData;
  dataIndex: number;
  technicalIndicatorData?: any
  technicalIndicatorType?: string
  coordinate: any;
  barSpace: number;
  halfBarSpace: number;
  isCandle: boolean;
}

export declare interface Chart {
  setStyleOptions(options: any): void;
  getStyleOptions(): any;
  setTechnicalIndicatorParams(technicalIndicatorType: string, params: number[]): void;
  getTechnicalIndicatorParams(technicalIndicatorType?: string): any;
  setPriceVolumePrecision(pricePrecision: number, volumePrecision: number): void;
  setTechnicalIndicatorPrecision(precision: number, technicalIndicatorType?: string): void;
  setTimezone(timezone: string): void;
  getTimezone(): string;
  resize(): void;
  setZoomEnabled(enabled: boolean): void;
  isZoomEnabled(): boolean;
  setScrollEnabled(enabled: boolean): void;
  isScrollEnabled(): boolean;
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
  setTechnicalIndicatorType(technicalIndicatorType: string, isOverride?: boolean, tag?: string): void;
  createPane(type?: PaneType, options?: PaneOptions): string | null;
  addCustomTechnicalIndicator(technicalIndicatorInfo: TechnicalIndicatorInfo)
  removeTechnicalIndicator(technicalIndicatorType?: string, tag?: string): void;
  addGraphicMark(graphicMarkType: GraphicMarkType): void;
  removeAllGraphicMark(): void;
  subscribeDrawAction (type: DrawActionType, callback: (params: DrawActionCallbackParams) => void): void;
  unsubscribeDrawAction (type: DrawActionType, callback: (params: DrawActionCallbackParams) => void): void;
  getConvertPictureUrl(includeFloatLayer?: boolean, includeGraphicMark?: boolean, type?: PictureType, backgroundColor?: string): string;
}

export declare function version(): string;

export declare function init(ds: HTMLDivElement | string, style?: any): Chart|null;

export declare function dispose(dcs: HTMLDivElement | Chart | string): void;
