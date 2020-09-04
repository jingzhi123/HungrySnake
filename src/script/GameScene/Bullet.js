import BaseScript from "../BaseScript";

export default class Bullet extends BaseScript {

    constructor() { 
        super(); 
        /** @prop {name:velocity, tips:"子弹速度", type:Number, default:10}*/
        this.velocity = 5;
        this.rotation;
        /**
         * 蛇对象
         */
        this.snakeScript;

        /**
         * 蛇节点
         */
        this.snake;

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

    onTriggerEnter(other,self){
        if(other.name == 'body_collider'){
            let otherScript = other.owner.script;
            let otherSnakeScript = other.owner.script.snake.script;
            let body = other.owner
            if(otherSnakeScript.index!=this.snakeScript.index){
                self.owner.removeSelf()
                otherScript.ifDestory(self.owner)
                this.gameScene.plusScore(this.damage*10)
                // this.owner.destroy()
            }
        }
    }

    onAwake(){
        super.onAwake()
        this.collider = this.owner.getComponent(Laya.CircleCollider)
        this.rigid = this.owner.getComponent(Laya.RigidBody)
        
        this.snakeScript = this.snake.script;

        
        this.initSkin();
        this.initDamage();

        this.rotation = this.snake.rotation;
    }

    onUpdate(){
        let x = this.velocity*Math.cos(this.rotation * Math.PI / 180)
        let y = this.velocity*Math.sin(this.rotation * Math.PI / 180)
        this.owner.x +=x;
        this.owner.y +=y;
        this.scaleCheck()
    }

    scaleCheck(){
        this.owner.scale(this.snakeScript.curBodySize,this.snakeScript.curBodySize)
    }
    
    onEnable() {
    }

    onDisable() {
        Laya.Pool.recover('bullet',this.owner)
    }
}