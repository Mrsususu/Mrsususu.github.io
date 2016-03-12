//
//
// jQuery两大优点：支持连缀，隐式迭代
// jQuery的方法只能用于jQuery对象，因而对js原生对象或者DOM对象执行jQuery的方法，都无法执行会报错。（eg：1.p18(本来为原生js对象);2.p44(本来为DOM对象)）
// (接上句)因此需要采用对该对象X外套$()，变为$(X)，即变为了jQuery对象。
//

$(window).on('load', function(){
	waterfall();
	var dataInt = {'data':[{'src':'0.jpg'}, {'src':'1.jpg'}, {'src':'2.jpg'}]};
	$(window).on('scroll', function(){
		if(checkScrollSlide()){
			$.each(dataInt.data, function(index, value){ // value此处为js原生的对象
			// 【注意！】$(选择器).each(function(index, value){})，在选择器选中的结果中遍历则这么使用。
			// 【注意！】$.each(obj,function(index, value){})，则用于对对象的遍历
				var oBox = $('<div>').addClass('box').appendTo($('#main')); // $('<div>')直接就建立了一个div元素，并且可以连缀加上class名称同时将其放置到指定位置
				var oPic = $('<div>').addClass('pic').appendTo($(oBox)); // 【！注意】appendTo的位置，直接写前面建立好的元素即可
				$('<img>').attr('src', 'images/' + $(value).attr('src')).appendTo($(oPic)); // .attr()方法用于设置属性。同时由于图片后面不再引用，因而不再需要再写 var oImg = XXX 这类的东西了。
				waterfall();
			}); // $(value).attr('src')部分也可以替换为 dataInt.data[index].src。对value必须加上$()才能使用.attr()方法，因为value本身为js原生对象。
		}
	});
});

function waterfall(){
	var $boxes = $('#main>div');
	var $w = $boxes.eq(0).outerWidth(); // 如果是.width()则只有width的宽度，而.outerWidth()包含width+border+padding
	var $cols = Math.floor($(window).width() / $w);
	$('#main').width( $w * $cols ).css('margin', '0 auto');  //【注意.css()方法的写法】【和后面比较】
	var hArr = [];
	$boxes.each(function(index, value){  //其中两个参数，index为索引号，value为遍历每个元素的dom值
		var h = $boxes.eq(index).outerHeight();  // 注意jQuery中是利用.eq(index)来找数组中元素的，类似于js中的[index]
		// 注意，js中用的是.offsetHeight这个属性，而jQuery里用的是.outerHeight()这个方法
		if(index < $cols){
			hArr[index] = h;
		} else {
			var minH = Math.min.apply(null, hArr);
			var minHIndex = $.inArray(minH, hArr); // $.inArray()用于判断一个值在数组中的索引，其引入两个参数，第一个是你要判断谁，第二个是你在哪个数组中判断
			$boxes.eq(index).css({
				'position': 'absolute',
				'top': minH + 'px',
				'left': minHIndex * $w + 'px'
			}); 
			// 可以用$(value)替换$boxes.eq(index)
			// 直接value为序号为cols开始的dom元素，由于dom对象是不能使用jQuery对象的任何方法的
			// 【注意.css()方法的写法】【和前面比较】
			hArr[minHIndex] += $boxes.eq(index).outerHeight();
		}
	}); //遍历所有元素，和js中的for是一个效果
}

function checkScrollSlide(){
	var $lastBox = $('#main>div').last(); // .last()方法能取到最后一个元素
	var $lastBoxH = $lastBox.offset().top + Math.floor($lastBox.outerHeight() / 2); // 此处iQuery取top值的方法为.offset().top，而js中为.offsetTop
	var $scrollTop = $(window).scrollTop(); // js中为.scrollTop属性，而jQuery中为.scrollTop()方法
	var $height = $(window).height(); // 利用$(window).height()直接可以获取页面可视区域的高度
	return ($lastBoxH < $scrollTop + $height)?true:false;
}