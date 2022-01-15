import { extension } from './Extension';

import {
  KLineData, Precision, Viewport, Crosshair, OverlayEvent,
  Coordinate, Point, DataSource
} from './Common';

import { Chart, PictureType, ChartActionType } from './Chart';

import {
  ShapeMode, ShapeElementType,
  ShapeDataSource, ShapeDataSourceItem,
  OverrideShape, Shape, ShapeTemplate,
  ShapeCheckOnParams, ShapeCreateDataSourceParams,
  ShapeEventPressMoveParams, ShapeEventMoveDrawingParams,
  ShapeDrawExtendParams
} from './Shape';

import {
  AnnotationCheckParams,
  AnnotationDrawParams,
  Annotation
} from './Annotation';

import { Tag } from './Tag';

import { PaneOptions } from './Pane';

import {
  TechnicalIndicatorPlotType,
  TechnicalIndicatorPlotCallbackDataItem, TechnicalIndicatorPlotCallbackData,
  TechnicalIndicatorPlot, TechnicalIndicatorRenderDataSource,
  TechnicalIndicator, TechnicalIndicatorRenderParams, TechnicalIndicatorTemplate,
  TechnicalIndicatorCreateTooltipParams, TechnicalIndicatorTooltipDataItem
} from './TechnicalIndicator';

export declare function version(): string;

export declare function init(ds: HTMLDivElement | string, style?: any): Chart | null;

export declare function dispose(dcs: HTMLDivElement | Chart | string): void;

export {
  extension,
  Chart, PictureType, ChartActionType, KLineData, DataSource,
  Precision, Viewport, Crosshair, OverlayEvent, PaneOptions,
  Coordinate, Point,
  ShapeMode, ShapeElementType,
  ShapeDataSource, ShapeDataSourceItem,
  OverrideShape, Shape, ShapeTemplate,
  ShapeCheckOnParams, ShapeCreateDataSourceParams,
  ShapeEventPressMoveParams, ShapeEventMoveDrawingParams,
  ShapeDrawExtendParams,
  AnnotationCheckParams, AnnotationDrawParams, Annotation,
  Tag,
  TechnicalIndicatorPlotType,
  TechnicalIndicatorPlotCallbackDataItem, TechnicalIndicatorPlotCallbackData,
  TechnicalIndicatorPlot, TechnicalIndicatorRenderDataSource,
  TechnicalIndicator, TechnicalIndicatorRenderParams, TechnicalIndicatorTemplate,
  TechnicalIndicatorCreateTooltipParams, TechnicalIndicatorTooltipDataItem
}
