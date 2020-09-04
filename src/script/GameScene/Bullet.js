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

        /**
         * 子弹伤害
         */
        this.damage = 1;

        /**
         * 子弹类型
         */
        this.type = 'normal'

        /**
         * 子弹级别
         */
        this.level;
    }

    /**
     * 初始化伤害数值
     */
    initDamage(){
        switch (this.type) {
            case 'normal':
                this.damage = 1;
                break;
            default:
                break;
        }
        this.damage = Math.ceil(this.level * this.damage);
    }

    /**
     * 初始化皮肤
     */
    initSkin(){
        this.owner.loadImage("images/body" + this.snakeScript.colorNum + ".png", 0, 0, 0, 0, Laya.Handler.create(this,()=>{
            console.log('loaded');
        }))
    }

    onTriggerEnter(other,self){
        if(other.name == 'body_collider'){
            let bodyScript = other.owner.script;
            let bodySnakeScript = other.owner.script.snake.script;
            let body = other.owner
            if(bodySnakeScript.index!=this.snakeScript.index){
                self.owner.removeSelf()
                bodyScript.ifDestory(self.owner)
                // this.owner.destroy()
            }
            if(this.snakeScript.currentPlayer){
                this.gameScene.plusScore(this.damage*10)
            }
        }
    }

    onAwake(){
        super.onAwake()
        this.collider = this.owner.getComponent(Laya.CircleCollider)
        this.rigid = this.owner.getComponent(Laya.RigidBody)
        
        this.initSkin();
        this.initDamage();

        this.rotation = this.snake.rotation;
    }

    onUpdate(){
        this.scaleCheck()
        let x = this.velocity*Math.cos(this.rotation * Math.PI / 180)
        let y = this.velocity*Math.sin(this.rotation * Math.PI / 180)
        this.owner.x +=x;
        this.owner.y +=y;
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