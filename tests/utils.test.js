import { describe, it } from 'mocha'
import { expect } from 'chai'
import { getFont } from '../src/utils/canvas'
import { formatBigNumber, formatDate, formatPrecision, formatValue } from '../src/utils/format'
import { clone, merge, isObject, isValid, isFunction, isNumber, isBoolean, isArray } from '../src/utils/typeChecks'

describe('utils', function () {
  describe('canvas', function () {
    describe('getFont', function () {
      it('should size and family', function () {
        expect(getFont(12, 'bold')).to.equals('12px bold')
      })
      it('should size without family', function () {
        expect(getFont(12)).to.equals('12px Arial')
      })
    })
  })

  describe('format', function () {
    describe('formatValue', function () {
      it('should default', function () {
        expect(formatValue()).to.equals('--')
      })
      it('should without key', function () {
        expect(formatValue({})).to.equals('--')
      })
      it('should value and key', function () {
        expect(formatValue({ key: 1 }, 'key')).to.equals(1)
      })
      it('should value key and value without key', function () {
        expect(formatValue({ key: 1 }, 'value')).to.equals('--')
      })
      it('should value key and default value', function () {
        expect(formatValue({ key: 1 }, 'value', '2')).to.equals('2')
      })
    })

    describe('formatDate', function () {
      const timestamp = Date.now()
      const dateTimeFormat = new Intl.DateTimeFormat('en', {
        hour12: false, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric'
      })
      it('should format is YYYY', function () {
        expect(formatDate(dateTimeFormat, timestamp, 'YYYY')).to.match(/^[\d]{4}$/)
      })
      it('should format is YYYY-MM', function () {
        expect(formatDate(dateTimeFormat, timestamp, 'YYYY-MM')).to.match(/^[\d]{4}[-][\d]{2}$/)
      })
      it('should format is YYYY-MM-DD', function () {
        expect(formatDate(dateTimeFormat, timestamp, 'YYYY-MM-DD')).to.match(/^[\d]{4}([-][\d]{2}){2}$/)
      })
      it('should format is YYYY-MM-DD hh:mm', function () {
        expect(formatDate(dateTimeFormat, timestamp, 'YYYY-MM-DD hh:mm')).to.match(/^[\d]{4}([-][\d]{2}){2}[\s][\d]{2}:[\d]{2}$/)
      })
      it('should format is MM-DD', function () {
        expect(formatDate(dateTimeFormat, timestamp, 'MM-DD')).to.match(/^[\d]{2}[-][\d]{2}$/)
      })
      it('should format is hh:mm', function () {
        expect(formatDate(dateTimeFormat, timestamp, 'hh:mm')).to.match(/^[\d]{2}:[\d]{2}$/)
      })
      it('should format is empty', function () {
        expect(formatDate(dateTimeFormat, timestamp)).to.match(/^[\d]{2}[-][\d]{2}[\s][\d]{2}:[\d]{2}$/)
      })
    })

    describe('formatPrecision', function () {
      it('should precision is 0', function () {
        expect(formatPrecision(2, 0)).to.equals('2')
      })
      it('should precision is 6', function () {
        expect(formatPrecision(2.908, 6)).to.equals('2.908000')
      })
    })

    describe('formatBigNumber', function () {
      it('should number is 10', function () {
        expect(formatBigNumber(10)).to.equals(10)
      })
      it('should precision is 1100', function () {
        expect(formatBigNumber(1100)).to.equals('1.1K')
      })
      it('should precision is 1100000', function () {
        expect(formatBigNumber(1100000)).to.equals('1.1M')
      })
      it('should precision is 1100000000', function () {
        expect(formatBigNumber(1100000000)).to.equals('1.1B')
      })
    })
  })

  describe('typeChecks', function () {
    describe('merge', function () {
      it('should single object', function () {
        const value = { a: 1, b: 2 }
        merge(value, { a: 3 })
        expect(value).to.deep.equals({ a: 3, b: 2 })
      })
      it('should object array mix', function () {
        const value = { a: 1, b: [2] }
        merge(value, { a: 3, b: [1, 2] })
        expect(value).to.deep.equals({ a: 3, b: [1, 2] })
      })
    })

    describe('clone', function () {
      it('should single object', function () {
        expect(clone({ a: 1, b: 2 })).to.deep.equals({ a: 1, b: 2 })
      })
      it('should single array', function () {
        expect(clone([1, 2])).to.deep.equals([1, 2])
      })
      it('should object array mix', function () {
        expect(clone({ a: 1, b: [1, 2] })).to.deep.equals({ a: 1, b: [1, 2] })
      })
    })

    describe('isObject', function () {
      it('should object', function () {
        expect(isObject({})).to.be.true
      })
      it('should array', function () {
        expect(isObject({})).to.be.true
      })
      it('should not object', function () {
        expect(isObject('')).to.be.false
      })
    })

    describe('isArray', function () {
      it('should array', function () {
        expect(isArray([1, 2])).to.be.true
      })
      it('should not array', function () {
        expect(isArray('')).to.be.false
      })
    })

    describe('isNumber', function () {
      it('should number', function () {
        expect(isNumber(1)).to.be.true
      })
      it('should not number', function () {
        expect(isNumber('')).to.be.false
      })
    })

    describe('isFunction', function () {
      it('should function', function () {
        expect(isFunction(function () {})).to.be.true
      })
      it('should not function', function () {
        expect(isFunction('')).to.be.false
      })
    })

    describe('isValid', function () {
      it('should null', function () {
        expect(isValid(null)).to.be.false
      })
      it('should undefined', function () {
        expect(isValid(undefined)).to.be.false
      })
      it('should value', function () {
        expect(isValid(0)).to.be.true
      })
    })

    describe('isBoolean', function () {
      it('should true', function () {
        expect(isBoolean(true)).to.be.true
      })
      it('should false', function () {
        expect(isBoolean(false)).to.be.true
      })
      it('should not boolean', function () {
        expect(isBoolean('')).to.be.false
      })
    })
  })
})
