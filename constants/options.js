export const Location = {
  NEW_WINDOW_UNLESS: "new_window_unless",
  NEW_WINDOW: "new_window",
  CURRENT_WINDOW: "current_window",
};

export const defaultOptions = {
  RESTORE_TAB_GROUP_IN: Location.NEW_WINDOW_UNLESS,
  ALLOW_PINNED_TABS: false,
  DISPLAY_MORPH_ON_STARTUP: true,
  REMOVE_TABS_FROM_LIST_ON_RESTORE: true,
  ALLOW_DUPLICATES: true,
};
