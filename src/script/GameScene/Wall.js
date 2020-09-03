import BaseScript from "../BaseScript";
import GameUtils from "../../common/GameUtils";
import Global from "../../common/Global";
import GameConfig from "../../GameConfig";

export default class Wall extends BaseScript {

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



        this.ctrlDefaultPos = {}

        this.foodNum = 0;//当前食物数量

        this.foods = []
        
        this.foodOrder = 0;

        this.snakes = []//蛇数组

        this.snakeMap = {}

        this.snakeNum = 2;//蛇的个数

        this.cursnakeNum = 0;//当前蛇的数量

        this.maxFood = 500;//最大食物数量

        //当前玩家蛇
        this.playerSnake;
    }



    //玩家操控的蛇准备完毕
    playerComplete(playerSnake){
        console.log('playercom')
        this.playerScript = playerSnake.getComponent(Laya.Script)
        this.btn_speedup.on('mousedown',this,this.speedUp)
        this.btn_speedup.on('mouseup',this,this.speedDown)
        this.gameScene.on("mouseup", this, this.ctrlRockerUp)
        this.gameScene.on("mousemove",this, this.ctrlRockerDown)
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
            this.btn_speedup.selected = true
            this.speedUp()
        }
    }
    
    onKeyUp(e){
        if(e.keyCode == 32){
            this.btn_speedup.selected = false
            this.speedDown()
        }
    }

    ctrlRockerUp(){
        if (this.gameScene.mouseX <= this.gameScene.width / 2 + this.btn_ctrl.width/2) {
            this.btn_ctrl_rocker.visible = true
            this.btn_ctrl_rocker_move.visible = false
            this.btn_ctrl.x = this.ctrlDefaultPos.x;
            this.btn_ctrl.y = this.ctrlDefaultPos.y;

        }
    }
    ctrlRockerDown(){
        
        if (this.gameScene.mouseX <= this.gameScene.width / 2 + this.btn_ctrl.width/2) {
            this.btn_ctrl_rocker.visible = false
            this.btn_ctrl_rocker_move.visible = true
            if (GameUtils.distance(this.gameScene.mouseX, this.gameScene.mouseY, this.btn_ctrl.x, this.btn_ctrl.y) <= (this.gameScene.height)) {
                this.btn_ctrl_rocker_move.pos(this.gameScene.mouseX, this.gameScene.mouseY)
                this.playerSnake.rotation = Math.atan2(this.gameScene.mouseY - this.btn_ctrl.y, this.gameScene.mouseX - this.btn_ctrl.x) * 180 / Math.PI
            } else {
                this.btn_ctrl_rocker_move.pos(
                    this.btn_ctrl.x + (this.btn_ctrl.width / 2 - this.btn_ctrl.width / 2) * Math.cos(Math.atan2(this.gameScene.mouseY - this.btn_ctrl.y, this.gameScene.mouseX - this.btn_ctrl.x))
                    ,
                    this.btn_ctrl.y + (this.btn_ctrl.width / 2 - this.btn_ctrl.width / 2) * Math.sin(Math.atan2(this.gameScene.mouseY - this.btn_ctrl.y, this.gameScene.mouseX - this.btn_ctrl.x))
                )
            }
        }
    }

    speedUp(e){
        this.playerScript.speedMode = true;
        this.playerScript.speedChange(this.playerScript.velocity+this.playerScript.acceleratedVelocity)
    }
    
    speedDown(e){
        this.playerScript.speedMode = false
        this.playerScript.speedChange(this.playerScript.velocity)
    }

    onAwake(){
        super.onAwake()

        this.controlPad.getChildByName('view_right').getChildByName('btn_shoot').clickHandler = Laya.Handler.create(this,()=>{
            this.playerScript.shoot()
        },null,false)
        this.controlPad.onDestroy = ()=>{
            this.btn_speedup.off('mousedown',this,this.speedUp)
            this.btn_speedup.off('mouseup',this,this.speedDown)
            this.gameScene.off("mouseup", this, this.ctrlRockerUp)
            this.gameScene.off("mousemove",this, this.ctrlRockerDown)
        }
        this.btn_speedup.right = this.owner.width*0.05;
        // this.btn_speedup.width = this.btn_speedup.width*this.owner.width/Laya.stage.width*.3;
        // this.btn_speedup.height = this.btn_speedup.width*this.owner.width/Laya.stage.width*.3;
        this.btn_ctrl.left = this.owner.width*0.05;
        // this.btn_ctrl.scale();

        this.ctrlDefaultPos = {x:this.btn_ctrl.x,y:this.btn_ctrl.y}

        this.owner.on('init',this,this.init)
        this.wallScript = this.owner.getComponent(Laya.Script)
        //加载蛇头资源
        this.snakeRes = Laya.loader.getRes(Global.SNAKE_PREFAB_PATH)
        console.log(this.snakeRes);
        if(!this.snakeRes){
            console.log('未获取到蛇头资源!')
            Laya.loader.load('res/sprite_snake1.prefab',Laya.Handler.create(this,(res)=>{
                this.snakeRes = res;
                console.log(res);
            }))
        }
        //加载食物资源
        this.foodRes = Laya.loader.getRes(Global.FOOD_PREFAB_PATH)
        if(!this.foodRes){
            console.log('未获取到食物资源!')
            Laya.loader.load('res/sprite_food1.prefab',Laya.Handler.create(this,(res)=>{
                this.foodRes = res;
            }))
        }

        Laya.timer.frameLoop(1,this,this.initFood)
        
        // Laya.timer.loop(1,this,this.mainLoop)
    }

    onTriggerEnter(other,self){
        if(other.name=='bullet_collider'){
            // console.log('子弹创强');
            if(other.owner){
                // other.owner.destroy()
                other.owner.removeSelf()
            }
        }

    }

    init(){
        Laya.timer.clear(this,this.initFood)
        this.playerComplete(this.playerSnake)
        Laya.timer.frameLoop(1,this,this.mainLoop)
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
            let snakeScript = snake.getComponent(Laya.Script)
            snakeScript.snakeLoop();
        })
    }

    /**
     * 主循环
     */
    mainLoop(){
        this.loadFood()
        this.stateCheck();
        this.snakesLoop();
        if(this.playerSnake){
            this.mapMove(this.playerScript)
        }
        
        
        
    }


    mapMove(snakeScript){
        //return;

        let mapScale = 0.5 / snakeScript.curBodySize < 0.7 ? 0.7 : 0.5 / snakeScript.curBodySize


        // this.owner.x = -1 * (this.playerSnake.x + this.playerSnake.width / 2 - this.owner.width / 2) * mapScale + this.owner.width / 2
        // this.owner.y = -1 * (this.playerSnake.y + this.playerSnake.height / 2 - this.owner.height / 2) * mapScale + this.owner.height / 2

        //固定视角
        this.owner.x = -(this.playerSnake.x-this.owner.width / 2) 
        this.owner.y = -(this.playerSnake.y-this.owner.height / 2) 

        // this.owner.x = -1300
        // this.owner.y = -700
        // console.log(this.owner);
        // this.owner.scale(2, 2)

    }

    /**
     * 按照数量获取随机食物
     */
    getFoods(foodNum){
        let foods = []
        for(let i = 0;i<foodNum;i++){
            let x = Math.random()*(this.owner.width-10).toFixed(0)+10;
            let y = Math.random()*(this.owner.height-10).toFixed(0)+10;
            let food = Laya.Pool.getItemByCreateFun('food',this.foodRes.create,this.foodRes)
            food.x = x;
            food.y = y;
            foods.push(food)
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
                    let food = Laya.Pool.getItemByCreateFun('food',this.foodRes.create,this.foodRes)

                    food.x = x;
                    food.y = y;
                    food.foodOrder = this.foodOrder;

                    this.foods[this.foodOrder] = food;
                    // Laya.stage.addChild(food)
                    this.owner.addChild(food)
                    
                    // this.foods[this.foodOrder] = food;
                    this.foodOrder++;
                    this.foodNum++;
                } else {
                    this.loadSnake()
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
                    let food = Laya.Pool.getItem('food')

                    food.x = x;
                    food.y = y;
                    food.foodOrder = this.foodOrder;

                    this.foods[this.foodOrder] = food;
                    // Laya.stage.addChild(food)
                    this.owner.addChild(food)
                    
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
                let snakeScript = snake.getComponent(Laya.Script)
                if(this.cursnakeNum==0){
                    this.playerSnake = snake;
                    snakeScript.currentPlayer = true;
                } else{
                    snakeScript.AI = true;
                }
                snakeScript.index = i;
                snakeScript.playerName = '张三' + this.cursnakeNum;

                console.log(snakeScript);
    
    
                this.owner.addChild(snake)
                this.snakes.push(snake)
                this.snakeMap[snake.getChildIndex()] = snake;
                this.cursnakeNum++;

            }
            this.owner.event('init')
        }
    }
    
    onEnable() {
        
    }


    onDisable() {

    }
}