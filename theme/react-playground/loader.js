// React playground loader for the static mdBook site.
//
// Usage in Markdown:
//   <!-- react-playground -->
//   ```jsx
//   export default function App() { ... }
//   ```
(function () {
  "use strict";

  var scriptUrl = document.currentScript && document.currentScript.src;

  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function findExamples() {
    var root = document.querySelector("main") || document.body;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_COMMENT, null);
    var examples = [];
    var marker;

    while ((marker = walker.nextNode())) {
      if ((marker.nodeValue || "").trim() !== "react-playground") continue;

      var candidate = marker.nextSibling;
      while (candidate && candidate.nodeType === Node.TEXT_NODE && !candidate.textContent.trim()) {
        candidate = candidate.nextSibling;
      }

      if (!candidate || candidate.nodeName !== "PRE") continue;
      var code = candidate.querySelector("code");
      if (!code) continue;

      var mountPoint = document.createElement("div");
      mountPoint.className = "react-playground-mount";
      candidate.parentNode.insertBefore(mountPoint, candidate);

      examples.push({
        mountPoint: mountPoint,
        sourceBlock: candidate,
        code: code.textContent.replace(/\s+$/, "")
      });
    }

    return examples;
  }

  function showFallback(example) {
    var message = document.createElement("p");
    message.className = "react-playground-fallback";
    message.textContent =
      "Det interaktiva exemplet kunde inte laddas. Koden nedan finns kvar så att du kan köra den i din lokala Vite-app.";
    example.mountPoint.replaceWith(message);
  }

  ready(function () {
    var examples = findExamples();
    if (!examples.length || !scriptUrl) return;

    var bundleUrl = new URL("../../theme/react-playground.bundle.js", scriptUrl).href;

    import(bundleUrl)
      .then(function (module) {
        examples.forEach(function (example) {
          module.mountReactPlayground(example.mountPoint, example.code, function () {
            example.sourceBlock.hidden = true;
          });
        });
      })
      .catch(function () {
        examples.forEach(showFallback);
      });
  });
})();
