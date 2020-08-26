(function () {
    'use strict';

    class BaseScript extends Laya.Script {
        
        constructor() { 
            super(); 
            let eventDispatcher;
            /** @prop {name:gameName, tips:"游戏名称", type:String, default:贪吃蛇}*/
            let gameName = '贪吃蛇';
            
            let bgm;
        }

        getEventDispatcher(){
            if(this.eventDispatcher==null){
                this.eventDispatcher = new Laya.EventDispatcher();
            }
            return this.eventDispatcher;
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
            BaseScript.progressBar = this.progressBar;
            console.log('进度:'+this.progressBar.value);
            
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
                        //加载场景
                        Laya.Scene.open('scene/gameMain.scene');

                    }, 500);
                }
            }),Laya.Loader.SOUND);

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
            /** @prop {name:rankListBtn, tips:"排行榜按钮", type:Node, default:null}*/
            let rankListBtn;
            /** @prop {name:rankListCloseBtn, tips:"排行榜关闭按钮", type:Node, default:null}*/
            let rankListCloseBtn;
            /** @prop {name:gameText, tips:"游戏标题", type:Node, default:null}*/
            let gameText;
            /** @prop {name:scoreList, tips:"分数列表", type:Node, default:null}*/
            let scoreList;
        }
        onAwake(){
            //排行榜打开
            this.rankListBtn.clickHandler = Laya.Handler.create(this,(e)=>{
                console.log('打开排行!');
                let scoreArr = Laya.LocalStorage.getJSON('scoreArr');
                this.scoreList.visible = true;
                let scorePanel = this.scoreList.getChildByName('panel_score');
                console.log(Laya.LocalStorage.items);
                scoreArr.sort((a,b)=>{
                    return b.score-a.score;
                });
                scoreArr.forEach((s,i)=>{
                    let text = new Laya.Text();
                    text.width = scorePanel.width;
                    text.fontSize = 18;
                    text.height = 20;
                    text.x = 0;
                    text.y = i*text.height+ 20;
                    text.align = 'center';
                    text.valign = 'top';
                    text.text = '姓名: ' + s.name + " , 分数: " + s.score;
                    scorePanel.addChild(text);
                });
            },null,false);
            //排行榜关闭
            this.rankListCloseBtn.clickHandler = Laya.Handler.create(this,(e)=>{
                this.scoreList.visible = false;
            },null,false);
            
        }
        onEnable() {
            
            this.btn.disabled=true;
            let timeline = Laya.TimeLine.from(this.logo,{x:0,y:this.logo.y},1000,null);
            timeline.to(this.btn,{alpha:1},1000,null);
            timeline.to(this.rankListBtn,{alpha:1},1000,null);
            timeline.to(this.gameText,{alpha:1},1000,null,1000);
            timeline.play();
            timeline.on(Laya.Event.COMPLETE,this,()=>{
                console.log('动画播放完毕!');
                this.btn.disabled=false;
                this.rankListBtn.disabled=false;
                timeline.destroy();
                this.timeline=null;
            });
            this.timeline = timeline;
        }

        onClick(){
            if(this.timeline){
                this.timeline.gotoTime(5000);
            }
        }

        onDisable() {
        }

    }

    class ScoreControl extends Laya.Script {

        constructor() { 
            super(); 
            /** @prop {name:score, tips:"分数", type:Number, default:0}*/
            this.score = 0;
            /** @prop {name:scoreText, tips:"分数Text", type:Node, default:null}*/
            let scoreText;
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

        onAwake(){
            this.changeScore(this.score);
        }

        onEnable() {
        }

        onDisable() {
        }
    }

    class Snake extends Laya.Script {

        constructor() { 
            super(); 
            /** @prop {name:snake, tips:"蛇", type:Node, default:null}*/
            let snake;
            /** @prop {name:snakeBody, tips:"蛇身", type:Prefab, default:null}*/
            let snakeBody;
            /** @prop {name:scoreList, tips:"分数列表", type:Node, default:null}*/
            let scoreList;

            /** @prop {name:rigid, tips:"刚体", type:Node, default:null}*/
            let rigid;

            /** @prop {name:wall, tips:"墙", type:Node, default:null}*/
            let wall;

            /** @prop {name:food, tips:"食物", type:Node, default:null}*/
            let food;

            /** @prop {name:step, tips:"步长", type:Number, default:1}*/
            this.step = 1;

            /** @prop {name:direction, tips:"初始方向", type:String, default:"右"}*/
            this.direction = '右';
            
            /** @prop {name:frame, tips:"速率(刷新率)", type:Number, default:1}*/
            this.frame = 1;
            
            /** @prop {name:velocity, tips:"初始速度", type:Number, default:1}*/
            this.velocity = 2;
            
            
            /** @prop {name:acceleratedVelocity, tips:"加速度", type:Number, default:1}*/
            this.acceleratedVelocity = 1;
            
            //按键时间
            this.keyPressTime=0;

            //按键延迟多久加速
            this.keyPressDelay = 6;

            //当前速度
            this.currentVelocity = 0;

            //是否已经死亡
            this.dead = false;

            //是否为加速模式
            this.speedMode = false;

            
            this.snakeBodyArr=[];

            //路径数组
            this.pathArr=[];

            this.snakeLength = 10;
            
        }

        onAwake(){
            console.log('awake');
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
            this.directionChange(this.direction);

            Laya.timer.frameLoop(this.frame,this,this.mainLoop);

            this.foodScript = this.food.getComponent(Laya.Script);
            this.scoreScript = this.foodScript.scoreText.getComponent(Laya.Script);
            this.gameMain = this.owner.scene.getComponent(Laya.Script);
            this.scoreView = this.gameMain.scoreView;

            Laya.loader.load('res/sprite_snakebody.prefab',Laya.Handler.create(this,(res)=>{
                this.bodyRes = res;
                // this.snakeBody = res.create();
                // console.log(this.snakeBody)
            }));

        }

        //方向改变
        directionChange(direction){
            switch (direction) {
                case '右':
                    if(this.direction=='左'){
                        return;
                    } 
                    this.snake.rotation = 90;
                    //this.rigid.setVelocity({x:this.currentVelocity,y:0})
                    break;
                case '左':
                    if(this.direction=='右'){
                        return;
                    }
                    this.snake.rotation = -90;
                    //this.rigid.setVelocity({x:-this.currentVelocity,y:0})
                    break;
                case '上':
                    if(this.direction=='下'){
                        return;
                    }
                    this.snake.rotation = 180;
                    //this.rigid.setVelocity({x:0,y:-this.currentVelocity})
                    break;
                case '下':
                    if(this.direction=='上'){
                        return;
                    }
                    this.snake.rotation = 0;
                    //this.rigid.setVelocity({x:0,y:this.currentVelocity})
                    break;
            
                default:
                    break;
            }
            this.direction = direction;
        }
        //速度改变
        speedChange(velocity){
            this.currentVelocity = velocity;
        }

        positionChange(){
            this.owner.x = Math.random()*(this.owner.parent.width-10).toFixed(0);
            this.owner.y = Math.random()*(this.owner.parent.height-10).toFixed(0);
        }

        onTriggerEnter(other,self,contact){
            if(other.name=='collider_wall'){
                this.owner.event('dead','撞墙了!');
            }
            if(other.name=='collider_food'){
                this.addBody();
            }
        }



        onTriggerStay(other,self,contact){
            console.log('stay');
        }

        onTriggerExit(other,self,contact){
            if(other.name=='collider_snakebody'){
                console.log('exit');
                if(this.direction == '右' && this.snake.x < other.owner.x){

                    this.owner.event('dead','撞身体上了!');
                }
            }
        }

        onStart(){
            this.onDead();
            console.log(this.rigid);
        }

        onDead(){
            //监听死亡
            this.owner.on('dead',this,(msg)=>{
                this.dead = true;
                console.log(msg);
                console.log(this.scoreView);
                this.scoreView.visible = true;
                let scoreLabel = this.scoreView.getChildByName('label_score');
                scoreLabel.text = this.scoreScript.score;
                let scoreArr = Laya.LocalStorage.getJSON('scoreArr');
                if(!scoreArr){
                    scoreArr = [{name:'张三',score:this.scoreScript.score}];
                } else {
                    scoreArr.push({name:'李四',score:this.scoreScript.score});
                }
                Laya.LocalStorage.setJSON('scoreArr',scoreArr);

                

                this.stop();
            });
        }

        stop(){
            // this.rigid.setVelocity({x:0,y:0})
            Laya.timer.pause();
        }

        mainLoop(){
            // this.move()
            this.headMove();
            this.bodyMove();
        }

        headMove(){
            let x = this.step * Math.sin(this.snake.rotation * Math.PI / 180);
            let y = this.step * Math.cos(this.snake.rotation * Math.PI / 180);

            let pos = { x: this.x, y: this.y };
            let posBefore = { x: this.x, y: this.y };

            for (let index = 1; index <= this.currentVelocity; index++) {

                this.snake.x += x;
                this.snake.y += y;
                if(this.snakeBodyArr.length){
                    this.pathArr.unshift({x:this.snake.x,y:this.snake.y,rotation:this.snake.rotation});
                }
            }
        }

        bodyMove(){
            if(this.pathArr.length){

                for(let index=0;index<this.snakeBodyArr.length;index++){
                    let body = this.snakeBodyArr[index];
                    //当前身体需要获取的路径下标(第几个this.frame帧时,蛇走了index+1*body.width个像素)
                    let curIndex = Math.ceil((index+1)*((body.width*this.frame)/this.step));
                    console.log(curIndex);
                    if(this.pathArr[curIndex]){
                        let path = this.pathArr[curIndex];
                        
                        let p = new Laya.Point(path.x,path.y);
                        console.log(body.rotation);
                        body.x = p.x;
                        body.y = p.y;

                    }
                    if(this.pathArr.length > (this.snakeBodyArr.length+1) * (body.width/this.step)){
                        this.pathArr.pop();
                    }
                    // let rigid = body.getComponent(Laya.RigidBody)
                    // rigid.setVelocity(this.rigid.linearVelocity)
                }
            }
        }

        addBody(){
            //长度增加
            let snakeRigidBody = this.rigid;
            let snakeBody = this.bodyRes.create();
            let snakeBodyRigidBody = snakeBody.getComponent(Laya.RigidBody);
            snakeBodyRigidBody.type = 'kinematic';
            snakeBodyRigidBody.collidConnected = true;

            let bodyRopeJoint = snakeBody.getComponent(Laya.RopeJoint);
            bodyRopeJoint.maxLength = this.snakeLength;

            
            // snakeBody.x = this.snake.x;
            // snakeBody.y = this.snake.y;
            if(!this.snakeBodyArr.length){
                bodyRopeJoint.otherBody = snakeRigidBody;
                this.wall.addChild(snakeBody);

            } else {
                let lastBody = this.snakeBodyArr[this.snakeBodyArr.length-1];
                let lastBodyRigidBody = lastBody.getComponent(Laya.RigidBody);
                
                bodyRopeJoint.otherBody = lastBodyRigidBody;

                this.wall.addChild(snakeBody);
            }
            
            this.snakeBodyArr.push(snakeBody);

            //改变位置
            this.foodScript.positionChange();
            //加分
            this.scoreScript.plusScore();
        }

        onUpdate(){
            
        }

        onKeyDown(e){
            if(this.dead)return;
            let predirection = this.direction;
            switch (e.keyCode) {
                case 37:
                    this.snake.event('directionChange','左');
                    break;
                case 38:
                    this.snake.event('directionChange','上');
                    break;
                case 39:
                    this.snake.event('directionChange','右');
                    break;
                case 40:
                    this.snake.event('directionChange','下');
                    break;
            
                default:
                    break;
            }

            console.log(this.speedMode);

            if(this.speedMode){
                this.snake.event('speedChange',this.velocity+this.acceleratedVelocity);
            } else {
                this.headMove(this.currentVelocity);
                if(this.keyPressTime>this.keyPressDelay){
                    this.speedMode = true;
                    this.snake.event('speedChange',this.velocity+this.acceleratedVelocity);
                }
            }

            //方向改变
            if(this.direction!=predirection){
                this.keyPressTime = 0;
                this.snake.event('directionChange',this.direction);
            } else {
                this.keyPressTime++;
            }

            this.speedMode = this.keyPressTime>2;
            
            // Laya.timer.once(500,this,Laya.Handler.create(this,()=>{
            //     this.move(this.velocity+this.acceleratedVelocity)
            // }))
            
        }

        onKeyPress(){
            console.log(1);
        }

        onKeyUp(e){
            if(this.dead)return;
            
            if(!this.speedMode){
                this.keyPressTime = 0;
            }
            this.snake.event('speedChange',this.velocity);
            
            Laya.timer.once(1000,this,()=>{
                console.log('恢复速度');
                this.speedMode = false;
            },null,true);
        }
        
        onDisable() {
        }
    }

    class Food extends Laya.Script {

        constructor() { 
            super(); 
            /** @prop {name:snake, tips:"蛇", type:Node, default:null}*/
            let snake;
            /** @prop {name:scoreText, tips:"分数Text", type:Node, default:null}*/
            let scoreText;
            
            
        }

        onAwake(){
            this.boxCollider = this.owner.getComponent(Laya.BoxCollider);
        }
        
        positionChange(){

            this.owner.x = Math.random()*(this.owner.parent.width-10).toFixed(0);
            this.owner.y = Math.random()*(this.owner.parent.height-10).toFixed(0);

        }

        onTriggerEnter(other,self,contact){
            
        }

        onEnable() {
            this.positionChange();
            console.log(this.owner);
            
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
                console.log('return');
                Laya.timer.resume();
                Laya.Scene.open('init.scene');
            });
            this.retryBtn.clickHandler = Laya.Handler.create(this,(e)=>{
                Laya.timer.resume();
                Laya.Scene.open('scene/gameMain.scene');
            });
        }

        onDisable() {
        }
    }

    class GameMain extends BaseScript {

        constructor() { 
            super(); 
            /** @prop {name:returnBtn, tips:"返回按钮", type:Node, default:null}*/
            let returnBtn;
            /** @prop {name:scoreView, tips:"分数视图", type:Node, default:null}*/
            let scoreView;
        }

        onStart() {
            console.log('start');
            this.onLoadComplete();

            this.returnBtn.clickHandler = Laya.Handler.create(this,(e)=>{
                Laya.timer.resume();
                Laya.Scene.open('init.scene');
            });
        }
        
        onLoadComplete(){
            //播放bgm
            this.bgm = Laya.SoundManager.playSound("sound/THUNDER LANDING.mp3",1,Laya.Handler.create(this,()=>{
                console.log('播放完毕');
            }));
            
            
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

    class SnakeBody extends Laya.Script {

        constructor() { 
            super(); 
            /** @prop {name:snake, tips:"蛇头", type:Node, default:null}*/
            let snake;
        }
        onAwake(){
            // this.snake = this.owner.parent;
            // console.log(this.owner)
            // this.snakeScript = this.snake.getComponent(Laya.Script)
            // this.rigid = this.snake.getComponent(Laya.RigidBody)
            // Laya.timer.frameLoop(this.snakeScript.frame,this,this.move)
        }

        move(){
            // this.rigid.linearVelocity = this.snakeScript.rigid.linearVelocity;
        }

        onUpdate(){
            
        }
        onEnable() {
        }

        onDisable() {
        }
    }

    /**This class is automatically generated by LayaAirIDE, please do not make any modifications. */

    class GameConfig {
        static init() {
            //注册Script或者Runtime引用
            let reg = Laya.ClassUtils.regClass;
    		reg("script/GameMain/BtnStartGame.js",BtnStartGame);
    		reg("script/GameMenu/GameControl.js",GameControl);
    		reg("script/GameMain/ScoreControl.js",ScoreControl);
    		reg("script/GameMain/Snake.js",Snake);
    		reg("script/GameMain/Food.js",Food);
    		reg("script/GameMain/GameOver.js",GameOver);
    		reg("script/GameMain/GameMain.js",GameMain);
    		reg("script/GameMain/SnakeBody.js",SnakeBody);
        }
    }
    GameConfig.width = 960;
    GameConfig.height = 540;
    GameConfig.scaleMode ="fixedheight";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "init.scene";
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
