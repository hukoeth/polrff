chrome.contextMenus.create({
  id: "shortenpriv",
  title: "Generate private short URL",
  contexts: ["link"]
});

chrome.contextMenus.create({
  id: "shortenpub",
  title: "Generate public short URL",
  contexts: ["link"]
});

var portFromCS;

function connected(p) {
  portFromCS = p;
}

browser.runtime.onConnect.addListener(connected);

browser.contextMenus.onClicked.addListener(function(info, tab) {
  switch (info.menuItemId) {
    case "shortenpriv":
      shortenURL(false, info.linkUrl);
      break;
    case "shortenpub":
      shortenURL(true, info.linkUrl);
      break;
  }
});

function shortenURL(isPublic, orgURL) {
  function setCurrentSettings(result) {
    if ((!result.polrurl.startsWith("http://") && !result.polrurl.startsWith("https://")) || result.polrapikey == "") {
      var openingPage = browser.runtime.openOptionsPage();
      return;
    }
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", function() {
      var publictext = "private";
      var shortURL = this.responseText;
      portFromCS.postMessage({shortURL: shortURL});
      if (isPublic) publictext = "public";
      var opt = {
        type: "basic",
        title: "Polrff short URL",
        message: "The "+publictext+" short URL for "+orgURL+"hast been copied to the clipboard\r\n("+shortURL+")",
        iconUrl: browser.extension.getURL("icons/icon-32.png")
      }
      chrome.notifications.create("polrff", opt, function(){});
    });
    oReq.open("GET", result.polrurl+"/api/v2/action/shorten?key="+result.polrapikey.trim()+"&url="+encodeURIComponent(orgURL)+"&is_secret="+!isPublic);
    oReq.send();  
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  var getting = browser.storage.sync.get();
  getting.then(setCurrentSettings, onError);
}
