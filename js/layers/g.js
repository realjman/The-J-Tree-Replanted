addLayer('g', {
  name: "growth",
  symbol: "G",
  position: 1,
  row: 1,
  branches: ['j'],
  startData() {return {
    unlocked: false,
    points: E(0),
  }},
  resetDescription: "Your fragments causes the tree slowly branch out to produce ",
  color: "#618968",
  requires: E("1e17"),
  resource: "Growth",
  baseResource: "J-fragments",
  baseAmount() {return player.points},
  type: "normal",
  exponent: 1/3,
  gainMult() {
    let mult = new Decimal(1)
    return mult
  },
  gainExp() {
    let exp = new Decimal(1)
    return exp
  },
  hotkeys: [
    {key: "g", description: "G: Reset to perform a Growth", onPress(){if (canReset(this.layer)) doReset(this.layer)}, unlocked() {return player[this.layer].unlocked}},
  ],
  tabFormat: [
    "main-display",
      "prestige-button",
      "resource-display",
      ["display-text", () => `${colored("NYI", "#fff")}<br> did i mention that this layer resets abstract power, if you read this you are a goober`]
  ],
  layerShown() {return hasMilestone("a", 6) || player[this.layer].unlocked},
})