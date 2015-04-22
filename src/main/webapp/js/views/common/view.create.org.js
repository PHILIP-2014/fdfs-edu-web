/**
 * fileName:
 * createdBy:William
 * date:2014/8/15
 */
define('viewCommon/view.create.org',['parox','collection/common.coll'],function(require){

	'use strict';
	var PAROX=require('parox');
	var _=PAROX._;
	var $=PAROX.$;
	var util=PAROX.util;
	var Dialog=PAROX.component.Dialog;
	var commonList=require('collection/common.coll');
	var orgList=commonList.orgList;

	//创建组织的弹窗模板
    var tpl=$('#create-orgTpl');
	var orgCreateTpl=tpl.html()||'<br>';
        //tpl.remove();
    var subIndustryPicker=new PAROX.component.IndustryPicker({
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
    });
	var OrgCreateView=Dialog.extend({
		attributes:{
			tabindex:-1,
			role:'dialog',
			'aria-labelledby':'创建组织',
			'aria-hidden':true
		},
		template:_.template(orgCreateTpl),
		initialize:function(option){
			this.__viewModel=new PAROX.models.DialogModel({
				title:'创建组织',
				confirmText:'创建',
				onConfirm:function(attr,dialog){
                    var Id=attr.industryId;
                    attr.industryId=isNaN(Number(Id))?'':Id;
					orgList.create(attr,{
						wait:true,
						success:function(){
							dialog.hide();
							PAROX.message('创建组织成功！');
						}
					});
				}
			});
			this.model=new PAROX.models.OrgModel();
			this.events=_.extend({
				'submit form':'onFormSubmit',
				'input [name="orgName"]':'onOrgNameInput'
			},this.events);
			this.listenTo(this.__viewModel,{
				invalid:function(model,msg){
					$.error(msg);
				}
			});
			this.__isDisplay=false;
			this.set(option,{validate:true});
            industryPicker.__viewModel.set({parentId:0});
		},
        render:function(){
            this.$el.html(this.template({model:this.__viewModel})).appendTo('body');
            this.$('[data-behavior="industry"]').append(industryPicker.render());
            this.$('[data-behavior="sub-industry"]').append(subIndustryPicker.render());
			if(!PAROX.util.browser.supportHTML5()){
				this.$('[name="orgName"]').on('propertychange', _.bind(this.onOrgNameInput,this));
			}
        },
		onOrgNameInput:function(e){
			var $this=this.$(e.currentTarget);
			var val=$this.val();
			if(val){
				this.toggleSubmitBtn(false);
			}else{
				this.toggleSubmitBtn(true);
			}
		},
        onFormSubmit:function(e){
            var arr=this.$('form').serializeArray();
            var attr=util.convertArrayToObject(arr);
            this.get('onConfirm')(attr,this);
            e.preventDefault();
        },
		toggleSubmitBtn:function(isDisabled){
			this.$('[type="submit"]').prop('disabled',isDisabled);
			return this;
		}
	});

	return new OrgCreateView();

});