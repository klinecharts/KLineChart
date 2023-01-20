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
export declare type Nullable<T> = T | null;
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
export interface SmoothLineStyle extends LineStyle {
	smooth: boolean;
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
export declare const enum TooltipShowRule {
	ALWAYS = "always",
	FOLLOW_CROSS = "follow_cross",
	NONE = "none"
}
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
export interface TooltipDataChild {
	text: string;
	color: string;
}
export interface TooltipData {
	title: string | TooltipDataChild;
	value: string | TooltipDataChild;
}
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
export declare type CandleTooltipCustomCallback = (kLineData: KLineData, styles: CandleStyle) => TooltipData[];
export interface CandleTooltipStyle extends TooltipStyle {
	custom: Nullable<CandleTooltipCustomCallback>;
	rect: CandleTooltipRectStyle;
}
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
	lines: SmoothLineStyle[];
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
export declare const enum YAxisPosition {
	LEFT = "left",
	RIGHT = "right"
}
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
	line: SmoothLineStyle;
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
export declare const enum FormatDateType {
	TOOLTIP = 0,
	CROSSHAIR = 1,
	XAXIS = 2
}
export declare type FormatDate = (dateTimeFormat: Intl.DateTimeFormat, timestamp: number, format: string, type: FormatDateType) => string;
export declare type FormatBigNumber = (value: string | number) => string;
export interface CustomApi {
	formatDate: FormatDate;
	formatBigNumber: FormatBigNumber;
}
export interface Locales {
	time: string;
	open: string;
	high: string;
	low: string;
	close: string;
	volume: string;
}
export interface Options {
	locale?: string;
	timezone?: string;
	styles?: string | DeepPartial<Styles>;
	customApi?: Partial<CustomApi>;
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
export declare type LoadMoreCallback = (timestamp: Nullable<number>) => void;
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
export declare type FigureCreate<A = any, S = any> = Pick<Figure<A, S>, "name" | "attrs" | "styles">;
export declare type FigureConstructor<A = any, S = any> = new (figure: FigureCreate<A, S>) => ({
	draw: (ctx: CanvasRenderingContext2D) => void;
});
export interface YAxis extends Axis {
	isFromZero: () => boolean;
}
export interface PaneGap {
	top?: number;
	bottom?: number;
}
export interface PaneOptions {
	id?: string;
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
export interface IndicatorTooltipData {
	name?: string;
	calcParamsText?: string;
	values?: TooltipData[];
}
export interface IndicatorCreateTooltipDataSourceParams<D = any> {
	kLineDataList: KLineData[];
	indicator: Indicator<D>;
	visibleRange: VisibleRange;
	bounding: Bounding;
	crosshair: Crosshair;
	defaultStyles: IndicatorStyle;
	xAxis: XAxis;
	yAxis: YAxis;
}
export declare type IndicatorCreateTooltipDataSourceCallback<D = any> = (params: IndicatorCreateTooltipDataSourceParams<D>) => IndicatorTooltipData;
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
	/**
	 * Indicator name
	 */
	name: string;
	/**
	 * Short name, for display
	 */
	shortName: string;
	/**
	 * Precision
	 */
	precision: number;
	/**
	 * Calculation parameters
	 */
	calcParams: any[];
	/**
	 * Whether ohlc column is required
	 */
	shouldOhlc: boolean;
	/**
	 * Whether large data values need to be formatted, starting from 1000, for example, whether 100000 needs to be formatted with 100K
	 */
	shouldFormatBigNumber: boolean;
	/**
	 * Extend data
	 */
	extendData: any;
	/**
	 * Indicator series
	 */
	series: IndicatorSeries;
	/**
	 * Figure configuration information
	 */
	figures: Array<IndicatorFigure<D>>;
	/**
	 * Specified minimum value
	 */
	minValue: Nullable<number>;
	/**
	 * Specified maximum value
	 */
	maxValue: Nullable<number>;
	/**
	 * Style configuration
	 */
	styles: Nullable<Partial<IndicatorStyle>>;
	/**
	 * Indicator calculation
	 */
	calc: IndicatorCalcCallback<D>;
	/**
	 * Regenerate figure configuration
	 */
	regenerateFigures: Nullable<IndicatorRegenerateFiguresCallback<D>>;
	/**
	 * Create custom tooltip text
	 */
	createTooltipDataSource: Nullable<IndicatorCreateTooltipDataSourceCallback>;
	/**
	 * Custom draw
	 */
	draw: Nullable<IndicatorDrawCallback<D>>;
	/**
	 * Calculation result
	 */
	result: D[];
}
export declare type IndicatorTemplate<D = any> = ExcludePickPartial<Omit<Indicator<D>, "reult">, "name" | "calc">;
export declare type IndicatorCreate<D = any> = ExcludePickPartial<Omit<Indicator<D>, "reult">, "name">;
export declare const enum OverlayMode {
	NORMAL = "normal",
	WEAK_MAGNET = "weak_magnet",
	STRONG_MAGNET = "strong_magnet"
}
export interface OverlayPerformEventParams {
	currentStep: number;
	mode: OverlayMode;
	points: Array<Partial<Point>>;
	performPointIndex: number;
	performPoint: Partial<Point>;
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
	xAxis: Nullable<XAxis>;
	yAxis: Nullable<YAxis>;
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
	 * Group id
	 */
	groupId: string;
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
	points: Array<Partial<Point>>;
	/**
	 * Extended Data
	 */
	extendData: any;
	/**
	 * The style information and format are consistent with the overlay in the unified configuration
	 */
	styles: Nullable<DeepPartial<OverlayStyle>>;
	/**
	 * Create figures corresponding to points
	 */
	createPointFigures: Nullable<OverlayCreateFiguresCallback>;
	/**
	 * Create figures on the Y axis
	 */
	createXAxisFigures: Nullable<OverlayCreateFiguresCallback>;
	/**
	 * Create figures on the X axis
	 */
	createYAxisFigures: Nullable<OverlayCreateFiguresCallback>;
	/**
	 * Special handling callbacks when pressing events
	 */
	performEventPressedMove: Nullable<(params: OverlayPerformEventParams) => void>;
	/**
	 * In drawing, special handling callback when moving events
	 */
	performEventMoveForDrawing: Nullable<(params: OverlayPerformEventParams) => void>;
	/**
	 * Start drawing event
	 */
	onDrawStart: Nullable<OverlayEventCallback>;
	/**
	 * In drawing event
	 */
	onDrawing: Nullable<OverlayEventCallback>;
	/**
	 * Draw End Event
	 */
	onDrawEnd: Nullable<OverlayEventCallback>;
	/**
	 * Click event
	 */
	onClick: Nullable<OverlayEventCallback>;
	/**
	 * Right click event
	 */
	onRightClick: Nullable<OverlayEventCallback>;
	/**
	 * Pressed move start event
	 */
	onPressedMoveStart: Nullable<OverlayEventCallback>;
	/**
	 * Pressed moving event
	 */
	onPressedMoving: Nullable<OverlayEventCallback>;
	/**
	 * Pressed move end event
	 */
	onPressedMoveEnd: Nullable<OverlayEventCallback>;
	/**
	 * Mouse enter event
	 */
	onMouseEnter: Nullable<OverlayEventCallback>;
	/**
	 * Mouse leave event
	 */
	onMouseLeave: Nullable<OverlayEventCallback>;
	/**
	 * Removed event
	 */
	onRemoved: Nullable<OverlayEventCallback>;
	/**
	 * Selected event
	 */
	onSelected: Nullable<OverlayEventCallback>;
	/**
	 * Deselected event
	 */
	onDeselected: Nullable<OverlayEventCallback>;
}
export declare type OverlayTemplate = ExcludePickPartial<Omit<Overlay, "id" | "groupId" | "points" | "currentStep">, "name">;
export declare type OverlayCreate = ExcludePickPartial<Omit<Overlay, "currentStep" | "totalStep" | "createPointFigures" | "createXAxisFigures" | "createYAxisFigures" | "performEventPressedMove" | "performEventMoveForDrawing">, "name">;
export declare type OverlayRemove = Partial<Pick<Overlay, "id" | "groupId" | "name">>;
export declare const enum DomPosition {
	ROOT = "root",
	MAIN = "main",
	YAXIS = "yAxis"
}
export interface ConvertFinder {
	paneId?: string;
	absolute?: boolean;
}
export interface Chart {
	getDom: (paneId?: string, position?: DomPosition) => Nullable<HTMLElement>;
	getSize: (paneId?: string, position?: DomPosition) => Nullable<Bounding>;
	setLocale: (locale: string) => void;
	getLocale: () => string;
	setStyles: (styles: string | DeepPartial<Styles>) => void;
	getStyles: () => Styles;
	setCustomApi: (customApi: Partial<CustomApi>) => void;
	setPriceVolumePrecision: (pricePrecision: number, volumePrecision: number) => void;
	getPriceVolumePrecision: () => Precision;
	setTimezone: (timezone: string) => void;
	getTimezone: () => string;
	setOffsetRightDistance: (space: number) => void;
	setLeftMinVisibleBarCount: (barCount: number) => void;
	setRightMinVisibleBarCount: (barCount: number) => void;
	setBarSpace: (space: number) => void;
	getBarSpace: () => number;
	getVisibleRange: () => VisibleRange;
	clearData: () => void;
	getDataList: () => KLineData[];
	applyNewData: (dataList: KLineData[], more?: boolean) => void;
	applyMoreData: (dataList: KLineData[], more?: boolean) => void;
	updateData: (data: KLineData) => void;
	loadMore: (cb: LoadMoreCallback) => void;
	createIndicator: (value: string | IndicatorCreate, isStack?: boolean, paneOptions?: PaneOptions, callback?: () => void) => Nullable<string>;
	overrideIndicator: (override: IndicatorCreate, paneId?: string, callback?: () => void) => void;
	getIndicatorByPaneId: (paneId?: string, name?: string) => Nullable<Indicator> | Nullable<Map<string, Indicator>> | Map<string, Map<string, Indicator>>;
	removeIndicator: (paneId: string, name?: string) => void;
	createOverlay: (value: string | OverlayCreate, paneId?: string) => Nullable<string>;
	getOverlayById: (id: string) => Nullable<Overlay>;
	overrideOverlay: (override: Partial<OverlayCreate>) => void;
	removeOverlay: (remove?: string | OverlayRemove) => void;
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
declare function checkCoordinateOnArc(coordinate: Coordinate, arc: ArcAttrs): boolean;
declare function drawArc(ctx: CanvasRenderingContext2D, attrs: ArcAttrs, styles: Partial<LineStyle>): void;
export interface ArcAttrs {
	x: number;
	y: number;
	r: number;
	startAngle: number;
	endAngle: number;
}
declare function checkCoordinateOnCircle(coordinate: Coordinate, circle: CircleAttrs): boolean;
declare function drawCircle(ctx: CanvasRenderingContext2D, attrs: CircleAttrs, styles: Partial<PolygonStyle>): void;
export interface CircleAttrs {
	x: number;
	y: number;
	r: number;
}
declare function checkCoordinateOnLine(coordinate: Coordinate, line: LineAttrs): boolean;
declare function getLinearYFromSlopeIntercept(kb: Nullable<number[]>, coordinate: Coordinate): number;
declare function getLinearYFromCoordinates(coordinate1: Coordinate, coordinate2: Coordinate, targetCoordinate: Coordinate): number;
declare function getLinearSlopeIntercept(coordinate1: Coordinate, coordinate2: Coordinate): Nullable<number[]>;
declare function drawLine(ctx: CanvasRenderingContext2D, attrs: LineAttrs, styles: Partial<SmoothLineStyle>): void;
export interface LineAttrs {
	coordinates: Coordinate[];
}
declare function checkCoordinateOnPolygon(coordinate: Coordinate, polygon: PolygonAttrs): boolean;
declare function drawPolygon(ctx: CanvasRenderingContext2D, attrs: PolygonAttrs, styles: Partial<PolygonStyle>): void;
export interface PolygonAttrs {
	coordinates: Coordinate[];
}
declare function checkCoordinateOnRect(coordinate: Coordinate, rect: RectAttrs): boolean;
declare function drawRect(ctx: CanvasRenderingContext2D, attrs: RectAttrs, styles: Partial<RectStyle>): void;
export interface RectAttrs {
	x: number;
	y: number;
	width: number;
	height: number;
}
declare function checkCoordinateOnText(coordinate: Coordinate, attrs: TextAttrs, styles: Partial<RectTextStyle>): boolean;
declare function drawText(ctx: CanvasRenderingContext2D, attrs: TextAttrs, styles: Partial<TextStyle>): void;
export interface TextAttrs {
	x: number;
	y: number;
	text: string;
	align?: CanvasTextAlign;
	baseline?: CanvasTextBaseline;
}
declare function drawRectText(ctx: CanvasRenderingContext2D, attrs: TextAttrs, styles: Partial<RectTextStyle>): void;
export declare function getSupportFigures(): string[];
export declare function registerFigure<A = any, S = any>(figure: FigureTemplate<A, S>): void;
export declare function getFigureClass<A = any, S = any>(name: string): Nullable<FigureConstructor<A, S>>;
export declare function registerIndicator<D>(indicator: IndicatorTemplate<D>): void;
export declare function getSupportIndicators(): string[];
export declare function registerLocale(locale: string, ls: Locales): void;
export declare function getSupportLocales(): string[];
export declare function registerOverlay(template: OverlayTemplate): void;
export declare function getSupportedOverlays(): string[];
export declare function registerStyles(name: string, ss: DeepPartial<Styles>): void;
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
declare function formatDate(dateTimeFormat: Intl.DateTimeFormat, timestamp: number, format: string): string;
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
 * @param options
 * @returns {Chart}
 */
export declare function init(ds: HTMLElement | string, options?: Options): Chart | null;
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
	formatDate: typeof formatDate;
	getLinearSlopeIntercept: typeof getLinearSlopeIntercept;
	getLinearYFromSlopeIntercept: typeof getLinearYFromSlopeIntercept;
	getLinearYFromCoordinates: typeof getLinearYFromCoordinates;
	checkCoordinateOnArc: typeof checkCoordinateOnArc;
	checkCoordinateOnCircle: typeof checkCoordinateOnCircle;
	checkCoordinateOnLine: typeof checkCoordinateOnLine;
	checkCoordinateOnPolygon: typeof checkCoordinateOnPolygon;
	checkCoordinateOnRect: typeof checkCoordinateOnRect;
	checkCoordinateOnText: typeof checkCoordinateOnText;
	drawArc: typeof drawArc;
	drawCircle: typeof drawCircle;
	drawLine: typeof drawLine;
	drawPolygon: typeof drawPolygon;
	drawRect: typeof drawRect;
	drawText: typeof drawText;
	drawRectText: typeof drawRectText;
};

export as namespace klinecharts;

export {};
