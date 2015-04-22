/**
 * fileName:文档查看器
 * createdBy:William
 * date:2014/9/5
 */
define('viewCommon/document-viewer/document.viewer',['parox','viewCommon/document-viewer/image.viewer'],function(require){
	'use strict';
    var PAROX=require('parox');
    var ImageViewer=require('viewCommon/document-viewer/image.viewer');

    return ImageViewer.extend({
        updateTitle:function(){
            var docName=this.model.get('docName');
            this.$('[data-behavior="title"]').html(docName);
            if(!this.model.get('supportPreview')){
                this.$('[data-behavior="support-doc-name"]').html(docName);
            }
            return this;
        },
        updateDownUrl:function(){
            this.$('[data-command="download"]').attr('href',this.model.get('downUrl'));
            return this;
        },
		listenToModel:function(){
			this.listenTo(this.model,{
                sync:function(){
                    this.updateTitle().updateDownUrl();
                },
                'change:url':this.renderDocument
			});
            return this;
		},
		render:function(){
			this.$el.html(this.template({model:this.model}));
            this.$('[data-behavior="originAdd"]').parent().remove();
            this.$('[data-behavior="counter"]').remove();
            this.$('[data-behavior="content-wrap"]').html('<iframe frameborder="0" style="width: 100%;height: 100%;"></iframe>');
            this.addEvents();
            this.$('#viewer-attribute').append(this.filePropView.$el);
            this.$('#viewer-activity').append(this.activityView.$el);
            this.$('#viewer-comment').append(this.commentView.$el);
            this.$('#viewer-version').append(this.versionView.$el);
            this.$el.appendTo('body');
			return this;
		},
        renderDocument:function(model,url){
            if(model.get('supportPreview')){
                this.$('iframe').attr('src',url);
            }else{
                this.notSupportPreview(model);
            }

        },
        notSupportPreview:function(model){
            var html='<div class="text-center m-t-200">'+
                '<div class="icon-test-30 m-b-10"></div>'+
                '<div class="m-b-10" data-behavior="support-doc-name">'+model.get('docName')+'</div>'+
                '<div class="text-help f-s-16 m-b-10">（此格式暂不支持预览，您可以点击下载进行查看！）</div>'+
                '<div>'+
                '<a href="'+model.get('downUrl')+'" class="btn btn-success text-white">点击下载</a>'+
                '</div>'+
                '</div>';
            this.$('[data-behavior="content-wrap"]').html(html);
        },
        setUrl:function(url){
            this.$('iframe').attr('src',url);
            //this.collection.at(this.get('index')).set({url:url});
            //this.model.set({url:url});
            return this;
        },
        renderContent: PAROX.$.noop
	});
});