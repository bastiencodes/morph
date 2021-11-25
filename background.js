import { getAllTabsInWindow, sendTabs } from "./helpers/tabs.js";

chrome.runtime.onInstalled.addListener((details) => {
  console.log("Extension installed!");
  console.log("Details", details);
});

chrome.action.onClicked.addListener(async (currentTab) => {
  console.log(currentTab);
  const tabs = await getAllTabsInWindow(currentTab);
  await sendTabs(tabs);
});
