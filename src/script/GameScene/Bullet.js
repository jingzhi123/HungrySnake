import BaseScript from "../BaseScript";
import Player from "../../common/Player";

export default class Bullet extends BaseScript{

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
                this.damage = 2;
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

    onTrigger(snake){
        console.log(snake.script.index + '碰到');
    }

    onTriggerEnter(other,self){
        
        //伤害了身体
        if(other.name == 'body_collider'){
            let otherOnwer = other.owner
            let otherScript = otherOnwer.script;
            let otherSnake = otherScript.snake;
            let otherSnakeScript = otherSnake.script;
            //没打自己
            if(otherSnakeScript.index!=this.snakeScript.index){
                self.owner.removeSelf();
                this.snakeScript.plusScore(this.damage*5)
                otherScript.ifDestory(self.owner)
            }
        }
        //伤害了头
        if(other.name == 'snake_collider'){
            let otherOnwer = other.owner
            let otherScript = otherOnwer.script;
            let otherSnake = otherScript.snake;
            let otherSnakeScript = otherSnake.script;
            //没打自己
            if(otherSnakeScript.index!=this.snakeScript.index){
                self.owner.removeSelf();
                console.log('伤害了头');
                if(!otherSnakeScript.dead){//没死扣血
                    otherSnakeScript.hp -= this.damage;
                    console.log(otherSnakeScript.hp);
                    //血量小于等于0,则自己死亡
                    if(otherSnakeScript.hp<=0){
                        otherOnwer.event("dead",this.snakeScript)
                    }
                }
            }

        }
    }

    onAwake(){
        super.onAwake()

        this.owner.visible = false;
        this.wall = this.owner.parent;
        this.collider = this.owner.getComponent(Laya.CircleCollider)
        this.rigid = this.owner.getComponent(Laya.RigidBody)
    }

    onUpdate(){

        this.scaleCheck()
        let x = this.velocity*Math.cos(this.rotation * Math.PI / 180)
        let y = this.velocity*Math.sin(this.rotation * Math.PI / 180)
        this.owner.x +=x;
        this.owner.y +=y;

        if(this.owner.x + x + this.owner.width*this.snakeScript.curBodySize/2 < this.wall.width && this.owner.x + x >= this.owner.width*this.snakeScript.curBodySize/2){

        } else {
            this.owner.removeSelf()
        }

        if(this.owner.y + y + this.owner.height*this.snakeScript.curBodySize/2 < this.wall.height && this.owner.y + y >= this.owner.height*this.snakeScript.curBodySize/2){

        } else {
            this.owner.removeSelf()
        }
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
        this.scaleCheck();
        this.owner.visible = true;

        let x = this.velocity*Math.cos(this.rotation * Math.PI / 180)
        let y = this.velocity*Math.sin(this.rotation * Math.PI / 180)
        // this.owner.x +=x;
        // this.owner.y +=y;
        // this.rigid.setVelocity({x:x,y:y})
    }

    onDisable() {
        Laya.Pool.recover('bullet',this.owner)
    }
}