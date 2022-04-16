import { LIST_VIEW_PATH } from "../constants/paths";
import { partition } from "../helpers/array";
import { checkOptions } from "../helpers/options";
import { createTabGroup, saveTabGroup } from "../helpers/storage";
import { closeTabs } from "./close";
import { displayList } from "./display";
import { getAllTabsInWindow } from "./get";

async function storeTabs(tabs) {
  const tabGroup = createTabGroup(tabs);
  console.log("Tab group", tabGroup);
  await saveTabGroup(tabGroup);
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
