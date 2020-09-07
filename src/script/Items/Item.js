import BaseScript from "../BaseScript";
import Trigger from "../Common/Trigger";

export default class Item extends Trigger {

    constructor() { 
        super(); 
        /**
         * 吃到道具的蛇
         */
        this.snake;
        this.eating = false;
        /**
         * 道具持续时间
         */
        this.duration = 10000;
    }
    
    onAwake() {
        super.onAwake()
        console.log('道具生成' + this.owner.name);
        
    }

    onEaten(snake){
        this.snake = snake;
        this.eating = true;
        this.effect(snake)
        this.owner.removeSelf()
    }

    /**
     * 产生的效果
     * @param {当前蛇} snake 
     */
    effect(snake){
        Laya.timer.loop(1000,this,this.minusTime)
    }

    minusTime(){
        this.duration-=1000;
        this.durationLabel.text = Number(this.duration/1000);
        if(this.duration<=0){
            Laya.timer.clear(this,this.minusTime)
            this.snake.script.stopScale = false;
            this.status.destroy()
        }
    }

    /**
     * 显示倒计时
     */
    showCountDownIcon(){
        this.status = new Laya.Image('images/mask.png')
        this.durationLabel = new Laya.Label()
        this.durationLabel.centerX = 0;
        this.durationLabel.centerY = 0;
        this.durationLabel.text = Number(this.duration/1000);
        this.status.width = 20;
        this.status.height = 20;
        this.status.addChild(this.durationLabel)
        if(!this.snake.script.currentPlayer)return;
        this.gameScene.statusPanel.addChild(this.status)
    }


    onUpdate(){
        super.onUpdate()
    }

    onTrigger(other){
        this.onEaten(other)
    }

    onDisable() {
        this.showCountDownIcon()
    }
}