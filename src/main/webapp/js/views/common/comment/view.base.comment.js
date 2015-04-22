/**
 * fileName:
 * createdBy:William
 * date:2014/9/2
 */
define('viewCommon/comment/view.base.comment',['parox','collection/collections','viewCommon/mention'],function(require){
	'use strict';
	var PAROX=require('parox');
	var _=PAROX._;
	var $=PAROX.$;
	var util=PAROX.util;
	var collection=require('collection/collections');
	var CommentList=collection.CommentList;
	//var commentListTpl=require('tplCommon/comment.list.tpl');
	var Mention=require('viewCommon/mention');
    var commentListTpl='<%commentList.each(function(comment){%>' +
                        '<li class="bd-t-e6 my"><div class="media">' +
                                '<a href="#" class="pull-left marg-10-r">' +
                                    '<img src="<%=comment.get(\'user\').userPhoto%>" class="img-30X30 bd-radius-3">' +
                                '</a>' +
                                '<div class="media-body">' +
                                    '<div class="font13 marg-5-b">' +
                                        '<a href="#"><%=comment.get(\'user\').userName%></a>' +
                                        '<span class="text-gray-99"><%=comment.get(\'createTime\')%></span>' +
                                    '</div>' +
                                    '<div class="font12"><%=comment.get(\'content\')%></div>' +
                                    '<div class="text-right font12">' +
                                        '<a href="#" class="padd-10-r bd-r-99">删除</a>' +
                                        '<a href="#" class="padd-10-l">回复</a>' +
                                    '</div>' +
                                '</div>' +
                                '<!--二级评论-->' +
                                '<div class="media">' +
                                    '<ul data-behavior="child-comment">' +
                                    '</ul>' +
                                '</div>' +
                        '</div></li><%})%>';
	return PAROX.ManageView.extend({
		__requireKey:'taskId',
		viewName:'comment',
		template:PAROX._.template(commentListTpl),
		initialize:function(option){
			this.__viewModel=new PAROX.Backbone.Model({
				ctype:1
			});
			this.originCollection=new CommentList();
			this.collection=new CommentList();
			this.commentList=this.$('ul[data-behavior="comment-list"]');

			this.listenTo(this.__viewModel,{
				'change:mainId':this.fetch,
				'change:spaceId':function(model,spaceId){
					this.mention.set({spaceId:spaceId});
				}
			});
			this.mentions=new PAROX.Backbone.Collection();
			this.isReady=false;
			this.listenToCollection();

			this.mention=new Mention({
				spaceId:this.spaceId,
				el:this.$('[data-behavior="comment-text-area"]'),
				selectChange: _.bind(function(user){
					this.mentions.add(user);
				},this)
			});

		},
		fetch:function(){
			var ctype=this.get('ctype');
			this.collection.fetch({
				reset:true,
				remove:true,
				data:{
					ctype:ctype,
					mainId:this.get('mainId')
				}
			});
		},
		clearComment:function(){
			this.commentList.empty();
			return this;
		},
		listenToCollection:function(){
			this.listenTo(this.collection,{
				reset:function(){
					this.clearComment().render();
					this.show();
				},
				invalid:function(model,error){
				},
				add:function(model){
					this.addOneComment(model,'prepend');
				}
			});
		},
		events:{
			'keydown [data-behavior="comment-text-area"]':'onCommentTextAreaKeyPress',
			'submit [data-behavior="comment-form"]':'onFormSubmit'
		},
		onCommentTextAreaKeyPress:function(e){
			if(e.which===13&& e.shiftKey){
				var $this=this.$(e.currentTarget);
				$this.closest('form').submit();
				e.preventDefault();
			}
		},
		onFormSubmit:function(e){
			var $this=this.$(e.currentTarget);
			var vals=$this.serializeArray();
			var attr=util.convertArrayToObject(vals);
			this.createComment(attr);
			$this.find('textarea').val('');
			e.preventDefault();
		},
		createComment:function(attr){
			attr.content=PAROX.$.trim(attr.content);
			if(!attr.content){
				PAROX.alert(PAROX.LANG.COMMENT.NULL);
				return;
			}
			attr=this.handleContent(attr);
			var ctype=this.get('ctype');
			attr= _.extend(attr,this.__viewModel.toJSON());
            delete attr.parent;
			this.collection.create(attr,{
				wait:true,
				validate:true,
				beforeSend:PAROX.showLoading,
				success: _.bind(function(model){
					PAROX.message(PAROX.LANG.COMMENT.SUCCESS);
					if(this.mentions.length===0)return;
					this.mentionSomeone(model.get('commentId'));
				},this),
				complete:PAROX.hideLoading
			});
		},
		handleContent:function(attr){
			var content=attr.content;
			var mentions=this.mentions.clone();
			if(mentions.length===0)return attr;
			mentions.each(function(user){
				var realName='@'+user.getName();
				var link='<a href="#user/'+user.get('userId')+'/user-introduction">'+realName+'</a>';
				if(content.indexOf(realName)>-1){
					content=content.replace(realName,link);
				}else{
					this.mentions.remove(user);
				}

			},this);
			attr.content=content;

			return attr;
		},
		mentionSomeone:function(commentId){
			PAROX.ajax({
				url:'/colla/comment/mention',
				data:{
					commentId:commentId,
					userIds:this.mentions.pluck('userId').join(',')
				},
				complete: _.bind(function(){
					this.mentions.reset();
				},this)
			});
		},
		readyToShow:function(){
			this.isReady=true;
		},
		isDisplay:function(){
			return this.$el.is(':visible');
		},
		show:function(){
			this.$el.stop().delay(0).slideDown(PAROX.CONFIG.SPEED,function(){
				PAROX.$(this).find('[data-behavior="comment-text-area"]').focus();
			});
            this.__isDisplay=true;
			return this;
		},
		hide:function(){
			this.$el.stop().slideUp(PAROX.CONFIG.SPEED);
            this.__isDisplay=false;
			return this;
		}
	});
});