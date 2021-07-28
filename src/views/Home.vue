<template>
  <div class="home">
    <div class="login">
      <img alt="Vue logo" src="../assets/logo.png" class="logo-img">
      <div>
        <button @click="login">登录</button>
      </div>
    </div>
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
        console.log('登录成功：userid='+ data.userId);
    },
    onDisConnect (result) {
        console.log('连接断开：', result);
    }
  }
}
</script>

<style lang="less" scoped>
.home{
  .login{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    .logo-img{
      border-radius: 50%;

      border: 10px solid #41B883;
    }
  }
}
</style>