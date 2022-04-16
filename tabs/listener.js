import { updateMenuItems } from "../helpers/menu.js";

export function createTabListener() {
  return async function callback({ tabId, windowId }) {
    console.log("onActivated", `tabId ${tabId}`, `windowId ${windowId}`);
    await updateMenuItems(tabId, windowId);
  };
}
