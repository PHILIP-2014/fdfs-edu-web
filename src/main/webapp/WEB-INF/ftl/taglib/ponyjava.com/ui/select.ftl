<#--
<select><option></option></select>
-->
<#macro select
	list multiple="" headerKey="" headerValue="" listKey="" listValue="" headerButtom="false"
	label="" noHeight="false" noValue="false" required="false" colspan="" width="100" help="" helpPosition="2" colon="：" hasColon="true"
	id="" name="" value="" class="" style="" size="" title="" disabled="" tabindex="" accesskey=""
	onclick="" ondblclick="" onmousedown="" onmouseup="" onmouseover="" onmousemove="" onmouseout="" onfocus="" onblur="" onkeypress="" onkeydown="" onkeyup="" onselect="" onchange=""
	>
<#include "control.ftl"/><#rt/>
<select<#rt/>
<#if id!=""> id="${id}"</#if><#rt/>
<#if multiple!=""> multiple="${multiple}"</#if><#rt/>
<#include "common-attributes.ftl"/><#rt/>
<#include "scripting-events.ftl"/><#rt/>
><#rt/>
<#if headerButtom=="false">
<#if headerKey!="" || headerValue!="">
	<option value="${headerKey}"<#if noValue!="false" && value!="" && headerKey == (value?eval)!?string> selected="selected"</#if>>${headerValue}</option><#t/>
</#if>
</#if>
<#if list?is_sequence>
	<#if listKey!="" && listValue!="">
		<#list list as item>
			<option value="${item[listKey]}"<#if noValue=="false" && name!="" && value!="" && item[listKey]?string == (value?eval)!?string> selected="selected"</#if>>${item[listValue]!}</option><#t/>
		</#list>
	<#else>
		<#list list as item>
			<option value="${item}"<#if noValue=="false" && item==(value?eval)!?string> selected="selected"</#if>>${item}</option><#t/>
		</#list>
	</#if>
<#else>
	<#if multiple='multiple'><#--支持多选 PZP@2011-12 -->
		<#assign names = (value?eval)!''/>
		<#if names?is_sequence>
			<#assign contained={}/>
			<#list list?keys as key>
				<#list names as name>
					<#if contained[key]??>
					<#else>
					<#assign contained=contained+{key: true}/>
					<option value="${key}"<#if noValue=="false" && (key==name?string)> selected="selected"</#if>>${list[key]}</option><#t/>
					</#if>
				</#list>
			</#list>
		<#else>
			<#list list?keys as key>
				<option value="${key}"<#if noValue=="false" && key==names> selected="selected"</#if>>${list[key]}</option><#t/>
			</#list>
		</#if>
	<#else>	<#--支持多选 PZP@2011-12 -->
	<#list list?keys as key>
		<option value="${key}"<#if noValue=="false" && key==(value?eval)!?string> selected="selected"</#if>>${list[key]}</option><#t/>
	</#list>
	</#if>
</#if>
<#if headerButtom!="false">
<#if headerKey!="" || headerValue!="">
	<option value="${headerKey}"<#if noValue!="false" && headerKey == (value?eval)!?string> selected="selected"</#if>>${headerValue}</option><#t/>
</#if>
</#if>
</select>
<#nested/><#rt/><#--nested用于往select后追加内容 Added PZP@2011-17 -->
<#include "control-close.ftl"/><#rt/>
</#macro>
