/**
 * file recover password resend email information
 * Created by hetao on 2014/11/7.
 */

define('views/login/view.login.resend',['parox','jquery','config'],function(require){
	var PAROX 	= require('parox');
	var $		= require('jquery');
	var CONFIG	= require('config');

    var resendTmp ='<div style="width: 400px; margin: 20px auto;">' +
                        '<div class="panel">' +
                            '<div class="panel-body">' +
                                '<div class="m-t-20 text-center">' +
                                    '<img src="/images/images1.6/login-sendmail.png" />' +
                                '</div>' +
                                '<div class="well well-sm bd-un bdr-5 m-20 text-center">' +
                                    '<a href="javascript: void(0);" data-behavior="email-link" data-type="show-email"></a>' +
                                '</div>' +
                                '<p class="m-20 f-s-20 text-center">密码重置电子邮件已发送</p>' +
                                '<p class="m-20">' +
                                    '请前往您的邮箱<a href="javascript:void(0);" data-behavior="email-link">查看邮件</a>' +
                                    '， 对账号进行激活。若没有收到邮件，请检查您的垃圾邮件。或者让系统' +
                                    '<a href="javascript:void(0);" data-behavior="resend-code">重新发送</a> 激活邮件。' +
                                '</p>' +
                                '<div class="form-group m-l-30 m-r-30">' +
                                    '<a href="/login/recover/" class="btn-link">返回重置密码</a>' +
                                '</div>' +
                            '</div>' +
                       '</div>' +
                       '<div class="text-center p-t-20">' +
                        '密码想起来了？' +
                        '<a href="/login/">登录</a>' +
                       '</div>' +
                    '</div>';
	return PAROX.Backbone.View.extend({
		el:'#p-recover',
		viewName:'recoverResend',
		template:PAROX._.template(resendTmp),
		events:{
			'click [data-behavior="resend-code"]':'onClickResendCode'
		},
		initialize:function(){
			this.render();
		},
		render:function(){
			this.$el.html(this.template());
			var email=this.email;
			var url= email.split('@')[1];

			this.$('[data-behavior="email-link"]').prop('href',CONFIG.EMAIL_HASH[url]);
			this.$('[data-type="show-email"]').html(email);
			return this;
		},
		//重新发送验证码
		onClickResendCode:function(){
			var _this = this;
			$.ajax({
				url:CONFIG.REQUEST_URL.LOGIN+'recover/send/',
				async:false,
				type:'get',
				data:{target:this.email},
				success:function(d){
					_this.$('[data-behavior="resend-code"]').html('已经发送').addClass('text-muted').removeClass('opt-resendCode');
				}
			});
		}
	});
});