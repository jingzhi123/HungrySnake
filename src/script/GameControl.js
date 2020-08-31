import BaseScript from './BaseScript'
import Global from '../common/Global';
import HttpUtils from '../common/HttpUtils';

export default class GameControl extends BaseScript {

    constructor() { 
        super(); 
        /** @prop {name:logo, tips:"LOGO", type:Node, default:null}*/
        let logo;
        /** @prop {name:progressBar, tips:"进度条", type:Node, default:null}*/
        let progressBar;
        /** @prop {name:startBtn, tips:"开始按钮", type:Node, default:null}*/
        let startBtn;
        /** @prop {name:rankListBtn, tips:"排行榜按钮", type:Node, default:null}*/
        let rankListBtn;
        /** @prop {name:rankListCloseBtn, tips:"排行榜关闭按钮", type:Node, default:null}*/
        let rankListCloseBtn;
        /** @prop {name:gameText, tips:"游戏标题", type:Node, default:null}*/
        let gameText;
        /** @prop {name:scorePanel, tips:"分数列表", type:Node, default:null}*/
        let scorePanel;
        /** @prop {name:avatarImg, tips:"头像", type:Node, default:null}*/
        let avatarImg;
    }

    createUserInfoButton(){
        if(Laya.Browser.onMiniGame){
            //登陆按钮
            let button = wx.createUserInfoButton({
                type:'text',
                text:'登陆!',
                style: {
                    left: wx.getSystemInfoSync().screenWidth/2-100,
                    top: 76,
                    width: 200,
                    height: 40,
                    lineHeight: 40,
                    backgroundColor: '#ff0000',
                    color: '#ffffff',
                    textAlign: 'center',
                    fontSize: 16,
                    borderRadius: 4
                    }
                })
            button.onTap((res) => {
                if(res.userInfo){
                    console.log(res.userInfo)

                    let img = new Laya.Image(res.userInfo.avatarUrl);
                    img.zOrder = 2;
                    img.width = this.avatarImg.width;
                    img.height = this.avatarImg.height;
                    img.pos(this.avatarImg.x,this.avatarImg.y)
                    img.on(Laya.Event.LOADED,this,()=>{
                        this.avatarImg.removeSelf()
                        wx.showToast({title:'头像加载成功'})
                        this.owner.addChild(img)
                    })
                    
                    console.log(Global.SysInfo.windowWidth,Global.SysInfo.windowHeight);
    
                    wx.showToast({title:res.userInfo.nickName,icon:'success'})
                    //this.onStartBtnClick()

                } else {
                }
            })
            GameControl.loginButton = button;
        }
    }
    onAwake(){
        console.log('是否微信小游戏',Laya.Browser.onMiniGame);
        this.owner.width = Laya.stage.width;
        this.owner.getChildByName('sprite_bg').width = Laya.stage.width;
        this.owner.pos(0,0)
        
        this.createUserInfoButton();
        //开始按钮点击
        this.startBtn.clickHandler = Laya.Handler.create(this,(e)=>{
            this.onStartBtnClick()
        })
        //排行榜打开
        this.rankListBtn.clickHandler = Laya.Handler.create(this,(e)=>{
            let req = new HttpUtils()
            this.showLoading()
            req.once(Laya.Event.ERROR,this,(e)=>{
                console.log(e);
                this.removeLoading()
            })
            req.getJson(`${Global.ctx}/common/snake_score/query`,(data)=>{
                console.log(data);
                console.log('打开排行!')
                let scoreArr = data
                this.scoreList.visible = true;

                if(scoreArr){
                    scoreArr.sort((a,b)=>{
                        return b.score-a.score;
                    })
                    scoreArr.forEach((s,i)=>{
                        let text = new Laya.Text()
                        text.width = this.scorePanel.width
                        text.fontSize = 18;
                        text.height = 20;
                        text.x = 0;
                        text.y = i*text.height+ 20;
                        text.align = 'center'
                        text.valign = 'top'
                        text.text = '姓名: ' + s.name + " , 分数: " + s.score;
                        this.scorePanel.addChild(text)
                    })
                }
                this.removeLoading()
            },['token',Global.token,'code','snake'])

        },null,false)
        //排行榜关闭
        this.rankListCloseBtn.clickHandler = Laya.Handler.create(this,(e)=>{
            this.scoreList.visible = false;
        },null,false)
        
    }

    rankDataComplete(data){
        this.removeLoading()
        console.log(data);
    }

    onStartBtnClick(){
        console.log('游戏开始:',this.owner)
        this.progressBar.visible = true;
        console.log(Global.LOAD_RESOURCES);
        let load = Laya.loader.load(Global.LOAD_RESOURCES,Laya.Handler.create(this,Global.onResourcesLoaded),Laya.Handler.create(this,(num)=>{
            Global.log("进度:"+num)
            this.progressBar.value = num;
            if(num==1){
                setTimeout(() => {
                    Global.log("加载场景")
                    //加载场景
                    Laya.Scene.open('scene/GameScene.scene',true,null,Laya.Handler.create(this,(scene)=>{
                        console.log(scene)
                        Global.log("加载场景完毕")
                    }))

                }, 500);
            }
        },null,false),Laya.Loader.SOUND)

        load.on(Laya.Event.ERROR,this,(err)=>{
            console.log('加载失败:' + err);
            setTimeout(() => {
                //加载场景
                Laya.Scene.open('scene/GameScene.scene')

            }, 500);
        })

    }

    onStart(){
        this.owner.width = Laya.stage.width
    }

    onEnable() {
        
        this.startBtn.disabled=true;
        // let timeline = Laya.TimeLine.from(this.logo,{x:0,y:this.logo.y},1000,null);
        this.gameText.x = Laya.stage.width/2 - this.gameText.width/2
        let timeline = Laya.TimeLine.to(this.startBtn,{alpha:1},1000,null)
        timeline.to(this.rankListBtn,{alpha:1},1000,null)
        timeline.to(this.gameText,{alpha:1},1000,null,1000)
        timeline.play()
        timeline.on(Laya.Event.COMPLETE,this,()=>{
            console.log('动画播放完毕!')
            this.startBtn.disabled=false;
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