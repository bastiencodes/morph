import { updateMenuItems } from "../helpers/menu.js";
import { getActiveTabInWindow } from "../tabs/get.js";

export async function onFocusChanged(windowId) {
  console.log("onFocusChanged", `windowId ${windowId}`);

  if (windowId !== chrome.windows.WINDOW_ID_NONE) {
    const activeTab = await getActiveTabInWindow(windowId);
    await updateMenuItems(activeTab.id, windowId);
  }
}
