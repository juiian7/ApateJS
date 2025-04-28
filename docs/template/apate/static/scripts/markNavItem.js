function markNavItem() {
    const name = document.querySelector("section[data-name]")?.getAttribute("data-name");
    if (!name) return;
    const navItem = document.querySelector(`nav li[data-name="${name}"]`);
    navItem.classList.add("item-in-view");
}
