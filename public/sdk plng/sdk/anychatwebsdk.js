/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	var log4js = __webpack_require__(1);
	var AnyChatSDKConstant = __webpack_require__(2);
	var AnyChatSDKEventTarget = __webpack_require__(3);
	var AnyChatSDKUserHandler = __webpack_require__(4);
	var AnyChatSDKQueueHandler = __webpack_require__(7);
	var AnyChatSDKEventDispatcher = __webpack_require__(8);
	var AnyChatSDKAudioHandler = __webpack_require__(13);
	var AnyChatSDKVideoHandler = __webpack_require__(14);
	var AnyChatSDKDualRecordHandler = __webpack_require__(15);
	var AnyChatSDKRecordHandler = __webpack_require__(16);
	var AnyChatSDKFileHandler = __webpack_require__(9);
	var AnyChatSDKVideoCallHandler = __webpack_require__(10);
	var AnyChatSDKAreaHandler = __webpack_require__(6);
	var AnyChatSDKErrorCode = __webpack_require__(5);
	var AnyChatSDKSettingHandler = __webpack_require__(17);
	var AnyChatSDKFriendHandler = __webpack_require__(11);
	var AnyChatSDKStreamPlayHandler = __webpack_require__(12);
	var AnyChatSDKAI =__webpack_require__(18);
	var AnyChatSDKAIManagement =__webpack_require__(19);
	var AnyChatSDKRecordTag = __webpack_require__(20)
	var logger = log4js.getLogger("main");



	var info = {}; // ????????????

	var getIntUserId = AnyChatSDKUserHandler.getIntUserId;
	var getStrUserId = AnyChatSDKUserHandler.getStrUserId;

	/*--------------------------------------------------------
	 * AnyChatSDKInstance
	 * AnyChat SDK?????????????????????
	 * 
	 * -------------------------------------------------------
	 */
	function AnyChatSDKInstance() {
	    this.anychat = null; // AnyChat??????DOM??????
	    this.eventTarget = AnyChatSDKEventTarget.instance;
	    this.isInitDone = false;
	    this.curConnectStatus = AnyChatSDKConstant.instance.ConnectStatus.INIT;
	    this.disconnectResultCode = 0;
	    this.eventDispatcher = AnyChatSDKEventDispatcher.instance;
	    this.constant = AnyChatSDKConstant.instance;
	    this.strUserId = info.strUserId;

	    this.bSupportStreamRecordCtrlEx = false; // ????????????????????????API??????
	    this.bSupportObjectBusiness = false; // ????????????????????????API??????
	    this.bSupportMultiStream = false; // ???????????????????????????????????????API??????
	    this.bSupportScriptObject = false; // ????????????JavaScript??????
	    this.bSupportCluster = false; // ????????????????????????

	    this.isCluster = 0; //???????????????????????????????????????
	   //???????????????????????????
	    this.AnyChatAIManagement=null;
	    //??????????????????
	    this.AnyChatAITaskIdTime = new Array();
	    //?????????????????????
	    this.AnyChatSDKRecordTag = null;

	}

	//?????????AnyChat SDK DOM??????
	AnyChatSDKInstance.prototype.init = function(apilevel) {

	    var errorcode = BRAC_InitSDK("0");
	    logger.invokeLog("init", errorcode);
		var that = this;
		setTimeout(function(){
			if (errorcode === 0) {
			    that.eventDispatcher.callbackinit(that, anychat);
			    that.isInitDone = true;
			    if (info.logSavepath) {
			        var logObj = {};
			        logObj.logSavepath = info.logSavepath;
			        logObj.logFileRule = info.logFileRule;
			        setLogSavePath(logObj);
			    }
			    that.curConnectStatus = that.constant.ConnectStatus.INITIALIZED;
			    that.anychat = anychat;
			    if(info.hasOwnProperty("appId") && info.appId != "") {
			        BRAC_SetSDKOption(BRAC_SO_CLOUD_APPGUID, info.appId);
	            }
	            var connectCode;
	            // ??????IP
			    if (info.serverIp.indexOf(",") > 0 && info.serverPort.indexOf(",") > 0) {
	                var ipArry = info.serverIp.split(",");
	                var portArry = info.serverPort.split(",");
	                if(ipArry.length!=portArry.length){
	                    connectCode =  115 ;
	                    logger.invokeLog("connect",connectCode,{serverIp:info.serverIp,serverPort:info.serverPort})
	                    that.eventTarget.fireEvent({
	                        type: "onDisConnect",
	                        result: {
	                            code: connectCode,
	                            msg: AnyChatSDKErrorCode.checkErrorMsg(connectCode)
	                        }
	                    });
	                    return;
	                }
	                var serverIps = "";
	                for (var i = 0; i < ipArry.length; i++) {
	                    serverIps = serverIps + ipArry[i] + ":" + portArry[i];
	                    if (i != ipArry.length - 1) {
	                        serverIps = serverIps + ","
	                    }
	                }
	                connectCode = BRAC_Connect(serverIps, 1);
	            } else {
	                connectCode = BRAC_Connect(info.serverIp, info.serverPort);
	            }
			    // H5??????????????????????????????????????????Login?????????Connect????????????
			    if (connectCode == 0) {
			        that.login();   
			    }
			    
			    if (bSupportScriptObject)
			        that.eventDispatcher.h5On(that, anychat);
			    if (info.openNativeScreenCamera == 1) {
			        //???????????????????????????
			        BRAC_SetSDKOption(BRAC_SO_CORESDK_SCREENCAMERACTRL, 1);
			    }
			} else {
			    that.eventTarget.fireEvent({
			        type: "onDisConnect",
			        result: {
			            code: errorcode,
			            msg: AnyChatSDKErrorCode.checkErrorMsg(errorcode)
			        }
			    });
			}
		},10)
	};

	//????????????
	AnyChatSDKInstance.prototype.disConnect = function() {
	    //logger.debug("AnyChatSDKInstance disconnect...");

	    var errorCode = BRAC_Logout();
	    if (errorCode == 0) {
	        errorCode = 101;
	        var errorMsg = AnyChatSDKErrorCode.checkErrorMsg(errorCode);
	    }
	    var result = {
	        errorCode: errorCode,
	        msg: errorMsg
	    };
	    instance.eventTarget.fireEvent({
	        type: "onDisConnect",
	        result: result
	    });
	    logger.invokeLog("disConnect", errorCode);
	};


	//????????????
	AnyChatSDKInstance.prototype.SDKLog = function(data) {
	    BRAC_SetSDKOption(BRAC_SO_CORESDK_WRITELOG, data);
	}

	//????????????
	AnyChatSDKInstance.prototype.login = function() {
	    var userLoginObj = {
	        nickName: info.nickName,
	        userId: info.userId,
	        strUserId: info.strUserId,
	        password: info.password,
	        appId: info.appId,
	        timeStamp: info.timeStamp,
	        signData: info.sign,
	        selfService: info.selfService
	    };
	    var errorCode = AnyChatSDKUserHandler.instance.login(userLoginObj);
	    var userLoginObj2 = JSON.parse(JSON.stringify(userLoginObj));
	    delete userLoginObj2.password;
	    logger.invokeLog("login", errorCode, userLoginObj2);
	    return errorCode;
	};

	//????????????
	AnyChatSDKInstance.prototype.logout = function() {
	    var errorCode = AnyChatSDKUserHandler.instance.logout(this);
	    // if (errorCode == 0) {
	    info = {};
	    AnyChatSDKAreaHandler.instance.areaIdArray = [];
	    AnyChatSDKAreaHandler.instance.areaIdIndex = 0;
	    AnyChatSDKUserHandler.instance.userType = -1;
	    if(!bSupportScriptObject/*  && getBrowser()!="IE" */){
	        // BRAC_Release();
			var _anychatSDKDiv = BRAC_GetDmoObject("AnyChatSDKPluginDiv");
			if (_anychatSDKDiv) {
				if (getBrowserInfo() == "IE") {
					var eles = document.getElementsByTagName('script');
					for(var i = 0; i < eles.length ; i++){
						var ele = eles[i];
						if(ele.getAttribute('for') == 'AnyChatSDKPlugin'){
							ele.parentNode.removeChild(ele); 
							i--;
						}
					}
					_anychatSDKDiv.parentNode.removeChild(_anychatSDKDiv);
	                _anychatSDKDiv = null;
	                anychat = null;
					AnyChatWebSDK.anychatSDKInstance.anychat = null;
					var objectPlugins = document.getElementsByTagName("object");
					while (objectPlugins.length > 0 &&
						objectPlugins[0].classid == "clsid:B685A393-905F-45B5-B26E-FF199EEE2FD7") {
						objectPlugins[0].parentNode.removeChild(objectPlugins[0]);
					}
					setTimeout(CollectGarbage, 1);
					return;
				}
				document.body.removeChild(_anychatSDKDiv);
			}
		}
	    AnyChatSDKEventTarget.instance.removeAll();
	    AnyChatWebSDK.anychatSDKInstance = null;
	    if (getBrowser() == "IE") {
	        AnyChatWebSDK.anychatSDKInstance.anychat = null;
	        setTimeout(CollectGarbage(),1) ;
	    }
	    logger.invokeLog("logout", errorCode);
	    return errorCode;
	};

	//??????????????????
	AnyChatSDKInstance.prototype.enterRoom = function(roomObj) {
	    //logger.debug("AnyChatSDKInstance enterRoom...");
	    if (!roomObj.roomId) return false;
	    info.roomId = roomObj.roomId;
	    (typeof(roomObj.done) === "function") && this.setCallBack("OnAnyChatEnterRoom", roomObj.done, true);
	    var errorCode = AnyChatSDKUserHandler.instance.enterRoom(roomObj);
	    logger.invokeLog("enterRoom", errorCode, { roomId: roomObj.roomId });
	};

	//??????????????????????????????
	AnyChatSDKInstance.prototype.getRoomUsers = function() {
	    //logger.debug("AnyChatSDKInstance getRoomUsers...");
	    logger.invokeLog("getRoomUsers");
	    var list = AnyChatSDKUserHandler.instance.getRoomUsers();
	    // list.userList = list.userList.map(getStrUserId);
	    return list;
	};

	//??????????????????
	AnyChatSDKInstance.prototype.leaveRoom = function() {
	    //logger.debug("AnyChatSDKInstance leaveRoom...");
	    // (typeof(roomObj.done) === "function") && this.setCallBack("onAnyChatLeaveRoom", roomObj.done, true);
	    var errorCode = AnyChatSDKUserHandler.instance.leaveRoom(this);
	    logger.invokeLog("leaveRoom", errorCode);
	    return errorCode;
	};

	//??????????????????
	AnyChatSDKInstance.prototype.sendMsg = function(opt) {
	    //logger.debug("AnyChatSDKInstance sendMsg...");
	    if (opt.targetUsers)
	        opt.targetUsers = opt.targetUsers.map(getIntUserId);
	    var errorCode = AnyChatSDKUserHandler.instance.sendMsg(opt);
	    logger.invokeLog("sendMsg", errorCode, opt);
	};

	//????????????????????????
	AnyChatSDKInstance.prototype.transBuffer = function(opt) {
	    //logger.debug("AnyChatSDKInstance TransBuffer...");
	    if (opt.targetUsers) {
	        opt.targetUsers = opt.targetUsers.map(getIntUserId);
	        for (var i = 0; i < opt.targetUsers.length; i++) {
	            (typeof(opt.done) === "function") && this.setCallBack("onTransBufferDone" +  opt.targetUsers[i], opt.done, true);
	        }
	    }
	    // (typeof(opt.done) === "function") && this.setCallBack("onTransBufferDone", opt.done, true);
	    var taskId = AnyChatSDKUserHandler.instance.transBuffer(opt);
	    var errorCode = taskId > 0 ? 0 : -1;
	    var params = JSON.parse(JSON.stringify(opt));
	    (typeof(params.done) === "function") && delete params.done;
	    logger.invokeLog("TransBuffer", errorCode, params);
	};

	//????????????????????????(??????)
	AnyChatSDKInstance.prototype.transBufferEx = function(opt) {
	    //logger.debug("AnyChatSDKInstance TransBuffer...");
	    if (opt.targetUsers) {
	        opt.targetUsers = opt.targetUsers.map(getIntUserId);
	        for (var i = 0; i < opt.targetUsers.length; i++) {
	            (typeof(opt.done) === "function") && this.setCallBack("onTransBufferDone" +  opt.targetUsers[i], opt.done, true);
	        }
	    }
	    // (typeof(opt.done) === "function") && this.setCallBack("onTransBufferDone", opt.done, true);
	    var taskId = AnyChatSDKUserHandler.instance.transBufferEx(opt);
	    var errorCode = taskId > 0 ? 0 : -1;
	    var params = JSON.parse(JSON.stringify(opt));
	    (typeof(params.done) === "function") && delete params.done;
	    logger.invokeLog("TransBuffer", errorCode, params);
	};

	//?????????????????????????????????
	AnyChatSDKInstance.prototype.getMicrophones = function() {
	    //logger.debug("getMicrophoneList...");
	    logger.invokeLog("getMicrophoneList");
	    var microDevices = []; 
	    microDevices = BRAC_EnumDevices(BRAC_DEVICE_AUDIOCAPTURE);
	    if(bSupportScriptObject && microDevices.length == 0) {
	        microDevices.push("1-Virtual Microphone");
	    }
	    var mDeviceObj = [];
	    for (var i = 0; i < microDevices.length; i++) {
	        mDeviceObj.push(new AnyChatSDKAudioHandler.instance(microDevices[i]));
	    }
	    return mDeviceObj;
	};

	//?????????????????????????????????
	AnyChatSDKInstance.prototype.getSpeaks = function() {
	    logger.invokeLog("getSpeakList");
	    var microDevices = BRAC_EnumDevices(BRAC_DEVICE_AUDIOPLAYBACK);
	    var mDeviceObj = [];
	    for (var i = 0; i < microDevices.length; i++) {
	        mDeviceObj.push(new AnyChatSDKAudioHandler.instance(microDevices[i]));
	    }
	    return mDeviceObj;
	};

	//???????????????????????????
	AnyChatSDKInstance.prototype.getCameras = function() {
	    //logger.debug("getCameraList...");
	    logger.invokeLog("getCameraList");
	    var mDevices = [];
	    mDevices = BRAC_EnumDevices(BRAC_DEVICE_VIDEOCAPTURE);
	    if(bSupportScriptObject && mDevices.length == 0){
	        mDevices.push("1-Virtual Camera");
	    }
	    var mDeviceObj = [];
	    for (var i = 0; i < mDevices.length; i++) {
	        var deviceIndex = "";
	        if (bSupportScriptObject)
	            deviceIndex = (parseInt(i+1)) + "-";
	        mDeviceObj.push(new AnyChatSDKVideoHandler.instance(deviceIndex + mDevices[i]));
	    }
	    return mDeviceObj;
	};

	//?????????????????????
	AnyChatSDKInstance.prototype.getRemoteAudioStream = function(opt) {
	    //logger.debug("getRemoteAudioStream,id:" + opt.remoteUserId);
	    var errorCode = AnyChatSDKAudioHandler.openAudio(getIntUserId(opt.remoteUserId));
	    logger.invokeLog("getRemoteAudioStream", errorCode, opt);
	    return errorCode;
	};

	//?????????????????????
	AnyChatSDKInstance.prototype.cancelRemoteAudioStream = function(opt) {
	    var errorCode = AnyChatSDKAudioHandler.closeAudio(getIntUserId(opt.remoteUserId));
	    logger.invokeLog("cancelRemoteAudioStream", errorCode, opt);
	    return errorCode;
	};

	//?????????????????????
	AnyChatSDKInstance.prototype.getRemoteVideoStream = function(opt) {
	    var params = {
	        userId: getIntUserId(opt.remoteUserId),
	        deviceName: "",
	        demoId: opt.renderId
	    };
	    if (opt.hasOwnProperty("streamIndex")) {
	        params.streamIndex = opt.streamIndex;
	    }
	    var errorCode = AnyChatSDKVideoHandler.openVideo(params);
	    logger.invokeLog("getRemoteVideoStream", errorCode, opt);
	    return errorCode;
	};

	//?????????????????????
	AnyChatSDKInstance.prototype.cancelRemoteVideoStream = function(opt) {
	    var params = {
	        userId: getIntUserId(opt.remoteUserId)
	    };
	    if (opt.hasOwnProperty("streamIndex")) {
	        params.streamIndex = opt.streamIndex;
	    }
	    var errorCode = AnyChatSDKVideoHandler.closeVideo(params);
	    logger.invokeLog("cancelRemoteVideoStream", errorCode, opt);
	    return errorCode;
	};

	//????????????
	AnyChatSDKInstance.prototype.startRecord = function(opt) {
	    (typeof(opt.done) === "function") && this.setCallBack("onRecordDone", opt.done, true);
	    (typeof(opt.OnRecordStatus) === "function") && this.setCallBack("OnRecordStatusDone", opt.OnRecordStatus, false);
	    var errorCode = AnyChatSDKRecordHandler.instance.start(opt);
	    var params = JSON.parse(JSON.stringify(opt));
	    (typeof(params.done) === "function") && delete params.done;
	    logger.invokeLog("startRecord", errorCode, params);
	    if(opt.tagFlag){//????????????????????????
	        try {
	            var strJson = JSON.parse(opt.strJson);
	            var tagOpt = {
	                tagFileName : opt.fileName,
	                tradeNo : strJson.tradeNo,
	            };
	            this.AnyChatSDKRecordTag=this.startRecordTag(tagOpt)
	            this.AnyChatSDKRecordTag.tagFlag = true;
	        } catch (e) {
	            logger.invokeLog("startRecordTag", e, opt);
	            this.AnyChatSDKRecordTag = null;
	        }
	    }
	};

	//??????????????????
	AnyChatSDKInstance.prototype.updateRecordParam = function(opt) {
	    logger.invokeLog("updateRecordParam");
	    return AnyChatSDKRecordHandler.instance.updateRecordParam(opt);
	};

	//????????????
	AnyChatSDKInstance.prototype.stopRecord = function() {
	    var errorCode = AnyChatSDKRecordHandler.instance.stop();
	    if(this.AnyChatSDKRecordTag){
	        this.AnyChatSDKRecordTag.completeRecordTag();
	    }
	    logger.invokeLog("stopRecord", errorCode);
	};

	//????????????
	AnyChatSDKInstance.prototype.cancelRecord = function () {
	    var errorCode = AnyChatSDKRecordHandler.instance.cancel();
	    logger.invokeLog("cancelRecord", errorCode);
	};
	//????????????????????????
	AnyChatSDKInstance.prototype.recordTag=function(opt){
	    var errorCode = AnyChatSDKRecordHandler.instance.recordtag(opt);
	    logger.invokeLog("recordTag", errorCode);
	}

	/*
	 * ?????????????????????
	 *
	 * flag ????????????????????????
	 * tagFlag ??????????????????flag
	 * opt.taskId ???????????????ID
	 * opt.userid ??????id
	 * opt.recordindex ????????????
	 * opt.luxstartTime ?????????????????? 
	 * opt.newTime ???????????????,??????????????????????????????????????? timestamp
	 * opt.timestamp  ??????????????????
	 * opt.elapse  ????????????????????????????????????
	 * opt.index ????????????
	 * opt.flags ???????????? 101???????????????;102???????????????;0:??????; 256(?????????) 4352(?????????+??????)
	 * opt.type ???????????? 1????????? 2????????? 0:??????
	 * opt.title ????????????
	 * opt.content ????????????
	 * opt.tradeNo ?????????
	 * opt.tagFileName ???????????????
	 * opt.usertag ????????????{taskId ????????????????????????????????????,stateFlag:1,??????????????????}
	 * opt.checkStatus  ???????????????????????? 0????????? 1?????????
	 * opt.checkQuestion ???????????????????????????
	 * opt.expectAnswer  ???????????????????????????
	 * 
	*/ 
	AnyChatSDKInstance.prototype.recordTags = function (opt, flag, tagFlag) {
	    if (this.AnyChatAITaskIdTime.length == 0) {
	        var newtime = new Date().getTime();
	        opt.elapse = 0;
	        opt.newTime = newtime;
	        opt.timestamp = newtime - opt.luxstartTime;
	        opt.index = this.AnyChatAITaskIdTime.length,
	        this.AnyChatAITaskIdTime[0] = opt;
	    }
	    else {
	        var newtime = new Date().getTime();
	        var obj = this.AnyChatAITaskIdTime[this.AnyChatAITaskIdTime.length - 1];
	        obj.elapse = newtime - obj.newTime;// ????????????elapse??????  ????????????-????????????????????????
	        opt.timestamp = newtime - opt.luxstartTime;
	        opt.newTime = newtime;
	        opt.index = this.AnyChatAITaskIdTime.length;
	        this.AnyChatAITaskIdTime[this.AnyChatAITaskIdTime.length] = opt;
	    }
	    if (flag) {//??????????????????
	        var tagOpt = JSON.parse(JSON.stringify(opt));
	        tagOpt.flags = tagFlag;
	        var errorCode = AnyChatSDKRecordHandler.instance.recordtag(tagOpt);
	        logger.invokeLog("recordTag", errorCode);
	    }
	}
	//??????????????????
	AnyChatSDKInstance.prototype.DelAnyChatAITaskIdTime = function () {
	    var newtime = new Date().getTime();
	    var obj = this.AnyChatAITaskIdTime[this.AnyChatAITaskIdTime.length - 1];
	    if (obj) {
	        obj.elapse = newtime - obj.newTime;//????????????elapse??????   ????????????-????????????????????????
	    }
	}

	//????????????
	AnyChatSDKInstance.prototype.businessChannel = function (option) {
	    var requestId = BRAC_NewGuid();
	    (typeof (option.event) === "function") && AnyChatWebSDK.anychatSDKInstance.setCallBack("businessChannel" + requestId, option.event, true);//????????????
	    var flag = option.flags;
	    var instr = {
	        "flags": flag,
	        "timeout": option.timeout || 5000,//??????????????????5000
	        "strparam": option.strparam //??????????????????????????????
	    };
	    option.strparam["requestId"] = requestId;
	    var errorCode = BRAC_SDKControl(ANYCHAT_SDKCTRL_BUSINESSBUFFER, JSON.stringify(instr));
	    logger.invokeLog("businessChannel", errorCode);
	    return errorCode;
	}

	//????????????????????????
	AnyChatSDKInstance.prototype.insertFileDuringRecord = function(opt) {
	    var errorCode = AnyChatSDKRecordHandler.instance.insertFile(opt);
	    logger.invokeLog("insertFileDuringRecord", errorCode);
	};

	//??????
	AnyChatSDKInstance.prototype.takeSnapShot = function(opt) {
	    (typeof(opt.done) === "function") && this.setCallBack("onSnapshotDone", opt.done, true);
	    var errorCode = AnyChatSDKRecordHandler.instance.snapshot(opt);
	    var params = JSON.parse(JSON.stringify(opt));
	    (typeof(params.done) === "function") && delete params.done;
	    logger.invokeLog("takeSnapShot", errorCode, params);
	    return errorCode;
	};

	//??????????????????
	AnyChatSDKInstance.prototype.createFileUploadTask = function(opt) {
	    logger.invokeLog("createFileUploadTask");
	    opt.action = "upload";
	    var taskObj = new AnyChatSDKFileHandler.instance(opt);
	    (typeof(opt.done) === "function") && this.setCallBack(taskObj.guid, opt.done, true);
	    (typeof(opt.onTaskStatusChanged) === "function") && this.setCallBack("onTaskStatusChanged", opt.onTaskStatusChanged, false);
	    return taskObj;
	};

	//??????????????????
	AnyChatSDKInstance.prototype.createFileTransferTask = function(opt) {
	    logger.invokeLog("createFileTransferTask");
	    opt.action = "upload";
	    opt.userId = getIntUserId(opt.userId);
	    var taskObj = new AnyChatSDKFileHandler.instance(opt);
	    (typeof(opt.done) === "function") && this.setCallBack("onFileTransferDone", opt.done, true);
	    (typeof(opt.onTaskStatusChanged) === "function") && this.setCallBack("onTaskStatusChanged", opt.onTaskStatusChanged, false);
	    return taskObj;
	};

	//??????????????????
	AnyChatSDKInstance.prototype.createFileDownloadTask = function(opt) {
	    logger.invokeLog("createFileDownloadTask");
	    opt.action = "download";
	    var taskObj = new AnyChatSDKFileHandler.instance(opt);
	    (typeof(opt.done) === "function") && this.setCallBack(opt.fileid, opt.done, true);
	    (typeof(opt.onDownloadTaskStatusChanged) === "function") && this.setCallBack("onDownloadTaskStatusChanged", opt.onDownloadTaskStatusChanged, false);
	    taskObj.downloadInit();
	    return taskObj;
	};

	//??????????????????
	AnyChatSDKInstance.prototype.requestVideoCall = function(opt) {
	    opt.userId = getIntUserId(opt.userId);
	    var errorCode = AnyChatSDKVideoCallHandler.instance.request(opt);
	    (typeof(opt.done) === "function") && this.setCallBack("onRequestVideoCallDone", opt.done, true);
	    var params = JSON.parse(JSON.stringify(opt));
	    (typeof(params.done) === "function") && delete params.done;
	    logger.invokeLog("requestVideoCall", errorCode, params);
	};

	//??????????????????
	AnyChatSDKInstance.prototype.acceptVideoCall = function(opt) {
	    opt.userId = getIntUserId(opt.userId);
	    var errorCode = AnyChatSDKVideoCallHandler.instance.accept(opt);
	    logger.invokeLog("acceptVideoCall", errorCode, opt);
	};

	//????????????????????????
	AnyChatSDKInstance.prototype.rejectVideoCall = function(opt) {
	    opt.userId = getIntUserId(opt.userId);
	    var errorCode = AnyChatSDKVideoCallHandler.instance.reject(opt);
	    logger.invokeLog("rejectVideoCall", errorCode, opt);
	};

	//??????????????????
	AnyChatSDKInstance.prototype.hangupVideoCall = function(opt) {
	    opt.userId = getIntUserId(opt.userId);
	    var errorCode = AnyChatSDKVideoCallHandler.instance.hangup(opt);
	    logger.invokeLog("hangupVideoCall", errorCode, opt);
	};

	//??????????????????
	AnyChatSDKInstance.prototype.cancelVideoCall = function(opt) {
	    opt.userId = getIntUserId(opt.userId);
	    var errorCode = AnyChatSDKVideoCallHandler.instance.cancel(opt);
	    logger.invokeLog("cancelVideoCall", errorCode, opt);
	};

	//????????????????????????????????????
	AnyChatSDKInstance.prototype.getAreas = function(opt) {
	    var errorCode = AnyChatSDKAreaHandler.instance.getAreas(opt);
	    (typeof(opt.done) === "function") && this.setCallBack("onSyncAreasDone", opt.done, true);
	    logger.invokeLog("getAreas", errorCode);
	};

	//???????????????
	AnyChatSDKInstance.prototype.enterArea = function(opt) {
	    var errorCode = AnyChatSDKAreaHandler.instance.inArea(this, opt);
	    (typeof(opt.done) === "function") && this.setCallBack("onEnterAreaDone", opt.done, true);
	    var params = JSON.parse(JSON.stringify(opt));
	    (typeof(params.done) === "function") && delete params.done;
	    logger.invokeLog("enterArea", errorCode, params);
	};

	//???????????????
	AnyChatSDKInstance.prototype.leaveArea = function(opt) {
	    var errorCode = AnyChatSDKAreaHandler.instance.outArea(this);
	    (typeof(opt.done) === "function") && this.setCallBack("onLeaveAreaDone", opt.done, true);
	    logger.invokeLog("leaveArea", errorCode);
	};

	//????????????
	AnyChatSDKInstance.prototype.enqueue = function(opt) {
	    var errorCode = AnyChatSDKQueueHandler.instance.inQueue(this, opt);
	    (typeof(opt.done) === "function") && this.setCallBack("onEnqueueDone", opt.done, true);
	    // (typeof (opt.onQueueTimeout) === "function") && this.setCallBack("onQueueTimeout", opt.onQueueTimeout, true);
	    (typeof(opt.onProcessChanged) === "function") && this.setCallBack("onProcessChanged", opt.onProcessChanged, false);
	    logger.invokeLog("enqueue", errorCode, { queueId: opt.queueId });
	};

	//????????????
	AnyChatSDKInstance.prototype.cancelQueuing = function(opt) {
	    var errorCode = AnyChatSDKQueueHandler.instance.outQueue(this);
	    (typeof(opt.done) === "function") && this.setCallBack("onCancelQueuingDone", opt.done, true);
	    logger.invokeLog("cancelQueuing", errorCode);
	};

	//??????????????????
	AnyChatSDKInstance.prototype.agentServiceCtrl = function(opt) {
	    var errorCode = AnyChatSDKAreaHandler.instance.agentServiceCtrl(this, opt);
	    (typeof(opt.done) === "function") && this.setCallBack("onServiceCtrlDone", opt.done, true);
	    (typeof(opt.onAgentStatusChanged) === "function") && this.setCallBack("onAgentStatusChanged", opt.onAgentStatusChanged, false);
	    (typeof(opt.onAgentServiceInfoNotify) === "function") && this.setCallBack("onAgentServiceInfoNotify", opt.onAgentServiceInfoNotify, false);
	    logger.invokeLog("agentServiceCtrl", errorCode, { ctrlCode: opt.ctrlCode });
	};

	//????????????????????????????????????
	AnyChatSDKInstance.prototype.getAgentStatus = function() {
	    var data = AnyChatSDKAreaHandler.instance.getAgentStatus(this);
	    if (data) var errorCode = 0;
	    logger.invokeLog("getAgentStatus", errorCode);
	    return data;
	};

	//??????????????????
	AnyChatSDKInstance.prototype.getQueueTime = function(opt) {
	    var second = AnyChatSDKQueueHandler.instance.getQueueTime(opt);
	    return second;
	};

	//????????????????????????
	AnyChatSDKInstance.prototype.getQueueLength = function(opt) {
	    var length = AnyChatSDKQueueHandler.instance.getQueueLength(opt);
	    return length;
	};

	//?????????????????????
	AnyChatSDKInstance.prototype.getQueuePos = function(opt) {
	    var pos = AnyChatSDKQueueHandler.instance.getQueuePos(opt);
	    return pos;
	};

	//???????????????????????????????????????
	AnyChatSDKInstance.prototype.getQueueUserInfo = function(opt) {
	    var userList = AnyChatSDKQueueHandler.instance.getQueueUserInfo(opt);
	    return userList;
	};

	//???????????????????????????????????????
	AnyChatSDKInstance.prototype.getAreaQueueUserCount = function(opt) {
	    var count = AnyChatSDKAreaHandler.instance.getAreaQueueUserCount(opt);
	    return count;
	};

	//??????????????????
	AnyChatSDKInstance.prototype.requestShareDesktop = function(opt) {
	    var jsonObj = {
	        level: "BRAC",
	        action: "requestShareDesktop",
	        srcUserId: AnyChatSDKUserHandler.instance.userId
	    };
	    opt.msg = JSON.stringify(jsonObj);
	    opt.targetUsers = opt.targetUsers.map(getIntUserId);
	    var taskId = AnyChatSDKUserHandler.instance.transBufferEx(opt);
	    var errorCode = taskId > 0 ? 0 : -1;
	    logger.invokeLog("requestShareDesktop", errorCode, opt);
	};

	//????????????????????????
	AnyChatSDKInstance.prototype.cancelRequestShareDesktop = function(opt) {
	    var jsonObj = {
	        level: "BRAC",
	        action: "cancelRequestShareDesktop",
	        srcUserId: AnyChatSDKUserHandler.instance.userId
	    };
	    opt.msg = JSON.stringify(jsonObj);
	    opt.targetUsers = opt.targetUsers.map(getIntUserId);
	    var taskId = AnyChatSDKUserHandler.instance.transBufferEx(opt);
	    var errorCode = taskId > 0 ? 0 : -1;
	    logger.invokeLog("cancelRequestShareDesktop", errorCode, opt);
	};

	//??????????????????
	AnyChatSDKInstance.prototype.acceptShareDesktop = function(opt) {
	    var jsonObj = {
	        level: "BRAC",
	        action: "acceptShareDesktop",
	        srcUserId: AnyChatSDKUserHandler.instance.userId,
	        streamIndex: opt.streamIndex
	    };
	    opt.msg = JSON.stringify(jsonObj);
	    opt.targetUsers = opt.targetUsers.map(getIntUserId);
	    var taskId = AnyChatSDKUserHandler.instance.transBufferEx(opt);
	    var errorCode = taskId > 0 ? 0 : -1;
	    logger.invokeLog("acceptShareDesktop", errorCode, opt);
	};

	//??????????????????
	AnyChatSDKInstance.prototype.rejectShareDesktop = function(opt) {
	    var jsonObj = {
	        level: "BRAC",
	        action: "rejectShareDesktop",
	        srcUserId: AnyChatSDKUserHandler.instance.userId
	    };
	    opt.msg = JSON.stringify(jsonObj);
	    opt.targetUsers = opt.targetUsers.map(getIntUserId);
	    var taskId = AnyChatSDKUserHandler.instance.transBufferEx(opt);
	    var errorCode = taskId > 0 ? 0 : -1;
	    logger.invokeLog("rejectShareDesktop", errorCode, opt);
	};

	//???????????????????????????
	AnyChatSDKInstance.prototype.cancelShareDesktop = function(opt) {
	    var jsonObj = {
	        level: "BRAC",
	        action: "cancelShareDesktop",
	        srcUserId: AnyChatSDKUserHandler.instance.userId
	    };
	    opt.msg = JSON.stringify(jsonObj);
	    opt.targetUsers = opt.targetUsers.map(getIntUserId);
	    var taskId = AnyChatSDKUserHandler.instance.transBufferEx(opt);
	    var errorCode = taskId > 0 ? 0 : -1;
	    logger.invokeLog("cancelShareDesktop", errorCode, opt);
	};

	//???????????????????????????
	AnyChatSDKInstance.prototype.closeShareDesktop = function(opt) {
	    var jsonObj = {
	        level: "BRAC",
	        action: "closeShareDesktop",
	        srcUserId: AnyChatSDKUserHandler.instance.userId
	    };
	    opt.msg = JSON.stringify(jsonObj);
	    opt.targetUsers = opt.targetUsers.map(getIntUserId);
	    var taskId = AnyChatSDKUserHandler.instance.transBufferEx(opt);
	    var errorCode = taskId > 0 ? 0 : -1;
	    logger.invokeLog("closeShareDesktop", errorCode, opt);
	};

	//??????????????????
	AnyChatSDKInstance.prototype.requestRemoteControl = function(opt) {
	    var jsonObj = {
	        level: "BRAC",
	        action: "requestRemoteControl",
	        srcUserId: AnyChatSDKUserHandler.instance.userId
	    };
	    opt.msg = JSON.stringify(jsonObj);
	    opt.targetUsers = opt.targetUsers.map(getIntUserId);
	    var taskId = AnyChatSDKUserHandler.instance.transBufferEx(opt);
	    var errorCode = taskId > 0 ? 0 : -1;
	    logger.invokeLog("requestRemoteControl", errorCode, opt);
	};

	//????????????????????????
	AnyChatSDKInstance.prototype.cancelRequestRemoteControl = function(opt) {
	    var jsonObj = {
	        level: "BRAC",
	        action: "cancelRequestRemoteControl",
	        srcUserId: AnyChatSDKUserHandler.instance.userId
	    };
	    opt.msg = JSON.stringify(jsonObj);
	    opt.targetUsers = opt.targetUsers.map(getIntUserId);
	    var taskId = AnyChatSDKUserHandler.instance.transBufferEx(opt);
	    var errorCode = taskId > 0 ? 0 : -1;
	    logger.invokeLog("requestRemoteControl", errorCode, opt);
	};

	//??????????????????
	AnyChatSDKInstance.prototype.acceptRemoteControl = function(opt) {
	    var jsonObj = {
	        level: "BRAC",
	        action: "acceptRemoteControl",
	        srcUserId: AnyChatSDKUserHandler.instance.userId,
	        streamIndex: opt.streamIndex
	    };
	    opt.msg = JSON.stringify(jsonObj);
	    opt.targetUsers = opt.targetUsers.map(getIntUserId);
	    var taskId = AnyChatSDKUserHandler.instance.transBufferEx(opt);
	    var errorCode = taskId > 0 ? 0 : -1;
	    logger.invokeLog("acceptRemoteControl", errorCode, opt);
	};

	//??????????????????
	AnyChatSDKInstance.prototype.rejectRemoteControl = function(opt) {
	    var jsonObj = {
	        level: "BRAC",
	        action: "rejectRemoteControl",
	        srcUserId: AnyChatSDKUserHandler.instance.userId
	    };
	    opt.msg = JSON.stringify(jsonObj);
	    opt.targetUsers = opt.targetUsers.map(getIntUserId);
	    var taskId = AnyChatSDKUserHandler.instance.transBufferEx(opt);
	    var errorCode = taskId > 0 ? 0 : -1;
	    logger.invokeLog("rejectRemoteControl", errorCode, opt);
	};

	//??????????????????
	AnyChatSDKInstance.prototype.finishRemoteControl = function(opt) {
	    var jsonObj = {
	        level: "BRAC",
	        action: "finishRemoteControl",
	        srcUserId: AnyChatSDKUserHandler.instance.userId
	    };
	    opt.msg = JSON.stringify(jsonObj);
	    opt.targetUsers = opt.targetUsers.map(getIntUserId);
	    AnyChatSDKUserHandler.instance.transBufferEx(opt);
	    var taskId = AnyChatSDKVideoCallHandler.instance.finishRemoteControl(opt);
	    var errorCode = taskId > 0 ? 0 : -1;
	    logger.invokeLog("finishRemoteControl", errorCode, opt);
	};

	//??????????????????
	AnyChatSDKInstance.prototype.openRemoteControl = function(opt) {
	    opt.userId = getIntUserId(opt.userId);
	    var errorCode = AnyChatSDKVideoCallHandler.instance.openRemoteControl(opt);
	    logger.invokeLog("openRemoteControl", errorCode, opt);
	};

	//??????SDK??????
	AnyChatSDKInstance.prototype.setSDKOption = function(opt) {
	    AnyChatSDKSettingHandler.instance.setSDKOption(opt);
	};

	//??????SDK??????
	AnyChatSDKInstance.prototype.getSDKOptionInt = function(infoName) {
	    return AnyChatSDKSettingHandler.instance.getSDKOptionInt(infoName);
	};
	AnyChatSDKInstance.prototype.getSDKOptionString = function(infoName) {
	    return AnyChatSDKSettingHandler.instance.getSDKOptionString(infoName);
	};
	    
	//??????????????????????????????
	AnyChatSDKInstance.prototype.getStreamInfo = function(opt) {
	    var data = AnyChatSDKVideoHandler.getUserStreamInfo(opt);
	    return data;
	};

	//??????????????????
	AnyChatSDKInstance.prototype.getVersionInfo = function() {
	    return AnyChatSDKSettingHandler.instance.getVersionInfo();
	};

	//??????????????????????????????
	AnyChatSDKInstance.prototype.getUserState = function(opt) {
	    opt.userId = getIntUserId(opt.userId);
	    var data = AnyChatSDKSettingHandler.instance.getState(opt);
	    return data;
	};

	//??????????????????
	AnyChatSDKInstance.prototype.setRotation = function(opt) {
	    AnyChatSDKSettingHandler.instance.setRotation(opt);
	};


	AnyChatSDKInstance.prototype.setCallBack = function(type, callback, isDoneEvent) {
	    this.eventTarget.addEvent(type, callback, isDoneEvent);
	};

	//????????????????????????
	AnyChatSDKInstance.prototype.callbackFunctionRegister = function(option) {
	    if (typeof option === "object") {
	        var keys = [];
	        for (var p in option) {
	            if (option.hasOwnProperty(p) && typeof(option[p]) === "function")
	                keys.push(p);
	        }
	        for (var p in keys) {
	            var key = keys[p];
	            this.setCallBack(key, option[key], false);
	        }
	    }
	};

	//????????????????????????
	AnyChatSDKInstance.prototype.callbackFunctionDestroy = function(option) {
	    if (typeof option === "object") {
	        for (var p in option) {
	            if (option.hasOwnProperty(p) && typeof(option[p]) === "function")
	                this.eventTarget.removeEvent({
	                    type: p
	                });
	        }
	    }
	};

	AnyChatSDKInstance.prototype.getInitDone = function() {
	    return this.isInitDone;
	};

	AnyChatSDKInstance.prototype.turnPathToUrl = function(opt) {
	    var url = BRAC_GetSDKOptionStringEx(BRAC_SO_LOCALPATH2URL, opt.path, 0);
	    return url;
	};

	AnyChatSDKInstance.prototype.getAgentCount = function(opt) {
	    var data = {};
	    data.allAgentCount = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_AREA, opt.areaId, ANYCHAT_AREA_INFO_AGENTCOUNT);
	    data.idleAgentCount = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_AREA, opt.areaId, ANYCHAT_AREA_INFO_IDLEAGENTCOUNT);
	    return data;
	};

	AnyChatSDKInstance.prototype.getIntUserId = function(strUserId) {
	    return AnyChatSDKUserHandler.getIntUserId(strUserId);
	};

	AnyChatSDKInstance.prototype.getUserName = function(opt) {
	    // var userName = "";
	    var userName = BRAC_GetUserName(opt.userId);
	    if(userName == ""){
	        userName = BRAC_QueryInfoFromServer(ANYCHAT_SERVERQUERY_NAMEBYUSERID, opt.userId);
	        if(userName == ""){
	            userName = BRAC_ObjectGetStringValue(ANYCHAT_OBJECT_TYPE_CLIENTUSER, opt.userId, ANYCHAT_OBJECT_INFO_NAME);
	        }
	    }
	    
	    return userName;
	};

	AnyChatSDKInstance.prototype.getUserInfos = function(opt) {
		var useridlist = {},opt = opt || '';
		if((typeof opt == 'object')&&opt.constructor == Array){
			useridlist.useridlist = opt;
		}else if((typeof opt == 'string')&&opt.constructor == String){
			useridlist.userstrid = opt;
		}else if((typeof opt=='number')&&opt.constructor==Number){
			useridlist.userid = opt;
		};
		var userDatas = BRAC_QueryInfoFromServer(ANYCHAT_SERVERQUERY_USERINFOBYID, JSON.stringify(useridlist));
	    return userDatas;
	};

	AnyChatSDKInstance.prototype.getUserFriends = function() {
	    return AnyChatSDKFriendHandler.instance.getUserFriends();
	};

	AnyChatSDKInstance.prototype.getFriendInfo = function(opt) {
	    return AnyChatSDKFriendHandler.instance.getFriendInfo(opt);
	};

	AnyChatSDKInstance.prototype.getFriendNickName = function(opt) {
	    return AnyChatSDKFriendHandler.instance.getFriendNickName(opt);
	};

	AnyChatSDKInstance.prototype.getFriendIP = function(opt) {
	    return AnyChatSDKFriendHandler.instance.getFriendIP(opt);
	};

	AnyChatSDKInstance.prototype.selectVideoCapture = function(opt) {
	    BRAC_SelectVideoCapture(BRAC_DEVICE_VIDEOCAPTURE, opt.deviceName);
	};

	// ??????GUID?????????
	AnyChatSDKInstance.prototype.createGuid = function(){
	    return BRAC_NewGuid();
	};

	// ??????????????????
	AnyChatSDKInstance.prototype.setVirtualBgImg = function(opt){
	    return AnyChatSDKSettingHandler.instance.setVirtualBkImg(opt);
	};
	// ?????????????????????
	AnyChatSDKInstance.prototype.setVirtualStudio = function(opt){
	    return AnyChatSDKSettingHandler.instance.setVirtualStudio(opt);
	};
	// ????????????????????????
	AnyChatSDKInstance.prototype.createStreamPlay = function(opt){
	    logger.invokeLog("createStreamPlay");
	    var spObj = new AnyChatSDKStreamPlayHandler.instance(opt);
	    
	    (typeof (opt.onStop) === "function") && this.setCallBack("onStreamPlayStop", opt.onStop, false);
	    (typeof (opt.onPlay) === "function") && this.setCallBack("onStreamPlayStart", opt.onPlay, false);
	    spObj.initStreamPlay();
	    if(this.AnyChatSDKRecordTag && opt.hasOwnProperty("tagOpt")){//??????????????????????????????
	        var errorCode = this.AnyChatSDKRecordTag.addRecordTagByType(opt.tagOpt);
	        logger.invokeLog("addRecordTagByType", errorCode, opt.tagOpt);
	    }
	    return spObj;
	};

	// ????????????
	AnyChatSDKInstance.prototype.deleteFile = function(opt){
	    var errorCode =  AnyChatSDKFileHandler.deleteFile(opt);
	    logger.invokeLog("deleteFile", errorCode, opt);
	    return errorCode;
	};

	// ????????????
	AnyChatSDKInstance.prototype.encryptFile = function(opt){
	    var errorCode = AnyChatSDKFileHandler.encryptFile(opt);
	    logger.invokeLog("encryptFile", errorCode, opt);
	    return errorCode;
	};

	// ????????????
	AnyChatSDKInstance.prototype.decryptFile = function (opt) {
	    var errorCode = AnyChatSDKFileHandler.decryptFile(opt);
	    logger.invokeLog("decryptFile", errorCode, opt);
	    return errorCode;
	};

	// ??????????????????
	AnyChatSDKInstance.prototype.getDiskSize = function(opt) {
	    logger.invokeLog("getDiskSize");
	    return AnyChatSDKFileHandler.getDiskSize(opt);
	};

	//??????????????????
	AnyChatSDKInstance.prototype.createRobot = function(option) {
	    if(this.AnyChatAIManagement==null){

	        this.AnyChatAIManagement=AnyChatSDKAIManagement.instance;
	    }
	    var flags= this.AnyChatAIManagement.createRobot();
	    (typeof(option.event) === "function") && this.setCallBack(flags.guid, option.event, true);
	    (typeof(option.errorevent) === "function") && this.setCallBack("err"+flags.guid, option.errorevent, true);
	    return flags;
	};
	//?????????????????????
	AnyChatSDKInstance.prototype.getAllRobot = function() {
	   return this.AnyChatAIManagement.getAllRobot();

	};
	//?????????????????????
	AnyChatSDKInstance.prototype.destoryAllRobot = function() {
	    this.AnyChatAIManagement.destoryAllRobot();

	};
	//???????????????
	AnyChatSDKInstance.prototype.destroyRobot  = function(robotId) {
	    this.AnyChatAIManagement.destroyRobot(robotId);

	};

	//??????????????????
	AnyChatSDKInstance.prototype.startRecordTag = function(opt){
	    var tagObj = new AnyChatSDKRecordTag.instance();
	    var errorCode = tagObj.startRecordTag(opt);
	    logger.invokeLog("startRecordTag", errorCode, opt);
	    return tagObj;
	} 

	/*----------------------------------------------------------
	 * AnyChatSDK
	 * ????????????:AnyChatSDK ??????,????????????AnyChatSDK??????
	 * 
	 * ---------------------------------------------------------
	 */
	function AnyChatWebSDK() {
	    // this.anychatSDKInstance = new AnyChatSDKInstance();
	    this.anychatSDKInstance = null;
	}

	AnyChatWebSDK.prototype.sdkInit = function(option) {
	    // if (this.anychatSDKInstance.getInitDone()) {
	    //     return this.anychatSDKInstance;
	    // }

	    this.anychatSDKInstance = new AnyChatSDKInstance();

	    AnyChatSDKEventTarget.instance.removeAll();

	    info.serverIp = option.serverIp ? option.serverIp : "demo.anychat.cn";

	    info.serverPort = option.serverPort ? option.serverPort : 8906;

	    info.appId = option.appId ? option.appId : "";

	    info.timeStamp = option.timeStamp ? option.timeStamp : 0;

	    info.selfService = option.selfService ? option.selfService : 0;

	    info.nickName = option.nickName;

	    info.userId = option.userId ? option.userId : -1;

	    info.strUserId = option.strUserId ? option.strUserId : "";

	    info.password = option.password ? option.password : "";

	    info.sign = option.sign ? option.sign : "";
	    if(info.sign != ""){
	        AnyChatWebSDK.anychatSDKInstance.isCluster = 1;
	    } else {
	        AnyChatWebSDK.anychatSDKInstance.isCluster = option.password ? 0: 1;
	    }
	 
	    if (typeof option.queueOpt === "object") {
	        if (option.queueOpt.hasOwnProperty("role")) {
	            AnyChatSDKUserHandler.instance.userType = parseInt(option.queueOpt.role);
	            info.role = option.queueOpt.role;
	        }
	        if (option.queueOpt.hasOwnProperty("name")) {
	            AnyChatSDKQueueHandler.instance.name = option.queueOpt.name;
	            info.name = option.queueOpt.name;
	        }
	        if (option.queueOpt.hasOwnProperty("priority")) {
	            AnyChatSDKQueueHandler.instance.priority = option.queueOpt.priority;
	            info.priority = option.queueOpt.priority;
	        }
	        if (option.queueOpt.hasOwnProperty("attribute")) {
	            AnyChatSDKQueueHandler.instance.attribute = option.queueOpt.attribute ? option.queueOpt.attribute : "";
	            info.attribute = option.queueOpt.attribute ? option.queueOpt.attribute : "";
	        }
	        if (option.queueOpt.hasOwnProperty("isAutoMode")) {
	            AnyChatSDKQueueHandler.instance.isAutoMode = option.queueOpt.isAutoMode;
	            info.isAutoMode = option.queueOpt.isAutoMode;
	        }
	        if (option.queueOpt.hasOwnProperty("isGlobal")) {
	            AnyChatSDKQueueHandler.instance.isGlobal = option.queueOpt.isGlobal;
	            info.isGlobal = option.queueOpt.isGlobal;
	        }
			if (option.queueOpt.hasOwnProperty("isGlobalAgent")) {
			    AnyChatSDKQueueHandler.instance.isGlobalAgent = option.queueOpt.isGlobalAgent;
			    info.isGlobalAgent = option.queueOpt.isGlobalAgent;
			}

	    }
	    if (typeof option.cameraOpt === "object") {
	        info.openNativeScreenCamera = option.cameraOpt.openNativeScreenCamera;
	    }
	    if (typeof option.logOpt === "object") {
	        info.logSavepath = option.logOpt.logSavepath;
	        info.logFileRule = option.logOpt.logFileRule;
	    }



	    AnyChatSDKUserHandler.instance.callbackFunctionRegister(this, option);

	    AnyChatSDKVideoCallHandler.instance.callbackFunctionRegister(this, option);

	    AnyChatSDKQueueHandler.instance.callbackFunctionRegister(this, option);

	    AnyChatSDKFriendHandler.instance.callbackFunctionRegister(this, option);

	    this.anychatSDKInstance.init();
	    //????????????
	    (typeof(option.onSessionKeep) === "function") && this.anychatSDKInstance.setCallBack("onSessionKeep", option.onSessionKeep, false);	

	    return this.anychatSDKInstance;
	};

	function setLogSavePath(opt) {
	    // ???????????????
	    BRAC_SetSDKOption(BRAC_SO_CORESDK_LOGFILERULE, opt.logFileRule);
	    // ???????????????????????????
	    BRAC_SetSDKOption(BRAC_SO_CORESDK_LOGFILEROOTPATH, opt.logSavepath);
	}

	function audioCallback(devices) {
	    var audioDevices = [];
	    for (var d in devices) {
	        if (devices[d].kind == "audioinput") {
	            audioDevices.push(devices[d].deviceId);
	        }
	    }
	    return audioDevices;
	}

	function videoCallback(devices) {
	    var videoDevices = [];
	    for (var d in devices) {
	        if (devices[d].kind == "videoinput") {
	            videoDevices.push(devices[d].deviceId);
	        }
	    }
	    return videoDevices;
	}

	function getBrowserInfo(){
		var browser = "unknown browser";
		var ua = navigator.userAgent.toLowerCase();
		
		var info = {
			ie: /msie/.test(ua) && !/opera/.test(ua),
			op: !/msie/.test(ua) && /opera/.test(ua),
			sa: /version.*safari/.test(ua),
			ch: /chrome/.test(ua) && window.navigator.webkitPersistentStorage,
			ff: /firefox/.test(ua),
			qh360: /chrome/.test(ua) && !window.navigator.webkitPersistentStorage,
			qq: /qqbrowser/.test(ua),
		    sg: /metasr/.test(ua)        
		};	
		if (info.ch){
			browser = "Chrome";
		}else if (info.ie || (!!window.ActiveXObject || "ActiveXObject" in window) ){
			browser = "IE";
		}else if (info.ff){
			browser = "Firefox";
		}else if (info.sa){
			browser = "Safari";
		}else if (info.qh360){
			browser = "360?????????";
		}else if (info.op){
			browser = "Opera";
		}else if (info.qq){
			browser = "QQ?????????";
		}else if (info.sg){
			browser = "???????????????";
		}
		return browser;
	}

	var AnyChatWebSDK = new AnyChatWebSDK();

	window.AnyChatWebSDK = AnyChatWebSDK;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	/*-----------------------------------------------------------
	 * AnyChat??????????????????
	 * ????????????:AnyChatSDK????????????????????????????????????????????????
	 *
	 *
	 * ----------------------------------------------------------
	 */


	/**
	 * Create a new logger
	 * @constructor
	 * @class The main Log class.  Create a new instance of this class to send all logging events.
	 * @param level The cut-off logger level.  You can adjust this level in the constructor and leave all other logging events in place.  Defaults to {@link Log#WARN}.
	 * @param logger The logger to use.  The logger is a function that accepts the logging events and informs the user or developer. Defaults to {@link Log#writeLogger}.
	 */
	function Log(level,logger,prefix) {
	    var _currentLevel = Log.WARN;
	    var _logger = Log.writeLogger; // default to write Logger
	    var _prefix = false;
	    /**
	     * Sets the current logger prefix
	     * @param {String} prefix This prefix will be prepended to all messages.
	     */
	    this.setPrefix = function(pre) {
	        if (pre!='undefined') { _prefix = pre; }
	        else { _prefix = false; }
	    };
	    /**
	     * Sets the current logger function
	     * @param logger The function that will be called when a log event needs to be displayed
	     */
	    this.setLogger = function(logger) {
	        if (logger!='undefined') { _logger = logger; }
	    };

	    /**
	     * Sets the current threshold log level for this Log instance.  Only events that have a priority of this level or greater are logged.
	     * @param level The new threshold priority level for logging events.  This can be one of the static members {@link Log#DEBUG},  {@link Log#INFO}, {@link Log#WARN}, {@link Log#ERROR}, {@link Log#FATAL}, {@link Log#NONE}, or it can be one of the strings ["debug", "info", "warn", "error", "fatal", "none"].
	     */
	    this.setLevel = function(level) {
	        if (level!='undefined' && typeof level =='number') {
	            _currentLevel = level;
	        } else if (level!='undefined') {
	            if (level=='debug') { _currentLevel = Log.DEBUG; }
	            else if (level=='info') { _currentLevel = Log.INFO; }
	            else if (level=='error') { _currentLevel = Log.ERROR; }
	            else if (level=='fatal') { _currentLevel = Log.FATAL; }
	            else if (level=='warn') { _currentLevel = Log.WARN; }
	            else { _currentLevel = Log.NONE; }
	        }
	    };

	    /**
	     * Gets the current prefix
	     * @return current prefix
	     */

	    this.getPrefix = function() { return _prefix; };

	    /**
	     * Gets the current event logger function
	     * @return current logger
	     */

	    this.getLogger = function() { return _logger; };

	    /**
	     * Gets the current threshold priority level
	     * @return current level
	     */

	    this.getLevel = function() { return _currentLevel; };

	    if (level!='undefined') { this.setLevel(level); }
	    if (logger!='undefined') { this.setLogger(logger); }
	    if (prefix!='undefined') { this.setPrefix(prefix); }
	}
	/**
	 * Log an event with priority of "debug"
	 * @param s the log message
	 */
	Log.prototype.debug     = function(s) { if (this.getLevel()<=Log.DEBUG) { this._log(s,"DEBUG",this); } };
	/**
	 * Log an event with priority of "info"
	 * @param s the log message
	 */
	Log.prototype.info      = function(s) { if (this.getLevel()<=Log.INFO ) { this._log(s,"INFO",this); } };
	/**
	 * Log an event with priority of "warn"
	 * @param s the log message
	 */
	Log.prototype.warn      = function(s) { if (this.getLevel()<=Log.WARN ) { this._log(s,"WARN",this); } };
	/**
	 * Log an event with priority of "error"
	 * @param s the log message
	 */
	Log.prototype.error     = function(s) { if (this.getLevel()<=Log.ERROR) { this._log(s,"ERROR",this); } };
	/**
	 * Log an event with priority of "fatal"
	 * @param s the log message
	 */
	Log.prototype.fatal     = function(s) { if (this.getLevel()<=Log.FATAL) { this._log(s,"FATAL",this); } };

	/**
	 * _log is the function that actually calling the configured logger function.
	 * It is possible that this function could be extended to allow for more
	 * than one logger.
	 *
	 * This method is used by {@link Log#debug}, {@link Log#info}, {@link Log#warn}, {@link Log#error}, and {@link Log#fatal}
	 * @private
	 * @param {String} msg The message to display
	 * @param level The priority level of this log event
	 * @param {Log} obj The originating {@link Log} object.
	 */
	Log.prototype._log = function(msg,level,obj) {
	    if (this.getPrefix()) {
	        this.getLogger()(this.getPrefix()+" - "+msg,level,obj);
	    } else {
	        this.getLogger()(msg,level,obj);
	    }

	};

	Log.DEBUG       = 1;
	Log.INFO        = 2;
	Log.WARN        = 3;
	Log.ERROR       = 4;
	Log.FATAL       = 5;
	Log.NONE		= 6;

	/**
	 * Static alert logger method.  This logger will display a javascript alert (messagebox) with the message.
	 * @param {String} msg The message to display
	 * @param level The priority level of this log event
	 */
	Log.alertLogger = function(msg,level) { alert(level+" - "+msg); };
	/**
	 * Static write logger method.  This logger will print the message out to the web page using document.writeln.
	 * @param {String} msg The message to display
	 * @param level The priority level of this log event
	 */
	Log.writeLogger = function(msg,level) { document.writeln(level+"&nbsp;-&nbsp;"+msg+"<br/>"); }


	/**
	 * Static Safari WebKit console logger method. This logger will write messages to the Safari javascript console, if available.
	 * If this browser doesn't have a javascript console (IE/Moz), then it degrades gracefully to {@link Log#popupLogger}
	 * @param {String} msg The message to display
	 * @param level The priority level of this log event
	 * @param {Log} obj The originating {@link Log} object.
	 */
	Log.consoleLogger = function(msg,level,obj) {
	    if (window.console) {
	        var d = new Date();
	        var h = d.getHours();
	        if (h<10) { h="0"+h; }
	        var m = d.getMinutes();
	        if (m<10) { m="0"+m; }
	        var s = d.getSeconds();
	        if (s<10) { s="0"+s; }
	        var date = (d.getMonth()+1)+"/"+d.getDate()+"/"+d.getFullYear()+" "+h+":"+m+":"+s;

	        window.console.log("Time:"+date +" Level:"+level+" Message:"+msg);
	        Log.printLogger(msg,level,obj,date);
	    } /*else {
	     Log.popupLogger(msg,level,obj);
	     }*/
	};

	Log.printLogger = function(msg,level,obj,date){
	    if(!window.document.getElementById("logger")){
	        return;
	    }else{
	        var getDiv = window.document.getElementById("logger");
	        var createFont = document.createElement("font");
	        createFont.innerHTML = date+"&nbsp;&nbsp;"+msg;
	        getDiv.appendChild(createFont);
	    }

	};

	/**
	 * Static popup logger method.  This logger will popup a new window (if necessary), and add the log message to the end of a list.
	 * @param {String} msg The message to display
	 * @param level The priority level of this log event
	 * @param {Log} obj The originating {@link Log} object.
	 */
	Log.popupLogger = function(msg,level,obj) {
	    if (obj.popupBlocker) {
	        return;
	    }
	    if (!obj._window || !obj._window.document) {
	        obj._window = window.open("",'logger_popup_window','width=420,height=320,scrollbars=1,status=0,toolbars=0,resizable=1');
	        if (!obj._window) { obj.popupBlocker=true; alert("You have a popup window manager blocking the log4js log popup display.\n\nThis must be disabled to properly see logged events."); return; }
	        if (!obj._window.document.getElementById('loggerTable')) {
	            obj._window.document.writeln("<table width='100%' id='loggerTable'><tr><th align='left'>Time</th><th width='100%' colspan='2' align='left'>Message</th></tr></table>");
	            obj._window.document.close();
	        }
	    }
	    var tbl = obj._window.document.getElementById("loggerTable");
	    var row = tbl.insertRow(-1);

	    var cell_1 = row.insertCell(-1);
	    var cell_2 = row.insertCell(-1);
	    var cell_3 = row.insertCell(-1);

	    var d = new Date();
	    var h = d.getHours();
	    if (h<10) { h="0"+h; }
	    var m = d.getMinutes();
	    if (m<10) { m="0"+m; }
	    var s = d.getSeconds();
	    if (s<10) { s="0"+s; }
	    var date = (d.getMonth()+1)+"/"+d.getDate()+"/"+d.getFullYear()+"&nbsp;-&nbsp;"+h+":"+m+":"+s;

	    cell_1.style.fontSize="8pt";
	    cell_1.style.fontWeight="bold";
	    cell_1.style.paddingRight="6px";

	    cell_2.style.fontSize="8pt";

	    cell_3.style.fontSize="8pt";
	    cell_3.style.whiteSpace="nowrap";
	    cell_3.style.width="100%";

	    if (tbl.rows.length % 2 == 0) {
	        cell_1.style.backgroundColor="#eeeeee";
	        cell_2.style.backgroundColor="#eeeeee";
	        cell_3.style.backgroundColor="#eeeeee";
	    }

	    cell_1.innerHTML=date
	    cell_2.innerHTML=level;
	    cell_3.innerHTML=msg;
	};

	/**
	 * This method is a utility function that takes an object and creates a string representation of it's members.
	 * @param {Object} the Object that you'd like to see
	 * @return {String} a String representation of the object passed
	 */
	Log.dumpObject=function (obj,indent) {
	    if (!indent) { indent="";}
	    if (indent.length>20) { return ; } // don't go too far...
	    var s="{\n";
	    for (var p in obj) {
	        s+=indent+p+":";
	        var type=typeof(obj[p]);
	        type=type.toLowerCase();
	        if (type=='object') {
	            s+= Log.dumpObject(obj[p],indent+"----");
	        } else {
	            s+= obj[p];
	        }
	        s+="\n";
	    }
	    s+=indent+"}";
	    return s;
	};


	//????????????
	function AnyChatSDKInterfaceLog(prefix) {
	    this.logObj = new Log("debug",Log.consoleLogger,prefix);
	}

	AnyChatSDKInterfaceLog.prototype = {
	    constructor: AnyChatSDKInterfaceLog,

	    //??????????????????
	    invokeLog: function(funName,errorcode,params) {
	        var str ="";
	        if(params){
	            var keys = [];
	            for (var p in params) {
	                if (params.hasOwnProperty(p))
	                    keys.push(p);
	            }
	            str ="(";
	            for (var p in keys) {
	                var key = keys[p] ;
	                if(p ==(keys.length -1)){
	                    str += " " +key + ":" + params[key] +" )";
	                }else{
	                    str += " " +key + ":" + params[key] +",";
	                }
	            }
	        }
	        var logStr = "invoke AnyChatSDKInstance "+ funName + str;
	        var errorTips ="";
	        if(errorcode >= 0){
	            errorTips = errorcode;
	            logStr +="="+errorTips;
	        }else{
	            logStr +="...";
	        }
	        this.logObj.debug(logStr);
	    },

	    //????????????????????????
	    callbackLog:function(funName,errorcode,params) {
	        var str ="";
	        if(params){
	            var keys = [];
	            for (var p in params) {
	                if (params.hasOwnProperty(p)) {
	                    keys.push(p);
	                }
	            }
	            str ="(";
	            for (var p in keys) {
	                var key = keys[p] ;
	                if(p ==(keys.length -1)){
	                    str += " " +key + ":" + params[key] +" )";
	                }else{
	                    str += " " +key + ":" + params[key] +",";
	                }
	            }
	        }
	        var logStr = "callback AnyChatSDKInstance "+ funName;
	        var errorTips ="";
	        if(errorcode >= 0){
	            errorTips = errorcode;
	            logStr +=", errorCode:"+errorTips;
	        }else{
	            logStr +="...";
	        }
	        this.logObj.debug(logStr);
	    }

	};







	var instance = new AnyChatSDKInterfaceLog();
	exports.getLogger = function(prefix){
	    return new AnyChatSDKInterfaceLog(prefix);
	    //return new Log("debug",Log.consoleLogger,prefix);
	};



/***/ }),
/* 2 */
/***/ (function(module, exports) {

	/*-----------------------------------------------------------
	 * AnyChat??????
	 * ????????????:??????AnyChat SDK?????????
	 *
	 *
	 * ----------------------------------------------------------
	 */

	//????????????
	function AnyChatSDKConstant() {

		
	}

	AnyChatSDKConstant.prototype = {
	    constructor: AnyChatSDKConstant,    	
		//???????????????????????????
		ConnectStatus: {
		    'ERROR': -1,//????????????
		    'INIT': 0,//?????????
			'INITIALIZED': 1,//????????????	    
		    'OPEN': 2,//????????????
		    'OFFLINE': 3,//????????????
			'OPENING': 4//?????????
		},
		//??????????????????
		ErrorType: {
			'CONNECT_ERROR': 1,  //????????????
			'LOGIN_ERROR': 2     //????????????		
		}
	}


	var instance = new AnyChatSDKConstant();

	exports.instance = instance;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

	/*-----------------------------------------------------------
	 * AnyChatSDKEventTarget
	 * ????????????:???????????????????????????
	 * 
	 * 
	 * ----------------------------------------------------------
	 */
	//??????????????????
	function AnyChatSDKEventTarget() {
	    // ??????????????????????????????
	    this.handlers = {};
	    this.doneHandlers = [];
	}

	//?????????????????????
	AnyChatSDKEventTarget.prototype = {
	    // ???????????????????????????
	    constructor: AnyChatSDKEventTarget,

	    // ??????????????????????????????????????????
	    addEvent: function(type, handler, isDoneEvent) {
	        // ????????????????????????????????????????????????
	        if (typeof this.handlers[type] == 'undefined') {
	            this.handlers[type] = [];
	            // ???????????????push???????????????????????????
	            this.handlers[type].push(handler);

	        }else{
	            if(isDoneEvent){
	                this.handlers[type].push(handler);
	            }else{
	                this.handlers[type].length = 0;
	                this.handlers[type].push(handler);
	            }
	        }

	        if (isDoneEvent) {
	            this.doneHandlers.push(type);
	        }

	    },

	    // ??????????????????
	    fireEvent: function(event) {
	        // ?????????????????????event
	        if (!event.target) {
	            event.target = this;
	        }
	        // ?????????????????????????????????
	        if (this.handlers[event.type] instanceof Array) {
	            var handlers = this.handlers[event.type];
	            // ????????????????????????????????????????????????????????????????????????????????????????????????
	            for (var i = 0; i < handlers.length; i++) {
	                // ????????????
	                var args = [];
	                for (var k in event) {
	                    if (k != 'type') {
	                        args.push(event[k]);
	                    }
	                }
	                //(args);
	                handlers[i].apply(null, args);
	            }
	            for (var j = 0; j < this.doneHandlers.length; j++) {
	                if (event.type == this.doneHandlers[j]) {
	                    this.removeEvent(event);
	                    this.doneHandlers.splice(j, 1);
	                    break;
	                }
	            }
	        }
	    },

	    // ????????????
	    removeEvent: function(event) {
	        // ?????????????????????event
	        if (!event.target) {
	            event.target = this;
	        }
	        // ?????????????????????????????????
	        if (this.handlers[event.type] instanceof Array) {
	            delete this.handlers[event.type];
	        }
	    },

	    //????????????
	    removeAll: function() {
	        this.handlers = {};
	        this.doneHandlers = [];
	    }
	};

	var instance = new AnyChatSDKEventTarget();
	exports.instance = instance;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	/*-----------------------------------------------------------
	 * AnyChat???????????????
	 * ????????????:???????????????????????????????????????
	 *
	 *
	 * ----------------------------------------------------------
	 */
	//??????log4js
	var log4js = __webpack_require__(1);
	var logger = log4js.getLogger("AnyChatSDKUserHandler");

	var AnyChatSDKConstant = __webpack_require__(2);
	var AnyChatSDKErrorCode = __webpack_require__(5);
	var AnyChatSDKAreaHandler = __webpack_require__(6);
	var CONSTANT = AnyChatSDKConstant.instance;

	//????????????
	function AnyChatSDKUserHandler() {
	    this.atRoomUserList = []; //???????????????????????????	
	    this.userType = -1; //???????????????1--??????  2--??????
	    this.userId = -1; //??????int???userId??????????????????
	    this.strUserId = "";
	    this.isSupportEx = true;
	    this.currentMsgTaskId = []; //???????????????????????????????????????ID
	}

	AnyChatSDKUserHandler.prototype = {
	    constructor: AnyChatSDKUserHandler,

	    //????????????
	    login: function(userLoginObj) {
	        var _password = "";
	        //if (userLoginObj.appId) {
	        //    BRAC_LoginEx(userLoginObj.nickName, -1, userLoginObj.strUserId,
	        //        userLoginObj.appId, userLoginObj.timeStamp, "", "");
	        //} else {
	        //    if (userLoginObj.password)
	        //        _password = userLoginObj.password;
	        //
	        //    BRAC_Login(userLoginObj.nickName, _password, 0);
	        //}
	        // var errorCode = BRAC_LoginEx(userLoginObj.nickName, -1, userLoginObj.strUserId, userLoginObj.appId, userLoginObj.timeStamp, "", "");
	        var objectflags = ANYCHAT_OBJECT_FLAGS_QUEUEUSERLIST;
	        var ANYCHAT_OBJECT_FLAGS_SELFSERVICE = 8192       //??????????????????
	        var errorCode = -1;
	        if (!AnyChatWebSDK.anychatSDKInstance.isCluster) {
	            errorCode = BRAC_Login(userLoginObj.nickName, userLoginObj.password, 0);
	        } else {
	            if(userLoginObj.selfService){
	                objectflags = ANYCHAT_OBJECT_FLAGS_QUEUEUSERLIST + ANYCHAT_OBJECT_FLAGS_SELFSERVICE
	            }
	            errorCode = BRAC_LoginEx(userLoginObj.nickName, userLoginObj.userId, userLoginObj.strUserId, userLoginObj.appId, userLoginObj.timeStamp, userLoginObj.signData, JSON.stringify({'objectflags':objectflags}));
	        }
	        this.strUserId = userLoginObj.strUserId;
	        return errorCode;
	    },

	    //????????????
	    logout: function(anychatSDKInstance) {
	        var _sdk = anychatSDKInstance;
	        if (_sdk.curConnectStatus == CONSTANT.ConnectStatus.OFFLINE) {
	            return;
	        }
	        var errorCode = BRAC_Logout();

	        if (errorCode == 0) {
	            _sdk.curConnectStatus == CONSTANT.ConnectStatus.INITIALIZED;
	            AnyChatSDKAreaHandler.instance.areaIdArray = [];
	            AnyChatSDKAreaHandler.instance.areaIdIndex = 0;
	        }
	        return errorCode;
	    },

	    //?????????
	    enterRoom: function(params) {
	        var roomPwd = "";
	        if (params.hasOwnProperty("password")) {
	            roomPwd = params.password;
	        }
	        if (bSupportScriptObject)
	            return BRAC_EnterRoom(params.roomId, roomPwd, 0);
	        else {
	            var re = /^[1-9]+[0-9]*]*$/; //?????????????????????
	            if (re.test(params.roomId))
	                return BRAC_EnterRoom(parseInt(params.roomId), roomPwd, 0);
	            else
	                return BRAC_EnterRoomEx(params.roomId + "", roomPwd);
	        }
	    },

	    //??????????????????????????????
	    getRoomUsers: function() {
	        this.atRoomUserList = [];
	        var list = BRAC_GetOnlineUser();
	        list.push(this.userId);
	        var userList = list.map(getStrUserId);
	        for (var i = 0; i < userList.length; i++) {
	            this.atRoomUserList[i] = { intUserId: list[i], strUserId: userList[i] };
	        }
	        return userList;

	    },

	    //????????????
	    leaveRoom: function(anychatSDKInstance) {
	        var _sdk = anychatSDKInstance;
	        if (_sdk.curConnectStatus == CONSTANT.ConnectStatus.OFFLINE) {
	            return;
	        }
	        var errorCode = BRAC_LeaveRoom(-1);
	        return errorCode;
	    },

	    //?????????????????????????????????
	    controlLocalVideo: function(anychatSDKInstance, controlInfoObj) {

	    },

	    //?????????????????????????????????
	    requestOtherUserVideo: function(anychatSDKInstance, controlInfoObj) {

	    },

	    //????????????
	    sendMsg: function(opt) {
	        if (opt.hasOwnProperty("targetUsers")) {
	            if (opt.targetUsers.length == 0){
	                return BRAC_SendTextMessage(-1, 0, opt.msg);
	            }else{
	                var errorCode=0;
	                for (var i=0; i< opt.targetUsers.length;i++) {
	                    errorCode= BRAC_SendTextMessage(opt.targetUsers[i], 1, opt.msg);
	                }
	                return errorCode;
	            }
	                
	        } else {
	            return BRAC_SendTextMessage(-1, 0, opt.msg);
	        }

	    },



	    //????????????
	    transBuffer: function(opt) {
	        if (opt.hasOwnProperty("targetUsers")) {
	            if (opt.targetUsers.length == 0) {
	                return 21; //????????????
	            }
	            var errorCode=0, that = this;
	            var timestamp = new Date().getTime();

	            for (var i = 0; i < opt.targetUsers.length; i++) {

	                (function (index, ts) {
	                    ts = ts + "" + index; //???????????????, ?????????+??????i, ????????????
	                    var msg = ts + "#" +  opt.msg;

	                    var timer = setTimeout(function() { clearTimer(ts) }, (opt.time ? opt.time : 10) * 1000);
	                    var msgTaskObj = {
	                        msgId: ts,
	                        targetId: opt.targetUsers[index],
	                        msgContent:  opt.msg,
	                        timer: timer
	                    };
	                    that.currentMsgTaskId.push(msgTaskObj);
	                    errorCode= BRAC_TransBuffer(opt.targetUsers[index], base64.encode(msg));
	                })(i, timestamp)
	              
	            }
	            return errorCode;
	        } else {
	            return BRAC_TransBuffer(-1, base64.encode(opt.msg));
	        }
	    },

	    //??????????????????
	    transBufferEx: function(opt) {
	        if (opt.hasOwnProperty("targetUsers")) {
	            if (opt.targetUsers.length == 0) {
	                return 21; //????????????
	            }
	            var errorCode=0, that = this;
	            var timestamp = new Date().getTime();

	            for (var i = 0; i < opt.targetUsers.length; i++) {
	                (function (index, ts) {
	                    ts = ts + ""+ index; ////???????????????, ?????????+??????i, ????????????
	                    var msg = ts + "#" + opt.msg ;
	                    var timer = setTimeout(function() { clearTimer(ts) }, (opt.time ? opt.time : 10) * 1000);
	                    var msgTaskObj = {
	                        msgId: ts,
	                        targetId: opt.targetUsers[index],
	                        msgContent: opt.msg,
	                        timer: timer
	                    };
	                    that.currentMsgTaskId.push(msgTaskObj);
	                    errorCode= BRAC_TransBufferEx(opt.targetUsers[index], base64.encode(msg),opt.wParam || 0,opt.lParam || 0,opt.dwFlags ||0);
	                })(i, timestamp)
	               
	            }
	            return errorCode;
	        } else {
	            return BRAC_TransBufferEx(-1, base64.encode(opt.msg),opt.wParam || 0,opt.lParam || 0,opt.dwFlags ||0);
	        }
	    }
	};



	AnyChatSDKUserHandler.prototype.callbackFunctionRegister = function(AnyChatWebSDK, option) {

	    if (typeof(option.onDisConnect) === 'function') {
	        AnyChatWebSDK.anychatSDKInstance.setCallBack("onDisConnect", option.onDisConnect, false);
	    }

	    if (option.onUpdateUserInfo) {
	        AnyChatWebSDK.anychatSDKInstance.setCallBack("onUpdateUserInfo", option.onUpdateUserInfo, false);
	    }

	    if (option.onLogin) {
	        AnyChatWebSDK.anychatSDKInstance.setCallBack("onLogin", option.onLogin, false);
	    }

	    if (typeof option.bufferOpt === "object") {
	        typeof(option.bufferOpt.onReceiveBuffer) === "function" && AnyChatWebSDK.anychatSDKInstance.setCallBack("onReceiveBuffer", option.bufferOpt.onReceiveBuffer, false);
	    }

	    //if (option.userMsgAtRoom) {
	    //    AnyChatWebSDK.anychatSDKInstance.setCallBack("onAnyChatUserMsgAtRoom", option.userMsgAtRoom, false);
	    //}


	    if (typeof option.roomOpt === "object") {
	        typeof(option.roomOpt.onRoomUserInAndOut) === "function" && AnyChatWebSDK.anychatSDKInstance.setCallBack("onRoomUserInAndOut", option.roomOpt.onRoomUserInAndOut, false);
	        typeof(option.roomOpt.onRoomUserChanged) === "function" && AnyChatWebSDK.anychatSDKInstance.setCallBack("onRoomUserChanged", option.roomOpt.onRoomUserChanged, false);
	        typeof(option.roomOpt.onRoomUserMsgReceived) === "function" && AnyChatWebSDK.anychatSDKInstance.setCallBack("onRoomUserMsgReceived", option.roomOpt.onRoomUserMsgReceived, false);
	    }

	    if (typeof option.fileOpt === "object") {
	        typeof(option.fileOpt.onFileReceived) === "function" && AnyChatWebSDK.anychatSDKInstance.setCallBack("onFileReceived", option.fileOpt.onFileReceived, false);
	    }

	};

	function Base64() {

	    // private property  
	    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

	    // public method for encoding  
	    this.encode = function(input) {
	        var output = "";
	        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
	        var i = 0;
	        input = _utf8_encode(input);
	        while (i < input.length) {
	            chr1 = input.charCodeAt(i++);
	            chr2 = input.charCodeAt(i++);
	            chr3 = input.charCodeAt(i++);
	            enc1 = chr1 >> 2;
	            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
	            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
	            enc4 = chr3 & 63;
	            if (isNaN(chr2)) {
	                enc3 = enc4 = 64;
	            } else if (isNaN(chr3)) {
	                enc4 = 64;
	            }
	            output = output +
	                _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
	                _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
	        }
	        return output;
	    }

	    // public method for decoding  
	    this.decode = function(input) {
	        var output = "";
	        var chr1, chr2, chr3;
	        var enc1, enc2, enc3, enc4;
	        var i = 0;
	        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
	        while (i < input.length) {
	            enc1 = _keyStr.indexOf(input.charAt(i++));
	            enc2 = _keyStr.indexOf(input.charAt(i++));
	            enc3 = _keyStr.indexOf(input.charAt(i++));
	            enc4 = _keyStr.indexOf(input.charAt(i++));
	            chr1 = (enc1 << 2) | (enc2 >> 4);
	            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
	            chr3 = ((enc3 & 3) << 6) | enc4;
	            output = output + String.fromCharCode(chr1);
	            if (enc3 != 64) {
	                output = output + String.fromCharCode(chr2);
	            }
	            if (enc4 != 64) {
	                output = output + String.fromCharCode(chr3);
	            }
	        }
	        output = _utf8_decode(output);
	        return output;
	    }

	    // private method for UTF-8 encoding  
	    _utf8_encode = function(string) {
	        string = string.replace(/\r\n/g, "\n");
	        var utftext = "";
	        for (var n = 0; n < string.length; n++) {
	            var c = string.charCodeAt(n);
	            if (c < 128) {
	                utftext += String.fromCharCode(c);
	            } else if ((c > 127) && (c < 2048)) {
	                utftext += String.fromCharCode((c >> 6) | 192);
	                utftext += String.fromCharCode((c & 63) | 128);
	            } else {
	                utftext += String.fromCharCode((c >> 12) | 224);
	                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
	                utftext += String.fromCharCode((c & 63) | 128);
	            }

	        }
	        return utftext;
	    }

	    // private method for UTF-8 decoding  
	    _utf8_decode = function(utftext) {
	        var string = "";
	        var i = 0;
	        var c = c1 = c2 = 0;
	        while (i < utftext.length) {
	            c = utftext.charCodeAt(i);
	            if (c < 128) {
	                string += String.fromCharCode(c);
	                i++;
	            } else if ((c > 191) && (c < 224)) {
	                c2 = utftext.charCodeAt(i + 1);
	                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
	                i += 2;
	            } else {
	                c2 = utftext.charCodeAt(i + 1);
	                c3 = utftext.charCodeAt(i + 2);
	                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
	                i += 3;
	            }
	        }
	        return string;
	    }
	}

	// ??????????????????strUserId
	function getStrUserIdFromServer(intUserId) {
	    if (intUserId == instance.userId) {
	        return instance.strUserId;
	    }
	    if (bSupportScriptObject || !AnyChatWebSDK.anychatSDKInstance.isCluster) {
	        var userName = BRAC_GetUserInfo(intUserId, 1);
	        if (userName == "")
	            userName = BRAC_QueryInfoFromServer(ANYCHAT_SERVERQUERY_NAMEBYUSERID, intUserId);
	        return userName;
	    } else {
	        return BRAC_QueryInfoFromServer(ANYCHAT_SERVERQUERY_STRIDBYUSERID, intUserId);
	    }
	}

	// ??????????????????intUserId
	function getIntUserIdFromServer(strUserId) {
	    if (strUserId == instance.strUserId) {
	        return instance.userId;
	    }
	    if (bSupportScriptObject || !AnyChatWebSDK.anychatSDKInstance.isCluster) {
	        return parseInt(BRAC_QueryInfoFromServer(ANYCHAT_SERVERQUERY_USERIDBYNAME, strUserId));
	    } else {
	        return BRAC_QueryInfoFromServer(ANYCHAT_SERVERQUERY_USERIDBYSTRID, strUserId);
	    }
	}

	//??????????????????????????????strUserId
	function getStrUserIdInRoom(intUserId) {
	    var strUserId = "";
	    for (var i = 0; i < instance.atRoomUserList.length; i++) {
	        if (instance.atRoomUserList[i].intUserId == intUserId) {
	            strUserId = instance.atRoomUserList[i].strUserId;
	            break;
	        }
	    }
	    return strUserId;
	}

	//??????????????????????????????intUserId
	function getIntUserIdInRoom(strUserId) {
	    var intUserId = "";
	    for (var i = 0; i < instance.atRoomUserList.length; i++) {
	        if (instance.atRoomUserList[i].strUserId == strUserId) {
	            intUserId = instance.atRoomUserList[i].intUserId;
	            break;
	        }
	    }
	    return intUserId;
	}

	//?????????????????????intUserId, ?????????????????????????????????
	function getIntUserId(strUserId) {
	    // var intUserId = getIntUserIdInRoom(strUserId);
	    // if (intUserId == "") {
	    //     return getIntUserIdFromServer(strUserId);
	    // }
	    return strUserId;
	}

	//?????????????????????strUserId, ?????????????????????????????????
	function getStrUserId(intUserId) {
	    // var strUserId = getStrUserIdInRoom(intUserId);
	    // if (strUserId == "") {
	    //     return getStrUserIdFromServer(intUserId);
	    // }
	    return intUserId;
	}

	function clearTimer(id) {
	    for (var i = 0; i < instance.currentMsgTaskId.length; i++) {
	        if (instance.currentMsgTaskId[i].msgId == id) {
	            var content = instance.currentMsgTaskId[i].msgContent;
	            var targetId = instance.currentMsgTaskId[i].targetId;
	            var data = {
	                userId: targetId,
	                msg: content
	            };
	            AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
	                type: "onTransBufferDone"+targetId,
	                result: {
	                    code: -1,
	                    msg: "????????????"
	                },
	                data: data
	            });
	            instance.currentMsgTaskId.slice(i, 1);
	            break;
	        }
	    }
	}

	var instance = new AnyChatSDKUserHandler();
	var base64 = new Base64();
	exports.instance = instance;
	exports.Base64 = base64;
	exports.getStrUserId = getStrUserId;
	exports.getIntUserId = getIntUserId;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	var errorObjList = [];
	var AC_ERROR_UNKNOW = { errorCode: -1, errorMsg: "????????????" };

	var AC_ERROR_SUCCESS = { errorCode: 0, errorMsg: "??????" };

	var AC_ERROR_DB_ERROR = { errorCode: 1, errorMsg: "???????????????" };
	var AC_ERROR_NOTINIT = { errorCode: 2, errorMsg: "?????????????????????" };
	var AC_ERROR_NOTINRM = { errorCode: 3, errorMsg: "??????????????????" };
	var AC_ERROR_MEMORYFAIL = { errorCode: 4, errorMsg: "not enough memory" };
	var AC_ERROR_EXCEPTION = { errorCode: 5, errorMsg: "????????????" };
	var AC_ERROR_CANCEL = { errorCode: 6, errorMsg: "???????????????" };
	var AC_ERROR_PROTOCOLFAIL = { errorCode: 7, errorMsg: "??????????????????" };
	var AC_ERROR_SESSIONNOTEXIST = { errorCode: 8, errorMsg: "???????????????" };
	var AC_ERROR_DATANOTEXIST = { errorCode: 9, errorMsg: "???????????????" };
	var AC_ERROR_DATAEXIST = { errorCode: 10, errorMsg: "??????????????????" };
	var AC_ERROR_INVALIDGUID = { errorCode: 11, errorMsg: "??????GUID" };
	var AC_ERROR_RESOURCERECOVER = { errorCode: 12, errorMsg: "???????????????" };
	var AC_ERROR_RESOURCEUSED = { errorCode: 13, errorMsg: "???????????????" };
	var AC_ERROR_JSONFAIL = { errorCode: 14, errorMsg: "Json????????????" };
	var AC_ERROR_OBJECTDELETE = { errorCode: 15, errorMsg: "???????????????" };
	var AC_ERROR_SESSIONEXIST = { errorCode: 16, errorMsg: "???????????????" };
	var AC_ERROR_SESSIONNOTINIT = { errorCode: 17, errorMsg: "?????????????????????" };

	var AC_ERROR_FUNCNOTALLOW = { errorCode: 20, errorMsg: "?????????????????????" };
	var AC_ERROR_FUNCOPTERROR = { errorCode: 21, errorMsg: "function parameters error" };
	var AC_ERROR_DEVICEOPENFAIL = { errorCode: 22, errorMsg: "device open failed or device no install" };
	var AC_ERROR_NOENOUGHRESOURCE = { errorCode: 23, errorMsg: "?????????????????????" };
	var AC_ERROR_PIXFMTNOTSUPPORT = { errorCode: 24, errorMsg: "?????????????????????????????????????????????" };
	var AC_ERROR_NOTMULTICASTADDR = { errorCode: 25, errorMsg: "?????????IP?????????????????????????????????" };
	var AC_ERROR_MULTIRUNERROR = { errorCode: 26, errorMsg: "????????????????????????" };
	var AC_ERROR_FILETRUSTFAILED = { errorCode: 27, errorMsg: "????????????????????????" };
	var AC_ERROR_CERTVERIFYFAILED = { errorCode: 28, errorMsg: "??????????????????" };
	var AC_ERROR_CERTUSERFAILED = { errorCode: 29, errorMsg: "?????????????????????????????????" };
	var AC_ERROR_MASTERISSLAVE = { errorCode: 30, errorMsg: "??????????????????????????????????????????????????????????????????" };
	var AC_ERROR_MASTERNOTCREDIT = { errorCode: 31, errorMsg: "??????????????????????????????????????????????????????" };
	var AC_ERROR_VERSIONNOTMATCH = { errorCode: 32, errorMsg: "???????????????" };
	var AC_ERROR_CERTFAILSECOND = { errorCode: 33, errorMsg: "???????????????????????????" };
	var AC_ERROR_SERVERVERIFYFAIL = { errorCode: 34, errorMsg: "???????????????????????????" };
	var AC_ERROR_CLIENTCERTFAILED = { errorCode: 35, errorMsg: "???????????????????????????" };
	var AC_ERROR_CERTSUMFAILED = { errorCode: 36, errorMsg: "????????????????????????" };
	var AC_ERROR_REMOTECTRL = { errorCode: 37, errorMsg: "????????????" };
	var AC_ERROR_DUPLICATESERVICEID = { errorCode: 38, errorMsg: "ServiceGuid??????" };
	var AC_ERROR_DIRENTERROR = { errorCode: 39, errorMsg: "????????????" };
	var AC_ERROR_EXTRACTFILEERROR = { errorCode: 40, errorMsg: "??????????????????" };
	var AC_ERROR_STARTPROCESSFAILED = { errorCode: 41, errorMsg: "??????????????????" };
	var AC_ERROR_SERVICEISRUNNING = { errorCode: 42, errorMsg: "???????????????" };
	var AC_ERROR_DISKSPACELIMITED = { errorCode: 43, errorMsg: "??????????????????" };
	var AC_ERROR_REQUESTFAILED = { errorCode: 44, errorMsg: "??????????????????????????????" };
	var AC_ERROR_INVALIDMACHINE = { errorCode: 45, errorMsg: "????????????????????????" };
	var AC_ERROR_GETCERTINFOFAILED = { errorCode: 46, errorMsg: "????????????????????????" };
	var AC_ERROR_CLUSTERNOTMATCH = { errorCode: 47, errorMsg: "?????????????????????" };
	var AC_ERROR_NONECLUSTERID = { errorCode: 48, errorMsg: "??????ID??????" };
	var AC_ERROR_CREATESERVICE_MORE = { errorCode: 49, errorMsg: "?????????????????????????????????????????????????????????????????????????????????" };
	var AC_ERROR_COPYFILEFAILED = { errorCode: 50, errorMsg: "??????????????????" };
	var AC_ERROR_CLOUDNATIVEDBFAIL = { errorCode: 51, errorMsg: "??????????????????????????????" };
	var AC_ERROR_CLOUDOSSUPLOADFAIL = { errorCode: 52, errorMsg: "?????????OSS??????????????????" };
	var AC_ERROR_SERVICEBINDCHANGE = { errorCode: 53, errorMsg: "????????????????????????" };
	var AC_ERROR_SERVICENOTBIND = { errorCode: 54, errorMsg: "?????????????????????" };
	var AC_ERROR_SERVICEBINDFAIL = { errorCode: 55, errorMsg: "??????????????????" };
	var AC_ERROR_PIPELINEUSERFAIL = { errorCode: 56, errorMsg: "PipeLine????????????ID??????" };
	var AC_ERROR_PIPELINESESSFAIL = { errorCode: 57, errorMsg: "PipeLine??????????????????" };
	var AC_ERROR_SERVICECLOSED = { errorCode: 58, errorMsg: "???????????????" };
	var AC_ERROR_FILEENCRYPTED = { errorCode: 59, errorMsg: "?????????????????????" };
	var AC_ERROR_FILEHEADINVAILD = { errorCode: 60, errorMsg: "???????????????????????????????????????" };
	var AC_ERROR_FILEDECODE_PASSERR = { errorCode: 61, errorMsg: "?????????????????????????????????" };

	//????????????
	var AC_ERROR_CONNECT_TIMEOUT = { errorCode: 100, errorMsg: "?????????????????????" };
	var AC_ERROR_CONNECT_ABORT = { errorCode: 101, errorMsg: "???????????????????????????" };
	var AC_ERROR_CONNECT_AUTHFAIL = { errorCode: 102, errorMsg: "???????????????????????????????????????????????????????????????" };
	var AC_ERROR_CONNECT_DNSERROR = { errorCode: 103, errorMsg: "??????????????????" };
	var AC_ERROR_CONNECT_OVERFLOW = { errorCode: 104, errorMsg: "?????????????????????" };
	var AC_ERROR_CONNECT_FUNCLIMIT = { errorCode: 105, errorMsg: "??????????????????????????????????????????" };
	var AC_ERROR_CONNECT_INTRANET = { errorCode: 106, errorMsg: "?????????????????????" };
	var AC_ERROR_CONNECT_OLDVERSION = { errorCode: 107, errorMsg: "??????????????????????????????" };
	var AC_ERROR_CONNECT_SOCKETERR = { errorCode: 108, errorMsg: "Socket??????" };
	var AC_ERROR_CONNECT_DEVICELIMIT = { errorCode: 109, errorMsg: "????????????????????????????????????" };
	var AC_ERROR_CONNECT_PAUSED = { errorCode: 110, errorMsg: "??????????????????" };
	var AC_ERROR_CONNECT_HOTSERVER = { errorCode: 111, errorMsg: "????????????????????????????????????????????????????????????" };
	var AC_ERROR_CONNECT_ERRCERUSER = { errorCode: 112, errorMsg: "???????????????????????????????????????????????????" };
	var AC_ERROR_CONNECT_IPFORBID = { errorCode: 113, errorMsg: "IP???????????????" };
	var AC_ERROR_CONNECT_TYPEWRONG = { errorCode: 114, errorMsg: "????????????????????????????????????????????????????????????" };
	var AC_ERROR_CONNECT_ERRORIP = { errorCode: 115, errorMsg: "?????????IP???????????????" };
	var AC_ERROR_CONNECT_SELFCLOSE = { errorCode: 116, errorMsg: "?????????????????????" };
	var AC_ERROR_CONNECT_NOSVRLIST = { errorCode: 117, errorMsg: "??????????????????????????????" };
	var AC_ERROR_CONNECT_LBTIMEOUT = { errorCode: 118, errorMsg: "?????????????????????????????????" };
	var AC_ERROR_CONNECT_NOTWORK = { errorCode: 119, errorMsg: "???????????????????????????" };
	var AC_ERROR_CONNECT_OFFLINE = { errorCode: 120, errorMsg: "??????????????????" };
	var AC_ERROR_CONNECT_NETLIMITED = { errorCode: 121, errorMsg: "??????????????????" };
	var AC_ERROR_CONNECT_LOWTRAFFIC = { errorCode: 122, errorMsg: "??????????????????" };
	var AC_ERROR_CONNECT_IPV6FAIL = { errorCode: 123, errorMsg: "?????????IPv6 Only??????" };
	var AC_ERROR_CONNECT_NOMASTER = { errorCode: 124, errorMsg: "??????Master???????????????" };
	var AC_ERROR_CONNECT_NOSTATUS = { errorCode: 125, errorMsg: "????????????????????????" };

	//????????????
	var AC_ERROR_CERTIFY_FAIL = { errorCode: 200, errorMsg: "???????????????????????????????????????" };
	var AC_ERROR_ALREADY_LOGIN = { errorCode: 201, errorMsg: "??????????????????" };
	var AC_ERROR_ACCOUNT_LOCK = { errorCode: 202, errorMsg: "????????????????????????" };
	var AC_ERROR_IPADDR_LOCK = { errorCode: 203, errorMsg: "IP????????????????????????" };
	var AC_ERROR_VISITOR_DENY = { errorCode: 204, errorMsg: "??????????????????????????????????????????????????????" };
	var AC_ERROR_INVALID_USERID = { errorCode: 205, errorMsg: "???????????????ID?????????????????????" };
	var AC_ERROR_SERVERSDK_FAIL = { errorCode: 206, errorMsg: "???????????????????????????????????????????????????" };
	var AC_ERROR_SERVERSDK_TIMEOUT = { errorCode: 207, errorMsg: "?????????????????????????????????" };
	var AC_ERROR_NOTLOGIN = { errorCode: 208, errorMsg: "????????????" };
	var AC_ERROR_LOGIN_NEWLOGIN = { errorCode: 209, errorMsg: "????????????????????????????????????" };
	var AC_ERROR_LOGIN_EMPTYNAME = { errorCode: 210, errorMsg: "???????????????" };
	var AC_ERROR_KICKOUT = { errorCode: 211, errorMsg: "??????????????????" };
	var AC_ERROR_SERVER_RESTART = { errorCode: 212, errorMsg: "?????????????????????" };
	var AC_ERROR_FORBIDDEN = { errorCode: 213, errorMsg: "??????????????????????????????" };
	var AC_ERROR_SIGSTREMPTY = { errorCode: 214, errorMsg: "?????????????????????????????????" };
	var AC_ERROR_SIGVERIFYFAIL = { errorCode: 215, errorMsg: "??????????????????" };
	var AC_ERROR_SIGPUBLICKEYEMPTY = { errorCode: 216, errorMsg: "????????????????????????" };
	var AC_ERROR_SIGPRIVATEKEYEMPTY = { errorCode: 217, errorMsg: "??????????????????" };
	var AC_ERROR_SIGPARAMEMPTY = { errorCode: 218, errorMsg: "??????????????????" };
	var AC_ERROR_SIGPARAMFAIL = { errorCode: 219, errorMsg: "??????????????????" };
	var AC_ERROR_SIGTIMEFAILURE = { errorCode: 220, errorMsg: "??????????????????" };
	var AC_ERROR_APPNOTACTIVE = { errorCode: 221, errorMsg: "?????????????????????" };
	var AC_ERROR_APPPAUSED = { errorCode: 222, errorMsg: "?????????????????????" };
	var AC_ERROR_APPLOCKED = { errorCode: 223, errorMsg: "?????????????????????" };
	var AC_ERROR_APPEXPIRED = { errorCode: 224, errorMsg: "???????????????" };
	var AC_ERROR_APPUNKNOWSTATUS = { errorCode: 225, errorMsg: "??????????????????" };
	var AC_ERROR_SIGALREADYUSED = { errorCode: 226, errorMsg: "?????????????????????" };
	var AC_ERROR_USERROLE_FAIL = { errorCode: 227, errorMsg: "????????????????????????" };
	var AC_ERROR_INVALID_AGENT = { errorCode: 228, errorMsg: "????????????(?????????)" };

	//????????????
	var AC_ERROR_RM_LOCK = { errorCode: 300, errorMsg: "?????????????????????????????????" };
	var AC_ERROR_RM_PASSERR = { errorCode: 301, errorMsg: "?????????????????????????????????" };
	var AC_ERROR_RM_FULLUSER = { errorCode: 302, errorMsg: "??????????????????????????????" };
	var AC_ERROR_RM_INVALID = { errorCode: 303, errorMsg: "???????????????" };
	var AC_ERROR_RM_EXPIRE = { errorCode: 304, errorMsg: "???????????????????????????" };
	var AC_ERROR_RM_REJECT = { errorCode: 305, errorMsg: "??????????????????" };
	var AC_ERROR_RM_OWNERBEOUT = { errorCode: 306, errorMsg: "?????????????????????????????????" };
	var AC_ERROR_RM_ENTERFAIL = { errorCode: 307, errorMsg: "??????????????????" };
	var AC_ERROR_RM_ALREADIN = { errorCode: 308, errorMsg: "?????????????????????????????????????????????????????????" };
	var AC_ERROR_RM_NOTIN = { errorCode: 309, errorMsg: "????????????????????????????????????API????????????" };

	//?????????
	var AC_ERROR_STREAM_OLDPACK = { errorCode: 350, errorMsg: "???????????????" };
	var AC_ERROR_STREAM_SAMEPAK = { errorCode: 351, errorMsg: "??????????????????" };
	var AC_ERROR_STREAM_PACKLOSS = { errorCode: 352, errorMsg: "???????????????" };
	var AC_ERROR_STREAM_MISTAKE = { errorCode: 353, errorMsg: "???????????????????????????????????????" };
	var AC_ERROR_STREAM_LACKBUFFER = { errorCode: 354, errorMsg: "???????????????????????????" };

	//??????
	var AC_ERROR_RM_PRINULL = { errorCode: 401, errorMsg: "????????????????????????" };
	var AC_ERROR_RM_REJECTPRI = { errorCode: 402, errorMsg: "???????????????????????????" };
	var AC_ERROR_RM_PRIDENY = { errorCode: 403, errorMsg: "??????????????????????????????????????????????????????" };

	var AC_ERROR_RM_PRIREQIDERR = { errorCode: 420, errorMsg: "????????????ID??????????????????????????????" };
	var AC_ERROR_RM_PRIALRCHAT = { errorCode: 421, errorMsg: "????????????????????????" };

	var AC_ERROR_RM_PRITIMEOUT = { errorCode: 431, errorMsg: "??????????????????" };
	var AC_ERROR_RM_PRICHATBUSY = { errorCode: 432, errorMsg: "????????????????????????????????????" };
	var AC_ERROR_RM_PRIUSERCLOSE = { errorCode: 433, errorMsg: "????????????????????????" };
	var AC_ERROR_RM_PRISELFCLOSE = { errorCode: 434, errorMsg: "????????????????????????" };
	var AC_ERROR_RM_PRIREQCANCEL = { errorCode: 435, errorMsg: "?????????????????????" };

	//????????????
	var AC_ERROR_VIDEOCALL_INCHAT = { errorCode: 440, errorMsg: "???????????????" };

	//Mic?????????
	var AC_ERROR_MICLOSE_TIMEOUT = { errorCode: 500, errorMsg: "????????????????????????????????????" };
	var AC_ERROR_MICLOSE_HIGHUSER = { errorCode: 501, errorMsg: "????????????????????????????????????????????????" };


	//????????????
	var AC_ERROR_COMMBUS_SELFMASTER = { errorCode: 610, errorMsg: "???????????????Master??????" };
	var AC_ERROR_COMMBUS_OTHERMASTER = { errorCode: 611, errorMsg: "?????????????????????" };
	var AC_ERROR_COMMBUS_LOWPRIORITY = { errorCode: 612, errorMsg: "???????????????" };

	//????????????
	var AC_ERROR_TRANSBUF_CREATEFAIL = { errorCode: 700, errorMsg: "??????????????????" };
	var AC_ERROR_TRANSBUF_NOTASK = { errorCode: 701, errorMsg: "???????????????????????????????????????" };

	var AC_ERROR_TRANSFILE_OPENFAIL = { errorCode: 710, errorMsg: "??????????????????" };
	var AC_ERROR_TRANSFILE_ZEROLEN = { errorCode: 711, errorMsg: "???????????????0" };
	var AC_ERROR_TRANSFILE_TLARGE = { errorCode: 712, errorMsg: "??????????????????" };
	var AC_ERROR_TRANSFILE_READFAIL = { errorCode: 713, errorMsg: "???????????????" };
	var AC_ERROR_TRANSFILE_DOWNLOADING = { errorCode: 714, errorMsg: "?????????????????????" };
	var AC_ERROR_TRANSFILE_FAILED = { errorCode: 715, errorMsg: "??????????????????" };
	var AC_ERROR_TRANSFILE_NOTASK = { errorCode: 716, errorMsg: "???????????????????????????????????????" };

	//????????????				
	var AC_ERROR_RECORD_NOTASK = { errorCode: 720, errorMsg: "??????????????????" };
	var AC_ERROR_RECORD_CREATEFAIL = { errorCode: 721, errorMsg: "????????????????????????" };
	var AC_ERROR_RECORD_WAITINFO = { errorCode: 722, errorMsg: "?????????????????????????????????????????????" };

	//????????????			
	var AC_ERROR_QUEUE_INVALID = { errorCode: 750, errorMsg: "???????????????ID" };
	var AC_ERROR_QUEUE_PREPARESERVICE = { errorCode: 751, errorMsg: "?????????????????????????????????" };
	var AC_ERROR_QUEUE_TIMEOUT = { errorCode: 752, errorMsg: "???????????????????????????" };

	//SDK??????
	var AC_ERROR_WARNING_UDPFAIL = { errorCode: 780, errorMsg: "???????????????UDP???????????????????????????????????????????????????" };
	var AC_ERROR_WARNING_MISCUTILFAIL = { errorCode: 781, errorMsg: "SDK??????brMiscUtil.dll???????????????????????????????????????" };
	var AC_ERROR_WARNING_MEDIAUTILFAIL = { errorCode: 782, errorMsg: "SDK??????brMediaUtil.dll???????????????????????????????????????" };
	var AC_ERROR_WARNING_MEDIACOREFAIL = { errorCode: 783, errorMsg: "SDK??????brMediaCore.dll???????????????????????????????????????" };
	var AC_ERROR_WARNING_MEDIASHOWFAIL = { errorCode: 784, errorMsg: "SDK??????brMediaShow.dll???????????????????????????????????????" };

	//video device error code define
	var AC_ERROR_VIDEO_OPENFAIL = { errorCode: 10001, errorMsg: "Open video device fail" };
	var AC_ERROR_VIDEO_UNKNOWFMT = { errorCode: 10002, errorMsg: "Unknow output video pix format" };
	var AC_ERROR_VIDEO_VIDIOC_G_FMT = { errorCode: 10003, errorMsg: "Driver Not supported VIDIOC_G_FMT" };
	var AC_ERROR_VIDEO_VIDIOC_S_FMT = { errorCode: 10004, errorMsg: "Driver Not supported VIDIOC_S_FMT" };
	var AC_ERROR_VIDEO_VIDIOC_G_PARM = { errorCode: 10005, errorMsg: "Driver Not supported VIDIOC_G_PARM" };
	var AC_ERROR_VIDEO_VIDIOC_S_PARM = { errorCode: 10006, errorMsg: "Driver Not supported VIDIOC_S_PARM" };
	var AC_ERROR_VIDEO_VIDIOC_QUERYCAP = { errorCode: 10007, errorMsg: "Driver Not supported VIDIOC_QUERYCAP" };
	var AC_ERROR_VIDEO_V4L2_CAP_VIDEO = { errorCode: 10008, errorMsg: "This is not a capture video device" };
	var AC_ERROR_VIDEO_PREP_CAPBUFFER_FALL = { errorCode: 10009, errorMsg: "For acquisition error" };
	var AC_ERROR_VIDEO_VIDIOC_REQBUFS = { errorCode: 10010, errorMsg: "Device Not supported for mmap and usermap mode" };
	var AC_ERROR_VIDEO_VIDIOC_QUERYBUF = { errorCode: 10011, errorMsg: "get physaddr to block fail" };
	var AC_ERROR_VIDEO_MAP_FAILED = { errorCode: 10012, errorMsg: "physaddr map to viraddr fail" };
	var AC_ERROR_VIDEO_VIDIOC_QBUF = { errorCode: 10013, errorMsg: "QBUF fail" };
	var AC_ERROR_VIDEO_PREPBUF = { errorCode: 10013, errorMsg: "video prepbuff fail" };
	var AC_ERROR_VIDEO_GETVIDEO_FAIL = { errorCode: 10014, errorMsg: "get video fail" };
	var AC_ERROR_VIDEO_VIDIOC_DQBUF = { errorCode: 10015, errorMsg: "QBUF fail" };
	var AC_ERROR_VIDEO_VIDIOC_STREAMON = { errorCode: 10016, errorMsg: "VIDIOC_STREAMON fail" };
	var AC_ERROR_VIDEO_VIDIOC_STREAMOFF = { errorCode: 10017, errorMsg: "VIDIOC_STREAMOFF fail" };
	var AC_ERROR_VIDEO_CAMERA_EBUSY = { errorCode: 10018, errorMsg: "May be camera is used by other progress now" };
	var AC_ERROR_VIDEO_UNSUPPORTMODE = { errorCode: 10019, errorMsg: "unsupport video capture mode" };
	var AC_ERROR_VIDEO_CAMERA_EINVAL = { errorCode: 10020, errorMsg: "the requested buffer type not supported, or VIDIOC_TRY_FMT was called and is not supported with this buffer type." };

	//Audio device error code define
	var AC_ERROR_AUDIO_OPENFAIL = { errorCode: 10500, errorMsg: "Open Audio device fail" };
	var AC_ERROR_AUDIO_ALLOCHWPARAMS = { errorCode: 10501, errorMsg: "alloc hwparams fail" };
	var AC_ERROR_AUDIO_INTERLEAVED = { errorCode: 10502, errorMsg: "set interleaved mode fail" };
	var AC_ERROR_AUDIO_FORMAT = { errorCode: 10503, errorMsg: "set wBitsPerSample  fail" };
	var AC_ERROR_AUDIO_SAMPLESPERSEC = { errorCode: 10504, errorMsg: "set SamplesPerSec   fail" };
	var AC_ERROR_AUDIO_CHANNELS = { errorCode: 10505, errorMsg: "set channels fail" };
	var AC_ERROR_AUDIO_PERIODS = { errorCode: 10506, errorMsg: "set periods  fail" };
	var AC_ERROR_AUDIO_BUFFERSIZE = { errorCode: 10507, errorMsg: "set buffer size fail" };
	var AC_ERROR_AUDIO_PARAMS = { errorCode: 10508, errorMsg: "function :snd_pcm_hw_params fail" };
	var AC_ERROR_AUDIO_BUFFERTIME = { errorCode: 10509, errorMsg: "set rebuffer time fail" };
	var AC_ERROR_AUDIO_BUFFERFRAME = { errorCode: 10510, errorMsg: "get rebuffer frames fail" };
	var AC_ERROR_AUDIO_PERIODTIME = { errorCode: 10511, errorMsg: "get period time fail" };
	var AC_ERROR_AUDIO_PERIODFRAME = { errorCode: 10512, errorMsg: "get period time fail" };
	var AC_ERROR_AUDIO_ALLOCSWPARAMS = { errorCode: 10513, errorMsg: "alloc swparams fail" };
	var AC_ERROR_AUDIO_START_THRESHOID = { errorCode: 10514, errorMsg: "set start threshoid fail" };
	var AC_ERROR_AUDIO_START_AVAIL_MIN = { errorCode: 10515, errorMsg: "set start avail min fail" };
	var AC_ERROR_AUDIO_PCMPREPARE = { errorCode: 10516, errorMsg: "function snd_pcm_prepare fail" };
	var AC_ERROR_AUDIO_READFAIL = { errorCode: 10517, errorMsg: "function read fail" };
	var AC_ERROR_AUDIO_CAPMODE = { errorCode: 10518, errorMsg: "??????capmode??????" };


	var AC_ERROR_PLAY_INVALIDSTREAM = { errorCode: 20000, errorMsg: "????????????" };

	var AC_ERROR_STREAM_SESSIONFAILED = { errorCode: 30000, errorMsg: "??????????????????" };

	//??????????????????
	var GV_ERR_PLUGINNOINSTALL = { errorCode: 1010000, errorMsg: "??????????????????" };
	var GV_ERR_PLUGINOLDVERSION = { errorCode: 1010001, errorMsg: "??????????????????" };

	//????????????
	var AC_ERROR_VIDEOCALL_CANCEL = { errorCode: 100101, errorMsg: "???????????????????????????" };
	var AC_ERROR_VIDEOCALL_OFFLINE = { errorCode: 100102, errorMsg: "?????????????????????" };
	var AC_ERROR_VIDEOCALL_BUSY = { errorCode: 100103, errorMsg: "???????????????" };
	var AC_ERROR_VIDEOCALL_REJECT = { errorCode: 100104, errorMsg: "????????????????????????" };
	var AC_ERROR_VIDEOCALL_TIMEOUT = { errorCode: 100105, errorMsg: "??????????????????" };
	var AC_ERROR_VIDEOCALL_DISCONNECT = { errorCode: 100106, errorMsg: "????????????" };
	var AC_ERROR_VIDEOCALL_NOTINCALL = { errorCode: 100107, errorMsg: "????????????????????????" };

	//????????????
	var AC_ERROR_OBJECT_EXISTAREA = { errorCode: 100201, errorMsg: "??????????????????????????????" };
	var AC_ERROR_OBJECT_EXISTQUEUE = { errorCode: 100202, errorMsg: "??????????????????????????????" };


	//??????ID
	var AC_ERROR_APPID_DEFAULTNOTSUPPORT = { errorCode: 100300, errorMsg: "???????????????ID?????????????????????" };
	var AC_ERROR_APPID_SIGNEED = { errorCode: 100301, errorMsg: "????????????????????????" };
	var AC_ERROR_APPID_SIGFAILED = { errorCode: 100302, errorMsg: "????????????????????????" };
	var AC_ERROR_APPID_NOTEXIST = { errorCode: 100303, errorMsg: "??????ID?????????" };
	var AC_ERROR_APPID_SYSLOCK = { errorCode: 100304, errorMsg: "??????ID???????????????" };
	var AC_ERROR_APPID_NOTMATCH = { errorCode: 100305, errorMsg: "??????ID????????????????????????" };
	var AC_ERROR_APPID_NOTCLOUDSERVER = { errorCode: 100306, errorMsg: "???????????????????????????????????????" };
	var AC_ERROR_APPID_CHARGEMACHINELACK = { errorCode: 100307, errorMsg: "???????????????????????????????????????" };
	var AC_ERROR_APPID_CHARGEMODECHANGE = { errorCode: 100308, errorMsg: "????????????????????????" };

	//????????????
	var AC_ERROR_USERCFG_PASSWDLEN_SMALL = { errorCode: 100400, errorMsg: "????????????????????????" };
	var AC_ERROR_USERCFG_USERNAME_SAME = { errorCode: 100401, errorMsg: "???????????????" };
	var AC_ERROR_USERCFG_ACCESSLIMIT = { errorCode: 100402, errorMsg: "????????????" };
	var AC_ERROR_USERCFG_USERNAME_LIMIT = { errorCode: 100403, errorMsg: "???????????????????????????" };

	//??????????????????
	var AC_ERROR_LIVEUPDATE_BEGIN = { errorCode: 100500, errorMsg: "??????????????????" };
	var AC_ERROR_LIVEUPDATE_STOPING = { errorCode: 100501, errorMsg: "???????????????????????????????????????..." };
	var AC_ERROR_LIVEUPDATE_BACKUPING = { errorCode: 100502, errorMsg: "???????????????????????????????????????..." };
	var AC_ERROR_LIVEUPDATE_DELETEING = { errorCode: 100503, errorMsg: "???????????????????????????????????????..." };
	var AC_ERROR_LIVEUPDATE_COPYING = { errorCode: 100504, errorMsg: "????????????????????????????????????..." };
	var AC_ERROR_LIVEUPDATE_STARTING = { errorCode: 100505, errorMsg: "????????????????????????????????????..." };
	var AC_ERROR_LIVEUPDATE_RECOVERING = { errorCode: 100506, errorMsg: "????????????????????????????????????..." };
	var AC_ERROR_LIVEUPDATE_ISTAGVER = { errorCode: 100507, errorMsg: "????????????????????????????????????" };
	var AC_ERROR_LIVEUPDATE_SERVICENEEDSTOP = { errorCode: 100508, errorMsg: "??????????????????????????????????????????????????????????????????" };
	var AC_ERROR_LIVEUPDATE_BACKUPFAIL = { errorCode: 100509, errorMsg: "???????????????????????????" };
	var AC_ERROR_LIVEUPDATE_DELETEFAIL = { errorCode: 100510, errorMsg: "???????????????????????????" };
	var AC_ERROR_LIVEUPDATE_COPYFAIL = { errorCode: 100511, errorMsg: "???????????????????????????" };
	var AC_ERROR_LIVEUPDATE_RECOVERYFAIL = { errorCode: 100512, errorMsg: "????????????????????????????????????" };
	var AC_ERROR_LIVEUPDATE_BRIDGENOTREGISTER = { errorCode: 100513, errorMsg: "?????????????????????????????????" };
	var AC_ERROR_LIVEUPDATE_WRITECONFIGFILEFAILED = { errorCode: 100514, errorMsg: "???????????????????????????????????????" };
	var AC_ERROR_LIVEUPDATE_CANTGETBACKUPDIR = { errorCode: 100515, errorMsg: "??????????????????????????????????????????" };
	var AC_ERROR_LIVEUPDATE_FINISH = { errorCode: 100516, errorMsg: "??????????????????" };
	var AC_ERROR_LIVEUPDATE_UNABLETOGETMAINTAINIFO = { errorCode: 100517, errorMsg: "????????????????????????" };
	var AC_ERROR_LIVEUPDATE_NOTRENAMEDIR = { errorCode: 100518, errorMsg: "????????????????????????" };

	//??????????????????                             
	var AC_ERROR_STOPPROCESS_TIMEOUT = { errorCode: 100600, errorMsg: "?????????????????????" };
	var AC_ERROR_STOPPROCESS_FAIL = { errorCode: 100601, errorMsg: "?????????????????????(???????????????)" };
	var AC_ERROR_STOPPROCESS_FORCEFAIL = { errorCode: 100602, errorMsg: "?????????????????????????????????" };

	//????????????                                 
	var AC_ERROR_STARTPROCESS_TIMEOUT = { errorCode: 100603, errorMsg: "????????????,??????????????????????????????????????????" };

	var AC_ERROR_SERVICE_CONTROLLED = { errorCode: 100604, errorMsg: "service ??????????????????(e.g ??????????????????????????????????????????????????????????????????)" };
	var AC_ERROR_SERVICE_EXISTELSEVER = { errorCode: 100605, errorMsg: "?????????????????????????????????????????????????????????????????????" };
	var AC_ERROR_SERVICE_NOTSUPPORT = { errorCode: 100606, errorMsg: "?????????????????????e.g ???PMServer????????????????????? ???" };
	var AC_ERROR_NONEXISTENCE_THE_VERSION = { errorCode: 100607, errorMsg: "??????????????????????????????" };
	var AC_ERROR_NONEXISTENCE_THE_SERVICE = { errorCode: 100608, errorMsg: "??????????????????????????????" };
	var AC_ERROR_ILLEGAL_EXTRA_CONFIG = { errorCode: 100609, errorMsg: "??????????????????????????????e.g LUServer ??? serviceBaseInfo ??????????????????????????????" };
	var AC_ERROR_MOVETEMPFILE_FAIL = { errorCode: 100610, errorMsg: "??????????????????????????????????????????" };
	var AC_ERROR_INCOMPATIBLE_CURRENT_PLATFORM = { errorCode: 100611, errorMsg: "???????????????OS??????" };
	var AC_ERROR_GETRT_CONNECT_FAIL = { errorCode: 100612, errorMsg: "?????? rtserverconnect ??????" };

	//???????????????????????????                       
	var AC_ERROR_BUSINESS_PARAM_INVALID = { errorCode: 100701, errorMsg: "????????????" };
	var AC_ERROR_BUSINESS_APPID_NOTEXIST = { errorCode: 100702, errorMsg: "??????ID?????????" };
	var AC_ERROR_BUSINESS_BODY_INVALID = { errorCode: 100703, errorMsg: "Body??????" };
	var AC_ERROR_BUSINESS_SIGVERIFYFAIL = { errorCode: 100704, errorMsg: "??????????????????" };
	var AC_ERROR_BUSINESS_SIGTIMEINVALID = { errorCode: 100705, errorMsg: "?????????????????????" };
	var AC_ERROR_BUSINESS_MEMORYFAIL = { errorCode: 100706, errorMsg: "not enough memory" };
	var AC_ERROR_BUSINESS_EXCEPTION = { errorCode: 100707, errorMsg: "????????????" };
	var AC_ERROR_BUSINESS_PROTOCOLFAIL = { errorCode: 100708, errorMsg: "??????????????????" };
	var AC_ERROR_BUSINESS_TIMEOUT = { errorCode: 100709, errorMsg: "?????????????????????????????????" };
	var AC_ERROR_BUSINESS_FILENOEXIST = { errorCode: 100710, errorMsg: "???????????????" };

	//??????????????????????????????                     
	var AC_ERROR_DB_EXECUTE_ERROR = { errorCode: 100801, errorMsg: "?????????????????????" };
	var AC_ERROR_DB_SELECT_NODATA = { errorCode: 100802, errorMsg: "???????????????????????????" };
	var AC_ERROR_DB_FETCH_ERROR = { errorCode: 100803, errorMsg: "??????????????????????????????" };
	var AC_ERROR_DB_EXCEPTION = { errorCode: 100804, errorMsg: "????????????" };
	var AC_ERROR_DB_CONNECT_ERROR = { errorCode: 100805, errorMsg: "????????????" };

	//PPT?????????????????????                        
	var AC_ERROR_PPTHELPER_INVALIAD_URL = { errorCode: 100901, errorMsg: "??????URL??????" };
	var AC_ERROR_PPTHELPER_RETURNED_ERROR = { errorCode: 100902, errorMsg: "???????????????" };
	var AC_ERROR_PPTHELPER_COULDNT_CONNECT = { errorCode: 100903, errorMsg: "?????????????????????" };
	//AI???????????????
	var AC_ERROR_AI_ABILITY_AIROBOTIDEXIST = { errorCode: 200000, errorMsg: "?????????ID?????????" };
	var AC_ERROR_AI_ABILITY_AITASKIDEXIST = { errorCode: 200001, errorMsg: "ai??????ID?????????" };
	var AC_ERROR_AI_ABILITY_AIOBJNOTEXIST = { errorCode: 200002, errorMsg: "ai???????????????" };
	var AC_ERROR_AI_ABILITY_PARAMINVALID = { errorCode: 200003, errorMsg: "ai????????????" };
	var AC_ERROR_AI_ABILITY_FUNCTIONNOTSUPPORT = { errorCode: 200004, errorMsg: "ai???????????????" };
	var AC_ERROR_AI_ABILITY_UNKNOWAIFUNCTION = { errorCode: 200005, errorMsg: "??????AI??????" };
	var AC_ERROR_AI_ABILITY_HTTPREQUESTFAIL = { errorCode: 200006, errorMsg: "HTTP????????????" };
	var AC_ERROR_AI_ABILITY_AIREQUESTINITFAIL = { errorCode: 200007, errorMsg: "ai?????????????????????" };
	var AC_ERROR_AI_ABILITY_AIREQUESTFAIL = { errorCode: 200008, errorMsg: "ai????????????" };
	var AC_ERROR_AI_ABILITY_AIREQUESTTIMEOUT = { errorCode: 200009, errorMsg: "ai????????????" };
	var AC_ERROR_AI_ABILITY_AITHREADDATAINVALID = { errorCode: 200010, errorMsg: "ai????????????????????????" };
	var AC_ERROR_AI_ABILITY_AITHREADOBJINVALID = { errorCode: 200011, errorMsg: "ai??????????????????" };
	var AC_ERROR_AI_ABILITY_AIRELATEDATAINVALID = { errorCode: 200012, errorMsg: "ai??????????????????" };
	var AC_ERROR_AI_ABILITY_HEARTBEATTIMEOUT = { errorCode: 200013, errorMsg: "????????????" };
	var AC_ERROR_AI_ABILITY_ROBOTOFFLINE = { errorCode: 200014, errorMsg: "???????????????" };
	var AC_ERROR_AI_ABILITY_CONTENTOVERLENGTH = { errorCode: 200015, errorMsg: "????????????" };
	var AC_ERROR_AI_ABILITY_COMMANDOVERLENGTH = { errorCode: 200016, errorMsg: "????????????" };
	var AC_ERROR_AI_ABILITY_AIOVERCUNCURRENCY = { errorCode: 200017, errorMsg: "ai?????????????????????" };
	var AC_ERROR_AI_ABILITY_MEDIAPARAMINVALID = { errorCode: 200018, errorMsg: "??????????????????" };
	var AC_ERROR_AI_ABILITY_REQUESTIDEXIST = { errorCode: 200019, errorMsg: "??????ID?????????" };
	var AC_ERROR_AI_ABILITY_ABNORMALERROR = { errorCode: 200020, errorMsg: "ai????????????" };

	//?????????????????????
	var AC_ERROR_RECORD_TAG_PARAMINVALID = { errorCode: 400000, errorMsg: "??????????????????" };
	var AC_ERROR_RECORD_TAG_NOTSTART = { errorCode: 400001, errorMsg: "???????????????" };
	var AC_ERROR_RECORD_TAG_NOTEXIST = { errorCode: 400002, errorMsg: "????????????????????????" };
	var AC_ERROR_RECORD_TAG_TASKIDEXIST = { errorCode: 400003, errorMsg: "taskId?????????" };

	errorObjList = [
	    AC_ERROR_UNKNOW,
	    AC_ERROR_SUCCESS,
	    AC_ERROR_DB_ERROR,
	    AC_ERROR_NOTINIT,
	    AC_ERROR_NOTINRM,
	    AC_ERROR_MEMORYFAIL,
	    AC_ERROR_EXCEPTION,
	    AC_ERROR_CANCEL,
	    AC_ERROR_PROTOCOLFAIL,
	    AC_ERROR_SESSIONNOTEXIST,
	    AC_ERROR_DATANOTEXIST,
	    AC_ERROR_DATAEXIST,
	    AC_ERROR_INVALIDGUID,
	    AC_ERROR_RESOURCERECOVER,
	    AC_ERROR_RESOURCEUSED,
	    AC_ERROR_JSONFAIL,
	    AC_ERROR_OBJECTDELETE,
	    AC_ERROR_SESSIONEXIST,
	    AC_ERROR_SESSIONNOTINIT,
	    AC_ERROR_FUNCNOTALLOW,
	    AC_ERROR_FUNCOPTERROR,
	    AC_ERROR_DEVICEOPENFAIL,
	    AC_ERROR_NOENOUGHRESOURCE,
	    AC_ERROR_PIXFMTNOTSUPPORT,
	    AC_ERROR_NOTMULTICASTADDR,
	    AC_ERROR_MULTIRUNERROR,
	    AC_ERROR_FILETRUSTFAILED,
	    AC_ERROR_CERTVERIFYFAILED,
	    AC_ERROR_CERTUSERFAILED,
	    AC_ERROR_MASTERISSLAVE,
	    AC_ERROR_MASTERNOTCREDIT,
	    AC_ERROR_VERSIONNOTMATCH,
	    AC_ERROR_CERTFAILSECOND,
	    AC_ERROR_SERVERVERIFYFAIL,
	    AC_ERROR_CLIENTCERTFAILED,
	    AC_ERROR_CERTSUMFAILED,
	    AC_ERROR_REMOTECTRL,
	    AC_ERROR_DUPLICATESERVICEID,
	    AC_ERROR_DIRENTERROR,
	    AC_ERROR_EXTRACTFILEERROR,
	    AC_ERROR_STARTPROCESSFAILED,
	    AC_ERROR_SERVICEISRUNNING,
	    AC_ERROR_DISKSPACELIMITED,
	    AC_ERROR_REQUESTFAILED,
	    AC_ERROR_INVALIDMACHINE,
	    AC_ERROR_GETCERTINFOFAILED,
	    AC_ERROR_CLUSTERNOTMATCH,
	    AC_ERROR_NONECLUSTERID,
	    AC_ERROR_CREATESERVICE_MORE,
	    AC_ERROR_COPYFILEFAILED,
	    AC_ERROR_CLOUDNATIVEDBFAIL,
	    AC_ERROR_CLOUDOSSUPLOADFAIL,
	    AC_ERROR_SERVICEBINDCHANGE,
	    AC_ERROR_SERVICENOTBIND,
	    AC_ERROR_SERVICEBINDFAIL,
	    AC_ERROR_PIPELINEUSERFAIL,
	    AC_ERROR_PIPELINESESSFAIL,
	    AC_ERROR_SERVICECLOSED,
	    AC_ERROR_FILEENCRYPTED,
	    AC_ERROR_FILEHEADINVAILD,
	    AC_ERROR_FILEDECODE_PASSERR,
	    AC_ERROR_CONNECT_TIMEOUT,
	    AC_ERROR_CONNECT_ABORT,
	    AC_ERROR_CONNECT_AUTHFAIL,
	    AC_ERROR_CONNECT_DNSERROR,
	    AC_ERROR_CONNECT_OVERFLOW,
	    AC_ERROR_CONNECT_FUNCLIMIT,
	    AC_ERROR_CONNECT_INTRANET,
	    AC_ERROR_CONNECT_OLDVERSION,
	    AC_ERROR_CONNECT_SOCKETERR,
	    AC_ERROR_CONNECT_DEVICELIMIT,
	    AC_ERROR_CONNECT_PAUSED,
	    AC_ERROR_CONNECT_HOTSERVER,
	    AC_ERROR_CONNECT_ERRCERUSER,
	    AC_ERROR_CONNECT_IPFORBID,
	    AC_ERROR_CONNECT_TYPEWRONG,
	    AC_ERROR_CONNECT_ERRORIP,
	    AC_ERROR_CONNECT_SELFCLOSE,
	    AC_ERROR_CONNECT_NOSVRLIST,
	    AC_ERROR_CONNECT_LBTIMEOUT,
	    AC_ERROR_CONNECT_NOTWORK,
	    AC_ERROR_CONNECT_OFFLINE,
	    AC_ERROR_CONNECT_NETLIMITED,
	    AC_ERROR_CONNECT_LOWTRAFFIC,
	    AC_ERROR_CONNECT_IPV6FAIL,
	    AC_ERROR_CONNECT_NOMASTER,
	    AC_ERROR_CONNECT_NOSTATUS,
	    AC_ERROR_CERTIFY_FAIL,
	    AC_ERROR_ALREADY_LOGIN,
	    AC_ERROR_ACCOUNT_LOCK,
	    AC_ERROR_IPADDR_LOCK,
	    AC_ERROR_VISITOR_DENY,
	    AC_ERROR_INVALID_USERID,
	    AC_ERROR_SERVERSDK_FAIL,
	    AC_ERROR_SERVERSDK_TIMEOUT,
	    AC_ERROR_NOTLOGIN,
	    AC_ERROR_LOGIN_NEWLOGIN,
	    AC_ERROR_LOGIN_EMPTYNAME,
	    AC_ERROR_KICKOUT,
	    AC_ERROR_SERVER_RESTART,
	    AC_ERROR_FORBIDDEN,
	    AC_ERROR_SIGSTREMPTY,
	    AC_ERROR_SIGVERIFYFAIL,
	    AC_ERROR_SIGPUBLICKEYEMPTY,
	    AC_ERROR_SIGPRIVATEKEYEMPTY,
	    AC_ERROR_SIGPARAMEMPTY,
	    AC_ERROR_SIGPARAMFAIL,
	    AC_ERROR_SIGTIMEFAILURE,
	    AC_ERROR_APPNOTACTIVE,
	    AC_ERROR_APPPAUSED,
	    AC_ERROR_APPLOCKED,
	    AC_ERROR_APPEXPIRED,
	    AC_ERROR_APPUNKNOWSTATUS,
	    AC_ERROR_SIGALREADYUSED,
	    AC_ERROR_USERROLE_FAIL,
	    AC_ERROR_INVALID_AGENT,
	    AC_ERROR_RM_LOCK,
	    AC_ERROR_RM_PASSERR,
	    AC_ERROR_RM_FULLUSER,
	    AC_ERROR_RM_INVALID,
	    AC_ERROR_RM_EXPIRE,
	    AC_ERROR_RM_REJECT,
	    AC_ERROR_RM_OWNERBEOUT,
	    AC_ERROR_RM_ENTERFAIL,
	    AC_ERROR_RM_ALREADIN,
	    AC_ERROR_RM_NOTIN,
	    AC_ERROR_STREAM_OLDPACK,
	    AC_ERROR_STREAM_SAMEPAK,
	    AC_ERROR_STREAM_PACKLOSS,
	    AC_ERROR_STREAM_MISTAKE,
	    AC_ERROR_STREAM_LACKBUFFER,
	    AC_ERROR_RM_PRINULL,
	    AC_ERROR_RM_REJECTPRI,
	    AC_ERROR_RM_PRIDENY,
	    AC_ERROR_RM_PRIREQIDERR,
	    AC_ERROR_RM_PRIALRCHAT,
	    AC_ERROR_RM_PRITIMEOUT,
	    AC_ERROR_RM_PRICHATBUSY,
	    AC_ERROR_RM_PRIUSERCLOSE,
	    AC_ERROR_RM_PRISELFCLOSE,
	    AC_ERROR_RM_PRIREQCANCEL,
	    AC_ERROR_VIDEOCALL_INCHAT,
	    AC_ERROR_MICLOSE_TIMEOUT,
	    AC_ERROR_MICLOSE_HIGHUSER,
	    AC_ERROR_COMMBUS_SELFMASTER,
	    AC_ERROR_COMMBUS_OTHERMASTER,
	    AC_ERROR_COMMBUS_LOWPRIORITY,
	    AC_ERROR_TRANSBUF_CREATEFAIL,
	    AC_ERROR_TRANSBUF_NOTASK,
	    AC_ERROR_TRANSFILE_OPENFAIL,
	    AC_ERROR_TRANSFILE_ZEROLEN,
	    AC_ERROR_TRANSFILE_TLARGE,
	    AC_ERROR_TRANSFILE_READFAIL,
	    AC_ERROR_TRANSFILE_DOWNLOADING,
	    AC_ERROR_TRANSFILE_FAILED,
	    AC_ERROR_TRANSFILE_NOTASK,
	    AC_ERROR_RECORD_NOTASK,
	    AC_ERROR_RECORD_CREATEFAIL,
	    AC_ERROR_RECORD_WAITINFO,
	    AC_ERROR_QUEUE_INVALID,
	    AC_ERROR_QUEUE_PREPARESERVICE,
	    AC_ERROR_WARNING_UDPFAIL,
	    AC_ERROR_WARNING_MISCUTILFAIL,
	    AC_ERROR_WARNING_MEDIAUTILFAIL,
	    AC_ERROR_WARNING_MEDIACOREFAIL,
	    AC_ERROR_WARNING_MEDIASHOWFAIL,
	    AC_ERROR_VIDEO_OPENFAIL,
	    AC_ERROR_VIDEO_UNKNOWFMT,
	    AC_ERROR_VIDEO_VIDIOC_G_FMT,
	    AC_ERROR_VIDEO_VIDIOC_S_FMT,
	    AC_ERROR_VIDEO_VIDIOC_G_PARM,
	    AC_ERROR_VIDEO_VIDIOC_S_PARM,
	    AC_ERROR_VIDEO_VIDIOC_QUERYCAP,
	    AC_ERROR_VIDEO_V4L2_CAP_VIDEO,
	    AC_ERROR_VIDEO_PREP_CAPBUFFER_FALL,
	    AC_ERROR_VIDEO_VIDIOC_REQBUFS,
	    AC_ERROR_VIDEO_VIDIOC_QUERYBUF,
	    AC_ERROR_VIDEO_MAP_FAILED,
	    AC_ERROR_VIDEO_VIDIOC_QBUF,
	    AC_ERROR_VIDEO_PREPBUF,
	    AC_ERROR_VIDEO_GETVIDEO_FAIL,
	    AC_ERROR_VIDEO_VIDIOC_DQBUF,
	    AC_ERROR_VIDEO_VIDIOC_STREAMON,
	    AC_ERROR_VIDEO_VIDIOC_STREAMOFF,
	    AC_ERROR_VIDEO_CAMERA_EBUSY,
	    AC_ERROR_VIDEO_UNSUPPORTMODE,
	    AC_ERROR_VIDEO_CAMERA_EINVAL,
	    AC_ERROR_AUDIO_OPENFAIL,
	    AC_ERROR_AUDIO_ALLOCHWPARAMS,
	    AC_ERROR_AUDIO_INTERLEAVED,
	    AC_ERROR_AUDIO_FORMAT,
	    AC_ERROR_AUDIO_SAMPLESPERSEC,
	    AC_ERROR_AUDIO_CHANNELS,
	    AC_ERROR_AUDIO_PERIODS,
	    AC_ERROR_AUDIO_BUFFERSIZE,
	    AC_ERROR_AUDIO_PARAMS,
	    AC_ERROR_AUDIO_BUFFERTIME,
	    AC_ERROR_AUDIO_BUFFERFRAME,
	    AC_ERROR_AUDIO_PERIODTIME,
	    AC_ERROR_AUDIO_PERIODFRAME,
	    AC_ERROR_AUDIO_ALLOCSWPARAMS,
	    AC_ERROR_AUDIO_START_THRESHOID,
	    AC_ERROR_AUDIO_START_AVAIL_MIN,
	    AC_ERROR_AUDIO_PCMPREPARE,
	    AC_ERROR_AUDIO_READFAIL,
	    AC_ERROR_AUDIO_CAPMODE,
	    AC_ERROR_PLAY_INVALIDSTREAM,
	    AC_ERROR_STREAM_SESSIONFAILED,
	    GV_ERR_PLUGINNOINSTALL,
	    GV_ERR_PLUGINOLDVERSION,
	    AC_ERROR_VIDEOCALL_CANCEL,
	    AC_ERROR_VIDEOCALL_OFFLINE,
	    AC_ERROR_VIDEOCALL_BUSY,
	    AC_ERROR_VIDEOCALL_REJECT,
	    AC_ERROR_VIDEOCALL_TIMEOUT,
	    AC_ERROR_VIDEOCALL_DISCONNECT,
	    AC_ERROR_VIDEOCALL_NOTINCALL,
	    AC_ERROR_OBJECT_EXISTAREA,
	    AC_ERROR_OBJECT_EXISTQUEUE,
	    AC_ERROR_APPID_DEFAULTNOTSUPPORT,
	    AC_ERROR_APPID_SIGNEED,
	    AC_ERROR_APPID_SIGFAILED,
	    AC_ERROR_APPID_NOTEXIST,
	    AC_ERROR_APPID_SYSLOCK,
	    AC_ERROR_APPID_NOTMATCH,
	    AC_ERROR_APPID_NOTCLOUDSERVER,
	    AC_ERROR_APPID_CHARGEMACHINELACK,
	    AC_ERROR_APPID_CHARGEMODECHANGE,
	    AC_ERROR_USERCFG_PASSWDLEN_SMALL,
	    AC_ERROR_USERCFG_USERNAME_SAME,
	    AC_ERROR_USERCFG_ACCESSLIMIT,
	    AC_ERROR_USERCFG_USERNAME_LIMIT,
	    AC_ERROR_LIVEUPDATE_BEGIN,
	    AC_ERROR_LIVEUPDATE_STOPING,
	    AC_ERROR_LIVEUPDATE_BACKUPING,
	    AC_ERROR_LIVEUPDATE_DELETEING,
	    AC_ERROR_LIVEUPDATE_COPYING,
	    AC_ERROR_LIVEUPDATE_STARTING,
	    AC_ERROR_LIVEUPDATE_RECOVERING,
	    AC_ERROR_LIVEUPDATE_ISTAGVER,
	    AC_ERROR_LIVEUPDATE_SERVICENEEDSTOP,
	    AC_ERROR_LIVEUPDATE_BACKUPFAIL,
	    AC_ERROR_LIVEUPDATE_DELETEFAIL,
	    AC_ERROR_LIVEUPDATE_COPYFAIL,
	    AC_ERROR_LIVEUPDATE_RECOVERYFAIL,
	    AC_ERROR_LIVEUPDATE_BRIDGENOTREGISTER,
	    AC_ERROR_LIVEUPDATE_WRITECONFIGFILEFAILED,
	    AC_ERROR_LIVEUPDATE_CANTGETBACKUPDIR,
	    AC_ERROR_LIVEUPDATE_FINISH,
	    AC_ERROR_LIVEUPDATE_UNABLETOGETMAINTAINIFO,
	    AC_ERROR_LIVEUPDATE_NOTRENAMEDIR,
	    AC_ERROR_STOPPROCESS_TIMEOUT,
	    AC_ERROR_STOPPROCESS_FAIL,
	    AC_ERROR_STOPPROCESS_FORCEFAIL,
	    AC_ERROR_STARTPROCESS_TIMEOUT,
	    AC_ERROR_SERVICE_CONTROLLED,
	    AC_ERROR_SERVICE_EXISTELSEVER,
	    AC_ERROR_SERVICE_NOTSUPPORT,
	    AC_ERROR_NONEXISTENCE_THE_VERSION,
	    AC_ERROR_NONEXISTENCE_THE_SERVICE,
	    AC_ERROR_ILLEGAL_EXTRA_CONFIG,
	    AC_ERROR_MOVETEMPFILE_FAIL,
	    AC_ERROR_INCOMPATIBLE_CURRENT_PLATFORM,
	    AC_ERROR_GETRT_CONNECT_FAIL,
	    AC_ERROR_BUSINESS_PARAM_INVALID,
	    AC_ERROR_BUSINESS_APPID_NOTEXIST,
	    AC_ERROR_BUSINESS_BODY_INVALID,
	    AC_ERROR_BUSINESS_SIGVERIFYFAIL,
	    AC_ERROR_BUSINESS_SIGTIMEINVALID,
	    AC_ERROR_BUSINESS_MEMORYFAIL,
	    AC_ERROR_BUSINESS_EXCEPTION,
	    AC_ERROR_BUSINESS_PROTOCOLFAIL,
	    AC_ERROR_BUSINESS_TIMEOUT,
	    AC_ERROR_BUSINESS_FILENOEXIST,
	    AC_ERROR_DB_EXECUTE_ERROR,
	    AC_ERROR_DB_SELECT_NODATA,
	    AC_ERROR_DB_FETCH_ERROR,
	    AC_ERROR_DB_EXCEPTION,
	    AC_ERROR_DB_CONNECT_ERROR,
	    AC_ERROR_PPTHELPER_INVALIAD_URL,
	    AC_ERROR_PPTHELPER_RETURNED_ERROR,
	    AC_ERROR_PPTHELPER_COULDNT_CONNECT,
	    AC_ERROR_AI_ABILITY_AIROBOTIDEXIST ,
	    AC_ERROR_AI_ABILITY_AITASKIDEXIST ,
	    AC_ERROR_AI_ABILITY_AIOBJNOTEXIST,
	    AC_ERROR_AI_ABILITY_PARAMINVALID,
	    AC_ERROR_AI_ABILITY_FUNCTIONNOTSUPPORT,
	    AC_ERROR_AI_ABILITY_UNKNOWAIFUNCTION,
	    AC_ERROR_AI_ABILITY_HTTPREQUESTFAIL,
	    AC_ERROR_AI_ABILITY_AIREQUESTINITFAIL,
	    AC_ERROR_AI_ABILITY_AIREQUESTFAIL,
	    AC_ERROR_AI_ABILITY_AIREQUESTTIMEOUT ,
	    AC_ERROR_AI_ABILITY_AITHREADDATAINVALID ,
	    AC_ERROR_AI_ABILITY_AITHREADOBJINVALID ,
	    AC_ERROR_AI_ABILITY_AIRELATEDATAINVALID ,
	    AC_ERROR_AI_ABILITY_HEARTBEATTIMEOUT ,
	    AC_ERROR_AI_ABILITY_ROBOTOFFLINE ,
	    AC_ERROR_AI_ABILITY_CONTENTOVERLENGTH ,
	    AC_ERROR_AI_ABILITY_COMMANDOVERLENGTH ,
	    AC_ERROR_AI_ABILITY_AIOVERCUNCURRENCY ,
	    AC_ERROR_AI_ABILITY_MEDIAPARAMINVALID ,
	    AC_ERROR_AI_ABILITY_REQUESTIDEXIST ,
	    AC_ERROR_AI_ABILITY_ABNORMALERROR,
	    AC_ERROR_RECORD_TAG_PARAMINVALID,
	    AC_ERROR_RECORD_TAG_NOTSTART,
	    AC_ERROR_RECORD_TAG_NOTEXIST,
	    AC_ERROR_RECORD_TAG_TASKIDEXIST
	];

	var errorObjMap;

	try {
	    errorObjMap = new Map();
	    for (var errorObj in errorObjList) {
	        errorObjMap.set(errorObjList[errorObj].errorCode, errorObjList[errorObj].errorMsg);
	    }
	} catch (e) {

	}

	function checkErrorMsg(errorCode) {
	    if (errorObjMap) {
	        return errorObjMap.get(errorCode);
	    } else {
	        for (var errorObj in errorObjList) {
	            if (errorObjList[errorObj].errorCode == errorCode) {
	                return errorObjList[errorObj].errorMsg;
	            }
	        }
	    }
	}

	exports.checkErrorMsg = checkErrorMsg;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	/*-----------------------------------------------------------
	 * AnyChat??????????????????
	 * ????????????:AnyChat??????????????????????????????????????????
	 *
	 *
	 * ----------------------------------------------------------
	 */
	//??????log4js
	var log4js = __webpack_require__(1);
	var logger = log4js.getLogger("AnyChatSDKAreaHandler");
	var AnyChatSDKConstant = __webpack_require__(2);
	var AnyChatSDKErrorCode = __webpack_require__(5);
	var AnyChatSDKUserHandler = __webpack_require__(4);
	var AnyChatSDKQueueHandler = __webpack_require__(7);
	var CONSTANT = AnyChatSDKConstant.instance;

	// ???????????????????????????
	function AnyChatSDKAreaHandler() {
	    this.agentStatus = 0; //???????????????0--??????  1--?????????  2--?????????  3--????????????  10--??????
	    this.currentAgentID; //????????????ID
	    this.areaId; //???????????????ID

	    this.areaIdArray = [];
	    this.areaIdIndex = 0;
	}

	AnyChatSDKAreaHandler.prototype = {
	    constructor: AnyChatSDKAreaHandler,
	    //???????????????
	    inArea: function(anychatSDKInstance, opt) {
	        var _sdk = anychatSDKInstance;
	        if (_sdk.curConnectStatus == CONSTANT.ConnectStatus.OFFLINE) {
	            return;
	        }
	        var errorCode = enterArea({
	            areaId: opt.areaId
	        });
	        if (errorCode == 0) {
	            this.areaId = opt.areaId;
	        }
	        return errorCode;
	    },
	    //???????????????
	    outArea: function(anychatSDKInstance) {
	        var _sdk = anychatSDKInstance;
	        if (_sdk.curConnectStatus == CONSTANT.ConnectStatus.OFFLINE) {
	            return;
	        }
	        var errorCode = leaveArea({
	            areaId: this.areaId
	        });
	        if (errorCode == 0) {
	            this.areaId = "";
	        }
	        return errorCode;
	    },
	    getAreas: function() {
	        return getAreaData({
	            userId: AnyChatSDKUserHandler.instance.userId
	        });
	    },
	    agentServiceCtrl: function(anychatSDKInstance, opt) {
	        var _sdk = anychatSDKInstance;
	        if (_sdk.curConnectStatus == CONSTANT.ConnectStatus.OFFLINE) {
	            return;
	        }
	        var statusCode = 0;
	        switch (opt.ctrlCode) {
	            case 0:
	                statusCode = 1;
	                break;
	            case 1:
	                statusCode = 0;
	                break;
	            case 2:
	                statusCode = 3;
	                break;
	            case 3:
	                statusCode = 100105;
	                break;
	            case 4:
	                statusCode = 4;
	                break;
	        }
	        var errorCode = agentStatusCtrl({
	            userId: AnyChatSDKUserHandler.instance.userId,
	            ctrlCode: statusCode
	        });
	        var result = {
	            code: errorCode,
	            msg: AnyChatSDKErrorCode.checkErrorMsg(errorCode)
	        };
	        _sdk.eventTarget.fireEvent({
	            type: "onServiceCtrlDone",
	            result: result
	        });
	        return errorCode;
	    },
	    getAgentStatus: function() {
	        var data = {};
	        data.serviceUserCount = getServiceUserCount({ userId: AnyChatSDKUserHandler.instance.userId });
	        data.serviceBeginTime = getServiceBeginTime({ userId: AnyChatSDKUserHandler.instance.userId });
	        data.serviceTotalTime = getServiceTotalTime({ userId: AnyChatSDKUserHandler.instance.userId });
	        return data;
	    },
	    getAgentCount: function(opt) {
	        return getAgentCount(opt);
	    },
	    getIdleAgentCount: function(opt) {
	        return getIdleAgentCount(opt);
	    },
	    getAreaQueueUserCount:function(opt){
	        return getAreaQueueUserCount(opt);
	    }
	};

	/*
	???????????????????????????
	*/
	// ?????????????????????????????????
	function getAreaData(params) {
	    var erroCode = BRAC_ObjectControl(ANYCHAT_OBJECT_TYPE_AREA, ANYCHAT_INVALID_OBJECT_ID, ANYCHAT_OBJECT_CTRL_SYNCDATA, params.userId, 0, 0, 0, "");
	    return erroCode;
	}

	// ???????????????
	function enterArea(params) {
	    var errorCode = BRAC_ObjectControl(ANYCHAT_OBJECT_TYPE_AREA, params.areaId, ANYCHAT_AREA_CTRL_USERENTER, 0, 0, 0, 0, "");
	    return errorCode;
	}

	// ???????????????
	function leaveArea(params) {
	    var errorCode = BRAC_ObjectControl(ANYCHAT_OBJECT_TYPE_AREA, params.areaId, ANYCHAT_AREA_CTRL_USERLEAVE, 0, 0, 0, 0, "");
	    return errorCode;
	}

	// ?????????????????????
	function getAreaName(params) {
	    var areaName = BRAC_ObjectGetStringValue(ANYCHAT_OBJECT_TYPE_AREA, params.areaId, ANYCHAT_OBJECT_INFO_NAME);
	    return areaName;
	}

	// ?????????????????????
	function getAreaDescription(params) {
	    var areaDescription = BRAC_ObjectGetStringValue(ANYCHAT_OBJECT_TYPE_AREA, params.areaId, ANYCHAT_OBJECT_INFO_DESCRIPTION);
	    return areaDescription;
	}


	/*
	?????????????????????
	*/
	// ????????????
	function agentStatusCtrl(params) {
	    var errorCode = 0;
	    if (AnyChatSDKQueueHandler.instance.isAutoMode == 1) {
	        if(params.ctrlCode == 100105)  {
	            BRAC_ObjectControl(ANYCHAT_OBJECT_TYPE_AGENT, params.userId, ANYCHAT_AGENT_CTRL_FINISHSERVICE, params.ctrlCode, 0, 0, 0, "");
	            errorCode = BRAC_ObjectControl(ANYCHAT_OBJECT_TYPE_AGENT, params.userId, ANYCHAT_AGENT_CTRL_SERVICESTATUS, 0, 0, 0, 0, "");
	        } else {
	        errorCode = BRAC_ObjectControl(ANYCHAT_OBJECT_TYPE_AGENT, params.userId, ANYCHAT_AGENT_CTRL_SERVICESTATUS, params.ctrlCode, 0, 0, 0, "");
	        }
	        return errorCode;
	    } else {
	        if (params.ctrlCode == 1) {
	            errorCode = BRAC_ObjectControl(ANYCHAT_OBJECT_TYPE_AGENT, params.userId, ANYCHAT_AGENT_CTRL_SERVICEREQUEST, 0, 0, 0, 0, "");
	            return errorCode;
	        } else if (params.ctrlCode == 0) {
	            errorCode = BRAC_ObjectControl(ANYCHAT_OBJECT_TYPE_AGENT, params.userId, ANYCHAT_AGENT_CTRL_FINISHSERVICE, 0, 0, 0, 0, "");
	            return errorCode;
	        }
	    }
	}

	// ??????????????????????????????
	function getServiceUserCount(params) {
	    var serviceUserCount = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_AGENT, params.userId, ANYCHAT_AGENT_INFO_SERVICETOTALNUM);
	    return serviceUserCount;
	}

	// ??????????????????????????????
	function getServiceBeginTime(params) {
	    var serviceBeginTime = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_AGENT, params.userId, ANYCHAT_AGENT_INFO_SERVICEBEGINTIME);
	    return serviceBeginTime;
	}

	// ????????????????????????
	function getServiceTotalTime(params) {
	    var serviceTotalTime = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_AGENT, params.userId, ANYCHAT_AGENT_INFO_SERVICETOTALTIME);
	    return serviceTotalTime;
	}

	// ????????????????????????
	function getAgentServiceStatus(params) {
	    var agentServiceStatus = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_AGENT, params.userId, ANYCHAT_AGENT_INFO_SERVICESTATUS);
	    return agentServiceStatus;
	}


	/*
	?????????????????????
	*/
	// ??????????????????
	function getQueueList() {
	    var queueList = BRAC_ObjectGetIdList(ANYCHAT_OBJECT_TYPE_QUEUE);
	    return queueList;
	}

	//?????????????????????????????????
	function getAgentCount(params) {
	    return BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_AREA, params.areaId, ANYCHAT_AREA_INFO_AGENTCOUNT);
	}

	//????????????????????????????????????
	function getIdleAgentCount(params) {
	    return BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_AREA, params.areaId, ANYCHAT_AREA_INFO_IDLEAGENTCOUNT);
	}

	//???????????????????????????????????????
	function getAreaQueueUserCount(params) {
	    return BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_AREA, params.areaId, ANYCHAT_AREA_INFO_QUEUEUSERCOUNT);
	}

	var instance = new AnyChatSDKAreaHandler();

	exports.instance = instance;
	exports.getAreaName = getAreaName;
	exports.getAreaDescription = getAreaDescription;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	/*-----------------------------------------------------------
	 * AnyChat???????????????
	 * ????????????:AnyChat???????????????????????????????????????
	 *
	 *
	 * ----------------------------------------------------------
	 */
	//??????log4js
	var log4js = __webpack_require__(1);
	var logger = log4js.getLogger("AnyChatSDKQueueHandler");
	var AnyChatSDKConstant = __webpack_require__(2);
	var CONSTANT = AnyChatSDKConstant.instance;

	// ???????????????????????????
	function AnyChatSDKQueueHandler() {
	    this.isAutoMode = 1;
	    this.isGlobal = 0;
	    this.name; //????????????
	    this.priority = 5;
	    this.attribute = -1;
	    this.currentQueueId = "";
	    this.waitingTimer;
	}

	AnyChatSDKQueueHandler.prototype = {
	    constructor: AnyChatSDKQueueHandler,
	    //?????????
	    inQueue: function(anychatSDKInstance, opt) {
	        var _sdk = anychatSDKInstance;
	        if (_sdk.curConnectStatus == CONSTANT.ConnectStatus.OFFLINE) {
	            return;
	        }
	        var timeout = 0;
	        if (opt.hasOwnProperty("timeout")) {
	            timeout = opt.timeout;
	        }
	        var errorCode = enterQueue({
	            queueId: opt.queueId,
	            timeout: timeout
	        });
	        if (errorCode == 0) {
	            this.currentQueueId = opt.queueId;
	        }
	        return errorCode;
	    },
	    //????????????
	    outQueue: function(anychatSDKInstance) {
	        var _sdk = anychatSDKInstance;
	        if (_sdk.curConnectStatus == CONSTANT.ConnectStatus.OFFLINE) {
	            return;
	        }
	        var errorCode = leaveQueue({
	            queueId: this.currentQueueId
	        });
	        return errorCode;
	    },
	    //??????
	    jumpQueue: function(anychatSDKInstance) {

	    },
	    //??????????????????
	    getQueueTime: function(params) {
	        return getQueueTime(params);
	    },
	    //??????????????????
	    getQueueLength: function(params) {
	        return getQueueLength(params);
	    },
	    //?????????????????????
	    getQueuePos: function(params) {
	        return getQueuePos(params);
	    },
	    //???????????????????????????????????????
	    getQueueUserInfo:function(params){
	        return getQueueUserInfo(params);
	    }
	};

	// ??????????????????
	function enterQueue(params) {
	    var errorCode = BRAC_ObjectControl(ANYCHAT_OBJECT_TYPE_QUEUE, params.queueId, ANYCHAT_QUEUE_CTRL_USERENTER, params.timeout, 0, 0, 0, "");
	    return errorCode;
	}

	// ??????????????????
	function leaveQueue(params) {
	    var errorCode = BRAC_ObjectControl(ANYCHAT_OBJECT_TYPE_QUEUE, params.queueId, ANYCHAT_QUEUE_CTRL_USERLEAVE, 0, 0, 0, 0, "");
	    return errorCode;
	}

	// ???????????????
	function getQueueName(params) {
	    var queueName = BRAC_ObjectGetStringValue(ANYCHAT_OBJECT_TYPE_QUEUE, params.queueId, ANYCHAT_OBJECT_INFO_NAME);
	    return queueName;
	}

	// ??????????????????
	function getQueueInfo(params) {
	    var queueInfo = BRAC_ObjectGetStringValue(ANYCHAT_OBJECT_TYPE_QUEUE, params.queueId, ANYCHAT_OBJECT_INFO_DESCRIPTION);
	    return queueInfo;
	}

	// ????????????????????????
	function getQueueLength(params) {
	    var queueLength = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_QUEUE, params.queueId, ANYCHAT_QUEUE_INFO_LENGTH);
	    return queueLength;
	}

	// ?????????????????????????????????
	function getQueuePos(params) {
	    var beforeUserNum = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_QUEUE, params.queueId, ANYCHAT_QUEUE_INFO_BEFOREUSERNUM);
	    beforeUserNum = beforeUserNum < 0 ? 0 : beforeUserNum;
	    return beforeUserNum++;
	}

	// ????????????????????????????????????
	function getQueueTime(params) {
	    var seconds = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_QUEUE, params.queueId, ANYCHAT_QUEUE_INFO_WAITTIMESECOND);
	    return seconds;
	}

	//???????????????????????????????????????
	function getQueueUserInfo(params){
	    var userInfo = BRAC_ObjectGetStringValue(ANYCHAT_OBJECT_TYPE_QUEUE, params.queueId, ANYCHAT_QUEUE_INFO_USERINFOLIST);
	    var userArr=[];
	    if(userInfo){
	        var userObj=JSON.parse(userInfo);
	        var queuelength=userObj.queuelength;
	        if(queuelength>0){
	            for(var i=0;i<queuelength;i++){
	                var obj={
	                    'entertime':userObj.entertimelist[i], //???????????????????????????
	                    'strid':userObj.stridlist[i],  //struserid
	                    'userid':userObj.useridlist[i], //userid
	                    'username':userObj.usernamelist[i], //?????????
	                }
	                userArr.push(obj);
	            }
	        }
	    }
	    return userArr;
	}
	AnyChatSDKQueueHandler.prototype.callbackFunctionRegister = function(AnyChatSDK, option) {

	    if (typeof option.queueOpt === "object") {
	        typeof(option.queueOpt.onAreaChanged) === "function" && AnyChatWebSDK.anychatSDKInstance.setCallBack("onAreaChanged", option.queueOpt.onAreaChanged, false);
	        typeof(option.queueOpt.onQueueChanged) === "function" && AnyChatWebSDK.anychatSDKInstance.setCallBack("onQueueChanged", option.queueOpt.onQueueChanged, false);
	        typeof(option.queueOpt.onServiceNotify) === "function" && AnyChatWebSDK.anychatSDKInstance.setCallBack("onServiceNotify", option.queueOpt.onServiceNotify, false);
	        typeof(option.queueOpt.onElseAgentStatusChanged) === "function" && AnyChatWebSDK.anychatSDKInstance.setCallBack("onElseAgentStatusChanged", option.queueOpt.onElseAgentStatusChanged, false);
	        typeof (option.queueOpt.onLeaveQueue) === "function" && AnyChatWebSDK.anychatSDKInstance.setCallBack("onLeaveQueue", option.queueOpt.onLeaveQueue, false);
	        typeof (option.queueOpt.OnQueueUserInfoChanged) === "function" && AnyChatWebSDK.anychatSDKInstance.setCallBack("OnQueueUserInfoChanged", option.queueOpt.OnQueueUserInfoChanged, false);
	    }
	};


	var instance = new AnyChatSDKQueueHandler();

	exports.instance = instance;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	/*-----------------------------------------------------------
	 * AnyChatSDKEventDispatcher
	 * ????????????:AnyChat???????????????????????????
	 * 
	 * 
	 * ----------------------------------------------------------
	 */
	var AnyChatSDKConstant = __webpack_require__(2);
	var AnyChatSDKEventTarget = __webpack_require__(3);
	var AnyChatSDKFileHandler = __webpack_require__(9);
	var AnyChatSDKUserHandler = __webpack_require__(4);
	var AnyChatSDKQueueHandler = __webpack_require__(7);
	var AnyChatSDKAreaHandler = __webpack_require__(6);
	var AnyChatSDKErrorCode = __webpack_require__(5);
	var AnyChatSDKVideoCallHandler = __webpack_require__(10);
	var AnyChatSDKFriendHandler = __webpack_require__(11);
	var AnyChatSDKStreamPlayHandler = __webpack_require__(12);
	var log4js = __webpack_require__(1);
	var logger = log4js.getLogger("AnyChatSDKEventDispatcher");
	var CONSTANT = AnyChatSDKConstant.instance;

	var getStrUserId = AnyChatSDKUserHandler.getStrUserId;

	var receiveCallFlag = 0;


	//??????????????????
	function AnyChatSDKEventDispatcher() {
	    // ??????????????????????????????
	    this.handlers = {};
	    this.eventTarget = AnyChatSDKEventTarget.instance;
	    this.constant = AnyChatSDKConstant.instance;
	    this.anychatSDKInstance = null;
	    this.roomId = null;
		
		window.OnAnyChatNotifyMessage     = OnAnyChatNotifyMessage;
		window.OnAnyChatTextMessage       = OnAnyChatTextMessage;
		window.OnAnyChatTransBuffer       = OnAnyChatTransBuffer;
		window.OnAnyChatTransBufferEx     = OnAnyChatTransBufferEx;
		window.OnAnyChatTransFile         = OnAnyChatTransFile;
		window.OnAnyChatVolumeChange      = OnAnyChatVolumeChange;
		window.OnAnyChatSDKFilterData     = OnAnyChatSDKFilterData;
		window.OnAnyChatVideoCallEvent   = OnAnyChatVideoCallEvent;
		window.OnAnyChatRecordSnapShot    = OnAnyChatRecordSnapShot;
		window.OnAnyChatRecordSnapShotEx  = OnAnyChatRecordSnapShotEx;
		window.OnAnyChatRecordSnapShotEx2 = OnAnyChatRecordSnapShotEx2;
		window.OnAnyChatCoreSDKEvent      = OnAnyChatCoreSDKEvent;
		window.OnAnyChatObjectEvent       = OnAnyChatObjectEvent;
	}

	// ??????????????????????????????
	AnyChatSDKEventDispatcher.prototype = {
	    // ???????????????????????????
	    constructor: AnyChatSDKEventDispatcher,

	    callbackinit: function(anychatSDKInstance, anychat) {
	        this.anychatSDKInstance = anychatSDKInstance;
	    //     if (typeof(this.OnAnyChatNotifyMessage) == "function")
	    //         BRAC_RegisterCallBack(anychat, 'OnNotifyMessage', this.OnAnyChatNotifyMessage);
	    //     if (typeof(OnAnyChatTextMessage) == "function")
	    //         BRAC_RegisterCallBack(anychat, 'OnTextMessage', OnAnyChatTextMessage);
	    //     if (typeof(OnAnyChatTransBuffer) == "function")
	    //         BRAC_RegisterCallBack(anychat, 'OnTransBuffer', OnAnyChatTransBuffer);
	    //     if (typeof(OnAnyChatTransBufferEx) == "function")
	    //         BRAC_RegisterCallBack(anychat, 'OnTransBufferEx', OnAnyChatTransBufferEx);
	    //     if (typeof(OnAnyChatTransFile) == "function")
	    //         BRAC_RegisterCallBack(anychat, 'OnTransFile', OnAnyChatTransFile);
	    //     if (typeof(OnAnyChatVolumeChange) == "function")
	    //         BRAC_RegisterCallBack(anychat, 'OnVolumeChange', OnAnyChatVolumeChange);
	    //     if (typeof(OnAnyChatSDKFilterData) == "function")
	    //         BRAC_RegisterCallBack(anychat, 'OnSDKFilterData', OnAnyChatSDKFilterData);
	    //     if (typeof(OnAnyChatVideoCallEvent) == "function")
	    //         BRAC_RegisterCallBack(anychat, 'OnVideoCallEvent', OnAnyChatVideoCallEvent);
	    //     if (typeof(OnAnyChatRecordSnapShot) == "function")
	    //         BRAC_RegisterCallBack(anychat, 'OnRecordSnapShot', OnAnyChatRecordSnapShot);
	    //     if (typeof(OnAnyChatRecordSnapShotEx) == "function" && bSupportStreamRecordCtrlEx)
	    //         BRAC_RegisterCallBack(anychat, 'OnRecordSnapShotEx', OnAnyChatRecordSnapShotEx);
	    //     if (typeof(OnAnyChatRecordSnapShotEx2) == "function" && bSupportCluster)
	    //         BRAC_RegisterCallBack(anychat, 'OnRecordSnapShotEx2', OnAnyChatRecordSnapShotEx2);
	    //     if (typeof(OnAnyChatCoreSDKEvent) == "function" && CUR_ANYCHAT_PLUGIN_VAR >= "1.0.6.0")
	    //         BRAC_RegisterCallBack(anychat, 'OnAnyChatCoreSDKEvent', OnAnyChatCoreSDKEvent);
	    //     if (typeof(this.OnAnyChatObjectEvent) == "function" && bSupportObjectBusiness)
	    //         BRAC_RegisterCallBack(anychat, 'OnObjectEvent', this.OnAnyChatObjectEvent);
	    }
	};
	 function h5On(anychatSDKInstance, anychat) {
	        this.anychatSDKInstance = anychatSDKInstance;

	        if (typeof(this.OnAnyChatNotifyMessage) == "function")
	            anychat.on("OnNotifyMessage", this.OnAnyChatNotifyMessage);
	        if (typeof(OnAnyChatVideoCallEvent) == "function")
	            anychat.on("OnVideoCallEvent", OnAnyChatVideoCallEvent);
	        if (typeof(OnAnyChatTransBuffer) == "function")
	            anychat.on("OnTransBuffer", OnAnyChatTransBuffer);
	        if (typeof(OnAnyChatTextMessage) == "function")
	            anychat.on("OnTextMessage", OnAnyChatTextMessage);
	        if (typeof(this.OnAnyChatObjectEvent) == "function")
	            anychat.on("OnObjectEvent", this.OnAnyChatObjectEvent);
	        if (typeof (OnAnyChatTransBufferEx) == "function")
				anychat.on("OnTransBufferex", OnAnyChatTransBufferEx);
	    }

	function OnAnyChatNotifyMessage(dwNotifyMsg, wParam, lParam) {
	        switch (dwNotifyMsg) {
	            case WM_GV_CONNECT:
	                OnAnyChatConnect(wParam, lParam);
	                break;
	            case WM_GV_LOGINSYSTEM:
	                OnAnyChatLoginSystem(wParam, lParam);
	                break;
	            case WM_GV_ENTERROOM:
	                OnAnyChatEnterRoom(wParam, lParam);
	                break;
	            case WM_GV_ONLINEUSER:
	                OnAnyChatRoomOnlineUser(wParam, lParam);
	                break;
	            case WM_GV_USERATROOM:
	                OnAnyChatUserAtRoom(wParam, lParam);
	                break;
	            case WM_GV_LINKCLOSE:
	                OnAnyChatLinkClose(wParam, lParam);
	                break;
	            case WM_GV_MICSTATECHANGE:
	                OnAnyChatMicStateChange(wParam, lParam);
	                break;
	            case WM_GV_CAMERASTATE:
	                OnAnyChatCameraStateChange(wParam, lParam);
	                break;
	            case WM_GV_P2PCONNECTSTATE:
	                OnAnyChatP2PConnectState(wParam, lParam);
	                break;
	            case WM_GV_PRIVATEREQUEST:
	                OnAnyChatPrivateRequest(wParam, lParam);
	                break;
	            case WM_GV_PRIVATEECHO:
	                OnAnyChatPrivateEcho(wParam, lParam);
	                break;
	            case WM_GV_PRIVATEEXIT:
	                OnAnyChatPrivateExit(wParam, lParam);
	                break;
	            case WM_GV_USERINFOUPDATE:
	                OnAnyChatUserInfoUpdate(wParam, lParam);
	                break;
	            case WM_GV_FRIENDSTATUS:
	                OnAnyChatFriendStatus(wParam, lParam);
	                break;
	            case WM_GV_VIDEOSIZECHG:
	                OnAnyChatVideoSizeChange(wParam, lParam);
	                break;
	            default:
	                break;
	        }
	    }

	    function OnAnyChatObjectEvent(dwObjectType, dwObjectId, dwEventType, dwParam1, dwParam2, dwParam3, dwParam4, strParam) {
	        console.log("OnAnyChatObjectEvent dwEventType: " + dwEventType);
	        switch (dwEventType) {
	            case ANYCHAT_OBJECT_EVENT_UPDATE:
	                OnAnyChatObjectUpdate(dwObjectType, dwObjectId);
	                break;
	            case ANYCHAT_OBJECT_EVENT_SYNCDATAFINISH:
	                OnAnyChatObjectSyncDataFinish(dwObjectType, dwObjectId);
	                break;
	            case ANYCHAT_AREA_EVENT_ENTERRESULT:
	                OnAnyChatEnterAreaResult(dwObjectType, dwObjectId, dwParam1);
	                break;
	            case ANYCHAT_AREA_EVENT_LEAVERESULT:
	                OnAnyChatLeaveAreaResult(dwObjectType, dwObjectId, dwParam1);
	                break;
	            case ANYCHAT_AREA_EVENT_STATUSCHANGE:
	                OnAnyChatAreaStatusChange(dwObjectType, dwObjectId, dwParam1);
	                break;
	            case ANYCHAT_QUEUE_EVENT_STATUSCHANGE:
	                OnAnyChatQueueStatusChanged(dwObjectType, dwObjectId);
	                break;
	            case ANYCHAT_QUEUE_EVENT_ENTERRESULT:
	                OnAnyChatEnterQueueResult(dwObjectType, dwObjectId, dwParam1);
	                break;
	            case ANYCHAT_QUEUE_EVENT_LEAVERESULT:
	                OnAnyChatLeaveQueueResult(dwObjectType, dwObjectId, dwParam1);
	                break;
	            case ANYCHAT_QUEUE_EVENT_USERINFOLISTCHG:
	                OnAnyChatQueueUserInfoChanged(dwObjectType, dwObjectId, dwEventType, dwParam1, dwParam2, dwParam3, dwParam4, strParam);
	                break;
	            case ANYCHAT_AGENT_EVENT_STATUSCHANGE:
	                OnAnyChatAgentStatusChanged(dwObjectType, dwObjectId, dwParam1);
	                break;
	            case ANYCHAT_AGENT_EVENT_SERVICENOTIFY:
	                OnAnyChatServiceStart(dwParam1, dwParam2, dwParam3);
	                break;
	            case ANYCHAT_AGENT_EVENT_WAITINGUSER:
	                OnAnyChatAgentWaitingUser();
	                break;
	            case ANYCHAT_AGENT_EVENT_ISREADY:
	                OnAnyChatAgentprepared(dwParam1, dwParam2, dwParam3);
	                break;
	            default:
	                break;
	        }
	    }

	function OnAnyChatConnect(wParam, lParam) {
	    logger.callbackLog("Connect", lParam);
	    if (lParam != 0) {
	        //lParam = 101;
	        var result = {
	            code: lParam,
	            msg: AnyChatSDKErrorCode.checkErrorMsg(lParam)
	        };
	        instance.eventTarget.fireEvent({
	            type: "onDisConnect",
	            result: result
	        });
	    }
		// else {
	 //        instance.anychatSDKInstance.login();
	 //    }

	}

	function OnAnyChatLoginSystem(wParam, lParam) {

	    if (lParam == 0) {
	        instance.anychatSDKInstance.curConnectStatus = CONSTANT.ConnectStatus.OPEN;
	    }

	    AnyChatSDKUserHandler.instance.userId = wParam;
	    var strUserId = getStrUserId(wParam);
	    if (strUserId == "") {
	        strUserId = wParam;
	        AnyChatSDKUserHandler.instance.isSupportEx = false;
	    }
	    if (!bSupportScriptObject)
	        instance.anychatSDKInstance.strUserId = strUserId;

	    var dwAgentFlags = -1; //????????????
	    if (lParam == 0) {

	        switch (AnyChatSDKUserHandler.instance.userType) {
	            case ANYCHAT_OBJECT_FLAGS_CLIENT:
	                dwAgentFlags = 0; //????????????
	                //mCurrentStatus = CLIENT_STATUS_AREA;
	                break;
	            case ANYCHAT_OBJECT_FLAGS_AGENT:
	                AnyChatSDKAreaHandler.instance.currentAgentID = wParam;
	                dwAgentFlags = ANYCHAT_OBJECT_FLAGS_AGENT+ANYCHAT_OBJECT_FLAGS_QUEUEUSERLIST;  // ????????????

	                if (AnyChatSDKQueueHandler.instance.isAutoMode == 1) {
	                    dwAgentFlags = dwAgentFlags + ANYCHAT_OBJECT_FLAGS_AUTOMODE; //????????????
	                }
	                if (AnyChatSDKQueueHandler.instance.isGlobal == 1) {
	                    dwAgentFlags = dwAgentFlags + ANYCHAT_OBJECT_FLAGS_GLOBAL; //????????????
	                }

	            default:
	                break;
	        }

	        if (dwAgentFlags != -1) {
	            var dwPriority = AnyChatSDKQueueHandler.instance.priority;

	            //?????????????????????
	            var dwAttribute = AnyChatSDKQueueHandler.instance.attribute ? AnyChatSDKQueueHandler.instance.attribute : "";

	            //??????????????????
	            // dwAttribute = "";
	            // var queueGroupValue = [2001];
	            // dwAttribute = { queuegroups: queueGroupValue };

	            //??????????????????
	            BRAC_SetSDKOption(BRAC_SO_OBJECT_INITFLAGS, dwAgentFlags);

	            if (dwAgentFlags == 0) {
	                //??????????????????????????????
	                BRAC_ObjectSetValue(ANYCHAT_OBJECT_TYPE_CLIENTUSER, wParam, ANYCHAT_OBJECT_INFO_PRIORITY, dwPriority);
	                var dwAttributeClient = -1;
	                BRAC_ObjectSetValue(ANYCHAT_OBJECT_TYPE_CLIENTUSER, wParam, ANYCHAT_OBJECT_INFO_ATTRIBUTE, dwAttributeClient);
	            } else {
	                BRAC_ObjectSetValue(ANYCHAT_OBJECT_TYPE_CLIENTUSER, wParam, ANYCHAT_OBJECT_INFO_PRIORITY, dwPriority);
					if(AnyChatSDKQueueHandler.instance.isGlobalAgent == 1){
						BRAC_ObjectSetValue(ANYCHAT_OBJECT_TYPE_CLIENTUSER, wParam, ANYCHAT_OBJECT_INFO_ATTRIBUTE, -1);
					}
	                BRAC_ObjectSetValue(ANYCHAT_OBJECT_TYPE_CLIENTUSER, AnyChatSDKUserHandler.instance.userId, ANYCHAT_OBJECT_INFO_STRINGTAG, AnyChatSDKQueueHandler.instance.attribute);
	            }
	        }
	        var result = {
	            code: lParam,
	            msg: AnyChatSDKErrorCode.checkErrorMsg(lParam)
	        };
	        var data = {
	            userId: strUserId
	        };
	        //?????????????????????
	        var IMAGE_FILTER_TYPE_BACKGROUND_OBS = 0x10;
	        var szControlJson = "{\"filtertype\":" + IMAGE_FILTER_TYPE_BACKGROUND_OBS + "}";
	        BRAC_SDKControl( ANYCHAT_SDKCTRL_MEDIAFILTERINIT, szControlJson );
	        instance.eventTarget.fireEvent({
	            type: "onLogin",
	            data: data
	        });
	    } else {
	        var result = {
	            code: lParam,
	            msg: AnyChatSDKErrorCode.checkErrorMsg(lParam)
	        };
	        instance.eventTarget.fireEvent({
	            type: "onDisConnect",
	            result: result
	        });
	    }

	    logger.callbackLog("LoginSystem", lParam, data);

	}

	function OnAnyChatLinkClose(wParam, lParam) {
	    var result = {
	        code: lParam,
	        msg: AnyChatSDKErrorCode.checkErrorMsg(lParam)
	    };
	    instance.eventTarget.fireEvent({
	        type: "onDisConnect",
	        result: result
	    });
	    instance.anychatSDKInstance.curConnectStatus = CONSTANT.ConnectStatus.OFFLINE;
	    if (instance.eventTarget.doneHandlers.length > 0) {
	        for (var i = 0; i < instance.eventTarget.doneHandlers.length; i++) {
	            instance.eventTarget.fireEvent({
	                type: instance.eventTarget.doneHandlers[i],
	                result: result
	            });
	        }
	    }
	    logger.callbackLog("LinkClose", lParam);
	}

	// ????????????????????????dwRoomId????????????????????????ID??????errorcode???????????????????????????0????????????????????????????????????
	function OnAnyChatEnterRoom(wParam, lParam) {
	    AnyChatSDKEventDispatcher.roomId = wParam;
	    var arguement1 = {
	        code: lParam,
	        msg: AnyChatSDKErrorCode.checkErrorMsg(lParam)
	    };

	    var arguement2 = {
	        roomId: wParam
	    };
	    instance.eventTarget.fireEvent({
	        type: "OnAnyChatEnterRoom",
	        result: arguement1,
	        data: arguement2
	    });
	    logger.callbackLog("EnterRoom", lParam, arguement2);
	}

	// ????????????????????????????????????????????????????????????????????????dwUserCount??????????????????????????????????????????dwRoomId????????????ID
	function OnAnyChatRoomOnlineUser(dwUserCount, dwRoomId) {
	    //instance.anychatSDKInstance.getRoomUsers();
	}

	// ?????????????????????????????????dwUserId????????????ID??????bEnterRoom???????????????????????????1???????????????0?????????
	function OnAnyChatUserAtRoom(dwUserId, bEnterRoom) {
	    var strUserId = dwUserId+"";
	    if (bEnterRoom) {
	        strUserId = getStrUserId(dwUserId);
	        AnyChatSDKUserHandler.instance.atRoomUserList.push({ intUserId: dwUserId, strUserId: strUserId });
	    } else {
	        for (var i = 0; i < AnyChatSDKUserHandler.instance.atRoomUserList.length; i++) {
	            if (AnyChatSDKUserHandler.instance.atRoomUserList[i].intUserId == dwUserId) {
	                strUserId = AnyChatSDKUserHandler.instance.atRoomUserList[i].strUserId;
	                AnyChatSDKUserHandler.instance.atRoomUserList.splice(i, 1);
	                break;
	            }
	        }
	    }
	    var list = AnyChatSDKUserHandler.instance.atRoomUserList;
	    var userData = {
	        userId: strUserId,
	        roomId: AnyChatSDKEventDispatcher.roomId,
	        action: bEnterRoom
	    };
	    instance.eventTarget.fireEvent({
	        type: "onRoomUserInAndOut",
	        result: userData
	    });

	    var data = {
	        userList: list,
	        userNum: list.length,
	        roomId: AnyChatSDKEventDispatcher.roomId
	    };


	    instance.eventTarget.fireEvent({
	        type: "onRoomUserChanged",
	        data: data
	    });

	    logger.callbackLog("onRoomUserChanged", 0, userData);
	}

	// ??????????????????
	function OnAnyChatTextMessage(dwFromUserId, dwToUserId, bSecret, lpMsgBuf, dwLen) {

	    var fromStrUserId = getStrUserId(dwFromUserId);
	    var toStrUserId = getStrUserId(dwToUserId);
	    var data = {
	        userId: fromStrUserId,
	        toUserId: toStrUserId,
	        msg: lpMsgBuf
	    };
	    instance.eventTarget.fireEvent({
	        type: "onRoomUserMsgReceived",
	        data: data
	    });
	    logger.callbackLog("TextMessage", 0, data);
	}

	// ??????????????????????????????
	function OnAnyChatTransBuffer(dwUserId, lpBuf, dwLen) {
	    var strUserId = getStrUserId(dwUserId);

	    if (lpBuf != "") {
	        var msg = AnyChatSDKUserHandler.Base64.decode(lpBuf);
	        if (msg.indexOf("#") == -1) {
	            var msgId = msg;
	            for (var i = 0; i < AnyChatSDKUserHandler.instance.currentMsgTaskId.length; i++) {
	                if (AnyChatSDKUserHandler.instance.currentMsgTaskId[i].msgId == msgId) {
	                    var content = AnyChatSDKUserHandler.instance.currentMsgTaskId[i].msgContent;
	                    clearTimeout(AnyChatSDKUserHandler.instance.currentMsgTaskId[i].timer);
	                    AnyChatSDKUserHandler.instance.currentMsgTaskId.slice(i, 1);
	                    break;
	                }
	            }
	            var data = {
	                userId: strUserId,
	                msg: content
	            };
	            instance.eventTarget.fireEvent({
	                type: "onTransBufferDone"+strUserId,
	                result: {
	                    code: 0,
	                    msg: "????????????"
	                },
	                data: data
	            });
	            logger.callbackLog("TransBuffer", 0, data);
	            return;
	        } else {
	            var msgId = msg.substring(0, msg.indexOf("#"));
	            var msgData = msg.substring(msg.indexOf("#") + 1, msg.length);
	            try {
	                msgData = JSON.parse(msgData);
	            } catch (error) {

	            }
	            BRAC_TransBuffer(dwUserId, AnyChatSDKUserHandler.Base64.encode(msgId));

	            var data = {
	                userId: strUserId,
	                msg: msgData
	            };
	            instance.eventTarget.fireEvent({
	                type: "onReceiveBuffer",
	                data: data
	            });
	            logger.callbackLog("ReceiveBuffer", 0, data);
	        }

	    }
	}

	// ??????????????????????????????????????????
	function OnAnyChatTransBufferEx(dwUserId, lpBuf, dwLen) {
	    var strUserId = getStrUserId(dwUserId);

	    if (lpBuf != "") {
	        var msg = AnyChatSDKUserHandler.Base64.decode(lpBuf);
	        if (msg.indexOf("#") == -1) {
	            var msgId = msg;
	            for (var i = 0; i < AnyChatSDKUserHandler.instance.currentMsgTaskId.length; i++) {
	                if (AnyChatSDKUserHandler.instance.currentMsgTaskId[i].msgId == msgId) {
	                    var content = AnyChatSDKUserHandler.instance.currentMsgTaskId[i].msgContent;
	                    clearTimeout(AnyChatSDKUserHandler.instance.currentMsgTaskId[i].timer);
	                    AnyChatSDKUserHandler.instance.currentMsgTaskId.slice(i, 1);
	                    break;
	                }
	            }
	            var data = {
	                userId: strUserId,
	                msg: content
	            };
	            instance.eventTarget.fireEvent({
	                type: "onTransBufferDone"+strUserId,
	                result: {
	                    code: 0,
	                    msg: "????????????"
	                },
	                data: data
	            });
	            logger.callbackLog("TransBuffer", 0, data);
	            return;
	        } else {
	            var msgId = msg.substring(0, msg.indexOf("#"));
	            var msgData = msg.substring(msg.indexOf("#") + 1, msg.length);
	            try {
	                msgData = JSON.parse(msgData);
	            } catch (error) {

	            }
	            BRAC_TransBufferEx(dwUserId, AnyChatSDKUserHandler.Base64.encode(msgId),0,0,0);

	            var data = {
	                userId: strUserId,
	                msg: msgData
	            };
	            instance.eventTarget.fireEvent({
	                type: "onReceiveBuffer",
	                data: data
	            });
	            logger.callbackLog("ReceiveBuffer", 0, data);
	        }

	    }
	}

	// ???????????????????????????dwUserId????????????ID??????dwType??????????????????
	function OnAnyChatUserInfoUpdate(dwUserId, dwType) {

	}

	// ???????????????????????????dwUserId??????????????????ID??????dwStatus????????????????????????????????????0 ????????? 1 ??????
	function OnAnyChatFriendStatus(dwUserId, dwStatus) {
	    var result = {
	        userId: dwUserId,
	        status: dwStatus
	    };

	    instance.eventTarget.fireEvent({
	        type: "onAnyChatFriendStatus",
	        result: result
	    });
	}

	// ??????????????????????????????????????????dwUserId????????????ID??????State???????????????????????????????????????????????????0????????????1????????????
	function OnAnyChatMicStateChange(dwUserId, State) {

	}

	// ????????????????????????????????????dwUserId????????????ID??????State?????????????????????????????????0?????????????????????1?????????????????????????????????2????????????
	function OnAnyChatCameraStateChange(dwUserId, State) {

	}

	// ??????????????????????????????P2P?????????????????????????????????dwUserId??????????????????ID??????State??????????????????????????????????????????P2P?????????????????????0??????????????????1??????TCP?????????2??????UDP?????????3???TCP???UDP?????????
	function OnAnyChatP2PConnectState(dwUserId, State) {

	}

	// ???????????????????????????dwUserId????????????????????????ID??????dwRequestId??????????????????????????????????????????
	function OnAnyChatPrivateRequest(dwUserId, dwRequestId) {

	}

	// ???????????????????????????dwUserId????????????????????????ID??????errorcode???????????????
	function OnAnyChatPrivateEcho(dwUserId, errorcode) {

	}

	// ?????????????????????dwUserId????????????????????????ID??????errorcode???????????????
	function OnAnyChatPrivateExit(dwUserId, errorcode) {

	}

	// ????????????????????????????????????dwUserId???INT???????????????ID??????dwResolution???INT????????????????????????????????????????????????16?????????????????????16??????????????????
	function OnAnyChatVideoSizeChange(dwUserId, dwResolution) {

	}

	// ????????????????????????
	function OnAnyChatVolumeChange(device, dwCurrentVolume) {

	}

	// ????????????????????????SDK Filter??????
	function OnAnyChatSDKFilterData(lpBuf, dwLen) {

	}

	// ?????????????????????????????????
	function OnAnyChatRecordSnapShot(dwUserId, lpFileName, dwParam, dwFlags) {

	}

	// ?????????????????????????????????????????????
	function OnAnyChatRecordSnapShotEx(dwUserId, lpFileName, dwElapse, dwFlags, dwParam, lpUserStr) {

	}

	// ?????????????????????????????????
	function OnAnyChatRecordSnapShotEx2(dwUserId, dwErrorCode, lpFileName, dwElapse, dwFlags, dwParam, lpUserStr) {
		var userStr = {filelength: ''};
		try{
			userStr = JSON.parse(lpUserStr);
		}catch(e){
			if(typeof console !== undefined && typeof console.log === "function")
			console.log('Error: json err');
		}
		var filelength = userStr.filelength;
	    var strUserId = getStrUserId(dwUserId);
	    var result = {
	        code: dwErrorCode,
	        msg: AnyChatSDKErrorCode.checkErrorMsg(dwErrorCode)
	    };

	    if (dwFlags & 0x400) {
	        if (result.code == 0) {
	            var data = {
	                userid: strUserId,
	                filePath: lpFileName
	            };
	            instance.eventTarget.fireEvent({
	                type: "onSnapshotDone",
	                result: result,
	                data: data
	            });
	            logger.callbackLog("Snapshot", dwErrorCode, data);
	        } else {
	            instance.eventTarget.fireEvent({
	                type: "onSnapshotDone",
	                result: result
	            });
	            logger.callbackLog("Snapshot", dwErrorCode);
	        }

	    } else {

	        var VADCtrol = 1;
	        BRAC_SetSDKOption(BRAC_SO_AUDIO_VADCTRL, VADCtrol);

	        if (result.code == 0) {
	            var arguement2 = {
	                userid: strUserId,
	                filePath: lpFileName,
	                elapse: dwElapse,
	                filelength: filelength,
					filemd5:userStr.filemd5
	            };
	            if(AnyChatWebSDK.anychatSDKInstance.AnyChatSDKRecordTag){
	                arguement2.recordTagData = AnyChatWebSDK.anychatSDKInstance.AnyChatSDKRecordTag.getRecordTag();
	            }
	            instance.eventTarget.fireEvent({
	                type: "onRecordDone",
	                result: result,
	                data: arguement2
	            });
	            logger.callbackLog("Record", dwErrorCode, arguement2);
	        } else {
	            var arguement2 = {
	                userid: strUserId || '',
	                filePath: lpFileName || '',
	                elapse: dwElapse || '',
	                filelength: filelength || '',
	                filemd5:userStr.filemd5  || ''
	            };
	            if(AnyChatWebSDK.anychatSDKInstance.AnyChatSDKRecordTag){
	                arguement2.recordTagData=AnyChatWebSDK.anychatSDKInstance.AnyChatSDKRecordTag.getRecordTag();
	            }
	            instance.eventTarget.fireEvent({
	                type: "onRecordDone",
	                result: result,
	                data: arguement2
	            });
	            logger.callbackLog("Record", dwErrorCode, arguement2);
	        }

	    }
	}

	// ????????????????????????
	function OnAnyChatTransFile(dwUserId, lpFileName, lpTempFilePath, dwFileLength, wParam, lParam, dwTaskId) {

	    if (AnyChatSDKUserHandler.instance.userId == dwUserId) {
	        var result = {
	            code: 0,
	            msg: AnyChatSDKErrorCode.checkErrorMsg(0)
	        };

	        var data = {
	            filename: lpFileName,
	            filePath: lpTempFilePath,
	            fileLength: dwFileLength
	        };
	        instance.eventTarget.fireEvent({
	            type: "onFileUploadDone",
	            result: result,
	            data: data
	        });
	        logger.callbackLog("FileUpload", 0, data);
	    } else {
	        var result = {
	            code: 0,
	            msg: AnyChatSDKErrorCode.checkErrorMsg(0)
	        };

	        var strUserId = getStrUserId(dwUserId);
	        var data = {
	            userid: strUserId,
	            filename: lpFileName,
	            filePath: lpTempFilePath,
	            fileLength: dwFileLength
	        };
	        instance.eventTarget.fireEvent({
	            type: "onFileReceived",
	            result: result,
	            data: data
	        });
	        logger.callbackLog("FileReceive", 0, data);
	    }
	}

	// AnyChatCoreSDK????????????
	function OnAnyChatCoreSDKEvent(dwEventType, lpEventJsonStr) {
	    var ANYCHAT_CORESDKEVENT_RECORDSTATUS = 13 //??????????????????
	    switch (parseInt(dwEventType)) {
	        case ANYCHAT_SDKCTRL_BUSINESSBUFFER://????????????
				OnBusinessChannel(lpEventJsonStr);
	            break;
	            case ANYCHAT_CORESDKEVENT_BASEEVENT: //??????????????????
	            var obj = JSON.parse(lpEventJsonStr);
	            if (obj.message == WM_GV_SESSIONKEEP){
	                AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
	                    type: "onSessionKeep",
	                    data: lpEventJsonStr						
	                });
	            }
	            break;            
	        case ANYCHAT_CORESDKEVENT_PPTHELPER:
	            OnAnyChatPPT(lpEventJsonStr);
	            break;
			case ANYCHAT_CORESDKEVENT_TRANSFILE:
				OnTransfromDataDone(lpEventJsonStr);
				break;
	        case ANYCHAT_CORESDKEVENT_STREAMPLAY:
	            if (JSON.parse(lpEventJsonStr).playevent == ANYCHAT_STREAMPLAY_EVENT_START){
	                OnStreamPlayStart(lpEventJsonStr);
	            } else if (JSON.parse(lpEventJsonStr).playevent == ANYCHAT_STREAMPLAY_EVENT_FINISH) {
	                OnStreamPlayStop(lpEventJsonStr);
	            }
	            break;
	        case ANYCHAT_CORESDKEVENT_RECORDSTATUS:
	            OnRecordStatus(lpEventJsonStr);
	            break;
	        case ANYCHAT_CORESDKEVENT_AIABILITY:
	            var lpEventJsonStrbean=JSON.parse(lpEventJsonStr);
	            if(lpEventJsonStrbean.aievent == ANYCHAT_AI_EVENT_ROBOT_INITRESULT){

	                OnAnyChatAI(lpEventJsonStr);
	            }
	            else if(lpEventJsonStrbean.aievent == ANYCHAT_AI_EVENT_ROBOT_STATUS){
	                AnyChatWebSDK.anychatSDKInstance.AnyChatAIManagement.AnyChatAIRobot[lpEventJsonStrbean.robotid].isAlive=false;//?????????????????????
	                AnyChatWebSDK.anychatSDKInstance.destroyRobot(lpEventJsonStrbean.robotid);//???????????????
	                var result = {
	                    AnyChatResult : {
	                        code: lpEventJsonStrbean.errorcode,
	                    },
	                };
	                AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
	                    type:"err"+lpEventJsonStrbean.robotid,
	                    result: result,
	                });


	            }
	            else  if(lpEventJsonStrbean.aievent == ANYCHAT_AI_EVENT_ROBOT_ACTIVERET){


	            }
	            else if(lpEventJsonStrbean.aievent == ANYCHAT_AI_EVENT_ABILITY_RESULT){

	                var AnyChatSDKRecordTag = AnyChatWebSDK.anychatSDKInstance.AnyChatSDKRecordTag;
	                if(lpEventJsonStrbean.taskid == AnyChatWebSDK.anychatSDKInstance.AnyChatAIManagement.AnyChatAIRobot[lpEventJsonStrbean.robotid].asrtaskid[lpEventJsonStrbean.taskid]){
	                    //asr
	                    if(lpEventJsonStrbean.status===1){//????????????

	                        var result={
	                            taskId:lpEventJsonStrbean.taskid
	                        }
	                        AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
	                            type: "onAIPrepare"+lpEventJsonStrbean.taskid,
	                            result: result,
	                        });
	                        if(AnyChatSDKRecordTag){
	                            AnyChatSDKRecordTag.asrResult = "";
	                        }
	                    }
	                    else if(lpEventJsonStrbean.status===2){//????????????

	                        var result={
	                            taskId:lpEventJsonStrbean.taskid,
	                            result:lpEventJsonStrbean.result
	                        }
	                        AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
	                            type: "onAIResult"+lpEventJsonStrbean.taskid,
	                            result: result,
	                        });
	                        if(AnyChatSDKRecordTag){
	                            AnyChatSDKRecordTag.asrResult+=lpEventJsonStrbean.result;
	                        }

	                    }
	                    else if(lpEventJsonStrbean.status===3){//????????????

	                        var result={
	                            taskId:lpEventJsonStrbean.taskid
	                        }
	                        AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
	                            type: "onAIFinish"+lpEventJsonStrbean.taskid,
	                            result: result,
	                        });
	                        if(AnyChatSDKRecordTag){
	                            var tagOpt = {
	                                taskId:lpEventJsonStrbean.taskid,
	                                result: AnyChatSDKRecordTag.asrResult,
	                            }
	                            var errorCode =AnyChatSDKRecordTag.updateRecordTag(tagOpt);
	                            logger.invokeLog("updateRecordTag", errorCode, tagOpt);
	                        }
	                    }

	                }

	                else if(lpEventJsonStrbean.taskid == AnyChatWebSDK.anychatSDKInstance.AnyChatAIManagement.AnyChatAIRobot[lpEventJsonStrbean.robotid].ttstaskid[lpEventJsonStrbean.taskid]){

	                    if(lpEventJsonStrbean.status===1){//????????????

	                        var result={
	                            taskId:lpEventJsonStrbean.taskid
	                        }
	                        AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
	                            type: "onAIPreparetts"+lpEventJsonStrbean.taskid,
	                            result: result,
	                        });
	                    }
	                    else if(lpEventJsonStrbean.status===2){//????????????

	                        var result={
	                            taskId:lpEventJsonStrbean.taskid,
	                            result:lpEventJsonStrbean.result
	                        }
	                        AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
	                            type: "onAIResulttts"+lpEventJsonStrbean.taskid,
	                            result: result,
	                        });
	                    }
	                    else if(lpEventJsonStrbean.status===3){//????????????

	                        var result={
	                            taskId:lpEventJsonStrbean.taskid
	                        }
	                        AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
	                            type: "onAIFinishtts"+lpEventJsonStrbean.taskid,
	                            result: result,
	                        });
	                    }

	                }
	                else if(lpEventJsonStrbean.taskid == AnyChatWebSDK.anychatSDKInstance.AnyChatAIManagement.AnyChatAIRobot[lpEventJsonStrbean.robotid].doOcrImagetaskid[lpEventJsonStrbean.taskid]){

	                    if(lpEventJsonStrbean.status===1){//????????????

	                        var result={
	                            taskId:lpEventJsonStrbean.taskid
	                        }
	                        AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
	                            type: "onAIPrepareocr"+lpEventJsonStrbean.taskid,
	                            result: result,
	                        });
	                    }
	                    else if(lpEventJsonStrbean.status===2){//????????????

	                        var result={
	                            taskId:lpEventJsonStrbean.taskid,
	                            result:lpEventJsonStrbean.result
	                        }
	                        AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
	                            type: "onAIResulocr"+lpEventJsonStrbean.taskid,
	                            result: result,
	                        });
	                    }
	                    else if(lpEventJsonStrbean.status===3){//????????????

	                        var result={
	                            taskId:lpEventJsonStrbean.taskid
	                        }
	                        AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
	                            type: "onAIFinishocr"+lpEventJsonStrbean.taskid,
	                            result: result,
	                        });
	                    }

	                }
	                else if(lpEventJsonStrbean.taskid == AnyChatWebSDK.anychatSDKInstance.AnyChatAIManagement.AnyChatAIRobot[lpEventJsonStrbean.robotid].facetaskid[lpEventJsonStrbean.taskid]){

	                    if(lpEventJsonStrbean.status===1){//????????????

	                        var result={
	                            taskId:lpEventJsonStrbean.taskid
	                        }
	                        AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
	                            type: "onAIPrepareface"+lpEventJsonStrbean.taskid,
	                            result: result,
	                        });
	                    }
	                    else if(lpEventJsonStrbean.status===2){//????????????

	                        var result={
	                            taskId:lpEventJsonStrbean.taskid,
	                            result:lpEventJsonStrbean.result
	                        }
	                        AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
	                            type: "onAIResulface"+lpEventJsonStrbean.taskid,
	                            result: result,
	                        });
	                        if(AnyChatSDKRecordTag){
	                            var tagOpt = {
	                                taskId:lpEventJsonStrbean.taskid,
	                                result: lpEventJsonStrbean.result,
	                            }
	                            var errorCode = AnyChatSDKRecordTag.updateRecordTag(tagOpt);
	                            logger.invokeLog("updateRecordTag", errorCode, tagOpt);
	                        }
	                    }
	                    else if(lpEventJsonStrbean.status===3){//????????????

	                        var result={
	                            taskId:lpEventJsonStrbean.taskid
	                        }
	                        AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
	                            type: "onAIFinishface"+lpEventJsonStrbean.taskid,
	                            result: result,
	                        });
	                    }

	                }
	                else if(lpEventJsonStrbean.taskid == AnyChatWebSDK.anychatSDKInstance.AnyChatAIManagement.AnyChatAIRobot[lpEventJsonStrbean.robotid].capturetaskid[lpEventJsonStrbean.taskid]){

	                    if(lpEventJsonStrbean.status===1){//????????????

	                        var result={
	                            taskId:lpEventJsonStrbean.taskid
	                        }
	                        AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
	                            type: "onAIPreparecapture"+lpEventJsonStrbean.taskid,
	                            result: result,
	                        });
	                    }
	                    else if(lpEventJsonStrbean.status===2){//????????????

	                        var result={
	                            taskId:lpEventJsonStrbean.taskid,
	                            result:lpEventJsonStrbean.result
	                        }
	                        AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
	                            type: "onAIResulcapture"+lpEventJsonStrbean.taskid,
	                            result: result,
	                        });
	                    }
	                    else if(lpEventJsonStrbean.status===3){//????????????

	                        var result={
	                            taskId:lpEventJsonStrbean.taskid
	                        }
	                        AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
	                            type: "onAIFinishcapture"+lpEventJsonStrbean.taskid,
	                            result: result,
	                        });
	                    }
	                }
	            }
	            else if(lpEventJsonStrbean.aievent == ANYCHAT_AI_EVENT_ABILITY_STATUS){ }
	            else if(lpEventJsonStrbean.aievent == ANYCHAT_AI_EVENT_ABILITY_ACTIVERET){}
	            break;
	    }

	}


	/********************************************
	 *		AnyChat SDK??????????????????				*
	 *******************************************/
	// ????????????????????????
	function OnAnyChatPPT(lpEventJsonStr) {
	    AnyChatSDKFileHandler.downLoadCallBack(lpEventJsonStr);
	}
	// ??????????????????????????????
	function OnTransfromDataDone(lpEventJsonStr) {
	    AnyChatSDKFileHandler.transfromCallBack(lpEventJsonStr);
	}
	//???????????????????????????
	function OnAnyChatAI(lpEventJsonStr) {

	    var lpEventJsonObj = JSON.parse(lpEventJsonStr);
	    var result = {
	        AnyChatResult : {
	            code: lpEventJsonObj.errorcode,
	            msg: AnyChatSDKErrorCode.checkErrorMsg(lpEventJsonObj.errorcode),
	        },
	        robotId:lpEventJsonObj.robotid
	    };

	    AnyChatWebSDK.anychatSDKInstance.AnyChatAIManagement.AnyChatAIRobot[lpEventJsonObj.robotid].robotId=lpEventJsonObj.robotid;
	    AnyChatWebSDK.anychatSDKInstance.AnyChatAIManagement.AnyChatAIRobot[lpEventJsonObj.robotid].isAlive=true;
	    AnyChatWebSDK.anychatSDKInstance.AnyChatAIManagement.AnyChatAIRobot[lpEventJsonObj.robotid].robotUserId=lpEventJsonObj.userid;

	    AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
	        type:lpEventJsonObj.robotid,
	        result: result,
	    });
	}
	// StreamPlay????????????????????????
	function OnStreamPlayStart(lpEventJsonStr) {
	    var eventJsonObj = JSON.parse(lpEventJsonStr);
	    instance.eventTarget.fireEvent({
	        type: "onStreamPlayStart",
	        data: {guid: eventJsonObj.taskguid}
	    });
	}

	// StreamPlay????????????????????????
	function OnStreamPlayStop(lpEventJsonStr) {
	    var eventJsonObj = JSON.parse(lpEventJsonStr);
	    var errorObj = JSON.parse(eventJsonObj.strparam);
	    errorObj.errorcode = parseInt(errorObj.errorcode);
	    var result = {
	        code: errorObj.errorcode,
	        msg: AnyChatSDKErrorCode.checkErrorMsg(errorObj.errorcode)
	    };
	    instance.eventTarget.fireEvent({
	        type: "onStreamPlayStop",
	        result: result,
	        data: { guid: eventJsonObj.taskguid }
	    });
	}

	function OnRecordStatus(lpEventJsonStr){
	    var eventJsonObj = JSON.parse(lpEventJsonStr);
	    var errorcode = parseInt(eventJsonObj.errorcode);
	    var result = {
	        errorcode: errorcode,
	        msg: AnyChatSDKErrorCode.checkErrorMsg(errorcode)
	    };
	    instance.eventTarget.fireEvent({
	        type: "OnRecordStatusDone",
	        result: result,
	        data: {guid: eventJsonObj.taskid}
	    });
	}

	//????????????????????????
	function OnBusinessChannel(lpEventJsonStr) {
	    var result = lpEventJsonStr;
	    AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
	        type: "businessChannel" + JSON.parse(result).requestId,
	        result: result,
	    });
	}

	// ????????????????????????????????????
	function OnAnyChatVideoCallEvent(dwEventType, dwUserId, dwErrorCode, dwFlags, dwParam, szUserStr) {
	    switch (dwEventType) {
	        case BRAC_VIDEOCALL_EVENT_REQUEST:
	            //????????????????????????
	            onVideoCallControlRequest(dwUserId, dwErrorCode, dwFlags, dwParam, szUserStr);
	            break;
	        case BRAC_VIDEOCALL_EVENT_REPLY:
	            ////????????????????????????
	            onVideoCallControlReply(dwUserId, dwErrorCode, dwFlags, dwParam, szUserStr);
	            break;
	        case BRAC_VIDEOCALL_EVENT_START:
	            //????????????
	            onVideoCallControlStart(dwUserId, dwErrorCode, dwFlags, dwParam, szUserStr);
	            break;
	        case BRAC_VIDEOCALL_EVENT_FINISH:
	            //??????????????????
	            onVideoCallControlFinish(dwUserId, dwErrorCode, dwFlags, dwParam, szUserStr);
	            break;

	    }
	}

	//????????????????????????
	function onVideoCallControlRequest(dwUserId, dwErrorCode, dwFlags, dwParam, szUserStr) {
		receiveCallFlag = 1;
	    var strUserId = getStrUserId(dwUserId);
	    var data = {
	        userId: strUserId,
	        userStr: szUserStr
	    };
	    instance.eventTarget.fireEvent({
	        type: "onReceiveVideoCallRequest",
	        data: data
	    });
	    logger.callbackLog("ReceiveVideoCallRequest", 0, data);
	}

	//????????????????????????
	function onVideoCallControlReply(dwUserId, dwErrorCode, dwFlags, dwParam, szUserStr) {
	    var strUserId = getStrUserId(dwUserId);
	    var result = {
	        code: dwErrorCode,
	        msg: AnyChatSDKErrorCode.checkErrorMsg(dwErrorCode)
	    };
	    var data = {
	        userId: strUserId,
	        userStr: szUserStr
	    };
	    switch (dwErrorCode) {
	        case GV_ERR_SUCCESS: //???????????????
	            //onSendVideoCallRequestSucess(dwUserId);
	            instance.eventTarget.fireEvent({
	                type: "onRequestVideoCallDone",
	                result: result,
	                data: data
	            });
	            logger.callbackLog("RequestVideoCallDone", dwErrorCode, data);
	            break;
	        case GV_ERR_SESSION_QUIT:
	            var errorcode = BRAC_VideoCallControl(BRAC_VIDEOCALL_EVENT_FINISH, dwUserId, 0, 0, 0, ""); // ??????
	            //result.errorCode = dwErrorCode;
	            instance.eventTarget.fireEvent({
	                type: "onReceiveVideoCallError",
	                result: result
	            });
	            logger.callbackLog("ReceiveVideoCallError", dwErrorCode);
	            break;
	        case GV_ERR_SESSION_OFFLINE:
	            //result.errorCode = dwErrorCode;
	            instance.eventTarget.fireEvent({
	                type: "onRequestVideoCallDone",
	                result: result,
	                data: data
	            });
	            logger.callbackLog("RequestVideoCallDone", dwErrorCode, data);
	            break;
	        case GV_ERR_SESSION_BUSY:
	            var errorcode = BRAC_VideoCallControl(BRAC_VIDEOCALL_EVENT_FINISH, dwUserId, 0, 0, 0, "");
	            instance.eventTarget.fireEvent({
	                type: "onRequestVideoCallDone",
	                result: result,
	                data: data
	            });
	            logger.callbackLog("RequestVideoCallDone", dwErrorCode, data);
	            break;
	        case GV_ERR_SESSION_REFUSE:
	            var errorcode = BRAC_VideoCallControl(BRAC_VIDEOCALL_EVENT_FINISH, dwUserId, 0, 0, 0, "");
	            instance.eventTarget.fireEvent({
	                type: "onReceiveVideoCallError",
	                result: result
	            });
	            logger.callbackLog("ReceiveVideoCallError", dwErrorCode);
	            break;
	        case GV_ERR_SESSION_TIMEOUT:
	            // if (AnyChatSDKUserHandler.instance.userType == 2 ) {
	            //     BRAC_ObjectControl(ANYCHAT_OBJECT_TYPE_AGENT, AnyChatSDKUserHandler.instance.userId, ANYCHAT_AGENT_CTRL_FINISHSERVICE, dwErrorCode, 0, 0, 0, "");
	            // }
	            instance.eventTarget.fireEvent({
	                type: "onReceiveVideoCallError",
	                result: result
	            });
	            logger.callbackLog("ReceiveVideoCallError", dwErrorCode);
	            break;
	        case GV_ERR_SESSION_DISCONNECT:
	            instance.eventTarget.fireEvent({
	                type: "onReceiveVideoCallError",
	                result: result,
	                data: data
	            });
	            logger.callbackLog("ReceiveVideoCallError", dwErrorCode, data);
	            break;
	        default:
	            break;
	    }

	}

	//????????????
	function onVideoCallControlStart(dwUserId, dwErrorCode, dwFlags, dwParam, szUserStr) {
	    var strUserId = getStrUserId(dwUserId);
	    AnyChatSDKVideoCallHandler.instance.isVideoCall = true;
	    var data = {
	        userId: strUserId,
	        roomId: dwParam,
	        userStr: szUserStr
	    };
	    instance.eventTarget.fireEvent({
	        type: "onReceiveVideoCallStart",
	        data: data
	    });
	    logger.callbackLog("ReceiveVideoCallStart", dwErrorCode, data);
	}

	//??????????????????
	function onVideoCallControlFinish(dwUserId, dwErrorCode, dwFlags, dwParam, szUserStr) {
	    AnyChatSDKVideoCallHandler.instance.isVideoCall = false;

	    if (AnyChatSDKUserHandler.instance.userType == ANYCHAT_OBJECT_FLAGS_AGENT) {
	        if(dwErrorCode != 100101){ //?????????????????????????????????????????????, ??????????????????????????????bug
	            //??????????????????
	            BRAC_ObjectControl(ANYCHAT_OBJECT_TYPE_AGENT, AnyChatSDKUserHandler.instance.userId, ANYCHAT_AGENT_CTRL_FINISHSERVICE, 0, 0, 0, 0, "");
	        }
	    }
	    var strUserId = getStrUserId(dwUserId);
	    var data = {
	        userId: strUserId,
	        userStr: szUserStr
	    };
	    var result = {
	        code: dwErrorCode,
	        msg: AnyChatSDKErrorCode.checkErrorMsg(dwErrorCode)
	    };
	    instance.eventTarget.fireEvent({
	        type: "onReceiveVideoCallFinish",
	        result: result,
	        data: data
	    });
	    logger.callbackLog("ReceiveVideoCallFinish", dwErrorCode, data);
	}



	//??????????????????????????????
	function OnAnyChatObjectUpdate(dwObjectType, dwObjectId) {

	    if (dwObjectType == ANYCHAT_OBJECT_TYPE_AREA) {
	        var areaInfo = {};
	        areaInfo.areaId = dwObjectId;
	        areaInfo.areaName = AnyChatSDKAreaHandler.getAreaName({
	            areaId: dwObjectId
	        });
	        areaInfo.areaDesc = AnyChatSDKAreaHandler.getAreaDescription({
	            areaId: dwObjectId
	        });
	        AnyChatSDKAreaHandler.instance.areaIdArray[AnyChatSDKAreaHandler.instance.areaIdIndex] = areaInfo;
	        AnyChatSDKAreaHandler.instance.areaIdIndex++;
	    } else if (dwObjectType == ANYCHAT_OBJECT_TYPE_QUEUE) {

	    } else if (dwObjectType == ANYCHAT_OBJECT_TYPE_AGENT) {

	    }
	}

	//??????????????????????????????
	function OnAnyChatObjectSyncDataFinish(dwObjectType, dwObjectId) {

	    if (dwObjectType == ANYCHAT_OBJECT_TYPE_AREA) {
	        //mCurrentStatus = CLIENT_STATUS_AREA;
	        //showSerivceArea();
	        var result = {
	            code: 0,
	            msg: AnyChatSDKErrorCode.checkErrorMsg(0)
	        };
	        var data = {
	            areas: AnyChatSDKAreaHandler.instance.areaIdArray
	        };
	        instance.eventTarget.fireEvent({
	            type: "onSyncAreasDone",
	            result: result,
	            data: data
	        });
	        logger.callbackLog("SyncAreasDone", 0, data);
	    }
	}

	// ??????????????????????????????
	function OnAnyChatEnterAreaResult(dwObjectType, dwObjectId, dwErrorCode) {

	    var result = {
	        code: dwErrorCode,
	        msg: AnyChatSDKErrorCode.checkErrorMsg(dwErrorCode)
	    };

	    var data = {};
	    data.areaId = dwObjectId;
	    data.areaName = AnyChatSDKAreaHandler.getAreaName({
	        areaId: dwObjectId
	    });
	    data.areaDesc = AnyChatSDKAreaHandler.getAreaDescription({
	        areaId: dwObjectId
	    });



	    if (dwErrorCode == 0) {

	        data.guestCount = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_AREA, dwObjectId, ANYCHAT_AREA_INFO_GUESTCOUNT);
	        var queueList = BRAC_ObjectGetIdList(ANYCHAT_OBJECT_TYPE_QUEUE);

	        data.agentCount = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_AREA, dwObjectId, ANYCHAT_AREA_INFO_AGENTCOUNT);
	        data.idleAgentCount = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_AREA, dwObjectId, ANYCHAT_AREA_INFO_IDLEAGENTCOUNT);

	        var queningUserCount = 0;
	        var queues = [];

	        for (var i=0;i< queueList.length;i++) {
	            var queueObj = {};
	            var queueListId = parseInt(queueList[i]);
	            /**??????????????????*/
	            var queueName = BRAC_ObjectGetStringValue(ANYCHAT_OBJECT_TYPE_QUEUE, queueListId, ANYCHAT_OBJECT_INFO_NAME);
	            /**????????????????????????*/
	            var queueLength = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_QUEUE, queueListId, ANYCHAT_QUEUE_INFO_LENGTH);
	            queueLength = queueLength < 0 ? 0 : queueLength;
	            queningUserCount = queningUserCount + queueLength;
	            /**??????????????????*/
	            var queueInfo = BRAC_ObjectGetStringValue(ANYCHAT_OBJECT_TYPE_QUEUE, queueListId, ANYCHAT_OBJECT_INFO_DESCRIPTION);
	            //var attributeValue = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_QUEUE, queueListId, ANYCHAT_OBJECT_INFO_ATTRIBUTE);

	            queueObj.id = queueListId;
	            queueObj.name = queueName;
	            queueObj.desc = queueInfo;

	            queues.push(queueObj);

	        }
	        data.queueCount = queueList.length;
	        data.queningUserCount = queningUserCount;
	        data.queues = queues;

	        //??????
	        if (AnyChatSDKUserHandler.instance.userType == ANYCHAT_OBJECT_FLAGS_AGENT) {
	            refreshAgentServiceInfo();
	            //???????????????????????????????????????"??????"
	            var errorcode = BRAC_ObjectControl(ANYCHAT_OBJECT_TYPE_AGENT, AnyChatSDKUserHandler.instance.userId, ANYCHAT_AGENT_CTRL_SERVICESTATUS, ANYCHAT_AGENT_STATUS_CLOSEED, 0, 0, 0, "");
	        }
	    }

	    instance.eventTarget.fireEvent({
	        type: "onEnterAreaDone",
	        result: result,
	        data: data
	    });
	    logger.callbackLog("EnterAreaDone", dwErrorCode, data);
	}

	// ??????????????????????????????
	function OnAnyChatLeaveAreaResult(dwObjectType, dwObjectId, dwErrorCode) {
	    var result = {
	        code: dwErrorCode,
	        msg: AnyChatSDKErrorCode.checkErrorMsg(dwErrorCode)
	    };
	    instance.eventTarget.fireEvent({
	        type: "onLeaveAreaDone",
	        result: result
	    });
	    logger.callbackLog("LeaveAreaDone", dwErrorCode);
	}

	//?????????????????????
	function OnAnyChatAreaStatusChange(dwObjectType, dwObjectId, dwErrorCode) {

	    if (AnyChatSDKUserHandler.instance.userType == ANYCHAT_OBJECT_FLAGS_AGENT) {
	        refreshAgentServiceInfo();
	    }
	    var data = {};
	    data.areaId = dwObjectId;
	    //??????????????????????????????
	    data.userCount = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_AREA, dwObjectId, ANYCHAT_AREA_INFO_GUESTCOUNT);

	    instance.eventTarget.fireEvent({
	        type: "onAreaChanged",
	        data: data
	    });
	    logger.callbackLog("AreaChanged", dwErrorCode, data);
	}

	// ??????????????????
	function OnAnyChatQueueStatusChanged(dwObjectType, dwObjectId) {

	    if (AnyChatSDKUserHandler.instance.userType == ANYCHAT_OBJECT_FLAGS_AGENT) {
	        refreshAgentServiceInfo();
	    }
	    var data = {};
	    data.queueId = dwObjectId;
	    //????????????????????????
	    data.userCount = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_QUEUE, dwObjectId, ANYCHAT_QUEUE_INFO_LENGTH);

	    instance.eventTarget.fireEvent({
	        type: "onQueueChanged",
	        data: data
	    });
	    logger.callbackLog("QueueChanged", 0, data);
	}

	// ??????????????????????????????
	function OnAnyChatEnterQueueResult(dwObjectType, dwObjectId, dwErrorCode) {

	    var result = {
	        code: dwErrorCode,
	        msg: AnyChatSDKErrorCode.checkErrorMsg(dwErrorCode)
	    };
	    var data = {};
	    if (dwErrorCode == 0) {
	        data.userNumInQueue = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_QUEUE, dwObjectId, ANYCHAT_QUEUE_INFO_LENGTH);
	        var beforeMeNum = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_QUEUE, dwObjectId, ANYCHAT_QUEUE_INFO_MYSEQUENCENO);
	        beforeMeNum = beforeMeNum < 0 ? 0 : beforeMeNum;
	        beforeMeNum++;
	        data.currentPos = beforeMeNum;
	        data.enqueueTime = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_QUEUE, dwObjectId, ANYCHAT_QUEUE_INFO_MYENTERQUEUETIME);
	    }

	    instance.eventTarget.fireEvent({
	        type: "onEnqueueDone",
	        result: result,
	        data: data
	    });
	    logger.callbackLog("EnqueueDone", dwErrorCode, data);

	    if (dwErrorCode == 0) {     // AnyChatSDKQueueHandler.instance.currentQueueId == dwObjectId 
	        if (AnyChatSDKQueueHandler.instance.waitingTimer) {
	            AnyChatSDKQueueHandler.instance.waitingTimer = 10011;
	        }
	        AnyChatSDKQueueHandler.instance.waitingTimer = setInterval(function() {
	            var myQueueData = {};
	            myQueueData.userNumInQueue = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_QUEUE, dwObjectId, ANYCHAT_QUEUE_INFO_LENGTH);
	            var beforeUserNum = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_QUEUE, dwObjectId, ANYCHAT_QUEUE_INFO_BEFOREUSERNUM);
	            beforeUserNum = beforeUserNum < 0 ? 0 : beforeUserNum;
	            beforeUserNum++;
	            myQueueData.currentPos = beforeUserNum;
	            myQueueData.waitingTime = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_QUEUE, dwObjectId, ANYCHAT_QUEUE_INFO_WAITTIMESECOND);

	            var result = {
	                code: 0,
	                msg: AnyChatSDKErrorCode.checkErrorMsg(0)
	            };
	            instance.eventTarget.fireEvent({
	                type: "onProcessChanged",
	                result: result,
	                data: myQueueData
	            });
	        }, 1000);

	    }

	}

	// ??????????????????????????????
	function OnAnyChatLeaveQueueResult(dwObjectType, dwObjectId, dwErrorCode) {
	    if (dwErrorCode == 0) {
	        var result = {
	            code: dwErrorCode,
	            msg: AnyChatSDKErrorCode.checkErrorMsg(dwErrorCode)
	        };
	        instance.eventTarget.fireEvent({
	            type: "onCancelQueuingDone",
	            result: result
	        });
	        logger.callbackLog("CancelQueuingDone", dwErrorCode);

	    } else {
	        var result = {
	            code: dwErrorCode,
	            msg: AnyChatSDKErrorCode.checkErrorMsg(dwErrorCode)
	        };
	        instance.eventTarget.fireEvent({
	            type: "onLeaveQueue",
	            result: result
	        });
	        logger.callbackLog("onLeaveQueue", dwErrorCode);
	    }
	    if (AnyChatSDKQueueHandler.instance.waitingTimer) {
	        clearInterval(AnyChatSDKQueueHandler.instance.waitingTimer);
	        AnyChatSDKQueueHandler.instance.waitingTimer = null;
	    }
	    AnyChatSDKQueueHandler.instance.currentQueueId = "";

	}
	//????????????????????????
	function OnAnyChatQueueUserInfoChanged(dwObjectType, dwObjectId, dwEventType, dwParam1, dwParam2, dwParam3, dwParam4, strParam){
	    var result = {
	        queueId: dwObjectId  //????????????id
	    };
	    var params={
	        queueId:dwObjectId
	    };
	    result.userList=AnyChatSDKQueueHandler.instance.getQueueUserInfo(params);
	    instance.eventTarget.fireEvent({
	        type: "OnQueueUserInfoChanged",
	        result: result
	    });
	    logger.callbackLog("OnQueueUserInfoChanged",0);
	}

	// ??????????????????
	function OnAnyChatAgentStatusChanged(dwObjectType, dwObjectId, dwParam1) {

	    if (dwObjectType == ANYCHAT_OBJECT_TYPE_AGENT && AnyChatSDKUserHandler.instance.userId == dwObjectId) {
	        if (dwParam1 == ANYCHAT_AGENT_STATUS_WAITTING) {
	            refreshAgentServiceInfo();

	        } else if (dwParam1 == ANYCHAT_AGENT_STATUS_WORKING) {

	        } else if (dwParam1 == ANYCHAT_AGENT_STATUS_PAUSED) {

	        } else if (dwParam1 == ANYCHAT_AGENT_STATUS_CLOSEED) {

	        }

	        var result = {
	            status: dwParam1
	        };
	        instance.eventTarget.fireEvent({
	            type: "onAgentStatusChanged",
	            result: result
	        });
	        logger.callbackLog("AgentStatusChanged", 0, result);
	    } else if (dwObjectType == ANYCHAT_OBJECT_TYPE_AGENT && AnyChatSDKUserHandler.instance.userId != dwObjectId) {
	        var result = {
	            status: dwParam1,
	            userId: getStrUserId(dwObjectId)
	        };
	        instance.eventTarget.fireEvent({
	            type: "onElseAgentStatusChanged",
	            result: result
	        });
	        logger.callbackLog("ElseAgentStatusChanged", 0, result);
	    }
	}

	//????????????????????????????????????????????????
	function refreshAgentServiceInfo() {
	    if (AnyChatSDKUserHandler.instance.userType == ANYCHAT_OBJECT_FLAGS_AGENT) {

	        //???????????????????????????
	        var serviceStartTime = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_AGENT, AnyChatSDKAreaHandler.instance.currentAgentID, ANYCHAT_AGENT_INFO_SERVICEBEGINTIME);

	        //??????????????????
	        var serviceTotalTime = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_AGENT, AnyChatSDKAreaHandler.instance.currentAgentID, ANYCHAT_AGENT_INFO_SERVICETOTALTIME);

	        //????????????????????????
	        var serviceUserCount = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_AGENT, AnyChatSDKAreaHandler.instance.currentAgentID, ANYCHAT_AGENT_INFO_SERVICETOTALNUM);

	        var result = {
	            serviceBeginTime: serviceStartTime,
	            serviceTotalTime: serviceTotalTime,
	            serviceUserCount: serviceUserCount
	        };
	        instance.eventTarget.fireEvent({
	            type: "onAgentServiceInfoNotify",
	            result: result
	        });
	        logger.callbackLog("AgentServiceInfoNotify", 0, result);
	    }
	}

	// ??????????????????
	function OnAnyChatServiceStart(dwAgentId, clientId, dwQueueId) {
		receiveCallFlag = 0;
	    if (AnyChatSDKUserHandler.instance.userId == clientId) {
	        if (AnyChatSDKQueueHandler.instance.waitingTimer) {
	            clearInterval(AnyChatSDKQueueHandler.instance.waitingTimer);
	            AnyChatSDKQueueHandler.instance.waitingTimer = null;
	        }
	        AnyChatSDKQueueHandler.instance.currentQueueId = "";
	    }

	        var agentStrUserId = getStrUserId(dwAgentId);
	        var clientStrUserId = getStrUserId(clientId);
	        var data = {
	            queueId: dwQueueId,
	            agentId: agentStrUserId,
	            customerId: clientStrUserId,
	            eventType:"serviceStart"
	        };

	        instance.eventTarget.fireEvent({
	            type: "onServiceNotify",
	            data: data
	        });
			setTimeout(function() {
				if(receiveCallFlag == 0){
					BRAC_ObjectControl(ANYCHAT_OBJECT_TYPE_AGENT, agentStrUserId, ANYCHAT_AGENT_CTRL_FINISHSERVICE, 0, 0, 0, 0, "");
					var result = {
						"code":"9999",
						"msg":"????????????????????????"
					}
					instance.eventTarget.fireEvent({
					    type: "onReceiveVideoCallError",
					    result: result
					});
				}
			}, 15000);
	        logger.callbackLog("ServiceNotify", 0, data);

	}

	//?????????????????????????????????????????????
	function OnAnyChatAgentWaitingUser() {
	    console.log("?????????????????????");
	}

	//???????????????????????????
	function OnAnyChatAgentprepared(dwAgentId, clientId, dwQueueId) {
	    var agentStrUserId = getStrUserId(dwAgentId);
	    var clientStrUserId = getStrUserId(clientId);
	    var data = {
	        queueId: dwQueueId,
	        agentId: agentStrUserId,
	        customerId: clientStrUserId,
	        eventType:"agentPrepared"
	    };
	    instance.eventTarget.fireEvent({
	        type: "onServiceNotify",
	        result: data
	    });
	    logger.callbackLog("ServiceNotify", 0, data);
	}


	var instance = new AnyChatSDKEventDispatcher();
	exports.instance = instance;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	/*-----------------------------------------------------------
	 * AnyChat???????????????
	 * ????????????:???????????????????????????
	 *
	 *
	 * ----------------------------------------------------------
	 */
	//??????log4js
	var log4js = __webpack_require__(1);
	var logger = log4js.getLogger("AnyChatSDKFileHandler");

	var AnyChatSDKErrorCode = __webpack_require__(5);

	var ANYCHAT_SDKCTRL_PPTHELPERINIT = 90; ///< PPT?????????????????????
	var ANYCHAT_SDKCTRL_PPTFILECTRL = 91; ///< PPT????????????
	var ANYCHAT_SDKCTRL_PPTFILEINFO = 92; ///< PPT????????????

	var BRPPT_FILETYPE_PPT = 0x01; ///< ppt??????
	var BRPPT_FILETYPE_VIDEO = 0x02; ///< ????????????
	var BRPPT_FILETYPE_AUDIO = 0x03; ///< ????????????
	var BRPPT_FILETYPE_COMMZIP = 0x04; ///< ??????zip??????

	//????????????
	function AnyChatSDKFileHandler(opt) {
	    this.guid = BRAC_NewGuid();
	    this.objParam = opt;
	    this.action = this.objParam.action;
	    this.fileParams = 0;
	    this.timer;
	    this.statusInfo = {
	        process: 0,
	        bitRate: 0,
	        status: 1
	    };
	    this.mediaDataInfo = [];
	}

	AnyChatSDKFileHandler.prototype = {
	    constructor: AnyChatSDKFileHandler,
	    start: function() {
	        var params = {};
	        params.taskGuid = this.guid;
	        this.objParam.userId && (params.userId = this.objParam.userId);
	        this.objParam.localPath && (params.localPath = this.objParam.localPath);
	        this.objParam.category && (params.category = this.objParam.category);
	        this.objParam.filename && (params.filename = this.objParam.filename);
	        this.objParam.fileurl && (params.fileurl = this.objParam.fileurl);
	        this.objParam.filetype && (params.filetype = this.objParam.filetype);
	        this.objParam.filemd5 && (params.filemd5 = this.objParam.filemd5);
	        this.objParam.fileid && (params.fileid = this.objParam.fileid);
	        this.objParam.strJson && (params.strJson = this.objParam.strJson);
	        
	        var time = 1000;
	        this.objParam.intervalTime && (time = this.objParam.intervalTime * 1000);
	        var guid = this.guid;
	        //var timer;
	        var opt = this.objParam;
	        var that = this;
	        if (that.timer) {
	            clearInterval(that.timer);
	        }
	        if (this.action == "upload") {
	            var errorCode = fileTrans(params);
	            if (errorCode == 0) {
	                that.timer = setInterval(function() {
	                    that.statusInfo = queryTaskStatus({
	                        taskGuid: params.taskGuid
	                    });

	                    if (typeof(opt.onTaskStatusChanged) === "function") {
	                        var resStatus = that.statusInfo;
	                        resStatus.taskId = params.taskGuid;
	                        AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
	                            type: "onTaskStatusChanged",
	                            data: resStatus
	                        });
	                    }

	                    if (that.statusInfo.progress == 100) {
	                        // if (that.objParam.userId) {
	                        //     var filename = that.objParam.localPath.substring(that.objParam.localPath.lastIndexOf('\\') + 1, that.objParam.localPath.length);
	                        //     var result = {
	                        //         code: 0,
	                        //         msg: ''
	                        //     };
	                        //     var data = {
	                        //         targetId: that.objParam.userId,
	                        //         filePath: that.objParam.localPath,
	                        //         filename: filename
	                        //     };
	                        //     AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
	                        //         type: "onFileTransferDone",
	                        //         result: result,
	                        //         data: data
	                        //     });
	                        // }
	                        clearInterval(that.timer);
	                        that.timer = null;
	                    }
	                }, time);
	            }


	            var funName = "FileUploadStart";
	            params.userId && (funName = "FileTransferStart");
	            logger.invokeLog(funName, errorCode, params);
	            return errorCode;
	        } else {
	            that.timer = setInterval(function() {
	                that.statusInfo = getDownLoadStatus({
	                    taskGuid: that.objParam.fileid
	                });

	                if (typeof(opt.onDownloadTaskStatusChanged) === "function") {
	                    var resStatus = that.statusInfo;
	                    resStatus.taskId = that.objParam.fileid;
	                    AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
	                        type: "onDownloadTaskStatusChanged",
	                        data: resStatus
	                    });
	                }

	                if (that.statusInfo.progress == 100) {
	                    clearInterval(that.timer);
	                    that.timer = null;
	                }

	            }, time);
	            var errorCode = startDownload(params, that);
	            logger.invokeLog("FileDownloadStart", errorCode, params);
	            return errorCode;
	        }

	    },
	    cancel: function() {
	        var errorCode;

	        if (this.action == "upload") {
	            errorCode = cancelTransFile({
	                taskGuid: this.guid
	            });
	            var funName = "FileUploadCancel";
	            this.objParam.userId && (funName = "FileTransferCancel");
	            AnyChatWebSDK.anychatSDKInstance.callbackFunctionDestroy({
	                onTaskStatusChanged:this.objParam.onTaskStatusChanged
	            });
	            logger.invokeLog(funName, errorCode);
	        } else {
	            errorCode = cancelDownload({
	                taskGuid: this.objParam.fileid
	            });
	            logger.invokeLog("FileDownloadCancel", errorCode);
	            AnyChatWebSDK.anychatSDKInstance.callbackFunctionDestroy({
	                onDownloadTaskStatusChanged:this.objParam.onDownloadTaskStatusChanged
	            });

	        }
	        if(this.timer != null){
	            clearInterval(this.timer);
	            this.timer = null;

	        }
	        this.guid = "";
	        return errorCode;
	    },
	    getStatus: function() {
	        if (this.action == "upload") {
	            var currentStatus = queryTaskStatus({
	                taskGuid: this.guid
	            });
	            return currentStatus;
	        } else {
	            var currentStatus = getDownLoadStatus({
	                taskGuid: this.objParam.fileid
	            });
	            return currentStatus;
	        }
	    },
	    downloadInit: function() {
	        var json = { "savepath": this.objParam.savepath };
	        BRAC_SDKControl(ANYCHAT_SDKCTRL_PPTHELPERINIT, JSON.stringify(json));
	    }

	};

	// ????????????/??????
	function fileTrans(params) {
	    var userId = 0;
	    var string = {};
	    if (params.userId) {
	        userId = params.userId;
	    }
	    var path = "";
	    if (params.localPath) {
	        path = params.localPath;
			string.localPath = params.localPath;
	    }
	    if (params.category) {
	        string.category = params.category;
	    }
	    if (params.filename) {
	        string.filename = params.filename;
	    }
		if (params.strJson) {
	        string.strJson = params.strJson;
	    }
	    var errorCode = BRAC_TransFileEx(params.taskGuid, userId, path, 0, JSON.stringify(string));
	    return errorCode;
	}

	// ????????????????????????
	function cancelTransFile(params) {
	   return BRAC_CancelTransTaskEx(params.taskGuid, 0, 0);
	}

	// ????????????????????????
	function queryTaskStatus(params) {
	    var statusInfo = {};
	    statusInfo.progress = BRAC_QueryTransTaskInfoEx(params.taskGuid, BRAC_TRANSTASK_PROGRESS);
	    statusInfo.bitRate = BRAC_QueryTransTaskInfoEx(params.taskGuid, BRAC_TRANSTASK_BITRATE);
	    statusInfo.status = BRAC_QueryTransTaskInfoEx(params.taskGuid, BRAC_TRANSTASK_STATUS);
	    return statusInfo;
	}

	//????????????
	function startDownload(params, fileObj) {
	    var json = {
	        "ctrlcode": BRPPT_FILECTRL_DOWNLOAD,
	        "fileid": params.fileid,
	        "fileurl": params.fileurl,
	        "filemd5": params.filemd5 ? params.filemd5:"",
	        "filetype": params.filetype
	    };
	    var res = JSON.parse(BRAC_SDKControl(ANYCHAT_SDKCTRL_PPTFILECTRL, JSON.stringify(json)));
	    if (res.errorcode == 0) {
	        var obj = {};
	        obj.fileid = params.fileid;
	        obj.type = params.filetype;
	        fileObj.mediaDataInfo.push(obj);
	    }
	    return res.errorcode;
	}

	//??????????????????
	function cancelDownload(params) {
	    var json = { "ctrlcode": BRPPT_FILECTRL_CANCEL, "fileid": params.taskGuid };
	    return BRAC_SetSDKOption(BRAC_SO_CORESDK_PPTFILECTRL, JSON.stringify(json));
	}

	//????????????????????????
	function getDownLoadStatus(params) {
	    var json = { "infocode": BRPPT_FILEINFO_DOWNLOAD_STATUS, "fileid": params.taskGuid };
	    var result = BRAC_SDKControl(ANYCHAT_SDKCTRL_PPTFILEINFO, JSON.stringify(json));
	    return JSON.parse(result);
	}

	// ????????????????????????
	function transfromCallBack(lpEventJsonStr){
		var lpEventJsonObj = JSON.parse(lpEventJsonStr);
		if (lpEventJsonObj.errorcode != 0) {
		    var result = {
		        code: lpEventJsonObj.errorcode,
		        msg: AnyChatSDKErrorCode.checkErrorMsg(lpEventJsonObj.errorcode)
		    };
		    var data = {};
		    AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
		        type: lpEventJsonObj.taskguid,
		        result: result,
		        data: data
		    });
		    return;
		}
		var result = {
		    code: lpEventJsonObj.errorcode,
		    msg: AnyChatSDKErrorCode.checkErrorMsg(lpEventJsonObj.errorcode)
		};
		var data = {
				fileLength: lpEventJsonObj.length,
				filePath: lpEventJsonObj.pathname,
				filename: lpEventJsonObj.filename
			};
		AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
		    type: lpEventJsonObj.taskguid,
		    result: result,
		    data: data
		});
	}

	//??????????????????
	function downLoadCallBack(lpEventJsonStr) {

	    var lpEventJsonObj = JSON.parse(lpEventJsonStr);
		var json = get_ppt_info(lpEventJsonObj.fileid);
	    var obj = {};
	    if (lpEventJsonObj.errorcode != 0) {

	        var result = {
	            code: lpEventJsonObj.errorcode,
	            msg: AnyChatSDKErrorCode.checkErrorMsg(lpEventJsonObj.errorcode)
	        };

	        var data = {};
	        AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
	            type: json.fileid,
	            result: result,
	            data: data
	        });
	        return;
	    }
	   


	    obj.dataInfo = json;
	    obj.downloadResult = lpEventJsonObj;
	    var newJson = init_media_address(json);


	    var result = {
	        code: lpEventJsonObj.errorcode,
	        msg: AnyChatSDKErrorCode.checkErrorMsg(lpEventJsonObj.errorcode)
	    };

	    var data = newJson;
	    AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
	        type:  data.fileid,
	        result: result,
	        data: data
	    });

	}

	/**
	 * ?????????????????????
	 */
	function init_media_address(json) {
	    var filePath = json.filepath;
	    var fileDetail = json.details;
	    switch (fileDetail.file_type) {
	        case BRPPT_FILETYPE_PPT:
	            var audio_address = filePath + fileDetail.audio_address;
	            var pptList = [];
	            var pptDetail_list = fileDetail.pptlist;
	            for (var i = 0; i < pptDetail_list.length; i++) {
	                var obj = {};
	                obj.ppt_address = filePath + pptDetail_list[i].ppt_address;
	                obj.audio_start = pptDetail_list[i].audio_start;
	                obj.audio_end = pptDetail_list[i].audio_end;
	                pptList.push(obj);
	            }
	            json.details.audio_address = audio_address;
	            json.details.pptlist = pptList;
	            break;
	        case BRPPT_FILETYPE_VIDEO:
	            //var video_address = filePath;
	            //json.details.video_address = video_address;
	            break;
	        case BRPPT_FILETYPE_AUDIO:
	            //var audio_address = filePath+fileDetail.audio_address;
	            //json.details.audio_address = audio_address;
	            break;
	    }

	    return json;
	}


	/**
	 * ?????????????????????ppt????????????
	 */
	function get_ppt_info(fileid) {
	    var json = { "infocode": BRPPT_FILEINFO_PPTDETAILS, "fileid": fileid };
	    var result = BRAC_SDKControl(ANYCHAT_SDKCTRL_PPTFILEINFO, JSON.stringify(json));
	    return JSON.parse(result);
	}

	// ????????????
	function deleteFile(opt) {
	    var json = { "filename": opt.filename };
	    var result = BRAC_SDKControl(ANYCHAT_SDKCTRL_FILEDELETE, JSON.stringify(json));
	    return JSON.parse(result).errorcode;
	}

	// ????????????
	function encryptFile(opt) {
	    var enckey = opt.enckey;
	    var filename = opt.filename;
	    var targetfile = opt.targetfile ? opt.targetfile : "";
	    var flags = 0x1;
	    var json = {
	        enckey: enckey,
	        filename: filename,
	        targetfile: targetfile,
	        flags: flags
	    };
	    var ret = BRAC_SetSDKOption(BRAC_SO_CORESDK_FILEENCANDDEC, JSON.stringify(json));
	    return ret;
	}
	// ????????????
	function decryptFile(opt) {
	    var enckey = opt.enckey;
	    var filename = opt.filename;
	    var targetfile = opt.targetfile ? opt.targetfile : "";
	    var flags = 0x2;
	    var json = {
	        enckey: enckey,
	        filename: filename,
	        targetfile: targetfile,
	        flags: flags
	    };
	    var ret = BRAC_SetSDKOption(BRAC_SO_CORESDK_FILEENCANDDEC, JSON.stringify(json));
	    return ret;
	}

	// ??????????????????
	function getDiskSize(opt) {
	    var json = {pathname: opt.pathname};
	    var result = BRAC_SDKControl(ANYCHAT_SDKCTRL_DISKSIZE, JSON.stringify(json));
	    return result;
	}


	exports.instance = AnyChatSDKFileHandler;
	exports.downLoadCallBack = downLoadCallBack;
	exports.transfromCallBack = transfromCallBack;
	exports.deleteFile = deleteFile;
	exports.encryptFile = encryptFile;
	exports.decryptFile = decryptFile;
	exports.getDiskSize = getDiskSize;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	/*-----------------------------------------------------------
	 * AnyChat?????????????????????
	 * ????????????:?????????????????????????????????????????????
	 *
	 *
	 * ----------------------------------------------------------
	 */
	//??????log4js
	var log4js = __webpack_require__(1);
	var logger = log4js.getLogger("AnyChatSDKVideoCallHandler");

	//????????????
	function AnyChatSDKVideoCallHandler() {
	    this.isVideoCall = false;
	    this.cameraObjList = [];
	}

	AnyChatSDKVideoCallHandler.prototype = {
	    constructor: AnyChatSDKVideoCallHandler,
	    request: function(opt) {
	        return requestVideoCall(opt);
	    },
	    accept: function(opt) {
	        return acceptVideoCall(opt);
	    },
	    reject: function(opt) {
	        return rejectVideoCall(opt);
	    },
	    hangup: function(opt) {
	        return hangupVideoCall(opt);
	    },
	    cancel: function(opt) {
	        return cancelVideoCall(opt);
	    },
	    openRemoteControl: openRemoteControl,
	    finishRemoteControl: finishRemoteControl
	};


	// ?????????????????????????????????
	function requestVideoCall(params) {
	    var szUserStr = "";
	    if(params.hasOwnProperty("szUserStr")){
	        szUserStr = params.szUserStr;
	    }
	    var errorCode = BRAC_VideoCallControl(BRAC_VIDEOCALL_EVENT_REQUEST, params.userId, 0, 0, 0, szUserStr);
	    return errorCode;
	}

	// ??????????????????????????????
	function acceptVideoCall(params) {
	    var szUserStr = "";
	    if(params.hasOwnProperty("szUserStr")){
	        szUserStr = params.szUserStr;
	    }
	    var errorCode = BRAC_VideoCallControl(BRAC_VIDEOCALL_EVENT_REPLY, params.userId, 0, 0, 0, szUserStr);
	    return errorCode;
	}

	// ??????????????????????????????
	function rejectVideoCall(params) {
	    var szUserStr = "";
	    if(params.hasOwnProperty("szUserStr")){
	        szUserStr = params.szUserStr;
	    }
	    var errorCode = BRAC_VideoCallControl(BRAC_VIDEOCALL_EVENT_REPLY, params.userId, GV_ERR_SESSION_REFUSE, 0, 0, szUserStr);
	    return errorCode;
	}

	// ??????????????????
	function cancelVideoCall(params) {
	    var szUserStr = "";
	    if(params.hasOwnProperty("szUserStr")){
	        szUserStr = params.szUserStr;
	    }
	    var errorCode = BRAC_VideoCallControl(BRAC_VIDEOCALL_EVENT_REPLY, params.userId, GV_ERR_SESSION_QUIT, 0, 0, szUserStr);
	    return errorCode;
	}

	// ??????????????????
	function hangupVideoCall(params) {
	    var szUserStr = "";
	    if(params.hasOwnProperty("szUserStr")){
	        szUserStr = params.szUserStr;
	    }
	    var errorCode = BRAC_VideoCallControl(BRAC_VIDEOCALL_EVENT_FINISH, params.userId, 0, 0, 0, szUserStr);
	    return errorCode;
	}

	// ????????????
	function openRemoteControl(params) {
	    var videoobj = GetID(params.objId);
	    GetID(params.renderId).removeChild(videoobj);
	    BRAC_SetVideoPosEx(params.userId, GetID(params.renderId), params.objId, params.streamIndex);
	    var errorCode = GetID(params.objId).SetSDKOptionInt(ANYCHATWEB_VIDEO_SO_VIDEODISPMODE, 1);
	    errorCode = GetID(params.objId).SetSDKOptionInt(ANYCHATWEB_VIDEO_SO_REMOTEASSIST, 1);
	    return errorCode;

	}

	// ??????????????????
	function finishRemoteControl(params) {
	    GetID(params.objId).SetSDKOptionInt(ANYCHATWEB_VIDEO_SO_VIDEODISPMODE, 0);
	    GetID(params.objId).SetSDKOptionInt(ANYCHATWEB_VIDEO_SO_REMOTEASSIST, 0);
	}

	// ??????????????????
	function requestRemoteControl(params) {
	    var errorCode = BRAC_VideoCallControl(BRAC_VIDEOCALL_EVENT_REQUEST, params.userId, 0, 0, 0, "remoteControl");
	    return errorCode;
	}

	AnyChatSDKVideoCallHandler.prototype.callbackFunctionRegister = function(AnyChatSDK, option) {
	    if (typeof option.videoCallOpt === "object") {
	        typeof(option.videoCallOpt.onReceiveVideoCallRequest) === "function" && AnyChatWebSDK.anychatSDKInstance.setCallBack("onReceiveVideoCallRequest", option.videoCallOpt.onReceiveVideoCallRequest, false);
	        typeof(option.videoCallOpt.onReceiveVideoCallStart) === "function" && AnyChatWebSDK.anychatSDKInstance.setCallBack("onReceiveVideoCallStart", option.videoCallOpt.onReceiveVideoCallStart, false);
	        typeof(option.videoCallOpt.onReceiveVideoCallFinish) === "function" && AnyChatWebSDK.anychatSDKInstance.setCallBack("onReceiveVideoCallFinish", option.videoCallOpt.onReceiveVideoCallFinish, false);
	        typeof(option.videoCallOpt.onReceiveVideoCallError) === "function" && AnyChatWebSDK.anychatSDKInstance.setCallBack("onReceiveVideoCallError", option.videoCallOpt.onReceiveVideoCallError, false);
	    }
	};

	//??????DOM??????
	function GetID(id) {
	    if (document.getElementById) {
	        return document.getElementById(id);
	    } else if (window[id]) {
	        return window[id];
	    }
	    return null;
	}

	var instance = new AnyChatSDKVideoCallHandler();

	exports.instance = instance;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	/*-----------------------------------------------------------
	 * AnyChat???????????????
	 * ????????????:???????????????????????????????????????????????????
	 * 
	 * 
	 * ----------------------------------------------------------
	 */

	//??????log4js
	var log4js = __webpack_require__(1);
	var logger = log4js.getLogger("AnyChatSDKFileHandler");

	var AnyChatSDKErrorCode = __webpack_require__(5);

	var USERINFO_NAME = 1; // ??????????????????
	var USERINFO_IP = 2; // ??????IP????????????


	//????????????
	function AnyChatSDKFriendHandler() {

	}

	AnyChatSDKFriendHandler.prototype = {
	    constructor: AnyChatSDKFriendHandler,

	    getUserFriends: function() {
	        var list = [];
	        list = BRAC_GetUserFriends();
	        return list;
	    },
	    getFriendInfo: function(opt) {
	        return BRAC_GetUserInfo(opt.userId, opt.infoId);
	    },
	    getFriendNickName: function(opt) {
	        return BRAC_GetUserInfo(opt.userId, USERINFO_NAME);
	    },
	    getFriendIP: function(opt) {
	        return BRAC_GetUserInfo(opt.userId, USERINFO_IP);
	    }
	}

	AnyChatSDKFriendHandler.prototype.callbackFunctionRegister = function(AnyChatSDK, option) {
	    if (typeof option.friendOpt === "object") {
	        typeof(option.friendOpt.onAnyChatFriendStatus) === "function" && AnyChatWebSDK.anychatSDKInstance.setCallBack("onAnyChatFriendStatus", option.friendOpt.onAnyChatFriendStatus, false);
	    }
	};

	var instance = new AnyChatSDKFriendHandler();

	exports.instance = instance;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	/*-----------------------------------------------------------
	 * AnyChat?????????????????????
	 * ????????????:???????????????????????????????????????
	 *
	 *
	 * ----------------------------------------------------------
	 */

	//??????log4js
	var log4js = __webpack_require__(1);
	var logger = log4js.getLogger("AnyChatSDKStreamPlayHandler");

	var AnyChatSDKErrorCode = __webpack_require__(5);

	// ???????????????????????????
	function AnyChatSDKStreamPlayHandler(opt) {
	    this.guid = opt.guid ? opt.guid : BRAC_NewGuid();
	    this.streamType = opt.streamType; // 1 ??????  2 ??????  3 ?????????  4 ppt
	    this.streamPath = opt.streamPath; // ???????????????
	    this.strParam = opt.strParam ? JSON.parse(opt.strParam) : {}; // ????????????
	    this.streamindex = opt.streamindex ? opt.streamindex : 0; // ???????????????
	    this.strParam.streamindex = this.streamindex;
	    this.divId = opt.divId;  // ????????????div??????
	}

	AnyChatSDKStreamPlayHandler.prototype = {
	    constructor: AnyChatSDKStreamPlayHandler,
	    initStreamPlay: function(){
	        if(this.streamType == 4){
	            var ANYCHAT_STREAMPLAY_FLAGS_PPTPLAY = 0x00000080 ;    ///< ppt??????,????????????
	            var dwBitrate = 400000;
	            BRAC_SetUserStreamInfo(-1, this.streamindex, BRAC_SO_LOCALVIDEO_BITRATECTRL, dwBitrate);
	        
	            //??????????????????
	            var dwEnabled = 1;
	            BRAC_SetUserStreamInfo(-1, this.streamindex, BRAC_SO_CORESDK_EXTVIDEOINPUT, dwEnabled);
	            this.streamType = ANYCHAT_STREAMPLAY_FLAGS_REPLACEAUDIOINPUT | ANYCHAT_STREAMPLAY_FLAGS_REPLACEVIDEOINPUT | ANYCHAT_STREAMPLAY_FLAGS_PPTPLAY;					
	        }
	        if (this.streamType == 5) {//base64??????
	            var ANYCHAT_STREAMPLAY_FLAGS_MEMORYSTEAM = 0x00000100;
	            this.streamType = ANYCHAT_STREAMPLAY_FLAGS_MEMORYSTEAM | ANYCHAT_STREAMPLAY_FLAGS_REPLACEAUDIOINPUT
	        }
	        return BRAC_StreamPlayInit(this.guid, this.streamPath, this.streamType, JSON.stringify(this.strParam));
	    },
	    setPos: function(){
	        BRAC_StreamPlaySetVideoPos(this.guid, document.getElementById(this.divId), "ANYCHAT_STREAMPLAY_" + this.divId);
	    },
	    play: function(opt){
	        var strParam = '';
	        if(opt && opt.strParam)
	            strParam = opt.strParam;
	        return BRAC_StreamPlayControl(this.guid, ANYCHAT_STREAMPLAY_CTRL_START, 0, 0, strParam);
	    },
	    pause: function(opt){
	        var strParam = '';
	        if(opt && opt.strParam)
	            strParam = opt.strParam;
	        return BRAC_StreamPlayControl(this.guid, ANYCHAT_STREAMPLAY_CTRL_PAUSE, 0, 0, strParam);
	    },
	    stop: function(opt){
	        var strParam = '';
	        if(opt && opt.strParam)
	            strParam = opt.strParam;
	        return BRAC_StreamPlayControl(this.guid, ANYCHAT_STREAMPLAY_CTRL_STOP, 0, 0, strParam);
	    },
	    seek: function(opt){
	        var strParam = '';
	        if(opt && opt.strParam)
	            strParam = opt.strParam;
	        return BRAC_StreamPlayControl(this.guid, ANYCHAT_STREAMPLAY_CTRL_SEEK, opt.seekPos, 0, strParam);
	    },
	    speedCtrl: function(opt){
	        var strParam = '';
	        if(opt && opt.strParam)
	            strParam = opt.strParam;
	        return BRAC_StreamPlayControl(this.guid, ANYCHAT_STREAMPLAY_CTRL_SPEEDCTRL, opt.speed, 0, strParam);
	    },
	    loopCtrl: function(opt){
	        var strParam = '';
	        if(opt && opt.strParam)
	            strParam = opt.strParam;
	        if(opt.loop){
	            return BRAC_StreamPlayControl(this.guid, ANYCHAT_STREAMPLAY_CTRL_OPENLOOP, 0, 0, strParam);
	        } else {
	            return BRAC_StreamPlayControl(this.guid, ANYCHAT_STREAMPLAY_CTRL_CLOSELOOP, 0, 0, strParam);
	        }
	    },
	    getInfo: function(){
	        return BRAC_StreamPlayGetInfo(this.guid, ANYCHAT_STREAMPLAY_INFO_JSONVALUE);
	    },
	    destory: function(){
	        if (document.getElementById(this.divId)) {//??????????????????Id
	            document.getElementById(this.divId).innerHTML = "";
	        }
	        return BRAC_StreamPlayDestroy(this.guid, 0);
	    },
	    onPlay: function (lpEventJsonStr){
	        var eventJsonObj = JSON.parse(lpEventJsonStr);
	        if (this.guid == eventJsonObj.taskguid) {
	            AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
	                type: "onStreamPlayStart"
	            });
	        }
	    },
	    onStop: function(lpEventJsonStr){
	        var eventJsonObj = JSON.parse(lpEventJsonStr);
	        if(this.guid == eventJsonObj.taskguid){
	            var errorObj = eventJsonObj.strparam;
	            var result = {
	                code: errorObj.errorcode,
	                msg: AnyChatSDKErrorCode.checkErrorMsg(errorObj.errorcode)
	            };
	            AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
	                type: "onStreamPlayStop",
	                result: result
	            });
	        }
	    }
	};

	function onPlay(lpEventJsonStr) {
	    var eventJsonObj = JSON.parse(lpEventJsonStr);
	    if (this.guid == eventJsonObj.taskguid) {
	        AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
	            type: "onStreamPlayStart"
	        });
	    }
	}

	function onStop(lpEventJsonStr) {
	    var eventJsonObj = JSON.parse(lpEventJsonStr);
	    if (this.guid == eventJsonObj.taskguid) {
	        var errorObj = eventJsonObj.strparam;
	        var result = {
	            code: errorObj.errorcode,
	            msg: AnyChatSDKErrorCode.checkErrorMsg(errorObj.errorcode)
	        };
	        AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
	            type: "onStreamPlayStop",
	            result: result
	        });
	    }
	}

	exports.instance = AnyChatSDKStreamPlayHandler;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	/*-----------------------------------------------------------
	 * AnyChat?????????????????????
	 * ????????????:???????????????????????????????????????
	 *
	 *
	 * ----------------------------------------------------------
	 */
	//??????log4js
	var log4js = __webpack_require__(1);
	var logger = log4js.getLogger("AnyChatSDKAudioHandler");

	var AnyChatSDKUserHandler = __webpack_require__(4);

	// ???????????????????????????
	function AnyChatSDKAudioHandler(deviceName) {
	    this.deviceName = deviceName;
	    this.name = deviceName.substring(deviceName.indexOf('-') + 1, deviceName.length);
	    this.idx = deviceName.substring(0, deviceName.indexOf('-'));
	    this.vadctrl = 1; // ????????????????????????
	    this.nsctrl = 1; // ????????????????????????
	    this.echoctrl = 1; // ????????????????????????
	    this.agcctrl = 1; // ????????????????????????
	    this.capturemode = 0; // ???????????????????????????????????????int??????0 ???????????????1 ???????????????2 ??????OK?????????3 ?????????????????????
	}

	AnyChatSDKAudioHandler.prototype = {
	    constructor: AnyChatSDKAudioHandler,
	    config: function(opt) {
	        if (opt.hasOwnProperty("vadctrl")) {
	            this.vadctrl = opt.vadctrl;
	            BRAC_SetSDKOption(BRAC_SO_AUDIO_VADCTRL, opt.vadctrl);
	        }
	        if (opt.hasOwnProperty("nsctrl")) {
	            this.nsctrl = opt.nsctrl;
	            BRAC_SetSDKOption(BRAC_SO_AUDIO_NSCTRL, opt.nsctrl);
	        }
	        if (opt.hasOwnProperty("echoctrl")) {
	            this.echoctrl = opt.echoctrl;
	            BRAC_SetSDKOption(BRAC_SO_AUDIO_ECHOCTRL, opt.echoctrl);
	        }
	        if (opt.hasOwnProperty("agcctrl")) {
	            this.agcctrl = opt.agcctrl;
	            BRAC_SetSDKOption(BRAC_SO_AUDIO_AGCCTRL, opt.agcctrl);
	        }
	        if (opt.hasOwnProperty("capturemode")) {
	            this.capturemode = opt.capturemode;
	            BRAC_SetSDKOption(BRAC_SO_AUDIO_CAPTUREMODE, opt.capturemode);
	        }
	    },
	    open: function() {
	        BRAC_SelectVideoCapture(BRAC_DEVICE_AUDIOCAPTURE, this.deviceName);
	        var errorCode = openAudio(AnyChatSDKUserHandler.instance.userId);
	        var params = { userId: AnyChatSDKUserHandler.instance.userId };
	        logger.invokeLog("localMicrophoneOpen", errorCode, params);
	        return errorCode;
	    },
	    close: function() {
	        var errorCode = closeAudio(AnyChatSDKUserHandler.instance.userId);
	        var params = { userId: AnyChatSDKUserHandler.instance.userId };
	        logger.invokeLog("localMicrophoneClose", errorCode, params);
	        return errorCode;
	    }
	};

	//???????????????
	function openAudio(userId) {
	    var errorCode = BRAC_UserSpeakControlEx(userId, 1, 0, 0, "");
	    return errorCode;
	}

	//???????????????
	function closeAudio(userId, streamIndex) {
	    var errorCode = BRAC_UserSpeakControlEx(userId, 0, 0, 0, "");
	    return errorCode;
	}


	exports.instance = AnyChatSDKAudioHandler;
	exports.openAudio = openAudio;
	exports.closeAudio = closeAudio;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	/*-----------------------------------------------------------
	 * AnyChat?????????????????????
	 * ????????????:???????????????????????????????????????
	 *
	 *
	 * ----------------------------------------------------------
	 */
	//??????log4js
	var log4js = __webpack_require__(1);
	var logger = log4js.getLogger("AnyChatSDKVideoHandler");

	var AnyChatSDKUserHandler = __webpack_require__(4);

	//????????????
	function AnyChatSDKVideoHandler(deviceName) {
	    this.deviceName = deviceName;

	    this.hasStreamIndex = false;
	    this.name = deviceName.substring(deviceName.indexOf('-') + 1, deviceName.length);
	    this.idx = deviceName.substring(0, deviceName.indexOf('-'));
	    this.streamIndex = deviceName.substring(0, deviceName.indexOf('-')) -1;
	    this.demoId;
	    this.isInventCamera = false;
	    if (this.name == "Native Screen Camera") {
	        this.isInventCamera = true;
	    }
	    this.isOpen = false;
	    this.bitRate = 90000; // ????????????????????????????????????int????????????bps????????????????????????VideoBitrate???
	    this.quality = 3; // ??????????????????????????????????????????int???????????????????????????VideoQuality???
	    this.gop = 30; // ?????????????????????????????????????????????int???????????????????????????VideoGOPSize???
	    this.width = 320; // ?????????????????????????????????(??????)
	    this.height = 240; // ?????????????????????????????????(??????)
	    this.fps = 15; // ?????????????????????????????????
	    this.preset = 3; // ????????????????????????????????????????????????????????????????????????CPU?????????????????????
	}

	AnyChatSDKVideoHandler.prototype = {
	    constructor: AnyChatSDKVideoHandler,
	    config: function(opt) {
	        opt.bitRate && (this.bitRate = opt.bitRate);
	        opt.quality && (this.quality = opt.quality);
	        opt.width && (this.width = opt.width);
	        opt.height && (this.height = opt.height);
	        opt.gop && (this.gop = opt.gop);
	        opt.fps && (this.fps = opt.fps);
	        opt.preset && (this.preset = opt.preset);

	        videoConfig(this.streamIndex, opt)
	    },
	    open: function(opt) {
	        var params = {};
	        this.demoId = opt.id;
	        if (typeof(opt.streamIndex) === "number") {
	            this.streamIndex = opt.streamIndex;
	            this.hasStreamIndex = true;
	            params = {
	                userId: AnyChatSDKUserHandler.instance.userId,
	                streamIndex: this.streamIndex,
	                deviceName: this.deviceName,
	                demoId: opt.id ? opt.id : "",
	                isShareDesktop: this.isInventCamera
	            };
	            var errorCode = openVideo(params);
	        } else {
	            params = {
	                userId: AnyChatSDKUserHandler.instance.userId,
	                deviceName: this.deviceName,
	                demoId: opt.id ? opt.id : "",
	                isShareDesktop: this.isInventCamera
	            };
	            var errorCode = openVideo(params);
	        }

	        if (errorCode == 0) {
	            this.isOpen = true;
	        }

	        logger.invokeLog("localCameraOpen", errorCode, params);
	        return errorCode;

	    },
	    close: function() {
	        var params = {};
	        if (this.hasStreamIndex) {
	            params = {
	                userId: AnyChatSDKUserHandler.instance.userId,
	                streamIndex: this.streamIndex
	            };
	            var errorCode = closeVideo(params);
	        } else {
	            params = {
	                userId: AnyChatSDKUserHandler.instance.userId
	            };
	            var errorCode = closeVideo(params);
	        }
	        if (errorCode == 0) {
	            this.isOpen = false;
	        }
	        logger.invokeLog("localCameraClose", errorCode, params);
	        if(this.demoId){
				GetID(this.demoId).innerHTML = "";
			}
	        return errorCode;
	    }
	};



	//???????????????
	function openVideo(params) {
	    var errorCode;
	    if (typeof(params.streamIndex) === "number") {
	        if (params.userId == AnyChatSDKUserHandler.instance.userId) {
	            //??????
	            if (!params.isShareDesktop) {
	                // BRAC_SelectVideoCapture(1, params.deviceName);
	                BRAC_SetUserStreamInfo(params.userId, params.streamIndex, BRAC_SO_LOCALVIDEO_DEVICENAME, params.deviceName);
	                errorCode = BRAC_UserCameraControlEx(params.userId, 1, params.streamIndex, 0, "");
	                BRAC_SetVideoPosEx(params.userId, GetID(params.demoId), "ANYCHAT_VIDEO_LOCAL_" + params.demoId, params.streamIndex);
	            } else {
	                BRAC_SetUserStreamInfo(params.userId, params.streamIndex, BRAC_SO_LOCALVIDEO_DEVICENAME, params.deviceName);
	                // desktopParamsSetting(params.userId, params.streamIndex); //?????????????????????????????????
	                errorCode = BRAC_UserCameraControlEx(params.userId, 1, params.streamIndex, 0, "");
	                if (params.demoId != "") {
	                    BRAC_SetVideoPosEx(params.userId, GetID(params.demoId), "ANYCHAT_VIDEO_LOCAL_" + params.demoId, params.streamIndex);
	                } 
	            }
	        } else {
	            //??????
	            errorCode = BRAC_UserCameraControlEx(params.userId, 1, params.streamIndex, 0, "");
	            BRAC_SetVideoPosEx(params.userId, GetID(params.demoId), "ANYCHAT_VIDEO_REMOTE_" + params.demoId, params.streamIndex);
	        }
	    } else {
	        if (params.userId == AnyChatSDKUserHandler.instance.userId) {
	            //??????
	            BRAC_SetUserStreamInfo(params.userId, 0, BRAC_SO_LOCALVIDEO_DEVICENAME, params.deviceName);
	            errorCode = BRAC_UserCameraControl(params.userId, 1);
	            BRAC_SetVideoPos(params.userId, GetID(params.demoId), "ANYCHAT_VIDEO_LOCAL_" + params.demoId);
	        } else {
	            //??????
	            errorCode = BRAC_UserCameraControl(params.userId, 1);
	            BRAC_SetVideoPos(params.userId, GetID(params.demoId), "ANYCHAT_VIDEO_REMOTE_" + params.demoId);
	        }
	    }
	    return errorCode;
	}

	//???????????????
	function closeVideo(params) {
	    var errorCode;
	    if (params.hasOwnProperty("streamIndex")) {
	        errorCode = BRAC_UserCameraControlEx(params.userId, 0, params.streamIndex, 0, "");
	    } else {
	        errorCode = BRAC_UserCameraControl(params.userId, 0);
	    }
	    return errorCode;
	}

	function desktopParamsSetting(userid, deviceIdx) {
	    // ???????????????????????????????????????????????????0???????????????????????????????????????
	    BRAC_SetUserStreamInfo(userid, deviceIdx, BRAC_SO_LOCALVIDEO_BITRATECTRL, 1500000);

	    // ?????????????????????????????????
	    BRAC_SetUserStreamInfo(userid, deviceIdx, BRAC_SO_LOCALVIDEO_QUALITYCTRL, 3);

	    // ?????????????????????????????????
	    BRAC_SetUserStreamInfo(userid, deviceIdx, BRAC_SO_LOCALVIDEO_WIDTHCTRL, 1920);
	    BRAC_SetUserStreamInfo(userid, deviceIdx, BRAC_SO_LOCALVIDEO_HEIGHTCTRL, 1080);

	    // ?????????????????????????????????
	    BRAC_SetUserStreamInfo(userid, deviceIdx, BRAC_SO_LOCALVIDEO_FPSCTRL, 20);

	    // ??????????????????????????????????????????
	    BRAC_SetUserStreamInfo(userid, deviceIdx, BRAC_SO_LOCALVIDEO_GOPCTRL, 80);

	    // ????????????????????????????????????????????????????????????????????????CPU?????????????????????
	    BRAC_SetUserStreamInfo(userid, deviceIdx, BRAC_SO_LOCALVIDEO_PRESETCTRL, 3);

	    // ?????????????????????
	    BRAC_SetUserStreamInfo(userid, deviceIdx, BRAC_SO_LOCALVIDEO_APPLYPARAM, 1);
	}

	function videoConfig(dwStreamIndex, params) {

	    // ???????????????????????????????????????????????????0???????????????????????????????????????
	    params.hasOwnProperty("bitRate") && BRAC_SetUserStreamInfo(-1, dwStreamIndex, BRAC_SO_LOCALVIDEO_BITRATECTRL, params.bitRate);

	    // ?????????????????????????????????????????????int???????????????bps???
	    params.hasOwnProperty("recordBitRate") && BRAC_SetUserStreamInfo(-1, dwStreamIndex, BRAC_SO_RECORD_VIDEOBR, params.recordBitRate);

	    // ???????????????????????????????????????int???????????????bps???
	    params.hasOwnProperty("recordBitRate") && BRAC_SetSDKOption(BRAC_SO_RECORD_VIDEOBR, params.recordBitRate);

	    // ?????????????????????????????????
	    params.hasOwnProperty("quality") && BRAC_SetUserStreamInfo(-1, dwStreamIndex, BRAC_SO_LOCALVIDEO_QUALITYCTRL, params.quality);

	    // ?????????????????????????????????
	    params.hasOwnProperty("width") && BRAC_SetUserStreamInfo(-1, dwStreamIndex, BRAC_SO_LOCALVIDEO_WIDTHCTRL, params.width);
	    params.hasOwnProperty("height") && BRAC_SetUserStreamInfo(-1, dwStreamIndex, BRAC_SO_LOCALVIDEO_HEIGHTCTRL, params.height);

	    // ?????????????????????????????????
	    params.hasOwnProperty("fps") && BRAC_SetUserStreamInfo(-1, dwStreamIndex, BRAC_SO_LOCALVIDEO_FPSCTRL, params.fps);
	    // ??????????????????????????????????????????
	    params.hasOwnProperty("gop") && BRAC_SetUserStreamInfo(-1, dwStreamIndex, BRAC_SO_LOCALVIDEO_GOPCTRL, params.gop);
	    // ????????????????????????????????????????????????????????????????????????CPU?????????????????????
	    params.hasOwnProperty("preset") && BRAC_SetUserStreamInfo(-1, dwStreamIndex, BRAC_SO_LOCALVIDEO_PRESETCTRL, params.preset);

	    // ???????????????????????????????????????????????????int??????0 ????????????????????????[??????]???1 ?????????????????????????????????????????????????????????????????????????????????????????????
	    params.hasOwnProperty("videoSizePolitic") && BRAC_SetSDKOption(BRAC_SO_LOCALVIDEO_VIDEOSIZEPOLITIC, params.videoSizePolitic);

	    // ?????????????????????????????????????????????int?????? 0 ????????????????????????[??????]???1 ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
	    params.hasOwnProperty("deinterlace") && BRAC_SetSDKOption(BRAC_SO_LOCALVIDEO_DEINTERLACE, params.deinterlace);

	    // ?????????????????????????????????????????????int??????1????????????????????? 0?????????????????????
	    params.hasOwnProperty("focusCtrl") && BRAC_SetSDKOption(BRAC_SO_LOCALVIDEO_FOCUSCTRL, params.focusCtrl);

	    // ????????????????????????????????????????????????int??????-1???????????????????????????????????????????????????????????????BRAC_PixelFormat???
	    params.hasOwnProperty("pixfmtCtrl") && BRAC_SetSDKOption(BRAC_SO_LOCALVIDEO_PIXFMTCTRL, params.pixfmtCtrl);

	    // ??????????????????Overlay??????????????????int??????1????????????Overlay????????? 0??????????????????[??????]???
	    params.hasOwnProperty("overlay") && BRAC_SetSDKOption(BRAC_SO_LOCALVIDEO_OVERLAY, params.overlay);

	    // ?????????????????????ID??????????????????int??????-1???????????????????????????????????????ID???????????????????????????????????????????????????
	    params.hasOwnProperty("codeId") && BRAC_SetSDKOption(BRAC_SO_LOCALVIDEO_CODECID, params.codeId);

	    // ????????????????????????????????????int??????0????????????????????????1?????????????????????
	    params.hasOwnProperty("rotateCtrl") && BRAC_SetSDKOption(BRAC_SO_LOCALVIDEO_ROTATECTRL, params.rotateCtrl);

	    // ??????????????????????????????????????????int??????0??????????????????[??????]??? 1 Video4Linux, 2 DirectShow, 3 Java??????[Android????????????]???
	    params.hasOwnProperty("capDriver") && BRAC_SetSDKOption(BRAC_SO_LOCALVIDEO_CAPDRIVER, params.capDriver);

	    // ??????????????????????????????????????????int??????0????????????[??????]???1 ?????????
	    params.hasOwnProperty("fixColordevia") && BRAC_SetSDKOption(BRAC_SO_LOCALVIDEO_FIXCOLORDEVIA, params.fixColordevia);

	    // ?????????????????????????????????????????????int?????? 0 ?????????[??????]??? 1 ?????????
	    params.hasOwnProperty("overlayTimestamp") && BRAC_SetSDKOption(BRAC_SO_LOCALVIDEO_OVERLAYTIMESTAMP, params.overlayTimestamp);

	    // ???????????????????????????????????????????????????JSON????????????????????????????????????????????????????????????????????????
	    params.hasOwnProperty("virtualbk") && BRAC_SetSDKOption(BRAC_SO_LOCALVIDEO_VIRTUALBK, params.virtualbk);

	    // ?????????????????????
	    BRAC_SetUserStreamInfo(-1, dwStreamIndex, BRAC_SO_LOCALVIDEO_APPLYPARAM, 1);
	}

	// ??????????????????????????????
	function getUserStreamInfo(params) {
	    return BRAC_GetUserStreamInfoInt(params.userId, params.streamIndex, params.infoName);
	}

	//??????DOM??????
	function GetID(id) {
	    if (document.getElementById) {
	        return document.getElementById(id);
	    } else if (window[id]) {
	        return window[id];
	    }
	    return null;
	}

	exports.instance = AnyChatSDKVideoHandler;
	exports.openVideo = openVideo;
	exports.closeVideo = closeVideo;
	exports.getUserStreamInfo = getUserStreamInfo;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	/*-----------------------------------------------------------
	 * AnyChat???????????????
	 * ????????????:???????????????????????????????????????
	 *
	 *
	 * ----------------------------------------------------------
	 */
	//??????log4js
	var log4js = __webpack_require__(1);
	var logger = log4js.getLogger("AnyChatSDKDualRecordHandler");

	//????????????
	function AnyChatSDKDualRecordHandler() {

	}

	AnyChatSDKDualRecordHandler.prototype = {
	    constructor: AnyChatSDKDualRecordHandler
	}


	var instance = new AnyChatSDKDualRecordHandler();

	exports.instance = instance;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	/*-----------------------------------------------------------
	 * AnyChat???????????????
	 *
	 *
	 *
	 * ----------------------------------------------------------
	 */
	//??????log4js
	var log4js = __webpack_require__(1);
	var logger = log4js.getLogger("AnyChatSDKRecordHandler");

	var AnyChatSDKUserHandler = __webpack_require__(4);
	var getStrUserId = AnyChatSDKUserHandler.getStrUserId;
	var getIntUserId = AnyChatSDKUserHandler.getIntUserId;

	//????????????
	function AnyChatSDKRecordHandler() {
	    this.recordParams = 0;
	    this.snapshotParams = 0;
	    this.recordUserId = -1;
	}

	AnyChatSDKRecordHandler.prototype = {
	    constructor: AnyChatSDKRecordHandler,
	    start: function(opt) {
	        if(opt.hasOwnProperty("userId")){
	            this.recordUserId = opt.userId;
	        }
	        var layoutMode = 1;
	        opt.layout && (layoutMode = opt.layout);

	        var string = {};
			if(!opt.hasOwnProperty("recordLayoutOpt")){
				opt.layoutStreams && (string.streamlist = opt.layoutStreams);
			}else{
				// opt.recordLayoutOpt.streamlist && (string.streamlist = opt.recordLayoutOpt.streamlist);
				if( (JSON.stringify(opt.recordLayoutOpt) != "{}") && opt.recordLayoutOpt.hasOwnProperty('streamlist')){
					string.streamlist = opt.recordLayoutOpt.streamlist;
				}
			}
	        
	        if (string.streamlist) {
	            for (var i in string.streamlist) {
	                string.streamlist[i].userid = parseInt(getIntUserId(string.streamlist[i].userid));
	            }
	        }
	        var ANYCHAT_RECORD_FLAGS_FILEMD5 = 0x00040000;
	        this.recordParams = ANYCHAT_RECORD_FLAGS_VIDEO + ANYCHAT_RECORD_FLAGS_AUDIO + ANYCHAT_RECORD_FLAGS_MIXAUDIO +
	            ANYCHAT_RECORD_FLAGS_MIXVIDEO + ANYCHAT_RECORD_FLAGS_STEREO + ANYCHAT_RECORD_FLAGS_LOCALCB + ANYCHAT_RECORD_FLAGS_USERFILENAME + ANYCHAT_RECORD_FLAGS_FILEMD5;

			if(opt.hasOwnProperty("recordLayoutOpt")){
				string.recordlayout = opt.recordLayoutOpt.recordlayout;
				if(string.recordlayout > 9) {
					string.recordlayout = 16;
				}else if (string.recordlayout > 4 && string.recordlayout < 9) {
					string.recordlayout = 8;
				}
				
				if(opt.recordLayoutOpt.hasOwnProperty("layoutstyle")){
					string.layoutstyle = opt.recordLayoutOpt.layoutstyle;
				}else{
					string.layoutstyle = 0;
				}
				if (string.layoutstyle == 1 && string.recordlayout == 2) {
				   //????????? ????????? ????????????????????????
			    }else{
				   this.recordParams = this.recordParams + ANYCHAT_RECORD_FLAGS_ABREAST;
			    }
				
			}else{
				switch (layoutMode + "") {
				    case "1":
				        string.recordlayout = 1;
				        // this.recordUserId = string.streamlist[0].userid;
				        // this.recordParams = this.recordParams - ANYCHAT_RECORD_FLAGS_MIXAUDIO;
				        break;
				    case "2":
				        string.recordlayout = 2;
				        this.recordParams = this.recordParams + ANYCHAT_RECORD_FLAGS_ABREAST;
				        break;
				    case "3":
				        string.recordlayout = 2;
				        break;
				    case "4":
				        string.recordlayout = 3;
				        this.recordParams = this.recordParams + ANYCHAT_RECORD_FLAGS_ABREAST;
				        break;
				    case "5":
				        string.recordlayout = 3;
				        string.layoutstyle = 1;
				        this.recordParams = this.recordParams + ANYCHAT_RECORD_FLAGS_ABREAST;
				        break;
				    case "6":
				        string.recordlayout = 4;
				        this.recordParams = this.recordParams + ANYCHAT_RECORD_FLAGS_ABREAST;
				        break;
				    case "7":
				        string.recordlayout = 9;
				        this.recordParams = this.recordParams + ANYCHAT_RECORD_FLAGS_ABREAST;
				        break;
				    case "8":
				        string.recordlayout = 16;
				        this.recordParams = this.recordParams + ANYCHAT_RECORD_FLAGS_ABREAST;
				        break;
				    default:
				    	this.recordParams = this.recordParams + ANYCHAT_RECORD_FLAGS_ABREAST;
				}
			}

	        var mode = 1;
	        opt.mode && (mode = opt.mode);

	        switch (mode + "") {
	            case "1":
	                break;
	            case "2":
	                this.recordParams = this.recordParams + ANYCHAT_RECORD_FLAGS_SERVER;
	                var VADCtrol = 0;
	                BRAC_SetSDKOption(BRAC_SO_AUDIO_VADCTRL, VADCtrol);
	                break;
	            case "3":
	                this.recordParams = this.recordParams + ANYCHAT_RECORD_FLAGS_SERVER + ANYCHAT_RECORD_FLAGS_STREAM;
	                var VADCtrol = 0;
	                BRAC_SetSDKOption(BRAC_SO_AUDIO_VADCTRL, VADCtrol);
	                break;
	        }

	        var content = 1;
	        opt.content && (content = opt.content);

	        switch (content + "") {
	            case "1":
	                break;
	            case "2":
	                this.recordParams = this.recordParams - ANYCHAT_RECORD_FLAGS_VIDEO - ANYCHAT_RECORD_FLAGS_MIXVIDEO;
	                break;
	            case "3":
	                this.recordParams = this.recordParams - ANYCHAT_RECORD_FLAGS_AUDIO - ANYCHAT_RECORD_FLAGS_MIXAUDIO;
	                break;
	        }

	        if (opt.hasOwnProperty("fileType")) {
	            //????????????????????????
	            BRAC_SetSDKOption(BRAC_SO_RECORD_FILETYPE, parseInt(opt.fileType)-1);
	        }

	        if (opt.hasOwnProperty("clipMode")) {
	            //????????????????????????
	            var errorCode = BRAC_SetSDKOption(BRAC_SO_RECORD_CLIPMODE, parseInt(opt.clipMode));
	        }

	        if (opt.hasOwnProperty("fileName")) {
	            string.filename = opt.fileName;
	        }
	        if (opt.localFilePath) {
	            BRAC_SetSDKOption(BRAC_SO_RECORD_TMPDIR, opt.localFilePath);
	        }

	        opt.width && (BRAC_SetSDKOption(BRAC_SO_RECORD_WIDTH, opt.width));
	        opt.height && (BRAC_SetSDKOption(BRAC_SO_RECORD_HEIGHT, opt.height));


	        opt.picWatermark && (string.watermark = opt.picWatermark);
	        opt.textWatermark && (string.textoverlay = opt.textWatermark);
	        if (opt.hasOwnProperty("strJson")) {
	            string.strJson = opt.strJson;
	        }
	        if (opt.hasOwnProperty("category")) {
	            string.category = opt.category;
	        }
	        if (opt.hasOwnProperty("statusnotify")) {
	            string.statusnotify = opt.statusnotify;
	        }
	        
	        var errorCode = BRAC_StreamRecordCtrlEx(this.recordUserId, 1, this.recordParams, 0, JSON.stringify(string));
	        return errorCode;

	    },
	    stop: function() {
	        //????????????
	        var errorCode = BRAC_StreamRecordCtrlEx(this.recordUserId, 0, this.recordParams, 0, "");
	        if(errorCode == 0){
	            this.recordUserId = -1;
	        }
	        return errorCode;
	    },
	    insertFile: function(opt) {
	        //?????????????????????
	        var errorCode = BRAC_SetSDKOption(BRAC_SO_RECORD_INSERTIMAGE, JSON.stringify(opt));
	        return errorCode;
	    },
	    snapshot: function(opt) {
	        var string = {};
	        this.snapshotParams = ANYCHAT_RECORD_FLAGS_SNAPSHOT + ANYCHAT_RECORD_FLAGS_USERFILENAME;
	        var mode = 1;
	        opt.mode && (mode = opt.mode);

	        var streamIndex = 0;
	        opt.streamIndex && (streamIndex = opt.streamIndex);
	        string.streamindex = streamIndex;
	        string.isPhoto = 1;
			string.textoverlay = opt.szJsonBuf4Txt;
	        switch (mode + "") {
	            case "1":
					// this.snapshotParams = BRAC_RECORD_FLAGS_SNAPSHOT + BRAC_RECORD_FLAGS_LOCALCB;
	                break;
	            case "2":
	                this.snapshotParams = this.snapshotParams + ANYCHAT_RECORD_FLAGS_SERVER + ANYCHAT_RECORD_FLAGS_LOCALCB;
	                break;
	        }

	        if (opt.hasOwnProperty("fileName")) {
	            string.filename = opt.fileName;
	        }

	        if (opt.hasOwnProperty("strJson")) {
	            string.strJson = opt.strJson;
	        }

	        if (opt.hasOwnProperty("category")) {
	            string.category = opt.category;
	        }

	        if (opt.localFilePath) {
	            BRAC_SetSDKOption(BRAC_SO_SNAPSHOT_TMPDIR, opt.localFilePath);
	        }

	        var errorCode = BRAC_StreamRecordCtrlEx(getIntUserId(opt.userId), 1, this.snapshotParams, streamIndex, JSON.stringify(string));
	        return errorCode;
	    },
	    cancel: function(){
	        var errorCode = BRAC_StreamRecordCtrlEx(-1, 0, ANYCHAT_RECORD_FLAGS_CANCEL, 0, "");
	        return errorCode;
	    },
	    updateRecordParam: function(opt){
	        var newJsonObj = {}, paramJsonObj = {};
			
			if(opt.hasOwnProperty("recordLayoutOpt")){
				paramJsonObj.recordlayout = opt.recordLayoutOpt.recordlayout;
				if(paramJsonObj.recordlayout > 9) {
					paramJsonObj.recordlayout = 16;
				}else if (paramJsonObj.recordlayout > 4 && paramJsonObj.recordlayout < 9) {
					paramJsonObj.recordlayout = 8;
				}
				
				if(opt.recordLayoutOpt.hasOwnProperty("layoutstyle")){
					paramJsonObj.layoutstyle = opt.recordLayoutOpt.layoutstyle;
				}else{
					paramJsonObj.layoutstyle = 0;
				}
				if (paramJsonObj.layoutstyle == 1 && paramJsonObj.recordlayout == 2) {
				   //????????? ????????? ????????????????????????
			    }else{
				   this.recordParams = this.recordParams + ANYCHAT_RECORD_FLAGS_ABREAST;
			    }
			}else{
				if(opt.layout) {
				    switch (opt.layout+"") {
				        case "1":
				            paramJsonObj.recordlayout = 1;
							if ((this.recordParams & ANYCHAT_RECORD_FLAGS_MIXAUDIO) == 1) {
									this.recordParams - ANYCHAT_RECORD_FLAGS_MIXAUDIO;
								}
								if ((this.recordParams & ANYCHAT_RECORD_FLAGS_MIXVIDEO) == 1) {
									this.recordParams - ANYCHAT_RECORD_FLAGS_MIXVIDEO;
								}	
				            break;
				        case "2":
				            paramJsonObj.recordlayout = 2;
							if ((this.recordParams & ANYCHAT_RECORD_FLAGS_ABREAST) == 0) {
									this.recordParams = this.recordParams + ANYCHAT_RECORD_FLAGS_ABREAST;
								}
				            break;
				        case "3":
				            paramJsonObj.recordlayout = 2;
				            break;
				        case "4":
				            paramJsonObj.recordlayout = 3;
							if ((this.recordParams & ANYCHAT_RECORD_FLAGS_ABREAST) == 0) {
									this.recordParams = this.recordParams + ANYCHAT_RECORD_FLAGS_ABREAST;
								}
				            break;
				        case "5":
				            paramJsonObj.recordlayout = 3;
				            paramJsonObj.layoutstyle = 1;
							if ((this.recordParams & ANYCHAT_RECORD_FLAGS_ABREAST) == 0) {
									this.recordParams = this.recordParams + ANYCHAT_RECORD_FLAGS_ABREAST;
								}
				            break;
				        case "6":
				            paramJsonObj.recordlayout = 4;
							if ((this.recordParams & ANYCHAT_RECORD_FLAGS_ABREAST) == 0) {
									this.recordParams = this.recordParams + ANYCHAT_RECORD_FLAGS_ABREAST;
								}
				            break;
				        case "7":
				            paramJsonObj.recordlayout = 9;
							if ((this.recordParams & ANYCHAT_RECORD_FLAGS_ABREAST) == 0) {
									this.recordParams = this.recordParams + ANYCHAT_RECORD_FLAGS_ABREAST;
								}
				            break;
				        case "8":
				            paramJsonObj.recordlayout = 16;
							if ((this.recordParams & ANYCHAT_RECORD_FLAGS_ABREAST) == 0) {
									this.recordParams = this.recordParams + ANYCHAT_RECORD_FLAGS_ABREAST;
								}
				            break;
				    }
				}
			}
			
			if(!opt.hasOwnProperty("recordLayoutOpt")){
				opt.layoutStreams && (paramJsonObj.streamlist = opt.layoutStreams);
			}else{
				if( (JSON.stringify(opt.recordLayoutOpt) != "{}") && opt.recordLayoutOpt.hasOwnProperty('streamlist')){
					paramJsonObj.streamlist = opt.recordLayoutOpt.streamlist;
				}
			}
	        // if(opt.layoutStreams){
	        //     paramJsonObj.streamlist = opt.layoutStreams;
	        // }
	        if(opt.textWatermark){
	            paramJsonObj.textoverlay = opt.textWatermark;
	        }
	        if(opt.picWatermark){
	            paramJsonObj.watermark = opt.picWatermark;
	        }
	        newJsonObj.userid = opt.userid ? opt.userid : -1;
	        newJsonObj.strparam = paramJsonObj;
			
			newJsonObj.recordflags = this.recordParams;
			 
	        return BRAC_SDKControl(ANYCHAT_SDKCTRL_UPDATERECUSERSTR, JSON.stringify(newJsonObj));
	    },
	    recordtag:function(opt){
	        var errorCode = BRAC_SDKControl(ANYCHAT_SDKCTRL_RECORDTAG,JSON.stringify(opt));
	        return errorCode;
	    }
	};





	var instance = new AnyChatSDKRecordHandler();

	exports.instance = instance;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	/*-----------------------------------------------------------
	 * AnyChat???????????????
	 * ????????????:AnyChat???????????????????????????????????????
	 *
	 *
	 * ----------------------------------------------------------
	 */
	//??????log4js
	var log4js = __webpack_require__(1);
	var logger = log4js.getLogger("AnyChatSDKSettingHandler");
	var AnyChatSDKConstant = __webpack_require__(2);
	var CONSTANT = AnyChatSDKConstant.instance;

	// ???????????????????????????
	function AnyChatSDKSettingHandler() {

	}

	AnyChatSDKSettingHandler.prototype = {
	    constructor: AnyChatSDKSettingHandler,
	    //????????????
	    setSDKOption: function(opt) {
	        if (opt.hasOwnProperty("enableWebService")) {
	            //????????????Web??????
	            var errorCode = enableWebService(parseInt(opt.enableWebService));
	            logger.invokeLog("enableWebService", errorCode, { enableWebService: opt.enableWebService });
	        }
	        if (opt.hasOwnProperty("localPath2Url")) {
	            //????????????????????????URL??????
	            var errorCode = localPath2Url(parseInt(opt.localPath2Url));
	            logger.invokeLog("localPath2Url", errorCode, { localPath2Url: opt.localPath2Url });
	        }
	        if (opt.hasOwnProperty("videoBgImage")) {
	            //????????????????????????
	            var errorCode = setVideoBgImage(opt.videoBgImage);
	            logger.invokeLog("videoBgImage", errorCode, { videoBgImage: opt.videoBgImage });
	        }
	        if (opt.hasOwnProperty("P2PPolitic")) {
	            //????????????P2P????????????
	            var errorCode = setP2PPolitic(parseInt(opt.P2PPolitic));
	            logger.invokeLog("P2PPolitic", errorCode, { P2PPolitic: opt.P2PPolitic });
	        }
	        if (opt.hasOwnProperty("remoteVideoMode")) {
	            //????????????????????????
	            var errorCode = setRemoteVideoMode(parseInt(opt.remoteVideoMode));
	            logger.invokeLog("remoteVideoMode", errorCode, { remoteVideoMode: opt.remoteVideoMode });
	        }
	        if (opt.hasOwnProperty("uploadLogInfo")) {
	            var errorCode = setUploadLogInfo(parseInt(opt.uploadLogInfo));
	            logger.invokeLog("uploadLogInfo", errorCode, { uploadLogInfo: opt.uploadLogInfo });
	        }
	        if (opt.hasOwnProperty("applyParam")) {
	            BRAC_SetSDKOption(BRAC_SO_LOCALVIDEO_APPLYPARAM, opt.applyParam);
	        }
	        if (opt.hasOwnProperty("overlayTimestamp")) {
	            var errorCode = setOverlayTimestamp(parseInt(opt.overlayTimestamp));
	            logger.invokeLog("overlayTimestamp", errorCode, { overlayTimestamp: opt.overlayTimestamp });
	        }
	    },
	    getVersionInfo: function() {
	        var version = "V" + BRAC_GetVersion(1) + " Build time: " + BRAC_GetSDKOptionString(BRAC_SO_CORESDK_BUILDTIME);
	        return version;
	    },
	    getState: function(opt) {
	        if (parseInt(opt.infoName) == 6 || parseInt(opt.infoName) == 7 || parseInt(opt.infoName) == 8) {
	            return BRAC_QueryUserStateString(opt.userId, opt.infoName);
	        } else {
	            return BRAC_QueryUserStateInt(opt.userId, opt.infoName);
	        }
	    },
	    getSDKOptionInt: function(infoName) {
	        return BRAC_GetSDKOptionInt(infoName);
	    },
	    getSDKOptionString: function(infoName) {
	        return BRAC_GetSDKOptionString(infoName);
	    },
	    // ??????????????????
	    setVirtualBkImg: function(opt) {
	        return BRAC_SetSDKOption(BRAC_SO_LOCALVIDEO_VIRTUALBK, JSON.stringify(opt));
	    },
	    // ?????????????????????
	    setVirtualStudio: function (opt) {
	        return  BRAC_SDKControl(ANYCHAT_SDKCTRL_VIRTUALSTUDIO,JSON.stringify(opt));
	    },
	    //????????????
	    setRotation:function(opt){
	        if(opt.userId){
	            var rotation;
	            if(opt.rotation==0){
	                rotation=0
	            }else if(opt.rotation==90){
	                rotation=BRAC_ROTATION_FLAGS_ROTATION90;   
	            }else if(opt.rotation==180){
	                rotation=BRAC_ROTATION_FLAGS_ROTATION180;
	            }else if(opt.rotation==270){
	                rotation=BRAC_ROTATION_FLAGS_ROTATION270;
	            }
	            return BRAC_UserInfoControl(opt.userId, BRAC_USERINFO_CTRLCODE_ROTATION, rotation, 0, "");
	        }
	    }

	};

	// ????????????Web??????
	function enableWebService(value) {
	    var errorCode = BRAC_SetSDKOption(BRAC_SO_ENABLEWEBSERVICE, value);
	    return errorCode;
	}

	// ????????????????????????URL??????
	function localPath2Url(value) {
	    var errorCode = BRAC_SetSDKOption(BRAC_SO_LOCALPATH2URL, value);
	    return errorCode;
	}

	// ????????????????????????
	function setVideoBgImage(value) {
	    var errorCode = BRAC_SetSDKOption(BRAC_SO_VIDEOBKIMAGE, value);
	    return errorCode;
	}

	// ????????????P2P????????????
	function setP2PPolitic(value) {
	    var errorCode = BRAC_SetSDKOption(BRAC_SO_NETWORK_P2PPOLITIC, value);
	    return errorCode;
	}

	// ????????????????????????
	function setRemoteVideoMode(value) {
	    var errorCode = BRAC_SetSDKOption(BRAC_SO_VIDEOSHOW_CLIPMODE, value);
	    return errorCode;
	}

	// ??????????????????????????????
	function setUploadLogInfo(value) {
	    var errorCode = BRAC_SetSDKOption(BRAC_SO_CORESDK_UPLOADLOGINFO, value);
	    return errorCode;
	}

	// ?????????????????????????????????
	function setOverlayTimestamp(value) {
	    var errorCode = BRAC_SetSDKOption(BRAC_SO_LOCALVIDEO_OVERLAYTIMESTAMP, value);
	    return errorCode;
	}



	var instance = new AnyChatSDKSettingHandler();

	exports.instance = instance;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	/*-----------------------------------------------------------
	 * AnyChatAI??????
	 * ????????????:AnyChatAI???????????????????????????????????????
	 *
	 *
	 * ----------------------------------------------------------
	 */
	//??????log4js
	var log4js = __webpack_require__(1);
	var logger = log4js.getLogger("AnyChatSDKAi");
	var AnyChatSDKErrorCode = __webpack_require__(5);

	var ANYCHAT_AI_TIMEINTERVAL                    =        1;    //?????????????????????ms
	var ANYCHAT_AI_TIMEINTERVAL_ASR                =        800;  //ASR?????????????????????ms
	var ANYCHAT_AI_TIMEOUT                         =        10000;//???????????????????????????????????????????????? ms

	// ???????????????????????????
	function  AnyChatSDKAI() {
	    this.asrtaskid={};
	    this.ttstaskid={};
	    this.facetaskid={};
	    this.doOcrImagetaskid ={};
	    this.capturetaskid={};
	    this.isAlive=true;
	    this.guid = BRAC_NewGuid();
	    var json = {
	        "cmd": ANYCHAT_AI_CTRL_ROBOT_INIT,
	        "robotid": this.guid
	    };
	    var err = BRAC_SDKControl(ANYCHAT_CORESDKEVENT_AIABILITY, JSON.stringify(json));
	    logger.invokeLog("createRobot", err, { robotid: this.guid});
	};


	AnyChatSDKAI.prototype = {
	    constructor: AnyChatSDKAI,

	    //???????????????
	    //roboId ?????????id
	    destroyRobot  : function() {
	        var json = {
	            "cmd": ANYCHAT_AI_CTRL_ROBOT_RELEASE,
	            "robotid": this.guid
	        };
	        var err = BRAC_SDKControl(ANYCHAT_CORESDKEVENT_AIABILITY, JSON.stringify(json));

	        logger.invokeLog("destroyRobot", err, { robotid: this.guid});
	        return err;
	    },
	    /*
	      * ?????????????????????????????? AnyChatAIRobot.startASR
	      * ??????  option.event ?????????????????? , option.resultevent ?????????????????????  ,option.errorevent ??????????????????, option.targetUserId ??????id???????????????
	      * ????????? ???asrtaskid   ??????????????????id
	     */
	    startASR:function (option) {

	        if(!this.isAlive){
	            return;
	        }
	        var taskid=BRAC_NewGuid()
	        this.asrtaskid[taskid] = taskid;

	        (typeof(option.event) === "function") && AnyChatWebSDK.anychatSDKInstance.setCallBack("onAIPrepare"+this.asrtaskid[taskid], option.event, true);//????????????

	        (typeof(option.resultevent) === "function") && AnyChatWebSDK.anychatSDKInstance.setCallBack("onAIResult"+this.asrtaskid[taskid], option.resultevent, false);//???????????????

	        (typeof(option.errorevent) === "function") && AnyChatWebSDK.anychatSDKInstance.setCallBack("onAIError"+this.asrtaskid[taskid], option.errorevent, true);//????????????


	        AI_ASR_TASKID = this.asrtaskid[taskid];
	        var json = {
	            "cmd": ANYCHAT_AI_CTRL_ABILITY_INVOKE,
	            "aitype": ANYCHAT_AI_TYPE_ASR,
	            "start":1,
	            "taskid": AI_ASR_TASKID,
	            "timeinterval":ANYCHAT_AI_TIMEINTERVAL_ASR,
	            "timeout":ANYCHAT_AI_TIMEOUT,
	            "robotid":this.guid,
	            "mode":ANYCHAT_ASRMODE_LIVESTREAM,
	            "asrtype":2,
	            "userid":option.targetUserId,
	        };
	        var strInJson = JSON.stringify(json);
	        var errcode=  BRAC_SDKControl(ANYCHAT_CORESDKEVENT_AIABILITY, strInJson);
	        var lpEventJsonObj=JSON.parse(errcode);
	        if(lpEventJsonObj.errorcode!=0){//errcode?????????0??????err??????
	            var result={
	                AnyChatResult : {
	                    code: lpEventJsonObj.errorcode,
	                    msg: AnyChatSDKErrorCode.checkErrorMsg(lpEventJsonObj.errorcode),
	                },
	            }
	            AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
	                type: "onAIError"+this.asrtaskid[taskid],
	                result: result,
	            });
	        }else{
	            if(AnyChatWebSDK.anychatSDKInstance.AnyChatSDKRecordTag && option.hasOwnProperty("aiAsrOpt")){//????????????????????????
	                if(!option.aiAsrOpt.hasOwnProperty("tagOpt")){
	                    return
	                }
	                try {
	                    var tagOpt = JSON.parse(JSON.stringify(option.aiAsrOpt.tagOpt));
	                    tagOpt.taskId = taskid;
	                    //????????????
	                    var errorCode = AnyChatWebSDK.anychatSDKInstance.AnyChatSDKRecordTag.addAnswerTag(tagOpt);
	                    if(errorCode!=0) throw errorCode;
	                } catch (e) {
	                    var result={
	                        AnyChatResult : {
	                            code: e,
	                            msg: AnyChatSDKErrorCode.checkErrorMsg(e),
	                        },
	                    }
	                    AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
	                        type: "onAIError"+this.asrtaskid[taskid],
	                        result: result,
	                    });
	                }
	            }
	        }

	        logger.invokeLog("startASR", errcode, { taskid: AI_ASR_TASKID,robotId:this.guid});
	    },
	    /*
	     *   ?????????????????????????????? AnyChatAIRobot.stopASR
	     *  ???  ?????? option.event ?????? , ???option.asrTaskId ?????????????????????????????????id
	     * ????????????asrtaskid
	     */
	    stopASR:function (option) {//option{event?????? ,}
	        if(!this.isAlive){
	            return;
	        }
	        (typeof(option.event) === "function") && AnyChatWebSDK.anychatSDKInstance.setCallBack("onAIFinish"+option.asrTaskId, option.event, true);//????????????????????????
	        var json = {
	            "cmd": ANYCHAT_AI_CTRL_ABILITY_INVOKE,
	            "aitype": ANYCHAT_AI_TYPE_ASR,
	            "start":0,
	            "taskid": option.asrTaskId,
	            "timeinterval":ANYCHAT_AI_TIMEINTERVAL_ASR,
	            "timeout":ANYCHAT_AI_TIMEOUT,
	            "robotid":this.guid,
	            "mode":ANYCHAT_ASRMODE_LIVESTREAM,
	            "asrtype":2,

	        };
	        var strInJson = JSON.stringify(json);
	        var err=BRAC_SDKControl(ANYCHAT_CORESDKEVENT_AIABILITY, strInJson);
	        logger.invokeLog("stopASR", err, { taskid: option.asrTaskId,robotId:this.guid});
	    },
	    /**
	     * ??????????????????
	     * ?????????option.contentStr ???????????????????????? option.type 1->?????????2->?????? ???option.mode 1 ???????????? 2 TTS?????????????????????, option.event ?????????????????? , option.resultevent ?????????????????????  ,option.errorevent ??????????????????,
	     *????????? ttsTaskId  ??????????????????id
	     */
	    doTTS:function (option) {
	        if(!this.isAlive){
	            return;
	        }
	        var taskid=BRAC_NewGuid()
	        this.ttstaskid[taskid] = taskid;
	        (typeof(option.event) === "function") && AnyChatWebSDK.anychatSDKInstance.setCallBack("onAIPreparetts"+this.ttstaskid[taskid], option.event, true);//????????????

	        (typeof(option.resultevent) === "function") && AnyChatWebSDK.anychatSDKInstance.setCallBack("onAIResulttts"+this.ttstaskid[taskid], option.resultevent, false);//???????????????

	        (typeof(option.errorevent) === "function") && AnyChatWebSDK.anychatSDKInstance.setCallBack("onAIErrortts"+this.ttstaskid[taskid], option.errorevent, true);//????????????

	        (typeof(option.finishevent) === "function") && AnyChatWebSDK.anychatSDKInstance.setCallBack("onAIFinishtts"+this.ttstaskid[taskid], option.finishevent, true);//????????????


	        AI_TTS_TASKID = taskid;
	        var json = {
	            "cmd":ANYCHAT_AI_CTRL_ABILITY_INVOKE,
	            "aitype": ANYCHAT_AI_TYPE_TTS,
	            "start":1,
	            "taskid":AI_TTS_TASKID,
	            "ttstype":option.type,
	            "mode":option.mode,
	            "robotid":this.guid,
	            "content":option.contentStr,
	            "speechrate": option.speechrate || 0,
				"longtxt": option.longtxt || 0,
				"audioformat": option.audioformat,//1pcm??????2wav??????3mp3??????
	        }
	        var strInJson = JSON.stringify(json);


	        var error= BRAC_SDKControl(ANYCHAT_CORESDKEVENT_AIABILITY, strInJson);
	        logger.invokeLog("doTTs", error, { taskid: AI_TTS_TASKID,robotId:this.guid});
	        var lpEventJsonObj=JSON.parse(error);
	        if(lpEventJsonObj.errorcode!=0){//errcode?????????0??????err??????
	            var result={
	                AnyChatResult : {
	                    code: lpEventJsonObj.errorcode,
	                    msg: AnyChatSDKErrorCode.checkErrorMsg(lpEventJsonObj.errorcode),
	                },
	            }
	            AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
	                type: "onAIErrortts",
	                result: result,
	            });
	        }
	    },
	    /**
	     * ????????????
	     * ?????????option.contentStr ???????????????????????? option.type 1->?????????2->?????? ???option.mode 1 ???????????? 2 TTS?????????????????????, option.event ?????????????????? , option.resultevent ?????????????????????  ,option.errorevent ??????????????????, option.mode
	     * option.tagOpt ????????????
	     * ????????? faceTaskId  ??????????????????id
	     */
	    startFaceDetect :function (option) {
	        if(!this.isAlive){
	            return;
	        }
	        var taskid=BRAC_NewGuid()
	        this.facetaskid[taskid]=taskid ;
	        (typeof(option.event) === "function") && AnyChatWebSDK.anychatSDKInstance.setCallBack("onAIPrepareface"+this.facetaskid [taskid], option.event, true);//????????????

	        (typeof(option.resultevent) === "function") && AnyChatWebSDK.anychatSDKInstance.setCallBack("onAIResulface"+this.facetaskid [taskid], option.resultevent, false);//???????????????

	        (typeof(option.errorevent) === "function") && AnyChatWebSDK.anychatSDKInstance.setCallBack("onAIErrorface"+this.facetaskid [taskid], option.errorevent, true);//????????????

	        (typeof (option.finishevent) === "function") && AnyChatWebSDK.anychatSDKInstance.setCallBack("onAIFinishface" + this.facetaskid[taskid], option.finishevent, true);//????????????
	        var json = {
	            "cmd":ANYCHAT_AI_CTRL_ABILITY_INVOKE,
	            "aitype": ANYCHAT_AI_TYPE_AFR,
	            "start":1,
	            "taskid":this.facetaskid [taskid],
	            "robotid":this.guid,
	            "filetype":1,
	        }
	        //??????????????????(??????image)??????
	        if(option.mode==ANYCHAT_AFRMODE_IMAGEFACEDETECT){
	            json["mode"]=ANYCHAT_AFRMODE_IMAGEFACEDETECT;
	            json["image1"]=option.aiAfrOpt.image1;
	        }

	        //?????????????????????(??????timeinterval)??????
	        if(option.mode==ANYCHAT_AFRMODE_STREAMFACEDETECT){
	            json["mode"]=ANYCHAT_AFRMODE_STREAMFACEDETECT;
	            json["timeinterval"] = option.timeinterval || 3000; //??????????????????????????????
				json["timeout"] = option.timeout || 10000;
	            json["userid"]= option.targetUserId ? option.targetUserId : 0;
	        }

	        //????????????????????????
	        if(option.mode==ANYCHAT_AFRMODE_IMAGEFACECOMPARE){
	            json["mode"]=ANYCHAT_AFRMODE_IMAGEFACECOMPARE;
	            json["image1"]=option.aiAfrOpt.image1;
	            json["image2"]=option.aiAfrOpt.image2;
	        }

	        //???????????????????????????
	        if(option.mode==ANYCHAT_AFRMODE_STREAMFACECOMPARE){
	            json["mode"]=ANYCHAT_AFRMODE_STREAMFACECOMPARE;
	            json["image1"]=option.aiAfrOpt.image1;
	            json["userid"]= option.targetUserId ? option.targetUserId : 0;
	        }

	        //????????????????????????
	        if(option.mode==ANYCHAT_AFRMODE_IMAGETWOPERSONCOMPARE){
	            json["mode"]=ANYCHAT_AFRMODE_IMAGETWOPERSONCOMPARE;
	            json["image1"]=option.aiAfrOpt.image1;
	            json["image2"]=option.aiAfrOpt.image2;
	            json["image3"]=option.aiAfrOpt.image3;
	        }

	        //?????????????????????????????????
	        if(option.mode==ANYCHAT_AFRMODE_STREAMTWOPERSONCOMPARE){
	            json["mode"]=ANYCHAT_AFRMODE_STREAMTWOPERSONCOMPARE;
	            json["image1"]=option.aiAfrOpt.image1;
	            json["image2"]=option.aiAfrOpt.image2;
	            json["userid"]= option.targetUserId ? option.targetUserId : 0;
	        }

	        //??????????????????????????????
	        if(option.mode==ANYCHAT_AFRMODE_IMAGEFACEPOSTUREDETECT){
	            json["mode"]=ANYCHAT_AFRMODE_IMAGEFACEPOSTUREDETECT;
	            json["image1"]=option.aiAfrOpt.image1;
	        }

	        //?????????????????????????????????
	        if(option.mode==ANYCHAT_AFRMODE_STREAMFACEPOSTUREDETECT){
	            json["mode"]=ANYCHAT_AFRMODE_STREAMFACEPOSTUREDETECT;
	            delete json["filetype"];
	        }



	        var strInJson = JSON.stringify(json);

	        var err=BRAC_SDKControl(ANYCHAT_CORESDKEVENT_AIABILITY, strInJson);
	        logger.invokeLog("startFaceDetect", err, { taskid: this.facetaskid [taskid],robotId:this.guid});
	        var lpEventJsonObj=JSON.parse(err);
	        if(lpEventJsonObj.errorcode!=0){//errcode?????????0??????err??????
	            var result={
	                AnyChatResult : {
	                    code: lpEventJsonObj.errorcode,
	                    msg: AnyChatSDKErrorCode.checkErrorMsg(lpEventJsonObj.errorcode),
	                },
	            }
	            AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
	                type: "onAIErrorface"+this.facetaskid [taskid],
	                result: result,
	            });
	        }else{
	            if(AnyChatWebSDK.anychatSDKInstance.AnyChatSDKRecordTag && option.hasOwnProperty("aiAfrOpt")){//????????????????????????
	                if(!option.aiAfrOpt.hasOwnProperty("tagOpt")){
	                    return
	                }
	                try {
	                    var tagOpt = JSON.parse(JSON.stringify(option.aiAfrOpt.tagOpt));
	                    tagOpt.taskId = taskid;
	                    //????????????
	                    if(option.mode === ANYCHAT_AFRMODE_IMAGEFACEDETECT || option.mode === ANYCHAT_AFRMODE_STREAMFACEDETECT){
	                        var errorCode = AnyChatWebSDK.anychatSDKInstance.AnyChatSDKRecordTag.addFaceCheckTag(tagOpt);
	                        if(errorCode!=0)throw errorCode;
	                    }
	                    //????????????
	                    if(option.mode === ANYCHAT_AFRMODE_IMAGEFACECOMPARE || option.mode === ANYCHAT_AFRMODE_STREAMTWOPERSONCOMPARE || option.mode === ANYCHAT_AFRMODE_IMAGEFACEPOSTUREDETECT || option.mode === ANYCHAT_AFRMODE_STREAMFACECOMPARE){
	                        var errorCode = AnyChatWebSDK.anychatSDKInstance.AnyChatSDKRecordTag.addFaceCompareTag(tagOpt);
	                        if(errorCode!=0)throw errorCode;
	                    }
	                } catch (e) {
	                    var result={
	                        AnyChatResult : {
	                            code: e,
	                            msg: AnyChatSDKErrorCode.checkErrorMsg(e),
	                        },
	                    }
	                    AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
	                        type: "onAIErrorface"+this.facetaskid [taskid],
	                        result: result,
	                    });
	                }
	            }
	        }
	    },
	    //??????????????????
	    stopFaceDetect :function (option) {
	        if(!this.isAlive){
	            return;
	        }
	        (typeof(option.finishevent) === "function") && AnyChatWebSDK.anychatSDKInstance.setCallBack("onAIFinishface"+option.facetaskid, option.finishevent, true);//????????????
	        var json = {
	            "cmd":ANYCHAT_AI_CTRL_ABILITY_INVOKE,
	            "aitype": ANYCHAT_AI_TYPE_AFR,
	            "start":0,
	            "taskid":option.facetaskid,
	            "robotid":this.guid,
	            "filetype":1,
	        }
	        var strInJson = JSON.stringify(json);
	        var err=BRAC_SDKControl(ANYCHAT_CORESDKEVENT_AIABILITY, strInJson);
	        logger.invokeLog("stopFaceDetect", err, { taskid: option.afrTaskId});
	    },
	    //??????????????????

	    doOcrImage:function (option) {
	        if(!this.isAlive){
	            return;
	        }
	        var taskid=BRAC_NewGuid()
	        this.doOcrImagetaskid[taskid] = taskid;
	        (typeof(option.event) === "function") && AnyChatWebSDK.anychatSDKInstance.setCallBack("onAIPrepareocr"+this.doOcrImagetaskid[taskid], option.event, true);//????????????

	        (typeof(option.resultevent) === "function") && AnyChatWebSDK.anychatSDKInstance.setCallBack("onAIResulocr"+this.doOcrImagetaskid[taskid], option.resultevent, false);//???????????????

	        (typeof(option.errorevent) === "function") && AnyChatWebSDK.anychatSDKInstance.setCallBack("onAIErrorocr"+this.doOcrImagetaskid[taskid], option.errorevent, true);//????????????

	        (typeof(option.finishevent) === "function") && AnyChatWebSDK.anychatSDKInstance.setCallBack("onAIFinishocr"+this.doOcrImagetaskid[taskid], option.finishevent, true);//????????????

	        var json = {
	            "cmd":ANYCHAT_AI_CTRL_ABILITY_INVOKE,
	            "aitype": ANYCHAT_AI_TYPE_OCR,
	            "start":1,
	            "taskid":this.doOcrImagetaskid[taskid],
	            "ocrtype":option.type,
	            "robotid":this.guid,
	            "filetype":1,
	            "content":option.bitmap,
	        }
	        var strInJson = JSON.stringify(json);
	        var err=BRAC_SDKControl(ANYCHAT_CORESDKEVENT_AIABILITY, strInJson);
	        logger.invokeLog("doOcrImage", err, { taskid:this.doOcrImagetaskid[taskid],robotId:this.guid});
	        var lpEventJsonObj=JSON.parse(err);
	        if(lpEventJsonObj.errorcode!=0){//errcode?????????0??????err??????
	            var result={
	                AnyChatResult : {
	                    code: lpEventJsonObj.errorcode,
	                    msg: AnyChatSDKErrorCode.checkErrorMsg(lpEventJsonObj.errorcode),
	                },
	            }
	            AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
	                type: "onAIErrorocr"+this.doOcrImagetaskid[taskid] ,
	                result: result,
	            });
	        }

	    },
	    //??????LOGO??????
	    //option.targetUserId  option.event
	    startFaceCapture:function (option) {
	        if(!this.isAlive){
	            return;
	        }
	        var taskid=BRAC_NewGuid();
	        this.capturetaskid[taskid] = taskid;
	        (typeof(option.event) === "function") && AnyChatWebSDK.anychatSDKInstance.setCallBack("onAIPreparecapture"+this.capturetaskid[taskid], option.event, true);//????????????

	        (typeof(option.resultevent) === "function") && AnyChatWebSDK.anychatSDKInstance.setCallBack("onAIResulcapture"+this.capturetaskid[taskid], option.resultevent, false);//???????????????

	        (typeof(option.errorevent) === "function") && AnyChatWebSDK.anychatSDKInstance.setCallBack("onAIErrorcapture"+this.capturetaskid[taskid], option.errorevent, true);//????????????

	        (typeof(option.finishevent) === "function") && AnyChatWebSDK.anychatSDKInstance.setCallBack("onAIFinishcapture"+this.capturetaskid[taskid], option.finishevent, true);//????????????

	        var json = {
	            "cmd":ANYCHAT_AI_CTRL_ABILITY_INVOKE,
	            "aitype": ANYCHAT_AI_TYPE_AIC,
	            "start":1,
	            "taskid":this.capturetaskid[taskid],
	            "robotid":this.guid,
	            "userid":option.targetUserId ? option.targetUserId : 0,
	            "timeout":option.timeout ? option.timeout : ANYCHAT_AI_TIMEOUT,
	        }
	        if(option.mode==ANYCHAT_AICMODE_FACECAPTURE){
	            json["mode"]=ANYCHAT_AICMODE_FACECAPTURE;
	            json["xmargin"]=option.xmargin ? option.xmargin : 5;
	            json["ymargin"]=option.ymargin ? option.ymargin : 5;
	        }
	        if(option.mode==ANYCHAT_AICMODE_FACECOMPARE){
	            json["mode"]=ANYCHAT_AICMODE_FACECOMPARE;
	            json["content"]=option.content ;
	            json["fileype"]=1;
	            json["comparescore"]= option.comparescore ? option.comparescore : 70.0;
	        }
	        var strInJson = JSON.stringify(json);
	        var err=BRAC_SDKControl(ANYCHAT_CORESDKEVENT_AIABILITY, strInJson);
	        logger.invokeLog("startFaceCapture", err, { taskid: this.capturetaskid[taskid],robotId:this.guid});
	        var lpEventJsonObj=JSON.parse(err);
	        if(lpEventJsonObj.errorcode!=0) {//errcode?????????0??????err??????
	            var result={
	                AnyChatResult : {
	                    code: lpEventJsonObj.errorcode,
	                    msg: AnyChatSDKErrorCode.checkErrorMsg(lpEventJsonObj.errorcode),
	                },
	            }
	            AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
	                type: "onAIErrorcapture"+this.capturetaskid[taskid],
	                result: result,
	            });
	        }
	    },
	    stopFaceCapture:function (option) {
	        if(!this.isAlive){
	            return;
	        }
	        var json = {
	            "cmd":ANYCHAT_AI_CTRL_ABILITY_INVOKE,
	            "aitype": ANYCHAT_AI_TYPE_AIC,
	            "start":0,
	            "taskid":option.aicTaskId,
	            "robotid":this.guid,
	        }
	        var strInJson = JSON.stringify(json);
	        var err=BRAC_SDKControl(ANYCHAT_CORESDKEVENT_AIABILITY, strInJson);
	        logger.invokeLog("stopFaceCapture", err, { taskid: option.aicTaskId});
	        var lpEventJsonObj=JSON.parse(err);
	        if(lpEventJsonObj.errorcode!=0){//errcode?????????0??????err??????
	            var result={
	                AnyChatResult : {
	                    code: lpEventJsonObj.errorcode,
	                    msg: AnyChatSDKErrorCode.checkErrorMsg(lpEventJsonObj.errorcode),
	                },
	            }
	            AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
	                type: "onAIFinishcapture"+option.aicTaskId,
	                result: result,
	            });
	        }
	    }



	};



	var instance =  AnyChatSDKAI;

	exports.instance = instance;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	/*-----------------------------------------------------------
	 * AnyChatAI???????????????
	 * ????????????:???????????????????????????AI??????????????????????????????????????????
	 *
	 *
	 * ----------------------------------------------------------
	 */
	//??????log4js
	var log4js = __webpack_require__(1);
	var logger = log4js.getLogger("AnyChatSDKAIManagement");
	var AnyChatSDKAI = __webpack_require__(18);

	// ???????????????????????????
	function  AnyChatSDKAIManagement() {
	    this.AnyChatAIRobot={};
	};

	AnyChatSDKAIManagement.prototype = {
	    constructor: AnyChatSDKAIManagement,

	    //???????????????
	    //anychatAi ??????????????? AnyChatAIRobot ?????????????????????
	    createRobot  : function() {
	        var anyChatAi=new AnyChatSDKAI.instance();
	        this.AnyChatAIRobot[anyChatAi.guid]=anyChatAi;
	        return anyChatAi;
	    },

	    //???????????????
	    //roboId ?????????id
	    destroyRobot  : function(robotId) {
	        if(!this.AnyChatAIRobot[robotId]){
	            return ;
	        }
	        var err = this.AnyChatAIRobot[robotId].destroyRobot();
	        if(JSON.parse(err).errorcode==0){
	            delete this.AnyChatAIRobot[robotId];
	        }

	    },
	    //??????????????????????????????
	    getAllRobot:function () {
	        var List=[];
	        for(var i in this.AnyChatAIRobot){
	            List.push(this.AnyChatAIRobot[i]);
	        }
	        return List;
	    },
	    //?????????????????????
	    destoryAllRobot:function () {
	        for(var i in this.AnyChatAIRobot){
	            if(!!this.AnyChatAIRobot[i]){
	                var err =this.AnyChatAIRobot[i].destroyRobot();
	                if(JSON.parse(err).errorcode==0){
	                    delete this.AnyChatAIRobot[i];
	                }
	            }
	        }
	    },
	    getAnyChatAIRobot:function (guid) {
	        return this.AnyChatAIRobot[guid];
	    },
	    setAnyChatAIRobot :function (guid,anyChatRobot) {
	        this.AnyChatAIRobot[guid]=anyChatRobot;
	    }
	    }






	var instance =new  AnyChatSDKAIManagement();

	exports.instance = instance;


/***/ }),
/* 20 */
/***/ (function(module, exports) {

	/*-----------------------------------------------------------
	 * AnyChat??????????????????
	 * ????????????:AnyChat??????????????????????????????
	 *
	 *
	 * ----------------------------------------------------------
	 */

	// ???????????????????????????
	function AnyChatSDKRecordTag() {
	    this.recordTagList = [];//????????????
	    this.recordTagOpt = {};//??????????????????
	    this.tagStart =  false;//????????????
	    this.tagType = {
	        faceCheck: 1,
	        faceCompare: 2,
	        question: 3,
	        answer: 4,
	        read: 5,
	    }
	    this.errorCode = {
	        RECORD_TAG_SUCCESS:0,//??????
	        AC_ERROR_RECORD_TAG_PARAMINVALID:400000,//??????????????????
	        AC_ERROR_RECORD_TAG_NOTSTART:400001,// ???????????????
	        AC_ERROR_RECORD_TAG_NOTEXIST:400002,//????????????????????????;
	        AC_ERROR_RECORD_TAG_TASKIDEXIST:400003,//taskId?????????
	    }
	    this.asrResult = "";
	    this.tagFlag = false;//????????????????????????????????????
	};

	AnyChatSDKRecordTag.prototype = {
	    constructor: AnyChatSDKRecordTag,

	    /*
	       * ??????????????????????????????
	       * ??????  opt.tradeNo ????????? , opt.tagFileName ???????????????
	       * ????????? ???err 0:??????;??????:??????
	      */
	    startRecordTag: function (opt) {
	        if (!(opt && opt.hasOwnProperty("tradeNo") && opt.hasOwnProperty("tagFileName"))) {
	            return this.errorCode["AC_ERROR_RECORD_TAG_PARAMINVALID"];
	        }
	        this.recordTagList = []
	        this.recordTagOpt = JSON.parse(JSON.stringify(opt));
	        this.recordTagOpt.recordTime = new Date().getTime();
	        this.tagStart = true;
	        return this.errorCode["RECORD_TAG_SUCCESS"];
	    },

	    /*
	      * ????????????????????????????????????
	      * ??????  opt.taskId ??????id???????????? , opt.expectedFaceNum ??????????????? ???????????? 
	      * opt.title ????????????, opt.userData ????????????
	      * ????????? ???errorCode 0:??????;??????:??????
	     */
	    addFaceCheckTag: function (opt) {
	        if(!this.tagStart){
	            return this.errorCode["AC_ERROR_RECORD_TAG_NOTSTART"];
	        }
	        if (!(opt && opt.hasOwnProperty("taskId") && opt.hasOwnProperty("expectedFaceNum"))) {
	            return this.errorCode["AC_ERROR_RECORD_TAG_PARAMINVALID"];;
	        }
	        var tagObj = {
	            taskId: opt.taskId,
	            title: opt.title || "????????????",
	            userData: opt.userData || "{}",
	            type: this.tagType["faceCheck"],
	            expectedFaceNum: opt.expectedFaceNum,
	        }
	        return this.addRecordTag(tagObj);
	    },

	    /*
	      * ????????????????????????????????????
	      * ??????  opt.taskId ??????id???????????? , opt.result ???????????? 
	      * ????????? ???err 0:??????;??????:??????
	     */
	    updateFaceCheckTag: function (opt) {
	        try {
	            if(!this.tagStart) throw this.errorCode["AC_ERROR_RECORD_TAG_NOTSTART"]
	            if (!(opt && opt.hasOwnProperty("taskId") && opt.hasOwnProperty("result"))) throw this.errorCode["AC_ERROR_RECORD_TAG_PARAMINVALID"];
	            var tagOpt = {};
	            for (var i = this.recordTagList.length - 1; i >= 0; i--) {
	                if (opt.taskId === this.recordTagList[i].taskId) {
	                    tagOpt = this.recordTagList[i];
	                    break;
	                }
	            }
	            if (JSON.stringify(tagOpt) === "{}") throw this.errorCode["AC_ERROR_RECORD_TAG_NOTEXIST"];
	            var actualFaceNum = JSON.parse(opt.result).facenum;
	            (actualFaceNum >= tagOpt.expectedFaceNum) ? tagOpt.checkStatus = 0 : tagOpt.checkStatus = 1;
	            tagOpt.result = opt.result;
	        } catch (e) {
	            return typeof(e) === "number" ?  e : this.errorCode["AC_ERROR_RECORD_TAG_PARAMINVALID"]
	        }
	        return this.errorCode["RECORD_TAG_SUCCESS"];
	    },

	    /*
	      * ????????????????????????????????????
	      * ??????  opt.taskId ??????id???????????? , opt.passScore ??????????????? ???????????? 
	      * opt.title ????????????, opt.userData ????????????
	      * ????????? ???errorCode 0:??????;??????:??????
	     */
	    addFaceCompareTag: function (opt) {
	        if(!this.tagStart){
	            return  this.errorCode["AC_ERROR_RECORD_TAG_NOTSTART"]
	        };
	        if (!(opt && opt.hasOwnProperty("taskId") && opt.hasOwnProperty("passScore"))) {
	            return this.errorCode["AC_ERROR_RECORD_TAG_PARAMINVALID"];
	        }
	        var tagObj = {
	            taskId: opt.taskId,
	            title: opt.title || "????????????",
	            userData: opt.userData || "{}",
	            type: this.tagType["faceCompare"],
	            passScore: opt.passScore,
	        }
	        return this.addRecordTag(tagObj);
	    },

	    /*
	      * ????????????????????????????????????
	      * ??????  opt.taskId ??????id???????????? , opt.result ???????????? 
	      * ????????? ???err 0:??????;??????:??????
	     */
	    updateFaceCompareTag: function (opt) {
	        try {
	            if(!this.tagStart) throw this.errorCode["AC_ERROR_RECORD_TAG_NOTSTART"];
	            if (!(opt && opt.hasOwnProperty("taskId") && opt.hasOwnProperty("result"))) throw this.errorCode["AC_ERROR_RECORD_TAG_PARAMINVALID"];
	            var tagOpt = {};
	            for (var i = this.recordTagList.length - 1; i >= 0; i--) {
	                if (opt.taskId === this.recordTagList[i].taskId) {
	                    tagOpt = this.recordTagList[i];
	                    break;
	                }
	            }
	            if (JSON.stringify(tagOpt) === "{}") throw this.errorCode["AC_ERROR_RECORD_TAG_NOTEXIST"];
	            var result = JSON.parse(opt.result);
	            if (tagOpt.passScore.length === 1) {//??????????????????
	                (result.score >= tagOpt.passScore[0]) ? tagOpt.checkStatus = 0 : tagOpt.checkStatus = 1;
	            } else if (tagOpt.passScore.length === 2) {//??????????????????
	                (result.src1_score >= tagOpt.passScore[0] && result.src2_score >= tagOpt.passScore[1]) ? tagOpt.checkStatus = 0 : tagOpt.checkStatus = 1;
	            } else {
	                throw this.errorCode["AC_ERROR_RECORD_TAG_PARAMINVALID"];
	            }
	            tagOpt.result = opt.result;
	        } catch (e) {
	            return typeof(e) === "number" ?  e : this.errorCode["AC_ERROR_RECORD_TAG_PARAMINVALID"]
	        }
	        return this.errorCode["RECORD_TAG_SUCCESS"];
	    },

	    /*
	      * ??????????????????????????????
	      * ??????  opt.checkQuestion ?????? ????????????
	      * opt.title ????????????, opt.userData ????????????
	      * ????????? ???errorCode 0:??????;??????:??????
	     */
	    addQuestionTag: function (opt) {
	        if(!this.tagStart) return this.errorCode["AC_ERROR_RECORD_TAG_NOTSTART"];
	        if (!(opt && opt.hasOwnProperty("checkQuestion"))) {
	            return this.errorCode["AC_ERROR_RECORD_TAG_PARAMINVALID"];
	        }
	        var tagObj = {
	            taskId: BRAC_NewGuid(),
	            title: opt.title || "??????",
	            userData: opt.userData || "{}",
	            type: this.tagType["question"],
	            checkQuestion: opt.checkQuestion,
	            expectAnswer: opt.checkQuestion,
	            result: opt.checkQuestion,
	        }
	        return this.addRecordTag(tagObj);
	    },

	    /*
	      * ??????????????????????????????
	      * ??????  opt.taskId ??????id ???????????? opt.checkQuestion ?????? ???????????? opt.expectAnswer ????????????????????????
	      * opt.title ????????????, opt.userData ????????????
	      * ????????? ???errorCode 0:??????;??????:??????
	     */
	    addAnswerTag: function (opt) {
			if(!this.tagStart) return this.errorCode["AC_ERROR_RECORD_TAG_NOTSTART"];
	        if (!(opt && opt.hasOwnProperty("taskId") && opt.hasOwnProperty("checkQuestion") && opt.hasOwnProperty("expectAnswer"))) {
	            return this.errorCode["AC_ERROR_RECORD_TAG_PARAMINVALID"];
	        }
			this.asrResult = "";
	        var tagObj = {
	            taskId: opt.taskId,
	            title: opt.title || "??????",
	            userData: opt.userData || "{}",
	            type: this.tagType["answer"],
	            checkQuestion: opt.checkQuestion,
	            expectAnswer: opt.expectAnswer,
	        }
	        return this.addRecordTag(tagObj);
	    },

	    /*
	      * ??????????????????????????????
	      * ??????  opt.taskId ??????id???????????? , opt.result ???????????? 
	      * ????????? ???err 0:??????;??????:??????
	     */
	    updateAnswerTag: function (opt) {
	        try {
	            if(!this.tagStart) throw this.errorCode["AC_ERROR_RECORD_TAG_NOTSTART"];
	            if (!( opt && opt.hasOwnProperty("taskId") && opt.hasOwnProperty("result"))) throw this.errorCode["AC_ERROR_RECORD_TAG_PARAMINVALID"];
	            var tagOpt = {};
	            for (var i = this.recordTagList.length - 1; i >= 0; i--) {
	                if (opt.taskId === this.recordTagList[i].taskId) {
	                    tagOpt = this.recordTagList[i];
	                    break;
	                }
	            }
	            if (JSON.stringify(tagOpt) === "{}") throw this.errorCode["AC_ERROR_RECORD_TAG_NOTEXIST"];
	            var result = opt.result;
	            tagOpt.result = result;
	            (tagOpt.expectAnswer.indexOf(result) > -1 && opt.result != "") ? tagOpt.checkStatus = 0 : tagOpt.checkStatus = 1;
	        } catch (e) {
	            return typeof(e) === "number" ?  e : this.errorCode["AC_ERROR_RECORD_TAG_PARAMINVALID"]
	        }
	        return this.errorCode["RECORD_TAG_SUCCESS"];
	    },

	    /*
	      * ??????????????????????????????
	      * ??????   opt.checkQuestion ???????????? ???????????? opt.expectAnswer ????????????????????????
	      * opt.title ????????????, opt.userData ????????????
	      * ????????? ???errorCode 0:??????;??????:??????
	     */
	    addReadTag: function (opt) {
	        if(!this.tagStart){
	            return this.errorCode["AC_ERROR_RECORD_TAG_NOTSTART"]
	        }
	        if (!(opt && opt.hasOwnProperty("checkQuestion") && opt.hasOwnProperty("expectAnswer"))) {
	            return this.errorCode["AC_ERROR_RECORD_TAG_PARAMINVALID"];
	        }
	        var tagObj = {
	            taskId: BRAC_NewGuid(),
	            title: opt.title || "????????????",
	            userData: opt.userData || "{}",
	            type: this.tagType["read"],
	            result:opt.checkQuestion + opt.expectAnswer,
	            checkQuestion: opt.checkQuestion,
	            expectAnswer: opt.expectAnswer,
	        }
	        this.addRecordTag(tagObj);
	        return this.errorCode["RECORD_TAG_SUCCESS"];
	    },

	    //??????????????????
	    completeRecordTag: function () {
	        this.tagStart = false;
	        var currentTime = new Date().getTime();
	        var lastTagObj = this.recordTagList[this.recordTagList.length - 1];
	        if (lastTagObj) {
	            lastTagObj.elapse = currentTime - lastTagObj.currentTime;
	        }
	        for(var i in this.recordTagList){
	            if(this.recordTagList[i].type === this.tagType["answer"]){
	                this.recordTagList[i].expectAnswer = this.recordTagList[i].expectAnswer.toString();
	            }
	        }
	        return JSON.parse(JSON.stringify(this.recordTagList));
	    },

	    //??????????????????
	    getRecordTag: function () {
	        return JSON.parse(JSON.stringify(this.recordTagList));
	    },

	    //????????????????????????
	    addRecordTag: function (tagObj) {
	        for(var i in this.recordTagList){
	            var obj = this.recordTagList[i];
	            if(obj.taskId === tagObj.taskId){
	                return this.errorCode['AC_ERROR_RECORD_TAG_TASKIDEXIST'];
	            }
	        }
	        var currentTime = new Date().getTime();
	        tagObj.currentTime = currentTime;
	        tagObj.tradeNo = this.recordTagOpt.tradeNo;
	        tagObj.tagFileName = this.recordTagOpt.tagFileName;
	        tagObj.index = this.recordTagList.length;
	        tagObj.checkStatus = tagObj.checkStatus || 1;// ????????????
	        tagObj.result = tagObj.result || "";
	        tagObj.timestamp = currentTime - this.recordTagOpt.recordTime;
	        if (this.recordTagList.length === 0) {
	            tagObj.elapse = 0;
	        } else {
	            var lastTagObj = this.recordTagList[this.recordTagList.length - 1];
	            lastTagObj.elapse = currentTime - lastTagObj.currentTime;
	        }
	        this.recordTagList.push(tagObj);
			return this.errorCode['RECORD_TAG_SUCCESS'];
	    },

	    //??????taskId???????????????????????????????????????
	    updateRecordTag: function(opt){
	        var tagObj = {};
	        var errorCode =  this.errorCode["AC_ERROR_RECORD_TAG_PARAMINVALID"]; 
	        for(var i = this.recordTagList.length - 1; i >= 0; i--){
	            if(opt.taskId === this.recordTagList[i].taskId){
	                tagObj = this.recordTagList[i];
	            }
	        }
	        if(tagObj.hasOwnProperty("type")){
	            switch(tagObj.type){
	                case this.tagType["faceCheck"]:errorCode = this.updateFaceCheckTag(opt);break;
	                case this.tagType["faceCompare"]:errorCode = this.updateFaceCompareTag(opt);break;
	                case this.tagType["answer"]:errorCode = this.updateAnswerTag(opt);break;
	                default:break;
	            }
	        }
	        return errorCode
	    },

	    //??????type???????????????????????????????????????
	    addRecordTagByType: function(opt){
	        var errorCode =  this.errorCode["AC_ERROR_RECORD_TAG_PARAMINVALID"];
	        if(opt.hasOwnProperty("type")){
	            switch(opt.type){
	                case this.tagType["question"]:errorCode = this.addQuestionTag(opt);break;
	                case this.tagType["read"]:errorCode = this.addReadTag(opt);break;
	                default:break;
	            }
	        }
	        return errorCode
	    }
	};


	var instance = AnyChatSDKRecordTag;

	exports.instance = instance;


/***/ })
/******/ ]);