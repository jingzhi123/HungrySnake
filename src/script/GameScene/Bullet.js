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
        let otherOnwer = other.owner
        let otherScript = otherOnwer.script;
        let otherSnake = otherScript.snake;
        let otherSnakeScript = otherSnake.script;

        //没打自己
        if(otherSnakeScript.index!=this.snakeScript.index){
            self.owner.removeSelf();
            this.snakeScript.plusScore(this.damage*5)
            //伤害了身体
            if(other.name == 'body_collider'){
                otherScript.ifDestory(self.owner)
                // this.owner.destroy()
            }
            //伤害了头
            if(other.name == 'snake_collider'){
                if(!otherSnakeScript.dead){//没死扣血
                    otherSnakeScript.hp -= this.damage;
                    console.log(otherSnakeScript.hp);
                    //血量小于等于0,则自己死亡
                    if(otherSnakeScript.hp<=0){
                        otherSnakeScript.hp = 0;//hp归零
                        otherOnwer.event("dead",otherSnakeScript.index + '号:没血死了')
                    }
                }

            }


        }
    }

    onAwake(){
        super.onAwake()
        this.collider = this.owner.getComponent(Laya.CircleCollider)
        this.rigid = this.owner.getComponent(Laya.RigidBody)
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
        this.initSkin();
        this.initDamage();
        
        this.owner.x = this.snake.x;
        this.owner.y = this.snake.y;
        this.rotation = this.snake.rotation;
    }

    onDisable() {
        Laya.Pool.recover('bullet',this.owner)
    }
}