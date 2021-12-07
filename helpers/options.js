import { getOptions, getTabGroups } from "./storage.js";

function removePinnedTabs(tabs) {
  return tabs.filter((tab) => !tab.pinned);
}

// tabs with same URLs
async function removeDuplicateTabs(tabs) {
  const tabGroups = await getTabGroups();
  const storedTabs = Object.values(tabGroups).flatMap(
    (tabGroup) => tabGroup.tabs
  );
  const storedTabURLs = storedTabs.map((tab) => tab.url);

  const urls = [];
  const tabsWithNoDuplicates = tabs.filter((tab) => {
    const allURLs = [...storedTabURLs, ...urls];
    const { url } = tab;
    const isDuplicate = allURLs.includes(url);
    urls.push(url);
    return !isDuplicate;
  });

  return tabsWithNoDuplicates;
}

export async function checkOptions(tabs) {
  let updatedTabs = tabs;

  const options = await getOptions();
  const { SEND_PINNED_TABS, ALLOW_DUPLICATES } = options;

  if (!SEND_PINNED_TABS) {
    updatedTabs = removePinnedTabs(updatedTabs);
  }

  if (!ALLOW_DUPLICATES) {
    updatedTabs = await removeDuplicateTabs(updatedTabs);
  }

  return updatedTabs;
}
