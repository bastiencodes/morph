import { createMenuListener } from "./helpers/menu.js";
import { createWindowListener } from "./helpers/windows.js";
import { sendAll } from "./tabs/send.js";
import { onInstalled, onStartup } from "./listeners/runtime.js";
import { onActivated, onUpdated } from "./listeners/tabs.js";

chrome.runtime.onInstalled.addListener(onInstalled);
chrome.runtime.onStartup.addListener(onStartup);

const menuListener = createMenuListener();
chrome.contextMenus.onClicked.addListener(menuListener);

chrome.tabs.onActivated.addListener(onActivated);
chrome.tabs.onUpdated.addListener(onUpdated);

const windowListener = createWindowListener();
chrome.windows.onFocusChanged.addListener(windowListener);

chrome.action.onClicked.addListener(async (currentTab) => {
  console.log(currentTab);
  await sendAll(currentTab);
});
