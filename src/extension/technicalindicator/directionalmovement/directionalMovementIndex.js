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
export default {
  name: 'DMI',
  calcParams: [14, 6],
  plots: [
    { key: 'pdi', title: 'PDI', type: 'line' },
    { key: 'mdi', title: 'MDI', type: 'line' },
    { key: 'adx', title: 'ADX', type: 'line' },
    { key: 'adxr', title: 'ADXR', type: 'line' }
  ],
  calcTechnicalIndicator: (dataList, calcParams) => {
    let trSum = 0
    const trList = []
    let dmpSum = 0
    const dmpList = []
    let dmmSum = 0
    const dmmList = []
    let dxSum = 0
    const dxList = []
    const result = []
    dataList.forEach((kLineData, i) => {
      const dmi = {}
      if (i > 0) {
        const preClose = dataList[i - 1].close
        const high = kLineData.high
        const low = kLineData.low
        const hl = high - low
        const hcy = Math.abs(high - preClose)
        const lcy = Math.abs(low - preClose)
        const hhy = high - dataList[i - 1].high
        const lyl = dataList[i - 1].low - low
        const tr = Math.max(Math.max(hl, hcy), lcy)
        trSum += tr
        trList.push(tr)

        const h = (hhy > 0.0 && hhy > lyl) ? hhy : 0.0
        dmpSum += h
        dmpList.push(h)

        const l = (lyl > 0 && lyl > hhy) ? lyl : 0.0
        dmmSum += l
        dmmList.push(l)
        if (i >= calcParams[0]) {
          let pdi
          let mdi
          if (trSum === 0) {
            pdi = 0
            mdi = 0
          } else {
            pdi = dmpSum * 100 / trSum
            mdi = dmmSum * 100 / trSum
          }
          let dx
          if (mdi + pdi === 0) {
            dx = 0
          } else {
            dx = Math.abs((mdi - pdi)) / (mdi + pdi) * 100
          }
          dxSum += dx
          dxList.push(dx)
          dmi.pdi = pdi
          dmi.mdi = mdi
          if (i >= calcParams[0] + calcParams[1] - 1) {
            const adx = dxSum / calcParams[1]
            dmi.adx = adx
            if (i >= calcParams[0] + calcParams[1] * 2 - 2) {
              dmi.adxr = (adx + result[i - (calcParams[1] - 1)].adx) / 2
            }
            dxSum -= dxList[i - (calcParams[0] + calcParams[1] - 1)]
          }
          trSum -= trList[i - calcParams[0]]
          dmpSum -= dmpList[i - calcParams[0]]
          dmmSum -= dmmList[i - calcParams[0]]
        }
      }
      result.push(dmi)
    })
    return result
  }
}
