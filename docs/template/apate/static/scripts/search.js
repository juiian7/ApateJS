function injectNav() {
    /** @type {HTMLInputElement} */
    const input = document.querySelector("#search");
    const nav = document.querySelector("nav");

    /**
     * Unhides all nav links
     */
    function unhide() {
        nav.querySelectorAll("li").forEach((e) => {
            e.classList.remove("hidden");
        });
    }

    /**
     * Hides all nav links which don't contain query
     * @param {string} query
     */
    function hide(query) {
        /** @param {HTMLElement} self */
        function showParent(self) {
            if (self.tagName == "UL") {
                showParent(self.parentElement);
            } else if (self.tagName == "LI") {
                self.classList.remove("hidden");
                showParent(self.parentElement);
            }
        }
        nav.querySelectorAll("li").forEach((e) => {
            if (e.textContent.toLocaleLowerCase().includes(query.toLowerCase())) {
                e.classList.remove("hidden");
                showParent(e.parentElement);
            } else e.classList.add("hidden");
        });
    }

    input.addEventListener("input", () => {
        const query = (input.value || "").trim();

        if (!query) unhide();
        else hide(query);

        // check if all li are hidden and hide heading
        const uls = document.querySelectorAll("nav>h3+ul");
        uls.forEach((ul) => {
            let hasVisibleElements = false;
            for (const li of ul.querySelectorAll("li").values()) {
                if (!li.classList.contains("hidden")) {
                    hasVisibleElements = true;
                    break;
                }
            }
            if (!hasVisibleElements) {
                ul.previousElementSibling.classList.add("hidden");
            } else ul.previousElementSibling.classList.remove("hidden");
        });
    });
}
