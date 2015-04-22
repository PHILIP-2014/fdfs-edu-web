/**
 * fileName:文档查看器
 * createdBy:William
 * date:2014/9/5
 */
define('viewCommon/document-viewer/image.viewer',['parox','viewCommon/document-viewer/document.property','viewCommon/document-viewer/document.activity',
    'viewCommon/document-viewer/document.comment','viewCommon/document-viewer/document.version',
    'viewDocument/popup/view.create.folder','viewDocument/popup/view.document.property',
    'viewDocument/popup/view.create.document.link','viewDocument/popup/view.share.document',
    'viewDocument/popup/view.copy','lib/flexslider/jquery.flexslider'],function(require){
	'use strict';
    var PAROX=require('parox');

    var FilePropertyView=require('viewCommon/document-viewer/document.property');
    var ActivityView=require('viewCommon/document-viewer/document.activity');
    var CommentView=require('viewCommon/document-viewer/document.comment');
    var FileVersionView=require('viewCommon/document-viewer/document.version');
    var FolderCreateWindow=require('viewDocument/popup/view.create.folder');
    //var FilePropertyWindow=require('viewDocument/popup/view.document.property');
    var LinkCreateWindow=require('viewDocument/popup/view.create.document.link');
    //var ShareWindow=require('viewDocument/popup/view.share.document');
    var CopyWindow=require('viewDocument/popup/view.copy');


	var $=PAROX.$;
	var _=PAROX._;

    var imgTpl=PAROX.$('#image-viewerTpl');
	var imageViewerTpl=imgTpl.html()||'<li></li>';

    var request=function(url,data,callback){
        PAROX.ajax({
            url:url,
            data:data,
            success:function(){
                if(_.isFunction(callback)){
                    callback();
                }
            }
        });
    };

    var ImageItemView=PAROX.View.extend({
        tagName:'li',
        initialize:function(){
            this.listenTo(this.model,{
                remove:this.remove,
                change:this.render
            });
        },
        render:function(){
            var model=this.model;
            var docName=model.get('docName');
            var img=$('<img>').attr('src',model.get('url')).attr('alt',docName).attr('title',docName);
            return this.$el.html(img);
        }
    });
    return PAROX.View.extend({
		tagName:'div',
        className:'viewer viewer-default',
		template: _.template(imageViewerTpl),
		initialize:function(){
            var option={parent:this};
			this.__isDisplay=false;
			this.__viewModel=new PAROX.models.DialogModel({
                currentView:'filePropView',
                currentModel:null
            });

            //图片地址集合
            this.collection=new PAROX.Backbone.Collection();

            //文档属性视图
            this.filePropView=new FilePropertyView(option);
            //文档活动记录视图
            this.activityView=new ActivityView(option);
            //文档评论视图
            this.commentView=new CommentView(option);

            //创建链接视图
            this.linkCreateWindow=new LinkCreateWindow();
            //版本视图
            this.versionView=new FileVersionView({parent:this});

            //移动复制窗口

            this.copyWindow=new CopyWindow();

            //重命名窗口
            this.renameWindow=new FolderCreateWindow({
                title:'重命名',
                confirmText:'保存',
                popupType:'rename'
            });

            //查看器与文档属性视图共用一个模型，以便视图同步
            this.model=this.filePropView.model;

            //监听模型
            this.listenToModel();

            this.listenTo(this.collection,{
                reset:this.renderContent,
                remove:this.updateTotal
            });

			this.listenTo(this.__viewModel,{
                'change:currentModel':function(model,currentModel){
                    var curView=this[this.get('currentView')];

                    if(curView.$el.parent().data('isDisplay')){
                        curView.set({docId:currentModel.get('docId')});
                    }
                    this.model.set(currentModel.toJSON()).trigger('sync');
                },
                'change:index':function(model,index){
                    this.updateIndex(index);
                    this.set({currentModel:this.collection.at(index)});
                },
                'change:downUrl':this.updateVersionDownUrl

			});

            $(window).on('keydown', _.bind(this.onKeyPress,this));
		},
        updateTitle:function(){
            this.$('[data-behavior="title"]').html(this.model.get('docName'));
            return this;
        },
        updateIndex:function(index){
            this.$('[data-behavior="currentNum"]').html(index+1);
        },
        updateVersionDownUrl:function(){
            this.$('[data-command="download"]').attr('href',this.get('downUrl'));
        },
        updateDownUrl:function(){
            this.$('[data-command="download"]').attr('href',this.model.get('downUrl'));
            return this;
        },
        updateTotal:function(){
            this.$('[data-behavior="totalNum"]').html(this.collection.length);
        },
        setOriginAddress:function(){
            this.$('[data-behavior="originAdd"]').attr('href',this.model.get('url'));
        },
        //设置要展示的数据
        setData:function(data,index){
            var isArray=_.isArray(data);
            data=isArray?data:[data];
            index=isArray?(index||0):0;

            this.set({index:index},{silent:true});
            this.collection.reset(data);

            this.__viewModel.trigger('change:index',this.__viewModel,index);
            return this;
        },
		listenToModel:function(){
			this.listenTo(this.model,{
				destroy:function(){
					this.close();
				},
                sync:function(){
                    this.updateTitle().updateDownUrl().setOriginAddress();
                }
			});
            return this;
		},
        addEvents:function(){
            this.delegateEvents();
            this.filePropView.delegateEvents();
            this.activityView.delegateEvents();
            this.commentView.delegateEvents()
                .subView.mention.delegateEvents();
            this.versionView.delegateEvents();
            return this;
        },
		render:function(){
			this.$el.html(this.template({model:this.model}));
            this.addEvents();
            this.$('[data-behavior="currentNum"]').html(this.index+1);
            this.$('#viewer-attribute').append(this.filePropView.$el);
            this.$('#viewer-activity').append(this.activityView.$el);
            this.$('#viewer-comment').append(this.commentView.resetTextArea().$el);
            this.$('#viewer-version').append(this.versionView.$el);
            this.$('[data-behavior="currentNum"]').html(this.get('index')+1);

            this.$el.appendTo('body');
			return this;
		},
        onNavBtnClick:function(slider){
            var index=slider.currentSlide;
            var curView=this.get('currentView');
            this.set('index',index);
            this.setModelByIndex(index)
                .updateIndex(index);
            this[curView].set({docId:this.model.get('docId')});
        },
        renderContent:function(){
            var startAt=this.get('index');
            this.imageWrap=this.$('[data-behavior="img-list-wrap"]');
            this.collection.each(this.addOneImage,this);
            this.updateTotal();
            this.setModelByIndex(startAt);
            this.imageWrap.parent().flexslider({
                startAt:startAt,
                animation:'fade',
                fadeFirstSlide: false,
                slideshow:false,
                prevText:'',
                nextText:'',
                after: _.bind(this.onNavBtnClick,this)
            });
            return this;
        },
        addOneImage:function(model){
            var itemView=new ImageItemView({model:model});
            this.imageWrap.append(itemView.render());
        },
        setModelByIndex:function(index){
            this.model.set(this.collection.at(index).toJSON());
            return this;
        },
		open:function(){
			this.render();
			this.__isDisplay=true;
            $('body').addClass('modal-open');
			this.$el.show();
            return this;
		},
		close:function(){
            this.undelegateEvents()
                .set({
                    index:'',
                    currentModel:null
                },{silent:true})
                .__isDisplay=false;
            this.model.clear({silent:true});
            $('body').removeClass('modal-open');
			this.$el.remove();
		},
        switchSubView:function(e){
            var view=this.$(e.currentTarget).data('view');
            this.set('currentView',view);
            this.$('[data-behavior="viewer-content"]').removeClass('sidebar-out').addClass('sidebar-in');

            this.$('[data-command="toggleSideBar"]').find('span').removeClass('icon-12-sidein').addClass('icon-12-sideout');
            this[view].set({docId:this.model.get('docId')}).show();
        },
        onKeyPress:function(e){
            if(e.which===27){
                this.close();
            }
        },
        events:{
            'click [data-behavior="command"]':'onCommandBtnClick',
            'click [data-behavior="menu-item"]':'onCommandBtnClick',
            'click':'onViewerClick'
        },
        //改变版本时，切换
        setUrl:function(url){
            this.collection.at(this.get('index')).set({url:url});
            return this;
        },
        link:function(){
            if(!this.checkPermission()){
                return false;
            }
            var option={
                destType:2,//共享类型，1为文件夹，2为文档
                docId:this.model.get('docId')
            };
            this.linkCreateWindow.set(option).show();
        },
        dropDown:function(e){
            this.$(e.currentTarget).parent().addClass('open');
            e.preventDefault();
            e.stopPropagation();
        },
        closeDropDown:function(){
            this.$('[data-command="dropDown"]').parent().removeClass('open');
        },
        allowEditable:function(){
            var permission=this.model.get('permission');
            return permission===2||permission===1;
        },
        checkPermission:function(){
            if(!this.allowEditable()){
                PAROX.alert('对不起，您没有此文档的编辑权限，请向文档作者申请权限！');
                return false;
            }else{
                return true;
            }
        },
        move:function(){
            this.moveOrCopy('move');
        },
        copy:function(){
            this.moveOrCopy('copy');
        },
        moveOrCopy:function(operation){
            if(!this.checkPermission()){
                return false;
            }
            var isCopy=operation==='copy';
            var url=isCopy?PAROX.CONFIG.REQUEST_URL.COPY:PAROX.CONFIG.REQUEST_URL.MOVE;
            var model=this.model;
            var operationText=isCopy?'复制':'移动';
            var docId=model.get('docId');
            var target=[];
            var optionKey='docs';
            var success=function(){
                PAROX.message(operationText+'文件成功！');
            };
            var callback=function(attr){
                attr[optionKey]=''+docId;
                request(url,attr, _.bind(success,this));
            };

            this.copyWindow.set({
                target:target,
                title:operationText,
                confirmText:operationText,
                targetType:'file',//移动或复制目标的类型，folder或是file,hybrid混合的
                onConfirm: _.bind(callback,this)
            }).show();
        },
        rename:function(){
            if(!this.checkPermission()){
                return false;
            }
            var model=this.model;
            this.renameWindow.set({
                category:'file',
                model:model,
                onConfirm:function(attr){
                    model.save(attr);
                }
            }).show();
        },
        doDelete:function(){
            if(!this.checkPermission()){
                return false;
            }
            var data={docId:this.model.get('docId')};
            var callback= function(){
                    PAROX.ajax({
                        url:PAROX.CONFIG.REQUEST_URL.FILE_RECYCLE,
                        type:'POST',
                        data:data,
                        success: _.bind(function(resp){
                            if(resp.success){
                                PAROX.message('删除文件成功！');
                                this.removeParentViewModel(data);
                                //this.removeThisModel(data);
                                //this.imageWrap.flexslider('next');

                            }else{
                                PAROX.alert('删除文件失败!');
                            }
                        },this)
                    });
                };
            PAROX.confirm('您确定要删除此文件吗？', _.bind(callback,this));
        },
        toggleSideBar:function(e){
            var $this=this.$(e.currentTarget).find('span');
            var sideBar=this.$('[data-behavior="viewer-content"]');
            if(sideBar.hasClass('sidebar-out')){
                sideBar.removeClass('sidebar-out').addClass('sidebar-in');
                $this.removeClass('icon-12-sidein').addClass('icon-12-sideout');
            }else{
                $this.removeClass('icon-12-sideout').addClass('icon-12-sidein');
                sideBar.removeClass('sidebar-in').addClass('sidebar-out');
            }

        },
        removeThisModel:function(condition){
            try{
                var collection=this.collection;
                var model=collection.findWhere(condition);
                collection.remove(model);
            } catch (e){}
        },
        removeParentViewModel:function(condition){
            try{
                var collection=this.parent.documents;
                var model=collection.findWhere(condition);
                collection.remove(model);
            }catch (e){}
        },
        onViewerClick:function(e){
            this.closeDropDown();
            e.stopPropagation();
        }
	});
});