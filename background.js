chrome.runtime.onInstalled.addListener((details) => {
  console.log("Extension installed!");
  console.log("Details", details);
});

chrome.action.onClicked.addListener(async (tab) => {
  console.log(tab);

  const { windowId } = tab;
  const tabs = await chrome.tabs.query({ windowId });
  console.log(tabs);

  const urls = tabs.map((tab) => tab.url);
  await chrome.windows.create({ url: urls });

  // close window and all tabs inside it
  await chrome.windows.remove(windowId);

  // open list view (if not already opened)
  const LIST_VIEW_PATH = "list/index.html";
  const listViewURL = chrome.runtime.getURL(LIST_VIEW_PATH);
  const listViewTabs = await chrome.tabs.query({ url: listViewURL });
  if (!listViewTabs.length) {
    await chrome.tabs.create({ url: LIST_VIEW_PATH });
  }
});
