/**
 * 注册入口
 * Created by hetao on 2014/10/15.
 */
define('register',['parox','views/register/view.register.account.js'],function(require){
	'use strict';
	var PAROX				= require('parox');

	var RegisterRouter	= PAROX.Backbone.Router.extend({
		routes:{
			'':'switchAccountView'
		},
		initialize:function(){},
		switchAccountView:function(viewName){
			this.switchView(viewName);
		},
		switchView:function(viewName,childView){
			var switchViewInit = require('views/register/view.register.account');
            new switchViewInit();
		}
	});

	var registerRouter = new RegisterRouter();
	PAROX.Backbone.history.start();
});