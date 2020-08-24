import Snake from './Snake'
import BaseScript from './BaseScript'
export default class GameControl extends BaseScript {

    constructor() { 
        super(); 
        /** @prop {name:logo, tips:"LOGO", type:Node, default:null}*/
        let logo;
        /** @prop {name:btn, tips:"开始按钮", type:Node, default:null}*/
        let btn;
        /** @prop {name:gameText, tips:"游戏标题", type:Node, default:null}*/
        let gameText;
    }
    onAwake(){
        console.log(this)
    }
    onEnable() {
        
        this.btn.disabled=true;
        let timeline = Laya.TimeLine.from(this.logo,{x:0,y:this.logo.y},1000,null);
        timeline.to(this.btn,{alpha:1},1000,null)
        timeline.to(this.gameText,{alpha:1},1000,null,1000)
        timeline.play()
        timeline.on(Laya.Event.COMPLETE,this,()=>{
            console.log('动画播放完毕!')
            this.btn.disabled=false;
            timeline.destroy();
            this.timeline=null;
        })
        this.timeline = timeline;
    }

    onClick(){
        if(this.timeline){
            this.timeline.gotoTime(4000)
        }
    }

    onDisable() {
    }

    createBox() {
        //使用对象池创建盒子
        let box = Laya.Pool.getItemByCreateFun("dropBox", this.dropBox.create, this.dropBox);
        box.pos(Math.random() * (Laya.stage.width - 100), -100);
        this._gameBox.addChild(box);
    }
}