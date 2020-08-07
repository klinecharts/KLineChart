//扩展一下jquery
$.extend({
    csv: function (url, f) {
        $.get(url, function (record) {
            //按回车拆分  
            record = record.split("\r\n");
            //第一行标题  
            var title = record[0].split(",");
            //删除第一行  
            record.shift();
            var data = [];
            for (var i = 0; i < record.length - 1; i++) {//最后一行为空行也会被读取 -1
                var t = record[i].split(",");
                for (var y = 0; y < t.length; y++) {
                    if (!data[i]) data[i] = {};
                    data[i][title[y]] = t[y];
                }
            }
            f.call(this, data);
            data = null;
        });
    }
})

/**
 *  读取csv文件
 * @param {地址} url 
 */
export function get_csv_data(url) {

    var stock_data = new Array();
    $.ajaxSettings.async = false;
    $.csv(url, function (datas) {
        $.each(datas, function (index, data) {
            const ts = Date.parse(new Date(data.Time));
            const stock = { close: data.Close, high: data.High, low: data.Low, open: data.Open, timestamp: ts, volume: data.Volume }
            stock_data.push(stock)
        });
    })
    $.ajaxSettings.async = true;
    stock_data.sort((a, b) => {
        return a.timestamp - b.timestamp
    });      //执行排序
    return stock_data
}