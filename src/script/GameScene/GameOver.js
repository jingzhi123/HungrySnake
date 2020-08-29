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
    
    onStart() {
        this.returnBtn.clickHandler = Laya.Handler.create(this,(e)=>{
            console.log('return')
            Laya.timer.resume()
            Laya.Scene.open('init.scene')
        })
        this.retryBtn.clickHandler = Laya.Handler.create(this,(e)=>{
            Laya.timer.resume()
            Laya.Scene.open('scene/GameScene.scene')
        })
    }

    onDisable() {
    }
}