/**
 * fileName:
 * createdBy:William
 * date:2014/9/4
 */
define('viewCommon/task-edit/view.create.task.user',['parox'],function(require){
	'use strict';
	var PAROX=require('parox');
	var userTpl='<div class="creater-block">' +
                    '<img src="<%=user.getPhoto()%>" class="img-30X30 bdr-3" >' +
                    '<span class="m-l-5 m-r-5"><%=user.get("realName")%></span>' +
                '</div>';

	return PAROX.View.extend({
		__viewModel:new PAROX.models.UserModel(),
		__requireKey:'userId',
		el:'#create-task-user',
		template:PAROX._.template(userTpl),
		viewName:'taskCreateUser',
		initialize:function(option){
			this.listenTo(this.__viewModel,{
				'change:userId':function(model,userId) {
                    if(userId===PAROX.__USER.get('userId')){
                        this.__viewModel.set(PAROX.__USER.toJSON());
                        this.render();
                    }else{
                        this.__viewModel.fetch();
                    }
				},
				'sync':this.render
			});

			this.listenTo(PAROX.__USER,{
				'change:bigPhoto':function(){
					var userId=this.get('userId');
					if(!userId){return;}
					this.__viewModel.trigger('change:userId',this.__viewModel,userId);
				}
			});
		},
		render:function(){
			this.$el.html(this.template({user:this.__viewModel}));
		}
	});
});