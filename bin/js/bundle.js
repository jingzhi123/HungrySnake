(function () {
   'use strict';

   class GameUtils {

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
           const newArray = [];
           for (let i = 0; i < actual.length; i++) {
               if (actual[i]) {
               newArray.push(actual[i]);
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

   class HttpUtils extends Laya.HttpRequest{
       
       constructor(caller) {
           super();
           this.callback = (data)=>{
               console.log(data);
           };
           this.progressCallback = (e)=>{
               console.log('加载中...');
               console.log(e);
           };
           this.errorCallback = (e)=>{
               console.log(e);
           };;
       }
       /**
        * 发送 HTTP 请求。
        * @param url 请求的地址。大多数浏览器实施了一个同源安全策略，并且要求这个 URL 与包含脚本的文本具有相同的主机名和端口。
        * @param callback 请求成功调用的回调函数
        * @param headers (default = null) HTTP 请求的头部信息。参数形如key-value数组：key是头部的名称，不应该包括空白、冒号或换行；value是头部的值，不应该包括换行。比如["Content-Type", "application/json"]。
        */
       get(url,callback,headers){
           this.callback = callback;
           this.on(Laya.Event.PROGRESS, this,this.progressCallback);
           this.on(Laya.Event.ERROR, this,this.errorCallback);
           this.on(Laya.Event.COMPLETE, this,this.callback);
           this.send(url,null,'get','text',headers);

           return this
       }
       /**
        * 发送 HTTP 请求。
        * @param url 请求的地址。大多数浏览器实施了一个同源安全策略，并且要求这个 URL 与包含脚本的文本具有相同的主机名和端口。
        * @param callback 请求成功调用的回调函数
        * @param headers (default = null) HTTP 请求的头部信息。参数形如key-value数组：key是头部的名称，不应该包括空白、冒号或换行；value是头部的值，不应该包括换行。比如["Content-Type", "application/json"]。
        */
       getJson(url,callback,headers){
           this.callback = callback;
           this.on(Laya.Event.PROGRESS, this,this.progressCallback);
           this.on(Laya.Event.ERROR, this,this.errorCallback);
           this.on(Laya.Event.COMPLETE, this,this.callback);
           this.send(url,null,'get','json',headers);

           return this
       }

       /**
        * 发送 HTTP 请求。
        * @param url 请求的地址。大多数浏览器实施了一个同源安全策略，并且要求这个 URL 与包含脚本的文本具有相同的主机名和端口。
        * @param callback 请求成功调用的回调函数
        * @param headers (default = null) HTTP 请求的头部信息。参数形如key-value数组：key是头部的名称，不应该包括空白、冒号或换行；value是头部的值，不应该包括换行。比如["Content-Type", "application/json"]。
        */
       post(url,data,callback,headers){
           headers = headers.concat(['Content-Type','application/x-www-form-urlencoded;charset=utf-8']);
           this.callback = callback;
           this.on(Laya.Event.PROGRESS, this,this.progressCallback);
           this.on(Laya.Event.ERROR, this,this.errorCallback);
           this.on(Laya.Event.COMPLETE, this,this.callback);
           this.send(url,data,'post','json',headers);

           return this
       }
   }

   const BGM_PATH='sound/bgm.mp3',SNAKE_PREFAB_PATH='res/sprite_snake1.prefab',SNAKEBODY_PREFAB_PATH='res/sprite_snakebody1.prefab',FOOD_PREFAB_PATH='res/sprite_food1.prefab';
   const MAP_PATH='images/s1-bg.png';
   // const ctx = 'http://localhost:8888'
   const ctx = 'http://132.232.4.180:8888';
   let resourceMap = {};
   let userInfo = {};
   class Global{
       static get ctx(){
           return ctx;
       }
       /**
        * 背景音乐资源路径
        */
       static get BGM_PATH(){
           return BGM_PATH
       }
       /**
        * 蛇预制体资源路径
        */
       static get SNAKE_PREFAB_PATH() {
           return SNAKE_PREFAB_PATH
       }
       /**
        * 蛇身预制体资源路径
        */
       static get SNAKEBODY_PREFAB_PATH() {
           return SNAKEBODY_PREFAB_PATH
       }
       /**
        * 食物身预制体资源路径
        */
       static get FOOD_PREFAB_PATH() {
           return FOOD_PREFAB_PATH
       }
       static get LOAD_RESOURCES() {
           //{url:BGM_PATH,type:Laya.Loader.SOUND},
           return [{url:SNAKE_PREFAB_PATH,type:Laya.Loader.PREFAB},{url:SNAKEBODY_PREFAB_PATH,type:Laya.Loader.PREFAB},{url:FOOD_PREFAB_PATH,type:Laya.Loader.PREFAB}]
       }
       /**
        * 资源映射关系
        */
       static get resourceMap(){
           return resourceMap
       }

       /**
        * 资源加载完成回调
        * @param {是否完成} data 
        */
       static onResourcesLoaded(data){
           console.log(data);
           if(data){
               Global.LOAD_RESOURCES.map(r=>{
                   let d = Laya.loader.getRes(r.url);
                   resourceMap[r.url] = d;
               });
           }
           
       }

       static log(msg){
           if(Laya.Browser.onMiniGame){
               wx.showToast({title:msg+""});
           } else {
               console.log(msg);
           }
       }

   }

   class Player{

       
       constructor(initUrl){
           /**
            * 初始化地址
            */
           this.initUrl = initUrl;
           /**
            * 用户信息
            */
           this.userInfo;
           /**
            * 玩家游戏昵称
            */
           this.playerName = '';

           /**
            * 玩家等级
            */
           this.level;

           /**
            * 头像地址
            */
           this.avatarUrl;

           /**
            * 玩家拥有道具
            */
           this.items = [];

           /**
            * 初始金币
            */
           this.goldNum = 0;

           /**
            * 游戏记录
            */
           this.recordList = [];

           /**
            * 好友列表
            */
           this.friendList = [];

           /**
            * 玩家游戏角色
            */
           this.character;

           this.http = new HttpUtils();
           Player.instance = this;

           this.init();
       }

       init(){
           let _this = this;
           this.http.get(this.initUrl,(data)=>{
               console.log(data);
               data = JSON.parse(data);
               _this.playerName = data.nickName;
           });
       }
   }

   class GameSceneRuntime extends Laya.Scene {

       constructor() { 
           super(); 
           GameSceneRuntime.instance = this;

           

           this.gameTime = new Date('2000/1/1 00:02:05').getTime();

           this.gameStart = false;
           /**
            * 左手控制摇杆默认位置
            */
           this.ctrlDefaultPos;

           /**
            * 玩家蛇脚本
            */
           this.playerScript;

           /**
            * 玩家蛇节点
            */
           this.playerSnake;

           /**
            * 摇杆默认位置
            */
           this.ctrlDefaultPos = {};
       }

       
       speedUp(e){
           this.playerScript.speedMode = true;
           this.playerScript.speedChange(this.playerScript.velocity+this.playerScript.acceleratedVelocity);
       }
       
       speedDown(e){
           this.playerScript.speedMode = false;
           this.playerScript.speedChange(this.playerScript.velocity);
       }

       onStageMouseDown(e){
           if(e.stageX+this.btn_ctrl.width/2<=this.gameScene.width/2 && e.stageX>this.btn_ctrl.width/2){
               this.btn_ctrl.x = e.stageX;
               this.btn_ctrl.y = e.stageY;
           }
       }

       /**
        * 摇杆抬起
        */
       ctrlRockerUp(){
           if (this.gameScene.mouseX <= this.gameScene.width / 2 + this.btn_ctrl.width/2) {
               this.btn_ctrl_rocker.visible = true;
               this.btn_ctrl_rocker_move.visible = false;
               this.btn_ctrl.x = this.ctrlDefaultPos.x;
               this.btn_ctrl.y = this.ctrlDefaultPos.y;

           }
       }

       /**
        * 摇杆按下
        */
       ctrlRockerDown(){
           if (this.gameScene.mouseX <= this.gameScene.width / 2 + this.btn_ctrl.width/2) {
               this.btn_ctrl_rocker.visible = false;
               this.btn_ctrl_rocker_move.visible = true;
               if (GameUtils.distance(this.gameScene.mouseX, this.gameScene.mouseY, this.btn_ctrl.x, this.btn_ctrl.y) <= (this.gameScene.height)) {
                   this.btn_ctrl_rocker_move.pos(this.gameScene.mouseX, this.gameScene.mouseY);


                   let rotation = Math.atan2(this.gameScene.mouseY - this.btn_ctrl.y, this.gameScene.mouseX - this.btn_ctrl.x) * 180 / Math.PI;

                   this.playerSnake.event('rotationChange',rotation);
                   // this.playerSnake.rotation = Math.atan2(this.gameScene.mouseY - this.btn_ctrl.y, this.gameScene.mouseX - this.btn_ctrl.x) * 180 / Math.PI
               } else {
                   this.btn_ctrl_rocker_move.pos(
                       this.btn_ctrl.x + (this.btn_ctrl.width / 2 - this.btn_ctrl.width / 2) * Math.cos(Math.atan2(this.gameScene.mouseY - this.btn_ctrl.y, this.gameScene.mouseX - this.btn_ctrl.x))
                       ,
                       this.btn_ctrl.y + (this.btn_ctrl.width / 2 - this.btn_ctrl.width / 2) * Math.sin(Math.atan2(this.gameScene.mouseY - this.btn_ctrl.y, this.gameScene.mouseX - this.btn_ctrl.x))
                   );
               }
           }
       }

       /**
        * 游戏开始
        */
       startGame(){
           this.gameStart = true;
           // this.timeLabel.text = GameUtils.dateFormat('mm:ss',new Date(this.gameTime))
           this.timeMinus();
           Laya.timer.loop(1000,this,this.timeMinus);
       }

       /**
        * 游戏结束
        */
       stopGame(){
           this.gameStart = false;
           this.showGameOver();
           Laya.timer.clear(this,this.timeMinus);
       }

       /**
        * 显示记分版
        */
       showGameOver(){
           this.scoreView.visible = true;
           this.refreshScore();
           this.controlPad.destroy();
           this.saveScore();
       }

       refreshScore(){
           this.scoreLabel.text = this.playerScript.score;
       }

       /**
        * 保存分数
        */
       saveScore(){

           let param = {name:(Global.userInfo&&Global.userInfo.nickName)||Player.playerName,score:this.playerScript.score};

           new HttpUtils().post(`${Global.ctx}/common/snake_score/insert`,GameUtils.param(param),(data)=>{
               console.log(data);
           },['token',Global.token,'code','snake']);
       }

       timeMinus(){
           this.timeLabel.text = GameUtils.dateFormat('mm:ss',new Date(this.gameTime));
           if(this.timeLabel.text!='00:00'){
               this.gameTime -= 1000;
           } else {
               this.stopGame();
           }
       }

       onAwake(){
           this.gameScene = this;
           this.scoreLabel = this.scoreView.getChildByName('label_score');
           this.on('playerComplete',this,(playerSnake)=>{
               console.log(playerSnake);
               this.playerSnake = playerSnake;
               this.playerScript = playerSnake.getComponent(Laya.Script);


               console.log(this.playerScript.currentPlayer);
               this.btn_speedup.on('mousedown',this,this.speedUp);
               this.btn_speedup.on('mouseup',this,this.speedDown);
               this.on('mousedown',this,this.onStageMouseDown);
               this.gameScene.on("mouseup", this, this.ctrlRockerUp);
               this.gameScene.on("mousemove",this, this.ctrlRockerDown);

               this.shootBtn.clickHandler = Laya.Handler.create(this,()=>{
                   this.playerScript.shoot();
               },null,false);
               this.controlPad.onDestroy = ()=>{
                   this.btn_speedup.off('mousedown',this,this.speedUp);
                   this.btn_speedup.off('mouseup',this,this.speedDown);
                   this.gameScene.off("mouseup", this, this.ctrlRockerUp);
                   this.gameScene.off("mousemove",this, this.ctrlRockerDown);
               };
               // this.rightView.right = this.gameScene.width*0.05;

               // this.btn_ctrl.left = this.gameScene.width*0.05;

               this.ctrlDefaultPos = {x:this.btn_ctrl.x,y:this.btn_ctrl.y};
           });
       }
       
       onEnable() {
           this.initNums();
       }

       onDisable() {
       }

       /**
        * 初始化数值
        */
       initNums(){
           this.scoreText.text = 0;
           this.foodNumText.text = 0;
           this.killNumText.text = 0;
       }

       /**
        * 更新数值显示
        * @param {蛇脚本对象} snakeScript 
        */
       updateNums(snakeScript){
           this.scoreText.text = snakeScript.score;
           this.foodNumText.text = snakeScript.foodNum;
           this.killNumText.text = snakeScript.killNum;
       }
   }

   class CenterPos extends Laya.Sprite {

       constructor() { 
           super(); 
       }
       
       onEnable() {
           this.x = Laya.stage.x/2-this.width/2;
           this.y = Laya.stage.y/2-this.width/2;
       }

       onDisable() {
       }
   }

   class BaseScript extends Laya.Script {
       //蛇头路径

       constructor() { 
           super(); 
           this.script;//脚本

           
       }
       onAwake(){
           this.owner.script = this;
           this.gameScene = this.owner.scene;
       }

       showLoading(){
   		this.loading = new Laya.Text();

   		this.loading.fontSize = 30;
   		this.loading.color = "#FFFFFF";
   		this.loading.align = 'center';
   		this.loading.valign = 'middle';

           this.loading.width = Laya.stage.width;
           this.loading.height =  Laya.stage.height;
   		this.loading.text = "等待响应...\n";
   		Laya.stage.addChild(this.loading);
       }

       removeLoading(){
           Laya.stage.removeChild(this.loading);
       }
       
       getEventDispatcher(){
           if(this.eventDispatcher==null){
               this.eventDispatcher = new Laya.EventDispatcher();
           }
           return this.eventDispatcher;
       }

       onDestroy() {
           console.log(this.owner.name + "被销毁");
       }
   }

   class Wall extends BaseScript {

       constructor() { 
           super(); 
           /** @prop {name:snakeRes, tips:"蛇头资源", type:Prefab, default:null}*/
           let snakeRes;
           /** @prop {name:foodRes, tips:"食物资源", type:Prefab, default:null}*/
           let foodRes;
           /** @prop {name:btn_ctrl, tips:"控制按钮", type:Node, default:null}*/
           let btn_ctrl;
           /** @prop {name:btn_ctrl_rocker, tips:"控制摇杆", type:Node, default:null}*/
           let btn_ctrl_rocker;
           /** @prop {name:btn_ctrl_rocker_move, tips:"控制移动摇杆", type:Node, default:null}*/
           let btn_ctrl_rocker_move;
           /** @prop {name:btn_speedup, tips:"加速按钮", type:Node, default:null}*/
           let btn_speedup;
           /** @prop {name:scoreText, tips:"分数面板", type:Node, default:null}*/
           let scoreText;
           /** @prop {name:controlPad, tips:"操作面板", type:Node, default:null}*/
           let controlPad;

           //道具start
           /** @prop {name:magnetRes, tips:"道具预制体资源", type:Prefab, default:null}*/
           let magnetRes;
           //道具end

           this.snakeInited = false;

           this.foodNum = 0;//当前食物数量

           this.foods = [];
           
           this.foodOrder = 0;

           this.snakes = [];//蛇数组

           this.snakeMap = {};

           this.AISnakeNum = 2;//蛇的个数

           this.cursnakeNum = 0;//当前蛇的数量

           this.maxFood = 500;//最大食物数量

       }



       //玩家操控的蛇准备完毕
       playerComplete(playerSnake){
           this.gameScene.playerSnake = playerSnake;
           this.gameScene.playerScript = playerSnake.getComponent(Laya.Script);
           this.gameScene.event('playerComplete',playerSnake);
       }

       onAwake(){
           super.onAwake();

           

           this.owner.on('init',this,this.init);
           this.wallScript = this.owner.getComponent(Laya.Script);
           //加载蛇头资源
           this.snakeRes = Laya.loader.getRes(Global.SNAKE_PREFAB_PATH);
           console.log(this.snakeRes);
           if(!this.snakeRes){
               console.log('未获取到蛇头资源!');
               Laya.loader.load('res/sprite_snake1.prefab',Laya.Handler.create(this,(res)=>{
                   this.snakeRes = res;
                   console.log(res);
               }));
           }
           //加载食物资源
           this.foodRes = Laya.loader.getRes(Global.FOOD_PREFAB_PATH);
           if(!this.foodRes){
               console.log('未获取到食物资源!');
               Laya.loader.load('res/sprite_food1.prefab',Laya.Handler.create(this,(res)=>{
                   this.foodRes = res;
               }));
           }

           Laya.timer.frameLoop(1,this,this.initFood);
           
           // Laya.timer.loop(1,this,this.mainLoop)
       }

       onTriggerEnter(other,self){
           if(other.name=='bullet_collider'){
               // console.log('子弹创强');
               if(other.owner){
                   // other.owner.destroy()
                   other.owner.removeSelf();
               }
           }

       }

       init(){
           Laya.timer.clear(this,this.initFood);
           this.playerComplete(this.gameScene.playerSnake);
           this.snakeInited = true;
           Laya.timer.frameLoop(1,this,this.mainLoop);

           this.itemControl();
       }

       /**
        * 道具控制
        */
       itemControl(){
           Laya.timer.once(1000,this,()=>{
               let magnet = Laya.Pool.getItemByCreateFun('magnet',this.magnetRes.create,this.magnetRes);
               magnet.getComponent(Laya.Script).wallScript = this.owner.script;
               magnet.pos(this.gameScene.playerSnake.x + 50,this.gameScene.playerSnake.y);
               this.owner.addChild(magnet);
           });
       }
       /**
        * 状态检查
        */
       stateCheck(){
           let _this = this;

           // if(this.snakes){

           //     this.snakes = this.snakes.map(snake=>{
           //         let s = _this.owner.getChildAt(snake.getChildIndex())
           //         if(s){
           //             let snakeScript = s.getComponent(Laya.Script)
           //             snakeScript.snakeLoop();
           //             return s;
           //         } else {
           //             return snake;
           //         }
           //     })
           // }
       }


       /**
        * 主循环
        */
       mainLoop(){
           if(this.gameScene.gameStart && this.snakeInited){
               this.loadFood();
               this.stateCheck();

               if(this.gameScene.playerSnake){
                   this.mapMove(this.gameScene.playerScript);
               }
           } else {
               // Laya.timer.clear(this.mainLoop)
           }
           
           
           
       }


       mapMove(snakeScript){
           //return;

           let mapScale =0.5 / this.gameScene.playerScript.curBodySize < 0.7 ? 0.7 : 0.5 / this.gameScene.playerScript.curBodySize;


           // this.owner.x = -1 * (this.gameScene.playerSnake.x + this.gameScene.playerSnake.width / 2 - this.owner.width / 2) * mapScale + this.owner.width / 2
           // this.owner.y = -1 * (this.gameScene.playerSnake.y + this.gameScene.playerSnake.height / 2 - this.owner.height / 2) * mapScale + this.owner.height / 2

           //固定视角
           let x = -(this.gameScene.playerSnake.x-this.owner.width / 2);// * mapScale;
           let y = -(this.gameScene.playerSnake.y-this.owner.height / 2);// * mapScale

           this.owner.x = x;
           this.owner.y = y;

           // this.owner.x = -1300
           // this.owner.y = -700
           // console.log(this.owner);
           // this.owner.scale(2, 2)
           // this.owner.scale(mapScale,mapScale)

           // Laya.Tween.to(this.owner,{scaleX:mapScale,scaleY:mapScale},200)

       }

       /**
        * 按照数量获取随机食物
        */
       getFoods(foodNum){
           let foods = [];
           for(let i = 0;i<foodNum;i++){
               let x = Math.random()*(this.owner.width-10).toFixed(0)+10;
               let y = Math.random()*(this.owner.height-10).toFixed(0)+10;
               let food = Laya.Pool.getItemByCreateFun('food',this.foodRes.create,this.foodRes);
               food.x = x;
               food.y = y;
               foods.push(food);
           }
           return foods;
       }
       //初始化食物
       initFood(){
           
           if(this.foodRes){;
               for(let i = 0 ;i<20;i++){
                   if(this.foodNum<this.maxFood){
                       let x = Math.random()*(this.owner.width-10).toFixed(0)+10;
                       let y = Math.random()*(this.owner.height-10).toFixed(0)+10;
                       let food = Laya.Pool.getItemByCreateFun('food',this.foodRes.create,this.foodRes);

                       food.x = x;
                       food.y = y;
                       food.foodOrder = this.foodOrder;

                       this.foods[this.foodOrder] = food;
                       // Laya.stage.addChild(food)
                       this.owner.addChild(food);
                       
                       // this.foods[this.foodOrder] = food;
                       this.foodOrder++;
                       this.foodNum++;
                   } else {
                       this.loadSnake();
                       break;
                   }
               }

           }
           
       }
       
       loadFood(){
           
           if(this.foodRes){
               for(let i = 0 ;i<20;i++){
                   if(this.foodNum<this.maxFood){
                       // console.log('增加食物');
                       let x = Math.random()*(this.owner.width-10).toFixed(0)+10;
                       let y = Math.random()*(this.owner.height-10).toFixed(0)+10;
                       let food = Laya.Pool.getItem('food');

                       if(food){
                           food.x = x;
                           food.y = y;
                           food.foodOrder = this.foodOrder;

                           this.foods[this.foodOrder] = food;
                           // Laya.stage.addChild(food)
                           this.owner.addChild(food);
                           
                           // this.foods[this.foodOrder] = food;
                           this.foodOrder++;
                           this.foodNum++;
                       }
                   }
               }

           }
           
       }

       addSnake(snake){
           this.owner.addChild(snake);
           this.snakes.push(snake);
       }

       addPlayerSnake(snake){
           this.owner.addChild(snake);
           this.snakes.unshift(snake);
       }

       /**
        * 复活玩家
        */
       createPlayer(){
           let playerSnake = Laya.Pool.getItemByCreateFun('playerSnake',this.snakeRes.create,this.snakeRes);
           let snakeScript = playerSnake.getComponent(Laya.Script);
           snakeScript.index = 0;
           snakeScript.playerName = '张三' + snakeScript.index;
           snakeScript.currentPlayer = true;
           this.addPlayerSnake(playerSnake);
           this.playerComplete(playerSnake);
           this.snakeMap[0] = playerSnake;
           Player.instance.character = playerSnake;
           
       }

       /**
        * 复活玩家
        */
       createAI(index){
           console.log(this.snakes,index);
           let AISnake = Laya.Pool.getItemByCreateFun('AISnake',this.snakeRes.create,this.snakeRes);
           let snakeScript = AISnake.getComponent(Laya.Script);
           snakeScript.playerSnake = this.gameScene.playerSnake;
           snakeScript.index = index;
           snakeScript.AI = true;
           snakeScript.playerName = '张三' + snakeScript.index;
           snakeScript.currentAI = true;
           this.addSnake(AISnake);
           this.snakeMap[index] = AISnake;
           
       }

       loadSnake(){
           //食物加载完毕
           if(this.foodNum>=this.maxFood){
               this.createPlayer();
               this.cursnakeNum++;
               //加载AI蛇
               for(let i = 1;i<this.AISnakeNum;i++){
                   this.createAI(i);
                   this.cursnakeNum++;
               }
               this.owner.event('init');
           }
       }
       
       onEnable() {
           
       }


       onDisable() {
           Laya.timer.clear(this,this.mainLoop);
       }
   }

   class GameOver extends Laya.Script {

       constructor() { 
           super(); 
           /** @prop {name:retryBtn, tips:"重试按钮", type:Node, default:null}*/
           let retryBtn;
           /** @prop {name:returnBtn, tips:"返回按钮", type:Node, default:null}*/
           let returnBtn;
       }
       onAwake(){
           console.log('gameover');
       }

       onUpdate(){
           if(!GameSceneRuntime.instance.gameStart){
               GameSceneRuntime.instance.refreshScore();
           }
       }
       
       onStart() {
           this.returnBtn.clickHandler = Laya.Handler.create(this,(e)=>{
               Laya.Scene.open('init.scene');
           });
           this.retryBtn.clickHandler = Laya.Handler.create(this,(e)=>{
               Laya.Scene.open('gameScene.scene');
           });
       }

       onDisable() {
       }
   }

   class GameControl extends BaseScript {

       constructor() {
           super();
           /** @prop {name:logo, tips:"LOGO", type:Node, default:null}*/
           let logo;
           /** @prop {name:progressBar, tips:"进度条", type:Node, default:null}*/
           let progressBar;
           /** @prop {name:startBtn, tips:"开始按钮", type:Node, default:null}*/
           let startBtn;
           /** @prop {name:rankListBtn, tips:"排行榜按钮", type:Node, default:null}*/
           let rankListBtn;
           /** @prop {name:rankListCloseBtn, tips:"排行榜关闭按钮", type:Node, default:null}*/
           let rankListCloseBtn;
           /** @prop {name:gameText, tips:"游戏标题", type:Node, default:null}*/
           let gameText;
           /** @prop {name:scorePanel, tips:"分数列表", type:Node, default:null}*/
           let scorePanel;
           /** @prop {name:avatarImg, tips:"头像", type:Node, default:null}*/
           let avatarImg;
           /** @prop {name:nicknameLabel, tips:"用户昵称", type:Node, default:null}*/
           let nicknameLabel;
       }

       /**
        * 构建登陆按钮
        * @param {当前对象} _this 
        * @param {openid} openid 
        */
       createUserInfoButton(_this,openid) {
           //登陆按钮
           let bthWidth = _this.startBtn.width * Global.SysInfo.screenWidth / _this.owner.scene.width;
           let btnHeight = _this.startBtn.height * Global.SysInfo.screenHeight / _this.owner.scene.height;
           let button = wx.createUserInfoButton({
               type: 'text',
               text: '',
               style: {
                   left: Global.SysInfo.screenWidth / 2 - bthWidth / 2,
                   top: _this.startBtn.y * Global.SysInfo.screenHeight / _this.owner.scene.height,
                   width: bthWidth,
                   height: btnHeight,
                   opacity: 0,
               }
           });
           button.onTap((res) => {
               if (res.userInfo) {
                   Global.userInfo = res.userInfo;
                   Global.userInfo.openid = openid;
                   Player.instance.userInfo = Global.userInfo;
                   console.log(Global.userInfo);
                   let param = JSON.parse(JSON.stringify(Global.userInfo));
                   param.rawdata = JSON.stringify(Global.userInfo);
                   wx.request({
                       url: `${Global.ctx}/public/wxmini/toLogin`,
                       method: 'POST',
                       header: {
                           'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                       },
                       data: param,
                       success(res) {
                           let data = res.data;
                           if (data.status > 0) {
                               _this.onStartBtnClick();
                               button.destroy();
                           } else {
                               console.log(data.message);
                           }


                       },
                       fail(err) {
                           console.log(err);
                       }
                   });
                   _this.loadAvatar(res.userInfo.avatarUrl);
                   this.nicknameLabel.text = res.userInfo.nickName;
                   wx.showToast({
                       title: res.userInfo.nickName,
                       icon: 'success'
                   });


               } else {
                   wx.showToast({
                       title: '请先登录!',
                       icon: 'none'
                   });
               }
           });
       }

       /**
        * 微信登陆,取到openid并构建登陆按钮
        */
       wxLogin() {
           let _this = this;
           wx.login({
               success(res) {
                   if (res.code) {
                       console.log(res);
                       //发起网络请求
                       wx.request({
                           url: `${Global.ctx}/public/wxmini/openid`,
                           data: {
                               code: res.code
                           },
                           success(res) {
                               let data = res.data.dataMap;
                               let openid = data.openid;
                               _this.createUserInfoButton(_this,openid);

                           },
                           fail(err) {
                               console.log(err);
                           }
                       });
                   } else {
                       console.log('登录失败！' + res.errMsg);
                   }
               }
           });
       }

       /**
        * 检查是否已经登录,若没有,直接构建登陆
        */
       checkIfNeedLoginAndDoLogin() {
           let _this = this;
           if (Laya.Browser.onMiniGame) {
               if (Global.userInfo) {
                   _this.loadAvatar(Global.userInfo.avatarUrl);
               } else {
                   _this.wxLogin();
               }
               // wx.checkSession({
               //     success() {
               //         _this.loadAvatar(Global.userInfo.avatarUrl)
               //         console.log('已登录');
               //     },
               //     fail() {
               //         // session_key 已经失效，需要重新执行登录流程
               //         _this.wxLogin() //重新登录
               //     }
               // })


           } else {
               this.nicknameLabel.text = Player.instance.playerName;
           }
       }

       loadAvatar(avatarUrl) {
           console.log('加载头像', this.avatarImg);
           this.avatarImg.loadImage(avatarUrl, 0, 0, 0, 0, () => {
               this.avatarImg.removeSelf();
               wx.showToast({
                   title: '头像加载成功'
               });
               this.owner.addChild(img);
           });
       }
       /**
        * 加载默认头像,若已经登录,则直接加载用户头像
        */
       loadDefaultAvatar(){
           if (Global.userInfo) {
               this.nicknameLabel.text = Global.userInfo.nickName;
               this.loadAvatar(Global.userInfo.avatarUrl);
           } else {
               this.avatarImg.loadImage('images/avatar.jpg', 0, 0, 0, 0, () => {
                   this.avatarImg.removeSelf();
                   wx.showToast({
                       title: '头像加载成功'
                   });
                   this.owner.addChild(img);
               });
           }
       }
       onAwake() {
           console.log('是否微信小游戏', Laya.Browser.onMiniGame);
           this.loadDefaultAvatar();
           this.checkIfNeedLoginAndDoLogin();
           //开始按钮点击   
           this.startBtn.clickHandler = Laya.Handler.create(this, (e) => {
               this.onStartBtnClick();
           });
           //排行榜打开
           this.rankListBtn.clickHandler = Laya.Handler.create(this, (e) => {
               let req = new HttpUtils();
               this.showLoading();
               req.once(Laya.Event.ERROR, this, (e) => {
                   console.log(e);
                   this.removeLoading();
               });
               req.getJson(`${Global.ctx}/common/snake_score/query`, (data) => {
                   console.log(data);
                   console.log('打开排行!');
                   let scoreArr = data;
                   this.scoreList.visible = true;

                   if (scoreArr) {
                       scoreArr.sort((a, b) => {
                           return b.score - a.score;
                       });
                       scoreArr.forEach((s, i) => {
                           let text = new Laya.Text();
                           text.width = this.scorePanel.width;
                           text.fontSize = 18;
                           text.height = 20;
                           text.x = 0;
                           text.y = i * text.height + 20;
                           text.align = 'center';
                           text.valign = 'top';
                           text.text = '姓名: ' + s.name + " , 分数: " + s.score;
                           this.scorePanel.addChild(text);
                       });
                   }
                   this.removeLoading();
               }, ['token', Global.token, 'code', 'snake']);

           }, null, false);
           //排行榜关闭
           this.rankListCloseBtn.clickHandler = Laya.Handler.create(this, (e) => {
               this.scoreList.visible = false;
           }, null, false);

       }

       rankDataComplete(data) {
           this.removeLoading();
           console.log(data);
       }

       onStartBtnClick() {
           console.log('游戏开始:', this.owner);
           this.progressBar.visible = true;
           console.log(Global.LOAD_RESOURCES);
           let load = Laya.loader.load(Global.LOAD_RESOURCES, Laya.Handler.create(this, Global.onResourcesLoaded), Laya.Handler.create(this, (num) => {
               Global.log("进度:" + num);
               this.progressBar.value = num;
               if (num == 1) {
                   setTimeout(() => {
                       Global.log("加载场景");
                       //加载场景
                       Laya.Scene.open('gameScene.scene', true, null, Laya.Handler.create(this, (scene) => {
                           console.log(scene);
                           Global.log("加载场景完毕");
                       }));

                   }, 500);
               }
           }, null, false));

           load.on(Laya.Event.ERROR, this, (err) => {
               console.log('加载失败:' + err);
           });

       }

       onStart() {
           this.owner.width = Laya.stage.width;
       }

       onEnable() {
           // console.log(this.divTop);
           // this.divTop.innerHTML = `<span>金币:123</span>`
           // this.divTop.style.width = this.owner.width;
           // this.divTop.style.align = "center";
           // this.divTop.style.height = 83;
           // this.divTop.style.bgColor = "blue"

           this.startBtn.disabled = true;
           // let timeline = Laya.TimeLine.from(this.logo,{x:0,y:this.logo.y},1000,null);
           this.gameText.x = Laya.stage.width / 2 - this.gameText.width / 2;
           let timeline = Laya.TimeLine.to(this.startBtn, {
               alpha: 1
           }, 1000, null);
           timeline.to(this.rankListBtn, {
               alpha: 1
           }, 1000, null);
           timeline.to(this.gameText, {
               alpha: 1
           }, 1000, null, 1000);
           timeline.play();
           timeline.on(Laya.Event.COMPLETE, this, () => {
               console.log('动画播放完毕!');
               this.startBtn.disabled = false;
               this.rankListBtn.disabled = false;
               timeline.destroy();
               this.timeline = null;
           });
           this.timeline = timeline;
       }

       onClick() {
           if (this.timeline) {
               this.timeline.gotoTime(5000);
           }
       }

       onDisable() {}

   }

   class GameScene extends BaseScript {

       constructor() { 
           super(); 
           /** @prop {name:returnBtn, tips:"返回按钮", type:Node, default:null}*/
           let returnBtn;
           /** @prop {name:scoreView, tips:"分数视图", type:Node, default:null}*/
           let scoreView;
           /** @prop {name:wall, tips:"墙", type:Node, default:null}*/
           let wall;
           /** @prop {name:bodyBurst, tips:"身体爆炸动画", type:Prefab, default:null}*/
           let bodyBurst;

           this.score = 0;//当前分数

           this.foodNum = 0;//当前食物数
           
       }

       onAwake(){
           super.onAwake();
           GameSceneRuntime.instance.startGame();
           if(Laya.Browser.onMiniGame){
               wx.showToast({title:'hiGameScene'});
           }
       }
       onStart() {
           console.log('start');
           this.onLoadComplete();

           this.returnBtn.clickHandler = Laya.Handler.create(this,(e)=>{
               Laya.Scene.open('init.scene');
           });
       }
       
       onLoadComplete(){
           //播放bgm
           // this.bgm = Laya.SoundManager.playSound("sound/bgm.mp3",1,Laya.Handler.create(this,()=>{
           //     console.log('播放完毕')
           // }))
           
           
       }
       onDestroy(){
           console.log('destory');
           let bgm = this.bgm;
           if(bgm){
               bgm.stop();
           }
       }

       onDisable() {
           console.log('disabled');
       }
   }

   class SceneScale extends Laya.Scene {

       constructor() { 
           super(); 
           
       }

       onAwake(){
           
       }
       
       onEnable() {
           // this.width = Laya.stage.width;
           // this.pos(0,0);
           console.log("当前为:["+this.name + "]场景");
           if(this.name =='init_scene'){
               this.loadImage('images/s1-background.jpg',Laya.Handler.create(this,()=>{
                   console.log("图片加载完毕!");
               }));
           }
           if(this.name =='game_scene'){
               //this.zOrder = -10
               // this.loadImage('images/s1-background.jpg',Laya.Handler.create(this,()=>{
               //     console.log("图片加载完毕!");
               // }))
           }
       }

       onDisable() {
       }
   }

   class Bullet extends BaseScript{

       constructor() { 
           super(); 
           /** @prop {name:velocity, tips:"子弹速度", type:Number, default:10}*/
           this.velocity = 5;
           this.rotation;
           /**
            * 蛇对象
            */
           this.snakeScript;

           /**
            * 蛇节点
            */
           this.snake;

           /**
            * 子弹伤害
            */
           this.damage = 1;

           /**
            * 子弹类型
            */
           this.type = 'normal';

           /**
            * 子弹级别
            */
           this.level;
       }

       /**
        * 初始化伤害数值
        */
       initDamage(){
           switch (this.type) {
               case 'normal':
                   this.damage = 2;
                   break;
               default:
                   break;
           }
           this.damage = Math.ceil(this.level * this.damage);
       }

       /**
        * 初始化皮肤
        */
       initSkin(){
           this.owner.loadImage("images/body" + this.snakeScript.colorNum + ".png", 0, 0, 0, 0, Laya.Handler.create(this,()=>{
               console.log('loaded');
           }));
       }

       onTrigger(snake){
           console.log(snake.script.index + '碰到');
       }

       onTriggerEnter(other,self){
           
           //伤害了身体
           if(other.name == 'body_collider'){
               let otherOnwer = other.owner;
               let otherScript = otherOnwer.script;
               let otherSnake = otherScript.snake;
               let otherSnakeScript = otherSnake.script;
               //没打自己
               if(otherSnakeScript.index!=this.snakeScript.index){
                   self.owner.removeSelf();
                   this.snakeScript.plusScore(this.damage*5);
                   otherScript.ifDestory(self.owner);
               }
           }
           //伤害了头
           if(other.name == 'snake_collider'){
               let otherOnwer = other.owner;
               let otherScript = otherOnwer.script;
               let otherSnake = otherScript.snake;
               let otherSnakeScript = otherSnake.script;
               //没打自己
               if(otherSnakeScript.index!=this.snakeScript.index){
                   self.owner.removeSelf();
                   console.log('伤害了头');
                   if(!otherSnakeScript.dead){//没死扣血
                       otherSnakeScript.hp -= this.damage;
                       console.log(otherSnakeScript.hp);
                       //血量小于等于0,则自己死亡
                       if(otherSnakeScript.hp<=0){
                           otherOnwer.event("dead",this.snakeScript);
                       }
                   }
               }

           }
       }

       onAwake(){
           super.onAwake();

           this.owner.visible = false;
           this.wall = this.owner.parent;
           this.collider = this.owner.getComponent(Laya.CircleCollider);
           this.rigid = this.owner.getComponent(Laya.RigidBody);
       }

       onUpdate(){

           this.scaleCheck();
           let x = this.velocity*Math.cos(this.rotation * Math.PI / 180);
           let y = this.velocity*Math.sin(this.rotation * Math.PI / 180);
           this.owner.x +=x;
           this.owner.y +=y;

           if(this.owner.x + x + this.owner.width*this.snakeScript.curBodySize/2 < this.wall.width && this.owner.x + x >= this.owner.width*this.snakeScript.curBodySize/2){

           } else {
               this.owner.removeSelf();
           }

           if(this.owner.y + y + this.owner.height*this.snakeScript.curBodySize/2 < this.wall.height && this.owner.y + y >= this.owner.height*this.snakeScript.curBodySize/2){

           } else {
               this.owner.removeSelf();
           }
       }

       scaleCheck(){
           this.owner.scale(this.snakeScript.curBodySize,this.snakeScript.curBodySize);
       }
       
       onEnable() {
           this.initSkin();
           this.initDamage();
           
           this.owner.x = this.snake.x;
           this.owner.y = this.snake.y;
           this.rotation = this.snake.rotation;
           this.scaleCheck();
           this.owner.visible = true;

           let x = this.velocity*Math.cos(this.rotation * Math.PI / 180);
           let y = this.velocity*Math.sin(this.rotation * Math.PI / 180);
           // this.owner.x +=x;
           // this.owner.y +=y;
           // this.rigid.setVelocity({x:x,y:y})
       }

       onDisable() {
           Laya.Pool.recover('bullet',this.owner);
       }
   }

   class Trigger extends BaseScript{
       constructor() { 
           super(); 
           
       }

       onAwake(){
           super.onAwake();
           this.wallScript = this.gameScene.wall.script;
       }

       onUpdate(){
           let snakes = this.wallScript.snakes;
           if(snakes){
               snakes.forEach(snake=>{
                   if(snake){
                       let snakeScript = snake.getComponent(Laya.Script);
                       if(snakeScript && !snakeScript.dead){
                           if(!this.eating && Math.abs(snake.x-this.owner.x)-this.owner.width/2<snakeScript.eatScale && Math.abs(snake.y-this.owner.y)-this.owner.height/2<snakeScript.eatScale){
                               this.onTrigger(snake);
                           }

                       }
                   }
               });

           }
       }

       onTrigger(other){

       }
   }

   class Item extends Trigger {

       constructor() { 
           super(); 
           /**
            * 吃到道具的蛇
            */
           this.snake;
           this.eating = false;
           /**
            * 道具持续时间
            */
           this.duration = 10000;
       }
       
       onAwake() {
           super.onAwake();
           console.log('道具生成' + this.owner.name);
           
       }

       onEaten(snake){
           this.snake = snake;
           this.eating = true;
           this.effect(snake);
           this.owner.removeSelf();
       }

       /**
        * 产生的效果
        * @param {当前蛇} snake 
        */
       effect(snake){
           Laya.timer.loop(1000,this,this.minusTime);
       }

       minusTime(){
           this.duration-=1000;
           this.durationLabel.text = Number(this.duration/1000);
           if(this.duration<=0){
               Laya.timer.clear(this,this.minusTime);
               this.snake.script.stopScale = false;
               this.status.destroy();
           }
       }

       /**
        * 显示倒计时
        */
       showCountDownIcon(){
           this.status = new Laya.Image('images/mask.png');
           this.durationLabel = new Laya.Label();
           this.durationLabel.centerX = 0;
           this.durationLabel.centerY = 0;
           this.durationLabel.text = Number(this.duration/1000);
           this.status.width = 20;
           this.status.height = 20;
           this.status.addChild(this.durationLabel);
           if(!this.snake.script.currentPlayer)return;
           this.gameScene.statusPanel.addChild(this.status);
       }


       onUpdate(){
           super.onUpdate();
       }

       onTrigger(other){
           this.onEaten(other);
       }

       onDisable() {
           this.showCountDownIcon();
       }
   }

   class Magnet extends Item {

       constructor() { 
           super(); 
           this.name = '吸铁石';


           this.wallScript;

           /**
            * 状态
            */
           this.status;

           /**
            * 倒计时数字
            */
           this.durationLabel;
           
           this.statusImg = 'images/magnet.png';
       }

       
       effect(snake){
           super.effect(snake);
           snake.script.eatScale = 100;
           snake.script.stopScale = true;
           
       }
       
       onEnable() {
       }



       

       onDisable() {
           super.onDisable();
           Laya.Pool.recover('magnet',this.owner);
       }
   }

   class Food extends BaseScript {

       constructor() { 
           super(); 

           this.eating = false;

           this.animTime = 0;
       }

       onAwake(){
           super.onAwake();
           this.owner.zOrder = -1000;
           this.wall = this.owner.parent;
           this.wallScript = this.wall.script;
           
           this.colorNum = Math.floor(Math.random() * (6 - 1 + 1) + 1);
           this.owner.loadImage("images/bean" + this.colorNum + ".png", 0, 0, 0, 0, new Laya.Handler(this, this.loaded, null));
           this.owner.zOrder = 0;
           
           this.owner.pivot(this.owner.width / 2, this.owner.height / 2);
           this.owner.visible = true;

       }

       onUpdate(){
           let snakes = this.wallScript.snakes;
           if(snakes){
               snakes.forEach(snake=>{
                   if(snake){
                       let other = snake.getComponent(Laya.CircleCollider);
                       let self = this.owner.getComponent(Laya.CircleCollider);
                       let snakeScript = snake.getComponent(Laya.Script);
                       if(snakeScript && !snakeScript.dead){
                           if(!this.eating && Math.abs(snake.x-this.owner.x)<snakeScript.eatScale && Math.abs(snake.y-this.owner.y)<snakeScript.eatScale){
                               this.onEaten(snake);
                           }

                       }
                   }
               });

           }
       }

       async onEaten(snake){ 

           this.eating = true;
           
           let snakeScript = snake.getComponent(Laya.Script);
           //加分
           snakeScript.plusScore();
           snakeScript.plusFoodNum();
           

           this.animTime = 0;
           Laya.timer.frameLoop(1,this,this.foodAnime,[snake]);
       }

       foodAnime(snake){

           let snakeScript = snake.getComponent(Laya.Script);
           

           let self = this.owner;
           this.animTime++;
           self.x += (snakeScript.currentVelocity + 0.1) * Math.cos(Math.atan2(snake.y - self.y, snake.x - self.x));
           self.y += (snakeScript.currentVelocity + 0.1) * Math.sin(Math.atan2(snake.y - self.y, snake.x - self.x));


           
           if(this.animTime>=60){
               snakeScript.foodEat(this.owner);
               snakeScript.foods.push(this.owner);
               Laya.timer.clear(this,this.foodAnime);
               // clearInterval(timer)    
               this.eating = false;
               this.animTime = 0;

               if(snakeScript && !snakeScript.dead){
                   Laya.Pool.recover('food',self.removeSelf());
               }
           }
       }

       loaded(){
           console.log('加载完毕');
       }

   }

   class Snake extends BaseScript {

       constructor() { 
           super(); 
           /** @prop {name:snake, tips:"蛇", type:Node, default:null}*/
           let snake;
           /** @prop {name:snakeBody, tips:"蛇身", type:Prefab, default:null}*/
           let snakeBody;
           /** @prop {name:bulletRes, tips:"子弹资源", type:Prefab, default:null}*/
           let bulletRes;

           /** @prop {name:rigid, tips:"刚体", type:Node, default:null}*/
           let rigid;

           /** @prop {name:step, tips:"步长", type:Number, default:1}*/
           this.step = 1;
           
           /** @prop {name:velocity, tips:"初始速度", type:Number, default:1}*/
           this.velocity = 1;

           /** @prop {name:acceleratedVelocity, tips:"加速度", type:Number, default:1.2}*/
           this.acceleratedVelocity = 1.2;
           /**
            * 蛇编号
            */
           this.index = 0;
           
           this.snakeInitSize = 0.45;

           this.snakeSize = this.snakeInitSize;
           
           /**
            * 分数
            */
           this.score = 0;

           /**
            * 食物数
            */
           this.foodNum = 0;

           //当前速度
           this.currentVelocity = 0;

           //是否已经死亡
           this.dead = false;

           //是否为加速模式
           this.speedMode = false;

           //是否为玩家
           this.player = true;

           this.playerName = '张三';
           
           this.snakeBodyArr=[];

           //路径数组
           this.pathArr=[];

           /**
            * 吃食物范围
            */
           this.eatScale = 50;

           //初始身体大小
           this.initBodySize = .7;
           /**
            * 当前身体缩放大小
            */
           this.curBodySize = this.initBodySize;
           /**
            * 初始身体个数
            */
           this.initBodyNum = 10;
           /**
            * 当前身体个数
            */
           this.curBodyNum = this.initBodyNum;
           /**
            * 最大身体比例大小
            */
           this.maxBodySize = 2;

           /**
            * 最大身体个数
            */
           this.maxBodyNum = 20;

           /**
            * 体型变化程度
            */
           this.bodyStep = 0.01;

           this.foodNumPerBody = 10;//几分一个身体

           this.score = 0;//玩家分数

           this.killNum = 0;

           this.bodySpace = 10;//身体间距

           //是否为当前玩家
           this.currentPlayer = false;//当前玩家


           this.rotations = [];


           /**
            * 玩家蛇节点
            */
           this.playerSnake;

           /**
            * 所吃的所有食物数组
            */
           this.foods = [];
           /**
            * 所吃的食物临时数组,给蛇身
            */
           this._tmpFoods = [];

           /**
            * 是否开启AI
            */
           this.AI = false;

           /**
            * 血量
            */
           this.hp = 100;

           /**
            * 头类型
            */
           this.type = 'normal';

           this.cameraWidth;

           this.times = 0;

           this.lastTimes = 0;

           //当前蛇的颜色编号
           this.colorNum = Math.floor(Math.random() * (5 - 1 + 1) + 1);

           this.currentConcatIndex = -1;

           /**
            * 摇杆角度
            */
           this.targetR = 0;

           /**
            * 蛇蛇的角度
            */
           this.rotationTemp = 0;

           this.speedObj = [];

           this.stopScale = false;

       }

       reverseRotation() {
           this.targetR = this.rotation > 0 ? this.rotation - 180 : this.rotation + 180;
       }

       /**
        * 根据类型初始化血量
        */
       initHp(){
           switch (this.type) {
               case 'normal':
                   this.hp = 10;
                   break;
               default:
                   break;
           }
       }

       initSkin(){
           this.owner.loadImage("images/head" + this.colorNum + ".png", 0, 0, 0, 0, Laya.Handler.create(this,()=>{
               console.log('loaded');
           }));
       }

       onAwake(){
           super.onAwake();

           this.initSkin();


           this.collider = this.owner.getComponent(Laya.CircleCollider);
           this.cameraWidth = this.gameScene.width/2;
           this.wall = this.owner.parent;
           this.wallScript = this.wall.script;
           this.owner.zOrder = 1;
           this.snake = this.owner;

       }

       onEnable(){
           this.dead = false;
           this.initHp();
           this.curBodySize = this.initBodySize;
           this.scaleChange();
           this.onDead();
           this.pathArr = [];
           Laya.timer.loop(1,this,this.snakeLoop);

           this.snake.on('concat',this,(index)=>{
               console.log('concatafter:' + index);
               this.currentConcatIndex = index;
               this.bodyConcat();
           });
           this.snake.on('rotationChange',this,(rotation)=>{
               this.rotationChange(rotation);
           });
           this.snake.on('speedChange',this,(velocity)=>{
               this.speedChange(velocity);
           });
           //初始化位置
           this.positionChange();
           //初始化方向
           this.snake.rotation = 0;
           //初始化速度
           this.currentVelocity = this.velocity;
           //初始化身体
           this.bodyRes = Laya.loader.getRes(Global.SNAKEBODY_PREFAB_PATH);
           if(!this.bodyRes){
               console.log('重新加载蛇身资源');
               Laya.loader.load('res/sprite_snakebody1.prefab',Laya.Handler.create(this,(res)=>{
                   this.bodyRes = res;
                   this.initBody();
                   
                   // this.snakeBody = res.create();
               }));
           } else {
               this.initBody();
           }
       }

       rotationChange(rotation){
           if(!this.dead){
               this.targetR = rotation;
           }
       }

       onKeyUp(e){
           if(this.gameScene.gameStart && e.keyCode == Laya.Keyboard.SPACE){
               if(this.currentPlayer){
                   this.shoot();
               }
           }
       }

       /**
        * 射击子弹
        */
       shoot(){
           let bullet = Laya.Pool.getItemByCreateFun('bullet',this.bulletRes.create,this.bulletRes);


           let bulletScript = bullet.getComponent(Laya.Script);
           bulletScript.snake = this.owner;
           bulletScript.snakeScript = this;
           bulletScript.level = this.curBodySize;


           if(this.owner.parent){
               this.owner.parent.addChild(bullet);
           }
       }

       initBody(){
           for(let i = 0;i<this.initBodyNum;i++){
               let snakeBody = this.bodyRes.create();

               let bodyScript = snakeBody.getComponent(Laya.Script);
               bodyScript.snake = this.owner;
               bodyScript.foods = this.wallScript.getFoods(this.foodNumPerBody);


               bodyScript.index = this.snakeBodyArr.length;
               
               //添加身体
               let lastBody = this.snakeBodyArr[this.snakeBodyArr.length-1];
               this.wall.addChild(snakeBody);
               this.snakeBodyArr.push(snakeBody);
               this.scaleChange();
           }
           this.changeFoodNum(this.foodNumPerBody*this.initBodyNum);
       }

       //速度改变
       speedChange(velocity){
           this.currentVelocity = velocity;
       }

       positionChange(){
           let randX = Math.random();
           let randY = Math.random();
           let x = (randX>0.5?-100:100) + randX*this.owner.parent.width;
           let y = (randY>0.5?-100:100) + randY*this.owner.parent.height;
           this.owner.pos(x,y);
       }

       onDead(){
           //监听死亡
           this.owner.on('dead',this,(otherSnakeScript,msg)=>{

               console.log(msg);

               this.hp = 0;//hp归零
               this.dead = true;

               if(otherSnakeScript!=null){
                   otherSnakeScript.plusKillNum();
               }

               //死亡的身体
               let deadBodys = [].concat(this.snakeBodyArr);
               for(let i = 0;i<deadBodys.length;i++){
                   let body = deadBodys[i];
                   body.destroy();
               }

               this.owner.removeSelf();
               // if(this.currentPlayer){//显示得分
               //     this.gameScene.stopGame()

               // }
               
               //存储数据
               // new HttpUtils().post(`${Global.ctx}/common/snake_score/insert`,`name=${this.playerName}&score=${this.score}`,(data)=>{
               //     console.log(data);
               // },['token',Global.token,'code','snake'])
               
               

           });
       }

       touchWall(){
           //碰到墙了
           this.owner.event('dead',[null,'创强了!']);
       }

       /**
        * 蛇头移动
        */
       headMove(){
           this.owner.rotation = this.rotationTemp;

           if(this.speedMode){
               if(this.currentVelocity != this.velocity+this.acceleratedVelocity){
                   this.speedChange(this.velocity+this.acceleratedVelocity);
               }
           } else {
               if(this.currentVelocity != this.velocity){
                   this.speedChange(this.velocity);
               }
           }
           let x = this.currentVelocity * Math.cos(this.snake.rotation * Math.PI / 180);
           let y = this.currentVelocity * Math.sin(this.snake.rotation * Math.PI / 180);

           let pos = { x: this.owner.x, y: this.owner.y };
           let posBefore = { x: this.owner.x, y: this.owner.y };

           // console.log(this.owner.x,this.owner.y,this.wall.width);
           if(this.owner.x + x + this.owner.width*this.curBodySize/2 < this.wall.width && this.owner.x + x >= this.owner.width*this.curBodySize/2){
               this.owner.x += x;
               pos.x = this.owner.x;
           } else {
               this.touchWall();
           }
           if(this.owner.y + y + this.owner.height*this.curBodySize/2 < this.wall.height && this.owner.y + y >= this.owner.height*this.curBodySize/2){
               this.owner.y += y;
               pos.y = this.owner.y;
           } else {
               this.touchWall();
           }

           
           for (let index = 1; index <= this.currentVelocity; index++) {

               // if(this.snakeBodyArr.length){
               //     this.pathArr.unshift({x:this.snake.x,y:this.snake.y,rotation:this.snake.rotation})
               // }

               if(this.snakeBodyArr.length){
                   this.pathArr.unshift({
                       x: index * Math.cos(Math.atan2(pos.y - posBefore.y, pos.x - posBefore.x)) + posBefore.x
                       , y: index * Math.sin(Math.atan2(pos.y - posBefore.y, pos.x - posBefore.x)) + posBefore.y
                   });
               }
           }

       }

       AIMove(){
           if(this.AI && !this.dead){
               let player = this.playerSnake;
               let playerScript = player.script;


               

               if(GameUtils.distance(playerScript.owner.x,playerScript.owner.y,this.owner.x,this.owner.y) >= this.cameraWidth-100){
                   // console.log('接近',this.cameraWidth);
                   // this.owner.rotation = Math.atan2(this.owner.y - playerScript.owner.y, this.owner.x - playerScript.owner.x) * 180 / Math.PI
                   this.targetR = Math.atan2(playerScript.owner.y - this.owner.y, playerScript.owner.x - this.owner.x) * 180 / Math.PI;

                   
                   
                   Laya.timer.once(10,this,this.shoot);
                   
                   this.speedMode = true;
               } else {
                   if(GameUtils.distance(playerScript.owner.x,playerScript.owner.y,this.owner.x,this.owner.y) < this.cameraWidth/2){
                       // this.owner.rotation = Math.atan2(playerScript.owner.y - this.owner.y, playerScript.owner.x - this.owner.x) * 180 / Math.PI
                       this.targetR = Math.atan2(this.owner.y - playerScript.owner.y, this.owner.x - playerScript.owner.x) * 180 / Math.PI;
                       
                       this.speedMode = false;
                   } else {
                       // this.owner.rotation = Math.atan2(playerScript.owner.y - this.owner.y, playerScript.owner.x - this.owner.x) * 180 / Math.PI
                       //this.owner.rotation = Math.atan2(this.owner.y - playerScript.owner.y, this.owner.x - playerScript.owner.x) * 180 / Math.PI
                       // this.owner.rotation += Math.random() * GameUtils.randomSimbol();
                   }
               }
           }
       }

       stateCheck(){
           this.curBodyNum = this.snakeBodyArr.length;
           if(!this.stopScale){
               this.eatScale = this.owner.width/2 * this.curBodySize + 3;
           }
           this.bodySpace = this.owner.width * this.curBodySize;
       }

       /**
        * 蛇的循环
        */
       snakeLoop(){
           if(!this.dead && this.gameScene.gameStart){
               // this.scaleCheck();
               this.stateCheck();
               this.headMove();
               this.bodyMove();
               this.AIMove();
               this.rotationCheck();
           }
       }

       rotationCheck(){
           let perRotation = Math.abs(this.targetR - this.rotationTemp) < this.speedObj['rotation'] ? Math.abs(this.targetR - this.rotationTemp) : this.speedObj['rotation'];
           if (this.targetR < -0 && this.rotationTemp > 0 && Math.abs(this.targetR) + this.rotationTemp > 180) {
               perRotation = (180 - this.rotationTemp) + (180 + this.targetR) < this.speedObj['rotation'] ? (180 - this.rotationTemp) + (180 + this.targetR) : this.speedObj['rotation'];
               this.rotationTemp += perRotation;
           } else {
               this.rotationTemp += this.targetR > this.rotationTemp && Math.abs(this.targetR - this.rotationTemp) <= 180 ? perRotation : -perRotation;
           }
           this.rotationTemp = Math.abs(this.rotationTemp) > 180 ? (this.rotationTemp > 0 ? this.rotationTemp - 360 : this.rotationTemp + 360) : this.rotationTemp;
       }

       /**
        * 身体大小变化
        */
       scaleChange(){
           // this.owner.scale(this.curBodySize,this.curBodySize)
           Laya.Tween.to(this.owner,{scaleX:this.curBodySize,scaleY:this.curBodySize},200);
           for(let i = 0;i<this.snakeBodyArr.length;i++){
               let body = this.snakeBodyArr[i];
               if(body.parent){
                   // console.log(body);
                   Laya.Tween.to(body,{scaleX:this.curBodySize,scaleY:this.curBodySize},200);
                   // body.scale(this.curBodySize,this.curBodySize)
               }
           }
           this.speedObj["rotation"] = this.owner.width*this.curBodySize*.7;
       }

       //大小检查
       scaleCheck(){
           this.owner.scale(this.curBodySize,this.curBodySize);
           
           for(let i = 0;i<this.snakeBodyArr.length;i++){
               let body = this.snakeBodyArr[i];
               if(body.parent){
                   // console.log(body);
                   body.scale(this.curBodySize,this.curBodySize);
               }
           }

       }
       bodyConcat(){
           setTimeout(() => {
               this.snakeBodyArr.forEach((body,i)=>{
                   if(!body.parent){
                       this.snakeBodyArr.splice(i,1);
                   }
               });
           }, 10);
           // for(let index=this.currentConcatIndex;index<this.snakeBodyArr.length;index++){
           //     let body = this.snakeBodyArr[index];
           //     let lastBody = this.snakeBodyArr[index-1]
           //     body.x = lastBody.x + 5;
           //     body.y = lastBody.y + 5;
           // }
           // for(let i = 0; i<this.snakeBodyArr.length;i++){
           //     let body = this.snakeBodyArr[i]
           //     body.script.index = i;
           // }
       }
       /**
        * 蛇身移动
        */
       bodyMove(){
           
           if(this.dead){
               return;
           }
           if(this.pathArr.length){

               for(let index=0;index<this.snakeBodyArr.length;index++){
                   let body = this.snakeBodyArr[index];
                   let bodyScript = body.getComponent(Laya.Script);
                   // console.log(this.playerName+"当前蛇身下标"+bodyScript.index);
                   //当前身体需要获取的路径下标(第几个帧时,蛇走了index+1*body.width个像素)
                   let curIndex = Math.ceil((index+1)*((this.bodySpace)/this.step));
                   // console.log(curIndex)
                   if(this.pathArr[curIndex]){
                       let path = this.pathArr[curIndex];
                       let p = new Laya.Point(path.x,path.y);
                       if(index<this.currentConcatIndex || this.currentConcatIndex==-1){
                           
                           body.x = p.x;
                           body.y = p.y;
                           body.visible = true;

                       } else {
                           Laya.Tween.to(body,{x:p.x,y:p.y},100,null,Laya.Handler.create(this,()=>{
                               this.currentConcatIndex=-1;
                               for(let i = 0; i<this.snakeBodyArr.length;i++){
                                   let body = this.snakeBodyArr[i];
                                   body.script.index = i;
                               }
                           }));
                       }

                   }
                   if(this.pathArr.length > (this.snakeBodyArr.length+1) * (this.bodySpace/this.step)){
                       this.pathArr.pop();
                   }
                   // let rigid = body.getComponent(Laya.RigidBody)
                   // rigid.setVelocity(this.rigid.linearVelocity)
               }
           }
       }

       addBody(foods){
           //如果超过身体限制,则不再增加身体
           if(this.snakeBodyArr.length>=this.maxBodyNum){
               return;
           }
           //长度增加
           let snakeBody = this.bodyRes.create();

           let bodyScript = snakeBody.getComponent(Laya.Script);
           if(this.index==1){
               console.log(this.index + '号玩家新增身体' + foods.length);
           }
           bodyScript.snake = this.owner;
           bodyScript.foods = foods;
           bodyScript.index = this.snakeBodyArr.length;
           //添加身体
           this.snakeBodyArr.push(snakeBody);
           this.wall.addChild(snakeBody);
           Laya.Tween.from(snakeBody,{scaleX:0,scaleY:0},100,Laya.Ease.strongIn);
       }

       /**
        * 掉落食物,体型随食物的掉落减小,食物数量减少
        */
       dropFood(){
           let dropFoods = [].concat(this._tmpFoods);
           for(let i = 0;i<dropFoods.length;i++){
               let offset = Math.random()*this.owner.width/2*this.curBodySize;
               let food = dropFoods[i];
               food.x = this.owner.x + offset*GameUtils.randomSimbol();
               food.y = this.owner.y + offset*GameUtils.randomSimbol();
               this.gameScene.wall.addChild(food);

           }
           //减少食物数量
           this.minusFoodNum(dropFoods.length);

           this._tmpFoods = [];
           //体型减小
           if(this.curBodySize>=this.maxBodySize){
               this.curBodySize -= this.bodyStep;
               this.scaleChange();
           }
       }

       /**
        * 吃食物,加体型
        * @param {食物节点} food 
        */
       foodEat(food){

           this._tmpFoods.push(food);
           this.wallScript.foodNum--;
           if(this._tmpFoods.length>=this.foodNumPerBody){
               this.addBody([].concat(this._tmpFoods));
               // this.foods.concat(this._tmpFoods)
               this._tmpFoods.length = 0;
               //体型变大
               if(this.curBodySize<this.maxBodySize){
                   this.curBodySize += this.bodyStep;
                   this.scaleChange();
               }
           }

       }
       
       onDisable() {
           Laya.timer.clear(this, this.snakeLoop);
           this.dropFood();
           Laya.timer.once(1000,this,()=>{
               if(this.currentPlayer){
                   Laya.Pool.recover('playerSnake',this.owner);
                   this.wallScript.createPlayer(this.owner);
               } else {
                   Laya.Pool.recover('AISnake',this.owner);
                   this.wallScript.createAI(this.index);
               }
               this.wallScript.snakes.splice(this.index,1);
           });
       }

       /**
        * 加分
        * @param {分数} score 
        */
       plusScore(score){
           score?this.score+=score:this.score++;
           if(this.currentPlayer){
               this.gameScene.updateNums(this);
           }
       }

       /**
        * 扣分
        * @param {分数} score 
        */
       minusScore(score){
           score?this.score-=score:this.score--;
           if(this.currentPlayer){
               this.gameScene.updateNums(this);
           }
       }

       /**
        * 改变食物数量
        * @param {食物数} foodNum 
        */
       changeFoodNum(foodNum){
           foodNum?(this.foodNum=foodNum):null;
           if(this.currentPlayer){
               this.gameScene.updateNums(this);
           }
       }

       /**
        * 增加食物数量
        * @param {食物数} foodNum 
        */
       plusFoodNum(foodNum){
           foodNum?this.foodNum+=foodNum:this.foodNum++;
           if(this.currentPlayer){
               this.gameScene.updateNums(this);
           }
       }

       /**
        * 减少食物数量数值
        * @param {食物数量} foodNum 
        */
       minusFoodNum(foodNum){

           if(this.foodNum>0){
               foodNum?this.foodNum-=foodNum:this.foodNum--;
           } else {
               this.foodNum = 0;
           }
           if(this.currentPlayer){
               this.gameScene.updateNums(this);
           }
       }
       /**
        * 增加击杀数量
        * @param {击杀数} foodNum 
        */
       plusKillNum(killNum){
           killNum?this.killNum+=killNum:this.killNum++;
           if(this.currentPlayer){
               this.gameScene.updateNums(this);
           }
       }

       /**
        * 减少击杀数量数值
        * @param {击杀数量} killNum 
        */
       minusKillNum(killNum){

           if(this.killNum>0){
               killNum?this.killNum-=killNum:this.killNum--;
           } else {
               this.killNum = 0;
           }
           if(this.currentPlayer){
               this.gameScene.updateNums(this);
           }
       }
       
   }

   class SnakeBody extends BaseScript {

       constructor() { 
           super(); 
           /**
            * 对应的蛇
            */
           this.snake;
           /**
            * 蛇脚本
            */
           this.snakeScript;
           /**
            * 每个身体存储的食物
            */
           this.foods = [];

           /**
            * 当前蛇身的下标
            */
           this.index;

           /**
            * 每个蛇身的血量
            */
           this.hp = 5;

           /**
            * 蛇身类型
            */
           this.type = 'normal';

           this.lastX;

           this.x;

           this.equalNum = 0;
       }

       /**
        * 根据类型初始化血量数值
        */
       initHP(){
           switch (this.type) {
               case 'normal':
                   this.hp = 5;
                   break;
               default:
                   break;
           }
       }

       /**
        * 初始化皮肤
        */
       initSkin(){
           this.owner.loadImage("images/body" + this.snakeScript.colorNum + ".png", 0, 0, 0, 0, Laya.Handler.create(this,()=>{
               console.log('loaded');
           }));
       }

       onAwake(){
           super.onAwake();
           
           this.owner.visible = false;
           
           this.snakeScript = this.snake.getComponent(Laya.Script);
           this.collider = this.owner.getComponent(Laya.CircleCollider);
       }

       onEnable() {
           this.initHP();
           this.initSkin();
       }



       /**
        * 判断子弹是否足矣造成身体死亡
        * @param {子弹节点} bullet 
        */
       ifDestory(bullet){
           let bulletScript = bullet.getComponent(Laya.Script);
           this.hp-=bulletScript.damage;
           if(this.hp<=0){
               let burstAni = Laya.Pool.getItemByCreateFun('bodyBurst',this.gameScene.script.bodyBurst.create,this.gameScene.script.bodyBurst);
               burstAni.pos(this.owner.x,this.owner.y);
               this.owner.parent.addChild(burstAni);
               burstAni.play();
               burstAni.on(Laya.Event.COMPLETE,this,()=>{
                   burstAni.removeSelf();
                   Laya.Pool.recover('bodyBurst',burstAni);
               });
               // this.owner.removeSelf()
               this.owner.destroy();
           }
       }

       // onUpdate(){
       //     this.lastX = this.owner.x;
       // }
       // onLateUpdate(){
       //     Laya.timer.once(100,this,()=>{
       //         this.x = this.owner.x;
       //         if(this.lastX == this.x && this.x!=0){
       //             this.equalNum++;
       //             if(this.equalNum>50){
       //                 // this.owner.destroy()
       //                 // console.log(this.index + "蛇身出现BUG");
       //             }
       //             //if(this.owner.destroyed=='undefined'){
       //             //}
       //         } else {
       //             this.equalNum = 0;
       //         }
       //     })
       // }


       onDestroy() {
           this.snakeScript.snakeBodyArr.splice(this.index,1);
           this.snake.event('concat',this.index);
           this.dropFood();
       }

       /**
        * 掉落食物,体型随食物的掉落减小,食物数量减少
        */
       dropFood(){
           console.log('掉落了:'+this.foods.length);
           
           for(let i = 0;i<this.foods.length;i++){
               let offset = Math.random()*this.owner.width/2*this.snakeScript.curBodySize;
               let food = this.foods[i];
               food.x = this.owner.x + offset*GameUtils.randomSimbol();
               food.y = this.owner.y + offset*GameUtils.randomSimbol();
               this.gameScene.wall.addChild(food);

           }
           //减少食物数量
           this.snakeScript.minusFoodNum(this.foods.length);
           //体型减小
           if(this.snakeScript.curBodySize>=this.snakeScript.maxBodySize){
               this.snakeScript.curBodySize -= this.snakeScript.bodyStep;
               this.snakeScript.scaleChange();
           }
       }
   }

   /**This class is automatically generated by LayaAirIDE, please do not make any modifications. */

   class GameConfig {
       static init() {
           //注册Script或者Runtime引用
           let reg = Laya.ClassUtils.regClass;
   		reg("script/runtime/GameSceneRuntime.js",GameSceneRuntime);
   		reg("script/Common/CenterPos.js",CenterPos);
   		reg("script/GameScene/Wall.js",Wall);
   		reg("script/GameScene/GameOver.js",GameOver);
   		reg("script/GameScene/GameScene.js",GameScene);
   		reg("script/Common/SceneScale.js",SceneScale);
   		reg("script/GameControl.js",GameControl);
   		reg("script/GameScene/Bullet.js",Bullet);
   		reg("script/Items/Magnet.js",Magnet);
   		reg("script/GameScene/Food.js",Food);
   		reg("script/GameScene/Snake.js",Snake);
   		reg("script/GameScene/SnakeBody.js",SnakeBody);
       }
   }
   GameConfig.width = 960;
   GameConfig.height = 540;
   GameConfig.scaleMode ="fixedheight";
   GameConfig.screenMode = "horizontal";
   GameConfig.alignV = "middle";
   GameConfig.alignH = "center";
   GameConfig.startScene = "gameScene.scene";
   GameConfig.sceneRoot = "";
   GameConfig.debug = false;
   GameConfig.stat = false;
   GameConfig.physicsDebug = true;
   GameConfig.exportSceneToJson = true;

   GameConfig.init();

   class Main {
   	constructor() {
   		//根据IDE设置初始化引擎		
   		if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
   		else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
   		Laya["Physics"] && Laya["Physics"].enable();
   		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
   		Laya.stage.scaleMode = GameConfig.scaleMode;
   		Laya.stage.screenMode = GameConfig.screenMode;
   		Laya.stage.alignV = GameConfig.alignV;
   		Laya.stage.alignH = GameConfig.alignH;
   		//兼容微信不支持加载scene后缀场景
   		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

   		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
   		if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
   		if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
   		if (GameConfig.stat) Laya.Stat.show();
   		Laya.alertGlobalError(true);

   		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
   		Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);

   		if(Laya.Browser.onMiniGame){
   			Global.SysInfo = wx.getSystemInfoSync();
   			console.log(Global.SysInfo);
   		}
   	}

   	onVersionLoaded() {
   		//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
   		Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
   	}

   	onConfigLoaded() {
   		//加载IDE指定的场景
   		GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
   	}
   }

   function getToken(){
   	let http = new HttpUtils();
   	http.errorCallback = (e)=>{
   		console.log(e);
   		new Main();
   	};
   	http.get(`${Global.ctx}/token/getToken?code=snake`,(data)=>{
   		console.log(data);
   		Global.token = data;
   		new Main();
   		new Player(`${Global.ctx}/public/wxmini/guest`);
   	});
   }
   // new Main()
   getToken();

}());
