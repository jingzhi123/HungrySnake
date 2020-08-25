/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import BtnStartGame from "./script/GameMain/BtnStartGame"
import GameControl from "./script/GameMenu/GameControl"
import ScoreControl from "./script/GameMain/ScoreControl"
import GameMain from "./script/GameMain/GameMain"
import Snake from "./script/GameMain/Snake"
import Food from "./script/GameMain/Food"
import SnakeBody from "./script/GameMain/SnakeBody"

export default class GameConfig {
    static init() {
        //注册Script或者Runtime引用
        let reg = Laya.ClassUtils.regClass;
		reg("script/GameMain/BtnStartGame.js",BtnStartGame);
		reg("script/GameMenu/GameControl.js",GameControl);
		reg("script/GameMain/ScoreControl.js",ScoreControl);
		reg("script/GameMain/GameMain.js",GameMain);
		reg("script/GameMain/Snake.js",Snake);
		reg("script/GameMain/Food.js",Food);
		reg("script/GameMain/SnakeBody.js",SnakeBody);
    }
}
GameConfig.width = 960;
GameConfig.height = 540;
GameConfig.scaleMode ="fixedheight";
GameConfig.screenMode = "none";
GameConfig.alignV = "top";
GameConfig.alignH = "left";
GameConfig.startScene = "scene/gameMain.scene";
GameConfig.sceneRoot = "";
GameConfig.debug = false;
GameConfig.stat = false;
GameConfig.physicsDebug = true;
GameConfig.exportSceneToJson = true;

GameConfig.init();
