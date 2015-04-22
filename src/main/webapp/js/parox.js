/**
 * fileName:将所有库，自定义组件、工具挂载到Parox对象上
 * createdBy:William
 * date:2014/8/14
 */
define('parox',['jquery','backbone','underscore','lang/zh-CN','config',
    'models','util/util','component/component'],function(require){
	'use strict';
	var loadingBar=require('component/loading');
	var $=require('jquery');
	var Backbone=require('backbone');
	var _=require('underscore');
	var LANG=require('lang/zh-CN');
	var CONFIG=require('config');
	var models=require('models');
	var util=require('util/util');
	var component=require('component/component');
	var PAROX= {
			version:1.6,
			$:$,
			Backbone:Backbone,
			_:_,
			LANG:LANG,
			CONFIG:CONFIG,
			models:models,
			util:util,
			component:component,
			__USER:new models.UserModel({userId:CONFIG.USER_ID}),
			__NOTICE:new Backbone.Model(),
			on:	function(name, callback, context){
				this.__NOTICE.on(name, callback, context);
				return this;
			},
			off:function(name, callback, context){
				this.__NOTICE.off(name, callback, context);
				return this;
			},
			trigger:function(){
				this.__NOTICE.trigger(arguments);
				return this;
			},
			notification:{
				__support:!!window.Notification,
				__hasPermission:function(){
					if(this.__support){
						return Notification.permission==='granted';
					}else{
						return false;
					}

				},
				show:function(option){
					if(!this.__support){return false;}
					var defaults={
						title:'系统通知',
						notice:'你有新的通知',
						icon:'',
						onClick:function(){},
						callback:function(){}
					};
					option= _.extend(defaults,option);
					var callback= _.bind(function(){
						if(this.__notification){
							this.__notification.close();
						}
						this.__notification=new Notification(option.title,{
							body:option.notice,
							icon:option.icon
						});
						this.__notification.addEventListener('click',function(){
							this.close();
							option.onClick();
						});
						option.callback(this.__notification)
					},this);

					if(this.__hasPermission()){
						callback();
					}else{
						Notification.requestPermission(_.bind(function(){
							if(this.__hasPermission()){
								callback();
							}
						},this));
					}
				},
				close:function(){
					if(this.__notification){
						this.__notification.close();
					}
				}
			},
			ringTone:{
				__support:function(){
					return !!this.__audio.canPlayType
				},
				__path:'ring/01.mp3',
				init:function(){
					var audio=this.__audio=document.createElement('audio');
					$(audio).hide().appendTo('body');
				},
				play:function(path){
					if(!this.__support()){
						return false;
					}
					path=path||this.__path;
					this.__audio.src=path;
					this.__audio.play();
				}
			}
		};

	PAROX.ringTone.init();
	//定义基础view类,其它的视图都基于此基类进行扩展
	//视图和model是一一对应的关系，每个视图用一个model来管理状态与必要的数据,
	//在初始化方法里，对model进行监听，如果关键属性发生变化，则重新加载视图

	PAROX.View=PAROX.Backbone.View.extend({

		//视图当前是否显示
		__isDisplay:false,

		//视图是否已经加载
		__isLoaded:false,

		//此视图依赖的属性，如果此属性发生变化，则重新加载视图
		__requireKey:'spaceId',

		//此model记录视图的状态
		__viewModel:new PAROX.Backbone.Model(),

		//此视图的子视图集合
		__childViews:new PAROX.Backbone.Collection(),
		set:function(key, val, options){
			this.__viewModel.set(key, val, options);
			return this;
		},

		get:function(key){
			return this.__viewModel.get(key);
		},
		getName:function(){
			return this.viewName;
		},
		//显示视图
		show:function(animate,speed){
			var _speed=speed||0;
			var _ani=animate||'show';
			this.__isDisplay=true;
			this.$el.stop()[_ani](_speed);
            this.onShow.call(this);
			return this;
		},

		//隐藏主视图
		hide:function(animate,speed){
			var _speed=speed||PAROX.CONFIG.SPEED;
			var _ani=animate||'hide';
			this.__isDisplay=false;
			this.$el.stop().hide();
            this.onHide.call(this);
			return this;
		},
		empty:function(){
			this.$el.empty();
			return this;
		},
		isLoaded:function(){
			return this.__isLoaded;
		},
		isDisplay:function(){
			return this.__isDisplay;
		},
		activeMenu:function(viewName){
			this.$('[data-behavior="'+viewName+'"]')
				.addClass('active')
				.siblings()
				.removeClass('active');
			return this;
		},
		onCommandBtnClick:function(e){
			var command=this.$(e.currentTarget).data('command');
			var fn=this[command];
			if(_.isFunction(fn)){
				fn.call(this,e);
			}
		},
		getActiveView:function(){
			var activeView;
			this.__childViews.each(function(view){
				if(view.isDisplay()){
					activeView=view;
					return false;
				}
			});
			return activeView;
		},
        onShow:$.noop,
        onHide:$.noop
	});

	//管家视图,每一大模块用管家view来扩展，用来管理子视图
	PAROX.ManageView=PAROX.View.extend({
		initialize:function(){
			//对模型进行监听，如果属性发生变化，则加页面
			this.listenTo(this.__viewModel,'change',function(){
				this.loadChildView();
			});
		},
		//根据关键属性加载子视图
		loadChildView:function(){
			var requireKey=this.get(this.__requireKey);
			var childView=this.__childViews;
            if(childView){
                childView.each(function(view){
                    view.__viewModel.set(view.__requireKey,requireKey);
                },this);
                this.__isLoaded=true;
            }

			return this;
		},
		getChildViews:function(){
			return this.__childViews;
		},
		findChildViewByName:function(name){
			return this.__childViews.findWhere({viewName:name});
		},
		triggerEvents:function(eventName,not){
			var childView=this.__childViews;
			if(childView){
				childView.each(function(view){
					if(view.viewName!==not){
						view.__viewModel.trigger(eventName);
					}
				},this);
			}
			return this;
		}
	});

	var methods = ['forEach', 'each', 'map', 'collect', 'reduce', 'foldl',
		'inject', 'reduceRight', 'foldr', 'find', 'detect', 'filter', 'select',
		'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke',
		'max', 'min', 'toArray', 'size', 'first', 'head', 'take', 'initial', 'rest',
		'tail', 'drop', 'last', 'without', 'difference', 'indexOf', 'shuffle',
		'lastIndexOf', 'isEmpty', 'chain', 'sample'];

	//定义一个视图集合的基类，用来存放多个视图集合
	var ViewCollection=function(viewList){
		this.initialize(viewList);
	};

	ViewCollection.prototype={
		initialize:function(viewList){
			if(!PAROX._.isArray(viewList)){
				PAROX.$.error('viewList must be an array');
			}
			this.viewList=viewList;
		},

		at: function(index) {
			return this.viewList[index];
		},

		where: function(attrs, first) {
			if (PAROX._.isEmpty(attrs)) {
				return first ? void 0 : [];
			}
			return this[first ? 'find' : 'filter'](function(view) {
				for (var key in attrs) {
					if (attrs[key] !== view.getName(key)){
						return false;
					}
				}
				return true;
			});
		},
		findWhere: function(attrs) {
			return this.where(attrs, true);
		},
		activeViewByName:function(viewName,prop){
			var returnView;
			this.each(function(view){
				if(view.getName()===viewName){
                    if(prop){
                        view.set(prop);
                    }
					returnView=view.show();
				}else{
					view.hide();
				}
			},this);
			return returnView;
		}
	};

	_.each(methods, function(method) {
		ViewCollection.prototype[method] = function() {
			var args =[].slice.call(arguments);
			args.unshift(this.viewList);
			return PAROX._[method].apply(PAROX._, args);
		};
	});

	PAROX.ViewCollection=ViewCollection;

	PAROX.alert=util.alert;

	PAROX.confirm=util.confirm;

    var message=new component.Message();

	/**
	 * @description 消息提示，没有确认按钮与取消按钮，会自动隐藏
	 * @param message {string|Object} 提示消息或配置选项
	 *			Object.type{string} 提示框类型 normal|warning|error|success
	 *			Object.content{string} 消息内容
	 *			Object.title{string} 窗口标题
	 *			Object.autoHide{boolean|number}是否自动隐藏
	 */
	PAROX.message=function(msg){
		var defaults={
			autoHide:3000,
			modal:false,
            type:'success'
		};
		var opt=PAROX._.isString(msg)?
				PAROX.$.extend(defaults,{content:msg}):
				PAROX.$.extend(defaults,msg);
		message.set(opt).show();
	};

	PAROX.showLoading=function(){
		loadingBar.showLoading();
	};
	PAROX.hideLoading=function(){
		loadingBar.hideLoading();
	};

    PAROX.dateTimePicker=new component.DateTimePicker(CONFIG.DATE_TIME_PICKER_OPTION);

	PAROX.reLogin=function(){
		window.location.href='/login';
	};

	//当前登录用户的ID
	PAROX.USER_ID=CONFIG.USER_ID;

	if(PAROX.USER_ID===0){
		PAROX.reLogin();
	}

	PAROX.ajax=function(url,options){
		if ( typeof url === "object" ) {
			options = url;
		}

		var onError=options.error;
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
		options.error=function(xhr,error,throwError){
			var sessionState=xhr.getResponseHeader('sessionstate');
			var handleError=function(xhr,error,throwError){
				var sessionState=xhr.getResponseHeader('sessionstate');
				var errorText=xhr.getResponseHeader('parox_error');
				var onConfirm=sessionState==='timeout'?
					function(){
						window.location.reload();
					}: $.noop;

				errorText=errorText?decodeURI(errorText):'对不起，请求服务器发生错误！请稍候再试。';

				util.alert({content:errorText,onConfirm:onConfirm});
				if(_.isFunction(onError)){
					onError(xhr,error,throwError);
				}
			};
			if(sessionState==='timeout'){
				$.ajax({
					url:CONFIG.REQUEST_URL.CHECK_USER_ONLINE,
					success:function(resp){
						if(resp===1){
							options.error=handleError;
							$.ajax(options);
						}
					},
					error:handleError
				});
			}else{
				handleError(xhr,error,throwError);
			}
		};

		$.ajax(options);
	};

	PAROX.createWebSocket=function(url){
		/*if(!window.WebSocket){
			var webSocket=new window.WebSocket(url);
			webSocket.addEventListener('open',function(){
				PAROX.alert('服务器已经连接');
			});
			webSocket.addEventListener('message',function(e){
				PAROX.alert('收到新的消息');
			});
			webSocket.addEventListener('error',function(e){
				PAROX.alert('连接服务器发生错误');
			});
		}else{*/
			url=url.indexOf('ws://')>-1?url.replace('ws://','http://'):url;

			JS.Engine.on('notice', function(responseText){
				var notice= $.parseJSON(responseText);
				PAROX.__NOTICE.set({notice:notice});
			});

			JS.Engine.start(url);
		/*}*/
	};

	return PAROX;
});