(function () {
    'use strict';

    class GameSceneRuntime extends Laya.Scene {

        constructor() { 
            super(); 
            GameSceneRuntime.instance = this;

            this.score = 0;
            this.foodNum = 0;
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
        }

        changeScore(score){
            this.score = score;
            this.scoreText.text = this.score;
        }

        plusScore(score){
            score?this.score+=score:this.score++;
            this.scoreText.text = this.score;
        }

        minusScore(score){
            score?this.score+=score:this.score++;
            this.scoreText.text = this.score;
        }

        changeFoodNum(foodNum){
            this.foodNum = foodNum;
            this.foodNumText.text = this.foodNum;
        }

        plusFoodNum(foodNum){
            foodNum?this.foodNum+=foodNum:this.foodNum++;
            this.foodNumText.text = this.foodNum;
        }

        minusFoodNum(foodNum){
            foodNum?this.foodNum+=foodNum:this.foodNum++;
            this.foodNumText.text = this.foodNum;
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



            this.ctrlDefaultPos = {};

            this.foodNum = 0;//当前食物数量

            this.foods = [];
            
            this.foodOrder = 0;

            this.snakes = [];//蛇数组

            this.snakeMap = {};

            this.snakeNum = 2;//蛇的个数

            this.cursnakeNum = 0;//当前蛇的数量

            this.maxFood = 500;//最大食物数量

            //当前玩家蛇
            this.playerSnake;
        }



        //玩家操控的蛇准备完毕
        playerComplete(playerSnake){
            console.log('playercom');
            this.playerScript = playerSnake.getComponent(Laya.Script);
            this.btn_speedup.on('mousedown',this,this.speedUp);
            this.btn_speedup.on('mouseup',this,this.speedDown);
            this.gameScene.on("mouseup", this, this.ctrlRockerUp);
            this.gameScene.on("mousemove",this, this.ctrlRockerDown);
            console.log(this.gameScene);
        }

        onStageMouseDown(e){
            console.log(e);
            if(e.stageX+this.btn_ctrl.width/2<=this.gameScene.width/2 && e.stageX>this.btn_ctrl.width/2){
                this.btn_ctrl.x = e.stageX;
                this.btn_ctrl.y = e.stageY;
            }
        }

        onKeyDown(e){
            if(e.keyCode == 32){
                this.btn_speedup.selected = true;
                this.speedUp();
            }
        }
        
        onKeyUp(e){
            if(e.keyCode == 32){
                this.btn_speedup.selected = false;
                this.speedDown();
            }
        }

        ctrlRockerUp(){
            if (this.gameScene.mouseX <= this.gameScene.width / 2 + this.btn_ctrl.width/2) {
                this.btn_ctrl_rocker.visible = true;
                this.btn_ctrl_rocker_move.visible = false;
                this.btn_ctrl.x = this.ctrlDefaultPos.x;
                this.btn_ctrl.y = this.ctrlDefaultPos.y;

            }
        }
        ctrlRockerDown(){
            
            if (this.gameScene.mouseX <= this.gameScene.width / 2 + this.btn_ctrl.width/2) {
                this.btn_ctrl_rocker.visible = false;
                this.btn_ctrl_rocker_move.visible = true;
                if (GameUtils.distance(this.gameScene.mouseX, this.gameScene.mouseY, this.btn_ctrl.x, this.btn_ctrl.y) <= (this.gameScene.height)) {
                    this.btn_ctrl_rocker_move.pos(this.gameScene.mouseX, this.gameScene.mouseY);
                    this.playerSnake.rotation = Math.atan2(this.gameScene.mouseY - this.btn_ctrl.y, this.gameScene.mouseX - this.btn_ctrl.x) * 180 / Math.PI;
                } else {
                    this.btn_ctrl_rocker_move.pos(
                        this.btn_ctrl.x + (this.btn_ctrl.width / 2 - this.btn_ctrl.width / 2) * Math.cos(Math.atan2(this.gameScene.mouseY - this.btn_ctrl.y, this.gameScene.mouseX - this.btn_ctrl.x))
                        ,
                        this.btn_ctrl.y + (this.btn_ctrl.width / 2 - this.btn_ctrl.width / 2) * Math.sin(Math.atan2(this.gameScene.mouseY - this.btn_ctrl.y, this.gameScene.mouseX - this.btn_ctrl.x))
                    );
                }
            }
        }

        speedUp(e){
            this.playerScript.speedMode = true;
            this.playerScript.speedChange(this.playerScript.velocity+this.playerScript.acceleratedVelocity);
        }
        
        speedDown(e){
            this.playerScript.speedMode = false;
            this.playerScript.speedChange(this.playerScript.velocity);
        }

        onAwake(){
            super.onAwake();

            this.controlPad.getChildByName('view_right').getChildByName('btn_shoot').clickHandler = Laya.Handler.create(this,()=>{
                this.playerScript.shoot();
            },null,false);
            this.controlPad.onDestroy = ()=>{
                this.btn_speedup.off('mousedown',this,this.speedUp);
                this.btn_speedup.off('mouseup',this,this.speedDown);
                this.gameScene.off("mouseup", this, this.ctrlRockerUp);
                this.gameScene.off("mousemove",this, this.ctrlRockerDown);
            };
            this.btn_speedup.right = this.owner.width*0.05;
            // this.btn_speedup.width = this.btn_speedup.width*this.owner.width/Laya.stage.width*.3;
            // this.btn_speedup.height = this.btn_speedup.width*this.owner.width/Laya.stage.width*.3;
            this.btn_ctrl.left = this.owner.width*0.05;
            // this.btn_ctrl.scale();

            this.ctrlDefaultPos = {x:this.btn_ctrl.x,y:this.btn_ctrl.y};

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
            this.playerComplete(this.playerSnake);
            Laya.timer.frameLoop(1,this,this.mainLoop);
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

        snakesLoop(){
            this.snakes.forEach(snake=>{
                let snakeScript = snake.getComponent(Laya.Script);
                snakeScript.snakeLoop();
            });
        }

        /**
         * 主循环
         */
        mainLoop(){
            this.loadFood();
            this.stateCheck();
            this.snakesLoop();
            if(this.playerSnake){
                this.mapMove(this.playerScript);
            }
            
            
            
        }


        mapMove(snakeScript){
            //return;

            let mapScale = 0.5 / snakeScript.curBodySize < 0.7 ? 0.7 : 0.5 / snakeScript.curBodySize;


            // this.owner.x = -1 * (this.playerSnake.x + this.playerSnake.width / 2 - this.owner.width / 2) * mapScale + this.owner.width / 2
            // this.owner.y = -1 * (this.playerSnake.y + this.playerSnake.height / 2 - this.owner.height / 2) * mapScale + this.owner.height / 2

            //固定视角
            this.owner.x = -(this.playerSnake.x-this.owner.width / 2); 
            this.owner.y = -(this.playerSnake.y-this.owner.height / 2); 

            // this.owner.x = -1300
            // this.owner.y = -700
            // console.log(this.owner);
            // this.owner.scale(2, 2)

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

        loadSnake(){
            //食物加载完毕
            if(this.foodNum>=this.maxFood){
                //加载蛇
                for(let i = this.cursnakeNum;i<this.snakeNum;i++){
                    let snake = this.snakeRes.create();
                    let snakeScript = snake.getComponent(Laya.Script);
                    if(this.cursnakeNum==0){
                        this.playerSnake = snake;
                        snakeScript.currentPlayer = true;
                    } else{
                        snakeScript.AI = true;
                    }
                    snakeScript.index = i;
                    snakeScript.playerName = '张三' + this.cursnakeNum;

                    console.log(snakeScript);
        
        
                    this.owner.addChild(snake);
                    this.snakes.push(snake);
                    this.snakeMap[snake.getChildIndex()] = snake;
                    this.cursnakeNum++;

                }
                this.owner.event('init');
            }
        }
        
        onEnable() {
            
        }


        onDisable() {

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
                this.nicknameLabel.text = '游客1';
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

            this.score = 0;//当前分数

            this.foodNum = 0;//当前食物数
            
        }

        onAwake(){
            super.onAwake();
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
            console.log(this.shootBtn);
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

    class Bullet extends BaseScript {

        constructor() { 
            super(); 
            /** @prop {name:velocity, tips:"子弹速度", type:Number, default:10}*/
            this.velocity = 5;
            this.rotation;
            /**
             * 蛇对象
             */
            this.snakeScript;

            this.damage = 1;

            this.type = 'normal';
        }

        /**
         * 初始化伤害数值
         */
        initDamage(){
            switch (this.type) {
                case 'normal':
                    this.damage = 5;
                    break;
                default:
                    break;
            }
        }

        /**
         * 初始化皮肤
         */
        initSkin(){
            this.owner.loadImage("images/head" + this.snakeScript.colorNum + ".png", 0, 0, 0, 0, Laya.Handler.create(this,()=>{
                console.log('loaded');
            }));
        }

        onAwake(){
            super.onAwake();
            this.initSkin();
            this.initDamage();
            this.collider = this.owner.getComponent(Laya.CircleCollider);
            this.rigid = this.owner.getComponent(Laya.RigidBody);
            this.snake = this.owner.parent.getChildByName('sprite_snake');

            this.rotation = this.snake.rotation;
        }

        onUpdate(){
            let x = this.velocity*Math.cos(this.rotation * Math.PI / 180);
            let y = this.velocity*Math.sin(this.rotation * Math.PI / 180);
            this.owner.x +=x;
            this.owner.y +=y;
            this.scaleCheck();
        }

        scaleCheck(){
            this.owner.scale(this.snakeScript.curBodySize,this.snakeScript.curBodySize);
        }
        
        onEnable() {
        }

        onDisable() {
            Laya.Pool.recover('bullet',this.owner);
        }
    }

    class Food extends BaseScript {

        constructor() { 
            super(); 
            this.triggerDistance = 20;

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
                        if(!this.eating && Math.abs(snake.x-this.owner.x)<snakeScript.attackScale && Math.abs(snake.y-this.owner.y)<snakeScript.attackScale){
                            this.onEaten(snake);
                        }
                    }
                });

            }
        }

        async onEaten(snake){ 

            this.eating = true; 
            

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
                Laya.timer.clear(this,this.foodAnime);
                // clearInterval(timer)    
                this.eating = false;
                this.animTime = 0;

                if(snakeScript && !snakeScript.dead){
                    snakeScript.foodEat(this.owner);
                    snakeScript.foods.push(this.owner);
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

            /**
             * 蛇编号
             */
            this.index = 0;
            
            this.snakeInitSize = 0.45;

            this.snakeSize = this.snakeInitSize;
            
            /** @prop {name:acceleratedVelocity, tips:"加速度", type:Number, default:1.2}*/
            this.acceleratedVelocity = 1.2;
            

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
             * 攻击范围
             */
            this.attackScale = 50;

            //当前身体大小
            this.curBodySize = 0.5;
            //当前身体个数
            this.curBodyNum = 10;
            //最大身体大小
            this.maxBodySize = 2;

            this.foodNumPerBody = 5;//几分一个身体

            this.curScore = 0;//当前临时分数,为了计算蛇身

            this.score = 0;//玩家分数

            this.bodySpace = 10;//身体间距

            //是否为当前玩家
            this.currentPlayer = false;//当前玩家

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

            this.cameraWidth;

            this.times = 0;

            this.lastTimes = 0;

            //当前蛇的颜色编号
            this.colorNum = Math.floor(Math.random() * (5 - 1 + 1) + 1);

            this.currentConcatIndex = -1;

        }

        reverseRotation() {
            this.targetR = this.rotation > 0 ? this.rotation - 180 : this.rotation + 180;
        }

        onAwake(){
            super.onAwake();
            
            this.owner.on('concat',this,(index)=>{
                console.log('concatafter:' + index);
                this.currentConcatIndex = index;
                this.bodyConcat();
            });
            this.cameraWidth = this.gameScene.width/2;
            this.wall = this.owner.parent;
            this.wallScript = this.wall.script;
            this.owner.zOrder = 1;
            
            this.owner.loadImage("images/head" + this.colorNum + ".png", 0, 0, 0, 0, Laya.Handler.create(this,()=>{
                console.log('loaded');
            }));
            this.snake = this.owner;


            this.snake.on('directionChange',this,(direction)=>{
                this.directionChange(direction);
            });
            this.snake.on('speedChange',this,(velocity)=>{
                this.speedChange(velocity);
            });

            //初始化位置
            this.positionChange();
            //初始化速度
            this.currentVelocity = this.velocity;
            //初始化方向
            this.snake.rotation = 0;
            // this.directionChange(this.direction)

            
            
            this.GameScene = this.owner.scene.getComponent(Laya.Script);
            this.scoreView = this.GameScene.scoreView;

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

        onKeyUp(e){
            if(e.keyCode == Laya.Keyboard.SPACE){
                if(this.currentPlayer){
                    this.shoot();
                }
            }
        }

        shoot(){
            let bullet = this.bulletRes.create();
            bullet.snake = this.owner;
            bullet.x = this.owner.x;
            bullet.y = this.owner.y;

            bullet.getComponent(Laya.Script).snakeScript = this;


            this.owner.parent.addChild(bullet);
        }

        initBody(){
            for(let i = 0;i<this.curBodyNum;i++){
                let snakeBody = Laya.Pool.getItemByCreateFun('snakebody',this.bodyRes.create,this.bodyRes);
                snakeBody.loadImage("images/body" + this.colorNum + ".png", 0, 0, 0, 0, Laya.Handler.create(this,()=>{
                    console.log('loaded');
                }));

                let bodyScript = snakeBody.getComponent(Laya.Script);
                bodyScript.snake = this.owner;
                bodyScript.foods = this.wallScript.getFoods(5);
                bodyScript.index = this.snakeBodyArr.length;
                
                //添加身体
                let lastBody = this.snakeBodyArr[this.snakeBodyArr.length-1];
                this.wall.addChild(snakeBody);
                this.snakeBodyArr.push(snakeBody);
            }
        }

        //速度改变
        speedChange(velocity){
            this.currentVelocity = velocity;
        }

        positionChange(){
            let x = this.owner.parent.width/2;
            let y = this.owner.parent.height/2;
            this.owner.pos(x,y);
        }

        onTriggerEnter(other,self,contact){
            if(other.name=='collider_wall'){
                this.owner.event('dead','撞墙了!');
            }
        }

        onTriggerExit(other,self,contact){
            // if(other.name=='collider_snakebody'){
            //     console.log('exit')
            //     if(this.direction == '右' && this.snake.x < other.owner.x){

            //         this.owner.event('dead','撞身体上了!');
            //     }
            // }
        }

        onStart(){
            this.onDead();

        }

        onDead(){
            //监听死亡
            this.owner.on('dead',this,(msg)=>{
                this.dead = true;
                console.log(msg);
                if(this.currentPlayer){//显示得分
                    this.scoreView.visible = true;
                    let scoreLabel = this.scoreView.getChildByName('label_score');
                    scoreLabel.text = this.score;
                    this.wallScript.controlPad.destroy();

                }
                
                //存储数据
                // new HttpUtils().post(`${Global.ctx}/common/snake_score/insert`,`name=${this.playerName}&score=${this.score}`,(data)=>{
                //     console.log(data);
                // },['token',Global.token,'code','snake'])
                
                

            });
        }

        stop(){
            // this.rigid.setVelocity({x:0,y:0})
            Laya.timer.pause();
        }

        touchWall(){
            //碰到墙了
            this.owner.event('dead','创强了!');
        }

        /**
         * 蛇头移动
         */
        headMove(){
            
            if(this.dead){
                return;
            }
            if(this.speedMode){
                this.speedChange(this.velocity+this.acceleratedVelocity);
            } else {
                this.speedChange(this.velocity);
            }
            let x = this.currentVelocity * Math.cos(this.snake.rotation * Math.PI / 180);
            let y = this.currentVelocity * Math.sin(this.snake.rotation * Math.PI / 180);

            let pos = { x: this.owner.x, y: this.owner.y };
            let posBefore = { x: this.owner.x, y: this.owner.y };

            // console.log(this.owner.x,this.owner.y,this.wall.width);
            if(this.owner.x + x + this.owner.width*this.curBodySize/2 < this.wall.width && this.owner.x + x >= this.owner.width*this.curBodySize/2){
                this.owner.x += x;
            } else {
                //this.touchWall()
            }
            if(this.owner.y + y + this.owner.height*this.curBodySize/2 < this.wall.height && this.owner.y + y >= this.owner.height*this.curBodySize/2){
                this.owner.y += y;
            } else {
                //this.touchWall()
            }

            
            for (let index = 1; index <= this.currentVelocity; index++) {
                this.times++;
                // console.log(this.times-this.lastTimes);
                this.lastTimes = this.times;
                if(this.snakeBodyArr.length){
                    this.pathArr.unshift({x:this.snake.x,y:this.snake.y,rotation:this.snake.rotation});
                }

                // this.pathArr.unshift({
                //     x: index * Math.cos(Math.atan2(pos.y - posBefore.y, pos.x - posBefore.x)) + posBefore.x
                //     , y: index * Math.sin(Math.atan2(pos.y - posBefore.y, pos.x - posBefore.x)) + posBefore.y
                // })
            }

        }

        AIMove(){
            if(this.AI){
                let self = null;
                let player = null;
                let selfScript = null;
                let playerScript = null;
                this.wallScript.snakes.forEach(snake=>{
                    let snakeScript = snake.getComponent(Laya.Script);
                    if(snakeScript.index == this.owner.script.index){//自己
                        self = snake;
                        selfScript = snakeScript;
                    } else {
                        if(snakeScript.currentPlayer){
                            player = snake;
                            playerScript = snakeScript;
                            // if(GameUtils.distance(snake.x,snake.y,this.owner.x,this.owner.y) >= this.cameraWidth){
                            //     console.log('接近',this.cameraWidth);
                            //     // this.owner.rotation = Math.atan2(this.owner.y - snake.y, this.owner.x - snake.x) * 180 / Math.PI
                            //     this.owner.rotation = Math.atan2(snake.y - this.owner.y, snake.x - this.owner.x) * 180 / Math.PI
                            //     this.speedMode = true;
                            // } else {
                            //     if(GameUtils.distance(snake.x,snake.y,this.owner.x,this.owner.y) < this.cameraWidth/2-100){
                            //         console.log('远离');
                            //         this.owner.rotation = Math.atan2(this.owner.y - snake.y, this.owner.x - snake.x) * 180 / Math.PI
                            //         // this.owner.rotation = Math.atan2(snake.y - this.owner.y, snake.x - this.owner.x) * 180 / Math.PI
                                    
                            //         this.speedMode = false;
                            //     }
                            // }
                            

                        }

                    }
                });

                if(GameUtils.distance(playerScript.owner.x,playerScript.owner.y,this.owner.x,this.owner.y) >= this.cameraWidth){
                    // console.log('接近',this.cameraWidth);
                    // this.owner.rotation = Math.atan2(this.owner.y - playerScript.owner.y, this.owner.x - playerScript.owner.x) * 180 / Math.PI
                    this.owner.rotation = Math.atan2(playerScript.owner.y - this.owner.y, playerScript.owner.x - this.owner.x) * 180 / Math.PI;
                    this.speedMode = true;
                } else {
                    if(GameUtils.distance(playerScript.owner.x,playerScript.owner.y,this.owner.x,this.owner.y) < this.cameraWidth/2-100){
                        this.owner.rotation = Math.atan2(this.owner.y - playerScript.owner.y, this.owner.x - playerScript.owner.x) * 180 / Math.PI;

                        // this.owner.rotation = Math.atan2(playerScript.owner.y - this.owner.y, playerScript.owner.x - this.owner.x) * 180 / Math.PI
                        
                        this.speedMode = false;
                    } else {
                        //this.owner.rotation = Math.atan2(this.owner.y - playerScript.owner.y, this.owner.x - playerScript.owner.x) * 180 / Math.PI
                        // this.owner.rotation += Math.random() * GameUtils.randomSimbol();
                    }
                }
            }
        }

        stateCheck(){
            this.curBodyNum = this.snakeBodyArr.length;
            this.attackScale = this.owner.width * this.curBodySize + 10;
            this.bodySpace = this.owner.width * this.curBodySize ;
            
        }

        /**
         * 蛇的循环
         */
        snakeLoop(){
            this.scaleCheck();
            this.stateCheck();
            this.headMove();
            this.bodyMove();
            this.AIMove();
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
            setInterval(() => {
                this.snakeBodyArr.forEach((body,i)=>{
                    if(!body.parent){
                        this.snakeBodyArr.splice(i,1);
                    }
                });
            }, 1000);
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
            //长度增加
            let snakeBody = Laya.Pool.getItemByCreateFun('snakebody',this.bodyRes.create,this.bodyRes);
            snakeBody.loadImage("images/body" + this.colorNum + ".png", 0, 0, 0, 0, Laya.Handler.create(this,()=>{
                console.log('loaded');
            }));
            let bodyScript = snakeBody.getComponent(Laya.Script);
            if(this.index==1){
                console.log(this.index + '号玩家新增身体',snakeBody);
            }
            bodyScript.snake = this.owner;
            bodyScript.foods = foods;
            bodyScript.index = this.snakeBodyArr.length;

            
            Laya.Tween.from(snakeBody,{scaleX:0,scaleY:0},200,Laya.Ease.strongIn);
            //添加身体
            let lastBody = this.snakeBodyArr[this.snakeBodyArr.length-1];
            this.wall.addChild(snakeBody);
            this.snakeBodyArr.push(snakeBody);

            
            
        }

        /**
         * 吃食物,加分,加体型
         * @param {食物节点} food 
         */
        foodEat(food){
            //加分
            GameSceneRuntime.instance.plusScore();
            GameSceneRuntime.instance.plusFoodNum();
            this._tmpFoods.push(food);
            this.wallScript.foodNum--;
            if(this._tmpFoods.length>=this.foodNumPerBody){
                this.addBody(this._tmpFoods);
                this.foods.concat(this._tmpFoods);
                this._tmpFoods.length = 0;
                //体型变大
                if(this.curBodySize<this.maxBodySize){
                    this.curBodySize += 0.02;
                }
            }

        }
        
        onDisable() {
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
             * 每个身体存储的食物
             */
            this.foods = [];

            /**
             * 当前蛇身的下标
             */
            this.index;

            this.hp = 5;

            this.lastX;

            this.x;

            this.equalNum = 0;
        }
        onAwake(){
            super.onAwake();
            this.snakeScript = this.snake.script;
            this.collider = this.owner.getComponent(Laya.CircleCollider);
        }

        /**
         * 判断子弹是否足矣造成身体死亡
         * @param {子弹节点} bullet 
         */
        ifDestory(bullet){
            let bulletScript = bullet.getComponent(Laya.Script);
            this.hp-=bulletScript.damage;
            if(this.hp<=0){
                // this.owner.removeSelf()
                this.owner.destroy();
            }
        }

        onUpdate(){
            this.lastX = this.owner.x;
        }
        onLateUpdate(){
            Laya.timer.once(100,this,()=>{
                this.x = this.owner.x;
                if(this.lastX == this.x && this.x!=0){
                    this.equalNum++;
                    if(this.equalNum>50){
                        // this.owner.destroy()
                        console.log(this.index + "蛇身出现BUG");
                    }
                    //if(this.owner.destroyed=='undefined'){
                    //}
                } else {
                    this.equalNum = 0;
                }
            });
        }

        move(){
            // this.rigid.linearVelocity = this.snakeScript.rigid.linearVelocity;
        }

        onTriggerEnter(other,self){
            if(other.name == 'bullet_collider'){
                let otherScript = other.owner.snake.script;
                let bullet = other.owner;
                if(otherScript.playerName!=this.snakeScript.playerName){
                    console.log(this.index);
                    bullet.removeSelf();

                    this.ifDestory(bullet);
                    // this.owner.destroy()
                }
                // console.log(otherScript.playerName);
                // console.log(this.snakeScript.playerName);
            }
        }

        onTriggerExit(other,self){
            if(other.name == 'bullet_collider'){
                let otherScript = other.owner.snake.script;
                let bullet = other.owner;
                if(otherScript.playerName!=this.snakeScript.playerName){
                    console.log(other.name);

                }
            }
        }

        onTriggerStay(other,self){
            if(other.name == 'bullet_collider'){
                let otherScript = other.owner.snake.script;
                let bullet = other.owner;
                if(otherScript.playerName!=this.snakeScript.playerName){
                    console.log(other.name);

                }
            }
        }
        onEnable() {
        }

        onDestroy() {
            this.destroyedIndex = this.index;
            console.log(this.index +"蛇身已经销毁");
            this.dropFood();
            this.snakeScript.snakeBodyArr.splice(this.index,1);
            this.snake.event('concat',this.index);
            console.log('掉落后',this.snakeScript.snakeBodyArr,'当前蛇身个数:' + this.snakeScript.snakeBodyArr.length);
        }

        /**
         * 掉落食物,体型随食物的掉落减小
         */
        dropFood(){
            for(let i = 0;i<this.foods.length;i++){
                let offset = Math.random()*6;
                let food = this.foods[i];
                food.x = this.owner.x + offset*GameUtils.randomSimbol();
                food.y = this.owner.y + offset*GameUtils.randomSimbol();
                this.gameScene.wall.addChild(food);

                //体型减小
                if(this.snakeScript.curBodySize>=this.snakeScript.maxBodySize){
                    this.snakeScript.curBodySize -= 0.02;
                }
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
    	});
    }
    // new Main()
    getToken();

}());
