/**
 * fileName:添加标签视图
 * createdBy:Bealiah
 * date:2014/12/26
 */
define('viewCommon/view.add.labels',['parox','collection/collections'],function(require){
    var PAROX=require('parox');
    var _=PAROX._;
    var $=PAROX.$;
    var Dialog=PAROX.component.Dialog;
    var collection=require('collection/collections');
    var tpl=$('#labels-add-dialogTpl');
    var popTpl=tpl.html() || '<br>';
    var itemTpl="<a href=\"javascript:;\"><%=model.get('tagName')%></a>";
    var settedLabelTpl='<%=model.get(\'label\') || model.get(\'tagName\')%>' +
                            '<span data-behavior="remove">&times;</span>';
    var verLabel=PAROX.util.validate.verLabel;
    var Label=PAROX.Backbone.Model.extend({
        validate:function(attr,collection){
            var label=attr.label;
            var arr=[];
            collection.each(function(model,index){
                arr[index]=model.get('label');
             },this);
            if(_.indexOf(arr,label)!=-1){
                return '已存在该标签！';
            }
            if(label){
                if(!verLabel(label)){
                    return '标签不能输入特殊符号！';
                }
            }
        }
    });
    var LabelsCollection=PAROX.Backbone.Collection.extend({
        model:Label
    });
    // 下拉标签列表的项视图
    var DropDownItemView=PAROX.ManageView.extend({
        tagName:'li',
        template: _.template(itemTpl),
        render:function(){
            this.$el.html(this.template({model:this.model}));
            return this;
        },
        events:{
            'click':'onLiClick'
        },
        onLiClick:function(e){
            var model=this.model;
            this.parent.collection.add({label:model.get('tagName')});

        }
    });
    //要添加的标签的项视图
    var AddItemView=PAROX.ManageView.extend({
        tagName:'div',
        className:'bd-gray display-in p-3 bdr-5 cur-p m-b-3 m-r-3',
        attribute:{
            'data-behavior':'label-block'
        },
        isCheck:'false',
        template: _.template(settedLabelTpl),
        initialize:function(){
            this.listenTo(this.model,{
                remove:this.remove,
                'change:isCheck':function(model,isCheck){
                    if(isCheck){
                        this.$el.addClass('high-light');
                    }else{
                        this.$el.removeClass('high-light');
                    }

                }
            });
        },
        render:function(){
            return this.$el.html(this.template({model:this.model}));
        },
        events:{
            'click [data-behavior="remove"]':'onRemoveBtnClick'
        },
        onRemoveBtnClick:function(){
            this.parent.collection.remove(this.model);
        }
    });
    var AddLabelsView=Dialog.extend({
        template: _.template(popTpl),

        attributes:{
            tabindex:-1,
            role:'dialog',
            'aria-labelledby':'文件标签',
            'aria-hidden':true
        },
        initialize:function(){
            this.labelList=new collection.LabelList();
            this.labelModel=new Label();
            this.collection=new LabelsCollection();//新标签列表
            this.__viewModel=new PAROX.models.DialogModel({
                title:'文件标签',
                confirmText:'保存',
                isDoc:true,
                onShow: _.bind(function(){
                    this.collection.reset();
                    var viewModel=this.__viewModel;
                    var type=viewModel.get('type');
                    var cat=type=="folder"|| type=="file"?1:2;
                   this.labelList.fetch({
                       data:{
                           cat:cat,
                           spaceId:viewModel.get('spaceId')
                       },
                       remove:true,
                       reset:true
                   });
                    var str=this.__viewModel.get('beSettedLabels');
                    if(!str)return;
                    var attr=str.split(',');
                    for(var i= 0,len=attr.length;i<len;i++){
                        this.collection.add({label:attr[i]});
                    }
                    this.len=this.collection.length;
                    this.$('input[name="label"]').focus();
                },this)
            });
            this.listenTo(this.__viewModel,{
                invalid:function(model,msg){
                    $.error(msg);
                }
            });
            this.listenTo(this.labelModel,{

                invalid:function(model,msg){
                    this.showErrorMessage(msg);
                }
            });
            this.listenTo(this.collection,{
                add:function(model){
                    this.addOne(model);
                   // this.toggleSubmitBtn(true);
                },
                reset:this.renderAddList,
                remove:function(model,collection){

                    this.toggleSubmitBtn(true);
                }
            });
            this.listenTo(this.labelList,'reset',this.renderLabelList);
            this.events= _.extend({
                'submit form':'onFormSubmit',
                'click [data-behavior="add-labels"]':'onAddLabelClick',
                'input [name="label"]':'onLabelInput',
                'click [name="label"]':'onLabelInputClick',
                'focusout [name="label"]':'onLabelInputFocusOut',
                'focusin [name="label"]':'onLabelInputFocusIn',
                'keypress [name="label"]':'onLabelInputKeypress',
                'keydown [name="label"]':'onLabelInputKeydown'
            },this.events);
            this.__isDisplay=false;

        },
        renderAddList:function(){
            if(this.collection.length>0){
                this.collection.each(this.addOne,this);
            }

        },
        addOne:function(model){
            var addItemView=new AddItemView({model:model,parent:this});
            this.$('[data-behavior="label-setted"]').append(addItemView.render());
        },
        renderLabelList:function(){
            if(this.labelList.length==0) return false;
            this.labelList.each(this.addLabelItem,this);
        },
        addLabelItem:function(model){
            var itemView=new DropDownItemView({model:model,parent:this});
            this.$('[data-behavior="label-list"]').append(itemView.render().$el);
        },
        clearList:function(){
            this.$('[data-behavior="label-list"]').empty();
            return this;
        },
        render:function(){
            this.$el.html(this.template({model:this.__viewModel})).appendTo('body');

        },
        onAddLabelClick:function(e){
            var $this=this.$(e.currentTarget);
                $this.hide().closest('[data-behavior="form-wrap"]').addClass('bd-gray');
                $this.siblings('input[name="label"]').removeClass('display-un').prop('disabled',false).focus();

        },
        onLabelInput:function(e){
            var val= $.trim(this.$(e.currentTarget).val());


            var len=this.collection.length;
            if(val=="" && len>0){
                this.toggleSubmitBtn(true);
                this.showErrorMessage('');
                return;
            }
            this.set({keyWord:val});
            var attr={label:val};
            var msg=this.labelModel.validate(attr,this.collection);
            if(msg){
                this.showErrorMessage(msg);
                this.toggleSubmitBtn(false);
            }else{
                if(val!=""){
                    this.toggleSubmitBtn(true);
                }

                this.showErrorMessage('');
            }
        },
        onLabelInputKeydown:function(e){
            var keyCode= e.which;
            var $this=this.$(e.currentTarget);
            var val=$this.val();
            var collection=this.collection;
            var len=collection.length;
            if(len>0){
                var model=this.collection.at(len-1);
            }
            if(keyCode==8 && val=="" && len>0 && collection.where({isCheck:true}).length>0){
                this.collection.remove(model);
            }
            else if(keyCode==8 && val=="" && len>0){
                model.set({isCheck:true});
            }

            if(val!=''&& len>0){
                model.set({isCheck:false});
            }
        },
        onLabelInputClick:function(e){
            if(this.labelList.length>0){
                this.openDropDown();
            }
            this.__viewModel.set('keyWord','');
            e.stopPropagation();
        },
        onLabelInputFocusOut:function(e){
            var $this=this.$(e.currentTarget);
            var isValid=this.handleValue($.trim($this.val()));
            if(isValid){
                $this.val('');
            }
            if(e.relatedTarget){
                if(e.relatedTarget.type=="submit"){
                    this.$('form').submit();
                }
            }
        },
        onLabelInputFocusIn:function(e){
            this.openDropDown();
        },
        onLabelInputKeypress:function(e){
            var keyCode= e.which;
            var $this=this.$(e.currentTarget);
            var val=$.trim($this.val());
            var len=this.collection.length;
            if(keyCode==13){
                var isValid=this.handleValue(val);
                if(isValid){
                    $this.val('');
                }
                e.preventDefault();
            }

            if(keyCode==8 && val=="" && len>0){
                var model=this.collection.at(len-1);
                this.collection.remove(model);
            }
        },
        handleValue:function(val){
            var len=this.collection.length;
            if(val=="" && len>0){
                this.toggleSubmitBtn(true);
                return true;
            }else if(val=="" && len==0){
                this.toggleSubmitBtn(false);
                return false;
            }
            var attr={label:val};
            var msg=this.labelModel.validate(attr,this.collection);
            if(msg){
                this.showErrorMessage(msg);
                this.toggleSubmitBtn(false);
                return false;
            }else{
                this.collection.add(attr);
                this.toggleSubmitBtn(true);
                return true;
            }
        },
        closeDropDown:function(){
            this.$('[data-behavior="label-list"]').parent().removeClass('open');
            return this;
        },
        openDropDown:function(){
            this.$('[data-behavior="label-list"]').parent().addClass('open');
            return this;
        },
        onFormSubmit:function(e){
            var labels='',
                val= $.trim(this.$(e.currentTarget).val());
            var len=this.collection.length;
            labels=this.collection.pluck('label');
            if(val){
                labels.push(val);
            }

            labels=labels.join(',');
            var model=this.__viewModel.get('model');
            if(this.__viewModel.get('type')!='folder'){
                delete model.attributes.creater.nickName;
                delete model.attributes.creater.displayName;
                delete model.attributes.creater.url;
            }

            model.save({
                labels:labels
            },{
                wait: true
            });
            this.get('onConfirm')(this);
            e.preventDefault();
        },
        onPanelClick:function(){
            this.closeDropDown();
        },
        toggleSubmitBtn:function(isDisabled){
            this.$('[type="submit"]').prop('disabled',!isDisabled);
            return this;
        },
        showErrorMessage:function(msg){
            this.$('[data-behavior="notification"]').html(msg);
        }

    });
    return new AddLabelsView();
})