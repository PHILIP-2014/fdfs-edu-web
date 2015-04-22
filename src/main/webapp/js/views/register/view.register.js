/**
 * 注册入口
 * Created by hetao on 2014/10/15.
 */
define('views/register/view.register',['parox','views/register/view.register.account'],function(require){
	'user strict';
	var PAROX				= require('parox');
    var doRegisterView=require('views/register/view.register.account');
	var registerChildViews=[
        new doRegisterView()
        //require('views/register/view.register.account')
		//require('views/register/view.register.activeEmail.js')
	];

	var registerView		= PAROX.ManageView.extend({
		__viewModel:new PAROX.Backbone.Model({userId:undefined}),
		__childViews:registerChildViews,
		el:'#p-register',
		viewName:'register'
	});

	return new registerView();
});