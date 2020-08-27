import BaseScript from "../BaseScript";

export default class ScoreControl extends Laya.Script {

    constructor() { 
        super(); 
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

    onEnable() {
    }

    onDisable() {
    }
}