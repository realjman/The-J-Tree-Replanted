addLayer('ab', {
    name: "autobuyers",
    symbol: "AB",
    row: "side",
    tooltip: "Autobuyers",
    tabFormat: [
        ["display-text", () => `
            ${colored("Autobuyers", "#fff", "h1")}<br>
            ${color("All of the autobuyers you unlocked will show here.", "#fff", "h3")}
        `],
        "blank",
        "clickables",
    ],
    clickables: {
        11: {
            title: "Classical Tree Game Autobuyer",
            display() {return `${player.j.autoBuyable ? "ON" : "OFF"}`},
            canClick() {return true},
            onClick() {
                if (player.j.autoBuyable) {player.j.autoBuyable = false}
                else {player.j.autoBuyable = true}
            },
            style: {
                "background-color": "#aba"
            },
        },
    },
    layerShown() {return hasMilestone("a", 6)}
})