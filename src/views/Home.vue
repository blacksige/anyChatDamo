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
                      <th>你的ID：{{}}</th><th>房间号：{{}}</th>
                    </tr>
                  </thead>
                  <!-- 表格体 -->
                  <tbody> 
                    <tr>
                      <td>输入房间号：</td><td><input type="number" :maxlength="8"></td>
                    </tr>
                    <tr>
                      <td>进入房间</td><td>退出房间</td>
                    </tr>
                    <tr>
                      <td  colspan="2">获取好友列表</td>
                    </tr>
                    
                    <tr @click="callShow" class="min">
                      <td>好友1<span  v-bind:class="{ 'min-triangle-top ': !isCall,'min-triangle-bottom': isCall,}"></span></td><td>ID：{{}}</td>
                    </tr>

                    <tr v-if="isCall">  
                      <td>呼叫好友</td><td>取消呼叫</td>
                    </tr>
                    <tr >
                      <td>接受呼叫</td><td>拒绝呼叫</td>
                    </tr>
                    <tr>
                      <td>打开摄像头</td><td>打开麦克风</td>
                    </tr>
                    <tr>
                      <td>关闭摄像头</td><td>关闭麦克风</td>
                    </tr>
                    <tr>
                      <td >结束录制</td>
                      <td><span>位置：</span></td>
                    </tr>
                    <tr>
                      <td >获取版本号</td>
                      <td><span>版本号:</span></td>
                    </tr>
                  </tbody>
                </table>
            </div>
            <div class="main-right-box box">
              
            </div>
          </div>
          <div class="foot-content content">
            <div  class="foot-left-box box">

            </div>
            <div  class="foot-right-box box">
              
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
      isToken:false,

      isCall:false,
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

          // roomOpt: roomOpt,
          // videoCallOpt: videoCallOpt, 
      };
      
      this.instance = AnyChatWebSDK.sdkInit(initParams);
      
    },
    onLogin (data) {
        window.alert('登录成功');
        this.userid =  data.userId;
        this.isToken = true;
    },
    onDisConnect (result) {
        window.alert('连接断开：', result);
    },


    callShow(){
      if (this.isCall) {
        this.isCall = false
      } else {
        this.isCall = true
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
          }
          td{
            cursor: pointer;
            background-color: transparent;
            -moz-box-shadow: 0px 0px 3px yellowgreen; /* 老的 Firefox */
            box-shadow: 0px 0px 3px yellowgreen; 
            &:hover{
              background-color: rgb(179, 237, 245);
            } 
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