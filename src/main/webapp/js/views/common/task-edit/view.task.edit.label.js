/**
 * fileName:
 * createdBy:William
 * date:2014/9/3
 */
define('viewCommon/task-edit/view.task.edit.label',['parox'],function(require){
	'use strict';
	var PAROX=require('parox');
	var labelItemTpl='<span><%=taskLabel.get("label")%></span>'+
                     '<%if(taskLabel.get("editAble")){%>'+
                     '<span class="m-l-5 cur-p icon-hover" data-behavior="remove-task-label">&times;</span>'+
                     '<%}%>';

	var TaskLabelItemView=PAROX.View.extend({
		tagName:'div',
		className:'tag-block',
		template:PAROX._.template(labelItemTpl),
		events:{
			'click [data-behavior="remove-task-label"]':'onRemoveLabelBtnClick'
		},
		initialize:function(){
			this.listenTo(this.model,{
                remove:this.remove,
                change:this.render
            });
		},
		render:function(){
			this.$el.html(this.template({taskLabel:this.model}));
			return this;
		},
		onRemoveLabelBtnClick:function(e){
			var model=this.model;
			model.collection.remove(model);
			e.stopPropagation();
			e.preventDefault();
		}
	});

	return PAROX.View.extend({
		tagName:'div',

		initialize:function(){
			this.__viewModel=new PAROX.Backbone.Model();
			this.listenTo(this.__viewModel,{
				'change:editAble':function(model,editAble){
					this.toggleEditAble(editAble);
				}
			});
			this.listenTo(this.collection,'reset',this.render);
		},
		render:function(){
			this.empty();
			this.collection.each(this.addOne,this);
			return this.$el;
		},
		addOne:function(model){
			var labelItemView=new TaskLabelItemView({model:model});
			this.$el.append(labelItemView.render().$el);
		},
        toggleEditAble:function(bool){
            this.collection.each(function(model){
                model.set({editAble:bool});
            });
        }
	});
});