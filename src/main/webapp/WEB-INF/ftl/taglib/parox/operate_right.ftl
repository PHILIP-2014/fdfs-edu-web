<#macro operateRight operate checkRight="true">
<#if operate?starts_with('/')>
	<#local opr=operate>
<#else>
	<#local opr=base + operate>
</#if>
<#if "false"==checkRight || (rights?? && rights?seq_contains(opr))>
<#nested/>
</#if>
</#macro>