var assert = require('assert');
var card = require('./card');

var removeCardFromHand = function (i, hand) {
    if (i > hand.length-1) {
        throw "Not enough cards in hand to remove card at index " + i + ". Only " + hand.length + " cards in hand."
    }
    var card = hand[i];
    // Shift remaining cards and reduce size of the hand
    for (var j = i; j < hand.length-1; j++) {
        hand[j] = hand[j+1];
    }
    hand.pop();
    return card;
}

var dealRandomCardsFromDeck = function (n, deck) {
    if (n > deck.length) {
        throw "Not enough cards in deck to deal " + n + " cards. Deck only has " + deck.length + " cards.";
    }
    var hand = [];
    for (var i = 0; i < n; i++) {
        var j = Math.floor(Math.random() * deck.length);
        var card = removeCardFromHand(j, deck);
        hand.push(card);
    }
    return hand;
}

var deck = card.newDeck();

var handA = dealRandomCardsFromDeck(26, deck);
var handB = dealRandomCardsFromDeck(26, deck);

assert.equal(handA.length, 26);
assert.equal(handB.length, 26);

var table = [];
var faceDown = 0;
var stats = {
    battles : 0,
    warCounts : []
};
var currentWarStreak = 0;
while (handA.length >= 1 && handB.length >= 1) {
    if (faceDown > 0) {
        var cardA = handA.shift();
        var cardB = handB.shift();
//        console.log("Player A submits %s face down on the table. Player B submits %s face down on the table.", cardA, cardB);
        table.push(cardA);
        table.push(cardB);
        faceDown--;
    } else if (handA[0].value > handB[0].value) {
//        console.log("Player A's %s defeats Player B's %s", handA[0], handB[0]);
        stats.battles++;
        if (stats.warCounts[currentWarStreak] == undefined) {
            stats.warCounts[currentWarStreak] = 0;
        }
        stats.warCounts[currentWarStreak]++;
        currentWarStreak = 0;
        for (var j = 0; j < table.length; j++) {
            handA.push(table.shift());
        }
        handA.push(handA.shift());
        handA.push(handB.shift());
    } else if (handA[0].value < handB[0].value) {
//        console.log("Player A's %s is defeated by Player B's %s", handA[0], handB[0]);
        stats.battles++;
        if (stats.warCounts[currentWarStreak] == undefined) {
            stats.warCounts[currentWarStreak] = 0;
        }
        stats.warCounts[currentWarStreak]++;
        currentWarStreak = 0;
        for (var j = 0; j < table.length; j++) {
            handB.push(table.shift());
        }
        handB.push(handB.shift());
        handB.push(handA.shift());
    } else if (handA[0].value == handB[0].value) {
//        console.log("Player A's %s ties Player B's %s", handA[0], handB[0]); 
        stats.battles++;
        currentWarStreak++;
        table.push(handA.shift());
        table.push(handB.shift());
        faceDown = 3;
    }
}
if (handA.length < 1) {
    stats.winner = "Player B";
} else if (handB.length < 1) {
    stats.winner = "Player A";
}
console.log('%j', stats);
