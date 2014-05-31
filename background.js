var curr = JSON.parse(localStorage.getItem("bst"));
if(curr == null)
{
	var curr = [""]
	localStorage.setItem("bst",JSON.stringify(curr));
}
else
{
	curr[0] = "";
	localStorage.setItem("bst",JSON.stringify(curr));
}	

/*
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  	var s = sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension";
    console.log(s);
    if (request.greeting == "hello")
      sendResponse({farewell: s});
  });*/
/*
chrome.tabs.onUpdated.addListener(function(id, changes, tab) {
	if(tab.status = "completed")
	{
		var t = tab.url+"";
		var n = t.search("www.youtube.com");
		if(n >= 0)
		{
			var entry = t.substring(n+16);
			//console.log("Tab changed " + entry);
			var current_entry = localStorage.getItem("yt");
			console.log(current_entry);
			localStorage.setItem("yt", current_entry + "\n >" +entry);
		}
	}
});*/

chrome.webNavigation.onCommitted.addListener(function(details) {	
	if (details.frameId==0)
	{
		var tabId = details.tabId;
		var url = details.url;
		var timeStamp = details.timeStamp;

		var n = url.search("www.youtube.com/watch");
		if(n >= 0)
		{
			var entry = url.substring(n+16);

			var i = 1;
			var f = false;
			
			for(i = 1; i < curr.length; i++)
			{
				if(entry.localeCompare(curr[i]) == 0)
					f = true;
			}

			if(!f)
				curr[curr.length] = entry;
			
			localStorage.setItem("bst", JSON.stringify(curr));
			console.log(curr);
		}
	}
});
chrome.tabs.onUpdated.addListener(function(tabID, changeInfo, tab){
	console.log("Updated: "+changeInfo.url);
});