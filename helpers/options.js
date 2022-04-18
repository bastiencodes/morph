import { getTabGroups } from "./storage.js";

function removePinnedTabs(tabs) {
  return tabs.filter((tab) => !tab.pinned);
}

// tabs with same URLs
async function removeDuplicateTabs(tabs) {
  const tabGroups = await getTabGroups();
  const storedTabs = Object.values(tabGroups)
    .map((tabGroup) => tabGroup.tabs)
    .flat(1);
  const storedTabURLs = storedTabs.map((tab) => tab.url);

  const urls = [...storedTabURLs];
  const tabsWithNoDuplicates = tabs.filter((tab) => {
    const { url } = tab;
    const isUnique = !urls.includes(url);
    urls.push(url);
    return isUnique;
  });

  return tabsWithNoDuplicates;
}

export async function checkOptions(tabs, options) {
  let updatedTabs = tabs;

  const { ALLOW_PINNED_TABS, ALLOW_DUPLICATES } = options;

  if (!ALLOW_PINNED_TABS) {
    updatedTabs = removePinnedTabs(updatedTabs);
  }

  if (!ALLOW_DUPLICATES) {
    updatedTabs = await removeDuplicateTabs(updatedTabs);
  }

  return updatedTabs;
}
