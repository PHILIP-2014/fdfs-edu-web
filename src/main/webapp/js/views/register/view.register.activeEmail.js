/**
 * file:acitve email
 * Created by hetao on 2014/10/15.
 */
define('views/register/view.register.activeEmail',['parox','jquery','config'],function(require){
    'use strict';
    var PAROX 	= require('parox');
    var $		= require('jquery');
    var CONFIG	= require('config');

    /*var subIndustryPicker=new PAROX.component.IndustryPicker({
     url:PAROX.CONFIG.REQUEST_URL.INDUSTRY_LIST,
     attributes:{
     name:'industryId'
     }
     });
     var industryPicker=new PAROX.component.IndustryPicker({
     subPicker:subIndustryPicker,
     url:PAROX.CONFIG.REQUEST_URL.INDUSTRY_LIST,
     attributes:{
     name:'industryCatId'
     }
     });*/

    var registerActiveEmailModel	= new PAROX.models.RegisterActiveEmailModel();
    var RegisterActiveEmailView =  PAROX.Backbone.View.extend({
        el:'#p-register',
        model:registerActiveEmailModel,
        viewName:'registerActiveEmail',
        events:{
            'keyup input':'onInputKeyUp',
            'blur input':'onInputKeyUp',
            'change input#isService':'onInputKeyUp',
            'submit form':'onSubmitSendActive'
        },
        initialize:function(){
            this.render();

            this.listenTo(this.model,'invalid',function(model,msg){
                if(msg.realNameStatus){
                    this.$('#realName').parent('div').removeClass('has-error').find('.verifytip ').html(msg.realNameInfo);
                }else{
                    this.$('#realName').parent('div').addClass('has-error').find('.verifytip ').html(msg.realNameInfo);
                    return false;
                }

                if(msg.passwordStatus){
                    this.$('#password').parent('div').removeClass('has-error').find('.verifytip ').html(msg.passwordInfo);
                }else{
                    this.$('#password').parent('div').addClass('has-error').find('.verifytip ').html(msg.passwordInfo);
                    return false;
                }

                if(msg.passwordConfirmStatus){
                    this.$('#passwordConfirm').parent('div').removeClass('has-error').find('.verifytip ').html(msg.passwordConfirmInfo);
                }else{
                    this.$('#passwordConfirm').parent('div').addClass('has-error').find('.verifytip ').html(msg.passwordConfirmInfo);
                    return false;
                }

                if(msg.isServiceStatus){
                    this.$('#isService').parent('label').parent('div.checkbox').removeClass('has-error').find('.verifytip ').html('');
                }else{
                    this.$('#isService').parent('label').parent('div.checkbox').addClass('has-error').find('.verifytip ').html(msg.isServiceInfo);
                    return false;
                }
            });

            $('.btn-login').on('click',function(){
                location.replace(CONFIG.REQUEST_URL.LOGIN);
            });
            /*industryPicker.__viewModel.set({parentId:1});*/
        },
        render:function(){
            /*this.$('[data-behavior="industry"]').append(industryPicker.render());
             this.$('[data-behavior="sub-industry"]').append(subIndustryPicker.render());*/
            return this;
        },
        onInputKeyUp:function(e){
            var value = {
                realName:this.$el.find('#realName').val(),
                password:this.$el.find('#password').val(),
                passwordConfirm:this.$el.find('#passwordConfirm').val(),
                isService:this.$el.find('#isService').prop('checked')
            };
            this.model.set(value,{validate:true});
        },
        onSubmitSendActive:function(e){
            if(this.$el.find('.has-error').length>0){
                return this;
            }else{
                $.ajax({
                    url:CONFIG.REQUEST_URL.REGISTER + 'accomplish/',
                    async:false,
                    type:'post',
                    data:this.$("form").serialize(),
                    success:function(d){
                        if(d.returnUrl){
                            location.replace(d.returnUrl);
                        }else{
                            location.replace(CONFIG.REQUEST_URL.DASHBOARD);
                        }

                    }
                });
            }
        }
    });

    return new RegisterActiveEmailView();
});