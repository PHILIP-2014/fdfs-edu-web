var JSON = {};
JSON.decode = function(str) {
	try {
		return window.eval("(" + str + ")")
	} catch (e) {
		return null
	}
};
function Class(F, E) {
	var A = F.constructor == Object ? undefined : F.constructor;
	if (E) {
		var H = function() {
			E.call(this)
		}
	}
	var D = A || H || new Function();
	if (E) {
		function C() {
		}
		C.prototype = E.prototype;
		D.prototype = new C()
	}
	for ( var B in F) {
		D.prototype[B] = F[B]
	}
	D.constructor = D;
	return D
}
function _extend(B, A) {
	if (B && A) {
		for ( var C in A) {
			B[C] = A[C]
		}
	}
	return B
}
function _try() {
	for ( var B = 0, A = arguments.length; B < A; B++) {
		try {
			return arguments[B]()
		} catch (C) {
		}
	}
	return null
}
function Event(A) {
	A = A || window.event;
	this.target = A.target || A.srcElement;
	_extend(this, A);
	this.keyCode = A.which ? A.which : A.keyCode;
	this.rightClick = (A.which == 3) || (A.button == 2)
}
Event.add = function(B, A, C) {
	if (window.addEventListener) {
		B.addEventListener(A, C, false)
	} else {
		B.attachEvent("on" + A, C)
	}
};
Event.remove = function(B, A, C) {
	if (window.removeEventListener) {
		B.removeEventListener(A, C, false)
	} else {
		B.detachEvent("on" + A, C)
	}
};
var Element = new Class( {
	constructor : function(A) {
		if (!A) {
			return
		}
		if (A.constructor == String) {
			A = document.createElement(A)
		}
		return G(A)
	}
});
Element.prototype = {
	wrapVersion : 1,
	css : function(B) {
		var D = arguments.length;
		if (D > 1 && D % 2 == 0) {
			for ( var H = 0; H < D; H += 2) {
				var C = arguments[H], A = arguments[H + 1];
				if (typeof C == "string" && typeof A == "string") {
					this.style[C] = A
				}
			}
		} else {
			if (D == 1) {
				if (typeof B == "string") {
					var F = this.currentStyle
							|| document.defaultView
									.getComputedStyle(this, null);
					return F[B]
				} else {
					for ( var E in B) {
						this.style[E] = B[E]
					}
				}
			}
		}
		return this
	},
	show : function(A) {
		this.style.display = A || "";
		return this
	},
	hide : function() {
		this.style.display = "none";
		return this
	},
	addClass : function(A) {
		var B = this.className.split(/\s+/);
		B.push(A);
		this.className = B.join(" ");
		return this
	},
	removeClass : function(B) {
		var C = this.className.split(/\s+/);
		var A = C.length;
		while (A--) {
			if (C[A] == B) {
				C.splice(A, 1)
			}
		}
		this.className = C.join(" ");
		return this
	},
	append : function(A) {
		this.appendChild(A);
		return this
	},
	setHTML : function(A) {
		this.innerHTML = A;
		return this
	},
	remove : function() {
		if (this.parentNode) {
			this.parentNode.removeChild(this)
		}
		return this
	},
	clearEmptyNode : function() {
		var A = this.childNodes;
		var B = A.length;
		while (B--) {
			var C = A[B];
			if (C.nodeType != 1
					&& (C.nodeType != 3 || C.nodeValue.trim().length == 0)) {
				this.removeChild(C)
			}
		}
		return this
	},
	getPosition : function() {
		var C = 0, B = 0;
		var A = this;
		do {
			C += A.offsetLeft || 0;
			B += A.offsetTop || 0;
			A = A.offsetParent
		} while (A);
		return {
			left : C,
			top : B
		}
	},
	setOpacity : function(A) {
		this.style.visibility = A < 0.001 ? "hidden" : "visible";
		if (!this.currentStyle || !this.currentStyle.hasLayout) {
			this.style.zoom = 1
		}
		if (window.ActiveXObject) {
			this.style.filter = (A == 1) ? "" : "alpha(opacity=" + A * 100
					+ ")"
		}
		this.style.opacity = A;
		return this
	}
};
function G(A) {
	if (A.constructor == String) {
		A = document.getElementById(A)
	}
	if (!A) {
		return null
	}
	var B = Element.prototype;
	if (A.wrapVersion == B.wrapVersion) {
		return A
	}
	for ( var C in B) {
		A[C] = B[C]
	}
	return A
}
/*
function Ajax(B, C) {
	this.onSuccess = B;
	if (C) {
		this.onFail = C
	}
	if (window.XMLHttpRequest) {
		this.xhr = new XMLHttpRequest()
	} else {
		try {
			this.xhr = new ActiveXObject("Msxml2.XMLHTTP")
		} catch (A) {
			this.xhr = new ActiveXObject("Microsoft.XMLHTTP")
		}
	}
	this.async = true;
	this.dataType = "text"
}
Ajax.prototype = {
	setXML : function() {
		this.dataType = "xml"
	},
	send : function(B, E, H, D) {
		var A = "get";
		var F = "application/x-www-form-urlencoded";
		if (H && H == "post") {
			A = "post"
		}
		if (A == "post") {
			if (D) {
				F += "" + D
			} else {
				F += ";charset=GBK"
			}
		} else {
			if (E) {
				if (B.indexOf("?") < 0) {
					B = B + "?"
				}
				if (B.lastIndexOf("&") != (B.length - 2)) {
					B = B + "&"
				}
				if (E) {
					B = B + E + "&"
				}
				B = B + "reqTime=" + new Date().getTime();
				E = null
			}
		}
		var C = this;
		this.xhr.open(A.toUpperCase(), B, this.async);
		this.xhr.onreadystatechange = function() {
			C.onStateChg.call(C)
		};
		if (A == "post") {
			this.xhr.setRequestHeader("Content-Type", F)
		}
		this.xhr.send(E)
	},
	post : function(A, C, B) {
		this.send(A, C, "post", B)
	},
	get : function(A, B) {
		this.send(A, B)
	},
	onStateChg : function() {
		if (this.xhr.readyState != 4) {
			return
		}
		if (this.xhr.status >= 200 && this.xhr.status < 300) {
			var A;
			if (this.dataType == "xml") {
				A = this.xhr.responseXML
			} else {
				A = this.xhr.responseText
			}
			this.onSuccess.call(this, A)
		} else {
			if (this.onFail) {
				this.onFail()
			}
		}
	}
};
*/
Array.prototype.remove = function(B) {
	var A = this.length;
	while (A--) {
		if (this[A] === B) {
			this.splice(A, 1)
		}
	}
	return this
};
Array.prototype.contains = function(B) {
	var A = this.length;
	while (A--) {
		if (this[A] === B) {
			return true
		}
	}
	return false
};
function insertAfter(C, A) {
	var B = A.parentNode;
	if (B.lastChild == A) {
		B.appendChild(C)
	} else {
		B.insertBefore(C, A.nextSibling)
	}
}
String.prototype.trim = function() {
	return this.replace(/(^\s+|\s+$)/g, "")
};
String.prototype.escapeHTML = function() {
	return this.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g,
			"&gt;")
};
String.prototype.unescapeHTML = function() {
	return this.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g,
			"&")
};
String.prototype.format = function() {
	var B = [];
	B = Array.apply(B, arguments);
	var A = this.replace(/\{([0-9]+)\}/g, function(C, D) {
		var E = B[parseInt(D, 10)];
		return typeof (E) == "undefined" ? "" : E
	});
	return A
};
String.prototype.startWith = function(A) {
	return this.indexOf(A) == 0
};
String.prototype.endWith = function(A) {
	return this.lastIndexOf(A) == (this.length - A.length)
};
function getSubstrNumber(C, B) {
	if (C === "" || B === "") {
		return 0
	}
	C = "" + C;
	var A = C.split(B);
	return A.length - 1
}
function trim(A) {
	A = "" + A;
	return A.replace(/(^[\s\u3000\xa0]+|[\s\u3000\xa0]+$)/g, "")
}
function escapeHTML(A) {
	A = "" + A;
	return A.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}
function unescapeHTML(A) {
	A = "" + A;
	return A.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
}
function encode(A) {
	A = "" + A;
	return encodeURIComponent(A)
}
function decode(A) {
	return decodeURIComponent(A)
}
function getLengthCase(B) {
	var A = B.length;
	B.replace(/[\u0080-\ufff0]/g, function() {
		A++
	});
	return A
}
function subStrCase(B, A) {
	while (getLengthCase(B) > A) {
		B = B.substr(0, B.length - 1)
	}
	return B
}
function insertWbr(C) {
	var D = [];
	var A = C.length;
	for ( var B = 0; B < A; B = B + 5) {
		D[D.length] = C.substr(B, 5)
	}
	return D.join("<wbr />")
}
function getCutString(D, A, C) {
	var B = unescapeHTML(D);
	if (getLengthCase(B) > A) {
		if (B == D) {
			B = subStrCase(B, A) + C
		} else {
			B = escapeHTML(subStrCase(B, A)) + C
		}
		return B
	} else {
		return D
	}
}
(function() {
	var A = {};
	getUniqueId = function(C) {
		var D = C || 8;
		var E = "";
		while (D--) {
			E += B()
		}
		if (!A[E]) {
			A[E] = 1;
			return E
		} else {
			return getUniqueId(D)
		}
	};
	var B = function() {
		var D = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
		var C = D.length;
		return D.charAt(Math.floor(Math.random() * C))
	}
})();
function stopDefault(A) {
	if (A && A.preventDefault) {
		A.preventDefault()
	} else {
		window.event.returnValue = false
	}
	return false
}
function stopBubble(A) {
	var A = A || window.event;
	if (A.stopPropagation) {
		A.stopPropagation()
	} else {
		window.event.cancelBubble = true
	}
}
function prev(A) {
	do {
		A = A.previousSibling
	} while (A && A.nodeType != 1);
	return A
}
function next(A) {
	do {
		A = A.nextSibling
	} while (A && A.nodeType != 1);
	return A
}
var ie = /msie/.test(window.navigator.userAgent.toLowerCase());
var ie6 = /msie 6/.test(window.navigator.userAgent.toLowerCase());
var ie7 = /msie 7/.test(window.navigator.userAgent.toLowerCase());
var moz = /gecko/.test(window.navigator.userAgent.toLowerCase());
var opera = /opera/.test(window.navigator.userAgent.toLowerCase());
var safari = /safari/.test(window.navigator.userAgent.toLowerCase());
var ismac = /mac/.test(window.navigator.userAgent.toLowerCase());
function serialize(A) {
	var D = [];
	if (A.constructor == Array) {
		for ( var C = 0; C < A.length; C++) {
			D.push(A[C].name + "=" + encodeURIComponent(A[C].value))
		}
	} else {
		for ( var B in A) {
			if (!(A[B] == undefined || A[B] == null || A[B] == "")) {
				D.push(B + "=" + encodeURIComponent(A[B]))
			}
		}
	}
	return D.join("&")
}
function serializeNoEncode(D) {
	if (!D) {
		return ""
	}
	var B = [];
	for ( var A in D) {
		var C = D[A];
		if (!C && C !== 0) {
			continue
		}
		B.push(A + "=" + C)
	}
	return B.join("&")
}
function converseData(F) {
	var E = F;
	for ( var C in E) {
		var B = E[C];
		var A = B.parent;
		if (!A) {
			if (!B.subData) {
				B.subData = {}
			}
		} else {
			var D = E[A];
			if (!D.subData) {
				D.subData = {}
			}
			D.subData[C] = B
		}
	}
	return E
}
function thisMovie(A) {
	try {
		if (navigator.appName.indexOf("Microsoft") != -1) {
			return window[A]
		} else {
			return document[A]
		}
	} catch (B) {
	}
}
function globalRegister(B) {
	if (!globalRegister.reverseMap) {
		globalRegister.reverseMap = {}
	}
	if (globalRegister.reverseMap[B]) {
		return globalRegister.reverseMap[B]
	}
	var A = "globalObject_" + getUniqueId(10);
	globalRegister.reverseMap[B] = A;
	window[A] = B;
	return A
}
function formatDate(C, B) {
	function A(D, E) {
		E = E.length;
		D = D || 0;
		var F = String(Math.pow(10, E) + D);
		return E == 1 ? D : F.substr(F.length - E)
	}
	return C.replace(/([YMDhsmw])\1*/g, function(D) {
		switch (D.charAt()) {
		case "Y":
			return A(B.getFullYear(), D);
		case "M":
			return A(B.getMonth() + 1, D);
		case "D":
			return A(B.getDate(), D);
		case "w":
			return B.getDay();
		case "h":
			return A(B.getHours(), D);
		case "m":
			return A(B.getMinutes(), D);
		case "s":
			return A(B.getSeconds(), D)
		}
	})
}
String.prototype.len = function() {
	return this.replace(/[^\x00-\xff]/g, "rr").length
};
String.prototype.sub = function(D) {
	var C = /[^\x00-\xff]/g;
	if (this.replace(C, "mm").length <= D) {
		return this
	}
	var A = Math.floor(D / 2);
	for ( var B = A; B < this.length; B++) {
		if (this.substr(0, B).replace(C, "mm").length >= D) {
			return this.substr(0, B) + "..."
		}
	}
	return this
};
function createFlash(C, A, B, D, H, E) {
	var F = '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,0,0" width="'
			+ B + '" height="' + D + '" id="' + C + '" align="middle">';
	F += '<param name="allowScriptAccess" value="always">';
	F += '<param name="quality" value="high">';
	F += '<param name="movie" value="' + A + '">';
	F += '<param name="wmode" value="' + E + '">';
	F += '<param name="flashvars" value="' + H + '">';
	F += '<embed wmode="'
			+ E
			+ '" src="'
			+ A
			+ '" flashvars="'
			+ H
			+ '" quality="high" width="'
			+ B
			+ '" height="'
			+ D
			+ '" name="'
			+ C
			+ '" align="middle" allowScriptAccess="always" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer">';
	F += "</object>";
	document.write(F)
}
var Mask = {
	show : function() {
		var A;
		var B = document.body.clientWidth;
		var D = Math.max(document.documentElement.clientHeight, Math.max(
				document.body.scrollHeight,
				document.documentElement.scrollHeight));
		if (!Mask.uniqueId) {
			Mask.uniqueId = getUniqueId() + "Mark";
			A = new Element("div");
			A.id = Mask.uniqueId;
			A.className = "mask-layer";
			document.body.appendChild(A)
		} else {
			A = G(Mask.uniqueId)
		}
		A.css( {
			left : 0,
			top : 0,
			position : "absolute",
			width : B + "px",
			height : D + "px",
			overflow : "auto"
		});
		if (ie6) {
			var C = document.body.className.split(/\s+/);
			C.push("body-masked");
			document.body.className = C.join(" ")
		}
	},
	hide : function() {
		var B = G(Mask.uniqueId);
		if (!B) {
			return
		}
		B.css( {
			left : "-30px",
			top : "-30px",
			position : "absolute",
			width : "1px",
			height : "1px",
			overflow : "hidden"
		});
		if (ie6) {
			var C = document.body.className.split(/\s+/);
			var A = C.length;
			while (A--) {
				if (C[A] == "body-masked") {
					C.splice(A, 1)
				}
			}
			document.body.className = C.join(" ")
		}
	}
};
function onClassName(C, A) {
	var C = G(C);
	var B = C.className.split(/\s+/);
	B.push(A);
	C.className = B.join(" ")
}
function unClassName(D, B) {
	var D = G(D);
	var C = D.className.split(/\s+/);
	var A = C.length;
	while (A--) {
		if (C[A] == B) {
			C.splice(A, 1)
		}
	}
	D.className = C.join(" ")
}
(function() {
	var C = {
		Email : /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
		Phone : /^((\([0-9]{2,3}\))|([0-9]{3}\-))?(\(0[0-9]{2,3}\)|0[0-9]{2,3}-)?[1-9][0-9]{6,7}(\-[0-9]{1,4})?$/,
		Mobile : /^((\([0-9]{2,3}\))|([0-9]{3}\-))?((13[0-9]{9})|(15[389][0-9]{8}))$/,
		Url : /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"])*$/,
		Ip : /^(0|[1-9][0-9]?|[0-1][0-9]{2}|2[0-4][0-9]|25[0-5]).(0|[1-9][0-9]?|[0-1][0-9]{2}|2[0-4][0-9]|25[0-5]).(0|[1-9][0-9]?|[0-1][0-9]{2}|2[0-4][0-9]|25[0-5]).(0|[1-9][0-9]?|[0-1][0-9]{2}|2[0-4][0-9]|25[0-5])$/,
		Number : /^[0-9]+$/,
		Zip : /^[1-9][0-9]{5}$/,
		QQ : /^[1-9][0-9]{4,9}$/,
		English : /^[A-Za-z]+$/,
		Chinese : /^[\u0391-\uFFE5]+$/,
		Int : /^[-\+]?[0-9]+$/,
		Double : /^[-\+]?[0-9]+(\.[0-9]+)?$/
	};
	function B(D) {
		return function(E) {
			return D.test(E)
		}
	}
	for ( var A in C) {
		window["is" + A] = B(C[A])
	}
})();
function Swf(B) {
	if (!B) {
		return null
	}
	B.vars = B.vars || {};
	B.params = B.params || {};
	B.ver = B.ver || "6.0.0";
	if (B.instanceName) {
		var A = "FLASH_" + Math.round(Math.random() * 2147483647);
		window[A] = this;
		B.vars[B.instanceName] = A
	}
	B.params.movie = B.url;
	B.vars = Swf.serialize(B.vars);
	this.args = B
}
Swf.creatHTML = function(B, A, C, K, D, I) {
	var J = [];
	var H = arguments[6] ? "align=" + arguments[6] : 'align="middle"';
	J
			.push(
					"<object ",
					'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ',
					'codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0" ',
					'width="' + C + '" ', 'height="' + K + '" ', 'id="' + B
							+ '" ', H + ">");
	for ( var E in D) {
		J.push('<param name="' + E + '" value="' + D[E] + '" />')
	}
	J.push('<param name="flashvars" value="' + I + '">');
	D.movie = null;
	var F = Swf.serialize(D).replace(/[&]/g, " ");
	J.push('<embed src="' + A + '" ', 'flashvars="' + I + '" ', 'width="' + C
			+ '" ', 'height="' + K + '" ', 'name="' + B + '" ', F + " ", H
			+ " ", 'type="application/x-shockwave-flash" ',
			'pluginspage="http://www.macromedia.com/go/getflashplayer">',
			"</object>");
	return J.join("")
};
Swf.serialize = function(D) {
	if (!D) {
		return ""
	}
	var B = [];
	for ( var A in D) {
		var C = D[A];
		if (!C && C !== 0) {
			continue
		}
		B.push(A + "=" + encodeURIComponent(C))
	}
	return B.join("&")
};
Swf.getMovieById = function(A) {
	return document[A] || window[A]
};
Swf.getVersion = function() {
	var E = navigator;
	if (E.plugins && E.mimeTypes.length) {
		var A = E.plugins["Shockwave Flash"];
		if (A && A.description) {
			return A.description.replace(/([a-zA-Z]|\s)+/, "").replace(
					/(\s)+r/, ".")
					+ ".0"
		}
	} else {
		if (window.ActiveXObject && !window.opera) {
			for ( var B = 10; B >= 2; B--) {
				try {
					var D = new ActiveXObject("ShockwaveFlash.ShockwaveFlash."
							+ B);
					if (D) {
						return B + ".0.0";
						break
					}
				} catch (C) {
				}
			}
		}
	}
};
Swf.compareVersions = function(E, D) {
	if (!E) {
		return -1
	}
	E = E.split(".");
	D = D.split(".");
	for ( var A = 0; A < 3; A++) {
		var C = parseInt(E[A], 10);
		var B = parseInt(D[A], 10);
		if (C > B) {
			return 1
		} else {
			if (C < B) {
				return -1
			}
		}
	}
	return 0
};
Swf.prototype = {
	appendTo : function(B) {
		if (B.constructor == String) {
			B = document.getElementById(B)
		}
		if (!B) {
			return
		}
		var A = this.args;
		if (Swf.compareVersions(Swf.getVersion(), A.ver) >= 0) {
			B.innerHTML = Swf.creatHTML(A.id, A.url, A.width, A.height,
					A.params, A.vars, A.align)
		} else {
			if (A.tip) {
				B.innerHTML = A.tip
			}
		}
	},
	call : function() {
		try {
			var E = this.args;
			var A = Array.prototype.slice.call(arguments);
			var C = A.shift();
			var B = Swf.getMovieById(E.id);
			B[C].apply(B, A)
		} catch (D) {
		}
	}
};
function getElementsByClassName(D, C, K) {
	var B = C ? G(C) : document;
	var K = K || "*";
	var L = B.getElementsByTagName(K);
	var H = [];
	for ( var I = 0, E = L.length; I < E; I++) {
		var A = L[I].className.split(" ");
		for ( var F = 0, J = A.length; F < J; F++) {
			if (A[F] == D) {
				H.push(L[I])
			}
		}
	}
	return H
}
function hide(A) {
	A = G(A);
	if (A) {
		A.style.display = "none"
	}
}
var Navigation = {
	_contactMenu : {
		active : function(B) {
			this.blur();
			stopBubble(B);
			stopDefault(B);
			var C = G("ContactMenu");
			if (C.style.display != "none") {
				Navigation._contactMenu.hide()
			} else {
				Navigation._contactMenu.show();
				var A = G("XJQMainId");
				C.style.zIndex = A ? A.style.zIndex + 2 : 3001
			}
		},
		hide : function() {
			G("ContactMenuBtn").style.borderColor = "#fff";
			hide("ContactMenu");
			hide("ContactMenuMask");
			G("RightTopNav").parentNode.style.zIndex = "";
			G("RightTopNav").parentNode.parentNode.style.zIndex = ""
		},
		show : function() {
			var C = G("ContactMenuBtn");
			var D = G("ContactMenu");
			var B = G("ContactMenuMask");
			C.style.borderColor = "#c0c0c0";
			var A = C.getPosition().left;
			var E = C.getPosition().top;
			B.style.display = D.style.display = "block";
			B.style.left = D.style.left = C.offsetLeft + "px";
			B.style.top = D.offsetTop + "px";
			B.style.height = D.offsetHeight + "px";
			B.style.width = D.offsetWidth + "px"
		},
		init : function() {
			var A = G("ContactMenuBtn");
			var B = G("ContactMenu");
			if (A) {
				A.onclick = Navigation._contactMenu.active
			}
			if (B) {
				B.onclick = stopBubble;
				hide("ContactMenu");
				Event.add(document, "click", Navigation._contactMenu.hide)
			}
		}
	},
	init : function() {
		Navigation._contactMenu.init()
	}
};
function getX(A) {
	A = A || window.event;
	return A.pageX || A.clientX + document.body.scrollLeft
}
function getY(A) {
	A = A || window.event;
	return A.pageY || A.clientY + document.body.scrollTop
}
function Tween(C, B, A) {
	if (C) {
		this.time = parseInt(C * 1000)
	}
	if (B) {
		this.transform = B
	}
	if (A) {
		this.interval = A
	}
}
function toEl(A) {
	return A.constructor == String ? document.getElementById(A) : A
}
Tween.prototype = {
	interval : 40,
	transform : function(A) {
		return 1 - Math.pow(1 - A, 3)
	},
	time : 500,
	task : null,
	finish : function() {
		this.onStep && this.onStep(1);
		this.task && clearInterval(this.task);
		this.onComplete && this.onComplete();
		this.running = false
	},
	start : function(A, D, C) {
		if (this.running) {
			this.finish()
		}
		this.running = true;
		this.onStep = A;
		this.onComplete = D;
		C = C || this.transform;
		var H = this;
		function I() {
			J += B;
			var K = J / E;
			if (K >= 1) {
				A(1);
				D();
				H.running = false;
				clearInterval(H.task)
			} else {
				A(C(K) / F)
			}
		}
		var B = this.interval;
		var E = this.time;
		var F = C(1);
		var J = 0;
		this.task = setInterval(I, B);
		return this.task
	},
	moveBy : function(C, F, E, H) {
		C = toEl(C);
		var J = C.offsetLeft;
		var I = C.offsetTop;
		var B = C.style;
		B.position = "absolute";
		function A(K) {
			if (C == null) {
				return
			}
			B.left = parseInt(J + K * F) + "px";
			B.top = parseInt(I + K * E) + "px"
		}
		function D() {
			C = B = null;
			H && H()
		}
		return this.start(A, D)
	},
	opacity : function(D, C, A, E) {
		D = toEl(D);
		var H = A - C;
		var I = true;
		function B(J) {
			J = C + H * J;
			if (D.style.filter != null) {
				D.style.filter = (J > 0.999) ? "" : "alpha(opacity=" + J * 100
						+ ")"
			} else {
				D.style.opacity = J
			}
			if (I) {
				I = false;
				D.style.display = "block"
			}
		}
		function F() {
			if (A == 0) {
				D.style.display = "none"
			}
			D = null;
			E && E()
		}
		return this.start(B, F)
	}
};
String.prototype.format = function() {
	var A = arguments.length;
	var B = this;
	while (A--) {
		B = B.replace(new RegExp("\\{" + A + "\\}", "g"), arguments[A])
	}
	return B
};
function ComboBox(A) {
	this.uniqueId = getUniqueId();
	this.name = A.name;
	this.onchange = A.onchange || null;
	this.listState = false;
	this.w;
	this.bodyId = this.uniqueId + "ComboBox";
	this.textId = this.bodyId + "Text";
	this.valueId = this.bodyId + "Value";
	this.iconId = this.bodyId + "Icon";
	this.listId = this.bodyId + "List";
	this.itemsId = this.bodyId + "Items";
	this.bodyClass = "combobox";
	this.iconClass = "combobox-icon";
	this.textClass = "combobox-input";
	this.listClass = "combobox-list";
	this.itemsClass = "combobox-items";
	this.activeClass = "combobox-item-active";
	this.init()
}
ComboBox.prototype = {
	init : function() {
		var B = G(this.name);
		this.w = B.offsetWidth;
		B.style.display = "none";
		var D = document.createElement("div");
		D.id = this.bodyId;
		D.className = this.bodyClass;
		D.style.width = this.w + "px";
		B.parentNode.appendChild(D);
		var E = document.createElement("div");
		E.id = this.textId;
		E.className = this.textClass;
		D.appendChild(E);
		var A = document.createElement("div");
		A.id = this.iconId;
		A.className = this.iconClass;
		D.appendChild(A);
		A.innerHTML = "&nbsp;";
		this.creatList();
		var C = B.options[B.selectedIndex].innerHTML;
		E.innerHTML = C;
		G(this.bodyId).title = C;
		A.onclick = this.getIconClickHandler();
		Event.add(document, "click", this.clickHandle());
		G(this.textId).style.width = (this.w - G(this.iconId).offsetWidth)
				+ "px"
	},
	creatList : function() {
		var F = G(this.name);
		var E = document.createElement("div");
		E.id = this.listId;
		E.style.width = this.w + "px";
		E.className = this.listClass;
		document.body.appendChild(E);
		this.listState = false;
		var D = F.options;
		for ( var C = 0, H = D.length; C < H; C++) {
			var B = D[C];
			var A = document.createElement("div");
			A.id = this.itemsId + C;
			A.className = this.itemsClass;
			A.rel = B.value;
			A.title = B.innerHTML;
			A.innerHTML = B.innerHTML;
			A.onmouseover = this.setItemStyle();
			A.onmouseout = this.resetItemStyle();
			A.onclick = this.getItemClickHandler();
			E.appendChild(A)
		}
	},
	clickHandle : function() {
		var A = this;
		return function(C) {
			C = C || window.event;
			var B = C.srcElement || C.target;
			if (B.id != A.iconId) {
				G(A.listId).style.display = "none";
				A.listState = false
			}
		}
	},
	getIconClickHandler : function() {
		var A = this;
		return function(I) {
			stopBubble(I);
			var F = G(A.listId);
			if (!A.listState) {
				F.style.display = "block";
				var K = F.getElementsByTagName("div");
				var D = K.length;
				var E = G(A.name);
				var C = D > 10 ? 10 : D;
				var H = G(A.bodyId);
				var J = H.getPosition();
				F.css( {
					left : J.left + "px",
					top : J.top + H.offsetHeight + "px",
					height : K[0].offsetHeight * C + "px"
				});
				var B = E.options[E.selectedIndex].innerHTML;
				while (D--) {
					var L = G(K[D]);
					if (B == L.innerHTML) {
						A.selectItem = L.id;
						G(A.selectItem).addClass(A.activeClass);
						break
					}
				}
				A.listState = true
			} else {
				F.style.display = "none";
				A.listState = false
			}
		}
	},
	setItemStyle : function() {
		var A = this;
		return function() {
			if (A.selectItem) {
				G(A.selectItem).removeClass(A.activeClass);
				A.selectItem = null
			}
			G(this).addClass(A.activeClass)
		}
	},
	resetItemStyle : function() {
		var A = this;
		return function() {
			G(this).removeClass(A.activeClass)
		}
	},
	getItemClickHandler : function() {
		var A = this;
		return function() {
			var B = this.rel;
			var C = this.title;
			G(this).addClass(A.activeClass);
			A.setSelectValue(C);
			A.onchange.call(A, {
				text : C,
				value : B
			})
		}
	},
	setSelectValue : function(E) {
		var D = G(this.name);
		var C = D.options;
		var A = G(this.textId);
		A.innerHTML = E;
		A.title = E;
		for ( var B = 0, F = C.length; B < F; B++) {
			if (C[B].innerHTML == E) {
				D.selectedIndex = B
			}
		}
	}
};
function homeInit() {
	var H = new ComboBox( {
		name : "jumpMenu"
	});
	var C = G("jumpMenu");
	var J = C.options[C.selectedIndex].value;
	var B = (J == "0") ? true : false;
	var F = window.location.href.indexOf("site_id=") > -1;
	var D = window.location.search;
	var A = G("JsCheckUrl").value;
	H.onchange = function(N) {
		if (B) {
			return alert(E_NOTICE)
		}
		var L = window.location.href;
		var K = L.indexOf("?") > -1 ? L.split("?")[0] : L;
		if (F) {
			window.location.href = window.location.href.replace(
					/site_id=\d+/gi, "site_id=" + N.value)
		} else {
			var M = D ? "&site_id=" + N.value : "?site_id=" + N.value;
			window.location.href = window.location.href + M
		}
	};
	var I = G("jumpUser");
	if (!I) {
		return false
	}
	var E = new ComboBox( {
		name : "jumpUser"
	});
	E.onchange = function(L) {
		var K = L.value.split("|");
		if (K[0] == "1") {
			window.location.href = window.location.href.split("?")[0].replace(
					/\/\d+\//gi, "/" + K[1] + "/")
		} else {
			G("GetUrl").innerHTML = '<a href="/hm-web/' + K[1]
					+ '/home/welcome/">点击开通</a>'
		}
	}
}
function ProgressBar(A) {
	this.delay = A.delay || 5000;
	this.requestUrl = A.requestUrl;
	this.onProgress = A.onProgress;
	this.onComplete = A.onComplete;
	this.ajax;
	this.timer;
	this.percent
}
ProgressBar.prototype = {
	init : function() {
		var A = this;
		function B(C) {
			A.rqResponse(C)
		}
		if (this.requestUrl) {
			this.ajax = new Ajax(B, this.rqFail);
			this.ajax.get(this.requestUrl)
		}
	},
	reTry : function() {
		var A = this;
		this.timer = setTimeout(function() {
			A.ajax.get(A.requestUrl)
		}, A.delay)
	},
	rqResponse : function(res) {
		var re = window.eval("(" + res + ")");
		if (!re) {
			return false
		}
		var me = this;
		var per = re.percent;
		if (per < 100 && per >= 0) {
			this.onProgress.call(this, re);
			this.reTry()
		} else {
			this.onComplete.call(this, re)
		}
	},
	rqFail : function() {
	}
};
