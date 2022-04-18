import {
  ID_DISPLAY,
  ID_EXCLUDE,
  ID_HELP,
  ID_SEND_ALL,
  ID_SEND_ALL_WINDOWS,
  ID_SEND_EXCEPT,
  ID_SEND_LEFT,
  ID_SEND_ONLY,
  ID_SEND_RIGHT,
} from "../constants/menu.js";
import { openListPage } from "../tabs/open.js";
import {
  sendAll,
  sendAllWindows,
  sendExcept,
  sendLeft,
  sendOnly,
  sendRight,
} from "../tabs/send.js";

function stripPrefix(menuItemId) {
  // strip prefix to be able to call listener for both context menus
  const pos = menuItemId.indexOf("/");
  return menuItemId.substring(pos + 1);
}

export async function onClicked(info, currentTab) {
  const menuItemId = stripPrefix(info.menuItemId);

  switch (menuItemId) {
    case ID_DISPLAY: {
      await openListPage();
      break;
    }

    case ID_SEND_ALL: {
      await sendAll(currentTab);
      break;
    }

    case ID_SEND_ONLY: {
      await sendOnly(currentTab);
      break;
    }

    case ID_SEND_EXCEPT: {
      await sendExcept(currentTab);
      break;
    }

    case ID_SEND_LEFT: {
      await sendLeft(currentTab);
      break;
    }

    case ID_SEND_RIGHT: {
      await sendRight(currentTab);
      break;
    }

    case ID_SEND_ALL_WINDOWS: {
      await sendAllWindows();
      break;
    }

    case ID_EXCLUDE: {
      console.log(TITLE_EXCLUDE);
      break;
    }

    case ID_HELP: {
      console.log(TITLE_HELP);
      break;
    }
  }
}
