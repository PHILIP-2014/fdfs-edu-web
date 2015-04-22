/**
 * fileName:App语言，程序里用到的所有文字都在这里
 * createdBy:William
 * date:2014/8/15
 */
define('lang/zh-CN',function(require){
	'use strict';
	return {
		APP_MODULE:{
			DASHBOARD:'工作台',
			DISCOVERY:'发现',
			CALENDAR:'日历',
			CONTACTS:'联系人',
			SEARCH:'搜索',
			NOTICE:'通知',
			ACCOUNT:'我的帐户',
			ORGANIZATION:'组织',
			WORK_SPACE:'空间'
		},
		DISCOVERY_MODULE:{
			TASK:'任务',
			DOCUMENT:'文件'
		},
		ORG:{
			CREATE_ORG_SUCCESS:'创建组织成功！'
		},
		WORK_SPACE:{
			SPACE_MENU_TIP:'选择一个工作空间',
			NEW_SPACE:'新建空间',
			CREATE_SPACE:'创建空间'
		},
		BTN_TEXT:{//按钮文字
			CONFIRM:'确定',
			CANCEL:'取消',
			UPGRADE:'升级',
			BUY:'购买',
			COPY:'复制',
			MOVE:'移动'
		},
		REQ_MESSAGE:{//请求提示信息
			ERROR:'请求发生错误！请稍后再试......',
			SUCCESS:'请求成功!'
		},
		DATE_ERROR:{
			INVALID_YEAR:'不合法的年份!年份不能小于今年。',
			INVALID_MONTH:'不合法的月份！月分不能大于12或小于1'
		},
		DATE_STRING:{
			YEAR:'年',
			MONTH:'月',
			WEEK:'星期',
			DAY:'日',
			HOUR:'时',
			MINUTE:'分',
			SECOND:'秒',
			WEEK_STRING:['天','一','二','三','四','五','六']
		},
		VERLIDATE_STRING:{
			MAX:'最长只能{num}位',
			MIN:'最短只能{num}位',
			EMAIL:'邮件格式不正确',
			MOBILE:'手机格式不正确',
			SPACE:'输入为空',
			TEL:'固定电话格式有误'
		},
		COMMENT:{
			NULL:'评论不能为空!',
			SUCCESS:'添加评论成功！',
			DELETE_CONFIRM:'您确定要删除此评论吗？',
			DELETE_SUCCESS:'删除评论成功！'
		},
		TASK:{
			REORDER_SUCCESS:'任务排序成功!',
			CREATE_SUCCESS:'创建任务成功!',
			DELETE_CONFIRM:'您确定要删除任务：{taskName}吗？',
			DELETE_SUCCESS:'任务删除成功！',
            REMOVE_CONFIRM:'您确定要移除任务：{taskName}吗？',
            REMOVE_SUCCESS:'任务移除成功！',
			UPDATE_PRIORITY_SUCCESS:'修改任务优先级成功！',
			UPDATE_STATUS_SUCCESS:'修改任务状态成功！',
			UPDATE_TASK_NAME_SUCCESS:'修改任务名称成功！',
			UPDATE_DESC_SUCCESS:'修改任务描述成功!',
			UPDATE_END_TIME_SUCCESS:'修改任务截止日期成功！'
		},
		TASK_MODULE_NAME:{
			ALL:'全部任务',
			CREATED_BY_ME:'我创建的任务',
			TRACK_BY_ME:'我跟踪的任务',
			COMPLETE:'已完成的任务'
		},
		CHECK_ITEM:{
			UPDATE_STATUS_SUCCESS:'修改任务检查项状态成功！',
			UPDATE_TITLE_SUCCESS:'修改检查项标题成功！',
			DELETE_CONFIRM:'您确定要删除任务检查项：{title}吗？',
			DELETE_SUCCESS:'删除检查项成功！',
			CREATE_SUCCESS:'添加任务检查项成功！'
		},
		TASK_LABEL:{
			DELETE_CONFIRM:'您确定要删除此任务标签吗？',
			DELETE_SUCCESS:'删除任务标签成功！',
			CREATE_SUCCESS:'添加任务标签成功！'
		},
		DOCUMENT_MODULE_NAME:{
			ALL:'全部文件',
			CREATED_BY_ME:'我创建的',
			SHARED_TO_ME:'共享给我的',
			TASK_ATTACHMENT:'任务附件',
			RECYCLE:'回收站'
		},
        DATES:{
            en: {
                days:        ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                daysShort:   ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                daysMin:     ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
                months:      ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                meridiem:    ["am", "pm"],
                suffix:      ["st", "nd", "rd", "th"],
                today:       "Today"
            },
            'zh-CN':{
                days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
                daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
                daysMin:  ["日", "一", "二", "三", "四", "五", "六", "日"],
                months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一", "十二"],
                monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一", "十二"],
                today: "今日",
                suffix: [],
                meridiem: []
            }
        }
	};
});