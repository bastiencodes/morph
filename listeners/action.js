import { sendAll } from "../tabs/send.js";

export async function onClicked(currentTab) {
  await sendAll(currentTab);
}
