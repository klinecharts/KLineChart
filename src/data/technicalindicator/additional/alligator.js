import TechnicalIndicator from '../TechnicalIndicator'
import { ALG } from '../defaultTechnicalIndicatorType'
// TODO: finish it
export default class AlligatorIndicator extends TechnicalIndicator {
	constructor() {
		super({
			name: ALG,
			calcParams: [13, 8, 8, 5, 5, 3],
			shouldCheckParamCount: true,
			plots: [
				// { key: 'up', title: 'up: ', type: 'line' },
				// { key: 'down', title: 'down: ', type: 'line' }
			]
		})
	}

	calcTechnicalIndicator(kLineDataList, calcParams) {
		const result = []
		return result
	}
}
