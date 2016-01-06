'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _universalUtils = require('universal-utils');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var computable = function computable(fn) {
    return function () {
        var result = fn.apply(undefined, arguments);
        (0, _universalUtils.update)();
        return result;
    };
};

var prop = function prop(val) {
    return function (newVal) {
        if (newVal !== undefined) val = newVal;
        return val;
    };
};

var engine = function engine() {
    var parseHash = function parseHash() {
        return parseInt(window.location.hash.slice(1)) || 0;
    };

    var slides = prop([]),
        active = prop(parseHash()),
        prev = prop();

    var insert = computable(function () {
        for (var _len = arguments.length, _slides = Array(_len), _key = 0; _key < _len; _key++) {
            _slides[_key] = arguments[_key];
        }

        return slides(_slides);
    });

    var remove = computable(function (index) {
        var i = slides();
        var first = i.slice(0, index);
        var second = i.slice(index + 1);

        return slides([].concat(_toConsumableArray(first), _toConsumableArray(second)));
    });

    var navigate = computable(function (index) {
        window.location.hash = '#' + index;
        prev(active());
        if (index >= slides().length) {
            window.location.hash = '#0';
            return;
        }
        if (index < 0) {
            window.location.hash = '#' + (slides().length - 1);
            return;
        }
        return active(index);
    });

    var toggleFullscreen = function toggleFullscreen() {
        var d = document.body,
            isFullscreen = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;

        if (!isFullscreen) {
            d.requestFullscreen && d.requestFullscreen();
            d.mozRequestFullScreen && d.mozRequestFullScreen();
            d.webkitRequestFullScreen && d.webkitRequestFullScreen();
            d.msRequestFullscreen && d.msRequestFullscreen();
        } else {
            document.exitFullscreen && document.exitFullscreen();
            document.mozCancelFullScreen && document.mozCancelFullScreen();
            document.webkitExitFullscreen && document.webkitExitFullscreen();
            document.msExitFullscreen && document.msExitFullscreen();
        }
    };

    var keymap = {
        37: 'LEFT',
        39: 'RIGHT',
        224: 'CMD',
        17: 'CTRL',
        70: 'F'
    },
        pressed = {};

    var events = {
        keydown: function keydown(e) {
            var keyCode = e.keyCode;

            pressed[keymap[keyCode]] = true;

            if (pressed.LEFT) {
                var next = active() - 1;
                if (next < 0) next = slides().length - 1;
                navigate(next);
            } else if (pressed.RIGHT) {
                var next = active() + 1;
                if (next > slides().length - 1) next = 0;
                navigate(next);
            } else if (pressed.CTRL && pressed.F) {
                toggleFullscreen();
                e.preventDefault();
                e.stopImmediatePropagation();
            }
        },
        keyup: function keyup(e) {
            var keyCode = e.keyCode;

            pressed[keymap[keyCode]] = false;
        }
    };

    var initEvents = function initEvents() {
        Object.keys(events).forEach(function (e) {
            return window.addEventListener(e, events[e]);
        });
        hashChanger();
    };

    var config = function config() {
        if (active() === prev()) return;
    };

    var hashChanger = function hashChanger() {
        return window.addEventListener('hashchange', function () {
            var hash = window.location.hash;
            var slide = parseInt(hash.slice(1));
            if (slide !== NaN && slide !== active()) {
                navigate(slide);
            }
        });
    };

    var valueOf = function valueOf(a) {
        return a();
    };

    var arrows = function arrows() {
        return [(0, _universalUtils.m)('.arrow.left', { onclick: function onclick() {
                return navigate(active() - 1);
            } }), (0, _universalUtils.m)('.arrow.right', { onclick: function onclick() {
                return navigate(active() + 1);
            } })];
    };

    var view = function view() {
        var a = active(),
            s = slides(),
            sel = active() < prev() && 'from-left' || active() > prev() && 'from-right' || '';

        var _slide = (0, _universalUtils.m)('div', { key: a, className: sel }, s[a]);

        return (0, _universalUtils.m)('html', { config: config }, [(0, _universalUtils.m)('head', [(0, _universalUtils.m)('title', 'slide: ' + active()), (0, _universalUtils.m)('meta', { name: 'viewport', content: "width=device-width, initial-scale=1.0" }), (0, _universalUtils.m)('link', { href: './style.css', type: 'text/css', rel: 'stylesheet' })]), (0, _universalUtils.m)('body', [(0, _universalUtils.m)('.slides', _slide), arrows()])]);
    };

    var render = function render() {
        initEvents();
        (0, _universalUtils.mount)(view, _universalUtils.qs.apply(undefined, arguments));
    };

    return { slides: slides, insert: insert, remove: remove, navigate: navigate, play: play };
};

exports.default = engine;