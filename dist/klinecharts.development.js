/**
 * @license
 * KLineChart v5.5.1
 * Copyright (c) 2019 lihu.
 * Licensed under Apache License 2.0 https://www.apache.org/licenses/LICENSE-2.0
 */
(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = global || self, factory(global.klinecharts = {}));
}(this, (function (exports) { 'use strict';

function _typeof(obj) {
  "@babel/helpers - typeof";

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

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
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

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function () {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
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

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelper(o) {
  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) {
      var i = 0;

      var F = function () {};

      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var it,
      normalCompletion = true,
      didErr = false,
      err;
  return {
    s: function () {
      it = o[Symbol.iterator]();
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
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
function clone(target) {
  if (!target || !isObject(target)) {
    return target;
  }

  var copy;

  if (isArray(target)) {
    copy = [];
  } else {
    copy = {};
  }

  var p;
  var v;

  for (p in target) {
    if (target.hasOwnProperty(p)) {
      v = target[p];

      if (v && isObject(v)) {
        copy[p] = clone(v);
      } else {
        copy[p] = v;
      }
    }
  }

  return copy;
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
 * 判断是否有效
 * @param value
 * @returns {boolean}
 */

function isValid(value) {
  return value !== null && value !== undefined;
}
/**
 * 判断是否是boolean
 * @param value
 * @returns {boolean}
 */

function isBoolean(value) {
  return typeof value === 'boolean';
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
 * y轴类型
 * @type {{PERCENTAGE: string, NORMAL: string}}
 */

var YAxisType = {
  NORMAL: 'normal',
  PERCENTAGE: 'percentage'
};
/**
 * 主图类型
 * @type {{TIME_LINE: string, CANDLE: string}}
 */

var ChartType = {
  REAL_TIME: 'real_time',
  CANDLE_STICK: 'candle_stick'
};
/**
 * 蜡烛图样式
 * @type {{STROKE: string, DECREASING_STROKE: string, OHLC: string, INCREASING_STROKE: string, SOLID: string}}
 */

var CandleStickStyle = {
  SOLID: 'solid',
  STROKE: 'stroke',
  UP_STROKE: 'up_stroke',
  DOWN_STROKE: 'down_stroke',
  OHLC: 'ohlc'
};
/**
 * 提示文字显示规则
 * @type {{FOLLOW_CROSS: string, NONE: string, ALWAYS: string}}
 */

var FloatLayerPromptDisplayRule = {
  ALWAYS: 'always',
  FOLLOW_CROSS: 'follow_cross',
  NONE: 'none'
};
/**
 * 主图数据提示显示类型
 * @type {{FLOAT: string, FIXED: string}}
 */

var FloatLayerPromptCandleStickTextDisplayType = {
  RECT: 'rect',
  STANDARD: 'standard'
};
/**
 * 默认网格配置
 * @type {{horizontal: {size: number, color: string, dashValue: number[], display: boolean, style: string}, display: boolean, vertical: {size: number, color: string, dashValue: number[], display: boolean, style: string}}}
 */

var defaultGrid = {
  display: true,
  horizontal: {
    display: true,
    size: 1,
    color: '#393939',
    style: LineStyle.DASH,
    dashValue: [2, 2]
  },
  vertical: {
    display: false,
    size: 1,
    color: '#393939',
    style: LineStyle.DASH,
    dashValue: [2, 2]
  }
};
/**
 * 默认蜡烛柱图配置
 * @type {{bar: {upColor: string, style: string, downColor: string}}}
 */

var defaultCandleStick = {
  bar: {
    /**
     * 蜡烛样式
     */
    style: CandleStickStyle.SOLID,

    /**
     * 上涨颜色
     */
    upColor: '#26A69A',

    /**
     * 下跌颜色
     */
    downColor: '#EF5350',

    /**
     * 无变化时颜色
     */
    noChangeColor: '#888888'
  },
  priceMark: {
    display: true,
    high: {
      display: true,
      color: '#D9D9D9',
      textMargin: 5,
      textSize: 10,
      textFamily: 'Helvetica Neue',
      textWeight: 'normal'
    },
    low: {
      display: true,
      color: '#D9D9D9',
      textMargin: 5,
      textSize: 10,
      textFamily: 'Helvetica Neue',
      textWeight: 'normal'
    },
    last: {
      display: true,
      upColor: '#26A69A',
      downColor: '#EF5350',
      noChangeColor: '#888888',
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
        color: '#FFFFFF',
        family: 'Helvetica Neue',
        weight: 'normal'
      }
    }
  }
};
/**
 * 默认的分时图配置
 * @type {{timeLine: {areaFillColor: string, color: string, size: number}, averageLine: {color: string, size: number, display: boolean}}}
 */

var defaultRealTime = {
  timeLine: {
    color: '#2196F3',
    size: 1,
    areaFillColor: 'rgba(33, 150, 243, 0.08)'
  },

  /**
   * 均线
   */
  averageLine: {
    display: true,
    color: '#FF9600',
    size: 1
  }
};
/**
 * 默认的技术指标图配置
 * @type {{decreasingColor: string, lineColors: [string, string, string, string, string], increasingColor: string, lineSize: number}}
 */

var defaultTechnicalIndicator = {
  bar: {
    upColor: '#26A69A',
    downColor: '#EF5350',
    noChangeColor: '#888888'
  },
  line: {
    size: 1,
    colors: ['#D9D9D9', '#FF9600', '#F632FF', '#2196F3', '#9157DB']
  },
  circle: {
    upColor: '#26A69A',
    downColor: '#EF5350',
    noChangeColor: '#888888'
  },
  lastValueMark: {
    display: false,
    textColor: '#ffffff',
    textSize: 12,
    textFamily: 'Helvetica Neue',
    textWeight: 'normal',
    textPaddingLeft: 3,
    textPaddingTop: 2,
    textPaddingRight: 3,
    textPaddingBottom: 2
  }
};
/**
 * 默认x轴配置
 * @type {{minHeight: number, maxHeight: number, axisLine: {color: string, size: number, display: boolean}, display: boolean, tickText: {margin: number, color: string, size: number, display: boolean}, tickLine: {size: number, color: string, display: boolean, length: number}}}
 */

var defaultXAxis = {
  /**
   * 是否显示整个轴
   */
  display: true,

  /**
   * 轴线配置
   */
  axisLine: {
    display: true,
    color: '#888888',
    size: 1
  },

  /**
   * tick文字
   */
  tickText: {
    display: true,
    color: '#D9D9D9',
    size: 12,
    family: 'Helvetica Neue',
    weight: 'normal',
    paddingTop: 3,
    paddingBottom: 6
  },
  // tick线
  tickLine: {
    display: true,
    size: 1,
    length: 3,
    color: '#888888'
  }
};
/**
 * 默认y轴配置
 * @type {{axisLine: {color: string, size: number, display: boolean}, display: boolean, minWidth: number, position: string, tickText: {margin: number, color: string, size: number, display: boolean, position: string}, type: string, maxWidth: number, tickLine: {size: number, color: string, display: boolean, length: number}}}
 */

var defaultYAxis = {
  /**
   * 是否显示整个轴
   */
  display: true,

  /**
   * y轴类型
   */
  type: YAxisType.NORMAL,

  /**
   * 轴位置
   */
  position: YAxisPosition.RIGHT,

  /**
   * 轴是否在内部
   */
  inside: false,

  /**
   * 轴线配置
   */
  axisLine: {
    display: true,
    color: '#888888',
    size: 1
  },

  /**
   * tick文字
   */
  tickText: {
    display: true,
    color: '#D9D9D9',
    size: 12,
    family: 'Helvetica Neue',
    weight: 'normal',
    paddingLeft: 3,
    paddingRight: 6
  },
  // tick线
  tickLine: {
    display: true,
    size: 1,
    length: 3,
    color: '#888888'
  }
};
/**
 * 默认浮层配置
 * @type {{display: boolean}}
 */

var defaultFloatLayer = {
  crossHair: {
    display: true,
    horizontal: {
      display: true,
      line: {
        display: true,
        style: LineStyle.DASH,
        dashValue: [4, 2],
        size: 1,
        color: '#888888'
      },
      text: {
        display: true,
        color: '#D9D9D9',
        size: 12,
        family: 'Helvetica Neue',
        weight: 'normal',
        paddingLeft: 2,
        paddingRight: 2,
        paddingTop: 2,
        paddingBottom: 2,
        borderSize: 1,
        borderColor: '#505050',
        backgroundColor: '#505050'
      }
    },
    vertical: {
      display: true,
      line: {
        display: true,
        style: LineStyle.DASH,
        dashValue: [4, 2],
        size: 1,
        color: '#888888'
      },
      text: {
        display: true,
        color: '#D9D9D9',
        size: 12,
        family: 'Helvetica Neue',
        weight: 'normal',
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
  prompt: {
    displayRule: FloatLayerPromptDisplayRule.ALWAYS,
    candleStick: {
      showType: FloatLayerPromptCandleStickTextDisplayType.STANDARD,
      labels: ['时间', '开', '收', '高', '低', '成交量'],
      values: null,
      rect: {
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
      },
      text: {
        size: 12,
        family: 'Helvetica Neue',
        weight: 'normal',
        color: '#D9D9D9',
        marginLeft: 8,
        marginTop: 6,
        marginRight: 8,
        marginBottom: 0
      }
    },
    technicalIndicator: {
      text: {
        size: 12,
        family: 'Helvetica Neue',
        weight: 'normal',
        color: '#D9D9D9',
        marginTop: 6,
        marginRight: 8,
        marginBottom: 0,
        marginLeft: 8
      },
      point: {
        display: true,
        radius: 3
      }
    }
  }
};
/**
 * 默认图形标记配置
 * @type {{line: {color: string, size: number}, text: {marginRight: number, color: string, size: number, valueFormatter: null, marginBottom: number, marginTop: number, marginLeft: number}, point: {backgroundColor: string, borderColor: string, activeBorderSize: number, activeRadius: number, activeBorderColor: string, activeBackgroundColor: string, borderSize: number, radius: number}}}
 */

var defaultGraphicMark = {
  line: {
    color: '#2196F3',
    size: 1
  },
  point: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
    borderSize: 1,
    radius: 4,
    activeBackgroundColor: '#2196F3',
    activeBorderColor: '#2196F3',
    activeBorderSize: 1,
    activeRadius: 6
  },
  text: {
    color: '#1e88e5',
    size: 12,
    family: 'Helvetica Neue',
    weight: 'normal',
    marginLeft: 2,
    marginRight: 2,
    marginTop: 2,
    marginBottom: 6
  }
};
/**
 * 图表之间默认分割配置
 * @type {{size: number, color: string}}
 */

var defaultSeparator = {
  size: 1,
  color: '#888888',
  fill: true
};
var defaultStyleOptions = {
  grid: defaultGrid,
  candleStick: defaultCandleStick,
  realTime: defaultRealTime,
  technicalIndicator: defaultTechnicalIndicator,
  xAxis: defaultXAxis,
  yAxis: defaultYAxis,
  separator: defaultSeparator,
  floatLayer: defaultFloatLayer,
  graphicMark: defaultGraphicMark
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
/**
 * 格式化时间
 * @param dateTimeFormat
 * @param timestamp
 * @param format
 * @returns {string}
 */

function formatDate(dateTimeFormat, timestamp, format) {
  if (timestamp && isNumber(timestamp)) {
    var date = new Date(timestamp);
    var dateTimeString = dateTimeFormat.format(date);
    var dateString = dateTimeString.match(/^[\d]{1,2}\/[\d]{1,2}\/[\d]{4}/)[0];
    var dateStringArray = dateString.split('/');
    var month = "".concat(dateStringArray[0].length === 1 ? "0".concat(dateStringArray[0]) : dateStringArray[0]);
    var day = "".concat(dateStringArray[1].length === 1 ? "0".concat(dateStringArray[1]) : dateStringArray[1]);
    var timeString = dateTimeString.match(/[\d]{2}:[\d]{2}$/)[0]; // 这里将小时24转换成00

    if (timeString.match(/^[\d]{2}/)[0] === '24') {
      timeString = timeString.replace(/^[\d]{2}/, '00');
    }

    switch (format) {
      case 'YYYY':
        {
          return dateStringArray[2];
        }

      case 'YYYY-MM':
        {
          return "".concat(dateStringArray[2], "-").concat(month);
        }

      case 'YYYY-MM-DD':
        {
          return "".concat(dateStringArray[2], "-").concat(month, "-").concat(day);
        }

      case 'YYYY-MM-DD hh:mm':
        {
          return "".concat(dateStringArray[2], "-").concat(month, "-").concat(day, " ").concat(timeString);
        }

      case 'MM-DD':
        {
          return "".concat(month, "-").concat(day);
        }

      case 'hh:mm':
        {
          return timeString;
        }

      default:
        {
          return "".concat(month, "-").concat(day, " ").concat(timeString);
        }
    }
  }

  return '--';
}
/**
 * 格式化精度
 */

function formatPrecision(value) {
  var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  var v = +value;

  if ((v || v === 0) && isNumber(v)) {
    return v.toFixed(precision);
  }

  return "".concat(v);
}
/**
 * 格式化大数据
 * @param value
 */

function formatBigNumber(value) {
  if (isNumber(+value)) {
    if (value > 1000000000) {
      return "".concat(+(value / 1000000000).toFixed(3), "B");
    }

    if (value > 1000000) {
      return "".concat(+(value / 1000000).toFixed(3), "M");
    }

    if (value > 1000) {
      return "".concat(+(value / 1000).toFixed(3), "K");
    }

    return value;
  }

  return '--';
}

/**
 * 技术指标系列
 * @type {{PRICE: string, VOLUME: string, NORMAL: string}}
 */

var TechnicalIndicatorSeries = {
  PRICE: 'price',
  VOLUME: 'volume',
  NORMAL: 'normal'
};

var TechnicalIndicator = /*#__PURE__*/function () {
  function TechnicalIndicator(_ref) {
    var name = _ref.name,
        series = _ref.series,
        calcParams = _ref.calcParams,
        plots = _ref.plots,
        precision = _ref.precision,
        shouldCheckParamCount = _ref.shouldCheckParamCount,
        shouldOhlc = _ref.shouldOhlc,
        shouldFormatBigNumber = _ref.shouldFormatBigNumber,
        baseValue = _ref.baseValue,
        minValue = _ref.minValue,
        maxValue = _ref.maxValue;

    _classCallCheck(this, TechnicalIndicator);

    // 指标名
    this.name = name || ''; // 指标系列，值有'price', 'volume', 'normal

    this.series = series || 'normal'; // 精度

    this.precision = isValid(precision) && isNumber(precision) && precision >= 0 ? precision : 4; // 计算参数

    this.calcParams = isArray(calcParams) ? calcParams : []; // 数据信息

    this.plots = isArray(plots) ? plots : []; // 是否需要检查参数

    this.shouldCheckParamCount = isBoolean(shouldCheckParamCount) ? shouldCheckParamCount : true; // 是否需要ohlc

    this.shouldOhlc = shouldOhlc; // 是否需要格式化大数据值，从1000开始格式化，比如100000是否需要格式化100K

    this.shouldFormatBigNumber = shouldFormatBigNumber; // 基础比对数据

    this.baseValue = isNumber(baseValue) ? baseValue : null; // 指定的最小值

    this.minValue = minValue; // 指定的最大值

    this.maxValue = maxValue; // 指标计算结果

    this.result = [];
  }

  _createClass(TechnicalIndicator, [{
    key: "setPrecision",
    value: function setPrecision(precision) {
      if (precision >= 0 && isNumber(precision)) {
        this.precision = parseInt(precision, 10);
      }
    }
  }, {
    key: "setCalcParams",
    value: function setCalcParams() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (this.shouldCheckParamCount && params.length !== this.calcParams.length) {
        return;
      }

      this.calcParams = clone(params);
      var plots = this.regeneratePlots(params);

      if (plots && isArray(plots)) {
        this.plots = plots;
      }
    }
    /**
     * 计算技术指标
     */

  }, {
    key: "calcTechnicalIndicator",
    value: function calcTechnicalIndicator(dataList, calcParams) {}
    /**
     * 重新生成各项数据
     * @private
     */

  }, {
    key: "regeneratePlots",
    value: function regeneratePlots(params) {}
  }]);

  return TechnicalIndicator;
}();

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
var MA = 'MA';
var EMA = 'EMA';
var VOL = 'VOL';
var MACD = 'MACD';
var BOLL = 'BOLL';
var KDJ = 'KDJ';
var RSI = 'RSI';
var BIAS = 'BIAS';
var BRAR = 'BRAR';
var CCI = 'CCI';
var DMI = 'DMI';
var CR = 'CR';
var PSY = 'PSY';
var DMA = 'DMA';
var TRIX = 'TRIX';
var OBV = 'OBV';
var VR = 'VR';
var WR = 'WR';
var MTM = 'MTM';
var EMV = 'EMV';
var SAR = 'SAR';

var MovingAverage = /*#__PURE__*/function (_TechnicalIndicator) {
  _inherits(MovingAverage, _TechnicalIndicator);

  var _super = _createSuper(MovingAverage);

  function MovingAverage() {
    _classCallCheck(this, MovingAverage);

    return _super.call(this, {
      name: MA,
      series: TechnicalIndicatorSeries.PRICE,
      calcParams: [5, 10, 30, 60],
      precision: 2,
      shouldCheckParamCount: false,
      shouldOhlc: true,
      plots: [{
        key: 'ma5',
        type: 'line'
      }, {
        key: 'ma10',
        type: 'line'
      }, {
        key: 'ma30',
        type: 'line'
      }, {
        key: 'ma60',
        type: 'line'
      }]
    });
  }

  _createClass(MovingAverage, [{
    key: "regeneratePlots",
    value: function regeneratePlots(params) {
      var plots = [];
      params.forEach(function (p) {
        plots.push({
          key: "ma".concat(p),
          type: 'line'
        });
      });
      return plots;
    }
  }, {
    key: "calcTechnicalIndicator",
    value: function calcTechnicalIndicator(dataList, calcParams) {
      var _this = this;

      var closeSums = [];
      var result = [];
      dataList.forEach(function (kLineData, i) {
        var ma = {};
        var close = kLineData.close;
        calcParams.forEach(function (param, j) {
          closeSums[j] = (closeSums[j] || 0) + close;

          if (i >= param - 1) {
            ma[_this.plots[j].key] = closeSums[j] / param;
            closeSums[j] -= dataList[i - (param - 1)].close;
          }
        });
        result.push(ma);
      });
      return result;
    }
  }]);

  return MovingAverage;
}(TechnicalIndicator);

var ExponentialMovingAverage = /*#__PURE__*/function (_TechnicalIndicator) {
  _inherits(ExponentialMovingAverage, _TechnicalIndicator);

  var _super = _createSuper(ExponentialMovingAverage);

  function ExponentialMovingAverage() {
    _classCallCheck(this, ExponentialMovingAverage);

    return _super.call(this, {
      name: EMA,
      series: TechnicalIndicatorSeries.PRICE,
      calcParams: [6, 12, 20],
      precision: 2,
      shouldCheckParamCount: false,
      shouldOhlc: true,
      plots: [{
        key: 'ema6',
        type: 'line'
      }, {
        key: 'ema12',
        type: 'line'
      }, {
        key: 'ema20',
        type: 'line'
      }]
    });
  }

  _createClass(ExponentialMovingAverage, [{
    key: "regeneratePlots",
    value: function regeneratePlots(params) {
      var plots = [];
      params.forEach(function (p) {
        plots.push({
          key: "ema".concat(p),
          type: 'line'
        });
      });
      return plots;
    }
    /**
     * 计算指数移动平均
     *
     * @param dataList
     * @param calcParams
     * @returns {[]}
     */

  }, {
    key: "calcTechnicalIndicator",
    value: function calcTechnicalIndicator(dataList, calcParams) {
      var _this = this;

      var oldEmas = [];
      var result = [];
      dataList.forEach(function (kLineData, i) {
        var ema = {};
        var close = kLineData.close;
        calcParams.forEach(function (param, j) {
          var emaValue;

          if (i === 0) {
            emaValue = close;
          } else {
            emaValue = (2 * close + (param - 1) * oldEmas[j]) / (param + 1);
          }

          ema[_this.plots[j].key] = emaValue;
          oldEmas[j] = emaValue;
        });
        result.push(ema);
      });
      return result;
    }
  }]);

  return ExponentialMovingAverage;
}(TechnicalIndicator);

var Volume = /*#__PURE__*/function (_TechnicalIndicator) {
  _inherits(Volume, _TechnicalIndicator);

  var _super = _createSuper(Volume);

  function Volume() {
    _classCallCheck(this, Volume);

    return _super.call(this, {
      name: VOL,
      series: TechnicalIndicatorSeries.VOLUME,
      calcParams: [5, 10, 20],
      shouldCheckParamCount: false,
      shouldFormatBigNumber: true,
      precision: 0,
      baseValue: 0,
      minValue: 0,
      plots: [{
        key: 'ma5',
        line: 'line'
      }, {
        key: 'ma10',
        line: 'line'
      }, {
        key: 'ma20',
        line: 'line'
      }, {
        key: 'volume',
        type: 'bar',
        referenceValue: 0,
        color: function color(data, options) {
          var kLineData = data.currentData.kLineData || {};

          if (kLineData.close > kLineData.open) {
            return options.bar.upColor;
          } else if (kLineData.close < kLineData.open) {
            return options.bar.downColor;
          }

          return options.bar.noChangeColor;
        }
      }]
    });
  }

  _createClass(Volume, [{
    key: "regeneratePlots",
    value: function regeneratePlots(params) {
      var plots = [];
      params.forEach(function (p) {
        plots.push({
          key: "ma".concat(p),
          type: 'line'
        });
      });
      plots.push({
        key: 'volume',
        type: 'bar',
        referenceValue: 0,
        color: function color(data, options) {
          var kLineData = data.currentData.kLineData || {};

          if (kLineData.close > kLineData.open) {
            return options.bar.upColor;
          } else if (kLineData.close < kLineData.open) {
            return options.bar.downColor;
          }

          return options.bar.noChangeColor;
        }
      });
      return plots;
    }
  }, {
    key: "calcTechnicalIndicator",
    value: function calcTechnicalIndicator(dataList, calcParams) {
      var _this = this;

      var volSums = [];
      var result = [];
      dataList.forEach(function (kLineData, i) {
        var volume = kLineData.volume || 0;
        var vol = {
          volume: volume
        };
        calcParams.forEach(function (param, j) {
          volSums[j] = (volSums[j] || 0) + volume;

          if (i >= param - 1) {
            vol[_this.plots[j].key] = volSums[j] / param;
            volSums[j] -= dataList[i - (param - 1)].volume;
          }
        });
        result.push(vol);
      });
      return result;
    }
  }]);

  return Volume;
}(TechnicalIndicator);

var MovingAverageConvergenceDivergence = /*#__PURE__*/function (_TechnicalIndicator) {
  _inherits(MovingAverageConvergenceDivergence, _TechnicalIndicator);

  var _super = _createSuper(MovingAverageConvergenceDivergence);

  function MovingAverageConvergenceDivergence() {
    _classCallCheck(this, MovingAverageConvergenceDivergence);

    return _super.call(this, {
      name: MACD,
      calcParams: [12, 26, 9],
      baseValue: 0,
      plots: [{
        key: 'diff',
        type: 'line'
      }, {
        key: 'dea',
        type: 'line'
      }, {
        key: 'macd',
        type: 'bar',
        color: function color(data, technicalIndicatorOptions) {
          var currentData = data.currentData;
          var macd = (currentData.technicalIndicatorData || {}).macd;

          if (macd > 0) {
            return technicalIndicatorOptions.bar.upColor;
          } else if (macd < 0) {
            return technicalIndicatorOptions.bar.downColor;
          } else {
            return technicalIndicatorOptions.bar.noChangeColor;
          }
        },
        isStroke: function isStroke(data) {
          var preData = data.preData,
              currentData = data.currentData;
          var macd = (currentData.technicalIndicatorData || {}).macd;
          var preMacd = (preData.technicalIndicatorData || {}).macd;
          return preMacd < macd;
        }
      }]
    });
  }
  /**
   * 计算MACD指标
   *
   * MACD：参数快线移动平均、慢线移动平均、移动平均，
   * 默认参数值12、26、9。
   * 公式：⒈首先分别计算出收盘价12日指数平滑移动平均线与26日指数平滑移动平均线，分别记为EMA(12）与EMA(26）。
   * ⒉求这两条指数平滑移动平均线的差，即：DIFF=EMA（SHORT）－EMA（LONG）。
   * ⒊再计算DIFF的M日的平均的指数平滑移动平均线，记为DEA。
   * ⒋最后用DIFF减DEA，得MACD。MACD通常绘制成围绕零轴线波动的柱形图。MACD柱状大于0涨颜色，小于0跌颜色。
   *
   * @param dataList
   * @param calcParams
   * @returns {[]}
   */


  _createClass(MovingAverageConvergenceDivergence, [{
    key: "calcTechnicalIndicator",
    value: function calcTechnicalIndicator(dataList, calcParams) {
      var emaShort;
      var emaLong;
      var oldEmaShort = 0;
      var oldEmaLong = 0;
      var dea = 0;
      var oldDea = 0;
      var macd = 0;
      var result = [];
      dataList.forEach(function (kLineData, i) {
        var close = kLineData.close;

        if (i === 0) {
          emaShort = close;
          emaLong = close;
        } else {
          emaShort = (2 * close + (calcParams[0] - 1) * oldEmaShort) / (calcParams[0] + 1);
          emaLong = (2 * close + (calcParams[1] - 1) * oldEmaLong) / (calcParams[1] + 1);
        }

        var diff = emaShort - emaLong;
        dea = (diff * 2 + oldDea * (calcParams[2] - 1)) / (calcParams[2] + 1);
        macd = (diff - dea) * 2;
        oldEmaShort = emaShort;
        oldEmaLong = emaLong;
        oldDea = dea;
        result.push({
          diff: diff,
          dea: dea,
          macd: macd
        });
      });
      return result;
    }
  }]);

  return MovingAverageConvergenceDivergence;
}(TechnicalIndicator);

var BollingerBands = /*#__PURE__*/function (_TechnicalIndicator) {
  _inherits(BollingerBands, _TechnicalIndicator);

  var _super = _createSuper(BollingerBands);

  function BollingerBands() {
    _classCallCheck(this, BollingerBands);

    return _super.call(this, {
      name: BOLL,
      series: TechnicalIndicatorSeries.PRICE,
      calcParams: [20],
      precision: 2,
      shouldOhlc: true,
      plots: [{
        key: 'up',
        type: 'line'
      }, {
        key: 'mid',
        type: 'line'
      }, {
        key: 'dn',
        type: 'line'
      }]
    });
  }

  _createClass(BollingerBands, [{
    key: "calcTechnicalIndicator",
    value: function calcTechnicalIndicator(dataList, calcParams) {
      var _this = this;

      var p = calcParams[0] - 1;
      var closeSum = 0;
      var result = [];
      dataList.forEach(function (kLineData, i) {
        var close = kLineData.close;
        var boll = {};
        closeSum += close;

        if (i >= p) {
          boll.mid = closeSum / calcParams[0];

          var md = _this._getBollMd(dataList.slice(i - p, i + 1), boll.mid);

          boll.up = boll.mid + 2 * md;
          boll.dn = boll.mid - 2 * md;
          closeSum -= dataList[i - p].close;
        }

        result.push(boll);
      });
      return result;
    }
    /**
     * 计算布林指标中的标准差
     * @param dataList
     * @param ma
     * @returns {number}
     * @private
     */

  }, {
    key: "_getBollMd",
    value: function _getBollMd(dataList, ma) {
      var dataSize = dataList.length;
      var sum = 0;
      dataList.forEach(function (data) {
        var closeMa = data.close - ma;
        sum += closeMa * closeMa;
      });
      var b = sum > 0;
      sum = Math.abs(sum);
      var md = Math.sqrt(sum / dataSize);
      return b ? md : -1 * md;
    }
  }]);

  return BollingerBands;
}(TechnicalIndicator);

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

/**
 * 计算n周期内最高和最低
 * @param dataList
 * @returns {{ln: number, hn: number}}
 */
function calcHnLn() {
  var dataList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var hn = -Infinity;
  var ln = Infinity;
  dataList.forEach(function (data) {
    hn = Math.max(data.high, hn);
    ln = Math.min(data.low, ln);
  });
  return {
    hn: hn,
    ln: ln
  };
}

var StockIndicatorKDJ = /*#__PURE__*/function (_TechnicalIndicator) {
  _inherits(StockIndicatorKDJ, _TechnicalIndicator);

  var _super = _createSuper(StockIndicatorKDJ);

  function StockIndicatorKDJ() {
    _classCallCheck(this, StockIndicatorKDJ);

    return _super.call(this, {
      name: KDJ,
      calcParams: [9, 3, 3],
      plots: [{
        key: 'k',
        type: 'line'
      }, {
        key: 'd',
        type: 'line'
      }, {
        key: 'j',
        type: 'line'
      }]
    });
  }
  /**
   * 计算KDJ
   * @param dataList
   * @param calcParams
   * @returns {[]}
   */


  _createClass(StockIndicatorKDJ, [{
    key: "calcTechnicalIndicator",
    value: function calcTechnicalIndicator(dataList, calcParams) {
      var result = [];
      dataList.forEach(function (kLineData, i) {
        var kdj = {};
        var close = kLineData.close;

        if (i >= calcParams[0] - 1) {
          var lhn = calcHnLn(dataList.slice(i - (calcParams[0] - 1), i + 1));
          var ln = lhn.ln;
          var hn = lhn.hn;
          var hnSubLn = hn - ln;
          var rsv = (close - ln) / (hnSubLn === 0 ? 1 : hnSubLn) * 100; // 当日K值=2/3×前一日K值+1/3×当日RSV
          // 当日D值=2/3×前一日D值+1/3×当日K值
          // 若无前一日K 值与D值，则可分别用50来代替。
          // J值=3*当日K值-2*当日D值

          kdj.k = ((calcParams[1] - 1) * (result[i - 1].k || 50) + rsv) / calcParams[1];
          kdj.d = ((calcParams[2] - 1) * (result[i - 1].d || 50) + kdj.k) / calcParams[2];
          kdj.j = 3.0 * kdj.k - 2.0 * kdj.d;
        }

        result.push(kdj);
      });
      return result;
    }
  }]);

  return StockIndicatorKDJ;
}(TechnicalIndicator);

var RelativeStrengthIndex = /*#__PURE__*/function (_TechnicalIndicator) {
  _inherits(RelativeStrengthIndex, _TechnicalIndicator);

  var _super = _createSuper(RelativeStrengthIndex);

  function RelativeStrengthIndex() {
    _classCallCheck(this, RelativeStrengthIndex);

    return _super.call(this, {
      name: RSI,
      calcParams: [6, 12, 24],
      shouldCheckParamCount: false,
      plots: [{
        key: 'rsi6',
        type: 'line'
      }, {
        key: 'rsi12',
        type: 'line'
      }, {
        key: 'rsi24',
        type: 'line'
      }]
    });
  }

  _createClass(RelativeStrengthIndex, [{
    key: "regeneratePlots",
    value: function regeneratePlots(params) {
      var plots = [];
      params.forEach(function (p) {
        plots.push({
          key: "rsi".concat(p),
          type: 'line'
        });
      });
      return plots;
    }
    /**
     * 计算RSI
     * N日RSI = N日内收盘涨幅的平均值/(N日内收盘涨幅均值+N日内收盘跌幅均值) ×100%
     *
     * @param dataList
     * @param calcParams
     * @returns {[]}
     */

  }, {
    key: "calcTechnicalIndicator",
    value: function calcTechnicalIndicator(dataList, calcParams) {
      var _this = this;

      var sumCloseAs = [];
      var sumCloseBs = [];
      var result = [];
      dataList.forEach(function (kLineData, i) {
        var rsi = {};
        var open = kLineData.open;
        calcParams.forEach(function (param, j) {
          var tmp = (kLineData.close - open) / open;
          sumCloseAs[j] = sumCloseAs[j] || 0;
          sumCloseBs[j] = sumCloseBs[j] || 0;

          if (tmp > 0) {
            sumCloseAs[j] = sumCloseAs[j] + tmp;
          } else {
            sumCloseBs[j] = sumCloseBs[j] + Math.abs(tmp);
          }

          if (i >= param - 1) {
            var a = sumCloseAs[j] / param;
            var b = (sumCloseAs[j] + sumCloseBs[j]) / param;
            rsi[_this.plots[j].key] = b === 0 ? 0 : a / b * 100;
            var agoData = dataList[i - (param - 1)];
            var agoOpen = agoData.open;
            var agoTmp = (agoData.close - agoOpen) / agoOpen;

            if (agoTmp > 0) {
              sumCloseAs[j] -= agoTmp;
            } else {
              sumCloseBs[j] -= Math.abs(agoTmp);
            }
          }
        });
        result.push(rsi);
      });
      return result;
    }
  }]);

  return RelativeStrengthIndex;
}(TechnicalIndicator);

var Bias = /*#__PURE__*/function (_TechnicalIndicator) {
  _inherits(Bias, _TechnicalIndicator);

  var _super = _createSuper(Bias);

  function Bias() {
    _classCallCheck(this, Bias);

    return _super.call(this, {
      name: BIAS,
      calcParams: [6, 12, 24],
      shouldCheckParamCount: false,
      plots: [{
        key: 'bias6',
        type: 'line'
      }, {
        key: 'bias12',
        type: 'line'
      }, {
        key: 'bias24',
        type: 'line'
      }]
    });
  }

  _createClass(Bias, [{
    key: "regeneratePlots",
    value: function regeneratePlots(params) {
      var plots = [];
      params.forEach(function (p) {
        plots.push({
          key: "bias".concat(p),
          type: 'line'
        });
      });
      return plots;
    }
    /**
     * 计算BIAS指标
     * 乖离率=[(当日收盘价-N日平均价)/N日平均价]*100%
     *
     * @param dataList
     * @param calcParams
     * @returns {[]}
     */

  }, {
    key: "calcTechnicalIndicator",
    value: function calcTechnicalIndicator(dataList, calcParams) {
      var _this = this;

      var closeSums = [];
      var result = [];
      dataList.forEach(function (kLineData, i) {
        var bias = {};
        var close = kLineData.close;
        calcParams.forEach(function (param, j) {
          closeSums[j] = (closeSums[j] || 0) + close;

          if (i >= param - 1) {
            var mean = closeSums[j] / calcParams[j];
            bias[_this.plots[j].key] = (close - mean) / mean * 100;
            closeSums[j] -= dataList[i - (param - 1)].close;
          }
        });
        result.push(bias);
      });
      return result;
    }
  }]);

  return Bias;
}(TechnicalIndicator);

var Brar = /*#__PURE__*/function (_TechnicalIndicator) {
  _inherits(Brar, _TechnicalIndicator);

  var _super = _createSuper(Brar);

  function Brar() {
    _classCallCheck(this, Brar);

    return _super.call(this, {
      name: BRAR,
      calcParams: [26],
      plots: [{
        key: 'br',
        type: 'line'
      }, {
        key: 'ar',
        type: 'line'
      }]
    });
  }
  /**
   * 计算BRAR指标
   * 默认参数是26。
   * 公式N日BR=N日内（H－CY）之和除以N日内（CY－L）之和*100，
   * 其中，H为当日最高价，L为当日最低价，CY为前一交易日的收盘价，N为设定的时间参数。
   * N日AR=(N日内（H－O）之和除以N日内（O－L）之和)*100，
   * 其中，H为当日最高价，L为当日最低价，O为当日开盘价，N为设定的时间参数
   *
   * @param dataList
   * @param calcParams
   * @returns {[]}
   */


  _createClass(Brar, [{
    key: "calcTechnicalIndicator",
    value: function calcTechnicalIndicator(dataList, calcParams) {
      var hcy = 0;
      var cyl = 0;
      var ho = 0;
      var ol = 0;
      var result = [];
      dataList.forEach(function (kLineData, i) {
        var brar = {};

        if (i > 0) {
          var high = kLineData.high;
          var low = kLineData.low;
          var open = kLineData.open;
          var preClose = dataList[i - 1].close;
          ho += high - open;
          ol += open - low;
          hcy += high - preClose;
          cyl += preClose - low;

          if (i >= calcParams[0]) {
            if (ol !== 0) {
              brar.ar = ho / ol * 100;
            } else {
              brar.ar = 0;
            }

            if (cyl !== 0) {
              brar.br = hcy / cyl * 100;
            } else {
              brar.br = 0;
            }

            var agoHigh = dataList[i - (calcParams[0] - 1)].high;
            var agoLow = dataList[i - (calcParams[0] - 1)].low;
            var agoOpen = dataList[i - (calcParams[0] - 1)].open;
            var agoPreClose = dataList[i - calcParams[0]].close;
            hcy -= agoHigh - agoPreClose;
            cyl -= agoPreClose - agoLow;
            ho -= agoHigh - agoOpen;
            ol -= agoOpen - agoLow;
          }
        }

        result.push(brar);
      });
      return result;
    }
  }]);

  return Brar;
}(TechnicalIndicator);

var CommodityChannelIndex = /*#__PURE__*/function (_TechnicalIndicator) {
  _inherits(CommodityChannelIndex, _TechnicalIndicator);

  var _super = _createSuper(CommodityChannelIndex);

  function CommodityChannelIndex() {
    _classCallCheck(this, CommodityChannelIndex);

    return _super.call(this, {
      name: CCI,
      calcParams: [13],
      plots: [{
        key: 'cci',
        type: 'line'
      }]
    });
  }
  /**
   * 计算CCI指标
   * CCI（N日）=（TP－MA）÷MD÷0.015
   * 其中，TP=（最高价+最低价+收盘价）÷3
   * MA=近N日收盘价的累计之和÷N
   * MD=近N日（MA－收盘价）的累计之和÷N
   *
   * @param dataList
   * @param calcParams
   * @returns {[]}
   */


  _createClass(CommodityChannelIndex, [{
    key: "calcTechnicalIndicator",
    value: function calcTechnicalIndicator(dataList, calcParams) {
      var p = calcParams[0] - 1;
      var closeSum = 0;
      var md;
      var maSubCloseSum = 0;
      var maList = [];
      var result = [];
      dataList.forEach(function (kLineData, i) {
        var cci = {};
        var close = kLineData.close;
        closeSum += close;
        var ma;

        if (i >= p) {
          ma = closeSum / calcParams[0];
        } else {
          ma = closeSum / (i + 1);
        }

        maList.push(ma);
        maSubCloseSum += Math.abs(ma - close);

        if (i >= p) {
          var tp = (kLineData.high + kLineData.low + close) / 3;
          md = maSubCloseSum / calcParams[0];
          cci.cci = md !== 0 ? (tp - ma) / md / 0.015 : 0.0;
          var agoClose = dataList[i - p].close;
          closeSum -= agoClose;
          var agoMa = maList[i - p];
          maSubCloseSum -= Math.abs(agoMa - agoClose);
        }

        result.push(cci);
      });
      return result;
    }
  }]);

  return CommodityChannelIndex;
}(TechnicalIndicator);

var DirectionalMovementIndex = /*#__PURE__*/function (_TechnicalIndicator) {
  _inherits(DirectionalMovementIndex, _TechnicalIndicator);

  var _super = _createSuper(DirectionalMovementIndex);

  function DirectionalMovementIndex() {
    _classCallCheck(this, DirectionalMovementIndex);

    return _super.call(this, {
      name: DMI,
      calcParams: [14, 6],
      plots: [{
        key: 'pdi',
        type: 'line'
      }, {
        key: 'mdi',
        type: 'line'
      }, {
        key: 'adx',
        type: 'line'
      }, {
        key: 'adxr',
        type: 'line'
      }]
    });
  }
  /**
   * 计算DMI
   * MTR:=EXPMEMA(MAX(MAX(HIGH-LOW,ABS(HIGH-REF(CLOSE,1))),ABS(REF(CLOSE,1)-LOW)),N)
   * HD :=HIGH-REF(HIGH,1);
   * LD :=REF(LOW,1)-LOW;
   * DMP:=EXPMEMA(IF(HD>0&&HD>LD,HD,0),N);
   * DMM:=EXPMEMA(IF(LD>0&&LD>HD,LD,0),N);
   *
   * PDI: DMP*100/MTR;
   * MDI: DMM*100/MTR;
   * ADX: EXPMEMA(ABS(MDI-PDI)/(MDI+PDI)*100,MM);
   * ADXR:EXPMEMA(ADX,MM);
   * 公式含义：
   * MTR赋值:最高价-最低价和最高价-昨收的绝对值的较大值和昨收-最低价的绝对值的较大值的N日指数平滑移动平均
   * HD赋值:最高价-昨日最高价
   * LD赋值:昨日最低价-最低价
   * DMP赋值:如果HD>0并且HD>LD,返回HD,否则返回0的N日指数平滑移动平均
   * DMM赋值:如果LD>0并且LD>HD,返回LD,否则返回0的N日指数平滑移动平均
   * 输出PDI:DMP*100/MTR
   * 输出MDI:DMM*100/MTR
   * 输出ADX:MDI-PDI的绝对值/(MDI+PDI)*100的MM日指数平滑移动平均
   * 输出ADXR:ADX的MM日指数平滑移动平均
   * @param dataList
   * @param calcParams
   * @returns {[]}
   */


  _createClass(DirectionalMovementIndex, [{
    key: "calcTechnicalIndicator",
    value: function calcTechnicalIndicator(dataList, calcParams) {
      var trSum = 0;
      var trList = [];
      var dmpSum = 0;
      var dmpList = [];
      var dmmSum = 0;
      var dmmList = [];
      var dxSum = 0;
      var dxList = [];
      var result = [];
      dataList.forEach(function (kLineData, i) {
        var dmi = {};

        if (i > 0) {
          var preClose = dataList[i - 1].close;
          var high = kLineData.high;
          var low = kLineData.low;
          var hl = high - low;
          var hcy = Math.abs(high - preClose);
          var lcy = Math.abs(low - preClose);
          var hhy = high - dataList[i - 1].high;
          var lyl = dataList[i - 1].low - low;
          var tr = Math.max(Math.max(hl, hcy), lcy);
          trSum += tr;
          trList.push(tr);
          var h = hhy > 0.0 && hhy > lyl ? hhy : 0.0;
          dmpSum += h;
          dmpList.push(h);
          var l = lyl > 0 && lyl > hhy ? lyl : 0.0;
          dmmSum += l;
          dmmList.push(l);

          if (i >= calcParams[0]) {
            var pdi;
            var mdi;

            if (trSum === 0) {
              pdi = 0;
              mdi = 0;
            } else {
              pdi = dmpSum * 100 / trSum;
              mdi = dmmSum * 100 / trSum;
            }

            var dx;

            if (mdi + pdi === 0) {
              dx = 0;
            } else {
              dx = Math.abs(mdi - pdi) / (mdi + pdi) * 100;
            }

            dxSum += dx;
            dxList.push(dx);
            dmi.pdi = pdi;
            dmi.mdi = mdi;

            if (i >= calcParams[0] + calcParams[1] - 1) {
              var adx = dxSum / calcParams[1];
              dmi.adx = adx;

              if (i >= calcParams[0] + calcParams[1] * 2 - 2) {
                dmi.adxr = (adx + result[i - (calcParams[1] - 1)].adx) / 2;
              }

              dxSum -= dxList[i - (calcParams[0] + calcParams[1] - 1)];
            }

            trSum -= trList[i - calcParams[0]];
            dmpSum -= dmpList[i - calcParams[0]];
            dmmSum -= dmmList[i - calcParams[0]];
          }
        }

        result.push(dmi);
      });
      return result;
    }
  }]);

  return DirectionalMovementIndex;
}(TechnicalIndicator);

var CurrentRatio = /*#__PURE__*/function (_TechnicalIndicator) {
  _inherits(CurrentRatio, _TechnicalIndicator);

  var _super = _createSuper(CurrentRatio);

  function CurrentRatio() {
    _classCallCheck(this, CurrentRatio);

    return _super.call(this, {
      name: CR,
      calcParams: [26, 10, 20, 40, 60],
      plots: [{
        key: 'cr',
        type: 'line'
      }, {
        key: 'ma1',
        type: 'line'
      }, {
        key: 'ma2',
        type: 'line'
      }, {
        key: 'ma3',
        type: 'line'
      }, {
        key: 'ma4',
        type: 'line'
      }]
    });
  }
  /**
   * MID:=REF(HIGH+LOW,1)/2;
   * CR:SUM(MAX(0,HIGH-MID),N)/SUM(MAX(0,MID-LOW),N)*100;
   * MA1:REF(MA(CR,M1),M1/2.5+1);
   * MA2:REF(MA(CR,M2),M2/2.5+1);
   * MA3:REF(MA(CR,M3),M3/2.5+1);
   * MA4:REF(MA(CR,M4),M4/2.5+1);
   * MID赋值:(昨日最高价+昨日最低价)/2
   * 输出带状能量线:0和最高价-MID的较大值的N日累和/0和MID-最低价的较大值的N日累和*100
   * 输出MA1:M1(5)/2.5+1日前的CR的M1(5)日简单移动平均
   * 输出MA2:M2(10)/2.5+1日前的CR的M2(10)日简单移动平均
   * 输出MA3:M3(20)/2.5+1日前的CR的M3(20)日简单移动平均
   * 输出MA4:M4/2.5+1日前的CR的M4日简单移动平均
   * @param dataList
   * @param calcParams
   * @returns {[]}
   */


  _createClass(CurrentRatio, [{
    key: "calcTechnicalIndicator",
    value: function calcTechnicalIndicator(dataList, calcParams) {
      var ma1ForwardPeriod = Math.ceil(calcParams[1] / 2.5 + 1);
      var ma2ForwardPeriod = Math.ceil(calcParams[2] / 2.5 + 1);
      var ma3ForwardPeriod = Math.ceil(calcParams[3] / 2.5 + 1);
      var ma4ForwardPeriod = Math.ceil(calcParams[4] / 2.5 + 1);
      var ma1Sum = 0;
      var ma1List = [];
      var ma2Sum = 0;
      var ma2List = [];
      var ma3Sum = 0;
      var ma3List = [];
      var ma4Sum = 0;
      var ma4List = [];
      var result = [];
      dataList.forEach(function (kLineData, i) {
        var cr = {};

        if (i > 0) {
          var preData = dataList[i - 1];
          var preMid = (preData.high + preData.close + preData.low + preData.open) / 4;
          var highSubPreMid = Math.max(0, kLineData.high - preMid);
          var preMidSubLow = Math.max(0, preMid - kLineData.low);

          if (i >= calcParams[0]) {
            if (preMidSubLow !== 0) {
              cr.cr = highSubPreMid / preMidSubLow * 100;
            } else {
              cr.cr = 0;
            }

            var agoPreData = dataList[i - calcParams[0]];
            var agoPreMid = (agoPreData.high + agoPreData.close + agoPreData.low + agoPreData.open) / 4;
            var agoData = dataList[i - (calcParams[0] - 1)];
            var agoHighSubPreMid = Math.max(0, agoData.high - agoPreMid);
            var agoPreMidSubLow = Math.max(0, agoPreMid - agoData.low);
            ma1Sum += cr.cr;
            ma2Sum += cr.cr;
            ma3Sum += cr.cr;
            ma4Sum += cr.cr;

            if (i >= calcParams[0] + calcParams[1] - 1) {
              ma1List.push(ma1Sum / calcParams[1]);

              if (i >= calcParams[0] + calcParams[1] + ma1ForwardPeriod - 2) {
                cr.ma1 = ma1List[ma1List.length - 1 - ma1ForwardPeriod];
              }

              ma1Sum -= result[i - (calcParams[1] - 1)].cr;
            }

            if (i >= calcParams[0] + calcParams[2] - 1) {
              ma2List.push(ma2Sum / calcParams[2]);

              if (i >= calcParams[0] + calcParams[2] + ma2ForwardPeriod - 2) {
                cr.ma2 = ma2List[ma2List.length - 1 - ma2ForwardPeriod];
              }

              ma2Sum -= result[i - (calcParams[2] - 1)].cr;
            }

            if (i >= calcParams[0] + calcParams[3] - 1) {
              ma3List.push(ma3Sum / calcParams[3]);

              if (i >= calcParams[0] + calcParams[3] + ma3ForwardPeriod - 2) {
                cr.ma3 = ma3List[ma3List.length - 1 - ma3ForwardPeriod];
              }

              ma3Sum -= result[i - (calcParams[3] - 1)].cr;
            }

            if (i >= calcParams[0] + calcParams[4] - 1) {
              ma4List.push(ma4Sum / calcParams[4]);

              if (i >= calcParams[0] + calcParams[4] + ma4ForwardPeriod - 2) {
                cr.ma4 = ma4List[ma4List.length - 1 - ma4ForwardPeriod];
              }

              ma4Sum -= result[i - (calcParams[4] - 1)].cr;
            }
          }
        }

        result.push(cr);
      });
      return result;
    }
  }]);

  return CurrentRatio;
}(TechnicalIndicator);

var PsychologicalLine = /*#__PURE__*/function (_TechnicalIndicator) {
  _inherits(PsychologicalLine, _TechnicalIndicator);

  var _super = _createSuper(PsychologicalLine);

  function PsychologicalLine() {
    _classCallCheck(this, PsychologicalLine);

    return _super.call(this, {
      name: PSY,
      calcParams: [12, 6],
      plots: [{
        key: 'psy',
        type: 'line'
      }, {
        key: 'psyMa',
        type: 'line'
      }]
    });
  }
  /**
   * 计算psy
   * 公式：PSY=N日内的上涨天数/N×100%。
   *
   * @param dataList
   * @param calcParams
   * @returns {[]}
   */


  _createClass(PsychologicalLine, [{
    key: "calcTechnicalIndicator",
    value: function calcTechnicalIndicator(dataList, calcParams) {
      var upCount = 0;
      var psySum = 0;
      var upList = [];
      var result = [];
      dataList.forEach(function (kLineData, i) {
        var psy = {};
        var upFlag = kLineData.close - kLineData.open > 0 ? 1 : 0;
        upList.push(upFlag);
        upCount += upFlag;

        if (i >= calcParams[0] - 1) {
          psy.psy = upCount / calcParams[0] * 100;
          psySum += psy.psy;

          if (i >= calcParams[0] + calcParams[1] - 2) {
            psy.psyMa = psySum / calcParams[1];
            psySum -= result[i - (calcParams[1] - 1)].psy;
          }

          upCount -= upList[i - (calcParams[0] - 1)];
        }

        result.push(psy);
      });
      return result;
    }
  }]);

  return PsychologicalLine;
}(TechnicalIndicator);

var DifferentOfMovingAverage = /*#__PURE__*/function (_TechnicalIndicator) {
  _inherits(DifferentOfMovingAverage, _TechnicalIndicator);

  var _super = _createSuper(DifferentOfMovingAverage);

  function DifferentOfMovingAverage() {
    _classCallCheck(this, DifferentOfMovingAverage);

    return _super.call(this, {
      name: DMA,
      calcParams: [10, 50, 10],
      plots: [{
        key: 'dma',
        type: 'line'
      }, {
        key: 'ama',
        type: 'line'
      }]
    });
  }
  /**
   * 计算DMA
   * 公式：DIF:MA(CLOSE,N1)-MA(CLOSE,N2);DIFMA:MA(DIF,M)
   *
   * @param dataList
   * @param calcParams
   * @returns {[]}
   */


  _createClass(DifferentOfMovingAverage, [{
    key: "calcTechnicalIndicator",
    value: function calcTechnicalIndicator(dataList, calcParams) {
      var maxParam = Math.max(calcParams[0], calcParams[1]);
      var closeSum1 = 0;
      var closeSum2 = 0;
      var dmaSum = 0;
      var result = [];
      dataList.forEach(function (kLineData, i) {
        var dma = {};
        var close = kLineData.close;
        closeSum1 += close;
        closeSum2 += close;
        var ma1;
        var ma2;

        if (i >= calcParams[0] - 1) {
          ma1 = closeSum1 / calcParams[0];
          closeSum1 -= dataList[i - (calcParams[0] - 1)].close;
        }

        if (i >= calcParams[1] - 1) {
          ma2 = closeSum2 / calcParams[1];
          closeSum2 -= dataList[i - (calcParams[1] - 1)].close;
        }

        if (i >= maxParam - 1) {
          var dif = ma1 - ma2;
          dma.dma = dif;
          dmaSum += dif;

          if (i >= maxParam + calcParams[2] - 2) {
            dma.ama = dmaSum / calcParams[2];
            dmaSum -= result[i - (calcParams[2] - 1)].dma;
          }
        }

        result.push(dma);
      });
      return result;
    }
  }]);

  return DifferentOfMovingAverage;
}(TechnicalIndicator);

var TripleExponentiallySmoothedAverage = /*#__PURE__*/function (_TechnicalIndicator) {
  _inherits(TripleExponentiallySmoothedAverage, _TechnicalIndicator);

  var _super = _createSuper(TripleExponentiallySmoothedAverage);

  function TripleExponentiallySmoothedAverage() {
    _classCallCheck(this, TripleExponentiallySmoothedAverage);

    return _super.call(this, {
      name: TRIX,
      calcParams: [12, 20],
      plots: [{
        key: 'trix',
        type: 'line'
      }, {
        key: 'trixMa',
        type: 'line'
      }]
    });
  }
  /**
   * 计算trix
   * TR=收盘价的N日指数移动平均的N日指数移动平均的N日指数移动平均；
   * TRIX=(TR-昨日TR)/昨日TR*100；
   * MATRIX=TRIX的M日简单移动平均；
   * 默认参数N设为12，默认参数M设为20；
   * 默认参数12、20
   * 公式：MTR:=EMA(EMA(EMA(CLOSE,N),N),N)
   * TRIX:(MTR-REF(MTR,1))/REF(MTR,1)*100;
   * TRMA:MA(TRIX,M)
   *
   * @param dataList
   * @param calcParams
   * @returns {[]}
   */


  _createClass(TripleExponentiallySmoothedAverage, [{
    key: "calcTechnicalIndicator",
    value: function calcTechnicalIndicator(dataList, calcParams) {
      var emaClose1;
      var emaClose2;
      var emaClose3;
      var oldEmaClose1;
      var oldEmaClose2;
      var oldEmaClose3;
      var trixSum = 0;
      var result = [];
      dataList.forEach(function (kLineData, i) {
        var trix = {};
        var close = kLineData.close;

        if (i === 0) {
          emaClose1 = close;
          emaClose2 = close;
          emaClose3 = close;
        } else {
          emaClose1 = (2 * close + (calcParams[0] - 1) * oldEmaClose1) / (calcParams[0] + 1);
          emaClose2 = (2 * emaClose1 + (calcParams[0] - 1) * oldEmaClose2) / (calcParams[0] + 1);
          emaClose3 = (2 * emaClose2 + (calcParams[0] - 1) * oldEmaClose3) / (calcParams[0] + 1);
          trix.trix = oldEmaClose3 === 0.0 ? 0.0 : (emaClose3 - oldEmaClose3) / oldEmaClose3 * 100;
          trixSum += trix.trix;

          if (i >= calcParams[1] - 1) {
            trix.trixMa = trixSum / calcParams[1];
            trixSum -= result[i - (calcParams[1] - 1)].trix || 0;
          }
        }

        oldEmaClose1 = emaClose1;
        oldEmaClose2 = emaClose2;
        oldEmaClose3 = emaClose3;
        result.push(trix);
      });
      return result;
    }
  }]);

  return TripleExponentiallySmoothedAverage;
}(TechnicalIndicator);

var OnBalanceVolume = /*#__PURE__*/function (_TechnicalIndicator) {
  _inherits(OnBalanceVolume, _TechnicalIndicator);

  var _super = _createSuper(OnBalanceVolume);

  function OnBalanceVolume() {
    _classCallCheck(this, OnBalanceVolume);

    return _super.call(this, {
      name: OBV,
      calcParams: [30],
      plots: [{
        key: 'obv',
        type: 'line'
      }, {
        key: 'obvMa',
        type: 'line'
      }]
    });
  }
  /**
   * 计算obv指标
   * VA = V × [（C - L）- （H - C）]/（H - C）
   *
   * @param dataList
   * @param calcParams
   * @returns {[]}
   */


  _createClass(OnBalanceVolume, [{
    key: "calcTechnicalIndicator",
    value: function calcTechnicalIndicator(dataList, calcParams) {
      var obvSum = 0;
      var result = [];
      dataList.forEach(function (kLineData, i) {
        var obv = {};
        var close = kLineData.close;
        var high = kLineData.high;
        var hc = high - close;

        if (hc === 0) {
          obv.obv = 0;
        } else {
          obv.obv = (close - kLineData.low - hc) / hc * kLineData.volume;
        }

        obvSum += obv.obv;

        if (i >= calcParams[0] - 1) {
          obv.obvMa = obvSum / calcParams[0];
          obvSum -= result[i - (calcParams[0] - 1)].obv;
        }

        result.push(obv);
      });
      return result;
    }
  }]);

  return OnBalanceVolume;
}(TechnicalIndicator);

var VolumeRatio = /*#__PURE__*/function (_TechnicalIndicator) {
  _inherits(VolumeRatio, _TechnicalIndicator);

  var _super = _createSuper(VolumeRatio);

  function VolumeRatio() {
    _classCallCheck(this, VolumeRatio);

    return _super.call(this, {
      name: VR,
      calcParams: [24, 30],
      plots: [{
        key: 'vr',
        type: 'line'
      }, {
        key: 'vrMa',
        type: 'line'
      }]
    });
  }
  /**
   * 计算vr指标
   * VR=（UVS+1/2PVS）/（DVS+1/2PVS）
   * 24天以来凡是股价上涨那一天的成交量都称为AV，将24天内的AV总和相加后称为UVS
   * 24天以来凡是股价下跌那一天的成交量都称为BV，将24天内的BV总和相加后称为DVS
   * 24天以来凡是股价不涨不跌，则那一天的成交量都称为CV，将24天内的CV总和相加后称为PVS
   *
   * @param dataList
   * @param calcParams
   * @returns {[]}
   */


  _createClass(VolumeRatio, [{
    key: "calcTechnicalIndicator",
    value: function calcTechnicalIndicator(dataList, calcParams) {
      var uvs = 0;
      var dvs = 0;
      var pvs = 0;
      var vrSum = 0;
      var result = [];
      dataList.forEach(function (kLineData, i) {
        var vr = {};
        var close = kLineData.close;
        var open = kLineData.open;
        var volume = kLineData.volume;

        if (close > open) {
          uvs += volume;
        } else if (close < open) {
          dvs += volume;
        } else {
          pvs += volume;
        }

        if (i >= calcParams[0] - 1) {
          var halfPvs = pvs / 2;

          if (dvs + halfPvs === 0) {
            vr.vr = 0;
          } else {
            vr.vr = (uvs + halfPvs) / (dvs + halfPvs);
          }

          vrSum += vr.vr;

          if (i >= calcParams[0] + calcParams[1] - 2) {
            vr.vrMa = vrSum / calcParams[1];
            vrSum -= result[i - (calcParams[1] - 1)].vr;
          }

          var agoData = dataList[i - (calcParams[0] - 1)];
          var agoOpen = agoData.open;
          var agoClose = agoData.close;
          var agoVolume = agoData.volume;

          if (agoClose > agoOpen) {
            uvs -= agoVolume;
          } else if (agoClose < agoOpen) {
            dvs -= agoVolume;
          } else {
            pvs -= agoVolume;
          }
        }

        result.push(vr);
      });
      return result;
    }
  }]);

  return VolumeRatio;
}(TechnicalIndicator);

var WilliamsR = /*#__PURE__*/function (_TechnicalIndicator) {
  _inherits(WilliamsR, _TechnicalIndicator);

  var _super = _createSuper(WilliamsR);

  function WilliamsR() {
    _classCallCheck(this, WilliamsR);

    return _super.call(this, {
      name: WR,
      calcParams: [6, 10, 14],
      shouldCheckParamCount: false,
      plots: [{
        key: 'wr1',
        type: 'line'
      }, {
        key: 'wr2',
        type: 'line'
      }, {
        key: 'wr3',
        type: 'line'
      }]
    });
  }

  _createClass(WilliamsR, [{
    key: "regeneratePlots",
    value: function regeneratePlots(params) {
      var plots = [];
      params.forEach(function (_, i) {
        plots.push({
          key: "wr".concat(i + 1),
          type: 'line'
        });
      });
      return plots;
    }
    /**
     * 计算wr指标
     * 公式 WR(N) = 100 * [ HIGH(N)-C ] / [ HIGH(N)-LOW(N) ]
     *
     * @param dataList
     * @param calcParams
     * @returns {[]}
     */

  }, {
    key: "calcTechnicalIndicator",
    value: function calcTechnicalIndicator(dataList, calcParams) {
      var _this = this;

      var result = [];
      dataList.forEach(function (kLineData, i) {
        var wr = {};
        var close = kLineData.close;
        calcParams.forEach(function (param, index) {
          var p = param - 1;

          if (i >= p) {
            var hln = calcHnLn(dataList.slice(i - p, i + 1));
            var hn = hln.hn;
            var ln = hln.ln;
            var hnSubLn = hn - ln;
            wr[_this.plots[index].key] = hnSubLn === 0 ? 0 : (hn - close) / hnSubLn * 100;
          }
        });
        result.push(wr);
      });
      return result;
    }
  }]);

  return WilliamsR;
}(TechnicalIndicator);

var Momentum = /*#__PURE__*/function (_TechnicalIndicator) {
  _inherits(Momentum, _TechnicalIndicator);

  var _super = _createSuper(Momentum);

  function Momentum() {
    _classCallCheck(this, Momentum);

    return _super.call(this, {
      name: MTM,
      calcParams: [6, 10],
      plots: [{
        key: 'mtm',
        type: 'line'
      }, {
        key: 'mtmMa',
        type: 'line'
      }]
    });
  }
  /**
   * 计算mtm指标
   * 公式 MTM（N日）=C－CN
   *
   * @param dataList
   * @param calcParams
   * @returns {[]}
   */


  _createClass(Momentum, [{
    key: "calcTechnicalIndicator",
    value: function calcTechnicalIndicator(dataList, calcParams) {
      var mtmSum = 0;
      var result = [];
      dataList.forEach(function (kLineData, i) {
        var mtm = {};

        if (i >= calcParams[0] - 1) {
          var close = kLineData.close;
          var agoClose = dataList[i - (calcParams[0] - 1)].close;
          mtm.mtm = close - agoClose;
          mtmSum += mtm.mtm;

          if (i >= calcParams[0] + calcParams[1] - 2) {
            mtm.mtmMa = mtmSum / calcParams[1];
            mtmSum -= result[i - (calcParams[1] - 1)].mtm;
          }
        }

        result.push(mtm);
      });
      return result;
    }
  }]);

  return Momentum;
}(TechnicalIndicator);

var StopAndReverse = /*#__PURE__*/function (_TechnicalIndicator) {
  _inherits(StopAndReverse, _TechnicalIndicator);

  var _super = _createSuper(StopAndReverse);

  function StopAndReverse() {
    _classCallCheck(this, StopAndReverse);

    return _super.call(this, {
      name: SAR,
      series: TechnicalIndicatorSeries.PRICE,
      calcParams: [2, 2, 20],
      precision: 2,
      shouldOhlc: true,
      plots: [{
        key: 'sar',
        type: 'circle',
        color: function color(data, options) {
          var currentData = data.currentData;
          var kLineData = currentData.kLineData || {};
          var technicalIndicatorData = currentData.technicalIndicatorData || {};
          var halfHL = (kLineData.high + kLineData.low) / 2;

          if (technicalIndicatorData.sar < halfHL) {
            return options.circle.upColor;
          }

          return options.circle.downColor;
        }
      }]
    });
  }

  _createClass(StopAndReverse, [{
    key: "calcTechnicalIndicator",
    value: function calcTechnicalIndicator(dataList, calcParams) {
      var startAf = calcParams[0] / 100;
      var step = calcParams[1] / 100;
      var maxAf = calcParams[2] / 100; // 加速因子

      var af = startAf; // 极值

      var ep = -100; // 判断是上涨还是下跌  false：下跌

      var isIncreasing = false;
      var sar = 0;
      var result = [];
      dataList.forEach(function (kLineData, i) {
        // 上一个周期的sar
        var preSar = sar;
        var high = kLineData.high;
        var low = kLineData.low;

        if (isIncreasing) {
          // 上涨
          if (ep === -100 || ep < high) {
            // 重新初始化值
            ep = high;
            af = Math.min(af + step, maxAf);
          }

          sar = preSar + af * (ep - preSar);
          var lowMin = Math.min(dataList[Math.max(1, i) - 1].low, low);

          if (sar > kLineData.low) {
            sar = ep; // 重新初始化值

            af = startAf;
            ep = -100;
            isIncreasing = !isIncreasing;
          } else if (sar > lowMin) {
            sar = lowMin;
          }
        } else {
          if (ep === -100 || ep > low) {
            // 重新初始化值
            ep = low;
            af = Math.min(af + step, maxAf);
          }

          sar = preSar + af * (ep - preSar);
          var highMax = Math.max(dataList[Math.max(1, i) - 1].high, high);

          if (sar < kLineData.high) {
            sar = ep; // 重新初始化值

            af = 0;
            ep = -100;
            isIncreasing = !isIncreasing;
          } else if (sar < highMax) {
            sar = highMax;
          }
        }

        result.push({
          sar: sar
        });
      });
      return result;
    }
  }]);

  return StopAndReverse;
}(TechnicalIndicator);

var EaseOfMovementValue = /*#__PURE__*/function (_TechnicalIndicator) {
  _inherits(EaseOfMovementValue, _TechnicalIndicator);

  var _super = _createSuper(EaseOfMovementValue);

  function EaseOfMovementValue() {
    _classCallCheck(this, EaseOfMovementValue);

    return _super.call(this, {
      name: EMV,
      calcParams: [14, 9],
      plots: [{
        key: 'emv',
        type: 'line'
      }, {
        key: 'emvMa',
        type: 'line'
      }]
    });
  }
  /**
   * 简易波动指标
   * 公式：
   * A=（今日最高+今日最低）/2
   * B=（前日最高+前日最低）/2
   * C=今日最高-今日最低
   * EM=（A-B）*C/今日成交额
   * EMV=N日内EM的累和
   * MAEMV=EMV的M日的简单移动平均
   *
   * @param dataList
   * @param calcParams
   * @returns {[]}
   */


  _createClass(EaseOfMovementValue, [{
    key: "calcTechnicalIndicator",
    value: function calcTechnicalIndicator(dataList, calcParams) {
      var emSum = 0;
      var emvSum = 0;
      var emList = [];
      var result = [];
      dataList.forEach(function (kLineData, i) {
        var emv = {};

        if (i > 0) {
          var high = kLineData.high;
          var low = kLineData.low;
          var halfHl = (high + low) / 2;
          var preHalfHl = (dataList[i - 1].high + dataList[i - 1].low) / 2;
          var hl = high - low;
          var em = (halfHl - preHalfHl) * hl - (kLineData.turnover || 0);
          emList.push(em);
          emSum += em;

          if (i >= calcParams[0]) {
            emv.emv = emSum / calcParams[0];
            emvSum += emv.emv;

            if (i >= calcParams[0] + calcParams[1] - 1) {
              emv.emvMa = emvSum / calcParams[1];
              emvSum -= result[i - (calcParams[1] - 1)].emv;
            }

            emSum -= emList[i - calcParams[0]];
          }
        }

        result.push(emv);
      });
      return result;
    }
  }]);

  return EaseOfMovementValue;
}(TechnicalIndicator);

/**
 * 创建技术指标集合
 */

function createTechnicalIndicators() {
  var _ref;

  return _ref = {}, _defineProperty(_ref, MA, {
    structure: MovingAverage,
    series: TechnicalIndicatorSeries.PRICE,
    precision: 2,
    calcParams: [5, 10, 30, 60]
  }), _defineProperty(_ref, EMA, {
    structure: ExponentialMovingAverage,
    series: TechnicalIndicatorSeries.PRICE,
    precision: 2,
    calcParams: [6, 12, 20]
  }), _defineProperty(_ref, VOL, {
    structure: Volume,
    series: TechnicalIndicatorSeries.VOLUME,
    precision: 0,
    calcParams: [5, 10, 20]
  }), _defineProperty(_ref, MACD, {
    structure: MovingAverageConvergenceDivergence,
    precision: 4,
    calcParams: [12, 26, 9]
  }), _defineProperty(_ref, BOLL, {
    structure: BollingerBands,
    series: TechnicalIndicatorSeries.PRICE,
    precision: 2,
    calcParams: [20]
  }), _defineProperty(_ref, KDJ, {
    structure: StockIndicatorKDJ,
    precision: 4,
    calcParams: [9, 3, 3]
  }), _defineProperty(_ref, RSI, {
    structure: RelativeStrengthIndex,
    precision: 4,
    calcParams: [6, 12, 24]
  }), _defineProperty(_ref, BIAS, {
    structure: Bias,
    precision: 4,
    calcParams: [6, 12, 24]
  }), _defineProperty(_ref, BRAR, {
    structure: Brar,
    precision: 4,
    calcParams: [26]
  }), _defineProperty(_ref, CCI, {
    structure: CommodityChannelIndex,
    precision: 4,
    calcParams: [13]
  }), _defineProperty(_ref, DMI, {
    structure: DirectionalMovementIndex,
    precision: 4,
    calcParams: [14, 6]
  }), _defineProperty(_ref, CR, {
    structure: CurrentRatio,
    precision: 4,
    calcParams: [26, 10, 20, 40, 60]
  }), _defineProperty(_ref, PSY, {
    structure: PsychologicalLine,
    precision: 4,
    calcParams: [12, 6]
  }), _defineProperty(_ref, DMA, {
    structure: DifferentOfMovingAverage,
    precision: 4,
    calcParams: [10, 50, 10]
  }), _defineProperty(_ref, TRIX, {
    structure: TripleExponentiallySmoothedAverage,
    precision: 4,
    calcParams: [12, 20]
  }), _defineProperty(_ref, OBV, {
    structure: OnBalanceVolume,
    precision: 4,
    calcParams: [30]
  }), _defineProperty(_ref, VR, {
    structure: VolumeRatio,
    precision: 4,
    calcParams: [24, 30]
  }), _defineProperty(_ref, WR, {
    structure: WilliamsR,
    precision: 4,
    calcParams: [6, 10, 14]
  }), _defineProperty(_ref, MTM, {
    structure: Momentum,
    precision: 4,
    calcParams: [6, 10]
  }), _defineProperty(_ref, EMV, {
    structure: EaseOfMovementValue,
    precision: 4,
    calcParams: [14, 9]
  }), _defineProperty(_ref, SAR, {
    structure: StopAndReverse,
    series: TechnicalIndicatorSeries.PRICE,
    precision: 2,
    calcParams: [2, 2, 20]
  }), _ref;
}
/**
 * 创建一个新的技术指标
 * @param name
 * @param series
 * @param calcParams
 * @param plots
 * @param precision
 * @param shouldCheckParamCount
 * @param shouldOhlc
 * @param shouldFormatBigNumber
 * @param baseValue
 * @param minValue
 * @param maxValue
 * @param calcTechnicalIndicator
 * @param regeneratePlots
 * @returns {null|{precision: (*|number), calcParams: (*|[]), structure: NewTechnicalIndicator}}
 */

function createNewTechnicalIndicator(_ref2) {
  var name = _ref2.name,
      series = _ref2.series,
      calcParams = _ref2.calcParams,
      plots = _ref2.plots,
      precision = _ref2.precision,
      shouldCheckParamCount = _ref2.shouldCheckParamCount,
      shouldOhlc = _ref2.shouldOhlc,
      shouldFormatBigNumber = _ref2.shouldFormatBigNumber,
      baseValue = _ref2.baseValue,
      minValue = _ref2.minValue,
      maxValue = _ref2.maxValue,
      calcTechnicalIndicator = _ref2.calcTechnicalIndicator,
      regeneratePlots = _ref2.regeneratePlots;

  if (!name || !isFunction(calcTechnicalIndicator)) {
    {
      console.warn('The required attribute "name" and method "calcTechnicalIndicator" are missing, and new technical indicator cannot be generated!!!');
    }

    return null;
  }

  var NewTechnicalIndicator = /*#__PURE__*/function (_TechnicalIndicator) {
    _inherits(NewTechnicalIndicator, _TechnicalIndicator);

    var _super = _createSuper(NewTechnicalIndicator);

    function NewTechnicalIndicator() {
      _classCallCheck(this, NewTechnicalIndicator);

      return _super.call(this, {
        name: name,
        series: series,
        calcParams: calcParams,
        plots: plots,
        precision: precision,
        shouldCheckParamCount: shouldCheckParamCount,
        shouldOhlc: shouldOhlc,
        shouldFormatBigNumber: shouldFormatBigNumber,
        baseValue: baseValue,
        minValue: minValue,
        maxValue: maxValue
      });
    }

    return NewTechnicalIndicator;
  }(TechnicalIndicator);

  NewTechnicalIndicator.prototype.calcTechnicalIndicator = calcTechnicalIndicator;

  if (regeneratePlots) {
    NewTechnicalIndicator.prototype.regeneratePlots = regeneratePlots;
  }

  return {
    structure: NewTechnicalIndicator,
    series: series || TechnicalIndicatorSeries.NORMAL,
    precision: isValid(precision) && isNumber(precision) && precision >= 0 ? precision : series === TechnicalIndicatorSeries.PRICE ? 2 : series === TechnicalIndicatorSeries.VOLUME ? 0 : 4,
    calcParams: isArray(calcParams) ? calcParams : []
  };
}
/**
 * 获取技术指标信息
 * @param technicalIndicatorData
 * @param technicalIndicator
 * @param yAxis
 * @returns {{values: [], name: string, labels: []}}
 */

function getTechnicalIndicatorInfo() {
  var technicalIndicatorData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var technicalIndicator = arguments.length > 1 ? arguments[1] : undefined;
  var yAxis = arguments.length > 2 ? arguments[2] : undefined;
  var calcParams = technicalIndicator.calcParams;
  var plots = technicalIndicator.plots;
  var precision = technicalIndicator.precision;
  var shouldFormatBigNumber = technicalIndicator.shouldFormatBigNumber;
  var labels = [];
  var values = [];
  var name = '';

  if (plots.length > 0) {
    name = technicalIndicator.name;
  }

  if (calcParams.length > 0) {
    name = "".concat(name, "(").concat(calcParams.join(','), ")");
  }

  plots.forEach(function (plot) {
    labels.push(plot.key.toUpperCase());
    var value = technicalIndicatorData[plot.key];
    var y;

    if (isValid(value)) {
      y = yAxis.convertToPixel(value);
      value = formatPrecision(value, precision);

      if (shouldFormatBigNumber) {
        value = formatBigNumber(value);
      }
    }

    values.push({
      value: value,
      y: y
    });
  });
  return {
    labels: labels,
    values: values,
    name: name
  };
}

var InvalidateLevel = {
  NONE: 0,
  GRAPHIC_MARK: 1,
  FLOAT_LAYER: 2,
  MAIN: 3,
  FULL: 4
};
var GraphicMarkType = {
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
var MAX_DATA_SPACE = 30;
var MIN_DATA_SPACE = 3;

var ChartData = /*#__PURE__*/function () {
  function ChartData(styleOptions, invalidateHandler) {
    _classCallCheck(this, ChartData);

    // 刷新持有者
    this._invalidateHandler = invalidateHandler; // 样式配置

    this._styleOptions = clone(defaultStyleOptions);
    merge(this._styleOptions, styleOptions); // 所有技术指标类集合

    this._technicalIndicators = createTechnicalIndicators(); // 价格精度

    this._pricePrecision = 2; // 数量精度

    this._volumePrecision = 0;
    this._dateTimeFormat = new Intl.DateTimeFormat('en', {
      hour12: false,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }); // 数据源

    this._dataList = []; // 是否在加载中

    this._loading = true; // 加载更多回调

    this._loadMoreCallback = null; // 还有更多

    this._more = true; // 可见区域数据占用的空间

    this._totalDataSpace = 0; // 每一条数据的空间

    this._dataSpace = 6; // bar的空间

    this._barSpace = this._calcBarSpace(); // 向右偏移的空间

    this._offsetRightSpace = 50; // 向右偏移的数量

    this._offsetRightBarCount = this._offsetRightSpace / this._dataSpace; // 左边最小可见bar的个数

    this._leftMinVisibleBarCount = 2; // 右边最小可见bar的个数

    this._rightMinVisibleBarCount = 2; // 开始绘制的索引

    this._from = 0; // 结束的索引

    this._to = 0; // 十字光标信息

    this._crossHair = {}; // 用来记录开始拖拽时向右偏移的数量

    this._preOffsetRightBarCount = 0; // 当前绘制的标记图形的类型

    this._graphicMarkType = GraphicMarkType.NONE; // 标记图形点

    this._graphicMarkPoint = null; // 拖拽标记图形标记

    this._dragGraphicMarkFlag = false; // 绘图标记数据

    this._graphicMarkDatas = {
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
  /**
   * 加载更多持有者
   * @private
   */


  _createClass(ChartData, [{
    key: "_loadMoreHandler",
    value: function _loadMoreHandler() {
      // 有更多并且没有在加载则去加载更多
      if (this._more && !this._loading && this._loadMoreCallback && isFunction(this._loadMoreCallback)) {
        this._loading = true;

        this._loadMoreCallback(formatValue(this._dataList[0], 'timestamp'));
      }
    }
    /**
     * 计算一条柱子的空间
     * @returns {number}
     * @private
     */

  }, {
    key: "_calcBarSpace",
    value: function _calcBarSpace() {
      var rateBarSpace = Math.floor(this._dataSpace * 0.8);
      var floorBarSpace = Math.floor(this._dataSpace);
      var optimalBarSpace = Math.min(rateBarSpace, floorBarSpace - 1);
      return Math.max(1, optimalBarSpace);
    }
    /**
     * 内部用来设置一条数据的空间
     * @param dataSpace
     * @returns {boolean}
     * @private
     */

  }, {
    key: "_innerSetDataSpace",
    value: function _innerSetDataSpace(dataSpace) {
      if (!dataSpace || dataSpace < MIN_DATA_SPACE || dataSpace > MAX_DATA_SPACE || this._dataSpace === dataSpace) {
        return false;
      }

      this._dataSpace = dataSpace;
      this._barSpace = this._calcBarSpace();
      return true;
    }
    /**
     * 获取样式配置
     */

  }, {
    key: "styleOptions",
    value: function styleOptions() {
      return this._styleOptions;
    }
    /**
     * 设置样式配置
     * @param options
     */

  }, {
    key: "applyStyleOptions",
    value: function applyStyleOptions(options) {
      merge(this._styleOptions, options);
    }
    /**
     * 获取技术指标计算参数结合
     * @returns {function(Array<string>, string, string): Promise}
     */

  }, {
    key: "technicalIndicatorCalcParams",
    value: function technicalIndicatorCalcParams() {
      var calcParams = {};

      for (var name in this._technicalIndicators) {
        calcParams[name] = clone(this._technicalIndicators[name].calcParams);
      }

      return calcParams;
    }
    /**
     * 根据指标类型获取指标类
     * @param technicalIndicatorType
     */

  }, {
    key: "technicalIndicator",
    value: function technicalIndicator(technicalIndicatorType) {
      return this._technicalIndicators[technicalIndicatorType] || {};
    }
    /**
     * 价格精度
     * @returns {number}
     */

  }, {
    key: "pricePrecision",
    value: function pricePrecision() {
      return this._pricePrecision;
    }
    /**
     * 数量精度
     * @returns {number}
     */

  }, {
    key: "volumePrecision",
    value: function volumePrecision() {
      return this._volumePrecision;
    }
    /**
     * 获取时间格式化
     * @returns {Intl.DateTimeFormat | Intl.DateTimeFormat}
     */

  }, {
    key: "dateTimeFormat",
    value: function dateTimeFormat() {
      return this._dateTimeFormat;
    }
    /**
     * 设置时区
     * @param timezone
     */

  }, {
    key: "setTimezone",
    value: function setTimezone(timezone) {
      var dateTimeFormat;

      try {
        dateTimeFormat = new Intl.DateTimeFormat('en', {
          hour12: false,
          timeZone: timezone,
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric'
        });
      } catch (e) {
        {
          console.warn(e.message);
        }
      }

      if (dateTimeFormat) {
        this._dateTimeFormat = dateTimeFormat;
      }
    }
    /**
     * 获取时区
     * @returns {null}
     */

  }, {
    key: "timezone",
    value: function timezone() {
      return this._dateTimeFormat.resolvedOptions().timeZone;
    }
    /**
     * 加载精度
     * @param pricePrecision
     * @param volumePrecision
     */

  }, {
    key: "applyPrecision",
    value: function applyPrecision(pricePrecision, volumePrecision) {
      var pricePrecisionValid = isValid(pricePrecision) && isNumber(pricePrecision) && pricePrecision >= 0;
      var volumePrecisionValid = isValid(volumePrecision) && isNumber(volumePrecision) && volumePrecision >= 0;

      if (pricePrecisionValid) {
        this._pricePrecision = pricePrecision;
      }

      if (volumePrecisionValid) {
        this._volumePrecision = volumePrecision;
      }

      if (pricePrecisionValid || volumePrecisionValid) {
        for (var name in this._technicalIndicators) {
          var series = this._technicalIndicators[name].series;

          switch (series) {
            case TechnicalIndicatorSeries.PRICE:
              {
                this._technicalIndicators[name].precision = pricePrecision;
                break;
              }

            case TechnicalIndicatorSeries.VOLUME:
              {
                this._technicalIndicators[name].precision = volumePrecision;
                break;
              }
          }
        }
      }
    }
    /**
     * 加载技术指标精度
     * @param precision
     * @param technicalIndicatorType
     */

  }, {
    key: "applyTechnicalIndicatorPrecision",
    value: function applyTechnicalIndicatorPrecision(precision, technicalIndicatorType) {
      var technicalIndicator = this.technicalIndicator(technicalIndicatorType);

      if (technicalIndicator) {
        technicalIndicator.precision = precision;
      } else {
        for (var name in this._technicalIndicators) {
          this._technicalIndicators[name].precision = precision;
        }
      }
    }
    /**
     * 获取数据源
     * @returns {[]|*[]}
     */

  }, {
    key: "dataList",
    value: function dataList() {
      return this._dataList;
    }
    /**
     * 清空数据源
     */

  }, {
    key: "clearDataList",
    value: function clearDataList() {
      this._more = true;
      this._loading = true;
      this._dataList = [];
      this._from = 0;
      this._to = 0;
    }
    /**
     * 添加数据
     * @param data
     * @param pos
     * @param more
     */

  }, {
    key: "addData",
    value: function addData(data, pos, more) {
      if (isObject(data)) {
        if (isArray(data)) {
          this._loading = false;
          this._more = isBoolean(more) ? more : true;
          var isFirstAdd = this._dataList.length === 0;
          this._dataList = data.concat(this._dataList);

          if (isFirstAdd) {
            this.setOffsetRightSpace(this._offsetRightSpace);
          } else {
            this.adjustOffsetBarCount();
          }
        } else {
          var dataSize = this._dataList.length;

          if (pos >= dataSize) {
            this._dataList.push(data);

            if (this._offsetRightBarCount < 0) {
              this._offsetRightBarCount -= 1;
            }

            this.adjustOffsetBarCount();
          } else {
            this._dataList[pos] = data;
          }
        }
      }
    }
    /**
     * 获取一条数据的空间
     * @returns {number}
     */

  }, {
    key: "dataSpace",
    value: function dataSpace() {
      return this._dataSpace;
    }
    /**
     * 获取绘制一条数据的空间（不包括bar之间的间隙）
     * @returns {*}
     */

  }, {
    key: "barSpace",
    value: function barSpace() {
      return this._barSpace;
    }
    /**
     * 获取向右偏移的bar的数量
     * @returns {number}
     */

  }, {
    key: "offsetRightBarCount",
    value: function offsetRightBarCount() {
      return this._offsetRightBarCount;
    }
    /**
     * 设置一条数据的空间
     * @param dataSpace
     */

  }, {
    key: "setDataSpace",
    value: function setDataSpace(dataSpace) {
      if (this._innerSetDataSpace(dataSpace)) {
        this.adjustOffsetBarCount();

        this._invalidateHandler();
      }
    }
    /**
     * 设置可见区域数据占用的总空间
     * @param totalSpace
     */

  }, {
    key: "setTotalDataSpace",
    value: function setTotalDataSpace(totalSpace) {
      if (this._totalDataSpace === totalSpace) {
        return;
      }

      this._totalDataSpace = totalSpace;
      this.adjustOffsetBarCount();
    }
    /**
     * 设置右边可以偏移的空间
     * @param space
     */

  }, {
    key: "setOffsetRightSpace",
    value: function setOffsetRightSpace(space) {
      this._offsetRightSpace = space;
      this._offsetRightBarCount = space / this._dataSpace;
      this.adjustOffsetBarCount();
    }
    /**
     * 设置左边可见的最小bar数量
     * @param barCount
     */

  }, {
    key: "setLeftMinVisibleBarCount",
    value: function setLeftMinVisibleBarCount(barCount) {
      if (isNumber(barCount) && barCount > 0) {
        this._leftMinVisibleBarCount = Math.ceil(barCount);
      }
    }
    /**
     * 设置右边可见的最小bar数量
     * @param barCount
     */

  }, {
    key: "setRightMinVisibleBarCount",
    value: function setRightMinVisibleBarCount(barCount) {
      if (isNumber(barCount) && barCount > 0) {
        this._rightMinVisibleBarCount = Math.ceil(barCount);
      }
    }
    /**
     * 获取数据绘制起点
     * @returns {number}
     */

  }, {
    key: "from",
    value: function from() {
      return this._from;
    }
    /**
     * 获取数据绘制终点
     * @returns {number}
     */

  }, {
    key: "to",
    value: function to() {
      return this._to;
    }
    /**
     * 获取十字光标信息
     * @returns {{}}
     */

  }, {
    key: "crossHair",
    value: function crossHair() {
      return this._crossHair;
    }
    /**
     * 设置十字光标点所在的pane的标识
     * @param point
     * @param paneTag
     */

  }, {
    key: "setCrossHairPointPaneTag",
    value: function setCrossHairPointPaneTag(point, paneTag) {
      var crossHair = {};

      if (point) {
        crossHair.x = point.x;
        crossHair.y = point.y;
        crossHair.paneTag = this._crossHair.paneTag;
      }

      if (paneTag !== undefined) {
        crossHair.paneTag = paneTag;
        this._crossHair = crossHair;

        this._invalidateHandler(InvalidateLevel.FLOAT_LAYER);
      }
    }
    /**
     * 开始滚动
     */

  }, {
    key: "startScroll",
    value: function startScroll() {
      this._preOffsetRightBarCount = this._offsetRightBarCount;
    }
    /**
     * 滚动
     * @param distance
     */

  }, {
    key: "scroll",
    value: function scroll(distance) {
      var distanceBarCount = distance / this._dataSpace;
      this._offsetRightBarCount = this._preOffsetRightBarCount - distanceBarCount;
      this.adjustOffsetBarCount();

      this._invalidateHandler();
    }
    /**
     * x转换成浮点数的位置
     * @param x
     * @returns {number}
     */

  }, {
    key: "coordinateToFloatIndex",
    value: function coordinateToFloatIndex(x) {
      var dataSize = this._dataList.length;
      var deltaFromRight = (this._totalDataSpace - x) / this._dataSpace;
      var index = dataSize + this._offsetRightBarCount - deltaFromRight;
      return Math.round(index * 1000000) / 1000000;
    }
    /**
     * 缩放
     * @param scale
     * @param point
     */

  }, {
    key: "zoom",
    value: function zoom(scale, point) {
      if (!point || isValid(point.x)) {
        point = {
          x: isValid(this._crossHair.x) ? this._crossHair.x : this._totalDataSpace / 2
        };
      }

      var floatIndexAtZoomPoint = this.coordinateToFloatIndex(point.x);
      var dataSpace = this._dataSpace + scale * (this._dataSpace / 10);

      if (this._innerSetDataSpace(dataSpace)) {
        this._offsetRightBarCount += floatIndexAtZoomPoint - this.coordinateToFloatIndex(point.x);
        this.adjustOffsetBarCount();

        this._invalidateHandler();
      }
    }
    /**
     * 调整向右偏移bar的个数
     * @private
     */

  }, {
    key: "adjustOffsetBarCount",
    value: function adjustOffsetBarCount() {
      var dataSize = this._dataList.length;
      var barLength = this._totalDataSpace / this._dataSpace;
      var difBarCount = 1 - this._barSpace / 2 / this._dataSpace;
      var maxRightOffsetBarCount = barLength - Math.min(this._leftMinVisibleBarCount, dataSize) + difBarCount;

      if (this._offsetRightBarCount > maxRightOffsetBarCount) {
        this._offsetRightBarCount = maxRightOffsetBarCount;
      }

      var minRightOffsetBarCount = -dataSize + 1 + Math.min(this._rightMinVisibleBarCount, dataSize) - difBarCount;

      if (this._offsetRightBarCount < minRightOffsetBarCount) {
        this._offsetRightBarCount = minRightOffsetBarCount;
      }

      this._to = Math.round(this._offsetRightBarCount + dataSize);
      this._from = Math.floor(this._to - barLength) - 1;

      if (this._to > dataSize) {
        this._to = dataSize;
      }

      if (this._from < 0) {
        this._from = 0;
      }

      if (this._from === 0) {
        this._loadMoreHandler();
      }
    }
    /**
     * 获取图形标记类型
     * @returns {string}
     */

  }, {
    key: "graphicMarkType",
    value: function graphicMarkType() {
      return this._graphicMarkType;
    }
    /**
     * 设置图形标记类型
     * @param graphicMarkType
     */

  }, {
    key: "setGraphicMarkType",
    value: function setGraphicMarkType(graphicMarkType) {
      this._graphicMarkType = graphicMarkType;
    }
    /**
     * 获取图形标记拖拽标记
     * @returns {boolean}
     */

  }, {
    key: "dragGraphicMarkFlag",
    value: function dragGraphicMarkFlag() {
      return this._dragGraphicMarkFlag;
    }
    /**
     * 设置图形标记拖拽标记
     * @param flag
     */

  }, {
    key: "setDragGraphicMarkFlag",
    value: function setDragGraphicMarkFlag(flag) {
      this._dragGraphicMarkFlag = flag;
    }
    /**
     * 获取图形标记开始的点
     * @returns {null}
     */

  }, {
    key: "graphicMarkPoint",
    value: function graphicMarkPoint() {
      return this._graphicMarkPoint;
    }
    /**
     * 设置图形标记开始的点
     * @param point
     */

  }, {
    key: "setGraphicMarkPoint",
    value: function setGraphicMarkPoint(point) {
      this._graphicMarkPoint = point;
    }
    /**
     * 获取图形标记的数据
     * @returns {{straightLine: [], verticalRayLine: [], rayLine: [], segmentLine: [], horizontalRayLine: [], horizontalSegmentLine: [], fibonacciLine: [], verticalStraightLine: [], priceChannelLine: [], priceLine: [], verticalSegmentLine: [], horizontalStraightLine: [], parallelStraightLine: []}}
     */

  }, {
    key: "graphicMarkData",
    value: function graphicMarkData() {
      return clone(this._graphicMarkDatas);
    }
    /**
     * 设置图形标记的数据
     * @param datas
     */

  }, {
    key: "setGraphicMarkData",
    value: function setGraphicMarkData(datas) {
      var shouldInvalidate = this.shouldInvalidateGraphicMark();
      this._graphicMarkDatas = clone(datas);

      if (shouldInvalidate) {
        this._invalidateHandler(InvalidateLevel.GRAPHIC_MARK);
      } else {
        if (this.shouldInvalidateGraphicMark()) {
          this._invalidateHandler(InvalidateLevel.GRAPHIC_MARK);
        }
      }
    }
    /**
     * 设置加载更多
     * @param callback
     */

  }, {
    key: "loadMore",
    value: function loadMore(callback) {
      this._loadMoreCallback = callback;
    }
    /**
     * 是否需要刷新图形标记层
     * @returns {boolean}
     */

  }, {
    key: "shouldInvalidateGraphicMark",
    value: function shouldInvalidateGraphicMark() {
      if (this._graphicMarkType !== GraphicMarkType.NONE) {
        return true;
      }

      for (var graphicMarkKey in this._graphicMarkDatas) {
        if (this._graphicMarkDatas[graphicMarkKey].length > 0) {
          return true;
        }
      }

      return false;
    }
    /**
     * 添加一个自定义指标
     * @param technicalIndicatorInfo
     */

  }, {
    key: "addCustomTechnicalIndicator",
    value: function addCustomTechnicalIndicator(technicalIndicatorInfo) {
      var info = createNewTechnicalIndicator(technicalIndicatorInfo || {});

      if (info) {
        // 将生成的新的指标类放入集合
        this._technicalIndicators[technicalIndicatorInfo.name] = info;
      }
    }
    /**
     * 计算指标
     * @param pane
     */

  }, {
    key: "calcTechnicalIndicator",
    value: function calcTechnicalIndicator(pane) {
      var technicalIndicator = pane.technicalIndicator();

      if (technicalIndicator) {
        var _ref = this._technicalIndicators[technicalIndicator.name] || {},
            calcParams = _ref.calcParams,
            precision = _ref.precision;

        technicalIndicator.setPrecision(isValid(precision) ? precision : this._pricePrecision);
        technicalIndicator.setCalcParams(calcParams);
        technicalIndicator.result = technicalIndicator.calcTechnicalIndicator(this._dataList, technicalIndicator.calcParams) || [];
        pane.computeAxis();
      }
    }
  }]);

  return ChartData;
}();

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

/**
 * 获取屏幕比
 * @param canvas
 * @returns {number}
 */
function getPixelRatio(canvas) {
  return canvas.ownerDocument && canvas.ownerDocument.defaultView && canvas.ownerDocument.defaultView.devicePixelRatio || 1;
}
/**
 * 测量文字的宽度
 * @param ctx
 * @param text
 * @returns {number}
 */

function calcTextWidth(ctx, text) {
  return Math.round(ctx.measureText(text).width);
}
/**
 * 获取字体
 * @param fontSize
 * @param fontFamily
 * @param fontWeight
 * @returns {string}
 */

function getFont() {
  var fontSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 12;
  var fontWeight = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'normal';
  var fontFamily = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'Helvetica Neue';
  return "".concat(fontWeight, " ").concat(fontSize, "px ").concat(fontFamily);
}
/**
 * 绘制水平直线
 * @param ctx
 * @param y
 * @param left
 * @param right
 */

function drawHorizontalLine(ctx, y, left, right) {
  ctx.beginPath();
  var correction = ctx.lineWidth % 2 ? 0.5 : 0;
  ctx.moveTo(left, y + correction);
  ctx.lineTo(right, y + correction);
  ctx.stroke();
  ctx.closePath();
}
/**
 * 绘制垂直直线
 * @param ctx
 * @param x
 * @param top
 * @param bottom
 */

function drawVerticalLine(ctx, x, top, bottom) {
  ctx.beginPath();
  var correction = ctx.lineWidth % 2 ? 0.5 : 0;
  ctx.moveTo(x + correction, top);
  ctx.lineTo(x + correction, bottom);
  ctx.stroke();
  ctx.closePath();
}
/**
 * 绘制线
 * @param ctx
 * @param drawFuc
 */

function drawLine(ctx, drawFuc) {
  ctx.save();

  if (ctx.lineWidth % 2) {
    ctx.translate(0.5, 0.5);
  }

  drawFuc();
  ctx.restore();
}

var Pane = /*#__PURE__*/function () {
  function Pane(props) {
    _classCallCheck(this, Pane);

    this._height = -1;
    this._container = props.container;
    this._chartData = props.chartData;

    this._initBefore(props);

    this._initElement();

    this._mainWidget = this._createMainWidget(this._element, props);
    this._yAxisWidget = this._createYAxisWidget(this._element, props);
  }

  _createClass(Pane, [{
    key: "_initBefore",
    value: function _initBefore(props) {}
  }, {
    key: "_initElement",
    value: function _initElement() {
      this._element = document.createElement('div');
      this._element.style.margin = '0';
      this._element.style.padding = '0';
      this._element.style.position = 'relative';
      this._element.style.overflow = 'hidden';
      this._element.style.width = '100%';
      var lastElement = this._container.lastChild;

      if (lastElement) {
        this._container.insertBefore(this._element, lastElement);
      } else {
        this._container.appendChild(this._element);
      }
    }
    /**
     * 创建主组件
     * @param container
     * @param props
     * @private
     */

  }, {
    key: "_createMainWidget",
    value: function _createMainWidget(container, props) {}
    /**
     * 创建y轴组件
     * @param container
     * @param props
     * @private
     */

  }, {
    key: "_createYAxisWidget",
    value: function _createYAxisWidget(container, props) {}
    /**
     * 计算轴
     * @private
     */

  }, {
    key: "computeAxis",
    value: function computeAxis() {}
    /**
     * 获取宽度
     * @returns {number}
     */

  }, {
    key: "width",
    value: function width() {
      return this._element.offsetWidth;
    }
  }, {
    key: "setWidth",
    value: function setWidth(mainWidgetWidth, yAxisWidgetWidth) {
      this._mainWidget.setWidth(mainWidgetWidth);

      this._yAxisWidget && this._yAxisWidget.setWidth(yAxisWidgetWidth);
    }
    /**
     * 获取高度
     */

  }, {
    key: "height",
    value: function height() {
      return this._height;
    }
    /**
     * 设置临时高度
     * @param height
     */

  }, {
    key: "setHeight",
    value: function setHeight(height) {
      this._height = height;

      this._mainWidget.setHeight(height);

      this._yAxisWidget && this._yAxisWidget.setHeight(height);
    }
  }, {
    key: "setOffsetLeft",
    value: function setOffsetLeft(mainWidgetOffsetLeft, yAxisWidgetOffsetLeft) {
      this._mainWidget.setOffsetLeft(mainWidgetOffsetLeft);

      this._yAxisWidget && this._yAxisWidget.setOffsetLeft(yAxisWidgetOffsetLeft);
    }
  }, {
    key: "layout",
    value: function layout() {
      if (this._element.offsetHeight !== this._height) {
        this._element.style.height = "".concat(this._height, "px");
      }

      this._mainWidget.layout();

      this._yAxisWidget && this._yAxisWidget.layout();
    }
    /**
     * 刷新
     * @param level
     */

  }, {
    key: "invalidate",
    value: function invalidate(level) {
      this._yAxisWidget && this._yAxisWidget.invalidate(level);

      this._mainWidget.invalidate(level);
    }
  }, {
    key: "getImage",
    value: function getImage(includeFloatLayer, includeGraphicMark) {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      var pixelRatio = getPixelRatio(canvas);
      var width = this._element.offsetWidth;
      var height = this._element.offsetHeight;
      canvas.style.width = "".concat(width, "px");
      canvas.style.height = "".concat(height, "px");
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      ctx.scale(pixelRatio, pixelRatio);

      var mainWidgetElement = this._mainWidget.getElement();

      var mainWidgetWidth = mainWidgetElement.offsetWidth;
      var mainWidgetHeight = mainWidgetElement.offsetHeight;
      var mainWidgetOffsetLeft = parseInt(mainWidgetElement.style.left, 10);
      ctx.drawImage(this._mainWidget.getImage(includeFloatLayer, includeGraphicMark), mainWidgetOffsetLeft, 0, mainWidgetWidth, mainWidgetHeight);

      if (this._yAxisWidget) {
        var yAxisWidgetElement = this._yAxisWidget.getElement();

        var yAxisWidgetWidth = yAxisWidgetElement.offsetWidth;
        var yAxisWidgetHeight = yAxisWidgetElement.offsetHeight;
        var yAxisWidgetOffsetLeft = parseInt(yAxisWidgetElement.style.left, 10);
        ctx.drawImage(this._yAxisWidget.getImage(includeFloatLayer), yAxisWidgetOffsetLeft, 0, yAxisWidgetWidth, yAxisWidgetHeight);
      }

      return canvas;
    }
    /**
     * 销毁
     */

  }, {
    key: "destroy",
    value: function destroy() {
      this._container.removeChild(this._element);
    }
  }]);

  return Pane;
}();

var Widget = /*#__PURE__*/function () {
  function Widget(props) {
    _classCallCheck(this, Widget);

    this._width = 0;
    this._height = 0;

    this._initElement(props.container);

    this._mainView = this._createMainView(this._element, props);
    this._expandView = this._createExpandView(this._element, props);
    this._floatLayerView = this._createFloatLayerView(this._element, props);
  }
  /**
   * 初始化element
   * @param container
   * @private
   */


  _createClass(Widget, [{
    key: "_initElement",
    value: function _initElement(container) {
      this._element = document.createElement('div');
      this._element.style.top = '0';
      this._element.style.margin = '0';
      this._element.style.padding = '0';
      this._element.style.position = 'absolute';
      this._element.style.overflow = 'hidden';
      container.appendChild(this._element);
    }
    /**
     * 创建主view
     * @param container
     * @param props
     * @private
     */

  }, {
    key: "_createMainView",
    value: function _createMainView(container, props) {}
    /**
     * 创建拓展的view
     * @param container
     * @param props
     * @private
     */

  }, {
    key: "_createExpandView",
    value: function _createExpandView(container, props) {}
    /**
     * 创建浮层view
     * @param container
     * @param props
     * @private
     */

  }, {
    key: "_createFloatLayerView",
    value: function _createFloatLayerView(container, props) {}
  }, {
    key: "getElement",
    value: function getElement() {
      return this._element;
    }
  }, {
    key: "setWidth",
    value: function setWidth(width) {
      this._width = width;

      this._mainView.setWidth(width);

      this._floatLayerView.setWidth(width);

      this._expandView && this._expandView.setWidth(width);
    }
  }, {
    key: "setHeight",
    value: function setHeight(height) {
      this._height = height;

      this._mainView.setHeight(height);

      this._floatLayerView.setHeight(height);

      this._expandView && this._expandView.setHeight(height);
    }
  }, {
    key: "setOffsetLeft",
    value: function setOffsetLeft(offsetLeft) {
      this._element.style.left = "".concat(offsetLeft, "px");
    }
  }, {
    key: "layout",
    value: function layout() {
      if (this._element.offsetWidth !== this._width) {
        this._element.style.width = "".concat(this._width, "px");
      }

      if (this._element.offsetHeight !== this._height) {
        this._element.style.height = "".concat(this._height, "px");
      }

      this._mainView.layout();

      this._floatLayerView.layout();

      this._expandView && this._expandView.layout();
    }
    /**
     * 更新
     * @param level
     */

  }, {
    key: "invalidate",
    value: function invalidate(level) {
      switch (level) {
        case InvalidateLevel.GRAPHIC_MARK:
          {
            this._expandView && this._expandView.flush();
            break;
          }

        case InvalidateLevel.FLOAT_LAYER:
          {
            this._floatLayerView.flush();

            break;
          }

        case InvalidateLevel.MAIN:
        case InvalidateLevel.FULL:
          {
            this._mainView.flush();

            this._floatLayerView.flush();

            this._expandView && this._expandView.flush();
            break;
          }
      }
    }
    /**
     * 将widget转换成图片
     * @param includeFloatLayer
     * @param includeGraphicMark
     * @returns {HTMLCanvasElement}
     */

  }, {
    key: "getImage",
    value: function getImage(includeFloatLayer, includeGraphicMark) {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      var pixelRatio = getPixelRatio(canvas);
      canvas.style.width = "".concat(this._width, "px");
      canvas.style.height = "".concat(this._height, "px");
      canvas.width = this._width * pixelRatio;
      canvas.height = this._height * pixelRatio;
      ctx.scale(pixelRatio, pixelRatio);
      ctx.drawImage(this._mainView.getImage(), 0, 0, this._width, this._height);

      if (includeGraphicMark && this._expandView) {
        ctx.drawImage(this._expandView.getImage(), 0, 0, this._width, this._height);
      }

      if (includeFloatLayer) {
        ctx.drawImage(this._floatLayerView.getImage(), 0, 0, this._width, this._height);
      }

      return canvas;
    }
  }]);

  return Widget;
}();

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
 * 绘制类型
 * @type {{BAR: string, LINE: string, CIRCLE: string}}
 */

var PlotType = {
  LINE: 'line',
  BAR: 'bar',
  CIRCLE: 'circle'
};

var View = /*#__PURE__*/function () {
  function View(container, chartData) {
    _classCallCheck(this, View);

    this._chartData = chartData;

    this._initCanvas(container);
  }
  /**
   * 初始化画布
   * @param container
   * @private
   */


  _createClass(View, [{
    key: "_initCanvas",
    value: function _initCanvas(container) {
      this._canvas = document.createElement('canvas');
      this._canvas.style.position = 'absolute';
      this._canvas.style.top = '0';
      this._canvas.style.left = '0';
      this._canvas.style.zIndex = '2';
      this._ctx = this._canvas.getContext('2d');
      container.appendChild(this._canvas);
    }
    /**
     * 重新绘制
     * @param extendFun
     * @private
     */

  }, {
    key: "_redraw",
    value: function _redraw(extendFun) {
      this._ctx.clearRect(0, 0, this._canvas.offsetWidth, this._canvas.offsetHeight);

      if (extendFun) {
        extendFun();
      }

      this._draw();
    }
    /**
     * 绘制
     */

  }, {
    key: "_draw",
    value: function _draw() {}
  }, {
    key: "setWidth",
    value: function setWidth(width) {
      this._width = width;
    }
  }, {
    key: "setHeight",
    value: function setHeight(height) {
      this._height = height;
    }
  }, {
    key: "layout",
    value: function layout() {
      var _this = this;

      if (this._height !== this._canvas.offsetHeight || this._width !== this._canvas.offsetWidth) {
        this._redraw(function () {
          var pixelRatio = getPixelRatio(_this._canvas);
          _this._canvas.style.width = "".concat(_this._width, "px");
          _this._canvas.style.height = "".concat(_this._height, "px");
          _this._canvas.width = _this._width * pixelRatio;
          _this._canvas.height = _this._height * pixelRatio;

          _this._ctx.scale(pixelRatio, pixelRatio);
        });
      } else {
        this.flush();
      }
    }
    /**
     * 刷新
     */

  }, {
    key: "flush",
    value: function flush() {
      var _this2 = this;

      if (this.requestAnimationId) {
        cancelAnimationFrame(this.requestAnimationId);
      }

      this.requestAnimationId = requestAnimationFrame(function () {
        _this2._redraw();
      });
    }
    /**
     * 获取图片
     * @returns {HTMLCanvasElement}
     */

  }, {
    key: "getImage",
    value: function getImage() {
      return this._canvas;
    }
  }]);

  return View;
}();

var TechnicalIndicatorView = /*#__PURE__*/function (_View) {
  _inherits(TechnicalIndicatorView, _View);

  var _super = _createSuper(TechnicalIndicatorView);

  function TechnicalIndicatorView(container, chartData, xAxis, yAxis, additionalDataProvider) {
    var _this;

    _classCallCheck(this, TechnicalIndicatorView);

    _this = _super.call(this, container, chartData);
    _this._xAxis = xAxis;
    _this._yAxis = yAxis;
    _this._additionalDataProvider = additionalDataProvider;
    return _this;
  }

  _createClass(TechnicalIndicatorView, [{
    key: "_draw",
    value: function _draw() {
      this._drawGrid();

      this._drawTechnicalIndicator();
    }
    /**
     * 绘制网格
     * @private
     */

  }, {
    key: "_drawGrid",
    value: function _drawGrid() {
      var _this2 = this;

      var grid = this._chartData.styleOptions().grid;

      if (!grid.display) {
        return;
      }

      var horizontalGrid = grid.horizontal;

      this._ctx.save();

      if (horizontalGrid.display) {
        this._ctx.strokeStyle = horizontalGrid.color;
        this._ctx.lineWidth = horizontalGrid.size;

        if (horizontalGrid.style === LineStyle.DASH) {
          this._ctx.setLineDash(horizontalGrid.dashValue);
        }

        this._yAxis.ticks().forEach(function (tick) {
          drawHorizontalLine(_this2._ctx, tick.y, 0, _this2._width);
        });
      }

      var verticalGrid = grid.vertical;

      if (verticalGrid.display) {
        this._ctx.strokeStyle = verticalGrid.color;
        this._ctx.lineWidth = verticalGrid.size;

        if (verticalGrid.style === LineStyle.DASH) {
          this._ctx.setLineDash(verticalGrid.dashValue);
        } else {
          this._ctx.setLineDash([]);
        }

        this._xAxis.ticks().forEach(function (tick) {
          drawVerticalLine(_this2._ctx, tick.x, 0, _this2._height);
        });
      }

      this._ctx.restore();
    }
    /**
     * 绘制指标
     * @private
     */

  }, {
    key: "_drawTechnicalIndicator",
    value: function _drawTechnicalIndicator() {
      var _this3 = this;

      var technicalIndicator = this._additionalDataProvider.technicalIndicator();

      var plots = technicalIndicator.plots;
      var lines = [];

      var technicalIndicatorOptions = this._chartData.styleOptions().technicalIndicator;

      var dataList = this._chartData.dataList();

      var technicalIndicatorResult = technicalIndicator.result;
      var baseValue = technicalIndicator.baseValue;

      if (!isValid(baseValue)) {
        baseValue = this._yAxis.min();
      }

      var baseValueY = this._yAxis.convertToPixel(baseValue);

      var isCandleStickYAxis = this._yAxis.isCandleStickYAxis();

      this._ctx.lineWidth = 1;

      this._drawGraphics(function (x, i, kLineData, halfBarSpace, barSpace) {
        var technicalIndicatorData = technicalIndicatorResult[i] || {};
        var lineValueIndex = 0;

        if (technicalIndicator.shouldOhlc && !isCandleStickYAxis) {
          _this3._drawCandleStickBar(x, halfBarSpace, barSpace, kLineData, technicalIndicatorOptions.bar, CandleStickStyle.OHLC);
        }

        plots.forEach(function (plot) {
          var value = technicalIndicatorData[plot.key];

          switch (plot.type) {
            case PlotType.CIRCLE:
              {
                if (isValid(value)) {
                  var cbData = {
                    preData: {
                      kLineData: dataList[i - 1],
                      technicalIndicatorData: technicalIndicatorResult[i - 1]
                    },
                    currentData: {
                      kLineData: kLineData,
                      technicalIndicatorData: technicalIndicatorData
                    }
                  };

                  var valueY = _this3._yAxis.convertToPixel(value);

                  var circle = {
                    x: x,
                    y: valueY,
                    radius: halfBarSpace,
                    color: plot.color && plot.color(cbData, technicalIndicatorOptions) || technicalIndicatorOptions.circle.noChangeColor,
                    isStroke: plot.isStroke ? plot.isStroke(cbData) : true
                  };

                  _this3._drawCircle(circle);
                }

                break;
              }

            case PlotType.BAR:
              {
                if (isValid(value)) {
                  var _cbData = {
                    preData: {
                      kLineData: dataList[i - 1],
                      technicalIndicatorData: technicalIndicatorResult[i - 1]
                    },
                    currentData: {
                      kLineData: kLineData,
                      technicalIndicatorData: technicalIndicatorData
                    }
                  };

                  var _valueY = _this3._yAxis.convertToPixel(value);

                  var height = Math.abs(baseValueY - _valueY);
                  var bar = {
                    x: x - halfBarSpace,
                    width: halfBarSpace * 2,
                    height: Math.max(1, height)
                  };

                  if (_valueY <= baseValueY) {
                    bar.y = height < 1 ? baseValueY + 1 : _valueY;
                  } else {
                    bar.y = baseValueY;
                  }

                  bar.color = plot.color && plot.color(_cbData, technicalIndicatorOptions) || technicalIndicatorOptions.bar.noChangeColor;
                  bar.isStroke = plot.isStroke ? plot.isStroke(_cbData) : false;

                  _this3._drawBar(bar);
                }

                break;
              }

            default:
              {
                if (isValid(value)) {
                  var _valueY2 = _this3._yAxis.convertToPixel(value);

                  var line = {
                    x: x,
                    y: _valueY2
                  };

                  if (lines[lineValueIndex]) {
                    lines[lineValueIndex].push(line);
                  } else {
                    lines[lineValueIndex] = [line];
                  }
                } else {
                  if (lines[lineValueIndex]) {
                    lines[lineValueIndex].push(null);
                  } else {
                    lines[lineValueIndex] = [null];
                  }
                }

                lineValueIndex++;
                break;
              }
          }
        });
      }, function () {
        _this3._drawLines(lines, technicalIndicatorOptions);
      });
    }
    /**
     * 绘制线
     * @param lines
     * @param technicalIndicatorOptions
     */

  }, {
    key: "_drawLines",
    value: function _drawLines(lines, technicalIndicatorOptions) {
      var _this4 = this;

      var colors = technicalIndicatorOptions.line.colors;
      var colorSize = (colors || []).length;
      this._ctx.lineWidth = technicalIndicatorOptions.line.size;
      drawLine(this._ctx, function () {
        lines.forEach(function (lineItem, i) {
          _this4._ctx.strokeStyle = colors[i % colorSize];

          _this4._ctx.beginPath();

          var isStart = true;
          lineItem.forEach(function (line) {
            if (isValid(line)) {
              if (isStart) {
                _this4._ctx.moveTo(line.x, line.y);

                isStart = false;
              } else {
                _this4._ctx.lineTo(line.x, line.y);
              }
            }
          });

          _this4._ctx.stroke();

          _this4._ctx.closePath();
        });
      });
    }
    /**
     * 绘制柱
     */

  }, {
    key: "_drawBar",
    value: function _drawBar(bar) {
      if (bar.isStroke) {
        this._ctx.strokeStyle = bar.color;

        this._ctx.strokeRect(bar.x + 0.5, bar.y, bar.width - 1, bar.height);
      } else {
        this._ctx.fillStyle = bar.color;

        this._ctx.fillRect(bar.x, bar.y, bar.width, bar.height);
      }
    }
    /**
     * 绘制圆点
     * @param circle
     * @private
     */

  }, {
    key: "_drawCircle",
    value: function _drawCircle(circle) {
      this._ctx.strokeStyle = circle.color;
      this._ctx.fillStyle = circle.color;

      this._ctx.beginPath();

      this._ctx.arc(circle.x, circle.y, circle.radius, Math.PI * 2, 0, true);

      if (circle.isStroke) {
        this._ctx.stroke();
      } else {
        this._ctx.fill();
      }

      this._ctx.closePath();
    }
    /**
     * 绘制图形
     * @param onDrawing
     * @param onDrawEnd
     * @private
     */

  }, {
    key: "_drawGraphics",
    value: function _drawGraphics(onDrawing, onDrawEnd) {
      var dataList = this._chartData.dataList();

      var dataSize = dataList.length;

      var barSpace = this._chartData.barSpace();

      var dataSpace = this._chartData.dataSpace();

      var halfBarSpace = barSpace / 2;

      var offsetRightBarCount = this._chartData.offsetRightBarCount();

      var to = this._chartData.to();

      for (var i = this._chartData.from(); i < to; i++) {
        var deltaFromRight = dataSize + offsetRightBarCount - i;
        var x = this._width - (deltaFromRight - 0.5) * dataSpace + halfBarSpace;
        var kLineData = dataList[i];
        onDrawing(x, i, kLineData, halfBarSpace, barSpace);
      }

      if (onDrawEnd) {
        onDrawEnd();
      }
    }
    /**
     * 绘制蜡烛柱
     * @param x
     * @param halfBarSpace
     * @param barSpace
     * @param kLineData
     * @param barOptions
     * @param barStyle
     * @private
     */

  }, {
    key: "_drawCandleStickBar",
    value: function _drawCandleStickBar(x, halfBarSpace, barSpace, kLineData, barOptions, barStyle) {
      var open = kLineData.open;
      var close = kLineData.close;
      var high = kLineData.high;
      var low = kLineData.low;

      if (close > open) {
        this._ctx.strokeStyle = barOptions.upColor;
        this._ctx.fillStyle = barOptions.upColor;
      } else if (close < open) {
        this._ctx.strokeStyle = barOptions.downColor;
        this._ctx.fillStyle = barOptions.downColor;
      } else {
        this._ctx.strokeStyle = barOptions.noChangeColor;
        this._ctx.fillStyle = barOptions.noChangeColor;
      }

      var openY = this._yAxis.convertToPixel(open);

      var closeY = this._yAxis.convertToPixel(close);

      var highY = this._yAxis.convertToPixel(high);

      var lowY = this._yAxis.convertToPixel(low);

      var highEndY = Math.min(openY, closeY);
      var lowStartY = Math.max(openY, closeY);

      this._ctx.fillRect(x - 0.5, highY, 1, highEndY - highY);

      this._ctx.fillRect(x - 0.5, lowStartY, 1, lowY - lowStartY);

      var barHeight = Math.max(1, lowStartY - highEndY);

      switch (barStyle) {
        case CandleStickStyle.SOLID:
          {
            this._ctx.fillRect(x - halfBarSpace, highEndY, barSpace, barHeight);

            break;
          }

        case CandleStickStyle.STROKE:
          {
            this._ctx.strokeRect(x - halfBarSpace + 0.5, highEndY, barSpace - 1, barHeight);

            break;
          }

        case CandleStickStyle.UP_STROKE:
          {
            if (close > open) {
              this._ctx.strokeRect(x - halfBarSpace + 0.5, highEndY, barSpace - 1, barHeight);
            } else {
              this._ctx.fillRect(x - halfBarSpace, highEndY, barSpace, barHeight);
            }

            break;
          }

        case CandleStickStyle.DOWN_STROKE:
          {
            if (close > open) {
              this._ctx.fillRect(x - halfBarSpace, highEndY, barSpace, barHeight);
            } else {
              this._ctx.strokeRect(x - halfBarSpace + 0.5, highEndY, barSpace - 1, barHeight);
            }

            break;
          }

        default:
          {
            this._ctx.fillRect(x - 0.5, highY, 1, lowY - highY);

            this._ctx.fillRect(x - halfBarSpace, openY - 0.5, halfBarSpace, 1);

            this._ctx.fillRect(x, closeY - 0.5, halfBarSpace, 1);

            break;
          }
      }
    }
  }]);

  return TechnicalIndicatorView;
}(View);

var TechnicalIndicatorFloatLayerView = /*#__PURE__*/function (_View) {
  _inherits(TechnicalIndicatorFloatLayerView, _View);

  var _super = _createSuper(TechnicalIndicatorFloatLayerView);

  function TechnicalIndicatorFloatLayerView(container, chartData, xAxis, yAxis, additionalDataProvider) {
    var _this;

    _classCallCheck(this, TechnicalIndicatorFloatLayerView);

    _this = _super.call(this, container, chartData);
    _this._xAxis = xAxis;
    _this._yAxis = yAxis;
    _this._additionalDataProvider = additionalDataProvider;
    return _this;
  }

  _createClass(TechnicalIndicatorFloatLayerView, [{
    key: "_draw",
    value: function _draw() {
      var crossHair = this._chartData.crossHair();

      var dataList = this._chartData.dataList();

      var technicalIndicator = this._additionalDataProvider.technicalIndicator();

      var technicalIndicatorResult = technicalIndicator.result;
      var realDataPos;

      if (isValid(crossHair.x)) {
        realDataPos = this._xAxis.convertFromPixel(crossHair.x);
      } else {
        realDataPos = dataList.length - 1;
      }

      var dataPos = realDataPos;

      if (dataPos < 0) {
        dataPos = 0;
      } else if (dataPos > dataList.length - 1) {
        dataPos = dataList.length - 1;
      }

      var kLineData = dataList[dataPos];
      var technicalIndicatorData = technicalIndicatorResult[dataPos];

      if (kLineData) {
        var realDataPosX = this._xAxis.convertToPixel(realDataPos);

        this._drawCrossHairHorizontalLine(crossHair);

        this._drawCrossHairVerticalLine(crossHair, realDataPosX);

        var displayRule = this._chartData.styleOptions().floatLayer.prompt.displayRule;

        if (displayRule === FloatLayerPromptDisplayRule.ALWAYS || displayRule === FloatLayerPromptDisplayRule.FOLLOW_CROSS && crossHair.paneTag) {
          this._drawPrompt(kLineData, technicalIndicatorData, realDataPos, realDataPosX, technicalIndicator, realDataPos >= 0 && realDataPos <= dataList.length - 1 && crossHair.paneTag);
        }
      }
    }
    /**
     * 绘制提示
     * @param crossHair
     * @param kLineData
     * @param technicalIndicatorData
     * @param realDataPos
     * @param realDataPosX
     * @param technicalIndicator
     * @param isDrawValueIndicator 是否需要绘制指示点
     * @private
     */

  }, {
    key: "_drawPrompt",
    value: function _drawPrompt(kLineData, technicalIndicatorData, realDataPos, realDataPosX, technicalIndicator, isDrawValueIndicator) {
      this._drawTechnicalIndicatorPrompt(technicalIndicatorData, realDataPos, realDataPosX, technicalIndicator, isDrawValueIndicator);
    }
    /**
     * 绘制十字光标水平线
     * @param crossHair
     * @private
     */

  }, {
    key: "_drawCrossHairHorizontalLine",
    value: function _drawCrossHairHorizontalLine(crossHair) {
      if (crossHair.paneTag !== this._additionalDataProvider.tag()) {
        return;
      }

      var crossHairOptions = this._chartData.styleOptions().floatLayer.crossHair;

      var crossHairHorizontal = crossHairOptions.horizontal;
      var crossHairHorizontalLine = crossHairHorizontal.line;

      if (!crossHairOptions.display || !crossHairHorizontal.display || !crossHairHorizontalLine.display) {
        return;
      }

      this._ctx.save(); // 绘制十字光标水平线


      this._ctx.lineWidth = crossHairHorizontalLine.size;
      this._ctx.strokeStyle = crossHairHorizontalLine.color;

      if (crossHairHorizontalLine.style === LineStyle.DASH) {
        this._ctx.setLineDash(crossHairHorizontalLine.dashValue);
      }

      drawHorizontalLine(this._ctx, crossHair.y, 0, this._width);

      this._ctx.restore();
    }
    /**
     * 绘制十字光标垂直线
     * @param crossHair
     * @param realDataPosX
     * @private
     */

  }, {
    key: "_drawCrossHairVerticalLine",
    value: function _drawCrossHairVerticalLine(crossHair, realDataPosX) {
      if (!crossHair.paneTag) {
        return;
      }

      var crossHairOptions = this._chartData.styleOptions().floatLayer.crossHair;

      var crossHairVertical = crossHairOptions.vertical;
      var crossHairVerticalLine = crossHairVertical.line;

      if (!crossHairOptions.display || !crossHairVertical.display || !crossHairVerticalLine.display) {
        return;
      }

      this._ctx.save();

      this._ctx.lineWidth = crossHairVerticalLine.size;
      this._ctx.strokeStyle = crossHairVerticalLine.color;

      if (crossHairVerticalLine.style === LineStyle.DASH) {
        this._ctx.setLineDash(crossHairVerticalLine.dashValue);
      }

      drawVerticalLine(this._ctx, realDataPosX, 0, this._height);

      this._ctx.restore();
    }
    /**
     * 绘制指标提示
     * @param technicalIndicatorData
     * @param realDataPos
     * @param realDataPosX
     * @param technicalIndicator
     * @param isDrawValueIndicator
     * @param offsetTop
     * @private
     */

  }, {
    key: "_drawTechnicalIndicatorPrompt",
    value: function _drawTechnicalIndicatorPrompt(technicalIndicatorData, realDataPos, realDataPosX, technicalIndicator, isDrawValueIndicator) {
      var offsetTop = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

      var technicalIndicatorOptions = this._chartData.styleOptions().technicalIndicator;

      var data = getTechnicalIndicatorInfo(technicalIndicatorData, technicalIndicator, this._yAxis);
      var colors = technicalIndicatorOptions.line.colors;

      this._drawTechnicalIndicatorPromptText(realDataPos, technicalIndicator, data, colors, offsetTop);

      if (isDrawValueIndicator) {
        this._drawTechnicalIndicatorPromptPoint(realDataPos, realDataPosX, technicalIndicator, data.values, colors);
      }
    }
    /**
     * 绘制指标提示文字
     * @param dataPos
     * @param technicalIndicator
     * @param data
     * @param colors
     * @param offsetTop
     * @private
     */

  }, {
    key: "_drawTechnicalIndicatorPromptText",
    value: function _drawTechnicalIndicatorPromptText(dataPos, technicalIndicator, data, colors, offsetTop) {
      var dataList = this._chartData.dataList();

      var technicalIndicatorOptions = this._chartData.styleOptions().technicalIndicator;

      var cbData = {
        preData: {
          kLineData: dataList[dataPos - 1],
          technicalIndicatorData: technicalIndicator.result[dataPos - 1]
        },
        currentData: {
          kLineData: dataList[dataPos],
          technicalIndicatorData: technicalIndicator.result[dataPos]
        }
      };
      var plots = technicalIndicator.plots;

      var floatLayerPromptTechnicalIndicatorText = this._chartData.styleOptions().floatLayer.prompt.technicalIndicator.text;

      var nameText = data.name;
      var labels = data.labels;
      var values = data.values;
      var textMarginLeft = floatLayerPromptTechnicalIndicatorText.marginLeft;
      var textMarginRight = floatLayerPromptTechnicalIndicatorText.marginRight;
      var labelX = textMarginLeft;
      var labelY = floatLayerPromptTechnicalIndicatorText.marginTop + offsetTop;
      var textSize = floatLayerPromptTechnicalIndicatorText.size;
      var textColor = floatLayerPromptTechnicalIndicatorText.color;
      var colorSize = colors.length;
      this._ctx.textBaseline = 'top';
      this._ctx.font = getFont(textSize, floatLayerPromptTechnicalIndicatorText.weight, floatLayerPromptTechnicalIndicatorText.family);
      var nameTextWidth = calcTextWidth(this._ctx, nameText);
      this._ctx.fillStyle = textColor;

      this._ctx.fillText(nameText, labelX, labelY);

      labelX += textMarginLeft + nameTextWidth;
      var lineCount = 0;

      for (var i = 0; i < labels.length; i++) {
        switch (plots[i].type) {
          case PlotType.CIRCLE:
            {
              this._ctx.fillStyle = plots[i].color && plots[i].color(cbData, technicalIndicatorOptions) || technicalIndicatorOptions.circle.noChangeColor;
              break;
            }

          case PlotType.BAR:
            {
              this._ctx.fillStyle = plots[i].color && plots[i].color(cbData, technicalIndicatorOptions) || technicalIndicatorOptions.bar.noChangeColor;
              break;
            }

          default:
            {
              this._ctx.fillStyle = colors[lineCount % colorSize] || textColor;
              lineCount++;
            }
        }

        var text = "".concat(labels[i], ": ").concat(values[i].value || 'n/a');
        var textWidth = calcTextWidth(this._ctx, text);

        this._ctx.fillText(text, labelX, labelY);

        labelX += textMarginLeft + textMarginRight + textWidth;
      }
    }
    /**
     * 绘制指标提示点
     * @param realDataPos
     * @param realDataPosX
     * @param technicalIndicator
     * @param values
     * @param colors
     * @private
     */

  }, {
    key: "_drawTechnicalIndicatorPromptPoint",
    value: function _drawTechnicalIndicatorPromptPoint(realDataPos, realDataPosX, technicalIndicator, values, colors) {
      var floatLayerPromptTechnicalIndicatorPoint = this._chartData.styleOptions().floatLayer.prompt.technicalIndicator.point;

      if (!floatLayerPromptTechnicalIndicatorPoint.display) {
        return;
      }

      var plots = technicalIndicator.plots;
      var colorSize = colors.length;
      var valueSize = values.length;
      var radius = floatLayerPromptTechnicalIndicatorPoint.radius;
      var lineCount = 0;

      for (var i = 0; i < valueSize; i++) {
        var value = values[i].value;

        if (plots[i].type === PlotType.LINE) {
          if (isValid(value)) {
            this._ctx.fillStyle = colors[lineCount % colorSize];

            this._ctx.beginPath();

            this._ctx.arc(realDataPosX, values[i].y, radius, 0, Math.PI * 2);

            this._ctx.closePath();

            this._ctx.fill();
          }

          lineCount++;
        }
      }
    }
  }]);

  return TechnicalIndicatorFloatLayerView;
}(View);

var TechnicalIndicatorWidget = /*#__PURE__*/function (_Widget) {
  _inherits(TechnicalIndicatorWidget, _Widget);

  var _super = _createSuper(TechnicalIndicatorWidget);

  function TechnicalIndicatorWidget() {
    _classCallCheck(this, TechnicalIndicatorWidget);

    return _super.apply(this, arguments);
  }

  _createClass(TechnicalIndicatorWidget, [{
    key: "_createMainView",
    value: function _createMainView(container, props) {
      return new TechnicalIndicatorView(container, props.chartData, props.xAxis, props.yAxis, props.additionalDataProvider);
    }
  }, {
    key: "_createFloatLayerView",
    value: function _createFloatLayerView(container, props) {
      return new TechnicalIndicatorFloatLayerView(container, props.chartData, props.xAxis, props.yAxis, props.additionalDataProvider);
    }
  }]);

  return TechnicalIndicatorWidget;
}(Widget);

var YAxisView = /*#__PURE__*/function (_View) {
  _inherits(YAxisView, _View);

  var _super = _createSuper(YAxisView);

  function YAxisView(container, chartData, yAxis, additionalDataProvider) {
    var _this;

    _classCallCheck(this, YAxisView);

    _this = _super.call(this, container, chartData);
    _this._yAxis = yAxis;
    _this._additionalDataProvider = additionalDataProvider;
    return _this;
  }

  _createClass(YAxisView, [{
    key: "_draw",
    value: function _draw() {
      var yAxisOptions = this._chartData.styleOptions().yAxis;

      if (yAxisOptions.display) {
        this._drawAxisLine(yAxisOptions);

        this._drawTickLines(yAxisOptions);

        this._drawTickLabels(yAxisOptions);

        this._drawTechnicalIndicatorLastValue(yAxisOptions);

        this._drawLastPriceLabel(yAxisOptions);
      }
    }
  }, {
    key: "_drawAxisLine",
    value: function _drawAxisLine(yAxisOptions) {
      var axisLine = yAxisOptions.axisLine;

      if (!axisLine.display) {
        return;
      }

      this._ctx.strokeStyle = axisLine.color;
      this._ctx.lineWidth = axisLine.size;
      var x;

      if (this._isDrawFromStart(yAxisOptions)) {
        x = 0;
      } else {
        x = this._width - 1;
      }

      drawVerticalLine(this._ctx, x, 0, this._height);
    }
  }, {
    key: "_drawTickLines",
    value: function _drawTickLines(yAxisOptions) {
      var _this2 = this;

      var tickLine = yAxisOptions.tickLine;

      if (!tickLine.display) {
        return;
      }

      this._ctx.lineWidth = tickLine.size;
      this._ctx.strokeStyle = tickLine.color;
      var tickLineLength = tickLine.length;
      var startX;
      var endX;

      if (this._isDrawFromStart(yAxisOptions)) {
        startX = 0;

        if (yAxisOptions.axisLine.display) {
          startX += yAxisOptions.axisLine.size;
        }

        endX = startX + tickLineLength;
      } else {
        startX = this._width;

        if (yAxisOptions.axisLine.display) {
          startX -= yAxisOptions.axisLine.size;
        }

        endX = startX - tickLineLength;
      }

      this._yAxis.ticks().forEach(function (tick) {
        drawHorizontalLine(_this2._ctx, tick.y, startX, endX);
      });
    }
  }, {
    key: "_drawTickLabels",
    value: function _drawTickLabels(yAxisOptions) {
      var _this3 = this;

      var tickText = yAxisOptions.tickText;

      if (!tickText.display) {
        return;
      }

      var tickLine = yAxisOptions.tickLine;
      var tickLineDisplay = tickLine.display;
      var tickLineLength = tickLine.length;
      var labelX;

      if (this._isDrawFromStart(yAxisOptions)) {
        labelX = tickText.paddingLeft;

        if (yAxisOptions.axisLine.display) {
          labelX += yAxisOptions.axisLine.size;
        }

        if (tickLineDisplay) {
          labelX += tickLineLength;
        }

        this._ctx.textAlign = 'left';
      } else {
        labelX = this._width - tickText.paddingRight;

        if (yAxisOptions.axisLine.display) {
          labelX -= yAxisOptions.axisLine.size;
        }

        if (tickLineDisplay) {
          labelX -= tickLineLength;
        }

        this._ctx.textAlign = 'right';
      }

      this._ctx.textBaseline = 'middle';
      this._ctx.font = getFont(tickText.size, tickText.weight, tickText.family);
      this._ctx.fillStyle = tickText.color;

      this._yAxis.ticks().forEach(function (tick) {
        _this3._ctx.fillText(tick.v, labelX, tick.y);
      });

      this._ctx.textAlign = 'left';
    }
    /**
     * 绘制技术指标最后值
     * @param yAxisOptions
     * @private
     */

  }, {
    key: "_drawTechnicalIndicatorLastValue",
    value: function _drawTechnicalIndicatorLastValue(yAxisOptions) {
      var _this4 = this;

      var technicalIndicatorStyleOptions = this._chartData.styleOptions().technicalIndicator;

      var lastValueMarkStyleOptions = technicalIndicatorStyleOptions.lastValueMark;

      var technicalIndicator = this._additionalDataProvider.technicalIndicator();

      var technicalIndicatorResult = technicalIndicator.result;
      var dataSize = technicalIndicatorResult.length;
      var technicalIndicatorData = technicalIndicatorResult[dataSize - 1];

      if (!lastValueMarkStyleOptions.display || !technicalIndicatorData) {
        return;
      }

      var dataList = this._chartData.dataList();

      var plots = technicalIndicator.plots;
      var cbData = {
        preData: {
          kLineData: dataList[dataSize - 2],
          technicalIndicatorData: technicalIndicatorResult[dataSize - 2]
        },
        currentData: {
          kLineData: dataList[dataSize - 1],
          technicalIndicatorData: technicalIndicatorData
        }
      };
      var precision = technicalIndicator.precision;
      var colors = technicalIndicatorStyleOptions.line.colors || [];
      var colorSize = colors.length;
      var lineCount = 0;
      plots.forEach(function (plot) {
        var value = technicalIndicatorData[plot.key];
        var backgroundColor;

        switch (plot.type) {
          case PlotType.CIRCLE:
            {
              backgroundColor = plot.color && plot.color(cbData, technicalIndicatorStyleOptions) || technicalIndicatorStyleOptions.circle.noChangeColor;
              break;
            }

          case PlotType.BAR:
            {
              backgroundColor = plot.color && plot.color(cbData, technicalIndicatorStyleOptions) || technicalIndicatorStyleOptions.bar.noChangeColor;
              break;
            }

          default:
            {
              backgroundColor = colors[lineCount % colorSize];
              lineCount++;
            }
        }

        if (isValid(value)) {
          _this4._drawMarkLabel(yAxisOptions, value, precision, lastValueMarkStyleOptions.textSize, lastValueMarkStyleOptions.textWeight, lastValueMarkStyleOptions.textFamily, lastValueMarkStyleOptions.textColor, backgroundColor, lastValueMarkStyleOptions.textPaddingLeft, lastValueMarkStyleOptions.textPaddingTop, lastValueMarkStyleOptions.textPaddingRight, lastValueMarkStyleOptions.textPaddingBottom);
        }
      });
    }
    /**
     * 绘制最新价文字
     * @private
     */

  }, {
    key: "_drawLastPriceLabel",
    value: function _drawLastPriceLabel(yAxisOptions) {
      if (!this._yAxis.isCandleStickYAxis()) {
        return;
      }

      var priceMark = this._chartData.styleOptions().candleStick.priceMark;

      var lastPriceMark = priceMark.last;

      var dataList = this._chartData.dataList();

      var dataSize = dataList.length;

      if (!priceMark.display || !lastPriceMark.display || !lastPriceMark.text.display || dataSize === 0) {
        return;
      }

      var kLineData = dataList[dataSize - 1];
      var close = kLineData.close;
      var open = kLineData.open;
      var backgroundColor;

      if (close > open) {
        backgroundColor = lastPriceMark.upColor;
      } else if (close < open) {
        backgroundColor = lastPriceMark.downColor;
      } else {
        backgroundColor = lastPriceMark.noChangeColor;
      }

      var priceMarkText = lastPriceMark.text;

      this._drawMarkLabel(yAxisOptions, close, this._chartData.pricePrecision(), priceMarkText.size, priceMarkText.weight, priceMarkText.family, priceMarkText.color, backgroundColor, priceMarkText.paddingLeft, priceMarkText.paddingTop, priceMarkText.paddingRight, priceMarkText.paddingBottom);
    }
    /**
     * 绘制标记label
     * @param yAxisOptions
     * @param value
     * @param precision
     * @param textSize
     * @param textWeight
     * @param textFamily
     * @param textColor
     * @param backgroundColor
     * @param textPaddingLeft
     * @param textPaddingTop
     * @param textPaddingRight
     * @param textPaddingBottom
     * @private
     */

  }, {
    key: "_drawMarkLabel",
    value: function _drawMarkLabel(yAxisOptions, value, precision, textSize, textWeight, textFamily, textColor, backgroundColor, textPaddingLeft, textPaddingTop, textPaddingRight, textPaddingBottom) {
      var valueY = this._yAxis.convertToPixel(value);

      valueY = +Math.max(this._height * 0.05, Math.min(valueY, this._height * 0.98)).toFixed(0);
      var text;

      if (this._yAxis.isPercentageYAxis()) {
        var fromClose = this._chartData.dataList()[this._chartData.from()].close;

        text = "".concat(((value - fromClose) / fromClose * 100).toFixed(2), "%");
      } else {
        text = formatPrecision(value, precision);

        if (this._additionalDataProvider.technicalIndicator().shouldFormatBigNumber) {
          text = formatBigNumber(text);
        }
      }

      this._ctx.font = getFont(textSize, textWeight, textFamily);
      var rectWidth = calcTextWidth(this._ctx, text) + textPaddingLeft + textPaddingRight;
      var rectHeight = textPaddingTop + textSize + textPaddingBottom;
      var rectStartX;

      if (this._isDrawFromStart(yAxisOptions)) {
        rectStartX = 0;
      } else {
        rectStartX = this._width - rectWidth;
      }

      this._ctx.fillStyle = backgroundColor;

      this._ctx.fillRect(rectStartX, valueY - textPaddingTop - textSize / 2, rectWidth, rectHeight);

      this._ctx.fillStyle = textColor;
      this._ctx.textBaseline = 'middle';

      this._ctx.fillText(text, rectStartX + textPaddingLeft, valueY);
    }
    /**
     * 判断是否从开始点绘制
     * @private
     */

  }, {
    key: "_isDrawFromStart",
    value: function _isDrawFromStart(yAxisOptions) {
      return yAxisOptions.position === YAxisPosition.LEFT && yAxisOptions.inside || yAxisOptions.position === YAxisPosition.RIGHT && !yAxisOptions.inside;
    }
  }]);

  return YAxisView;
}(View);

var YAxisFloatLayerView = /*#__PURE__*/function (_View) {
  _inherits(YAxisFloatLayerView, _View);

  var _super = _createSuper(YAxisFloatLayerView);

  function YAxisFloatLayerView(container, chartData, yAxis, additionalDataProvider) {
    var _this;

    _classCallCheck(this, YAxisFloatLayerView);

    _this = _super.call(this, container, chartData);
    _this._yAxis = yAxis;
    _this._additionalDataProvider = additionalDataProvider;
    return _this;
  }

  _createClass(YAxisFloatLayerView, [{
    key: "_draw",
    value: function _draw() {
      this._drawCrossHairLabel();
    }
  }, {
    key: "_drawCrossHairLabel",
    value: function _drawCrossHairLabel() {
      var crossHair = this._chartData.crossHair();

      if (crossHair.paneTag !== this._additionalDataProvider.tag() || this._chartData.dataList().length === 0) {
        return;
      }

      var crossHairOptions = this._chartData.styleOptions().floatLayer.crossHair;

      var crossHairHorizontal = crossHairOptions.horizontal;
      var crossHairHorizontalText = crossHairHorizontal.text;

      if (!crossHairOptions.display || !crossHairHorizontal.display || !crossHairHorizontalText.display) {
        return;
      }

      var value = this._yAxis.convertFromPixel(crossHair.y);

      var yAxisDataLabel;

      if (this._yAxis.isPercentageYAxis()) {
        var fromClose = this._chartData.dataList()[this._chartData.from()].close;

        yAxisDataLabel = "".concat(((value - fromClose) / fromClose * 100).toFixed(2), "%");
      } else {
        var technicalIndicator = this._additionalDataProvider.technicalIndicator();

        var precision = this._yAxis.isCandleStickYAxis() ? this._chartData.pricePrecision() : technicalIndicator.precision;
        yAxisDataLabel = formatPrecision(value, precision);

        if (technicalIndicator.shouldFormatBigNumber) {
          yAxisDataLabel = formatBigNumber(yAxisDataLabel);
        }
      }

      var textSize = crossHairHorizontalText.size;
      this._ctx.font = getFont(textSize, crossHairHorizontalText.weight, crossHairHorizontalText.family);
      var yAxisDataLabelWidth = calcTextWidth(this._ctx, yAxisDataLabel);
      var rectStartX;
      var paddingLeft = crossHairHorizontalText.paddingLeft;
      var paddingRight = crossHairHorizontalText.paddingRight;
      var paddingTop = crossHairHorizontalText.paddingTop;
      var paddingBottom = crossHairHorizontalText.paddingBottom;
      var borderSize = crossHairHorizontalText.borderSize;
      var rectWidth = yAxisDataLabelWidth + borderSize * 2 + paddingLeft + paddingRight;
      var rectHeight = textSize + borderSize * 2 + paddingTop + paddingBottom;

      var yAxisOptions = this._chartData.styleOptions().yAxis;

      if (yAxisOptions.position === YAxisPosition.LEFT && yAxisOptions.inside || yAxisOptions.position === YAxisPosition.RIGHT && !yAxisOptions.inside) {
        rectStartX = 0;
      } else {
        rectStartX = this._width - rectWidth;
      }

      var rectY = crossHair.y - borderSize - paddingTop - textSize / 2; // 绘制y轴文字外的边框

      this._ctx.fillStyle = crossHairHorizontalText.backgroundColor;

      this._ctx.fillRect(rectStartX, rectY, rectWidth, rectHeight);

      this._ctx.lineWidth = borderSize;
      this._ctx.strokeStyle = crossHairHorizontalText.borderColor;

      this._ctx.strokeRect(rectStartX, rectY, rectWidth, rectHeight);

      this._ctx.textBaseline = 'middle';
      this._ctx.fillStyle = crossHairHorizontalText.color;

      this._ctx.fillText(yAxisDataLabel, rectStartX + borderSize + paddingLeft, crossHair.y);
    }
  }]);

  return YAxisFloatLayerView;
}(View);

var YAxisWidget = /*#__PURE__*/function (_Widget) {
  _inherits(YAxisWidget, _Widget);

  var _super = _createSuper(YAxisWidget);

  function YAxisWidget() {
    _classCallCheck(this, YAxisWidget);

    return _super.apply(this, arguments);
  }

  _createClass(YAxisWidget, [{
    key: "_createMainView",
    value: function _createMainView(container, props) {
      return new YAxisView(container, props.chartData, props.yAxis, props.additionalDataProvider);
    }
  }, {
    key: "_createFloatLayerView",
    value: function _createFloatLayerView(container, props) {
      return new YAxisFloatLayerView(container, props.chartData, props.yAxis, props.additionalDataProvider);
    }
  }]);

  return YAxisWidget;
}(Widget);

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

var Axis = /*#__PURE__*/function () {
  function Axis(chartData) {
    _classCallCheck(this, Axis);

    this._chartData = chartData;
    this._width = 0;
    this._height = 0;
    this._minValue = 0;
    this._maxValue = 0;
    this._range = 0;
    this._ticks = [];

    this._initMeasureCanvas();
  }

  _createClass(Axis, [{
    key: "_initMeasureCanvas",
    value: function _initMeasureCanvas() {
      var measureCanvas = document.createElement('canvas');
      var pixelRatio = getPixelRatio(measureCanvas);
      this._measureCtx = measureCanvas.getContext('2d');

      this._measureCtx.scale(pixelRatio, pixelRatio);
    }
  }, {
    key: "min",
    value: function min() {
      return this._minValue;
    }
  }, {
    key: "max",
    value: function max() {
      return this._maxValue;
    }
  }, {
    key: "setWidth",
    value: function setWidth(width) {
      this._width = width;
    }
  }, {
    key: "setHeight",
    value: function setHeight(height) {
      this._height = height;
    }
    /**
     * 获取ticks
     * @returns {[]|*[]}
     */

  }, {
    key: "ticks",
    value: function ticks() {
      return this._ticks;
    }
    /**
     * 计算轴
     */

  }, {
    key: "computeAxis",
    value: function computeAxis() {
      var _this$_computeMinMaxV = this._computeMinMaxValue(),
          min = _this$_computeMinMaxV.min,
          max = _this$_computeMinMaxV.max,
          range = _this$_computeMinMaxV.range;

      this._minValue = min;
      this._maxValue = max;
      this._range = range;
      this._ticks = this._computeOptimalTicks(this._computeTicks());
    }
    /**
     * 计算最大最小值
     */

  }, {
    key: "_computeMinMaxValue",
    value: function _computeMinMaxValue() {}
    /**
     * 计算最佳的tick
     * @param ticks
     */

  }, {
    key: "_computeOptimalTicks",
    value: function _computeOptimalTicks(ticks) {}
    /**
     * 计算轴上的tick值
     */

  }, {
    key: "_computeTicks",
    value: function _computeTicks() {
      var ticks = [];

      if (this._range >= 0) {
        var interval = +this._nice(this._range / 8.0);

        var precision = this._getIntervalPrecision(interval);

        var first = +this._round(Math.ceil(this._minValue / interval) * interval, precision);
        var last = +this._round(Math.floor(this._maxValue / interval) * interval, precision);
        var n = 0;
        var f = first;

        if (interval !== 0) {
          while (f <= last) {
            ticks[n] = {
              v: f.toFixed(precision)
            };
            ++n;
            f += interval;
          }
        }
      }

      return ticks;
    }
  }, {
    key: "_nice",
    value: function _nice(value) {
      var exponent = Math.floor(Math.log(value) / Math.LN10);
      var exp10 = Math.pow(10.0, exponent);
      var f = value / exp10; // 1 <= f < 10

      var nf = 0;

      if (f < 1.5) {
        nf = 1;
      } else if (f < 2.5) {
        nf = 2;
      } else if (f < 3.5) {
        nf = 3;
      } else if (f < 4.5) {
        nf = 4;
      } else if (f < 5.5) {
        nf = 5;
      } else if (f < 6.5) {
        nf = 6;
      } else {
        nf = 8;
      }

      value = nf * exp10;
      return exponent >= -20 ? +value.toFixed(exponent < 0 ? -exponent : 0) : value;
    }
  }, {
    key: "_getIntervalPrecision",
    value: function _getIntervalPrecision(value) {
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
  }, {
    key: "_round",
    value: function _round(x, precision) {
      if (precision == null) {
        precision = 10;
      }

      precision = Math.min(Math.max(0, precision), 20);
      x = (+x).toFixed(precision);
      return x;
    }
  }]);

  return Axis;
}();

var YAxis = /*#__PURE__*/function (_Axis) {
  _inherits(YAxis, _Axis);

  var _super = _createSuper(YAxis);

  function YAxis(chartData, isCandleStickYAxis, additionalDataProvider) {
    var _this;

    _classCallCheck(this, YAxis);

    _this = _super.call(this, chartData);
    _this._isCandleStickYAxis = isCandleStickYAxis;
    _this._additionalDataProvider = additionalDataProvider;
    return _this;
  }

  _createClass(YAxis, [{
    key: "_computeMinMaxValue",
    value: function _computeMinMaxValue() {
      var min = this._minValue;
      var max = this._maxValue;
      var range = Math.abs(max - min); // 保证每次图形绘制上下都留间隙

      min = min - range / 100.0 * 10.0;
      max = max + range / 100.0 * 20.0;
      range = Math.abs(max - min);
      return {
        min: min,
        max: max,
        range: range
      };
    }
  }, {
    key: "_computeOptimalTicks",
    value: function _computeOptimalTicks(ticks) {
      var optimalTicks = [];
      var tickLength = ticks.length;

      if (tickLength > 0) {
        var textHeight = this._chartData.styleOptions().xAxis.tickText.size;

        var y = this._innerConvertToPixel(+ticks[0].v);

        var tickCountDif = 1;

        if (tickLength > 1) {
          var nextY = this._innerConvertToPixel(+ticks[1].v);

          var yDif = Math.abs(nextY - y);

          if (yDif < textHeight * 2) {
            tickCountDif = Math.ceil(textHeight * 2 / yDif);
          }
        }

        var technicalIndicator = this._additionalDataProvider.technicalIndicator();

        var isPercentageAxis = this.isPercentageYAxis();
        var precision = this._isCandleStickYAxis ? this._chartData.pricePrecision() : technicalIndicator.precision;
        var shouldFormatBigNumber = technicalIndicator.shouldFormatBigNumber;

        for (var i = 0; i < tickLength; i += tickCountDif) {
          var v = ticks[i].v;
          v = +v === 0 ? '0' : v;

          var _y = this._innerConvertToPixel(+v);

          var value = '';

          if (isPercentageAxis) {
            value = "".concat(formatPrecision(v, 2), "%");
          } else {
            value = formatPrecision(v, precision);

            if (shouldFormatBigNumber) {
              value = formatBigNumber(value);
            }
          }

          if (_y > textHeight && _y < this._height - textHeight) {
            optimalTicks.push({
              v: value,
              y: _y
            });
          }
        }
      }

      return optimalTicks;
    }
    /**
     * 计算最大最小值
     */

  }, {
    key: "calcMinMaxValue",
    value: function calcMinMaxValue() {
      var _this2 = this;

      var technicalIndicator = this._additionalDataProvider.technicalIndicator();

      var isTimeLine = this._additionalDataProvider.isTimeLine();

      var dataList = this._chartData.dataList();

      var technicalIndicatorResult = technicalIndicator.result;

      var from = this._chartData.from();

      var to = this._chartData.to();

      var isShowAverageLine = this._chartData.styleOptions().realTime.averageLine.display;

      var minMaxArray = [Infinity, -Infinity];

      if (isTimeLine) {
        for (var i = from; i < to; i++) {
          var kLineData = dataList[i];
          var technicalIndicatorData = technicalIndicatorResult[i] || {};
          minMaxArray[0] = Math.min(kLineData.close, minMaxArray[0]);
          minMaxArray[1] = Math.max(kLineData.close, minMaxArray[1]);

          if (isShowAverageLine && isValid(technicalIndicatorData.average)) {
            minMaxArray[0] = Math.min(technicalIndicatorData.average, minMaxArray[0]);
            minMaxArray[1] = Math.max(technicalIndicatorData.average, minMaxArray[1]);
          }
        }
      } else {
        var plots = technicalIndicator.plots || [];

        var _loop = function _loop(_i) {
          var kLineData = dataList[_i];
          var technicalIndicatorData = technicalIndicatorResult[_i] || {};
          plots.forEach(function (plot) {
            var value = technicalIndicatorData[plot.key];

            if (isValid(value)) {
              minMaxArray[0] = Math.min(minMaxArray[0], value);
              minMaxArray[1] = Math.max(minMaxArray[1], value);
            }
          });

          if (_this2._isCandleStickYAxis || technicalIndicator.shouldOhlc) {
            minMaxArray[0] = Math.min(minMaxArray[0], kLineData.low);
            minMaxArray[1] = Math.max(minMaxArray[1], kLineData.high);
          }
        };

        for (var _i = from; _i < to; _i++) {
          _loop(_i);
        }
      }

      if (isValid(technicalIndicator.minValue) && isNumber(technicalIndicator.minValue)) {
        minMaxArray[0] = technicalIndicator.minValue;
      }

      if (isValid(technicalIndicator.maxValue) && isNumber(technicalIndicator.maxValue)) {
        minMaxArray[1] = technicalIndicator.maxValue;
      }

      if (minMaxArray[0] !== Infinity && minMaxArray[1] !== -Infinity) {
        if (this.isPercentageYAxis()) {
          var fromClose = dataList[from].close;
          this._minValue = (minMaxArray[0] - fromClose) / fromClose * 100;
          this._maxValue = (minMaxArray[1] - fromClose) / fromClose * 100;

          if (this._minValue === this._maxValue || Math.abs(this._minValue - this._maxValue) < Math.pow(10, -2)) {
            this._minValue -= 10;
            this._maxValue += 10;
          }
        } else {
          this._minValue = minMaxArray[0];
          this._maxValue = minMaxArray[1];

          if (this._minValue === this._maxValue || Math.abs(this._minValue - this._maxValue) < Math.pow(10, -6)) {
            var percentValue = this._minValue !== 0 ? Math.abs(this._minValue * 0.2) : 10;
            this._minValue = this._minValue !== 0 ? this._minValue - percentValue : this._minValue;
            this._maxValue += percentValue;
          }
        }
      }
    }
  }, {
    key: "_innerConvertToPixel",
    value: function _innerConvertToPixel(value) {
      return Math.round((1.0 - (value - this._minValue) / this._range) * this._height);
    }
  }, {
    key: "isCandleStickYAxis",
    value: function isCandleStickYAxis() {
      return this._isCandleStickYAxis;
    }
    /**
     * 是否是蜡烛图y轴组件
     * @returns {boolean}
     */

  }, {
    key: "isPercentageYAxis",
    value: function isPercentageYAxis() {
      return this._isCandleStickYAxis && this._chartData.styleOptions().yAxis.type === YAxisType.PERCENTAGE;
    }
  }, {
    key: "getSelfWidth",
    value: function getSelfWidth() {
      var _this3 = this;

      var technicalIndicator = this._additionalDataProvider.technicalIndicator();

      var stylOptions = this._chartData.styleOptions();

      var yAxisOptions = stylOptions.yAxis;
      var yAxisWidth = 0;

      if (yAxisOptions.display) {
        if (yAxisOptions.axisLine.display) {
          yAxisWidth += yAxisOptions.axisLine.size;
        }

        if (yAxisOptions.tickLine.display) {
          yAxisWidth += yAxisOptions.tickLine.length;
        }

        if (yAxisOptions.tickText.display) {
          var textWidth = 0;
          this._measureCtx.font = getFont(yAxisOptions.tickText.size, yAxisOptions.tickText.weight, yAxisOptions.tickText.family);

          this._ticks.forEach(function (tick) {
            textWidth = Math.max(textWidth, calcTextWidth(_this3._measureCtx, tick.v));
          });

          yAxisWidth += yAxisOptions.tickText.paddingLeft + yAxisOptions.tickText.paddingRight + textWidth;
        }
      }

      var crossHairOptions = stylOptions.floatLayer.crossHair;
      var crossHairVerticalTextWidth = 0;

      if (crossHairOptions.display && crossHairOptions.horizontal.display && crossHairOptions.horizontal.text.display) {
        this._measureCtx.font = getFont(crossHairOptions.horizontal.text.size, crossHairOptions.horizontal.text.weight, crossHairOptions.horizontal.text.family);
        var precision = 2;

        if (!this.isPercentageYAxis()) {
          if (this._isCandleStickYAxis) {
            var pricePrecision = this._chartData.pricePrecision();

            if (stylOptions.technicalIndicator.lastValueMark.display) {
              precision = Math.max(technicalIndicator.precision, pricePrecision);
            } else {
              precision = pricePrecision;
            }
          } else {
            precision = technicalIndicator.precision;
          }
        }

        var valueText = formatPrecision(this._maxValue, precision);

        if (technicalIndicator.shouldFormatBigNumber) {
          valueText = formatBigNumber(valueText);
        }

        crossHairVerticalTextWidth += crossHairOptions.horizontal.text.paddingLeft + crossHairOptions.horizontal.text.paddingRight + crossHairOptions.horizontal.text.borderSize * 2 + calcTextWidth(this._measureCtx, valueText);
      }

      return Math.max(yAxisWidth, crossHairVerticalTextWidth);
    }
  }, {
    key: "convertFromPixel",
    value: function convertFromPixel(pixel) {
      var yAxisValue = (1.0 - pixel / this._height) * this._range + this._minValue;

      if (this.isPercentageYAxis()) {
        var fromClose = this._chartData.dataList()[this._chartData.from()].close;

        return fromClose * yAxisValue / 100 + fromClose;
      }

      return yAxisValue;
    }
  }, {
    key: "convertToPixel",
    value: function convertToPixel(value) {
      var realValue = value;

      if (this.isPercentageYAxis()) {
        var fromClose = (this._chartData.dataList()[this._chartData.from()] || {}).close;

        if (isValid(fromClose)) {
          realValue = (value - fromClose) / fromClose * 100;
        }
      }

      return this._innerConvertToPixel(realValue);
    }
  }]);

  return YAxis;
}(Axis);

var TechnicalIndicatorPane = /*#__PURE__*/function (_Pane) {
  _inherits(TechnicalIndicatorPane, _Pane);

  var _super = _createSuper(TechnicalIndicatorPane);

  function TechnicalIndicatorPane(props) {
    var _this;

    _classCallCheck(this, TechnicalIndicatorPane);

    _this = _super.call(this, props);
    var technicalIndicatorType = props.technicalIndicatorType || MACD;

    _this.setTechnicalIndicatorType(technicalIndicatorType);

    return _this;
  }

  _createClass(TechnicalIndicatorPane, [{
    key: "_initBefore",
    value: function _initBefore(props) {
      this._tag = props.tag;
      this._yAxis = this._createYAxis(props);
    }
  }, {
    key: "_createYAxis",
    value: function _createYAxis(props) {
      return new YAxis(props.chartData, false, {
        technicalIndicator: this.technicalIndicator.bind(this),
        isTimeLine: this._isRealTime.bind(this)
      });
    }
  }, {
    key: "_createMainWidget",
    value: function _createMainWidget(container, props) {
      return new TechnicalIndicatorWidget({
        container: container,
        chartData: props.chartData,
        xAxis: props.xAxis,
        yAxis: this._yAxis,
        additionalDataProvider: {
          technicalIndicator: this.technicalIndicator.bind(this),
          tag: this.tag.bind(this)
        }
      });
    }
  }, {
    key: "_createYAxisWidget",
    value: function _createYAxisWidget(container, props) {
      return new YAxisWidget({
        container: container,
        chartData: props.chartData,
        yAxis: this._yAxis,
        additionalDataProvider: {
          technicalIndicator: this.technicalIndicator.bind(this),
          tag: this.tag.bind(this)
        }
      });
    }
  }, {
    key: "_isRealTime",
    value: function _isRealTime() {
      return false;
    }
  }, {
    key: "setHeight",
    value: function setHeight(height) {
      _get(_getPrototypeOf(TechnicalIndicatorPane.prototype), "setHeight", this).call(this, height);

      this._yAxis.setHeight(height);
    }
  }, {
    key: "setWidth",
    value: function setWidth(mainWidgetWidth, yAxisWidgetWidth) {
      _get(_getPrototypeOf(TechnicalIndicatorPane.prototype), "setWidth", this).call(this, mainWidgetWidth, yAxisWidgetWidth);

      this._yAxis.setWidth(yAxisWidgetWidth);
    }
  }, {
    key: "computeAxis",
    value: function computeAxis() {
      this._yAxis.calcMinMaxValue();

      this._yAxis.computeAxis();
    }
  }, {
    key: "getSelfAxisWidth",
    value: function getSelfAxisWidth() {
      return this._yAxis.getSelfWidth(this._technicalIndicator);
    }
    /**
     * 获取标识
     * @returns {string}
     */

  }, {
    key: "tag",
    value: function tag() {
      return this._tag;
    }
  }, {
    key: "yAxis",
    value: function yAxis() {
      return this._yAxis;
    }
    /**
     * 获取技术指标
     * @returns {string}
     */

  }, {
    key: "technicalIndicator",
    value: function technicalIndicator() {
      return this._technicalIndicator;
    }
    /**
     * 设置技术指标类型
     * @param technicalIndicatorType
     */

  }, {
    key: "setTechnicalIndicatorType",
    value: function setTechnicalIndicatorType(technicalIndicatorType) {
      var _this$_chartData$tech = this._chartData.technicalIndicator(technicalIndicatorType),
          TechnicalIndicator$1 = _this$_chartData$tech.structure;

      if (!this._technicalIndicator && !TechnicalIndicator$1 || this._technicalIndicator && this._technicalIndicator.name === technicalIndicatorType) {
        return;
      }

      if (TechnicalIndicator$1) {
        this._technicalIndicator = new TechnicalIndicator$1();
      } else {
        this._technicalIndicator = new TechnicalIndicator({});
      }

      this._chartData.calcTechnicalIndicator(this);
    }
  }]);

  return TechnicalIndicatorPane;
}(Pane);

var CandleStickView = /*#__PURE__*/function (_TechnicalIndicatorVi) {
  _inherits(CandleStickView, _TechnicalIndicatorVi);

  var _super = _createSuper(CandleStickView);

  function CandleStickView() {
    _classCallCheck(this, CandleStickView);

    return _super.apply(this, arguments);
  }

  _createClass(CandleStickView, [{
    key: "_draw",
    value: function _draw() {
      this._drawGrid();

      if (this._additionalDataProvider.chartType() === ChartType.REAL_TIME) {
        this._drawRealTime();
      } else {
        this._drawCandleStick();

        this._drawTechnicalIndicator();

        this._drawHighestPriceMark();

        this._drawLowestPriceMark();
      }

      this._drawLastPriceLine();
    }
    /**
     * 绘制分时图
     * @private
     */

  }, {
    key: "_drawRealTime",
    value: function _drawRealTime() {
      var _this = this;

      var timeLinePoints = [];
      var timeLineAreaPoints = [];
      var averageLinePoints = [];

      var from = this._chartData.from();

      var technicalIndicator = this._additionalDataProvider.technicalIndicator();

      var technicalIndicatorResult = technicalIndicator.result;

      var onDrawing = function onDrawing(x, i, kLineData, halfBarSpace) {
        var technicalIndicatorData = technicalIndicatorResult[i] || {};
        var average = technicalIndicatorData.average || 0;

        var closeY = _this._yAxis.convertToPixel(kLineData.close);

        var averageY = _this._yAxis.convertToPixel(average);

        averageLinePoints.push({
          x: x,
          y: averageY
        });

        if (i === from) {
          var startX = x - halfBarSpace;
          timeLineAreaPoints.push({
            x: startX,
            y: _this._height
          });
          timeLineAreaPoints.push({
            x: startX,
            y: closeY
          });
          timeLinePoints.push({
            x: startX,
            y: closeY
          });
        }

        timeLinePoints.push({
          x: x,
          y: closeY
        });
        timeLineAreaPoints.push({
          x: x,
          y: closeY
        });
      };

      var onDrawEnd = function onDrawEnd() {
        var areaPointLength = timeLineAreaPoints.length;

        if (areaPointLength > 0) {
          var lastPoint = timeLineAreaPoints[areaPointLength - 1];
          var halfBarSpace = _this._chartData.barSpace() / 2;
          var endX = lastPoint.x + halfBarSpace;
          timeLinePoints.push({
            x: endX,
            y: lastPoint.y
          });
          timeLineAreaPoints.push({
            x: endX,
            y: lastPoint.y
          });
          timeLineAreaPoints.push({
            x: endX,
            y: _this._height
          });
        }

        var realTime = _this._chartData.styleOptions().realTime;

        var timeLine = realTime.timeLine;

        if (timeLinePoints.length > 0) {
          // 绘制分时线
          _this._ctx.lineWidth = timeLine.size;
          _this._ctx.strokeStyle = timeLine.color;
          drawLine(_this._ctx, function () {
            _this._ctx.beginPath();

            _this._ctx.moveTo(timeLinePoints[0].x, timeLinePoints[0].y);

            for (var i = 1; i < timeLinePoints.length; i++) {
              _this._ctx.lineTo(timeLinePoints[i].x, timeLinePoints[i].y);
            }

            _this._ctx.stroke();

            _this._ctx.closePath();
          });
        }

        if (timeLineAreaPoints.length > 0) {
          // 绘制分时线填充区域
          _this._ctx.fillStyle = timeLine.areaFillColor;

          _this._ctx.beginPath();

          _this._ctx.moveTo(timeLineAreaPoints[0].x, timeLineAreaPoints[0].y);

          for (var i = 1; i < timeLineAreaPoints.length; i++) {
            _this._ctx.lineTo(timeLineAreaPoints[i].x, timeLineAreaPoints[i].y);
          }

          _this._ctx.closePath();

          _this._ctx.fill();
        }

        var averageLine = realTime.averageLine;

        if (averageLine.display && averageLinePoints.length > 0) {
          // 绘制均线
          _this._ctx.lineWidth = averageLine.size;
          _this._ctx.strokeStyle = averageLine.color;
          drawLine(_this._ctx, function () {
            _this._ctx.beginPath();

            _this._ctx.moveTo(averageLinePoints[0].x, averageLinePoints[0].y);

            for (var _i = 1; _i < averageLinePoints.length; _i++) {
              _this._ctx.lineTo(averageLinePoints[_i].x, averageLinePoints[_i].y);
            }

            _this._ctx.stroke();

            _this._ctx.closePath();
          });
        }
      };

      this._drawGraphics(onDrawing, onDrawEnd);
    }
    /**
     * 绘制蜡烛
     * @private
     */

  }, {
    key: "_drawCandleStick",
    value: function _drawCandleStick() {
      var _this2 = this;

      var candleStickOptions = this._chartData.styleOptions().candleStick;

      this._drawGraphics(function (x, i, kLineData, halfBarSpace, barSpace) {
        _this2._drawCandleStickBar(x, halfBarSpace, barSpace, kLineData, candleStickOptions.bar, candleStickOptions.bar.style);
      });
    }
    /**
     * 渲染最高价标记
     */

  }, {
    key: "_drawHighestPriceMark",
    value: function _drawHighestPriceMark() {
      var priceMarkOptions = this._chartData.styleOptions().candleStick.priceMark;

      var highestPriceMarkOptions = priceMarkOptions.high;

      if (!priceMarkOptions.display || !highestPriceMarkOptions.display) {
        return;
      }

      var dataList = this._chartData.dataList();

      var to = this._chartData.to();

      var highestPrice = -Infinity;
      var highestPos = -1;

      for (var i = this._chartData.from(); i < to; i++) {
        var high = formatValue(dataList[i], 'high', -Infinity);

        if (high > highestPrice) {
          highestPrice = high;
          highestPos = i;
        }
      }

      if (highestPrice !== -Infinity) {
        this._drawLowestHighestPriceMark(highestPriceMarkOptions, highestPos, highestPrice, true);
      }
    }
    /**
     * 绘制最低价标记
     */

  }, {
    key: "_drawLowestPriceMark",
    value: function _drawLowestPriceMark() {
      var priceMarkOptions = this._chartData.styleOptions().candleStick.priceMark;

      var lowestPriceMarkOptions = priceMarkOptions.low;

      if (!priceMarkOptions.display || !lowestPriceMarkOptions.display) {
        return;
      }

      var dataList = this._chartData.dataList();

      var to = this._chartData.to();

      var lowestPrice = Infinity;
      var lowestPos = -1;

      for (var i = this._chartData.from(); i < to; i++) {
        var low = formatValue(dataList[i], 'low', Infinity);

        if (low < lowestPrice) {
          lowestPrice = low;
          lowestPos = i;
        }
      }

      if (lowestPrice !== Infinity) {
        this._drawLowestHighestPriceMark(lowestPriceMarkOptions, lowestPos, lowestPrice);
      }
    }
    /**
     * 渲染最高最低价格标记
     * @param priceMarkOptions
     * @param pricePos
     * @param price
     * @param isHigh
     */

  }, {
    key: "_drawLowestHighestPriceMark",
    value: function _drawLowestHighestPriceMark(priceMarkOptions, pricePos, price, isHigh) {
      var _this3 = this;

      var pricePrecision = this._chartData.pricePrecision();

      var priceY = this._yAxis.convertToPixel(price);

      var startX = this._xAxis.convertToPixel(pricePos);

      var startY = priceY + (isHigh ? -2 : 2);
      this._ctx.textAlign = 'left';
      this._ctx.lineWidth = 1;
      this._ctx.strokeStyle = priceMarkOptions.color;
      this._ctx.fillStyle = priceMarkOptions.color;
      drawLine(this._ctx, function () {
        _this3._ctx.beginPath();

        _this3._ctx.moveTo(startX, startY);

        _this3._ctx.lineTo(startX - 2, startY + (isHigh ? -2 : 2));

        _this3._ctx.stroke();

        _this3._ctx.closePath();

        _this3._ctx.beginPath();

        _this3._ctx.moveTo(startX, startY);

        _this3._ctx.lineTo(startX + 2, startY + (isHigh ? -2 : 2));

        _this3._ctx.stroke();

        _this3._ctx.closePath();
      }); // 绘制竖线

      var y = startY + (isHigh ? -5 : 5);
      drawVerticalLine(this._ctx, startX, startY, y);
      drawHorizontalLine(this._ctx, y, startX, startX + 5);
      this._ctx.font = getFont(priceMarkOptions.textSize, priceMarkOptions.textWeight, priceMarkOptions.textFamily);
      var text = formatPrecision(price, pricePrecision);
      this._ctx.textBaseline = 'middle';

      this._ctx.fillText(text, startX + 5 + priceMarkOptions.textMargin, y);
    }
    /**
     * 绘制最新价线
     * @private
     */

  }, {
    key: "_drawLastPriceLine",
    value: function _drawLastPriceLine() {
      var dataList = this._chartData.dataList();

      var dataSize = dataList.length;

      var priceMark = this._chartData.styleOptions().candleStick.priceMark;

      var lastPriceMark = priceMark.last;

      if (!priceMark.display || !lastPriceMark.display || !lastPriceMark.line.display || dataSize === 0) {
        return;
      }

      var kLineData = dataList[dataSize - 1];
      var close = kLineData.close;
      var open = kLineData.open;

      var priceY = this._yAxis.convertToPixel(close);

      priceY = +Math.max(this._height * 0.05, Math.min(priceY, this._height * 0.98)).toFixed(0);
      var color;

      if (close > open) {
        color = lastPriceMark.upColor;
      } else if (close < open) {
        color = lastPriceMark.downColor;
      } else {
        color = lastPriceMark.noChangeColor;
      }

      var priceMarkLine = lastPriceMark.line;

      this._ctx.save();

      this._ctx.strokeStyle = color;
      this._ctx.lineWidth = priceMarkLine.size;

      if (priceMarkLine.style === LineStyle.DASH) {
        this._ctx.setLineDash(priceMarkLine.dashValue);
      }

      drawHorizontalLine(this._ctx, priceY, 0, this._width);

      this._ctx.restore();
    }
  }]);

  return CandleStickView;
}(TechnicalIndicatorView);

var CandleStickFloatLayerView = /*#__PURE__*/function (_TechnicalIndicatorFl) {
  _inherits(CandleStickFloatLayerView, _TechnicalIndicatorFl);

  var _super = _createSuper(CandleStickFloatLayerView);

  function CandleStickFloatLayerView() {
    _classCallCheck(this, CandleStickFloatLayerView);

    return _super.apply(this, arguments);
  }

  _createClass(CandleStickFloatLayerView, [{
    key: "_drawPrompt",
    value: function _drawPrompt(kLineData, technicalIndicatorData, realDataPos, realDataPosX, technicalIndicator, isDrawValueIndicator) {
      var options = this._chartData.styleOptions();

      var floatLayerPromptCandleStick = options.floatLayer.prompt.candleStick;

      var candleStickPromptData = this._getCandleStickPromptData(kLineData, options.candleStick, floatLayerPromptCandleStick);

      if (floatLayerPromptCandleStick.showType === FloatLayerPromptCandleStickTextDisplayType.STANDARD) {
        this._drawCandleStickStandardPromptText(floatLayerPromptCandleStick, candleStickPromptData);

        if (this._additionalDataProvider.chartType() === ChartType.CANDLE_STICK) {
          this._drawTechnicalIndicatorPrompt(technicalIndicatorData, realDataPos, realDataPosX, technicalIndicator, isDrawValueIndicator, floatLayerPromptCandleStick.text.size + floatLayerPromptCandleStick.text.marginTop);
        }
      } else {
        var data = getTechnicalIndicatorInfo(technicalIndicatorData, technicalIndicator, this._yAxis);

        this._drawCandleStickRectPromptText(realDataPosX, floatLayerPromptCandleStick, candleStickPromptData, data);

        if (isDrawValueIndicator) {
          var technicalIndicatorOptions = this._chartData.styleOptions().technicalIndicator;

          this._drawTechnicalIndicatorPromptPoint(realDataPos, realDataPosX, technicalIndicator, data.values, technicalIndicatorOptions.line.colors);
        }
      }
    }
  }, {
    key: "_drawCandleStickStandardPromptText",
    value: function _drawCandleStickStandardPromptText(floatLayerPromptCandleStick, candleStickPromptData) {
      var _this = this;

      var values = candleStickPromptData;
      var textMarginLeft = floatLayerPromptCandleStick.text.marginLeft;
      var textMarginRight = floatLayerPromptCandleStick.text.marginRight;
      var textSize = floatLayerPromptCandleStick.text.size;
      var textColor = floatLayerPromptCandleStick.text.color;
      var labels = floatLayerPromptCandleStick.labels;
      this._ctx.textBaseline = 'top';
      this._ctx.font = getFont(textSize, floatLayerPromptCandleStick.text.weight, floatLayerPromptCandleStick.text.family);
      var labelX = textMarginLeft;
      var labelY = floatLayerPromptCandleStick.text.marginTop;
      labels.forEach(function (label, i) {
        var labelText = label ? "".concat(label, ": ") : '';
        var labelWidth = calcTextWidth(_this._ctx, labelText);
        _this._ctx.fillStyle = textColor;

        _this._ctx.fillText(labelText, labelX, labelY);

        labelX += labelWidth;
        var value = values[i] || 'n/a';
        var valueText;

        if (isObject(value)) {
          valueText = value.value || 'n/a';
          _this._ctx.fillStyle = value.color || textColor;
        } else {
          _this._ctx.fillStyle = textColor;
          valueText = value;
        }

        var textWidth = calcTextWidth(_this._ctx, valueText);

        _this._ctx.fillText(valueText, labelX, labelY);

        labelX += textWidth + textMarginLeft + textMarginRight;
      });
    }
  }, {
    key: "_drawCandleStickRectPromptText",
    value: function _drawCandleStickRectPromptText(x, floatLayerPromptCandleStick, candleStickPromptData, technicalIndicatorPromptData) {
      var _this2 = this;

      var baseLabels = floatLayerPromptCandleStick.labels;
      var baseValues = candleStickPromptData;
      var baseTextMarginLeft = floatLayerPromptCandleStick.text.marginLeft;
      var baseTextMarginRight = floatLayerPromptCandleStick.text.marginRight;
      var baseTextMarginTop = floatLayerPromptCandleStick.text.marginTop;
      var baseTextMarginBottom = floatLayerPromptCandleStick.text.marginBottom;
      var baseTextSize = floatLayerPromptCandleStick.text.size;
      var baseTextColor = floatLayerPromptCandleStick.text.color;

      this._ctx.save();

      this._ctx.textBaseline = 'top';
      this._ctx.font = getFont(baseTextSize, floatLayerPromptCandleStick.text.weight, floatLayerPromptCandleStick.text.family);
      var maxLabelWidth = 0;
      baseLabels.forEach(function (label, i) {
        var value = baseValues[i] || 'n/a';
        var v = value;

        if (isObject(value)) {
          v = value.value || 'n/a';
        }

        var text = "".concat(label, ": ").concat(v);
        var labelWidth = calcTextWidth(_this2._ctx, text) + baseTextMarginLeft + baseTextMarginRight;
        maxLabelWidth = Math.max(maxLabelWidth, labelWidth);
      });
      var rect = floatLayerPromptCandleStick.rect;
      var rectBorderSize = rect.borderSize;
      var rectPaddingLeft = rect.paddingLeft;
      var rectPaddingRight = rect.paddingRight;
      var rectPaddingTop = rect.paddingTop;
      var rectPaddingBottom = rect.paddingBottom;
      var rectLeft = rect.left;
      var rectRight = rect.right;
      var rectHeight = rectBorderSize * 2 + rectPaddingTop + rectPaddingBottom + (baseTextMarginBottom + baseTextMarginTop + baseTextSize) * baseLabels.length;

      var floatLayerPromptTechnicalIndicator = this._chartData.styleOptions().floatLayer.prompt.technicalIndicator;

      var indicatorTextMarginLeft = floatLayerPromptTechnicalIndicator.text.marginLeft;
      var indicatorTextMarginRight = floatLayerPromptTechnicalIndicator.text.marginRight;
      var indicatorTextMarginTop = floatLayerPromptTechnicalIndicator.text.marginTop;
      var indicatorTextMarginBottom = floatLayerPromptTechnicalIndicator.text.marginBottom;
      var indicatorTextSize = floatLayerPromptTechnicalIndicator.text.size;
      var isCandleStick = this._additionalDataProvider.chartType() === ChartType.CANDLE_STICK;
      var indicatorLabels = technicalIndicatorPromptData.labels || [];
      var indicatorValues = technicalIndicatorPromptData.values || [];

      if (isCandleStick) {
        this._ctx.font = getFont(indicatorTextSize, floatLayerPromptTechnicalIndicator.text.weight, floatLayerPromptTechnicalIndicator.text.family);
        indicatorLabels.forEach(function (label, i) {
          var v = indicatorValues[i].value || 'n/a';
          var text = "".concat(label, ": ").concat(v);
          var labelWidth = calcTextWidth(_this2._ctx, text) + indicatorTextMarginLeft + indicatorTextMarginRight;
          maxLabelWidth = Math.max(maxLabelWidth, labelWidth);
        });
        rectHeight += (indicatorTextMarginTop + indicatorTextMarginBottom + indicatorTextSize) * indicatorLabels.length;
      }

      var rectWidth = rectBorderSize * 2 + maxLabelWidth + rectPaddingLeft + rectPaddingRight;
      var centerX = this._width / 2;
      var rectX;

      if (x < centerX) {
        rectX = this._width - rectRight - rectWidth;
      } else {
        rectX = rectLeft;
      }

      var rectY = rect.top;
      var radius = rect.borderRadius;
      this._ctx.lineWidth = rectBorderSize;
      this._ctx.strokeStyle = rect.borderColor;
      this._ctx.fillStyle = rect.fillColor;

      this._drawRoundRect(rectX, rectY, rectWidth, rectHeight, radius);

      this._ctx.stroke();

      this._drawRoundRect(rectX, rectY, rectWidth, rectHeight, radius);

      this._ctx.fill();

      var baseLabelX = rectX + rectBorderSize + rectPaddingLeft + baseTextMarginLeft;
      var labelY = rectY + rectBorderSize + rectPaddingTop; // 开始渲染基础数据文字

      this._ctx.font = getFont(baseTextSize, floatLayerPromptCandleStick.text.weight, floatLayerPromptCandleStick.text.family);
      baseLabels.forEach(function (label, i) {
        labelY += baseTextMarginTop;
        _this2._ctx.textAlign = 'left';
        _this2._ctx.fillStyle = baseTextColor;

        _this2._ctx.fillText("".concat(label, ": "), baseLabelX, labelY);

        var value = baseValues[i] || 'n/a';
        var text;
        _this2._ctx.fillStyle = value.color || baseTextColor;

        if (isObject(value)) {
          text = value.value || 'n/a';
        } else {
          text = value;
        }

        _this2._ctx.textAlign = 'right';

        _this2._ctx.fillText(text, rectX + rectWidth - rectBorderSize - baseTextMarginRight - rectPaddingRight, labelY);

        labelY += baseTextSize + baseTextMarginBottom;
      });

      if (isCandleStick) {
        // 开始渲染指标数据文字
        var technicalIndicatorOptions = this._chartData.styleOptions().technicalIndicator;

        var colors = technicalIndicatorOptions.line.colors;
        var indicatorLabelX = rectX + rectBorderSize + rectPaddingLeft + indicatorTextMarginLeft;
        var colorSize = colors.length;
        this._ctx.font = getFont(indicatorTextSize, floatLayerPromptTechnicalIndicator.text.weight, floatLayerPromptTechnicalIndicator.text.family);
        indicatorLabels.forEach(function (label, i) {
          labelY += indicatorTextMarginTop;
          _this2._ctx.textAlign = 'left';
          _this2._ctx.fillStyle = colors[i % colorSize] || technicalIndicatorOptions.text.color;

          _this2._ctx.fillText("".concat(label.toUpperCase(), ": "), indicatorLabelX, labelY);

          _this2._ctx.textAlign = 'right';

          _this2._ctx.fillText(indicatorValues[i].value || 'n/a', rectX + rectWidth - rectBorderSize - indicatorTextMarginRight - rectPaddingRight, labelY);

          labelY += indicatorTextSize + indicatorTextMarginBottom;
        });
      }

      this._ctx.restore();
    }
    /**
     * 渲染圆角矩形
     * @param x
     * @param y
     * @param w
     * @param h
     * @param r
     */

  }, {
    key: "_drawRoundRect",
    value: function _drawRoundRect(x, y, w, h, r) {
      this._ctx.beginPath();

      this._ctx.moveTo(x + r, y);

      this._ctx.arcTo(x + w, y, x + w, y + h, r);

      this._ctx.arcTo(x + w, y + h, x, y + h, r);

      this._ctx.arcTo(x, y + h, x, y, r);

      this._ctx.arcTo(x, y, x + w, y, r);

      this._ctx.closePath();
    }
    /**
     * 获取蜡烛提示数据
     * @param kLineData
     * @param candleStick
     * @param floatLayerPromptCandleStick
     * @returns {*}
     * @private
     */

  }, {
    key: "_getCandleStickPromptData",
    value: function _getCandleStickPromptData(kLineData, candleStick, floatLayerPromptCandleStick) {
      var _this3 = this;

      var baseValues = floatLayerPromptCandleStick.values;
      var values = [];

      if (baseValues) {
        if (isFunction(baseValues)) {
          values = baseValues(kLineData, candleStick, floatLayerPromptCandleStick) || [];
        } else {
          values = baseValues;
        }
      } else {
        var pricePrecision = this._chartData.pricePrecision();

        var volumePrecision = this._chartData.volumePrecision();

        values = [formatValue(kLineData, 'timestamp'), formatValue(kLineData, 'open'), formatValue(kLineData, 'close'), formatValue(kLineData, 'high'), formatValue(kLineData, 'low'), formatValue(kLineData, 'volume')];
        values.forEach(function (value, index) {
          switch (index) {
            case 0:
              {
                values[index] = formatDate(_this3._chartData.dateTimeFormat(), value, 'YYYY-MM-DD hh:mm');
                break;
              }

            case values.length - 1:
              {
                values[index] = formatBigNumber(formatPrecision(value, volumePrecision));
                break;
              }

            default:
              {
                values[index] = formatPrecision(value, pricePrecision);
                break;
              }
          }
        });
      }

      return values;
    }
  }]);

  return CandleStickFloatLayerView;
}(TechnicalIndicatorFloatLayerView);

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
 * @param size
 * @param isPriceChannelLine
 * @returns {Array}
 */

function getParallelLines(points, size, isPriceChannelLine) {
  var lines = [];

  if (points.length > 1) {
    if (points[0].x === points[1].x) {
      var startY = 0;
      var endY = size.height;
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
      var startX = 0;
      var endX = size.width;

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
 * @param size
 */

function getFibonacciLines(points, size) {
  var lines = [];

  if (points.length > 0) {
    var startX = 0;
    var endX = size.width;
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

/**
 * The file comes from tradingview/lightweight-charts
 * https://www.tradingview.com/
 * Convert files from typescript to javascript.
 * Modified the class name.
 * The use of the source code of this file is also subject to the terms
 * and consitions of the license of "lightweight-charts" (Apache License V2, see
 * </licenses/LICENSE-lightweight-charts>).
 */
var MouseEventButton = {
  LEFT: 0,
  RIGHT: 2
};
var DELAY_RESET_CLICK = 500;
var DELAY_LONG_TAG = 600;

function getBoundingClientRect(element) {
  return element.getBoundingClientRect() || {
    left: 0,
    top: 0
  };
}

function isTouchEvent(event) {
  return Boolean(event.touches);
}

function preventDefault(event) {
  if (event.cancelable) {
    event.preventDefault();
  }
}

function checkTouchEvents() {
  if ('ontouchstart' in window) {
    return true;
  }

  return Boolean(window.DocumentTouch && document instanceof window.DocumentTouch);
}

var touch = !!navigator.maxTouchPoints || !!navigator.msMaxTouchPoints || checkTouchEvents();
var mobileTouch = 'onorientationchange' in window && touch;

function getDistance(p1, p2) {
  var xDiff = p1.clientX - p2.clientX;
  var yDiff = p1.clientY - p2.clientY;
  return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
}

var EventType = {
  MOUSE: 'mouse',
  TOUCH: 'touch'
};

var EventBase = /*#__PURE__*/function () {
  function EventBase(target, eventHandler, options) {
    _classCallCheck(this, EventBase);

    this._target = target;
    this._handler = eventHandler;
    this._options = options;
    this._clickCount = 0;
    this._clickTimeoutId = null;
    this._longTapTimeoutId = null;
    this._longTapActive = false;
    this._mouseMoveStartPosition = null;
    this._moveExceededManhattanDistance = false;
    this._cancelClick = false;
    this._unsubscribeOutsideEvents = null;
    this._unsubscribeMousemove = null;
    this._unsubscribeRoot = null;
    this._startPinchMiddlePoint = null;
    this._startPinchDistance = 0;
    this._pinchPrevented = false;
    this._preventDragProcess = false;
    this._mousePressed = false;

    this._init();
  }

  _createClass(EventBase, [{
    key: "destroy",
    value: function destroy() {
      if (this._unsubscribeOutsideEvents !== null) {
        this._unsubscribeOutsideEvents();

        this._unsubscribeOutsideEvents = null;
      }

      if (this._unsubscribeMousemove !== null) {
        this._unsubscribeMousemove();

        this._unsubscribeMousemove = null;
      }

      if (this._unsubscribeRoot !== null) {
        this._unsubscribeRoot();

        this._unsubscribeRoot = null;
      }

      this._clearLongTapTimeout();

      this._resetClickTimeout();
    }
  }, {
    key: "_mouseEnterHandler",
    value: function _mouseEnterHandler(enterEvent) {
      var _this = this;

      if (this._unsubscribeMousemove) {
        this._unsubscribeMousemove();
      }

      {
        var boundMouseMoveHandler = this._mouseMoveHandler.bind(this);

        var boundMouseWheelHandler = this._mouseWheelHandler.bind(this);

        this._unsubscribeMousemove = function () {
          _this._target.removeEventListener('mousemove', boundMouseMoveHandler);

          _this._target.removeEventListener('wheel', boundMouseWheelHandler);
        };

        this._target.addEventListener('mousemove', boundMouseMoveHandler);

        this._target.addEventListener('wheel', boundMouseWheelHandler, {
          passive: false
        });
      }

      if (isTouchEvent(enterEvent)) {
        this._mouseMoveHandler(enterEvent);
      }

      var compatEvent = this._makeCompatEvent(enterEvent);

      this._processEvent(compatEvent, this._handler.mouseEnterEvent);
    }
  }, {
    key: "_resetClickTimeout",
    value: function _resetClickTimeout() {
      if (this._clickTimeoutId !== null) {
        clearTimeout(this._clickTimeoutId);
      }

      this._clickCount = 0;
      this._clickTimeoutId = null;
    }
  }, {
    key: "_mouseMoveHandler",
    value: function _mouseMoveHandler(moveEvent) {
      if (this._mousePressed && !isTouchEvent(moveEvent)) {
        return;
      }

      var compatEvent = this._makeCompatEvent(moveEvent);

      this._processEvent(compatEvent, this._handler.mouseMoveEvent);
    }
  }, {
    key: "_mouseWheelHandler",
    value: function _mouseWheelHandler(wheelEvent) {
      var compatEvent = this._makeCompatEvent(wheelEvent);

      wheelEvent.localX = compatEvent.localX;
      wheelEvent.localY = compatEvent.localY;

      this._processEvent(wheelEvent, this._handler.mouseWheelEvent);
    }
  }, {
    key: "_mouseMoveWithDownHandler",
    value: function _mouseMoveWithDownHandler(moveEvent) {
      if ('button' in moveEvent && moveEvent.button !== MouseEventButton.LEFT) {
        return;
      }

      if (this._startPinchMiddlePoint !== null) {
        return;
      }

      var isTouch = isTouchEvent(moveEvent);

      if (this._preventDragProcess && isTouch) {
        return;
      }

      this._pinchPrevented = true;

      var compatEvent = this._makeCompatEvent(moveEvent);

      var startMouseMovePos = this._mouseMoveStartPosition;
      var xOffset = Math.abs(startMouseMovePos.x - compatEvent.pageX);
      var yOffset = Math.abs(startMouseMovePos.y - compatEvent.pageY);
      var moveExceededManhattanDistance = xOffset + yOffset > 5;

      if (!moveExceededManhattanDistance && isTouch) {
        return;
      }

      if (moveExceededManhattanDistance && !this._moveExceededManhattanDistance && isTouch) {
        // vertical drag is more important than horizontal drag
        // because we scroll the page vertically often than horizontally
        var correctedXOffset = xOffset * 0.5; // a drag can be only if touch page scroll isn't allowed

        var isVertDrag = yOffset >= correctedXOffset && !this._options.treatVertTouchDragAsPageScroll;
        var isHorzDrag = correctedXOffset > yOffset && !this._options.treatHorzTouchDragAsPageScroll; // if drag event happened then we should revert preventDefault state to original one
        // and try to process the drag event
        // else we shouldn't prevent default of the event and ignore processing the drag event

        if (!isVertDrag && !isHorzDrag) {
          this._preventDragProcess = true;
        }
      }

      if (moveExceededManhattanDistance) {
        this._moveExceededManhattanDistance = true; // if manhattan distance is more that 5 - we should cancel click event

        this._cancelClick = true;

        if (isTouch) {
          this._clearLongTapTimeout();
        }
      }

      if (!this._preventDragProcess) {
        this._processEvent(compatEvent, this._handler.pressedMouseMoveEvent); // we should prevent default in case of touch only
        // to prevent scroll of the page


        if (isTouch) {
          preventDefault(moveEvent);
        }
      }
    }
  }, {
    key: "_mouseUpHandler",
    value: function _mouseUpHandler(mouseUpEvent) {
      if ('button' in mouseUpEvent && mouseUpEvent.button !== MouseEventButton.LEFT) {
        return;
      }

      var compatEvent = this._makeCompatEvent(mouseUpEvent);

      this._clearLongTapTimeout();

      this._mouseMoveStartPosition = null;
      this._mousePressed = false;

      if (this._unsubscribeRoot) {
        this._unsubscribeRoot();

        this._unsubscribeRoot = null;
      }

      if (isTouchEvent(mouseUpEvent)) {
        this._mouseLeaveHandler(mouseUpEvent);
      }

      this._processEvent(compatEvent, this._handler.mouseUpEvent);

      ++this._clickCount;

      if (this._clickTimeoutId && this._clickCount > 1) {
        this._processEvent(compatEvent, this._handler.mouseDoubleClickEvent);

        this._resetClickTimeout();
      } else {
        if (!this._cancelClick) {
          this._processEvent(compatEvent, this._handler.mouseClickEvent);
        }
      } // prevent safari's dblclick-to-zoom
      // we handle mouseDoubleClickEvent here ourself


      if (isTouchEvent(mouseUpEvent)) {
        preventDefault(mouseUpEvent);

        this._mouseLeaveHandler(mouseUpEvent);

        if (mouseUpEvent.touches.length === 0) {
          this._longTapActive = false;
        }
      }
    }
  }, {
    key: "_clearLongTapTimeout",
    value: function _clearLongTapTimeout() {
      if (this._longTapTimeoutId === null) {
        return;
      }

      clearTimeout(this._longTapTimeoutId);
      this._longTapTimeoutId = null;
    }
  }, {
    key: "_mouseDownHandler",
    value: function _mouseDownHandler(downEvent) {
      if ('button' in downEvent && downEvent.button !== MouseEventButton.LEFT && downEvent.button !== MouseEventButton.RIGHT) {
        return;
      }

      var compatEvent = this._makeCompatEvent(downEvent);

      if ('button' in downEvent && downEvent.button === MouseEventButton.RIGHT) {
        this._processEvent(compatEvent, this._handler.mouseRightDownEvent);

        return;
      }

      this._cancelClick = false;
      this._moveExceededManhattanDistance = false;
      this._preventDragProcess = false;

      if (isTouchEvent(downEvent)) {
        this._mouseEnterHandler(downEvent);
      }

      this._mouseMoveStartPosition = {
        x: compatEvent.pageX,
        y: compatEvent.pageY
      };

      if (this._unsubscribeRoot) {
        this._unsubscribeRoot();

        this._unsubscribeRoot = null;
      }

      {
        var boundMouseMoveWithDownHandler = this._mouseMoveWithDownHandler.bind(this);

        var boundMouseUpHandler = this._mouseUpHandler.bind(this);

        var rootElement = this._target.ownerDocument.documentElement;

        this._unsubscribeRoot = function () {
          rootElement.removeEventListener('touchmove', boundMouseMoveWithDownHandler);
          rootElement.removeEventListener('touchend', boundMouseUpHandler);
          rootElement.removeEventListener('mousemove', boundMouseMoveWithDownHandler);
          rootElement.removeEventListener('mouseup', boundMouseUpHandler);
        };

        rootElement.addEventListener('touchmove', boundMouseMoveWithDownHandler, {
          passive: false
        });
        rootElement.addEventListener('touchend', boundMouseUpHandler, {
          passive: false
        });

        this._clearLongTapTimeout();

        if (isTouchEvent(downEvent) && downEvent.touches.length === 1) {
          this._longTapTimeoutId = setTimeout(this._longTapHandler.bind(this, downEvent), DELAY_LONG_TAG);
        } else {
          rootElement.addEventListener('mousemove', boundMouseMoveWithDownHandler);
          rootElement.addEventListener('mouseup', boundMouseUpHandler);
        }
      }
      this._mousePressed = true;

      this._processEvent(compatEvent, this._handler.mouseDownEvent);

      if (!this._clickTimeoutId) {
        this._clickCount = 0;
        this._clickTimeoutId = setTimeout(this._resetClickTimeout.bind(this), DELAY_RESET_CLICK);
      }
    }
  }, {
    key: "_init",
    value: function _init() {
      var _this2 = this;

      this._target.addEventListener('mouseenter', this._mouseEnterHandler.bind(this));

      this._target.addEventListener('touchcancel', this._clearLongTapTimeout.bind(this));

      {
        var doc = this._target.ownerDocument;

        var outsideHandler = function outsideHandler(event) {
          if (!_this2._handler.mouseDownOutsideEvent) {
            return;
          }

          if (event.target && _this2._target.contains(event.target)) {
            return;
          }

          _this2._handler.mouseDownOutsideEvent();
        };

        this._unsubscribeOutsideEvents = function () {
          doc.removeEventListener('mousedown', outsideHandler);
          doc.removeEventListener('touchstart', outsideHandler);
        };

        doc.addEventListener('mousedown', outsideHandler);
        doc.addEventListener('touchstart', outsideHandler, {
          passive: true
        });
      }

      this._target.addEventListener('mouseleave', this._mouseLeaveHandler.bind(this));

      this._target.addEventListener('touchstart', this._mouseDownHandler.bind(this), {
        passive: true
      });

      if (!mobileTouch) {
        this._target.addEventListener('mousedown', this._mouseDownHandler.bind(this));
      }

      this._initPinch(); // Hey mobile Safari, what's up?
      // If mobile Safari doesn't have any touchmove handler with passive=false
      // it treats a touchstart and the following touchmove events as cancelable=false,
      // so we can't prevent them (as soon we subscribe on touchmove inside handler of touchstart).
      // And we'll get scroll of the page along with chart's one instead of only chart's scroll.


      this._target.addEventListener('touchmove', function () {}, {
        passive: false
      });
    }
  }, {
    key: "_initPinch",
    value: function _initPinch() {
      var _this3 = this;

      if (this._handler.pinchStartEvent === undefined && this._handler.pinchEvent === undefined && this._handler.pinchEndEvent === undefined) {
        return;
      }

      this._target.addEventListener('touchstart', function (event) {
        return _this3._checkPinchState(event.touches);
      }, {
        passive: true
      });

      this._target.addEventListener('touchmove', function (event) {
        if (event.touches.length !== 2 || _this3._startPinchMiddlePoint === null) {
          return;
        }

        if (_this3._handler.pinchEvent !== undefined) {
          var currentDistance = getDistance(event.touches[0], event.touches[1]);
          var scale = currentDistance / _this3._startPinchDistance;

          _this3._handler.pinchEvent(_this3._startPinchMiddlePoint, scale);

          preventDefault(event);
        }
      }, {
        passive: false
      });

      this._target.addEventListener('touchend', function (event) {
        _this3._checkPinchState(event.touches);
      });
    }
  }, {
    key: "_checkPinchState",
    value: function _checkPinchState(touches) {
      if (touches.length === 1) {
        this._pinchPrevented = false;
      }

      if (touches.length !== 2 || this._pinchPrevented || this._longTapActive) {
        this._stopPinch();
      } else {
        this._startPinch(touches);
      }
    }
  }, {
    key: "_startPinch",
    value: function _startPinch(touches) {
      var box = getBoundingClientRect(this._target);
      this._startPinchMiddlePoint = {
        x: (touches[0].clientX - box.left + (touches[1].clientX - box.left)) / 2,
        y: (touches[0].clientY - box.top + (touches[1].clientY - box.top)) / 2
      };
      this._startPinchDistance = getDistance(touches[0], touches[1]);

      if (this._handler.pinchStartEvent !== undefined) {
        this._handler.pinchStartEvent();
      }

      this._clearLongTapTimeout();
    }
  }, {
    key: "_stopPinch",
    value: function _stopPinch() {
      if (this._startPinchMiddlePoint === null) {
        return;
      }

      this._startPinchMiddlePoint = null;

      if (this._handler.pinchEndEvent !== undefined) {
        this._handler.pinchEndEvent();
      }
    }
  }, {
    key: "_mouseLeaveHandler",
    value: function _mouseLeaveHandler(event) {
      if (this._unsubscribeMousemove) {
        this._unsubscribeMousemove();
      }

      var compatEvent = this._makeCompatEvent(event);

      this._processEvent(compatEvent, this._handler.mouseLeaveEvent);
    }
  }, {
    key: "_longTapHandler",
    value: function _longTapHandler(event) {
      var compatEvent = this._makeCompatEvent(event);

      this._processEvent(compatEvent, this._handler.longTapEvent);

      this._cancelClick = true; // long tap is active untill touchend event with 0 touches occured

      this._longTapActive = true;
    }
  }, {
    key: "_processEvent",
    value: function _processEvent(event, callback) {
      if (!callback) {
        return;
      }

      callback.call(this._handler, event);
    }
  }, {
    key: "_makeCompatEvent",
    value: function _makeCompatEvent(event) {
      // TouchEvent has no clientX/Y coordinates:
      // We have to use the last Touch instead
      var eventLike;

      if ('touches' in event && event.touches.length) {
        eventLike = event.touches[0];
      } else if ('changedTouches' in event && event.changedTouches.length) {
        eventLike = event.changedTouches[0];
      } else {
        eventLike = event;
      }

      var box = getBoundingClientRect(this._target);
      return {
        clientX: eventLike.clientX,
        clientY: eventLike.clientY,
        pageX: eventLike.pageX,
        pageY: eventLike.pageY,
        screenX: eventLike.screenX,
        screenY: eventLike.screenY,
        localX: eventLike.clientX - box.left,
        localY: eventLike.clientY - box.top,
        ctrlKey: event.ctrlKey,
        altKey: event.altKey,
        shiftKey: event.shiftKey,
        metaKey: event.metaKey,
        type: event.type.startsWith('mouse') ? EventType.MOUSE : EventType.TOUCH,
        target: eventLike.target,
        view: event.view
      };
    }
  }]);

  return EventBase;
}();

function isTouch(event) {
  return event.type === EventType.TOUCH;
}
function isMouse(event) {
  return event.type === EventType.MOUSE;
}

var EventHandler = /*#__PURE__*/function () {
  function EventHandler(chartData) {
    _classCallCheck(this, EventHandler);

    this._chartData = chartData;
    this._chartContentSize = {};
    this._paneContentSize = {};
  }

  _createClass(EventHandler, [{
    key: "_checkEventPointX",
    value: function _checkEventPointX(x) {
      return x > 0 && x < this._chartContentSize.contentRight - this._chartContentSize.contentLeft;
    }
  }, {
    key: "setChartContentSize",
    value: function setChartContentSize(chartContentSize) {
      this._chartContentSize = chartContentSize;
    }
  }, {
    key: "setPaneContentSize",
    value: function setPaneContentSize(paneContentSize) {
      this._paneContentSize = paneContentSize;
    }
  }]);

  return EventHandler;
}();

/**
 * 标记图形绘制步骤
 * @type {{STEP_3: *, STEP_DONE: *, STEP_1: *, STEP_2: *}}
 */

var GraphicMarkDrawStep = {
  STEP_1: 'step_1',
  STEP_2: 'step_2',
  STEP_3: 'step_3',
  STEP_DONE: 'step_done'
};

var GraphicMarkEventHandler = /*#__PURE__*/function (_EventHandler) {
  _inherits(GraphicMarkEventHandler, _EventHandler);

  var _super = _createSuper(GraphicMarkEventHandler);

  function GraphicMarkEventHandler(chartData, xAxis, yAxis) {
    var _this;

    _classCallCheck(this, GraphicMarkEventHandler);

    _this = _super.call(this, chartData);
    _this._xAxis = xAxis;
    _this._yAxis = yAxis; // 标记当没有画线时鼠标是否按下

    _this._noneGraphicMarkMouseDownFlag = false; // 用来记录当没有绘制标记图形时，鼠标操作后落点线上的数据

    _this._noneGraphicMarkMouseDownActiveData = {
      markKey: null,
      dataIndex: -1,
      onLine: false,
      onCircle: false,
      pointIndex: -1
    };
    return _this;
  }
  /**
   * 鼠标抬起事件
   * @param event
   */


  _createClass(GraphicMarkEventHandler, [{
    key: "mouseUpEvent",
    value: function mouseUpEvent(event) {
      this._chartData.setDragGraphicMarkFlag(false);

      this._noneGraphicMarkMouseDownFlag = false;
      this._noneGraphicMarkMouseDownActiveData = {
        markKey: null,
        dataIndex: -1,
        onLine: false,
        onCircle: false,
        pointIndex: -1
      };
    }
    /**
     * 鼠标按下事件
     * @param event
     */

  }, {
    key: "mouseDownEvent",
    value: function mouseDownEvent(event) {
      if (!this._checkEventPointX(event.localX) || !this._checkEventPointY(event.localY)) {
        return;
      }

      var point = {
        x: event.localX,
        y: event.localY
      };

      this._chartData.setGraphicMarkPoint(point);

      var graphicMarkType = this._chartData.graphicMarkType();

      switch (graphicMarkType) {
        case GraphicMarkType.HORIZONTAL_STRAIGHT_LINE:
        case GraphicMarkType.VERTICAL_STRAIGHT_LINE:
        case GraphicMarkType.STRAIGHT_LINE:
        case GraphicMarkType.HORIZONTAL_RAY_LINE:
        case GraphicMarkType.VERTICAL_RAY_LINE:
        case GraphicMarkType.RAY_LINE:
        case GraphicMarkType.HORIZONTAL_SEGMENT_LINE:
        case GraphicMarkType.VERTICAL_SEGMENT_LINE:
        case GraphicMarkType.SEGMENT_LINE:
        case GraphicMarkType.PRICE_LINE:
        case GraphicMarkType.FIBONACCI_LINE:
          {
            this._twoStepGraphicMarkMouseDown(event, graphicMarkType);

            break;
          }

        case GraphicMarkType.PRICE_CHANNEL_LINE:
        case GraphicMarkType.PARALLEL_STRAIGHT_LINE:
          {
            this._threeStepGraphicMarkMouseDown(event, graphicMarkType);

            break;
          }

        case GraphicMarkType.NONE:
          {
            this._noneGraphicMarkMouseLeftDown(event);

            break;
          }
      }
    }
  }, {
    key: "mouseRightDownEvent",
    value: function mouseRightDownEvent(event) {
      var graphicMarkType = this._chartData.graphicMarkType();

      if (graphicMarkType === GraphicMarkType.NONE) {
        this._findNoneGraphicMarkMouseDownActiveData(event);

        var markKey = this._noneGraphicMarkMouseDownActiveData.markKey;
        var dataIndex = this._noneGraphicMarkMouseDownActiveData.dataIndex;

        if (markKey && dataIndex !== -1) {
          var graphicMarkDatas = this._chartData.graphicMarkData();

          var graphicMarkData = graphicMarkDatas[markKey];
          graphicMarkData.splice(dataIndex, 1);
          graphicMarkDatas[markKey] = graphicMarkData;

          this._chartData.setGraphicMarkData(graphicMarkDatas);

          this.mouseUpEvent(event);
        }
      }
    }
    /**
     * 两步形成的标记图形鼠标按下处理
     * @param event
     * @param markKey
     */

  }, {
    key: "_twoStepGraphicMarkMouseDown",
    value: function _twoStepGraphicMarkMouseDown(event, markKey) {
      var _this2 = this;

      this._graphicMarkMouseDown(event, markKey, function (lastLineData) {
        switch (lastLineData.drawStep) {
          case GraphicMarkDrawStep.STEP_1:
            {
              lastLineData.drawStep = GraphicMarkDrawStep.STEP_2;
              break;
            }

          case GraphicMarkDrawStep.STEP_2:
            {
              lastLineData.drawStep = GraphicMarkDrawStep.STEP_DONE;

              _this2._chartData.setGraphicMarkType(GraphicMarkType.NONE);

              break;
            }
        }
      });
    }
    /**
     * 两个点形成的标记图形鼠标按下事件
     * @param event
     * @param markKey
     */

  }, {
    key: "_threeStepGraphicMarkMouseDown",
    value: function _threeStepGraphicMarkMouseDown(event, markKey) {
      var _this3 = this;

      this._graphicMarkMouseDown(event, markKey, function (lastLineData) {
        switch (lastLineData.drawStep) {
          case GraphicMarkDrawStep.STEP_1:
            {
              lastLineData.drawStep = GraphicMarkDrawStep.STEP_2;
              break;
            }

          case GraphicMarkDrawStep.STEP_2:
            {
              lastLineData.drawStep = GraphicMarkDrawStep.STEP_3;
              break;
            }

          case GraphicMarkDrawStep.STEP_3:
            {
              lastLineData.drawStep = GraphicMarkDrawStep.STEP_DONE;

              _this3._chartData.setGraphicMarkType(GraphicMarkType.NONE);

              break;
            }
        }
      });
    }
    /**
     * 绘制标记图形时鼠标按下事件
     * @param event
     * @param markKey
     * @param performDifPoint
     */

  }, {
    key: "_graphicMarkMouseDown",
    value: function _graphicMarkMouseDown(event, markKey, performDifPoint) {
      var graphicMarkDatas = this._chartData.graphicMarkData();

      var graphicMarkData = graphicMarkDatas[markKey];

      if (event.button === 2) {
        graphicMarkData.splice(graphicMarkData.length - 1, 1);

        this._chartData.setGraphicMarkType(GraphicMarkType.NONE);
      } else {
        var lastLineData = graphicMarkData[graphicMarkData.length - 1];
        performDifPoint(lastLineData);
        graphicMarkData[graphicMarkData.length - 1] = lastLineData;
      }

      graphicMarkDatas[markKey] = graphicMarkData;

      this._chartData.setGraphicMarkData(graphicMarkDatas);
    }
    /**
     * 没有绘制时鼠标按下事件
     */

  }, {
    key: "_noneGraphicMarkMouseLeftDown",
    value: function _noneGraphicMarkMouseLeftDown(event) {
      this._findNoneGraphicMarkMouseDownActiveData(event);

      var markKey = this._noneGraphicMarkMouseDownActiveData.markKey;
      var dataIndex = this._noneGraphicMarkMouseDownActiveData.dataIndex;

      if (markKey && dataIndex !== -1) {
        if (this._noneGraphicMarkMouseDownActiveData.onCircle) {
          this._noneGraphicMarkMouseDownFlag = true;

          this._chartData.setDragGraphicMarkFlag(true);
        }
      }
    }
    /**
     * 查找没有绘制时鼠标按下时在哪条数据上
     * @param event
     */

  }, {
    key: "_findNoneGraphicMarkMouseDownActiveData",
    value: function _findNoneGraphicMarkMouseDownActiveData(event) {
      var _this4 = this;

      var point = {
        x: event.localX,
        y: event.localY
      };
      var keys = Object.keys(this._chartData.graphicMarkData());

      var _loop = function _loop(i) {
        var key = keys[i];

        switch (key) {
          case GraphicMarkType.HORIZONTAL_STRAIGHT_LINE:
          case GraphicMarkType.PRICE_LINE:
            {
              if (_this4._realFindNoneGraphicMarkMouseDownActiveData(key, point, function (xyPoints) {
                return checkPointOnStraightLine(xyPoints[0], {
                  x: _this4._chartContentSize.contentRight,
                  y: xyPoints[0].y
                }, point);
              })) {
                return {
                  v: void 0
                };
              }

              break;
            }

          case GraphicMarkType.VERTICAL_STRAIGHT_LINE:
            {
              if (_this4._realFindNoneGraphicMarkMouseDownActiveData(key, point, function (xyPoints) {
                return checkPointOnStraightLine(xyPoints[0], {
                  x: xyPoints[0].x,
                  y: _this4._paneContentSize[CANDLE_STICK_PANE_TAG].contentBottom
                }, point);
              })) {
                return {
                  v: void 0
                };
              }

              break;
            }

          case GraphicMarkType.STRAIGHT_LINE:
            {
              if (_this4._realFindNoneGraphicMarkMouseDownActiveData(key, point, function (xyPoints) {
                return checkPointOnStraightLine(xyPoints[0], xyPoints[1], point);
              })) {
                return {
                  v: void 0
                };
              }

              break;
            }

          case GraphicMarkType.HORIZONTAL_RAY_LINE:
          case GraphicMarkType.VERTICAL_RAY_LINE:
          case GraphicMarkType.RAY_LINE:
            {
              if (_this4._realFindNoneGraphicMarkMouseDownActiveData(key, point, function (xyPoints) {
                return checkPointOnRayLine(xyPoints[0], xyPoints[1], point);
              })) {
                return {
                  v: void 0
                };
              }

              break;
            }

          case GraphicMarkType.HORIZONTAL_SEGMENT_LINE:
          case GraphicMarkType.VERTICAL_SEGMENT_LINE:
          case GraphicMarkType.SEGMENT_LINE:
            {
              if (_this4._realFindNoneGraphicMarkMouseDownActiveData(key, point, function (xyPoints) {
                return checkPointOnSegmentLine(xyPoints[0], xyPoints[1], point);
              })) {
                return {
                  v: void 0
                };
              }

              break;
            }

          case GraphicMarkType.PRICE_CHANNEL_LINE:
          case GraphicMarkType.PARALLEL_STRAIGHT_LINE:
          case GraphicMarkType.FIBONACCI_LINE:
            {
              if (_this4._realFindNoneGraphicMarkMouseDownActiveData(key, point, function (xyPoints) {
                var linePoints;
                var size = {
                  width: _this4._chartContentSize.contentRight,
                  height: _this4._paneContentSize[CANDLE_STICK_PANE_TAG].contentBottom - _this4._paneContentSize[CANDLE_STICK_PANE_TAG].contentTop
                };

                switch (key) {
                  case GraphicMarkType.PRICE_CHANNEL_LINE:
                    {
                      linePoints = getParallelLines(xyPoints, size, true);
                      break;
                    }

                  case GraphicMarkType.PARALLEL_STRAIGHT_LINE:
                    {
                      linePoints = getParallelLines(xyPoints, size);
                      break;
                    }

                  case GraphicMarkType.FIBONACCI_LINE:
                    {
                      linePoints = getFibonacciLines(xyPoints, size);
                      break;
                    }
                }

                var isOnGraphicMark = false;

                if (linePoints) {
                  for (var _i = 0; _i < linePoints.length; _i++) {
                    var points = linePoints[_i];
                    isOnGraphicMark = checkPointOnStraightLine(points[0], points[1], point);

                    if (isOnGraphicMark) {
                      return isOnGraphicMark;
                    }
                  }
                }

                return isOnGraphicMark;
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
     * @param markKey
     * @param point
     * @param checkPointOnLine
     * @returns {boolean}
     */

  }, {
    key: "_realFindNoneGraphicMarkMouseDownActiveData",
    value: function _realFindNoneGraphicMarkMouseDownActiveData(markKey, point, checkPointOnLine) {
      var _this5 = this;

      var graphicMarkDatas = this._chartData.graphicMarkData();

      var graphicMarkData = graphicMarkDatas[markKey];

      var graphicMark = this._chartData.styleOptions().graphicMark;

      graphicMarkData.forEach(function (data, index) {
        var points = data.points;
        var xyPoints = [];
        var isOnCircle = false;
        var pointIndex = -1;
        points.forEach(function (p, i) {
          var x = _this5._xAxis.convertToPixel(p.xPos);

          var y = _this5._yAxis.convertToPixel(p.price);

          xyPoints.push({
            x: x,
            y: y
          });
          var isOn = checkPointOnCircle({
            x: x,
            y: y
          }, graphicMark.point.radius, point);

          if (isOn) {
            pointIndex = i;
          }

          if (!isOnCircle) {
            isOnCircle = isOn;
          }
        });
        var isOnLine = checkPointOnLine(xyPoints, point);

        if (isOnLine || isOnCircle) {
          _this5._noneGraphicMarkMouseDownActiveData = {
            markKey: markKey,
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
    key: "mouseMoveEvent",
    value: function mouseMoveEvent(event) {
      if (!this._checkEventPointX(event.localX) || !this._checkEventPointY(event.localY)) {
        return;
      }

      var point = {
        x: event.localX,
        y: event.localY
      };

      this._chartData.setGraphicMarkPoint(point);

      if (!this._waitingForMouseMoveAnimationFrame) {
        this._waitingForMouseMoveAnimationFrame = true;

        var graphicMarkType = this._chartData.graphicMarkType();

        switch (graphicMarkType) {
          case GraphicMarkType.HORIZONTAL_STRAIGHT_LINE:
          case GraphicMarkType.VERTICAL_STRAIGHT_LINE:
          case GraphicMarkType.PRICE_LINE:
            {
              this._onePointGraphicMarkMouseMove(point, graphicMarkType);

              break;
            }

          case GraphicMarkType.STRAIGHT_LINE:
          case GraphicMarkType.RAY_LINE:
          case GraphicMarkType.SEGMENT_LINE:
          case GraphicMarkType.FIBONACCI_LINE:
            {
              this._twoPointGraphicMarkMouseMove(point, graphicMarkType);

              break;
            }

          case GraphicMarkType.HORIZONTAL_RAY_LINE:
          case GraphicMarkType.HORIZONTAL_SEGMENT_LINE:
            {
              this._twoPointGraphicMarkMouseMove(point, graphicMarkType, function (lastLineData, _ref) {
                var price = _ref.price;
                lastLineData.points[0].price = price;
              });

              break;
            }

          case GraphicMarkType.VERTICAL_RAY_LINE:
          case GraphicMarkType.VERTICAL_SEGMENT_LINE:
            {
              this._twoPointGraphicMarkMouseMove(point, graphicMarkType, function (lastLineData, _ref2) {
                var xPos = _ref2.xPos;
                lastLineData.points[0].xPos = xPos;
              });

              break;
            }

          case GraphicMarkType.PRICE_CHANNEL_LINE:
          case GraphicMarkType.PARALLEL_STRAIGHT_LINE:
            {
              this._threePointGraphicMarkMouseMove(point, graphicMarkType);

              break;
            }

          case GraphicMarkType.NONE:
            {
              this._chartData.setGraphicMarkData(this._chartData.graphicMarkData());

              break;
            }
        }

        this._waitingForMouseMoveAnimationFrame = false;
      }
    }
  }, {
    key: "pressedMouseMoveEvent",
    value: function pressedMouseMoveEvent(event) {
      var markKey = this._noneGraphicMarkMouseDownActiveData.markKey;
      var dataIndex = this._noneGraphicMarkMouseDownActiveData.dataIndex;

      if (markKey && dataIndex !== -1) {
        var graphicMarkDatas = this._chartData.graphicMarkData();

        var graphicMarkData = graphicMarkDatas[markKey];
        var point = {
          x: event.localX,
          y: event.localY
        };

        switch (markKey) {
          case GraphicMarkType.HORIZONTAL_STRAIGHT_LINE:
          case GraphicMarkType.VERTICAL_STRAIGHT_LINE:
          case GraphicMarkType.PRICE_LINE:
          case GraphicMarkType.STRAIGHT_LINE:
          case GraphicMarkType.RAY_LINE:
          case GraphicMarkType.SEGMENT_LINE:
          case GraphicMarkType.PRICE_CHANNEL_LINE:
          case GraphicMarkType.PARALLEL_STRAIGHT_LINE:
          case GraphicMarkType.FIBONACCI_LINE:
            {
              var pointIndex = this._noneGraphicMarkMouseDownActiveData.pointIndex;

              if (pointIndex !== -1) {
                graphicMarkData[dataIndex].points[pointIndex].xPos = this._xAxis.convertFromPixel(point.x);
                graphicMarkData[dataIndex].points[pointIndex].price = this._yAxis.convertFromPixel(point.y);
              }

              break;
            }

          case GraphicMarkType.HORIZONTAL_RAY_LINE:
          case GraphicMarkType.HORIZONTAL_SEGMENT_LINE:
            {
              var _pointIndex = this._noneGraphicMarkMouseDownActiveData.pointIndex;

              if (_pointIndex !== -1) {
                var price = this._yAxis.convertFromPixel(point.y);

                graphicMarkData[dataIndex].points[_pointIndex].xPos = this._xAxis.convertFromPixel(point.x);
                graphicMarkData[dataIndex].points[0].price = price;
                graphicMarkData[dataIndex].points[1].price = price;
              }

              break;
            }

          case GraphicMarkType.VERTICAL_RAY_LINE:
          case GraphicMarkType.VERTICAL_SEGMENT_LINE:
            {
              var _pointIndex2 = this._noneGraphicMarkMouseDownActiveData.pointIndex;

              if (_pointIndex2 !== -1) {
                var xPos = this._xAxis.convertFromPixel(point.x);

                graphicMarkData[dataIndex].points[0].xPos = xPos;
                graphicMarkData[dataIndex].points[1].xPos = xPos;
                graphicMarkData[dataIndex].points[_pointIndex2].price = this._yAxis.convertFromPixel(point.y);
              }

              break;
            }
        }

        graphicMarkDatas[markKey] = graphicMarkData;

        this._chartData.setGraphicMarkPoint({
          x: event.localX,
          y: event.localY
        });

        this._chartData.setGraphicMarkData(graphicMarkDatas);
      }
    }
    /**
     * 一个点形成的图形鼠标移动事件
     * @param point
     * @param markKey
     */

  }, {
    key: "_onePointGraphicMarkMouseMove",
    value: function _onePointGraphicMarkMouseMove(point, markKey) {
      var _this6 = this;

      this._graphicMarkMouseMove(point, markKey, function (graphicMarkData, lastLineData) {
        var xPos = _this6._xAxis.convertFromPixel(point.x);

        var price = _this6._yAxis.convertFromPixel(point.y);

        switch (lastLineData.drawStep) {
          case GraphicMarkDrawStep.STEP_DONE:
            {
              graphicMarkData.push({
                points: [{
                  xPos: xPos,
                  price: price
                }],
                drawStep: GraphicMarkDrawStep.STEP_1
              });
              break;
            }

          case GraphicMarkDrawStep.STEP_1:
          case GraphicMarkDrawStep.STEP_2:
            {
              lastLineData.points[0].xPos = xPos;
              lastLineData.points[0].price = price;
              graphicMarkData[graphicMarkData.length - 1] = lastLineData;
              break;
            }
        }
      });
    }
    /**
     * 两个点形成的线鼠标移动事件
     * @param point
     * @param markKey
     * @param stepTwo
     */

  }, {
    key: "_twoPointGraphicMarkMouseMove",
    value: function _twoPointGraphicMarkMouseMove(point, markKey, stepTwo) {
      var _this7 = this;

      this._graphicMarkMouseMove(point, markKey, function (graphicMarkData, lastLineData) {
        var xPos = _this7._xAxis.convertFromPixel(point.x);

        var price = _this7._yAxis.convertFromPixel(point.y);

        switch (lastLineData.drawStep) {
          case GraphicMarkDrawStep.STEP_DONE:
            {
              graphicMarkData.push({
                points: [{
                  xPos: xPos,
                  price: price
                }, {
                  xPos: xPos,
                  price: price
                }],
                drawStep: GraphicMarkDrawStep.STEP_1
              });
              break;
            }

          case GraphicMarkDrawStep.STEP_1:
            {
              lastLineData.points[0] = {
                xPos: xPos,
                price: price
              };
              lastLineData.points[1] = {
                xPos: xPos,
                price: price
              };
              graphicMarkData[graphicMarkData.length - 1] = lastLineData;
              break;
            }

          case GraphicMarkDrawStep.STEP_2:
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

              graphicMarkData[graphicMarkData.length - 1] = lastLineData;
              break;
            }
        }
      });
    }
    /**
     * 三步形成的标记图形鼠标移动事件
     * @param point
     * @param markKey
     * @param stepTwo
     */

  }, {
    key: "_threePointGraphicMarkMouseMove",
    value: function _threePointGraphicMarkMouseMove(point, markKey, stepTwo) {
      var _this8 = this;

      this._graphicMarkMouseMove(point, markKey, function (graphicMarkData, lastLineData) {
        var xPos = _this8._xAxis.convertFromPixel(point.x);

        var price = _this8._yAxis.convertFromPixel(point.y);

        switch (lastLineData.drawStep) {
          case GraphicMarkDrawStep.STEP_DONE:
            {
              graphicMarkData.push({
                points: [{
                  xPos: xPos,
                  price: price
                }, {
                  xPos: xPos,
                  price: price
                }],
                drawStep: GraphicMarkDrawStep.STEP_1
              });
              break;
            }

          case GraphicMarkDrawStep.STEP_1:
            {
              lastLineData.points[0] = {
                xPos: xPos,
                price: price
              };
              lastLineData.points[1] = {
                xPos: xPos,
                price: price
              };
              graphicMarkData[graphicMarkData.length - 1] = lastLineData;
              break;
            }

          case GraphicMarkDrawStep.STEP_2:
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
              graphicMarkData[graphicMarkData.length - 1] = lastLineData;
              break;
            }

          case GraphicMarkDrawStep.STEP_3:
            {
              lastLineData.points[2] = {
                xPos: xPos,
                price: price
              };
              graphicMarkData[graphicMarkData.length - 1] = lastLineData;
              break;
            }
        }
      });
    }
    /**
     * 绘制标记图形时鼠标移动事件
     * @param point
     * @param markKey
     * @param performDifPoint
     */

  }, {
    key: "_graphicMarkMouseMove",
    value: function _graphicMarkMouseMove(point, markKey, performDifPoint) {
      var graphicMarkDatas = this._chartData.graphicMarkData();

      var graphicMarkData = graphicMarkDatas[markKey];
      var lastLineData = graphicMarkData[graphicMarkData.length - 1] || {
        drawStep: GraphicMarkDrawStep.STEP_DONE
      };
      performDifPoint(graphicMarkData, lastLineData);
      graphicMarkDatas[markKey] = graphicMarkData;

      this._chartData.setGraphicMarkData(graphicMarkDatas);
    }
  }, {
    key: "_checkEventPointY",
    value: function _checkEventPointY(y) {
      var size = this._paneContentSize[CANDLE_STICK_PANE_TAG];
      return y > size.contentTop && y < size.contentBottom;
    }
  }]);

  return GraphicMarkEventHandler;
}(EventHandler);

var LineType = {
  COMMON: 0,
  HORIZONTAL: 1,
  VERTICAL: 2
};

var GraphicMarkView = /*#__PURE__*/function (_View) {
  _inherits(GraphicMarkView, _View);

  var _super = _createSuper(GraphicMarkView);

  function GraphicMarkView(container, chartData, xAxis, yAxis) {
    var _this;

    _classCallCheck(this, GraphicMarkView);

    _this = _super.call(this, container, chartData);
    _this._xAxis = xAxis;
    _this._yAxis = yAxis;
    return _this;
  }

  _createClass(GraphicMarkView, [{
    key: "_draw",
    value: function _draw() {
      var graphicMark = this._chartData.styleOptions().graphicMark;

      var pricePrecision = this._chartData.pricePrecision(); // 画线


      this._drawHorizontalStraightLine(graphicMark);

      this._drawVerticalStraightLine(graphicMark);

      this._drawStraightLine(graphicMark);

      this._drawHorizontalRayLine(graphicMark);

      this._drawVerticalRayLine(graphicMark);

      this._drawRayLine(graphicMark);

      this._drawSegmentLine(graphicMark);

      this._drawPriceLine(graphicMark, pricePrecision);

      this._drawPriceChannelLine(graphicMark);

      this._drawParallelStraightLine(graphicMark);

      this._drawFibonacciLine(graphicMark, pricePrecision);
    }
    /**
     * 渲染水平直线
     * @param graphicMark
     */

  }, {
    key: "_drawHorizontalStraightLine",
    value: function _drawHorizontalStraightLine(graphicMark) {
      var _this2 = this;

      this._drawPointGraphicMark(GraphicMarkType.HORIZONTAL_STRAIGHT_LINE, graphicMark, checkPointOnStraightLine, function (points) {
        return [[{
          x: 0,
          y: points[0].y
        }, {
          x: _this2._width,
          y: points[0].y
        }]];
      });
    }
    /**
     * 渲染垂直直线
     * @param graphicMark
     */

  }, {
    key: "_drawVerticalStraightLine",
    value: function _drawVerticalStraightLine(graphicMark) {
      var _this3 = this;

      this._drawPointGraphicMark(GraphicMarkType.VERTICAL_STRAIGHT_LINE, graphicMark, checkPointOnStraightLine, function (points) {
        return [[{
          x: points[0].x,
          y: 0
        }, {
          x: points[0].x,
          y: _this3._height
        }]];
      });
    }
    /**
     * 渲染直线
     * @param graphicMark
     */

  }, {
    key: "_drawStraightLine",
    value: function _drawStraightLine(graphicMark) {
      var _this4 = this;

      this._drawPointGraphicMark(GraphicMarkType.STRAIGHT_LINE, graphicMark, checkPointOnStraightLine, function (points) {
        if (points[0].x === points[1].x) {
          return [[{
            x: points[0].x,
            y: 0
          }, {
            x: points[0].x,
            y: _this4._height
          }]];
        }

        var y = getLinearY(points[0], points[1], [{
          x: 0,
          y: points[0].y
        }, {
          x: _this4._width,
          y: points[0].y
        }]);
        return [[{
          x: 0,
          y: y[0]
        }, {
          x: _this4._width,
          y: y[1]
        }]];
      });
    }
    /**
     * 绘制水平射线
     * @param graphicMark
     */

  }, {
    key: "_drawHorizontalRayLine",
    value: function _drawHorizontalRayLine(graphicMark) {
      var _this5 = this;

      this._drawPointGraphicMark(GraphicMarkType.HORIZONTAL_RAY_LINE, graphicMark, checkPointOnRayLine, function (points) {
        var point = {
          x: 0,
          y: points[0].y
        };

        if (points[0].x < points[1].x) {
          point.x = _this5._width;
        }

        return [[points[0], point]];
      });
    }
    /**
     * 绘制垂直射线
     * @param graphicMark
     */

  }, {
    key: "_drawVerticalRayLine",
    value: function _drawVerticalRayLine(graphicMark) {
      var _this6 = this;

      this._drawPointGraphicMark(GraphicMarkType.VERTICAL_RAY_LINE, graphicMark, checkPointOnRayLine, function (points) {
        var point = {
          x: points[0].x,
          y: 0
        };

        if (points[0].y < points[1].y) {
          point.y = _this6._height;
        }

        return [[points[0], point]];
      });
    }
    /**
     * 渲染射线
     * @param graphicMark
     */

  }, {
    key: "_drawRayLine",
    value: function _drawRayLine(graphicMark) {
      var _this7 = this;

      this._drawPointGraphicMark(GraphicMarkType.RAY_LINE, graphicMark, checkPointOnRayLine, function (points) {
        var point;

        if (points[0].x === points[1].x && points[0].y !== points[1].y) {
          if (points[0].y < points[1].y) {
            point = {
              x: points[0].x,
              y: _this7._height
            };
          } else {
            point = {
              x: points[0].x,
              y: 0
            };
          }
        } else if (points[0].x > points[1].x) {
          point = {
            x: 0,
            y: getLinearY(points[0], points[1], [{
              x: 0,
              y: points[0].y
            }])[0]
          };
        } else {
          point = {
            x: _this7._width,
            y: getLinearY(points[0], points[1], [{
              x: _this7._width,
              y: points[0].y
            }])[0]
          };
        }

        return [[points[0], point]];
      });
    }
    /**
     * 绘制线段，水平线段，垂直线段，普通线段一起绘制
     * @param graphicMark
     */

  }, {
    key: "_drawSegmentLine",
    value: function _drawSegmentLine(graphicMark) {
      this._drawPointGraphicMark(GraphicMarkType.HORIZONTAL_SEGMENT_LINE, graphicMark, checkPointOnSegmentLine);

      this._drawPointGraphicMark(GraphicMarkType.VERTICAL_SEGMENT_LINE, graphicMark, checkPointOnSegmentLine);

      this._drawPointGraphicMark(GraphicMarkType.SEGMENT_LINE, graphicMark, checkPointOnSegmentLine);
    }
    /**
     * 绘制价格线
     * @param graphicMark
     * @param pricePrecision
     */

  }, {
    key: "_drawPriceLine",
    value: function _drawPriceLine(graphicMark, pricePrecision) {
      var _this8 = this;

      this._drawPointGraphicMark(GraphicMarkType.PRICE_LINE, graphicMark, checkPointOnRayLine, function (points) {
        return [[points[0], {
          x: _this8._width,
          y: points[0].y
        }]];
      }, true, pricePrecision);
    }
    /**
     * 渲染价格通道线
     * @param graphicMark
     */

  }, {
    key: "_drawPriceChannelLine",
    value: function _drawPriceChannelLine(graphicMark) {
      var _this9 = this;

      this._drawPointGraphicMark(GraphicMarkType.PRICE_CHANNEL_LINE, graphicMark, checkPointOnStraightLine, function (points) {
        return getParallelLines(points, {
          width: _this9._width,
          height: _this9._height
        }, true);
      });
    }
    /**
     * 渲染平行直线
     * @param graphicMark
     */

  }, {
    key: "_drawParallelStraightLine",
    value: function _drawParallelStraightLine(graphicMark) {
      var _this10 = this;

      this._drawPointGraphicMark(GraphicMarkType.PARALLEL_STRAIGHT_LINE, graphicMark, checkPointOnStraightLine, function (points) {
        return getParallelLines(points, {
          width: _this10._width,
          height: _this10._height
        });
      });
    }
    /**
     * 渲染斐波那契线
     * @param graphicMark
     * @param pricePrecision
     */

  }, {
    key: "_drawFibonacciLine",
    value: function _drawFibonacciLine(graphicMark, pricePrecision) {
      var _this11 = this;

      this._drawPointGraphicMark(GraphicMarkType.FIBONACCI_LINE, graphicMark, checkPointOnStraightLine, function (points) {
        return getFibonacciLines(points, {
          width: _this11._width,
          height: _this11._height
        });
      }, true, pricePrecision, ['(100.0%)', '(78.6%)', '(61.8%)', '(50.0%)', '(38.2%)', '(23.6%)', '(0.0%)']);
    }
    /**
     * 渲染点形成的图形
     * @param markKey
     * @param graphicMark
     * @param checkPointOnLine
     * @param generatedLinePoints
     * @param isDrawPrice
     * @param pricePrecision
     * @param priceExtendsText
     */

  }, {
    key: "_drawPointGraphicMark",
    value: function _drawPointGraphicMark(markKey, graphicMark, checkPointOnLine, generatedLinePoints, isDrawPrice, pricePrecision, priceExtendsText) {
      var _this12 = this;

      var graphicMarkDatas = this._chartData.graphicMarkData();

      var graphicMarkData = graphicMarkDatas[markKey];
      graphicMarkData.forEach(function (_ref) {
        var points = _ref.points,
            drawStep = _ref.drawStep;
        var circlePoints = [];
        points.forEach(function (_ref2) {
          var xPos = _ref2.xPos,
              price = _ref2.price;

          var x = _this12._xAxis.convertToPixel(xPos);

          var y = _this12._yAxis.convertToPixel(price);

          circlePoints.push({
            x: x,
            y: y
          });
        });
        var linePoints = generatedLinePoints ? generatedLinePoints(circlePoints) : [circlePoints];

        _this12._drawGraphicMark(graphicMark, linePoints, circlePoints, drawStep, checkPointOnLine, isDrawPrice, pricePrecision, priceExtendsText);
      });
    }
    /**
     * 绘制标记图形
     * @param graphicMark
     * @param linePoints
     * @param circlePoints
     * @param drawStep
     * @param checkPointOnLine
     * @param isDrawPrice
     * @param pricePrecision
     * @param priceExtendsText
     */

  }, {
    key: "_drawGraphicMark",
    value: function _drawGraphicMark(graphicMark, linePoints, circlePoints, drawStep, checkPointOnLine, isDrawPrice, pricePrecision) {
      var _this13 = this;

      var priceExtendsText = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : [];

      var graphicMarkPoint = this._chartData.graphicMarkPoint();

      var isOnLine = false;
      linePoints.forEach(function (points, i) {
        if (points.length > 1) {
          var isOn = checkPointOnLine(points[0], points[1], graphicMarkPoint);

          if (!isOnLine) {
            isOnLine = isOn;
          }

          if (drawStep !== GraphicMarkDrawStep.STEP_1) {
            _this13._ctx.strokeStyle = graphicMark.line.color;
            _this13._ctx.lineWidth = graphicMark.line.size;

            var lineType = _this13._getLineType(points[0], points[1]);

            switch (lineType) {
              case LineType.COMMON:
                {
                  drawLine(_this13._ctx, function () {
                    _this13._ctx.beginPath();

                    _this13._ctx.moveTo(points[0].x, points[0].y);

                    _this13._ctx.lineTo(points[1].x, points[1].y);

                    _this13._ctx.stroke();

                    _this13._ctx.closePath();
                  });
                  break;
                }

              case LineType.HORIZONTAL:
                {
                  drawHorizontalLine(_this13._ctx, points[0].y, points[0].x, points[1].x);
                  break;
                }

              case LineType.VERTICAL:
                {
                  drawVerticalLine(_this13._ctx, points[0].x, points[0].y, points[1].y);
                  break;
                }
            } // 渲染价格


            if (isDrawPrice) {
              var price = _this13._yAxis.convertFromPixel(points[0].y);

              var priceText = formatPrecision(price, pricePrecision);
              _this13._ctx.font = getFont(graphicMark.text.size, graphicMark.text.weight, graphicMark.text.family);
              _this13._ctx.fillStyle = graphicMark.text.color;

              _this13._ctx.fillText("".concat(priceText, " ").concat(priceExtendsText[i] || ''), points[0].x + graphicMark.text.marginLeft, points[0].y - graphicMark.text.marginBottom);
            }
          }
        }
      });
      var radius = graphicMark.point.radius;
      var isCircleActive = false;

      for (var i = 0; i < circlePoints.length; i++) {
        isCircleActive = checkPointOnCircle(circlePoints[i], radius, graphicMarkPoint);

        if (isCircleActive) {
          break;
        }
      }

      circlePoints.forEach(function (circlePoint) {
        var isOnCircle = checkPointOnCircle(circlePoint, radius, graphicMarkPoint);

        if (isCircleActive || isOnLine) {
          var circleRadius = radius;
          var circleColor = graphicMark.point.backgroundColor;
          var circleBorderColor = graphicMark.point.borderColor;
          var circleBorderSize = graphicMark.point.borderSize;

          if (isOnCircle) {
            circleRadius = graphicMark.point.activeRadius;
            circleColor = graphicMark.point.activeBackgroundColor;
            circleBorderColor = graphicMark.point.activeBorderColor;
            circleBorderSize = graphicMark.point.activeBorderSize;
          }

          _this13._ctx.fillStyle = circleColor;

          _this13._ctx.beginPath();

          _this13._ctx.arc(circlePoint.x, circlePoint.y, circleRadius, 0, Math.PI * 2);

          _this13._ctx.closePath();

          _this13._ctx.fill();

          _this13._ctx.lineWidth = circleBorderSize;
          _this13._ctx.strokeStyle = circleBorderColor;

          _this13._ctx.beginPath();

          _this13._ctx.arc(circlePoint.x, circlePoint.y, circleRadius, 0, Math.PI * 2);

          _this13._ctx.closePath();

          _this13._ctx.stroke();
        }
      });
    }
    /**
     * 获取绘制线类型
     * @param point1
     * @param point2
     * @private
     */

  }, {
    key: "_getLineType",
    value: function _getLineType(point1, point2) {
      if (point1.x === point2.x) {
        return LineType.VERTICAL;
      }

      if (point1.y === point2.y) {
        return LineType.HORIZONTAL;
      }

      return LineType.COMMON;
    }
  }]);

  return GraphicMarkView;
}(View);

var CandleStickWidget = /*#__PURE__*/function (_TechnicalIndicatorWi) {
  _inherits(CandleStickWidget, _TechnicalIndicatorWi);

  var _super = _createSuper(CandleStickWidget);

  function CandleStickWidget() {
    _classCallCheck(this, CandleStickWidget);

    return _super.apply(this, arguments);
  }

  _createClass(CandleStickWidget, [{
    key: "_createMainView",
    value: function _createMainView(container, props) {
      return new CandleStickView(container, props.chartData, props.xAxis, props.yAxis, props.additionalDataProvider);
    }
  }, {
    key: "_createExpandView",
    value: function _createExpandView(container, props) {
      return new GraphicMarkView(container, props.chartData, props.xAxis, props.yAxis);
    }
  }, {
    key: "_createFloatLayerView",
    value: function _createFloatLayerView(container, props) {
      return new CandleStickFloatLayerView(container, props.chartData, props.xAxis, props.yAxis, props.additionalDataProvider);
    }
  }]);

  return CandleStickWidget;
}(TechnicalIndicatorWidget);

var TransactionAveragePrice = /*#__PURE__*/function (_TechnicalIndicator) {
  _inherits(TransactionAveragePrice, _TechnicalIndicator);

  var _super = _createSuper(TransactionAveragePrice);

  function TransactionAveragePrice() {
    _classCallCheck(this, TransactionAveragePrice);

    return _super.call(this, {
      name: 'TAP',
      precision: 2,
      plots: [{
        key: 'average',
        type: 'line'
      }]
    });
  }

  _createClass(TransactionAveragePrice, [{
    key: "calcTechnicalIndicator",
    value: function calcTechnicalIndicator(dataList, calcParams) {
      var turnoverSum = 0;
      var volumeSum = 0;
      var result = [];
      dataList.forEach(function (kLineData) {
        var average = {};
        var turnover = kLineData.turnover || 0;
        var volume = kLineData.volume || 0;
        turnoverSum += turnover;
        volumeSum += volume;

        if (volume !== 0) {
          average.average = turnoverSum / volumeSum;
        }

        result.push(average);
      });
      return result;
    }
  }]);

  return TransactionAveragePrice;
}(TechnicalIndicator);

var CandleStickPane = /*#__PURE__*/function (_TechnicalIndicatorPa) {
  _inherits(CandleStickPane, _TechnicalIndicatorPa);

  var _super = _createSuper(CandleStickPane);

  function CandleStickPane(props) {
    var _this;

    _classCallCheck(this, CandleStickPane);

    _this = _super.call(this, props);
    _this._chartType = ChartType.CANDLE_STICK;
    _this._realTimeTechnicalIndicator = new TransactionAveragePrice();
    return _this;
  }

  _createClass(CandleStickPane, [{
    key: "_createYAxis",
    value: function _createYAxis(props) {
      return new YAxis(props.chartData, true, {
        technicalIndicator: this.technicalIndicator.bind(this),
        isTimeLine: this._isRealTime.bind(this)
      });
    }
  }, {
    key: "_createMainWidget",
    value: function _createMainWidget(container, props) {
      return new CandleStickWidget({
        container: container,
        chartData: props.chartData,
        xAxis: props.xAxis,
        yAxis: this._yAxis,
        additionalDataProvider: {
          technicalIndicator: this.technicalIndicator.bind(this),
          chartType: this.chartType.bind(this),
          tag: this.tag.bind(this)
        }
      });
    }
  }, {
    key: "_isRealTime",
    value: function _isRealTime() {
      return this._chartType === ChartType.REAL_TIME;
    }
  }, {
    key: "technicalIndicator",
    value: function technicalIndicator() {
      return this._isRealTime() ? this._realTimeTechnicalIndicator : this._technicalIndicator;
    }
  }, {
    key: "chartType",
    value: function chartType() {
      return this._chartType;
    }
  }, {
    key: "setChartType",
    value: function setChartType(chartType) {
      if (this._chartType !== chartType) {
        this._chartType = chartType;

        this._chartData.calcTechnicalIndicator(this);
      }
    }
  }]);

  return CandleStickPane;
}(TechnicalIndicatorPane);

var XAxisView = /*#__PURE__*/function (_View) {
  _inherits(XAxisView, _View);

  var _super = _createSuper(XAxisView);

  function XAxisView(container, chartData, xAxis) {
    var _this;

    _classCallCheck(this, XAxisView);

    _this = _super.call(this, container, chartData);
    _this._xAxis = xAxis;
    return _this;
  }

  _createClass(XAxisView, [{
    key: "_draw",
    value: function _draw() {
      var xAxisOptions = this._chartData.styleOptions().xAxis;

      if (xAxisOptions.display) {
        this._drawAxisLine(xAxisOptions);

        this._drawTickLines(xAxisOptions);

        this._drawTickLabels(xAxisOptions);
      }
    }
  }, {
    key: "_drawAxisLine",
    value: function _drawAxisLine(xAxisOptions) {
      var xAxisLine = xAxisOptions.axisLine;

      if (!xAxisLine.display) {
        return;
      }

      this._ctx.strokeStyle = xAxisLine.color;
      this._ctx.lineWidth = xAxisLine.size;
      drawHorizontalLine(this._ctx, 0, 0, this._width);
    }
  }, {
    key: "_drawTickLines",
    value: function _drawTickLines(xAxisOptions) {
      var _this2 = this;

      var tickLine = xAxisOptions.tickLine;

      if (!tickLine.display) {
        return;
      }

      this._ctx.lineWidth = tickLine.size;
      this._ctx.strokeStyle = tickLine.color;
      var startY = xAxisOptions.axisLine.display ? xAxisOptions.axisLine.size : 0;
      var endY = startY + tickLine.length;

      this._xAxis.ticks().forEach(function (tick) {
        drawVerticalLine(_this2._ctx, tick.x, startY, endY);
      });
    }
  }, {
    key: "_drawTickLabels",
    value: function _drawTickLabels(xAxisOptions) {
      var tickText = xAxisOptions.tickText;

      if (!tickText.display) {
        return;
      }

      var tickLine = xAxisOptions.tickLine;
      this._ctx.textBaseline = 'top';
      this._ctx.font = getFont(tickText.size, tickText.weight, tickText.family);
      this._ctx.textAlign = 'center';
      this._ctx.fillStyle = tickText.color;
      var labelY = tickText.paddingTop;

      if (xAxisOptions.axisLine.display) {
        labelY += xAxisOptions.axisLine.size;
      }

      if (tickLine.display) {
        labelY += tickLine.length;
      }

      var ticks = this._xAxis.ticks();

      var tickLength = ticks.length;

      for (var i = 0; i < tickLength; i++) {
        this._ctx.fillText(ticks[i].v, ticks[i].x, labelY);
      }
    }
  }]);

  return XAxisView;
}(View);

var XAxisFloatLayerView = /*#__PURE__*/function (_View) {
  _inherits(XAxisFloatLayerView, _View);

  var _super = _createSuper(XAxisFloatLayerView);

  function XAxisFloatLayerView(container, chartData, xAxis) {
    var _this;

    _classCallCheck(this, XAxisFloatLayerView);

    _this = _super.call(this, container, chartData);
    _this._xAxis = xAxis;
    return _this;
  }

  _createClass(XAxisFloatLayerView, [{
    key: "_draw",
    value: function _draw() {
      this._drawCrossHairLabel();
    }
  }, {
    key: "_drawCrossHairLabel",
    value: function _drawCrossHairLabel() {
      var crossHair = this._chartData.crossHair();

      if (!crossHair.paneTag) {
        return;
      }

      var crossHairOptions = this._chartData.styleOptions().floatLayer.crossHair;

      var crossHairVertical = crossHairOptions.vertical;
      var crossHairVerticalText = crossHairVertical.text;

      if (!crossHairOptions.display || !crossHairVertical.display || !crossHairVerticalText.display) {
        return;
      }

      var dataList = this._chartData.dataList();

      var dataPos;

      if (isValid(crossHair.x)) {
        dataPos = this._xAxis.convertFromPixel(crossHair.x);
      } else {
        dataPos = dataList.length - 1;
      }

      var kLineData = dataList[dataPos];

      if (!kLineData) {
        return;
      }

      var x = this._xAxis.convertToPixel(dataPos);

      var timestamp = kLineData.timestamp;
      var text = formatDate(this._chartData.dateTimeFormat(), timestamp, 'YYYY-MM-DD hh:mm');
      var textSize = crossHairVerticalText.size;
      this._ctx.font = getFont(textSize, crossHairVerticalText.weight, crossHairVerticalText.family);
      var labelWidth = calcTextWidth(this._ctx, text);
      var xAxisLabelX = x - labelWidth / 2;
      var paddingLeft = crossHairVerticalText.paddingLeft;
      var paddingRight = crossHairVerticalText.paddingRight;
      var paddingTop = crossHairVerticalText.paddingTop;
      var paddingBottom = crossHairVerticalText.paddingBottom;
      var borderSize = crossHairVerticalText.borderSize; // 保证整个x轴上的提示文字总是完全显示

      if (xAxisLabelX < paddingLeft + borderSize) {
        xAxisLabelX = paddingLeft + borderSize;
      } else if (xAxisLabelX > this._width - labelWidth - borderSize - paddingRight) {
        xAxisLabelX = this._width - labelWidth - borderSize - paddingRight;
      }

      var rectLeft = xAxisLabelX - borderSize - paddingLeft;
      var rectTop = 0;
      var rectRight = xAxisLabelX + labelWidth + borderSize + paddingRight;
      var rectBottom = rectTop + textSize + borderSize * 2 + paddingTop + paddingBottom;
      this._ctx.fillStyle = crossHairVerticalText.backgroundColor;

      this._ctx.fillRect(rectLeft, rectTop, rectRight - rectLeft, rectBottom - rectTop);

      this._ctx.lineWidth = borderSize;
      this._ctx.strokeStyle = crossHairVerticalText.borderColor;

      this._ctx.strokeRect(rectLeft, rectTop, rectRight - rectLeft, rectBottom - rectTop); // 绘制轴上的提示文字


      this._ctx.textBaseline = 'top';
      this._ctx.fillStyle = crossHairVerticalText.color;

      this._ctx.fillText(text, xAxisLabelX, borderSize + paddingTop);
    }
  }]);

  return XAxisFloatLayerView;
}(View);

var XAxisWidget = /*#__PURE__*/function (_Widget) {
  _inherits(XAxisWidget, _Widget);

  var _super = _createSuper(XAxisWidget);

  function XAxisWidget() {
    _classCallCheck(this, XAxisWidget);

    return _super.apply(this, arguments);
  }

  _createClass(XAxisWidget, [{
    key: "_createMainView",
    value: function _createMainView(container, props) {
      return new XAxisView(container, props.chartData, props.xAxis);
    }
  }, {
    key: "_createFloatLayerView",
    value: function _createFloatLayerView(container, props) {
      return new XAxisFloatLayerView(container, props.chartData, props.xAxis);
    }
  }]);

  return XAxisWidget;
}(Widget);

var XAxis = /*#__PURE__*/function (_Axis) {
  _inherits(XAxis, _Axis);

  var _super = _createSuper(XAxis);

  function XAxis() {
    _classCallCheck(this, XAxis);

    return _super.apply(this, arguments);
  }

  _createClass(XAxis, [{
    key: "_computeMinMaxValue",
    value: function _computeMinMaxValue() {
      var min = this._chartData.from();

      var max = this._chartData.to() - 1;
      var range = max - min + 1;
      return {
        min: min,
        max: max,
        range: range
      };
    }
  }, {
    key: "_computeOptimalTicks",
    value: function _computeOptimalTicks(ticks) {
      var optimalTicks = [];
      var tickLength = ticks.length;

      var dataList = this._chartData.dataList();

      if (tickLength > 0) {
        var dateTimeFormat = this._chartData.dateTimeFormat();

        var tickText = this._chartData.styleOptions().xAxis.tickText;

        this._measureCtx.font = getFont(tickText.size, tickText.weight, tickText.family);
        var defaultLabelWidth = calcTextWidth(this._measureCtx, '00-00 00:00');
        var pos = parseInt(ticks[0].v, 10);
        var x = this.convertToPixel(pos);
        var tickCountDif = 1;

        if (tickLength > 1) {
          var nextPos = parseInt(ticks[1].v, 10);
          var nextX = this.convertToPixel(nextPos);
          var xDif = Math.abs(nextX - x);

          if (xDif < defaultLabelWidth) {
            tickCountDif = Math.ceil(defaultLabelWidth / xDif);
          }
        }

        for (var i = 0; i < tickLength; i += tickCountDif) {
          var _pos = parseInt(ticks[i].v, 10);

          var kLineData = dataList[_pos];
          var timestamp = kLineData.timestamp;
          var label = formatDate(dateTimeFormat, timestamp, 'hh:mm');

          if (i !== 0) {
            var prePos = parseInt(ticks[i - tickCountDif].v, 10);
            var preKLineData = dataList[prePos];
            var preTimestamp = preKLineData.timestamp;
            label = this._optimalTickLabel(dateTimeFormat, timestamp, preTimestamp) || label;
          }

          var _x = this.convertToPixel(_pos);

          optimalTicks.push({
            v: label,
            x: _x,
            oV: timestamp
          });
        }

        var optimalTickLength = optimalTicks.length;

        if (optimalTickLength === 1) {
          optimalTicks[0].v = formatDate(dateTimeFormat, optimalTicks[0].oV, 'YYYY-MM-DD hh:mm');
        } else {
          var firstTimestamp = optimalTicks[0].oV;
          var secondTimestamp = optimalTicks[1].oV;

          if (optimalTicks[2]) {
            var thirdV = optimalTicks[2].v;

            if (/^[0-9]{2}-[0-9]{2}$/.test(thirdV)) {
              optimalTicks[0].v = formatDate(dateTimeFormat, firstTimestamp, 'MM-DD');
            } else if (/^[0-9]{4}-[0-9]{2}$/.test(thirdV)) {
              optimalTicks[0].v = formatDate(dateTimeFormat, firstTimestamp, 'YYYY-MM');
            } else if (/^[0-9]{4}$/.test(thirdV)) {
              optimalTicks[0].v = formatDate(dateTimeFormat, firstTimestamp, 'YYYY');
            }
          } else {
            optimalTicks[0].v = this._optimalTickLabel(dateTimeFormat, firstTimestamp, secondTimestamp) || optimalTicks[0].v;
          }
        }
      }

      return optimalTicks;
    }
  }, {
    key: "_optimalTickLabel",
    value: function _optimalTickLabel(dateTimeFormat, timestamp, comparedTimestamp) {
      var year = formatDate(dateTimeFormat, timestamp, 'YYYY');
      var month = formatDate(dateTimeFormat, timestamp, 'YYYY-MM');
      var day = formatDate(dateTimeFormat, timestamp, 'MM-DD');

      if (year !== formatDate(dateTimeFormat, comparedTimestamp, 'YYYY')) {
        return year;
      } else if (month !== formatDate(dateTimeFormat, comparedTimestamp, 'YYYY-MM')) {
        return month;
      } else if (day !== formatDate(dateTimeFormat, comparedTimestamp, 'MM-DD')) {
        return day;
      }

      return null;
    }
    /**
     * 获取自身高度
     */

  }, {
    key: "getSelfHeight",
    value: function getSelfHeight() {
      var stylOptions = this._chartData.styleOptions();

      var xAxisOptions = stylOptions.xAxis;
      var crossHairOptions = stylOptions.floatLayer.crossHair;
      var xAxisHeight = 0;

      if (xAxisOptions.display) {
        if (xAxisOptions.axisLine.display) {
          xAxisHeight += xAxisOptions.axisLine.size;
        }

        if (xAxisOptions.tickLine.display) {
          xAxisHeight += xAxisOptions.tickLine.length;
        }

        if (xAxisOptions.tickText.display) {
          xAxisHeight += xAxisOptions.tickText.paddingTop + xAxisOptions.tickText.paddingBottom + xAxisOptions.tickText.size;
        }
      }

      var crossHairVerticalTextHeight = 0;

      if (crossHairOptions.display && crossHairOptions.vertical.display && crossHairOptions.vertical.text.display) {
        crossHairVerticalTextHeight += crossHairOptions.vertical.text.paddingTop + crossHairOptions.vertical.text.paddingBottom + crossHairOptions.vertical.text.borderSize * 2 + crossHairOptions.vertical.text.size;
      }

      return Math.max(xAxisHeight, crossHairVerticalTextHeight);
    }
  }, {
    key: "convertFromPixel",
    value: function convertFromPixel(pixel) {
      return Math.round(this._chartData.coordinateToFloatIndex(pixel)) - 1;
    }
  }, {
    key: "convertToPixel",
    value: function convertToPixel(value) {
      var dataList = this._chartData.dataList();

      var dataSize = dataList.length;

      var dataSpace = this._chartData.dataSpace();

      var deltaFromRight = dataSize + this._chartData.offsetRightBarCount() - value;
      return this._width - (deltaFromRight - 0.5) * dataSpace + this._chartData.barSpace() / 2;
    }
  }]);

  return XAxis;
}(Axis);

var XAxisPane = /*#__PURE__*/function (_Pane) {
  _inherits(XAxisPane, _Pane);

  var _super = _createSuper(XAxisPane);

  function XAxisPane() {
    _classCallCheck(this, XAxisPane);

    return _super.apply(this, arguments);
  }

  _createClass(XAxisPane, [{
    key: "_initBefore",
    value: function _initBefore() {
      this._xAxis = new XAxis(this._chartData);
    }
  }, {
    key: "_createMainWidget",
    value: function _createMainWidget(container, props) {
      return new XAxisWidget({
        container: container,
        chartData: props.chartData,
        xAxis: this._xAxis
      });
    }
  }, {
    key: "computeAxis",
    value: function computeAxis() {
      this._xAxis.computeAxis();
    }
  }, {
    key: "getSelfAxisHeight",
    value: function getSelfAxisHeight() {
      return this._xAxis.getSelfHeight();
    }
  }, {
    key: "xAxis",
    value: function xAxis() {
      return this._xAxis;
    }
  }, {
    key: "setWidth",
    value: function setWidth(mainWidgetWidth, yAxisWidgetWidth) {
      _get(_getPrototypeOf(XAxisPane.prototype), "setWidth", this).call(this, mainWidgetWidth, yAxisWidgetWidth);

      this._xAxis.setWidth(mainWidgetWidth);
    }
  }, {
    key: "setHeight",
    value: function setHeight(height) {
      _get(_getPrototypeOf(XAxisPane.prototype), "setHeight", this).call(this, height);

      this._xAxis.setHeight(height);
    }
  }]);

  return XAxisPane;
}(Pane);

var SeparatorPane = /*#__PURE__*/function () {
  function SeparatorPane(container, chartData, paneIndex, dragEnabled, dragEventHandler) {
    _classCallCheck(this, SeparatorPane);

    this._chartData = chartData;
    this._paneIndex = paneIndex;
    this._width = 0;
    this._offsetLeft = 0;
    this._dragEventHandler = dragEventHandler;

    this._initElement(container, dragEnabled);
  }

  _createClass(SeparatorPane, [{
    key: "_initElement",
    value: function _initElement(container, dragEnabled) {
      this._container = container;
      this._wrapper = this._createElement();
      this._wrapper.style.overflow = 'hidden';
      this._element = this._createElement();
      this._element.style.width = '100%';
      this._element.style.position = 'absolute';
      this._element.style.zIndex = '20';
      this._element.style.height = '5px';

      if (dragEnabled) {
        this._element.style.cursor = 'ns-resize';
        this._dragEvent = new EventBase(this._element, {
          mouseDownEvent: this._mouseDownEvent.bind(this),
          pressedMouseMoveEvent: this._pressedMouseMoveEvent.bind(this)
        }, {
          treatVertTouchDragAsPageScroll: false,
          treatHorzTouchDragAsPageScroll: true
        });
      }

      this._wrapper.appendChild(this._element);

      var lastElement = container.lastChild;

      if (lastElement) {
        container.insertBefore(this._wrapper, lastElement);
      } else {
        container.appendChild(this._wrapper);
      }
    }
    /**
     * 创建div节点
     * @private
     */

  }, {
    key: "_createElement",
    value: function _createElement() {
      var element = document.createElement('div');
      element.style.margin = '0';
      element.style.padding = '0';
      return element;
    }
  }, {
    key: "_mouseDownEvent",
    value: function _mouseDownEvent(event) {
      this._startY = event.pageY;

      this._dragEventHandler.startDrag(this._paneIndex);
    }
  }, {
    key: "_pressedMouseMoveEvent",
    value: function _pressedMouseMoveEvent(event) {
      var dragDistance = event.pageY - this._startY;

      this._dragEventHandler.drag(dragDistance, this._paneIndex);
    }
    /**
     * 获取高度
     * @returns {number}
     */

  }, {
    key: "height",
    value: function height() {
      return this._wrapper.offsetHeight;
    }
    /**
     * 设置尺寸
     * 用于fill属性
     * @param offsetLeft
     * @param width
     */

  }, {
    key: "setSize",
    value: function setSize(offsetLeft, width) {
      this._offsetLeft = offsetLeft;
      this._width = width;
      this.invalidate();
    }
    /**
     * 更新上下两个图表的索引
     * @param paneIndex
     */

  }, {
    key: "updatePaneIndex",
    value: function updatePaneIndex(paneIndex) {
      this._paneIndex = paneIndex;
    }
    /**
     * 刷新
     */

  }, {
    key: "invalidate",
    value: function invalidate() {
      var separator = this._chartData.styleOptions().separator;

      this._wrapper.style.backgroundColor = separator.color;
      this._wrapper.style.height = "".concat(separator.size, "px");
      this._wrapper.style.marginLeft = "".concat(separator.fill ? 0 : this._offsetLeft, "px");
      this._wrapper.style.width = separator.fill ? '100%' : "".concat(this._width, "px");
    }
    /**
     * 将图形转换成图片
     * @returns {HTMLCanvasElement}
     */

  }, {
    key: "getImage",
    value: function getImage() {
      var separator = this._chartData.styleOptions().separator;

      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      var pixelRatio = getPixelRatio(canvas);
      var width = this._wrapper.offsetWidth;
      var height = separator.size;
      canvas.style.width = "".concat(width, "px");
      canvas.style.height = "".concat(height, "px");
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      ctx.scale(pixelRatio, pixelRatio);
      ctx.fillStyle = separator.color;
      ctx.fillRect(this._offsetLeft, 0, width, height);
      return canvas;
    }
    /**
     * 销毁
     */

  }, {
    key: "destroy",
    value: function destroy() {
      if (this._dragEvent) {
        this._dragEvent.destroy();
      }

      this._container.removeChild(this._wrapper);
    }
  }]);

  return SeparatorPane;
}();

var ZoomScrollEventHandler = /*#__PURE__*/function (_EventHandler) {
  _inherits(ZoomScrollEventHandler, _EventHandler);

  var _super = _createSuper(ZoomScrollEventHandler);

  function ZoomScrollEventHandler(chartData) {
    var _this;

    _classCallCheck(this, ZoomScrollEventHandler);

    _this = _super.call(this, chartData); // 开始滚动时坐标点

    _this._startScrollPoint = {}; // 开始触摸时坐标

    _this._touchPoint = {}; // 是否是取消了十字光标

    _this._touchCancelCrossHair = false; // 是否缩放过

    _this._touchZoomed = false; // 用来记录捏合缩放的尺寸

    _this._pinchScale = 1;
    return _this;
  }

  _createClass(ZoomScrollEventHandler, [{
    key: "pinchStartEvent",
    value: function pinchStartEvent() {
      this._pinchScale = 1;
      this._touchZoomed = true;
    }
  }, {
    key: "pinchEvent",
    value: function pinchEvent(middlePoint, scale) {
      var zoomScale = (scale - this._pinchScale) * 5;
      this._pinchScale = scale;

      this._chartData.zoom(zoomScale, middlePoint);
    }
  }, {
    key: "mouseLeaveEvent",
    value: function mouseLeaveEvent(event) {
      if (isMouse(event)) {
        this._chartData.setCrossHairPointPaneTag(null, null);
      }
    }
  }, {
    key: "mouseMoveEvent",
    value: function mouseMoveEvent(event) {
      var _this2 = this;

      if (!isMouse(event)) {
        return;
      }

      this._performCross(event, false, function (cross) {
        _this2._chartData.setCrossHairPointPaneTag({
          x: event.localX,
          y: cross.y
        }, cross.tag);
      }, function () {
        _this2._chartData.setCrossHairPointPaneTag(null, null);
      });
    }
  }, {
    key: "mouseWheelEvent",
    value: function mouseWheelEvent(event) {
      if (!this._checkEventPointX(event.localX)) {
        return;
      }

      var deltaY = -(event.deltaY / 100);

      if (deltaY === 0) {
        return;
      }

      if (event.cancelable) {
        event.preventDefault();
      }

      switch (event.deltaMode) {
        case event.DOM_DELTA_PAGE:
          deltaY *= 120;
          break;

        case event.DOM_DELTA_LINE:
          deltaY *= 32;
          break;
      }

      if (deltaY !== 0) {
        var scale = Math.sign(deltaY) * Math.min(1, Math.abs(deltaY));

        this._chartData.zoom(scale, {
          x: event.localX,
          y: event.localY
        });
      }
    }
  }, {
    key: "mouseClickEvent",
    value: function mouseClickEvent(event) {
      var _this3 = this;

      this._performCross(event, true, function (cross) {
        if (!_this3._touchPoint && !_this3._touchCancelCrossHair && !_this3._touchZoomed) {
          _this3._touchPoint = {
            x: event.localX,
            y: event.localY
          };

          _this3._chartData.setCrossHairPointPaneTag({
            x: event.localX,
            y: cross.y
          }, cross.tag);
        }
      });
    }
  }, {
    key: "mouseDownEvent",
    value: function mouseDownEvent(event) {
      var _this4 = this;

      this._startScrollPoint = {
        x: event.localX,
        y: event.localY
      };

      this._chartData.startScroll();

      this._performCross(event, true, function (cross) {
        var crossHairPoint = {
          x: event.localX,
          y: cross.y
        };
        _this4._touchZoomed = false;

        if (_this4._touchPoint) {
          var xDif = event.localX - _this4._touchPoint.x;
          var yDif = event.localY - _this4._touchPoint.y;
          var radius = Math.sqrt(xDif * xDif + yDif * yDif);

          if (radius < 10) {
            _this4._touchPoint = {
              x: event.localX,
              y: event.localY
            };

            _this4._chartData.setCrossHairPointPaneTag(crossHairPoint, cross.tag);
          } else {
            _this4._touchCancelCrossHair = true;
            _this4._touchPoint = null;

            _this4._chartData.setCrossHairPointPaneTag(null, null);
          }
        } else {
          _this4._touchCancelCrossHair = false;
        }
      });
    }
  }, {
    key: "pressedMouseMoveEvent",
    value: function pressedMouseMoveEvent(event) {
      var _this5 = this;

      this._performCross(event, false, function (cross) {
        var crossHairPoint = {
          x: event.localX,
          y: cross.y
        };

        if (isTouch(event)) {
          if (_this5._touchPoint) {
            _this5._touchPoint = {
              x: event.localX,
              y: event.localY
            };

            _this5._chartData.setCrossHairPointPaneTag(crossHairPoint, cross.tag);

            return;
          }
        }

        var distance = event.localX - _this5._startScrollPoint.x;

        _this5._chartData.setCrossHairPointPaneTag(crossHairPoint, cross.tag);

        _this5._chartData.scroll(distance);
      });
    }
  }, {
    key: "longTapEvent",
    value: function longTapEvent(event) {
      var _this6 = this;

      this._performCross(event, true, function (cross) {
        _this6._touchPoint = {
          x: event.localX,
          y: event.localY
        };

        _this6._chartData.setCrossHairPointPaneTag({
          x: event.localX,
          y: cross.y
        }, cross.tag);
      });
    }
    /**
     * 处理十字光标
     * @param event
     * @param checkTouchEvent
     * @param performFuc
     * @param extendFun
     * @private
     */

  }, {
    key: "_performCross",
    value: function _performCross(event, checkTouchEvent, performFuc, extendFun) {
      if (checkTouchEvent && !isTouch(event)) {
        return;
      }

      if (!this._checkEventPointX(event.localX)) {
        if (extendFun) {
          extendFun();
        }

        return;
      }

      var isPerform = false;

      for (var tag in this._paneContentSize) {
        var size = this._paneContentSize[tag];

        if (event.localY > size.contentTop && event.localY < size.contentBottom) {
          isPerform = true;

          if (performFuc) {
            performFuc({
              tag: tag,
              y: event.localY - size.contentTop
            });
          }

          break;
        }
      }

      if (!isPerform && extendFun) {
        extendFun();
      }
    }
  }]);

  return ZoomScrollEventHandler;
}(EventHandler);

var ArrowKey = {
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight'
};

var KeyBoardEventHandler = /*#__PURE__*/function (_EventHandler) {
  _inherits(KeyBoardEventHandler, _EventHandler);

  var _super = _createSuper(KeyBoardEventHandler);

  function KeyBoardEventHandler() {
    _classCallCheck(this, KeyBoardEventHandler);

    return _super.apply(this, arguments);
  }

  _createClass(KeyBoardEventHandler, [{
    key: "keyBoardDownEvent",

    /**
     * 键盘事件
     * @param event
     */
    value: function keyBoardDownEvent(event) {
      if (event.shiftKey) {
        switch (event.code) {
          case ArrowKey.UP:
            {
              this._chartData.zoom(-0.5);

              break;
            }

          case ArrowKey.DOWN:
            {
              this._chartData.zoom(0.5);

              break;
            }

          case ArrowKey.LEFT:
            {
              this._chartData.startScroll();

              this._chartData.scroll(-this._chartData.dataSpace());

              break;
            }

          case ArrowKey.RIGHT:
            {
              this._chartData.startScroll();

              this._chartData.scroll(this._chartData.dataSpace());

              break;
            }
        }
      }
    }
  }]);

  return KeyBoardEventHandler;
}(EventHandler);

var ChartEvent = /*#__PURE__*/function () {
  function ChartEvent(target, chartData, xAxis, yAxis) {
    _classCallCheck(this, ChartEvent);

    this._target = target;
    this._chartData = chartData;
    this._chartContentSize = {};
    this._event = new EventBase(this._target, {
      pinchStartEvent: this._pinchStartEvent.bind(this),
      pinchEvent: this._pinchEvent.bind(this),
      mouseUpEvent: this._mouseUpEvent.bind(this),
      mouseClickEvent: this._mouseClickEvent.bind(this),
      mouseDownEvent: this._mouseDownEvent.bind(this),
      mouseRightDownEvent: this._mouseRightDownEvent.bind(this),
      mouseLeaveEvent: this._mouseLeaveEvent.bind(this),
      mouseMoveEvent: this._mouseMoveEvent.bind(this),
      mouseWheelEvent: this._mouseWheelEvent.bind(this),
      pressedMouseMoveEvent: this._pressedMouseMoveEvent.bind(this),
      longTapEvent: this._longTapEvent.bind(this)
    }, {
      treatVertTouchDragAsPageScroll: false,
      treatHorzTouchDragAsPageScroll: false
    });
    this._boundKeyBoardDownEvent = this._keyBoardDownEvent.bind(this);

    this._target.addEventListener('keydown', this._boundKeyBoardDownEvent);

    this._boundContextMenuEvent = function (e) {
      e.preventDefault();
    };

    this._target.addEventListener('contextmenu', this._boundContextMenuEvent, false);

    this._zoomScrollEventHandler = new ZoomScrollEventHandler(chartData);
    this._graphicMarkEventHandler = new GraphicMarkEventHandler(chartData, xAxis, yAxis);
    this._keyBoardEventHandler = new KeyBoardEventHandler(chartData);
  }

  _createClass(ChartEvent, [{
    key: "_keyBoardDownEvent",
    value: function _keyBoardDownEvent(event) {
      this._keyBoardEventHandler.keyBoardDownEvent(event);
    }
  }, {
    key: "_pinchStartEvent",
    value: function _pinchStartEvent() {
      this._zoomScrollEventHandler.pinchStartEvent();
    }
  }, {
    key: "_pinchEvent",
    value: function _pinchEvent(middlePoint, scale) {
      this._zoomScrollEventHandler.pinchEvent(middlePoint, scale);
    }
  }, {
    key: "_mouseUpEvent",
    value: function _mouseUpEvent(event) {
      this._target.style.cursor = 'crosshair';
      event.localX -= this._chartContentSize.contentLeft;

      this._graphicMarkEventHandler.mouseUpEvent(event);
    }
  }, {
    key: "_mouseLeaveEvent",
    value: function _mouseLeaveEvent(event) {
      if (this._checkZoomScroll()) {
        event.localX -= this._chartContentSize.contentLeft;

        this._zoomScrollEventHandler.mouseLeaveEvent(event);
      }
    }
  }, {
    key: "_mouseMoveEvent",
    value: function _mouseMoveEvent(event) {
      event.localX -= this._chartContentSize.contentLeft;

      if (this._chartData.shouldInvalidateGraphicMark()) {
        this._graphicMarkEventHandler.mouseMoveEvent(event);
      }

      if (this._checkZoomScroll()) {
        this._zoomScrollEventHandler.mouseMoveEvent(event);
      }
    }
  }, {
    key: "_mouseWheelEvent",
    value: function _mouseWheelEvent(event) {
      if (this._checkZoomScroll()) {
        this._zoomScrollEventHandler.mouseWheelEvent(event);
      }
    }
  }, {
    key: "_mouseClickEvent",
    value: function _mouseClickEvent(event) {
      if (this._checkZoomScroll()) {
        event.localX -= this._chartContentSize.contentLeft;

        this._zoomScrollEventHandler.mouseClickEvent(event);
      }
    }
  }, {
    key: "_mouseDownEvent",
    value: function _mouseDownEvent(event) {
      this._target.style.cursor = 'pointer';
      event.localX -= this._chartContentSize.contentLeft;

      this._graphicMarkEventHandler.mouseDownEvent(event);

      if (this._checkZoomScroll()) {
        this._zoomScrollEventHandler.mouseDownEvent(event);
      }
    }
  }, {
    key: "_mouseRightDownEvent",
    value: function _mouseRightDownEvent(event) {
      event.localX -= this._chartContentSize.contentLeft;

      this._graphicMarkEventHandler.mouseRightDownEvent(event);
    }
  }, {
    key: "_pressedMouseMoveEvent",
    value: function _pressedMouseMoveEvent(event) {
      event.localX -= this._chartContentSize.contentLeft;

      if (this._chartData.dragGraphicMarkFlag()) {
        this._graphicMarkEventHandler.pressedMouseMoveEvent(event); // 这里判断一下，如果是在拖拽图形标记，让十字光标不显示


        if (this._chartData.crossHair().paneTag) {
          this._chartData.setCrossHairPointPaneTag(null, null);
        }
      }

      if (this._checkZoomScroll()) {
        this._zoomScrollEventHandler.pressedMouseMoveEvent(event);
      }
    }
  }, {
    key: "_longTapEvent",
    value: function _longTapEvent(event) {
      if (this._checkZoomScroll()) {
        event.localX -= this._chartContentSize.contentLeft;

        this._zoomScrollEventHandler.longTapEvent(event);
      }
    }
  }, {
    key: "_checkZoomScroll",
    value: function _checkZoomScroll() {
      return !this._chartData.dragGraphicMarkFlag() && this._chartData.graphicMarkType() === GraphicMarkType.NONE;
    }
  }, {
    key: "setChartContentSize",
    value: function setChartContentSize(chartContentSize) {
      this._chartContentSize = chartContentSize;

      this._zoomScrollEventHandler.setChartContentSize(chartContentSize);

      this._graphicMarkEventHandler.setChartContentSize(chartContentSize);
    }
  }, {
    key: "setPaneContentSize",
    value: function setPaneContentSize(paneContentSize) {
      this._zoomScrollEventHandler.setPaneContentSize(paneContentSize);

      this._graphicMarkEventHandler.setPaneContentSize(paneContentSize);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this._event.destroy();

      this._target.removeEventListener('keydown', this._boundKeyBoardDownEvent);

      this._target.removeEventListener('contextmenu', this._boundContextMenuEvent);
    }
  }]);

  return ChartEvent;
}();

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
function throttle(func) {
  var wait = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 16;
  var previous = 0;
  return function () {
    var now = Date.now();
    var context = this;
    var args = arguments;

    if (now - previous > wait) {
      func.apply(context, args);
      previous = now;
    }
  };
}

var DEFAULT_TECHNICAL_INDICATOR_PANE_HEIGHT = 100;
var TECHNICAL_INDICATOR_NAME_PREFIX = 'technical_indicator_';
var CANDLE_STICK_PANE_TAG = 'candle_stick_pane_tag';

var ChartPane = /*#__PURE__*/function () {
  function ChartPane(container, styleOptions) {
    _classCallCheck(this, ChartPane);

    this._initChartContainer(container);

    this._technicalIndicatorBaseId = 0;
    this._technicalIndicatorPanes = [];
    this._separatorPanes = [];
    this._separatorDragStartTechnicalIndicatorHeight = 0;
    this._chartData = new ChartData(styleOptions, this._updatePane.bind(this));
    this._xAxisPane = new XAxisPane({
      container: this._chartContainer,
      chartData: this._chartData
    });
    this._candleStickPane = new CandleStickPane({
      container: this._chartContainer,
      chartData: this._chartData,
      xAxis: this._xAxisPane.xAxis(),
      technicalIndicatorType: MA,
      tag: CANDLE_STICK_PANE_TAG
    });
    this._chartEvent = new ChartEvent(this._chartContainer, this._chartData, this._xAxisPane.xAxis(), this._candleStickPane.yAxis());

    this._measurePaneHeight();

    this._layoutPane();
  }
  /**
   * 初始化图表容器
   * @param container
   * @private
   */


  _createClass(ChartPane, [{
    key: "_initChartContainer",
    value: function _initChartContainer(container) {
      this._container = container;
      this._chartContainer = document.createElement('div');
      this._chartContainer.style.userSelect = 'none';
      this._chartContainer.style.webkitUserSelect = 'none';
      this._chartContainer.style.msUserSelect = 'none';
      this._chartContainer.style.MozUserSelect = 'none';
      this._chartContainer.style.webkitTapHighlightColor = 'transparent';
      this._chartContainer.style.position = 'relative';
      this._chartContainer.style.outline = 'none';
      this._chartContainer.style.borderStyle = 'none';
      this._chartContainer.style.width = '100%';
      this._chartContainer.style.cursor = 'crosshair';
      this._chartContainer.tabIndex = 1;
      container.appendChild(this._chartContainer);
    }
    /**
     * 分割线拖拽开始
     * @param paneIndex
     * @private
     */

  }, {
    key: "_separatorStartDrag",
    value: function _separatorStartDrag(paneIndex) {
      this._separatorDragStartTechnicalIndicatorHeight = this._technicalIndicatorPanes[paneIndex].height();
    }
    /**
     * 分割线拖拽
     * @param dragDistance
     * @param paneIndex
     * @private
     */

  }, {
    key: "_separatorDrag",
    value: function _separatorDrag(dragDistance, paneIndex) {
      var height = this._separatorDragStartTechnicalIndicatorHeight - dragDistance;

      if (height < 0) {
        height = 0;
      }

      this._technicalIndicatorPanes[paneIndex].setHeight(height);

      this._measurePaneHeight();

      this._candleStickPane.layout();

      var _iterator = _createForOfIteratorHelper(this._technicalIndicatorPanes),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var pane = _step.value;
          pane.layout();
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
    /**
     * 重新布局
     * @private
     */

  }, {
    key: "_layoutPane",
    value: function _layoutPane() {
      this._measurePaneWidth();

      this._xAxisPane.computeAxis();

      this._xAxisPane.layout();

      this._candleStickPane.layout();

      var _iterator2 = _createForOfIteratorHelper(this._technicalIndicatorPanes),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var pane = _step2.value;
          pane.layout();
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
    /**
     * 更新所有pane
     * @private
     */

  }, {
    key: "_updatePane",
    value: function _updatePane() {
      var invalidateLevel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : InvalidateLevel.FULL;

      if (invalidateLevel === InvalidateLevel.FLOAT_LAYER) {
        this._xAxisPane.invalidate(invalidateLevel);

        this._candleStickPane.invalidate(invalidateLevel);

        var _iterator3 = _createForOfIteratorHelper(this._technicalIndicatorPanes),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var pane = _step3.value;
            pane.invalidate(invalidateLevel);
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      } else {
        this._candleStickPane.computeAxis();

        if (invalidateLevel !== InvalidateLevel.GRAPHIC_MARK) {
          var _iterator4 = _createForOfIteratorHelper(this._technicalIndicatorPanes),
              _step4;

          try {
            for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
              var _pane = _step4.value;

              _pane.computeAxis();
            }
          } catch (err) {
            _iterator4.e(err);
          } finally {
            _iterator4.f();
          }
        }

        this._layoutPane();
      }
    }
    /**
     * 计算所有pane的指标
     * @private
     */

  }, {
    key: "_calcAllPaneTechnicalIndicator",
    value: function _calcAllPaneTechnicalIndicator() {
      var _this = this;

      Promise.resolve().then(function (_) {
        _this._chartData.calcTechnicalIndicator(_this._candleStickPane);

        var _iterator5 = _createForOfIteratorHelper(_this._technicalIndicatorPanes),
            _step5;

        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var pane = _step5.value;

            _this._chartData.calcTechnicalIndicator(pane);
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }

        _this._layoutPane();
      });
    }
    /**
     * 测量pane高度
     * @private
     */

  }, {
    key: "_measurePaneHeight",
    value: function _measurePaneHeight() {
      var styleOptions = this._chartData.styleOptions();

      var paneHeight = this._container.offsetHeight;
      var separatorHeight = styleOptions.separator.size * this._separatorPanes.length;

      var xAxisHeight = this._xAxisPane.getSelfAxisHeight();

      var paneExcludeXAxisSeparatorHeight = paneHeight - xAxisHeight - separatorHeight;
      var technicalIndicatorPaneTotalHeight = 0;

      var _iterator6 = _createForOfIteratorHelper(this._technicalIndicatorPanes),
          _step6;

      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var pane = _step6.value;

          var _paneHeight = pane.height();

          technicalIndicatorPaneTotalHeight += _paneHeight; // 修复拖拽会超出容器高度问题

          if (technicalIndicatorPaneTotalHeight > paneExcludeXAxisSeparatorHeight) {
            var difHeight = technicalIndicatorPaneTotalHeight - paneExcludeXAxisSeparatorHeight;
            technicalIndicatorPaneTotalHeight = paneExcludeXAxisSeparatorHeight;
            pane.setHeight(_paneHeight - difHeight);
          }
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }

      var candleStickPaneHeight = paneExcludeXAxisSeparatorHeight - technicalIndicatorPaneTotalHeight;
      var paneContentSize = {};
      paneContentSize[CANDLE_STICK_PANE_TAG] = {
        contentTop: 0,
        contentBottom: candleStickPaneHeight
      };
      var contentTop = candleStickPaneHeight;
      var contentBottom = candleStickPaneHeight;

      this._candleStickPane.setHeight(candleStickPaneHeight);

      for (var i = 0; i < this._technicalIndicatorPanes.length; i++) {
        var technicalIndicatorPane = this._technicalIndicatorPanes[i];
        var technicalIndicatorPaneHeight = technicalIndicatorPane.height();
        technicalIndicatorPane.setHeight(technicalIndicatorPaneHeight);
        contentBottom += technicalIndicatorPaneHeight;
        paneContentSize[technicalIndicatorPane.tag()] = {
          contentTop: contentTop,
          contentBottom: contentBottom
        };
        contentTop = contentBottom;
      }

      this._xAxisPane.setHeight(xAxisHeight);

      this._chartEvent.setPaneContentSize(paneContentSize);
    }
    /**
     * 测量pan宽度
     * @private
     */

  }, {
    key: "_measurePaneWidth",
    value: function _measurePaneWidth() {
      var styleOptions = this._chartData.styleOptions();

      var yAxisOptions = styleOptions.yAxis;
      var isYAxisLeft = yAxisOptions.position === YAxisPosition.LEFT;
      var isOutside = !yAxisOptions.inside;
      var paneWidth = this._container.offsetWidth;
      var mainWidth;
      var yAxisWidth;
      var yAxisOffsetLeft;
      var mainOffsetLeft;

      if (isOutside) {
        yAxisWidth = this._candleStickPane.getSelfAxisWidth();

        var _iterator7 = _createForOfIteratorHelper(this._technicalIndicatorPanes),
            _step7;

        try {
          for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
            var pane = _step7.value;
            yAxisWidth = Math.max(yAxisWidth, pane.getSelfAxisWidth());
          }
        } catch (err) {
          _iterator7.e(err);
        } finally {
          _iterator7.f();
        }

        mainWidth = paneWidth - yAxisWidth;

        if (isYAxisLeft) {
          yAxisOffsetLeft = 0;
          mainOffsetLeft = yAxisWidth;
        } else {
          mainOffsetLeft = 0;
          yAxisOffsetLeft = paneWidth - yAxisWidth;
        }
      } else {
        mainWidth = paneWidth;
        yAxisWidth = paneWidth;
        yAxisOffsetLeft = 0;
        mainOffsetLeft = 0;
      }

      this._chartData.setTotalDataSpace(mainWidth);

      this._candleStickPane.setWidth(mainWidth, yAxisWidth);

      this._candleStickPane.setOffsetLeft(mainOffsetLeft, yAxisOffsetLeft);

      for (var i = 0; i < this._technicalIndicatorPanes.length; i++) {
        var technicalIndicatorPane = this._technicalIndicatorPanes[i];
        var separatorPane = this._separatorPanes[i];
        technicalIndicatorPane.setWidth(mainWidth, yAxisWidth);
        technicalIndicatorPane.setOffsetLeft(mainOffsetLeft, yAxisOffsetLeft);
        separatorPane.setSize(mainOffsetLeft, mainWidth);
      }

      this._xAxisPane.setWidth(mainWidth, yAxisWidth);

      this._xAxisPane.setOffsetLeft(mainOffsetLeft, yAxisOffsetLeft);

      this._chartEvent.setChartContentSize({
        contentLeft: mainOffsetLeft,
        contentRight: mainOffsetLeft + mainWidth
      });
    }
    /**
     * 获取图表上的数据
     * @returns {ChartData}
     */

  }, {
    key: "chartData",
    value: function chartData() {
      return this._chartData;
    }
    /**
     * 重置尺寸
     */

  }, {
    key: "resize",
    value: function resize() {
      this._measurePaneHeight();

      this._candleStickPane.computeAxis();

      var _iterator8 = _createForOfIteratorHelper(this._technicalIndicatorPanes),
          _step8;

      try {
        for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
          var pane = _step8.value;
          pane.computeAxis();
        }
      } catch (err) {
        _iterator8.e(err);
      } finally {
        _iterator8.f();
      }

      this._layoutPane();
    }
    /**
     * 加载技术指标参数
     * @param technicalIndicatorType
     * @param params
     */

  }, {
    key: "applyTechnicalIndicatorParams",
    value: function applyTechnicalIndicatorParams(technicalIndicatorType, params) {
      var _this2 = this;

      var info = this._chartData.technicalIndicator(technicalIndicatorType);

      if (info.structure && isArray(params)) {
        var _iterator9 = _createForOfIteratorHelper(params),
            _step9;

        try {
          for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
            var v = _step9.value;

            if (!isNumber(v) || v <= 0 || parseInt(v, 10) !== v) {
              return;
            }
          }
        } catch (err) {
          _iterator9.e(err);
        } finally {
          _iterator9.f();
        }

        info.calcParams = clone(params);
        Promise.resolve().then(function (_) {
          if (_this2._candleStickPane.technicalIndicator().name === technicalIndicatorType) {
            _this2._chartData.calcTechnicalIndicator(_this2._candleStickPane);
          }

          var _iterator10 = _createForOfIteratorHelper(_this2._technicalIndicatorPanes),
              _step10;

          try {
            for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
              var pane = _step10.value;

              if (pane.technicalIndicator().name === technicalIndicatorType) {
                _this2._chartData.calcTechnicalIndicator(pane);
              }
            }
          } catch (err) {
            _iterator10.e(err);
          } finally {
            _iterator10.f();
          }

          _this2._layoutPane();
        });
      }
    }
    /**
     * 处理数组数据
     * @param dataList
     * @param more
     * @param extendFun
     * @private
     */

  }, {
    key: "_applyDataList",
    value: function _applyDataList(dataList, more, extendFun) {
      if (isArray(dataList)) {
        if (isFunction(extendFun)) {
          extendFun();
        }

        this._chartData.addData(dataList, 0, more);

        this._calcAllPaneTechnicalIndicator();
      }
    }
    /**
     * 添加新数据
     * @param dataList
     * @param more
     */

  }, {
    key: "applyNewData",
    value: function applyNewData(dataList, more) {
      var _this3 = this;

      this._applyDataList(dataList, more, function () {
        _this3._chartData.clearDataList();
      });
    }
    /**
     * 添加更多数据
     * @param dataList
     * @param more
     */

  }, {
    key: "applyMoreData",
    value: function applyMoreData(dataList, more) {
      this._applyDataList(dataList, more);
    }
    /**
     * 更新数据
     * @param data
     */

  }, {
    key: "updateData",
    value: function updateData(data) {
      if (isObject(data) && !isArray(data)) {
        var dataList = this._chartData.dataList();

        var dataSize = dataList.length; // 这里判断单个数据应该添加到哪个位置

        var timestamp = +formatValue(data, 'timestamp', 0);
        var lastDataTimestamp = +formatValue(dataList[dataSize - 1], 'timestamp', 0);
        var pos = dataSize;

        if (timestamp === lastDataTimestamp) {
          pos = dataSize - 1;
        }

        this._chartData.addData(data, pos);

        this._calcAllPaneTechnicalIndicator();
      }
    }
    /**
     * 设置蜡烛图图表类型
     * @param type
     */

  }, {
    key: "setCandleStickChartType",
    value: function setCandleStickChartType(type) {
      this._candleStickPane.setChartType(type);
    }
    /**
     * 创建一个指标
     * @param technicalIndicatorType
     * @param height
     * @param dragEnabled
     * @returns {string}
     */

  }, {
    key: "createTechnicalIndicator",
    value: function createTechnicalIndicator() {
      var technicalIndicatorType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : MACD;
      var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_TECHNICAL_INDICATOR_PANE_HEIGHT;
      var dragEnabled = arguments.length > 2 ? arguments[2] : undefined;

      var _this$_chartData$tech = this._chartData.technicalIndicator(technicalIndicatorType),
          TechnicalIndicator = _this$_chartData$tech.structure;

      if (!TechnicalIndicator) {
        {
          console.warn('The corresponding technical indicator type cannot be found and cannot be created!!!');
        }

        return null;
      }

      var technicalIndicatorPaneCount = this._technicalIndicatorPanes.length;
      var isDrag = isBoolean(dragEnabled) ? dragEnabled : true;

      this._separatorPanes.push(new SeparatorPane(this._chartContainer, this._chartData, technicalIndicatorPaneCount, isDrag, {
        startDrag: this._separatorStartDrag.bind(this),
        drag: throttle(this._separatorDrag.bind(this), 50)
      }));

      this._technicalIndicatorBaseId++;
      var tag = "".concat(TECHNICAL_INDICATOR_NAME_PREFIX).concat(this._technicalIndicatorBaseId);
      var technicalIndicatorPane = new TechnicalIndicatorPane({
        container: this._chartContainer,
        chartData: this._chartData,
        xAxis: this._xAxisPane.xAxis(),
        technicalIndicatorType: technicalIndicatorType,
        tag: tag
      });
      technicalIndicatorPane.setHeight(height);

      this._technicalIndicatorPanes.push(technicalIndicatorPane);

      this._measurePaneHeight();

      this._layoutPane();

      return tag;
    }
    /**
     * 移除一个指标
     * @param tag
     */

  }, {
    key: "removeTechnicalIndicator",
    value: function removeTechnicalIndicator(tag) {
      var panePos = -1;

      for (var i = 0; i < this._technicalIndicatorPanes.length; i++) {
        var pane = this._technicalIndicatorPanes[i];

        if (pane.tag() === tag) {
          panePos = i;
          break;
        }
      }

      if (panePos !== -1) {
        this._technicalIndicatorPanes[panePos].destroy();

        this._separatorPanes[panePos].destroy();

        this._technicalIndicatorPanes.splice(panePos, 1);

        this._separatorPanes.splice(panePos, 1);

        for (var _i = 0; _i < this._separatorPanes.length; _i++) {
          this._separatorPanes[_i].updatePaneIndex(_i);
        }

        this._measurePaneHeight();

        this._layoutPane();
      }
    }
    /**
     * 设置指标类型
     * @param tag
     * @param technicalIndicatorType
     */

  }, {
    key: "setTechnicalIndicatorType",
    value: function setTechnicalIndicatorType(tag, technicalIndicatorType) {
      if (tag === CANDLE_STICK_PANE_TAG) {
        this._candleStickPane.setTechnicalIndicatorType(technicalIndicatorType);

        this._layoutPane();
      } else {
        var p;

        var _iterator11 = _createForOfIteratorHelper(this._technicalIndicatorPanes),
            _step11;

        try {
          for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
            var pane = _step11.value;

            if (pane.tag() === tag) {
              p = pane;
              break;
            }
          }
        } catch (err) {
          _iterator11.e(err);
        } finally {
          _iterator11.f();
        }

        if (p) {
          var _this$_chartData$tech2 = this._chartData.technicalIndicator(technicalIndicatorType),
              TechnicalIndicator = _this$_chartData$tech2.structure;

          if (!TechnicalIndicator) {
            this.removeTechnicalIndicator(tag);
          } else {
            p.setTechnicalIndicatorType(technicalIndicatorType);

            this._layoutPane();
          }
        }
      }
    }
    /**
     * 设置时区
     * @param timezone
     */

  }, {
    key: "setTimezone",
    value: function setTimezone(timezone) {
      this._chartData.setTimezone(timezone);

      this._xAxisPane.invalidate(InvalidateLevel.FULL);
    }
    /**
     * 获取图表转换为图片后url
     * @param includeFloatLayer,
     * @param includeGraphicMark
     * @param type
     * @param backgroundColor
     */

  }, {
    key: "getConvertPictureUrl",
    value: function getConvertPictureUrl(includeFloatLayer, includeGraphicMark) {
      var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'jpeg';
      var backgroundColor = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '#333333';

      if (type !== 'png' && type !== 'jpeg' && type !== 'bmp') {
        throw new Error('Picture format only supports jpeg, png and bmp!!!');
      }

      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      var pixelRatio = getPixelRatio(canvas);
      var width = this._chartContainer.offsetWidth;
      var height = this._chartContainer.offsetHeight;
      canvas.style.width = "".concat(width, "px");
      canvas.style.height = "".concat(height, "px");
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      ctx.scale(pixelRatio, pixelRatio);
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);
      var offsetTop = 0;

      var candleStickPaneHeight = this._candleStickPane.height();

      ctx.drawImage(this._candleStickPane.getImage(includeFloatLayer, includeGraphicMark), 0, offsetTop, width, candleStickPaneHeight);
      offsetTop += candleStickPaneHeight;

      for (var i = 0; i < this._separatorPanes.length; i++) {
        var separatorPane = this._separatorPanes[i];
        var separatorPaneHeight = separatorPane.height();
        var technicalIndicatorPane = this._technicalIndicatorPanes[i];
        var technicalIndicatorPaneHeight = technicalIndicatorPane.height();
        ctx.drawImage(separatorPane.getImage(), 0, offsetTop, width, separatorPaneHeight);
        offsetTop += separatorPaneHeight;
        ctx.drawImage(technicalIndicatorPane.getImage(includeFloatLayer), 0, offsetTop, width, technicalIndicatorPaneHeight);
        offsetTop += technicalIndicatorPaneHeight;
      }

      ctx.drawImage(this._xAxisPane.getImage(includeFloatLayer), 0, offsetTop, width, this._xAxisPane.height());
      return canvas.toDataURL("image/".concat(type));
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this._candleStickPane.destroy();

      this._technicalIndicatorPanes.forEach(function (pane) {
        pane.destroy();
      });

      this._separatorPanes.forEach(function (pane) {
        pane.destroy();
      });

      this._xAxisPane.destroy();

      this._container.removeChild(this._chartContainer);

      this._chartEvent.destroy();
    }
  }]);

  return ChartPane;
}();

var Chart = /*#__PURE__*/function () {
  function Chart(container, styleOptions) {
    _classCallCheck(this, Chart);

    this._chartPane = new ChartPane(container, styleOptions);
  }
  /**
   * 设置样式配置
   * @param options
   */


  _createClass(Chart, [{
    key: "setStyleOptions",
    value: function setStyleOptions(options) {
      if (options) {
        this._chartPane.chartData().applyStyleOptions(options);

        this._chartPane.resize();
      }
    }
    /**
     * 获取样式配置
     * @returns {[]|*[]}
     */

  }, {
    key: "getStyleOptions",
    value: function getStyleOptions() {
      return clone(this._chartPane.chartData().styleOptions());
    }
    /**
     * 加载技术指标参数
     * @param technicalIndicatorType
     * @param params
     */

  }, {
    key: "setTechnicalIndicatorParams",
    value: function setTechnicalIndicatorParams(technicalIndicatorType, params) {
      if (technicalIndicatorType) {
        this._chartPane.applyTechnicalIndicatorParams(technicalIndicatorType, params);
      }
    }
    /**
     * 获取技术指标参数配置
     */

  }, {
    key: "getTechnicalIndicatorParamOptions",
    value: function getTechnicalIndicatorParamOptions() {
      return this._chartPane.chartData().technicalIndicatorCalcParams();
    }
    /**
     * 加载精度
     * @param pricePrecision
     * @param volumePrecision
     */

  }, {
    key: "setPrecision",
    value: function setPrecision(pricePrecision, volumePrecision) {
      this._chartPane.chartData().applyPrecision(pricePrecision, volumePrecision);
    }
    /**
     * 设置技术指标精度
     * @param precision
     * @param technicalIndicatorType
     */

  }, {
    key: "setTechnicalIndicatorPrecision",
    value: function setTechnicalIndicatorPrecision(precision, technicalIndicatorType) {
      this._chartPane.chartData().applyTechnicalIndicatorPrecision(precision, technicalIndicatorType);
    }
    /**
     * 设置时区
     * @param timezone
     */

  }, {
    key: "setTimezone",
    value: function setTimezone(timezone) {
      this._chartPane.setTimezone(timezone);
    }
    /**
     * 重置尺寸，总是会填充父容器
     */

  }, {
    key: "resize",
    value: function resize() {
      this._chartPane.resize();
    }
    /**
     * 设置右边间距
     * @param space
     */

  }, {
    key: "setOffsetRightSpace",
    value: function setOffsetRightSpace(space) {
      this._chartPane.chartData().setOffsetRightSpace(space);
    }
    /**
     * 设置左边可见的最小bar数量
     * @param barCount
     */

  }, {
    key: "setLeftMinVisibleBarCount",
    value: function setLeftMinVisibleBarCount(barCount) {
      this._chartPane.chartData().setLeftMinVisibleBarCount(barCount);
    }
    /**
     * 设置右边可见的最小bar数量
     * @param barCount
     */

  }, {
    key: "setRightMinVisibleBarCount",
    value: function setRightMinVisibleBarCount(barCount) {
      this._chartPane.chartData().setRightMinVisibleBarCount(barCount);
    }
    /**
     * 设置一条数据的空间
     * @param space
     */

  }, {
    key: "setDataSpace",
    value: function setDataSpace(space) {
      this._chartPane.chartData().setDataSpace(space);
    }
    /**
     * 清空数据
     */

  }, {
    key: "clearData",
    value: function clearData() {
      this._chartPane.chartData().clearDataList();
    }
    /**
     * 获取数据源
     */

  }, {
    key: "getDataList",
    value: function getDataList() {
      return this._chartPane.chartData().dataList();
    }
    /**
     * 添加新数据
     * @param dataList
     * @param more
     */

  }, {
    key: "applyNewData",
    value: function applyNewData(dataList, more) {
      this._chartPane.applyNewData(dataList, more);
    }
    /**
     * 添加历史更多数据
     * @param dataList
     * @param more
     */

  }, {
    key: "applyMoreData",
    value: function applyMoreData(dataList, more) {
      this._chartPane.applyMoreData(dataList, more);
    }
    /**
     * 更新数据
     * @param data
     */

  }, {
    key: "updateData",
    value: function updateData(data) {
      this._chartPane.updateData(data);
    }
    /**
     * 设置加载更多回调
     * @param cb
     */

  }, {
    key: "loadMore",
    value: function loadMore(cb) {
      this._chartPane.chartData().loadMore(cb);
    }
    /**
     * 设置蜡烛图表类型
     * @param type
     */

  }, {
    key: "setCandleStickChartType",
    value: function setCandleStickChartType(type) {
      this._chartPane.setCandleStickChartType(type);
    }
    /**
     * 设置蜡烛图技术指标类型
     * @param technicalIndicatorType
     */

  }, {
    key: "setCandleStickTechnicalIndicatorType",
    value: function setCandleStickTechnicalIndicatorType(technicalIndicatorType) {
      if (technicalIndicatorType) {
        this._chartPane.setTechnicalIndicatorType(CANDLE_STICK_PANE_TAG, technicalIndicatorType);
      }
    }
    /**
     * 设置技术指标类型
     * @param tag
     * @param technicalIndicatorType
     */

  }, {
    key: "setTechnicalIndicatorType",
    value: function setTechnicalIndicatorType(tag, technicalIndicatorType) {
      if (tag) {
        this._chartPane.setTechnicalIndicatorType(tag, technicalIndicatorType);
      }
    }
    /**
     * 创建一个技术指标
     * @param technicalIndicatorType
     * @param height
     * @param dragEnabled
     * @returns {string}
     */

  }, {
    key: "createTechnicalIndicator",
    value: function createTechnicalIndicator(technicalIndicatorType, height, dragEnabled) {
      return this._chartPane.createTechnicalIndicator(technicalIndicatorType, height, dragEnabled);
    }
    /**
     * 添加自定义技术指标
     * @param technicalIndicatorInfo
     */

  }, {
    key: "addCustomTechnicalIndicator",
    value: function addCustomTechnicalIndicator(technicalIndicatorInfo) {
      this._chartPane.chartData().addCustomTechnicalIndicator(technicalIndicatorInfo);
    }
    /**
     * 移除一个技术指标
     * @param tag
     */

  }, {
    key: "removeTechnicalIndicator",
    value: function removeTechnicalIndicator(tag) {
      if (tag) {
        this._chartPane.removeTechnicalIndicator(tag);
      }
    }
    /**
     * 添加图形标记
     * @param type
     */

  }, {
    key: "addGraphicMark",
    value: function addGraphicMark(type) {
      var graphicMarkType = this._chartPane.chartData().graphicMarkType();

      if (graphicMarkType !== type) {
        var graphicMarkDatas = this._chartPane.chartData().graphicMarkData();

        var graphicMarkData = graphicMarkDatas[graphicMarkType];

        if (graphicMarkData && isArray(graphicMarkData)) {
          graphicMarkData.splice(graphicMarkData.length - 1, 1);
          graphicMarkDatas[graphicMarkType] = graphicMarkData;
        }

        if (!graphicMarkDatas.hasOwnProperty(type)) {
          type = GraphicMarkType.NONE;
        }

        this._chartPane.chartData().setGraphicMarkType(type);

        this._chartPane.chartData().setGraphicMarkData(graphicMarkDatas);
      }
    }
    /**
     * 移除所有标记图形
     */

  }, {
    key: "removeAllGraphicMark",
    value: function removeAllGraphicMark() {
      var graphicMarkDatas = this._chartPane.chartData().graphicMarkData();

      var newGraphicMarkDatas = {};
      Object.keys(graphicMarkDatas).forEach(function (key) {
        newGraphicMarkDatas[key] = [];
      });

      this._chartPane.chartData().setGraphicMarkType(GraphicMarkType.NONE);

      this._chartPane.chartData().setGraphicMarkData(newGraphicMarkDatas);
    }
    /**
     * 获取将图表装换成图片后的url
     * @param includeFloatLayer
     * @param includeGraphicMark
     * @param type
     * @param backgroundColor
     */

  }, {
    key: "getConvertPictureUrl",
    value: function getConvertPictureUrl(includeFloatLayer, includeGraphicMark, type, backgroundColor) {
      return this._chartPane.getConvertPictureUrl(includeFloatLayer, includeGraphicMark, type, backgroundColor);
    }
    /**
     * 销毁
     */

  }, {
    key: "destroy",
    value: function destroy() {
      this._chartPane.destroy();
    }
  }]);

  return Chart;
}();

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
var instances = {};
var chartBaseId = 1;
var CHART_NAME_PREFIX = 'k_line_chart_';
/**
 * 获取版本号
 * @returns {string}
 */

function version() {
  return '5.5.1';
}
/**
 * 初始化
 * @param ds
 * @param style
 * @returns {Chart}
 */


function init(ds) {
  var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var errorMessage = 'Chart version is 5.5.1. Root dom is null, can not initialize the chart!!!';
  var container = ds;

  if (!container) {
    throw new Error(errorMessage);
  }

  if (typeof container === 'string') {
    container = document.getElementById(ds) || document.getElementsByClassName(ds);
  }

  if (!container) {
    throw new Error(errorMessage);
  }

  var instance = instances[container.chartId || ''];

  if (instance) {
    {
      console.warn('The chart has been initialized on the dom！！！');
    }

    return instance;
  }

  var id = "".concat(CHART_NAME_PREFIX).concat(chartBaseId++);
  var chart = new Chart(container, style);
  chart.id = id;
  container.chartId = id;
  instances[id] = chart;
  return chart;
}
/**
 * 销毁
 * @param dcs
 */


function dispose(dcs) {
  if (dcs) {
    var id;

    if (typeof dcs === 'string') {
      dcs = document.getElementById(dcs) || document.getElementsByClassName(dcs);
      id = dcs.chartId;
    }

    if (!id) {
      id = dcs.chartId;
    }

    if (!id && dcs instanceof Chart) {
      id = dcs.id;
    }

    if (id) {
      instances[id].destroy();
      delete instances[id];
    }
  }
}

exports.dispose = dispose;
exports.init = init;
exports.version = version;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=klinecharts.development.js.map
