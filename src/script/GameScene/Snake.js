import Food from "./Food";
import GameConfig from "../../GameConfig";
import BaseScript from "../BaseScript";
import Global from "../../common/Global";
import HttpUtils from "../../common/HttpUtils";

export default class Snake extends BaseScript {

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
        this.targetR = this.rotation > 0 ? this.rotation - 180 : this.rotation + 180
    }

    onAwake(){
        super.onAwake()
        console.log(this.owner.script);
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
                for(let i = 0;i<this.curBodyNum;i++){
                    this.addBody()
                }
                
                // this.snakeBody = res.create();
            }))
        } else {
            for(let i = 0;i<this.curBodyNum;i++){
                this.addBody()
            }
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
        if(other.name=='collider_food'){
            this.foodEat(other.owner)
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
            console.log(msg)

            if(this.currentPlayer){//显示得分
                this.scoreView.visible = true;
                let scoreLabel = this.scoreView.getChildByName('label_score')
                scoreLabel.text = this.score;
                

            }
            
            //存储数据
            new HttpUtils().getJson('http://localhost:8888/api/snake/rankList',(data)=>{
                console.log(data);
                let scoreArr = Laya.LocalStorage.getJSON('scoreArr')
                if(!scoreArr){
                    scoreArr = [{name:this.playerName,score:this.score}]
                } else {
                    scoreArr.push({name:this.playerName,score:this.score})
                }
                Laya.LocalStorage.setJSON('scoreArr',scoreArr)
            })
            
            

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
            this.touchWall()
        }
        if(this.owner.y + y + this.owner.height*this.curBodySize/2 < this.wall.height && this.owner.y + y >= this.owner.height*this.curBodySize/2){
            this.owner.y += y
        } else {
            this.touchWall()
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

    stateCheck(){
        this.curBodyNum = this.snakeBodyArr.length;
        this.attackScale = this.owner.width * this.curBodySize + 10;
    }

    /**
     * 蛇的循环
     */
    snakeLoop(){
        this.scaleCheck();
        this.stateCheck();
        this.headMove()
        this.bodyMove()
    }

    //大小检查
    scaleCheck(){
        this.owner.scale(this.curBodySize,this.curBodySize)
        for(let i = 0;i<this.snakeBodyArr.length;i++){
            let body = this.snakeBodyArr[i];
            body.scale(this.curBodySize,this.curBodySize)
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
                    let path = this.pathArr[curIndex]
                    
                    let p = new Laya.Point(path.x,path.y)
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
        let snakeBody = this.bodyRes.create()

        snakeBody.loadImage("images/body" + this.colorNum + ".png", 0, 0, 0, 0, Laya.Handler.create(this,()=>{
            console.log('loaded');
        }))
        
        Laya.Tween.from(snakeBody,{scaleX:0,scaleY:0},200,Laya.Ease.strongIn)
        //添加身体
        let lastBody = this.snakeBodyArr[this.snakeBodyArr.length-1]
        this.wall.addChild(snakeBody)
        snakeBody.zOrder = lastBody?--lastBody.zOrder:0;
        this.snakeBodyArr.push(snakeBody)

        
        
    }

    //食物被吃
    foodEat(){
        //加分
        this.score++;
        this.curScore++;
        this.wallScript.foodNum--;
        if(this.curScore>=this.scoreForBody){
            this.curScore = 0;
            this.addBody()
            if(this.curBodySize<this.maxBodySize){
                this.curBodySize += 0.1;
            }
        }

    }
    
    onDisable() {
    }
}