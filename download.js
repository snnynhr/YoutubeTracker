function init()
{
	chrome.extension.sendMessage({msg: "getUrl"});
}
window.addEventListener("DOMContentLoaded", init, false);