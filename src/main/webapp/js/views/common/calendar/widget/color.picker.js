/**
 * fileName:颜色拾取器
 * createdBy:William
 * date:2014/10/18
 */
define('viewCommon/calendar/widget/color.picker',['parox'],function(require) {
    'use strict';
    var PAROX = require('parox');
    var _ = PAROX._;
    var $=PAROX.$;
    var itemTpl='<div></div>';
    var colors=[
        '#b1d0f6',
        '#f0dcff',
        '#aff1d9',
        '#d1ebb6',
        '#fdecb0',
        '#ffddbe',
        '#feb9ac'
    ];
    var ColorItemView=PAROX.View.extend({
        tagName:'div',
        className:'sc-label',
        template: _.template(itemTpl),
        initialize:function(){
            this.listenTo(this.model,{
               'change:checked':function(model,checked){
                   this.toggleCheckedView(checked);
                   if(checked){
                       this.parent.get('onColorChange')(model.get('color'));
                   }
               }
            });

        },
        toggleCheckedView:function(checked){

            var method=checked?'addClass':'removeClass';
            this.$el.children()[method]('sc-label-check');
            return this;
        },
        render:function(){
            var color=this.model.get('color');
            this.$el.html(this.template({model:this.model}))
                .css({
                    background:color
                });
            if(color===this.color){
                this.model.set('checked',true);
            }
            return this.$el;
        },
        events:{
            'click':'onColorItemClick'
        },
        onColorItemClick:function(){
            var model=this.model;
            model.collection.each(function(item){
                item.set({checked:false});
            });
            model.set({checked:true});

        }
    });

    return PAROX.View.extend({
        tagName:'div',
        initialize:function(option){
            var colorArr=[];
            _.each(colors,function(color){
                colorArr.push({
                    color:color,
                    checked:false
                })
            });

            this.__viewModel=new PAROX.Backbone.Model({
                collection:new PAROX.Backbone.Collection(colorArr),
                color:'',
                onColorChange: $.noop
            });
            this.set(option);
        },
        render:function(){
            var colors=this.get('collection');
            colors.each(this.addOne,this);
            return this.$el;
        },
        addOne:function(model){
            var itemView=new ColorItemView({
                model:model,
                color:this.get('color'),
                parent:this
            });
            this.$el.append(itemView.render());
        },
        selectColorByIndex:function(index){
            this.get('collection').at(index).set({checked:true});
        }
    });
});