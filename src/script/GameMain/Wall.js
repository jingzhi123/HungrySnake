export default class Wall extends Laya.Script {

    constructor() { 
        super(); 
        /** @prop {name:intType, tips:"整数类型示例", type:Int, default:1000}*/
        let intType = 1000;
        
    }

    onTriggerEnter(other,self,contact){
        console.log(other,self,contact);
    }
    
    onEnable() {
        
    }


    onDisable() {
    }
}