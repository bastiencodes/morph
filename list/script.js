import { getTabGroups } from "../helpers/storage.js";

// Content scripts are files that run in the context of web pages
(async () => {
  console.log("Hi from list view!");

  const content = document.getElementById("content");

  const tabGroups = await getTabGroups();
  console.log(tabGroups);

  // get all tabs from all tab groups
  const tabs = Object.values(tabGroups).flatMap((tabGroup) => tabGroup.tabs);
  for (const tab of tabs) {
    const item = createListItem(tab);
    content.appendChild(item);
  }
})();
