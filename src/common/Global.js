const BGM_PATH='sound/bgm.mp3',SNAKE_PREFAB_PATH='res/sprite_snake1.prefab',SNAKEBODY_PREFAB_PATH='res/sprite_snakebody1.prefab',FOOD_PREFAB_PATH='res/sprite_food1.prefab'
let resourceMap = {}
export default class Global{
    /**
     * 背景音乐资源路径
     */
    static get BGM_PATH(){
        return BGM_PATH
    }
    /**
     * 蛇预制体资源路径
     */
    static get SNAKE_PREFAB_PATH() {
        return SNAKE_PREFAB_PATH
    }
    /**
     * 蛇身预制体资源路径
     */
    static get SNAKEBODY_PREFAB_PATH() {
        return SNAKEBODY_PREFAB_PATH
    }
    /**
     * 食物身预制体资源路径
     */
    static get FOOD_PREFAB_PATH() {
        return FOOD_PREFAB_PATH
    }
    static get LOAD_RESOURCES() {
        return [{url:BGM_PATH,type:Laya.Loader.SOUND},{url:SNAKE_PREFAB_PATH,type:Laya.Loader.PREFAB},{url:SNAKEBODY_PREFAB_PATH,type:Laya.Loader.PREFAB},{url:FOOD_PREFAB_PATH,type:Laya.Loader.PREFAB}]
    }
    /**
     * 资源映射关系
     */
    static get resourceMap(){
        return resourceMap
    }

    constructor(){
        console.log('global');
    }

    /**
     * 资源加载完成回调
     * @param {是否完成} data 
     */
    static onResourcesLoaded(data){
        console.log(data);
        if(data){
            Global.LOAD_RESOURCES.map(r=>{
                let d = Laya.loader.getRes(r.url)
                resourceMap[r.url] = d;
            })
        }
        
    }
}