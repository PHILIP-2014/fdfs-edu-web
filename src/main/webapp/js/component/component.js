/**
 * fileName:
 * createdBy:William
 * date:2014/8/25
 */
define('component/component',['underscore','component/dialog','component/file.uploader',
    'component/breadcrumb','component/datetimepicker','component/industrypicker'],function(require){
	'use strict';
    var _=require('underscore');
	var Dialog=require('component/dialog');
	var fileUploader=require('component/file.uploader');
    var Crumb=require('component/breadcrumb');
    var DateTimePicker=require('component/datetimepicker');
    var IndustryPicker=require('component/industrypicker');
    var msgTpl='<button type="button" class="close" data-dismiss="alert" data-behavior="close"><span>×</span></button>'+
        '<strong><%=model.get("content")%></strong>';
    return {
		Dialog:Dialog,
		fileUploader:fileUploader,
        Crumb:Crumb,
        DateTimePicker:DateTimePicker,
        Message:Dialog.extend({
            tagName:'div',
            className:'alert alert-dismissable fade',
            attributes:{
                role:'alert'
            },
            template: _.template(msgTpl),
            render:function(){
                this.$el.html(this.template({model:this.__viewModel})).appendTo('body')
                    .addClass('alert-'+this.get('type'));
            }
        }),
        IndustryPicker:IndustryPicker
	};
});