/**
 * file login
 * Created by hetao on 2014/9/4.
 */

define('login',['parox'],function(require){
	'use strict';
	var PAROX		= require('parox');
    var $=PAROX.$;
	var loginModel	=  new PAROX.models.LoginModel();
	return PAROX.View.extend({
		el:'#wrap',
		model:loginModel,
		events:{
			'input input':'onLoginInput',
			'submit form':'onFormSubmit'
		},
		initialize:function(){

		},
		onLoginInput:function(e){
            var input=this.$(e.currentTarget);
            var value= $.trim(input.val());
            var name=input.attr('name');
            if(!value){
                input.parent().removeClass('has-error').find('.verifytip').empty();
                return;
            }
            var arr={};
                arr[name]=value;
            var msg=this.model.validate(arr);
            this.remindTip(msg,input);
		},
		onFormSubmit:function(e){
			var value=this.$(e.currentTarget).serializeArray();
            var arr=PAROX.util.convertArrayToObject(value);
            var msg=this.model.validate(arr);
            if(msg){
                if(msg.interfix=='login-call' && this.$('[data-behavior="login-call"]').length==0){
                    PAROX.alert(msg.info);
                }else if(msg.interfix=='login-call'){
                    this.$('[data-behavior="login-call"]').html(msg.info);
                }else{
                    this.remindTip(msg,this.$('[data-behavior="'+msg.interfix+'"]'));
                }

                return false;
            }
            this.getSpaceCode(arr);
			this.$el.find('button[type="submit"]').html('正在登录');
			arr.returnUrl=this.$('[name="returnUrl"]').val();
			arr.style="";
			delete arr.processUrl;
			$.ajax({
				url:'/login/',
				type:'POST',
				data:arr,
				success:function(){
					window.location.href='/main';
				}
			});
			e.preventDefault();
		},
        remindTip: function (msg,input) {
            var parent;
            if(msg){
                parent=input.parent();
                parent.removeClass('has-success').addClass('has-error');
                if(parent.find('.verifytip').length==0){
                    parent.append("<div class='ver-block verifytip bottom top-right'></div>");
                }
                parent.find('.verifytip').html(msg.info);
            }else{
                parent=input.parent();
                parent.removeClass('has-error').addClass('has-success').find('.verifytip').remove();
            }
        },
        getSpaceCode:function(arr){
            var hash=window.location.hash,num,code,href=window.location.href,array;
            if(hash.indexOf('link')>-1){
                array=href.split('#');
                num=array[0].lastIndexOf('/');
                code=array[0].substring(num+1);
                arr.spaceCode=code;
            }
            if(href.indexOf('returnUrl')>-1){
                array=href.split('returnUrl=');
                var str=String(array[1]);
                var newStr=decodeURIComponent(str);
                num=newStr.lastIndexOf('/');
                code=newStr.substring(num+1);
                arr.spaceCode=code;
            }
        }
	});

});