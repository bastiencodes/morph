export async function getAllTabsInWindow(tab) {
  const { windowId } = tab;
  const tabs = await chrome.tabs.query({ windowId });
  return tabs;
}

// TODO: merge both by passing current as param
export async function getActiveTabInCurrentWindow() {
  const currentWindowId = chrome.windows.WINDOW_ID_CURRENT;
  const activeTab = await getActiveTabInWindow(currentWindowId);
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
