$(function(){

	/* 
	 * 从leancloud上加载内容
	 * Notebook: 是笔记本对象，有两个属性 title和numberOfNote
	 * 
	 */
	var Notebook = AV.Object.extend("Notebook");

	var NotebookModel = {};

	// 定义notebook对象, objectId是leancloud生成，作为笔记本的类名
    // 用于表明当前笔记本的信息 
	NotebookModel.notebook = {
        id: '',
        title: '',
        numberOfNote: 0,
        alive: false
    };

    // 用于存储从云端下载的所有笔记本
    NotebookModel.notebooks = [];

    // 下载云端所有当前笔记本数据
    NotebookModel.loadAll = function(callback){

    	var query = new AV.Query(Notebook);
    	query.equalTo('alive', true);
    	var notebookCollection = query.collection();

    	notebookCollection.fetch( //获取全部对象
    	{
    		success: function(collection){
    			collection.models.forEach(function (item){
    				var notebook = util.cloneNotebook(item);
    				NotebookModel.notebooks.unshift(notebook);
    			});

    			callback(false, NotebookModel.notebooks);
    		},
    		error: function(collection, error){
    			callback(error, null);
    		}

    	});

    };

    // 向云端添加当前笔记本内容
    NotebookModel.add = function(notebook, callback){
    	var notebookObj = new Notebook();
    	NotebookModel.checkNotebook(notebook);

    	notebookObj.save(notebook, //添加对象
            {
                success: function (notebook) {
                    var retNotebook = util.cloneNotebook(notebook);

                    NotebookModel.notebooks.push(retNotebook);
                    callback(null, retNotebook);
                },
                error: function (notebook, error) {
                    console.log(error);
                    callback(error, notebook);
                }
            });

    };

    // 检验传入的notebook对象的值，以免异常值的传入
    NotebookModel.checkNotebook = function(notebook){
    	notebook.title = notebook.title ||　"untitled";
    	notebook.alive = notebook.alive ||　true;
    	notebook.numberOfNote = notebook.numberOfNote || 0;
    };

    // 向云端删除当前笔记本内容
    NotebookModel.remove = function($notebook, callback){
    	console.log('remove called');
    	var query = new AV.Query(Notebook);
    	var id = $notebook.data('id'); // 注意，前面在<li>标签中data-id放置id，所以这边用.data('id')获取

    	query.get(id,  //搜索对象
    		{
    			success: function(notebookObj){
    				notebookObj.set('alive', false);
    				notebookObj.save();
    				callback(null, notebookObj);
    			},
    			error: function(notebookObj, error){
    				callback(error, notebookObj);
    			}
    		});
    }

    NotebookModel.selectNotebook = function(id){
        NotebookModel.notebook = util.findById(NotebookModel.notebooks, id);
    }

    NotebookModel.update = function(notebook, callback){
        var query = new AV.Query(Notebook);
        NotebookModel.checkNotebook(notebook);

        query.get(notebook.id, 
            {
                success: function(notebookObj){
                    notebookObj.set('numberOfNote', notebook.numberOfNote);
                    notebookObj.save()
                        .done(function (notebookObj){
                            var retNotebook = util.cloneNotebook(notebookObj);
                            
                            NotebookModel.notebooks.forEach(function (item){
                                if(item.id == retNotebook.id){
                                    item = retNotebook;
                                }
                                    
                            });
                            callback(null, retNotebook);
                        })

                        .fail(function (notebookObj, error){
                            callback(error, notebookObj);
                        });
                },
                error: function(notebookObj, error){
                    callback(error, notebookObj);
                }
            });        
    }

    var EssayModel = {};

    // 定义essay对象, objectId是leancloud生成，作为文章的类名
    EssayModel.essay = {
        title:'',
        content:'',
    ///    className:'',
        alive:false
    };

    EssayModel.essays = [];
    // 其内部对象的值
    // {
    //     id:'',
    //     title:'',
    //     content:'',
    //     paragraphBrief:'',
    //     alive:false
    // }


    // 从云端下载所有当前笔记下的文章
    EssayModel.loadAll = function(id, callback){
        console.log('load all essay');
        var notebookTitle = 'x' + id;

        var query = new AV.Query(notebookTitle);
        query.equalTo('alive', true);
        var essayCollection = query.collection();

        essayCollection.fetch( //获取全部对象
        {
            success: function(collection){
                EssayModel.essays = [];

                collection.models.forEach(function (item){
                    var essay = util.cloneEssay(item);
                    EssayModel.essays.unshift(essay);
                    
                });
                callback(false, EssayModel.essays);
            },
            error: function(collection, error){
                callback(error, null);
            }

        });       
    }

    //向云端添加当前文章内容
    EssayModel.add = function(classname, essay, callback){
        console.log('start add new essay...');
        var notebookTitle = 'x' + classname;
        EssayModel.checkEssay(essay);

        var Essay = AV.Object.extend(notebookTitle);
        var EssayObj = new Essay();

        EssayObj.save(essay,
            {
                success: function(essay){
                    var retEssay = util.cloneEssay(essay);
                    EssayModel.essays.push(retEssay);

                    callback(null, retEssay);
                },
                error: function(essay, error){
                    consloe.log(error);

                    callback(error, essay);
                }
            });
    }

    EssayModel.checkEssay = function(essay){
        essay.title = essay.title || "untitled";
        essay.content =  essay.content || "content wrong!";
        essay.alive = essay.alive || true;
    }

    EssayModel.selectEssay = function(id){
        EssayModel.essay = util.findById(EssayModel.essays, id);
    }

	window.NotebookModel = NotebookModel;
    window.EssayModel = EssayModel;




})