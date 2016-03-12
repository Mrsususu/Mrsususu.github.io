
window.onload = function(){
	waterfall('main', 'box');
	var dataInt = {"data":[{"src":"0.jpg"}, {"src":"1.jpg"}, {"src":"2.jpg"}]}; // 模拟JSON的加载数据
	window.onscroll = function(){
		if(checkScrollSlide()){  // 即每次满足加载条件，加载来自后台的dataInt数据
			var oParent = document.getElementById('main');
			for(var i = 0; i < dataInt.data.length; i ++){ //范围为dataInt的长度，即每次加载的量都是dataInt数目
				// JSON只传来图片的地址，这里需要将图片封装到html中
				var oBox = document.createElement('div'); // A创建
				oBox.className = 'box'; // B命名
				oParent.appendChild(oBox); // C放置
				var oPic = document.createElement('div'); 
				oPic.className = 'pic';
				oBox.appendChild(oPic);
				var oImg = document.createElement('img'); 
				oImg.src = 'images/' + dataInt.data[i].src;  // 注意如何读取JSON值
				oPic.appendChild(oImg);	
			}
			waterfall('main', 'box');  // 注意该waterfall函数的再次调用
		}
	}

	
}

function waterfall(parent, box){
	var oParent = document.getElementById(parent);
	var oBoxes = getElementsByClassName(oParent, box);
	var oBoxW = oBoxes[0].offsetWidth; // 获取盒子宽度，offsetWidth = width(165+10*2)+ border(1*2) + padding(15) = 202 
	var clos = Math.floor(document.documentElement.clientWidth / oBoxW); //document.documentElement.clientWidth用于获取页面可视区域宽度；
	//控制第一行的位置
	//设置main的css，即宽度和margin
	oParent.style.width = clos * oBoxW + 'px';
	oParent.style.margin = '0 auto';

	//使得后续行按瀑布流放置
	var hArr = [];  //存放每一列高度的数组
	for(var i = 0; i < oBoxes.length; i ++){
		if( i < clos ){
			hArr.push(oBoxes[i].offsetHeight);  //第一行的高度直接赋值给hArr数组
		} else {
			var minH = Math.min.apply(null,hArr);  //由于Math.min只能传入一个一个数，而不是数组，因而使用apply
			var index = getMinhIndex(minH, hArr);  //找到高度最小列的索引
			oBoxes[i].style.position = 'absolute';
			oBoxes[i].style.top = hArr[index] + 'px';
			oBoxes[i].style.left = oBoxW * index + 'px';
			hArr[index] += oBoxes[i].offsetHeight;
		}
	}	
}

function getElementsByClassName(element,names){
	if(element.getElementsByClassName){
		return element.getElementsByClassName(names);
	} else {
		var result = [];
		var elements = element.getElementsByTagName('*');
		var name,flag,classStr;
		name = names.split(' ');

		for(var i = 0; i < elements.length; i ++){
			classStr = ' ' + elements[i].className + ' ';
			flag = true;
			for(var j = 0; j < name.length; j++){
				if(classStr.indexOf(name[j]) == -1){
					flag = false;
					break;
				}
			}
			if(flag){
				result.push(elements[i]);
			}
		}
		return result;
	}
}

function getMinhIndex(val, arr){
	for( var i in arr ){
		if(arr[i] == val){
			return i;
		}
	}
}

// 检测是否具备滚动加载数据块的条件
function checkScrollSlide(){
	var oParent = document.getElementById('main');
	var oBox = getElementsByClassName(oParent, 'box');
	var lastBoxH = oBox[oBox.length - 1].offsetTop + Math.floor(oBox[oBox.length - 1].offsetHeight / 2); // 最后一张图片到盒子顶端的距离+图片一半的高度
	var scrollTop = document.body.scrollTop || document.documentElement.scrollTop; // 混杂模式/标准模式。滚动条滚动的长度、
	var height = document.body.clientHeight || document.documentElement.clientHeight; // 页面可视区域的高度
	return (lastBoxH < scrollTop + height)?true:false; // 一旦拖动到足够高度，则可以进行加载
}