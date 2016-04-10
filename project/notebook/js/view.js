$(function(){

	var NotebookView = {};

/*
*	如果为云端传来的数据，notebookData已经转换为jQuery对象，其格式为
*	{
*		id: '',
*	    title: '',
*	    numberOfNote: 0,
*	    alive: false
*	}
*/
	NotebookView.render = function($notebook, notebookData){	
		var notebookTemplate = Handlebars.compile($('#notebook-template').html()); //使用Handlebars.compile方法将模板编译为函数，生成的执行函数接受context作为参数
		if($.isArray(notebookData)){
			// 如果是数组，则渲染所有元素
			var content = {
				notebooks: notebookData
			}
			
			if(notebookData){
				$notebook.html(notebookTemplate(content));
			}else{
				$notebook.html(notebookTemplate([]));
			}

		}else{
			// 不是数组，则在结尾添加一个节点
			console.log('Add new node');
			var newLi = $('#notebookNode-template').html();
			notebookTemplate = Handlebars.compile(newLi);
			if(notebookData.id){
				newLi = notebookTemplate(notebookData); //注意，此处获得的为DOM对象
				$(newLi).prependTo($notebook);
			}
			
		}


	};

	NotebookView.update = function($notebookNode, notebookData){
		var nodeTemplate = Handlebars.compile($('#notebookNode-template').html());

		if(notebookData.id){
			$notebookNode.html($(nodeTemplate(notebookData)).html());	
		}
	}


/*
*	如果为云端传来的数据，catalogueData已经转换为jQuery对象，其格式为
*	{
*		id: '', 
*	    title: '',
*	    paragraphBrief: ''
*	}
*/
	var CreatingCatalogue = {};

	CreatingCatalogue.render = function($catalogue){
		var catalogueTemplate = Handlebars.compile($('#catalogueNew-template').html());
		var content = {
			title:'笔记标题',
			paragraphBrief:'笔记内容'
		}
		var newLi = catalogueTemplate(content);
		$(newLi).prependTo($catalogue);		
	};

	var CatalogueView = {};

	CatalogueView.render = function($catalogue, essaysData){
		var catalogueTemplate = Handlebars.compile($('#catalogue-template').html());

		var content = {
			catalogues:essaysData
		}

		if(essaysData.length){ //判断是否有文章
			$catalogue.html(catalogueTemplate(content));
		}else{
			catalogueTemplate = Handlebars.compile($('#catalogueNew-template').html());
			content = {
				title:'还没有笔记呢！',
				paragraphBrief:'快来添加新笔记吧！'
			}
			$catalogue.html(catalogueTemplate(content));
		}
	};

	var CreatingEssay = {};

	CreatingEssay.render = function(){
		$('#right .contain').hide();
		$('#right .editer').show();
		$('#right .editer').find('input').focus();
	};

	var EssayView = {};

	EssayView.render = function($essay, activeEssay){
		$('.contain').show();
		$('.editer').hide();
		var essayTemplate = Handlebars.compile($('#essay-template').html());
		$essay.html(essayTemplate(activeEssay));
	};


	window.NotebookView = NotebookView;
	window.CreatingCatalogue = CreatingCatalogue;
	window.CreatingEssay = CreatingEssay;
	window.CatalogueView = CatalogueView;
	window.EssayView = EssayView;



})