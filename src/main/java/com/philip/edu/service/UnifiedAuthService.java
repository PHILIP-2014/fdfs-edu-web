package com.philip.edu.service;

import java.security.NoSuchAlgorithmException;
import java.util.List;

import javax.naming.Name;
import javax.naming.NamingEnumeration;
import javax.naming.NamingException;
import javax.naming.directory.Attribute;
import javax.naming.directory.Attributes;
import javax.naming.directory.DirContext;
import javax.naming.directory.SearchControls;
import javax.naming.directory.SearchResult;

import org.springframework.ldap.core.AttributesMapper;
import org.springframework.ldap.core.DirContextOperations;
import org.springframework.ldap.core.DistinguishedName;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.core.simple.AbstractParameterizedContextMapper;
import org.springframework.ldap.core.support.AbstractContextMapper;
import org.springframework.stereotype.Service;

import com.daoman.core.util.ConfigProperties;
import com.daoman.core.util.StrUtils;
import com.daoman.parox.common.exception.ServiceException;
import com.philip.core.utils.LdapHelper;
import com.philip.edu.pojo.LdapPerson;


@Service("unifiedAuthService")
public class UnifiedAuthService {

	private static LdapTemplate ldapTemplate;
	
	private static String filter = null;
	//private static String filterName = null;
	//private static String filterValue = null;
	private static String uidAttr = null;
	private static String cnAttr = null;
	private static String passAttr = null;
	private static String deptAttr = null;
	
	static{
		filter = ConfigProperties.get("ldap.filter","objectclass:top");
		//String[] filterInfo = filterStr.split(":");
		//filterName = filterInfo[0];
		//filterValue = filterInfo[1];
		
		String attrStr = ConfigProperties.get("ldap.attrs","uid,cn,userPassword,");
		String[] attrInfo = attrStr.split(",");
		uidAttr = attrInfo[0];
		cnAttr = attrInfo[1];
		passAttr = attrInfo[2];
		deptAttr = StrUtils.isEmpty(attrInfo[3]) ? null : attrInfo[3];
		
		try {
			ldapTemplate = LdapHelper.buildLdapTemplate();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public LdapPerson authenticate(String userName, String password) throws ServiceException{
		/*AndFilter filter = new AndFilter();
		filter.and(new EqualsFilter(filterName, filterValue)).and(
				new EqualsFilter(uidAttr, userName));*/
		// Actual filter will differ depending on LDAP Server and schema
		@SuppressWarnings("unchecked")
		List<String> results = ldapTemplate.search("", "(&"+filter+"("+uidAttr+"="+userName+"))",
				new DnContextMapper());
		if (results.size() != 1)
			return null;

		LdapPerson person=null;
		//DirContext ctx = null;
		try {
			//ctx = contextSource.getContext(results.get(0), password);
			person = queryUser(userName);
		} catch (Exception e) {
			return null;
		}/* finally {
			LdapUtils.closeContext(ctx);
		}*/
		
		boolean passed=false;
		try {
			passed = LdapHelper.verifySHA(person.getPassword(), password);
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		}
		if(!passed){
			throw new ServiceException("error.passwordInvalid");
		}
		return person;
	}
	
	public LdapPerson authenticate2(String usr, String pwd) {
        boolean success = false;
        DirContext ctx = null;
        try {
            ctx = LdapHelper.getCtx();
            SearchControls constraints = new SearchControls();
            constraints.setSearchScope(SearchControls.SUBTREE_SCOPE);
            // constraints.setSearchScope(SearchControls.ONELEVEL_SCOPE);
            NamingEnumeration en = ctx.search("", "(&"+filter+"("+uidAttr+"="+usr+"))", constraints); // 查询所有用户
            while (en != null && en.hasMoreElements()) {
                Object obj = en.nextElement();
                if (obj instanceof SearchResult) {
                    SearchResult si = (SearchResult) obj;
                    System.out.println("name:   " + si.getName());
                    Attributes attrs = si.getAttributes();
                    if (attrs == null) {
                        System.out.println("No attributes");
                    } else {
                        Attribute attr = attrs.get(passAttr);
                        Object o = attr.get();
                        byte[] s = (byte[]) o;
                        String pwd2 = new String(s);
                        success = LdapHelper.verifySHA(pwd2, pwd);
                        if(success){
                        	LdapPerson person = new LdapPerson();
                        	person.setUserName(attrs.get(uidAttr).get().toString());
                        	person.setRealName(attrs.get(cnAttr).get().toString());
                        	return person;
                        }else{
                        	return null;
                        }
                    }
                } else {
                    System.out.println(obj);
                }
                System.out.println();
            }
            ctx.close();
        } catch (NoSuchAlgorithmException ex) {
            try {
                if (ctx != null) {
                    ctx.close();
                }
            } catch (NamingException namingException) {
                namingException.printStackTrace();
            }
        } catch (NamingException ex) {
            try {
                if (ctx != null) {
                    ctx.close();
                }
            } catch (NamingException namingException) {
                namingException.printStackTrace();
            }
        }
        return null;
    }
	
	
	private DistinguishedName buildDn() {
        DistinguishedName dn = new DistinguishedName();
        dn.append("ou", "People");
        return dn;
	}
	
	protected Name getPeopleDn(String userName) {
		/*AndFilter andFilter = new AndFilter();
		//andFilter.and(new EqualsFilter("objectclass", "person"));
		andFilter.and(new EqualsFilter(filterName, filterValue));
		andFilter.and(new EqualsFilter(uidAttr, userName));*/
		List<Name> result = ldapTemplate.search("", /*andFilter.encode()*/ "(&"+filter+"("+uidAttr+"="+userName+"))",
				SearchControls.SUBTREE_SCOPE, new AbstractContextMapper() {
					@Override
					protected Name doMapFromContext(DirContextOperations adapter) {
						return adapter.getDn();
					}
			});
		if (null == result || result.size() != 1) {
			return null;
	        //throw new UserNotFoundException();
	    } else {
	        return result.get(0);
	    }
	}
	
	public LdapPerson queryUser(String userName) {
		return (LdapPerson) ldapTemplate.lookup(getPeopleDn(userName), new String[] {
			uidAttr, cnAttr, passAttr, deptAttr, "objectClass"}, new AccountAttributesMapper());

	}

	private final static class DnContextMapper extends AbstractParameterizedContextMapper<String> {
		@Override
		protected String doMapFromContext(DirContextOperations ctx) {
			return ctx.getNameInNamespace();
		}
	}
	
	private class AccountAttributesMapper implements AttributesMapper {
	    public Object mapFromAttributes(Attributes attrs) throws NamingException {
	        LdapPerson person = new LdapPerson();
	        person.setUserId((String)attrs.get(uidAttr).get());
	        person.setUserName((String)attrs.get(cnAttr).get());
	        person.setPassword(new String((byte[])attrs.get(passAttr).get()));
	        if(attrs.get(cnAttr)!=null){
	        	person.setRealName((String)attrs.get(cnAttr).get());
	        }
	        if(attrs.get(deptAttr)!=null){
	        	person.setDeptName((String)attrs.get(deptAttr).get());
	        }
	        return person;
	    }
	}
}
