const EFFECT_PRICE = [
    E(10),
    E(300),
    E(6_000),
    E(200_000),
    E(1e6),
]

function formatDecimalTime(s, ac=2, type='s') {
    s = E(s)
    if (s.gte(31_536_000_000)) return format(s.div(31_536_000_000))+' milleniums'
    if (s.gte(31536000)) return format(s.div(31536000).floor(), 0)+"y "+formatDecimalTime(s.mod(31536000), ac, 'y')
    if (s.gte(86400)||type=='y') return format(s.div(86400).floor(), 0)+"d "+formatDecimalTime(s.mod(86400), ac, 'd')
    if (s.gte(3600)||type=='d') return format(s.div(3600).floor(), 0)+"h "+formatDecimalTime(s.mod(3600), ac, 'h')
    if (s.gte(60)||type=='h') return format(s.div(60).floor(), 0)+"m "+formatDecimalTime(s.mod(60), ac, 'm')
    return format(s, ac)+"s"
}

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
        currentTime: E(0),
    }},
    resetDescription: "Break the Time Continuum for ",
    color: "#9f9",
    requires() {return rowAllUnlocked(2)?E(40):E(40).add(Decimal.mul(player.t.unlockOrder, 8))}, // Can be a function that takes requirement increases into account
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
        mul = mul.mul(timeEffects(3))
        mul = mul.mul(buyableEffect('t', 12))
        if (hasMilestone('a', 25)) mul = mul.mul(3)

        let gain = base.mul(mul)

        return gain
    },

    gainMult() {
        let mul = E(1)

        if (hasUpgrade('j', 41)) mul = mul.div(1.1)

        return mul
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
                ['display-box', 1],
                ['display-box', 2],
                'blank',
                showBuyableInTF(11),
                'blank',
                showBuyableInTF(12),
                'blank',
                'upgrades',
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
    displayBoxes: {
        1: {
            title: () => `Time`,
            description: () => `
                You have ${colored(formatDecimalTime(player.t.time), '#6a6')} in time. (${format(player.t.time)} in seconds.)<br>
                You are generating ${colored(formatDecimalTime(tmp.t.timeGain), '#6a6')} per second in total.
            `,
            color: () => tmp.t.color
        },
        2: {
            title: () => `Current Time`,
            description: () => `
                The current time is ${colored(formatCurrentTime(), "#6a6")}. ${shiftDown?"":"(Hold shift for AM/PM format)"}<br>
                Day Time: 6AM - 7PM<br>
                Night Time: 7PM - 6AM
            `,
            color: () => tmp.t.color,
            unlocked: () => hasMilestone('a', 24)
        }
    },
    milestones: {
        1: {
            requirementDescription: `1 Condensed Time [1]`,
            effectDescription: () => `
                Keep the 1st, 9th, 15th ${colored("Abstract", tmp.a.color)} milestone on row 3 resets, ${colored("Less Scaling", "#000")} does not require ${colored("3 Abstract", tmp.a.color)}.<br>
                ${(!hasMilestone('d', 1))?'<h6 style="color: rgba(0, 0, 0, 0.3)">You will unlock another effect when you have the first milestone from one of the other row 3 layers.</h6>':'Since you have the first milestone from one of the other row 3 layers, divide '+colored("Abstract", tmp.a.color)+" requirement based on time."}<br>
                If you have all 3 layers on this row unlocked, remove the scaling of all row 3 layers.
            `,
            effect() {
                return E(1)
            },
            done() {return player.t.points.gte(1)},
        },
        2: {
            requirementDescription: `2 Condensed Time [2]`,
            effectDescription: () => `
                Keep the first six growth upgrades.
            `,
            done() {return player.t.points.gte(2)},
        },
        3: {
            requirementDescription: `3 Condensed Time [3]`,
            effectDescription: () => `
                Keep all the upgrades and 3 levels of ${colored('Classical Tree Game', '#000')} in ${colored("J", tmp.j.color)} Layer upon doing a ${colored("Time", tmp.t.color)} reset. ${colored("Abstract Milestone", tmp.a.color)} 4, 5, 6 and 7 are kept.
            `,
            done() {return player.t.points.gte(3)},
            unlocked() {return hasMilestone('t', 1)},
        },
        4: {
            requirementDescription: `4 Condensed Time [4]`,
            effectDescription: () => `
                Unlocks the ability to buy max all plant generations and they don't cost anything.
            `,
            done() {return player.t.points.gte(4)},
            unlocked() {return hasMilestone('t', 2)},
        },
        5: {
            requirementDescription: `6 Condensed Time [5]`,
            effectDescription: () => `
                ${formatX("10")} to J-points gain
            `,
            done() {return player.t.points.gte(6)},
            unlocked() {return hasMilestone('t', 3)},
        },
        6: {
            requirementDescription: `7 Condensed Time`,
            effectDescription: () => `
                Autobuys the two ${colored("Abstract", tmp.a.color)} buyables.
            `,
            done() {return player.t.points.gte(7)},
            unlocked() {return hasMilestone('t', 4)},
            toggles: [['a', 'autoBuyable']],
        },
    },
    buyables: {
        11: {
            title: () => `Timed Boosts`,
            display: () => {
                let h = `Each purchase of the buyable grants an effect.<br>`
                if (getBuyableAmount('t', 11).gte(1)) h += `Boost J-fragments based on time. Currently: ${formatX(timeEffects(1))} ${shiftDown?"["+writeLog(10, "x + 1")+superscript(2)+" + 1]":""}<br>`
                if (getBuyableAmount('t', 11).gte(2)) h += `Divide the cost of ${color("Classical Tree Game", "#000")}. Currently: ${formatDiv(timeEffects(2))} ${shiftDown?"["+writeExp(3, "(x / 10) + 1", null, true)+"]":""}<br>`
                if (getBuyableAmount('t', 11).gte(3)) h += `Boosts time based on time. Currently: ${formatX(timeEffects(3))} ${shiftDown?"[("+writeExp(1/3, "x")+" / 10) + 1]":""}<br>` // player.t.time.add(1).log(100).add(1).pow(2)
                if (getBuyableAmount('t', 11).gte(4)) h += `Boosts all the plants based on time. Currently: ${formatX(timeEffects(4))} ${shiftDown?"["+writeExp(2, writeLog(100, "x + 1")+" + 1", null, true)+"]":""}<br>`
                if (getBuyableAmount('t', 11).gte(5)) h += `Increases the J-fragments exponent based on time. Currently: ${formatAdd(timeEffects(5))} ${shiftDown?"["+writeExp(0.5, writeLog(10, "x + 1"), null, true)+" / 100]":""}<br>` // player.t.time.add(1).log(10).pow(0.5).div(100)

                if (getBuyableAmount('t', 11).gte(1)) h += `${shiftDown?"":"(Hold shift for formulas)"}<br>`
                h += `Cost: ${shiftDown?format(tmp.t.buyables[11].cost)+"s":formatDecimalTime(tmp.t.buyables[11].cost)} in time.`
                return h
            },
            cost(x) {
                return (EFFECT_PRICE[x] == undefined ? Decimal.dInf : EFFECT_PRICE[x])
            },
            canAfford() {return player.t.time.gte(this.cost())},
            buy() {
                player.t.time = player.t.time.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style: {
                "width": "100%",
                "min-height": "6rem",
                "font-size": "1.2vh",
            },
        },
        12: {
            title: () => `Time Boosters`,
            display: () => {
                let h = `Increase time gain per buyable amount${superscript(format(tmp.t.buyables[12].levelExp))}<br>`
                h += `Currently: ${formatX(buyableEffect('t', 12))}<br>`

                h += `Cost: ${shiftDown?format(tmp.t.buyables[12].cost)+"s":formatDecimalTime(tmp.t.buyables[12].cost)} in time.`
                return h
            },
            levelExp() {
                let x = E(1)
                return x
            },
            cost(x) {
                return x.pow_base(10)
            },
            effect(x) {
                return x.pow(2).add(1)
            },
            canAfford() {return player.t.time.gte(this.cost())},
            buy() {
                player.t.time = player.t.time.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return hasMilestone('a', 24)},
            tooltip: () => `
                Cost: 10${superscript('x')}<br>
                Effect: ${writeExp(2, 'x')} + 1
            `,
        },
    },
    upgrades: {
        11: {
            title: () => `Photosynthesis and Transpiration`,
            fullDisplay() {
                return `
                    ${color(this.title(), null, "h3")}<br>
                    During the day, your current time boosts your all your plants.<br>
                    During the night, your current time boosts J-fragments.<br>
                    Currently: ${formatX(upgradeEffectInTime(11, 1))}, ${formatX(upgradeEffectInTime(11, 2))}<br><br>
                    Cost: ${shiftDown?format(tmp.t.upgrades[11].cost)+"s":formatDecimalTime(tmp.t.upgrades[11].cost)} in time.
                `
            },
            tooltip: () => `
                Effects:<br>
                Day: (Current Time * 3) + 1<br>
                Night: ${writeExp(2, "Current Time", null, true)} + 1
            `,
            cost: E(1_000_000),
            currencyInternalName: "time",
            currencyLayer: "t",
        },
        12: {
            title: () => `Faster Dice`,
            fullDisplay() {
                return `
                    ${color(this.title(), null, "h3")}<br>
                    ${formatDecimalTime(-1, 0, "s")} Dice cooldown time<br><br>
                    Cost: ${shiftDown?format(tmp.t.upgrades[12].cost)+"s":formatDecimalTime(tmp.t.upgrades[12].cost)} in time.
                `
            },
            cost: E(10_000_000),
            currencyInternalName: "time",
            currencyLayer: "t",
            unlocked() {return hasUpgrade("t", 11)},
        },
    },
    update(diff) {
        timeGain = tmp.t.timeGain

        player.t.time = player.t.time.add(timeGain.mul(diff))
        player.t.currentTime = calculateCurrentTime().add(diff)
    },

    doReset(resettingLayer) {
        if (layers[resettingLayer].row <= this.row) {
            return;
        };

        let keptMS = []

        if (layers[resettingLayer].row == 3) {
            if (hasMilestone("l", 1)) keptMS.push(1, 3)
            if (hasMilestone("l", 2)) keptMS.push(2)
            if (hasChallenge("l", 11)) keptMS.push(6)
        }

        let keep = [keptMS]

        layerDataReset(this.layer, keep)

        player[this.layer].milestones.push(...keptMS)
    },

    canBuyMax() {return hasMilestone('l', 3)},
})

function timeEffects(type) {
    if (getBuyableAmount('t', 11).gte(1) && type == 1) return player.t.time.add(1).log(10).pow(2).add(1)
    if (getBuyableAmount('t', 11).gte(2) && type == 2) return player.t.time.div(10).add(1).pow(3)
    if (getBuyableAmount('t', 11).gte(3) && type == 3) return player.t.time.pow(1/3).div(10).add(1)
    if (getBuyableAmount('t', 11).gte(4) && type == 4) return player.t.time.add(1).log(100).add(1).pow(2)
    if (getBuyableAmount('t', 11).gte(5) && type == 5) return player.t.time.add(1).log(10).pow(0.5).div(100)

    return E(1)
}

function calculateCurrentTime(time=player.t.currentTime) {
    return time.mod(24)
}

function calcDnNCurrentTime(day, time=player.t.currentTime) {
    if (day) {return time.gt(6)&&time.lt(19)?time:E(0)}
    else return !(time.gt(6)&&time.lt(19))?time:E(0)
} 

function formatCurrentTime(time=player.t.currentTime) {
    return shiftDown?`${format(Decimal.floor(time.lt(1)||(time.lt(13)&&time.gt(12))?time.mod(12).add(12):time.mod(12)), 0)}:${format(time.mod(1).mul(60).floor(), 0)} ${time.gt(12)&&time.lt(24)?"PM":"AM"}`:`${format(Decimal.floor(time), 0)}:${format(time.mod(1).mul(60).floor(), 0)}`
}

function upgradeEffectInTime(upg, type) {
    if (upg == 11) {
        if (type == 1) return calcDnNCurrentTime(true).mul(3).add(1)
        if (type == 2) return calcDnNCurrentTime(false).pow(2).max(10)
    }

    return E(1)
}