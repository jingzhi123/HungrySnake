export default class Food extends Laya.Script {

    constructor() { 
        super(); 
        /** @prop {name:snake, tips:"蛇", type:Node, default:null}*/
        let snake;
        /** @prop {name:scoreText, tips:"分数Text", type:Node, default:null}*/
        let scoreText;
        
        
    }

    onAwake(){
        this.boxCollider = this.owner.getComponent(Laya.BoxCollider)
    }
    
    positionChange(){

        this.owner.x = Math.random()*(this.owner.parent.width-10).toFixed(0);
        this.owner.y = Math.random()*(this.owner.parent.height-10).toFixed(0);

    }

    onTriggerEnter(other,self,contact){
        
    }

    onEnable() {
        this.positionChange();
        console.log(this.owner)
        
    }

    onDisable() {
    }
}