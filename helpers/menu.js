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

function createMenuItem(id, title) {
  chrome.contextMenus.create({ id, title, contexts: ["all"] });
}

function createSeparator(id) {
  chrome.contextMenus.create({ id, type: "separator", contexts: ["all"] });
}

function createContextMenu(prefix) {
  createMenuItem(`${prefix}/${ID_DISPLAY}`, TITLE_DISPLAY);
  createMenuItem(`${prefix}/${ID_SEND_ALL}`, TITLE_SEND_ALL);
  createSeparator(`${prefix}/${ID_SEPARATOR_1}`);

  createMenuItem(`${prefix}/${ID_SEND_ONLY}`, TITLE_SEND_ONLY);
  createMenuItem(`${prefix}/${ID_SEND_EXCEPT}`, TITLE_SEND_EXCEPT);
  createMenuItem(`${prefix}/${ID_SEND_LEFT}`, TITLE_SEND_LEFT);
  createMenuItem(`${prefix}/${ID_SEND_RIGHT}`, TITLE_SEND_RIGHT);
  createMenuItem(`${prefix}/${ID_SEND_ALL_WINDOWS}`, TITLE_SEND_ALL_WINDOWS);
  createSeparator(`${prefix}/${ID_SEPARATOR_2}`);

  createMenuItem(`${prefix}/${ID_EXCLUDE}`, TITLE_EXCLUDE);
  createSeparator(`${prefix}/${ID_SEPARATOR_3}`);

  createMenuItem(`${prefix}/${ID_HELP}`, TITLE_HELP);
}

export function createMenus() {
  const prefix = "not_action";
  createContextMenu(prefix);
}

export function createToolbarMenu() {
  const prefix = "action";
  createContextMenu(prefix);
}
