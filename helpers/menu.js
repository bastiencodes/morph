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
} from "./constants.js";

export function createContextMenu() {
  chrome.contextMenus.create({ id: ID_DISPLAY, title: TITLE_DISPLAY });
  chrome.contextMenus.create({ id: ID_SEND_ALL, title: TITLE_SEND_ALL });
  chrome.contextMenus.create({ id: ID_SEPARATOR_1, type: "separator" });

  chrome.contextMenus.create({ id: ID_SEND_ONLY, title: TITLE_SEND_ONLY });
  chrome.contextMenus.create({ id: ID_SEND_EXCEPT, title: TITLE_SEND_EXCEPT });
  chrome.contextMenus.create({ id: ID_SEND_LEFT, title: TITLE_SEND_LEFT });
  chrome.contextMenus.create({ id: ID_SEND_RIGHT, title: TITLE_SEND_RIGHT });
  chrome.contextMenus.create({
    id: ID_SEND_ALL_WINDOWS,
    title: TITLE_SEND_ALL_WINDOWS,
  });
  chrome.contextMenus.create({ id: ID_SEPARATOR_2, type: "separator" });

  chrome.contextMenus.create({ id: ID_EXCLUDE, title: TITLE_EXCLUDE });
  chrome.contextMenus.create({ id: ID_SEPARATOR_3, type: "separator" });

  chrome.contextMenus.create({ id: ID_HELP, title: TITLE_HELP });
}
