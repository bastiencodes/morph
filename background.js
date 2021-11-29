import {
  createMenus,
  createToolbarMenu,
  createMenuListener,
  updateMenuItems,
} from "./helpers/menu.js";
import {
  createTabListener,
  getActiveTabInCurrentWindow,
  sendAll,
} from "./helpers/tabs.js";

chrome.runtime.onInstalled.addListener(async (details) => {
  console.log("Extension installed!");
  console.log("Details", details);
  createMenus();
  createToolbarMenu();

  const activeTab = await getActiveTabInCurrentWindow();
  const { id, windowId } = activeTab;
  updateMenuItems(id, windowId);
});

const menuListener = createMenuListener();
chrome.contextMenus.onClicked.addListener(menuListener);

const tabListener = createTabListener();
chrome.tabs.onActivated.addListener(tabListener);

chrome.action.onClicked.addListener(async (currentTab) => {
  console.log(currentTab);
  await sendAll(currentTab);
});
