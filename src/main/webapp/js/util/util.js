/**
 * fileName:
 * createdBy:William
 * date:2014/8/20
 */
define('util/util',['jquery','config','component/dialog','underscore'],function(require){
	'use strict';
	var $=require('jquery');
	var _=require('underscore');
	var CONFIG=require('config');
	var moment=require('moment');
	var Dialog=require('component/dialog');
	var alert=new Dialog();
	var confirm=new Dialog();

	/**
	 * @author William
	 * @description 格式化数字，如果参数大于10，直接返回，如果小于10，在前面加零
	 * @param {number} num
	 * @returns {string}
	 */
	function beforeZero(num){
		var _num=parseInt(num);
		if($.isNumeric(_num)){
			return _num<10?'0'+_num:_num;
		}else{
			//$.error('function beforeZero\'s argument must be a number!');
		}
	}

	/**
	 * @author William
	 * @description 格式化文件尺寸,将取得的原始尺寸，单位为byte，大于1024M的转化为G,大于1024KB的转化为M，大于1024B的转化为kb
	 * @param {number} size
	 * @returns {string}
	 */
	function formatFileSize(size) {
		var _size = Number(size);
		var returnValue = '';
		var kb = 1024;
		var m = kb * kb;
		var g = m * m;
		if ($.isNumeric(_size)) {
			if (_size < kb) {
				returnValue = _size + 'B';
			} else if (_size < m) {
				returnValue = (_size / kb).toFixed(1) + 'KB';
			} else if (_size < g) {
				returnValue = (_size / m).toFixed(2) + 'M';
			} else {
				returnValue = (_size / g).toFixed(2) + 'G';
			}
		} else {
			$.error('文件大小必须为数字');
		}
		return returnValue;
	}

    function formatTime (timeStr) {
        var _now = new Date();
        var _Year = _now.getFullYear(),
            _M = _now.getMonth() + 1,
            _Day = _now.getDate(),
            _h = _now.getHours(),
            _m = _now.getMinutes(),
            _s = _now.getSeconds();
        var _year = timeStr.substr(0, 4),
            _month = timeStr.substr(5, 2),
            _day = timeStr.substr(8, 2),
            _hour = timeStr.substr(11, 2),
            _min = timeStr.substr(14, 2),
            _second = timeStr.substr(17, 2);
        var hourLag = _h - _hour,
            minLag = _m - _min,
            secLag = _s - _second;
        if (_Year == _year && _M == _month && _Day == _day) {//年月日必须与当前时间相同的情况下，再进行转换

            if (_h == _hour && _min == _m) {//如果，小时，分钟都相等，转换成多少秒前
                return (secLag < 1 ? 1 : secLag) + '秒前';
            }
            if (_h == _hour) {//如果，小时相等，分钟不等，显示多少分前
                return minLag + '分前';
            } else if (hourLag < 24) {
                return hourLag + '小时前';
            }

        }
        return timeStr;
    }

	var _alert=function(){
		var defaults={
			title:'提示',
			cancel:false,
			confirm:true,
			autoHide:false,
			modal:true,
			confirmText:'确定',
			type:'warning'
		};
		var arg=[].slice.call(arguments);
		var opt=typeof(arg[0])==='string'&&arg.length===1?
			$.extend(defaults,{content:arg[0]}):
			$.extend(defaults,arg[0]);
		alert.set(opt).show();
	};

	var _confirm=function(message,callback){
		var defaults={
			title:'提示',
			cancel:true,
			confirm:true,
			autoHide:false,
			modal:true,
			type:'danger',
			confirmText:'确定'
		};
		var opt=_.isString(message)?
			$.extend(defaults,{content:message,onConfirm:callback}):
			$.extend(defaults,message);
		confirm.set(opt).show();
	};

	return {

		beforeZero:beforeZero,
        formatTime:formatTime,
		/**
		 * @description 信息提示框
		 * @param arguments {string|object} 如果只传入字符串，就以默认样式显示此消息,也可以传入object，有以下几个字段可配置
		 *			arguments.type{string} 提示框类型 normal|warning|error|success
		 *			arguments.content{string} 消息内容
		 *			arguments.title{string} 窗口标题
		 *			arguments.confirm{boolean}是否显示确认按钮
		 *			arguments.cancel{boolean}是否显示取消按钮
		 *			arguments.autoHide{boolean|number}是否自动隐藏
		 * @returns undefined
		 */
		alert:_alert,
		/**
		 * @description 确认弹框
		 * @param message {string|Object} 提示消息或配置选项
		 *			Object.type{string} 提示框类型 normal|warning|error|success
		 *			Object.content{string} 消息内容
		 *			Object.title{string} 窗口标题
		 *			Object.confirm{boolean}是否显示确认按钮
		 *			Object.cancel{boolean}是否显示取消按钮
		 *			Object.autoHide{boolean|number}是否自动隐藏
		 *			Object.callback{Function}点击确认之后需要执行的回调
		 * @param callback {Function} 点击确认之后需要执行的回调
		 */
		confirm:_confirm,
		/**
		 * @author William
		 * @description 判断一个字符是否是字符串里的最后一个
		 * @param {string}要断判的字符
		 * @param {string}字符串
		 * @returns {boolean}
		 */
		isLastCharacter:function(character,string){
			var index=string.lastIndexOf(character);
			return index===-1?false:index+1===string.length;
		},
		isFirstCharacter:function(character,string){
			var index=string.indexOf(character);
			return index===-1?false:index===0;
		},
		unique:function(sourceArr,targetArr){
			var firstItem=sourceArr[0];
			var dataType=typeof(firstItem);
			if(_.isObject(firstItem)){
				$.error('数据类型不参为对象！');
			}
			$.each(targetArr,function(i,item){
				item=dataType==='number'?Number(item):String(item);
				var index=sourceArr.indexOf(item);
				if(index>-1){
					sourceArr.splice(index,1);
				}
			});
			return sourceArr;
		},
		localStorage:{
			__isSupportLocalStorage:function(){
				return !!window.localStorage;
			},
			save:function(key,value){
				var keys=[],values=[],val;
				if(this.__isSupportLocalStorage()){
					if(_.isObject(key)){
						for(var name in key){
							val=key[name];
							val= _.isObject(val)?JSON.stringify(val):val;
							keys.push(name);
							values.push(val);
						}
						_.each(keys,function(key,index){
							localStorage.setItem(key,values[index]);
						});
					}
					else if(_.isString(key)){
						value= _.isObject(value)?JSON.stringify(value):value;
						localStorage.setItem(key,value);
					}
				}
			},
			get:function(key){
				if(this.__isSupportLocalStorage()){
					if(_.isString(key)){
						return localStorage.getItem(key);
					}
				}
			},
			clear:function(){
				if(this.__isSupportLocalStorage()){
					localStorage.clear();
				}
			}
		},
		/**
		 * @author William
		 * @description 取得url地址里的hash值
		 * @param {string}url,非必须，如果不传，则取当前页面地址的hash值
		 * @returns {object}
		 */
		getHash:function(url){
			var returns={},hashArr,cArr;
			var hash=!!url?
					url.substring(url.lastIndexOf('#')+1,url.length)
					:window.location.hash.replace('#','');
			if(!hash){
				return null;
			}
			if(hash.indexOf('&')>-1){
				hashArr=hash.split('&');
				$.each(hashArr,function(){
					cArr=this.split('=');
					returns[cArr[0]]=cArr[1];
				});
			}else{
				hashArr=hash.split('=');
				returns[hashArr[0]]=hashArr[1];
			}
			return returns;
		},
        maxDay:function(){
            var d = new Date();
            return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
        },
        daysOfMonth:function(){
            var dayArr=[];
            var maxDay=this.maxDay();
            for (var i = 0; i < maxDay; i++) {
                var strDay = (i + 1) + '日';
                dayArr.push(strDay);
            }
            return dayArr;
        },
		/**
		 * @author William
		 * @description 日期生成器，可生成月视图需要的天数，周视图需要的天数，天视图需要的小时
		 */
		dateGenerator:{
			/**
			 * @description 根据年份，月份生成当月的月视图需要的日期数据
			 * @param month {number}月份，必需
			 * @param year	{number}年份,必需
			 * @returns {Array} 返回一个日期数组
			 */
			generateMonth:function(month,year){
				var _month=Number(month);
				var _year=Number(year);

				if(!$.isNumeric(_month)|| !$.isNumeric(_year)){
					$.error('生成日期的参数必须是数字');
				}

				var yearOfNext=this.yearOfNextMonth(_month,_year);
				var yearOfPrev=this.yearOfPrevMonth(_month,_year);
				var nextMonth=this.nextMonth(_month);
				var prevMonth=this.prevMonth(_month);
				var days=this.daysOfTheMonth(_month,_year);
				var lastDays=this.lastDaysOfPrevMonth(prevMonth,yearOfPrev);
				var beforeDaysLen=42-days.length-lastDays.length;
				var daysOfNextMonth=[],i=0;

				while(i<beforeDaysLen){
					i++;
					daysOfNextMonth.push({
						year:yearOfNext,
						month:nextMonth,
						date:i,
						type:1
					});
				}
				return lastDays.concat(days,daysOfNextMonth);
			},
			/**
			 * @description 根据日期生成一周的日期数据
			 * @param date {number}日期毫秒，也可以是日期，必需
			 * @returns {Array} 返回一个日期数组
			 */
			generateWeek:function(date){
				var time;
				var weekArr=new Array(7);
				var dateArr=[],_date;
				var milliSeconds= 0,oneDay=86400000;
				var today=this.today();
				var self=this;
				if($.isNumeric(date)){
					time=date;
				}else{
					var d=new Date(date);
					time=d.getTime();
				}
				$.each(weekArr,function(i){
					_date=new Date(time+milliSeconds);
					var date=_date.getDate();
					weekArr[i]=_date.getDay();
					dateArr.push({
						date:date,
						month:_date.getMonth()+1,
						year:_date.getFullYear(),
						day:_date.getDay(),
						today:date===today,
						hours:self.generateHours()

					});
					milliSeconds+=oneDay;
				});
				return dateArr;
			},
			generateDay:function(date){
				var _date=new Date(date);
				var self=this;
				var today=this.today();
				var __date=_date.getDate();
				return {
					date:__date,
					month:_date.getMonth()+1,
					year:_date.getFullYear(),
					day:_date.getDay(),
					today:__date===today,
					hours:self.generateHours()

				};
			},
			generateHours:function(){
				var hours=[];
				for(var i=0;i<24;i++){
					hours.push(beforeZero(i));
				}
				return hours;
			},
			/**
			 * @description 获取当前的年份
			 * @returns {number}
			 */
			getCurrentYear:function(){
				return new Date().getFullYear();
			},
			/**
			 * @description 获取当前的月份
			 * @returns {number}
			 */
			getCurrentMonth:function(){
				return new Date().getMonth();
			},
			/**
			 * @description 获取当前月份所有的天数
			 * @param month {number}月份，必需
			 * @param year	{number}年份,必需
			 * @returns {Array}
			 */
			daysOfTheMonth:function(month,year){
				var _year=year||this.getCurrentYear();
				var _month=month||this.getCurrentMonth();
				var _maxDay= new Date(_year,_month,0).getDate();
				var days=[],i= 0,today=this.today();
				while(i<_maxDay){
					i++;

					days.push({
						year:year,
						month:month,
						date:i,
						type:0,
						today:i===today
					});
				}
				return days;
			},
			/**
			 * @description 生成月视图需要的上一个月最后几天
			 * @param month {number}月份，必需
			 * @param year	{number}年份,必需
			 * @returns {Array} 返回一个天数数组
			 */
			lastDaysOfPrevMonth:function(month,year){
				var _prevDays=[];
				var _maxDay=this.daysOfTheMonth(month,year).length;
				var _date=new Date(year,month,1);
				var _week=_date.getDay();
				while(_week>0){
					_prevDays.push({
						date:_maxDay--,
						year:year,
						month:month,
						type:-1
					});
					_week--;
				}
				_prevDays.reverse();
				return _prevDays;
			},
			/**
			 * @description 根据当前的月份，年份，生成下一个月所在的年份
			 * @param month {number}月份，必需
			 * @param year	{number}年份,必需
			 * @returns {number} 返回下一个月所在的年份
			 */
			yearOfNextMonth:function(month,year){
				return month===12?year+1:year;
			},
			/**
			 * @description 根据当前的月份，年份，生成上一个月所在的年份
			 * @param month {number}月份，必需
			 * @param year	{number}年份,必需
			 * @returns {number} 返回上一个月所在的年份
			 */
			yearOfPrevMonth:function(month,year){
				return month===1?year-1:year;
			},
			/**
			 * @description 根据当前的月份，生成下一个月的月份
			 * @param month {number}月份，必需
			 * @returns {number} 返回下一个月的月份
			 */
			nextMonth:function(month){
				return month===12?1:month+1;
			},
			/**
			 * @description 根据当前的月份，生成上一个月的月份
			 * @param month {number}月份，必需
			 * @returns {number} 返回上一个月的月份
			 */
			prevMonth:function(month){
				return month===1?12:month-1;
			},
			/**
			 * @description 获取今天的日期
			 * @returns {number}
			 */
			today:function(){
				return new Date().getDate();
			},
			getDefaultDateOption:function(){
				var date=new Date();
				var month=beforeZero(date.getMonth()+1);
				var _day=beforeZero(date.getDate());
				return {year:date.getFullYear(),month:month,date:_day};
			}
		},
		validate:{
			/**
			 * @author hetao
			 * @description 判断邮件格式
			 * @param email {string}邮件，必需
			 * @returns {boolean}
			 */
			verEmail:function(email){
				var reg = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
				return reg.test(email);
			},
			/**
			 * @description 判断移动号码格式
			 * @param mobile {number} 移动电话，必须
			 * @returns {boolean}
			 */
			verMobile:function(mobile){
				var reg = /^1[3|4|5|8]\d{9}$/;
				return reg.test(mobile);
			},
			/**
			 * @description 判断移动电话与邮箱
			 * @param emailMobile {string} 移动电话与邮箱， 必须
			 * @returns {boolean}
			 */
			verEmailMobile:function(EmailMobile){
				var reg = /^(13\d{9})|([\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+)$/;
				return reg.test(EmailMobile);
			},
			/**
			 * @description 判断纯数字数字
			 * @param number {string}数字，必需
			 * @returns {boolean}
			 */
			verNumber:function(number){
				var reg = /^13\d{9}$/;
				return reg.test(number);
			},
			/**
			 * @description 判断是否小写字母
			 * @param lowercase {string}字符串，必需
			 * @returns {boolean}
			 */
			verLowerCase:function(lowercase){
				var reg = /^[a-z]$/;
				return reg.test(lowercase);
			},
			/**
			 * @description 判断是否大写字母
			 * @param uppercase {string}字符串，必需
			 * @returns {boolean}
			 */
			verUpperCase:function(uppercase){
				var reg = /^[A-Z]$/;
				return reg.test(uppercase);
			},
			/**
			 * @description 判断字符最长
			 * @param str {string}字符串，必需
			 * @param max {number}最大长度，必需
			 * @returns {boolean}
			 */
			verMaxLength:function(str,max){
				return str.length<=max;
			},
			/**
			 * @description 判断字符最短
			 * @param str {string}字符串，必需
			 * @param min {number}最小长度，必需
			 * @returns {boolean}
			 */
			verMinLength:function(str,min){
				return str.length>=min;
			},
			/**
			 * @description 验证消息弹出
			 * @param msg {string}验证消息
			 * @param error {Boolean}消息状态
			 * @returns {boolean}
			 */
			verPopShow:function(msg,error){
				//TODO 确定气泡弹出具体样式再做功能提取，暂用页面方法实现 @hetao
			},
			/**
			 * @description 验证消息隐藏
			 * @param msg {string}验证消息
			 * @param error {Boolean}消息状态
			 * @returns {boolean}
			 */
			verPopHide:function(msg,error){
				//TODO 确定气泡弹出具体样式再做功能提取，暂用页面方法实现 @hetao
			},
            verSpaceName:function(str){

            },
			verFolderName:function(name){
				var reg=/^[^~\!@#$%\^&\*()=\\\/\[\]\{\}\,\?`￥（）【】｛｝，。！？；‘’“”:：;''""<>《》\+]+$/;//验证特列字符
				return reg.test(name);
			},
            verPhoneAndFax:function(phoneOrFax){
                var reg=/^[^~\!@#$%\^&\*()=\\\/\[\]\{\}\,\?`￥（）【】｛｝，。！？；‘’“”:：;''""<>《》\+]+$/;
                return reg.test(phoneOrFax);
            },
            verZipCode:function(zipcode){
                var reg=/^[1-9]\d{5}$/;
                return reg.test(zipcode);
            },
            verLabel:function(label){
                var reg=/^[^~\!@#$%\^&\*()=\\\/\[\]\{\}\,\.\_\?`￥（）【】｛｝，。！|、？；——‘’“”:：;''""<>《》\+]+$/;
                return reg.test(label);
            },
            verPassword:function(password){
                var reg=/[^\w\.\/]/ig;
                return reg.test(password);
            }



		},
		browser:{
			userAgent:window.navigator.userAgent,
			version:function(){
				var version;
				if(this.msIE()){
					var version=navigator.appVersion.split(';')[1];
					version=Number(version.replace('MSIE',''))
				}else{
					version=9;
				}

				return version;
			},
			msIE:function(){
				return this.userAgent.indexOf('MSIE')!==-1;
			},
			fireFox:function(){
				return this.userAgent.indexOf('Firefox')!==-1;
			},

			chrome:function(){
				return this.userAgent.indexOf('Chrome')!==-1;
			},
			supportHTML5:function(){
				return !!window.WebSocket;
			},
			isWINXP:function(){
				return this.userAgent.indexOf('Windows NT 5.1')>-1;
			},
			isVISTA:function(){
				return this.userAgent.indexOf('Windows NT 6.0')>-1;
			},
			isWIN7:function(){
				return this.userAgent.indexOf('Windows NT 6.1')>-1;
			}
		},
		/**
		 * @description 格式化日期
		 * @param date {Date|number|string}date对象或日期毫秒
		 * @param formater {string}日期格式
		 * @param sep {string}分隔符，非必须，不传默认以短横线分隔
		 * @returns {string} 返回格式化后的日期
		 */
		formatDate:function(date,formater,sep){

			if(typeof(date)==='string'){
				return date;
			}
			if(!date){
				date=new Date();
			}

			date= $.isNumeric(date)?new Date(date):date;
			var _y=date.getFullYear();
			var _m=this.beforeZero(date.getMonth()+1);
			var _d=this.beforeZero(date.getDate());
			var _h=this.beforeZero(date.getHours());
			var _min=this.beforeZero(date.getMinutes());
			var _s=this.beforeZero(date.getSeconds());
			var _sep=sep||'-';
			var _formater=formater||'yyyy:mm:dd hh:mm:ss';
			var ymd=_y+_sep+_m+_sep+_d;
			var hms=_h+':'+_min+':'+_s;
			switch (_formater){
				case 'yyyy:mm:dd hh:mm:ss':
					return ymd+' '+hms;
				case 'yyyy:mm:dd':
					return ymd;
				case 'hh:mm:ss':
					return hms;
				case 'mm:dd':
					return _m+_sep+_d;
				case 'yyyy:mm:dd hh:mm':
					return ymd+' '+_h+':'+_min;
			}
		},
		/**
		 * @description 根据日期生成毫秒
		 * @param date {string}日期
		 * @returns {Number} 毫秒
		 */
		getMilliSeconds:function(date){
			return new Date(date).getTime();
		},
		/**
		 * @description 判断文档类型是否是图片
		 * @param type {string}文档类型，必需
		 * @returns {boolean} 是图片返回true,不是返回false
		 */
		isImage:function(type){
			var imgTypeArr=['jpg','jpeg','gif','png','tif'];
			return $.inArray(type,imgTypeArr)!==-1;
		},
		/**
		 * @description 获取操作类型
		 * @param type {String}类型，两种，文档或任务,'doc','task'
		 * @param act {Number}动作代码
		 * @returns {String} 返回操作的类型
		 */
		getOperationType:function(type,act){
			return type==='doc'?
					CONFIG.DOC_ACT_TYPE[act]:
					CONFIG.TASK_ACT_TYPE[act];
		},
		/**
		 * @description 将名值对的数组，转换成对象，主要用来转换通过jquery的serializeArray方法得到的名值对
		 * @param arr {Array}需转换的名值对数组
		 * @returns {Object} 转换过后的对象
		 */
		convertArrayToObject:function(arr){
			var attr={};
			if(!$.isArray(arr)){
				$.error('参数必须为数组');
			}
			$.each(arr,function(i,item){
				attr[item.name]=item.value;
			});
			return attr;
		},
		formatFileSize:formatFileSize
	};
});