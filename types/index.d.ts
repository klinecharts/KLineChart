import { Chart, PictureType } from './Chart'
import { DrawActionType, DrawActionCallbackParams } from './DrawAction'
import {
  GraphicMarkSeries, GraphicMarkInfoViewport,
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

declare namespace klinecharts {
  export interface extension {
    addTechnicalIndicator: (technicalIndicators: TechnicalIndicator | TechnicalIndicator[]) => void;
    addGraphicMark: (graphicMarks: GraphicMark | GraphicMark[]) => void;
  }

  export function version(): string;

  export function init(ds: HTMLDivElement | string, style?: any): Chart | null;

  export function dispose(dcs: HTMLDivElement | Chart | string): void;

  export {
    Chart, PictureType,
    DrawActionType, DrawActionCallbackParams,
    GraphicMarkSeries, GraphicMarkInfoViewport,
    XYPoint, TimestampPricePoint,
    PriceVolumePrecision, GraphicMark,
    KLineData,
    PaneType, PaneOptions,
    TechnicalIndicatorSeries, TechnicalIndicatorPlotType,
    TechnicalIndicatorPlotCallbackDataItem, TechnicalIndicatorPlotCallbackData,
    TechnicalIndicatorPlot, OverrideTechnicalIndicator,
    TechnicalIndicatorRenderDataSource, TechnicalIndicatorRenderViewport,
    TechnicalIndicator
  }
}

export default klinecharts
