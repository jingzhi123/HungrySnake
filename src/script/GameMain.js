import BaseScript from './BaseScript'
export default class GameMain extends BaseScript {

    constructor() { 
        super(); 
        /** @prop {name:returnBtn, tips:"返回按钮", type:Node, default:null}*/
        let returnBtn;
    }
    onAwake(){
        // this.progressBar.visible = true;
        // let load = Laya.loader.load('sound/THUNDER LANDING.mp3',Laya.Handler.create(this,(data)=>{
        //     console.log(data)
        // }),Laya.Handler.create(this,(num)=>{
        //     console.log(num)
        //     this.progressBar.value = num;
        //     if(num==1){
        //         this.onLoadComplete()
        //     }
        // }),Laya.Loader.SOUND)
    }
    
    onEnable() {
        
        this.returnBtn.clickHandler = Laya.Handler.create(this,(e)=>{
            BaseScript.bgm.stop();
            this.destroy()
            Laya.Scene.open('init.scene')
        })
    }

    onStart(){
    }

    onDisable() {
    }
}