var SIZE = 101;
var CUTOFF = 20;
var curr = JSON.parse(localStorage.getItem("bst"));
var num = localStorage.getItem("num");
var dss = localStorage.getItem("dss");
var min = localStorage.getItem("min");
var q = localStorage.getItem("queue");

/*
 * Init extensions settings after cold upgrade
 */
function initSystem()
{
	if(curr === null)
		initBst();

	if(num === null)
		initNum();

	if(q === null)
		initQueue();

	if(dss !== null)
		dss = parseInt(dss);
	else
		localStorage.setItem("dss",SIZE);

	if(min !== null)
		min = parseInt(min);
	else
		localStorage.setItem("min",CUTOFF);

	q = [];
	/* Check if file exists */
	window.webkitRequestFileSystem(window.TEMPORARY, 1024*1024, onAppendInitFs, errorHandlerInit);
}
function errorHandlerInit(e)
{
	msg = '';
	switch (e.code) {
	case FileError.QUOTA_EXCEEDED_ERR:
		msg = 'QUOTA_EXCEEDED_ERR';
		break;
	case FileError.NOT_FOUND_ERR:
		window.webkitRequestFileSystem(window.TEMPORARY, 1024*1024, onWriteInitFs, errorHandler);
		break;
	case FileError.SECURITY_ERR:
		msg = 'SECURITY_ERR';
		break;
	case FileError.INVALID_MODIFICATION_ERR:
		msg = 'INVALID_MODIFICATION_ERR';
		break;
	case FileError.INVALID_STATE_ERR:
		msg = 'INVALID_STATE_ERR';
		break;
	default:
		msg = 'Unknown Error';
		break;
	}
	if(msg !== '')
		console.log('Error: ' + msg);
}

initSystem();

/*
 * Init hashtable
 */
function initBst()
{
	var LENGTH = parseInt(localStorage.getItem("dss"));
	var curr = [];
	var i = 0;
	for(i = 0; i < LENGTH; i++)
		curr[i] = [];
	localStorage.setItem("bst", JSON.stringify(curr));
}

/*
 * Init counter
 */
function initNum()
{
	localStorage.setItem("num", 0);
}

/*
 * Init queue
 */
function initQueue()
{
	localStorage.setItem("queue", JSON.stringify(["","","","",""]));
}

/*
 * djb2 hash function
 */
function djb2(str)
{
	var hash = 5381;
	var i = 0;
	for(i = 0; i < str.length; i++)
		hash = ((hash << 5) + hash) + str.charCodeAt(i);
	return hash;
}

/*
 * SHA-1 hash function
 */
function sha(str)
{
	var LENGTH = parseInt(localStorage.getItem("dss"));
	x = new BigInteger(SHA1(str), 16);
	y = new BigInteger(LENGTH.toString(16), 16);
	z = x.mod(y);
	return parseInt(z.toString(16),16);
}


/*
 * fileSystem error Handler
 */
function errorHandler(e) {
	var msg = '';

	switch (e.code) {
	case FileError.QUOTA_EXCEEDED_ERR:
		msg = 'QUOTA_EXCEEDED_ERR';
		break;
	case FileError.NOT_FOUND_ERR:
		msg = 'NOT_FOUND_ERR';
		break;
	case FileError.SECURITY_ERR:
		msg = 'SECURITY_ERR';
		break;
	case FileError.INVALID_MODIFICATION_ERR:
		msg = 'INVALID_MODIFICATION_ERR';
		break;
	case FileError.INVALID_STATE_ERR:
		msg = 'INVALID_STATE_ERR';
		break;
	default:
		msg = 'Unknown Error';
		break;
	}

	console.log('Error: ' + msg);
}

/*
 * Create empty resource file
 */
function onWriteInitFs(fs) {
	fs.root.getFile('yttrack.txt', {create: true}, function(fileEntry) {

		// Create a FileWriter object for our FileEntry (log.txt).
		fileEntry.createWriter(function(fileWriter) {

			fileWriter.onwriteend = function(e) {
				console.log('Write completed.');
			};

			fileWriter.onerror = function(e) {
				console.log('Write failed: ' + e.toString());
			};

			// Create a new Blob and write it to log.txt.
			var blob = new Blob([''], {type: 'text/plain'});

			fileWriter.write(blob);
		}, errorHandler);
	}, errorHandler);
}

/*
 * Append to existing resource file
 */
function onAppendInitFs(fs) {
	fs.root.getFile('yttrack.txt', {create: false}, function(fileEntry) {

		// Create a FileWriter object for our FileEntry (log.txt).
		fileEntry.createWriter(function(fileWriter)
				{
			fileWriter.seek(fileWriter.length); // Start write position at EOF.

			/* Get data */
			var curr = JSON.parse(localStorage.getItem("bst"));

			var data = "";
			for (i=0; i<curr.length; i++)
			{
				for(j=0; j<curr[i].length; j++)
				{
					data += curr[i][j][0] +": " + curr[i][j][1] + "\n";
				}
			}
			/* Reset localStorage */
			initBst();
			initNum();
			// Create a new Blob and write it to log.txt.
			var blob = new Blob([data], {type: 'text/plain'});

			fileWriter.write(blob);
				}, errorHandler);
	}, errorHandlerInit);
}
function update(url,title)
{
	var curr = JSON.parse(localStorage.getItem("bst"));
	var num = parseInt(localStorage.getItem("num"));
	var n = url.search("www.youtube.com/watch");
	if(n >= 0)
	{
		var entry = url.substring(n + 21);
		var f = false;

		var LENGTH = parseInt(localStorage.getItem("dss"));
		var h = ((sha(entry) % LENGTH) + LENGTH) % LENGTH;
		var hcurr = curr[h];
		for(var i = 1; i < hcurr.length; i++)
		{
			if(entry.localeCompare(hcurr[i][0]) === 0)
			{
				f = true;
				break;
			}
		}
		if(!f)
		{
			/* Remove trailing tag */
			var end = " - YouTube";
			if(title.substring(title.length-end.length).search("YouTube") >=0)
				title = title.substring(0,title.length-end.length);

			/* Update bst */
			hcurr[hcurr.length] = [entry,title];
			curr[h] = hcurr;
			localStorage.setItem("bst", JSON.stringify(curr));

			/* Update queue */
			var q = JSON.parse(localStorage.getItem("queue"));
			q.shift();
			q.push(h+" "+hcurr.length);
			localStorage.setItem("queue",JSON.stringify(q));

			/* Update num */
			localStorage.setItem("num", num + 1);

			/* Check for file dump */
			var CUT = localStorage.getItem("min");
			if(num > CUT)
			{
				window.webkitRequestFileSystem(window.TEMPORARY, 1024*1024, onAppendInitFs, errorHandler);
			}

		}
	}
}

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.msg == "updated")
			initSystem();
		else if(request.msg == "track")
			update(sender.tab.url,sender.tab.title);
		else if(request.msg == "generate")
		{
			chrome.tabs.create({active: false, pinned: true, url: "http://www.flv2mp3.com/"}, function(tab)
            {
                console.log("sent");
                var tm = function()
                {
                	send(tab.id, request.url);
                };
                setTimeout(tm, 3000);
            });
		}
		else if(request.msg == "getUrl")
		{
			var url = sender.tab.url;
			var n = url.find("download/");
			url_n = url.substring(0, n + 9) + "direct/" + url.substring(n+9);
			chrome.tabs.create({url: url_n}, function(tab)
            {
                
            });
		}
		else
			console.log(request.msg);
	});

function send(id, URL)
{
	chrome.tabs.sendMessage(id, {url: URL}, function(response) {
			console.log(chrome.runtime.lastError);
	    console.log(response.farewell);
	});
}