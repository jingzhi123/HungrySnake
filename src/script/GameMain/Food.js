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

        Laya.loader.load('res/sprite_snakebody.prefab',Laya.Handler.create(this,(res)=>{
            this.bodyRes = res;
            // this.snakeBody = res.create();
            // console.log(this.snakeBody)
        }))
    }
    
    positionChange(){
        // this.owner.destroy()
        this.owner.x = Math.random()*this.owner.parent.width.toFixed(0);
        this.owner.y = Math.random()*this.owner.parent.height.toFixed(0);
        // this.boxCollider.x = Math.random()*this.owner.parent.width.toFixed(0);
        // this.boxCollider.y = Math.random()*this.owner.parent.height.toFixed(0);
    }

    onTriggerEnter(other,self,contact){
        // if(other.name=='collider_snake'){
        //     //长度增加
        //     console.log(other)
        //     let snakeRigidBody = other.owner.getComponent(Laya.RigidBody)
        //     let snakeBody = this.bodyRes.create()
        //     let bodyRopeJoint = snakeBody.getComponent(Laya.RopeJoint)
        //     bodyRopeJoint.otherBody = snakeRigidBody;

        //     console.log(snakeBody)
        //     other.owner.addChild(snakeBody)
        //     let snakeBodyRigidBody = snakeBody.getComponent(Laya.RigidBody)
        //     console.log(this.snake)
        //     snakeBodyRigidBody.linearVelocity = {x:this.snake.velocity,y:0}
        //     snakeBody.x = -10;
        //     snakeBody.y = 0;
        //     this.snakeBodyArr.push(snakeBody)

        //     //改变位置
        //     this.positionChange();
        //     //加分
        //     let s = this.scoreText.getComponent(Laya.Script)
        //     s.plusScore()
        // }
    }

    onEnable() {
        this.positionChange();
        console.log(this.owner)
        
    }

    onDisable() {
    }
}