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
  prestigeButtonText() {return `Condense everything and form life with ${formatAdd(getResetGain(this.layer))} Life Points<br><br>Next Life Point at ${format(getNextAt(this.layer, true))} J-fragments`},
  type: "custom",
  requires() {return E("2^1024")},
  getResetGain() {return player.points.add(1).log(10).div(308.25).floor()}, // player.points.add(1).log(2).div(1024)
  getNextAt() {return this.requires().pow(getResetGain(this.layer).add(1))},
  canReset() {return player.points.gte(this.requires())},

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
          "prestige-button",
          "resource-display",
          ['microtabs', 'main'],
      ],
    },
  },
  microtabs: {
    main: {
      Milestones: {
        content: [
          "milestones"
        ],
      }
    }
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
  }
})