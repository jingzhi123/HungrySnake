import BaseScript from "../BaseScript";

export default class Item extends BaseScript {

    constructor() { 
        super(); 
        this.eating = false;
        this.duration = 10000;
    }
    
    onAwake() {
        super.onAwake()
        console.log('道具生成' + this.owner.name);
        
    }

    onEaten(snake){
        this.eating = true;
        this.effect(snake)
        this.owner.removeSelf()
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