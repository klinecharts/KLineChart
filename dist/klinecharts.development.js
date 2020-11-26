/**
 * @license
 * KLineChart v6.0.0
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
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
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
    if (key in target) {
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
  return !!value && _typeof(value) === 'object';
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
 * 蜡烛图样式
 * @type {{AREA: string, OHLC: string, CANDLE_STROKE: string, CANDLE_SOLID: string, CANDLE_DOWN_STROKE: string, CANDLE_UP_STROKE: string}}
 */

var CandleType = {
  CANDLE_SOLID: 'candle_solid',
  CANDLE_STROKE: 'candle_stroke',
  CANDLE_UP_STROKE: 'candle_up_stroke',
  CANDLE_DOWN_STROKE: 'candle_down_stroke',
  OHLC: 'ohlc',
  AREA: 'area'
};
/**
 * 说明显示规则
 * @type {{FOLLOW_CROSS: string, NONE: string, ALWAYS: string}}
 */

var TooltipShowRule = {
  ALWAYS: 'always',
  FOLLOW_CROSS: 'follow_cross',
  NONE: 'none'
};
/**
 * 主图数据提示显示类型
 * @type {{RECT: string, STANDARD: string}}
 */

var TooltipCandleShowType = {
  RECT: 'rect',
  STANDARD: 'standard'
};
/**
 * 默认网格配置
 * @type {{horizontal: {size: number, color: string, dashValue: number[], show: boolean, style: string}, show: boolean, vertical: {size: number, color: string, dashValue: number[], show: boolean, style: string}}}
 */

var defaultGrid = {
  show: true,
  horizontal: {
    show: true,
    size: 1,
    color: '#393939',
    style: LineStyle.DASH,
    dashValue: [2, 2]
  },
  vertical: {
    show: true,
    size: 1,
    color: '#393939',
    style: LineStyle.DASH,
    dashValue: [2, 2]
  }
};
/**
 * 默认蜡烛柱图样式配置
 * @type {{area: {fillColor: [{offset: number, color: string}, {offset: number, color: string}], lineColor: string, lineSize: number, value: string}, bar: {noChangeColor: string, upColor: string, downColor: string}, tooltip: {rect: {offsetTop: number, fillColor: string, borderColor: string, paddingBottom: number, borderRadius: number, paddingRight: number, borderSize: number, offsetLeft: number, paddingTop: number, paddingLeft: number, offsetRight: number}, showRule: string, values: null, showType: string, text: {marginRight: number, size: number, color: string, weight: string, marginBottom: number, family: string, marginTop: number, marginLeft: number}, labels: string[]}, type: string, priceMark: {high: {textMargin: number, textSize: number, color: string, textFamily: string, show: boolean, textWeight: string}, last: {noChangeColor: string, upColor: string, line: {dashValue: number[], size: number, show: boolean, style: string}, show: boolean, text: {paddingBottom: number, size: number, color: string, paddingRight: number, show: boolean, weight: string, paddingTop: number, family: string, paddingLeft: number}, downColor: string}, low: {textMargin: number, textSize: number, color: string, textFamily: string, show: boolean, textWeight: string}, show: boolean}}}
 */

var defaultCandle = {
  type: CandleType.CANDLE_SOLID,
  bar: {
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
  area: {
    lineSize: 2,
    lineColor: '#2196F3',
    value: 'close',
    fillColor: [{
      offset: 0,
      color: 'rgba(33, 150, 243, 0.01)'
    }, {
      offset: 1,
      color: 'rgba(33, 150, 243, 0.2)'
    }]
  },
  priceMark: {
    show: true,
    high: {
      show: true,
      color: '#D9D9D9',
      textMargin: 5,
      textSize: 10,
      textFamily: 'Helvetica Neue',
      textWeight: 'normal'
    },
    low: {
      show: true,
      color: '#D9D9D9',
      textMargin: 5,
      textSize: 10,
      textFamily: 'Helvetica Neue',
      textWeight: 'normal'
    },
    last: {
      show: true,
      upColor: '#26A69A',
      downColor: '#EF5350',
      noChangeColor: '#888888',
      line: {
        show: true,
        style: LineStyle.DASH,
        dashValue: [4, 4],
        size: 1
      },
      text: {
        show: true,
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
  },
  tooltip: {
    showRule: TooltipShowRule.ALWAYS,
    showType: TooltipCandleShowType.STANDARD,
    labels: ['时间', '开', '收', '高', '低', '成交量'],
    values: null,
    rect: {
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: 0,
      paddingBottom: 6,
      offsetLeft: 8,
      offsetTop: 8,
      offsetRight: 8,
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
  }
};
/**
 * 默认的技术指标样式配置
 * @type {{bar: {noChangeColor: string, upColor: string, downColor: string}, line: {size: number, colors: [string, string, string, string, string]}, tooltip: {showParams: boolean, showName: boolean, showRule: string, text: {marginRight: number, size: number, color: string, weight: string, marginBottom: number, family: string, marginTop: number, marginLeft: number}}, circle: {noChangeColor: string, upColor: string, downColor: string}, lastValueMark: {show: boolean, text: {paddingBottom: number, color: string, size: number, paddingRight: number, show: boolean, weight: string, paddingTop: number, family: string, paddingLeft: number}}}}
 */

var defaultTechnicalIndicator = {
  bar: {
    upColor: 'rgba(38, 166, 154, .65)',
    downColor: 'rgba(239, 83, 80, .65)',
    noChangeColor: '#888888'
  },
  line: {
    size: 1,
    colors: ['#FF9600', '#9D65C9', '#2196F3', '#E11D74', '#01C5C4']
  },
  circle: {
    upColor: 'rgba(38, 166, 154, .65)',
    downColor: 'rgba(239, 83, 80, .65)',
    noChangeColor: '#888888'
  },
  lastValueMark: {
    show: false,
    text: {
      show: false,
      color: '#ffffff',
      size: 12,
      family: 'Helvetica Neue',
      weight: 'normal',
      paddingLeft: 3,
      paddingTop: 2,
      paddingRight: 3,
      paddingBottom: 2
    }
  },
  tooltip: {
    showRule: TooltipShowRule.ALWAYS,
    showName: true,
    showParams: true,
    text: {
      size: 12,
      family: 'Helvetica Neue',
      weight: 'normal',
      color: '#D9D9D9',
      marginTop: 6,
      marginRight: 8,
      marginBottom: 0,
      marginLeft: 8
    }
  }
};
/**
 * 默认x轴配置
 * @type {{axisLine: {color: string, size: number, show: boolean}, show: boolean, tickText: {paddingBottom: number, color: string, size: number, show: boolean, weight: string, paddingTop: number, family: string}, height: null, tickLine: {size: number, color: string, show: boolean, length: number}}}
 */

var defaultXAxis = {
  /**
   * 是否显示整个轴
   */
  show: true,

  /**
   * 高度
   */
  height: null,

  /**
   * 轴线配置
   */
  axisLine: {
    show: true,
    color: '#888888',
    size: 1
  },

  /**
   * tick文字
   */
  tickText: {
    show: true,
    color: '#D9D9D9',
    size: 12,
    family: 'Helvetica Neue',
    weight: 'normal',
    paddingTop: 3,
    paddingBottom: 6
  },
  // tick线
  tickLine: {
    show: true,
    size: 1,
    length: 3,
    color: '#888888'
  }
};
/**
 * 默认y轴配置
 * @type {{axisLine: {color: string, size: number, show: boolean}, show: boolean, width: null, position: string, tickText: {color: string, size: number, paddingRight: number, show: boolean, weight: string, family: string, paddingLeft: number}, type: string, inside: boolean, tickLine: {size: number, color: string, show: boolean, length: number}}}
 */

var defaultYAxis = {
  /**
   * 是否显示整个轴
   */
  show: true,

  /**
   * 宽度
   */
  width: null,

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
    show: true,
    color: '#888888',
    size: 1
  },

  /**
   * tick文字
   */
  tickText: {
    show: true,
    color: '#D9D9D9',
    size: 12,
    family: 'Helvetica Neue',
    weight: 'normal',
    paddingLeft: 3,
    paddingRight: 6
  },
  // tick线
  tickLine: {
    show: true,
    size: 1,
    length: 3,
    color: '#888888'
  }
};
var defaultCrosshair = {
  show: true,
  horizontal: {
    show: true,
    line: {
      show: true,
      style: LineStyle.DASH,
      dashValue: [4, 2],
      size: 1,
      color: '#888888'
    },
    text: {
      show: true,
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
    show: true,
    line: {
      show: true,
      style: LineStyle.DASH,
      dashValue: [4, 2],
      size: 1,
      color: '#888888'
    },
    text: {
      show: true,
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
};
/**
 * 默认图形标记配置
 * @type {{line: {color: string, size: number}, text: {marginRight: number, color: string, size: number, weight: string, marginBottom: number, family: string, marginTop: number, marginLeft: number}, point: {backgroundColor: string, borderColor: string, activeBorderSize: number, activeRadius: number, activeBorderColor: string, activeBackgroundColor: string, borderSize: number, radius: number}}}
 */

var defaultGraphicMark = {
  line: {
    color: '#2196F3',
    size: 1
  },
  point: {
    backgroundColor: '#181818',
    borderColor: '#fff',
    borderSize: 1,
    radius: 5,
    activeBackgroundColor: '#181818',
    activeBorderColor: '#fff',
    activeBorderSize: 2,
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
  candle: defaultCandle,
  technicalIndicator: defaultTechnicalIndicator,
  xAxis: defaultXAxis,
  yAxis: defaultYAxis,
  separator: defaultSeparator,
  crosshair: defaultCrosshair,
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

function formatDate(dateTimeFormat, timestamp) {
  var format = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'MM-DD hh:mm';

  if (timestamp && isNumber(timestamp)) {
    var dateTimeString = dateTimeFormat.format(new Date(timestamp));
    var dateTimeStringArray = dateTimeString.split(', ');
    var dateStringArray = dateTimeStringArray[0].split('/');
    var date = {
      YYYY: dateStringArray[2],
      MM: dateStringArray[0],
      DD: dateStringArray[1],
      'hh:mm': dateTimeStringArray[1].match(/^[\d]{2}/)[0] === '24' ? dateTimeStringArray[1].replace(/^[\d]{2}/, '00') : dateTimeStringArray[1]
    };
    return format.replace(/YYYY|MM|DD|(hh:mm)/g, function (key) {
      return date[key];
    });
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
    this.name = name || ''; // 指标系列，值有 'price', 'volume', 'normal

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
var AVP = 'AVP';
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

var AveragePrice = /*#__PURE__*/function (_TechnicalIndicator) {
  _inherits(AveragePrice, _TechnicalIndicator);

  var _super = _createSuper(AveragePrice);

  function AveragePrice() {
    _classCallCheck(this, AveragePrice);

    return _super.call(this, {
      name: AVP,
      series: TechnicalIndicatorSeries.PRICE,
      precision: 2,
      plots: [{
        key: 'avp',
        type: 'line'
      }]
    });
  }

  _createClass(AveragePrice, [{
    key: "calcTechnicalIndicator",
    value: function calcTechnicalIndicator(dataList, calcParams) {
      var result = [];
      var totalTurnover = 0;
      var totalVolume = 0;
      dataList.forEach(function (kLineData) {
        var avp = {};
        var turnover = kLineData.turnover || 0;
        var volume = kLineData.volume || 0;
        totalTurnover += turnover;
        totalVolume += volume;

        if (totalVolume !== 0) {
          avp.avp = totalTurnover / totalVolume;
        }

        result.push(avp);
      });
      return result;
    }
  }]);

  return AveragePrice;
}(TechnicalIndicator);

var MovingAverage = /*#__PURE__*/function (_TechnicalIndicator) {
  _inherits(MovingAverage, _TechnicalIndicator);

  var _super = _createSuper(MovingAverage);

  function MovingAverage() {
    var _this;

    _classCallCheck(this, MovingAverage);

    _this = _super.call(this, {
      name: MA,
      series: TechnicalIndicatorSeries.PRICE,
      precision: 2,
      shouldCheckParamCount: false,
      shouldOhlc: true
    });

    _this.setCalcParams([5, 10, 30, 60]);

    return _this;
  }

  _createClass(MovingAverage, [{
    key: "regeneratePlots",
    value: function regeneratePlots(params) {
      return params.map(function (p) {
        return {
          key: "ma".concat(p),
          type: 'line'
        };
      });
    }
  }, {
    key: "calcTechnicalIndicator",
    value: function calcTechnicalIndicator(dataList, calcParams, plots) {
      var closeSums = [];
      var result = [];
      dataList.forEach(function (kLineData, i) {
        var ma = {};
        var close = kLineData.close;
        calcParams.forEach(function (param, j) {
          closeSums[j] = (closeSums[j] || 0) + close;

          if (i >= param - 1) {
            ma[plots[j].key] = closeSums[j] / param;
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
    var _this;

    _classCallCheck(this, ExponentialMovingAverage);

    _this = _super.call(this, {
      name: EMA,
      series: TechnicalIndicatorSeries.PRICE,
      precision: 2,
      shouldCheckParamCount: false,
      shouldOhlc: true
    });

    _this.setCalcParams([6, 12, 20]);

    return _this;
  }

  _createClass(ExponentialMovingAverage, [{
    key: "regeneratePlots",
    value: function regeneratePlots(params) {
      return params.map(function (p) {
        return {
          key: "ema".concat(p),
          type: 'line'
        };
      });
    }
    /**
     * 计算指数移动平均
     *
     * @param dataList
     * @param calcParams
     * @param plots
     * @returns {[]}
     */

  }, {
    key: "calcTechnicalIndicator",
    value: function calcTechnicalIndicator(dataList, calcParams, plots) {
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

          ema[plots[j].key] = emaValue;
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
    var _this;

    _classCallCheck(this, Volume);

    _this = _super.call(this, {
      name: VOL,
      series: TechnicalIndicatorSeries.VOLUME,
      shouldCheckParamCount: false,
      shouldFormatBigNumber: true,
      precision: 0,
      baseValue: 0,
      minValue: 0
    });

    _this.setCalcParams([5, 10, 20]);

    return _this;
  }

  _createClass(Volume, [{
    key: "regeneratePlots",
    value: function regeneratePlots(params) {
      var plots = params.map(function (p) {
        return {
          key: "ma".concat(p),
          type: 'line'
        };
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
    value: function calcTechnicalIndicator(dataList, calcParams, plots) {
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
            vol[plots[j].key] = volSums[j] / param;
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
    var _this;

    _classCallCheck(this, RelativeStrengthIndex);

    _this = _super.call(this, {
      name: RSI,
      shouldCheckParamCount: false
    });

    _this.setCalcParams([6, 12, 24]);

    return _this;
  }

  _createClass(RelativeStrengthIndex, [{
    key: "regeneratePlots",
    value: function regeneratePlots(params) {
      return params.map(function (p) {
        return {
          key: "rsi".concat(p),
          type: 'line'
        };
      });
    }
    /**
     * 计算RSI
     * N日RSI = N日内收盘涨幅的平均值/(N日内收盘涨幅均值+N日内收盘跌幅均值) ×100%
     *
     * @param dataList
     * @param calcParams
     * @param plots
     * @returns {[]}
     */

  }, {
    key: "calcTechnicalIndicator",
    value: function calcTechnicalIndicator(dataList, calcParams, plots) {
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
            rsi[plots[j].key] = b === 0 ? 0 : a / b * 100;
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
    var _this;

    _classCallCheck(this, Bias);

    _this = _super.call(this, {
      name: BIAS,
      shouldCheckParamCount: false
    });

    _this.setCalcParams([6, 12, 24]);

    return _this;
  }

  _createClass(Bias, [{
    key: "regeneratePlots",
    value: function regeneratePlots(params) {
      return params.map(function (p) {
        return {
          key: "bias".concat(p),
          type: 'line'
        };
      });
    }
    /**
     * 计算BIAS指标
     * 乖离率=[(当日收盘价-N日平均价)/N日平均价]*100%
     *
     * @param dataList
     * @param calcParams
     * @param plots
     * @returns {[]}
     */

  }, {
    key: "calcTechnicalIndicator",
    value: function calcTechnicalIndicator(dataList, calcParams, plots) {
      var closeSums = [];
      var result = [];
      dataList.forEach(function (kLineData, i) {
        var bias = {};
        var close = kLineData.close;
        calcParams.forEach(function (param, j) {
          closeSums[j] = (closeSums[j] || 0) + close;

          if (i >= param - 1) {
            var mean = closeSums[j] / calcParams[j];
            bias[plots[j].key] = (close - mean) / mean * 100;
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
        key: 'maPsy',
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
            psy.maPsy = psySum / calcParams[1];
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
        key: 'maTrix',
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
            trix.maTrix = trixSum / calcParams[1];
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
        key: 'maObv',
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
          obv.maObv = obvSum / calcParams[0];
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
        key: 'maVr',
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
            vr.maVr = vrSum / calcParams[1];
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
    var _this;

    _classCallCheck(this, WilliamsR);

    _this = _super.call(this, {
      name: WR,
      shouldCheckParamCount: false
    });

    _this.setCalcParams([6, 10, 14]);

    return _this;
  }

  _createClass(WilliamsR, [{
    key: "regeneratePlots",
    value: function regeneratePlots(params) {
      return params.map(function (_, i) {
        return {
          key: "wr".concat(i + 1),
          type: 'line'
        };
      });
    }
    /**
     * 计算wr指标
     * 公式 WR(N) = 100 * [ HIGH(N)-C ] / [ HIGH(N)-LOW(N) ]
     *
     * @param dataList
     * @param calcParams
     * @param plots
     * @returns {[]}
     */

  }, {
    key: "calcTechnicalIndicator",
    value: function calcTechnicalIndicator(dataList, calcParams, plots) {
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
            wr[plots[index].key] = hnSubLn === 0 ? 0 : (hn - close) / hnSubLn * 100;
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
        key: 'maMtm',
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
            mtm.maMtm = mtmSum / calcParams[1];
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
        key: 'maEmv',
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
              emv.maEmv = emvSum / calcParams[1];
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
 * 创建技术指标映射
 */

function createTechnicalIndicatorMapping() {
  var _ref;

  return _ref = {}, _defineProperty(_ref, AVP, new AveragePrice()), _defineProperty(_ref, MA, new MovingAverage()), _defineProperty(_ref, EMA, new ExponentialMovingAverage()), _defineProperty(_ref, VOL, new Volume()), _defineProperty(_ref, MACD, new MovingAverageConvergenceDivergence()), _defineProperty(_ref, BOLL, new BollingerBands()), _defineProperty(_ref, KDJ, new StockIndicatorKDJ()), _defineProperty(_ref, RSI, new RelativeStrengthIndex()), _defineProperty(_ref, BIAS, new Bias()), _defineProperty(_ref, BRAR, new Brar()), _defineProperty(_ref, CCI, new CommodityChannelIndex()), _defineProperty(_ref, DMI, new DirectionalMovementIndex()), _defineProperty(_ref, CR, new CurrentRatio()), _defineProperty(_ref, PSY, new PsychologicalLine()), _defineProperty(_ref, DMA, new DifferentOfMovingAverage()), _defineProperty(_ref, TRIX, new TripleExponentiallySmoothedAverage()), _defineProperty(_ref, OBV, new OnBalanceVolume()), _defineProperty(_ref, VR, new VolumeRatio()), _defineProperty(_ref, WR, new WilliamsR()), _defineProperty(_ref, MTM, new Momentum()), _defineProperty(_ref, EMV, new EaseOfMovementValue()), _defineProperty(_ref, SAR, new StopAndReverse()), _ref;
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
 * @param render
 * @returns {NewTechnicalIndicator|null}
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
      regeneratePlots = _ref2.regeneratePlots,
      render = _ref2.render;

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

  if (regeneratePlots && isFunction(regeneratePlots)) {
    NewTechnicalIndicator.prototype.regeneratePlots = regeneratePlots;
  }

  if (render && isFunction(render)) {
    NewTechnicalIndicator.prototype.render = render;
  }

  return new NewTechnicalIndicator();
}
/**
 * 获取技术指标信息
 * @param technicalIndicatorData
 * @param technicalIndicator
 * @param yAxis
 * @returns {{values: [], name: string, labels: []}}
 */

function getTechnicalIndicatorTooltipData() {
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
  var calcParamText = '';

  if (plots.length > 0) {
    name = technicalIndicator.name;
  }

  if (calcParams.length > 0) {
    calcParamText = "(".concat(calcParams.join(','), ")");
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
    name: name,
    calcParamText: calcParamText
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
var Delegate = /*#__PURE__*/function () {
  function Delegate() {
    _classCallCheck(this, Delegate);

    this._observers = [];
  }

  _createClass(Delegate, [{
    key: "subscribe",
    value: function subscribe(observer) {
      if (this._observers.indexOf(observer) < 0) {
        this._observers.push(observer);
      }
    }
  }, {
    key: "unsubscribe",
    value: function unsubscribe(observer) {
      var index = this._observers.indexOf(observer);

      if (index > -1) {
        this._observers.splice(index, 1);
      }
    }
  }, {
    key: "execute",
    value: function execute(data) {
      this._observers.forEach(function (observer) {
        observer(data);
      });
    }
  }, {
    key: "hasObservers",
    value: function hasObservers() {
      return this._observers.length > 0;
    }
  }]);

  return Delegate;
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
var HORIZONTAL_STRAIGHT_LINE = 'horizontalStraightLine';
var VERTICAL_STRAIGHT_LINE = 'verticalStraightLine';
var STRAIGHT_LINE = 'straightLine';
var HORIZONTAL_RAY_LINE = 'horizontalRayLine';
var VERTICAL_RAY_LINE = 'verticalRayLine';
var RAY_LINE = 'rayLine';
var HORIZONTAL_SEGMENT_LINE = 'horizontalSegmentLine';
var VERTICAL_SEGMENT_LINE = 'verticalSegmentLine';
var SEGMENT_LINE = 'segmentLine';
var PRICE_LINE = 'priceLine';
var PRICE_CHANNEL_LINE = 'priceChannelLine';
var PARALLEL_STRAIGHT_LINE = 'parallelStraightLine';
var FIBONACCI_LINE = 'fibonacciLine';

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
 * 绘制带边框的填充圆
 * @param ctx
 * @param fillColor
 * @param borderColor
 * @param borderSize
 * @param circlePoint
 * @param radius
 */
function renderStrokeFillCircle(ctx, fillColor, borderColor, borderSize, circlePoint, radius) {
  renderFillCircle(ctx, fillColor, circlePoint, radius);
  renderStrokeCircle(ctx, borderColor, borderSize, circlePoint, radius);
}
/**
 * 绘制边框圆
 * @param ctx
 * @param borderColor
 * @param borderSize
 * @param circlePoint
 * @param radius
 */

function renderStrokeCircle(ctx, borderColor, borderSize, circlePoint, radius) {
  ctx.lineWidth = borderSize;
  ctx.strokeStyle = borderColor;
  ctx.beginPath();
  ctx.arc(circlePoint.x, circlePoint.y, radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.stroke();
}
/**
 * 绘制实心圆
 * @param ctx
 * @param fillColor
 * @param circlePoint
 * @param radius
 */

function renderFillCircle(ctx, fillColor, circlePoint, radius) {
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.arc(circlePoint.x, circlePoint.y, radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}

/**
 * 标记图形绘制步骤
 * @type {{STEP_3: *, STEP_DONE: *, STEP_1: *, STEP_2: *}}
 */

var GraphicMarkDrawStep = {
  STEP_1: 'step_1',
  STEP_2: 'step_2',
  STEP_3: 'step_3',
  STEP_4: 'step_4',
  FINISHED: 'finished'
};
var HoverType = {
  LINE: 'line',
  POINT: 'point',
  NONE: 'none'
};
/**
 * 标记图形
 */

var GraphicMark = /*#__PURE__*/function () {
  function GraphicMark(chartData, xAxis, yAxis) {
    _classCallCheck(this, GraphicMark);

    this._chartData = chartData;
    this._xAxis = xAxis;
    this._yAxis = yAxis;
    this._drawStep = GraphicMarkDrawStep.STEP_1;
    this._tpPoints = [];
    this._hoverType = HoverType.NONE;
    this._hoverIndex = -1;
  }
  /**
   * 时间戳转换成x轴上点的位置
   * @param tpPoint
   * @return {*|number}
   * @private
   */


  _createClass(GraphicMark, [{
    key: "_timestampOrDataIndexToPointX",
    value: function _timestampOrDataIndexToPointX(_ref) {
      var timestamp = _ref.timestamp,
          dataIndex = _ref.dataIndex;
      return timestamp ? this._xAxis.convertToPixel(this._chartData.timestampToDataIndex(timestamp)) : this._xAxis.convertToPixel(dataIndex);
    }
    /**
     * 针对不同图形去检查鼠标点在哪个上面
     * @param point
     * @private
     */

  }, {
    key: "_checkMousePointOnDifGraphic",
    value: function _checkMousePointOnDifGraphic(point) {}
    /**
     * 获取鼠标点在图形上的类型
     * @return {string}
     */

  }, {
    key: "hoverType",
    value: function hoverType() {
      return this._hoverType;
    }
    /**
     * 是否在绘制中
     * @return {boolean}
     */

  }, {
    key: "isDrawing",
    value: function isDrawing() {
      return this._drawStep !== GraphicMarkDrawStep.FINISHED;
    }
    /**
     * 重置鼠标点在图形上的参数
     */

  }, {
    key: "resetHoverParams",
    value: function resetHoverParams() {
      this._hoverType = HoverType.NONE;
      this._hoverIndex = -1;
    }
    /**
     * 检查鼠标点是否在图形上
     * @param point
     * @return {boolean}
     */

  }, {
    key: "checkMousePointOnGraphic",
    value: function checkMousePointOnGraphic(point) {
      var hoverParams = this._checkMousePointOnDifGraphic(point);

      if (hoverParams) {
        this._hoverType = hoverParams.hoverType;
        this._hoverIndex = hoverParams.hoverIndex;
        return true;
      }

      this.resetHoverParams();
    }
    /**
     * 获取图形
     * @param ctx
     * @param xyPoints
     * @param graphicMark
     * @private
     */

  }, {
    key: "_drawGraphic",
    value: function _drawGraphic(ctx, xyPoints, graphicMark) {}
    /**
     * 绘制
     * @param ctx
     */

  }, {
    key: "draw",
    value: function draw(ctx) {
      var _this = this;

      var xyPoints = this._tpPoints.map(function (_ref2) {
        var timestamp = _ref2.timestamp,
            price = _ref2.price,
            dataIndex = _ref2.dataIndex;
        return {
          x: _this._timestampOrDataIndexToPointX({
            timestamp: timestamp,
            dataIndex: dataIndex
          }),
          y: _this._yAxis.convertToPixel(price)
        };
      });

      var graphicMark = this._chartData.styleOptions().graphicMark;

      if (this._drawStep !== GraphicMarkDrawStep.STEP_1) {
        this._drawGraphic(ctx, xyPoints, graphicMark);
      }

      if (this._hoverType !== HoverType.NONE) {
        xyPoints.forEach(function (_ref3, index) {
          var x = _ref3.x,
              y = _ref3.y;
          var radius = graphicMark.point.radius;
          var color = graphicMark.point.backgroundColor;
          var borderColor = graphicMark.point.borderColor;
          var borderSize = graphicMark.point.borderSize;

          if (_this._hoverType === HoverType.POINT && index === _this._hoverIndex) {
            radius = graphicMark.point.activeRadius;
            color = graphicMark.point.activeBackgroundColor;
            borderColor = graphicMark.point.activeBorderColor;
            borderSize = graphicMark.point.activeBorderSize;
          }

          renderStrokeFillCircle(ctx, color, borderColor, borderSize, {
            x: x,
            y: y
          }, radius);
        });
      }
    }
  }]);

  return GraphicMark;
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
 * 绘制水平直线
 * @param ctx
 * @param y
 * @param left
 * @param right
 */
function renderHorizontalLine(ctx, y, left, right) {
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

function renderVerticalLine(ctx, x, top, bottom) {
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
 * @param renderFuc
 */

function renderLine(ctx, renderFuc) {
  ctx.save();

  if (ctx.lineWidth % 2) {
    ctx.translate(0.5, 0.5);
  }

  renderFuc();
  ctx.restore();
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
 * @param extendParallelLineCount
 * @returns {Array}
 */

function getParallelLines(points, size) {
  var extendParallelLineCount = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
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

        if (extendParallelLineCount > 0) {
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

          if (extendParallelLineCount > 0) {
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

          if (extendParallelLineCount > 0) {
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

var LineType = {
  COMMON: 0,
  HORIZONTAL: 1,
  VERTICAL: 2
};
/**
 * 获取绘制线类型
 * @param point1
 * @param point2
 * @private
 */

function getLineType(point1, point2) {
  if (point1.x === point2.x) {
    return LineType.VERTICAL;
  }

  if (point1.y === point2.y) {
    return LineType.HORIZONTAL;
  }

  return LineType.COMMON;
}

var LineGraphicMark = /*#__PURE__*/function (_GraphicMark) {
  _inherits(LineGraphicMark, _GraphicMark);

  var _super = _createSuper(LineGraphicMark);

  function LineGraphicMark() {
    _classCallCheck(this, LineGraphicMark);

    return _super.apply(this, arguments);
  }

  _createClass(LineGraphicMark, [{
    key: "mousePressedMove",

    /**
     * 鼠标按住移动方法
     * @param point
     */
    value: function mousePressedMove(point) {
      if (this._hoverType === HoverType.POINT && this._hoverIndex !== -1) {
        var dataIndex = this._xAxis.convertFromPixel(point.x);

        this._tpPoints[this._hoverIndex].timestamp = this._chartData.dataIndexToTimestamp(dataIndex);
        this._tpPoints[this._hoverIndex].dataIndex = dataIndex;
        this._tpPoints[this._hoverIndex].price = this._yAxis.convertFromPixel(point.y);
      }
    }
  }, {
    key: "_checkMousePointOnDifGraphic",
    value: function _checkMousePointOnDifGraphic(point) {
      var graphicMark = this._chartData.styleOptions().graphicMark;

      var xyPoints = [];

      for (var i = 0; i < this._tpPoints.length; i++) {
        var _this$_tpPoints$i = this._tpPoints[i],
            timestamp = _this$_tpPoints$i.timestamp,
            price = _this$_tpPoints$i.price,
            dataIndex = _this$_tpPoints$i.dataIndex;
        var xyPoint = {
          x: this._timestampOrDataIndexToPointX({
            timestamp: timestamp,
            dataIndex: dataIndex
          }),
          y: this._yAxis.convertToPixel(price)
        };
        xyPoints.push(xyPoint);

        if (checkPointOnCircle(xyPoint, graphicMark.point.radius, point)) {
          return {
            hoverType: HoverType.POINT,
            hoverIndex: i
          };
        }
      }

      return this._checkMousePointOnLine(point, xyPoints);
    }
  }, {
    key: "_checkMousePointOnLine",
    value: function _checkMousePointOnLine(point, xyPoints) {}
    /**
     * 生成线
     * @param xyPoints
     * @private
     */

  }, {
    key: "_generatedDrawLines",
    value: function _generatedDrawLines(xyPoints) {}
    /**
     * 绘制拓展
     * @private
     */

  }, {
    key: "_drawGraphicExtend",
    value: function _drawGraphicExtend(ctx, lines, graphicMark) {}
  }, {
    key: "_drawGraphic",
    value: function _drawGraphic(ctx, xyPoints, graphicMark) {
      ctx.strokeStyle = graphicMark.line.color;
      ctx.lineWidth = graphicMark.line.size;
      var lines = [];

      if (xyPoints.length > 0) {
        lines = this._generatedDrawLines(xyPoints);
      }

      lines.forEach(function (points) {
        var lineType = getLineType(points[0], points[1]);

        switch (lineType) {
          case LineType.COMMON:
            {
              renderLine(ctx, function () {
                ctx.beginPath();
                ctx.moveTo(points[0].x, points[0].y);
                ctx.lineTo(points[1].x, points[1].y);
                ctx.stroke();
                ctx.closePath();
              });
              break;
            }

          case LineType.HORIZONTAL:
            {
              renderHorizontalLine(ctx, points[0].y, points[0].x, points[1].x);
              break;
            }

          case LineType.VERTICAL:
            {
              renderVerticalLine(ctx, points[0].x, points[0].y, points[1].y);
              break;
            }
        }
      });

      this._drawGraphicExtend(ctx, lines, graphicMark);
    }
  }]);

  return LineGraphicMark;
}(GraphicMark);

var OnePointLineGraphicMark = /*#__PURE__*/function (_LineGraphicMark) {
  _inherits(OnePointLineGraphicMark, _LineGraphicMark);

  var _super = _createSuper(OnePointLineGraphicMark);

  function OnePointLineGraphicMark() {
    _classCallCheck(this, OnePointLineGraphicMark);

    return _super.apply(this, arguments);
  }

  _createClass(OnePointLineGraphicMark, [{
    key: "mouseMoveForDrawing",

    /**
     * 绘制过程总鼠标移动事件
     * @param point
     */
    value: function mouseMoveForDrawing(point) {
      var dataIndex = this._xAxis.convertFromPixel(point.x);

      var timestamp = this._chartData.dataIndexToTimestamp(dataIndex);

      var price = this._yAxis.convertFromPixel(point.y);

      switch (this._drawStep) {
        case GraphicMarkDrawStep.STEP_1:
        case GraphicMarkDrawStep.STEP_2:
          {
            this._tpPoints = [{
              timestamp: timestamp,
              price: price,
              dataIndex: dataIndex
            }];
            break;
          }
      }
    }
    /**
     * 鼠标左边按钮点击事件
     */

  }, {
    key: "mouseLeftButtonDownForDrawing",
    value: function mouseLeftButtonDownForDrawing() {
      switch (this._drawStep) {
        case GraphicMarkDrawStep.STEP_1:
          {
            this._drawStep = GraphicMarkDrawStep.STEP_2;
            break;
          }

        case GraphicMarkDrawStep.STEP_2:
          {
            this._drawStep = GraphicMarkDrawStep.FINISHED;
            break;
          }
      }
    }
  }]);

  return OnePointLineGraphicMark;
}(LineGraphicMark);

var HorizontalStraightLine = /*#__PURE__*/function (_OnePointLineGraphicM) {
  _inherits(HorizontalStraightLine, _OnePointLineGraphicM);

  var _super = _createSuper(HorizontalStraightLine);

  function HorizontalStraightLine() {
    _classCallCheck(this, HorizontalStraightLine);

    return _super.apply(this, arguments);
  }

  _createClass(HorizontalStraightLine, [{
    key: "_checkMousePointOnLine",
    value: function _checkMousePointOnLine(point, xyPoints) {
      if (checkPointOnStraightLine(xyPoints[0], {
        x: this._xAxis.width(),
        y: xyPoints[0].y
      }, point)) {
        return {
          hoverType: HoverType.LINE,
          hoverIndex: 0
        };
      }
    }
  }, {
    key: "_generatedDrawLines",
    value: function _generatedDrawLines(xyPoints) {
      return [[{
        x: 0,
        y: xyPoints[0].y
      }, {
        x: this._xAxis.width(),
        y: xyPoints[0].y
      }]];
    }
  }]);

  return HorizontalStraightLine;
}(OnePointLineGraphicMark);

var TwoPointLineGraphicMark = /*#__PURE__*/function (_OnePointLineGraphicM) {
  _inherits(TwoPointLineGraphicMark, _OnePointLineGraphicM);

  var _super = _createSuper(TwoPointLineGraphicMark);

  function TwoPointLineGraphicMark() {
    _classCallCheck(this, TwoPointLineGraphicMark);

    return _super.apply(this, arguments);
  }

  _createClass(TwoPointLineGraphicMark, [{
    key: "mouseMoveForDrawing",
    value: function mouseMoveForDrawing(point) {
      var dataIndex = this._xAxis.convertFromPixel(point.x);

      var timestamp = this._chartData.dataIndexToTimestamp(dataIndex);

      var price = this._yAxis.convertFromPixel(point.y);

      switch (this._drawStep) {
        case GraphicMarkDrawStep.STEP_1:
          {
            this._tpPoints = [{
              timestamp: timestamp,
              price: price,
              dataIndex: dataIndex
            }];
            break;
          }

        case GraphicMarkDrawStep.STEP_2:
          {
            this._tpPoints[1] = {
              timestamp: timestamp,
              price: price,
              dataIndex: dataIndex
            };

            this._mouseMoveForDrawingExtendFuc({
              timestamp: timestamp,
              price: price,
              dataIndex: dataIndex
            });

            break;
          }
      }
    }
    /**
     * 鼠标左边按钮点击事件
     */

  }, {
    key: "mouseLeftButtonDownForDrawing",
    value: function mouseLeftButtonDownForDrawing() {
      switch (this._drawStep) {
        case GraphicMarkDrawStep.STEP_1:
          {
            this._drawStep = GraphicMarkDrawStep.STEP_2;
            break;
          }

        case GraphicMarkDrawStep.STEP_2:
          {
            this._drawStep = GraphicMarkDrawStep.FINISHED;
            break;
          }
      }
    }
  }, {
    key: "_mouseMoveForDrawingExtendFuc",
    value: function _mouseMoveForDrawingExtendFuc(_ref) {
      var timestamp = _ref.timestamp,
          price = _ref.price;
    }
  }]);

  return TwoPointLineGraphicMark;
}(OnePointLineGraphicMark);

var SegmentLine = /*#__PURE__*/function (_TwoPointLineGraphicM) {
  _inherits(SegmentLine, _TwoPointLineGraphicM);

  var _super = _createSuper(SegmentLine);

  function SegmentLine() {
    _classCallCheck(this, SegmentLine);

    return _super.apply(this, arguments);
  }

  _createClass(SegmentLine, [{
    key: "_checkMousePointOnLine",
    value: function _checkMousePointOnLine(point, xyPoints) {
      if (checkPointOnSegmentLine(xyPoints[0], xyPoints[1], point)) {
        return {
          hoverType: HoverType.LINE,
          hoverIndex: 0
        };
      }
    }
  }, {
    key: "_generatedDrawLines",
    value: function _generatedDrawLines(xyPoints) {
      if (xyPoints.length === 2) {
        return [xyPoints];
      }

      return [];
    }
  }]);

  return SegmentLine;
}(TwoPointLineGraphicMark);

var HorizontalSegmentLine = /*#__PURE__*/function (_SegmentLine) {
  _inherits(HorizontalSegmentLine, _SegmentLine);

  var _super = _createSuper(HorizontalSegmentLine);

  function HorizontalSegmentLine() {
    _classCallCheck(this, HorizontalSegmentLine);

    return _super.apply(this, arguments);
  }

  _createClass(HorizontalSegmentLine, [{
    key: "mousePressedMove",
    value: function mousePressedMove(point) {
      if (this._hoverType === HoverType.POINT && this._hoverIndex !== -1) {
        var dataIndex = this._xAxis.convertFromPixel(point.x);

        this._tpPoints[this._hoverIndex].timestamp = this._chartData.dataIndexToTimestamp(dataIndex);
        this._tpPoints[this._hoverIndex].dataIndex = dataIndex;

        var price = this._yAxis.convertFromPixel(point.y);

        this._tpPoints[0].price = price;
        this._tpPoints[1].price = price;
      }
    }
  }, {
    key: "_mouseMoveForDrawingExtendFuc",
    value: function _mouseMoveForDrawingExtendFuc(_ref) {
      var price = _ref.price;
      this._tpPoints[0].price = price;
    }
  }]);

  return HorizontalSegmentLine;
}(SegmentLine);

var RayLine = /*#__PURE__*/function (_TwoPointLineGraphicM) {
  _inherits(RayLine, _TwoPointLineGraphicM);

  var _super = _createSuper(RayLine);

  function RayLine() {
    _classCallCheck(this, RayLine);

    return _super.apply(this, arguments);
  }

  _createClass(RayLine, [{
    key: "_checkMousePointOnLine",
    value: function _checkMousePointOnLine(point, xyPoints) {
      if (checkPointOnRayLine(xyPoints[0], xyPoints[1], point)) {
        return {
          hoverType: HoverType.LINE,
          hoverIndex: 0
        };
      }
    }
  }, {
    key: "_generatedDrawLines",
    value: function _generatedDrawLines(xyPoints) {
      var point = {
        x: xyPoints[0].x,
        y: 0
      };

      if (xyPoints.length === 2) {
        if (xyPoints[0].x === xyPoints[1].x && xyPoints[0].y !== xyPoints[1].y) {
          if (xyPoints[0].y < xyPoints[1].y) {
            point = {
              x: xyPoints[0].x,
              y: this._yAxis.height()
            };
          } else {
            point = {
              x: xyPoints[0].x,
              y: 0
            };
          }
        } else if (xyPoints[0].x > xyPoints[1].x) {
          point = {
            x: 0,
            y: getLinearY(xyPoints[0], xyPoints[1], [{
              x: 0,
              y: xyPoints[0].y
            }])[0]
          };
        } else {
          point = {
            x: this._xAxis.width(),
            y: getLinearY(xyPoints[0], xyPoints[1], [{
              x: this._xAxis.width(),
              y: xyPoints[0].y
            }])[0]
          };
        }
      }

      return [[xyPoints[0], point]];
    }
  }]);

  return RayLine;
}(TwoPointLineGraphicMark);

var HorizontalRayLine = /*#__PURE__*/function (_RayLine) {
  _inherits(HorizontalRayLine, _RayLine);

  var _super = _createSuper(HorizontalRayLine);

  function HorizontalRayLine() {
    _classCallCheck(this, HorizontalRayLine);

    return _super.apply(this, arguments);
  }

  _createClass(HorizontalRayLine, [{
    key: "mousePressedMove",
    value: function mousePressedMove(point) {
      if (this._hoverType === HoverType.POINT && this._hoverIndex !== -1) {
        var dataIndex = this._xAxis.convertFromPixel(point.x);

        this._tpPoints[this._hoverIndex].timestamp = this._chartData.dataIndexToTimestamp(dataIndex);
        this._tpPoints[this._hoverIndex].dataIndex = dataIndex;

        var price = this._yAxis.convertFromPixel(point.y);

        this._tpPoints[0].price = price;
        this._tpPoints[1].price = price;
      }
    }
  }, {
    key: "_mouseMoveForDrawingExtendFuc",
    value: function _mouseMoveForDrawingExtendFuc(_ref) {
      var price = _ref.price;
      this._tpPoints[0].price = price;
    }
  }, {
    key: "_generatedDrawLines",
    value: function _generatedDrawLines(xyPoints) {
      var point = {
        x: 0,
        y: xyPoints[0].y
      };

      if (xyPoints[1] && xyPoints[0].x < xyPoints[1].x) {
        point.x = this._xAxis.width();
      }

      return [[xyPoints[0], point]];
    }
  }]);

  return HorizontalRayLine;
}(RayLine);

var VerticalStraightLine = /*#__PURE__*/function (_OnePointLineGraphicM) {
  _inherits(VerticalStraightLine, _OnePointLineGraphicM);

  var _super = _createSuper(VerticalStraightLine);

  function VerticalStraightLine() {
    _classCallCheck(this, VerticalStraightLine);

    return _super.apply(this, arguments);
  }

  _createClass(VerticalStraightLine, [{
    key: "_checkMousePointOnLine",
    value: function _checkMousePointOnLine(point, xyPoints) {
      if (checkPointOnStraightLine(xyPoints[0], {
        x: xyPoints[0].x,
        y: this._yAxis.height()
      }, point)) {
        return {
          hoverType: HoverType.LINE,
          hoverIndex: 0
        };
      }
    }
  }, {
    key: "_generatedDrawLines",
    value: function _generatedDrawLines(xyPoints) {
      return [[{
        x: xyPoints[0].x,
        y: 0
      }, {
        x: xyPoints[0].x,
        y: this._yAxis.height()
      }]];
    }
  }]);

  return VerticalStraightLine;
}(OnePointLineGraphicMark);

var VerticalSegmentLine = /*#__PURE__*/function (_SegmentLine) {
  _inherits(VerticalSegmentLine, _SegmentLine);

  var _super = _createSuper(VerticalSegmentLine);

  function VerticalSegmentLine() {
    _classCallCheck(this, VerticalSegmentLine);

    return _super.apply(this, arguments);
  }

  _createClass(VerticalSegmentLine, [{
    key: "mousePressedMove",
    value: function mousePressedMove(point) {
      if (this._hoverType === HoverType.POINT && this._hoverIndex !== -1) {
        var dataIndex = this._xAxis.convertFromPixel(point.x);

        var timestamp = this._chartData.dataIndexToTimestamp(dataIndex);

        this._tpPoints[0].timestamp = timestamp;
        this._tpPoints[0].dataIndex = dataIndex;
        this._tpPoints[1].timestamp = timestamp;
        this._tpPoints[1].dataIndex = dataIndex;
        this._tpPoints[this._hoverIndex].price = this._yAxis.convertFromPixel(point.y);
      }
    }
  }, {
    key: "_mouseMoveForDrawingExtendFuc",
    value: function _mouseMoveForDrawingExtendFuc(_ref) {
      var timestamp = _ref.timestamp,
          dataIndex = _ref.dataIndex;
      this._tpPoints[0].timestamp = timestamp;
      this._tpPoints[0].dataIndex = dataIndex;
    }
  }]);

  return VerticalSegmentLine;
}(SegmentLine);

var VerticalRayLine = /*#__PURE__*/function (_RayLine) {
  _inherits(VerticalRayLine, _RayLine);

  var _super = _createSuper(VerticalRayLine);

  function VerticalRayLine() {
    _classCallCheck(this, VerticalRayLine);

    return _super.apply(this, arguments);
  }

  _createClass(VerticalRayLine, [{
    key: "mousePressedMove",
    value: function mousePressedMove(point) {
      if (this._hoverType === HoverType.POINT && this._hoverIndex !== -1) {
        var dataIndex = this._xAxis.convertFromPixel(point.x);

        var timestamp = this._chartData.dataIndexToTimestamp(dataIndex);

        this._tpPoints[0].timestamp = timestamp;
        this._tpPoints[0].dataIndex = dataIndex;
        this._tpPoints[1].timestamp = timestamp;
        this._tpPoints[1].dataIndex = dataIndex;
        this._tpPoints[this._hoverIndex].price = this._yAxis.convertFromPixel(point.y);
      }
    }
  }, {
    key: "_mouseMoveForDrawingExtendFuc",
    value: function _mouseMoveForDrawingExtendFuc(_ref) {
      var timestamp = _ref.timestamp,
          dataIndex = _ref.dataIndex;
      this._tpPoints[0].timestamp = timestamp;
      this._tpPoints[0].dataIndex = dataIndex;
    }
  }, {
    key: "_generatedDrawLines",
    value: function _generatedDrawLines(xyPoints) {
      var point = {
        x: xyPoints[0].x,
        y: 0
      };

      if (xyPoints[1] && xyPoints[0].y < xyPoints[1].y) {
        point.y = this._yAxis.height();
      }

      return [[xyPoints[0], point]];
    }
  }]);

  return VerticalRayLine;
}(RayLine);

var StraightLine = /*#__PURE__*/function (_TwoPointLineGraphicM) {
  _inherits(StraightLine, _TwoPointLineGraphicM);

  var _super = _createSuper(StraightLine);

  function StraightLine() {
    _classCallCheck(this, StraightLine);

    return _super.apply(this, arguments);
  }

  _createClass(StraightLine, [{
    key: "_checkMousePointOnLine",
    value: function _checkMousePointOnLine(point, xyPoints) {
      if (checkPointOnStraightLine(xyPoints[0], xyPoints[1], point)) {
        return {
          hoverType: HoverType.LINE,
          hoverIndex: 0
        };
      }
    }
  }, {
    key: "_generatedDrawLines",
    value: function _generatedDrawLines(xyPoints) {
      if (xyPoints.length < 2 || xyPoints[0].x === xyPoints[1].x) {
        return [[{
          x: xyPoints[0].x,
          y: 0
        }, {
          x: xyPoints[0].x,
          y: this._yAxis.height()
        }]];
      }

      var y = getLinearY(xyPoints[0], xyPoints[1], [{
        x: 0,
        y: xyPoints[0].y
      }, {
        x: this._xAxis.width(),
        y: xyPoints[0].y
      }]);
      return [[{
        x: 0,
        y: y[0]
      }, {
        x: this._xAxis.width(),
        y: y[1]
      }]];
    }
  }]);

  return StraightLine;
}(TwoPointLineGraphicMark);

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
 * 创建字体
 * @param fontSize
 * @param fontFamily
 * @param fontWeight
 * @returns {string}
 */

function createFont() {
  var fontSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 12;
  var fontWeight = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'normal';
  var fontFamily = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'Helvetica Neue';
  return "".concat(fontWeight, " ").concat(fontSize, "px ").concat(fontFamily);
}

var PriceLine = /*#__PURE__*/function (_OnePointLineGraphicM) {
  _inherits(PriceLine, _OnePointLineGraphicM);

  var _super = _createSuper(PriceLine);

  function PriceLine() {
    _classCallCheck(this, PriceLine);

    return _super.apply(this, arguments);
  }

  _createClass(PriceLine, [{
    key: "_checkMousePointOnLine",
    value: function _checkMousePointOnLine(point, xyPoints) {
      if (checkPointOnRayLine(xyPoints[0], {
        x: this._xAxis.width(),
        y: xyPoints[0].y
      }, point)) {
        return {
          hoverType: HoverType.LINE,
          hoverIndex: 0
        };
      }
    }
  }, {
    key: "_generatedDrawLines",
    value: function _generatedDrawLines(xyPoints) {
      return [[xyPoints[0], {
        x: this._xAxis.width(),
        y: xyPoints[0].y
      }]];
    }
  }, {
    key: "_drawGraphicExtend",
    value: function _drawGraphicExtend(ctx, lines, graphicMark) {
      var pricePrecision = this._chartData.pricePrecision();

      var point = lines[0][0];

      var price = this._yAxis.convertFromPixel(point.y);

      var priceText = formatPrecision(price, pricePrecision);
      ctx.font = createFont(graphicMark.text.size, graphicMark.text.weight, graphicMark.text.family);
      ctx.fillStyle = graphicMark.text.color;
      ctx.fillText(priceText, point.x + graphicMark.text.marginLeft, point.y - graphicMark.text.marginBottom);
    }
  }]);

  return PriceLine;
}(OnePointLineGraphicMark);

var ThreePointLineGraphicMark = /*#__PURE__*/function (_LineGraphicMark) {
  _inherits(ThreePointLineGraphicMark, _LineGraphicMark);

  var _super = _createSuper(ThreePointLineGraphicMark);

  function ThreePointLineGraphicMark() {
    _classCallCheck(this, ThreePointLineGraphicMark);

    return _super.apply(this, arguments);
  }

  _createClass(ThreePointLineGraphicMark, [{
    key: "mouseMoveForDrawing",
    value: function mouseMoveForDrawing(point) {
      var dataIndex = this._xAxis.convertFromPixel(point.x);

      var timestamp = this._chartData.dataIndexToTimestamp(dataIndex);

      var price = this._yAxis.convertFromPixel(point.y);

      switch (this._drawStep) {
        case GraphicMarkDrawStep.STEP_1:
          {
            this._tpPoints = [{
              timestamp: timestamp,
              price: price,
              dataIndex: dataIndex
            }];
            break;
          }

        case GraphicMarkDrawStep.STEP_2:
          {
            this._tpPoints[1] = {
              timestamp: timestamp,
              price: price,
              dataIndex: dataIndex
            };
            break;
          }

        case GraphicMarkDrawStep.STEP_3:
          {
            this._tpPoints[2] = {
              timestamp: timestamp,
              price: price,
              dataIndex: dataIndex
            };
            break;
          }
      }
    }
  }, {
    key: "mouseLeftButtonDownForDrawing",
    value: function mouseLeftButtonDownForDrawing() {
      switch (this._drawStep) {
        case GraphicMarkDrawStep.STEP_1:
          {
            this._drawStep = GraphicMarkDrawStep.STEP_2;
            break;
          }

        case GraphicMarkDrawStep.STEP_2:
          {
            this._drawStep = GraphicMarkDrawStep.STEP_3;
            break;
          }

        case GraphicMarkDrawStep.STEP_3:
          {
            this._drawStep = GraphicMarkDrawStep.FINISHED;
            break;
          }
      }
    }
  }]);

  return ThreePointLineGraphicMark;
}(LineGraphicMark);

var ParallelStraightLine = /*#__PURE__*/function (_ThreePointLineGraphi) {
  _inherits(ParallelStraightLine, _ThreePointLineGraphi);

  var _super = _createSuper(ParallelStraightLine);

  function ParallelStraightLine() {
    _classCallCheck(this, ParallelStraightLine);

    return _super.apply(this, arguments);
  }

  _createClass(ParallelStraightLine, [{
    key: "_checkMousePointOnLine",
    value: function _checkMousePointOnLine(point, xyPoints) {
      var lines = this._generatedDrawLines(xyPoints);

      for (var i = 0; i < lines.length; i++) {
        var points = lines[i];

        if (checkPointOnStraightLine(points[0], points[1], point)) {
          return {
            hoverType: HoverType.LINE,
            hoverIndex: i
          };
        }
      }
    }
  }, {
    key: "_generatedDrawLines",
    value: function _generatedDrawLines(xyPoints) {
      return getParallelLines(xyPoints, {
        width: this._xAxis.width(),
        height: this._yAxis.height()
      });
    }
  }]);

  return ParallelStraightLine;
}(ThreePointLineGraphicMark);

var PriceChannelLine = /*#__PURE__*/function (_ParallelStraightLine) {
  _inherits(PriceChannelLine, _ParallelStraightLine);

  var _super = _createSuper(PriceChannelLine);

  function PriceChannelLine() {
    _classCallCheck(this, PriceChannelLine);

    return _super.apply(this, arguments);
  }

  _createClass(PriceChannelLine, [{
    key: "_generatedDrawLines",
    value: function _generatedDrawLines(xyPoints) {
      return getParallelLines(xyPoints, {
        width: this._xAxis.width(),
        height: this._yAxis.height()
      }, 1);
    }
  }]);

  return PriceChannelLine;
}(ParallelStraightLine);

var FibonacciLine = /*#__PURE__*/function (_TwoPointLineGraphicM) {
  _inherits(FibonacciLine, _TwoPointLineGraphicM);

  var _super = _createSuper(FibonacciLine);

  function FibonacciLine() {
    _classCallCheck(this, FibonacciLine);

    return _super.apply(this, arguments);
  }

  _createClass(FibonacciLine, [{
    key: "_checkMousePointOnLine",
    value: function _checkMousePointOnLine(point, xyPoints) {
      var lines = this._generatedDrawLines(xyPoints);

      for (var i = 0; i < lines.length; i++) {
        var points = lines[i];

        if (checkPointOnStraightLine(points[0], points[1], point)) {
          return {
            hoverType: HoverType.LINE,
            hoverIndex: i
          };
        }
      }
    }
  }, {
    key: "_generatedDrawLines",
    value: function _generatedDrawLines(xyPoints) {
      var lines = [];

      if (xyPoints.length > 0) {
        var startX = 0;

        var endX = this._xAxis.width();

        lines.push([{
          x: startX,
          y: xyPoints[0].y
        }, {
          x: endX,
          y: xyPoints[0].y
        }]);

        if (xyPoints.length > 1) {
          var yDistance = xyPoints[0].y - xyPoints[1].y;
          lines.push([{
            x: startX,
            y: xyPoints[1].y + yDistance * 0.786
          }, {
            x: endX,
            y: xyPoints[1].y + yDistance * 0.786
          }]);
          lines.push([{
            x: startX,
            y: xyPoints[1].y + yDistance * 0.618
          }, {
            x: endX,
            y: xyPoints[1].y + yDistance * 0.618
          }]);
          lines.push([{
            x: startX,
            y: xyPoints[1].y + yDistance * 0.5
          }, {
            x: endX,
            y: xyPoints[1].y + yDistance * 0.5
          }]);
          lines.push([{
            x: startX,
            y: xyPoints[1].y + yDistance * 0.382
          }, {
            x: endX,
            y: xyPoints[1].y + yDistance * 0.382
          }]);
          lines.push([{
            x: startX,
            y: xyPoints[1].y + yDistance * 0.236
          }, {
            x: endX,
            y: xyPoints[1].y + yDistance * 0.236
          }]);
          lines.push([{
            x: startX,
            y: xyPoints[1].y
          }, {
            x: endX,
            y: xyPoints[1].y
          }]);
        }
      }

      return lines;
    }
  }, {
    key: "_drawGraphicExtend",
    value: function _drawGraphicExtend(ctx, lines, graphicMark) {
      var _this = this;

      var pricePrecision = this._chartData.pricePrecision();

      ctx.font = createFont(graphicMark.text.size, graphicMark.text.weight, graphicMark.text.family);
      ctx.fillStyle = graphicMark.text.color;
      var percentTextArray = ['(100.0%)', '(78.6%)', '(61.8%)', '(50.0%)', '(38.2%)', '(23.6%)', '(0.0%)'];
      lines.forEach(function (points, index) {
        var point = points[0];

        var price = _this._yAxis.convertFromPixel(point.y);

        var priceText = "".concat(formatPrecision(price, pricePrecision), " ").concat(percentTextArray[index]);
        ctx.fillText(priceText, point.x + graphicMark.text.marginLeft, point.y - graphicMark.text.marginBottom);
      });
    }
  }]);

  return FibonacciLine;
}(TwoPointLineGraphicMark);

/**
 * 创建图形标记映射
 * @return {{}}
 */

function createGraphicMarkMapping() {
  var _ref;

  return _ref = {}, _defineProperty(_ref, HORIZONTAL_STRAIGHT_LINE, HorizontalStraightLine), _defineProperty(_ref, VERTICAL_STRAIGHT_LINE, VerticalStraightLine), _defineProperty(_ref, STRAIGHT_LINE, StraightLine), _defineProperty(_ref, HORIZONTAL_RAY_LINE, HorizontalRayLine), _defineProperty(_ref, VERTICAL_RAY_LINE, VerticalRayLine), _defineProperty(_ref, RAY_LINE, RayLine), _defineProperty(_ref, HORIZONTAL_SEGMENT_LINE, HorizontalSegmentLine), _defineProperty(_ref, VERTICAL_SEGMENT_LINE, VerticalSegmentLine), _defineProperty(_ref, SEGMENT_LINE, SegmentLine), _defineProperty(_ref, PRICE_LINE, PriceLine), _defineProperty(_ref, PRICE_CHANNEL_LINE, PriceChannelLine), _defineProperty(_ref, PARALLEL_STRAIGHT_LINE, ParallelStraightLine), _defineProperty(_ref, FIBONACCI_LINE, FibonacciLine), _ref;
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
 * 二分查找最接近的数
 * @param dataList
 * @param valueKey
 * @param targetNumber
 * @return {number}
 */
function binarySearchNearest(dataList, valueKey, targetNumber) {
  var left = 0;
  var right = 0;

  for (right = dataList.length - 1; left !== right;) {
    var midIndex = Math.floor((right + left) / 2);
    var mid = right - left;
    var midValue = dataList[midIndex][valueKey];

    if (targetNumber === midValue) {
      return midIndex;
    }

    if (targetNumber > midValue) {
      left = midIndex;
    } else {
      right = midIndex;
    }

    if (mid <= 2) {
      break;
    }
  }

  return left;
}

var InvalidateLevel = {
  NONE: 0,
  GRAPHIC_MARK: 1,
  FLOAT_LAYER: 2,
  MAIN: 3,
  FULL: 4
};
var DrawActionType = {
  DRAW_CANDLE: 'drawCandle',
  DRAW_TECHNICAL_INDICATOR: 'drawTechnicalIndicator'
};
var MAX_DATA_SPACE = 50;
var MIN_DATA_SPACE = 3;

var ChartData = /*#__PURE__*/function () {
  function ChartData(styleOptions, invalidateHandler) {
    var _this$_drawActionDele;

    _classCallCheck(this, ChartData);

    // 刷新持有者
    this._invalidateHandler = invalidateHandler; // 样式配置

    this._styleOptions = clone(defaultStyleOptions);
    merge(this._styleOptions, styleOptions); // 所有技术指标映射

    this._technicalIndicatorMapping = createTechnicalIndicatorMapping(); // 是否可以缩放

    this._zoomEnabled = true; // 是否可以拖拽滑动

    this._scrollEnabled = true; // 价格精度

    this._pricePrecision = 2; // 数量精度

    this._volumePrecision = 0;
    this._dateTimeFormat = new Intl.DateTimeFormat('en', {
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
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

    this._crosshair = {}; // 用来记录开始拖拽时向右偏移的数量

    this._preOffsetRightBarCount = 0; // 拖拽标记图形标记

    this._dragGraphicMarkFlag = false; // 图形标记映射

    this._graphicMarkMapping = createGraphicMarkMapping(); // 绘图标记数据

    this._graphicMarks = []; // 绘制事件代理

    this._drawActionDelegate = (_this$_drawActionDele = {}, _defineProperty(_this$_drawActionDele, DrawActionType.DRAW_CANDLE, new Delegate()), _defineProperty(_this$_drawActionDele, DrawActionType.DRAW_TECHNICAL_INDICATOR, new Delegate()), _this$_drawActionDele);
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
     * @param technicalIndicatorType
     * @returns {function(Array<string>, string, string): Promise}
     */

  }, {
    key: "technicalIndicatorCalcParams",
    value: function technicalIndicatorCalcParams(technicalIndicatorType) {
      var technical = this.technicalIndicator(technicalIndicatorType);

      if (technical) {
        return clone(technical.calcParams);
      }

      var calcParams = {};

      for (var name in this._technicalIndicatorMapping) {
        calcParams[name] = clone(this._technicalIndicatorMapping[name].calcParams);
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
      return this._technicalIndicatorMapping[technicalIndicatorType];
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
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
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
     * 加载价格和数量精度
     * @param pricePrecision
     * @param volumePrecision
     */

  }, {
    key: "applyPriceVolumePrecision",
    value: function applyPriceVolumePrecision(pricePrecision, volumePrecision) {
      this._pricePrecision = pricePrecision;
      this._volumePrecision = volumePrecision;

      for (var name in this._technicalIndicatorMapping) {
        var series = this._technicalIndicatorMapping[name].series;

        switch (series) {
          case TechnicalIndicatorSeries.PRICE:
            {
              this._technicalIndicatorMapping[name].setPrecision(pricePrecision);

              break;
            }

          case TechnicalIndicatorSeries.VOLUME:
            {
              this._technicalIndicatorMapping[name].setPrecision(volumePrecision);

              break;
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
        technicalIndicator.setPrecision(precision);
      } else {
        for (var name in this._technicalIndicatorMapping) {
          this._technicalIndicatorMapping[name].setPrecision(precision);
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
        this.invalidate();
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
      this._leftMinVisibleBarCount = barCount;
    }
    /**
     * 设置右边可见的最小bar数量
     * @param barCount
     */

  }, {
    key: "setRightMinVisibleBarCount",
    value: function setRightMinVisibleBarCount(barCount) {
      this._rightMinVisibleBarCount = barCount;
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
    key: "crosshair",
    value: function crosshair() {
      return this._crosshair;
    }
    /**
     * 设置十字光标点所在的pane的标识
     * @param point
     * @param paneTag
     */

  }, {
    key: "setCrosshairPointPaneTag",
    value: function setCrosshairPointPaneTag(point, paneTag) {
      var crosshair = {};

      if (point) {
        crosshair.x = point.x;
        crosshair.y = point.y;
        crosshair.paneTag = this._crosshair.paneTag;
      }

      if (paneTag !== undefined) {
        crosshair.paneTag = paneTag;
        this._crosshair = crosshair;
        this.invalidate(InvalidateLevel.FLOAT_LAYER);
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
      if (!this._scrollEnabled) {
        return;
      }

      var distanceBarCount = distance / this._dataSpace;
      this._offsetRightBarCount = this._preOffsetRightBarCount - distanceBarCount;
      this.adjustOffsetBarCount();
      this.invalidate();
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
     * 数据索引转换成时间戳
     * @param dataIndex
     * @return {*}
     */

  }, {
    key: "dataIndexToTimestamp",
    value: function dataIndexToTimestamp(dataIndex) {
      var data = this._dataList[dataIndex];

      if (data) {
        return data.timestamp;
      }
    }
    /**
     * 将时间戳转换成数据索引位置
     * @param timestamp
     * @return {number}
     */

  }, {
    key: "timestampToDataIndex",
    value: function timestampToDataIndex(timestamp) {
      if (this._dataList.length === 0) {
        return 0;
      }

      return binarySearchNearest(this._dataList, 'timestamp', timestamp);
    }
    /**
     * 缩放
     * @param scale
     * @param point
     */

  }, {
    key: "zoom",
    value: function zoom(scale, point) {
      if (!this._zoomEnabled) {
        return;
      }

      if (!point || isValid(point.x)) {
        point = {
          x: isValid(this._crosshair.x) ? this._crosshair.x : this._totalDataSpace / 2
        };
      }

      var floatIndexAtZoomPoint = this.coordinateToFloatIndex(point.x);
      var dataSpace = this._dataSpace + scale * (this._dataSpace / 10);

      if (this._innerSetDataSpace(dataSpace)) {
        this._offsetRightBarCount += floatIndexAtZoomPoint - this.coordinateToFloatIndex(point.x);
        this.adjustOffsetBarCount();
        this.invalidate();
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
     * 刷新
     * @param invalidateLevel
     */

  }, {
    key: "invalidate",
    value: function invalidate(invalidateLevel) {
      this._invalidateHandler(invalidateLevel);
    }
    /**
     * 设置是否可以缩放
     * @param enabled
     */

  }, {
    key: "setZoomEnabled",
    value: function setZoomEnabled(enabled) {
      this._zoomEnabled = enabled;
    }
    /**
     * 获取是否可以缩放
     * @return {boolean}
     */

  }, {
    key: "zoomEnabled",
    value: function zoomEnabled() {
      return this._zoomEnabled;
    }
    /**
     * 设置是否可以拖拽滚动
     * @param enabled
     */

  }, {
    key: "setScrollEnabled",
    value: function setScrollEnabled(enabled) {
      this._scrollEnabled = enabled;
    }
    /**
     * 获取是否可以拖拽滚动
     * @return {boolean}
     */

  }, {
    key: "scrollEnabled",
    value: function scrollEnabled() {
      return this._scrollEnabled;
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
     * 清空图形标记
     */

  }, {
    key: "clearGraphicMark",
    value: function clearGraphicMark() {
      if (this._graphicMarks.length > 0) {
        this._graphicMarks = [];
        this.invalidate(InvalidateLevel.GRAPHIC_MARK);
      }
    }
    /**
     * 添加标记类型
     * @param graphicMark
     */

  }, {
    key: "addGraphicMark",
    value: function addGraphicMark(graphicMark) {
      var lastGraphicMark = this._graphicMarks.last();

      if (lastGraphicMark && lastGraphicMark.isDrawing()) {
        this._graphicMarks[this._graphicMarks.length - 1] = graphicMark;
      } else {
        this._graphicMarks.push(graphicMark);
      }

      this.invalidate(InvalidateLevel.GRAPHIC_MARK);
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
     * 获取图形标记映射
     * @returns {{}}
     */

  }, {
    key: "graphicMarkMapping",
    value: function graphicMarkMapping() {
      return this._graphicMarkMapping;
    }
    /**
     * 获取图形标记的数据
     * @returns {{}}
     */

  }, {
    key: "graphicMarks",
    value: function graphicMarks() {
      return this._graphicMarks;
    }
    /**
     * 是否需要刷新图形标记层
     * @returns {boolean}
     */

  }, {
    key: "shouldInvalidateGraphicMark",
    value: function shouldInvalidateGraphicMark() {
      return this._graphicMarks.length > 0;
    }
    /**
     * 添加一个自定义指标
     * @param technicalIndicatorInfo
     */

  }, {
    key: "addCustomTechnicalIndicator",
    value: function addCustomTechnicalIndicator(technicalIndicatorInfo) {
      var technicalIndicator = createNewTechnicalIndicator(technicalIndicatorInfo || {});

      if (technicalIndicator) {
        // 将生成的新的指标类放入集合
        this._technicalIndicatorMapping[technicalIndicatorInfo.name] = technicalIndicator;
      }
    }
    /**
     * 获取绘制事件代理
     * @param type
     * @returns {Delegate}
     */

  }, {
    key: "drawActionDelegate",
    value: function drawActionDelegate(type) {
      return this._drawActionDelegate[type];
    }
  }]);

  return ChartData;
}();

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
    /**
     * 将canvas转换成图片
     * @param includeFloatLayer
     * @param includeGraphicMark
     * @return {HTMLCanvasElement}
     */

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
    this._crosshairView = this._createCrosshairView(this._element, props);
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
    key: "_createCrosshairView",
    value: function _createCrosshairView(container, props) {}
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

      this._crosshairView.setWidth(width);

      this._expandView && this._expandView.setWidth(width);
    }
  }, {
    key: "setHeight",
    value: function setHeight(height) {
      this._height = height;

      this._mainView.setHeight(height);

      this._crosshairView.setHeight(height);

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

      this._crosshairView.layout();

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
            this._crosshairView.flush();

            break;
          }

        case InvalidateLevel.MAIN:
        case InvalidateLevel.FULL:
          {
            this._mainView.flush();

            this._crosshairView.flush();

            this._expandView && this._expandView.flush();
            break;
          }
      }
    }
    /**
     * 将widget转换成图片
     * @param includeCrosshair
     * @param includeGraphicMark
     * @returns {HTMLCanvasElement}
     */

  }, {
    key: "getImage",
    value: function getImage(includeCrosshair, includeGraphicMark) {
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

      if (includeCrosshair) {
        ctx.drawImage(this._crosshairView.getImage(), 0, 0, this._width, this._height);
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

      this._drawTechnicalIndicators();
    }
    /**
     * 绘制网格
     * @private
     */

  }, {
    key: "_drawGrid",
    value: function _drawGrid() {
      var _this2 = this;

      var gridOptions = this._chartData.styleOptions().grid;

      if (!gridOptions.show) {
        return;
      }

      var gridHorizontalOptions = gridOptions.horizontal;

      this._ctx.save();

      if (gridHorizontalOptions.show) {
        this._ctx.strokeStyle = gridHorizontalOptions.color;
        this._ctx.lineWidth = gridHorizontalOptions.size;

        if (gridHorizontalOptions.style === LineStyle.DASH) {
          this._ctx.setLineDash(gridHorizontalOptions.dashValue);
        }

        this._yAxis.ticks().forEach(function (tick) {
          renderHorizontalLine(_this2._ctx, tick.y, 0, _this2._width);
        });
      }

      var gridVerticalOptions = gridOptions.vertical;

      if (gridVerticalOptions.show) {
        this._ctx.strokeStyle = gridVerticalOptions.color;
        this._ctx.lineWidth = gridVerticalOptions.size;

        if (gridVerticalOptions.style === LineStyle.DASH) {
          this._ctx.setLineDash(gridVerticalOptions.dashValue);
        } else {
          this._ctx.setLineDash([]);
        }

        this._xAxis.ticks().forEach(function (tick) {
          renderVerticalLine(_this2._ctx, tick.x, 0, _this2._height);
        });
      }

      this._ctx.restore();
    }
    /**
     * 绘制指标
     * @private
     */

  }, {
    key: "_drawTechnicalIndicators",
    value: function _drawTechnicalIndicators() {
      var _this3 = this;

      var technicalIndicators = this._additionalDataProvider.technicalIndicators();

      technicalIndicators.forEach(function (technicalIndicator) {
        var plots = technicalIndicator.plots;
        var lines = [];

        var technicalIndicatorOptions = _this3._chartData.styleOptions().technicalIndicator;

        var dataList = _this3._chartData.dataList();

        var technicalIndicatorResult = technicalIndicator.result; // 技术指标自定义绘制

        if (technicalIndicator.render) {
          _this3._ctx.save();

          technicalIndicator.render(_this3._ctx, {
            from: _this3._chartData.from(),
            to: _this3._chartData.to(),
            kLineDataList: _this3._chartData.dataList(),
            technicalIndicatorDataList: technicalIndicatorResult
          }, {
            width: _this3._width,
            height: _this3._height,
            dataSpace: _this3._chartData.dataSpace(),
            barSpace: _this3._chartData.barSpace()
          }, _this3._chartData.styleOptions(), _this3._xAxis, _this3._yAxis, _this3._yAxis.isCandleYAxis());

          _this3._ctx.restore();
        }

        var baseValue = technicalIndicator.baseValue;

        if (!isValid(baseValue)) {
          baseValue = _this3._yAxis.min();
        }

        var baseValueY = _this3._yAxis.convertToPixel(baseValue);

        var isCandleYAxis = _this3._yAxis.isCandleYAxis();

        _this3._ctx.lineWidth = 1;

        _this3._drawGraphics(function (x, i, kLineData, halfBarSpace, barSpace) {
          var technicalIndicatorData = technicalIndicatorResult[i] || {};
          var lineValueIndex = 0;

          if (technicalIndicator.shouldOhlc && !isCandleYAxis) {
            _this3._drawCandleBar(x, halfBarSpace, barSpace, i, kLineData, technicalIndicatorOptions.bar, CandleType.OHLC);
          }

          var coordinateY = {};
          plots.forEach(function (plot) {
            var value = technicalIndicatorData[plot.key];

            var valueY = _this3._yAxis.convertToPixel(value);

            coordinateY[plot.key] = valueY;

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
                    var height = Math.abs(baseValueY - valueY);
                    var bar = {
                      x: x - halfBarSpace,
                      width: halfBarSpace * 2,
                      height: Math.max(1, height)
                    };

                    if (valueY <= baseValueY) {
                      bar.y = height < 1 ? baseValueY + 1 : valueY;
                    } else {
                      bar.y = baseValueY;
                    }

                    bar.color = plot.color && plot.color(_cbData, technicalIndicatorOptions) || technicalIndicatorOptions.bar.noChangeColor;
                    bar.isStroke = plot.isStroke ? plot.isStroke(_cbData) : false;

                    _this3._drawBar(bar);
                  }

                  break;
                }

              case PlotType.LINE:
                {
                  if (isValid(value)) {
                    var line = {
                      x: x,
                      y: valueY
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

            _this3._drawActionExecute(DrawActionType.DRAW_TECHNICAL_INDICATOR, {
              ctx: _this3._ctx,
              kLineData: kLineData,
              dataIndex: i,
              technicalIndicatorData: technicalIndicatorData,
              technicalIndicatorType: technicalIndicator.name,
              coordinate: _objectSpread2({
                x: x
              }, coordinateY),
              viewport: {
                width: _this3._width,
                height: _this3._height
              },
              barSpace: barSpace,
              halfBarSpace: halfBarSpace,
              isCandle: isCandleYAxis
            });
          });
        }, function () {
          _this3._drawLines(lines, technicalIndicatorOptions);
        });
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
      renderLine(this._ctx, function () {
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
        onDrawing(x, i, dataList[i], halfBarSpace, barSpace);
      }

      onDrawEnd && onDrawEnd();
    }
    /**
     * 绘制蜡烛柱
     * @param x
     * @param halfBarSpace
     * @param barSpace
     * @param dataIndex
     * @param kLineData
     * @param barOptions
     * @param barStyle
     * @private
     */

  }, {
    key: "_drawCandleBar",
    value: function _drawCandleBar(x, halfBarSpace, barSpace, dataIndex, kLineData, barOptions, barStyle) {
      var open = kLineData.open,
          close = kLineData.close,
          high = kLineData.high,
          low = kLineData.low;

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
        case CandleType.CANDLE_SOLID:
          {
            this._ctx.fillRect(x - halfBarSpace, highEndY, barSpace, barHeight);

            break;
          }

        case CandleType.CANDLE_STROKE:
          {
            this._ctx.strokeRect(x - halfBarSpace + 0.5, highEndY, barSpace - 1, barHeight);

            break;
          }

        case CandleType.CANDLE_UP_STROKE:
          {
            if (close > open) {
              this._ctx.strokeRect(x - halfBarSpace + 0.5, highEndY, barSpace - 1, barHeight);
            } else {
              this._ctx.fillRect(x - halfBarSpace, highEndY, barSpace, barHeight);
            }

            break;
          }

        case CandleType.CANDLE_DOWN_STROKE:
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

      this._drawActionExecute(DrawActionType.DRAW_CANDLE, {
        ctx: this._ctx,
        dataIndex: dataIndex,
        kLineData: kLineData,
        coordinate: {
          x: x,
          open: openY,
          close: closeY,
          high: highY,
          low: lowY
        },
        viewport: {
          width: this._width,
          height: this._height
        },
        barSpace: barSpace,
        halfBarSpace: halfBarSpace,
        isCandle: this._yAxis.isCandleYAxis()
      });
    }
    /**
     * 执行绘制事件监听
     * @param type
     * @param data
     * @private
     */

  }, {
    key: "_drawActionExecute",
    value: function _drawActionExecute(type, data) {
      // 绘制事件监听
      var delegate = this._chartData.drawActionDelegate(type);

      if (delegate.hasObservers()) {
        this._ctx.save();

        delegate.execute(data);

        this._ctx.restore();
      }
    }
  }]);

  return TechnicalIndicatorView;
}(View);

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
 * 绘制文字
 * @param ctx
 * @param color
 * @param x
 * @param y
 * @param text
 */
function renderText(ctx, color, x, y, text) {
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

var TechnicalIndicatorCrosshairView = /*#__PURE__*/function (_View) {
  _inherits(TechnicalIndicatorCrosshairView, _View);

  var _super = _createSuper(TechnicalIndicatorCrosshairView);

  function TechnicalIndicatorCrosshairView(container, chartData, xAxis, yAxis, additionalDataProvider) {
    var _this;

    _classCallCheck(this, TechnicalIndicatorCrosshairView);

    _this = _super.call(this, container, chartData);
    _this._xAxis = xAxis;
    _this._yAxis = yAxis;
    _this._additionalDataProvider = additionalDataProvider;
    return _this;
  }

  _createClass(TechnicalIndicatorCrosshairView, [{
    key: "_draw",
    value: function _draw() {
      var crosshair = this._chartData.crosshair();

      var dataList = this._chartData.dataList();

      var realDataPos;
      var dataPos;

      if (isValid(crosshair.x)) {
        realDataPos = this._xAxis.convertFromPixel(crosshair.x);

        if (realDataPos < 0) {
          dataPos = 0;
        } else if (realDataPos > dataList.length - 1) {
          dataPos = dataList.length - 1;
        } else {
          dataPos = realDataPos;
        }
      } else {
        realDataPos = dataList.length - 1;
        dataPos = realDataPos;
      }

      var kLineData = dataList[dataPos];

      if (kLineData) {
        var technicalIndicators = this._additionalDataProvider.technicalIndicators();

        var styleOptions = this._chartData.styleOptions();

        var crosshairOptions = styleOptions.crosshair;

        var realDataPosX = this._xAxis.convertToPixel(realDataPos);

        if (crosshair.paneTag === this._additionalDataProvider.tag()) {
          // 绘制十字光标水平线
          this._drawCrosshairLine(crosshairOptions, 'horizontal', crosshair.y, 0, this._width, renderHorizontalLine);
        }

        if (crosshair.paneTag) {
          // 绘制十字光标垂直线
          this._drawCrosshairLine(crosshairOptions, 'vertical', realDataPosX, 0, this._height, renderVerticalLine);
        }

        this._drawTooltip(crosshair, kLineData, dataPos, realDataPosX, technicalIndicators);
      }
    }
    /**
     * 绘制图例
     * @param crosshair
     * @param kLineData
     * @param dataPos
     * @param realDataPosX
     * @param technicalIndicators
     * @private
     */

  }, {
    key: "_drawTooltip",
    value: function _drawTooltip(crosshair, kLineData, dataPos, realDataPosX, technicalIndicators) {
      this._drawBatchTechnicalIndicatorToolTip(crosshair, dataPos, technicalIndicators);
    }
    /**
     * 绘制十字光标线
     * @param crosshairOptions
     * @param optionsKey
     * @param fixedCoordinate
     * @param startCoordinate
     * @param endCoordinate
     * @param drawLine
     * @private
     */

  }, {
    key: "_drawCrosshairLine",
    value: function _drawCrosshairLine(crosshairOptions, optionsKey, fixedCoordinate, startCoordinate, endCoordinate, drawLine) {
      var crosshairDirectionOptions = crosshairOptions[optionsKey];
      var crosshairLineOptions = crosshairDirectionOptions.line;

      if (!crosshairOptions.show || !crosshairDirectionOptions.show || !crosshairLineOptions.show) {
        return;
      }

      this._ctx.save();

      this._ctx.lineWidth = crosshairLineOptions.size;
      this._ctx.strokeStyle = crosshairLineOptions.color;

      if (crosshairLineOptions.style === LineStyle.DASH) {
        this._ctx.setLineDash(crosshairLineOptions.dashValue);
      }

      drawLine(this._ctx, fixedCoordinate, startCoordinate, endCoordinate);

      this._ctx.restore();
    }
    /**
     * 批量绘制技术指标提示
     * @param crosshair
     * @param dataPos
     * @param technicalIndicators
     * @param offsetTop
     * @private
     */

  }, {
    key: "_drawBatchTechnicalIndicatorToolTip",
    value: function _drawBatchTechnicalIndicatorToolTip(crosshair, dataPos, technicalIndicators) {
      var _this2 = this;

      var offsetTop = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

      var technicalIndicatorOptions = this._chartData.styleOptions().technicalIndicator;

      var technicalIndicatorTooltipOptions = technicalIndicatorOptions.tooltip;
      var top = offsetTop;
      technicalIndicators.forEach(function (technicalIndicator) {
        _this2._drawTechnicalIndicatorTooltip(crosshair, dataPos, technicalIndicator, technicalIndicatorOptions, top);

        top += technicalIndicatorTooltipOptions.text.marginTop + technicalIndicatorTooltipOptions.text.size + technicalIndicatorTooltipOptions.text.marginBottom;
      });
    }
    /**
     * 绘制指标图例
     * @param crosshair
     * @param dataPos
     * @param technicalIndicator
     * @param technicalIndicatorOptions
     * @param offsetTop
     * @private
     */

  }, {
    key: "_drawTechnicalIndicatorTooltip",
    value: function _drawTechnicalIndicatorTooltip(crosshair, dataPos, technicalIndicator, technicalIndicatorOptions) {
      var offsetTop = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
      var technicalIndicatorTooltipOptions = technicalIndicatorOptions.tooltip;

      if (this._shouldDrawTooltip(crosshair, technicalIndicatorTooltipOptions)) {
        var technicalIndicatorResult = technicalIndicator.result;
        var technicalIndicatorData = technicalIndicatorResult[dataPos];
        var tooltipData = getTechnicalIndicatorTooltipData(technicalIndicatorData, technicalIndicator, this._yAxis);
        var colors = technicalIndicatorOptions.line.colors;

        var dataList = this._chartData.dataList();

        var cbData = {
          preData: {
            kLineData: dataList[dataPos - 1],
            technicalIndicatorData: technicalIndicatorResult[dataPos - 1]
          },
          currentData: {
            kLineData: dataList[dataPos],
            technicalIndicatorData: technicalIndicatorData
          }
        };
        var plots = technicalIndicator.plots;
        var technicalIndicatorTooltipTextOptions = technicalIndicatorTooltipOptions.text;
        var labels = tooltipData.labels;
        var values = tooltipData.values;
        var textMarginLeft = technicalIndicatorTooltipTextOptions.marginLeft;
        var textMarginRight = technicalIndicatorTooltipTextOptions.marginRight;
        var labelX = 0;
        var labelY = technicalIndicatorTooltipTextOptions.marginTop + offsetTop;
        var textSize = technicalIndicatorTooltipTextOptions.size;
        var textColor = technicalIndicatorTooltipTextOptions.color;
        var colorSize = colors.length;
        this._ctx.textBaseline = 'top';
        this._ctx.font = createFont(textSize, technicalIndicatorTooltipTextOptions.weight, technicalIndicatorTooltipTextOptions.family);

        if (technicalIndicatorTooltipOptions.showName) {
          var nameText = tooltipData.name;
          var nameTextWidth = calcTextWidth(this._ctx, nameText);
          labelX += textMarginLeft;
          renderText(this._ctx, textColor, labelX, labelY, nameText);
          labelX += nameTextWidth;

          if (!technicalIndicatorTooltipOptions.showParams) {
            labelX += textMarginRight;
          }
        }

        if (technicalIndicatorTooltipOptions.showParams) {
          var calcParamText = tooltipData.calcParamText;
          var calcParamTextWidth = calcTextWidth(this._ctx, calcParamText);

          if (!technicalIndicatorTooltipOptions.showName) {
            labelX += textMarginLeft;
          }

          renderText(this._ctx, textColor, labelX, labelY, calcParamText);
          labelX += calcParamTextWidth + textMarginRight;
        }

        var lineCount = 0;
        var valueColor;

        for (var i = 0; i < labels.length; i++) {
          switch (plots[i].type) {
            case PlotType.CIRCLE:
              {
                valueColor = plots[i].color && plots[i].color(cbData, technicalIndicatorOptions) || technicalIndicatorOptions.circle.noChangeColor;
                break;
              }

            case PlotType.BAR:
              {
                valueColor = plots[i].color && plots[i].color(cbData, technicalIndicatorOptions) || technicalIndicatorOptions.bar.noChangeColor;
                break;
              }

            case PlotType.LINE:
              {
                valueColor = colors[lineCount % colorSize] || textColor;
                lineCount++;
                break;
              }
          }

          labelX += textMarginLeft;
          var text = "".concat(labels[i], ": ").concat(values[i].value || 'n/a');
          var textWidth = calcTextWidth(this._ctx, text);
          renderText(this._ctx, valueColor, labelX, labelY, text);
          labelX += textWidth + textMarginRight;
        }
      }
    }
    /**
     * 是否需要绘制图例
     * @param crosshair
     * @param tooltipOptions
     * @return {boolean|boolean|*}
     * @private
     */

  }, {
    key: "_shouldDrawTooltip",
    value: function _shouldDrawTooltip(crosshair, tooltipOptions) {
      var showRule = tooltipOptions.showRule;
      return showRule === TooltipShowRule.ALWAYS || showRule === TooltipShowRule.FOLLOW_CROSS && crosshair.paneTag;
    }
  }]);

  return TechnicalIndicatorCrosshairView;
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
    key: "_createCrosshairView",
    value: function _createCrosshairView(container, props) {
      return new TechnicalIndicatorCrosshairView(container, props.chartData, props.xAxis, props.yAxis, props.additionalDataProvider);
    }
  }]);

  return TechnicalIndicatorWidget;
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

/**
 * 绘制带边框并填充的矩形
 * @param ctx
 * @param fillColor
 * @param borderColor
 * @param borderSize
 * @param x
 * @param y
 * @param width
 * @param height
 */
function renderStrokeFillRect(ctx, fillColor, borderColor, borderSize, x, y, width, height) {
  renderFillRect(ctx, fillColor, x, y, width, height);
  renderStrokeRect(ctx, borderColor, borderSize, x, y, width, height);
}
/**
 * 绘制空心矩形
 * @param ctx
 * @param borderColor
 * @param borderSize
 * @param x
 * @param y
 * @param width
 * @param height
 */

function renderStrokeRect(ctx, borderColor, borderSize, x, y, width, height) {
  ctx.lineWidth = borderSize;
  ctx.strokeStyle = borderColor;
  ctx.strokeRect(x, y, width, height);
}
/**
 * 绘制填充的矩形
 * @param ctx
 * @param color
 * @param x
 * @param y
 * @param width
 * @param height
 */

function renderFillRect(ctx, color, x, y, width, height) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}
/**
 * 绘制圆角空心矩形
 * @param ctx
 * @param borderColor
 * @param borderSize
 * @param x
 * @param y
 * @param w
 * @param h
 * @param r
 */

function renderStrokeRoundRect(ctx, borderColor, borderSize, x, y, w, h, r) {
  ctx.lineWidth = borderSize;
  ctx.strokeStyle = borderColor;
  renderRoundRect(ctx, x, y, w, h, r);
  ctx.stroke();
}
/**
 * 绘制填充圆角矩形
 * @param ctx
 * @param color
 * @param x
 * @param y
 * @param w
 * @param h
 * @param r
 */

function renderFillRoundRect(ctx, color, x, y, w, h, r) {
  ctx.fillStyle = color;
  renderRoundRect(ctx, x, y, w, h, r);
  ctx.fill();
}
/**
 * 绘制圆角矩形
 * @param ctx
 * @param x
 * @param y
 * @param w
 * @param h
 * @param r
 */

function renderRoundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

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

      if (yAxisOptions.show) {
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

      if (!axisLine.show) {
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

      renderVerticalLine(this._ctx, x, 0, this._height);
    }
  }, {
    key: "_drawTickLines",
    value: function _drawTickLines(yAxisOptions) {
      var _this2 = this;

      var tickLine = yAxisOptions.tickLine;

      if (!tickLine.show) {
        return;
      }

      this._ctx.lineWidth = tickLine.size;
      this._ctx.strokeStyle = tickLine.color;
      var tickLineLength = tickLine.length;
      var startX;
      var endX;

      if (this._isDrawFromStart(yAxisOptions)) {
        startX = 0;

        if (yAxisOptions.axisLine.show) {
          startX += yAxisOptions.axisLine.size;
        }

        endX = startX + tickLineLength;
      } else {
        startX = this._width;

        if (yAxisOptions.axisLine.show) {
          startX -= yAxisOptions.axisLine.size;
        }

        endX = startX - tickLineLength;
      }

      this._yAxis.ticks().forEach(function (tick) {
        renderHorizontalLine(_this2._ctx, tick.y, startX, endX);
      });
    }
  }, {
    key: "_drawTickLabels",
    value: function _drawTickLabels(yAxisOptions) {
      var _this3 = this;

      var tickText = yAxisOptions.tickText;

      if (!tickText.show) {
        return;
      }

      var tickLine = yAxisOptions.tickLine;
      var tickLineShow = tickLine.show;
      var tickLineLength = tickLine.length;
      var labelX;

      if (this._isDrawFromStart(yAxisOptions)) {
        labelX = tickText.paddingLeft;

        if (yAxisOptions.axisLine.show) {
          labelX += yAxisOptions.axisLine.size;
        }

        if (tickLineShow) {
          labelX += tickLineLength;
        }

        this._ctx.textAlign = 'left';
      } else {
        labelX = this._width - tickText.paddingRight;

        if (yAxisOptions.axisLine.show) {
          labelX -= yAxisOptions.axisLine.size;
        }

        if (tickLineShow) {
          labelX -= tickLineLength;
        }

        this._ctx.textAlign = 'right';
      }

      this._ctx.textBaseline = 'middle';
      this._ctx.font = createFont(tickText.size, tickText.weight, tickText.family);
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

      var technicalIndicatorOptions = this._chartData.styleOptions().technicalIndicator;

      var lastValueMarkOptions = technicalIndicatorOptions.lastValueMark;

      var technicalIndicators = this._additionalDataProvider.technicalIndicators();

      if (!lastValueMarkOptions.show || !lastValueMarkOptions.text.show) {
        return;
      }

      var dataList = this._chartData.dataList();

      technicalIndicators.forEach(function (technicalIndicator) {
        var technicalIndicatorResult = technicalIndicator.result || [];
        var dataSize = technicalIndicatorResult.length;
        var technicalIndicatorData = technicalIndicatorResult[dataSize - 1] || {};
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
        var colors = technicalIndicatorOptions.line.colors || [];
        var colorSize = colors.length;
        var lineCount = 0;
        plots.forEach(function (plot) {
          var value = technicalIndicatorData[plot.key];
          var backgroundColor;

          switch (plot.type) {
            case PlotType.CIRCLE:
              {
                backgroundColor = plot.color && plot.color(cbData, technicalIndicatorOptions) || technicalIndicatorOptions.circle.noChangeColor;
                break;
              }

            case PlotType.BAR:
              {
                backgroundColor = plot.color && plot.color(cbData, technicalIndicatorOptions) || technicalIndicatorOptions.bar.noChangeColor;
                break;
              }

            default:
              {
                backgroundColor = colors[lineCount % colorSize];
                lineCount++;
              }
          }

          if (isValid(value)) {
            _this4._drawMarkLabel(yAxisOptions, value, precision, technicalIndicator.shouldFormatBigNumber, _objectSpread2(_objectSpread2({}, lastValueMarkOptions.text), {}, {
              backgroundColor: backgroundColor
            }));
          }
        });
      });
    }
    /**
     * 绘制最新价文字
     * @private
     */

  }, {
    key: "_drawLastPriceLabel",
    value: function _drawLastPriceLabel(yAxisOptions) {
      if (!this._yAxis.isCandleYAxis()) {
        return;
      }

      var priceMarkOptions = this._chartData.styleOptions().candle.priceMark;

      var lastPriceMarkOptions = priceMarkOptions.last;

      if (!priceMarkOptions.show || !lastPriceMarkOptions.show || !lastPriceMarkOptions.text.show) {
        return;
      }

      var dataList = this._chartData.dataList();

      var kLineData = dataList.last();

      if (!kLineData) {
        return;
      }

      var close = kLineData.close;
      var open = kLineData.open;
      var backgroundColor;

      if (close > open) {
        backgroundColor = lastPriceMarkOptions.upColor;
      } else if (close < open) {
        backgroundColor = lastPriceMarkOptions.downColor;
      } else {
        backgroundColor = lastPriceMarkOptions.noChangeColor;
      }

      this._drawMarkLabel(yAxisOptions, close, this._chartData.pricePrecision(), false, _objectSpread2(_objectSpread2({}, lastPriceMarkOptions.text), {}, {
        backgroundColor: backgroundColor
      }));
    }
    /**
     * 绘制标记label
     * @param yAxisOptions
     * @param value
     * @param precision
     * @param shouldFormatBigNumber
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
    value: function _drawMarkLabel(yAxisOptions, value, precision, shouldFormatBigNumber, _ref) {
      var textSize = _ref.textSize,
          textWeight = _ref.textWeight,
          textFamily = _ref.textFamily,
          textColor = _ref.textColor,
          backgroundColor = _ref.backgroundColor,
          textPaddingLeft = _ref.textPaddingLeft,
          textPaddingTop = _ref.textPaddingTop,
          textPaddingRight = _ref.textPaddingRight,
          textPaddingBottom = _ref.textPaddingBottom;

      var valueY = this._yAxis.convertToPixel(value);

      valueY = +Math.max(this._height * 0.05, Math.min(valueY, this._height * 0.98)).toFixed(0);
      var text;

      if (this._yAxis.isPercentageYAxis()) {
        var fromClose = this._chartData.dataList()[this._chartData.from()].close;

        text = "".concat(((value - fromClose) / fromClose * 100).toFixed(2), "%");
      } else {
        text = formatPrecision(value, precision);

        if (shouldFormatBigNumber) {
          text = formatBigNumber(text);
        }
      }

      this._ctx.font = createFont(textSize, textWeight, textFamily);
      var rectWidth = calcTextWidth(this._ctx, text) + textPaddingLeft + textPaddingRight;
      var rectHeight = textPaddingTop + textSize + textPaddingBottom;
      var rectStartX;

      if (this._isDrawFromStart(yAxisOptions)) {
        rectStartX = 0;
      } else {
        rectStartX = this._width - rectWidth;
      }

      renderFillRect(this._ctx, backgroundColor, rectStartX, valueY - textPaddingTop - textSize / 2, rectWidth, rectHeight);
      this._ctx.textBaseline = 'middle';
      renderText(this._ctx, textColor, rectStartX + textPaddingLeft, valueY, text);
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

var YAxisCrosshairView = /*#__PURE__*/function (_View) {
  _inherits(YAxisCrosshairView, _View);

  var _super = _createSuper(YAxisCrosshairView);

  function YAxisCrosshairView(container, chartData, yAxis, additionalDataProvider) {
    var _this;

    _classCallCheck(this, YAxisCrosshairView);

    _this = _super.call(this, container, chartData);
    _this._yAxis = yAxis;
    _this._additionalDataProvider = additionalDataProvider;
    return _this;
  }

  _createClass(YAxisCrosshairView, [{
    key: "_draw",
    value: function _draw() {
      this._drawCrossHairLabel();
    }
  }, {
    key: "_drawCrossHairLabel",
    value: function _drawCrossHairLabel() {
      var crosshair = this._chartData.crosshair();

      if (crosshair.paneTag !== this._additionalDataProvider.tag() || this._chartData.dataList().length === 0) {
        return;
      }

      var styleOptions = this._chartData.styleOptions();

      var crosshairOptions = styleOptions.crosshair;
      var crosshairHorizontalOptions = crosshairOptions.horizontal;
      var crosshairHorizontalTextOptions = crosshairHorizontalOptions.text;

      if (!crosshairOptions.show || !crosshairHorizontalOptions.show || !crosshairHorizontalTextOptions.show) {
        return;
      }

      var value = this._yAxis.convertFromPixel(crosshair.y);

      var text;

      if (this._yAxis.isPercentageYAxis()) {
        var fromClose = this._chartData.dataList()[this._chartData.from()].close;

        text = "".concat(((value - fromClose) / fromClose * 100).toFixed(2), "%");
      } else {
        var technicalIndicators = this._additionalDataProvider.technicalIndicators();

        var precision = 0;
        var shouldFormatBigNumber = false;

        if (this._yAxis.isCandleYAxis()) {
          precision = this._chartData.pricePrecision();
        } else {
          technicalIndicators.forEach(function (technicalIndicator) {
            precision = Math.max(technicalIndicator.precision, precision);

            if (!shouldFormatBigNumber) {
              shouldFormatBigNumber = technicalIndicator.shouldFormatBigNumber;
            }
          });
        }

        text = formatPrecision(value, precision);

        if (shouldFormatBigNumber) {
          text = formatBigNumber(text);
        }
      }

      var textSize = crosshairHorizontalTextOptions.size;
      this._ctx.font = createFont(textSize, crosshairHorizontalTextOptions.weight, crosshairHorizontalTextOptions.family);
      var yAxisDataLabelWidth = calcTextWidth(this._ctx, text);
      var rectStartX;
      var paddingLeft = crosshairHorizontalTextOptions.paddingLeft;
      var paddingRight = crosshairHorizontalTextOptions.paddingRight;
      var paddingTop = crosshairHorizontalTextOptions.paddingTop;
      var paddingBottom = crosshairHorizontalTextOptions.paddingBottom;
      var borderSize = crosshairHorizontalTextOptions.borderSize;
      var rectWidth = yAxisDataLabelWidth + borderSize * 2 + paddingLeft + paddingRight;
      var rectHeight = textSize + borderSize * 2 + paddingTop + paddingBottom;
      var yAxisOptions = styleOptions.yAxis;

      if (yAxisOptions.position === YAxisPosition.LEFT && yAxisOptions.inside || yAxisOptions.position === YAxisPosition.RIGHT && !yAxisOptions.inside) {
        rectStartX = 0;
      } else {
        rectStartX = this._width - rectWidth;
      }

      var rectY = crosshair.y - borderSize - paddingTop - textSize / 2; // 绘制y轴文字外的边框

      renderStrokeFillRect(this._ctx, crosshairHorizontalTextOptions.backgroundColor, crosshairHorizontalTextOptions.borderColor, borderSize, rectStartX, rectY, rectWidth, rectHeight);
      this._ctx.textBaseline = 'middle';
      renderText(this._ctx, crosshairHorizontalTextOptions.color, rectStartX + borderSize + paddingLeft, crosshair.y, text);
    }
  }]);

  return YAxisCrosshairView;
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
    key: "_createCrosshairView",
    value: function _createCrosshairView(container, props) {
      return new YAxisCrosshairView(container, props.chartData, props.yAxis, props.additionalDataProvider);
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
    this._cacheMinValue = 0;
    this._cacheMaxValue = 0;
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
    key: "width",
    value: function width() {
      return this._width;
    }
  }, {
    key: "height",
    value: function height() {
      return this._height;
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
    value: function computeAxis(forceCompute) {
      var _this$_computeMinMaxV = this._computeMinMaxValue(),
          min = _this$_computeMinMaxV.min,
          max = _this$_computeMinMaxV.max,
          range = _this$_computeMinMaxV.range;

      this._minValue = min;
      this._maxValue = max;

      if (this._cacheMinValue !== min || this._cacheMaxValue !== max || forceCompute) {
        this._cacheMinValue = min;
        this._cacheMaxValue = max;
        this._range = range;
        this._ticks = this._computeOptimalTicks(this._computeTicks());
        return true;
      }

      return false;
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

  function YAxis(chartData, isCandleYAxis, additionalDataProvider) {
    var _this;

    _classCallCheck(this, YAxis);

    _this = _super.call(this, chartData);
    _this._isCandleYAxis = isCandleYAxis;
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

        var technicalIndicators = this._additionalDataProvider.technicalIndicators();

        var precision = 0;
        var shouldFormatBigNumber = false;

        if (this._isCandleYAxis) {
          precision = this._chartData.pricePrecision();
        } else {
          technicalIndicators.forEach(function (technicalIndicator) {
            precision = Math.max(precision, technicalIndicator.precision);

            if (!shouldFormatBigNumber) {
              shouldFormatBigNumber = technicalIndicator.shouldFormatBigNumber;
            }
          });
        }

        var isPercentageAxis = this.isPercentageYAxis();

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

      var technicalIndicators = this._additionalDataProvider.technicalIndicators();

      var dataList = this._chartData.dataList();

      var from = this._chartData.from();

      var to = this._chartData.to();

      var minMaxArray = [Infinity, -Infinity];
      var plotsResult = [];
      var shouldOhlc = false;
      var minValue = Infinity;
      var maxValue = -Infinity;
      technicalIndicators.forEach(function (technicalIndicator) {
        if (!shouldOhlc) {
          shouldOhlc = technicalIndicator.should;
        }

        if (isValid(technicalIndicator.minValue) && isNumber(technicalIndicator.minValue)) {
          minValue = Math.min(minValue, technicalIndicator.minValue);
        }

        if (isValid(technicalIndicator.maxValue) && isNumber(technicalIndicator.maxValue)) {
          maxValue = Math.max(maxValue, technicalIndicator.maxValue);
        }

        plotsResult.push({
          plots: technicalIndicator.plots,
          result: technicalIndicator.result
        });
      });

      var candleOptions = this._chartData.styleOptions().candle;

      var isArea = candleOptions.type === CandleType.AREA;
      var areaValueKey = candleOptions.area.value;
      var shouldCompareHighLow = this._isCandleYAxis && !isArea || !this._isCandleYAxis && shouldOhlc;

      var _loop = function _loop(i) {
        var kLineData = dataList[i];

        if (shouldCompareHighLow) {
          minMaxArray[0] = Math.min(minMaxArray[0], kLineData.low);
          minMaxArray[1] = Math.max(minMaxArray[1], kLineData.high);
        }

        if (_this2._isCandleYAxis && isArea) {
          minMaxArray[0] = Math.min(minMaxArray[0], kLineData[areaValueKey]);
          minMaxArray[1] = Math.max(minMaxArray[1], kLineData[areaValueKey]);
        }

        plotsResult.forEach(function (_ref) {
          var plots = _ref.plots,
              result = _ref.result;
          var technicalIndicatorData = result[i] || {};
          plots.forEach(function (plot) {
            var value = technicalIndicatorData[plot.key];

            if (isValid(value)) {
              minMaxArray[0] = Math.min(minMaxArray[0], value);
              minMaxArray[1] = Math.max(minMaxArray[1], value);
            }
          });
        });
      };

      for (var i = from; i < to; i++) {
        _loop(i);
      }

      if (minValue !== Infinity) {
        minMaxArray[0] = Math.min(minValue, minMaxArray[0]);
      }

      if (maxValue !== -Infinity) {
        minMaxArray[1] = Math.max(maxValue, minMaxArray[1]);
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

          if (this._minValue === this._maxValue || Math.abs(this._minValue - this._maxValue) < Math.pow(10, -12)) {
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
    key: "isCandleYAxis",
    value: function isCandleYAxis() {
      return this._isCandleYAxis;
    }
    /**
     * 是否是蜡烛图y轴组件
     * @returns {boolean}
     */

  }, {
    key: "isPercentageYAxis",
    value: function isPercentageYAxis() {
      return this._isCandleYAxis && this._chartData.styleOptions().yAxis.type === YAxisType.PERCENTAGE;
    }
  }, {
    key: "getSelfWidth",
    value: function getSelfWidth() {
      var _this3 = this;

      var styleOptions = this._chartData.styleOptions();

      var yAxisOptions = styleOptions.yAxis;
      var width = yAxisOptions.width;

      if (isValid(width) && isNumber(+width)) {
        return +width;
      }

      var yAxisWidth = 0;

      if (yAxisOptions.show) {
        if (yAxisOptions.axisLine.show) {
          yAxisWidth += yAxisOptions.axisLine.size;
        }

        if (yAxisOptions.tickLine.show) {
          yAxisWidth += yAxisOptions.tickLine.length;
        }

        if (yAxisOptions.tickText.show) {
          var textWidth = 0;
          this._measureCtx.font = createFont(yAxisOptions.tickText.size, yAxisOptions.tickText.weight, yAxisOptions.tickText.family);

          this._ticks.forEach(function (tick) {
            textWidth = Math.max(textWidth, calcTextWidth(_this3._measureCtx, tick.v));
          });

          yAxisWidth += yAxisOptions.tickText.paddingLeft + yAxisOptions.tickText.paddingRight + textWidth;
        }
      }

      var crosshairOptions = styleOptions.crosshair;
      var crosshairVerticalTextWidth = 0;

      if (crosshairOptions.show && crosshairOptions.horizontal.show && crosshairOptions.horizontal.text.show) {
        var technicalIndicators = this._additionalDataProvider.technicalIndicators();

        var technicalIndicatorPrecision = 0;
        var shouldFormatBigNumber = false;
        technicalIndicators.forEach(function (technicalIndicator) {
          technicalIndicatorPrecision = Math.max(technicalIndicator.precision, technicalIndicatorPrecision);

          if (!shouldFormatBigNumber) {
            shouldFormatBigNumber = technicalIndicator.shouldFormatBigNumber;
          }
        });
        this._measureCtx.font = createFont(crosshairOptions.horizontal.text.size, crosshairOptions.horizontal.text.weight, crosshairOptions.horizontal.text.family);
        var precision = 2;

        if (!this.isPercentageYAxis()) {
          if (this._isCandleYAxis) {
            var pricePrecision = this._chartData.pricePrecision();

            var lastValueMarkOptions = styleOptions.technicalIndicator.lastValueMark;

            if (lastValueMarkOptions.show && lastValueMarkOptions.text.show) {
              precision = Math.max(technicalIndicatorPrecision, pricePrecision);
            } else {
              precision = pricePrecision;
            }
          } else {
            precision = technicalIndicatorPrecision;
          }
        }

        var valueText = formatPrecision(this._maxValue, precision);

        if (shouldFormatBigNumber) {
          valueText = formatBigNumber(valueText);
        }

        crosshairVerticalTextWidth += crosshairOptions.horizontal.text.paddingLeft + crosshairOptions.horizontal.text.paddingRight + crosshairOptions.horizontal.text.borderSize * 2 + calcTextWidth(this._measureCtx, valueText);
      }

      return Math.max(yAxisWidth, crosshairVerticalTextWidth);
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
    _this._technicalIndicators = [];

    if ('height' in props) {
      _this.setHeight(props.height);
    }

    _this.setTechnicalIndicator(_this._chartData.technicalIndicator(props.technicalIndicatorType));

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
        technicalIndicators: this.technicalIndicators.bind(this)
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
          technicalIndicators: this.technicalIndicators.bind(this),
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
          technicalIndicators: this.technicalIndicators.bind(this),
          tag: this.tag.bind(this)
        }
      });
    }
    /**
     * 是否包含指标
     * @param technicalIndicatorType
     * @return {boolean}
     * @private
     */

  }, {
    key: "_includeTechnicalIndicator",
    value: function _includeTechnicalIndicator(technicalIndicatorType) {
      var _iterator = _createForOfIteratorHelper(this._technicalIndicators),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var technicalIndicator = _step.value;

          if (technicalIndicator.name === technicalIndicatorType) {
            return true;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

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
    value: function computeAxis(forceCompute) {
      this._yAxis.calcMinMaxValue();

      return this._yAxis.computeAxis(forceCompute);
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
     * @returns {TechnicalIndicator}
     */

  }, {
    key: "technicalIndicators",
    value: function technicalIndicators() {
      return this._technicalIndicators;
    }
    /**
     * 是否无指标
     * @return {boolean}
     */

  }, {
    key: "isEmptyTechnicalIndicator",
    value: function isEmptyTechnicalIndicator() {
      return this._technicalIndicators.length === 0;
    }
    /**
     * 移除技术指标
     * @param technicalIndicatorType
     * @return {boolean}
     */

  }, {
    key: "removeTechnicalIndicator",
    value: function removeTechnicalIndicator(technicalIndicatorType) {
      var deletePos = -1;

      for (var i = 0; i < this._technicalIndicators.length; i++) {
        if (this._technicalIndicators[i].name === technicalIndicatorType) {
          deletePos = i;
          break;
        }
      }

      if (deletePos > -1) {
        this._technicalIndicators.splice(deletePos, 1);

        return true;
      }
    }
    /**
     * 设置技术指标类型
     * @param technicalIndicator
     * @param isOverride
     */

  }, {
    key: "setTechnicalIndicator",
    value: function setTechnicalIndicator(technicalIndicator, isOverride) {
      if (technicalIndicator) {
        if (this._includeTechnicalIndicator(technicalIndicator.name)) {
          return false;
        }

        var cloneInstance = Object.create(technicalIndicator);

        if (isOverride) {
          this._technicalIndicators = [cloneInstance];
        } else {
          this._technicalIndicators.push(cloneInstance);
        }

        this.calcTechnicalIndicator(technicalIndicator);
        return true;
      }

      return false;
    }
    /**
     * 计算单个技术指标
     * @param technicalIndicator
     */

  }, {
    key: "calcTechnicalIndicator",
    value: function calcTechnicalIndicator(technicalIndicator) {
      var technicalIndicatorInstance = this._chartData.technicalIndicator(technicalIndicator.name);

      technicalIndicator.setPrecision(technicalIndicatorInstance.precision);
      technicalIndicator.setCalcParams(technicalIndicatorInstance.calcParams);
      technicalIndicator.result = technicalIndicator.calcTechnicalIndicator(this._chartData.dataList(), technicalIndicator.calcParams, technicalIndicator.plots) || [];
    }
    /**
     * 计算所有技术指标
     */

  }, {
    key: "calcAllTechnicalIndicator",
    value: function calcAllTechnicalIndicator() {
      var _this2 = this;

      var technicalIndicators = this.technicalIndicators();
      technicalIndicators.forEach(function (technicalIndicator) {
        _this2.calcTechnicalIndicator(technicalIndicator);
      });
      return this.computeAxis();
    }
  }]);

  return TechnicalIndicatorPane;
}(Pane);

var CandleView = /*#__PURE__*/function (_TechnicalIndicatorVi) {
  _inherits(CandleView, _TechnicalIndicatorVi);

  var _super = _createSuper(CandleView);

  function CandleView() {
    _classCallCheck(this, CandleView);

    return _super.apply(this, arguments);
  }

  _createClass(CandleView, [{
    key: "_draw",
    value: function _draw() {
      this._drawGrid();

      var candleOptions = this._chartData.styleOptions().candle;

      if (candleOptions.type === CandleType.AREA) {
        this._drawArea(candleOptions);
      } else {
        this._drawCandle(candleOptions);

        this._drawLowHighPrice(candleOptions.priceMark, 'high', 'high', -Infinity, [-2, -5], function (price, comparePrice) {
          if (price > comparePrice) {
            return price;
          }
        });

        this._drawLowHighPrice(candleOptions.priceMark, 'low', 'low', Infinity, [2, 5], function (price, comparePrice) {
          if (price < comparePrice) {
            return price;
          }
        });
      }

      this._drawTechnicalIndicators();

      this._drawLastPriceLine(candleOptions.priceMark);
    }
    /**
     * 绘制面积图
     * @param candleOptions
     * @private
     */

  }, {
    key: "_drawArea",
    value: function _drawArea(candleOptions) {
      var _this = this;

      var linePoints = [];
      var areaPoints = [];

      var from = this._chartData.from();

      var minY = Infinity;
      var areaOptions = candleOptions.area;

      var onDrawing = function onDrawing(x, i, kLineData, halfBarSpace) {
        var value = kLineData[areaOptions.value];

        if (isValid(value) && isNumber(value)) {
          var y = _this._yAxis.convertToPixel(value);

          if (i === from) {
            var startX = x - halfBarSpace;
            areaPoints.push({
              x: startX,
              y: _this._height
            });
            areaPoints.push({
              x: startX,
              y: y
            });
            linePoints.push({
              x: startX,
              y: y
            });
          }

          linePoints.push({
            x: x,
            y: y
          });
          areaPoints.push({
            x: x,
            y: y
          });
          minY = Math.min(minY, y);
        }
      };

      var onDrawEnd = function onDrawEnd() {
        var areaPointLength = areaPoints.length;

        if (areaPointLength > 0) {
          var lastPoint = areaPoints[areaPointLength - 1];
          var halfBarSpace = _this._chartData.barSpace() / 2;
          var endX = lastPoint.x + halfBarSpace;
          linePoints.push({
            x: endX,
            y: lastPoint.y
          });
          areaPoints.push({
            x: endX,
            y: lastPoint.y
          });
          areaPoints.push({
            x: endX,
            y: _this._height
          });
        }

        if (linePoints.length > 0) {
          // 绘制分时线
          _this._ctx.lineWidth = areaOptions.lineSize;
          _this._ctx.strokeStyle = areaOptions.lineColor;
          renderLine(_this._ctx, function () {
            _this._ctx.beginPath();

            _this._ctx.moveTo(linePoints[0].x, linePoints[0].y);

            for (var i = 1; i < linePoints.length; i++) {
              _this._ctx.lineTo(linePoints[i].x, linePoints[i].y);
            }

            _this._ctx.stroke();

            _this._ctx.closePath();
          });
        }

        if (areaPoints.length > 0) {
          // 绘制分时线填充区域
          var fillColor = areaOptions.fillColor;

          if (isArray(fillColor)) {
            var gradient = _this._ctx.createLinearGradient(0, _this._height, 0, minY);

            try {
              fillColor.forEach(function (_ref) {
                var offset = _ref.offset,
                    color = _ref.color;
                gradient.addColorStop(offset, color);
              });
            } catch (e) {}

            _this._ctx.fillStyle = gradient;
          } else {
            _this._ctx.fillStyle = fillColor;
          }

          _this._ctx.beginPath();

          _this._ctx.moveTo(areaPoints[0].x, areaPoints[0].y);

          for (var i = 1; i < areaPoints.length; i++) {
            _this._ctx.lineTo(areaPoints[i].x, areaPoints[i].y);
          }

          _this._ctx.closePath();

          _this._ctx.fill();
        }
      };

      this._drawGraphics(onDrawing, onDrawEnd);
    }
    /**
     * 绘制蜡烛
     * @param candleOptions
     * @private
     */

  }, {
    key: "_drawCandle",
    value: function _drawCandle(candleOptions) {
      var _this2 = this;

      this._drawGraphics(function (x, i, kLineData, halfBarSpace, barSpace) {
        _this2._drawCandleBar(x, halfBarSpace, barSpace, i, kLineData, candleOptions.bar, candleOptions.type);
      });
    }
    /**
     * 渲染最高最低价格
     * @param priceMarkOptions
     * @param optionKey
     * @param priceKey
     * @param initPriceValue
     * @param offsets
     * @param compare
     * @private
     */

  }, {
    key: "_drawLowHighPrice",
    value: function _drawLowHighPrice(priceMarkOptions, optionKey, priceKey, initPriceValue, offsets, compare) {
      var _this3 = this;

      var lowHighPriceMarkOptions = priceMarkOptions[optionKey];

      if (!priceMarkOptions.show || !lowHighPriceMarkOptions.show) {
        return;
      }

      var dataList = this._chartData.dataList();

      var to = this._chartData.to();

      var price = initPriceValue;
      var pos = -1;

      for (var i = this._chartData.from(); i < to; i++) {
        var comparePrice = compare(formatValue(dataList[i], priceKey, initPriceValue), price);

        if (comparePrice) {
          price = comparePrice;
          pos = i;
        }
      }

      var pricePrecision = this._chartData.pricePrecision();

      var priceY = this._yAxis.convertToPixel(price);

      var startX = this._xAxis.convertToPixel(pos);

      var startY = priceY + offsets[0];
      this._ctx.textAlign = 'left';
      this._ctx.lineWidth = 1;
      this._ctx.strokeStyle = lowHighPriceMarkOptions.color;
      this._ctx.fillStyle = lowHighPriceMarkOptions.color;
      renderLine(this._ctx, function () {
        _this3._ctx.beginPath();

        _this3._ctx.moveTo(startX, startY);

        _this3._ctx.lineTo(startX - 2, startY + offsets[0]);

        _this3._ctx.stroke();

        _this3._ctx.closePath();

        _this3._ctx.beginPath();

        _this3._ctx.moveTo(startX, startY);

        _this3._ctx.lineTo(startX + 2, startY + offsets[0]);

        _this3._ctx.stroke();

        _this3._ctx.closePath();
      }); // 绘制竖线

      var y = startY + offsets[1];
      renderVerticalLine(this._ctx, startX, startY, y);
      renderHorizontalLine(this._ctx, y, startX, startX + 5);
      this._ctx.font = createFont(lowHighPriceMarkOptions.textSize, lowHighPriceMarkOptions.textWeight, lowHighPriceMarkOptions.textFamily);
      var text = formatPrecision(price, pricePrecision);
      this._ctx.textBaseline = 'middle';

      this._ctx.fillText(text, startX + 5 + lowHighPriceMarkOptions.textMargin, y);
    }
    /**
     * 绘制最新价线
     * @param priceMarkOptions
     * @private
     */

  }, {
    key: "_drawLastPriceLine",
    value: function _drawLastPriceLine(priceMarkOptions) {
      var lastPriceMarkOptions = priceMarkOptions.last;

      if (!priceMarkOptions.show || !lastPriceMarkOptions.show || !lastPriceMarkOptions.line.show) {
        return;
      }

      var dataList = this._chartData.dataList();

      var kLineData = dataList.last();

      if (!kLineData) {
        return;
      }

      var close = kLineData.close;
      var open = kLineData.open;

      var priceY = this._yAxis.convertToPixel(close);

      priceY = +Math.max(this._height * 0.05, Math.min(priceY, this._height * 0.98)).toFixed(0);
      var color;

      if (close > open) {
        color = lastPriceMarkOptions.upColor;
      } else if (close < open) {
        color = lastPriceMarkOptions.downColor;
      } else {
        color = lastPriceMarkOptions.noChangeColor;
      }

      this._ctx.save();

      this._ctx.strokeStyle = color;
      this._ctx.lineWidth = lastPriceMarkOptions.line.size;

      if (lastPriceMarkOptions.line.style === LineStyle.DASH) {
        this._ctx.setLineDash(lastPriceMarkOptions.line.dashValue);
      }

      renderHorizontalLine(this._ctx, priceY, 0, this._width);

      this._ctx.restore();
    }
  }]);

  return CandleView;
}(TechnicalIndicatorView);

var CandleCrosshairView = /*#__PURE__*/function (_TechnicalIndicatorCr) {
  _inherits(CandleCrosshairView, _TechnicalIndicatorCr);

  var _super = _createSuper(CandleCrosshairView);

  function CandleCrosshairView() {
    _classCallCheck(this, CandleCrosshairView);

    return _super.apply(this, arguments);
  }

  _createClass(CandleCrosshairView, [{
    key: "_drawTooltip",
    value: function _drawTooltip(crosshair, kLineData, dataPos, realDataPosX, technicalIndicators) {
      var styleOptions = this._chartData.styleOptions();

      var candleOptions = styleOptions.candle;
      var candleTooltipOptions = candleOptions.tooltip;

      var isDrawCandleTooltip = this._shouldDrawTooltip(crosshair, candleTooltipOptions);

      if (candleTooltipOptions.showType === TooltipCandleShowType.STANDARD) {
        var offsetTop = isDrawCandleTooltip ? candleTooltipOptions.text.size + candleTooltipOptions.text.marginTop : 0;

        this._drawCandleTooltipWithStandard(kLineData, candleOptions, isDrawCandleTooltip);

        this._drawBatchTechnicalIndicatorToolTip(crosshair, dataPos, technicalIndicators, offsetTop);
      } else {
        this._drawCandleTooltipWithRect(kLineData, technicalIndicators, dataPos, realDataPosX, candleOptions, isDrawCandleTooltip, styleOptions.technicalIndicator, this._shouldDrawTooltip(crosshair, styleOptions.technicalIndicator.tooltip));
      }
    }
    /**
     * 绘制蜡烛默认的图例
     * @param kLineData
     * @param candleOptions
     * @param isDrawCandleTooltip
     * @private
     */

  }, {
    key: "_drawCandleTooltipWithStandard",
    value: function _drawCandleTooltipWithStandard(kLineData, candleOptions, isDrawCandleTooltip) {
      var _this = this;

      if (!isDrawCandleTooltip) {
        return;
      }

      var values = this._getCandleTooltipData(kLineData, candleOptions);

      var candleTooltipOptions = candleOptions.tooltip;
      var textMarginLeft = candleTooltipOptions.text.marginLeft;
      var textMarginRight = candleTooltipOptions.text.marginRight;
      var textSize = candleTooltipOptions.text.size;
      var textColor = candleTooltipOptions.text.color;
      var labels = candleTooltipOptions.labels;
      this._ctx.textBaseline = 'top';
      this._ctx.font = createFont(textSize, candleTooltipOptions.text.weight, candleTooltipOptions.text.family);
      var labelX = textMarginLeft;
      var labelY = candleTooltipOptions.text.marginTop;
      labels.forEach(function (label, i) {
        var labelText = label ? "".concat(label, ": ") : '';
        var labelWidth = calcTextWidth(_this._ctx, labelText);
        renderText(_this._ctx, textColor, labelX, labelY, labelText);
        labelX += labelWidth;
        var value = values[i] || 'n/a';
        var valueText;
        var valueColor;

        if (isObject(value)) {
          valueText = value.value || 'n/a';
          valueColor = value.color || textColor;
        } else {
          valueColor = textColor;
          valueText = value;
        }

        var textWidth = calcTextWidth(_this._ctx, valueText);
        renderText(_this._ctx, valueColor, labelX, labelY, valueText);
        labelX += textWidth + textMarginLeft + textMarginRight;
      });
    }
    /**
     * 绘制蜡烛图矩形类型图例
     * @param kLineData
     * @param technicalIndicators
     * @param dataPos
     * @param x
     * @param candleOptions
     * @param isDrawCandleTooltip
     * @param technicalIndicatorOptions
     * @param isDrawTechnicalIndicatorTooltip
     * @private
     */

  }, {
    key: "_drawCandleTooltipWithRect",
    value: function _drawCandleTooltipWithRect(kLineData, technicalIndicators, dataPos, x, candleOptions, isDrawCandleTooltip, technicalIndicatorOptions, isDrawTechnicalIndicatorTooltip) {
      var _this2 = this;

      var candleTooltipOptions = candleOptions.tooltip;
      var baseLabels = candleTooltipOptions.labels;

      var baseValues = this._getCandleTooltipData(kLineData, candleOptions);

      var baseTextMarginLeft = candleTooltipOptions.text.marginLeft;
      var baseTextMarginRight = candleTooltipOptions.text.marginRight;
      var baseTextMarginTop = candleTooltipOptions.text.marginTop;
      var baseTextMarginBottom = candleTooltipOptions.text.marginBottom;
      var baseTextSize = candleTooltipOptions.text.size;
      var baseTextColor = candleTooltipOptions.text.color;
      var rectOptions = candleTooltipOptions.rect;
      var rectBorderSize = rectOptions.borderSize;
      var rectPaddingLeft = rectOptions.paddingLeft;
      var rectPaddingRight = rectOptions.paddingRight;
      var rectPaddingTop = rectOptions.paddingTop;
      var rectPaddingBottom = rectOptions.paddingBottom;
      var rectLeft = rectOptions.offsetLeft;
      var rectRight = rectOptions.offsetRight;
      var maxLabelWidth = 0;
      var rectHeight = 0;
      var rectWidth = 0;

      if (isDrawCandleTooltip || isDrawTechnicalIndicatorTooltip) {
        rectWidth = rectBorderSize * 2 + rectPaddingLeft + rectPaddingRight;
        rectHeight = rectBorderSize * 2 + rectPaddingTop + rectPaddingBottom;
      }

      this._ctx.save();

      this._ctx.textBaseline = 'top';

      if (isDrawCandleTooltip) {
        this._ctx.font = createFont(baseTextSize, candleTooltipOptions.text.weight, candleTooltipOptions.text.family);
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
        rectHeight += (baseTextMarginBottom + baseTextMarginTop + baseTextSize) * baseLabels.length;
      }

      var technicalIndicatorTooltipOptions = technicalIndicatorOptions.tooltip;
      var indicatorTextMarginLeft = technicalIndicatorTooltipOptions.text.marginLeft;
      var indicatorTextMarginRight = technicalIndicatorTooltipOptions.text.marginRight;
      var indicatorTextMarginTop = technicalIndicatorTooltipOptions.text.marginTop;
      var indicatorTextMarginBottom = technicalIndicatorTooltipOptions.text.marginBottom;
      var indicatorTextSize = technicalIndicatorTooltipOptions.text.size;
      var indicatorLabelValues = [];
      technicalIndicators.forEach(function (technicalIndicator) {
        var indicatorTooltipData = getTechnicalIndicatorTooltipData(technicalIndicator.result[dataPos], technicalIndicator, _this2._yAxis);
        indicatorLabelValues.push({
          labels: indicatorTooltipData.labels || [],
          values: indicatorTooltipData.values || []
        });
      });

      if (isDrawTechnicalIndicatorTooltip) {
        this._ctx.font = createFont(indicatorTextSize, technicalIndicatorTooltipOptions.text.weight, technicalIndicatorTooltipOptions.text.family);
        indicatorLabelValues.forEach(function (_ref) {
          var labels = _ref.labels,
              values = _ref.values;
          labels.forEach(function (label, i) {
            var v = values[i].value || 'n/a';
            var text = "".concat(label, ": ").concat(v);
            var labelWidth = calcTextWidth(_this2._ctx, text) + indicatorTextMarginLeft + indicatorTextMarginRight;
            maxLabelWidth = Math.max(maxLabelWidth, labelWidth);
          });
          rectHeight += (indicatorTextMarginTop + indicatorTextMarginBottom + indicatorTextSize) * labels.length;
        });
      }

      rectWidth += maxLabelWidth;
      var centerX = this._width / 2;
      var rectX;

      if (x < centerX) {
        rectX = this._width - rectRight - rectWidth;
      } else {
        rectX = rectLeft;
      }

      var rectY = rectOptions.offsetTop;
      var radius = rectOptions.borderRadius;
      renderFillRoundRect(this._ctx, rectOptions.fillColor, rectX, rectY, rectWidth, rectHeight, radius);
      renderStrokeRoundRect(this._ctx, rectOptions.borderColor, rectBorderSize, rectX, rectY, rectWidth, rectHeight, radius);
      var baseLabelX = rectX + rectBorderSize + rectPaddingLeft + baseTextMarginLeft;
      var labelY = rectY + rectBorderSize + rectPaddingTop;

      if (isDrawCandleTooltip) {
        // 开始渲染基础数据文字
        this._ctx.font = createFont(baseTextSize, candleTooltipOptions.text.weight, candleTooltipOptions.text.family);
        baseLabels.forEach(function (label, i) {
          labelY += baseTextMarginTop;
          _this2._ctx.textAlign = 'left';
          renderText(_this2._ctx, baseTextColor, baseLabelX, labelY, "".concat(label, ": "));
          var value = baseValues[i] || 'n/a';
          var text;
          _this2._ctx.fillStyle = value.color || baseTextColor;

          if (isObject(value)) {
            text = value.value || 'n/a';
          } else {
            text = value;
          }

          _this2._ctx.textAlign = 'right';
          renderText(_this2._ctx, value.color || baseTextColor, rectX + rectWidth - rectBorderSize - baseTextMarginRight - rectPaddingRight, labelY, text);
          labelY += baseTextSize + baseTextMarginBottom;
        });
      }

      if (isDrawTechnicalIndicatorTooltip) {
        // 开始渲染指标数据文字
        var _technicalIndicatorOptions = this._chartData.styleOptions().technicalIndicator;

        var colors = _technicalIndicatorOptions.line.colors;
        var indicatorLabelX = rectX + rectBorderSize + rectPaddingLeft + indicatorTextMarginLeft;
        var colorSize = colors.length;
        this._ctx.font = createFont(indicatorTextSize, technicalIndicatorTooltipOptions.text.weight, technicalIndicatorTooltipOptions.text.family);
        indicatorLabelValues.forEach(function (_ref2) {
          var labels = _ref2.labels,
              values = _ref2.values;
          labels.forEach(function (label, i) {
            labelY += indicatorTextMarginTop;
            _this2._ctx.textAlign = 'left';
            _this2._ctx.fillStyle = colors[i % colorSize] || _technicalIndicatorOptions.text.color;

            _this2._ctx.fillText("".concat(label.toUpperCase(), ": "), indicatorLabelX, labelY);

            _this2._ctx.textAlign = 'right';

            _this2._ctx.fillText(values[i].value || 'n/a', rectX + rectWidth - rectBorderSize - indicatorTextMarginRight - rectPaddingRight, labelY);

            labelY += indicatorTextSize + indicatorTextMarginBottom;
          });
        });
      }

      this._ctx.restore();
    }
    /**
     * 获取蜡烛提示数据
     * @param kLineData
     * @param candleOptions
     * @returns {*}
     * @private
     */

  }, {
    key: "_getCandleTooltipData",
    value: function _getCandleTooltipData(kLineData, candleOptions) {
      var _this3 = this;

      var baseValues = candleOptions.tooltip.values;
      var values = [];

      if (baseValues) {
        if (isFunction(baseValues)) {
          values = baseValues(kLineData, candleOptions) || [];
        } else if (isArray(baseValues)) {
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

  return CandleCrosshairView;
}(TechnicalIndicatorCrosshairView);

var GraphicMarkView = /*#__PURE__*/function (_View) {
  _inherits(GraphicMarkView, _View);

  var _super = _createSuper(GraphicMarkView);

  function GraphicMarkView() {
    _classCallCheck(this, GraphicMarkView);

    return _super.apply(this, arguments);
  }

  _createClass(GraphicMarkView, [{
    key: "_draw",
    value: function _draw() {
      var _this = this;

      var graphicMarks = this._chartData.graphicMarks();

      graphicMarks.forEach(function (graphicMark) {
        graphicMark.draw(_this._ctx);
      });
    }
  }]);

  return GraphicMarkView;
}(View);

var CandleWidget = /*#__PURE__*/function (_TechnicalIndicatorWi) {
  _inherits(CandleWidget, _TechnicalIndicatorWi);

  var _super = _createSuper(CandleWidget);

  function CandleWidget() {
    _classCallCheck(this, CandleWidget);

    return _super.apply(this, arguments);
  }

  _createClass(CandleWidget, [{
    key: "_createMainView",
    value: function _createMainView(container, props) {
      return new CandleView(container, props.chartData, props.xAxis, props.yAxis, props.additionalDataProvider);
    }
  }, {
    key: "_createExpandView",
    value: function _createExpandView(container, props) {
      return new GraphicMarkView(container, props.chartData);
    }
  }, {
    key: "_createCrosshairView",
    value: function _createCrosshairView(container, props) {
      return new CandleCrosshairView(container, props.chartData, props.xAxis, props.yAxis, props.additionalDataProvider);
    }
  }]);

  return CandleWidget;
}(TechnicalIndicatorWidget);

var CandlePane = /*#__PURE__*/function (_TechnicalIndicatorPa) {
  _inherits(CandlePane, _TechnicalIndicatorPa);

  var _super = _createSuper(CandlePane);

  function CandlePane() {
    _classCallCheck(this, CandlePane);

    return _super.apply(this, arguments);
  }

  _createClass(CandlePane, [{
    key: "_createYAxis",
    value: function _createYAxis(props) {
      return new YAxis(props.chartData, true, {
        technicalIndicators: this.technicalIndicators.bind(this)
      });
    }
  }, {
    key: "_createMainWidget",
    value: function _createMainWidget(container, props) {
      return new CandleWidget({
        container: container,
        chartData: props.chartData,
        xAxis: props.xAxis,
        yAxis: this._yAxis,
        additionalDataProvider: {
          technicalIndicators: this.technicalIndicators.bind(this),
          tag: this.tag.bind(this)
        }
      });
    }
  }]);

  return CandlePane;
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

      if (xAxisOptions.show) {
        this._drawAxisLine(xAxisOptions);

        this._drawTickLines(xAxisOptions);

        this._drawTickLabels(xAxisOptions);
      }
    }
  }, {
    key: "_drawAxisLine",
    value: function _drawAxisLine(xAxisOptions) {
      var xAxisLine = xAxisOptions.axisLine;

      if (!xAxisLine.show) {
        return;
      }

      this._ctx.strokeStyle = xAxisLine.color;
      this._ctx.lineWidth = xAxisLine.size;
      renderHorizontalLine(this._ctx, 0, 0, this._width);
    }
  }, {
    key: "_drawTickLines",
    value: function _drawTickLines(xAxisOptions) {
      var _this2 = this;

      var tickLine = xAxisOptions.tickLine;

      if (!tickLine.show) {
        return;
      }

      this._ctx.lineWidth = tickLine.size;
      this._ctx.strokeStyle = tickLine.color;
      var startY = xAxisOptions.axisLine.show ? xAxisOptions.axisLine.size : 0;
      var endY = startY + tickLine.length;

      this._xAxis.ticks().forEach(function (tick) {
        renderVerticalLine(_this2._ctx, tick.x, startY, endY);
      });
    }
  }, {
    key: "_drawTickLabels",
    value: function _drawTickLabels(xAxisOptions) {
      var tickText = xAxisOptions.tickText;

      if (!tickText.show) {
        return;
      }

      var tickLine = xAxisOptions.tickLine;
      this._ctx.textBaseline = 'top';
      this._ctx.font = createFont(tickText.size, tickText.weight, tickText.family);
      this._ctx.textAlign = 'center';
      this._ctx.fillStyle = tickText.color;
      var labelY = tickText.paddingTop;

      if (xAxisOptions.axisLine.show) {
        labelY += xAxisOptions.axisLine.size;
      }

      if (tickLine.show) {
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

var XAxisCrosshairView = /*#__PURE__*/function (_View) {
  _inherits(XAxisCrosshairView, _View);

  var _super = _createSuper(XAxisCrosshairView);

  function XAxisCrosshairView(container, chartData, xAxis) {
    var _this;

    _classCallCheck(this, XAxisCrosshairView);

    _this = _super.call(this, container, chartData);
    _this._xAxis = xAxis;
    return _this;
  }

  _createClass(XAxisCrosshairView, [{
    key: "_draw",
    value: function _draw() {
      this._drawCrosshairLabel();
    }
  }, {
    key: "_drawCrosshairLabel",
    value: function _drawCrosshairLabel() {
      var crosshair = this._chartData.crosshair();

      if (!crosshair.paneTag) {
        return;
      }

      var crosshairOptions = this._chartData.styleOptions().crosshair;

      var crosshairVerticalOptions = crosshairOptions.vertical;
      var crosshairVerticalTextOptions = crosshairVerticalOptions.text;

      if (!crosshairOptions.show || !crosshairVerticalOptions.show || !crosshairVerticalTextOptions.show) {
        return;
      }

      var dataList = this._chartData.dataList();

      var dataPos;

      if (isValid(crosshair.x)) {
        dataPos = this._xAxis.convertFromPixel(crosshair.x);
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
      var textSize = crosshairVerticalTextOptions.size;
      this._ctx.font = createFont(textSize, crosshairVerticalTextOptions.weight, crosshairVerticalTextOptions.family);
      var labelWidth = calcTextWidth(this._ctx, text);
      var labelX = x - labelWidth / 2;
      var paddingLeft = crosshairVerticalTextOptions.paddingLeft;
      var paddingRight = crosshairVerticalTextOptions.paddingRight;
      var paddingTop = crosshairVerticalTextOptions.paddingTop;
      var paddingBottom = crosshairVerticalTextOptions.paddingBottom;
      var borderSize = crosshairVerticalTextOptions.borderSize; // 保证整个x轴上的提示文字总是完全显示

      if (labelX < paddingLeft + borderSize) {
        labelX = paddingLeft + borderSize;
      } else if (labelX > this._width - labelWidth - borderSize - paddingRight) {
        labelX = this._width - labelWidth - borderSize - paddingRight;
      }

      var rectLeft = labelX - borderSize - paddingLeft;
      var rectTop = 0;
      var rectRight = labelX + labelWidth + borderSize + paddingRight;
      var rectBottom = rectTop + textSize + borderSize * 2 + paddingTop + paddingBottom;
      renderStrokeFillRect(this._ctx, crosshairVerticalTextOptions.backgroundColor, crosshairVerticalTextOptions.borderColor, borderSize, rectLeft, rectTop, rectRight - rectLeft, rectBottom - rectTop); // 绘制轴上的提示文字

      this._ctx.textBaseline = 'top';
      renderText(this._ctx, crosshairVerticalTextOptions.color, labelX, borderSize + paddingTop, text);
    }
  }]);

  return XAxisCrosshairView;
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
    key: "_createCrosshairView",
    value: function _createCrosshairView(container, props) {
      return new XAxisCrosshairView(container, props.chartData, props.xAxis);
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

        this._measureCtx.font = createFont(tickText.size, tickText.weight, tickText.family);
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
      var height = xAxisOptions.height;

      if (isValid(height) && isNumber(+height)) {
        return +height;
      }

      var crosshairOptions = stylOptions.crosshair;
      var xAxisHeight = 0;

      if (xAxisOptions.show) {
        if (xAxisOptions.axisLine.show) {
          xAxisHeight += xAxisOptions.axisLine.size;
        }

        if (xAxisOptions.tickLine.show) {
          xAxisHeight += xAxisOptions.tickLine.length;
        }

        if (xAxisOptions.tickText.show) {
          xAxisHeight += xAxisOptions.tickText.paddingTop + xAxisOptions.tickText.paddingBottom + xAxisOptions.tickText.size;
        }
      }

      var crosshairVerticalTextHeight = 0;

      if (crosshairOptions.show && crosshairOptions.vertical.show && crosshairOptions.vertical.text.show) {
        crosshairVerticalTextHeight += crosshairOptions.vertical.text.paddingTop + crosshairOptions.vertical.text.paddingBottom + crosshairOptions.vertical.text.borderSize * 2 + crosshairOptions.vertical.text.size;
      }

      return Math.max(xAxisHeight, crosshairVerticalTextHeight);
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
      this._xAxis.computeAxis(true);
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
        this._chartData.setCrosshairPointPaneTag(null, null);
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
        _this2._chartData.setCrosshairPointPaneTag({
          x: event.localX,
          y: cross.y
        }, cross.tag);
      }, function () {
        _this2._chartData.setCrosshairPointPaneTag(null, null);
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

          _this3._chartData.setCrosshairPointPaneTag({
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

            _this4._chartData.setCrosshairPointPaneTag(crossHairPoint, cross.tag);
          } else {
            _this4._touchCancelCrossHair = true;
            _this4._touchPoint = null;

            _this4._chartData.setCrosshairPointPaneTag(null, null);
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

            _this5._chartData.setCrosshairPointPaneTag(crossHairPoint, cross.tag);

            return;
          }
        }

        var distance = event.localX - _this5._startScrollPoint.x;

        _this5._chartData.setCrosshairPointPaneTag(crossHairPoint, cross.tag);

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

        _this6._chartData.setCrosshairPointPaneTag({
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

var GraphicMarkEventHandler = /*#__PURE__*/function (_EventHandler) {
  _inherits(GraphicMarkEventHandler, _EventHandler);

  var _super = _createSuper(GraphicMarkEventHandler);

  function GraphicMarkEventHandler(chartData) {
    var _this;

    _classCallCheck(this, GraphicMarkEventHandler);

    _this = _super.call(this, chartData);
    _this._pressedGraphicMark = null;
    return _this;
  }
  /**
   * 鼠标抬起事件
   * @param event
   */


  _createClass(GraphicMarkEventHandler, [{
    key: "mouseUpEvent",
    value: function mouseUpEvent(event) {
      if (this._pressedGraphicMark) {
        this._pressedGraphicMark = null;

        this._chartData.setDragGraphicMarkFlag(false);
      }
    }
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

      if (!this._waitingForMouseMoveAnimationFrame) {
        this._waitingForMouseMoveAnimationFrame = true;

        var graphicMarks = this._chartData.graphicMarks();

        var lastGraphicMark = graphicMarks.last();

        if (lastGraphicMark && lastGraphicMark.isDrawing()) {
          lastGraphicMark.mouseMoveForDrawing(point);
          lastGraphicMark.checkMousePointOnGraphic(point);
        } else {
          var isHover = false;
          graphicMarks.forEach(function (graphicMark) {
            graphicMark.resetHoverParams();

            if (!isHover) {
              isHover = graphicMark.checkMousePointOnGraphic(point);
            }
          });
        }

        this._chartData.invalidate(InvalidateLevel.GRAPHIC_MARK);

        this._waitingForMouseMoveAnimationFrame = false;
      }
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

      var graphicMarks = this._chartData.graphicMarks();

      var lastGraphicMark = graphicMarks[graphicMarks.length - 1];

      if (lastGraphicMark && lastGraphicMark.isDrawing()) {
        lastGraphicMark.mouseLeftButtonDownForDrawing(point);

        this._chartData.invalidate(InvalidateLevel.GRAPHIC_MARK);
      } else {
        for (var i = 0; i < graphicMarks.length; i++) {
          if (graphicMarks[i].checkMousePointOnGraphic(point) && graphicMarks[i].hoverType() === HoverType.POINT) {
            this._pressedGraphicMark = graphicMarks[i];

            this._chartData.setDragGraphicMarkFlag(true);

            this._chartData.invalidate(InvalidateLevel.GRAPHIC_MARK);

            return;
          }
        }
      }
    }
  }, {
    key: "mouseRightDownEvent",
    value: function mouseRightDownEvent(event) {
      var point = {
        x: event.localX,
        y: event.localY
      };

      var graphicMarks = this._chartData.graphicMarks();

      for (var i = 0; i < graphicMarks.length; i++) {
        if (graphicMarks[i].checkMousePointOnGraphic(point)) {
          graphicMarks.splice(i, 1);

          this._chartData.invalidate(InvalidateLevel.GRAPHIC_MARK);

          return;
        }
      }
    }
  }, {
    key: "pressedMouseMoveEvent",
    value: function pressedMouseMoveEvent(event) {
      var graphicMarks = this._chartData.graphicMarks();

      var lastGraphicMark = graphicMarks.last();

      if ((!lastGraphicMark || !lastGraphicMark.isDrawing()) && this._pressedGraphicMark) {
        this._pressedGraphicMark.mousePressedMove({
          x: event.localX,
          y: event.localY
        });

        this._chartData.invalidate(InvalidateLevel.GRAPHIC_MARK);
      }
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
  function ChartEvent(target, chartData) {
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
    this._graphicMarkEventHandler = new GraphicMarkEventHandler(chartData);
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


        if (this._chartData.crosshair().paneTag) {
          this._chartData.setCrosshairPointPaneTag(null, null);
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
      var graphicMarks = this._chartData.graphicMarks();

      var graphicMarkCount = graphicMarks.length;
      return !this._chartData.dragGraphicMarkFlag() && (graphicMarkCount === 0 || !graphicMarks[graphicMarkCount - 1].isDrawing());
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
var TECHNICAL_INDICATOR_PANE = 'technicalIndicator';
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
    this._candlePane = new CandlePane({
      container: this._chartContainer,
      chartData: this._chartData,
      xAxis: this._xAxisPane.xAxis(),
      tag: CANDLE_STICK_PANE_TAG
    });
    this._chartEvent = new ChartEvent(this._chartContainer, this._chartData);
    this.adjustPaneViewport(true, true, true);
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

      this.adjustPaneViewport(true, true, true, true, true);
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

        this._candlePane.invalidate(invalidateLevel);

        var _iterator = _createForOfIteratorHelper(this._technicalIndicatorPanes),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var pane = _step.value;
            pane.invalidate(invalidateLevel);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      } else {
        var shouldMeasureWidth = this._candlePane.computeAxis();

        if (invalidateLevel !== InvalidateLevel.GRAPHIC_MARK) {
          var _iterator2 = _createForOfIteratorHelper(this._technicalIndicatorPanes),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var _pane = _step2.value;

              var should = _pane.computeAxis();

              if (should) {
                shouldMeasureWidth = should;
              }
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        } // this._measureWidthAndLayoutPane(shouldMeasureWidth)


        this.adjustPaneViewport(false, shouldMeasureWidth, true);
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
        var shouldMeasureWidth = _this._candlePane.calcAllTechnicalIndicator();

        var _iterator3 = _createForOfIteratorHelper(_this._technicalIndicatorPanes),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var pane = _step3.value;
            var should = pane.calcAllTechnicalIndicator();

            if (should) {
              shouldMeasureWidth = should;
            }
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }

        _this.adjustPaneViewport(false, shouldMeasureWidth, true);
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

      var _iterator4 = _createForOfIteratorHelper(this._technicalIndicatorPanes),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var pane = _step4.value;

          var _paneHeight = pane.height();

          technicalIndicatorPaneTotalHeight += _paneHeight; // 修复拖拽会超出容器高度问题

          if (technicalIndicatorPaneTotalHeight > paneExcludeXAxisSeparatorHeight) {
            var difHeight = technicalIndicatorPaneTotalHeight - paneExcludeXAxisSeparatorHeight;
            technicalIndicatorPaneTotalHeight = paneExcludeXAxisSeparatorHeight;
            pane.setHeight(_paneHeight - difHeight);
          }
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }

      var candleStickPaneHeight = paneExcludeXAxisSeparatorHeight - technicalIndicatorPaneTotalHeight;
      var paneContentSize = {};
      paneContentSize[CANDLE_STICK_PANE_TAG] = {
        contentTop: 0,
        contentBottom: candleStickPaneHeight
      };
      var contentTop = candleStickPaneHeight;
      var contentBottom = candleStickPaneHeight;

      this._candlePane.setHeight(candleStickPaneHeight);

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
        yAxisWidth = this._candlePane.getSelfAxisWidth();

        var _iterator5 = _createForOfIteratorHelper(this._technicalIndicatorPanes),
            _step5;

        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var pane = _step5.value;
            yAxisWidth = Math.max(yAxisWidth, pane.getSelfAxisWidth());
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
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

      this._candlePane.setWidth(mainWidth, yAxisWidth);

      this._candlePane.setOffsetLeft(mainOffsetLeft, yAxisOffsetLeft);

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
     * 调整窗口尺寸
     * @param shouldMeasureHeight
     * @param shouldMeasureWidth
     * @param shouldLayout
     * @param shouldComputeAxis
     * @param shouldForceComputeAxis
     */

  }, {
    key: "adjustPaneViewport",
    value: function adjustPaneViewport(shouldMeasureHeight, shouldMeasureWidth, shouldLayout, shouldComputeAxis, shouldForceComputeAxis) {
      if (shouldMeasureHeight) {
        this._measurePaneHeight();
      }

      var isAdjust = false;

      if (shouldComputeAxis) {
        isAdjust = this._candlePane.computeAxis(shouldForceComputeAxis);

        var _iterator6 = _createForOfIteratorHelper(this._technicalIndicatorPanes),
            _step6;

        try {
          for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
            var pane = _step6.value;
            var adjust = pane.computeAxis(shouldForceComputeAxis);

            if (!isAdjust) {
              isAdjust = adjust;
            }
          }
        } catch (err) {
          _iterator6.e(err);
        } finally {
          _iterator6.f();
        }
      }

      if (!shouldComputeAxis && shouldMeasureWidth || shouldComputeAxis && isAdjust) {
        this._measurePaneWidth();
      }

      if (shouldLayout) {
        this._xAxisPane.computeAxis();

        this._xAxisPane.layout();

        this._candlePane.layout();

        var _iterator7 = _createForOfIteratorHelper(this._technicalIndicatorPanes),
            _step7;

        try {
          for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
            var _pane2 = _step7.value;

            _pane2.layout();
          }
        } catch (err) {
          _iterator7.e(err);
        } finally {
          _iterator7.f();
        }
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
     * 加载技术指标参数
     * @param technicalIndicatorType
     * @param params
     */

  }, {
    key: "applyTechnicalIndicatorParams",
    value: function applyTechnicalIndicatorParams(technicalIndicatorType, params) {
      var _this2 = this;

      var technicalIndicator = this._chartData.technicalIndicator(technicalIndicatorType);

      if (technicalIndicator && isArray(params)) {
        var _iterator8 = _createForOfIteratorHelper(params),
            _step8;

        try {
          for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
            var v = _step8.value;

            if (!isNumber(v) || v <= 0 || parseInt(v, 10) !== v) {
              return;
            }
          }
        } catch (err) {
          _iterator8.e(err);
        } finally {
          _iterator8.f();
        }

        technicalIndicator.setCalcParams(clone(params));
        Promise.resolve().then(function (_) {
          var candleTechnicalIndicators = _this2._candlePane.technicalIndicators();

          var shouldAdjust = false;
          candleTechnicalIndicators.forEach(function (technicalIndicator) {
            if (technicalIndicator.name === technicalIndicatorType) {
              shouldAdjust = true;

              _this2._candlePane.calcTechnicalIndicator(technicalIndicator);
            }
          });

          var _iterator9 = _createForOfIteratorHelper(_this2._technicalIndicatorPanes),
              _step9;

          try {
            var _loop = function _loop() {
              var pane = _step9.value;
              var technicalIndicators = pane.technicalIndicators();
              technicalIndicators.forEach(function (technicalIndicator) {
                if (technicalIndicator.name === technicalIndicatorType) {
                  shouldAdjust = true;
                  pane.calcTechnicalIndicator(technicalIndicator);
                }
              });
            };

            for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
              _loop();
            }
          } catch (err) {
            _iterator9.e(err);
          } finally {
            _iterator9.f();
          }

          if (shouldAdjust) {
            _this2.adjustPaneViewport(false, true, true, true);
          }
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

        if (timestamp >= lastDataTimestamp) {
          var pos = dataSize;

          if (timestamp === lastDataTimestamp) {
            pos = dataSize - 1;
          }

          this._chartData.addData(data, pos);

          this._calcAllPaneTechnicalIndicator();
        }
      }
    }
    /**
     * 创建一个窗口
     * @param type
     * @param options
     * @returns {string|null}
     */

  }, {
    key: "createPane",
    value: function createPane() {
      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : TECHNICAL_INDICATOR_PANE;
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (type === TECHNICAL_INDICATOR_PANE) {
        var technicalIndicatorType = options.technicalIndicatorType,
            _options$height = options.height,
            height = _options$height === void 0 ? DEFAULT_TECHNICAL_INDICATOR_PANE_HEIGHT : _options$height,
            dragEnabled = options.dragEnabled;
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
          tag: tag,
          height: height
        });

        this._technicalIndicatorPanes.push(technicalIndicatorPane);

        this.adjustPaneViewport(true, true, true, true, true);
        return tag;
      }

      return null;
    }
    /**
     * 移除一个指标
     * @param technicalIndicatorType
     * @param tag
     */

  }, {
    key: "removeTechnicalIndicator",
    value: function removeTechnicalIndicator(technicalIndicatorType, tag) {
      if (tag) {
        var panePos = -1;

        for (var i = 0; i < this._technicalIndicatorPanes.length; i++) {
          var pane = this._technicalIndicatorPanes[i];

          if (pane.tag() === tag) {
            panePos = i;
            break;
          }
        }

        if (panePos !== -1) {
          var removed = this._technicalIndicatorPanes[panePos].removeTechnicalIndicator(technicalIndicatorType);

          if (this._technicalIndicatorPanes[panePos].isEmptyTechnicalIndicator() || !technicalIndicatorType) {
            this._technicalIndicatorPanes[panePos].destroy();

            this._separatorPanes[panePos].destroy();

            this._technicalIndicatorPanes.splice(panePos, 1);

            this._separatorPanes.splice(panePos, 1);

            for (var _i = 0; _i < this._separatorPanes.length; _i++) {
              this._separatorPanes[_i].updatePaneIndex(_i);
            }

            this.adjustPaneViewport(true, true, true, true, true);
          } else {
            if (removed) {
              this.adjustPaneViewport(false, true, true, true);
            }
          }
        }
      } else {
        if (this._candlePane.removeTechnicalIndicator(technicalIndicatorType)) {
          this.adjustPaneViewport(false, true, true, true);
        }
      }
    }
    /**
     * 设置指标类型
     * @param technicalIndicatorType
     * @param isOverride
     * @param tag
     */

  }, {
    key: "setTechnicalIndicatorType",
    value: function setTechnicalIndicatorType(technicalIndicatorType, isOverride, tag) {
      var technicalIndicator = this._chartData.technicalIndicator(technicalIndicatorType);

      if (tag) {
        var p;

        var _iterator10 = _createForOfIteratorHelper(this._technicalIndicatorPanes),
            _step10;

        try {
          for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
            var pane = _step10.value;

            if (pane.tag() === tag) {
              p = pane;
              break;
            }
          }
        } catch (err) {
          _iterator10.e(err);
        } finally {
          _iterator10.f();
        }

        if (p) {
          if (p.setTechnicalIndicator(technicalIndicator, isOverride)) {
            this.adjustPaneViewport(false, true, true, true);
          }
        }
      } else {
        if (this._candlePane.setTechnicalIndicator(technicalIndicator, isOverride)) {
          this.adjustPaneViewport(false, true, true, true);
        }
      }
    }
    /**
     * 添加图形标记
     * @param type
     */

  }, {
    key: "addGraphicMark",
    value: function addGraphicMark(type) {
      var graphicMarkMapping = this._chartData.graphicMarkMapping();

      var GraphicMark = graphicMarkMapping[type];

      this._chartData.addGraphicMark(new GraphicMark(this._chartData, this._xAxisPane.xAxis(), this._candlePane.yAxis()));
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
    value: function getConvertPictureUrl(includeFloatLayer, includeGraphicMark, type, backgroundColor) {
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

      var candleStickPaneHeight = this._candlePane.height();

      ctx.drawImage(this._candlePane.getImage(includeFloatLayer, includeGraphicMark), 0, offsetTop, width, candleStickPaneHeight);
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
      this._candlePane.destroy();

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

/* eslint-disable no-extend-native */

/**
 * 数字扩展，获取数组最后一个数据
 * @return {*}
 */
Array.prototype.last = function () {
  return this[this.length - 1];
};

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

        this._chartPane.adjustPaneViewport(true, true, true, true, true);
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
     * @param technicalIndicatorType
     * @returns {function(Array<string>, string, string): Promise}
     */

  }, {
    key: "getTechnicalIndicatorParams",
    value: function getTechnicalIndicatorParams(technicalIndicatorType) {
      return this._chartPane.chartData().technicalIndicatorCalcParams(technicalIndicatorType);
    }
    /**
     * 设置价格数量精度
     * @param pricePrecision
     * @param volumePrecision
     */

  }, {
    key: "setPriceVolumePrecision",
    value: function setPriceVolumePrecision(pricePrecision, volumePrecision) {
      if (!isValid(pricePrecision) || !isNumber(pricePrecision) || pricePrecision < 0) {
        {
          console.warn('Invalid parameter: pricePrecision!!!');
        }

        return;
      }

      if (!isValid(volumePrecision) || !isNumber(volumePrecision) || volumePrecision < 0) {
        {
          console.warn('Invalid parameter: volumePrecision!!!');
        }

        return;
      }

      this._chartPane.chartData().applyPriceVolumePrecision(pricePrecision, volumePrecision);
    }
    /**
     * 设置技术指标精度
     * @param precision
     * @param technicalIndicatorType
     */

  }, {
    key: "setTechnicalIndicatorPrecision",
    value: function setTechnicalIndicatorPrecision(precision, technicalIndicatorType) {
      if (!isValid(precision) || !isNumber(precision) || precision < 0) {
        {
          console.warn('Invalid parameter: precision!!!');
        }

        return;
      }

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
     * 获取当前时区
     */

  }, {
    key: "getTimezone",
    value: function getTimezone() {
      return this._chartPane.chartData().timezone();
    }
    /**
     * 重置尺寸，总是会填充父容器
     */

  }, {
    key: "resize",
    value: function resize() {
      this._chartPane.adjustPaneViewport(true, true, true, true, true);
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
      if (!isValid(barCount) || !isNumber(barCount) || barCount <= 0) {
        {
          console.warn('Invalid parameter: barCount!!!');
        }

        return;
      }

      this._chartPane.chartData().setLeftMinVisibleBarCount(Math.ceil(barCount));
    }
    /**
     * 设置右边可见的最小bar数量
     * @param barCount
     */

  }, {
    key: "setRightMinVisibleBarCount",
    value: function setRightMinVisibleBarCount(barCount) {
      if (!isValid(barCount) || !isNumber(barCount) || barCount <= 0) {
        {
          console.warn('Invalid parameter: barCount!!!');
        }

        return;
      }

      this._chartPane.chartData().setRightMinVisibleBarCount(Math.ceil(barCount));
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
      if (!isArray(dataList)) {
        {
          console.warn('Invalid parameter: dataList, dataList be an array!!!');
        }

        return;
      }

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
      if (!isArray(dataList)) {
        {
          console.warn('Invalid parameter: dataList, dataList be an array!!!');
        }

        return;
      }

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
     * 设置技术指标类型
     * @param technicalIndicatorType
     * @param isOverride
     * @param tag
     */

  }, {
    key: "setTechnicalIndicatorType",
    value: function setTechnicalIndicatorType(technicalIndicatorType, isOverride, tag) {
      this._chartPane.setTechnicalIndicatorType(technicalIndicatorType, isOverride, tag);
    }
    /**
     * 创建一个技术指标
     * @param type
     * @param options
     * @returns {string|null}
     */

  }, {
    key: "createPane",
    value: function createPane(type, options) {
      return this._chartPane.createPane(type, options);
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
     * @param technicalIndicator
     * @param tag
     */

  }, {
    key: "removeTechnicalIndicator",
    value: function removeTechnicalIndicator(technicalIndicator, tag) {
      this._chartPane.removeTechnicalIndicator(technicalIndicator, tag);
    }
    /**
     * 添加图形标记
     * @param type
     */

  }, {
    key: "addGraphicMark",
    value: function addGraphicMark(type) {
      var graphicMarkMapping = this._chartPane.chartData().graphicMarkMapping();

      if (!(type in graphicMarkMapping)) {
        {
          console.warn('Graphic mark type not found!!!');
        }

        return;
      }

      this._chartPane.addGraphicMark(type);
    }
    /**
     * 移除所有标记图形
     */

  }, {
    key: "removeAllGraphicMark",
    value: function removeAllGraphicMark() {
      this._chartPane.chartData().clearGraphicMark();
    }
    /**
     * 设置是否可以缩放
     * @param enabled
     */

  }, {
    key: "setZoomEnabled",
    value: function setZoomEnabled(enabled) {
      this._chartPane.chartData().setZoomEnabled(enabled);
    }
    /**
     * 是否可以缩放
     * @return {boolean}
     */

  }, {
    key: "isZoomEnabled",
    value: function isZoomEnabled() {
      return this._chartPane.chartData().zoomEnabled();
    }
    /**
     * 设置是否可以拖拽滚动
     * @param enabled
     */

  }, {
    key: "setScrollEnabled",
    value: function setScrollEnabled(enabled) {
      this._chartPane.chartData().setScrollEnabled(enabled);
    }
    /**
     * 是否可以拖拽滚动
     * @return {boolean}
     */

  }, {
    key: "isScrollEnabled",
    value: function isScrollEnabled() {
      return this._chartPane.chartData().scrollEnabled();
    }
    /**
     * 订阅绘制事件
     * @param type
     * @param callback
     */

  }, {
    key: "subscribeDrawAction",
    value: function subscribeDrawAction(type, callback) {
      var delegate = this._chartPane.chartData().drawActionDelegate(type);

      if (!delegate) {
        {
          console.warn('Draw action type does not exist!!!');
        }

        return;
      }

      delegate.subscribe(callback);
    }
    /**
     * 取消订阅绘制事件
     * @param type
     * @param callback
     */

  }, {
    key: "unsubscribeDrawAction",
    value: function unsubscribeDrawAction(type, callback) {
      var delegate = this._chartPane.chartData().drawActionDelegate(type);

      if (!delegate) {
        {
          console.warn('Draw action type does not exist!!!');
        }

        return;
      }

      delegate.unsubscribe(callback);
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
    value: function getConvertPictureUrl(includeFloatLayer, includeGraphicMark) {
      var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'jpeg';
      var backgroundColor = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '#333333';

      if (type !== 'png' && type !== 'jpeg' && type !== 'bmp') {
        {
          console.warn('Picture format only supports jpeg, png and bmp!!!');
        }

        return;
      }

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
  return '6.0.0';
}
/**
 * 初始化
 * @param ds
 * @param style
 * @returns {Chart}
 */


function init(ds) {
  var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var errorMessage = 'Chart version is 6.0.0. Root dom is null, can not initialize the chart!!!';
  var container = ds;

  if (!container) {
    {
      console.warn(errorMessage);
    }

    return null;
  }

  if (typeof container === 'string') {
    container = document.getElementById(ds) || document.getElementsByClassName(ds);
  }

  if (!container) {
    {
      console.warn(errorMessage);
    }

    return null;
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
