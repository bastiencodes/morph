import {
  createMenus,
  createToolbarMenu,
  createMenuListener,
} from "./helpers/menu.js";
import { sendAll } from "./helpers/tabs.js";

chrome.runtime.onInstalled.addListener((details) => {
  console.log("Extension installed!");
  console.log("Details", details);
  createMenus();
  createToolbarMenu();
});

const menuListener = createMenuListener();
chrome.contextMenus.onClicked.addListener(menuListener);

chrome.action.onClicked.addListener(async (currentTab) => {
  console.log(currentTab);
  await sendAll(currentTab);
});
