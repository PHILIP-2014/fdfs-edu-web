/**
 * fileName:文档记录视图
 * createdBy:William
 * date:2014/9/5
 */
define('viewCommon/document-viewer/document.activity',['parox','collection/collections'],function(require){
	'use strict';
	var PAROX=require('parox');
	var _=PAROX._;
	var collection=require('collection/collections');
	var DocActivityList=collection.DocActivityList;
    var activityTpl='<%collection.each(function(model){%>' +
                    '<li><div class="media">' +
                        '<a href="javascript:;" class="pull-left m-r-15">' +
                            '<img src="<%=model.getPhotoUrl()%>" class="media-object img-40X40 bdr-5" >' +
                        '</a>' +
                        '<div class="media-body">' +
                            '<div class="m-b-5">' +
                                '<a href="#user/<%=model.get(\'userId\')%>/user-introduction" data-behavior="user-name"><%=model.get(\'realName\')%></a>' +
                                '<%=model.getActText(\'doc\')%>该文档' +
                            '</div>' +
                            '<div class="f-s-12 text-info"><%=model.get(\'displayTime\')%></div>' +
                        '</div>' +
                    '</div></li><%})%>';

	return PAROX.View.extend({
		template:PAROX._.template(activityTpl),
		tagName:'ul',
		className:'list-cell list-cell-md',
		initialize:function(){
			this.__viewModel=new PAROX.Backbone.Model();
			this.collection=new DocActivityList();
			this.listenTo(this.__viewModel,{
				'change:docId':function(model,docId){
					this.clear().collection.fetch({
						data:{
							docId:docId
						},
						beforeSend:PAROX.showLoading,
						complete:PAROX.hideLoading,
						reset:true,
						remove:true
					});
				}
			});

			this.listenTo(this.collection,{
				reset:this.render
			});
		},
		render:function(){
			this.$el.html(this.template({collection:this.collection}));
		},
		show:function(){
			this.$el.parent().addClass('active')
				.data('isDisplay',true)
				.siblings()
				.removeClass('active')
				.data('isDisplay',false);
			return this;
		},
		events:{
			'click [data-behavior="user-name"]':'onNameClick'
		},
		onNameClick:function(){
			this.parent.close();
		},
		clear:function(){
			this.$el.empty();
			return this;
		}
	});
});