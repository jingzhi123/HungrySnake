export default class BaseScript extends Laya.Script {

    constructor() { 
        super(); 
        /** @prop {name:gameName, tips:"游戏名称", type:String, default:贪吃蛇}*/
        let gameName = '贪吃蛇';
        
        let bgm;
    }
    
    onEnable() {
    }

    onDisable() {
    }
}