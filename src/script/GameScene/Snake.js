import BaseScript from "../BaseScript";
import Global from "../../common/Global";
import GameSceneRuntime from "../runtime/GameSceneRuntime";
import GameUtils from "../../common/GameUtils";

export default class Snake extends BaseScript {

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

        this.playerName = '张三'
        
        this.snakeBodyArr=[]

        //路径数组
        this.pathArr=[]

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
        this.foods = []
        /**
         * 所吃的食物临时数组,给蛇身
         */
        this._tmpFoods = []

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
        this.targetR = this.rotation > 0 ? this.rotation - 180 : this.rotation + 180
    }

    onAwake(){
        super.onAwake()
        
        this.owner.on('concat',this,(index)=>{
            console.log('concatafter:' + index);
            this.currentConcatIndex = index;
            this.bodyConcat()
        })
        this.cameraWidth = this.gameScene.width/2;
        this.wall = this.owner.parent;
        this.wallScript = this.wall.script;
        this.owner.zOrder = 1;
        
        this.owner.loadImage("images/head" + this.colorNum + ".png", 0, 0, 0, 0, Laya.Handler.create(this,()=>{
            console.log('loaded');
        }))
        this.snake = this.owner;


        this.snake.on('directionChange',this,(direction)=>{
            this.directionChange(direction)
        })
        this.snake.on('speedChange',this,(velocity)=>{
            this.speedChange(velocity)
        })

        //初始化位置
        this.positionChange()
        //初始化速度
        this.currentVelocity = this.velocity;
        //初始化方向
        this.snake.rotation = 0;
        // this.directionChange(this.direction)

        
        
        this.GameScene = this.owner.scene.getComponent(Laya.Script)
        this.scoreView = this.GameScene.scoreView;

        this.bodyRes = Laya.loader.getRes(Global.SNAKEBODY_PREFAB_PATH)
        if(!this.bodyRes){
            console.log('重新加载蛇身资源');
            Laya.loader.load('res/sprite_snakebody1.prefab',Laya.Handler.create(this,(res)=>{
                this.bodyRes = res;
                this.initBody()
                
                // this.snakeBody = res.create();
            }))
        } else {
            this.initBody()
        }
        


    }

    onKeyUp(e){
        if(this.gameScene.gameStart && e.keyCode == Laya.Keyboard.SPACE){
            if(this.currentPlayer){
                this.shoot();
            }
        }
    }

    shoot(){
        let bullet = this.bulletRes.create()
        bullet.snake = this.owner;
        bullet.x = this.owner.x;
        bullet.y = this.owner.y;

        bullet.getComponent(Laya.Script).snake = this.owner;
        bullet.getComponent(Laya.Script).snakeScript = this;


        this.owner.parent.addChild(bullet)
    }

    initBody(){
        for(let i = 0;i<this.curBodyNum;i++){
            let snakeBody = Laya.Pool.getItemByCreateFun('snakebody',this.bodyRes.create,this.bodyRes)
            snakeBody.loadImage("images/body" + this.colorNum + ".png", 0, 0, 0, 0, Laya.Handler.create(this,()=>{
                console.log('loaded');
            }))

            let bodyScript = snakeBody.getComponent(Laya.Script)
            bodyScript.snake = this.owner;
            bodyScript.foods = this.wallScript.getFoods(5);
            bodyScript.index = this.snakeBodyArr.length;
            
            //添加身体
            let lastBody = this.snakeBodyArr[this.snakeBodyArr.length-1]
            this.wall.addChild(snakeBody)
            this.snakeBodyArr.push(snakeBody)
        }
    }

    //速度改变
    speedChange(velocity){
        this.currentVelocity = velocity;
    }

    positionChange(){
        let x = this.owner.parent.width/2;
        let y = this.owner.parent.height/2;
        this.owner.pos(x,y)
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
            console.log(msg)
            if(this.currentPlayer){//显示得分
                this.gameScene.stopGame()

            }
            
            //存储数据
            // new HttpUtils().post(`${Global.ctx}/common/snake_score/insert`,`name=${this.playerName}&score=${this.score}`,(data)=>{
            //     console.log(data);
            // },['token',Global.token,'code','snake'])
            
            

        })
    }

    stop(){
        // this.rigid.setVelocity({x:0,y:0})
        Laya.timer.pause()
    }

    touchWall(){
        //碰到墙了
        this.owner.event('dead','创强了!')
    }

    /**
     * 蛇头移动
     */
    headMove(){
        
        if(this.dead){
            return;
        }
        if(this.speedMode){
            this.speedChange(this.velocity+this.acceleratedVelocity)
        } else {
            this.speedChange(this.velocity)
        }
        let x = this.currentVelocity * Math.cos(this.snake.rotation * Math.PI / 180)
        let y = this.currentVelocity * Math.sin(this.snake.rotation * Math.PI / 180)

        let pos = { x: this.owner.x, y: this.owner.y }
        let posBefore = { x: this.owner.x, y: this.owner.y }

        // console.log(this.owner.x,this.owner.y,this.wall.width);
        if(this.owner.x + x + this.owner.width*this.curBodySize/2 < this.wall.width && this.owner.x + x >= this.owner.width*this.curBodySize/2){
            this.owner.x += x
        } else {
            //this.touchWall()
        }
        if(this.owner.y + y + this.owner.height*this.curBodySize/2 < this.wall.height && this.owner.y + y >= this.owner.height*this.curBodySize/2){
            this.owner.y += y
        } else {
            //this.touchWall()
        }

        
        for (let index = 1; index <= this.currentVelocity; index++) {
            this.times++;
            // console.log(this.times-this.lastTimes);
            this.lastTimes = this.times;
            if(this.snakeBodyArr.length){
                this.pathArr.unshift({x:this.snake.x,y:this.snake.y,rotation:this.snake.rotation})
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
            })

            if(GameUtils.distance(playerScript.owner.x,playerScript.owner.y,this.owner.x,this.owner.y) >= this.cameraWidth){
                // console.log('接近',this.cameraWidth);
                // this.owner.rotation = Math.atan2(this.owner.y - playerScript.owner.y, this.owner.x - playerScript.owner.x) * 180 / Math.PI
                this.owner.rotation = Math.atan2(playerScript.owner.y - this.owner.y, playerScript.owner.x - this.owner.x) * 180 / Math.PI
                this.speedMode = true;
            } else {
                if(GameUtils.distance(playerScript.owner.x,playerScript.owner.y,this.owner.x,this.owner.y) < this.cameraWidth/2-100){
                    this.owner.rotation = Math.atan2(this.owner.y - playerScript.owner.y, this.owner.x - playerScript.owner.x) * 180 / Math.PI

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
        this.headMove()
        this.bodyMove()
        this.AIMove();
    }

    //大小检查
    scaleCheck(){
        this.owner.scale(this.curBodySize,this.curBodySize)
        for(let i = 0;i<this.snakeBodyArr.length;i++){
            let body = this.snakeBodyArr[i];
            if(body.parent){
                // console.log(body);
                body.scale(this.curBodySize,this.curBodySize)
            }
        }

    }
    bodyConcat(){
        setInterval(() => {
            this.snakeBodyArr.forEach((body,i)=>{
                if(!body.parent){
                    this.snakeBodyArr.splice(i,1)
                }
            })
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
                let bodyScript = body.getComponent(Laya.Script)
                // console.log(this.playerName+"当前蛇身下标"+bodyScript.index);
                //当前身体需要获取的路径下标(第几个帧时,蛇走了index+1*body.width个像素)
                let curIndex = Math.ceil((index+1)*((this.bodySpace)/this.step));
                // console.log(curIndex)
                if(this.pathArr[curIndex]){
                    let path = this.pathArr[curIndex]
                    let p = new Laya.Point(path.x,path.y)
                    if(index<this.currentConcatIndex || this.currentConcatIndex==-1){
                        
                        body.x = p.x;
                        body.y = p.y;

                    } else {
                        Laya.Tween.to(body,{x:p.x,y:p.y},100,null,Laya.Handler.create(this,()=>{
                            this.currentConcatIndex=-1;
                            for(let i = 0; i<this.snakeBodyArr.length;i++){
                                let body = this.snakeBodyArr[i]
                                body.script.index = i;
                            }
                        }))
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
        let snakeBody = Laya.Pool.getItemByCreateFun('snakebody',this.bodyRes.create,this.bodyRes)
        snakeBody.loadImage("images/body" + this.colorNum + ".png", 0, 0, 0, 0, Laya.Handler.create(this,()=>{
            console.log('loaded');
        }))
        let bodyScript = snakeBody.getComponent(Laya.Script)
        if(this.index==1){
            console.log(this.index + '号玩家新增身体' + foods.length);
        }
        bodyScript.snake = this.owner;
        bodyScript.foods = foods;
        bodyScript.index = this.snakeBodyArr.length;
        //添加身体
        this.snakeBodyArr.push(snakeBody)
        this.wall.addChild(snakeBody)
        Laya.Tween.from(snakeBody,{scaleX:0,scaleY:0},200,Laya.Ease.strongIn)

        

        
        
    }

    /**
     * 吃食物,加分,加体型
     * @param {食物节点} food 
     */
    foodEat(food){
        //加分
        GameSceneRuntime.instance.plusScore()
        GameSceneRuntime.instance.plusFoodNum()
        this._tmpFoods.push(food)
        this.wallScript.foodNum--;
        if(this._tmpFoods.length>=this.foodNumPerBody){
            this.addBody([].concat(this._tmpFoods))
            // this.foods.concat(this._tmpFoods)
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