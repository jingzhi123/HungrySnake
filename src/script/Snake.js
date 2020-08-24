export default class Snake extends Laya.Script {

    constructor() { 
        super(); 
        /** @prop {name:snake, tips:"蛇", type:Node, default:null}*/
        let snake;

        /** @prop {name:wall, tips:"墙", type:Node, default:null}*/
        let wall;

        /** @prop {name:food, tips:"食物", type:Node, default:null}*/
        let food;

        /** @prop {name:step, tips:"步长", type:Number, default:10}*/
        this.step = 10;

        /** @prop {name:direction, tips:"方向", type:String, default:"右"}*/
        this.direction = '右';
        
        /** @prop {name:frame, tips:"速率(刷新率)", type:Number, default:20}*/
        this.frame = 20;
        
    }

    onAwake(){
        this.positionChange()
        Laya.timer.frameLoop(this.frame,this,this.move)
    }

    positionChange(){
        this.owner.x = Math.random()*this.owner.parent.width.toFixed(0);
        this.owner.y = Math.random()*this.owner.parent.height.toFixed(0);
    }
    
    onEnable() {
        
    }

    onTriggerEnter(other,self,contact){
        console.log(other,self,contact);
    }

    onStart(){
        this.initDeadListener();
    }

    initDeadListener(){
        this.owner.once('dead',this,(msg)=>{
            console.log(msg)
        })
    }

    move(){
        switch (this.direction) {
            case '右':
                this.snake.x += this.step;
                // console.log(this.snake.x)
                if(this.snake.x>=this.wall.width-this.snake.width/2){
                    this.snake.x = this.wall.width-this.snake.width/2;
                    this.owner.event('dead','撞到右墙了!');
                }
                break;
            case '左':
                this.snake.x -= this.step;
                // console.log(this.snake.x)
                if(this.snake.x<=this.snake.width/2){
                    this.snake.x = this.snake.width/2;
                    this.owner.event('dead','撞到左墙了!');
                }
                break;
            case '上':
                this.snake.y -= this.step;
                // console.log(this.snake.y)
                if(this.snake.y<=this.snake.height/2){
                    this.snake.y = this.snake.height/2;
                    this.owner.event('dead','撞到上墙了!');
                }
                break;
            case '下':
                this.snake.y += this.step;
                // console.log(this.snake.y)
                if(this.snake.y>=this.wall.height-this.snake.height/2){
                    this.snake.y = this.wall.height-this.snake.height/2;
                    this.owner.event('dead','撞到下墙了!');
                }
                break;
        
            default:
                break;
        }
    }

    onUpdate(){
        
    }

    onKeyUp(e){
        if(this.timer){
            clearTimeout(this.timer)
            this.timer = null;
        }
        switch (e.keyCode) {
            case 37:
                this.direction = '左'
                break;
            case 38:
                this.direction = '上'
                break;
            case 39:
                this.direction = '右'
                break;
            case 40:
                this.direction = '下'
                break;
        
            default:
                break;
        }
        this.move();
        Laya.timer.pause();
        this.timer = setTimeout(()=>{
            Laya.timer.resume()
        },Laya.timer.delta*this.frame)
    }
    
    onDisable() {
    }
}