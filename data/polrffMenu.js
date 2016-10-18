var _polr_url = "";
var _polr_key = "";

self.port.on("update", function(sysData) {
  _polr_url = sysData.polrurl.toLowerCase();
  _polr_key = sysData.polrkey;
  document.getElementById("org_url").value=sysData.orgurl;
  shortenURL();
});

function shortenURL() {
  var orgUrl = document.getElementById("org_url").value.toLowerCase();
  if ((!_polr_url.startsWith("http://") && !_polr_url.startsWith("https://")) || _polr_key == "") {
    alert("You have to configure the extension first. Click on 'OK'. Press Ctrl+Shift+A to open the add-ons page. Click on 'Extensions' on the left and then on 'Options' for the extension 'polrff'.");
    return;
  }
  if (!orgUrl.startsWith("http://") && !orgUrl.startsWith("https://")) {
    document.getElementById("short_url").value="The URL you are trying to shorten is invalid";
    return;
  }
  document.getElementById("short_url").value="Please wait...";
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", function() {
    document.getElementById("short_url").value=this.responseText;
  });
  oReq.open("GET", "https://s.kiot.eu/api/v2/action/shorten?key="+_polr_key+"&url="+orgUrl);
  oReq.send();  
}

document.getElementById("shortenbutton");
document.getElementById("shortenbutton").onclick = shortenURL;