
;(function($){


	function DialogBox(ele, options){
		this.element = ele;
 		this.defaluts = {
	 		hasMask: false,  //是否显示遮罩层
	 		width: null, //弹出层宽度
	 		height: null,  //弹出层高度
	 		//hasClose: false,  //是否显示关闭按钮
	 		//hasBtn: false,  //是否显示操作按钮，如取消，确定
	 		//confirmValue: null,  //确定按钮文字内容
			//confirm: function(){}, //点击确定后回调函数
			//cancelValue: null,  //取消按钮文字内容
			//cancel: function(){},  //点击取消后回调函数，默认关闭弹出框
	 		title: '',  //标题内容，如果不设置，则连同关闭按钮（不论设置显示与否）都不显示标题
	 		content: ''  //正文内容，可以为纯字符串，html标签字符串，以及URL地址，当content为URL地址时，将内嵌目标页面的iframe。
		};
		this.opts = $.extend({}, this.defaluts, options); // 将空对象作为第一个参数，这样做的好处是所有值都被合并到这个空对象上，保护了插件里的默认值

	}

	DialogBox.prototype = {

		// 初始化弹出框
		init: function(){ //一级的this还是本元素
			var element = this.element;
			this.show();
			this.create(element);
			this.setStyle();
			this.trigger(element);
		},

		//创建弹出框（添加title和content内容）
		create: function(element){
			var title = this.opts.title,
			    content = this.opts.content,
			    //$title = $('title'), //建立标题文本节点
			    $dialogtitle = $(element).find('h2'),
			    $dialogcontent = $(element).find('p');
			$dialogtitle.text(title);
			$dialogcontent.text(content);
		},

		//显示弹出框
 		show: function(){
 			$('.dialog').css('display','block');
 		},

 		//隐藏弹出框
 		hide: function(){
 			$('.dialog').css('display','none');
 		},

 		//设置弹出框样式
 		setStyle: function(){
 			var that = this,
 				$dialog = $('.dialog'),
 				$popup = $('.popup');

 			//弹出框宽高
 			$popup.css({
 				width: function(){ //二级的this就不是本元素了，需要提前保存现场了
 					if(that.opts.width){
 						return that.opts.width + 'px';
 					}else{
 						return;
 					}
 				},
 				height: function(){
 					if(that.opts.height){
 						return that.opts.height + 'px';
 					}else{
 						return;
 					}
 				}
 			});
		},

		//弹出框触屏器(系列事件)
		trigger: function(element){
			var that = this;
			$('.dialog-close').click(function(){
				that.hide();
			});
		}

	}


	$.fn.popupBox = function(options){
		var dialogBox = new DialogBox(this, options);
		dialogBox.init();
	}

})(jQuery,window,document); //最外层是一个自执行的匿名函数，也就是一个闭包


/* 简单插件格式
(function($){

	$.fn.extend({ // jQuery.fn = jQuery.prototype，也就是jQuery对象的原型。那jQuery.fn.extend()方法就是扩展jQuery对象的原型方法。
		
		"popupBox" : function(){

			var opts = $.extend({}, defaluts, options); //使用jQuery.extend 覆盖插件默认参数

			return this.each(function(){ //这里的this 就是 jQuery对象。这里return 为了支持链式调用
				var $this = $(this); //获取当前dom 的 jQuery对象，这里的this是当前循环的dom
				$this XXX ; //对当前对象做XXX操作
			});			
		}

	});

	上面等价于
	$.fn.popupBox = function(){
		XXXX
	};

	var defaluts = {
 		hasMask: false,  //是否显示遮罩层
 		width: null, //弹出层宽度
 		height: null,  //弹出层高度
 		hasClose: false,  //是否显示关闭按钮
 		hasBtn: false,  //是否显示操作按钮，如取消，确定
 		confirmValue: null,  //确定按钮文字内容
		confirm: function(){}, //点击确定后回调函数
		cancelValue: null,  //取消按钮文字内容
		cancel: function(){},  //点击取消后回调函数，默认关闭弹出框
 		title: '',  //标题内容，如果不设置，则连同关闭按钮（不论设置显示与否）都不显示标题
 		content: ''  //正文内容，可以为纯字符串，html标签字符串，以及URL地址，当content为URL地址时，将内嵌目标页面的iframe。
	};

})(window.jQuery); //最外层是一个自执行的匿名函数，也就是一个闭包
*/