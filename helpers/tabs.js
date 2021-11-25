import { LIST_VIEW_PATH } from "./constants.js";

async function bringTabToForeground(tab) {
  const { windowId, index } = tab;
  await chrome.windows.update(windowId, { focused: true });
  await chrome.tabs.highlight({ tabs: index, windowId });
}

export async function displayList() {
  const listViewURL = chrome.runtime.getURL(LIST_VIEW_PATH);

  const listViewTabs = await chrome.tabs.query({ url: listViewURL });
  const listViewTab = listViewTabs[0];

  if (!listViewTab) {
    await chrome.tabs.create({ url: LIST_VIEW_PATH });
    return;
  }
  await bringTabToForeground(listViewTab);
}
