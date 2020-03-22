export type TechnicalIndicatorType = 'NO' | 'MA' | 'VOL' | 'MACD' | 'BOLL' | 'KDJ' | 'RSI' | 'BIAS' | 'BRAR' | 'CCI' | 'DMI' | 'CR' | 'PSY' | 'DMA' | 'TRIX' | 'OBV' | 'VR' | 'WR' | 'MTM' | 'EMV' | 'SAR';
export type GraphicMarkType = 'none' | 'horizontalStraightLine' | 'verticalStraightLine' | 'straightLine' | 'horizontalRayLine' | 'verticalRayLine' | 'rayLine' | 'horizontalSegmentLine' | 'verticalSegmentLine' | 'segmentLine' | 'priceLine' | 'priceChannelLine' | 'parallelStraightLine' | 'fibonacciLine';
export type ChartType = 'candle_stick' | 'real_time';
export interface TechnicalIndicatorParams {
  MA: number[];
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

export interface KLineData {
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
  timestamp: number;
  turnover?: number;
}

export type PictureType = 'png' | 'jpeg' | 'bmp';

export type ChartComponentType = 'candle' | 'vol' | 'subIndicator' | 'tooltip' | 'graphicMark';

export interface Chart {
  setStyleOptions(options: any): void;
  getStyleOptions(): any;
  setTechnicalIndicatorParams(technicalIndicatorType: TechnicalIndicatorType, params: number[]): void;
  getTechnicalIndicatorParamOptions(): TechnicalIndicatorParams;
  setPrecision(pricePrecision: number, volumePrecision: number): void;
  resize(): void;
  setOffsetRightSpace(space: number): void;
  setDataSpace(space: number): void;
  clearData(): void;
  getDataList(): KLineData[];
  applyNewData(dataList: KLineData[], more: boolean): void;
  applyMoreData(dataList: KLineData[], more: boolean): void;
  updateData(data: KLineData): void
  loadMore(cb: (timestamp: number) => {}): void;
  setCandleStickChartType(chartType: ChartType): void;
  setCandleStickTechnicalIndicatorType(technicalIndicatorType: TechnicalIndicatorType): void;
  setTechnicalIndicatorType(tag: string, technicalIndicatorType: TechnicalIndicatorType): void;
  addTechnicalIndicator(technicalIndicatorType: TechnicalIndicatorType, height: number): void;
  removeTechnicalIndicator(tag: string): void;
  addGraphicMark(graphicMarkType: GraphicMarkType): void;
  removeAllGraphicMark(): void;
}

export function version(): string;

export function init(dom: HTMLDivElement, style?: any): Chart;

export function dispose(dc: HTMLDivElement | Chart): void;
