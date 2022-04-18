function findWindow(windows, windowId) {
  const window = windows.find((window) => window.id === windowId);
  if (!window) throw new Error("No window found");
  return window;
}

export async function getAllWindows() {
  const windows = await chrome.windows.getAll();
  return windows;
}

export function isOnlyWindow(windows, windowId) {
  const window = findWindow(windows, windowId);
  return window && windows.length === 1;
}
