const {Cc, Ci} = require("chrome");
const {MenuButton} = require('./lib/menu-button');
var _tabs = require("sdk/tabs");
var _data = require("sdk/self").data;
var _cm = require("sdk/context-menu");
var _panels = require("sdk/panel");

// Settings
var _polr_prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService).getBranch("extensions.polrff@kiot.");
var _polr_key = "";
var _polr_url = "";

// Create context menu items for img and a nodes
_cm.Item({
  label: "Polrff: Shorten Link URL",
  context: _cm.SelectorContext("a[href]"),
  contentScriptFile: "./polrffcontexta.js",
  onMessage: function (longurl) {
    shortenURL(longurl);
  }
});
_cm.Item({
  label: "Polrff: Shorten Image Location",
  context: _cm.SelectorContext("img"),
  contentScriptFile: "./polrffcontextimg.js",
  onMessage: function (longurl) {
    shortenURL(longurl);
  }
});

// Get settings
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

// Create menu button
var button = MenuButton({
  id: 'polrff',
  label: 'Shorten URL with Polr',
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onClick: showMenu
});

// Main panel that displayes the shortened URL
var polrffMenuPanel = _panels.Panel({
  contentURL: _data.url("polrffMenu.html"),
  position: {
    right: 0,
    top: 0
  },
  width: 600,
  height: 180,
  contentScriptFile: "./polrffMenu.js"
});

// Dropdown menu panel
var polrffdd = _panels.Panel({
  contentURL: _data.url("polrffdd.html"),
  position: {
    right: 0,
    top: 0
  },
  width: 190,
  height: 60,
  contentScriptFile: "./polrffdd.js"
});

// Options panel
var polrffoptions = _panels.Panel({
  contentURL: _data.url("polrffoptions.html"),
  position: {
    right: 0,
    top: 0
  },
  width: 560,
  height: 320,
  contentScriptFile: "./polrffoptions.js"
});

// Handle buttons click event: show either dropdown menu or shorten the current URL
function showMenu(state, isMenu) {
  if (isMenu) {
    polrffdd.show();
  } else {
    shortenURL(_tabs.activeTab.url);
  }
}

// Shorten the URL
function shortenURL(longurl) {
  longurl = longurl.toLowerCase();
  // Extract real URL for search engine results (et the moment Google and Yahoo)
  longurl = ExtractSearchEngineURLs(longurl);
  getSettings();
  // Show the main panel and pass the required information (long url and settings)
  var sysData = {
    "polrurl": _polr_url,
    "polrkey" : _polr_key,
    "orgurl" : longurl
  }
  polrffMenuPanel.port.emit("update", sysData);
  polrffMenuPanel.show();
}

function ExtractSearchEngineURLs(urltoescape) {
  // Google
  var rex = /https?:\/\/(w*?\.)?google\.[a-z]*\//i;
  if (urltoescape.match(rex) && urltoescape.includes("&url=")) {
    urltoescape = urltoescape.substr(urltoescape.indexOf("&url=")+5);
    urltoescape = urltoescape.substr(0, urltoescape.indexOf("&"));
    urltoescape = decodeURIComponent(urltoescape);
    return urltoescape;
  }  
  // yahoo
  if (urltoescape.includes("r.search.yahoo.com/") && urltoescape.includes("/RU=")) {
    urltoescape = urltoescape.substr(urltoescape.indexOf("/RU=")+4);
    urltoescape = urltoescape.substr(0, urltoescape.indexOf("/RK="));
    urltoescape = decodeURIComponent(urltoescape);
    return urltoescape;
  }
  return urltoescape;
}

// Show the options panel and pass the required information (settings)
function showOptions() {
  getSettings();
  var sysData = {
    "polrurl": _polr_url,
    "polrkey" : _polr_key,
  }
  polrffoptions.port.emit("update", sysData);
  polrffoptions.show();
}

// Handle click on "Configure" dropdown menu item
polrffdd.port.on("showoptions", function() {
  showOptions();
});

// Handle click on "Shorten URL" dropdown menu item
polrffdd.port.on("shortenurl", function() {
  shortenURL(_tabs.activeTab.url);
});

// Show options if the main panel detects that they are not set correctly
polrffMenuPanel.port.on("showoptions", function() {
  showOptions();
});

// Save options from options panel
polrffoptions.port.on("saveoptions", function(myoptions) {
  _polr_prefs.setCharPref("apikey", myoptions.polrapi);
  _polr_prefs.setCharPref("polrurl", myoptions.polrurl);
});