var prefix="https://www.youtube.com/watch";function debug(a){chrome.extension.sendMessage({msg:a})}function save_options(){localStorage.setItem("dss",document.getElementById("dss").value);localStorage.setItem("min",document.getElementById("min").value);debug("updated")}
function delete_entries(){for(var a=document.getElementById("history").options,b="",c=0;c<a.length;c++){var d=a[a.length-1-c];d.selected||(b+=d.value+":"+d.text+"\n")}b=b.substring(0,b.length-1);window.webkitRequestFileSystem(window.TEMPORARY,1048576,function(a){a.root.getFile("yttrack.txt",{create:!0},function(a){a.createWriter(function(a){var c=new Blob([b],{type:"text/plain"});a.onwriteend=function(){0===a.length?a.write(c):updateHistory()};a.truncate(0)},errorHandler)},errorHandler)},errorHandler)}
function clear_duplicates(){window.webkitRequestFileSystem(window.TEMPORARY,1048576,extract,errorHandler)}
function extract(a){a.root.getFile("yttrack.txt",{},function(a){for(var c=[],d=0;1001>d;d++)c[d]=[];a.file(function(a){var b=new FileReader;b.onloadend=function(a){var b="";a=this.result.split("\n");for(var d=0;d<a.length;d++){for(var e=(djb2(a[d])%1001+1001)%1001,g=!0,f=0;f<c[e].length;f++)if(c[e][f]==a[d]){g=!1;break}g&&(e=c[e],e[e.length]=a[d],b+=a[d]+"\n")}for(;"\n"==b.substring(b.length-1);)b=b.substring(0,b.length-1);window.webkitRequestFileSystem(window.TEMPORARY,1048576,function(a){a.root.getFile("yttrack.txt",
{create:!0},function(a){a.createWriter(function(a){var c=new Blob([b],{type:"text/plain"});a.onwriteend=function(){0===a.length?a.write(c):updateHistory()};a.truncate(0)},errorHandler)},errorHandler)},errorHandler)};b.readAsText(a)},errorHandler)},errorHandler)}function open(){for(var a=document.getElementById("history").options,b=0;b<a.length;b++){var c=a[a.length-1-b];c.selected&&chrome.tabs.create({url:prefix+c.value})}}
function djb2(a){for(var b=5381,c=0,c=0;c<a.length;c++)b=(b<<5)+b+a.charCodeAt(c);return b}function restore_options(){document.getElementById("dss").value=localStorage.getItem("dss");document.getElementById("min").value=localStorage.getItem("min")}
function exec(){document.getElementById("save").addEventListener("click",save_options);document.getElementById("del").addEventListener("click",delete_entries);document.getElementById("clr").addEventListener("click",clear_duplicates);document.getElementById("open").addEventListener("click",open);document.getElementById("dl").addEventListener("click",download);window.addEventListener("keydown",function(a){46===a.keyCode&&delete_entries()});restore_options();updateHistory()}
function updateHistory(){window.webkitRequestFileSystem(window.TEMPORARY,1048576,onInitFs,errorHandler)}
function onInitFs(a){a.root.getFile("yttrack.txt",{},function(a){a.file(function(a){var b=new FileReader;b.onloadend=function(a){for(var b="",c=this.result.split("\n"),d=0;d<c.length;d++)if(""!==c[c.length-1-d]){a=c[c.length-1-d];var h=a.search(":"),e=a.substring(0,h);a=a.substring(h+1);b+='<option value="'+e+'">'+a+"</option>\n"}document.getElementById("history").innerHTML=b};b.readAsText(a)},errorHandler)},errorHandler)}
function download(){for(var a=document.getElementById("history").options,b=0;b<a.length;b++){var c=a[a.length-1-b];c.selected&&chrome.extension.sendMessage({msg:"generate",url:c.value.substring(3)})}}
function errorHandler(a){var b="";switch(a.code){case FileError.QUOTA_EXCEEDED_ERR:b="QUOTA_EXCEEDED_ERR";break;case FileError.NOT_FOUND_ERR:b="NOT_FOUND_ERR";break;case FileError.SECURITY_ERR:b="SECURITY_ERR";break;case FileError.INVALID_MODIFICATION_ERR:b="INVALID_MODIFICATION_ERR";break;case FileError.INVALID_STATE_ERR:b="INVALID_STATE_ERR";break;default:b="Unknown Error"}debug("Error: "+b)}document.addEventListener("DOMContentLoaded",exec);