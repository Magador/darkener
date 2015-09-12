'use strict';

StyleSheetList.prototype[Symbol.iterator] =
CSSRuleList.prototype[Symbol.iterator] =
CSSStyleDeclaration.prototype[Symbol.iterator] = function() {
  let i = 0;
  return {
    next: function() {
      return this.item(i++) ? {value: this.item(i - 1), done: false}: {done: true};
    }.bind(this)
  }
};

var colorProperties = [
  "background-color",
  "border-top-color",
  "border-right-color",
  "border-bottom-color",
  "border-left-color",
  "color",
  "outline-color"
];

var Darkener = function() {
  this.colorProperties = colorProperties;
};

Darkener.prototype.rules = [];
Darkener.prototype.darken = function() {
  let rules = this._extractRules2(document.styleSheets);
};
Darkener.prototype._extractRules = function(ss) {
  for(let rulesList of ss) {
    for(let rule of rulesList.cssRules) {
      for(let expr of rule.style) {
        if(this.colorProperties.indexOf(expr) != -1) {
          let color = Color.fromString(rule.style[expr]).toHSL();
          color.l = 1 - color.l;
          rule.style[expr] = color.toRGB().toString();
        }
      }
    }
  }
};
Darkener.prototype._extractRules2 = function(ss) {
  for (var i = 0; i < ss.length; i++) {
    var rulesList = ss[i];
    if(rulesList.cssRules)
    for (var j = 0; j < rulesList.cssRules.length; j++) {
      var rule = rulesList.cssRules[j];
      for (var k = 0; k < rule.style.length; k++) {
        var expr = rule.style[k];
        if(this.colorProperties.indexOf(expr) != -1) {
          var color = Color.fromString(rule.style[expr]).toHSL();
          color.l = 1 - color.l;
          rule.style[expr] = color.toRGB().toString();
        }
      };
    };
  };
}

function ltest() {
  for(let i = 0; i < 2; i++) {
    console.log(i);
  }
  console.log(i);
}

function scopeTest() {
  let a = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
  for(let i of a) {
    for(let j of i) {
      console.log(j, i);
    }
  }
}

function refTest() {
  let a = {
    b: "foo"
  };
  (function(str) {
    str = "bar";
  })(a);
  console.log(a.b);
}

function arrayTest() {
  let a = {
    b: 2,
    c: {
      d: 4,
      e: 5
    }
  },
  f = [];

  f.push(a);

  a.b = 3;
  a.c = {
    d: 5,
    e: 8
  };

  console.assert(f[0] === a, "Reference is different");
}