!(function(e, t) {
  'object' == typeof exports && 'undefined' != typeof module
    ? t()
    : 'function' == typeof define && define.amd
    ? define(t)
    : t();
})(0, function() {
  'use strict';
  function e(e) {
    var t = this.constructor;
    return this.then(
      function(n) {
        return t.resolve(e()).then(function() {
          return n;
        });
      },
      function(n) {
        return t.resolve(e()).then(function() {
          return t.reject(n);
        });
      }
    );
  }
  function t(e) {
    return new this(function(t, n) {
      if (!e || void 0 === e.length)
        return n(
          new TypeError(
            typeof e +
              ' ' +
              e +
              ' is not iterable(cannot read property Symbol(Symbol.iterator))'
          )
        );
      var o = Array.prototype.slice.call(e);
      if (0 === o.length) return t([]);
      var r = o.length;
      function i(e, n) {
        if (n && ('object' == typeof n || 'function' == typeof n)) {
          var f = n.then;
          if ('function' == typeof f)
            return void f.call(
              n,
              function(t) {
                i(e, t);
              },
              function(n) {
                (o[e] = { status: 'rejected', reason: n }), 0 == --r && t(o);
              }
            );
        }
        (o[e] = { status: 'fulfilled', value: n }), 0 == --r && t(o);
      }
      for (var f = 0; f < o.length; f++) i(f, o[f]);
    });
  }
  var n = setTimeout;
  function o(e) {
    return Boolean(e && void 0 !== e.length);
  }
  function r() {}
  function i(e) {
    if (!(this instanceof i))
      throw new TypeError('Promises must be constructed via new');
    if ('function' != typeof e) throw new TypeError('not a function');
    (this._state = 0),
      (this._handled = !1),
      (this._value = void 0),
      (this._deferreds = []),
      s(e, this);
  }
  function f(e, t) {
    for (; 3 === e._state; ) e = e._value;
    0 !== e._state
      ? ((e._handled = !0),
        i._immediateFn(function() {
          var n = 1 === e._state ? t.onFulfilled : t.onRejected;
          if (null !== n) {
            var o;
            try {
              o = n(e._value);
            } catch (e) {
              return void c(t.promise, e);
            }
            u(t.promise, o);
          } else (1 === e._state ? u : c)(t.promise, e._value);
        }))
      : e._deferreds.push(t);
  }
  function u(e, t) {
    try {
      if (t === e)
        throw new TypeError('A promise cannot be resolved with itself.');
      if (t && ('object' == typeof t || 'function' == typeof t)) {
        var n = t.then;
        if (t instanceof i) return (e._state = 3), (e._value = t), void l(e);
        if ('function' == typeof n)
          return void s(
            ((o = n),
            (r = t),
            function() {
              o.apply(r, arguments);
            }),
            e
          );
      }
      (e._state = 1), (e._value = t), l(e);
    } catch (t) {
      c(e, t);
    }
    var o, r;
  }
  function c(e, t) {
    (e._state = 2), (e._value = t), l(e);
  }
  function l(e) {
    2 === e._state &&
      0 === e._deferreds.length &&
      i._immediateFn(function() {
        e._handled || i._unhandledRejectionFn(e._value);
      });
    for (var t = 0, n = e._deferreds.length; t < n; t++) f(e, e._deferreds[t]);
    e._deferreds = null;
  }
  function a(e, t, n) {
    (this.onFulfilled = 'function' == typeof e ? e : null),
      (this.onRejected = 'function' == typeof t ? t : null),
      (this.promise = n);
  }
  function s(e, t) {
    var n = !1;
    try {
      e(
        function(e) {
          n || ((n = !0), u(t, e));
        },
        function(e) {
          n || ((n = !0), c(t, e));
        }
      );
    } catch (e) {
      if (n) return;
      (n = !0), c(t, e);
    }
  }
  (i.prototype.catch = function(e) {
    return this.then(null, e);
  }),
    (i.prototype.then = function(e, t) {
      var n = new this.constructor(r);
      return f(this, new a(e, t, n)), n;
    }),
    (i.prototype.finally = e),
    (i.all = function(e) {
      return new i(function(t, n) {
        if (!o(e)) return n(new TypeError('Promise.all accepts an array'));
        var r = Array.prototype.slice.call(e);
        if (0 === r.length) return t([]);
        var i = r.length;
        function f(e, o) {
          try {
            if (o && ('object' == typeof o || 'function' == typeof o)) {
              var u = o.then;
              if ('function' == typeof u)
                return void u.call(
                  o,
                  function(t) {
                    f(e, t);
                  },
                  n
                );
            }
            (r[e] = o), 0 == --i && t(r);
          } catch (e) {
            n(e);
          }
        }
        for (var u = 0; u < r.length; u++) f(u, r[u]);
      });
    }),
    (i.allSettled = t),
    (i.resolve = function(e) {
      return e && 'object' == typeof e && e.constructor === i
        ? e
        : new i(function(t) {
            t(e);
          });
    }),
    (i.reject = function(e) {
      return new i(function(t, n) {
        n(e);
      });
    }),
    (i.race = function(e) {
      return new i(function(t, n) {
        if (!o(e)) return n(new TypeError('Promise.race accepts an array'));
        for (var r = 0, f = e.length; r < f; r++) i.resolve(e[r]).then(t, n);
      });
    }),
    (i._immediateFn =
      ('function' == typeof setImmediate &&
        function(e) {
          setImmediate(e);
        }) ||
      function(e) {
        n(e, 0);
      }),
    (i._unhandledRejectionFn = function(e) {
      'undefined' != typeof console &&
        console &&
        console.warn('Possible Unhandled Promise Rejection:', e);
    });
  var d = (function() {
    if ('undefined' != typeof self) return self;
    if ('undefined' != typeof window) return window;
    if ('undefined' != typeof global) return global;
    throw new Error('unable to locate global object');
  })();
  'function' != typeof d.Promise
    ? (d.Promise = i)
    : d.Promise.prototype.finally
    ? d.Promise.allSettled || (d.Promise.allSettled = t)
    : (d.Promise.prototype.finally = e);
});
