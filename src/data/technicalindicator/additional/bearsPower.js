import TechnicalIndicator, { TechnicalIndicatorSeries } from '../TechnicalIndicator'

import { BEARP } from '../defaultTechnicalIndicatorType'

export default class BearsPower extends TechnicalIndicator {
    constructor() {
        super({
            name: BEARP,
            series: TechnicalIndicatorSeries.PRICE,
            precision: 2,
            shouldCheckParamCount: false,
        })

        this.setCalcParams([13])
    }

    regeneratePlots(params) {
        return params.map(p => {
            return { key: `bearp${p}`, type: 'line' }
        })
    }

    calcTechnicalIndicator(dataList, calcParams, plots) {
        const oldEmas = []
        return dataList.map((kLineData, i) => {
            const ema = {}
            const close = kLineData.close

            calcParams.forEach((param, j) => {
                let emaValue
                if (i === 0) {
                    emaValue = close
                } else {
                    emaValue = (2 * close + (param - 1) * oldEmas[j]) / (param + 1)
                }
                ema[plots[j].key] = kLineData.low - emaValue
                oldEmas[j] = emaValue
            })

            return ema
        })
    }
}
