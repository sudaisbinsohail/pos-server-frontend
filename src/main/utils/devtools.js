import installExtension, { REDUX_DEVTOOLS } from "electron-devtools-installer";
import { is } from "@electron-toolkit/utils";

export function loadDevTools() {
  if (!is.dev) return;

  installExtension(REDUX_DEVTOOLS)
    .then((name) => console.log("DevTools installed:", name))
    .catch((err) => console.error("DevTools error:", err));
}
