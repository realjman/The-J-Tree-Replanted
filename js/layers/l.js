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

  branches: ["t", "d", "s"],

  layerShown() {return player.points.gte("1e300")},
})