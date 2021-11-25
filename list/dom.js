function createListItem(tab) {
  const item = document.createElement("li");
  item.innerText = `${tab.title} | ${tab.url}`;
  return item;
}
