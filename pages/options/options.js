import { getOptions, updateOption } from "../../helpers/storage.js";

(async () => {
  const options = await getOptions();
  console.log("Options", options);

  const restoreTabGroupSelect = document.getElementById(
    "restore-tab-group-select"
  );
  const pinnedTabsSelect = document.getElementById("pinned-tabs-select");
  const startupDisplaySelect = document.getElementById(
    "startup-display-select"
  );
  const removeTabsFromListSelect = document.getElementById(
    "remove-tabs-list-select"
  );
  const allowDuplicatesSelect = document.getElementById(
    "allow-duplicates-select"
  );

  const {
    RESTORE_TAB_GROUP_IN,
    ALLOW_PINNED_TABS,
    DISPLAY_MORPH_ON_STARTUP,
    REMOVE_TABS_FROM_LIST_ON_RESTORE,
    ALLOW_DUPLICATES,
  } = options;

  restoreTabGroupSelect.value = RESTORE_TAB_GROUP_IN;
  pinnedTabsSelect.value = String(ALLOW_PINNED_TABS);
  startupDisplaySelect.value = String(DISPLAY_MORPH_ON_STARTUP);
  removeTabsFromListSelect.value = String(REMOVE_TABS_FROM_LIST_ON_RESTORE);
  allowDuplicatesSelect.value = String(ALLOW_DUPLICATES);

  restoreTabGroupSelect.addEventListener("change", (e) =>
    updateOption("RESTORE_TAB_GROUP_IN", e.target.value)
  );

  function convertToBoolean(value) {
    return value === "true";
  }

  pinnedTabsSelect.addEventListener("change", (e) =>
    updateOption("ALLOW_PINNED_TABS", convertToBoolean(e.target.value))
  );

  startupDisplaySelect.addEventListener("change", (e) =>
    updateOption("DISPLAY_MORPH_ON_STARTUP", convertToBoolean(e.target.value))
  );

  removeTabsFromListSelect.addEventListener("change", (e) =>
    updateOption(
      "REMOVE_TABS_FROM_LIST_ON_RESTORE",
      convertToBoolean(e.target.value)
    )
  );

  allowDuplicatesSelect.addEventListener("change", (e) =>
    updateOption("ALLOW_DUPLICATES", convertToBoolean(e.target.value))
  );
})();
