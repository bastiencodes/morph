const TITLE_DISPLAY = "Display Morph";
const TITLE_SEND_ALL = "Send all tabs to Morph";
const TITLE_SEND_ONLY = "Send only this tab to Morph";
const TITLE_SEND_EXCEPT = "Send all tabs except this tab to Morph";
const TITLE_SEND_LEFT = "Send tabs on the left to Morph";
const TITLE_SEND_RIGHT = "Send tabs on the right to Morph";
const TITLE_SEND_ALL_WINDOWS = "Send all tabs from all windows to Morph";
const TITLE_EXCLUDE = "Exclude host from Morph";
const TITLE_HELP = "Help";

const ID_DISPLAY = "display";
const ID_SEND_ALL = "send_all";
const ID_SEND_ONLY = "send_only";
const ID_SEND_EXCEPT = "send_except";
const ID_SEND_LEFT = "send_left";
const ID_SEND_RIGHT = "send_right";
const ID_SEND_ALL_WINDOWS = "send_all_windows";
const ID_EXCLUDE = "exclude";
const ID_HELP = "help";

const ID_SEPARATOR_1 = "separator_1";
const ID_SEPARATOR_2 = "separator_2";
const ID_SEPARATOR_3 = "separator_3";

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
