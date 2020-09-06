import BaseScript from "../BaseScript";

export default class Item extends BaseScript {

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
        super.onAwake()
        console.log('道具生成' + this.owner.name);
        
    }

    onEaten(snake){
        this.snake = snake;
        this.eating = true;
        this.effect(snake)
        this.owner.removeSelf()
    }

    /**
     * 产生的效果
     * @param {当前蛇} snake 
     */
    effect(snake){

    }


    onUpdate(){
        let snakes = this.wallScript.snakes;
        if(snakes){
            snakes.forEach(snake=>{
                if(snake){
                    let snakeScript = snake.getComponent(Laya.Script)
                    if(snakeScript && !snakeScript.dead){
                        if(!this.eating && Math.abs(snake.x-this.owner.x)-this.owner.width/2<snakeScript.eatScale && Math.abs(snake.y-this.owner.y)-this.owner.height/2<snakeScript.eatScale){
                            this.onEaten(snake)
                        }

                    }
                }
            })

        }
    }

    onDisable() {
        
    }
}