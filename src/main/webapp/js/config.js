/**
 * fileName:
 * createdBy:William
 * date:2014/8/15
 */
define('config',['jquery'],function(require){
	'use strict';
	var $=require('jquery');
	var ROOT='';
	var userInput=$('#user-id');
    var zoomInput=$('#zoom-url');
	var userId=userInput.val();
    var zoomUrl=zoomInput.val();

	userInput.remove();
    zoomInput.remove();
    var TEXT = {
        REG_COUNT: '注册人数',
        LOGIN_COUNT: '登录人数',
        DOC_COUNT: '文档数量',
        TASK_COMPLETE_RATIO: '任务完成率',
        TASK_OVER_DATE: '逾期任务',
        TASK_PROCESS: '进行中的任务',
        TASK_HAS_COMPLETED: '已完成任务',
        ENTERPRISE_COUNT: '协作企业数量'
    };
    var COLOR = {
        LEGEND_TEXT_COLOR: '#999999',
        /*注册统计图颜色*/
        REG_SERIES_LINE_COLOR: ['#ADBAC9', '#3498DB'],//注册图表曲线颜色
        REG_AREA_COLOR_1: 'rgba(226,227,229,0.4)',//注册图表区域颜色
        REG_AREA_COLOR_2: 'rgba(201,234,252,0.4)',
        REG_SPLIT_LINE_COLOR: '#eee',
        /*任务统计图颜色*/
        TASK_HAS_COMPLETED_COLOR: '#2ECC71',//任务完成颜色
        TASK_OVER_DATE_COLOR: '#E74C3C',//任务逾期颜色
        /*文档统计图颜色*/
        DOC_BAR_COLOR_NORMAL: '#C7CBD5',//普通状态
        DOC_BAR_COLOR_MOUSE_OVER: '#3498DB',//鼠标移入
        /*协作企业统计图颜色*/
        COMPANY_SERIES_LINE_COLOR: '#3498DB',//注册图表曲线颜色
        COMPANY_SPLIT_LINE_COLOR: '#C7CBD5'
    };

	return {
		ROOT:ROOT,//根路径
		ROOT_JS:ROOT+'/js/',
		ROOT_IMG:'/images/',
        ZOOM_URL:zoomUrl,
		EMULATE_HTTP:true,
		EMULATE_JSON:true,
		REQUEST_URL:{//请求地址
			//注册模型地址
			DASHBOARD:ROOT+'/main/',
			//注册模型地址
			REGISTER:ROOT+'/register/',
			//注册用户信息
			REGISTER_USER_INFORMATION:ROOT+'/register/userinfo',
			//登录
			LOGIN:'/login/',
			//用户模型地址
			USER:'/core/user/',
			//任务模型地址
			TASK:'/colla/task/',
			//空间模型地址
			SPACE:'/colla/workspace/',
			//组织模型地址
			ORG:'/core/organization/',
			//日程模型地址
            AGENDA:'/colla/agenda/',
			//评论模型地址
			COMMENT:'/colla/comment/',
			//任务检查项
			TASK_CHECK_ITEM:'/colla/taskItem/',
			//任务追踪者
			TASK_TRACKER:'/colla/taskFollow/',
			//任务分配用户
			TASK_ASSIGN:'/colla/taskUser/',
			//组织集合
			ORG_LIST:ROOT+'/common/orgAndSpace.htm',
			//任务集合
			TASK_LIST:'/colla/task/',
			//任务标签集合
			TASK_LABEL_LIST:'/core/tag/task',
			//任务检查项集合
			TASK_CHECK_ITEM_LIST:'/colla/taskItem',
			//评论集合地址
			COMMENT_LIST:'/colla/comment/',
			//任务追踪者集合地址
			TASK_TRACKER_LIST:'/colla/taskFollow',
			//任务分配集合地址
			TASK_ASSIGN_LIST:'/colla/taskUser',
			//文档集合地址
			DOCUMENT:'/core/document/',
            //文件夹集合地址全部
            FOLDER:'/core/folder/',
            //我创建的
            FOLDER_CREATED_BY_ME:'/core/folder/my/',
            //共享给我的
            FOLDER_SHARE_TO_ME:'/core/folder/share/',
            //回收站
            FOLDER_RECYCLE:'/core/folder/trash/',
			//文档记录集合地址
			DOC_ACTIVITY_LIST:'/core/document/preview/fileRecord.htm',
            //联系人集合
            CONTACTS_PAGE_LIST:'/colla/contacts/',
			//任务重排序
			TASK_REORDER:'/colla/task/doReorder',
			//任务动态记录集合地址
			TASK_ACTIVITY_LIST:'/colla/activity/getTaskActivity',
			//搜索结果集合地址
			SEARCH_RESULT_LIST:' /search',
			//日程集合地址
			SCHEDULE_LIST:'/colla/agenda/',
            //添加到空间集合地址
            ADD_SPACE_LIST:'/colla/workspace/inviteFromContacts.htm',
            //工作空间地址
            WORKSPACE_LIST:'/colla/workspace/',
            //工作空间协作者集合
            WORKSPACE_USER_LIST:'/colla/workspaceUser/',
            //用户活动集合
            ACTIVITY_LIST:'/colla/activity/',
			//从联系人中邀请到空间
			INVITE_FROM_CONTACTS:'/colla/workspace/inviteFromContacts',
			//任意邀请，可以是usrId,也可以是邮箱
			INVITE_FROM_ANY:'/colla/workspace/inviteFromAny',
            //消息集合
            MESSAGE_LIST:'/core/systemMessage/',
            //组织成员信息
            MEMBER_LIST:'/core/member/',
			//空间协作者集合
			COLLABORATOR_LIST:'/core/userProfile/getSpaceUser',
            //获取空间最近上传的文档
            RECENT_FILE:'/core/document/recent/',
            //获取空间最近任务
            RECENT_TASK:'/colla/task/recent/',
            //空间集合
            SPACE_LIST:'/common/mySpace/',
			//离开组织
			LEAVE_ORG:'/core/organization/leaveOrg',
            //创建分享链接
            CREATE_LINK:'/core/docLink/',
            //获取文档共享用户
            FOLDER_SHARED_USER:'/core/folder/getSharedUser',
            //复制文档或文件夹
            COPY:'/core/folder/copyBatch',
            //移动文件到回收站
            FILE_RECYCLE:'/core/document/trash/',
            //移动文档或文件夹
            MOVE:'/core/folder/moveBatch',
            //获取文件夹的面包屑导航
            FOLDER_BREAD_CRUMB:'/core/folder/path/',
            //获取行业列表
            INDUSTRY_LIST:'/common/industry/',
            //获取地区列表
            AREA_LIST:'/common/area/',
            //组织下的空间信息
            SPACE_ORG_LIST:'/colla/workspace/statistic/',
            //当前登录用户的简历信息
            USER_PROFILE:'/core/userProfile/',
            //各空间人员分布信息
            DISTRIBUTION_LIST:'/core/organization/statistic/user/',
            //请求文档预览地址
            FILE_ADDRESS:'/core/document/preview/fileAddr.htm',
            //各空间任务统计
            SPACE_STATICTIS:'/colla/task/statistic/status/',
            //请求任务路径
            TASK_PATH:'/colla/task/path/',
            //文件管理中的批量下载
            BATCH_DOWNLOAD:'core/folder/downloadMix',
            //文件管理中的单文件下载
            SINGLE_FILE_DOWNLOAD:'core/document/downloadDoc',
            //文件管理中的单文件夹下载
            SINGLE_FOLDER_DOWNLOAD:'core/folder/downloadFolder',
			//升级购买
			STORE:'/store/',
            //离开空间
            LEAVE_SPACE:'/colla/workspace/leaveSpace/',
            //统计任务总数
            TASK_TOTAL_COUNT:'/colla/task/countTask',
            //检测用户是否在线
            CHECK_USER_ONLINE:'/core/user/onlineStatus/',
            //我今天的任务集合
            MY_TASK_TODAY:'/colla/task/groupByTodayTime',
            //共享文件的协作者集合
            DOCUMENT_COLLA:'/core/folder/getAllSharedUser',
            //分类动态集合
            FILTERED_ACTIVITY_LIST:'/colla/activity/groupByActivity',
            //组织通讯录集合
            ORG_CONTACT_LIST:'/colla/contacts/orgContacts'
		},
		SPEED:300,
		DEF_PHOTO:{
			USER:'/images/images1.6/avatar-user-140x140.png',
			ORG:'/images/images1.6/avatar-org-140x140.png',
			SPACE:'/images/images1.6/avatar-org-140x140.png'
		},
		DATE_TIME_PICKER_OPTION:{
			startDate: '2014-05-12',
			language: 'zh-CN',
			weekStart: 1,
			todayBtn: 1,
			autoclose: 1,
			startView: 2,
			minView: 0,
			maxView: 4,
			forceParse: 0,
			todayHighlight: true,
			minuteStep: 10,
			format: 'yyyy-mm-dd hh:ii'
		},
		USER_ID:Number(userId),
		DOC_ACT_TYPE:[0, '上传了', 0, 0, 0, 0, 0, 0, 0, 0, 0, '评论了', '喜欢', '批准了', '分享了', '查看了', '下载了', '编辑了', '更新了'],
		TASK_ACT_TYPE:[0,0,0,'创建新任务:',0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'增加了一个文档','修改了任务状态','评论了此任务','修改了任务分配人员','修改了任务跟踪人员','修改了任务截止时间','删除了一个文档'],
		EMAIL_HASH:{
			'qq.com' : 'http://mail.qq.com',
			'gmail.com' : 'http://mail.google.com',
			'sina.com' : 'http://mail.sina.com.cn',
			'163.com' : 'http://mail.163.com',
			'126.com' : 'http://mail.126.com',
			'yeah.net' : 'http://www.yeah.net/',
			'sohu.com' : 'http://mail.sohu.com/',
			'tom.com' : 'http://mail.tom.com/',
			'sogou.com' : 'http://mail.sogou.com/',
			'139.com' : 'http://mail.10086.cn/',
			'hotmail.com' : 'http://www.hotmail.com',
			'live.com' : 'http://login.live.com/',
			'live.cn' : 'http://login.live.cn/',
			'live.com.cn' : 'http://login.live.com.cn',
			'189.com' : 'http://webmail16.189.cn/webmail/',
			'yahoo.com.cn' : 'http://mail.cn.yahoo.com/',
			'yahoo.cn' : 'http://mail.cn.yahoo.com/',
			'eyou.com' : 'http://www.eyou.com/',
			'21cn.com' : 'http://mail.21cn.com/',
			'188.com' : 'http://www.188.com/',
			'foxmail.com' : 'http://www.foxmail.com',
			'parox.cn' : 'http://mail.parox.cn/'
		},
		LOADING_BAR_OPTION:{
			text: '正在努力加载数据，请稍候......',
			textStyle: {
				color: 'white'
			},
            x:'center',
			backgroundColor:'rgba(0,0,0,0.7)',
			effect: 'spin',//loading效果，可选为：'spin' | 'bar' | 'ring' | 'whirling' | 'dynamicLine' | 'bubble'
			effectOption: {
				color: 'white'
			}
		},
        FILE_MENU:[
            {index:0,command:'create','title':'新建文件夹',className:'icon-12 icon-12-folder m-r-15'},
            {index:1,command:'share','title':'共享',className:'icon-12 icon-12-share-l m-r-15'},
            {index:2,command:'link','title':'链接',className:'icon-12 icon-12-link-l m-r-15'},
            {index:3,command:'move','title':'移动',className:'p-r-2 m-r-25'},
            {index:4,command:'copy','title':'复制',className:'icon-12 icon-12-copy m-r-15'},
            {index:5,command:'rename','title':'重命名',className:'p-r-2 m-r-25'},
            {index:6,command:'property','title':'属性',className:'icon-12 icon-12-hint-l m-r-15'},
            {index:7,command:'download','title':'下载',className:'icon-12 icon-12-download-l m-r-15'},
            {index:8,command:'doDelete','title':'删除',className:'icon-12 icon-12-delete-l m-r-15'},
            {index:9,command:'doRemove','title':'移除',className:'icon-12 icon-12-remove-l m-r-15'}
        ],
        X_AXIS_OPTION: {
            position: 'left',
            boundaryGap: false,
            axisTick: {
                show: false
            },
            axisLabel: {
                interval: 0
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: COLOR.REG_SPLIT_LINE_COLOR,
                    width: 1
                }
            },
            splitLine: {
                lineStyle: {
                    color: COLOR.REG_SPLIT_LINE_COLOR,
                    width: 1
                }
            }
        },
        Y_AXIS_OPTION:{
            type: 'value',
            yAxisIndex: 1,
            axisLabel: {
                formatter: '{value}'
            },
            splitArea: {
                show: false//不显示分隔区域颜色
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: COLOR.REG_SPLIT_LINE_COLOR,
                    width: 1
                }
            },
            axisLine: {
                show: false
            }
        },
        CHARTS_LEGEND:{
            orient: 'vertical', // 'vertical'horizontal
            x: 'right',//1150, // 'center' | 'left' | {number},
            y: 'top',//70, // 'center' | 'bottom' | {number}
            textStyle: {color: COLOR.LEGEND_TEXT_COLOR},
            data: [TEXT.REG_COUNT, TEXT.LOGIN_COUNT]
        },
        CHARTS_SERIES:{
            name: TEXT.REG_COUNT,
            type: 'line',
            data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6],
            yAxisIndex: 0,
            itemStyle: {
                normal: {
                    color: COLOR.REG_SERIES_LINE_COLOR[0],//线条颜色
                    borderColor: COLOR.REG_SERIES_LINE_COLOR[0],//端点颜色
                    borderWidth: 1,
                    areaStyle: {
                        color: COLOR.REG_AREA_COLOR_1
                    },
                    label: {
                        show: true,
                        //formatter:"标签文本格式器，同Tooltip.formatter，不支持回调",
                        position: "right'",
                        textStyle: null
                    },
                    lineStyle: {
                        width: 1
                    }
                }
            }
           /* symbol: 'emptyCircle',
            symbolSize: 4//端点直径*/
        },
        CHARTS_OPTION:{
            //backgroundColor:'red',
            //color:['red','green'],
            //calculable:true,
            legend:'',
            xAxis:'',
            yAxis:'',
            series: [],
            grid: {
                //backgroundColor:'none',//网格背景色
                borderColor: 'black',//网格边框
                borderWidth: '0'//边框线宽
            },
            tooltip: {
                show: true
            }
        },
		//订单优惠等级
		ORDER:{
			// 用户 10人以内7元/月 11~25人6元/月 26~50人5元/月 50人以上4元/月
			ORDER_USER_LEV_1: 7,
			ORDER_USER_LEV_2: 6,
			ORDER_USER_LEV_3: 5,
			ORDER_USER_LEV_4: 4,
			// 存储空间 2元/G
			ORDER_STORAGE_LEV_1: 2
		},
		//免费相关服务
		SERVERS:{
			//免费空间10(单位:GB)
			SERVERS_FREE_STORAGE:10,
			//组织免费用户0
			SERVERS_FREE_USER:0,
			//免费期2(单位:月Month)
			SERVERS_FREE_TERM:2
		}
	};

});