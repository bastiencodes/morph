import {
  OPTION_CURRENT_WINDOW,
  OPTION_NEW_WINDOW,
  OPTION_NEW_WINDOW_UNLESS,
} from "../constants/options.js";
import { IMPORT_EXPORT_PATH, LIST_VIEW_PATH } from "../constants/paths.js";
import { getOptions } from "../helpers/storage.js";
import { findTabByURL } from "./search.js";

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
    await chrome.tabs.create({ url });
    return;
  }
  await bringTabToForeground(tab);
}

export async function openListPage() {
  const url = chrome.runtime.getURL(LIST_VIEW_PATH);
  await openTab(url);
}

export async function openImportExportPage() {
  const url = chrome.runtime.getURL(IMPORT_EXPORT_PATH);
  await openTab(url);
}

// TODO: rename function
async function checkIfOnlyTabInCurrentWindow() {
  const currentWindow = await chrome.windows.getCurrent();
  const { tabs } = currentWindow;

  const url = chrome.runtime.getURL(LIST_VIEW_PATH);

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
