<#if help!='' && helpPosition=='2'>
 <span class="pn-fhelp">${help!}</span><#rt/>
<#elseif help!='' && helpPosition=='3'>
<div class="pn-fhelp">${help!}</div><#rt/>
</#if>
<#if label!=''></td><#if colspan==''></tr><tr></#if></#if>