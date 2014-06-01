var SIZE = 101;

var curr = JSON.parse(localStorage.getItem("bst"));
if(curr == null)
{
	var curr = [];
	var i = 0;
	for(i =0; i < SIZE; i++)
		curr[i] = [];
	localStorage.setItem("bst",JSON.stringify(curr));
}

function hash(str)
{
    var hash = 5381;
    var i = 0;
    for(i=0; i<str.length; i++)
        hash = ((hash << 5) + hash) + str.charCodeAt(i);
    return hash;
}


chrome.tabs.onUpdated.addListener(function(tabID, changeInfo, tab){
	if(changeInfo.url != undefined)
	{
		var curr = JSON.parse(localStorage.getItem("bst"));
		var n = changeInfo.url.search("www.youtube.com/watch");
		if(n >= 0)
		{
			var entry = changeInfo.url.substring(n + 21);	
			var i = 1;
			var f = false;
			
			var h = ((hash(entry) % SIZE) + SIZE) % SIZE;
			var hcurr = curr[h];
			for(i = 1; i < hcurr.length; i++)
			{
				if(entry.localeCompare(hcurr[i]) == 0)
				{
					f = true;
					break;
				}
			}
			if(!f)
			{
				hcurr[hcurr.length] = entry;
				curr[hash] = hcurr;
				console.log(JSON.stringify(curr));
				localStorage.setItem("bst", JSON.stringify(curr));
			}
		}
	}
});