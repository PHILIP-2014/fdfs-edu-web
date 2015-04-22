<#--
label：有label代表需要创建td和tr。
colspan：有colspan代表不需要创建tr。
labelWidth：需要form传递。
-->
<#if label!="">
<td width="${labelWidth}%" class="pn-flabel<#if noHeight=='false'> pn-flabel-h</#if>"><#if required!="false"><span class="pn-frequired">*</span></#if>${label}<#if hasColon="true">${colon}</#if></td><#rt/>
<td<#if colspan!=""> colspan="${colspan?number*2-1}"</#if> width="${width?number-labelWidth?number}%" class="pn-fcontent"><#rt/>
</#if>
<#if help!="" && helpPosition=='1'><div class="pn-fhelp">${help!}</div></#if>