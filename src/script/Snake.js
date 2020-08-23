export default class Snake extends Laya.Script {

    constructor() { 
        super(); 
        /** @prop {name:snake, tips:"蛇", type:Node, default:null}*/
        let snake;

        /** @prop {name:step, tips:"速度", type:Number, default:0.01}*/
        let step = 0.01;

        let direction = '右';

    }
    
    onEnable() {
        this.step = 1;
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

    onUpdate(){
        switch (this.direction) {
            case '右':
                this.snake.x += this.step;
                // console.log(this.snake.x)
                if(this.snake.x>=this.snake.scene.width-this.snake.width/2){
                    this.snake.x = this.snake.scene.width-this.snake.width/2;
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
                if(this.snake.y>=this.snake.scene.height-this.snake.height/2){
                    this.snake.y = this.snake.scene.height-this.snake.height/2;
                    this.owner.event('dead','撞到下墙了!');
                }
                break;
        
            default:
                break;
        }
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