import { partition } from "../helpers/array.js";
import { checkOptions } from "../helpers/options.js";
import {
  createTabGroup,
  getOptions,
  saveTabGroup,
} from "../helpers/storage.js";
import { openListPage } from "./open.js";
import { getAllTabsInWindow } from "./get.js";
import { isListPageURL } from "../helpers/urls.js";

async function storeTabs(tabs) {
  const tabGroup = createTabGroup(tabs);
  console.log("Tab group", tabGroup);
  await saveTabGroup(tabGroup);
}

async function closeTabs(tabs) {
  const tabIds = tabs.map((tab) => tab.id);
  await chrome.tabs.remove(tabIds);
}

// TODO: fix sendTabs to take options and not openListPage to avoid multiple calls
async function sendTabs(tabs, shouldCheckOptions = true) {
  let updatedTabs = tabs;

  // 1. Check options (pinned tabs, duplicates)
  if (shouldCheckOptions) {
    const options = await getOptions();
    updatedTabs = await checkOptions(tabs, options);
  }

  // 2. Store tabs
  await storeTabs(updatedTabs);

  // 3. Close tabs
  await closeTabs(updatedTabs);

  // 4. Display Morph
  // TODO: issue sometimes when list is opened before tabs have fully loaded
  // TODO: issue with sendAllWindows - this gets called once for every window (should only be called once!)
  // await openListPage();
}

export async function sendAll(currentTab) {
  const tabs = await getAllTabsInWindow(currentTab);
  return sendTabs(tabs);
}

// ensure no checks if right clicking 'Send only this tab'
export async function sendOnly(currentTab) {
  const tabs = [currentTab];
  return sendTabs(tabs, false);
}

export async function sendExcept(currentTab) {
  const results = await getAllTabsInWindow(currentTab);
  const tabs = results.filter((tab) => tab.index !== currentTab.index);
  return sendTabs(tabs);
}

export async function sendLeft(currentTab) {
  const results = await getAllTabsInWindow(currentTab);
  const tabs = results.filter((tab) => tab.index < currentTab.index);
  return sendTabs(tabs);
}

export async function sendRight(currentTab) {
  const results = await getAllTabsInWindow(currentTab);
  const tabs = results.filter((tab) => tab.index > currentTab.index);
  return sendTabs(tabs);
}

export async function sendAllWindows() {
  await openListPage();

  const windows = await chrome.windows.getAll({ populate: true });
  for (const window of windows) {
    // send all tabs to Morph except extension tabs
    const [extensionTabs, tabsToSend] = partition(window.tabs, (tab) => {
      // Note: checking for pendingUrl is very important
      // this avoids Morph tab being closed if currently loading
      const url = tab.url || tab.pendingUrl;
      return isExtensionURL(url);
    });
    await sendTabs(tabsToSend);

    // close all extension tabs except list page
    const [_, tabsToClose] = partition(extensionTabs, (tab) => {
      const url = tab.url || tab.pendingUrl;
      return isListPageURL(url);
    });
    await closeTabs(tabsToClose);
  }
  // TODO: call openListPage here instead?
}
