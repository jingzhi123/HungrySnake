import HttpUtils from "./HttpUtils";

export default class Player{

    
    constructor(initUrl){
        /**
         * 初始化地址
         */
        this.initUrl = initUrl;
        /**
         * 用户信息
         */
        this.userInfo;
        /**
         * 玩家游戏昵称
         */
        this.playerName = '';

        /**
         * 玩家等级
         */
        this.level;

        /**
         * 头像地址
         */
        this.avatarUrl;

        /**
         * 玩家拥有道具
         */
        this.items = []

        /**
         * 初始金币
         */
        this.goldNum = 0;

        /**
         * 游戏记录
         */
        this.recordList = []

        /**
         * 好友列表
         */
        this.friendList = []

        /**
         * 玩家游戏角色
         */
        this.character;

        this.http = new HttpUtils()
        Player.instance = this;

        this.init()
    }

    init(){
        let _this = this;
        this.http.get(this.initUrl,(data)=>{
            console.log(data);
            data = JSON.parse(data)
            _this.playerName = data.nickName;
        })
    }
}