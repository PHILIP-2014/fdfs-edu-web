
var mock={
		root:"http://www.parox.com",
		data:{
			"inviteFromContacts":"spaceId=1200&userIds=10009,10148&inviteMessage=This is a message from 测试环境",
			"inviteFromMember":"spaceId=1200&userIds=10009,10148",
			"inviteFromAny":"spaceId=1200&roleType=2&inviteMessage=快加入test空间&target=10148,18767122513@139.com",
			"comment":{"mainId":10035,"ctype":1,"repliedUserId":0,"content":"这个任务是谁给的？ BY API TEST", "parentId":153, "repliedUserId":10082},
			"mention":"commentId=260&userIds=10148",
			"orgId":"orgId=1090",
			"spaceId":"spaceId=1038",
			"userId":"userId=1082",
			"taskId":"taskId=10147",
			"itemId":"itemId=129",
			"comment.list":"mainId=10035&ctypemail=1051343760@qq.come=1",
			"task":{"archiveTime":null,"commentCount":0,"createTime":null,"creater":null,"description":"","endTime":null,"finishTime":null,"followCount":0,"infoItem":null,"isDisabled":false,"labels":"","lastUpdateTime":null,"name":"从测试API更新的任务 BY TEST API ","org":null,"priority":0,"space":null,"spaceId":0,"startTime":null,"status":0,"taskId":0,"userId":0},
			"taskItem":{"isFinished":false,"itemId":129,"taskId":10147,"title":"这是从API更新的 BY TEST API"},
			"agenda":{"title":"测试日程创建","description":"这是从testAPI中创建的日程","color":"#b1d0f6","editable":"true","allDay":true,"start":"2015-02-11T00:00:00+08:00","end":"2015-02-12T00:00:00+08:00","remembers":[{"notifyType":1,"gmtNotify":1423544400000}]},
			"teamName":{"spaceId":1038,"name":"我去"},
			"member":{"agreeTime":null,"bigPhoto":"","createTime":null,"email":"","hasAgree":null,"isDisabled":false,"isOuter":true,"joinType":1,"memberId":10255,"memberRight":0,"middlePhoto":"","mobile":"","orgId":0,"originalPhoto":"","realName":"","smallPhoto":"","userId":1023},
			"search":"k=test&t=task&p=1&size=10",
			"searchSpace":"query=1234&privacy=2",
			"joinTeam":"teamIds=1085,1084&userIds=10023,10082&spaceId=1038",
			"organization":{"orgId":1105,"orgName":"被API更新的名称"},
			"workspaceuser":{"spaceId":1038,"id":1062,"roleType":1},
			"team":{"teamId":1084,"name":"被更API更改的名称","spaceId":1038},
			"agendaGET":"from=2014-09-19 00:00:00&to=2014-09-20 00:00:00&spaceId=1038",
			"workspace":{"name":"update from test 接口","spaceId":1173,"privacy":0,"allowInvite":1,"display":1,"orgId": 1090},
			"password":{"originPassword":"", "password":"","passwordConfirm":""},
			"taskUser":{"taskId":10152, "userId":10082},
			"folder":{"folderName":"从API创建的文件夹", "spaceId":1038,"parentId":213},
			"folderUpdate":{"spaceId":1038,"folderId":259,"folderName":"从API创建的文件夹","parentId":213,"userId":10014,"createTime":1412055689000,"editTime":1412055689000,"docNum":0,"totalSize":0,"shareCount":0,"folderStatus":0,"shareStatus":false,"linkStatus":false,"editUserId":10014,"trashUserId":0,"path":"/213/","labels":null},
			"permLevel":"folderId=213&userId=10082&permLevel=3",
			"stopShareFolder":"folderId=213&userId=10082",
			"docLink":{"docId":10141,"destType":2,"authType":2,"visitPass":"123456"},
			"moveBatchFolder":"folders=265,264&docs=10301,10300&destFolderId=262",
			"copyBatchFolder":"folders=265&docs=10301,10300&destFolderId=262",
			"taskFollow":{"taskId":10147,"userId":10023},
			"taskTagCondition":{"cat":2},
			"sendTarget":{"emails":"mays@caiban.net", "message":"this is a shared link for you 从 parox 来的"},
			"userProfile":{"userId":10014,"realName":"半儿","originalPhoto":null,"bigPhoto":null,"middlePhoto":null,"smallPhoto":null,"labels":null,"intro":null,"orgId":1001,"orgName":null,"deptName":null,"position":null,"cellphone":null,"tel":null,"fax":null,"zipcode":null,"qq":null,"weibo":null,"province":null,"city":null,"county":null,"address":null,"gender":null,"birthday":null,"idCard":null,"skinStyle":null,"defaultSpaceId":null,"memberChangeNotify":false,"taskNotify":false,"docChangeNotify":true,"messageNotify":false,"smsNotify":false,"dailyInfoEmail":false},
			"mobileVerifyCode":"mobile=18767122513&verifyCode=000000",
			"emailVerifyCode":"email=353830102@qq.com&verifyCode=000000",
			"folderPage":"",
			"demo":""
		},
		getRoot: function(){
			return this.root;
		},
		get:function(key){
			var obj =this.data[key] 
			if(typeof obj == "object"){
				return JSON.stringify(obj);
			}
			if(typeof obj=="string"){
				return obj;
			}
			return "";
		}
}
