<#--
<input type="hidden"/>
-->
<#macro hidden
	id="" name="" value=""
	>
<input type="hidden"<#rt/>
<#if id!=""> id="${id}"</#if><#rt/>
<#if name!=""> name="${name}"</#if><#rt/>
<#if value!=""> value="${value}"<#elseif name!=""> value="<#if (name?eval)?? && (name?eval)?is_boolean>${(name?eval)?string('true','false')}<#else>${(name?eval)!}</#if>"</#if><#rt/>
/>
</#macro>
