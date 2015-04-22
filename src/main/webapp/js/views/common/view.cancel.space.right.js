/**
 * fileName:移交工作空间管理权视图
 * createdBy:Bealiah
 * date:2014/11/12
 */

define('viewCommon/view.cancel.space.right',['parox','viewCommon/view.leave.org','collection/collections'],function(require){
    var PAROX=require('parox');
    var _=PAROX._;
    var $=PAROX.$;
    var leave=require('viewCommon/view.leave.org');

    var collection=require('collection/collections');

    var MemberView=PAROX.View.extend({
        tagName:'option',
        initialize: function () {

        },
        render: function () {
            return this.$el.val(this.model.get('userId')).text(this.model.get('user').realName);
        },
        events:{
            'click':'onChooseMemberClick'
        },
        onChooseMemberClick:function(){
            var email=this.model.get('email');
            this.input.prop('value',email);

        }
    });
    return leave.extend({
        memberList:new collection.WorkSpaceUserList(),
        fetch:function(){
            var spaceId=this.get('spaceId');
            if(spaceId===''||spaceId===undefined){
                return;
            }
            this.memberList.fetch({
                data:{
                    spaceId:spaceId
                },
                reset:true,
                remove:true
            });
        },
        updateMemberList:function(){
            this.$('[name="userId"]').empty();
            var me =this.memberList.where({userId:PAROX.USER_ID});
            this.memberList.remove(me);
            if(this.memberList.length>0){
                this.memberList.each(this.addOneMember,this);
            }else{
                this.$('[name="userId"]').append('<option>没有匹配的联系人！</option>');
                this.toggleSubmitBtn(false);
            }
            return this;
        },
        addOneMember:function(model){

            this.itemView=new MemberView({model:model,input:this.input});
            this.$('[name="userId"]').append(this.itemView.render());
        }
    });
});