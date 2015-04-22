/**
 * fileName:任务追踪者视图
 * createdBy:William
 * date:2014/9/3
 */
define('viewCommon/task-edit/view.task.user.list',['parox','collection/collections'],function(require){
	'use strict';
	var PAROX=require('parox');
    var _=PAROX._;
    var $=PAROX.$;
    var collection=require('collection/collections');

    var itemTpl='<img src="<%=model.getPhoto()%>" class="img-30X30 bdr-3">' +
                '<span class="m-l-5 m-r-5"><%=model.getUserName()%></span>' +
                '<%if(model.get(\'editAble\')){%>' +
                    '<span class="m-r-5 cur-p icon-hover" data-behavior="remove-user">&times;</span>' +
                '<%}%>';
    var searchItem='<a href="javascript:;" class="text-overflow">'+
        '<img src="<%=model.getPhoto()%>" class="img-30X30 bdr-3 m-r-5"><%=model.getName()%>'+
        '</a>';


    var SearchItemView=PAROX.View.extend({
        template: _.template(searchItem),
        attributes:{
            role:'presentation'
        },
        events:{
            'click':'onListItemClick'
        },
        tagName:'li',
        onListItemClick:function(e){
            this.parent.selectChange(this.model);
            this.parent.toggleDropDown('hide');
            e.stopPropagation();
        },
        render:function(){
            return this.$el.html(this.template({model:this.model}));
        }
    });
    var UserItemView= PAROX.View.extend({
        tagName:'div',
        className:'accepter-block',
        template:PAROX._.template(itemTpl),
        initialize:function(){
            this.listenTo(this.model,{
                'destroy':this.remove,
                'change':this.render
            });
        },

        render:function(){
            this.$el.html(this.template({model:this.model}));
            return this;
        },
        onRemoveTaskUserBtnClick:function(){
            this.model.destroy({
                wait:true,
                success:function(){
                    PAROX.message('删除成功');
                }
            });

        },
        events:{
            'click [data-behavior="remove-user"]':'onRemoveTaskUserBtnClick'
        }
    });

	var ClassificationView=PAROX.ManageView.extend({
        tagName:'div',
        className:'media m-b-5',
        type:0,
        typeTexts:'未接受_进行中_已完成'.split('_'),
        classes:'text-info_text-primary_text-success'.split('_'),
		initialize:function(option){
            //实例化时，传入类型，由类型决显示的样式及标题，共四种类型，0:未开始,1:进行中,2:已完成,3：追踪者
            var type=this.type;

            if(type===3){
                this.$listWrap=this.$el;
            }else{
                var $title=$('<div class="pull-left p-t-5"></div>');
                var text=this.typeTexts[type];
                var className=this.classes[type];
                var $listWrap=this.$listWrap=$('<div class="media-body"></div>');
                this.$el.append($title.addClass(className).text(text)).append($listWrap);
            }

            this.__viewModel=new PAROX.Backbone.Model();

			this.listenTo(this.__viewModel,{
                'change:editAble':function(){
                    this.toggleEditAble();
                }
            });

			this.listenTo(this.collection, {
				reset: function () {
					this.render();
				},
				add:this.addOne
			});
            this.set(option,{silent:true});
		},
		render:function(){
			this.collection.each(this.addOne,this);
            return this.$el;
		},
		addOne:function(model){
			var itemView=new UserItemView({model:model,parent:this});
			this.$listWrap.append(itemView.render().$el);
		}
	});

    return PAROX.View.extend({
        type:'assign',
        initialize:function(){
            var self=this;
            this.__viewModel=new PAROX.Backbone.Model();

            this.collaborators=new collection.WorkSpaceUserList();
            this.spaceCollaList=new collection.WorkSpaceUserList();

            this.success=true;
            this.searchListWrap=this.$('[data-behavior="space-user-list"]');
            this.$typeListWrap=this.$('[data-behavior="type-list-wrap"]');

            this.listenTo(this.__viewModel,{
                'change:task':function(model,task){
                    var taskId=task.get('taskId');
                    this.reset().set({taskId:taskId,editAble:task.get('editAble')}).fetch(taskId);
                    this.toggleDropDown('hide');
                    this.$('[data-behavior="search-user"]').trigger('focusout');
                },
                'change:realNameFuzzy':function(model,realNameFuzzy){
                    this.search(realNameFuzzy);
                },
                'change:editAble':function(){
                    this.toggleEditAble();
                }
            });

            this.listenTo(this.collection, {
                reset: function () {
                    this.empty().render();
                },
                remove:function(){
                    this.fetch();
                }
            });

            this.listenTo(this.collaborators,{
                reset:function(){
                    this.clear().renderSearchList();
                }
            });
            this.collection.parse=function(resp){
                var task=self.get('task');
                var isEditAble=task.get('editAble');
                _.each(resp,function(item){
                    _.extend(item,item.taskUser,item.profile);
                    item.editAble=isEditAble;
                });
                return resp;
            };

            PAROX.$(document).on('click', _.bind(function(e){
                this.toggleDropDown('hide');
            },this));
        },
        reset:function(){
            this.success=true;
            this.searchListWrap.empty();
            this.set({realNameFuzzy:''},{silent:true});
            return this;
        },
        fetch:function(taskId){
            taskId=taskId||this.get('taskId');
            this.collection.fetch({
                data:{
                    taskId:taskId
                },
                reset:true,
                remove:true
            });
            return this;
        },
        render:function(){
            var $wrap=this.$typeListWrap;
            var list=this.collection;
            if(this.viewName==='assign'){
                var userId=this.get('task').get('userId');

                //筛选出任务创建者
                var exceptMe=list.filter(function(item){
                    return item.get('userId')!==userId;
                });

                list.reset(exceptMe,{silent:true});

                //筛选出三种状态的用户，未开始，进行中，已完成
                var unStartUsers=list.where({status:0});
                var onProgressUsers=list.where({status:1});
                var completeUsers=list.filter(function(item){
                    return item.get('status')>=2;
                });

                _.each([unStartUsers,onProgressUsers,completeUsers],function(userList,index){
                    //如果每种状态的用户数量大于0，则渲染相应视图，否则不渲染
                    if(userList.length>0){
                        var collaboratorClassifyView=new ClassificationView({
                            type:index,
                            collection:new collection.TaskAssignList(userList),
                            parent:this
                        });
                        $wrap.append(collaboratorClassifyView.render());
                    }
                });
            }else{
                var TaskFollowerView=new ClassificationView({
                    type:3,
                    parent:this,
                    collection:list
                });
                $wrap.append(TaskFollowerView.render());
            }

            return this;
        },
        empty:function(){
            this.$typeListWrap.empty();
            return this;
        },
        addTaskUser:function(taskId,userId){
            var attr={
                taskId:taskId,
                userId:userId
            };
            this.collection.create(attr,{
                wait:true,
                success: _.bind(function(){
                    PAROX.message('分配任务成功！');
                    this.fetch();
                    this.parent.changeTaskBody=true;
                },this)
            });
        },
        events:{
            'click [data-behavior="drop-down"]':'onDropDownBtnClick',
            'focusout [data-behavior="search-user"]':'onSearchInputFocusOut',
            'focusin [data-behavior="search-user"]':'onSearchInputFocusIn',
            'click [data-behavior="search-user"]':'onSearchInputClick',
            'input [data-behavior="search-user"]':'onSearchInput'
        },
        onSearchInputClick:function(e){
            e.stopPropagation();
        },
        onSearchInput:function(e){
            var key=this.$(e.currentTarget).val();
            this.set({realNameFuzzy:key});
        },
        onSearchInputFocusIn:function(){
            this.search('');
            this.toggleDropDown('show');
        },
        onDropDownBtnClick:function(e){
            var $this=this.$(e.currentTarget);
            $this.hide().siblings('input').show().focus();
            this.onDropDown.call(this.parent);
            e.stopPropagation();
        },
        selectChange: function(user){
            this.addTaskUser(this.get('taskId'),user.get('userId'));
        },
        onSearchInputFocusOut:function(e){
            this.$(e.currentTarget).hide().val('').siblings('a').show();
        },
        renderSearchList:function(){
            if(this.collaborators.length===0){
                this.searchListWrap.append('<li role="presentation"><span class="text-help f-s-12 p-5">未找到匹配的协作者</span></li>');
            }
            var arr,userId=this.get('task').get('userId'),viewName=this.viewName;
            if(viewName=='assign'){
                    arr=this.collection.pluck('userId');
            }else{
                var array=this.collection.pluck('user');
                this.newCollection=new PAROX.Backbone.Collection(array);
                arr=this.newCollection.pluck('userId');
            }
            var list=this.collaborators.filter(function(item){
                var id=item.get('userId');
                if(viewName=='assign'){
                    return id!=userId && arr.indexOf(id)==-1;
                }else{
                    return arr.indexOf(id)==-1;
                }
            });
            if(list.length==0){
                this.searchListWrap.append('<li role="presentation"><span class="text-help f-s-12 p-5">还未有协作者</span></li>');
            }
            this.spaceCollaList.reset(list);
            this.spaceCollaList.each(this.addOneSearchResult,this);
        },
        clear:function(){
            this.searchListWrap.empty();
            return this;
        },
        addOneSearchResult:function(model){
            var itemView=new SearchItemView({
                model:model,
                parent:this
            });

            this.searchListWrap.append(itemView.render());
        },
        search:function(realNameFuzzy){
            var spaceId=this.parent.get('spaceId');
            if(this.success&&spaceId!==''&&spaceId!==undefined){
                this.success=false;
                var param={
                    start:0,
                    limit:500,
                    realNameFuzzy:encodeURIComponent(realNameFuzzy),
                    spaceId:spaceId
                };
                this.collaborators.fetch({
                    data:param,
                    remove:true,
                    reset:true,
                    complete:_.bind(this.initSuccess,this)
                });
            }
        },
        toggleEditAble:function(){
            var editAble=this.get('editAble');
            var method=editAble?'show':'hide';
            this.collection.each(function(model){
                model.set({editAble:editAble});
            });
            this.$('[data-behavior="drop-down"]')[method]();
        },
        toggleDropDown:function(method){
            this.searchListWrap[method]();
            return this;
        },
        initSuccess:function(){
            this.success=true;
        },
        onDropDown: $.noop
    });
});