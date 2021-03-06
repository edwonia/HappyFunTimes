/*
 * Copyright 2014, Gregg Tavares.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Gregg Tavares. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF2 LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

"use strict";

var sys = require('sys');
var debug = require('debug')('relayserver');
var Game = require('./game');
var Player = require('./player');
var WSServer = require('./websocketserver');

/**
 * RelayServer options
 * @typedef {Object} RelayServer~Options
 * @property {String} address - address that will
 *         replace "localhost" when a game's controllerUrl is
 *         passed in.
 */

/**
 * Game list entry
 * @typedef {Object} RelayServer~GameEntry
 * @property {String} gameId - id of game
 * @property {Number} numPlayers - number of players currently
 *           connected.
 * @property {String} controllerUrl - url of controller for game
 */

/**
 * The relaysever manages a websocket server. It accepts
 * connections from games and controllers, notifies the game of
 * controllers joining and leaving the game and passes messages
 * between them.
 *
 * @constructor
 * @params {HTTPServer[]} servers. An array of of node
 *       httpservers to run websocket servers. This is an array
 *       because we'd to be able to run multiple servers on
 *       different ports but have the relayserver pass messages
 *       between them.
 * @params {RelayServer~Options} options
 */
var RelayServer = function(servers, options) {

  var g_nextSessionId = 1;
  var g_games = {};
  var g_numGames = 0;

  // --- messages to relay server ---
  //
  // join  :
  //   desc: joins a game
  //   args:
  //      gameId: name of game
  //
  // server:
  //   desc: identifies this session as a server (the machine running the game)
  //   args: none
  //
  // client:
  //   desc: sends a message to a specific client
  //   args:
  //      id:   session id of client
  //      data: object
  //
  // update:
  //   desc: sends an update to the game server (the machine running the game)
  //   args:
  //      anything

  // -- messages to the game server (machine running the game) --
  //
  // update:
  //   desc: updates a player
  //   args:
  //      id: id of player to update
  //      data: data
  //
  // remove:
  //   desc: removes a player
  //   args:
  //      id: id of player to remove.
  //

  var getGame = function(gameId) {
    if (!gameId) {
      console.error("no game id!")
      return;
    }
    var game = g_games[gameId];
    if (!game) {
      game = new Game(gameId, this);
      g_games[gameId] = game;
      ++g_numGames;
      debug("added game: " + gameId + ", num games = " + g_numGames);
    }
    return game;
  }.bind(this);

  /**
   * Gets an array of game currently running.
   * @method
   * @returns {RelayServer~GameEntry[]}
   */
  this.getGames = function() {
    var gameList = [];
    for (var id in g_games) {
      var game = g_games[id];
      if (game.hasClient()) {
        gameList.push({
          gameId: id,
          numPlayers: game.getNumPlayers(),
          controllerUrl: game.controllerUrl,
        });
      }
    }
    return gameList;
  };

  /**
   * Adds the given player to the game
   * @method
   * @param {Player} player the player to add
   * @param {String} gameId id of the game.
   * @returns {Game} game that player was added to
   */
  this.addPlayerToGame = function(player, gameId) {
    var game = getGame(gameId);
    game.addPlayer(player);
    return game;
  }.bind(this);

  /**
   * Removes a game from the games known by this relayserver
   * @method
   * @param {String} gameId id of game to remove.
   */
  this.removeGame = function(gameId) {
    if (!g_games[gameId]) {
      console.error("no game '" + gameId + "' to remove")
      return;
    }
    --g_numGames;
    debug("removed game: " + gameId + ", num games = " + g_numGames);
    delete g_games[gameId];
  }.bind(this);

  /**
   * Assigns a client as the server for a specific game.
   * @method
   * @param {Object} data Data passed from game.
   * @param {Client} client Websocket client object.
   */
  this.assignAsClientForGame = function(data, client) {
    var game = getGame(data.gameId);
    if (data.controllerUrl && options.address) {
      data.controllerUrl = data.controllerUrl.replace("localhost", options.address);
    }
    game.assignClient(client, this, data);
  }.bind(this);

  for (var ii = 0; ii < servers.length; ++ii) {
    var server = servers[ii];
    //var io = new SocketIOServer(server);
    var io = new WSServer(server);

    io.on('connection', function(client){
        new Player(client, this, ++g_nextSessionId);
    }.bind(this));
  }

};

module.exports = RelayServer;

