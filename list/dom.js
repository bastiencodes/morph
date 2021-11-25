function createLink(tab) {
  const a = document.createElement("a");
  a.innerText = tab.title;
  a.setAttribute("href", tab.url);
  a.setAttribute("target", "_blank");
  a.setAttribute("rel", "noopener");
  return a;
}

function createListItem(tab) {
  const li = document.createElement("li");
  const link = createLink(tab);
  li.appendChild(link);
  return li;
}
