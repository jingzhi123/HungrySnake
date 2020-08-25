export default class SnakeBody extends Laya.Script {

    constructor() { 
        super(); 
        /** @prop {name:snake, tips:"蛇头", type:Node, default:null}*/
        let snake;
    }
    onAwake(){
        // this.snake = this.owner.parent;
        // console.log(this.owner)
        // this.snakeScript = this.snake.getComponent(Laya.Script)
        // this.rigid = this.snake.getComponent(Laya.RigidBody)
        // Laya.timer.frameLoop(this.snakeScript.frame,this,this.move)
    }

    move(){
        // this.rigid.linearVelocity = this.snakeScript.rigid.linearVelocity;
    }

    onUpdate(){
        
    }
    onEnable() {
    }

    onDisable() {
    }
}