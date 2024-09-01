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

    gain = base.mul(mult)
    return gain
  },
  APEffect1() {
    x = player[this.layer].power
    if (!x.gte(25)) return E(1)
      return Decimal.log(x.add(1), 10).add(1)
  },
  APEffect2() {
    x = player[this.layer].power
    if (!x.gte(150)) return E(1)
      return Decimal.div(x, 10).pow(0.25).add(1)
  },
  APEffect3() {
    x = player[this.layer].power
    if (!player.j.points.gte(1.5e8)) return E(1)
      return Decimal.log(x.add(1), 5).div(4).add(1)
  },
  APEffect4() {
    x = player[this.layer].power
    if (!x.gte(3000)) return E(1)
      return Decimal.pow(x, 1/3).div(5).add(1)
  },
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
          ${player.j.points.gte(1.5e8)?"Third Effect: "+formatX(tmp.a.APEffect3)+" to Abstract Power gain.":writeLocked(1.5e8, "J-points")}<br>
          ${x.gte(3000)?"Fourth Effect: "+formatX(tmp.a.APEffect4)+" to J-points gain.":writeLocked(3000, "abstract power")}<br>
          `
        }],
        "blank",
        "blank",
        ["display-text", function() {
          return `
          ${colored("Formulas:", "#FFF")}<br>
          ${x.gte(25)?"First Effect: log"+subscript("10")+"(AP + 1) + 1":writeLocked(25, "abstract power")}<br>
          ${x.gte(150)?"Second Effect: (AP / 10)"+superscript("0.25")+" + 1":writeLocked(150, "abstract power")}<br>
          ${player.j.points.gte(1.5e8)?"Third Effect: 1 + log"+subscript("5")+"(AP + 1) / 4":writeLocked(1.5e8, "J-points")}<br>
          ${x.gte(3000)?"Fourth Effect: 1 + AP"+superscript(format(1/3))+" / 5":writeLocked(3000, "abstract power")}
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
    },
  },
  milestones: {
    0: {
      requirementDescription: "2 Abstracts",
      effectDescription: () => `Unlocks a new row of upgrades in ${colored("J", "#262")} (These upgrades will show after you buy ${colored("You're so Based", "#000")})`,
      done() {return player[this.layer].points.gte(2)},
    },
    1: {
      requirementDescription: "3 Abstracts",
      effectDescription: () => `Boosts J-points based on the amount of Abstracts you have. Currently: ${formatX(milestoneEffect('a', 1))}`,
      effect() {
        x = player[this.layer].points
        return x.pow(0.6).add(1)
      },
      tooltip: () => `Effect: (Abstracts${superscript(format(0.6))} + 1)`,
      done() {return player[this.layer].points.gte(3)},
    },
    2: {
      requirementDescription: "4 Abstracts",
      effectDescription: () => `Double Abstract Power gain per Abstract starting from 3 Abstracts. Currently: ${formatX(milestoneEffect('a', 2))}`,
      effect() {
        x = player[this.layer].points
        return Decimal.pow(2, x.sub(2)).max(1)
      },
      tooltip: () => `Effect: max(1, 2${superscript("Abstracts - 2")})`,
      done() {return player[this.layer].points.gte(4)},
      unlocked() {return hasMilestone(this.layer, 0) && hasUpgrade('j', 35)},
    },
    3: {
      requirementDescription: "5 Abstracts",
      effectDescription: () => `Keep the first row of upgrades in ${colored("J", "#262")} on Abstract.`,
      done() {return player[this.layer].points.gte(5)},
      unlocked() {return hasMilestone(this.layer, 1) && hasUpgrade('j', 35)},
    },
    4: {
      requirementDescription: "6 Abstracts",
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
      if (layers[resettingLayer].layer != "a") player[this.layer].power = E(0)
      return;
    };
  },
})
