var prefix = "https://www.youtube.com/watch";
function init()
{
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
  /*
  var a = q[4].search(" ");
  if(a >= 0)
  {
    var h = parseInt(q[4].substring(0,a));
    var ind = parseInt(q[4].substring(a+1));
    if(curr[h][ind])
    document.getElementById("a").innerHTML = curr[h][ind-1][1];
    document.getElementById("a").href = prefix + curr[h][ind-1][0];
  }
  var b = q[3].search(" ");
  if(b >= 0)
  {
    var h = parseInt(q[3].substring(0,b));
    var ind = parseInt(q[3].substring(b+1));
    document.getElementById("b").innerHTML = curr[h][ind-1][1];
    document.getElementById("b").href = prefix + curr[h][ind-1][0];
  }
  var c = q[2].search(" ");
  if(c >= 0)
  {
    var h = parseInt(q[2].substring(0,c));
    var ind = parseInt(q[2].substring(c+1));
    document.getElementById("c").innerHTML = curr[h][ind-1][1];
    document.getElementById("c").href = prefix + curr[h][ind-1][0];
  }
  var d = q[1].search(" ");
  if(d >= 0)
  {
    var h = parseInt(q[1].substring(0,d));
    var ind = parseInt(q[1].substring(d+1));
    document.getElementById("d").innerHTML = curr[h][ind-1][1];
    document.getElementById("d").href = prefix + curr[h][ind-1][0];
  }
  var e = q[0].search(" ");
  if(e >= 0)
  {
    var h = parseInt(q[0].substring(0,e));
    var ind = parseInt(q[0].substring(e+1));
    document.getElementById("e").innerHTML = curr[h][ind-1][1];
    document.getElementById("e").href = prefix + curr[h][ind-1][0];
  }*/
}
window.addEventListener("DOMContentLoaded", init, false);