import { LIST_VIEW_PATH } from "./constants.js";
import { createTabGroup, saveTabGroup } from "./storage.js";

async function bringTabToForeground(tab) {
  const { windowId, index } = tab;
  await chrome.windows.update(windowId, { focused: true });
  await chrome.tabs.highlight({ tabs: index, windowId });
}

async function displayList() {
  const listViewURL = chrome.runtime.getURL(LIST_VIEW_PATH);

  const listViewTabs = await chrome.tabs.query({ url: listViewURL });
  const listViewTab = listViewTabs[0];

  if (!listViewTab) {
    await chrome.tabs.create({ url: LIST_VIEW_PATH });
    return;
  }
  await bringTabToForeground(listViewTab);
}

async function storeTabs(tabs) {
  const tabGroup = createTabGroup(tabs);
  console.log("Tab group", tabGroup);
  await saveTabGroup(tabGroup);
}

export async function openTabs(tabs) {
  const urls = tabs.map((tab) => tab.url);
  await chrome.windows.create({ url: urls });
}

async function closeTabs(tabs) {
  const tabIds = tabs.map((tab) => tab.id);
  await chrome.tabs.remove(tabIds);
}

async function sendTabs(tabs) {
  // 1. Store tabs
  await storeTabs(tabs);

  // TODO: remove below
  const urls = tabs.map((tab) => tab.url);
  await chrome.windows.create({ url: urls });

  // 2. Close tabs
  await closeTabs(tabs);

  // 3. Display Morph
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

export async function sendAll(currentTab) {
  const tabs = await getAllTabsInWindow(currentTab);
  return sendTabs(tabs);
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
