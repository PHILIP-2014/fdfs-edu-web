/**
 * fileName:
 * createdBy:William
 * date:2014/9/1
 */
define('collection/common.coll',['collection/collections'],function(require){
	'use strict';
	var list=require('collection/collections');
	var SpaceList=list.SpaceList;
	list.OrgList.prototype.parse=function(resp){
		var orgArr=[];
		if(resp){
			var len=resp.length;
			while(len>0){
				len--;
				var item=resp[len];
				var obj=item.org;
				obj.spaceList=new SpaceList(item.spaceList);
				orgArr.push(obj);

			}
		}
		return orgArr;
	};
	return {
		orgList:new list.OrgList(),
		spaceList:new SpaceList(),
		scheduleList:new list.ScheduleList(),
        contactList:new list.ContactsList()
	};
});