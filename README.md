war-simulator
=============

Simulator for the card game War

To simulate a random game of War simply execute:

    node war.js
  
This will output a JSON document describing statistic information about the game.

To simulate many games use the collectData.sh script:

    ./collectData.js 1000
  
This will output a JSON document for each of 1000 random games. This output can then be aggregated for further analyses.
