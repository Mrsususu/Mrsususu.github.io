
function $ (id) {
    return document.getElementById(id);
}


function popup() {   //检查cookie,隐藏通知栏，并设置cookie,
    var oPopup = $('j-display');
    var oBtn = oPopup.getElementsByTagName('p')[1];
    if ( getCookie('Off')) {
        oPopup.style.display = 'none';
    }
    else{
    oBtn.onclick = function () {
        oPopup.style.display = 'none';
        setCookie('Off', true, 36500 );
        };
    }
}
popup(); //需求一

function setCookie (key, value, t) {  //设置cookie
    var oDate = new Date();
    oDate.setDate( oDate.getDate() + t);
    document.cookie = key + '=' + value + ';expires=' + oDate.toGMTString();
}

function getCookie (key) {  //获取cookie
    var arr1 = document.cookie.split('; ');
    for (var i = 0; i < arr1.length; i++) {
        var arr2 = arr1[i].split('=');
        if(arr2[0] === key ){
            return decodeURI(arr2[1]);
        }
    }
}

function removeCookie (key) {  //删除cookie
    setCookie( key, '', -1 );
}

function serialize (data) {  // 设置参数序列化
    if (!data) return '';
    var pairs = [];
    for (var name in data){
        if (!data.hasOwnProperty(name)) continue;
        if (typeof data[name] === 'function') continue;
        var value = data[name].toString();
        name = encodeURIComponent(name);
        value = encodeURIComponent(value);
        pairs.push(name + '=' + value);
    }
    return pairs.join('&');
}
 
function get(url,options,callback) {  //get方法
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4) {
            if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                callback(xhr.responseText); //反馈的就是API返回的值
            } else {
                alert ( 'request failed : ' + xhr.status);
            }
        }
    };
    xhr.open('get', url + '?' + serialize(options), true);
    xhr.send(null);
}

function getElementsByClassName(element, names) {  //获取class元素
    if (element.getElementsByClassName){
        return element.getElementsByClassName(names);
    } else {
        var elements = element.getElementsByTagName('*');
        var result=[];
        var element,
            classNameStr,
            flag,
            name;

        names = names.split(' ');
        for( var i = 0; element = elements[i]; i++) {
            classNameStr = ' ' + element.className + ' ';
            flag = true;
            for( var j = 0; name = names[j]; j++) {
                if(classNameStr.indexOf(' ' + name + ' ') == -1){
                    flag == false;
                    break;
                }
            }
            if(flag) {
                result.push(element);
            }            
        }
        return result;
    }

}


function login() {
    var ologin = $('j-login');
    var oAttentioin = $('j-input');
    var oPopuplog = getElementsByClassName(ologin,'popuplog');
    var oClose = getElementsByClassName(ologin,'close');
    var oInput = ologin.getElementsByTagName('input');
    var oLabel = ologin.getElementsByTagName('label');
    var oSpan = ologin.getElementsByTagName('span');
    var oButton = getElementsByClassName(ologin,'submit');
    var oCancel = getElementsByClassName(ologin,'cancel');

    function focus(i) {  //弹窗输入时，提示文字隐藏
        oInput[i+1].onfocus = function() {
            oLabel[i].style.display = 'none';
        }
        oInput[i+1].onblur = function() {
            if( this.value ===''){
                oLabel[i].style.display = 'block';
            }
        }
    }
    focus(0);
    focus(1);

    oSpan[1].onclick = function() {  //弹窗的x点击后关闭登录框
        oPopuplog[0].style.display = 'none';
    };

    oButton[0].onclick = function() { //点击submit提交表单
        var userName1 = hex_md5(oInput[1].value);
        var password1 = hex_md5(oInput[2].value);
        get('http://study.163.com/webDev/login.htm', {userName:userName1,password:password1}, function(a){
            if( a === '1'){  //用户名验证通过
                oPopuplog[0].style.display = 'none'; //登陆框消失
                setCookie('loginSuc', '1', 36500);
                get('http://study.163.com/webDev/attention.htm', '', function(b){ //调用关注API
                    if( b === '1'){ //关注已成功
                        setCookie('followSuc', '1', 36500);
                        oAttentioin.className = 'active';
                        oAttentioin.value = '已关注';
                        oAttentioin.disabled = false;
                        oCancel[0].style.display = 'block'; 
                    }
                });
            } else {
                alert('帐号密码错误，请重新输入');
            }
        });
    }

    oAttentioin.onclick = function() { //点击“关注”，判断登录的 cookie 是否已设置
        if (!getCookie('loginSuc')){ // 登陆cookie未设置，表明未登陆，则跳出登录框
            oPopuplog[0].style.display = 'block';
        } else {  // 登陆cookie已设置，表明已登陆，则修改样式为已关注active的样式
            oAttentioin.className = 'active';
            oAttentioin.value = '已关注';
            oAttentioin.disabled = false; //disabled 属性规定应该禁用 input 元素，此时“已关注”按钮不能再做其他操作
            oCancel[0].style.display = 'block'; //取消键显示
        }
    };

    oCancel[0].onclick = function() { //取消关注
        removeCookie('followSuc');
        removeCookie('loginSuc');
        oAttentioin.className = 'attention';
        oAttentioin.value = '关注';
        oAttentioin.disabled = true;
        this.style.display = 'none';
    };
}
login();

function palyvideo() {  //弹出视频层
    var oList1 = $('j-list1');
    var oTrigger = getElementsByClassName(oList1,'trigger');
    var oPopupvideo = getElementsByClassName(oList1,'popupvideo');
    var oClose = getElementsByClassName(oList1,'close');
    var myVideo = oList1.getElementsByTagName('video');
    oTrigger[0].onclick = function() {
        oPopupvideo[0].style.display = 'block';
    }
    oClose[0].onclick = function() {
        oPopupvideo[0].style.display = 'none';
        myVideo[0].pause();  //关闭视频/暂停当前视频
    }
}
palyvideo();//需求七

function slide() {
    var oBanner = $('j-slide');
    var oLink = oBanner.getElementsByTagName('a')[0];
    var oImg = oBanner.getElementsByTagName('img')[0];
    var oUl = oBanner.getElementsByTagName('ul')[0];
    var aLi = oBanner.getElementsByTagName('li');
    var data = [
        { link: 'http://open.163.com/' , src : 'images/banner1.jpg' },
        { link: 'http://study.163.com/' , src : 'images/banner2.jpg' },
        { link: 'http://www.icourse163.org/' , src : 'images/banner3.jpg' }
    ];

    for(var i = 0; i < data.length; i++) {
        var oLi = document.createElement('li');
        var aNum = document.createTextNode(i+1);
        var num = 0;
        oLi.appendChild(aNum);
        oUl.appendChild(oLi);

        oLink.href = data[0].link;
        oImg.src = data[0].src;
        aLi[0].className = 'active';
        //初始化结束
        aLi[i].index = i;   //一旦点击，则到该点击的图片页
        aLi[i].onclick = function() {
            num = this.index;
            showslide(this.index);
        }
    }

    var oWindow = document.body.clientWidth;   //使下面的点位置居中
    oUl.style.left = (oWindow - 20 * aLi.length)/2 + 'px';
    window.onresize = function() {
        oWindow = parseFloat(document.body.clientWidth);
        oUl.style.left = (oWindow - 20 * aLi.length)/2 + 'px';
    }

    function slideshow(index) {
        oImg.style.opacity = 0;
        oImg.style.transition = '';
        for(var i = 0; i < aLi.length; i++) {
            aLi[i].className = '';
        }
        oLink.href = data[index].link;
        oImg.src = data[index].src;
        aLi[index].className = 'active';
        setTimeout( function(){
            oImg.style.opacity = 1;
            oImg.style.transition = '0.5s';
        },30);
    }

    function autoplay() { //每隔5s自动播放
        timer = setInterval(
            function() {
                num = (num + 1)%aLi.length;
                slideshow(num);  //每次展示的是下一个图片
            },5000);
    }

    oBanner.onmouseover = function() {  //鼠标移到图片上时，停止自动播放
        clearInterval(timer);
    } 
    oBanner.onmouseout = function() {  //鼠标移开图片时，启动自动播放
        autoplay();
    }
    autoplay();
}  //需求四
slide();

function getStyle(obj,attr) { //获取外部（link）或内部（style）样式。注意，style只能获取内联样式，即在html标签中的样式。
    if (obj.currentStyle) {
        return obj.currentStyle[attr];  //IE中常见
    } 
    else {
        return getComputedStyle(obj)[attr];  //firefox，chrome中可用
    }
}


function tab() {
    var oTab = $('j-tab');
    var oTabhd = getElementsByClassName(oTab,'g-tabhd'); 
    var oBtn = oTabhd[0].getElementsByTagName('a'); 
    var oDesign = getElementsByClassName(oTab,'design');
    var oLanguage = getElementsByClassName(oTab,'language');
    var oPart = getElementsByClassName(oTab,'part');

    function setData(num,element) {
        get('http://study.163.com/webDev/couresByCategory.htm', {pageNo:1,psize:20,type:num}, function(data){
            data = JSON.parse(data);
            for (var i = 0; i < data.list.length; i++){
                //基本显示team部分
                var oTeam = document.createElement('div');
                oTeam.className = 'm-item';
                var oImg = document.createElement('img');
                oImg.src = data.list[i].middlePhotoUrl;
                var oP = document.createElement('p');
                oP.className = 'f-toe';
                oP.innerHTML = data.list[i].name;
                var oDiv = document.createElement('div');
                oDiv.className = 'provider';
                oDiv.innerHTML = data.list[i].provider;
                var oSpan = document.createElement('span');
                oSpan.innerHTML = data.list[i].learnerCount;             
                var oStrong = document.createElement('strong');
                if( data.list[i].price == 0){
                    oStrong.innerHTML = '免费';
                } else {
                    oStrong.innerHTML = '￥' + data.list[i].price;
                }

                oTeam.appendChild(oImg);
                oTeam.appendChild(oP);
                oTeam.appendChild(oDiv);
                oTeam.appendChild(oSpan);
                oTeam.appendChild(oStrong);

                //鼠标放上后的team部分
                if(!data.list[i].categoryName){
                    data.list[i].categoryName = '无';
                }
                var oA = document.createElement('a');
                oA.innerHTML = '<img src=\"' + data.list[i].middlePhotoUrl + '\"/><h3>' + data.list[i].name + '</h3><span>' + data.list[i].learnerCount + '人在学</span><p class="categoryname">发布者：' + data.list[i].provider + '</br>分类：' + data.list[i].categoryName + '</p><p class="description">' +  data.list[i].description + '</p>';
                
                oTeam.appendChild(oA);

                //把team元素放入element中
                element.appendChild(oTeam);
            }
        }); //end of get
    } //end of setData

    setData(10,oDesign[0]);
    setData(20,oLanguage[0]);  //需求五

/* 可以起到效果，为参考采用的方案，本例采用下面的tab方案解决
    oBtn[0].onclick = function(){
        oDesign[0].style.display = 'block';
        this.className = 'f-ib active';
        oLanguage[0].style.display = 'none';
        oBtn[1].className = 'f-ib';
        return false;
    };
    oBtn[1].onclick = function(){
        oDesign[0].style.display = 'none';
        oBtn[0].className = 'f-ib';
        oLanguage[0].style.display = 'block';
        this.className = 'f-ib active';
        return false;
    };
*/

    for (var i = 0; i < oBtn.length; i++){
        oBtn[i].index = i;

        oBtn[i].onclick = function() {
            for(var n = 0; n < oBtn.length; n++){
                oBtn[n].className = 'f-ib';
                oPart[n].style.display = 'none';                
            }
            oBtn[this.index].className = 'f-ib active';
            oPart[this.index].style.display = 'block'; 
            return false;  //起到效果就是，避免a标签跳到页面顶部，而是在点击时还能停留在当前位置
        }
    }  //需求六

}
tab();  

function setList() {  //在滚动list中把各个li都放入，数据从API读取
    var oList2 = $('j-list2');
    var oUl = oList2.getElementsByTagName('ul');

    get('http://study.163.com/webDev/hotcouresByCategory.htm', {}, function(data){
        var arr = JSON.parse(data);
        for(var i = 0; i < 20; i++){
            var aLi = document.createElement('li');
            var aA = document.createElement('a');
            var aImg = document.createElement('img');
            var aP = document.createElement('p'); 
            var aSpan = document.createElement('span');

            aImg.src = arr[i].smallPhotoUrl;  
            aP.innerHTML = arr[i].name;
            aSpan.innerHTML = arr[i].learnerCount;

            aA.appendChild(aImg);
            aA.appendChild(aP);
            aA.appendChild(aSpan);
            aLi.appendChild(aA);
            oUl[0].appendChild(aLi);
        }
    });    
}  
setList();

function change() {
    var oList2 = $('j-list2');
    var oUl = oList2.getElementsByTagName('ul');
    var Top = 0;

    function autoplay() {
        timer = setInterval(
            function() {
                if (Top == -700) {
                    Top = 0;
                } else {
                    Top = Top - 70;    
                }
                oUl[0].style.top = Top + 'px';
            },5000);
    }

    oList2.onmouseover = function(){
        clearInterval(timer);
    }
    oList2.onmouseout = function(){
        autoplay();
    }

    autoplay();
}
change();



