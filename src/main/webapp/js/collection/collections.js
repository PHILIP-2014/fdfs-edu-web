/**
 * fileName:所有集合
 * createdBy:William
 * date:2014/8/27
 */
define('collection/collections',['parox','component/dialog','component/loading'],function(require){
	'use strict';
	var PAROX=require('parox');
	var $=PAROX.$;
	var _=PAROX._;
	var CONFIG=PAROX.CONFIG;
	var models=PAROX.models;
	var REQ_URL=PAROX.CONFIG.REQUEST_URL;
	var Backbone=PAROX.Backbone;
	var Model=Backbone.Model;
	var loadingBar=require('component/loading');

	var Collection= Backbone.Collection.extend({
		sync:function(method,collection,options){
			var self=this;
			var error=options.error;
			var beforeSend=options.beforeSend;
			var complete=options.complete;
			var args=arguments;
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

					PAROX.alert({content:errorText,onConfirm:onConfirm});
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
		Collection:Collection,
		//定义组织集合
		OrgList:Collection.extend({
			url:REQ_URL.ORG_LIST,//获取集合的请求地址
			model:models.OrgModel,//填充集合的模型,
			comparator:'orgId'
		}),
		//空间集合
		SpaceList:Collection.extend({
			url:REQ_URL.SPACE_LIST,
			model:models.SpaceModel
		}),
		//任务集合
		TaskList:Collection.extend({
			url:REQ_URL.TASK_LIST,
			model:models.TaskModel
		}),
        //我的联系人集合
        ContactsList:Collection.extend({
            url:REQ_URL.CONTACTS_PAGE_LIST,
            model:models.ContactsModel
        }),
		//任务标签集合
		TaskLabelList:Collection.extend({
			url:REQ_URL.TASK_LABEL_LIST,
			model:models.TaskLabelModel
		}),
		//任务检查项集合
		TaskCheckItemList:Collection.extend({
			url:REQ_URL.TASK_CHECK_ITEM_LIST,
			model:models.TaskCheckItemModel
		}),
		//评论集合
		CommentList:Collection.extend({
			url:REQ_URL.COMMENT_LIST,
			model:models.CommentModel
/*			comparator:function(model1,model2){
				return model1.get('releaseTime')>model2.get('releaseTime');
			}*/
		}),
		//任务追踪用户集合
		TaskTrackerList:Collection.extend({
			url:REQ_URL.TASK_TRACKER_LIST,
			model:models.TaskTrackerModel
		}),
		//任务分配用户集合
		TaskAssignList:Collection.extend({
			url:REQ_URL.TASK_ASSIGN_LIST,
			model:models.TaskAssignModel
		}),
		//文档活动记录集合
		DocActivityList:Collection.extend({
			url:REQ_URL.DOC_ACTIVITY_LIST,
			model:models.ActivityModel
		}),
		//任务动态集合
		TaskActivityList:Collection.extend({
			url:REQ_URL.TASK_ACTIVITY_LIST,
			model:models.ActivityModel,
			comparator:function(model1,model2){
				return model1.get('actTime')<model2.get('actTime');
			}
		}),
        //用户集合
        UserList:Collection.extend({
            url:REQ_URL.USER,
            model:models.UserModel
        }),
		//文档集合
		DocumentList:Collection.extend({
			url:REQ_URL.DOCUMENT_LIST,
			model:models.DocumentModel
		}),
		//文件夹集合
		FolderList:Collection.extend({
			model:models.FolderModel
		}),
		//搜索结果集合
		SearchResultList:Collection.extend({
			url:REQ_URL.SEARCH_RESULT_LIST,
			model:models.SearchModel,
			parse:function(resp){
				try{
					this.realLength=resp.page.totalCount;
				}catch (ex){
					this.realLength=0;
				}
				var SearchModel=models.SearchModel;
				var doc={type:'doc',list:new Collection()},
					task={type:'task',list:new Collection()},
					calendar={type:'agenda',list:new Collection()},
					space={type:'space',list:new Collection()},
					contact={type:'contact',list:new Collection()};

				_.each(resp.page.list,function(obj,index){
					if(index>=10){
						return false;
					}
					var type=obj.type;
					var model=new SearchModel(obj);
					switch (type){
						case 'space':
							space.list.add(model);
							break;
						case 'contact':
							contact.list.add(model);
							break;
						case 'task':
							task.list.add(model);
							break;
						case 'agenda':
							calendar.list.add(model);
							break;
						case 'doc':
							doc.list.add(model);
					}

				},this);

				return [doc,task,calendar,space,contact];
			}
		}),
        //日程集合
		ScheduleList:Collection.extend({
			url:REQ_URL.SCHEDULE_LIST,
			model:models.ScheduleModel,
			comparator:'milli'
		}),
        //活动记录
        ActivityList:Collection.extend({
            url:REQ_URL.ACTIVITY_LIST,
            model:models.ActivityModel
        }),
        //消息中心
        MessageList:Collection.extend({
            url:REQ_URL.MESSAGE_LIST,
            model:models.MessageModel
        }),
        //组织下的空间信息
        SpaceOfOrgList:Collection.extend({
            url:REQ_URL.SPACE_ORG_LIST,
            model:models.SpaceModel,
            parse:function(resp){
                _.each(resp,function(item){
                    _.extend(item,item.space);
                });
                return resp;
            }
        }),
        //组织下的成员信息
        MemberList:Collection.extend({
            url:REQ_URL.MEMBER_LIST,
            model:models.MemberModel
        }),
		CollaboratorList:Collection.extend({
			url:REQ_URL.COLLABORATOR_LIST,
			model:models.UserModel
		}),
        WorkSpaceUserList:Collection.extend({
            url:REQ_URL.WORKSPACE_USER_LIST,
            model:models.WorkSpaceUserModel
        }),
        MenuList:Collection.extend({
            remove: function(models, options) {
                var singular = !_.isArray(models);
                var isModel;
                if(singular){
                    isModel=models instanceof Model;
                }else{
                    isModel=models[0] instanceof Model;
                }

                if(isModel){
                    models = singular ? [models] : _.clone(models);
                }else{
                    if(singular){
                        models=[this.findWhere(models)];
                    }else{
                        var modelArr=[];
                        _.each(models,function(item){
                            modelArr.push(this.findWhere(item));
                        },this);
                        models=modelArr;
                    }
                }

                options || (options = {});
                var i, l, index, model;
                for (i = 0, l = models.length; i < l; i++) {
                    model = models[i] = this.get(models[i]);
                    if (!model) continue;
                    delete this._byId[model.id];
                    delete this._byId[model.cid];
                    index = this.indexOf(model);
                    this.models.splice(index, 1);
                    this.length--;
                    if (!options.silent) {
                        options.index = index;
                        model.trigger('remove', model, this, options);
                    }
                    this._removeReference(model, options);
                }
                return singular ? models[0] : models;
            }
        }),
        DistributionList:Collection.extend({
            url:REQ_URL.DISTRIBUTION_LIST,
            model:models.SpaceModel
        }),
		VersionList:Collection.extend({
			url:'/core/document/preview/fileVersion.htm',
			model:models.DocVersionModel
		}),
        MyActivityList:Collection.extend({
            url:'/colla/activity/getMyActivity',
            model:models.ActivityModel
        }),
        CollaActivityList:Collection.extend({
            url:'/colla/activity/getUserActivity',
            model:models.ActivityModel
        }),
        userSpaceList:Collection.extend({
            url:'/common/userSpace'
        }),
        OrgInnerList:Collection.extend({
            url:'/common/orgInnerList',
            model:models.OrgModel,//填充集合的模型,
            comparator:'orgId'
        }),
        TaskGroupByOrg:Collection.extend({
            url:'/colla/task/groupByOrg',
            model:models.TaskModel,
            comparator:'orgId'
        }),
        TaskGroupBySpace:Collection.extend({
            url:'/colla/task/groupBySpace',
            model:models.TaskModel,
            comparator:'spaceId'
        }),
        TaskGroupByTime:Collection.extend({
            url:'/colla/task/groupByTime',
            model:models.TaskModel,
            comparator:'endTime'
        }),
        TaskGroupByColla:Collection.extend({
            url:'/colla/task/groupByColla',
            model:models.TaskModel,
            comparator:'colla'
        }),
        TaskOfToday:Collection.extend({
            url:REQ_URL.MY_TASK_TODAY,
            model:models.TaskModel,
            comparator:'start'
        }),
        DocumentColla:Collection.extend({
            url:REQ_URL.DOCUMENT_COLLA,
            model:models.SharedUserModel
        }),
        FilteredActivityList:Collection.extend({
            url:REQ_URL.FILTERED_ACTIVITY_LIST,
            model:models.ActivityModel
        }),
        LabelList:Collection.extend({
            url:'/core/tag/task'
        }),
        //组织通讯集合
        OrgContactList:Collection.extend({
            url:REQ_URL.ORG_CONTACT_LIST,
            model:models.ContactsModel
        })
	};
});