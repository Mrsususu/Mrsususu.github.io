$(function(){
	/* 一级nav的hover动画 */
	$('.m-nav>li:not(:eq(0))').mouseover(function(){
		$(this).find('div.main-triangle').addClass('triangle-bottomright');
	}).mouseout(function(){
		$(this).find('div.main-triangle').removeClass('triangle-bottomright');
	});
	
	// 一级nav的hover动画（方案二）
	// $('.m-navtop li:not(:eq(0))').hover(function(){
	// 	$(this).find('div.main-triangle').addClass('triangle-bottomright');
	// },function(){
	// 	$(this).find('div.main-triangle').removeClass('triangle-bottomright');
	// });

	/* 二级nav的hover动画 */
	$('.m-subNav li').mouseover(function(){
		$(this).find('div.sub-triangle').addClass('triangle-bottomright-small');
	}).mouseout(function(){
		$(this).find('div.sub-triangle').removeClass('triangle-bottomright-small');
	});

	/* 二级菜单下拉动画 */
	$('.m-nav li').hover(function() {
		$('ul', this).slideDown(200);
		// $(this).children('a:first').addClass("hov");  //通过这个方法获取二级菜单中的每个元素
	}, function() {
		$('ul', this).slideUp(100);
	});

	/* slide动画，点击播放 */ /* 此模块暂时删除 */
	slideClick();

	/* articleItem的hover变色 */
	$('.g-content .articles li').hover(function(){
		$(this).children().addClass('active');	
	},function(){
		$(this).children().removeClass('active');
	});

	/* articleItem的页面跳转 */
	$('.articleItem').bind('click',function(){
		var href = $(this).prev().attr('href');
		location.href = href;
	});

})

function slideClick(){
	var page = 1;
	var $content = $('.slideContent ul');
	var $tips = $('.slideCaption .changeTips span');
	var realWidth = $content.width();
	var showWidth = $('.m-slide').width();
	var pageNum = realWidth/showWidth;

	$('.changeBtn .next').click(function(){
		if(!$content.is(':animated')){
			if(page < pageNum){
				$content.animate({left: '-='+showWidth},1500);
				page++;
			}else{
				$content.animate({left: '0'},1500);
				page = 1;
			}	
			$tips.eq(page-1).addClass('current').siblings().removeClass('current');	 // 下面提示点的动画	
		}
	});

	$('.changeBtn .prev').click(function(){
		if(!$content.is(':animated')){
			if(page == 1){
				$content.animate({left: -realWidth+showWidth},1500);
				page = 4;
			}else{
				$content.animate({left: '+='+showWidth},1500);
				page--;
			}	
			$tips.eq(page-1).addClass('current').siblings().removeClass('current');	 // 下面提示点的动画	
		}
	});

}
