// Content scripts are files that run in the context of web pages
(async () => {
  console.log("Hi from list view!");

  // TODO: how come this works in a content script?
  const window = await chrome.windows.getCurrent({ populate: true });
  console.log(window);

  const content = document.getElementById("content");
  const { tabs } = window;
  for (const tab of tabs) {
    const item = createListItem(tab);
    content.appendChild(item);
  }
})();
