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
        super.effect(snake)
        snake.script.eatScale = 100;
        snake.script.stopScale = true;
        
    }
    
    onEnable() {
    }



    

    onDisable() {
        super.onDisable()
        Laya.Pool.recover('magnet',this.owner)
    }
}