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

chrome.tabs.onUpdated.addListener(function(tabID, changeInfo, tab){
	console.log("Updated: "+changeInfo.url);
	if(changeInfo.url != undefined)
	{
		var curr = JSON.parse(localStorage.getItem("bst"));
		var n = changeInfo.url.search("www.youtube.com/watch");
		if(n >= 0)
		{
			var entry = changeInfo.url.substring(n + 21);	
			var i = 1;
			var f = false;
			
			for(i = 1; i < curr.length; i++)
			{
				if(entry.localeCompare(curr[i]) == 0)
				{
					f = true;
					break;
				}
			}
			if(!f)
			{
				curr[curr.length] = entry;
				console.log(JSON.stringify(curr));
				localStorage.setItem("bst", JSON.stringify(curr));
			}
		}
	}
});