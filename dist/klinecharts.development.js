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

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
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

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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
    noChangeColor: '#666666'
  },
  priceMark: {
    display: true,
    high: {
      display: true,
      color: '#D9D9D9',
      textMargin: 5,
      textSize: 10,
      textFamily: 'Arial'
    },
    low: {
      display: true,
      color: '#D9D9D9',
      textMargin: 5,
      textSize: 10,
      textFamily: 'Arial'
    },
    last: {
      display: true,
      upColor: '#26A69A',
      downColor: '#EF5350',
      noChangeColor: '#666666',
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
        family: 'Arial'
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
};
/**
 * 默认的技术指标图配置
 * @type {{decreasingColor: string, lineColors: [string, string, string, string, string], increasingColor: string, lineSize: number}}
 */

var defaultTechnicalIndicator = {
  bar: {
    upColor: '#26A69A',
    downColor: '#EF5350',
    noChangeColor: '#666666'
  },
  line: {
    size: 1,
    colors: ['#D9D9D9', '#F5A623', '#F601FF', '#1587DD', '#1e88e5']
  },
  lastValueMark: {
    display: false,
    textColor: '#ffffff',
    textSize: 12,
    textFamily: 'Arial',
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
    family: 'Arial',
    margin: 3
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
   * x轴最大宽度
   */
  maxWidth: 100,

  /**
   * x轴最小宽度
   */
  minWidth: 60,

  /**
   * y轴类型
   */
  type: YAxisType.NORMAL,

  /**
   * 轴位置
   */
  position: YAxisPosition.RIGHT,

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
    position: YAxisTextPosition.OUTSIDE,
    display: true,
    color: '#D9D9D9',
    size: 12,
    family: 'Arial',
    margin: 3
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
        family: 'Arial',
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
        family: 'Arial',
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
        family: 'Arial',
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
        family: 'Arial',
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
    family: 'Arial',
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

var _defaultTechnicalIndi;

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
var TechnicalIndicatorType = {
  NO: 'NO',
  AVERAGE: 'AVERAGE',
  MA: 'MA',
  EMA: 'EMA',
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
var defaultTechnicalIndicatorParamOptions = (_defaultTechnicalIndi = {}, _defineProperty(_defaultTechnicalIndi, TechnicalIndicatorType.MA, [5, 10, 30, 60]), _defineProperty(_defaultTechnicalIndi, TechnicalIndicatorType.EMA, [6, 12, 20]), _defineProperty(_defaultTechnicalIndi, TechnicalIndicatorType.VOL, [5, 10, 20]), _defineProperty(_defaultTechnicalIndi, TechnicalIndicatorType.MACD, [12, 26, 9]), _defineProperty(_defaultTechnicalIndi, TechnicalIndicatorType.BOLL, [20]), _defineProperty(_defaultTechnicalIndi, TechnicalIndicatorType.KDJ, [9, 3, 3]), _defineProperty(_defaultTechnicalIndi, TechnicalIndicatorType.RSI, [6, 12, 24]), _defineProperty(_defaultTechnicalIndi, TechnicalIndicatorType.BIAS, [6, 12, 24]), _defineProperty(_defaultTechnicalIndi, TechnicalIndicatorType.BRAR, [26]), _defineProperty(_defaultTechnicalIndi, TechnicalIndicatorType.CCI, [13]), _defineProperty(_defaultTechnicalIndi, TechnicalIndicatorType.DMI, [14, 6]), _defineProperty(_defaultTechnicalIndi, TechnicalIndicatorType.CR, [26, 10, 20, 40, 60]), _defineProperty(_defaultTechnicalIndi, TechnicalIndicatorType.PSY, [12]), _defineProperty(_defaultTechnicalIndi, TechnicalIndicatorType.DMA, [10, 50, 10]), _defineProperty(_defaultTechnicalIndi, TechnicalIndicatorType.TRIX, [12, 20]), _defineProperty(_defaultTechnicalIndi, TechnicalIndicatorType.OBV, [30]), _defineProperty(_defaultTechnicalIndi, TechnicalIndicatorType.VR, [24, 30]), _defineProperty(_defaultTechnicalIndi, TechnicalIndicatorType.WR, [13, 34, 89]), _defineProperty(_defaultTechnicalIndi, TechnicalIndicatorType.MTM, [6, 10]), _defineProperty(_defaultTechnicalIndi, TechnicalIndicatorType.EMV, [14, 9]), _defineProperty(_defaultTechnicalIndi, TechnicalIndicatorType.SAR, [2, 2, 20]), _defaultTechnicalIndi);
/**
 * 获取指标数据的key和value
 * @param kLineData
 * @param technicalIndicatorType
 * @param technicalIndicatorParamOptions
 * @returns {{keys: [], values: []}}
 */

function getTechnicalIndicatorDataKeysAndValues(kLineData, technicalIndicatorType, technicalIndicatorParamOptions) {
  var technicalIndicatorParams = technicalIndicatorParamOptions[technicalIndicatorType] || [];
  var technicalIndicatorData = (kLineData || {})[technicalIndicatorType.toLowerCase()] || {};
  var keys = [];
  var values = [];

  switch (technicalIndicatorType) {
    case TechnicalIndicatorType.MA:
      {
        technicalIndicatorParams.forEach(function (p) {
          var key = "ma".concat(p);
          keys.push(key);
          values.push(technicalIndicatorData[key]);
        });
        break;
      }

    case TechnicalIndicatorType.EMA:
      {
        technicalIndicatorParams.forEach(function (p) {
          var key = "ema".concat(p);
          keys.push(key);
          values.push(technicalIndicatorData[key]);
        });
        break;
      }

    case TechnicalIndicatorType.MACD:
      {
        keys = ['diff', 'dea', 'macd'];
        values = [technicalIndicatorData.diff, technicalIndicatorData.dea, technicalIndicatorData.macd];
        break;
      }

    case TechnicalIndicatorType.VOL:
      {
        technicalIndicatorParams.forEach(function (p) {
          var key = "ma".concat(p);
          keys.push(key);
          values.push(technicalIndicatorData[key]);
        });
        keys.push('num');
        values.push(technicalIndicatorData.num);
        break;
      }

    case TechnicalIndicatorType.BOLL:
      {
        keys = ['up', 'mid', 'dn'];
        values = [technicalIndicatorData.up, technicalIndicatorData.mid, technicalIndicatorData.dn];
        break;
      }

    case TechnicalIndicatorType.BIAS:
      {
        technicalIndicatorParams.forEach(function (p) {
          var key = "bias".concat(p);
          keys.push(key);
          values.push(technicalIndicatorData[key]);
        });
        break;
      }

    case TechnicalIndicatorType.BRAR:
      {
        keys = ['br', 'ar'];
        values = [technicalIndicatorData.br, technicalIndicatorData.ar];
        break;
      }

    case TechnicalIndicatorType.CCI:
      {
        keys = ['cci'];
        values = [technicalIndicatorData.cci];
        break;
      }

    case TechnicalIndicatorType.CR:
      {
        keys = ['cr', 'ma1', 'ma2', 'ma3', 'ma4'];
        values = [technicalIndicatorData.cr, technicalIndicatorData.ma1, technicalIndicatorData.ma2, technicalIndicatorData.ma3, technicalIndicatorData.ma4];
        break;
      }

    case TechnicalIndicatorType.DMA:
      {
        keys = ['dif', 'difMa'];
        values = [technicalIndicatorData.dif, technicalIndicatorData.difMa];
        break;
      }

    case TechnicalIndicatorType.DMI:
      {
        keys = ['mdi', 'pdi', 'adx', 'adxr'];
        values = [technicalIndicatorData.mdi, technicalIndicatorData.pdi, technicalIndicatorData.adx, technicalIndicatorData.adxr];
        break;
      }

    case TechnicalIndicatorType.KDJ:
      {
        keys = ['k', 'd', 'j'];
        values = [technicalIndicatorData.k, technicalIndicatorData.d, technicalIndicatorData.j];
        break;
      }

    case TechnicalIndicatorType.RSI:
      {
        technicalIndicatorParams.forEach(function (p) {
          var key = "rsi".concat(p);
          keys.push(key);
          values.push(technicalIndicatorData[key]);
        });
        break;
      }

    case TechnicalIndicatorType.PSY:
      {
        keys = ['psy'];
        values = [technicalIndicatorData.psy];
        break;
      }

    case TechnicalIndicatorType.TRIX:
      {
        keys = ['trix', 'maTrix'];
        values = [technicalIndicatorData.trix, technicalIndicatorData.maTrix];
        break;
      }

    case TechnicalIndicatorType.OBV:
      {
        keys = ['obv', 'maObv'];
        values = [technicalIndicatorData.obv, technicalIndicatorData.maObv];
        break;
      }

    case TechnicalIndicatorType.VR:
      {
        keys = ['vr', 'maVr'];
        values = [technicalIndicatorData.vr, technicalIndicatorData.maVr];
        break;
      }

    case TechnicalIndicatorType.WR:
      {
        keys = ['wr1', 'wr2', 'wr3'];
        values = [technicalIndicatorData.wr1, technicalIndicatorData.wr2, technicalIndicatorData.wr3];
        break;
      }

    case TechnicalIndicatorType.MTM:
      {
        keys = ['mtm', 'mtmMa'];
        values = [technicalIndicatorData.mtm, technicalIndicatorData.mtmMa];
        break;
      }

    case TechnicalIndicatorType.EMV:
      {
        keys = ['emv', 'maEmv'];
        values = [technicalIndicatorData.emv, technicalIndicatorData.maEmv];
        break;
      }

    case TechnicalIndicatorType.SAR:
      {
        keys = ['sar'];
        values = [technicalIndicatorData.sar];
        break;
      }
  }

  return {
    keys: keys,
    values: values
  };
}

var _defaultPrecisionOpti;
var defaultPrecisionOptions = (_defaultPrecisionOpti = {
  price: 2,
  volume: 0
}, _defineProperty(_defaultPrecisionOpti, TechnicalIndicatorType.NO, 2), _defineProperty(_defaultPrecisionOpti, TechnicalIndicatorType.MA, 2), _defineProperty(_defaultPrecisionOpti, TechnicalIndicatorType.EMA, 2), _defineProperty(_defaultPrecisionOpti, TechnicalIndicatorType.VOL, 0), _defineProperty(_defaultPrecisionOpti, TechnicalIndicatorType.MACD, 2), _defineProperty(_defaultPrecisionOpti, TechnicalIndicatorType.BOLL, 2), _defineProperty(_defaultPrecisionOpti, TechnicalIndicatorType.KDJ, 2), _defineProperty(_defaultPrecisionOpti, TechnicalIndicatorType.RSI, 2), _defineProperty(_defaultPrecisionOpti, TechnicalIndicatorType.BIAS, 2), _defineProperty(_defaultPrecisionOpti, TechnicalIndicatorType.BRAR, 4), _defineProperty(_defaultPrecisionOpti, TechnicalIndicatorType.CCI, 4), _defineProperty(_defaultPrecisionOpti, TechnicalIndicatorType.DMI, 4), _defineProperty(_defaultPrecisionOpti, TechnicalIndicatorType.CR, 2), _defineProperty(_defaultPrecisionOpti, TechnicalIndicatorType.PSY, 2), _defineProperty(_defaultPrecisionOpti, TechnicalIndicatorType.DMA, 4), _defineProperty(_defaultPrecisionOpti, TechnicalIndicatorType.TRIX, 4), _defineProperty(_defaultPrecisionOpti, TechnicalIndicatorType.OBV, 4), _defineProperty(_defaultPrecisionOpti, TechnicalIndicatorType.VR, 4), _defineProperty(_defaultPrecisionOpti, TechnicalIndicatorType.WR, 4), _defineProperty(_defaultPrecisionOpti, TechnicalIndicatorType.MTM, 4), _defineProperty(_defaultPrecisionOpti, TechnicalIndicatorType.EMV, 4), _defineProperty(_defaultPrecisionOpti, TechnicalIndicatorType.SAR, 2), _defaultPrecisionOpti);

var calcIndicator = {};
/**
 * 计算均价
 * @param dataList
 * @returns {*}
 */

calcIndicator[TechnicalIndicatorType.AVERAGE] = function (dataList) {
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


calcIndicator[TechnicalIndicatorType.MA] = function (dataList, params) {
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
 * 计算指数移动平均
 * 6，12，20
 * @param dataList
 * @param params
 * @returns {*}
 */


calcIndicator[TechnicalIndicatorType.EMA] = function (dataList, params) {
  if (!checkParams(params)) {
    return dataList;
  }

  var oldEmas = [];
  var paramsLength = params.length;
  return calc(dataList, function (i) {
    var ema = {};
    var close = dataList[i].close;

    for (var j = 0; j < paramsLength; j++) {
      var emaValue = void 0;

      if (i === 0) {
        emaValue = close;
      } else {
        emaValue = (2 * close + (params[j] - 1) * oldEmas[j]) / (params[j] + 1);
      }

      ema["ema".concat(params[j])] = emaValue;
      oldEmas[j] = emaValue;
    }

    dataList[i].ema = ema;
  });
};
/**
 * 计算成交量包含ma5、ma10、ma20
 * 默认参数5，10，20
 * @param dataList
 * @param params
 * @return
 */


calcIndicator[TechnicalIndicatorType.VOL] = function (dataList, params) {
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


calcIndicator[TechnicalIndicatorType.MACD] = function (dataList, params) {
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


calcIndicator[TechnicalIndicatorType.BOLL] = function (dataList, params) {
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


calcIndicator[TechnicalIndicatorType.KDJ] = function (dataList, params) {
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


calcIndicator[TechnicalIndicatorType.RSI] = function (dataList, params) {
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


calcIndicator[TechnicalIndicatorType.BIAS] = function (dataList, params) {
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


calcIndicator[TechnicalIndicatorType.BRAR] = function (dataList, params) {
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


calcIndicator[TechnicalIndicatorType.CCI] = function (dataList, params) {
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


calcIndicator[TechnicalIndicatorType.DMI] = function (dataList, params) {
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


calcIndicator[TechnicalIndicatorType.CR] = function (dataList, params) {
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


calcIndicator[TechnicalIndicatorType.PSY] = function (dataList, params) {
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


calcIndicator[TechnicalIndicatorType.DMA] = function (dataList, params) {
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


calcIndicator[TechnicalIndicatorType.TRIX] = function (dataList, params) {
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


calcIndicator[TechnicalIndicatorType.OBV] = function (dataList, params) {
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


calcIndicator[TechnicalIndicatorType.VR] = function (dataList, params) {
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


calcIndicator[TechnicalIndicatorType.WR] = function (dataList, params) {
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


calcIndicator[TechnicalIndicatorType.MTM] = function (dataList, params) {
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


calcIndicator[TechnicalIndicatorType.EMV] = function (dataList, params) {
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


calcIndicator[TechnicalIndicatorType.SAR] = function (dataList, params) {
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
 * @param timestamp
 * @param format
 * @param timezone
 * @returns {string}
 */

function formatDate(timestamp, format, timezone) {
  if (timestamp && isNumber(timestamp)) {
    var date = new Date(timestamp);
    var dateTimeString;

    try {
      dateTimeString = new Intl.DateTimeFormat('en', {
        hour12: false,
        timeZone: timezone,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }).format(date);
    } catch (e) {
      dateTimeString = new Intl.DateTimeFormat('en', {
        hour12: false,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }).format(date);
    }

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
    return value.toFixed(precision);
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
    merge(this._styleOptions, styleOptions); // 指标参数配置

    this._technicalIndicatorParamOptions = clone(defaultTechnicalIndicatorParamOptions); // 精度配置

    this._precisionOptions = clone(defaultPrecisionOptions); // 时区

    this._timezone = null; // 数据源

    this._dataList = []; // 是否在加载中

    this._loading = true; // 加载更多回调

    this._loadMoreCallback = null; // 还有更多

    this._more = true; // 可见区域数据占用的空间

    this._totalDataSpace = 0; // 每一条数据的空间

    this._dataSpace = 6; // bar的空间

    this._barSpace = this._calcBarSpace(); // 向右偏移的数量

    this._offsetRightBarCount = 50 / this._dataSpace; // 左边最小可见bar的个数

    this._leftMinVisibleBarCount = 2; // 右边最小可见bar的个数

    this._rightMinVisibleBarCount = 2; // 开始绘制的索引

    this._from = 0; // 结束的索引

    this._to = 0; // 十字光标位置

    this._crossHairPoint = null; // 标识十字光标在哪个series

    this._crossHairSeriesTag = null; // 用来记录开始拖拽时向右偏移的数量

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
  }, {
    key: "applyStyleOptions",
    value: function applyStyleOptions(options) {
      merge(this._styleOptions, options);
    }
    /**
     * 获取计算指标参数配置
     */

  }, {
    key: "technicalIndicatorParamOptions",
    value: function technicalIndicatorParamOptions() {
      return this._technicalIndicatorParamOptions;
    }
    /**
     * 加载技术指标参数
     * @param technicalIndicatorType
     * @param params
     */

  }, {
    key: "applyTechnicalIndicatorParams",
    value: function applyTechnicalIndicatorParams(technicalIndicatorType) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      if (this._technicalIndicatorParamOptions.hasOwnProperty(technicalIndicatorType)) {
        this._technicalIndicatorParamOptions[technicalIndicatorType] = params;
      }
    }
    /**
     * 精度配置
     */

  }, {
    key: "precisionOptions",
    value: function precisionOptions() {
      return this._precisionOptions;
    }
    /**
     * 设置时区
     * @param timezone
     */

  }, {
    key: "setTimezone",
    value: function setTimezone(timezone) {
      this._timezone = timezone;
    }
    /**
     * 获取时区
     * @returns {null}
     */

  }, {
    key: "timezone",
    value: function timezone() {
      return this._timezone;
    }
    /**
     * 加载精度
     * @param pricePrecision
     * @param volumePrecision
     */

  }, {
    key: "applyPrecision",
    value: function applyPrecision(pricePrecision, volumePrecision) {
      if ((pricePrecision || pricePrecision === 0) && !(pricePrecision < 0)) {
        this._precisionOptions.price = pricePrecision;
        this._precisionOptions[TechnicalIndicatorType.MA] = pricePrecision;
        this._precisionOptions[TechnicalIndicatorType.BOLL] = pricePrecision;
        this._precisionOptions[TechnicalIndicatorType.SAR] = pricePrecision;
      }

      if ((volumePrecision || volumePrecision === 0) && !(volumePrecision < 0)) {
        this._precisionOptions.volume = volumePrecision;
        this._precisionOptions[TechnicalIndicatorType.VOL] = volumePrecision;
      }
    }
    /**
     * 计算指标
     * @param series
     * @param technicalIndicatorType
     */

  }, {
    key: "calcTechnicalIndicator",
    value: function calcTechnicalIndicator(series, technicalIndicatorType) {
      var _this = this;

      var task = new Promise(function (resolve, reject) {
        if (technicalIndicatorType === TechnicalIndicatorType.NO) {
          resolve(true);
        } else {
          var calcFun = calcIndicator[technicalIndicatorType];

          if (calcFun) {
            _this._dataList = calcFun(_this._dataList, _this._technicalIndicatorParamOptions[technicalIndicatorType]);
            resolve(true);
          } else {
            reject(new Error('Technical indicator type is error!'));
          }
        }
      });
      task.then(function (_) {
        if (isArray(series)) {
          var _iterator = _createForOfIteratorHelper(series),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var s = _step.value;
              s.invalidate(InvalidateLevel.FULL);
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        } else {
          series.invalidate(InvalidateLevel.FULL);
        }
      }).catch(function (_) {});
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
          this._dataList = data.concat(this._dataList);
          this.adjustOffsetBarCount();
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
     * 获取十字光标点
     * @returns {null}
     */

  }, {
    key: "crossHairPoint",
    value: function crossHairPoint() {
      return this._crossHairPoint;
    }
    /**
     * 获取十字光标点所在的series的标识
     * @returns {null}
     */

  }, {
    key: "crossHairSeriesTag",
    value: function crossHairSeriesTag() {
      return this._crossHairSeriesTag;
    }
    /**
     * 设置十字光标点所在的series的标识
     * @param tag
     */

  }, {
    key: "setCrossHairSeriesTag",
    value: function setCrossHairSeriesTag(tag) {
      this._crossHairSeriesTag = tag;

      this._invalidateHandler(InvalidateLevel.FLOAT_LAYER);
    }
    /**
     * 设置十字光标点
     * @param point
     */

  }, {
    key: "setCrossHairPoint",
    value: function setCrossHairPoint(point) {
      this._crossHairPoint = point;
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

      if (distanceBarCount > 0 && this._from === 0) {
        this._loadMoreHandler();
      }

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
 * @param ctx
 * @returns {number}
 */
function getPixelRatio(ctx) {
  var backingStore = ctx.backingStorePixelRatio || ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
  return (window.devicePixelRatio || 1) / backingStore;
}
/**
 * 测量文字的宽度
 * @param ctx
 * @param text
 * @returns {number}
 */

function calcTextWidth(ctx, text) {
  return ctx.measureText(text).width;
}
/**
 * 获取字体
 * @param fontSize
 * @param fontFamily
 * @returns {string}
 */

function getFont(fontSize) {
  var fontFamily = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Arial';
  return "".concat(fontSize, "px ").concat(fontFamily);
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

var Series = /*#__PURE__*/function () {
  function Series(props) {
    _classCallCheck(this, Series);

    this._container = props.container;
    this._chartData = props.chartData;
    this._width = -1;
    this._height = -1;

    this._initBefore(props);

    this._initElement();

    this._mainWidget = this._createMainWidget(this._mainWidgetCell, props);
    this._yAxisWidget = this._createYAxisWidget(this._yAxisWidgetCell, props);
  }

  _createClass(Series, [{
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
      this._mainWidgetCell = this._createCell();
      this._yAxisWidgetCell = this._createCell();

      this._element.appendChild(this._mainWidgetCell);

      this._element.appendChild(this._yAxisWidgetCell);

      var lastElement = this._container.lastChild;

      if (lastElement) {
        this._container.insertBefore(this._element, lastElement);
      } else {
        this._container.appendChild(this._element);
      }
    }
  }, {
    key: "_createCell",
    value: function _createCell() {
      var cell = document.createElement('div');
      cell.style.display = 'table-cell';
      cell.style.position = 'absolute';
      cell.style.margin = '0';
      cell.style.padding = '0';
      cell.style.top = '0';
      cell.style.zIndex = '1';
      return cell;
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
     * 设置cell的尺寸
     * @param cell
     * @param size
     * @private
     */

  }, {
    key: "_setCellSize",
    value: function _setCellSize(cell, size) {
      cell.style.left = "".concat(size.left, "px");
      cell.style.width = "".concat(size.width, "px");
      cell.style.height = "".concat(size.height, "px");
    }
    /**
     * 计算轴
     * @private
     */

  }, {
    key: "_computeAxis",
    value: function _computeAxis() {}
    /**
     * 获取宽度
     * @returns {number}
     */

  }, {
    key: "width",
    value: function width() {
      return this._element.offsetWidth;
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
    }
    /**
     * 设置尺寸
     * @param mainWidgetSize
     * @param yAxisWidgetSize
     */

  }, {
    key: "setSize",
    value: function setSize(mainWidgetSize, yAxisWidgetSize) {
      this._height = mainWidgetSize.height;
      this._element.style.height = "".concat(mainWidgetSize.height, "px");

      this._setCellSize(this._mainWidgetCell, mainWidgetSize);

      this._setCellSize(this._yAxisWidgetCell, yAxisWidgetSize);

      this._mainWidget.setSize(mainWidgetSize.width, this._height);

      if (this._yAxisWidget) {
        this._yAxisWidget.setSize(yAxisWidgetSize.width, yAxisWidgetSize.height);
      }
    }
    /**
     * 刷新
     * @param level
     */

  }, {
    key: "invalidate",
    value: function invalidate(level) {
      if (level === InvalidateLevel.FULL) {
        this._computeAxis();
      }

      if (this._yAxisWidget) {
        this._yAxisWidget.invalidate(level);
      }

      this._mainWidget.invalidate(level);
    }
  }, {
    key: "getImage",
    value: function getImage(includeFloatLayer, includeGraphicMark) {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      var pixelRatio = getPixelRatio(ctx);
      var width = this._element.offsetWidth;
      var height = this._element.offsetHeight;
      canvas.style.width = "".concat(width, "px");
      canvas.style.height = "".concat(height, "px");
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      ctx.scale(pixelRatio, pixelRatio);
      var mainWidgetWidth = this._mainWidgetCell.offsetWidth;
      var mainWidgetHeight = this._mainWidgetCell.offsetHeight;
      var mainWidgetOffsetLeft = parseInt(this._mainWidgetCell.style.left, 10);
      var yAxisWidgetWidth = this._yAxisWidgetCell.offsetWidth;
      var yAxisWidgetHeight = this._yAxisWidgetCell.offsetHeight;
      var yAxisWidgetOffsetLeft = parseInt(this._yAxisWidgetCell.style.left, 10);
      ctx.drawImage(this._mainWidget.getImage(includeFloatLayer, includeGraphicMark), mainWidgetOffsetLeft, 0, mainWidgetWidth, mainWidgetHeight);

      if (this._yAxisWidget) {
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

  return Series;
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
      this._element.style.margin = '0';
      this._element.style.padding = '0';
      this._element.style.width = '100%';
      this._element.style.height = '100%';
      this._element.style.position = 'relative';
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
    /**
     * 设置尺寸
     * @param width
     * @param height
     */

  }, {
    key: "setSize",
    value: function setSize(width, height) {
      this._width = width;
      this._height = height;

      this._mainView.setSize(width, height);

      this._floatLayerView.setSize(width, height);
    }
    /**
     * 更新
     * @param level
     */

  }, {
    key: "invalidate",
    value: function invalidate(level) {
      switch (level) {
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
      var pixelRatio = getPixelRatio(ctx);
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
      this._canvas.style.right = '0';
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
      this._ctx.clearRect(0, 0, this._width, this._height);

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
    /**
     * 设置尺寸
     * @param width
     * @param height
     */

  }, {
    key: "setSize",
    value: function setSize(width, height) {
      var _this = this;

      this._redraw(function () {
        var pixelRatio = getPixelRatio(_this._ctx);
        _this._width = width;
        _this._height = height;
        _this._canvas.style.top = '0';
        _this._canvas.style.width = "".concat(width, "px");
        _this._canvas.style.height = "".concat(height, "px");
        _this._canvas.width = width * pixelRatio;
        _this._canvas.height = height * pixelRatio;

        _this._ctx.scale(pixelRatio, pixelRatio);
      });
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

      this._ctx.setLineDash([]);
    }
    /**
     * 绘制指标
     * @private
     */

  }, {
    key: "_drawTechnicalIndicator",
    value: function _drawTechnicalIndicator() {
      var _this3 = this;

      var technicalIndicatorType = this._additionalDataProvider.technicalIndicatorType();

      var technicalIndicatorParamOptions = this._chartData.technicalIndicatorParamOptions();

      var linePoints = [];

      var technicalIndicatorOptions = this._chartData.styleOptions().technicalIndicator;

      var dataList = this._chartData.dataList();

      this._drawGraphics(function (x, i, kLineData, halfBarSpace) {
        var keysAndValues = getTechnicalIndicatorDataKeysAndValues(kLineData, technicalIndicatorType, technicalIndicatorParamOptions);
        var values = keysAndValues.values;

        var lineValues = _toConsumableArray(values);

        switch (technicalIndicatorType) {
          case TechnicalIndicatorType.MA:
          case TechnicalIndicatorType.EMA:
          case TechnicalIndicatorType.BOLL:
            {
              _this3._drawTechnicalIndicatorOhlc(i, x, halfBarSpace, technicalIndicatorOptions, kLineData, _this3._yAxis.isCandleStickYAxis());

              break;
            }

          case TechnicalIndicatorType.MACD:
            {
              lineValues.splice(lineValues.length - 1, 1);
              var macd = values[values.length - 1];

              if (macd > 0) {
                _this3._ctx.strokeStyle = technicalIndicatorOptions.bar.upColor;
                _this3._ctx.fillStyle = technicalIndicatorOptions.bar.upColor;
              } else if (macd < 0) {
                _this3._ctx.strokeStyle = technicalIndicatorOptions.bar.downColor;
                _this3._ctx.fillStyle = technicalIndicatorOptions.bar.downColor;
              } else {
                _this3._ctx.strokeStyle = technicalIndicatorOptions.bar.noChangeColor;
                _this3._ctx.fillStyle = technicalIndicatorOptions.bar.noChangeColor;
              }

              var preKLineData = formatValue(dataList, i - 1, {});
              var preMacd = formatValue(preKLineData, 'macd', {}).macd;
              var isSolid = !((preMacd || preMacd === 0) && macd > preMacd);

              _this3._drawBars(x, halfBarSpace, macd, isSolid);

              break;
            }

          case TechnicalIndicatorType.VOL:
            {
              lineValues.splice(lineValues.length - 1, 1);
              var close = kLineData.close;
              var open = kLineData.open;

              if (close > open) {
                _this3._ctx.fillStyle = technicalIndicatorOptions.bar.upColor;
              } else if (close < open) {
                _this3._ctx.fillStyle = technicalIndicatorOptions.bar.downColor;
              } else {
                _this3._ctx.fillStyle = technicalIndicatorOptions.bar.noChangeColor;
              }

              var num = values[values.length - 1];

              _this3._drawBars(x, halfBarSpace, num, true);

              break;
            }

          case TechnicalIndicatorType.SAR:
            {
              lineValues.splice(0, 1);
              var sar = values[0];

              if (sar || sar === 0) {
                var dataY = _this3._yAxis.convertToPixel(sar);

                if (sar < (kLineData.high + kLineData.low) / 2) {
                  _this3._ctx.strokeStyle = technicalIndicatorOptions.bar.upColor;
                } else {
                  _this3._ctx.strokeStyle = technicalIndicatorOptions.bar.downColor;
                }

                _this3._ctx.beginPath();

                _this3._ctx.arc(x, dataY, halfBarSpace, Math.PI * 2, 0, true);

                _this3._ctx.stroke();

                _this3._ctx.closePath();
              }

              _this3._drawTechnicalIndicatorOhlc(i, x, halfBarSpace, technicalIndicatorOptions, kLineData, _this3._yAxis.isCandleStickYAxis());

              break;
            }
        }

        _this3._prepareLinePoints(x, lineValues, linePoints);
      }, function () {
        _this3._drawLines(linePoints, technicalIndicatorOptions);
      });
    }
    /**
     * 需要绘制ohlc指标每条数据渲染
     * @param i
     * @param x
     * @param halfBarSpace
     * @param technicalIndicatorOptions
     * @param kLineData
     * @param isCandleStick
     */

  }, {
    key: "_drawTechnicalIndicatorOhlc",
    value: function _drawTechnicalIndicatorOhlc(i, x, halfBarSpace, technicalIndicatorOptions, kLineData, isCandleStick) {
      if (!isCandleStick) {
        this._drawOhlc(halfBarSpace, x, kLineData, technicalIndicatorOptions.bar.upColor, technicalIndicatorOptions.bar.downColor, technicalIndicatorOptions.bar.noChangeColor);
      }
    }
    /**
     * 准备绘制线的数据
     * @param x
     * @param lineValues
     * @param linePoints
     */

  }, {
    key: "_prepareLinePoints",
    value: function _prepareLinePoints(x, lineValues, linePoints) {
      for (var i = 0; i < lineValues.length; i++) {
        var value = lineValues[i];

        var valueY = this._yAxis.convertToPixel(value);

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
     * @param linePoints
     * @param technicalIndicatorOptions
     */

  }, {
    key: "_drawLines",
    value: function _drawLines(linePoints, technicalIndicatorOptions) {
      var _this4 = this;

      var colors = technicalIndicatorOptions.line.colors;
      var pointCount = linePoints.length;
      var colorSize = (colors || []).length;
      this._ctx.lineWidth = technicalIndicatorOptions.line.size;
      drawLine(this._ctx, function () {
        for (var i = 0; i < pointCount; i++) {
          var points = linePoints[i];

          if (points.length > 0) {
            _this4._ctx.strokeStyle = colors[i % colorSize];

            _this4._ctx.beginPath();

            _this4._ctx.moveTo(points[0].x, points[0].y);

            for (var j = 1; j < points.length; j++) {
              _this4._ctx.lineTo(points[j].x, points[j].y);
            }

            _this4._ctx.stroke();

            _this4._ctx.closePath();
          }
        }
      });
    }
    /**
     * 绘制柱状图
     * @param x
     * @param halfBarSpace
     * @param barData
     * @param isSolid
     */

  }, {
    key: "_drawBars",
    value: function _drawBars(x, halfBarSpace, barData, isSolid) {
      if (barData || barData === 0) {
        this._ctx.lineWidth = 1;

        var dataY = this._yAxis.convertToPixel(barData);

        var zeroY = this._yAxis.convertToPixel(0);

        var y = dataY;

        if (barData < 0) {
          y = zeroY;
        }

        var yDif = zeroY - dataY;
        var barHeight = Math.abs(yDif);

        if (barHeight < 1) {
          barHeight = 1;
          y = barData < 0 ? y + 1 : y - 1;
        }

        if (isSolid) {
          this._ctx.fillRect(x - halfBarSpace, y, halfBarSpace * 2, barHeight);
        } else {
          this._ctx.strokeRect(x - halfBarSpace + 0.5, y, halfBarSpace * 2 - 1, barHeight);
        }
      }
    }
    /**
     * 绘制ohlc
     * @param halfBarSpace
     * @param x
     * @param kLineData
     * @param upColor
     * @param downColor
     * @param noChangeColor
     * @private
     */

  }, {
    key: "_drawOhlc",
    value: function _drawOhlc(halfBarSpace, x, kLineData, upColor, downColor, noChangeColor) {
      var open = kLineData.open;
      var close = kLineData.close;

      var openY = this._yAxis.convertToPixel(open);

      var closeY = this._yAxis.convertToPixel(close);

      var highY = this._yAxis.convertToPixel(kLineData.high);

      var lowY = this._yAxis.convertToPixel(kLineData.low);

      if (close > open) {
        this._ctx.fillStyle = upColor;
      } else if (close < open) {
        this._ctx.fillStyle = downColor;
      } else {
        this._ctx.fillStyle = noChangeColor;
      }

      this._ctx.fillRect(x - 0.5, highY, 1, lowY - highY);

      this._ctx.fillRect(x - halfBarSpace, openY - 0.5, halfBarSpace, 1);

      this._ctx.fillRect(x, closeY - 0.5, halfBarSpace, 1);
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
      var crossHairPoint = this._chartData.crossHairPoint();

      var dataList = this._chartData.dataList();

      var dataPos;

      if (crossHairPoint) {
        dataPos = this._xAxis.convertFromPixel(crossHairPoint.x);
      } else {
        dataPos = dataList.length - 1;
      }

      var kLineData = dataList[dataPos];

      if (!kLineData) {
        var to = this._chartData.to();

        if (dataPos > to - 1) {
          kLineData = dataList[to - 1];
        } else if (dataPos < 0) {
          kLineData = dataList[0];
        }
      }

      if (kLineData) {
        var x = this._xAxis.convertToPixel(dataPos);

        this._drawCrossHairHorizontalLine();

        this._drawCrossHairVerticalLine(kLineData, x);

        var displayRule = this._chartData.styleOptions().floatLayer.prompt.displayRule;

        if (displayRule === FloatLayerPromptDisplayRule.ALWAYS || displayRule === FloatLayerPromptDisplayRule.FOLLOW_CROSS && this._chartData.crossHairSeriesTag()) {
          var isDrawTechnicalIndicatorPromptPoint = dataPos > 0 && dataPos < dataList.length;

          this._drawPrompt(kLineData, x, isDrawTechnicalIndicatorPromptPoint);
        }
      }
    }
    /**
     * 绘制提示
     * @param kLineData
     * @param x
     * @param isDrawTechnicalIndicatorPromptPoint
     * @private
     */

  }, {
    key: "_drawPrompt",
    value: function _drawPrompt(kLineData, x, isDrawTechnicalIndicatorPromptPoint) {
      this._drawTechnicalIndicatorPrompt(kLineData, x, isDrawTechnicalIndicatorPromptPoint);
    }
    /**
     * 绘制十字光标水平线
     * @private
     */

  }, {
    key: "_drawCrossHairHorizontalLine",
    value: function _drawCrossHairHorizontalLine() {
      if (this._chartData.crossHairSeriesTag() !== this._additionalDataProvider.tag()) {
        return;
      }

      var crossHair = this._chartData.styleOptions().floatLayer.crossHair;

      var crossHairHorizontal = crossHair.horizontal;
      var crossHairHorizontalLine = crossHairHorizontal.line;

      if (!crossHair.display || !crossHairHorizontal.display || !crossHairHorizontalLine.display) {
        return;
      }

      var crossHairPoint = this._chartData.crossHairPoint();

      if (!crossHairPoint) {
        return;
      } // 绘制十字光标水平线


      this._ctx.lineWidth = crossHairHorizontalLine.size;
      this._ctx.strokeStyle = crossHairHorizontalLine.color;

      if (crossHairHorizontalLine.style === LineStyle.DASH) {
        this._ctx.setLineDash(crossHairHorizontalLine.dashValue);
      }

      drawHorizontalLine(this._ctx, crossHairPoint.y, 0, this._width);

      this._ctx.setLineDash([]);
    }
    /**
     * 绘制十字光标垂直线
     * @param kLineData
     * @param x
     * @private
     */

  }, {
    key: "_drawCrossHairVerticalLine",
    value: function _drawCrossHairVerticalLine(kLineData, x) {
      if (!this._chartData.crossHairSeriesTag()) {
        return;
      }

      var crossHair = this._chartData.styleOptions().floatLayer.crossHair;

      var crossHairVertical = crossHair.vertical;
      var crossHairVerticalLine = crossHairVertical.line;

      if (!crossHair.display || !crossHairVertical.display || !crossHairVerticalLine.display) {
        return;
      }

      this._ctx.lineWidth = crossHairVerticalLine.size;
      this._ctx.strokeStyle = crossHairVerticalLine.color;

      if (crossHairVerticalLine.style === LineStyle.DASH) {
        this._ctx.setLineDash(crossHairVerticalLine.dashValue);
      }

      drawVerticalLine(this._ctx, x, 0, this._height);

      this._ctx.setLineDash([]);
    }
    /**
     * 绘制指标提示
     * @param kLineData
     * @param x
     * @param isDrawTechnicalIndicatorPromptPoint
     * @param offsetTop
     * @private
     */

  }, {
    key: "_drawTechnicalIndicatorPrompt",
    value: function _drawTechnicalIndicatorPrompt(kLineData, x, isDrawTechnicalIndicatorPromptPoint) {
      var offsetTop = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

      var technicalIndicatorOptions = this._chartData.styleOptions().technicalIndicator;

      var data = this._getTechnicalIndicatorPromptData(kLineData);

      var colors = technicalIndicatorOptions.line.colors;

      this._drawTechnicalIndicatorPromptText(data, colors, offsetTop);

      this._drawTechnicalIndicatorPromptPoint(data.values, colors, x, isDrawTechnicalIndicatorPromptPoint);
    }
    /**
     * 绘制指标提示文字
     * @param data
     * @param colors
     * @param offsetTop
     * @private
     */

  }, {
    key: "_drawTechnicalIndicatorPromptText",
    value: function _drawTechnicalIndicatorPromptText(data, colors, offsetTop) {
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
      this._ctx.font = getFont(textSize, floatLayerPromptTechnicalIndicatorText.family);
      var nameTextWidth = calcTextWidth(this._ctx, nameText);
      this._ctx.fillStyle = textColor;

      this._ctx.fillText(nameText, labelX, labelY);

      labelX += textMarginLeft + nameTextWidth;
      var isVol = this._additionalDataProvider.technicalIndicatorType() === TechnicalIndicatorType.VOL;

      for (var i = 0; i < labels.length; i++) {
        var text = "".concat(labels[i].toUpperCase(), ": ").concat((isVol ? formatBigNumber(values[i]) : values[i]) || '--');
        var textWidth = calcTextWidth(this._ctx, text);
        this._ctx.fillStyle = colors[i % colorSize] || textColor;

        this._ctx.fillText(text, labelX, labelY);

        labelX += textMarginLeft + textMarginRight + textWidth;
      }
    }
    /**
     * 绘制指标提示点
     * @param values
     * @param colors
     * @param x
     * @param isDrawTechnicalIndicatorPromptPoint
     * @private
     */

  }, {
    key: "_drawTechnicalIndicatorPromptPoint",
    value: function _drawTechnicalIndicatorPromptPoint(values, colors, x, isDrawTechnicalIndicatorPromptPoint) {
      var floatLayerPromptTechnicalIndicatorPoint = this._chartData.styleOptions().floatLayer.prompt.technicalIndicator.point;

      if (!floatLayerPromptTechnicalIndicatorPoint.display) {
        return;
      }

      var technicalIndicatorType = this._additionalDataProvider.technicalIndicatorType();

      if (!this._chartData.crossHairSeriesTag() || technicalIndicatorType === TechnicalIndicatorType.SAR || !isDrawTechnicalIndicatorPromptPoint) {
        return;
      }

      var colorSize = colors.length;
      var valueSize = technicalIndicatorType === TechnicalIndicatorType.MACD || technicalIndicatorType === TechnicalIndicatorType.VOL ? values.length - 1 : values.length;
      var radius = floatLayerPromptTechnicalIndicatorPoint.radius;

      for (var i = 0; i < valueSize; i++) {
        var value = values[i];

        if (value || value === 0) {
          var y = this._yAxis.convertToPixel(value);

          this._ctx.fillStyle = colors[i % colorSize];

          this._ctx.beginPath();

          this._ctx.arc(x, y, radius, 0, Math.PI * 2);

          this._ctx.closePath();

          this._ctx.fill();
        }
      }
    }
    /**
     * 获取需要绘制的指标提示数据
     * @param kLineData
     * @returns {{values: Array, labels: Array}}
     */

  }, {
    key: "_getTechnicalIndicatorPromptData",
    value: function _getTechnicalIndicatorPromptData(kLineData) {
      var technicalIndicatorParamOptions = this._chartData.technicalIndicatorParamOptions();

      var technicalIndicatorType = this._additionalDataProvider.technicalIndicatorType();

      var keysAndValues = getTechnicalIndicatorDataKeysAndValues(kLineData, technicalIndicatorType, technicalIndicatorParamOptions);
      var params = this._chartData.technicalIndicatorParamOptions()[technicalIndicatorType] || [];
      var labels = keysAndValues.keys;
      var values = keysAndValues.values;
      var name = '';

      if (labels.length > 0) {
        name = "".concat(technicalIndicatorType);

        if (params && isArray(params) && params.length > 0) {
          name = "".concat(name, "(").concat(params.join(','), ")");
        }

        var decimal = this._chartData.precisionOptions()[technicalIndicatorType];

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
      var tickTextMargin = tickText.margin;
      var labelX;

      if (this._isDrawFromStart(yAxisOptions)) {
        labelX = tickTextMargin;

        if (yAxisOptions.axisLine.display) {
          labelX += yAxisOptions.axisLine.size;
        }

        if (tickLineDisplay) {
          labelX += tickLineLength;
        }

        this._ctx.textAlign = 'left';
      } else {
        labelX = this._width - tickTextMargin;

        if (yAxisOptions.axisLine.display) {
          labelX -= yAxisOptions.axisLine.size;
        }

        if (tickLineDisplay) {
          labelX -= tickLineLength;
        }

        this._ctx.textAlign = 'right';
      }

      this._ctx.textBaseline = 'middle';
      this._ctx.font = getFont(tickText.size, tickText.family);
      this._ctx.fillStyle = tickText.color;
      var isVol = this._additionalDataProvider.technicalIndicatorType() === TechnicalIndicatorType.VOL;

      this._yAxis.ticks().forEach(function (tick) {
        _this3._ctx.fillText(isVol ? formatBigNumber(tick.v) : tick.v, labelX, tick.y);
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
      var technicalIndicatorStyleOptions = this._chartData.styleOptions().technicalIndicator;

      var lastValueMarkStyleOptions = technicalIndicatorStyleOptions.lastValueMark;

      var dataList = this._chartData.dataList();

      var lastKLineData = dataList[dataList.length - 1];

      if (!lastValueMarkStyleOptions.display || !lastKLineData) {
        return;
      }

      var technicalIndicatorParamOptions = this._chartData.technicalIndicatorParamOptions();

      var technicalIndicatorType = this._additionalDataProvider.technicalIndicatorType();

      var keysAndValues = getTechnicalIndicatorDataKeysAndValues(lastKLineData, technicalIndicatorType, technicalIndicatorParamOptions);
      var values = keysAndValues.values;
      var colors = technicalIndicatorStyleOptions.line.colors || [];
      var colorSize = colors.length;
      var valueCount = values.length;

      for (var i = 0; i < valueCount; i++) {
        var value = values[i];
        var backgroundColor = colors[i % colorSize];

        this._drawMarkLabel(yAxisOptions, value, this._chartData.precisionOptions()[technicalIndicatorType], lastValueMarkStyleOptions.textSize, lastValueMarkStyleOptions.textFamily, lastValueMarkStyleOptions.textColor, backgroundColor, lastValueMarkStyleOptions.textPaddingLeft, lastValueMarkStyleOptions.textPaddingTop, lastValueMarkStyleOptions.textPaddingRight, lastValueMarkStyleOptions.textPaddingBottom);
      }
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

      this._drawMarkLabel(yAxisOptions, close, this._chartData.precisionOptions().price, priceMarkText.size, priceMarkText.family, priceMarkText.color, backgroundColor, priceMarkText.paddingLeft, priceMarkText.paddingTop, priceMarkText.paddingRight, priceMarkText.paddingBottom);
    }
    /**
     * 绘制标记label
     * @param yAxisOptions
     * @param value
     * @param precision
     * @param textSize
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
    value: function _drawMarkLabel(yAxisOptions, value, precision, textSize, textFamily, textColor, backgroundColor, textPaddingLeft, textPaddingTop, textPaddingRight, textPaddingBottom) {
      var valueY = this._yAxis.convertToPixel(value);

      valueY = +Math.max(this._height * 0.05, Math.min(valueY, this._height * 0.98)).toFixed(0);
      var text;

      if (this._yAxis.isPercentageYAxis()) {
        var fromClose = this._chartData.dataList()[this._chartData.from()].close;

        text = "".concat(((value - fromClose) / fromClose * 100).toFixed(2), "%");
      } else {
        text = formatPrecision(value, precision);

        if (this._additionalDataProvider.technicalIndicatorType() === TechnicalIndicatorType.VOL) {
          text = formatBigNumber(text);
        }
      }

      this._ctx.font = getFont(textSize, textFamily);
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
      return yAxisOptions.position === YAxisPosition.LEFT && yAxisOptions.tickText.position === YAxisTextPosition.INSIDE || yAxisOptions.position === YAxisPosition.RIGHT && yAxisOptions.tickText.position === YAxisTextPosition.OUTSIDE;
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
      if (this._chartData.crossHairSeriesTag() !== this._additionalDataProvider.tag() || this._chartData.dataList().length === 0) {
        return;
      }

      var crossHair = this._chartData.styleOptions().floatLayer.crossHair;

      var crossHairHorizontal = crossHair.horizontal;
      var crossHairHorizontalText = crossHairHorizontal.text;

      if (!crossHair.display || !crossHairHorizontal.display || !crossHairHorizontalText.display) {
        return;
      }

      var crossHairPoint = this._chartData.crossHairPoint();

      if (!crossHairPoint) {
        return;
      }

      var value = this._yAxis.convertFromPixel(crossHairPoint.y);

      var yAxisDataLabel;

      if (this._yAxis.isPercentageYAxis()) {
        var fromClose = this._chartData.dataList()[this._chartData.from()].close;

        yAxisDataLabel = "".concat(((value - fromClose) / fromClose * 100).toFixed(2), "%");
      } else {
        var technicalIndicatorType = this._additionalDataProvider.technicalIndicatorType();

        var precision = this._chartData.precisionOptions()[this._yAxis.isCandleStickYAxis() ? 'price' : technicalIndicatorType];

        yAxisDataLabel = formatPrecision(value, precision);

        if (technicalIndicatorType === TechnicalIndicatorType.VOL) {
          yAxisDataLabel = formatBigNumber(yAxisDataLabel);
        }
      }

      var textSize = crossHairHorizontalText.size;
      this._ctx.font = getFont(textSize, crossHairHorizontalText.family);
      var yAxisDataLabelWidth = calcTextWidth(this._ctx, yAxisDataLabel);
      var rectStartX;
      var paddingLeft = crossHairHorizontalText.paddingLeft;
      var paddingRight = crossHairHorizontalText.paddingRight;
      var paddingTop = crossHairHorizontalText.paddingTop;
      var paddingBottom = crossHairHorizontalText.paddingBottom;
      var borderSize = crossHairHorizontalText.borderSize;
      var rectWidth = yAxisDataLabelWidth + borderSize * 2 + paddingLeft + paddingRight;
      var rectHeight = textSize + borderSize * 2 + paddingTop + paddingBottom;

      var yAxis = this._chartData.styleOptions().yAxis;

      if (yAxis.position === YAxisPosition.LEFT && yAxis.tickText.position === YAxisTextPosition.INSIDE || yAxis.position === YAxisPosition.RIGHT && yAxis.tickText.position === YAxisTextPosition.OUTSIDE) {
        rectStartX = 0;
      } else {
        rectStartX = this._width - rectWidth;
      }

      var rectY = crossHairPoint.y - borderSize - paddingTop - textSize / 2; // 绘制y轴文字外的边框

      this._ctx.fillStyle = crossHairHorizontalText.backgroundColor;

      this._ctx.fillRect(rectStartX, rectY, rectWidth, rectHeight);

      this._ctx.lineWidth = borderSize;
      this._ctx.strokeStyle = crossHairHorizontalText.borderColor;

      this._ctx.strokeRect(rectStartX, rectY, rectWidth, rectHeight);

      this._ctx.textBaseline = 'middle';
      this._ctx.fillStyle = crossHairHorizontalText.color;

      this._ctx.fillText(yAxisDataLabel, rectStartX + borderSize + paddingLeft, crossHairPoint.y);
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
  }
  /**
   * 设置尺寸
   * @param width
   * @param height
   */


  _createClass(Axis, [{
    key: "setSize",
    value: function setSize(width, height) {
      this._width = width;
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
        var interval = +this._nice(this._range / 6.0);

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

  function YAxis(chartData, isCandleStickYAxis) {
    var _this;

    _classCallCheck(this, YAxis);

    _this = _super.call(this, chartData);
    _this._isCandleStickYAxis = isCandleStickYAxis;
    return _this;
  }

  _createClass(YAxis, [{
    key: "_compareMinMax",
    value: function _compareMinMax(kLineData, technicalIndicatorType, minMaxArray) {
      var technicalIndicatorData = formatValue(kLineData, technicalIndicatorType.toLowerCase(), {});
      Object.keys(technicalIndicatorData).forEach(function (key) {
        var value = technicalIndicatorData[key];

        if (value || value === 0) {
          minMaxArray[0] = Math.min(minMaxArray[0], value);
          minMaxArray[1] = Math.max(minMaxArray[1], value);
        }
      });

      if (technicalIndicatorType === TechnicalIndicatorType.BOLL || technicalIndicatorType === TechnicalIndicatorType.SAR) {
        minMaxArray[0] = Math.min(minMaxArray[0], kLineData.low);
        minMaxArray[1] = Math.max(minMaxArray[1], kLineData.high);
      }

      return minMaxArray;
    }
  }, {
    key: "_computeMinMaxValue",
    value: function _computeMinMaxValue() {
      var min = this._minValue;
      var max = this._maxValue;

      if (min === Infinity || max === -Infinity) {
        return {
          min: 0,
          max: 0,
          range: 0
        };
      }

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

        var isPercentageAxis = this.isPercentageYAxis();

        for (var i = 0; i < tickLength; i += tickCountDif) {
          var v = ticks[i].v;
          v = +v === 0 ? '0' : v;

          var _y = this._innerConvertToPixel(+v);

          if (_y > textHeight && _y < this._height - textHeight) {
            optimalTicks.push({
              v: isPercentageAxis ? "".concat((+v).toFixed(2), "%") : v,
              y: _y
            });
          }
        }
      }

      return optimalTicks;
    }
    /**
     * 计算最大最小值
     * @param technicalIndicatorType
     * @param isRealTime
     */

  }, {
    key: "calcMinMaxValue",
    value: function calcMinMaxValue(technicalIndicatorType, isRealTime) {
      var dataList = this._chartData.dataList();

      var from = this._chartData.from();

      var to = this._chartData.to();

      var isShowAverageLine = this._chartData.styleOptions().realTime.averageLine.display;

      var minMaxArray = [Infinity, -Infinity];

      if (isRealTime) {
        for (var i = from; i < to; i++) {
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
        for (var _i = from; _i < to; _i++) {
          var _kLineData = dataList[_i];

          this._compareMinMax(_kLineData, technicalIndicatorType, minMaxArray);

          if (this._isCandleStickYAxis) {
            minMaxArray[0] = Math.min(_kLineData.low, minMaxArray[0]);
            minMaxArray[1] = Math.max(_kLineData.high, minMaxArray[1]);
          }
        }

        if (technicalIndicatorType === TechnicalIndicatorType.VOL) {
          minMaxArray[0] = 0;
        }
      }

      if (minMaxArray[0] !== Infinity && minMaxArray[1] !== -Infinity) {
        if (this.isPercentageYAxis()) {
          var fromClose = dataList[from].close;
          this._minValue = (minMaxArray[0] - fromClose) / fromClose * 100;
          this._maxValue = (minMaxArray[1] - fromClose) / fromClose * 100;

          if (this._minValue === this._maxValue) {
            this._minValue -= 10;
            this._maxValue += 10;
          }
        } else {
          this._minValue = minMaxArray[0];
          this._maxValue = minMaxArray[1];

          if (this._minValue === this._maxValue) {
            this._minValue -= 1;

            if (this._minValue < 0) {
              this._minValue = 0;
              this._maxValue = Math.max(1, this._maxValue * 2);
            } else {
              this._maxValue += 1;
            }
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
        var fromClose = this._chartData.dataList()[this._chartData.from()].close;

        realValue = (value - fromClose) / fromClose * 100;
      }

      return this._innerConvertToPixel(realValue);
    }
  }]);

  return YAxis;
}(Axis);

var TechnicalIndicatorSeries = /*#__PURE__*/function (_Series) {
  _inherits(TechnicalIndicatorSeries, _Series);

  var _super = _createSuper(TechnicalIndicatorSeries);

  function TechnicalIndicatorSeries(props) {
    var _this;

    _classCallCheck(this, TechnicalIndicatorSeries);

    _this = _super.call(this, props);
    _this._technicalIndicatorType = props.technicalIndicatorType || TechnicalIndicatorType.MACD;

    _this._chartData.calcTechnicalIndicator(_assertThisInitialized(_this), _this._technicalIndicatorType);

    return _this;
  }

  _createClass(TechnicalIndicatorSeries, [{
    key: "_initBefore",
    value: function _initBefore(props) {
      this._tag = props.tag;
      this._yAxis = this._createYAxis(props);
    }
  }, {
    key: "_createYAxis",
    value: function _createYAxis(props) {
      return new YAxis(props.chartData, false);
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
          technicalIndicatorType: this.technicalIndicatorType.bind(this),
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
          technicalIndicatorType: this.technicalIndicatorType.bind(this),
          tag: this.tag.bind(this)
        }
      });
    }
  }, {
    key: "_computeAxis",
    value: function _computeAxis() {
      this._yAxis.calcMinMaxValue(this._technicalIndicatorType, this._isRealTime());

      this._yAxis.computeAxis();
    }
  }, {
    key: "_isRealTime",
    value: function _isRealTime() {
      return false;
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
    /**
     * 设置尺寸
     * @param mainWidgetSize
     * @param yAxisWidgetSize
     */

  }, {
    key: "setSize",
    value: function setSize(mainWidgetSize, yAxisWidgetSize) {
      this._yAxis.setSize(yAxisWidgetSize.width, yAxisWidgetSize.height);

      this._computeAxis();

      _get(_getPrototypeOf(TechnicalIndicatorSeries.prototype), "setSize", this).call(this, mainWidgetSize, yAxisWidgetSize);
    }
  }, {
    key: "yAxis",
    value: function yAxis() {
      return this._yAxis;
    }
    /**
     * 获取技术指标类型
     * @returns {string}
     */

  }, {
    key: "technicalIndicatorType",
    value: function technicalIndicatorType() {
      return this._technicalIndicatorType;
    }
  }, {
    key: "setTechnicalIndicatorType",
    value: function setTechnicalIndicatorType(technicalIndicatorType) {
      if (this._technicalIndicatorType !== technicalIndicatorType) {
        this._technicalIndicatorType = technicalIndicatorType;

        this._chartData.calcTechnicalIndicator(this, this._technicalIndicatorType);
      }
    }
  }]);

  return TechnicalIndicatorSeries;
}(Series);

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

      var onDrawing = function onDrawing(x, i, kLineData, halfBarSpace) {
        var average = kLineData.average;

        var closeY = _this._yAxis.convertToPixel(kLineData.close);

        var averageY = _this._yAxis.convertToPixel(average);

        if (average || average === 0) {
          averageLinePoints.push({
            x: x,
            y: averageY
          });
        }

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

      var rect = [];
      var markHighestPrice = -Infinity;
      var markHighestPriceX = -1;
      var markLowestPrice = Infinity;
      var markLowestPriceX = -1;

      var candleStick = this._chartData.styleOptions().candleStick;

      var onDrawing = function onDrawing(x, i, kLineData, halfBarSpace, barSpace) {
        var open = kLineData.open;
        var close = kLineData.close;
        var high = kLineData.high;
        var low = kLineData.low;

        if (markHighestPrice < high) {
          markHighestPrice = high;
          markHighestPriceX = x;
        }

        if (low < markLowestPrice) {
          markLowestPrice = low;
          markLowestPriceX = x;
        }

        if (candleStick.bar.style !== CandleStickStyle.OHLC) {
          if (close > open) {
            _this2._ctx.strokeStyle = candleStick.bar.upColor;
            _this2._ctx.fillStyle = candleStick.bar.upColor;
          } else if (close < open) {
            _this2._ctx.strokeStyle = candleStick.bar.downColor;
            _this2._ctx.fillStyle = candleStick.bar.downColor;
          } else {
            _this2._ctx.strokeStyle = candleStick.bar.noChangeColor;
            _this2._ctx.fillStyle = candleStick.bar.noChangeColor;
          }

          var openY = _this2._yAxis.convertToPixel(open);

          var closeY = _this2._yAxis.convertToPixel(close);

          var highY = _this2._yAxis.convertToPixel(high);

          var lowY = _this2._yAxis.convertToPixel(low);

          var highLine = [];
          var lowLine = [];
          highLine[0] = highY;
          lowLine[1] = lowY;

          if (openY > closeY) {
            highLine[1] = closeY;
            lowLine[0] = openY;
            rect = [x - halfBarSpace, closeY, barSpace, openY - closeY];
          } else if (openY < closeY) {
            highLine[1] = openY;
            lowLine[0] = closeY;
            rect = [x - halfBarSpace, openY, barSpace, closeY - openY];
          } else {
            highLine[1] = openY;
            lowLine[0] = closeY;
            rect = [x - halfBarSpace, openY, barSpace, 1];
          }

          _this2._ctx.fillRect(x - 0.5, highLine[0], 1, highLine[1] - highLine[0]);

          _this2._ctx.fillRect(x - 0.5, lowLine[0], 1, lowLine[1] - lowLine[0]);

          if (rect[3] < 1) {
            rect[3] = 1;
          }

          switch (candleStick.bar.style) {
            case CandleStickStyle.SOLID:
              {
                _this2._ctx.fillRect(rect[0], rect[1], rect[2], rect[3]);

                break;
              }

            case CandleStickStyle.STROKE:
              {
                _this2._ctx.strokeRect(rect[0] + 0.5, rect[1], rect[2] - 1, rect[3]);

                break;
              }

            case CandleStickStyle.UP_STROKE:
              {
                if (close > open) {
                  _this2._ctx.strokeRect(rect[0] + 0.5, rect[1], rect[2] - 1, rect[3]);
                } else {
                  _this2._ctx.fillRect(rect[0], rect[1], rect[2], rect[3]);
                }

                break;
              }

            case CandleStickStyle.DOWN_STROKE:
              {
                if (close > open) {
                  _this2._ctx.fillRect(rect[0], rect[1], rect[2], rect[3]);
                } else {
                  _this2._ctx.strokeRect(rect[0], rect[1], rect[2], rect[3]);
                }

                break;
              }
          }
        } else {
          _this2._drawOhlc(halfBarSpace, x, kLineData, candleStick.bar.upColor, candleStick.bar.downColor, candleStick.bar.noChangeColor);
        }
      };

      this._drawGraphics(onDrawing);

      this._highestMarkData = {
        x: markHighestPriceX,
        price: markHighestPrice
      };
      this._lowestMarkData = {
        x: markLowestPriceX,
        price: markLowestPrice
      };
    }
    /**
     * 渲染最高价标记
     * @param pricePrecision
     */

  }, {
    key: "_drawHighestPriceMark",
    value: function _drawHighestPriceMark(pricePrecision) {
      if (!this._highestMarkData) {
        return;
      }

      var price = this._highestMarkData.price;

      var priceMark = this._chartData.styleOptions().candleStick.priceMark;

      var highestPriceMark = priceMark.high;

      if (price === -Infinity || !priceMark.display || !highestPriceMark.display) {
        return;
      }

      this._drawLowestHighestPriceMark(highestPriceMark, this._highestMarkData.x, price, true, this._chartData.precisionOptions().price);
    }
    /**
     * 绘制最低价标记
     */

  }, {
    key: "_drawLowestPriceMark",
    value: function _drawLowestPriceMark() {
      if (!this._lowestMarkData) {
        return;
      }

      var price = this._lowestMarkData.price;

      var priceMark = this._chartData.styleOptions().candleStick.priceMark;

      var lowestPriceMark = priceMark.low;

      if (price === Infinity || !priceMark.display || !lowestPriceMark.display) {
        return;
      }

      this._drawLowestHighestPriceMark(lowestPriceMark, this._lowestMarkData.x, price, false, this._chartData.precisionOptions().price);
    }
    /**
     * 渲染最高最低价格标记
     * @param priceMark
     * @param x
     * @param price
     * @param isHigh
     * @param pricePrecision
     */

  }, {
    key: "_drawLowestHighestPriceMark",
    value: function _drawLowestHighestPriceMark(priceMark, x, price, isHigh, pricePrecision) {
      var _this3 = this;

      var priceY = this._yAxis.convertToPixel(price);

      var startX = x;
      var startY = priceY + (isHigh ? -2 : 2);
      this._ctx.textAlign = 'left';
      this._ctx.lineWidth = 1;
      this._ctx.strokeStyle = priceMark.color;
      this._ctx.fillStyle = priceMark.color;
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
      this._ctx.font = getFont(priceMark.textSize, priceMark.textFamily);
      var text = formatPrecision(price, pricePrecision);
      this._ctx.textBaseline = 'middle';

      this._ctx.fillText(text, startX + 5 + priceMark.textMargin, y);
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
      this._ctx.strokeStyle = color;
      this._ctx.lineWidth = priceMarkLine.size;

      if (priceMarkLine.style === LineStyle.DASH) {
        this._ctx.setLineDash(priceMarkLine.dashValue);
      }

      drawHorizontalLine(this._ctx, priceY, 0, this._width);

      this._ctx.setLineDash([]);
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
    value: function _drawPrompt(kLineData, x, isDrawTechnicalIndicatorPromptPoint) {
      var floatLayerPromptCandleStick = this._chartData.styleOptions().floatLayer.prompt.candleStick;

      var candleStickPromptData = this._getCandleStickPromptData(kLineData, floatLayerPromptCandleStick);

      if (floatLayerPromptCandleStick.showType === FloatLayerPromptCandleStickTextDisplayType.STANDARD) {
        this._drawCandleStickStandardPromptText(floatLayerPromptCandleStick, candleStickPromptData);

        if (this._additionalDataProvider.chartType() === ChartType.CANDLE_STICK) {
          this._drawTechnicalIndicatorPrompt(kLineData, x, isDrawTechnicalIndicatorPromptPoint, floatLayerPromptCandleStick.text.size + floatLayerPromptCandleStick.text.marginTop);
        }
      } else {
        this._drawCandleStickRectPromptText(kLineData, x, floatLayerPromptCandleStick, candleStickPromptData);
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
      this._ctx.font = getFont(textSize, floatLayerPromptCandleStick.text.family);
      var labelX = textMarginLeft;
      var labelY = floatLayerPromptCandleStick.text.marginTop;
      labels.forEach(function (label, i) {
        var labelText = label ? "".concat(label, ": ") : '';
        var labelWidth = calcTextWidth(_this._ctx, labelText);
        _this._ctx.fillStyle = textColor;

        _this._ctx.fillText(labelText, labelX, labelY);

        labelX += labelWidth;
        var value = values[i] || '--';
        var valueText;

        if (isObject(value)) {
          valueText = value.value || '--';
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
    value: function _drawCandleStickRectPromptText(kLineData, x, floatLayerPromptCandleStick, candleStickPromptData) {
      var _this2 = this;

      var baseLabels = floatLayerPromptCandleStick.labels;
      var baseValues = candleStickPromptData;
      var baseTextMarginLeft = floatLayerPromptCandleStick.text.marginLeft;
      var baseTextMarginRight = floatLayerPromptCandleStick.text.marginRight;
      var baseTextMarginTop = floatLayerPromptCandleStick.text.marginTop;
      var baseTextMarginBottom = floatLayerPromptCandleStick.text.marginBottom;
      var baseTextSize = floatLayerPromptCandleStick.text.size;
      var baseTextColor = floatLayerPromptCandleStick.text.color;
      this._ctx.textBaseline = 'top';
      this._ctx.font = getFont(baseTextSize, floatLayerPromptCandleStick.text.family);
      var maxLabelWidth = 0;
      baseLabels.forEach(function (label, i) {
        var value = baseValues[i] || '--';
        var v = value;

        if (isObject(value)) {
          v = value.value || '--';
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

      var technicalIndicatorPromptData = this._getTechnicalIndicatorPromptData(kLineData);

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
        this._ctx.font = getFont(indicatorTextSize, floatLayerPromptTechnicalIndicator.text.family);
        indicatorLabels.forEach(function (label, i) {
          var v = indicatorValues[i] || '--';
          var text = "".concat(label, ": ").concat(v);
          var labelWidth = calcTextWidth(_this2._ctx, text) + indicatorTextMarginLeft + indicatorTextMarginRight;
          maxLabelWidth = Math.max(maxLabelWidth, labelWidth);
        });
        rectHeight += (indicatorTextMarginTop + indicatorTextMarginBottom + indicatorTextSize) * indicatorLabels.length;
      }

      var rectWidth = rectBorderSize * 2 + maxLabelWidth + rectPaddingLeft + rectPaddingRight; // const centerX = this._width / 2

      var rectX;

      if (x < rectWidth) {
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

      this._ctx.font = getFont(baseTextSize, floatLayerPromptCandleStick.text.family);
      baseLabels.forEach(function (label, i) {
        labelY += baseTextMarginTop;
        _this2._ctx.textAlign = 'left';
        _this2._ctx.fillStyle = baseTextColor;

        _this2._ctx.fillText("".concat(label, ": "), baseLabelX, labelY);

        var value = baseValues[i] || '--';
        var text;
        _this2._ctx.fillStyle = value.color || baseTextColor;

        if (isObject(value)) {
          text = value.value || '--';
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
        this._ctx.font = getFont(indicatorTextSize, floatLayerPromptTechnicalIndicator.text.family);
        indicatorLabels.forEach(function (label, i) {
          labelY += indicatorTextMarginTop;
          _this2._ctx.textAlign = 'left';
          _this2._ctx.fillStyle = colors[i % colorSize] || technicalIndicatorOptions.text.color;

          _this2._ctx.fillText("".concat(label.toUpperCase(), ": "), indicatorLabelX, labelY);

          _this2._ctx.textAlign = 'right';

          _this2._ctx.fillText(indicatorValues[i] || '--', rectX + rectWidth - rectBorderSize - indicatorTextMarginRight - rectPaddingRight, labelY);

          labelY += indicatorTextSize + indicatorTextMarginBottom;
        });
      }

      this._ctx.textAlign = 'left';
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
     * @param floatLayerPromptCandleStick
     * @returns {*}
     * @private
     */

  }, {
    key: "_getCandleStickPromptData",
    value: function _getCandleStickPromptData(kLineData, floatLayerPromptCandleStick) {
      var _this3 = this;

      var baseValues = floatLayerPromptCandleStick.values;
      var values = [];

      if (baseValues) {
        if (isFunction(baseValues)) {
          values = baseValues(kLineData) || [];
        } else {
          values = baseValues;
        }
      } else {
        var precisionOptions = this._chartData.precisionOptions();

        values = [formatValue(kLineData, 'timestamp'), formatValue(kLineData, 'open'), formatValue(kLineData, 'close'), formatValue(kLineData, 'high'), formatValue(kLineData, 'low'), formatValue(kLineData, 'volume')];
        values.forEach(function (value, index) {
          switch (index) {
            case 0:
              {
                values[index] = formatDate(value, 'YYYY-MM-DD hh:mm', _this3._chartData.timezone());
                break;
              }

            case values.length - 1:
              {
                values[index] = formatBigNumber(formatPrecision(value, precisionOptions.volume));
                break;
              }

            default:
              {
                values[index] = formatPrecision(value, precisionOptions.price);
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
    this._seriesSize = {};
  }

  _createClass(EventHandler, [{
    key: "_checkEventPointX",
    value: function _checkEventPointX(x) {
      return x > 0 && x < this._seriesSize.contentRight - this._seriesSize.contentLeft;
    }
  }, {
    key: "setSeriesSize",
    value: function setSeriesSize(seriesSize) {
      this._seriesSize = seriesSize;
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
                  x: _this4._seriesSize.contentRight,
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
                  y: _this4._seriesSize.tags[CANDLE_STICK_SERIES_TAG].contentBottom
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
                var linePoints = [];
                var size = {
                  width: _this4._seriesSize.contentRight,
                  height: _this4._seriesSize.tags[CANDLE_STICK_SERIES_TAG].contentBottom - _this4._seriesSize.tags[CANDLE_STICK_SERIES_TAG].contentTop
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

                for (var _i = 0; _i < linePoints.length; _i++) {
                  var points = linePoints[_i];
                  isOnGraphicMark = checkPointOnStraightLine(points[0], points[1], point);

                  if (isOnGraphicMark) {
                    return isOnGraphicMark;
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
      var size = this._seriesSize.tags[CANDLE_STICK_SERIES_TAG];
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

      var pricePrecision = this._chartData.precisionOptions().price; // 画线


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
              _this13._ctx.font = getFont(graphicMark.text.size, graphicMark.text.family);
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
  }, {
    key: "invalidate",
    value: function invalidate(level) {
      if (level !== InvalidateLevel.GRAPHIC_MARK) {
        _get(_getPrototypeOf(CandleStickWidget.prototype), "invalidate", this).call(this, level);
      }

      this._expandView.flush();
    }
  }, {
    key: "setSize",
    value: function setSize(width, height) {
      _get(_getPrototypeOf(CandleStickWidget.prototype), "setSize", this).call(this, width, height);

      this._expandView.setSize(width, height);
    }
  }]);

  return CandleStickWidget;
}(TechnicalIndicatorWidget);

var CandleStickSeries = /*#__PURE__*/function (_TechnicalIndicatorSe) {
  _inherits(CandleStickSeries, _TechnicalIndicatorSe);

  var _super = _createSuper(CandleStickSeries);

  function CandleStickSeries(props) {
    var _this;

    _classCallCheck(this, CandleStickSeries);

    _this = _super.call(this, props);
    _this._chartType = ChartType.CANDLE_STICK;
    return _this;
  }

  _createClass(CandleStickSeries, [{
    key: "_createYAxis",
    value: function _createYAxis(props) {
      return new YAxis(props.chartData, true);
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
          technicalIndicatorType: this.technicalIndicatorType.bind(this),
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
    key: "chartType",
    value: function chartType() {
      return this._chartType;
    }
  }, {
    key: "setChartType",
    value: function setChartType(chartType) {
      if (this._chartType !== chartType) {
        this._chartType = chartType;

        this._chartData.calcTechnicalIndicator(this, TechnicalIndicatorType.AVERAGE);
      }
    }
  }]);

  return CandleStickSeries;
}(TechnicalIndicatorSeries);

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
      this._ctx.font = getFont(tickText.size, tickText.family);
      this._ctx.textAlign = 'center';
      this._ctx.fillStyle = tickText.color;
      var labelY = tickText.margin;

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
      if (!this._chartData.crossHairSeriesTag()) {
        return;
      }

      var crossHair = this._chartData.styleOptions().floatLayer.crossHair;

      var crossHairVertical = crossHair.vertical;
      var crossHairVerticalText = crossHairVertical.text;

      if (!crossHair.display || !crossHairVertical.display || !crossHairVerticalText.display) {
        return;
      }

      var dataList = this._chartData.dataList();

      var crossHairPoint = this._chartData.crossHairPoint();

      var dataPos;

      if (crossHairPoint) {
        dataPos = this._xAxis.convertFromPixel(crossHairPoint.x);
      } else {
        dataPos = dataList.length - 1;
      }

      var kLineData = dataList[dataPos];

      if (!kLineData) {
        return;
      }

      var x = this._xAxis.convertToPixel(dataPos);

      var timestamp = kLineData.timestamp;
      var text = formatDate(timestamp, 'YYYY-MM-DD hh:mm', this._chartData.timezone());
      var textSize = crossHairVerticalText.size;
      this._ctx.font = getFont(textSize, crossHairVerticalText.family);
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

  function XAxis(chartData) {
    var _this;

    _classCallCheck(this, XAxis);

    _this = _super.call(this, chartData);

    _this._initMeasureCanvas();

    return _this;
  }

  _createClass(XAxis, [{
    key: "_initMeasureCanvas",
    value: function _initMeasureCanvas() {
      var measureCanvas = document.createElement('canvas');
      this._measureCtx = measureCanvas.getContext('2d');
      var pixelRatio = getPixelRatio(this._measureCtx);

      this._measureCtx.scale(pixelRatio, pixelRatio);
    }
  }, {
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
        var timezone = this._chartData.timezone();

        var tickText = this._chartData.styleOptions().xAxis.tickText;

        this._measureCtx.font = getFont(tickText.size, tickText.family);
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
          var label = formatDate(timestamp, 'hh:mm', timezone);

          if (i !== 0) {
            var prePos = parseInt(ticks[i - tickCountDif].v, 10);
            var preKLineData = dataList[prePos];
            var preTimestamp = preKLineData.timestamp;
            label = this._optimalTickLabel(timestamp, preTimestamp, timezone) || label;
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
          optimalTicks[0].v = formatDate(optimalTicks[0].oV, 'YYYY-MM-DD hh:mm', timezone);
        } else {
          var firstTimestamp = optimalTicks[0].oV;
          var secondTimestamp = optimalTicks[1].oV;

          if (optimalTicks[2]) {
            var thirdV = optimalTicks[2].v;

            if (/^[0-9]{2}-[0-9]{2}$/.test(thirdV)) {
              optimalTicks[0].v = formatDate(firstTimestamp, 'MM-DD', timezone);
            } else if (/^[0-9]{4}-[0-9]{2}$/.test(thirdV)) {
              optimalTicks[0].v = formatDate(firstTimestamp, 'YYYY-MM', timezone);
            } else if (/^[0-9]{4}$/.test(thirdV)) {
              optimalTicks[0].v = formatDate(firstTimestamp, 'YYYY', timezone);
            }
          } else {
            optimalTicks[0].v = this._optimalTickLabel(firstTimestamp, secondTimestamp, timezone) || optimalTicks[0].v;
          }
        }
      }

      return optimalTicks;
    }
  }, {
    key: "_optimalTickLabel",
    value: function _optimalTickLabel(timestamp, comparedTimestamp, timezone) {
      var year = formatDate(timestamp, 'YYYY', timezone);
      var month = formatDate(timestamp, 'YYYY-MM', timezone);
      var day = formatDate(timestamp, 'MM-DD', timezone);

      if (year !== formatDate(comparedTimestamp, 'YYYY', timezone)) {
        return year;
      } else if (month !== formatDate(comparedTimestamp, 'YYYY-MM', timezone)) {
        return month;
      } else if (day !== formatDate(comparedTimestamp, 'MM-DD', timezone)) {
        return day;
      }

      return null;
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

var XAxisSeries = /*#__PURE__*/function (_Series) {
  _inherits(XAxisSeries, _Series);

  var _super = _createSuper(XAxisSeries);

  function XAxisSeries() {
    _classCallCheck(this, XAxisSeries);

    return _super.apply(this, arguments);
  }

  _createClass(XAxisSeries, [{
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
    key: "_computeAxis",
    value: function _computeAxis() {
      this._xAxis.computeAxis();
    }
  }, {
    key: "xAxis",
    value: function xAxis() {
      return this._xAxis;
    }
  }, {
    key: "setSize",
    value: function setSize(mainWidgetSize, yAxisWidgetSize) {
      this._xAxis.setSize(mainWidgetSize.width, mainWidgetSize.height);

      this._computeAxis();

      _get(_getPrototypeOf(XAxisSeries.prototype), "setSize", this).call(this, mainWidgetSize, yAxisWidgetSize);
    }
  }]);

  return XAxisSeries;
}(Series);

var SeparatorSeries = /*#__PURE__*/function () {
  function SeparatorSeries(container, chartData, seriesIndex, dragEnabled, dragEventHandler) {
    _classCallCheck(this, SeparatorSeries);

    this._chartData = chartData;
    this._seriesIndex = seriesIndex;
    this._width = 0;
    this._offsetLeft = 0;
    this._dragEventHandler = dragEventHandler;

    this._initElement(container, dragEnabled);
  }

  _createClass(SeparatorSeries, [{
    key: "_initElement",
    value: function _initElement(container, dragEnabled) {
      this._container = container;
      this._wrapper = document.createElement('div');
      this._wrapper.style.margin = '0';
      this._wrapper.style.padding = '0';
      this._wrapper.style.overflow = 'hidden';
      this._element = document.createElement('div');
      this._element.style.margin = '0';
      this._element.style.padding = '0';
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
  }, {
    key: "_mouseDownEvent",
    value: function _mouseDownEvent(event) {
      this._startY = event.pageY;

      this._dragEventHandler.startDrag(this._seriesIndex);
    }
  }, {
    key: "_pressedMouseMoveEvent",
    value: function _pressedMouseMoveEvent(event) {
      var dragDistance = event.pageY - this._startY;

      this._dragEventHandler.drag(dragDistance, this._seriesIndex);
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
     * @param seriesIndex
     */

  }, {
    key: "updateSeriesIndex",
    value: function updateSeriesIndex(seriesIndex) {
      this._seriesIndex = seriesIndex;
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
      var pixelRatio = getPixelRatio(ctx);
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

  return SeparatorSeries;
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
        this._chartData.setCrossHairSeriesTag(null);
      }
    }
  }, {
    key: "mouseMoveEvent",
    value: function mouseMoveEvent(event) {
      if (!isMouse(event)) {
        return;
      }

      if (!this._checkEventPointX(event.localX)) {
        this._chartData.setCrossHairSeriesTag(null);

        return;
      }

      var real = this._translateCrossHairRealY(event.localY);

      if (!real) {
        this._chartData.setCrossHairSeriesTag(null);

        return;
      }

      this._chartData.setCrossHairPoint({
        x: event.localX,
        y: real.y
      });

      this._chartData.setCrossHairSeriesTag(real.tag);
    }
  }, {
    key: "mouseWheelEvent",
    value: function mouseWheelEvent(event) {
      event.preventDefault(event);

      this._chartData.startScroll();

      this._chartData.scroll(-event.deltaX);

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
        var scale = Math.sign(deltaY) * Math.min(1, Math.abs(deltaY)) * 5;

        this._chartData.zoom(scale, {
          x: event.localX,
          y: event.localY
        });
      }
    }
  }, {
    key: "mouseClickEvent",
    value: function mouseClickEvent(event) {
      if (!isTouch(event) || !this._checkEventPointX(event.localX)) {
        return;
      }

      var real = this._translateCrossHairRealY(event.localY);

      if (!real) {
        return;
      }

      if (!this._touchPoint && !this._touchCancelCrossHair && !this._touchZoomed) {
        this._touchPoint = {
          x: event.localX,
          y: event.localY
        };

        this._chartData.setCrossHairPoint({
          x: event.localX,
          y: real.y
        });

        this._chartData.setCrossHairSeriesTag(real.tag);
      }
    }
  }, {
    key: "mouseDownEvent",
    value: function mouseDownEvent(event) {
      this._startScrollPoint = {
        x: event.localX,
        y: event.localY
      };

      this._chartData.startScroll();

      if (!isTouch(event) || !this._checkEventPointX(event.localX)) {
        return;
      }

      var real = this._translateCrossHairRealY(event.localY);

      if (!real) {
        return;
      }

      var crossHairPoint = {
        x: event.localX,
        y: real.y
      };
      this._touchZoomed = false;

      if (this._touchPoint) {
        var xDif = event.localX - this._touchPoint.x;
        var yDif = event.localY - this._touchPoint.y;
        var radius = Math.sqrt(xDif * xDif + yDif * yDif);

        if (radius < 10) {
          this._touchPoint = {
            x: event.localX,
            y: event.localY
          };

          this._chartData.setCrossHairPoint(crossHairPoint);

          this._chartData.setCrossHairSeriesTag(real.tag);
        } else {
          this._touchCancelCrossHair = true;
          this._touchPoint = null;

          this._chartData.setCrossHairPoint(crossHairPoint);

          this._chartData.setCrossHairSeriesTag(null);
        }
      } else {
        this._touchCancelCrossHair = false;
      }
    }
  }, {
    key: "pressedMouseMoveEvent",
    value: function pressedMouseMoveEvent(event) {
      if (!this._checkEventPointX(event.localX)) {
        return;
      }

      var real = this._translateCrossHairRealY(event.localY);

      if (!real) {
        return;
      }

      var crossHairPoint = {
        x: event.localX,
        y: real.y
      };

      if (isTouch(event)) {
        if (this._touchPoint) {
          this._touchPoint = {
            x: event.localX,
            y: event.localY
          };

          this._chartData.setCrossHairPoint(crossHairPoint);

          this._chartData.setCrossHairSeriesTag(real.tag);

          return;
        }
      }

      var distance = event.localX - this._startScrollPoint.x;

      this._chartData.setCrossHairPoint(crossHairPoint);

      this._chartData.scroll(distance);
    }
  }, {
    key: "longTapEvent",
    value: function longTapEvent(event) {
      if (!isTouch(event) || !this._checkEventPointX(event.localX)) {
        return;
      }

      var real = this._translateCrossHairRealY(event.localY);

      if (!real) {
        return;
      }

      this._touchPoint = {
        x: event.localX,
        y: event.localY
      };

      this._chartData.setCrossHairPoint({
        x: event.localX,
        y: real.y
      });

      this._chartData.setCrossHairSeriesTag(real.tag);
    }
    /**
     * 将事件的y点转换成十字光标点的y
     * @param y
     * @returns {{}|null}
     * @private
     */

  }, {
    key: "_translateCrossHairRealY",
    value: function _translateCrossHairRealY(y) {
      var tags = this._seriesSize.tags || {};

      for (var tag in tags) {
        var size = tags[tag];

        if (y > size.contentTop && y < size.contentBottom) {
          return {
            tag: tag,
            y: y - size.contentTop
          };
        }
      }

      return null;
    }
  }]);

  return ZoomScrollEventHandler;
}(EventHandler);

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
          case 'ArrowUp':
            {
              this._chartData.zoom(-0.5, this._chartData.crossHairPoint());

              break;
            }

          case 'ArrowDown':
            {
              this._chartData.zoom(0.5, this._chartData.crossHairPoint());

              break;
            }

          case 'ArrowLeft':
            {
              this._chartData.startScroll();

              this._chartData.scroll(-this._chartData.dataSpace());

              break;
            }

          case 'ArrowRight':
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
    this._seriesSize = {};
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
      event.localX -= this._seriesSize.contentLeft;

      this._graphicMarkEventHandler.mouseUpEvent(event);
    }
  }, {
    key: "_mouseLeaveEvent",
    value: function _mouseLeaveEvent(event) {
      if (this._checkZoomScroll()) {
        event.localX -= this._seriesSize.contentLeft;

        this._zoomScrollEventHandler.mouseLeaveEvent(event);
      }
    }
  }, {
    key: "_mouseMoveEvent",
    value: function _mouseMoveEvent(event) {
      event.localX -= this._seriesSize.contentLeft;

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
        event.localX -= this._seriesSize.contentLeft;

        this._zoomScrollEventHandler.mouseClickEvent(event);
      }
    }
  }, {
    key: "_mouseDownEvent",
    value: function _mouseDownEvent(event) {
      this._target.style.cursor = 'pointer';
      event.localX -= this._seriesSize.contentLeft;

      this._graphicMarkEventHandler.mouseDownEvent(event);

      if (this._checkZoomScroll()) {
        this._zoomScrollEventHandler.mouseDownEvent(event);
      }
    }
  }, {
    key: "_mouseRightDownEvent",
    value: function _mouseRightDownEvent(event) {
      event.localX -= this._seriesSize.contentLeft;

      this._graphicMarkEventHandler.mouseRightDownEvent(event);
    }
  }, {
    key: "_pressedMouseMoveEvent",
    value: function _pressedMouseMoveEvent(event) {
      event.localX -= this._seriesSize.contentLeft;

      if (this._chartData.dragGraphicMarkFlag()) {
        this._graphicMarkEventHandler.pressedMouseMoveEvent(event); // 这里判断一下，如果是在拖拽图形标记，让十字光标不显示


        if (this._chartData.crossHairSeriesTag() !== null) {
          this._chartData.setCrossHairSeriesTag(null);
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
        event.localX -= this._seriesSize.contentLeft;

        this._zoomScrollEventHandler.longTapEvent(event);
      }
    }
  }, {
    key: "_checkZoomScroll",
    value: function _checkZoomScroll() {
      return !this._chartData.dragGraphicMarkFlag() && this._chartData.graphicMarkType() === GraphicMarkType.NONE;
    }
  }, {
    key: "setSeriesSize",
    value: function setSeriesSize(seriesSize) {
      this._seriesSize = seriesSize;

      this._zoomScrollEventHandler.setSeriesSize(seriesSize);

      this._graphicMarkEventHandler.setSeriesSize(seriesSize);
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

var DEFAULT_TECHNICAL_INDICATOR_SERIES_HEIGHT = 100;
var TECHNICAL_INDICATOR_NAME_PREFIX = 'technical_indicator_';
var CANDLE_STICK_SERIES_TAG = 'candle_stick_series_tag';

var ChartSeries = /*#__PURE__*/function () {
  function ChartSeries(container, styleOptions) {
    _classCallCheck(this, ChartSeries);

    this._initChartContainer(container);

    this._technicalIndicatorBaseId = 0;
    this._technicalIndicatorSeries = [];
    this._separatorSeries = [];
    this._separatorDragStartTechnicalIndicatorHeight = 0;
    this._chartData = new ChartData(styleOptions, this._updateSeries.bind(this));
    this._xAxisSeries = new XAxisSeries({
      container: this._chartContainer,
      chartData: this._chartData
    });
    this._candleStickSeries = new CandleStickSeries({
      container: this._chartContainer,
      chartData: this._chartData,
      xAxis: this._xAxisSeries.xAxis(),
      technicalIndicatorType: TechnicalIndicatorType.MA,
      tag: CANDLE_STICK_SERIES_TAG
    });
    this._chartEvent = new ChartEvent(this._chartContainer, this._chartData, this._xAxisSeries.xAxis(), this._candleStickSeries.yAxis());
    this.measureSeriesSize();
  }
  /**
   * 初始化图表容器
   * @param container
   * @private
   */


  _createClass(ChartSeries, [{
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
     * @param seriesIndex
     * @private
     */

  }, {
    key: "_separatorStartDrag",
    value: function _separatorStartDrag(seriesIndex) {
      this._separatorDragStartTechnicalIndicatorHeight = this._technicalIndicatorSeries[seriesIndex].height();
    }
    /**
     * 分割线拖拽
     * @param dragDistance
     * @param seriesIndex
     * @private
     */

  }, {
    key: "_separatorDrag",
    value: function _separatorDrag(dragDistance, seriesIndex) {
      var height = this._separatorDragStartTechnicalIndicatorHeight - dragDistance;

      if (height < 0) {
        height = 0;
      }

      this._technicalIndicatorSeries[seriesIndex].setHeight(height);

      this.measureSeriesSize();
    }
    /**
     * 计算x轴的高度
     * @returns {number}
     * @private
     */

  }, {
    key: "_measureXAxisHeight",
    value: function _measureXAxisHeight() {
      var xAxis = this._chartData.styleOptions().xAxis;

      var axisLine = xAxis.axisLine;
      var tickText = xAxis.tickText;
      var tickLine = xAxis.tickLine;
      var height = 0;

      if (xAxis.display) {
        if (axisLine.display) {
          height += axisLine.size;
        }

        if (tickLine.display) {
          height += tickLine.length;
        }

        if (tickText.display) {
          height += tickText.size + tickText.margin;
        }
      }

      if (height > 0) {
        height = Math.ceil(Math.max(xAxis.minHeight, Math.min(height, xAxis.maxHeight)));
      }

      return height;
    }
    /**
     * 计算y轴宽度
     * @returns {number}
     * @private
     */

  }, {
    key: "_measureYAxisWidth",
    value: function _measureYAxisWidth() {
      var yAxis = this._chartData.styleOptions().yAxis;

      var axisLine = yAxis.axisLine;
      var tickText = yAxis.tickText;
      var tickLine = yAxis.tickLine;
      var width = 0;

      if (yAxis.display) {
        if (yAxis.axisLine.display) {
          width += axisLine.size;
        }

        if (yAxis.tickLine.display) {
          width += tickLine.length;
        }

        if (yAxis.tickText.display) {
          width += tickText.margin + (tickText.size - 2) * 6;
        }
      }

      if (width > 0) {
        width = Math.ceil(Math.max(yAxis.minWidth, Math.min(width, yAxis.maxWidth)));
      }

      return width;
    }
    /**
     * 测量图表间分割线的高度
     * @returns {number}
     * @private
     */

  }, {
    key: "_measureSeparatorHeight",
    value: function _measureSeparatorHeight() {
      var separator = this._chartData.styleOptions().separator;

      return separator.size * this._separatorSeries.length;
    }
    /**
     * 更新所有series
     * @private
     */

  }, {
    key: "_updateSeries",
    value: function _updateSeries() {
      var invalidateLevel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : InvalidateLevel.FULL;

      if (invalidateLevel !== InvalidateLevel.GRAPHIC_MARK) {
        this._xAxisSeries.invalidate(invalidateLevel);

        var _iterator = _createForOfIteratorHelper(this._technicalIndicatorSeries),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var series = _step.value;
            series.invalidate(invalidateLevel);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }

      this._candleStickSeries.invalidate(invalidateLevel);
    }
    /**
     * 计算所有series的指标
     * @private
     */

  }, {
    key: "_calcAllSeriesTechnicalIndicator",
    value: function _calcAllSeriesTechnicalIndicator() {
      var technicalIndicatorTypeArray = [];
      var candleStickTechnicalIndicatorType;

      if (this._candleStickSeries.chartType() === ChartType.CANDLE_STICK) {
        candleStickTechnicalIndicatorType = this._candleStickSeries.technicalIndicatorType();
        technicalIndicatorTypeArray.push(candleStickTechnicalIndicatorType);
      } else {
        candleStickTechnicalIndicatorType = TechnicalIndicatorType.AVERAGE;
      }

      this._chartData.calcTechnicalIndicator(this._candleStickSeries, candleStickTechnicalIndicatorType);

      var _iterator2 = _createForOfIteratorHelper(this._technicalIndicatorSeries),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var series = _step2.value;
          var technicalIndicatorSeriesTechnicalIndicatorType = series.technicalIndicatorType();

          if (technicalIndicatorTypeArray.indexOf(technicalIndicatorSeriesTechnicalIndicatorType) < 0) {
            technicalIndicatorTypeArray.push(technicalIndicatorSeriesTechnicalIndicatorType);

            this._chartData.calcTechnicalIndicator(series, technicalIndicatorSeriesTechnicalIndicatorType);
          } else {
            series.invalidate(InvalidateLevel.FULL);
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
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
     * 测量尺寸
     * @private
     */

  }, {
    key: "measureSeriesSize",
    value: function measureSeriesSize() {
      var yAxis = this._chartData.styleOptions().yAxis;

      var isYAxisLeft = yAxis.position === YAxisPosition.LEFT;
      var isYAxisTextOutsize = yAxis.tickText.position === YAxisTextPosition.OUTSIDE;
      var seriesWidth = this._container.offsetWidth;
      var seriesHeight = this._container.offsetHeight;

      var separatorHeight = this._measureSeparatorHeight();

      var xAxisHeight = this._measureXAxisHeight();

      var yAxisWidth = this._measureYAxisWidth();

      var seriesExcludeXAxisSeparatorHeight = seriesHeight - xAxisHeight - separatorHeight;
      var mainWidthWidth = seriesWidth - (isYAxisTextOutsize ? yAxisWidth : 0);
      var yAxisOffsetLeft = seriesWidth - yAxisWidth;
      var mainOffsetLeft = 0;

      if (isYAxisLeft) {
        yAxisOffsetLeft = 0;

        if (isYAxisTextOutsize) {
          mainOffsetLeft = yAxisWidth;
        }
      }

      var technicalIndicatorSeriesTotalHeight = 0;

      var _iterator3 = _createForOfIteratorHelper(this._technicalIndicatorSeries),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var series = _step3.value;

          var _seriesHeight = series.height();

          technicalIndicatorSeriesTotalHeight += _seriesHeight; // 修复拖拽会超出容器高度问题

          if (technicalIndicatorSeriesTotalHeight > seriesExcludeXAxisSeparatorHeight) {
            var difHeight = technicalIndicatorSeriesTotalHeight - seriesExcludeXAxisSeparatorHeight;
            technicalIndicatorSeriesTotalHeight = seriesExcludeXAxisSeparatorHeight;
            series.setHeight(_seriesHeight - difHeight);
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      var candleStickSeriesHeight = seriesExcludeXAxisSeparatorHeight - technicalIndicatorSeriesTotalHeight;

      this._chartData.setTotalDataSpace(mainWidthWidth);

      var seriesSize = {};
      seriesSize.contentLeft = mainOffsetLeft;
      seriesSize.contentRight = mainOffsetLeft + mainWidthWidth;
      var tags = {};
      tags[CANDLE_STICK_SERIES_TAG] = {
        contentTop: 0,
        contentBottom: candleStickSeriesHeight
      };
      var contentTop = candleStickSeriesHeight;
      var contentBottom = candleStickSeriesHeight;

      this._candleStickSeries.setSize({
        left: mainOffsetLeft,
        width: mainWidthWidth,
        height: candleStickSeriesHeight
      }, {
        left: yAxisOffsetLeft,
        width: yAxisWidth,
        height: candleStickSeriesHeight
      });

      for (var i = 0; i < this._technicalIndicatorSeries.length; i++) {
        var technicalIndicatorSeries = this._technicalIndicatorSeries[i];
        var separatorSeries = this._separatorSeries[i];
        var technicalIndicatorSeriesHeight = technicalIndicatorSeries.height();
        technicalIndicatorSeries.setSize({
          left: mainOffsetLeft,
          width: mainWidthWidth,
          height: technicalIndicatorSeriesHeight
        }, {
          left: yAxisOffsetLeft,
          width: yAxisWidth,
          height: technicalIndicatorSeriesHeight
        });
        separatorSeries.setSize(mainOffsetLeft, mainWidthWidth);
        contentBottom += technicalIndicatorSeriesHeight;
        tags[technicalIndicatorSeries.tag()] = {
          contentTop: contentTop,
          contentBottom: contentBottom
        };
        contentTop = contentBottom;
      }

      seriesSize.tags = tags;

      this._xAxisSeries.setSize({
        left: mainOffsetLeft,
        width: mainWidthWidth,
        height: xAxisHeight
      }, {
        left: yAxisOffsetLeft,
        width: yAxisWidth,
        height: xAxisHeight
      });

      this._chartEvent.setSeriesSize(seriesSize);
    }
    /**
     * 加载技术指标参数
     * @param technicalIndicatorType
     * @param params
     */

  }, {
    key: "applyTechnicalIndicatorParams",
    value: function applyTechnicalIndicatorParams(technicalIndicatorType, params) {
      this._chartData.applyTechnicalIndicatorParams(technicalIndicatorType, params);

      var seriesCollection = [];

      var candleStickSeriesTechnicalIndicatorType = this._candleStickSeries.technicalIndicatorType();

      if (candleStickSeriesTechnicalIndicatorType === technicalIndicatorType) {
        seriesCollection.push(this._candleStickSeries);
      }

      var _iterator4 = _createForOfIteratorHelper(this._technicalIndicatorSeries),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var series = _step4.value;
          var seriesTechnicalIndicatorType = series.technicalIndicatorType();

          if (seriesTechnicalIndicatorType === technicalIndicatorType) {
            seriesCollection.push(series);
          }
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }

      this._chartData.calcTechnicalIndicator(seriesCollection, technicalIndicatorType);
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

        this._xAxisSeries.invalidate(InvalidateLevel.FULL);

        this._calcAllSeriesTechnicalIndicator();
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
      var _this = this;

      this._applyDataList(dataList, more, function () {
        _this._chartData.clearDataList();
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

        this._xAxisSeries.invalidate(pos === dataSize - 1 ? InvalidateLevel.NONE : InvalidateLevel.FULL);

        this._calcAllSeriesTechnicalIndicator();
      }
    }
    /**
     * 设置蜡烛图图表类型
     * @param type
     */

  }, {
    key: "setCandleStickSeriesType",
    value: function setCandleStickSeriesType(type) {
      this._candleStickSeries.setChartType(type);
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
    value: function createTechnicalIndicator(technicalIndicatorType) {
      var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_TECHNICAL_INDICATOR_SERIES_HEIGHT;
      var dragEnabled = arguments.length > 2 ? arguments[2] : undefined;

      if (!technicalIndicatorType || !TechnicalIndicatorType.hasOwnProperty(technicalIndicatorType) || technicalIndicatorType === TechnicalIndicatorType.NO || technicalIndicatorType === TechnicalIndicatorType.AVERAGE) {
        technicalIndicatorType = TechnicalIndicatorType.MACD;
      }

      var technicalIndicatorSeriesCount = this._technicalIndicatorSeries.length;
      var isDrag = isBoolean(dragEnabled) ? dragEnabled : true;

      this._separatorSeries.push(new SeparatorSeries(this._chartContainer, this._chartData, technicalIndicatorSeriesCount, isDrag, {
        startDrag: this._separatorStartDrag.bind(this),
        drag: this._separatorDrag.bind(this)
      }));

      this._technicalIndicatorBaseId++;
      var tag = "".concat(TECHNICAL_INDICATOR_NAME_PREFIX).concat(this._technicalIndicatorBaseId);
      var technicalIndicatorSeries = new TechnicalIndicatorSeries({
        container: this._chartContainer,
        chartData: this._chartData,
        xAxis: this._xAxisSeries.xAxis(),
        technicalIndicatorType: technicalIndicatorType,
        tag: tag
      });
      technicalIndicatorSeries.setHeight(height);

      this._technicalIndicatorSeries.push(technicalIndicatorSeries);

      this.measureSeriesSize();
      return tag;
    }
    /**
     * 移除一个指标
     * @param tag
     */

  }, {
    key: "removeTechnicalIndicator",
    value: function removeTechnicalIndicator(tag) {
      var seriesPos = -1;

      for (var i = 0; i < this._technicalIndicatorSeries.length; i++) {
        var series = this._technicalIndicatorSeries[i];

        if (series.tag() === tag) {
          seriesPos = i;
          break;
        }
      }

      if (seriesPos !== -1) {
        this._technicalIndicatorSeries[seriesPos].destroy();

        this._separatorSeries[seriesPos].destroy();

        this._technicalIndicatorSeries.splice(seriesPos, 1);

        this._separatorSeries.splice(seriesPos, 1);

        for (var _i = 0; _i < this._separatorSeries.length; _i++) {
          this._separatorSeries[_i].updateSeriesIndex(_i);
        }

        this.measureSeriesSize();
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
      if (tag === CANDLE_STICK_SERIES_TAG) {
        this._candleStickSeries.setTechnicalIndicatorType(technicalIndicatorType);
      } else {
        var s;

        var _iterator5 = _createForOfIteratorHelper(this._technicalIndicatorSeries),
            _step5;

        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var series = _step5.value;

            if (series.tag() === tag) {
              s = series;
              break;
            }
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }

        if (s) {
          if (technicalIndicatorType === TechnicalIndicatorType.NO) {
            this.removeTechnicalIndicator(tag);
          } else {
            s.setTechnicalIndicatorType(technicalIndicatorType);
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

      this._xAxisSeries.invalidate(InvalidateLevel.FULL);
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
      var pixelRatio = getPixelRatio(ctx);
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

      var candleStickSeriesHeight = this._candleStickSeries.height();

      ctx.drawImage(this._candleStickSeries.getImage(includeFloatLayer, includeGraphicMark), 0, offsetTop, width, candleStickSeriesHeight);
      offsetTop += candleStickSeriesHeight;

      for (var i = 0; i < this._separatorSeries.length; i++) {
        var separatorSeries = this._separatorSeries[i];
        var separatorSeriesHeight = separatorSeries.height();
        var technicalIndicatorSeries = this._technicalIndicatorSeries[i];
        var technicalIndicatorSeriesHeight = technicalIndicatorSeries.height();
        ctx.drawImage(separatorSeries.getImage(), 0, offsetTop, width, separatorSeriesHeight);
        offsetTop += separatorSeriesHeight;
        ctx.drawImage(technicalIndicatorSeries.getImage(includeFloatLayer), 0, offsetTop, width, technicalIndicatorSeriesHeight);
        offsetTop += technicalIndicatorSeriesHeight;
      }

      ctx.drawImage(this._xAxisSeries.getImage(includeFloatLayer), 0, offsetTop, width, this._xAxisSeries.height());
      return canvas.toDataURL("image/".concat(type));
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this._candleStickSeries.destroy();

      this._technicalIndicatorSeries.forEach(function (series) {
        series.destroy();
      });

      this._separatorSeries.forEach(function (series) {
        series.destroy();
      });

      this._xAxisSeries.destroy();

      this._container.removeChild(this._chartContainer);

      this._chartEvent.destroy();
    }
  }]);

  return ChartSeries;
}();

var Chart = /*#__PURE__*/function () {
  function Chart(container, styleOptions) {
    _classCallCheck(this, Chart);

    this._chartSeries = new ChartSeries(container, styleOptions);
  }
  /**
   * 设置样式配置
   * @param options
   */


  _createClass(Chart, [{
    key: "setStyleOptions",
    value: function setStyleOptions(options) {
      this._chartSeries.chartData().applyStyleOptions(options);

      this._chartSeries.measureSeriesSize();
    }
    /**
     * 获取样式配置
     * @returns {[]|*[]}
     */

  }, {
    key: "getStyleOptions",
    value: function getStyleOptions() {
      return clone(this._chartSeries.chartData().styleOptions());
    }
    /**
     * 加载技术指标参数
     * @param technicalIndicatorType
     * @param params
     */

  }, {
    key: "setTechnicalIndicatorParams",
    value: function setTechnicalIndicatorParams(technicalIndicatorType, params) {
      this._chartSeries.applyTechnicalIndicatorParams(technicalIndicatorType, params);
    }
    /**
     * 获取技术指标参数配置
     */

  }, {
    key: "getTechnicalIndicatorParamOptions",
    value: function getTechnicalIndicatorParamOptions() {
      return clone(this._chartSeries.chartData().technicalIndicatorParamOptions());
    }
    /**
     * 加载精度
     * @param pricePrecision
     * @param volumePrecision
     */

  }, {
    key: "setPrecision",
    value: function setPrecision(pricePrecision, volumePrecision) {
      this._chartSeries.chartData().applyPrecision(pricePrecision, volumePrecision);
    }
    /**
     * 设置时区
     * @param timezone
     */

  }, {
    key: "setTimezone",
    value: function setTimezone(timezone) {
      this._chartSeries.setTimezone(timezone);
    }
    /**
     * 重置尺寸，总是会填充父容器
     */

  }, {
    key: "resize",
    value: function resize() {
      this._chartSeries.measureSeriesSize();
    }
    /**
     * 设置右边间距
     * @param space
     */

  }, {
    key: "setOffsetRightSpace",
    value: function setOffsetRightSpace(space) {
      this._chartSeries.chartData().setOffsetRightSpace(space);
    }
    /**
     * 设置左边可见的最小bar数量
     * @param barCount
     */

  }, {
    key: "setLeftMinVisibleBarCount",
    value: function setLeftMinVisibleBarCount(barCount) {
      this._chartSeries.chartData().setLeftMinVisibleBarCount(barCount);
    }
    /**
     * 设置右边可见的最小bar数量
     * @param barCount
     */

  }, {
    key: "setRightMinVisibleBarCount",
    value: function setRightMinVisibleBarCount(barCount) {
      this._chartSeries.chartData().setRightMinVisibleBarCount(barCount);
    }
    /**
     * 设置一条数据的空间
     * @param space
     */

  }, {
    key: "setDataSpace",
    value: function setDataSpace(space) {
      this._chartSeries.chartData().setDataSpace(space);
    }
    /**
     * 清空数据
     */

  }, {
    key: "clearData",
    value: function clearData() {
      this._chartSeries.chartData().clearDataList();
    }
    /**
     * 获取数据源
     */

  }, {
    key: "getDataList",
    value: function getDataList() {
      return this._chartSeries.chartData().dataList();
    }
    /**
     * 添加新数据
     * @param dataList
     * @param more
     */

  }, {
    key: "applyNewData",
    value: function applyNewData(dataList, more) {
      this._chartSeries.applyNewData(dataList, more);
    }
    /**
     * 添加历史更多数据
     * @param dataList
     * @param more
     */

  }, {
    key: "applyMoreData",
    value: function applyMoreData(dataList, more) {
      this._chartSeries.applyMoreData(dataList, more);
    }
    /**
     * 更新数据
     * @param data
     */

  }, {
    key: "updateData",
    value: function updateData(data) {
      this._chartSeries.updateData(data);
    }
    /**
     * 设置加载更多回调
     * @param cb
     */

  }, {
    key: "loadMore",
    value: function loadMore(cb) {
      this._chartSeries.chartData().loadMore(cb);
    }
    /**
     * 设置蜡烛图表类型
     * @param type
     */

  }, {
    key: "setCandleStickChartType",
    value: function setCandleStickChartType(type) {
      this._chartSeries.setCandleStickSeriesType(type);
    }
    /**
     * 设置蜡烛图技术指标类型
     * @param technicalIndicatorType
     */

  }, {
    key: "setCandleStickTechnicalIndicatorType",
    value: function setCandleStickTechnicalIndicatorType(technicalIndicatorType) {
      this._chartSeries.setTechnicalIndicatorType(CANDLE_STICK_SERIES_TAG, technicalIndicatorType);
    }
    /**
     * 设置技术指标类型
     * @param tag
     * @param technicalIndicatorType
     */

  }, {
    key: "setTechnicalIndicatorType",
    value: function setTechnicalIndicatorType(tag, technicalIndicatorType) {
      this._chartSeries.setTechnicalIndicatorType(tag, technicalIndicatorType);
    }
    /**
     * 添加一个技术指标
     * @param technicalIndicatorType
     * @param height
     * @param dragEnabled
     * @returns {string}
     */

  }, {
    key: "addTechnicalIndicator",
    value: function addTechnicalIndicator(technicalIndicatorType, height, dragEnabled) {
      return this._chartSeries.createTechnicalIndicator(technicalIndicatorType, height, dragEnabled);
    }
    /**
     * 移除一个技术指标
     * @param tag
     */

  }, {
    key: "removeTechnicalIndicator",
    value: function removeTechnicalIndicator(tag) {
      this._chartSeries.removeTechnicalIndicator(tag);
    }
    /**
     * 添加图形标记
     * @param type
     */

  }, {
    key: "addGraphicMark",
    value: function addGraphicMark(type) {
      var graphicMarkType = this._chartSeries.chartData().graphicMarkType();

      if (graphicMarkType !== type) {
        var graphicMarkDatas = this._chartSeries.chartData().graphicMarkData();

        var graphicMarkData = graphicMarkDatas[graphicMarkType];

        if (graphicMarkData && isArray(graphicMarkData)) {
          graphicMarkData.splice(graphicMarkData.length - 1, 1);
          graphicMarkDatas[graphicMarkType] = graphicMarkData;
        }

        if (!graphicMarkDatas.hasOwnProperty(type)) {
          type = GraphicMarkType.NONE;
        }

        this._chartSeries.chartData().setGraphicMarkType(type);

        this._chartSeries.chartData().setGraphicMarkData(graphicMarkDatas);
      }
    }
    /**
     * 移除所有标记图形
     */

  }, {
    key: "removeAllGraphicMark",
    value: function removeAllGraphicMark() {
      var graphicMarkDatas = this._chartSeries.chartData().graphicMarkData();

      var newGraphicMarkDatas = {};
      Object.keys(graphicMarkDatas).forEach(function (key) {
        newGraphicMarkDatas[key] = [];
      });

      this._chartSeries.chartData().setGraphicMarkType(GraphicMarkType.NONE);

      this._chartSeries.chartData().setGraphicMarkData(newGraphicMarkDatas);
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
      return this._chartSeries.getConvertPictureUrl(includeFloatLayer, includeGraphicMark, type, backgroundColor);
    }
    /**
     * 销毁
     */

  }, {
    key: "destroy",
    value: function destroy() {
      this._chartSeries.destroy();
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
  return '5.2.2';
}
/**
 * 初始化
 * @param ds
 * @param style
 * @returns {Chart}
 */


function init(ds) {
  var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var errorMessage = 'Chart version is 5.2.2. Root dom is null, can not initialize the chart!!!';
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
