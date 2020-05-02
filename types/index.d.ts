export declare type TechnicalIndicatorType = 'NO' | 'MA' | 'EMA' | 'VOL' | 'MACD' | 'BOLL' | 'KDJ' | 'RSI' | 'BIAS' | 'BRAR' | 'CCI' | 'DMI' | 'CR' | 'PSY' | 'DMA' | 'TRIX' | 'OBV' | 'VR' | 'WR' | 'MTM' | 'EMV' | 'SAR';
export declare type GraphicMarkType = 'none' | 'horizontalStraightLine' | 'verticalStraightLine' | 'straightLine' | 'horizontalRayLine' | 'verticalRayLine' | 'rayLine' | 'horizontalSegmentLine' | 'verticalSegmentLine' | 'segmentLine' | 'priceLine' | 'priceChannelLine' | 'parallelStraightLine' | 'fibonacciLine';
export declare type ChartType = 'candle_stick' | 'real_time';
export declare interface TechnicalIndicatorParams {
  MA: number[];
  EMA: number[];
  VOL: number[];
  MACD: number[];
  BOLL: number[];
  KDJ: number[];
  RSI: number[];
  BIAS: number[];
  BRAR: number[];
  CCI: number[];
  DMI: number[];
  CR: number[];
  PSY: number[];
  DMA: number[];
  TRIX: number[];
  OBV: number[];
  VR: number[];
  WR: number[];
  MTM: number[];
  EMV: number[];
  SAR: number[];
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

export declare interface Chart {
  setStyleOptions(options: any): void;
  getStyleOptions(): any;
  setTechnicalIndicatorParams(technicalIndicatorType: TechnicalIndicatorType, params: number[]): void;
  getTechnicalIndicatorParamOptions(): TechnicalIndicatorParams;
  setPrecision(pricePrecision: number, volumePrecision: number): void;
  setTimezone(timezone: string):void;
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
  setCandleStickTechnicalIndicatorType(technicalIndicatorType: TechnicalIndicatorType): void;
  setTechnicalIndicatorType(tag: string, technicalIndicatorType: TechnicalIndicatorType): void;
  addTechnicalIndicator(technicalIndicatorType?: TechnicalIndicatorType, height?: number, dragEnabled?: boolean): string;
  removeTechnicalIndicator(tag: string): void;
  addGraphicMark(graphicMarkType: GraphicMarkType): void;
  removeAllGraphicMark(): void;
  getConvertPictureUrl(includeFloatLayer?: boolean, includeGraphicMark?: boolean, type?: PictureType, backgroundColor?: string): string;
}

export declare function version(): string;

export declare function init(ds: HTMLDivElement | string, style?: any): Chart;

export declare function dispose(dcs: HTMLDivElement | Chart | string): void;
