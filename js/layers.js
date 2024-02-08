addLayer("j", {
    name: "formingJ", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "J", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    resetDescription: "Form all your fragments into ",
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
        if (hasUpgrade(this.layer, 24)) mult = mult.times(2)
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
                if (hasUpgrade(this.layer, 32)) return (player[this.layer].points.add(1).pow(0.2)).times(upgradeEffect(this.layer, 32))
                else return player[this.layer].points.add(1).pow(0.2)
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
            description: "Unlocks a new row and a layer, also doubles your J-point gain.",
            cost: new Decimal(100),
            unlocked() {
                let a = false
                if (hasUpgrade("j", 23)) a = true
                return a
            },
        },
        31: {
            title: "Redirection",
            description: function() {return "Change the formula for " + colored("Inflation?", "#000")},
            cost: new Decimal(2000),
            unlocked() {
                let a = false
                if (hasUpgrade("j", 24) && hasMilestone("g", 3)) a = true
                return a
            },
            tooltip: "log10 => log5"
        },
        32: {
            title: "Do more helping!",
            description: function() {return "Boost "+colored("Helping yourself", "#000")+" based on the amount of your upgrades you have in this layer."},
            cost: new Decimal(20000),
            unlocked() {
                let a = false
                if (hasUpgrade("j", 31)) a = true
                return a
            },
            effect() {
                let x = new Decimal(player[this.layer].upgrades.length)
                return (x.div(10)).add(1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
            tooltip: "Effect: 1 + (Upgrades / 10)",
        },
    },
    doReset(resettingLayer) {
        if (tmp[resettingLayer].row <= tmp[this.layer].row) return; // no reset when same or lower row layer caused a reset
        const keep = [];
        if (hasMilestone("g", 2)) keep.push("upgrades")
        layerDataReset(this.layer, keep);
    }
})

addLayer("g", {
    name: "Growth", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "G", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        seedlings: new Decimal(0),
    }},
    color: "#bba",
    branches: "j",
    requires: new Decimal(100), // Can be a function that takes requirement increases into account
    resource: "Growth", // Name of prestige currency
    baseResource: "J-points", // Name of resource prestige is based on
    baseAmount() {return player.j.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.8, // Prestige currency exponent
    base: function() {
        if (player[this.layer].points.gte(10)) return 10
        else 2
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    seedlingMult() {
        mult = new Decimal(0)
        if (hasUpgrade(this.layer, 11)) mult = new Decimal(1)
        if (hasUpgrade(this.layer, 12)) mult = mult.times(2)
        if (hasUpgrade(this.layer, 13)) mult = mult.times(upgradeEffect(this.layer, 13))
        return mult
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "g", description: "G: Reset to do a Growth reset.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){if (hasUpgrade("j", 24)||player[this.layer].best.gte(1)) return true},
    tabFormat:  {
        "Milestones": {
            content: [
                "main-display",
                "prestige-button",
                ["display-text",
                    function() { return 'You currently have ' + format(player.j.points) + ' J-points.' }],
                ["display-text",
                    function() {
                        if (player[this.layer].points.gte(10)) return 'Since you have 10 growth, your price scaling is currently scaled at the moment. There will be upgrades (currently none) which reduces the scaling.'
                        else return ""
                    }],
                "blank",
                "milestones",
            ],
        },
        "Seedlings": {
            content: [
                "main-display",
                "prestige-button",
                ["display-text",
                    function() { return 'You currently have ' + format(player.j.points) + ' J-points.' }],
                "blank",
                ["display-text",
                    function() { return 'You currently have ' + colored(format(player.g.seedlings), this.layer.color) + ' Seedlings. (' + format(tmp.g.seedlingMult) + '/s)'}],
                "blank",
                "upgrades"
            ],
            unlocked() {
                if (hasMilestone("g", 4)) return true
                else return false
            },
        },
    },
    milestones: {
        0: {
            requirementDescription: "2 Growth",
            effectDescription: function() {return "This milestone boosts your fragments based on your growth. " + "Currently: " + format(new Decimal(1).max((player.g.points.add(1).pow(1.5)))) + "x"},
            done() {return player[this.layer].points.gte(2)},
            tooltip: "Effect: (1 + Growth) ^ 1.5",
            unlocked() {if (player[this.layer].best.gte(1)) return true}
        },
        2: {
            requirementDescription: "5 Growth",
            effectDescription: "Forming J upgrades saves when doing a Growth reset.",
            done() {return player[this.layer].points.gte(5)},
            unlocked() {if (hasMilestone(this.layer, 1)) return true}
        },
        1: {
            requirementDescription: "4 Growth",
            effectDescription: function() {return "This milestone boosts your J-points based on your growth starting from 4 Growth. " + "Currently: " + format(new Decimal(1).max((player.g.points.add(-2)))) + "x"},
            done() {return player[this.layer].points.gte(4)},
            tooltip: "Effect: max(1, (1 + Growth - 2))",
            unlocked() {if (hasMilestone(this.layer, 0)) return true}
        },
        3: {
            requirementDescription: "7 Growth",
            effectDescription: "Unlocks new upgrade for Forming J",
            done() {return player[this.layer].points.gte(7)},
            unlocked() {if (hasMilestone(this.layer, 2)) return true}
        },
        4: {
            requirementDescription: "10 Growth",
            effectDescription: "Unlocks the Seedlings tab.",
            done() {return player[this.layer].points.gte(10)},
            unlocked() {if (hasMilestone(this.layer, 3)) return true}
        },
        5: {
            requirementDescription: "100 Seedlings",
            effectDescription: function() {return "J-fragments gain is based on seedlings. "+"Currently: "+format(new Decimal(1).max(player.g.seedlings.log(3)))+"x"},
            tooltip: "Effect: 1 + log3(Seedlings)",
            done() {return player[this.layer].seedlings.gte(100)},
            unlocked() {if (hasUpgrade(this.layer, 12)) return true}
        },
    },
    upgrades: {
        11: {
            title: "Dig Up the Soil",
            fullDisplay() {
                return colored(this.title, "#660")+"<br>Start generating "+colored("Seedlings","#000")+".<br><br>Cost: 200,000 J-points"
            },
            unlocked() {
                let a = false
                if (hasMilestone("g", 4)) a = true
                return a
            },
            canAfford() {
                a = false
                if (player.j.points.gte(200000)) a = true
                return a
            },
            pay() {
                player.j.points = (player.j.points).sub(new Decimal(200000))
            },
        },
        12: {
            title: "Put the Seed In",
            fullDisplay() {
                return colored(this.title, "#556633")+"<br>Double Seedling gain"+".<br><br>Cost: 10 Seedlings"
            },
            unlocked() {
                let a = false
                if (hasUpgrade("g", 11)) a = true
                return a
            },
            canAfford() {
                a = false
                if (player[this.layer].seedlings.gte(10)) a = true
                return a
            },
            pay() {
                player.g.seedlings = (player.g.seedlings).sub(new Decimal(10))
            },
        },
        13: {
            title: "Mutation",
            fullDisplay() {
                return colored(this.title, "#005500")+"<br>Seedling is being boosted by J-fragments"+".<br>Currently: "+format(upgradeEffect(this.layer, 13))+"x<br><br>Cost: 200 Seedlings"
            },
            unlocked() {
                let a = false
                if (hasUpgrade("g", 12)) a = true
                return a
            },
            canAfford() {
                a = false
                if (player[this.layer].seedlings.gte(200)) a = true
                return a
            },
            pay() {
                player.g.seedlings = (player.g.seedlings).sub(new Decimal(200))
            },
            effect() {
                return ((player.points.pow(0.1)).div(2)).add(1)
            },
            tooltip: "1 + ((Fragments ^ 0.1) / 2)",
        },
    },
    update(diff) {
        let x = tmp.g.seedlingMult
        player[this.layer].seedlings = player[this.layer].seedlings.add(x.mul(diff))
    },
})