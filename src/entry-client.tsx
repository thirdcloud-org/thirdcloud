// @refresh reload
import { mount, StartClient } from "@solidjs/start/client";
import "ses";

let swReadyResolve: () => void;
const swReady = new Promise((resolve) => {
  swReadyResolve = () => {
    console.log("Service worker is ready");
    resolve(true);
  };
});

// In Chrome, Application > Update on reload
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });

    navigator.serviceWorker.ready.then((registration) => {
      if (!registration.active) {
        console.log("failed to communicate");
        return;
      }
      swReadyResolve();
    });
  });
}

await swReady;

mount(() => <StartClient />, document.getElementById("app")!);
