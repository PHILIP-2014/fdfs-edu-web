<#--
构建一个没有内容的label，或者没有label的行。
用于自定义内容和无label的行。
<td></td>
-->
<#macro td
	label="" noHeight="false" required="false" colspan="" width="100" help="" helpPosition="2" colon="：" hasColon="true"
	>
<#if label!="">
<td width="${labelWidth}%" class="pn-flabel<#if noHeight=='false'> pn-flabel-h</#if>"><#if required!="false"><span class="pn-frequired">*</span></#if>${label}<#if hasColon="true">${colon}</#if></td><#rt/>
<td<#if colspan!=""> colspan="${colspan?number*2-1}"</#if> width="${width?number-labelWidth?number}%" class="pn-fcontent"><#rt/>
<#else>
<td colspan="<#if colspan=="">2<#else>${colspan?number*2}</#if>" class="pn-fbutton"><#rt/>
</#if>
<#if help!="" && helpPosition=='1'><div class="pn-fhelp">${help!}</div></#if>
<#nested/>
<#if help!='' && helpPosition=='2'>
 <span class="pn-fhelp">${help!}</span><#rt/>
<#elseif help!='' && helpPosition=='3'>
<div class="pn-fhelp">${help!}</div><#rt/>
</#if>
</td><#rt/>
</#macro>
