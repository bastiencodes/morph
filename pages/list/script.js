import { getTabGroups } from "../../helpers/storage.js";
import { createTabGroup } from "./dom.js";
import { setUpMenu } from "./menu.js";

// Content scripts are files that run in the context of web pages
(async () => {
  console.log("Hi from list view!");

  setUpMenu();

  const content = document.getElementById("content");

  const tabGroups = await getTabGroups();
  console.log(tabGroups);

  for (const [id, tabGroup] of Object.entries(tabGroups)) {
    console.log(id, tabGroup);
    const el = createTabGroup(tabGroup);
    content.appendChild(el);
  }
})();
