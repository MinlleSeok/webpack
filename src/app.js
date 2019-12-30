/*
var require = function(src){                 // line 1
    var fileAsStr = readFile(src)            // var fileAsStr = readFile('./math.js');
    var module.exports = {}                  // line 3

    // eval(fileAsStr)
    module.exports = function sum(a, b) { return a + b; }

    return module.exports                    //line 5
}
*/

////////////////////////////////////////////////////////////////
// Good
////////////////////////////////////////////////////////////////

// const sum = require("./math.js");
import * as math from "./math.js";
import "./style.css";

// console.log(sum(1, 2));
// document.getElementsByTagName("body").innerHTML = math.sum(1, 2);

// document.write(sum(1, 2));
console.log(math.sum(1, 2));

