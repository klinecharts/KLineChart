/// <reference path="lib/shape/shapeHelper.d.ts" />

declare module "klinecharts" {
  interface KLineData {
    timestamp: number;
    open: number;
    close: number;
    high: number;
    low: number;
    volume?: number;
    turnover?: number;
  }
  
  interface Precision {
    price: number;
    volume: number;
  }
  
  interface Viewport {
    width?: number;
    height?: number;
    dataSpace?: number;
    barSpace?: number;
  }
  
  interface DataSource {
    from?: number;
    to?: number;
    kLineDataList?: KLineData[];
    technicalIndicatorDataList?: any[];
  }
  
  interface Crosshair extends Coordinate {
    paneId?: string;
    dataIndex?: number;
  }

  export interface Coordinate {
    x?: number;
    y?: number;
  }
  
  interface Point {
    timestamp?: number;
    dataIndex?: number;
    value?: number;
  }
  
  interface OverlayEvent {
    id: number | string;
    points?: Point | Point[];
    event?: any;
  }

  type TechnicalIndicatorSeries = 'price' | 'volume' | 'normal';

  type TechnicalIndicatorPlotType = 'circle' | 'bar' | 'line';
  
  interface TechnicalIndicatorPlotCallbackDataItem {
    kLineData?: KLineData;
    technicalIndicatorData?: any;
  }
  
  interface TechnicalIndicatorPlotCallbackData {
    prev?: TechnicalIndicatorPlotCallbackDataItem;
    current?: TechnicalIndicatorPlotCallbackDataItem;
    next?: TechnicalIndicatorPlotCallbackDataItem;
  }
  
  interface TechnicalIndicatorPlot {
    key: string;
    title?: string;
    type?: TechnicalIndicatorPlotType;
    baseValue?: number;
    color?: (data: TechnicalIndicatorPlotCallbackData, options: any) => string;
    isStroke?: (data: TechnicalIndicatorPlotCallbackData) => boolean;
    isDashed?: (data: TechnicalIndicatorPlotCallbackData) => boolean;
  }
  
  interface TechnicalIndicator {
    name: string;
    shortName?: string;
    calcParams?: any[];
    precision?: number;
    shouldOhlc?: boolean;
    shouldFormatBigNumber?: boolean;
    styles?: any;
    extendData?: any;
  }
  
  interface TechnicalIndicatorRenderDataSource extends DataSource {}
  
  interface TechnicalIndicatorRenderParams {
    ctx: CanvasRenderingContext2D;
    dataSource: TechnicalIndicatorRenderDataSource;
    viewport: Viewport;
    styles: any;
    xAxis: any;
    yAxis: any;
  }
  
  interface TechnicalIndicatorCreateTooltipParams {
    dataSource: DataSource;
    viewport: Viewport;
    crosshair: Crosshair;
    technicalIndicator: TechnicalIndicatorTemplate;
    xAxis: any;
    yAxis: any;
    defaultStyles: any;
  }
  
  interface TechnicalIndicatorTooltipDataItem {
    title: string;
    value: any;
    color?: string;
  }
  
  interface TechnicalIndicatorTemplate extends TechnicalIndicator {
    calcTechnicalIndicator: (kLineDataList: KLineData[], options?: any) => any[] | Promise<any[]>;
    series?: TechnicalIndicatorSeries;
    plots?: TechnicalIndicatorPlot[];
    shouldCheckParamCount?: boolean;
    minValue?: number;
    maxValue?: number;
    regeneratePlots?: (params?: number[]) => TechnicalIndicatorPlot[];
    createToolTipDataSource?: (params: TechnicalIndicatorCreateTooltipParams) => TechnicalIndicatorTooltipDataItem[];
    render?: (params: TechnicalIndicatorRenderParams) => void;
  }

  type ShapeMode = 'normal' | 'weak_magnet' | 'strong_magnet';

  type ShapeElementType = 'line' | 'text' | 'continuous_line' | 'polygon' | 'arc';
  
  interface ShapeDataSourceItem extends Coordinate {
    radius?: number;
    startAngle?: number;
    endAngle?: number;
    text?: string;
  }
  
  interface ShapeDataSource {
    key?: string;
    type: ShapeElementType;
    isDraw?: boolean;
    isCheck?: boolean;
    styles?: any;
    dataSource: ShapeDataSourceItem[] | ShapeDataSourceItem[][];
  }
  
  interface ShapeEvent extends OverlayEvent {
    step?: number;
  }
  
  interface OverrideShape {
    id?: string;
    points?: Point[];
    styles?: any;
    lock?: boolean;
    mode?: ShapeMode;
    visible?: boolean;
    data?: any;

  }

  type ShapeEventOperateElement = 'other' | 'point' | 'none'

  type EventOperate = {
    id: string,
    element: ShapeEventOperateElement,
    elementIndex: number,
    instance: Shape
  }

  interface Shape extends OverrideShape {
    name: string;
    dataSource?: () => ShapeDataSourceItem[];
    eventOperate?: () => EventOperate;
    onDrawStart?: (event: ShapeEvent) => void;
    onDrawing?: (event: ShapeEvent) => void;
    onDrawEnd?: (event: ShapeEvent) => void;
    onClick?: (event: ShapeEvent) => void;
    onRightClick?: (event: ShapeEvent) => boolean;
    onPressedMove?: (event: ShapeEvent) => void;
    onMouseEnter?: (event: ShapeEvent) => void;
    onMouseLeave?: (event: ShapeEvent) => void;
    onRemove?: (event: ShapeEvent) => void;
  }
  
  interface ShapeCheckOnParams<T extends ShapeDataSourceItem | ShapeDataSourceItem[]> {
    key: string;
    type: ShapeElementType;
    dataSource: T;
    eventCoordinate: Coordinate;
  }
  
  interface ShapeCreateDataSourceParams {
    step: number;
    mode: ShapeMode;
    points: Point[];
    coordinates: Coordinate[];
    viewport: Viewport;
    precision: Precision;
    styles: any;
    xAxis: any;
    yAxis: any;
    data: any;
  }
  
  interface ShapeEventPressMoveParams {
    mode: ShapeMode;
    points: Point[];
    pressPointIndex: number;
    pressPoint: Point;
    xAxis: any;
    yAxis: any;
  }
  
  interface ShapeEventMoveDrawingParams {
    step: number;
    mode: ShapeMode;
    points: Point[];
    movePoint: Point;
    xAxis: any;
    yAxis: any;
  }
  
  interface ShapeDrawExtendParams {
    ctx: CanvasRenderingContext2D;
    dataSource: ShapeDataSource[];
    styles: any;
    viewport: Viewport;
    precision: Precision;
    mode: ShapeMode;
    xAxis: any;
    yAxis: any;
    data: any;
  }
  
  interface ShapeTemplate<T> {
    name: string;
    totalStep: number;
    checkEventCoordinateOnShape: (params: ShapeCheckOnParams<T>) => boolean;
    createShapeDataSource: (params: ShapeCreateDataSourceParams) => ShapeDataSource[];
    performEventPressedMove?: (params: ShapeEventPressMoveParams) => void;
    performEventMoveForDrawing?: (params: ShapeEventMoveDrawingParams) => void;
    drawExtend?: (params: ShapeDrawExtendParams) => void | boolean;
  }

  interface AnnotationCheckParams {
    eventCoordinate?: Coordinate;
    coordinate?: Coordinate;
    size?: number;
  }
  
  interface AnnotationDrawParams {
    ctx: CanvasRenderingContext2D;
    point?: Point;
    coordinate?: Coordinate;
    viewport?: Viewport;
    isActive?: boolean;
    styles?: any;
  }
  
  interface Annotation {
    point: Point;
    styles?: any;
    checkEventCoordinateOnCustomSymbol?: (params: AnnotationCheckParams) => void;
    drawCustomSymbol?: (params: AnnotationDrawParams) => void;
    drawExtend?: (params: AnnotationDrawParams) => void;
    onClick?: (event: OverlayEvent) => void;
    onRightClick?: (event: OverlayEvent) => void;
    onMouseEnter?: (event: OverlayEvent) => void;
    onMouseLeave?: (event: OverlayEvent) => void;
  }

  interface Tag {
    id: string;
    point: Point;
    text?: string | number;
    mark?: string;
    coordinate?: number;
    styles?: any;
  }

  interface PaneOptions {
    id?: string;
    height?: number;
    minHeight?: number;
    dragEnabled?: boolean;
  }

  type ChartActionType = 'zoom' | 'scroll' | 'crosshair' | 'tooltip' | 'pane_drag' | 'axis';

  interface DomFinder {
    paneId: string;
    position?: 'root' | 'content' | 'yAxis';
  }

  interface ConvertFinder {
    paneId?: string;
    absoluteYAxis?: boolean;
  }
  
  interface HTML {
    id?: string,
    position?: 'content' | 'yAxis';
    style?: any;
    content: string | HTMLElement;
  }
  
  type PictureType = 'png' | 'jpeg' | 'bmp';

  interface Chart {
    getDom(finder?: DomFinder): HTMLDivElement;
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
    getDataSpace(): number;
    getBarSpace(): number;
    clearData(): void;
    getDataList(): KLineData[];
    applyNewData(dataList: KLineData[], more?: boolean): void;
    applyMoreData(dataList: KLineData[], more?: boolean): void;
    updateData(data: KLineData): void;
    loadMore(cb: (timestamp: number) => void): void;
    addTechnicalIndicatorTemplate(template: TechnicalIndicatorTemplate): void;
    addTechnicalIndicatorTemplate(template: TechnicalIndicatorTemplate[]): void;
    createTechnicalIndicator(value: string, isStack?: boolean, options?: PaneOptions): string | null;
    createTechnicalIndicator(value: TechnicalIndicator, isStack?: boolean, options?: PaneOptions): string;
    overrideTechnicalIndicator(tech: TechnicalIndicator, paneId?: string): void;
    getTechnicalIndicatorTemplate(name?: string): any;
    getTechnicalIndicatorByPaneId(paneId?: string, name?: string): any;
    removeTechnicalIndicator(paneId: string, name?: string): void;
    addShapeTemplate(template: ShapeTemplate<ShapeDataSourceItem[]>): void;
    addShapeTemplate(template: ShapeTemplate<ShapeDataSourceItem[]>[]): void;
    addShapeTemplate(template: ShapeTemplate<ShapeDataSourceItem>): void;
    addShapeTemplate(template: ShapeTemplate<ShapeDataSourceItem>[]): void;
    createShape(value: string, paneId?: string): string;
    createShape(value: Shape, paneId?: string): string;
    getShape(shapeId?: string): any;
    setShapeOptions(options: OverrideShape): void;
    removeShape(shapeId?: string): void;
    createAnnotation(annotation: Annotation | Annotation[], paneId?: string): void;
    removeAnnotation(paneId?: string, point?: Point | Point[]): void;
    createTag(tag: Tag | Tag[], paneId?: string): void;
    removeTag(paneId?: string, tagId?: string | string[]): void;
    createHtml(html: HTML, paneId?: string): string;
    removeHtml(paneId?: string, htmlId?: string | string[]): void;
    scrollByDistance(distance: number, animationDuration?: number): void;
    scrollToRealTime(animationDuration?: number): void;
    scrollToDataIndex(dataIndex: number, animationDuration?: number): void;
    scrollToTimestamp(timestamp: number, animationDuration?: number): void;
    zoomAtCoordinate(scale: number, coordinate?: Coordinate, animationDuration?: number): void;
    zoomAtDataIndex(scale: number, dataIndex: number, animationDuration?: number): void;
    zoomAtTimestamp(scale: number, Timestamp: number, animationDuration?: number): void;
    setPaneOptions(options: PaneOptions): void;
    convertFromPixel(coordinate: Coordinate[], finder: ConvertFinder): Point[];
    convertFromPixel(coordinate: Coordinate , finder: ConvertFinder): Point;
    convertToPixel(point: Point[], finder?: ConvertFinder): Coordinate[];
    convertToPixel(point: Point , finder?: ConvertFinder): Coordinate;
    subscribeAction(type: ChartActionType, callback: (params: any) => void): void;
    unsubscribeAction(type: ChartActionType, callback?: (params: any) => void): void;
    getConvertPictureUrl(includeOverlay?: boolean, type?: PictureType, backgroundColor?: string): string;
    resize(): void;
  }

  interface Utils {
    clone(target: any): void;
    merge(target: any, source: any): void;
    isString(value: any): boolean;
    isNumber(value: any): boolean;
    isValid(value: any): boolean;
    isObject(value: any): boolean;
    isArray(value: any): boolean;
    isFunction(value: any): boolean;
    isBoolean(value: any): boolean;
    formatValue(data: any, key: any, defaultValue?: any): any;
    formatPrecision(value: number, precision?: number): string;
    formatBigNumber(value: number): string;
  }

  interface Extension {
    addTechnicalIndicatorTemplate(template: TechnicalIndicatorTemplate): void;
    addTechnicalIndicatorTemplate(template: TechnicalIndicatorTemplate[]): void;
    addShapeTemplate(template: ShapeTemplate<ShapeDataSourceItem[]>): void;
    addShapeTemplate(template: ShapeTemplate<ShapeDataSourceItem[]>[]): void;
    addShapeTemplate(template: ShapeTemplate<ShapeDataSourceItem>): void;
    addShapeTemplate(template: ShapeTemplate<ShapeDataSourceItem>[]): void;
  }

  interface ShapeHelper{
    checkCoordinateOnSegment(coordinate1: Coordinate, coordinate2: Coordinate, targetCoordinate: Coordinate): boolean
    checkCoordinateInRect(coordinate1: Coordinate, coordinate2: Coordinate, eventCoordinate: Coordinate): boolean
  }

  const extension: Extension
  const utils: Utils
  const shapeHelper:ShapeHelper
  
  function version(): string;

  function init(ds: HTMLDivElement | string, style?: any): Chart;
  
  function dispose(dcs: HTMLDivElement | Chart | string): void;
}