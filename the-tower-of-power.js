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
    addEventListener('keydown', function (e) {
      keys[e.code] = true;
    });
    addEventListener('keyup', function (e) {
      delete keys[e.code];
    });
    addEventListener('blur', function () {
      keys = {};
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
  };

  var assets = {
    textures: {
      font: newImage('./assets/font.gif')
    },
    audio: {
      //
    }
  };

  CanvasRenderingContext2D.prototype.textChars = [
    '0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R',
    'S','T','U','V','W','X','Y','Z',' ','!','\'','*','-','.',':','='
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

  //
});

// misc functions

function rndInt(max) {
  return Math.floor(Math.random() * max);
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
