$(function(){

	// 约定，初始data必须格式准确，作为后续data添加的模板参考
	// 约定，后续添加的data格式必须和初始相同
	// 一旦属性有增减或者属性的先后有改变，都将被认为是错误数据而不被添加入表格中
	var data = [
		{"id":001, "name":"小李", "hobby":"爱美食", "chinese":89, "math":74, "english":91, "physical":60, "all":314, "isShow": true},
		{"id":002, "name":"小高", "hobby":"爱美食", "chinese":33, "math":99, "english":73, "physical":87, "all":292, "isShow": true},
		{"id":003, "name":"小丁", "hobby":"爱代码", "chinese":100, "math":77, "english":95, "physical":65, "all":337, "isShow": true},
		{"id":004, "name":"小吴", "hobby":"爱代码", "chinese":79, "math":86, "english":88, "physical":82, "all":335, "isShow": true}
	];

	var data1 = [
		{"id":005, "name":"小郎", "hobby":"爱美食", "chinese":80, "math":72, "english":95, "physical":66, "all":313, "isShow": true},
		{"id":006, "name":"小董", "hobby":"爱运动", "chinese":85, "math":91, "english":72, "physical":82, "all":330, "isShow": true},
		{"id":007, "name":"小张", "hobby":"爱代码", "chinese":99, "math":92, "english":69, "physical":75, "all":335, "isShow": true},
		{"id":008, "name":"小林", "hobby":"爱看剧", "chinese":78, "math":89, "english":83, "physical":80, "all":330, "isShow": true}
	];

	var data2 = [
		{"id":009, "name":"小凌", "hobby":"爱看剧", "chinese":74, "math":82, "english":86, "physical":68, "all":310, "isShow": true},
		{"id":010, "name":"小金", "hobby":"爱运动", "chinese":87, "math":93, "english":72, "physical":86, "all":338, "isShow": true},
		{"id":011, "name":"小杨", "hobby":"爱运动", "chinese":92, "math":70, "english":88, "physical":69, "all":319, "isShow": true}
	];

	var data3 = [
		{"id":012, "name":"小梁", "hobby":"爱运动", "chinese":88, "math":80, "english":77, "physical":92, "all":337, "isShow": true},
		{"id":013, "name":"小石", "hobby":"爱代码", "chinese":69, "math":75, "english":64, "physical":93, "all":301, "isShow": true}
	];

// *********** 列表操作函数 *****************

	function createTable(OutEle, data, options){

		this.OutEle = OutEle;
		this.data = $.extend(true, [], data); // 第一个参数为true可以设置为深度复制，默认为浅复制
		this.defaluts = {
			// 是否有delete按键
			"hasDeletebutton" : false,
			// 是否有搜索框
			"hasSearch": false, // 内置filter
			// 搜索框按哪列关键字进行搜索
			"searchKey": "hobby",
			// 哪几列不进行排序
			"unSortColumn" : "1, 2"
		};
		this.opts = $.extend({}, this.defaluts, options); 

		// 初始页面渲染
		this.renderInit();
		this.renderBody();
		// 初始事件绑定
			// sort事件
		var upBtn = this.OutEle.find("span.up"),
			downbtn =this.OutEle.find("span.down");
		this.setSortEvent(upBtn, 1);
		this.setSortEvent(downbtn, -1);	
			// delete事件
		this.setDeleteEventOuter(this.OutEle);
			// Search框绑定搜索事件
		var target = this.OutEle.find("input.serInput");
		this.setSearchEvent(target, this.opts.searchKey, true, target.val()); // setSearchEvent($ele, prop, flag, contain)
	}

	createTable.prototype = {

		// **************************
		// ***** 对全局数据操作 ***** 
		// **************************

		// 向全局数组增加数据
		addData: function(data){
			var dataOut;
			// 数据校验
			dataOut = this.testData(data);
			// 数据输入
			if(dataOut !== undefined){
				this.data = this.data.concat(dataOut);
			}
		},

		// 从全局数组删除dataId的数据
		removeOneData: function(dataId){ // dataId为经过parseInt的id值
			var removeIndex;
			this.data.forEach(function(ele, index) {
				if(ele.id == dataId){
					removeIndex = index;
				}
			})

			this.data.splice(removeIndex, 1);
		},

		// 对全局数组进行过滤
		filterData: function(prop, flag, contain){ 
		// 属性，input框内容，flag表明两种filter方式，flag = false为完全符合，flag = ture为从头开始的字段符合

			this.data.forEach(function(ele, index){
				ele.isShow = false;
				if (flag && ele[prop].includes(contain, 0)) {
					// 键盘输入时，执行从开始字段吻合的筛选(不吻合不显示)
					ele.isShow = true;
				} else if (ele[prop] === contain){
					// search点击时，执行全部字段吻合的筛选(不吻合不显示)
					ele.isShow = true;
				}
			});

		},	

		// 对全局数组中元素进行排序
		sortData: function(prop, flag){

			function compare(propName, flagInner){ //升序函数
				return function(obj1, obj2){
					return (obj1[propName] - obj2[propName]) * flagInner;					
				}
			}

			// 排序。flag = 1为升序，flag = -1为降序
			if (flag == 1) {
				this.data.sort(compare(prop, flag));
			} else {
				this.data.sort(compare(prop, flag));
			}

		},	

		// ************************
		// ******* 工具方法 ******* 
		// ************************	
		// 将data中对象与this.data相比较
		testData: function(data){
		    var a = this.data[0];
		    	aProps = Object.getOwnPropertyNames(a),
		    	flag = true;
		    
		    data.forEach(function(ele, index){
		    	var bProps = Object.getOwnPropertyNames(ele);

			    for (var i = 0; i < aProps.length; i++) {

			        if(aProps.length != bProps.length || aProps[i] != bProps[i]){
			        	flag = false;
			        }
			    }
		    });

			if (!flag) {
				console.log("the input data is error");
			} else {
				return data;
			}	    		    
		},

		// ************************
		// ******* 事件绑定 ******* 
		// ************************	
		setAddEvent: function($ele, data){
			var that = this;

			// 对添加数据绑定事件
			$ele.on("click", function(){
				that.addData(data);
				that.renderBody();
			})				
		},	

		setDeleteEventOuter: function($ele){
			var that = this;

			// 对删除绑定事件
			$ele.on("click", "button", function(){
				var dataId = $(this).data("id");

				that.removeOneData(dataId);
				that.renderBody();
			})	
		},

		setSortEvent: function($ele, flag){
			var that = this;

			// 对升降序绑定事件		
			$ele.on("click", function(){
				// 找到进行排序的属性
				var prop = $(this).closest("th").data("type");	

				that.sortData(prop, flag);
				that.renderBody();
			})		
		},

		setSearchEvent: function($ele, prop, flag){
			var that = this;

			$ele.on("keyup", function(){
				that.filterData(prop, flag, $(this).val());		
				that.renderBody();
			})
		},

		// *****************************
		// ******* view:渲染页面 ******* 
		// *****************************	
		renderInit: function(){

			var keysArr = Object.keys(this.data[0]),
				headTemplate = Handlebars.compile($('#headTemplate').html()),
				content;

			// 剔除不显示的属性为id和isShow的列
			keysArr.shift();
			keysArr.pop();

			// 向模板注入参数
			content = {
				datas: keysArr,
				unSortColumn: this.opts.unSortColumn,
				hasSearch: this.opts.hasSearch,
				hasDeletebutton: this.opts.hasDeletebutton 
			};

			this.OutEle.html(headTemplate(content));
		},

		renderBody: function(){

			var bodyTemplate = Handlebars.compile($('#bodyTemplate').html()),
				content;

			// 向模板注入参数
			content = {
				datas: this.data,
				hasDeletebutton: this.opts.hasDeletebutton 
			};

			this.OutEle.find("tbody").html(bodyTemplate(content));
		}
	}
		

	var a = new createTable($(".table1"), data, {
		"hasDeletebutton": true,
		"unSortColumn": "1, 2, 3, 4",
		"hasSearch": true
	});
	var b = new createTable($(".table2"), data3);


	// table1 的添加数据事件绑定
	$(".tb1 button").on("click", function(){
		a.addData(eval($(this).data("insert")));	
		a.renderBody();
	});

	// table1 的添加数据事件绑定
	$(".tb2 button").on("click", function(){
		b.addData(eval($(this).data("insert")));	
		b.renderBody();
	});
})

// column参数为列号，array参数为含剔除列号的字符串，例如"1,2,3"
Handlebars.registerHelper('equalItem', function (column, fakeArray, options) {
	var array = fakeArray.replace(/\s/g,"").split(","),
		num = column + 1;

	if(array.indexOf(String(num)) == -1){
		return options.fn(this);
	}
});

Handlebars.registerHelper('compare2', function(left, operator, right1, right2, options) {

	var operators = {
	    "!=":  function(l, r1, r2) {return l != r1 && l != r2; },
	};

	var result = operators[operator](left, right1, right2);

	if (result) {
	    return options.fn(this);
	} else {
	    return options.inverse(this);
	}
});

Handlebars.registerHelper('compare3', function(left, operator, right, options) {

	var operators = {
	    "==":  function(l, r) {return l == r; },
	};

	var result = operators[operator](String(left), right);


	if (result) {
	    return options.fn(this);
	} else {
	    return options.inverse(this);
	}
});