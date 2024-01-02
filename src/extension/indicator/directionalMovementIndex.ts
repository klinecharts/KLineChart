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

import type KLineData from '../../common/KLineData'
import { type Indicator, type IndicatorTemplate } from '../../component/Indicator'

interface Dmi {
  pdi?: number
  mdi?: number
  adx?: number
  adxr?: number
}

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
const directionalMovementIndex: IndicatorTemplate<Dmi> = {
  name: 'DMI',
  shortName: 'DMI',
  calcParams: [14, 6],
  figures: [
    { key: 'pdi', title: 'PDI: ', type: 'line' },
    { key: 'mdi', title: 'MDI: ', type: 'line' },
    { key: 'adx', title: 'ADX: ', type: 'line' },
    { key: 'adxr', title: 'ADXR: ', type: 'line' }
  ],
  calc: (dataList: KLineData[], indicator: Indicator<Dmi>) => {
    const params = indicator.calcParams as number[]
    let trSum = 0
    let hSum = 0
    let lSum = 0
    let mtr = 0
    let dmp = 0
    let dmm = 0
    let dxSum = 0
    let adx = 0
    const result: Dmi[] = []
    dataList.forEach((kLineData: KLineData, i: number) => {
      const dmi: Dmi = {}
      const prevKLineData = dataList[i - 1] ?? kLineData
      const preClose = prevKLineData.close
      const high = kLineData.high
      const low = kLineData.low
      const hl = high - low
      const hcy = Math.abs(high - preClose)
      const lcy = Math.abs(preClose - low)
      const hhy = high - prevKLineData.high
      const lyl = prevKLineData.low - low
      const tr = Math.max(Math.max(hl, hcy), lcy)
      const h = (hhy > 0 && hhy > lyl) ? hhy : 0
      const l = (lyl > 0 && lyl > hhy) ? lyl : 0
      trSum += tr
      hSum += h
      lSum += l
      if (i >= params[0] - 1) {
        if (i > params[0] - 1) {
          mtr = mtr - mtr / params[0] + tr
          dmp = dmp - dmp / params[0] + h
          dmm = dmm - dmm / params[0] + l
        } else {
          mtr = trSum
          dmp = hSum
          dmm = lSum
        }
        let pdi = 0
        let mdi = 0
        if (mtr !== 0) {
          pdi = dmp * 100 / mtr
          mdi = dmm * 100 / mtr
        }
        dmi.pdi = pdi
        dmi.mdi = mdi
        let dx = 0
        if (mdi + pdi !== 0) {
          dx = Math.abs((mdi - pdi)) / (mdi + pdi) * 100
        }
        dxSum += dx
        if (i >= params[0] * 2 - 2) {
          if (i > params[0] * 2 - 2) {
            adx = (adx * (params[0] - 1) + dx) / params[0]
          } else {
            adx = dxSum / params[0]
          }
          dmi.adx = adx
          if (i >= params[0] * 2 + params[1] - 3) {
            dmi.adxr = ((result[i - (params[1] - 1)].adx ?? 0) + adx) / 2
          }
        }
      }
      result.push(dmi)
    })
    return result
  }
}

export default directionalMovementIndex
