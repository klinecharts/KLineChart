/**
 * Copyright (c) 2019 lihu
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { TechnicalIndicatorType } from '../options/technicalIndicatorParamOptions'

export const defaultPrecisionOptions = {
  price: 2,
  volume: 0,
  [TechnicalIndicatorType.NO]: 2,
  [TechnicalIndicatorType.MA]: 2,
  [TechnicalIndicatorType.EMA]: 2,
  [TechnicalIndicatorType.VOL]: 0,
  [TechnicalIndicatorType.MACD]: 2,
  [TechnicalIndicatorType.BOLL]: 2,
  [TechnicalIndicatorType.KDJ]: 2,
  [TechnicalIndicatorType.RSI]: 2,
  [TechnicalIndicatorType.BIAS]: 2,
  [TechnicalIndicatorType.BRAR]: 4,
  [TechnicalIndicatorType.CCI]: 4,
  [TechnicalIndicatorType.DMI]: 4,
  [TechnicalIndicatorType.CR]: 2,
  [TechnicalIndicatorType.PSY]: 2,
  [TechnicalIndicatorType.DMA]: 4,
  [TechnicalIndicatorType.TRIX]: 4,
  [TechnicalIndicatorType.OBV]: 4,
  [TechnicalIndicatorType.VR]: 4,
  [TechnicalIndicatorType.WR]: 4,
  [TechnicalIndicatorType.MTM]: 4,
  [TechnicalIndicatorType.EMV]: 4,
  [TechnicalIndicatorType.SAR]: 2
}
