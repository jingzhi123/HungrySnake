import Snake from './Snake'
export default class GameControl extends Laya.Script {

    constructor() { 
        super(); 
        /** @prop {name:intType, tips:"整数类型示例", type:Int, default:1000}*/
        let intType = 1000;
        /** @prop {name:numType, tips:"数字类型示例", type:Number, default:1000}*/
        let numType = 1000;
        /** @prop {name:strType, tips:"字符串类型示例", type:String, default:"hello laya"}*/
        let strType = "hello laya";
        /** @prop {name:boolType, tips:"布尔类型示例", type:Bool, default:true}*/
        let boolType = true;
        // 更多参数说明请访问: https://ldc2.layabox.com/doc/?nav=zh-as-2-4-0
    }
    onAwake(){
        console.log(this.owner)
        let text = new Laya.Text();
        text.name = '游戏名称'
        text.text = "贪吃蛇"
        text.fontSize = 20;
        text.color = '#c00000';
        text.x = 0;
        text.y = 0;
        let startBtn = this.owner.getChildByName("startBtn")
        this.owner.addChild(text)
    }
    onEnable() {
        // let nameText = this.owner.getChildByName("游戏名称")
        // this.owner.removeChild(nameText)
    }

    onDisable() {
    }

    createBox() {
        //使用对象池创建盒子
        let box = Laya.Pool.getItemByCreateFun("dropBox", this.dropBox.create, this.dropBox);
        box.pos(Math.random() * (Laya.stage.width - 100), -100);
        this._gameBox.addChild(box);
    }

    onKeyUp(e) {
        //停止事件冒泡，提高性能，当然也可以不要
        e.stopPropagation();
        //舞台被点击后，使用对象池创建子弹
        // let snake = Laya.Pool.getItemByCreateFun("snake", this.snake.create, this.snake);
        var snake = Laya.Pool.getItemByClass('snanke',Snake)
        console.log(snake)
        //snake.pos(Laya.stage.mouseX, Laya.stage.mouseY);
        this._bg.addChild(snake);
    }
}