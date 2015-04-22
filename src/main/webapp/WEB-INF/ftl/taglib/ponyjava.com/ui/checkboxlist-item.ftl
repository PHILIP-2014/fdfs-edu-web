<input type="checkbox"<#rt/>
 id="${id+'_'+name+'_'+index}" value="${rkey}"<#rt/>
<#if valueList?seq_contains(rkey)> checked="checked"</#if><#rt/>
<#include "common-attributes.ftl"/><#rt/>
<#include "scripting-events.ftl"/><#rt/>
/><label for="${id+'_'+name+'_'+index}">${rvalue}</label><#if hasNext> </#if>