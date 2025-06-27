addLayer('d', {
    name: "Dice", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "D", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        unlockOrder: 0,
        fragments: E(0),
        goldenFragments: E(0),

        diceCD: E(0),
        lastDiceValue: E(0),
        highestRoll: E(0),

        resetTime: 0,

    }},
    resetDescription: "Sacrifice to the RNG Gods for ",
    color: "#6ea",
    requires() {return E(40).add(Decimal.mul(player.d.unlockOrder, 8))}, // Can be a function that takes requirement increases into account
    resource: "Dice Power", // Name of prestige currency
    baseResource: "Abstract", // Name of resource prestige is based on
    baseAmount() {return player.a.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    base: 1.075,
    row: 2,
    branches: ['a', 'g'],
    increaseUnlockOrder: ['t','s'],
    effectDescription: () => ` which gives you a ${colored(format(tmp.d.maxDiceSides, 0), tmp.d.color)} sided dice.`,
    maxDiceSides() {
        let x = player.d.points
        return player.d.unlocked ? x.add(3) : x
    },
    diceRollCD() {
        let x = E(5)
        if (hasMilestone('d', 2)) x = x.sub(1)
        if (hasUpgrade('d', 14)) x = x.sub(1)
        return x
    },
    diceEffect1() {
        let x = player.d.fragments
        return x.add(1).log(10).mul(2).add(1)
    },
    diceEffect2() {
        let x = player.d.fragments
        return x.pow(1.2).div(10).add(1)
    },
    diceFragMult() {
        let x = E(1)
        x = x.mul(milestoneEffect('d', 3))
        if (hasUpgrade(this.layer, 11)) x = x.mul(upgradeEffect(this.layer, 11))
        if (hasUpgrade(this.layer, 13)) x = x.mul(upgradeEffect(this.layer, 13))
        return x
    },

    gDiceChance() {
        let x = E(1)
        return x
    },
    gDiceGain() {
        let x = E(1)
        return x
    },
    layerShown() {return hasUpgrade('g', 35) || player.t.unlocked || player.d.unlocked},
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button",
                "resource-display",
                ['display-text', () => `${colored("RNG LAYER", tmp.d.color)}`],
                ['microtabs', 'main'],
            ],
        },
        "Dice": {
            content: [
                "main-display",
                "prestige-button",
                "resource-display",
                ["display-box", 1],
                ["display-box", 2],
                'blank',
                "clickables",
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
            Upgrades: {
                content: [
                    'upgrades',
                ],
            },
        },
    },
    displayBoxes: {
        1: {
            title: () => colored('Dice', tmp.d.color),
            description: () => `
                You have ${colored(format(player.d.fragments)+" Dice Fragments", tmp.d.color)}, which gives a boost to all the Plants by ${colored(formatX(tmp.d.diceEffect1), tmp.d.color)} ${shiftDown?"("+writeLog(10, "x + 1")+" * 2 + 1)":""} and J-fragments by ${colored(formatX(tmp.d.diceEffect2), tmp.d.color)} ${shiftDown?"("+writeExp(1.2, "x")+" / 10 + 1)":""}.<br>
                    ${shiftDown?'':'(Hold shift for formulas)'}
                    <h5 style="color: rgba(0, 0, 0, 0.3)">[You gain dice fragments by rolling the dice, the amount the dice shows gives you the amount of dice fragments.]</h5>
                    Your highest roll is ${colored(format(player.d.highestRoll, 0), tmp.d.color)}.
            `,
            color: () => "#4a9",
            style: {
                "width": "100%"
            },
        },
        2: {
            title: () => colored('Golden Dice Fragments', "#cd2"),
            description: () => `
                You have ${colored(format(player.d.goldenFragments), "#cd2")} Golden Dice Fragments.<br>
                You gain ${colored(format(tmp.d.gDiceGain), "#cd2")} Golden Dice Fragments with a ${colored(formatPercents(tmp.d.gDiceChance.div(100)), "#cd2")} chance every Dice roll.
            `,
            color: () => "#4b7",
            style: {
                "width": "100%"
            },
            unlocked() {return hasMilestone('a', 24)}
        },
    },
    milestones: {
        1: {
            requirementDescription: `1 Dice Power [1]`,
            effectDescription: () => `
                Keep the 1st, 9th, 15th ${colored("Abstract", tmp.a.color)} milestone on row 3 resets, ${colored("Less Scaling", "#000")} does not require ${colored("3 Abstracts", tmp.a.color)}.
                ${(!(hasMilestone('t', 1)||hasMilestone('s', 1)))?'<h6 style="color: rgba(0, 0, 0, 0.3)">You will unlock another effect when you have the first milestone from one of the other row 3 layers.</h6>':'Since you have the first milestone from one of the other row 3 layers, divide '+colored("Abstract", tmp.a.color)+" requirement based on dice fragments."}<br>
                Currently: ${rowMultipleUnlocked(2)?formatDiv(milestoneEffect('d', 1)):"[LOCKED]"}
            `,
            effect() {
                let x = player.d.fragments
                return rowMultipleUnlocked(2)?x.add(1).log(10).pow(2/3).add(1):E(1)
            },
            done() {return player.d.points.gte(1)},
            tooltip: () => `${writeExp(2/3, writeLog("10", "x + 1"))} + 1`
        },
        2: {
            requirementDescription: `2 Dice Power [2]`,
            effectDescription: () => `
                -1s cooldown on rolling the dice, J-points is boosted based on ${colored("Dice Power", tmp.d.color)}. Currently: ${formatX(milestoneEffect('d', 2))}.
            `,
            effect() {
                let x = player.d.points
                return x.pow(0.9).add(1)
            },
            tooltip: () => `Effect: ${writeExp(0.9, "x")} + 1`,
            done() {return player.d.points.gte(2)},
            unlocked() {return hasMilestone('d', 1)},
        },
        3: {
            requirementDescription: `3 Dice Power [3]`,
            effectDescription: () => `
                Keep all the upgrades and 3 levels of ${colored('Classical Tree Game', '#000')} in ${colored("J", tmp.j.color)} Layer upon doing a ${colored("Dice", tmp.d.color)} reset. ${colored("Abstract Milestone", tmp.a.color)} 4, 5, 6 and 7 are kept. ${colored("Dice Power", tmp.d.color)} boosts ${colored("Dice Fragments", tmp.d.color)}. Currently: ${formatX(milestoneEffect('d', 3))}
            `,
            effect() {
                let x = player.d.points
                return (Decimal.max(x, 1).add(1).log(2).pow(0.6)).pow_base(2).sub(1)
            },
            tooltip: () => `Effect: 2${superscript(writeLog('2', "max(x, 1) + 1") + superscript(format(0.6)))} - 1`,
            done() {return player.d.points.gte(3)},
            unlocked() {return hasMilestone('d', 1)},
        },
    },
    clickables: {
        11: {
            title: () => `Roll the Dice`,
            display() {return `<h1>${format(player.d.lastDiceValue, 0)}</h1><br> Cooldown: ${formatDecimalTime(player.d.diceCD)}`},
            unlocked() {return player.d.unlocked},
            canClick() {return player.d.diceCD.lte(0) && player.d.unlocked},
            onClick() {
                player.d.diceCD = tmp.d.diceRollCD
                player.d.lastDiceValue = rollDice(tmp.d.maxDiceSides)
                player.d.highestRoll = player.d.highestRoll.max(player.d.lastDiceValue)
                player.d.fragments = player.d.fragments.add(player.d.lastDiceValue.mul(tmp.d.diceFragMult))
                if (hasMilestone('a', 24)) {
                    if (rollGDice(tmp.d.gDiceChance)) player.d.goldenFragments = player.d.goldenFragments.add(tmp.d.gDiceGain)
                }
            }
        }
    },
    upgrades: {
        11: {
            title: "Pretty Lucky",
            description: () => `Your highest rolls boosts Dice Fragments.`,
            effect() {
                let x = player.d.highestRoll
                return E(1.1).pow(x)
            },
            effectDisplay() {return formatX(upgradeEffect(this.layer, this.id))},
            tooltip: () => `Effect: 1.1${superscript('x')}`,
            cost: E(100),
            currencyDisplayName: "Dice Fragments",
            currencyInternalName: "fragments",
            currencyLayer: "d",
        },
        12: {
            title: "Need more boosts",
            description: () => `Your dice fragments boosts J-fragments gain exponent`,
            effect() {
                let x = player.d.fragments
                return (x.add(1)).pow(0.01).log(10).sub(0.005).max(0)
            },
            effectDisplay() {return formatAdd(upgradeEffect(this.layer, this.id))},
            tooltip: () => `Effect: max(0, ${writeLog('10', writeExp(0.01, 'x + 1'))} - 0.005)`,
            cost: E(300),
            currencyDisplayName: "Dice Fragments",
            currencyInternalName: "fragments",
            currencyLayer: "d",
        },
        13: {
            title: "Dice of Abstract",
            description: () => `Your abstract boosts dice fragments gain.`,
            effect() {
                let x = player.a.points
                return x.pow(0.5).div(10).add(1)
            },
            effectDisplay() {return formatX(upgradeEffect(this.layer, this.id))},
            tooltip: () => `Effect: 1 + (${writeExp(0.5, 'x')} / 10)`,
            cost: E(1000),
            currencyDisplayName: "Dice Fragments",
            currencyInternalName: "fragments",
            currencyLayer: "d",
        },
        14: {
            title: "Less time consuming",
            description: () => `-1s to Dice roll cooldown.`,
            cost: E(2000),
            currencyDisplayName: "Dice Fragments",
            currencyInternalName: "fragments",
            currencyLayer: "d",
        },
    },
    update(diff) {
        player.d.diceCD = player.d.diceCD.sub(diff).clampMin(0)
    },
})