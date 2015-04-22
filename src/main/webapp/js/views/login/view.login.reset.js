/**
 * file reset password
 * Created by hetao on 2014/11/10.
 */

define('views/login/view.login.reset',['parox','jquery','config'],function(require){
	'use strict';
	var PAROX	= require('parox');
	var $		= require('jquery');
	var CONFIG	= require('config');
	var resetPasswordModel	= new PAROX.models.ResetPasswordModel();

	var ResetView =  PAROX.Backbone.View.extend({
		el:'#p-reset',
		model:resetPasswordModel,
		viewName:'resetPassword',
		events:{
			'input input':'onPassWordVerifyMsg',
			'blur input':'onPassWordVerifyMsg',
			'submit form':'onFormSubmit',
			'click [data-behavior="show-password"]':'onShowPassword'
		},
		initialize:function(){
			this.listenTo(this.model,'invalid',function(model,msg){
				if(msg.passwordStatus){
					this.$('#password').parent('div').removeClass('has-error').addClass('has-success').find('.verifytip').html(msg.passwordInfo);
				}else{
					this.$('#password').parent('div').addClass('has-error').removeClass('has-success').find('.verifytip').html(msg.passwordInfo);
					return false;
				}

				/*if(msg.passwordConfirmStatus){
					this.$('#passwordConfirm').parent('div').removeClass('has-error').addClass('has-success').find('.verifytip').html(msg.passwordConfirmInfo);
				}else{
					this.$('#passwordConfirm').parent('div').addClass('has-error').removeClass('has-success').find('.verifytip').html(msg.passwordConfirmInfo);
					return false;
				}*/
			});

			this.render();
		},
		render:function(){
			return this;
		},
		onPassWordVerifyMsg:function(){
			//if(this.$el.find('.has-error').length>0){
				this.onInputKeyUp();
			//}
		},
		onInputKeyUp:function(){
			var _password 			= this.$el.find('#password').val();
//			var _passwordConfirm	= this.$el.find('#passwordConfirm').val();
			var value = {password:_password}; //,passwordConfirm:_passwordConfirm
			this.model.set(value,{validate:true});
		},
		onFormSubmit:function(){
			this.onInputKeyUp();
			var _this = this;
			if(this.$('.has-error').length>0){
				return this;
			}else{
				this.$('button[type="submit"]').html('正在保存');
				$.ajax({
					url:CONFIG.REQUEST_URL.LOGIN + 'doReset/',
					type:'get',
					data:this.$("form").serialize(),
					success:function(d){
						if(d.success){
							_this.$('[data-behavior="state-box"]').html('<div class="f-s-18 text-center l-h-3 m-5-t-p"><span class="icon-check"></span>密码修改成功，<a href="'+ CONFIG.ROOT + '/login/" >马上登录</a></div>');
						}else{
							_this.$('[data-behavior="state-box"]').html('<div class="f-s-18 text-center l-h-3 m-5-t-p"><span class="icon-error"></span>密码修改失败，<a href="' + CONFIG.ROOT + '/login/recover/" >重新修改</a></div>');
						}
					}
				});
			}
		},
		onShowPassword:function(){
			var type=this.$('[name=password]').attr('type')=='password'?'text':'password';
			this.$('[name=password]').prop('type',type);
		}
	});

	return new ResetView();

});