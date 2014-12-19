console.log('Initiated download.js');
function init()
{
    console.log('Sending');
    chrome.extension.sendMessage({msg: 'getUrl'});
}
init();
//window.addEventListener('DOMContentLoaded', init, false);
