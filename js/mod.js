let modInfo = {
	name: "The J Tree: Replanted",
	id: "tjtrr",
	author: "realjman",
	pointsName: "J-fragments",
	modFiles: ["layers/j.js", "layers/a.js", "layers/g.js", "tree.js"],

	discordName: "@rjman",
	discordLink: "",
	initialStartPoints: new Decimal(1), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.0.1",
	name: "Full Rewrite",
}

let changelog = `<h1>Changelog:</h1><br>
	<h2 class='hugeUpdTitle'>v0.0.1 Full Rewrite</h2><br>
	<h3>Main things that happened on this rewrite:</h3><br>
	- break_eternity.js has been ported to the latest version.<br>
	- Full on rebalancing and new mechanics for this mod.<br>
	<h3>Main things:</h3><br>
	- 3 layers, 1 layer is currently working in progress, enjoy this mess I suppose.<br>
	- 15 Upgrades, 7 Milestones and 1 Buyable in total.
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

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let base = getBasePointGen()
	let mult = new Decimal(1)
	let exp = new Decimal(1)

	// Multipliers
	// Upgrades
		if (hasUpgrade('j', 12)) mult = mult.mul(upgradeEffect('j', 12))
		if (hasUpgrade('j', 15)) mult = mult.mul(2)
		if (hasUpgrade('j', 33)) mult = mult.mul(upgradeEffect('j', 33))
	
	// Buyables
		if (getBuyableAmount('j', 11).gte(1)) mult = mult.mul(buyableEffect('j', 11))

	// Others
		mult = mult.mul(tmp.a.APEffect1)

	// Exponents
		if (hasUpgrade('j', 32)) exp = exp.add(0.01)
	
	gain = base.mul(mult)
	if (gain.gte(1)) gain = gain.pow(exp)
	return gain
}

function color(text, color, tag='h3') { return `<${tag} style='color:${color};'>${text}</${tag}>` }
function colored(text, color, tag='h3') { return `<${tag} style='color:${color};text-shadow:${color} 0px 0px 10px;'>${text}</${tag}>` }
function superscript(text, color='#fff') {return `<sup style='color:${color}'>${text}</sup>`}
function subscript(text, color='#fff') {return `<sub style='color:${color}'>${text}</sub>`}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	function(){
		return `Current Endgame: <h3 class='growth'>Reach Growth</h3>`
	}
]

// Determines when the game "ends"
function isEndgame() {
	return player.g.unlocked
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