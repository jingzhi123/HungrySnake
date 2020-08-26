export default class Snake extends Laya.Script {

    constructor() { 
        super(); 
        /** @prop {name:snake, tips:"蛇", type:Node, default:null}*/
        let snake;
        /** @prop {name:snakeBody, tips:"蛇身", type:Prefab, default:null}*/
        let snakeBody;
        /** @prop {name:scoreList, tips:"分数列表", type:Node, default:null}*/
        let scoreList;

        /** @prop {name:rigid, tips:"刚体", type:Node, default:null}*/
        let rigid;

        /** @prop {name:wall, tips:"墙", type:Node, default:null}*/
        let wall;

        /** @prop {name:food, tips:"食物", type:Node, default:null}*/
        let food;

        /** @prop {name:step, tips:"步长", type:Number, default:1}*/
        this.step = 1;

        /** @prop {name:direction, tips:"初始方向", type:String, default:"右"}*/
        this.direction = '右';
        
        /** @prop {name:frame, tips:"速率(刷新率)", type:Number, default:1}*/
        this.frame = 1;
        
        /** @prop {name:velocity, tips:"初始速度", type:Number, default:1}*/
        this.velocity = 2;
        
        
        /** @prop {name:acceleratedVelocity, tips:"加速度", type:Number, default:1}*/
        this.acceleratedVelocity = 1;
        
        //按键时间
        this.keyPressTime=0;

        //按键延迟多久加速
        this.keyPressDelay = 6;

        //当前速度
        this.currentVelocity = 0;

        //是否已经死亡
        this.dead = false;

        //是否为加速模式
        this.speedMode = false;

        
        this.snakeBodyArr=[]

        //路径数组
        this.pathArr=[]

        this.snakeLength = 10;
        
    }

    onAwake(){
        console.log('awake')
        this.snake.on('directionChange',this,(direction)=>{
            this.directionChange(direction)
        })
        this.snake.on('speedChange',this,(velocity)=>{
            this.speedChange(velocity)
        })
        //初始化位置
        this.positionChange()
        //初始化速度
        this.currentVelocity = this.velocity;
        //初始化方向
        this.directionChange(this.direction)

        Laya.timer.frameLoop(this.frame,this,this.mainLoop)

        this.foodScript = this.food.getComponent(Laya.Script)
        this.scoreScript = this.foodScript.scoreText.getComponent(Laya.Script);
        this.gameMain = this.owner.scene.getComponent(Laya.Script)
        this.scoreView = this.gameMain.scoreView;

        Laya.loader.load('res/sprite_snakebody.prefab',Laya.Handler.create(this,(res)=>{
            this.bodyRes = res;
            // this.snakeBody = res.create();
            // console.log(this.snakeBody)
        }))

    }

    //方向改变
    directionChange(direction){
        switch (direction) {
            case '右':
                if(this.direction=='左'){
                    return;
                } 
                this.snake.rotation = 90;
                //this.rigid.setVelocity({x:this.currentVelocity,y:0})
                break;
            case '左':
                if(this.direction=='右'){
                    return;
                }
                this.snake.rotation = -90;
                //this.rigid.setVelocity({x:-this.currentVelocity,y:0})
                break;
            case '上':
                if(this.direction=='下'){
                    return;
                }
                this.snake.rotation = 180;
                //this.rigid.setVelocity({x:0,y:-this.currentVelocity})
                break;
            case '下':
                if(this.direction=='上'){
                    return;
                }
                this.snake.rotation = 0;
                //this.rigid.setVelocity({x:0,y:this.currentVelocity})
                break;
        
            default:
                break;
        }
        this.direction = direction;
    }
    //速度改变
    speedChange(velocity){
        this.currentVelocity = velocity;
    }

    positionChange(){
        this.owner.x = Math.random()*(this.owner.parent.width-10).toFixed(0);
        this.owner.y = Math.random()*(this.owner.parent.height-10).toFixed(0);
    }

    onTriggerEnter(other,self,contact){
        if(other.name=='collider_wall'){
            this.owner.event('dead','撞墙了!');
        }
        if(other.name=='collider_food'){
            this.addBody()
        }
    }



    onTriggerStay(other,self,contact){
        console.log('stay')
    }

    onTriggerExit(other,self,contact){
        if(other.name=='collider_snakebody'){
            console.log('exit')
            if(this.direction == '右' && this.snake.x < other.owner.x){

                this.owner.event('dead','撞身体上了!');
            }
        }
    }

    onStart(){
        this.onDead();
        console.log(this.rigid)
    }

    onDead(){
        //监听死亡
        this.owner.on('dead',this,(msg)=>{
            this.dead = true;
            console.log(msg)
            console.log(this.scoreView)
            this.scoreView.visible = true;
            let scoreLabel = this.scoreView.getChildByName('label_score')
            scoreLabel.text = this.scoreScript.score;
            let scoreArr = Laya.LocalStorage.getJSON('scoreArr')
            if(!scoreArr){
                scoreArr = [{name:'张三',score:this.scoreScript.score}]
            } else {
                scoreArr.push({name:'李四',score:this.scoreScript.score})
            }
            Laya.LocalStorage.setJSON('scoreArr',scoreArr)

            

            this.stop()
        })
    }

    stop(){
        // this.rigid.setVelocity({x:0,y:0})
        Laya.timer.pause()
    }

    mainLoop(){
        // this.move()
        this.headMove()
        this.bodyMove()
    }

    headMove(){
        let x = this.step * Math.sin(this.snake.rotation * Math.PI / 180)
        let y = this.step * Math.cos(this.snake.rotation * Math.PI / 180)

        let pos = { x: this.x, y: this.y }
        let posBefore = { x: this.x, y: this.y }

        for (let index = 1; index <= this.currentVelocity; index++) {

            this.snake.x += x;
            this.snake.y += y;
            if(this.snakeBodyArr.length){
                this.pathArr.unshift({x:this.snake.x,y:this.snake.y,rotation:this.snake.rotation})
            }
        }
    }

    bodyMove(){
        if(this.pathArr.length){

            for(let index=0;index<this.snakeBodyArr.length;index++){
                let body = this.snakeBodyArr[index];
                //当前身体需要获取的路径下标(第几个this.frame帧时,蛇走了index+1*body.width个像素)
                let curIndex = Math.ceil((index+1)*((body.width*this.frame)/this.step));
                console.log(curIndex)
                if(this.pathArr[curIndex]){
                    let path = this.pathArr[curIndex]
                    
                    let p = new Laya.Point(path.x,path.y)
                    console.log(body.rotation)
                    body.x = p.x;
                    body.y = p.y;

                }
                if(this.pathArr.length > (this.snakeBodyArr.length+1) * (body.width/this.step)){
                    this.pathArr.pop();
                }
                // let rigid = body.getComponent(Laya.RigidBody)
                // rigid.setVelocity(this.rigid.linearVelocity)
            }
        }
    }

    addBody(){
        //长度增加
        let snakeRigidBody = this.rigid;
        let snakeBody = this.bodyRes.create()
        let snakeBodyRigidBody = snakeBody.getComponent(Laya.RigidBody)
        snakeBodyRigidBody.type = 'kinematic'
        snakeBodyRigidBody.collidConnected = true;

        let bodyRopeJoint = snakeBody.getComponent(Laya.RopeJoint)
        bodyRopeJoint.maxLength = this.snakeLength;

        
        // snakeBody.x = this.snake.x;
        // snakeBody.y = this.snake.y;
        if(!this.snakeBodyArr.length){
            bodyRopeJoint.otherBody = snakeRigidBody;
            this.wall.addChild(snakeBody)

        } else {
            let lastBody = this.snakeBodyArr[this.snakeBodyArr.length-1];
            let lastBodyRigidBody = lastBody.getComponent(Laya.RigidBody)
            
            bodyRopeJoint.otherBody = lastBodyRigidBody;

            this.wall.addChild(snakeBody)
        }
        
        this.snakeBodyArr.push(snakeBody)

        //改变位置
        this.foodScript.positionChange();
        //加分
        this.scoreScript.plusScore()
    }

    onUpdate(){
        
    }

    onKeyDown(e){
        if(this.dead)return;
        let predirection = this.direction;
        switch (e.keyCode) {
            case 37:
                this.snake.event('directionChange','左')
                break;
            case 38:
                this.snake.event('directionChange','上')
                break;
            case 39:
                this.snake.event('directionChange','右')
                break;
            case 40:
                this.snake.event('directionChange','下')
                break;
        
            default:
                break;
        }

        console.log(this.speedMode)

        if(this.speedMode){
            this.snake.event('speedChange',this.velocity+this.acceleratedVelocity)
        } else {
            this.headMove(this.currentVelocity)
            if(this.keyPressTime>this.keyPressDelay){
                this.speedMode = true;
                this.snake.event('speedChange',this.velocity+this.acceleratedVelocity)
            }
        }

        //方向改变
        if(this.direction!=predirection){
            this.keyPressTime = 0;
            this.snake.event('directionChange',this.direction)
        } else {
            this.keyPressTime++;
        }

        this.speedMode = this.keyPressTime>2;
        
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
        this.snake.event('speedChange',this.velocity)
        
        Laya.timer.once(1000,this,()=>{
            console.log('恢复速度')
            this.speedMode = false;
        },null,true)
    }
    
    onDisable() {
    }
}