console.log("initiated");
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  	console.log("Recieved");
  	var url = request.url;
  	console.log(url);
  	document.getElementById("convert_url").value = "https://www.youtube.com/?v=" + url;
	sendResponse({farewell: "recieved by cs"});
	document.getElementById("convert_convert").click();
	console.log("clicked");
 });
console.log("ok");