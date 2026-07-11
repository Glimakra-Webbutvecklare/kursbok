// Interaktiva kodexempel (playground) for Glimakra Webbutvecklare - Kursbok.
//
// Larare markerar ett kodblock i Markdown med en HTML-kommentar:
//
//   <!-- playground -->        (ett kodblock, t.ex. js)
//
//   <!-- playground:start -->  (gruppera html + css + js till en forhandsvisning)
//   ...kodblock...
//   <!-- playground:end -->
//
// Tillval efter nyckelordet:
//   storage  -> kor forhandsvisningen med allow-same-origin sa localStorage fungerar.
//
// Skriptet byter ut de markerade kodblocken mot en redigerbar editor med
// "Kor"- och "Aterstall"-knappar. Forhandsvisningen koras i en sandboxad iframe.
// Editorn ar avsiktligt enkel (ingen autocomplete/AI) for modul 1-3.
(function () {
  "use strict";

  var LANG_LABELS = {
    html: "HTML",
    css: "CSS",
    js: "JavaScript",
    javascript: "JavaScript"
  };

  var tokenCounter = 0;
  var consoleTargets = {};

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function parseMarker(text) {
    if (!text) return null;
    text = text.trim();
    if (text.indexOf("playground") !== 0) return null;
    var parts = text.split(/\s+/);
    var head = parts[0];
    var kind;
    if (head === "playground") kind = "single";
    else if (head === "playground:start") kind = "start";
    else if (head === "playground:end") kind = "end";
    else return null;
    return { kind: kind, opts: parts.slice(1) };
  }

  function langOf(pre) {
    var code = pre.querySelector("code");
    if (!code) return null;
    var m = (code.className || "").match(/language-([\w-]+)/);
    return m ? m[1].toLowerCase() : null;
  }

  function codeText(pre) {
    var code = pre.querySelector("code");
    var text = code ? code.textContent : pre.textContent;
    return text.replace(/\s+$/, "");
  }

  function collectParts(pres) {
    var parts = {};
    pres.forEach(function (pre) {
      var lang = langOf(pre) || "js";
      var key = lang === "javascript" ? "js" : lang;
      if (key !== "html" && key !== "css" && key !== "js") key = "js";
      parts[key] = (parts[key] ? parts[key] + "\n" : "") + codeText(pre);
    });
    return parts;
  }

  function consoleCaptureScript(token) {
    return (
      "(function(){var T=" + JSON.stringify(token) + ";" +
      "function fmt(x){try{return (typeof x==='object'&&x!==null)?JSON.stringify(x):String(x);}catch(e){return String(x);}}" +
      "function send(t,a){try{parent.postMessage({__pg:1,token:T,type:t,text:Array.prototype.map.call(a,fmt).join(' ')},'*');}catch(e){}}" +
      "['log','info','warn','error'].forEach(function(m){var o=console[m];console[m]=function(){send(m,arguments);if(o){o.apply(console,arguments);}};});" +
      "window.addEventListener('error',function(e){send('error',[e.message]);});" +
      "})();"
    );
  }

  function autoRows(ta) {
    var lines = ta.value.split("\n").length;
    ta.rows = Math.min(26, Math.max(3, lines));
  }

  function addTabSupport(ta) {
    ta.addEventListener("keydown", function (e) {
      if (e.key === "Tab") {
        e.preventDefault();
        var start = ta.selectionStart;
        var end = ta.selectionEnd;
        ta.value = ta.value.substring(0, start) + "  " + ta.value.substring(end);
        ta.selectionStart = ta.selectionEnd = start + 2;
      }
    });
    ta.addEventListener("input", function () {
      autoRows(ta);
    });
  }

  function buildWidget(parts, opts, sourcePres) {
    var token = "pg" + ++tokenCounter;
    var hasPreview = "html" in parts || "css" in parts;
    var useStorage = opts.indexOf("storage") !== -1;

    var wrap = document.createElement("div");
    wrap.className = "playground";

    var editors = {};
    var originals = {};
    var order = ["html", "css", "js"].filter(function (k) {
      return k in parts;
    });

    order.forEach(function (key) {
      var field = document.createElement("div");
      field.className = "playground-editor";

      var label = document.createElement("div");
      label.className = "playground-label";
      label.textContent = LANG_LABELS[key] || key;

      var ta = document.createElement("textarea");
      ta.className = "playground-code";
      ta.spellcheck = false;
      ta.setAttribute("autocomplete", "off");
      ta.setAttribute("autocorrect", "off");
      ta.setAttribute("autocapitalize", "off");
      ta.setAttribute("aria-label", (LANG_LABELS[key] || key) + "-kod");
      ta.value = parts[key];
      autoRows(ta);
      addTabSupport(ta);

      originals[key] = parts[key];
      editors[key] = ta;

      field.appendChild(label);
      field.appendChild(ta);
      wrap.appendChild(field);
    });

    var bar = document.createElement("div");
    bar.className = "playground-toolbar";

    var runBtn = document.createElement("button");
    runBtn.type = "button";
    runBtn.className = "playground-btn playground-run";
    runBtn.textContent = "Kör";

    var resetBtn = document.createElement("button");
    resetBtn.type = "button";
    resetBtn.className = "playground-btn playground-reset";
    resetBtn.textContent = "Återställ";

    bar.appendChild(runBtn);
    bar.appendChild(resetBtn);
    wrap.appendChild(bar);

    var result = document.createElement("div");
    result.className = "playground-result";

    var iframe = document.createElement("iframe");
    iframe.className = "playground-preview";
    iframe.setAttribute(
      "sandbox",
      useStorage ? "allow-scripts allow-same-origin" : "allow-scripts"
    );
    iframe.setAttribute("title", "Förhandsvisning");
    if (!hasPreview) iframe.classList.add("playground-hidden-frame");

    var consoleEl = document.createElement("div");
    consoleEl.className = "playground-console";
    consoleEl.setAttribute("aria-live", "polite");
    consoleTargets[token] = consoleEl;

    result.appendChild(iframe);
    result.appendChild(consoleEl);
    wrap.appendChild(result);

    function compose() {
      var html = editors.html ? editors.html.value : "";
      var css = editors.css ? editors.css.value : "";
      var js = editors.js ? editors.js.value : "";
      return (
        '<!DOCTYPE html><html lang="sv"><head><meta charset="utf-8">' +
        "<style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;margin:12px;}" +
        css +
        "</style></head><body>" +
        html +
        "<script>" + consoleCaptureScript(token) + "<\/script>" +
        "<script>try{\n" + js + "\n}catch(e){console.error(e&&e.message?e.message:e);}<\/script>" +
        "</body></html>"
      );
    }

    function run() {
      consoleEl.innerHTML = "";
      consoleEl.classList.remove("has-output");
      iframe.srcdoc = compose();
    }

    runBtn.addEventListener("click", run);
    resetBtn.addEventListener("click", function () {
      order.forEach(function (key) {
        editors[key].value = originals[key];
        autoRows(editors[key]);
      });
      run();
    });

    var anchor = sourcePres[0];
    anchor.parentNode.insertBefore(wrap, anchor);
    sourcePres.forEach(function (pre) {
      if (pre.parentNode) pre.parentNode.removeChild(pre);
    });

    run();
  }

  function init() {
    var root = document.querySelector("main") || document.body;
    if (!root) return;

    var walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_ELEMENT,
      null,
      false
    );

    var items = [];
    var node;
    while ((node = walker.nextNode())) {
      if (node.nodeType === 8) {
        var info = parseMarker(node.nodeValue || "");
        if (info) items.push({ type: "marker", info: info, node: node });
      } else if (node.tagName === "PRE") {
        items.push({ type: "pre", node: node });
      }
    }

    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      if (it.type !== "marker") continue;

      if (it.info.kind === "single") {
        for (var j = i + 1; j < items.length; j++) {
          if (items[j].type === "marker") break;
          if (items[j].type === "pre") {
            buildWidget(collectParts([items[j].node]), it.info.opts, [items[j].node]);
            items[j].type = "used";
            break;
          }
        }
        if (it.node.parentNode) it.node.parentNode.removeChild(it.node);
      } else if (it.info.kind === "start") {
        var pres = [];
        var k = i + 1;
        for (; k < items.length; k++) {
          if (items[k].type === "pre") {
            pres.push(items[k].node);
          } else if (items[k].type === "marker") {
            break;
          }
        }
        if (pres.length) buildWidget(collectParts(pres), it.info.opts, pres);
        if (it.node.parentNode) it.node.parentNode.removeChild(it.node);
        if (k < items.length && items[k].type === "marker" && items[k].info.kind === "end") {
          if (items[k].node.parentNode) items[k].node.parentNode.removeChild(items[k].node);
          i = k;
        }
      }
    }
  }

  window.addEventListener("message", function (ev) {
    var d = ev.data;
    if (!d || d.__pg !== 1) return;
    var el = consoleTargets[d.token];
    if (!el) return;
    var line = document.createElement("div");
    line.className = "playground-log playground-log-" + d.type;
    line.textContent = d.text;
    el.appendChild(line);
    el.classList.add("has-output");
  });

  ready(init);
})();
