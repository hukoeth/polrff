const {Cc, Ci} = require("chrome");
var _tabs = require("sdk/tabs");

// Settings
var _polr_prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService).getBranch("extensions.polrff@kiot.");
var _polr_key = "";
var _polr_url = "";

function getSettings() {
  try {
    _polr_key = _polr_prefs.getCharPref("apikey");
  }
  catch (ex) {
    _polr_key = "";
  }
  try {
    _polr_url = _polr_prefs.getCharPref("polrurl");
  }
  catch (ex) {
    _polr_url = "";
  }
}

var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");

// Define the menu panel
var _data = require("sdk/self").data;

var button = buttons.ActionButton({
  id: "polrff",
  label: "Shorten URL",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onClick: shortenURL
});

// Construct a panel, loading its content from the "text-entry.html"
// file in the "data" directory, and loading the "get-text.js" script
// into it.
var polrffMenuPanel = require("sdk/panel").Panel({
  contentURL: _data.url("polrffMenu.html"),
  position: {
    right: 0,
    top: 0
  },
  width: 600,
  height: 180,
  contentScriptFile: "./polrffMenu.js"
});

function shortenURL(state) {
  getSettings();
  var sysData = {
    "polrurl": _polr_url,
    "polrkey" : _polr_key,
    "orgurl" : _tabs.activeTab.url
  }
  polrffMenuPanel.port.emit("update", sysData);
  polrffMenuPanel.show();
}