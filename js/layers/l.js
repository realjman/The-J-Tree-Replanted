addLayer('l', {
  name: "Life",
  symbol: "L",
  position: 0,
  row: 3,
  startData() {return {
    unlocked: false,
    points: E(0),

  }},
  color: "#72b5b5",
  resource: "Life Points",
  baseResource: "J-fragments",
  baseAmount() {return player.points},
  prestigeButtonText() {return player.l.points.lt(this.currentCap())?`Condense everything and form life with ${formatAdd(getResetGain(this.layer))} Life Points<br><br>${Decimal.add(player.l.points, getResetGain("l")).lt(this.currentCap())?"Next Life Point at "+format(getNextAt(this.layer, true))+" J-fragments":"Unable to gain more due to hitting the cap."}`:`Unable to reset due to hitting the current cap.`},
  type: "custom",

  currentCap() {
    let x = E(5)
    if (hasChallenge('l', 13)) x = x.mul(2)

    return x
  },

  requires() {return E("2^1024")},
  getResetGain() {return player.points.add(1).log(10).div(308.25).floor().clamp(0, this.currentCap().sub(player.l.points))}, // player.points.add(1).log(2).div(1024)
  getNextAt() {return this.requires().pow(getResetGain(this.layer).add(1))},
  canReset() {return player.points.gte(this.requires()) && player.l.points.lt(this.currentCap())},

  effect() {
    let x = player[this.layer].points

    return x.div(10).add(1)
  },
  effectDescription: () => ` which is translated into ${colored(formatX(tmp.l.effect), tmp.l.color)} base J-fragment gain.`,

  branches: ["t", "d", "s"],

  layerShown() {return player.points.gte("1e300")||player[this.layer].unlocked},

  tabFormat: {
    "Main": {
      content: [
        "main-display",
        ["raw-html", () => `Your current Life Points cap is ${colored(format(tmp.l.currentCap), tmp.l.color)}`],
        "blank",
        "prestige-button",
        "resource-display",
        ['microtabs', 'main'],
      ],
    },
    "Buyables": {
      content: [
        "main-display",
        ["raw-html", () => `Your current Life Points cap is ${colored(format(tmp.l.currentCap), tmp.l.color)}`],
        "blank",
        "prestige-button",
        "resource-display",
        "buyables",
        ["raw-html", () => `<img src="./assets/img/elephant-green.gif"></img>`]
      ],
      unlocked() {return hasMilestone('l', 8)}
    }
  },
  microtabs: {
    main: {
      Milestones: {
        content: [
          "milestones"
        ],
      },
      Challenges: {
        content: [
          "challenges",
        ],
        unlocked() {return hasMilestone("l", 5)}
      },
    },
  },

  milestones: {
    1: {
      requirementDescription: `1 Life Points [1]`,
      effectDescription: () => `Keep all the first and third milestones on ${colored("Time", tmp.t.color)}, ${colored("Dice", tmp.d.color)} and ${colored("Space", tmp.s.color)}, ${formatX(10)} to ${colored("J-points", tmp.j.color)} and ${colored("Growth", tmp.g.color)} gain, ${formatPow(0.99)} to ${colored("Abstract", tmp.a.color)} requirement and ${formatX(3)} to all plants and ${colored("Abstract Power", tmp.a.color)} gain.`,
      done() {return player[this.layer].points.gte(1)},
    },
    2: {
      requirementDescription: `2 Life Points [2]`,
      effectDescription: () => `Keep 6th ${colored("Space", tmp.s.color)} milestone, 2nd ${colored("Time", tmp.t.color)} milestone on row 3 resets, ${colored("Classical Tree Game", "#000")}'s effect softcap starts ${formatX(1e10)} later, multiply J-fragments gain based on ${colored("Life Points", tmp.l.color)}, unlocks ${colored("Auto Abstract", tmp.a.color)}. Currently: ${formatX(milestoneEffect('l', 2))}`,
      effect() {
        let x = player[this.layer].points

        return Decimal.pow(10, x)
      },
      tooltip: `Effect: ${writeExp("x", 10)}`,
      done() {return player[this.layer].points.gte(2)},
      toggles: [['a', 'autoAbstract']]
    },
    3: {
      requirementDescription: `3 Life Points [3]`,
      effectDescription: () => `You can now buy max all Row 3 layers, unlock more milestone on ${colored("Abstract", tmp.a.color)}, ${colored("J-points", tmp.j.color)} gain is boosted based on ${colored("Life Points", tmp.l.color)}. Currently: ${formatX(milestoneEffect('l', 3))}`,
      effect() {
        let x = player[this.layer].points

        return Decimal.pow(x.add(1), 3)
      },
      tooltip: `Effect: ${writeExp(3, "x + 1", null, true)}`,
      done() {return player[this.layer].points.gte(3)},
      unlocked() {return hasMilestone("l", 1)}
    },
    4: {
      requirementDescription: `4 Life Points`,
      effectDescription: () => `Keep 14th ${colored("Abstract", tmp.a.color)} milestone on reset, autobuy ${colored("Growth", tmp.g.color)} upgrades, unlock more ${colored("J-point", tmp.j.color)} upgrades.`,
      done() {return player[this.layer].points.gte(4)},
      unlocked() {return hasMilestone("l", 2)}
    },
    5: {
      requirementDescription: `5 Life Points [5]`,
      effectDescription: () => `Unlock Life Challenges.`,
      done() {return player[this.layer].points.gte(5)},
      unlocked() {return hasMilestone("l", 3)}
    },
    6: {
      requirementDescription: `7 Life Points`,
      effectDescription: () => `Square ${colored("Just Another Synergy", DARK)} effect and second ${colored("Abstract", tmp.a.color)} milestone effect, ${formatX(1.01)} to J-fragment's gain exponent.`,
      done() {return player[this.layer].points.gte(7)},
      unlocked() {return hasMilestone("l", 4)}
    },
    7: {
      requirementDescription: `9 Life Points`,
      effectDescription: () => `Unlocks another Life challenge, ${formatPow(1.01)} to Global Plant Boost (all the plants), ${formatAdd(1)}% to Golden Dice Fragment chance.`,
      done() {return player[this.layer].points.gte(9)},
      unlocked() {return hasMilestone("l", 5)}
    },
    8: {
      requirementDescription: `10 Life Points and Completed ${colored("Missing Layer 3", DARK)}`,
      effectDescription: () => `Unlock Life Buyables.`,
      done() {return player[this.layer].points.gte(10) && hasChallenge("l", 21)},
      unlocked() {return hasMilestone("l", 6)}
    },
  },

  challenges: {
    11: {
      name: `Reduced fragments`,
      challengeDescription: () => `J-fragments gain is ${formatPow(0.5)} in this challenge.`,
      goalDescription: () => `${format("e55")} J-fragments`,
      rewardDescription: () => `${formatX(1.01)} to J-fragments gain exponent, keep 6th Time and Dice milestones.`,
      canComplete: () => player.points.gte("e55"),
      unlocked() {return hasMilestone("l", 5)},
    },
    12: {
      name: `No Plants`,
      challengeDescription: () => `All the Plant generation is disabled.`,
      goalDescription: () => `${format("e60")} J-fragments`,
      rewardDescription: () => `J-fragments boosts Dice Fragments and Time gain.`,
      canComplete: () => player.points.gte("e60"),
      unlocked() {return hasMilestone("l", 5)&&hasChallenge("l", 11)},
      rewardEffect() {
        let x = player.points
        return x.add(1).max(1).log(10).pow(0.5).add(1)
      },
      rewardDisplay() {
        return `${formatX(challengeEffect(this.layer, this.id))}<br>${shiftDown ? 'Effect: '+writeExp(0.5, writeLog(10, "x + 1"))+' + 1' : "(Hold shift for formula)"}`
      },
    },
    13: {
      name: `Scaled Abstract`,
      challengeDescription: () => `Abstract's requirement is now ${formatPow(1.5)}`,
      goalDescription: () => `${format("e300")} J-fragments`,
      rewardDescription: () => `Max Life Point cap is now increased by ${formatX(2)}, keep 4th Time and Space milestones.`,
      canComplete: () => player.points.gte("e300"),
      unlocked() {return hasMilestone("l", 5)&&hasChallenge("l", 12)},
    },
    21: {
      name: `Missing Layer 3`,
      challengeDescription: () => `Every Layer 3 features, milestones and effects are disabled.`,
      goalDescription: () => `${format("e208")} J-fragments`,
      rewardDescription: () => `This is one of the requirements to unlock Life Buyables.`,
      canComplete: () => player.points.gte("e208"),
      unlocked() {return hasMilestone("l", 7)&&hasChallenge("l", 13)},
    },
  }
})