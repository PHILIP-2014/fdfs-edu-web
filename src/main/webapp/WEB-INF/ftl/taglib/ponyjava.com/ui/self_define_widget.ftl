<#--自定义组件
type："1":"text","2":"textarea","3":"select","4":"radio","5":"checkboxlist"
dataType：1：字符串；2：整型；3：金额；4：日期；5：布尔；
name
label
help
value
size
inputWidth
rows
cols
colspan
width
-->
<#macro selfDefineWidget
	type=1 dataType=1 name='' label='' value='' help='' size='' inputWidth='' rows='' cols='' list='' noValue='false'
	colspan='' width='100' helpPosition='2'
	>
<#if type=1>
	<#local vld="{maxlength:255}"/>
	<#if dataType=2><#local vld="{digits:true}"/>
	<#elseif dataType=3><#local vld="{number:true}"/>
	</#if>
<#if dataType=4>
<@p.text colspan=colspan width=width label=label name=name readonly="readonly" onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})" class="Wdate" size=size?string noValue=noValue help=help helpPosition=helpPosition/>
<#else>
<@p.text colspan=colspan width=width label=label name=name help=help size=size?string value=value noValue=noValue helpPosition=helpPosition vld=vld/>
</#if>
<#elseif type=2>
<@p.textarea colspan=colspan width=width label=label name=name help=help cols=cols?string rows=rows?string value=value noValue=noValue helpPosition=helpPosition maxlength="255"/>
<#elseif type=3>
<@p.select colspan=colspan width=width label=label name=name help=help list=list?split(',') noValue=noValue style="width:"+inputWidth+"px" helpPosition=helpPosition/>
<#elseif type=4>
<#if dataType=5>
<#if list?split(',')?size gt 1>
<#local trueValue=(list?split(',')[0])/>
<#local falseValue=(list?split(',')[1])/>
<#else>
<#local trueValue='是'/>
<#local falseValue='否'/>
</#if>
<#local boolMap={"true":trueValue,"false":falseValue}/>
<@p.radio colspan=colspan width=width label=label name=name help=help list=boolMap noValue=noValue helpPosition=helpPosition/>
<#else>
<@p.radio colspan=colspan width=width label=label name=name help=help list=list?split(',') noValue=noValue helpPosition=helpPosition/>
</#if>
<#elseif type=5>
<@p.checkboxlist colspan=colspan width=width label=label name=name help=help list=list?split(',') noValue=noValue helpPosition=helpPosition/>
<#else>
不支持的自定义控件type='${type}'
</#if>
</#macro>
