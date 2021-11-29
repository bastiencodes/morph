import { createContextMenu } from "./helpers/menu.js";
import { sendAll } from "./helpers/tabs.js";

chrome.runtime.onInstalled.addListener((details) => {
  console.log("Extension installed!");
  console.log("Details", details);
  createContextMenu();
});

chrome.action.onClicked.addListener(async (currentTab) => {
  console.log(currentTab);
  await sendAll(currentTab);
});
