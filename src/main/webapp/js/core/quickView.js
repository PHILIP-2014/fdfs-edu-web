var cfg_fade_switch=true;      
var cfg_xoffset=5;        
var cfg_yoffset=10;       
var cfg_mouse_follow=true;
var cfg_hide_delay=3000;   
var cfg_txt_tag='title';
var cfg_is_show=true;
var cfg_tags = new Array("select","a","area","b","big","caption","center","code","dd","div","dl","dt","em","h1","h2","h3","h4","h5","h6","i","img","input","li","map","ol","p","pre","s","small","span","strike","strong","sub","sup","table","td","th","tr","tt","u","var","ul","layer");

document.write("<style>.navtext_div{PADDING-RIGHT: 6px; PADDING-LEFT: 6px;PADDING-TOP: 2px; PADDING-BOTTOM: 1px; FONT-SIZE: 12px; Z-INDEX: 99; VISIBILITY: hidden; COLOR: #333333; BORDER: 1px #8899AA dashed;FONT-FAMILY: Courier New,tahoma,arial; POSITION: absolute; BACKGROUND-COLOR: #FFFFCC;}</style>");
document.write('<div id="navtext_div" class="navtext_div" style="visibility:hidden; position:absolute; top:0px; left:-400px; z-index:10000; padding:3px"></div>');

function xalt_props(){
    this.w3c=(document.getElementById)?true:false;
    this.ns4=(document.layers)?true:false;
    this.ie4=(document.all && !this.w3c)?true:false;
    this.ie5=(document.all && this.w3c)?true:false;
    this.ns6=(this.w3c && navigator.appName.indexOf("Netscape")>=0 )?true:false;
    this.w_y=0;
    this.w_x=0;
    this.navtxt=null;
    this.boxheight=0;
    this.boxwidth=0;
    this.ishover=true;
    this.ieop=0;
    this.op_id=0;
    this.oktomove=true;
    this.dy=0;
}
function xalt_kill_errors() {
    return true;
}

var XALT=new xalt_props();

function xalt_set_mouse_follow(mouse_follow){//true or false
    cfg_mouse_follow=mouse_follow;
}

function xalt_set_fade_switch(fade_switch){//true or false
    cfg_fade_switch=fade_switch;
    if(!cfg_fade_switch)XALT.ieop=100;
}

function xalt_get_window_dims(){
    XALT.w_y=(XALT.ie5||XALT.ie4)?document.body.clientHeight:window.innerHeight;
    XALT.w_x=(XALT.ie5||XALT.ie4)?document.body.clientWidth:window.innerWidth;
}

function xalt_get_box_width(){
    if(XALT.ns4)XALT.boxwidth=(XALT.navtxt.document.width)? XALT.navtxt.document.width : XALT.navtxt.clip.width;
    else if(XALT.ie4)XALT.boxwidth=(XALT.navtxt.style.pixelWidth)? XALT.navtxt.style.pixelWidth : XALT.navtxt.offsetWidth;
    else XALT.boxwidth=(XALT.navtxt.style.width)? parseInt(XALT.navtxt.style.width) : parseInt(XALT.navtxt.offsetWidth);
}

function xalt_get_box_height(){
    if(XALT.ns4)XALT.boxheight=(XALT.navtxt.document.height)? XALT.navtxt.document.height : XALT.navtxt.clip.height;
    else if(XALT.ie4)XALT.boxheight=(XALT.navtxt.style.pixelHeight)? XALT.navtxt.style.pixelHeight : XALT.navtxt.offsetHeight;
    else XALT.boxheight=parseInt(XALT.navtxt.offsetHeight);
}

function xalt_move_nav_txt(x,y){
    if(XALT.ns4){
        XALT.navtxt.moveTo(x,y);
    }else{
        XALT.navtxt.style.left=x+'px';
        XALT.navtxt.style.top=y+'px';
    }
}

function xalt_get_page_scrolly(){
    if(XALT.ie5||XALT.ie4){
        if(document.documentElement.scrollTop > 0) return document.documentElement.scrollTop;
        return document.body.scrollTop;
    }else return window.pageYOffset;
}

function xalt_get_page_scrollx(){
    if(XALT.ie5||XALT.ie4){
        if(document.documentElement.scrollLeft > 0) return document.documentElement.scrollLeft;
        return document.body.scrollLeft;
    }else return window.pageXOffset;
}

function xalt_write_in_div(text){
    if(XALT.ns4){
        XALT.navtxt.document.open();
        XALT.navtxt.document.write(text);
        XALT.navtxt.document.close();
    }
    else XALT.navtxt.innerHTML=text;
}

function xalt_write_txt(text){
    if(cfg_fade_switch && (XALT.ie4||XALT.w3c))clearInterval(XALT.op_id);
    if(text!=0 && cfg_is_show ){
        if(!cfg_mouse_follow)clearTimeout(XALT.dy);
        XALT.oktomove=true;
        XALT.ishover=true;
        if(XALT.ns4)text='<div class="navtext_div">'+text+''+'</div>';
        if(XALT.w3c||XALT.ie4)XALT.navtxt.style.textAlign="left";
        xalt_write_in_div(text);
        if(XALT.ns4)XALT.navtxt.visibility="show";
        else{
            //XALT.navtxt.style.display="inline";
            XALT.navtxt.style.visibility="visible";
        }
        xalt_get_box_height();
        if((XALT.w3c||XALT.ie4) && cfg_fade_switch){
            if(XALT.ie4||XALT.ie5)XALT.navtxt.style.filter="alpha(opacity=0)";
            if(XALT.ns6)XALT.navtxt.style.MozOpacity=0;
            XALT.ieop=0;
            XALT.op_id=setInterval('xalt_do_opacity()',10);
        }
        cfg_is_show=false;
    }else{
        cfg_is_show=true;
        if(cfg_mouse_follow)xalt_hide_alt_txt();
        else XALT.dy=setTimeout('xalt_hide_alt_txt()',cfg_hide_delay);
    }
}

function xalt_hide_alt_txt(){
    if(XALT.ns4)XALT.navtxt.visibility="hide";
    else{
        //XALT.navtxt.style.display="none";
        XALT.navtxt.style.visibility="hidden";
    }
    xalt_move_nav_txt(-XALT.boxwidth-10,0);
    xalt_write_in_div('');
}

function xalt_do_opacity(){
    if(XALT.ieop<=100){
    XALT.ieop+=32;
    if(XALT.ie4||XALT.ie5)XALT.navtxt.style.filter="alpha(opacity="+XALT.ieop+")";
    if(XALT.ns6)XALT.navtxt.style.MozOpacity=XALT.ieop/100;
    }else clearInterval(XALT.op_id);
}

function xalt_move_obj(evt){
    mx=(XALT.ie5||XALT.ie4)?event.clientX:evt.pageX;
    my=(XALT.ie5||XALT.ie4)?event.clientY:evt.pageY;
    if(XALT.ishover && XALT.oktomove){
        margin=(XALT.ie4||XALT.ie5)?5:25;
        if(XALT.ns6)if(document.height+27-window.innerHeight<0)margin=15;
        if(XALT.ns4)if(document.height-window.innerHeight<0)margin=10;
        if(XALT.ns4||XALT.ns6)mx-=xalt_get_page_scrollx();
        if(XALT.ns4)my-=xalt_get_page_scrolly();
        xoff=mx+cfg_xoffset;
        yoff=(my+XALT.boxheight+cfg_yoffset-((XALT.ns6)?xalt_get_page_scrolly():0)>=XALT.w_y)? -5-XALT.boxheight-cfg_yoffset: cfg_yoffset;
        xalt_move_nav_txt( Math.min(XALT.w_x-XALT.boxwidth-margin , Math.max(2,xoff))+xalt_get_page_scrollx(), my+yoff+((!XALT.ns6)?xalt_get_page_scrolly():0));
        if(!cfg_mouse_follow)XALT.oktomove=false;
    }
}
function xalt_ns4_tags(tag_type, t_d, t_y){
    t_d = t_d || document;
    t_y = t_y || new Array();
    var t_x = (tag_type=="a")? t_d.links : t_d.layers;
    for(var z = t_x.length; z--;) t_y[t_y.length] = t_x[z];
    for(var z = t_d.layers.length; z--;) t_y = xalt_ns4_tags(tag_type, t_d.layers[z].document, t_y);
    return t_y;
}

function xalt_onload(){
    window.onerror = xalt_kill_errors;
    if (!(XALT.w3c || XALT.ns4 || XALT.ie4 || XALT.ie5 || XALT.ns6)) return;
    if(XALT.ns4||XALT.ns6){
        window.document.captureEvents(Event.MOUSEMOVE);
        window.document.addEventListener("mousemove", xalt_move_obj, true);
        window.document.addEventListener("resize", xalt_get_window_dims, true);
    }else if(XALT.ie4||XALT.ie5||XALT.w3c){
        window.document.attachEvent("onmousemove", xalt_move_obj);
        window.document.attachEvent("onresize", xalt_get_window_dims);
    }
    XALT.navtxt=(XALT.ns4)?document.layers['navtext_div']:(XALT.ie4)?document.all['navtext_div']:(XALT.w3c)?document.getElementById('navtext_div'):null;
    xalt_get_box_width();
    xalt_get_box_height();
    xalt_get_window_dims();
    if(XALT.ie4||XALT.ie5&&cfg_fade_switch)XALT.navtxt.style.filter="alpha(opacity=100)";
    var i = cfg_tags.length, tags;
    while(i--){
        tags = (XALT.ie4 || XALT.ie5) ? (document.all.tags(cfg_tags[i]) || 1)
            : document.getElementsByTagName? (document.getElementsByTagName(cfg_tags[i]) || 1)
            : (!XALT.ns4 && cfg_tags[i]=="a")? document.links
            : 1;
        if (XALT.ns4 && (cfg_tags[i] == "a" || cfg_tags[i] == "layer")) tags = xalt_ns4_tags(cfg_tags[i]);
        var j = tags.length;
        while(j--){
            var txt = tags[j].getAttribute(cfg_txt_tag);
            if (tags[j].alt) tags[j].alt = "";//灞忚斀榛樿鐨凙LT鏍囩
            //if (tags[j].title) tags[j].title = "";
            if(txt != null && txt != ''){
                tags[j].setAttribute('xalt_txt', txt);
                tags[j].setAttribute(cfg_txt_tag, '');
                tags[j].onmouseover = function() {
                    xalt_write_txt(this.getAttribute('xalt_txt'));
                    if(!cfg_mouse_follow)XALT.dy=setTimeout('xalt_hide_alt_txt()',cfg_hide_delay);
                }
                tags[j].onmouseout = function() {
                    xalt_write_txt(0);
                    if(!cfg_mouse_follow)clearTimeout(XALT.dy);
                }

            }
        }
    }
}

if(XALT.ns4||XALT.ns6){
    window.addEventListener("load", xalt_onload, true);
}else if(XALT.ie4||XALT.ie5||XALT.w3c){
     window.attachEvent("onload", xalt_onload);
}