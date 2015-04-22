/**
 * file：register
 * Created by hetao on 2014/9/9.
 */

define('views/register/view.register.account',['parox','jquery','config','views/register/view.register.active'],function(require){
	var PAROX	= require('parox');
	var $		= require('jquery');
	var CONFIG	= require('config');
    var tpl=PAROX.$('#register-accountTpl');
	var registerTpl=tpl.html()||'<br>';
        //tpl.remove();
	var registerModel			= new PAROX.models.RegisterModel();
    var RegisteActiveView = require('views/register/view.register.active');
	return PAROX.Backbone.View.extend({
        el:'#p-register',
        viewName:'account',
        model:registerModel,

        /*template:PAROX._.template(registerTpl),
        initialize:function(){
            this.render();
        },
        render:function(){
            this.$el.html(this.template());
            return this;
        },*/
        events:{
            'submit form':'onSubmitForm',
            'input input[type="text"]':'onInput',
            'input input[type="password"]':'onInput',
            'click [data-behavior="show-password"]':'onShowPassword',
            'click input[name="agreement"]':'onCheckBoxClick'
        },
        onSubmitForm:function(e){
            var values= this.$(e.currentTarget).serializeArray();
            var attr=PAROX.util.convertArrayToObject(values);
            delete attr.agreement;
            var email=attr.email;
            var msg=this.model.validate(attr);
            if(msg){
                this.remindTip(msg,this.$('[name="'+msg.interfix+'"]'));
                return false;
            }
            this.getSpaceCode(attr);

            PAROX.ajax({
                url:'/register/doRegister/',
                type:'POST',
                data:attr,
                success:function(){
                    //location.replace('/register/');
                    new RegisteActiveView({email:email});
                },
            });
            e.preventDefault();


        },
        getSpaceCode:function(attr){
            var hash=window.location.hash,num,code,href=window.location.href,arr;
            if(hash.indexOf('link')>-1){
                arr=href.split('#');
                num=arr[0].lastIndexOf('/');
                code=arr[0].substring(num+1);
                attr.spaceCode=code;
            }
            if(href.indexOf('returnUrl')>-1){
                arr=href.split('returnUrl=');
                num=arr[1].lastIndexOf('/');
                code=arr[1].substring(num+1);
                attr.spaceCode=code;
            }
        },
        toggleSubmitBtn:function(isDisabled){
            this.$('[data-behavior="submit-btn"]').prop('disabled',!isDisabled);
        },
        onInput:function(e){
            var input=this.$(e.currentTarget);
            var val=input.val();
            var type=input.attr('name');
            var param={};
                param[type]=val;
            var msg=this.model.validate(param);
            this.remindTip(msg,input);

        },
        remindTip: function (msg,input) {
            var parent;
            if(msg){
                parent=input.parent();
                parent.removeClass('has-success').addClass('has-error');
                if(parent.find('.verifytip').length==0){
                    parent.append("<div class='ver-block verifytip bottom top-right'></div>");
                }
                parent.find('.verifytip').html(msg.info);
                this.toggleSubmitBtn(false);
            }else{
                parent=input.parent();
                parent.removeClass('has-error').addClass('has-success').find('.verifytip').remove();
                this.toggleSubmitBtn(true);
            }

        },
        onShowPassword:function(){
            var type=this.$('[name="password"]').attr('type')=='text'?'password':'text';
            this.$('[name="password"]').prop('type',type);
        },
        onCheckBoxClick:function(e){
            var checkbox=this.$(e.currentTarget);
            var isChecked=checkbox.prop('checked');
            this.toggleSubmitBtn(isChecked);
        }
	});

});