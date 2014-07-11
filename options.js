var prefix = "https://www.youtube.com/watch";
function debug(m)
{
	chrome.extension.sendMessage({msg: m});
}

// Saves options to chrome.storage
function save_options() {
	localStorage.setItem("dss", document.getElementById('dss').value);
	localStorage.setItem("min", document.getElementById('min').value);
	debug('updated');
}

function delete_entries()
{
	var arr = document.getElementById('history').options;
	var res = "";
	for(var i = 0; i<arr.length; i++)
	{
		var opt = arr[arr.length-1-i];
		if(!opt.selected)
		{
			res += opt.value+":"+opt.text+"\n";
		}
	}
	res = res.substring(0,res.length-1);
	window.webkitRequestFileSystem(window.TEMPORARY, 1024*1024, function(fs)
	{
		fs.root.getFile('yttrack.txt', {create: true}, function(fileEntry) {
			fileEntry.createWriter(function(fileWriter) {
				var blob = new Blob([res], {type: 'text/plain'});
				fileWriter.onwriteend = function() {
					if (fileWriter.length === 0) {
						fileWriter.write(blob);
					}
					else
						updateHistory();
				};
				fileWriter.truncate(0);
			}, errorHandler);
		}, errorHandler);
			}, errorHandler);
}

function clear_duplicates()
{
	window.webkitRequestFileSystem(window.TEMPORARY, 1024*1024, extract, errorHandler);
}

function extract(fs) {
	fs.root.getFile('yttrack.txt', {}, function(fileEntry) {
		var tbl = [];
		for(var i=0; i<1001; i++)
			tbl[i] = [];
		fileEntry.file(function(file) 
		{
			var reader = new FileReader();
			reader.onloadend = function(e) {
				var res = "";
				var txtArea = this.result;
				var arr = txtArea.split("\n");
				for(var i = 0; i < arr.length; i++)
				{
					var ind = (djb2(arr[i]) % 1001 + 1001) % 1001;
					var flag = true;
					for(var j = 0; j < tbl[ind].length; j++)
					{
						if(tbl[ind][j] == arr[i])
						{
							flag = false;
							break;
						}
					}
					if(flag)
					{
						var a = tbl[ind];
						a[a.length] = arr[i];
						res += arr[i]+"\n";
					}
				}
				res = res.substring(0,res.length-2);
				window.webkitRequestFileSystem(window.TEMPORARY, 1024*1024, function(fs)
				{
					fs.root.getFile('yttrack.txt', {create: true}, function(fileEntry) {
						fileEntry.createWriter(function(fileWriter) {
							var blob = new Blob([res], {type: 'text/plain'});

							fileWriter.onwriteend = function() {
								if (fileWriter.length === 0) {
									fileWriter.write(blob);
								} else {
									updateHistory();
								}
							};
							fileWriter.truncate(0);
						}, errorHandler);
					}, errorHandler);
				}, errorHandler);
			};
			reader.readAsText(file);
		}, errorHandler);
	}, errorHandler);
}

function open()
{
	var arr = document.getElementById('history').options;
	for(var i = 0; i<arr.length; i++)
	{
		var opt = arr[arr.length-1-i];
		if(opt.selected)
		{
			chrome.tabs.create({url: prefix + opt.value});
		}
	}
}

function djb2(str)
{
	var hash = 5381;
	var i = 0;
	for(i = 0; i < str.length; i++)
		hash = ((hash << 5) + hash) + str.charCodeAt(i);
	return hash;
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
	document.getElementById('dss').value = localStorage.getItem("dss");
	document.getElementById('min').value = localStorage.getItem("min");
}

function exec()
{
	document.getElementById('save').addEventListener('click',
			save_options);
	document.getElementById('del').addEventListener('click',
			delete_entries);
	document.getElementById('clr').addEventListener('click',
			clear_duplicates);
	document.getElementById('open').addEventListener('click',
			open);
	window.addEventListener('keydown',
		function(e){
			if(e.keyCode === 46)
			{
				delete_entries();
			}
	});
	restore_options();
	updateHistory();
}

function updateHistory()
{
	window.webkitRequestFileSystem(window.TEMPORARY, 1024*1024, onInitFs, errorHandler);
}

function onInitFs(fs) {
	fs.root.getFile('yttrack.txt', {}, function(fileEntry) {
		fileEntry.file(function(file) {
			var reader = new FileReader();

			reader.onloadend = function(e) {
				var res = "";
				var txtArea = this.result;
				var arr = txtArea.split("\n");
				for(var i = 0; i<arr.length; i++)
				{
					if(arr[arr.length-1-i]!=="")
					{
						e = arr[arr.length-1-i];
						var n = e.search(":");
						var d = e.substring(0,n);
						e = e.substring(n+1);
						res += "<option value=\"" + d +  "\">"+e+"</option>\n";
					}
				}
				document.getElementById("history").innerHTML = res;
			};

			reader.readAsText(file);
		}, errorHandler);

	}, errorHandler);
}

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

	debug('Error: ' + msg);
}
document.addEventListener('DOMContentLoaded', exec);