
var windowHeight = $(window).height();
var menuBarHeight = $("#menuBar").height();
var codeContainerHeight = windowHeight - menuBarHeight - 1;/*1为menuBar的border*/

$(".codeContainer").height(codeContainerHeight + "px");

$(".toggles").click(function (){
	$(this).toggleClass("selected"); /*有该类名则去掉，没有则添加*/
	var activeDiv = $(this).html(); /*注意在前面id的命名上，因为后面会用到这个id的值*/
	$("#" + activeDiv + "Container").toggle(); 

	var showingDivs = $(".codeContainer").filter(function() {
		return($(this).css("display")!="none");
	}).length;
	var width = 100 / showingDivs;
	$(".codeContainer").width(width + "%");

});  /*点击选择项后执行操作*/

$("#runButton").click( function() {
	$("iframe").contents().find("html").html("<style>"+$("#cssCode").val()+"</style>"+$("#htmlCode").val());
	document.getElementById("resultFrame").contentWindow.eval($("#jsCode").val());
});