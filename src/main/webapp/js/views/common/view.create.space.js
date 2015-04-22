/**
 * fileName:
 * createdBy:William
 * date:2014/8/15
 */
define('viewCommon/view.create.space',['parox','collection/common.coll','viewCommon/view.search.space',
    'collection/collections','viewCommon/view.create.org'],function(require){
	'use strict';
	var PAROX=require('parox');
	var _=PAROX._;
	var $=PAROX.$;
	var util=PAROX.util;
	var Dialog=PAROX.component.Dialog;
	var commonList=require('collection/common.coll');
	var orgList=commonList.orgList;
	var spaceSearchView=require('viewCommon/view.search.space');
    var collection=require('collection/collections');
    var CreateOrgView=require('viewCommon/view.create.org');


	//创建空间的弹窗模板
    var tpl=$('#create-spaceTpl');
	var spaceCreateTpl=tpl.html()||'<br>';
        //tpl.remove();

	return Dialog.extend({
		attributes:{
			tabindex:-1,
			role:'dialog',
			'aria-labelledby':'创建工作空间',
			'aria-hidden':true
		},
        onPanelClick:function(){

        },
        onCancelBtnClick:function(){
            this.hide();
        },
		template:_.template(spaceCreateTpl),
        orgList:new collection.OrgInnerList(),
		initialize:function(option){
			this.__viewModel=new PAROX.models.DialogModel({
				title:'创建工作空间',
				confirmText:'创建',
				onConfirm:function(attr,dialog){
                    var org=orgList.findWhere({orgId:attr.orgId});
                    if(org){
                        var spaceList=org.get('spaceList');
                    }

					var space=new PAROX.models.SpaceModel();
					space.save(attr,{
						wait:true,
						success:function(data){
							dialog.hide();
							PAROX.message('创建空间成功！');
						}
					});

					if(spaceList){
						spaceList.add(space);
					}
                    commonList.spaceList.add(space);

				},onShow: _.bind(function(){
                    this.orgList.fetch({
                        reset:true,
                        remove:true
                    });
                },this)

			});
            this.listenTo(this.orgList,'reset',this.renderOrgList);
			this.model=new PAROX.models.SpaceModel();
            this.events=_.extend({
				'click [data-behavior="search-space"]':'onSearchBtnClick',
                'change [name="privacy"]':'onPrivacyChange',
				'submit form':'onFormSubmit',
                'click [data-behavior="create-org"]':'onCreateOrgClick'
			},this.events);
			this.listenTo(this.__viewModel,{
				invalid:function(model,msg){
					$.error(msg);
				}
			});
			this.__isDisplay=false;
			this.set(option,{validate:true});
		},
        renderOrgList:function(){
            var html='';
            if(this.orgList.length==0){
                html+='<option>没有可创建空间的组织,自己新建个组织吧</option>';
            }else{
                this.orgList.each(function(model){
                    html+='<option value="'+model.get('orgId')+'">'+model.get('orgName')+'</option>';

                });
            }

            this.$('select').append(html);

        },
		onConfirmBtnClick:function(){
			var arr=this.$('form').serializeArray();
			var attr=util.convertArrayToObject(arr);

			attr.orgId=Number(attr.orgId);
			var msg=this.model.validate(attr);
			if(msg){
				PAROX.alert(msg);
				return false;
			}
			this.get('onConfirm')(attr,this);
			this.model.clear();
		},
		onSearchBtnClick:function(){
			spaceSearchView.show();
			this.hide();
		},
        onCreateOrgClick:function(){
            CreateOrgView.show();
            this.hide();
        },
		onFormSubmit:function(e){
			this.onConfirmBtnClick();
			e.preventDefault();
		},
        onPrivacyChange:function(e){
            this.toggleCheckbox(e.currentTarget.value==1);
        },
        toggleCheckbox:function(bool){
            var method=bool?'addClass':'removeClass';
            this.$('[data-behavior="allow-invite"]')
                .prop('disabled',bool)
                .parent()[method]('text-help');
            this.$('[data-behavior="allow-display"]')
                .prop('disabled',bool)
                .parent()[method]('text-help');
        }
	});
});