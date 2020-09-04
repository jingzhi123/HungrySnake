import BaseScript from '../BaseScript'
import GameControl from '../GameControl';
import GameSceneRuntime from '../runtime/GameSceneRuntime';
export default class GameScene extends BaseScript {

    constructor() { 
        super(); 
        /** @prop {name:returnBtn, tips:"返回按钮", type:Node, default:null}*/
        let returnBtn;
        /** @prop {name:scoreView, tips:"分数视图", type:Node, default:null}*/
        let scoreView;
        /** @prop {name:wall, tips:"墙", type:Node, default:null}*/
        let wall;

        this.score = 0;//当前分数

        this.foodNum = 0;//当前食物数
        
    }

    onAwake(){
        super.onAwake()
        this.gameScene.startGame()
        if(Laya.Browser.onMiniGame){
            wx.showToast({title:'hiGameScene'})
        }
    }
    onStart() {
        console.log('start')
        this.onLoadComplete();

        this.returnBtn.clickHandler = Laya.Handler.create(this,(e)=>{
            Laya.Scene.open('init.scene')
        })
    }
    
    onLoadComplete(){
        //播放bgm
        // this.bgm = Laya.SoundManager.playSound("sound/bgm.mp3",1,Laya.Handler.create(this,()=>{
        //     console.log('播放完毕')
        // }))
        
        
    }
    onDestroy(){
        console.log('destory')
        let bgm = this.bgm;
        if(bgm){
            bgm.stop();
        }
    }

    onDisable() {
        console.log('disabled')
    }
}