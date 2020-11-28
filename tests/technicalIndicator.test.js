import { describe, it } from 'mocha'
import { expect } from 'chai'

import commonCalc from '../src/data/technicalindicator/calcHnLn'
import DifferentOfMovingAverage from '../src/data/technicalindicator/directionalmovement/DifferentOfMovingAverage'
import DirectionalMovementIndex from '../src/data/technicalindicator/directionalmovement/DirectionalMovementIndex'
import EaseOfMovementValue from '../src/data/technicalindicator/directionalmovement/EaseOfMovementValue'
import ExponentialMovingAverage from '../src/data/technicalindicator/directionalmovement/ExponentialMovingAverage'
import MovingAverage from '../src/data/technicalindicator/directionalmovement/MovingAverage'
import MovingAverageConvergenceDivergence from '../src/data/technicalindicator/directionalmovement/MovingAverageConvergenceDivergence'
import TripleExponentiallySmoothedAverage from '../src/data/technicalindicator/directionalmovement/TripleExponentiallySmoothedAverage'
import Brar from '../src/data/technicalindicator/momentum/Brar'
import CurrentRatio from '../src/data/technicalindicator/momentum/CurrentRatio'
import Momentum from '../src/data/technicalindicator/momentum/Momentum'
import PsychologicalLine from '../src/data/technicalindicator/momentum/PsychologicalLine'
import VolumeRatio from '../src/data/technicalindicator/momentum/VolumeRatio'
import Bias from '../src/data/technicalindicator/oscillators/Bias'
import CommodityChannelIndex from '../src/data/technicalindicator/oscillators/CommodityChannelIndex'
import RelativeStrengthIndex from '../src/data/technicalindicator/oscillators/RelativeStrengthIndex'
import StockIndicatorKDJ from '../src/data/technicalindicator/oscillators/StockIndicatorKDJ'
import WilliamsR from '../src/data/technicalindicator/oscillators/WilliamsR'
import BollingerBands from '../src/data/technicalindicator/volatility/BollingerBands'
import StopAndReverse from '../src/data/technicalindicator/volatility/StopAndReverse'
import OnBalanceVolume from '../src/data/technicalindicator/volume/OnBalanceVolume'
import Volume from '../src/data/technicalindicator/volume/Volume'
import {
  createNewTechnicalIndicator,
  getTechnicalIndicatorTooltipData
} from '../src/data/technicalindicator/technicalIndicatorControl'
import TechnicalIndicator from '../src/data/technicalindicator/TechnicalIndicator'
import YAxis from '../src/component/YAxis'
import ChartData from '../src/data/ChartData'

function generatedKLineDataList () {
  const dataList = []
  for (let i = 0; i < 100; i++) {
    const prices = []
    for (let j = 0; j < 4; j++) {
      prices.push(Math.random() * 20 - 10 + 500)
    }
    prices.sort()
    const openIdx = +Math.round(Math.random() * 3).toFixed(0)
    let closeIdx = +Math.round(Math.random() * 2).toFixed(0)
    if (closeIdx === openIdx) {
      closeIdx++
    }
    dataList.push({
      open: prices[openIdx],
      close: prices[closeIdx],
      low: prices[0],
      high: prices[3],
      volume: Math.random() * 20 + 20,
      timestamp: Date.now()
    })
  }
  return dataList
}

function technicalIndicatorResultSizeCase (TechnicalIndicator) {
  it('should that the number of calculation results is consistent with the format of the original data', function () {
    const technicalIndicator = new TechnicalIndicator()
    const dataList = generatedKLineDataList()
    const result = technicalIndicator.calcTechnicalIndicator(dataList, technicalIndicator.calcParams)
    expect(result.length).to.equal(dataList.length)
  })
}

function technicalIndicatorNameCase (TechnicalIndicator, equalName) {
  it('should be the same name', function () {
    const technicalIndicator = new TechnicalIndicator()
    expect(technicalIndicator.name).to.equal(equalName)
  })
}

function technicalIndicatorCheckParamsCountCase (TechnicalIndicator, calcParams) {
  it('should check number of calculation parameters', function () {
    const technicalIndicator = new TechnicalIndicator()
    technicalIndicator.setCalcParams(calcParams)
    expect(technicalIndicator.calcParams).to.deep.not.equal(calcParams)
  })
}

function technicalIndicatorNoCheckParamsCountCase (TechnicalIndicator, calcParams) {
  it('should no be check number of calculation parameters', function () {
    const technicalIndicator = new TechnicalIndicator()
    technicalIndicator.setCalcParams(calcParams)
    expect(technicalIndicator.calcParams).to.deep.equal(calcParams)
  })
}

describe('technicalIndicator', function () {
  describe('calcHnLn', function () {
    it('should return the correct value', function () {
      const dataList = [
        { open: 10, low: 8, high: 16, close: 9, timestamp: Date.now() },
        { open: 7, low: 6, high: 80, close: 60, timestamp: Date.now() },
        { open: 80, low: 58, high: 90, close: 60, timestamp: Date.now() }
      ]
      expect(commonCalc(dataList)).to.deep.equal({ hn: 90, ln: 6 })
    })
  })

  describe('DMA', function () {
    technicalIndicatorResultSizeCase(DifferentOfMovingAverage)
    technicalIndicatorNameCase(DifferentOfMovingAverage, 'DMA')
    technicalIndicatorCheckParamsCountCase(DifferentOfMovingAverage, [1, 2, 3, 4, 5, 6, 7])
  })

  describe('DMI', function () {
    technicalIndicatorResultSizeCase(DirectionalMovementIndex)
    technicalIndicatorNameCase(DirectionalMovementIndex, 'DMI')
    technicalIndicatorCheckParamsCountCase(DirectionalMovementIndex, [1, 2, 3, 4, 5, 6, 7])
  })

  describe('EMV', function () {
    technicalIndicatorResultSizeCase(EaseOfMovementValue)
    technicalIndicatorNameCase(EaseOfMovementValue, 'EMV')
    technicalIndicatorCheckParamsCountCase(EaseOfMovementValue, [1, 2, 3, 4, 5, 6, 7])
  })

  describe('EMA', function () {
    technicalIndicatorResultSizeCase(ExponentialMovingAverage)
    technicalIndicatorNameCase(ExponentialMovingAverage, 'EMA')
    technicalIndicatorNoCheckParamsCountCase(ExponentialMovingAverage, [1, 2, 3, 4, 5, 6, 7])
  })

  describe('MA', function () {
    technicalIndicatorResultSizeCase(MovingAverage)
    technicalIndicatorNameCase(MovingAverage, 'MA')
    technicalIndicatorNoCheckParamsCountCase(MovingAverage, [1, 2, 3, 4, 5, 6, 7])
  })

  describe('MACD', function () {
    technicalIndicatorResultSizeCase(MovingAverageConvergenceDivergence)
    technicalIndicatorNameCase(MovingAverageConvergenceDivergence, 'MACD')
    technicalIndicatorCheckParamsCountCase(MovingAverageConvergenceDivergence, [1, 2, 3, 4, 5, 6, 7])
  })

  describe('TRIX', function () {
    technicalIndicatorResultSizeCase(TripleExponentiallySmoothedAverage)
    technicalIndicatorNameCase(TripleExponentiallySmoothedAverage, 'TRIX')
    technicalIndicatorCheckParamsCountCase(TripleExponentiallySmoothedAverage, [1, 2, 3, 4, 5, 6, 7])
  })

  describe('BRAR', function () {
    technicalIndicatorResultSizeCase(Brar)
    technicalIndicatorNameCase(Brar, 'BRAR')
    technicalIndicatorCheckParamsCountCase(Brar, [1, 2, 3, 4, 5, 6, 7])
  })

  describe('CR', function () {
    technicalIndicatorResultSizeCase(CurrentRatio)
    technicalIndicatorNameCase(CurrentRatio, 'CR')
    technicalIndicatorCheckParamsCountCase(CurrentRatio, [1, 2, 3, 4, 5, 6, 7])
  })

  describe('MTM', function () {
    technicalIndicatorResultSizeCase(Momentum)
    technicalIndicatorNameCase(Momentum, 'MTM')
    technicalIndicatorCheckParamsCountCase(Momentum, [1, 2, 3, 4, 5, 6, 7])
  })

  describe('PSY', function () {
    technicalIndicatorResultSizeCase(PsychologicalLine)
    technicalIndicatorNameCase(PsychologicalLine, 'PSY')
    technicalIndicatorCheckParamsCountCase(PsychologicalLine, [1, 2, 3, 4, 5, 6, 7])
  })

  describe('VR', function () {
    technicalIndicatorResultSizeCase(VolumeRatio)
    technicalIndicatorNameCase(VolumeRatio, 'VR')
    technicalIndicatorCheckParamsCountCase(VolumeRatio, [1, 2, 3, 4, 5, 6, 7])
  })

  describe('BIAS', function () {
    technicalIndicatorResultSizeCase(Bias)
    technicalIndicatorNameCase(Bias, 'BIAS')
    technicalIndicatorNoCheckParamsCountCase(Bias, [1, 2, 3, 4, 5, 6, 7])
  })

  describe('CCI', function () {
    technicalIndicatorResultSizeCase(CommodityChannelIndex)
    technicalIndicatorNameCase(CommodityChannelIndex, 'CCI')
    technicalIndicatorCheckParamsCountCase(CommodityChannelIndex, [1, 2, 3, 4, 5, 6, 7])
  })

  describe('RSI', function () {
    technicalIndicatorResultSizeCase(RelativeStrengthIndex)
    technicalIndicatorNameCase(RelativeStrengthIndex, 'RSI')
    technicalIndicatorNoCheckParamsCountCase(RelativeStrengthIndex, [1, 2, 3, 4, 5, 6, 7])
  })

  describe('KDJ', function () {
    technicalIndicatorResultSizeCase(StockIndicatorKDJ)
    technicalIndicatorNameCase(StockIndicatorKDJ, 'KDJ')
    technicalIndicatorCheckParamsCountCase(StockIndicatorKDJ, [1, 2, 3, 4, 5, 6, 7])
  })

  describe('WR', function () {
    technicalIndicatorResultSizeCase(WilliamsR)
    technicalIndicatorNameCase(WilliamsR, 'WR')
    technicalIndicatorCheckParamsCountCase(EaseOfMovementValue, [1, 2, 3, 4, 5, 6, 7])
  })

  describe('BOLL', function () {
    technicalIndicatorResultSizeCase(BollingerBands)
    technicalIndicatorNameCase(BollingerBands, 'BOLL')
    technicalIndicatorCheckParamsCountCase(BollingerBands, [1, 2, 3, 4, 5, 6, 7])
  })

  describe('SAR', function () {
    technicalIndicatorResultSizeCase(StopAndReverse)
    technicalIndicatorNameCase(StopAndReverse, 'SAR')
    technicalIndicatorCheckParamsCountCase(StopAndReverse, [1, 2, 3, 4, 5, 6, 7])
  })

  describe('OBV', function () {
    technicalIndicatorResultSizeCase(OnBalanceVolume)
    technicalIndicatorNameCase(OnBalanceVolume, 'OBV')
    technicalIndicatorCheckParamsCountCase(OnBalanceVolume, [1, 2, 3, 4, 5, 6, 7])
  })

  describe('VOL', function () {
    technicalIndicatorResultSizeCase(Volume)
    technicalIndicatorNameCase(Volume, 'VOL')
    technicalIndicatorNoCheckParamsCountCase(Volume, [1, 2, 3, 4, 5, 6, 7])
  })

  describe('createNewIndicator', function () {
    it('should be null when passed in empty', function () {
      const TechnicalIndicator = createNewTechnicalIndicator({})
      expect(TechnicalIndicator).to.be.a('null')
    })

    it('should be create new technical indicator when the correct data is passed in', function () {
      const TechnicalIndicator = createNewTechnicalIndicator({ name: 'T', calcTechnicalIndicator: () => {} })
      const t = new TechnicalIndicator()
      expect(t.name).to.be.equals('T')
    })
  })

  describe('getTechnicalIndicatorInfo', function () {
    it('should return objects containing labels labels and name', function () {
      expect(getTechnicalIndicatorTooltipData({}, new TechnicalIndicator({}), new YAxis(new ChartData({})))).to.have.all.keys('labels', 'labels', 'name')
    })
  })
})
