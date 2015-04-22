/**
 * fileName:离开组织提示面板
 * createdBy:William
 * date:2014/9/30
 */
define('viewCommon/view.leave.org',['parox','collection/collections'],function(require){
	'use strict';
	var PAROX=require('parox');
	var _=PAROX._;
	var $=PAROX.$;
	var util=PAROX.util;
	var Dialog=PAROX.component.Dialog;
    var collection=require('collection/collections');
    var  MemberList=collection.MemberList;
    var verEmail=PAROX.util.validate.verEmail;
    var memberItemTpl='<a href="javascript:;">'+
        '<img src="<%=model.get(\'smallPhoto\')%>" class="img-20X20 m-r-3">'+
        '<span><%=model.getEmail()%></span>'+
        '</a>';
    var tpl=PAROX.$('#leave-org-panelTpl');
	var leaveOrgTpl=tpl.html()||'<br>';
        //tpl.remove();
    var Member=PAROX.Backbone.Model.extend({
        validate:function(attr){
            if(attr.email){
                if(!verEmail(attr.email))
                    return '邮箱格式不正确，请重新输入！';
            }
        },
        getEmail:function(){
            return this.get('email');
        }
    });
    var MemberView=PAROX.View.extend({
        tagName:'option',
        template: _.template(memberItemTpl),
        initialize: function () {

        },
        render: function () {
            return this.$el.val(this.model.get('userId')).text(this.model.get('realName'));
        },
        events:{
            'click':'onChooseMemberClick'
        },
        onChooseMemberClick:function(){
            var email=this.model.get('email');
            this.input.prop('value',email);

        }
    });

	return Dialog.extend({
		attributes:{
			tabindex:-1,
			role:'dialog',
			'aria-labelledby':'离开组织',
			'aria-hidden':true
		},
		template:_.template(leaveOrgTpl),
        orgId:'',
        memberList:new MemberList(),
		initialize:function(option){
            //this.memberList=new MemberList();
            this.newList=this.memberList;
            this.model=new Member();

            this.__viewModel=new PAROX.models.DialogModel({
                title:'离开组织',
                confirmText:'确定离开组织',
                type:'danger',
                category:'组织',
                keyWord:null,
                onHide: _.bind(function(){
                    this.set({keyWord:null},{silent:true});
                    this.memberList.reset();
                },this),
                onShow: _.bind(this.fetch,this)
            });


            this.listenTo(this.memberList,{
                    reset:this.updateMemberList
            });
            this.listenTo(this.__viewModel,{
                invalid:function(model,msg){
                    $.error(msg);
                },
                'change:keyWord':function(model,key){
                    this.cleaMembers()
                        .search(key);
                }
            });
            this.__isDisplay=false;
            this.set(option,{validate:true});
            this.success=true;
            this.events= _.extend({
                'input [data-behavior="email-input"]': 'onEmailInput',
                'click [data-behavior="email-input"]': 'onEmailInputClick',
                'focusout [data-behavior="email-input"]': 'onEmailInputFocusOut',
                'focusin [data-behavior="email-input"]': 'onEmailInputFocusIn',
                'keypress [data-behavior="email-input"]': 'onEmailInputEnter'
            },this.events);
		},
		isEditable:function(){
			this.get('onConfirm')(this.__viewModel,this);
		},
        fetch:function(){
            this.memberList.fetch({
                data:{
                    isOuter:false,
                    orgId:this.get('orgId')
                },
                reset:true,
                remove:true
            });
        },
        updateMemberList:function(){
            this.$('[name="userId"]').empty();
            var me =this.memberList.where({userId:PAROX.USER_ID});
            this.memberList.remove(me);
            if(this.memberList.length>0){
                this.memberList.each(this.addOneMember,this);
            }else{
                this.$('[name="userId"]').append('<option>没有匹配的组织员工！</option>');
                this.toggleSubmitBtn(false);
            }
            return this;
        },
        addOneMember:function(model){
            this.itemView=new MemberView({model:model,input:this.input});
            this.$('[name="userId"]').append(this.itemView.render());
        },
        showErrorMessage:function(msg){
            this.$('[data-behavior="notification"]').html(msg);
        },
        onEmailInputClick:function(e){
            this.openDropDown();
           // this.__viewModel.set('keyWord','');

            e.stopPropagation();
        },
        onEmailInput:function(e){
            var value= $.trim(this.$(e.currentTarget).val());
            this.set({keyWord:value});
            this.toggleSubmitBtn(false);
            var attr={email:value};
            var msg=this.model.validate(attr);
            if(msg){
                this.showErrorMessage(msg);
            }

        },
        onEmailInputFocusIn:function(e){
            this.toggleSubmitBtn(false);
        },

        onEmailInputFocusOut:function(e){
            var $this=this.$(e.currentTarget);
            var value= $.trim($this.val());
            if(value===''&&this.memberList.length>0){
                this.toggleSubmitBtn(true);
                return;
            }else{
                this.toggleSubmitBtn(false);
                return;
            }
            var attr={email:value};
            var msg=this.model.validate(attr);
            if(msg){
                this.showErrorMessage(msg);
            }else{
                this.model.set({email:value});
                this.closeDropDown();
            }
            this.toggleSubmitBtn(!!!msg);

        },
        onConfirmBtnClick:function(){
            var values=this.$('form').serializeArray();
            var attr=PAROX.util.convertArrayToObject(values);
            //第一步，移交管理权

            this.get('onConfirm')(attr);
            this.hide();
            //成功之后，离开组织

        },
        onEmailInputEnter:function(e){
            if(e.which===13){
                var $this=this.$(e.currentTarget);
                var val= $.trim($this.val());
                var attr={email:val};
                var msg=this.model.validate(attr);
                if(msg){
                    this.showErrorMessage(msg);
                }else{
                    this.model.set({email:val});
                    this.closeDropDown();
                }
                e.preventDefault();
            }
        },
        clearInput:function(){
            this.$('[data-behavior="email-input"]').val('');
        },
        onPanelClick:function(){
            this.closeDropDown();
        },
        openDropDown:function(){
            this.newList.reset(this.memberList.toArray());
            this.$('[data-behavior="collaborator-list"]').addClass('display-b');

            return this;
        },
        closeDropDown:function(){
            this.$('[data-behavior="collaborator-list"]').removeClass('display-b');
        },
        search:function(key){
            if(this.success){
                this.success=false;
                this.selectMember(key);
                this.success=true;
            }
        }

	});
});