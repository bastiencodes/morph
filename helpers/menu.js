import {
  ID_DISPLAY,
  ID_SEND_ALL,
  ID_SEND_ONLY,
  ID_SEND_EXCEPT,
  ID_SEND_LEFT,
  ID_SEND_RIGHT,
  ID_SEND_ALL_WINDOWS,
  ID_EXCLUDE,
  ID_HELP,
  ID_SEPARATOR_1,
  ID_SEPARATOR_2,
  ID_SEPARATOR_3,
  TITLE_DISPLAY,
  TITLE_SEND_ALL,
  TITLE_SEND_ONLY,
  TITLE_SEND_EXCEPT,
  TITLE_SEND_LEFT,
  TITLE_SEND_RIGHT,
  TITLE_SEND_ALL_WINDOWS,
  TITLE_EXCLUDE,
  TITLE_HELP,
} from "../constants/menu.js";

import {
  isOnlyTabInWindow,
  isTabMostLeft,
  isTabMostRight,
} from "../tabs/search.js";

import { getAllWindows, isOnlyWindow } from "./windows.js";

function createMenuItem(id, title, contexts) {
  chrome.contextMenus.create({ id, title, contexts });
}

function createSeparator(id, contexts) {
  chrome.contextMenus.create({ id, type: "separator", contexts });
}

function createContextMenu(prefix, contexts) {
  createMenuItem(`${prefix}/${ID_DISPLAY}`, TITLE_DISPLAY, contexts);
  createMenuItem(`${prefix}/${ID_SEND_ALL}`, TITLE_SEND_ALL, contexts);
  createSeparator(`${prefix}/${ID_SEPARATOR_1}`, contexts);

  createMenuItem(`${prefix}/${ID_SEND_ONLY}`, TITLE_SEND_ONLY, contexts);
  createMenuItem(`${prefix}/${ID_SEND_EXCEPT}`, TITLE_SEND_EXCEPT, contexts);
  createMenuItem(`${prefix}/${ID_SEND_LEFT}`, TITLE_SEND_LEFT, contexts);
  createMenuItem(`${prefix}/${ID_SEND_RIGHT}`, TITLE_SEND_RIGHT, contexts);
  createMenuItem(
    `${prefix}/${ID_SEND_ALL_WINDOWS}`,
    TITLE_SEND_ALL_WINDOWS,
    contexts
  );
  createSeparator(`${prefix}/${ID_SEPARATOR_2}`, contexts);

  createMenuItem(`${prefix}/${ID_EXCLUDE}`, TITLE_EXCLUDE, contexts);
  createSeparator(`${prefix}/${ID_SEPARATOR_3}`, contexts);

  createMenuItem(`${prefix}/${ID_HELP}`, TITLE_HELP, contexts);

  // note: we need to return ids to be able to set their parent for toolbar menu
  return [
    `${prefix}/${ID_DISPLAY}`,
    `${prefix}/${ID_SEND_ALL}`,
    `${prefix}/${ID_SEPARATOR_1}`,

    `${prefix}/${ID_SEND_ONLY}`,
    `${prefix}/${ID_SEND_EXCEPT}`,
    `${prefix}/${ID_SEND_LEFT}`,
    `${prefix}/${ID_SEND_RIGHT}`,
    `${prefix}/${ID_SEND_ALL_WINDOWS}`,
    `${prefix}/${ID_SEPARATOR_2}`,

    `${prefix}/${ID_EXCLUDE}`,
    `${prefix}/${ID_SEPARATOR_3}`,

    `${prefix}/${ID_HELP}`,
  ];
}

export function createMenus() {
  const prefix = "not_action";
  // all contexts but 'action'
  const contexts = [
    "page",
    "frame",
    "selection",
    "link",
    "editable",
    "image",
    "video",
    "audio",
  ];
  createContextMenu(prefix, contexts);
}

function setParent(parentId, itemIds) {
  for (const itemId of itemIds) {
    chrome.contextMenus.update(itemId, { parentId });
  }
}

export function createToolbarMenu() {
  const prefix = "action";
  const contexts = ["action"];

  const PARENT_ID = "toolbar";
  // create parent menu item
  createMenuItem(PARENT_ID, "Morph", contexts);

  const itemIds = createContextMenu(prefix, contexts);
  setParent(PARENT_ID, itemIds);
}

function enableMenuItem(id) {
  chrome.contextMenus.update(`not_action/${id}`, { enabled: true });
  chrome.contextMenus.update(`action/${id}`, { enabled: true });
}

function disableMenuItem(id) {
  chrome.contextMenus.update(`not_action/${id}`, { enabled: false });
  chrome.contextMenus.update(`action/${id}`, { enabled: false });
}

function toggleMenuItem(condition, id) {
  if (condition) {
    disableMenuItem(id);
    return;
  }
  enableMenuItem(id);
}

export async function updateMenuItems(tabId, windowId) {
  // all tabs in window
  const tabs = await chrome.tabs.query({ windowId });

  // most left
  toggleMenuItem(isTabMostLeft(tabs, tabId), ID_SEND_LEFT);

  // most right
  toggleMenuItem(isTabMostRight(tabs, tabId), ID_SEND_RIGHT);

  // just one tab in window
  toggleMenuItem(isOnlyTabInWindow(tabs, tabId), ID_SEND_EXCEPT);

  // just one window
  const windows = await getAllWindows();
  toggleMenuItem(isOnlyWindow(windows, windowId), ID_SEND_ALL_WINDOWS);
}
