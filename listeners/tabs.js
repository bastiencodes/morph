import { updateMenuItems } from "../helpers/menu.js";
import { isListPageURL } from "../helpers/urls.js";
import { openListPage } from "../tabs/open.js";
import { doDuplicateTabsExist } from "../tabs/search.js";

export async function onActivated({ tabId, windowId }) {
  console.log("onActivated", `tabId ${tabId}`, `windowId ${windowId}`);
  await updateMenuItems(tabId, windowId);
}

export async function onUpdated(tabId, changeInfo) {
  const { url } = changeInfo;
  if (!url) return;

  const isMorphPage = isListPageURL(url);
  // avoid searching for tabs if not Morph url
  if (!isMorphPage) return;

  const isDuplicate = await doDuplicateTabsExist(url);
  if (!isDuplicate) return;

  await chrome.tabs.remove(tabId);
  await openListPage();
}
