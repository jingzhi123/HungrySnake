export default class GameUtils {

    //计算两点之间距离
    static distance(x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
    }

    /**
     * 随机正负符号(1或-1)
     */
    static randomSimbol(){
        let simbol = Math.random()>0.5?1:-1;
        return simbol;
    }
}