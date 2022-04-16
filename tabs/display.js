import { IMPORT_EXPORT_PATH, LIST_VIEW_PATH } from "../constants/paths";

async function findTabByURL(url) {
  // returns empty array if no tabs match
  const tabs = await chrome.tabs.query({ url });
  const tab = tabs[0];
  return tab;
}

async function bringTabToForeground(tab) {
  const { windowId, index } = tab;
  await chrome.windows.update(windowId, { focused: true });
  await chrome.tabs.highlight({ tabs: index, windowId });
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
  const url = chrome.runtime.getURL(IMPORT_EXPORT_PATH);
  await displayTab(url);
}
