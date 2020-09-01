export default class FitScale extends Laya.Sprite {

    constructor() { 
        super(); 
    }
    
    onEnable() {
        console.log(Laya.stage.width/this.scene.width);
        this.scale(Laya.stage.width/this.scene.width)
        // this.pos(-100,this.y)
    }

    onDisable() {
    }
}