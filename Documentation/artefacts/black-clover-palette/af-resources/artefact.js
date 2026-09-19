(function () {
  "use strict";

  var STORAGE_THEME = "artefact.theme";
  var STORAGE_WIDTH = "artefact.fullWidth";
  var HIGHLIGHT_CSS_PATH = "highlight/styles/atom-one-dark.min.css";
  var HIGHLIGHT_JS_PATH = "highlight/highlight.min.js";
  var THEME_NAMES = {
    clean: "Clean",
    dark: "Dark",
    original: "Original"
  };

  function getScriptElement() {
    return document.currentScript || document.getElementById("af-script");
  }

  function normaliseBase(base) {
    if (!base) {
      return "/af-resources/";
    }
    return base.slice(-1) === "/" ? base : base + "/";
  }

  function getResourceBase(script) {
    var explicit = script && script.getAttribute("data-af-resource-base");
    if (explicit) {
      return normaliseBase(explicit);
    }
    if (script && script.src) {
      return script.src.replace(/[^/]*$/, "");
    }
    return "/af-resources/";
  }

  function getDefaultTheme(script) {
    var value = script && script.getAttribute("data-af-default-theme");
    return THEME_NAMES[value] ? value : "clean";
  }

  function readStore(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function writeStore(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      // Display settings are optional; rendering should not depend on persistence.
    }
  }

  function getStoredTheme(defaultTheme) {
    var stored = readStore(STORAGE_THEME);
    return THEME_NAMES[stored] ? stored : defaultTheme;
  }

  function ensureStylesheet(id, href) {
    var link = document.getElementById(id);
    if (!link) {
      link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    if (link.getAttribute("href") !== href) {
      link.setAttribute("href", href);
    }
    return link;
  }

  function ensureScript(id, src) {
    var script = document.getElementById(id);
    if (script) {
      return script;
    }

    script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.defer = true;
    document.head.appendChild(script);
    return script;
  }

  function ensureStyle(id, text) {
    var style = document.getElementById(id);
    if (!style) {
      style = document.createElement("style");
      style.id = id;
      document.head.appendChild(style);
    }
    if (style.textContent !== text) {
      style.textContent = text;
    }
    return style;
  }

  function afterPageLoad(callback) {
    if (document.readyState === "complete") {
      callback();
    } else {
      window.addEventListener("load", callback, { once: true });
    }
  }

  function hasFontAwesome() {
    if (!document.body) {
      return false;
    }

    var probe = document.createElement("i");
    probe.className = "fa-solid";
    probe.innerHTML = "&#xf044;";
    probe.style.cssText = "position:absolute;left:-9999px;top:-9999px;font-size:16px;visibility:hidden;";
    document.body.appendChild(probe);

    var fontFamily = window.getComputedStyle(probe).fontFamily || "";
    probe.remove();

    return /Font Awesome|FontAwesome/i.test(fontFamily);
  }

  function ensureFontAwesomeAfterPageLoad() {
    afterPageLoad(function () {
      if (document.getElementById("af-fontawesome-css") || hasFontAwesome()) {
        return;
      }

      ensureStylesheet("af-fontawesome-css", window.Artefact.resourceBase + "fontawesome/css/all.min.css");
    });
  }

  function diffDisabled() {
    return document.body && document.body.classList.contains("nodiffs");
  }

  function ensureDiffScript() {
    if (diffDisabled()) {
      return;
    }

    ensureScript("af-diff-script", window.Artefact.resourceBase + "artefact-diff.js");
  }

  function highlightDisabled() {
    return document.body && document.body.classList.contains("nohighlight");
  }

  function hasCodeBlocks() {
    return Boolean(document.querySelector("pre code, pre"));
  }

  function hasHighlightStylesheet() {
    return Boolean(document.querySelector("link[href*='highlight.js'][href*='/styles/'], link[href*='highlight/styles/']"));
  }

  function getExistingHighlightScript() {
    return document.querySelector("script[src*='highlight.min.js'], script[src*='highlight.js']");
  }

  function getCodeBlocks() {
    var blocks = Array.prototype.slice.call(document.querySelectorAll("pre code"));

    Array.prototype.forEach.call(document.querySelectorAll("pre"), function (pre) {
      if (!pre.querySelector("code")) {
        blocks.push(pre);
      }
    });

    return blocks;
  }

  function highlightCodeBlocks() {
    if (!window.hljs) {
      return;
    }

    getCodeBlocks().forEach(function (block) {
      var pre = block.tagName === "PRE" ? block : block.closest("pre");

      if (pre) {
        pre.classList.add("af-code-block");
      }

      if (block.getAttribute("data-af-highlighted") === "1" || block.getAttribute("data-highlighted")) {
        return;
      }

      try {
        window.hljs.highlightElement(block);
        block.setAttribute("data-af-highlighted", "1");
      } catch (error) {
        // Syntax highlighting is progressive enhancement only.
      }
    });
  }

  function ensureHighlightOverrides() {
    ensureStyle("af-highlight-overrides", [
      "html.af-has-highlight pre.af-code-block {",
      "  background: #282c34;",
      "  border-color: #3e4451;",
      "}",
      "html.af-has-highlight pre.af-code-block > code.hljs,",
      "html.af-has-highlight pre.af-code-block.hljs {",
      "  background: transparent;",
      "  color: #abb2bf;",
      "}",
      "html.af-has-highlight pre.af-code-block > code.hljs {",
      "  display: block;",
      "  overflow-x: visible;",
      "  padding: 0;",
      "  border: 0;",
      "  border-radius: 0;",
      "  font-size: inherit;",
      "  line-height: inherit;",
      "}"
    ].join("\n"));
  }

  function ensureHighlighting() {
    var script;

    if (highlightDisabled() || !hasCodeBlocks()) {
      return;
    }

    document.documentElement.classList.add("af-has-highlight");
    ensureHighlightOverrides();

    if (!hasHighlightStylesheet()) {
      ensureStylesheet("af-highlight-css", window.Artefact.resourceBase + HIGHLIGHT_CSS_PATH);
    }

    if (window.hljs) {
      highlightCodeBlocks();
      return;
    }

    script = getExistingHighlightScript() || ensureScript("af-highlight-script", window.Artefact.resourceBase + HIGHLIGHT_JS_PATH);
    script.addEventListener("load", highlightCodeBlocks, { once: true });
  }

  function setTheme(theme) {
    if (!THEME_NAMES[theme]) {
      theme = "clean";
    }

    var html = document.documentElement;
    Object.keys(THEME_NAMES).forEach(function (name) {
      html.classList.remove("af-theme-" + name);
    });
    html.classList.add("af-theme-" + theme);
    writeStore(STORAGE_THEME, theme);

    ensureStylesheet("af-theme-css", window.Artefact.resourceBase + theme + "/theme.css");

    var select = document.getElementById("af-theme-select");
    if (select) {
      select.value = theme;
    }
  }

  function setFullWidth(enabled) {
    var on = Boolean(enabled);
    document.documentElement.classList.toggle("af-full-width", on);
    writeStore(STORAGE_WIDTH, on ? "1" : "0");

    var checkbox = document.getElementById("af-full-width-toggle");
    if (checkbox) {
      checkbox.checked = on;
    }
  }

  function setToolbarVisible(visible) {
    var toolbar = document.getElementById("af-toolbar");
    var launcher = document.getElementById("af-toolbar-launcher");

    if (toolbar) {
      toolbar.hidden = !visible;
    }
    if (launcher) {
      launcher.hidden = visible;
    }
  }

  function createPaletteIcon() {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("width", "20");
    svg.setAttribute("height", "20");
    svg.setAttribute("fill", "currentColor");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");

    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M12 3a9 9 0 0 0 0 18h1.4a2.1 2.1 0 0 0 1.5-3.6 1.2 1.2 0 0 1 .8-2.1H17a4 4 0 0 0 4-4C21 6.7 17 3 12 3Zm-4 9.2a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6Zm2.6-4a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6Zm4.4 0a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6Zm2.8 4a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6Z");
    path.setAttribute("fill", "currentColor");
    svg.appendChild(path);
    return svg;
  }

  function createToolbar(theme, fullWidth) {
    if (document.getElementById("af-toolbar")) {
      return;
    }

    document.documentElement.classList.add("af-has-toolbar");

    var toolbar = document.createElement("div");
    toolbar.id = "af-toolbar";
    toolbar.className = "af-toolbar";
    toolbar.setAttribute("role", "region");
    toolbar.setAttribute("aria-label", "Artefact display settings");

    var themeLabel = document.createElement("label");
    themeLabel.textContent = "Theme";

    var select = document.createElement("select");
    select.id = "af-theme-select";
    Object.keys(THEME_NAMES).forEach(function (key) {
      var option = document.createElement("option");
      option.value = key;
      option.textContent = THEME_NAMES[key];
      select.appendChild(option);
    });
    select.value = theme;
    select.addEventListener("change", function () {
      setTheme(select.value);
    });
    themeLabel.appendChild(select);

    var widthLabel = document.createElement("label");
    var checkbox = document.createElement("input");
    checkbox.id = "af-full-width-toggle";
    checkbox.type = "checkbox";
    checkbox.checked = fullWidth;
    checkbox.addEventListener("change", function () {
      setFullWidth(checkbox.checked);
    });
    widthLabel.appendChild(checkbox);
    widthLabel.appendChild(document.createTextNode("Fill width"));

    var dismiss = document.createElement("button");
    dismiss.type = "button";
    dismiss.className = "af-toolbar-close";
    dismiss.textContent = "x";
    dismiss.title = "Hide display settings";
    dismiss.setAttribute("aria-label", "Hide display settings");
    dismiss.addEventListener("click", function () {
      setToolbarVisible(false);
    });

    var launcher = document.createElement("button");
    launcher.id = "af-toolbar-launcher";
    launcher.type = "button";
    launcher.className = "af-toolbar-launcher";
    launcher.hidden = true;
    launcher.title = "Show display settings";
    launcher.setAttribute("aria-label", "Show display settings");
    launcher.appendChild(createPaletteIcon());
    launcher.addEventListener("click", function () {
      setToolbarVisible(true);
    });

    toolbar.appendChild(themeLabel);
    toolbar.appendChild(widthLabel);
    toolbar.appendChild(dismiss);
    document.body.appendChild(toolbar);
    document.body.appendChild(launcher);
  }

  function collapseKey(element, index) {
    var id = element.id || element.getAttribute("data-af-collapse-id") || "item-" + index;
    return "artefact.collapse." + location.pathname + "." + id;
  }

  function titleFor(element) {
    if (element.getAttribute("data-af-title")) {
      return element.getAttribute("data-af-title");
    }
    var heading = element.querySelector(":scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6");
    return heading ? heading.textContent.trim() : "Details";
  }

  function setCollapsed(element, collapsed, key) {
    var button = element.querySelector(":scope > .af-collapse-toggle");
    var content = element.querySelector(":scope > .af-collapse-content");
    element.classList.toggle("is-collapsed", collapsed);
    if (content) {
      content.hidden = collapsed;
    }
    if (button) {
      button.setAttribute("aria-expanded", collapsed ? "false" : "true");
    }
    if (key) {
      writeStore(key, collapsed ? "1" : "0");
    }
  }

  function enhanceCollapsibles() {
    var elements = Array.prototype.slice.call(document.querySelectorAll("[data-af-collapsible], .af-collapsible"));

    elements.forEach(function (element, index) {
      if (element.getAttribute("data-af-ready") === "1") {
        return;
      }
      element.setAttribute("data-af-ready", "1");      
      var key = collapseKey(element, index);
      var button = document.createElement("button");
      button.type = "button";
      button.className = "af-collapse-toggle";

      var label = document.createElement("span");
      label.className = "af-collapse-title";
      label.textContent = titleFor(element);

      var icon = document.createElement("span");
      icon.className = "af-collapse-icon";
      icon.setAttribute("aria-hidden", "true");

      button.appendChild(icon);
      button.appendChild(label);

      var content = document.createElement("div");
      content.className = "af-collapse-content";

      while (element.firstChild) {
        content.appendChild(element.firstChild);
      }

      element.appendChild(button);
      element.appendChild(content);

      var stored = readStore(key);
      var initial = stored ? stored === "1" : element.getAttribute("data-af-collapsed") !== null;
      setCollapsed(element, initial, null);

      button.addEventListener("click", function () {
        setCollapsed(element, !element.classList.contains("is-collapsed"), key);
      });
    });
  }

  function sectionForLink(link) {
    var id = (link.getAttribute("href") || "").slice(1);
    try {
      id = decodeURIComponent(id);
    } catch (error) {
      // Keep the raw fragment if it is not percent-encoded.
    }
    return id ? document.getElementById(id) : null;
  }

  function activateToc() {
    var links = Array.prototype.slice.call(document.querySelectorAll("aside.toc a[href^='#']"));
    var sections = links
      .map(sectionForLink)
      .filter(Boolean);

    if (!links.length || !sections.length) {
      return;
    }

    function activate() {
      var current = sections[0];
      sections.forEach(function (section) {
        if (section.getBoundingClientRect().top <= 120) {
          current = section;
        }
      });
      links.forEach(function (link) {
        link.classList.toggle("active", link.getAttribute("href") === "#" + current.id);
      });
    }

    document.addEventListener("scroll", activate, { passive: true });
    activate();
  }

  function setTocOpen(open) {
    var on = Boolean(open);
    var html = document.documentElement;
    var button = document.getElementById("af-toc-toggle");

    html.classList.toggle("af-toc-open", on);
    if (button) {
      button.setAttribute("aria-expanded", on ? "true" : "false");
      button.title = on ? "Hide contents" : "Show contents";
      button.setAttribute("aria-label", on ? "Hide contents" : "Show contents");
    }
  }

  function initMobileToc() {
    var toc = document.querySelector("aside.toc");
    var button;
    var backdrop;

    if (!toc || document.getElementById("af-toc-toggle")) {
      return;
    }

    if (!toc.id) {
      toc.id = "af-toc";
    }

    document.documentElement.classList.add("af-has-mobile-toc");

    button = document.createElement("button");
    button.id = "af-toc-toggle";
    button.type = "button";
    button.className = "af-toc-toggle";
    button.title = "Show contents";
    button.setAttribute("aria-label", "Show contents");
    button.setAttribute("aria-controls", toc.id);
    button.setAttribute("aria-expanded", "false");
    button.innerHTML = "<i class='fa-solid' aria-hidden='true'>&#xf0c9;</i>";
    button.addEventListener("click", function () {
      setTocOpen(!document.documentElement.classList.contains("af-toc-open"));
    });

    backdrop = document.createElement("button");
    backdrop.type = "button";
    backdrop.className = "af-toc-backdrop";
    backdrop.tabIndex = -1;
    backdrop.setAttribute("aria-label", "Hide contents");
    backdrop.addEventListener("click", function () {
      setTocOpen(false);
    });

    document.body.appendChild(button);
    document.body.appendChild(backdrop);

    toc.addEventListener("click", function (event) {
      var target = event.target;
      if (target && target.closest && target.closest("a[href^='#']")) {
        setTocOpen(false);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        setTocOpen(false);
      }
    });
  }

  /* ============================================================
     ANNOTATION MODULE
     readStore / writeStore are shared with the core module above.
  ============================================================ */

  var ANNOTATABLE = "p,h1,h2,h3,h4,h5,h6,pre,td,th,.cue,.note,.warning,.danger,[data-af-annotatable]";

  /* ---- State ---- */
  var annotationMode = false;
  var annotations    = new Map();   // element -> comment string
  var activePopup    = null;
  var hoveredEl      = null;
  var hideTimer      = null;        // debounce handle for marker hide

  var SVG_FILLED  = '<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';

  /* ---- Helpers ---- */

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function ensureIds() {
    var idx = 0;
    document.querySelectorAll(ANNOTATABLE).forEach(function (el) {
      if (!el.dataset.afAnnId) {
        el.dataset.afAnnId = "ann-" + (++idx);
      }
    });
  }

  function cleanOuterHtml(el) {
    var clone = el.cloneNode(true);
    clone.removeAttribute("data-af-ann-id");
    clone.removeAttribute("data-af-ann-listeners");
    clone.classList.remove("af-ann-target");
    clone.querySelectorAll(".af-ann-marker, .af-ann-popup").forEach(function (n) {
      n.parentNode && n.parentNode.removeChild(n);
    });
    return clone.outerHTML;
  }

  /* ---- Marker button ---- */

  function getOrCreateMarker(el) {
    // For pre, the marker is owned by the parent to avoid overflow clipping.
    // We store a reference on the element via a JS property instead of querying the DOM.
    if (el._afMarker) return el._afMarker;

    var isCode = el.tagName === "PRE";
    var markerParent = isCode ? (el.parentElement || el) : el;

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "af-ann-marker" + (isCode ? " af-ann-marker-code" : "");
    btn.setAttribute("aria-label", "Add annotation");
    btn.innerHTML = "<i class='fa-regular'>&#xf075;</i>";

    btn.addEventListener("mouseenter", onMarkerEnter);
    btn.addEventListener("mouseleave", onMarkerLeave);
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      openPopup(el);
    });

if (isCode) {
      var wrapper = el.parentElement;
      if (!wrapper || !wrapper.classList.contains("af-ann-pre-wrap")) {
        wrapper = document.createElement("div");
        wrapper.className = "af-ann-pre-wrap";
        var cs = window.getComputedStyle(el);
        wrapper.style.marginTop    = cs.marginTop;
        wrapper.style.marginBottom = cs.marginBottom;
        wrapper.style.marginLeft   = cs.marginLeft;
        wrapper.style.marginRight  = cs.marginRight;
        el.style.margin = "0";
        el.parentNode.insertBefore(wrapper, el);
        wrapper.appendChild(el);
      }
      wrapper.appendChild(btn);
      el._afMarker = btn;
      btn._afTarget = el;
    } else {
      el.insertBefore(btn, el.firstChild);
      el._afMarker = btn;
      btn._afTarget = el;
    }
    return btn;
}

  function showMarker(el) {
    if (!annotationMode) return; // never show outside edit mode
    var marker = getOrCreateMarker(el);
    var hasComment = annotations.has(el) && annotations.get(el).trim() !== "";
    marker.innerHTML = hasComment ?  "<i class='fa-solid'>&#xf4ad;</i>" : "<i class='fa-regular'>&#xf075;</i>";
    marker.setAttribute("aria-label", hasComment ? "Edit annotation" : "Add annotation");
    marker.style.display = "flex";
    // For pre/code markers, also make the wrapper position:relative
    if (el._afMarker && (el.tagName === "PRE")){
      var wrap = el.parentElement;
      if (wrap && wrap.classList.contains("af-ann-pre-wrap")) {
        wrap.style.position = "relative";
      }
    }
  }

  function hideMarker(el) {
    // Keep visible if the element has a saved comment
    if (annotations.has(el) && annotations.get(el).trim()) return;
    var marker = el._afMarker || el.querySelector(":scope > .af-ann-marker");
    if (marker) marker.style.display = "none";
  }

  function refreshAllMarkers() {
    annotations.forEach(function (comment, el) {
      var marker = el._afMarker;
      if (!marker) return;
      var hasComment = comment && comment.trim() !== "";
      marker.innerHTML = hasComment ? "<i class='fa-solid'>&#xf4ad;</i>" : "<i class='fa-regular'>&#xf075;</i>";
      if (hasComment) {
        marker.style.display = annotationMode ? "flex" : "none";
        el.classList.add("af-ann-has-comment");
      } else {
        marker.style.display = "none";
      }
    });
    // Also sweep any DOM markers not in annotations map
    document.querySelectorAll(".af-ann-marker").forEach(function (marker) {
      var el = marker._afTarget || marker.parentElement;
      if (!el) return;
      if (!annotations.has(el) || !annotations.get(el).trim()) {
        marker.style.display = "none";
        el.classList.remove("af-ann-has-comment");
      }
    });
  }

  /* ---- Hover listeners ---- */

  function onElementEnter(e) {
    if (!annotationMode) return;
    clearTimeout(hideTimer);
    var el = e.currentTarget;
    if (hoveredEl && hoveredEl !== el) {
      hideMarker(hoveredEl);
    }
    hoveredEl = el;
    showMarker(el);
  }

  function onElementLeave(e) {
    if (!annotationMode) return;
    var el = e.currentTarget;
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function () {
      hoveredEl = null;
      hideMarker(el);
    }, 120);
  }

  function onMarkerEnter() {
    clearTimeout(hideTimer);
  }

    function onMarkerLeave(e) {
    if (!annotationMode) return;
    var marker = e.currentTarget;
    var el = marker._afTarget || marker.parentElement;
    if (!el) return;
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function () {
      if (hoveredEl !== el) {
        hideMarker(el);
      }
    }, 100);
  }

  function attachListeners(el) {
    if (el.dataset.afAnnListeners === "1") return;
    el.dataset.afAnnListeners = "1";
    el.addEventListener("mouseenter", onElementEnter);
    el.addEventListener("mouseleave", onElementLeave);
  }

  /* ---- Popup ---- */

  function closePopup() {
    if (activePopup) {
      activePopup.remove();
      activePopup = null;
    }
    document.removeEventListener("mousedown", onOutsideMousedown);
    document.querySelectorAll(".af-ann-target").forEach(function (el) {
      el.classList.remove("af-ann-target");
    });
  }

  function openPopup(el) {
    closePopup();
    el.classList.add("af-ann-target");

    var existing = annotations.get(el) || "";

    var popup = document.createElement("div");
    popup.className = "af-ann-popup";
    popup.setAttribute("role", "dialog");
    popup.setAttribute("aria-label", "Annotation editor");

    var label = document.createElement("div");
    label.className = "af-ann-popup-label";
    label.textContent = "Leave a comment";

    var textarea = document.createElement("textarea");
    textarea.className = "af-ann-popup-textarea";
    textarea.rows = 3;
    textarea.placeholder = "Type your comment... (Ctrl+Enter to save, Esc to cancel)";
    textarea.value = existing;

    var row = document.createElement("div");
    row.className = "af-ann-popup-actions";

    var saveBtn = document.createElement("button");
    saveBtn.type = "button";
    saveBtn.className = "af-ann-btn af-ann-btn-primary";
    saveBtn.textContent = "Save";

    var cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.className = "af-ann-btn af-ann-btn-ghost";
    cancelBtn.textContent = existing ? "Remove" : "Cancel";

    saveBtn.addEventListener("click", function () {
      var text = textarea.value.trim();
      if (text) {
        annotations.set(el, text);
      } else {
        annotations.delete(el);
      }
      refreshAllMarkers();
      updateCopyButton();
      closePopup();
    });

    cancelBtn.addEventListener("click", function () {
      if (existing) {
        annotations.delete(el);
        refreshAllMarkers();
        updateCopyButton();
      }
      closePopup();
    });

    textarea.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { closePopup(); }
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { saveBtn.click(); }
    });

    row.appendChild(saveBtn);
    row.appendChild(cancelBtn);
    popup.appendChild(label);
    popup.appendChild(textarea);
    popup.appendChild(row);

    var targetEl = el;
    if (el.tagName === "PRE") {
      var wrap = el.parentElement;
      if (wrap && wrap.classList.contains("af-ann-pre-wrap")) {
        targetEl = wrap;
      }
    }

    var rect = targetEl.getBoundingClientRect();
    popup.style.position = "absolute";
    popup.style.top  = (rect.bottom + window.scrollY + 6) + "px";
    popup.style.left = (rect.left  + window.scrollX) + "px";
    popup.style.zIndex = "9999";

    document.body.appendChild(popup);
    activePopup = popup;

    
    setTimeout(function () {
      document.addEventListener("mousedown", onOutsideMousedown);
    }, 0);

    textarea.focus();
  }

  function onOutsideMousedown(e) {
    if (activePopup && !activePopup.contains(e.target)) {
      closePopup();
    }
  }

  /* ---- Enable / Disable annotation mode ---- */

  function enableAnnotations() {
    if (annotationMode) return;
    annotationMode = true;
    ensureIds();
    document.documentElement.classList.add("af-annotation-mode");
    document.querySelectorAll(ANNOTATABLE).forEach(function (el) {
      attachListeners(el);
      if (annotations.has(el) && annotations.get(el).trim()) {
        showMarker(el);
      }
    });
    updateToggleButton(true);
  }

  function disableAnnotations() {
    if (!annotationMode) return;
    annotationMode = false;
    closePopup();
    document.documentElement.classList.remove("af-annotation-mode");
    document.querySelectorAll(".af-ann-marker").forEach(function (marker) {
      marker.style.display = "none";
    });
    updateToggleButton(false);
  }

  function toggleAnnotations() {
    annotationMode ? disableAnnotations() : enableAnnotations();
  }

  /* ---- Markdown export ---- */

  function exportMarkdown() {
    var url = location.href;
    var lines = [
      "@aibot Please modify " + url + "\n",
      "as per the comments below:\n"
    ];
    annotations.forEach(function (comment, el) {
      if (!comment.trim()) return;
      lines.push("```html\n" + cleanOuterHtml(el) + "\n```");
      lines.push("COMMENT: " + comment.trim() + "\n");
    });
    return lines.join("\n");
  }

  function copyToClipboard() {
    var md = exportMarkdown();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(md).then(function () { return true; }, function () { return false; });
    }
    var ta = document.createElement("textarea");
    ta.value = md;
    ta.style.cssText = "position:fixed;opacity:0;top:0;left:0;pointer-events:none;";
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) {}
    ta.remove();
    return Promise.resolve(ok);
  }

  /* ---- Toolbar buttons ---- */
  // NOTE: #af-toolbar is guaranteed to exist at this point because
  // createToolbar() is called in init() before initAnnotations().

  function updateToggleButton(active) {
    var btn = document.getElementById("af-ann-toggle");
    if (!btn) return;
    btn.innerHTML = active ? "<i class='fa-solid'>&#xf0c8;</i> Stop" : "<i class='fa-solid'>&#xf044;</i> Edit";
    btn.setAttribute("aria-pressed", active ? "true" : "false");
    btn.classList.toggle("af-ann-active", active);

    // Show Copy Edits button only while annotation mode is on
    var copyBtn = document.getElementById("af-ann-copy");
    if (copyBtn) copyBtn.style.display = active ? "block" :"none";
  }

  function updateCopyButton() {
    var btn = document.getElementById("af-ann-copy");
    if (!btn) return;
    var count = 0;
    annotations.forEach(function (v) { if (v && v.trim()) count++; });
    btn.disabled = count === 0;
    btn.title = count
      ? "Copy " + count + " annotation" + (count === 1 ? "" : "s") + " as Markdown"
      : "No annotations yet";
  }

  function injectAnnotationToolbarButtons() {
    // #af-toolbar is always present (created by createToolbar in init)
    var toolbar = document.getElementById("af-toolbar");

    var sep = document.createElement("span");
    sep.className = "af-ann-sep";
    sep.setAttribute("aria-hidden", "true");

    var toggleBtn = document.createElement("button");
    toggleBtn.id = "af-ann-toggle";
    toggleBtn.type = "button";
    toggleBtn.className = "af-ann-btn af-ann-btn-edit";
    toggleBtn.innerHTML = "<i class='fa-solid'>&#xf044;</i> Edit";
    toggleBtn.setAttribute("aria-pressed", "false");
    toggleBtn.addEventListener("click", function () {
      toggleAnnotations();
      updateCopyButton();
    });

    // copy edits hidden by default; shown via updateToggleButton when edit mode is on
    var copyBtn = document.createElement("button");
    copyBtn.id = "af-ann-copy";
    copyBtn.type = "button";
    copyBtn.className = "af-ann-btn af-ann-btn-copy";
    copyBtn.style.display  = "none";
    copyBtn.disabled = true;
    copyBtn.title = "No annotations yet";
    copyBtn.innerHTML = "<i class='fa-solid'>&#xf0c5;</i> Copy Edits";
    copyBtn.addEventListener("click", function () {
      copyToClipboard().then(function (ok) {
        var orig = copyBtn.innerHTML;
        copyBtn.innerHTML = ok ? "Copied <i class='fa-solid'>&#xf00c;</i>" : "Failed <i class='fa-solid'>&#xf00d;</i>"; 
        setTimeout(function () { copyBtn.innerHTML = orig; }, 2000);
      });
    });

    // Prepend: toggleBtn | sep | copyBtn | [existing toolbar content]
    toolbar.insertBefore(copyBtn, toolbar.firstChild);
    toolbar.insertBefore(sep, toolbar.firstChild);
    toolbar.insertBefore(toggleBtn, toolbar.firstChild);
  }

  /* ---- Styles ---- */

  function injectAnnotationStyles() {
    if (document.getElementById("af-ann-styles")) return;
    var s = document.createElement("style");
    s.id = "af-ann-styles";
    s.textContent = [
        "/* ---- Toolbar additions ---- */",
        ".af-ann-sep { display: inline-block; width: 1px; height: 1.1em; background: currentColor; opacity: .2; margin: 0 .3rem; vertical-align: middle; }",
        ".af-ann-btn { display: inline-flex; align-items: center; gap: .3em;padding:0.12rem 0.5rem; border-radius: 4px; font-size: .82rem; font-family: inherit; cursor: pointer; border: 1px solid transparent; line-height: 1.4; transition: background .15s, color .15s, opacity .15s; white-space: nowrap; }",
        ".af-ann-btn:disabled { opacity: .4; cursor: default; pointer-events: none; }",
        ".af-ann-btn-edit { background: #faf9f7f2; color: #26221d;border: 1px solid rgba(38, 34, 29, 0.2); }",
        ".af-ann-btn-edit:hover { background: #f4efe7; }",
        ".af-ann-btn-edit.af-ann-active { background: #c0392b; border-color: #c0392b; color: #fff; }",
        ".af-ann-btn-edit.af-ann-active:hover { background: #a93226; }",
        ".af-ann-btn-copy { background: transparent; color: inherit; border-color: rgba(127,127,127,.4); opacity: .8; }",
        ".af-ann-btn-copy:not(:disabled):hover { opacity: 1; background: rgba(0,0,0,.06); }",
        ".af-ann-btn-primary { background: #f3f0e6; color: #3d3e40; border-color: #b0a68d; font-size: .8rem; padding: .25em .65em;}",
        ".af-ann-btn-primary:hover { background: #b0a68d; color:#ffffff;}",
        ".af-ann-btn-ghost { background: transparent; color: inherit; border-color: rgba(127,127,127,.4); opacity: .65; font-size: .8rem; padding: .25em .65em; }",
        ".af-ann-btn-ghost:hover { opacity: 1; }",
        "/* ---- Annotation mode positioning ---- */",
        ".af-annotation-mode p, .af-annotation-mode h1, .af-annotation-mode h2, .af-annotation-mode h3, .af-annotation-mode h4, .af-annotation-mode h5, .af-annotation-mode h6, .af-annotation-mode li, .af-annotation-mode blockquote, .af-annotation-mode td, .af-annotation-mode th, .af-annotation-mode dt, .af-annotation-mode dd, .af-annotation-mode figcaption, .af-annotation-mode caption, .af-annotation-mode summary, .af-annotation-mode code, .af-annotation-mode .cue, .af-annotation-mode .note, .af-annotation-mode .warning, .af-annotation-mode .danger, .af-annotation-mode [data-af-annotatable] { position: relative; }",      "/* ---- Cursor hint ---- */",
        ".af-annotation-mode p, .af-annotation-mode h1, .af-annotation-mode h2, .af-annotation-mode h3, .af-annotation-mode h4, .af-annotation-mode h5, .af-annotation-mode h6, .af-annotation-mode li, .af-annotation-mode blockquote, .af-annotation-mode pre, .af-annotation-mode code, .af-annotation-mode .cue, .af-annotation-mode .note, .af-annotation-mode .warning, .af-annotation-mode .danger, .af-annotation-mode [data-af-annotatable] { cursor: default; }",
        "/* ---- Marker button ---- */",
        ".af-ann-marker { display: none; position: absolute;left: -2em;top: 0.1em; width: 1.45rem; height: 1.45rem; padding: 0; align-items: center; justify-content: center; border: 0; border-radius: 0; background: transparent; color: #26221d; box-shadow: none; cursor: pointer; z-index: 8; transition: color .15s ease, transform .15s ease; appearance: none; -webkit-appearance: none; }",
        ".af-ann-marker:hover { background: transparent; color: #c0392b; transform: scale(1.12); box-shadow: none; }",
        "/* ---- Wrapper for pre so marker is not a child of pre ---- */",
        "section .af-ann-pre-wrap > .af-ann-marker { left: -1em; }",
        "table tbody tr > td .af-ann-marker, thead tr > th .af-ann-marker, tbody tr > th .af-ann-marker { right: 0; left:unset; }",
        "section .af-collapse-content p .af-ann-marker { left: -1em; top : -1em }",
        ".af-ann-pre-wrap { position: relative; display: block; margin: 0; padding: 0; }",
        ".af-ann-pre-wrap > pre { margin: 0 !important; }",
        ".af-ann-pre-wrap > .af-ann-marker { display: none; }",
        "/* pre overflow - wrapper clips nothing, marker sits outside */",
        ".af-annotation-mode pre > .af-ann-marker, .af-annotation-mode code > .af-ann-marker { left: auto; right: .4rem; top: .4rem; }",
        // CHANGE 3: removed background and border-left from annotated element highlight
        "/* ---- Annotated element highlight (marker icon only - no background or border) ---- */",
        "/* .af-annotation-mode .af-ann-has-comment { } */",
        ".af-ann-marker.af-ann-marker--filled { color: #e67e22; background: rgba(230,126,34,.12); }",
        ".af-ann-marker.af-ann-marker--filled:hover { background: #e67e22; color: #fff; }",
        "/* ---- Target highlight ---- */",
        ".af-ann-target { outline: 2px dashed #b0a68d; outline-offset: 2px; }",
        "/* ---- Popup ---- */",
        ".af-ann-popup { position: absolute; left: 0; top: calc(100% + .35rem); z-index: 999; width: 22rem; max-width: min(22rem, 90vw); background: #fff; color: #222; border: 1px solid #d0d0d0; border-radius: 7px; box-shadow: 0 6px 24px rgba(0,0,0,.14), 0 1px 4px rgba(0,0,0,.18); padding: .8rem; box-sizing: border-box; }",
        "@media (prefers-color-scheme: dark) { .af-ann-popup { background: #1e1e1e; color: #e0e0e0; border-color: #3a3a3a; } }",
        ".af-ann-popup-label { font-size: .7rem; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: #999; margin-bottom: .45rem; font-family: system-ui, sans-serif; }",
        ".af-ann-popup-textarea { width: 100%; resize: vertical; padding: .5rem; border: 1px solid #ccc; border-radius: 4px; font-family: inherit; font-size: .85rem; background: transparent; color: inherit; box-sizing: border-box; min-height: 4.5rem; line-height: 1.5; }",
        ".af-ann-popup-textarea:focus { outline: 2px solid #b0a68d; border-color: transparent; }",
        ".af-ann-popup-actions { display: flex; gap: .5rem; justify-content: flex-end; margin-top: .55rem; }"
    ].join("\n");
    document.head.appendChild(s);
  }

  /* ---- Boot ---- */

  function initAnnotations() {
    injectAnnotationStyles();
    injectAnnotationToolbarButtons();
  }

  /* ============================================================
     CORE BOOT
  ============================================================ */

  function init() {
    var script = getScriptElement();
    var defaultTheme = getDefaultTheme(script);
    var theme = getStoredTheme(defaultTheme);
    var fullWidth = readStore(STORAGE_WIDTH) === "1";
    var base = getResourceBase(script);

    window.Artefact = {
      resourceBase: normaliseBase(base),
      setTheme: setTheme,
      setFullWidth: setFullWidth,
      enhanceCollapsibles: enhanceCollapsibles,
      annotate: {
        enable: enableAnnotations,
        disable: disableAnnotations,
        toggle: toggleAnnotations,
        getAnnotations: function () { return annotations; },
        exportMarkdown: exportMarkdown,
        copyToClipboard: copyToClipboard
      }
    };

    ensureStylesheet("af-common-css", window.Artefact.resourceBase + "artefact-common.css");
    setTheme(theme);
    setFullWidth(fullWidth);
    createToolbar(theme, fullWidth);  // must run before initAnnotations    
    enhanceCollapsibles();
    activateToc();
    initMobileToc();
    initAnnotations();               // toolbar already exists; buttons are prepended
    ensureFontAwesomeAfterPageLoad();
    ensureHighlighting();
    ensureDiffScript();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
