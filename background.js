import { createMenuListener } from "./helpers/menu.js";
import { createWindowListener } from "./helpers/windows.js";
import { openListPage } from "./tabs/open.js";
import { createTabListener } from "./tabs/listener.js";
import { sendAll } from "./tabs/send.js";
import { doDuplicateTabsExist } from "./tabs/search.js";
import { isListPageURL } from "./helpers/urls.js";
import { onInstalled, onStartup } from "./listeners/runtime.js";

chrome.runtime.onInstalled.addListener(onInstalled);
chrome.runtime.onStartup.addListener(onStartup);

const menuListener = createMenuListener();
chrome.contextMenus.onClicked.addListener(menuListener);

const tabListener = createTabListener();
chrome.tabs.onActivated.addListener(tabListener);

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  const { url } = changeInfo;
  if (!url) return;

  const isMorphPage = isListPageURL(url);
  // avoid searching for tabs if not Morph url
  if (!isMorphPage) return;

  const isDuplicate = await doDuplicateTabsExist(url);
  if (!isDuplicate) return;

  await chrome.tabs.remove(tabId);
  await openListPage();
});

const windowListener = createWindowListener();
chrome.windows.onFocusChanged.addListener(windowListener);

chrome.action.onClicked.addListener(async (currentTab) => {
  console.log(currentTab);
  await sendAll(currentTab);
});
