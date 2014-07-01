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

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  document.getElementById('dss').value = localStorage.getItem("dss");
  document.getElementById('min').value = localStorage.getItem("min");
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);

function onInitFs(fs) {

  fs.root.getFile('yttrack.txt', {}, function(fileEntry) {
  	
    // Get a File object representing the file,
    // then use FileReader to read its contents.
    fileEntry.file(function(file) {
       var reader = new FileReader();

       reader.onloadend = function(e) {
       	 var res = "";
         var txtArea = this.result;
         var arr = txtArea.split("\n");
         for(var i =0; i<arr.length; i++)
         {
         	var e = arr[arr.length-1-i];
         	var n = e.search(":");
         	var e = e.substring(n+1);
         	res += "<option value=\"" + e+"\">"+e+"</option>\n";
         }
         document.getElementById("history").innerHTML = res;
       };

       reader.readAsText(file);
    }, errorHandler);

  }, errorHandler);

}
window.webkitRequestFileSystem(window.TEMPORARY, 1024*1024, onInitFs, errorHandler);

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

  debug('Error: ' + msg);
}