$(function(){

	var util = {};

	// 将从learnCloud得到的notebook对象拷贝成我们需要的对象
	util.cloneNotebook = function(fromObj, toObj){
		toObj = toObj || {};
		toObj.id = fromObj.id;
        toObj.title = fromObj.attributes.title;
        toObj.numberOfNote = parseInt(fromObj.attributes.numberOfNote);
        toObj.alive = fromObj.attributes.alive;
		return toObj;

	}

	// 将从leanCloud得到的文章对象拷贝成我们需要的对象	
	util.cloneEssay = function(fromObj){

		var toObj = {};
		toObj.id = fromObj.id;
		toObj.title = fromObj.attributes.title;
		toObj.content = fromObj.attributes.content;
		toObj.paragraphBrief = fromObj.attributes.content.slice(0, 20);
		toObj.paragraphBrief += toObj.content.length > 20 ? '...' : '';
		toObj.alive = fromObj.attributes.alive;
		return toObj;
	}

	util.findById = function(array, id){
		return array.filter(function(item){
			return item.id == id;
		})[0];
	}

	window.util = util;

})