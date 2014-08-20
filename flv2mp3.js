chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  	var url = request.url;
  	document.getElementById("convert_url").value = "https://www.youtube.com/?v=" + url;
	sendResponse({farewell: "recieved by cs"});
	document.getElementById("convert_convert").click();
});