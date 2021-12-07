import { OPTION_NEW_WINDOW_UNLESS } from "./constants.js";

const generateId = () => "_" + Math.random().toString(36).substr(2, 9);

export function createTabGroup(tabs) {
  return {
    id: generateId(),
    createdAt: Date.now(),
    name: "",
    isLocked: false,
    isStar: false,
    tabs,
  };
}

export async function saveTabGroup(tabGroup) {
  await chrome.storage.local.set({ [tabGroup.id]: tabGroup });
}

export async function getTabGroups() {
  // Note: use null to get everything!
  const results = await chrome.storage.local.get(null);
  console.log("Results", results);
  const { options, ...tabGroups } = results;
  return tabGroups;
}

export async function getTabGroup(id) {
  const tabGroup = await chrome.storage.local.get(id);
  return tabGroup[id];
}

export async function toggleLock(tabGroup, isLocked) {
  if (isLocked === tabGroup.isLocked)
    throw new Error("Tab group already locked / unlocked.");
  const update = { ...tabGroup, isLocked };
  await saveTabGroup(update);
}

export async function toggleStar(tabGroup, isStar) {
  if (isStar === tabGroup.isStar)
    throw new Error("Tab group already stared / unstarred.");
  const update = { ...tabGroup, isStar };
  await saveTabGroup(update);
}

export async function removeTabGroup(id) {
  await chrome.storage.local.remove(id);
}

export async function configureOptions() {
  const defaultOptions = {
    RESTORE_TAB_GROUP_IN: OPTION_NEW_WINDOW_UNLESS,
    SEND_PINNED_TABS: false,
    DISPLAY_MORPH_ON_STARTUP: true,
    REMOVE_TABS_FROM_LIST_ON_RESTORE: true,
    ALLOW_DUPLICATES: true,
  };
  await chrome.storage.local.set({ options: defaultOptions });
}

export async function getOptions() {
  const result = await chrome.storage.local.get("options");
  return result.options;
}
