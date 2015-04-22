
(function (w, d) {
	if (!window.Parox) {window.Parox = {};}
	var loading='<div class="text-center marg-10 padd-10 clearfix"><img alt="加载中..." src="'+_CTX_PATH+'/images/common/ajax-loader.gif"></div>';
	var pAjax={
			Ajax:{
				ajaxGet:function(url, func){
					Parox.Ajax.ajax(url, '', 'GET', func, true);
				},
				ajaxLoad:function(url, data, div, func) {
					if(jQuery(div).length>0){//property
						jQuery(div).html(loading);
						Parox.Ajax.ajax(url, data, 'LOAD', function(data){jQuery(div).html(data);if(func){func(data);}});
					}else{//id
						jQuery('#'+div).html(loading);
						Parox.Ajax.ajax(url, data, 'LOAD', function(data){jQuery('#'+div).html(data);if(func){func(data);}});
					}
				},
				ajaxAppend:function(url, data, div, func) {
					if(jQuery(div).length>0){//property
						jQuery(div).append(loading);
						Parox.Ajax.ajax(url, data, 'LOAD', function(data){
							jQuery(div).html(jQuery(div).html().replace(loading,''));
							jQuery(div).append(data);
							if(func){
								func(data);
							}
						});
					}else{//id
						jQuery('#'+div).append(loading);
						Parox.Ajax.ajax(url, data, 'LOAD', function(data){
							jQuery('#'+div).html(jQuery('#'+div).html().replace(loading,''));
							jQuery('#'+div).append(data);
							if(func){func(data);}
						});
					}
				},
				ajaxPost:function(url, data, func) {
					Parox.Ajax.ajax(url, data, 'POST', function(data){if(func){func(data);}} );
				},
				postData:function(opt) {
					 var url = opt.url,
					 	data = opt.data||{},
					 	func = opt.func||function(data){},
					 	btn = opt.btn;
					 if(btn){
						 jQuery(btn).each(function(){jQuery(this).addClass('loader');jQuery(this).attr('disabled','disabled');});
					 }
					 Parox.Ajax.ajax(url, data, 'POST', func, function(XMLHttpRequest,textStatus){
						 if(btn){
							 jQuery(btn).each(function(){jQuery(this).removeClass('loader');jQuery(this).attr('disabled',false);});
						 }
					 });
				},
				ajax:function(url, data, type, func, completeFunc){ 	
					if (url.indexOf('?') == -1) {
						url += "?";
					}else{
						url += "&";
					}
					url += "timeStamp=" + new Date().getTime();
					if(type=='GET')
					{
						jQuery.ajax({ url: url,
							type: 'GET',
							data: data,
							cache: false,
							timeout: 1000*180,
							error: function() {alert('数据加载失败，可能是网络连接问题或者服务器错误。'); },
							/*error:function(XMLHttpRequest, textStatus, errorThrown){  
								alert(XMLHttpRequest.responseText)
								alert(textStatus)
								alert(errorThrown)
							},*/
							success: func
							/*complete:function(XMLHttpRequest, textStatus){
                                    var sessionstate=XMLHttpRequest.getResponseHeader("sessionstate"); //通过XMLHttpRequest取得响应头，sessionstatus，
                                    if(sessionstate=="timeout"){
                                        alertLogin();
                                    }
                                    if(completeFunc){
                                        completeFunc(XMLHttpRequest,textStatus);
                                    }
							}*/
						});
					}else if(type=='LOAD'){
						jQuery.ajax({ url: url,
							type: 'POST',
							data: data,
							dataType:"html",
							cache: false,
							timeout: 1000*180,
							error: function() {alert('数据加载失败，可能是网络连接问题或者服务器错误。');},
							/*error:function(XMLHttpRequest, textStatus, errorThrown){  
								alert(textStatus)
								alert(errorThrown)
							},*/
							success: func,
							complete:function(XMLHttpRequest, textStatus){
								var sessionstate=XMLHttpRequest.getResponseHeader("sessionstate"); //通过XMLHttpRequest取得响应头，sessionstatus，  
								if(sessionstate=="timeout"){
									relogin();
								}
								if(completeFunc){
									completeFunc(XMLHttpRequest,textStatus);
								}
							}
						});
					}else if(type=='POST'){
						//jQuery('.submit').each(function(){jQuery(this).attr('title',jQuery(this).html());jQuery(this).html('请稍候');jQuery(this).attr('disabled','disabled');});
						jQuery.ajax({ url: url,
							type: 'POST',
							//data: j('#'+param).serialize(),
							data: data,
							cache: false,
							timeout: 1000*180,
							error: function() { 
								alert('数据加载失败，可能是网络连接问题或者服务器错误。'); 
							}, 
							/*error:function(XMLHttpRequest, textStatus, errorThrown){  
								alert(textStatus)
								alert(errorThrown)
							},*/
							success: func,
							complete:function(XMLHttpRequest, textStatus){
								var sessionstate=XMLHttpRequest.getResponseHeader("sessionstate"); //通过XMLHttpRequest取得响应头，sessionstatus，  
								if(sessionstate=="timeout"){
									alertLogin();
								}
								if(completeFunc){
									completeFunc(XMLHttpRequest,textStatus);
								}
							}
						});
					}
				},
				postForm:function(url, frm, func){
					if (url.indexOf('?') == -1) {
				    	url += "?";
				    }
				    else
				        url += "&";
				 	url += "timeStamp=" + new Date().getTime()
					//Ajax(url, frm, 'POST', ShowResult, true);
				 	jQuery('#'+frm+' .btn-success').each(function(){jQuery(this).addClass('loader');jQuery(this).attr('disabled','disabled');});
					jQuery.ajax({ url: url,
						type: 'POST',
						data: jQuery('#'+frm).serialize(),
						cache: false,
						timeout: 1000*180,
						error: function() { alert('数据加载失败，可能是网络连接问题或者服务器错误。'); },
						/*error:function(XMLHttpRequest, textStatus, errorThrown){  
							alert(textStatus)
							alert(errorThrown)
						},*/
						success: func,
						complete:function(XMLHttpRequest, textStatus){
							var sessionstate=XMLHttpRequest.getResponseHeader("sessionstate"); //通过XMLHttpRequest取得响应头，sessionstatus，
							if(sessionstate=="timeout"){
								alertLogin();
				            }
							jQuery('#'+frm+' .btn-success').each(function(){jQuery(this).removeClass('loader');jQuery(this).attr('disabled',false);});
						}
					});
					
				 },
				postCheckForm:function(url, frm, cnfirm, needchecked){
					var doit=true;
					if(needchecked==true)
					{
						if(!IsCheckedOne())
						{
							alert('请至少选择一条记录');
							doit = false;
							return;
						}
					}
					if(cnfirm==true)
					{
						if(!confirm('你确定要执行该操作？')){doit=false;}
					}
					if(doit){
						if (url.indexOf('?') == -1) {
							url += "?";
						}else{
							url += "&";
						}
						
						url += "timeStamp=" + new Date().getTime();
						//Ajax(url, frm, 'POST', ShowResult, true);
						jQuery('.submit').each(function(){jQuery(this).attr('title',jQuery(this).html());jQuery(this).html('请稍候');jQuery(this).attr('disabled','disabled');});
						jQuery.ajax({ url: url,
							type: 'POST',
							data: jQuery('#'+frm).serialize(),
							cache: false,
							//timeout: 20000,
							//error: function() { alert('数据加载失败，可能是网络连接问题或者服务器错误。'); },
							/**/error:function(XMLHttpRequest, textStatus, errorThrown){  
								alert(textStatus);
								alert(errorThrown);
							},
							success: ShowResult,
							complete:function(){jQuery('.submit').each(function(){jQuery(this).html(jQuery(this).attr('title'));jQuery(this).attr('disabled',false);});}
						});
					}
				 }
			}
	};
	$.extend(Parox, pAjax);
})(window, document); 