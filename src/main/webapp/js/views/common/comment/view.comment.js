/**
 * fileName:
 * createdBy:William
 * date:2014/9/2
 */
define('viewCommon/comment/view.comment',['parox','collection/collections','viewCommon/comment/view.base.comment',
    'viewCommon/mention'],function(require){
    'use strict';
    var PAROX=require('parox');
    var _=PAROX._;
    var $=PAROX.$;
    var collection=require('collection/collections');
    var CommentList=collection.CommentList;
    var tpl=$('#comment-itemTpl');
    var commentItemTpl=tpl.html();
    commentItemTpl=commentItemTpl||'<li></li>';
    var BaseCommentView=require('viewCommon/comment/view.base.comment');
    var Mention=require('viewCommon/mention');
    var childCommentItemTpl='<a href="<%=comment.getUserLink()%>" class="pull-left">' +
        '<img src="<%=comment.getPhoto()%>" class="img-30X30 media-object bdr-5">' +
        '</a>' +
        '<div class="media-body">' +
        '<h4>' +
        '<a href="<%=comment.getUserLink()%>" class="text-primary"><%=comment.getRealName()%></a>' +
        '<span>回复</span>' +
        '<a href="<%=comment.getRepliedUserLink()%>" class="text-primary"><%=comment.getRepliedUserName()%></a>' +
        '<span class="text-info">(<%=comment.formatDate()%>)</span>' +
        '</h4>' +
        '<p> <%=comment.get(\'content\')%></p>' +
        '<div class="text-right f-s-12">' +
        ' <%if (comment.isEditable()){%>'+
        '<a href="javascript:;" class="text-primary p-r-10 bd-r-gray" data-behavior="remove-comment">删除</a>' +
        '<%}%>'+
        '<a href="javascript:;" class="text-primary p-l-10" data-behavior="child-reply-comment">回复</a>' +
        '</div>' +
        '</div>';

    var CommentItemView=PAROX.View.extend({
        tagName:'li',
        template:PAROX._.template(commentItemTpl),
        events:{
            'click [data-behavior="remove-comment"]':'onRemoveBtnClick',
            'click [data-behavior="reply-comment"]':'onReplyBtnClick',
            'keydown [data-behavior="child-comment-text-area"]':'onCommentTextAreaKeyPress',
            'submit [data-behavior="child-comment-form"]':'onFormSubmit'
        },
        initialize:function(){
            this.listenTo(this.model,{
                destroy:this.remove
            });
            this.mentions=new PAROX.Backbone.Collection();
        },
        render:function(){
            this.$el.html(this.template({comment:this.model}));
            this.mention=new Mention({
                el:this.$('[data-behavior="child-comment-text-area"]'),
                spaceId:this.spaceId,
                selectChange: _.bind(function(user){
                    this.mentions.add(user);
                },this)
            });
            return this;
        },
        showReplyForm:function(){
            var textSelector=this.textArea;
            this.$(this.form).slideDown(300,function(){
                PAROX.$(this).find(textSelector).focus();
            });
            return this;
        },
        hideReplyForm:function(){
            this.$(this.form).slideUp(300);
            return this;
        },
        toggleReplyForm:function(){
            var method=this.$(this.form).is(':visible')?'hideReplyForm':'showReplyForm';
            this[method].call(this);
        },
        onRemoveBtnClick:function(e){
            var model=this.model;
            PAROX.confirm(PAROX.LANG.COMMENT.DELETE_CONFIRM,function(){
                model.destroy({
                    wait:true,
                    success:function(){
                        PAROX.message(PAROX.LANG.COMMENT.DELETE_SUCCESS);
                    }
                });
            });
            //e.stopPropagation();
        },
        onReplyBtnClick:function(e){
            var attr={
                userName:this.model.getRealName(),
                repliedUserId:this.model.get('user').userId
            };
            this.setFormData(attr);
            this.toggleReplyForm();
            e.stopPropagation();
        },
        setFormData:function(attr){
            var form=this.$(this.form);
            form.find('textarea').attr('placeholder','回复@'+attr.userName);
            form.find('[name="repliedUserId"]').val(attr.repliedUserId);
            return this;
        },
        onCommentTextAreaKeyPress:function(e){
            if(e.which===13&& e.shiftKey){
                var $this=this.$(e.currentTarget);
                $this.closest('form').submit();
                e.preventDefault();
            }
        },
        onFormSubmit:function(e){
            var $form=this.$(e.currentTarget);
            var values=$form.serializeArray();
            var attr=PAROX.util.convertArrayToObject(values);
            var textArea=this.$(e.currentTarget).find('textarea');
            this.createComment(attr);
            textArea.val('');
            e.preventDefault();
        },
        createComment:function(attr){
            attr.content=PAROX.$.trim(attr.content);
            if(!attr.content){
                PAROX.alert(PAROX.LANG.COMMENT.NULL);
                return;
            }

            var model=new PAROX.models.CommentModel();
            attr=this.handleContent(attr);
            model.save(attr,{
                wait:true,
                validate:true,
                success: _.bind(function(model){
                    PAROX.message(PAROX.LANG.COMMENT.SUCCESS);
                    this.parent.fetch();
                    if(this.mentions.length===0)return;
                    this.mentionSomeone(model.get('commentId'));
                },this),
                error:function(){
                    PAROX.alert(arguments[1].statusText);
                }
            });
        },
        handleContent:function(attr){
            var content=attr.content;
            var mentions=this.mentions.clone();
            if(mentions.length===0)return attr;
            mentions.each(function(user){
                var realName='@'+user.getName();
                var link='<a href="#user/'+user.get('userId')+'/user-introduction">'+realName+'</a>';
                if(content.indexOf(realName)>-1){
                    content=content.replace(realName,link);
                }else{
                    this.mentions.remove(user);
                }

            },this);
            attr.content=content;

            return attr;
        },
        mentionSomeone:function(commentId){
            PAROX.ajax({
                url:'/colla/comment/mention',
                data:{
                    commentId:commentId,
                    userIds:this.mentions.pluck('userId').join(',')
                },
                complete: _.bind(function(){
                    this.mentions.reset();
                },this)
            });
        }

    });
    var ChildCommentItemView=CommentItemView.extend({
        tagName:'div',
        className:'media',
        template:PAROX._.template(childCommentItemTpl),
        onReplyBtnClick:function(){
            var granpa=this.parent.parent;
            var model=this.model;

            var attr={
                userName:model.getRealName(),
                repliedUserId:model.get('userId')
            };
            granpa.showReplyForm();
            granpa.setFormData(attr);
        },
        events:{
            'click [data-behavior="remove-comment"]':'onRemoveBtnClick',
            'click [data-behavior="child-reply-comment"]':'onReplyBtnClick'
        }
    });
    var ChildCommentView=BaseCommentView.extend({
        tagName:'div',
        className:'',
        render:function(){
            this.collection.each(function(model){
                this.addOneComment(model);
            },this);
            return this;
        },
        addOneComment:function(model,method){
            var itemView=new ChildCommentItemView({
                model:model,
                form:'[data-behavior="grand-comment-form"]',
                textArea:'[data-behavior="grand-comment-text-area"]',
                parent:this
            });
            method=method||'append';
            this.$el[method](itemView.render().$el);
        },
        listenToCollection:function(){
            this.listenTo(this.collection,{
                reset:function(){
                    this.clearComment().render();
                    this.show();
                },
                invalid:function(model,error){
                },
                add:function(model){
                    this.addOneComment(model,'append');
                }
            });
        }
    });
    return BaseCommentView.extend({
        render:function(){
            this.collection.each(function(model){
                this.addOneComment(model);
            },this);
            return this;
        },
        addOneComment:function(model,method){
            var spaceId=this.get('spaceId');
            var itemView=new CommentItemView({
                model:model,
                form:'[data-behavior="child-comment-form"]',
                textArea:'[data-behavior="child-comment-text-area"]',
                parent:this,
                spaceId:spaceId
            });
            var child=model.get('child');
            var itemElement=itemView.render().$el;

            method=method||'append';
            if(child){
                var childCommentView=new ChildCommentView({parent:itemView});
                childCommentView.collection.reset(child,{
                    parse:function(resp){
                        _.each(resp,function(item){
                            var comment=item.comment;
                            comment.child=item.child;
                            comment.user=item.user;
                            comment.repliedUser=item.repliedUser;
                        });
                        return resp;
                    }
                });
                itemElement.find('[data-behavior="child-comment-wrap"]').append(childCommentView.$el);
            }
            this.commentList[method](itemElement);
        }
    });
});