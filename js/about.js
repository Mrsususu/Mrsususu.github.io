$(function(){
	/* 一级nav的hover动画 */
	$('.m-nav>li:not(:eq(5))').mouseover(function(){
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

})

