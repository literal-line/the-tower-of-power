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
    bg: '#FFFFFF',
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

  CanvasRenderingContext2D.prototype.drawTextChars = '0'
  CanvasRenderingContext2D.prototype.drawText = function (obj) {
    var t = obj.text;
    var c = obj.color;
    var x = obj.x;
    var y = obj.y;
    for (var i = 0; i < t.length; i++) {
      //
    }
  };
  init();
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

function convertBase(value, from_base, to_base) { // i know you can convert base 36 to 10 and whatever without this but i like it so im gonna use it
  var range = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/'.split('');
  var from_range = range.slice(0, from_base);
  var to_range = range.slice(0, to_base);

  var dec_value = value.split('').reverse().reduce(function (carry, digit, index) {
    if (from_range.indexOf(digit) === -1) throw new Error('Invalid digit `' + digit + '` for base ' + from_base + '.');
    return carry += from_range.indexOf(digit) * (Math.pow(from_base, index));
  }, 0);

  var new_value = '';
  while (dec_value > 0) {
    new_value = to_range[dec_value % to_base] + new_value;
    dec_value = (dec_value - (dec_value % to_base)) / to_base;
  }
  return new_value || '0';
}
