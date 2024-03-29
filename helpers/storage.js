import { defaultOptions } from "../constants/options.js";

const generateId = () => "_" + Math.random().toString(36).substring(2, 9);

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

// return URLs of all stored tabs
export async function getTabURLs() {
  const tabGroups = await getTabGroups();
  return Object.values(tabGroups)
    .map((tabGroup) => tabGroup.tabs)
    .flat(1)
    .map((tab) => tab.url);
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

export async function initOptions() {
  await chrome.storage.local.set({ options: defaultOptions });
}

export async function getOptions() {
  const result = await chrome.storage.local.get("options");
  return result.options;
}

export async function updateOption(name, value) {
  console.log(name, value);
  const options = await getOptions();
  const updatedOptions = { ...options, [name]: value };
  console.log(updatedOptions);
  await chrome.storage.local.set({ options: updatedOptions });
}
