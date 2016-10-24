
function gotooptions() {
   self.port.emit("showoptions");
}

function shortenurl() {
  self.port.emit("shortenurl");
}

try {
  document.getElementById("menu1").onclick = shortenurl;
  document.getElementById("menu2").onclick = gotooptions;
} catch(ex) {

}