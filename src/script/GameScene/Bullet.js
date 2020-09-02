import BaseScript from "../BaseScript";

export default class Bullet extends BaseScript {

    constructor() { 
        super(); 
        /** @prop {name:velocity, tips:"子弹速度", type:Number, default:10}*/
        this.velocity = 10;
        this.rotation;
    }

    onAwake(){
        this.collider = this.owner.getComponent(Laya.CircleCollider)
        this.rigid = this.owner.getComponent(Laya.RigidBody)
        this.snake = this.owner.parent.getChildByName('sprite_snake');

        this.rotation = this.snake.rotation;
        console.log(this.snake);
        console.log('子弹创建');
    }

    onUpdate(){
        let x = this.velocity*Math.cos(this.rotation * Math.PI / 180)
        let y = this.velocity*Math.sin(this.rotation * Math.PI / 180)
        this.owner.x +=x;
        this.owner.y +=y;
    }
    
    onEnable() {
    }

    onDisable() {
    }
}