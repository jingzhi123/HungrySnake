(function () {
    'use strict';

    class BaseScript extends Laya.Script {

        constructor() { 
            super(); 
            /** @prop {name:gameName, tips:"游戏名称", type:String, default:贪吃蛇}*/
            let gameName = '贪吃蛇';
            
            let bgm;
        }
        
        onEnable() {
        }

        onDisable() {
        }
    }

    class BtnStartGame extends BaseScript {

        constructor() { 
            super(); 
            /** @prop {name:progressBar, tips:"进度条", type:Node, default:null}*/
            let progressBar;
            /** @prop {name:btn, tips:"布尔类型示例", type:Node, default:null}*/
            let btn;
            // 更多参数说明请访问: https://ldc2.layabox.com/doc/?nav=zh-as-2-4-0
        }
        
        onEnable() {
            //this.btn = this.owner;
            console.log(this.btn);
            
            //btn.clickHandler = Laya.Handler.create(this,this.onStartBtnClick,null,false)
        }

        onUpdate(e){
        }

        onClick(e){
            console.log('游戏开始:',this.owner);
            e.stopPropagation();
            this.onStartBtnClick();
        }

        onStartBtnClick(){
            
            console.log('游戏开始:',this.owner);
            this.progressBar.visible = true;
            let load = Laya.loader.load('sound/THUNDER LANDING.mp3',Laya.Handler.create(this,(data)=>{
                console.log(data);
            }),Laya.Handler.create(this,(num)=>{
                console.log(num);
                this.progressBar.value = num;
                if(num==1){
                    setTimeout(() => {
                        this.onLoadComplete();
                    }, 500);
                }
            }),Laya.Loader.SOUND);

        }

        onLoadComplete(){
            //播放bgm
            BaseScript.bgm = Laya.SoundManager.playSound("sound/THUNDER LANDING.mp3",1,Laya.Handler.create(this,()=>{
                console.log('播放完毕');
            }));
            
            //加载场景
            Laya.Scene.open('scene/gameMain.scene');
        }

        onDisable() {
        }
    }

    class Snake extends Laya.Script {

        constructor() { 
            super(); 
            /** @prop {name:snake, tips:"蛇", type:Node, default:null}*/
            let snake;

            /** @prop {name:step, tips:"速度", type:Number, default:0.01}*/
            let step = 0.01;

            let direction = '右';

        }
        
        onEnable() {
            this.step = 1;
            this.direction = '右';
            console.log(this.owner,this.snake);
        }

        onStart(){
            this.initDeadListener();
        }

        initDeadListener(){
            this.owner.once('dead',this,(msg)=>{
                console.log(msg);
            });
        }

        onUpdate(){
            switch (this.direction) {
                case '右':
                    this.snake.x += this.step;
                    // console.log(this.snake.x)
                    if(this.snake.x>=this.snake.scene.width-this.snake.width/2){
                        this.snake.x = this.snake.scene.width-this.snake.width/2;
                        this.owner.event('dead','撞到右墙了!');
                    }
                    break;
                case '左':
                    this.snake.x -= this.step;
                    // console.log(this.snake.x)
                    if(this.snake.x<=this.snake.width/2){
                        this.snake.x = this.snake.width/2;
                        this.owner.event('dead','撞到左墙了!');
                    }
                    break;
                case '上':
                    this.snake.y -= this.step;
                    // console.log(this.snake.y)
                    if(this.snake.y<=this.snake.height/2){
                        this.snake.y = this.snake.height/2;
                        this.owner.event('dead','撞到上墙了!');
                    }
                    break;
                case '下':
                    this.snake.y += this.step;
                    // console.log(this.snake.y)
                    if(this.snake.y>=this.snake.scene.height-this.snake.height/2){
                        this.snake.y = this.snake.scene.height-this.snake.height/2;
                        this.owner.event('dead','撞到下墙了!');
                    }
                    break;
            
                default:
                    break;
            }
        }

        onKeyUp(e){
            console.log(e);
            switch (e.keyCode) {
                case 37:
                    this.direction = '左';
                    break;
                case 38:
                    this.direction = '上';
                    break;
                case 39:
                    this.direction = '右';
                    break;
                case 40:
                    this.direction = '下';
                    break;
            
                default:
                    break;
            }
        }
        
        onDisable() {
        }
    }

    class GameControl extends BaseScript {

        constructor() { 
            super(); 
            /** @prop {name:logo, tips:"LOGO", type:Node, default:null}*/
            let logo;
            /** @prop {name:btn, tips:"开始按钮", type:Node, default:null}*/
            let btn;
        }
        onAwake(){
            console.log(this);
        }
        onEnable() {
            
            let text = this.addGameNameText();
            this.btn.disabled=true;
            let timeline = Laya.TimeLine.from(this.logo,{x:0,y:this.logo.y},1000,null);
            timeline.to(this.btn,{alpha:1},1000,null);
            timeline.to(text,{alpha:1},1000,null);
            timeline.play(0);
            timeline.on(Laya.Event.COMPLETE,this,()=>{
                console.log('动画播放完毕!');
                this.btn.disabled=false;
                timeline.destroy();
            });
            this.timeline = timeline;
        }

        addGameNameText(){
            let text = new Laya.Text();
            console.log(this);
            text.text = this.gameName;
            text.alpha = 0;
            text.fontSize = 20;
            text.color = '#c00000';
            text.x = 640/2;
            text.y = 14;
            this.owner.addChild(text);
            return text;
        }

        onClick(){
            this.timeline.gotoTime(3000);
        }

        onDisable() {
        }

        createBox() {
            //使用对象池创建盒子
            let box = Laya.Pool.getItemByCreateFun("dropBox", this.dropBox.create, this.dropBox);
            box.pos(Math.random() * (Laya.stage.width - 100), -100);
            this._gameBox.addChild(box);
        }

        onKeyUp(e) {
            //停止事件冒泡，提高性能，当然也可以不要
            e.stopPropagation();
            //舞台被点击后，使用对象池创建子弹
            // let snake = Laya.Pool.getItemByCreateFun("snake", this.snake.create, this.snake);
            var snake = Laya.Pool.getItemByClass('snanke',Snake);
            console.log(snake);
            //snake.pos(Laya.stage.mouseX, Laya.stage.mouseY);
            this._bg.addChild(snake);
        }
    }

    class GameMain extends BaseScript {

        constructor() { 
            super(); 
            /** @prop {name:returnBtn, tips:"返回按钮", type:Node, default:null}*/
            let returnBtn;
        }
        onAwake(){
            // this.progressBar.visible = true;
            // let load = Laya.loader.load('sound/THUNDER LANDING.mp3',Laya.Handler.create(this,(data)=>{
            //     console.log(data)
            // }),Laya.Handler.create(this,(num)=>{
            //     console.log(num)
            //     this.progressBar.value = num;
            //     if(num==1){
            //         this.onLoadComplete()
            //     }
            // }),Laya.Loader.SOUND)
        }
        
        onEnable() {
            
            this.returnBtn.clickHandler = Laya.Handler.create(this,(e)=>{
                BaseScript.bgm.stop();
                this.destroy();
                Laya.Scene.open('init.scene');
            });
        }

        onStart(){
        }

        onDisable() {
        }
    }

    /**This class is automatically generated by LayaAirIDE, please do not make any modifications. */

    class GameConfig {
        static init() {
            //注册Script或者Runtime引用
            let reg = Laya.ClassUtils.regClass;
    		reg("script/BtnStartGame.js",BtnStartGame);
    		reg("script/GameControl.js",GameControl);
    		reg("script/GameMain.js",GameMain);
    		reg("script/Snake.js",Snake);
        }
    }
    GameConfig.width = 1136;
    GameConfig.height = 1136;
    GameConfig.scaleMode ="fixedwidth";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "scene/gameMain.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
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
    //激活启动类
    new Main();

}());
