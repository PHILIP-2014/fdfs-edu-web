<#assign menu = 'xxx'/>
<#if params?? && params.menu??>
	<#assign menu = params.menu/>
</#if>
		<!--*header*-->
        <header class="clearfix">
            <nav class="navbar navbar-default navbar-fixed-top navbar-bg" role="navigation">
            
              	<div class="navbar-left hidden-xs">
                	<div class="navbar-passage">
                		<span class="btn-navbar-passage icon-menu font18 text-white" id="btn-navbar-passage"></span>
                    </div>
                	<label style="display:none">
                    	<input type="text" class="float-passage-control"/>
                    </label>
                </div>
                  
            	<!-- Logo 和下拉图框 -->
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle bd-color-warning" data-toggle="collapse" data-target="#parox-navbar-collapse">
                      <span class="sr-only">Parox</span>
                      <span class="icon-bar bgWhite"></span>
                      <span class="icon-bar bgWhite"></span>
                      <span class="icon-bar bgWhite"></span>
                    </button>
                    <h1 class="marg-un-t marg-un-b"><a class="navbar-brand marg-20-l  marg-20-r padd-15-t padd-10-b" href="${base}/member/dashboard.htm"><img src="${imgRoot}/parox-logo.gif" alt="parox"></a></h1>
                </div>
                            
                <!--导航-->
                <div class="collapse navbar-collapse">
                    <!--*left nav*-->
                    <ul class="nav navbar-nav" id="parox-nav-channel">
                      <li<#if menu='home'> class="active"</#if>>
                        <a href="${base}/member/dashboard.htm">
                            <span class="icon-home font18 text-white"></span>
                        </a>
                      </li>
                    
                      <li<#if menu='task'> class="active"</#if>>
                        <a href="${base}/task/index.htm">
                            <span class="icon-task font18 text-white"></span>
                            <span class="nav-badge hidden">0</span>
                        </a>
                      </li>
                      
                      <li<#if menu='colla'> class="active"</#if>>
                        <a href="${base}/member/contacts.htm">
                            <span class="icon-user font18 text-white"></span>
                        </a>
                      </li>
                      
                      <li class="dropdown">
                        <a href="javascript:;" class="dropdown-toggle" data-action-tag="add-space">
                            <span class="icon-plus font18 text-white"></span>
                        </a>
                        <#--
                        <ul class="dropdown-menu"> 
                          <li><a href="javascript:;" data-toggle="modal" data-target="#paroxModal-org" data-action-tag="add-org">创建 组织机构</a></li>
                          <li><a href="javascript:;" data-toggle="modal" data-target="#paroxModal-space" data-action-tag="add-space">创建 工作空间</a></li>
                          <li><a href="javascript:;">创建 任务</a></li>
                          <li class="divider"></li>
                        </ul>
                        -->
                      </li>
                    </ul>
                    <!--*/left nav*-->
                
                    <!--*/right nav*-->
                    <div class="navbar-right">
                    	<!--*search*-->
                       	<form action="${base}/search/index.htm" method="GET" class="navbar-form navbar-left padd-un-r" role="search" style="margin-top:10.5px; marg-bottom:10.5px;">
                          <div class="form-group parox-navbar-search">
                                <label for="search" class="sr-only">搜索</label>
                                <input type="text" name="words" class="form-control input-sm"  id="parox-nav-search" placeholder="">
                                <span class="icon-search font18 text-white"></span>
                          </div>
                          <!--<button type="submit" class="btn btn-default  marg-20-r">提交</button>-->
                        </form>
                        <!--*/search*-->
                    
                    	<ul class="nav navbar-nav navbar-left"  id="parox-nav-userinfo">
                          <li class="dropdown<#if menu='notice'> active</#if>">
                            <a class="dropdown-toggle padd-20-r padd-20-l" data-toggle="dropdown">
                                <span class="icon-bell font18"></span>
                                <span id="notice_count" class="nav-badge" style="display:none;"></span>
                            </a>
                            <ul id="notices_zone" class="dropdown-menu navbar-dropdown-menu" >
                            	<li><p class="text-primary font12 padd-20-l padd-20-r padd-5-t">您目前没有最新信息</p></li>
                            </ul>
                          </li>
                      
                          <li class="dropdown  navbar-left" id="parox-nav-user">
                            <a href="javascript:void(0)" class="dropdown-toggle padd-5-t padd-5-b padd-30-r" data-toggle="dropdown">
                                <img src="${_user.smallPhoto!(imgRoot+'/avater-user-40X40.gif')}" alt="<#if _user??>${_user.realName!}</#if>" class="img-circle img-40X40 marg-10-r">
                                 <#if _user??>${_user.realName!}</#if>
                                <b class="icon-down marg-10-l"></b>
                            </a>
                            <ul class="dropdown-menu navbar-dropdown-menu">
                              <li class="bd-base-b"><a href="${base+_user.url}">我的个人资料</a></li>
                              <li class="bd-base-b"><a href="${base}/settings/account.htm">账户设置</a></li>
                              <li class="bd-base-b"><a href="javascript:;" data-action-tag="add-org">新建一个组织</a></li>
                              <li>
                              	<a href="${base}/login/logout.htm">
                              		<span class="icon-logout padd-3-r"></span>
                              		注销
                              	</a>
                              </li>
                            </ul>
                          </li>
                    	</ul>                
                        
                   </div>
                </div>
                <!--*/right nav*-->
              
              <!-- /.navbar-collapse -->
            </nav>
            
        </header>
        <!--/.header-->