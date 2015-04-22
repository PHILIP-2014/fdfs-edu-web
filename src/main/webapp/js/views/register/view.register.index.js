/**
 * file：register
 * Created by hetao on 2014/9/9.
 */

define('views/register/view.register.index',['parox','jquery','config','views/register/view.register.active'],function(require){
    var PAROX	= require('parox');
    var $		= require('jquery');
    var CONFIG	= require('config');
    var tpl=PAROX.$('#register-accountTpl');
    var registerTpl=tpl.html()||'<br>';
    //tpl.remove();
    var registerModel			= new PAROX.models.RegisterModel();
    var RegisteActiveView = require('views/register/view.register.active');
    var RegisterView=PAROX.Backbone.View.extend({
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
            'submit form#registerForm':'onSubmitForm',
            'input input[data-behavior="register-input"]':'onInput',
            'input input[data-type="password"]':'onInput',
            'click [data-behavior="show-password"]':'onShowPassword',
            'click input[name="agreement"]':'onCheckBoxClick'
        },
        onSubmitForm:function(e){
            var values= this.$(e.currentTarget).serializeArray();
            var attr=PAROX.util.convertArrayToObject(values);
            delete attr.agreement;
            var email=attr.email;
            var msg=this.model.validate(attr);
            var url	=email.split('@')[1];
            var urlComponent=CONFIG.EMAIL_HASH[url];
            if(msg){
                this.remindTip(msg,this.$('[data-type="'+msg.interfix+'"]'));
                return false;
            }
            PAROX.ajax({
                 url:'/register/doRegister/',
                 type:'POST',
                 data:attr,
               success:function(){
                   window.location.href="/register/success?email="+email;
                }
            });
            e.preventDefault();


        },
        toggleSubmitBtn:function(isDisabled){
            this.$('[data-behavior="submit-btn"]').prop('disabled',!isDisabled);
        },
        onInput:function(e){
            var input=this.$(e.currentTarget);
            var val= $.trim(input.val());
            if(!val){
                input.parent().removeClass('has-error').find('.verifytip').empty();
                return;
            }
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
return new RegisterView();
});