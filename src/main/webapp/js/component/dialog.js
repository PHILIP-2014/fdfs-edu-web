/**
 * fileName:
 * createdBy:William
 * date:2014/8/27
 */
define('component/dialog',['jquery','underscore','backbone'],function(require){
	'use strict';

	var $=require('jquery');
	var _=require('underscore');
	var bb=require('backbone');
	var dialogTpl='<div class="modal-dialog">'+
						'<div class="modal-content">'+
							'<div class="modal-header bg-gray-f5">'+
								'<button type="button" class="close" data-dismiss="modal" data-behavior="close">&times;</button>'+
								'<h5 class="modal-title font-w-b" data-behavior="title"><%=model.get("title")%></h5>'+
							'</div>'+
							'<div class="modal-body">'+
								'<p class="marg-10-t" data-behavior="content"><%=model.get("content")%></p>'+
							'</div>'+
							'<div class="modal-footer bd-un-style">'+
							'<%if(model.get("confirm")){%>'+
								'<button type="submit" class="btn <%=model.getClass()%>" data-behavior="confirm"><%=model.get("confirmText")%></button>'+
							'<%}%>'+
							'<%if(model.get("cancel")){%>'+
							'<button type="submit" class="btn btn-default" data-behavior="cancel"><%=model.get("cancelText")%></button>'+
							'<%}%>'+
							'</div>'+
						'</div>'+
					'</div>';

	var DialogModel=bb.Model.extend({
		defaults:{
			title:'',
			subTitle:'',
			type:'normal',
			confirm:true,
			confirmText:'创建并邀请用户',
			cancel:true,
			cancelText:'取消',
			modal:true,
			autoHide:false,
			onConfirm: $.noop,
			onShow: $.noop,
			onHide: $.noop
		},
		validate:function(attr){
			if(!attr.title){
				return '窗口标题不为能空';
			}
			if(!_.isFunction(attr.onConfirm)){
				return '确定回调必须是函数';
			}
			if(!_.isFunction(attr.onShow)){
				return 'onShow回调必须为函数';
			}

		},
		getClass:function(){
			var type=this.get('type');
			switch (type){
				case 'normal':
					return 'btn-normal';
				case 'danger':
					return 'btn-danger';
				case 'success':
					return 'btn-success';
				case 'warning':
					return 'btn-warning';
			}
		}
	});
	return bb.View.extend({
		className:'modal fade',
		tagName:'div',
		events:{
			'click [data-behavior="confirm"]':'onConfirmBtnClick',
			'click [data-behavior="cancel"]':'onCancelBtnClick',
			'click [data-behavior="close"]':'onCancelBtnClick',
			'click [data-behavior="command"]':'onCommandBtnClick',
			'submit form':'onFormSubmit',
			'click':'onPanelClick',
			'contextmenu':'onPanelClick'
		},
		timer:null,
		attributes:{
			tabindex:-1,
			role:'dialog'
		},
		template: _.template(dialogTpl),
		initialize:function(option){
			this.__viewModel=new DialogModel();
			this.listenTo(this.__viewModel,{
				invalid:function(model,msg){
					$.error(msg);
				}
			});
			this.timer=null;
			this.__isDisplay=false;
			this.set(option,{validate:true});
		},
		$body:$('body'),
		render:function(){
			this.$el.html(this.template({model:this.__viewModel})).appendTo('body');
		},
		set:function(key,value,option){
			this.__viewModel.set(key,value,option);
			return this;
		},
		get:function(key){
			return this.__viewModel.get(key);
		},
		setOption:function(option){
			var events=option.events;
			var template=option.template;
			var model=option.model;
			this.set(option,{validate:true});

			if(template){
				this.template=template;
			}
			if(model){
				this.model=model;
			}
			if(events){
				_.extend(this.events,events);
				for(var key in events){
					if(events.hasOwnProperty(key)){
						var funcName=events[key];
						var func=option[funcName];
						if(!func){
							return this;
						}
						this[funcName]=func;
					}
				}
			}
			return this;
		},
		show:function() {
			var that = this;
			var autoHide = this.get('autoHide');
			var onShow = this.get('onShow');
			var transition = $.support.transition && this.$el.hasClass('fade');

			this.__isDisplay = true;//设置弹窗状态
			this.render();//渲染窗口
			this.delegateEvents();//委托事件

			//this.$body.addClass('modal-open');

			this.$el.show().scrollTop(0);//显示根元素

			this.$el.addClass('in')
				.attr('aria-hidden', false);

			if (transition) {
				this.$el.find('.modal-dialog') // wait for modal to slide in
					.one('bsTransitionEnd', function () {
						//that.$el.trigger('focus');
					}).emulateTransitionEnd(300);
			} else {
				//that.$el.trigger('focus');
			}

			this.modal();
			onShow(this);
			if (autoHide) {
				var delay = _.isNumber(autoHide) ? autoHide : 2000;
				clearInterval(this.timer);
				this.timer=setInterval(_.bind(this.hide,this),delay);
			}

			return this;
		},
		hide:function(){
			var onHide=this.get('onHide');
			var transition=$.support.transition && this.$el.hasClass('fade');

			this.__isDisplay=false;

			//this.$body.removeClass('modal-open');

			this.$el.removeClass('in')
				.attr('aria-hidden', true);

			onHide(this);

			if(transition){
				this.$el.one('bsTransitionEnd', $.proxy(this.hideModal, this))
					.emulateTransitionEnd(300);
			}else{
				this.hideModal();
			}

			return this;
		},
		hideModal:function(){
			var maskLayer=this.maskLayer;
			this.$el.hide().remove();

			if(maskLayer){
				maskLayer.fadeOut(200,function(){
					$(this).remove();
				});
			}
		},
		onConfirmBtnClick:function(e){
			this.get('onConfirm')();
			this.hide();
			e.stopPropagation();
		},
		onCancelBtnClick:function(e){
			this.hide();
			e.stopPropagation();
		},
		onConfirmBtnPress:function(e){
			if(e.which===13){
				this.$(e.currentTarget).trigger('click');
			}
		},
		onPanelClick:function(e){
			//e.preventDefault();
			e.stopPropagation();
		},
		toggleSubmitBtn:function(state){
			var btn=this.$('[data-behavior="confirm"]')[0];
            if(btn){
                btn.disabled=!state;
            }

			return this;
		},
		modal:function () {
			var animate = this.$el.hasClass('fade') ? 'fade' : '';

			if (this.__isDisplay && this.get('modal')) {
				if($('.modal-backdrop').length>0)return;
				this.maskLayer=$('<div class="modal-backdrop"/>').addClass(animate)
					.appendTo(this.$body);

				this.maskLayer.addClass('in');
			}
		},
		onCommandBtnClick:function(e){
			var command=this.$(e.currentTarget).data('command');
			var fn=this[command];
			if(_.isFunction(fn)){
				fn.call(this,e);
			}else{
				alert('此功能还木有完成，敬请期待！');
			}
		},
		onFormSubmit: $.noop
	});
});