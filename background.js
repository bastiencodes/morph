chrome.runtime.onInstalled.addListener((details) => {
  console.log("Extension installed!");
  console.log("Details", details);
});
