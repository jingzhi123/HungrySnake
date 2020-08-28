import BaseScript from '../BaseScript'
export default class GameControl extends BaseScript {

    constructor() { 
        super(); 
        /** @prop {name:logo, tips:"LOGO", type:Node, default:null}*/
        let logo;
        /** @prop {name:btn, tips:"开始按钮", type:Node, default:null}*/
        let btn;
        /** @prop {name:rankListBtn, tips:"排行榜按钮", type:Node, default:null}*/
        let rankListBtn;
        /** @prop {name:rankListCloseBtn, tips:"排行榜关闭按钮", type:Node, default:null}*/
        let rankListCloseBtn;
        /** @prop {name:gameText, tips:"游戏标题", type:Node, default:null}*/
        let gameText;
        /** @prop {name:scoreList, tips:"分数列表", type:Node, default:null}*/
        let scoreList;
        /** @prop {name:ani, tips:"动画", type:Node, default:null}*/
        let ani;
    }
    onAwake(){
        
        //Laya.stage.screenMode = "horizontal";
        //排行榜打开
        this.rankListBtn.clickHandler = Laya.Handler.create(this,(e)=>{
            console.log('打开排行!')
            let scoreArr = Laya.LocalStorage.getJSON('scoreArr')
            this.scoreList.visible = true;
            let scorePanel = this.scoreList.getChildByName('panel_score')
            console.log(Laya.LocalStorage.items)
            scoreArr.sort((a,b)=>{
                return b.score-a.score;
            })
            scoreArr.forEach((s,i)=>{
                let text = new Laya.Text()
                text.width = scorePanel.width
                text.fontSize = 18;
                text.height = 20;
                text.x = 0;
                text.y = i*text.height+ 20;
                text.align = 'center'
                text.valign = 'top'
                text.text = '姓名: ' + s.name + " , 分数: " + s.score;
                scorePanel.addChild(text)
            })
        },null,false)
        //排行榜关闭
        this.rankListCloseBtn.clickHandler = Laya.Handler.create(this,(e)=>{
            this.scoreList.visible = false;
        },null,false)
        
    }
    onEnable() {
        
        this.btn.disabled=true;
        let timeline = Laya.TimeLine.from(this.logo,{x:0,y:this.logo.y},1000,null);
        timeline.to(this.btn,{alpha:1},1000,null)
        timeline.to(this.rankListBtn,{alpha:1},1000,null)
        timeline.to(this.gameText,{alpha:1},1000,null,1000)
        timeline.play()
        timeline.on(Laya.Event.COMPLETE,this,()=>{
            console.log('动画播放完毕!')
            this.btn.disabled=false;
            this.rankListBtn.disabled=false;
            timeline.destroy();
            this.timeline=null;
        })
        this.timeline = timeline;
    }

    onClick(){
        if(this.timeline){
            this.timeline.gotoTime(5000)
        }
    }

    onDisable() {
    }

}