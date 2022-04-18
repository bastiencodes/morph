import {
  createMenus,
  createToolbarMenu,
  updateMenuItems,
} from "../helpers/menu.js";
import { getOptions, initOptions } from "../helpers/storage.js";
import { getActiveTabInCurrentWindow } from "../tabs/get.js";
import { openListPage } from "../tabs/open.js";

export async function onInstalled(details) {
  console.log("Extension installed!");
  console.log("Details", details);

  if (details.reason === "install") {
    await initOptions();
  }

  createMenus();
  createToolbarMenu();

  const activeTab = await getActiveTabInCurrentWindow();
  const { id, windowId } = activeTab;
  await updateMenuItems(id, windowId);
}

export async function onStartup() {
  const { DISPLAY_MORPH_ON_STARTUP } = await getOptions();
  if (DISPLAY_MORPH_ON_STARTUP) {
    await openListPage();
  }
}
