/**
 * fileName:文件上传窗口
 * createdBy:William
 * date:2014/10/4
 */
define('component/file.uploader',['jquery','underscore','models','util/util','component/dialog','lib/jquery/plugin.dropzone'],function(require) {
	'use strict';
	var $ = require('jquery');
	var _ = require('underscore');
	var models = require('models');
	var util = require('util/util');
	var Dialog=require('component/dialog');

    var DropZone=require('lib/jquery/plugin.dropzone');

    var fileListTpl='<li class="clearfix p-5">'+
        '<div class="w-10 text-overflow pull-left m-r-20" data-dz-name>'+
        '</div>'+
        '<div class="text-center clearfix" data-dz-info>'+
        '<div class="pull-left m-r-5" data-dz-size>0KB</div>'+
        '<div class="progress m-t-4">'+
        '<div class="progress-bar progress-bar-info" data-dz-uploadprogress role="progressbar" aria-valuenow="" aria-valuemin="0" aria-valuemax="100">'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</li>';

	var FileUploader= Dialog.extend({
        el:'#upload-file',
        defaults:{
            dictDefaultMessage:'点击上传文件',
            paramName: 'files',
            url:'/core/document/upload/doc',
            method:'POST',
            maxFilesize:1024,
            previewsContainer:'#file-list',
            addRemoveLinks:true,
            previewTemplate:fileListTpl
        },
		initialize:function(option){
            option=option||{};
            option= _.extend({},this.defaults,option);
			this.__viewModel=new models.DialogModel({
                'title':'上传文件',
                distType:'FOLDER',//挂载类型，FOLDER OR TASK
                distId:0,//挂载id,如果是挂载类型是文件夹，就是folderId,如果是任务，就是taskId
                uploadType:1,//上传类型，1：本地上传，2：从空间选择，3，从网盘链接，4：从网盘提取
                onSuccess: $.noop,
                onError: $.noop,
                uploading:0,
                maximize:true
			});

			this.events=_.extend({
				'click [data-behavior="tab-btn"]':'onTabBtnClick',
				'click [data-behavior="add-link"]':'onAddLinkBtnClick'
			},this.events);

			this.listenTo(this.__viewModel,{
                change:this.setUploadParam,
                'change:uploading':this.updateUploadCount,
                'change:maximize':this.onMaximizeChange
			});
            this.dropzone=new DropZone('#my-awesome-dropzone',option);
            if(this.dropzone.on){
                this.dropzone.on('addedfile', _.bind(function(){

                    this.set({uploading:this.get('uploading')+1});
                },this));
                this.dropzone.on('success', _.bind(function(element,resp,xhr){
                    this.get('onSuccess')(element,resp,xhr);
                },this));
                this.dropzone.on('complete', _.bind(function(element,resp,xhr){
                    this.set({uploading:this.get('uploading')-1});
                },this));

                this.dropzone.on('error', _.bind(function(file,error,xhr){
                    this.get('onError')(file,error,xhr);
                },this));

              /*  this.dropzone.on('removedfile', _.bind(function(file){

                },this));


                this.dropzone.on('queuecomplete', _.bind(function(element,error,xhr){//上传队列全部完成时触发

                },this));*/
            }

            this.__isDisplay=false;
			this.set(option,{validate:true});
		},
        onMaximizeChange:function(model,maximize){
            var method=maximize?'removeClass':'addClass';
            this.$el[method]('zoom-out');
        },
		updateTotalView:function(){
			this.$('[data-behavior="file-total"]').html(this.collection.length);
			return this;
		},
		updateCurrentView:function(){
			this.$('[data-behavior="file-uploaded"]').html(this.collection.where({loaded:true}).length);
			return this;
		},
        updateUploadCount:function(model,upload){
            this.$('[data-behavior="uploading-num"]').html(upload);
        },
		switchFileCountView:function(view) {
            this.$('[data-behavior="' + view + '"]').show().siblings().hide();
            return this;
        },
		onTabBtnClick:function(e){
			var $this=this.$(e.currentTarget);
			this.$('[data-behavior="tab-content"]').children().eq($this.index()).show().siblings().hide();
			$this.addClass('active').siblings().removeClass('active');
		},
        show:function(){
            var that=this;
            var onShow=this.get('onShow');
            var transition=$.support.transition && this.$el.hasClass('fade');

            this.__isDisplay=true;//设置弹窗状态

            this.$el.show().scrollTop(0);//显示根元素

            this.$el.addClass('in')
                .attr('aria-hidden', false);

            if(transition){
                this.$el.find('.modal-dialog') // wait for modal to slide in
                    .one('bsTransitionEnd', function () {
                        that.$el.trigger('focus');
                    }).emulateTransitionEnd(300);
            }else{
                that.$el.trigger('focus');
            }
            onShow(this);
            return this;
        },
        _hide:function(){
            this.dropzone.removeAllFiles(true);

            var onHide=this.get('onHide');
            var transition=$.support.transition && this.$el.hasClass('fade');

            this.__isDisplay=false;

            this.$el.removeClass('in')
                .attr('aria-hidden', true);

            onHide(this);

            if(transition){
                this.$el.one('bsTransitionEnd', $.proxy(this.hideModal, this))
                    .emulateTransitionEnd(300);
            }
        },
        hide:function(){
            if(this.get('uploading')>0){
                util.confirm('有文件正在上传，如果关闭窗口，将取消上传，您确定要关闭吗？', _.bind(this._hide,this));
            }else{
                this._hide();
            }
            return this;
        },
        hideModal:function(){
            var maskLayer=this.maskLayer;
            this.$el.hide();

            if(maskLayer){
                maskLayer.fadeOut(200,function(){
                    $(this).remove();
                });
            }
        },
        setUploadParam:function(){
            this.$('input[name="distType"]').val(this.get('distType'));
            this.$('input[name="distId"]').val(this.get('distId'));
            this.$('input[name="uploadType"]').val(this.get('uploadType'));
            this.$('input[name="spaceId"]').val(this.get('spaceId'));
        },
        toggleMaximize:function(){
            this.set({maximize:!this.get('maximize')});
        }
	});
    return new FileUploader();
});