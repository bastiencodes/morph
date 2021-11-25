import { LIST_VIEW_PATH } from "./constants.js";

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
  console.log("TODO: Store tabs!");
}

async function closeTabs(tabs) {
  console.log("TODO: Closing tabs!");
}

export async function sendTabs(tabs) {
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