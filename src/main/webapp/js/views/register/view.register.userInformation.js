/**
 *
 * Created by hetao on 2014/10/15.
 */
define('views/register/view.register.userInformation',['parox'],function(require){
	var PAROX = require('parox');
    var tpl=PAROX.$('#register-userInformationTpl');
	var userInformationTpl	= tpl.html()||'<br>';
        //tpl.remove();
	//var registerModel	= new PAROX.model.RegisterModel();

	var RegisterUsrInformationView =  PAROX.Backbone.View.extend({
		el:'#p-register',
		//model:registerModel,
		viewName:'registerUserInformation',
		template:PAROX._.template(userInformationTpl),
		events:{
			'keyup input':'onInputKeyUp',
			'blur input':'onInputKeyUp'
		},
		initialize:function(){
			this.listenTo(this.model,'invalid',function(model,msg){
				if(msg.usernameStatus){
					this.$('#username').removeClass('has-error').addClass('has-success').next('div').fadeOut(2000).html(msg.usernameInfo);
				}else{
					this.$('#username').addClass('has-error').next('div').show(200).html(msg.usernameInfo);
					return false;
				}

				if(msg.passwordStatus){
					this.$('#password').removeClass('has-error').addClass('has-success').next('div').fadeOut(2000).html(msg.passwordInfo);
				}else{
					this.$('#password').addClass('has-error').next('div').show(200).html(msg.passwordInfo);
					return false;
				}

				if(msg.passwordStatus){
					this.$('#password').removeClass('has-error').addClass('has-success').next('div').fadeOut(2000).html(msg.passwordInfo);
				}else{
					this.$('#password').addClass('has-error').next('div').show(200).html(msg.passwordInfo);
					return false;
				}
			});
			this.render();
		},
		render:function(){
			var html=this.template();
			this.$el.html(html);
			return this;
		},
		onInputKeyUp:function(e){
			var value = {usename:this.username,password:this.password,verfiyPassword:this.verfiypassword,organization:this.organization};
			this.model.set(value,{validate:true});
		}
	});

	return new RegisterUsrInformationView();
});