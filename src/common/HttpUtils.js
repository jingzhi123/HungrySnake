export default class HttpUtils{
    
    constructor() {
        this.hr = new Laya.HttpRequest;
    }
    /**
     * 发送 HTTP 请求。
     * @param url 请求的地址。大多数浏览器实施了一个同源安全策略，并且要求这个 URL 与包含脚本的文本具有相同的主机名和端口。
     * @param callback 请求成功调用的回调函数
     * @param headers (default = null) HTTP 请求的头部信息。参数形如key-value数组：key是头部的名称，不应该包括空白、冒号或换行；value是头部的值，不应该包括换行。比如["Content-Type", "application/json"]。
     */
    get(url,callback,headers){
        this.hr.on(Laya.Event.PROGRESS, this,(e)=>{
            console.log('加载中...');
            console.log(e);
        });
        this.hr.on(Laya.Event.ERROR, this,(e)=>{
            console.log(e);
        });
        this.hr.on(Laya.Event.COMPLETE, this,callback);
        this.hr.send(url,null,'get','text',headers)

        return this.hr
    }
    /**
     * 发送 HTTP 请求。
     * @param url 请求的地址。大多数浏览器实施了一个同源安全策略，并且要求这个 URL 与包含脚本的文本具有相同的主机名和端口。
     * @param callback 请求成功调用的回调函数
     * @param headers (default = null) HTTP 请求的头部信息。参数形如key-value数组：key是头部的名称，不应该包括空白、冒号或换行；value是头部的值，不应该包括换行。比如["Content-Type", "application/json"]。
     */
    getJson(url,callback,headers){
        this.hr.on(Laya.Event.PROGRESS, this,(e)=>{
            console.log('加载中...');
            console.log(e);
        });
        this.hr.on(Laya.Event.ERROR, this,(e)=>{
            console.log(e);
        });
        this.hr.on(Laya.Event.COMPLETE, this,callback);
        this.hr.send(url,null,'get','json',headers)

        return this.hr
    }
}