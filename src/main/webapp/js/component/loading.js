/**
 * fileName:loadingbar
 * createdBy:William
 * date:2014/11/17
 */
define('component/loading',['jquery','backbone','underscore','config'],function(require){
   'use strict';
    var Backbone=require('backbone');
    var _=require('underscore');
    var $=require('jquery');
    var CONFIG		=	require('config');
    var Loading=Backbone.View.extend({
        el:'#loading-bar',
        initialize:function(){

        },
        showLoading:function(message){
            this.$el.show();
            return this;
        },
        hideLoading:function(){
            var loading=this.$el;
            _.delay(function(){
                loading.hide();
            },500);
        }
    });

    return new Loading();
});