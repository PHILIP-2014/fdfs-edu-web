<#--
<input type="checkbox"/>
-->
<#macro checkbox
	value="" labelFor="" readonly="" checked="" noValue="false"
	label="" noHeight="false" required="false" colspan="" help="" helpPosition="3"
	id="" name="" class="" style="" size="" title="" disabled="" tabindex="" accesskey=""
	onclick="" ondblclick="" onmousedown="" onmouseup="" onmouseover="" onmousemove="" onmouseout="" onfocus="" onblur="" onkeypress="" onkeydown="" onkeyup="" onselect="" onchange=""
	>
<input type="checkbox"<#rt/>
 value="${value}"<#rt/>
 id="${id+'-'+name}"<#rt/>
<#if noValue=="false" && name!="" && (name?eval)!?string == value> checked="checked"</#if><#rt/>
<#if readonly!=""> readonly="${readonly}"</#if><#rt/>
<#if checked!=""> checked="${readonly}"</#if><#rt/>
<#include "common-attributes.ftl"/><#rt/>
<#include "scripting-events.ftl"/><#rt/>
/><#if labelFor!=""><label for="${id+'-'+name}">${labelFor}</label></#if>
</#macro>
