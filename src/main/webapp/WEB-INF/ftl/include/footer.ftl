	<!--footer-->
	<footer class="panel-footer footer bd-un-style">
		<div class="col-lg-12">
			<p class="text-muted pull-left">
				<img src="${base}/images/parox-logo-footer.gif" alt="parox" /></p>
			<p class="text-muted pull-right">
				<a href="#" target="_blank" class="lnk-gray">关于Parox</a>
				<a href="#" target="_blank" class="lnk-gray">· 条款</a>
				<a href="#" target="_blank" class="lnk-gray">· 隐私政策</a>
			</p>
		</div>
	</footer>
	<!--/footer-->
	    
    <!--*选择空间*-->
	    <aside class="float-passage" id="panel-passage">
	    <#assign _orgid=0,_spaceid=0>
	    <#if orgId??><#assign _orgid=orgId></#if>
	    <#if org??><#assign _orgid=org.orgId></#if>
	    <#if spaceId??><#assign _spaceid=spaceId></#if>
	    <#if space??><#assign _spaceid=space.spaceId></#if>
	    	<@org_space_list userId=_user.userId>
	    	<ul class="list-unstyled list-passage">
	    		<#list tag_list as o>
	        	<li>
	            	<h2 class="font13 text-weight-b colorBlack marg-un p-h dropdown">
	                    <a href="${base}/organization/${o.orgId}" class="<#if _orgid=o.orgId>active</#if>">
	                    	<img src="${o.logo!(imgRoot+'/org-logo')}_48x48.jpg" alt="${o.orgName!}" class="img-rounded bd-radius-3 img-30X30">
	                    	${o.orgName!}
	                    </a>
	                    <!--下拉菜单-start-->
	                    <span class="icon-tool passageicon <#if _orgid=o.orgId><#else>p-h-r</#if>" data-toggle="dropdown"></span>
	                    <ul class="dropdown-menu  pull-right lp-set-menu" role="menu" aria-labelledby="设置菜单">
	                    <#if o.memberRight?? && o.memberRight=p.MemberRight.MANAGE>
							<li><a role="menuitem" tabindex="-1" href="${base}/organization/edit.htm?id=${o.orgId}">组织设置</a></li>
							<li><a role="menuitem" tabindex="-1" href="${base}/organization/members.htm?orgId=${o.orgId}">用户管理</a></li>
						</#if>
							<li><a role="menuitem" tabindex="-1" href="javascript:;" data-action-tag="leave-org" orgId="${o.orgId}" orgName="${o.orgName!}">离开组织</a></li>
						<#--
						<#if o.memberRight?? && o.memberRight=p.MemberRight.MANAGE>
							<li><a role="menuitem" tabindex="-1" href="javascript:;" data-action-tag="del-org" orgId="${o.orgId}" orgName="${o.orgName!}">删除组织</a></li>
						</#if>
						-->
						</ul>
						<!--下拉菜单-end-->
	                </h2>
	                <ul class="list-unstyled list-passage-next">
	                	<#list o.spaces as s>
	                    <li class="p-h dropdown">
	                    	<#--permission:1-开放的,对所有组织成员可见并允许加入;0-私有的,只允许邀请-->
	                    	<a href="${s.url}" class="<#if _spaceid=s.spaceId>active</#if>">
	                    		<span <#if s.permission?? && s.permission=p.SpacePrivacy.CLOSED>class="icon-lock"<#else>style="padding-left:18px;"</#if>></span>
	                        	${s.name!'未命名'}
	                        </a>
	                        <!--下拉菜单-start-->
	                        <span class="icon-tool passageicon<#if _spaceid=s.spaceId><#else> p-h-r</#if>" data-toggle="dropdown"></span>
	                        <ul class="dropdown-menu pull-right lp-set-menu" role="menu" aria-labelledby="设置菜单">
							<#if s.roleType?? && s.roleType=p.SpaceRole.MANAGE>
								<li><a role="menuitem" tabindex="-1" href="${base}/workspace/setting.htm?spaceId=${s.spaceId}">空间设置</a></li>
							</#if>
								<li><a role="menuitem" tabindex="-1" href="javascript:;" data-action-tag="leave-space" spaceId="${s.spaceId}" spaceName="${s.name!}">离开空间</a></li>
							<#if s.roleType?? && s.roleType=p.SpaceRole.MANAGE>
								<li><a role="menuitem" tabindex="-1" href="javascript:;" data-action-tag="del-space" spaceId="${s.spaceId}" spaceName="${s.name!}">删除空间</a></li>
							</#if>
							</ul>
							<!--下拉菜单-end-->
	                    </li>
	                    </#list>
	                    <#if o.memberRight?? && o.memberRight=2>
	                    <!--*添加工作空间*-->
	                    <!--
	                    <li>
	                    	<a href="javascript:void(0);" data-toggle="modal" data-target="#paroxModal-space" data-action-tag="add-space" orgId="">
	                            <span class="icon-plus"></span>
	                            	添加空间
	                        </a>
	                    </li>
	                    -->
	                    <!--*/添加工作空间*-->
	                    </#if>
	                </ul>

	            </li>
	            </#list>
	            <li>
                	<a href="javascript:;" data-action-tag="browse-space" class="padd-30-l">
                        <span class="icon-search font12 colorGreen marg-5-l"></span>
                        	浏览空间
                    </a>
                </li>
	            <#if tag_list?size gt 0>
	            <li>
                	<a href="javascript:;" data-toggle="modal" data-target="#paroxModal-space" data-action-tag="add-space" class="padd-30-l" orgId="">
                        <span class="icon-plus colorGreen font12 marg-5-l"></span>
                        	添加空间
                    </a>
                </li>
                <#else>
                <li>
                	<span class="icon-plus font12 marg-5-l"></span>
                	<a href="javascript:;" data-toggle="modal" data-target="#paroxModal-org" data-action-tag="add-org" class="padd-30-l">
                        	创建组织
                    </a>
                </li>
                </#if>
	        </ul>
	        </@org_space_list>
	    </aside>
	    <!--*/选择空间*-->
	    <script>
	    (function(){
	    	//创建工作空间 navbar-passage浮出&收起初始化
			//Parox.Panel.Toggle('#btn-navbar-passage','#panel-passage',50,300,0);
			var navbarToggle = new Parox.Panel.Toggle({oBtn:'#btn-navbar-passage',oPanel:'#panel-passage',barW:50,intrl:300,dir:0});
			//创建组织
			$('[data-action-tag="add-org"]').each(function() {
			  $(this).on('click',Parox.Org.create);
			});
			//添加工作空间
			$('[data-action-tag="add-space"]').each(function() {
			  $(this).on('click',Parox.Space.create);
			});
			//离开工作空间
			$('[data-action-tag="leave-space"]').click(function(){
			  	Parox.Space.leave({spaceId:$(this).attr('spaceId'),
			  		spaceName:$(this).attr('spaceName'),
			  		callback:function(data){
			  			Parox.Dialog.Msg({info:data.message});
			  			homeDelay();
			  		}
			  	});
			});
			$('[data-action-tag="browse-space"]').click(Parox.Space.browse);
			//删除空间
			$('[data-action-tag="del-space"]').click(function(){
	   			Parox.Space.del({spaceId:$(this).attr('spaceId'),
			  		spaceName:$(this).attr('spaceName'),
			  		callback:function(data){
			  			Parox.Dialog.Msg({info:data.message});
			  			homeDelay();
			  		}
			  	});
			});
			//离开组织
			$('[data-action-tag="leave-org"]').click(function(){
			  	Parox.Org.leave({orgId:$(this).attr('orgId'),
			  		orgName:$(this).attr('orgName'),
			  		callback:function(data){
			  			Parox.Dialog.Msg({info:data.message});
			  			homeDelay();
			  		}
			  	});
			});
			//删除组织
			/*$('[data-action-tag="del-org"]').click(function(){
	   			Parox.Org.del({orgId:$(this).attr('orgId'),
			  		orgName:$(this).attr('orgName'),
			  		callback:function(data){
			  			Parox.Dialog.Msg({info:data.message});
			  			homeDelay();
			  		}
			  	});
			});*/
	    })();   
		 </script>