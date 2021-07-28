/*此方法用于判断AnyChat是否支持该该版本的浏览器*/
/*返回值是一个对象 如果errorcode为0，则表示AnyChat支持该该版本的浏览器
如果errorcode为1，则表示不支持该版本的浏览器，并显示报错信息msg
*/
function VersionJudgment(){
			var agent = window.navigator.userAgent.toLowerCase();
			var regStr_ie = /msie [\d.]+/gi ;
			var regStr_ie11 = /rv:[\d.]+/gi ;
			var regStr_ff = /firefox\/[\d.]+/gi;
			var regStr_chrome = /chrome\/[\d.]+/gi;
			var regStr_saf = /safari\/[\d.]+/gi;
			var flag = false;
			var alertStr = "AnyChat SDK不支持当前版本的浏览器! \n"+ 
					"AnyChat SDK兼容以下浏览器：\n"+
					"  IE浏览器支持IE10及以上 \n"+
					"  火狐浏览器支持52版本及以下 \n"+
					"  谷歌浏览器：44版本及以下 \n"+
					"  360安全浏览器或极速浏览器 \n"+
					"  UC浏览器以及QQ浏览器\n"+
					"  注：以上浏览器都以32位为主。"
			//IE
			if(agent.indexOf("msie") > 0){
				if((agent.match(regStr_ie)[0].split(' '))[1]*1 >= 10){
//					alert(agent.match(regStr_ie)[0]);
					flag = true;
				}
			}else if(agent.indexOf("rv") > 0 && agent.indexOf("firefox") < 0){
				if((agent.match(regStr_ie11))[0].split(":")[1]*1 > 10){
//					alert(agent.match(regStr_ie11)[0]);
					flag = true;
				}
			}
//			//firefox
			if(agent.indexOf("firefox") > 0){
				if((agent.match(regStr_ff)[0].split('/'))[1]*1 <= 52){
//					alert(agent.match(regStr_ff)[0]);
					flag = true;
				}
			}
//			//Chrome
			if(agent.indexOf("chrome") > 0){
				//QQ or UC
				if(agent.indexOf("qqbrowser") > 0 || agent.indexOf("ubrowser") > 0){
//					alert('QQ or UC');
					flag = true;
				//360
				}else if(!!window.navigator.mimeTypes['application/vnd.chromium.remoting-viewer']){
					flag = true;
				//chrome	
				}else if((agent.match(regStr_chrome)[0].split('/'))[1].split('.')[0]*1 < 44){
//					alert(agent.match(regStr_chrome)[0]);
					flag = true;
				}
			}
			if(flag){
				return {errorcode:0}
			}else{
				return {errorcode:1,msg:alertStr};
			}
		}