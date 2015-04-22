/**
 * fileName:应用所有模型
 * createdBy:William
 * date:2014/8/15
 */
define('models',['backbone','underscore','jquery','config','component/dialog','util/util','lang/zh-CN','moment'],function(require){
	'use strict';
	var Backbone	=	require('backbone');
	var _			=	require('underscore');
	var $			=	require('jquery');
	var CONFIG		=	require('config');
	var util		=	require('util/util');
	var LANG		=	require('lang/zh-CN');
	var DATE_STRING	=	LANG.DATE_STRING;
	var loadingBar=require('component/loading');
	var moment=require('moment');
	var Model=Backbone.Model.extend({
		sync:function(method, model, options){
			var self=this;
			var args=arguments;
			var error=options.error;
			var beforeSend=options.beforeSend;
			var complete=options.complete;

			options.beforeSend=function(xhr){
				loadingBar.showLoading();
				if(_.isFunction(beforeSend)){
					beforeSend(xhr);
				}
			};

			options.complete=function(xhr,statusText){
				loadingBar.hideLoading();
				if(_.isFunction(complete)){
					complete(xhr);
				}
			};

			options.error=function(xhr,text,statusText){
				var sessionState=xhr.getResponseHeader('sessionstate');
				var handleError=function(xhr,text,statusText){
					var sessionState=xhr.getResponseHeader('sessionstate');
					var errorText=xhr.getResponseHeader('parox_error');
					var onConfirm=sessionState==='timeout'?
						function(){
							window.location.reload();
						}: $.noop;

					errorText=errorText?decodeURI(errorText):'对不起，请求服务器发生错误！请稍候再试。';

					util.alert({content:errorText,onConfirm:onConfirm});
					if(_.isFunction(error)){
						error(xhr,text,statusText);
					}
				};
				if(sessionState==='timeout'){
					$.ajax({
						url:CONFIG.REQUEST_URL.CHECK_USER_ONLINE,
						success:function(resp){
							if(resp===1){
								options.error=error;
								return Backbone.sync.apply(self, args);
							}
						},
						error:handleError
					});
				}else{
					handleError(xhr,text,statusText);
				}
			};

			return Backbone.sync.apply(this, arguments);
		}
	});

	return {
		//组织模型
		OrgModel:Model.extend({
			urlRoot:CONFIG.REQUEST_URL.ORG,
			idAttribute:'orgId',
            pattern:/^[^~\!@#$%\^&\*()=\\\/\[\]\{\}\,\.\_\?`￥（）【】｛｝，。！|、？；——‘’“”:：;''""<>《》\+]+$/,
            regular: /(https)?:\/\/([\w-]+\.)+[\w-]+(\/[\w-]+ .\/?%&=]*)?/,
			getPhoto:function(){
				return this.get('logo')||CONFIG.DEF_PHOTO.ORG;
			},
			formatCreateTime:function(){
                var createTime=this.get('createTime');
				return createTime?util.formatDate(createTime):'暂无时间';
			},
			isEditable:function(){
				return this.get('ownerId')==CONFIG.USER_ID;
			},
            validate:function(attr){
                var labels=attr.labels,address=attr.address,email=attr.email,
                    website=attr.website,fax=attr.fax,telephone=attr.telephone;
                if('labels' in attr && labels){
                    var newlabels=labels.split(',');var label=newlabels[newlabels.length-1];
                    var modellabels=this.get('labels');var labelsArray=modellabels?modellabels.split(','):'';
                    if(label && !this.pattern.test(label)){
                        return {status:false,info:'标签不能包含特殊字符!',interfix:'labels'};
                    }
                    if(label && _.indexOf(labelsArray,label)!=-1){
                        return {status:false,info:'该标签已存在',interfix:'labels'};
                    }
                }
                if('address' in attr){
                    if(address && !this.pattern.test(address)){
                        return {status:false,info:'地址名不能包含特殊字符！',interfix:'address'};
                    }
                    if(address && address.length>80){
                        return {status:false,info:'您的地址输入过长',interfix:'address'};
                    }
                }
                if('email' in attr){
                    if(email && !util.validate.verEmail(email)){
                        return {status:false,info:'邮箱格式不正确',interfix:'email'};
                    }
                }
                if('website' in attr){
                    if(website && !this.regular.test(website)){
                        return {status:false,info:'网址格式不正确',interfix:'webkit'};
                    }
                }
                if('fax' in attr){
                    if(fax && !util.validate.verPhoneAndFax(fax)){
                        return {status:false,info:'传真号不能有特殊符号，除了“ - ”',interfix:'fax'};
                    }
                    if(fax && attr.fax.length>30){
                        return {status:false,info:'传真号过长了',interfix:'fax'};
                    }
                }
                if('telephone' in attr){
                    if(telephone && !util.validate.verPhoneAndFax(telephone)){
                        return {status:false,info:'电话号不能有特殊符号，除了“ - ”',interfix:'telephone'};
                    }
                    if(telephone && telephone.length>30){
                        return {status:false,info:'电话号码过长了',interfix:'telephone'};
                    }
                }

            }
		}),
		//空间模型
		SpaceModel:Model.extend({
			urlRoot:CONFIG.REQUEST_URL.SPACE,
			idAttribute:'spaceId',
            pattern:/[~#^$@%&!*`/\'".,/?]/gi,
            validate:function(attr){
                var name=attr.name;
				if(this.pattern.test(name)){
					return '空间名不能包含特殊符号！请重新输入';
				}
				if(name.length>50){
				  return '空间名字数不超过50字';
				}
				if(!name){
					return '空间名不能为空！';
				}

            },
			isEditable:function(){
				return this.get('ownerId')==CONFIG.USER_ID;
			}
		}),
		//用户模型remainder
		UserModel:Model.extend({
			urlRoot:CONFIG.REQUEST_URL.USER,
			validate:function(attr){
				if(attr.name===''){
					return '用户名不能为空';
				}
			},
			idAttribute:'userId',
            getPhoto: function () {
                return this.get('bigPhoto') ? this.get('bigPhoto')+'?'+Math.random() : CONFIG.DEF_PHOTO.USER;
            },
            getEmail: function () {
                return this.get('email');
            },
			isMyself:function(){
				return Number(this.get('userId'))===CONFIG.USER_ID;
			},
			getTaskRatio:function(){
				var acceptCount=this.get('taskAcceptCount'),
					finishCount=this.get('taskFinishCount'),
					ratio=finishCount/(acceptCount+finishCount)*100;
				return isNaN(ratio)?'0.00':ratio.toFixed(2);
			}
		}),
		//任务模型
		TaskModel:Model.extend({
			urlRoot:CONFIG.REQUEST_URL.TASK,
			defaults:{
				taskLabel:''
			},
            validate:function(attr){
                if('name' in attr){
                    if(attr.name.length>500){
                       return '对不起，您的任务名过长，请控制在500字内';
                    }
                }
                if('description' in attr){
                    if(attr.description.length>1000){
                        return '对不起，您输入的任务描述过长，请控制在1000字内';
                    }
                }
            },
			parse:function(resp){
				_.extend(resp,resp.task);
				resp.editAble=resp.status<2&&resp.myPermission===2;
				resp.allowToggleDone=resp.myPermission===2;
				delete resp.task;
				return resp;
			},
			getPhoto:function(){
				return this.get('smallPhoto')||CONFIG.DEF_PHOTO.USER;
			},
            getPhotoUrl:function(){
                var userId=this.get('userId');
                return CONFIG.ROOT+'/avatar/'+userId+'/big';
            },
			initialize:function(){
				//初始化时，如果截止时间已经过期，则为模型添加一个过期属性，方便筛选
				this.set('expired',this.getExpiredStatus());
				this.set('timeStamp',this.getMilliSeconds(this.get('endTime')));
			},
            convertPriorityToClass:function(){
                return this.get('priority')>0?'icon-12-mark-danger':'icon-12-mark';
            },
			isShowAcceptBtn:function(){
				return this.get('status')===0&&this.get('userId')!==CONFIG.USER_ID;
			},
			getExpiredStatus:function(){
				var endTime=this.get('endTime');
				var difference=this.getDifference();

				if(!endTime){
					return -2;
				}

				if(this.getDate(endTime)===this.getDate()){//今天到期的
					return 0;
				}
				if(difference<0){//过期
					return -1;
				}else {
					return 1;//过期时间大于一天
				}

			},
			getStatusText:function(){
				var text,status=Number(this.get('status'));
				switch (status){
					case 0:
						return this.get('userId')===CONFIG.USER_ID?'进行中':'未开始';
					case 1:
						return '进行中';
					default:
						return '已完成';
				}
			},
			getPriorityText:function(){
				return Number(this.get('priority'))===1?'紧急':'普通';
			},
			getDifference:function(){
				var endTime=this.get('endTime');
				var endTimeMilliSeconds=this.getMilliSeconds(endTime);
				var currentMilliSeconds=this.getMilliSeconds();
				return endTimeMilliSeconds-currentMilliSeconds;
			},
			getFormatDate:function(){
                var endTime=this.get('endTime');
				return endTime?util.formatDate(endTime):'无截止日期';
			},
            formatCreateTime:function(){
                var createTime=this.get('createTime');
                return createTime?util.formatDate(createTime,'mm:dd'):'暂无时间';
            },
			//获取任务剩余天数
			remainder:function(){

				var endTime=this.get('endTime');
				var oneDay=86400000;
				var difference=this.getDifference();
				var returnValue;
				if(!endTime){
					return {
						text:'无截止日期',
						klass:'text-info'
					};
				}
				var text=this.getFormatDate();
				if(difference>=0){
					if(difference<oneDay){//如果小于一天，字体为红色
                        var time=(difference/1000/60/60);
                        var str=time> 0.02&& time<1 ? Math.floor(time*60)+'分钟' : (time).toFixed(2)+'小时';
						returnValue={
							text:'剩余'+str,
							klass:'text-warning'
						};
					}else{//大于一天，小于两周，为蓝色
						returnValue={
							text:'剩余'+Math.floor(difference/oneDay)+'天',
							klass:'text-main'
						};
					}
				}else{
					if(this.isDone()){
						returnValue= {
							text:'已完成',
							klass:'text-info'
						};
					}else{
                        var timeval;
                        var val=Math.abs(difference)/oneDay;
                        if(val<1 && Math.floor(val*24)<1){
                            timeval=Math.floor(val*1440)+'分';
                        }else if(val<1){
                            timeval=(val*24).toFixed(2)+'小时';
                        }else{
                            timeval=Math.floor(val)+'天';
                        }

						returnValue={
							text:'已过期'+timeval,
							klass:'text-danger'
						};
					}

				}
				return returnValue;
			},
			getMilliSeconds:function(endTime){
				return endTime?new Date(endTime).getTime():new Date().getTime();
			},
			getDate:function(endTime){
				return endTime?new Date(endTime).getDate():new Date().getDate();
			},
            getColorPrompt:function(){
                var arr=this.remainder();
                var klass=arr.klass,array=[];
                array['text-danger']='task-past';array['text-info']='task-infinite';
                array['text-main']="task-close";array['text-warning']='task-today';

                return array[klass];
            },
			//将任务状态转换成类名
			convertStatusToClass:function(){

				var status=Number(this.get('status'));
				switch (status){
					case 0:

					case 1:
						var className=this.remainder();
						var key=className.klass,
							classNames={
								'text-danger':'task-past',
								'text-info':'task-infinite',
								'text-main':'task-close',
								'text-warning':'task-today'
							};

						return classNames[key];
					case 2:
					case 3:
						return 'task-status-success';
				}
			},
			isDone:function(){
				return this.get('status')>=2;
			},
			toggleEditAble:function(){
				var isDone=this.isDone();
				this.set({editAble:this.get('myPermission')===2&&!isDone});
				return this;
			},
			idAttribute:'taskId'
		}),
		//任务标签模型
		TaskLabelModel:Model.extend({
			urlRoot:''
		}),
		//任务检查项模型
		TaskCheckItemModel:Model.extend({
			urlRoot:CONFIG.REQUEST_URL.TASK_CHECK_ITEM,
			idAttribute:'itemId'
		}),
		//日程模型
		ScheduleModel:Model.extend({
			urlRoot:CONFIG.REQUEST_URL.AGENDA,
            timePattern:/^([0-1][0-9]|[2][0-3])(:)([0-5][0-9])+$/,
			validate:function(attr){
				if(attr.name===''){
					return '日程标题不能为空！';
				}
                if(attr.gmtFrom&&attr.gmtTo){

                    if(attr.gmtTo.valueOf()<attr.gmtFrom.valueOf()){
                        return '结束时间不能小于开始时间';
                    }
                }
                if(attr.startMin && attr.endMin){
                    if(!this.timePattern.test(attr.startMin)){
                        return '开始时间格式不正确';
                    }
                    if(!this.timePattern.test(attr.endMin)){
                        return '结束时间格式不正确';
                    }
                }
                if(!attr.isSimple && attr.end&&attr.start){
                    if(attr.end.valueOf()<=attr.start.valueOf()){
                        return '结束时间不能小于开始时间';
                    }
                }

			},
			getFormatDate:function(type){
				var date=type==='from'?this.get('gmtFrom'):this.get('gmtTo');
				return util.formatDate(date,'yyyy:mm:dd hh:mm');
			},
            getFormatTime:function(){
                var date=this.get('end');
                var all=util.formatDate(date,'yyyy:mm:dd hh:mm');
                var today=Number(new Date().getDate());
                var time,day=Number(all.substr(8,2));
                if(today==day){
                    var house=all.split(' ');
                    time=house[1];
                }else{
                    time="全天";
                }
                return time;
            },
			formatStartTime:function(){
				return this.get('allDay')?'全天':moment(this.get('start')).format('HH:mm');
			},
            getTimeBySeconds:function(){
                var remindTime=this.seconds,arr=[],parm;
                var createTime=this.gmtCreated;
                var time=Math.abs(Number(remindTime));
                var reg=/^[^\.]+$/;
                arr[3]=time/604800000;
                arr[2]=time/86400000;
                arr[1]=time/3600000;
                arr[0]=time/60000;
                for(var i= arr.length-1;i>=0;i--){
                    if(arr[i]>1 && reg.test(arr[i])){
                        parm={
                            type:i,
                            time:Math.floor(arr[i])
                        };
                        break;
                    }
                }
                return parm;
            },
            getRemindTime:function(){
                var date=this.gmtNotify;
                var all=util.formatDate(date,'yyyy:mm:dd hh:mm');
                var arr=all.split(' ');
                var time=arr[1];
                return time;
            },
            getRemindDay:function(){
                var date=this.gmtNotify,parm;
                var createDate=moment(this.start).valueOf();
                var remindTime=util.formatDate(date,'yyyy:mm:dd');
                var createTime=util.formatDate(createDate,'yyyy:mm:dd');
                var time=moment(createTime).valueOf()-moment(remindTime).valueOf();
                var milliseconds=Math.abs(time/86400000);
                if(milliseconds%7==0){
                    parm={
                        num:milliseconds/7,
                        type:1
                    };
                }else{
                    parm={
                        num:milliseconds,
                        type:0
                    };
                }
                return parm;
            }
		}),
		//活动模型
		ActivityModel:Model.extend({
			urlRoot:'',
			validate:function(attr){

			},
			idAttribute:'actId',
			getActText:function(type){
				var atype=this.get('type');
				var text=util.getOperationType(type,atype);
                if(atype==21 ||atype==27){
                    text=text+':'+this.get('docName');
                }
				return atype===3?
					text+this.get('taskName'):
					text;
			},
			getPhotoUrl:function(){
                var userId=this.get('userId');
				return CONFIG.ROOT+'/avatar/'+userId+'/big';
			},
            getPhoto:function(){//获取图片查看是否在其他位置不行
				var user=this.get('user');
				var photo=user?user.smallPhoto:null;
				photo=photo||CONFIG.DEF_PHOTO.USER;
				return photo;

            },
            getImg:function(){
                return this.get('user').smallPhoto ||CONFIG.DEF_PHOTO.USER;
            },

			getActivityPhoto:function(){
				return this.get('photoUrl')||CONFIG.DEF_PHOTO.USER;
			},

			formatActTime:function(){
				return util.formatDate(this.get('actTime'));
			},
			getThumbnailsUrl:function(){
				return CONFIG.ZOOM_URL+'/'+this.get('struct').docStoreName+'@!80x80';
			},
            getInfo:function(){
                return $.parseJSON(this.get('info'));
            }
		}),
		//文档版本模型
		DocVersionModel:Model.extend({
			idAttribute:'version',
			formatEditTime:function(){
				var editTime=this.get('createTime');
				editTime=editTime||0;
				return util.formatDate(editTime);
			}
		}),
		//文件夹模型
		FolderModel:Model.extend({
			urlRoot:CONFIG.REQUEST_URL.FOLDER,
			validate:function(attr){
                if(attr.folderName){
                    var folderName=attr.folderName;
                    if(!folderName){
                        return '文件夹名称不能为空';
                    }
                    if(!util.validate.verFolderName(folderName)){
                        return '文件夹名称不合法，请重新输入！';
                    }
                }

			},
			idAttribute:'folderId',
			formatFileSize:function(){
				var size=this.get('totalSize')||0;
				return util.formatFileSize(size);
			},
            formatCreateTime:function(){
                return util.formatDate(this.get('createTime'));
            },
            formatLastModifyTime:function(){
                return util.formatDate(this.get('editTime'));
            },
			getName:function(){
				return this.get('folderName');
			},
			getOwnerName:function(){
				return this.get('realName');
			},
			getPath:function(){
				return this.get('path');
			},
			getDescription:function(){
				return this.get('description');
			},
			getLink:function(){
				var view=this.get('view');
				var viewLower=view.toLowerCase();
				var spaceId=this.get('spaceId');
				var folderId=this.get('folderId');
				var baseUrl=viewLower.indexOf('space')>-1?
					'#workspace/'+spaceId+'/spaceDocument/'+view+'/'+folderId:
					'#member/discovery/document/'+view+'/'+spaceId+'/'+folderId;
				baseUrl=viewLower.indexOf('recycle')>-1?'javascript:;':baseUrl;
				return baseUrl;
			},
			getICON:function(){
				var icon;
				if(this.get('shareStatus')){
					icon=this.get('userId')===CONFIG.USER_ID?
						'sharebyme':
						'sharebyother';
				}else{
					icon='normal';
				}
				return icon;
			},
			getSharedLink:function(){
				var url='#link/sharedFolder/{folderId}/{parentId}';
				url=url.replace('{folderId}',this.get('parentId'));
				url=url.replace('{parentId}',this.get('folderId'));
				return url;
			},
            getPermission:function(){
				var permission=this.get('permission');
				return permission?permission.permLevel:-1;
			},
			allowEditable:function(){
				var permission=this.getPermission();
				return permission===2||permission===1;
			}
		}),
		//文档模型
		DocumentModel:Model.extend({
			urlRoot:CONFIG.REQUEST_URL.DOCUMENT,
			idAttribute:'docId',
            validate:function(attr){
                if(attr.docName){
                    var docName=attr.docName;
                    if(!docName){
                        return '文档名称不能为空';
                    }
                    if(!util.validate.verFolderName(docName)){
                        return '文档名称不合法，请重新输入！';
                    }
                }
            },
			formatCreateTime:function(){
				var createTime=this.get('createTime');
				return createTime?util.formatDate(createTime):'无效时间';
			},
			formatEditTime:function(){
				var editTime=this.get('editTime');
				return editTime?util.formatDate(editTime):'无效时间';
			},
			editTimeFromNow:function(){
				return moment(this.get('editTime')).fromNow();
			},
			formatFileSize:function(){
				var size=this.get('fileSize')||0;
				return util.formatFileSize(size);
			},
			// //-1无权限,0所有权,1编辑,2查看,3预览
			getPermissionText:function(){
				var textArr=[0,'创建者','编辑','查看','预览'];
				var permission=this.get('permission');
				return permission===-1?'无权限':textArr[permission];
			},
			formatLastModifyTime:function(){
				var editTime=this.get('editTime');
				return util.formatDate(editTime||0);
			},
			getName:function(){
				return this.get('docName');
			},
			getOwnerName:function(){
				return this.get('realName');
			},
			getPath:function(){
				return this.get('locationStr');
			},
			getDescription:function(){
				return this.get('remarks');
			},
			getUserName:function(){
				var user=this.get('user')||this.get('createUser');
				return user.get?user.get('realName'):user.realName;
			},
			getPhoto:function(){
				var user=this.get('user')||this.get('createUser');
				var photo=user.get?user.get('smallPhoto'):null;
				return photo||CONFIG.DEF_PHOTO.USER;
			},
			parse:function(json){
				_.extend(json,json.document);
				return json;
			},
			allowEditable:function(){
				var permission=this.get('permission');
				return permission===2||permission===1;
			}
		}),
        RemoveDocumentModel:Model.extend({
            url:'/core/folder/remove/',
            idAttribute:'docId'
        }),
		//通知模型
		NoticeModel:Model.extend({
			urlRoot:'',
			validate:function(attr){

			},
			idAttribute:'noticeId'
		}),
		//评论模型
		CommentModel:Model.extend({
			urlRoot:CONFIG.REQUEST_URL.COMMENT,
			validate:function(attr){
				if(!attr){
					return '评论不能为空';
				}
			},
			formatDate:function(){
                var releaseTime=this.get('releaseTime');
				return releaseTime?util.formatTime(util.formatDate(releaseTime)):'暂无';
			},
			getRealName:function(){
				return this.get('user').realName||'佚名';
			},
			getPhoto:function(){
				var user=this.get('user');
				var photo=user?user.smallPhoto:null;
				photo=photo||CONFIG.DEF_PHOTO.USER;
				return photo;
			},
			parse:function(resp){
				var model=resp.comment;
				model.child=resp.child;
				model.user=resp.user;
                model.repliedUser=resp.repliedUser;
				return model;
			},
            getUserLink:function(){
                var userId=this.get('user').userId;
                return '#user/'+userId+'/user-introduction';
            },
            getRepliedUserLink:function(){
                var userId=this.get('repliedUser').userId;
                return '#user/'+userId+'/user-introduction';
            },
            getRepliedUserName:function(){
                return this.get('repliedUser').realName;
            },
			isEditable:function(){
				return this.get('userId')===CONFIG.USER_ID;
			},
			idAttribute:'commentId'
		}),
		//日期模型
		DateModel:Model.extend({
			defaults:{
				year:0,
				month:0,
				date:0,
				day:0
			},
			initialize:function(){

			},
			validate:function(attr){
				if(attr.year<2014){
					return LANG.DATE_ERROR.INVALID_YEAR;
				}
				if(attr.month>12||attr.month<1){
					return LANG.DATE_ERROR.INVALID_MONTH;
				}
			},
			toLocalDateString:function(){
				return this.get('year')+DATE_STRING.YEAR+util.beforeZero(this.get('month'))+
					DATE_STRING.MONTH+util.beforeZero(this.get('date'))+DATE_STRING.DAY;
			},
			toLocalMonthDateString:function(){
				return util.beforeZero(this.get('month'))+
					DATE_STRING.MONTH+util.beforeZero(this.get('date'))+DATE_STRING.DAY;
			},
			toLocalMonthString:function(){
				return this.get('year')+DATE_STRING.YEAR+util.beforeZero(this.get('month'))+DATE_STRING.MONTH;
			},
			nextMonth:function(){
				var year=Number(this.get('year'));
				var month=Number(this.get('month'));
				return {
					year:month===12?year+1:year,
					month:month===12?1:month+1
				};
			},
			prevMonth:function(){
				var year=Number(this.get('year'));
				var month=Number(this.get('month'));
				return {
					year:month===1?year-1:year,
					month:month===1?12:month-1
				};
			},
			getDate:function(type){
				var milli=this.getStartMilliSeconds();
				var result=type==='next'?milli+86400000:milli-86400000;
				var _date=new Date(result);
				return{
					year:_date.getFullYear(),
					month:_date.getMonth()+1,
					date:_date.getDate()
				};
			},
			nextDay:function(){
				return this.getDate('next');
			},
			prevDay:function(){
				return this.getDate('prev');
			},
			getStartMilliSeconds:function(){
				return new Date(this.get('year'),this.get('month')-1,this.get('date')).getTime();
			},
			getSixDaysLater:function(){
				var date=new Date(this.getStartMilliSeconds()+86400000*6);
				return date.getMonth()+1+'-'+date.getDate()+this.formatWeek(date.getDay());
			},
			nextWeekStartDate:function(){
				return this.getStartMilliSeconds()+86400000*7;
			},
			prevWeekStartDate:function(){
				return this.getStartMilliSeconds()-86400000*7;
			},
			formatHour:function(hour){
				var _hour=Number(hour);
				return _hour<13?_hour+'am':_hour-12+'pm';
			},
			formatWeek:function(week){
				return DATE_STRING.WEEK+DATE_STRING.WEEK_STRING[week||this.get('day')];
			},
			formatDate:function(){
				return this.get('year')+'-'+util.beforeZero(this.get('month'))+'-'+util.beforeZero(this.get('date'));
			},
			getDayElementId:function(){
				return this.formatDate();
			},
			getHourElementId:function(){

			},
			getCurrentTime:function(){
				return new Date().getHours();
			}
		}),
        //联系人模型
        ContactsModel:Model.extend({
			defaults:{
                checked:false
			},
            urlRoot:'/colla/contacts/',
            getPhoto:function(){
				var user=this.get('user');
				var photo=user?user.smallPhoto:this.get('smallPhoto');
				photo=photo||CONFIG.DEF_PHOTO.USER;
				return photo;
            },
            getEmail:function(){
				var user=this.get('user');
				var email=user?user.email:this.get('email');
				email=email||'未填写';
                return email;
            },
            getName:function(){
				var user=this.get('user');
				var name=user?user.realName:this.get('realName');
				name=name||this.getEmail();
				return name;
            },
			getMobile:function(){
				var user=this.get('user');
				var mobile=user?user.mobile:this.get('mobile');
				mobile=mobile||'未填写';
				return mobile;
			}

        }),
        //系统设置模型
        SettingModel:Model.extend({
            defaults:{
                checked:false
            },
            urlRoot:'/core/userAccount/',
            idAttribute:'userId',
            validate:function(attr){
                if('email' in attr){
                    if(!attr.email){
                        return {status:false,info:'您还未输入邮箱号'};
                    }
                    else if(!util.validate.verEmail(attr.email)){
                        return {status:false,info:'邮箱格式不正确'};
                    }
                }
               if('mobile' in attr){
                   if(!attr.mobile){
                       return {status:false,info:'您还未输入手机号'};
                   }
                   else if(!util.validate.verMobile(attr.mobile)){
                       return{status:false,info:'手机格式不正确'};
                   }
               }
            }
        }),


		//任务追踪者模型
		TaskTrackerModel:Model.extend({
			urlRoot:CONFIG.REQUEST_URL.TASK_TRACKER,
            getPhoto:function(){
				var user=this.get('user');
				var photo=user?user.smallPhoto:null;
					photo=photo||CONFIG.DEF_PHOTO.USER;
                return photo;
            },
            getUserName:function(){
                return this.get('user').realName;
            }
		}),

		//任务分配模型
		TaskAssignModel:Model.extend({
			urlRoot: CONFIG.REQUEST_URL.TASK_ASSIGN,
            getUserName:function(){
				var profile=this.get('profile');
                return profile?profile.realName:'anonymous';

            },

            getPhoto:function(){
				var profile=this.get('profile');
				var photo=profile?profile.smallPhoto:null;
                return photo||CONFIG.DEF_PHOTO.USER;
            }
		}),

		//登录模型
		LoginModel:Model.extend({
			urlRoot:'/login/',/*
			defaults:{
				username:'',
				password:''
			},*/
			validate:function(attr){
                var msg;
                if('username' in attr){
                    var username=attr.username;
                    if(!username){
                        return {status:false,info:'用户名不能为空',interfix:'username'};
                    }else if(!util.validate.verEmail(attr.username) && !util.validate.verMobile(attr.username)){
                        return {status:false,info:'用户名格式不正确',interfix:'username'};
                    }else{
                        $.ajax({
                            url:CONFIG.REQUEST_URL.LOGIN+'doVerifyExist/',
                            async:false,
                            type:'get',
                            data:{target:attr.username},
                            success:function(resp){
                                if(!resp.success){
                                    msg={status: resp.success,info:'账号尚未注册',interfix:'username'};
                                }
                            }
                        });
                        if(msg) return msg;
                    }
                }
                if('password' in attr){
                    var password=attr.password;
                    if(!password){
                        return {status:false,info:'密码不能为空',interfix:'password'};
                    }else if(!util.validate.verMaxLength(attr.password,16) || !util.validate.verMinLength(attr.password,6)){
                        return {status:false,info:'密码长度6-16位',interfix:'password'};
                    }else if('username' in attr){
                        $.ajax({
                            url:CONFIG.REQUEST_URL.LOGIN+'ajax/passwordVerify',
                            async:false,
                            type:'get',
                            data:{email:attr.username,password:attr.password},
                            error:function(resp){
                                    msg={status: resp.success,info:'您输入的账号或密码错误，请重新输入',interfix:'login-call'};
                            }
                        });
                        if(msg) return msg;
                    }
                }
				/*var info={
					usernameStatus:true,
					usernameInfo:'',
					passwordStatus:true,
					passwordInfo:''
				};
				if(!attr.username){
					info.usernameStatus=false;
					info.usernameInfo='用户名不能为空';
				}else if(!util.validate.verEmail(attr.username) && !util.validate.verMobile(attr.username)){
					info.usernameStatus=false;
					info.usernameInfo='用户名格式不正确';
				}else{
					$.ajax({
						url:CONFIG.REQUEST_URL.LOGIN+'doVerifyExist/',
						async:false,
						type:'get',
						data:{target:attr.username},
						success:function(d){
							info.usernameStatus = d.success;
							if(!d.success){
								info.usernameInfo = '账号尚未注册';
							}
						}
					});
				}

				if(!attr.password){
					info.passwordStatus=false;
					info.passwordInfo='密码不能为空';
				}else if(!util.validate.verMaxLength(attr.password,16) || !util.validate.verMinLength(attr.password,6)){
					info.passwordStatus=false;
					info.passwordInfo='密码长度6-16位';
				}
				return info;*/
			}
		}),
		//注册模型
		RegisterModel:Model.extend({
			urlRoot:'/register/accomplish/',
            pattern:/^[^~\!#$%\^&\*()=\\\/\[\]\{\}\,\?`￥（）【】｛｝——，。！、？；|‘’“”:：;""<>《》\+]+$/,
			validate:function(attr){

                if('email' in attr){
                    var email=attr.email;
                    if(!email){
                        return {status:false,info:'请输入你的注册邮箱',interfix:'email'};
                    }
                    if(email && !util.validate.verEmail(email)){
                        return {status:false,info:'邮箱格式不正确',interfix:'email'};
                    }else{
                        var msg;
                        $.ajax({
                            url:CONFIG.REQUEST_URL.REGISTER+'verifyEmail/',
                            async:false,
                            type:'get',
                            data:{email:attr.email},
                            success:function(d){
                                if(!d.success){
                                    msg={status:d.success,info:d.message,interfix:'email'};
                                }
                            }
                        });
                        if(msg){
                            return msg;
                        }

                    }
                }
                if('realName' in attr){
                    var realName=attr.realName;
                    if(!realName){
                        return {status:false,info:'姓名不能为空',interfix:'realName'};
                    }
                    if(realName && !this.pattern.test(realName)){
                        return {status:false,info:'姓名不能有特殊符号',interfix:'realName'};
                    }
                    if(realName && realName.length>80){
                        return {status:false,info:'输入的名字过长',interfix:'realName'};
                    }
                }
                if('password' in attr){
                    var password=attr.password;
                    if(!password){
                        return {status:false,info:'密码不能为空',interfix:'password'};
                    }
                    if(password && util.validate.verPassword(password)){
                        return {status:false,info:'密码只能由字母、数字组成',interfix:'password'};
                    }
                    if(password && password.length<6){
                        return {status:false,info:'密码长度不能小于6位',interfix:'password'};
                    }
                    if(password && password.length>32){
                        return {status:false,info:'密码长度不要超过32位',interfix:'password'};
                    }
                }

			}
		}),
		//填写用户信息
		RegisterActiveEmailModel:Model.extend({
			defaults:{
				'activeCode':'',
				'email':'',
				'realName':'',
				'password':'',
				'passwordConfirm':'',
				'isService':''
			},
			validate:function(attr){
				var info={
					realNameStatus:true,
					realNameInfo:'',
					passwordStatus:true,
					password:'',
					passwordConfirmStatus:true,
					passwordConfirmInfo:'',
					isServiceStatus:true,
					isServiceInfo:''
				};

				if(!attr.realName){
					info.realNameStatus = false;
					info.realNameInfo	='请填写你的用户名';
				}else if(!util.validate.verMinLength(attr.realName,2)){
					info.realNameStatus = false;
					info.realNameInfo	='用户名至少两个字符';
				}

				if(!attr.password){
					info.passwordStatus = false;
					info.passwordInfo	='请输入密码';
				}else if(!util.validate.verMinLength(attr.password,6)||!util.validate.verMaxLength(attr.password,20)){
					info.passwordStatus = false;
					info.passwordInfo	='6~16个字符,区分大小写';
				}

				if(!attr.passwordConfirm){
					info.passwordConfirmStatus	= false;
					info.passwordConfirmInfo	='请确认密码';
				}else if(attr.password!==attr.passwordConfirm){
					info.passwordConfirmStatus	= false;
					info.passwordConfirmInfo	='密码不一致';
				}

				if(!attr.isService){

					info.isServiceStatus		= false;
					info.isServiceInfo			='请同意，才能继续激活';
				}
				return info;
			},
			urlRoot:'register/userinfo'
		}),
		//找回密码并验证账号
		RecoverPasswordModel:Model.extend({
			urlRoot:'/login/recover/resend/',
			validate:function(attr){
				var info={
					status:false,
					info:''
				};
				if(!attr.email){
					info.status = false;
					info.info	='请输入你的注册邮箱';
				}else if(!util.validate.verEmail(attr.email)){
					info.status = false;
					info.info	='邮箱格式不正确';
				}else{
					$.ajax({
						url:CONFIG.REQUEST_URL.REGISTER+'findPassword/',
						async:false,
						type:'get',
						data:{target:attr.email},
						success:function(d){
							info.status = d.success;
							if(!d.success){
								info.info	= '系统中未找到该账户';
							}else{
								info.info	= d.message;
							}

						}
					});
				}
				return info;
			}
		}),
		ResetPasswordModel:Model.extend({
			defaults:{
				'password':'',
				'passwordConfirm':''
			},
			validate:function(attr){
				var info={
					passwordStatus:true,
					password:'',
					passwordConfirmStatus:true,
					passwordConfirmInfo:''
				};

				if(!attr.password){
					info.passwordStatus = false;
					info.passwordInfo	='请输入密码';

				}else if(!util.validate.verMinLength(attr.password,6)||!util.validate.verMaxLength(attr.password,20)){
					info.passwordStatus = false;
					info.passwordInfo	='6~16个字符,区分大小写';
				}else{
					info.passwordStatus = true;
					info.passwordInfo	='';
				}

				if(!attr.passwordConfirm){
					info.passwordConfirmStatus	= false;
					info.passwordConfirmInfo	='请确认密码';
				}else if(attr.password!==attr.passwordConfirm){
					info.passwordConfirmStatus	= false;
					info.passwordConfirmInfo	='密码不一致';
				}else{
					info.passwordStatus = true;
					info.passwordInfo	='';
				}

				return info;

			}
		}),
		SearchModel:Model.extend({
			urlRoot:'',
			getResultTypeText:function(){
				var type=this.get('type');
				switch (type){
					case 'space':
						return '空间';
					case 'contact':
						return '联系人';
					case 'task':
						return '任务';
					case 'agenda':
						return '日历';
					case 'doc':
						return '文件';
				}
			},
            getResultCssStyle: function () {
                var type=this.get('type');
                switch (type){
                    case 'space':
                        return 'icon-12-space';
                    case 'contact':
                        return 'icon-12-contact';
                    case 'task':
                        return 'icon-12-task';
                    case 'agenda':
                        return 'icon-12-calendar';
                    case 'doc':
                        return 'icon-12-file';
                }
            },
			formatCreateTime:function(){
				var time=this.get('issueTime');
				return time?util.formatDate(time):'无效时间';
			},
			getEmail:function(){
				var labels=this.get('labels');
				return labels?labels.split(',')[0]:'无效邮箱';
			},
			getMobile:function(){
				var labels=this.get('labels');
				return labels?labels.split(',')[1]:'无效电话';
			},
			getUserLink:function(){
				if(this.get('type')==='contact'){
					return '#user/'+this.get('userId')+'/user-introduction';
				}
			},
			getWorkSpaceLink:function(){
				if(this.get('type')==='space'){
					return '#workspace/'+this.get('infoId')+'/spaceRecentUpdate';
				}
			},
			getLink:function(){
				var type=this.get('type');
				if(type==='contact'){
					return '#user/'+this.get('userId')+'/user-introduction';
				}else if(type==='space'){
					return '#workspace/'+this.get('infoId')+'/spaceRecentUpdate';
				}else{
					return 'javascript:;'
				}
			},
			getCommand:function(){
				return this.get('type');
			},
			getId:function(){
				return this.get('infoId');
			}
		}),
        //空间设置信息
        SpaceSetUpModel:Model.extend({
            urlRoot:CONFIG.REQUEST_URL.WORKSPACE_LIST,
            idAttribute:'spaceId',
            validate:function(attr){
                if(!attr.name){
                    return {state:false};
                }
                if(util.validate.verSpaceName(attr.name)){
                    return {state:false,info:'名称不可用'};
                }
            },
            getOwnerId: function () {
                if(this.get('ownerId')===10010){
                    return this.get('ownerId');
                }else{
                    return false;
                }

            }
        }),
        AddToSpaceModel:Model.extend({
            urlRoot:'/colla/workspace/inviteFromContacts.htm'
        }),
        //消息模型
        MessageModel:Model.extend({
            urlRoot:'/core/systemMessage/',
            idAttribute:'msgId',
            getPhoto: function () {
                var msgBody=$.parseJSON(this.get('msgBody'));
                var userId=msgBody.userId;
                    userId=userId?userId:'';
                return userId? CONFIG.ROOT+'/avatar/'+userId+'/big': CONFIG.ROOT+'/images/images1.6/avatar-user-140x140.png';
            },
			getMsgBody:function(){
				return $.parseJSON(this.get('msgBody'));
			}
        }),
		DialogModel:Model.extend({
			defaults:{
				title:'',
				subTitle:'',
				type:'normal',
				confirm:true,
				confirmText:'创建并邀请用户',
				cancel:true,
				cancelText:'取消',
				modal:true,
				autoHide:false,
				onConfirm: $.noop,
				onShow: $.noop,
				onHide: $.noop
			},
			validate:function(attr){
				if(!attr.title){
					return '窗口标题不为能空';
				}
				if(!_.isFunction(attr.onConfirm)){
					return '确定回调必须是函数';
				}
				if(!_.isFunction(attr.onShow)){
					return 'onShow回调必须为函数';
				}

			},
			getClass:function(){
				var type=this.get('type');
				switch (type){
					case 'normal':
						return 'btn-normal';
					case 'danger':
						return 'btn-danger';
					case 'success':
						return 'btn-success';
					case 'warning':
						return 'btn-warning';
				}
			}
		}),
        //组织下的成员模型
        MemberModel:Model.extend({
            urlRoot:'/core/member/',
            idAttribute:'memberId',
            defaults:{
                checked:false,
                isOwner:false
            },
            getPhoto: function () {
                return this.get('smallPhoto') || CONFIG.DEF_PHOTO.USER;
            },
            getEmail:function(){
                return this.get('email');
            }
        }),
		//空间协作者型
		CollaboratorModel:Model.extend({

		}),
        //空间下的协作者模型
        WorkSpaceUserModel:Model.extend({
            urlRoot:'/colla/workspaceUser/',
            idAttribute:'id',
            defaults:{
                checked:false
            },
            getPhoto:function(){
				var user=this.get('user');
				var photo=user?user.smallPhoto:null;
				photo=photo||CONFIG.DEF_PHOTO.USER;
				return photo;
            },
            getName:function(){
                var user=this.get('user');
                var username=user.realName || user.email;
                return username;
            },
            getEmail:function(){
                var user=this.get('user');
                return user.email;
            }
        }),
        //组织验证模型
        OrgCertifyModel:Model.extend({
            urlRoot:'/core/organization/certification/',
            pattern:/[~#^$@%&!*`/\'".,/?]/gi,
            regular: /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w-]+ .\/?%&=]*)?/,
            validate:function(attr){
                var address=attr.address,email=attr.email,fax=attr.fax,telephone=attr.telephone,
                    orgCode=attr.orgCode,linkman=attr.linkman,orgPhoto=attr.orgPhoto;
                if('address' in attr){
                    if(!address){
                        return {status:false,info:'地址不为空',interfix:'address'};
                    }
                    if(address && this.pattern.test(address)){
                        return {status:false,info:'地址名不能包含特殊字符！请重新出入',interfix:'address'};
                    }
                    if(address && address.length>80){
                        return {status:false,info:'确定您的地址有这么长，不要骗我',interfix:'address'};
                    }
                }
                if('email' in attr){
                    if(!email){
                        return {status:false,info:'邮箱不能为空',interfix:'email'};
                    }
                    if(email && !util.validate.verEmail(email)){
                        return {status:false,info:'邮箱格式不正确',interfix:'email'};
                    }
                }
                if('fax' in attr){
                    if(fax && !util.validate.verPhoneAndFax(fax)){
                        return {status:false,info:'输入的传真号不能有特殊符号，除了 - 该符号',interfix:'fax'};
                    }
                    if(fax && attr.fax.length>30){
                        return {status:false,info:'输入的传真号太长了',interfix:'fax'};
                    }
                }
                if('telephone' in attr){
                    if(!telephone){
                        return {status:false,info:'电话号不能为空',interfix:'telephone'};
                    }
                    if(telephone && !util.validate.verPhoneAndFax(telephone)){
                        return {status:false,info:'输入的电话号不能有特殊符号',interfix:'telephone'};
                    }
                    if(telephone && telephone.length>30){
                        return {status:false,info:'输入的电话号码太长了',interfix:'telephone'};
                    }
                }
                if('orgCode' in attr){
                    if(!orgCode){
                        return {status:false,info:'请填写机构代码',interfix:'orgCode'};
                    }
                    if(orgCode && !util.validate.verZipCode(orgCode)){
                        return {status:false,info:'机构代码格式不正确',interfix:'orgCode'};
                    }
                }
                if('orgPhoto' in attr){
                    if(!attr.orgPhoto){
                        return {status:false,info:'请上传机构代码照片',interfix:'orgPhoto'};
                    }
                }
                if('linkman' in attr){
                    if(!attr.linkman){
                        return {status:false,info:'请填写联系人',interfix:'linkman'};
                    }
                    if(linkman && this.pattern.test(linkman)){
                        return {status:false,info:'联系人名不能包含特殊字符！请重新出入',interfix:'linkman'};
                    }
                    if(linkman.length>40){
                        return {status:false,info:'联系人名称过长',interfix:'linkman'};
                    }
                }
            }
        }),
        //组织状态模型
        OrgStatusModel:Model.extend({
            urlRoot:'/core/organization/certification/',
            idAttribute:'orgId'
        }),
		//邮箱模型
		EmailModel:Model.extend({
			validate:function(attr){
                var email= $.trim(attr.emails);
                var verEmail=util.validate.verEmail;

				if(!email){
					return '邮箱不能为空';
				}
                if(email.indexOf(',')>-1){//多个email
                    var emails=email.split(',');
                    var len=emails.length;
                    for(var i=0;i<len;i++){
                       if(!verEmail(emails[i])){
                           return LANG.VERLIDATE_STRING.EMAIL;
                       }
                    }
                }else{
                    if(!verEmail(email)){
                        return LANG.VERLIDATE_STRING.EMAIL;
                    }
                }
			}
		}),
        //文档文件夹链接模型
        LinkModel:Model.extend({
            urlRoot:CONFIG.REQUEST_URL.CREATE_LINK
        }),
        //当前用户的简历\通知设置模型
        UserProfileModel:Model.extend({
            urlRoot:CONFIG.REQUEST_URL.USER_PROFILE,
            idAttribute:'userId',
            pattern:/^[^~\!@#$%\^&\*()=\\\/\[\]\{\}\,\.\_\?`￥（）【】｛｝——，。！、？；|‘’“”:：;""<>《》\+]+$/,
            verification:/^[^~\!@#$%\^&\*()=\\\/\[\]\{\}\.\-\_\?`￥（）【】——｛｝。！？；|、‘’“”:：;""<>《》\+]+$/,
            textpattern:/<>\{\}/gi,
            validate: function (attr) {
                var userName=attr.realName,deptName=attr.deptName,position=attr.position,labels=attr.labels,
                    address=attr.address,zipcode=attr.zipcode,cellphone=attr.cellphone;
                if('realName' in attr) {
                    if (!userName) {
                        return {status: false, info: '名字不为空',interfix:'realName'};
                    }
                    if (userName && !this.pattern.test(userName)) {
                        return {status: false, info: '姓名不能有特殊字符',interfix:'realName'};
                    }
                    if (userName && userName.length > 30) {
                        return {status: false, info: '您输入的姓名过长',interfix:'realName'};
                    }
                }
                if('deptName' in attr){
                    if(deptName && !this.pattern.test(deptName)){
                        return {status:false,info:'部门名不能有特殊符号',interfix:'deptName'};
                    }
                    if(deptName && deptName.length>30){
                        return {status:false,info:'部门的名称过长',interfix:'deptName'};
                    }
                }
                if('position' in attr){
                    if(position && !this.pattern.test(position)){
                        return {status:false,info:'职位名不能有特殊符号',interfix:'position'};
                    }
                    if(position && position.length>30){
                        return {status:false,info:'职位的名称过长',interfix:'position'};
                    }
                }
                if('labels' in attr){
                    if(labels && !this.verification.test(labels)){
                        return {status:false,info:'标签不能有特殊符号，除了逗号',interfix:'labels'};
                    }
                }
                if('address' in attr){
                    if(!address){
                        return {status:false,info:'地址名不为空',interfix:'address'};
                    }
                    if(address && !this.pattern.test(address)){
                        return {status:false,info:'地址名不能有特殊符号',interfix:'address'};
                    }
                    if(address && address.length>80){
                        return {status:false,info:'地址的名称过长',interfix:'address'};
                    }
                }
                if('zipcode' in attr){
                    if(zipcode && !util.validate.verZipCode(zipcode)){
                        return {status:false,info:'邮编号格式不正确',interfix:'zipcode'};
                    }
                }
                if('cellphone' in attr){
                    if(cellphone && !util.validate.verMobile(cellphone)){
                        return {status:false,info:'手机格式不正确',interfix:'cellphone'};
                    }
                }
            }
        }),
        PasswordModel:Model.extend({
            urlRoot:'/core/userAccount/password/',
            validate:function(attr){

            }
        }),
        MobileModel:Model.extend({
            urlRoot:'/core/userAccount/verifyMobile',
            validate: function (attr) {
                if('email' in attr){
                    if(!attr.email){
                        return {status:false,info:'您还未输入邮箱号'};
                    }
                    else if(!util.validate.verEmail(attr.email)){
                        return {status:false,info:'邮箱格式不正确'};
                    }
                }
                if('mobile' in attr){
                    if(!attr.mobile){
                        return {status:false,info:'您还未输入手机号'};
                    }
                    else if(!util.validate.verMobile(attr.mobile)){
                        return{status:false,info:'手机格式不正确'};
                    }
                }
            }
        }),
        StatictisModel:Model.extend({
            urlRoot:CONFIG.REQUEST_URL.SPACE_STATICTIS
        }),

        SpaceStatictisModel:Model.extend({
            urlRoot:CONFIG.REQUEST_URL.SPACE_STATICTIS_LIST
        }),
		OrderRenewModel:Model.extend({
			urlRoot:CONFIG.REQUEST_URL.ORDER_RENEW_PATH
		}),
		OrderUpgradeModel:Model.extend({
			urlRoot:CONFIG.REQUEST_URL.ORDER_UPGRADE_PATH
		}),
        JudgeManagerModel:Model.extend({
            urlRoot:'/common/userRight.htm'
        }),
        EmailNoticeModel:Model.extend({
            urlRoot: CONFIG.REQUEST_URL.USER_PROFILE,
            idAttribute: 'userId'
        }),
		StoreOrderModel:Model.extend({
			defaults:{
				'orgId':'',
				'orgName':'',
				'name':'',
				'mobile':'',
				'userNum':0,
				'numOrderMonth':0,
				'storageGB':0,
				'storageOrderMonth':0,
				'totalFee':0
			},
			validate:function(attr){}
		}),
		StoreOrderUserinfoModel:Model.extend({
			defaults:{
				'province':'',
				'city':'',
				'county':'0',
				'orgId':'',
				'orgName':'',
				'name':'',
				'mobile':'',
				'userNum':0,
				'numOrderMonth':0,
				'storageGB':0,
				'storageOrderMonth':0,
				'totalFee':0
			},
			pattern:/^[^~\!@#$%\^&\*()=\\\/\[\]\{\}\,\?`￥（）【】｛｝，。！？；‘’“”:：;""<>《》\+]+$/,
			validate:function(attr){
				var info={
					addressStatus:true,
					addressInfo:'',
					mobileStatus:true,
					mobileInfo:'',
					zipcodeStatus:true,
					zipcodeInfo:''
				};


				if(attr.address==''){
					info.addressStatus	= false;
					info.addressInfo	= '地址不能为空';
				}else if(!this.pattern.test(attr.address)){
					info.addressStatus	= false;
					info.addressInfo	= '不能输入特殊符号';
				}else if(attr.address.length>80){
					info.addressStatus	= false;
					info.addressInfo	= '地址尽量不要超过80个字符';
				}


				if(attr.zipcode && !util.validate.verZipCode(attr.zipcode)){
					info.zipcodeStatus	= false;
					info.zipcodeInfo	= '您输入的邮政编码格式不正确';
				}

				if(attr.mobile==''){
					info.mobileStatus	= false;
					info.mobileInfo	= '手机号码不能为空';
				}else if(!util.validate.verMobile(attr.mobile)){
					info.mobileStatus	= false;
					info.mobileInfo	= '您输入的手机号码格式不正确';
				}

				return info;

			}
		}),
        CapacityModel:Model.extend({
            urlRoot:'/core/organization/statistic/storage/'
        }),
        InviteRightCheckModel:Model.extend({
            urlRoot:'/colla/workspace/checkInviteRight'
        }),
        SharedUserModel:Model.extend({
            urlRoot:'/core/folder/changePermLevel',
            getPermissionText:function(){
                var perTextArr=[0,'error','编辑','查看','预览'];
                var permLevel=this.get('permLevel');
                return perTextArr[permLevel];
            },
            getUserId:function(){
                return this.get('userId');
            },
            getOwnerId:function(){
                return this.get('ownerId');
            },
            parse:function(resp){
                _.extend(resp,resp.permission);
                return resp;
            },
            getPhoto:function(){
                return this.get('smallPhoto')||CONFIG.DEF_PHOTO.USER;
            },
            getName:function(){
                var realName=this.get('realName');
                return realName?realName:this.get('email');
            },
            getRight:function(){
                var permLevel=this.get('permission').permLevel,right=[];
                right[1]='拥有者';right[2]='编辑';right[3]='查看';right[4]='预览';
                return right[permLevel];

            },
            getClassName:function(){
                var myLevel=this.myLevel,myId=this.myId,userId=this.get('userId');
                var one=myLevel>2 && myId==userId;
                var two=myLevel==2 && this.get('permission').permLevel!=1;
                var three=myLevel==1&& myId!=userId;
                return one || two || three ?'btn-enabled':'';
            }
        }),
        SetBrowserModel:Model.extend({
            urlRoot:'/colla/notifySetting/',
            idAttribute:'userId'
        })

	};
});