function init()
{
  var curr = JSON.parse(localStorage.getItem("bst"));
  var q = JSON.parse(localStorage.getItem("queue"));
  var a = q[4].search(" ");
  if(a >= 0)
  {
    var h = parseInt(q[4].substring(0,a));
    var ind = parseInt(q[4].substring(a+1));
    document.getElementById("a").innerHTML = curr[h][ind-1][1];

  }
  var b = q[3].search(" ");
  if(b >= 0)
  {
    var h = parseInt(q[3].substring(0,b));
    var ind = parseInt(q[3].substring(b+1));
    document.getElementById("b").innerHTML = curr[h][ind-1][1];
  }
  var c = q[2].search(" ");
  if(c >= 0)
  {
    var h = parseInt(q[2].substring(0,c));
    var ind = parseInt(q[2].substring(c+1));
    document.getElementById("c").innerHTML = curr[h][ind-1][1];
  }
  var d = q[1].search(" ");
  if(d >= 0)
  {
    var h = parseInt(q[1].substring(0,d));
    var ind = parseInt(q[1].substring(d+1));
    document.getElementById("d").innerHTML = curr[h][ind-1][1];
  }
  var e = q[0].search(" ");
  if(e >= 0)
  {
    var h = parseInt(q[0].substring(0,e));
    var ind = parseInt(q[0].substring(e+1));
    document.getElementById("e").innerHTML = curr[h][ind-1][1];
  }
}
window.addEventListener("DOMContentLoaded", init, false);