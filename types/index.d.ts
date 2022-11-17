/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
export declare type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends Array<infer U> ? Array<DeepPartial<U>> : T[P] extends ReadonlyArray<infer X> ? ReadonlyArray<DeepPartial<X>> : DeepPartial<T[P]>;
};
/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
export interface KLineData {
	timestamp: number;
	open: number;
	high: number;
	low: number;
	close: number;
	volume?: number;
	turnover?: number;
}
/**
 * line type
 * @type {{DASHED: string, SOLID: string}}
 */
export declare const enum LineType {
	DASHED = "dashed",
	SOLID = "solid"
}
export interface LineStyle {
	style: LineType;
	size: number;
	color: string;
	dashedValue: number[];
}
export interface StateLineStyle extends LineStyle {
	show: boolean;
}
export declare const enum PolygonType {
	STROKE = "stroke",
	FILL = "fill",
	STROKE_FILL = "stroke_fill"
}
export interface PolygonStyle {
	style: PolygonType;
	color: string | CanvasGradient;
	borderColor: string;
	borderSize: number;
	borderStyle: LineType;
	borderDashedValue: number[];
}
export interface RectStyle extends PolygonStyle {
	borderRadius: number;
}
export interface TextStyle {
	color: string;
	size: number;
	family: string;
	weight: number | string;
}
export interface StateTextStyle extends TextStyle {
	show: boolean;
}
export interface RectTextStyle extends TextStyle {
	style: PolygonType;
	paddingLeft: number;
	paddingTop: number;
	paddingRight: number;
	paddingBottom: number;
	borderStyle: LineType;
	borderDashedValue: number[];
	borderSize: number;
	borderColor: string;
	borderRadius: number;
	backgroundColor: string;
}
export interface StateRectTextStyle extends RectTextStyle {
	show: boolean;
}
export interface MarginTextStyle extends StateTextStyle {
	marginLeft: number;
	marginTop: number;
	marginRight: number;
	marginBottom: number;
}
export declare type LastValueMarkTextStyle = Omit<StateRectTextStyle, "backgroundColor" | "borderColor">;
/**
 * 说明显示规则
 * @type {{FOLLOW_CROSS: string, NONE: string, ALWAYS: string}}
 */
export declare const enum TooltipShowRule {
	ALWAYS = "always",
	FOLLOW_CROSS = "follow_cross",
	NONE = "none"
}
/**
 * 数据提示显示类型
 * @type {{RECT: string, STANDARD: string}}
 */
export declare const enum TooltipShowType {
	RECT = "rect",
	STANDARD = "standard"
}
export interface ChangeColor {
	upColor: string;
	downColor: string;
	noChangeColor: string;
}
export interface GradientColor {
	offset: number;
	color: string;
}
export interface GridStyle {
	show: boolean;
	horizontal: StateLineStyle;
	vertical: StateLineStyle;
}
export declare type TooltipTextStyle = Omit<MarginTextStyle, "show">;
export interface TooltipStyle {
	showRule: TooltipShowRule;
	showType: TooltipShowType;
	defaultValue: string;
	text: TooltipTextStyle;
}
export interface CandleAreaStyle {
	lineSize: number;
	lineColor: string;
	value: string;
	backgroundColor: string | GradientColor[];
}
export interface CandleHighLowPriceMarkStyle {
	show: boolean;
	color: string;
	textOffset: number;
	textSize: number;
	textFamily: string;
	textWeight: string;
}
export declare type CandleLastPriceMarkLineStyle = Omit<StateLineStyle, "color">;
export interface CandleLastPriceMarkStyle extends ChangeColor {
	show: boolean;
	line: CandleLastPriceMarkLineStyle;
	text: LastValueMarkTextStyle;
}
export interface CandlePriceMarkStyle {
	show: boolean;
	high: CandleHighLowPriceMarkStyle;
	low: CandleHighLowPriceMarkStyle;
	last: CandleLastPriceMarkStyle;
}
export interface CandleTooltipRectStyle extends Omit<RectStyle, "style" | "borderDashedValue" | "borderStyle"> {
	paddingLeft: number;
	paddingRight: number;
	paddingTop: number;
	paddingBottom: number;
	offsetLeft: number;
	offsetTop: number;
	offsetRight: number;
}
export interface CandleTooltipValuesChild {
	color: string;
	value: string;
}
export declare type CandleTooltipValuesCallback = (kLineData: KLineData, styles: CandleStyle) => string[] | CandleTooltipValuesChild[];
export interface CandleTooltipStyle extends TooltipStyle {
	labels: string[];
	values: CandleTooltipValuesCallback | string[] | null;
	rect: CandleTooltipRectStyle;
}
/**
 * 蜡烛图样式
 * @type {{AREA: string, OHLC: string, CANDLE_STROKE: string, CANDLE_SOLID: string, CANDLE_DOWN_STROKE: string, CANDLE_UP_STROKE: string}}
 */
export declare const enum CandleType {
	CANDLE_SOLID = "candle_solid",
	CANDLE_STROKE = "candle_stroke",
	CANDLE_UP_STROKE = "candle_up_stroke",
	CANDLE_DOWN_STROKE = "candle_down_stroke",
	OHLC = "ohlc",
	AREA = "area"
}
export interface CandleStyle {
	type: CandleType;
	bar: ChangeColor;
	area: CandleAreaStyle;
	priceMark: CandlePriceMarkStyle;
	tooltip: CandleTooltipStyle;
}
export declare type IndicatorPolygonStyle = Omit<PolygonStyle, "color" | "borderColor"> & ChangeColor;
export interface IndicatorLastValueMarkStyle {
	show: boolean;
	text: LastValueMarkTextStyle;
}
export interface IndicatorTooltipStyle extends TooltipStyle {
	showName: boolean;
	showParams: boolean;
}
export interface IndicatorStyle {
	ohlc: ChangeColor;
	bars: IndicatorPolygonStyle[];
	lines: LineStyle[];
	circles: IndicatorPolygonStyle[];
	lastValueMark: IndicatorLastValueMarkStyle;
	tooltip: IndicatorTooltipStyle;
}
export declare type AxisLineStyle = Omit<StateLineStyle, "style" | "dashedValue">;
export interface AxisTickLineStyle extends AxisLineStyle {
	length: number;
}
export interface AxisTickTextStyle extends StateTextStyle {
	marginStart: number;
	marginEnd: number;
}
export interface AxisStyle {
	show: boolean;
	size: number | "auto";
	axisLine: AxisLineStyle;
	tickLine: AxisTickLineStyle;
	tickText: AxisTickTextStyle;
}
export declare type XAxisStyle = AxisStyle;
/**
 * y轴位置
 * @type {{LEFT: string, RIGHT: string}}
 */
export declare const enum YAxisPosition {
	LEFT = "left",
	RIGHT = "right"
}
/**
 * y轴类型
 * @type {{PERCENTAGE: string, LOG: string, NORMAL: string}}
 */
export declare const enum YAxisType {
	NORMAL = "normal",
	PERCENTAGE = "percentage",
	LOG = "log"
}
export interface YAxisStyle extends AxisStyle {
	type: YAxisType;
	position: YAxisPosition;
	inside: boolean;
	reverse: boolean;
}
export interface CrosshairDirectionStyle {
	show: boolean;
	line: StateLineStyle;
	text: StateRectTextStyle;
}
export interface CrosshairStyle {
	show: boolean;
	horizontal: CrosshairDirectionStyle;
	vertical: CrosshairDirectionStyle;
}
export interface OverlayPointStyle {
	color: string;
	borderColor: string;
	borderSize: number;
	radius: number;
	activeColor: string;
	activeBorderColor: string;
	activeBorderSize: number;
	activeRadius: number;
}
export interface OverlayStyle {
	point: OverlayPointStyle;
	line: LineStyle;
	rect: RectStyle;
	polygon: PolygonStyle;
	circle: PolygonStyle;
	arc: LineStyle;
	text: TextStyle;
	rectText: RectTextStyle;
}
export interface SeparatorStyle {
	size: number;
	color: string;
	fill: boolean;
	activeBackgroundColor: string;
}
export interface Styles {
	grid: GridStyle;
	candle: CandleStyle;
	indicator: IndicatorStyle;
	xAxis: XAxisStyle;
	yAxis: YAxisStyle;
	separator: SeparatorStyle;
	crosshair: CrosshairStyle;
	overlay: OverlayStyle;
}
/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
export declare type TypeOrNull<T> = T | null;
/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
export interface Bounding {
	width: number;
	height: number;
	left: number;
	right: number;
	top: number;
	bottom: number;
}
/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
export interface Coordinate {
	x: number;
	y: number;
}
/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
export interface Point {
	dataIndex: number;
	timestamp: number;
	value: number;
}
export interface Crosshair extends Partial<Coordinate> {
	paneId?: string;
	realX?: number;
	kLineData?: KLineData;
	dataIndex?: number;
	realDataIndex?: number;
}
/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
export declare type ActionCallback = (data?: any) => void;
export declare const enum ActionType {
	onZoom = "onZoom",
	onScroll = "onScroll",
	onVisibleRangeChange = "onVisibleDataChange",
	onCrosshairChange = "onCrosshairChange",
	onPaneDrag = "onPaneDrag"
}
export declare type LoadMoreCallback = (timestamp: TypeOrNull<number>) => void;
/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
export interface Precision {
	price: number;
	volume: number;
}
/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
export interface BarSpace {
	bar: number;
	halfBar: number;
	gapBar: number;
	halfGapBar: number;
}
/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
export interface VisibleRange {
	from: number;
	to: number;
}
/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
export declare type ExcludePickPartial<T, K extends keyof T> = Partial<Omit<T, K>> & Pick<T, K>;
export declare type EmptyCallback = () => void;
export interface MouseTouchEvent {
	readonly clientX: number;
	readonly clientY: number;
	readonly pageX: number;
	readonly pageY: number;
	readonly screenX: number;
	readonly screenY: number;
	readonly x: number;
	readonly y: number;
	readonly ctrlKey: boolean;
	readonly altKey: boolean;
	readonly shiftKey: boolean;
	readonly metaKey: boolean;
	readonly srcType: string;
	readonly isTouch: boolean;
	target: MouseEvent["target"];
	view: MouseEvent["view"];
	preventDefault: EmptyCallback;
}
export interface Figure<A = any, S = any> {
	name: string;
	attrs: A;
	styles: S;
	draw: (ctx: CanvasRenderingContext2D, attrs: A, styles: S) => void;
	checkEventOn: (coordinate: Coordinate, attrs: A, styles: S) => boolean;
}
export declare type FigureTemplate<A = any, S = any> = Pick<Figure<A, S>, "name" | "draw" | "checkEventOn">;
export interface YAxis extends Axis {
	isFromZero: () => boolean;
}
export interface PaneGap {
	top?: number;
	bottom?: number;
}
export interface PaneOptions {
	id: string;
	height?: number;
	minHeight?: number;
	dragEnabled?: boolean;
	gap?: PaneGap;
}
export interface Axis {
	convertToPixel: (value: number) => number;
	convertFromPixel: (px: number) => number;
}
export declare type XAxis = Axis;
export declare const enum IndicatorSeries {
	NORMAL = "normal",
	PRICE = "price",
	VOLUME = "volume"
}
export interface IndicatorFigureStyle {
	style?: LineType[keyof LineType] | PolygonType[keyof PolygonType];
	color?: string;
}
export interface IndicatorFigureStylesCallbackDataChild<D> {
	kLineData?: KLineData;
	indicatorData?: D;
}
export interface IndicatorFigureStylesCallbackData<D> {
	prev: IndicatorFigureStylesCallbackDataChild<D>;
	current: IndicatorFigureStylesCallbackDataChild<D>;
	next: IndicatorFigureStylesCallbackDataChild<D>;
}
export declare type IndicatorFigureStylesCallback<D> = (data: IndicatorFigureStylesCallbackData<D>, indicator: Indicator<D>, defaultStyles: IndicatorStyle) => IndicatorFigureStyle;
export interface IndicatorFigure<D = any> {
	key: string;
	title?: string;
	type?: string;
	baseValue?: number;
	styles?: IndicatorFigureStylesCallback<D>;
}
export declare type IndicatorRegenerateFiguresCallback<D = any> = (calcParms: any[]) => Array<IndicatorFigure<D>>;
export interface IndicatorTooltipDataChild {
	title: string;
	value: string;
	color: string;
}
export interface IndicatorTooltipData {
	name?: string;
	calcParamText?: string;
	values?: IndicatorTooltipDataChild[];
}
export interface IndicatorCreateToolTipDataSourceParams<D = any> {
	kLineDataList: KLineData[];
	indicator: Indicator<D>;
	visibleRange: VisibleRange;
	bounding: Bounding;
	crosshair: Crosshair;
	defaultStyles: IndicatorStyle;
	xAxis: XAxis;
	yAxis: YAxis;
}
export declare type IndicatorCreateToolTipDataSourceCallback<D = any> = (params: IndicatorCreateToolTipDataSourceParams<D>) => IndicatorTooltipData;
export interface IndicatorDrawParams<D = any> {
	ctx: CanvasRenderingContext2D;
	kLineDataList: KLineData[];
	indicator: Indicator<D>;
	visibleRange: VisibleRange;
	bounding: Bounding;
	barSpace: BarSpace;
	defaultStyles: IndicatorStyle;
	xAxis: XAxis;
	yAxis: YAxis;
}
export declare type IndicatorDrawCallback<D = any> = (params: IndicatorDrawParams<D>) => boolean;
export declare type IndicatorCalcCallback<D> = (dataList: KLineData[], indicator: Indicator<D>) => Promise<D[]> | D[];
export interface Indicator<D = any> {
	name: string;
	shortName: string;
	precision: number;
	calcParams: any[];
	shouldOhlc: boolean;
	shouldFormatBigNumber: boolean;
	extendData: any;
	series: IndicatorSeries;
	figures: Array<IndicatorFigure<D>>;
	minValue: TypeOrNull<number>;
	maxValue: TypeOrNull<number>;
	styles: TypeOrNull<Partial<IndicatorStyle>>;
	calc: IndicatorCalcCallback<D>;
	regenerateFigures: TypeOrNull<IndicatorRegenerateFiguresCallback<D>>;
	createToolTipDataSource: TypeOrNull<IndicatorCreateToolTipDataSourceCallback>;
	draw: TypeOrNull<IndicatorDrawCallback<D>>;
	result: D[];
}
export declare type IndicatorTemplate<D = any> = ExcludePickPartial<Omit<Indicator<D>, "reult">, "name" | "calc">;
export declare type IndicatorCreate<D = any> = ExcludePickPartial<Omit<Indicator<D>, "reult">, "name">;
/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
export declare type PickPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export declare const enum OverlayMode {
	NORMAL = "normal",
	WEAK_MAGNET = "weak_magnet",
	STRONG_MAGNET = "strong_magnet"
}
export interface OverlayPerformEventParams {
	currentStep: number;
	mode: OverlayMode;
	points: Array<PickPartial<Point, "timestamp">>;
	performPointIndex: number;
	performPoint: PickPartial<Point, "timestamp">;
}
export interface OverlayFigure {
	key?: string;
	type: string;
	attrs: any | any[];
	styles?: any;
	ignoreEvent?: boolean;
}
export interface OverlayCreateFiguresCallbackParams {
	overlay: Overlay;
	coordinates: Coordinate[];
	bounding: Bounding;
	barSpace: BarSpace;
	precision: Precision;
	dateTimeFormat: Intl.DateTimeFormat;
	defaultStyles: OverlayStyle;
	xAxis: TypeOrNull<XAxis>;
	yAxis: TypeOrNull<YAxis>;
}
export interface OverlayEvent extends Partial<MouseTouchEvent> {
	overlay: Overlay;
}
export declare type OverlayEventCallback = (event: OverlayEvent) => boolean;
export declare type OverlayCreateFiguresCallback = (params: OverlayCreateFiguresCallbackParams) => OverlayFigure | OverlayFigure[];
export interface Overlay {
	/**
	 * Unique identification
	 */
	id: string;
	/**
	 * Name
	 */
	name: string;
	/**
	 * Total number of steps required to complete mouse operation
	 */
	totalStep: number;
	/**
	 * Current step
	 */
	currentStep: number;
	/**
	 * Whether it is locked. When it is true, it will not respond to events
	 */
	lock: boolean;
	/**
	 * Whether the default figure corresponding to the point is required
	 */
	needDefaultPointFigure: boolean;
	/**
	 * Whether the default figure on the Y axis is required
	 */
	needDefaultXAxisFigure: boolean;
	/**
	 * Whether the default figure on the X axis is required
	 */
	needDefaultYAxisFigure: boolean;
	/**
	 * Mode
	 */
	mode: OverlayMode;
	/**
	 * Time and value information
	 */
	points: Array<PickPartial<Point, "timestamp">>;
	/**
	 * Extended Data
	 */
	extendData: any;
	/**
	 * The style information and format are consistent with the overlay in the unified configuration
	 */
	styles: TypeOrNull<DeepPartial<OverlayStyle>>;
	/**
	 * Create figures corresponding to points
	 */
	createPointFigures: TypeOrNull<OverlayCreateFiguresCallback>;
	/**
	 * Create figures on the Y axis
	 */
	createXAxisFigures: TypeOrNull<OverlayCreateFiguresCallback>;
	/**
	 * Create figures on the X axis
	 */
	createYAxisFigures: TypeOrNull<OverlayCreateFiguresCallback>;
	/**
	 * Special handling callbacks when pressing events
	 */
	performEventPressedMove: TypeOrNull<(params: OverlayPerformEventParams) => void>;
	/**
	 * In drawing, special handling callback when moving events
	 */
	performEventMoveForDrawing: TypeOrNull<(params: OverlayPerformEventParams) => void>;
	/**
	 * Start drawing event
	 */
	onDrawStart: TypeOrNull<OverlayEventCallback>;
	/**
	 * In drawing event
	 */
	onDrawing: TypeOrNull<OverlayEventCallback>;
	/**
	 * Draw End Event
	 */
	onDrawEnd: TypeOrNull<OverlayEventCallback>;
	/**
	 * Click event
	 */
	onClick: TypeOrNull<OverlayEventCallback>;
	/**
	 * Right click event
	 */
	onRightClick: TypeOrNull<OverlayEventCallback>;
	/**
	 * Pressed move start event
	 */
	onPressedMoveStart: TypeOrNull<OverlayEventCallback>;
	/**
	 * Pressed moving event
	 */
	onPressedMoving: TypeOrNull<OverlayEventCallback>;
	/**
	 * Pressed move end event
	 */
	onPressedMoveEnd: TypeOrNull<OverlayEventCallback>;
	/**
	 * Mouse enter event
	 */
	onMouseEnter: TypeOrNull<OverlayEventCallback>;
	/**
	 * Mouse leave event
	 */
	onMouseLeave: TypeOrNull<OverlayEventCallback>;
	/**
	 * Removed event
	 */
	onRemoved: TypeOrNull<OverlayEventCallback>;
	/**
	 * Selected event
	 */
	onSelected: TypeOrNull<OverlayEventCallback>;
	/**
	 * Deselected event
	 */
	onDeselected: TypeOrNull<OverlayEventCallback>;
}
export declare type OverlayTemplate = ExcludePickPartial<Omit<Overlay, "id" | "points" | "currentStep">, "name">;
export declare type OverlayCreate = ExcludePickPartial<Omit<Overlay, "series" | "currentStep" | "totalStep" | "createPointFigures" | "createXAxisFigures" | "createYAxisFigures" | "performEventPressedMove" | "performEventMoveForDrawing">, "name">;
export declare const enum DomPosition {
	ROOT = 0,
	MAIN = 1,
	YAXIS = 2
}
export interface ConvertFinder {
	paneId?: string;
	absolute?: boolean;
}
export interface Chart {
	getDom: (paneId?: string, position?: DomPosition) => TypeOrNull<HTMLElement>;
	getSize: (paneId?: string, position?: DomPosition) => TypeOrNull<Bounding>;
	setStyleOptions: (options: DeepPartial<Styles>) => void;
	getStyleOptions: () => Styles;
	setPriceVolumePrecision: (pricePrecision: number, volumePrecision: number) => void;
	setTimezone: (timezone: string) => void;
	getTimezone: () => string;
	setOffsetRightDistance: (space: number) => void;
	setLeftMinVisibleBarCount: (barCount: number) => void;
	setRightMinVisibleBarCount: (barCount: number) => void;
	setBarSpace: (space: number) => void;
	getBarSpace: () => number;
	clearData: () => void;
	getDataList: () => KLineData[];
	applyNewData: (dataList: KLineData[], more?: boolean) => void;
	applyMoreData: (dataList: KLineData[], more?: boolean) => void;
	updateData: (data: KLineData) => void;
	loadMore: (cb: LoadMoreCallback) => void;
	createIndicator: (value: string | IndicatorCreate, isStack?: boolean, paneOptions?: PaneOptions) => TypeOrNull<string>;
	overrideIndicator: (override: IndicatorCreate, paneId?: string) => void;
	getIndicatorByPaneId: (paneId?: string, name?: string) => TypeOrNull<Indicator> | TypeOrNull<Map<string, Indicator>> | Map<string, Map<string, Indicator>>;
	removeIndicator: (paneId: string, name?: string) => void;
	createOverlay: (value: string | OverlayCreate, paneId?: string) => TypeOrNull<string>;
	getOverlayById: (id: string) => TypeOrNull<Overlay>;
	overrideOverlay: (override: Partial<OverlayCreate>) => void;
	removeOverlay: (id?: string) => void;
	setPaneOptions: (options: PaneOptions) => void;
	setZoomEnabled: (enabled: boolean) => void;
	isZoomEnabled: () => boolean;
	setScrollEnabled: (enabled: boolean) => void;
	isScrollEnabled: () => boolean;
	scrollByDistance: (distance: number, animationDuration?: number) => void;
	scrollToRealTime: (animationDuration?: number) => void;
	scrollToDataIndex: (dataIndex: number, animationDuration?: number) => void;
	scrollToTimestamp: (timestamp: number, animationDuration?: number) => void;
	zoomAtCoordinate: (scale: number, coordinate: Coordinate, animationDuration?: number) => void;
	zoomAtDataIndex: (scale: number, dataIndex: number, animationDuration?: number) => void;
	zoomAtTimestamp: (scale: number, timestamp: number, animationDuration?: number) => void;
	convertToPixel: (points: Partial<Point> | Array<Partial<Point>>, finder: ConvertFinder) => Partial<Coordinate> | Array<Partial<Coordinate>>;
	convertFromPixel: (coordinates: Array<Partial<Coordinate>>, finder: ConvertFinder) => Partial<Point> | Array<Partial<Point>>;
	subscribeAction: (type: ActionType, callback: ActionCallback) => void;
	unsubscribeAction: (type: ActionType, callback?: ActionCallback) => void;
	getConvertPictureUrl: (includeOverlay?: boolean, type?: string, backgroundColor?: string) => string;
	resize: () => void;
	destroy: () => void;
}
export declare function getSupportFigures(): string[];
export declare function reisterFigure<A = any, S = any>(figure: FigureTemplate<A, S>): void;
export declare function registerIndicator<D>(indicator: IndicatorTemplate<D>): void;
export declare function getSupportIndicators(): string[];
export declare function registerOverlay(template: OverlayTemplate): void;
export declare function getSupportedOverlays(): string[];
declare function merge(target: any, source: any): void;
declare function clone(target: any): any;
declare function isArray(value: any): boolean;
declare function isFunction(value: any): boolean;
declare function isObject(value: any): boolean;
declare function isNumber(value: any): boolean;
declare function isValid(value: any | null): boolean;
declare function isBoolean(value: any): boolean;
declare function isString(value: any): boolean;
declare function formatValue(data: unknown, key: string, defaultValue?: unknown): unknown;
declare function formatPrecision(value: string | number, precision?: number): string;
declare function formatBigNumber(value: string | number): string;
/**
 * Chart version
 * @return {string}
 */
export declare function version(): string;
/**
 * Init chart instance
 * @param ds
 * @param styles
 * @returns {Chart}
 */
export declare function init(ds: HTMLElement | string, styles?: DeepPartial<Styles>): Chart | null;
/**
 * Destory chart instace
 * @param dcs
 */
export declare function dispose(dcs: HTMLElement | Chart | string): void;
export declare const utils: {
	clone: typeof clone;
	merge: typeof merge;
	isString: typeof isString;
	isNumber: typeof isNumber;
	isValid: typeof isValid;
	isObject: typeof isObject;
	isArray: typeof isArray;
	isFunction: typeof isFunction;
	isBoolean: typeof isBoolean;
	formatValue: typeof formatValue;
	formatPrecision: typeof formatPrecision;
	formatBigNumber: typeof formatBigNumber;
};

export as namespace klinecharts;

export {};
