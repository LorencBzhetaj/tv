(function () {
  "use strict";
  var audio = document.getElementById("audio");
  var buttons = Array.prototype.slice.call(document.querySelectorAll("#audio-controls button"));
  var rows = document.querySelectorAll("#observations li");
  var message = document.getElementById("message");
  var metadata = document.getElementById("metadata");
  var logView = document.getElementById("audio-log");
  var entries = [];
  var selected = 0;
  var mode = "none";
  var hadExpectedError = false;
  var recovering = false;
  var hasPlayed = false;
  var userPaused = false;
  var pauseRequested = false;
  var resumeRequested = false;
  var previousTime = null;
  var loadTimer = null;
  var volumeTimer = null;
  var volumeExpected = null;
  var held = {};
  var keys = { 37: "Left", 38: "Up", 39: "Right", 40: "Down", 13: "OK", 10009: "Back", 27: "Back" };

  function log(text) {
    entries.unshift(new Date().toISOString().slice(11, 23) + " " + text);
    if (entries.length > 24) entries.length = 24;
    logView.textContent = entries.join("\n");
  }
  function observe(id, state, detail) {
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].getAttribute("data-test") === id) {
        rows[i].className = state.toLowerCase();
        rows[i].textContent = state + " · " + detail;
      }
    }
  }
  function info() {
    var duration = Number.isFinite(audio.duration) ? audio.duration.toFixed(2) + " s" : "not loaded";
    metadata.textContent = "MP3 / 44.1 kHz / mono / 96 kbit/s (fixture)\nDuration: " + duration +
      " | time: " + audio.currentTime.toFixed(2) + " s\nreadyState=" + audio.readyState +
      " networkState=" + audio.networkState + " paused=" + audio.paused +
      "\nmuted=" + audio.muted + " volume=" + audio.volume.toFixed(1) +
      ' | canPlayType(audio/mpeg)="' + audio.canPlayType("audio/mpeg") + '"';
  }
  function load(invalid, recovery) {
    clearTimeout(loadTimer);
    pauseRequested = false;
    audio.pause();
    mode = invalid ? "invalid" : "valid";
    recovering = Boolean(recovery);
    previousTime = null;
    hasPlayed = false;
    userPaused = false;
    resumeRequested = false;
    if (invalid) {
      hadExpectedError = false;
      observe("error", "PENDING", "Waiting for intentional invalid-file error");
    } else {
      observe("metadata", "PENDING", "Loading valid fixture metadata");
      if (recovering) observe("recovery", "PENDING", "Recovery requires metadata and explicit Play");
    }
    audio.src = invalid ? "media/invalid-audio.mp3" : "media/audio-test.mp3";
    audio.load();
    message.textContent = invalid ? "Intentional failure requested. Wait for error, then Recover." : "Loading only. Choose Play after metadata appears.";
    log("load " + mode + (recovering ? " recovery" : ""));
    loadTimer = setTimeout(function () {
      observe(invalid ? "error" : "metadata", "FAIL", "No expected load result within 15 seconds");
      message.textContent = "Load timeout. No automatic retry; inspect the log.";
      log("load timeout " + mode);
    }, 15000);
    info();
  }
  function returnToR1() {
    pauseRequested = false;
    audio.pause();
    clearTimeout(loadTimer);
    clearTimeout(volumeTimer);
    window.location.href = "index.html";
  }
  function changeVolume(kind, value) {
    clearTimeout(volumeTimer);
    volumeExpected = { kind: kind, value: value };
    observe(kind, "PENDING", "Waiting for " + kind + " property/event");
    try {
      if (kind === "volume") audio.volume = value; else audio.muted = value;
      volumeTimer = setTimeout(function () {
        observe(kind, "FAIL", "No matching volumechange event within 2 seconds");
        volumeExpected = null;
      }, 2000);
    } catch (error) {
      volumeExpected = null;
      observe(kind, "FAIL", error.message);
      log("volume API error " + error.message);
    }
    info();
  }
  var actions = {
    load: function () { recovering = false; hadExpectedError = false; load(false, false); },
    play: function () {
      if (mode !== "valid" || audio.readyState < 1 || audio.error) {
        message.textContent = "Load valid audio first, then choose Play.";
        return;
      }
      resumeRequested = hasPlayed && userPaused;
      previousTime = audio.currentTime;
      try {
        var result = audio.play();
        if (result && result.catch) result.catch(function (error) {
          observe("play", "FAIL", "play() rejected: " + error.message);
          message.textContent = "Playback rejected. No automatic retry.";
          log("play rejected " + error.message);
        });
      } catch (error) {
        observe("play", "FAIL", "play() threw: " + error.message);
        log("play exception " + error.message);
      }
    },
    pause: function () {
      if (audio.paused) { message.textContent = "Audio is already paused."; return; }
      pauseRequested = true;
      audio.pause();
    },
    mute: function () { changeVolume(audio.muted ? "unmute" : "mute", !audio.muted); },
    quieter: function () { if (audio.volume > 0) changeVolume("volume", Math.max(0, Math.round((audio.volume - 0.1) * 10) / 10)); },
    louder: function () { if (audio.volume < 1) changeVolume("volume", Math.min(1, Math.round((audio.volume + 0.1) * 10) / 10)); },
    "fail-load": function () { load(true, false); },
    recover: function () {
      if (!hadExpectedError) { message.textContent = "First request Test failed load and wait for its error."; return; }
      load(false, true);
    },
    heard: function () {
      if (audio.paused || audio.muted || audio.volume === 0) {
        message.textContent = "Play unmuted audio first; confirm only if you hear the TV speakers.";
        return;
      }
      observe("audible", "PASS", "TV speakers: explicitly confirmed by user");
      log("USER confirms TV speaker sound");
    },
    "not-heard": function () { observe("audible", "FAIL", "User reports no audible sound"); log("USER reports no sound"); },
    stop: function () { pauseRequested = false; audio.pause(); if (audio.readyState >= 1) audio.currentTime = 0; info(); log("stop/rewind"); },
    "return": returnToR1
  };
  buttons.forEach(function (button, index) {
    button.addEventListener("focus", function () { selected = index; log("focus " + button.id); });
    button.addEventListener("click", function () { log("action " + button.id); actions[button.id](); });
  });
  audio.addEventListener("loadedmetadata", function () {
    clearTimeout(loadTimer);
    if (mode === "valid" && Number.isFinite(audio.duration) && audio.duration > 0) {
      observe("metadata", "PASS", "Valid duration " + audio.duration.toFixed(2) + " s");
      message.textContent = "Metadata loaded. Choose Play; listening confirmation stays PENDING.";
    } else observe("metadata", "FAIL", "Unexpected or invalid metadata");
    log("loadedmetadata duration=" + audio.duration); info();
  });
  audio.addEventListener("playing", function () {
    observe("play", "PASS", "playing event received");
    if (resumeRequested) observe("resume", "PASS", "playing after explicit pause");
    if (recovering && hadExpectedError) { observe("recovery", "PASS", "Valid playback after expected load failure"); recovering = false; }
    hasPlayed = true; userPaused = false; resumeRequested = false;
    message.textContent = "Playback active. Confirm TV-speaker sound only if you hear it.";
    log("playing"); info();
  });
  audio.addEventListener("pause", function () {
    if (pauseRequested) { observe("pause", "PASS", "Explicit pause event received"); userPaused = true; }
    pauseRequested = false; log("pause"); info();
  });
  audio.addEventListener("timeupdate", function () {
    if (mode === "valid" && !audio.paused && previousTime !== null && audio.currentTime > previousTime + 0.05) observe("time", "PASS", "Playback clock advanced");
    previousTime = audio.currentTime; info();
  });
  audio.addEventListener("volumechange", function () {
    if (volumeExpected) {
      var actual = volumeExpected.kind === "volume" ? audio.volume : audio.muted;
      if (Math.abs(Number(actual) - Number(volumeExpected.value)) < 0.001) {
        observe(volumeExpected.kind, "PASS", "volumechange and property agree (not an audibility claim)");
        clearTimeout(volumeTimer); volumeExpected = null;
      }
    }
    log("volumechange muted=" + audio.muted + " volume=" + audio.volume); info();
  });
  audio.addEventListener("error", function () {
    clearTimeout(loadTimer);
    var code = audio.error ? audio.error.code : "unknown";
    if (mode === "invalid") {
      hadExpectedError = true;
      observe("error", "PASS", "Intentional load error captured, code " + code);
      message.textContent = "Expected failure captured. Choose Recover, then Play.";
    } else {
      observe("play", "FAIL", "Unexpected media error, code " + code);
      if (recovering) observe("recovery", "FAIL", "Valid fixture failed, code " + code);
      message.textContent = "Unexpected playback error. No automatic retry.";
    }
    log("error code=" + code + " mode=" + mode); info();
  });
  ["loadstart", "canplay", "waiting", "stalled", "ended", "abort", "emptied"].forEach(function (event) {
    audio.addEventListener(event, function () { log(event); info(); });
  });
  document.addEventListener("keydown", function (event) {
    var key = keys[event.keyCode] || { ArrowLeft: "Left", ArrowRight: "Right", ArrowUp: "Up", ArrowDown: "Down", Enter: "OK", Escape: "Back", GoBack: "Back", BrowserBack: "Back" }[event.key];
    if (!key) return;
    event.preventDefault();
    if ((key === "OK" || key === "Back") && (held[key] || event.repeat)) return;
    held[key] = true;
    log("key " + key + " code=" + event.keyCode);
    if (key === "Back") { returnToR1(); return; }
    if (key === "OK") { buttons[selected].click(); return; }
    var row = Math.floor(selected / 3), col = selected % 3;
    if (key === "Up") row = Math.max(0, row - 1);
    if (key === "Down") row = Math.min(3, row + 1);
    if (key === "Left") col = Math.max(0, col - 1);
    if (key === "Right") col = Math.min(2, col + 1);
    buttons[row * 3 + col].focus();
    observe("navigation", "PASS", "Direction handled; focused control " + buttons[selected].id);
  });
  document.addEventListener("keyup", function (event) {
    var key = keys[event.keyCode] || { Enter: "OK", Escape: "Back", GoBack: "Back", BrowserBack: "Back" }[event.key];
    delete held[key];
  });
  document.addEventListener("visibilitychange", function () {
    held = {};
    if (document.hidden) { pauseRequested = false; audio.pause(); log("hidden: paused; no auto-resume"); }
    else { buttons[selected].focus(); log("visible: focus restored; Play required"); }
  });
  window.addEventListener("blur", function () { held = {}; });
  window.addEventListener("focus", function () { if (!document.hidden) buttons[selected].focus(); });
  window.addEventListener("pagehide", function () { pauseRequested = false; audio.pause(); clearTimeout(loadTimer); clearTimeout(volumeTimer); });
  audio.volume = 0.5;
  buttons[0].focus();
  info(); log("R3 loaded; no src, no autoplay, audible PENDING");
}());
