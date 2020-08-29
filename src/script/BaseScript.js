export default class BaseScript extends Laya.Script {
    //蛇头路径

    constructor() { 
        super(); 
        this.script;//脚本
    }
    onAwake(){
        this.owner.script = this;
        this.gameScene = this.owner.scene;
    }

    showLoading(){
		this.loading = new Laya.Text();

		this.loading.fontSize = 30;
		this.loading.color = "#FFFFFF";
		this.loading.align = 'center';
		this.loading.valign = 'middle';

        this.loading.width = Laya.stage.width
        this.loading.height =  Laya.stage.height;
		this.loading.text = "等待响应...\n";
		Laya.stage.addChild(this.loading);
    }

    removeLoading(){
        Laya.stage.removeChild(this.loading)
    }
    
    getEventDispatcher(){
        if(this.eventDispatcher==null){
            this.eventDispatcher = new Laya.EventDispatcher();
        }
        return this.eventDispatcher;
    }

    onDestroy() {
        console.log(this.owner.name + "被销毁");
    }
}