'use strict';

var Color = {
  hsl: function(h, s, l, a) {
    return new HSL(h, s, l, a);
  },
  rgb: function(r, g, b, a) {
    return new RGB(r, g, b, a);
  },
  fromString: function(color) {
    return (new RGB()).fromString(color) || (new HSL()).fromString(color) || Color.fromString(Keywords[color]);
  }
};

var HSL = function(h, s, l, a) {
  this.h = h % 360 || 0;
  this.s = Math.min(s, 1) || 0;
  this.l = Math.min(l, 1) || 0;
  this.a = a;
  return this;
};
HSL.prototype.toRGB = function() {
  
  var r, g, b, v1, v2;
  
  if(this.s == 0) return new RGB(Math.floor(this.l * 255), Math.floor(this.l * 255), Math.floor(this.l * 255));
  
  v2 = this.l + this.s * (this.l < 0.5 ? this.l : (1 - this.l));
  v1 = 2 * this.l - v2;
  
  r = Math.floor(255 * this._hue2RGB(v1, v2, this.h / 360 + 1 / 3));
  g = Math.floor(255 * this._hue2RGB(v1, v2, this.h / 360));
  b = Math.floor(255 * this._hue2RGB(v1, v2, this.h / 360 - 1 / 3));
  
  return new RGB(r, g, b, this.a);
};
HSL.prototype._regex = /hsla?\((\-?\d+),\s*([\d\.]+)%,\s*([\d\.]+)%(?:,\s*([\.\d]*))?\)/;
HSL.prototype.fromString = function(color) {
  var res = this._regex.exec(color);
  if(!res) return null;
  this.h = (res[1] % 360 + 360) % 360;
  this.s = Math.min(res[2] / 100, 1);
  this.l = Math.min(res[3] / 100, 1);
  this.a = res[4] ? res[4] * 1: null;
  return this;
};
HSL.prototype.toString = function() {
  return (this.a? "hsla(": "hsl(")+ this.h +", "+ this.s * 100 +"%, "+ this.l * 100 +(this.a? "%, "+ this.a +")": "%)");
};
HSL.prototype._hue2RGB = function(v1, v2, vh) {
  vh = (vh % 1 + 1) % 1;
  
  return vh < 1/6? v1 + (v2 - v1) * vh * 6:
         vh < 0.5? v2:
         vh < 2/3? (v1 + (v2 - v1) * ((2/3) - vh) * 6):
                   v1;
}

var RGB = function(r, g, b, a) {
  this.r = r * 1 || 0;
  this.g = g * 1 || 0;
  this.b = b * 1 || 0;
  this.a = a;
  return this;
};
RGB.prototype.toHSL = function() {
  var r, g, b, cMax, cMin, D, h, s, l;
  
  r = this.r / 255;
  g = this.g / 255;
  b = this.b / 255;
  cMax = Math.max(r, g, b);
  cMin = Math.min(r, g, b);
  D = cMax - cMin;
  l = (cMax + cMin) / 2;
  
  if(D == 0) {
    h = s = 0;
  } else {
    switch(cMax) {
      case r:
        h = (g - b) / D % 6;
        break;
      case g:
        h = (b - r) / D + 2;
        break;
      case b:
        h = (r - g) / D + 4;
    }
    h = Math.floor(h*60);
    s = D / (1 - Math.abs(2 * l - 1))
  }
  
  return new HSL(h, s, l, this.a);
};
RGB.prototype._regex = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d\.]*))?\)/;
RGB.prototype.fromString = function(color) {
  var res = this._regex.exec(color);
  if(!res) return null;
  this.r = res[1] * 1;
  this.g = res[2] * 1;
  this.b = res[3] * 1;
  this.a = res[4] ? res[4] * 1: null;
  return this;
};
RGB.prototype.toString = function() {
  return "rgb"+ (this.a? 'a': '') +"("+ this.r +", "+ this.g +", "+ this.b + (this.a? ", "+ this.a: '') +")";
};

function test() {
  var a;
  var time = performance.now();
  for(var i = 0; i < 10000000; i++) {
    a = parseInt("2467981");
  }
  time = performance.now() - time;
  console.log(time);
  time = performance.now();
  for(var i = 0; i < 10000000; i++) {
    a = "2467981" * 1;
  }
  time = performance.now() - time;
  console.log(time);
  time = performance.now();
  for(var i = 0; i < 10000000; i++) {
    a = +"2467981";
  }
  time = performance.now() - time;
  console.log(time);
}

function testToRGB() {
  var a;
  var time = performance.now();
  for(var  i = 0; i < 1000000; i++) {
    Color.fromString("hsl(-35, 100%, 39.01960784313726%)").toRGB()
  }
  time = performance.now() - time;
  console.log(time);
  time = performance.now();
  for(var i = 0; i < 1000000; i++) {
    Color.fromString("hsl(-35, 100%, 39.01960784313726%)").toRGB()
  }
  time = performance.now() - time;
  console.log(time);
}