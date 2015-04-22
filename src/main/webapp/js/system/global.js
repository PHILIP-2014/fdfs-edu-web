//应用常量
var _CTX_PATH = _CTX_PATH||'';
var _MASTER_SITE = 'http://www.parox.com';
var _LOGIN_URL = "http://www.parox.com/login/";
var _PIC_UPLOAD_URL = _CTX_PATH+"/fileUpload";
var _REG_URL ="";
var _IMG_ROOT ="http://127.0.0.1/images/";
var _JS_ROOT ="http://127.0.0.1/js/";

function relogin()
{
	var myurl = location.href;
	//myurl = myurl.replace("img.parox.com", "www.parox.com");
	location.replace(_LOGIN_URL+"?force=1&returnUrl="+encodeURIComponent(myurl));
}
function alertLogin()
{
	Parox.Dialog.Login({title:'登录'});
}
function reload()
{
	//location.href = location.href;
	window.location.reload(true);
}
function reloadDelay()
{
	setTimeout(reload,1000);
}
function home()
{
	window.location = _CTX_PATH+'/member/dashboard.htm';
}
function homeDelay()
{
	setTimeout(home,1000);
}
function redirect(url)
{
	window.location = url;
}
function redirectDelay(url)
{
	setTimeout(function(){redirect(url);},1000);
}