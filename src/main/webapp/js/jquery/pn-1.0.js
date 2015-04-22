/*jQuery metadata 1.5*/
(function($) {
	$.extend({
		metadata : {
			defaults : {
				type : 'class',
				name : 'metadata',
				cre : /({.*})/,
				single : 'metadata'
			},
			setType : function(type, name) {
				this.defaults.type = type;
				this.defaults.name = name;
			},
			get : function(elem, opts) {
				var settings = $.extend({}, this.defaults, opts);
				if (!settings.single.length)
					settings.single = 'metadata';
				var data = $.data(elem, settings.single);
				if (data)
					return data;
				data = "{}";
				if (settings.type == "class") {
					var m = settings.cre.exec(elem.className);
					if (m)
						data = m[1];
				} else if (settings.type == "elem") {
					if (!elem.getElementsByTagName)
						return undefined;
					var e = elem.getElementsByTagName(settings.name);
					if (e.length)
						data = $.trim(e[0].innerHTML);
				} else if (elem.getAttribute != undefined) {
					var attr = elem.getAttribute(settings.name);
					if (attr)
						data = attr;
				}
				if (data.indexOf('{') < 0)
					data = "{" + data + "}";
				data = eval("(" + data + ")");
				$.data(elem, settings.single, data);
				return data;
			}
		}
	});
	$.fn.metadata = function(opts) {
		return $.metadata.get(this[0], opts);
	};
})(jQuery);
/* mhcms2.2 */
Pn = {
	version : '1.0'
};
Pn.ns = function() {
	var a = arguments, o = null, i, j, d, rt;
	for (i = 0; i < a.length; ++i) {
		d = a[i].split(".");
		rt = d[0];
		eval('if (typeof ' + rt + ' == "undefined"){' + rt + ' = {};}; o = '
				+ rt + ';');
		for (j = 1; j < d.length; ++j) {
			o[d[j]] = o[d[j]] || {};
			o = o[d[j]];
		}
	}
};
Pn.create = function(a) {
	return document.createElement(a);
};
Pn.UID = 0;
Pn.getUID = function() {
	Pn.UID++;
	return Pn.UID;
};
$.ajaxSetup({
	dataType : "json",
	type : "POST",
	beforeSend : function(xhr) {
		xhr.setRequestHeader('isAjax', 'true');
	}
});
jQuery.extend({
	postJson : function(url, data, success, error) {
		$.ajax({
			url : url,
			data : data,
			success : success,
			error : error
		});
	}
});
Pn.getParam = function(key) {
	var aParams = location.search.substr(1).split('&');
	var aKv;
	for ( var i = 0; i < aParams.length; i++) {
		aKv = aParams[i].split('=');
		if (aKv[0] == key) {
			return aKv[1];
		}
	}
};
Pn.checkBox = function(name, checked) {
	$("input[name='" + name + "']").attr("checked", checked);
};
Pn.checkLen = function(o, len) {
	len = len || 1;
	if (o.val() == undefined || $.trim(o.val()) == ''
			|| $.trim(o.val()).length < len) {
		return false;
	} else {
		return true;
	}
};
Pn.Cookie = function Cookie() {
	this.cookies = [];
	this.get = function(name) {
		this._reset();
		return this.cookies[name];
	};
	this.set = function() {
		var args = this.set.arguments;
		var _num = args.length;
		if (_num < 2) {
			return;
		}
		;
		var _cookie = args[0] + '=' + this._encode(args[1]);
		if (_num >= 3) {
			var now = new Date();
			var _expires = new Date(now.getTime() + args[2]);
			_cookie += ';expires=' + _expires.toUTCString();
		}
		;
		if (_num >= 4) {
			_cookie += ';path=' + args[3];
		}
		;
		if (_num >= 5) {
			_cookie += ';domain=' + args[4];
		}
		;
		if (_num >= 6) {
			_cookie += ';secure';
		}
		;
		document.cookie = _cookie;
	};
	this.print_r = function() {
		this._reset();
		for ( var i in this.cookies) {
			alert(i + ' -> ' + this.cookies[i]);
		}
	};
	this._reset = function() {
		var cookie = document.cookie.split(';');
		var _num = cookie.length;
		for ( var i = 0; i < _num; i++) {
			var _arr = cookie[i].split('=');
			var _name = this._trim(_arr[0]);
			var _value = '';
			if (typeof _arr[1] != 'undefined') {
				_value = this._decode(this._trim(_arr[1]));
			}
			;
			this.cookies[_name] = _value;
		}
	};
	this._trim = function(_str) {
		return _str.replace(/(^\s+)|(\s*$)/g, '');
	};
	this._encode = function(_str) {
		return encodeURI(_str);
	};
	this._decode = function(_str) {
		return decodeURI(_str);
	}
};
Pn.Cookie.countPerPage = "_countPerPage";
Pn.ns('Pn.LTable');
Pn.LTable.lineOver = function(o) {
	$(o).addClass("pn-lhover");
};
Pn.LTable.lineOut = function(o) {
	$(o).removeClass("pn-lhover");
};
Pn.LTable.lineSelect = function(o) {
	if (Pn.LTable.lineSelected) {
		$(Pn.LTable.lineSelected).removeClass("pn-lselected");
	}
	;
	Pn.LTable.lineSelected = o;
	$(o).addClass("pn-lselected");
};
Pn.ns('Pn.Tree');
Pn.Tree.switchDisplay = function(id, open) {
	var isDisplay = $('#' + id + '-s').attr("isDisplay");
	if (open && isDisplay == "true") {
		return;
	}
	;
	if (isDisplay == "true") {
		$('#' + id + '-co').hide();
		$('#' + id + '-fo').hide();
		$('#' + id + '-cc').show();
		$('#' + id + '-fc').show();
		$('#' + id + '-').hide();
		$('#' + id + '-s').attr("isDisplay", "false");
	} else {
		$('#' + id + '-cc').hide();
		$('#' + id + '-fc').hide();
		$('#' + id + '-co').show();
		$('#' + id + '-fo').show();
		$('#' + id + '-').show();
		$('#' + id + '-s').attr("isDisplay", "true");
	}
};
Pn.Tree.switchSelect = function(element, id, treeId) {
	if (element.checked) {
		$("input:checkbox", $('#' + id)).each(function() {
			this.checked = true;
		});
		var head = treeId;
		var tail = "-chk";
		var middle = id.substring(treeId.length);
		while (true) {
			middle = middle.substring(0, middle.lastIndexOf("-"));
			if (middle.length > 0) {
				$('#' + head + middle + tail).attr("checked", true);
			} else {
				break;
			}
		}
	} else {
		$("input:checkbox", $('#' + id)).each(function() {
			this.checked = false;
		});
	}
};
Pn.Tree.lineOver = function(element) {
	$(element).addClass("pn-tree-hover");
};
Pn.Tree.lineOut = function(element) {
	$(element).removeClass("pn-tree-hover");
};
Pn.Tree.lineSelected = function(element, treeId) {
	var selectedId = $('#' + treeId).attr("selectedId");
	if (selectedId) {
		$('#' + selectedId).removeClass("pn-tree-selected");
	}
	;
	$('#' + treeId).attr("selectedId", $(element).attr("id"));
	$(element).addClass("pn-tree-selected");
};

$.metadata.setType("attr", "vld");
$.validator.AlertError = {
	invalidHandler : function(form, validator) {
		var errors = validator.numberOfInvalids();
		if (errors) {
			for ( var name in validator.invalid) {
				alert(validator.invalid[name]);
				return;
			}
		}
	},
	showErrors : function(errors) {
	}
};
$.validator.addMethod("username", function(value) {
	var p = /^[0-9a-z_A-Z\u4e00-\u9fa5]+$/;
	return p.exec(value) ? true : false;
}, "用户名只能由英文字母、数字、中文和下划线组成");
jQuery.extend(jQuery.validator.messages, {
	required : "此项为必填项",
	remote : "请修正该项",
	email : "请输入正确格式的电子邮件",
	url : "请输入合法的网址",
	date : "请输入合法的日期",
	dateISO : "请输入合法的日期",
	number : "请输入合法的数字",
	digits : "只能输入整数",
	creditcard : "请输入合法的信用卡号",
	equalTo : "两次输入不一致，请重新输入",
	accept : "请输入拥有合法后缀名的字符串",
	maxlength : jQuery.format("请输入一个长度最多是 {0}; 的字符串"),
	minlength : jQuery.format("请输入一个长度最少是 {0}; 的字符串"),
	rangelength : jQuery.format("请输入一个长度介于 {0}; 和 {1}; 之间的字符串"),
	range : jQuery.format("请输入一个介于 {0}; 和 {1}; 之间的值"),
	max : jQuery.format("请输入一个最大为 {0}; 的值"),
	min : jQuery.format("请输入一个最小为 {0}; 的值")
});

Pn.ns('JCore', 'JCore.CheckCode');
JCore.CheckCode.cssClass = 'j-chkcode';
JCore.CheckCode.url = '/CheckCode.svl';
JCore.CheckCode = function(input, url, top) {
	this.input = input;
	this.url = url || JCore.CheckCode.url;
	this.top = top || 45;
	this.imgLayer = null;
	this.img = null;
	this.event = null;
	this.isShow = false;
	var o = this;
	var showImg = function() {
		if (o.imgLayer == null) {
			o.createHtml();
		}
		;
		if (!o.isShow) {
			var d = new Date().getTime();
			o.img.attr('src', o.url + '?d=' + d);
			var offset = o.input.offset();
			o.imgLayer.show();
			o.imgLayer.css('top', offset.top - o.top + 'px');
			o.imgLayer.css('left', offset.left + 'px');
			o.isShow = true;
		}
	};
	var hideImg = function() {
		if (o.isShow) {
			o.event = setTimeout(function() {
				o.imgLayer.hide();
				o.isShow = false;
			}, 200);
		}
	};
	this.input.bind('focus', showImg);
	this.input.bind('blur', hideImg);
};
JCore.CheckCode.prototype.createHtml = function() {
	this.imgLayer = $('<div/>');
	this.img = $('<img border="0" alt="验证码看不清楚?请点击刷新验证码"/>');
	var o = this;
	this.img.bind('click', function() {
		o.input.focus();
		if (o.event) {
			clearTimeout(o.event);
		}
		;
		this.src = o.url + '?d=' + new Date().getTime();
	});
	this.img.appendTo(this.imgLayer);
	this.imgLayer.appendTo(document.body);
	this.imgLayer.addClass('j-chkcode');
};
JCore.UpRoller = function(rid, speed, isSleep, sleepTime, rollCount, rollSpan,
		unitHight) {
	this.speed = speed;
	this.rid = rid;
	this.isSleep = isSleep;
	this.sleepTime = sleepTime;
	this.rollCount = rollCount;
	this.rollSpan = rollSpan;
	this.unitHight = unitHight;
	this.proll = $('#roll-' + rid);
	this.prollOrig = $('#roll-orig-' + rid);
	this.prollCopy = $('#roll-copy-' + rid);
	this.sleepCount = 0;
	this.prollCopy[0].innerHTML = this.prollOrig[0].innerHTML;
	var o = this;
	this.pevent = setInterval(function() {
		o.roll.call(o)
	}, this.speed);
};
JCore.UpRoller.prototype.roll = function() {
	if (this.proll[0].scrollTop > this.prollCopy[0].offsetHeight) {
		this.proll[0].scrollTop = this.rollSpan + 1;
	} else {
		if (this.proll[0].scrollTop % (this.unitHight * this.rollCount) == 0
				&& this.sleepCount <= this.sleepTime && this.isSleep) {
			this.sleepCount++;
			if (this.sleepCount >= this.sleepTime) {
				this.sleepCount = 0;
				this.proll[0].scrollTop += this.rollSpan;
			}
		} else {
			var modCount = (this.proll[0].scrollTop + this.rollSpan)
					% (this.unitHight * this.rollCount);
			if (modCount < this.rollSpan) {
				this.proll[0].scrollTop += this.rollSpan - modCount;
			} else {
				this.proll[0].scrollTop += this.rollSpan;
			}
		}
	}
};
JCore.LeftRoller = function(rid, speed, rollSpan) {
	this.rid = rid;
	this.speed = speed;
	this.rollSpan = rollSpan;
	this.proll = $('#roll-' + rid);
	this.prollOrig = $('#roll-orig-' + rid);
	this.prollCopy = $('#roll-copy-' + rid);
	this.prollCopy[0].innerHTML = this.prollOrig[0].innerHTML;
	var o = this;
	this.pevent = setInterval(function() {
		o.roll.call(o)
	}, this.speed);
};
JCore.LeftRoller.prototype.roll = function() {
	if (this.proll[0].scrollLeft > this.prollCopy[0].offsetWidth) {
		this.proll[0].scrollLeft = this.rollSpan + 1;
	} else {
		this.proll[0].scrollLeft += this.rollSpan;
	}
};
JCore.checkUserName = function(username, base) {
	base = base || '';
	$.postJson(base + '/mhcms/core/ajax/checkUserName.do', {
		'username' : username
	}, function(data) {
		if (data.success) {
			alert('该用户名没有被注册，可以使用。');
		} else {
			alert('该用户名已经被注册！');
		}
	});
};
Pn.ns('Auxi');
Auxi.saveMsg = function(base, callback) {
	base = base || '';
	$.postJson(base + '/mhcms/ajax/auxiliary/msgSave.do', {
		'ctg.id' : $('#msg_ctg_id').val(),
		'title' : $('#msg_title').val(),
		'content' : $('#msg_content').val(),
		'checkCode' : $('#msg_checkCode').val()
	}, function(data) {
		if (callback) {
			callback.apply(document, [ data ]);
		} else {
			alert(data.msg);
		}
		;
		if (data.success) {
			location.reload();
		}
	});
}