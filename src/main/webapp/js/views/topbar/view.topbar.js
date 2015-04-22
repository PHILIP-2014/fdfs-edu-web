/**
 * fileName:顶部导航
 * createdBy:William
 * date:2014/8/21
 */
define('viewTopBar/view.topbar',['parox','viewLeftMenu/view.left.menu','viewCommon/view.create.space',
    'viewCommon/view.create.org','viewMessage/view.message','viewTopBar/view.search'],function(require){
	'use strict';
	var PAROX=require('parox');
    var _=PAROX._;
    var $=PAROX.$;
	//左侧弹出菜单
	var leftMenuView=require('viewLeftMenu/view.left.menu');
	//创建空间的弹窗
    var SpaceCreateView= require('viewCommon/view.create.space');
    //创建组织
    var orgCreateWindow=require('viewCommon/view.create.org');
    var noticeCenter=require('viewMessage/view.message');
	//搜索视图
	var SearchView=require('viewTopBar/view.search');
    var tpl=$('#message-barTpl');
    var msgTpl=tpl.html()||'<br>';
        //tpl.remove();
    var userInfoTpl='<img src="<%=model.getPhoto()%>" class="img-40X40 m-r-10"  >'+
                    '<span class="f-s-12 v-a-m"><%=model.get("realName")%></span>'+
                    '<span class="icon-12 icon-12-open-account m-l-20 m-r-10 v-a-tb"></span>';

    var userEditTpl='<a href="#user/<%=model.get(\'userId\')%>/user-introduction" >' +
                    '<span class="icon-12 icon-12-edit m-r-15"></span>完善个人信息</a>';
    var settingTpl='<a href="#settings/<%=model.get(\'userId\')%>/accountSetting">' +
        '<span class="icon-12 icon-12-set m-r-15"></span>账户设置</a>';
    var collection=require('collection/collections');
    var guide=require('baby-guide');
	var TopBarView=PAROX.View.extend({
		__viewModel:new PAROX.Backbone.Model({
            notice:{}
        }),
		__requireKey:'userId',
		model:new PAROX.models.UserModel(),
		el:'#top-bar',
		template: _.template(userInfoTpl),
        __template: _.template(userEditTpl),
        mould: _.template(settingTpl),
        messageTemplate: _.template(msgTpl),
		events:{
            'click [data-behavior="command"]':'onCommandBtnClick'
		},
        orgInnerList:new collection.OrgInnerList(),
		initialize:function(){
			var vModel=this.__viewModel;
            this.viewName='topBar';
            this.model=PAROX.__USER;
			this.searchView=new SearchView();
            this.leftMenuView=leftMenuView;
            this.spaceCreateView=new SpaceCreateView();
            this.orgCreateView=orgCreateWindow;
			//监听用户ID改变
			this.listenTo(vModel,{
                'change:userId':function(model,userId){
                    this.leftMenuView.set('userId',userId);
                    this.model.fetch();
                },
                'change:notice':this.renderNotice
            });

            this.listenTo(this.model,{
                'sync':this.renderUserInfo,
                'change:bigPhoto':this.updateUserPhoto
            });

            PAROX.on('change:notice',function(model,notice){
                this.set('notice',notice);
            },this);

		},
        activeNavItem:function(viewName){
            this.$('li[data-behavior="'+viewName+'"]').addClass('active')
                .siblings().removeClass('active');
        },
        deActiveNavItem:function(){
            this.$('ul[data-behavior="nav-item-wrap"]').find('li')
                .removeClass('active');
        },
		//渲染用户功能菜单，如用户资料，用户设置等
		renderUserInfo:function(){
            this.$('[data-behavior="user-info"]')
                .html(this.template({model:this.model}));
            this.$('[data-behavior="user-edit-interface"]')
                .html(this.__template({model:this.model}));
            this.$('[data-behavior="settings-account"]')
                .html(this.mould({model:this.model}));
            this.$('#message-bar').html(this.messageTemplate({model:this.model}));
            guide.judgeStart(this.model.get('guideFlag'),this.leftMenuView);
		},
        updateUserPhoto:function(model,photoUrl){
            if(photoUrl){
                this.$('[data-behavior="user-info"]').find('img').attr('src',photoUrl+'?1981914');
            }

        },
        prevNoticeNumber:function(){
            var prevNotice=this.__viewModel._previousAttributes.notice;
            var total=0;
            prevNotice= _.isString(prevNotice)? $.parseJSON(prevNotice):prevNotice;
            if(!_.isEmpty(prevNotice)){
                _.each(prevNotice['noticeCats'],function(notice){
                    total+=notice['noticeNum'];
                });
            }
            return total;
        },
		//渲染通知视图
		renderNotice:function(){
            var notice=this.get('notice');
            notice= _.isString(notice)? $.parseJSON(notice):notice;
            var prevNum=this.prevNoticeNumber();
            var isEmpty=!_.isEmpty(notice);
            var total=0;

            this.toggleNotification(isEmpty);

			if(isEmpty){
                _.each(notice['noticeCats'],function(item){
                    var number=item['noticeNum'];
                    total+=number;
                    switch (item['catId']){
                        case 1://任务
                            this.$('[data-behavior="task-number"]').html(number);
                            break;
                        case 2://文档
                            this.$('[data-behavior="file-number"]').html(number);
                            break;
                        case 3://邀请，申请加
                            this.$('[data-behavior="invite-number"]').html(number);
                            break;
                        case 4://@
                            this.$('[data-behavior="mention-number"]').html(number);
                    }
                },this);
                if(total>prevNum){
                    if(PAROX.CONFIG.NOTIFY_CONFIG.desktopNotify.sys){
                        this.showSystemNotice(notice);
                    }
                    if(PAROX.USER_PROFILE.soundNotify){
                        PAROX.ringTone.play();
                    }
                }
            }else{
                this.resetNoticeCount();
            }
		},
        resetNoticeCount:function(){
            var number=0;
            this.$('[data-behavior="task-number"]').html(number);
            this.$('[data-behavior="file-number"]').html(number);
            this.$('[data-behavior="invite-number"]').html(number);
            this.$('[data-behavior="mention-number"]').html(number);
        },
        showSystemNotice:function(notice){
            PAROX.notification.show({
                title:'来自派乐工作协同平台通知',
                notice:'你收到新的消息,点击此处去消中心查看。',
                icon:'images/images1.6/parox-notice.png',
                onClick:function(){
                    window.location.hash='message/'+PAROX.USER_ID+'/unReadMessage/all';
                    noticeCenter.set({notice:notice});
                }
            });
        },
        toggleNotification:function(hasNotice){
            if(hasNotice){
                this.$('[ data-behavior="new-message"]').addClass('icon-16-notice-on').removeClass('icon-16-notice');
            }else{
                this.$('[ data-behavior="new-message"]').addClass('icon-16-notice').removeClass('icon-16-notice-on');
            }

        },
		createSpace:function(e){
            /*this.orgInnerList.fetch({
                success:PAROX._.bind(function(data){
                    if(data.length>0){
                        this.spaceCreateView.show();
                    }else{
                        PAROX.alert('您不是目前所在的组织的内部人员，无权限添加空间，请联系管理员，或者新建一个组织');
                    }

                },this)
            });*/
            this.spaceCreateView.show();
		},
        createOrg:function(){
            this.orgCreateView.show();
        },
		showLeftMenu:function(e){
            var method=this.leftMenuView.isDisplay()?'hide':'show';
            this.leftMenuView[method]();
            e.stopPropagation();
		}
	});

	return new TopBarView();
});
