
$(function(){

	AV.initialize("BM6JMdNSoaC0hU8Eou3kBKYx-gzGzoHsz","SmI8XawzrS0v2zmuBupynPoI");


	var windowHeight = $(window).height();

	$("#left").height(windowHeight + "px");
	$("#center").height(windowHeight + "px");

	/*================ global variate ================*/

    var global = {};
    //global.state = "read";

    var MODALCODE = {
        duplicateNoteName: 1,
        removeNotebook: 2,
        removeNote: 3,
        previewEssay: 4
    };

    var modalCode = null;

    /*================ Controller ================*/

    // ====== 笔记本控制器，控制笔记本的行为 ======
    var NotebooksCtrl = {};

    NotebooksCtrl.init = function(){

    	NotebooksCtrl.$notebookArea = $('#notebooks');

    	// 初始化，把云端数据更新到笔记本页面
    	NotebooksCtrl.loadNotebooks(function(){
    		// 处理下载下来的笔记本
    		// 使其有更新第一个元素selected以及点击后点击元素selected的功能
    		NotebooksCtrl.set$Notebooks();
    		NotebooksCtrl.set$selectedNotebook();

    	});

    	//点击添加笔记本。失去焦点时，如果没有输入则隐藏输入框，有输入则保存
    	var $menuAddNotebook = $('.menuAddNotebook');
    	$('#left span.add').click(function(){
    		$menuAddNotebook.show().focus();
    	});

    	$menuAddNotebook.blur(menuAddNotebookBlur);

    	$menuAddNotebook.keyup(function (event){
    		if(event.keyCode == 13){
    			$menuAddNotebook.blur();
    		}
    	});

    	function menuAddNotebookBlur(event){ 
    		var $target = $(event.target);
    		if($target.val()){
    			NotebooksCtrl.addNotebook($target.val());
				$target.val('').hide();
    		}else{
    			$target.hide();
    		}
    	}

    	//点击删除笔记本，先弹出弹窗，然后再后续操作（弹窗内容此处设定）
    	$('#left span.delete').click(function(){
    		var message = {
    			title: '确定删除笔记本？',
    			content: '点击确定删除笔记本, 点击右上角的X取消删除'
    		}; 
    		modalCode = MODALCODE.removeNotebook;
    		ModalCtrl.show(message);

    	});
    	
    };

    // 在menu处输入标题，添加笔记本
    NotebooksCtrl.addNotebook = function(title){
    	var newNotebook = {
                title: title,
                numberOfNote: 0,
                alive: true
            };

        NotebookModel.add(newNotebook, addNotebookCallBack); //与NotebookModel交互。提交新增笔记本资料，返回了云端该新增笔记本数据

        function addNotebookCallBack(error, notebook){
        	if(error){
        		console.error('error');
        	}else{
        		//开始将笔记加入
        		console.log('Add notebook success...');
        		if(notebook.id){
        			NotebookView.render(NotebooksCtrl.$notebookArea, notebook);
        			NotebooksCtrl.set$Notebooks();
        			NotebooksCtrl.$notebooks.first().click();
        		}
        	}

        }
        

    };

    // 删除此时selected的笔记本
    NotebooksCtrl.removeNotebook = function(){
    	console.log('Remove notebook start...');
    	$notebooksDeleted = NotebooksCtrl.set$selectedNotebook();

    	//调用数据提交(NotebookModel交互)
    	$notebooksDeleted.each(function (index, item){
    		NotebookModel.remove($(item), removeNotebookCallBack);
    	});
    	
    	function removeNotebookCallBack(error, notebookObj){
    		if(error){
				console.error('error');
    		}else{
	    		// 直接将DOM点移除，注意selected会改变，所以需要重新调用
	    		$notebooksDeleted.remove();
	    		ModalCtrl.hide();
	    		NotebooksCtrl.set$Notebooks();
	    		NotebooksCtrl.set$selectedNotebook();    			
    		}

    	}

    };

    // 初始化时，从云端下载所有笔记本
    NotebooksCtrl.loadNotebooks = function(callback){
    	console.log('Load notebooks start...');

    	NotebookModel.loadAll(loadNotebooksCallback); //与NotebookModel交互。返回云端所有笔记本数据。

    	function loadNotebooksCallback(error, notebooks){
    		console.log('Load notebooks finish...');
    		if(error){
    			console.log('error');
    		}else{
    			NotebookView.render(NotebooksCtrl.$notebookArea, notebooks);
    		}
    		callback();
    	}
    };

    // 将所有的notebook元素选出来, 作为$notebooks, 并且为这些元素绑定点击事件
    NotebooksCtrl.set$Notebooks = function(){
    	NotebooksCtrl.$notebooks = NotebooksCtrl.$notebookArea.children();
    	if(NotebooksCtrl.$notebooks.length > 0){
    		NotebooksCtrl.$notebooks.unbind();
    		NotebooksCtrl.$notebooks.bind('click', NotebooksCtrl.clickNotebookEvent);
    	}
    }    

    // 将具有selected类的元素选出来，作为$selectedNotebook,如果没有则选择第一个(对第一个进行点击操作)
    NotebooksCtrl.set$selectedNotebook = function(){
    	NotebooksCtrl.$selectedNotebook = NotebooksCtrl.$notebookArea.children('li.selected');
    	if(NotebooksCtrl.$selectedNotebook.length == 0){
    		NotebooksCtrl.$notebooks.first().click();
    		NotebooksCtrl.$selectedNotebook = NotebooksCtrl.$notebookArea.children('li.selected');
    	}
    	return NotebooksCtrl.$selectedNotebook;
    	
    }

    // 单击notebook事件,选中当前notebook 
    NotebooksCtrl.clickNotebookEvent = function(event){
    	console.log('Click Notebook...');
    	event.preventDefault();
    	$target = $(this);
        // 添加notebook点击样式改变
    	NotebooksCtrl.$notebooks.removeClass('selected');
    	$target.addClass('selected');
        // 添加点击下载对应的笔记本信息
        NotebookModel.selectNotebook($target.data('id'));  // 得到当前NotebookModel.notebook的值
        CatalogueCtrl.loadCatalogue(NotebookModel.notebook, function(){
            CatalogueCtrl.set$catalogue();
            CatalogueCtrl.set$selectedCatalogue();
        });

    }

    // 更新笔记本的文章数
    NotebooksCtrl.updateNotebook = function(){
        // 云端更新
        NotebookModel.update(NotebookModel.notebook, function (error, notebook){
            //页面显示更新
            if(error){
                console.log('update notebook number error!');
            }else{
                NotebooksCtrl.set$selectedNotebook();
                NotebookView.update(NotebooksCtrl.$selectedNotebook, NotebookModel.notebook);
                NotebooksCtrl.set$Notebooks();            
            }

        });
    }


    // ====== 目录控制器，控制笔记添加情况 ======
    var CatalogueCtrl = {};

    CatalogueCtrl.init = function(){
        CatalogueCtrl.$catalogueArea = $('#catalogues');
        
        $('.create-essay').click(CatalogueCtrl.addCatalogue);
    	
    }

    
    // 将具有catalogue类的元素选出来，绑定点击事件
    CatalogueCtrl.set$catalogue = function(){
        CatalogueCtrl.$catalogues = $('.catalogue');
        if(CatalogueCtrl.$catalogues.length > 0){
            CatalogueCtrl.$catalogues.unbind();
            CatalogueCtrl.$catalogues.bind('click', CatalogueCtrl.clickCatalogueEvent);
        }
    }

    // 将具有selected和catalogue类的元素选出来，没有则选择第一个并执行点击
    CatalogueCtrl.set$selectedCatalogue = function(){
        CatalogueCtrl.$selectedCatalogue = $('.catalogue.selected');
        if(CatalogueCtrl.$selectedCatalogue.length == 0){
            CatalogueCtrl.$catalogues.first().click();
            CatalogueCtrl.$selectedCatalogue = $('.catalogue.selected');
        }
    }

    CatalogueCtrl.clickCatalogueEvent = function(event){
        event.preventDefault();
        $target = $(this);
        // 添加文章点击样式改变
        CatalogueCtrl.$catalogues.removeClass('selected');
        $target.addClass('selected');
        // 添加点击下载对应的文章信息
        EssayModel.selectEssay($target.data('id'));
        EssayCtrl.loadEssay();
    }

    CatalogueCtrl.addCatalogue = function(){
        //if(global.state == "read"){
        console.log('add new Catalogue');
        CatalogueCtrl.$catalogues.removeClass('selected');
        CreatingCatalogue.render(CatalogueCtrl.$catalogueArea);
        EssayCtrl.editEssay();
        //}
    }

    CatalogueCtrl.loadCatalogue = function(notebook, callback){

        if(notebook.numberOfNote == 0){
            CatalogueView.render(CatalogueCtrl.$catalogueArea, []);
            EssayCtrl.editEssay();  
            callback();          
        }else{
            EssayModel.loadAll(notebook.id, loadessaysCallback);
        }
       
        function loadessaysCallback(error, essays) {
            if(error){
                console.log('load essays error');
            }else{
                CatalogueView.render(CatalogueCtrl.$catalogueArea, essays);                 
            }
            callback();
        }
        
    }

    CatalogueCtrl.updateCatalogue = function(){
        CatalogueCtrl.set$catalogue();
        CatalogueCtrl.set$selectedCatalogue();
        CatalogueCtrl.$selectedCatalogue.data('id', EssayModel.essay.id);
    }

    // ====== 文章内容控制器，控制文章情况 ======
    var EssayCtrl = {};

    EssayCtrl.init = function(){
        EssayCtrl.$essayContain = $('.contain');
        EssayCtrl.$essayArea = $('.editer');
        EssayCtrl.$editerTitle = $('.editer input');
        EssayCtrl.$editerContent = $('.editer .editer-textarea');
        EssayCtrl.$saveIcon = $('.editerIcon-save');
        EssayCtrl.$previewIcon = $('.editerIcon-preview');

        //点击文章页面的save按键保存文章
        EssayCtrl.$saveIcon.click(EssayCtrl.saveEssay);

        //点击文章页面的preview按键预览文章
        EssayCtrl.$previewIcon.click(EssayCtrl.previewEssay);

        // 同步文章区手动输入和目录区显示
        $('.textname').bind('keyup', function(){
            var title = $(this).val() || '笔记标题';
            $('.catalogue.selected').find('h2').html(title);

        });

        $('.editer-textarea').bind('keyup', function(){
            var content = $(this).html() || '笔记内容';
            if(content.length > 20){
                content = content.slice(20) + '...';
            }
            $('.catalogue.selected').find('p').html(content);
        });

    }

    EssayCtrl.editEssay = function(){
        $('.textname').val('');
        $('.editer-textarea').html('');
        CreatingEssay.render();
    }

    EssayCtrl.saveEssay = function(){
        var newEssay = {};
        newEssay.title = EssayCtrl.$editerTitle.val();
        newEssay.content = EssayCtrl.$editerContent.text();
        newEssay.alive = true;

        EssayModel.add(NotebookModel.notebook.id, newEssay, function(error, essay){
            if(error){
                console.log('add essay error');
            }else{                
                NotebookModel.notebook.numberOfNote += 1;  // 当前还只能添加文章，而不执行删除。所以笔记本数目直接加一。
                // 将文章数目的修改提交到云端，更新本地显示的笔记本数目
                NotebooksCtrl.updateNotebook();
                // 更新当前文章信息
                EssayModel.selectEssay(essay.id);
                // 更新本地的目录栏内容
                CatalogueCtrl.updateCatalogue();
                // 更新文章内容
                EssayCtrl.loadEssay();
            }
        });

    }

    EssayCtrl.previewEssay = function(){

    }

    EssayCtrl.loadEssay = function(){
        EssayView.render(EssayCtrl.$essayContain, EssayModel.essay);
    }


    // ====== model Controller 控制弹窗行为 ======
    
    var ModalCtrl = {};

    ModalCtrl.message = {};

    ModalCtrl.init = function(){
    	ModalCtrl.$modal = $('.modal-frame');
    	ModalCtrl.$title = $('.modal-title');
    	ModalCtrl.$content = $('.modal-content');
    	ModalCtrl.$close = $('.modal-close');
    	ModalCtrl.$confirm = $('.modal-btn');
    	
    };

    ModalCtrl.show = function(message){ //此处 this == ModalCtrl;
    	this.message = message;
	    switch (modalCode) {
            // case MODALCODE.duplicateNoteName:
            //     break;
            case MODALCODE.removeNotebook:
                this.$confirm.click(NotebooksCtrl.removeNotebook);
                break;
            // case MODALCODE.removeNote:
            //     this.$confirmBtn.click(EssayCtrl.removeEssay);
            //     break;
            // case MODALCODE.previewEssay:
            //     this.$modal.addClass('modal-preview');
            //     break;
        }
        this.$modal.show();
    	this.$title.html(this.message.title);
    	this.$content.html(this.message.content);

    	this.$close.click(function(){
    		ModalCtrl.$modal.hide();
    	});

    };

    ModalCtrl.hide = function(){
    	ModalCtrl.$modal.hide();
    }

    

    window.NotebooksCtrl = NotebooksCtrl;
    window.CatalogueCtrl = CatalogueCtrl;
    window.EssayCtrl = EssayCtrl;
    window.ModalCtrl = ModalCtrl;


    // ******************* 执行区域 ******************* \\
    NotebooksCtrl.init();
    CatalogueCtrl.init(); 
    EssayCtrl.init();
    ModalCtrl.init();

    
})

