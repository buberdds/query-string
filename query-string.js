/*!
 query-string
 Parse and stringify URL query strings
 https://github.com/sindresorhus/query-string
 by Sindre Sorhus
 MIT License
 */
(function () {
  'use strict';
  var queryString = {},
      argsArray;

  queryString.parse = function (str) {
    if (typeof str !== 'string') {
      return {};
    }

    if(typeof String.prototype.trim !== 'function') {
      String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, '');
      }
    }

    str = str.trim().replace(/^\?/, '');

    if (!str) {
      return {};
    }

    argsArray = str.trim().split('&');

    return _(argsArray).reduce(function (ret, param) {
      var parts = param.replace(/\+/g, ' ').split('=');
      var key = parts[0];
      var val = parts[1];

      key = decodeURIComponent(key);
      // missing `=` should be `null`:
      // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
      val = val === undefined ? null : decodeURIComponent(val);

      if (!ret.hasOwnProperty(key)) {
        ret[key] = val;
      } else if (_.isArray(ret[key])) {
        ret[key].push(val);
      } else {
        ret[key] = [ret[key], val];
      }

      return ret;
    }, {});
  };

  queryString.stringify = function (obj) {
    return obj ? _.chain(obj).keys(obj).map(function (key) {
      var val = obj[key];

      if (_.isArray(val)) {
        return _(val).map(function (val2) {
          return encodeURIComponent(key) + '=' + encodeURIComponent(val2);
        }).join('&');
      }

      return encodeURIComponent(key) + '=' + encodeURIComponent(val);
    }).join('&').value() : '';
  };

  if (typeof define === 'function' && define.amd) {
    define([], queryString);
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = queryString;
  } else {
    window.queryString = queryString;
  }
})();