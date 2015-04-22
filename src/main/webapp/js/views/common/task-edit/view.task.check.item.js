/**
 * fileName:任务检查项视图
 * createdBy:William
 * date:2014/9/4
 */
define('viewCommon/task-edit/view.task.check.item',['parox','collection/collections'],function(require){
	'use strict';
	var PAROX=require('parox');
	var _=PAROX._;
	var collection=require('collection/collections');
	var TaskCheckItemList=collection.TaskCheckItemList;
	var itemTpl='<%var editAble=checkItem.get(\'editAble\')%>' +
                '<div class="pull-left">' +
                    '<input type="checkbox" <%=checkItem.get(\'isFinished\')?\'checked\':\'\'%> <%=editAble?\'\':\'disabled\'%>>' +
                '</div>' +
                '<div class="m-l-20">' +
                    '<span data-behavior="check-item-name"><%=checkItem.get(\'title\')%></span>' +
                    '<input type="text" class="form-control hid" data-behavior="edit-check-item">' +
                    '<%if(editAble){%>' +
                        '<span class="m-l-5 cur-p icon-hover" data-behavior="remove-task-check-item">&times;</span>' +
                    '<%}%>' +
                '</div>';

	var TaskCheckItemView=PAROX.View.extend({
		tagName:'li',
		className:'clearfix m-b-5',
		template: _.template(itemTpl),
		events:{
			'click input[type="checkbox"]':'onCheckBoxClick',
			'click [data-behavior="remove-task-check-item"]':'onRemoveBtnClick',
			'click [data-behavior="check-item-name"]':'onCheckItemNameClick',
			'focusout [data-behavior="edit-check-item"]':'onEditCheckItemInputFocusOut',
			'keypress [data-behavior="edit-check-item"]':'onEditCheckItemInputEnter'
		},
		initialize:function(){
			this.listenTo(this.model, {
                destroy: this.remove,
                change: this.render
            });
		},
		render:function(){
			this.$el.html(this.template({checkItem:this.model}));
			return this;
		},
		onCheckBoxClick:function(e){
			this.toggleDone();
			e.preventDefault();
		},
		toggleDone:function(){
			var model=this.model;
			var self=this;
			model.save({isFinished:!model.get('isFinished')},{
				wait:true,
				success:function(){
					PAROX.message(PAROX.LANG.CHECK_ITEM.UPDATE_STATUS_SUCCESS);
				},
				error:function(){
					self.render();
				}
			});
		},
		onRemoveBtnClick:function(){
			var model=this.model;
			var text=PAROX.LANG.CHECK_ITEM.DELETE_CONFIRM.replace('{title}',model.get('title'));
			PAROX.confirm(text,function(){
				model.destroy({
					wait:true,
					success:function(){
						PAROX.message(PAROX.LANG.CHECK_ITEM.DELETE_SUCCESS);
					}
				});
			});
		},
		onCheckItemNameClick:function(e){
            if(!this.model.get('editAble'))return false;
			this.$(e.currentTarget).hide()
				.siblings('input')
				.show()
				.val(this.model.get('title'))
				.focus()
				.select();
		},
		onEditCheckItemInputFocusOut:function(e){
			this.hideEditCheckItemInput(e);
		},
		onEditCheckItemInputEnter:function(e){
			if(e.which===13){
				if(PAROX.util.browser.chrome()){
					this.$(e.currentTarget).hide();
				}else{
					this.hideEditCheckItemInput(e);
				}
			}
		},
		hideEditCheckItemInput:function(e){
			var input=this.$(e.currentTarget);
			var value=PAROX.$.trim(input.val());
			if(value===''){
				this.model.destroy();
			}else{
				if(value!==this.model.get('title')){
					this.model.save({title:value},{
						wait:true,
						success:function(){
							PAROX.message(PAROX.LANG.CHECK_ITEM.UPDATE_TITLE_SUCCESS);
						}
					});
				}
			}
			input.hide().siblings('[data-behavior="check-item-name"]').show();
		}
	});

	return PAROX.View.extend({
		__viewModel:new PAROX.Backbone.Model({taskId:undefined,progress:undefined}),
		__requireKey:'taskId',
		collection:new TaskCheckItemList(),
		el:'#task-check-item',
		initialize:function(option){
			var self=this;
			this.taskCheckItemListWrapper=this.$('ul[data-behavior="check-item-list"]');
			this.progressBar=this.$('[data-behavior="progress-bar"]');

			this.collection.parse=function(resp){
				_.each(resp,function(item){
					item.editAble=self.get('editAble');
				});
				return resp;
			};

			this.listenTo(this.__viewModel,{
				'change:task':function(model,task){
					var taskId=task.get('taskId');
					this.clearItemList()
						.set({taskId:taskId,editAble:task.get('editAble')})
						.fetch(taskId);
				},
				'change:progress':this.updateProgressView,
				'change:editAble':this.toggleEditAble
			});

			this.listenTo(this.collection,{
				reset:function() {
					this.setProgress().render();
				},
				'change:isFinished':this.setProgress,
				destroy:this.setProgress,
				add:function(model){
					model.set({editAble:this.get('editAble')});
					this.addOneCheckItem(model);
				}
			});
		},
		fetch:function(taskId){
			this.collection.fetch({
				data:{
					taskId:	taskId
				},
				remove:true,
				reset:true
			});
			return this;
		},
		calculateCheckItemProgress:function(){
			var coll=this.collection;
			var total=coll.length;
			var done=coll.where({isFinished:true}).length;
			return total?done/total:0;
		},
		setProgress:function(){
			var progress=this.calculateCheckItemProgress();
			this.set({progress:progress});
			return this;
		},
		updateProgressView:function(){
			var progress=(this.get('progress')*100).toFixed(2);
			this.progressBar.width(progress+'%').attr('aria-valuenow',progress);
			this.progressBar.find('span').html(progress+'%');
		},
		clearItemList:function(){
			this.taskCheckItemListWrapper.empty();
			return this;
		},
		render:function(){
			this.collection.each(this.addOneCheckItem,this);
			return this;
		},
		addOneCheckItem:function(model){
			var checkItemView=new TaskCheckItemView({model:model,parent:this});
			this.taskCheckItemListWrapper
				.append(checkItemView.render().$el);
		},
		onCreateCheckItemBtnClick:function(e){
			this.$(e.currentTarget).siblings('input').show().focus();
		},
		onCheckItemInputEnter:function(e){
			if(e.which===13){
                var input=this.$(e.currentTarget);
                this.createCheckItem(input.val());
                input.val('');
			}
		},
		onCheckItemInputFocusOut:function(e){
            var input=this.$(e.currentTarget);
			this.createCheckItem(input.val());
            input.val('').hide();
		},
		createCheckItem:function(value){
			if(value){
				this.collection.create({title:value,taskId:this.get('taskId')},{
					wait:true,
					success:function(){
						PAROX.message(PAROX.LANG.CHECK_ITEM.CREATE_SUCCESS);
					}
				});
			}
		},
        toggleEditAble:function(){
			var editAble=this.get('editAble');
            var method=editAble?'show':'hide';
            this.collection.each(function(model){
                model.set('editAble',editAble);
            });
            this.$('[data-behavior="create-check-item"]')[method]();
        },
		events:{
			'click [data-behavior="create-check-item"]':'onCreateCheckItemBtnClick',
			'keypress [data-behavior="check-item-input"]':'onCheckItemInputEnter',
			'focusout [data-behavior="check-item-input"]':'onCheckItemInputFocusOut'
		}
	});

});