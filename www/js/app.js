$(document).ready(function(){
	document.addEventListener('deviceready', onDeviceReady, false);
});

function onDeviceReady(){	
	//Check LocalStorage for channel
	if(localStorage.channel == null || localStorage.channel == ''){
		//Ask User for Channel
		$("#popupDialog").popup("open");
	} else {
		var channel = localStorage.getItem("channel");				
	}
	
	getPlaylist(channel);
	
	$(document).on("click", "#vidlist li", function(){
		showVideo($(this).attr("videoID"));
	});
	
	$("#channelBtnOK").click(function(){
		var channel = $("#channelName").val();
		
		setChannel(channel);		
		getPlaylist(channel);
	});
	
	$("#saveOptions").click(function(){
		saveOptions();
	});
	
	$("#clearChannel").click(function(){
		clearChannel();
	});
	
	$(document).on("pageinit", "#options", function(e){
		var channel = localStorage.getItem("channel");
		var maxResults = localStorage.getItem("maxresults");
		
		$("#channelNameOptions").val(channel);
		$("#maxResultsOptions").val(maxResults);
	});
}

function getPlaylist(channel){
	$("#vidlist").html("");
	
	$.get("https://www.googleapis.com/youtube/v3/channels", {
		part: "contentDetails",
		forUsername: channel,
		key: "AIzaSyCHGQSouF3Pnc14Tc_inG-9_iFnmgcz3XI"
	},
	function(data){
		$.each(data.items, function(i, item){
			playlistId = item.contentDetails.relatedPlaylists.uploads;
			
			getVideos(playlistId, localStorage.getItem("maxresults"));
		});
	});
}

function getVideos(playlistId, maxResults){
	$.get("https://www.googleapis.com/youtube/v3/playlistItems", {
		part: "snippet",
		maxResults: maxResults,
		playlistId: playlistId,
		key: "AIzaSyCHGQSouF3Pnc14Tc_inG-9_iFnmgcz3XI"
	},
	function (data){
		$.each(data.items, function(i, item){
			id = item.snippet.resourceId.videoId;
			title = item.snippet.title;
			thum = item.snippet.thumbnails.default.url;
			$("#vidlist").append("<li videoId='"+id+"'><img src='"+thum+"' /><h3>"+title+"</h3></li>");
			$("#vidlist").listview("refresh");
		});
	});
}

function showVideo(id){
	$("#logo").hide();
	var output = '<iframe width="100%" height="250" src="https://www.youtube.com/embed/'+id+'" frameborder="0" allowfullscreen></iframe>';
	$("#showVideo").html(output);
}

function setChannel(channel){
	localStorage.setItem("channel", channel);
}

function setMaxResults(maxResults){
	localStorage.setItem("maxresults", maxResults);
}

function saveOptions(){
	var channel = $("#channelNameOptions").val();
	setChannel(channel);
	
	var maxResults = $("#maxResultsOptions").val();
	setMaxResults(maxResults);
	
	console.log("here");
	$("body").pagecontainer('change', '#main', {defaults: true});
	
	getPlaylist(channel);
}

function clearChannel(){
	localStorage.removeItem("channel");	
	$("body").pagecontainer('change', '#main', {defaults: true});
	$("#vidlist").html("");
	$("#popupDialog").popup("open");
}