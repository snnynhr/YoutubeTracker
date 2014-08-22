var prefix = "https://www.youtube.com/watch";
function debug(m)
{
    chrome.extension.sendMessage({msg: m});
}
function init()
{
    document.getElementById("d1").addEventListener('click', function(e) {
        e.stopPropagation();
        debug("jjaf");
        download(0);
    });
    document.getElementById("d2").addEventListener('click', function(e) {
        e.stopPropagation();
        download(1);
    });
    document.getElementById("d3").addEventListener('click', function(e) {
        e.stopPropagation();
        download(2);
    });
    document.getElementById("d4").addEventListener('click', function(e) {
        e.stopPropagation();
        download(3);
    });
    document.getElementById("d5").addEventListener('click', function(e) {
        e.stopPropagation();
        download(4);
    });
    document.getElementById("options").addEventListener('click',options);
    var curr = JSON.parse(localStorage.getItem("bst"));
    var q = JSON.parse(localStorage.getItem("queue"));
    var arr = ["a","b","c","d","e"];
    debug("hi");
    for(var i=0; i<5; i++)
    {
        if(q[4-i] != undefined && q[4-i].search(" ") >= 0)
        {
            var x = q[4-i].search(" ");
            document.getElementById("d"+(i+1)).classList.remove("hide");
            var h = parseInt(q[4-i].substring(0,x));
            var ind = parseInt(q[4-i].substring(x+1));
            if(curr[h][ind-1][1].length <= 999)
                document.getElementById(arr[i]).innerHTML = curr[h][ind-1][1];
            else
                document.getElementById(arr[i]).innerHTML = curr[h][ind-1][1].substring(0,999) + "...";
            document.getElementById(arr[i]).href = prefix + curr[h][ind-1][0];
        }
        else
        {
            document.getElementById("d"+(i+1)).classList.add("hide");
        }
    }
}
function options()
{
    chrome.tabs.create({url: "options.html"}, function() {});
}
function download(i)
{
    debug("pressed");
    var curr = JSON.parse(localStorage.getItem("bst"));
    var q = JSON.parse(localStorage.getItem("queue"));
    var arr = ["a","b","c","d","e"];
    var x = q[4-i].search(" ");
    if(x >= 0)
    {
        var h = parseInt(q[4-i].substring(0,x));
        var ind = parseInt(q[4-i].substring(x+1));
        // take out "?v="
        var URL = curr[h][ind-1][0].substring(3);
        var j = 0;
        while(URL[j]!='&')
            j = j + 1;
        URL = URL.substring(0, j);
        debug(URL);
        chrome.extension.sendMessage({msg: "generate", url: URL});
    }
}
window.addEventListener("DOMContentLoaded", init, false);