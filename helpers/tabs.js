import { LIST_VIEW_PATH } from "../constants/paths.js";
import { updateMenuItems } from "./menu.js";
import { checkOptions } from "./options.js";
import { createTabGroup, saveTabGroup } from "./storage.js";
import { partition } from "./array.js";
import { displayList } from "../tabs/display.js";

async function storeTabs(tabs) {
  const tabGroup = createTabGroup(tabs);
  console.log("Tab group", tabGroup);
  await saveTabGroup(tabGroup);
}

async function closeTabs(tabs) {
  const tabIds = tabs.map((tab) => tab.id);
  await chrome.tabs.remove(tabIds);
}

// TODO: fix sendTabs to take options and not displayList to avoid multiple calls
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
  // await displayList();
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

function isExtensionURL(tab) {
  const searchString = `chrome-extension://${chrome.runtime.id}`;
  const { url } = tab;
  return url.startsWith(searchString);
}

// TODO: rename?
const isExtensionListPage = (tab) =>
  tab.url === chrome.runtime.getURL(LIST_VIEW_PATH);

export async function sendAllWindows(currentTab) {
  const currentWindowId = currentTab
    ? currentTab.windowId
    : chrome.windows.WINDOW_ID_NONE;

  // replace below by displayList and pass in window id?
  const morphURL = chrome.runtime.getURL(LIST_VIEW_PATH);
  const morphTab = await findTabByURL(morphURL);
  // open Morph if it does not exist in window where call was initiated
  if (!morphTab && currentWindowId !== chrome.windows.WINDOW_ID_NONE) {
    await chrome.tabs.create({ url: morphURL, windowId: currentWindowId });
  }

  // "the tab's URL may not be set at the time the event is fired"
  // see https://developer.chrome.com/docs/extensions/reference/tabs/#event-onCreated
  const promiseTimeOut = (millis) =>
    new Promise((resolve) => {
      setTimeout(() => resolve(), millis);
    });
  // TODO: remove this hack and use onUpdated listener instead to know when URL is set
  await promiseTimeOut(50);

  const windows = await chrome.windows.getAll({ populate: true });
  for (const window of windows) {
    // send all tabs to Morph except extension tabs
    const [extensionTabs, tabsToSend] = partition(window.tabs, isExtensionURL);
    await sendTabs(tabsToSend);

    // close all extension tabs except list page
    const [_, tabsToClose] = partition(extensionTabs, isExtensionListPage);
    await closeTabs(tabsToClose);
  }
  // TODO: call displayList here instead?
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
