import {
  LIST_VIEW_PATH,
  OPTION_CURRENT_WINDOW,
  OPTION_NEW_WINDOW,
  OPTION_NEW_WINDOW_UNLESS,
} from "./constants.js";
import { updateMenuItems } from "./menu.js";
import { checkOptions } from "./options.js";
import { createTabGroup, getOptions, saveTabGroup } from "./storage.js";

async function bringTabToForeground(tab) {
  const { windowId, index } = tab;
  await chrome.windows.update(windowId, { focused: true });
  await chrome.tabs.highlight({ tabs: index, windowId });
}

async function findTabByURL(url) {
  // returns empty array if no tabs match
  const tabs = await chrome.tabs.query({ url });
  const tab = tabs[0];
  return tab;
}

// brings tab to foreground
// creates tab if it does not exist
async function displayTab(url) {
  const tab = await findTabByURL(url);
  if (!tab) {
    await chrome.tabs.create({ url });
    return;
  }
  await bringTabToForeground(tab);
}

export async function displayList() {
  const url = chrome.runtime.getURL(LIST_VIEW_PATH);
  await displayTab(url);
}

export async function displayImportExport() {
  // TODO: move to constants folder (once created)
  const IMPORT_EXPORT_PATH = "import-export/import-export.html";
  const url = chrome.runtime.getURL(IMPORT_EXPORT_PATH);
  await displayTab(url);
}

async function storeTabs(tabs) {
  const tabGroup = createTabGroup(tabs);
  console.log("Tab group", tabGroup);
  await saveTabGroup(tabGroup);
}

async function checkIfOnlyTabInCurrentWindow() {
  const currentWindow = await chrome.windows.getCurrent();
  const { tabs } = currentWindow;

  // TODO: refactor below
  const url = chrome.runtime.getURL("list/index.html");

  return tabs.length === 1 && tabs[0].url === url;
}

async function openTabsInCurrentWindow(tabs) {
  // if no windowId is provided, defaults to current window
  // see https://developer.chrome.com/docs/extensions/reference/tabs/#method-create
  for (const tab of tabs) {
    await chrome.tabs.create({ url: tab.url });
  }
}

async function openTabsInNewWindow(tabs) {
  const urls = tabs.map((tab) => tab.url);
  await chrome.windows.create({ url: urls });
}

export async function openTabs(tabs) {
  const { RESTORE_TAB_GROUP_IN } = await getOptions();

  switch (RESTORE_TAB_GROUP_IN) {
    case OPTION_NEW_WINDOW_UNLESS: {
      const isOnlyTabInCurrentWindow = await checkIfOnlyTabInCurrentWindow();
      if (isOnlyTabInCurrentWindow) {
        await openTabsInCurrentWindow(tabs);
      }
      await openTabsInNewWindow(tabs);
      break;
    }

    case OPTION_NEW_WINDOW: {
      await openTabsInNewWindow(tabs);
      break;
    }

    case OPTION_CURRENT_WINDOW: {
      await openTabsInCurrentWindow(tabs);
      break;
    }
  }
}

async function closeTabs(tabs) {
  const tabIds = tabs.map((tab) => tab.id);
  await chrome.tabs.remove(tabIds);
}

async function sendTabs(tabs, shouldCheckOptions = true) {
  // 1. Check options (pinned tabs, duplicates)
  let updatedTabs = tabs;

  if (shouldCheckOptions) {
    updatedTabs = await checkOptions(tabs);
  }

  // 2. Store tabs
  await storeTabs(updatedTabs);

  // 3. Close tabs
  await closeTabs(updatedTabs);

  // 4. Display Morph
  // TODO: issue sometimes when list is opened before tabs have fully loaded
  // TODO: issue with sendAllWindows - this gets called once for every window (should only be called once!)
  await displayList();
}

async function getAllTabsInWindow(currentTab) {
  const { windowId } = currentTab;
  const tabs = await chrome.tabs.query({ windowId });
  return tabs;
}

export async function getActiveTabInCurrentWindow() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tabs.length !== 1)
    throw new Error("Should only have 1 active tab in current window.");
  const activeTab = tabs[0];
  return activeTab;
}

export async function getActiveTabInWindow(windowId) {
  const tabs = await chrome.tabs.query({
    active: true,
    highlighted: true,
    windowId,
  });
  console.log("windowId", windowId, "tabs", tabs);
  if (tabs.length !== 1)
    throw new Error("Should only have 1 active and highlighted tab.");
  const activeTab = tabs[0];
  return activeTab;
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

// TODO: move in array helper?
// see https://stackoverflow.com/a/47225591/4658957
function partition(array, isValid) {
  const initial = [[], []];
  const cb = (prev, el) => {
    const [pass, fail] = prev;
    return isValid(el) ? [[...pass, el], fail] : [pass, [...fail, el]];
  };
  const results = array.reduce(cb, initial);
  return results;
}

function isExtensionURL(tab) {
  const searchString = `chrome-extension://${chrome.runtime.id}`;
  const { url } = tab;
  return url.startsWith(searchString);
}

// TODO: rename?
const isExtensionListPage = (tab) =>
  tab.url === chrome.runtime.getURL(LIST_VIEW_PATH);

// sends all windows except the one with Morph open
// for that one it sends all the tabs except Morph list
export async function sendAllWindows() {
  const windows = await chrome.windows.getAll({ populate: true });
  for (const window of windows) {
    const [extensionTabs, tabsToSend] = partition(window.tabs, isExtensionURL);
    // send all tabs to Morph except extension tabs
    await sendTabs(tabsToSend);

    // close all extension tabs except list page
    const [_, tabsToClose] = partition(extensionTabs, isExtensionListPage);
    await closeTabs(tabsToClose);

    // TODO: should only keep - Morph home page once
  }
}

// helpers to determine tab position
function findTab(tabId, tabs) {
  const tab = tabs.find((tab) => tab.id === tabId);
  if (!tab) throw new Error("No tab found");
  return tab;
}

export function isTabMostLeft(tabId, tabs) {
  const tab = findTab(tabId, tabs);
  return tab.index === 0;
}

export function isTabMostRight(tabId, tabs) {
  const tab = findTab(tabId, tabs);
  return tab.index === tabs.length - 1;
}

export function isOnlyTabInWindow(tabId, tabs) {
  const tab = findTab(tabId, tabs);
  return tab && tabs.length === 1;
}

export function createTabListener() {
  return async function callback({ tabId, windowId }) {
    console.log("onActivated", `tabId ${tabId}`, `windowId ${windowId}`);
    await updateMenuItems(tabId, windowId);
  };
}
