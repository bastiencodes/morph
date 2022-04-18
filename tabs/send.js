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

// see https://stackoverflow.com/a/9602718/4658957
const defaults = { check: true, open: true };

async function sendTabs(tabs, opts) {
  const options = Object.assign({}, defaults, opts);

  // TODO: updatedTabs = tabs?
  let updatedTabs = [...tabs];

  // 1. Filter tabs based on options (pinned tabs, duplicates)
  if (options.check) {
    const extensionOptions = await getOptions();
    updatedTabs = await checkOptions(updatedTabs, extensionOptions);
  }

  // 2. Store tabs
  await storeTabs(updatedTabs);

  // 3. Close tabs
  await closeTabs(updatedTabs);

  // 4. Display Morph
  // TODO: issue sometimes when list is opened before tabs have fully loaded
  if (options.open) {
    await openListPage();
  }
}

export async function sendAll(currentTab) {
  const tabs = await getAllTabsInWindow(currentTab);
  return sendTabs(tabs);
}

// ensure no checks if right clicking 'Send only this tab'
export async function sendOnly(currentTab) {
  const tabs = [currentTab];
  return sendTabs(tabs, { check: false, open: false });
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
    await sendTabs(tabsToSend, { open: false });

    // close all extension tabs except list page
    const [_, tabsToClose] = partition(extensionTabs, (tab) => {
      const url = tab.url || tab.pendingUrl;
      return isListPageURL(url);
    });
    await closeTabs(tabsToClose);
  }
  // TODO: call openListPage here instead?
}
