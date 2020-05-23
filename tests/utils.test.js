import { describe, it } from 'mocha'
import { expect } from 'chai'
import { getFont } from '../src/utils/canvas'
import { formatBigNumber, formatDate, formatPrecision, formatValue } from '../src/utils/format'
import { clone, merge, isObject, isValid, isFunction, isNumber, isBoolean, isArray } from '../src/utils/typeChecks'

describe('utils', function () {
  describe('canvas', function () {
    describe('getFont', function () {
      it('should contain text size and font style', function () {
        expect(getFont(12, 'bold')).to.equals('12px bold')
      })
      it('should contain text size and default font style', function () {
        expect(getFont(12)).to.equals('12px Arial')
      })
    })
  })

  describe('format', function () {
    describe('formatValue', function () {
      it('should be the default result when it is empty', function () {
        expect(formatValue()).to.equals('--')
      })
      it('should return correctly when the object and key are passed in', function () {
        expect(formatValue({ key: 1 }, 'key')).to.equals(1)
      })
      it('should return the default value passed in', function () {
        expect(formatValue({ key: 1 }, 'value', '2')).to.equals('2')
      })
    })

    describe('formatDate', function () {
      const timestamp = Date.now()
      const dateTimeFormat = new Intl.DateTimeFormat('en', {
        hour12: false, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric'
      })
      it('should be in the format that returns YYYY', function () {
        expect(formatDate(dateTimeFormat, timestamp, 'YYYY')).to.match(/^[\d]{4}$/)
      })
      it('should be in the format that returns YYYY-MM', function () {
        expect(formatDate(dateTimeFormat, timestamp, 'YYYY-MM')).to.match(/^[\d]{4}[-][\d]{2}$/)
      })
      it('should be in the format that returns YYYY-MM-DD', function () {
        expect(formatDate(dateTimeFormat, timestamp, 'YYYY-MM-DD')).to.match(/^[\d]{4}([-][\d]{2}){2}$/)
      })
      it('should be in the format that returns YYYY-MM-DD hh:mm', function () {
        expect(formatDate(dateTimeFormat, timestamp, 'YYYY-MM-DD hh:mm')).to.match(/^[\d]{4}([-][\d]{2}){2}[\s][\d]{2}:[\d]{2}$/)
      })
      it('should be in the format that returns MM-DD', function () {
        expect(formatDate(dateTimeFormat, timestamp, 'MM-DD')).to.match(/^[\d]{2}[-][\d]{2}$/)
      })
      it('should be in the format that returns hh:mm', function () {
        expect(formatDate(dateTimeFormat, timestamp, 'hh:mm')).to.match(/^[\d]{2}:[\d]{2}$/)
      })
      it('should be in the format that returns MM-DD hh:mm', function () {
        expect(formatDate(dateTimeFormat, timestamp)).to.match(/^[\d]{2}[-][\d]{2}[\s][\d]{2}:[\d]{2}$/)
      })
    })

    describe('formatPrecision', function () {
      it('should be the default number of decimal places', function () {
        expect(formatPrecision(2)).to.equals('2.00')
      })
      it('should be the given number of decimal places', function () {
        expect(formatPrecision(2.908, 6)).to.equals('2.908000')
      })
    })

    describe('formatBigNumber', function () {
      it('should not be formatted', function () {
        expect(formatBigNumber(10)).to.equals(10)
      })
      it('should be formatted as K', function () {
        expect(formatBigNumber(1100)).to.match(/K/)
      })
      it('should be formatted as M', function () {
        expect(formatBigNumber(1100000)).to.match(/M/)
      })
      it('should be formatted as B', function () {
        expect(formatBigNumber(1100000000)).to.match(/B/)
      })
    })
  })

  describe('typeChecks', function () {
    describe('merge', function () {
      it('should be overwritten corresponding key value', function () {
        const value = { a: 1, b: 2 }
        merge(value, { a: 3 })
        expect(value).to.deep.equals({ a: 3, b: 2 })
      })
      it('should be overwritten corresponding key value when the source is mixed with array', function () {
        const value = { a: 1, b: [2] }
        merge(value, { a: 3, b: [1, 2] })
        expect(value).to.deep.equals({ a: 3, b: [1, 2] })
      })
    })

    describe('clone', function () {
      it('should return the same data as the source data', function () {
        expect(clone({ a: 1, b: 2 })).to.deep.equals({ a: 1, b: 2 })
      })
      it('should return the same data as the source data when the clone data is mixed with the array', function () {
        expect(clone({ a: 1, b: [1, 2] })).to.deep.equals({ a: 1, b: [1, 2] })
      })
    })

    describe('isObject', function () {
      it('should return true when the input parameter is an object', function () {
        expect(isObject({})).to.be.true
      })
      it('should return true when the input parameter is an array', function () {
        expect(isObject({})).to.be.true
      })
      it('should return false when the input parameter is a string', function () {
        expect(isObject('')).to.be.false
      })
    })

    describe('isArray', function () {
      it('should return true when the input parameter is an array', function () {
        expect(isArray([1, 2])).to.be.true
      })
      it('should return false when the input parameter is not an array', function () {
        expect(isArray('')).to.be.false
      })
    })

    describe('isNumber', function () {
      it('should return true when the input parameter is number', function () {
        expect(isNumber(1)).to.be.true
      })
      it('should return false when the input parameter is not number', function () {
        expect(isNumber('')).to.be.false
      })
    })

    describe('isFunction', function () {
      it('should return true when the input parameter is function', function () {
        expect(isFunction(function () {})).to.be.true
      })
      it('should return false when the input parameter is not function', function () {
        expect(isFunction('')).to.be.false
      })
    })

    describe('isValid', function () {
      it('should return false when the input parameter is null', function () {
        expect(isValid(null)).to.be.false
      })
      it('should return false when the input parameter is undefined', function () {
        expect(isValid(undefined)).to.be.false
      })
      it('should return true when the input parameter is the correct value', function () {
        expect(isValid(0)).to.be.true
      })
    })

    describe('isBoolean', function () {
      it('should return true when the input parameter is true', function () {
        expect(isBoolean(true)).to.be.true
      })
      it('should return true when the input parameter is false', function () {
        expect(isBoolean(false)).to.be.true
      })
      it('should return false when the input parameter is character', function () {
        expect(isBoolean('')).to.be.false
      })
    })
  })
})
