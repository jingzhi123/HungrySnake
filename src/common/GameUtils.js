export default class GameUtils {

    //计算两点之间距离
    static distance(x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
    }

    /**
     * 随机正负符号(1或-1)
     */
    static randomSimbol(){
        let simbol = Math.random()>0.5?1:-1;
        return simbol;
    }

    static cleanArray(actual) {
        const newArray = []
        for (let i = 0; i < actual.length; i++) {
            if (actual[i]) {
            newArray.push(actual[i])
            }
        }
        return newArray
    }
    /**
     * 将json对象转换为querystring
     * @param {json对象} json 
     */
    static param(json) {
        if (!json) return ''
        return GameUtils.cleanArray(Object.keys(json).map(key => {
            if (json[key] === undefined)
            return ''
            return encodeURIComponent(key) +
            '=' + encodeURIComponent(json[key])
        })).join('&')
    }

    /**
     * 
     * @param {格式化字符串(yyyy-MM-dd hh:mm:ss)} fmt 
     * @param {Date 日期对象} date 
     */
    static dateFormat(fmt,date) { 
        var o = { 
           "M+" : date.getMonth()+1,                 //月份 
           "d+" : date.getDate(),                    //日 
           "h+" : date.getHours(),                   //小时 
           "m+" : date.getMinutes(),                 //分 
           "s+" : date.getSeconds(),                 //秒 
           "q+" : Math.floor((date.getMonth()+3)/3), //季度 
           "S"  : date.getMilliseconds()             //毫秒 
       }; 
       if(/(y+)/.test(fmt)) {
               fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length)); 
       }
        for(var k in o) {
           if(new RegExp("("+ k +")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
        }
       return fmt; 
   } 
}