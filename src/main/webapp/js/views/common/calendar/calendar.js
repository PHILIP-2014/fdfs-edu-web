/**
 * fileName:
 * createdBy:William
 * date:2014/11/17
 */
define('views/common/calendar/calendar',['parox','viewCommon/calendar/widget/agenda','fullCalendar',
    'viewCommon/calendar/widget/simple.agenda','collection'],function(require){
    var PAROX=require('parox');
    var moment=require('moment');
    var $=PAROX.$;
    var _=PAROX._;
    var collection=require('collection');
    var commonList=require('collection/common.coll');
    var AgendaEditor=require('viewCommon/calendar/widget/agenda');
    var SimpleAgenda=require('viewCommon/calendar/widget/simple.agenda');

    var sideAgendaTpl='<%_.each(agendaGroup,function(groupItem){%>'+
                        '<table class="table schedule-today table-bordered m-un">'+
                            '<thead>'+
                                '<tr>'+
                                    '<th colspan="2"><%-groupItem.title%></th>'+
                                '</tr>'+
                            '</thead>'+
                            '<tbody>'+
                                '<%if(groupItem.agendaList.length===0){%>'+
                                    '<tr>'+
                                    '<td colspan="2">今天还没有安排哦</td>'+
                                    '</tr>'+
                                '<%}%>'+
                                '<%_.each(groupItem.agendaList,function(agenda){%>'+
                                '<tr>'+
                                    '<td style="background: <%-agenda.get(\'color\')%>;"><%-agenda.formatStartTime()%></td>'+
                                    '<td><%-agenda.get("title")%></td>'+
                                '</tr>'+
                                '<%})%>'+
                            '</tbody>'+
                        '</table>'+
                        '<%})%>';


    var spaceItemTpl=   '<%orgList.each(function(org){%>'+
                        '<div data-behavior="org-item"><div class="panel-heading p-5 bg-default">'+
                        '<h4 class="panel-title f-s-13 m-t-un text-overflow">'+
                            '<input type="checkbox" value="<%=org.get(\'orgId\')%>" data-type="org" data-command="selectWorkspace">'+
                            '<a href="javascript:;"><%-org.get("orgName")%></a>'+
                        '</h4>'+
                        '</div>'+
                        '<div class="panel-body p-un" data-behavior="space-wrapper">'+
                            '<ul>'+
                                '<%org.get("spaceList").each(function(space){%>'+
                                '<li class="checkbox p-l-20">'+
                                    '<label class="text-overflow">'+
                                        '<input type="checkbox" value="<%=space.get(\'spaceId\')%>" data-type="space" data-command="selectWorkspace"><%-space.get("name")%>'+
                                    '</label>'+
                                '</li>'+
                                '<%})%>'+
                            '</ul>'+
                        '</div></div>'+
                        '<%})%>';

    function convertStatusToColor(status){
        var color;
        switch (status){
            case 0:
                color='#cccccc';
                break;
            case 1:
                color='#2c7ba3';
                break;
            case 2:
            case 3:
                color='#5cb85c';
        }
        return color;
    }

    $.fullCalendar.lang("zh-cn", {
        defaultButtonText: {
            month: "月",
            week: "周",
            day: "日",
            list: "日程",
            today:'今天'
        },
        allDayText: "全天",
        eventLimitText: function(n) {
            return "另外 " + n + " 个";
        }
    });



    return PAROX.View.extend({
        sideAgendaTemplate: _.template(sideAgendaTpl),
        sideSpaceListTemplate: _.template(spaceItemTpl),
        formatter:'YYYY-MM-DD HH:mm',
        events:{
            'click [data-behavior="command"]':'onCommandBtnClick',
            'change input[type="checkbox"]':'onCheckboxChange'
        },
        initialize:function(){
            this.__viewModel=new PAROX.Backbone.Model({type:'schedule',spaceIds:''});

            //三天的日程集合
            this.collection=new collection.ScheduleList();

            //组织空间集合
            this.orgList=commonList.orgList;

            this.listenTo(this.__viewModel,{
                'change:type':function(model,type){
                    if(model._previousAttributes.type!==type){
                        this.render(_.bind(function(){
                            this.$('[data-command="toggleSideBar"]')
                                .children()
                                .addClass('fc-icon-right-single-arrow')
                                .removeClass('fc-icon-left-single-arrow')
                        },this));
                    }

                    if(type==='schedule'){
                        this.fetchThreeDaysAgenda();
                    }
                },
                'change:spaceIds':this.render
            });

            this.listenTo(this.collection,{
                reset:this.render3DaysAgenda
            });

            this.listenTo(this.orgList,{
                reset:this.renderSpaceList
            });

            this.agendaEditor=new AgendaEditor({
                title:'编辑日程',
                parent:this,
                confirm:true,
                confirmText:'保存',
                cancel:true,
                cancelText:'放弃',
                remove:true,
                removeText:'删除日程'
            });

            this.agendaCreator=new AgendaEditor({
                title:'新建日程',
                parent:this,
                confirmText:'创建',
                onShow:function(win){
                    win.$('[data-behavior="name-input"]').focus().select();
                }
            });

            this.simpleAgenda=new SimpleAgenda({
                parent:this,
                onShow:function(win){
                    win.$('input[name="title"]').focus().select();
                }
            });

            //右侧边栏
            this.$sideBar=this.$('#calendar-filter');
            //tab
            this.$tabContent=this.$('[data-behavior="tab-content"]');
            //右侧边栏日程容器
            this.$sideScheduleListWrap=this.$sideBar.find('[data-behavior="side-schedule-list"]');
            //组织空间列表容器
            this.$spaceListWrap=this.$sideBar.find('[data-behavior="space-list"]');
        },
        //获取未来三天的日程
        fetchThreeDaysAgenda:function(){
            var time=moment();
            var from=time.format('YYYY-MM-DD');
            var to=time.add(3,'days').format('YYYY-MM-DD');
            var data={
                userId:PAROX.USER_ID,
                from:from,
                to:to,
                _:time.valueOf()
            };

            var options={
                data:data,
                remove:true,
                reset:true
            };
            this.collection.fetch(options);
        },
        onShow:function(){
            this.render();
        },
        destroy:function(){
            if(this.__calendar){
                this.__calendar.fullCalendar('destroy');
            }
            return this;
        },
        render:function(callback){
            var options=this.getOption();
            this.destroy();
            this.__calendar=this.$('[data-behavior="full-calendar"]').fullCalendar(options);
            if(_.isFunction(callback)){
                callback();
            }
            return this;
        },
        updateEvent:function(event){
            this.removeEvents(event.id);
            this.renderEvent(event);
            return this;
        },
        renderEvent:function(event){
            this.__calendar.fullCalendar('renderEvent',event);
        },
        removeEvents:function(id){
            this.__calendar.fullCalendar('removeEvents',id);//如果不提供id，则删除所有日程
        },
        getClientEvents:function(id){
            return this.__calendar.fullCalendar('clientEvents' ,id);
        },
        createAgenda:function(attr){
            var agenda=new PAROX.models.ScheduleModel();
            if(!attr.title){
                PAROX.alert('日程标题不能为空！');
                return false;
            }
            agenda.save(attr,{
                wait:true,
                validate:false,
                success: _.bind(this.onCreateSuccess,this)
            });
        },
        onCreateSuccess:function(model,resp){
            PAROX.message('活动：'+model.get('title')+' 创建成功！');
            this.renderEvent(resp);
            this.fetchThreeDaysAgenda();
        },
        saveAgenda:function(attr){
            var agenda=new PAROX.models.ScheduleModel(attr);
            if(!attr.title){
                PAROX.alert('日程标题不能为空！');
                return false;
            }
            agenda.save(attr,{
                wait:true,
                success: _.bind(this.onSaveSuccess,this)
            });
        },
        onSaveSuccess:function(model,originEvent){
            PAROX.message('活动：'+model.get('title')+' 修改成功！');
            this.updateEvent(originEvent);
            this.fetchThreeDaysAgenda();
        },
        cloneEvent:function(event){
            return $.extend(true,{},event);
        },
        onEventClick:function(event, e, view){//事件被点击事触发
            var originEvent=this.cloneEvent(event);
            var formatter=this.formatter;
            originEvent.start=originEvent.start.format(formatter);
            originEvent.end=originEvent.end.format(formatter);

            var agenda=new PAROX.models.ScheduleModel(originEvent);
            var callback= _.bind(function(){
                agenda.destroy({
                    wait:true,
                    success: _.bind(function(){
                        PAROX.message('删除日程：'+originEvent.title+'成功！');
                        this.removeEvents(originEvent.id);
                    },this)
                });
            },this);
            this.agendaEditor.set({
                schedule:agenda,
                onRemove:function(){
                    PAROX.confirm('你确定要删除此日程吗？',callback);
                },
                onConfirm: _.bind(function(attr){
                    attr.id=event.id;
                    attr.allDay=this.isAllDay(moment(attr.start),moment(attr.end),this.agendaEditor.$el.find('[name="isAllDay"]'));
                    this.saveAgenda(attr,event);
                },this)
            }).show();
        },
        onDayClick: function(date, e, view) {
           // e.stopPropagation();
        },
        onSelect:function( startDate, endDate,e, view ){
            var offset=this.getOffset(e);
            var allDay=this.isAllDay(startDate,endDate);

            this.showSimpleAgendaCreator(startDate,endDate,allDay,offset);
            e.stopPropagation();
        },
        getOffset:function(jQEvent){
            var $this=this.$(jQEvent.target);
            var EW=$this.width();
            //var EH=$this.height();
            var offset=$this.offset();
            offset.left=offset.left+EW;
            //offset.top=offset.top+EH;
            return offset;
        },
        showSimpleAgendaCreator:function(start,end,allDay,offset){
            var agenda=new PAROX.models.ScheduleModel({
                start:start.format(this.formatter),
                end:end.format(this.formatter),
                allDay:allDay
            });

            this.simpleAgenda.set({
                schedule:agenda,
                onConfirm: _.bind(this.createAgenda,this)
            }).show(offset);
        },
        showFullAgendaCreator:function(start,end,allDay){
            var len=arguments.length;
            if(len===1&& _.isBoolean(start)){
                allDay=start;
                start=moment();
                end=start.clone().add(1,'days');
            }else if(len===2&& _.isBoolean(end)){
                allDay=end;
                end=start.add(1,'days');
            }else if(len===0){
                allDay=true;
                start=moment();
                end=start.add(1,'days');
            }
            var agenda=new PAROX.models.ScheduleModel({
                start:start.format('YYYY-MM-DD HH:mm'),
                end:end.format('YYYY-MM-DD HH:mm'),
                allDay:allDay,
                title:arguments[3]
            });

            this.agendaCreator.set({
                schedule:agenda,
                onConfirm: _.bind(this.createAgenda,this)
            }).show();
        },

        toggleSideBar:function(e){
            var model=this.__viewModel;
            var toAdd,toRemove,icon1,icon2;
            if(this.$sideBar.is(':visible')){
                toAdd='sidebar-out';
                toRemove='sidebar-in';
                icon1='fc-icon-left-single-arrow';
                icon2='fc-icon-right-single-arrow';
            }else{
                toRemove='sidebar-out';
                toAdd='sidebar-in';
                icon2='fc-icon-left-single-arrow';
                icon1='fc-icon-right-single-arrow';
                model.trigger('change:type',model,model.get('type'));
            }
            this.$tabContent.addClass(toAdd).removeClass(toRemove);
            this.$(e.currentTarget).children().addClass(icon1).removeClass(icon2);
        },
        onCheckboxChange:function(e){
            PAROX.View.prototype.onCommandBtnClick.call(this,e);
        },
        toggleTaskStatus:function(e){
            var $this=this.$(e.currentTarget);
            var taskId=$this.val();
            var task=this.getClientEvents(taskId)[0];
            var status=task.status<=1?2:1;
            var model=new PAROX.models.TaskModel(task);

            model.save({status:status,action:'status'},{
                success: _.bind(function(model,response){
                    var eventObj=this.eventDataTransform(response);
                    this.updateEvent(eventObj);
                    PAROX.message('更新任务状态成功！');
                },this)
            });
        },
        selectWorkspace:function(e){
            var $this=this.$(e.currentTarget);
            var $orgItemWrapper=$this.closest('[data-behavior="org-item"]');
            var $spaceWrapper=$orgItemWrapper.find('[data-behavior="space-wrapper"]');
            var $orgCheckbox=$orgItemWrapper.find('input[data-type="org"]');
            var $spaceCheckbox=$spaceWrapper.find('input[type="checkbox"]');
            var isChecked=$this.is(':checked');
            var type=$this.data('type');
            var spaceIds=this.get('spaceIds').split(',');
            var id=$this.val();
            var ids;
            var index=spaceIds.indexOf('');

            if(index>-1){
                spaceIds.splice(index,1);
            }
            if(isChecked){
                if(type==='space'){

                    spaceIds.push(id);
                    spaceIds=spaceIds.join(',');
                    if($spaceCheckbox.length=== $spaceWrapper.find('input:checked').length){
                        //如果所以有空间都选中了，那么选中该组织
                        $orgCheckbox.prop('checked',true);
                    }
                }else if(type==='org'){
                    ids=this.getSpaceIdsByOrgId(id);
                    ids=PAROX.util.unique(ids,spaceIds);
                    spaceIds=spaceIds.concat(ids).join(',');
                    //选中所有的checkbox
                    $spaceCheckbox.prop('checked',true);
                }
            }else{
                if(type==='space'){
                    spaceIds.splice(spaceIds.indexOf(String(id)),1);
                    spaceIds=spaceIds.join(',');
                    //取消组织的选中
                    $orgCheckbox.prop('checked',false);
                }else if(type==='org'){
                    //取消该组织下所有空间的选中状态
                    ids=this.getSpaceIdsByOrgId(id);
                    spaceIds=PAROX.util.unique(spaceIds,ids);
                    spaceIds=spaceIds.join(',');
                    $spaceCheckbox.prop('checked',false);
                }
            }

            this.set({spaceIds:spaceIds})

        },
        getSpaceIdsByOrgId:function(orgId){
            return this.orgList.findWhere({orgId:Number(orgId)}).get('spaceList').pluck('spaceId');
        },
        toggleCalendar:function(e){
            var type=this.$(e.currentTarget).data('type');
            this.set({type:type});
        },
        render3DaysAgenda:function(){
            var time=moment();
            var agendaGroupList=[];
            var today=time.date();
            var tomorrow=time.add(1,'days').date();
            var dayAfterTomorrow=time.add(1,'days').date();
            //筛选今天的日程
            var todayAgenda=this.collection.filter(function(item){
                var start=moment(item.get('start')).date();
                var end=moment(item.get('end')).date();
                return today>=start&&today<end||start===today;
            });
            //明天的日程
            var tomorrowAgenda=this.collection.filter(function(item){
                var start=moment(item.get('start')).date();
                var end=moment(item.get('end')).date();
                return tomorrow>=start&&tomorrow<end||start===tomorrow;
            });
            //后天的日程
            var dayAfterTomorrowAgenda=this.collection.filter(function(item){
                var start=moment(item.get('start')).date();
                var end=moment(item.get('end')).date();
                return dayAfterTomorrow>=start&&dayAfterTomorrow<end||start===dayAfterTomorrow;
            });

            time.add(1,'days');
            _.each([dayAfterTomorrowAgenda,tomorrowAgenda,todayAgenda],function(agendaList){
                agendaGroupList.push({
                    title:time.subtract(1,'days').format('ddd YYYY-MM-DD'),
                    agendaList:agendaList

                })
            });

            agendaGroupList.reverse();
            var html=this.sideAgendaTemplate({agendaGroup:agendaGroupList});
            this.$sideScheduleListWrap.html(html);
        },
        renderSpaceList:function(){
            var orgList=this.orgList.filter(function(item){
                return item.get('spaceList').length!==0;
            });
            var html=this.sideSpaceListTemplate({orgList:new collection.OrgList(orgList)});
            this.$spaceListWrap.html(html);
        },
        showAgendaWindow:function(e){
            this.showFullAgendaCreator(true);
        },
        isAllDay:function(start,end,checkbox){
            var sm=start.valueOf();
            var em=end.valueOf();
            var smstr=PAROX.util.formatDate(sm,'yyyy:mm:dd hh:mm');
            var emstr=PAROX.util.formatDate(em,'yyyy:mm:dd hh:mm');
            if(checkbox && checkbox.prop('checked')==false){
                return false;
            }

            return !start.isSame(end, 'day')&&em-sm>=1000*60*60*24;
        },
        eventDataTransform:function(eventObj){
            eventObj._type='task';
            eventObj.title=eventObj.name;
            eventObj.allDay=true;
            eventObj.start=eventObj.endTime;
            eventObj.end=moment(eventObj.endTime).add(1,'days').valueOf();
            eventObj.id=eventObj.taskId;
            eventObj.color=convertStatusToColor(eventObj.status);
            return eventObj;
        },
        getOption:function(){
            var option;
            if(this.get('type')==='task'){
                option={
                    eventSources:[{
                        url:'/colla/task/getAgendaTask',
                        type:'GET',
                        data:{
                            userId:PAROX.USER_ID,
                            type:'daily',
                            spaceIds:this.get('spaceIds')
                        },
                        error: function() {
                            PAROX.alert(arguments[2]);
                        },
                        eventDataTransform:this.eventDataTransform,
                        textColor:'#ffffff',
                        editable:true,
                        beforeSend:PAROX.showLoading,
                        complete:PAROX.hideLoading
                    }]
                };
            }else{
                option={
                    eventSources: [{
                        url: PAROX.CONFIG.REQUEST_URL.AGENDA,
                        type: 'GET',
                        data:{
                           userId:PAROX.USER_ID
                        },
                        error: function() {
                           PAROX.alert(arguments[2]);
                        },
                        editable:true,
                        beforeSend:PAROX.showLoading,
                        complete:PAROX.hideLoading,
                        textColor:'black'
                    }],
                    eventClick: _.bind(this.onEventClick,this),
                    dayClick: _.bind(this.onDayClick,this),
                    select: _.bind(this.onSelect,this)
               };
            }
            return $.extend(true,{},this.options,option);
        },
        options:{
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            firstDay:1,//每周的第一天，0:sunday1:monday
            timezone:'local',//时区，local本地，UTC
            lang:'zh-cn',//zh-cn
            defaultDate: $.now(),
            editable: true,
            eventLimit: true, // allow "more" link when too many events
            selectable:true,//是否允许拖动选择
            eventStartEditable:true,
            startParam:'from',
            endParam:'to',
            allDaySlot:true,
            slotMinutes:30,
            defaultEventMinutes:60,
            unselectAuto:false,
            eventTextColor:'black'
        }
    });

});