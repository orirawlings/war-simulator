war-simulator
=============

Simulator for the card game War http://en.wikipedia.org/wiki/War_(card_game)

To simulate a random game of War simply execute:

    node war.js
  
This will output a JSON document describing statistic information about the game.

To simulate many games simply pass a command line argument:

    node war.js 1000
  
This will output a JSON document for each of 1000 random games. This output can then be aggregated for further analyses.
