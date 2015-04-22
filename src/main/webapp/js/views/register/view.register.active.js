/**
 * file register active information
 * Created by hetao on 2014/9/9.
 */

define('views/register/view.register.active',['parox','jquery','config','collection/collections'],function(require){
	var PAROX 	= require('parox');
	var $		= require('jquery');
	var CONFIG	= require('config');

    var tpl=$('#register-activeEmailTpl');
    var activeTpl=tpl.html() || '</br>';

	return PAROX.Backbone.View.extend({
		el:'#p-register',
		viewName:'active',
		template:PAROX._.template(activeTpl),
		events:{
			'click [data-behavior="resend-code"]':'onClickResendCode',
			'click [data-behavior="turn-dashboard"]':'onTurnDashboardClick'
		},
		initialize:function(){
			this.render();
		},
        onTurnDashboardClick:function(){
        	window.location.href="http://"+location.host+'/main';
//            location.replace('http://'+location.host+'/main$$member/dashboard');
        },
		render:function(){
			var html=this.template();
			this.$el.html(html);
			var email= this.email;
			var url	=email.split('@')[1];
            this.$('[data-behavior="email-url"]').prop('href',CONFIG.EMAIL_HASH[url]);
            this.$('[data-type="show"]').html(email);
			return this;
		},
		//重新发送验证码
		onClickResendCode:function(){
			var _this = this;
			$.ajax({
				url:CONFIG.REQUEST_URL.REGISTER+'sendActive/',
				async:false,
				type:'get',
				data:{email:$('#temp-email').val()},
				success:function(d){
					_this.$('.opt-resendCode').html('已经发送').addClass('text-muted').removeClass('opt-resendCode');
				}
			});
		}
	});
});