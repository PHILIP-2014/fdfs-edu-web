<#--
<input type="text"/>
-->
<#macro text
	maxlength="" readonly="" value="" noValue="false"
	label="" noHeight="false" required="false" colspan="" width="100" help="" helpPosition="2" colon="：" hasColon="true"
	id="" name="" class="" style="" size="" title="" disabled="" tabindex="" accesskey=""
	vld="" equalTo="" maxlength="" minlength="" rname="" rvalue=""
	onclick="" ondblclick="" onmousedown="" onmouseup="" onmouseover="" onmousemove="" onmouseout="" onfocus="" onblur="" onkeypress="" onkeydown="" onkeyup="" onselect="" onchange=""
	>
<#include "control.ftl"/><#rt/>
<input type="text"<#rt/>
<#if id!=""> id="${id}"</#if><#rt/>
<#if maxlength!=""> maxlength="${maxlength}"</#if><#rt/>
<#if readonly!=""> readonly="${readonly}"</#if><#rt/>
<#if rname!=""> rname="${rname}"</#if><#rt/>
<#if rvalue!=""> rvalue="${rvalue}"</#if><#rt/>
<#if value!=""> value="${value}"<#elseif noValue=="false" && name!=""> value="${(name?eval)!}"</#if><#rt/>
<#include "common-attributes.ftl"/><#rt/>
<#include "scripting-events.ftl"/><#rt/>
/><#nested/><#rt/><#--nested用于往input后追加内容 Added PZP@2011-12 -->
<#include "control-close.ftl"/><#rt/>
</#macro>
