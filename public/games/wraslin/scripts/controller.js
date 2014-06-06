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

  var dPadSize = 75;

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

  var arrowTex = PIXI.Texture.fromImage("assets/arrow.png");
  var arrowDownTex = PIXI.Texture.fromImage("assets/arrow-down.png");
  var buttonTex = PIXI.Texture.fromImage("assets/circle.png");
  var buttonDownTex = PIXI.Texture.fromImage("assets/circle-down.png");

  // create a new Sprite using the texture
  var arrows = new Array();

  for (var i=0;i<4;i++) {
    arrows[i] = new PIXI.Sprite(arrowTex);
    arrows[i].buttonMode=true;
    arrows[i].interactive=true;
    arrows[i].isSelected=false;
    arrows[i].anchor.x = 0.5;
    arrows[i].anchor.y = 0.5;
    arrows[i].position.x = 100;
    arrows[i].position.y = 170;
    arrows[i].height = 75;
    arrows[i].width = 75;
    stage.addChild(arrows[i]);
  }

  var button = new PIXI.Sprite(buttonTex);
  button.buttonMode=true;
  button.interactive=true;
  button.isSelected=false;
  button.anchor.x = 0.5;
  button.anchor.y = 0.5;
  button.position.x = 325;
  button.position.y = 170;
  button.height = 150;
  button.width = 120;
  stage.addChild(button);

  arrows[0].position.x -= dPadSize;
  arrows[0].rotation = Math.PI/2;
  arrows[1].position.x += dPadSize;
  arrows[1].rotation = Math.PI*1.5;
  arrows[2].position.y += dPadSize;
  arrows[2].rotation = 0;
  arrows[3].position.y -= dPadSize;
  arrows[3].rotation = Math.PI;


  // TOUCH EVENT HANDLERS

  // LEFT ARROW
  arrows[0].mousedown = arrows[0].touchstart = function(data) {
    this.setTexture(arrowDownTex);
  }

  arrows[0].mouseup = arrows[0].touchend = arrows[0].mouseupoutside = arrows[0].touchendoutside = 
  arrows[0].mouseout = function(data) {
    this.setTexture(arrowTex);
    // client.sendCmd('unclicked', { down: true});
  };

  // RIGHT ARROW
  arrows[1].mousedown = arrows[1].touchstart = function(data) {
    this.setTexture(arrowDownTex);
  }

  arrows[1].mouseup = arrows[1].touchend = arrows[1].mouseupoutside = arrows[1].touchendoutside = 
  arrows[1].mouseout = function(data) {
    this.setTexture(arrowTex);
    // client.sendCmd('unclicked', { down: true});
  };

  // DOWN ARROW
  arrows[2].mousedown = arrows[2].touchstart = function(data) {
    this.setTexture(arrowDownTex);
  }

  arrows[2].mouseup = arrows[2].touchend = arrows[2].mouseupoutside = arrows[2].touchendoutside = 
  arrows[2].mouseout = function(data) {
    this.setTexture(arrowTex);
    // client.sendCmd('unclicked', { down: true});
  };

  // UP ARROW
  arrows[3].mousedown = arrows[3].touchstart = function(data) {
    this.setTexture(arrowDownTex);
  }

  arrows[3].mouseup = arrows[3].touchend = arrows[3].mouseupoutside = arrows[3].touchendoutside = 
  arrows[3].mouseout = function(data) {
    this.setTexture(arrowTex);
    // client.sendCmd('unclicked', { down: true});
  };

  // BUTTON
  button.mousedown = button.touchstart = function(data) {
    this.setTexture(buttonDownTex);
  }

  button.mouseup = button.touchend = button.mouseupoutside = button.touchendoutside = 
  button.mouseout = function(data) {
    this.setTexture(buttonTex);
    // client.sendCmd('unclicked', { down: true});
  };

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


