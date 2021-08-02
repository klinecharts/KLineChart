import { KLineData, Coordinate, Point } from './Common';

import { TechnicalIndicatorTemplate, TechnicalIndicator } from './TechnicalIndicator';
import { Shape, OverrideShape, ShapeTemplate } from './Shape';
import { Annotation } from './Annotation';
import { Tag } from './Tag';

import { PaneOptions } from './Pane';

export declare type ChartActionType = 'zoom' | 'scroll' | 'crosshair' | 'pane_drag';

export declare interface ConvertFinder {
  paneId?: string;
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
  createTechnicalIndicator(value: string | TechnicalIndicator, isStack?: boolean, options?: PaneOptions): string | null;
  addTechnicalIndicatorTemplate(template: TechnicalIndicatorTemplate | TechnicalIndicatorTemplate[]): void;
  overrideTechnicalIndicator(tech: TechnicalIndicator, paneId?: string): void;
  getTechnicalIndicatorTemplate(name?: string): any;
  getTechnicalIndicatorByPaneId(paneId?: string, name?: string): any;
  removeTechnicalIndicator(paneId: string, name?: string): void;
  createShape(value: string | Shape): string | null;
  getShape(shapeId?: string): any;
  setShapeOptions(options: OverrideShape): void;
  addShapeTemplate(template: ShapeTemplate | ShapeTemplate[]): void;
  removeShape(shapeId?: string): void;
  createAnnotation(annotation: Annotation | Annotation[], paneId?: string): void;
  removeAnnotation(paneId?: string, point?: Point | Point[]): void;
  createTag(tag: Tag | Tag[], paneId?: string): void;
  removeTag(paneId?: string, tagId?: string | string[]): void;
  scrollByDistance(distance: number, animationDuration?: number): void;
  scrollToRealTime(animationDuration?: number): void;
  scrollToDataIndex(dataIndex: number, animationDuration?: number): void;
  zoomAtCoordinate(scale: number, coordinate?: Coordinate, animationDuration?: number): void;
  zoomAtDataIndex(scale: number, dataIndex: number, animationDuration?: number): void;
  setPaneOptions(options: PaneOptions): void;
  convertFromPixel(coordinate: Coordinate | Coordinate[], finder: ConvertFinder): Point | Point[];
  convertToPixel(point: Point | Point[], finder: ConvertFinder): Coordinate | Coordinate[];
  subscribeAction(type: ChartActionType, callback: (params: any) => void): void;
  unsubscribeAction(type: ChartActionType, callback?: (params: any) => void): void;
  getConvertPictureUrl(includeOverlay?: boolean, type?: PictureType, backgroundColor?: string): string;
  resize(): void;
}
