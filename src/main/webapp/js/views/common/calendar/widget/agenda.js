/**
 * fileName:日程编辑
 * createdBy:William
 * date:2014/9/18
 */


define('viewCommon/calendar/widget/agenda',['parox',
    'collection/common.coll','viewCommon/calendar/widget/color.picker','viewCommon/view.create.space'],function(require){

	'use strict';
	var PAROX=require('parox');
    var _=PAROX._;
    var tpl=PAROX.$('#schedule-editTpl');
	var editTpl=tpl.html()||'<li></li>';
        //tpl.remove();
    var tpl2=PAROX.$('#schedule-remindSet-normalTpl');
    var remindNormalTpl=tpl2.html()||'</br>';
    var tpl3=PAROX.$('#schedule-remindSet-allDayTpl');
    var remindTpl=tpl3.html()||'</br>';
    var $=PAROX.$;

	var collection=require('collection/common.coll');
    var ColorPicker=require('viewCommon/calendar/widget/color.picker');
    //var SpaceCreateView=require('viewCommon/view.create.space');
    var moment=require('moment');
    var timeTpl='<%for(var i=0,len=23;i<=len;i++){%>' +
                    '<li data-behavior="time-li">' +
                        '<a href="javascript:;"><%if(i.toString().length==1){%>0<%}%><%=i%>:00</a>' +
                    '</li>' +
                    '<li data-behavior="time-li">' +
                    '<a href="javascript:;"><%if(i.toString().length==1){%>0<%}%><%=i%>:30</a>' +
                    '</li>' +
                '<%}%>';
	return PAROX.component.Dialog.extend({
		template:_.template(editTpl),
        timeTemplate: _.template(timeTpl),
        remindTemplate: {
            'allDay':_.template(remindTpl),
            'normal': _.template(remindNormalTpl)
        },
		attributes:{
			tabindex:-1,
			role:'dialog',
			'aria-labelledby':'编辑日程',
			'aria-hidden':true
		},
		initialize:function(option){
            var spaces=this.spaces=collection.spaceList;
            this.dateTimePicker=new PAROX.component.DateTimePicker($.extend({},PAROX.CONFIG.DATE_TIME_PICKER_OPTION,{minView:2}));
            this.__viewModel=new PAROX.models.DialogModel({
                title:'编辑日程',
                schedule:null,
                spaceList:collection.spaceList,
                confirmText:'创建',
                cancel:true,
                cancelText:'取消',
                remove:false,
                removeText:'删除',
                onRemove:PAROX.$.noop
            });

            this.listenTo(this.__viewModel,{
                'change:schedule':function(model,schedule){
                    this.model=schedule;
                },
                'change:allDay':function(model,allDay){
                    var isClick=model.get('isClickBtn')?true:false;
                    this.changeAllDay(allDay,isClick);
                    model.set({isClickBtn:false});
                }

            });
            //this.spaceCreateView=new SpaceCreateView({parent:this});

            this.events=_.extend({
                'click [data-behavior="remove"]':'onRemoveBtnClick',
                'input [name="title"]':'onTitleInput',
                'submit form':'onFormSubmit',
                'focusin [data-behavior="time-input"]':'onTimePickerFocus',
                'input [data-behavior="time-input"]':'onTimePickerInput',
                'keypress [data-behavior="time-input"]':'onTimePickerKeyPress',
                'keydown [data-behavior="time-input"]':'onTimePickerKeyDown',
                'click input[name="isAllDay"]':'onCheckAllDayClick',
                'click [data-behavior="time-li"]':'onSelectTimeClick',
                'click [data-behavior="remove-set"]':'onRemoveOneSetClick',
                'click [data-behavior="add-remind"]':'onAddRemindClick',
                'input [name="seconds"]':'onChangeInputValue',
                'input [name="gmtNotify"]':'onChangeInputValue',
                'input [name="remindTime"]':'onChangeRemindTimeValue'


            },this.events);
            this.set(option);
			this.__isDisplay=false;
		},
        onChangeRemindTimeValue:function(e){
            var reg=/^([0-1][0-9]|[2][0-3])(:)([0-5][0-9])+$/;
            var input=this.$(e.currentTarget);
            var value= $.trim(input.val());
            if(!reg.test(value)){
                input.addClass('high-warning');
                this.toggleSubmitButton(true);
            }else{
                input.removeClass('high-warning');
                this.toggleSubmitButton(false);
            }
        },
        onChangeInputValue:function(e){
            var input=this.$(e.currentTarget);
            var val= $.trim(input.val());
            var num=Number(val);
            var reg=/^[^\.]+$/;
            if (isNaN(num) || num<0 || !reg.test(num)){
                input.addClass('high-warning');
                this.toggleSubmitButton(true);
            }else{
                input.removeClass('high-warning');
                this.toggleSubmitButton(false);
            }
        },
        fetchRemembers:function(id,allDay){
            if(!id){
                this.renderMain(true);
                return;
            }
            PAROX.ajax({
                url:'/colla/agenda/remembers',
                type:'GET',
                data:{
                    agendaId:id
                },
                success: _.bind(function(data){
                    this.renderMain();
                    if(data){
                        this.renderRemindList(data,allDay);
                    }
                    if(this.$('[name="title"]').val()){
                        this.toggleSubmitButton(false);
                    }
                },this)
            });
        },
        renderRemindList:function(list,allDay){
            var type=allDay?'allDay':'normal';
            this.clearList();
            _.each(list,function(item){
                item.getRemindDay=this.model.getRemindDay;
                item.getRemindTime=this.model.getRemindTime;
                item.getTimeBySeconds=this.model.getTimeBySeconds;
                this.addRemind(type,item);
            },this);

        },
        toggleSubmitButton:function(isEnabled){
            this.$('button[type="submit"]').prop('disabled',isEnabled);
            return this;
        },
        render:function(){
            if(!this.model.get('title')){
                this.renderMain(true);
            }else{
                this.fetchRemembers(this.model.get('id'),this.model.get('allDay'));
            }
            return this;
        },
        renderMain:function(isNew){
            var color=this.model.get('color');
            var isAllDay=this.model.get('allDay');
            var type=isAllDay?'allDay':'normal';
            this.$el.html(this.template({model:this.__viewModel})).appendTo('body');
            var colorPicker=new ColorPicker({color:color});
            colorPicker.set({
                onColorChange: _.bind(function(value){
                    this.$('[name="color"]').val(value);
                    if(this.$('[name="title"]').val()){
                        this.toggleSubmitButton(false);
                    }

                },this)
            });
            this.$('[data-behavior="color"]').append(colorPicker.render());
            if(!color){
                colorPicker.selectColorByIndex(0);
            }

            this.$('[data-behavior="time-ul"]').html(this.timeTemplate());
            this.set({allDay:isAllDay});
            if(isNew){
                this.clearList().addRemind(type);
            }
            return this;
        },
		onRemoveBtnClick:function(){
            this.get('onRemove')();
            this.hide();
		},
        onFormSubmit:function(e){
            e.preventDefault();
            var model=this.get('schedule');
            var values=this.$('form').serializeArray();
            var attr=PAROX.util.convertArrayToObject(values);
            var checkbox=this.$('[name="isAllDay"]');
            if(checkbox.length>0){
                if(attr.isAllDay=='on'){
                    attr.startMin='00:00';
                    attr.endMin="00:00";
                    attr.allDay=true;
                }else{
                    attr.allDay=false;
                }
                attr.start=attr.startDate+' '+attr.startMin;
                attr.end=attr.endDate+' '+attr.endMin;
            }

            attr.start=moment(attr.start).valueOf();
            attr.end=moment(attr.end).valueOf();
            //attr.allDay=this.parent.isAllDay(attr.start,attr.end,this.$('input[name="isAllDay"]'));
            this.getRemindData(attr);
            if(this.isSimple){
                attr.isSimple=true;
                attr.allDay=true;
            }
            var msg=model.validate(attr);
            if(msg){
                PAROX.alert(msg);
                return false;
            }else{
                delete attr.startDate;
                delete attr.startMin;
                delete attr.endDate;
                delete attr.endMin;
                delete attr.isSimple;
                delete attr.isAllDay;
                delete attr.timeStyle;
                delete attr.gmtNotify;
                delete attr.notifyType;
                delete attr.seconds;
                this.get('onConfirm')(attr);
                this.hide();
            }

        },
        getRemindData:function(attr){
            var currentItem,notifyType,gmtVal,gmtNotify,timeStyle,seconds,secVal,timeVal,rememberId,item,arr=[];
            attr.remembers=[];
            var setItem=this.$('[data-behavior="remind-list"]').find('[data-behavior="remind-set"]');
            for(var i= 0,len=setItem.length;i<len;i++){
                currentItem=this.$('[data-behavior="remind-list"]').find('[data-behavior="remind-set"]')[i];
                item=$(currentItem);
                notifyType=item.find('[name="notifyType"] option:selected').val();
                timeStyle=item.find('[name="timeStyle"] option:selected').val();
                timeVal=item.find('[name="remindTime"]').val();
                gmtVal=item.find('[name="gmtNotify"]').val();
                secVal=item.find('[name="seconds"]').val();
                rememberId=item.attr('data-id');
                if(this.get('allDay')){
                    gmtNotify=this.getGmtNotify({
                        notifyType:notifyType,
                        gmtVal:gmtVal,
                        type:timeStyle,
                        val:timeVal,
                        start:attr.startDate
                    });
                    attr.remembers.push({
                        notifyType:Number(notifyType),
                        gmtNotify:gmtNotify,
                        rememberId:Number(rememberId)
                    });
                }else{
                    seconds=this.getSeconds(timeStyle,secVal);
                    attr.remembers.push({
                        notifyType:Number(notifyType),
                        seconds:seconds,
                        rememberId:Number(rememberId)
                    });
                }
            }


            return attr.remembers;

        },
        getGmtNotify:function(parm){
            var time=[],gmtVal=parm.gmtVal,start=moment(parm.start);
            time[0]=gmtVal;
            time[1]=gmtVal*7;
            time[2]=gmtVal*30;
            var date=start.subtract(time[parm.type],'days').valueOf();
            var newDate=PAROX.util.formatDate(date,'yyyy:mm:dd');
            var fullTime=newDate+' '+parm.val;

            return moment(fullTime).valueOf();
        },
        getSeconds:function(notifyType,secVal){
            var time=[];
            time[0]=secVal*60000;
            time[1]=secVal*3600000;
            time[2]=secVal*86400000;
            time[3]=secVal*604800000;
            return time[notifyType];
        },
        onTitleInput:function(e){
            var val= this.$(e.currentTarget).val();
            var msg=this.model.validate({name:val});
            if(msg){
                this.toggleSubmitButton(true);
                return false;
            }else{
                this.toggleSubmitButton(false);
            }

		},
        onTimePickerFocus:function(e){
            var $this=this.$(e.currentTarget);
            this.dateTimePicker.set({
                onChangeDate:function(evt){
                    var milli=evt.date.getTime()-1000*60*60*8;
                    $this.val(PAROX.util.formatDate(milli,'yyyy:mm:dd'));
                }
            }).place($this.offset(),$this.outerHeight())
                .show();
        },
        onTimePickerInput:function(e){
            e.preventDefault();
        },
        onTimePickerKeyPress:function(e){
            e.preventDefault();
        },
        onTimePickerKeyDown:function(e){
            e.preventDefault();
        },
        addOneSpace:function(model){
            var option=$('<option>').val(model.get('spaceId')).html(model.get('name')).prop('selected',true);
            this.$('select[name="spaceId"]').append(option);
        },
        showSpaceCreator:function(){
            var callback=function(attr,win){
                var model=new PAROX.models.SpaceModel();
                model.save(attr,{
                    success: _.bind(function(){
                        PAROX.message('创建空间成功！');
                        collection.spaceList.add(model);
                        this.addOneSpace(model);
                        win.hide();
                    },this)
                });
            };
            this.spaceCreateView.set({
                onConfirm: _.bind(callback,this)
            }).show();
        },
        onCheckAllDayClick:function(){
            var isChecked=this.$('[name="isAllDay"]').prop('checked');
            this.set({allDay:isChecked,isClickBtn:true});
        },
        onSelectTimeClick:function(e){
            var li=this.$(e.currentTarget);
            var value=li.text();
            li.closest('ul').siblings('input').prop('value',value).removeClass('high-warning');
            if(this.model.get('title')&& this.$('.high-warning').length==0){
                this.toggleSubmitButton(false);
            }
        },
        onPanelClick:function(){
            this.closeDropDown();
        },
        openDropDown:function(){
            this.$('[data-behavior="drop-down"]').addClass('open');
            return this;
        },
        closeDropDown:function(){
            this.$('[data-behavior="drop-down"]').removeClass('open');
        },
        onRemoveOneSetClick:function(e){
            this.$(e.currentTarget).closest('[data-behavior="remind-set"]').remove();
            this.toggleSubmitButton(false);
        },
        onAddRemindClick:function(e){
            var type=this.get('allDay')?'allDay':'normal';
            this.remindRender(type);
            this.toggleSubmitButton(false);
        },
        changeAllDay:function(isAllDay,isClick){
            if(isAllDay){
                var startDate=moment(this.$('[name="startDate"]').val());
                var endDate=moment(this.$('[name="endDate"]').val());
                this.$('[data-behavior="time-box"]').hide();
                if(startDate>=endDate){
                    endDate=startDate.add(1,'days').valueOf();
                    var end=PAROX.util.formatDate(endDate,'yyyy:mm:dd');
                    this.$('[name="endDate"]').val(end);
                }

            }else{
                this.$('[data-behavior="time-box"]').show();
            }
            var type=isAllDay?'allDay':'normal';
            if(isClick){
                this.remindRender(type,true);
            }

        },
        remindRender:function(type,isClear){
            if(isClear){
                this.clearList();
            }

            this.addRemind(type);
        },
        clearList:function(){
            this.$('[data-behavior="remind-list"]').find('[data-behavior="remind-set"]').remove();
            return this;
        },
        addRemind:function(type,model){
            var remindHtml;
            if(model) {
                if (type == 'allDay') {
                    model.start=this.get('schedule').get('start');
                    model.parm = model.getRemindDay(model);
                    model.time = model.getRemindTime(model);
                } else {
                    model.parm = model.getTimeBySeconds(model);
                }
                remindHtml = this.remindTemplate[type]({model: model});
            }else{
                remindHtml = this.remindTemplate[type]({model:undefined});
            }
            var item=$(remindHtml);
            item.find('[data-behavior="time-ul"]').html(this.timeTemplate());
            if(model){
                item.find('[name="timeStyle"] option[value="'+model.parm.type+'"]').prop('selected',true);
            }

            this.$('[data-behavior="remind-list"]').prepend(item);
        }
	});
});