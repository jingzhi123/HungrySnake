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

    /**
     * 构建登陆按钮
     * @param {当前对象} _this 
     * @param {openid} openid 
     */
    createUserInfoButton(_this,openid) {
        //登陆按钮
        let bthWidth = _this.startBtn.width * Global.SysInfo.screenWidth / _this.owner.scene.width;
        let btnHeight = _this.startBtn.height * Global.SysInfo.screenHeight / _this.owner.scene.height;
        let button = wx.createUserInfoButton({
            type: 'text',
            text: '',
            style: {
                left: Global.SysInfo.screenWidth / 2 - bthWidth / 2,
                top: _this.startBtn.y * Global.SysInfo.screenHeight / _this.owner.scene.height,
                width: bthWidth,
                height: btnHeight,
                opacity: 0,
            }
        });
        button.onTap((res) => {
            if (res.userInfo) {
                Global.userInfo = res.userInfo;
                Global.userInfo.openid = openid;
                console.log(Global.userInfo)
                let param = JSON.parse(JSON.stringify(Global.userInfo))
                param.rawdata = JSON.stringify(Global.userInfo);
                wx.request({
                    url: `${Global.ctx}/public/wxmini/toLogin`,
                    method: 'POST',
                    header: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                    },
                    data: param,
                    success(res) {
                        let data = res.data;
                        if (data.status > 0) {
                            _this.onStartBtnClick()
                            button.destroy()
                        } else {
                            console.log(data.message);
                        }


                    },
                    fail(err) {
                        console.log(err);
                    }
                })
                _this.loadAvatar(res.userInfo.avatarUrl)
                wx.showToast({
                    title: res.userInfo.nickName,
                    icon: 'success'
                })


            } else {
                wx.showToast({
                    title: '请先登录!',
                    icon: 'none'
                })
            }
        })
    }

    /**
     * 微信登陆,取到openid并构建登陆按钮
     */
    wxLogin() {
        let _this = this;
        wx.login({
            success(res) {
                if (res.code) {
                    console.log(res);
                    //发起网络请求
                    wx.request({
                        url: `${Global.ctx}/public/wxmini/openid`,
                        data: {
                            code: res.code
                        },
                        success(res) {
                            let data = res.data.dataMap;
                            let openid = data.openid;
                            _this.createUserInfoButton(_this,openid)

                        },
                        fail(err) {
                            console.log(err);
                        }
                    })
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        })
    }

    /**
     * 检查是否已经登录,若没有,直接构建登陆
     */
    checkIfNeedLoginAndDoLogin() {
        let _this = this;
        if (Laya.Browser.onMiniGame) {
            if (Global.userInfo) {
                _this.loadAvatar(Global.userInfo.avatarUrl)
            } else {
                _this.wxLogin()
            }
            // wx.checkSession({
            //     success() {
            //         _this.loadAvatar(Global.userInfo.avatarUrl)
            //         console.log('已登录');
            //     },
            //     fail() {
            //         // session_key 已经失效，需要重新执行登录流程
            //         _this.wxLogin() //重新登录
            //     }
            // })


        }
    }

    loadAvatar(avatarUrl) {
        console.log('加载头像', this.avatarImg);
        this.avatarImg.loadImage(avatarUrl, 0, 0, 0, 0, () => {
            this.avatarImg.removeSelf()
            wx.showToast({
                title: '头像加载成功'
            })
            this.owner.addChild(img)
        })
    }
    /**
     * 加载默认头像,若已经登录,则直接加载用户头像
     */
    loadDefaultAvatar(){
        if (Global.userInfo) {
            this.loadAvatar(Global.userInfo.avatarUrl)
        } else {
            this.avatarImg.loadImage('images/avatar.jpg', 0, 0, 0, 0, () => {
                this.avatarImg.removeSelf()
                wx.showToast({
                    title: '头像加载成功'
                })
                this.owner.addChild(img)
            })
        }
    }
    onAwake() {
        console.log('是否微信小游戏', Laya.Browser.onMiniGame);
        this.loadDefaultAvatar()
        this.checkIfNeedLoginAndDoLogin();
        //开始按钮点击   
        this.startBtn.clickHandler = Laya.Handler.create(this, (e) => {
            this.onStartBtnClick()
        })
        //排行榜打开
        this.rankListBtn.clickHandler = Laya.Handler.create(this, (e) => {
            let req = new HttpUtils()
            this.showLoading()
            req.once(Laya.Event.ERROR, this, (e) => {
                console.log(e);
                this.removeLoading()
            })
            req.getJson(`${Global.ctx}/common/snake_score/query`, (data) => {
                console.log(data);
                console.log('打开排行!')
                let scoreArr = data
                this.scoreList.visible = true;

                if (scoreArr) {
                    scoreArr.sort((a, b) => {
                        return b.score - a.score;
                    })
                    scoreArr.forEach((s, i) => {
                        let text = new Laya.Text()
                        text.width = this.scorePanel.width
                        text.fontSize = 18;
                        text.height = 20;
                        text.x = 0;
                        text.y = i * text.height + 20;
                        text.align = 'center'
                        text.valign = 'top'
                        text.text = '姓名: ' + s.name + " , 分数: " + s.score;
                        this.scorePanel.addChild(text)
                    })
                }
                this.removeLoading()
            }, ['token', Global.token, 'code', 'snake'])

        }, null, false)
        //排行榜关闭
        this.rankListCloseBtn.clickHandler = Laya.Handler.create(this, (e) => {
            this.scoreList.visible = false;
        }, null, false)

    }

    rankDataComplete(data) {
        this.removeLoading()
        console.log(data);
    }

    onStartBtnClick() {
        console.log('游戏开始:', this.owner)
        this.progressBar.visible = true;
        console.log(Global.LOAD_RESOURCES);
        let load = Laya.loader.load(Global.LOAD_RESOURCES, Laya.Handler.create(this, Global.onResourcesLoaded), Laya.Handler.create(this, (num) => {
            Global.log("进度:" + num)
            this.progressBar.value = num;
            if (num == 1) {
                setTimeout(() => {
                    Global.log("加载场景")
                    //加载场景
                    Laya.Scene.open('gameScene.scene', true, null, Laya.Handler.create(this, (scene) => {
                        console.log(scene)
                        Global.log("加载场景完毕")
                    }))

                }, 500);
            }
        }, null, false))

        load.on(Laya.Event.ERROR, this, (err) => {
            console.log('加载失败:' + err);
        })

    }

    onStart() {
        this.owner.width = Laya.stage.width
    }

    onEnable() {

        this.startBtn.disabled = true;
        // let timeline = Laya.TimeLine.from(this.logo,{x:0,y:this.logo.y},1000,null);
        this.gameText.x = Laya.stage.width / 2 - this.gameText.width / 2
        let timeline = Laya.TimeLine.to(this.startBtn, {
            alpha: 1
        }, 1000, null)
        timeline.to(this.rankListBtn, {
            alpha: 1
        }, 1000, null)
        timeline.to(this.gameText, {
            alpha: 1
        }, 1000, null, 1000)
        timeline.play()
        timeline.on(Laya.Event.COMPLETE, this, () => {
            console.log('动画播放完毕!')
            this.startBtn.disabled = false;
            this.rankListBtn.disabled = false;
            timeline.destroy();
            this.timeline = null;
        })
        this.timeline = timeline;
    }

    onClick() {
        if (this.timeline) {
            this.timeline.gotoTime(5000)
        }
    }

    onDisable() {}

}