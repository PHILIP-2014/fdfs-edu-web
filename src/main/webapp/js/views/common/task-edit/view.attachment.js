/**
 * fileName:任务附件视图
 * createdBy:William
 * date:2014/11/4
 */
define('viewCommon/task-edit/view.attachment',['parox','collection/collections','viewCommon/document-viewer/document.viewer',
    'viewCommon/document-viewer/image.viewer'],function(require) {
    'use strict';
    var PAROX = require('parox');
    var _ = PAROX._;
    var $ = PAROX.$;
    var collection = require('collection/collections');
    //文档查看器
    var DocumentViewer=require('viewCommon/document-viewer/document.viewer');
    var documentViewer=new DocumentViewer();
    //图片查看器
    var ImageViewer=require('viewCommon/document-viewer/image.viewer');
    var imageViewer=new ImageViewer();

    var itemTpl='<div class="pull-left">'+
                    '<span class="icon-40 icon-40-unknow icon-40-<%=model.get("suffix")%>">'+
                '</div>'+
                '<div>'+
                    '<div class="text-overflow m-b-3 cur-p" data-behavior="command" data-command="viewDocument" title="<%=model.get("docName")%>"><%=model.get("docName")%></div>'+
                    '<div class="text-info">上传者'+

                        '<a href="javascript:;"><%=model.getUserName()%></a>,<%=model.editTimeFromNow()%>'+
                        '<a href="javascript:void(0);" class="m-l-30" data-behavior="command" data-command="download">下载</a>'+
                        '<%if(model.get("editAble")){%>'+
                        '<a href="javascript:void(0);" class="m-l-15" data-behavior="command" data-command="doDelete">删除</a>'+
                        '<%}%>'+
                    '</div>'+
                '</div>';



    var AttachmentItemView=PAROX.View.extend({
        template: _.template(itemTpl),
        tagName:'li',
        className:'clearfix m-b-5',
        initialize:function(){
            this.listenTo(this.model,{
                destroy:this.remove,
                change:this.render
            });
        },
        render:function(){
            return this.$el.html(this.template({model:this.model}));
        },
        events:{
            'click [data-behavior="command"]':'onCommandBtnClick'
        },
        viewDocument:function(e){
            e.stopPropagation();
            var docId=this.model.get('docId');
            var model=new PAROX.models.DocumentModel({docId:docId});
            model.fetch({
                success:function(){
                    var viewer=model.get('isImage')?imageViewer:documentViewer;
                    viewer.open().setData(model);
                }
            });
        },
        doDelete:function(e){
            e.stopPropagation();
            PAROX.confirm('您确定要删除此附件吗？', _.bind(function(){
                this.model.destroy({
                    wait:true,
                    success:function(){
                        PAROX.message('删除附件成功！');
                    }

                });
            },this));
        },
        download:function(){
            var downURL=this.model.get('downUrl');
            window.open(downURL);
        }
    });

    return PAROX.View.extend({
        initialize:function(){
            var self=this;
            this.__viewModel=new PAROX.Backbone.Model();
            this.collection=new collection.DocumentList();
            this.collection.parse=function(resp){
                var editAble=self.get('editAble');
                _.each(resp,function(item){
                    item.editAble=editAble;
                });
                return resp;
            };

            this.listenTo(this.__viewModel,{
                'change:task':function(model,task){
                    var taskId=task.get('taskId');
                    var editAble=task.get('editAble');
                    this.clear()
                        .set({taskId:taskId,editAble:editAble})
                        .fetch(taskId);
                },
                'change:editAble':this.toggleEditAble
            });

            this.listenTo(this.collection,{
                reset:this.render,
                add:function(model){
                    model.set({editAble:this.get('editAble')});
                    this.addOne(model);
                    this.parent.changeTaskBody=true;
                }
            });

            this.listWrap=this.$('[data-behavior="attachment-list"]');
            //文件上传面板
            this.fileUploader=PAROX.component.fileUploader;
        },
        fetch:function(taskId){
            this.collection.fetch({
                url:'/colla/task/attach/',
                data:{
                    taskId:taskId
                },
                reset:true,
                remove:true
            });
            return this;
        },
        render:function(){
            var list=this.collection;

                list.each(this.addOne,this);

            return this;
        },
        addOne:function(model){
            var itemView=new AttachmentItemView({model:model,parent:this});
            this.listWrap.append(itemView.render());
        },
        clear:function(){
            this.listWrap.empty();
            return this;
        },
        events:{
            'click [data-behavior="command"]':'onCommandBtnClick'
        },
        uploadSuccess:function(ele,resp,xhr){
            var obj=resp[0];
            obj.user=PAROX.__USER;
            this.collection.add(resp[0]);
        },
        uploadAttachment:function(){
            this.fileUploader.set({
                distType:'TASK',
                distId:this.get('taskId'),
                uploadType:1,
                spaceId:this.parent.get('spaceId'),
                onSuccess: _.bind(this.uploadSuccess,this)
            }).show();
        },
        toggleEditAble:function(){
            var editAble=this.get('editAble');
            var method=editAble?'show':'hide';
            this.collection.each(function(model){
                model.set({editAble:editAble});
            });
            this.$('[data-command="uploadAttachment"]')[method]();
        }
    });
});