import { ABOUT_URL } from "../constants/paths.js";
import { displayImportExport, sendAllWindows } from "../helpers/tabs.js";

export function setUpMenu() {
  const menuBringTabs = document.getElementById("menu_bring_tabs");
  const menuShareWebPage = document.getElementById("menu_share_web_page");
  const menuExportImport = document.getElementById("menu_export_import");
  const menuOptions = document.getElementById("menu_options");
  const menuAbout = document.getElementById("menu_about_feedback");

  menuBringTabs.addEventListener("click", async () => {
    console.log("Bring all tabs into Morph");
    await sendAllWindows();
  });

  menuShareWebPage.addEventListener("click", () => {
    console.log("Share all as web page");
  });

  menuExportImport.addEventListener("click", async () => {
    console.log("Export / Import URLs");
    await displayImportExport();
  });

  menuOptions.addEventListener("click", async () => {
    // opens options page if it does not exist, or brings it to foreground
    await chrome.runtime.openOptionsPage();
  });

  menuAbout.addEventListener("click", async () => {
    await chrome.tabs.create({ url: ABOUT_URL });
  });
}
