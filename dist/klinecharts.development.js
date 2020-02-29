(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = global || self, factory(global.klinecharts = {}));
}(this, function (exports) { 'use strict';

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(source, true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);

      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(receiver);
      }

      return desc.value;
    };
  }

  return _get(target, property, receiver || target);
}

var ViewPortHandler =
/*#__PURE__*/
function () {
  function ViewPortHandler() {
    _classCallCheck(this, ViewPortHandler);

    // 绘制区域参数
    this.contentRect = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }; // 整个view的高度

    this.height = 0; // 整个view的宽度

    this.width = 0;
  }
  /**
   * 设置尺寸
   * @param width
   * @param height
   * @param offsetLeft
   * @param offsetRight
   * @param offsetTop
   * @param offsetBottom
   */


  _createClass(ViewPortHandler, [{
    key: "setDimensions",
    value: function setDimensions(width, height, offsetLeft, offsetRight, offsetTop, offsetBottom) {
      this.width = width;
      this.height = height;
      this.contentRect.left = offsetLeft;
      this.contentRect.right = offsetRight;
      this.contentRect.top = offsetTop;
      this.contentRect.bottom = offsetBottom;
    }
  }, {
    key: "contentTop",
    value: function contentTop() {
      return this.contentRect.top;
    }
  }, {
    key: "contentLeft",
    value: function contentLeft() {
      return this.contentRect.left;
    }
  }, {
    key: "contentRight",
    value: function contentRight() {
      return this.width - this.contentRect.right;
    }
  }, {
    key: "contentBottom",
    value: function contentBottom() {
      return this.height - this.contentRect.bottom;
    }
    /**
     * 获取中间点坐标
     */

  }, {
    key: "getContentCenter",
    value: function getContentCenter() {
      var point = {};
      point.x = (this.contentLeft() + this.contentRight()) / 2;
      point.y = (this.contentTop() + this.contentBottom()) / 2;
      return point;
    }
  }]);

  return ViewPortHandler;
}();

var ctx = document.createElement('canvas').getContext('2d');
var pixelRatio = getPixelRatio(ctx);
ctx.scale(pixelRatio, pixelRatio);
/**
 * 获取屏幕比
 * @param ctx
 * @returns {number}
 */

function getPixelRatio(ctx) {
  var backingStore = ctx.backingStorePixelRatio || ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
  return (window.devicePixelRatio || 1) / backingStore;
}
/**
 * requestAnimationFrame兼容
 * @param fn
 */

function requestAnimationFrame(fn) {
  if (!window.requestAnimationFrame) {
    return window.setTimeout(function () {
      fn();
    }, 1000 / 60);
  }

  return window.requestAnimationFrame(fn);
}
/**
 * cancelAnimationFrame兼容
 * @param id
 */

function cancelAnimationFrame(id) {
  if (!window.cancelAnimationFrame) {
    clearTimeout(id);
  }

  window.cancelAnimationFrame(id);
}
/**
 * 测量文字的宽度
 * @param fontSize
 * @param text
 * @returns {number}
 */

function calcTextWidth(fontSize, text) {
  ctx.font = getFont(fontSize);
  return ctx.measureText(text).width;
}
/**
 * 获取字体
 * @param fontSize
 * @returns {string}
 */

function getFont(fontSize) {
  return "".concat(fontSize, "px Arial");
}

var Chart =
/*#__PURE__*/
function () {
  function Chart(dom, style) {
    _classCallCheck(this, Chart);

    this.style = style;
    this.viewPortHandler = new ViewPortHandler();
    this.init(dom);
  }
  /**
   * 初始化canvas
   * @param dom
   */


  _createClass(Chart, [{
    key: "init",
    value: function init(dom) {
      var canvasDom = document.createElement('canvas');
      canvasDom.style.position = 'absolute';
      canvasDom.style.right = '0';
      canvasDom.style.left = '0';
      this.canvasDom = canvasDom;
      this.ctx = this.canvasDom.getContext('2d');
      dom.appendChild(this.canvasDom);
    }
    /**
     * 设置图尺寸
     * @param chartTop
     * @param width
     * @param height
     * @param offsetLeft
     * @param offsetRight
     * @param offsetTop
     * @param offsetBottom
     */

  }, {
    key: "setChartDimensions",
    value: function setChartDimensions(chartTop, width, height, offsetLeft, offsetRight) {
      var offsetTop = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
      var offsetBottom = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
      this.clearCanvas();
      var pixelRatio = getPixelRatio(this.ctx);
      var canvasWidth = width * pixelRatio;
      var canvasHeight = height * pixelRatio;
      this.canvasDom.style.top = "".concat(chartTop, "px");
      this.canvasDom.style.width = "".concat(width, "px");
      this.canvasDom.style.height = "".concat(height, "px");
      this.canvasDom.width = canvasWidth;
      this.canvasDom.height = canvasHeight;
      this.viewPortHandler.setDimensions(width, height, offsetLeft, offsetRight, offsetTop, offsetBottom);
      this.ctx.scale(pixelRatio, pixelRatio);
      this.ctx.translate(-0.5, -0.5);
      this.draw();
    }
    /**
     * 清空画布
     */

  }, {
    key: "clearCanvas",
    value: function clearCanvas() {
      this.ctx.clearRect(0, 0, this.viewPortHandler.width, this.viewPortHandler.height);
    }
    /**
     * 刷新
     */

  }, {
    key: "flush",
    value: function flush() {
      var _this = this;

      if (this.requestAnimationId) {
        cancelAnimationFrame(this.requestAnimationId);
      }

      this.requestAnimationId = requestAnimationFrame(function () {
        _this.clearCanvas();

        _this.draw();
      });
    }
    /**
     * 绘制
     */

  }, {
    key: "draw",
    value: function draw() {}
  }]);

  return Chart;
}();

var Render = function Render(viewPortHandler, dataProvider) {
  _classCallCheck(this, Render);

  this.viewPortHandler = viewPortHandler;
  this.dataProvider = dataProvider;
};

/**
 * 格式化时间
 * @param timestamp
 * @param format
 * @returns {string}
 */
function formatDate(timestamp, format) {
  if (timestamp && isNumber(timestamp)) {
    var date = new Date(timestamp);
    var year = date.getFullYear().toString();
    var month = (date.getMonth() + 1).toString();
    var day = date.getDate().toString();
    var hours = date.getHours().toString();
    var minutes = date.getMinutes().toString();
    var monthText = month.length === 1 ? "0".concat(month) : month;
    var dayText = day.length === 1 ? "0".concat(day) : day;
    var hourText = hours.length === 1 ? '0' + hours : hours;
    var minuteText = minutes.length === 1 ? '0' + minutes : minutes;

    switch (format) {
      case 'YYYY':
        {
          return year;
        }

      case 'YYYY-MM':
        {
          return "".concat(year, "-").concat(monthText);
        }

      case 'YYYY-MM-DD':
        {
          return "".concat(year, "-").concat(monthText, "-").concat(dayText);
        }

      case 'YYYY-MM-DD hh:mm':
        {
          return "".concat(year, "-").concat(monthText, "-").concat(dayText, " ").concat(hourText, ":").concat(minuteText);
        }

      case 'MM-DD':
        {
          return "".concat(monthText, "-").concat(dayText);
        }

      case 'hh:mm':
        {
          return "".concat(hourText, ":").concat(minuteText);
        }

      default:
        {
          return "".concat(monthText, "-").concat(dayText, " ").concat(hourText, ":").concat(minuteText);
        }
    }
  }

  return '--';
}
/**
 * 格式化值
 * @param data
 * @param key
 * @param defaultValue
 * @returns {string|*}
 */

function formatValue(data, key) {
  var defaultValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '--';

  if (data && isObject(data)) {
    var value = data[key];

    if (value || value === 0 || value === false) {
      return value;
    }
  }

  return defaultValue;
}
function merge(target, source) {
  if (!isObject(target) || !isObject(source)) {
    return;
  }

  for (var key in source) {
    if (target.hasOwnProperty(key)) {
      var targetProp = target[key];
      var sourceProp = source[key];

      if (isObject(sourceProp) && isObject(targetProp) && !isArray(sourceProp) && !isArray(targetProp)) {
        merge(targetProp, sourceProp);
      } else {
        if (source[key] || source[key] === 0 || source[key] === false) {
          target[key] = source[key];
        }
      }
    }
  }
}
function isArray(value) {
  return Object.prototype.toString.call(value) === '[object Array]';
}
/**
 * @param {*} value
 * @return {boolean}
 */

function isFunction(value) {
  return typeof value === 'function';
}
/**
 * @param {*} value
 * @return {boolean}
 */

function isObject(value) {
  var type = _typeof(value);

  return type === 'function' || !!value && type === 'object';
}
/**
 * 判断是否是数字
 * @param value
 * @returns {boolean}
 */

function isNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * 指标类型
 * @type {{NO: string, DMI: string, OBV: string, SAR: string, BIAS: string, MTM: string, CCI: string, RSI: string, TRIX: string, CR: string, EMV: string, KDJ: string, VOL: string, BOLL: string, MA: string, MACD: string, PSY: string, KD: string, DMA: string, WR: string, VR: string, BRAR: string}}
 */
var IndicatorType = {
  NO: 'NO',
  MA: 'MA',
  VOL: 'VOL',
  MACD: 'MACD',
  BOLL: 'BOLL',
  KDJ: 'KDJ',
  RSI: 'RSI',
  BIAS: 'BIAS',
  BRAR: 'BRAR',
  CCI: 'CCI',
  DMI: 'DMI',
  CR: 'CR',
  PSY: 'PSY',
  DMA: 'DMA',
  TRIX: 'TRIX',
  OBV: 'OBV',
  VR: 'VR',
  WR: 'WR',
  MTM: 'MTM',
  EMV: 'EMV',
  SAR: 'SAR'
};
/**
 * 线的样式
 * @type {{DASH: string, SOLID: string}}
 */

var LineStyle = {
  DASH: 'dash',
  SOLID: 'solid'
};
/**
 * y轴位置
 * @type {{LEFT: string, RIGHT: string}}
 */

var YAxisPosition = {
  LEFT: 'left',
  RIGHT: 'right'
};
/**
 * y轴文字位置
 * @type {{OUTSIDE: string, INSIDE: string}}
 */

var YAxisTextPosition = {
  INSIDE: 'inside',
  OUTSIDE: 'outside'
};
/**
 * 主图类型
 * @type {{TIME_LINE: string, CANDLE: string}}
 */

var ChartType = {
  REAL_TIME: 'real_time',
  CANDLE: 'candle'
};
/**
 * 蜡烛图样式
 * @type {{STROKE: string, DECREASING_STROKE: string, OHLC: string, INCREASING_STROKE: string, SOLID: string}}
 */

var CandleStyle = {
  SOLID: 'solid',
  STROKE: 'stroke',
  INCREASING_STROKE: 'increasing_stroke',
  DECREASING_STROKE: 'decreasing_stroke',
  OHLC: 'ohlc'
};
/**
 * 提示文字显示规则
 * @type {{FOLLOW_CROSS: string, NONE: string, ALWAYS: string}}
 */

var TooltipTextDisplayRule = {
  ALWAYS: 'always',
  FOLLOW_CROSS: 'follow_cross',
  NONE: 'none'
};
/**
 * 主图数据提示显示类型
 * @type {{FLOAT: string, FIXED: string}}
 */

var TooltipMainChartTextDisplayType = {
  FLOAT: 'float',
  FIXED: 'fixed'
};
/**
 * 标记图形类型
 * @type {{STRAIGHT_LINE: string, HORIZONTAL_SEGMENT_LINE: string, FIBONACCI_LINE: string, HORIZONTAL_STRAIGHT_LINE: string, PRICE_CHANNEL_LINE: string, VERTICAL_RAY_LINE: string, VERTICAL_SEGMENT_LINE: string, PARALLEL_STRAIGHT_LINE: string, HORIZONTAL_RAY_LINE: string, VERTICAL_STRAIGHT_LINE: string, PRICE_LINE: string, RAY_LINE: string, NONE: string, SEGMENT_LINE: string}}
 */

var MarkerType = {
  NONE: 'none',
  HORIZONTAL_STRAIGHT_LINE: 'horizontalStraightLine',
  VERTICAL_STRAIGHT_LINE: 'verticalStraightLine',
  STRAIGHT_LINE: 'straightLine',
  HORIZONTAL_RAY_LINE: 'horizontalRayLine',
  VERTICAL_RAY_LINE: 'verticalRayLine',
  RAY_LINE: 'rayLine',
  HORIZONTAL_SEGMENT_LINE: 'horizontalSegmentLine',
  VERTICAL_SEGMENT_LINE: 'verticalSegmentLine',
  SEGMENT_LINE: 'segmentLine',
  PRICE_LINE: 'priceLine',
  PRICE_CHANNEL_LINE: 'priceChannelLine',
  PARALLEL_STRAIGHT_LINE: 'parallelStraightLine',
  FIBONACCI_LINE: 'fibonacciLine'
};
/**
 * 标记图形绘制步骤
 * @type {{STEP_3: *, STEP_DONE: *, STEP_1: *, STEP_2: *}}
 */

var MarkerDrawStep = {
  STEP_1: 'step_1',
  STEP_2: 'step_2',
  STEP_3: 'step_3',
  STEP_DONE: 'step_done'
};

var DATA_MARGIN_SPACE_RATE = 0.26;

var DataProvider =
/*#__PURE__*/
function () {
  function DataProvider() {
    _classCallCheck(this, DataProvider);

    // 数据源
    this.dataList = []; // 数据绘制起始位置

    this.minPos = 0; // 绘制的数据条数

    this.range = 180; // 最大绘制条数

    this.maxRange = 300; // 最小绘制条数

    this.minRange = 20; // 每条数据的所占的空间

    this.dataSpace = 0; // 当前提示数据的位置

    this.currentTooltipDataPos = 0; // 十字光标中心点位置坐标

    this.crossPoint = null; // 当前绘制的标记图形的类型

    this.currentMarkerType = MarkerType.NONE; // 标记图形点

    this.markerPoint = null; // 是否在拖拽标记图形

    this.isDragMarker = false; // 绘图标记数据

    this.markerDatas = {
      // 水平直线
      horizontalStraightLine: [],
      // 垂直直线
      verticalStraightLine: [],
      // 直线
      straightLine: [],
      // 水平射线
      horizontalRayLine: [],
      // 垂直射线
      verticalRayLine: [],
      // 射线
      rayLine: [],
      // 水平线段
      horizontalSegmentLine: [],
      // 垂直线段
      verticalSegmentLine: [],
      // 线段
      segmentLine: [],
      // 价格线
      priceLine: [],
      // 平行直线
      parallelStraightLine: [],
      // 价格通道线
      priceChannelLine: [],
      // 斐波那契线
      fibonacciLine: []
    };
  }

  _createClass(DataProvider, [{
    key: "space",
    value: function space(width) {
      this.dataSpace = width / this.range;
    }
  }, {
    key: "addData",
    value: function addData(data, pos) {
      if (isObject(data) && !isArray(data)) {
        if (pos >= this.dataList.length) {
          this.dataList.push(data);
        } else if (pos <= 0) {
          this.dataList.unshift(data);
        } else {
          this.dataList[pos] = data;
        }

        if (this.minPos + this.range >= this.dataList.length - 1) {
          this.moveToLast();
        }
      } else if (isArray(data)) {
        if (this.dataList.length === 0) {
          this.dataList = data.concat(this.dataList);
          this.moveToLast();
        } else {
          this.dataList = data.concat(this.dataList);
          this.minPos += data.length;
        }
      }
    }
  }, {
    key: "moveToLast",
    value: function moveToLast() {
      if (this.dataList.length > this.range) {
        this.minPos = this.dataList.length - this.range;
        this.currentTooltipDataPos = this.dataList.length - 1;
      } else {
        this.minPos = 0;
      }
    }
  }, {
    key: "calcCurrentTooltipDataPos",
    value: function calcCurrentTooltipDataPos(offsetLeft, x) {
      var range = +Math.ceil((x - offsetLeft) / this.dataSpace).toFixed(0);
      this.currentTooltipDataPos = this.minPos + range - 1;

      if (this.currentTooltipDataPos > this.dataList.length - 1) {
        this.currentTooltipDataPos = this.dataList.length - 1;
      }

      var sub = this.currentTooltipDataPos - this.minPos;
      this.crossPoint.x = offsetLeft + this.dataSpace * sub + this.dataSpace * (1.0 - DATA_MARGIN_SPACE_RATE) / 2;
    }
  }]);

  return DataProvider;
}();

var IndicatorRender =
/*#__PURE__*/
function (_Render) {
  _inherits(IndicatorRender, _Render);

  function IndicatorRender(viewPortHandler, dataProvider, yAxisRender) {
    var _this;

    _classCallCheck(this, IndicatorRender);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(IndicatorRender).call(this, viewPortHandler, dataProvider));
    _this.yAxisRender = yAxisRender;
    return _this;
  }
  /**
   * 绘制图与图直接的分割线
   * @param ctx
   * @param xAxis
   */


  _createClass(IndicatorRender, [{
    key: "renderHorizontalSeparatorLine",
    value: function renderHorizontalSeparatorLine(ctx, xAxis) {
      var lineSize = xAxis.line.size;
      ctx.strokeStyle = xAxis.line.color;
      ctx.lineWidth = lineSize;
      ctx.beginPath();
      ctx.moveTo(this.viewPortHandler.contentLeft(), this.viewPortHandler.contentTop() + lineSize);
      ctx.lineTo(this.viewPortHandler.contentRight(), this.viewPortHandler.contentTop() + lineSize);
      ctx.stroke();
      ctx.closePath();
    }
    /**
     * 绘制指标
     * @param ctx
     * @param indicatorType
     * @param indicator
     * @param indicatorParams
     * @param isMainIndicator
     */

  }, {
    key: "renderIndicator",
    value: function renderIndicator(ctx, indicatorType, indicator, indicatorParams) {
      var _this2 = this;

      var isMainIndicator = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
      var onRendering;
      var params = indicatorParams[indicatorType] || [];
      var linePoints = [];

      switch (indicatorType) {
        case IndicatorType.MA:
          {
            var dataKeys = [];
            params.forEach(function (p) {
              dataKeys.push("ma".concat(p));
            });

            onRendering = function onRendering(x, i, kLineData, halfBarSpace) {
              _this2.ohlcIndicatorRendering(ctx, i, x, halfBarSpace, indicator, kLineData, indicatorType, dataKeys, isMainIndicator, function (values) {
                _this2.prepareLinePoints(x, values, linePoints);
              });
            };

            break;
          }

        case IndicatorType.MACD:
          {
            onRendering = function onRendering(x, i, kLineData, halfBarSpace) {
              var macd = kLineData.macd || {};

              _this2.prepareLinePoints(x, [macd.diff, macd.dea], linePoints);

              var refKLineData = _this2.dataProvider.dataList[i - 1] || {};
              var macdValue = macd.macd;
              var refMacdValue = (refKLineData.macd || {}).macd || Number.MIN_SAFE_INTEGER;

              if (macdValue > 0) {
                ctx.strokeStyle = indicator.increasingColor;
                ctx.fillStyle = indicator.increasingColor;
              } else {
                ctx.strokeStyle = indicator.decreasingColor;
                ctx.fillStyle = indicator.decreasingColor;
              }

              var isFill = !((refMacdValue || refMacdValue === 0) && macdValue > refMacdValue);

              _this2.renderBars(ctx, x, halfBarSpace, macdValue, isFill);
            };

            break;
          }

        case IndicatorType.VOL:
          {
            onRendering = function onRendering(x, i, kLineData, halfBarSpace) {
              var vol = kLineData.vol || {};
              var lineValues = [];
              params.forEach(function (p) {
                lineValues.push(vol["ma".concat(p)]);
              });

              _this2.prepareLinePoints(x, lineValues, linePoints);

              var refKLineData = _this2.dataProvider.dataList[i - 1] || {};
              var close = kLineData.close;
              var refClose = (refKLineData || {}).close || Number.MIN_SAFE_INTEGER;

              if (close > refClose) {
                ctx.fillStyle = indicator.increasingColor;
              } else {
                ctx.fillStyle = indicator.decreasingColor;
              }

              _this2.renderBars(ctx, x, halfBarSpace, vol.num, true);
            };

            break;
          }

        case IndicatorType.BOLL:
          {
            onRendering = function onRendering(x, i, kLineData, halfBarSpace) {
              _this2.ohlcIndicatorRendering(ctx, i, x, halfBarSpace, indicator, kLineData, indicatorType, ['up', 'mid', 'dn'], isMainIndicator, function (values) {
                _this2.prepareLinePoints(x, values, linePoints);
              });
            };

            break;
          }

        case IndicatorType.BIAS:
          {
            onRendering = function onRendering(x, i, kLineData) {
              var bias = kLineData.bias || {};
              var lineValues = [];
              params.forEach(function (p) {
                lineValues.push(bias["bias".concat(p)]);
              });

              _this2.prepareLinePoints(x, lineValues, linePoints);
            };

            break;
          }

        case IndicatorType.BRAR:
          {
            onRendering = function onRendering(x, i, kLineData) {
              var brar = kLineData.brar || {};

              _this2.prepareLinePoints(x, [brar.br, brar.ar], linePoints);
            };

            break;
          }

        case IndicatorType.CCI:
          {
            onRendering = function onRendering(x, i, kLineData) {
              var cci = kLineData.cci || {};

              _this2.prepareLinePoints(x, [cci.cci], linePoints);
            };

            break;
          }

        case IndicatorType.CR:
          {
            onRendering = function onRendering(x, i, kLineData) {
              var cr = kLineData.cr || {};

              _this2.prepareLinePoints(x, [cr.cr, cr.ma1, cr.ma2, cr.ma3, cr.ma4], linePoints);
            };

            break;
          }

        case IndicatorType.DMA:
          {
            onRendering = function onRendering(x, i, kLineData) {
              var dma = kLineData.dma || {};

              _this2.prepareLinePoints(x, [dma.dif, dma.difMa], linePoints);
            };

            break;
          }

        case IndicatorType.DMI:
          {
            onRendering = function onRendering(x, i, kLineData) {
              var dmi = kLineData.dmi || {};

              _this2.prepareLinePoints(x, [dmi.mdi, dmi.pdi, dmi.adx, dmi.adxr], linePoints);
            };

            break;
          }

        case IndicatorType.KDJ:
          {
            onRendering = function onRendering(x, i, kLineData) {
              var kdj = kLineData.kdj || {};

              _this2.prepareLinePoints(x, [kdj.k, kdj.d, kdj.j], linePoints);
            };

            break;
          }

        case IndicatorType.RSI:
          {
            onRendering = function onRendering(x, i, kLineData) {
              var rsi = kLineData.rsi || {};
              var lineValues = [];
              params.forEach(function (p) {
                lineValues.push(rsi["rsi".concat(p)]);
              });

              _this2.prepareLinePoints(x, lineValues, linePoints);
            };

            break;
          }

        case IndicatorType.PSY:
          {
            onRendering = function onRendering(x, i, kLineData) {
              var psy = kLineData.psy || {};

              _this2.prepareLinePoints(x, [psy.psy], linePoints);
            };

            break;
          }

        case IndicatorType.TRIX:
          {
            onRendering = function onRendering(x, i, kLineData) {
              var trix = kLineData.trix || {};

              _this2.prepareLinePoints(x, [trix.trix, trix.maTrix], linePoints);
            };

            break;
          }

        case IndicatorType.OBV:
          {
            onRendering = function onRendering(x, i, kLineData) {
              var obv = kLineData.obv || {};

              _this2.prepareLinePoints(x, [obv.obv, obv.maObv], linePoints);
            };

            break;
          }

        case IndicatorType.VR:
          {
            onRendering = function onRendering(x, i, kLineData) {
              var vr = kLineData.vr || {};

              _this2.prepareLinePoints(x, [vr.vr, vr.maVr], linePoints);
            };

            break;
          }

        case IndicatorType.WR:
          {
            onRendering = function onRendering(x, i, kLineData) {
              var wr = kLineData.wr || {};

              _this2.prepareLinePoints(x, [wr.wr1, wr.wr2, wr.wr3], linePoints);
            };

            break;
          }

        case IndicatorType.MTM:
          {
            onRendering = function onRendering(x, i, kLineData) {
              var mtm = kLineData.mtm || {};

              _this2.prepareLinePoints(x, [mtm.mtm, mtm.mtmMa], linePoints);
            };

            break;
          }

        case IndicatorType.EMV:
          {
            onRendering = function onRendering(x, i, kLineData) {
              var emv = kLineData.emv || {};

              _this2.prepareLinePoints(x, [emv.emv, emv.maEmv], linePoints);
            };

            break;
          }

        case IndicatorType.SAR:
          {
            onRendering = function onRendering(x, i, kLineData, halfBarSpace) {
              _this2.ohlcIndicatorRendering(ctx, i, x, halfBarSpace, indicator, kLineData, indicatorType, ['sar'], isMainIndicator, function (values) {
                var sar = values[0];

                if (sar || sar === 0) {
                  var dataY = _this2.yAxisRender.getY(sar);

                  if (sar < (kLineData.high + kLineData.low) / 2) {
                    ctx.strokeStyle = indicator.increasingColor;
                  } else {
                    ctx.strokeStyle = indicator.decreasingColor;
                  }

                  ctx.beginPath();
                  ctx.arc(x, dataY, halfBarSpace, Math.PI * 2, 0, true);
                  ctx.stroke();
                  ctx.closePath();
                }
              });
            };
          }
      }

      this.renderGraphics(ctx, onRendering, function () {
        _this2.renderLines(ctx, linePoints, indicator);
      });
    }
    /**
     * 需要绘制ohlc指标每条数据渲染
     * @param ctx
     * @param i
     * @param x
     * @param halfBarSpace
     * @param indicator
     * @param kLineData
     * @param indicatorType
     * @param dataKeys
     * @param isMainIndicator
     * @param prepare
     */

  }, {
    key: "ohlcIndicatorRendering",
    value: function ohlcIndicatorRendering(ctx, i, x, halfBarSpace, indicator, kLineData, indicatorType, dataKeys, isMainIndicator, prepare) {
      var indicatorData = kLineData[indicatorType.toLowerCase()] || {};
      var values = [];
      dataKeys.forEach(function (key) {
        values.push(indicatorData[key]);
      });

      if (prepare) {
        prepare(values);
      }

      if (!isMainIndicator) {
        var refKLineData = this.dataProvider.dataList[i - 1] || {};
        this.renderOhlc(ctx, halfBarSpace, x, kLineData, refKLineData, indicator.increasingColor, indicator.decreasingColor);
      }
    }
    /**
     * 绘制图形
     */

  }, {
    key: "renderGraphics",
    value: function renderGraphics(ctx, onRendering, onRenderEnd) {
      var startX = this.viewPortHandler.contentLeft();
      var dataSpace = this.dataProvider.dataSpace * (1 - DATA_MARGIN_SPACE_RATE);
      var halfBarSpace = dataSpace / 2;
      var lastPos = Math.min(this.dataProvider.dataList.length, this.dataProvider.minPos + this.dataProvider.range);

      for (var i = this.dataProvider.minPos; i < lastPos; i++) {
        var endX = startX + dataSpace;
        var x = (startX + endX) / 2;
        var kLineData = this.dataProvider.dataList[i];

        if (onRendering) {
          onRendering(x, i, kLineData, halfBarSpace);
        }

        startX += this.dataProvider.dataSpace;
      }

      if (onRenderEnd) {
        onRenderEnd();
      }
    }
    /**
     * 准备绘制线的数据
     * @param x
     * @param lineValues
     * @param linePoints
     */

  }, {
    key: "prepareLinePoints",
    value: function prepareLinePoints(x, lineValues, linePoints) {
      for (var i = 0; i < lineValues.length; i++) {
        var value = lineValues[i];
        var valueY = this.yAxisRender.getY(value);

        if (!linePoints[i]) {
          linePoints[i] = [{
            x: x,
            y: valueY
          }];
        } else {
          linePoints[i].push({
            x: x,
            y: valueY
          });
        }
      }
    }
    /**
     * 绘制线
     * @param ctx
     * @param linePoints
     * @param indicator
     */

  }, {
    key: "renderLines",
    value: function renderLines(ctx, linePoints, indicator) {
      var colors = indicator.lineColors;
      var pointCount = linePoints.length;
      var lineColorSize = (indicator.lineColors || []).length;
      ctx.lineWidth = indicator.lineSize;

      for (var i = 0; i < pointCount; i++) {
        var points = linePoints[i];

        if (points.length > 0) {
          ctx.strokeStyle = colors[i % lineColorSize];
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);

          for (var j = 1; j < points.length; j++) {
            ctx.lineTo(points[j].x, points[j].y);
          }

          ctx.stroke();
          ctx.closePath();
        }
      }
    }
    /**
     * 绘制柱状图
     * @param ctx
     * @param x
     * @param halfBarSpace
     * @param barData
     * @param isFill
     */

  }, {
    key: "renderBars",
    value: function renderBars(ctx, x, halfBarSpace, barData, isFill) {
      if (barData || barData === 0) {
        ctx.lineWidth = 1;
        var dataY = this.yAxisRender.getY(barData);
        var zeroY = this.yAxisRender.getY(0);
        var y = dataY;

        if (barData < 0) {
          y = zeroY;
        }

        if (isFill) {
          ctx.fillRect(x - halfBarSpace, y, halfBarSpace * 2, Math.abs(zeroY - dataY));
        } else {
          ctx.strokeRect(x - halfBarSpace, y, halfBarSpace * 2, Math.abs(zeroY - dataY));
        }
      }
    }
    /**
     * 绘制ohlc
     * @param ctx
     * @param halfBarSpace
     * @param x
     * @param kLineData
     * @param refKLineData
     * @param increasingColor
     * @param decreasingColor
     */

  }, {
    key: "renderOhlc",
    value: function renderOhlc(ctx, halfBarSpace, x, kLineData, refKLineData, increasingColor, decreasingColor) {
      var openY = this.yAxisRender.getY(kLineData.open);
      var closeY = this.yAxisRender.getY(kLineData.close);
      var highY = this.yAxisRender.getY(kLineData.high);
      var lowY = this.yAxisRender.getY(kLineData.low);

      if (kLineData.close > refKLineData.close) {
        ctx.strokeStyle = increasingColor;
      } else {
        ctx.strokeStyle = decreasingColor;
      }

      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();
      ctx.closePath();
      ctx.beginPath();
      ctx.moveTo(x - halfBarSpace, openY);
      ctx.lineTo(x, openY);
      ctx.stroke();
      ctx.closePath();
      ctx.beginPath();
      ctx.moveTo(x + halfBarSpace, closeY);
      ctx.lineTo(x, closeY);
      ctx.stroke();
      ctx.closePath();
    }
  }]);

  return IndicatorRender;
}(Render);

function nice(value) {
  var exponent = Math.floor(Math.log(value) / Math.log(10.0));
  var exp10 = Math.pow(10.0, exponent);
  var f = value / exp10; // 1 <= f < 10

  var nf = 0;

  if (f < 1) {
    nf = 1;
  } else if (f < 2) {
    nf = 2;
  } else if (f < 3) {
    nf = 3;
  } else if (f < 5) {
    nf = 5;
  } else {
    nf = 10;
  }

  value = nf * exp10;
  return exponent >= -20 ? +value.toFixed(exponent < 0 ? -exponent : 0) : value;
}
function getIntervalPrecision(value) {
  var str = value.toString(); // Consider scientific notation: '3.4e-12' '3.4e+12'

  var eIndex = str.indexOf('e');

  if (eIndex > 0) {
    var precision = +str.slice(eIndex + 1);
    return precision < 0 ? -precision : 0;
  } else {
    var dotIndex = str.indexOf('.');
    return dotIndex < 0 ? 0 : str.length - 1 - dotIndex;
  }
}
function round(x, precision) {
  if (precision == null) {
    precision = 10;
  } // Avoid range error


  precision = Math.min(Math.max(0, precision), 20);
  x = (+x).toFixed(precision);
  return x;
}
/**
 * 格式化精度
 */

function formatPrecision(value) {
  var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  var v = +value;

  if ((v || v === 0) && isNumber(v)) {
    return value.toFixed(precision);
  }

  return "".concat(v);
}
/**
 * 格式化大数据
 * @param value
 */

function formatBigNumber(value) {
  if (isNumber(value)) {
    if (value > 50000) {
      return "".concat(+(value / 1000).toFixed(1), "K");
    }

    if (value > 5000000) {
      return "".concat(+(value / 1000000).toFixed(3), "M");
    }

    return "".concat(value);
  }

  return '--';
}

var AxisRender =
/*#__PURE__*/
function (_Render) {
  _inherits(AxisRender, _Render);

  function AxisRender(viewPortHandler, dataProvider) {
    var _this;

    _classCallCheck(this, AxisRender);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AxisRender).call(this, viewPortHandler, dataProvider));
    _this.axisMaximum = 0;
    _this.axisMinimum = 0;
    _this.axisRange = 0;
    _this.values = [];
    return _this;
  }
  /**
   * 计算轴上的值
   * @param min
   * @param max
   * @param splitNumber
   * @param axis
   */


  _createClass(AxisRender, [{
    key: "computeAxisValues",
    value: function computeAxisValues(min, max) {
      var splitNumber = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 6.0;
      var axis = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      var span = this.calcRange(max, min);

      if (span < 0) {
        this.values = [];
        return;
      }

      if (this.isFillChart()) {
        var interval = +nice(span / splitNumber);
        var precision = getIntervalPrecision(interval);
        var first = +round(Math.ceil(min / interval) * interval, precision);
        var last = +round(Math.floor(max / interval) * interval, precision);
        var n = 0;
        var f = first;

        if (interval !== 0) {
          while (f <= +last) {
            ++n;
            f += interval;
          }
        }

        this.values = [];
        f = first;

        for (var i = 0; i < n; i++) {
          this.values[i] = +f.toFixed(precision);
          f += interval;
        }
      } else {
        this.fixComputeAxisValues(axis);
      }
    }
    /**
     * 计算range
     * @param max
     * @param min
     * @returns {number}
     */

  }, {
    key: "calcRange",
    value: function calcRange(max, min) {
      return Math.abs(max - min);
    }
    /**
     * 是否数据会超过整个绘制区域
     * @return Boolean
     */

  }, {
    key: "isFillChart",
    value: function isFillChart() {
      return true;
    }
  }, {
    key: "fixComputeAxisValues",
    value: function fixComputeAxisValues() {}
  }]);

  return AxisRender;
}(Render);

var YAxisRender =
/*#__PURE__*/
function (_AxisRender) {
  _inherits(YAxisRender, _AxisRender);

  function YAxisRender() {
    _classCallCheck(this, YAxisRender);

    return _possibleConstructorReturn(this, _getPrototypeOf(YAxisRender).apply(this, arguments));
  }

  _createClass(YAxisRender, [{
    key: "renderStrokeLine",

    /**
     * 绘制边框线
     * @param ctx
     * @param yAxis
     * @param display
     */
    value: function renderStrokeLine(ctx, yAxis, display) {
      if (!display) {
        return;
      }

      ctx.strokeStyle = yAxis.line.color;
      ctx.lineWidth = yAxis.line.size;
      var x = this.viewPortHandler.contentLeft();

      if (yAxis.position === YAxisPosition.LEFT) {
        x = this.viewPortHandler.contentRight();
      }

      ctx.beginPath();
      ctx.moveTo(x, this.viewPortHandler.contentTop());
      ctx.lineTo(x, this.viewPortHandler.contentBottom());
      ctx.stroke();
      ctx.closePath();
    }
    /**
     * 绘制轴线
     * @param ctx
     * @param yAxis
     */

  }, {
    key: "renderAxisLine",
    value: function renderAxisLine(ctx, yAxis) {
      if (!yAxis.display || !yAxis.line.display) {
        return;
      }

      ctx.strokeStyle = yAxis.line.color;
      ctx.lineWidth = yAxis.line.size;
      ctx.beginPath();

      if (yAxis.position === YAxisPosition.LEFT) {
        ctx.moveTo(this.viewPortHandler.contentLeft(), this.viewPortHandler.contentTop());
        ctx.lineTo(this.viewPortHandler.contentLeft(), this.viewPortHandler.contentBottom());
      } else {
        ctx.moveTo(this.viewPortHandler.contentRight(), this.viewPortHandler.contentTop());
        ctx.lineTo(this.viewPortHandler.contentRight(), this.viewPortHandler.contentBottom());
      }

      ctx.stroke();
      ctx.closePath();
    }
    /**
     * 绘制y轴上文字
     * @param ctx
     * @param yAxis
     */

  }, {
    key: "renderAxisLabels",
    value: function renderAxisLabels(ctx, yAxis) {
      var tickText = yAxis.tick.text;

      if (!yAxis.display || !tickText.display) {
        return;
      }

      var tickLine = yAxis.tick.line;
      var tickTextPosition = tickText.position;
      var tickLineDisplay = tickLine.display;
      var tickLineLength = tickLine.length;
      var tickTextMargin = tickText.margin;
      var initX;

      if (yAxis.position === YAxisPosition.LEFT) {
        if (tickTextPosition === YAxisTextPosition.OUTSIDE) {
          if (tickLineDisplay) {
            initX = this.viewPortHandler.contentLeft() - tickLineLength - tickTextMargin;
          } else {
            initX = this.viewPortHandler.contentLeft() - tickTextMargin;
          }
        } else {
          if (tickLineDisplay) {
            initX = this.viewPortHandler.contentLeft() + tickLineLength + tickTextMargin;
          } else {
            initX = this.viewPortHandler.contentLeft() + tickTextMargin;
          }
        }
      } else {
        if (tickTextPosition === YAxisTextPosition.OUTSIDE) {
          if (tickLineDisplay) {
            initX = this.viewPortHandler.contentRight() + tickLineLength + tickTextMargin;
          } else {
            initX = this.viewPortHandler.contentRight() + tickTextMargin;
          }
        } else {
          if (tickLineDisplay) {
            initX = this.viewPortHandler.contentRight() - tickLineLength - tickTextMargin;
          } else {
            initX = this.viewPortHandler.contentRight() - tickTextMargin;
          }
        }
      }

      var textSize = tickText.size;
      ctx.textBaseline = 'middle';
      ctx.font = getFont(textSize);
      ctx.fillStyle = tickText.color;

      for (var i = 0; i < this.values.length; i++) {
        var labelY = this.getY(this.values[i]);
        var text = formatBigNumber(this.values[i]);

        if (this.checkShowLabel(labelY, textSize)) {
          if (yAxis.position === YAxisPosition.LEFT && tickTextPosition === YAxisTextPosition.OUTSIDE || yAxis.position === YAxisPosition.RIGHT && tickTextPosition !== YAxisTextPosition.OUTSIDE) {
            ctx.textAlign = 'right';
          } else {
            ctx.textAlign = 'left';
          }

          ctx.fillText(text, initX, labelY);
        }
      }

      ctx.textAlign = 'left';
    }
    /**
     * 绘制y轴分割线
     * @param ctx
     * @param yAxis
     */

  }, {
    key: "renderSeparatorLines",
    value: function renderSeparatorLines(ctx, yAxis) {
      var separatorLine = yAxis.separatorLine;

      if (!yAxis.display || !separatorLine.display) {
        return;
      }

      ctx.strokeStyle = separatorLine.color;
      ctx.lineWidth = separatorLine.size;
      var labelHeight = yAxis.tick.text.size;

      if (separatorLine.style === LineStyle.DASH) {
        ctx.setLineDash(separatorLine.dashValue);
      }

      for (var i = 0; i < this.values.length; i++) {
        var y = this.getY(this.values[i]);

        if (this.checkShowLabel(y, labelHeight)) {
          ctx.beginPath();
          ctx.moveTo(this.viewPortHandler.contentLeft(), y);
          ctx.lineTo(this.viewPortHandler.contentRight(), y);
          ctx.stroke();
          ctx.closePath();
        }
      }

      ctx.setLineDash([]);
    }
    /**
     * 绘制刻度线
     * @param ctx
     * @param yAxis
     */

  }, {
    key: "renderTickLines",
    value: function renderTickLines(ctx, yAxis) {
      var tickText = yAxis.tick.text;

      if (!yAxis.display || !tickText.display) {
        return;
      }

      var tickLine = yAxis.tick.line;
      ctx.lineWidth = tickLine.size;
      ctx.strokeStyle = tickLine.color;
      var labelHeight = tickText.size;
      var tickLineLength = tickLine.length;
      var startX;
      var endX;
      var tickTextPosition = tickText.position;

      if (yAxis.position === YAxisPosition.LEFT) {
        startX = this.viewPortHandler.contentLeft();

        if (tickTextPosition === YAxisTextPosition.OUTSIDE) {
          endX = startX - tickLineLength;
        } else {
          endX = startX + tickLineLength;
        }
      } else {
        startX = this.viewPortHandler.contentRight();

        if (tickTextPosition === YAxisTextPosition.OUTSIDE) {
          endX = startX + tickLineLength;
        } else {
          endX = startX - tickLineLength;
        }
      }

      for (var i = 0; i < this.values.length; i++) {
        var y = this.getY(this.values[i]);

        if (this.checkShowLabel(y, labelHeight)) {
          ctx.beginPath();
          ctx.moveTo(startX, y);
          ctx.lineTo(endX, y);
          ctx.stroke();
          ctx.closePath();
        }
      }
    }
    /**
     * 检查是否需要真正显示label及tick线 分割线
     * @param y
     * @param labelHeight
     */

  }, {
    key: "checkShowLabel",
    value: function checkShowLabel(y, labelHeight) {
      return y > this.viewPortHandler.contentTop() + labelHeight && y < this.viewPortHandler.contentBottom() - labelHeight;
    }
  }, {
    key: "calcAxisMinMax",
    value: function calcAxisMinMax(indicatorType) {
      var isMainChart = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var isRealTimeChart = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var isShowAverageLine = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var dataList = this.dataProvider.dataList;
      var min = this.dataProvider.minPos;
      var max = Math.min(min + this.dataProvider.range, dataList.length);
      var minMaxArray = [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER];

      if (isRealTimeChart) {
        for (var i = min; i < max; i++) {
          var kLineData = dataList[i];
          var minCompareArray = [kLineData.close, minMaxArray[0]];
          var maxCompareArray = [kLineData.close, minMaxArray[1]];

          if (isShowAverageLine) {
            minCompareArray.push(kLineData.average);
            maxCompareArray.push(kLineData.average);
          }

          minMaxArray[0] = Math.min.apply(null, minCompareArray);
          minMaxArray[1] = Math.max.apply(null, maxCompareArray);
        }
      } else {
        for (var _i = min; _i < max; _i++) {
          var _kLineData = dataList[_i];
          this.compareMinMax(_kLineData, indicatorType, minMaxArray);

          if (isMainChart) {
            minMaxArray[0] = Math.min(_kLineData.low, minMaxArray[0]);
            minMaxArray[1] = Math.max(_kLineData.high, minMaxArray[1]);
          }
        }
      }

      if (minMaxArray[0] !== Number.MAX_SAFE_INTEGER && minMaxArray[1] !== Number.MIN_SAFE_INTEGER) {
        this.axisMinimum = minMaxArray[0];
        this.axisMaximum = minMaxArray[1];
      }
    }
  }, {
    key: "compareMinMax",
    value: function compareMinMax(kLineData, indicatorType, minMaxArray) {
      var indicatorData = formatValue(kLineData, indicatorType.toLowerCase(), {});
      Object.keys(indicatorData).forEach(function (key) {
        var value = indicatorData[key];

        if (value || value === 0) {
          minMaxArray[0] = Math.min(minMaxArray[0], value);
          minMaxArray[1] = Math.max(minMaxArray[1], value);
        }
      });

      if (indicatorType === IndicatorType.BOLL || indicatorType === IndicatorType.SAR) {
        minMaxArray[0] = Math.min(minMaxArray[0], kLineData.low);
        minMaxArray[1] = Math.max(minMaxArray[1], kLineData.high);
      }

      return minMaxArray;
    }
  }, {
    key: "computeAxis",
    value: function computeAxis() {
      var min = this.axisMinimum;
      var max = this.axisMaximum;

      if (min === Number.MAX_SAFE_INTEGER || max === Number.MIN_SAFE_INTEGER || max === 0 && min === 0) {
        return;
      }

      var range = Math.abs(max - min);

      if (range === 0) {
        max += 1;
        min -= 1;
        range = Math.abs(max - min);
      }

      this.axisMinimum = min - range / 100.0 * 10.0;
      this.axisMaximum = max + range / 100.0 * 20.0;
      this.axisRange = Math.abs(this.axisMaximum - this.axisMinimum);
      this.computeAxisValues(this.axisMinimum, this.axisMaximum);
    }
  }, {
    key: "getY",
    value: function getY(value) {
      return (1.0 - (value - this.axisMinimum) / this.axisRange) * (this.viewPortHandler.contentBottom() - this.viewPortHandler.contentTop());
    }
  }, {
    key: "getValue",
    value: function getValue(y) {
      return (1.0 - y / (this.viewPortHandler.contentBottom() - this.viewPortHandler.contentTop())) * this.axisRange + this.axisMinimum;
    }
  }]);

  return YAxisRender;
}(AxisRender);

var IndicatorChart =
/*#__PURE__*/
function (_Chart) {
  _inherits(IndicatorChart, _Chart);

  function IndicatorChart(dom, style, dataProvider, indicatorParams) {
    var _this;

    var defaultIndicatorType = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : IndicatorType.MACD;

    _classCallCheck(this, IndicatorChart);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(IndicatorChart).call(this, dom, style));
    _this.indicatorParams = indicatorParams;
    _this.indicatorType = defaultIndicatorType;
    _this.yAxisRender = new YAxisRender(_this.viewPortHandler, dataProvider);
    _this.chartRender = new IndicatorRender(_this.viewPortHandler, dataProvider, _this.yAxisRender);
    return _this;
  }

  _createClass(IndicatorChart, [{
    key: "draw",
    value: function draw() {
      if (this.isDrawChart()) {
        var isMainChart = this.isMainChart();

        if (!isMainChart) {
          this.chartRender.renderHorizontalSeparatorLine(this.ctx, this.style.xAxis);
        }

        var yAxis = this.style.yAxis;
        var isRealTimeChart = this.isRealTimeChart();
        this.yAxisRender.calcAxisMinMax(this.indicatorType, isMainChart, isRealTimeChart, this.style.realTime.averageLine.display);
        this.yAxisRender.computeAxis();
        this.yAxisRender.renderSeparatorLines(this.ctx, yAxis);
        this.drawChart();
        this.yAxisRender.renderStrokeLine(this.ctx, yAxis, this.style.grid);
        this.yAxisRender.renderAxisLine(this.ctx, yAxis);
        this.yAxisRender.renderTickLines(this.ctx, yAxis);
        this.yAxisRender.renderAxisLabels(this.ctx, yAxis);
      }
    }
  }, {
    key: "drawChart",
    value: function drawChart() {
      this.chartRender.renderIndicator(this.ctx, this.indicatorType, this.style.indicator, this.indicatorParams, false);
    }
  }, {
    key: "isDrawChart",
    value: function isDrawChart() {
      return this.indicatorType !== IndicatorType.NO;
    }
  }, {
    key: "isMainChart",
    value: function isMainChart() {
      return false;
    }
  }, {
    key: "isRealTimeChart",
    value: function isRealTimeChart() {
      return false;
    }
  }]);

  return IndicatorChart;
}(Chart);

var MainRender =
/*#__PURE__*/
function (_IndicatorRender) {
  _inherits(MainRender, _IndicatorRender);

  function MainRender() {
    _classCallCheck(this, MainRender);

    return _possibleConstructorReturn(this, _getPrototypeOf(MainRender).apply(this, arguments));
  }

  _createClass(MainRender, [{
    key: "renderCandle",

    /**
     * 渲染蜡烛图
     * @param ctx
     * @param candle
     * @param pricePrecision
     */
    value: function renderCandle(ctx, candle, pricePrecision) {
      var _this = this;

      ctx.lineWidth = 1;
      var rect = [];
      var markHighestPrice = Number.MIN_SAFE_INTEGER;
      var markHighestPriceX = -1;
      var markLowestPrice = Number.MAX_SAFE_INTEGER;
      var markLowestPriceX = -1;
      var dataList = this.dataProvider.dataList;

      var onRendering = function onRendering(x, i, kLineData, halfBarSpace) {
        var refKLineData = dataList[i - 1] || {};
        var refClose = refKLineData.close || Number.MIN_SAFE_INTEGER;
        var high = kLineData.high;
        var low = kLineData.low;
        var close = kLineData.close;
        var open = kLineData.open;

        if (markHighestPrice < high) {
          markHighestPrice = high;
          markHighestPriceX = x;
        }

        if (low < markLowestPrice) {
          markLowestPrice = low;
          markLowestPriceX = x;
        }

        if (close > refClose) {
          ctx.strokeStyle = candle.increasingColor;
          ctx.fillStyle = candle.increasingColor;
        } else {
          ctx.strokeStyle = candle.decreasingColor;
          ctx.fillStyle = candle.decreasingColor;
        }

        if (candle.style !== CandleStyle.OHLC) {
          var openY = _this.yAxisRender.getY(open);

          var closeY = _this.yAxisRender.getY(close);

          var highY = _this.yAxisRender.getY(high);

          var lowY = _this.yAxisRender.getY(low);

          var highLine = [];
          var lowLine = [];
          highLine[0] = highY;
          lowLine[1] = lowY;

          if (openY > closeY) {
            highLine[1] = closeY;
            lowLine[0] = openY;
            rect = [x - halfBarSpace, closeY, halfBarSpace * 2, openY - closeY];
          } else if (openY < closeY) {
            highLine[1] = openY;
            lowLine[0] = closeY;
            rect = [x - halfBarSpace, openY, halfBarSpace * 2, closeY - openY];
          } else {
            highLine[1] = openY;
            lowLine[0] = closeY;
            rect = [x - halfBarSpace, openY, halfBarSpace * 2, 1];
          }

          ctx.beginPath();
          ctx.moveTo(x, highLine[0]);
          ctx.lineTo(x, highLine[1]);
          ctx.stroke();
          ctx.closePath();
          ctx.beginPath();
          ctx.moveTo(x, lowLine[0]);
          ctx.lineTo(x, lowLine[1]);
          ctx.stroke();
          ctx.closePath();

          if (rect[3] < 1) {
            rect[3] = 1;
          }

          switch (candle.style) {
            case CandleStyle.SOLID:
              {
                ctx.fillRect(rect[0], rect[1], rect[2], rect[3]);
                break;
              }

            case CandleStyle.STROKE:
              {
                ctx.strokeRect(rect[0], rect[1], rect[2], rect[3]);
                break;
              }

            case CandleStyle.INCREASING_STROKE:
              {
                if (close > refClose) {
                  ctx.strokeRect(rect[0], rect[1], rect[2], rect[3]);
                } else {
                  ctx.fillRect(rect[0], rect[1], rect[2], rect[3]);
                }

                break;
              }

            case CandleStyle.DECREASING_STROKE:
              {
                if (close > refClose) {
                  ctx.fillRect(rect[0], rect[1], rect[2], rect[3]);
                } else {
                  ctx.strokeRect(rect[0], rect[1], rect[2], rect[3]);
                }

                break;
              }
          }
        } else {
          _this.renderOhlc(ctx, halfBarSpace, x, kLineData, refKLineData, candle.increasingColor, candle.decreasingColor);
        }
      };

      this.renderGraphics(ctx, onRendering);
      this.highestMarkData = {
        x: markHighestPriceX,
        price: markHighestPrice
      };
      this.lowestMarkData = {
        x: markLowestPriceX,
        price: markLowestPrice
      };
    }
    /**
     * 渲染最高价标记
     * @param ctx
     * @param highestPriceMark
     * @param pricePrecision
     */

  }, {
    key: "renderHighestPriceMark",
    value: function renderHighestPriceMark(ctx, highestPriceMark, pricePrecision) {
      var price = this.highestMarkData.price;

      if (price === Number.MIN_SAFE_INTEGER || !highestPriceMark.display) {
        return;
      }

      this.renderLowestHighestPriceMark(ctx, highestPriceMark, this.highestMarkData.x, price, true, pricePrecision);
    }
    /**
     * 绘制最低价标记
     * @param ctx
     * @param lowestPriceMark
     * @param pricePrecision
     */

  }, {
    key: "renderLowestPriceMark",
    value: function renderLowestPriceMark(ctx, lowestPriceMark, pricePrecision) {
      var price = this.lowestMarkData.price;

      if (price === Number.MAX_SAFE_INTEGER || !lowestPriceMark.display) {
        return;
      }

      this.renderLowestHighestPriceMark(ctx, lowestPriceMark, this.lowestMarkData.x, price, false, pricePrecision);
    }
    /**
     * 渲染最高最低价格标记
     * @param ctx
     * @param priceMark
     * @param x
     * @param price
     * @param isHigh
     * @param pricePrecision
     */

  }, {
    key: "renderLowestHighestPriceMark",
    value: function renderLowestHighestPriceMark(ctx, priceMark, x, price, isHigh, pricePrecision) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, this.viewPortHandler.contentRight() - this.viewPortHandler.contentLeft(), this.viewPortHandler.contentBottom() - this.viewPortHandler.contentTop());
      ctx.closePath();
      ctx.clip();
      var priceY = this.yAxisRender.getY(price);
      var startX = x;
      var startY = priceY + (isHigh ? -2 : 2);
      ctx.textAlign = 'left';
      ctx.lineWidth = 1;
      ctx.strokeStyle = priceMark.color;
      ctx.fillStyle = priceMark.color;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(startX - 2, startY + (isHigh ? -2 : 2));
      ctx.stroke();
      ctx.closePath();
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(startX + 2, startY + (isHigh ? -2 : 2));
      ctx.stroke();
      ctx.closePath(); // 绘制竖线

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      startY = startY + (isHigh ? -5 : 5);
      ctx.lineTo(startX, startY);
      ctx.stroke();
      ctx.closePath();
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(startX + 5, startY);
      ctx.stroke();
      ctx.closePath();
      ctx.font = getFont(priceMark.text.size);
      var text = formatPrecision(price, pricePrecision);
      ctx.textBaseline = 'middle';
      ctx.fillText(text, startX + 5 + priceMark.text.margin, startY);
      ctx.restore();
    }
    /**
     * 绘制最新价标记
     * @param ctx
     * @param lastPriceMark
     * @param isRenderTextLeft
     * @param isRenderTextOutside
     * @param pricePrecision
     */

  }, {
    key: "renderLastPriceMark",
    value: function renderLastPriceMark(ctx, lastPriceMark, isRenderTextLeft, isRenderTextOutside, pricePrecision) {
      var dataSize = this.dataProvider.dataList.length;

      if (!lastPriceMark.display || dataSize === 0) {
        return;
      }

      var preKLineData = this.dataProvider.dataList[dataSize - 2] || {};
      var preLastPrice = preKLineData.close || Number.MIN_SAFE_INTEGER;
      var lastPrice = this.dataProvider.dataList[dataSize - 1].close;
      var priceY = this.yAxisRender.getY(lastPrice);
      var height = this.viewPortHandler.contentBottom() - this.viewPortHandler.contentTop();
      priceY = +Math.max(height * 0.05, Math.min(priceY, height * 0.98)).toFixed(0);
      var color = lastPrice > preLastPrice ? lastPriceMark.increasingColor : lastPriceMark.decreasingColor;
      var lineStartX = this.viewPortHandler.contentLeft();
      var lineEndX = this.viewPortHandler.contentRight();
      var priceMarkText = lastPriceMark.text;
      var displayText = priceMarkText.display;

      if (displayText) {
        var text = formatPrecision(lastPrice, pricePrecision);
        var textSize = lastPriceMark.text.size;
        var rectWidth = calcTextWidth(textSize, text) + priceMarkText.paddingLeft + priceMarkText.paddingRight;
        var rectHeight = priceMarkText.paddingTop + textSize + priceMarkText.paddingBottom;
        var rectStartX;

        if (isRenderTextOutside) {
          if (isRenderTextLeft) {
            rectStartX = lineStartX - rectWidth;
          } else {
            rectStartX = lineEndX;
          }
        } else {
          if (isRenderTextLeft) {
            rectStartX = lineStartX;
            lineStartX += rectWidth;
          } else {
            rectStartX = lineEndX - rectWidth;
            lineEndX = rectStartX;
          }
        }

        ctx.fillStyle = color;
        ctx.fillRect(rectStartX, priceY - priceMarkText.paddingTop - textSize / 2, rectWidth, rectHeight);
        ctx.fillStyle = priceMarkText.color;
        ctx.font = getFont(textSize);
        ctx.textBaseline = 'middle';
        ctx.fillText(text, rectStartX + priceMarkText.paddingLeft, priceY);
      }

      var priceMarkLine = lastPriceMark.line;

      if (priceMarkLine.display) {
        ctx.strokeStyle = color;
        ctx.lineWidth = priceMarkLine.size;

        if (priceMarkLine.style === LineStyle.DASH) {
          ctx.setLineDash(priceMarkLine.dashValue);
        }

        ctx.beginPath();
        ctx.moveTo(lineStartX, priceY);
        ctx.lineTo(lineEndX, priceY);
        ctx.stroke();
        ctx.closePath();
        ctx.setLineDash([]);
      }
    }
    /**
     * 绘制分时线
     * @param ctx
     * @param realTime
     */

  }, {
    key: "renderTimeLine",
    value: function renderTimeLine(ctx, realTime) {
      var _this2 = this;

      var timeLinePoints = [];
      var timeLineAreaPoints = [{
        x: this.viewPortHandler.contentLeft(),
        y: this.viewPortHandler.contentBottom()
      }];
      var averageLinePoints = [];
      var minPos = this.dataProvider.minPos;
      var range = this.dataProvider.range;
      var dataSize = this.dataProvider.dataList.length;

      var onRendering = function onRendering(x, i, kLineData) {
        var average = kLineData.average;

        var closeY = _this2.yAxisRender.getY(kLineData.close);

        var averageY = _this2.yAxisRender.getY(average);

        timeLinePoints.push({
          x: x,
          y: closeY
        });

        if (average || average === 0) {
          averageLinePoints.push({
            x: x,
            y: averageY
          });
        }

        if (i === minPos) {
          timeLineAreaPoints.push({
            x: _this2.viewPortHandler.contentLeft(),
            y: closeY
          });
          timeLineAreaPoints.push({
            x: x,
            y: closeY
          });
        } else if (i === minPos + range - 1) {
          timeLineAreaPoints.push({
            x: x,
            y: closeY
          });
          timeLineAreaPoints.push({
            x: _this2.viewPortHandler.contentRight(),
            y: closeY
          });
          timeLineAreaPoints.push({
            x: _this2.viewPortHandler.contentRight(),
            y: _this2.viewPortHandler.contentBottom()
          });
        } else if (i === dataSize - 1) {
          timeLineAreaPoints.push({
            x: x,
            y: closeY
          });
          timeLineAreaPoints.push({
            x: x,
            y: _this2.viewPortHandler.contentBottom()
          });
        } else {
          timeLineAreaPoints.push({
            x: x,
            y: closeY
          });
        }
      };

      var onRenderEnd = function onRenderEnd() {
        var timeLine = realTime.timeLine;

        if (timeLinePoints.length > 0) {
          // 绘制分时线
          ctx.lineWidth = timeLine.size;
          ctx.strokeStyle = timeLine.color;
          ctx.beginPath();
          ctx.moveTo(timeLinePoints[0].x, timeLinePoints[0].y);

          for (var i = 1; i < timeLinePoints.length; i++) {
            ctx.lineTo(timeLinePoints[i].x, timeLinePoints[i].y);
          }

          ctx.stroke();
          ctx.closePath();
        }

        if (timeLineAreaPoints.length > 0) {
          // 绘制分时线填充区域
          ctx.fillStyle = timeLine.areaFillColor;
          ctx.beginPath();
          ctx.moveTo(timeLineAreaPoints[0].x, timeLineAreaPoints[0].y);

          for (var _i = 1; _i < timeLineAreaPoints.length; _i++) {
            ctx.lineTo(timeLineAreaPoints[_i].x, timeLineAreaPoints[_i].y);
          }

          ctx.closePath();
          ctx.fill();
        }

        var averageLine = realTime.averageLine;

        if (averageLine.display && averageLinePoints.length > 0) {
          // 绘制均线
          ctx.lineWidth = averageLine.size;
          ctx.strokeStyle = averageLine.color;
          ctx.beginPath();
          ctx.moveTo(averageLinePoints[0].x, averageLinePoints[0].y);

          for (var _i2 = 1; _i2 < averageLinePoints.length; _i2++) {
            ctx.lineTo(averageLinePoints[_i2].x, averageLinePoints[_i2].y);
          }

          ctx.stroke();
          ctx.closePath();
        }
      };

      this.renderGraphics(ctx, onRendering, onRenderEnd);
    }
  }]);

  return MainRender;
}(IndicatorRender);

var MainChart =
/*#__PURE__*/
function (_IndicatorChart) {
  _inherits(MainChart, _IndicatorChart);

  function MainChart(dom, style, dataProvider, indicatorParams, precision) {
    var _this;

    _classCallCheck(this, MainChart);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MainChart).call(this, dom, style, dataProvider, indicatorParams, IndicatorType.MA));
    _this.chartRender = new MainRender(_this.viewPortHandler, dataProvider, _this.yAxisRender);
    _this.precision = precision;
    _this.chartType = ChartType.CANDLE;
    return _this;
  }

  _createClass(MainChart, [{
    key: "draw",
    value: function draw() {
      _get(_getPrototypeOf(MainChart.prototype), "draw", this).call(this);

      this.chartRender.renderLastPriceMark(this.ctx, this.style.lastPriceMark, this.style.yAxis.position === YAxisPosition.LEFT, this.style.yAxis.tick.text.position === YAxisTextPosition.OUTSIDE, this.precision.pricePrecision);
    }
  }, {
    key: "drawChart",
    value: function drawChart() {
      if (this.chartType !== ChartType.REAL_TIME) {
        this.chartRender.renderCandle(this.ctx, this.style.candle, this.precision.pricePrecision);
        this.chartRender.renderIndicator(this.ctx, this.indicatorType, this.style.indicator, this.indicatorParams, true);
        this.chartRender.renderHighestPriceMark(this.ctx, this.style.highestPriceMark, this.precision.pricePrecision);
        this.chartRender.renderLowestPriceMark(this.ctx, this.style.lowestPriceMark, this.precision.pricePrecision);
      } else {
        this.chartRender.renderTimeLine(this.ctx, this.style.realTime);
      }
    }
  }, {
    key: "isRealTimeChart",
    value: function isRealTimeChart() {
      return this.chartType === ChartType.REAL_TIME;
    }
  }, {
    key: "isDrawChart",
    value: function isDrawChart() {
      return true;
    }
  }, {
    key: "isMainChart",
    value: function isMainChart() {
      return true;
    }
  }]);

  return MainChart;
}(IndicatorChart);

/**
 * 获取某点在两点决定的一次函数上的y值
 * @param point1
 * @param point2
 * @param targetPoints
 */
function getLinearY(point1, point2, targetPoints) {
  var v = [];

  if (point1 && point2 && targetPoints.length > 0) {
    var subX = point1.x - point2.x;

    if (subX === 0) {
      targetPoints.forEach(function (point) {
        v.push(point.y);
      });
    } else {
      var k = (point1.y - point2.y) / subX;
      var b = point1.y - k * point1.x;
      targetPoints.forEach(function (point) {
        v.push(point.x * k + b);
      });
    }
  }

  return v;
}
/**
 * 点是否在线上
 * @param point1
 * @param point2
 * @param targetPoint
 */

function checkPointOnStraightLine(point1, point2, targetPoint) {
  if (!targetPoint || !point1 || !point2) {
    return false;
  }

  if (point1.x === point2.x) {
    return Math.abs(targetPoint.x - point1.x) < 1;
  }

  if (point1.y === point2.y) {
    return Math.abs(targetPoint.y - point1.y) < 1;
  }

  return Math.abs(targetPoint.y - getLinearY(point1, point2, [targetPoint])[0]) < 1;
}
/**
 * 点是否在线段上
 * @param point1
 * @param point2
 * @param targetPoint
 * @returns {boolean}
 */

function checkPointOnRayLine(point1, point2, targetPoint) {
  if (!targetPoint || !point1 || !point2) {
    return false;
  }

  if (checkPointOnStraightLine(point1, point2, targetPoint)) {
    if (point1.x === point2.x) {
      if (point1.y < point2.y) {
        return targetPoint.y > point1.y - 2;
      } else {
        return targetPoint.y < point1.y + 2;
      }
    }

    if (point1.x < point2.x) {
      return targetPoint.x > point1.x - 2;
    } else {
      return targetPoint.x < point1.x + 2;
    }
  }

  return false;
}
/**
 * 判断点是否在线段上面
 * @param point1
 * @param point2
 * @param targetPoint
 */

function checkPointOnSegmentLine(point1, point2, targetPoint) {
  if (!targetPoint || !point1 || !point2) {
    return false;
  }

  if (checkPointOnStraightLine(point1, point2, targetPoint)) {
    var a = Math.sqrt(Math.pow(targetPoint.x - point1.x, 2) + Math.pow(targetPoint.y - point1.y, 2));
    var b = Math.sqrt(Math.pow(targetPoint.x - point2.x, 2) + Math.pow(targetPoint.y - point2.y, 2));
    var c = Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
    return Math.abs(a + b - c) < 2;
  }

  return false;
}
/**
 * 点是否在圆上
 * @param circleCenterPoint
 * @param radius
 * @param targetPoint
 * @returns {boolean}
 */

function checkPointOnCircle(circleCenterPoint, radius, targetPoint) {
  if (!targetPoint) {
    return false;
  }

  var subX = targetPoint.x - circleCenterPoint.x;
  var subY = targetPoint.y - circleCenterPoint.y;
  return !(subX * subX + subY * subY > radius * radius);
}
/**
 * 获取平行线
 * @param points
 * @param viewportHandler
 * @param isPriceChannelLine
 * @returns {Array}
 */

function getParallelLines(points, viewportHandler, isPriceChannelLine) {
  var lines = [];

  if (points.length > 1) {
    if (points[0].x === points[1].x) {
      var startY = viewportHandler.contentTop();
      var endY = viewportHandler.contentBottom();
      lines.push([{
        x: points[0].x,
        y: startY
      }, {
        x: points[0].x,
        y: endY
      }]);

      if (points.length > 2) {
        lines.push([{
          x: points[2].x,
          y: startY
        }, {
          x: points[2].x,
          y: endY
        }]);

        if (isPriceChannelLine) {
          var distance = points[0].x - points[2].x;
          lines.push([{
            x: points[0].x + distance,
            y: startY
          }, {
            x: points[0].x + distance,
            y: endY
          }]);
        }
      }
    } else {
      var startX = viewportHandler.contentLeft();
      var endX = viewportHandler.contentRight();

      if (points[0].y === points[1].y) {
        lines.push([{
          x: startX,
          y: points[0].y
        }, {
          x: endX,
          y: points[0].y
        }]);

        if (points.length > 2) {
          lines.push([{
            x: startX,
            y: points[2].y
          }, {
            x: endX,
            y: points[2].y
          }]);

          if (isPriceChannelLine) {
            var _distance = points[0].y - points[2].y;

            lines.push([{
              x: startX,
              y: points[0].y + _distance
            }, {
              x: endX,
              y: points[0].y + _distance
            }]);
          }
        }
      } else {
        var k = (points[0].y - points[1].y) / (points[0].x - points[1].x);
        var b = points[0].y - k * points[0].x;
        lines.push([{
          x: startX,
          y: startX * k + b
        }, {
          x: endX,
          y: endX * k + b
        }]);

        if (points.length > 2) {
          var b1 = points[2].y - k * points[2].x;
          lines.push([{
            x: startX,
            y: startX * k + b1
          }, {
            x: endX,
            y: endX * k + b1
          }]);

          if (isPriceChannelLine) {
            var b2 = b + (b - b1);
            lines.push([{
              x: startX,
              y: startX * k + b2
            }, {
              x: endX,
              y: endX * k + b2
            }]);
          }
        }
      }
    }
  }

  return lines;
}
/**
 * 获取斐波那契线
 * @param points
 * @param viewportHandler
 */

function getFibonacciLines(points, viewportHandler) {
  var lines = [];

  if (points.length > 0) {
    var startX = viewportHandler.contentLeft();
    var endX = viewportHandler.contentRight();
    lines.push([{
      x: startX,
      y: points[0].y
    }, {
      x: endX,
      y: points[0].y
    }]);

    if (points.length > 1) {
      var yDistance = points[0].y - points[1].y;
      lines.push([{
        x: startX,
        y: points[1].y + yDistance * 0.786
      }, {
        x: endX,
        y: points[1].y + yDistance * 0.786
      }]);
      lines.push([{
        x: startX,
        y: points[1].y + yDistance * 0.618
      }, {
        x: endX,
        y: points[1].y + yDistance * 0.618
      }]);
      lines.push([{
        x: startX,
        y: points[1].y + yDistance * 0.5
      }, {
        x: endX,
        y: points[1].y + yDistance * 0.5
      }]);
      lines.push([{
        x: startX,
        y: points[1].y + yDistance * 0.382
      }, {
        x: endX,
        y: points[1].y + yDistance * 0.382
      }]);
      lines.push([{
        x: startX,
        y: points[1].y + yDistance * 0.236
      }, {
        x: endX,
        y: points[1].y + yDistance * 0.236
      }]);
      lines.push([{
        x: startX,
        y: points[1].y
      }, {
        x: endX,
        y: points[1].y
      }]);
    }
  }

  return lines;
}

var MarkerRender =
/*#__PURE__*/
function (_Render) {
  _inherits(MarkerRender, _Render);

  function MarkerRender(viewPortHandler, dataProvider, yRender) {
    var _this;

    _classCallCheck(this, MarkerRender);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MarkerRender).call(this, viewPortHandler, dataProvider));
    _this.yRender = yRender;
    return _this;
  }
  /**
   * 渲染水平直线
   * @param ctx
   * @param marker
   */


  _createClass(MarkerRender, [{
    key: "renderHorizontalStraightLine",
    value: function renderHorizontalStraightLine(ctx, marker) {
      var _this2 = this;

      this.renderPointMarker(ctx, MarkerType.HORIZONTAL_STRAIGHT_LINE, marker, checkPointOnStraightLine, function (points) {
        return [[{
          x: _this2.viewPortHandler.contentLeft(),
          y: points[0].y
        }, {
          x: _this2.viewPortHandler.contentRight(),
          y: points[0].y
        }]];
      });
    }
    /**
     * 渲染垂直直线
     * @param ctx
     * @param marker
     */

  }, {
    key: "renderVerticalStraightLine",
    value: function renderVerticalStraightLine(ctx, marker) {
      var _this3 = this;

      this.renderPointMarker(ctx, MarkerType.VERTICAL_STRAIGHT_LINE, marker, checkPointOnStraightLine, function (points) {
        return [[{
          x: points[0].x,
          y: _this3.viewPortHandler.contentTop()
        }, {
          x: points[0].x,
          y: _this3.viewPortHandler.contentBottom()
        }]];
      });
    }
    /**
     * 渲染直线
     * @param ctx
     * @param marker
     */

  }, {
    key: "renderStraightLine",
    value: function renderStraightLine(ctx, marker) {
      var _this4 = this;

      this.renderPointMarker(ctx, MarkerType.STRAIGHT_LINE, marker, checkPointOnStraightLine, function (points) {
        if (points[0].x === points[1].x) {
          return [[{
            x: points[0].x,
            y: _this4.viewPortHandler.contentTop()
          }, {
            x: points[0].x,
            y: _this4.viewPortHandler.bottom
          }]];
        }

        var y = getLinearY(points[0], points[1], [{
          x: _this4.viewPortHandler.contentLeft(),
          y: points[0].y
        }, {
          x: _this4.viewPortHandler.contentRight(),
          y: points[0].y
        }]);
        return [[{
          x: _this4.viewPortHandler.contentLeft(),
          y: y[0]
        }, {
          x: _this4.viewPortHandler.contentRight(),
          y: y[1]
        }]];
      });
    }
    /**
     * 绘制水平射线
     * @param ctx
     * @param marker
     */

  }, {
    key: "renderHorizontalRayLine",
    value: function renderHorizontalRayLine(ctx, marker) {
      var _this5 = this;

      this.renderPointMarker(ctx, MarkerType.HORIZONTAL_RAY_LINE, marker, checkPointOnRayLine, function (points) {
        var point = {
          x: _this5.viewPortHandler.contentLeft(),
          y: points[0].y
        };

        if (points[0].x < points[1].x) {
          point.x = _this5.viewPortHandler.contentRight();
        }

        return [[points[0], point]];
      });
    }
    /**
     * 绘制垂直射线
     * @param ctx
     * @param marker
     */

  }, {
    key: "renderVerticalRayLine",
    value: function renderVerticalRayLine(ctx, marker) {
      var _this6 = this;

      this.renderPointMarker(ctx, MarkerType.VERTICAL_RAY_LINE, marker, checkPointOnRayLine, function (points) {
        var point = {
          x: points[0].x,
          y: _this6.viewPortHandler.contentTop()
        };

        if (points[0].y < points[1].y) {
          point.y = _this6.viewPortHandler.contentBottom();
        }

        return [[points[0], point]];
      });
    }
    /**
     * 渲染射线
     * @param ctx
     * @param marker
     */

  }, {
    key: "renderRayLine",
    value: function renderRayLine(ctx, marker) {
      var _this7 = this;

      this.renderPointMarker(ctx, MarkerType.RAY_LINE, marker, checkPointOnRayLine, function (points) {
        var point;

        if (points[0].x === points[1].x && points[0].y !== points[1].y) {
          if (points[0].y < points[1].y) {
            point = {
              x: points[0].x,
              y: _this7.viewPortHandler.contentBottom()
            };
          } else {
            point = {
              x: points[0].x,
              y: _this7.viewPortHandler.contentTop()
            };
          }
        } else if (points[0].x > points[1].x) {
          point = {
            x: _this7.viewPortHandler.contentLeft(),
            y: getLinearY(points[0], points[1], [{
              x: _this7.viewPortHandler.contentLeft(),
              y: points[0].y
            }])[0]
          };
        } else {
          point = {
            x: _this7.viewPortHandler.contentRight(),
            y: getLinearY(points[0], points[1], [{
              x: _this7.viewPortHandler.contentRight(),
              y: points[0].y
            }])[0]
          };
        }

        return [[points[0], point]];
      });
    }
    /**
     * 绘制线段，水平线段，垂直线段，普通线段一起绘制
     * @param ctx
     * @param marker
     */

  }, {
    key: "renderSegmentLine",
    value: function renderSegmentLine(ctx, marker) {
      this.renderPointMarker(ctx, MarkerType.HORIZONTAL_SEGMENT_LINE, marker, checkPointOnSegmentLine);
      this.renderPointMarker(ctx, MarkerType.VERTICAL_SEGMENT_LINE, marker, checkPointOnSegmentLine);
      this.renderPointMarker(ctx, MarkerType.SEGMENT_LINE, marker, checkPointOnSegmentLine);
    }
    /**
     * 绘制价格线
     * @param ctx
     * @param marker
     * @param pricePrecision
     */

  }, {
    key: "renderPriceLine",
    value: function renderPriceLine(ctx, marker, pricePrecision) {
      var _this8 = this;

      this.renderPointMarker(ctx, MarkerType.PRICE_LINE, marker, checkPointOnRayLine, function (points) {
        return [[points[0], {
          x: _this8.viewPortHandler.contentRight(),
          y: points[0].y
        }]];
      }, true, pricePrecision);
    }
    /**
     * 渲染价格通道线
     * @param ctx
     * @param marker
     */

  }, {
    key: "renderPriceChannelLine",
    value: function renderPriceChannelLine(ctx, marker) {
      var _this9 = this;

      this.renderPointMarker(ctx, MarkerType.PRICE_CHANNEL_LINE, marker, checkPointOnStraightLine, function (points) {
        return getParallelLines(points, _this9.viewPortHandler, true);
      });
    }
    /**
     * 渲染平行直线
     * @param ctx
     * @param marker
     */

  }, {
    key: "renderParallelStraightLine",
    value: function renderParallelStraightLine(ctx, marker) {
      var _this10 = this;

      this.renderPointMarker(ctx, MarkerType.PARALLEL_STRAIGHT_LINE, marker, checkPointOnStraightLine, function (points) {
        return getParallelLines(points, _this10.viewPortHandler);
      });
    }
    /**
     * 渲染斐波那契线
     * @param ctx
     * @param marker
     * @param pricePrecision
     */

  }, {
    key: "renderFibonacciLine",
    value: function renderFibonacciLine(ctx, marker, pricePrecision) {
      var _this11 = this;

      this.renderPointMarker(ctx, MarkerType.FIBONACCI_LINE, marker, checkPointOnStraightLine, function (points) {
        return getFibonacciLines(points, _this11.viewPortHandler);
      }, true, pricePrecision, ['(100.0%)', '(78.6%)', '(61.8%)', '(50.0%)', '(38.2%)', '(23.6%)', '(0.0%)']);
    }
    /**
     * 渲染点形成的图形
     * @param ctx
     * @param markerKey
     * @param marker
     * @param checkPointOnLine
     * @param generatedLinePoints
     * @param isRenderPrice
     * @param pricePrecision
     * @param priceExtendsText
     */

  }, {
    key: "renderPointMarker",
    value: function renderPointMarker(ctx, markerKey, marker, checkPointOnLine, generatedLinePoints, isRenderPrice, pricePrecision, priceExtendsText) {
      var _this12 = this;

      var markerData = this.dataProvider.markerDatas[markerKey];
      markerData.forEach(function (_ref) {
        var points = _ref.points,
            drawStep = _ref.drawStep;
        var circlePoints = [];
        points.forEach(function (_ref2) {
          var xPos = _ref2.xPos,
              price = _ref2.price;
          var x = (xPos - _this12.dataProvider.minPos) * _this12.dataProvider.dataSpace;

          var y = _this12.yRender.getY(price);

          circlePoints.push({
            x: x,
            y: y
          });
        });
        var linePoints = generatedLinePoints ? generatedLinePoints(circlePoints) : [circlePoints];

        _this12.renderMarker(ctx, linePoints, circlePoints, marker, drawStep, checkPointOnLine, isRenderPrice, pricePrecision, priceExtendsText);
      });
    }
    /**
     * 绘制标记图形
     * @param ctx
     * @param linePoints
     * @param circlePoints
     * @param marker
     * @param drawStep
     * @param checkPointOnLine
     * @param isRenderPrice
     * @param pricePrecision
     * @param priceExtendsText
     */

  }, {
    key: "renderMarker",
    value: function renderMarker(ctx, linePoints, circlePoints, marker, drawStep, checkPointOnLine, isRenderPrice, pricePrecision) {
      var _this13 = this;

      var priceExtendsText = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : [];
      var markerPoint = this.dataProvider.markerPoint;
      var isOnLine = false;
      linePoints.forEach(function (points, i) {
        if (points.length > 1) {
          var isOn = checkPointOnLine(points[0], points[1], markerPoint);

          if (!isOnLine) {
            isOnLine = isOn;
          }

          if (drawStep !== MarkerDrawStep.STEP_1) {
            ctx.strokeStyle = marker.line.color;
            ctx.lineWidth = marker.line.size;
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            ctx.lineTo(points[1].x, points[1].y);
            ctx.stroke();
            ctx.closePath(); // 渲染价格

            if (isRenderPrice) {
              var price = _this13.yRender.getValue(points[0].y);

              var priceText = formatPrecision(price, pricePrecision);
              var textSize = marker.text.size;
              ctx.font = getFont(textSize);
              ctx.fillStyle = marker.text.color;
              ctx.fillText("".concat(priceText, " ").concat(priceExtendsText[i] || ''), points[0].x + marker.text.marginLeft, points[0].y - marker.text.marginBottom);
            }
          }
        }
      });
      var radius = marker.point.radius;
      var isCircleActive = false;

      for (var i = 0; i < circlePoints.length; i++) {
        isCircleActive = checkPointOnCircle(circlePoints[i], radius, markerPoint);

        if (isCircleActive) {
          break;
        }
      }

      circlePoints.forEach(function (circlePoint) {
        var isOnCircle = checkPointOnCircle(circlePoint, radius, markerPoint);

        if (isCircleActive || isOnLine) {
          var circleRadius = isOnCircle ? marker.point.activeRadius : radius;
          var circleColor = isOnCircle ? marker.point.activeBackgroundColor : marker.point.backgroundColor;
          var circleBorderColor = isOnCircle ? marker.point.activeBorderColor : marker.point.borderColor;
          var circleBorderSize = isOnCircle ? marker.point.activeBorderSize : marker.point.borderSize;
          ctx.fillStyle = circleColor;
          ctx.beginPath();
          ctx.arc(circlePoint.x, circlePoint.y, circleRadius, 0, Math.PI * 2);
          ctx.closePath();
          ctx.fill();
          ctx.lineWidth = circleBorderSize;
          ctx.strokeStyle = circleBorderColor;
          ctx.beginPath();
          ctx.arc(circlePoint.x, circlePoint.y, circleRadius, 0, Math.PI * 2);
          ctx.closePath();
          ctx.stroke();
        }
      });
    }
  }]);

  return MarkerRender;
}(Render);

var MarkerChart =
/*#__PURE__*/
function (_Chart) {
  _inherits(MarkerChart, _Chart);

  function MarkerChart(dom, style, dataProvider, yAxisRender, precision) {
    var _this;

    _classCallCheck(this, MarkerChart);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MarkerChart).call(this, dom, style));
    _this.markerRender = new MarkerRender(_this.viewPortHandler, dataProvider, yAxisRender);
    _this.precision = precision;
    return _this;
  }

  _createClass(MarkerChart, [{
    key: "draw",
    value: function draw() {
      // 画线
      var marker = this.style.marker;
      this.markerRender.renderHorizontalStraightLine(this.ctx, marker);
      this.markerRender.renderVerticalStraightLine(this.ctx, marker);
      this.markerRender.renderStraightLine(this.ctx, marker);
      this.markerRender.renderHorizontalRayLine(this.ctx, marker);
      this.markerRender.renderVerticalRayLine(this.ctx, marker);
      this.markerRender.renderRayLine(this.ctx, marker);
      this.markerRender.renderSegmentLine(this.ctx, marker);
      this.markerRender.renderPriceLine(this.ctx, marker, this.precision.pricePrecision);
      this.markerRender.renderPriceChannelLine(this.ctx, marker);
      this.markerRender.renderParallelStraightLine(this.ctx, marker);
      this.markerRender.renderFibonacciLine(this.ctx, marker, this.precision.pricePrecision);
    }
  }]);

  return MarkerChart;
}(Chart);

/**
 * 默认的样式配置
 * @returns {{realTime: {timeLine: {areaFillColor: string, color: string, size: number}, averageLine: {color: string, size: number, display: boolean}}, indicator: {decreasingColor: string, lineColors: [string, string, string, string, string], increasingColor: string, lineSize: number}, yAxis: {line: {color: string, size: number, display: boolean}, display: boolean, minWidth: number, position: string, tick: {line: {size: number, color: string, display: boolean, length: number}, text: {margin: number, color: string, size: number, display: boolean, valueFormatter: null, position: string}}, separatorLine: {size: number, color: string, dashValue: number[], display: boolean, style: string}, maxWidth: number}, lowestPriceMark: {color: string, display: boolean, text: {margin: number, size: number, valueFormatter: null}}, xAxis: {minHeight: number, maxHeight: number, line: {color: string, size: number, display: boolean}, display: boolean, tick: {line: {size: number, color: string, display: boolean, length: number}, text: {margin: number, color: string, size: number, display: boolean, valueFormatter: null}}, separatorLine: {size: number, color: string, dashValue: number[], display: boolean, style: string}}, lastPriceMark: {decreasingColor: string, line: {dashValue: number[], size: number, display: boolean, style: string}, display: boolean, increasingColor: string, text: {paddingBottom: number, size: number, color: string, display: boolean, paddingRight: number, valueFormatter: null, paddingTop: number, paddingLeft: number}}, grid: boolean, marker: {line: {color: string, size: number}, text: {marginRight: number, color: string, size: number, valueFormatter: null, marginBottom: number, marginTop: number, marginLeft: number}, point: {backgroundColor: string, borderColor: string, activeBorderSize: number, activeRadius: number, activeBorderColor: string, activeBackgroundColor: string, borderSize: number, radius: number}}, candle: {decreasingColor: string, style: string, increasingColor: string}, tooltip: {data: {indicator: {text: {marginRight: number, size: number, color: string, valueFormatter: null, marginBottom: number, marginTop: number, marginLeft: number}}, displayRule: string, base: {floatRect: {fillColor: string, borderColor: string, paddingBottom: number, top: number, borderRadius: number, left: number, paddingRight: number, borderSize: number, paddingTop: number, right: number, paddingLeft: number}, values: null, showType: string, text: {marginRight: number, size: number, color: string, valueFormatter: null, marginBottom: number, marginTop: number, marginLeft: number}, labels: string[]}}, cross: {line: {dashValue: number[], size: number, color: string, style: string}, display: boolean, text: {horizontal: {borderColor: string, backgroundColor: string, paddingBottom: number, color: string, size: number, paddingRight: number, valueFormatter: null, borderSize: number, paddingTop: number, paddingLeft: number}, vertical: {borderColor: string, backgroundColor: string, paddingBottom: number, color: string, size: number, paddingRight: number, valueFormatter: null, borderSize: number, paddingTop: number, paddingLeft: number}}}}, highestPriceMark: {color: string, display: boolean, text: {margin: number, size: number, valueFormatter: null}}}}
 */

function getDefaultStyle() {
  return {
    grid: false,
    realTime: {
      /**
       * 分时线
       */
      timeLine: {
        color: '#1e88e5',
        size: 1,
        areaFillColor: 'rgba(30, 136, 229, 0.08)'
      },

      /**
       * 均线
       */
      averageLine: {
        display: true,
        color: '#F5A623',
        size: 1
      }
    },
    candle: {
      /**
       * 蜡烛样式
       */
      style: CandleStyle.SOLID,

      /**
       * 上涨颜色
       */
      increasingColor: '#26A69A',

      /**
       * 下跌颜色
       */
      decreasingColor: '#EF5350'
    },

    /**
     * 最大价格标记参数
     */
    highestPriceMark: {
      display: true,
      color: '#D9D9D9',
      text: {
        margin: 5,
        size: 10
      }
    },

    /**
     * 最小价格标记参数
     */
    lowestPriceMark: {
      display: true,
      color: '#D9D9D9',
      text: {
        margin: 5,
        size: 10
      }
    },

    /**
     * 最新价标记参数
     */
    lastPriceMark: {
      display: true,
      increasingColor: '#26A69A',
      decreasingColor: '#EF5350',
      line: {
        display: true,
        style: LineStyle.DASH,
        dashValue: [4, 4],
        size: 1
      },
      text: {
        display: true,
        size: 12,
        paddingLeft: 2,
        paddingTop: 2,
        paddingRight: 2,
        paddingBottom: 2,
        color: '#FFFFFF'
      }
    },
    indicator: {
      /**
       * 线的尺寸
       */
      lineSize: 1,
      increasingColor: '#26A69A',
      decreasingColor: '#EF5350',
      lineColors: ['#D9D9D9', '#F5A623', '#F601FF', '#1587DD', '#1e88e5']
    },
    xAxis: {
      /**
       * 是否显示整个轴
       */
      display: true,

      /**
       * x轴最大高度
       */
      maxHeight: 50,

      /**
       * x轴最小高度
       */
      minHeight: 30,

      /**
       * 轴线配置
       */
      line: {
        display: true,
        color: '#888888',
        size: 1
      },

      /**
       * 分割配置
       */
      tick: {
        // 文字
        text: {
          display: true,
          color: '#D9D9D9',
          size: 12,
          margin: 3
        },
        // 线
        line: {
          display: true,
          size: 1,
          length: 3,
          color: '#888888'
        }
      },

      /**
       * 分割线配置
       */
      separatorLine: {
        display: false,
        size: 1,
        color: '#393939',
        style: LineStyle.DASH,
        dashValue: [2, 2]
      }
    },
    yAxis: {
      /**
       * 是否显示整个轴
       */
      display: true,

      /**
       * y轴位置
       */
      position: YAxisPosition.RIGHT,

      /**
       * y轴最大宽度
       */
      maxWidth: 80,

      /**
       * y轴最小宽度
       */
      minWidth: 60,

      /**
       * 轴线配置
       */
      line: {
        display: true,
        color: '#888888',
        size: 1
      },

      /**
       * 分割配置
       */
      tick: {
        // 文字
        text: {
          display: true,
          position: YAxisTextPosition.OUTSIDE,
          color: '#D9D9D9',
          size: 12,
          margin: 3
        },
        // 线
        line: {
          display: true,
          size: 1,
          length: 3,
          color: '#888888'
        }
      },

      /**
       * 分割线配置
       */
      separatorLine: {
        display: true,
        size: 1,
        color: '#393939',
        style: LineStyle.DASH,
        dashValue: [2, 2]
      }
    },
    tooltip: {
      /**
       * 光标线配置
       */
      cross: {
        display: true,
        line: {
          style: LineStyle.DASH,
          dashValue: [4, 2],
          size: 1,
          color: '#888888'
        },
        text: {
          horizontal: {
            color: '#D9D9D9',
            size: 12,
            paddingLeft: 2,
            paddingRight: 2,
            paddingTop: 2,
            paddingBottom: 2,
            borderSize: 1,
            borderColor: '#505050',
            backgroundColor: '#505050'
          },
          vertical: {
            color: '#D9D9D9',
            size: 12,
            paddingLeft: 2,
            paddingRight: 2,
            paddingTop: 2,
            paddingBottom: 2,
            borderSize: 1,
            borderColor: '#505050',
            backgroundColor: '#505050'
          }
        }
      },

      /**
       * 数据配置
       */
      data: {
        displayRule: TooltipTextDisplayRule.ALWAYS,
        base: {
          showType: TooltipMainChartTextDisplayType.FIXED,
          labels: ['时间', '开', '收', '高', '低', '成交量'],
          values: null,
          text: {
            size: 12,
            color: '#D9D9D9',
            marginLeft: 8,
            marginTop: 6,
            marginRight: 8,
            marginBottom: 0
          },
          floatRect: {
            paddingLeft: 0,
            paddingRight: 0,
            paddingTop: 0,
            paddingBottom: 6,
            left: 8,
            top: 8,
            right: 8,
            borderRadius: 4,
            borderSize: 1,
            borderColor: '#3f4254',
            fillColor: 'rgba(17, 17, 17, .3)'
          }
        },
        indicator: {
          text: {
            size: 12,
            color: '#D9D9D9',
            marginTop: 6,
            marginRight: 8,
            marginBottom: 0,
            marginLeft: 8
          }
        }
      }
    },
    marker: {
      line: {
        color: '#1e88e5',
        size: 1
      },
      point: {
        backgroundColor: '#1e88e5',
        borderColor: '#1e88e5',
        borderSize: 1,
        radius: 4,
        activeBackgroundColor: '#1e88e5',
        activeBorderColor: '#1e88e5',
        activeBorderSize: 1,
        activeRadius: 6
      },
      text: {
        color: '#1e88e5',
        size: 12,
        marginLeft: 2,
        marginRight: 2,
        marginTop: 2,
        marginBottom: 6,
        valueFormatter: null
      }
    }
  };
}
/**
 * 默认的指标参数配置
 */

function getDefaultIndicatorParams() {
  var _ref;

  return _ref = {}, _defineProperty(_ref, IndicatorType.MA, [5, 10, 30, 60]), _defineProperty(_ref, IndicatorType.VOL, [5, 10, 20]), _defineProperty(_ref, IndicatorType.MACD, [12, 26, 9]), _defineProperty(_ref, IndicatorType.BOLL, [20]), _defineProperty(_ref, IndicatorType.KDJ, [9, 3, 3]), _defineProperty(_ref, IndicatorType.RSI, [6, 12, 24]), _defineProperty(_ref, IndicatorType.BIAS, [6, 12, 24]), _defineProperty(_ref, IndicatorType.BRAR, [26]), _defineProperty(_ref, IndicatorType.CCI, [13]), _defineProperty(_ref, IndicatorType.DMI, [14, 6]), _defineProperty(_ref, IndicatorType.CR, [26, 10, 20, 40, 60]), _defineProperty(_ref, IndicatorType.PSY, [12]), _defineProperty(_ref, IndicatorType.DMA, [10, 50, 10]), _defineProperty(_ref, IndicatorType.TRIX, [12, 20]), _defineProperty(_ref, IndicatorType.OBV, [30]), _defineProperty(_ref, IndicatorType.VR, [24, 30]), _defineProperty(_ref, IndicatorType.WR, [13, 34, 89]), _defineProperty(_ref, IndicatorType.MTM, [6, 10]), _defineProperty(_ref, IndicatorType.EMV, [14, 9]), _defineProperty(_ref, IndicatorType.SAR, [2, 2, 20]), _ref;
}
/**
 * 获取价格精度配置
 * @returns {{pricePrecision: number, volumePrecision: number}}
 */

function getDefaultPrecision() {
  return {
    pricePrecision: 2,
    volumePrecision: 0
  };
}
/**
 * 获取默认周期
 * @returns {{period: string}}
 */

function getDefaultPeriod() {
  return {
    period: '1'
  };
}
/**
 * 获取指标精度
 * @param pricePrecision
 * @param volumePrecision
 * @returns {{[p: string]: *|number}}
 */

function getIndicatorPrecision(pricePrecision, volumePrecision) {
  var _ref2;

  return _ref2 = {}, _defineProperty(_ref2, IndicatorType.NO, pricePrecision), _defineProperty(_ref2, IndicatorType.MA, pricePrecision), _defineProperty(_ref2, IndicatorType.VOL, volumePrecision), _defineProperty(_ref2, IndicatorType.MACD, 2), _defineProperty(_ref2, IndicatorType.BOLL, pricePrecision), _defineProperty(_ref2, IndicatorType.KDJ, 2), _defineProperty(_ref2, IndicatorType.RSI, 2), _defineProperty(_ref2, IndicatorType.BIAS, 2), _defineProperty(_ref2, IndicatorType.BRAR, 4), _defineProperty(_ref2, IndicatorType.CCI, 4), _defineProperty(_ref2, IndicatorType.DMI, 4), _defineProperty(_ref2, IndicatorType.CR, 2), _defineProperty(_ref2, IndicatorType.PSY, 2), _defineProperty(_ref2, IndicatorType.DMA, 4), _defineProperty(_ref2, IndicatorType.TRIX, 4), _defineProperty(_ref2, IndicatorType.OBV, 4), _defineProperty(_ref2, IndicatorType.VR, 4), _defineProperty(_ref2, IndicatorType.WR, 4), _defineProperty(_ref2, IndicatorType.MTM, 4), _defineProperty(_ref2, IndicatorType.EMV, 4), _defineProperty(_ref2, IndicatorType.SAR, pricePrecision), _ref2;
}

var TooltipRender =
/*#__PURE__*/
function (_Render) {
  _inherits(TooltipRender, _Render);

  function TooltipRender(viewPortHandler, dataProvider, indicatorParams, candleViewPortHandler, volViewPortHandler, subIndicatorViewPortHandler, candleYAxisRender, volYAxisRender, subIndicatorYAxisRender) {
    var _this;

    _classCallCheck(this, TooltipRender);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TooltipRender).call(this, viewPortHandler, dataProvider));
    _this.indicatorParams = indicatorParams;
    _this.candleViewPortHandler = candleViewPortHandler;
    _this.volViewPortHandler = volViewPortHandler;
    _this.subIndicatorViewPortHandler = subIndicatorViewPortHandler;
    _this.candleYAxisRender = candleYAxisRender;
    _this.volYAxisRender = volYAxisRender;
    _this.subIndicatorYAxisRender = subIndicatorYAxisRender;
    return _this;
  }
  /**
   * 绘制水平线
   * @param ctx
   * @param mainIndicatorType
   * @param subIndicatorType
   * @param isRenderYAxisLeft
   * @param isRenderYAxisTextOutside
   * @param tooltip
   * @param precision
   */


  _createClass(TooltipRender, [{
    key: "renderCrossHorizontalLine",
    value: function renderCrossHorizontalLine(ctx, mainIndicatorType, subIndicatorType, isRenderYAxisLeft, isRenderYAxisTextOutside, tooltip, precision) {
      var yAxisDataLabel = this.getCrossYAxisLabel(tooltip, mainIndicatorType, subIndicatorType, precision);
      var crossPoint = this.dataProvider.crossPoint;

      if (!yAxisDataLabel || !crossPoint || !tooltip.cross.display) {
        return;
      }

      var textHorizontal = tooltip.cross.text.horizontal;
      var textSize = textHorizontal.size;
      var yAxisDataLabelWidth = calcTextWidth(textSize, yAxisDataLabel);
      var rectStartX;
      var lineStartX = this.viewPortHandler.contentLeft();
      var lineEndX = this.viewPortHandler.contentRight();
      var centerPoint = this.viewPortHandler.getContentCenter();
      var paddingLeft = textHorizontal.paddingLeft;
      var paddingRight = textHorizontal.paddingRight;
      var paddingTop = textHorizontal.paddingTop;
      var paddingBottom = textHorizontal.paddingBottom;
      var borderSize = textHorizontal.borderSize;
      var rectWidth = yAxisDataLabelWidth + borderSize * 2 + paddingLeft + paddingRight;
      var rectHeight = textSize + borderSize * 2 + paddingTop + paddingBottom;

      if (isRenderYAxisTextOutside) {
        if (isRenderYAxisLeft) {
          rectStartX = lineStartX - rectWidth;
        } else {
          rectStartX = lineEndX;
        }
      } else {
        if (crossPoint.x > centerPoint.x) {
          // 左边
          lineStartX = this.viewPortHandler.contentLeft() + rectWidth;
          rectStartX = this.viewPortHandler.contentLeft() + 1;
        } else {
          lineEndX = this.viewPortHandler.contentRight() - rectWidth;
          rectStartX = lineEndX - 1;
        }
      } // 绘制十字光标水平线


      ctx.lineWidth = tooltip.cross.line.size;
      ctx.strokeStyle = tooltip.cross.line.color;

      if (tooltip.cross.line.style === LineStyle.DASH) {
        ctx.setLineDash(tooltip.cross.line.dashValue);
      }

      ctx.beginPath();
      ctx.moveTo(lineStartX, crossPoint.y);
      ctx.lineTo(lineEndX, crossPoint.y);
      ctx.stroke();
      ctx.closePath();
      ctx.setLineDash([]);
      var rectY = crossPoint.y - borderSize - paddingTop - textSize / 2; // 绘制y轴文字外的边框

      ctx.fillStyle = textHorizontal.backgroundColor;
      ctx.fillRect(rectStartX, rectY, rectWidth, rectHeight);
      ctx.lineWidth = borderSize;
      ctx.strokeStyle = textHorizontal.borderColor;
      ctx.strokeRect(rectStartX, rectY, rectWidth, rectHeight);
      ctx.textBaseline = 'middle';
      ctx.fillStyle = textHorizontal.color;
      ctx.font = getFont(textSize);
      ctx.fillText(yAxisDataLabel, rectStartX + borderSize + paddingLeft, crossPoint.y);
    }
    /**
     * 获取十字光标y轴上的文字
     * @param tooltip
     * @param mainIndicatorType
     * @param subIndicatorType
     * @param precision
     * @returns {null|*|string}
     */

  }, {
    key: "getCrossYAxisLabel",
    value: function getCrossYAxisLabel(tooltip, mainIndicatorType, subIndicatorType, precision) {
      if (!this.dataProvider.crossPoint) {
        return null;
      }

      var eventY = this.dataProvider.crossPoint.y;
      var top;

      if (eventY && eventY > 0 && eventY < this.candleViewPortHandler.height + this.volViewPortHandler.height + this.subIndicatorViewPortHandler.height) {
        var yAxisRender;
        var indicatorType;

        if (eventY > 0 && eventY < this.candleViewPortHandler.contentBottom()) {
          yAxisRender = this.candleYAxisRender;
          indicatorType = mainIndicatorType;
          top = 0;
        } else if (eventY > this.candleViewPortHandler.contentBottom() && eventY < this.candleViewPortHandler.contentBottom() + this.volViewPortHandler.height) {
          yAxisRender = this.volYAxisRender;
          indicatorType = IndicatorType.VOL;
          top = this.candleViewPortHandler.height;
        } else {
          yAxisRender = this.subIndicatorYAxisRender;
          indicatorType = subIndicatorType;
          top = this.candleViewPortHandler.height + this.volViewPortHandler.height;
        }

        var yData = yAxisRender.getValue(eventY - top);
        var precisionConfig = getIndicatorPrecision(precision.pricePrecision, precision.volumePrecision);
        return formatPrecision(yData, precisionConfig[indicatorType]);
      }

      return null;
    }
    /**
     * 绘制十字光标垂直线
     * @param ctx
     * @param kLineData
     * @param tooltip
     */

  }, {
    key: "renderCrossVerticalLine",
    value: function renderCrossVerticalLine(ctx, kLineData, tooltip) {
      var crossPoint = this.dataProvider.crossPoint;

      if (!crossPoint || !tooltip.cross.display) {
        return;
      }

      var crossLine = tooltip.cross.line;
      ctx.lineWidth = crossLine.size;
      ctx.strokeStyle = crossLine.color;

      if (crossLine.style === LineStyle.DASH) {
        ctx.setLineDash(crossLine.dashValue);
      }

      ctx.beginPath();
      ctx.moveTo(crossPoint.x, this.viewPortHandler.contentTop());
      ctx.lineTo(crossPoint.x, this.viewPortHandler.contentBottom());
      ctx.stroke();
      ctx.closePath();
      ctx.setLineDash([]);
      var timestamp = kLineData.timestamp;
      var text = formatDate(timestamp, 'YYYY-MM-DD hh:mm');
      var textVertical = tooltip.cross.text.vertical;
      var textSize = textVertical.size;
      var labelWidth = calcTextWidth(textSize, text);
      var xAxisLabelX = crossPoint.x - labelWidth / 2;
      var paddingLeft = textVertical.paddingLeft;
      var paddingRight = textVertical.paddingRight;
      var paddingTop = textVertical.paddingTop;
      var paddingBottom = textVertical.paddingBottom;
      var borderSize = textVertical.borderSize; // 保证整个x轴上的提示文字总是完全显示

      if (xAxisLabelX < this.viewPortHandler.contentLeft() + paddingLeft + borderSize) {
        xAxisLabelX = this.viewPortHandler.contentLeft() + paddingLeft + borderSize;
      } else if (xAxisLabelX > this.viewPortHandler.contentRight() - labelWidth - borderSize - paddingRight) {
        xAxisLabelX = this.viewPortHandler.contentRight() - labelWidth - borderSize - paddingRight;
      }

      var rectLeft = xAxisLabelX - borderSize - paddingLeft;
      var rectTop = this.viewPortHandler.contentBottom();
      var rectRight = xAxisLabelX + labelWidth + borderSize + paddingRight;
      var rectBottom = this.viewPortHandler.contentBottom() + textSize + borderSize * 2 + paddingTop + paddingBottom;
      ctx.fillStyle = textVertical.backgroundColor;
      ctx.fillRect(rectLeft, rectTop, rectRight - rectLeft, rectBottom - rectTop);
      ctx.lineWidth = borderSize;
      ctx.strokeStyle = textVertical.borderColor;
      ctx.strokeRect(rectLeft, rectTop, rectRight - rectLeft, rectBottom - rectTop); // 绘制轴上的提示文字

      ctx.textBaseline = 'top';
      ctx.font = getFont(textSize);
      ctx.fillStyle = textVertical.color;
      ctx.fillText(text, xAxisLabelX, this.viewPortHandler.contentBottom() + borderSize + paddingTop);
    }
    /**
     * 渲染主图提示文字
     * @param ctx
     * @param kLineData
     * @param indicatorType
     * @param isCandle
     * @param tooltip
     * @param indicator
     * @param precision
     */

  }, {
    key: "renderMainChartTooltip",
    value: function renderMainChartTooltip(ctx, kLineData, indicatorType, isCandle, tooltip, indicator, precision) {
      var baseDataStyle = tooltip.data.base;
      var indicatorDataStyle = tooltip.data.indicator;
      var indicatorColors = indicator.lineColors;
      var data = this.getRenderIndicatorTooltipData(kLineData, indicatorType, indicatorDataStyle, precision);

      if (baseDataStyle.showType === TooltipMainChartTextDisplayType.FIXED) {
        var startY = baseDataStyle.text.marginTop;
        this.renderMainChartFixedBaseDataTooltipText(ctx, startY, kLineData, baseDataStyle, precision);

        if (isCandle) {
          startY += baseDataStyle.text.size + baseDataStyle.text.marginBottom + tooltip.data.indicator.text.marginTop;
          this.renderIndicatorTooltipText(ctx, startY, data, indicatorDataStyle, indicatorColors);
        }
      } else {
        this.renderMainChartFloatRectText(ctx, kLineData, isCandle ? data : {}, baseDataStyle, indicatorDataStyle, indicatorColors, precision);
      }

      if (isCandle) {
        this.renderIndicatorLineCircle(ctx, indicatorType, this.candleViewPortHandler.contentTop(), data.values, this.candleYAxisRender, indicatorColors, tooltip.cross.display);
      }
    }
    /**
     * 渲染指标图提示文字
     * @param ctx
     * @param offsetTop
     * @param kLineData
     * @param indicatorType
     * @param tooltip
     * @param indicator
     * @param isVolChart
     * @param precision
     */

  }, {
    key: "renderIndicatorChartTooltip",
    value: function renderIndicatorChartTooltip(ctx, offsetTop, kLineData, indicatorType, tooltip, indicator, isVolChart, precision) {
      var indicatorDataStyle = tooltip.data.indicator;
      var data = this.getRenderIndicatorTooltipData(kLineData, indicatorType, indicatorDataStyle, precision);
      var indicatorLineColors = indicator.lineColors;
      this.renderIndicatorTooltipText(ctx, offsetTop + indicatorDataStyle.text.marginTop, data, indicatorDataStyle, indicatorLineColors);
      var circleOffsetTop = isVolChart ? this.candleViewPortHandler.height + this.volViewPortHandler.contentTop() : this.candleViewPortHandler.height + this.volViewPortHandler.height + this.subIndicatorViewPortHandler.contentTop();
      this.renderIndicatorLineCircle(ctx, indicatorType, circleOffsetTop, data.values, isVolChart ? this.volYAxisRender : this.subIndicatorYAxisRender, indicatorLineColors, tooltip.cross.display);
    }
    /**
     * 渲染主图固定的基础数据文字
     * @param ctx
     * @param startY
     * @param kLineData
     * @param baseDataStyle
     * @param precision
     */

  }, {
    key: "renderMainChartFixedBaseDataTooltipText",
    value: function renderMainChartFixedBaseDataTooltipText(ctx, startY, kLineData, baseDataStyle, precision) {
      var values = this.getMainChartBaseValues(kLineData, baseDataStyle, precision);
      var textMarginLeft = baseDataStyle.text.marginLeft;
      var textMarginRight = baseDataStyle.text.marginRight;
      var textSize = baseDataStyle.text.size;
      var textColor = baseDataStyle.text.color;
      var labels = baseDataStyle.labels;
      ctx.textBaseline = 'top';
      ctx.font = getFont(textSize);
      var startX = this.viewPortHandler.contentLeft() + textMarginLeft;
      labels.forEach(function (label, i) {
        var labelText = "".concat(label, ": ");
        var labelWidth = calcTextWidth(textSize, labelText);
        ctx.fillStyle = textColor;
        ctx.fillText(labelText, startX, startY);
        startX += labelWidth;
        var value = values[i] || '--';
        var valueText;

        if (_typeof(value) === 'object') {
          valueText = value.value || '--';
          ctx.fillStyle = value.color || textColor;
        } else {
          ctx.fillStyle = textColor;
          valueText = value;
        }

        var textWidth = calcTextWidth(textSize, valueText);
        ctx.fillText(valueText, startX, startY);
        startX += textWidth + textMarginLeft + textMarginRight;
      });
    }
    /**
     * 渲染主图浮动文字
     * @param ctx
     * @param kLineData
     * @param indicatorData
     * @param baseDataStyle
     * @param indicatorDataStyle
     * @param indicatorColors
     * @param precision
     */

  }, {
    key: "renderMainChartFloatRectText",
    value: function renderMainChartFloatRectText(ctx, kLineData, indicatorData, baseDataStyle, indicatorDataStyle) {
      var indicatorColors = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : [];
      var precision = arguments.length > 6 ? arguments[6] : undefined;
      var baseLabels = baseDataStyle.labels;
      var baseValues = this.getMainChartBaseValues(kLineData, baseDataStyle, precision);
      var baseTextMarginLeft = baseDataStyle.text.marginLeft;
      var baseTextMarginRight = baseDataStyle.text.marginRight;
      var baseTextMarginTop = baseDataStyle.text.marginTop;
      var baseTextMarginBottom = baseDataStyle.text.marginBottom;
      var baseTextSize = baseDataStyle.text.size;
      var baseTextColor = baseDataStyle.text.color;
      ctx.textBaseline = 'top';
      var maxLabelWidth = 0;
      baseLabels.forEach(function (label, i) {
        var value = baseValues[i] || '--';
        var v = value;

        if (_typeof(value) === 'object') {
          v = value.value || '--';
        }

        var text = "".concat(label, ": ").concat(v);
        var labelWidth = calcTextWidth(baseTextSize, text) + baseTextMarginLeft + baseTextMarginRight;
        maxLabelWidth = Math.max(maxLabelWidth, labelWidth);
      });
      var indicatorLabels = indicatorData.labels || [];
      var indicatorValues = indicatorData.values || [];
      var indicatorTextMarginLeft = indicatorDataStyle.text.marginLeft;
      var indicatorTextMarginRight = indicatorDataStyle.text.marginRight;
      var indicatorTextMarginTop = indicatorDataStyle.text.marginTop;
      var indicatorTextMarginBottom = indicatorDataStyle.text.marginBottom;
      var indicatorTextSize = indicatorDataStyle.text.size;
      indicatorLabels.forEach(function (label, i) {
        var v = indicatorValues[i] || '--';
        var text = "".concat(label, ": ").concat(v);
        var labelWidth = calcTextWidth(indicatorTextSize, text) + indicatorTextMarginLeft + indicatorTextMarginRight;
        maxLabelWidth = Math.max(maxLabelWidth, labelWidth);
      });
      var floatRect = baseDataStyle.floatRect;
      var floatRectBorderSize = floatRect.borderSize;
      var floatRectPaddingLeft = floatRect.paddingLeft;
      var floatRectPaddingRight = floatRect.paddingRight;
      var floatRectPaddingTop = floatRect.paddingTop;
      var floatRectPaddingBottom = floatRect.paddingBottom;
      var floatRectLeft = floatRect.left;
      var floatRectRight = floatRect.right;
      var floatRectWidth = floatRectBorderSize * 2 + maxLabelWidth + floatRectPaddingLeft + floatRectPaddingRight;
      var floatRectHeight = floatRectBorderSize * 2 + floatRectPaddingTop + floatRectPaddingBottom + (baseTextMarginBottom + baseTextMarginTop + baseTextSize) * baseLabels.length + (indicatorTextMarginTop + indicatorTextMarginBottom + indicatorTextSize) * indicatorLabels.length;
      var centerPoint = this.volViewPortHandler.getContentCenter();
      var rectX;
      var crossPoint = this.dataProvider.crossPoint;

      if (crossPoint && crossPoint.x < centerPoint.x) {
        rectX = this.viewPortHandler.contentRight() - floatRectRight - floatRectWidth;
      } else {
        rectX = this.viewPortHandler.contentLeft() + floatRectLeft;
      }

      var rectY = floatRect.top;
      var radius = floatRect.borderRadius;
      ctx.lineWidth = floatRectBorderSize;
      ctx.strokeStyle = floatRect.borderColor;
      ctx.fillStyle = floatRect.fillColor;
      this.renderRoundRect(ctx, rectX, rectY, floatRectWidth, floatRectHeight, radius);
      ctx.stroke();
      this.renderRoundRect(ctx, rectX, rectY, floatRectWidth, floatRectHeight, radius);
      ctx.fill();
      var baseLabelX = rectX + floatRectBorderSize + floatRectPaddingLeft + baseTextMarginLeft;
      var labelY = rectY + floatRectBorderSize + floatRectPaddingTop; // 开始渲染基础数据文字

      ctx.font = getFont(baseTextSize);
      baseLabels.forEach(function (label, i) {
        labelY += baseTextMarginTop;
        ctx.textAlign = 'left';
        ctx.fillStyle = baseTextColor;
        ctx.fillText("".concat(label, ": "), baseLabelX, labelY);
        var value = baseValues[i] || '--';
        var text;
        ctx.fillStyle = value.color || baseTextColor;

        if (_typeof(value) === 'object') {
          text = value.value || '--';
        } else {
          text = value;
        }

        ctx.textAlign = 'right';
        ctx.fillText(text, rectX + floatRectWidth - floatRectBorderSize - baseTextMarginRight - floatRectPaddingRight, labelY);
        labelY += baseTextSize + baseTextMarginBottom;
      }); // 开始渲染指标数据文字

      var indicatorLabelX = rectX + floatRectBorderSize + floatRectPaddingLeft + indicatorTextMarginLeft;
      var colorLength = indicatorColors.length;
      ctx.font = getFont(indicatorTextSize);
      indicatorLabels.forEach(function (label, i) {
        labelY += indicatorTextMarginTop;
        ctx.textAlign = 'left';
        ctx.fillStyle = indicatorColors[i % colorLength] || indicatorDataStyle.text.color;
        ctx.fillText("".concat(label.toUpperCase(), ": "), indicatorLabelX, labelY);
        ctx.textAlign = 'right';
        ctx.fillText(indicatorValues[i] || '--', rectX + floatRectWidth - floatRectBorderSize - indicatorTextMarginRight - floatRectPaddingRight, labelY);
        labelY += indicatorTextSize + indicatorTextMarginBottom;
      });
      ctx.textAlign = 'left';
    }
    /**
     * 渲染圆角矩形
     * @param ctx
     * @param x
     * @param y
     * @param w
     * @param h
     * @param r
     */

  }, {
    key: "renderRoundRect",
    value: function renderRoundRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }
    /**
     * 获取主信息提示值
     * @param kLineData
     * @param baseDataStyle
     * @param precision
     * @returns {*}
     */

  }, {
    key: "getMainChartBaseValues",
    value: function getMainChartBaseValues(kLineData, baseDataStyle, precision) {
      var baseValues = baseDataStyle.values;
      var values = [];

      if (baseValues) {
        if (isFunction(baseValues)) {
          values = baseValues(kLineData) || [];
        } else {
          values = baseValues;
        }
      } else {
        values = [formatValue(kLineData, 'timestamp'), formatValue(kLineData, 'open'), formatValue(kLineData, 'close'), formatValue(kLineData, 'high'), formatValue(kLineData, 'low'), formatValue(kLineData, 'volume')];
        values.forEach(function (value, index) {
          switch (index) {
            case 0:
              {
                values[index] = formatDate(value, 'YYYY-MM-DD hh:mm');
                break;
              }

            case values.length - 1:
              {
                values[index] = formatPrecision(value, precision.volumePrecision);
                break;
              }

            default:
              {
                values[index] = formatPrecision(value, precision.pricePrecision);
                break;
              }
          }
        });
      }

      return values;
    }
    /**
     * 绘制指标提示文字
     * @param ctx
     * @param startY
     * @param data
     * @param indicatorDataStyle
     * @param indicatorColors
     */

  }, {
    key: "renderIndicatorTooltipText",
    value: function renderIndicatorTooltipText(ctx, startY, data, indicatorDataStyle) {
      var indicatorColors = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
      var nameText = data.name;
      var labels = data.labels;
      var values = data.values;
      var indicatorText = indicatorDataStyle.text;
      var textMarginLeft = indicatorText.marginLeft;
      var textMarginRight = indicatorText.marginRight;
      var labelX = this.viewPortHandler.contentLeft() + textMarginLeft;
      var textSize = indicatorText.size;
      var textColor = indicatorDataStyle.text.color;
      var lineColorSize = indicatorColors.length;
      ctx.textBaseline = 'top';
      ctx.font = getFont(textSize);
      var nameTextWidth = calcTextWidth(textSize, nameText);
      ctx.fillStyle = textColor;
      ctx.fillText(nameText, labelX, startY);
      labelX += textMarginLeft + nameTextWidth;

      for (var i = 0; i < labels.length; i++) {
        var text = "".concat(labels[i].toUpperCase(), ": ").concat(values[i] || '--');
        var textWidth = calcTextWidth(textSize, text);
        ctx.fillStyle = indicatorColors[i % lineColorSize] || textColor;
        ctx.fillText(text, labelX, startY);
        labelX += textMarginLeft + textMarginRight + textWidth;
      }
    }
    /**
     * 渲染指标线上的圆点
     * @param ctx
     * @param indicatorType
     * @param values
     * @param offsetTop
     * @param yAxisRender
     * @param indicatorColors
     * @param isShowCross
     */

  }, {
    key: "renderIndicatorLineCircle",
    value: function renderIndicatorLineCircle(ctx, indicatorType, offsetTop) {
      var values = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
      var yAxisRender = arguments.length > 4 ? arguments[4] : undefined;
      var indicatorColors = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : [];
      var isShowCross = arguments.length > 6 ? arguments[6] : undefined;
      var crossPoint = this.dataProvider.crossPoint;

      if (!crossPoint || this.dataProvider.currentMarkerType !== MarkerType.NONE || indicatorType === IndicatorType.SAR || !isShowCross || this.dataProvider.isDragMarker) {
        return;
      }

      var colorSize = indicatorColors.length;
      var valueSize = indicatorType === IndicatorType.MACD || indicatorType === IndicatorType.VOL ? values.length - 1 : values.length;

      for (var i = 0; i < valueSize; i++) {
        var value = values[i];

        if (value || value === 0) {
          var y = yAxisRender.getY(value) + offsetTop;
          ctx.fillStyle = indicatorColors[i % colorSize];
          ctx.beginPath();
          ctx.arc(crossPoint.x, y, 3, 0, Math.PI * 2);
          ctx.closePath();
          ctx.fill();
        }
      }
    }
    /**
     * 获取需要渲染的指标提示数据
     * @param kLineData
     * @param indicatorType
     * @param indicatorDataStyle
     * @param precision
     * @returns {{values: Array, labels: Array}}
     */

  }, {
    key: "getRenderIndicatorTooltipData",
    value: function getRenderIndicatorTooltipData(kLineData, indicatorType, indicatorDataStyle, precision) {
      var values = [];
      var labels = [];
      var params = this.indicatorParams[indicatorType] || [];

      switch (indicatorType) {
        case IndicatorType.MA:
          {
            params.forEach(function (p) {
              labels.push("ma".concat(p));
            });
            break;
          }

        case IndicatorType.VOL:
          {
            params.forEach(function (p) {
              labels.push("ma".concat(p));
            });
            labels.push('num');
            break;
          }

        case IndicatorType.MACD:
          {
            labels = ['diff', 'dea', 'macd'];
            break;
          }

        case IndicatorType.BOLL:
          {
            labels = ['up', 'mid', 'dn'];
            break;
          }

        case IndicatorType.BIAS:
          {
            params.forEach(function (p) {
              labels.push("bias".concat(p));
            });
            break;
          }

        case IndicatorType.BRAR:
          {
            labels = ['br', 'ar'];
            break;
          }

        case IndicatorType.CCI:
          {
            labels = ['cci'];
            break;
          }

        case IndicatorType.CR:
          {
            labels = ['cr', 'ma1', 'ma2', 'ma3', 'ma4'];
            break;
          }

        case IndicatorType.DMA:
          {
            labels = ['dif', 'difMa'];
            break;
          }

        case IndicatorType.DMI:
          {
            labels = ['mdi', 'pdi', 'adx', 'adxr'];
            break;
          }

        case IndicatorType.KDJ:
          {
            labels = ['k', 'd', 'j'];
            break;
          }

        case IndicatorType.RSI:
          {
            params.forEach(function (p) {
              labels.push("rsi".concat(p));
            });
            break;
          }

        case IndicatorType.PSY:
          {
            labels = ['psy'];
            break;
          }

        case IndicatorType.TRIX:
          {
            labels = ['trix', 'maTrix'];
            break;
          }

        case IndicatorType.OBV:
          {
            labels = ['obv', 'maObv'];
            break;
          }

        case IndicatorType.VR:
          {
            labels = ['vr', 'maVr'];
            break;
          }

        case IndicatorType.WR:
          {
            labels = ['wr1', 'wr2', 'wr3'];
            break;
          }

        case IndicatorType.MTM:
          {
            labels = ['mtm', 'mtmMa'];
            break;
          }

        case IndicatorType.EMV:
          {
            labels = ['emv', 'maEmv'];
            break;
          }

        case IndicatorType.SAR:
          {
            labels = ['sar'];
            break;
          }
      }

      var name = '';

      if (labels.length > 0) {
        name = "".concat(indicatorType);

        if (params && isArray(params) && params.length > 0) {
          name = "".concat(name, "(").concat(params.join(','), ")");
        }

        var indicatorData = formatValue(kLineData, indicatorType.toLowerCase());
        labels.forEach(function (label) {
          values.push(formatValue(indicatorData, label));
        });
        var decimal = getIndicatorPrecision(precision.pricePrecision, precision.volumePrecision)[indicatorType];
        values.forEach(function (value, index) {
          values[index] = formatPrecision(value, decimal);
        });
      }

      return {
        labels: labels,
        values: values,
        name: name
      };
    }
  }]);

  return TooltipRender;
}(Render);

var TooltipChart =
/*#__PURE__*/
function (_Chart) {
  _inherits(TooltipChart, _Chart);

  function TooltipChart(dom, style, mainChart, volChart, subIndicatorChart, xAxisChart, dataProvider, indicatorParams, precision) {
    var _this;

    _classCallCheck(this, TooltipChart);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TooltipChart).call(this, dom, style));
    _this.mainChart = mainChart;
    _this.volChart = volChart;
    _this.subIndicatorChart = subIndicatorChart;
    _this.dataProvider = dataProvider;
    _this.tooltipRender = new TooltipRender(_this.viewPortHandler, dataProvider, indicatorParams, mainChart.viewPortHandler, volChart.viewPortHandler, subIndicatorChart.viewPortHandler, mainChart.yAxisRender, volChart.yAxisRender, subIndicatorChart.yAxisRender);
    _this.precision = precision;
    return _this;
  }

  _createClass(TooltipChart, [{
    key: "draw",
    value: function draw() {
      var kLineData = this.dataProvider.dataList[this.dataProvider.currentTooltipDataPos] || {};
      var tooltip = this.style.tooltip; // 如果不是绘图才显示十字线

      if (this.dataProvider.currentMarkerType === MarkerType.NONE && !this.dataProvider.isDragMarker) {
        this.tooltipRender.renderCrossHorizontalLine(this.ctx, this.mainChart.indicatorType, this.subIndicatorChart.indicatorType, this.style.yAxis.position === YAxisPosition.LEFT, this.style.yAxis.tick.text.position === YAxisTextPosition.OUTSIDE, tooltip, this.precision);
        this.tooltipRender.renderCrossVerticalLine(this.ctx, kLineData, tooltip);
      }

      if (this.dataProvider.dataList.length > 0) {
        var tooltipData = tooltip.data;

        if (tooltipData.displayRule === TooltipTextDisplayRule.ALWAYS || tooltipData.displayRule === TooltipTextDisplayRule.FOLLOW_CROSS && this.dataProvider.crossPoint) {
          var indicator = this.style.indicator;
          this.tooltipRender.renderMainChartTooltip(this.ctx, kLineData, this.mainChart.indicatorType, this.mainChart.chartType === ChartType.CANDLE, tooltip, indicator, this.precision);

          if (this.volChart.indicatorType !== IndicatorType.NO) {
            this.tooltipRender.renderIndicatorChartTooltip(this.ctx, this.mainChart.viewPortHandler.height, kLineData, IndicatorType.VOL, tooltip, indicator, true, this.precision);
          }

          if (this.subIndicatorChart.indicatorType !== IndicatorType.NO) {
            this.tooltipRender.renderIndicatorChartTooltip(this.ctx, this.mainChart.viewPortHandler.height + this.volChart.viewPortHandler.height, kLineData, this.subIndicatorChart.indicatorType, tooltip, indicator, false, this.precision);
          }
        }
      }
    }
  }]);

  return TooltipChart;
}(Chart);

var XAxisRender =
/*#__PURE__*/
function (_AxisRender) {
  _inherits(XAxisRender, _AxisRender);

  function XAxisRender() {
    _classCallCheck(this, XAxisRender);

    return _possibleConstructorReturn(this, _getPrototypeOf(XAxisRender).apply(this, arguments));
  }

  _createClass(XAxisRender, [{
    key: "renderStrokeLine",

    /**
     * 渲染边框
     * @param ctx
     * @param xAxis
     * @param display
     */
    value: function renderStrokeLine(ctx, xAxis, display) {
      if (!display) {
        return;
      }

      ctx.strokeStyle = xAxis.line.color;
      ctx.lineWidth = xAxis.line.size;
      ctx.beginPath();
      ctx.moveTo(this.viewPortHandler.contentLeft(), this.viewPortHandler.contentTop());
      ctx.lineTo(this.viewPortHandler.contentRight(), this.viewPortHandler.contentTop());
      ctx.stroke();
      ctx.closePath();
    }
    /**
     * 绘制轴线
     * @param ctx
     * @param xAxis
     */

  }, {
    key: "renderAxisLine",
    value: function renderAxisLine(ctx, xAxis) {
      if (!xAxis.display || !xAxis.line.display) {
        return;
      }

      ctx.strokeStyle = xAxis.line.color;
      ctx.lineWidth = xAxis.line.size;
      ctx.beginPath();
      ctx.moveTo(this.viewPortHandler.contentLeft(), this.viewPortHandler.contentBottom());
      ctx.lineTo(this.viewPortHandler.contentRight(), this.viewPortHandler.contentBottom());
      ctx.stroke();
      ctx.closePath();
    }
    /**
     * 绘制坐标轴上的文字
     * @param ctx
     * @param xAxis
     * @param period
     */

  }, {
    key: "renderAxisLabels",
    value: function renderAxisLabels(ctx, xAxis, period) {
      var tickText = xAxis.tick.text;

      if (!xAxis.display || !tickText.display) {
        return;
      }

      var periodType = period.replace(/[1-9]/, '').toUpperCase();
      var dateFormatType;

      switch (periodType) {
        case 'D':
        case 'W':
          {
            dateFormatType = 'YYYY-MM-DD';
            break;
          }

        case 'M':
          {
            dateFormatType = 'YYYY-MM';
            break;
          }

        case 'Y':
          {
            dateFormatType = 'YYYY';
            break;
          }

        default:
          {
            dateFormatType = 'hh:mm';
            break;
          }
      }

      var tickLine = xAxis.tick.line;
      ctx.textBaseline = 'top';
      ctx.font = getFont(tickText.size);
      ctx.textAlign = 'center';
      ctx.fillStyle = tickText.color;
      var labelY = this.viewPortHandler.contentBottom() + tickText.margin;

      if (tickLine.display) {
        labelY += tickLine.length;
      }

      var valuePointLength = this.valuePoints.length;

      for (var i = 0; i < valuePointLength; i++) {
        var x = this.valuePoints[i];
        var kLineModel = this.dataProvider.dataList[parseInt(this.values[i])];
        var timestamp = kLineModel.timestamp;
        var dateText = formatDate(timestamp, dateFormatType);

        if (i !== valuePointLength - 1) {
          var nextKLineModel = this.dataProvider.dataList[parseInt(this.values[i + 1])];
          var nextTimestamp = nextKLineModel.timestamp;

          if (periodType === 'D' || periodType === 'W') {
            var month = formatDate(timestamp, 'YYYY-MM');

            if (month !== formatDate(nextTimestamp, 'YYYY-MM')) {
              dateText = month;
            }
          } else if (periodType === 'M') {
            var year = formatDate(timestamp, 'YYYY');

            if (year !== formatDate(nextTimestamp, 'YYYY')) {
              dateText = year;
            }
          } else if (!periodType) {
            var day = formatDate(timestamp, 'MM-DD');

            if (day !== formatDate(nextTimestamp, 'MM-DD')) {
              dateText = day;
            }
          }
        }

        ctx.fillText(dateText, x, labelY);
      }
    }
    /**
     * 绘制分割线
     * @param ctx
     * @param xAxis
     */

  }, {
    key: "renderSeparatorLines",
    value: function renderSeparatorLines(ctx, xAxis) {
      if (!xAxis.display || !xAxis.separatorLine.display) {
        return;
      }

      ctx.strokeStyle = xAxis.separatorLine.color;
      ctx.lineWidth = xAxis.separatorLine.size;

      if (xAxis.separatorLine.style === LineStyle.DASH) {
        ctx.setLineDash(xAxis.separatorLine.dashValue);
      }

      for (var i = 0; i < this.valuePoints.length; i++) {
        var x = this.valuePoints[i];
        ctx.beginPath();
        ctx.moveTo(x, this.viewPortHandler.contentTop());
        ctx.lineTo(x, this.viewPortHandler.contentBottom());
        ctx.stroke();
        ctx.closePath();
      }

      ctx.setLineDash([]);
    }
    /**
     * 绘制tick线
     * @param ctx
     * @param xAxis
     */

  }, {
    key: "renderTickLines",
    value: function renderTickLines(ctx, xAxis) {
      var tickLine = xAxis.tick.line;

      if (!xAxis.display || !tickLine.display) {
        return;
      }

      ctx.lineWidth = tickLine.size;
      ctx.strokeStyle = tickLine.color;
      var startY = this.viewPortHandler.contentBottom();
      var endY = startY + tickLine.length;

      for (var i = 0; i < this.valuePoints.length; i++) {
        var x = this.valuePoints[i];
        ctx.beginPath();
        ctx.moveTo(x, startY);
        ctx.lineTo(x, endY);
        ctx.stroke();
        ctx.closePath();
      }
    }
  }, {
    key: "computeAxis",
    value: function computeAxis(xAxis) {
      var minPos = this.dataProvider.minPos;
      var max = Math.min(minPos + this.dataProvider.range - 1, this.dataProvider.dataList.length - 1);
      this.computeAxisValues(minPos, max, 8.0, xAxis);
      this.pointValuesToPixel();
    }
  }, {
    key: "fixComputeAxisValues",
    value: function fixComputeAxisValues(xAxis) {
      var dataSize = this.dataProvider.dataList.length;

      if (dataSize > 0) {
        var defaultLabelWidth = calcTextWidth(xAxis.tick.text.size, '0000-00-00 00:00:00');
        var startPos = Math.ceil(defaultLabelWidth / 2 / this.dataProvider.dataSpace) - 1;

        if (startPos > dataSize - 1) {
          startPos = dataSize - 1;
        }

        var barCount = Math.ceil(defaultLabelWidth / (this.dataProvider.dataSpace * (1 + DATA_MARGIN_SPACE_RATE))) + 1;

        if (dataSize > barCount) {
          this.valueCount = Math.floor((dataSize - startPos) / barCount) + 1;
        } else {
          this.valueCount = 1;
        }

        this.values = [startPos];

        for (var i = 1; i < this.valueCount; i++) {
          this.values[i] = startPos + i * (barCount - 1);
        }
      } else {
        this.valueCount = 0;
        this.values = [];
      }
    }
  }, {
    key: "pointValuesToPixel",
    value: function pointValuesToPixel() {
      var offsetLeft = this.viewPortHandler.contentLeft();
      this.valuePoints = [];

      for (var i = 0; i < this.values.length; i++) {
        var pos = this.values[i];
        this.valuePoints[i] = offsetLeft + ((pos - this.dataProvider.minPos) * this.dataProvider.dataSpace + this.dataProvider.dataSpace * (1 - DATA_MARGIN_SPACE_RATE) / 2);
      }
    }
  }, {
    key: "calcRange",
    value: function calcRange(max, min) {
      if (max < 0) {
        return 0;
      }

      return Math.abs(max - min) + 1;
    }
  }, {
    key: "isFillChart",
    value: function isFillChart() {
      return this.dataProvider.dataList.length > this.dataProvider.range;
    }
  }]);

  return XAxisRender;
}(AxisRender);

var XAxisChart =
/*#__PURE__*/
function (_Chart) {
  _inherits(XAxisChart, _Chart);

  function XAxisChart(dom, style, dataProvider, period) {
    var _this;

    _classCallCheck(this, XAxisChart);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(XAxisChart).call(this, dom, style));
    _this.xAxisRender = new XAxisRender(_this.viewPortHandler, dataProvider);
    _this.period = period;
    return _this;
  }

  _createClass(XAxisChart, [{
    key: "draw",
    value: function draw() {
      var xAxis = this.style.xAxis;
      this.xAxisRender.computeAxis(xAxis);
      this.xAxisRender.renderAxisLine(this.ctx, xAxis);
      this.xAxisRender.renderAxisLabels(this.ctx, xAxis, this.period.period);
      this.xAxisRender.renderSeparatorLines(this.ctx, xAxis);
      this.xAxisRender.renderTickLines(this.ctx, xAxis);
      this.xAxisRender.renderStrokeLine(this.ctx, xAxis, this.style.grid);
    }
  }]);

  return XAxisChart;
}(Chart);

var calcIndicator = {};
/**
 * 计算均价
 * @param dataList
 * @returns {*}
 */

calcIndicator.average = function (dataList) {
  var totalTurnover = 0;
  var totalVolume = 0;
  return calc(dataList, function (i) {
    var turnover = dataList[i].turnover || 0;
    totalVolume += dataList[i].volume || 0;
    totalTurnover += turnover;

    if (totalVolume !== 0) {
      dataList[i].average = totalTurnover / totalVolume;
    } else {
      dataList[i].average = 0;
    }
  });
};
/**
 * 计算均线数据
 * 默认参数5，10，20，60
 * @param dataList
 * @param params
 * @returns {*}
 */


calcIndicator[IndicatorType.MA] = function (dataList, params) {
  if (!checkParams(params)) {
    return dataList;
  }

  var closeSums = [];
  var paramsLength = params.length;
  return calc(dataList, function (i) {
    var ma = {};
    var close = dataList[i].close;

    for (var j = 0; j < paramsLength; j++) {
      closeSums[j] = (closeSums[j] || 0) + close;
      var p = params[j];

      if (i < p) {
        ma["ma".concat(p)] = closeSums[j] / (i + 1);
      } else {
        closeSums[j] -= dataList[i - p].close;
        ma["ma".concat(p)] = closeSums[j] / p;
      }
    }

    dataList[i].ma = ma;
  });
};
/**
 * 计算成交量包含ma5、ma10、ma20
 * 默认参数5，10，20
 * @param dataList
 * @param params
 * @return
 */


calcIndicator[IndicatorType.VOL] = function (dataList, params) {
  if (!checkParams(params)) {
    return dataList;
  }

  var volumeSums = [];
  var paramsLength = params.length;
  return calc(dataList, function (i) {
    var num = dataList[i].volume;
    var vol = {};

    for (var j = 0; j < paramsLength; j++) {
      volumeSums[j] = (volumeSums[j] || 0) + num;
      var p = params[j];

      if (i < p) {
        vol["ma".concat(p)] = volumeSums[j] / (i + 1);
      } else {
        volumeSums[j] -= dataList[i - p].volume;
        vol["ma".concat(p)] = volumeSums[j] / p;
      }
    }

    vol.num = num;
    dataList[i].vol = vol;
  });
};
/**
 * 计算MACD指标
 *
 * MACD：参数快线移动平均、慢线移动平均、移动平均，
 * 默认参数值12、26、9。
 * 公式：⒈首先分别计算出收盘价12日指数平滑移动平均线与26日指数平滑移动平均线，分别记为EMA(12）与EMA(26）。
 * ⒉求这两条指数平滑移动平均线的差，即：DIFF=EMA（SHORT）－EMA（LONG）。
 * ⒊再计算DIFF的M日的平均的指数平滑移动平均线，记为DEA。
 * ⒋最后用DIFF减DEA，得MACD。MACD通常绘制成围绕零轴线波动的柱形图。MACD柱状大于0涨颜色，小于0跌颜色。
 * @param dataList
 * @param params
 * @return
 */


calcIndicator[IndicatorType.MACD] = function (dataList, params) {
  if (!checkParamsWithSize(params, 3)) {
    return dataList;
  }

  var emaShort;
  var emaLong;
  var oldEmaShort = 0;
  var oldEmaLong = 0;
  var diff = 0;
  var dea = 0;
  var oldDea = 0;
  var macd = 0;
  return calc(dataList, function (i) {
    var closePrice = dataList[i].close;

    if (i === 0) {
      emaShort = closePrice;
      emaLong = closePrice;
    } else {
      emaShort = (2 * closePrice + (params[0] - 1) * oldEmaShort) / (params[0] + 1);
      emaLong = (2 * closePrice + (params[1] - 1) * oldEmaLong) / (params[1] + 1);
    }

    diff = emaShort - emaLong;
    dea = (diff * 2 + oldDea * (params[2] - 1)) / (params[2] + 1);
    macd = (diff - dea) * 2;
    oldEmaShort = emaShort;
    oldEmaLong = emaLong;
    oldDea = dea;
    dataList[i].macd = {
      diff: diff,
      dea: dea,
      macd: macd
    };
  });
};
/**
 * 计算BOLL指标
 * 默认参数20
 * @param dataList
 * @param params
 * @return
 */


calcIndicator[IndicatorType.BOLL] = function (dataList, params) {
  if (!checkParamsWithSize(params, 1)) {
    return dataList;
  }

  var closeSum = 0;
  var ma; // 中轨线

  var md; // 标准差

  var up; // 上轨线

  var dn; // 下轨线

  return calc(dataList, function (i) {
    var closePrice = dataList[i].close;
    closeSum += closePrice;

    if (i < params[0]) {
      ma = closeSum / (i + 1);
      md = getBollMd(dataList.slice(0, i + 1), ma);
    } else {
      closeSum -= dataList[i - params[0]].close;
      ma = closeSum / params[0];
      md = getBollMd(dataList.slice(i - (params[0] - 1), i + 1), ma);
    }

    up = ma + 2 * md;
    dn = ma - 2 * md;
    dataList[i].boll = {
      up: up,
      mid: ma,
      dn: dn
    };
  });
};
/**
 * 计算KDJ
 * 默认参数9，3，3
 * @param dataList
 * @param params
 * @return
 */


calcIndicator[IndicatorType.KDJ] = function (dataList, params) {
  if (!checkParamsWithSize(params, 3)) {
    return dataList;
  }

  var k;
  var d;
  var j; // n日内最低价

  var ln; // n日内最高价

  var hn;
  return calc(dataList, function (i) {
    // n日收盘价
    var cn = dataList[i].close;

    if (i < params[0] - 1) {
      ln = getLow(dataList.slice(0, i + 1));
      hn = getHigh(dataList.slice(0, i + 1));
    } else {
      ln = getLow(dataList.slice(i - (params[0] - 1), i + 1));
      hn = getHigh(dataList.slice(i - (params[0] - 1), i + 1));
    }

    var rsv = (cn - ln) / (hn - ln === 0 ? 1 : hn - ln) * 100; // 当日K值=2/3×前一日K值+1/3×当日RSV
    // 当日D值=2/3×前一日D值+1/3×当日K值
    // 若无前一日K 值与D值，则可分别用50来代替。
    // J值=3*当日K值-2*当日D值

    k = (params[1] - 1) / params[1] * (i < params[0] - 1 ? 50.0 : dataList[i - 1].kdj.k) + 1.0 / params[1] * rsv;
    d = (params[2] - 1) / params[2] * (i < params[0] - 1 ? 50.0 : dataList[i - 1].kdj.d) + 1.0 / params[2] * k;
    j = 3.0 * k - 2.0 * d;
    dataList[i].kdj = {
      k: k,
      d: d,
      j: j
    };
  });
};
/**
 * 计算RSI
 * 默认参数6，12，24
 * @param dataList
 * @param params
 * @return
 */


calcIndicator[IndicatorType.RSI] = function (dataList, params) {
  if (!checkParamsWithSize(params, 3)) {
    return dataList;
  } // N日RSI =
  // N日内收盘涨幅的平均值/(N日内收盘涨幅均值+N日内收盘跌幅均值) ×100%


  var sumCloseA1 = 0;
  var sumCloseB1 = 0;
  var sumCloseA2 = 0;
  var sumCloseB2 = 0;
  var sumCloseA3 = 0;
  var sumCloseB3 = 0;
  var a1;
  var b1;
  var a2;
  var b2;
  var a3;
  var b3;
  return calc(dataList, function (i) {
    var _rsi;

    var rsi = (_rsi = {}, _defineProperty(_rsi, "rsi".concat(params[0]), 0), _defineProperty(_rsi, "rsi".concat(params[1]), 0), _defineProperty(_rsi, "rsi".concat(params[2]), 0), _rsi);

    if (i > 0) {
      var tmp = dataList[i].close - dataList[i - 1].close;

      if (tmp > 0) {
        sumCloseA1 += tmp;
        sumCloseA2 += tmp;
        sumCloseA3 += tmp;
      } else {
        var absTmp = Math.abs(tmp);
        sumCloseB1 += absTmp;
        sumCloseB2 += absTmp;
        sumCloseB3 += absTmp;
      }

      if (i < params[0]) {
        a1 = sumCloseA1 / (i + 1);
        b1 = (sumCloseA1 + sumCloseB1) / (i + 1);
      } else {
        if (i > params[0]) {
          var agoTmp = dataList[i - params[0]].close - dataList[i - params[0] - 1].close;

          if (agoTmp > 0) {
            sumCloseA1 -= agoTmp;
          } else {
            sumCloseB1 -= Math.abs(agoTmp);
          }
        }

        a1 = sumCloseA1 / params[0];
        b1 = (sumCloseA1 + sumCloseB1) / params[0];
      }

      rsi["rsi".concat(params[0])] = b1 !== 0.0 ? a1 / b1 * 100 : 0.0;

      if (i < params[1]) {
        a2 = sumCloseA2 / (i + 1);
        b2 = (sumCloseA2 + sumCloseB2) / (i + 1);
      } else {
        if (i > params[1]) {
          var _agoTmp = dataList[i - params[1]].close - dataList[i - params[1] - 1].close;

          if (_agoTmp > 0) {
            sumCloseA2 -= _agoTmp;
          } else {
            sumCloseB2 -= Math.abs(_agoTmp);
          }
        }

        a2 = sumCloseA2 / params[1];
        b2 = (sumCloseA2 + sumCloseB2) / params[1];
      }

      rsi["rsi".concat(params[1])] = b2 !== 0.0 ? a2 / b2 * 100 : 0.0;

      if (i < params[2]) {
        a3 = sumCloseA3 / (i + 1);
        b3 = (sumCloseA3 + sumCloseB3) / (i + 1);
      } else {
        if (i > params[2]) {
          var _agoTmp2 = dataList[i - params[2]].close - dataList[i - params[2] - 1].close;

          if (_agoTmp2 > 0) {
            sumCloseA3 -= _agoTmp2;
          } else {
            sumCloseB3 -= Math.abs(_agoTmp2);
          }
        }

        a3 = sumCloseA3 / params[2];
        b3 = (sumCloseA3 + sumCloseB3) / params[2];
      }

      rsi["rsi".concat(params[2])] = b3 !== 0.0 ? a3 / b3 * 100 : 0.0;
    }

    dataList[i].rsi = rsi;
  });
};
/**
 * 计算BIAS指标
 * 乖离率=[(当日收盘价-N日平均价)/N日平均价]*100%
 * 默认参数：6，12、24
 * @param dataList
 * @param params
 * @return
 */


calcIndicator[IndicatorType.BIAS] = function (dataList, params) {
  if (!checkParamsWithSize(params, 3)) {
    return dataList;
  }

  var mean1;
  var mean2;
  var mean3;
  var closes1 = 0;
  var closes2 = 0;
  var closes3 = 0;
  return calc(dataList, function (i) {
    var bias = {};
    var closePrice = dataList[i].close;
    closes1 += closePrice;
    closes2 += closePrice;
    closes3 += closePrice;

    if (i < params[0]) {
      mean1 = closes1 / (i + 1);
    } else {
      closes1 -= dataList[i - params[0]].close;
      mean1 = closes1 / params[0];
    }

    bias["bias".concat(params[0])] = (closePrice - mean1) / mean1 * 100;

    if (i < params[1]) {
      mean2 = closes2 / (i + 1);
    } else {
      closes2 -= dataList[i - params[1]].close;
      mean2 = closes2 / params[1];
    }

    bias["bias".concat(params[1])] = (closePrice - mean2) / mean2 * 100;

    if (i < params[2]) {
      mean3 = closes3 / (i + 1);
    } else {
      closes3 -= dataList[i - params[2]].close;
      mean3 = closes3 / params[2];
    }

    bias["bias".concat(params[2])] = (closePrice - mean3) / mean3 * 100;
    dataList[i].bias = bias;
  });
};
/**
 * 计算BRAR指标
 * 默认参数是26。
 * 公式N日BR=N日内（H－CY）之和除以N日内（CY－L）之和*100，
 * 其中，H为当日最高价，L为当日最低价，CY为前一交易日的收盘价，N为设定的时间参数。
 * N日AR=(N日内（H－O）之和除以N日内（O－L）之和)*100，
 * 其中，H为当日最高价，L为当日最低价，O为当日开盘价，N为设定的时间参数
 * @param dataList
 * @param params
 * @return
 */


calcIndicator[IndicatorType.BRAR] = function (dataList, params) {
  if (!checkParamsWithSize(params, 1)) {
    return dataList;
  }

  var br = 0;
  var ar = 0;
  var hcy = 0;
  var cyl = 0;
  var ho = 0;
  var ol = 0;
  return calc(dataList, function (i) {
    var high = dataList[i].high;
    var low = dataList[i].low;
    var open = dataList[i].open;
    ho += high - open;
    ol += open - low;

    if (i > 0) {
      var refClose = dataList[i - 1].close;
      hcy += high - refClose;
      cyl += refClose - low;

      if (i > params[0] - 1) {
        var agoHigh = dataList[i - params[0]].high;
        var agoLow = dataList[i - params[0]].low;
        var agoOpen = dataList[i - params[0]].open;

        if (i > params[0]) {
          var agoRefClose = dataList[i - params[0] - 1].close;
          hcy -= agoHigh - agoRefClose;
          cyl -= agoRefClose - agoLow;
        }

        ho -= agoHigh - agoOpen;
        ol -= agoOpen - agoLow;
      }

      if (ol !== 0) {
        ar = ho / ol * 100;
      } else {
        ar = 0;
      }

      if (cyl !== 0) {
        br = hcy / cyl * 100;
      } else {
        br = 0;
      }
    }

    dataList[i].brar = {
      br: br,
      ar: ar
    };
  });
};
/**
 * 计算CCI指标
 * CCI（N日）=（TP－MA）÷MD÷0.015
 * 其中，TP=（最高价+最低价+收盘价）÷3
 * MA=近N日收盘价的累计之和÷N
 * MD=近N日（MA－收盘价）的累计之和÷N
 * 默认参数13
 * @param dataList
 * @param params
 * @return
 */


calcIndicator[IndicatorType.CCI] = function (dataList, params) {
  if (!checkParamsWithSize(params, 1)) {
    return dataList;
  }

  var closes = 0.0;
  var closeMa;
  var closeMaList = [];
  var md;
  var maCloseSum = 0.0;
  var cci;
  return calc(dataList, function (i) {
    var closePrice = dataList[i].close;
    closes += closePrice;
    var tp = (dataList[i].high + dataList[i].low + closePrice) / 3;

    if (i < params[0]) {
      closeMa = closes / (i + 1);
      maCloseSum += Math.abs(closeMa - closePrice);
      closeMaList.push(closeMa);
      md = maCloseSum / (i + 1);
    } else {
      var agoClosePrice = dataList[i - params[0]].close;
      closes -= agoClosePrice;
      closeMa = closes / params[0];
      closeMaList.push(closeMa);
      maCloseSum += Math.abs(closeMa - closePrice);
      maCloseSum -= Math.abs(closeMaList[i - params[0]] - agoClosePrice);
      md = maCloseSum / params[0];
    }

    cci = md !== 0.0 ? (tp - closeMa) / md / 0.015 : 0.0;
    dataList[i].cci = {
      cci: cci
    };
  });
};
/**
 * 计算DMI
 *
 * @param dataList
 * @param params
 * @return
 */


calcIndicator[IndicatorType.DMI] = function (dataList, params) {
  if (!checkParamsWithSize(params, 2)) {
    return dataList;
  } // 默认参数 14，6
  // MTR:=EXPMEMA(MAX(MAX(HIGH-LOW,ABS(HIGH-REF(CLOSE,1))),ABS(REF(CLOSE,1)-LOW)),N)
  // HD :=HIGH-REF(HIGH,1);
  // LD :=REF(LOW,1)-LOW;
  // DMP:=EXPMEMA(IF(HD>0&&HD>LD,HD,0),N);
  // DMM:=EXPMEMA(IF(LD>0&&LD>HD,LD,0),N);
  //
  // PDI: DMP*100/MTR;
  // MDI: DMM*100/MTR;
  // ADX: EXPMEMA(ABS(MDI-PDI)/(MDI+PDI)*100,MM);
  // ADXR:EXPMEMA(ADX,MM);
  // 公式含义：
  // MTR赋值:最高价-最低价和最高价-昨收的绝对值的较大值和昨收-最低价的绝对值的较大值的N日指数平滑移动平均
  // HD赋值:最高价-昨日最高价
  // LD赋值:昨日最低价-最低价
  // DMP赋值:如果HD>0并且HD>LD,返回HD,否则返回0的N日指数平滑移动平均
  // DMM赋值:如果LD>0并且LD>HD,返回LD,否则返回0的N日指数平滑移动平均
  // 输出PDI:DMP*100/MTR
  // 输出MDI:DMM*100/MTR
  // 输出ADX:MDI-PDI的绝对值/(MDI+PDI)*100的MM日指数平滑移动平均
  // 输出ADXR:ADX的MM日指数平滑移动平均


  var pdi = 0.0;
  var mdi = 0.0;
  var adx = 0.0;
  var adxr = 0.0;
  var trList = [0.0];
  var trSum = 0.0;
  var dmpList = [0.0];
  var dmpSum = 0.0;
  var dmmList = [0.0];
  var dmmSum = 0.0;
  var dxList = [0.0];
  var dxSum = 0.0;
  return calc(dataList, function (i) {
    if (i > 0) {
      var refClose = dataList[i - 1].close;
      var highPrice = dataList[i].high;
      var lowPrice = dataList[i].low;
      var hl = highPrice - lowPrice;
      var hcy = Math.abs(highPrice - refClose);
      var lcy = Math.abs(lowPrice - refClose);
      var hhy = highPrice - dataList[i - 1].high;
      var lyl = dataList[i - 1].low - lowPrice;
      var tr = Math.max(Math.max(hl, hcy), lcy);
      trSum += tr;
      trList.push(tr);
      var h = hhy > 0.0 && hhy > lyl ? hhy : 0.0;
      dmpSum += h;
      dmpList.push(h);
      var l = lyl > 0 && lyl > hhy ? lyl : 0.0;
      dmmSum += l;
      dmmList.push(l);

      if (i > params[0] - 1) {
        trSum -= trList[i - params[0]];
        dmpSum -= dmpList[i - params[0]];
        dmmSum -= dmmList[i - params[0]];
      }

      if (trSum === 0) {
        pdi = 0;
        mdi = 0;
      } else {
        pdi = dmpSum * 100 / trSum;
        mdi = dmmSum * 100 / trSum;
      }

      var dx = Math.abs(mdi - pdi) / (mdi + pdi) * 100;
      dxSum += dx;
      dxList.push(dx);

      if (i < params[1]) {
        adx = dxSum / (i + 1);
        adxr = adx;
      } else {
        var agoAdx = dxList[i - params[1]];
        dxSum -= agoAdx;
        adx = dxSum / params[1];
        adxr = (adx + agoAdx) / 2;
      }
    }

    dataList[i].dmi = {
      pdi: pdi,
      mdi: mdi,
      adx: adx,
      adxr: adxr
    };
  });
};
/**
 * 计算CR
 *
 * @param dataList
 * @param params
 * @return
 */


calcIndicator[IndicatorType.CR] = function (dataList, params) {
  if (!checkParamsWithSize(params, 5)) {
    return dataList;
  } // 默认参数26、10、20、40、60
  // MID:=REF(HIGH+LOW,1)/2;
  // CR:SUM(MAX(0,HIGH-MID),N)/SUM(MAX(0,MID-LOW),N)*100;
  // MA1:REF(MA(CR,M1),M1/2.5+1);
  // MA2:REF(MA(CR,M2),M2/2.5+1);
  // MA3:REF(MA(CR,M3),M3/2.5+1);
  // MA4:REF(MA(CR,M4),M4/2.5+1);
  // MID赋值:(昨日最高价+昨日最低价)/2
  // 输出带状能量线:0和最高价-MID的较大值的N日累和/0和MID-最低价的较大值的N日累和*100
  // 输出MA1:M1(5)/2.5+1日前的CR的M1(5)日简单移动平均
  // 输出MA2:M2(10)/2.5+1日前的CR的M2(10)日简单移动平均
  // 输出MA3:M3(20)/2.5+1日前的CR的M3(20)日简单移动平均
  // 输出MA4:M4/2.5+1日前的CR的M4日简单移动平均


  var cr = 0;
  var ma1;
  var ma2;
  var ma3;
  var ma4;
  var p1 = 0;
  var p2 = 0;
  var ma1Sum = 0;
  var ma1Mean;
  var ma1List = [];
  var ma2Sum = 0;
  var ma2Mean;
  var ma2List = [];
  var ma3Sum = 0;
  var ma3Mean;
  var ma3List = [];
  var ma4Sum = 0;
  var ma4Mean;
  var ma4List = [];
  return calc(dataList, function (i) {
    if (i > 0) {
      var preHighestPrice = dataList[i - 1].high;
      var preLowestPrice = dataList[i - 1].low;
      var preClosePrice = dataList[i - 1].close;
      var preOpenPrice = dataList[i - 1].open;
      var preMidPrice = (preHighestPrice + preClosePrice + preLowestPrice + preOpenPrice) / 4;
      var highestPrice = dataList[i].high;
      var lowestPrice = dataList[i].low;
      var highSubPreMid = highestPrice - preMidPrice;

      if (highSubPreMid < 0) {
        highSubPreMid = 0;
      }

      p1 += highSubPreMid;
      var preMidSubLow = preMidPrice - lowestPrice;

      if (preMidSubLow < 0) {
        preMidSubLow = 0;
      }

      p2 += preMidSubLow;

      if (i > params[0]) {
        var firstHighestPrice = dataList[i - params[0] - 1].high;
        var firstLowestPrice = dataList[i - params[0] - 1].low;
        var firstClosePrice = dataList[i - params[0] - 1].close;
        var firstOpenPrice = dataList[i - params[0] - 1].open;
        var firstMidPrice = (firstHighestPrice + firstLowestPrice + firstClosePrice + firstOpenPrice) / 4;
        var secondHighestPrice = dataList[i - params[0]].high;
        var secondLowestPrice = dataList[i - params[0]].low;
        var secondHighSubFirstMid = secondHighestPrice - firstMidPrice;

        if (secondHighSubFirstMid < 0) {
          secondHighSubFirstMid = 0;
        }

        var firstMidSubSecondLow = firstMidPrice - secondLowestPrice;

        if (firstMidSubSecondLow < 0) {
          firstMidSubSecondLow = 0;
        }

        p1 -= secondHighSubFirstMid;
        p2 -= firstMidSubSecondLow;
      }

      if (p2 !== 0) {
        cr = p1 / p2 * 100;
      }

      var YM = (dataList[i - 1].high + dataList[i - 1].low + dataList[i - 1].close) / 3;
      var HYM = dataList[i].high - YM;
      p1 += HYM <= 0 ? 0 : HYM;
      var LYM = YM - dataList[i].low;
      p2 += LYM <= 0 ? 0 : LYM;
    }

    ma1Sum += cr;
    ma2Sum += cr;
    ma3Sum += cr;
    ma4Sum += cr;

    if (i < params[1]) {
      ma1Mean = ma1Sum / (i + 1);
    } else {
      ma1Sum -= dataList[i - params[1]].cr.cr;
      ma1Mean = ma1Sum / params[1];
    }

    ma1List.push(ma1Mean);

    if (i < params[2]) {
      ma2Mean = ma2Sum / (i + 1);
    } else {
      ma2Sum -= dataList[i - params[2]].cr.cr;
      ma2Mean = ma2Sum / params[2];
    }

    ma2List.push(ma2Mean);

    if (i < params[3]) {
      ma3Mean = ma3Sum / (i + 1);
    } else {
      ma3Sum -= dataList[i - params[3]].cr.cr;
      ma3Mean = ma3Sum / params[3];
    }

    ma3List.push(ma3Mean);

    if (i < params[4]) {
      ma4Mean = ma4Sum / (i + 1);
    } else {
      ma4Sum -= dataList[i - params[4]].cr.cr;
      ma4Mean = ma4Sum / params[4];
    }

    ma4List.push(ma4Mean);

    if (i < 5) {
      ma1 = ma1List[0];
    } else {
      ma1 = ma1List[i - 5];
    }

    if (i < 9) {
      ma2 = ma2List[0];
    } else {
      ma2 = ma2List[i - 9];
    }

    if (i < 17) {
      ma3 = ma3List[0];
    } else {
      ma3 = ma3List[i - 17];
    }

    if (i < 25) {
      ma4 = ma4List[0];
    } else {
      ma4 = ma4List[i - 25];
    }

    dataList[i].cr = {
      cr: cr,
      ma1: ma1,
      ma2: ma2,
      ma3: ma3,
      ma4: ma4
    };
  });
};
/**
 * 计算PSY
 * 默认参数是12。公式：PSY=N日内的上涨天数/N×100%。
 * @param dataList
 * @param params
 * @return
 */


calcIndicator[IndicatorType.PSY] = function (dataList, params) {
  if (!checkParamsWithSize(params, 1)) {
    return dataList;
  }

  var psy = 0;
  var upDay = 0;
  return calc(dataList, function (i) {
    if (i > 0) {
      upDay += dataList[i].close - dataList[i - 1].close > 0 ? 1 : 0;

      if (i < params[0]) {
        psy = upDay / (i + 1) * 100;
      } else {
        if (i > params[0]) {
          upDay -= dataList[i - params[0] + 1].close - dataList[i - params[0]].close > 0 ? 1.0 : 0.0;
        }

        psy = upDay / params[0] * 100;
      }
    }

    dataList[i].psy = {
      psy: psy
    };
  });
};
/**
 * 计算DMA
 * 默认参数是10、50、10。
 * 公式：DIF:MA(CLOSE,N1)-MA(CLOSE,N2);DIFMA:MA(DIF,M)
 * @param dataList
 * @param params
 * @return
 */


calcIndicator[IndicatorType.DMA] = function (dataList, params) {
  if (!checkParamsWithSize(params, 3)) {
    return dataList;
  }

  var dif;
  var difMa;
  var ma1Sum = 0;
  var ma1;
  var ma2Sum = 0;
  var ma2;
  var difSum = 0;
  return calc(dataList, function (i) {
    var closePrice = dataList[i].close;
    ma1Sum += closePrice;
    ma2Sum += closePrice;

    if (i < params[0]) {
      ma1 = ma1Sum / (i + 1);
    } else {
      ma1Sum -= dataList[i - params[0]].close;
      ma1 = ma1Sum / params[0];
    }

    if (i < params[1]) {
      ma2 = ma2Sum / (i + 1);
    } else {
      ma2Sum -= dataList[i - params[1]].close;
      ma2 = ma2Sum / params[1];
    }

    dif = ma1 - ma2;
    difSum += dif;

    if (i < params[2]) {
      difMa = difSum / (i + 1);
    } else {
      difSum -= dataList[i - params[2]].dma.dif;
      difMa = difSum / params[2];
    }

    dataList[i].dma = {
      dif: dif,
      difMa: difMa
    };
  });
};
/**
 * 计算TRIX
 *
 * @param dataList
 * @param params
 * @return
 */


calcIndicator[IndicatorType.TRIX] = function (dataList, params) {
  // TR=收盘价的N日指数移动平均的N日指数移动平均的N日指数移动平均；
  // TRIX=(TR-昨日TR)/昨日TR*100；
  // MATRIX=TRIX的M日简单移动平均；
  // 默认参数N设为12，默认参数M设为20；
  // 默认参数12、20
  // 公式：MTR:=EMA(EMA(EMA(CLOSE,N),N),N)
  // TRIX:(MTR-REF(MTR,1))/REF(MTR,1)*100;
  // TRMA:MA(TRIX,M)
  if (!checkParamsWithSize(params, 2)) {
    return dataList;
  }

  var trix = 0;
  var maTrix;
  var sumTrix = 0;
  var emaClose1;
  var oldEmaClose1 = 0.0;
  var emaClose2;
  var oldEmaClose2 = 0.0;
  var emaClose3;
  var oldEmaClose3 = 0.0;
  var emaClose3List = [];
  return calc(dataList, function (i) {
    var closePrice = dataList[i].close;

    if (i === 0) {
      emaClose1 = closePrice;
      emaClose2 = emaClose1;
      emaClose3 = emaClose2;
    } else {
      emaClose1 = (2 * closePrice + (params[0] - 1) * oldEmaClose1) / (params[0] + 1);
      emaClose2 = (2 * emaClose1 + (params[0] - 1) * oldEmaClose2) / (params[0] + 1);
      emaClose3 = (2 * emaClose2 + (params[0] - 1) * oldEmaClose3) / (params[0] + 1);
      var refEmaClose3 = emaClose3List[i - 1];
      trix = refEmaClose3 === 0.0 ? 0.0 : (emaClose3 - refEmaClose3) / refEmaClose3 * 100;
    }

    oldEmaClose1 = emaClose1;
    oldEmaClose2 = emaClose2;
    oldEmaClose3 = emaClose3;
    emaClose3List.push(emaClose3);
    sumTrix += trix;

    if (i < params[1]) {
      maTrix = sumTrix / (i + 1);
    } else {
      sumTrix -= dataList[i - params[1]].trix.trix;
      maTrix = sumTrix / params[1];
    }

    dataList[i].trix = {
      trix: trix,
      maTrix: maTrix
    };
  });
};
/**
 * 计算obv指标
 * VA:=IF(CLOSE>REF(CLOSE,1),VOL,-VOL);
 * OBV:SUM(IF(CLOSE=REF(CLOSE,1),0,VA),0);
 * MAOBV:MA(OBV,M);
 * VA赋值:如果收盘价>昨收,返回成交量(手),否则返回-成交量(手)
 * 输出OBV:如果收盘价=昨收,返回0,否则返回VA的历史累和
 * 输出MAOBV:OBV的M日简单移动平均
 * 默认参数30
 * @param dataList
 * @param params
 * @return
 */


calcIndicator[IndicatorType.OBV] = function (dataList, params) {
  if (!checkParamsWithSize(params, 1)) {
    return dataList;
  }

  var obv;
  var sumObv = 0.0;
  var maObv;
  var sumVa = 0.0;
  return calc(dataList, function (i) {
    var volume = dataList[i].volume;

    if (i === 0) {
      obv = volume;
      sumVa += volume;
    } else {
      var refClosePrice = dataList[i - 1].close;
      var closePrice = dataList[i].close;
      var va = closePrice > refClosePrice ? volume : -volume;
      sumVa += va;
      obv = closePrice === refClosePrice ? 0.0 : sumVa;
    }

    sumObv += obv;

    if (i < params[0]) {
      maObv = sumObv / (i + 1);
    } else {
      sumObv -= dataList[i - params[0]].obv.obv;
      maObv = sumObv / params[0];
    }

    dataList[i].obv = {
      obv: obv,
      maObv: maObv
    };
  });
};
/**
 * 计算vr指标
 * 默认参数24 ， 30
 * VR=（AVS+1/2CVS）/（BVS+1/2CVS）
 * 24天以来凡是股价上涨那一天的成交量都称为AV，将24天内的AV总和相加后称为AVS
 * 24天以来凡是股价下跌那一天的成交量都称为BV，将24天内的BV总和相加后称为BVS
 * 24天以来凡是股价不涨不跌，则那一天的成交量都称为CV，将24天内的CV总和相加后称为CVS
 * @param dataList
 * @param params
 * @return
 */


calcIndicator[IndicatorType.VR] = function (dataList, params) {
  if (!checkParamsWithSize(params, 2)) {
    return dataList;
  }

  var avs = 0;
  var bvs = 0;
  var cvs = 0;
  var vr = 0;
  var maVr;
  var sumVr = 0;
  return calc(dataList, function (i) {
    var closePrice = dataList[i].close;
    var openPrice = dataList[i].open;
    var volume = dataList[i].volume;

    if (closePrice > openPrice) {
      avs += volume;
    } else if (closePrice < openPrice) {
      bvs += volume;
    } else {
      cvs += volume;
    }

    if (i > params[0] - 1) {
      var agoClosePrice = dataList[i - params[0]].close;
      var agoOpenPrice = dataList[i - params[0]].open;
      var agoVolume = dataList[i - params[0]].volume;

      if (agoClosePrice > agoOpenPrice) {
        avs -= agoVolume;
      } else if (agoClosePrice < agoOpenPrice) {
        bvs -= agoVolume;
      } else {
        cvs -= agoVolume;
      }
    }

    var v = bvs + 1 / 2 * cvs;

    if (v !== 0) {
      vr = (avs + 1 / 2 * cvs) / v * 100;
    }

    sumVr += vr;

    if (i < params[1]) {
      maVr = sumVr / (i + 1);
    } else {
      sumVr -= dataList[i - params[1]].vr.vr;
      maVr = sumVr / params[1];
    }

    dataList[i].vr = {
      vr: vr,
      maVr: maVr
    };
  });
};
/**
 * 计算wr指标
 * 默认参数13 34 89
 * 公式 WR(N) = 100 * [ HIGH(N)-C ] / [ HIGH(N)-LOW(N) ]
 * @param dataList
 * @param params
 * @return
 */


calcIndicator[IndicatorType.WR] = function (dataList, params) {
  if (!checkParamsWithSize(params, 3)) {
    return dataList;
  }

  var wr1;
  var wr2;
  var wr3;
  var h1 = Number.MIN_SAFE_INTEGER;
  var l1 = Number.MAX_SAFE_INTEGER;
  var h2 = Number.MIN_SAFE_INTEGER;
  var l2 = Number.MAX_SAFE_INTEGER;
  var h3 = Number.MIN_SAFE_INTEGER;
  var l3 = Number.MAX_SAFE_INTEGER;
  var hl1;
  var hl2;
  var hl3;
  return calc(dataList, function (i) {
    var closePrice = dataList[i].close;
    var highPrice = dataList[i].high;
    var lowPrice = dataList[i].low;

    if (i < params[0]) {
      h1 = Math.max(highPrice, h1);
      l1 = Math.min(lowPrice, l1);
    } else {
      var highLowPriceArray = getHighLow(dataList.slice(i - params[0], i));
      h1 = highLowPriceArray[0];
      l1 = highLowPriceArray[1];
    }

    hl1 = h1 - l1;
    wr1 = hl1 !== 0 ? (h1 - closePrice) / hl1 * 100 : 0.0;

    if (i < params[1]) {
      h2 = Math.max(highPrice, h2);
      l2 = Math.min(lowPrice, l2);
    } else {
      var _highLowPriceArray = getHighLow(dataList.slice(i - params[1], i));

      h2 = _highLowPriceArray[0];
      l2 = _highLowPriceArray[1];
    }

    hl2 = h2 - l2;
    wr2 = hl2 !== 0 ? (h2 - closePrice) / hl2 * 100 : 0.0;

    if (i < params[2]) {
      h3 = Math.max(highPrice, h3);
      l3 = Math.min(lowPrice, l3);
    } else {
      var _highLowPriceArray2 = getHighLow(dataList.slice(i - params[2], i));

      h3 = _highLowPriceArray2[0];
      l3 = _highLowPriceArray2[1];
    }

    hl3 = h3 - l3;
    wr3 = hl3 !== 0.0 ? (h3 - closePrice) / hl3 * 100 : 0.0;
    dataList[i].wr = {
      wr1: wr1,
      wr2: wr2,
      wr3: wr3
    };
  });
};
/**
 * 计算mtm指标
 * 默认参数6 10
 * 公式 MTM（N日）=C－CN
 * @param dataList
 * @param params
 * @return
 */


calcIndicator[IndicatorType.MTM] = function (dataList, params) {
  if (!checkParamsWithSize(params, 2)) {
    return dataList;
  }

  var mtm;
  var mtmSum = 0;
  var mtmMa;
  return calc(dataList, function (i) {
    if (i < params[0]) {
      mtm = 0.0;
      mtmMa = 0.0;
    } else {
      var closePrice = dataList[i].close;
      mtm = closePrice - dataList[i - params[0]].close;
      mtmSum += mtm;

      if (i < params[0] + params[1]) {
        mtmMa = mtmSum / (i - params[0] + 1);
      } else {
        mtmMa = mtmSum / params[1];
        mtmSum -= dataList[i - params[1]].mtm.mtm;
      }
    }

    dataList[i].mtm = {
      mtm: mtm,
      mtmMa: mtmMa
    };
  });
};
/**
 * 简易波动指标
 * 默认参数N为14，默认参数M为9
 * 公式：
 * A=（今日最高+今日最低）/2
 * B=（前日最高+前日最低）/2
 * C=今日最高-今日最低
 * EM=（A-B）*C/今日成交额
 * EMV=N日内EM的累和
 * MAEMV=EMV的M日的简单移动平均
 * @param dataList
 * @param params
 * @return
 */


calcIndicator[IndicatorType.EMV] = function (dataList, params) {
  if (!checkParamsWithSize(params, 2)) {
    return dataList;
  }

  var emv = 0;
  var maEmv;
  var sumEmv = 0;
  var em = 0;
  var emList = [];
  return calc(dataList, function (i) {
    if (i > 0) {
      var turnover = dataList[i].turnover;
      var highestPrice = dataList[i].high;
      var lowestPrice = dataList[i].low;
      var preHighestPrice = dataList[i - 1].high;
      var preLowestPrice = dataList[i - 1].low;
      var highSubLow = highestPrice - lowestPrice;
      var halfHighAddLow = (highestPrice + lowestPrice) / 2;
      var preHalfHighAddLow = (preHighestPrice + preLowestPrice) / 2;
      em = (halfHighAddLow - preHalfHighAddLow) * highSubLow / turnover;
    }

    emList.push(em);

    if (i < params[0]) {
      emv += em;
    } else {
      emv -= emList[i - params[0]];
    }

    sumEmv += emv;

    if (i < params[1]) {
      maEmv = sumEmv / (i + 1);
    } else {
      sumEmv -= dataList[i - params[1]].emv.emv;
      maEmv = sumEmv / params[1];
    }

    dataList[i].emv = {
      emv: emv,
      maEmv: maEmv
    };
  });
};
/**
 * 计算sar
 * 默认参数2， 2， 20（开始值，步长，最大值）
 * @param dataList
 * @param params
 * @return
 */


calcIndicator[IndicatorType.SAR] = function (dataList, params) {
  if (!checkParamsWithSize(params, 3)) {
    return dataList;
  }

  var startAf = params[0] / 100;
  var step = params[1] / 100;
  var maxAf = params[2] / 100; // 加速因子

  var af = startAf; // 极值

  var ep = -100; // 判断是上涨还是下跌  false：下跌

  var isIncreasing = false;
  var sar = 0;
  return calc(dataList, function (i) {
    // 上一个周期的sar
    var preSar = sar;
    var highestPrice = dataList[i].high;
    var lowestPrice = dataList[i].low;

    if (isIncreasing) {
      // 上涨
      if (ep === -100 || ep < highestPrice) {
        // 重新初始化值
        ep = highestPrice;
        af = Math.min(af + step, maxAf);
      }

      sar = preSar + af * (ep - preSar);
      var lowestPriceMin = Math.min(dataList[Math.max(1, i) - 1].low, lowestPrice);

      if (sar > dataList[i].low) {
        sar = ep; // 重新初始化值

        af = startAf;
        ep = -100;
        isIncreasing = !isIncreasing;
      } else if (sar > lowestPriceMin) {
        sar = lowestPriceMin;
      }
    } else {
      if (ep === -100 || ep > lowestPrice) {
        // 重新初始化值
        ep = lowestPrice;
        af = Math.min(af + step, maxAf);
      }

      sar = preSar + af * (ep - preSar);
      var highestPriceMax = Math.max(dataList[Math.max(1, i) - 1].high, highestPrice);

      if (sar < dataList[i].high) {
        sar = ep; // 重新初始化值

        af = 0;
        ep = -100;
        isIncreasing = !isIncreasing;
      } else if (sar < highestPriceMax) {
        sar = highestPriceMax;
      }
    }

    dataList[i].sar = {
      sar: sar
    };
  });
};
/**
 * 计算
 * @param dataList
 * @param calcIndicator
 */


function calc(dataList, calcIndicator) {
  var dataSize = dataList.length;

  for (var i = 0; i < dataSize; i++) {
    calcIndicator(i);
  }

  return dataList;
}
/**
 * 计算布林指标中的标准差
 *
 * @param list
 * @param ma
 * @return
 */


function getBollMd(list, ma) {
  var sum = 0;

  for (var i = 0; i < list.length; i++) {
    var closeMa = list[i].close - ma;
    sum += closeMa * closeMa;
  }

  var b = sum > 0;
  sum = Math.abs(sum);
  var md = Math.sqrt(sum / list.length);
  return b ? md : -1 * md;
}
/**
 * 获取list中的最大的最高价
 *
 * @param list
 * @return
 */


function getHigh(list) {
  var high = 0;

  if (list && list.length > 0) {
    var size = list.length;
    high = list[0].high;

    for (var i = 1; i < size; i++) {
      high = Math.max(list[i].high, high);
    }
  }

  return high;
}
/**
 * 获取list中的最小的最低价
 *
 * @param list
 * @return
 */


function getLow(list) {
  var low = 0;

  if (list && list.length > 0) {
    var size = list.length;
    low = list[0].low;

    for (var i = 1; i < size; i++) {
      low = Math.min(list[i].low, low);
    }
  }

  return low;
}
/**
 * 获取最大最小值
 * @param list
 * @returns {number[]}
 */


function getHighLow(list) {
  var high = 0;
  var low = 0;

  if (list && list.length > 0) {
    var size = list.length;
    high = list[0].high;
    low = list[0].low;

    for (var i = 1; i < size; i++) {
      high = Math.max(list[i].high, high);
      low = Math.min(list[i].low, low);
    }
  }

  return [high, low];
}
/**
 * 检查参数
 * @param params
 */


function checkParams(params) {
  return params && isArray(params);
}
/**
 * 检查参数, 并检查参数个数
 * @param params
 * @param paramsSize
 */


function checkParamsWithSize(params, paramsSize) {
  return checkParams(params) && params.length === paramsSize;
}

function isIPad(ua) {
  return ua.match(/(iPad).*OS\s([\d_]+)/);
}
function isIPhone(ua) {
  return !isIPad(ua) && ua.match(/(iPhone\sOS)\s([\d_]+)/);
}
function isAndroid(ua) {
  // eslint-disable-next-line no-useless-escape
  return ua.match(/(Android);?[\s\/]+([\d.]+)?/);
}
function isMobile(ua) {
  return isIPad(ua) || isIPhone(ua) || isAndroid(ua);
}

var Event =
/*#__PURE__*/
function () {
  function Event(tooltipChart, mainChart, volChart, subIndicatorChart, xAxisChart, dataProvider) {
    _classCallCheck(this, Event);

    this.tooltipChart = tooltipChart;
    this.mainChart = mainChart;
    this.volChart = volChart;
    this.subIndicatorChart = subIndicatorChart;
    this.xAxisChart = xAxisChart;
    this.dataProvider = dataProvider;
    this.viewPortHandler = tooltipChart.viewPortHandler;
  }
  /**
   * 拖拽
   * @param eventPoint
   * @param dragX
   * @param loadMore
   * @returns {boolean}
   */


  _createClass(Event, [{
    key: "drag",
    value: function drag(eventPoint, dragX, loadMore) {
      var dataSpace = this.dataProvider.dataSpace;
      var dataSize = this.dataProvider.dataList.length;
      var range = this.dataProvider.range;
      var minPos = this.dataProvider.minPos;
      var moveDist = dragX - eventPoint.x;

      if (moveDist > dataSpace / 2) {
        if (minPos === 0 || dataSize < range) {
          return false;
        }

        eventPoint.x = dragX;
        var moveRange = +Math.abs(moveDist / dataSpace).toFixed(0);

        if (moveRange === 0) {
          moveRange = 1;
        }

        minPos -= moveRange;

        if (minPos < 0) {
          minPos = 0;
        }

        this.dataProvider.minPos = minPos;
        this.mainChart.flush();
        this.volChart.flush();
        this.subIndicatorChart.flush();
        this.xAxisChart.flush();

        if (minPos === 0) {
          loadMore();
        }

        return true;
      } else if (moveDist < 0 - dataSpace / 2) {
        if (minPos + range === dataSize || dataSize < range) {
          return false;
        }

        eventPoint.x = dragX;

        var _moveRange = +Math.abs(moveDist / dataSpace).toFixed(0);

        if (_moveRange === 0) {
          _moveRange = 1;
        }

        minPos += _moveRange;

        if (minPos >= dataSize - range) {
          minPos = dataSize - range;
        }

        this.dataProvider.minPos = minPos;
        this.mainChart.flush();
        this.volChart.flush();
        this.subIndicatorChart.flush();
        this.xAxisChart.flush();
        return true;
      }

      return false;
    }
    /**
     * 缩放
     * @param isZoomingOut
     * @param scaleX
     * @param touchStartPosition
     * @param touchRange
     * @returns {boolean}
     */

  }, {
    key: "zoom",
    value: function zoom(isZoomingOut, scaleX, touchStartPosition, touchRange) {
      var range = this.dataProvider.range;
      var maxRange = this.dataProvider.maxRange;
      var minRange = this.dataProvider.minRange;

      if (isZoomingOut) {
        if (range >= maxRange) {
          // 无法继续缩小
          return false;
        }
      } else {
        if (range <= minRange) {
          // 无法继续放大
          return false;
        }
      } // 计算缩放后的range大小


      range = +(touchRange / scaleX).toFixed(0);
      range = Math.min(Math.max(range, minRange), maxRange);
      var minPos = touchStartPosition + touchRange - range;

      if (minPos + range > this.dataProvider.dataList.length || minPos < 0) {
        minPos = 0;
      }

      this.dataProvider.range = range;
      this.dataProvider.minPos = minPos;
      this.dataProvider.space(this.viewPortHandler.contentRight() - this.viewPortHandler.contentLeft());
      this.mainChart.flush();
      this.volChart.flush();
      this.subIndicatorChart.flush();
      this.xAxisChart.flush();
      return true;
    }
    /**
     * 十字光标
     * @param point
     */

  }, {
    key: "cross",
    value: function cross(point) {
      this.dataProvider.crossPoint = {
        x: point.x,
        y: point.y
      };
      this.dataProvider.calcCurrentTooltipDataPos(this.viewPortHandler.contentLeft(), point.x);
      this.tooltipChart.flush();
    }
  }]);

  return Event;
}();

/**
 * 是否是有效事件
 * @param point
 * @param viewPortHandler
 * @returns {boolean}
 */
function isValidEvent(point, viewPortHandler) {
  return !(point.x < viewPortHandler.contentLeft() || point.x > viewPortHandler.contentRight() || point.y < viewPortHandler.contentTop() || point.y > viewPortHandler.contentBottom());
}
/**
 * 获取事件对应画布上的点
 * @param e
 * @param canvasDom
 * @returns {{x: number, y: number}}
 */

function getCanvasPoint(e, canvasDom) {
  var rect = canvasDom.getBoundingClientRect();
  var x = Math.round(e.clientX - rect.left);
  var y = Math.round(e.clientY - rect.top);
  return {
    x: x,
    y: y
  };
}
/**
 * 阻止事件
 * @param e
 */

function stopEvent(e) {
  if (e && e.stopPropagation) {
    e.stopPropagation();
  } else {
    window.event.cancelBubble = true;
  }

  if (e && e.preventDefault) {
    e.preventDefault();
  } else {
    window.event.returnValue = false;
  }
}
/**
 * 两点之间的距离
 * @param eventX
 * @param startX
 * @param eventY
 * @param startY
 * @returns {*}
 */

function distance(eventX, startX, eventY, startY) {
  var dx = eventX - startX;
  var dy = eventY - startY;
  return Math.sqrt(dx * dx + dy * dy);
}
/**
 * 计算移动距离
 * @param e
 * @param canvasDom
 * @returns {number}
 */

function spacing(e, canvasDom) {
  if (e.targetTouches.length < 2) {
    return 0;
  }

  var point1 = getCanvasPoint(e.targetTouches[0], canvasDom);
  var point2 = getCanvasPoint(e.targetTouches[1], canvasDom);
  var x = Math.abs(point1.x - point2.x);
  var y = Math.abs(point1.y - point2.y);
  return Math.sqrt(x * x + y * y);
}
/**
 * 获取两点间x的距离
 * @param e
 * @param canvasDom
 * @returns {number}
 */

function getXDist(e, canvasDom) {
  var point1 = getCanvasPoint(e.targetTouches[0], canvasDom);
  var point2 = getCanvasPoint(e.targetTouches[1], canvasDom);
  return Math.abs(point1.x - point2.x);
}

/**
 * 无
 */

var TOUCH_NO = 0;
/**
 * 拖拽
 */

var TOUCH_DRAG = 1;
/**
 * 缩放
 */

var TOUCH_ZOOM = 2;
/**
 *
 */

var TOUCH_POST_ZOOM = 3;
/**
 * 十字光标
 */

var TOUCH_CROSS = 4;
/**
 * 十字光标取消
 */

var TOUCH_CROSS_CANCEL = 5;

var TouchEvent =
/*#__PURE__*/
function (_Event) {
  _inherits(TouchEvent, _Event);

  function TouchEvent(tooltipChart, mainChart, volChart, subIndicatorChart, xAxisChart, dataProvider) {
    var _this;

    _classCallCheck(this, TouchEvent);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TouchEvent).call(this, tooltipChart, mainChart, volChart, subIndicatorChart, xAxisChart, dataProvider)); // 事件模型

    _this.touchMode = TOUCH_NO;
    _this.touchStartPoint = {
      x: 0,
      y: 0
    };
    _this.touchMovePoint = {
      x: 0,
      y: 0
    };
    _this.touchCrossPoint = {
      x: 0,
      y: 0
    };
    _this.savedDist = 1;
    _this.savedXDist = 1;
    _this.touchRange = dataProvider.range;
    _this.touchStartPosition = dataProvider.minPos;
    _this.delayTimeout = null;

    _this.delayActiveCross = function () {
      if (_this.touchMode === TOUCH_NO || _this.touchMode === TOUCH_CROSS_CANCEL) {
        if (_this.tooltipChart) {
          _this.touchMode = TOUCH_CROSS;
          _this.touchCrossPoint = {
            x: _this.touchStartPoint.x,
            y: _this.touchStartPoint.y
          };

          _this.cross(_this.touchCrossPoint);
        }
      }
    };

    return _this;
  }
  /**
   * 触摸事件开始
   * @param e
   */


  _createClass(TouchEvent, [{
    key: "touchStart",
    value: function touchStart(e) {
      if (this.dataProvider.dataList.length === 0) {
        return;
      }

      if (e.targetTouches.length === 1) {
        var point = getCanvasPoint(e.targetTouches[0], this.tooltipChart.canvasDom);
        this.touchStartPoint = {
          x: point.x,
          y: point.y
        };
        this.touchMovePoint = {
          x: point.x,
          y: point.y
        };

        if (!isValidEvent(this.touchStartPoint, this.viewPortHandler)) {
          return;
        }

        if (this.touchMode === TOUCH_CROSS) {
          stopEvent(e);
          var crossRadius = distance(point.x, this.touchCrossPoint.x, point.y, this.touchCrossPoint.y);

          if (crossRadius < 10) {
            this.performCross(e);
          } else {
            this.touchMode = TOUCH_CROSS_CANCEL;
            this.dataProvider.crossPoint = null;
            this.tooltipChart.flush();
          }
        } else {
          this.touchMode = TOUCH_NO;
        }

        this.removeDelayActiveCross();
        this.postDelayDelayActiveCross();
      } else if (e.targetTouches.length > 1) {
        if (!isValidEvent(this.touchStartPoint, this.viewPortHandler)) {
          return;
        }

        if (this.touchMode !== TOUCH_CROSS) {
          stopEvent(e);
          this.savedDist = spacing(e, this.tooltipChart.canvasDom);
          this.savedXDist = getXDist(e, this.tooltipChart.canvasDom);

          if (this.savedDist > 3) {
            this.touchMode = TOUCH_ZOOM;
          }

          this.touchRange = this.dataProvider.range;
          this.touchStartPosition = this.dataProvider.minPos;
        }
      }
    }
    /**
     * 触摸事件移动
     * @param e
     * @param loadMore
     */

  }, {
    key: "touchMove",
    value: function touchMove(e, loadMore) {
      if (!isValidEvent(this.touchStartPoint, this.viewPortHandler) || this.dataProvider.dataList.length === 0) {
        return;
      }

      if (!this.waitingForMouseMoveAnimationFrame) {
        this.waitingForMouseMoveAnimationFrame = true;

        switch (this.touchMode) {
          case TOUCH_ZOOM:
            {
              stopEvent(e);
              this.performZoom(e);
              break;
            }

          case TOUCH_DRAG:
            {
              stopEvent(e);
              var point = getCanvasPoint(e.targetTouches[0], this.tooltipChart.canvasDom);
              this.drag(this.touchMovePoint, point.x, loadMore);
              break;
            }

          case TOUCH_CROSS:
            {
              stopEvent(e);
              this.performCross(e);
              break;
            }

          case TOUCH_CROSS_CANCEL:
            {
              this.removeDelayActiveCross();
              break;
            }

          case TOUCH_NO:
            {
              var _point = getCanvasPoint(e.targetTouches[0], this.tooltipChart.canvasDom);

              var dis = Math.abs(distance(_point.x, this.touchStartPoint.x, _point.y, this.touchStartPoint.y));

              if (dis > 10) {
                var distanceX = Math.abs(_point.x - this.touchStartPoint.x);
                var distanceY = Math.abs(_point.y - this.touchStartPoint.y);

                if (distanceY <= distanceX) {
                  stopEvent(e);
                  this.dataProvider.crossPoint = null;
                  this.touchMode = TOUCH_DRAG;
                  this.tooltipChart.flush();
                }
              }

              this.removeDelayActiveCross();
            }
        }

        this.waitingForMouseMoveAnimationFrame = false;
      }
    }
    /**
     * 触摸事件结束
     * @param e
     */

  }, {
    key: "touchEnd",
    value: function touchEnd(e) {
      if (!isValidEvent(this.touchStartPoint, this.viewPortHandler) || this.dataProvider.dataList.length === 0) {
        return;
      }

      stopEvent(e);

      if (e.targetTouches.length > 0) {
        if (this.touchMode === TOUCH_CROSS) {
          this.performCross(e);
        } else {
          this.touchMode = TOUCH_POST_ZOOM;
        }
      } else {
        this.removeDelayActiveCross(); // 拿起

        if (this.touchMode !== TOUCH_CROSS) {
          if (this.touchMode === TOUCH_NO) {
            this.touchMode = TOUCH_CROSS;
            this.touchCrossPoint = _objectSpread2({}, this.touchStartPoint);
            this.cross(this.touchCrossPoint);
          } else {
            this.touchMode = TOUCH_NO;
            this.dataProvider.crossPoint = null;
            this.tooltipChart.flush();
          }
        }
      }
    }
    /**
     * 处理缩放
     * @param e
     * @returns {boolean}
     */

  }, {
    key: "performZoom",
    value: function performZoom(e) {
      if (e.targetTouches.length > 1) {
        var totalDist = spacing(e, this.tooltipChart.canvasDom);

        if (totalDist > 10) {
          var xDist = getXDist(e, this.tooltipChart.canvasDom); // x轴方向 scale

          var scaleX = xDist / this.savedXDist; // 是否缩小

          var isZoomingOut = scaleX < 1;
          this.zoom(isZoomingOut, scaleX, this.touchStartPosition, this.touchRange);
        }
      }
    }
    /**
     * 处理移动光标
     * @param e
     * @returns {boolean}
     */

  }, {
    key: "performCross",
    value: function performCross(e) {
      var point = getCanvasPoint(e.targetTouches[0], this.tooltipChart.canvasDom);
      this.touchCrossPoint = {
        x: point.x,
        y: point.y
      };
      this.cross(this.touchCrossPoint);
    }
    /**
     * 执行延迟事件
     */

  }, {
    key: "postDelayDelayActiveCross",
    value: function postDelayDelayActiveCross() {
      this.delayTimeout = setTimeout(this.delayActiveCross, 200);
    }
    /**
     * 移除延迟事件
     */

  }, {
    key: "removeDelayActiveCross",
    value: function removeDelayActiveCross() {
      if (this.delayTimeout) {
        clearTimeout(this.delayTimeout);
        this.delayTimeout = null;
      }
    }
  }]);

  return TouchEvent;
}(Event);

var CROSS = 'cross';
var DRAG = 'drag';

var MouseEvent =
/*#__PURE__*/
function (_Event) {
  _inherits(MouseEvent, _Event);

  function MouseEvent(tooltipChart, mainChart, volChart, subIndicatorChart, xAxisChart, markerChart, dataProvider) {
    var _this;

    _classCallCheck(this, MouseEvent);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MouseEvent).call(this, tooltipChart, mainChart, volChart, subIndicatorChart, xAxisChart, dataProvider));
    _this.markerChart = markerChart; // 事件模型

    _this.mouseMode = CROSS;
    _this.mouseDownPoint = {
      x: 0,
      y: 0
    };

    _this.documentMouseUp = function () {
      document.removeEventListener('mouseup', _this.documentMouseUp, false);
      _this.mouseMode = CROSS;
      _this.dataProvider.isDragMarker = false;

      _this.tooltipChart.flush();
    };

    return _this;
  }
  /**
   * 鼠标按下事件
   * @param e
   */


  _createClass(MouseEvent, [{
    key: "mouseDown",
    value: function mouseDown(e) {
      if (this.dataProvider.dataList.length === 0) {
        return;
      }

      if (e.button === 0) {
        var point = getCanvasPoint(e, this.tooltipChart.canvasDom);

        if (!isValidEvent(point, this.viewPortHandler)) {
          return;
        }

        document.addEventListener('mouseup', this.documentMouseUp, false);
        this.mouseDownPoint.x = e.x;
        this.mouseDownPoint.y = e.y;
        this.mouseMode = DRAG;
        this.dataProvider.crossPoint = null;
        this.tooltipChart.flush();
      }
    }
    /**
     * 鼠标抬起时事件
     * @param e
     */

  }, {
    key: "mouseUp",
    value: function mouseUp(e) {
      if (this.dataProvider.dataList.length === 0) {
        return;
      }

      stopEvent(e);
      var point = getCanvasPoint(e, this.tooltipChart.canvasDom);

      if (!isValidEvent(point, this.viewPortHandler)) {
        return;
      }

      document.removeEventListener('mouseup', this.documentMouseUp, false);
      this.mouseMode = CROSS;
      this.dataProvider.crossPoint = {
        x: point.x,
        y: point.y
      };
      this.dataProvider.isDragMarker = false;
      this.tooltipChart.flush();
    }
  }, {
    key: "mouseLeave",
    value: function mouseLeave(e) {
      if (this.dataProvider.dataList.length === 0) {
        return;
      }

      stopEvent(e);
      this.dataProvider.crossPoint = null;
      this.tooltipChart.flush();
    }
    /**
     * 鼠标移动时事件
     * @param e
     * @param loadMore
     */

  }, {
    key: "mouseMove",
    value: function mouseMove(e, loadMore) {
      if (this.dataProvider.dataList.length === 0) {
        return;
      }

      stopEvent(e);
      var point = getCanvasPoint(e, this.tooltipChart.canvasDom);

      if (!isValidEvent(point, this.viewPortHandler)) {
        this.dataProvider.crossPoint = null;
        this.tooltipChart.flush();
        return;
      }

      if (!this.waitingForMouseMoveAnimationFrame) {
        this.waitingForMouseMoveAnimationFrame = true;

        if (this.mouseMode === DRAG) {
          if (this.dataProvider.isDragMarker) {
            this.cross(point);
          } else {
            if (this.drag(this.mouseDownPoint, e.x, loadMore)) {
              this.markerChart.flush();
            }
          }
        } else if (this.mouseMode === CROSS) {
          this.cross(point);
        }

        this.waitingForMouseMoveAnimationFrame = false;
      }
    }
    /**
     * 鼠标滚轮事件
     * @param e
     */

  }, {
    key: "mouseWheel",
    value: function mouseWheel(e) {
      if (this.dataProvider.dataList.length === 0 || this.dataProvider.isDragMarker) {
        return;
      }

      stopEvent(e);
      var point = getCanvasPoint(e, this.tooltipChart.canvasDom);

      if (!isValidEvent(point, this.viewPortHandler)) {
        return;
      }

      var touchStartPosition = this.dataProvider.minPos;
      var touchRange = this.dataProvider.range;
      var delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.deltaY)); // 是否缩小

      var isZoomingOut = delta === 1;
      var scaleX = 1;

      if (isZoomingOut) {
        scaleX = 0.95;
      } else {
        scaleX = 1.05;
      }

      if (this.zoom(isZoomingOut, scaleX, touchStartPosition, touchRange)) {
        this.cross(point);
        this.markerChart.flush();
      }
    }
  }]);

  return MouseEvent;
}(Event);

var MarkerEvent =
/*#__PURE__*/
function () {
  function MarkerEvent(dataProvider, markerChart, style) {
    _classCallCheck(this, MarkerEvent);

    this.dataProvider = dataProvider;
    this.markerChart = markerChart;
    this.viewPortHandler = markerChart.viewPortHandler;
    this.yRender = markerChart.markerRender.yRender;
    this.style = style; // 标记当没有画线时鼠标是否按下

    this.noneMarkerMouseDownFlag = false; // 用来记录当没有绘制标记图形时，鼠标操作后落点线上的数据

    this.noneMarkerMouseDownActiveData = {
      markerKey: null,
      dataIndex: -1,
      onLine: false,
      onCircle: false,
      pointIndex: -1
    };
  }
  /**
   * 鼠标抬起事件
   */


  _createClass(MarkerEvent, [{
    key: "mouseUp",
    value: function mouseUp() {
      this.noneMarkerMouseDownFlag = false;
      this.noneMarkerMouseDownActiveData = {
        markerKey: null,
        dataIndex: -1,
        onLine: false,
        onCircle: false,
        pointIndex: -1
      };
    }
    /**
     * 鼠标按下事件
     * @param e
     */

  }, {
    key: "mouseDown",
    value: function mouseDown(e) {
      var point = getCanvasPoint(e, this.markerChart.canvasDom);
      this.dataProvider.markerPoint = _objectSpread2({}, point);

      if (!isValidEvent(point, this.viewPortHandler)) {
        return;
      }

      var markerType = this.dataProvider.currentMarkerType;

      switch (markerType) {
        case MarkerType.HORIZONTAL_STRAIGHT_LINE:
        case MarkerType.VERTICAL_STRAIGHT_LINE:
        case MarkerType.STRAIGHT_LINE:
        case MarkerType.HORIZONTAL_RAY_LINE:
        case MarkerType.VERTICAL_RAY_LINE:
        case MarkerType.RAY_LINE:
        case MarkerType.HORIZONTAL_SEGMENT_LINE:
        case MarkerType.VERTICAL_SEGMENT_LINE:
        case MarkerType.SEGMENT_LINE:
        case MarkerType.PRICE_LINE:
        case MarkerType.FIBONACCI_LINE:
          {
            this.twoStepMarkerMouseDown(e, markerType);
            break;
          }

        case MarkerType.PRICE_CHANNEL_LINE:
        case MarkerType.PARALLEL_STRAIGHT_LINE:
          {
            this.threeStepMarkerMouseDown(e, markerType);
            break;
          }

        case MarkerType.NONE:
          {
            this.noneMarkerMouseDown(e);
            break;
          }
      }
    }
    /**
     * 两步形成的标记图形鼠标按下处理
     * @param e
     * @param markerKey
     */

  }, {
    key: "twoStepMarkerMouseDown",
    value: function twoStepMarkerMouseDown(e, markerKey) {
      var _this = this;

      this.markerMouseDown(e, markerKey, function (lastLineData) {
        switch (lastLineData.drawStep) {
          case MarkerDrawStep.STEP_1:
            {
              lastLineData.drawStep = MarkerDrawStep.STEP_2;
              break;
            }

          case MarkerDrawStep.STEP_2:
            {
              lastLineData.drawStep = MarkerDrawStep.STEP_DONE;
              _this.dataProvider.currentMarkerType = MarkerType.NONE;
              break;
            }
        }
      });
    }
    /**
     * 两个点形成的标记图形鼠标按下事件
     * @param e
     * @param markerKey
     */

  }, {
    key: "threeStepMarkerMouseDown",
    value: function threeStepMarkerMouseDown(e, markerKey) {
      var _this2 = this;

      this.markerMouseDown(e, markerKey, function (lastLineData) {
        switch (lastLineData.drawStep) {
          case MarkerDrawStep.STEP_1:
            {
              lastLineData.drawStep = MarkerDrawStep.STEP_2;
              break;
            }

          case MarkerDrawStep.STEP_2:
            {
              lastLineData.drawStep = MarkerDrawStep.STEP_3;
              break;
            }

          case MarkerDrawStep.STEP_3:
            {
              lastLineData.drawStep = MarkerDrawStep.STEP_DONE;
              _this2.dataProvider.currentMarkerType = MarkerType.NONE;
              break;
            }
        }
      });
    }
    /**
     * 绘制标记图形时鼠标按下事件
     * @param e
     * @param markerKey
     * @param performDifPoint
     */

  }, {
    key: "markerMouseDown",
    value: function markerMouseDown(e, markerKey, performDifPoint) {
      var markerData = this.dataProvider.markerDatas[markerKey];

      if (e.button === 2) {
        markerData.splice(markerData.length - 1, 1);
        this.dataProvider.currentMarkerType = MarkerType.NONE;
      } else {
        var lastLineData = markerData[markerData.length - 1];
        performDifPoint(lastLineData);
        markerData[markerData.length - 1] = lastLineData;
      }

      this.dataProvider.markerDatas[markerKey] = markerData;
      this.markerChart.flush();
    }
    /**
     * 没有绘制时鼠标按下事件
     */

  }, {
    key: "noneMarkerMouseDown",
    value: function noneMarkerMouseDown(e) {
      this.findNoneMarkerMouseDownActiveData(e);
      var markerKey = this.noneMarkerMouseDownActiveData.markerKey;
      var dataIndex = this.noneMarkerMouseDownActiveData.dataIndex;

      if (markerKey && dataIndex !== -1) {
        if (e.button === 2) {
          // 鼠标右键
          var markerData = this.dataProvider.markerDatas[markerKey];
          markerData.splice(dataIndex, 1);
          this.dataProvider.markerDatas[markerKey] = markerData;
          this.markerChart.flush();
        } else {
          if (this.noneMarkerMouseDownActiveData.onCircle) {
            this.noneMarkerMouseDownFlag = true;
            this.dataProvider.isDragMarker = true;
          }
        }
      }
    }
    /**
     * 查找没有绘制时鼠标按下时在哪条数据上
     * @param e
     */

  }, {
    key: "findNoneMarkerMouseDownActiveData",
    value: function findNoneMarkerMouseDownActiveData(e) {
      var _this3 = this;

      var point = getCanvasPoint(e, this.markerChart.canvasDom);
      var keys = Object.keys(this.dataProvider.markerDatas);

      var _loop = function _loop(i) {
        var key = keys[i];

        switch (key) {
          case MarkerType.HORIZONTAL_STRAIGHT_LINE:
          case MarkerType.PRICE_LINE:
            {
              if (_this3.realFindNoneMarkerMouseDownActiveData(key, point, function (xyPoints) {
                return checkPointOnStraightLine(xyPoints[0], {
                  x: _this3.viewPortHandler.contentRight(),
                  y: xyPoints[0].y
                }, point);
              })) {
                return {
                  v: void 0
                };
              }

              break;
            }

          case MarkerType.VERTICAL_STRAIGHT_LINE:
            {
              if (_this3.realFindNoneMarkerMouseDownActiveData(key, point, function (xyPoints) {
                return checkPointOnStraightLine(xyPoints[0], {
                  x: xyPoints[0].x,
                  y: _this3.viewPortHandler.contentBottom()
                }, point);
              })) {
                return {
                  v: void 0
                };
              }

              break;
            }

          case MarkerType.STRAIGHT_LINE:
            {
              if (_this3.realFindNoneMarkerMouseDownActiveData(key, point, function (xyPoints) {
                return checkPointOnStraightLine(xyPoints[0], xyPoints[1], point);
              })) {
                return {
                  v: void 0
                };
              }

              break;
            }

          case MarkerType.HORIZONTAL_RAY_LINE:
          case MarkerType.VERTICAL_RAY_LINE:
          case MarkerType.RAY_LINE:
            {
              if (_this3.realFindNoneMarkerMouseDownActiveData(key, point, function (xyPoints) {
                return checkPointOnRayLine(xyPoints[0], xyPoints[1], point);
              })) {
                return {
                  v: void 0
                };
              }

              break;
            }

          case MarkerType.HORIZONTAL_SEGMENT_LINE:
          case MarkerType.VERTICAL_SEGMENT_LINE:
          case MarkerType.SEGMENT_LINE:
            {
              if (_this3.realFindNoneMarkerMouseDownActiveData(key, point, function (xyPoints) {
                return checkPointOnSegmentLine(xyPoints[0], xyPoints[1], point);
              })) {
                return {
                  v: void 0
                };
              }

              break;
            }

          case MarkerType.PRICE_CHANNEL_LINE:
          case MarkerType.PARALLEL_STRAIGHT_LINE:
          case MarkerType.FIBONACCI_LINE:
            {
              if (_this3.realFindNoneMarkerMouseDownActiveData(key, point, function (xyPoints) {
                var linePoints = [];

                switch (key) {
                  case MarkerType.PRICE_CHANNEL_LINE:
                    {
                      linePoints = getParallelLines(xyPoints, _this3.viewPortHandler, true);
                      break;
                    }

                  case MarkerType.PARALLEL_STRAIGHT_LINE:
                    {
                      linePoints = getParallelLines(xyPoints, _this3.viewPortHandler);
                      break;
                    }

                  case MarkerType.FIBONACCI_LINE:
                    {
                      linePoints = getFibonacciLines(xyPoints, _this3.viewPortHandler);
                      break;
                    }
                }

                var isOnMarker = false;

                for (var _i = 0; _i < linePoints.length; _i++) {
                  var points = linePoints[_i];
                  isOnMarker = checkPointOnStraightLine(points[0], points[1], point);

                  if (isOnMarker) {
                    return isOnMarker;
                  }
                }

                return isOnMarker;
              })) {
                return {
                  v: void 0
                };
              }

              break;
            }
        }
      };

      for (var i = 0; i < keys.length; i++) {
        var _ret = _loop(i);

        if (_typeof(_ret) === "object") return _ret.v;
      }
    }
    /**
     * 查找没有绘制图时鼠标按下时落点在哪条数据上
     * @param markerKey
     * @param point
     * @param checkPointOnLine
     * @returns {boolean}
     */

  }, {
    key: "realFindNoneMarkerMouseDownActiveData",
    value: function realFindNoneMarkerMouseDownActiveData(markerKey, point, checkPointOnLine) {
      var _this4 = this;

      var markerData = this.dataProvider.markerDatas[markerKey];
      markerData.forEach(function (data, index) {
        var points = data.points;
        var xyPoints = [];
        var isOnCircle = false;
        var pointIndex = -1;
        points.forEach(function (p, i) {
          var x = (p.xPos - _this4.dataProvider.minPos) * _this4.dataProvider.dataSpace;

          var y = _this4.yRender.getY(p.price);

          xyPoints.push({
            x: x,
            y: y
          });
          var isOn = checkPointOnCircle({
            x: x,
            y: y
          }, _this4.style.marker.point.radius, point);

          if (isOn) {
            pointIndex = i;
          }

          if (!isOnCircle) {
            isOnCircle = isOn;
          }
        });
        var isOnLine = checkPointOnLine(xyPoints, point);

        if (isOnLine || isOnCircle) {
          _this4.noneMarkerMouseDownActiveData = {
            markerKey: markerKey,
            dataIndex: index,
            onLine: isOnLine,
            onCircle: isOnCircle,
            pointIndex: pointIndex
          };
          return true;
        }
      });
      return false;
    }
    /**
     * 鼠标移动事件
     */

  }, {
    key: "mouseMove",
    value: function mouseMove(e) {
      var point = getCanvasPoint(e, this.markerChart.canvasDom);
      this.dataProvider.markerPoint = _objectSpread2({}, point);

      if (!isValidEvent(point, this.viewPortHandler)) {
        return;
      }

      if (!this.waitingForMouseMoveAnimationFrame) {
        this.waitingForMouseMoveAnimationFrame = true;
        var markerType = this.dataProvider.currentMarkerType;

        switch (markerType) {
          case MarkerType.HORIZONTAL_STRAIGHT_LINE:
          case MarkerType.VERTICAL_STRAIGHT_LINE:
          case MarkerType.PRICE_LINE:
            {
              this.onePointMarkerMouseMove(point, markerType);
              break;
            }

          case MarkerType.STRAIGHT_LINE:
          case MarkerType.RAY_LINE:
          case MarkerType.SEGMENT_LINE:
          case MarkerType.FIBONACCI_LINE:
            {
              this.twoPointMarkerMouseMove(point, markerType);
              break;
            }

          case MarkerType.HORIZONTAL_RAY_LINE:
          case MarkerType.HORIZONTAL_SEGMENT_LINE:
            {
              this.twoPointMarkerMouseMove(point, markerType, function (lastLineData, _ref) {
                var price = _ref.price;
                lastLineData.points[0].price = price;
              });
              break;
            }

          case MarkerType.VERTICAL_RAY_LINE:
          case MarkerType.VERTICAL_SEGMENT_LINE:
            {
              this.twoPointMarkerMouseMove(point, markerType, function (lastLineData, _ref2) {
                var xPos = _ref2.xPos;
                lastLineData.points[0].xPos = xPos;
              });
              break;
            }

          case MarkerType.PRICE_CHANNEL_LINE:
          case MarkerType.PARALLEL_STRAIGHT_LINE:
            {
              this.threePointMarkerMouseMove(point, markerType);
              break;
            }

          case MarkerType.NONE:
            {
              this.noneMarkerMouseMove(point);
              break;
            }
        }

        this.waitingForMouseMoveAnimationFrame = false;
      }
    }
    /**
     * 一个点形成的图形鼠标移动事件
     * @param point
     * @param markerKey
     */

  }, {
    key: "onePointMarkerMouseMove",
    value: function onePointMarkerMouseMove(point, markerKey) {
      var _this5 = this;

      this.markerMouseMove(point, markerKey, function (markerData, lastLineData) {
        var xPos = _this5.dataProvider.minPos + (point.x - _this5.viewPortHandler.contentLeft()) / _this5.dataProvider.dataSpace;

        var price = _this5.yRender.getValue(point.y);

        switch (lastLineData.drawStep) {
          case MarkerDrawStep.STEP_DONE:
            {
              markerData.push({
                points: [{
                  xPos: xPos,
                  price: price
                }],
                drawStep: MarkerDrawStep.STEP_1
              });
              break;
            }

          case MarkerDrawStep.STEP_1:
          case MarkerDrawStep.STEP_2:
            {
              lastLineData.points[0].xPos = xPos;
              lastLineData.points[0].price = price;
              markerData[markerData.length - 1] = lastLineData;
              break;
            }
        }
      });
    }
    /**
     * 两个点形成的线鼠标移动事件
     * @param point
     * @param markerKey
     * @param stepTwo
     */

  }, {
    key: "twoPointMarkerMouseMove",
    value: function twoPointMarkerMouseMove(point, markerKey, stepTwo) {
      var _this6 = this;

      this.markerMouseMove(point, markerKey, function (markerData, lastLineData) {
        var xPos = _this6.dataProvider.minPos + (point.x - _this6.viewPortHandler.contentLeft()) / _this6.dataProvider.dataSpace;

        var price = _this6.yRender.getValue(point.y);

        switch (lastLineData.drawStep) {
          case MarkerDrawStep.STEP_DONE:
            {
              markerData.push({
                points: [{
                  xPos: xPos,
                  price: price
                }, {
                  xPos: xPos,
                  price: price
                }],
                drawStep: MarkerDrawStep.STEP_1
              });
              break;
            }

          case MarkerDrawStep.STEP_1:
            {
              lastLineData.points[0] = {
                xPos: xPos,
                price: price
              };
              lastLineData.points[1] = {
                xPos: xPos,
                price: price
              };
              markerData[markerData.length - 1] = lastLineData;
              break;
            }

          case MarkerDrawStep.STEP_2:
            {
              lastLineData.points[1] = {
                xPos: xPos,
                price: price
              };

              if (isFunction(stepTwo)) {
                stepTwo(lastLineData, {
                  xPos: xPos,
                  price: price
                });
              }

              markerData[markerData.length - 1] = lastLineData;
              break;
            }
        }
      });
    }
    /**
     * 三步形成的标记图形鼠标移动事件
     * @param point
     * @param markerKey
     * @param stepTwo
     */

  }, {
    key: "threePointMarkerMouseMove",
    value: function threePointMarkerMouseMove(point, markerKey, stepTwo) {
      var _this7 = this;

      this.markerMouseMove(point, markerKey, function (markerData, lastLineData) {
        var xPos = _this7.dataProvider.minPos + (point.x - _this7.viewPortHandler.contentLeft()) / _this7.dataProvider.dataSpace;

        var price = _this7.yRender.getValue(point.y);

        switch (lastLineData.drawStep) {
          case MarkerDrawStep.STEP_DONE:
            {
              markerData.push({
                points: [{
                  xPos: xPos,
                  price: price
                }, {
                  xPos: xPos,
                  price: price
                }],
                drawStep: MarkerDrawStep.STEP_1
              });
              break;
            }

          case MarkerDrawStep.STEP_1:
            {
              lastLineData.points[0] = {
                xPos: xPos,
                price: price
              };
              lastLineData.points[1] = {
                xPos: xPos,
                price: price
              };
              markerData[markerData.length - 1] = lastLineData;
              break;
            }

          case MarkerDrawStep.STEP_2:
            {
              if (isFunction(stepTwo)) {
                stepTwo(lastLineData, {
                  xPos: xPos,
                  price: price
                });
              }

              lastLineData.points[1] = {
                xPos: xPos,
                price: price
              };
              markerData[markerData.length - 1] = lastLineData;
              break;
            }

          case MarkerDrawStep.STEP_3:
            {
              lastLineData.points[2] = {
                xPos: xPos,
                price: price
              };
              markerData[markerData.length - 1] = lastLineData;
              break;
            }
        }
      });
    }
    /**
     * 绘制标记图形时鼠标移动事件
     * @param point
     * @param markerKey
     * @param performDifPoint
     */

  }, {
    key: "markerMouseMove",
    value: function markerMouseMove(point, markerKey, performDifPoint) {
      var markerData = this.dataProvider.markerDatas[markerKey];
      var lastLineData = markerData[markerData.length - 1] || {
        drawStep: MarkerDrawStep.STEP_DONE
      };
      performDifPoint(markerData, lastLineData);
      this.dataProvider.markerDatas[markerKey] = markerData;
      this.markerChart.flush();
    }
    /**
     * 没有绘制标记时鼠标移动事件
     * @param point
     */

  }, {
    key: "noneMarkerMouseMove",
    value: function noneMarkerMouseMove(point) {
      if (this.noneMarkerMouseDownFlag) {
        var markerKey = this.noneMarkerMouseDownActiveData.markerKey;
        var dataIndex = this.noneMarkerMouseDownActiveData.dataIndex;

        if (markerKey && dataIndex !== -1) {
          var markerData = this.dataProvider.markerDatas[markerKey];

          switch (markerKey) {
            case MarkerType.HORIZONTAL_STRAIGHT_LINE:
            case MarkerType.VERTICAL_STRAIGHT_LINE:
            case MarkerType.PRICE_LINE:
            case MarkerType.STRAIGHT_LINE:
            case MarkerType.RAY_LINE:
            case MarkerType.SEGMENT_LINE:
            case MarkerType.PRICE_CHANNEL_LINE:
            case MarkerType.PARALLEL_STRAIGHT_LINE:
            case MarkerType.FIBONACCI_LINE:
              {
                var pointIndex = this.noneMarkerMouseDownActiveData.pointIndex;

                if (pointIndex !== -1) {
                  markerData[dataIndex].points[pointIndex].xPos = (point.x - this.viewPortHandler.contentLeft()) / this.dataProvider.dataSpace + this.dataProvider.minPos;
                  markerData[dataIndex].points[pointIndex].price = this.yRender.getValue(point.y);
                }

                break;
              }

            case MarkerType.HORIZONTAL_RAY_LINE:
            case MarkerType.HORIZONTAL_SEGMENT_LINE:
              {
                var _pointIndex = this.noneMarkerMouseDownActiveData.pointIndex;

                if (_pointIndex !== -1) {
                  var price = this.yRender.getValue(point.y);
                  markerData[dataIndex].points[_pointIndex].xPos = (point.x - this.viewPortHandler.contentLeft()) / this.dataProvider.dataSpace + this.dataProvider.minPos;
                  markerData[dataIndex].points[0].price = price;
                  markerData[dataIndex].points[1].price = price;
                }

                break;
              }

            case MarkerType.VERTICAL_RAY_LINE:
            case MarkerType.VERTICAL_SEGMENT_LINE:
              {
                var _pointIndex2 = this.noneMarkerMouseDownActiveData.pointIndex;

                if (_pointIndex2 !== -1) {
                  var xPos = (point.x - this.viewPortHandler.contentLeft()) / this.dataProvider.dataSpace + this.dataProvider.minPos;
                  markerData[dataIndex].points[0].xPos = xPos;
                  markerData[dataIndex].points[1].xPos = xPos;
                  markerData[dataIndex].points[_pointIndex2].price = this.yRender.getValue(point.y);
                }

                break;
              }
          }

          this.dataProvider.markerDatas[markerKey] = markerData;
        }
      }

      this.markerChart.flush();
    }
  }]);

  return MarkerEvent;
}();

var KeyboardEvent =
/*#__PURE__*/
function (_Event) {
  _inherits(KeyboardEvent, _Event);

  function KeyboardEvent(mainChart, volChart, subIndicatorChart, tooltipChart, markerChart, xAxisChart, dataProvider) {
    var _this;

    _classCallCheck(this, KeyboardEvent);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(KeyboardEvent).call(this, tooltipChart, mainChart, volChart, subIndicatorChart, xAxisChart, dataProvider));
    _this.markerChart = markerChart;
    return _this;
  }
  /**
   * 按键按下事件
   * @param e
   * @param loadMore
   */


  _createClass(KeyboardEvent, [{
    key: "keyDown",
    value: function keyDown(e, loadMore) {
      stopEvent(e);

      if (e.keyCode === 37 || e.keyCode === 39) {
        var shouldFlush = false;

        if (e.keyCode === 37) {
          // 左移
          if (this.dataProvider.minPos > 0) {
            this.dataProvider.minPos--;
            this.dataProvider.currentTooltipDataPos--;
            shouldFlush = true;
          }
        } else {
          // 右移
          if (this.dataProvider.minPos < this.dataProvider.dataList.length - this.dataProvider.range) {
            this.dataProvider.minPos++;
            this.dataProvider.currentTooltipDataPos++;
            shouldFlush = true;
          }
        }

        if (shouldFlush) {
          this.mainChart.flush();
          this.volChart.flush();
          this.subIndicatorChart.flush();
          this.xAxisChart.flush();
          this.markerChart.flush();

          if (this.dataProvider.crossPoint) {
            this.tooltipChart.flush();
          }

          if (this.dataProvider.minPos === 0) {
            loadMore();
          }
        }
      } else if (e.keyCode === 38 || e.keyCode === 40) {
        var isZoomingOut = true;
        var scaleX = 0.95;

        if (e.keyCode === 38) {
          // 放大
          isZoomingOut = false;
          scaleX = 1.05;
        }

        if (this.zoom(isZoomingOut, scaleX, this.dataProvider.minPos, this.dataProvider.range)) {
          if (this.dataProvider.crossPoint) {
            this.cross(this.dataProvider.crossPoint);
          }

          this.markerChart.flush();
        }
      }
    }
  }]);

  return KeyboardEvent;
}(Event);

var RootChart =
/*#__PURE__*/
function () {
  function RootChart(dom) {
    var s = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, RootChart);

    if (!dom) {
      throw new Error("Chart version is ".concat("4.2.0", ". Root dom is null, can not initialize the chart!!!"));
    }

    this.style = getDefaultStyle();
    merge(this.style, s);
    this.indicatorParams = getDefaultIndicatorParams();
    this.precision = getDefaultPrecision();
    this.period = getDefaultPeriod();
    dom.style.position = 'relative';
    dom.style.outline = 'none';
    dom.style.borderStyle = 'none';
    dom.tabIndex = 1;
    this.dom = dom;
    this.dataProvider = new DataProvider();
    this.xAxisChart = new XAxisChart(dom, this.style, this.dataProvider, this.period);
    this.mainChart = new MainChart(dom, this.style, this.dataProvider, this.indicatorParams, this.precision);
    this.markerChart = new MarkerChart(dom, this.style, this.dataProvider, this.mainChart.yAxisRender, this.precision);
    this.volIndicatorChart = new IndicatorChart(dom, this.style, this.dataProvider, this.indicatorParams, IndicatorType.VOL);
    this.subIndicatorChart = new IndicatorChart(dom, this.style, this.dataProvider, this.indicatorParams);
    this.tooltipChart = new TooltipChart(dom, this.style, this.mainChart, this.volIndicatorChart, this.subIndicatorChart, this.xAxisChart, this.dataProvider, this.indicatorParams, this.precision);
    this.calcChartDimensions();
    this.initEvent();
  }
  /**
   * 初始化事件
   */


  _createClass(RootChart, [{
    key: "initEvent",
    value: function initEvent() {
      var _this = this;

      var mobile = isMobile(window.navigator.userAgent);
      this.dom.addEventListener('contextmenu', function (e) {
        e.preventDefault();
      }, false);

      var loadMore = function loadMore() {
        // 有更多并且没有在加载则去加载更多
        if (!_this.noMore && !_this.loading && _this.loadMoreCallback && isFunction(_this.loadMoreCallback)) {
          _this.loading = true;

          _this.loadMoreCallback((_this.dataProvider.dataList[0] || {}).timestamp);
        }
      };

      if (mobile) {
        var motionEvent = new TouchEvent(this.tooltipChart, this.mainChart, this.volIndicatorChart, this.subIndicatorChart, this.xAxisChart, this.dataProvider);
        this.dom.addEventListener('touchstart', function (e) {
          motionEvent.touchStart(e);
        }, false);
        this.dom.addEventListener('touchmove', function (e) {
          motionEvent.touchMove(e, loadMore);
        }, false);
        this.dom.addEventListener('touchend', function (e) {
          motionEvent.touchEnd(e);
        }, false);
      } else {
        var _motionEvent = new MouseEvent(this.tooltipChart, this.mainChart, this.volIndicatorChart, this.subIndicatorChart, this.xAxisChart, this.markerChart, this.dataProvider);

        var markerEvent = new MarkerEvent(this.dataProvider, this.markerChart, this.style);
        var keyboardEvent = new KeyboardEvent(this.mainChart, this.volIndicatorChart, this.subIndicatorChart, this.tooltipChart, this.markerChart, this.xAxisChart, this.dataProvider);
        this.dom.addEventListener('mousedown', function (e) {
          _motionEvent.mouseDown(e);

          markerEvent.mouseDown(e);
        }, false);
        this.dom.addEventListener('mouseup', function (e) {
          _motionEvent.mouseUp(e);

          markerEvent.mouseUp(e);
        }, false);
        this.dom.addEventListener('mousemove', function (e) {
          _motionEvent.mouseMove(e, loadMore);

          markerEvent.mouseMove(e);
        }, false);
        this.dom.addEventListener('mouseleave', function (e) {
          _motionEvent.mouseLeave(e);
        }, false);
        this.dom.addEventListener('wheel', function (e) {
          _motionEvent.mouseWheel(e);
        }, false);
        this.dom.addEventListener('keydown', function (e) {
          keyboardEvent.keyDown(e, loadMore);
        }, false);
      }
    }
    /**
     * 刷新图
     * @param charts
     */

  }, {
    key: "flushCharts",
    value: function flushCharts() {
      var charts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = charts[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var chart = _step.value;
          chart.flush();
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
    /**
     * 计算图的尺寸
     */

  }, {
    key: "calcChartDimensions",
    value: function calcChartDimensions() {
      var xAxisHeight = this.calcXAxisHeight();
      var yAxisWidth = this.calcYAxisWidth();
      var domWidth = this.dom.offsetWidth;
      var domHeight = this.dom.offsetHeight;
      this.domWidth = domWidth;
      this.domHeight = domHeight;
      var contentHeight = domHeight - xAxisHeight;
      var chartTop = 0;
      var volChartHeight = 0;
      var subIndicatorChartHeight = 0;
      var isShowVolIndicator = this.volIndicatorChart.indicatorType !== IndicatorType.NO;
      var isShowSubIndicator = this.subIndicatorChart.indicatorType !== IndicatorType.NO;

      if (isShowVolIndicator && isShowSubIndicator) {
        var height = +(contentHeight * 0.18).toFixed(0);
        volChartHeight = height;
        subIndicatorChartHeight = height;
      } else if (!isShowVolIndicator && isShowSubIndicator || isShowVolIndicator && !isShowSubIndicator) {
        var _height = +(contentHeight * 0.26).toFixed(0);

        if (isShowVolIndicator) {
          volChartHeight = _height;
        } else {
          subIndicatorChartHeight = _height;
        }
      }

      var offsetLeft = 0;
      var offsetRight = 0;

      if (this.style.yAxis.position === YAxisPosition.LEFT) {
        offsetLeft = yAxisWidth;
      } else {
        offsetRight = yAxisWidth;
      }

      this.dataProvider.space(domWidth - offsetRight - offsetLeft);
      this.xAxisChart.setChartDimensions(0, domWidth, domHeight, offsetLeft, offsetRight, 0, xAxisHeight);
      var mainChartHeight = contentHeight - volChartHeight - subIndicatorChartHeight;
      this.mainChart.setChartDimensions(chartTop, domWidth, mainChartHeight, offsetLeft, offsetRight);
      this.markerChart.setChartDimensions(chartTop, domWidth, mainChartHeight, offsetLeft, offsetRight);
      chartTop += mainChartHeight;
      this.volIndicatorChart.setChartDimensions(chartTop, domWidth, volChartHeight, offsetLeft, offsetRight);
      chartTop += volChartHeight;
      this.subIndicatorChart.setChartDimensions(chartTop, domWidth, subIndicatorChartHeight, offsetLeft, offsetRight);
      this.tooltipChart.setChartDimensions(0, domWidth, domHeight, offsetLeft, offsetRight, 0, xAxisHeight);
    }
    /**
     * 计算x轴高度
     */

  }, {
    key: "calcXAxisHeight",
    value: function calcXAxisHeight() {
      var xAxis = this.style.xAxis;
      var tickText = xAxis.tick.text;
      var tickLine = xAxis.tick.line;
      var height = tickText.size + tickText.margin;

      if (xAxis.display && tickLine.display) {
        height += tickLine.length;
      }

      if (xAxis.display && xAxis.line.display) {
        height += xAxis.line.size;
      }

      height = Math.max(xAxis.minHeight, Math.min(height, xAxis.maxHeight));
      return +Math.ceil(Number(height)).toFixed(0);
    }
    /**
     * 计算y轴宽度
     */

  }, {
    key: "calcYAxisWidth",
    value: function calcYAxisWidth() {
      var yAxis = this.style.yAxis;
      var tickText = yAxis.tick.text;
      var tickLine = yAxis.tick.line;
      var needsOffset = ((tickText.display || tickLine.display || tickText.margin > 0) && tickText.position === YAxisTextPosition.OUTSIDE || yAxis.line.display) && yAxis.display;

      if (needsOffset) {
        var width = 0;

        if (tickText.position === YAxisTextPosition.OUTSIDE) {
          width += calcTextWidth(tickText.size, '0000000') + tickText.margin;

          if (yAxis.display && tickLine.display) {
            width += tickLine.length;
          }
        }

        var axisLineSize = yAxis.line.size;

        if (yAxis.display && yAxis.line.display) {
          width += axisLineSize;
        }

        if (width > axisLineSize) {
          width = Math.max(yAxis.minWidth, Math.min(width, yAxis.maxWidth));
        }

        return Math.ceil(width);
      }

      return 0;
    }
    /**
     * 计算图表指标
     */

  }, {
    key: "calcChartIndicator",
    value: function calcChartIndicator() {
      if (this.mainChart.chartType === ChartType.REAL_TIME) {
        if (this.style.realTime.averageLine.display) {
          this.dataProvider.dataList = calcIndicator.average(this.dataProvider.dataList);
          this.flushCharts([this.mainChart]);
        }
      } else {
        if (this.mainChart.indicatorType !== IndicatorType.NO) {
          this.calcIndicator(this.mainChart.indicatorType, this.mainChart);
        }
      }

      if (this.volIndicatorChart.indicatorType !== IndicatorType.NO) {
        this.calcIndicator(IndicatorType.VOL, this.volIndicatorChart);
      }

      if (this.subIndicatorChart.indicatorType !== IndicatorType.NO) {
        this.calcIndicator(this.subIndicatorChart.indicatorType, this.subIndicatorChart);
      }
    }
    /**
     * 计算指标
     * @param indicatorType
     * @param chart
     */

  }, {
    key: "calcIndicator",
    value: function calcIndicator$1(indicatorType, chart) {
      var _this2 = this;

      Promise.resolve().then(function () {
        var calc = calcIndicator[indicatorType];

        if (isFunction(calc)) {
          _this2.dataProvider.dataList = calc(_this2.dataProvider.dataList, _this2.indicatorParams[indicatorType]);

          _this2.flushCharts([chart, _this2.tooltipChart]);
        }
      });
    }
    /**
     * 调整尺寸
     */

  }, {
    key: "resize",
    value: function resize() {
      var _this3 = this;

      if (this.domWidth !== this.dom.offsetWidth || this.domHeight !== this.dom.offsetHeight) {
        requestAnimationFrame(function () {
          _this3.calcChartDimensions();
        });
      }
    }
    /**
     * 添加数据集合
     * @param data
     * @param pos
     * @param noMore
     */

  }, {
    key: "addData",
    value: function addData(data) {
      var pos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.dataProvider.dataList.length;
      var noMore = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      if (pos === 0) {
        // 当添加的数据是从0的位置开始时，则判断是在加载更多的数据请求来的，将loading重置为未加载状态
        this.loading = false;
      }

      this.noMore = noMore;
      this.dataProvider.addData(data, pos);
      this.calcChartIndicator();
      this.xAxisChart.flush();
    }
    /**
     * 设置样式
     * @param s
     */

  }, {
    key: "setStyle",
    value: function setStyle() {
      var s = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      merge(this.style, s);
      this.calcChartDimensions();
    }
    /**
     * 设置主图类型
     * @param chartType
     */

  }, {
    key: "setMainChartType",
    value: function setMainChartType(chartType) {
      if (this.mainChart.chartType !== chartType) {
        this.mainChart.chartType = chartType;

        if (chartType === ChartType.REAL_TIME && this.style.realTime.averageLine.display) {
          this.dataProvider.dataList = calcIndicator.average(this.dataProvider.dataList);
        }

        this.flushCharts([this.mainChart, this.tooltipChart]);
        this.clearAllMarker();
      }
    }
    /**
     * 设置主图指标
     * @param indicatorType
     */

  }, {
    key: "setMainIndicatorType",
    value: function setMainIndicatorType(indicatorType) {
      if (this.mainChart.indicatorType !== indicatorType) {
        this.mainChart.indicatorType = indicatorType;

        if (indicatorType === IndicatorType.NO) {
          this.flushCharts([this.mainChart]);
        } else {
          this.calcIndicator(indicatorType, this.mainChart);
        }
      }
    }
    /**
     * 设置副图指标
     * @param indicatorType
     */

  }, {
    key: "setSubIndicatorType",
    value: function setSubIndicatorType(indicatorType) {
      if (this.subIndicatorChart.indicatorType !== indicatorType) {
        var shouldCalcChartHeight = indicatorType === IndicatorType.NO || this.subIndicatorChart.indicatorType === IndicatorType.NO;
        this.subIndicatorChart.indicatorType = indicatorType;

        if (shouldCalcChartHeight) {
          this.calcChartDimensions();
        }

        if (indicatorType !== IndicatorType.NO) {
          this.calcIndicator(indicatorType, this.subIndicatorChart);
        }
      }
    }
    /**
     * 设置指标参数
     * @param indicatorType
     * @param params
     */

  }, {
    key: "setIndicatorParams",
    value: function setIndicatorParams(indicatorType, params) {
      if (!this.indicatorParams.hasOwnProperty(indicatorType) || indicatorType !== IndicatorType.MA && indicatorType !== IndicatorType.VOL && params.length !== this.indicatorParams[indicatorType].length) {
        return;
      }

      this.indicatorParams[indicatorType] = params;

      if (this.getMainIndicatorType() === indicatorType) {
        this.calcIndicator(indicatorType, this.mainChart);
      }

      if (this.isShowVolChart() && indicatorType === IndicatorType.VOL) {
        this.calcIndicator(indicatorType, this.volIndicatorChart);
      }

      if (this.getSubIndicatorType() === indicatorType) {
        this.calcIndicator(indicatorType, this.subIndicatorChart);
      }
    }
    /**
     * 获取指标参数
     * @returns {{DMI: number[], OBV: [number], SAR: number[], BIAS: number[], MTM: number[], CCI: [number], RSI: number[], TRIX: number[], CR: number[], EMV: number[], KDJ: number[], VOL: number[], BOLL: [number], MA: number[], MACD: number[], PSY: [number], DMA: number[], WR: number[], VR: number[], BRAR: [number]}}
     */

  }, {
    key: "getIndicatorParams",
    value: function getIndicatorParams(indicatorType) {
      if (indicatorType) {
        return this.indicatorParams[indicatorType] || [];
      }

      return this.indicatorParams;
    }
    /**
     * 设置精度
     * @param pricePrecision
     * @param volumePrecision
     */

  }, {
    key: "setPrecision",
    value: function setPrecision() {
      var pricePrecision = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.precision.pricePrecision;
      var volumePrecision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.precision.volumePrecision;
      this.precision.pricePrecision = pricePrecision;
      this.precision.volumePrecision = volumePrecision;
    }
    /**
     * 设置k线周期
     * @param period
     */

  }, {
    key: "setPeriod",
    value: function setPeriod(period) {
      if (period && /^[1-9]*?[DWMY]?$/i.test(period)) {
        this.period.period = period;
      }
    }
    /**
     * 显示成交量图
     * @param isShow
     */

  }, {
    key: "showVolChart",
    value: function showVolChart(isShow) {
      var isShowVol = this.volIndicatorChart.indicatorType !== IndicatorType.NO;

      if (isShow !== isShowVol) {
        this.volIndicatorChart.indicatorType = isShow ? IndicatorType.VOL : IndicatorType.NO;
        this.calcChartDimensions();

        if (isShow) {
          this.calcIndicator(IndicatorType.VOL, this.volIndicatorChart);
        }
      }
    }
    /**
     * 设置默认的range
     * @param range
     */

  }, {
    key: "setDefaultRange",
    value: function setDefaultRange(range) {
      if (isNumber(range) && range >= this.dataProvider.minRange && range <= this.dataProvider.maxRange) {
        this.dataProvider.range = range;
        this.dataProvider.space(this.tooltipChart.viewPortHandler.contentRight() - this.tooltipChart.viewPortHandler.contentLeft());

        if (this.dataProvider.minPos + range > this.dataProvider.dataList.length) {
          this.dataProvider.minPos = this.dataProvider.dataList.length - range;

          if (this.dataProvider.minPos < 0) {
            this.dataProvider.minPos = 0;
          }
        }

        this.flushCharts([this.mainChart, this.volIndicatorChart, this.subIndicatorChart, this.xAxisChart]);
      }
    }
    /**
     * 设置最小range
     * @param range
     */

  }, {
    key: "setMinRange",
    value: function setMinRange(range) {
      if (isNumber(range) && range <= this.dataProvider.range) {
        this.dataProvider.minRange = range;
      }
    }
    /**
     * 设置最大range
     * @param range
     */

  }, {
    key: "setMaxRange",
    value: function setMaxRange(range) {
      if (isNumber(range) && range >= this.dataProvider.range) {
        this.dataProvider.maxRange = range;
      }
    }
    /**
     * 获取主图指标类型
     * @returns {string}
     */

  }, {
    key: "getMainIndicatorType",
    value: function getMainIndicatorType() {
      return this.mainChart.indicatorType;
    }
    /**
     * 获取附图指标类型
     * @returns {string}
     */

  }, {
    key: "getSubIndicatorType",
    value: function getSubIndicatorType() {
      return this.subIndicatorChart.indicatorType;
    }
    /**
     * 成交量图是否显示
     * @returns {boolean}
     */

  }, {
    key: "isShowVolChart",
    value: function isShowVolChart() {
      return this.volIndicatorChart.indicatorType !== IndicatorType.NO;
    }
    /**
     * 获取数据集合
     * @returns {Array}
     */

  }, {
    key: "getDataList",
    value: function getDataList() {
      return this.dataProvider.dataList;
    }
    /**
     * 获取当前样式
     * @returns {{indicator, yAxis, xAxis, grid, candle, tooltip}}
     */

  }, {
    key: "getStyle",
    value: function getStyle() {
      return this.style;
    }
    /**
     * 清空数据
     */

  }, {
    key: "clearData",
    value: function clearData() {
      this.dataProvider.dataList = [];
    }
    /**
     * 绘制标记图形
     * @param markerType
     */

  }, {
    key: "drawMarker",
    value: function drawMarker(markerType) {
      // 如果当前是正在绘制其它的线模型，则清除掉当前正在绘制的数据
      var currentMarkerType = this.dataProvider.currentMarkerType;

      if (currentMarkerType !== markerType) {
        var markerData = this.dataProvider.markerDatas[currentMarkerType];

        if (markerData && isArray(markerData)) {
          markerData.splice(markerData.length - 1, 1);
          this.dataProvider.markerDatas[currentMarkerType] = markerData;
          this.tooltipChart.flush();
        }
      }

      this.dataProvider.currentMarkerType = markerType;
    }
    /**
     * 清空所有标记图形
     */

  }, {
    key: "clearAllMarker",
    value: function clearAllMarker() {
      var _this4 = this;

      var markerDatas = this.dataProvider.markerDatas;
      Object.keys(markerDatas).forEach(function (key) {
        _this4.dataProvider.markerDatas[key] = [];
      });
      this.dataProvider.currentMarkerType = MarkerType.NONE;
      this.markerChart.flush();
    }
    /**
     * 加载更多
     * @param cb
     */

  }, {
    key: "loadMore",
    value: function loadMore(cb) {
      this.loadMoreCallback = cb;
    }
    /**
     * 获取图表转换为图片后url
     * @param type
     * @param excludes
     */

  }, {
    key: "getConvertPictureUrl",
    value: function getConvertPictureUrl() {
      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'jpeg';
      var excludes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      if (type !== 'png' && type !== 'jpeg' && type !== 'bmp') {
        throw new Error('Picture format only supports jpeg, png and bmp!!!');
      }

      var c = document.createElement('canvas');
      var xAxisCanvas = this.xAxisChart.canvasDom;
      var mainCanvas = this.mainChart.canvasDom;
      var volCanvas = this.volIndicatorChart.canvasDom;
      var indicatorCanvas = this.subIndicatorChart.canvasDom;
      var tooltipCanvas = this.tooltipChart.canvasDom;
      c.width = tooltipCanvas.width;
      c.height = tooltipCanvas.height;
      c.style.width = tooltipCanvas.style.width;
      c.style.height = tooltipCanvas.style.height;
      var ctx = c.getContext('2d');
      ctx.drawImage(xAxisCanvas, 0, 0, xAxisCanvas.width, xAxisCanvas.height);

      if (!excludes || excludes.indexOf('candle') < 0) {
        ctx.drawImage(mainCanvas, 0, 0, mainCanvas.width, mainCanvas.height);
      }

      if (!excludes || excludes.indexOf('vol') < 0) {
        ctx.drawImage(volCanvas, 0, mainCanvas.height, volCanvas.width, volCanvas.height);
      }

      if (!excludes || excludes.indexOf('subIndicator') < 0) {
        ctx.drawImage(indicatorCanvas, 0, mainCanvas.height + volCanvas.height, indicatorCanvas.width, indicatorCanvas.height);
      }

      if (!excludes || excludes.indexOf('marker') < 0) {
        var markerCanvas = this.markerChart.canvasDom;
        ctx.drawImage(markerCanvas, 0, 0, markerCanvas.width, markerCanvas.height);
      }

      if (!excludes || excludes.indexOf('tooltip') < 0) {
        ctx.drawImage(tooltipCanvas, 0, 0, tooltipCanvas.width, tooltipCanvas.height);
      }

      return c.toDataURL("image/".concat(type));
    }
  }]);

  return RootChart;
}();

function version() {
  return "4.2.0";
}

function init(dom) {
  var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return new RootChart(dom, style);
}

exports.init = init;
exports.version = version;

Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=klinecharts.development.js.map
