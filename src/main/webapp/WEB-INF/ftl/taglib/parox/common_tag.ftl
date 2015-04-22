<#--
包含页面
	可以包含当前目录、方案、甚至其他站点的页面。
eg：
[@p.Include page="mypage.html"/]
-->
<#macro Include page params={}>
<#include "/include/${page}"/>
</#macro>

<#macro PublicResource css=[] js=[]>
	<link rel="shortcut icon" href="${imgRoot}/favicon.png">
    <link href="${cssRoot}/bootstrap.css" rel="stylesheet">
    <link href="${cssRoot}/parox-base.css" rel="stylesheet">
    <link href="${cssRoot}/parox-icon.css" rel="stylesheet">
    <link href="${cssRoot}/plugin.input.check.polaris/polaris.css" rel="stylesheet">
  <#list css as s>
	<#if s?starts_with('/')>	
		<link href="${cssRoot+s}" rel="stylesheet">
	<#else>
		<link href="${s}" rel="stylesheet">
	</#if>    
  </#list>
    <!--[if lt IE 9]>
    	<script src="${jsRoot}/core/ie8-responsive-file-warning.js"></script>
    <![endif]-->    
    <!--[if lt IE 9]>
      <script src="http://cdn.bootcss.com/html5shiv/3.7.0/html5shiv.min.js"></script>
      <script src="http://cdn.bootcss.com/respond.js/1.3.0/respond.min.js"></script>
      <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->    

    <script type="text/javascript" src="${jsRoot}/jquery/jquery-1.10.2.js" charset="utf-8"></script>
  	<script type="text/javascript" src="${jsRoot}/bootstrap/bootstrap.js" charset="utf-8"></script>
  	<script type="text/javascript" src="${jsRoot}/core/base.js"></script>
  	<script type="text/javascript" src="${jsRoot}/system/global.js"></script>
  	<script type="text/javascript" src="${jsRoot}/comet/comet4j.js"></script>
  	<script type="text/javascript" src="${jsRoot}/system/console.js"></script>
  	<script >
  		_CTX_PATH="${base}";
  	</script>
  <#list js as s>
	<#if s?starts_with('/')>	
		<script type="text/javascript" src="${jsRoot+s}"></script>
	<#else>
		<script type="text/javascript" src="${s}"></script>
	</#if>    
  </#list>
  	<script type="text/javascript" src="${jsRoot}/core/ajax.js"></script>
  	<script type="text/javascript" src="${jsRoot}/core/parox-ajax.js"></script>
    <script type="text/javascript" src="${jsRoot}/core/parox-core-0.1.js"></script>
	<script type="text/javascript" src="${jsRoot}/system/message.js"></script>
	<script type="text/javascript" src="${jsRoot}/system/parox-bm.js"></script>	
</#macro>

<#--
系统分页样式调用标签
style：系统样式编号。
-->
<#macro SysPage style cssClass="" cssStyle="" ajaxFunc="ajaxPage">
<#if pagination??>
	<#local lp=pagination/>
<#elseif n_pagination??>
	<#local lp=n_pagination/>
<#else>
	<#return/>
</#if>
<#include "style_pager/style${style}.ftl"/>
</#macro>

<#--
标签显示
style：系统样式编号。
-->
<#macro ShowTags tags="" cssClass="" href="" pname="tag" >
<#list tags?split(",") as x>
 <a <#if href!=''>href="${href!}?${pname}=${x?url}"</#if> class="${cssClass!}${x_index+1}">${x}</a>
</#list>
</#macro>

<#macro EditTags tags="" cssClass=""  >
<div class="parox-wsp-tags padd-un-t">
	<ul class="list-inline  marg-un-b" data-edit-tags="tagsarea">
		<#list tags?split(",") as x>
		<li class="p-o padd-un"><a href="javascript:;" class="marg-un">${x}</a><span class="delete p-o-r text-muted cur-p" title="删除">&times;</span></li>
		</#list>
		<div class="add cur-p marg-un <#if tags?split(",")?size gt 0 > p-h-r </#if>" data-edittags-btn="tagsaddbtn">
		        <span class="icon-plus font12"></span>添加
		</div>
	</ul>
</div>
</#macro>

<#macro ShowTags2 tags="" cssClass="" >
<div class="parox-wsp-tags padd-un-t">
	<ul class="list-inline  marg-un-b">
		<#list tags?split(",") as x>
		<li class="p-o padd-un"><a href="javascript:;" class="marg-un">${x}</a><span class="delete p-o-r">&times;</span></li>
		</#list>
	</ul>
</div>
</#macro>