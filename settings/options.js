function saveOptions(e) {
  e.preventDefault();
  browser.storage.sync.set({
    polrurl: document.querySelector("#polrurl").value,
    polrapikey:  document.querySelector("#apikey").value
  });
}

function restoreOptions() {
  function setCurrentSettings(result) {
    document.querySelector("#polrurl").value = result.polrurl || "";
    document.querySelector("#apikey").value = result.polrapikey || "";
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  var getting = browser.storage.sync.get();
  getting.then(setCurrentSettings, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions); 
