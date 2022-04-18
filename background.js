import { onInstalled, onStartup } from "./listeners/runtime.js";
import { onActivated, onUpdated } from "./listeners/tabs.js";
import { onClicked as onClickedMenu } from "./listeners/contextMenus.js";
import { onFocusChanged } from "./listeners/windows.js";
import { onClicked as onClickedAction } from "./listeners/action.js";

chrome.runtime.onInstalled.addListener(onInstalled);
chrome.runtime.onStartup.addListener(onStartup);

chrome.contextMenus.onClicked.addListener(onClickedMenu);

chrome.tabs.onActivated.addListener(onActivated);
chrome.tabs.onUpdated.addListener(onUpdated);

chrome.windows.onFocusChanged.addListener(onFocusChanged);

chrome.action.onClicked.addListener(onClickedAction);
