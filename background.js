var SIZE = 101;
var CUTOFF = 5;
var curr = JSON.parse(localStorage.getItem("bst"));
var num = localStorage.getItem("num");

var currUrl;
var added = false;

/*
 * Init extensions settings after cold upgrade
 */
function initSystem()
{
	if(curr == null)
	{
		initBst();
	}

	if(num == null)
	{
		initNum();
	}

	/* Check if file exists */
	window.webkitRequestFileSystem(window.TEMPORARY, 1024*1024, onAppendInitFs, errorHandlerInit);
}
function errorHandlerInit(e)
{
	console.log("Write EH entered");
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
	};
	if(msg != '')
		console.log('Error: ' + msg);		
}

initSystem()

/*
 * Init hashtable
 */
function initBst()
{
	var curr = [];
	var i = 0;
	for(i = 0; i < SIZE; i++)
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
 * djb2 hash function
 */
function hash(str)
{
    var hash = 5381;
    var i = 0;
    for(i = 0; i < str.length; i++)
        hash = ((hash << 5) + hash) + str.charCodeAt(i);
    return hash;
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
  };

  console.log('Error: ' + msg);
}

/* 
 * Create empty resource file
 */
function onWriteInitFs(fs) {
	console.log('entered');
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
  	console.log('exitted');
}

/*
 * Append to existing resource file
 */
function onAppendInitFs(fs) {
	console.log('entered append');
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
					data += curr[i][j] +"\n";
				}
			}

			/* Reset localstorage */
			initBst();
			initNum();

			// Create a new Blob and write it to log.txt.
			var blob = new Blob([data], {type: 'text/plain'});

			fileWriter.write(blob);
	    }, errorHandler);
	}, errorHandlerInit);
  	console.log('exit append');
}

chrome.tabs.onUpdated.addListener(function(tabID, changeInfo, tab){
	console.log(changeInfo.url +"\ntitle: " + tab.title + "\nurl: " + tab.url + "\nstatus: " + tab.status + "\nhighl: "+tab.highlighted + "\nactive" + tab.active + "\n");
	if(changeInfo.url != undefined)
	{
		var curr = JSON.parse(localStorage.getItem("bst"));
		var num = parseInt(localStorage.getItem("num"));
		var n = changeInfo.url.search("www.youtube.com/watch");
		if(n >= 0)
		{
			//console.log(tab.title);
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
				localStorage.setItem("num", num + 1);
				localStorage.setItem("bst", JSON.stringify(curr));

				if(num > CUTOFF)
				{
					window.webkitRequestFileSystem(window.TEMPORARY, 1024*1024, onAppendInitFs, errorHandler);
				}
			}
		}
	}
	else
	{

	}
});