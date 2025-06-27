addLayer("j", {
    name: "formingJ", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "J", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        autoBuyable: false,

        resetTime: 0,
    }},
    resetDescription: "Form all your fragments into ",
    color: "#aba",
    requires: new Decimal(1), // Can be a function that takes requirement increases into account
    resource: "J-points", // Name of prestige currency
    baseResource: "J-fragments", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.4, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade(this.layer, 13)) mult = mult.mul(upgradeEffect(this.layer, 13))
        if (hasUpgrade(this.layer, 15)) mult = mult.mul(2)
        if (hasUpgrade(this.layer, 23)) mult = mult.mul(upgradeEffect(this.layer, 23))
        if (hasMilestone('a', 1)) mult = mult.mul(milestoneEffect('a', 1))
        if (hasMilestone('d', 2)) mult = mult.mul(milestoneEffect('d', 2))

        if (hasMilestone('a', 25)) mult = mult.mul(getAxisBoosts('y'))

        mult = mult.mul(tmp.a.APEffect4)
        mult = mult.mul(tmp.g.plantEffect2)

        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = E(1)
        if (hasMilestone('a', 20)) exp = exp.add(0.01)
        return exp
    },
    passive() {
        let gen = E(0)
        if (hasMilestone('a', 4)) gen = gen.add(0.1)
        if (hasMilestone('a', 5)) gen = gen.mul(10)
        return gen
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "j", description: "J: Reset to form J-points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    upgrades: {
        11: {
            title: "One More Time",
            description: function() {return `Start generating ${hasUpgrade(this.layer, this.id)?format(getPointGen()):format(getBasePointGen())} J-fragments per second.`},
            cost: new Decimal(1),
            tooltip: function() {return `Base: ${format(getBasePointGen(), 2)}/s`},
        },
        12: {
            title: "Familiar Multiplier",
            description: function() {return `Boost your J-fragments based on your unspent J-points.`},
            cost: new Decimal(3),
            effect() {
                x = player[this.layer].points
                form = new Decimal(5)
                if (hasMilestone("a", 7)) form = form.sub(1)
                return Decimal.pow(1.5, Decimal.log(x.add(1), form))
            },
            effectDisplay() {return `${formatX(upgradeEffect(this.layer, this.id))}`},
            tooltip: () => `Effect: 1.5${superscript("log"+subscript(writeStringCondition("4", "5", hasMilestone("a", 7)), "#fff")+"(J-points + 1)","#fff")}`,
            unlocked() {return hasUpgrade(this.layer, 11)},
        },
        13: {
            title: "Just Another Synergy",
            description: function() {return `Boost your J-points based on your unspent J-points.`},
            cost: new Decimal(10),
            effect() {
                x = player[this.layer].points
                if (!hasMilestone("a", 8)) eff = Decimal.log(x.pow(0.3).add(1), 4).add(1)
                else eff = Decimal.log(x.pow(0.75).add(1), 3).add(1)
                if (hasUpgrade(this.layer, 31)) eff = eff.mul(upgradeEffect(this.layer, 31))
                return eff
            },
            effectDisplay() {return `${formatX(upgradeEffect(this.layer, this.id))}`},
            tooltip: () => hasMilestone("a", 8) ? `log${subscript("3", "#fff")}(J-points${superscript("0.75", "#fff")} + 1) + 1` : `Effect: log${subscript("4", "#fff")}(J-points${superscript("0.3", "#fff")} + 1) + 1`,
            unlocked() {return hasUpgrade(this.layer, 12)},
        },
        14: {
            title: "Something New",
            description: function() {return `Unlock a buyable in a new tab.`},
            cost: new Decimal(20),
            unlocked() {return hasUpgrade(this.layer, 13)},
        },
        15: {
            title: "Static",
            description: function() {return `Doubles both J-fragments and J-points gain.`},
            cost: new Decimal(40),
            unlocked() {return hasUpgrade(this.layer, 14)},
        },
        21: {
            title: "Based On Things",
            description: function() {return `Your base J-fragments gain is added based on your J-points.`},
            cost: new Decimal(200),
            effect() {
                x = player[this.layer].points
                return Decimal.log((x.pow(0.2)).div(10).add(1), 15)
            },
            effectDisplay() {return `${formatAdd(upgradeEffect(this.layer, this.id))}`},
            tooltip: () => `Effect: log${subscript("15", "#fff")}((J-points${superscript("0.2", "#fff")}/ 10) + 1)`,
            unlocked() {return getBuyableAmount(this.layer, 11).gte(3)},
        },
        22: {
            title: "Minorflation",
            description: function() {return `Add 0.01 to the level buyable exponent.`},
            cost: new Decimal(600),
            unlocked() {return hasUpgrade(this.layer, 21)},
        },
        23: {
            title: "I Buy J's",
            description: function() {return `${colored("Classical Tree Game", "#000")} boosts your J-point at a reduced rate.`},
            cost: new Decimal(1250),
            effect() {
                x = getBuyableAmount(this.layer, 11)
                return Decimal.pow(Decimal.log(x.add(2), 2), 0.5)
            },
            effectDisplay() {return `${formatX(upgradeEffect(this.layer, this.id))}`},
            tooltip: () => `Effect: log${subscript("2")}(x + 2)${superscript("0.5")}`,
            unlocked() {return hasUpgrade(this.layer, 22)},
        },
        24: {
            title: "You're so Based",
            description: function() {return `Add 0.05 to base J-fragment gain.`},
            cost: new Decimal(3000),
            unlocked() {return hasUpgrade(this.layer, 23)},
        },
        25: {
            title: "New Stuff",
            description: function() {return `Unlocks a new layer. (This upgrade will be kept between reset layers.)`},
            cost: new Decimal(6000),
            unlocked() {return hasUpgrade(this.layer, 24)},
        },
        31: {
            title: "Yet Another Multiplier",
            description: function() {return `${colored("Just Another Synergy", "#000")} is boosted based on the amount of upgrades in this layer.`},
            cost: new Decimal(10_000),
            effect() {
                x = new Decimal(player[this.layer].upgrades.length)
                return (x.div(15)).add(1)
            },
            effectDisplay() {return `${formatX(upgradeEffect(this.layer, this.id))}`},
            tooltip: () => `Effect: (Upgrades/15) + 1`,
            unlocked() {return hasUpgrade(this.layer, 24) && hasMilestone('a', 0)},
        },
        32: {
            title: "Risky Exponent",
            description: function() {return `Add 0.01 to J-fragment gain exponent.`},
            cost: new Decimal(70_000),
            unlocked() {return hasUpgrade(this.layer, 31)},
        },
        33: {
            title: "Fragments Synergy Finally",
            description: function() {return `J-fragments boosts itself.`},
            cost: new Decimal(150_000),
            effect() {
                x = player.points
                return Decimal.log(x.add(1), 10).div(5).add(1)
            },
            effectDisplay() {return `${formatX(upgradeEffect(this.layer, this.id))}`},
            tooltip: () => `Effect: 1 + log${subscript("10")}(J-fragments + 1) / 5`,
            unlocked() {return hasUpgrade(this.layer, 32)},
        },
        34: {
            title: "Less Scaling",
            description: function() {return `
                ${color("Requirement: 3 Abstracts", "#000")}<br>
                ${colored("Classical Tree Game", "#000")} scaling scales 5 upgrades later.
            `},
            cost: new Decimal(250_000),
            canAfford() {
                return ((player.a.points.gte(3)) && player[this.layer].points.gte(this.cost)) || (hasMilestone('t', 1) || hasMilestone('d', 1) || hasMilestone('s', 1))
            },
            unlocked() {return hasUpgrade(this.layer, 33)},
        },
        35: {
            title: "Empowered",
            description: function() {return `Unlock a feature in ${color("Abstract", "#484")}, this upgrade will also unlock 2 milestones. (You will keep this upgrade on Abstract)`},
            cost: new Decimal(1_000_000),
            unlocked() {return hasUpgrade(this.layer, 34)},
        },
    },
    buyables: {
        11: {
            title: () => `Classical Tree Game`,
            effectExp() {
                let exp = new Decimal(1)
                if (hasUpgrade(this.layer, 22)) exp = exp.add(0.01)
                if (hasMilestone('a', 11)) exp = exp.add(0.01)
                return exp
            },
            effectBase() {
                let x = E(2)
                if (hasMilestone('a', 18)) x = x.add(0.1)
                if (hasMilestone('s', 2)) x = x.mul(tmp.s.volumeEffect3)
                return x
            },
            display() {
                return `Doubles J-fragment gain per buyable amount${superscript(format(this.effectExp()), "#000")}.
                ${hasMilestone('a', 5)?"Requirement":"Cost"}: ${format(this.cost())} J-points ${writeScaled(getBuyableAmount(this.layer, this.id), this.scalingStart())}
                Amount: ${format(getBuyableAmount(this.layer, this.id), 0)}
                Currently: ${formatX(buyableEffect(this.layer, this.id))} ${writeSC(buyableEffect(this.layer, this.id),"1e100")}
                ${!hasUpgrade('j', 21) && getBuyableAmount(this.layer, this.id).gte(3)?"An upgrade appeared in the Upgrades tab, you should go check it out.":""}
            `},
            cost(x) {return simpleCost(x.scale(this.scalingStart(), this.scalingPower(), "L"), "EA", 10, 2, 1.5)},
            canAfford() {return player[this.layer].points.gte(this.cost())},
            buy() {
                if (!hasMilestone('a', 5)) {
                    player[this.layer].points = player[this.layer].points.sub(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                }
                else this.buyMax()
            },
            buyMax() {
                x = player[this.layer].points.add(1)
                if (hasMilestone('a', 6)) {
                    if (simpleCost(x, "EAI", 10, 2, 1.5).floor().gt(this.scalingStart())) {final = simpleCost(x, "EAI", 10, 2, 1.5).scale(this.scalingStart(), this.scalingPower(), "L", true).floor().add(1)}
                    else {final = simpleCost(x, "EAI", 10, 2, 1.5).floor().add(1)}
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(final))
                }
            },
            effect(x) {
                return Decimal.pow(this.effectBase(), x.pow(this.effectExp())).softcap(this.scStart(), this.scPower(), 2)
            },
            scalingStart() {
                let scaling = E(10)
                if (hasUpgrade(this.layer, 34)) scaling = scaling.add(5)
                scaling = scaling.add(tmp.g.seedEffect)
                return scaling
            },
            scalingPower() {
                let power = E(2)
                return power
            },
            scStart() {
                let start = E(1e100)
                return start
            },
            scPower() {
                let power = E(0.8)
                return power
            },
            tooltip: function() {return `
                Cost: 10 * (1 + 2 * x) * 1.5${superscript("x")}<br>
                ${writeScale(getBuyableAmount(this.layer, this.id), this.scalingStart(), this.scalingPower(), "L")}
                Effect: ${format(this.effectBase())}${superscript("x")}<br>
                ${writeSCForm(buyableEffect(this.layer, this.id), this.scStart(), this.scPower(), 2)}
            `},
            unlocked() {return hasUpgrade("j", 14)}
        },
    },
    tabFormat: [
            "main-display",
            "prestige-button",
            "resource-display",
            ["microtabs", "main", {"padding":"3px"}],
    ],
    microtabs: {
        main: {
            Upgrades: {
                content: [
                    "upgrades",
                ],
            },
            Buyables: {
                content: [
                    "buyables",
                ],
                unlocked() {return (hasUpgrade("j", 14))}
            },
        }
    },
    layerShown(){return true},
    doReset(resettingLayer) {
        if (layers[resettingLayer].row <= layers[this.layer].row) return;

        let keptUpg = []
        let keepAB = false

        if (layers[resettingLayer].row >= 1 && hasUpgrade("j", 25)) keptUpg.push(25)
        if (layers[resettingLayer].layer == "a" && hasUpgrade('j', 35)) keptUpg.push(35)

        if (layers[resettingLayer].layer == "a" && hasMilestone('a', 3)) keptUpg.push(11, 12, 13, 14, 15)
        if (layers[resettingLayer].layer == "a" && hasMilestone('a', 4)) keptUpg.push(21, 22, 23, 24)
        if (layers[resettingLayer].layer == "a" && hasMilestone('a', 6)) keptUpg.push(31, 32, 33, 34)

        if (layers[resettingLayer].layer == "g" && hasUpgrade('g', 12)) keptUpg.push(11, 12, 13, 14, 15, 21, 22, 23, 24)
        if (layers[resettingLayer].layer == "g" && hasUpgrade('g', 13)) keptUpg.push(31, 32, 33, 34, 35)

        if (layers[resettingLayer].row == 2) {
            if (hasMilestone(resettingLayer, 3)) keptUpg = player[this.layer].upgrades
        }

        if (layers[resettingLayer].row >= 1 && hasMilestone('a', 6) && player[this.layer].autoBuyable) keepAB = true

        let keep = [keptUpg, keepAB]

        layerDataReset(this.layer, keep)

        player[this.layer].upgrades.push(...keptUpg)
        player[this.layer].autoBuyable = keep[1]
        if ((layers[resettingLayer].layer == "a" && hasMilestone('a', 4))||(layers[resettingLayer].layer >= 2 && (hasMilestone('d', 3)||hasMilestone('t', 3)||hasMilestone('s', 3)))) setBuyableAmount(this.layer, 11, getBuyableAmount(this.layer, 11).add(3))
        
    },
    passiveGeneration() {
        x = tmp[this.layer].passive
        if (!x.gt(0)) return false
        return x
    },
    automate() {
        if (hasMilestone('a', 6) && player[this.layer].autoBuyable) {buyMaxBuyable(this.layer, 11)}
    }
})