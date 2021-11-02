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

  // open list view
  await chrome.tabs.create({ url: "list/index.html" });
});
