import { ipcMain, dialog } from "electron";
import fs from "fs";
import path from "path";

export default function fileIPC() {
  ipcMain.handle("select-image-file", async () => {
    const result = await dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [
        { name: "Images", extensions: ["jpg", "jpeg", "png", "gif"] }
      ]
    });

    return result.canceled ? null : result.filePaths[0];
  });

  ipcMain.handle("read-image-base64", (e, filePath) => {
    try {
      const buffer = fs.readFileSync(filePath);
      const ext = path.extname(filePath).slice(1);
      return `data:image/${ext};base64,${buffer.toString("base64")}`;
    } catch (err) {
      console.error("Error reading image:", err);
      return null;
    }
  });
}
