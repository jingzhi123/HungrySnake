import BaseScript from "../BaseScript";

export default class Bullet extends BaseScript {

    constructor() { 
        super(); 
        /** @prop {name:velocity, tips:"子弹速度", type:Number, default:10}*/
        this.velocity = 10;
        this.rotation;
        /**
         * 蛇对象
         */
        this.snakeScript;

        this.damage = 1;

        this.type = 'normal'
    }

    /**
     * 初始化伤害数值
     */
    initDamage(){
        switch (this.type) {
            case 'normal':
                this.damage = 5;
                break;
            default:
                break;
        }
    }

    /**
     * 初始化皮肤
     */
    initSkin(){
        this.owner.loadImage("images/head" + this.snakeScript.colorNum + ".png", 0, 0, 0, 0, Laya.Handler.create(this,()=>{
            console.log('loaded');
        }))
    }

    onAwake(){
        super.onAwake()
        this.initSkin();
        this.initDamage();
        this.collider = this.owner.getComponent(Laya.CircleCollider)
        this.rigid = this.owner.getComponent(Laya.RigidBody)
        this.snake = this.owner.parent.getChildByName('sprite_snake');

        this.rotation = this.snake.rotation;
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
        Laya.Pool.recover('bullet',this.owner)
    }
}