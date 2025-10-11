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
                "background-color": () => tmp.j.color
            },
            unlocked() {
                return hasMilestone('a', 6)
            },
        },
        12: {
            title: "Abstract Buyables Autobuyer",
            display() {return `${player.a.autoBuyable ? "ON" : "OFF"}`},
            canClick() {return true},
            onClick() {
                if (player.a.autoBuyable) {player.a.autoBuyable = false}
                else {player.a.autoBuyable = true}
            },
            style: {
                "background-color": () => tmp.a.color
            },
            unlocked() {
                return hasMilestone('t', 6)
            },
        },
        13: {
            title: "Plant Generation Autobuyers",
            display() {return `${player.g.autoBuyable ? "ON" : "OFF"}`},
            canClick() {return true},
            onClick() {
                if (player.g.autoBuyable) {player.g.autoBuyable = false}
                else {player.g.autoBuyable = true}
            },
            style: {
                "background-color": () => tmp.g.color
            },
            unlocked() {
                return hasMilestone('d', 6)
            },
        },
        21: {
            title: "Auto Abstract",
            display() {return `${player.a.autoAbstract ? "ON" : "OFF"}`},
            canClick() {return true},
            onClick() {
                if (player.a.autoAbstract) {player.a.autoAbstract = false}
                else {player.a.autoAbstract = true}
            },
            style: {
                "background-color": () => tmp.a.color
            },
            unlocked() {
                return hasMilestone('l', 2)
            },
        },
    },
    layerShown() {return true},
})