package com.philip.core.web;

import static com.daoman.parox.common.web.Constants.USER_SESSION;

import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;
import org.springframework.web.util.UrlPathHelper;

import com.daoman.core.util.HttpSessionUtil;
import com.daoman.parox.admin.model.Admin;
import com.daoman.parox.common.web.RequestUtils;
import com.daoman.parox.core.model.UnifiedUser;
import com.philip.base.EduBase;
import com.philip.edu.pojo.LdapPerson;

public class EduContextInterceptor extends HandlerInterceptorAdapter{

	private Logger log = Logger.getLogger(EduContextInterceptor.class);
	
	private String loginUrl;
	private String returnUrl;
	
	private boolean auth = true;
	private String[] excludeUrls;
	
	@Override
	public boolean preHandle(HttpServletRequest request,
			HttpServletResponse response, Object handler) throws Exception {
		log.debug(RequestUtils.getLocation(request));
		System.out.println("EduContextInterceptor:"+RequestUtils.getLocation(request));
		Set<String> fiSet = (Set<String>) HttpSessionUtil.getAttribute(request, Admin.RIGHTS_KEY);
		// 检查访问地址是否在管理员的权限集中
		String url = getUrl(request);
		//log.debug("AccessControlFilter:url="+url);
		// 不在验证的范围内
		if (exclude(url)) {
			return true;
		}
		if(!HttpSessionUtil.exists(request, "AdminUtils.USER_KEY")){
			response.sendRedirect(request.getContextPath() + "/no_login.html");
			return false;
		}else{
			UnifiedUser user = (UnifiedUser)HttpSessionUtil.getAttribute(request, USER_SESSION);
		}
		//String domain = request.getServerName();
		//Long userId = (Long) session.getAttribute(AdminUtils.USER_KEY);
		LdapPerson person = (LdapPerson) HttpSessionUtil.getAttribute(request, EduBase.USER_KEY);
		if (person == null) {
			response.sendError(HttpServletResponse.SC_FORBIDDEN);
			return false;
		}
		
		// 已在本站注册的超级管理员不受权限控制
		/*if (adminId.equals(1L)) {
			return true;
		}*/
		if (fiSet == null || !fiSet.contains(url)) {
			response.sendError(HttpServletResponse.SC_FORBIDDEN);
			return false;
		}
		return true;
	}
	
	private String getUrl(HttpServletRequest req) {
		String url = req.getRequestURI();
		String context = req.getContextPath();
		if (url.indexOf(".") != -1) {
			return url.substring(context.length(), url.indexOf("."));
		} else if (url.indexOf("?") != -1) {
			return url.substring(context.length(), url.indexOf("?"));
		} else {
			return url.substring(context.length());
		}
	}
	
	/**
	 * 获得第三个路径分隔符的位置
	 * 
	 * @param request
	 * @throws IllegalStateException
	 *             访问路径错误，没有三(四)个'/'
	 */
	private static String getURI(HttpServletRequest request)
			throws IllegalStateException {
		UrlPathHelper helper = new UrlPathHelper();
		String uri = helper.getOriginatingRequestUri(request);
		String ctxPath = helper.getOriginatingContextPath(request);
		if (!StringUtils.isBlank(ctxPath)) {
			int start = uri.indexOf('/', 1);
			uri=uri.substring(start);
		}
		//System.out.println("uri:"+uri);
		return uri;
	}
	
	private boolean exclude(String uri) {
		//System.out.println(JSON.toJSONString(excludeUrls));
		if (excludeUrls != null) {
			for (String exc : excludeUrls) {
				if (exc.equals(uri)) {
					return true;
				}else if(exc.endsWith("*") && uri.startsWith(exc.substring(0,exc.length()-1))){
					return true;
				}
			}
		}
		return false;
	}
	
	private boolean isAjaxRequest(HttpServletRequest request) {
		String requestType = request.getHeader("X-Requested-With");
		//System.out.println("X-Requested-With:"+requestType);
		//System.out.println("Accept:"+request.getHeader("Accept"));
		if("XMLHttpRequest".equalsIgnoreCase(requestType)){
			return true;
		}else{
			return false;
		}
	}
	
	
	public String getLoginUrl() {
		return loginUrl;
	}

	public void setLoginUrl(String loginUrl) {
		this.loginUrl = loginUrl;
	}

	public String getReturnUrl() {
		return returnUrl;
	}

	public void setReturnUrl(String returnUrl) {
		this.returnUrl = returnUrl;
	}

	public boolean isAuth() {
		return auth;
	}

	public void setAuth(boolean auth) {
		this.auth = auth;
	}

	public String[] getExcludeUrls() {
		return excludeUrls;
	}

	public void setExcludeUrls(String[] excludeUrls) {
		this.excludeUrls = excludeUrls;
	}
}
