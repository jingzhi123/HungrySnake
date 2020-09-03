export default class GameSceneRuntime extends Laya.Scene {

    constructor() { 
        super(); 
        GameSceneRuntime.instance = this;

        this.score = 0
        this.foodNum = 0;
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
        score?this.score+=score:this.score++;
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

    minusFoodNum(foodNum){
        foodNum?this.foodNum+=foodNum:this.foodNum++;
        this.foodNumText.text = this.foodNum;
    }
}