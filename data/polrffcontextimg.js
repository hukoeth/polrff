self.on("click", function (node, data) {
  self.postMessage(node.src);
});
self.on("context", function (node) {
  if (node.src) {
    return node.src.toLowerCase().startsWith("http");
  } else {
    return false;
  }
});
