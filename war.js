var assert = require('assert');
var card = require('./card');

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
Hand.prototype.clear = function () {
    this.head = 0;
    this.end = 0;
    this.length = 0;
}

var shuffle = function (deck) {
    for (var j = 0; j < deck.length; j++) {
        var k = Math.floor(Math.random() * (deck.length-j)) + j;
        var temp = deck[j];
        deck[j] = deck[k];
        deck[k] = temp;
    }
    return deck;
}

var dealHands = function (hands, deck) {
    for (var i = 0; i < deck.length; i++) {
        hands[i%hands.length].push(deck[i]);
    }
    return hands;
}

var gameHands = [new Hand(52), new Hand(52)];
var simulateMatch = function () {
    var start = process.hrtime();
    var deck = card.newDeck();
    gameHands = dealHands(gameHands, shuffle(deck));
    var handA = gameHands[0];
    var handB = gameHands[1];
    assert.equal(handA.length, 26);
    assert.equal(handB.length, 26);

    var playerACardsOnTable = new Hand(26);
    var playerBCardsOnTable = new Hand(26);
    var stats = {
        battles : 0,
        warCounts : []
    };
    var currentWarStreak = 0;
    while (handA.length >= 1 && handB.length >= 1) {
        if (handA.peek().value > handB.peek().value) {
//            console.log("Player A's %s defeats Player B's %s", handA[0], handB[0]);
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
//            console.log("Player A's %s is defeated by Player B's %s", handA[0], handB[0]);
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
//            console.log("Player A's %s ties Player B's %s", handA[0], handB[0]); 
            stats.battles++;
            currentWarStreak++;
            playerACardsOnTable.push(handA.shift());
            playerBCardsOnTable.push(handB.shift());
            for (var j = 0; j < 3 && handA.length >= 1 && handB.length >= 1; j++) {
                var cardA = handA.shift();
                var cardB = handB.shift();
//              console.log("Player A submits %s face down on the table. Player B submits %s face down on the table.", cardA, cardB);
                playerACardsOnTable.push(cardA);
                playerBCardsOnTable.push(cardB);
            }
        }
    }
    if (handA.length < 1) {
        stats.winner = "Player B";
    } else if (handB.length < 1) {
        stats.winner = "Player A";
    }
    handA.clear();
    handB.clear();
    for (var i = 0; i < stats.warCounts.length; i++) {
        if (stats.warCounts[i] == undefined) {
            stats.warCounts[i] = 0;
        }
    }
    var duration = process.hrtime(start);
    stats.timeInNanos = duration[0] * 1000000000 + duration[1];
    return stats;
}

if (process.argv.length == 3) {
    var runs = parseInt(process.argv[2]);
} else {
    var runs = 1;
}

for (var n = 0; n < runs; n++) {
    console.log('%j', simulateMatch());
}
