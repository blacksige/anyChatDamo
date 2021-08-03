<template>
  <div class="home">
    <template v-if="!isToken">
      <div class="bgcolor color-change-2x">
        <div class="triangle">
          <div class="login rotation">
            <img alt="Vue logo" src="../assets/logo.png" class="logo-img">
          </div>
        </div>
        <div style="position: relative; left: -190px; top: 80px;">
          <button @click="login" class="btn-style">登录</button>
        </div>
      </div>
    </template>
    

    <template v-else>
      <div class="bgimg">
        <div class="main">
          <div class="main-content content">
            <div class="main-left-box box">
                <table style="width:100%;height:100%;">
                  <!-- 表格头 -->
                  <thead>
                    <tr >
                      <th>你的ID：{{userid}}</th><th>房间号：{{trueRoomId}}</th>
                    </tr>
                  </thead>
                  <!-- 表格体 -->
                  <tbody> 
                    <tr>
                      <td>输入房间号：<input type="number" :maxlength="8" class="room-input" v-model="roomId"></td><td @click="EnterRoom">进入房间</td>
                    </tr>
                    <tr v-if="trueRoomId">
                      <td colspan="2" @click="OutRoom">退出房间</td>
                    </tr>
                    <tr v-if="trueRoomId">
                      <td colspan="2" @click="GetUserList" >获取好友列表</td>
                    </tr>
                    
                    <tr @click="startChat(item)" class="min" v-for="item in userList" :key="item.index">
                      <template v-if="item == userid">
                        <td>我</td><td >ID：{{item}}</td>
                      </template> 
                      <template v-if="item != userid">
                        <td>好友{{item.index}}
                          <!-- <span  v-bind:class="{ 'min-triangle-top ': !isCall,'min-triangle-bottom': isCall,}"></span> -->
                        </td>
                        <td>ID：{{item}}</td>
                      </template>
                    </tr>

                    <tr v-if="trueRoomId">
                      <td @click="OpenCamera">打开摄像头</td><td @click="OPenMicrophones">打开麦克风</td>
                    </tr>
                    <tr v-if="trueRoomId">
                      <td @click="CloseCamera">关闭摄像头</td><td @click="CloseMicrophones">关闭麦克风</td>
                    </tr>
                    <tr v-if="trueRoomId">
                      <td>录制己方视频</td><td>录制对方视频</td>
                    </tr>
                    <tr v-if="trueRoomId">
                      <td >结束录制</td>
                      <td><span>位置：</span></td>
                    </tr>
                    <tr>
                      <td @click="GetVersion">获取版本号</td>
                      <td><span>版本号:{{version}}</span></td>
                    </tr>
                  </tbody>
                </table>
            </div>
            <div class="main-right-box box" id="Camera">
              
            </div>
          </div>
          <div class="foot-content content">
            <div  class="foot-left-box box" id="Camera2"> 

            </div>
            <div  class="foot-right-box box">
              <div class="foot-right-box-head" v-show="content.isCall">
                  userId:{{content.uid}}
              </div>

              <div style="height: 60%;overflow-x:auto;">
                <table v-show="content.isCall" style="width:100%">
                  <tr v-for="item in content.textarea" :key="item.index">
                    <td style="height: 13px;font-size:13px;width:100%">{{item}}</td>
                  </tr>
                </table>
              </div>
              
              <div class="foot-right-box-foot" v-show="content.isCall">
                <table style="width:100%">
                  <tr>
                    <td>发送信息：</td>
                    <td><input type="text" class="input-style" v-model="chatText"></td>
                    <td><button class="btn-style" @click="SendMsg()">发送</button></td>
                  </tr>
                  <tr>
                    <td class="btn-style" @click="Call(content.uid)">视频呼叫</td>
                    <td v-show="content.isMVCall" class="btn-style" @click="Cancel(content.uid)">取消呼叫</td>
                    <td v-show="content.isMVCall" class="btn-style" @click="Hangup(content.uid)">挂断</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  data() { 
    return{
      mDefaultServerAddr : "demo.anychat.cn",
      mDefaultServerPort : 8906,

      instance:'',

      userid:'',
      version:'',
      roomId:'',
      trueRoomId:'',
      userList:[],

      content:{
        uid:'',
        textarea:[],
        isCall:false,
        isMVCall:false,
      },

      isToken:false,

      istextR:false,
      chatText:'',

      roomOpt: {
        // onRoomUserInAndOut: onAnyChatUserAtRoom,   //用户进出房间通知事件
        // onRoomUserChanged: onAnyChatRoomOnlineUser,   //房间用户数变化通知事件
        // onRoomUserMsgReceived: onAnyChatUserMsgAtRoom //接收房间内的文本消息通知事件
      },

      videoCallOpt:{
        
        // onReceiveVideoCallRequest: onReceiveVideoCallRequest, //接收视频呼叫请求通知
        // onReceiveVideoCallStart: onReceiveVideoCallStart, //接收视频呼叫开始通知
        // onReceiveVideoCallFinish: onReceiveVideoCallFinish, //接收视频呼叫结束通知
        // onReceiveVideoCallError: onReceiveVideoCallError //接收视频呼叫异常通知
      }
    }
  },
  mounted(){
    //定义房间配置对象roomOpt
        this.roomOpt = {        
            onRoomUserInAndOut: this.onAnyChatUserAtRoom,   //用户进出房间通知事件
            onRoomUserChanged: this.onAnyChatRoomOnlineUser,   //房间用户数变化通知事件
            onRoomUserMsgReceived: this.onAnyChatUserMsgAtRoom //接收房间内的文本消息通知事件
        }

        this.videoCallOpt = {
          //接收视频呼叫请求通知
          onReceiveVideoCallRequest: this.onReceiveVideoCallRequest,
          //接收视频呼叫开始通知
          onReceiveVideoCallStart: this.onReceiveVideoCallStart,
          //接收视频呼叫结束通知
          onReceiveVideoCallFinish: this.onReceiveVideoCallFinish,
          //接收视频呼叫异常通知
          onReceiveVideoCallError: this.onReceiveVideoCallError
        }
  },
  methods:{
    login() {
      const AnyChatWebSDK = window.AnyChatWebSDK
      var nickName = "demo";
      var servereIp = this.mDefaultServerAddr;
      var serverPort = this.mDefaultServerPort;

      // 初始化设置，包括插件初始化、连接、登录
      var initParams = {
          serverIp: servereIp, //服务器地址 （必填项）
          serverPort: serverPort, //端口号（必填项）
          nickName: nickName, //用户昵称（必填项）
              
          onDisConnect: this.onDisConnect,
          onLogin: this.onLogin,

          roomOpt: this.roomOpt,
          videoCallOpt: this.videoCallOpt, 
      };
      

      this.instance = AnyChatWebSDK.sdkInit(initParams);
      
    },

    //房间事件回调
    onAnyChatUserAtRoom(data) {
        console.log("用户动作通知："+data.userId,data.action==0?"进入房间":"退出房间",data.roomId);
        var text = data.action==0?"进入房间":"退出房间"
        this.content.textarea.push(data.userId+':'+text)
        this.GetUserList()
    },
    onAnyChatRoomOnlineUser(data) {
        console.log("用戶数变化："+data.userNum,data.roomId,data.userList);
        this.GetUserList()
    },
    onAnyChatUserMsgAtRoom(data) {
        console.log("信息通知："+data.userId,data.msg);
        this.istextR = false
        this.startChat(data.userId)
        this.content.textarea.push(data.userId+':'+data.msg)
    },
    
    //接收视频呼叫请求
    onReceiveVideoCallRequest(data) {
      console.log(data.userId,data.userStr);
      //data.userId 呼叫方用户Id
      //data.userStr 用户自定义参数
      if(confirm('用户'+data.userId+'正在呼叫你，是否接受？')==true){
        this.Accept(data.userId)
        this.startChat(data.userId)
      }else{
        this.Reject(data.userId)

      }
    },
    //接收视频呼叫开始通知
    onReceiveVideoCallStart(data) {
        console.log(data.userId,data.roomId,data.userStr);
        this.OPenMicrophones()
        this.OpenCamera()
        this.GetVideoStrea(data.userId)
        this.GetAudioStrea(data.userId)
        //data.userId 对方用户id
        //data.roomId 系统分配的房间号，呼叫双方进入到该房间，打开自己的摄像头,请求对方的视频流，开始视频通话，具体参见音视频通话接口
        //data.userStr 用户自定义参数
    },
    //接收视频呼叫异常通知
    onReceiveVideoCallError(result) {
        
        try {
            window.alert(result.msg);
        } catch (error) {
            window.alert("对方已断线");
        }
      
        //result.code 错误码 
        //result.msg 错误信息
    },
    //接收视频呼叫结束通知
    onReceiveVideoCallFinish(data) {
        try {
          window.alert(data.userId,data.userStr);
        } catch (error) {
          window.alert("对方已断线");
        }
      
        //data.userId 对方用户Id
        //data.userStr 用户自定义参数
    },


    // 登录事件回调
    onLogin (data) {
        window.alert('登录成功');
        this.userid =  data.userId;
        this.isToken = true;
    },
    onDisConnect (result) {
        window.alert('连接断开：', result);
    },


    
    //加入房间
    EnterRoom() {
        var id = this.roomId
        this.instance.enterRoom({
            roomId:id, 
            done: this.onAnyChatEnterRoom
        });
        
    },
    onAnyChatEnterRoom(result,data) {
          
        if (result.code === 0) {
            this.trueRoomId = data.roomId
            this.GetUserList()
        }
        window.alert(result.msg);
             
    },
    
    //退出房间
    OutRoom() {
        var code =  this.instance.leaveRoom();
        if (code == 0) {
            window.alert("退出房间成功");
            this.trueRoomId = '';
        }
    },
    //获取用户列表
    GetUserList() {
        this.userList = this.instance.getRoomUsers();
        console.log(this.userList);
    },

    // 视频呼叫事件
    Call(uid) {
      var that = this;
      that.content.isMVCall = true
        try {
            this.instance.requestVideoCall({
                userId:uid ,//被呼叫方用户ID
                done: onRequestVideoCallDone
            });
        } catch (error) {
            window.alert("用户已断线");
        }
        function onRequestVideoCallDone(result) {
          
          window.alert(result.msg)
          
        }
        
    },
    Accept(uid) {
        try {
            this.instance.acceptVideoCall({
                userId:uid,
            });
        } catch (error) {
            window.alert("对方已断线");
        }
      
    },
    Reject(uid) {
        try {
            this.instance.rejectVideoCall({
                userId:uid,
            }); 
        } catch (error) {
            window.alert("对方已断线");
        }
      
    },
    //挂断
    Hangup(uid) {
      this.CancelAudioStream(uid)
      this.CancelVideoStream(uid)
        try {
            this.instance.hangupVideoCall({
                userId:uid,
            }); 
        } catch (error) {
           window.alert("对方已断线");
        }
      
    },
    //取消呼叫
    Cancel(uid) {
        try {
            this.instance.cancelVideoCall({
                userId:uid,
            });
        } catch (error) {
            window.alert("对方已断线");
        }
        
    },

    //在房间发送信息
    SendMsg() {
        var that = this
        that.instance.sendMsg({ 
            msg:that.chatText, 
        });
        that.istextR = true
        that.content.textarea.push(that.userid+':'+that.chatText)
    },

    // 麦克风
    OPenMicrophones() {
        this.instance.getMicrophones()[0].open(); 
        console.log("开启麦克风");
    },
    CloseMicrophones() {
        this.instance.getMicrophones()[0].close();    
        console.log("关闭麦克风");
    },

    //摄像头
    OpenCamera() {
        this.instance.getCameras()[0].open({
            id: "Camera",
        });
        console.log("开启摄像头");
    },
    CloseCamera() {
        this.instance.getCameras()[0].close();
        console.log("关闭摄像头");
    },


    //音视频流操作
    GetAudioStrea(uid) {
        this.instance.getRemoteAudioStream({  
            remoteUserId:uid  
        });
    },
    GetVideoStrea(uid) {
        this.instance.getRemoteVideoStream({  
            remoteUserId:uid,
            renderId:'Camera2'  
        });
    },
    CancelAudioStream(uid) {
        this.instance.cancelRemoteAudioStream({  
            remoteUserId:uid  
        });
    },
    CancelVideoStream(uid) {
        this.instance.cancelRemoteVideoStream({  
            remoteUserId:uid  
        });
    },


    //登出
    LoginOut() {
        var errorCode = this.instance.logout();
        this.onDisConnect();
        if (errorCode == 0) {
            window.alert('登出成功');
        }
    },

    //获取sdk版本
    GetVersion() {
        this.version = this.instance.getVersionInfo(); 
    },


    //开始聊天
    startChat(id){
      if (id != this.userid) {
        console.log(id);
        this.content.uid = id;
        this.content.textarea= [];
        this.content.isCall = false;
        this.content.isMVCall =false;

        if (this.content.isCall) {
          this.content.isCall = false
        } else {
          this.content.isCall = true
        }
      }
      
    }
  }
}
</script>

<style lang="less" scoped>

.home{
  height: 100%;
    //登录页
  .bgcolor{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .triangle{
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 0 150px 259.8px 150px;
      border-color: transparent transparent #519BF2 transparent;
      .login{
        width: 300px;
        height: 300px;
        position: relative;
        left: -150px;
        top: -20px;
        .logo-img{
          border-radius: 50%;
          width: 15vh;
          height: 15vh;
          border: 10px double #41B883;
          margin: 10px;
        }
      }
    }
    .btn-style{
      background-color: #41B883;
    }
  }



  //主页
  .bgimg{
    width: 100%;
    height: 100%;
    background-image: url(../assets/bg-ane.jpg);
    background-size: 100% 100%;
    .main{
      width: 60%;
      height: 100%;
      margin: 0 auto;
      background-color: white;
      // opacity: 0.9;
      .content{
        display: flex;
        flex-direction: row;
        
        text-align: center;
        width: 100%;
        -moz-box-shadow: 0px 0px 5px #519BF2; /* 老的 Firefox */
        box-shadow: 0px 0px 5px #519BF2;
        .box{
            width: 50%;
            height: 100%;
            -moz-box-shadow: 0px 0px 5px #519BF2; /* 老的 Firefox */
            box-shadow: 0px 0px 5px #519BF2;  
        }
      }
      .main-content{
        height: 60%;
        .main-left-box {
          display: flex;
          justify-content: center;
            background-image: url(../assets/actBg.png);
            background-size: 100% 100%;
          th{
            background-color: transparent;
            -moz-box-shadow: 0px 0px 3px yellowgreen; /* 老的 Firefox */
            box-shadow: 0px 0px 3px yellowgreen; 
            padding: 8px;
            height: 20px;
          }
          td{
            width: 50%;
            cursor: pointer;
            background-color: transparent;
            -moz-box-shadow: 0px 0px 3px yellowgreen; /* 老的 Firefox */
            box-shadow: 0px 0px 3px yellowgreen; 
            &:hover{
              background-color: rgb(179, 237, 245);
            } 
          }
          .room-input{
            height: 20px;
            line-height: 20px;
            width:60px;
          }
          .min-triangle-top {
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 0 8px 13.9px 8px;
            border-color: transparent transparent #00adb5 transparent;
            position: relative;
            bottom: 16px;
          }
          .min-triangle-bottom{
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 13.9px 8px 0 8px;
            border-color: #00adb5 transparent transparent transparent;
            position: relative;
            bottom: -16px;
          }
          
        }
        .main-right-box{
            background-image: url(../assets/backgroundIcon.png);
            background-size: 100% 100%;
        }
      }
      .foot-content{
        height: 40%;
        .foot-left-box{
            background-image: url(../assets/backgroundIcon.png);
            background-size: 100% 100%;
        } 
        .foot-right-box{
            background-image: url(../assets/actBg.png);
             background-size: 100% 100%;
             .textAling1{
               text-align: left;
             }
             .textAling2{
               text-align: right;
             }
             .foot-right-box-head{
               padding: 10px;
               height: 6%;
               text-align: center;
             }
             .foot-right-box-foot{
               height: 25%;
               padding: 5px;
               text-align: center;
               .input-style{
                 height: 30px;
                 line-height: 30px;
               }
               background-color: rgb(179, 237, 245);
               
             }

        } 
        
      }
      
    }
  }

  
}
.color-change-2x {
	-webkit-animation: color-change-2x 4s linear infinite alternate both;
	animation: color-change-2x 4s linear infinite alternate both;
}
/* ----------------------------------------------
 * Generated by Animista on 2021-7-30 11:58:59
 * Licensed under FreeBSD License.
 * See http://animista.net/license for more info. 
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */

/**
 * ----------------------------------------
 * animation color-change-2x
 * ----------------------------------------
 */
@-webkit-keyframes color-change-2x {
  0% {
    background: #19dcea;
  }
  100% {
    background: #b22cff;
  }
}
@keyframes color-change-2x {
  0% {
    background: #19dcea;
  }
  100% {
    background: #b22cff;
  }
}



.rotation {
    -webkit-animation-name: rotation;
    -webkit-animation-duration: 5s;
    -moz-animation-name: rotation;
    -moz-animation-duration: 5s;
}
        
@-webkit-keyframes rotation {
    0% {
          transform:  translateY(40px);
        }
    100% {
          transform:  translateY(0px);
        }

}
        
@-moz-keyframes rotation {
    0% {
          transform:  translateY(40px);
        }
    100% {
          transform:  translateY(0px);
      }

}

</style>