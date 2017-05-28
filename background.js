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
    var publictext = "private";
    var shortURL = orgURL;
    if (isPublic) publictext = "public";
    var opt = {
      type: "basic",
      title: "Polrff short URL",
      message: "The "+publictext+" short URL for "+orgURL+"hast been copied to the clipboard\r\n("+shortURL+")",
      iconUrl: browser.extension.getURL("icons/icon-32.png")
    }
    chrome.notifications.create("polrff", opt, function(){});
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  var getting = browser.storage.sync.get();
  getting.then(setCurrentSettings, onError);
}
