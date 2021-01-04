/**
 * @license
 * KLineChart v6.1.0
 * Copyright (c) 2019 lihu.
 * Licensed under Apache License 2.0 https://www.apache.org/licenses/LICENSE-2.0
 */
(function (factory) {
typeof define === 'function' && define.amd ? define(factory) :
factory();
}((function () { 'use strict';

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
 * 成交均线
 */
var averagePrice = {
  name: 'AVP',
  series: 'price',
  precision: 2,
  plots: [{
    key: 'avp',
    title: 'AVP',
    type: 'line'
  }],
  calcTechnicalIndicator: function calcTechnicalIndicator(dataList) {
    var totalTurnover = 0;
    var totalVolume = 0;
    return dataList.map(function (kLineData) {
      var avp = {};
      var turnover = kLineData.turnover || 0;
      var volume = kLineData.volume || 0;
      totalTurnover += turnover;
      totalVolume += volume;

      if (totalVolume !== 0) {
        avp.avp = totalTurnover / totalVolume;
      }

      return avp;
    });
  }
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
 * 多空指标
 * 公式: BBI = (MA(CLOSE, M) + MA(CLOSE, N) + MA(CLOSE, O) + MA(CLOSE, P)) / 4
 *
 */
var bullAndBearIndex = {
  name: 'BBI',
  series: 'price',
  precision: 2,
  calcParams: [3, 6, 12, 24],
  shouldCheckParamCount: true,
  shouldOhlc: true,
  plots: [{
    key: 'bbi',
    title: 'BBI',
    type: 'line'
  }],
  calcTechnicalIndicator: function calcTechnicalIndicator(kLineDataList, calcParams) {
    var maxParam = Math.max.apply(null, calcParams);
    var closeSums = [];
    var mas = [];
    return kLineDataList.map(function (kLineData, i) {
      var bbi = {};
      var close = kLineData.close;
      calcParams.forEach(function (param, index) {
        closeSums[index] = (closeSums[index] || 0) + close;

        if (i >= param - 1) {
          mas[index] = closeSums[index] / param;
          closeSums[index] -= kLineDataList[i - (param - 1)].close;
        }
      });

      if (i >= maxParam - 1) {
        var maSum = 0;
        mas.forEach(function (ma) {
          maSum += ma;
        });
        bbi.bbi = maSum / 4;
      }

      return bbi;
    });
  }
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
 * DMA
 * 公式：DIF:MA(CLOSE,N1)-MA(CLOSE,N2);DIFMA:MA(DIF,M)
 */
var differentOfMovingAverage = {
  name: 'DMA',
  calcParams: [10, 50, 10],
  plots: [{
    key: 'dma',
    title: 'DMA',
    type: 'line'
  }, {
    key: 'ama',
    title: 'AMA',
    type: 'line'
  }],
  calcTechnicalIndicator: function calcTechnicalIndicator(dataList, calcParams) {
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
 * DMI
 *
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
 *
 */
var directionalMovementIndex = {
  name: 'DMI',
  calcParams: [14, 6],
  plots: [{
    key: 'pdi',
    title: 'PDI',
    type: 'line'
  }, {
    key: 'mdi',
    title: 'MDI',
    type: 'line'
  }, {
    key: 'adx',
    title: 'ADX',
    type: 'line'
  }, {
    key: 'adxr',
    title: 'ADXR',
    type: 'line'
  }],
  calcTechnicalIndicator: function calcTechnicalIndicator(dataList, calcParams) {
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
 *
 * EMV 简易波动指标
 * 公式：
 * A=（今日最高+今日最低）/2
 * B=（前日最高+前日最低）/2
 * C=今日最高-今日最低
 * EM=（A-B）*C/今日成交额
 * EMV=N日内EM的累和
 * MAEMV=EMV的M日的简单移动平均
 *
 */
var easeOfMovementValue = {
  name: 'EMV',
  calcParams: [14, 9],
  plots: [{
    key: 'emv',
    title: 'EMV',
    type: 'line'
  }, {
    key: 'maEmv',
    title: 'MAEMV',
    type: 'line'
  }],
  calcTechnicalIndicator: function calcTechnicalIndicator(dataList, calcParams) {
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
 * EMA 指数移动平均
 */
var exponentialMovingAverage = {
  name: 'EMA',
  series: 'price',
  calcParams: [6, 12, 20],
  precision: 2,
  shouldCheckParamCount: false,
  shouldOhlc: true,
  plots: [{
    key: 'ema6',
    title: 'EMA6',
    type: 'line'
  }, {
    key: 'ema12',
    title: 'EMA12',
    type: 'line'
  }, {
    key: 'ema20',
    title: 'EMA20',
    type: 'line'
  }],
  regeneratePlots: function regeneratePlots(params) {
    return params.map(function (p) {
      return {
        key: "ema".concat(p),
        title: "EMA".concat(p),
        type: 'line'
      };
    });
  },
  calcTechnicalIndicator: function calcTechnicalIndicator(dataList, calcParams, plots) {
    var oldEmas = [];
    return dataList.map(function (kLineData, i) {
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
      return ema;
    });
  }
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
 * MA 移动平均
 */
var movingAverage = {
  name: 'MA',
  series: 'price',
  calcParams: [5, 10, 30, 60],
  precision: 2,
  shouldCheckParamCount: false,
  shouldOhlc: true,
  plots: [{
    key: 'ma5',
    title: 'MA5',
    type: 'line'
  }, {
    key: 'ma10',
    title: 'MA10',
    type: 'line'
  }, {
    key: 'ma30',
    title: 'MA30',
    type: 'line'
  }, {
    key: 'ma60',
    title: 'MA60',
    type: 'line'
  }],
  regeneratePlots: function regeneratePlots(params) {
    return params.map(function (p) {
      return {
        key: "ma".concat(p),
        title: "MA".concat(p),
        type: 'line'
      };
    });
  },
  calcTechnicalIndicator: function calcTechnicalIndicator(dataList, calcParams, plots) {
    var closeSums = [];
    return dataList.map(function (kLineData, i) {
      var ma = {};
      var close = kLineData.close;
      calcParams.forEach(function (param, j) {
        closeSums[j] = (closeSums[j] || 0) + close;

        if (i >= param - 1) {
          ma[plots[j].key] = closeSums[j] / param;
          closeSums[j] -= dataList[i - (param - 1)].close;
        }
      });
      return ma;
    });
  }
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
 * MACD：参数快线移动平均、慢线移动平均、移动平均，
 * 默认参数值12、26、9。
 * 公式：⒈首先分别计算出收盘价12日指数平滑移动平均线与26日指数平滑移动平均线，分别记为EMA(12）与EMA(26）。
 * ⒉求这两条指数平滑移动平均线的差，即：DIFF=EMA（SHORT）－EMA（LONG）。
 * ⒊再计算DIFF的M日的平均的指数平滑移动平均线，记为DEA。
 * ⒋最后用DIFF减DEA，得MACD。MACD通常绘制成围绕零轴线波动的柱形图。MACD柱状大于0涨颜色，小于0跌颜色。
 */
var movingAverageConvergenceDivergence = {
  name: 'MACD',
  calcParams: [12, 26, 9],
  baseValue: 0,
  plots: [{
    key: 'diff',
    title: 'DIFF',
    type: 'line'
  }, {
    key: 'dea',
    title: 'DEA',
    type: 'line'
  }, {
    key: 'macd',
    title: 'MACD',
    type: 'bar',
    color: function color(data, options) {
      var currentData = data.currentData;
      var macd = (currentData.technicalIndicatorData || {}).macd;

      if (macd > 0) {
        return options.bar.upColor;
      } else if (macd < 0) {
        return options.bar.downColor;
      } else {
        return options.bar.noChangeColor;
      }
    },
    isStroke: function isStroke(data) {
      var preData = data.preData,
          currentData = data.currentData;
      var macd = (currentData.technicalIndicatorData || {}).macd;
      var preMacd = (preData.technicalIndicatorData || {}).macd;
      return preMacd < macd;
    }
  }],
  calcTechnicalIndicator: function calcTechnicalIndicator(dataList, calcParams) {
    var emaShort;
    var emaLong;
    var oldEmaShort = 0;
    var oldEmaLong = 0;
    var dea = 0;
    var oldDea = 0;
    var macd = 0;
    return dataList.map(function (kLineData, i) {
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
      return {
        diff: diff,
        dea: dea,
        macd: macd
      };
    });
  }
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
 * sma
 */
var simpleMovingAverage = {
  name: 'SMA',
  calcParams: [12, 2],
  series: 'price',
  precision: 2,
  plots: [{
    key: 'sma',
    title: 'SMA',
    type: 'line'
  }],
  shouldCheckParamCount: true,
  shouldOhlc: true,
  calcTechnicalIndicator: function calcTechnicalIndicator(kLineDataList, calcParams) {
    var oldSma = 0;
    return kLineDataList.map(function (kLineData, i) {
      var sma = {};
      var close = kLineData.close;

      if (i === 0) {
        sma.sma = close;
      } else {
        sma.sma = (close * calcParams[1] + oldSma * (calcParams[0] - calcParams[1] + 1)) / (calcParams[0] + 1);
      }

      oldSma = sma.sma;
      return sma;
    });
  }
};

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http:*www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * trix
 *
 * TR=收盘价的N日指数移动平均的N日指数移动平均的N日指数移动平均；
 * TRIX=(TR-昨日TR)/昨日TR*100；
 * MATRIX=TRIX的M日简单移动平均；
 * 默认参数N设为12，默认参数M设为20；
 * 默认参数12、20
 * 公式：MTR:=EMA(EMA(EMA(CLOSE,N),N),N)
 * TRIX:(MTR-REF(MTR,1))/REF(MTR,1)*100;
 * TRMA:MA(TRIX,M)
 *
 */
var tripleExponentiallySmoothedAverage = {
  name: 'TRIX',
  calcParams: [12, 20],
  plots: [{
    key: 'trix',
    title: 'TRIX',
    type: 'line'
  }, {
    key: 'maTrix',
    title: 'MATRIX',
    type: 'line'
  }],
  calcTechnicalIndicator: function calcTechnicalIndicator(dataList, calcParams) {
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
 * BRAR
 * 默认参数是26。
 * 公式N日BR=N日内（H－CY）之和除以N日内（CY－L）之和*100，
 * 其中，H为当日最高价，L为当日最低价，CY为前一交易日的收盘价，N为设定的时间参数。
 * N日AR=(N日内（H－O）之和除以N日内（O－L）之和)*100，
 * 其中，H为当日最高价，L为当日最低价，O为当日开盘价，N为设定的时间参数
 *
 */
var brar = {
  name: 'BRAR',
  calcParams: [26],
  plots: [{
    key: 'br',
    title: 'BR',
    type: 'line'
  }, {
    key: 'ar',
    title: 'AR',
    type: 'line'
  }],
  calcTechnicalIndicator: function calcTechnicalIndicator(dataList, calcParams) {
    var hcy = 0;
    var cyl = 0;
    var ho = 0;
    var ol = 0;
    return dataList.map(function (kLineData, i) {
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

      return brar;
    });
  }
};

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http:*www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
 *
 */
var currentRatio = {
  name: 'CR',
  calcParams: [26, 10, 20, 40, 60],
  plots: [{
    key: 'cr',
    title: 'CR',
    type: 'line'
  }, {
    key: 'ma1',
    title: 'MA1',
    type: 'line'
  }, {
    key: 'ma2',
    title: 'MA2',
    type: 'line'
  }, {
    key: 'ma3',
    title: 'MA3',
    type: 'line'
  }, {
    key: 'ma4',
    title: 'MA4',
    type: 'line'
  }],
  calcTechnicalIndicator: function calcTechnicalIndicator(dataList, calcParams) {
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
 * mtm
 * 公式 MTM（N日）=C－CN
 */
var momentum = {
  name: 'MTM',
  calcParams: [6, 10],
  plots: [{
    key: 'mtm',
    title: 'MTM',
    type: 'line'
  }, {
    key: 'maMtm',
    title: 'MAMTM',
    type: 'line'
  }],
  calcTechnicalIndicator: function calcTechnicalIndicator(dataList, calcParams) {
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
 * PSY
 * 公式：PSY=N日内的上涨天数/N×100%。
 */
var psychologicalLine = {
  name: 'PSY',
  calcParams: [12, 6],
  plots: [{
    key: 'psy',
    title: 'PSY',
    type: 'line'
  }, {
    key: 'maPsy',
    title: 'MAPSY',
    type: 'line'
  }],
  calcTechnicalIndicator: function calcTechnicalIndicator(dataList, calcParams) {
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
 * 变动率指标
 * 公式：ROC = (CLOSE - REF(CLOSE, N)) / REF(CLOSE, N)
 */
var rateOfChange = {
  name: 'ROC',
  calcParams: [12, 6],
  shouldCheckParamCount: true,
  plots: [{
    key: 'roc',
    title: 'ROC',
    type: 'line'
  }, {
    key: 'maRoc',
    title: 'MAROC',
    type: 'line'
  }],
  calcTechnicalIndicator: function calcTechnicalIndicator(kLineDataList, calcParams) {
    var result = [];
    var rocSum = 0;
    kLineDataList.forEach(function (kLineData, i) {
      var roc = {};

      if (i >= calcParams[0] - 1) {
        var close = kLineData.close;
        var agoClose = kLineDataList[i - (calcParams[0] - 1)].close;

        if (agoClose !== 0) {
          roc.roc = (close - agoClose) / agoClose;
        } else {
          roc.roc = 0;
        }

        rocSum += roc.roc;

        if (i >= calcParams[0] - 1 + calcParams[1] - 1) {
          roc.maRoc = rocSum / calcParams[1];
          rocSum -= result[i - (calcParams[1] - 1)].roc;
        }
      }

      result.push(roc);
    });
    return result;
  }
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
 * VR
 * VR=（UVS+1/2PVS）/（DVS+1/2PVS）
 * 24天以来凡是股价上涨那一天的成交量都称为AV，将24天内的AV总和相加后称为UVS
 * 24天以来凡是股价下跌那一天的成交量都称为BV，将24天内的BV总和相加后称为DVS
 * 24天以来凡是股价不涨不跌，则那一天的成交量都称为CV，将24天内的CV总和相加后称为PVS
 *
 */
var volumeRatio = {
  name: 'VR',
  calcParams: [24, 30],
  plots: [{
    key: 'vr',
    title: 'VR',
    type: 'line'
  }, {
    key: 'maVr',
    title: 'MAVR',
    type: 'line'
  }],
  calcTechnicalIndicator: function calcTechnicalIndicator(dataList, calcParams) {
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
var awesomeOscillator = {
  name: 'AO',
  calcParams: [5, 34],
  shouldCheckParamCount: true,
  plots: [{
    key: 'ao',
    title: 'AO',
    type: 'bar',
    color: function color(data, technicalIndicatorOptions) {
      var preData = data.preData,
          currentData = data.currentData;
      var preAo = (preData.technicalIndicatorData || {}).ao;
      var ao = (currentData.technicalIndicatorData || {}).ao;

      if (ao > preAo) {
        return technicalIndicatorOptions.bar.upColor;
      } else {
        return technicalIndicatorOptions.bar.downColor;
      }
    },
    isStroke: function isStroke(data) {
      var preData = data.preData,
          currentData = data.currentData;
      var preAo = (preData.technicalIndicatorData || {}).ao;
      var ao = (currentData.technicalIndicatorData || {}).ao;
      return ao > preAo;
    }
  }],
  baseValue: 0,
  calcTechnicalIndicator: function calcTechnicalIndicator(kLineDataList, calcParams) {
    var maxParam = Math.max(calcParams[0], calcParams[1]);
    var shortSum = 0;
    var longSum = 0;
    var short = 0;
    var long = 0;
    return kLineDataList.map(function (kLineData, i) {
      var ao = {};
      var middle = (kLineData.low + kLineData.high) / 2;
      shortSum += middle;
      longSum += middle;

      if (i >= calcParams[0] - 1) {
        short = shortSum / calcParams[0];
        var agoKLineData = kLineDataList[i - (calcParams[0] - 1)];
        shortSum -= (agoKLineData.low + agoKLineData.high) / 2;
      }

      if (i >= calcParams[1] - 1) {
        long = longSum / calcParams[1];
        var _agoKLineData = kLineDataList[i - (calcParams[1] - 1)];
        longSum -= (_agoKLineData.low + _agoKLineData.high) / 2;
      }

      if (i >= maxParam - 1) {
        ao.ao = short - long;
      }

      return ao;
    });
  }
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
 * BIAS
 * 乖离率=[(当日收盘价-N日平均价)/N日平均价]*100%
 */
var bias = {
  name: 'BIAS',
  calcParams: [6, 12, 24],
  shouldCheckParamCount: false,
  plots: [{
    key: 'bias6',
    title: 'BIAS6',
    type: 'line'
  }, {
    key: 'bias12',
    title: 'BIAS12',
    type: 'line'
  }, {
    key: 'bias24',
    title: 'BIAS24',
    type: 'line'
  }],
  regeneratePlots: function regeneratePlots(params) {
    return params.map(function (p) {
      return {
        key: "bias".concat(p),
        title: "BIAS".concat(p),
        type: 'line'
      };
    });
  },
  calcTechnicalIndicator: function calcTechnicalIndicator(dataList, calcParams, plots) {
    var closeSums = [];
    return dataList.map(function (kLineData, i) {
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
      return bias;
    });
  }
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
 * CCI
 * CCI（N日）=（TP－MA）÷MD÷0.015
 * 其中，TP=（最高价+最低价+收盘价）÷3
 * MA=近N日收盘价的累计之和÷N
 * MD=近N日（MA－收盘价）的累计之和÷N
 *
 */
var commodityChannelIndex = {
  name: 'CCI',
  calcParams: [13],
  plots: [{
    key: 'cci',
    title: 'CCI',
    type: 'line'
  }],
  calcTechnicalIndicator: function calcTechnicalIndicator(dataList, calcParams) {
    var p = calcParams[0] - 1;
    var closeSum = 0;
    var md;
    var maSubCloseSum = 0;
    var maList = [];
    return dataList.map(function (kLineData, i) {
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

      return cci;
    });
  }
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
 * RSI
 * N日RSI = N日内收盘涨幅的平均值/(N日内收盘涨幅均值+N日内收盘跌幅均值) ×100%
 */
var relativeStrengthIndex = {
  name: 'RSI',
  calcParams: [6, 12, 24],
  shouldCheckParamCount: false,
  plots: [{
    key: 'rsi6',
    title: 'RSI6',
    type: 'line'
  }, {
    key: 'rsi12',
    title: 'RSI12',
    type: 'line'
  }, {
    key: 'rsi24',
    title: 'RSI24',
    type: 'line'
  }],
  calcTechnicalIndicator: function calcTechnicalIndicator(dataList, calcParams, plots) {
    var sumCloseAs = [];
    var sumCloseBs = [];
    return dataList.map(function (kLineData, i) {
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
      return rsi;
    });
  }
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
 * 计算n周期内最高和最低
 * @param dataList
 * @returns {{ln: number, hn: number}}
 */
function calcHnLn() {
  var dataList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var hn = Number.MIN_SAFE_INTEGER;
  var ln = Number.MAX_SAFE_INTEGER;
  dataList.forEach(function (data) {
    hn = Math.max(data.high, hn);
    ln = Math.min(data.low, ln);
  });
  return {
    hn: hn,
    ln: ln
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
/**
 * KDJ
 *
 * 当日K值=2/3×前一日K值+1/3×当日RSV
 * 当日D值=2/3×前一日D值+1/3×当日K值
 * 若无前一日K 值与D值，则可分别用50来代替。
 * J值=3*当日K值-2*当日D值
 */

var stockIndicatorKDJ = {
  name: 'KDJ',
  calcParams: [9, 3, 3],
  plots: [{
    key: 'k',
    title: 'K',
    type: 'line'
  }, {
    key: 'd',
    title: 'D',
    type: 'line'
  }, {
    key: 'j',
    title: 'J',
    type: 'line'
  }],
  calcTechnicalIndicator: function calcTechnicalIndicator(dataList, calcParams) {
    var result = [];
    dataList.forEach(function (kLineData, i) {
      var kdj = {};
      var close = kLineData.close;

      if (i >= calcParams[0] - 1) {
        var lhn = calcHnLn(dataList.slice(i - (calcParams[0] - 1), i + 1));
        var ln = lhn.ln;
        var hn = lhn.hn;
        var hnSubLn = hn - ln;
        var rsv = (close - ln) / (hnSubLn === 0 ? 1 : hnSubLn) * 100;
        kdj.k = ((calcParams[1] - 1) * (result[i - 1].k || 50) + rsv) / calcParams[1];
        kdj.d = ((calcParams[2] - 1) * (result[i - 1].d || 50) + kdj.k) / calcParams[2];
        kdj.j = 3.0 * kdj.k - 2.0 * kdj.d;
      }

      result.push(kdj);
    });
    return result;
  }
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
 * WR
 * 公式 WR(N) = 100 * [ HIGH(N)-C ] / [ HIGH(N)-LOW(N) ]
 */

var williamsR = {
  name: 'WR',
  calcParams: [6, 10, 14],
  shouldCheckParamCount: false,
  plots: [{
    key: 'wr1',
    title: 'WR1',
    type: 'line'
  }, {
    key: 'wr2',
    title: 'WR2',
    type: 'line'
  }, {
    key: 'wr3',
    title: 'WR3',
    type: 'line'
  }],
  regeneratePlots: function regeneratePlots(params) {
    return params.map(function (_, i) {
      return {
        key: "wr".concat(i + 1),
        title: "WR".concat(i + 1),
        type: 'line'
      };
    });
  },
  calcTechnicalIndicator: function calcTechnicalIndicator(dataList, calcParams, plots) {
    return dataList.map(function (kLineData, i) {
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
      return wr;
    });
  }
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
 * 计算布林指标中的标准差
 * @param dataList
 * @param ma
 * @return {number}
 */
function getBollMd(dataList, ma) {
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
/**
 * BOLL
 */


var bollingerBands = {
  name: 'BOLL',
  series: 'price',
  calcParams: [20],
  precision: 2,
  shouldOhlc: true,
  plots: [{
    key: 'up',
    title: 'UP',
    type: 'line'
  }, {
    key: 'mid',
    title: 'MID',
    type: 'line'
  }, {
    key: 'dn',
    title: 'DN',
    type: 'line'
  }],
  calcTechnicalIndicator: function calcTechnicalIndicator(dataList, calcParams) {
    var p = calcParams[0] - 1;
    var closeSum = 0;
    return dataList.map(function (kLineData, i) {
      var close = kLineData.close;
      var boll = {};
      closeSum += close;

      if (i >= p) {
        boll.mid = closeSum / calcParams[0];
        var md = getBollMd(dataList.slice(i - p, i + 1), boll.mid);
        boll.up = boll.mid + 2 * md;
        boll.dn = boll.mid - 2 * md;
        closeSum -= dataList[i - p].close;
      }

      return boll;
    });
  }
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
var stopAndReverse = {
  name: 'SAR',
  series: 'price',
  calcParams: [2, 2, 20],
  precision: 2,
  shouldOhlc: true,
  plots: [{
    key: 'sar',
    title: 'SAR',
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
  }],
  calcTechnicalIndicator: function calcTechnicalIndicator(dataList, calcParams) {
    var startAf = calcParams[0] / 100;
    var step = calcParams[1] / 100;
    var maxAf = calcParams[2] / 100; // 加速因子

    var af = startAf; // 极值

    var ep = -100; // 判断是上涨还是下跌  false：下跌

    var isIncreasing = false;
    var sar = 0;
    return dataList.map(function (kLineData, i) {
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

      return {
        sar: sar
      };
    });
  }
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
 * OBV
 * VA = V × [（C - L）- （H - C）]/（H - C）
 */
var onBalanceVolume = {
  name: 'OBV',
  calcParams: [30],
  plots: [{
    key: 'obv',
    title: 'OBV',
    type: 'line'
  }, {
    key: 'maObv',
    title: 'MAOBV',
    type: 'line'
  }],
  calcTechnicalIndicator: function calcTechnicalIndicator(dataList, calcParams) {
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
 * 价量趋势指标
 * 公式:
 * X = (CLOSE - REF(CLOSE, 1)) / REF(CLOSE, 1) * VOLUME
 * PVT = SUM(X)
 *
 */
var priceAndVolumeTrend = {
  name: 'PVT',
  plots: [{
    key: 'pvt',
    title: 'PVT',
    type: 'line'
  }],
  calcTechnicalIndicator: function calcTechnicalIndicator(kLineDataList) {
    var sum = 0;
    return kLineDataList.map(function (kLineData, i) {
      var pvt = {};

      if (i > 0) {
        var close = kLineData.close;
        var volume = kLineData.volume;
        var preClose = kLineDataList[i - 1].close;
        var x = 0;

        if (preClose !== 0) {
          x = (close - preClose) / preClose * volume;
        }

        sum += x;
        pvt.pvt = sum;
      }

      return pvt;
    });
  }
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
var volume = {
  name: 'VOL',
  series: 'volume',
  calcParams: [5, 10, 20],
  shouldCheckParamCount: false,
  shouldFormatBigNumber: true,
  precision: 0,
  baseValue: 0,
  minValue: 0,
  plots: [{
    key: 'ma5',
    title: 'MA5',
    type: 'line'
  }, {
    key: 'ma10',
    title: 'MA10',
    type: 'line'
  }, {
    key: 'ma20',
    title: 'MA20',
    type: 'line'
  }, {
    key: 'volume',
    type: 'bar',
    color: function color(data, options) {
      var kLineData = data.currentData.kLineData || {};

      if (kLineData.close > kLineData.open) {
        return options.bar.upColor;
      } else if (kLineData.close < kLineData.open) {
        return options.bar.downColor;
      }

      return options.bar.noChangeColor;
    }
  }],
  regeneratePlots: function regeneratePlots(params) {
    var plots = params.map(function (p) {
      return {
        key: "ma".concat(p),
        title: "MA".concat(p),
        type: 'line'
      };
    });
    plots.push({
      key: 'volume',
      type: 'bar',
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
  },
  calcTechnicalIndicator: function calcTechnicalIndicator(dataList, calcParams, plots) {
    var volSums = [];
    return dataList.map(function (kLineData, i) {
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
      return vol;
    });
  }
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
var extension = {
  technicalIndicatorExtensions: {},
  markExtensions: {},
  addTechnicalIndicator: function addTechnicalIndicator(technicalIndicators) {
    var _this = this;

    [].concat(technicalIndicators).forEach(function (technicalIndicator) {
      if (technicalIndicator.name) {
        _this.technicalIndicatorExtensions[technicalIndicator.name] = technicalIndicator;
      }
    });
  },
  addMark: function addMark(marks) {
    var _this2 = this;

    [].concat(marks).forEach(function (mark) {
      if (mark.name) {
        _this2.markExtensions[mark.name] = mark;
      }
    });
  }
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

extension.addTechnicalIndicator([averagePrice, bullAndBearIndex, differentOfMovingAverage, directionalMovementIndex, easeOfMovementValue, exponentialMovingAverage, movingAverage, movingAverageConvergenceDivergence, simpleMovingAverage, tripleExponentiallySmoothedAverage, brar, currentRatio, momentum, psychologicalLine, rateOfChange, volumeRatio, awesomeOscillator, bias, commodityChannelIndex, relativeStrengthIndex, stockIndicatorKDJ, williamsR, bollingerBands, stopAndReverse, onBalanceVolume, priceAndVolumeTrend, volume]); // export { version, init, dispose }

})));
//# sourceMappingURL=klinecharts.blank.js.map
