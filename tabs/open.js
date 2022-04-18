import {
  OPTION_CURRENT_WINDOW,
  OPTION_NEW_WINDOW,
  OPTION_NEW_WINDOW_UNLESS,
} from "../constants/options.js";
import { getOptions } from "../helpers/storage.js";
import { getListPageURL, getTransferPageURL } from "../helpers/urls.js";
import { findTabByURL } from "./search.js";

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

// brings tab to foreground
// creates tab if it does not exist
async function openTab(url) {
  const tab = await findTabByURL(url);
  if (!tab) {
    await createTab(url);
    return;
  }
  await bringTabToForeground(tab);
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

// TODO: rename function
async function checkIfOnlyTabInCurrentWindow() {
  const currentWindow = await chrome.windows.getCurrent();
  const { tabs } = currentWindow;

  const url = getListPageURL();

  return tabs.length === 1 && tabs[0].url === url;
}

async function openTabsInCurrentWindow(tabs) {
  for (const tab of tabs) {
    await chrome.tabs.create({
      url: tab.url,
      windowId: chrome.windows.WINDOW_ID_CURRENT,
    });
  }
}

async function openTabsInNewWindow(tabs) {
  const urls = tabs.map((tab) => tab.url);
  await chrome.windows.create({ url: urls });
}

export async function restoreTabs(tabs) {
  const { RESTORE_TAB_GROUP_IN } = await getOptions();

  switch (RESTORE_TAB_GROUP_IN) {
    case OPTION_NEW_WINDOW_UNLESS: {
      const isOnlyTabInCurrentWindow = await checkIfOnlyTabInCurrentWindow();
      if (isOnlyTabInCurrentWindow) {
        await openTabsInCurrentWindow(tabs);
        // TODO: missing return?
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
