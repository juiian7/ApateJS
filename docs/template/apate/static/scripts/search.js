function injectNav() {
    /** @type {HTMLInputElement} */
    const input = document.querySelector("#search");
    const nav = document.querySelector("nav");

    /**
     * Unhides all nav links
     */
    function unhide() {
        nav.querySelectorAll("li>a").forEach((e) => {
            e.classList.remove("hidden");
        });
    }

    /**
     * Hides all nav links which don't contain query
     * @param {string} query
     */
    function hide(query) {
        nav.querySelectorAll("li>a").forEach((e) => {
            if (e.textContent.toLocaleLowerCase().includes(query.toLowerCase())) {
                e.classList.remove("hidden");
            } else e.classList.add("hidden");
        });
    }

    input.addEventListener("input", () => {
        const query = input.value || "";

        if (!query) {
            unhide();
            return;
        }
        hide(query);
    });
}
