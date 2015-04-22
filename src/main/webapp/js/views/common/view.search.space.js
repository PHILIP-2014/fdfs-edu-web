/**
 * fileName:空间搜索视图
 * createdBy:William
 * date:2014/8/15
 */
define('viewCommon/view.search.space',['parox','collection'],function(require){
	'use strict';
	var PAROX=require('parox');
	var _=PAROX._;
	var $=PAROX.$;
	var util=PAROX.util;
	var Dialog=PAROX.component.Dialog;
	var collection=require('collection');

	var SearchList=collection.OrgList.extend({
		url:'/colla/workspace/search/'
	});

	//按索空间的弹窗模板
    var tpl=$('#space-searchTpl');
	var spaceSearchTpl=tpl.html()||'<br>';
        //tpl.remove();
    var spaceItemTpl='<div class="pull-left">' +
                        '<img src="<%=model.getPhoto()%>" class="media-object img-40X40 bdr-5" />' +
                     '</div>' +
                    '<div class="media-body">' +
                        '<div class="m-b-5"><%=model.get(\'orgName\')%></div>' +
                        '<p class="text-muted f-s-12">' +
                            '<%var city=model.get(\'cityArea\')%>' +
                            '<span><%=city?city.name:\'中国\'%></span> · 创建于<span><%=model.formatCreateTime()%></span>' +
                        '</p>' +
                        '<ul class="list-hover list-unstyled">' +
                            '<%_.each(model.get(\'spaces\'),function(space){' +
                                    'var privacy=space.privacy;var isOpen=privacy==1;%>' +
                            '<li class="clearfix">' +
                                '<div class="pull-left">' +
                                    '<span class="icon-12 <%=isOpen?\'icon-12-space-open\':\'icon-12-space-close\'%>"></span><%=space.name%>' +
                                '</div>' +
                                '<div class="pull-right">' +
                                    '<a href="javascript:;" class="text-info" data-behavior="apply" data-type="<%=privacy%>" data-space-id="<%=space.spaceId%>">' +
                                        '<span class="icon-12 icon-12-add m-r-5"></span><%=isOpen?"加入空间":"申请加入"%>' +
                                    '</a>' +
                                '</div>' +
                            '</li>' +
                            '<%})%>' +
                        '</ul>' +
                    '</div>';
	var SpaceItemView=PAROX.View.extend({
		template: _.template(spaceItemTpl),
		tagName:'li',
		className:'media',
		initialize:function(){

		},
		render:function(){
            var privacy=this.model.get('spaces').privacy;
			return this.$el.html(this.template({model:this.model}));
		}
	});

	var SpaceSearchView=Dialog.extend({
		attributes:{
			tabindex:-1,
			role:'dialog',
			'aria-labelledby':'搜索工作空间',
			'aria-hidden':true
		},
		template:_.template(spaceSearchTpl),
		initialize:function(option){
			this.__viewModel=new PAROX.models.DialogModel({
				title:'搜索工作空间',
				keyWord:'',
				t:'',
				size:10
			});

			this.searchList=new SearchList();
            this.events=_.extend({
				'submit form':'onFormSubmit',
				'click [data-behavior="apply"]':'onApplyBtnClick'
			},this.events);
			this.listenTo(this.__viewModel,{
				'change:keyWord':this.search
			});
			this.listenTo(this.searchList,{
				reset:function(){
					this.resultListWrap=this.$('[data-behavior="result-list-wrap"]');
					this.clearResult().renderList();
				}
			});

			this.__isDisplay=false;
			this.set(option,{validate:true});
		},
		onFormSubmit:function(e){
			var param=this.$('form').serializeArray();
			param=util.convertArrayToObject(param);
			param.query=encodeURI(param.query);
			this.search(param);
			e.preventDefault();
		},
		renderList:function(){
            var list=this.searchList;
            if(list.length>0){
                this.searchList.each(this.addOne,this);
            }else{
                this.resultListWrap.append('<li><div class="text-center">对不起，未能搜索到相关空间的结果</div></li>');
            }

		},
		addOne:function(model){
			var itemView=new SpaceItemView({model:model,parent:this});
			this.resultListWrap.append(itemView.render());
		},
		onApplyBtnClick:function(e){
            var btn=this.$(e.currentTarget);
			var spaceId=btn.data('space-id');
            var type=btn.data('type');
			this.applyJoinSpace(spaceId,type);
		},
		applyJoinSpace:function(spaceId,type){
			PAROX.ajax({
				url:'/colla/workspace/apply/'+spaceId,
				success:function(){
                    var text=type==1?'加入成功！':'申请成功！';
					PAROX.message(text);
				}
			});
		},
		search:function(param){
			//0：私有 1：公开 2：全部
			PAROX.ajax({
				url:'/colla/workspace/search/',
				type:'POST',
				data:param,
				success: _.bind(function(resp){
					this.searchList.reset(resp);
				},this)
			});
			return this;
		},
		clearResult:function(){
			this.resultListWrap.empty();
			return this;
		}
	});

	return new SpaceSearchView();
});
