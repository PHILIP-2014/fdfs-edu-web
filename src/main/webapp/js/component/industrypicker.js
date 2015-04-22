/**
 * fileName:行业选择器
 * createdBy:William
 * date:2014/10/22
 */
define('component/industrypicker',['jquery','underscore','backbone','models'],function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var models = require('models');

    var tpl='<%var defId=model.get("defaultId")%>'+
            '<%model.get("collection").each(function(item){%>'+
                '<%var id=item.get("id")%>'+
                '<option value="<%=id%>" defaultId="<%=defId%>" <%=defId==id?"selected":""%>><%=item.get("name")%></option>'+
            '<%})%>';


    return Backbone.View.extend({
        tagName:'select',
        className:'form-control',
        template: _.template(tpl),
        set:function(key,value,option){
            this.__viewModel.set(key,value,option);
            return this;
        },
        get:function(key){
            return this.__viewModel.get(key);
        },
        initialize:function(){

            this.collection=new Backbone.Collection();

            this.__viewModel=new Backbone.Model({
                collection:this.collection,
                defaultId:0
            });
            this.listenTo(this.__viewModel,{
                'change:parentId':this.fetch
            });
            this.listenTo(this.collection,{
                reset:this.render
            });
        },
        fetch:function(model,parentId){
            parentId=Number(parentId);
            if(parentId===undefined|| !_.isNumber(parentId)){
                return false;
            }
            this.collection.fetch({
                url:this.url+parentId,
                reset:true,
                remove:true
            });
        },
        render:function(){
            this.delegateEvents();
            var html=this.collection.length>0?
                this.template({model:this.__viewModel}):
                '<option> ———————— </option>';
            //this.$el.prop('disabled',this.length===0);
            return this.$el.html(html).trigger('change');

        },
        events:{
            'change':'onChange'
        },
        onChange:function(e){
            if(this.subPicker){
                this.subPicker.set({parentId:this.$el.val()});
            }
        }
    });
});