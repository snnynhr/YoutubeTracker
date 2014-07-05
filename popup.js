var prefix = "https://www.youtube.com/watch";
function init()
{
    document.getElementById("options").addEventListener('click',options);
    var curr = JSON.parse(localStorage.getItem("bst"));
    var q = JSON.parse(localStorage.getItem("queue"));
    var arr = ["a","b","c","d","e"];
    for(var i=0; i<5; i++)
    {
        var x = q[4-i].search(" ");
        if(x >= 0)
        {
            var h = parseInt(q[4-i].substring(0,x));
            var ind = parseInt(q[4-i].substring(x+1));
            if(curr[h][ind-1][1].length <= 29)
                document.getElementById(arr[i]).innerHTML = curr[h][ind-1][1];
            else
                document.getElementById(arr[i]).innerHTML = curr[h][ind-1][1].substring(0,29) + "...";
            document.getElementById(arr[i]).href = prefix + curr[h][ind-1][0];
        }
    }
}
function options()
{ 
    chrome.tabs.create({url: "options.html"}, function() {});
}
window.addEventListener("DOMContentLoaded", init, false);