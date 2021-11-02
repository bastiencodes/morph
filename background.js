chrome.runtime.onInstalled.addListener((details) => {
  console.log("Extension installed!");
  console.log("Details", details);
});

chrome.action.onClicked.addListener(async (tab) => {
  console.log(tab);

  const { windowId } = tab;
  const tabs = await chrome.tabs.query({ windowId });
  console.log(tabs);
});
