addLayer("a", {
  name: "abstract",
  symbol: "A",
  position: 0,
  row: 1,
  branches: ["j"],
  startData() {return {
    unlocked: false,
    points: new Decimal(0),
    best: new Decimal(0),
    power: E(0),
  }},
  resetDescription: "The abstractive layer contaminates all your previous progress into ",
  color: "#9ae479",
  requires: new Decimal("2e4"),
  resource: "Abstracts",
  baseResource: "J-points",
  baseAmount() {return player.j.points},
  type: "static",
  exponent: 1.5,
  base: 3,
  effectDiv() {
    let div = E(20)
    if (hasMilestone(this.layer, 5)) div = div.sub(4)
    return div
  },
  effect() {
    return (player[this.layer].points).div(tmp[this.layer].effectDiv)
  },
  effectDescription: function() {
    return `which translates into ${colored(formatAdd(tmp.a.effect), tmp.a.color)} to base J-fragments gain. <br>${shiftDown?"Effect: Abstract / "+format(tmp[this.layer].effectDiv):"(Hold shift for effect formula)"}`
  },
  gainMult() {
    let mult = new Decimal(1)
    mult = mult.div(tmp[this.layer].APEffect2)
    if (getBuyableAmount('a', 11).gte(1)) mult = mult.div(buyableEffect('a', 11))
    if (hasUpgrade('g', 23)) mult = mult.div(upgradeEffect('g', 23))
    if (hasMilestone(this.layer, 12)) mult = mult.div(milestoneEffect(this.layer, 12))
    return mult
  },
  gainExp() {
    let exp = new Decimal(1)
    return exp
  },
  baseAPGen() {
    let base = E(0)
    if (hasUpgrade('j', 35)) base = base.add(1)
    return base
  },
  abstractPowerGen() {
    let base = this.baseAPGen()
    let mult = E(1)

    if (hasMilestone(this.layer, 2)) mult = mult.mul(milestoneEffect(this.layer, 2))
      mult = mult.mul(tmp[this.layer].APEffect3)
    if (hasUpgrade('g', 14)) mult = mult.mul(upgradeEffect('g', 14))
    if (getBuyableAmount('a', 12).gte(1)) mult = mult.mul(buyableEffect('a', 12))
    mult = mult.mul(tmp.g.sproutEffect)

    gain = base.mul(mult)
    return gain
  },
  APEffect1() {
    x = player[this.layer].power
    if (x.gte(25)) {
      if (hasMilestone(this.layer, 8)) return Decimal.log(x.add(1), 5).mul(2).add(1)
      return Decimal.log(x.add(1), 10).add(1)
    }
    return E(1)
  },
  APEffect2() {
    x = player[this.layer].power
    if (!x.gte(150)) return E(1)
      return Decimal.div(x, 10).pow(0.25).add(1)
  },
  APEffect3() {
    x = player[this.layer].power
    if (player.j.points.gte(1.5e8) || hasUpgrade('g', 11)) return Decimal.log(x.add(1), 5).div(4).add(1)
    return E(1)
  },
  APEffect4() {
    x = player[this.layer].power
    if (!x.gte(3000)) return E(1)
      return Decimal.pow(x, 1/3).div(5).add(1)
  },
  APEffect5() {
    x = player[this.layer].power
    if (!hasMilestone(this.layer, 8)) return E(1)
      return Decimal.log(x.add(1), 10).div(6).add(1)
  },
  APEffect6() {
    x = player[this.layer].power
    if (!hasMilestone(this.layer, 14)) return E(1)
    return Decimal.log(x.add(1), 10).div(5).add(1)
  },
  canBuyMax() {return hasMilestone(this.layer, 14)},
  hotkeys: [
    {key: "a", description: "A: Reset to perform an Abstract", onPress(){if (canReset(this.layer)) doReset(this.layer)}, unlocked() {return player[this.layer].unlocked}},
  ],
  tabFormat: {
    "Main": {
      content: [
        "main-display",
        "prestige-button",
        "resource-display",
        "blank",
        ["microtabs", "main", {"border-style":"none"}]
      ],
    },
    "Abstract Power":{
      content: [
        "main-display",
        "prestige-button",
        "resource-display",
        'blank',
        ['display-text', function() {
          x = player.a.power
          return `
          You have ${colored(format(x), tmp.a.color)} Abstract Power.<br>
          You are generating ${colored(format(tmp.a.abstractPowerGen), tmp.a.color)} Abstract Power per second.<br><br>

          You will gain your first effect on ${format(25)} Abstract Power, all effects are based on Abstract Power.<br><br>

          ${colored("Effects:", "#fff")}<br>
          ${x.gte(25)?"First Effect: "+formatX(tmp.a.APEffect1)+" to J-fragments gain.":writeLocked(25, "abstract power")}<br>
          ${x.gte(150)?"Second Effect: "+formatDiv(tmp.a.APEffect2)+" to next Abstract requirement.":writeLocked(150, "abstract power")}<br>
          ${player.j.points.gte(1.5e8)||hasUpgrade("g", 11)?"Third Effect: "+formatX(tmp.a.APEffect3)+" to Abstract Power gain.":writeLocked(1.5e8, "J-points")}<br>
          ${x.gte(3000)?"Fourth Effect: "+formatX(tmp.a.APEffect4)+" to J-points gain.":writeLocked(3000, "abstract power")}<br>
          ${hasMilestone('a', 8)?"Fifth Effect: "+formatX(tmp.a.APEffect5)+" to Growth gain.":""}<br>
          ${hasMilestone('a', 14)?"Sixth Effect: "+formatX(tmp.a.APEffect6)+" to Seeds gain.":""}<br>
          `
        }],
        "blank",
        "blank",
        ["display-text", function() {
          return `
          ${colored("Formulas:", "#FFF")}<br>
          ${x.gte(25)?"First Effect: "+writeStringCondition("1 + log"+subscript("5")+"(AP + 1) * 2", "1 + log"+subscript("10")+"(AP + 1)", hasMilestone('a', 8)):writeLocked(25, "abstract power")}<br>
          ${x.gte(150)?"Second Effect: (AP / 10)"+superscript("0.25")+" + 1":writeLocked(150, "abstract power")}<br>
          ${player.j.points.gte(1.5e8)||hasUpgrade("g", 11)?"Third Effect: 1 + log"+subscript("5")+"(AP + 1) / 4":writeLocked(1.5e8, "J-points")}<br>
          ${x.gte(3000)?"Fourth Effect: 1 + AP"+superscript(format(1/3))+" / 5":writeLocked(3000, "abstract power")}<br>
          ${hasMilestone('a', 8)?"Fifth Effect: 1 + log"+subscript("10")+"(AP + 1) / 6":""}<br>
          ${hasMilestone('a', 8)?"Sixth Effect: 1 + log"+subscript("10")+"(AP + 1) / 5":""}<br>
          `
        }],
      ],
      unlocked() {return hasUpgrade('j', 35)},
    },
  },
  microtabs: {
    main: {
      Milestones: {
        content: [
          "milestones"
        ],
        unlocked() {return player.a.unlocked}
      },
      Buyables: {
        content: [
          "buyables"
        ],
        unlocked() {return player.g.unlocked}
      },
    },
  },
  milestones: {
    0: {
      requirementDescription: "2 Abstracts [1]",
      effectDescription: () => `Unlocks a new row of upgrades in ${colored("J", "#262")} (These upgrades will show after you buy ${colored("You're so Based", "#000")})`,
      done() {return player[this.layer].points.gte(2)},
    },
    1: {
      requirementDescription: "3 Abstracts [2]",
      effectDescription: () => `Boosts J-points based on the amount of Abstracts you have. Currently: ${formatX(milestoneEffect('a', 1))}`,
      effect() {
        x = player[this.layer].points
        if (hasMilestone(this.layer, 18)) return x.pow(0.8).add(1)
        return x.pow(0.6).add(1)
      },
      tooltip: () => `Effect: (Abstracts${superscript(format(0.6))} + 1)`,
      done() {return player[this.layer].points.gte(3)},
    },
    2: {
      requirementDescription: "4 Abstracts [3]",
      effectDescription: () => `Double Abstract Power gain per Abstract starting from 3 Abstracts. Currently: ${formatX(milestoneEffect('a', 2))}`,
      effect() {
        x = player[this.layer].points
        return Decimal.pow(2, x.sub(2)).max(1)
      },
      tooltip: () => `Effect: max(1, 2${superscript("Abstracts - 2")})`,
      done() {return player[this.layer].points.gte(4)},
      unlocked() {return hasMilestone(this.layer, 0) && hasUpgrade('j', 35) || hasMilestone(this.layer, this.id)},
    },
    3: {
      requirementDescription: "5 Abstracts",
      effectDescription: () => `Keep the first row of upgrades in ${colored("J", "#262")} on Abstract.`,
      done() {return player[this.layer].points.gte(5)},
      unlocked() {return hasMilestone(this.layer, 1) && hasUpgrade('j', 35) || hasMilestone(this.layer, this.id)},
    },
    4: {
      requirementDescription: "6 Abstracts [5]",
      effectDescription: () => `Keep the second row of upgrades in ${colored("J", "#262")} on Abstract, keep 3 of ${colored("Classical Tree Game", "#000")} on Abstract and generate ${formatPercents(0.1)} of your pending J-points per second.`,
      done() {return player[this.layer].points.gte(6)},
      unlocked() {return hasMilestone(this.layer, 2)},
    },
    5: {
      requirementDescription: "7 Abstracts",
      effectDescription: () => `${colored("Classical Tree Game", "#000")} costs nothing, generate ${formatPercents(1)} of your pending J-points per second and Abstract's effect is slightly better.`,
      tooltip: () => `Abstracts / 20 => Abstracts / 16`,
      done() {return player[this.layer].points.gte(7)},
      unlocked() {return hasMilestone(this.layer, 3)},
    },
    6: {
      requirementDescription: "8 Abstracts",
      effectDescription: () => `Keep the third row of upgrades in ${colored("J", "#262")}, autobuys max ${colored("Classical Tree Game", "#000")} and unlocks a new layer in the same row.`,
      done() {return player[this.layer].points.gte(8)},
      unlocked() {return hasMilestone(this.layer, 4)},
      toggles: [['j', "autoBuyable"]]
    },
    7: {
      requirementDescription: "9 Abstracts",
      effectDescription: () => `Growth is boosted based on your current Abstract and ${colored("Familiar Mulitplier", "#000")}'s effect is better. Currently: ${formatX(milestoneEffect('a', 7))}`,
      effect() {
        x = player[this.layer].points
        return x.pow(0.5).add(1)
      },
      tooltip: () => `
        Effect Formula: Abstracts${superscript(format(0.5))} + 1<br>
        Better Formula for Familiar Multiplier: log${subscript("5")} => log${subscript("4")}
      `,
      done() {return player[this.layer].points.gte(9)},
      unlocked() {return hasMilestone(this.layer, 5) && (player.g.unlocked || hasMilestone(this.layer, this.id))},
    },
    8: {
      requirementDescription: "10 Abstracts",
      effectDescription: () => `Unlocks another Abstract Power effect, both first AP's effect and ${colored("Just Another Synergy", "#000")}'s effect are better.`,
      tooltip: () => `
        First AP Effect: 1 + log${subscript("10")}(AP + 1) => 1 + log${subscript("5")}(AP + 1) * 2<br>
        J-13 Effect: log${subscript("4", "#fff")}(J-points${superscript("0.3", "#fff")} + 1) + 1 => log${subscript("3", "#fff")}(J-points${superscript("0.75", "#fff")} + 1) + 1
      `,
      done() {return player[this.layer].points.gte(10)},
      unlocked() {return hasMilestone(this.layer, 6)},
    },
    9: {
      requirementDescription: "11 Abstracts [10]",
      effectDescription: () => `${formatAdd(0.01)} to the J-fragments gain exponent.`,
      done() {return player[this.layer].points.gte(11)},
      unlocked() {return hasMilestone(this.layer, 7)},
    },
    10: {
      requirementDescription: "12 Abstracts",
      effectDescription: () => `Your seed gain is increased ${formatPercents(hasMilestone('a', 19)?0.6:0.5)} compounding based on your current Abstract starting from 10. Currently: ${formatX(milestoneEffect('a', 10))}`,
      done() {return player[this.layer].points.gte(12)},
      effect() {
        x = player[this.layer].points
        if (hasMilestone('a', 19)) return Decimal.pow(1.6, (x.sub(9))).max(1)
        return Decimal.pow(1.5, (x.sub(9))).max(1)
      },
      tooltip: () => `Effect: max(1, ${hasMilestone(this.layer, 19)?"1.6":"1.5"}${superscript("Abstracts - 9")})`,
      unlocked() {return hasMilestone(this.layer, 8)},
    },
    11: {
      requirementDescription: "13 Abstracts",
      effectDescription: () => `Unlocks a new plant and ${formatAdd(0.01)} to ${colored("Classical Tree Game", "#000")}'s level exponent.`,
      done() {return player[this.layer].points.gte(13)},
      unlocked() {return hasMilestone(this.layer, 9)},
    },
    12: {
      requirementDescription: "15 Abstracts",
      effectDescription: () => `Sprouts divides the next abstract requirement. Currently: ${formatDiv(milestoneEffect('a', 12))}`,
      done() {return player[this.layer].points.gte(15)},
      effect() {
        x = player.g.sprouts
        return Decimal.pow(x, 1/3).div(2).add(1)
      },
      unlocked() {return hasMilestone(this.layer, 10)},
      tooltip: () => `1 + ${writeExp('0.33', 'x')} / 2`
    },
    13: {
      requirementDescription: "18 Abstracts",
      effectDescription: () => `Generates ${formatPercents(0.01)} of your pending growth per second and unlocks another plant.`,
      done() {return player[this.layer].points.gte(18)},
      unlocked() {return hasMilestone(this.layer, 11)},
    },
    14: {
      requirementDescription: "20 Abstracts [15]",
      effectDescription: () => `You can now buy max Abstract and unlock a new Abstract Power effect.`,
      done() {return player[this.layer].points.gte(20)},
      unlocked() {return hasMilestone(this.layer, 12)},
    },
    15: {
      requirementDescription: "22 Abstracts",
      effectDescription: () => `Your plant gain is increased ${formatPercents(0.5)} compounding based on your current Abstract starting from 15. Currently: ${formatX(milestoneEffect('a', 15))}`,
      done() {return player[this.layer].points.gte(22)},
      unlocked() {return hasMilestone(this.layer, 13)},
      effect() {
        x = player[this.layer].points
        return Decimal.pow(1.5, (x.sub(14))).max(1)
      },
      tooltip: () => `Effect: max(1, 1.5${superscript("Abstracts - 14")})`,
    },
    16: {
      requirementDescription: "23 Abstracts",
      effectDescription: () => `${colored("Seed Generation", "#000")}'s scaling starts 3 later.`,
      done() {return player[this.layer].points.gte(23)},
      unlocked() {return hasMilestone(this.layer, 14)},
    },
    17: {
      requirementDescription: "24 Abstracts",
      effectDescription: () => `Generates ${formatPercents(0.1)} of your pending growth per second.`,
      done() {return player[this.layer].points.gte(24)},
      unlocked() {return hasMilestone(this.layer, 15)},
    },
    18: {
      requirementDescription: "26 Abstracts",
      effectDescription: () => `Second Abstract milestone's effect is better and ${formatAdd(0.1)} to ${colored("Classical Tree Game", "#000")} effect base.`,
      done() {return player[this.layer].points.gte(26)},
      unlocked() {return hasMilestone(this.layer, 16)},
      tooltip: () => `(Abstracts${superscript(format(0.6))} + 1) => (Abstracts${superscript(format(0.8))} + 1)`,
    },
    19: {
      requirementDescription: "28 Abstracts [20]",
      effectDescription: () => `Generates ${formatPercents(1)} of your pending growth per second, 11th Abstract milestone's effect is better and ${formatAdd(0.02)} to J-fragments exponent.`,
      done() {return player[this.layer].points.gte(28)},
      unlocked() {return hasMilestone(this.layer, 17)},
      tooltip: () => `max(1, 1.5${superscript("Abstracts - 9")}) => max(1, 1.6${superscript("Abstracts - 9")})`,
    },
    20: {
      requirementDescription: "30 Abstracts",
      effectDescription: () => `${formatAdd(0.01)} to J-points exponent and second Tree effect is better.`,
      done() {return player[this.layer].points.gte(30)},
      unlocked() {return hasMilestone(this.layer, 18)},
      tooltip: () => ``,
    },
  },
  buyables: {
    11: {
      title: () => `Long Term Division`,
      effectExp() {
        let exp = new Decimal(1)
        return exp
      },
      display() {
        return `Divides the next Abstract requirement per buyable amount${superscript(format(this.effectExp()), "#000")}.
        Cost: ${format(this.cost())} Abstract Power
        Amount: ${format(getBuyableAmount(this.layer, this.id), 0)}
        Currently: ${formatDiv(buyableEffect(this.layer, this.id))}` 
      },
      cost(x) {return simpleCost(x, "EA", 100, 1.3, 1.1)},
      canAfford() {return player[this.layer].power.gte(this.cost())},
      buy() {
        player[this.layer].power = player[this.layer].power.sub(this.cost())
        setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
      },
      effect(x) {
        return Decimal.mul(x.pow(0.8), 2).add(1)
      },
      tooltip: function() {return `
        Cost: 100 * (1 + 1.3 * x) * 1.1${superscript("x")}<br>
        Effect: x${superscript(format(0.8))} * 2 + 1
      `},
      unlocked() {return player.g.unlocked}
    },
    12: {
      title: () => `Powerful`,
      effectExp() {
        let exp = new Decimal(1)
        return exp
      },
      display() {
        return `Multiply Abstract Power gain per buyable amount${superscript(format(this.effectExp()), "#000")}.
        Cost: ${format(this.cost())} Abstract Power
        Amount: ${format(getBuyableAmount(this.layer, this.id), 0)}
        Currently: ${formatX(buyableEffect(this.layer, this.id))}` 
      },
      cost(x) {return simpleCost(x, "EA", 1_000, 5, 1.3)},
      canAfford() {return player[this.layer].power.gte(this.cost())},
      buy() {
        player[this.layer].power = player[this.layer].power.sub(this.cost())
        setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
      },
      effect(x) {
        return Decimal.pow(1.2, (x.add(1)).log(1.4))
      },
      tooltip: function() {return `
        Cost: 1000 * (1 + 5 * x) * 1.3${superscript("x")}<br>
        Effect: 1.2${superscript("log"+subscript(format(1.4))+"(x + 1)")}
      `},
      unlocked() {return player.g.unlocked}
    },
  },
  layerShown() {return hasUpgrade("j", 25) || player[this.layer].unlocked},
  update(diff) {
    apGen = tmp[this.layer].abstractPowerGen

    player[this.layer].power = player[this.layer].power.add(apGen.mul(diff))
  },
  /*doReset(resettingLayer) {
    // Stage 1, almost always needed, makes resetting this layer not delete your progress
    if (layers[resettingLayer].row <= this.row) return;

    // Stage 2, track which specific subfeatures you want to keep, e.g. Upgrade 11, Challenge 32, Buyable 12
    let keptUpgrades = []
    if (someCondition && hasUpgrade(this.layer, 11)) keptUpgrades.push(11)

    // Stage 3, track which main features you want to keep - all upgrades, total points, specific toggles, etc.
    let keep = [];
    if (someOtherCondition) keep.push("milestones");

    // Stage 4, do the actual data reset
    layerDataReset(this.layer, keep);

    // Stage 5, add back in the specific subfeatures you saved earlier
    player[this.layer].upgrades.push(...keptUpgrades)
  }*/
  doReset(resettingLayer) {
    if (layers[resettingLayer].row <= this.row) {
      if (layers[resettingLayer].layer != "a" && !hasUpgrade('g', 33)) player[this.layer].power = E(0)
      return;
    };
  },
})
