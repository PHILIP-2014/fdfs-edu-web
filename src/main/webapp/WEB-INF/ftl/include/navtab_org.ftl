<#assign curr='xxx',org_id=0/>
<#if params?? && params.current??>
	<#assign curr = params.current/>
</#if>
<#if params?? && params.orgId??>
	<#assign org_id = params.orgId/>
</#if>
			<!--navtab check-->
        	<div class="col-md-12">
                <ul class="list-inline marg-10-t parox-wsp-channel">
                    	<li>
                        	<a href="${base}/organization/edit.htm?id=${org_id}">
                                <span class="icon-org font30 padd-20-l padd-20-r<#if curr='orginfo'></#if>"></span>
                                <span<#if curr='orginfo'> class="text-primary"</#if>>机构信息</span>
                                <#if curr='orginfo'>
	                            <div class="paroxicon-wps-triangle"></div>
	                            </#if>
                            </a>
                        </li>
                        <li>
                        	<a href="${base}/organization/members.htm?orgId=${org_id}">
	                            <span class="icon-vcard font30 padd-20-l padd-20-r<#if curr='members'></#if>"></span>
	                            <span<#if curr='members'> class="text-primary"</#if>>用户管理</span>
	                            <#if curr='members'>
	                            <div class="paroxicon-wps-triangle"></div>
	                            </#if>
                            </a>
                        </li>
                        <li>
                        	<a href="${base}/organization/report.htm?id=${org_id}">
                                <span class="icon-count font30 padd-20-l padd-20-r<#if curr='report'></#if>"></span>
                                <span<#if curr='report'> class="text-primary"</#if>>使用统计</span>
                                <#if curr='report'>
	                            <div class="paroxicon-wps-triangle"></div>
	                            </#if>
                            </a>
                        </li>
                        <li>
                        	<a href="${base}/organization/setting.htm?id=${org_id}">
                                <span class="icon-set font30 padd-20-l padd-20-r<#if curr='setting'></#if>"></span>
                                <span<#if curr='setting'> class="text-primary"</#if>>设置</span>
                                <#if curr='setting'>
	                            <div class="paroxicon-wps-triangle"></div>
	                            </#if>
                            </a>
                        </li>
                    </ul>
            </div>
        	<!--navtab check-->