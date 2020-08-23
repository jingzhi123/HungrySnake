export default class Food extends Laya.Script {

    constructor() { 
        super(); 
        
    }
    
    positionChange(){
        this.owner.x = Math.random()*this.owner.parent.width.toFixed(0);
        this.owner.y = Math.random()*this.owner.parent.height.toFixed(0);
    }

    onEnable() {
        this.positionChange();
        console.log(this.owner)
        
    }

    onDisable() {
    }
}