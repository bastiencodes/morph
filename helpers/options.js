import { uniqueBy } from "./array.js";
import { getTabURLs } from "./storage.js";

const isUnpinned = (tab) => !tab.pinned;

export async function checkOptions(tabs, options) {
  let updatedTabs = [...tabs];
  const { ALLOW_PINNED_TABS, ALLOW_DUPLICATES } = options;

  if (!ALLOW_PINNED_TABS) {
    updatedTabs = updatedTabs.filter(isUnpinned);
  }

  if (!ALLOW_DUPLICATES) {
    const storedTabURLs = await getTabURLs();
    updatedTabs = uniqueBy(updatedTabs, "url", storedTabURLs);
  }

  return updatedTabs;
}
