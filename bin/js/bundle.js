(function () {
    'use strict';

    class BaseScript extends Laya.Script {
        //蛇头路径

        constructor() { 
            super(); 
            let eventDispatcher;
            /** @prop {name:gameName, tips:"游戏名称", type:String, default:贪吃蛇}*/
            this.gameName = '贪吃蛇';
            
            let bgm;

            //食物数量
            this.maxFood = 500;

            this.script;//脚本
        }

        //计算距离
        static distance(x1, y1, x2, y2) {
            return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
        }
        
        getEventDispatcher(){
            if(this.eventDispatcher==null){
                this.eventDispatcher = new Laya.EventDispatcher();
            }
            return this.eventDispatcher;
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
            let load = Laya.loader.load(['sound/THUNDER LANDING.mp3','res/sprite_food.prefab'],Laya.Handler.create(this,(data)=>{
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
            /** @prop {name:ani, tips:"动画", type:Node, default:null}*/
            let ani;
        }
        onAwake(){
            
            //Laya.stage.screenMode = "horizontal";
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

    class GameUtils {

        //计算两点之间距离
        static distance(x1, y1, x2, y2) {
            return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
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


            this.foodNum = 0;

            this.foods = [];
            
            this.foodOrder = 0;

            this.snakes = [];//蛇数组

            this.snakeMap = {};

            this.snakeNum = 1;//蛇的个数

            this.cursnakeNum = 0;

            //当前玩家蛇
            this.playerSnake;
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

        //玩家操控的蛇准备完毕
        playerComplete(playerSnake){
            console.log('playercom');
            this.changeScore(playerSnake.score);
            this.playerScript = playerSnake.getComponent(Laya.Script);
            this.btn_speedup.on('mousedown',this,this.speedUp);
            this.btn_speedup.on('mouseup',this,this.speedDown);
            BaseScript.gameScene.on("mouseup", this, this.ctrlRockerUp);
            BaseScript.gameScene.on("mousemove",this, this.ctrlRockerDown);
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
            if (BaseScript.gameScene.mouseX <= BaseScript.gameScene.width / 1.5) {
                this.btn_ctrl_rocker.visible = true;
                this.btn_ctrl_rocker_move.visible = false;
            }
        }
        ctrlRockerDown(){
            
            if (BaseScript.gameScene.mouseX <= BaseScript.gameScene.width / 1.5) {
                this.btn_ctrl_rocker.visible = false;
                this.btn_ctrl_rocker_move.visible = true;
                if (BaseScript.distance(BaseScript.gameScene.mouseX, BaseScript.gameScene.mouseY, this.btn_ctrl.x, this.btn_ctrl.y) <= (this.btn_ctrl.width)) {
                    this.btn_ctrl_rocker_move.pos(BaseScript.gameScene.mouseX, BaseScript.gameScene.mouseY);
                    this.playerSnake.rotation = Math.atan2(BaseScript.gameScene.mouseY - this.btn_ctrl.y, BaseScript.gameScene.mouseX - this.btn_ctrl.x) * 180 / Math.PI;
                } else {
                    this.btn_ctrl_rocker_move.pos(
                        this.btn_ctrl.x + (this.btn_ctrl.width / 2 - this.btn_ctrl.width / 2) * Math.cos(Math.atan2(BaseScript.gameScene.mouseY - this.btn_ctrl.y, BaseScript.gameScene.mouseX - this.btn_ctrl.x))
                        ,
                        this.btn_ctrl.y + (this.btn_ctrl.width / 2 - this.btn_ctrl.width / 2) * Math.sin(Math.atan2(BaseScript.gameScene.mouseY - this.btn_ctrl.y, BaseScript.gameScene.mouseX - this.btn_ctrl.x))
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
            this.owner.on('init',this,this.init);
            this.wallScript = this.owner.getComponent(Laya.Script);
            //加载蛇头资源
            // this.snakeRes = Laya.loader.getRes('res/sprite_snake.prefab')
            if(!this.snakeRes){
                console.log('未获取到蛇头资源!');
                Laya.loader.load('res/sprite_snake1.prefab',Laya.Handler.create(this,(res)=>{
                    this.snakeRes = res;
                }));
            }
            //加载食物资源
            // this.foodRes = Laya.loader.getRes('res/sprite_food.prefab')
            if(!this.foodRes){
                console.log('未获取到食物资源!');
                Laya.loader.load('res/sprite_food1.prefab',Laya.Handler.create(this,(res)=>{
                    this.foodRes = res;
                }));
            }

            Laya.timer.frameLoop(1,this,this.initFood);
            
            // Laya.timer.loop(1,this,this.mainLoop)
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
            BaseScript.wall = this.owner;
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
            this.changeScore(this.playerScript.score);
            if(this.playerSnake){
                this.mapMove(this.playerScript);
            }
            
            
            
        }


        mapMove(snakeScript){
            //return;

            let mapScale = snakeScript.snakeInitSize / snakeScript.snakeSize < 0.7 ? 0.7 : snakeScript.snakeInitSize / snakeScript.snakeSize;
            // BaseScript.wall.x = -1 * (this.snake.x - GameConfig.width / 2 + this.snake.width / 2 - BaseScript.wall.width / 2) * mapScale
            // BaseScript.wall.y = -1 * (this.snake.y - GameConfig.height / 2 + this.snake.height / 2 - BaseScript.wall.height / 2) * mapScale

            // BaseScript.wall.x = -1 * (this.snake.x + this.snake.width / 2 - BaseScript.wall.width / 2) * mapScale + GameConfig.width / 2
            // BaseScript.wall.y = -1 * (this.snake.y + this.snake.height / 2 - BaseScript.wall.height / 2) * mapScale + GameConfig.height / 2

            //固定视角
            this.owner.x = -(this.playerSnake.x-this.owner.width / 2);
            this.owner.y = -(this.playerSnake.y-this.owner.height / 2);

            // this.owner.x = -1300
            // this.owner.y = -700
            // console.log(this.owner);
            // this.owner.scale(2, 2)

        }
        //初始化食物
        initFood(){
            
            if(this.foodRes){
                for(let i = 0 ;i<20;i++){
                    if(this.foodNum<this.maxFood){
                        let x = Math.random()*(this.owner.width-10).toFixed(0)+10;
                        let y = Math.random()*(this.owner.height-10).toFixed(0)+10;
                        let food = this.foodRes.create();
                        let foodScript = food.getComponent(Laya.Script);
                        food.x = x;
                        food.y = y;
                        food.foodOrder = this.foodOrder;

                        // food = foodScript.create(x,y)
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
                        let x = Math.random()*(this.owner.width-10).toFixed(0)+10;
                        let y = Math.random()*(this.owner.height-10).toFixed(0)+10;
                        let food = this.foodRes.create();
                        let foodScript = food.getComponent(Laya.Script);
                        food.x = x;
                        food.y = y;
                        food.foodOrder = this.foodOrder;

                        // food = foodScript.create(x,y)
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
                    }
                    snakeScript.wall = this.owner;
                    snakeScript.playerName = '张三' + this.cursnakeNum;
        
        
                    this.owner.addChild(snake);
                    this.snakes.push(snake);
                    this.snakeMap[snake.getChildIndex()] = snake;
                    this.cursnakeNum = i;

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
            /** @prop {name:wall, tips:"墙", type:Node, default:null}*/
            let wall;
            
        }

        onAwake(){
            BaseScript.gameScene = this.owner;
            BaseScript.wall = this.wall;
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

    class ScoreControl extends Laya.Script {

        constructor() { 
            super(); 
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

        onEnable() {
        }

        onDisable() {
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
            this.wall = this.owner.parent;
            this.wallScript = this.wall.getComponent(Laya.Script);
            
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
                        this.snakeScript = snake.getComponent(Laya.Script);
                        if(!this.eating && Math.abs(snake.x-this.owner.x)<this.snakeScript.attackScale && Math.abs(snake.y-this.owner.y)<this.snakeScript.attackScale){
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

            let s = snake.getComponent(Laya.Script);
            let self = this.owner;
            this.animTime++;
            self.x += (s.currentVelocity + 0.1) * Math.cos(Math.atan2(snake.y - self.y, snake.x - self.x));
            self.y += (s.currentVelocity + 0.1) * Math.sin(Math.atan2(snake.y - self.y, snake.x - self.x));

            if(this.animTime>=60){
                self.destroy();
                Laya.timer.clear(this,this.foodAnime);
                // clearInterval(timer)    
                this.eating = false;
                this.animTime = 0;
            }
        }

        onTriggerEnter(other,self,contact){
            if(other.name=='collider_snake'){
                let s = other.owner.getComponent(Laya.Script);
                this.snakeScript = s;
                console.log('removeIndex:'+self.owner.foodOrder);
                //self.owner.destroy()

                
                Laya.timer.frameLoop(1,this,this.foodAnime,[other.owner]);

            }
        }

        loaded(){
            console.log('加载完毕');
        }
        onDestroy(){
            if(this.snakeScript && !this.snakeScript.dead){
                this.snakeScript.foodEat();
            }
        }
    }

    class Snake extends BaseScript {

        constructor() { 
            super(); 
            /** @prop {name:snake, tips:"蛇", type:Node, default:null}*/
            let snake;
            /** @prop {name:snakeBody, tips:"蛇身", type:Prefab, default:null}*/
            let snakeBody;
            /** @prop {name:scoreList, tips:"分数列表", type:Node, default:null}*/
            let scoreList;
            /** @prop {name:scoreScript, tips:"分数脚本", type:Node, default:null}*/
            this.scoreScript;

            /** @prop {name:rigid, tips:"刚体", type:Node, default:null}*/
            let rigid;

            /** @prop {name:wall, tips:"墙", type:Node, default:null}*/
            let wall;
            /** @prop {name:step, tips:"步长", type:Number, default:1}*/
            this.step = 1;

            /** @prop {name:direction, tips:"初始方向", type:String, default:"右"}*/
            this.direction = '上';
            
            /** @prop {name:frame, tips:"速率(刷新率)", type:Number, default:1}*/
            this.frame = 1;
            
            /** @prop {name:velocity, tips:"初始速度", type:Number, default:1}*/
            this.velocity = 1;
            
            this.snakeInitSize = 0.45;

            this.snakeSize = this.snakeInitSize;
            
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
            this.curBodyNum = 3;
            //做大身体大小
            this.maxBodySize = 2;

            this.scoreForBody = 5;//几分一个身体

            this.curScore = 0;//当前临时分数,为了计算蛇身

            this.score = 0;//玩家分数

            this.bodySpace = 6;//身体间距

            //是否为当前玩家
            this.currentPlayer = false;//当前玩家

            this.times = 0;

            this.lastTimes = 0;

            //当前蛇的颜色编号
            this.colorNum = Math.floor(Math.random() * (5 - 1 + 1) + 1);

        }

        reverseRotation() {
            this.targetR = this.rotation > 0 ? this.rotation - 180 : this.rotation + 180;
        }

        onAwake(){
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

            
            
            this.gameMain = this.owner.scene.getComponent(Laya.Script);
            this.scoreView = this.gameMain.scoreView;

            Laya.loader.load('res/sprite_snakebody1.prefab',Laya.Handler.create(this,(res)=>{
                this.bodyRes = res;
                for(let i = 0;i<this.curBodyNum;i++){
                    this.addBody();
                }
                this.scaleCheck();
                // this.snakeBody = res.create();
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
            let x = this.owner.parent.width/2;
            let y = this.owner.parent.height/2;
            this.owner.pos(x,y);
        }

        onTriggerEnter(other,self,contact){
            if(other.name=='collider_wall'){
                this.owner.event('dead','撞墙了!');
            }
            if(other.name=='collider_food'){
                this.foodEat(other.owner);
                // this.addBody(other.owner)
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
                    

                }
                
                //存储数据
                let scoreArr = Laya.LocalStorage.getJSON('scoreArr');
                if(!scoreArr){
                    scoreArr = [{name:this.playerName,score:this.score}];
                } else {
                    scoreArr.push({name:this.playerName,score:this.score});
                }
                Laya.LocalStorage.setJSON('scoreArr',scoreArr);

            });
        }

        stop(){
            // this.rigid.setVelocity({x:0,y:0})
            Laya.timer.pause();
        }

        touchWall(){
            //碰到墙了
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
                this.touchWall();
            }
            if(this.owner.y + y + this.owner.height*this.curBodySize/2 < this.wall.height && this.owner.y + y >= this.owner.height*this.curBodySize/2){
                this.owner.y += y;
            } else {
                this.touchWall();
            }

            
            for (let index = 1; index <= this.currentVelocity; index++) {
                this.times++;
                console.log(this.times-this.lastTimes);
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

        stateCheck(){
            this.curBodyNum = this.snakeBodyArr.length;
            this.attackScale = this.owner.width * this.curBodySize + 10;
            console.log(this.attackScale);
        }

        /**
         * 蛇的循环
         */
        snakeLoop(){
            this.scaleCheck();
            this.stateCheck();
            this.headMove();
            this.bodyMove();
        }

        //大小检查
        scaleCheck(){
            this.owner.scale(this.curBodySize,this.curBodySize);
            for(let i = 0;i<this.snakeBodyArr.length;i++){
                let body = this.snakeBodyArr[i];
                body.scale(this.curBodySize,this.curBodySize);
            }

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
                    //当前身体需要获取的路径下标(第几个this.frame帧时,蛇走了index+1*body.width个像素)
                    let curIndex = Math.ceil((index+1)*((this.bodySpace*this.frame)/this.step));
                    // console.log(curIndex)
                    if(this.pathArr[curIndex]){
                        let path = this.pathArr[curIndex];
                        
                        let p = new Laya.Point(path.x,path.y);
                        body.x = p.x;
                        body.y = p.y;

                    }
                    if(this.pathArr.length > (this.snakeBodyArr.length+1) * (this.bodySpace/this.step)){
                        this.pathArr.pop();
                    }
                    // let rigid = body.getComponent(Laya.RigidBody)
                    // rigid.setVelocity(this.rigid.linearVelocity)
                }
            }
        }

        addBody(){
            //长度增加
            let snakeBody = this.bodyRes.create();

            snakeBody.loadImage("images/body" + this.colorNum + ".png", 0, 0, 0, 0, Laya.Handler.create(this,()=>{
                console.log('loaded');
            }));
            
            Laya.Tween.from(snakeBody,{scaleX:0,scaleY:0},200,Laya.Ease.strongIn);
            //添加身体
            let lastBody = this.snakeBodyArr[this.snakeBodyArr.length-1];
            this.wall.addChild(snakeBody);
            snakeBody.zOrder = lastBody?--lastBody.zOrder:0;
            this.snakeBodyArr.push(snakeBody);

            
            
        }

        //食物被吃
        foodEat(){
            //加分
            this.score++;
            this.curScore++;
            this.wall.foodNum--;
            if(this.curScore>=this.scoreForBody){
                this.curScore = 0;
                this.addBody();
                if(this.curBodySize<this.maxBodySize){
                    this.curBodySize += 0.1;
                }
            }

        }
        
        onDisable() {
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
    		reg("script/GameMain/Wall.js",Wall);
    		reg("script/GameMain/GameOver.js",GameOver);
    		reg("script/GameMain/GameMain.js",GameMain);
    		reg("script/GameMain/ScoreControl.js",ScoreControl);
    		reg("script/GameMain/Food.js",Food);
    		reg("script/GameMain/Snake.js",Snake);
    		reg("script/GameMain/SnakeBody.js",SnakeBody);
        }
    }
    GameConfig.width = 960;
    GameConfig.height = 540;
    GameConfig.scaleMode ="fixedheight";
    GameConfig.screenMode = "horizontal";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "scene/gameMain.scene";
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
