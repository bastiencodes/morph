import {
  createMenus,
  createToolbarMenu,
  createMenuListener,
  updateMenuItems,
} from "./helpers/menu.js";
import { initOptions, getOptions } from "./helpers/storage.js";
import {
  createTabListener,
  getActiveTabInCurrentWindow,
  sendAll,
} from "./helpers/tabs.js";
import { createWindowListener } from "./helpers/windows.js";
import { displayList } from "./tabs/display.js";

chrome.runtime.onInstalled.addListener(async (details) => {
  console.log("Extension installed!");
  console.log("Details", details);

  if (details.reason === "install") {
    await initOptions();
  }

  createMenus();
  createToolbarMenu();

  const activeTab = await getActiveTabInCurrentWindow();
  const { id, windowId } = activeTab;
  await updateMenuItems(id, windowId);
});

chrome.runtime.onStartup.addListener(async () => {
  const { DISPLAY_MORPH_ON_STARTUP } = await getOptions();
  if (DISPLAY_MORPH_ON_STARTUP) {
    await displayList();
  }
});

const menuListener = createMenuListener();
chrome.contextMenus.onClicked.addListener(menuListener);

const tabListener = createTabListener();
chrome.tabs.onActivated.addListener(tabListener);

const windowListener = createWindowListener();
chrome.windows.onFocusChanged.addListener(windowListener);

chrome.action.onClicked.addListener(async (currentTab) => {
  console.log(currentTab);
  await sendAll(currentTab);
});
