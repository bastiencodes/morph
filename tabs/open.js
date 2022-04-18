import { Location } from "../constants/options.js";
import { getOptions } from "../helpers/storage.js";
import { getListPageURL, getTransferPageURL } from "../helpers/urls.js";
import { findTabByURL, isOnlyTabInCurrentWindow } from "./search.js";

export const createTab = (url) =>
  chrome.tabs.create({
    url,
    windowId: chrome.windows.WINDOW_ID_CURRENT,
  });

async function bringTabToForeground(tab) {
  const { windowId, index } = tab;
  await chrome.windows.update(windowId, { focused: true });
  await chrome.tabs.highlight({ tabs: index, windowId });
}

async function openTab(url) {
  const result = await findTabByURL(url);
  // creates tab if it does not exist
  const tab = result ? result : await createTab(url);
  await bringTabToForeground(tab);
  return tab;
}

export async function openListPage() {
  const url = getListPageURL();
  await openTab(url);
}

export async function openTransferPage() {
  const url = getTransferPageURL();
  await openTab(url);
}

export async function openOptionsPage() {
  // opens options page if it does not exist, or brings it to foreground
  await chrome.runtime.openOptionsPage();
}

async function openTabsInCurrentWindow(tabs) {
  for (const tab of tabs) {
    await createTab(tab.url);
  }
}

async function openTabsInNewWindow(tabs) {
  const urls = tabs.map((tab) => tab.url);
  await chrome.windows.create({ url: urls });
}

export async function restoreTabs(tabs) {
  const { RESTORE_TAB_GROUP_IN } = await getOptions();

  switch (RESTORE_TAB_GROUP_IN) {
    case Location.NEW_WINDOW_UNLESS: {
      const url = getListPageURL();
      const isOnlyTab = await isOnlyTabInCurrentWindow(url);

      if (isOnlyTab) {
        await openTabsInCurrentWindow(tabs);
        return;
      }
      await openTabsInNewWindow(tabs);
      break;
    }

    case Location.NEW_WINDOW: {
      await openTabsInNewWindow(tabs);
      break;
    }

    case Location.CURRENT_WINDOW: {
      await openTabsInCurrentWindow(tabs);
      break;
    }
  }
}
