addLayer('t', {
    name: "Time", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "T", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        time: new Decimal(0),
        unlockOrder: 0,
        resetTime: 0,
    }},
    resetDescription: "Break the Time Continuum for ",
    color: "#9f9",
    requires() {return E(40).add(Decimal.mul(player.t.unlockOrder, 8))}, // Can be a function that takes requirement increases into account
    resource: "Condensed Time", // Name of prestige currency
    baseResource: "Abstract", // Name of resource prestige is based on
    baseAmount() {return player.a.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    base: 1.075,
    row: 2,
    branches: ['a', 'g'],
    increaseUnlockOrder: ['d','s'],
    effectDescription: () => ` which generates ${colored(formatAdd(tmp.t.effect), tmp.t.color)} Time/s.<br>${shiftDown?'Effect: x'+superscript(format(2)):'(Hold shift for formula)'}`,
    effect() {
        let x = player.t.points
        return x.pow(2)
    },
    timeGain() {
        let base = tmp.t.effect

        let mul = E(1)

        let gain = base.mul(mul)

        return gain
    },
    layerShown() {return hasUpgrade('g', 35) || player.t.unlocked || player.d.unlocked},
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button",
                "resource-display",
                ['display-text', () => `${colored("IDLE LAYER", tmp.t.color)}`],
                ['microtabs', 'main']
            ],
        },
        "Time": {
            content: [
                "main-display",
                "prestige-button",
                "resource-display",
                ["display-text", () => `
                    You have ${colored(formatDecimalTime(player.t.time), tmp.t.color)} in time.<br>
                    You are generating ${colored(formatDecimalTime(tmp.t.timeGain), tmp.t.color)} per second in total.   
                `]
            ],
        },
    },
    microtabs: {
        main: {
            Milestones: {
                content: [
                    'milestones',
                ],
            },
        },
    },
    milestones: {
        1: {
            requirementDescription: `1 Condensed Time [1]`,
            effectDescription: () => `
                Keep the 1st, 9th, 15th ${colored("Abstract", tmp.a.color)} milestone on row 3 resets, ${colored("Less Scaling", "#000")} does not require ${colored("3 Abstract", tmp.a.color)}.<br>
                ${(!hasMilestone('d', 1))?'<h6 style="color: rgba(0, 0, 0, 0.3)">You will unlock another effect when you have the first milestone from one of the other row 3 layers.</h6>':'Since you have the first milestone from one of the other row 3 layers, divide '+colored("Abstract", tmp.a.color)+" requirement based on time."}
            `,
            done() {return player.t.points.gte(1)},
        }
    },
    update(diff) {
        timeGain = tmp.t.timeGain

        player.t.time = player.t.time.add(timeGain.mul(diff))
    },
})