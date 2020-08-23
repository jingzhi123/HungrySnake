import Snake from './Snake'
import BaseScript from './BaseScript'
export default class GameControl extends BaseScript {

    constructor() { 
        super(); 
        /** @prop {name:logo, tips:"LOGO", type:Node, default:null}*/
        let logo;
        /** @prop {name:btn, tips:"开始按钮", type:Node, default:null}*/
        let btn;
    }
    onAwake(){
        console.log(this)
    }
    onEnable() {
        
        let text = this.addGameNameText();
        this.btn.disabled=true;
        let timeline = Laya.TimeLine.from(this.logo,{x:0,y:this.logo.y},1000,null);
        timeline.to(this.btn,{alpha:1},1000,null)
        timeline.to(text,{alpha:1},1000,null)
        timeline.play(0)
        timeline.on(Laya.Event.COMPLETE,this,()=>{
            console.log('动画播放完毕!')
            this.btn.disabled=false;
            timeline.destroy()
        })
        this.timeline = timeline;
    }

    addGameNameText(){
        let text = new Laya.Text();
        console.log(this)
        text.text = this.gameName;
        text.alpha = 0;
        text.fontSize = 20;
        text.color = '#c00000';
        text.x = 640/2;
        text.y = 14;
        this.owner.addChild(text);
        return text;
    }

    onClick(){
        this.timeline.gotoTime(3000)
    }

    onDisable() {
    }

    createBox() {
        //使用对象池创建盒子
        let box = Laya.Pool.getItemByCreateFun("dropBox", this.dropBox.create, this.dropBox);
        box.pos(Math.random() * (Laya.stage.width - 100), -100);
        this._gameBox.addChild(box);
    }

    onKeyUp(e) {
        //停止事件冒泡，提高性能，当然也可以不要
        e.stopPropagation();
        //舞台被点击后，使用对象池创建子弹
        // let snake = Laya.Pool.getItemByCreateFun("snake", this.snake.create, this.snake);
        var snake = Laya.Pool.getItemByClass('snanke',Snake)
        console.log(snake)
        //snake.pos(Laya.stage.mouseX, Laya.stage.mouseY);
        this._bg.addChild(snake);
    }
}