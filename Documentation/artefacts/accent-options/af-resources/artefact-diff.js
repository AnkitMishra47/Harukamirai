/*
  artefact-diff.js — in-place artefact version diff.

  This standalone module is intentionally separate from artefact.js. It waits
  for the shared artefact toolbar, adds a Diff toggle and a previous-version
  selector, then paints an IDE-style diff rail into the gap between the menu and
  the content. It does not open a side-by-side dialog.

  The diff is computed on demand over rendered preview blocks, not raw HTML.
  Previous versions are parsed with DOMParser as inert documents, reduced to
  visible text blocks, and rendered back only through text nodes/textContent.
  Fetched HTML is never assigned to innerHTML.
*/
(function () {
    "use strict";

    var SCRIPT_ID = "af-diff-script";
    var STYLE_ID = "af-diff-styles";
    var BUTTON_ID = "af-diff-toggle";
    var SELECT_ID = "af-diff-version-select";
    var MAX_DP_CELLS = 4000000;
    /* Minimum line similarity (shared-word Dice ratio) for a deleted line and
       an added line to be fused into one "changed" row rather than shown as a
       separate red removal + green addition. */
    var SIM_THRESHOLD = 0.34;

    var BLOCK_SELECTOR = [
        "[data-af-block-id]",
        "[data-af-annotatable]",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "p",
        "pre",
        "li",
        "blockquote",
        "td",
        "th",
        "dt",
        "dd",
        "figcaption",
        "caption",
        "summary",
        ".cue",
        ".note",
        ".warning",
        ".danger",
        ".entry"
    ].join(",");

    var SKIP_TAGS = {
        HEAD: 1,
        SCRIPT: 1,
        STYLE: 1,
        TEMPLATE: 1,
        NOSCRIPT: 1
    };

    var state = {
        active: false,
        loading: false,
        versionOptions: [],
        selectedIndex: 0,
        renderId: 0,
        button: null,
        select: null,
        separator: null,
        contentRoot: null,
        rail: null,
        ownedRail: null,
        markerLayer: null,
        anchors: [],
        hosts: [],
        markerHosts: [],
        cleanupFns: [],
        pendingReposition: false,
        lastButtonTitle: ""
    };

    /* ---- Config -------------------------------------------------------- */

    function getScriptElement() {
        var byId = document.getElementById(SCRIPT_ID);
        if (byId) {
            return byId;
        }

        if (document.currentScript && document.currentScript.id === SCRIPT_ID) {
            return document.currentScript;
        }

        return null;
    }

    function readConfig() {
        var script = getScriptElement();
        return {
            prevUrl: script ? script.getAttribute("data-af-prev-url") : null,
            prevLabel: (script && script.getAttribute("data-af-prev-label")) || "Previous",
            currentLabel: (script && script.getAttribute("data-af-current-label")) || "Current",
            versionsJson: script ? script.getAttribute("data-af-versions") : null
        };
    }

    function makeVersionOption(label, version, url) {
        return {
            label: label || version || url,
            version: version || label || url,
            url: url
        };
    }

    function parseConfiguredVersionOptions(config) {
        var options = [];

        if (config.versionsJson) {
            try {
                var parsed = JSON.parse(config.versionsJson);
                if (Array.isArray(parsed)) {
                    parsed.forEach(function (entry) {
                        var url;
                        var version;
                        var label;

                        if (!entry) {
                            return;
                        }

                        url = entry.url || entry.href || entry.prevUrl;
                        version = entry.version || entry.name || entry.label;
                        label = entry.label || entry.version || entry.name || url;
                        if (url) {
                            options.push(makeVersionOption(label, version, url));
                        }
                    });
                }
            } catch (error) {
                options = [];
            }
        }

        if (options.length) {
            return options;
        }

        if (config.prevUrl) {
            return [makeVersionOption(config.prevLabel, config.prevLabel, config.prevUrl)];
        }

        return [];
    }

    function diffDisabled() {
        return document.body && document.body.classList.contains("nodiffs");
    }

    function getCurrentArtefactPathInfo() {
        var path = location.pathname.replace(/\/+$/, "");
        var sharded = path.match(/^(.*\/af\/)(\d{3})\/(\d+)\/([^/]+)\/([^/]+)(\/.*)?$/);
        var legacy;

        if (sharded) {
            return {
                slugBase: sharded[1] + sharded[2] + "/" + sharded[3] + "/" + sharded[4],
                currentVersion: sharded[5],
                currentSuffix: sharded[6] || "/index.html"
            };
        }

        legacy = path.match(/^(.*\/af\/)(\d+)\/([^/]+)\/([^/]+)(\/.*)?$/);
        if (!legacy) {
            return null;
        }

        return {
            slugBase: legacy[1] + legacy[2] + "/" + legacy[3],
            currentVersion: legacy[4],
            currentSuffix: legacy[5] || "/index.html"
        };
    }

    function resolveVersionOptions(config) {
        var configured = parseConfiguredVersionOptions(config);
        if (configured.length) {
            return Promise.resolve(configured);
        }

        return resolveOptionsViaVersionsEndpoint().catch(function () {
            return [];
        });
    }

    function resolveOptionsViaVersionsEndpoint() {
        var pathInfo = getCurrentArtefactPathInfo();
        if (!pathInfo) {
            return Promise.resolve([]);
        }

        var endpoint = location.origin + "/_artefact/versions?path=" +
            encodeURIComponent(location.pathname);

        return fetchText(endpoint).then(function (raw) {
            var data = JSON.parse(raw);
            var versions = (data && data.versions) || [];
            var names = versions.map(function (entry) {
                return entry && entry.version;
            }).filter(Boolean);
            var index = names.indexOf(pathInfo.currentVersion);

            if (index <= 0) {
                return [];
            }

            return names.slice(0, index).map(function (version) {
                return makeVersionOption(version, version, pathInfo.slugBase + "/" + version + pathInfo.currentSuffix);
            });
        });
    }

    /* ---- LCS diff helpers --------------------------------------------- */

    function lcsOps(a, b) {
        var n = a.length;
        var m = b.length;
        var ops = [];
        var i;
        var j;
        var dp;

        if (n === 0 && m === 0) {
            return ops;
        }

        if (n * m > MAX_DP_CELLS) {
            for (i = 0; i < n; i++) {
                ops.push({ type: "del", a: a[i], ai: i });
            }
            for (j = 0; j < m; j++) {
                ops.push({ type: "add", b: b[j], bi: j });
            }
            return ops;
        }

        dp = [];
        for (i = 0; i <= n; i++) {
            dp[i] = new Int32Array(m + 1);
        }

        for (i = n - 1; i >= 0; i--) {
            for (j = m - 1; j >= 0; j--) {
                if (a[i] === b[j]) {
                    dp[i][j] = dp[i + 1][j + 1] + 1;
                } else {
                    dp[i][j] = dp[i + 1][j] >= dp[i][j + 1] ? dp[i + 1][j] : dp[i][j + 1];
                }
            }
        }

        i = 0;
        j = 0;
        while (i < n && j < m) {
            if (a[i] === b[j]) {
                ops.push({ type: "equal", a: a[i], b: b[j], ai: i, bi: j });
                i++;
                j++;
            } else if (dp[i + 1][j] >= dp[i][j + 1]) {
                ops.push({ type: "del", a: a[i], ai: i });
                i++;
            } else {
                ops.push({ type: "add", b: b[j], bi: j });
                j++;
            }
        }

        while (i < n) {
            ops.push({ type: "del", a: a[i], ai: i });
            i++;
        }

        while (j < m) {
            ops.push({ type: "add", b: b[j], bi: j });
            j++;
        }

        return ops;
    }

    function tokenize(line) {
        return String(line).match(/\s+|\S+/g) || [];
    }

    /* Walk the token LCS once and emit an ordered, unified segment list:
       equal tokens are kept as-is, removed tokens are flagged "del" (red), and
       added tokens are flagged "ins" (green). Rendered this way a changed block
       always annotates BOTH what was removed and what was added inline, instead
       of painting the whole block a single colour. */
    function unifiedTokenSegments(oldLine, newLine) {
        var ops = lcsOps(tokenize(oldLine), tokenize(newLine));
        var segments = [];

        ops.forEach(function (op) {
            if (op.type === "equal") {
                segments.push({ value: op.b, kind: "equal" });
            } else if (op.type === "del") {
                segments.push({ value: op.a, kind: "del" });
            } else {
                segments.push({ value: op.b, kind: "ins" });
            }
        });

        return segments;
    }

    /* Word tokens with whitespace stripped, used only to measure how similar
       two lines are (so whitespace runs do not inflate the score). */
    function wordsOf(line) {
        return String(line == null ? "" : line).match(/\S+/g) || [];
    }

    /* Similarity of two lines in [0, 1]: twice the number of shared words over
       the combined word count (a Dice-style ratio over the word LCS). 1 when
       both are blank, 0 when only one side has words. */
    function lineSimilarity(a, b) {
        var wa = wordsOf(a);
        var wb = wordsOf(b);
        var common = 0;

        if (wa.length === 0 && wb.length === 0) {
            return 1;
        }

        if (wa.length === 0 || wb.length === 0) {
            return 0;
        }

        lcsOps(wa, wb).forEach(function (op) {
            if (op.type === "equal") {
                common++;
            }
        });

        return (2 * common) / (wa.length + wb.length);
    }

    /* Pair a run of deleted lines with the run of added lines that immediately
       follows it.

       Lines almost never match EXACTLY once reworded, so the block-level LCS
       reports a changed block as a whole del-run then a whole add-run; the real
       intent is that line k was edited into line k. pairRuns computes an
       order-preserving alignment via a small DP that maximises the total
       similarity of the lines it fuses, and only fuses a del/add pair into a
       single "changed" row when the two lines are actually similar
       (>= SIM_THRESHOLD). Genuinely inserted lines stay "add" (green) and
       genuinely removed lines stay "del" (red).

       This replaces the previous greedy rule that paired only the boundary
       del+add — which shifted the real change onto a later line and turned the
       rest of the block into spurious red removals + green additions. */
    function pairRuns(dels, adds) {
        var n = dels.length;
        var m = adds.length;
        var rows = [];
        var score;
        var choice;
        var i;
        var j;

        if (n === 0) {
            return adds.map(function (op) {
                return { type: "add", bi: op.bi };
            });
        }

        if (m === 0) {
            return dels.map(function (op) {
                return { type: "del", ai: op.ai };
            });
        }

        score = [];
        choice = [];
        for (i = 0; i <= n; i++) {
            score[i] = [];
            choice[i] = [];
            for (j = 0; j <= m; j++) {
                score[i][j] = 0;
                choice[i][j] = "del";
            }
        }

        /* score[i][j] = best total similarity aligning dels[i..] with
           adds[j..]; choice[i][j] records the move that achieved it. */
        for (i = n - 1; i >= 0; i--) {
            for (j = m - 1; j >= 0; j--) {
                var best = score[i + 1][j];
                var pick = "del";
                var sim;

                if (score[i][j + 1] > best) {
                    best = score[i][j + 1];
                    pick = "add";
                }

                sim = lineSimilarity(dels[i].a, adds[j].b);
                if (sim >= SIM_THRESHOLD && sim + score[i + 1][j + 1] > best) {
                    best = sim + score[i + 1][j + 1];
                    pick = "changed";
                }

                score[i][j] = best;
                choice[i][j] = pick;
            }
        }

        i = 0;
        j = 0;
        while (i < n && j < m) {
            var move = choice[i][j];

            if (move === "changed") {
                rows.push({ type: "changed", ai: dels[i].ai, bi: adds[j].bi });
                i++;
                j++;
            } else if (move === "del") {
                rows.push({ type: "del", ai: dels[i].ai });
                i++;
            } else {
                rows.push({ type: "add", bi: adds[j].bi });
                j++;
            }
        }

        while (i < n) {
            rows.push({ type: "del", ai: dels[i].ai });
            i++;
        }

        while (j < m) {
            rows.push({ type: "add", bi: adds[j].bi });
            j++;
        }

        return rows;
    }

    /* Align two ordered string arrays (list items / code lines) into rows.
       Equal lines anchor the diff directly; each maximal del-run plus the add-
       run that follows it is handed to pairRuns so changed lines line up with
       their counterpart instead of being greedily mismatched at the boundary. */
    function alignSequences(oldArr, newArr) {
        var ops = lcsOps(oldArr, newArr);
        var rows = [];
        var i = 0;

        while (i < ops.length) {
            if (ops[i].type === "equal") {
                rows.push({ type: "equal", ai: ops[i].ai, bi: ops[i].bi });
                i++;
                continue;
            }

            var dels = [];
            var adds = [];

            while (i < ops.length && ops[i].type === "del") {
                dels.push(ops[i]);
                i++;
            }

            while (i < ops.length && ops[i].type === "add") {
                adds.push(ops[i]);
                i++;
            }

            pairRuns(dels, adds).forEach(function (row) {
                rows.push(row);
            });
        }

        return rows;
    }

    /* ---- Source and block collection ----------------------------------- */

    function fetchText(url) {
        return fetch(url, { credentials: "same-origin" }).then(function (response) {
            if (!response.ok) {
                throw new Error("HTTP " + response.status);
            }

            return response.text();
        });
    }

    function isViewerChrome(el) {
        var id = el.id || "";
        return id === "af-toolbar" ||
            id === "af-toolbar-launcher" ||
            id.indexOf("af-diff") === 0 ||
            id.indexOf("af-ann") === 0 ||
            el.classList.contains("af-diff-rail") ||
            el.classList.contains("af-diff-marker-layer") ||
            el.classList.contains("af-diff-prev-panel") ||
            el.classList.contains("af-ann-marker") ||
            el.classList.contains("af-ann-popup");
    }

    function pickPreviewRoot(doc) {
        return doc.querySelector(".af-content") ||
            doc.querySelector("main");
    }

    function normalizeText(value) {
        return String(value || "").replace(/\s+/g, " ").trim();
    }

    function hasBlockId(el) {
        return Boolean(el.id || el.getAttribute("data-af-block-id"));
    }

    function blockKey(el, text) {
        var id = el.getAttribute("data-af-block-id") || el.id;
        if (id) {
            return el.tagName + "#" + id;
        }

        return el.tagName + ":" + text;
    }

    function trimBlankEdges(value) {
        return String(value == null ? "" : value).replace(/^\n+/, "").replace(/\s+$/, "");
    }

    /* Capture a structure-aware view of a block so the reveal panel can rebuild
       it the way the reader actually sees it — bulleted lists, table rows, and
       preformatted code — instead of flattening everything into one text line.
       Runs for both the live document and the parsed inert previous document. */
    function blockStructure(el) {
        var tag = el.tagName;
        var items;
        var cells;

        if (tag === "UL" || tag === "OL") {
            items = Array.prototype.slice.call(el.querySelectorAll(":scope > li"))
                .map(function (li) {
                    return normalizeText(li.textContent);
                })
                .filter(function (value) {
                    return value.length > 0;
                });
            if (items.length) {
                return { kind: "list", ordered: tag === "OL", items: items };
            }
        } else if (tag === "TR") {
            cells = Array.prototype.slice.call(el.querySelectorAll(":scope > th, :scope > td"))
                .map(function (cell) {
                    return { text: normalizeText(cell.textContent), header: cell.tagName === "TH" };
                });
            if (cells.length) {
                return { kind: "row", cells: cells };
            }
        } else if (tag === "PRE") {
            // Preserve newlines so the code reveal keeps its line structure.
            return { kind: "code", code: trimBlankEdges(el.textContent) };
        }

        return { kind: "text" };
    }

    function isVisibleLiveElement(el) {
        var style;

        if (!el || isViewerChrome(el)) {
            return false;
        }

        if (!document.documentElement.contains(el)) {
            return false;
        }

        style = window.getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden") {
            return false;
        }

        return true;
    }

    function isNestedBlockId(el, root) {
        var parent = el.parentElement;

        while (parent && parent !== root) {
            if (parent.hasAttribute("data-af-block-id")) {
                return true;
            }
            parent = parent.parentElement;
        }

        return false;
    }

    function collectBlocksFromRoot(root, live) {
        var blockIdElements;
        var candidates;
        var blocks = [];

        if (!root) {
            return blocks;
        }

        blockIdElements = Array.prototype.slice.call(root.querySelectorAll("[data-af-block-id]"))
            .filter(function (el) {
                return !isNestedBlockId(el, root);
            });

        candidates = blockIdElements.length ?
            blockIdElements :
            Array.prototype.slice.call(root.querySelectorAll(BLOCK_SELECTOR));

        candidates.forEach(function (el) {
            var text;
            var struct;

            if (SKIP_TAGS[el.tagName] || isViewerChrome(el)) {
                return;
            }

            if (live && !isVisibleLiveElement(el)) {
                return;
            }

            text = normalizeText(el.textContent);
            if (!text) {
                return;
            }

            struct = blockStructure(el);
            blocks.push({
                key: blockKey(el, text),
                stable: hasBlockId(el),
                tagName: el.tagName,
                text: text,
                kind: struct.kind,
                struct: struct,
                el: live ? el : null
            });
        });

        return blocks;
    }

    function collectCurrentBlocks() {
        var root = pickPreviewRoot(document);
        state.contentRoot = root;
        return collectBlocksFromRoot(root, true);
    }

    function collectPreviousBlocks(html) {
        var doc = new DOMParser().parseFromString(String(html), "text/html");
        var root = pickPreviewRoot(doc);
        return collectBlocksFromRoot(root, false);
    }

    function buildBlockChanges(oldBlocks, newBlocks) {
        var oldKeys = oldBlocks.map(function (block) {
            return block.key;
        });
        var newKeys = newBlocks.map(function (block) {
            return block.key;
        });
        var ops = lcsOps(oldKeys, newKeys);
        var changes = [];
        var newCursor = 0;

        ops.forEach(function (op) {
            var oldBlock;
            var newBlock;

            if (op.type === "equal") {
                oldBlock = oldBlocks[op.ai];
                newBlock = newBlocks[op.bi];
                newCursor = op.bi + 1;

                if (oldBlock.text !== newBlock.text) {
                    changes.push({
                        type: "changed",
                        oldBlock: oldBlock,
                        newBlock: newBlock,
                        insertionIndex: op.bi
                    });
                }
            } else if (op.type === "add") {
                newBlock = newBlocks[op.bi];
                changes.push({
                    type: "new",
                    newBlock: newBlock,
                    insertionIndex: op.bi
                });
                newCursor = op.bi + 1;
            } else {
                oldBlock = oldBlocks[op.ai];
                changes.push({
                    type: "deleted",
                    oldBlock: oldBlock,
                    insertionIndex: newCursor
                });
            }
        });

        return changes;
    }

    /* ---- DOM rendering ------------------------------------------------- */

    function appendText(parent, value) {
        parent.appendChild(document.createTextNode(value == null ? "" : String(value)));
    }

    function appendUnifiedSegments(parent, segments) {
        segments.forEach(function (segment) {
            var span;

            if (segment.kind === "equal") {
                appendText(parent, segment.value);
                return;
            }

            span = document.createElement("span");
            span.className = segment.kind === "ins" ? "af-diff-token-ins" : "af-diff-token-del";
            span.textContent = segment.value;
            parent.appendChild(span);
        });
    }

    function makeLabel(kind, versionLabel) {
        var label = document.createElement("div");
        var badge = document.createElement("span");

        label.className = "af-diff-prev-label";
        badge.className = "af-diff-prev-badge af-diff-prev-badge-" + kind;
        badge.textContent = kind === "deleted" ? "deleted" : "changed";

        appendText(label, kind === "deleted" ? "Removed since " : "Previous version ");
        appendText(label, versionLabel || "previous");
        label.appendChild(badge);

        return label;
    }

    function appendChangedBody(body, oldText, newText) {
        // Always render the unified word diff so the reveal panel annotates the
        // actual change inline — removed words red, added words green — even when
        // the block was reworded wholesale (e.g. a Scope paragraph). This avoids
        // the "whole block is just blue with nothing annotated" outcome.
        appendUnifiedSegments(body, unifiedTokenSegments(oldText, newText));
    }

    /* Append one list <li> in the given diff mode. The segments already encode
       the inline word diff (equal/del/ins), so a "changed" row shows BOTH the
       removed (red) and added (green) words on a single bullet instead of a
       separate all-red + all-green pair. */
    function appendListItemSegments(listEl, mode, segments) {
        var li = document.createElement("li");

        li.className = "af-diff-line";
        if (mode && mode !== "equal") {
            li.classList.add("af-diff-line-" + mode);
        }
        appendUnifiedSegments(li, segments);
        listEl.appendChild(li);
    }

    /* Build one bulleted/numbered <li> per aligned list item so the reveal
       shows the list the way it renders, not a single run-together line. A
       reworded item is shown as ONE "changed" bullet whose inline word diff
       marks only the words that actually changed, rather than the whole old
       item in red followed by the whole new item in green. */
    function appendListDiff(body, oldStruct, newStruct, isDeleted) {
        var listEl = document.createElement(oldStruct.ordered ? "ol" : "ul");
        var oldItems = oldStruct.items;
        var newItems = (!isDeleted && newStruct) ? newStruct.items : [];

        listEl.className = "af-diff-prev-list";

        if (isDeleted || !newStruct) {
            oldItems.forEach(function (text) {
                appendListItemSegments(listEl, "del", unifiedTokenSegments(text, ""));
            });
            body.appendChild(listEl);
            return;
        }

        alignSequences(oldItems, newItems).forEach(function (row) {
            if (row.type === "equal") {
                appendListItemSegments(listEl, "equal", [{ value: oldItems[row.ai], kind: "equal" }]);
            } else if (row.type === "changed") {
                appendListItemSegments(listEl, "changed", unifiedTokenSegments(oldItems[row.ai], newItems[row.bi]));
            } else if (row.type === "del") {
                appendListItemSegments(listEl, "del", unifiedTokenSegments(oldItems[row.ai], ""));
            } else {
                appendListItemSegments(listEl, "add", unifiedTokenSegments("", newItems[row.bi]));
            }
        });

        body.appendChild(listEl);
    }

    /* Rebuild the changed/removed table row as a real one-row table so cell
       values stay in their columns and each cell carries its own word diff
       instead of collapsing into "OldNewValue" prose. */
    function appendRowDiff(body, oldStruct, newStruct, isDeleted) {
        var table = document.createElement("table");
        var tbody = document.createElement("tbody");
        var tr = document.createElement("tr");
        var oldCells = oldStruct.cells;
        var newCells = (!isDeleted && newStruct) ? newStruct.cells : [];
        var count = Math.max(oldCells.length, newCells.length);
        var c;

        table.className = "af-diff-prev-table";

        for (c = 0; c < count; c++) {
            var oldCell = oldCells[c] || null;
            var newCell = newCells[c] || null;
            var useHeader = (oldCell && oldCell.header) || (newCell && newCell.header);
            var cellEl = document.createElement(useHeader ? "th" : "td");
            var oldText = oldCell ? oldCell.text : "";
            var newText = newCell ? newCell.text : "";

            if (isDeleted || !newStruct) {
                cellEl.className = "af-diff-cell af-diff-cell-del";
                appendUnifiedSegments(cellEl, unifiedTokenSegments(oldText, ""));
            } else if (oldText === newText) {
                cellEl.className = "af-diff-cell";
                appendText(cellEl, oldText);
            } else {
                cellEl.className = "af-diff-cell af-diff-cell-changed";
                appendUnifiedSegments(cellEl, unifiedTokenSegments(oldText, newText));
            }
            tr.appendChild(cellEl);
        }

        tbody.appendChild(tr);
        table.appendChild(tbody);
        body.appendChild(table);
    }

    function appendCodeLine(pre, type, segments) {
        var line = document.createElement("span");

        line.className = "af-diff-code-line af-diff-code-" + type;
        appendUnifiedSegments(line, segments);
        pre.appendChild(line);
        pre.appendChild(document.createTextNode("\n"));
    }

    function appendCodeTextLine(pre, type, text) {
        if (type === "del") {
            appendCodeLine(pre, type, unifiedTokenSegments(text, ""));
        } else if (type === "add") {
            appendCodeLine(pre, type, unifiedTokenSegments("", text));
        } else {
            appendCodeLine(pre, type, [{ value: text, kind: "equal" }]);
        }
    }

    /* Render the previous code in its own <pre> inside the panel (line diffed),
       so it never has to live inside — and be clipped by — the source <pre>. */
    function appendCodeDiff(body, oldCode, newCode, isDeleted) {
        var pre = document.createElement("pre");
        var oldLines = String(oldCode || "").split("\n");
        var newLines = (!isDeleted && newCode != null) ? String(newCode).split("\n") : [];

        pre.className = "af-diff-prev-code";

        if (isDeleted || newCode == null) {
            oldLines.forEach(function (line) {
                appendCodeTextLine(pre, "del", line);
            });
            body.appendChild(pre);
            return;
        }

        alignSequences(oldLines, newLines).forEach(function (row) {
            if (row.type === "equal") {
                appendCodeTextLine(pre, "equal", oldLines[row.ai]);
            } else if (row.type === "changed") {
                // One unified line: only the changed tokens are coloured (removed
                // red, added green), instead of a whole red line then a whole
                // green line.
                appendCodeLine(pre, "changed", unifiedTokenSegments(oldLines[row.ai], newLines[row.bi]));
            } else if (row.type === "del") {
                appendCodeTextLine(pre, "del", oldLines[row.ai]);
            } else {
                appendCodeTextLine(pre, "add", newLines[row.bi]);
            }
        });

        body.appendChild(pre);
    }

    /* Fill the reveal body using a structure-aware renderer keyed on the block
       kind so lists, table rows, and code keep their shape; everything else
       falls back to the inline word diff. */
    function fillPanelBody(body, change) {
        var isDeleted = change.type === "deleted";
        var oldBlock = change.oldBlock;
        var newBlock = change.newBlock || null;
        var kind = oldBlock.kind || "text";

        if (kind === "list" && oldBlock.struct) {
            body.classList.add("af-diff-prev-body-rich");
            appendListDiff(body, oldBlock.struct, newBlock && newBlock.kind === "list" ? newBlock.struct : null, isDeleted);
            return;
        }

        if (kind === "row" && oldBlock.struct) {
            body.classList.add("af-diff-prev-body-rich");
            appendRowDiff(body, oldBlock.struct, newBlock && newBlock.kind === "row" ? newBlock.struct : null, isDeleted);
            return;
        }

        if (kind === "code" && oldBlock.struct) {
            body.classList.add("af-diff-prev-body-rich");
            appendCodeDiff(body, oldBlock.struct.code, newBlock && newBlock.kind === "code" ? newBlock.struct.code : null, isDeleted);
            return;
        }

        if (isDeleted) {
            body.classList.add("af-diff-prev-body-deleted");
            appendText(body, oldBlock.text);
        } else {
            appendChangedBody(body, oldBlock.text, newBlock.text);
        }
    }

    function makePanel(change, selectedVersion) {
        var panel = document.createElement("div");
        var body = document.createElement("div");

        panel.className = "af-diff-prev-panel";
        panel.setAttribute("role", "note");
        panel.appendChild(makeLabel(change.type === "deleted" ? "deleted" : "changed", selectedVersion.label));

        body.className = "af-diff-prev-body";
        fillPanelBody(body, change);

        panel.appendChild(body);
        return panel;
    }

    function findContentRoot() {
        return pickPreviewRoot(document);
    }

    function findRail(contentRoot) {
        var rail = document.querySelector(".af-gutter, [data-af-diff-gutter]");

        if (rail) {
            state.ownedRail = null;
            rail.classList.add("af-diff-rail-host");
            return rail;
        }

        if (!contentRoot) {
            return null;
        }

        rail = document.createElement("div");
        rail.className = "af-diff-rail af-diff-floating-rail";
        document.body.appendChild(rail);
        state.ownedRail = rail;
        return rail;
    }

    function makeMarkerLayer(rail) {
        var layer = document.createElement("div");
        layer.className = "af-diff-marker-layer";
        rail.appendChild(layer);
        return layer;
    }

    function createDeletedAnchor(change, currentBlocks) {
        var anchor = document.createElement("div");
        var nextBlock = currentBlocks[change.insertionIndex];
        var previousBlock = currentBlocks[change.insertionIndex - 1];
        var parent;

        anchor.className = "af-diff-deleted-anchor af-diff-host";
        anchor.setAttribute("aria-hidden", "true");

        if (nextBlock && nextBlock.el && nextBlock.el.parentNode) {
            nextBlock.el.parentNode.insertBefore(anchor, nextBlock.el);
        } else if (previousBlock && previousBlock.el && previousBlock.el.parentNode) {
            parent = previousBlock.el.parentNode;
            parent.insertBefore(anchor, previousBlock.el.nextSibling);
        } else if (state.contentRoot) {
            state.contentRoot.appendChild(anchor);
        }

        state.anchors.push(anchor);
        return anchor;
    }

    function createPanelAnchorAfter(target) {
        var anchor = document.createElement("div");

        anchor.className = "af-diff-panel-anchor af-diff-host";

        if (target && target.parentNode) {
            target.parentNode.insertBefore(anchor, target.nextSibling);
        } else if (state.contentRoot) {
            state.contentRoot.appendChild(anchor);
        }

        state.anchors.push(anchor);
        return anchor;
    }

    function setPanelOpen(change, open) {
        if (!change.host || !change.marker) {
            return;
        }

        change.host.classList.toggle("af-diff-panel-open", open);
        change.marker.classList.toggle("af-diff-marker-open", open);
    }

    function attachRevealEvents(change) {
        var marker = change.marker;
        var host = change.host;

        function open() {
            if (!change.pinned) {
                setPanelOpen(change, true);
            }
        }

        function close() {
            if (!change.pinned) {
                setPanelOpen(change, false);
            }
        }

        function toggle(event) {
            event.preventDefault();
            change.pinned = !change.pinned;
            host.classList.toggle("af-diff-panel-pinned", change.pinned);
            setPanelOpen(change, change.pinned);
        }

        marker.addEventListener("mouseenter", open);
        marker.addEventListener("mouseleave", close);
        marker.addEventListener("focus", open);
        marker.addEventListener("blur", close);
        marker.addEventListener("click", toggle);

        state.cleanupFns.push(function () {
            marker.removeEventListener("mouseenter", open);
            marker.removeEventListener("mouseleave", close);
            marker.removeEventListener("focus", open);
            marker.removeEventListener("blur", close);
            marker.removeEventListener("click", toggle);
        });
    }

    function makeMarker(change) {
        var marker = document.createElement("button");
        var icon;

        marker.type = "button";
        marker.className = "af-diff-marker af-diff-marker-" + change.type;

        if (change.type === "deleted") {
            // Use the FontAwesome class (renders the chevron via ::before) rather
            // than stamping the raw codepoint into textContent \u2014 the class form is
            // reliable, and the rotate-on-open CSS gives the same expand/collapse
            // arrow toggle the changed (blue) markers have.
            icon = document.createElement("i");
            icon.className = "fa-solid fa-angle-right";
            icon.setAttribute("aria-hidden", "true");
            marker.appendChild(icon);
            marker.setAttribute("aria-label", "Show deleted content");
            marker.title = "Show deleted content";
        } else if (change.type === "changed") {
            marker.setAttribute("aria-label", "Show previous version of this changed block");
            marker.title = "Show previous version";
        } else {
            marker.setAttribute("aria-label", "New content");
            marker.title = "New content";
            marker.tabIndex = -1;
            marker.disabled = true;
        }

        return marker;
    }

    function renderChanges(changes, currentBlocks, selectedVersion) {
        var rail = findRail(state.contentRoot);

        if (!rail) {
            showControlMessage("No diff gutter available");
            return false;
        }

        state.rail = rail;
        state.markerLayer = makeMarkerLayer(rail);

        changes.forEach(function (change) {
            var host;
            var markerHost;
            var panel;
            var marker;

            if (change.type === "changed") {
                markerHost = change.newBlock.el;
                markerHost.classList.add("af-diff-host", "af-diff-current-block", "af-diff-changed-block");
                host = createPanelAnchorAfter(markerHost);
                panel = makePanel(change, selectedVersion);
                host.appendChild(panel);
            } else if (change.type === "new") {
                host = change.newBlock.el;
                host.classList.add("af-diff-host", "af-diff-current-block", "af-diff-new-block");
                markerHost = host;
            } else {
                host = createDeletedAnchor(change, currentBlocks);
                markerHost = host;
                panel = makePanel(change, selectedVersion);
                host.appendChild(panel);
            }

            marker = makeMarker(change);
            state.markerLayer.appendChild(marker);

            change.host = host;
            change.markerHost = markerHost || host;
            change.marker = marker;
            change.panel = panel || null;
            change.pinned = false;

            if (markerHost && markerHost !== host) {
                state.hosts.push(markerHost);
            }
            state.hosts.push(host);
            state.markerHosts.push(change.markerHost);

            if (change.type !== "new") {
                attachRevealEvents(change);
            }
        });

        attachPositionListeners();
        scheduleReposition();
        return true;
    }

    /* ---- Positioning and cleanup --------------------------------------- */

    function markerTopForHost(host, railRect) {
        return host.getBoundingClientRect().top - railRect.top;
    }

    function repositionFloatingRail() {
        var root = state.contentRoot;
        var rail = state.ownedRail;
        var rect;
        var docTop;

        if (!root || !rail) {
            return;
        }

        rect = root.getBoundingClientRect();
        docTop = window.pageYOffset || document.documentElement.scrollTop || 0;
        rail.style.left = Math.max(0, rect.left - 30) + "px";
        rail.style.top = docTop + rect.top + "px";
        rail.style.height = Math.max(root.offsetHeight, rect.height) + "px";
    }

    function repositionMarkers() {
        var railRect;

        if (!state.markerLayer || !state.rail) {
            return;
        }

        repositionFloatingRail();
        railRect = state.rail.getBoundingClientRect();

        Array.prototype.slice.call(state.markerLayer.children).forEach(function (marker) {
            var host = state.markerHosts[Array.prototype.indexOf.call(state.markerLayer.children, marker)];
            var top;
            var height;

            if (!host) {
                return;
            }

            top = markerTopForHost(host, railRect);
            if (marker.classList.contains("af-diff-marker-deleted")) {
                height = marker.offsetHeight || 22;
                marker.style.top = (top + (host.getBoundingClientRect().height - height) / 2) + "px";
            } else {
                marker.style.top = top + "px";
                marker.style.height = host.getBoundingClientRect().height + "px";
            }
        });
    }

    function scheduleReposition() {
        if (state.pendingReposition) {
            return;
        }

        state.pendingReposition = true;
        requestAnimationFrame(function () {
            state.pendingReposition = false;
            repositionMarkers();
        });
    }

    function attachPositionListeners() {
        var root = state.contentRoot;

        function onMove() {
            scheduleReposition();
        }

        window.addEventListener("resize", onMove);
        window.addEventListener("scroll", onMove, { passive: true });
        if (root) {
            root.addEventListener("transitionend", onMove);
        }

        state.cleanupFns.push(function () {
            window.removeEventListener("resize", onMove);
            window.removeEventListener("scroll", onMove);
            if (root) {
                root.removeEventListener("transitionend", onMove);
            }
        });
    }

    function clearRenderedDiff() {
        state.cleanupFns.forEach(function (cleanup) {
            cleanup();
        });
        state.cleanupFns = [];

        state.hosts.forEach(function (host) {
            host.classList.remove(
                "af-diff-host",
                "af-diff-current-block",
                "af-diff-changed-block",
                "af-diff-new-block",
                "af-diff-panel-open",
                "af-diff-panel-pinned"
            );
            Array.prototype.slice.call(host.querySelectorAll(":scope > .af-diff-prev-panel")).forEach(function (panel) {
                panel.parentNode.removeChild(panel);
            });
        });
        state.hosts = [];
        state.markerHosts = [];

        state.anchors.forEach(function (anchor) {
            if (anchor.parentNode) {
                anchor.parentNode.removeChild(anchor);
            }
        });
        state.anchors = [];

        if (state.markerLayer && state.markerLayer.parentNode) {
            state.markerLayer.parentNode.removeChild(state.markerLayer);
        }
        state.markerLayer = null;

        if (state.rail) {
            state.rail.classList.remove("af-diff-rail-host");
        }
        state.rail = null;

        if (state.ownedRail && state.ownedRail.parentNode) {
            state.ownedRail.parentNode.removeChild(state.ownedRail);
        }
        state.ownedRail = null;
    }

    function deactivateDiff() {
        state.active = false;
        state.renderId++;
        state.lastButtonTitle = "";
        clearRenderedDiff();
        document.documentElement.classList.remove("af-diff-mode");
        updateControlState();
    }

    /* ---- Diff run ------------------------------------------------------ */

    function selectedVersionOption() {
        return state.versionOptions[state.selectedIndex] || null;
    }

    function showControlMessage(message) {
        state.lastButtonTitle = message;
        if (state.button) {
            state.button.title = message;
        }
    }

    function setLoading(loading) {
        state.loading = loading;
        updateControlState();
    }

    function runDiffForSelection() {
        var selectedVersion = selectedVersionOption();
        var renderId;

        if (!selectedVersion || !state.active) {
            return;
        }

        renderId = ++state.renderId;
        state.lastButtonTitle = "";
        clearRenderedDiff();
        document.documentElement.classList.add("af-diff-mode");
        setLoading(true);

        fetchText(selectedVersion.url).then(function (oldHtml) {
            var oldBlocks;
            var currentBlocks;
            var changes;

            if (renderId !== state.renderId || !state.active) {
                return;
            }

            oldBlocks = collectPreviousBlocks(oldHtml);
            currentBlocks = collectCurrentBlocks();
            if (!state.contentRoot || !currentBlocks.length || !oldBlocks.length) {
                showControlMessage("No comparable artefact content found");
                return;
            }

            changes = buildBlockChanges(oldBlocks, currentBlocks);
            if (!changes.length) {
                showControlMessage("No differences between the selected versions");
                return;
            }

            renderChanges(changes, currentBlocks, selectedVersion);
            showControlMessage("Hide in-place diff markers");
        }).catch(function (error) {
            if (renderId !== state.renderId) {
                return;
            }

            showControlMessage("Could not load " + selectedVersion.label + " (" +
                (error && error.message ? error.message : "fetch failed") + ")");
        }).then(function () {
            if (renderId === state.renderId) {
                setLoading(false);
            }
        });
    }

    function activateDiff() {
        if (!findContentRoot()) {
            showControlMessage("No standard artefact content found");
            return;
        }

        state.active = true;
        state.lastButtonTitle = "";
        updateControlState();
        runDiffForSelection();
    }

    function toggleDiff() {
        if (state.active) {
            deactivateDiff();
        } else {
            activateDiff();
        }
    }

    /* ---- Toolbar ------------------------------------------------------- */

    function whenToolbarReady(callback) {
        var toolbar = document.getElementById("af-toolbar");
        var attempts = 0;
        var timer;

        if (toolbar) {
            callback(toolbar);
            return;
        }

        timer = setInterval(function () {
            var found;

            attempts++;
            found = document.getElementById("af-toolbar");
            if (found) {
                clearInterval(timer);
                callback(found);
            } else if (attempts >= 40) {
                clearInterval(timer);
            }
        }, 50);
    }

    function setButtonHtml(html) {
        if (state.button) {
            state.button.innerHTML = html;
        }
    }

    function updateControlState() {
        if (!state.button || !state.select) {
            return;
        }

        state.button.hidden = !state.versionOptions.length;
        state.select.hidden = !state.versionOptions.length;
        if (state.separator) {
            state.separator.hidden = !state.versionOptions.length;
        }
        state.select.disabled = state.loading || !state.versionOptions.length;
        state.button.disabled = state.loading;
        state.button.classList.toggle("af-diff-active", state.active);
        state.button.setAttribute("aria-pressed", state.active ? "true" : "false");

        if (state.loading) {
            setButtonHtml("<i class='fa-solid'>&#xf110;</i> Diffing");
        } else if (state.active) {
            setButtonHtml("<i class='fa-solid'>&#xf057;</i> Hide Diff");
        } else {
            setButtonHtml("<i class='fa-solid'>&#xf13e;</i> Diff");
        }

        if (!state.lastButtonTitle) {
            state.button.title = state.active ? "Hide in-place diff markers" : "Show in-place diff markers";
        }
    }

    function populateVersionSelect(options) {
        state.select.textContent = "";
        options.forEach(function (option, index) {
            var item = document.createElement("option");

            item.value = String(index);
            item.textContent = option.label;
            if (index === state.selectedIndex) {
                item.selected = true;
            }
            state.select.appendChild(item);
        });
    }

    function injectControls(toolbar, config) {
        var control;
        var button;
        var select;
        var sep;

        if (document.getElementById(BUTTON_ID)) {
            return;
        }

        control = document.createElement("span");
        control.className = "af-diff-control";

        button = document.createElement("button");
        button.id = BUTTON_ID;
        button.type = "button";
        button.className = "af-ann-btn af-ann-btn-edit af-diff-btn";
        button.hidden = true;
        button.setAttribute("aria-pressed", "false");
        button.addEventListener("click", toggleDiff);

        select = document.createElement("select");
        select.id = SELECT_ID;
        select.className = "af-diff-select";
        select.hidden = true;
        select.setAttribute("aria-label", "Previous version to compare");
        select.addEventListener("change", function () {
            state.selectedIndex = Number(select.value);
            if (state.active) {
                runDiffForSelection();
            }
        });

        sep = document.createElement("span");
        sep.className = "af-ann-sep af-diff-sep";
        sep.setAttribute("aria-hidden", "true");

        control.appendChild(button);
        control.appendChild(select);

        toolbar.insertBefore(sep, toolbar.firstChild);
        toolbar.insertBefore(control, toolbar.firstChild);

        state.button = button;
        state.select = select;
        state.separator = sep;
        state.lastButtonTitle = "";
        updateControlState();

        resolveVersionOptions(config).then(function (options) {
            state.versionOptions = options;
            state.selectedIndex = options.length ? options.length - 1 : 0;
            populateVersionSelect(options);
            updateControlState();
        });
    }

    /* ---- Styles -------------------------------------------------------- */

    function injectStyles() {
        var style;

        if (document.getElementById(STYLE_ID)) {
            return;
        }

        style = document.createElement("style");
        style.id = STYLE_ID;
        style.textContent = [
            "/* ---- Toolbar Diff controls ---- */",
            ".af-diff-control { display: inline-flex; align-items: center; gap: .35rem; }",
            ".af-diff-control[hidden], .af-diff-select[hidden], .af-diff-btn[hidden], .af-diff-sep[hidden] { display: none !important; }",
            ".af-diff-btn.af-diff-active { background: #0969da; border-color: #0969da; color: #fff; }",
            ".af-diff-btn:disabled { opacity: .55; cursor: wait; }",
            ".af-toolbar .af-diff-select { min-width: 7rem; max-width: 9rem; font-size: .8rem; }",
            "/* ---- In-place gutter rail ---- */",
            "html.af-diff-mode .af-diff-rail-host { position: relative; }",
            ".af-diff-floating-rail { position: absolute; z-index: 900; width: 28px; pointer-events: none; }",
            ".af-diff-marker-layer { position: absolute; inset: 0; z-index: 45; pointer-events: none; }",
            ".af-diff-marker { position: absolute; left: 50%; transform: translateX(-50%); width: 6px; min-height: 12px; border: 0; border-radius: 4px; padding: 0; cursor: pointer; pointer-events: auto; transition: width .12s ease, box-shadow .12s ease, background .12s ease; }",
            ".af-diff-marker-changed { background: #0969da; }",
            ".af-diff-marker-new { background: #1a7f37; cursor: default; }",
            ".af-diff-marker-deleted { display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 5px; background: #cf222e; color: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.24); font-size: 12px; font-family: 'Font Awesome 6 Free', 'Font Awesome 5 Free', Arial, sans-serif; font-weight: 900; }",
            ".af-diff-marker-changed:hover, .af-diff-marker-changed:focus, .af-diff-marker-changed.af-diff-marker-open { width: 9px; box-shadow: 0 0 0 3px #ddf4ff; outline: none; }",
            ".af-diff-marker-deleted:hover, .af-diff-marker-deleted:focus, .af-diff-marker-deleted.af-diff-marker-open { box-shadow: 0 0 0 3px #ffebe9, 0 1px 3px rgba(0,0,0,.24); outline: none; }",
            ".af-diff-marker-deleted i { transition: transform .15s ease; }",
            ".af-diff-marker-deleted.af-diff-marker-open i { transform: rotate(90deg); }",
            ".af-diff-host { position: relative; }",
            ".af-diff-panel-anchor { position: relative; height: 0; margin: 0; padding: 0; border: 0; overflow: visible; }",
            // Open panel anchors must not clip the floating reveal.
            ".af-diff-host.af-diff-panel-open { overflow: visible; }",
            ".af-diff-deleted-anchor { height: 34px; margin: 0; padding: 0; border: 0; }",
            ".af-diff-prev-panel { position: absolute; left: 0; right: 0; top: calc(100% - 4px); z-index: 60; opacity: 0; visibility: hidden; transform: translateY(-6px); transition: opacity .16s ease, transform .16s ease, visibility 0s linear .16s; pointer-events: none; margin: 0; padding: 12px 16px; max-height: 60vh; overflow: auto; color: #1f2328; background: #fff; border: 1px solid #d8dee4; border-radius: 8px; box-shadow: 0 10px 28px rgba(31,35,40,.18), 0 2px 6px rgba(31,35,40,.10); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 14px; line-height: 1.5; }",
            ".af-diff-panel-open > .af-diff-prev-panel { opacity: 1; visibility: visible; transform: translateY(0); pointer-events: auto; transition: opacity .16s ease, transform .16s ease, visibility 0s; }",
            ".af-diff-prev-label { display: flex; align-items: center; gap: 8px; margin-bottom: 7px; color: #57606a; font-size: 11.5px; }",
            ".af-diff-prev-badge { border-radius: 999px; padding: 0 8px; font-weight: 600; }",
            ".af-diff-prev-badge-changed { color: #0969da; background: #ddf4ff; border: 1px solid #80b9ff; }",
            ".af-diff-prev-badge-deleted { color: #cf222e; background: #ffebe9; border: 1px solid #ff9492; }",
            ".af-diff-prev-body { border: 1px dashed #d8dee4; border-radius: 7px; padding: 10px 14px; background: #fbfcfd; white-space: pre-wrap; overflow-wrap: anywhere; }",
            ".af-diff-prev-body-deleted { border-style: solid; border-color: #ff9492; background: #fff6f5; color: #6f2a2c; text-decoration: line-through; text-decoration-color: rgba(207,34,46,.45); }",
            // Structured (list/table/code) bodies keep their own markup, so drop the
            // base pre-wrap that is only meant for flattened paragraph text.
            // Reset inherited white-space so panel chrome and rich markup are stable
            // across artefact themes.
            ".af-diff-prev-panel { white-space: normal; }",
            ".af-diff-prev-body-rich { white-space: normal; }",
            ".af-diff-token-del { background: #ffebe9; color: #82131b; border-radius: 3px; padding: 0 2px; text-decoration: line-through; }",
            ".af-diff-token-ins { background: #e6ffec; color: #0f5323; border-radius: 3px; padding: 0 2px; box-shadow: inset 0 -1px 0 #91d99f; text-decoration: none; }",
            "/* ---- Structured reveal: lists ---- */",
            ".af-diff-prev-list { margin: 0; padding-left: 1.45rem; list-style-position: outside; }",
            ".af-diff-prev-list li.af-diff-line { margin: 4px 0; padding: 2px 7px; border-radius: 4px; line-height: 1.45; }",
            ".af-diff-line-changed { background: #ddf4ff; }",
            ".af-diff-line-add { background: #e6ffec; }",
            ".af-diff-line-add::marker { color: #1a7f37; }",
            ".af-diff-line-del { background: #ffebe9; }",
            ".af-diff-line-del::marker { color: #cf222e; }",
            "/* ---- Structured reveal: tables ---- */",
            ".af-diff-prev-table { border-collapse: collapse; width: 100%; margin: 0; }",
            ".af-diff-prev-table th, .af-diff-prev-table td { border: 1px solid #d8dee4; padding: 6px 9px; text-align: left; vertical-align: top; }",
            ".af-diff-prev-table th { background: #f6f8fa; font-weight: 600; }",
            ".af-diff-cell-changed { background: #ddf4ff; }",
            ".af-diff-cell-del { background: #ffebe9; }",
            "/* ---- Structured reveal: code ---- */",
            ".af-diff-prev-code { margin: 0; padding: 8px 10px; max-width: 100%; overflow: auto; white-space: pre; background: #0d1117; color: #e6edf3; border-radius: 6px; font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace; font-size: 12.5px; line-height: 1.55; }",
            ".af-diff-code-line { display: block; min-width: max-content; padding: 0 8px 0 1.65rem; position: relative; }",
            ".af-diff-code-line::before { position: absolute; left: .35rem; width: .8rem; text-align: center; opacity: .9; }",
            ".af-diff-code-equal::before { content: ' '; }",
            ".af-diff-code-add::before { content: '+'; color: #7ee787; }",
            ".af-diff-code-del::before { content: '-'; color: #ffa198; }",
            ".af-diff-code-changed::before { content: '~'; color: #79c0ff; }",
            ".af-diff-code-changed { background: rgba(56,139,253,.18); }",
            ".af-diff-code-add { background: rgba(46,160,67,.22); }",
            ".af-diff-code-del { background: rgba(248,81,73,.20); }",
            ".af-diff-prev-code .af-diff-token-del { background: rgba(248,81,73,.35); color: #ffdcd7; }",
            ".af-diff-prev-code .af-diff-token-ins { background: rgba(46,160,67,.35); color: #d5ffdd; box-shadow: none; }",
            "/* ---- Responsive ---- */",
            "@media (max-width: 820px) {",
            "  .af-diff-select { max-width: 7rem; }",
            "  .af-diff-marker-layer, .af-diff-floating-rail { display: none; }",
            "  html.af-diff-mode .af-diff-prev-panel { position: static; opacity: 1; visibility: visible; transform: none; pointer-events: auto; margin: .6rem 0; max-height: none; }",
            "  .af-diff-marker { display: none; }",
            "}"
        ].join("\n");
        document.head.appendChild(style);
    }

    /* ---- Boot ---------------------------------------------------------- */

    function init() {
        try {
            if (diffDisabled()) {
                return;
            }

            var config = readConfig();

            injectStyles();
            whenToolbarReady(function (toolbar) {
                injectControls(toolbar, config);
            });

            if (window.Artefact) {
                window.Artefact.diff = {
                    open: function () {
                        if (!state.active) {
                            activateDiff();
                        }
                    },
                    close: deactivateDiff
                };
            }
        } catch (error) {
            if (window.console && window.console.warn) {
                window.console.warn("artefact-diff disabled:", error);
            }
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
