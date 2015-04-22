package com.philip.edu.controller;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.daoman.core.util.HttpSessionUtil;
import com.daoman.parox.common.exception.ServiceException;
import com.daoman.parox.core.utils.AppUtils;
import com.daoman.parox.core.web.WebErrors;
import com.philip.base.EduBase;
import com.philip.edu.pojo.LdapPerson;
import com.philip.edu.service.UnifiedAuthService;

@RequestMapping("/login")
@Controller
public class LoginController extends EduBase {
	
	@Autowired
	private UnifiedAuthService unifiedAuthService;
	
	@RequestMapping(method = RequestMethod.GET)
	public String login(HttpServletRequest request, ModelMap model) {
		//model.putAll(RequestUtils.getQueryParams(request));
		frontData(request, model);
		return "/login";
	}
	
	@RequestMapping(value = "/validate")
	@ResponseBody
	public Map<String, Object> loginValidate(String loginName, String password, String remember, HttpServletRequest request, ModelMap model) {
		WebErrors errors = validateSubmit(loginName, password, request);
		if (errors.hasErrors()) {
			return ajaxResult(false, errors.getErrors().get(0));
		}
		LdapPerson user=null;
		try {
			user = unifiedAuthService.authenticate(loginName, password);
		} catch (ServiceException e) {
			return ajaxResult(false, errors.getMessage(e.getMessage()));
		}
		if(user==null){
			return ajaxResult(false, errors.getMessage("error.usernameNotExist"));
		}else{
			HttpSessionUtil.setAttribute(request, USER_KEY, user);
			//HttpSessionUtil.setAttribute(request, Admin.ADMIN_KEY, admin.getAdminId());
			Map<String, Object> result = ajaxResult(true, "登录成功");
			result.put("url", AppUtils.createUrl(user.getUserId(),user.getRealName(),user.getDeptName(), remember));
			return result;
		}
	}
	
	@RequestMapping(value = "/logout")
	@ResponseBody
	public Map<String, Object> logout(HttpServletRequest request, ModelMap model){
		// 清除以前登录信息
		//contextPvd.logout();
		HttpSessionUtil.setAttribute(request, USER_KEY, null);
		//saveAdminlog();
		return ajaxResult(true, "退出成功！");
	}
	
	private WebErrors validateSubmit(String username, String password,
			HttpServletRequest request) {
		WebErrors errors = WebErrors.create(request);
		if (errors.ifOutOfLength(username, "username", 4, 30)) {
			return errors;
		}
		if (errors.ifOutOfLength(password, "password", 3, 20)) {
			return errors;
		}
		return errors;
	}

}
