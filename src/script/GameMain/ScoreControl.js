export default class ScoreControl extends Laya.Script {

    constructor() { 
        super(); 
        /** @prop {name:score, tips:"分数", type:Number, default:0}*/
        this.score = 0;
        /** @prop {name:scoreText, tips:"分数Text", type:Node, default:null}*/
        let scoreText;
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

    onAwake(){
        this.changeScore(this.score)
    }

    onEnable() {
    }

    onDisable() {
    }
}