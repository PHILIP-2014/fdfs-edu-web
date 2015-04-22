/**
 * file: recover password
 * Created by hetao on 2014/11/7.
 */

define('views/login/view.login.recover',['parox','jquery','config','views/login/view.login.resend'],function(require){
	var PAROX	= require('parox');
	var $		= require('jquery');
	var CONFIG	= require('config');

	var recoverPasswordModel	= new PAROX.models.RecoverPasswordModel();
    var ResendView = require('views/login/view.login.resend');
	var recoverPasswordView =  PAROX.Backbone.View.extend({
		el:'#p-recover',
		model:recoverPasswordModel,
		viewName:'recoverPassword',
		events:{
			'submit form#recover':'accountFormSubmit',
			'input input#email':'onInputEmailVerifyMsg'
		},
		initialize:function(){
			this.listenTo(this.model,'invalid',function(model,msg){
				if(msg.status){
					this.$('#email').parent('div').removeClass('has-error').addClass('has-success').find('.verifytip ').html(msg.info);
					return true;
				}else{
					this.$('#email').parent('div').addClass('has-error').removeClass('has-success').find('.verifytip ').html(msg.info);
					return false;
				}
			});

			this.render();
			$('.btn-login').on('click',function(){
				location.replace(CONFIG.REQUEST_URL.LOGIN);
			});
		},
		render:function(){
			return this;
		},
		onInputEmailVerifyMsg:function(){
			if(this.$el.find('.has-error').length>0){
				this.onInputEmailVerify();
			}
		},
		onInputEmailVerify:function(){
			var _val= this.$el.find('#email').val();
			$('#temp-email').val(_val);
			var value = {email:_val};
			this.model.set(value,{validate:true});
			return this;
		},
		onSubmitSendActive:function(e){
			$.ajax({
				url:CONFIG.REQUEST_URL.LOGIN+'recover/send/',
				async:false,
				type:'get',
				data:{target:e},
				success:function(d){}
			});
		},
		accountFormSubmit:function(){
			this.onInputEmailVerify();
            var input=this.$('input#email');
			if(this.$el.find('.has-error').length>0){
				return false;
			}else{
				var email	= input.val();
                input.attr('readonly','true');
                this.$('button[type="submit"]').html('正在发送');
                this.onSubmitSendActive(email);
				 new ResendView({email:email});
			}

		}
	});

	return new recoverPasswordView();
});