/* ========================================================================
 * Parox: core.js v0.1
 * the parox core js 
 * ========================================================================
 * Copyright 2014 Parox, Inc.
 * ======================================================================== */
 
(function (w, d) {
	if (!window.Parox) {window.Parox = {};}  
	var location = window.location,  
	de = d.documentElement,  
	userAgent = navigator.userAgent.toLowerCase(),  
	ie6 = /msie 6.0/.test(userAgent),  
	opera = /opera/.test(userAgent),  
	ie = /msie/.test(userAgent) && !opera,  
	safari = /webkit/.test(userAgent),  
	ff = /firefox/.test(userAgent),
	loginWinId;
	
	var tip = {   
		require : '缺少参数，参数必须的',
		rule : '参数不合法'
	};
	var Pmain= {
		name : 'Parox Javascript Library',
		version : '1.0',
		debug : true,
		namespace : function (name) {
			var parts = name.split('.');
			var current = Parox;
			for (var i in parts) {
				if (!current[parts[i]]){
					current[parts[i]]= {};
				}
				current = current[parts[i]];
			}
		},
		Dom : {  
			g : function (id) {
				return typeof id === 'string' ? d.getElementById(id) : id;
			},
			remove : function (o) {
				var obj = this.g(o);
				if (!obj) {
					return;
				}
				return obj.parentNode.removeChild(obj);
			},  
			setOpacity : function (obj, val) {
				var vals = (typeof obj === "number" && val <= 100 && val >= 0) ? val : 100;  
				if (!obj) {  
					return;  
				}  
				if (ie) {  
					obj.style.filter = 'alpha(opacity=' + vals + ')';
				} else {
					obj.style.opacity = vals / 100;
				}
			},
			getMaxZindex : function (o) {
				var maxZindex = 0;
				var obj = o ? o : '*';
				var divs = d.getElementsByTagName(obj);
				for (z = 0; z < divs.length; z++) {
					maxZindex = Math.max(maxZindex, divs[z].style.zIndex);
				}
				return maxZindex;
			},
			createElement : function (type, prop) {  
				var tmp = d.createElement(type);  
				for (var i in prop) {  
					tmp.setAttribute(i, prop[i]);  
				}
				return tmp;  
			},
			createTextNode : function (txt) {
				return d.createTextNode(txt);
			},
			hasAttr : function (obj, attr) {
				obj.getAttribute(attr);
				return obj;
			},
			setAttr : function (obj, attr) {
				var self = this;
				for (var i in attr) {
					if (i === 'class') {
						self.addClass(obj, attr[i]);
					} else {  
						obj.setAttribute(i, attr[i]);
						}
					}
				return obj;
			},
			removeAttr : function (obj, attr) {
				obj.removeAttribute(attr);
				return obj;
			},
			getClass : function (c, pd) {
				var all = pd ? d.getElementsByName(pd).getElementsByTagName("*") : d.getElementsByTagName("*"),
				str = "",
				n = [];
				for (var i = 0; i < all.length; i++) {
					if (Parox.Dom.hasClass(all[i], c)) {
						n.push(all[i]);
					}
				}
				return n;
			},  
			addClass : function (o, str) {
				var obj = this.g(o);
				if (!obj) {
					return;
				}  
				var className = obj.className;
				var reg = eval("/^" + str + "$ | " + str + "$|^" + str + " | " + str + " /");
				if (reg.test(className)) {
					return;
				}
				if (className !== '') {
					obj.className = className + " " + str;
				} else {
					obj.className = str;
				}
			},
			removeClass : function (o, str) {
				var obj = this.g(o);
				if (!obj) {
					return;
				}  
				var className = obj.className;
				if (this.isNull(className)) {
					var reg = new RegExp(str, "g");
					var n = className.replace(reg, "");
					obj.className = n;
				}
			},
			hasClass : function (o, str) {
				if (!o) {
					return;
				}  
				var obj = this.g(o);
				var className = obj.className;
				var reg = eval("/^" + str + "$| " + str + "$|^" + str + " | " + str + " /");
				if (reg.test(className)) {
					return true;
				} else {
					return false;
				}  
			},  
			html : function (obj, html) {
				if (html) {  
					obj.innerHTML = html;
				} else {  
					return obj.innerHTML;
				}
			},
			text : function (obj, text) {
				if (text) {
					if (document.textContent) {
						obj.textContent = text;
					} else {  
						obj.innerText = text;
					}  
				} else {  
					if (document.textConten) {
						return obj.textContent;
					} else {
						return obj.innerText;
					}
				}
			}
		},  
		Events : {
			addEvent : function (oTarget, oType, fnHandler) {
				var self = this;
				if (oTarget.addEventListener) {
					oTarget.addEventListener(oType, fnHandler, false);
				} else if (oTarget.attachEvent) {
					oTarget.attachEvent('on' + oType, fnHandler);
				} else {
					oTarget['on' + oType] = fnHandler;
				}
			},
			removeEvent : function (oTarget, oType, fnHandler) {
				var self = this;
				if (oTarget.removeEventListener) {
					oTarget.removeEventListener(oType, fnHandler, false);
				} else if (oTarget.detachEvent) {
					oTarget.detachEvent('on' + oType, fnHandler);
				} else {
					oTarget['on' + oType] = null;
				}
			},
			getEvent : function (ev) {
				return ev || window.event;
			},
			getTarget : function (ev) {
				return this.getEvent(ev).target || this.getEvent().srcElement;
			},
			stopPropagation : function () {
				if (window.event) {
					return this.getEvent().cancelBubble = true;
				} else {
					return arguments.callee.caller.arguments[0].stopPropagation();
				}
			},
			stopDefault : function () {
				if (window.event) {  
					return this.getEvent().returnValue = false;  
				} else {  
					return arguments.callee.caller.arguments[0].preventDefault();  
				}  
			}
		},  
		Ready : function (loadEvent) {
			if (!loadEvent) {
				return;
			}  
			var init = function () {
				if (arguments.callee.done) {
					return;
				} else {
					arguments.callee.done = true;
				}
				loadEvent.apply(d, arguments);
			};  
			if (d.addEventListener) {
				d.addEventListener("DOMContentLoaded", init, false);
				return;
			}
			if (safari) {  
				var _timer = setInterval(function () {
					if (/loaded|complete/.test(d.readyState)) {
						clearInterval(_timer);
						init();
					}  
				}, 10);
			}
			d.write('<script id="_ie_onload" defer src="javascript:void(0)"><\/script>');
			var script = d.getElementById('_ie_onload');
			script.onreadystatechange = function () {
				if (this.readyState == 'complete') {
					init();
				}
			};
			return true;
		},
		Storage : {
			setItem : function (strName, strValue) {
				if (Storage) {}
				else if (Storage) {}
				else {}
			},  
			getItem : function (strValue) {},
			removeItem : function (strValue) {},
			removeAll : function () {}
		},  
		getScript : function (obj, callback, order) {
			var self = this,
			arr = obj,
			timeout,
			ord = order || true,
			num = 0,
			str = typeof obj === 'string';
			if (!arr) {
				this.Error(tip.require);
				return;
			}  
			function add() {
				if (arr[0] === undefined) {
					return;
				}  
				var script = Parox.Dom.createElement("script", {
					'src' : (str ? obj : arr[num]),
					'type' : 'text/javascript'
				}),
				header = d.getElementsByTagName("head")[0];
				if (str) {
					if (script.readyState) {
						script.onreadystatechange = function () {
							if (script.readyState === 'loaded' || script.readyState === 'complete') {
								script.onreadystatechange = null;
								callback && callback();  
							}
						};
					} else {
						script.onload = function () {
							callback && callback();
						};
					}
				} else {
					if (arr.length >= 1) {
						if (script.readyState) {
							script.onreadystatechange = function () {
								if (script.readyState === 'loaded' || script.readyState === 'complete') {
									script.onreadystatechange = null;
									arr.shift();
									timeout = setTimeout(add, 1);
								}
							};
						} else {
							script.onload = function () {
								arr.shift();
								timeout = setTimeout(add, 1);
							};
						}
					} else {
						clearTimeout(timeout);
						callback && callback();
					}
				}
				header.appendChild(script);
			}
			add();
		},
		Cookies : {
			setCookie : function (sName, sValue, oExpires, sPath, sDomain, bSecure) {
				var sCookie = sName + '=' + encodeURIComponent(sValue);
				if (oExpires) {
					var date = new Date();
					date.setTime(date.getTime() + oExpires * 60 * 60 * 1000);
					sCookie += '; expires=' + date.toUTCString();
				}
				if (sPath) {
					sCookie += '; path=' + sPath;
				}
				if (sDomain) {
					sCookie += '; domain=' + sDomain;
				}
				if (bSecure) {
					sCookie += '; secure';
				}
				d.cookie = sCookie;
			},
			getCookie : function (sName) {
				var sRE = '(?:; )?' + sName + '=([^;]*)';
				var oRE = new RegExp(sRE);
				if (oRE.test(d.cookie)) {
					return decodeURIComponent(RegExp[$1]);
				} else {
					return null;
				}
			},
			removeCookie : function (sName, sPath, sDomain) {
				this.setCookie(sName, '', new Date(0), sPath, sDomain);
			},
			clearAllCookie : function () {
				var cookies = d.cookie.split(";");
				var len = cookies.length;
				for (var i = 0; i < len; i++) {
					var cookie = cookies[i];
					var eqPos = cookie.indexOf("=");
					var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
					name = name.replace(/^\s*|\s*$/, "");
					d.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
				}
			}
		},
		tabSort : function (sTableID, iCol, sDataType) { //排序函数，sTableID为目标,iCol哪列排序，为必需，sDataType可选  
			var oTable = document.getElementById(sTableID);  
			var oTBody = oTable.tBodies[0];
			var colDataRows = oTBody.rows;
			var aTRs = [];
			var len = colDataRows.length;
			function convert(sValue, sDataType) { //类型转，根据不同类型数据排序，比如，整型，日期，浮点，字符串，接受两个参数，一个是值，一个是排序的数据类型  
				switch (sDataType) {
				case "int":
					return parseInt(sValue);
				case "float":
					return parseFloat(sValue);
				case "date":
					return new Date(Date.parse(sValue));
				default:
					return sValue.toString();
				}
			}
			function geterateCompareTRs(iCol, sDataType) { //比较函数，用于sort排序用  
				return function compareTRs(oTR1, oTR2) {
					var vValue1,
					vValue2;
					if (oTR1.cells[iCol].getAttribute("value")) { //用于高级排序，比如图片，添加一个额外的属性来排序 
						vValue1 = convert(oTR1.cells[iCol].getAttribute("value"), sDataType);
						vValue2 = convert(oTR2.cells[iCol].getAttribute("value"), sDataType);
					} else {  
						vValue1 = convert(oTR1.cells[iCol].firstChild.nodeValue, sDataType);
						vValue2 = convert(oTR2.cells[iCol].firstChild.nodeValue, sDataType);
					}
					if (vValue1 < vValue2) {
						return -1;
					} else if (vValue1 > vValue2) {
						return 1;
					} else {
						return 0;
					}
				};
			}
			for (var i = 0; i < len; i++) {
				aTRs[i] = colDataRows[i];
			}
			if (oTable.sortCol == iCol) { //如果已经排序，则倒序  
				aTRs.reverse();
			} else {
				aTRs.sort(geterateCompareTRs(iCol, sDataType));
			}
			var oFragment = document.createDocumentFragment();
			var trlen = aTRs.length;
			for (var j = 0; j < trlen; j++) {
				oFragment.appendChild(aTRs[j]);
			}
			oTBody.appendChild(oFragment);
			oTable.sortCol = iCol; //设置一个状态  
		},
		Browse : {
			isIE : ie,
			isFF : ff
		},  
		trim : function (str) {
			var re = /^\s*(.*?)\s*$/;
			return str.replace(re, '$1');
		},  
		escape : function (str) {
			var s = "";
			if (str.length === 0) {
				return "";
			}
			s = str.replace(/&/g, "&amp;");
			s = s.replace(/</g, "&lt;");
			s = s.replace(/>/g, "&gt;");
			s = s.replace(/ /g, "&nbsp;");
			s = s.replace(/\'/g, "&#39;");
			s = s.replace(/\"/g, "&quot;");
			return s;  
		},  
		getQueryString : function (name) {  
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
			var r = location.search.substr(1).match(reg);
			if (r !== null)
				return unescape(r[2]);
			return null;
		},  
		Error : function (obj, info) {
			if (!this.debug) {
				return;
			}  
			throw Error(obj);
		},
		UrlTimeStamp:function(){
			if (url.indexOf('?') == -1) {
				url += "?";
			}
			else
				url += "&";
			url += "timeStamp=" + new Date().getTime();
			return url;
		},
		Json:{
			TestJson:function(object){
				var num = 0;
				var str = '';
				for ( var i in object) {
					//if(i.toLowerCase().indexOf('item')>0)
						str += ',' + i;
					console.log(i+':'+object[i]);
					num++;
				}
				if (str.length > 0)
					str = str.substring(1);
				console.log(str);
				//alert(Ext.util.JSON.encode(object));	
			}
		},
        TaskEdit:(function($){
            var values=null;
            var Task=function(elements,orgId){
                this.elements=elements;
                this.orgId=orgId;
            }
            Task.prototype={
                initialize:function(){

                },
                getValue:function(){

                }
            }
            return Task;
        })(jQuery),
		//面板类效果 hetao
		Panel:{
			// input 类
			//@param oBtn触发按钮
			//@param oPanel面板容器
			//@param marg边距
			//@param intval浮出速度
			//@param direction浮出方向（0:left,1:right,2:top,3:bottom）
			//++++++++可选向++++++++
			//@param id传递ID(如果有)
			//@param userId用户传递ID(如果有)
			//@param flag区分属于哪个块()
			//@param url提交链接(如果有)
			Toggle:function(options)
			{//oBtn,oPanel,barW,intval,direction,id,userId,flag,url
				var opts		= options||{};
				var oB 			= $(opts.oBtn)	 ||{},
					oP 			= $(opts.oPanel) ||{},
					marg		= opts.marg		 ||50,
					i			= opts.intrl     ||200,
					dir 		= opts.dir		 ||0;
				var oP_w 		= oP.width(),
				 	oP_h 		= oP.height();

				switch(dir){
					case 0:
						oP.css({'left':-oP_w,'top':marg});
						oB.on('click',function(event){
							if(!$(this).hasClass('active')){
								$(this).addClass('active');
								oP.animate({'left':0,'opacity':1},i);
								$(window).on('click',function(event){
									if(event.clientX>oP_w&&event.clientY>50){
										if(oB.hasClass('active')){
											oB.removeClass('active');
											oP.animate({'left':-oP_w,'opacity':0},i);
											$(this).off();
										}
									}
								});
								
							}else{
								$(this).removeClass('active');
								oP.animate({'left':-oP_w,'opacity':0},i);
							}
						});
						break;
					case 1:
						oP.css({'right':-oP_w,'top':marg});
						oB.on('click',function(event){
							if(!$(this).hasClass('active')){
								$(this).addClass('active');
								oP.animate({'right':0,'opacity':1},i);	
							}else{
								$(this).removeClass('active');
								oP.animate({'right':-oP_w,'opacity':0},i);
							}
						});
						break;
					case 2:
						oP.css({'top':-oP_h});
						oB.on('click',function(){
							if(!$(this).hasClass('active')){
								$(this).addClass('active');
								oP.animate({'top':marg,'opacity':1},i);
							}else{
								$(this).removeClass('active');
								oP.animate({'top':-oP_h,'opacity':0},i);
							}
						});
						break;
					case 3:
						oP.css({'bottom':-oP_h,'margin-top':marg});
						oB.on('click',function(){
							if(!$(this).hasClass('active')){
								$(this).addClass('active');
								oP.animate({'bottom':0,'opacity':1},i);	
							}else{
								$(this).removeClass('active');
								oP.animate({'bottom':-oP_h,'opacity':0},i);
							}
						});
						break;
					default:
						oP.css({'left':-oP_w,'top':marg});
						oB.on('click',function(){
							if(!$(this).hasClass('active')){
								$(this).addClass('active');
								oP.animate({'left':0,'opacity':1},i);	
							}else{
								$(this).removeClass('active');
								oP.animate({'left':-oP_w,'opacity':0},i);
							}
						});
						break;
				}
			},
			//task ToggleDetail
			ToggleDetail:function(options){
				var opts		= options||{};
				var _otherParams= opts.params	||{},
					_oB			= opts.oBtn		||{},
					_oBE		= opts.oBtnE	||{},
					_wB			= (opts.oBtn +','+ opts.oBtnE)||{},
					_oP			= opts.oPanel	||'[parox-panel-name="taskdetail"]',
					_oP_Id		= opts.oPanelId	||'taskDetail',
					_u	 		= opts.url		||{},
					_i			= opts.intrval	||200,
					_func		= opts.callback;
					
				var	$oB			= $(_oB),
					$oBE		= $(_oBE),
					$oP			= $(_oP);
					
				var	_oP_w		= $oP.outerWidth();
				
				$(_wB).on('click',function(e){
					$oP.html("");
					$(window).off('click');
					
					var $this 	= $(this);
					var _id   	= $this.attr('parox-model-task-id');
					($oB.siblings($this).hasClass('edit')|| !$oBE.hasClass('p-o-r'))?$oP.css({'right':-_oP_w}).animate({'right':0},_i):$oP.animate({'right':-_oP_w},_i);
					$oB.removeClass('edit');
					$oB.parent().parent().parent().removeClass('active');
					$oBE.addClass('p-o-r');
					$oP.css({'right':-_oP_w}).animate({'right':0,'opacity':1},_i,function(){
							var _p 		= JSON.parse('{"taskId":'+_id+'}');	
							$.extend(_p,_otherParams);
							//加载详情
							Parox.Ajax.ajaxLoad(_u,_p,_oP_Id, function(data){
								oC=$('[data-btn=closedetails]');
								oC.on('click',function(){
									$oP.animate({'right':-_oP_w},_i);
									$oB.parents('tr').removeClass('active');
									$oB.removeClass('edit');
									//_oBE图片按钮的编辑状态去除
									$oBE.addClass('p-o-r');
								});
								if(_func){_func(data, _id);
							}});
								
							//显示
							$(window).on('click',function(event){
								if($('body').width()-event.clientX>_oP_w){
									$oP.animate({'right':-_oP_w},_i);
									$oB.removeClass('edit');
									$oB.parents('tr').removeClass('active');
									$(this).off('click');
									//oBE图片按钮的编辑状态去除
									$oBE.addClass('p-o-r');
								}
							});
							
					});
					
					$this.addClass('edit'); 
					$this.parents('tr').addClass('active');
					//oBE图片按钮的编辑状态加入
					$this.parent().find('[parox-btn="detailsIconBtn"]').removeClass('p-o-r');
				});
			},
			
			//--
			AssignPanel:function(options){
				var opts = options||{};
				
				var _param		= opts.param	||{},//{taskId:para,flag:flag}
					_btn 		= $(opts.btn)	||{},
					_pn			= opts.panel	||{},
					_url		= opts.url		||{},
					_func		= opts.callback;
					
				_btn.on('click',function(event){
					var $this = $(this);
					var _id   = $this.attr('parox-model-task-id'),
						_pns   = _pn+'-'+_id;
					var $pn	  = $('#'+_pns);
						//console.log($pn);
					if($this.hasClass('p-h-r')){
						$this.removeClass('p-h-r');
						var _p = {taskId:_id};
						
						$.extend(_p,_param);
						//console.log(_pn);
						Parox.Ajax.ajaxLoad(_url,_p, _pns, function(data){
							if(_func){_func(data);} 
							$('#'+_pns+' input').iCheck({ checkboxClass:'icheckbox_polaris', increaseArea:"-20"});
						});
						$pn.show(100);
						$this.toggleClass('active').removeClass('p-h-r').html('&and;');
					}else{
						$pn.hide(100);
						$this.toggleClass('active').addClass('p-h-r').html('&or;');
					}
				});
			}
		},
        //修改信息面板
        modElement:{
        	// input 类
        	//@param id触发项
        	//@param handler容器句柄
        	//@param placeHolder提示信息
        	//@param url内容提交链接
        	Input:function(options){
        		var P		= options||{};
        		
        		var otherParams	= P.params||{},
        			_hdr  		= $('[data-edit='+P.handler+']')||{},
        			_inputName	= P.name||{},
        			_phr		= P.placeHolder||'添加描述',
        			_u			= P.url||{},
        			_func		= P.callback;
        			
    			_hdr.on('click',function(){
    				var $this = $(this);
    				if($this.has('input[data-edit-ipt="'+_inputName+'"]').length==0){
    					
    					var _editArea 	= _hdr.children('[data-edit-area="'+P.handler+'"]');
    					var _initVal 	= _editArea.text().trim();
	        			var _area		= '\<input type="text" value="'+_initVal+'" placeholder='+_phr+' data-edit-ipt="'+_inputName+'" name="'+_inputName+'"  class="modElement-ipt col-lg-12 text-muted"  \/\>';
	        			_editArea.html(_area);
	        			_editArea.removeClass('actived');
	        			
	        			var $ipt 		= $('[data-edit-ipt='+_inputName+']');
	        			
	        			$ipt.focus();
	        			$ipt.on('focusout keydown',function(event){
	        				//鼠标已出焦点or键盘回车发送提交
	        				if(event.keyCode==13||event.type=='focusout'){
	        					debugger;
	        					var _valNow=$(this).val().trim();
	        					
	        					if(typeof(valNow)!=undefined && _initVal!=_valNow){
	        						//if(_valNow=='')valNow=_phr; //_phr
		        					var _p={};
		        					_p[_inputName]=_valNow;
	        						$.extend(_p,otherParams);	        						
	        						Parox.Ajax.AjaxPost(_u,_p,function(data){_editArea.html(_valNow);if(_func){_func(data);_editArea.addClass('actived');}});
	        					}else{
	        						_editArea.html(_initVal);
	        					}
	        				}
	        			});
    				}
        			//--
        		});
        		//--
        	},
        	//截止时间
			Endtime:function(options){
				var opts = options||{};
				
				var otherParams	= opts.params||{},
					hdr  		= $("[parox-btn='"+opts.handler+"']")||{},
					_inputName	= opts.name||opts.handler,
					phr			= opts.placeHolder||'请选择截止时间',
					initVal=valNow		= hdr.html(),
					u			= opts.url||{},
					_func		= opts.callback;
					
				hdr.on('click',function(e){
					var $this = $(this);
					if(!$this.has('input').length==1){

						var ipt = '<input type=\"text\" class=\"date bgWhite cur-p bd-un-style bg-un-style padd-un\" name="'+_inputName+'"  data-link-field=\"close-date\" data-link-format=\"yyyy\-mm\-dd\ hh\:ii\:ss" readonly \/\>';
						var closedate = $(ipt);
						
						if(initVal==phr){
							initVal="";
						}
						
						closedate.attr("placeholder", initVal || phr);
						closedate.attr("data-link-format","yyyy-mm-dd hh:ii:ss");
						closedate.attr("data-date", initVal);
    					$this.empty();
    					$this.append(closedate);
    					//$this.html(ipt);
    					
    					/*calendar param
    					* plugin datetimepicker
    					*/
    					
    					$('[data-link-field="close-date"]').datetimepicker({
    						language:'zh-CN',
    						weekStart: 1,
    						todayBtn:  1,
    						autoclose: 1,
    						todayHighlight: 1,
    						startView: 2,
    						minView: 0,
    						maxView: 4,
    						forceParse: 0,
    						todayHighlight:true,
    						minuteStep:10,
    						format:'yyyy-mm-dd hh:ii:ss'
    					});
    					
    					closedate.focus();
    					closedate.on('change',function(){
    						
    						valNow = $(this).val();
    						
    						if(valNow!='' && typeof(valNow)!=undefined){
        						if(initVal!=valNow){
        							var _p={};
        							_p[_inputName]=valNow;
	        						$.extend(_p,otherParams);
	        						AjaxPost(u,_p,function(data){hdr.html(valNow);initVal=valNow;if(_func){_func(data);}});
        						}
        					}else{
        						hdr.html(phr);
        					}
    					});
    					
    				}
    			});
			},
        	SelectAuto:function(options){
        		var opts = options||{};
        		
        		var otherParams = opts.params||{},
        			hdr			= $('[data-edit ='+opts.handler+'] select[name='+opts.name+']')||{},
        			u			= opts.url||{},
        			_inputName	= opts.name||{},
        			_func		= opts.callback;
        		hdr.on('change',function(){
        			var _value = $(this).val();
    				if(true){
        				var _p = JSON.parse('{"'+_inputName+'":'+_value+'}');
        				$.extend(_p,otherParams);
        				//console.log(_p);
        				Parox.Ajax.AjaxPost(u,_p,function(data){if(_func){_func(data);}});
        			};
        		});
        	},
        	
        	SelectArea:function(options){
        		var opts = options||{};
        		
        		var otherParams = opts.params||{},
        			_hdr		= $('[data-edit ='+opts.handler+']')||{},
        			_u			= opts.url||{},
        			_func		= opts.callback;
        		//console.log(_u);
        		_hdr.on('change',function(){
        			var _provinceId = $('select[name=province]').val();
    				var _cityId 	= $('select[name=city]').val();
    				var _countyId	= $('select[name=county]').val();
    				//console.log('pro')
        			if(_provinceId!=''&&_cityId!=''&&_countyId!=''){
        				var _p = JSON.parse('{"province":'+_provinceId+',"city":'+_cityId+',"county":'+_countyId+'}');
        				$.extend(_p,otherParams);
        				//console.log(_p);
        				Parox.Ajax.AjaxPost(_u,_p,function(data){if(_func){_func(data);}});
        			};
        		});
        	},
        	
			DropdownUser:function(options){
				//显示用户列表
				options=options||{};
				
				options.url = options.url || _CTX_PATH + "/task/ajax/appendDropdownUser.htm";
				options.params=options.params||{};
				
				if(typeof options.handler == "undefined"){
					
					return false;
				}
				
				options.handler.on("click",function(){
					
					if($(this).find("ul").length > 0){
						return ;
					}
					
					var targetId=options.targetId||$(this).attr("id");
					var postUrl = $(this).attr("parox-post"); 
					AjaxAppend(options.url,
						options.params,
						targetId, 
						function(data){
						alert('ccccc');
						//bind click event
						if(options.choiceCallback){
							$("#"+targetId+" li[parox-btn='userPickup']").click(function(){
									options.choiceCallback(
											postUrl,
											targetId,
											$(this).attr('parox-model-user-id'), 
											$(this).attr('parox-model-team-id')
									);
							});
						}
						
					});
					
				});
			},
			
			Labels:function(options){
				options = options||{};
				
				options.params=options.params||{};
				
				if(options.handler == null 
						|| options.inputContainer==null 
						|| options.container===null){
					return false;
				}
				
				var labelArr = new Array();
				//TODO 初始化 array
				$.each(options.container.children("li"), function(idx, obj){
					if($(this).children("a").text()!=""){
						labelArr.push($(this).children("a").text());
					}
				});
				
				options.handler.click(function (){
					options.inputContainer.show(200);
					options.inputContainer.children("input").focus();
				});
				
				var updateLabels = function (){
					var _p={labels:labelArr.join(",")};
					$.extend(_p, options.params);
					
					AjaxPost(_CTX_PATH+"/task/ajax/doUpdate.htm",_p,function(data){});
				};
				
				var removeEvent = function(){
					$(this).parent().hide(300);
					var val = $(this).prev("a").text();
					var idx = $.inArray(val, labelArr);
					if( idx!= -1 ){
						labelArr.splice(idx,1);
					}
					
					updateLabels();
				};
				
				options.removeBtn.click(removeEvent);
				
				options.inputContainer.children("input").on("focusout keydown", function(){
					if(event.keyCode!=13 && event.type!='focusout'){
						return ;
					}
					var newLabel = $(this).val();
					
					newLabel = newLabel.replace(/，/g, ",");
					newLabel = newLabel.replace(/[ ]+/g, ",");
					newLabel = newLabel.replace(/(^,)|(,$)/g, "");
					newLabel = newLabel.replace(/[,]+/g, ",");
					
					var pattern = /^[,\w\u4e00-\u9fa5]+$/gi;
					
					if(!pattern.test(newLabel)){
						alert("//TODO 标签不要包含特殊符号，可以用中英文逗号(，)或空格分隔多个标签");
						return false;
					}
					
					var _this = $(this);
					var newLabelArr = newLabel.split(",");
					
					$.each(newLabelArr, function(idx, obj){
						if($.inArray(obj, labelArr) != -1){
							return ;
						}
						
						var li = $("<li class='p-o padd-un' ></li>");
						var a=$("<a href='javascript:void(0)' class='marg-un'></a>");
						a.text(obj);
						var span = $("<span class='p-o-r text-muted cur-p' >&times;</span>");
						span.title="删除";
						
						li.append(a).append(span);
						span.click(removeEvent);
						
						_this.parent().before(li);
						
						labelArr.push(obj);
					});
					
					_this.val("");
					_this.parent().hide();
					
					updateLabels();
					
				});
				
			},
			Items:function(options){
				
				//添加事件（添加DOM，DOM提交） OK
				//checkbox事件（重算）
				//变更文本（外部传进） 
				//移除事件 OK
				
				var itemsICheck = $("[parox-btn='"+options.itemsCheckbox+"']");
				var itemsArray = new Array();
				var KEY_PREFIX="item-";
				$.each(itemsICheck, function (idx, obj){
					var item = {};
					item[KEY_PREFIX+$(this).val()]=$(this).prop("checked");
					
					itemsArray.push(item);
				});
				
				var republishComplete = function(completed){
					$("#"+options.progressBar+" .progress-bar").css("width", completed);
					$("#"+options.progressBar+" span.sr-only").text(completed+" 已完成");
					$("#"+options.progressBar+" .progress-text").text(completed);
				};
				
				var recalculate=function(){
					
//					var icheck = $("[parox-btn='"+options.itemsCheckbox+"']");
					
					if(itemsArray.length == 0){
						republishComplete("0%");
						return ;
					}
					
					var checkedNum = 0;
					
					$.each(itemsArray, function(idx, obj){
						
						for(var k in obj){
							if(obj[k]){
								checkedNum++;
							}
						}
					});
					
					var result = parseFloat(checkedNum/itemsArray.length);
					result=Math.round(result*10000)/100;
					
					
					republishComplete(result+"%");
					
				};
				
				var addItem = function(id, finished){
					var item = {};
					item[KEY_PREFIX+id]=finished==null?false:finished;
					itemsArray.push(item);
					//TODO 重算百分比
					recalculate();
				};
				
				var removeItem = function(id){
					var index=null;
					$.each(itemsArray,function(idx, obj){
						if(typeof obj[KEY_PREFIX+id] != "undefined"){
							index=idx;
						}
					});
					if(index!=null){
						itemsArray.splice(index, 1);
					}
					//TODO 重算百分比
					
					recalculate();
				};
				
				var removeEvent = function(){
					$(this).parent().hide(300);
					var val = $(this).attr("parox-model-item-id");
					var _p={itemId:val};
					AjaxPost(_CTX_PATH+"/task/ajax/doRemoveItem.htm",_p,function(response){
						removeItem(val);
					});
				};
				
				var editEvent=function(){
					
					if($(this).has("input").length>0){
						return false;
					}
					
					var originValue=$(this).text();
					$(this).empty();
					
					var input=$("<input type='text' class='modElement-ipt text-muted padd-5-l' />");
					input.attr("placeholder","请输入 检查项");
					input.val(originValue);
					
					$(this).append(input);
					
					var editContainer = $(this);
					input.on("focusout keydown",function(){
						if(event.keyCode!=13 && event.type!='focusout'){
							return ;
						}
						
						if($(this).val()==""){
							alert("//TODO 请填写变更后的检查项");
							return ;
						}
						
						$this=$(this);
						
						var newValue=$(this).val();
						
						if(originValue==newValue){
							editContainer.empty();
							editContainer.text(newValue);
							return ;
						}
						
						var _p={};
						_p["itemId"]=editContainer.attr("parox-model-item-id");
						_p["title"]=newValue;
						
						AjaxPost(_CTX_PATH+"/task/ajax/doUpdateItem.htm",_p,function(response){
							editContainer.empty();
							editContainer.text(newValue);
						});
						
					});
					
				};
				
				var checkedEvent = function(checked, itemId){
					var _p={};
					_p["itemId"]=itemId;
					_p["isFinished"]=checked;
					
					AjaxPost(_CTX_PATH+"/task/ajax/doUpdateItem.htm",_p,function(response){
						
						$.each(itemsArray, function(idx, obj){
							if(typeof obj[KEY_PREFIX+itemId] != "undefined"){
								obj[KEY_PREFIX+itemId]=checked;
							}
						});
						
						recalculate();
					});
				};
				
				var initIcheck=function(chk){
					
					chk.iCheck({
						checkboxClass:'icheckbox_polaris',
						increaseArea:"-20"
					});
					
					chk.on("ifChecked", function(){
						checkedEvent(true, $(this).val());
					});
					
					chk.on("ifUnchecked", function(){
						checkedEvent(false, $(this).val());
					});
					
				};
				
				initIcheck(itemsICheck);
				
				options.editHandler.click(editEvent);
				
				options.removeBtn.click(removeEvent);
				
				options.appendHandler.click(function (){
					options.inputContainer.show(200);
					options.inputContainer.children("input").focus();
				});
				
				options.inputContainer.children("input").on("focusout keydown", function(){
					
					if(event.keyCode!=13 && event.type!='focusout'){
						return ;
					}
					
					if($(this).val()==""){
						$(this).parent().hide(200);
						return ;
					}
					
					var _this=$(this);
					
					var _p={title:$(this).val()};
					$.extend(_p, options.params);
					
					AjaxPost(_CTX_PATH+"/task/ajax/doCreateItem.htm",_p,function(response){
						//添加DOM
						if(response.message > 0){
							
							var li = $("<li></li>");
							var checkbox=$("<input type='checkbox'/>");
							checkbox.attr("parox-btn","detail-items-checkbox");
							checkbox.val(response.message);
							var itemSpan=$("<span></span>");
							itemSpan.attr("parox-model-item-id", response.message);
							itemSpan.text(_this.val());
							var span = $("<span class='delete p-o-r' >&times;</span>");
//							span.attr("parox-btn","removeItem");
							span.attr("parox-model-item-id",response.message);
							span.title="删除";
							
							li.append(checkbox).append(itemSpan).append(span);
							
							_this.parent().before(li);
							_this.parent().hide(200);
							_this.val("");
							
							span.click(removeEvent);
							itemSpan.click(editEvent);
							initIcheck(checkbox);
							
							addItem(response.message, false);
						}
					});
					
				});
				
			},
			
			
			//添加用户显示添加的列表
			//@depercate
			ShowUserList:function(options){
				var opts = options||{};
				var otherParams	= opts.params||{},
    			hdr  		= $(opts.btn)||{},
    			u			= opts.url  ||'',
    			_func		= opts.callback;
    			
    			hdr.on('click',function(e){
    				var $this = $(this);
    				var _flag = $this.attr('data-task-sign');
    				var _p = JSON.parse('{"flag":"'+_flag+'"}');
    				$.extend(_p,otherParams);
    				AjaxAppend(u,_p,
    	    	        'showUserList'+_flag, function(data){if(_func){}
    	    	        });
    			});
				
			},
			
			//任务标签
			//@depercate
			Tags:function(options){
				var opts = options||{};
				var _otherParams	= opts.params||{},
					_hdr  		= $('['+opts.handler+']')||{},
					_tga		= '['+opts.area+']'||{},
					_phr		= opts.phr	||'请输入标签',
					_inputName	= opts.name ||'',
					_u			= opts.url  ||'',
					_func		= opts.callback;
					
				//delete tags
				var removeTagListener=function(){
						//console.log('into delete');
						$(this).parent().remove();
						$(this).remove();
							
						var _eachArr = [];
						$(_tga+' li a').each(function(index,node){
							_eachArr.push(node.text);
						});
						
						var _values = _eachArr.join(",");
						
						if(_values){
							//console.log(_values);
							var _p=JSON.parse('{"'+_inputName+'":"'+_values+'"}');
							$.extend(_p,_otherParams);
							Parox.Ajax.AjaxPost(_u,_p,function(data){if(_func){_func(data);}});
						}
				};

				//add tags
				_hdr.on('click',function(event){
					var $this = $(this);
					var _ipt = '<li\><input type=\"text\" value=\"\" placeholder=\"'+_phr+'\" id=\"addtagsIpt\" name="'+_inputName+'" checked  class="modElement-ipt  text-muted padd-5-l" \/\><\/li\>';
					$this.before(_ipt);
					var $ipt = $('#addtagsIpt');
					$ipt.focus();
					$this.removeClass('p-h-r').hide();
					$ipt.on('focusout keydown',function(event){
						if(event.keyCode==13||event.type=='focusout'){
							//console.log("add tags1");
							var _valNow 	= $ipt.val();
							var pattern 	= new RegExp(/[`~!@#$%^&*()+=|{}':;'\[\].<>\/?~！@#￥%……&*（）——+|{}【】‘；：”“’。，、？]/g);
							var _rs 		= "";
							
							

							for (var i = 0; i < _valNow.length; i++) {
								_rs = _rs + _valNow.substr(i, 1).replace(pattern, '');
							}
							if(_rs!=_valNow){
								alert('输入内容中有非法字符！');
								$ipt.focus();
							}else{
								$ipt.parent().remove();
								$ipt.remove();
								if(_valNow!='' && typeof(_valNow)!=undefined){
									var _tagsItems = '<li class=\"p-o padd-un\"><a href=\"javascrip\:void\(0\)\" class=\"marg-un\">'+_valNow+'<\/a><span class=\"delete p-o-r text-muted cur-p\" title="删除">&times;<\/span><\/li>';
									$this.before(_tagsItems);
									$(_tga+'>li:last span.delete').click(removeTagListener);
								}
								var _eachArr = [];
								$(_tga+' a').each(function(index,node){
								//console.log("each" + node.text);
								_eachArr.push(node.text);
								});
								var _values = _eachArr.join(",");
								if(_values){		    					
									var _p=JSON.parse('{"'+_inputName+'":"'+_values+'"}');
									$.extend(_p,_otherParams);
									Parox.Ajax.AjaxPost(_u,_p,function(data){if(_func){_func(data);}});
								}
							}
							
							$this.addClass('p-h-r').show();
						}
					});
				});
				
				//delete tags listener
				$(_tga +'>li span.delete').click(removeTagListener);
			},
			
			//修改检查项
			EditItem:function(options){
				var P = options||{};

				var otherParams	= P.params||{};
				var hdr  		= $('[data-edit-item="'+P.handler+'"]')||{},
				_inputName	= P.name||{},
				phr			= P.placeHolder||'修改检查项',
				u			= P.url||{},
				_func		= P.callback;
				
				hdr.on('click',function(){
					var $this = $(this);
					//var _editArea = $this.children("span");
					var _itemId	= $this.attr('data-items-id');
					if($this.has('input').length==0){
						var _initVal 	= $this.text();//如何获取里面的内容（input)
						//console.log("1:" + _initVal);
						var _area		= '\<input type="text" value='+_initVal+' placeholder='+phr+' data-edit-ipt="'+_inputName+'" name="'+_inputName+'"  class="modElement-ipt col-lg-12 text-muted"  \/\>';
						$this.html(_area);
						var $ipt 		= $('[data-edit-ipt='+_inputName+']');
						//console.log("$ipt.val()" +$ipt.val());
						$ipt.focus();
						$ipt.on('focusout keydown',function(event){
							//鼠标已出焦点or键盘回车发送提交
							if(event.keyCode==13||event.type=='focusout'){
								var valNow=$(this).val().trim();
								//console.log("valNow:" + valNow);
								if(typeof(valNow)!=undefined && _initVal!=valNow){
									if(valNow==''){
										alert("任务检查项名不能为空");
									}else{
										var _p=JSON.parse('{"title":"'+valNow+'","itemId":'+_itemId+'}');
										$.extend(_p,otherParams);
										AjaxPost(u,_p,function(data){
											$ipt.remove();
											$this.html(valNow);
											if(_func){
												_func(data);
											}});
									}
								}else{						
									$this.html(_initVal);
								}		        				
							}
						});
					}
				});
			},
			
			//增加检查项
			CheckItems:function(options){
				var opts = options||{};
				
				var otherParams	= opts.params||{},
	    			hdr  		= $('#'+opts.handler)||{},
	    			chka		= $('#'+opts.area)||{},
	    			phr			= opts.phr	||'请输入检查项名称',
	    			_inputName	= opts.name ||'',
	    			u			= opts.url  ||'',
	    			iptId		= '',
	    			_checkFunc  = opts.func,
	    			_func		= opts.callback;
	    			
	    		hdr.on('click',function(event){
	    			//console.log("CheckItems");
	    			var ipt = '<li><input type="text" placeholder=\"'+phr+'\" id=\"chiAddIpt\" name="'+_inputName+'"  class="modElement-ipt col-lg-12 text-muted padd-5-l" style="top:3px" \/><\/li>';
	    			chka.append(ipt);
	    			var $aIpt = $("#chiAddIpt");
	    			$aIpt.focus();
	    			$aIpt.on('focusout keydown',function(event){
	    				if(event.keyCode==13||event.type=='focusout'){
	    					var valNow = $aIpt.val();
	    					if(valNow!='' && typeof(valNow)!=undefined){
		    					var _p=JSON.parse('{"'+_inputName+'":"'+valNow+'"}');
	    						$.extend(_p,otherParams);
	    						AjaxPost(u,_p,function(data){$aIpt.parent().remove();$aIpt.remove();if(_func){
	    							_func(data);
	    							var itemId = data.message.itemId;
									var checkItems = '<li id="item_'+itemId+'"><input type="checkbox" data-edit-area="editItemStatus" \/> <span data-edit-item="editItem" data-items-id='+itemId+'>'+valNow+'</span><span class="delete p-o-r" data-task-item-id='+itemId+' data-delete-task-item="deleteItem">×<\/span><\/li>';
									chka.append(checkItems);
									$('#'+opts.area+' > li:last-child').click(_checkFunc);
									$('[data-edit-area="editItem"]').iCheck({ checkboxClass:'icheckbox_polaris', increaseArea:"-20"});
	    							}});
							}else{
								$aIpt.parent().remove();
	    						$aIpt.remove();
							}
	    				}
	    			});
	    		});
			},
			
			//检查项任务变化
			EditItemStatus:function(options){
				var opts = options||{};
				var _hds	= $('[data-edit-area="'+opts.handler+'"]')||{};
				var otherParams= opts.params||{},
				_func		= opts.callback;
				_u		= opts.url||'',
				_hds.on('change',function(){
		    		var $this = $(this);
		    		var $span =$this.next();
		    		//console.log("dsdfwa");
		    		var _itemId=$span.attr("data-items-id");
		    		var _chk  = $this.prop("checked");
		    		var _status=false;
		    		if(_chk){
		    			_status=true;
		    		}
		    		var _p=JSON.parse('{"itemId":"'+_itemId+'","status":"'+_status+'"}');
		    		$.extend(_p,otherParams);
		   			AjaxPost(_u,_p,
						function(data){
		   				if(_func){_func(data);}
						}
					);
		    	});
			},
			
			AddUser:function(options){
				var opts = options||{};
				
				_hdr  		= $(opts.handler)||{},
				_tga		= $(opts.area)||{},
				_tgaItems1	= '['+opts.areaAssign+']'||{},
				_tgaItems2	= '['+opts.areaFollow+']'||{},
				_u			= opts.url  ||'',
				_checkFunc  = opts.func,
				_func		= opts.callback;
				
				//add user
				_hdr.on('click',function(event){
					var $this = $(this);
					//console.log("url:" + _u);
					var _userId = $this.attr('data-user-id');
					var _flag = $this.attr('data-add-flag');
					var _taskId =$this.attr('data-add-taskId');
					var _p = JSON.parse('{"userId":"'+_userId+'","flag":"'+_flag+'","taskId":"'+_taskId+'"}');
					
					AjaxPost(_u,_p,function(data){
						//console.log(data.message.sign);
						if(_func){
							_func(data);
							var name=$this.find('a').text();
							var userItem ='<div class="assign-cell-body p-o" parox-user-body="'+_flag+'_'+_taskId+'_'+_userId+'"><a href="#" class="lnk-black"><img src="../images/parox-logo.gif" class="img-rounded assign-cell-img"/><span>'+name+'</span></a><span class="delete p-o-r" data-delete-task-user="deleteUser"  data-task-id="'+_taskId+'" data-task-sign="'+_flag+'" data-task-userId="'+_userId+'">&times;</span></div>';
							if(data.message.sign==1){
								$(opts.area+'>span.delete');
								_tga.before(userItem);
								$(_tgaItems1+" div span.delete:last").click(_checkFunc);
							}else if(data.message.sign==2){
								_tga.before(userItem);
								$(_tgaItems2+" div span.delete:last").click(_checkFunc);
								//$('#'+opts.area+' > li:last-child').click(_checkFunc);
							}
						}
					});
				});
			},
			
			AddUserTeam:function(options){
				var opts = options||{};
				var _otherParams	= opts.params||{},
				_hdr  		= $(opts.handler)||{},
				_tga		= $(opts.area)||{},
				_tgaItems1	= '['+opts.areaAssign+']'||{},
				_tgaItems2	= '['+opts.areaFollow+']'||{},
				_u			= opts.url  ||'',
				_checkFunc  = opts.func,
				_func		= opts.callback;
				
				//add userTeam
				_hdr.on('click',function(event){
					var $this = $(this);
					var _teamId = $this.attr('data-user-teamId');
					var _p = JSON.parse('{"teamId":"'+_teamId+'"}');
					$.extend(_p,_otherParams);
					AjaxPost(_u,_p,function(data){
						//console.log("into userteam");
						if(_func){
							_func(data);
							//console.log("sign"+data.message.sign);
							var _flag = data.message.sign;
							if(data.message.dataList!=null){
								var dataList = data.message.dataList;
								if(_flag == 1){
									for(var i=0;i<dataList.length;i++){
										var _taskId = dataList[i].model.taskId;
										var _userId = dataList[i].model.userId;
										var _name = dataList[i].user.realName;
										//console.log(_userId+_name);
										var userItem ='<div class="assign-cell-body p-o" parox-user-body="'+_flag+'_'+_taskId+'_'+_userId+'"><a href="#" class="lnk-black"><img src="../images/parox-logo.gif" class="img-rounded assign-cell-img"/><span>'+_name+'</span></a><span class="delete p-o-r" data-delete-task-user="deleteUser"  data-task-id="'+_taskId+'" data-task-sign="'+_flag+'" data-task-userId="'+_userId+'">&times;</span></div>';
										_tga.before(userItem);
										$(_tgaItems1+" div span.delete:last").click(_checkFunc);
									}
								}else if(_flag == 2){
									for(var i=0;i<dataList.length;i++){
										var _taskId = dataList[i].model.taskId;
										var _userId = dataList[i].model.userId;
										var _name = dataList[i].user.realName;
										var userItem ='<div class="assign-cell-body p-o" parox-user-body="'+_flag+'_'+_taskId+'_'+_userId+'"><a href="#" class="lnk-black"><img src="../images/parox-logo.gif" class="img-rounded assign-cell-img"/><span>'+_name+'</span></a><span class="delete p-o-r" data-delete-task-user="deleteUser"  data-task-id="'+_taskId+'" data-task-sign="'+_flag+'" data-task-userId="'+_userId+'">&times;</span></div>';
										_tga.before(userItem);
										$(_tgaItems2+" div span.delete:last").click(_checkFunc);
									}
								}
							}
						}
					});
				});
			},
			
			DeleteUser:function(options){
				var opts = options||{};
				
				var _hds	= $('[data-delete-task-user="'+opts.handler+'"]')||{},
				_u		= opts.url||'',
				_func	= opts.vcallback;

				_hds.on('click',function(){
					var $this = $(this);
					var _tskId = $this.attr('data-task-id');
					var _tskUserId = $this.attr('data-task-userId');
					var _tskSign = $this.attr('data-task-sign');
					var id = '[parox-user-body='+_tskSign+'_'+_tskId +'_'+_tskUserId+']';
					if(confirm('确定删除此用户？')){
						//console.log(opts.handler);
						var _p=JSON.parse('{\"taskId\":\"'+_tskId+'\",\"userId\":\"'+_tskUserId+'\",\"sign\":\"'+_tskSign+'\"}');
						AjaxPost(_u,_p,function(data){
							$(id).remove();
							if(_func){
								_func(data);
							}
						});
					}
				});
			},
			
			//delete checkItem add by zhuweixin
			DeleteItem:function(options){
				var opts = options||{};
				
				var _hds	= $('[data-delete-task-item="'+opts.handler+'"]')||{},
				_u		= opts.url||'',
				_name   = opts.name,
				_params	= opts.params||{},
				_func	= opts.callback;
				
				_hds.on('click',function(){
					var $this = $(this);
					var _tskItemId = $this.attr('data-task-item-id');
					var id ='#'+_name+'_'+_tskItemId;
					if(confirm('确定删除此任务项？')){
						var _p=JSON.parse('{\"itemId\":\"'+_tskItemId+'\"}'); 
						$.extend(_p,_params);
						AjaxPost(_u,_p,function(data){
							$(id).hide();
							if(_func){
								alert(data.message);
							}
						});
					}
				});
			},
			//附件
			Accessory:function(){
				
			}
        },
        //--
        //对话框
		Dialog:{
			//消息窗口
			Msg:function(options){
				var _P = options||{};
				
				var _info	= _P.info  ||'人艰不拆啊！',
					_type	= _P.type  ||'info',//danger/info/success/warning
					_hover	= _P.hover ||0,//0:static固定位置 1:浮动 absolute
					_auto	= _P.auto  ||1;//是否自动隐藏
					_i		= _P.intrval ||2000;//自动隐藏时间
				
				var _pdId	= 'ph'+Math.floor(Math.random()*1000000);
				
				var _html ='';
				if(_hover){
					_html += '<div class="col-sm-12" style="position:fixed;top:5em;z-index:9999;width:inherit;">';
					_html += '<div class="'+_pdId+' alert alert-'+_type+' fade in" role="dialog"  tabindex="-1" >';
					_html += '<button type="button" class="close" data-dismiss="p-alert" >&times;</button>';
					_html += '<p>'+_info+'</p>';
					_html += '</div>';
					_html += '</div>';
				}else{
					_html += '<div class="'+_pdId+' alert alert-'+_type+' fade in" role="dialog"  tabindex="-1" >';
					_html += '<button type="button" class="close" data-dismiss="p-alert" >&times;</button>';
					_html += '<p>'+_info+'</p>';
					_html += '</div>';
				}
				$('.container ').eq(0).prepend(_html);
				//$('#'+pdId).alert('close');
				var $pi 		= $('.'+_pdId),
					_t			= setTimeout();
				var $closeBtn	= $('[data-dismiss="p-alert"]');
					$closeBtn.on('click',function(){
						$pi.slideUp(300);
						setTimeout(function(){$pi.alert('close');},300);
					});
					
					if(_auto){
						_t=setTimeout(function(){
							$pi.slideUp(300);
							setTimeout(function(){$pi.alert('close');},300);
						},_i);
						
						$pi.hover(function(){
							clearTimeout(_t);
						},
						function(){
							_t=setTimeout(function(){
								$pi.slideUp(300);
								setTimeout(function(){$pi.alert('close');},300);
							},_i);
						});
					}
			},
			
			//警告窗口
			Alert:function(options){
				var P 		= options 	||{};
				var info	= P.info  	||'人艰不拆啊！',
				 	tit		= P.title  	||'好了！可以下班了！Go home！！' ,
				 	btn		= P.hasBtn	||1,//是否有自定义信息按钮
					btnOK	= P.btnOK 	||'好的！我知道了！';
					type	= P.type  	||'default',//default/primary/danger/success/warning/
					auto	= P.auto  	||0;//是否自动隐藏
					i		= P.intrval  ||2000;
					
				var	pdId	= 'ph'+Math.floor(Math.random()*1000000);
				
				var temp ='<iframe src=\"javascript:false\" style="position:absolute; visibility:inherit; top:0px; left:0px; width:100%; height:100%; z-index:-1; border:0; filter=progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0);"><\/iframe>';
				 	temp+='<div class="modal fade in" tabindex="-1" role="dialog" aria-labelledby="'+tit+'" aria-hidden="true" style="display:block" id="'+pdId+'">';
					temp+='<div class="modal-dialog">';
					temp+='<div class="modal-content">';
					temp+='<div class="modal-header">';
					temp+='<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
					temp+='<h4 class="modal-title">'+tit+'</h4>';
					temp+='</div>';
					temp+='<div class="modal-body">';
					temp+='<p>'+info+'</p>';
					temp+='</div>';
					
					if(btn){
						temp+='<div class="modal-footer">';
						temp+='<button type="button" class="btn btn-'+type+'" data-dismiss="modal">'+btnOK+'</button>';
						temp+='</div>';
					}
					
					temp+='</div>';                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
					temp+='</div>';
					temp+='</div>';
					
					$('body').append(temp);
				
				var pdDiv 	= $('#'+pdId),
					t		= setTimeout();
					pdDiv.modal('show');
					
					if(auto){
						t = setTimeout(function(){
							pdDiv.modal('hide');
							setTimeout(function(){pdDiv.remove();},500);
						},i);
						
						pdDiv.hover(function(){
										clearTimeout(t);
									},
									function(){
										pdDiv.modal('hide');
										setTimeout(function(){pdDiv.remove();},500);
									});
					}
					
					pdDiv.on('hidden.bs.modal',function(e){
						pdDiv.remove();
						$('body').removeClass('modal-open');
					});
					
					
			},
			//--
			Popover:function(opt){},
			//--
			confirm:function(opt){
				var P 		= opt||{};
				var tit		= P.title||'确认操作' ,
				 	info	= P.info||'确认进行当前操作吗？',
					detail	= P.detail,
					btn = P.btn||'确认操作',
					func	= P.func||{};
				var	modalId	= 'ph'+Math.floor(Math.random()*1000000);
				var div = document.getElementById(modalId);
				if(div){
					Parox.Modal.close(modalId);
				}
				var body = $('body');
				var html = '';
				html += '<div class="modal fade in" tabindex="-1" role="dialog" id="'+modalId+'" aria-labelledby="'+tit+'" aria-describedby="'+tit+'" aria-hidden="true" style="display: none;">';
				html += '<div class="modal-dialog">';
				html += ' 	<div class="modal-content">';
				html += '		<!--*标题项*-->';
				html += '		<div class="modal-header bgGray-f5 bd-radius-t-l bd-radius-t-r">';
				html += '			<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
				html += '    		<h4 class="modal-title">'+tit+'</h4>';
				html += '		</div>';
				html += '<div class="modal-body clearfix marg-30-t">';
				html += '<div class="pull-left marg-30-l hidden-xs">';
				html += '	<span class="icon-warning font50 colorRed"></span>';
				html += '</div>';
				html += ' <div class="pull-left padd-20-l wid-limit">';
				html += ' <p><strong>'+info+'</strong><p>';
				if(detail){
					html += '	<p>'+detail+'</p>';	
				}
				html += '</div>';
				html += '</div>';
				
				html += '<!--*提交创建*-->';
				html += '<div class="modal-footer bd-t-un-style"> <button class="btn btn-danger" data-dismiss="modal">'+btn+'</button> <button type="button" class="btn btn-default" data-dismiss="modal">取消</button> </div>';
				html += '	</div>';
				html += '</div>';				
				html += '</div>';
				$(body).append($(html));
				
				$('#'+modalId).modal('show');
				$('.btn-danger').click(function(){
					if(func){
						func();
					}
				});				
			},
			Login:function(opt){
				var P 		= opt 	||{};
				var tit		= P.title  	||'登录' ,
				 	auto	= P.auto  	||0;//是否自动隐藏
					i		= P.intrval  ||2000;
					
				var	pdId	= 'ph'+Math.floor(Math.random()*1000000);
				loginWinId = pdId;
				var temp = '<div class="modal fade in" tabindex="-1" role="dialog" aria-labelledby="'+tit+'" aria-hidden="true" style="display:block" id="'+pdId+'">';
				temp+='<div class="modal-dialog">';
				temp+='<div class="modal-content">';
				temp+='<div class="modal-header">';
				temp+='<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
				temp+='<h4 class="modal-title">'+tit+'</h4>';
				temp+='</div>';
				temp+='<div class="modal-body" style="height:350px">';
				temp+='<iframe src="'+_LOGIN_URL+'?force=1&style=mini" style="height:100%;width:100%;border:none;"></iframe>';
				temp+='</div>';					
				
				temp+='</div>';                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
				temp+='</div>';
				temp+='</div>';
				
					$('body').append(temp);
				
				var pdDiv 	= $('#'+pdId),
					t		= setTimeout();
					pdDiv.modal('show');
					
					
					pdDiv.on('hidden.bs.modal',function(e){
						pdDiv.remove();
						$('body').removeClass('modal-open');
					});
				/*
				var temp ='<form class="form-signin" action="${base}/login/" method="post" data-remote="true">'
		      	<input type="hidden" name="processUrl" value="${processUrl!}">
		      	<input type="hidden" name="returnUrl" value="${returnUrl!}">
		        <h2 class="form-signin-heading">请登录</h2>
		        
			      <!-- 临时添加  注册链接  start -->
			      <a style="position:relative;left:265px;top:-35px;z-index:999;" href="${base}/register">注册</a>
			      <!-- 临时添加  注册链接  end -->
		        <input name="username" type="text" class="form-control" placeholder="邮箱/用户名" required autofocus>
		        <input name="password" type="password" class="form-control" placeholder="密码" required>
		        
		        <label class="checkbox">
		          <input type="checkbox" value="remember-me"> 记住我
		        </label>
		        <button class="btn btn-lg btn-primary btn-block" type="submit">登录</button>
		      </form>
		      */
			},
			closeLogin:function(){
				Parox.Modal.close(loginWinId);
			}
		},
		//form items control
		ParoxForm:{
			//--CheckAll 全选
			CheckAll:function(self, filter){
				var all = self.checked;
				jQuery(filter).each(function(){		
					jQuery(this).prop('checked',all);
				});
			},
			//全选
			SelectGroupBox:function(options){
				
				var opts	=options||{};

				var _self	=opts.self		||'[parox-select-group="selectGroup"]';
				$(_self).on('change',function(){
					
					var $this	=$(this);
					var _prefix	=$this.attr('parox-select-box'),
						 _sons	=$("input[name=SelectID"+_prefix+"]");
					if(!_prefix){_prefix='';}
					if($this.attr('name')=='SelectAll'+_prefix){
						console.log('sss');
						var all	=$this.prop('checked');
						//var	_sons=jQuery("input[name=SelectID"+_prefix+"]");
						_sons.each(function(){jQuery(this).prop('checked',all);});
						
					}else{
						
					_sons.each(function(){if(!jQuery(this).prop('checked')){jQuery("input[name=SelectAll"+_prefix+"]").prop('checked',false);}});
					}
				});
				
				
			},
			//---全选
			SelectAll:function(self, prefix){
				if(!prefix){prefix='';}
				var label=jQuery("#"+self.id).html();
				var all = (label=='全选');
				jQuery("input[@name=SelectID]").each(function(){jQuery(this).prop('checked',all);});
				jQuery("#"+self.id).html(label=='全选'?'反选':'全选');	
			},
			//--
			CheckedIds:function(frm,prefix){
				if(!prefix){prefix='';}
				var ids = '';
				jQuery("input[@name=SelectID"+prefix+"]").each(function(){if(jQuery(this).attr('checked'))ids+=','+jQuery(this).attr('value');});
				if(ids.length>0)
					ids = ids.substring(1);
				return ids;
			},
			//---检查Checkbox至少要选中一条
			IsCheckedOne:function(frm,prefix){
				if(!prefix){prefix='';}
				var one = false;
				jQuery("input[@name=SelectID"+prefix+"]").each(function(){if(jQuery(this).attr('checked'))one=true;});
				return one;
			}

		},
		Modal:{
			close:function(modalId){
				$('#'+modalId).modal('hide');
				$('#'+modalId).next().remove();
				$('#'+modalId).remove();
			},
			fromPage:function(opt){
				var modalId = opt.modalId,
					title = opt.title||'Parox',
					url = opt.url,
					params = opt.params||{},
					callback = opt.callback,
					reload = opt.reload==false?false:true;
				if(!modalId){
					modalId	= 'ph'+Math.floor(Math.random()*1000000);
				}
				
				var div = document.getElementById(modalId);
				if(div && reload){
					Parox.Modal.close(modalId);
				}
				if(!div || reload){
					var body = $('body');
					var html = '';
					html += '<div class="modal fade in" tabindex="-1" role="dialog" id="'+modalId+'" aria-labelledby="'+title+'" aria-describedby="'+title+'" aria-hidden="true" style="display: none;">';
					html += '<div class="modal-dialog">';
					html += ' 	<div class="modal-content">';
					html += '		<!--*标题项*-->';
					html += '		<div class="modal-header bgGray-f5 bd-radius-t-l bd-radius-t-r">';
					html += '			<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
					html += '    		<h4 class="modal-title">'+title+'</h4>';
					html += '		</div>';
					html += '		<div class="modal-bigbody"></div>';
					html += '	</div>';
					html += '</div>';			
					html += '</div>';
					$(body).append($(html));
					Parox.Ajax.ajaxLoad(url, params, modalId+' .modal-bigbody', function(data){
						if(callback){
							callback(data);
						}
					});
				}
				$('#'+modalId).modal('show');
			}
		},
		//响应加载---ResponseLoad
		ResponseLoad:{
			//文件加载 file&folder list load
			Append:function(options){
				var opts		= options		||{};
				
				var _zone		= opts.zone		||{},
					_param		= opts.params	||{},
					_obj		= opts.obj		||{},
					_u			= opts.url		||{},
					_func		= opts.callback;
					
				if(_obj){
					$(_obj).parent().parent().hide();
				}
				
				Parox.Ajax.ajaxAppend(_CTX_PATH+_u,_param,_zone,function(data){
					if(_func){_func(data);}
				});
				
				/*appendFolder:function(_zone, params, obj, url){
					params = params||{};
					url=url||'/document/ajax/appendFolder.htm';
					if(obj){
						//$(obj).parent().parent().hide(500);
						$(obj).parent().parent().hide();
					}
					
					AjaxAppend(_CTX_PATH+url, params, _zone, function(){
							//注册菜单项
						if(_zone)
							Parox.Doc.OpareteMenu.EventLoader({'link':true,'share':true,'renameFolder':true,'renameFile':true,'folderCopy':true,'docCopy':true,'folderMove':true,'docMove':true,'TrashDelete':true});
					});
				}*/
			}
		}
	};
	$.extend(Parox, Pmain);
	Px = Parox;
})(window, document);
