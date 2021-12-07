import {
  getOptions,
  getTabGroup,
  removeTabGroup,
  toggleLock,
  toggleStar,
} from "../helpers/storage.js";
import { openTabs } from "../helpers/tabs.js";

// tab header
function createTabCount(count) {
  const span = document.createElement("span");
  span.className = "tabCount";
  span.innerText = count !== 1 ? `${count} tabs` : `${count} tab`;
  return span;
}

function createTabDate(createdAt) {
  const span = document.createElement("span");
  span.innerText = new Date(createdAt).toISOString();
  return span;
}

async function deleteTabGroup(id, btn) {
  await removeTabGroup(id);
  const el = btn.closest(".tabGroup");
  el.remove();
}

function createRestoreButton(id, isLocked, tabs) {
  const restoreBtn = document.createElement("button");
  restoreBtn.innerText = "Restore all";
  restoreBtn.addEventListener("click", async () => {
    await openTabs(tabs);

    const { REMOVE_TABS_FROM_LIST_ON_RESTORE } = await getOptions();
    if (REMOVE_TABS_FROM_LIST_ON_RESTORE && !isLocked) {
      await deleteTabGroup(id, restoreBtn);
    }
  });
  return restoreBtn;
}

function createDeleteButton(id) {
  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = "Delete all";
  deleteBtn.addEventListener("click", async () => {
    if (confirm("Are you sure you want to delete those tabs?")) {
      await deleteTabGroup(id, deleteBtn);
    }
  });
  return deleteBtn;
}

function updateLockButtonText(btn, isLocked) {
  btn.innerText = `${!isLocked ? "Lock" : "Unlock"} this tab group`;
}

function toggleDeleteAllButton(lockBtn, isLocked) {
  const deleteAllBtn = lockBtn.previousElementSibling;
  deleteAllBtn.disabled = isLocked;
}

function createLockButton(tabGroup) {
  const lockBtn = document.createElement("button");
  updateLockButtonText(lockBtn, tabGroup.isLocked);
  return lockBtn;
}

function updateStarButtonText(btn, isStar) {
  btn.innerText = `${!isStar ? "Star" : "Unstar"} this tab group`;
}

function createStarButton(tabGroup) {
  const { id, isStar } = tabGroup;
  const starBtn = document.createElement("button");
  updateStarButtonText(starBtn, isStar);
  starBtn.addEventListener("click", async () => {
    const tabGroup = await getTabGroup(id);
    await toggleStar(tabGroup, !tabGroup.isStar);
    updateStarButtonText(starBtn, !tabGroup.isStar);
    // TODO: reorder tab groups!!
  });
  return starBtn;
}

function createTabActions(tabGroup) {
  const { id, isLocked, tabs } = tabGroup;
  const div = document.createElement("div");
  div.className = "tabActions";

  const restoreBtn = createRestoreButton(id, isLocked, tabs);
  const deleteBtn = createDeleteButton(id);
  const lockBtn = createLockButton(tabGroup);
  const starBtn = createStarButton(tabGroup);

  div.append(restoreBtn, deleteBtn, lockBtn, starBtn);

  toggleDeleteAllButton(lockBtn, tabGroup.isLocked);

  lockBtn.addEventListener("click", async () => {
    const tabGroup = await getTabGroup(id);
    await toggleLock(tabGroup, !tabGroup.isLocked);
    updateLockButtonText(lockBtn, !tabGroup.isLocked);
    toggleDeleteAllButton(lockBtn, !tabGroup.isLocked);
  });

  return div;
}

function createTabHeader(tabGroup) {
  const { id, createdAt, tabs } = tabGroup;

  const div = document.createElement("div");
  div.className = "tabHeader";

  const tabCount = createTabCount(tabs.length);

  const wrapper = document.createElement("div");
  const tabDate = createTabDate(createdAt);
  const tabActions = createTabActions(tabGroup);
  wrapper.append(tabDate, tabActions);

  div.append(tabCount, wrapper);

  return div;
}

// tab list
function createTabFavicon(src) {
  const img = document.createElement("img");
  img.className = "tabFavicon";
  img.src = src;
  return img;
}

function createTabLink(url, text) {
  const a = document.createElement("a");
  a.href = url;
  a.innerText = text;
  return a;
}

function createTab(tab) {
  const div = document.createElement("div");
  div.className = "tab";

  const favicon = createTabFavicon(tab.favIconUrl);
  const link = createTabLink(tab.url, tab.title);

  div.append(favicon, link);

  return div;
}

function createTabList(tabs) {
  const div = document.createElement("div");
  div.className = "tabList";

  const elements = tabs.map((tab) => createTab(tab));
  div.append(...elements);

  return div;
}

export function createTabGroup(tabGroup) {
  const div = document.createElement("div");
  div.className = "tabGroup";

  const tabHeader = createTabHeader(tabGroup);
  const tabList = createTabList(tabGroup.tabs);
  div.append(tabHeader, tabList);

  return div;
}
