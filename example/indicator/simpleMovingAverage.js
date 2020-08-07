  export const simpleMovingAverage = {
      name: 'BNMA',
      calcParams: [12],
     
      series: 'price',
      precision: 2,
      plots: [
        // { key: 'ma', type: 'circle',color: function color(data, technicalIndicatorOptions) {
        //   return 'fff000'
        // }
        // { key: 'ma', type: 'text',content:'👆' }
        { key: 'ma', type: 'line' }
        // { key: 'ma3', type: 'line' }
      ],
      shouldCheckParamCount: true,
      shouldOhlc: true,
      calcTechnicalIndicator: (kLineDataList, calcParams) => {
        const result = []
        kLineDataList.forEach((kLineData, i) => {
          const data = {}

          data.ma = getMA(kLineDataList, i, 10)
          // data.ma2 = getMA(kLineDataList, i, 20)
          // data.ma3 = getMA(kLineDataList, i, 60)
          if(i % 3 == 0 || i % 4 == 0){
            data.ma = null
          }
          result.push(data)
        })
        return result
      }
    }
    

    function getMA(kLineDateList,idx,period){
      var s = 0;
      var count = 0
      for(var i= 0; i< period ;i++){
        var _i = idx - i;
        if (_i < 0){
          s += 0
        }else{
          // console.log(_i)
          
          s += parseFloat(kLineDateList[_i].close)
          count ++;
        }
      }
      return s / count;
    }
