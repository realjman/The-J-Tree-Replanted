addLayer("j", {
    name: "formingJ", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "J", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#aba",
    requires: new Decimal(1), // Can be a function that takes requirement increases into account
    resource: "J-points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.4, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade("j", 21)) mult = mult.times(upgradeEffect("j", 21))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "j", description: "J: Reset to form J-points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades: {
        11: {
            title: "Beginning of an Era",
            description: "Start generating J-fragments.",
            cost: new Decimal(1),
            tooltip: "Base: 0.1/s"
        },
        12: {
            title: "Twice as Much",
            description: "Doubles your J-fragment production.",
            cost: new Decimal(2),
            unlocked() {
                let a = false
                if (hasUpgrade("j", 11)) a = true
                return a
            }
        },
        13: {
            title: "Synergism",
            description: "Your current fragment gain is boosted by your J-points.",
            cost: new Decimal(5),
            unlocked() {
                let a = false
                if (hasUpgrade("j", 12)) a = true
                return a
            },
            effect() {
                return player[this.layer].points.add(1).pow(0.3)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
            tooltip: "Effect: 1 + (J-points ^ 0.3)"
        },
        14: {
            title: "Times Square",
            description: "Square the effect of 'Twice as Much'",
            cost: new Decimal(12),
            unlocked() {
                let a = false
                if (hasUpgrade("j", 13)) a = true
                return a
            },
        },
        21: {
            title: "Helping Yourself",
            description: "Your current J-point gain is boosted by your J-points.",
            cost: new Decimal(20),
            unlocked() {
                let a = false
                if (hasUpgrade("j", 14)) a = true
                return a
            },
            effect() {
                return player[this.layer].points.add(1).pow(0.2)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
            tooltip: "Effect: 1 + (J-points ^ 0.2)"
        },
        22: {
            title: "Inflation?",
            description: "Your fragment gain is boosted by your fragments.",
            cost: new Decimal(50),
            unlocked() {
                let a = false
                if (hasUpgrade("j", 21)) a = true
                return a
            },
            effect() {
                return player.points.add(10).log10()
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
            tooltip: "Effect: 1 + (log10(Fragments))"
        },
        23: {
            title: "Base Two",
            description: "Your base fragment gain is now 0.2/s.",
            cost: new Decimal(60),
            unlocked() {
                let a = false
                if (hasUpgrade("j", 22)) a = true
                return a
            },
        },

    },
})
