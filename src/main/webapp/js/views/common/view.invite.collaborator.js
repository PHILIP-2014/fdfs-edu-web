/**
 * fileName:
 * createdBy:Bealiah
 * date:2014/8/15
 */
define('viewCommon/view.invite.collaborator',['parox','viewCommon/view.create.space','collection'],function(require){
	'use strict';
	var PAROX=require('parox');
	var $=PAROX.$;
	var _=PAROX._;
    var tpl=$('#add-to-spaceTpl');
	var spaceInviteTpl=tpl.html()||'<br>';
        //tpl.remove();
	var inviteTpl=PAROX._.template(spaceInviteTpl);
	var SpaceCreateView=require('viewCommon/view.create.space');
	var verEmail=PAROX.util.validate.verEmail;
	var itemTpl='<%=model.getEmail()%><span class="m-l-5 icon-hover cur-p" data-behavior="remove">&times;</span>';
	var collection=require('collection');
	var contactList=new collection.ContactsList();

	var contactsItemTpl='<a href="javascript:;">'+
						'<img src="<%=model.getPhoto()%>" class="img-20X20 m-r-3">'+
						'<span><%=model.getName()%>(<%=model.getEmail()%>)</span>'+
						'</a>';

	//公用集合，已经实例化
	var commonList=require('collection/common.coll');

	var Collaborator=PAROX.Backbone.Model.extend({
		validate:function(attr){
			if(attr.email){
				if(!verEmail(attr.email))
				return '邮箱格式不正确，请重新输入！';
			}
		},
		getEmail:function(){
			return this.get('email');
		}
	});
	var Collaborators=PAROX.Backbone.Collection.extend({
		model:Collaborator
	});

	var spaceCreateView=new SpaceCreateView();
	//协作者列表项视图
	var CollaboratorItemView=PAROX.View.extend({
		tagName:'li',
		template: _.template(itemTpl),
		className:'user-block',
		/*attributes:{
			'style':'border: 1px solid #ddd; border-radius: 3px;'
		},*/
		initialize:function(){
			this.listenTo(this.model,{
				remove:this.remove
			});
		},
		events:{
			'click [data-behavior="remove"]':'onRemoveBtnClick'
		},
		render:function(){
			return this.$el.html(this.template({model:this.model}));
		},
		onRemoveBtnClick:function(e){
			var model=this.model;
			var collection=this.parent.collection;
			collection.remove(model);
		}
	});

	//联系人列表项视图
	var ContactsItemView=PAROX.View.extend({
		tagName:'li',
		template: _.template(contactsItemTpl),
		render:function(){
			return this.$el.html(this.template({model:this.model}))
		},
		events:{
			'click':'onClick'
		},
		onClick:function(e){
			var model=this.model;
			var collaborators=this.parent.collection;
			var user=model.get('user');
			var userId=user.userId;

			if(collaborators.where({userId:userId}).length>0){
				PAROX.alert('已选择此用户！');
			}else{
				collaborators.add(model);
			}
			this.parent.clearInput();
		}
	});


	return PAROX.component.Dialog.extend({
		attributes:{
			tabindex:-1,
			role:'dialog',
			'aria-labelledby':'邀请协作者',
			'aria-hidden':true
		},
        onCancelBtnClick:function(){
            this.hide();
        },
		template:inviteTpl,
        judgeManagerModel:new PAROX.models.JudgeManagerModel,
		initialize:function(option){

			this.__viewModel=new PAROX.models.DialogModel({
				title:'邀请协作者',
                spaceId:0,
				keyWord:null,
				isInSpace:false,//是否在空间内部,在空间内部时，不允许选择空间
				allowSelect:true,//是否允许选择已有联系人,
                showContactsList:true,//是否提供联系人列表
				onHide: _.bind(function(){
					this.set({keyWord:null,spaceId:0},{silent:true});
					this.collection.reset();
				},this),
                onShow: _.bind(function(){
                    this.spaceList.fetch({
                        data:{
                            invitable:true
                        },
                        remove:true,
                        reset:true
                    });
                },this)
			});
            this.spaceList=new collection.SpaceList();
            this.listenTo(this.spaceList,'reset',this.fetchRight);
			this.collection=new Collaborators();
			this.contacts=contactList;
			this.model=new Collaborator();
            this.events=_.extend({
				'click [data-behavior="create-space"]':'onCreateBtnClick',
				'input [data-behavior="email-input"]':'onEmailInput',
				'click [data-behavior="email-input"]':'onEmailInputClick',
				'focusout [data-behavior="email-input"]':'onEmailInputFocusOut',
				'focusin [data-behavior="email-input"]':'onEmailInputFocusIn',
				'keypress [data-behavior="email-input"]':'onEmailInputEnter',
                'change select[name="spaceId"]':'onSelectSpace',
				'submit form':'onFormSubmit'
			},this.events);
			this.listenTo(this.__viewModel,{
				invalid:function(model,msg){
					$.error(msg);
				},
				'change:keyWord':function(model,key){
					this.clearContacts()
						.search(key);
				}
			});

			this.listenTo(this.model,{
				change:function(model){
					this.collection.add(model.toJSON());
					model.clear({silent:true});
				},
				invalid:function(model,msg){
					this.showErrorMessage(msg);
				}
			});
			this.listenTo(this.collection,{
				add:function(model){
					this.addOne(model);
					this.toggleSubmitBtn(true);
				},
				reset:this.renderInviteList,
				remove:function(model,collection){
					if(collection.length===0){
						this.toggleSubmitBtn(false);
					}
				}
			});

			this.listenTo(this.contacts,{
				reset:this.renderContacts
			});

			this.__isDisplay=false;
			this.set(option,{validate:true});
			this.success=true;
		},
        fetchRight:function(){
            this.judgeManagerModel.fetch({
                success:PAROX._.bind(this.renderSpaceList,this)
            });
        },
        renderSpaceList:function(){
            var roleSelect=this.$('select[name="roleType"]');
            var html='',sId=this.__viewModel.get('spaceId');
            var space='s'+sId;
            var isJudgeRight=this.judgeManagerModel.get(space);
            var isInSpace=this.spaceList.where({spaceId:sId});
            if(isInSpace.length==0 && sId!=0){
                html+='<option selected >该空间设置了不能邀请</option>';
            }
            else{
                this.spaceList.each(function(model){
                    var isChecked=sId==model.get('spaceId')?'selected':'';
                    if(isChecked=='selected'){
                        html='<option value="'+model.get('spaceId')+'" selected  >'+model.get('name')+'</option>';
                        if(isJudgeRight==false ){
                            roleSelect.prop('disabled',true);
                        }else{
                            roleSelect.prop('disabled',false);
                        }
                        return false;
                    }
                    html+='<option value="'+model.get('spaceId')+'" '+isChecked+'  >'+model.get('name')+'</option>';
                });
            }

            this.$('[name="spaceId"]').html(html).trigger('change');
        },
		renderInviteList:function(){
			this.collection.each(this.addOne,this);
			return this;
		},
		addOne:function(model){
			var itemView=new CollaboratorItemView({model:model,parent:this});
			var html=itemView.render();
			if(this.get('allowSelect')){
				this.$('[data-behavior="email-input"]').parent().before(html);
			}else{
				this.$('[data-behavior="colla-list-wrap"]').append(html);
				this.toggleSubmitBtn(true);
			}
		},
		addOneSpace:function(model){
			var option=$('<option>').val(model.get('spaceId')).html(model.get('name')).prop('selected',true);
			this.$('select[name="spaceId"]').append(option);
		},
		renderContacts:function(){
            if(this.contacts.length>0){
                this.contacts.each(this.addOneContact,this);
                this.$('[data-behavior="drop-down"]').addClass('open');
            }else{
                //this.$('[data-behavior="contact-list"]').append('<li class="text-help f-s-12 p-5">没有匹配的联系人！</li>');
                this.$('[data-behavior="drop-down"]').removeClass('open');
            }
			return this;
		},
		addOneContact:function(model){
			var itemView=new ContactsItemView({model:model,parent:this});
			this.$('[data-behavior="contact-list"]').append(itemView.render());
		},
		showErrorMessage:function(msg){
			this.$('[data-behavior="notification"]').html(msg);
		},
		postEmail:function(attr){
			PAROX.ajax({
				url:PAROX.CONFIG.REQUEST_URL.INVITE_FROM_ANY,
				type:'POST',
				data:attr,
				success: _.bind(function(resp){
					var fail= [],success=[];
					for(var key in resp){
						var item=resp[key];
						if(item.success){
							success.push(key);
						}else{
							fail.push(key);
						}
					}
					this.hide();
					PAROX.message('邀请发送完成！成功：'+success.length+'个邀请,失败：'+fail.length+'个邀请。');
				},this)
			});
		},
        onSelectSpace:function(e) {
			var val = this.$(e.currentTarget).val();
			var space = 's' + val;
			this.$('select[name="roleType"] option[value="2"]').prop('selected',true);
			this.$('select[name="roleType"]').prop('disabled', !this.judgeManagerModel.get(space));
		},

		onFormSubmit:function(e){
			var arr=this.$(e.currentTarget).serializeArray();
			var attr=PAROX.util.convertArrayToObject(arr);
			var collection=this.collection;
			var spaceId=this.get('spaceId');
			var emails,userIds,target;
			if(spaceId!==0){
				attr.spaceId=spaceId;
			}
			attr.roleType=attr.roleType || 2;

            emails=_.without(collection.pluck('email'),undefined);
			emails= _.without(emails,null);
            userIds= _.without(collection.pluck('userId'),undefined);
			userIds= _.without(userIds,null);
            target=emails.concat(userIds);
            attr.target=target.join(',');
            this.postEmail(attr);
            collection.reset();
            this.get('onConfirm')(attr,this);
			e.preventDefault();
		},
		onEmailInputClick:function(e){
            if(this.get('showContactsList')){
                this.openDropDown();
            }

			this.__viewModel.set('keyWord','');
			e.stopPropagation();
		},
		onEmailInput:function(e){
			var value=this.$(e.currentTarget).val();
			if(value===''&&this.collection.length>0){
				this.toggleSubmitBtn(true);
				this.showErrorMessage('输入正确');
				return;
			}
			this.set({keyWord:value});

			var attr={email:value};
			var msg=this.model.validate(attr);
			if(msg){
				this.showErrorMessage(msg);
				this.toggleSubmitBtn(false);
			}else{
				this.showErrorMessage('输入正确');
				this.toggleSubmitBtn(true);
			}

		},
		onEmailInputFocusIn:function(e){
			this.toggleSubmitBtn(false);
		},
		handleValue:function(value){
			if(value===''&&this.collection.length>0){
				this.toggleSubmitBtn(true);
				return true;
			}else if(value===''&&this.collection.length===0){
				this.toggleSubmitBtn(false);
				return false;
			}
			var attr={email:value};
			var msg=this.model.validate(attr);
			if(msg){
				this.showErrorMessage(msg);
				this.toggleSubmitBtn(false);
				return false;
			}else{
				this.model.set(attr);
				this.toggleSubmitBtn(true);
				return true;
			}
		},
		onEmailInputFocusOut:function(e){
			var $this=this.$(e.currentTarget);
			var value=$this.val();
			var isValid=this.handleValue(value);
			if(isValid){
				$this.val('');
			}
            if(e.relatedTarget){
                if(e.relatedTarget.type==='submit'){
                    this.$('form').submit();
                }
            }

		},
		onEmailInputEnter:function(e){
			if(e.which===13){
				var $this=this.$(e.currentTarget);
				var isValid=this.handleValue($this.val());
				if(isValid){
					$this.val('');
				}
				e.preventDefault();
			}
		},
		onCreateBtnClick:function(){
			var callback=function(attr,win){
				var model=new PAROX.models.SpaceModel();
				model.save(attr,{
					beforeSend:function(){
						PAROX.showLoading('正在创建空间，请稍候......');
					},
					success: _.bind(function(){
						PAROX.message('创建空间成功！');
						commonList.spaceList.add(model);
						var org=commonList.orgList.findWhere({orgId:Number(attr.orgId)});
						org.get('spaceList').add(model);
						this.addOneSpace(model);
						win.hide();
					},this),
					complete:PAROX.hideLoading
				});
			};
			spaceCreateView.set({
				onConfirm: _.bind(callback,this)
			}).show();
		},
		clearInput:function(){
			this.$('[data-behavior="email-input"]').val('');
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
		toggleSubmitBtn:function(isDisabled){
			this.$('[type="submit"]').prop('disabled',!isDisabled);
			return this;
		},
		search:function(key){
			if(this.success){
				this.success=false;
                if(this.get('showContactsList')){
                    this.contacts.fetch({
                        data:{
                            start:0,
                            limit:500,
                            key:key
                        },
                        remove:true,
                        reset:true,
                        complete:PAROX._.bind(function(){
                            this.success=true;
                        },this)
                    });
                }

			}
		},
		clearContacts:function(){
			this.$('[data-behavior="contact-list"]').empty();
			return this;
		}
	});
});