const triggers = [
    {
        key: { code: "KeyF", ctrl: true },
        action: (ev) => document.querySelector("nav input").focus(),
    },
    {
        key: { code: "KeyD", alt: true },
        action: (ev) => {
            ev.preventDefault();
            const html = document.querySelector("html");
            const current = html.getAttribute("data-theme") || "light";
            html.setAttribute("data-theme", current == "dark" ? "light" : "dark");
        },
    },
];

window.addEventListener("keydown", (ev) => {
    for (const t of triggers) {
        if (t.key.code == ev.code && !!t.key.ctrl == ev.ctrlKey && !!t.key.meta == ev.metaKey && !!t.key.alt == ev.altKey) {
            t.action(ev);
        }
    }
});
