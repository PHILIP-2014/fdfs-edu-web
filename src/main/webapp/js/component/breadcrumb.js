/**
 * fileName:面包屑
 * createdBy:William
 * date:2014/10/11
 */
define('component/breadcrumb',['jquery','underscore','backbone','models','util/util','config'],function(require) {
    'use strict';
    var $=require('jquery');
    var _ = require('underscore');
    var Backbone=require('backbone');
    var models = require('models');
    var util = require('util/util');
    var CONFIG=require('config');
    var CrumbItem=Backbone.View.extend({
        tagName:'li',
        render:function(){
            var isFirst=this.index===0;
            var model=this.model;
            var name=isFirst?model.get('name'):model.get('folderName');
            var hash= this.getBaseUrl(model,isFirst);
            var $a=$('<a>').attr('href',hash).html(name);

            return this.$el.html($a);
        },
        getBaseUrl:function(model,isFirst,isUpper){
            var granpaName=model.get('parentViewName'),folderId;
            var spaceId=+model.get('spaceId');
            var baseUrl=granpaName.indexOf('space')>-1?
                '#workspace/'+spaceId+'/spaceDocument/'+granpaName+'/':
                '#member/discovery/document/'+granpaName+'/'+spaceId+'/';
            if(isUpper){
                folderId=model.get('parentId');
            }else{
                folderId=isFirst?0:+model.get('folderId');
            }
            return baseUrl+folderId;
        },
        renderUpperLevel:function(){
            if(this.model.collection.length==1)return;
           var isFirst=this.index===0;
            var model=this.model;
            var hash=this.getBaseUrl(model,isFirst,true);
            var $b=$('<a>').attr('href',hash).html('返回上一级');
            this.$el.parent().prepend($('<li>').html($b));

        }
    });

    return Backbone.View.extend({
        initialize:function(option){
            this.__viewModel=new Backbone.Model();
            this.listenTo(this.__viewModel,{
                'change:folderId':function(model,folderId){
                    this.requestFolderPath(folderId);
                }
            });
            this.listenTo(this.collection,{
                reset:function(){
                    this.clear().render();
                }
            });
        },
        requestFolderPath:function(folderId){
            $.ajax({
                url:CONFIG.REQUEST_URL.FOLDER_BREAD_CRUMB+folderId,
                data:{
                    spaceId:this.get('spaceId')
                },
                success: _.bind(this.success,this)
            });
        },
        success:function(resp){
            var viewName=this.parent.viewName;
            var spaceArr=[resp.space];
            var paths=resp.path||[];
            var pathArr=spaceArr.concat(paths);
            _.each(pathArr,function(crumb){
                crumb.parentViewName=viewName;
            });
            if(pathArr.length===0){
                pathArr.push({
                    name:'获取文件夹路径出错！'
                });
            }
            this.collection.reset(pathArr);
            this.renderOrgName(resp.organization);
        },
        set:function(key,value,option){
            this.__viewModel.set(key,value,option);
            return this;
        },
        get:function(key){
            return this.__viewModel.get(key);
        },
        clear:function(){
            this.$el.find('ol').empty();
            return this;
        },
        render:function(){
            this.collection.each(this.addOne,this);
            return this;
        },
        renderOrgName:function(org){
            org=org||{orgName:'获取组织名称出错！'};
            this.$('[data-behavior="org-name"]').html(org.orgName);
        },
        addOne:function(model,i){
            var itemView=new CrumbItem({
                model:model,
                parent:this,
                index:i
            });

            this.$el.find('ol').append(itemView.render());
            if(i==model.collection.length-1){
                itemView.renderUpperLevel();
            }

        }
    });
});