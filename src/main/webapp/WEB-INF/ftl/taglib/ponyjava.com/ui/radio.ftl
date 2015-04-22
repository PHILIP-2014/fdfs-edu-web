<#--
<input type="radio"/>
-->
<#macro radio
	list headerKey="" headerValue="" listKey="" listValue="" value=""
	label="" noHeight="false" required="false" colspan="" width="100" help="" helpPosition="2" colon="：" hasColon="true"
	id="" name="" class="" style="" size="" title="" disabled="" tabindex="" accesskey=""
	onclick="" ondblclick="" onmousedown="" onmouseup="" onmouseover="" onmousemove="" onmouseout="" onfocus="" onblur="" onkeypress="" onkeydown="" onkeyup="" onselect="" onchange=""
	>
<#include "control.ftl"/><#rt/>
<#if list?is_sequence>
	<#if listKey!="" && listValue!="">
		<#list list as item>
			<#local rkey=item[listKey]>
			<#local rvalue=item[listValue]>
			<#local index=item_index>
			<#local hasNext=item_has_next>
			<#include "radio-item.ftl"><#t/>
			<#if !item_has_next><#nested/></#if><#--用于往radio后追加内容 Added PZP@2011-12 -->
		</#list>
	<#else>
		<#list list as item>
			<#local rkey=item>
			<#local rvalue=item>
			<#local index=item_index>
			<#local hasNext=item_has_next>
			<#include "radio-item.ftl"><#t/>
			<#if !item_has_next><#nested/></#if><#--用于往radio后追加内容 Added PZP@2011-12 -->
		</#list>
	</#if>
<#else>
	<#list list?keys as key>
		<#local rkey=key/>
		<#local rvalue=list[key]/>
		<#local index=key_index>
		<#local hasNext=key_has_next>
		<#include "radio-item.ftl"><#t/>
		<#if !key_has_next><#nested/></#if><#--用于往radio后追加内容 Added PZP@2011-12 -->
	</#list>
</#if>
<#include "control-close.ftl"/>

</#macro>