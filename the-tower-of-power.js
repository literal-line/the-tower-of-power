// the-tower-of-power by Literal Line
// more at quique.gq

var THE_TOWER_OF_POWER = function () {
  'use strict';

  var canvas = document.createElement('canvas');
  var stage = canvas.getContext('2d');
  var info = {
    version: 'v0.1-xxxxxxxx-xxxest',
    authors: ['Literal Line'],
    width: 224,
    height: 288,
    bg: '#000000',
    aa: false,
    fps: 60.606061 // funny original arcade speed
  };

  var keys = {};
  var initEventListeners = function () {
    var resize = function () {
      canvas.style.height = window.innerHeight + 'px';
      canvas.style.width = window.innerHeight * (7 / 9) + 'px';
      canvas.style.paddingTop = '0';
      if (parseInt(canvas.style.width) > window.innerWidth) {
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerWidth * (9 / 7) + 'px';
        canvas.style.paddingTop = window.innerHeight / 2 - parseInt(canvas.style.height) / 2 + 'px';
      }
    };
    addEventListener('resize', resize);
    addEventListener('orientationchange', resize);
    addEventListener('blur', function () {

    });
    addEventListener('keydown', function (e) {
      keys[e.code] = true;
    });
    addEventListener('keyup', function (e) {
      delete keys[e.code];
    });
    addEventListener('blur', function () {
      for (var a in playing) playing[a].pause();
    });
    addEventListener('focus', function () {
      for (var a in playing) playing[a].play();
    });

    resize();
  };

  var initCanvas = function () {
    canvas.width = info.width;
    canvas.height = info.height;
    canvas.style.background = info.bg;
    canvas.style.display = 'block';
    canvas.style.margin = 'auto';
    canvas.style.imageRendering = info.aa ? 'auto' : 'pixelated';
    canvas.style.imageRendering = info.aa ? 'auto' : '-moz-crisp-edges';
    stage.imageSmoothingEnabled = info.aa;
  };

  var initHelp = function () {
    var helpBtn = document.createElement('button');
    var helpPopup = document.createElement('div');
    helpPopup.innerHTML =
      '<h1>Help</h1>' +
      '<hr style="border: 1px solid #FFFFFF"></hr>' +
      '<h2>Controls</h2>' +
      '<ul>' +
      '<li>Directional: Arrow Keys or WASD</li>' +
      '<li>Attack: Space</li>' +
      '<li>Insert coin: Right shift</li>' +
      '<li>Player 1 start: Enter</li>' +
      '<ul>';
    helpBtn.style = 'background: #000066 url(\'./assets/buttonHelp.png\'); background-size: cover; border: 2px outset #3333FF; position: fixed; width: 52px; height: 52px; bottom: 5px; right: 5px; outline: none; image-rendering: pixelated';
    helpPopup.style = 'background: rgba(0, 0, 0, 0.9); border: 1px solid #FFFFFF; border-radius: 5px; padding: 25px; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 75vw; height: 75vh; color: #FFFFFF';
    helpBtn.classList.add('btn3d');
    helpPopup.classList.add('hidden');
    helpBtn.onclick = function () { helpPopup.classList.toggle('hidden'); this.blur(); };
    document.body.insertAdjacentElement('afterbegin', helpBtn);
    document.body.insertAdjacentElement('afterbegin', helpPopup);
  };

  var init = function () {
    initEventListeners();
    initHelp();
    initCanvas();
    document.body.insertAdjacentElement('afterbegin', canvas);
    console.log('the-tower-of-power ' + info.version);
    console.log('by ' + info.authors);
    setTimeout(function () {
      requestAnimationFrame(game.loop);
      setInterval(function () { assets.audio.silence.play(); }, 1000 / 60);
    }, 500);
  };

  var playing = {};

  var GameAudio = function (src) {
    this.audio = document.createElement('audio');
    this.audio.src = src;
    this.audio.volume = 0.5;
    var self = this;
    this.audio.addEventListener('ended', function () {
      delete playing[self.audio.src];
    });
  };

  GameAudio.prototype.play = function (time) {
    playing[this.audio.src] = this.audio;
    if (typeof time !== 'undefined') {
      this.audio.pause();
      this.audio.currentTime = time;
    }
    this.audio.play();
  };

  GameAudio.prototype.stop = function () {
    this.audio.pause();
    this.audio.currentTime = 0;
    delete playing[this.audio.src];
  };

  CanvasRenderingContext2D.prototype.textChars = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
    'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', ' ', '!', '\'', '*', '-', '.', ':', '='
  ];
  CanvasRenderingContext2D.prototype.drawText = function (obj) {
    var t = obj.text.toString().toUpperCase();
    var c = obj.color % Math.floor(assets.textures.font.height / 24);
    var x = obj.x;
    var y = obj.y;
    for (var i = 0; i < t.length; i++) {
      var char = this.textChars.indexOf(t.charAt(i));
      this.drawImage(assets.textures.font, char % 28 * 8, Math.floor(char / 28) * 8 + c * 24, 8, 8, (x + i) * 8, y * 8, 8, 8);
    }
  };

  var assets = {
    textures: {
      font: createTexture('./assets/font.png'),
      logo: createTexture('./assets/quiquePixel.png'),
      title: createTexture('./assets/title.png'),
      tilesFloor: createTexture('./assets/tilesFloor.png')
    },
    audio: {
      silence: new GameAudio('assets/5-seconds-of-silence.mp3'),
      jingle: new GameAudio('./assets/jingle.mp3'),
      insertCredit: new GameAudio('./assets/insertCredit.mp3'),
      roundStart: new GameAudio('./assets/roundStart.mp3'),
      roundPlay: new GameAudio('./assets/roundPlay.mp3')
    }
  };

  var game = (function () {
    var STATE = 'init';
    var currentFloor = 1;
    var lives = 3;
    var timer = 0;

    var highscores = [
      { score: 86434, floor: 99, name: 'chad' },
      { score: 81956, floor: 96, name: 'm.2' },
      { score: 47521, floor: 69, name: 'nice' },
      { score: 31184, floor: 42, name: 'weed' },
      { score: 0, floor: 0, name: 'lol' }
    ];

    var init = (function () {
      var lCanvas = document.createElement('canvas');
      var lStage = lCanvas.getContext('2d');
      lCanvas.width = info.width;
      lCanvas.height = info.height;
      var num = 0;
      var numLimit = 15;
      var interval = 3;

      return function () {
        if (!(timer % interval) && num <= numLimit) {
          for (var y = 0; y < lCanvas.height / 8; y++) lStage.drawText({ text: repeatChar(num.toString(16), Math.floor(canvas.width / 8)), color: num, x: 0, y: y });
          num++;
        }
        if (timer >= numLimit * interval + 60) STATE = 'intro';
        stage.drawImage(lCanvas, 0, 0);
      }
    })();

    var intro = (function () {
      var lCanvas = document.createElement('canvas');
      var lStage = lCanvas.getContext('2d');
      lCanvas.width = info.width;
      lCanvas.height = info.height;
      var logo = assets.textures.logo;
      var frame = 0;
      var opacity = 0;

      var drawLogo = function () {
        lStage.globalAlpha = opacity;
        lStage.clearRect(0, 0, lCanvas.width, lCanvas.height);
        lStage.drawImage(logo, lCanvas.width / 2 - logo.width / 2, lCanvas.height / 2 - logo.height / 2);
      };

      var doTiming = function () {
        if (frame === 0) assets.audio.jingle.play();
        if (frame > 0 && frame <= 30) opacity += 1 / 30;
        if (frame > 120 && frame <= 150) opacity -= 1 / 30;
        frame++;
        if (frame > 240) {
          frame = 0;
          opacity = 1;
          STATE = 'title';
        }
      };

      return function () {
        drawLogo();
        doTiming();
        stage.drawImage(lCanvas, 0, 0);
      }
    })();

    var pointsOverlay = (function () {
      var lCanvas = document.createElement('canvas');
      var lStage = lCanvas.getContext('2d');
      lCanvas.width = 160;
      lCanvas.height = 16;
      var lastTopScore = 0;

      var update = function () {
        lStage.drawText({ text: '1up', color: 3, x: 0, y: 0 });
        lStage.drawText({ text: 'high score', color: 11, x: 6, y: 0 });
        lStage.drawText({ text: lastTopScore, color: 9, x: 9, y: 1 });
      };

      return function () {
        var topScore = highscores[0].score;
        if (topScore !== lastTopScore) {
          lastTopScore = topScore;
          update();
        }
        stage.drawImage(lCanvas, 24, 0);
      }
    })();

    var title = (function () {
      var lCanvas = document.createElement('canvas');
      var lStage = lCanvas.getContext('2d');
      lCanvas.width = info.width * 2;
      lCanvas.height = info.height;
      var title = assets.textures.title;
      var lTimer = 0;
      var scrollX = -info.width;
      var showHighscores = false;
      var credits = 0;

      var drawMain = function () {
        lStage.drawImage(title, lCanvas.width * 0.75 - title.width / 2, 32);
        lStage.drawText({ text: 'created by literal line', color: 0, x: 30, y: 25 });
        lStage.drawText({ text: 'licensed under', color: 0, x: 35, y: 27 });
        lStage.drawText({ text: 'the gnu gpl v3', color: 0, x: 35, y: 28 });
        lStage.drawText({ text: 'more at quique.gq', color: 3, x: 33, y: 32 });
      };

      var drawStory = function () {
        lStage.drawText({ text: 'in another time', color: 10, x: 3, y: 4 });
        lStage.drawText({ text: 'in another world...', color: 10, x: 6, y: 6 });
        lStage.drawText({ text: 'the blue power staff', color: 10, x: 0, y: 9 });
        lStage.drawText({ text: 'kept the kingdom in peace', color: 10, x: 3, y: 11 });
        lStage.drawText({ text: 'but the evil demon cabrakan', color: 10, x: 0, y: 14 });
        lStage.drawText({ text: 'stole the staff and', color: 10, x: 3, y: 16 });
        lStage.drawText({ text: 'imprisoned the maiden', color: 10, x: 6, y: 18 });
        lStage.drawText({ text: 'Akna in a tower', color: 10, x: 9, y: 20 });
        lStage.drawText({ text: 'the prince Tadeas', color: 10, x: 0, y: 23 });
        lStage.drawText({ text: 'wore golden armor', color: 10, x: 2, y: 25 });
        lStage.drawText({ text: 'and dueled monsters', color: 10, x: 4, y: 27 });
        lStage.drawText({ text: 'to save Akna in', color: 10, x: 6, y: 29 });
        lStage.drawText({ text: 'the tower of power', color: 19, x: 8, y: 31 });
      };

      var drawHighscores = function () {
        lStage.clearRect(0, 0, lCanvas.width / 2, lCanvas.height);
        lStage.drawText({ text: 'the tower of', color: 9, x: 7, y: 5 });
        lStage.drawText({ text: 'power', color: 9, x: 11, y: 7 });
        lStage.drawText({ text: 'best 5', color: 3, x: 10, y: 12 });
        lStage.drawText({ text: 'rank  score floor  name', color: 0, x: 2, y: 16 });
        var i = 0;
        highscores.forEach(function (cur) {
          i++;
          var y = 17 + i * 2;
          lStage.drawText({ text: i + '    ' + cur.score, color: 0, x: 3, y: y });
          lStage.drawText({ text: cur.floor, color: 0, x: 17, y: y });
          lStage.drawText({ text: cur.name, color: 0, x: 21, y: y });
        });
      };

      var doCredits = (function () {
        var shift = false;

        return function () {
          if (keys['Enter'] && credits) STATE = 'stage';
          if (keys['ShiftRight'] && !shift) {
            lStage.clearRect(lCanvas.width / 2, 200, 224, 88);
            lStage.drawText({ text: 'push start button', color: 0, x: 34, y: 28 });
            lStage.drawText({ text: 'only one player', color: 0, x: 35, y: 30 });
            credits++
            assets.audio.insertCredit.play(0);
            shift = true;
          }
          if (!keys['ShiftRight']) shift = false;
          if (credits > 99) credits = 99;
          stage.drawText({ text: 'credit' + repeatChar(' ', 3 - credits.toString().length) + credits, color: 0, x: 19, y: 35 });
        }
      })();

      var doTiming = function (time1, time2) {
        var w = lCanvas.width / 2;
        if (credits) {
          scrollX = -w;
          return;
        }
        var event1 = time1 * 60;
        var event1End = event1 + w;
        var event2 = event1End + time2 * 60;
        var event2End = event2 + w;
        if (lTimer === event1) {
          lStage.clearRect(0, 0, w, lCanvas.height);
          if (showHighscores) drawHighscores(); else drawStory();
          showHighscores = !showHighscores;
        }
        if (lTimer > event1 && lTimer <= event1End) scrollX = -w + lTimer - event1;
        if (lTimer > event2 && lTimer <= event2End) scrollX = -lTimer + event2;
        lTimer++;
        if (lTimer > event2End) lTimer = 0;
      };

      drawMain();

      return function () {
        doCredits();
        doTiming(5, 10);
        stage.drawImage(lCanvas, scrollX, 0);
      }
    })();

    var playStage = (function () {
      var lCanvas = document.createElement('canvas');
      var pCanvas = document.createElement('canvas');
      var lStage = lCanvas.getContext('2d');
      var pStage = pCanvas.getContext('2d');
      lCanvas.width = pCanvas.width = info.width * 2 + 16;
      lCanvas.height = pCanvas.height = info.height;
      var tilesFloor = assets.textures.tilesFloor;
      var tilesWidth = 58;
      var tilesHeight = 32;
      var scrollX = 0;
      var player = {
        x: 0,
        y: 0,
        w: 8,
        h: 8,
        speed: 1,
        lastH: '',
        lastV: ''
      };
      var lTimer = 0;
      var lastFloor = 0;
      var floors;
      requestText('./floors.json', function (json) { floors = JSON.parse(json).floors; });

      var intro = function (floor) {
        lStage.clearRect(0, 0, lCanvas.width, lCanvas.height);
        assets.audio.insertCredit.stop();
        assets.audio.roundStart.play();
        lStage.drawText({ text: 'get ready', color: 11, x: 9, y: 13 });
        lStage.drawText({ text: 'player one', color: 11, x: 9, y: 15 });
        lStage.drawText({ text: 'floor', color: 11, x: 11, y: 18 });
        lStage.drawText({ text: floor, color: 9, x: 14 - (floor.toString().length - 1), y: 20 });
      };

      var init = function (floor) {
        lStage.clearRect(0, 0, lCanvas.width, lCanvas.height);
        player.x = 76;
        player.y = 76;
        for (var y = 0; y < tilesHeight; y++) {
          for (var x = 0; x < tilesWidth; x++) {
            var tileCur = parseInt(convertBase(floors[floor.toString()][y].charAt(x), 64, 10));
            if (tileCur) lStage.drawImage(tilesFloor, (tileCur - 1) % 9 * 8, Math.floor((tileCur - 1) / 9) * 8, 8, 8, x * 8, (y + 2) * 8, 8, 8);
          }
        }
      };

      var controls = function () {
        var collision = function (x, y) {
          return floors[currentFloor.toString()][Math.floor((y - 16) / 8)].charAt(Math.floor(x / 8)) !== 'j';
        };

        var boxCollision = function (offsX, offsY) {
          var x = player.x + offsX;
          var y = player.y + offsY;
          var w = player.w;
          var h = player.h;
          var points = [
            collision(x, y - h / 2), // top-mid
            collision(x, y + h / 2 - 1), // bottom-mid
            collision(x + w / 2 - 1, y), // right-mid
            collision(x - w / 2, y), // left-mid
            collision(x - w / 2, y - h / 2), // top-left
            collision(x + w / 2 - 1, y - h / 2), // top-right
            collision(x - w / 2, y + h / 2 - 1), // bottom-left
            collision(x + w / 2 - 1, y + h / 2 - 1) // bottom-right
          ];
          return points.some(function (cur) { return cur ? true : false; });
        };

        var cols = 0;
        var move = function (dir) {
          var s = player.speed;
          switch (dir) {
            case 'up':
              player.lastV = 'up';
              if (boxCollision(0, -s)) {
                cols++;
                if (cols < 3) move(player.lastH);
              } else player.y -= s;
              break;
            case 'down':
              player.lastV = 'down';
              if (boxCollision(0, s)) {
                cols++;
                if (cols < 3) move(player.lastH);
              } else player.y += s;
              break;
            case 'right':
              player.lastH = 'right';
              if (boxCollision(s, 0)) {
                cols++;
                if (cols < 3) move(player.lastV);
              } else player.x += s;
              break;
            case 'left':
              player.lastH = 'left';
              if (boxCollision(-s, 0)) {
                cols++;
                if (cols < 3) move(player.lastV);
              } else player.x -= s;
              break;
          }
        };

        var dir = keys['KeyW'] ? 'up' : keys['KeyS'] ? 'down' : keys['KeyD'] ? 'right' : keys['KeyA'] ? 'left' : 0;
        move(dir);
      };

      var playerDraw = function () {
        pStage.fillStyle = '#000000';
        pStage.fillRect(player.x - player.w, player.y - player.h, player.w * 2, player.h * 2);
      };

      var play = function () {
        var edge1 = info.width / 2;
        var edge2 = info.width * 1.5 + 16;
        if (player.x < edge1) scrollX = 0;
        if (player.x >= edge1 && player.x <= edge2) scrollX = edge1 - player.x;
        if (player.x > edge2) scrollX = edge1 - edge2;
        pStage.clearRect(player.x - player.w * 2, player.y - player.h * 2, player.w * 4, player.h * 4);
        controls();
        playerDraw();
        assets.audio.roundPlay.play();
      };

      var doTiming = function (floor) {
        if (!lTimer) intro(floor);
        if (lTimer === 209) init(floor);
        if (lTimer > 389) play();
        lTimer++;
      };

      return function (floor) {
        if (floor !== lastFloor) {
          lastFloor = floor;
          lTimer = 0;
        }
        doTiming(floor);
        stage.drawImage(lCanvas, scrollX, 0);
        stage.drawImage(pCanvas, scrollX, 0);
      }
    })();

    var delta = 0;
    var then = 0;
    var interval = 1000 / info.fps;

    return {
      loop: function (now) {
        if (!then) then = now;
        requestAnimationFrame(game.loop);
        delta = now - then;

        if (delta > interval) {
          stage.clearRect(0, 0, canvas.width, canvas.height);
          switch (STATE) {
            case 'init':
              init();
              break;
            case 'intro':
              intro();
              break;
            case 'title':
              title();
              pointsOverlay();
              break;
            case 'stage':
              playStage(currentFloor);
              pointsOverlay();
              break;
            default:
              throw ('Error: requested state does not exist!');
          }
          timer++;
          then = now - (delta % interval);
        }
      }
    }
  })();

  init();
};

var THE_TOWER_OF_POWER_CTB = function () {
  var initCSS = function () {
    var style = document.styleSheets[0];
    style.insertRule('@font-face { font-family: "Arcade"; src: url(\'./assets/arcade_n.ttf\'); }');
    style.insertRule('body { margin: 0; }');
    style.insertRule('div { font-family: "Arcade"; font-size: 16px; }');
    style.insertRule('h1, h2 { padding: 10px; margin: 0; }');
    style.insertRule('ul { padding-left: 40px; }');
    style.insertRule('li { padding: 2px; }');
    style.insertRule('div, button { -webkit-user-select: none; -moz-user-select: none; user-select: none; user-select: none; }');
    style.insertRule('.btn3d:active { border-style: inset !important; }');
    style.insertRule('.hidden { display: none; }');
  };

  var btn = document.createElement('button');
  btn.style = 'padding: 10px; border: 1px solid #FFFFFF; border-radius: 3px; background: #000000; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); outline: none; font-family: "Courier New"; font-size: 3vw; color: #FFFFFF';
  btn.innerHTML = 'Click to begin';
  btn.onclick = function () { THE_TOWER_OF_POWER(); btn.remove(); };
  initCSS();
  document.body.appendChild(btn);
};

// misc functions

function rndInt(max) {
  return Math.floor(Math.random() * max);
}

function repeatChar(char, amt) {
  return new Array(amt + 1).join(char);
}

function requestText(url, callback) {
  var r = new XMLHttpRequest();
  r.open('GET', url);
  r.onload = function () { callback(r.responseText); };
  r.send();
};

function createTexture(src) {
  var img = document.createElement('img');
  img.src = src;
  return img;
}

function convertBase(value, fromBase, toBase) {
  var range = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/'.split('');
  var fromRange = range.slice(0, fromBase);
  var toRange = range.slice(0, toBase);

  var decValue = value.split('').reverse().reduce(function (carry, digit, index) {
    if (fromRange.indexOf(digit) === -1) throw new Error('Invalid digit `' + digit + '` for base ' + fromBase + '.');
    return carry += fromRange.indexOf(digit) * (Math.pow(fromBase, index));
  }, 0);

  var newValue = '';
  while (decValue > 0) {
    newValue = toRange[decValue % toBase] + newValue;
    decValue = (decValue - (decValue % toBase)) / toBase;
  }
  return newValue || '0';
}
