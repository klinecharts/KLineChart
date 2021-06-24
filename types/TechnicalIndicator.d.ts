import { Viewport, KLineData } from './Common';

export declare type TechnicalIndicatorPlotType = 'circle' | 'bar' | 'line';

export declare interface TechnicalIndicatorPlotCallbackDataItem {
  kLineData?: KLineData;
  technicalIndicatorData?: any;
}

export declare interface TechnicalIndicatorPlotCallbackData {
  preData?: TechnicalIndicatorPlotCallbackDataItem;
  currentData?: TechnicalIndicatorPlotCallbackDataItem;
  nextData?: TechnicalIndicatorPlotCallbackDataItem;
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
  styles?: any;
}

export declare interface TechnicalIndicatorRenderDataSource {
  from?: number;
  to?: number;
  kLineDataList?: KLineData[];
  technicalIndicatorDataList?: any[];
}

export declare interface CustomTechnicalIndicator extends TechnicalIndicator {
  calcTechnicalIndicator: (kLineDataList: KLineData[], options?: any) => any[];
  plots?: TechnicalIndicatorPlot[];
  shouldCheckParamCount?: boolean;
  shouldOhlc?: boolean;
  shouldFormatBigNumber?: boolean;
  minValue?: number;
  maxValue?: number;
  regeneratePlots?: (params?: number[]) => TechnicalIndicatorPlot[];
  render?: (
    ctx: CanvasRenderingContext2D,
    dataSource: TechnicalIndicatorRenderDataSource,
    viewport: Viewport,
    styleOptions: any,
    xAxis: any,
    yAxis: any
  ) => void;
}
