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
    requires() {return E(40).add(Decimal.mul(player.s.unlockOrder, 8))}, // Can be a function that takes requirement increases into account
    resource: "Space", // Name of prestige currency
    baseResource: "Abstract", // Name of resource prestige is based on
    baseAmount() {return player.a.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    base: 1.075,
    row: 2,
    branches: ['a', 'g'],
    increaseUnlockOrder: ['d','t'],

    get3DPlane() {
        let x = buyableEffect('s', 21)
        let y = buyableEffect('s', 22)
        let z = buyableEffect('s', 23)

        return [x, y, z]
    },
    getSpaceVolume() {
        let [x, y, z] = tmp.s.get3DPlane

        return Decimal.mul(x, y).mul(z)
    },
    getTotalSP() {
        let x = buyableEffect('s', 11)
        let y = buyableEffect('s', 12)
        return Decimal.add(x, y)
    },

    volumeEffect1() {
        let x = this.getSpaceVolume()
        return (x.div(150)).pow(0.75).add(1)
    },
    volumeEffect2() {
        let x = this.getSpaceVolume()
        return E(2).pow(x.div(8).log(20))
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
                    'blank',
                    ['display-box', 3],
                ],
            }
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
                let [x, y, z] = tmp.s.get3DPlane
                return `
                    You are in a 3D Plane, which its size is ${colored(format(x)+" x "+format(y)+" x "+format(z), "#549153")}.<br> This means the volume inside the 3D plane is ${colored(format(tmp.s.getSpaceVolume), "#549153")} unit${superscript('3')}.
                `
            },
            color: () => tmp.s.color,
        },
        3: {
            title: () => colored("Effects", "#585"),
            description: () => {
                return `
                    The volume inside the 3D plane is ${colored(format(tmp.s.getSpaceVolume), "#549153")} unit${superscript('3')}, which translates into:<br>
                    ${colored(formatX(tmp.s.volumeEffect1), "#549153")} to Abstract Power<br>
                    ${colored(formatX(tmp.s.volumeEffect2), "#549153")} to Growth<br>
                `
            },
            color: () => tmp.s.color,
        },
    },
    milestones: {
        1: {
            requirementDescription: `1 Space [1]`,
            effectDescription: () => `
                Keep the 1st, 9th, 15th ${colored("Abstract", tmp.a.color)} milestone on row 3 resets, ${colored("Less Scaling", "#000")} does not require ${colored("3 Abstract", tmp.a.color)}.<br>
                ${(!hasMilestone('d', 1))?'<h6 style="color: rgba(0, 0, 0, 0.3)">You will unlock another effect when you have the first milestone from one of the other row 3 layers.</h6>':'Since you have the first milestone from one of the other row 3 layers, divide '+colored("Abstract", tmp.a.color)+" based on the volume of Space / 3D Plane."}
            `,
            done() {return player.s.points.gte(1)},
        }
    },
    buyables: {
        respec() {
            setBuyableAmount(this.layer, 21, 0)
            setBuyableAmount(this.layer, 22, 0)
            setBuyableAmount(this.layer, 23, 0)
            player.s.power = tmp.s.getTotalSP
        },
        respecText: "Respec all purchased Axes",
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
})