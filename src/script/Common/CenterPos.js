export default class CenterPos extends Laya.Sprite {

    constructor() { 
        super(); 
    }
    
    onEnable() {
        this.x = Laya.stage.x/2-this.width/2;
        this.y = Laya.stage.y/2-this.width/2
    }

    onDisable() {
    }
}