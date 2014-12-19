var URL = null;
var loaded = false;
var run = false;
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    var url = request.url;
    URL = 'https://www.youtube.com/?v=' + url;
    funcRecieved();
    sendResponse({farewell: 'recieved by flv2mp3.js'});
});

function funcRecieved()
{
    if (loaded && !run)
    {
        run = true;
        document.getElementById('convert_url').value = URL;
        document.getElementById('convert_convert').click();
    }
}

function funcLoaded()
{
    loaded = true;
    if (URL !== null && !run)
    {
        run = true;
        document.getElementById('convert_url').value = URL;
        document.getElementById('convert_convert').click();
    }
}
window.addEventListener('DOMContentLoaded', funcLoaded, false);
