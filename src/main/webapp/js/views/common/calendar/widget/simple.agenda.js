/**
 * fileName:简单日程创建
 * createdBy:William
 * date:2014/11/18
 */

define('viewCommon/calendar/widget/simple.agenda',['parox','viewCommon/calendar/widget/color.picker',
    'collection/common.coll','moment',
    'viewCommon/view.create.space'],function(require){
    'use strict';
    var PAROX=require('parox');
    var _=PAROX._;
    var $=PAROX.$;
    var SpaceCreateView=require('viewCommon/view.create.space');
    var AgendaEditor=require('viewCommon/calendar/widget/agenda');
    var tpl=PAROX.$('#simple-agendaTpl');
    var editTpl=tpl.html()||'<li></li>';
        //tpl.remove();
    var collection=require('collection/common.coll');
    var moment=require('moment');

    return AgendaEditor.extend({
        tagName:'div',
        className:'panel w-lg m-t-20 p-absolute',
        template:_.template(editTpl),

        attributes:{
            tabindex:-1,
            role:'dialog',
            'aria-labelledby':'编辑日程',
            'aria-hidden':true,
            style:'z-index:1000;'
        },
        initialize:function(option){

            this.__viewModel=new PAROX.models.DialogModel({
                schedule:null,
                spaceList:collection.spaceList,
                confirmText:'创建',
                onShow:function(win){
                    win.$('[name="title"]').focus().select();
                }
            });

            this.spaceCreateView=new SpaceCreateView({parent:this});

            this.listenTo(this.__viewModel,{
                'change:schedule':function(model,schedule){
                    this.model=schedule;
                }
            });

            this.events=_.extend({
                'input [name="title"]':'onTitleInput'
            },this.events);
            PAROX.$(window).on('click', _.bind(function(e){
                var target=PAROX.$(e.target);
                if(target.closest('[role="dialog"]').length===0&&target.closest('.fc-view-container').length===0){
                    this.hide();
                }
            },this));
            this.set(option);
            this.__isDisplay=false;
        },
        editAgendaDetail:function(){
            var agenda=this.get('schedule');
            var start=agenda.get('start');
            var end=agenda.get('end');
            var title=this.$('[name="title"]').val();
            start=moment(start);
            end=moment(end);
            this.parent.showFullAgendaCreator(start,end,agenda.get('allDay'),title);
            this.hide();
        },
        show:function(offset){
            var onShow=this.get('onShow');
            this.__isDisplay = true;//设置弹窗状态
            this.render()//渲染窗口
                .delegateEvents();//委托事件
            if(offset){
                this.place(offset);
            }

            this.$el.attr('aria-hidden',false);
            this.$el.appendTo('body').show();
            if(_.isFunction(onShow)){
                onShow(this);
            }
        },
        hide:function(){
            this.__isDisplay=false;
            this.$el.remove();
        },
        place:function(offset){
            var EW=this.$el.width();
            var EH=this.$el.height();
            var WW=$(window).width();
            var WH=$(window).height();
            offset.left=offset.left+EW>WW-200?offset.left-EW:offset.left;
            offset.top=offset.top+EH>WH-200?offset.top-EH:offset.top;
            this.$el.css(offset);
            return this;
        }
    });
});
