const modInfo = {
	name: 'The Primordial Tree',
	id: 'Yrahcaz7-ModTree-ThePrimordialTree',
	author: 'Yrahcaz7',
	pointsName: 'points',
	modFiles: ['assimilation.js', 'achievements.js', 'softcaps.js', 'story.js', 'tabs.js', 'layers.js', 'technical/tree.js'],
	initialStartPoints: new Decimal(0),
	offlineLimit: 1, // in hours
};

const VERSION = {
	num: '3.5',
	name: 'More Assimilation',
};

const winText = () => {
	return 'You reached ' + format(endPoints) + ' ' + modInfo.pointsName + ' and won the game!<br>However, it isn\'t the end yet...<br>Wait for more updates for further content.';
};

// gets the end of a color tag (no color, dark, or light)
function getdark(darkthis, type, special = false, research = false) {
	if (darkthis.layer !== undefined) {
		if (colorvalue[1] == 'dark') return '-dark">';
		if (colorvalue[1] == 'none') return '-OFF">';
		if (((type == 'title' || type == 'title-hasend') && colorvalue[0][1]) || (type == 'ref' && colorvalue[0][2])) {
			if (research) return '">';
			else {
				if (special) darkcanafford = darkthis.canAfford();
				else darkcanafford = player[darkthis.layer].points.gte(darkthis.cost);
				if ((darkcanafford && !hasUpgrade(darkthis.layer, darkthis.id)) || (type == 'title-hasend' && hasUpgrade(darkthis.layer, darkthis.id))) return '-dark">';
			};
		} else if (type == 'title-light' && colorvalue[0][1]) {
			if (special) darkcanafford = darkthis.canAfford();
			else darkcanafford = player[darkthis.layer].points.gte(darkthis.cost);
			if (darkcanafford && !hasUpgrade(darkthis.layer, darkthis.id)) return '-dark">';
			return '-light">';
		} else if (type == 'title-buyable' && colorvalue[0][1]) {
			if (darkthis.canAfford() && getBuyableAmount(darkthis.layer, darkthis.id)) return '-dark">';
		} else if (type == 'clickable' && colorvalue[0][1]) {
			if (darkthis.canClick()) return '-dark">';
		} else return '-OFF">';
	};
	return '">';
};

// gets the devotion bulk
function getDevotionBulk() {
	let bulk = 1;
	if (challengeCompletions('r', 11) >= 41) bulk *= 10;
	if (hasMilestone('gi', 17)) bulk *= 2;
	if (hasChallenge('ei', 12)) bulk *= 5;
	if (hasMilestone('w', 2)) bulk *= 2;
	if (hasMilestone('w', 15)) bulk *= 5;
	if (hasMilestone('cl', 1) && player.s.no_speed_but_more_bulk) bulk *= 100;
	if (hasMilestone('cl', 2)) bulk *= 2;
	if (hasMilestone('ch', 9)) bulk *= 5;
	if (hasMilestone('ch', 10)) bulk *= 2;
	if (isAssimilated('s') || player.mo.assimilating === 's') bulk *= 10;
	return bulk;
};

// gets the light boost
function getLightBoost() {
	let lightboost = new Decimal(0);
	if (hasMilestone('m', 17)) lightboost = player.r.lightgainbest.mul(0.1);
	else if (hasMilestone('m', 16)) lightboost = player.r.lightgainbest.mul(0.05);
	else if (hasMilestone('m', 15)) lightboost = player.r.lightgainbest.mul(0.025);
	else if (hasMilestone('m', 7)) lightboost = player.r.lightgainbest.mul(0.01);
	else if (hasMilestone('m', 3)) lightboost = player.r.lightgainbest.mul(0.001);
	return lightboost;
};

// gets the light gain
function getLightGain() {
	let gain = getPointGen(true).pow(0.001).div(10);
	if (hasUpgrade('r', 13)) {
		gain = upgradeEffect('r', 13);
	} else {
		if (hasUpgrade('r', 11)) gain = gain.mul(upgradeEffect('r', 11));
		if (hasUpgrade('r', 12)) gain = gain.mul(upgradeEffect('r', 12));
		if (hasBuyable('d', 21)) gain = gain.mul(buyableEffect('d', 21)[1]);
		if (hasMilestone('s', 30)) gain = gain.mul(2);
		if (hasMilestone('s', 41)) gain = gain.mul(3);
		if (hasMilestone('s', 50)) gain = gain.mul(3);
		if (hasMilestone('s', 52)) gain = gain.mul(3);
		if (gain.gt(1e25)) gain = new Decimal(1e25);
	};
	if (player.s.glow_effect.gt(1)) gain = gain.mul(player.s.glow_effect);
	if (hasBuyable('g', 21)) gain = gain.mul(buyableEffect('g', 21)[2]);
	if (new Decimal(tmp.w.effect[2]).gt(1) && !tmp.w.deactivated) gain = gain.mul(tmp.w.effect[2]);
	gain = gain.add(getLightBoost());
	return gain;
};

// removes an achievment
function removeAchievement(id = NaN) {
	for (var i = 0; i < player.A.achievements.length; i++) {
		if (player.A.achievements[i] == id) {
			player.A.achievements.splice(i, 1);
			return true;
		};
	};
	return false;
};

// determines if it should show points/sec
function canGenPoints() {
	return true;
};

// calculates points/sec
function getPointGen(forced = false) {
	// init
	let gain = new Decimal(1);
	// mul
	if (hasUpgrade('e', 11)) gain = gain.mul(1.5);
	if (hasUpgrade('e', 12)) {
		gain = gain.mul(upgradeEffect('e', 12));
		if (hasUpgrade('e', 33)) gain = gain.mul(upgradeEffect('e', 33));
	};
	if (hasUpgrade('e', 21)) {
		gain = gain.mul(upgradeEffect('e', 21));
		if (hasUpgrade('e', 23)) {
			gain = gain.mul(upgradeEffect('e', 23));
			if (hasUpgrade('e', 31)) gain = gain.mul(upgradeEffect('e', 31));
	}};
	if (hasUpgrade('e', 32)) gain = gain.mul(upgradeEffect('e', 32));
	if (hasUpgrade('q', 12)) {
		gain = gain.mul(upgradeEffect('q', 12));
		if (hasUpgrade('q', 13)) gain = gain.mul(upgradeEffect('q', 13));
	};
	if (hasUpgrade('q', 34)) {
		gain = gain.mul(upgradeEffect('q', 34));
		if (hasUpgrade('q', 35)) {
			gain = gain.mul(upgradeEffect('q', 35));
			if (hasUpgrade('q', 41)) gain = gain.mul(upgradeEffect('q', 41));
	}};
	if (hasUpgrade('q', 55)) gain = gain.mul(upgradeEffect('q', 55));
	if (hasUpgrade('h', 11)) {
		gain = gain.mul(upgradeEffect('h', 11));
		if (hasUpgrade('h', 21)) {
			gain = gain.mul(upgradeEffect('h', 21));
			if (hasUpgrade('h', 31)) {
				gain = gain.mul(upgradeEffect('h', 31));
				if (hasUpgrade('h', 41)) gain = gain.mul(upgradeEffect('h', 41));
	}}};
	if (hasUpgrade('h', 73)) gain = gain.mul(upgradeEffect('h', 73));
	if (hasUpgrade('p', 72)) gain = gain.mul(upgradeEffect('p', 72));
	if (hasUpgrade('m', 52)) gain = gain.mul(upgradeEffect('m', 52));
	if (hasBuyable('c', 11)) gain = gain.mul(buyableEffect('c', 11));
	if (hasBuyable('sp', 21)) gain = gain.mul(buyableEffect('sp', 21)[0]);
	if (hasBuyable('sp', 12)) gain = gain.mul(buyableEffect('sp', 12)[1]);
	if (player.p.unlocked && !tmp.p.deactivated) gain = gain.mul(player.p.divinity.add(1).pow(0.1));
	if (hasUpgrade('p', 82)) gain = gain.mul(upgradeEffect('p', 82));
	if (challengeCompletions('r', 11) >= 2) gain = gain.mul(tmp.r.effect[2]);
	if (hasUpgrade('ds', 21) && hasUpgrade('ds', 24)) gain = gain.mul(player.A.points.mul(0.2));
	else gain = gain.mul(player.A.points.mul(0.1).add(1));
	if (inChallenge('ds', 11)) gain = gain.mul(0.0001);
	if (inChallenge('ds', 12)) gain = gain.mul(0.000001);
	if (inChallenge('ds', 21)) gain = gain.mul(0.0000000001);
	if (inChallenge('ds', 22)) gain = gain.mul(0.0000000001);
	if (new Decimal(tmp.w.effect[0]).gt(1) && !tmp.w.deactivated) gain = gain.mul(tmp.w.effect[0]);
	// pow
	if (hasUpgrade('q', 63)) gain = gain.pow(upgradeEffect('q', 63));
	if (challengeCompletions('ch', 11) > 0) gain = gain.pow(challengeEffect('ch', 11));
	if (challengeCompletions('ch', 12) > 0) gain = gain.pow(challengeEffect('ch', 12));
	// special nerf
	if (inChallenge('ds', 32)) gain = gain.add(1).log10().add(1).log10();
	if (inChallenge('r', 11) && !forced) gain = new Decimal(0);
	// softcap
	if (gain.gt(softcaps.points[0])) {
		let excessGain = gain.div(softcaps.points[0]);
		excessGain = excessGain.pow(softcaps.points[1]());
		gain = excessGain.mul(softcaps.points[0]);
	};
	// return
	return gain;
};

// added player[data]
function addedPlayerData() { return {
	nerdMode: false,
}};

// display extra things at the top of the page
const displayThings = [
	() => {if (tmp.gameEnded) return 'You beat the game!<br>For now...'},
];

// determines when the game "ends"
const endPoints = new Decimal('e6e17');

// style for the background, can be a function
const backgroundStyle = {};

// max tick length in seconds
function maxTickLength() {
	return 1;
};

// fixes for old saves
function fixOldSave(oldVersion) {
	// achievement fixes
	if (oldVersion == '2.2' && player.A.achievements.includes('123')) removeAchievement('123');
	if (oldVersion == '3.2' && player.A.achievements.includes('163')) removeAchievement('163');
	// endgame fixes
	if ((oldVersion == '3.4' || oldVersion == '3.4.1') && (player.points.gte('e1.51e14') || player.ch.points.gt(50))) {
		setTimeout(() => {
			doReset('ch', true);
			if (player.ch.points.gt(50) || player.ch.best.gt(50) || player.ch.total.gt(50)) {
				player.ch.points = new Decimal(50);
				player.ch.best = new Decimal(50);
				player.ch.total = new Decimal(50);
			};
		});
	};
	// remove unused vars
	delete player.r.sanctummult;
	delete player.r.essencemult;
};

// glitch text
const validChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ";

function randomChar() {
	return validChars[Math.floor(Math.random() * validChars.length)];
};

function randomStr(length = 1, sameChar = false) {
	if (length > 10000) length = 10000;
	if (length <= 0) return "";
	if (sameChar) return randomChar().repeat(length);
	let result = "";
	for (let index = 0; index < length; index++) {
		result += randomChar();
	};
	return result;
};
