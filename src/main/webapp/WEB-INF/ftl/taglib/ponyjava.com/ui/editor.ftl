<#--
<textarea name="textarea"></textarea>
-->
<#macro editor
	fckName="" name="" value="" height="200" noValue="false"
	fullPage="false" toolbarSet="mydefault"
	label="" noHeight="false" required="false" colspan="" width="850" help="" helpPosition="2" colon="：" hasColon="true"
	onclick="" ondblclick="" onmousedown="" onmouseup="" onmouseover="" onmousemove="" onmouseout="" onfocus="" onblur="" onkeypress="" onkeydown="" onkeyup="" onselect="" onchange=""
	>
<#if fckName=="">
<#local fckName=name?replace('.','_')>
</#if>
<#include "control.ftl"/><#rt/>
<script type="text/javascript">
var _fck_${fckName}=new FCKeditor('${name}');
_fck_${fckName}.BasePath='${base}/fckeditor/';
<#--
_fck_${fckName}.Config["CustomConfigurationsPath"]="${base}/fckeditor/myconfig.js?d="+(new Date()*1);
-->
_fck_${fckName}.Config["CustomConfigurationsPath"]="${base}/fckeditor/myconfig.js";
_fck_${fckName}.Config["ImageBrowser"] = false ;
_fck_${fckName}.Config["FlashBrowser"] = false ;
_fck_${fckName}.Config["LinkBrowser"] = false ;
_fck_${fckName}.Config["MediaBrowser"] = false ;
_fck_${fckName}.ToolbarSet='${toolbarSet}';
_fck_${fckName}.Height=${height};
_fck_${fckName}.Width=${width};
<#if fullPage=="true">
_fck_${fckName}.Config["FullPage"]=true;
</#if>
<#if uploadRuleId??>
_fck_${fckName}.Config["uploadRuleId"]=${uploadRuleId};
</#if>
_fck_${fckName}.Value="<#if value!="">${value?js_string}<#elseif noValue!="true">${(name?eval)!?js_string}</#if>";
_fck_${fckName}.Create();
</script>
<#nested/>
<#include "control-close.ftl"/><#rt/>
</#macro>