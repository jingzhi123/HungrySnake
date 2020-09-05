import BaseScript from "../BaseScript";

export default class Food extends BaseScript {

    constructor() { 
        super(); 

        this.eating = false;

        this.animTime = 0;
    }

    onAwake(){
        super.onAwake()
        this.owner.zOrder = -1000
        this.wall = this.owner.parent;
        this.wallScript = this.wall.script;
        
        this.colorNum = Math.floor(Math.random() * (6 - 1 + 1) + 1);
        this.owner.loadImage("images/bean" + this.colorNum + ".png", 0, 0, 0, 0, new Laya.Handler(this, this.loaded, null))
        this.owner.zOrder = 0
        
        this.owner.pivot(this.owner.width / 2, this.owner.height / 2)
        this.owner.visible = true

    }

    onUpdate(){
        let snakes = this.wallScript.snakes;
        if(snakes){
            snakes.forEach(snake=>{
                if(snake){
                    let other = snake.getComponent(Laya.CircleCollider)
                    let self = this.owner.getComponent(Laya.CircleCollider)
                    let snakeScript = snake.getComponent(Laya.Script)
                    if(snakeScript && !snakeScript.dead){
                        if(!this.eating && Math.abs(snake.x-this.owner.x)<snakeScript.attackScale && Math.abs(snake.y-this.owner.y)<snakeScript.attackScale){
                            this.onEaten(snake)
                        }

                    }
                }
            })

        }
    }

    async onEaten(snake){ 

        this.eating = true; 
        

        this.animTime = 0;
        Laya.timer.frameLoop(1,this,this.foodAnime,[snake])
    }

    foodAnime(snake){

        let snakeScript = snake.getComponent(Laya.Script)
        let self = this.owner;
        this.animTime++;
        self.x += (snakeScript.currentVelocity + 0.1) * Math.cos(Math.atan2(snake.y - self.y, snake.x - self.x))
        self.y += (snakeScript.currentVelocity + 0.1) * Math.sin(Math.atan2(snake.y - self.y, snake.x - self.x))

        if(this.animTime>=60){
            Laya.timer.clear(this,this.foodAnime)
            // clearInterval(timer)    
            this.eating = false;
            this.animTime = 0;

            if(snakeScript && !snakeScript.dead){
                snakeScript.foodEat(this.owner)
                snakeScript.foods.push(this.owner)
                Laya.Pool.recover('food',self.removeSelf())
            }
        }
    }

    loaded(){
        console.log('加载完毕')
    }

}