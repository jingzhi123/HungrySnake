import GameUtils from "../../common/GameUtils";

export default class GameSceneRuntime extends Laya.Scene {

    constructor() { 
        super(); 
        GameSceneRuntime.instance = this;

        /**
         * 分数
         */
        this.score = 0

        /**
         * 食物数
         */
        this.foodNum = 0;

        this.gameTime = new Date('2000/1/1 00:00:5').getTime()

        this.gameStart = false;
        /**
         * 左手控制摇杆默认位置
         */
        this.ctrlDefaultPos;

        /**
         * 玩家蛇脚本
         */
        this.playerScript;

        /**
         * 玩家蛇节点
         */
        this.playerSnake;

        /**
         * 摇杆默认位置
         */
        this.ctrlDefaultPos = {}
    }

    
    speedUp(e){
        this.playerScript.speedMode = true;
        this.playerScript.speedChange(this.playerScript.velocity+this.playerScript.acceleratedVelocity)
    }
    
    speedDown(e){
        this.playerScript.speedMode = false
        this.playerScript.speedChange(this.playerScript.velocity)
    }

    onStageMouseDown(e){
        if(e.stageX+this.btn_ctrl.width/2<=this.gameScene.width/2 && e.stageX>this.btn_ctrl.width/2){
            this.btn_ctrl.x = e.stageX;
            this.btn_ctrl.y = e.stageY;
        }
    }

    /**
     * 摇杆抬起
     */
    ctrlRockerUp(){
        if (this.gameScene.mouseX <= this.gameScene.width / 2 + this.btn_ctrl.width/2) {
            this.btn_ctrl_rocker.visible = true
            this.btn_ctrl_rocker_move.visible = false
            this.btn_ctrl.x = this.ctrlDefaultPos.x;
            this.btn_ctrl.y = this.ctrlDefaultPos.y;

        }
    }

    /**
     * 摇杆按下
     */
    ctrlRockerDown(){
        if (this.gameScene.mouseX <= this.gameScene.width / 2 + this.btn_ctrl.width/2) {
            this.btn_ctrl_rocker.visible = false
            this.btn_ctrl_rocker_move.visible = true
            if (GameUtils.distance(this.gameScene.mouseX, this.gameScene.mouseY, this.btn_ctrl.x, this.btn_ctrl.y) <= (this.gameScene.height)) {
                this.btn_ctrl_rocker_move.pos(this.gameScene.mouseX, this.gameScene.mouseY)
                this.playerSnake.rotation = Math.atan2(this.gameScene.mouseY - this.btn_ctrl.y, this.gameScene.mouseX - this.btn_ctrl.x) * 180 / Math.PI
            } else {
                this.btn_ctrl_rocker_move.pos(
                    this.btn_ctrl.x + (this.btn_ctrl.width / 2 - this.btn_ctrl.width / 2) * Math.cos(Math.atan2(this.gameScene.mouseY - this.btn_ctrl.y, this.gameScene.mouseX - this.btn_ctrl.x))
                    ,
                    this.btn_ctrl.y + (this.btn_ctrl.width / 2 - this.btn_ctrl.width / 2) * Math.sin(Math.atan2(this.gameScene.mouseY - this.btn_ctrl.y, this.gameScene.mouseX - this.btn_ctrl.x))
                )
            }
        }
    }

    /**
     * 游戏开始
     */
    startGame(){
        this.gameStart = true;
        // this.timeLabel.text = GameUtils.dateFormat('mm:ss',new Date(this.gameTime))
        this.timeMinus()
        Laya.timer.loop(1000,this,this.timeMinus)
    }

    /**
     * 游戏结束
     */
    stopGame(){
        this.gameStart = false;
        this.showGameOver();
        Laya.timer.clear(this,this.timeMinus)
    }

    /**
     * 显示记分版
     */
    showGameOver(){
        this.scoreView.visible = true;
        this.refreshScore();
        this.controlPad.destroy()
    }

    refreshScore(){
        this.scoreLabel.text = this.score;
    }

    timeMinus(){
        this.timeLabel.text = GameUtils.dateFormat('mm:ss',new Date(this.gameTime))
        if(this.timeLabel.text!='00:00'){
            this.gameTime -= 1000;
        } else {
            this.stopGame()
        }
    }

    onAwake(){
        this.gameScene = this;
        this.scoreLabel = this.scoreView.getChildByName('label_score')
        this.on('playerComplete',this,(playerSnake)=>{
            this.playerSnake = playerSnake;
            this.playerScript = playerSnake.getComponent(Laya.Script);
            this.btn_speedup.on('mousedown',this,this.speedUp)
            this.btn_speedup.on('mouseup',this,this.speedDown)
            this.on('mousedown',this,this.onStageMouseDown)
            this.gameScene.on("mouseup", this, this.ctrlRockerUp)
            this.gameScene.on("mousemove",this, this.ctrlRockerDown)

            this.shootBtn.clickHandler = Laya.Handler.create(this,()=>{
                this.playerScript.shoot()
            },null,false)
            this.controlPad.onDestroy = ()=>{
                this.btn_speedup.off('mousedown',this,this.speedUp)
                this.btn_speedup.off('mouseup',this,this.speedDown)
                this.gameScene.off("mouseup", this, this.ctrlRockerUp)
                this.gameScene.off("mousemove",this, this.ctrlRockerDown)
            }
            // this.rightView.right = this.gameScene.width*0.05;

            // this.btn_ctrl.left = this.gameScene.width*0.05;

            this.ctrlDefaultPos = {x:this.btn_ctrl.x,y:this.btn_ctrl.y}
        })
    }
    
    onEnable() {
        this.initNums()
    }

    onDisable() {
    }

    /**
     * 初始化数值
     */
    initNums(){
        this.scoreText.text = 0;
        this.foodNumText.text = 0;
    }

    changeScore(score){
        this.score = score;
        this.scoreText.text = this.score;
    }

    plusScore(score){
        score?this.score+=score:this.score++;
        this.scoreText.text = this.score;
    }

    minusScore(score){
        score?this.score-=score:this.score--;
        this.scoreText.text = this.score;
    }

    changeFoodNum(foodNum){
        this.foodNum = foodNum;
        this.foodNumText.text = this.foodNum;
    }

    plusFoodNum(foodNum){
        foodNum?this.foodNum+=foodNum:this.foodNum++;
        this.foodNumText.text = this.foodNum;
    }

    /**
     * 减少食物数量数值
     * @param {食物数量} foodNum 
     */
    minusFoodNum(foodNum){
        foodNum?this.foodNum-=foodNum:this.foodNum--;
        this.foodNumText.text = this.foodNum;
    }
}