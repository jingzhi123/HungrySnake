import BaseScript from "../BaseScript";
import GameUtils from "../../common/GameUtils";

export default class SnakeBody extends BaseScript {

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

        /**
         * 每个蛇身的血量
         */
        this.hp = 5;

        /**
         * 蛇身类型
         */
        this.type = 'normal'

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
        }))
    }

    onAwake(){
        super.onAwake()
        
        
        this.snakeScript = this.snake.getComponent(Laya.Script)
        this.collider = this.owner.getComponent(Laya.CircleCollider)
    }

    onEnable() {
        this.initHP();
        this.initSkin();
        this.owner.visible = true;
    }



    /**
     * 判断子弹是否足矣造成身体死亡
     * @param {子弹节点} bullet 
     */
    ifDestory(bullet){
        let bulletScript = bullet.getComponent(Laya.Script)
        this.hp-=bulletScript.damage;
        if(this.hp<=0){
            let burstAni = Laya.Pool.getItemByCreateFun('bodyBurst',this.gameScene.script.bodyBurst.create,this.gameScene.script.bodyBurst)
            burstAni.pos(this.owner.x,this.owner.y)
            this.owner.parent.addChild(burstAni)
            burstAni.play()
            burstAni.on(Laya.Event.COMPLETE,this,()=>{
                burstAni.removeSelf()
                Laya.Pool.recover('bodyBurst',burstAni)
            })
            // this.owner.removeSelf()
            this.owner.destroy()
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
        this.snakeScript.snakeBodyArr.splice(this.index,1)
        this.snake.event('concat',this.index)
        this.dropFood()
    }

    /**
     * 掉落食物,体型随食物的掉落减小,食物数量减少
     */
    dropFood(){
        console.log('掉落了:'+this.foods.length);
        
        for(let i = 0;i<this.foods.length;i++){
            let offset = Math.random()*6;
            let food = this.foods[i];
            food.x = this.owner.x + offset*GameUtils.randomSimbol();
            food.y = this.owner.y + offset*GameUtils.randomSimbol();
            this.gameScene.wall.addChild(food)

            //减少食物数量
            this.snakeScript.minusFoodNum()
        }
        //体型减小
        if(this.snakeScript.curBodySize>=this.snakeScript.maxBodySize){
            this.snakeScript.curBodySize -= this.snakeScript.bodyStep;
            this.snakeScript.scaleChange()
        }
    }
}