export default class SceneScale extends Laya.Scene {

    constructor() { 
        super(); 
        
    }

    onAwake(){
        
    }
    
    onEnable() {
        this.width = Laya.stage.width;
        this.pos(0,0);
        console.log("当前为:["+this.name + "]场景");
        if(this.name =='init_scene'){
            this.loadImage('images/s1-background.jpg',Laya.Handler.create(this,()=>{
                console.log("图片加载完毕!");
            }))
        }
        if(this.name =='game_scene'){
            //this.zOrder = -10
            // this.loadImage('images/s1-background.jpg',Laya.Handler.create(this,()=>{
            //     console.log("图片加载完毕!");
            // }))
        }
    }

    onDisable() {
    }
}