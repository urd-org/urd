/*!
 * @description Recursive object extending
 * @author Viacheslav Lotsmanov <lotsmanov89@gmail.com>
 * @license MIT
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2013-2018 Viacheslav Lotsmanov
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

"use strict";

function safeGetProperty(object, property) {
  return property === "__proto__" ? undefined : object[property];
}

function isSpecificValue(val) {
  return val instanceof Buffer || val instanceof Date || val instanceof RegExp
    ? true
    : false;
}

function cloneSpecificValue(val) {
  if (val instanceof Buffer) {
    var x = Buffer.alloc ? Buffer.alloc(val.length) : new Buffer(val.length);
    val.copy(x);
    return x;
  } else if (val instanceof Date) {
    return new Date(val.getTime());
  } else if (val instanceof RegExp) {
    return new RegExp(val);
  } else {
    throw new Error("Unexpected situation");
  }
}

function deepCloneArray(arr) {
  var clone = [];
  arr.forEach(function(item, index) {
    if (typeof item === "object" && item !== null) {
      if (Array.isArray(item)) {
        clone[index] = deepCloneArray(item);
      } else if (isSpecificValue(item)) {
        clone[index] = cloneSpecificValue(item);
      } else {
        clone[index] = Object.assign({}, item);
      }
    } else {
      clone[index] = item;
    }
  });
  return clone;
}

function assignStrict() {
  if (arguments.length < 1 || typeof arguments[0] !== "object") {
    return false;
  }

  if (arguments.length < 2) {
    return arguments[0];
  }

  let target = arguments[0];

  let args = Array.prototype.slice.call(arguments, 1);

  let src;
  let val;

  args.forEach(arg => {
    if (typeof arg !== "object" || arg === null || Array.isArray(arg)) {
      return;
    }

    Object.keys(arg).forEach(key => {
      src = safeGetProperty(target, key); // source value
      val = safeGetProperty(arg, key); // new value

      if (src === undefined) {
        return;
      }

      if (val === target) {
        return;
      } else if (typeof val !== "object" || val === null) {
        target[key] = val;
        return;
      } else if (Array.isArray(val)) {
        target[key] = deepCloneArray(val);
        return;
      } else if (isSpecificValue(val)) {
        target[key] = cloneSpecificValue(key);
        return;
      } else if (
        typeof src !== "object" ||
        src === null ||
        Array.isArray(src)
      ) {
        target[key] = val;
        return;
      } else {
        target[key] = assignStrict(src, val);
        return;
      }
    });
  });

  return target;
}

class Options {
  constructor(...args) {
    this.__options__ = assignStrict(...args);

    Object.assign(this, this.__options__);
  }
}

module.exports = Options;
