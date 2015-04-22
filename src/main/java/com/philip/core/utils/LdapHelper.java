package com.philip.core.utils;

import com.daoman.core.util.AESUtil;
import com.daoman.core.util.ConfigProperties;
import com.sun.org.apache.xerces.internal.impl.dv.util.Base64;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Hashtable;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.naming.Context;
import javax.naming.NamingException;
import javax.naming.directory.DirContext;
import javax.naming.directory.InitialDirContext;

import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.core.support.LdapContextSource;

public class LdapHelper {
	private static DirContext ctx;
	
	private static final String AES_KEY = "edu00001parox606";
	
	public static LdapTemplate buildLdapTemplate() throws Exception {
		String encryptPass = ConfigProperties.get("ldap.password","013b6cd3c25460dd5e30170c63863ff2");
		String passwd = AESUtil.Decrypt(encryptPass, AES_KEY);
		
		LdapContextSource contextSource = new LdapContextSource();
	    contextSource.setUrl(ConfigProperties.get("ldap.url","ldap://192.168.1.109:389"));
	    contextSource.setBase(ConfigProperties.get("ldap.base","dc=zust,dc=edu,dc=cn"));
	    contextSource.setUserDn(ConfigProperties.get("ldap.userDn","cn=admin,dc=zust,dc=edu,dc=cn"));
	    contextSource.setPassword(passwd);
	    contextSource.afterPropertiesSet();
	  
	    LdapTemplate ldapTemplate = new LdapTemplate();
	    ldapTemplate.setContextSource(contextSource);
	    return ldapTemplate;
	}  

    @SuppressWarnings(value = "unchecked")
    public static DirContext getCtx() {
//        if (ctx != null ) {
//            return ctx;
//        }
    	
        String account = "admin,dc=zust,dc=edu,dc=cn"; //binddn 
        String password = "zustadmin";    //bindpwd
        String root = "dc=scut,dc=edu,dc=cn"; // root
        Hashtable env = new Hashtable();
        env.put(Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.ldap.LdapCtxFactory");
        env.put(Context.PROVIDER_URL, "ldap://192.168.1.101:389/" + root);
        env.put(Context.SECURITY_AUTHENTICATION, "simple");
        env.put(Context.SECURITY_PRINCIPAL, "cn="+account );
        env.put(Context.SECURITY_CREDENTIALS, password);
        try {
            // 链接ldap
            ctx = new InitialDirContext(env);
            System.out.println("认证成功");
        } catch (javax.naming.AuthenticationException e) {
            System.out.println("认证失败");
        } catch (Exception e) {
            System.out.println("认证出错：");
            e.printStackTrace();
        }
        return ctx;
    }
    
    public static void closeCtx(){
        try {
            ctx.close();
        } catch (NamingException ex) {
            Logger.getLogger(LdapHelper.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
    @SuppressWarnings(value = "unchecked")
    public static boolean verifySHA(String ldappw, String inputpw)
            throws NoSuchAlgorithmException {

        // MessageDigest 提供了消息摘要算法，如 MD5 或 SHA，的功能，这里LDAP使用的是SHA-1
        MessageDigest md = MessageDigest.getInstance("SHA-1");

        // 取出加密字符
        if (ldappw.startsWith("{SSHA}")) {
            ldappw = ldappw.substring(6);
        } else if (ldappw.startsWith("{SHA}")) {
            ldappw = ldappw.substring(5);
        }

        // 解码BASE64
        byte[] ldappwbyte = Base64.decode(ldappw);
        byte[] shacode;
        byte[] salt;

        // 前20位是SHA-1加密段，20位后是最初加密时的随机明文
        if (ldappwbyte.length <= 20) {
            shacode = ldappwbyte;
            salt = new byte[0];
        } else {
            shacode = new byte[20];
            salt = new byte[ldappwbyte.length - 20];
            System.arraycopy(ldappwbyte, 0, shacode, 0, 20);
            System.arraycopy(ldappwbyte, 20, salt, 0, salt.length);
        }

        // 把用户输入的密码添加到摘要计算信息
        md.update(inputpw.getBytes());
        // 把随机明文添加到摘要计算信息
        md.update(salt);

        // 按SSHA把当前用户密码进行计算
        byte[] inputpwbyte = md.digest();

        // 返回校验结果
        return MessageDigest.isEqual(shacode, inputpwbyte);
    }

    public static void main(String[] args) {
        getCtx();
    }
}
