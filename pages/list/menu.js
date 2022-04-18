import { ABOUT_URL } from "../../constants/paths.js";
import { openOptionsPage, openTransferPage } from "../../tabs/open.js";
import { sendAllWindows } from "../../tabs/send.js";

export function setUpMenu() {
  const menuBringTabs = document.getElementById("menu_bring_tabs");
  const menuShareWebPage = document.getElementById("menu_share_web_page");
  const menuExportImport = document.getElementById("menu_export_import");
  const menuOptions = document.getElementById("menu_options");
  const menuAbout = document.getElementById("menu_about_feedback");

  menuBringTabs.addEventListener("click", () => sendAllWindows());

  menuShareWebPage.addEventListener("click", () => {
    console.log("Share all as web page");
  });

  menuExportImport.addEventListener("click", () => openTransferPage());

  menuOptions.addEventListener("click", () => openOptionsPage());

  menuAbout.addEventListener("click", () =>
    chrome.tabs.create({
      url: ABOUT_URL,
      windowId: chrome.windows.WINDOW_ID_CURRENT,
    })
  );
}
