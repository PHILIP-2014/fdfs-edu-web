package com.philip.edu.controller;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.daoman.core.util.AESUtil;
import com.daoman.core.util.FileReaderUtil;
import com.daoman.core.util.Md5Util;
import com.daoman.parox.core.model.Document;
import com.daoman.parox.core.service.DocumentService;
import com.daoman.parox.upload.service.UploadService;
import com.philip.base.EduBase;
import com.philip.edu.pojo.FastdfsDoc;

@RequestMapping("/fastdfs")
@Controller
public class UploadFdfsController extends EduBase {
	@Autowired
	private UploadService uploadService;
	@Autowired
	private DocumentService documentService;

	@RequestMapping(value = "/upload", method = RequestMethod.POST)
	@ResponseBody
	public FastdfsDoc upload(HttpServletRequest request,
			HttpServletResponse response, ModelMap model,
			@RequestParam MultipartFile files, FastdfsDoc doc) {
		// 上传到fastdfs上，如果是图片还要往阿里云oss上存一份
		response.setHeader("Access-Control-Allow-Origin", "*");
		response.setHeader("Access-Control-Allow-Methods", "POST,GET");

		if (files == null || files.getSize() <= 0) {
			return null;
		}
		if (FastdfsDoc.STORAGE_TYPE.equals(doc.getStorageType())) {
			String fileName = files.getOriginalFilename();// 原文件名
			String fileEnd = uploadService.getSuffixByFileName(fileName);
			String objName = DocumentService.genFileName();
			if (fileEnd != null)
				objName = objName + "." + fileEnd;
			if (fileEnd != null) {
				if (fileEnd.equals("jpg") || fileEnd.equals("jpeg") || fileEnd.equals("png") || fileEnd.equals("bmp")
						|| fileEnd.equals("gif") || fileEnd.equals("raw")|| fileEnd.equals("tif")|| fileEnd.equals("tiff")) {
					uploadService.compressImage2upload(files, objName, fileEnd);
				}
			}
			String path = UploadFdfsController.class.getResource(
					"/fdfs_client.conf").getPath();
			String[] filePath = null;
			try {
				String md5 = Md5Util
						.getMd5ByInputStream(files.getInputStream());
				doc.setContent(FileReaderUtil.getText(files.getInputStream(),
						doc.getSuffix()));
				doc.setMd5(md5);
				doc.setContentType(files.getContentType());
				Long fileLength = files.getSize();
				filePath = uploadService.uploadFileToFDFS(path,
						files.getBytes(), fileName, fileEnd,
						fileLength.intValue());
			} catch (IOException e) {
				e.printStackTrace();
			}
			if (filePath == null) {
				return null;
			}
			StringBuffer sb = new StringBuffer();
			for (String p : filePath) {
				sb.append("/").append(p);
			}

			// TODO 初始化doc的一些值
			doc.setStorageTypeId(Document.STORAGE_FDFS);
			doc.setFetchCode(sb.toString());
			doc.setSuffix(fileEnd);
			doc.setDocName(fileName);
			doc.setStorageName(objName);
			doc.setFileSize(files.getSize());
			doc.setContentType(files.getContentType());
			return doc;
		}
		return null;
	}

	public static void main(String[] args) throws Exception {
		String sign = "eec7d690cc66ca94c67cf77f69fdb37701326f1b3a0124879cc4158c8e75309d9c87feffe81085121eaff39021aa1c24637baee4e6d07a45cc470585986d01281c8a8e11648f1c83536f5c25400027d41a931e224e4774a18cb9d07649465bac984fc842f9928804ee2144456e77b48e613c6e8fa3e9e0aa2c7afd7ea17ee364ffca960baaaecee84b0b0fe4d243bad0797c2369276711124a829059c311d0eba40fee86c5cc3ebc34b776f38a1738fc";
		String jsonString = AESUtil.Decrypt(sign, AES_KEY_ZUST);
		System.out.println(jsonString);
		JSONObject jObj = JSON.parseObject(jsonString);
		String displayName = jObj.getString("displayName");
		System.out.println(displayName);
	}
}
