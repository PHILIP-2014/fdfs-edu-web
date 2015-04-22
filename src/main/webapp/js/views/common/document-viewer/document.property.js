/**
 * fileName:文档版本列表视图
 * createdBy:William
 * date:2014/9/5
 */
define('viewCommon/document-viewer/document.property',['parox'],function(require) {
    'use strict';
    var PAROX=require('parox');
    var $=PAROX.$;
    var _=PAROX._;
    var tpl=PAROX.$('#file-propertyTpl');
    var propTpl=tpl.html()||'<li></li>';


    return PAROX.View.extend({
        tagName:'div',
        template: _.template(propTpl),
        initialize:function(){
            this.__viewModel=new PAROX.Backbone.Model();
            this.model=new PAROX.models.DocumentModel();

            this.listenTo(this.__viewModel,{
                'change:docId':function(model,docId){
                    this.model.set({docId:docId});
                }
            });
            this.listenToModel();
        },
        listenToModel:function(){
            this.listenTo(this.model,{
                sync:function(model){
                    if(!this.model.get('realName')){
                        this.model.fetch({
                            error: _.bind(function(){
                                this.parent.close();
                            },this)
                        });
                    }else{
                        this.render();
                    }
                },
                'change:docName':this.updateDocName,
                'change:remarks':this.updateDesc
            });
            return this;
        },
        updateDocName:function(model,name){
            this.$('[data-behavior="doc-name"]').html(name);
        },
        updateDesc:function(model,desc){
            this.$('[data-behavior="doc-desc"]').html(desc);
        },
        render:function(){
            this.$el.html(this.template({model:this.model}));
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
            'click [data-behavior="edit"]':'onEditBtnClick',
            //'input [data-behavior="edit-box"]':'onInput',
            'focusout [data-behavior="edit-box"]':'onInputFocusOut',
            'keypress [data-behavior="edit-box"]':'onInputKeyPress',
            'submit form':'onFormSubmit'
        },
        onEditBtnClick:function(e){
            var editAble=this.checkPermission();
            if(!editAble){
                PAROX.alert('您没有此文件的编辑权限！');
                return;
            }

            this.$(e.currentTarget).hide().siblings().show().focus().select();
        },
        checkPermission:function(){
            var permission=this.model.get('permission');
            return !(permission===3||permission===4);
        },
        onInputFocusOut:function(e){
            this.saveModel(e);
        },
        onInputKeyPress:function(e){
            if(e.which===13){
                this.saveModel(e);
            }
        },
        saveModel:function(e){
            var $this=this.$(e.currentTarget);
            var val= $.trim($this.val());
            var name=$this.attr('name');
            var attr={};

            if(val){
                attr[name]=val;
                if(this.model.get(name)!==val){
                    this.model.save(attr,{
                        wait:true,
                        success:function(){
                            PAROX.message('保存成功！');
                        }
                    });
                }
            }
            $this.hide().siblings().show();

        },
        onFormSubmit:function(e){
            e.preventDefault();
        },
        clear:function(){
            this.$el.empty();
            return this;
        }
    });
});