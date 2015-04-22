/**
 * fileName:任务详情编辑
 * createdBy:William
 * date:2014/9/1
 */
define('viewCommon/task-edit/view.task.editor',['parox','collection/collections',
    'viewCommon/task-edit/view.task.user.list','viewCommon/task-edit/view.task.edit.label',
    'viewCommon/task-edit/view.create.task.user','viewCommon/task-edit/view.task.check.item','viewCommon/activity/view.activity',
    'viewCommon/task-edit/view.attachment','viewCommon/comment/view.comment'],function(require){
	'use strict';
	var PAROX=require('parox');
    var _=PAROX._;
	var $=PAROX.$;
	var collection=require('collection/collections');

    //任务分配与跟踪者列表视图
    var TaskUserListView=require('viewCommon/task-edit/view.task.user.list');
    //任务标签视图
    var TaskLabelListView=require('viewCommon/task-edit/view.task.edit.label');
    //任务创建人视图
    var TaskCreateUserView=require('viewCommon/task-edit/view.create.task.user');
    //任务检查项视图
    var TaskCheckItemView=require('viewCommon/task-edit/view.task.check.item');
    //任务活动记录视图
    var TaskActivityView=require('viewCommon/activity/view.activity');
	//附件视图
	var AttachmentView=require('viewCommon/task-edit/view.attachment');
    var tpl=$('#task-editorTpl');
    var taskEditorTpl=tpl.html()||'<br>';
        //tpl.remove();
    var CommentView=require('viewCommon/comment/view.comment');

	var TrackerUserList=collection.TaskTrackerList;
	var LabelModel=PAROX.models.TaskLabelModel;

	var TaskLabelList=PAROX.Backbone.Collection.extend({
		model:LabelModel
	});

	var TaskCollaboratorList=collection.TaskAssignList;

	//评论视图
	var EditCommentView=CommentView.extend({
        el:'#task-detail-comment',
        viewName:'taskEditComment',
		show:function(){
			PAROX.View.prototype.show.call(this);
			this.$('[data-behavior="comment-text-area"]').focus();
			return this;
		},
		hide:function(){
			PAROX.View.prototype.hide.call(this);
			return this;
		}
    });

	//提醒视图

	var RemindView=PAROX.View.extend({
		events:{
			'click [data-behavior="command"]':'onCommandBtnClick',
			'submit form':'onFormSubmit',
			'click':'onClick'
		},
		initialize:function(){
			this.__viewModel=new PAROX.Backbone.Model();
			$(window).on('click', _.bind(function(){
				this.hide();
			},this));
		},
		onClick:function(e){
			e.stopPropagation();
		},
		show:function(e){
			this.$el.addClass('open');
			this.onShow();
			e.stopPropagation();
			return this;
		},
		hide:function(){
			this.$el.removeClass('open');
			return this;
		},
		onShow:function(){
			this.$('textarea').focus();
		},
		onFormSubmit:function(e){
			var $this=this.$(e.currentTarget);
			var params=$this.serializeArray();

			params=PAROX.util.convertArrayToObject(params);
			params.taskId=Number(params.taskId);

			var isValid=this.validate(params);
			if(isValid){
				var options={
					url:'/colla/task/taskReminder',
					type:'POST',
					data:params,
					success: _.bind(function(){
						PAROX.message('发送提醒成功！');
						this.hide();
					},this)
				};
				PAROX.ajax(options);
			}

			e.preventDefault();
		},
		validate:function(params){
			if(!params.content){
				PAROX.alert('提醒内容不能为空！');
				return false;
			}
			if(this.$('[data-behavior="remind-person"]').find('input[type="checkbox"]:checked').length===0){
				PAROX.alert('必须选择一种提醒对象!');
				return false;
			}
			if(this.$('[data-behavior="remind-way"]').find('input[type="checkbox"]:checked').length===0){
				PAROX.alert('必须选择一种提醒方式!');
				return false;
			}
			return true;
		}
	});


	var TaskEditView=PAROX.ManageView.extend({
		__viewModel:new PAROX.Backbone.Model({model:null,taskId:undefined}),
		model:new PAROX.models.TaskModel(),
		__requireKey:'taskId',
		viewName:'taskEditor',
		el:'#task-editor',
		isFirst:true,
		events:{
			'click [data-behavior="status-checkbox"]':'onStatusCheckboxClick',

			'keypress input[data-behavior="task-name-editor"]':'onTaskNameEditInputEnter',
			'focusout input[data-behavior="task-name-editor"]':'onTaskNameEditInputFocusOut',

			'keypress [data-behavior="task-desc-edit"]':'onTaskDescEditInputEnter',
			'focusout [data-behavior="task-desc-edit"]':'onTaskDescEditInputFocusOut',
			'change [data-behavior="date-time-picker"]':'onDateTimeChange',

			'keypress input[data-behavior="task-label-input"]':'onLabelInputEnter',
			'focusout input[data-behavior="task-label-input"]':'onLabelInputFocusOut',
			'click [data-behavior="command"]':'onCommandBtnClick'
		},
		template:PAROX._.template(taskEditorTpl),
		initialize:function(){
            //任务创建者视图
            this.taskCreateUserView=new TaskCreateUserView();
            //任务分配者视图
            var taskAssignView=new TaskUserListView({
                viewName:'assign',
                el:'[data-behavior="task-assign"]',
                collection:new TaskCollaboratorList(),
                parent:this,
				onDropDown:function(){
					//this.findChildViewByName('track').toggleDropDown('hide');
				}
            });
            //任务追踪者视图
            var taskTrackView=new TaskUserListView({
                viewName:'track',
                el:'[data-behavior="task-track"]',
                collection:new TrackerUserList(),
                parent:this,
				onDropDown:function(){
					//this.findChildViewByName('assign').toggleDropDown('hide');
				}
            });
            //任务检查项视图
            var taskCheckItemView= new TaskCheckItemView({
                viewName:'checkItem',
                parent:this
            });
            //任务评论视图
            this.taskCommentView=new EditCommentView();

            //任务动态记录视图
            var taskActivityView=new TaskActivityView({
                el:'#task-activity',
                viewName:'taskActivity'
            });

			var attachmentView=new AttachmentView({
				el:'#task-attachment',
				viewName:'taskAttachment',
				parent:this
			});


            //tab页视图
            this.tabViewList=new PAROX.ViewCollection([
                    this.taskCommentView,
                    taskActivityView
                ]);
            var childView=[taskAssignView,taskTrackView,taskCheckItemView,attachmentView];
            this.__childViews=new PAROX.ViewCollection(childView);
            this.taskLabelList=new TaskLabelList();

            this.dateTimePicker=PAROX.dateTimePicker;
            this.width=this.$el.width();


            this.taskContentWrap=this.$('div[data-behavior="task-detail"]');

			this.listenTo(this.__viewModel,{
				'change:model':function(){
					var taskId=this.get('taskId');
					this.taskLabelList.reset();
					this.model.fetch({
						success:PAROX._.bind(this.onFetchSuccess,this),
						error: _.bind(function(){
							this.hide();
						},this)
					});
					this.requestTaskPath();
					this.returnToTaskComment();
				}
			});
            this.taskLabelListView=new TaskLabelListView({collection:this.taskLabelList,parent:this});

			this.listenTo(this.taskLabelList,{
				remove:function(model,labelList){
					this.saveTaskLabel(labelList,PAROX.LANG.TASK_LABEL.DELETE_SUCCESS);
				},
				add:function(label,labelList){
					this.saveTaskLabel(labelList,PAROX.LANG.TASK_LABEL.CREATE_SUCCESS);
				}
			});
			$(window).on('click', _.bind(function(e){
				var target=PAROX.$(e.target);

				if(target.closest('#task-editor').length===0){
					this.hide();
				}
			},this));
		},
		set:function(key,value,option){
			this.model.set(key,value,option);
			return this;
		},
		get:function(key){
			return this.model.get(key);
		},
		requestTaskPath:function(){
			PAROX.ajax({
				url:PAROX.CONFIG.REQUEST_URL.TASK_PATH,
				data:{
					taskId:this.get('taskId')
				},
				success: _.bind(this.renderPath,this)
			});
		},
		renderPath:function(resp){
			if(!resp)return;
			var $li=this.$('[data-behavior="task-path"]').find('li');
			$li.eq(0).html(resp.organization.orgName);
			$li.eq(1).html(resp.workspace.name);
		},
		saveTaskLabel:function(labelList,msg){
			var self=this;
			var list=[];
			labelList.each(function(model){
				list.push(model.get('label'));
			});
			this.model.save({labels:list.join(','),action:'label'},{
				wait:true,
				success:function(){
					self.handleLabel(self.model);
					PAROX.message(msg);
				}
			});
		},
		//设置任务编辑视图的model
		//与任务列表为同一个model实例
		//实现不同视图的联动
		setModel:function(model,silent){
			//设置视图model时，先去掉所有监听，防止事件重复绑定
			this.stopListening(this.model);
			this.model=model;

			this.listenTo(this.model,{
				'change:name':this.updateTaskNameView,
				'change:status': function(){
					this.updateStatusView();
					this.model.toggleEditAble();
				},
				'change:description':this.updateDescriptionView,
				'change:endTime':this.updateEndTimeView,
                'change:priority':this.updatePriorityView,
				'change:editAble':function(){
					this.render().toggleEditAble();
				}
			});
			this.__viewModel.set({model:model,taskId:model.get('taskId')},{silent:silent});
			return this;
		},
		toggleEditAble:function(){
            var isEditAble=this.get('editAble');
			var param={editAble:isEditAble};
            this.__childViews.each(function(view){
				view.set(param);
			});
			//this.taskLabelListView.set(param);
			return this;
		},
		updateTaskNameView:function(){
			this.$('[data-behavior="task-name"]').html(this.model.get('name'));
		},
		updateDescriptionView:function(){
            var desc=this.model.get('description')||'添加描述';
			this.$('[data-command="showDescInput"]').html(desc);
		},
		updateStatusView:function(){
			var checkbox=this.$('[data-behavior="status-checkbox"]');
            var className=this.model.convertStatusToClass();
			var method=this.model.isDone()?'addClass':'removeClass';
            className='label display-in '+className;
			checkbox[method]('active');
            this.$('[data-behavior="status-bar"]').removeClass().addClass(className)
                .html(this.model.getStatusText());
			return this;
		},
        updatePriorityView:function(){
            var className=this.model.convertPriorityToClass();
            var priorityBar=this.$('[data-command="priority"]').find('span');
            priorityBar.eq(0).removeClass('icon-12-mark icon-12-mark-danger')
                .addClass(className);
            priorityBar.eq(1).html(this.model.getPriorityText());
        },
		updateEndTimeView:function(){
			this.$('[data-command="showDateTimePicker"]').html(this.model.getFormatDate());
		},
        showDateTimePicker:function(e){
            if(this.model.isDone())return false;
            var $this=this.$(e.currentTarget);
            this.dateTimePicker.set({
                onChangeDate: _.bind(this.onDateTimeChange,this)
            }).place($this.offset(),$this.outerHeight())
                .show();
        },
		onFetchSuccess:function(model){
			this.__isLoaded=false;
			this.handleLabel(model);
			this.loadChildView();
			this.taskCommentView.set({mainId:this.get('taskId'),spaceId:this.get('spaceId')});
			this.taskCreateUserView.set({userId:model.get('userId')});
			this.render();
		},
		loadChildView:function(){
			this.__childViews.each(function(view){
				view.set({task:this.model});
			},this);
		},
		handleLabel:function(model){
			var labelStr=PAROX.$.trim(model.get('labels'));
			var taskLabelArr=labelStr?labelStr.split(','):[];
			var taskLabelList=[];
			var editAble=this.get('editAble');
			PAROX.$.each(taskLabelArr,function(i){
				taskLabelList.push({
					label:this,
					editAble:editAble
				});
			});

			if(taskLabelList.length>0){
				this.taskLabelListView.collection.reset(taskLabelList);
			}
		},
		render:function(){
			this.taskContentWrap
				.html(this.template({task:this.model}));
			this.handleLabel(this.model);
			this.$('[data-behavior="task-label-list"]')
				.html(this.taskLabelListView.$el);
			this.remindView=new RemindView({
				el:this.$('#remind-view')
			});
            if(this.model.type=='follow'){
                this.$('[data-command="removeTask"]').text('移除');
            }else{
                this.$('[data-command="removeTask"]').text('删除');
            }
			return this;
		},
		show:function(){
			this.$el.stop().animate({
				right:0,
				opacity:1
			},PAROX.CONFIG.SPEED);
			this.$('[data-behavior="comment-text-area"]').val('');
			this.__isDisplay=true;
			return this;
		},
		hide:function(){
			this.$el.stop().animate({
				right:-this.width,
				opacity:0
			},PAROX.CONFIG.SPEED);
            this.onHide();
			this.__isDisplay=false;
			return this;
		},
		toggleDone:function(){
			var model=this.model;
			var taskItem=this.taskItemView;
			var attr={
				status:model.isDone()?1:2,
				action:'status'
			};
			var option={
				wait:true,
				success: function(){
					PAROX.message(PAROX.LANG.TASK.UPDATE_STATUS_SUCCESS);
				}
			};

			if(taskItem){
				var curModel=taskItem.parent.collection.findWhere({taskId:model.get('taskId')});

				var isSameModel=curModel===model;
				if(isSameModel){
					taskItem.toggleDone();
				}else{
					var success=option.success;
					option.success=function(){
						if(!curModel){
							curModel.set(attr);
						}
						success(arguments);
					};
					model.save(attr,option);
				}

			}else{
				model.save(attr,option);
			}
			return this;
		},
		closeLabelInput:function(target,isShowError){
			var input=target;
			var value=input.val();
			var labels=this.taskLabelList.pluck('label');

			if(value && labels.indexOf(value)==-1){
				this.taskLabelList.add({label:value});
			}else{
				if(isShowError){
					this.showError(input);
				}
			}
			input.val('');
		},
		showError:function(target){
			var $message=$('<div class="ver-block verifytip bottom top-right">该标签已存在</div>');
			target.after($message).parent().addClass('has-error');
			setTimeout(function(){
				target.parent().removeClass('has-error');
				$message.remove();
			},1000);
		},
		onLabelInputEnter:function(e){
			if(e.which===13){
				this.closeLabelInput(this.$(e.currentTarget),true);
			}
		},
		onLabelInputFocusOut:function(e){
			this.closeLabelInput(this.$(e.currentTarget).hide());
		},
		showLabelInput:function(e){
			this.$(e.currentTarget).siblings().show().focus();
		},
		onStatusCheckboxClick:function(e){
			this.toggleDone();
			//e.preventDefault();
		},
		//任务名编辑按钮点击时
		showNameInput:function(e){
            if(this.model.isDone())return false;
			var $this=this.$(e.currentTarget);
			$this.parent().hide().siblings('input')
				.val(this.model.get('name'))
				.show().focus().select();
		},
		//任务名双击时
		onTaskNameDblClick:function(e){
			this.$(e.currentTarget).parent().hide()
				.siblings('input').val(this.model.get('name'))
				.show().focus().select();
		},
		//任务名称输入框回车时执行
		onTaskNameEditInputEnter:function(e){
			if(e.which===13){
				if(PAROX.util.browser.chrome()){
					this.$(e.currentTarget).hide();
				}else{
					this.hideTaskNameEditInput();
				}
			}
		},
		hideTaskNameEditInput:function(){
			var input=this.$('input[data-behavior="task-name-editor"]');
			var value=input.val();
			if(!value){
				_.delay(function(){
					PAROX.alert('任务名不能为空！');
				},200);
                input.hide().siblings('div').show();
			}else{
				if(value!==this.model.get('name')){
                    var msg=this.model.validate({'name':value});
                    if(msg){
                        PAROX.alert(msg);
                    }else{
                        this.model.save({name:value},{
                            wait:true,
                            validate:false,
                            success:function(){
                                PAROX.message(PAROX.LANG.TASK.UPDATE_TASK_NAME_SUCCESS);
                            }
                        });
                        input.hide().siblings('div').show();
                    }

				}
			}

		},
		//任务名输入框失去焦点时
		onTaskNameEditInputFocusOut:function(){
			this.hideTaskNameEditInput();
		},
		//任务描述点击时进行编辑状态
		showDescInput:function(e){
            if(this.model.isDone())return false;
			this.$(e.currentTarget).hide()
				.siblings('textarea').val(this.model.get('description'))
				.show().focus().select();
		},
		//任务编辑回车时提交
		onTaskDescEditInputEnter:function(e){
			if(e.which===13){
				if(PAROX.util.browser.chrome()){
					this.$(e.currentTarget).hide();
				}else{
					this.hideTaskNameEditInput();
				}
			}
		},
		//任务描述编辑失去焦点时提交
		onTaskDescEditInputFocusOut:function(){
			this.hideTaskDescEditInput();
		},
		hideTaskDescEditInput:function(){
			var input=this.$('[data-behavior="task-desc-edit"]');
			var value=input.val();
			if(value!==this.model.get('description')){
                var msg=this.model.validate({'description':value});
                if(msg){
                    PAROX.alert(msg);
                }else{
                    this.model.save({description:value},{
                        wait:true,
                        validate:false,
                        success:function(){
                            PAROX.message(PAROX.LANG.TASK.UPDATE_DESC_SUCCESS);
                        }
                    });
                    input.hide().siblings().show();
                }


			}

		},
		removeTask:function(){
			var self=this;
            var content=PAROX.LANG.TASK.DELETE_CONFIRM;
            var message=PAROX.LANG.TASK.DELETE_SUCCESS;
            var confirmText='确认删除';
            if(this.model.type=='follow'){
                content=PAROX.LANG.TASK.REMOVE_CONFIRM;
                message=PAROX.LANG.TASK.REMOVE_SUCCESS;
                confirmText='确认移除';
            }
			var text=content.replace('{taskName}',this.model.get('name'));

			PAROX.confirm({
                content:text,
                confirmText:confirmText,
                onConfirm:PAROX._.bind(function(){
                    if(this.model.type=='follow'){
                        this.model.isRemoveByFollow=false;
                        this.destroyByFollower(self,this.model.get('taskId'));

                    }else{
                        this.model.destroy({
                            wait:true,
                            success:function(){
                                self.hide();
                                PAROX.message(message);
                            }
                        });
                    }


                },this)
            });
		},
        destroyByFollower:function(self,id){
            var model=self.model;
            PAROX.ajax({
                url:'colla/task/removeFollow',
                type:'GET',
                data:{
                    taskId:Number(id)
                },
                success:function(){
                    self.hide();
                    model.collection.remove(model);
                    PAROX.message(PAROX.LANG.TASK.DELETE_SUCCESS);
                }
            });
        },
		//日期改变时，保存
		onDateTimeChange:function(e){
			var date= e.date;
			this.model.save({
                action:'endTime',
				endTime: date.getTime()-1000*60*60*8
				},
				{
					wait:true,
					success:function(){
						PAROX.message(PAROX.LANG.TASK.UPDATE_END_TIME_SUCCESS);
					}
			});
		},
		toggleView:function(e){
			var $this=this.$(e.currentTarget);
			var view=$this.data('view');
			var taskId=this.get('taskId');
			this.tabViewList.activeViewByName(view,{
                taskId:taskId,
                mainId:taskId,
                spaceId:this.get('spaceId'),
                changeTaskBody:this.changeTaskBody,
                parent:this
            });
			//this.$('#task-wrapper').hide();
			$this.addClass('active').siblings().removeClass('active');
		},
        onHide:function(){
            this.model.set({active:false});
			this.setModel(new PAROX.models.TaskModel(),true);
			this.taskItemView=null;
			this.returnToTaskDetailView();
        },
        priority:function(){
            if(this.model.isDone()){return false;}
            var priority=Number(this.model.get('priority'));
            this.model.save({priority:priority===1?0:1},{
                wait:true,
                success:function(){
                    PAROX.message(PAROX.LANG.TASK.UPDATE_PRIORITY_SUCCESS);
                }
            });
        },
		returnToTaskDetailView:function(){
            this.$('#task-wrapper').show();
            this.tabViewList.each(function(view){
                view.hide();
            });
		},
        returnToTaskComment:function(){
            this.tabViewList.each(function(view){
                 if(view.viewName=='taskEditComment'){
                    view.show();
                 }else{
                    view.hide();
                 }
             });
             this.$('[data-behavior="comment-activity"]').find('[data-view="taskEditComment"]').addClass('active')
             .siblings().removeClass('active');
        }
	});


	return new TaskEditView();
});