package com.philip.edu.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.daoman.core.util.AESUtil;
import com.daoman.parox.core.service.DocumentService;
import com.daoman.parox.upload.service.UploadService;
import com.philip.base.EduBase;

public class DwloadFdfsController extends EduBase  {

	@Autowired
	private UploadService uploadService;
	@Autowired
	private DocumentService documentService;
	
	@RequestMapping(value = "/download", method = RequestMethod.GET)
	public String download(HttpServletRequest request,
			HttpServletResponse response, ModelMap out, String sign) {
		
		// 反解串sign
		String path = null;
		String displayName = null;
		String downloadType = null;
		String type = null;
		String contentType = null;
		try {
			String jsonString = AESUtil.Decrypt(sign, AES_KEY_ZUST);
			JSONObject jObj = JSON.parseObject(jsonString);
			displayName = jObj.getString("displayName");
			path = jObj.getString("path");
			downloadType = jObj.getString("downloadType");
			type = jObj.getString("type");
			contentType = jObj.getString("contentType");
		} catch (Exception e) {
			e.printStackTrace();
		}

		uploadService.downloadFileFromFDFS(request, response, path,
				displayName, downloadType, type, contentType);
		return null;
	}
}
