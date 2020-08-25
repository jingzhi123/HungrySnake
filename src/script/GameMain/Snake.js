export default class Snake extends Laya.Script {

    constructor() { 
        super(); 
        /** @prop {name:snake, tips:"蛇", type:Node, default:null}*/
        let snake;
        /** @prop {name:snakeBody, tips:"蛇身", type:Prefab, default:null}*/
        let snakeBody;

        /** @prop {name:rigid, tips:"刚体", type:Node, default:null}*/
        let rigid;

        /** @prop {name:wall, tips:"墙", type:Node, default:null}*/
        let wall;

        /** @prop {name:food, tips:"食物", type:Node, default:null}*/
        let food;

        /** @prop {name:step, tips:"步长", type:Number, default:10}*/
        this.step = 10;

        /** @prop {name:direction, tips:"方向", type:String, default:"右"}*/
        this.direction = '右';
        
        /** @prop {name:frame, tips:"速率(刷新率)", type:Number, default:60}*/
        this.frame = 60;
        
        /** @prop {name:velocity, tips:"初始速度", type:Number, default:1}*/
        this.velocity = 1;
        
        
        /** @prop {name:acceleratedVelocity, tips:"加速度", type:Number, default:1}*/
        this.acceleratedVelocity = 1;
        
        //按键时间
        this.keyPressTime=0;

        //当前速度
        this.currentVelocity = 0;

        //是否已经死亡
        this.dead = false;

        //是否为加速模式
        this.speedMode = false;

        this.snakeBodyArr=[]

        this.snakeLength = 10;
        
    }

    onAwake(){

        this.positionChange()
        Laya.timer.frameLoop(this.frame,this,this.move,[this.velocity])


        this.foodScript = this.food.getComponent(Laya.Script)
        Laya.loader.load('res/sprite_snakebody.prefab',Laya.Handler.create(this,(res)=>{
            this.bodyRes = res;
            // this.snakeBody = res.create();
            // console.log(this.snakeBody)
        }))

    }

    positionChange(){
        this.owner.x = Math.random()*this.owner.parent.width.toFixed(0);
        this.owner.y = Math.random()*this.owner.parent.height.toFixed(0);
    }
    
    onEnable() {
        
    }

    onTriggerEnter(other,self,contact){
        if(other.name=='collider_wall'){
            this.owner.event('dead','撞墙了!');
            Laya.timer.pause()
        }
        if(other.name=='collider_food'){
            //长度增加
            console.log(other)
            let snakeRigidBody = this.rigid;
            let snakeBody = this.bodyRes.create()
            
            
            let snakeBodyRigidBody = snakeBody.getComponent(Laya.RigidBody)
            snakeBodyRigidBody.type = 'dynamic'
            let bodyRopeJoint = snakeBody.getComponent(Laya.RopeJoint)
            bodyRopeJoint.maxLength = this.snakeLength;
            if(!this.snakeBodyArr.length){
                bodyRopeJoint.otherBody = snakeRigidBody;
                this.snake.addChild(snakeBody)

            } else {
                let lastBody = this.snakeBodyArr[this.snakeBodyArr.length-1];
                let lastBodyRigidBody = lastBody.getComponent(Laya.RigidBody)
                
                bodyRopeJoint.otherBody = lastBodyRigidBody;
                lastBody.addChild(snakeBody)
            }
            
            this.snakeBodyArr.push(snakeBody)

            //改变位置
            this.foodScript.positionChange();
            //加分
            let s = this.foodScript.scoreText.getComponent(Laya.Script)
            s.plusScore()
        }
    }

    onTriggerStay(other,self,contact){
        console.log(other,self,contact)
    }

    onStart(){
        this.initDeadListener();
    }

    initDeadListener(){
        this.owner.on('dead',this,(msg)=>{
            this.dead = true;
            console.log(msg)
            this.stop()
        })
    }

    stop(){
        this.rigid.linearVelocity = {x:0,y:0}
    }

    move(velocity){
        this.currentVelocity = velocity;
        switch (this.direction) {
            case '右':
                this.rigid.linearVelocity = {x:velocity,y:0}
                
                break;
            case '左':
                this.rigid.linearVelocity = {x:-velocity,y:0}
                
                break;
            case '上':
                this.rigid.linearVelocity = {x:0,y:-velocity}
                
                break;
            case '下':
                this.rigid.linearVelocity = {x:0,y:velocity}
                break;
        
            default:
                break;
        }
    }

    onUpdate(){
        
    }

    onKeyDown(e){
        if(this.dead)return;
        this.keyPressTime ++;

        this.speedMode = this.keyPressTime>2;
        
        switch (e.keyCode) {
            case 37:
                this.direction = '左'
                break;
            case 38:
                this.direction = '上'
                break;
            case 39:
                this.direction = '右'
                break;
            case 40:
                this.direction = '下'
                break;
        
            default:
                break;
        }
        if(this.speedMode){
            this.move(this.velocity+this.acceleratedVelocity)
        } else {
            this.move(this.currentVelocity)
            if(this.keyPressTime>2){
                this.speedMode = true;
                this.move(this.velocity+this.acceleratedVelocity)
            }
        }
        // Laya.timer.once(500,this,Laya.Handler.create(this,()=>{
        //     this.move(this.velocity+this.acceleratedVelocity)
        // }))
        
    }

    onKeyPress(){
        console.log(1)
    }

    onKeyUp(e){
        if(this.dead)return;

        if(!this.speedMode){
            this.keyPressTime = 0
        }

        this.move(this.velocity)
        Laya.timer.once(1000,this,()=>{
            this.speedMode = false;
        })
    }
    
    onDisable() {
    }
}