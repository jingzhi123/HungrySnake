import BaseScript from '../BaseScript'
export default class GameMain extends BaseScript {

    constructor() { 
        super(); 
        /** @prop {name:returnBtn, tips:"返回按钮", type:Node, default:null}*/
        let returnBtn;
        /** @prop {name:scoreView, tips:"分数视图", type:Node, default:null}*/
        let scoreView;
        /** @prop {name:wall, tips:"墙", type:Node, default:null}*/
        let wall;
        
    }

    onAwake(){
        BaseScript.gameScene = this.owner
        BaseScript.wall = this.wall
    }



    onStart() {
        console.log('start')
        this.onLoadComplete();

        this.returnBtn.clickHandler = Laya.Handler.create(this,(e)=>{
            Laya.timer.resume()
            Laya.Scene.open('init.scene')
        })
    }
    
    onLoadComplete(){
        //播放bgm
        this.bgm = Laya.SoundManager.playSound("sound/THUNDER LANDING.mp3",1,Laya.Handler.create(this,()=>{
            console.log('播放完毕')
        }))
        
        
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