let modInfo = {
	name: "The J Tree: Replanted (testing)",
	id: "tjtrr",
	author: "realjman",
	pointsName: "J-fragments",
	modFiles: ["layers/j.js", "layers/a.js", "layers/g.js", "layers/t.js", "layers/d.js", "layers/s.js", "tree.js", "layers/miscLayers/ab.js", "layers/miscLayers/stats.js"],

	discordName: "extrem j server",
	discordLink: "https://discord.gg/UUyR82mzMG/",
	initialStartPoints: new Decimal(1), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.3 testing patch 3",
	name: "so goober",
}

let changelog = `<h1>Changelog:</h1><br>
	<h2 class='hugeUpdTitle'>v0.1.0 Full Rewrite</h2><br>
	<h3 style='text-shadow: 0px 0px 10px #fff'>Main things that was changed on this rewrite:</h3><br>
	- break_eternity.js has been ported to the latest version.<br>
	- Full on rebalancing and new mechanics for this mod.<br>
	<h3 style='text-shadow: 0px 0px 10px #fff'>Main things:</h3><br>
	- 3 layers, 1 layer is currently working in progress, enjoy this mess I suppose.<br>
	- 15 Upgrades, 7 Milestones and 1 Buyable in total.<br><br>
	<h2 class='hugeUpdTitle'>v0.2.0 Grow The Plants</h2><br>
	- <h3>TMT version ported to v2.7</h3><br>
	<h3 style='text-shadow: 0px 0px 10px #fff'>Main Features:</h3><br>
	- Implemented Growth layer.<br>
	- 15 new upgrades.<br>
	- 6 new buyables.<br>
	- 14 new milestones.<br>
	- 4 new currencies.<br>
	<h3 style='text-shadow: 0px 0px 10px #fff'>QoL:</h3><br>
	- Autobuyer Tab<br>
	<h3 style='text-shadow: 0px 0px 10px #fff'>Others:</h3><br>
	- UI placement has changed.
		`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	if (hasUpgrade("j", 11)) return true
}

function getBasePointGen() {
	let base = new Decimal(0.1)
	if (hasUpgrade('j', 21)) base = base.add(upgradeEffect('j', 21))
	if (hasUpgrade('j', 24)) base = base.add(0.05)

	base = base.add(tmp.a.effect)
	return base
}

// Multipliers (bite of '87)
function getPointMult() {
	let mult = E(1)

	// Upgrades
		if (hasUpgrade('j', 12)) mult = mult.mul(upgradeEffect('j', 12))
		if (hasUpgrade('j', 15)) mult = mult.mul(2)
		if (hasUpgrade('j', 33)) mult = mult.mul(upgradeEffect('j', 33))
		if (hasUpgrade("t", 11)) mult = mult.mul(upgradeEffectInTime(11, 2))
	
	// Buyables
		if (getBuyableAmount('j', 11).gte(1)) mult = mult.mul(buyableEffect('j', 11))

	// Others
		mult = mult.mul(tmp.a.APEffect1)
		mult = mult.mul(tmp.g.treeEffect2)
		mult = mult.mul(tmp.d.diceEffect2)
		mult = mult.mul(tmp.s.effect)
		mult = mult.mul(timeEffects(1))

	return mult
}

// Exponents
function getPointExp() {
	let exp = E(1)

	// Upgrades
	if (hasUpgrade('j', 32)) exp = exp.add(0.01)
	if (hasUpgrade('d', 12)) exp = exp.add(upgradeEffect('d', 12))

	// Milestones
	if (hasMilestone('a', 9)) exp = exp.add(0.01)
	if (hasMilestone('a', 19)) exp = exp.add(0.02)

	// Others
	exp = exp.add(tmp.s.effectExp)
	if (getBuyableAmount("t", 11).gte(5)) exp = exp.add(buyableEffect("t", 11))

	return exp
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let base = getBasePointGen()
	let mult = getPointMult()
	let exp = getPointExp()
	
	gain = base.mul(mult)
	if (gain.gte(1)) gain = gain.pow(exp)
	return gain
}

function color(text, color, tag='h3') { return `<${tag} style='color:${color};'>${text}</${tag}>` }
function colored(text, color, tag='h3') { return `<${tag} style='color:${color};text-shadow:${color} 0px 0px 10px;'>${text}</${tag}>` }
function superscript(text, color) {return `<sup style='color:${color}'>${text}</sup>`}
function subscript(text, color) {return `<sub style='color:${color}'>${text}</sub>`}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	function(){
		return `Current Endgame: Ignore this, you are a goober<br> smots gaming`
	}
]

// Determines when the game "ends"
function isEndgame() {
	return false
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
	
}