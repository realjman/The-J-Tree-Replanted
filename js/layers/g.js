addLayer('g', {
  name: "growth",
  symbol: "G",
  position: 1,
  row: 1,
  branches: ['j'],
  startData() {return {
    unlocked: false,
    points: E(0),
    seeds: E(0),
    sprouts: E(0),
    plants: E(0),
    trees: E(0),
  }},
  resetDescription: "Your fragments causes the tree slowly branch out to produce ",
  color: "#618968",
  requires: E("1e16"),
  resource: "Growth",
  baseResource: "J-fragments",
  baseAmount() {return player.points},
  type: "normal",
  exponent: 1/3,
  gainMult() {
    let mult = new Decimal(1)
    if (hasUpgrade(this.layer, 15)) mult = mult.mul(upgradeEffect(this.layer, 15))
    if (hasMilestone('a', 7)) mult = mult.mul(milestoneEffect('a', 7))
    if (hasMilestone('a', 8)) mult = mult.mul(tmp.a.APEffect5)
    return mult
  },
  gainExp() {
    let exp = new Decimal(1)
    return exp
  },
  seedGain() {
    let gain = E(0)
    gain = gain.add(buyableEffect("g", 11))
    
    if (hasUpgrade(this.layer, 22)) gain = gain.mul(upgradeEffect(this.layer, 22))

    if (hasMilestone('a', 10)) gain = gain.mul(milestoneEffect('a', 10))

    gain = gain.mul(tmp.g.plantEffect1)
    gain = gain.mul(tmp.a.APEffect6)

    return gain
  },
  sproutGain() {
    let gain = E(0)
    gain = gain.add(buyableEffect("g", 12))

    if (hasUpgrade(this.layer, 24)) gain = gain.mul(upgradeEffect(this.layer, 24))
    if (hasUpgrade(this.layer, 25)) gain = gain.mul(upgradeEffect(this.layer, 25))

    gain = gain.mul(tmp.g.treeEffect1)

    return gain
  },
  plantGain() {
    let gain = E(0)
    gain = gain.add(buyableEffect("g", 13))

    if (hasUpgrade(this.layer, 31)) gain = gain.mul(upgradeEffect(this.layer, 31))
    if (hasMilestone('a', 15)) gain = gain.mul(milestoneEffect('a', 15))

    return gain
  },
  treeGain() {
    let gain = E(0)
    gain = gain.add(buyableEffect("g", 14))

    if (hasUpgrade(this.layer, 32)) gain = gain.mul(upgradeEffect(this.layer, 32))

    return gain
  },
  seedEffect() {
    x = player.g.seeds
    effect = Decimal.log(x.div(2).add(1), 2).floor()
    return effect
  },
  sproutEffect() {
    x = player.g.sprouts
    effect = Decimal.pow(1.15, (x.add(1)).log(2))
    return effect
  },
  plantEffect1() {
    x = player.g.plants
    effect = Decimal.log(x.add(1), 10).add(1)
    return effect
  },
  plantEffect2() {
    x = player.g.plants
    effect = Decimal.pow(x, 0.5).mul(2).add(1)
    return effect
  },
  treeEffect1() {
    x = player.g.trees
    effect = Decimal.pow(x, 0.2).mul(3).add(1)
    return effect
  },
  treeEffect2() {
    x = player.g.trees
    if (hasMilestone('a', 20)) {
      effect = Decimal.pow(x, 0.8).mul(4).add(1)
    } else {effect = Decimal.pow(x, 0.4).mul(4).add(1)}
    return effect
  },
  passive() {
    let gen = E(0)
    if (hasMilestone('a', 13)) gen = gen.add(0.01)
    if (hasMilestone('a', 17)) gen = gen.mul(10)
    if (hasMilestone('a', 19)) gen = gen.mul(10)
    return gen
  },
  passiveGeneration() {
    x = tmp[this.layer].passive
    if (!x.gt(0)) return false
    return x
  },
  hotkeys: [
    {key: "g", description: "G: Reset to perform a Growth", onPress(){if (canReset(this.layer)) doReset(this.layer)}, unlocked() {return player[this.layer].unlocked}},
  ],
  tabFormat: {
    "Main": {
      content: [
        "main-display",
        "prestige-button",
        "resource-display",
        "blank",
        ["display-text", function() {return `Note: This layer will reset your Abstract Power and your first growth reset unlocks 2 buyables in a new tab in ${colored("Abstract (Main Tab)", tmp.a.color)}.`}],
        ["microtabs", "main"],
      ],
    },
    "Plants": {
      content: [
        "main-display",
        "prestige-button",
        "resource-display",
        "blank",
        ["display-text", function() {return `
          You have ${colored(format(player.g.seeds), tmp.g.color)} seeds, which makes ${colored("Classical Tree Game", tmp.j.color)+"'s scaling starts "+colored(format(tmp.g.seedEffect, 0), tmp.g.color)} ${shiftDown?"(floor(log"+subscript(2)+"(1 + Seeds / 2)))":""} later. (${format(tmp.g.seedGain)}/s)<br>
          You have ${colored(format(player.g.sprouts), tmp.g.color)} sprouts, which translates into ${colored(formatX(tmp.g.sproutEffect), tmp.g.color)} ${shiftDown?"(1.15"+superscript("log"+subscript("2")+"(Sprouts + 1)")+")":""} multiplier to Abstract Power. (${format(tmp.g.sproutGain)}/s)<br>
          You have ${colored(format(player.g.plants), tmp.g.color)} plants, which translates into ${colored(formatX(tmp.g.plantEffect1), tmp.g.color)} ${shiftDown?"("+writeLog("10", "x + 10)"):""} multiplier to Seeds and ${colored(formatX(tmp.g.plantEffect2), tmp.g.color)} ${shiftDown?"(1 + "+writeExp("0.5", "x")+" * 2)":""} to J-points. (${format(tmp.g.plantGain)}/s)<br>
          You have ${colored(format(player.g.trees), tmp.g.color)} trees, which translates into ${colored(formatX(tmp.g.treeEffect1), tmp.g.color)} ${shiftDown?"("+writeExp("0.2", "x")+" * 3 + 1)":""} multiplier to Sprouts and ${colored(formatX(tmp.g.treeEffect2), tmp.g.color)} ${shiftDown?"(1 + "+writeExp(hasMilestone('a', 20)?"0.8":"0.4", "x")+" * 4)":""} to J-fragments. (${format(tmp.g.treeGain)}/s)<br>
          ${shiftDown?"":"(Hold shift to see formula)"}
        `}],
        "blank",
        "buyables",
        "blank",
        ["row", [showUpgInTF(21), showUpgInTF(22), showUpgInTF(23), showUpgInTF(24), showUpgInTF(25)]],
        ["row", [showUpgInTF(31), showUpgInTF(32), showUpgInTF(33), showUpgInTF(34), showUpgInTF(35)]],
      ],
      unlocked() {return hasUpgrade("g", 21)}
    }
  },
  microtabs: {
    main: {
      Upgrades: {
        content: [
          ["display-text", function() {return `${player.g.upgrades.length>4?"":"The cost of the first row of upgrades are increased each first row upgrade is purchased.<br> You will unlock another row of upgrades after all first row of upgrades are fully purchased."}`}],
          "upgrades",
        ],
        unlocked() {return player.g.unlocked}
      },
    },
  },
  layerShown() {return hasMilestone("a", 6) || player[this.layer].unlocked},
  upgrades: {
    11: {
      title: "Effect Keeping",
      description: function() {return `Keep the third Abstract Power effect on row 2 resets.`},
      cost: function() {
        x = E(player.g.upgrades.length)
        return E(3).pow(x.add(1).clamp(1, 5))
      },
    },
    12: {
      title: "2 Rows of Keeping",
      description: function() {return `Keep the first and second row of J upgrades on Growth.`},
      cost: function() {
        x = E(player.g.upgrades.length)
        return E(3).pow(x.add(1).clamp(1, 5))
      },
    },
    13: {
      title: "Keep it for the Third",
      description: function() {return `Keep the third row of J upgrades on Growth.`},
      cost: function() {
        x = E(player.g.upgrades.length)
        return E(3).pow(x.add(1).clamp(1, 5))
      },
    },
    14: {
      title: "Abstractive Growth",
      description: function() {return `Your unspent Growth boosts Abstract Power.`},
      cost: function() {
        x = E(player.g.upgrades.length)
        return E(4).pow(x.add(1).clamp(1, 5))
      },
      effect() {
        x = player[this.layer].points
        return Decimal.log(x.add(1), 8).add(1)
      },
      effectDisplay() {return `${formatX(upgradeEffect(this.layer, this.id))}`},
      tooltip: () => `Effect: log${subscript("8")}(Growth + 1) + 1`,
    },
    15: {
      title: "Probably Worth It",
      description: function() {return `Your unspent J-points boosts Growth.`},
      cost: function() {
        x = E(player.g.upgrades.length)
        return E(5).pow(x.add(1).clamp(1, 5))
      },
      effect() {
        x = player.j.points
        return Decimal.log(x.add(1), 10).div(6).add(1)
      },
      effectDisplay() {return `${formatX(upgradeEffect(this.layer, this.id))}`},
      tooltip: () => `Effect: 1 + log${subscript("10")}(J-points + 1) / 6`,
    },
    21: {
      title: "Growing Trees",
      description: function() {return `Unlocks a feature in this layer.`},
      cost: E(1_000),
      unlocked() {return (player[this.layer].upgrades.length>=5)}
    },
    22: {
      title: "A Seedy Place",
      description: function() {return `Boosts seeds gain based on growth.`},
      effect() {
        x = player.g.points
        return (Decimal.log(x.add(1), 10).div(2)).add(1)
      },
      effectDisplay() {return `${formatX(upgradeEffect(this.layer, this.id))}`},
      cost: E(200),
      currencyDisplayName: "Seeds",
      canAfford() {return player[this.layer].seeds.gte(this.cost)},
      pay() {player[this.layer].seeds = player[this.layer].seeds.sub(this.cost)},
      unlocked() {return hasUpgrade(this.layer, 21)},
      tooltip: () => `Effect: 1 + log${subscript(10)}(x + 1) / 2`,
    },
    23: {
      title: "Abstractive Seeds",
      description: function() {return `Seeds divides Abstracts cost requirement.`},
      effect() {
        x = player.g.sprouts
        return Decimal.pow(x, 0.7).add(1)
      },
      effectDisplay() {return `${formatDiv(upgradeEffect(this.layer, this.id))}`},
      cost: E(300),
      currencyDisplayName: "Sprouts",
      canAfford() {return player[this.layer].sprouts.gte(this.cost)},
      pay() {player[this.layer].sprouts = player[this.layer].sprouts.sub(this.cost)},
      unlocked() {return hasUpgrade(this.layer, 22)},
      tooltip: () => `Effect: 1 + ${writeExp("0.7", "Seeds")}`,
    },
    24: {
      title: "J-Sprout",
      description: function() {return `Your unspent J-points boost sprouts.`},
      effect() {
        x = player.j.points
        return Decimal.log(x.add(1), 10).div(10).add(1)
      },
      effectDisplay() {return `${formatX(upgradeEffect(this.layer, this.id))}`},
      cost: E(3000),
      currencyDisplayName: "Sprouts",
      canAfford() {return player[this.layer].sprouts.gte(this.cost)},
      pay() {player[this.layer].sprouts = player[this.layer].sprouts.sub(this.cost)},
      unlocked() {return hasUpgrade(this.layer, 23)},
      tooltip: () => `Effect: 1 + ${writeLog("10", "J-points + 1")} / 10`,
    },
    25: {
      title: "Floem",
      description: function() {return `Plants gives a boost to sprouts at a reduced rate.`},
      effect() {
        x = player.g.plants
        return Decimal.log(x.add(1), 4).add(1)
      },
      effectDisplay() {return `${formatX(upgradeEffect(this.layer, this.id))}`},
      cost: E(20_000),
      currencyDisplayName: "Sprouts",
      canAfford() {return player[this.layer].sprouts.gte(this.cost)},
      pay() {player[this.layer].sprouts = player[this.layer].sprouts.sub(this.cost)},
      unlocked() {return hasUpgrade(this.layer, 24)},
      tooltip: () => `Effect: 1 + ${writeLog("4", "Plants + 1")}`,
    },
    31: {
      title: "Xilem",
      description: function() {return `Growth gives a boost to plants at reduced rate.`},
      effect() {
        x = player.g.points
        return Decimal.log(x.add(1), 10).div(2).add(1)
      },
      effectDisplay() {return `${formatX(upgradeEffect(this.layer, this.id))}`},
      cost: E(1_000),
      currencyDisplayName: "Trees",
      canAfford() {return player[this.layer].trees.gte(this.cost)},
      pay() {player[this.layer].trees = player[this.layer].trees.sub(this.cost)},
      unlocked() {return hasUpgrade(this.layer, 25)},
      tooltip: () => `Effect: 1 + ${writeLog("10", "Growth + 1")} / 2`,
    },
    32: {
      title: "Tree of Magnitude",
      description: function() {return `Every Order of Magnitude of J-fragments gives a boost to Trees.`},
      effect() {
        x = player.points.log10().add(1).floor()
        return Decimal.pow(1.05, x)
      },
      effectDisplay() {return `${formatX(upgradeEffect(this.layer, this.id))}`},
      cost: E(2_000),
      currencyDisplayName: "Trees",
      canAfford() {return player[this.layer].trees.gte(this.cost)},
      pay() {player[this.layer].trees = player[this.layer].trees.sub(this.cost)},
      unlocked() {return hasUpgrade(this.layer, 31)},
      tooltip: () => `Effect: ${writeExp('floor('+writeLog(10, "Fragments + 1")+")", "1.05")}`,
    },
    33: {
      title: "Resetless Abstract",
      description: function() {return `Abstract Power will not reset on Growth. (honestly why did i put this very late, idk but this is just filler)`},
      cost: E(15_000),
      currencyDisplayName: "Trees",
      canAfford() {return player[this.layer].trees.gte(this.cost)},
      pay() {player[this.layer].trees = player[this.layer].trees.sub(this.cost)},
      unlocked() {return hasUpgrade(this.layer, 32)},
    },
    34: {
      title: "Almost there",
      description: function() {return `The amount of buyable level bought gives a free level to the previous buyable. (Tree > Plants > Sprouts > Seeds)`},
      cost: E(200_000),
      currencyDisplayName: "Trees",
      canAfford() {return player[this.layer].trees.gte(this.cost)},
      pay() {player[this.layer].trees = player[this.layer].trees.sub(this.cost)},
      unlocked() {return hasUpgrade(this.layer, 33)},
    },
    35: {
      title: "The Peak",
      description: function() {return `Unlocks a new layer.`},
      cost: E(1e33),
      unlocked() {return hasUpgrade(this.layer, 34)},
    },
  },
  buyables: {
    11: {
      title: () => `Seed Generation`,
      effectExp() {
        let exp = new Decimal(1)
        return exp
      },
      display() {
        return `Generates seeds (base) based on the amount of buyable amount${superscript(format(this.effectExp()), "#000")}.
        Cost: ${format(this.cost())} Growth ${writeScaled(getBuyableAmount(this.layer, this.id), this.scalingStart())}
        Amount: ${format(getBuyableAmount(this.layer, this.id), 0)} ${this.freeLevels().gt(0)?"+ "+format(this.freeLevels()):""}
        Currently: ${formatAdd(buyableEffect(this.layer, this.id))}/s` 
      },
      cost(x) {return simpleCost(x.scale(this.scalingStart(), this.scalingPower(), "P"), "E", 5_000, 10)},
      canAfford() {return player[this.layer].points.gte(this.cost())},
      buy() {
        player[this.layer].points = player[this.layer].points.sub(this.cost())
        setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
      },
      effect(x) {
        effect = Decimal.pow(2, x.add(this.freeLevels())).sub(1)
        return effect
      },
      tooltip: function() {return `
        Cost: ${format(5_000)} * 10${superscript("x")}<br>
        ${writeScale(getBuyableAmount(this.layer, this.id), this.scalingStart(), this.scalingPower(), "P")}
        Effect: 2${superscript("x")} - 1
      `},
      unlocked() {return hasUpgrade('g', 21)},
      scalingStart() {
        let scaling = E(15)
        if (hasMilestone('a', 16)) scaling = scaling.add(3)
        return scaling
      },
      scalingPower() {
        let power = E(2)
        return power
      },
      freeLevels() {
        let x = E(0)
        if (hasUpgrade(this.layer, 34)) x = x.add(getBuyableAmount(this.layer, 12))
        return x
      },
    },
    12: {
      title: () => `Sprout Generation`,
      effectExp() {
        let exp = new Decimal(1)
        return exp
      },
      display() {
        return `Generates sprouts (base) based on the amount of buyable amount${superscript(format(this.effectExp()), "#000")}.
        Cost: ${format(this.cost())} Seeds
        Amount: ${format(getBuyableAmount(this.layer, this.id), 0)} ${this.freeLevels().gt(0)?"+ "+format(this.freeLevels()):""}
        Currently: ${formatAdd(buyableEffect(this.layer, this.id))}/s` 
      },
      cost(x) {return simpleCost(x, "E", 1_000, 15)},
      canAfford() {return player[this.layer].seeds.gte(this.cost())},
      buy() {
        player[this.layer].seeds = player[this.layer].seeds.sub(this.cost())
        setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
      },
      effect(x) {
        effect = Decimal.pow(3, x.add(this.freeLevels())).sub(1)
        return effect
      },
      tooltip: function() {return `
        Cost: ${format(1_000)} * 15${superscript("x")}<br>
        Effect: 3${superscript("x")} - 1
      `},
      unlocked() {return hasUpgrade('g', 21)},
      freeLevels() {
        let x = E(0)
        if (hasUpgrade(this.layer, 34)) x = x.add(getBuyableAmount(this.layer, 13))
        return x
      },
    },
    13: {
      title: () => `Plant Generation`,
      effectExp() {
        let exp = new Decimal(1)
        return exp
      },
      display() {
        return `Generates plants (base) based on the amount of buyable amount${superscript(format(this.effectExp()), "#000")}.
        Cost: ${format(this.cost())} Sprouts
        Amount: ${format(getBuyableAmount(this.layer, this.id), 0)} ${this.freeLevels().gt(0)?"+ "+format(this.freeLevels()):""}
        Currently: ${formatAdd(buyableEffect(this.layer, this.id))}/s` 
      },
      cost(x) {return simpleCost(x, "E", 1_500, 20)},
      canAfford() {return player[this.layer].sprouts.gte(this.cost())},
      buy() {
        player[this.layer].sprouts = player[this.layer].sprouts.sub(this.cost())
        setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
      },
      effect(x) {
        effect = Decimal.pow(2, x.add(this.freeLevels())).sub(1)
        return effect
      },
      tooltip: function() {return `
        Cost: ${format(1_500)} * 20${superscript("x")}<br>
        Effect: 2${superscript("x")} - 1
      `},
      unlocked() {return hasMilestone('a', 11)},
      freeLevels() {
        let x = E(0)
        if (hasUpgrade(this.layer, 34)) x = x.add(getBuyableAmount(this.layer, 14))
        return x
      },
    },
    14: {
      title: () => `Tree Generation`,
      effectExp() {
        let exp = new Decimal(1)
        return exp
      },
      display() {
        return `Generates plants (base) based on the amount of buyable amount${superscript(format(this.effectExp()), "#000")}.
        Cost: ${format(this.cost())} Plants
        Amount: ${format(getBuyableAmount(this.layer, this.id), 0)}
        Currently: ${formatAdd(buyableEffect(this.layer, this.id))}/s` 
      },
      cost(x) {return simpleCost(x, "E", 5_000, 30)},
      canAfford() {return player[this.layer].plants.gte(this.cost())},
      buy() {
        player[this.layer].plants = player[this.layer].plants.sub(this.cost())
        setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
      },
      effect(x) {
        return Decimal.pow(2, x).sub(1)
      },
      tooltip: function() {return `
        Cost: ${format(2_000)} * 30${superscript("x")}<br>
        Effect: 2${superscript("x")} - 1
      `},
      unlocked() {return hasMilestone('a', 13)}
    },
  },
  update(diff) {
    seedGain = tmp[this.layer].seedGain
    sproutGain = tmp[this.layer].sproutGain
    plantGain = tmp[this.layer].plantGain
    treeGain = tmp[this.layer].treeGain

    player[this.layer].seeds = player[this.layer].seeds.add(seedGain.mul(diff))
    player[this.layer].sprouts = player[this.layer].sprouts.add(sproutGain.mul(diff))
    player[this.layer].plants = player[this.layer].plants.add(plantGain.mul(diff))
    player[this.layer].trees = player[this.layer].trees.add(treeGain.mul(diff))
  }
})