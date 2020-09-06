import Item from "./Item";

export default class Magnet extends Item {

    constructor() { 
        super(); 
        this.name = '吸铁石'


        this.wallScript;

        /**
         * 状态
         */
        this.status;

        /**
         * 倒计时数字
         */
        this.durationLabel;
        
        this.statusImg = 'images/magnet.png';
    }

    
    effect(snake){
        snake.script.eatScale = 100;
        snake.script.stopScale = true;
        Laya.timer.loop(1000,this,this.minusTime)
    }
    
    onEnable() {
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
    countDownIcon(){
        this.status = new Laya.Image('images/magnet.png')
        this.durationLabel = new Laya.Label()
        this.durationLabel.centerX = 0;
        this.durationLabel.centerY = 0;
        this.durationLabel.text = Number(this.duration/1000);
        this.status.width = 20;
        this.status.height = 20;
        this.status.addChild(this.durationLabel)
        this.gameScene.statusPanel.addChild(this.status)
    }

    onDisable() {
        Laya.Pool.recover('magnet',this.owner)
        this.countDownIcon()
    }
}