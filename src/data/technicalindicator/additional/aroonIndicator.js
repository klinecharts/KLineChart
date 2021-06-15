import TechnicalIndicator from '../TechnicalIndicator'
import { ARO } from '../defaultTechnicalIndicatorType'

export default class AroonIndicator extends TechnicalIndicator {
	constructor() {
		super({
			name: ARO,
			calcParams: [14],
			shouldCheckParamCount: true,
			plots: [
				{ key: 'up', title: 'up: ', type: 'line' },
				{ key: 'down', title: 'down: ', type: 'line' }
			]
		})
	}

	calcTechnicalIndicator(kLineDataList, calcParams) {
		const result = []
		const period = calcParams[0]

		kLineDataList.forEach((kLineData, i) => {
			const aro = {}

			if (i <= period) {
				aro.up = 0
				aro.down = 0
				return result.push(aro)
			}

			const { lastMaxAgo, lastMinAgo } = getLastHighAndLowIndex(kLineDataList.slice(i - period, i))

			aro.up = ((period - lastMaxAgo) / period) * 100
			aro.down = ((period - lastMinAgo) / period) * 100

			result.push(aro)
		})

		return result
	}
}

const getLastHighAndLowIndex = (list) => {
	let lastMaxVal = list[0].high
	let lastMinVal = list[0].low
	let lastMaxIndex = 0
	let lastMinIndex = 0
	let lastMaxAgo = 0
	let lastMinAgo = 0

	list.forEach((kLineData, i) => {
		if (kLineData.high >= lastMaxVal) {
			lastMaxVal = kLineData.high
			lastMaxIndex = i
		}

		if (kLineData.low <= lastMinVal) {
			lastMinVal = kLineData.low
			lastMinIndex = i
		}

		lastMaxAgo = i - lastMaxIndex
		lastMinAgo = i - lastMinIndex
	})

	return {
		lastMaxAgo,
		lastMinAgo
	}
}