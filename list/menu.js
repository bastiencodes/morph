export function setUpMenu() {
  const menuBringTabs = document.getElementById("menu_bring_tabs");
  const menuShareWebPage = document.getElementById("menu_share_web_page");
  const menuExportImport = document.getElementById("menu_export_import");
  const menuOptions = document.getElementById("menu_options");
  const menuAbout = document.getElementById("menu_about_feedback");

  menuBringTabs.addEventListener("click", () => {
    console.log("Bring all tabs into Morph");
  });

  menuShareWebPage.addEventListener("click", () => {
    console.log("Share all as web page");
  });

  menuExportImport.addEventListener("click", () => {
    console.log("Export / Import URLs");
  });

  menuOptions.addEventListener("click", async () => {
    // opens options page if it does not exist, or brings it to foreground
    await chrome.runtime.openOptionsPage();
  });

  menuAbout.addEventListener("click", async () => {
    const ABOUT_URL = "https://morph.github.io";
    await chrome.tabs.create({ url: ABOUT_URL });
  });
}
