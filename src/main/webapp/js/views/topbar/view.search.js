/**
 * fileName:搜索视图
 * createdBy:William
 * date:2014/9/16
 */
define('views/topbar/view.search',['parox','collection/collections',
    'views/search-results/view.search.results','viewCommon/document-viewer/document.viewer',
    'viewCommon/document-viewer/image.viewer','viewCommon/task-edit/view.task.editor'],function(require){
	'use strict';
	var PAROX=require('parox');
    var $=PAROX.$;
    var _=PAROX._;
	var collection=require('collection/collections');
    var tpl=$('#search-resultTpl');
	var resultTpl=tpl.html()||'<br>';
        //tpl.remove();
	var searchView=require('views/search-results/view.search.results');

	//文档查看器
	var DocumentViewer=require('viewCommon/document-viewer/document.viewer');
	var documentViewer=new DocumentViewer();
	//图片查看器
	var ImageViewer=require('viewCommon/document-viewer/image.viewer');
	var imageViewer=new ImageViewer();

	//任务编辑面板
	var taskEditor=require('viewCommon/task-edit/view.task.editor');

	return PAROX.View.extend({
		el:'[data-behavior="search-area-wrap"]',
		template:PAROX._.template(resultTpl),
		initialize:function(option){
			var defaults={
				__viewModel:new PAROX.Backbone.Model(),
				viewName:'searchView',
				keyWord:'',
				collection:new collection.SearchResultList(),
				success:true
			};
			PAROX._.extend(this,defaults,option);

			this.listenTo(this.__viewModel,{
				'change:keyWord':this.search
			});

			this.listenTo(this.collection,{
				reset:this.render
			});
			this.resultWrap=this.$('ul[data-behavior="search-list"]');
			if(!PAROX.util.browser.supportHTML5()){
				this.$('[data-behavior="search-input"]').on('propertychange', _.bind(this.onSearchBoxInput,this));
			}

		},
		search:function(){
			if(this.success){
				this.success=false;
				this.collection.fetch({
					data:{
						k:this.get('keyWord'),//关键词
						size:10,//一页的条数
						p:1//页数
					},
					remove:true,
					reset:true,
					complete:PAROX._.bind(function(){
						this.success=true;
					},this)
				});
			}
		},
		render:function(){
			this.resultWrap.html(this.template({results:this.collection}));
		},
		events:{
			'input [data-behavior="search-input"]':'onSearchBoxInput',
			'focusout [data-behavior="search-input"]':'onSearchBoxFocusOut',
            'click':'onSearchBtnClick',
			'click [data-behavior="showMore"]':'onMoreBtnClick',
			'submit form':'onFormSubmit',
			'click [data-behavior="command"]':'onCommandBtnClick'
		},
		onSearchBoxFocusOut:function(){
			this.$el.removeClass('active');
			this.$('[data-behavior="search-input"]').val('');
		},
		task:function(e){
			var taskId=Number(this.$(e.currentTarget).data('id'));
			if(taskId===taskEditor.get('taskId')){
				var method=taskEditor.__isDisplay?'hide':'show';
				taskEditor[method]();
			}else{
				taskEditor.setModel(new PAROX.models.TaskModel({taskId:taskId})).show();
				taskEditor.parent=this;
			}
		},
		doc:function(e){
			var $this=this.$(e.currentTarget);
			var docId=$this.data('id');
			var model=new PAROX.models.DocumentModel({docId:docId});
			model.fetch({
				success:function(){
					var isImg=model.get('isImage');
					var viewer=isImg?imageViewer:documentViewer;
					viewer.open().setData(model);
				}
			});
		},
		onFormSubmit:function(e){
			var k=this.get('keyWord');
			searchView.set({k:k});
			window.location.hash='search/searchResults';
			e.preventDefault();
		},
		onMoreBtnClick:function(e){
			this.$('form').submit();
			this.$el.removeClass('open');
		},
		onSearchBoxInput:function(e){
			var key= $.trim(this.$(e.currentTarget).val());
			this.set('keyWord',$.trim(key));
			if(key){
				this.$el.addClass('open');
			}
		},
        onSearchBtnClick:function(e){
            this.$el.addClass('active');
			this.$('[data-behavior="search-input"]').focus();
            e.stopPropagation();
        }
	});
});