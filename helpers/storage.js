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
  const tabGroups = await chrome.storage.local.get(null);
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

export async function removeTabGroup(id) {
  await chrome.storage.local.remove(id);
}
