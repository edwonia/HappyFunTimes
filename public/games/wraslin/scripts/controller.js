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
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
"use strict";

// Require will call this with input and GameClient once input.js and gameclient.js have loaded
var main = function(
    PixiDummy,
    GameClient,
    HandJS,
    ExampleUI,
    Input,
    Misc,
    MobileHacks) {

  var globals = {
    debug: false,
  };
  Misc.applyUrlSettings(globals);
  MobileHacks.fixHeightHack();

  var client = new GameClient({
    gameId: "wraslin",
  });

  // sets up the standard HappyFunTimes Settings thing
  ExampleUI.setupStandardControllerUI(client, globals);

  ///////////////// PIXI BEGIN /////////////////////
  // create an new instance of a pixi stage
  var stage = new PIXI.Stage(0x66FF99);

  stage.interactive = true;

  // create a renderer instance
  var renderer = PIXI.autoDetectRenderer(400, 300);

  // add the renderer view element to the DOM
  document.getElementById("controller").appendChild(renderer.view);

  requestAnimFrame(animate);

  // create a texture from an image path
  var bunnyTex = PIXI.Texture.fromImage("bunny.png");
  var bunnyDownTex = PIXI.Texture.fromImage("bunny-down.png");

  // create a new Sprite using the texture
  var bunny = new PIXI.Sprite(bunnyTex);

  // enable button
  bunny.buttonMode=true;
  bunny.interactive = true;
  // is the tile selected?
  bunny.isSelected=false;

  // touch event handlers
  bunny.mousedown = bunny.touchstart = function(data) {

      this.setTexture(bunnyDownTex);

      client.sendCmd('clicked', { down: true});
  };

  bunny.mouseup = bunny.touchend = bunny.mouseupoutside = bunny.touchendoutside = function(data) {

    this.setTexture(bunnyTex);
    client.sendCmd('unclicked', { down: true});
  
  };

  // center the sprites anchor point
  bunny.anchor.x = 0.5;
  bunny.anchor.y = 0.5;

  // move the sprite t the center of the screen
  bunny.position.x = 200;
  bunny.position.y = 150;
  bunny.height = 100;
  bunny.width = 100;

  stage.addChild(bunny);


  // create a renderer instance
  renderer.view.style.position = "absolute"
  renderer.view.style.width = window.innerWidth + "px";
  renderer.view.style.height = window.innerHeight + "px";
  renderer.view.style.display = "block";

  function animate() {
      // just for fun, let's rotate mr rabbit a little
      // bunny.rotation += 0.01;

      // render the stage
      renderer.render(stage);

      requestAnimFrame(animate);
  }

    ///////////////// PIXI END /////////////////////


};

// Start the main app logic.
requirejs(
  [ './bin/pixi.dev.js',
    '../../../scripts/gameclient',
    '../../../examples/scripts/3rdparty/handjs/hand-1.3.7',
    '../../../examples/scripts/exampleui',
    '../../../examples/scripts/input',
    '../../../examples/scripts/misc',
    '../../../examples/scripts/mobilehacks',
  ],
  main
);


