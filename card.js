var assert = require('assert');

var suits = new Array('clubs', 'diamonds', 'hearts', 'spades');
var values = {};
values[2] = 'two';
values[3] = 'three';
values[4] = 'four';
values[5] = 'five';
values[6] = 'six';
values[7] = 'seven';
values[8] = 'eight';
values[9] = 'nine';
values[10] = 'ten';
values[11] = 'jack';
values[12] = 'queen';
values[13] = 'king';
values[14] = 'ace';

var Card = function (value, suit) {
    if (values[value] == undefined ) {
        throw "invalid card value [" + value + "]. Must be in " + Object.keys(values)
    }
    if (!suits.some(function (s) { return s === suit; })) {
        throw "invalid card suit [" + suit + "]. Must be in " + suits;
    }
    this.value = Number(value);
    this.suit = suit;
    this.toString = function () {
        return values[this.value] + ' of ' + this.suit;
    }
};

var newDeck = function () {
    var result = [];
    for (var s in suits) {
        for (var v in values) {
            result.push(new Card(v, suits[s]));
        }
    }
    return result;
};

var testCard = new Card(5, 'clubs');
assert.equal(testCard.value, 5)
assert.equal(testCard.suit, 'clubs');
assert.equal(testCard.toString(), 'five of clubs');
assert.throws(function() { new Card(0, 'diamonds')}, function (err) { return err === 'invalid card value [0]. Must be in 2,3,4,5,6,7,8,9,10,11,12,13,14'; });
assert.throws(function() { new Card(6, 'foobar')}, function (err) { return err === "invalid card suit [foobar]. Must be in clubs,diamonds,hearts,spades"; });
var deck = newDeck();
assert.equal(deck.length, 52)

module.exports.Card = Card;
module.exports.newDeck = newDeck;
