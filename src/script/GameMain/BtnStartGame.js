import BaseScript from '../BaseScript'
export default class BtnStartGame extends BaseScript {

    constructor() { 
        super(); 
        /** @prop {name:progressBar, tips:"进度条", type:Node, default:null}*/
        let progressBar;
        /** @prop {name:btn, tips:"布尔类型示例", type:Node, default:null}*/
        let btn;
        // 更多参数说明请访问: https://ldc2.layabox.com/doc/?nav=zh-as-2-4-0
    }
    
    onEnable() {
        BaseScript.progressBar = this.progressBar;
        console.log('进度:'+this.progressBar.value)
        
        //btn.clickHandler = Laya.Handler.create(this,this.onStartBtnClick,null,false)
    }

    onUpdate(e){
    }

    onClick(e){
        console.log('游戏开始:',this.owner)
        e.stopPropagation();
        this.onStartBtnClick()
    }

    onStartBtnClick(){
        
        console.log('游戏开始:',this.owner)
        this.progressBar.visible = true;
        let load = Laya.loader.load('sound/THUNDER LANDING.mp3',Laya.Handler.create(this,(data)=>{
            console.log(data)
        }),Laya.Handler.create(this,(num)=>{
            console.log(num)
            this.progressBar.value = num;
            if(num==1){
                setTimeout(() => {
                    //加载场景
                    Laya.Scene.open('scene/gameMain.scene')

                }, 500);
            }
        }),Laya.Loader.SOUND)

    }

    onDisable() {
    }
}