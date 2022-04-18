import { BASE_URL, LIST_VIEW_PATH, TRANSFER_PATH } from "../constants/paths.js";

export const isExtensionURL = (url) => url.startsWith(BASE_URL);

export const getListPageURL = () => chrome.runtime.getURL(LIST_VIEW_PATH);

export const isListPageURL = (url) => url === getListPageURL();

export const getTransferPageURL = () => chrome.runtime.getURL(TRANSFER_PATH);
