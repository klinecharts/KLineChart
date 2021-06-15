import { CoordinatePoint, KLineData, TimestampPricePoint } from './Common';

import { OverrideTechnicalIndicator, TechnicalIndicator } from './TechnicalIndicator';
import { CreateGraphicMarkOptions, OverrideGraphicMarkOptions, GraphicMark } from './GraphicMark';
import { Annotation } from './Annotation';
import { Tag } from './Tag';

import { PaneOptions } from './Pane';

export declare type ChartActionType = 'drawCandle' | 'drawTechnicalIndicator' | 'zoom' | 'scroll' | 'crosshair' | 'pane_drag';

export declare interface ConvertValue {
  xAxisValue?: number;
  yAxisValue?: number;
}

export declare interface ConvertFinder {
  paneId?: string;
  dataIndexXAxis?: boolean;
  absoluteYAxis?: boolean;
}

export declare type PictureType = 'png' | 'jpeg' | 'bmp';

export declare interface Chart {
  getWidth(): any;
  getHeight(): any;
  setStyleOptions(options: any): void;
  getStyleOptions(): any;
  setPriceVolumePrecision(pricePrecision: number, volumePrecision: number): void;
  setTimezone(timezone: string): void;
  getTimezone(): string;
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
  createTechnicalIndicator(name: string, isStack?: boolean, options?: PaneOptions): string | null;
  addCustomTechnicalIndicator(technicalIndicator: TechnicalIndicator | TechnicalIndicator[]): void;
  overrideTechnicalIndicator(override: OverrideTechnicalIndicator): void;
  getTechnicalIndicatorByName(name?: string): any;
  getTechnicalIndicatorByPaneId(paneId?: string): any;
  removeTechnicalIndicator(paneId: string, name?: string): void;
  createGraphicMark(name: string, options?: CreateGraphicMarkOptions): string | null;
  getGraphicMark(graphicMarkId?: string): any;
  setGraphicMarkOptions(id: string, options: OverrideGraphicMarkOptions): void;
  addCustomGraphicMark(graphicMark: GraphicMark | GraphicMark[]): void;
  removeGraphicMark(graphicMarkId?: string): void;
  createAnnotation(annotation: Annotation | Annotation[]): void;
  removeAnnotation(point?: TimestampPricePoint | TimestampPricePoint[]): void;
  createTag(tag: Tag | Tag[]): void;
  removeTag(id?: string): void;
  scrollByDistance(distance: number, animationDuration?: number): void;
  scrollToRealTime(animationDuration?: number): void;
  scrollToPosition(position: number, animationDuration?: number): void;
  zoomAtCoordinate(scale: number, coordinate?: CoordinatePoint, animationDuration?: number): void;
  zoomAtPosition(scale: number, position: number, animationDuration?: number): void;
  setPaneOptions(options: PaneOptions): void;
  convertFromPixel(coordinate: CoordinatePoint | CoordinatePoint[], finder: ConvertFinder): ConvertValue | ConvertValue[];
  convertToPixel(value: ConvertValue | ConvertValue[], finder: ConvertFinder): CoordinatePoint | CoordinatePoint[];
  subscribeAction(type: ChartActionType, callback: (params: any) => void): void;
  unsubscribeAction(type: ChartActionType, callback?: (params: any) => void): void;
  getConvertPictureUrl(includeTooltip?: boolean, includeGraphicMark?: boolean, type?: PictureType, backgroundColor?: string): string;
  resize(): void;
}
