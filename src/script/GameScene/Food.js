import BaseScript from "../BaseScript";

export default class Food extends BaseScript {

    constructor() { 
        super(); 
        this.triggerDistance = 20;

        this.eating = false;

        this.animTime = 0;
    }

    onAwake(){
        super.onAwake()
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
                    this.snakeScript = snake.getComponent(Laya.Script)
                    if(!this.eating && Math.abs(snake.x-this.owner.x)<this.snakeScript.attackScale && Math.abs(snake.y-this.owner.y)<this.snakeScript.attackScale){
                        this.onEaten(snake)
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

        let s = snake.getComponent(Laya.Script)
        let self = this.owner;
        this.animTime++;
        self.x += (s.currentVelocity + 0.1) * Math.cos(Math.atan2(snake.y - self.y, snake.x - self.x))
        self.y += (s.currentVelocity + 0.1) * Math.sin(Math.atan2(snake.y - self.y, snake.x - self.x))

        if(this.animTime>=60){
            self.destroy()
            Laya.timer.clear(this,this.foodAnime)
            // clearInterval(timer)    
            this.eating = false;
            this.animTime = 0;
        }
    }

    onTriggerEnter(other,self,contact){
        if(other.name=='collider_snake'){
            let s = other.owner.getComponent(Laya.Script)
            this.snakeScript = s;
            console.log('removeIndex:'+self.owner.foodOrder)
            //self.owner.destroy()

            
            Laya.timer.frameLoop(1,this,this.foodAnime,[other.owner])

        }
    }

    loaded(){
        console.log('加载完毕')
    }
    onDestroy(){
        if(this.snakeScript && !this.snakeScript.dead){
            this.snakeScript.foodEat()
        }
    }
}