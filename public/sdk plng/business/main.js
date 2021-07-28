
var mDefaultServerAddr = "demo.anychat.cn";
var mDefaultServerPort = 8906;

var instance;

    //登录按钮
function Login() {
    var nickName = "demo";
    var servereIp = mDefaultServerAddr;
    var serverPort = mDefaultServerPort;

    // 初始化设置，包括插件初始化、连接、登录
    var initParams = {
        serverIp: servereIp, //服务器地址 （必填项）
        serverPort: serverPort, //端口号（必填项）
        nickName: nickName, //用户昵称（必填项）
            
        onDisConnect: onDisConnect,
        onLogin: onLogin,

        roomOpt: roomOpt,
        videoCallOpt: videoCallOpt, 
    };
		
    instance = AnyChatWebSDK.sdkInit(initParams);
};
// 登录状态回调
function onLogin (data) {
    console.log('登录成功：userid='+ data.userId);
}
function onDisConnect (result) {
    console.log('连接断开：', result);
}
//登出
function LoginOut() {
    var errorCode = instance.logout();
    onDisConnect();
    if (errorCode == 0) {
        console.log("登出成功");
    }
}
//获取版本号
function GetVersion() {
    var data = instance.getVersionInfo();
    console.log("版本号："+data);
}

//定义房间配置对象roomOpt
var roomOpt={        
    onRoomUserInAndOut: onAnyChatUserAtRoom,   //用户进出房间通知事件
    onRoomUserChanged: onAnyChatRoomOnlineUser,   //房间用户数变化通知事件
    onRoomUserMsgReceived: onAnyChatUserMsgAtRoom //接收房间内的文本消息通知事件
};

function onAnyChatUserAtRoom(data) {
    console.log("用户动作通知："+data.userId,data.action==0?"进入房间":"退出房间",data.roomId);
}
function onAnyChatRoomOnlineUser(data) {
    console.log("用戶数变化："+data.userNum,data.roomId,data.userList);
}
function onAnyChatUserMsgAtRoom(data) {
    console.log("信息通知："+data.userId,data.msg);
}
//加入房间
function EnterRoom() {
    var id = document.getElementById("roomId").value
    instance.enterRoom({
        roomId:id, 
        done: onAnyChatEnterRoom
    });
}
function onAnyChatEnterRoom(result) {
    console.log(result.msg);
}
//退出房间
function OutRoom() {
    var code =  instance.leaveRoom();
    if (code == 0) {
        console.log("退出房间成功");
    }
}

//获取用户列表
function GetList() {
    var List = instance.getRoomUsers();
    console.log(List);
}

//在房间发送信息
function SendMsg() {
    var input = document.getElementById('txt');
    var params = input.value
    instance.sendMsg({ 
        msg:params, 
    });
    console.log("发送信息："+params);
}

// 麦克风

function OPenMicrophones() {
    instance.getMicrophones()[0].open(); 
    console.log("开启麦克风");
}
function CloseMicrophones() {
    instance.getMicrophones()[0].close();    
    console.log("关闭麦克风");
}

//摄像头

function OpenCamera() {
    instance.getCameras()[0].open({
        id: "Camera",
    });
    console.log("开启摄像头");
}
function CloseCamera() {
    instance.getCameras()[0].close();
    console.log("关闭摄像头");
}

//呼叫

var videoCallOpt = {
    //接收视频呼叫请求通知
    onReceiveVideoCallRequest: onReceiveVideoCallRequest,

    //接收视频呼叫开始通知
    onReceiveVideoCallStart: onReceiveVideoCallStart,

    //接收视频呼叫结束通知
    onReceiveVideoCallFinish: onReceiveVideoCallFinish,

    //接收视频呼叫异常通知
    onReceiveVideoCallError: onReceiveVideoCallError
};

//接收视频呼叫请求
function onReceiveVideoCallRequest(data) {
    console.log(data.userId,data.userStr);
    //data.userId 呼叫方用户Id
    //data.userStr 用户自定义参数
}

//接收视频呼叫开始通知
function onReceiveVideoCallStart(data) {
    console.log(data.userId,data.roomId,data.userStr);
    //data.userId 对方用户id
    //data.roomId 系统分配的房间号，呼叫双方进入到该房间，打开自己的摄像头,请求对方的视频流，开始视频通话，具体参见音视频通话接口
    //data.userStr 用户自定义参数
}

//接收视频呼叫异常通知
function onReceiveVideoCallError(result) {
    
    try {
        console.log(result.code,result.msg);
    } catch (error) {
        console.log("对方已断线");
    }
   
    //result.code 错误码 
    //result.msg 错误信息
}


//接收视频呼叫结束通知
function onReceiveVideoCallFinish(data) {
    try {
        console.log(data.userId,data.userStr); 
    } catch (error) {
        console.log("对方已断线");
    }
   
    //data.userId 对方用户Id
    //data.userStr 用户自定义参数
}

var uid;    
function getUser() {
    var userid = document.getElementById('uid')
    uid = parseInt(userid.value)
}
//呼叫目标用户
function Call() {
    getUser()
    try {
        instance.requestVideoCall({
            userId:uid ,//被呼叫方用户ID
            done: onRequestVideoCallDone
        });
    } catch (error) {
        console.log("用户已断线");
    }
    
}
function Accept() {
    getUser()
    try {
        instance.acceptVideoCall({
            userId:uid,
        });
    } catch (error) {
        console.log("用户已断线");
    }
   
}
function Reject() {
    getUser()
    try {
        instance.rejectVideoCall({
            userId:uid,
        }); 
    } catch (error) {
        console.log("用户已断线");
    }
   
}
function Hangup() {
    getUser()
    try {
        instance.hangupVideoCall({
            userId:uid,
        }); 
    } catch (error) {
        console.log("用户已断线");
    }
   
}
function Cancel() {
    getUser()
    try {
        instance.cancelVideoCall({
            userId:uid,
        });
    } catch (error) {
        console.log("用户已断线");
    }
    
}

function onRequestVideoCallDone(result) {
    console.log(result.msg);
}

//音视频流操作
function GetAudioStrea() {
    getUser()
    instance.getRemoteAudioStream({  
        remoteUserId:uid  
    });
}
function GetVideoStrea() {
    getUser()
    instance.getRemoteVideoStream({  
        remoteUserId:uid,
        renderId:'Camera2'  
    });
}
function CancelAudioStream() {
    getUser()
    instance.cancelRemoteAudioStream({  
        remoteUserId:uid  
    });
}
function CancelVideoStream() {
    getUser()
    instance.cancelRemoteVideoStream({  
        remoteUserId:uid  
    });
}
var flag;
var recordID;
function startRecord() {
    recordID = -1
    RecordSDK()
}

function endtRecord() {
    instance.stopRecord();
    flag = 0;
    showAction();
}

function startOtherRecord() {
    recordID = uid;
    RecordSDK()
}

function RecordSDK(){
    var recordLayoutOpt = {};
    recordLayoutOpt.recordlayout = 2;
    recordLayoutOpt.layoutstyle= 0;
   //录制画面各个区域对应的视频流 layoutStreams 的用法
   console.log(recordID);
    recordLayoutOpt.streamlist= [
            {
              userid: recordID, //自己ID
              streamindex: 0, //用户的视频流编号，用户可能存在多个摄像头
              recordindex: 1 //录制画面编号,  由数字从小到大向右排序，
                            //若是录制画面是大小屏的，0是大屏，1是小屏
            },
            {
              userid: uid, //呼叫用户ID
              streamindex: 0, //用户的视频流编号，用户可能存在多个摄像头
              recordindex: 0 //录制画面编号， 由数字从小到大向右排序，
                            //若是录制画面是大小屏的，0是大屏，1是小屏
            },
          ];
     var recordOpt = {
         userId: -1, //录制的用户ID,-1为自己
         width: 640, //录制画面宽度
         height: 480, //录制画面高度
         done:onRecordDone,
         mode: 1, //录制模式
         content: 1, //录制内容
         fileType: 1, //录制文件类型
         clipMode: 2, //视频裁剪模式
         fileName: '2018-08-06_15-25-06', //录制文件名
         localFilePath: 'd:\\anychat\\video', //本地录制文件存放目录
         category: 'video', //录像文件上传至服务器上的分类子目录
         statusnotify: 15, //获取录像心跳的时间间隔
         recordLayoutOpt:recordLayoutOpt,//录制画面布局配置
       };
  //调用录制
         instance.startRecord(recordOpt);
         flag = 1;
         showAction()
}

function showAction(){
    if (flag == 0) {
        document.getElementById("recordStauts").style.display = 'none'
    } else {
        document.getElementById("recordStauts").style.display = 'inline-block'
    }
}

function onRecordDone(result,data) {
    console.log(result);
    console.log(data);
    if (result.code==0) {
        alert("录制成功！视频位置为："+ data.filePath)
    }else{
        alert(result.msg)
    }
}