export default class BaseScript extends Laya.Script {
    //蛇头路径

    constructor() { 
        super(); 
        let eventDispatcher;
        /** @prop {name:gameName, tips:"游戏名称", type:String, default:贪吃蛇}*/
        this.gameName = '贪吃蛇';
        
        let bgm;

        this.maxFood = 500;

        this.script;//脚本
    }

    getScript(){
        
    }

    //计算距离
    static distance(x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
    }
    
    getEventDispatcher(){
        if(this.eventDispatcher==null){
            this.eventDispatcher = new Laya.EventDispatcher();
        }
        return this.eventDispatcher;
    }
    
    onEnable() {
        this.script = this.owner.getComponent(Laya.Script)
    }

    onDisable() {
    }
}