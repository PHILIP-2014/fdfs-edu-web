/**
 * fileName:提及某人的功能
 * createdBy:William
 * date:2014/11/5
 */
define('viewCommon/mention',['parox','collection'],function(require){
    'use strict';
    var PAROX=require('parox');
    var $ = PAROX.$;
    var _ = PAROX._;
    var collection=require('collection');

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

            this.selectChange(this.model);
            this.parent.hide();
            e.stopPropagation();
        },
        render:function(){
            return this.$el.html(this.template({model:this.model}));
        }
    });
    var DropDown=PAROX.View.extend({
        tagName:'div',
        className:'dropdown-menu p-un',
        initialize:function(){
            this.success=true;
            this.listWrap=$('<ul class="w-sm col-list"></ul>');
            this.defMsg=$('<li role="presentation"><span class="text-help f-s-12 p-5">未找到匹配的协作者</span></li>');
            this.$el.append('<div><input type="text" class="w-100-p outline-un form-control bdr-un bd-un bd-b-gray" placeholder="输入用户名或者邮箱查找协作者"/></div>')
                .append(this.listWrap);

            this.__viewModel=new PAROX.Backbone.Model();
            this.collection=new collection.WorkSpaceUserList();

            this.listenTo(this.__viewModel,{
                'change:keyWord':function(model,key){
                    this.search(key);
                }
            });

            this.listenTo(this.collection,{
                reset:function(){
                    this.clear().render();
                }
            });
            $(document).on('click', _.bind(function(){
                this.hide();
            },this));
        },
        show:function(){
            var isSupportHTML5=PAROX.util.browser.supportHTML5();
            this.__isDisplay=true;
            this.search('');
            this.delegateEvents();
            this.$el.appendTo('body');
            this.$el.show();
            if(isSupportHTML5){
                this.$('input').focus();
            }
            if(!isSupportHTML5){
                this.$('input').on('propertychange', _.bind(this.onInputBaxInput,this));
            }
        },
        hide:function(){
            this.__isDisplay=false;
            this.initSuccess();
            this.$el.hide();
            this.$('input').val('');
        },
        place:function(offset){
            var width=this.$el.width();
            var height=this.$el.height();
            var W=$(window).width();
            var H=$(window).height();

            offset.left=offset.left+width>W?offset.left-width-20:offset.left;
            offset.top=offset.top+height>H?offset.top-height:offset.top+30;
          /* *//* offset.left-=15;*//*
            offset.top+=30;*/
            this.$el.css(offset);
            return this;
        },
        render:function(){
            if(this.collection.length===0){
                this.listWrap.append(this.defMsg);
            }else{
                this.defMsg.remove();
                this.collection.each(this.addOne,this);
            }
        },
        clear:function(){
            this.listWrap.empty();
            return this;
        },
        addOne:function(model){
            var itemView=new SearchItemView({
                model:model,
                parent:this,
                selectChange:this.get('selectChange')
            });

            this.listWrap.append(itemView.render());
        },
        search:function(key){
            var spaceId=this.get('spaceId');
            if(this.success&&spaceId){
                this.success=false;
                var param={
                    start:0,
                    limit:500,
                    realNameFuzzy:encodeURIComponent(key),
                    spaceId:spaceId
                };
                this.collection.fetch({
                    data:param,
                    remove:true,
                    reset:true,
                    complete:_.bind(this.initSuccess,this),
                    error:_.bind(this.initSuccess,this),
                    success:_.bind(this.initSuccess,this)
                });
            }
        },
        initSuccess:function(){
            this.success=true;
        },
        events:{
            'focusin input':'onInputBaxFocusIn',
            'click input':'onInputBaxClick',
            'focusout input':'onInputBaxFocusOut',
            'input input':'onInputBaxInput'
        },
        onInputBaxClick:function(e){
            e.stopPropagation();
        },
        onInputBaxInput:function(e){
            var key=this.$(e.currentTarget).val();
            this.set({keyWord:key});
        }
    });
    var searchPanel=new DropDown();
    return PAROX.View.extend({
        initialize: function (option) {
            this.__viewModel=new PAROX.Backbone.Model({
                information:'您想@谁呢?',
                selectChange: $.noop
            });

            this.dropDown=searchPanel;
            this.set(option);
        },
        _CSS: {
            'visibility': 'hidden',
            'display': 'inline-block',
            'position': 'absolute',
            'z-index': -100,
            'word-wrap': 'break-word',
            'word-break': 'break-all',
            'overflow': 'hidden'
        },
        events:{
            'keypress':'onKeyPress',
            'keyup':'onKeyUp',
            'input':'onInput',
            'click':'onClick'
        },
        onKeyPress:function(e){
            if(e.which===64&& e.shiftKey){
                this.showDropDown();
            }
        },
        onKeyUp:function(e){
            if(e.which===50&& e.shiftKey){
               this.showDropDown();
            }
        },
        onClick:function(){
            this.dropDown.hide();
        },
        showDropDown:function(){
            if(this.dropDown.__isDisplay){
                return false;
            }
            var offset=this.getCursorOffset();

            this.dropDown.place(offset).set({
                spaceId:this.get('spaceId'),
                selectChange: _.bind(this.onSelected,this)
            }).show(offset);
        },
        onInput:function(e){
            var val=this.getValue();
            var index=this.getCursor();
            var str=val.substring(0,index);
            var isLastStr=PAROX.util.isLastCharacter('@',str);
            if(isLastStr){
                this.showDropDown();
            }
        },
        onSelected:function(model){
            this.insertAtCursor(model.getName()+' ');

            this.get('selectChange')(model);
        },
        getValue:function(){
            return this.$el.val();
        },
        setValue:function(val){
            this.$el.val(val);
            return this;
        },
        // 获取光标在文本框的位置
        getCursor: function () {
            var textArea=this.$el[0];
            var index = 0;
            if (document.selection) {// IE Support
                textArea.focus();
                var Sel = document.selection.createRange();
                if (textArea.nodeName === 'TEXTAREA') {//textarea
                    var Sel2 = Sel.duplicate();
                    Sel2.moveToElementText(textArea);
                    var index = -1;
                    while (Sel2.inRange(Sel)) {
                        Sel2.moveStart('character');
                        index++;
                    }
                }
                else if (textArea.nodeName === 'INPUT') {// input
                    Sel.moveStart('character', -textArea.value.length);
                    index = Sel.text.length;
                }
            }
            else if (textArea.selectionStart || textArea.selectionStart == '0') { // Firefox support
                index = textArea.selectionStart;
            }
            return (index);
        },
        positionElement:$('<div>'),
        focusElement:$('<span>'),
        textElement:$('<span>'),
        //取得光标所在位置的坐标
        getCursorOffset: function () {
            var textArea=this.$el[0];
            if (document.selection) {   //IE Support
                textArea.focus();
                var Sel = document.selection.createRange();
                return {
                    left: Sel.boundingLeft,
                    top: Sel.boundingTop,
                    bottom: Sel.boundingTop + Sel.boundingHeight
                };
            } else {
                var cloneDiv = '{$clone_div}',
                    cloneLeft = '{$cloneLeft}',
                    cloneFocus = '{$cloneFocus}';

                var none = '<span style="white-space:pre-wrap;"> </span>';

                var $div = textArea[cloneDiv] || this.positionElement,
                    $focus = textArea[cloneFocus] || this.focusElement,
                    $text = textArea[cloneLeft] || this.textElement;

                var offset = $(textArea).offset(),
                    index = this.getCursor(textArea);
                var strTmp = this.getValue().substring(0, index).replace(/</g, '<').replace(/>/g, '>').replace(/\n/g, '<br/>').replace(/\s/g, none);
                if (!textArea[cloneDiv]) {

                    textArea[cloneDiv] = $div;
                    textArea[cloneFocus] = $focus;
                    textArea[cloneLeft] = $text;

                    $div.append($text).append($focus).css($.extend(true, this._CSS, {
                        width: $(textArea).outerWidth(),
                        height: $(textArea).outerHeight()
                    }));
                    $focus.html('|').css(this._CSS).css({
                        'width': 0
                    });

                    $('body').append($div);

                }
                $div.css(offset);

                $text.html(strTmp);

                return $focus.offset();
            }
        },
        //向光标所在位置插入字符串
        insertAtCursor: function (myValue) {
            var textArea = this.$el[0];
            var sel;
            if (document.selection) {
                sel = document.selection.createRange();
                sel.text = myValue;
                textArea.focus();
            } else if (textArea.selectionStart || textArea.selectionStart == '0') {
                var startPos = textArea.selectionStart;
                var endPos = textArea.selectionEnd;
                var scrollTop = textArea.scrollTop;
                var val = this.getValue();
                var val1 = val.substring(0, startPos) + myValue;
                var val2 = val.substring(endPos, textArea.value.length);

                this.setValue(val1 + ' ' + val2);
                textArea.focus();
                textArea.selectionStart = startPos + myValue.length;
                textArea.selectionEnd = startPos + myValue.length;
                textArea.scrollTop = scrollTop;
            } else {
                textArea.value += myValue;
                textArea.focus();
            }
        }
    });
});