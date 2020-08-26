export default class BaseScript extends Laya.Script {
    
    constructor() { 
        super(); 
        let eventDispatcher;
        /** @prop {name:gameName, tips:"游戏名称", type:String, default:贪吃蛇}*/
        this.gameName = '贪吃蛇';
        
        let bgm;

        this.maxFood = 500;
    }
    
    getEventDispatcher(){
        if(this.eventDispatcher==null){
            this.eventDispatcher = new Laya.EventDispatcher();
        }
        return this.eventDispatcher;
    }
    
    onEnable() {
    }

    onDisable() {
    }
}