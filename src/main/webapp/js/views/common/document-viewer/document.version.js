/**
 * fileName:文档记录视图
 * createdBy:William
 * date:2014/9/5
 */
define('viewCommon/document-viewer/document.version',['parox','viewCommon/document-viewer/document.activity','collection/collections'],function(require){
	'use strict';
	var PAROX=require('parox');
	var _=PAROX._;
	var ActivityView=require('viewCommon/document-viewer/document.activity');
	var collection=require('collection/collections');


	var itemTpl=
					'<div class="media">'+
						'<span class="pull-left icon-40 icon-40-unknow icon-40-<%=model.get("suffix")%>"></span>'+
						'<div class="media-body">'+
							'<div class="pull-left">'+
								'<div class="m-b-3 w-sm cur-p" data-behavior="doc-name"><%=model.get("docName")%>'+
								'<span class="label label-primary p-t-un p-b-un m-l-3 f-w-n"><i class="icon-12 icon-12-version m-r-3"></i><%=model.get("version")%></span>'+
								'</div>'+
								'<div>'+
								'<a href="#" class="m-r-3"><%=model.get("realName")%></a>' +
								'于'+
								'<span class="m-l-3 m-r-3"><%=model.formatEditTime()%></span>' +
								'更新'+
								'</div>'+
							'</div>'+
							'<div class="pull-right w-3 text-center cur-p version-download">'+
								'<div>' +
									'<a href="<%=model.get("downUrl")%>" target="_blank">' +
									'<span class="icon-12 icon-12-download-w"></span>' +
									'<br/>' +
									'下载' +
									'</a>' +
								'</div>'+
							'</div>'+
						'</div>'+
					'</div>';


	var VersionItemView=PAROX.View.extend({
		tagName:'li',
		template: _.template(itemTpl),
		render:function(){
			return this.$el.html(this.template({model:this.model}));
		},
		events:{
			'click [data-behavior="doc-name"]':'onDocNameClick'
		},
		onDocNameClick:function(){
			var viewUrl=this.model.get('viewUrl');
			this.parent.parent.setUrl(viewUrl).set({downUrl:this.model.get("downUrl")});

		}
	});

	return ActivityView.extend({
		initialize:function(){
			this.__viewModel=new PAROX.Backbone.Model();

			this.collection=new collection.VersionList();
			this.listenTo(this.__viewModel,{
				'change:docId':function(model,docId){
					this.clear().collection.fetch({
						data:{
							docId:docId
						},
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
			this.collection.each(this.addOne,this);
			return this;
		},
		addOne:function(model){
			var itemView=new VersionItemView({
				model:model,
				parent:this
			});
			this.$el.append(itemView.render());
		}
	});
});