import { Chart, PictureType } from './Chart'
import { DrawActionType, DrawActionCallbackParams } from './DrawAction'
import {
  GraphicMarkViewport,
  XYPoint, TimestampPricePoint,
  PriceVolumePrecision, GraphicMark
} from './GraphicMark'
import { KLineData } from './KLineData'
import { PaneType, PaneOptions } from './Pane'
import {
  TechnicalIndicatorSeries, TechnicalIndicatorPlotType,
  TechnicalIndicatorPlotCallbackDataItem, TechnicalIndicatorPlotCallbackData,
  TechnicalIndicatorPlot, OverrideTechnicalIndicator,
  TechnicalIndicatorRenderDataSource, TechnicalIndicatorRenderViewport,
  TechnicalIndicator
} from './TechnicalIndicator'

export declare interface extension {
  addTechnicalIndicator: (technicalIndicators: TechnicalIndicator | TechnicalIndicator[]) => void;
  addGraphicMark: (graphicMarks: GraphicMark | GraphicMark[]) => void;
}

export declare function version(): string;

export declare function init(ds: HTMLDivElement | string, style?: any): Chart | null;

export declare function dispose(dcs: HTMLDivElement | Chart | string): void;

export {
  Chart, PictureType,
  DrawActionType, DrawActionCallbackParams,
  GraphicMarkViewport, XYPoint, TimestampPricePoint,
  PriceVolumePrecision, GraphicMark,
  KLineData,
  PaneType, PaneOptions,
  TechnicalIndicatorSeries, TechnicalIndicatorPlotType,
  TechnicalIndicatorPlotCallbackDataItem, TechnicalIndicatorPlotCallbackData,
  TechnicalIndicatorPlot, OverrideTechnicalIndicator,
  TechnicalIndicatorRenderDataSource, TechnicalIndicatorRenderViewport,
  TechnicalIndicator
}
