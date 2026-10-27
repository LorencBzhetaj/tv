(function () {
  "use strict";
  var video = document.getElementById("video"), surface = document.getElementById("av-surface");
  var stage = document.getElementById("stage"), message = document.getElementById("message");
  var metadata = document.getElementById("metadata"), logView = document.getElementById("video-log");
  var buttons = Array.prototype.slice.call(document.querySelectorAll("#video-controls button"));
  var rows = document.querySelectorAll("#observations li"), av = window.webapis && window.webapis.avplay;
  var engine = "none", spec = { engine: "html", format: "mp4" }, state = "NONE";
  var busy = "", pendingStop = false, pendingReturn = false, full = false, selected = 0;
  var epoch = 0, timer = null, previousTime = null, time = 0, duration = 0, targetSeek = null;
  var invalid = false, hadError = false, recovering = false, entries = [], held = {};
  var codes = { 37: "Left", 38: "Up", 39: "Right", 40: "Down", 13: "OK", 10009: "Back", 27: "Back" };

  function log(text) {
    entries.unshift(new Date().toISOString().slice(11, 23) + " " + text);
    if (entries.length > 24) entries.length = 24;
    logView.textContent = entries.join("\n");
  }
  function observe(id, status, detail) {
    for (var i = 0; i < rows.length; i++) if (rows[i].getAttribute("data-test") === id) {
      rows[i].className = status.toLowerCase(); rows[i].textContent = status + " · " + detail;
    }
  }
  function fixtureKey() { return spec.engine + "-" + spec.format; }
  function info() {
    metadata.textContent = "Player=" + engine + " fixture=" + spec.format + " state=" + state +
      " busy=" + (busy || "no") + "\nTime=" + time.toFixed(2) + " / " + duration.toFixed(2) +
      " s\n" + (spec.format === "https-hls" ? "Apple gear1 / H.264 Main L2.1 / 400×300 / AAC-LC" : "Local 640×360 / 24 fps / H.264 Baseline L3.0 / AAC-LC") + "\nHTML5 HLS hint=" +
      (video.canPlayType("application/vnd.apple.mpegurl") || "empty") + "; screen observations need user confirmation";
  }
  var avDiagnostic = document.getElementById("av-diagnostic");
  var avStage = "API availability", avLast = "none", avFailure = "", avDetail = "", avSource = "not resolved", avAttempt = -1;
  function redact(value) {
    return String(value == null ? "" : value).slice(0, 4096)
      .replace(/(?:https?:|file:|wgt:)[^\s"'<>]*/gi, "[URI]")
      .replace(/(?:[A-Z]:[\\/]|\/)[^\s"'<>]*/gi, "[path]")
      .replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, "[IP]")
      .replace(/\b[0-9a-f]{16,}\b/gi, "[identifier]")
      .replace(/((?:password|passwd|token|secret|authorization|cookie|duid|device[_ -]?id)["']?\s*[:=]\s*)[^,;\n}]*/gi, "$1[redacted]")
      .replace(/[\x00-\x1f\x7f]/g, " ").slice(0, 300);
  }
  function avError(error) {
    if (!error || typeof error !== "object") return redact(error || "UnknownError");
    return "name=" + redact(error.name || "UnknownError") + " code=" + redact(error.code == null ? "none" : error.code) + " message=" + redact(error.message || "none");
  }
  function renderAV() {
    avDiagnostic.className = avFailure ? "fail" : avLast === "none" ? "" : "pass";
    avDiagnostic.textContent = "AVPlay R5 · " + (avFailure ? "FAIL" : avLast === "none" ? "PENDING" : "PASS (stages only)") +
      "\nAPI: webapis=" + Boolean(window.webapis) + " avplay=" + Boolean(av) + " · scheme=" + redact(window.location.protocol || new URL(window.location.href).protocol) +
      "\nCurrent=" + avStage + " · Last completed=" + avLast +
      "\nSource=" + avSource + "\nFailure=" + (avFailure || "none") + (avDetail ? "\nDetail=" + avDetail : "");
  }
  function avBegin(stageName) { avStage = stageName; log("AV begin " + stageName); renderAV(); }
  function avDone(stageName) { avLast = stageName; log("AV PASS " + stageName); renderAV(); }
  function avFault(error, stageName) {
    var detail = avError(error);
    if (!avFailure) avFailure = (stageName || avStage) + " · last=" + avLast + " · " + detail;
    log("AV FAIL " + (stageName || avStage) + " " + detail); renderAV();
  }
  function safeError(error) { if (engine === "av") return avError(error); return String(error && error.name ? error.name : error || "UnknownError").replace(/[^A-Za-z0-9_]/g, "").slice(0, 64); }
  function isPlaying() { return engine === "html" ? !video.paused : engine === "av" && state === "PLAYING"; }
  function displayRect() {
    if (engine !== "av" || busy || ["IDLE", "READY", "PLAYING", "PAUSED"].indexOf(state) < 0) return;
    var r = stage.getBoundingClientRect();
    av.setDisplayRect(Math.round(r.left * 1920 / window.innerWidth), Math.round(r.top * 1080 / window.innerHeight),
      Math.round(r.width * 1920 / window.innerWidth), Math.round(r.height * 1080 / window.innerHeight));
  }
  function fullscreen(value) {
    if (busy) { message.textContent = "Wait for asynchronous preparation/seek before changing display."; return; }
    full = value; document.body.className = full ? "cinema" : "";
    document.getElementById("fullscreen-hint").hidden = !full;
    try { displayRect(); observe("fullscreen", "PASS", "In-app layout " + (full ? "expanded" : "restored") + "; verify picture"); }
    catch (error) { observe("fullscreen", "FAIL", "Display API: " + safeError(error)); }
    if (!full && !document.hidden) buttons[selected].focus();
    log("fullscreen layout=" + full);
  }
  function stopAll() {
    if (busy) { pendingStop = true; message.textContent = "Stop queued until asynchronous operation completes; controls remain responsive."; return false; }
    clearTimeout(timer); var hadPlayer = engine !== "none";
    if (engine === "av") {
      try {
        avBegin("stop/close");
        state = av.getState();
        if (["READY", "PLAYING", "PAUSED"].indexOf(state) >= 0) av.stop();
        av.close(); avDone("stop/close");
      } catch (error) { avFault(error, "stop/close"); message.textContent = "Close failed: " + safeError(error) + ". No new player will be opened."; log("close failed " + safeError(error)); return false; }
    }
    engine = "none"; epoch++; state = "NONE";
    video.pause(); video.removeAttribute("src"); video.load();
    surface.hidden = true; video.hidden = false;
    pendingStop = false; targetSeek = null; previousTime = null; time = 0; duration = 0;
    if (full) fullscreen(false);
    if (hadPlayer) observe("controls", "PASS", "Player stopped/closed; no active playback");
    log("all players stopped/closed"); info(); return true;
  }
  function returnToR1() {
    if (full) { fullscreen(false); return; }
    pendingReturn = true;
    if (stopAll()) window.location.href = "index.html";
  }
  function finishAsync() {
    busy = ""; clearTimeout(timer);
    if (pendingStop) {
      if (stopAll() && pendingReturn) window.location.href = "index.html";
      return true;
    }
    return false;
  }
  function fail(error) {
    if (engine === "av") avFault(error);
    clearTimeout(timer);
    if (invalid) {
      hadError = true; observe("error", "PASS", "Intentional bad fixture error: " + safeError(error));
      message.textContent = "Expected error captured. Recover loads valid media; Play remains explicit.";
    } else {
      observe(fixtureKey(), "FAIL", "Player error: " + safeError(error));
      if (recovering) observe("recovery", "FAIL", "Recovery error: " + safeError(error));
      message.textContent = "Playback error. No automatic retry; inspect the redacted log.";
    }
    log("error " + safeError(error) + " expected=" + invalid); info();
  }
  function watchdog(kind) {
    clearTimeout(timer);
    timer = setTimeout(function () {
      observe(invalid ? "error" : fixtureKey(), "FAIL", kind + " timeout after 20 seconds");
      message.textContent = "Timeout; no automatic retry. If AVPlay is busy, Stop/Back queues cleanup until its callback.";
      if (engine === "av") avFault("Timeout after 20 seconds", busy === "prepare" ? "prepareAsync" : "seek");
      log(kind + " timeout");
    }, 20000);
  }
  function clock(value) {
    time = value;
    if (!invalid && isPlaying() && previousTime !== null && value > previousTime + 0.05) {
      observe(fixtureKey(), "PASS", spec.engine + " " + spec.format + " playback clock advanced; confirm picture/sound");
      if (recovering) { observe("recovery", "PASS", "Clock advanced after explicit recovery/play"); recovering = false; }
    }
    previousTime = value; info();
  }
  function localPath(relative) {
    var resolved = new URL(relative, window.location.href);
    if (resolved.protocol !== "file:") throw new Error("UnsupportedLocalScheme");
    return decodeURIComponent(resolved.pathname);
  }
  function load(chosen, bad, recovery) {
    if (!stopAll()) return;
    pendingReturn = false; spec = chosen; invalid = Boolean(bad); recovering = Boolean(recovery);
    previousTime = null; time = 0;
    observe("visible", "PENDING", "Moving picture requires user confirmation for this selection");
    observe("audible", "PENDING", "TV-speaker sound requires user confirmation for this selection");
    observe("metadata", "PENDING", "Loading/preparing " + fixtureKey());
    observe("controls", "PENDING", "Play/pause/resume this selection");
    observe("seek", "PENDING", "Seek this selection");
    if (invalid) { hadError = false; observe("error", "PENDING", "Waiting for intentional error"); }
    else observe(fixtureKey(), "PENDING", "Explicit Play and advancing clock required");
    if (recovering) observe("recovery", "PENDING", "Recovery requires explicit Play and advancing clock");
    var path = invalid ? "media/invalid-video.mp4" : spec.format === "hls" ? "media/hls/playlist.m3u8" : "media/video-test.mp4";
    message.textContent = "Loading only; choose Play after READY. Choose local or HTTPS HLS explicitly; no fallback.";
    log("load " + fixtureKey() + " invalid=" + invalid);
    if (spec.engine === "html") {
      if (spec.format === "hls" && !invalid && !video.canPlayType("application/vnd.apple.mpegurl")) log("HTML5 HLS hint empty; explicit fixture load still tested");
      engine = "html"; state = "LOADING"; video.src = path; video.load(); watchdog("HTML5 load"); info(); return;
    }
    avStage = "API availability"; avLast = "none"; avFailure = ""; avDetail = ""; avSource = "not resolved"; avAttempt = epoch; avBegin("API availability");
    if (!av) { avFault("AVPlay API unavailable"); observe("availability", "UNSUPPORTED", "Samsung AVPlay API unavailable"); observe(fixtureKey(), "UNSUPPORTED", "AVPlay unavailable"); info(); return; }
    avDone("API availability");
    observe("availability", "PASS", "AVPlay API present");
    engine = "av"; surface.hidden = false; video.hidden = true;
    var token = epoch;
    try {
      avBegin("Source resolution");
      var absolute;
      if (spec.format === "https-hls" && !invalid) {
        absolute = "https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_4x3/gear1/prog_index.m3u8";
        avSource = "R8 Apple Bip Bop HTTPS HLS gear1; fixed URL unchanged";
      } else if (spec.format === "mp4" && !invalid) {
        var packagedPath = "wgt-package/media/video-test.mp4";
        if (!window.tizen || !window.tizen.filesystem) throw new Error("FilesystemAPIUnavailable");
        var filesystem = window.tizen.filesystem;
        if (!filesystem.pathExists(packagedPath) || !filesystem.isFile(packagedPath)) throw new Error("PackagedMP4NotAccessible");
        absolute = filesystem.toURI(packagedPath);
        if (typeof absolute !== "string" || !absolute) throw new Error("FilesystemReturnedEmptyURI");
        avSource = "R6 filesystem.toURI unchanged; fixture=" + path + "; exists=true; isFile=true";
      } else if (spec.format === "hls" && !invalid) {
        var playlistPath = "wgt-package/media/hls/playlist.m3u8";
        if (!window.tizen || !window.tizen.filesystem) throw new Error("FilesystemAPIUnavailable");
        var hlsFilesystem = window.tizen.filesystem;
        var hlsFiles = ["playlist.m3u8", "segment-00.ts", "segment-01.ts", "segment-02.ts", "segment-03.ts"];
        for (var hlsIndex = 0; hlsIndex < hlsFiles.length; hlsIndex++) {
          var hlsPath = "wgt-package/media/hls/" + hlsFiles[hlsIndex];
          if (!hlsFilesystem.pathExists(hlsPath) || !hlsFilesystem.isFile(hlsPath)) throw new Error("PackagedHLSNotAccessible:" + hlsFiles[hlsIndex]);
        }
        absolute = hlsFilesystem.toURI(playlistPath);
        if (typeof absolute !== "string" || !absolute) throw new Error("FilesystemReturnedEmptyURI");
        avSource = "R7 filesystem.toURI unchanged; playlist + 4 segments accessible";
      } else {
        absolute = localPath(path);
        avSource = "absolute local pathname; fixture=" + path + "; leadingSlash=" + (absolute.charAt(0) === "/");
      }
      avDone("Source resolution"); avBegin("open");
      av.open(absolute); state = av.getState(); avDone("open");
      avBegin("listener/display setup");
      av.setListener({
        onbufferingstart: function () { if (token !== epoch) return; observe("buffer", "PASS", "AVPlay buffering-start event"); log("AV buffering start"); },
        onbufferingprogress: function (percent) { if (token !== epoch) return; log("AV buffer " + Number(percent) + "%"); },
        onbufferingcomplete: function () { if (token === epoch) log("AV buffering complete"); },
        oncurrentplaytime: function (ms) { if (token === epoch) clock(Number(ms) / 1000); },
        onstreamcompleted: function () { if (token !== epoch) return; log("AV stream complete"); stopAll(); },
        onerror: function (error) { if (token !== epoch) return; busy = ""; fail(error); stopAll(); },
        onerrormsg: function (error, errorMsg) {
          if (token !== avAttempt) return;
          avDetail = "event=" + avError(error) + " message=" + redact(errorMsg);
          avFault(error); log("AV detail " + avDetail); renderAV();
        }
      });
      displayRect(); av.setDisplayMethod("PLAYER_DISPLAY_MODE_LETTER_BOX");
      avDone("listener/display setup"); avBegin("prepareAsync");
      busy = "prepare"; watchdog("AV prepare");
      av.prepareAsync(function () {
        if (token !== epoch || finishAsync()) return;
        state = av.getState(); duration = av.getDuration() / 1000; avDone("prepareAsync");
        observe("metadata", state === "READY" && Number.isFinite(duration) && duration > 0 ? "PASS" : "FAIL", "AV prepared state=" + state + " duration=" + duration.toFixed(2));
        message.textContent = "AVPlay prepared. Press Play; nothing autoplays."; log("AV READY"); info();
      }, function (error) {
        if (token !== epoch || finishAsync()) return;
        fail(error); stopAll();
      });
    } catch (error) { busy = ""; fail(error); stopAll(); }
    info();
  }
  function play() {
    if (busy || engine === "none" || invalid) { message.textContent = "Load a valid fixture and wait for READY."; return; }
    try {
      if (engine === "html") {
        if (video.readyState < 1 || video.error) { message.textContent = "Wait for valid metadata."; return; }
        var token = epoch, result = video.play();
        if (result && result.catch) result.catch(function (error) { if (engine === "html" && token === epoch) fail(error); });
      } else {
        avBegin("play");
        state = av.getState();
        if (["READY", "PLAYING", "PAUSED"].indexOf(state) < 0) { message.textContent = "AVPlay needs preparation."; return; }
        av.play(); state = av.getState(); avDone("play"); observe("controls", "PASS", "AV play/resume state=" + state);
      }
      log("explicit play/resume"); info();
    } catch (error) { fail(error); }
  }
  function pause() {
    if (busy) { message.textContent = "Wait for asynchronous operation."; return; }
    try {
      if (engine === "html") video.pause();
      else if (engine === "av" && ["PLAYING", "PAUSED"].indexOf(state) >= 0) {
        avBegin("pause"); av.pause(); state = av.getState(); avDone("pause"); observe("controls", "PASS", "AV pause state=" + state);
      }
      log("explicit pause"); info();
    } catch (error) { fail(error); }
  }
  function seek(delta) {
    if (busy || engine === "none" || invalid || duration <= 0) { message.textContent = "Seek needs prepared media and no pending async operation."; return; }
    var target = Math.max(0, Math.min(duration - 0.15, time + delta));
    try {
      if (engine === "html") { targetSeek = target; video.currentTime = target; }
      else {
        if (["READY", "PLAYING", "PAUSED"].indexOf(state) < 0) return;
        avBegin("seek"); busy = "seek"; watchdog("AV seek"); var token = epoch;
        av.seekTo(Math.round(target * 1000), function () {
          if (token !== epoch || finishAsync()) return;
          time = av.getCurrentTime() / 1000; previousTime = time; avDone("seek");
          observe("seek", Math.abs(time - target) <= 1 ? "PASS" : "FAIL", "AV seek callback: " + time.toFixed(2) + " s"); info();
        }, function (error) { if (token === epoch && !finishAsync()) { observe("seek", "FAIL", safeError(error)); log("seek failed " + safeError(error)); } });
      }
      log("seek target=" + target.toFixed(2));
    } catch (error) { busy = ""; observe("seek", "FAIL", safeError(error)); }
  }
  var actions = {
    "html-mp4": function () { load({ engine: "html", format: "mp4" }, false, false); },
    "html-hls": function () { load({ engine: "html", format: "hls" }, false, false); },
    "av-mp4": function () { load({ engine: "av", format: "mp4" }, false, false); },
    "av-hls": function () { load({ engine: "av", format: "hls" }, false, false); },
    "av-https-hls": function () { load({ engine: "av", format: "https-hls" }, false, false); },
    play: play, pause: pause,
    "seek-back": function () { seek(-3); }, "seek-forward": function () { seek(3); },
    stop: function () { if (stopAll()) message.textContent = "Stopped. Select a load action to prepare again."; },
    fullscreen: function () { if (engine !== "none") fullscreen(!full); },
    "fail-load": function () { load(spec, true, false); },
    recover: function () { if (hadError) load(spec, false, true); else message.textContent = "First capture an intentional load error."; },
    seen: function () { if (isPlaying()) observe("visible", "PASS", "User confirms moving picture for " + fixtureKey()); else message.textContent = "Play first; confirm only a visible moving picture."; },
    heard: function () { if (isPlaying()) observe("audible", "PASS", "User confirms TV-speaker sound for " + fixtureKey()); else message.textContent = "Play first; confirm only sound heard through TV speakers."; },
    "not-av": function () { observe(fixtureKey(), "FAIL", "User reports picture/sound issue; record precise symptom"); },
    "return": returnToR1
  };
  buttons.forEach(function (button, index) {
    button.addEventListener("focus", function () { selected = index; log("focus " + button.id); });
    button.addEventListener("click", function () { log("action " + button.id); actions[button.id](); });
  });
  video.addEventListener("loadedmetadata", function () {
    if (engine !== "html") return; clearTimeout(timer); state = "READY"; duration = video.duration;
    observe("metadata", Number.isFinite(duration) && duration > 0 ? "PASS" : "FAIL", "HTML metadata " + video.videoWidth + "×" + video.videoHeight + " duration=" + duration.toFixed(2));
    log("HTML metadata"); info();
  });
  video.addEventListener("playing", function () { if (engine === "html") { state = "PLAYING"; observe("controls", "PASS", "HTML playing event"); log("HTML playing"); info(); } });
  video.addEventListener("pause", function () { if (engine === "html" && state === "PLAYING") { state = "PAUSED"; observe("controls", "PASS", "HTML pause event"); log("HTML pause"); info(); } });
  video.addEventListener("timeupdate", function () { if (engine === "html") clock(video.currentTime); });
  video.addEventListener("seeked", function () {
    if (engine === "html" && targetSeek !== null) { observe("seek", Math.abs(video.currentTime - targetSeek) < 0.75 ? "PASS" : "FAIL", "HTML seeked time=" + video.currentTime.toFixed(2)); targetSeek = null; log("HTML seeked"); }
  });
  video.addEventListener("error", function () { if (engine === "html") { state = "ERROR"; fail("MediaError" + (video.error ? video.error.code : "Unknown")); } });
  ["waiting", "stalled", "progress", "ended"].forEach(function (event) {
    video.addEventListener(event, function () { if (engine !== "html") return; log("HTML " + event); if (event === "waiting" || event === "stalled") observe("buffer", "PASS", "HTML " + event + " observed"); if (event === "ended") state = "ENDED"; info(); });
  });
  document.addEventListener("keydown", function (event) {
    var key = codes[event.keyCode] || { ArrowLeft: "Left", ArrowRight: "Right", ArrowUp: "Up", ArrowDown: "Down", Enter: "OK", Escape: "Back", GoBack: "Back", BrowserBack: "Back" }[event.key];
    if (!key) return; event.preventDefault();
    if ((key === "OK" || key === "Back") && (held[key] || event.repeat)) return;
    held[key] = true; log("key " + key);
    if (key === "Back") { returnToR1(); return; }
    if (full) { if (key === "OK") { if (isPlaying()) pause(); else play(); } else if (key === "Left") seek(-3); else if (key === "Right") seek(3); return; }
    if (key === "OK") { buttons[selected].click(); return; }
    var row = Math.floor(selected / 4), col = selected % 4;
    if (key === "Up") row = Math.max(0, row - 1); if (key === "Down") row = Math.min(Math.floor((buttons.length - 1) / 4), row + 1);
    if (key === "Left") col = Math.max(0, col - 1); if (key === "Right") col = Math.min(3, col + 1);
    buttons[Math.min(buttons.length - 1, row * 4 + col)].focus();
  });
  document.addEventListener("keyup", function (event) { delete held[codes[event.keyCode] || { Enter: "OK", Escape: "Back", GoBack: "Back", BrowserBack: "Back" }[event.key]]; });
  document.addEventListener("visibilitychange", function () {
    held = {}; if (document.hidden) { stopAll(); log("hidden: cleanup; no auto-resume"); }
    else { buttons[selected].focus(); message.textContent = "Returned. Load and Play explicitly; no auto-resume."; }
  });
  window.addEventListener("blur", function () { held = {}; });
  window.addEventListener("focus", function () { if (!document.hidden && !full) buttons[selected].focus(); });
  window.addEventListener("pagehide", function () { stopAll(); });
  observe("availability", av ? "PASS" : "UNSUPPORTED", av ? "Samsung AVPlay API object present; loading is explicit" : "AVPlay API object absent");
  renderAV();
  buttons[0].focus(); info(); log("R5 ready; no player opened; no autoplay");
}());
