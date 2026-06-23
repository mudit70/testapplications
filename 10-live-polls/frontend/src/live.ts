// Live results: opens a WebSocket to the aiohttp/websockets backend and
// wires a vanilla-DOM vote button (addEventListener → dom plugin).
import { castVote } from "./api";

declare const document: {
  getElementById(id: string): HTMLElement;
};
interface HTMLElement {
  addEventListener(event: string, handler: (e?: Event) => void): void;
}
interface Event {
  preventDefault(): void;
}

export class LiveResults {
  private socket: WebSocket;
  private voteButton: HTMLElement;

  constructor(pollId: number) {
    this.socket = new WebSocket("ws://localhost:8765/live");
    this.voteButton = document.getElementById("vote-btn");

    // Vanilla DOM event handler — detected by the dom plugin.
    this.voteButton.addEventListener("click", () => {
      void castVote(pollId, 0);
    });
  }
}
