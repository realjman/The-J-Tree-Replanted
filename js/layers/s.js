addLayer('s', {
    name: "Space", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        unlockOrder: 0,
        resetTime: 0,
        power: E(0),
    }},
    resetDescription: "Break the Space Continuum for ",
    color: "#bcb",
    requires() {return rowAllUnlocked(2)?E(40):E(40).add(Decimal.mul(player.t.unlockOrder, 8))}, // Can be a function that takes requirement increases into account
    resource: "Space", // Name of prestige currency
    baseResource: "Abstract", // Name of resource prestige is based on
    baseAmount() {return player.a.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    base: 1.075,
    row: 2,
    branches: ['a', 'g'],
    increaseUnlockOrder: ['d','t'],
    effectDescription: () => `which translates into ${colored(formatX(tmp.s.effect), tmp.s.color)}, ${colored('+^'+format(tmp.s.effectExp), tmp.s.color)} J-fragments.`,

    effect() {
        let x = player.s.points
        if (inChallenge('l', 21)) return E(1)
        return E(2).pow(x)
    },
    effectExp() {
        let x = player.s.points
        if (inChallenge('l', 21)) return E(0)
        return x.min(10).div(80).pow(1.1)
    },

    getSpaceVolume() {
        let [x, y, z] = get3DPlane()

        return Decimal.mul(x, y).mul(z)
    },
    getTotalSP() {
        let x = buyableEffect('s', 11)
        let y = buyableEffect('s', 12)
        return Decimal.add(x, y)
    },

    volumeEffect1() {
        let x = this.getSpaceVolume()
        return (x.div(10).pow(0.9)).add(1)
    },
    volumeEffect2() {
        let x = this.getSpaceVolume()
        return E(1.9).pow(x.div(8).pow(0.7))
    },
    volumeEffect3() {
        let x = this.getSpaceVolume()
        return (hasMilestone('s', 2)?x.pow(0.005):E(1))
    },

    gainMult() {
        let mul = E(1)

        if (hasUpgrade('j', 41)) mul = mul.div(1.1)

        return mul
    },

    layerShown() {return hasUpgrade('g', 35) || player.s.unlocked || player.d.unlocked},
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button",
                "resource-display",
                ['display-text', () => `${colored("ACTIVE LAYER", tmp.s.color)}`],
                ['microtabs', 'main']
            ],
        },
        "Space": {
            content: [
                'main-display',
                'prestige-button',
                'resource-display',
                ['microtabs', 'space']
            ],
            unlocked() {return player.s.unlocked}
        }
    },
    microtabs: {
        main: {
            Milestones: {
                content: [
                    'milestones',
                ],
            },
        },
        space: {
            Space: {
                content: [
                    'h-line',
                    'blank',
                    ['display-box', 1],
                    'blank',
                    ['row', [showBuyableInTF(11), showBuyableInTF(12)]],
                    'blank',
                    'h-line',
                    'blank',
                    ['display-box', 2],
                    'blank',
                    'respec-button',
                    'blank',
                    ['row', [showBuyableInTF(21), showBuyableInTF(22), showBuyableInTF(23)]],
                    'blank',
                ],
            },
            Effects: {
                content: [
                    'h-line',
                    ['display-box', 3],
                    ['display-box', 4],
                ],
            },
        }
    },
    displayBoxes: {
        1: {
            title: () => colored("Space", "#585"),
            description: () => {
                return `
                    You currently have ${colored(format(player.s.power), "#474")} / ${colored(format(tmp.s.getTotalSP), "#474")} Space Power, which is for purchasing the 3 axes (X, Y, Z).
                `
            },
            color: () => tmp.s.color,
        },
        2: {
            title: () => colored("3D Plane", "#585"),
            description: () => {
                let [x, y, z] = get3DPlane()
                return `
                    You are in a 3D Plane, which its size is ${colored(format(x)+" x "+format(y)+" x "+format(z), "#549153")}.<br> This means the volume inside the 3D plane is ${colored(format(tmp.s.getSpaceVolume), "#549153")} unit${superscript('3')}.<br>
                    ${color("Respecing does not reset anything.", 'rgba(0,0,0,0.3)', 'h5')}
                `
            },
            color: () => tmp.s.color,
        },
        3: {
            title: () => colored("Effects", "#585"),
            description: () => {
                return `
                    The volume inside the 3D plane is ${colored(format(tmp.s.getSpaceVolume), "#549153")} unit${superscript('3')}, which translates into:<br>
                    ${colored(formatX(tmp.s.volumeEffect1), "#549153")} to Abstract Power ${shiftDown?"[(x / 10)"+superscript(0.9)+" + 1]":""}<br>
                    ${colored(formatX(tmp.s.volumeEffect2), "#549153")} to Growth ${shiftDown?"[1.9"+superscript(writeExp(0.7, "x / 8", null, true))+"]":""}<br>
                    ${hasMilestone('s', 2)?colored(formatX(tmp.s.volumeEffect3), "#549153")+" to "+colored("Classical Tree Game", "#000")+"'s base":""} ${shiftDown&&hasMilestone('s', 2)?"["+writeExp(0.005, 'x')+"]":""}<br>
                    ${shiftDown?"":"(Hold shift for formula)"}
                `
            },
            color: () => tmp.s.color,
        },
        4: {
            title: () => colored("Axis Boosting", "#585"),
            description: () => {
                return `
                    Each Axis bought gives a boost to something.<br>
                    X: ${colored(formatX(getAxisBoosts('x')), '#585')} to all Plants. ${shiftDown?"["+writeExp(0.7, "x")+"]":""}<br>
                    Y: ${colored(formatX(getAxisBoosts('y')), '#585')} to J-points. ${shiftDown?"[1 + (y / 2)]":""}<br>
                    Z: ${colored(formatDiv(getAxisBoosts('z')), '#585')} to Abstract requirement. ${shiftDown?"["+writeExp(2, 'z')+"]":""}<br>
                    ${!shiftDown?"(Hold shift for formulas)":""}
                `
            },
            color: () => tmp.s.color,
            unlocked() {return hasMilestone('a', 24)},
        },
    },
    milestones: {
        1: {
            requirementDescription: `1 Space [1]`,
            effectDescription: () => `
                Keep the 1st, 9th, 15th ${colored("Abstract", tmp.a.color)} milestone on row 3 resets, ${colored("Less Scaling", "#000")} does not require ${colored("3 Abstract", tmp.a.color)}.<br>
                ${(!hasMilestone('d', 1))?'<h6 style="color: rgba(0, 0, 0, 0.3)">You will unlock another effect when you have the first milestone from one of the other row 3 layers.</h6>':'Since you have the first milestone from one of the other row 3 layers, divide '+colored("Abstract", tmp.a.color)+" based on the volume of Space / 3D Plane."}<br>
                Currently: ${rowMultipleUnlocked(2)?formatDiv(milestoneEffect('s', 1)):"[LOCKED]"}<br>
                If you have all 3 layers on this row unlocked, remove the scaling of all row 3 layers.
            `,
            effect() {
                let x = tmp.s.getSpaceVolume
                return rowMultipleUnlocked(2)?(x.add(1).log(3).add(1)).pow(1.5):E(1)
            },
            tooltip: () => `
                Effect: ${(writeExp(1.5, writeLog(3, "x + 1")+" + 1", null, true))}
            `,
            done() {return player.s.points.gte(1)},
        },
        2: {
            requirementDescription: `2 Space [2]`,
            effectDescription: () => `
                Unlocks another volume effect.
            `,
            done() {return player.s.points.gte(2)},
        },
        3: {
            requirementDescription: `3 Space [3]`,
            effectDescription: () => `
                Keep all the upgrades and 3 levels of ${colored('Classical Tree Game', '#000')} in ${colored("J", tmp.j.color)} Layer upon doing a ${colored("Space", tmp.s.color)} reset. ${colored("Abstract Milestone", tmp.a.color)} 4, 5, 6 and 7 are kept.
            `,
            done() {return player.s.points.gte(3)},
            unlocked() {return hasMilestone('s', 1)},
        },
        4: {
            requirementDescription: `4 Space [4]`,
            effectDescription: () => `
                Unlocks buy max for both ${colored('Abstract', tmp.a.color)} buyables and they don't cost anything.
            `,
            done() {return player.s.points.gte(4)},
            unlocked() {return hasMilestone('s', 2)},
        },
        5: {
            requirementDescription: `6 Space [5]`,
            effectDescription: () => `
                ${colored("Classical Tree Game", "#000")}'s level exponent is ${formatAdd(0.02)}
            `,
            done() {return player.s.points.gte(6)},
            unlocked() {return hasMilestone('s', 3)},
        },
        6: {
            requirementDescription: `7 Space`,
            effectDescription: () => `
                Abstract resets nothing.
            `,
            done() {return player.s.points.gte(7)},
            unlocked() {return hasMilestone('s', 4)},
        },
    },
    buyables: {
        respec() {
            setBuyableAmount(this.layer, 21, Decimal.dZero)
            setBuyableAmount(this.layer, 22, Decimal.dZero)
            setBuyableAmount(this.layer, 23, Decimal.dZero)
            player.s.power = tmp.s.getTotalSP
        },
        respecText: "Respec all purchased Axes",
        respecMessage: "Respec the buyables will not reset anything dw about it.",
        11: {
            title: () => `Space Power I`,
            display() {return `Buy a Space Power for ${format(this.cost())} J-fragments.
                Purchased: ${format(getBuyableAmount(this.layer, this.id))}
            `},
            cost(x) {return E("1e30").pow(x.add(1))},
            canAfford() {return player.points.gte(this.cost())},
            buy() {
                player.points = player.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                player.s.power = player.s.power.add(1)
            },
            effect(x) {return x},
            unlocked() {return player.s.unlocked},
            style: {
                "height": "6rem",
                "margin-right": "1rem",
                "margin-left": "1rem",
            },
        },
        12: {
            title: () => `Space Power II`,
            display() {return `Buy a Space Power for ${format(this.cost())} Growth.
                Purchased: ${format(getBuyableAmount(this.layer, this.id))}
            `},
            cost(x) {return E("1e10").pow(x.add(1))},
            canAfford() {return player.g.points.gte(this.cost())},
            buy() {
                player.g.points = player.g.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                player.s.power = player.s.power.add(1)
            },
            effect(x) {return x},
            unlocked() {return player.s.unlocked},
            style: {
                "height": "6rem",
                "margin-right": "1rem",
                "margin-left": "1rem",
            },
        },
        21: {
            title: () => `X Axis`,
            display() {return `Spend a Space Power for the X axis.
                Bought: ${format(getBuyableAmount(this.layer, this.id))}
                Effect: ${formatX(buyableEffect(this.layer, this.id))}
            `},
            cost(x) {return E(1)},
            canAfford() {return player.s.power.gte(this.cost())},
            buy() {
                player.s.power = player.s.power.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {return x.add(1)},
            unlocked() {return player.s.unlocked},
            style: {
                "height": "6rem",
                "margin-right": "1rem",
                "margin-left": "1rem",
            },
        },
        22: {
            title: () => `Y Axis`,
            display() {return `Spend a Space Power for the Y axis.
                Bought: ${format(getBuyableAmount(this.layer, this.id))}
                Effect: ${formatX(buyableEffect(this.layer, this.id))}
            `},
            cost(x) {return E(1)},
            canAfford() {return player.s.power.gte(this.cost())},
            buy() {
                player.s.power = player.s.power.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {return x.add(1)},
            unlocked() {return player.s.unlocked},
            style: {
                "height": "6rem",
                "margin-right": "1rem",
                "margin-left": "1rem",
            },
        },
        23: {
            title: () => `Z Axis`,
            display() {return `Spend a Space Power for the Z axis.
                Bought: ${format(getBuyableAmount(this.layer, this.id))}
                Effect: ${formatX(buyableEffect(this.layer, this.id))}
            `},
            cost(x) {return E(1)},
            canAfford() {return player.s.power.gte(this.cost())},
            buy() {
                player.s.power = player.s.power.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {return x.add(1)},
            unlocked() {return player.s.unlocked},
            style: {
                "height": "6rem",
                "margin-right": "1rem",
                "margin-left": "1rem",
            },
        },
    },

    update(diff) {
        let totalSP = tmp.s.getTotalSP
        player.s.power = player.s.power.clampMax(totalSP)
    },

    doReset(resettingLayer) {
        if (layers[resettingLayer].row <= this.row) {
            return;
        };

        let keptMS = []

        if (layers[resettingLayer].row == 3) {
            if (hasMilestone("l", 1)) keptMS.push(1, 3)
            if (hasMilestone("l", 2)) keptMS.push(6)
            if (hasChallenge("l", 13)) keptMS.push(4)
        }

        let keep = [keptMS]

        layerDataReset(this.layer, keep)

        player[this.layer].milestones.push(...keptMS)
    },

    canBuyMax() {return hasMilestone('l', 3)},

    hotkeys: [
        {key: "s", description: "S: Reset to break the Space Continuum", onPress(){if (canReset(this.layer)) doReset(this.layer)}, unlocked() {return player[this.layer].unlocked}},
    ],

    deactivated() {return inChallenge("l", 21)},
})

function get3DPlane() {
    let x = buyableEffect('s', 21)
    let y = buyableEffect('s', 22)
    let z = buyableEffect('s', 23)

    return [x, y, z]
}

function getAxisBoosts(axis) {
    let [x, y, z] = get3DPlane()

    if (!(['x', 'y', 'z'].includes(axis) && hasMilestone('a', 24)) || inChallenge("l", 21)) return E(1);

    if (axis == 'x') return x.pow(0.7) // plants
    if (axis == 'y') return y.mul(0.5).add(1) // j-points
    if (axis == 'z') return z.pow(2) // abstract req
}