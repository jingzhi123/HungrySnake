import GameSceneRuntime from "../runtime/GameSceneRuntime";

export default class GameOver extends Laya.Script {

    constructor() { 
        super(); 
        /** @prop {name:retryBtn, tips:"重试按钮", type:Node, default:null}*/
        let retryBtn;
        /** @prop {name:returnBtn, tips:"返回按钮", type:Node, default:null}*/
        let returnBtn;
    }
    onAwake(){
        console.log('gameover')
    }

    onUpdate(){
        GameSceneRuntime.instance.refreshScore()
    }
    
    onStart() {
        this.returnBtn.clickHandler = Laya.Handler.create(this,(e)=>{
            Laya.Scene.open('init.scene')
        })
        this.retryBtn.clickHandler = Laya.Handler.create(this,(e)=>{
            Laya.Scene.open('gameScene.scene')
        })
    }

    onDisable() {
    }
}