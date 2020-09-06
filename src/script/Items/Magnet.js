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
        
        this.statusImg = 'images/magnet.png';
    }

    effect(snake){
        
        snake.script.eatScale = 100;
        snake.script.stopScale = true;
        Laya.timer.once(this.duration,this,()=>{
            snake.script.stopScale = false;
            this.status.destroy()
        })
    }
    
    onEnable() {
    }

    onDisable() {
        Laya.Pool.recover('magnet',this.owner)
        this.status = new Laya.Image('images/magnet.png')
        this.status.width = 20;
        this.status.height = 20;
        this.gameScene.statusPanel.addChild(this.status)
    }
}