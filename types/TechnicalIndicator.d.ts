import { KLineData } from './KLineData'

export type TechnicalIndicatorSeries = 'price' | 'volume' | 'normal'

export type TechnicalIndicatorPlotType = 'circle' | 'bar' | 'line';

export interface TechnicalIndicatorPlotCallbackDataItem {
  kLineData?: KLineData;
  technicalIndicatorData?: any;
}

export interface TechnicalIndicatorPlotCallbackData {
  preData: TechnicalIndicatorPlotCallbackDataItem;
  currentData: TechnicalIndicatorPlotCallbackDataItem;
  nextData: TechnicalIndicatorPlotCallbackDataItem;
}

export interface TechnicalIndicatorPlot {
  key: string;
  title?: string;
  type?: TechnicalIndicatorPlotType;
  color?: (data: TechnicalIndicatorPlotCallbackData, options?: any) => string;
  isStroke?: (data: TechnicalIndicatorPlotCallbackData) => boolean;
}

export declare interface OverrideTechnicalIndicator {
  name: string;
  calcParams?: number[];
  precision?: number;
  styles?: any;
}

export interface TechnicalIndicatorRenderDataSource {
  from: number;
  to: number;
  kLineDataList: KLineData[];
  technicalIndicatorDataList: any[];
}

export interface TechnicalIndicatorRenderViewport {
  width: number;
  height: number;
  dataSpace: number;
  barSpace: number;
}

export declare interface TechnicalIndicator extends OverrideTechnicalIndicator {
  calcTechnicalIndicator: (kLineDataList: KLineData[], calcParams: number[], plots: TechnicalIndicatorPlot[]) => any[];
  series?: TechnicalIndicatorSeries;
  plots?: TechnicalIndicatorPlot[];
  shouldCheckParamCount?: boolean;
  shouldOhlc?: boolean;
  shouldFormatBigNumber?: boolean,
  baseValue?: number;
  minValue?: number;
  maxValue?: number;
  regeneratePlots?: (calcParams: number[]) => TechnicalIndicatorPlot[];
  render?: (
    ctx: CanvasRenderingContext2D,
    dataSource: TechnicalIndicatorRenderDataSource,
    viewport: TechnicalIndicatorRenderViewport,
    styleOptions: any,
    xAxisConvert: any,
    yAxisConvert: any,
    isCandleTechnicalIndicator: boolean
  ) => void
}
