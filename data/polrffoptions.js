var _polr_url = "";
var _polr_key = "";

self.port.on("update", function(sysData) {
  _polr_url = sysData.polrurl.toLowerCase();
  _polr_key = sysData.polrkey;
  document.getElementById("polrurl").value=_polr_url;
  document.getElementById("apikey").value=_polr_key;
});

function saveoptions() {
  var myoptions = {
    "polrurl": document.getElementById("polrurl").value,
    "polrapi": document.getElementById("apikey").value
  }
  self.port.emit("saveoptions", myoptions);
  alert("Settings Saved");
}

document.getElementById("saveoptions").onclick = saveoptions;