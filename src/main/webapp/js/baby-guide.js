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
    var bling='<img src="../images/guide/bling.gif" style="position:absolute;z-index:999;width: 30px; height: 30px;left:120px;top:5px;" />';//事件焦点光标
    var array,isRun,newArr;
        addBlingIcon.judgeStart=function(state,menu){//判断是否启动引导
            var len=state.length;
            if(len<5)return;
            if(state.indexOf('0')!=-1){
                var method=menu.isDisplay()?'hide':'show';
                    menu[method]();
                array=state.split('');

                isRun=true;
                initializeState(array);
            }
        };
        addBlingIcon.focusItem=function(item){};
        addBlingIcon.doStep=function(e){};

    function initializeState(arr){
        BlingState(0,arr[0]);
        BlingState(1,arr[1]);
        BlingState(2,arr[2]);
        BlingState(3,arr[3]);
        BlingState(4,arr[4]);

        $.fn.extend({guide:guide()});
    }
    function BlingState(idx){
        if(array[idx]==1)return;
        $('[data-guide-point="'+idx+'"]').after($(bling).attr('data-bling',idx));
        getPosition(idx);
    }
	function getPosition(id){
		if(id=='0'){
			$('[data-bling="'+id+'"]').css({'left':'35px','top':'30px'});
		}
        if(id=="1"){
            $('[data-bling="'+id+'"]').css({'left':'120px','top':'5px'});
        }
        if(id=="2"){
            $('[data-bling="'+id+'"]').css({'left':'auto','right':'20px',top:'120px'});
        }
        if(id=="3"){
			$('[data-bling="'+id+'"]').css({'left':'85px','top':'50px'});
		}
		if(id=="4"){
			$('[data-bling="'+id+'"]').css({'left':'100px','top':'20px'});
		}
	}

    function ajaxFunction(id,callback){
        $.ajax({
            url:'/core/user/guide?flag='+id,
            type:'GET',
            success:callback
        });
    }
    function guide(){
        $(document).on('click','[data-guide-point]',function(e){
            addBlingIcon.doStep(e);
        });
        addBlingIcon.doStep=function(e){
            if(!isRun) return;

            var item=$(e.currentTarget);
            var idx=item.data('guide-point');

            if(array[idx]=="1") return ;

            ajaxFunction(idx,function(resp){
                if(resp.success){
                    item.siblings('[data-bling="'+idx+'"]').remove();
                    if(resp.message == "11111") {
                        isRun = false;
                    }
                    array[idx]="1";
                }
            });
        };
		addBlingIcon.focusItem=function(item){//后加载元素
            if(!isRun)return;

            var id=item.data('guide-point');
            if(id==1 && array[1]==1)return;
            if(array[id]==0){
                item.after($(bling).attr('data-bling', id));
                getPosition(id);
            }
		};


    }
    return  addBlingIcon;

});



