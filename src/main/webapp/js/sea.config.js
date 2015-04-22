/**
 * fileName:sea.js配置文件
 * createdBy:William
 * date:2014/8/14
 */
(function(){
	'use strict';
	var timeStamp=150306.4;
	seajs.production=window.location.href.indexOf('parox.cn')>-1;

	seajs.config({
		alias:{//别名
			'jquery':'lib/jquery/jquery.js',
			'backbone':'lib/backbone.js',
			'underscore':'lib/underscore.js',
			'mock':'lib/mock.js',
			'bootstrap':'lib/bootstrap/bootstrap.js',
			'dragSort':'lib/plugin.jquery.dragsort-0.5.1',
			'dateTimePicker':'lib/jquery/plugin.datetimepicker',
			'collection':'collection/collections',
			'zeroClipboard':'lib/zeroclipboard/ZeroClipboard',
            'zTree':'lib/zTree_v3/js/jquery.ztree.core-3.5',
			'zTreeExHide':'lib/zTree_v3/js/jquery.ztree.exhide-3.5',
			'fullCalendar':'lib/fullcalendar/dist/fullcalendar',
			'langAll':'lib/fullcalendar/dist/lang-all',
			'moment':'lib/moment',
			'flexSlider':'lib/flexslider/jquery.flexslider',
			'dropZone':'lib/jquery/plugin.dropzone'
		},
		//配置常用路径
		paths:{
			component:'component/',
			viewCommon:'views/common/',
			taskEdit:'views/common/task-edit',
			viewContacts:'views/member/contacts',
			viewLeftMenu:'views/left-menu',
			viewNotice:'views/notice',
			viewOrganization:'views/organization',
			viewOrg:'views/organization',
			viewMember:'views/member',
			viewCalendar:'views/member/calendar',
			viewDiscovery:'views/member/discovery',
			viewDocument:'views/member/discovery/document',
			viewTask:'views/member/discovery/task',
			viewTopBar:'views/topbar',
			viewUser:'views/user',
			setting:'views/settings',
            viewDashboard:'views/member/dashboard',
			viewWorkSpace:'views/workspace',
            viewSettings:'views/settings',
            viewMessage:'views/message'
		},
		//映射配置
		map:[
			['.js','.js?t='+timeStamp]
		]
	});

	if(seajs.production){
		//生产环境
		seajs.config({
			base:'/dist/',
			comboMaxLength: 2000,
			debug:false
		});
	}else{
		//开发环境
		seajs.config({
			base:'/js/',
			comboExcludes: /.*/,
			debug:true
		});
	}
})();
