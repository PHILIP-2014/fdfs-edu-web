
$(function(){  
	JS.Engine.on('notice', function(text){
		//$("#targetDiv").append("<span id='msgSpan' style='color:red'>" + text + "</span>");  
    	var info=null;
    	if(typeof(text)=="string"){
    		info=JSON.parse(text);
    	}else{
    		info=text;
    	}
    	var styleClass='';
    	if(info.notices && info.notices.length>0){
    		$('#notice_count').html(info.notices.length);
        	$('#notice_count').show();
        	$('#notices_zone').empty();
        	$('#notices_zone').append($('<li class="bd-base-b"><p class="text-primary font12 padd-20-l padd-20-r padd-5-t">您收到了'+info.notices.length+'条信息</p></li>'));
        	for(var i=0;i<info.notices.length;i++) {
        		if(info.notices[i].mtype==4 || info.notices[i].mtype==15){
        			styleClass = "paroxicon-at-on";
        		}else if(info.notices[i].mtype==11){
        			styleClass = "paroxicon-addmini-on";
        		}else if(info.notices[i].mtype==21 || info.notices[i].mtype==22){
        			styleClass = "paroxicon-workspaceadd-on";
        		}else if(info.notices[i].mtype==16){
        			styleClass = "paroxicon-share-on";
        		}else{
        			styleClass = "paroxicon-taskagain-on";
        		}
        		$('#notices_zone').append($('<li class="bd-base-b"><a href="'+_CTX_PATH+'/member/notice.htm"><span class="paroxicon '+styleClass+'"></span>'+info.notices[i].summary+'</a></li>'));
        	}
        	$('#notices_zone').append($('<li><a href="'+_CTX_PATH+'/member/notice.htm" id="msgnext">查看所有信息<span class="icon-go pull-right"></span></a></li>'));
    	}else{
    		$('#notice_count').html(0);
        	$('#notice_count').hide();
        	$('#notices_zone').empty();
        	$('#notices_zone').append($('<li><p class="text-primary font12 padd-20-l padd-20-r padd-5-t">您目前没有最新信息</p></li>'));
    	}
    });
    JS.Engine.start(_CTX_PATH+'/conn');
});


/*function init(){
	JS.Engine.on({
		start : function(cId,channels, engine){
			var str = '[start]:<br>'+
			'cId:'+cId+'<br>'+
			'channels:'+channels+'<br>';
			log('Engine_log',str);
			engine.addListener('sender',function(){
				log('Engine_log',"start事件后加事件<br>");
			});
		},		
		sender : function(data, time, engine){
			var str = '[sender]:<br>'+
			'data:'+data+'<br>'+
			'time:'+new Date(time).toLocaleString()+'<br>';
			log('Engine_log',str);
		},		
		stop : function(cause, cId, url, engine){
			var str = '[stop]:<br>'+
			'url:'+url+'<br>'+
			'cId:'+cId+'<br>'+
			'cause:'+cause+'<br>';
			log('Engine_log',str);
		}
	});
	st();
	JS.Engine.addListener('sender',function(){
		log('Engine_log',"start方法后加事件<br>");
	})
}	
function log(id,str){
	var t = document.getElementById(id).innerHTML;
	document.getElementById(id).innerHTML += str;
	document.getElementById(id).scrollTop = document.getElementById(id).scrollHeight;
}
function st(){
	JS.Engine.start('conn');
}

function stop(){
	JS.Engine.stop('客户主动停止');
}

function cls(){
	document.getElementById('Engine_log').innerHTML = '';
}*/