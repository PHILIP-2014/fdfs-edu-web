/**
 * fileName:共享链接页面的路由
 * createdBy:William
 * date:2014/11/11
 */
define('shared.link.router',['parox'],function(require,exports){
    'use strict';
    //var flexSlider=require('flexSlider');
    var PAROX=require('parox');
    var $=require('jquery');
    var _=require('underscore');
    var backbone=require('backbone');

    var folderThumbnailTpl='<%var link=model.getSharedLink()%>' +
                            '<div class="p-t-25 text-center" data-behavior="folder">' +
                                '<a href="<%=link%>">' +
                                    '<span class="icon-64 icon-64-folder-<%=model.getICON()%>"></span>' +
                                '</a>' +
                            '</div>' +
                            '<h4 class="text-overflow p-10 text-center" data-behavior="folder">' +
                            '<%var folderName=model.get(\'folderName\')%>' +
                                '<a href="<%=link%>" class="text-main" data-toggle="tooltip" data-placement="bottom"' +
                                    ' title="<%=folderName%>" data-name="name"><%=folderName%></a>' +
                            '</h4>';
    var folderListTpl='<div class="item-block p-t-20 p-b-20">' +
                        '<%var link=model.getSharedLink()%>' +
                        '<div class="item-middle"><div class="media">' +
                            '<span class="pull-left icon-40 icon-40-folder-<%=model.getICON()%>"></span>' +
                            '<div class="media-body">' +
                                '<h4><a href="<%=link%>" class="text-main" data-name="name"><%=model.get(\'folderName\')%></a></h4>' +
                                '<div class="text-help f-s-12">' +
                                    '<a href="#"><%=model.get(\'editorName\')%></a>' +
                                    '于<span><%=model.formatLastModifyTime()%></span>更新' +
                                    '<span class="icon-12 icon-12-user m-r-5"></span><%=model.get(\'shareCount\')%>' +
                                    '<span class="icon-12 icon-12-file m-r-5"></span><%=model.get(\'docNum\')%>' +
                                '</div>' +
                            '</div>' +
                        '</div></div>' +
                       '</div>';
    var fileThumbnailTpl='<div class="p-t-25 text-center">' +
                            '<a href="javascript:;">' +
                                '<span class="icon-64 icon-64-unknow icon-64-<%=model.get(\'suffix\')%>"></span>' +
                            '</a>' +
                        '</div>' +
                        '<h4 class="text-overflow p-10 text-center">' +
                            '<a href="javascript:;" class="text-main" data-name="name" data-toggle="tooltip" data-placement="bottom"' +
                            ' title="<%=model.get(\'docName\')%>"><%=model.get(\'docName\')%></a>' +
                        '</h4>';
    var fileListTpl='<div class="item-block p-t-20 p-b-20 clearfix"><div class="item-left"><div class="media">' +
                        '<span class="pull-left icon-40 icon-40-unknow icon-40-<%=model.get(\'suffix\')%>"></span>' +
                        '<div class="media-body">' +
                            '<h4>' +
                                '<a href="javascript:;" class="text-main" data-name="name">' +
                                    '<%=model.get(\'docName\')%>' +
                                '</a>' +
                            '</h4>' +
                            '<div class="text-help f-s-12">' +
                                '<a href="#"><%=model.get(\'editorName\')%></a>' +
                                '于<span><%=model.formatLastModifyTime()%></span>更新' +
                                '<span class="icon-12 icon-12-user m-r-5"></span><%=model.get(\'shareCount\')%>' +
                            '</div>' +
                        '</div>' +
                    '</div></div>'+
                    '<div class="item-right">'+
                        '<ul class="btn-list list-inline">'+
                            '<li>'+
                                '<a href="javascript:void(0);" data-behavior="menu-item" data-command="download">'+
                                '<span class="icon-12 icon-12-download btn-icon"></span>'+
                                '<span class="btn-title">下载</span>'+
                                '</a>'+
                            '</li>'+
                        '</ul>'+
                        '</div></div>';

    //var ImageViewer=require('viewCommon/document-viewer/image.viewer');
    //var DocumentViewer=require('viewCommon/document-viewer/document.viewer');
    var util=require('util/util');

    //文件夹模型
    var FolderModel=PAROX.models.FolderModel.extend({
        getICON:function(){
            return 'normal';
        }
    });
        //文档模型
    var DocumentModel=PAROX.models.DocumentModel;

    var FolderList=backbone.Collection.extend({
        model:FolderModel
    });

    var DocumentList=backbone.Collection.extend({
        model:DocumentModel
    });

    var attr={
        authType:Number($('[name="authType"]').val()),
        code:$('[name="code"]').val(),
        destType:Number($('[name="destType"]').val()),
        folderId:Number($('[name="folderId"]').val()),
        docId:Number($('[name="docId"]').val())
    };

    var url=attr.destType==1?'/s/folder/':'/s/doc/';

    if(attr.authType==1){
        var hash=attr.destType==1?
        'link/sharedFolder/'+attr.folderId+'/'+attr.folderId:
        'link/sharedFolder/'+attr.docId;
        window.location.hash=hash;
    }

    //var DocumentsView=require('viewDocument/view.folders.and.documents');

    //文夹件列表项视图
    var FolderItemView=PAROX.View.extend({
        tagName:'li',
        initialize:function(option){
            var className=this.parent.get('viewType')==='thumbnails'?
                'clearfix w-12 p-relative m-5':
                'clearfix';
            this.$el.addClass(className);
        },
        render:function(){
            if(this.model.get('checked')){
                this.$el.addClass('active');
            }
            return this.$el.html(this.template({model:this.model}));
        },
        events:{
            'click [data-behavior="menu-item"]':'onMenuItemClick'
        },
        onMenuItemClick:function(e){
            var $this=this.$(e.currentTarget);
            var command=$this.data('command');
            var fn=this[command];
            if(_.isFunction(fn)){
                fn.call(this,e);
            }
        },
        getIdAttribute:function(){
            return this.isFile()?'docId':'folderId';
        },
        showViewer:function(e){
            var model=this.model;
            var parent=this.parent;
            var viewer,data,index;
            model.fetch({
                success:function(){
                    if(model.get('isImage')){
                        if(model.collection){
                            data=model.collection.where({isImage: true});
                            index= _.indexOf(data,model);
                        }else{
                            data=[model];
                            index=0;
                        }

                        viewer=parent.imageViewer;
                    }else{
                        data=model;
                        viewer=parent.documentViewer;
                        index=0;
                    }
                    viewer.open().setData(data,index);
                }
            });
        },
        download:function(){
            var model=this.model;
            var url='/s/down/all/'+attr.code;
            var data={
                    docId:model.get('docId'),
                    version:model.get('nowVersion')
                };

            url+='?'+ $.param(data);
            window.open(url,'下载');
        },
        isFile:function(){
            return this.type==='file';
        }
    });

    var FileView=PAROX.View.extend({
        itemTemplate:{
            folder:{
                thumbnails:_.template(folderThumbnailTpl),
                list: _.template(folderListTpl)
            },
            file:{
                thumbnails: _.template(fileThumbnailTpl),
                list: _.template(fileListTpl)
            }
        },
        events:{
            'click [data-behavior="command"]':'onCommandBtnClick'
        },
        initialize:function(option){
            this.__viewModel=new backbone.Model({
                isInFolder:false,
                viewType:''//视图类型，两种，一种缩略图，一种是列表list
            });
            //查询数据的参数模型
            this.queryModel=new backbone.Model({
                code:attr.code,//连接code必须
                folderId:0,//共享的folderId
                parentId:attr.folderId,//子文件夹id
                desc:'desc',
                limit:100,
                start:0,
                orderby:'create_time'
            });

            //文件集合
            this.documents=new DocumentList();
            //文件夹集合
            this.folders=new FolderList();

            //this.imageViewer=new ImageViewer({parent:this});
            //this.documentViewer=new DocumentViewer({parent:this});

            this.fileListWrap=this.$('[data-behavior="file-list-wrap"]');
            this.folderListWrap=this.$('[data-behavior="folder-list-wrap"]');


            this.itemViews=new backbone.Collection();
            this.checkedFiles=0;
            this.checkedFolders=0;

            this.listenTo(this.__viewModel,{
                'change:isInFolder':function(model,bool){
                    this.parent.set('isInFolder',bool);
                },
                'change:folderId':function(model,folderId){
                    this.queryModel.set({folderId:folderId});

                },
                'change:parentId':function(model,id){
                    this.queryModel.set({parentId:id});
                },
                'change:viewType':function(model,type){
                    var className=type==='thumbnails'?
                        ' ls-doc-view clearfix p-t-15 p-b-15':
                        ' ls-doc-list list-hover mobile-doc-list';
                    this.fileItemTemplate=this.itemTemplate.file[type];
                    this.folderItemTemplate=this.itemTemplate.folder[type];
                    this.fileListWrap.removeClass().addClass(className);
                    this.folderListWrap.removeClass().addClass(className);
                    this.clearList().reRender();
                },
                'change:response':this.renderFolderView,
                'change:docId':function(model,docId){
                    this.queryModel.clear({silent:true}).set({docId:docId,code:attr.code});
                }
            });

            this.listenTo(this.queryModel,{
                change:function(){
                    this.clearList().fetch();
                }
            });

            this.listenTo(this.documents,{
                reset:function(){
                    this.renderDocuments();
                }
            });

            this.listenTo(this.folders,{
                reset:this.renderFolders
            });

            this.set('viewType','list');
        },
        clearList:function(){
            this.fileListWrap.empty();
            this.folderListWrap.empty();
            return this;
        },
        reRender:function(){
            this.renderDocuments()
                .renderFolders();
            return this;
        },
        fetchSuccess:function(data){
            this.renderCode(data);
            this.set({response:data});
            if(attr.destType==2){
                var model=new DocumentModel(data.document);
                this.addOneDocument(model);
                return this;
            }

            var folderList=data.folderList;
            var docList=data.documentList;
            var view=this.viewName;
            var condition=folderList.length===0&&docList.length===0;

            if(condition){
                this.renderNoFoldersView();
            }
            _.each(folderList,function(item){
                var folder=item.folder;
                _.extend(item,folder,{
                    view:view,
                    parentId:attr.folderId
                });
            },this);

            _.each(docList,function(item){
                item.view=view;
            },this);

            this.folders.reset(folderList);
            this.documents.reset(docList);

        },
        renderCode:function(data){
            var model=this.queryModel;
            var folderId=model.get('folderId');
            var docId=model.get('docId');
            var data=folderId?'folderId='+folderId :'docId='+docId;
            this.$el.parent().find('[data-behavior="qr-code"]').attr('src','/core/docLink/sendQRCode?'+data+'&visitUrl='+model.get('code'));
        },
        renderDocuments:function(){
            this.documents.each(this.addOneDocument,this);
            return this;
        },
        renderFolders:function(){
            this.folders.each(this.addOneFolder,this);
            return this;
        },
        cancelLink:function(){
            var url='/core/docLink/close/';
            $.ajax({
                url:url,
                data:{
                    code:attr.code
                },
                success:function(){
                    _.delay(function(){
                        location.assign('http://'+location.host+'/login');
                    },1000);

                }
            });
        },
        download:function(){
            var idAttr=attr.destType==1?'folderId':'docId';
            var param={};
            param[idAttr]=attr[idAttr];
            param= $.param(param);
            var url='/s/down/all/'+attr.code+'?'+param;
            window.open(url);
        },
        fetch:function(){
            var data=this.queryModel.toJSON();
            $.ajax({
                url:this.url,
                data:data,
                success: _.bind(this.fetchSuccess,this)
            });
        },
        addOneDocument:function(model){
            model.set({view:this.viewName});
            var itemView=new FolderItemView({
                model:model,
                parent:this,
                template:this.fileItemTemplate,
                type:'file'
            });
            this.fileListWrap.append(itemView.render());
            this.itemViews.add({
                view:itemView,
                id:'view'+model.get('docId')
            });
        },
        addOneFolder:function(model){
            model.set({view:this.viewName});
            var itemView=new FolderItemView({
                model:model,
                parent:this,
                template:this.folderItemTemplate,
                type:'folder'
            });
            this.folderListWrap.append(itemView.render());
            this.itemViews.add({
                view:itemView,
                id:'view'+model.get('folderId')
            });
        },
        renderFolderView:function(){
            var response=this.get('response');
            var method=response.ownerFlag?'show':'remove';
            this.$('[data-command="cancelLink"]')[method]();

            if(attr.destType==2){
                this.$('[data-behavior="folder-info"]').remove();
                this.$('[data-behavior="time-wrap"]').remove();
                this.$('[data-behavior="tool-bar"]').remove();
                this.$('[data-behavior="bread-list"]').remove();
                return this;
            }
            var folder=new FolderModel(this.get('response').folder);


            this.$('[data-behavior="folder-name"]').html(folder.get('folderName'));
            this.$('[data-behavior="edit-time"]').html(folder.formatLastModifyTime());

            this.renderBreadCrumb();
        },
        renderBreadCrumb:function(){
            var pathArr=this.get('response').currentPath;
            var html='';

            _.each(pathArr,function(folder){
                var url='#link/sharedFolder/'+attr.folderId+'/'+folder.folderId;
                html+='<li><a href="'+url+'">'+folder.folderName+'</a></li>';
            },this);
            this.$('[data-behavior="bread-list"]').html(html);
        },
        toggleButton: $.noop,
        renderNoFoldersView: $.noop,
        onShow: $.noop
    });

    var ValidatePasswordView=PAROX.View.extend({
        initialize:function(){
            this.__viewModel=new backbone.Model({

            });
        },
        events:{
            'submit form':'onFormSubmit'
        },
        onFormSubmit:function(e){
            var param=this.$(e.currentTarget).serializeArray();
            param=util.convertArrayToObject(param);
            this.validatePassword(param);
            e.preventDefault();
        },
        validatePassword:function(param){
            $.ajax({
                url:'/s/verify/',
                data:param,
                success: _.bind(this.onValidationPass,this)
            });
        },
        onValidationPass:function(resp){
            if(resp.success){
                var hash=attr.destType==1?
                        'link/sharedFolder/'+attr.folderId+'/'+attr.folderId:
                        'link/sharedFolder/'+attr.docId;
                window.location.hash=hash;
                this.hide();
            }else{
                PAROX.alert('密码错误');
            }
        }

    });


    var AppRouter=backbone.Router.extend({
        initialize:function(){
            this.sharedFolder=new FileView({
                el:'#shared-file',
                viewName:'sharedFile',
                url:url
            });
            this.passWordValidation=new ValidatePasswordView({
                el:'#password'
            });
        },
        routes:{
            'link/:viewName/:folderId/:parentId': 'switchToFolderView',
            'link/:viewName/:docId':'switchToFileView'
        },
        switchToFolderView:function(viewName,folderId,parentId){
            this[viewName].show().set({folderId:Number(folderId),parentId:Number(parentId)});
            this.passWordValidation.hide();
        },
        switchToFileView:function(viewName,docId){
            this[viewName].show().set({docId:docId});
            this.passWordValidation.hide();
        }

    });

    var appRoute=new AppRouter();
    //启动路由
    backbone.history.start();

});