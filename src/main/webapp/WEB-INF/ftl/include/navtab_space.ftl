<#assign curr='xxx',space_id=0/>
<#if params?? && params.current??>
	<#assign curr = params.current/>
</#if>
<#if params?? && params.spaceId??>
	<#assign space_id = params.spaceId/>
</#if>
<!--navtab check-->
<div class="col-md-12">
	<div class="col-md-8">
	<ul class="list-inline marg-10-t parox-wsp-channel">
    	<li>
    	  <#if curr='index'>
            <span class="icon-update colorBlue font30 padd-20-l padd-20-r"></span>
            <span class="text-primary">最近更新</span>
            <div class="paroxicon-wps-triangle"></div>
          <#else>
            <a href="${base}/workspace/${space_id}">
                <span class="icon-update font30 padd-20-l padd-20-r"></span>
                <span>最近更新</span>
            </a>
          </#if>
        </li>
        <li>
          <#if curr='task'>
            <span class="icon-mana-task colorBlue font30 padd-20-l padd-20-r"></span>
            <span class="text-primary">任务</span>
            <div class="paroxicon-wps-triangle"></div>
          <#else>
            <a href="${base}/task/index.htm?spaceId=${space_id}">
                <span class="icon-mana-task font30 padd-20-l padd-20-r"></span>
                <span>任务</span>
            </a>
          </#if>
        </li>
        <li>
          <#if curr='doc'>
            <span class="icon-paper font30 colorBlue padd-20-l padd-20-r"></span>
            <span class="text-primary">文件管理</span>
            <div class="paroxicon-wps-triangle"></div>
          <#else>
            <a href="${base}/document/index.htm?spaceId=${space_id}">
                <span class="icon-paper font30 padd-20-l padd-20-r"></span>
                <span>文件管理</span>
            </a>
          </#if>
        </li>
        <li>
          <#if curr='colla'>
            <span class="icon-user font30 colorBlue padd-20-l padd-20-r"></span>
            <span class="text-primary">协作者</span>
            <div class="paroxicon-wps-triangle"></div>
          <#else>
            <a href="${base}/workspace/collaborators.htm?spaceId=${space_id}">
                <span class="icon-user font30 padd-20-l padd-20-r"></span>
                <span>协作者</span>
            </a>
          </#if>
        </li>
        <#if spaceUser?? && spaceUser.roleType==p.SpaceRole.MANAGE>
        <li>
          <#if curr='setting'>
            <span class="icon-set font30 colorBlue padd-20-l padd-20-r"></span>
            <span class="text-primary">设置</span>
            <div class="paroxicon-wps-triangle"></div>
          <#else>
            <a href="${base}/workspace/setting.htm?spaceId=${space_id}">
                <span class="icon-set font30 padd-20-l padd-20-r"></span>
        		<span>设置</span>
            </a>
          </#if>
        </li>
        </#if>
    </ul>
    </div>
    <div class="col-md-4">
    	<h2 class="text-right text-primary text-overflow font28 marg-10-t h-weight">${(space.name)!}</h2>
    </div>
</div>
<!--navtab check-->