/**
 * init.area-v2.0.js
 * 系统的一些初始化数据及其操作。
 * 区域数据；省份+地区
 * 
 * 基于jQuery实现，
 * @date 2014-07-12
 */
$(function() {
	var province = $('#province_id'), city = $('#city_id');
	if (province.length) {
		if(city.length){
			province.change(function() {
				City.asyncUpdateChildSelect.call(this, '/area/jsonL2.htm', 'provinceId', city, true);
			});
		}
		// 加载省份数据
		AjaxPost('/area/jsonL2.htm', null, function(list) {
			if (typeof (list) == "string") {
				list = eval(list);
			}
			var i = 0, size = list.length, opt = null;

			province.empty();
			province.append($('<option value="">[请选择]</option>'));

			for (; i < size; ++i) {
				opt = $('<option></option>');
				opt.val(list[i].areaId);
				opt.text(list[i].name || '');
				opt.attr('title', (list[i].name || ''));
				province.append(opt);
			}
			if (province.attr(province.attr('name'))) {
				province.val(province.attr(province.attr('name')));
			}
			// province.change();

			var provinceVal = province.val() || province.attr(province.attr('name'));
			City.asyncUpdateChildSelect.call(province,
					'/area/jsonL2.htm', 'provinceId=' + provinceVal, city,
					true, function(city) {
						var cityId = city.attr('cityId');
						// alert(sonId);
						city.children().each(
								function() {// 选择二级区域
									if (typeof cityId == 'undefined'
											|| $.trim(cityId) == '') {
										return false;
									}
									// alert(this.value)
									if ((cityId == this.value)) {
										city.val(this.value);
										city.change();
										return false;
									}
								});
					});
		});
	}
});
var City = {
	asyncUpdateChildSelect : function(url, parentSelectName, jq_cselect,
			hasDef, callback) {
		// alert("2:"+$);
		var val = null, parentId = null, i = 0;
		if (this != City) {
			val = $(this).val() || $(this).attr($(this).attr('name'));
		}
		if (!val) {
			jq_cselect.empty();
			if (hasDef) {
				jq_cselect.append($('<option value="">[请选择]</option>'));
			}
			// 以下代码兼容选项可选的父级select
			i = parentSelectName.indexOf('=');
			if (i > 0) {
				parentId = $.trim(parentSelectName.slice(0, i));
			} else {
				parentId = $.trim(parentSelectName);
			}
			parentId = parentId.slice(0, -2) + "_id";

			if ($.trim($('#' + parentId).val()) === '') {
				return;
			}
		}
		// alert(parentId+':'+val);
		AjaxPost(
				url,
				(this == City) ? "parentId" : ("parentId=" + val),
				function(list) {
					if (typeof (list) == "string") {
						list = eval(list);
					}
					var i = 0, size = list.length, opt = null;

					jq_cselect.empty();
					if (hasDef) {
						jq_cselect.empty();
						jq_cselect.append($('<option value="">[请选择]</option>'));
					}
					for (; i < size; ++i) {
						opt = $('<option></option>');
						opt.val(list[i].areaId);
						opt.text(list[i].name || '');
						opt.attr('title', (list[i].name || ''));
						jq_cselect.append(opt);
					}
					jq_cselect.change();
					// alert(jq_cselect.attr('name')+":"+jq_cselect.val());

					if (callback && typeof callback == "function") {
						// alert('callback');
						callback(jq_cselect);
					}
				});
	}
}