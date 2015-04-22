package com.philip.base;

import static com.daoman.parox.common.web.ProcessTimeFilter.START_TIME;

import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;

import com.daoman.core.util.ConfigProperties;
import com.daoman.parox.base.BaseController;
import com.daoman.parox.common.web.CookieUtils;
import com.daoman.parox.common.web.RequestUtils;
import com.philip.edu.pojo.LdapPerson;

public class EduBase extends BaseController {
	
	Logger log = Logger.getLogger(BaseController.class);
	
	public static final String AES_KEY = "weijianzhixiang7";

	/**
	 * 指定记录数的cookie名称
	 */
	public static final String COOKIE_COUNT = "_countPerPage";
	/**
	 * cookie能指定的最大记录数
	 */
	public static final int COOKIE_MAX_COUNT = 200;
	/**
	 * 默认记录数
	 */
	public static final int DEFAULT_COUNT = 20;
	
	/**
	 * 页面完整地址
	 */
	public static final String LOCATION = "location";
	
	/**
	 * 部署路径
	 */
	public static final String BASE_ADDR = "baseAddr";
	
	/*
	 * 图片文件根路径
	 */
	public static final String IMG_ROOT = "imgRoot";
	
	/*
	 * css文件根路径
	 */
	public static final String CSS_ROOT = "cssRoot";
	
	/*
	 * js文件根路径
	 */
	public static final String JS_ROOT = "jsRoot";
	
	/**
	 * 用户KEY
	 */
	public static final String USER_KEY = "user";
	
	/**
	 *<pre>
	 * 获取count的合法值，count约束条件：
	 * <tt>1< count <= {@link #COOKIE_MAX_COUNT}</tt>
	 * 
	 * @author zby
	 * @date 2014-07-18
	 * 
	 * @param count
	 * 
	 * @return 合法的count
	 *</pre>
	 */
	public static int COOKIE_COUNT(int count){
		if(count < 1){
			return DEFAULT_COUNT;
		}else if(count > COOKIE_MAX_COUNT){
			return COOKIE_MAX_COUNT;
		}else{
			return count;
		}
	}
	
	/**
	 * 获得页面cookie指定的每页显示记录数
	 * 
	 * @return
	 */
	protected int getCookieCount(HttpServletRequest request) {
		Cookie c = CookieUtils.getCookie(request, COOKIE_COUNT);
		int count = 0;
		if (c != null) {
			try {
				count = Integer.parseInt(c.getValue());
			} catch (Exception e) {
			}
		}
		if (count <= 0) {
			count = DEFAULT_COUNT;
		} else if (count > 200) {
			count = COOKIE_MAX_COUNT;
		}
		return count;
	}
	
	/**
	 * 返回该日的最后时刻.
	 */
	protected Date dateEnd(Date date){
		if(date!=null){
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");   
	        String time=sdf.format(date);  
			Calendar cd = Calendar.getInstance();
	        
	        try {
	            cd.setTime(sdf.parse(time));
	        } catch (ParseException e) {
	            e.printStackTrace();
	        }
	        cd.add(Calendar.DATE, 1);//增加一天
	        cd.add(Calendar.SECOND, -1);
	        return cd.getTime();
		}else{
			return null;
		}
	}
	
	/**
	 * 返回该日的开始时刻.
	 */
	protected Date dateStart(Date date){
		if(date!=null){
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");   
	        String time=sdf.format(date);  
			Calendar cd = Calendar.getInstance();
	        
	        try {
	            cd.setTime(sdf.parse(time));
	        } catch (ParseException e) {
	            e.printStackTrace();
	        }
	       
	        return cd.getTime();
		}else{
			return null;
		}
	}
	
	/**
	 * 返回增加天数后的日期
	 * @param date
	 * @param num
	 * @return
	 */
	protected Date dateAddDays(Date date,int num){
		if(date!=null){
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");   
	        String time=sdf.format(date);  
			Calendar cd = Calendar.getInstance();
	        
	        try {
	            cd.setTime(sdf.parse(time));
	        } catch (ParseException e) {
	            e.printStackTrace();
	        }
	        cd.add(Calendar.DATE, num);
	        return cd.getTime();
		}else{
			return null;
		}
	}
	
	protected String formatDate(Date date){
		if(date!=null){
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");   
	        String d=sdf.format(date);  
			return d;
		}else{
			return null;
		}
	}
	
	protected String formatDate2(Date date){
		if(date!=null){
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");   
	        String d=sdf.format(date);  
			return d;
		}else{
			return null;
		}
	}
	
	protected String formatTime(Date date){
		if(date!=null){
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");   
			String d=sdf.format(date);  
			return d;
		}else{
			return null;
		}
	}
	
	protected Date convertFromString(String sdate,String format){
		Date date = null;
		SimpleDateFormat sdf = new SimpleDateFormat(format);
		try {
			date = sdf.parse(sdate);			
		} catch (ParseException e) {
			log.error("convertFromString ERROR!");
		}
		return date;
	}
	
	public String decode(String value){
		return DECODE(value);//Modified by PZP@2012-04-05
	}
	
	/**decode()的静态版本 */
	public final static String DECODE(final String value){
		//check
		if(value==null)
			return null;
		if("".equals(value.trim()))
			return "";
		
		String cval=null;
		try{
			cval=java.net.URLDecoder.decode(value,"UTF-8");
		}catch(UnsupportedEncodingException e){
			cval=value;
		}
		return cval;
	}
	
	public String encode(String value){
		return ENCODE(value); //Modified by PZP@2012-04-05
	}
	
	/**encode()的静态版本 */
	public final static String ENCODE(final String value){
		//check
		if(value==null){
			return null;
		}
		if("".equals(value.trim())){
			return "";
		}
		
		String cval=null;
		try{
			//两次编码
			cval=java.net.URLEncoder.encode(value,"UTF-8");
		}catch(UnsupportedEncodingException e){
			cval=value;
		}
		return cval;
	}
	
	/**
	 * 用于返回 AJAX 请求的执行结果，通过 SpringMvc 以 JSON 格式返回
	 * 
	 * @param success 执行成功状态，默认 false
	 * @param returnMsg 需要返回的“消息”，可以是任何期望的对象信息
	 * @return
	 */
	public static Map<String, Object> ajaxResult(Boolean success, Object returnMsg){
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("success", success==null?false:success);
		map.put("message", returnMsg);
		return map;
	}

	/**
	 * 为前台模板设置公用数据
	 * 
	 * @param request
	 * @param model
	 */
	public static void frontData(HttpServletRequest request,
			Map<String, Object> map) {
		LdapPerson user = getUser(request);
		//Set<String> rights = getRights(request);
		String location = RequestUtils.getLocation(request);
		Long startTime = (Long) request.getAttribute(START_TIME);
		map.put(BASE_ADDR, ConfigProperties.get("baseAddr", "http://192.168.1.200"));
		map.put(CSS_ROOT, ConfigProperties.get("cssRoot", "http://192.168.1.200/css"));
		map.put(IMG_ROOT, ConfigProperties.get("imgRoot", "http://192.168.1.200/images"));
		map.put(JS_ROOT, ConfigProperties.get("jsRoot", "http://192.168.1.200/js"));
		frontData(map, user, location, startTime);
	}

	public static void frontData(Map<String, Object> map, 
			LdapPerson user, String location, Long startTime) {
		if (startTime != null) {
			map.put(START_TIME, startTime);
		}
		if (user != null) {
			map.put(USER_KEY, user);
		}
		/*if (rights != null) {
			map.put(RIGHTS_KEY, rights);
		}*/
		//map.put(SITE, site);
		//String ctx = site.getContextPath() == null ? "" : site.getContextPath();
		//map.put(BASE, "");
		//map.put(RES_SYS, ctx + RES_PATH);
		//String res = ctx + RES_PATH + "/" + site.getPath() + "/" + site.getTplSolution();
		// res路径需要去除第一个字符'/'
		//map.put(RES_TPL, res.substring(1));
		map.put(LOCATION, location);
	}
	
	/**
	 * 获得用户
	 * 
	 * @param request
	 * @return
	 */
	public static LdapPerson getUser(HttpServletRequest request) {
		return (LdapPerson) request.getAttribute(USER_KEY);
	}
}
