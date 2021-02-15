// the-tower-of-power by Literal Line
// more at quique.gq

var THE_TOWER_OF_POWER = (function () {
  'use strict';

  var canvas = document.createElement('canvas');
  var stage = canvas.getContext('2d');
  var info = {
    version: 'v0.1-xxxxxxxx-xxxest',
    authors: 'Literal Line',
    width: 224,
    height: 288,
    bg: '#000000',
    aa: false
  };

  var keys = {};
  var initEventListeners = function () {
    var resize = function () {
      canvas.style.height = window.innerHeight + 'px';
      canvas.style.width = window.innerHeight * (7 / 9) + 'px';
      if (canvas.style.width.split('p')[0] > window.innerWidth) {
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerWidth * (9 / 7) + 'px';
      }
    };
    addEventListener('resize', resize);
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

  var init = function () {
    initCanvas();
    initEventListeners();
    document.body.appendChild(canvas);
    console.log('the-tower-of-power');
    console.log('by ' + info.authors);
    setTimeout(function () {
      requestAnimationFrame(game.loop);
    }, 1000);
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
    if (time) {
      this.audio.pause();
      this.audio.currentTime = time;
    }
    this.audio.play();
  };

  CanvasRenderingContext2D.prototype.textChars = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
    'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', ' ', '!', '\'', '*', '-', '.', ':', '='
  ];
  CanvasRenderingContext2D.prototype.drawText = function (obj) {
    var t = obj.text.toUpperCase();
    var c = obj.color;
    var x = obj.x;
    var y = obj.y;
    for (var i = 0; i < t.length; i++) {
      var char = this.textChars.indexOf(t.charAt(i));
      this.drawImage(assets.textures.font, char % 28 * 8, Math.floor(char / 28) * 8 + c * 24, 8, 8, (x + i) * 8, y * 8, 8, 8);
    }
  };

  var assets = {
    textures: {
      font: newImage('./assets/font.png'),
      logo: newImage('./assets/quiquePixel.png')
    },
    audio: {
      silence: new GameAudio('assets/5-seconds-of-silence.mp3'),
      jingle: new GameAudio('./assets/jingle.mp3'),
      insertCredit: new GameAudio('./assets/insert_credit.mp3')
    }
  };

  var game = (function () {
    var STATE = 'init';
    var timer = 0;

    var highScores = [
      { score: 123456, floor: 99, name: 'bruh' }
    ];

    var init = (function () {
      var iCanvas = document.createElement('canvas');
      var iStage = iCanvas.getContext('2d');
      var number = 0;
      iCanvas.width = info.width;
      iCanvas.height = info.height;

      return function () {
        if (!((timer + 2) % 2) && number < 8) {
          for (var y = 0; y < iCanvas.height / 8; y++) iStage.drawText({ text: repeatChar(number, Math.floor(canvas.width / 8)), color: number, x: 0, y: y });
          number++;
        }
        if (timer >= 60) STATE = 'intro';
        stage.drawImage(iCanvas, 0, 0);
      }
    })();

    var intro = (function () {
      var frame = 0;
      var opacity = 1;
      var logo = assets.textures.logo;

      return function () {
        stage.drawImage(logo, canvas.width / 2 - logo.width / 2, canvas.height / 2 - logo.height / 2);
        stage.fillStyle = 'rgba(0, 0, 0, ' + opacity + ')';
        stage.fillRect(0, 0, canvas.width, canvas.height);
        if (frame === 0) assets.audio.jingle.play();
        if (frame > 0 && frame <= 30) opacity -= 1 / 30;
        if (frame > 120 && frame <= 150) opacity += 1 / 30;
        frame++;
        if (frame > 240) {
          frame = 0;
          opacity = 1;
          STATE = 'title';
        }
      }
    })();

    var pointsOverlay = function () {
      stage.drawText({ text: '1up', color: 0, x: 3, y: 0 });
      stage.drawText({ text: 'high score', color: 3, x: 9, y: 0 });
    };

    var title = (function () {
      var tCanvas = document.createElement('canvas');
      var tStage = tCanvas.getContext('2d');
      var xOffset = -info.width;
      var credits = 0;
      var enter = false;
      tCanvas.width = info.width * 2;
      tCanvas.height = info.height;

      tStage.drawText({ text: 'the tower of', color: 2, x: 7, y: 5 });
      tStage.drawText({ text: 'power', color: 2, x: 11, y: 7 });

      return function () {
        stage.drawImage(tCanvas, xOffset, 0);
        stage.drawText({ text: 'credit' + repeatChar(' ', 3 - credits.toString().length) + credits, color: 7, x: 19, y: 35 });
        if (xOffset < 0) xOffset++;
        if (keys['Enter'] && !enter) {
          credits++
          assets.audio.insertCredit.play(0.1);
          enter = true;
        }
        if (!keys['Enter']) enter = false;
        if (credits > 99) credits = 99;
      }
    })();

    var lastDelta = 0;
    var ms = 0;
    var fps = 60;
    var tolerance = 0.1;

    return {
      loop: function (delta) {
        requestAnimationFrame(game.loop);
        ms = delta - lastDelta;
        if (1000 / fps > ms + tolerance) return;

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
          default:
            throw ('Error: requested state does not exist!');
        }

        timer++;
        lastDelta = delta;
        assets.audio.silence.play();
      }
    }
  })();

  init();
}); // iife is called on document load (so is it really an iife or just a func expression?? 🤔)

var ctb = function () {
  var btn = document.createElement('button');
  btn.style = 'padding: 10px; border: 1px solid #FFFFFF; border-radius: 5px; background: #111111; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); outline: none; font-family: "Courier New"; font-size: 3vw; color: #FFFFFF';
  btn.innerHTML = 'Click to begin';
  btn.onclick = function () {
    THE_TOWER_OF_POWER();
    btn.remove();
  };
  document.body.appendChild(btn);
};

// misc functions

function rndInt(max) {
  return Math.floor(Math.random() * max);
}

function repeatChar(char, amt) {
  return new Array(amt + 1).join(char);
}

function newImage(src) {
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
