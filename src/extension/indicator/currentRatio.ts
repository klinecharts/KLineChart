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

import type KLineData from '../../common/KLineData'
import { type Indicator, type IndicatorTemplate } from '../../component/Indicator'

interface Cr {
  cr?: number
  ma1?: number
  ma2?: number
  ma3?: number
  ma4?: number
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
 *
 */
const currentRatio: IndicatorTemplate<Cr> = {
  name: 'CR',
  shortName: 'CR',
  calcParams: [26, 10, 20, 40, 60],
  figures: [
    { key: 'cr', title: 'CR: ', type: 'line' },
    { key: 'ma1', title: 'MA1: ', type: 'line' },
    { key: 'ma2', title: 'MA2: ', type: 'line' },
    { key: 'ma3', title: 'MA3: ', type: 'line' },
    { key: 'ma4', title: 'MA4: ', type: 'line' }
  ],
  calc: (dataList: KLineData[], indicator: Indicator<Cr>) => {
    const params = indicator.calcParams as number[]

    const ma1ForwardPeriod = Math.ceil(params[1] / 2.5 + 1)
    const ma2ForwardPeriod = Math.ceil(params[2] / 2.5 + 1)
    const ma3ForwardPeriod = Math.ceil(params[3] / 2.5 + 1)
    const ma4ForwardPeriod = Math.ceil(params[4] / 2.5 + 1)
    let ma1Sum = 0
    const ma1List: number[] = []
    let ma2Sum = 0
    const ma2List: number[] = []
    let ma3Sum = 0
    const ma3List: number[] = []
    let ma4Sum = 0
    const ma4List: number[] = []
    const result: Cr[] = []
    dataList.forEach((kLineData: KLineData, i: number) => {
      const cr: Cr = {}
      const prevData = dataList[i - 1] ?? kLineData
      const prevMid = (prevData.high + prevData.close + prevData.low + prevData.open) / 4

      const highSubPreMid = Math.max(0, kLineData.high - prevMid)

      const preMidSubLow = Math.max(0, prevMid - kLineData.low)

      if (i >= params[0] - 1) {
        if (preMidSubLow !== 0) {
          cr.cr = highSubPreMid / preMidSubLow * 100
        } else {
          cr.cr = 0
        }
        ma1Sum += cr.cr
        ma2Sum += cr.cr
        ma3Sum += cr.cr
        ma4Sum += cr.cr
        if (i >= params[0] + params[1] - 2) {
          ma1List.push(ma1Sum / params[1])
          if (i >= params[0] + params[1] + ma1ForwardPeriod - 3) {
            cr.ma1 = ma1List[ma1List.length - 1 - ma1ForwardPeriod]
          }
          ma1Sum -= (result[i - (params[1] - 1)].cr ?? 0)
        }
        if (i >= params[0] + params[2] - 2) {
          ma2List.push(ma2Sum / params[2])
          if (i >= params[0] + params[2] + ma2ForwardPeriod - 3) {
            cr.ma2 = ma2List[ma2List.length - 1 - ma2ForwardPeriod]
          }
          ma2Sum -= (result[i - (params[2] - 1)].cr ?? 0)
        }
        if (i >= params[0] + params[3] - 2) {
          ma3List.push(ma3Sum / params[3])
          if (i >= params[0] + params[3] + ma3ForwardPeriod - 3) {
            cr.ma3 = ma3List[ma3List.length - 1 - ma3ForwardPeriod]
          }
          ma3Sum -= (result[i - (params[3] - 1)].cr ?? 0)
        }
        if (i >= params[0] + params[4] - 2) {
          ma4List.push(ma4Sum / params[4])
          if (i >= params[0] + params[4] + ma4ForwardPeriod - 3) {
            cr.ma4 = ma4List[ma4List.length - 1 - ma4ForwardPeriod]
          }
          ma4Sum -= (result[i - (params[4] - 1)].cr ?? 0)
        }
      }
      result.push(cr)
    })
    return result
  }
}
export default currentRatio
