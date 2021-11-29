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

export function createToolbarMenu() {
  const prefix = "action";
  const contexts = ["action"];
  createContextMenu(prefix, contexts);
}
