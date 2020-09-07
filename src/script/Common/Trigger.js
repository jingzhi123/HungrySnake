import BaseScript from "../BaseScript";


export default class Trigger extends BaseScript{
    constructor() { 
        super(); 
        
    }

    onAwake(){
        super.onAwake()
        this.wallScript = this.gameScene.wall.script
    }

    onUpdate(){
        let snakes = this.wallScript.snakes;
        if(snakes){
            snakes.forEach(snake=>{
                if(snake){
                    let snakeScript = snake.getComponent(Laya.Script)
                    if(snakeScript && !snakeScript.dead){
                        if(!this.eating && Math.abs(snake.x-this.owner.x)-this.owner.width/2<snakeScript.eatScale && Math.abs(snake.y-this.owner.y)-this.owner.height/2<snakeScript.eatScale){
                            this.onTrigger(snake)
                        }

                    }
                }
            })

        }
    }

    onTrigger(other){

    }
}