let modInfo = {
	name: "The J Tree: Replanted",
	id: "tjtr",
	author: "realjman",
	pointsName: "J-fragments",
	modFiles: ["layers.js", "tree.js"],

	discordName: "@rjman",
	discordLink: "",
	initialStartPoints: new Decimal (1), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "α0.1",
	name: "Tree Replanting",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>vα0.1</h3><br>
		- The existence of this tree.<br>
		- A reset layer: Forming J.<br>
		> Contains 6 upgrades.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	if (hasUpgrade("j", 11))
		{return true}
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(0.1)
	if (hasUpgrade("j", 23)) gain = new Decimal(0.2)
	if (hasUpgrade("j", 12) && !hasUpgrade("j", 14)) gain = gain.times(2)
	if (hasUpgrade("j", 13)) gain = gain.times(upgradeEffect("j", 13))
	if (hasUpgrade("j", 14)) gain = gain.times(4)
	if (hasUpgrade("j", 22)) gain = gain.times(upgradeEffect("j", 22))
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	function(){
		let text = "Current endgame: TBD"
		return text
	}
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
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