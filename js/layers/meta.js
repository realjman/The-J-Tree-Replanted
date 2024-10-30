addLayer('meta', {
    name: "meta", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "M", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    resetDescription: "Reset for ",
    color: "#999",
    requires: E(10).tetrate(308), // Can be a function that takes requirement increases into account
    resource: "Meta", // Name of prestige currency
    baseResource: "Growth", // Name of resource prestige is based on
    baseAmount() {return player.g.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    base: 2,
    row: 2,
    branches: ['a', 'g'],
    effectDescription: () => `this is a placeholder layer, will be removed next update.`,
})