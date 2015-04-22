/**
 * fileName:应用入口文件
 * createdBy:William
 * date:2014/8/14
 */
define('main.js',['parox','viewTopBar/view.topbar','viewCommon/task-edit/view.task.editor',
	'viewMember/view.member','viewWorkSpace/view.workspace','viewOrganization/view.organization',
	'viewUser/view.user','viewSettings/view.settings','viewMessage/view.message','viewContacts/view.contacts',
	'views/search-results/view.search.results'],function(require,exports){
	'use strict';
	var PAROX=require('parox');
	var $=PAROX.$;
	var _=PAROX._;
	var browser=PAROX.util.browser;
	var topBarView=require('viewTopBar/view.topbar');

	topBarView.set('userId',PAROX.USER_ID);

	var views=new PAROX.ViewCollection([
		require('viewMember/view.member'),
		require('viewWorkSpace/view.workspace'),
		require('viewOrganization/view.organization'),
		require('viewUser/view.user'),
		require('viewSettings/view.settings'),
		require('viewMessage/view.message'),
		require('viewContacts/view.contacts'),
		require('views/search-results/view.search.results')
	]);

	var AppView=PAROX.ManageView.extend({

		__requireKey:'spaceId',
		__childViews:views,
		el:$(document),
		initialize:function(){
			this.__viewModel=new PAROX.Backbone.Model();
			this.listenTo(this.__viewModel,{
				'change:currentView':function(model,view){
					var isMember=this.isMemberView(view);
					if(isMember){
						topBarView.activeNavItem(view);
					}else{
						topBarView.deActiveNavItem();
					}
				}
			});

		},
		events:{
			'keydown':'onKeyPress'
		},
		NODE_ARR:['INPUT','PASSWORD','TEXTAREA','EMAIL','TEL'],
		onKeyPress:function(e){
			if(e.keyCode===8){
				var nodeName= e.target.nodeName;
				if(_.indexOf(this.NODE_ARR,nodeName)===-1){
					e.preventDefault();
				}
			}
		},
		isMemberView:function(view){
			var memberViews=['dashboard','discovery','calendar','contacts'];
			return _.indexOf(memberViews,view)!==-1;
		}
	});



	//扩展路由
	var AppRouter=PAROX.Backbone.Router.extend({
		initialize:function(){
			this.appView=new AppView();
			PAROX.createWebSocket('/conn');
		},
		routes:{
			'member/:viewName':'switchToDashboard',
			'member/:viewName/:childView/:grandChild':'switchToDiscoveryView',
            'member/:viewName/:childView/:grandChild/*path':'switchToDocumentView',
			'workspace/:spaceId/:viewName/:childView':'switchToWorkSpaceTask',
			'workspace/:spaceId/:viewName/:childView/:folderId':'switchToWorkSpaceDocument',
			'workspace/:spaceId/:viewName':'switchToWorkSpaceActivity',
			'organization/:orgId/:viewName':'switchToOrganizationView',
			'organization/:orgId/:viewName/:childView':'switchToOrganizationSet',
			'user/:userId/:viewName':'switchToUserView',
            'member/contacts/:childView':'switchToContactsView',
            'settings/:userId/:viewName':'switchToSettingsView',
            'message/:userId/:viewName/:childView':'switchToMessageCenterView',
			'search/:viewName':'switchToSearchView'
		},
        //切换到成员文档
        switchToDocumentView:function(viewName,child,grandChild,path){
            var paths=path.split('/');
            this.switchView({currentView:grandChild,spaceId:paths[0],paths:paths,folderId:paths[1],parentView:viewName,grandChild:grandChild},'member',viewName,child,grandChild);
        },
        //dashboard
        switchToDashboard:function(viewName){
            this.switchView({spaceId:0,parentView:viewName,currentView:viewName},'member',viewName);
        },
        //切换到发现视图
        switchToDiscoveryView:function(viewName,childView,grandChild){
            this.switchView({spaceId:0,parentView:viewName},'member',viewName,childView,grandChild);
        },
        //切换到空间任务视图
        switchToWorkSpaceTask:function(spaceId,viewName,childView) {
            this.switchView({spaceId:Number(spaceId),currentView:viewName},'workSpace',viewName,childView);
        },
        //切换到空间文档
        switchToWorkSpaceDocument:function(spaceId,viewName,childView,folderId){
            this.switchView({parentView:viewName,currentView:childView,spaceId:Number(spaceId),paths:[spaceId,folderId]},'workSpace',viewName,childView);
        },
		//切换到空间最近更新
		switchToWorkSpaceActivity:function(spaceId,viewName) {
			this.switchView({spaceId:Number(spaceId),currentView:viewName,parentView:viewName},'workSpace',viewName);
		},
		//切换到组织视图
		switchToOrganizationView:function(orgId,viewName){
			this.switchView({orgId:Number(orgId)},'organization',viewName);
		},
        //切换到组织设置视图
        switchToOrganizationSet: function (orgId,viewName,childView) {
          this.switchView({orgId:orgId},'organization',viewName,childView);
        },
		//切换到用户视图
		switchToUserView:function(userId,viewName){
			this.switchView({userId:Number(userId),currentView:viewName},'user',viewName);
		},
        //切换到联系人视图
        switchToContactsView: function (childView) {
            this.switchView({currentView:childView},'member','contacts',childView);
        },
		//切换到日历视图
		switchToCalendarView:function(viewName,childView){
			this.switchView({currentView:childView,spaceId:0,parentView:viewName},'member',viewName,childView);
		},
		//切换到按索
		switchToSearchView:function(viewName){
			this.switchView({},viewName);
		},
		switchView:function(){
			var args=[].slice.call(arguments);
			var names=args.slice(1,args.length);
			var len=names.length;
			var prop=args[0];
			var curView=args[2];
			var appView=this.appView.set({currentView:curView});
			var viewArr=[appView];

			for(var i=0;i<len;i+=1){
				var view=viewArr[i];
				if(!view){
					break;
				}
				var sonView=view.getChildViews().activeViewByName(names[i],prop);
				if(sonView){
					viewArr.push(sonView);
					sonView.activeMenu(names[i+1]);
				}
			}
		},
        //切换到系统设置视图
        switchToSettingsView:function(userId,viewName){
            this.switchView({userId:Number(userId)},'settings',viewName);
        },
        //切换到消息中心视图
        switchToMessageCenterView:function(userId,viewName,childView){
            childView=childView||'all';
            this.switchView({userId:Number(userId),currentView:viewName,childView:childView},'message',viewName);
        }
	});

	var appRoute=new AppRouter();
	//启动路由
	PAROX.Backbone.history.start();
	var hash=PAROX.util.getHash();
	//如果没有hash就跳转到dashboard
	if(!hash){
		appRoute.navigate("member/dashboard", {trigger: true,replace:true});
	}

	//检测客户浏览器是否支持HTML5相关功能，如果不支持，就给出提示下载新版浏览器
	if(!browser.supportHTML5()){
		if(browser.version()<8){
			location.replace('http://'+location.host+'/browser.html');
		}else{
			var tpl=$('#browser-warningTpl');
			var browserTpl=tpl.html();
            PAROX.alert(browserTpl);
		}

	}
});