export default class Food extends Laya.Script {

    constructor() { 
        super(); 
        /** @prop {name:scoreText, tips:"分数Text", type:Node, default:null}*/
        let scoreText;
        
        
    }

    onAwake(){
        this.boxCollider = this.owner.getComponent(Laya.BoxCollider)
    }
    
    positionChange(){
        // this.owner.destroy()
        this.owner.x = Math.random()*this.owner.parent.width.toFixed(0);
        this.owner.y = Math.random()*this.owner.parent.height.toFixed(0);
        // this.boxCollider.x = Math.random()*this.owner.parent.width.toFixed(0);
        // this.boxCollider.y = Math.random()*this.owner.parent.height.toFixed(0);
    }

    onTriggerEnter(other,self,contact){
        if(other.name=='collider_snake'){
            this.positionChange();
            let s = this.scoreText.getComponent(Laya.Script)
            s.plusScore()
        }
    }

    onEnable() {
        this.positionChange();
        console.log(this.owner)
        
    }

    onDisable() {
    }
}