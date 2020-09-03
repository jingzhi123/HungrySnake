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

        this.hp = 5;

        this.lastX;

        this.x;

        this.equalNum = 0;
    }
    onAwake(){
        super.onAwake()
        this.snakeScript = this.snake.script
        this.collider = this.owner.getComponent(Laya.CircleCollider)
    }

    /**
     * 判断子弹是否足矣造成身体死亡
     * @param {子弹节点} bullet 
     */
    ifDestory(bullet){
        let bulletScript = bullet.getComponent(Laya.Script)
        this.hp-=bulletScript.damage;
        if(this.hp<=0){
            // this.owner.removeSelf()
            this.owner.destroy()
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
        })
    }

    move(){
        // this.rigid.linearVelocity = this.snakeScript.rigid.linearVelocity;
    }

    onTriggerEnter(other,self){
        if(other.name == 'bullet_collider'){
            let otherScript = other.owner.snake.script;
            let bullet = other.owner
            if(otherScript.playerName!=this.snakeScript.playerName){
                console.log(this.index);
                bullet.removeSelf()

                this.ifDestory(bullet)
                // this.owner.destroy()
            }
            // console.log(otherScript.playerName);
            // console.log(this.snakeScript.playerName);
        }
    }

    onTriggerExit(other,self){
        if(other.name == 'bullet_collider'){
            let otherScript = other.owner.snake.script;
            let bullet = other.owner
            if(otherScript.playerName!=this.snakeScript.playerName){
                console.log(other.name);

            }
        }
    }

    onTriggerStay(other,self){
        if(other.name == 'bullet_collider'){
            let otherScript = other.owner.snake.script;
            let bullet = other.owner
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
        this.dropFood()
        this.snakeScript.snakeBodyArr.splice(this.index,1)
        this.snake.event('concat',this.index)
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
            this.gameScene.wall.addChild(food)

            //体型减小
            if(this.snakeScript.curBodySize>=this.snakeScript.maxBodySize){
                this.snakeScript.curBodySize -= 0.02;
            }
        }
    }
}