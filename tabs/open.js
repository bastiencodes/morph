import {
  OPTION_CURRENT_WINDOW,
  OPTION_NEW_WINDOW,
  OPTION_NEW_WINDOW_UNLESS,
} from "../constants/options.js";
import { getOptions } from "../helpers/storage.js";

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
