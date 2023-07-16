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
        if (hasMilestone("g", 1)) mult = mult.times((player.g.points.add(-2)))
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
            tooltip: function() {
                return "Base: " + getBasePointGen() + "/s"
            }
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
            description: function() {
                let a = colored("Twice as Much", "#000")
                return "Square the effect of " + a},
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
                if (hasUpgrade("j", 31)) return player.points.add(5).log(5)
                return player.points.add(10).log10()
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
            tooltip: function() {
                if (hasUpgrade("j", 31)) return "Effect: 1 + (log5(Fragments))"
                return "Effect: 1 + (log10(Fragments))"
            }
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
        24: {
            title: "A Sign of New Life",
            description: "Unlocks a new row and a layer.",
            cost: new Decimal(100),
            unlocked() {
                let a = false
                if (hasUpgrade("j", 23)) a = true
                return a
            },
        },
        31: {
            title: "Redirection",
            description: function() {return "Change the formula for " + colored("Helping Yourself", "#000")},
            cost: new Decimal(2000),
            unlocked() {
                let a = false
                if (hasUpgrade("j", 24) && hasMilestone("g", 2)) a = true
                return a
            },
            tooltip: "log10 => log5"
        },
        32: {
            title: "Current Endgame?",
            description: "Possibly",
            cost: new Decimal(200000),
            unlocked() {
                let a = false
                if (hasUpgrade("j", 24)) a = true
                return a
            },
        }
    },
})

addLayer("g", {
    name: "Growth", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "G", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#bba",
    branches: "j",
    requires: new Decimal(100), // Can be a function that takes requirement increases into account
    resource: "Growth", // Name of prestige currency
    baseResource: "J-points", // Name of resource prestige is based on
    baseAmount() {return player.j.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.8, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "j", description: "J: Reset to form J-points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){if (hasUpgrade("j", 24)||player[this.layer].best.gte(1)) return true},
    milestones: {
        0: {
            requirementDescription: "2 Growth",
            effectDescription: function() {return "This milestone boosts your fragments based on your growth. " + "Currently: " + format(new Decimal(1).max((player.g.points.add(1).pow(1.5)))) + "x"},
            done() {return player[this.layer].points.gte(2)},
            tooltip: "Effect: (1 + Growth) ^ 1.5",
            unlocked() {if (player[this.layer].best.gte(1)) return true}
        },
        1: {
            requirementDescription: "4 Growth",
            effectDescription: function() {return "This milestone boosts your J-points based on your growth starting from 4 Growth. " + "Currently: " + format(new Decimal(1).max((player.g.points.add(-2)))) + "x"},
            done() {return player[this.layer].points.gte(4)},
            tooltip: "Effect: (1 + Growth)",
            unlocked() {if (hasMilestone(this.layer, 0)) return true}
        },
        2: {
            requirementDescription: "7 Growth",
            effectDescription: "Unlocks new upgrade for Forming J",
            done() {return player[this.layer].points.gte(7)},
            unlocked() {if (hasMilestone(this.layer, 1)) return true}
        }
    },
    upgrades: {

    },
})