import { sendAll } from "./tabs/send.js";
import { onInstalled, onStartup } from "./listeners/runtime.js";
import { onActivated, onUpdated } from "./listeners/tabs.js";
import { onClicked } from "./listeners/contextMenus.js";
import { onFocusChanged } from "./listeners/windows.js";

chrome.runtime.onInstalled.addListener(onInstalled);
chrome.runtime.onStartup.addListener(onStartup);

chrome.contextMenus.onClicked.addListener(onClicked);

chrome.tabs.onActivated.addListener(onActivated);
chrome.tabs.onUpdated.addListener(onUpdated);

chrome.windows.onFocusChanged.addListener(onFocusChanged);

chrome.action.onClicked.addListener(async (currentTab) => {
  console.log(currentTab);
  await sendAll(currentTab);
});
