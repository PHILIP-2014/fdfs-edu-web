<input type="radio"<#rt/>
 id="${id+'_'+name+'_'+index}" value="${rkey}"<#rt/>
<#if (value!="" && value==rkey) || (value=="" && name!="" && (name?eval)!?string == rkey)> checked="checked"</#if><#rt/>
<#include "common-attributes.ftl"/><#rt/>
<#include "scripting-events.ftl"/><#rt/>
/><label for="${id+'_'+name+'_'+index}">${rvalue}</label><#if hasNext> </#if>