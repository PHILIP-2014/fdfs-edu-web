<#--
<form></form>
-->
<#macro form
	action="" namespace="" method="post" target="" enctype="" acceptCharset="" suffix=".do" 
	theme="jeesys" width="100%" tableClass="pn-ftable" labelWidth="20" required="false" colspan="1"
	validate="false" query="false"
	id="" name="" class="" style="" size="" title="" disabled="" tabindex="" accesskey=""
	onsubmit=""
	>
<form<#rt/>
 method="${method}"<#rt/>
<#if namespace!="">
 action="${base+namespace+'/'+action+suffix}"<#rt/>
<#else>
 action="${action+suffix}"<#rt/>
</#if>
<#if id!=""> id="${id}"</#if><#rt/>
<#if target!=""> target="${target}"</#if><#rt/>
<#if enctype!=""> enctype="${enctype}"</#if><#rt/>
<#if onsubmit!=""> onsubmit="${onsubmit}"</#if><#rt/>
<#if acceptCharset!=""> accept-charset="${acceptCharset}"</#if><#rt/>
<#include "common-attributes.ftl"/><#rt/>
>
<#if query=="true">
<@pj.hidden name="pageNo" /><#rt/>
<#list Parameters?keys as pkey>
  <#if pkey?starts_with('query')>
	<@pj.hidden name="${pkey}" /><#t/>
  </#if>
</#list>
</#if>
<#if theme!="simple">
<#assign labelWidth=labelWidth/>
<table width="${width}" class="${tableClass}" cellpadding="2" cellspacing="1" border="0">
<tr>
</#if>
<#nested/><#rt/>
<#if theme=="jeesys">
</tr></table>
</#if>
</form>
</#macro>
