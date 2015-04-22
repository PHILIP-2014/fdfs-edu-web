/**
 * fileName:共享链接页面的路由
 * createdBy:Bealiah
 * date:2015/03/03
 */
define('invite.link.router',['parox','views/register/view.register','login'],function(require,exports) {
    'use strict';
    var PAROX=require('parox');
    var $=PAROX.$;
    var _=require('underscore');
    var backbone=require('backbone');
    var tpl1=$('#register-formTpl');
    var tpl2=$('#login-formTpl');
    var tpl3=$('#join-formTpl');
    var registerTpl=tpl1.html()||'</br>';
    var loginTpl=tpl2.html()||'</br>';
    var joinTpl=tpl3.html()||'</br>';

    var attr={
        flag:$('[name="flag"]').val(),
        userId:$('[name="user"]').val(),
        spaceId:$('[name="spaceId"]').val()
    };
    if(attr.flag!='useless'){
        var hash='link/doLink/'+attr.flag;
        window.location.hash=hash;
    }else{
        alert('邀请链接已过期,或空间已被删除');
        window.location.href='/main';
        return false;
    }
    var registerView=require('views/register/view.register');
    var LoginView=require('login');
    var loginView=new LoginView({
        el:'#login-view',
        viewName:'login'
    });
    var util=require('util/util');

    var InviteLinkView=PAROX.View.extend({
        template:{
            login: _.template(loginTpl),
            register: _.template(registerTpl),
            join: _.template(joinTpl),
            return: _.template(joinTpl)
        },
        events:{
            'click [data-behavior="change-view"]':'onChangeViewClick',
            'click [data-behavior="be-member"]':'join'
        },
        initialize:function(){
            this.__viewModel=new backbone.Model({type:attr.flag});
            this.listenTo(this.__viewModel,{
                'change:type':function(model,type){this.changeView(type);}
            });
        },
        join:function(e){
            var spaceId=attr.spaceId;
            $.ajax({
                url:'/colla/workspace/link/agreeJoin',
                data:{
                    spaceId:spaceId
                },
                type:'GET',
                success:function(){
                    window.location.href="/main#workspace/"+spaceId+"/spaceRecentUpdate";
                }
            });
            e.preventDefault();
        },
        changeView:function(type){
            var block=this.$('[data-form-type]');
                block.empty();
            var currentBlock=this.$('[data-form-type="'+type+'"]');
                currentBlock.append(this.template[type]());
            if(type=='join'){
                var html='<button class="btn btn-primary btn-block" data-behavior="be-member">加入项目</button>';
                currentBlock.find('[data-behavior="change-click"]').html(html);
            }

        },

        onShow: $.noop
    });
    var AppRouter=backbone.Router.extend({
        initialize:function(){
            this.doLink=new InviteLinkView({
                el:'#doLink',
                viewName:'doLink',
                type:attr.flag
            });
        },
        routes:{
            'link/:viewName/:type':'switchToInviteView'
        },
        switchToInviteView:function(viewName,type){
            this[viewName].show().set({type:type});

        }
    });
    var appRoute=new AppRouter();
    backbone.history.start();
});