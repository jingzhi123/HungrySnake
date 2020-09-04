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