addLayer('stats', {
    name: "stats",
    symbol: "ST",
    row: "side",
    color: "#cfc",
    tooltip: "Statistics",
    tabFormat: [
        ["display-text", () => `
            ${colored("Statistics", "#fff", "h1")}<br>
            ${color("All of the currencies you unlocked will show here.", "#fff", "h3")}
        `],
        "blank",
        "display-boxes",
    ],
    displayBoxes: {
        1: {
            title: () => `${colored("LAYER 0", '#333', 'h2')}`,
            description: () => `${colored("J-fragments", "#000")}<br>
            Amount: ${format(player.points)}<br>
            Base Gain: ${format(tmp.basePointGen)}<br>
            Total Multipliers: ${formatX(getPointMult())}<br>
            Total Exponents: ${formatPow(getPointExp())}<br>
            Total Gain: ${format(tmp.pointGen)}/s
            `,
            color: "#ccc",
            unlocked() {return true},
        },
        2: {
            title: () => `${colored("LAYER 1", '#222', 'h2')}`,
            description: () => `${colored("J-points", "#000")}<br>
            Amount: ${format(player.j.points)}<br>
            Total Multiplier: ${formatX(tmp.j.gainMult)}, ${formatPow(tmp.j.gainExp)}<br>
            Gain Formula: floor(${writeExp(format(0.4), "J-fragments")})<br>
            Passive Gain Percentage: ${formatPercents(tmp.j.passiveGeneration)}<br>
            Passive Gain: ${format(getResetGain('j').mul(tmp.j.passiveGeneration))}/s
            `,
            color: () => tmp.j.color,
            unlocked() {return player.j.unlocked}
        },
        3: {
            title: () => `${colored("LAYER 2", '#222', 'h2')}`,
            description: () => `${colored("Abstract", "#000")}<br>
            Amount: ${format(player.a.points, 0)}<br>
            Cost Formula: ${format(tmp.a.requires)} * ${format(tmp.a.base)}${superscript("Abstract"+superscript(format(tmp.a.exponent)))}<br>
            Total Cost Divison: ${formatDiv(tmp.a.gainMult.pow(-1))}<br>
            Total Cost Exp: ${formatPow(tmp.a.gainExp.pow(-1))}<br><br>
            ${colored("Abstract Power", "#000", "h4")}
            Amount: ${format(player.a.power)}<br>
            Base Gain: ${format(tmp.a.baseAPGen)}<br>
            Total Gain: ${format(tmp.a.abstractPowerGen)}/s
            `,
            color: () => tmp.a.color,
            unlocked() {return player.a.unlocked},
        },
        4: {
            description: () => `${colored("Growth", "#000")}<br>
            Amount: ${format(player.g.points)}<br>
            Gain Formula: floor(${writeExp(format(0.8), "J-fragments / "+format(tmp.g.requires), 'rgba(0, 0, 0, 0.5)', true)})<br>
            Total Multiplier: ${formatX(tmp.g.gainMult)}, ${formatPow(tmp.g.gainExp)}<br>
            Passive Gain Percentage: ${formatPercents(tmp.g.passiveGeneration)}<br>
            Passive Gain: ${format(getResetGain('g').mul(tmp.g.passiveGeneration))}/s<br><br>

            ${colored("Plants", "#000", "h4")}
            Seeds: ${format(player.g.seeds)} (${format(tmp.g.seedGain)}/s)<br>
            Sprouts: ${format(player.g.sprouts)} (${format(tmp.g.sproutGain)}/s)<br>
            Plants: ${format(player.g.plants)} (${format(tmp.g.plantGain)}/s)<br>
            Trees: ${format(player.g.trees)} (${format(tmp.g.treeGain)}/s)<br>
            `,
            color: () => tmp.g.color,
            unlocked() {return player.g.unlocked},
        },
        5: {
            title: () => `${colored("LAYER 3", "#000", "h2")}`,
            description: () => `${colored("Time", "#000")}<br>
            Amount: ${format(player.t.points)}<br>
            Cost Formula: ${format(tmp.t.requires)} * ${format(tmp.t.base, 3)}${superscript("Time"+superscript(format(tmp.t.exponent)))}<br><br>

            ${colored("Time", DARK)}<br>
            Time: ${formatDecimalTime(player.t.time)} / ${format(player.t.time)}s
            `,
            color: () => tmp.t.color,
            unlocked() {return player.t.unlocked},
        },
        6: {
            title: () => `${!player.t.unlocked?colored("LAYER 3", "#000", "h2"):""}`,
            description: () => `${colored("Dice", "#000")}<br>
            Amount: ${format(player.d.points)}<br>
            Cost Formula: ${format(tmp.d.requires)} * ${format(tmp.d.base, 3)}${superscript("Dice Power"+superscript(format(tmp.d.exponent)))}<br><br>
            ${colored("Dice Fragments", DARK)}<br>
            Amount: ${format(player.d.fragments)}<br>
            Total Multiplier: ${formatX(tmp.d.diceFragMult)}
            `,
            color: () => tmp.d.color,
            unlocked() {return player.d.unlocked},
        },
        7: {
            title: () => `${!(player.t.unlocked||player.d.unlocked)?colored("LAYER 3", "#000", "h2"):""}`,
            description: () => `${colored("Space", "#000")}<br>
            Amount: ${format(player.s.points)}<br>
            Cost Formula: ${format(tmp.s.requires)} * ${format(tmp.s.base, 3)}${superscript("Space"+superscript(format(tmp.s.exponent)))}<br>
            Volume of 3D Plane: ${format(tmp.s.getSpaceVolume)} units${superscript(3)}
            `,
            color: () => tmp.s.color,
            unlocked() {return player.s.unlocked},
        },
        8: {
            title: () => `${colored("LAYER 4", "#000")}`,
            description: () => `${colored("Life Points", "#000")}<br>
            Amount: ${format(player.l.points)}<br>
            Cost Formula: floor(${writeLog(10, "J-fragments + 1")} / ${format(308.25)})<br>
            `,
            color: () => tmp.l.color,
            unlocked() {return player.s.unlocked},
        },
    },
    componentStyles: {
        "display-boxes"() {return {'width' : '40rem'}}
    },
    layerShown() {return true}
})