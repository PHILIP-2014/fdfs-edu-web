var method={
		GET:"GET",
		POST:"POST",
		PUT:"PUT",
		DELETE:"DELETE"
}

var postType={
		FormData:"application/x-www-form-urlencoded",
		PayLoad:"application/json"
}

var AUTHOR={
	xuww:"许伟伟",
	wangfl:"王腓力",
	luogm:"骆桂明",
	zhuwx:"朱伟兴",
	mays:"马元生",
	zhanggj:"章冠军",
	zhaoby:"赵伯勇"
}

var TEST_PROGRESS=["UNSTART","DEV","INTEGRATION","ALPHA","BETA","PRODUCT","BUGFIX","USELESS"]

var TEST_LEVEL_COLOR=["#999999","#996666","#993300","#FFCC00","#006600","#009900","#FF0000","#FFF000"];

/**
 * {
				pathid:"commentId",
				url:"/core/member/",
				method: method.GET,
				require:[],
				error:[],
				mockdata:"",
				test:false,
				author: AUTHOR.zhuwx
			}
 * */
var urls={
		model:[
		       {	name:"基础公共模块",	k:"url-base-public"},
		       {	name:"基础信息",	k:"url-base"},
		       {	name:"文档模块",	k:"url-folder"},
		       {	name:"日历模块",	k:"url-calendar"},
		       {	name:"任务模块",	k:"url-task"}
		],
		betestUrl:{
			//基础模块
			"url-base-public":[{
				url:"/colla/workspace/inviteFromContacts",
				method: method.POST,
				postType: postType.FormData,
				error:["XXX消息返回有待改进"],
				mockdata:"inviteFromContacts",
				test:2,
				author: AUTHOR.wangfl
			},{
				url:"/common/orgAndSpace.htm",
				method:method.GET,
				postType: postType.FormData,
				test: 2,
				require:["将用户对组织和空间的权限同时返回给前端"],
				author:AUTHOR.mays
			},{
				url:"/common/userRight.htm",
				method:method.GET,
				postType: postType.FormData,
				test: 2,
				author:AUTHOR.luogm
			},{
				url:"/common/mySpace",
				method: method.GET,
				error:["D-获取字段信息不完整","D-orgId等未获取"],
				mockdata:"orgId",
				test:2,
				author: AUTHOR.luogm
			},{
				url:"/colla/team/getSpaceTeam.htm",
				method: method.GET,
				error:["D-返回错误信息不准确","更改空间权限判断方法"],
				mockdata:"spaceId",
				test:2,
				author:AUTHOR.wangfl
			},{
				url:"/core/userProfile/getSpaceUser",
				method: method.GET,
				mockdata:"spaceId",
				test:2,
				error:["提示消息待统一","D-接口未实现"],
				author: AUTHOR.luogm
			},{
				pathid:"userId",
				url:"/core/user/",
				method: method.GET,
				error:["D-返回错误信息不准确"],
				test:2,
				author:AUTHOR.xuww
			},{
				url:"/colla/comment/",
				method: method.POST,
				error:["D-返回Model","D-错误信息未处理"],
				mockdata:"comment",
				test:2,
				author:AUTHOR.luogm
			},{
				url:"/colla/comment/mention",
				method: method.GET,
				error:["D-返回Model","D-错误信息未处理"],
				mockdata:"mention",
				test:2,
				author:AUTHOR.luogm
			},{
				pathid:"commentId",
				url:"/colla/comment/",
				method: method.DELETE,
				error:["D-错误信息未处理"],
				test:2,
				author:AUTHOR.xuww
			},{
				url:"/colla/comment/",
				method: method.GET,
				error:["D-错误信息未处理","D-请求参数错误未处理","获取的数据多于实际需要，此方法无法筛选掉已删除评论的回复"],
				mockdata:"comment.list",
				test:2,
				author:AUTHOR.xuww
			},{
				url:"/colla/activity/getTaskActivity",
				method: method.GET,
				error:["错误信息未处理"],
				test:2,
				author:AUTHOR.luogm
			},{
				url:"/search",
				method: method.GET,
				error:["错误信息未处理"],
				mockdata:"search",
				test:2,
				author:AUTHOR.zhaoby
			},{
				url:"/common/org/tag/",
				pathid:"orgId",
				test:2,
				error:["zhuwx测试成功"],
				author:AUTHOR.xuww
			},{
				url:"/common/area/",
				pathid:"parentId",
				error:["zhuwx测试成功"],
				test:2,
				author:AUTHOR.zhuwx
			},{
				url:"/common/industry/",
				pathid:"parentId",
				test:2,
				error:["zhuwx测试成功"],
				author:AUTHOR.zhuwx
			},
			//空间首页公共请求
			{
				url:"/colla/task/recent/",
				test:2,
				pathid:"spaceId",
				author:AUTHOR.xuww
			},{
				url:"/core/document/recent/",
				pathid:"spaceId",
				test:2,
				author:AUTHOR.luogm
			}
			],
			"url-base":[
			//联系人信息管理
			{
				url:"/colla/contacts/",
				method: method.GET,
				error:["D-排序功能不起作用"],
				test:2,
				author:AUTHOR.luogm
			},{
				url:"/colla/contacts/countMyContacts",
				method: method.GET,
				error:["SQL语句待改进（与查询的join不一致）","D-返回信息不准确","D-返回总数不正确"],
				test:2,
				author:AUTHOR.xuww
			},{
				pathid:"id",
				url:"/colla/contacts/",
				method: method.DELETE,
				error:["D-增加删除方法，避免删除不属于登录用户的联系人",
				       "D-报错：Unknown column 'c.id' in 'field list'",
				       ],
				test:2,
				author:AUTHOR.wangfl
			},
			//组织机构信息设置
			{
				url:"/core/organization/",
				pathid:"orgId",
				method:method.DELETE,
				test:2,
				author:AUTHOR.xuww
			},{
				url:"/core/organization/leaveOrg",
				require:["调用checkLevel"],
				error:["业务逻辑不正确"],
				test:2,
				author:AUTHOR.xuww,
				postType: postType.FormData,
				method:method.GET
			},{
				url:"/core/member/",
				mockdata:"orgId",
				test:2,
				error:["沿用1.5,未检查SQL"],
				author:AUTHOR.luogm
			},{
				url:"/core/organization/leaveStatus",
				mockdata:"orgId",
				error:["D-逻辑判断不正确"],
				test:2,
				author:AUTHOR.luogm
			},{
				url:"/core/member/",
				pathid:"memberId",
				mockdata:"member",
				error:["D-错误信息未处理","D-业务逻辑没有写在service中","D-重新实现service接口"],
				method:method.PUT,
				test:2,
				author:AUTHOR.zhuwx
			},{
				url:"/core/organization/",
				pathid:"orgId",
				error:["*存在与否只要数一数，不用取记录","业务逻辑不正确","权限未判定","日志操作应晚于业务操作","错误信息未按要求返回"],
				test:2,
				mockdata:"organization",
				author:AUTHOR.zhuwx,
				method:method.PUT
			},{
				url:"/core/organization/",
				pathid:"orgId",
				test:2,
				error:["zhuwx: INTEGRATION test success"],
				author:AUTHOR.zhuwx
			},{
				url:"/core/organization/certification/",
				pathid:"orgId",
				test:2,
				author:AUTHOR.zhuwx
			},{
				url:"/core/organization/certification/",
				test:2,
				mockdata:"organization",
				error:["完成的object提交仍然会出错"],
				method:method.POST,
				author:AUTHOR.zhuwx
			},{
				url:"/core/organization/",
				mockdata:"organization",
				test:2,
				method:method.POST
			}
			//组织机构设置
			,{
				url:"/core/orgSetting/",
				pathid:"orgId",
				error:["zhuwx此方法被xx了"],
				test:7,
				method:method.PUT
			},{
				url:"/core/orgSetting/",
				error:["zhuwx测试成功"],
				pathid:"orgId",
				test:7,
				author:AUTHOR.wangfl
			}
			//空间用户管理
			,{
				url:"/colla/team/existsName",
				mockdata:"teamName",
				author:AUTHOR.luogm,
				error:["判定方法写到service去"],
				test:2,
				method:method.POST
			},{
				url:"/colla/team/",
				error:["D-改进名称重复判断方法","D-创建分组的功能没有"],
				test:2,
				author:AUTHOR.luogm,
				mockdata:"team",
				method:method.POST
			},{
				url:"/colla/workspaceUser/",
				pathid:"id",
				error:[
				       "不允许变更自己的管理员权限",
				       "前端应在返回成功后显示/去除管理员标记",
				       "D-更新前需要做一些基本的判断",
				       "D-前端传参不要传user属性，不然报400错误.--zby"
				       ],
				test:2,
				mockdata:"workspaceuser",
				author:AUTHOR.zhuwx,
				method:method.PUT
			},{
				url:"/colla/team/joinFromSpaceUser",
				mockdata:"joinTeam",
				test:2,
				author:AUTHOR.luogm
			},{
				url:"/colla/workspaceUser/",
				pathid:"id",
				test:2,
				author:AUTHOR.zhuwx,
				method:method.DELETE
			},{
				url:"/colla/workspaceUser/",
				mockdata:"spaceId",
				test:2,
				author:AUTHOR.luogm
			},{
				url:"/colla/workspace/inviteFromAny",
				mockdata:"inviteFromAny",
				error:["D- byEmail未实现","D-返回值未正确处理"],
				test:2,
				author:AUTHOR.luogm,
				method:method.POST,
				postType: postType.FormData
			}
			//组织用户管理
			,{
				url:"/colla/workspace/inviteFromMember",
				mockdata:"inviteFromMember",
				test:2,
				author:AUTHOR.wangfl,
				method:method.POST,
				postType: postType.FormData
			},{
				url:"/core/member/",
				pathid:"memberId",
				test:2,
				author:AUTHOR.zhuwx,
				method:method.DELETE
			},{
				url:"/core/organization/statistic/user/",
				test:2
			},{
				url:"/core/organization/statistic/storage/",
				test:2
			}
			//空间设置
			,{
				url:"/colla/workspace/",
				pathid:"spaceId",
				method:method.PUT,
				mockdata:"workspace",
				test:2,
				author:AUTHOR.wangfl
			},{
				url:"/colla/workspace/",
				pathid:"spaceId",
				method:method.DELETE,
				test:2,
				author:AUTHOR.zhuwx
			},{
				url:"/colla/workspace/",
				pathid:"spaceId",
				test:2,
				author:AUTHOR.wangfl
			},{
				url:"/colla/workspace/statistic/",
				error:["D-改进文档数量返回信息"],
				method:method.GET,
				test:2,
				author:AUTHOR.luogm
			}
			//首页
			,{
				url:"/colla/workspace/apply/",
				pathid:"spaceId",
				test:2,
				error:["按照1.5的申请逻辑"],
				author:AUTHOR.xuww
			},{
				url:"/colla/workspace/search/",
				mockdata:"searchSpace",
				test:0,
				method:method.POST,
				postType: postType.FormData,
				author:AUTHOR.luogm
			},{
				url:"/colla/activity/",
				test:2,
				author:AUTHOR.xuww
			},{
				url:"/core/organization/my/",
				test:2,
				author:AUTHOR.xuww
			},{
				url:"/colla/workspace/",
				mockdata:"workspace",
				method:method.POST,
				test:2,
				author:AUTHOR.xuww
			}
			//消息管理
			,{
				url:"/core/systemMessage/",
				pathid:"msgId",
				author:AUTHOR.xuww,
				error:["D-调用方法不对"],
				test:2,
				method:method.PUT
			},{
				url:"/core/systemMessage/",
				pathid:"msgId",
				test:2,
				method:method.DELETE
			},{
				url:"/core/systemMessage/deleteReaded",
				test:2,
				author:AUTHOR.xuww
			},{
				url:"/core/systemMessage/",
				test:2,
				author:AUTHOR.xuww
			},{
				url:"/core/systemMessage/markReaded",
				test:2,
				author:AUTHOR.xuww
			}
			//账户设置
			,{
				url:"/core/userAccount/password/",
				method:method.PUT,
				mockdata:"password",
				test:2,
				author:AUTHOR.xuww
			},{
				url:"/core/userAccount/",
				pathid:"userId",
				test:2,
				author:AUTHOR.xuww
			},{
				url:"/core/userAccount/verifyEmail",
				error:[
				       "D-重新实现 service 接口: userAccountService.sendVerifyEmail",
				       "代码流程正确，整合测试中重点测试"
				],
				postType: postType.FormData,
				test:2,
				author:AUTHOR.zhuwx
			},{
				url:"/core/userAccount/verifyMobile",
				error:[
				       "重新实现 service 接口: userAccountService.sendVerifyEmail zhuwx测试正确",
				       "代码流程正确，整合测试中重点测试"
				],
				postType: postType.FormData,
				test:2,
				author:AUTHOR.zhuwx
			},{
				url:"/core/userAccount/emailVerifyCode",
				postType: postType.FormData,
				test:2,
				mockdata:"emailVerifyCode",
				method:method.POST,
				author:AUTHOR.luogm
			},{
				url:"/core/userAccount/mobileVerifyCode",
				postType: postType.FormData,
				test:2,
				mockdata:"mobileVerifyCode",
				method:method.POST,
				author:AUTHOR.luogm
			},{
				url:"/core/userProfile/",
				pathid:"userId",
				test:2,
				error:["XXX 控制权限，控制获取的信息量"],
				author:AUTHOR.luogm
			},{
				url:"/core/userProfile/",
				pathid:"userId",
				error:[
				       "D-如果更新 real_name，需要同时更新 account 表中的real_name",
				       "增加一个service方法用于处理更新"
				],
				test:2,
				mockdata:"userProfile",
				method:method.PUT,
				author:AUTHOR.luogm
			}
			],
			//文档模块
			"url-folder":[
			//文档管理
			{
				url:"/core/folder/",
				pathid:"folderId",
				test:2
			},{
				url:"/core/folder/",
				mockdata:"folder",
				test:2,
				method:method.POST
			},{
				url:"/core/folder/",
				pathid:"folderId",
				test:2,
				mockdata:"folderUpdate",
				method:method.PUT
			},{
				url:"/core/folder/trash/",
				test:2,
				method:method.POST
			},{
				url:"/core/folder/",
				test:2
			},{
				url:"/colla/workspace/getUserByTeam",
				test:7
			},{
				url:"/core/folder/changePermLevel",
				test:2,
				mockdata:"permLevel"
			},{
				url:"/core/folder/shareToUser",
				test:2,
				mockdata:"permLevel",
				postType: postType.FormData,
				author:AUTHOR.luogm
			},{
				url:"/core/folder/shareToEmail",
				test:2,
				mockdata:"permLevel",
				postType: postType.FormData,
				author:AUTHOR.luogm
			},{
				url:"/core/folder/moveBatch",
				error:["zhuwx mockdata自己加的，测试成功","XXX传入的数据未验证"],
				author:AUTHOR.zhuwx,
				test:0,
				mockdata:"moveBatchFolder"
			},{
				url:"/core/folder/getShareLevel/",
				test:2,
				error:["XXX自己创建的文件夹未做处理"],
				pathid:"folderId"
			},{
				url:"/core/folder/stopShare",
				test:2,
				mockdata:"stopShareFolder"
			},{
				url:"/core/document/version/",
				test:2
			},{
				url:"/core/folder/copyBatch",
				error:["zhuwx mockdata自己加的，测试成功","XXX未验证待移动文件及文件夹的权限"],
				author:AUTHOR.xuww,
				test:0,
				mockdata:"copyBatchFolder"
			},{
				url:"/core/organization/",
				test:7,
				error:["设计未完成"]
			},{
				url:"/core/document/",
				pathid:"docId",
				method:method.PUT,
				test:2,
				author:AUTHOR.wangfl
			},{
				url:"/core/document/",
				error:["D-未做权限控制"],
				test:2,
				pathid:"docId",
				author:AUTHOR.xuww
			},{
				url:"/core/docLink/",
				mockdata:"docLink",
				test:2,
				method:method.POST
			},{
				url:"/core/docLink/",
				pathid:"id",
				test:2,
				method:method.DELETE
			},{
				url:"/core/docLink/sendLink/",
				pathid:"id",
				method:method.POST,
				error:["邮件标题的方案需要改进","测试过程中邮件没有被成功发送"],
				mockdata:"sendTarget",
				test:2,
				author:AUTHOR.wangfl
			},{
				url:"/colla/workspace/docNum/",
				pathid:"spaceId",
				method:method.GET,
				test:2,
				author:AUTHOR.xuww
			},{
				url:"/core/document/attach/",
				pathid:"spaceId",
				test:2,
				method:method.GET,
				author:AUTHOR.xuww
			},{
				url:"/core/folder/path/",
				test:2,
				pathid:"folderId"
			},{
				url:"/core/folder/share/",
				error:["D-根目录文件夹总数计算不正确","?是否包含我创建并分享的"],
				test:2
			},{
				url:"/core/folder/my/",
				test:2
			}
			// 文档管理（回收站）
			,{
				url:"/core/folder/",
				method:method.DELETE,
				error:["zhuwx 测试成功"],
				test:2,
				author:AUTHOR.luogm
			},{
				url:"/core/folder/trash/",
				test:2,
				author:AUTHOR.wangfl
			},{
				url:"/core/folder/revert",
				test:2
			},{
				url:"/core/document/",
				pathid:"docId",
				error:["XXX非回收站状态可否删除"],
				test:2,
				method:method.DELETE
			},{
				url:"/core/document/trash/",
				test:2
			},{
				url:"/core/folder/getSharedUser",
				test:2,
				author:AUTHOR.zhuwx
			}],
			//公共模块
			"url-calendar":[{
				url:"/colla/agenda/",
				error:["D-判断边界缺少两种情况"
				],
				test:2,
				mockdata:"agendaGET",
				author:AUTHOR.wangfl
			},{
				url:"/colla/agenda",
				method:method.POST,
				mockdata:"agenda",
				test:6,
				author:AUTHOR.wangfl
			},{
				url:"/colla/agenda/",
				pathid:"id",
				test:2,
				method:method.DELETE
			},{
				url:"/colla/agenda/",
				pathid:"id",
				error:["D-仍然需要在更新前判断数据正确性（参考添加方法）",
						"D-agenda.getDayOnly().longValue()报空指针错误--zby",
						"工作空间不选择用缺省的提交会报空间ID缺失错误--zby",
						"起止时间缺省是一样的，直接提交会报错--zby"],
				mockdata:"agenda",
				test:2,
				method:method.PUT
			},{
				url:"/colla/agenda/remember/",
				method:method.POST
			}],
			//任务模块
			"url-task":[
			//任务页面（发现）
			{
				url:"/colla/task/",
				pathid:"taskId",
				mockdata:"task",
				method:method.PUT,
				require:["根据action更新"],
				error:["D-将逻辑部分放到service处理"],
				test:3,
				author:AUTHOR.luogm
			},{
				url:"/colla/taskItem/",
				mockdata:"taskId",
				error:["D-没有处理 taskId 不存在或为 0 时候的情况"],
				test:3,
				author:AUTHOR.wangfl
			},{
				url:"/colla/taskUser/",
				mockdata:"taskId",
				error:["D-权限没有控制"],
				test:2,
				author:AUTHOR.xuww
			},{
				url:"/colla/taskItem/",
				pathid:"taskItem",
				mockdata:"taskItem",
				method:method.PUT,
				test:3,
				author:AUTHOR.wangfl
			},{
				url:"/colla/taskUser/",
				pathid:"id",
				error:["业务逻辑不正确"],
				require:["通过 id 获取 taskId","判断当前登录用户是否拥有权限","执行 unAssign 操作","实现接口 taskUserService.doUnAssign(id, user.getUserId());","索引未处理"],
				author:AUTHOR.xuww,
				test:2,
				method:method.DELETE
			},{
				url:"/colla/taskItem/",
				pathid:"itemId",
				error:["D-taskId 需要根据 itemId 获取","整合测试无删除功能"],
				method:method.DELETE,
				test:2,
				author: AUTHOR.wangfl
			},{
				url:"/colla/task/",
				method:method.POST,
				mockdata:"task",
				test:3,
				error:["整合测试：不刷新情况下，无法在我创建的列表中查看新创建的任务"],
				author: AUTHOR.xuww
			},{
				url:"/colla/task/",
				pathid:"taskId",
				test:3,
				author:AUTHOR.wangfl
			},{
				url:"/colla/taskFollow/",
				pathid:"id",
				method:method.DELETE,
				error:["D-流程不正确"],
				test:2,
				author:AUTHOR.wangfl
			},{
				url:"/colla/task/",
				error:["D-没有根据type获取对应任务信息","整合测试时再确认数据正确性"],
				test:2,
				author:AUTHOR.luogm
			},{
				url:"/colla/task/getAgendaTask",
				test:1,
				author:AUTHOR.wangfl
			},{
				url:"/colla/task/doReorder",
				test:2,
				author:AUTHOR.luogm
			},{
				url:"/colla/taskFollow/",
				mockdata:"taskId",
				test:2,
				author:AUTHOR.xuww
			},{
				url:"/colla/task/",
				pathid:"taskId",
				author:AUTHOR.wangfl,
				test:2,
				method:method.DELETE
			},{
				url:"/colla/taskFollow/",
				method:method.POST,
				error:["判断存在与否千万不要取列表数据，只用count即可"],
				test:2,
				mockdata:"taskFollow",
				author:AUTHOR.wangfl
			},{
				url:"/colla/taskUser/",
				method:method.POST,
				mockdata:"taskUser",
				test:2,
				author:AUTHOR.luogm
			},{
				url:"/colla/taskFollow/teamFollow",
				test:7
			},{
				url:"/colla/taskUser/teamAssign",
				test:7
			},{
				url:"/colla/task/path/"
			},{
				url:"/colla/task/statistic/status/"
			},{
				url:"/core/tag/task",
				mockdata:"taskTagCondition",
				test:2,
				author:AUTHOR.luogm
			}],
		},
		/**
		 * key: URL分组
		 * tested: true:显示已测试的，false:仅显示未测试的
		 * */
		get:function(key, test){
			if(typeof test=="undefined"){
				return this.betestUrl[key];
			}
			
			var result=new Array();
			$.each(this.betestUrl[key], function(idx, obj){
//				var tl= typeof obj.test == "undefined"?0: obj.test;
				var tl=obj.test||0;
				
				if(tl==test){
					result.push(obj);
				}
			});
			
			return result;
		}
}


//function initURLS(){
//	var url
//}
//var model = {
//	pathid:"commentId",
//	url:"/core/member/",
//	method: method.GET,
//	require:[],
//	error:[],
//	mockdata:"",
//	test:false,
//	author: AUTHOR.zhuwx
//}