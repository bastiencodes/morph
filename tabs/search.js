export async function findTabByURL(url) {
  // returns empty array if no tabs match
  const tabs = await chrome.tabs.query({ url });
  const tab = tabs[0];
  return tab;
}

function findTabById(tabs, tabId) {
  const tab = tabs.find((tab) => tab.id === tabId);
  if (!tab) throw new Error("No tab found");
  return tab;
}

export function isTabMostLeft(tabs, tabId) {
  const tab = findTabById(tabs, tabId);
  return tab.index === 0;
}

export function isTabMostRight(tabs, tabId) {
  const tab = findTabById(tabs, tabId);
  return tab.index === tabs.length - 1;
}

export function isOnlyTabInWindow(tabs, tabId) {
  const tab = findTabById(tabs, tabId);
  return tab && tabs.length === 1;
}
