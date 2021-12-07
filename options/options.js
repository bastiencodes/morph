import { getOptions, updateOption } from "../helpers/storage.js";

(async () => {
  const options = await getOptions();
  console.log("Options", options);

  const restoreTabGroupSelect = document.getElementById(
    "restore-tab-group-select"
  );

  const { RESTORE_TAB_GROUP_IN } = options;

  restoreTabGroupSelect.value = RESTORE_TAB_GROUP_IN;

  restoreTabGroupSelect.addEventListener("change", (e) =>
    updateOption("RESTORE_TAB_GROUP_IN", e.target.value)
  );
})();
