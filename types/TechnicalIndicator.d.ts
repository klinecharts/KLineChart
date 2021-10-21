import { Viewport, KLineData } from './Common';

export declare type TechnicalIndicatorSeries = 'price' | 'volume' | 'normal';

export declare type TechnicalIndicatorPlotType = 'circle' | 'bar' | 'line';

export declare interface TechnicalIndicatorPlotCallbackDataItem {
  kLineData?: KLineData;
  technicalIndicatorData?: any;
}

export declare interface TechnicalIndicatorPlotCallbackData {
  prev?: TechnicalIndicatorPlotCallbackDataItem;
  current?: TechnicalIndicatorPlotCallbackDataItem;
  next?: TechnicalIndicatorPlotCallbackDataItem;
}

export declare interface TechnicalIndicatorPlot {
  key: string;
  title?: string;
  type?: TechnicalIndicatorPlotType;
  baseValue?: number;
  color?: (data: TechnicalIndicatorPlotCallbackData, options: any) => string;
  isStroke?: (data: TechnicalIndicatorPlotCallbackData) => boolean;
}

export declare interface TechnicalIndicator {
  name: string;
  calcParams?: any[];
  precision?: number;
  shouldOhlc?: boolean;
  shouldFormatBigNumber?: boolean;
  styles?: any;
}

export declare interface TechnicalIndicatorRenderDataSource {
  from?: number;
  to?: number;
  kLineDataList?: KLineData[];
  technicalIndicatorDataList?: any[];
}

export declare interface TechnicalIndicatorRenderParams {
  ctx: CanvasRenderingContext2D;
  dataSource: TechnicalIndicatorRenderDataSource;
  viewport: Viewport;
  styles: any;
  xAxis: any;
  yAxis: any;
}

export declare interface TechnicalIndicatorTemplate extends TechnicalIndicator {
  calcTechnicalIndicator: (kLineDataList: KLineData[], options?: any) => any[];
  series?: TechnicalIndicatorSeries;
  plots?: TechnicalIndicatorPlot[];
  shouldCheckParamCount?: boolean;
  minValue?: number;
  maxValue?: number;
  regeneratePlots?: (params?: number[]) => TechnicalIndicatorPlot[];
  render?: (params: TechnicalIndicatorRenderParams) => void;
}
