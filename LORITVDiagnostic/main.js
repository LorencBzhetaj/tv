(function () {
  "use strict";

  var tiles = Array.prototype.slice.call(document.querySelectorAll("#focus-grid button"));
  var checks = document.querySelectorAll("#checklist li");
  var overlay = document.getElementById("exit-overlay");
  var cancel = document.getElementById("cancel-exit");
  var exit = document.getElementById("confirm-exit");
  var selection = document.getElementById("selection");
  var lifecycle = document.getElementById("lifecycle");
  var logView = document.getElementById("event-log");
  var exitError = document.getElementById("exit-error");
  var selected = 4;
  var activations = 0;
  var entries = [];
  var counts = {};
  var keyCodes = { 37: "ArrowLeft", 38: "ArrowUp", 39: "ArrowRight", 40: "ArrowDown", 13: "Enter", 10009: "Back", 27: "Back" };

  function log(message) {
    entries.unshift(new Date().toISOString().slice(11, 23) + " " + message);
    if (entries.length > 24) entries.length = 24;
    logView.textContent = entries.join("\n");
  }

  function restoreFocus(reason) {
    if (document.hidden) return;
    var target = overlay.hidden ? tiles[selected] : cancel;
    target.focus();
    log("restore " + reason + " -> " + target.textContent);
  }

  function closePrompt() {
    overlay.hidden = true;
    restoreFocus("cancel exit");
  }

  function openPrompt() {
    overlay.hidden = false;
    exitError.textContent = "";
    cancel.focus();
    log("exit prompt opened; Cancel selected");
  }

  function mark(key) {
    counts[key] = (counts[key] || 0) + 1;
    for (var i = 0; i < checks.length; i++) {
      if (checks[i].getAttribute("data-key") === key) {
        checks[i].className = "observed";
        checks[i].textContent = (key === "Enter" ? "OK" : key.replace("Arrow", "")) + ": observed " + counts[key];
      }
    }
  }

  tiles.forEach(function (tile, index) {
    tile.addEventListener("focus", function () {
      selected = index;
      selection.textContent = tile.textContent + " focused · activations " + activations;
      log("focus " + tile.textContent);
    });
    tile.addEventListener("click", function () {
      activations++;
      selection.textContent = tile.textContent + " activated · activations " + activations;
      log("activate " + tile.textContent);
    });
  });

  cancel.addEventListener("click", closePrompt);
  exit.addEventListener("click", function () {
    log("exit explicitly confirmed");
    try {
      if (!window.tizen || !tizen.application) throw new Error("Tizen application API unavailable");
      tizen.application.getCurrentApplication().exit();
    } catch (error) {
      exitError.textContent = "Exit unavailable: " + error.message + ". Choose Cancel.";
      cancel.focus();
      log("exit failed: " + error.message);
    }
  });

  document.addEventListener("keydown", function (event) {
    var key = keyCodes[event.keyCode] || event.key;
    if (key === "Escape" || key === "GoBack" || key === "BrowserBack") key = "Back";
    if (!/^Arrow(Up|Down|Left|Right)$/.test(key) && key !== "Enter" && key !== "Back") {
      if (key === "Tab" && !overlay.hidden) {
        event.preventDefault();
        (document.activeElement === cancel ? exit : cancel).focus();
      }
      return;
    }
    event.preventDefault();
    mark(key);
    log("keydown " + key + " code=" + event.keyCode + " repeat=" + Boolean(event.repeat));
    if ((key === "Back" || key === "Enter") && event.repeat) return;
    if (key === "Back") {
      if (overlay.hidden) openPrompt(); else closePrompt();
      return;
    }
    if (!overlay.hidden) {
      if (key === "Enter") document.activeElement.click();
      else if (key === "ArrowLeft" || key === "ArrowUp") cancel.focus();
      else exit.focus();
      return;
    }
    if (key === "Enter") {
      tiles[selected].click();
      return;
    }
    var row = Math.floor(selected / 3);
    var column = selected % 3;
    if (key === "ArrowUp") row = Math.max(0, row - 1);
    if (key === "ArrowDown") row = Math.min(2, row + 1);
    if (key === "ArrowLeft") column = Math.max(0, column - 1);
    if (key === "ArrowRight") column = Math.min(2, column + 1);
    selected = row * 3 + column;
    tiles[selected].focus();
  });

  document.addEventListener("keyup", function (event) {
    var key = keyCodes[event.keyCode] || event.key;
    if (counts[key]) log("keyup " + key + " code=" + event.keyCode);
  });

  document.addEventListener("visibilitychange", function () {
    lifecycle.textContent = "Lifecycle: " + document.visibilityState;
    log("visibility " + document.visibilityState);
    if (!document.hidden) restoreFocus("visible");
  });
  window.addEventListener("blur", function () {
    lifecycle.textContent = "Lifecycle: window blur";
    log("window blur");
  });
  window.addEventListener("focus", function () {
    lifecycle.textContent = "Lifecycle: window focus";
    restoreFocus("window focus");
  });
  window.addEventListener("pagehide", function () { log("pagehide"); });
  window.addEventListener("pageshow", function (event) {
    lifecycle.textContent = "Lifecycle: pageshow · restored=" + event.persisted;
    restoreFocus("pageshow");
  });
  log("remote R1 loaded; observations need physical verification");
  lifecycle.textContent = "Lifecycle: " + document.visibilityState;
  restoreFocus("initial");
}());
