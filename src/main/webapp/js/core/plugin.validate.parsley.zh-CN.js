// ParsleyConfig definition if not already set
window.ParsleyConfig = window.ParsleyConfig || {};
window.ParsleyConfig.i18n = window.ParsleyConfig.i18n || {};

// Define then the messages
window.ParsleyConfig.i18n.zhCN = $.extend(window.ParsleyConfig.i18n.zhCN || {}, {
	defaultMessage: "请填写正确的格式。",//"This value seems to be invalid.",
	type: {
		email:		"应该填写的是一个有效的邮箱地址。",//"This value should be a valid email.",
		url:		"应该填写的是一个有效的url链接。",//"This value should be a valid url.",
		number:		"应该填写的是一个有效的数字。",//"This value should be a valid number.",
		integer:	"应该填写的是一个有效的整数。",//"This value should be a valid integer.",
		digits:		"应该填写的是一个有效的小数。",// "This value should be digits.",
		alphanum:	"应该填写的是一个有效的字母数字。"//"This value should be alphanumeric."
	},
	notblank:		"不能值填写空白。",//"This value should not be blank.",
	required:		"必须填写。",//"This value is required.",
	pattern:		"格式不正确。",//"This value seems to be invalid.",
	min:			"应该大于或者等于%s。",// "This value should be greater than or equal to %s.",
	max:			"应该小于或者等于%s。",//"This value should be lower than or equal to %s.",
	range:			"应该是%s-%s范围内的一个值",//"This value should be between %s and %s.",
	minlength:		"至少%s个字符。",//"This value is too short. It should have %s characters or more.",
	maxlength:		"不能超过%s个字符。",//"This value is too long. It should have %s characters or less.",
	length:			"字符长度应该在%s - %s范围以内。",//"This value length is invalid. It should be between %s and %s characters long.",
	mincheck:		"至少选择 %s 个选项。",//"You must select at least %s choices.",
	maxcheck:		"最多选择 %s 个选项。",//"You must select %s choices or less.",
	check:			"应该选择 %s - %s 个范围内的选项。",//"You must select between %s and %s choices.",
	equalto:		"应该是个相同值。"//"This value should be the same."
});



/*$('input[name="emailMobile"]').parsley().addAsyncValidator('emailmobile',function(xhr){
	var resposeText 	= $.parseJSON(xhr.responseText);
	var $input			= $('input[name="emailMobile"]');
	$input.attr('data-parsley-remote-message',$.parseJSON(xhr.responseText).msg);
	if(resposeText.code===-1&&resposeText.code===-2&&resposeText.code===-3){
		//window.ParsleyUI.updateError($('input[name="emailMobile"]'), 'emailmobile', $.parseJSON(xhr.responseText).msg);
		$('.parsley-errors-list').find('parsley-remote').html($.parseJSON(xhr.responseText).msg);
		return false;
	}else if(resposeText.code===1&&resposeText.code===2){
		return true;
	}
return 404 === xhr.status;
},'http://www.parox.com/register/regSelect.htm');*/


// If file is loaded after Parsley main file, auto-load locale
window.ParsleyValidator
	.setLocale('zhCN')
	.addValidator(
			'emailmobile',
			function(value,requirement){
				var _val=value.trim();
				var regMobile=/^(13[0-9]{9}|$15[0-9]{9}|18[0-9]{9}|$14[5-7]{9})$/;
				var regEmail =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
				console.log(regMobile.test(_val)||regEmail.test(_val));
				if(regMobile.test(_val)||regEmail.test(_val)){
					$.ajax({
						url:_CTX_PATH+"/register/regSelect.htm",
						type:"post",
						data: {emailMobile:value},
						datatype : "json", 
						success:function(data){
							var jsonData = data;
							//console.log(jsonData.code)
							//@param 1手机和邮箱可以使用 
							//@param 2邮箱可以使用
							if(jsonData.code != 1 && jsonData.code != 2) {
								$('.parsley-errors-list').html('<li class="parsley-normal parsley-emailmobile">邮箱已经被注册！</li>');
								return;
							}else if(jsonData.code == 1){
								$('.parsley-errors-list').html('<li class="parsley-normal parsley-emailmobile">手机可以使用！</li>');
								return;
							}else if(jsonData.code == 2){
								$('.parsley-errors-list').html('<li class="parsley-normal parsley-emailmobile">邮件可以使用！</li>');
								return;
							}
						}
					});
					return true;
				}else{
					return false;
				}	
			}
	)	
	.addValidator(
			'mobile',
			function(value,requirement){
				console.log(value);
				var value=value.trim();
				var regMobile=/^(13[0-9]{9}|$15[0-9]{9}|18[0-9]{9}|$14[5-7]{9})$/;
				if(!regMobile.test(value.trim())){	
					console.log('电话格式不正确');
					return false;
				}else{
					$.ajax({
						url:_REG_URL+"/settings/ajax/checkMobile.htm",
						type:"post",
						data: {mobile:value},
						datatype : "json", 
						success:function(data){
							if(data.success) {
								$('.parsley-errors-list').html('');
								return true;
							}else{
								$('.parsley-errors-list').html('<li class="parsley-normal parsley-emailmobile">此手机已绑定其他账户，无法进行验证，建议更换其他号码操作</li>');
								return false;
							}
						}
					});
					return true;
				}
			}
	)
	.addValidator(
			'charFilter',
			function(value,requirement){
				console.log(value);
				var _value	= value.trim();
				var _regexp = new RegExp("[`~!@#$%^&*()+=|{}':;'\\[\\].<>/?~！@#￥%……&*（）——+|{}【】‘；：”“’。，、？]");
				if(_regexp.test(_value.trim())){
					return false;
				}else{
					return true;
				}
			}
	)
	.addMessage('zhCN','charFilter','不允许使用\*\？\@等特殊符号')
	.addMessage('zhCN','mobile','你输入的不是一个正确的电话号码！')
	//.addMessage('zhCN','email','你输入的不是一个正确的邮箱帐号！')
	.addMessage('zhCN','emailmobile','你输入的不是一个正确的邮箱或者手机号码！');