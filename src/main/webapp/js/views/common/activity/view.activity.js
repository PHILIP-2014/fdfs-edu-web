/**
 * fileName:活动记录视图
 * createdBy:William
 * date:2014/9/13
 */
define('viewCommon/activity/view.activity',['parox','collection/collections'],function(require){
	'use strict';
	var PAROX=require('parox');
	var collection=require('collection/collections');
	var TaskActivityList=collection.TaskActivityList;
    var tpl='<%activityList.each(function(model){%>' +
            '<li><div class="media">' +
                '<a href="#" class="pull-left"><img src="<%=model.getActivityPhoto()%>" class="img-30X30 media-object bdr-5" ></a>' +
                '<div class="media-body">' +
                    '<div>' +
                        '<a href="#" class="text-primary"><%=model.get(\'realName\')%></a>' +
                        '<span><%=model.getActText(\'task\')%></span>' +
                    '</div>' +
                    '<div class="text-info"><%=model.get(\'displayTime\')%></div>' +
                '</div>' +
            '</div></li><%})%>';


	return PAROX.View.extend({
		__requireKey:'taskId',
		template:PAROX._.template(tpl),
		initialize:function(option){
            this.__viewModel=new PAROX.Backbone.Model();
            this.listWrap=this.$('[data-behavior="task-activity-list"]');
            var collection=this.collection=new TaskActivityList();
            this.listenTo(this.__viewModel,{
                'change:taskId':function(model){
                   this.fetch(model);
                    model.set({changeTaskBody:false});
                    model.get('parent').changeTaskBody=false;
                },
                'change:changeTaskBody':function(model){
                    if(model.get('changeTaskBody')){
                        this.fetch(model);
                        model.set({changeTaskBody:false});
                        model.get('parent').changeTaskBody=false;
                    }

                }
            });

            this.listenTo(collection,'reset',this.render);
        },
        fetch:function(model){
            PAROX.ajax({
                url:PAROX.CONFIG.REQUEST_URL.TASK_ACTIVITY_LIST,
                data:{
                    taskId:model.get('taskId')
                },
                success:PAROX._.bind(this.requestSuccess,this)
            });
        },
		requestSuccess:function(res){
			this.collection.reset([res].concat(res.subList||[]));
		},
		render:function(){
            this.$el.addClass('in');
            this.listWrap.html(this.template({activityList:this.collection}));
		}
	});
});