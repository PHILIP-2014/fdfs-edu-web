/****
 * auther:Bealiah
 * company:PAROX
 * explain:this is a simple guide.
 * 2014.1-15
 ****/
/**
 * 处理事件 doAssistStep doEvent doStep
 * 判断启动事件  judgeStart
 * 请求数据---状态 ajaxFunction
 **********
 * 衔接辅助 data-guide-assist='0-0'  /辅助的步骤  可有
 * 事件 data-guide-event='0'          必须
 * 子步骤  data-guide-step='0-0'   /子的步骤  可有
 * 判断是否引导 data-guide-run
 * */
define('baby-guide',function(require){
    var $=require('jquery');
    var addBlingIcon={};
    var bling='<img src="../images/guide/bling.gif" style="position:absolute;z-index:999;" />';//事件焦点光标
    var eventId;
        addBlingIcon.judgeStart=function(state,menu){//判断是否启动引导
            var len=state.length;
                state=state.substring(0,len-1);

            if(state.indexOf('0')!=-1){
                var method=menu.isDisplay()?'hide':'show';
                    menu[method]();
                var arr=state.split('');
                if(arr[0]==1){
                    if(arr[1]==0 && arr[2]==1){
                        eventId=1;
                    }else{
                        eventId=2;
                    }
                }else if(arr[1]==1 && arr[2]==1){
                    eventId=0;
                }else{
                    eventId=3;//all isn't done;
                }

                initializeState(eventId);
            }
        };
        addBlingIcon.focusChildItem=function(eventId,num,factor){};
        addBlingIcon.focusEventItem=function(eventId,num,factor){};
        addBlingIcon.doAssistStep=function(e){};
        addBlingIcon.doEvent=function(e){};
        addBlingIcon.doStep=function(e){};

    function initializeState(eventId){
        if(eventId==3){
            addBling(0,0);
            addBling(1,0);
            addBling(2,0);
        }else{
            addBling(eventId,0);
        }
        $.fn.extend({guide:guide()});
    }
    function addBling(eventId,num,factor){
        var assistItem=$('[data-guide-assist="'+eventId+'-'+num+'"]');
        var eventItem=$('[data-guide-event="'+eventId+'"]');
        var isRun,nextAssist,newNum=num+1;
        var newId=eventId+1;

        if(factor==1){
            nextAssist=$('[data-guide-assist="'+eventId+'-'+newNum+'"]');
            if(nextAssist.length>0){
                nextAssist.after($(bling).attr('data-bling','a-'+eventId+'-'+num));
                getPosition('a-'+eventId+'-'+num);
            }
            else if(eventItem.length>0){
                eventItem.after($(bling).attr('data-bling','e-'+eventId));
                getPosition('e-'+eventId);
            }

            return;

        }
        if(factor==2){
            var stepItem=$('[data-guide-step="'+eventId+'-0"]');
            nextAssist=$('[data-guide-assist="'+newId+'-0"]');
            if(stepItem.length>0){
                stepItem.after($(bling).attr('data-bling','s-'+eventId+'-0'));
            }else if(nextAssist.length>0){
                isRun=function(eventId){
                    newId=eventId+1;
                    nextAssist.after($(bling).attr('data-bling','a-'+newId+'-0'));
                    getPosition('a-'+newId+'-0');
                };
                ajaxFunction(eventId,isRun);

            }else{
                isRun=function(eventId){
                    newId=eventId+1;
                    $('[data-guide-event="'+newId+'"]').after($(bling).attr('data-bling','e-'+newId));
                    getPosition('e-'+newId);
                };
                ajaxFunction(eventId,isRun);

            }
            return ;
        }
        if(factor==3){
            var nextStep=$('[data-guide-step="'+eventId+'-'+newNum+'"]');
            var nextEvent=$('[data-guide-event="'+newId+'"]');
            nextAssist=$('[data-guide-assist="'+newId+'-0"]');
            if(nextStep.length>0){
                nextStep.after($(bling).attr('data-bling','s-'+eventId+'-'+newNum));
                getPosition('s-'+eventId+'-'+newNum);
            }else if(nextAssist.length>0){
                isRun=function(eventId){
                    newId=eventId+1;
                    nextAssist.after($(bling).attr('data-bling', 'a-' + newId + '-0'));
                    getPosition('a-' + newId + '-0');
                };
                ajaxFunction(eventId,isRun);

            }else{
                isRun=function(){
                    newId=eventId+1;
                    nextEvent.after($(bling).attr('data-bling','e-'+newId));
                    getPosition('e-'+newId);
                };
                ajaxFunction(eventId,isRun);


            }
            return ;
        }

        if(assistItem.length>0){
            assistItem.after($(bling).attr('data-bling','a-'+eventId+'-'+num));
            getPosition('a-'+eventId+'-'+num);
        }else if(eventItem.length>0){
            eventItem.after($(bling).attr('data-bling','e-'+eventId));
            getPosition('e-'+eventId);
        }

    }
    function ajaxFunction(id,isRun){
        $.ajax({
            url:'/core/user/guide?flag='+id,
            type:'GET',
            success:function(data){
                var str=data.message;
                var len=str.length;
                var state=str.substring(0,len-1);
                var arr=state.split('');
                if(state.indexOf('0')==-1)return false;
                if(arr[0]==1){
                    if(arr[1]==0 && arr[2]==1){
                        eventId=1;
                    }else{
                        eventId=2;
                    }
                }else if(arr[1]==1 && arr[2]==1){
                    eventId=0;
                }else{
                    eventId=3;//all isn't done;
                }
                isRun(eventId);
            }
        });

    }
    function guide(){
        var unit = "px",position={};
        $(document).on('click','[data-guide-assist]',function(e){
            addBlingIcon.doAssistStep(e);
        });
        $(document).on('click','[data-guide-event]',function(e){
            addBlingIcon.doEvent(e);
        });
        $(document).on('click','input[data-guide-step]',function(e){
            addBlingIcon.doStep(e);
        });
        addBlingIcon.focusEventItem=function(item){//后加载元素
            if(eventId!=0){
                if(eventId==3 || item.data('guide-event')==eventId) {
                    var id='e-' + item.data('guide-event');
                    item.after($(bling).attr('data-bling', id));
                    getPosition(id);
                }
            }
        };
        addBlingIcon.focusChildItem=function(item){//后加载元素
            if(eventId!=0){
                if(eventId==3 || item.data('guide-step')==eventId){
                    var id='s-'+item.data('guide-step');
                    item.after($(bling).attr('data-bling',id));
                }

            }
        };
        addBlingIcon.doAssistStep=function(e){
            var item=$(e.currentTarget);
            var str=item.data('guide-assist');
            var arr=str?str.split('-'):[];

            item.siblings('[data-bling="a-'+str+'"]').remove();
            addBling(arr[1],arr[2],1);

        };
        addBlingIcon.doEvent=function(e){
            var item=$(e.currentTarget);
            var eventId=item.data('guide-event');
            item.siblings('[data-bling="e-'+eventId+'"]').remove();
            addBling(eventId,'',2);
        };
        addBlingIcon.doStep=function(e){
            var item=$(e.currentTarget);
            var str=item.data('guide-step');
            var arr=str?str.split('-'):[];
            var eventId=arr[0];
            var nun=eventId+1;
            item.siblings('[data-bling="s-'+str+'"]').remove();
            addBling(arr[0],arr[1],3);
            $('[data-bling="a-'+str+'"]').remove();//attention
            $('[data-bling="e-'+eventId+'"]').remove();

        };

    }
    /*function getPosition(it){
        if(it=='e-0'){
        	$('[data-bling="'+id+'"]').css({'left':'25px','top':'30px'});
        }
        if(it==""){
        	$('[data-bling="'+id+'"]').css({'left':'10','top':''});
        }
     }*/
    return  addBlingIcon;

});



