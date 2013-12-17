var assert = require('assert');
var card = require('./card');

var removeCardFromDeck = function (i, deck) {
    if (i > deck.length-1) {
        throw "Not enough cards in deck to remove card at index " + i + ". Only " + deck.length + " cards in deck."
    }
    var card = deck[i];
    // Shift remaining cards and reduce size of the deck
    for (var j = i; j < deck.length-1; j++) {
        deck[j] = deck[j+1];
    }
    deck.pop();
    return card;
}

var dealRandomCardsFromDeck = function (n, deck) {
    if (n > deck.length) {
        throw "Not enough cards in deck to deal " + n + " cards. Deck only has " + deck.length + " cards.";
    }
    var hand = new Hand(52);
    for (var i = 0; i < n; i++) {
        var j = Math.floor(Math.random() * deck.length);
        var card = removeCardFromDeck(j, deck);
        hand.push(card);
    }
    return hand;
}

var Hand = function (maxSize) {
    this.queue = new Array(maxSize);
    this.head = 0;
    this.end = 0;
    this.length = 0;
}
Hand.prototype.push = function (card) {
    if (this.length < this.queue.length) {
        this.queue[this.end] = card;
        this.length++;
        this.end = (this.end + 1) % this.queue.length
    } else {
        throw "Hand has already reached max size [" + this.length + "]. Cannot push new card to hand."
    }
}
Hand.prototype.shift = function () {
    if (this.length > 0) {
        var card = this.queue[this.head];
        this.length--;
        this.head = (this.head + 1) % this.queue.length;
        return card;
    } else {
        throw "Hand has no cards to return."
    }
}
Hand.prototype.peek = function () {
    if (this.length > 0) {
        var card = this.queue[this.head];
        return card;
    } else {
        throw "Hand has no cards to show."
    }
}

if (process.argv.length == 3) {
    var runs = parseInt(process.argv[2]);
} else {
    var runs = 1;
}

for (var n = 0; n < runs; n++) {
    var deck = card.newDeck();
    var handA = dealRandomCardsFromDeck(26, deck);
    var handB = dealRandomCardsFromDeck(26, deck);
    assert.equal(handA.length, 26);
    assert.equal(handB.length, 26);

    var playerACardsOnTable = new Hand(26);
    var playerBCardsOnTable = new Hand(26);
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
            playerACardsOnTable.push(cardA);
            playerBCardsOnTable.push(cardB);
            faceDown--;
        } else if (handA.peek().value > handB.peek().value) {
    //        console.log("Player A's %s defeats Player B's %s", handA[0], handB[0]);
            stats.battles++;
            if (stats.warCounts[currentWarStreak] == undefined) {
                stats.warCounts[currentWarStreak] = 0;
            }
            stats.warCounts[currentWarStreak]++;
            currentWarStreak = 0;
            for (var j = 0; j < playerACardsOnTable.length; j++) {
                handA.push(playerACardsOnTable.shift());
                handA.push(playerBCardsOnTable.shift());
            }
            handA.push(handA.shift());
            handA.push(handB.shift());
        } else if (handA.peek().value < handB.peek().value) {
    //        console.log("Player A's %s is defeated by Player B's %s", handA[0], handB[0]);
            stats.battles++;
            if (stats.warCounts[currentWarStreak] == undefined) {
                stats.warCounts[currentWarStreak] = 0;
            }
            stats.warCounts[currentWarStreak]++;
            currentWarStreak = 0;
            for (var j = 0; j < playerBCardsOnTable.length; j++) {
                handB.push(playerBCardsOnTable.shift());
                handB.push(playerACardsOnTable.shift());
            }
            handB.push(handB.shift());
            handB.push(handA.shift());
        } else if (handA.peek().value == handB.peek().value) {
    //        console.log("Player A's %s ties Player B's %s", handA[0], handB[0]); 
            stats.battles++;
            currentWarStreak++;
            playerACardsOnTable.push(handA.shift());
            playerBCardsOnTable.push(handB.shift());
            faceDown = 3;
        }
    }
    if (handA.length < 1) {
        stats.winner = "Player B";
    } else if (handB.length < 1) {
        stats.winner = "Player A";
    }
    for (var i = 0; i < stats.warCounts.length; i++) {
        if (stats.warCounts[i] == undefined) {
            stats.warCounts[i] = 0;
        }
    }
    console.log('%j', stats);
}
