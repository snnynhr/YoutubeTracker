var SIZE = 101;
var CUTOFF = 5;
var curr = JSON.parse(localStorage.getItem("bst"));
var num = localStorage.getItem("num");

var currInd = -1;
var oldtitle = "";
var first; //Fix first undefined problem - NYI
var valid = false;
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

	currInd = -1;
	oldtitle = "";
	first = true;
	valid = false;

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
	x = new BigInteger(SHA1(str), 16);
  	y = new BigInteger(SIZE.toString(16), 16);
  	z = x.mod(y);
	console.log(SHA1(str));
	console.log(parseInt(z.toString(16),16));
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
  };

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
			console.log("CALLED");
			/* Reset localstorage */
			initBst();
			initNum();
			currInd = -1;
			oldtitle = "";
			first = true;
			valid = false;
			// Create a new Blob and write it to log.txt.
			var blob = new Blob([data], {type: 'text/plain'});

			fileWriter.write(blob);
	    }, errorHandler);
	}, errorHandlerInit);
}

chrome.tabs.onUpdated.addListener(function(tabID, changeInfo, tab){
	//console.log(changeInfo.url +"\ntitle: " + tab.title + "\nurl: " + tab.url + "\nstatus: " + tab.status + "\nhighl: "+tab.highlighted + "\nactive" + tab.active + "\n");
	if(changeInfo.url != undefined)
	{
		var curr = JSON.parse(localStorage.getItem("bst"));
		var num = parseInt(localStorage.getItem("num"));
		var n = changeInfo.url.search("www.youtube.com/watch");
		if(n >= 0)
		{
			//console.log(tab.title);
			valid = true;
			var entry = changeInfo.url.substring(n + 21);	
			var i = 1;
			var f = false;
			
			var h = ((sha(entry) % SIZE) + SIZE) % SIZE;
			var hcurr = curr[h];
			for(i = 1; i < hcurr.length; i++)
			{
				if(entry.localeCompare(hcurr[i][0]) == 0)
				{
					f = true;
					break;
				}
			}
			if(!f)
			{
				hcurr[hcurr.length] = [entry];
				curr[hash] = hcurr;
				currInd = h;
				localStorage.setItem("num", num + 1);
				localStorage.setItem("bst", JSON.stringify(curr));

				if(num > CUTOFF)
				{
					window.webkitRequestFileSystem(window.TEMPORARY, 1024*1024, onAppendInitFs, errorHandler);
				}
			}
		}
		else
		{
			valid = false;
		}
	}
	else
	{
		//console.log(tab.title);
		if(valid && currInd != -1 && tab.title != oldtitle) /* loosen pressure on localStorage pipes */
		{
			oldtitle = tab.title;
			var curr = JSON.parse(localStorage.getItem("bst"));
			c = curr[currInd];
			c[c.length-1][1] = tab.title;
			localStorage.setItem("bst", JSON.stringify(curr));
			//console.log(c[c.length-1][0] + ", "+c[c.length-1][1]);
		}
	}
});