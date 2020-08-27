import BaseScript from "../BaseScript";

export default class Food extends BaseScript {

    constructor() { 
        super(); 
        this.triggerDistance = 20;

        this.eating = false;
    }

    onAwake(){
        this.wall = this.owner.parent;
        this.wallScript = this.wall.getComponent(Laya.Script)
        this.colorNum = Math.floor(Math.random() * (6 - 1 + 1) + 1);
        this.owner.loadImage("images/bean" + this.colorNum + ".png", 0, 0, 0, 0, new Laya.Handler(this, this.loaded, null))
        this.owner.zOrder = 0
        this.owner.pivot(this.owner.width / 2, this.owner.height / 2)
        this.owner.visible = true
    }

    onUpdate(){
        let snakes = this.owner.wall.snakes;
        snakes.forEach(snake=>{
            if(snake){
                let other = snake.getComponent(Laya.CircleCollider)
                let self = this.owner.getComponent(Laya.CircleCollider)
                this.snake = snake;
                this.snakeScript = snake.getComponent(Laya.Script)
                    if(!this.eating && Math.abs(snake.x-this.owner.x)<this.triggerDistance && Math.abs(snake.y-this.owner.y)<this.triggerDistance){
                        this.onEaten(snake)
                    }
            }
        })
    }
    
    onEaten(snake){
        let s = snake.getComponent(Laya.Script)
        this.eating = true;
        let _this = this;
        let self = this.owner;
        let time = 0;
        Laya.timer.frameLoop(1,this,()=>{
            time++;
            
            self.x += (s.currentVelocity + 0.1) * Math.cos(Math.atan2(snake.y - self.y, snake.x - self.x))
            self.y += (s.currentVelocity + 0.1) * Math.sin(Math.atan2(snake.y - self.y, snake.x - self.x))
            
            if(time>=60){
                self.destroy()
                // clearInterval(timer)    
                _this.eating = false;
            }
        })
    }

    onTriggerEnter(other,self,contact){
        console.log('enter')
        if(other.name=='collider_snake'){
            let snake = this.snake;
            let s = snake.getComponent(Laya.Script)
            console.log('removeIndex:'+self.owner.foodOrder)
            //self.owner.destroy()

            
            // let time = 0;
            // setInterval(() => {
            //     time++;
            //     self.owner.x += (s.currentVelocity + 0.1) * Math.cos(Math.atan2(BaseScript.snakePos.y - self.owner.y, BaseScript.snakePos.x - self.owner.x))
            //     self.owner.y += (s.currentVelocity + 0.1) * Math.sin(Math.atan2(BaseScript.snakePos.y - self.owner.y, BaseScript.snakePos.x - self.owner.x))

            //     if(time>=60){
            //         self.owner.destroy()
                    
            //     }
            // }, 1000);

        }
    }

    loaded(){
        console.log('加载完毕')
    }
    create(x,y){
        
        this.owner.pos(x, y)
        return this.owner;
    }

    onDestroy(){
        this.snakeScript.foodEat()
    }
}