/**
 * fileName:文档评论视图
 * createdBy:William
 * date:2014/9/5
 */
define('viewCommon/document-viewer/document.comment',['parox','viewCommon/comment/view.comment','collection'],function(require){
    var PAROX=require('parox');
    var _=PAROX._;
    var CommentView=require('viewCommon/comment/view.comment');
    var collection=require('collection');
    var commentTpl='<form role="form" class="p-b-20" data-behavior="comment-form">' +
                        '<textarea class="form-control" rows="2"  placeholder="添加评论,用@提及某人"' +
                        'data-behavior="comment-text-area" name="content"></textarea>' +
                            '<div class="clearfix m-t-5">' +
                                '<span class="text-help f-s-12">按 Shift+Enter 键发布，Enter 换行。</span>' +
                                '<button type="submit" type="button" class="btn btn-success pull-right" data-behavior="submit-btn">添加评论</button>' +
                            '</div>' +
                    '</form>' +
                    '<ul class="list-cell list-cell-sm" data-behavior="comment-list"></ul>';
    return PAROX.View.extend({
        tagName:'div',
        template: _.template(commentTpl),
        initialize:function(){
            this.__viewModel=new PAROX.Backbone.Model();
            this.collection=new collection.CommentList();
            this.render();
            this.subView=new CommentView({
                parent:this,
                el:this.el
            });
            this.subView.set({ctype:2}).commentList=this.$('[data-behavior="comment-list"]');

            this.listenTo(this.__viewModel,{
                'change:docId':function(model,docId){
                    this.subView.delegateEvents();
                    this.subView.set({mainId:docId,spaceId:this.parent.model.get('spaceId')});
                }
            });

            this.listenTo(this.collection,{
                reset:this.render
            });
        },
        render:function(){
            this.$el.html(this.template());
        },
        resetTextArea:function(){
            this.$('[data-behavior="comment-text-area"]').val('');
            return this;
        },
        show:function(){
            this.$el.parent().addClass('active')
                .data('isDisplay',true)
                .siblings()
                .removeClass('active')
                .data('isDisplay',false);
            this.subView.show();
            return this;
        }
    });
});