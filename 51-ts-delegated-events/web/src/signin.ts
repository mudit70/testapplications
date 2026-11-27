import $ from "jquery";
import { registerForEvent } from "./dom";

const SAVE = ".save";

/** The sign-in panel: its controls are wired through delegation, not on themselves. */
export class Signin {
  constructor(
    private root: HTMLElement,
    private lastPanel: string,
  ) {
    root.innerHTML = `
      <button id="sign-in-email-btn">Sign in with email</button>
      <button class="save" aria-label="Save draft"><i class="icon-save"></i></button>
      <button data-action="remove">Remove draft</button>
      <a id="forgot">Forgot password?</a>
      <button id="help">Help</button>`;
    // The code's own helper, given a literal, a constant, and the same target twice.
    registerForEvent(root, "#sign-in-email-btn", "click", () => this.signIn());
    registerForEvent(root, SAVE, "click", () => this.saveDraft());
    registerForEvent(root, SAVE, "click", () => this.track());
    // A target chosen when the code runs.
    registerForEvent(root, this.lastPanel, "click", () => this.recent());
    // jQuery: delegated to a selector, and on the control's own selector.
    $(root).on("click", "#forgot", () => this.forgot());
    $("#help").click(() => this.help());
    // The container's own listener, checking what was clicked.
    root.addEventListener("click", (e) => {
      if ((e.target as HTMLElement).closest('[data-action="remove"]')) this.removeDraft();
    });
  }

  signIn() {
    return fetch("/api/signin", { method: "POST" });
  }

  saveDraft() {
    return fetch("/api/drafts", { method: "PUT" });
  }

  track() {
    return fetch("/api/events", { method: "POST" });
  }

  removeDraft() {
    return fetch("/api/drafts", { method: "DELETE" });
  }

  forgot() {
    return fetch("/api/password/reset", { method: "POST" });
  }

  help() {
    return fetch("/api/help");
  }

  recent() {
    return fetch("/api/recent");
  }
}
