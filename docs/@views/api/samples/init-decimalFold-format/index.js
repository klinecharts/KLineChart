import { init } from 'klinecharts';

const superscriptNumbers = {
  '0': '⁰',
  '1': '¹',
  '2': '²',
  '3': '³',
  '4': '⁴',
  '5': '⁵',
  '6': '⁶',
  '7': '⁷',
  '8': '⁸',
  '9': '⁹'
};

const chart = init(
  'init-decimalFold-format-chart',
  {
    decimalFold: {
      format: value => {
        const vl = `${value}`;
        const reg = new RegExp('\\.0{3,}[1-9][0-9]*$');
        if (reg.test(vl)) {
          const result = vl.split('.');
          const lastIndex = result.length - 1;
          const v = result[lastIndex];
          const match = /0*/.exec(v);
          if (match) {
            const count = `${match[0].length}`;
            result[lastIndex] = v.replace(/0*/, `0${count.replace(/\d/, $1 => superscriptNumbers[$1] ?? '')}`);
            return result.join('.')
          }
        }
        return vl;
      }
    }
  }
);

chart.setPrecision({ price: 10 });

fetch('/datas/kline2.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });
