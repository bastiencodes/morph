export async function getAllTabsInWindow(currentTab) {
  const { windowId } = currentTab;
  const tabs = await chrome.tabs.query({ windowId });
  return tabs;
}

// TODO: merge both by passing current as param
export async function getActiveTabInCurrentWindow() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tabs.length !== 1)
    throw new Error("Should only have 1 active tab in current window.");
  const activeTab = tabs[0];
  return activeTab;
}

export async function getActiveTabInWindow(windowId) {
  const tabs = await chrome.tabs.query({
    active: true,
    highlighted: true,
    windowId,
  });
  console.log("windowId", windowId, "tabs", tabs);
  if (tabs.length !== 1)
    throw new Error("Should only have 1 active and highlighted tab.");
  const activeTab = tabs[0];
  return activeTab;
}
