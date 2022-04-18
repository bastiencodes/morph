import { sendAll } from "../tabs/send";

export async function onClicked(currentTab) {
  await sendAll(currentTab);
}
