document.addEventListener("click", function(e) {
  if (!e.target.classList.contains("menu-entry")) {
    return;
  }
  if (e.target.classList.contains("pff_gen_priv")) {
    var query = { active: true, currentWindow: true };
    chrome.tabs.query(query, function(tabs) {
      var bgPage = chrome.extension.getBackgroundPage();
      bgPage.shortenURL(false, tabs[0].url);
      window.close();
    });
  } else if (e.target.classList.contains("pff_gen_pub")) {
    var query = { active: true, currentWindow: true };
    chrome.tabs.query(query, function(tabs) {
      var bgPage = chrome.extension.getBackgroundPage();
      bgPage.shortenURL(false, tabs[0].url);
      window.close();
    });
  } else if (e.target.classList.contains("pff_settings")) {
    var openingPage = browser.runtime.openOptionsPage();
    window.close();
  }
});
