// Interaktiv terminal (simulerad) + Learn Git Branching-inbaddning.
// For Glimakra Webbutvecklare - Kursbok.
//
// 1) Simulerad terminal - laser ett "transkript" och later studenten skriva
//    kommandona sjalv. Kommandon valideras mot det forvantade kommandot och
//    motsvarande utskrift visas. Inget korsar pa riktigt - det ar en guidad,
//    deterministisk ovning (ingen autocomplete/AI).
//
//    Markera ett kodblock med:
//
//      <!-- terminal -->
//      ```bash
//      $ git init
//      Initialized empty Git repository in /home/elev/projekt/.git/
//      $ git status
//      On branch main
//      ...
//      ```
//
//    Rader som borjar med "$ " ar kommandon. Rader darunder (till nasta "$ ")
//    ar den forvantade utskriften. Text fore forsta "$ " visas som banner.
//    Tillval: prompt=... (t.ex. <!-- terminal prompt=~/projekt -->).
//
// 2) Learn Git Branching - inbaddad visuell git-sandlada.
//
//      <!-- learngit -->
//      ```bash
//      git commit
//      git checkout -b feature
//      git commit
//      ```
//
//    Kommandona (om de finns) korsar automatiskt vid laddning. Ett kodblock ar
//    valfritt; utan det startar sandladan tom.
(function () {
  "use strict";

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
    var m = text.match(/^(terminal|learngit)\b([\s\S]*)$/);
    if (!m) return null;
    var opts = {};
    m[2]
      .trim()
      .split(/\s+/)
      .forEach(function (tok) {
        if (!tok) return;
        var eq = tok.indexOf("=");
        if (eq !== -1) opts[tok.slice(0, eq)] = tok.slice(eq + 1);
        else opts[tok] = true;
      });
    return { kind: m[1], opts: opts };
  }

  function codeLines(pre) {
    var code = pre.querySelector("code");
    var text = code ? code.textContent : pre.textContent;
    return text.replace(/\s+$/, "").split("\n");
  }

  function normalize(s) {
    return s.replace(/\s+/g, " ").trim();
  }

  function parseTranscript(lines) {
    var banner = [];
    var steps = [];
    var cur = null;
    lines.forEach(function (line) {
      var m = line.match(/^\s*\$\s?(.*)$/);
      if (m) {
        if (cur) steps.push(cur);
        cur = { cmd: m[1].trim(), output: [] };
      } else if (cur) {
        cur.output.push(line);
      } else {
        banner.push(line);
      }
    });
    if (cur) steps.push(cur);
    return { banner: banner, steps: steps };
  }

  function appendLine(screen, text, cls) {
    var line = document.createElement("div");
    line.className = "terminal-line" + (cls ? " " + cls : "");
    line.textContent = text;
    screen.appendChild(line);
    screen.scrollTop = screen.scrollHeight;
    return line;
  }

  function buildTerminal(pre, opts) {
    var data = parseTranscript(codeLines(pre));
    var steps = data.steps;
    if (!steps.length) return;

    var promptText = (opts.prompt && opts.prompt !== true ? opts.prompt : "") + "$ ";

    var wrap = document.createElement("div");
    wrap.className = "terminal";

    var screen = document.createElement("div");
    screen.className = "terminal-screen";
    screen.setAttribute("role", "log");
    screen.setAttribute("aria-live", "polite");

    var inputRow = document.createElement("div");
    inputRow.className = "terminal-input-row";

    var promptEl = document.createElement("span");
    promptEl.className = "terminal-prompt";
    promptEl.textContent = promptText;

    var input = document.createElement("input");
    input.type = "text";
    input.className = "terminal-input";
    input.setAttribute("autocomplete", "off");
    input.setAttribute("autocorrect", "off");
    input.setAttribute("autocapitalize", "off");
    input.setAttribute("spellcheck", "false");
    input.setAttribute("aria-label", "Terminalkommando");

    inputRow.appendChild(promptEl);
    inputRow.appendChild(input);

    var bar = document.createElement("div");
    bar.className = "terminal-toolbar";
    var hintBtn = document.createElement("button");
    hintBtn.type = "button";
    hintBtn.className = "playground-btn";
    hintBtn.textContent = "Tips";
    var resetBtn = document.createElement("button");
    resetBtn.type = "button";
    resetBtn.className = "playground-btn";
    resetBtn.textContent = "Återställ";
    bar.appendChild(hintBtn);
    bar.appendChild(resetBtn);

    wrap.appendChild(screen);
    wrap.appendChild(inputRow);
    wrap.appendChild(bar);

    var stepIndex = 0;
    var history = [];
    var historyPos = -1;

    function showBanner() {
      data.banner.forEach(function (line) {
        appendLine(screen, line, "terminal-output");
      });
    }

    function done() {
      return stepIndex >= steps.length;
    }

    function reset() {
      screen.innerHTML = "";
      stepIndex = 0;
      history = [];
      historyPos = -1;
      input.disabled = false;
      inputRow.style.display = "";
      showBanner();
      appendLine(screen, "Skriv kommandot nedan och tryck Enter.", "terminal-info");
      input.focus();
    }

    function handle(value) {
      var entered = value.trim();
      if (entered === "") return;
      history.push(entered);
      historyPos = history.length;
      appendLine(screen, promptText + entered, "terminal-cmd");

      if (done()) {
        appendLine(screen, "Övningen är klar - klicka Återställ för att börja om.", "terminal-info");
        return;
      }

      var step = steps[stepIndex];
      if (normalize(entered) === normalize(step.cmd)) {
        step.output.forEach(function (line) {
          appendLine(screen, line, "terminal-output");
        });
        stepIndex++;
        if (done()) {
          appendLine(screen, "✓ Klart! Du har kört alla steg i övningen.", "terminal-success");
          inputRow.style.display = "none";
        }
      } else {
        appendLine(
          screen,
          'Inte riktigt. Förväntat kommando: ' + step.cmd + '  (klicka "Tips" för att fylla i det)',
          "terminal-error"
        );
      }
    }

    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        handle(input.value);
        input.value = "";
      } else if (e.key === "ArrowUp") {
        if (history.length && historyPos > 0) {
          historyPos--;
          input.value = history[historyPos];
        }
        e.preventDefault();
      } else if (e.key === "ArrowDown") {
        if (historyPos < history.length - 1) {
          historyPos++;
          input.value = history[historyPos];
        } else {
          historyPos = history.length;
          input.value = "";
        }
        e.preventDefault();
      }
    });

    hintBtn.addEventListener("click", function () {
      if (!done()) {
        input.value = steps[stepIndex].cmd;
        input.focus();
      }
    });
    resetBtn.addEventListener("click", reset);

    pre.parentNode.insertBefore(wrap, pre);
    pre.parentNode.removeChild(pre);
    reset();
  }

  function buildLearnGit(pre, opts) {
    var commands = null;
    if (pre) {
      var lines = codeLines(pre).filter(function (l) {
        return l.trim() && l.trim().indexOf("#") !== 0;
      });
      if (lines.length) commands = lines.join("; ");
    }

    var url = "https://learngitbranching.js.org/?NODEMO";
    if (commands) url += "&command=" + encodeURIComponent(commands);

    var wrap = document.createElement("div");
    wrap.className = "learngit";

    var bar = document.createElement("div");
    bar.className = "learngit-toolbar";
    var title = document.createElement("span");
    title.className = "learngit-title";
    title.textContent = "Learn Git Branching";
    var link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.className = "learngit-link";
    link.textContent = "Öppna i ny flik ↗";
    bar.appendChild(title);
    bar.appendChild(link);

    var frame = document.createElement("iframe");
    frame.className = "learngit-frame";
    frame.setAttribute("loading", "lazy");
    frame.setAttribute("title", "Learn Git Branching");
    frame.setAttribute("sandbox", "allow-scripts allow-same-origin allow-popups");
    frame.src = url;

    wrap.appendChild(bar);
    wrap.appendChild(frame);

    var anchor = pre || wrap;
    if (pre) {
      pre.parentNode.insertBefore(wrap, pre);
      pre.parentNode.removeChild(pre);
    }
    return wrap;
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

      var pre = null;
      for (var j = i + 1; j < items.length; j++) {
        if (items[j].type === "marker") break;
        if (items[j].type === "pre") {
          pre = items[j].node;
          items[j].type = "used";
          break;
        }
      }

      if (it.info.kind === "terminal") {
        if (pre) buildTerminal(pre, it.info.opts);
      } else if (it.info.kind === "learngit") {
        buildLearnGit(pre, it.info.opts);
      }

      if (it.node.parentNode) it.node.parentNode.removeChild(it.node);
    }
  }

  ready(init);
})();
