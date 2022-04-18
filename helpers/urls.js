import { LIST_VIEW_PATH, TRANSFER_PATH } from "../constants/paths";

export const getListPageURL = () => chrome.runtime.getURL(LIST_VIEW_PATH);

export const getTransferPageURL = () => chrome.runtime.getURL(TRANSFER_PATH);
