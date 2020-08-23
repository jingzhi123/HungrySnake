export default class Snake extends Laya.Script {

    constructor() { 
        super(); 
        /** @prop {name:snake, tips:"蛇", type:Node, default:null}*/
        let snake;

        /** @prop {name:step, tips:"速度", type:Number, default:0.01}*/
        let step = 0.01;

        let direction = '右';

        /** @prop {name:wall, tips:"墙", type:Node, default:null}*/
        let wall;

        /** @prop {name:food, tips:"食物", type:Node, default:null}*/
        let food;
        Laya.timer.frameLoop(60,this,this.move)
        
    }

    positionChange(){
        this.owner.x = Math.random()*this.owner.parent.width.toFixed(0);
        this.owner.y = Math.random()*this.owner.parent.height.toFixed(0);
    }
    
    onEnable() {
        this.positionChange()
        this.step = 10;
        this.direction = '右'
        console.log(this.owner,this.snake)
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
        console.log(e)
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
    }
    
    onDisable() {
    }
}