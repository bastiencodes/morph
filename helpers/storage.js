const generateId = () => "_" + Math.random().toString(36).substr(2, 9);

export function createTabGroup(tabs) {
  return {
    id: generateId(),
    createdAt: Date.now(),
    name: "",
    isLocked: false,
    isStar: false,
    tabs,
  };
}
