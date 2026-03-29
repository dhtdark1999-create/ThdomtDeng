import { createRequire } from "node:module";
import process$1 from "node:process";
import { styleText } from "node:util";
import { tokenizeArgs } from "args-tokenizer";
import { execSync } from "node:child_process";
import { x } from "tinyexec";
import semver, { SemVer, clean, valid } from "semver";
import fsSync, { existsSync } from "node:fs";
import * as path$1 from "node:path";
import path from "node:path";
import * as jsonc from "jsonc-parser";
import fs from "node:fs/promises";
import { glob } from "tinyglobby";
import yaml from "yaml";
import { loadConfig } from "unconfig";
//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJSMin = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
var __require = /* @__PURE__ */ createRequire(import.meta.url);
//#endregion
//#region node_modules/.pnpm/kleur@3.0.3/node_modules/kleur/index.js
var require_kleur = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { FORCE_COLOR, NODE_DISABLE_COLORS, TERM } = process.env;
	const $ = {
		enabled: !NODE_DISABLE_COLORS && TERM !== "dumb" && FORCE_COLOR !== "0",
		reset: init(0, 0),
		bold: init(1, 22),
		dim: init(2, 22),
		italic: init(3, 23),
		underline: init(4, 24),
		inverse: init(7, 27),
		hidden: init(8, 28),
		strikethrough: init(9, 29),
		black: init(30, 39),
		red: init(31, 39),
		green: init(32, 39),
		yellow: init(33, 39),
		blue: init(34, 39),
		magenta: init(35, 39),
		cyan: init(36, 39),
		white: init(37, 39),
		gray: init(90, 39),
		grey: init(90, 39),
		bgBlack: init(40, 49),
		bgRed: init(41, 49),
		bgGreen: init(42, 49),
		bgYellow: init(43, 49),
		bgBlue: init(44, 49),
		bgMagenta: init(45, 49),
		bgCyan: init(46, 49),
		bgWhite: init(47, 49)
	};
	function run(arr, str) {
		let i = 0, tmp, beg = "", end = "";
		for (; i < arr.length; i++) {
			tmp = arr[i];
			beg += tmp.open;
			end += tmp.close;
			if (str.includes(tmp.close)) str = str.replace(tmp.rgx, tmp.close + tmp.open);
		}
		return beg + str + end;
	}
	function chain(has, keys) {
		let ctx = {
			has,
			keys
		};
		ctx.reset = $.reset.bind(ctx);
		ctx.bold = $.bold.bind(ctx);
		ctx.dim = $.dim.bind(ctx);
		ctx.italic = $.italic.bind(ctx);
		ctx.underline = $.underline.bind(ctx);
		ctx.inverse = $.inverse.bind(ctx);
		ctx.hidden = $.hidden.bind(ctx);
		ctx.strikethrough = $.strikethrough.bind(ctx);
		ctx.black = $.black.bind(ctx);
		ctx.red = $.red.bind(ctx);
		ctx.green = $.green.bind(ctx);
		ctx.yellow = $.yellow.bind(ctx);
		ctx.blue = $.blue.bind(ctx);
		ctx.magenta = $.magenta.bind(ctx);
		ctx.cyan = $.cyan.bind(ctx);
		ctx.white = $.white.bind(ctx);
		ctx.gray = $.gray.bind(ctx);
		ctx.grey = $.grey.bind(ctx);
		ctx.bgBlack = $.bgBlack.bind(ctx);
		ctx.bgRed = $.bgRed.bind(ctx);
		ctx.bgGreen = $.bgGreen.bind(ctx);
		ctx.bgYellow = $.bgYellow.bind(ctx);
		ctx.bgBlue = $.bgBlue.bind(ctx);
		ctx.bgMagenta = $.bgMagenta.bind(ctx);
		ctx.bgCyan = $.bgCyan.bind(ctx);
		ctx.bgWhite = $.bgWhite.bind(ctx);
		return ctx;
	}
	function init(open, close) {
		let blk = {
			open: `\x1b[${open}m`,
			close: `\x1b[${close}m`,
			rgx: new RegExp(`\\x1b\\[${close}m`, "g")
		};
		return function(txt) {
			if (this !== void 0 && this.has !== void 0) {
				this.has.includes(open) || (this.has.push(open), this.keys.push(blk));
				return txt === void 0 ? this : $.enabled ? run(this.keys, txt + "") : txt + "";
			}
			return txt === void 0 ? chain([open], [blk]) : $.enabled ? run([blk], txt + "") : txt + "";
		};
	}
	module.exports = $;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/util/action.js
var require_action$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = (key, isSelect) => {
		if (key.meta && key.name !== "escape") return;
		if (key.ctrl) {
			if (key.name === "a") return "first";
			if (key.name === "c") return "abort";
			if (key.name === "d") return "abort";
			if (key.name === "e") return "last";
			if (key.name === "g") return "reset";
		}
		if (isSelect) {
			if (key.name === "j") return "down";
			if (key.name === "k") return "up";
		}
		if (key.name === "return") return "submit";
		if (key.name === "enter") return "submit";
		if (key.name === "backspace") return "delete";
		if (key.name === "delete") return "deleteForward";
		if (key.name === "abort") return "abort";
		if (key.name === "escape") return "exit";
		if (key.name === "tab") return "next";
		if (key.name === "pagedown") return "nextPage";
		if (key.name === "pageup") return "prevPage";
		if (key.name === "home") return "home";
		if (key.name === "end") return "end";
		if (key.name === "up") return "up";
		if (key.name === "down") return "down";
		if (key.name === "right") return "right";
		if (key.name === "left") return "left";
		return false;
	};
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/util/strip.js
var require_strip$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = (str) => {
		const pattern = ["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)", "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))"].join("|");
		const RGX = new RegExp(pattern, "g");
		return typeof str === "string" ? str.replace(RGX, "") : str;
	};
}));
//#endregion
//#region node_modules/.pnpm/sisteransi@1.0.5/node_modules/sisteransi/src/index.js
var require_src = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const ESC = "\x1B";
	const CSI = `${ESC}[`;
	const beep = "\x07";
	const cursor = {
		to(x, y) {
			if (!y) return `${CSI}${x + 1}G`;
			return `${CSI}${y + 1};${x + 1}H`;
		},
		move(x, y) {
			let ret = "";
			if (x < 0) ret += `${CSI}${-x}D`;
			else if (x > 0) ret += `${CSI}${x}C`;
			if (y < 0) ret += `${CSI}${-y}A`;
			else if (y > 0) ret += `${CSI}${y}B`;
			return ret;
		},
		up: (count = 1) => `${CSI}${count}A`,
		down: (count = 1) => `${CSI}${count}B`,
		forward: (count = 1) => `${CSI}${count}C`,
		backward: (count = 1) => `${CSI}${count}D`,
		nextLine: (count = 1) => `${CSI}E`.repeat(count),
		prevLine: (count = 1) => `${CSI}F`.repeat(count),
		left: `${CSI}G`,
		hide: `${CSI}?25l`,
		show: `${CSI}?25h`,
		save: `${ESC}7`,
		restore: `${ESC}8`
	};
	module.exports = {
		cursor,
		scroll: {
			up: (count = 1) => `${CSI}S`.repeat(count),
			down: (count = 1) => `${CSI}T`.repeat(count)
		},
		erase: {
			screen: `${CSI}2J`,
			up: (count = 1) => `${CSI}1J`.repeat(count),
			down: (count = 1) => `${CSI}J`.repeat(count),
			line: `${CSI}2K`,
			lineEnd: `${CSI}K`,
			lineStart: `${CSI}1K`,
			lines(count) {
				let clear = "";
				for (let i = 0; i < count; i++) clear += this.line + (i < count - 1 ? cursor.up() : "");
				if (count) clear += cursor.left;
				return clear;
			}
		},
		beep
	};
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/util/clear.js
var require_clear$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function _createForOfIteratorHelper(o, allowArrayLike) {
		var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
		if (!it) {
			if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
				if (it) o = it;
				var i = 0;
				var F = function F() {};
				return {
					s: F,
					n: function n() {
						if (i >= o.length) return { done: true };
						return {
							done: false,
							value: o[i++]
						};
					},
					e: function e(_e) {
						throw _e;
					},
					f: F
				};
			}
			throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
		}
		var normalCompletion = true, didErr = false, err;
		return {
			s: function s() {
				it = it.call(o);
			},
			n: function n() {
				var step = it.next();
				normalCompletion = step.done;
				return step;
			},
			e: function e(_e2) {
				didErr = true;
				err = _e2;
			},
			f: function f() {
				try {
					if (!normalCompletion && it.return != null) it.return();
				} finally {
					if (didErr) throw err;
				}
			}
		};
	}
	function _unsupportedIterableToArray(o, minLen) {
		if (!o) return;
		if (typeof o === "string") return _arrayLikeToArray(o, minLen);
		var n = Object.prototype.toString.call(o).slice(8, -1);
		if (n === "Object" && o.constructor) n = o.constructor.name;
		if (n === "Map" || n === "Set") return Array.from(o);
		if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
	}
	function _arrayLikeToArray(arr, len) {
		if (len == null || len > arr.length) len = arr.length;
		for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
		return arr2;
	}
	const strip = require_strip$1();
	const _require = require_src(), erase = _require.erase, cursor = _require.cursor;
	const width = (str) => [...strip(str)].length;
	/**
	* @param {string} prompt
	* @param {number} perLine
	*/
	module.exports = function(prompt, perLine) {
		if (!perLine) return erase.line + cursor.to(0);
		let rows = 0;
		var _iterator = _createForOfIteratorHelper(prompt.split(/\r?\n/)), _step;
		try {
			for (_iterator.s(); !(_step = _iterator.n()).done;) {
				let line = _step.value;
				rows += 1 + Math.floor(Math.max(width(line) - 1, 0) / perLine);
			}
		} catch (err) {
			_iterator.e(err);
		} finally {
			_iterator.f();
		}
		return erase.lines(rows);
	};
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/util/figures.js
var require_figures$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const main = {
		arrowUp: "↑",
		arrowDown: "↓",
		arrowLeft: "←",
		arrowRight: "→",
		radioOn: "◉",
		radioOff: "◯",
		tick: "✔",
		cross: "✖",
		ellipsis: "…",
		pointerSmall: "›",
		line: "─",
		pointer: "❯"
	};
	const win = {
		arrowUp: main.arrowUp,
		arrowDown: main.arrowDown,
		arrowLeft: main.arrowLeft,
		arrowRight: main.arrowRight,
		radioOn: "(*)",
		radioOff: "( )",
		tick: "√",
		cross: "×",
		ellipsis: "...",
		pointerSmall: "»",
		line: "─",
		pointer: ">"
	};
	module.exports = process.platform === "win32" ? win : main;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/util/style.js
var require_style$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const c = require_kleur();
	const figures = require_figures$1();
	const styles = Object.freeze({
		password: {
			scale: 1,
			render: (input) => "*".repeat(input.length)
		},
		emoji: {
			scale: 2,
			render: (input) => "😃".repeat(input.length)
		},
		invisible: {
			scale: 0,
			render: (input) => ""
		},
		default: {
			scale: 1,
			render: (input) => `${input}`
		}
	});
	const render = (type) => styles[type] || styles.default;
	const symbols = Object.freeze({
		aborted: c.red(figures.cross),
		done: c.green(figures.tick),
		exited: c.yellow(figures.cross),
		default: c.cyan("?")
	});
	const symbol = (done, aborted, exited) => aborted ? symbols.aborted : exited ? symbols.exited : done ? symbols.done : symbols.default;
	const delimiter = (completing) => c.gray(completing ? figures.ellipsis : figures.pointerSmall);
	const item = (expandable, expanded) => c.gray(expandable ? expanded ? figures.pointerSmall : "+" : figures.line);
	module.exports = {
		styles,
		render,
		symbols,
		symbol,
		delimiter,
		item
	};
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/util/lines.js
var require_lines$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const strip = require_strip$1();
	/**
	* @param {string} msg
	* @param {number} perLine
	*/
	module.exports = function(msg, perLine) {
		let lines = String(strip(msg) || "").split(/\r?\n/);
		if (!perLine) return lines.length;
		return lines.map((l) => Math.ceil(l.length / perLine)).reduce((a, b) => a + b);
	};
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/util/wrap.js
var require_wrap$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* @param {string} msg The message to wrap
	* @param {object} opts
	* @param {number|string} [opts.margin] Left margin
	* @param {number} opts.width Maximum characters per line including the margin
	*/
	module.exports = (msg, opts = {}) => {
		const tab = Number.isSafeInteger(parseInt(opts.margin)) ? new Array(parseInt(opts.margin)).fill(" ").join("") : opts.margin || "";
		const width = opts.width;
		return (msg || "").split(/\r?\n/g).map((line) => line.split(/\s+/g).reduce((arr, w) => {
			if (w.length + tab.length >= width || arr[arr.length - 1].length + w.length + 1 < width) arr[arr.length - 1] += ` ${w}`;
			else arr.push(`${tab}${w}`);
			return arr;
		}, [tab]).join("\n")).join("\n");
	};
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/util/entriesToDisplay.js
var require_entriesToDisplay$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Determine what entries should be displayed on the screen, based on the
	* currently selected index and the maximum visible. Used in list-based
	* prompts like `select` and `multiselect`.
	*
	* @param {number} cursor the currently selected entry
	* @param {number} total the total entries available to display
	* @param {number} [maxVisible] the number of entries that can be displayed
	*/
	module.exports = (cursor, total, maxVisible) => {
		maxVisible = maxVisible || total;
		let startIndex = Math.min(total - maxVisible, cursor - Math.floor(maxVisible / 2));
		if (startIndex < 0) startIndex = 0;
		let endIndex = Math.min(startIndex + maxVisible, total);
		return {
			startIndex,
			endIndex
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/util/index.js
var require_util$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		action: require_action$1(),
		clear: require_clear$1(),
		style: require_style$1(),
		strip: require_strip$1(),
		figures: require_figures$1(),
		lines: require_lines$1(),
		wrap: require_wrap$1(),
		entriesToDisplay: require_entriesToDisplay$1()
	};
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/prompt.js
var require_prompt$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const readline$1 = __require("readline");
	const action = require_util$1().action;
	const EventEmitter$1 = __require("events");
	const _require2 = require_src(), beep = _require2.beep, cursor = _require2.cursor;
	const color = require_kleur();
	/**
	* Base prompt skeleton
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	*/
	var Prompt = class extends EventEmitter$1 {
		constructor(opts = {}) {
			super();
			this.firstRender = true;
			this.in = opts.stdin || process.stdin;
			this.out = opts.stdout || process.stdout;
			this.onRender = (opts.onRender || (() => void 0)).bind(this);
			const rl = readline$1.createInterface({
				input: this.in,
				escapeCodeTimeout: 50
			});
			readline$1.emitKeypressEvents(this.in, rl);
			if (this.in.isTTY) this.in.setRawMode(true);
			const isSelect = ["SelectPrompt", "MultiselectPrompt"].indexOf(this.constructor.name) > -1;
			const keypress = (str, key) => {
				let a = action(key, isSelect);
				if (a === false) this._ && this._(str, key);
				else if (typeof this[a] === "function") this[a](key);
				else this.bell();
			};
			this.close = () => {
				this.out.write(cursor.show);
				this.in.removeListener("keypress", keypress);
				if (this.in.isTTY) this.in.setRawMode(false);
				rl.close();
				this.emit(this.aborted ? "abort" : this.exited ? "exit" : "submit", this.value);
				this.closed = true;
			};
			this.in.on("keypress", keypress);
		}
		fire() {
			this.emit("state", {
				value: this.value,
				aborted: !!this.aborted,
				exited: !!this.exited
			});
		}
		bell() {
			this.out.write(beep);
		}
		render() {
			this.onRender(color);
			if (this.firstRender) this.firstRender = false;
		}
	};
	module.exports = Prompt;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/text.js
var require_text$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
		try {
			var info = gen[key](arg);
			var value = info.value;
		} catch (error) {
			reject(error);
			return;
		}
		if (info.done) resolve(value);
		else Promise.resolve(value).then(_next, _throw);
	}
	function _asyncToGenerator(fn) {
		return function() {
			var self = this, args = arguments;
			return new Promise(function(resolve, reject) {
				var gen = fn.apply(self, args);
				function _next(value) {
					asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
				}
				function _throw(err) {
					asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
				}
				_next(void 0);
			});
		};
	}
	const color = require_kleur();
	const Prompt = require_prompt$1();
	const _require = require_src(), erase = _require.erase, cursor = _require.cursor;
	const _require2 = require_util$1(), style = _require2.style, clear = _require2.clear, lines = _require2.lines, figures = _require2.figures;
	/**
	* TextPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {String} [opts.style='default'] Render style
	* @param {String} [opts.initial] Default value
	* @param {Function} [opts.validate] Validate function
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	* @param {String} [opts.error] The invalid error label
	*/
	var TextPrompt = class extends Prompt {
		constructor(opts = {}) {
			super(opts);
			this.transform = style.render(opts.style);
			this.scale = this.transform.scale;
			this.msg = opts.message;
			this.initial = opts.initial || ``;
			this.validator = opts.validate || (() => true);
			this.value = ``;
			this.errorMsg = opts.error || `Please Enter A Valid Value`;
			this.cursor = Number(!!this.initial);
			this.cursorOffset = 0;
			this.clear = clear(``, this.out.columns);
			this.render();
		}
		set value(v) {
			if (!v && this.initial) {
				this.placeholder = true;
				this.rendered = color.gray(this.transform.render(this.initial));
			} else {
				this.placeholder = false;
				this.rendered = this.transform.render(v);
			}
			this._value = v;
			this.fire();
		}
		get value() {
			return this._value;
		}
		reset() {
			this.value = ``;
			this.cursor = Number(!!this.initial);
			this.cursorOffset = 0;
			this.fire();
			this.render();
		}
		exit() {
			this.abort();
		}
		abort() {
			this.value = this.value || this.initial;
			this.done = this.aborted = true;
			this.error = false;
			this.red = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		validate() {
			var _this = this;
			return _asyncToGenerator(function* () {
				let valid = yield _this.validator(_this.value);
				if (typeof valid === `string`) {
					_this.errorMsg = valid;
					valid = false;
				}
				_this.error = !valid;
			})();
		}
		submit() {
			var _this2 = this;
			return _asyncToGenerator(function* () {
				_this2.value = _this2.value || _this2.initial;
				_this2.cursorOffset = 0;
				_this2.cursor = _this2.rendered.length;
				yield _this2.validate();
				if (_this2.error) {
					_this2.red = true;
					_this2.fire();
					_this2.render();
					return;
				}
				_this2.done = true;
				_this2.aborted = false;
				_this2.fire();
				_this2.render();
				_this2.out.write("\n");
				_this2.close();
			})();
		}
		next() {
			if (!this.placeholder) return this.bell();
			this.value = this.initial;
			this.cursor = this.rendered.length;
			this.fire();
			this.render();
		}
		moveCursor(n) {
			if (this.placeholder) return;
			this.cursor = this.cursor + n;
			this.cursorOffset += n;
		}
		_(c, key) {
			let s1 = this.value.slice(0, this.cursor);
			this.value = `${s1}${c}${this.value.slice(this.cursor)}`;
			this.red = false;
			this.cursor = this.placeholder ? 0 : s1.length + 1;
			this.render();
		}
		delete() {
			if (this.isCursorAtStart()) return this.bell();
			this.value = `${this.value.slice(0, this.cursor - 1)}${this.value.slice(this.cursor)}`;
			this.red = false;
			if (this.isCursorAtStart()) this.cursorOffset = 0;
			else {
				this.cursorOffset++;
				this.moveCursor(-1);
			}
			this.render();
		}
		deleteForward() {
			if (this.cursor * this.scale >= this.rendered.length || this.placeholder) return this.bell();
			this.value = `${this.value.slice(0, this.cursor)}${this.value.slice(this.cursor + 1)}`;
			this.red = false;
			if (this.isCursorAtEnd()) this.cursorOffset = 0;
			else this.cursorOffset++;
			this.render();
		}
		first() {
			this.cursor = 0;
			this.render();
		}
		last() {
			this.cursor = this.value.length;
			this.render();
		}
		left() {
			if (this.cursor <= 0 || this.placeholder) return this.bell();
			this.moveCursor(-1);
			this.render();
		}
		right() {
			if (this.cursor * this.scale >= this.rendered.length || this.placeholder) return this.bell();
			this.moveCursor(1);
			this.render();
		}
		isCursorAtStart() {
			return this.cursor === 0 || this.placeholder && this.cursor === 1;
		}
		isCursorAtEnd() {
			return this.cursor === this.rendered.length || this.placeholder && this.cursor === this.rendered.length + 1;
		}
		render() {
			if (this.closed) return;
			if (!this.firstRender) {
				if (this.outputError) this.out.write(cursor.down(lines(this.outputError, this.out.columns) - 1) + clear(this.outputError, this.out.columns));
				this.out.write(clear(this.outputText, this.out.columns));
			}
			super.render();
			this.outputError = "";
			this.outputText = [
				style.symbol(this.done, this.aborted),
				color.bold(this.msg),
				style.delimiter(this.done),
				this.red ? color.red(this.rendered) : this.rendered
			].join(` `);
			if (this.error) this.outputError += this.errorMsg.split(`\n`).reduce((a, l, i) => a + `\n${i ? " " : figures.pointerSmall} ${color.red().italic(l)}`, ``);
			this.out.write(erase.line + cursor.to(0) + this.outputText + cursor.save + this.outputError + cursor.restore + cursor.move(this.cursorOffset, 0));
		}
	};
	module.exports = TextPrompt;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/select.js
var require_select$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const color = require_kleur();
	const Prompt = require_prompt$1();
	const _require = require_util$1(), style = _require.style, clear = _require.clear, figures = _require.figures, wrap = _require.wrap, entriesToDisplay = _require.entriesToDisplay;
	const cursor = require_src().cursor;
	/**
	* SelectPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Array} opts.choices Array of choice objects
	* @param {String} [opts.hint] Hint to display
	* @param {Number} [opts.initial] Index of default value
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	* @param {Number} [opts.optionsPerPage=10] Max options to display at once
	*/
	var SelectPrompt = class extends Prompt {
		constructor(opts = {}) {
			super(opts);
			this.msg = opts.message;
			this.hint = opts.hint || "- Use arrow-keys. Return to submit.";
			this.warn = opts.warn || "- This option is disabled";
			this.cursor = opts.initial || 0;
			this.choices = opts.choices.map((ch, idx) => {
				if (typeof ch === "string") ch = {
					title: ch,
					value: idx
				};
				return {
					title: ch && (ch.title || ch.value || ch),
					value: ch && (ch.value === void 0 ? idx : ch.value),
					description: ch && ch.description,
					selected: ch && ch.selected,
					disabled: ch && ch.disabled
				};
			});
			this.optionsPerPage = opts.optionsPerPage || 10;
			this.value = (this.choices[this.cursor] || {}).value;
			this.clear = clear("", this.out.columns);
			this.render();
		}
		moveCursor(n) {
			this.cursor = n;
			this.value = this.choices[n].value;
			this.fire();
		}
		reset() {
			this.moveCursor(0);
			this.fire();
			this.render();
		}
		exit() {
			this.abort();
		}
		abort() {
			this.done = this.aborted = true;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		submit() {
			if (!this.selection.disabled) {
				this.done = true;
				this.aborted = false;
				this.fire();
				this.render();
				this.out.write("\n");
				this.close();
			} else this.bell();
		}
		first() {
			this.moveCursor(0);
			this.render();
		}
		last() {
			this.moveCursor(this.choices.length - 1);
			this.render();
		}
		up() {
			if (this.cursor === 0) this.moveCursor(this.choices.length - 1);
			else this.moveCursor(this.cursor - 1);
			this.render();
		}
		down() {
			if (this.cursor === this.choices.length - 1) this.moveCursor(0);
			else this.moveCursor(this.cursor + 1);
			this.render();
		}
		next() {
			this.moveCursor((this.cursor + 1) % this.choices.length);
			this.render();
		}
		_(c, key) {
			if (c === " ") return this.submit();
		}
		get selection() {
			return this.choices[this.cursor];
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor.hide);
			else this.out.write(clear(this.outputText, this.out.columns));
			super.render();
			let _entriesToDisplay = entriesToDisplay(this.cursor, this.choices.length, this.optionsPerPage), startIndex = _entriesToDisplay.startIndex, endIndex = _entriesToDisplay.endIndex;
			this.outputText = [
				style.symbol(this.done, this.aborted),
				color.bold(this.msg),
				style.delimiter(false),
				this.done ? this.selection.title : this.selection.disabled ? color.yellow(this.warn) : color.gray(this.hint)
			].join(" ");
			if (!this.done) {
				this.outputText += "\n";
				for (let i = startIndex; i < endIndex; i++) {
					let title, prefix, desc = "", v = this.choices[i];
					if (i === startIndex && startIndex > 0) prefix = figures.arrowUp;
					else if (i === endIndex - 1 && endIndex < this.choices.length) prefix = figures.arrowDown;
					else prefix = " ";
					if (v.disabled) {
						title = this.cursor === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
						prefix = (this.cursor === i ? color.bold().gray(figures.pointer) + " " : "  ") + prefix;
					} else {
						title = this.cursor === i ? color.cyan().underline(v.title) : v.title;
						prefix = (this.cursor === i ? color.cyan(figures.pointer) + " " : "  ") + prefix;
						if (v.description && this.cursor === i) {
							desc = ` - ${v.description}`;
							if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) desc = "\n" + wrap(v.description, {
								margin: 3,
								width: this.out.columns
							});
						}
					}
					this.outputText += `${prefix} ${title}${color.gray(desc)}\n`;
				}
			}
			this.out.write(this.outputText);
		}
	};
	module.exports = SelectPrompt;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/toggle.js
var require_toggle$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const color = require_kleur();
	const Prompt = require_prompt$1();
	const _require = require_util$1(), style = _require.style, clear = _require.clear;
	const _require2 = require_src(), cursor = _require2.cursor, erase = _require2.erase;
	/**
	* TogglePrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Boolean} [opts.initial=false] Default value
	* @param {String} [opts.active='no'] Active label
	* @param {String} [opts.inactive='off'] Inactive label
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	*/
	var TogglePrompt = class extends Prompt {
		constructor(opts = {}) {
			super(opts);
			this.msg = opts.message;
			this.value = !!opts.initial;
			this.active = opts.active || "on";
			this.inactive = opts.inactive || "off";
			this.initialValue = this.value;
			this.render();
		}
		reset() {
			this.value = this.initialValue;
			this.fire();
			this.render();
		}
		exit() {
			this.abort();
		}
		abort() {
			this.done = this.aborted = true;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		submit() {
			this.done = true;
			this.aborted = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		deactivate() {
			if (this.value === false) return this.bell();
			this.value = false;
			this.render();
		}
		activate() {
			if (this.value === true) return this.bell();
			this.value = true;
			this.render();
		}
		delete() {
			this.deactivate();
		}
		left() {
			this.deactivate();
		}
		right() {
			this.activate();
		}
		down() {
			this.deactivate();
		}
		up() {
			this.activate();
		}
		next() {
			this.value = !this.value;
			this.fire();
			this.render();
		}
		_(c, key) {
			if (c === " ") this.value = !this.value;
			else if (c === "1") this.value = true;
			else if (c === "0") this.value = false;
			else return this.bell();
			this.render();
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor.hide);
			else this.out.write(clear(this.outputText, this.out.columns));
			super.render();
			this.outputText = [
				style.symbol(this.done, this.aborted),
				color.bold(this.msg),
				style.delimiter(this.done),
				this.value ? this.inactive : color.cyan().underline(this.inactive),
				color.gray("/"),
				this.value ? color.cyan().underline(this.active) : this.active
			].join(" ");
			this.out.write(erase.line + cursor.to(0) + this.outputText);
		}
	};
	module.exports = TogglePrompt;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/dateparts/datepart.js
var require_datepart$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = class DatePart {
		constructor({ token, date, parts, locales }) {
			this.token = token;
			this.date = date || /* @__PURE__ */ new Date();
			this.parts = parts || [this];
			this.locales = locales || {};
		}
		up() {}
		down() {}
		next() {
			const currentIdx = this.parts.indexOf(this);
			return this.parts.find((part, idx) => idx > currentIdx && part instanceof DatePart);
		}
		setTo(val) {}
		prev() {
			let parts = [].concat(this.parts).reverse();
			const currentIdx = parts.indexOf(this);
			return parts.find((part, idx) => idx > currentIdx && part instanceof DatePart);
		}
		toString() {
			return String(this.date);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/dateparts/meridiem.js
var require_meridiem$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const DatePart = require_datepart$1();
	var Meridiem = class extends DatePart {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setHours((this.date.getHours() + 12) % 24);
		}
		down() {
			this.up();
		}
		toString() {
			let meridiem = this.date.getHours() > 12 ? "pm" : "am";
			return /\A/.test(this.token) ? meridiem.toUpperCase() : meridiem;
		}
	};
	module.exports = Meridiem;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/dateparts/day.js
var require_day$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const DatePart = require_datepart$1();
	const pos = (n) => {
		n = n % 10;
		return n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th";
	};
	var Day = class extends DatePart {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setDate(this.date.getDate() + 1);
		}
		down() {
			this.date.setDate(this.date.getDate() - 1);
		}
		setTo(val) {
			this.date.setDate(parseInt(val.substr(-2)));
		}
		toString() {
			let date = this.date.getDate();
			let day = this.date.getDay();
			return this.token === "DD" ? String(date).padStart(2, "0") : this.token === "Do" ? date + pos(date) : this.token === "d" ? day + 1 : this.token === "ddd" ? this.locales.weekdaysShort[day] : this.token === "dddd" ? this.locales.weekdays[day] : date;
		}
	};
	module.exports = Day;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/dateparts/hours.js
var require_hours$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const DatePart = require_datepart$1();
	var Hours = class extends DatePart {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setHours(this.date.getHours() + 1);
		}
		down() {
			this.date.setHours(this.date.getHours() - 1);
		}
		setTo(val) {
			this.date.setHours(parseInt(val.substr(-2)));
		}
		toString() {
			let hours = this.date.getHours();
			if (/h/.test(this.token)) hours = hours % 12 || 12;
			return this.token.length > 1 ? String(hours).padStart(2, "0") : hours;
		}
	};
	module.exports = Hours;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/dateparts/milliseconds.js
var require_milliseconds$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const DatePart = require_datepart$1();
	var Milliseconds = class extends DatePart {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setMilliseconds(this.date.getMilliseconds() + 1);
		}
		down() {
			this.date.setMilliseconds(this.date.getMilliseconds() - 1);
		}
		setTo(val) {
			this.date.setMilliseconds(parseInt(val.substr(-this.token.length)));
		}
		toString() {
			return String(this.date.getMilliseconds()).padStart(4, "0").substr(0, this.token.length);
		}
	};
	module.exports = Milliseconds;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/dateparts/minutes.js
var require_minutes$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const DatePart = require_datepart$1();
	var Minutes = class extends DatePart {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setMinutes(this.date.getMinutes() + 1);
		}
		down() {
			this.date.setMinutes(this.date.getMinutes() - 1);
		}
		setTo(val) {
			this.date.setMinutes(parseInt(val.substr(-2)));
		}
		toString() {
			let m = this.date.getMinutes();
			return this.token.length > 1 ? String(m).padStart(2, "0") : m;
		}
	};
	module.exports = Minutes;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/dateparts/month.js
var require_month$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const DatePart = require_datepart$1();
	var Month = class extends DatePart {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setMonth(this.date.getMonth() + 1);
		}
		down() {
			this.date.setMonth(this.date.getMonth() - 1);
		}
		setTo(val) {
			val = parseInt(val.substr(-2)) - 1;
			this.date.setMonth(val < 0 ? 0 : val);
		}
		toString() {
			let month = this.date.getMonth();
			let tl = this.token.length;
			return tl === 2 ? String(month + 1).padStart(2, "0") : tl === 3 ? this.locales.monthsShort[month] : tl === 4 ? this.locales.months[month] : String(month + 1);
		}
	};
	module.exports = Month;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/dateparts/seconds.js
var require_seconds$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const DatePart = require_datepart$1();
	var Seconds = class extends DatePart {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setSeconds(this.date.getSeconds() + 1);
		}
		down() {
			this.date.setSeconds(this.date.getSeconds() - 1);
		}
		setTo(val) {
			this.date.setSeconds(parseInt(val.substr(-2)));
		}
		toString() {
			let s = this.date.getSeconds();
			return this.token.length > 1 ? String(s).padStart(2, "0") : s;
		}
	};
	module.exports = Seconds;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/dateparts/year.js
var require_year$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const DatePart = require_datepart$1();
	var Year = class extends DatePart {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setFullYear(this.date.getFullYear() + 1);
		}
		down() {
			this.date.setFullYear(this.date.getFullYear() - 1);
		}
		setTo(val) {
			this.date.setFullYear(val.substr(-4));
		}
		toString() {
			let year = String(this.date.getFullYear()).padStart(4, "0");
			return this.token.length === 2 ? year.substr(-2) : year;
		}
	};
	module.exports = Year;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/dateparts/index.js
var require_dateparts$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		DatePart: require_datepart$1(),
		Meridiem: require_meridiem$1(),
		Day: require_day$1(),
		Hours: require_hours$1(),
		Milliseconds: require_milliseconds$1(),
		Minutes: require_minutes$1(),
		Month: require_month$1(),
		Seconds: require_seconds$1(),
		Year: require_year$1()
	};
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/date.js
var require_date$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
		try {
			var info = gen[key](arg);
			var value = info.value;
		} catch (error) {
			reject(error);
			return;
		}
		if (info.done) resolve(value);
		else Promise.resolve(value).then(_next, _throw);
	}
	function _asyncToGenerator(fn) {
		return function() {
			var self = this, args = arguments;
			return new Promise(function(resolve, reject) {
				var gen = fn.apply(self, args);
				function _next(value) {
					asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
				}
				function _throw(err) {
					asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
				}
				_next(void 0);
			});
		};
	}
	const color = require_kleur();
	const Prompt = require_prompt$1();
	const _require = require_util$1(), style = _require.style, clear = _require.clear, figures = _require.figures;
	const _require2 = require_src(), erase = _require2.erase, cursor = _require2.cursor;
	const _require3 = require_dateparts$1(), DatePart = _require3.DatePart, Meridiem = _require3.Meridiem, Day = _require3.Day, Hours = _require3.Hours, Milliseconds = _require3.Milliseconds, Minutes = _require3.Minutes, Month = _require3.Month, Seconds = _require3.Seconds, Year = _require3.Year;
	const regex = /\\(.)|"((?:\\["\\]|[^"])+)"|(D[Do]?|d{3,4}|d)|(M{1,4})|(YY(?:YY)?)|([aA])|([Hh]{1,2})|(m{1,2})|(s{1,2})|(S{1,4})|./g;
	const regexGroups = {
		1: ({ token }) => token.replace(/\\(.)/g, "$1"),
		2: (opts) => new Day(opts),
		3: (opts) => new Month(opts),
		4: (opts) => new Year(opts),
		5: (opts) => new Meridiem(opts),
		6: (opts) => new Hours(opts),
		7: (opts) => new Minutes(opts),
		8: (opts) => new Seconds(opts),
		9: (opts) => new Milliseconds(opts)
	};
	const dfltLocales = {
		months: "January,February,March,April,May,June,July,August,September,October,November,December".split(","),
		monthsShort: "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),
		weekdays: "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","),
		weekdaysShort: "Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(",")
	};
	/**
	* DatePrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Number} [opts.initial] Index of default value
	* @param {String} [opts.mask] The format mask
	* @param {object} [opts.locales] The date locales
	* @param {String} [opts.error] The error message shown on invalid value
	* @param {Function} [opts.validate] Function to validate the submitted value
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	*/
	var DatePrompt = class extends Prompt {
		constructor(opts = {}) {
			super(opts);
			this.msg = opts.message;
			this.cursor = 0;
			this.typed = "";
			this.locales = Object.assign(dfltLocales, opts.locales);
			this._date = opts.initial || /* @__PURE__ */ new Date();
			this.errorMsg = opts.error || "Please Enter A Valid Value";
			this.validator = opts.validate || (() => true);
			this.mask = opts.mask || "YYYY-MM-DD HH:mm:ss";
			this.clear = clear("", this.out.columns);
			this.render();
		}
		get value() {
			return this.date;
		}
		get date() {
			return this._date;
		}
		set date(date) {
			if (date) this._date.setTime(date.getTime());
		}
		set mask(mask) {
			let result;
			this.parts = [];
			while (result = regex.exec(mask)) {
				let match = result.shift();
				let idx = result.findIndex((gr) => gr != null);
				this.parts.push(idx in regexGroups ? regexGroups[idx]({
					token: result[idx] || match,
					date: this.date,
					parts: this.parts,
					locales: this.locales
				}) : result[idx] || match);
			}
			let parts = this.parts.reduce((arr, i) => {
				if (typeof i === "string" && typeof arr[arr.length - 1] === "string") arr[arr.length - 1] += i;
				else arr.push(i);
				return arr;
			}, []);
			this.parts.splice(0);
			this.parts.push(...parts);
			this.reset();
		}
		moveCursor(n) {
			this.typed = "";
			this.cursor = n;
			this.fire();
		}
		reset() {
			this.moveCursor(this.parts.findIndex((p) => p instanceof DatePart));
			this.fire();
			this.render();
		}
		exit() {
			this.abort();
		}
		abort() {
			this.done = this.aborted = true;
			this.error = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		validate() {
			var _this = this;
			return _asyncToGenerator(function* () {
				let valid = yield _this.validator(_this.value);
				if (typeof valid === "string") {
					_this.errorMsg = valid;
					valid = false;
				}
				_this.error = !valid;
			})();
		}
		submit() {
			var _this2 = this;
			return _asyncToGenerator(function* () {
				yield _this2.validate();
				if (_this2.error) {
					_this2.color = "red";
					_this2.fire();
					_this2.render();
					return;
				}
				_this2.done = true;
				_this2.aborted = false;
				_this2.fire();
				_this2.render();
				_this2.out.write("\n");
				_this2.close();
			})();
		}
		up() {
			this.typed = "";
			this.parts[this.cursor].up();
			this.render();
		}
		down() {
			this.typed = "";
			this.parts[this.cursor].down();
			this.render();
		}
		left() {
			let prev = this.parts[this.cursor].prev();
			if (prev == null) return this.bell();
			this.moveCursor(this.parts.indexOf(prev));
			this.render();
		}
		right() {
			let next = this.parts[this.cursor].next();
			if (next == null) return this.bell();
			this.moveCursor(this.parts.indexOf(next));
			this.render();
		}
		next() {
			let next = this.parts[this.cursor].next();
			this.moveCursor(next ? this.parts.indexOf(next) : this.parts.findIndex((part) => part instanceof DatePart));
			this.render();
		}
		_(c) {
			if (/\d/.test(c)) {
				this.typed += c;
				this.parts[this.cursor].setTo(this.typed);
				this.render();
			}
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor.hide);
			else this.out.write(clear(this.outputText, this.out.columns));
			super.render();
			this.outputText = [
				style.symbol(this.done, this.aborted),
				color.bold(this.msg),
				style.delimiter(false),
				this.parts.reduce((arr, p, idx) => arr.concat(idx === this.cursor && !this.done ? color.cyan().underline(p.toString()) : p), []).join("")
			].join(" ");
			if (this.error) this.outputText += this.errorMsg.split("\n").reduce((a, l, i) => a + `\n${i ? ` ` : figures.pointerSmall} ${color.red().italic(l)}`, ``);
			this.out.write(erase.line + cursor.to(0) + this.outputText);
		}
	};
	module.exports = DatePrompt;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/number.js
var require_number$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
		try {
			var info = gen[key](arg);
			var value = info.value;
		} catch (error) {
			reject(error);
			return;
		}
		if (info.done) resolve(value);
		else Promise.resolve(value).then(_next, _throw);
	}
	function _asyncToGenerator(fn) {
		return function() {
			var self = this, args = arguments;
			return new Promise(function(resolve, reject) {
				var gen = fn.apply(self, args);
				function _next(value) {
					asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
				}
				function _throw(err) {
					asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
				}
				_next(void 0);
			});
		};
	}
	const color = require_kleur();
	const Prompt = require_prompt$1();
	const _require = require_src(), cursor = _require.cursor, erase = _require.erase;
	const _require2 = require_util$1(), style = _require2.style, figures = _require2.figures, clear = _require2.clear, lines = _require2.lines;
	const isNumber = /[0-9]/;
	const isDef = (any) => any !== void 0;
	const round = (number, precision) => {
		let factor = Math.pow(10, precision);
		return Math.round(number * factor) / factor;
	};
	/**
	* NumberPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {String} [opts.style='default'] Render style
	* @param {Number} [opts.initial] Default value
	* @param {Number} [opts.max=+Infinity] Max value
	* @param {Number} [opts.min=-Infinity] Min value
	* @param {Boolean} [opts.float=false] Parse input as floats
	* @param {Number} [opts.round=2] Round floats to x decimals
	* @param {Number} [opts.increment=1] Number to increment by when using arrow-keys
	* @param {Function} [opts.validate] Validate function
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	* @param {String} [opts.error] The invalid error label
	*/
	var NumberPrompt = class extends Prompt {
		constructor(opts = {}) {
			super(opts);
			this.transform = style.render(opts.style);
			this.msg = opts.message;
			this.initial = isDef(opts.initial) ? opts.initial : "";
			this.float = !!opts.float;
			this.round = opts.round || 2;
			this.inc = opts.increment || 1;
			this.min = isDef(opts.min) ? opts.min : -Infinity;
			this.max = isDef(opts.max) ? opts.max : Infinity;
			this.errorMsg = opts.error || `Please Enter A Valid Value`;
			this.validator = opts.validate || (() => true);
			this.color = `cyan`;
			this.value = ``;
			this.typed = ``;
			this.lastHit = 0;
			this.render();
		}
		set value(v) {
			if (!v && v !== 0) {
				this.placeholder = true;
				this.rendered = color.gray(this.transform.render(`${this.initial}`));
				this._value = ``;
			} else {
				this.placeholder = false;
				this.rendered = this.transform.render(`${round(v, this.round)}`);
				this._value = round(v, this.round);
			}
			this.fire();
		}
		get value() {
			return this._value;
		}
		parse(x) {
			return this.float ? parseFloat(x) : parseInt(x);
		}
		valid(c) {
			return c === `-` || c === `.` && this.float || isNumber.test(c);
		}
		reset() {
			this.typed = ``;
			this.value = ``;
			this.fire();
			this.render();
		}
		exit() {
			this.abort();
		}
		abort() {
			let x = this.value;
			this.value = x !== `` ? x : this.initial;
			this.done = this.aborted = true;
			this.error = false;
			this.fire();
			this.render();
			this.out.write(`\n`);
			this.close();
		}
		validate() {
			var _this = this;
			return _asyncToGenerator(function* () {
				let valid = yield _this.validator(_this.value);
				if (typeof valid === `string`) {
					_this.errorMsg = valid;
					valid = false;
				}
				_this.error = !valid;
			})();
		}
		submit() {
			var _this2 = this;
			return _asyncToGenerator(function* () {
				yield _this2.validate();
				if (_this2.error) {
					_this2.color = `red`;
					_this2.fire();
					_this2.render();
					return;
				}
				let x = _this2.value;
				_this2.value = x !== `` ? x : _this2.initial;
				_this2.done = true;
				_this2.aborted = false;
				_this2.error = false;
				_this2.fire();
				_this2.render();
				_this2.out.write(`\n`);
				_this2.close();
			})();
		}
		up() {
			this.typed = ``;
			if (this.value === "") this.value = this.min - this.inc;
			if (this.value >= this.max) return this.bell();
			this.value += this.inc;
			this.color = `cyan`;
			this.fire();
			this.render();
		}
		down() {
			this.typed = ``;
			if (this.value === "") this.value = this.min + this.inc;
			if (this.value <= this.min) return this.bell();
			this.value -= this.inc;
			this.color = `cyan`;
			this.fire();
			this.render();
		}
		delete() {
			let val = this.value.toString();
			if (val.length === 0) return this.bell();
			this.value = this.parse(val = val.slice(0, -1)) || ``;
			if (this.value !== "" && this.value < this.min) this.value = this.min;
			this.color = `cyan`;
			this.fire();
			this.render();
		}
		next() {
			this.value = this.initial;
			this.fire();
			this.render();
		}
		_(c, key) {
			if (!this.valid(c)) return this.bell();
			const now = Date.now();
			if (now - this.lastHit > 1e3) this.typed = ``;
			this.typed += c;
			this.lastHit = now;
			this.color = `cyan`;
			if (c === `.`) return this.fire();
			this.value = Math.min(this.parse(this.typed), this.max);
			if (this.value > this.max) this.value = this.max;
			if (this.value < this.min) this.value = this.min;
			this.fire();
			this.render();
		}
		render() {
			if (this.closed) return;
			if (!this.firstRender) {
				if (this.outputError) this.out.write(cursor.down(lines(this.outputError, this.out.columns) - 1) + clear(this.outputError, this.out.columns));
				this.out.write(clear(this.outputText, this.out.columns));
			}
			super.render();
			this.outputError = "";
			this.outputText = [
				style.symbol(this.done, this.aborted),
				color.bold(this.msg),
				style.delimiter(this.done),
				!this.done || !this.done && !this.placeholder ? color[this.color]().underline(this.rendered) : this.rendered
			].join(` `);
			if (this.error) this.outputError += this.errorMsg.split(`\n`).reduce((a, l, i) => a + `\n${i ? ` ` : figures.pointerSmall} ${color.red().italic(l)}`, ``);
			this.out.write(erase.line + cursor.to(0) + this.outputText + cursor.save + this.outputError + cursor.restore);
		}
	};
	module.exports = NumberPrompt;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/multiselect.js
var require_multiselect$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const color = require_kleur();
	const cursor = require_src().cursor;
	const Prompt = require_prompt$1();
	const _require2 = require_util$1(), clear = _require2.clear, figures = _require2.figures, style = _require2.style, wrap = _require2.wrap, entriesToDisplay = _require2.entriesToDisplay;
	/**
	* MultiselectPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Array} opts.choices Array of choice objects
	* @param {String} [opts.hint] Hint to display
	* @param {String} [opts.warn] Hint shown for disabled choices
	* @param {Number} [opts.max] Max choices
	* @param {Number} [opts.cursor=0] Cursor start position
	* @param {Number} [opts.optionsPerPage=10] Max options to display at once
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	*/
	var MultiselectPrompt = class extends Prompt {
		constructor(opts = {}) {
			super(opts);
			this.msg = opts.message;
			this.cursor = opts.cursor || 0;
			this.scrollIndex = opts.cursor || 0;
			this.hint = opts.hint || "";
			this.warn = opts.warn || "- This option is disabled -";
			this.minSelected = opts.min;
			this.showMinError = false;
			this.maxChoices = opts.max;
			this.instructions = opts.instructions;
			this.optionsPerPage = opts.optionsPerPage || 10;
			this.value = opts.choices.map((ch, idx) => {
				if (typeof ch === "string") ch = {
					title: ch,
					value: idx
				};
				return {
					title: ch && (ch.title || ch.value || ch),
					description: ch && ch.description,
					value: ch && (ch.value === void 0 ? idx : ch.value),
					selected: ch && ch.selected,
					disabled: ch && ch.disabled
				};
			});
			this.clear = clear("", this.out.columns);
			if (!opts.overrideRender) this.render();
		}
		reset() {
			this.value.map((v) => !v.selected);
			this.cursor = 0;
			this.fire();
			this.render();
		}
		selected() {
			return this.value.filter((v) => v.selected);
		}
		exit() {
			this.abort();
		}
		abort() {
			this.done = this.aborted = true;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		submit() {
			const selected = this.value.filter((e) => e.selected);
			if (this.minSelected && selected.length < this.minSelected) {
				this.showMinError = true;
				this.render();
			} else {
				this.done = true;
				this.aborted = false;
				this.fire();
				this.render();
				this.out.write("\n");
				this.close();
			}
		}
		first() {
			this.cursor = 0;
			this.render();
		}
		last() {
			this.cursor = this.value.length - 1;
			this.render();
		}
		next() {
			this.cursor = (this.cursor + 1) % this.value.length;
			this.render();
		}
		up() {
			if (this.cursor === 0) this.cursor = this.value.length - 1;
			else this.cursor--;
			this.render();
		}
		down() {
			if (this.cursor === this.value.length - 1) this.cursor = 0;
			else this.cursor++;
			this.render();
		}
		left() {
			this.value[this.cursor].selected = false;
			this.render();
		}
		right() {
			if (this.value.filter((e) => e.selected).length >= this.maxChoices) return this.bell();
			this.value[this.cursor].selected = true;
			this.render();
		}
		handleSpaceToggle() {
			const v = this.value[this.cursor];
			if (v.selected) {
				v.selected = false;
				this.render();
			} else if (v.disabled || this.value.filter((e) => e.selected).length >= this.maxChoices) return this.bell();
			else {
				v.selected = true;
				this.render();
			}
		}
		toggleAll() {
			if (this.maxChoices !== void 0 || this.value[this.cursor].disabled) return this.bell();
			const newSelected = !this.value[this.cursor].selected;
			this.value.filter((v) => !v.disabled).forEach((v) => v.selected = newSelected);
			this.render();
		}
		_(c, key) {
			if (c === " ") this.handleSpaceToggle();
			else if (c === "a") this.toggleAll();
			else return this.bell();
		}
		renderInstructions() {
			if (this.instructions === void 0 || this.instructions) {
				if (typeof this.instructions === "string") return this.instructions;
				return `
Instructions:
    ${figures.arrowUp}/${figures.arrowDown}: Highlight option\n    ${figures.arrowLeft}/${figures.arrowRight}/[space]: Toggle selection\n` + (this.maxChoices === void 0 ? `    a: Toggle all\n` : "") + `    enter/return: Complete answer`;
			}
			return "";
		}
		renderOption(cursor, v, i, arrowIndicator) {
			const prefix = (v.selected ? color.green(figures.radioOn) : figures.radioOff) + " " + arrowIndicator + " ";
			let title, desc;
			if (v.disabled) title = cursor === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
			else {
				title = cursor === i ? color.cyan().underline(v.title) : v.title;
				if (cursor === i && v.description) {
					desc = ` - ${v.description}`;
					if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) desc = "\n" + wrap(v.description, {
						margin: prefix.length,
						width: this.out.columns
					});
				}
			}
			return prefix + title + color.gray(desc || "");
		}
		paginateOptions(options) {
			if (options.length === 0) return color.red("No matches for this query.");
			let _entriesToDisplay = entriesToDisplay(this.cursor, options.length, this.optionsPerPage), startIndex = _entriesToDisplay.startIndex, endIndex = _entriesToDisplay.endIndex;
			let prefix, styledOptions = [];
			for (let i = startIndex; i < endIndex; i++) {
				if (i === startIndex && startIndex > 0) prefix = figures.arrowUp;
				else if (i === endIndex - 1 && endIndex < options.length) prefix = figures.arrowDown;
				else prefix = " ";
				styledOptions.push(this.renderOption(this.cursor, options[i], i, prefix));
			}
			return "\n" + styledOptions.join("\n");
		}
		renderOptions(options) {
			if (!this.done) return this.paginateOptions(options);
			return "";
		}
		renderDoneOrInstructions() {
			if (this.done) return this.value.filter((e) => e.selected).map((v) => v.title).join(", ");
			const output = [color.gray(this.hint), this.renderInstructions()];
			if (this.value[this.cursor].disabled) output.push(color.yellow(this.warn));
			return output.join(" ");
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor.hide);
			super.render();
			let prompt = [
				style.symbol(this.done, this.aborted),
				color.bold(this.msg),
				style.delimiter(false),
				this.renderDoneOrInstructions()
			].join(" ");
			if (this.showMinError) {
				prompt += color.red(`You must select a minimum of ${this.minSelected} choices.`);
				this.showMinError = false;
			}
			prompt += this.renderOptions(this.value);
			this.out.write(this.clear + prompt);
			this.clear = clear(prompt, this.out.columns);
		}
	};
	module.exports = MultiselectPrompt;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/autocomplete.js
var require_autocomplete$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
		try {
			var info = gen[key](arg);
			var value = info.value;
		} catch (error) {
			reject(error);
			return;
		}
		if (info.done) resolve(value);
		else Promise.resolve(value).then(_next, _throw);
	}
	function _asyncToGenerator(fn) {
		return function() {
			var self = this, args = arguments;
			return new Promise(function(resolve, reject) {
				var gen = fn.apply(self, args);
				function _next(value) {
					asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
				}
				function _throw(err) {
					asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
				}
				_next(void 0);
			});
		};
	}
	const color = require_kleur();
	const Prompt = require_prompt$1();
	const _require = require_src(), erase = _require.erase, cursor = _require.cursor;
	const _require2 = require_util$1(), style = _require2.style, clear = _require2.clear, figures = _require2.figures, wrap = _require2.wrap, entriesToDisplay = _require2.entriesToDisplay;
	const getVal = (arr, i) => arr[i] && (arr[i].value || arr[i].title || arr[i]);
	const getTitle = (arr, i) => arr[i] && (arr[i].title || arr[i].value || arr[i]);
	const getIndex = (arr, valOrTitle) => {
		const index = arr.findIndex((el) => el.value === valOrTitle || el.title === valOrTitle);
		return index > -1 ? index : void 0;
	};
	/**
	* TextPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Array} opts.choices Array of auto-complete choices objects
	* @param {Function} [opts.suggest] Filter function. Defaults to sort by title
	* @param {Number} [opts.limit=10] Max number of results to show
	* @param {Number} [opts.cursor=0] Cursor start position
	* @param {String} [opts.style='default'] Render style
	* @param {String} [opts.fallback] Fallback message - initial to default value
	* @param {String} [opts.initial] Index of the default value
	* @param {Boolean} [opts.clearFirst] The first ESCAPE keypress will clear the input
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	* @param {String} [opts.noMatches] The no matches found label
	*/
	var AutocompletePrompt = class extends Prompt {
		constructor(opts = {}) {
			super(opts);
			this.msg = opts.message;
			this.suggest = opts.suggest;
			this.choices = opts.choices;
			this.initial = typeof opts.initial === "number" ? opts.initial : getIndex(opts.choices, opts.initial);
			this.select = this.initial || opts.cursor || 0;
			this.i18n = { noMatches: opts.noMatches || "no matches found" };
			this.fallback = opts.fallback || this.initial;
			this.clearFirst = opts.clearFirst || false;
			this.suggestions = [];
			this.input = "";
			this.limit = opts.limit || 10;
			this.cursor = 0;
			this.transform = style.render(opts.style);
			this.scale = this.transform.scale;
			this.render = this.render.bind(this);
			this.complete = this.complete.bind(this);
			this.clear = clear("", this.out.columns);
			this.complete(this.render);
			this.render();
		}
		set fallback(fb) {
			this._fb = Number.isSafeInteger(parseInt(fb)) ? parseInt(fb) : fb;
		}
		get fallback() {
			let choice;
			if (typeof this._fb === "number") choice = this.choices[this._fb];
			else if (typeof this._fb === "string") choice = { title: this._fb };
			return choice || this._fb || { title: this.i18n.noMatches };
		}
		moveSelect(i) {
			this.select = i;
			if (this.suggestions.length > 0) this.value = getVal(this.suggestions, i);
			else this.value = this.fallback.value;
			this.fire();
		}
		complete(cb) {
			var _this = this;
			return _asyncToGenerator(function* () {
				const p = _this.completing = _this.suggest(_this.input, _this.choices);
				const suggestions = yield p;
				if (_this.completing !== p) return;
				_this.suggestions = suggestions.map((s, i, arr) => ({
					title: getTitle(arr, i),
					value: getVal(arr, i),
					description: s.description
				}));
				_this.completing = false;
				const l = Math.max(suggestions.length - 1, 0);
				_this.moveSelect(Math.min(l, _this.select));
				cb && cb();
			})();
		}
		reset() {
			this.input = "";
			this.complete(() => {
				this.moveSelect(this.initial !== void 0 ? this.initial : 0);
				this.render();
			});
			this.render();
		}
		exit() {
			if (this.clearFirst && this.input.length > 0) this.reset();
			else {
				this.done = this.exited = true;
				this.aborted = false;
				this.fire();
				this.render();
				this.out.write("\n");
				this.close();
			}
		}
		abort() {
			this.done = this.aborted = true;
			this.exited = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		submit() {
			this.done = true;
			this.aborted = this.exited = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		_(c, key) {
			let s1 = this.input.slice(0, this.cursor);
			this.input = `${s1}${c}${this.input.slice(this.cursor)}`;
			this.cursor = s1.length + 1;
			this.complete(this.render);
			this.render();
		}
		delete() {
			if (this.cursor === 0) return this.bell();
			this.input = `${this.input.slice(0, this.cursor - 1)}${this.input.slice(this.cursor)}`;
			this.complete(this.render);
			this.cursor = this.cursor - 1;
			this.render();
		}
		deleteForward() {
			if (this.cursor * this.scale >= this.rendered.length) return this.bell();
			this.input = `${this.input.slice(0, this.cursor)}${this.input.slice(this.cursor + 1)}`;
			this.complete(this.render);
			this.render();
		}
		first() {
			this.moveSelect(0);
			this.render();
		}
		last() {
			this.moveSelect(this.suggestions.length - 1);
			this.render();
		}
		up() {
			if (this.select === 0) this.moveSelect(this.suggestions.length - 1);
			else this.moveSelect(this.select - 1);
			this.render();
		}
		down() {
			if (this.select === this.suggestions.length - 1) this.moveSelect(0);
			else this.moveSelect(this.select + 1);
			this.render();
		}
		next() {
			if (this.select === this.suggestions.length - 1) this.moveSelect(0);
			else this.moveSelect(this.select + 1);
			this.render();
		}
		nextPage() {
			this.moveSelect(Math.min(this.select + this.limit, this.suggestions.length - 1));
			this.render();
		}
		prevPage() {
			this.moveSelect(Math.max(this.select - this.limit, 0));
			this.render();
		}
		left() {
			if (this.cursor <= 0) return this.bell();
			this.cursor = this.cursor - 1;
			this.render();
		}
		right() {
			if (this.cursor * this.scale >= this.rendered.length) return this.bell();
			this.cursor = this.cursor + 1;
			this.render();
		}
		renderOption(v, hovered, isStart, isEnd) {
			let desc;
			let prefix = isStart ? figures.arrowUp : isEnd ? figures.arrowDown : " ";
			let title = hovered ? color.cyan().underline(v.title) : v.title;
			prefix = (hovered ? color.cyan(figures.pointer) + " " : "  ") + prefix;
			if (v.description) {
				desc = ` - ${v.description}`;
				if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) desc = "\n" + wrap(v.description, {
					margin: 3,
					width: this.out.columns
				});
			}
			return prefix + " " + title + color.gray(desc || "");
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor.hide);
			else this.out.write(clear(this.outputText, this.out.columns));
			super.render();
			let _entriesToDisplay = entriesToDisplay(this.select, this.choices.length, this.limit), startIndex = _entriesToDisplay.startIndex, endIndex = _entriesToDisplay.endIndex;
			this.outputText = [
				style.symbol(this.done, this.aborted, this.exited),
				color.bold(this.msg),
				style.delimiter(this.completing),
				this.done && this.suggestions[this.select] ? this.suggestions[this.select].title : this.rendered = this.transform.render(this.input)
			].join(" ");
			if (!this.done) {
				const suggestions = this.suggestions.slice(startIndex, endIndex).map((item, i) => this.renderOption(item, this.select === i + startIndex, i === 0 && startIndex > 0, i + startIndex === endIndex - 1 && endIndex < this.choices.length)).join("\n");
				this.outputText += `\n` + (suggestions || color.gray(this.fallback.title));
			}
			this.out.write(erase.line + cursor.to(0) + this.outputText);
		}
	};
	module.exports = AutocompletePrompt;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/autocompleteMultiselect.js
var require_autocompleteMultiselect$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const color = require_kleur();
	const cursor = require_src().cursor;
	const MultiselectPrompt = require_multiselect$1();
	const _require2 = require_util$1(), clear = _require2.clear, style = _require2.style, figures = _require2.figures;
	/**
	* MultiselectPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Array} opts.choices Array of choice objects
	* @param {String} [opts.hint] Hint to display
	* @param {String} [opts.warn] Hint shown for disabled choices
	* @param {Number} [opts.max] Max choices
	* @param {Number} [opts.cursor=0] Cursor start position
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	*/
	var AutocompleteMultiselectPrompt = class extends MultiselectPrompt {
		constructor(opts = {}) {
			opts.overrideRender = true;
			super(opts);
			this.inputValue = "";
			this.clear = clear("", this.out.columns);
			this.filteredOptions = this.value;
			this.render();
		}
		last() {
			this.cursor = this.filteredOptions.length - 1;
			this.render();
		}
		next() {
			this.cursor = (this.cursor + 1) % this.filteredOptions.length;
			this.render();
		}
		up() {
			if (this.cursor === 0) this.cursor = this.filteredOptions.length - 1;
			else this.cursor--;
			this.render();
		}
		down() {
			if (this.cursor === this.filteredOptions.length - 1) this.cursor = 0;
			else this.cursor++;
			this.render();
		}
		left() {
			this.filteredOptions[this.cursor].selected = false;
			this.render();
		}
		right() {
			if (this.value.filter((e) => e.selected).length >= this.maxChoices) return this.bell();
			this.filteredOptions[this.cursor].selected = true;
			this.render();
		}
		delete() {
			if (this.inputValue.length) {
				this.inputValue = this.inputValue.substr(0, this.inputValue.length - 1);
				this.updateFilteredOptions();
			}
		}
		updateFilteredOptions() {
			const currentHighlight = this.filteredOptions[this.cursor];
			this.filteredOptions = this.value.filter((v) => {
				if (this.inputValue) {
					if (typeof v.title === "string") {
						if (v.title.toLowerCase().includes(this.inputValue.toLowerCase())) return true;
					}
					if (typeof v.value === "string") {
						if (v.value.toLowerCase().includes(this.inputValue.toLowerCase())) return true;
					}
					return false;
				}
				return true;
			});
			const newHighlightIndex = this.filteredOptions.findIndex((v) => v === currentHighlight);
			this.cursor = newHighlightIndex < 0 ? 0 : newHighlightIndex;
			this.render();
		}
		handleSpaceToggle() {
			const v = this.filteredOptions[this.cursor];
			if (v.selected) {
				v.selected = false;
				this.render();
			} else if (v.disabled || this.value.filter((e) => e.selected).length >= this.maxChoices) return this.bell();
			else {
				v.selected = true;
				this.render();
			}
		}
		handleInputChange(c) {
			this.inputValue = this.inputValue + c;
			this.updateFilteredOptions();
		}
		_(c, key) {
			if (c === " ") this.handleSpaceToggle();
			else this.handleInputChange(c);
		}
		renderInstructions() {
			if (this.instructions === void 0 || this.instructions) {
				if (typeof this.instructions === "string") return this.instructions;
				return `
Instructions:
    ${figures.arrowUp}/${figures.arrowDown}: Highlight option
    ${figures.arrowLeft}/${figures.arrowRight}/[space]: Toggle selection
    [a,b,c]/delete: Filter choices
    enter/return: Complete answer
`;
			}
			return "";
		}
		renderCurrentInput() {
			return `
Filtered results for: ${this.inputValue ? this.inputValue : color.gray("Enter something to filter")}\n`;
		}
		renderOption(cursor, v, i) {
			let title;
			if (v.disabled) title = cursor === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
			else title = cursor === i ? color.cyan().underline(v.title) : v.title;
			return (v.selected ? color.green(figures.radioOn) : figures.radioOff) + "  " + title;
		}
		renderDoneOrInstructions() {
			if (this.done) return this.value.filter((e) => e.selected).map((v) => v.title).join(", ");
			const output = [
				color.gray(this.hint),
				this.renderInstructions(),
				this.renderCurrentInput()
			];
			if (this.filteredOptions.length && this.filteredOptions[this.cursor].disabled) output.push(color.yellow(this.warn));
			return output.join(" ");
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor.hide);
			super.render();
			let prompt = [
				style.symbol(this.done, this.aborted),
				color.bold(this.msg),
				style.delimiter(false),
				this.renderDoneOrInstructions()
			].join(" ");
			if (this.showMinError) {
				prompt += color.red(`You must select a minimum of ${this.minSelected} choices.`);
				this.showMinError = false;
			}
			prompt += this.renderOptions(this.filteredOptions);
			this.out.write(this.clear + prompt);
			this.clear = clear(prompt, this.out.columns);
		}
	};
	module.exports = AutocompleteMultiselectPrompt;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/confirm.js
var require_confirm$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const color = require_kleur();
	const Prompt = require_prompt$1();
	const _require = require_util$1(), style = _require.style, clear = _require.clear;
	const _require2 = require_src(), erase = _require2.erase, cursor = _require2.cursor;
	/**
	* ConfirmPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Boolean} [opts.initial] Default value (true/false)
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	* @param {String} [opts.yes] The "Yes" label
	* @param {String} [opts.yesOption] The "Yes" option when choosing between yes/no
	* @param {String} [opts.no] The "No" label
	* @param {String} [opts.noOption] The "No" option when choosing between yes/no
	*/
	var ConfirmPrompt = class extends Prompt {
		constructor(opts = {}) {
			super(opts);
			this.msg = opts.message;
			this.value = opts.initial;
			this.initialValue = !!opts.initial;
			this.yesMsg = opts.yes || "yes";
			this.yesOption = opts.yesOption || "(Y/n)";
			this.noMsg = opts.no || "no";
			this.noOption = opts.noOption || "(y/N)";
			this.render();
		}
		reset() {
			this.value = this.initialValue;
			this.fire();
			this.render();
		}
		exit() {
			this.abort();
		}
		abort() {
			this.done = this.aborted = true;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		submit() {
			this.value = this.value || false;
			this.done = true;
			this.aborted = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		_(c, key) {
			if (c.toLowerCase() === "y") {
				this.value = true;
				return this.submit();
			}
			if (c.toLowerCase() === "n") {
				this.value = false;
				return this.submit();
			}
			return this.bell();
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor.hide);
			else this.out.write(clear(this.outputText, this.out.columns));
			super.render();
			this.outputText = [
				style.symbol(this.done, this.aborted),
				color.bold(this.msg),
				style.delimiter(this.done),
				this.done ? this.value ? this.yesMsg : this.noMsg : color.gray(this.initialValue ? this.yesOption : this.noOption)
			].join(" ");
			this.out.write(erase.line + cursor.to(0) + this.outputText);
		}
	};
	module.exports = ConfirmPrompt;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/index.js
var require_elements$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		TextPrompt: require_text$1(),
		SelectPrompt: require_select$1(),
		TogglePrompt: require_toggle$1(),
		DatePrompt: require_date$1(),
		NumberPrompt: require_number$1(),
		MultiselectPrompt: require_multiselect$1(),
		AutocompletePrompt: require_autocomplete$1(),
		AutocompleteMultiselectPrompt: require_autocompleteMultiselect$1(),
		ConfirmPrompt: require_confirm$1()
	};
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/prompts.js
var require_prompts$2 = /* @__PURE__ */ __commonJSMin(((exports) => {
	const $ = exports;
	const el = require_elements$1();
	const noop = (v) => v;
	function toPrompt(type, args, opts = {}) {
		return new Promise((res, rej) => {
			const p = new el[type](args);
			const onAbort = opts.onAbort || noop;
			const onSubmit = opts.onSubmit || noop;
			const onExit = opts.onExit || noop;
			p.on("state", args.onState || noop);
			p.on("submit", (x) => res(onSubmit(x)));
			p.on("exit", (x) => res(onExit(x)));
			p.on("abort", (x) => rej(onAbort(x)));
		});
	}
	/**
	* Text prompt
	* @param {string} args.message Prompt message to display
	* @param {string} [args.initial] Default string value
	* @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
	* @param {function} [args.onState] On state change callback
	* @param {function} [args.validate] Function to validate user input
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.text = (args) => toPrompt("TextPrompt", args);
	/**
	* Password prompt with masked input
	* @param {string} args.message Prompt message to display
	* @param {string} [args.initial] Default string value
	* @param {function} [args.onState] On state change callback
	* @param {function} [args.validate] Function to validate user input
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.password = (args) => {
		args.style = "password";
		return $.text(args);
	};
	/**
	* Prompt where input is invisible, like sudo
	* @param {string} args.message Prompt message to display
	* @param {string} [args.initial] Default string value
	* @param {function} [args.onState] On state change callback
	* @param {function} [args.validate] Function to validate user input
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.invisible = (args) => {
		args.style = "invisible";
		return $.text(args);
	};
	/**
	* Number prompt
	* @param {string} args.message Prompt message to display
	* @param {number} args.initial Default number value
	* @param {function} [args.onState] On state change callback
	* @param {number} [args.max] Max value
	* @param {number} [args.min] Min value
	* @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
	* @param {Boolean} [opts.float=false] Parse input as floats
	* @param {Number} [opts.round=2] Round floats to x decimals
	* @param {Number} [opts.increment=1] Number to increment by when using arrow-keys
	* @param {function} [args.validate] Function to validate user input
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.number = (args) => toPrompt("NumberPrompt", args);
	/**
	* Date prompt
	* @param {string} args.message Prompt message to display
	* @param {number} args.initial Default number value
	* @param {function} [args.onState] On state change callback
	* @param {number} [args.max] Max value
	* @param {number} [args.min] Min value
	* @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
	* @param {Boolean} [opts.float=false] Parse input as floats
	* @param {Number} [opts.round=2] Round floats to x decimals
	* @param {Number} [opts.increment=1] Number to increment by when using arrow-keys
	* @param {function} [args.validate] Function to validate user input
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.date = (args) => toPrompt("DatePrompt", args);
	/**
	* Classic yes/no prompt
	* @param {string} args.message Prompt message to display
	* @param {boolean} [args.initial=false] Default value
	* @param {function} [args.onState] On state change callback
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.confirm = (args) => toPrompt("ConfirmPrompt", args);
	/**
	* List prompt, split intput string by `seperator`
	* @param {string} args.message Prompt message to display
	* @param {string} [args.initial] Default string value
	* @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
	* @param {string} [args.separator] String separator
	* @param {function} [args.onState] On state change callback
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input, in form of an `Array`
	*/
	$.list = (args) => {
		const sep = args.separator || ",";
		return toPrompt("TextPrompt", args, { onSubmit: (str) => str.split(sep).map((s) => s.trim()) });
	};
	/**
	* Toggle/switch prompt
	* @param {string} args.message Prompt message to display
	* @param {boolean} [args.initial=false] Default value
	* @param {string} [args.active="on"] Text for `active` state
	* @param {string} [args.inactive="off"] Text for `inactive` state
	* @param {function} [args.onState] On state change callback
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.toggle = (args) => toPrompt("TogglePrompt", args);
	/**
	* Interactive select prompt
	* @param {string} args.message Prompt message to display
	* @param {Array} args.choices Array of choices objects `[{ title, value }, ...]`
	* @param {number} [args.initial] Index of default value
	* @param {String} [args.hint] Hint to display
	* @param {function} [args.onState] On state change callback
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.select = (args) => toPrompt("SelectPrompt", args);
	/**
	* Interactive multi-select / autocompleteMultiselect prompt
	* @param {string} args.message Prompt message to display
	* @param {Array} args.choices Array of choices objects `[{ title, value, [selected] }, ...]`
	* @param {number} [args.max] Max select
	* @param {string} [args.hint] Hint to display user
	* @param {Number} [args.cursor=0] Cursor start position
	* @param {function} [args.onState] On state change callback
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.multiselect = (args) => {
		args.choices = [].concat(args.choices || []);
		const toSelected = (items) => items.filter((item) => item.selected).map((item) => item.value);
		return toPrompt("MultiselectPrompt", args, {
			onAbort: toSelected,
			onSubmit: toSelected
		});
	};
	$.autocompleteMultiselect = (args) => {
		args.choices = [].concat(args.choices || []);
		const toSelected = (items) => items.filter((item) => item.selected).map((item) => item.value);
		return toPrompt("AutocompleteMultiselectPrompt", args, {
			onAbort: toSelected,
			onSubmit: toSelected
		});
	};
	const byTitle = (input, choices) => Promise.resolve(choices.filter((item) => item.title.slice(0, input.length).toLowerCase() === input.toLowerCase()));
	/**
	* Interactive auto-complete prompt
	* @param {string} args.message Prompt message to display
	* @param {Array} args.choices Array of auto-complete choices objects `[{ title, value }, ...]`
	* @param {Function} [args.suggest] Function to filter results based on user input. Defaults to sort by `title`
	* @param {number} [args.limit=10] Max number of results to show
	* @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
	* @param {String} [args.initial] Index of the default value
	* @param {boolean} [opts.clearFirst] The first ESCAPE keypress will clear the input
	* @param {String} [args.fallback] Fallback message - defaults to initial value
	* @param {function} [args.onState] On state change callback
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.autocomplete = (args) => {
		args.suggest = args.suggest || byTitle;
		args.choices = [].concat(args.choices || []);
		return toPrompt("AutocompletePrompt", args);
	};
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/index.js
var require_dist = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function ownKeys(object, enumerableOnly) {
		var keys = Object.keys(object);
		if (Object.getOwnPropertySymbols) {
			var symbols = Object.getOwnPropertySymbols(object);
			if (enumerableOnly) symbols = symbols.filter(function(sym) {
				return Object.getOwnPropertyDescriptor(object, sym).enumerable;
			});
			keys.push.apply(keys, symbols);
		}
		return keys;
	}
	function _objectSpread(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i] != null ? arguments[i] : {};
			if (i % 2) ownKeys(Object(source), true).forEach(function(key) {
				_defineProperty(target, key, source[key]);
			});
			else if (Object.getOwnPropertyDescriptors) Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
			else ownKeys(Object(source)).forEach(function(key) {
				Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
			});
		}
		return target;
	}
	function _defineProperty(obj, key, value) {
		if (key in obj) Object.defineProperty(obj, key, {
			value,
			enumerable: true,
			configurable: true,
			writable: true
		});
		else obj[key] = value;
		return obj;
	}
	function _createForOfIteratorHelper(o, allowArrayLike) {
		var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
		if (!it) {
			if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
				if (it) o = it;
				var i = 0;
				var F = function F() {};
				return {
					s: F,
					n: function n() {
						if (i >= o.length) return { done: true };
						return {
							done: false,
							value: o[i++]
						};
					},
					e: function e(_e) {
						throw _e;
					},
					f: F
				};
			}
			throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
		}
		var normalCompletion = true, didErr = false, err;
		return {
			s: function s() {
				it = it.call(o);
			},
			n: function n() {
				var step = it.next();
				normalCompletion = step.done;
				return step;
			},
			e: function e(_e2) {
				didErr = true;
				err = _e2;
			},
			f: function f() {
				try {
					if (!normalCompletion && it.return != null) it.return();
				} finally {
					if (didErr) throw err;
				}
			}
		};
	}
	function _unsupportedIterableToArray(o, minLen) {
		if (!o) return;
		if (typeof o === "string") return _arrayLikeToArray(o, minLen);
		var n = Object.prototype.toString.call(o).slice(8, -1);
		if (n === "Object" && o.constructor) n = o.constructor.name;
		if (n === "Map" || n === "Set") return Array.from(o);
		if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
	}
	function _arrayLikeToArray(arr, len) {
		if (len == null || len > arr.length) len = arr.length;
		for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
		return arr2;
	}
	function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
		try {
			var info = gen[key](arg);
			var value = info.value;
		} catch (error) {
			reject(error);
			return;
		}
		if (info.done) resolve(value);
		else Promise.resolve(value).then(_next, _throw);
	}
	function _asyncToGenerator(fn) {
		return function() {
			var self = this, args = arguments;
			return new Promise(function(resolve, reject) {
				var gen = fn.apply(self, args);
				function _next(value) {
					asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
				}
				function _throw(err) {
					asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
				}
				_next(void 0);
			});
		};
	}
	const prompts = require_prompts$2();
	const passOn = [
		"suggest",
		"format",
		"onState",
		"validate",
		"onRender",
		"type"
	];
	const noop = () => {};
	/**
	* Prompt for a series of questions
	* @param {Array|Object} questions Single question object or Array of question objects
	* @param {Function} [onSubmit] Callback function called on prompt submit
	* @param {Function} [onCancel] Callback function called on cancel/abort
	* @returns {Object} Object with values from user input
	*/
	function prompt() {
		return _prompt.apply(this, arguments);
	}
	function _prompt() {
		_prompt = _asyncToGenerator(function* (questions = [], { onSubmit = noop, onCancel = noop } = {}) {
			const answers = {};
			const override = prompt._override || {};
			questions = [].concat(questions);
			let answer, question, quit, name, type, lastPrompt;
			const getFormattedAnswer = /* @__PURE__ */ function() {
				var _ref = _asyncToGenerator(function* (question, answer, skipValidation = false) {
					if (!skipValidation && question.validate && question.validate(answer) !== true) return;
					return question.format ? yield question.format(answer, answers) : answer;
				});
				return function getFormattedAnswer(_x, _x2) {
					return _ref.apply(this, arguments);
				};
			}();
			var _iterator = _createForOfIteratorHelper(questions), _step;
			try {
				for (_iterator.s(); !(_step = _iterator.n()).done;) {
					question = _step.value;
					var _question = question;
					name = _question.name;
					type = _question.type;
					if (typeof type === "function") {
						type = yield type(answer, _objectSpread({}, answers), question);
						question["type"] = type;
					}
					if (!type) continue;
					for (let key in question) {
						if (passOn.includes(key)) continue;
						let value = question[key];
						question[key] = typeof value === "function" ? yield value(answer, _objectSpread({}, answers), lastPrompt) : value;
					}
					lastPrompt = question;
					if (typeof question.message !== "string") throw new Error("prompt message is required");
					var _question2 = question;
					name = _question2.name;
					type = _question2.type;
					if (prompts[type] === void 0) throw new Error(`prompt type (${type}) is not defined`);
					if (override[question.name] !== void 0) {
						answer = yield getFormattedAnswer(question, override[question.name]);
						if (answer !== void 0) {
							answers[name] = answer;
							continue;
						}
					}
					try {
						answer = prompt._injected ? getInjectedAnswer(prompt._injected, question.initial) : yield prompts[type](question);
						answers[name] = answer = yield getFormattedAnswer(question, answer, true);
						quit = yield onSubmit(question, answer, answers);
					} catch (err) {
						quit = !(yield onCancel(question, answers));
					}
					if (quit) return answers;
				}
			} catch (err) {
				_iterator.e(err);
			} finally {
				_iterator.f();
			}
			return answers;
		});
		return _prompt.apply(this, arguments);
	}
	function getInjectedAnswer(injected, deafultValue) {
		const answer = injected.shift();
		if (answer instanceof Error) throw answer;
		return answer === void 0 ? deafultValue : answer;
	}
	function inject(answers) {
		prompt._injected = (prompt._injected || []).concat(answers);
	}
	function override(answers) {
		prompt._override = Object.assign({}, answers);
	}
	module.exports = Object.assign(prompt, {
		prompt,
		prompts,
		inject,
		override
	});
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/util/action.js
var require_action = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = (key, isSelect) => {
		if (key.meta && key.name !== "escape") return;
		if (key.ctrl) {
			if (key.name === "a") return "first";
			if (key.name === "c") return "abort";
			if (key.name === "d") return "abort";
			if (key.name === "e") return "last";
			if (key.name === "g") return "reset";
		}
		if (isSelect) {
			if (key.name === "j") return "down";
			if (key.name === "k") return "up";
		}
		if (key.name === "return") return "submit";
		if (key.name === "enter") return "submit";
		if (key.name === "backspace") return "delete";
		if (key.name === "delete") return "deleteForward";
		if (key.name === "abort") return "abort";
		if (key.name === "escape") return "exit";
		if (key.name === "tab") return "next";
		if (key.name === "pagedown") return "nextPage";
		if (key.name === "pageup") return "prevPage";
		if (key.name === "home") return "home";
		if (key.name === "end") return "end";
		if (key.name === "up") return "up";
		if (key.name === "down") return "down";
		if (key.name === "right") return "right";
		if (key.name === "left") return "left";
		return false;
	};
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/util/strip.js
var require_strip = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = (str) => {
		const pattern = ["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)", "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))"].join("|");
		const RGX = new RegExp(pattern, "g");
		return typeof str === "string" ? str.replace(RGX, "") : str;
	};
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/util/clear.js
var require_clear = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const strip = require_strip();
	const { erase, cursor } = require_src();
	const width = (str) => [...strip(str)].length;
	/**
	* @param {string} prompt
	* @param {number} perLine
	*/
	module.exports = function(prompt, perLine) {
		if (!perLine) return erase.line + cursor.to(0);
		let rows = 0;
		const lines = prompt.split(/\r?\n/);
		for (let line of lines) rows += 1 + Math.floor(Math.max(width(line) - 1, 0) / perLine);
		return erase.lines(rows);
	};
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/util/figures.js
var require_figures = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const main = {
		arrowUp: "↑",
		arrowDown: "↓",
		arrowLeft: "←",
		arrowRight: "→",
		radioOn: "◉",
		radioOff: "◯",
		tick: "✔",
		cross: "✖",
		ellipsis: "…",
		pointerSmall: "›",
		line: "─",
		pointer: "❯"
	};
	const win = {
		arrowUp: main.arrowUp,
		arrowDown: main.arrowDown,
		arrowLeft: main.arrowLeft,
		arrowRight: main.arrowRight,
		radioOn: "(*)",
		radioOff: "( )",
		tick: "√",
		cross: "×",
		ellipsis: "...",
		pointerSmall: "»",
		line: "─",
		pointer: ">"
	};
	module.exports = process.platform === "win32" ? win : main;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/util/style.js
var require_style = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const c = require_kleur();
	const figures = require_figures();
	const styles = Object.freeze({
		password: {
			scale: 1,
			render: (input) => "*".repeat(input.length)
		},
		emoji: {
			scale: 2,
			render: (input) => "😃".repeat(input.length)
		},
		invisible: {
			scale: 0,
			render: (input) => ""
		},
		default: {
			scale: 1,
			render: (input) => `${input}`
		}
	});
	const render = (type) => styles[type] || styles.default;
	const symbols = Object.freeze({
		aborted: c.red(figures.cross),
		done: c.green(figures.tick),
		exited: c.yellow(figures.cross),
		default: c.cyan("?")
	});
	const symbol = (done, aborted, exited) => aborted ? symbols.aborted : exited ? symbols.exited : done ? symbols.done : symbols.default;
	const delimiter = (completing) => c.gray(completing ? figures.ellipsis : figures.pointerSmall);
	const item = (expandable, expanded) => c.gray(expandable ? expanded ? figures.pointerSmall : "+" : figures.line);
	module.exports = {
		styles,
		render,
		symbols,
		symbol,
		delimiter,
		item
	};
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/util/lines.js
var require_lines = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const strip = require_strip();
	/**
	* @param {string} msg
	* @param {number} perLine
	*/
	module.exports = function(msg, perLine) {
		let lines = String(strip(msg) || "").split(/\r?\n/);
		if (!perLine) return lines.length;
		return lines.map((l) => Math.ceil(l.length / perLine)).reduce((a, b) => a + b);
	};
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/util/wrap.js
var require_wrap = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* @param {string} msg The message to wrap
	* @param {object} opts
	* @param {number|string} [opts.margin] Left margin
	* @param {number} opts.width Maximum characters per line including the margin
	*/
	module.exports = (msg, opts = {}) => {
		const tab = Number.isSafeInteger(parseInt(opts.margin)) ? new Array(parseInt(opts.margin)).fill(" ").join("") : opts.margin || "";
		const width = opts.width;
		return (msg || "").split(/\r?\n/g).map((line) => line.split(/\s+/g).reduce((arr, w) => {
			if (w.length + tab.length >= width || arr[arr.length - 1].length + w.length + 1 < width) arr[arr.length - 1] += ` ${w}`;
			else arr.push(`${tab}${w}`);
			return arr;
		}, [tab]).join("\n")).join("\n");
	};
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/util/entriesToDisplay.js
var require_entriesToDisplay = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Determine what entries should be displayed on the screen, based on the
	* currently selected index and the maximum visible. Used in list-based
	* prompts like `select` and `multiselect`.
	*
	* @param {number} cursor the currently selected entry
	* @param {number} total the total entries available to display
	* @param {number} [maxVisible] the number of entries that can be displayed
	*/
	module.exports = (cursor, total, maxVisible) => {
		maxVisible = maxVisible || total;
		let startIndex = Math.min(total - maxVisible, cursor - Math.floor(maxVisible / 2));
		if (startIndex < 0) startIndex = 0;
		let endIndex = Math.min(startIndex + maxVisible, total);
		return {
			startIndex,
			endIndex
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/util/index.js
var require_util = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		action: require_action(),
		clear: require_clear(),
		style: require_style(),
		strip: require_strip(),
		figures: require_figures(),
		lines: require_lines(),
		wrap: require_wrap(),
		entriesToDisplay: require_entriesToDisplay()
	};
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/prompt.js
var require_prompt = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const readline = __require("readline");
	const { action } = require_util();
	const EventEmitter = __require("events");
	const { beep, cursor } = require_src();
	const color = require_kleur();
	/**
	* Base prompt skeleton
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	*/
	var Prompt = class extends EventEmitter {
		constructor(opts = {}) {
			super();
			this.firstRender = true;
			this.in = opts.stdin || process.stdin;
			this.out = opts.stdout || process.stdout;
			this.onRender = (opts.onRender || (() => void 0)).bind(this);
			const rl = readline.createInterface({
				input: this.in,
				escapeCodeTimeout: 50
			});
			readline.emitKeypressEvents(this.in, rl);
			if (this.in.isTTY) this.in.setRawMode(true);
			const isSelect = ["SelectPrompt", "MultiselectPrompt"].indexOf(this.constructor.name) > -1;
			const keypress = (str, key) => {
				let a = action(key, isSelect);
				if (a === false) this._ && this._(str, key);
				else if (typeof this[a] === "function") this[a](key);
				else this.bell();
			};
			this.close = () => {
				this.out.write(cursor.show);
				this.in.removeListener("keypress", keypress);
				if (this.in.isTTY) this.in.setRawMode(false);
				rl.close();
				this.emit(this.aborted ? "abort" : this.exited ? "exit" : "submit", this.value);
				this.closed = true;
			};
			this.in.on("keypress", keypress);
		}
		fire() {
			this.emit("state", {
				value: this.value,
				aborted: !!this.aborted,
				exited: !!this.exited
			});
		}
		bell() {
			this.out.write(beep);
		}
		render() {
			this.onRender(color);
			if (this.firstRender) this.firstRender = false;
		}
	};
	module.exports = Prompt;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/text.js
var require_text = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const color = require_kleur();
	const Prompt = require_prompt();
	const { erase, cursor } = require_src();
	const { style, clear, lines, figures } = require_util();
	/**
	* TextPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {String} [opts.style='default'] Render style
	* @param {String} [opts.initial] Default value
	* @param {Function} [opts.validate] Validate function
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	* @param {String} [opts.error] The invalid error label
	*/
	var TextPrompt = class extends Prompt {
		constructor(opts = {}) {
			super(opts);
			this.transform = style.render(opts.style);
			this.scale = this.transform.scale;
			this.msg = opts.message;
			this.initial = opts.initial || ``;
			this.validator = opts.validate || (() => true);
			this.value = ``;
			this.errorMsg = opts.error || `Please Enter A Valid Value`;
			this.cursor = Number(!!this.initial);
			this.cursorOffset = 0;
			this.clear = clear(``, this.out.columns);
			this.render();
		}
		set value(v) {
			if (!v && this.initial) {
				this.placeholder = true;
				this.rendered = color.gray(this.transform.render(this.initial));
			} else {
				this.placeholder = false;
				this.rendered = this.transform.render(v);
			}
			this._value = v;
			this.fire();
		}
		get value() {
			return this._value;
		}
		reset() {
			this.value = ``;
			this.cursor = Number(!!this.initial);
			this.cursorOffset = 0;
			this.fire();
			this.render();
		}
		exit() {
			this.abort();
		}
		abort() {
			this.value = this.value || this.initial;
			this.done = this.aborted = true;
			this.error = false;
			this.red = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		async validate() {
			let valid = await this.validator(this.value);
			if (typeof valid === `string`) {
				this.errorMsg = valid;
				valid = false;
			}
			this.error = !valid;
		}
		async submit() {
			this.value = this.value || this.initial;
			this.cursorOffset = 0;
			this.cursor = this.rendered.length;
			await this.validate();
			if (this.error) {
				this.red = true;
				this.fire();
				this.render();
				return;
			}
			this.done = true;
			this.aborted = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		next() {
			if (!this.placeholder) return this.bell();
			this.value = this.initial;
			this.cursor = this.rendered.length;
			this.fire();
			this.render();
		}
		moveCursor(n) {
			if (this.placeholder) return;
			this.cursor = this.cursor + n;
			this.cursorOffset += n;
		}
		_(c, key) {
			let s1 = this.value.slice(0, this.cursor);
			this.value = `${s1}${c}${this.value.slice(this.cursor)}`;
			this.red = false;
			this.cursor = this.placeholder ? 0 : s1.length + 1;
			this.render();
		}
		delete() {
			if (this.isCursorAtStart()) return this.bell();
			this.value = `${this.value.slice(0, this.cursor - 1)}${this.value.slice(this.cursor)}`;
			this.red = false;
			if (this.isCursorAtStart()) this.cursorOffset = 0;
			else {
				this.cursorOffset++;
				this.moveCursor(-1);
			}
			this.render();
		}
		deleteForward() {
			if (this.cursor * this.scale >= this.rendered.length || this.placeholder) return this.bell();
			this.value = `${this.value.slice(0, this.cursor)}${this.value.slice(this.cursor + 1)}`;
			this.red = false;
			if (this.isCursorAtEnd()) this.cursorOffset = 0;
			else this.cursorOffset++;
			this.render();
		}
		first() {
			this.cursor = 0;
			this.render();
		}
		last() {
			this.cursor = this.value.length;
			this.render();
		}
		left() {
			if (this.cursor <= 0 || this.placeholder) return this.bell();
			this.moveCursor(-1);
			this.render();
		}
		right() {
			if (this.cursor * this.scale >= this.rendered.length || this.placeholder) return this.bell();
			this.moveCursor(1);
			this.render();
		}
		isCursorAtStart() {
			return this.cursor === 0 || this.placeholder && this.cursor === 1;
		}
		isCursorAtEnd() {
			return this.cursor === this.rendered.length || this.placeholder && this.cursor === this.rendered.length + 1;
		}
		render() {
			if (this.closed) return;
			if (!this.firstRender) {
				if (this.outputError) this.out.write(cursor.down(lines(this.outputError, this.out.columns) - 1) + clear(this.outputError, this.out.columns));
				this.out.write(clear(this.outputText, this.out.columns));
			}
			super.render();
			this.outputError = "";
			this.outputText = [
				style.symbol(this.done, this.aborted),
				color.bold(this.msg),
				style.delimiter(this.done),
				this.red ? color.red(this.rendered) : this.rendered
			].join(` `);
			if (this.error) this.outputError += this.errorMsg.split(`\n`).reduce((a, l, i) => a + `\n${i ? " " : figures.pointerSmall} ${color.red().italic(l)}`, ``);
			this.out.write(erase.line + cursor.to(0) + this.outputText + cursor.save + this.outputError + cursor.restore + cursor.move(this.cursorOffset, 0));
		}
	};
	module.exports = TextPrompt;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/select.js
var require_select = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const color = require_kleur();
	const Prompt = require_prompt();
	const { style, clear, figures, wrap, entriesToDisplay } = require_util();
	const { cursor } = require_src();
	/**
	* SelectPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Array} opts.choices Array of choice objects
	* @param {String} [opts.hint] Hint to display
	* @param {Number} [opts.initial] Index of default value
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	* @param {Number} [opts.optionsPerPage=10] Max options to display at once
	*/
	var SelectPrompt = class extends Prompt {
		constructor(opts = {}) {
			super(opts);
			this.msg = opts.message;
			this.hint = opts.hint || "- Use arrow-keys. Return to submit.";
			this.warn = opts.warn || "- This option is disabled";
			this.cursor = opts.initial || 0;
			this.choices = opts.choices.map((ch, idx) => {
				if (typeof ch === "string") ch = {
					title: ch,
					value: idx
				};
				return {
					title: ch && (ch.title || ch.value || ch),
					value: ch && (ch.value === void 0 ? idx : ch.value),
					description: ch && ch.description,
					selected: ch && ch.selected,
					disabled: ch && ch.disabled
				};
			});
			this.optionsPerPage = opts.optionsPerPage || 10;
			this.value = (this.choices[this.cursor] || {}).value;
			this.clear = clear("", this.out.columns);
			this.render();
		}
		moveCursor(n) {
			this.cursor = n;
			this.value = this.choices[n].value;
			this.fire();
		}
		reset() {
			this.moveCursor(0);
			this.fire();
			this.render();
		}
		exit() {
			this.abort();
		}
		abort() {
			this.done = this.aborted = true;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		submit() {
			if (!this.selection.disabled) {
				this.done = true;
				this.aborted = false;
				this.fire();
				this.render();
				this.out.write("\n");
				this.close();
			} else this.bell();
		}
		first() {
			this.moveCursor(0);
			this.render();
		}
		last() {
			this.moveCursor(this.choices.length - 1);
			this.render();
		}
		up() {
			if (this.cursor === 0) this.moveCursor(this.choices.length - 1);
			else this.moveCursor(this.cursor - 1);
			this.render();
		}
		down() {
			if (this.cursor === this.choices.length - 1) this.moveCursor(0);
			else this.moveCursor(this.cursor + 1);
			this.render();
		}
		next() {
			this.moveCursor((this.cursor + 1) % this.choices.length);
			this.render();
		}
		_(c, key) {
			if (c === " ") return this.submit();
		}
		get selection() {
			return this.choices[this.cursor];
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor.hide);
			else this.out.write(clear(this.outputText, this.out.columns));
			super.render();
			let { startIndex, endIndex } = entriesToDisplay(this.cursor, this.choices.length, this.optionsPerPage);
			this.outputText = [
				style.symbol(this.done, this.aborted),
				color.bold(this.msg),
				style.delimiter(false),
				this.done ? this.selection.title : this.selection.disabled ? color.yellow(this.warn) : color.gray(this.hint)
			].join(" ");
			if (!this.done) {
				this.outputText += "\n";
				for (let i = startIndex; i < endIndex; i++) {
					let title, prefix, desc = "", v = this.choices[i];
					if (i === startIndex && startIndex > 0) prefix = figures.arrowUp;
					else if (i === endIndex - 1 && endIndex < this.choices.length) prefix = figures.arrowDown;
					else prefix = " ";
					if (v.disabled) {
						title = this.cursor === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
						prefix = (this.cursor === i ? color.bold().gray(figures.pointer) + " " : "  ") + prefix;
					} else {
						title = this.cursor === i ? color.cyan().underline(v.title) : v.title;
						prefix = (this.cursor === i ? color.cyan(figures.pointer) + " " : "  ") + prefix;
						if (v.description && this.cursor === i) {
							desc = ` - ${v.description}`;
							if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) desc = "\n" + wrap(v.description, {
								margin: 3,
								width: this.out.columns
							});
						}
					}
					this.outputText += `${prefix} ${title}${color.gray(desc)}\n`;
				}
			}
			this.out.write(this.outputText);
		}
	};
	module.exports = SelectPrompt;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/toggle.js
var require_toggle = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const color = require_kleur();
	const Prompt = require_prompt();
	const { style, clear } = require_util();
	const { cursor, erase } = require_src();
	/**
	* TogglePrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Boolean} [opts.initial=false] Default value
	* @param {String} [opts.active='no'] Active label
	* @param {String} [opts.inactive='off'] Inactive label
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	*/
	var TogglePrompt = class extends Prompt {
		constructor(opts = {}) {
			super(opts);
			this.msg = opts.message;
			this.value = !!opts.initial;
			this.active = opts.active || "on";
			this.inactive = opts.inactive || "off";
			this.initialValue = this.value;
			this.render();
		}
		reset() {
			this.value = this.initialValue;
			this.fire();
			this.render();
		}
		exit() {
			this.abort();
		}
		abort() {
			this.done = this.aborted = true;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		submit() {
			this.done = true;
			this.aborted = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		deactivate() {
			if (this.value === false) return this.bell();
			this.value = false;
			this.render();
		}
		activate() {
			if (this.value === true) return this.bell();
			this.value = true;
			this.render();
		}
		delete() {
			this.deactivate();
		}
		left() {
			this.deactivate();
		}
		right() {
			this.activate();
		}
		down() {
			this.deactivate();
		}
		up() {
			this.activate();
		}
		next() {
			this.value = !this.value;
			this.fire();
			this.render();
		}
		_(c, key) {
			if (c === " ") this.value = !this.value;
			else if (c === "1") this.value = true;
			else if (c === "0") this.value = false;
			else return this.bell();
			this.render();
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor.hide);
			else this.out.write(clear(this.outputText, this.out.columns));
			super.render();
			this.outputText = [
				style.symbol(this.done, this.aborted),
				color.bold(this.msg),
				style.delimiter(this.done),
				this.value ? this.inactive : color.cyan().underline(this.inactive),
				color.gray("/"),
				this.value ? color.cyan().underline(this.active) : this.active
			].join(" ");
			this.out.write(erase.line + cursor.to(0) + this.outputText);
		}
	};
	module.exports = TogglePrompt;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/dateparts/datepart.js
var require_datepart = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = class DatePart {
		constructor({ token, date, parts, locales }) {
			this.token = token;
			this.date = date || /* @__PURE__ */ new Date();
			this.parts = parts || [this];
			this.locales = locales || {};
		}
		up() {}
		down() {}
		next() {
			const currentIdx = this.parts.indexOf(this);
			return this.parts.find((part, idx) => idx > currentIdx && part instanceof DatePart);
		}
		setTo(val) {}
		prev() {
			let parts = [].concat(this.parts).reverse();
			const currentIdx = parts.indexOf(this);
			return parts.find((part, idx) => idx > currentIdx && part instanceof DatePart);
		}
		toString() {
			return String(this.date);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/dateparts/meridiem.js
var require_meridiem = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const DatePart = require_datepart();
	var Meridiem = class extends DatePart {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setHours((this.date.getHours() + 12) % 24);
		}
		down() {
			this.up();
		}
		toString() {
			let meridiem = this.date.getHours() > 12 ? "pm" : "am";
			return /\A/.test(this.token) ? meridiem.toUpperCase() : meridiem;
		}
	};
	module.exports = Meridiem;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/dateparts/day.js
var require_day = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const DatePart = require_datepart();
	const pos = (n) => {
		n = n % 10;
		return n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th";
	};
	var Day = class extends DatePart {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setDate(this.date.getDate() + 1);
		}
		down() {
			this.date.setDate(this.date.getDate() - 1);
		}
		setTo(val) {
			this.date.setDate(parseInt(val.substr(-2)));
		}
		toString() {
			let date = this.date.getDate();
			let day = this.date.getDay();
			return this.token === "DD" ? String(date).padStart(2, "0") : this.token === "Do" ? date + pos(date) : this.token === "d" ? day + 1 : this.token === "ddd" ? this.locales.weekdaysShort[day] : this.token === "dddd" ? this.locales.weekdays[day] : date;
		}
	};
	module.exports = Day;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/dateparts/hours.js
var require_hours = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const DatePart = require_datepart();
	var Hours = class extends DatePart {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setHours(this.date.getHours() + 1);
		}
		down() {
			this.date.setHours(this.date.getHours() - 1);
		}
		setTo(val) {
			this.date.setHours(parseInt(val.substr(-2)));
		}
		toString() {
			let hours = this.date.getHours();
			if (/h/.test(this.token)) hours = hours % 12 || 12;
			return this.token.length > 1 ? String(hours).padStart(2, "0") : hours;
		}
	};
	module.exports = Hours;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/dateparts/milliseconds.js
var require_milliseconds = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const DatePart = require_datepart();
	var Milliseconds = class extends DatePart {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setMilliseconds(this.date.getMilliseconds() + 1);
		}
		down() {
			this.date.setMilliseconds(this.date.getMilliseconds() - 1);
		}
		setTo(val) {
			this.date.setMilliseconds(parseInt(val.substr(-this.token.length)));
		}
		toString() {
			return String(this.date.getMilliseconds()).padStart(4, "0").substr(0, this.token.length);
		}
	};
	module.exports = Milliseconds;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/dateparts/minutes.js
var require_minutes = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const DatePart = require_datepart();
	var Minutes = class extends DatePart {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setMinutes(this.date.getMinutes() + 1);
		}
		down() {
			this.date.setMinutes(this.date.getMinutes() - 1);
		}
		setTo(val) {
			this.date.setMinutes(parseInt(val.substr(-2)));
		}
		toString() {
			let m = this.date.getMinutes();
			return this.token.length > 1 ? String(m).padStart(2, "0") : m;
		}
	};
	module.exports = Minutes;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/dateparts/month.js
var require_month = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const DatePart = require_datepart();
	var Month = class extends DatePart {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setMonth(this.date.getMonth() + 1);
		}
		down() {
			this.date.setMonth(this.date.getMonth() - 1);
		}
		setTo(val) {
			val = parseInt(val.substr(-2)) - 1;
			this.date.setMonth(val < 0 ? 0 : val);
		}
		toString() {
			let month = this.date.getMonth();
			let tl = this.token.length;
			return tl === 2 ? String(month + 1).padStart(2, "0") : tl === 3 ? this.locales.monthsShort[month] : tl === 4 ? this.locales.months[month] : String(month + 1);
		}
	};
	module.exports = Month;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/dateparts/seconds.js
var require_seconds = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const DatePart = require_datepart();
	var Seconds = class extends DatePart {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setSeconds(this.date.getSeconds() + 1);
		}
		down() {
			this.date.setSeconds(this.date.getSeconds() - 1);
		}
		setTo(val) {
			this.date.setSeconds(parseInt(val.substr(-2)));
		}
		toString() {
			let s = this.date.getSeconds();
			return this.token.length > 1 ? String(s).padStart(2, "0") : s;
		}
	};
	module.exports = Seconds;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/dateparts/year.js
var require_year = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const DatePart = require_datepart();
	var Year = class extends DatePart {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setFullYear(this.date.getFullYear() + 1);
		}
		down() {
			this.date.setFullYear(this.date.getFullYear() - 1);
		}
		setTo(val) {
			this.date.setFullYear(val.substr(-4));
		}
		toString() {
			let year = String(this.date.getFullYear()).padStart(4, "0");
			return this.token.length === 2 ? year.substr(-2) : year;
		}
	};
	module.exports = Year;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/dateparts/index.js
var require_dateparts = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		DatePart: require_datepart(),
		Meridiem: require_meridiem(),
		Day: require_day(),
		Hours: require_hours(),
		Milliseconds: require_milliseconds(),
		Minutes: require_minutes(),
		Month: require_month(),
		Seconds: require_seconds(),
		Year: require_year()
	};
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/date.js
var require_date = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const color = require_kleur();
	const Prompt = require_prompt();
	const { style, clear, figures } = require_util();
	const { erase, cursor } = require_src();
	const { DatePart, Meridiem, Day, Hours, Milliseconds, Minutes, Month, Seconds, Year } = require_dateparts();
	const regex = /\\(.)|"((?:\\["\\]|[^"])+)"|(D[Do]?|d{3,4}|d)|(M{1,4})|(YY(?:YY)?)|([aA])|([Hh]{1,2})|(m{1,2})|(s{1,2})|(S{1,4})|./g;
	const regexGroups = {
		1: ({ token }) => token.replace(/\\(.)/g, "$1"),
		2: (opts) => new Day(opts),
		3: (opts) => new Month(opts),
		4: (opts) => new Year(opts),
		5: (opts) => new Meridiem(opts),
		6: (opts) => new Hours(opts),
		7: (opts) => new Minutes(opts),
		8: (opts) => new Seconds(opts),
		9: (opts) => new Milliseconds(opts)
	};
	const dfltLocales = {
		months: "January,February,March,April,May,June,July,August,September,October,November,December".split(","),
		monthsShort: "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),
		weekdays: "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","),
		weekdaysShort: "Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(",")
	};
	/**
	* DatePrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Number} [opts.initial] Index of default value
	* @param {String} [opts.mask] The format mask
	* @param {object} [opts.locales] The date locales
	* @param {String} [opts.error] The error message shown on invalid value
	* @param {Function} [opts.validate] Function to validate the submitted value
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	*/
	var DatePrompt = class extends Prompt {
		constructor(opts = {}) {
			super(opts);
			this.msg = opts.message;
			this.cursor = 0;
			this.typed = "";
			this.locales = Object.assign(dfltLocales, opts.locales);
			this._date = opts.initial || /* @__PURE__ */ new Date();
			this.errorMsg = opts.error || "Please Enter A Valid Value";
			this.validator = opts.validate || (() => true);
			this.mask = opts.mask || "YYYY-MM-DD HH:mm:ss";
			this.clear = clear("", this.out.columns);
			this.render();
		}
		get value() {
			return this.date;
		}
		get date() {
			return this._date;
		}
		set date(date) {
			if (date) this._date.setTime(date.getTime());
		}
		set mask(mask) {
			let result;
			this.parts = [];
			while (result = regex.exec(mask)) {
				let match = result.shift();
				let idx = result.findIndex((gr) => gr != null);
				this.parts.push(idx in regexGroups ? regexGroups[idx]({
					token: result[idx] || match,
					date: this.date,
					parts: this.parts,
					locales: this.locales
				}) : result[idx] || match);
			}
			let parts = this.parts.reduce((arr, i) => {
				if (typeof i === "string" && typeof arr[arr.length - 1] === "string") arr[arr.length - 1] += i;
				else arr.push(i);
				return arr;
			}, []);
			this.parts.splice(0);
			this.parts.push(...parts);
			this.reset();
		}
		moveCursor(n) {
			this.typed = "";
			this.cursor = n;
			this.fire();
		}
		reset() {
			this.moveCursor(this.parts.findIndex((p) => p instanceof DatePart));
			this.fire();
			this.render();
		}
		exit() {
			this.abort();
		}
		abort() {
			this.done = this.aborted = true;
			this.error = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		async validate() {
			let valid = await this.validator(this.value);
			if (typeof valid === "string") {
				this.errorMsg = valid;
				valid = false;
			}
			this.error = !valid;
		}
		async submit() {
			await this.validate();
			if (this.error) {
				this.color = "red";
				this.fire();
				this.render();
				return;
			}
			this.done = true;
			this.aborted = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		up() {
			this.typed = "";
			this.parts[this.cursor].up();
			this.render();
		}
		down() {
			this.typed = "";
			this.parts[this.cursor].down();
			this.render();
		}
		left() {
			let prev = this.parts[this.cursor].prev();
			if (prev == null) return this.bell();
			this.moveCursor(this.parts.indexOf(prev));
			this.render();
		}
		right() {
			let next = this.parts[this.cursor].next();
			if (next == null) return this.bell();
			this.moveCursor(this.parts.indexOf(next));
			this.render();
		}
		next() {
			let next = this.parts[this.cursor].next();
			this.moveCursor(next ? this.parts.indexOf(next) : this.parts.findIndex((part) => part instanceof DatePart));
			this.render();
		}
		_(c) {
			if (/\d/.test(c)) {
				this.typed += c;
				this.parts[this.cursor].setTo(this.typed);
				this.render();
			}
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor.hide);
			else this.out.write(clear(this.outputText, this.out.columns));
			super.render();
			this.outputText = [
				style.symbol(this.done, this.aborted),
				color.bold(this.msg),
				style.delimiter(false),
				this.parts.reduce((arr, p, idx) => arr.concat(idx === this.cursor && !this.done ? color.cyan().underline(p.toString()) : p), []).join("")
			].join(" ");
			if (this.error) this.outputText += this.errorMsg.split("\n").reduce((a, l, i) => a + `\n${i ? ` ` : figures.pointerSmall} ${color.red().italic(l)}`, ``);
			this.out.write(erase.line + cursor.to(0) + this.outputText);
		}
	};
	module.exports = DatePrompt;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/number.js
var require_number = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const color = require_kleur();
	const Prompt = require_prompt();
	const { cursor, erase } = require_src();
	const { style, figures, clear, lines } = require_util();
	const isNumber = /[0-9]/;
	const isDef = (any) => any !== void 0;
	const round = (number, precision) => {
		let factor = Math.pow(10, precision);
		return Math.round(number * factor) / factor;
	};
	/**
	* NumberPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {String} [opts.style='default'] Render style
	* @param {Number} [opts.initial] Default value
	* @param {Number} [opts.max=+Infinity] Max value
	* @param {Number} [opts.min=-Infinity] Min value
	* @param {Boolean} [opts.float=false] Parse input as floats
	* @param {Number} [opts.round=2] Round floats to x decimals
	* @param {Number} [opts.increment=1] Number to increment by when using arrow-keys
	* @param {Function} [opts.validate] Validate function
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	* @param {String} [opts.error] The invalid error label
	*/
	var NumberPrompt = class extends Prompt {
		constructor(opts = {}) {
			super(opts);
			this.transform = style.render(opts.style);
			this.msg = opts.message;
			this.initial = isDef(opts.initial) ? opts.initial : "";
			this.float = !!opts.float;
			this.round = opts.round || 2;
			this.inc = opts.increment || 1;
			this.min = isDef(opts.min) ? opts.min : -Infinity;
			this.max = isDef(opts.max) ? opts.max : Infinity;
			this.errorMsg = opts.error || `Please Enter A Valid Value`;
			this.validator = opts.validate || (() => true);
			this.color = `cyan`;
			this.value = ``;
			this.typed = ``;
			this.lastHit = 0;
			this.render();
		}
		set value(v) {
			if (!v && v !== 0) {
				this.placeholder = true;
				this.rendered = color.gray(this.transform.render(`${this.initial}`));
				this._value = ``;
			} else {
				this.placeholder = false;
				this.rendered = this.transform.render(`${round(v, this.round)}`);
				this._value = round(v, this.round);
			}
			this.fire();
		}
		get value() {
			return this._value;
		}
		parse(x) {
			return this.float ? parseFloat(x) : parseInt(x);
		}
		valid(c) {
			return c === `-` || c === `.` && this.float || isNumber.test(c);
		}
		reset() {
			this.typed = ``;
			this.value = ``;
			this.fire();
			this.render();
		}
		exit() {
			this.abort();
		}
		abort() {
			let x = this.value;
			this.value = x !== `` ? x : this.initial;
			this.done = this.aborted = true;
			this.error = false;
			this.fire();
			this.render();
			this.out.write(`\n`);
			this.close();
		}
		async validate() {
			let valid = await this.validator(this.value);
			if (typeof valid === `string`) {
				this.errorMsg = valid;
				valid = false;
			}
			this.error = !valid;
		}
		async submit() {
			await this.validate();
			if (this.error) {
				this.color = `red`;
				this.fire();
				this.render();
				return;
			}
			let x = this.value;
			this.value = x !== `` ? x : this.initial;
			this.done = true;
			this.aborted = false;
			this.error = false;
			this.fire();
			this.render();
			this.out.write(`\n`);
			this.close();
		}
		up() {
			this.typed = ``;
			if (this.value === "") this.value = this.min - this.inc;
			if (this.value >= this.max) return this.bell();
			this.value += this.inc;
			this.color = `cyan`;
			this.fire();
			this.render();
		}
		down() {
			this.typed = ``;
			if (this.value === "") this.value = this.min + this.inc;
			if (this.value <= this.min) return this.bell();
			this.value -= this.inc;
			this.color = `cyan`;
			this.fire();
			this.render();
		}
		delete() {
			let val = this.value.toString();
			if (val.length === 0) return this.bell();
			this.value = this.parse(val = val.slice(0, -1)) || ``;
			if (this.value !== "" && this.value < this.min) this.value = this.min;
			this.color = `cyan`;
			this.fire();
			this.render();
		}
		next() {
			this.value = this.initial;
			this.fire();
			this.render();
		}
		_(c, key) {
			if (!this.valid(c)) return this.bell();
			const now = Date.now();
			if (now - this.lastHit > 1e3) this.typed = ``;
			this.typed += c;
			this.lastHit = now;
			this.color = `cyan`;
			if (c === `.`) return this.fire();
			this.value = Math.min(this.parse(this.typed), this.max);
			if (this.value > this.max) this.value = this.max;
			if (this.value < this.min) this.value = this.min;
			this.fire();
			this.render();
		}
		render() {
			if (this.closed) return;
			if (!this.firstRender) {
				if (this.outputError) this.out.write(cursor.down(lines(this.outputError, this.out.columns) - 1) + clear(this.outputError, this.out.columns));
				this.out.write(clear(this.outputText, this.out.columns));
			}
			super.render();
			this.outputError = "";
			this.outputText = [
				style.symbol(this.done, this.aborted),
				color.bold(this.msg),
				style.delimiter(this.done),
				!this.done || !this.done && !this.placeholder ? color[this.color]().underline(this.rendered) : this.rendered
			].join(` `);
			if (this.error) this.outputError += this.errorMsg.split(`\n`).reduce((a, l, i) => a + `\n${i ? ` ` : figures.pointerSmall} ${color.red().italic(l)}`, ``);
			this.out.write(erase.line + cursor.to(0) + this.outputText + cursor.save + this.outputError + cursor.restore);
		}
	};
	module.exports = NumberPrompt;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/multiselect.js
var require_multiselect = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const color = require_kleur();
	const { cursor } = require_src();
	const Prompt = require_prompt();
	const { clear, figures, style, wrap, entriesToDisplay } = require_util();
	/**
	* MultiselectPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Array} opts.choices Array of choice objects
	* @param {String} [opts.hint] Hint to display
	* @param {String} [opts.warn] Hint shown for disabled choices
	* @param {Number} [opts.max] Max choices
	* @param {Number} [opts.cursor=0] Cursor start position
	* @param {Number} [opts.optionsPerPage=10] Max options to display at once
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	*/
	var MultiselectPrompt = class extends Prompt {
		constructor(opts = {}) {
			super(opts);
			this.msg = opts.message;
			this.cursor = opts.cursor || 0;
			this.scrollIndex = opts.cursor || 0;
			this.hint = opts.hint || "";
			this.warn = opts.warn || "- This option is disabled -";
			this.minSelected = opts.min;
			this.showMinError = false;
			this.maxChoices = opts.max;
			this.instructions = opts.instructions;
			this.optionsPerPage = opts.optionsPerPage || 10;
			this.value = opts.choices.map((ch, idx) => {
				if (typeof ch === "string") ch = {
					title: ch,
					value: idx
				};
				return {
					title: ch && (ch.title || ch.value || ch),
					description: ch && ch.description,
					value: ch && (ch.value === void 0 ? idx : ch.value),
					selected: ch && ch.selected,
					disabled: ch && ch.disabled
				};
			});
			this.clear = clear("", this.out.columns);
			if (!opts.overrideRender) this.render();
		}
		reset() {
			this.value.map((v) => !v.selected);
			this.cursor = 0;
			this.fire();
			this.render();
		}
		selected() {
			return this.value.filter((v) => v.selected);
		}
		exit() {
			this.abort();
		}
		abort() {
			this.done = this.aborted = true;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		submit() {
			const selected = this.value.filter((e) => e.selected);
			if (this.minSelected && selected.length < this.minSelected) {
				this.showMinError = true;
				this.render();
			} else {
				this.done = true;
				this.aborted = false;
				this.fire();
				this.render();
				this.out.write("\n");
				this.close();
			}
		}
		first() {
			this.cursor = 0;
			this.render();
		}
		last() {
			this.cursor = this.value.length - 1;
			this.render();
		}
		next() {
			this.cursor = (this.cursor + 1) % this.value.length;
			this.render();
		}
		up() {
			if (this.cursor === 0) this.cursor = this.value.length - 1;
			else this.cursor--;
			this.render();
		}
		down() {
			if (this.cursor === this.value.length - 1) this.cursor = 0;
			else this.cursor++;
			this.render();
		}
		left() {
			this.value[this.cursor].selected = false;
			this.render();
		}
		right() {
			if (this.value.filter((e) => e.selected).length >= this.maxChoices) return this.bell();
			this.value[this.cursor].selected = true;
			this.render();
		}
		handleSpaceToggle() {
			const v = this.value[this.cursor];
			if (v.selected) {
				v.selected = false;
				this.render();
			} else if (v.disabled || this.value.filter((e) => e.selected).length >= this.maxChoices) return this.bell();
			else {
				v.selected = true;
				this.render();
			}
		}
		toggleAll() {
			if (this.maxChoices !== void 0 || this.value[this.cursor].disabled) return this.bell();
			const newSelected = !this.value[this.cursor].selected;
			this.value.filter((v) => !v.disabled).forEach((v) => v.selected = newSelected);
			this.render();
		}
		_(c, key) {
			if (c === " ") this.handleSpaceToggle();
			else if (c === "a") this.toggleAll();
			else return this.bell();
		}
		renderInstructions() {
			if (this.instructions === void 0 || this.instructions) {
				if (typeof this.instructions === "string") return this.instructions;
				return `
Instructions:
    ${figures.arrowUp}/${figures.arrowDown}: Highlight option\n    ${figures.arrowLeft}/${figures.arrowRight}/[space]: Toggle selection\n` + (this.maxChoices === void 0 ? `    a: Toggle all\n` : "") + `    enter/return: Complete answer`;
			}
			return "";
		}
		renderOption(cursor, v, i, arrowIndicator) {
			const prefix = (v.selected ? color.green(figures.radioOn) : figures.radioOff) + " " + arrowIndicator + " ";
			let title, desc;
			if (v.disabled) title = cursor === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
			else {
				title = cursor === i ? color.cyan().underline(v.title) : v.title;
				if (cursor === i && v.description) {
					desc = ` - ${v.description}`;
					if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) desc = "\n" + wrap(v.description, {
						margin: prefix.length,
						width: this.out.columns
					});
				}
			}
			return prefix + title + color.gray(desc || "");
		}
		paginateOptions(options) {
			if (options.length === 0) return color.red("No matches for this query.");
			let { startIndex, endIndex } = entriesToDisplay(this.cursor, options.length, this.optionsPerPage);
			let prefix, styledOptions = [];
			for (let i = startIndex; i < endIndex; i++) {
				if (i === startIndex && startIndex > 0) prefix = figures.arrowUp;
				else if (i === endIndex - 1 && endIndex < options.length) prefix = figures.arrowDown;
				else prefix = " ";
				styledOptions.push(this.renderOption(this.cursor, options[i], i, prefix));
			}
			return "\n" + styledOptions.join("\n");
		}
		renderOptions(options) {
			if (!this.done) return this.paginateOptions(options);
			return "";
		}
		renderDoneOrInstructions() {
			if (this.done) return this.value.filter((e) => e.selected).map((v) => v.title).join(", ");
			const output = [color.gray(this.hint), this.renderInstructions()];
			if (this.value[this.cursor].disabled) output.push(color.yellow(this.warn));
			return output.join(" ");
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor.hide);
			super.render();
			let prompt = [
				style.symbol(this.done, this.aborted),
				color.bold(this.msg),
				style.delimiter(false),
				this.renderDoneOrInstructions()
			].join(" ");
			if (this.showMinError) {
				prompt += color.red(`You must select a minimum of ${this.minSelected} choices.`);
				this.showMinError = false;
			}
			prompt += this.renderOptions(this.value);
			this.out.write(this.clear + prompt);
			this.clear = clear(prompt, this.out.columns);
		}
	};
	module.exports = MultiselectPrompt;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/autocomplete.js
var require_autocomplete = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const color = require_kleur();
	const Prompt = require_prompt();
	const { erase, cursor } = require_src();
	const { style, clear, figures, wrap, entriesToDisplay } = require_util();
	const getVal = (arr, i) => arr[i] && (arr[i].value || arr[i].title || arr[i]);
	const getTitle = (arr, i) => arr[i] && (arr[i].title || arr[i].value || arr[i]);
	const getIndex = (arr, valOrTitle) => {
		const index = arr.findIndex((el) => el.value === valOrTitle || el.title === valOrTitle);
		return index > -1 ? index : void 0;
	};
	/**
	* TextPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Array} opts.choices Array of auto-complete choices objects
	* @param {Function} [opts.suggest] Filter function. Defaults to sort by title
	* @param {Number} [opts.limit=10] Max number of results to show
	* @param {Number} [opts.cursor=0] Cursor start position
	* @param {String} [opts.style='default'] Render style
	* @param {String} [opts.fallback] Fallback message - initial to default value
	* @param {String} [opts.initial] Index of the default value
	* @param {Boolean} [opts.clearFirst] The first ESCAPE keypress will clear the input
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	* @param {String} [opts.noMatches] The no matches found label
	*/
	var AutocompletePrompt = class extends Prompt {
		constructor(opts = {}) {
			super(opts);
			this.msg = opts.message;
			this.suggest = opts.suggest;
			this.choices = opts.choices;
			this.initial = typeof opts.initial === "number" ? opts.initial : getIndex(opts.choices, opts.initial);
			this.select = this.initial || opts.cursor || 0;
			this.i18n = { noMatches: opts.noMatches || "no matches found" };
			this.fallback = opts.fallback || this.initial;
			this.clearFirst = opts.clearFirst || false;
			this.suggestions = [];
			this.input = "";
			this.limit = opts.limit || 10;
			this.cursor = 0;
			this.transform = style.render(opts.style);
			this.scale = this.transform.scale;
			this.render = this.render.bind(this);
			this.complete = this.complete.bind(this);
			this.clear = clear("", this.out.columns);
			this.complete(this.render);
			this.render();
		}
		set fallback(fb) {
			this._fb = Number.isSafeInteger(parseInt(fb)) ? parseInt(fb) : fb;
		}
		get fallback() {
			let choice;
			if (typeof this._fb === "number") choice = this.choices[this._fb];
			else if (typeof this._fb === "string") choice = { title: this._fb };
			return choice || this._fb || { title: this.i18n.noMatches };
		}
		moveSelect(i) {
			this.select = i;
			if (this.suggestions.length > 0) this.value = getVal(this.suggestions, i);
			else this.value = this.fallback.value;
			this.fire();
		}
		async complete(cb) {
			const p = this.completing = this.suggest(this.input, this.choices);
			const suggestions = await p;
			if (this.completing !== p) return;
			this.suggestions = suggestions.map((s, i, arr) => ({
				title: getTitle(arr, i),
				value: getVal(arr, i),
				description: s.description
			}));
			this.completing = false;
			const l = Math.max(suggestions.length - 1, 0);
			this.moveSelect(Math.min(l, this.select));
			cb && cb();
		}
		reset() {
			this.input = "";
			this.complete(() => {
				this.moveSelect(this.initial !== void 0 ? this.initial : 0);
				this.render();
			});
			this.render();
		}
		exit() {
			if (this.clearFirst && this.input.length > 0) this.reset();
			else {
				this.done = this.exited = true;
				this.aborted = false;
				this.fire();
				this.render();
				this.out.write("\n");
				this.close();
			}
		}
		abort() {
			this.done = this.aborted = true;
			this.exited = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		submit() {
			this.done = true;
			this.aborted = this.exited = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		_(c, key) {
			let s1 = this.input.slice(0, this.cursor);
			this.input = `${s1}${c}${this.input.slice(this.cursor)}`;
			this.cursor = s1.length + 1;
			this.complete(this.render);
			this.render();
		}
		delete() {
			if (this.cursor === 0) return this.bell();
			this.input = `${this.input.slice(0, this.cursor - 1)}${this.input.slice(this.cursor)}`;
			this.complete(this.render);
			this.cursor = this.cursor - 1;
			this.render();
		}
		deleteForward() {
			if (this.cursor * this.scale >= this.rendered.length) return this.bell();
			this.input = `${this.input.slice(0, this.cursor)}${this.input.slice(this.cursor + 1)}`;
			this.complete(this.render);
			this.render();
		}
		first() {
			this.moveSelect(0);
			this.render();
		}
		last() {
			this.moveSelect(this.suggestions.length - 1);
			this.render();
		}
		up() {
			if (this.select === 0) this.moveSelect(this.suggestions.length - 1);
			else this.moveSelect(this.select - 1);
			this.render();
		}
		down() {
			if (this.select === this.suggestions.length - 1) this.moveSelect(0);
			else this.moveSelect(this.select + 1);
			this.render();
		}
		next() {
			if (this.select === this.suggestions.length - 1) this.moveSelect(0);
			else this.moveSelect(this.select + 1);
			this.render();
		}
		nextPage() {
			this.moveSelect(Math.min(this.select + this.limit, this.suggestions.length - 1));
			this.render();
		}
		prevPage() {
			this.moveSelect(Math.max(this.select - this.limit, 0));
			this.render();
		}
		left() {
			if (this.cursor <= 0) return this.bell();
			this.cursor = this.cursor - 1;
			this.render();
		}
		right() {
			if (this.cursor * this.scale >= this.rendered.length) return this.bell();
			this.cursor = this.cursor + 1;
			this.render();
		}
		renderOption(v, hovered, isStart, isEnd) {
			let desc;
			let prefix = isStart ? figures.arrowUp : isEnd ? figures.arrowDown : " ";
			let title = hovered ? color.cyan().underline(v.title) : v.title;
			prefix = (hovered ? color.cyan(figures.pointer) + " " : "  ") + prefix;
			if (v.description) {
				desc = ` - ${v.description}`;
				if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) desc = "\n" + wrap(v.description, {
					margin: 3,
					width: this.out.columns
				});
			}
			return prefix + " " + title + color.gray(desc || "");
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor.hide);
			else this.out.write(clear(this.outputText, this.out.columns));
			super.render();
			let { startIndex, endIndex } = entriesToDisplay(this.select, this.choices.length, this.limit);
			this.outputText = [
				style.symbol(this.done, this.aborted, this.exited),
				color.bold(this.msg),
				style.delimiter(this.completing),
				this.done && this.suggestions[this.select] ? this.suggestions[this.select].title : this.rendered = this.transform.render(this.input)
			].join(" ");
			if (!this.done) {
				const suggestions = this.suggestions.slice(startIndex, endIndex).map((item, i) => this.renderOption(item, this.select === i + startIndex, i === 0 && startIndex > 0, i + startIndex === endIndex - 1 && endIndex < this.choices.length)).join("\n");
				this.outputText += `\n` + (suggestions || color.gray(this.fallback.title));
			}
			this.out.write(erase.line + cursor.to(0) + this.outputText);
		}
	};
	module.exports = AutocompletePrompt;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/autocompleteMultiselect.js
var require_autocompleteMultiselect = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const color = require_kleur();
	const { cursor } = require_src();
	const MultiselectPrompt = require_multiselect();
	const { clear, style, figures } = require_util();
	/**
	* MultiselectPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Array} opts.choices Array of choice objects
	* @param {String} [opts.hint] Hint to display
	* @param {String} [opts.warn] Hint shown for disabled choices
	* @param {Number} [opts.max] Max choices
	* @param {Number} [opts.cursor=0] Cursor start position
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	*/
	var AutocompleteMultiselectPrompt = class extends MultiselectPrompt {
		constructor(opts = {}) {
			opts.overrideRender = true;
			super(opts);
			this.inputValue = "";
			this.clear = clear("", this.out.columns);
			this.filteredOptions = this.value;
			this.render();
		}
		last() {
			this.cursor = this.filteredOptions.length - 1;
			this.render();
		}
		next() {
			this.cursor = (this.cursor + 1) % this.filteredOptions.length;
			this.render();
		}
		up() {
			if (this.cursor === 0) this.cursor = this.filteredOptions.length - 1;
			else this.cursor--;
			this.render();
		}
		down() {
			if (this.cursor === this.filteredOptions.length - 1) this.cursor = 0;
			else this.cursor++;
			this.render();
		}
		left() {
			this.filteredOptions[this.cursor].selected = false;
			this.render();
		}
		right() {
			if (this.value.filter((e) => e.selected).length >= this.maxChoices) return this.bell();
			this.filteredOptions[this.cursor].selected = true;
			this.render();
		}
		delete() {
			if (this.inputValue.length) {
				this.inputValue = this.inputValue.substr(0, this.inputValue.length - 1);
				this.updateFilteredOptions();
			}
		}
		updateFilteredOptions() {
			const currentHighlight = this.filteredOptions[this.cursor];
			this.filteredOptions = this.value.filter((v) => {
				if (this.inputValue) {
					if (typeof v.title === "string") {
						if (v.title.toLowerCase().includes(this.inputValue.toLowerCase())) return true;
					}
					if (typeof v.value === "string") {
						if (v.value.toLowerCase().includes(this.inputValue.toLowerCase())) return true;
					}
					return false;
				}
				return true;
			});
			const newHighlightIndex = this.filteredOptions.findIndex((v) => v === currentHighlight);
			this.cursor = newHighlightIndex < 0 ? 0 : newHighlightIndex;
			this.render();
		}
		handleSpaceToggle() {
			const v = this.filteredOptions[this.cursor];
			if (v.selected) {
				v.selected = false;
				this.render();
			} else if (v.disabled || this.value.filter((e) => e.selected).length >= this.maxChoices) return this.bell();
			else {
				v.selected = true;
				this.render();
			}
		}
		handleInputChange(c) {
			this.inputValue = this.inputValue + c;
			this.updateFilteredOptions();
		}
		_(c, key) {
			if (c === " ") this.handleSpaceToggle();
			else this.handleInputChange(c);
		}
		renderInstructions() {
			if (this.instructions === void 0 || this.instructions) {
				if (typeof this.instructions === "string") return this.instructions;
				return `
Instructions:
    ${figures.arrowUp}/${figures.arrowDown}: Highlight option
    ${figures.arrowLeft}/${figures.arrowRight}/[space]: Toggle selection
    [a,b,c]/delete: Filter choices
    enter/return: Complete answer
`;
			}
			return "";
		}
		renderCurrentInput() {
			return `
Filtered results for: ${this.inputValue ? this.inputValue : color.gray("Enter something to filter")}\n`;
		}
		renderOption(cursor, v, i) {
			let title;
			if (v.disabled) title = cursor === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
			else title = cursor === i ? color.cyan().underline(v.title) : v.title;
			return (v.selected ? color.green(figures.radioOn) : figures.radioOff) + "  " + title;
		}
		renderDoneOrInstructions() {
			if (this.done) return this.value.filter((e) => e.selected).map((v) => v.title).join(", ");
			const output = [
				color.gray(this.hint),
				this.renderInstructions(),
				this.renderCurrentInput()
			];
			if (this.filteredOptions.length && this.filteredOptions[this.cursor].disabled) output.push(color.yellow(this.warn));
			return output.join(" ");
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor.hide);
			super.render();
			let prompt = [
				style.symbol(this.done, this.aborted),
				color.bold(this.msg),
				style.delimiter(false),
				this.renderDoneOrInstructions()
			].join(" ");
			if (this.showMinError) {
				prompt += color.red(`You must select a minimum of ${this.minSelected} choices.`);
				this.showMinError = false;
			}
			prompt += this.renderOptions(this.filteredOptions);
			this.out.write(this.clear + prompt);
			this.clear = clear(prompt, this.out.columns);
		}
	};
	module.exports = AutocompleteMultiselectPrompt;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/confirm.js
var require_confirm = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const color = require_kleur();
	const Prompt = require_prompt();
	const { style, clear } = require_util();
	const { erase, cursor } = require_src();
	/**
	* ConfirmPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Boolean} [opts.initial] Default value (true/false)
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	* @param {String} [opts.yes] The "Yes" label
	* @param {String} [opts.yesOption] The "Yes" option when choosing between yes/no
	* @param {String} [opts.no] The "No" label
	* @param {String} [opts.noOption] The "No" option when choosing between yes/no
	*/
	var ConfirmPrompt = class extends Prompt {
		constructor(opts = {}) {
			super(opts);
			this.msg = opts.message;
			this.value = opts.initial;
			this.initialValue = !!opts.initial;
			this.yesMsg = opts.yes || "yes";
			this.yesOption = opts.yesOption || "(Y/n)";
			this.noMsg = opts.no || "no";
			this.noOption = opts.noOption || "(y/N)";
			this.render();
		}
		reset() {
			this.value = this.initialValue;
			this.fire();
			this.render();
		}
		exit() {
			this.abort();
		}
		abort() {
			this.done = this.aborted = true;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		submit() {
			this.value = this.value || false;
			this.done = true;
			this.aborted = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		_(c, key) {
			if (c.toLowerCase() === "y") {
				this.value = true;
				return this.submit();
			}
			if (c.toLowerCase() === "n") {
				this.value = false;
				return this.submit();
			}
			return this.bell();
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor.hide);
			else this.out.write(clear(this.outputText, this.out.columns));
			super.render();
			this.outputText = [
				style.symbol(this.done, this.aborted),
				color.bold(this.msg),
				style.delimiter(this.done),
				this.done ? this.value ? this.yesMsg : this.noMsg : color.gray(this.initialValue ? this.yesOption : this.noOption)
			].join(" ");
			this.out.write(erase.line + cursor.to(0) + this.outputText);
		}
	};
	module.exports = ConfirmPrompt;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/index.js
var require_elements = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		TextPrompt: require_text(),
		SelectPrompt: require_select(),
		TogglePrompt: require_toggle(),
		DatePrompt: require_date(),
		NumberPrompt: require_number(),
		MultiselectPrompt: require_multiselect(),
		AutocompletePrompt: require_autocomplete(),
		AutocompleteMultiselectPrompt: require_autocompleteMultiselect(),
		ConfirmPrompt: require_confirm()
	};
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/prompts.js
var require_prompts$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	const $ = exports;
	const el = require_elements();
	const noop = (v) => v;
	function toPrompt(type, args, opts = {}) {
		return new Promise((res, rej) => {
			const p = new el[type](args);
			const onAbort = opts.onAbort || noop;
			const onSubmit = opts.onSubmit || noop;
			const onExit = opts.onExit || noop;
			p.on("state", args.onState || noop);
			p.on("submit", (x) => res(onSubmit(x)));
			p.on("exit", (x) => res(onExit(x)));
			p.on("abort", (x) => rej(onAbort(x)));
		});
	}
	/**
	* Text prompt
	* @param {string} args.message Prompt message to display
	* @param {string} [args.initial] Default string value
	* @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
	* @param {function} [args.onState] On state change callback
	* @param {function} [args.validate] Function to validate user input
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.text = (args) => toPrompt("TextPrompt", args);
	/**
	* Password prompt with masked input
	* @param {string} args.message Prompt message to display
	* @param {string} [args.initial] Default string value
	* @param {function} [args.onState] On state change callback
	* @param {function} [args.validate] Function to validate user input
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.password = (args) => {
		args.style = "password";
		return $.text(args);
	};
	/**
	* Prompt where input is invisible, like sudo
	* @param {string} args.message Prompt message to display
	* @param {string} [args.initial] Default string value
	* @param {function} [args.onState] On state change callback
	* @param {function} [args.validate] Function to validate user input
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.invisible = (args) => {
		args.style = "invisible";
		return $.text(args);
	};
	/**
	* Number prompt
	* @param {string} args.message Prompt message to display
	* @param {number} args.initial Default number value
	* @param {function} [args.onState] On state change callback
	* @param {number} [args.max] Max value
	* @param {number} [args.min] Min value
	* @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
	* @param {Boolean} [opts.float=false] Parse input as floats
	* @param {Number} [opts.round=2] Round floats to x decimals
	* @param {Number} [opts.increment=1] Number to increment by when using arrow-keys
	* @param {function} [args.validate] Function to validate user input
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.number = (args) => toPrompt("NumberPrompt", args);
	/**
	* Date prompt
	* @param {string} args.message Prompt message to display
	* @param {number} args.initial Default number value
	* @param {function} [args.onState] On state change callback
	* @param {number} [args.max] Max value
	* @param {number} [args.min] Min value
	* @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
	* @param {Boolean} [opts.float=false] Parse input as floats
	* @param {Number} [opts.round=2] Round floats to x decimals
	* @param {Number} [opts.increment=1] Number to increment by when using arrow-keys
	* @param {function} [args.validate] Function to validate user input
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.date = (args) => toPrompt("DatePrompt", args);
	/**
	* Classic yes/no prompt
	* @param {string} args.message Prompt message to display
	* @param {boolean} [args.initial=false] Default value
	* @param {function} [args.onState] On state change callback
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.confirm = (args) => toPrompt("ConfirmPrompt", args);
	/**
	* List prompt, split intput string by `seperator`
	* @param {string} args.message Prompt message to display
	* @param {string} [args.initial] Default string value
	* @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
	* @param {string} [args.separator] String separator
	* @param {function} [args.onState] On state change callback
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input, in form of an `Array`
	*/
	$.list = (args) => {
		const sep = args.separator || ",";
		return toPrompt("TextPrompt", args, { onSubmit: (str) => str.split(sep).map((s) => s.trim()) });
	};
	/**
	* Toggle/switch prompt
	* @param {string} args.message Prompt message to display
	* @param {boolean} [args.initial=false] Default value
	* @param {string} [args.active="on"] Text for `active` state
	* @param {string} [args.inactive="off"] Text for `inactive` state
	* @param {function} [args.onState] On state change callback
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.toggle = (args) => toPrompt("TogglePrompt", args);
	/**
	* Interactive select prompt
	* @param {string} args.message Prompt message to display
	* @param {Array} args.choices Array of choices objects `[{ title, value }, ...]`
	* @param {number} [args.initial] Index of default value
	* @param {String} [args.hint] Hint to display
	* @param {function} [args.onState] On state change callback
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.select = (args) => toPrompt("SelectPrompt", args);
	/**
	* Interactive multi-select / autocompleteMultiselect prompt
	* @param {string} args.message Prompt message to display
	* @param {Array} args.choices Array of choices objects `[{ title, value, [selected] }, ...]`
	* @param {number} [args.max] Max select
	* @param {string} [args.hint] Hint to display user
	* @param {Number} [args.cursor=0] Cursor start position
	* @param {function} [args.onState] On state change callback
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.multiselect = (args) => {
		args.choices = [].concat(args.choices || []);
		const toSelected = (items) => items.filter((item) => item.selected).map((item) => item.value);
		return toPrompt("MultiselectPrompt", args, {
			onAbort: toSelected,
			onSubmit: toSelected
		});
	};
	$.autocompleteMultiselect = (args) => {
		args.choices = [].concat(args.choices || []);
		const toSelected = (items) => items.filter((item) => item.selected).map((item) => item.value);
		return toPrompt("AutocompleteMultiselectPrompt", args, {
			onAbort: toSelected,
			onSubmit: toSelected
		});
	};
	const byTitle = (input, choices) => Promise.resolve(choices.filter((item) => item.title.slice(0, input.length).toLowerCase() === input.toLowerCase()));
	/**
	* Interactive auto-complete prompt
	* @param {string} args.message Prompt message to display
	* @param {Array} args.choices Array of auto-complete choices objects `[{ title, value }, ...]`
	* @param {Function} [args.suggest] Function to filter results based on user input. Defaults to sort by `title`
	* @param {number} [args.limit=10] Max number of results to show
	* @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
	* @param {String} [args.initial] Index of the default value
	* @param {boolean} [opts.clearFirst] The first ESCAPE keypress will clear the input
	* @param {String} [args.fallback] Fallback message - defaults to initial value
	* @param {function} [args.onState] On state change callback
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.autocomplete = (args) => {
		args.suggest = args.suggest || byTitle;
		args.choices = [].concat(args.choices || []);
		return toPrompt("AutocompletePrompt", args);
	};
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/index.js
var require_lib = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const prompts = require_prompts$1();
	const passOn = [
		"suggest",
		"format",
		"onState",
		"validate",
		"onRender",
		"type"
	];
	const noop = () => {};
	/**
	* Prompt for a series of questions
	* @param {Array|Object} questions Single question object or Array of question objects
	* @param {Function} [onSubmit] Callback function called on prompt submit
	* @param {Function} [onCancel] Callback function called on cancel/abort
	* @returns {Object} Object with values from user input
	*/
	async function prompt(questions = [], { onSubmit = noop, onCancel = noop } = {}) {
		const answers = {};
		const override = prompt._override || {};
		questions = [].concat(questions);
		let answer, question, quit, name, type, lastPrompt;
		const getFormattedAnswer = async (question, answer, skipValidation = false) => {
			if (!skipValidation && question.validate && question.validate(answer) !== true) return;
			return question.format ? await question.format(answer, answers) : answer;
		};
		for (question of questions) {
			({name, type} = question);
			if (typeof type === "function") {
				type = await type(answer, { ...answers }, question);
				question["type"] = type;
			}
			if (!type) continue;
			for (let key in question) {
				if (passOn.includes(key)) continue;
				let value = question[key];
				question[key] = typeof value === "function" ? await value(answer, { ...answers }, lastPrompt) : value;
			}
			lastPrompt = question;
			if (typeof question.message !== "string") throw new Error("prompt message is required");
			({name, type} = question);
			if (prompts[type] === void 0) throw new Error(`prompt type (${type}) is not defined`);
			if (override[question.name] !== void 0) {
				answer = await getFormattedAnswer(question, override[question.name]);
				if (answer !== void 0) {
					answers[name] = answer;
					continue;
				}
			}
			try {
				answer = prompt._injected ? getInjectedAnswer(prompt._injected, question.initial) : await prompts[type](question);
				answers[name] = answer = await getFormattedAnswer(question, answer, true);
				quit = await onSubmit(question, answer, answers);
			} catch (err) {
				quit = !await onCancel(question, answers);
			}
			if (quit) return answers;
		}
		return answers;
	}
	function getInjectedAnswer(injected, deafultValue) {
		const answer = injected.shift();
		if (answer instanceof Error) throw answer;
		return answer === void 0 ? deafultValue : answer;
	}
	function inject(answers) {
		prompt._injected = (prompt._injected || []).concat(answers);
	}
	function override(answers) {
		prompt._override = Object.assign({}, answers);
	}
	module.exports = Object.assign(prompt, {
		prompt,
		prompts,
		inject,
		override
	});
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/index.js
var require_prompts = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function isNodeLT(tar) {
		tar = (Array.isArray(tar) ? tar : tar.split(".")).map(Number);
		let i = 0, src = process.versions.node.split(".").map(Number);
		for (; i < tar.length; i++) {
			if (src[i] > tar[i]) return false;
			if (tar[i] > src[i]) return true;
		}
		return false;
	}
	module.exports = isNodeLT("8.6.0") ? require_dist() : require_lib();
}));
//#endregion
//#region node_modules/.pnpm/tiny-conventional-commits-parser@0.1.0/node_modules/tiny-conventional-commits-parser/dist/index.mjs
function execCommand(cmd, options) {
	try {
		return execSync(cmd, {
			encoding: "utf8",
			cwd: options?.cwd
		}).trim();
	} catch (error) {
		return "";
	}
}
function getLastGitTag() {
	return execCommand("git describe --tags --abbrev=0")?.split("\n").at(0) || void 0;
}
const GIT_LOG_FORMAT = "%h|%s|%an|%ae|%ad|%b[GIT_LOG_COMMIT_END]";
function getGitLog(from, to = "HEAD", path) {
	return execCommand(`git --no-pager log "${from ? `${from}...${to}` : to}" --pretty="${GIT_LOG_FORMAT}" ${path ? `-- ${path}` : ""}`).split("[GIT_LOG_COMMIT_END]\n").filter(Boolean);
}
const ConventionalCommitRegex = /(?<emoji>:.+:|(\uD83C[\uDF00-\uDFFF])|(\uD83D[\uDC00-\uDE4F\uDE80-\uDEFF])|[\u2600-\u2B55])?( *)(?<type>[a-z]+)(\((?<scope>.+)\))?(?<breaking>!)?: (?<description>.+)/i;
const CoAuthoredByRegex = /co-authored-by:\s*(?<name>.+)(<(?<email>.+)>)/gi;
const PullRequestRE = /\([ a-z]*(#\d+)\s*\)/g;
const IssueRE = /(#\d+)/g;
const BreakingRE = /breaking[ -]changes?:/i;
function parseRawCommit(commit) {
	const [shortHash, message, authorName, authorEmail, data, ..._body] = commit.split("|");
	const body = _body.filter(Boolean).join("\n");
	return {
		author: {
			name: authorName,
			email: authorEmail
		},
		body,
		data,
		message,
		shortHash
	};
}
function parseCommit(rawCommit) {
	const { shortHash, message, body, data } = rawCommit;
	const match = message.match(ConventionalCommitRegex);
	const isConventional = match !== null;
	const type = match?.groups?.type || "";
	const scope = match?.groups?.scope || "";
	let description = match?.groups?.description || message;
	const hasBreakingBody = BreakingRE.test(body);
	const isBreaking = Boolean(match?.groups?.breaking || hasBreakingBody);
	const references = [];
	for (const m of description.matchAll(PullRequestRE)) references.push({
		type: "pull-request",
		value: m[1]
	});
	for (const m of description.matchAll(IssueRE)) if (!references.some((i) => i.value === m[1])) references.push({
		type: "issue",
		value: m[1]
	});
	description = description.replace(PullRequestRE, "").trim();
	const authors = [rawCommit.author];
	for (const match2 of body.matchAll(CoAuthoredByRegex)) authors.push({
		name: (match2.groups?.name || "").trim(),
		email: (match2.groups?.email || "").trim()
	});
	return {
		authors,
		body,
		data,
		description,
		isBreaking,
		isConventional,
		message,
		references,
		scope,
		shortHash,
		type
	};
}
function getCommits(from, to, path) {
	return getGitLog(from, to, path).map(parseRawCommit).map(parseCommit);
}
function getRecentCommits(from, to, path) {
	if (!from) from = getLastGitTag();
	if (!to) to = "HEAD";
	return getCommits(from, to, path);
}
//#endregion
//#region src/cli/symbols.ts
const symbols = {
	success: styleText("green", "✔"),
	info: styleText("blue", "ℹ")
};
//#endregion
//#region src/fs.ts
/**
* Reads a JSON/JSONC file and returns the parsed data.
*/
async function readJsoncFile(name, cwd) {
	const file = await readTextFile(name, cwd);
	const data = jsonc.parse(file.data);
	const modified = [];
	return {
		...file,
		data,
		modified,
		text: file.data
	};
}
/**
* Writes the given data to the specified JSON/JSONC file.
*/
async function writeJsoncFile(file) {
	let newJSON = file.text;
	for (const [key, value] of file.modified) {
		const edit = jsonc.modify(newJSON, key, value, {});
		newJSON = jsonc.applyEdits(newJSON, edit);
	}
	return writeTextFile({
		...file,
		data: newJSON
	});
}
/**
* Reads a text file and returns its contents.
*/
function readTextFile(name, cwd) {
	return new Promise((resolve, reject) => {
		const filePath = path.join(cwd, name);
		fsSync.readFile(filePath, "utf8", (err, text) => {
			if (err) reject(err);
			else resolve({
				path: filePath,
				data: text
			});
		});
	});
}
/**
* Writes the given text to the specified file.
*/
function writeTextFile(file) {
	return new Promise((resolve, reject) => {
		fsSync.writeFile(file.path, file.data, (err) => {
			if (err) reject(err);
			else resolve();
		});
	});
}
//#endregion
//#region src/manifest.ts
/**
* Determines whether the specified value is a package manifest.
*/
function isManifest(obj) {
	return obj && typeof obj === "object" && isOptionalString(obj.name) && isOptionalString(obj.version) && isOptionalString(obj.description);
}
/**
* Determines whether the specified manifest is package-lock.json
*/
function isPackageLockManifest(manifest) {
	return typeof manifest.packages?.[""]?.version === "string";
}
/**
* Determines whether the specified value is a string, null, or undefined.
*/
function isOptionalString(value) {
	const type = typeof value;
	return value === null || type === "undefined" || type === "string";
}
//#endregion
//#region src/get-current-version.ts
/**
* Finds the current version number from files such as package.json.
* An error is thrown if no version number can be found.
*/
async function getCurrentVersion(operation) {
	if (operation.state.currentVersion) return operation;
	const { cwd, files } = operation.options;
	const filesToCheck = files.filter((file) => file.endsWith(".json"));
	if (!filesToCheck.includes("package.json")) filesToCheck.push("package.json");
	if (!filesToCheck.includes("deno.json")) filesToCheck.push("deno.json");
	if (!filesToCheck.includes("deno.jsonc")) filesToCheck.push("deno.jsonc");
	for (const file of filesToCheck) {
		const version = await readVersion(file, cwd);
		if (version) return operation.update({
			currentVersionSource: file,
			currentVersion: version
		});
	}
	throw new Error(`Unable to determine the current version number. Checked ${filesToCheck.join(", ")}.`);
}
/**
* Tries to read the version number from the specified JSON file.
*
* @returns - The version number, or undefined if the file doesn't have a version number
*/
async function readVersion(file, cwd) {
	try {
		const { data: manifest } = await readJsoncFile(file, cwd);
		if (isManifest(manifest)) {
			if (valid(manifest.version)) return manifest.version;
		}
	} catch {
		return;
	}
}
//#endregion
//#region src/release-type.ts
/**
* The different types of pre-releases.
*/
const prereleaseTypes = [
	"premajor",
	"preminor",
	"prepatch",
	"prerelease"
];
/**
* All possible release types.
*/
const releaseTypes = [
	...prereleaseTypes,
	"major",
	"minor",
	"patch",
	"next",
	"conventional"
];
/**
* Determines whether the specified value is a pre-release.
*/
function isPrerelease(value) {
	return prereleaseTypes.includes(value);
}
/**
* Determines whether the specified value is a valid ReleaseType string.
*/
function isReleaseType(value) {
	return releaseTypes.includes(value);
}
//#endregion
//#region src/get-new-version.ts
var import_prompts = /* @__PURE__ */ __toESM(require_prompts(), 1);
/**
* Determines the new version number, possibly by prompting the user for it.
*/
async function getNewVersion(operation, commits) {
	const { release } = operation.options;
	const { currentVersion } = operation.state;
	switch (release.type) {
		case "prompt": return promptForNewVersion(operation, commits);
		case "version": return operation.update({ newVersion: new SemVer(release.version, true).version });
		default: return operation.update({
			release: release.type,
			newVersion: getNextVersion(currentVersion, release, commits)
		});
	}
}
/**
* Returns the next version number of the specified type.
*/
function getNextVersion(currentVersion, bump, commits) {
	const oldSemVer = new SemVer(currentVersion);
	let type;
	if (bump.type === "next") type = oldSemVer.prerelease.length ? "prerelease" : "patch";
	else if (bump.type === "conventional") type = oldSemVer.prerelease.length ? "prerelease" : determineSemverChange(commits);
	else type = bump.type;
	const newSemVer = oldSemVer.inc(type, bump.preid);
	if (isPrerelease(bump.type) && newSemVer.prerelease.length === 2 && newSemVer.prerelease[0] === bump.preid && String(newSemVer.prerelease[1]) === "0") {
		newSemVer.prerelease[1] = "1";
		newSemVer.format();
	}
	return newSemVer.version;
}
function determineSemverChange(commits) {
	let [hasMajor, hasMinor] = [false, false];
	for (const commit of commits) if (commit.isBreaking) hasMajor = true;
	else if (commit.type === "feat") hasMinor = true;
	return hasMajor ? "major" : hasMinor ? "minor" : "patch";
}
/**
* Returns the next version number for all release types.
*/
function getNextVersions(currentVersion, preid, commits) {
	const next = {};
	const parse = semver.parse(currentVersion);
	if (typeof parse?.prerelease[0] === "string") preid = parse?.prerelease[0] || "preid";
	for (const type of releaseTypes) next[type] = getNextVersion(currentVersion, {
		type,
		preid
	}, commits);
	return next;
}
/**
* Prompts the user for the new version number.
*
* @returns - A tuple containing the new version number and the release type (if any)
*/
async function promptForNewVersion(operation, commits) {
	const { currentVersion } = operation.state;
	const release = operation.options.release;
	const next = getNextVersions(currentVersion, release.preid, commits);
	const configCustomVersion = await operation.options.customVersion?.(currentVersion, semver);
	const PADDING = 13;
	const answers = await (0, import_prompts.default)([{
		type: "autocomplete",
		name: "release",
		message: `Current version ${styleText("green", currentVersion)}`,
		initial: configCustomVersion ? "config" : "next",
		choices: [
			{
				value: "major",
				title: `${"major".padStart(PADDING, " ")} ${styleText("bold", next.major)}`
			},
			{
				value: "minor",
				title: `${"minor".padStart(PADDING, " ")} ${styleText("bold", next.minor)}`
			},
			{
				value: "patch",
				title: `${"patch".padStart(PADDING, " ")} ${styleText("bold", next.patch)}`
			},
			{
				value: "next",
				title: `${"next".padStart(PADDING, " ")} ${styleText("bold", next.next)}`
			},
			{
				value: "conventional",
				title: `${"conventional".padStart(PADDING, " ")} ${styleText("bold", next.conventional)}`
			},
			...configCustomVersion ? [{
				value: "config",
				title: `${"from config".padStart(PADDING, " ")} ${styleText("bold", configCustomVersion)}`
			}] : [],
			{
				value: "prepatch",
				title: `${"pre-patch".padStart(PADDING, " ")} ${styleText("bold", next.prepatch)}`
			},
			{
				value: "preminor",
				title: `${"pre-minor".padStart(PADDING, " ")} ${styleText("bold", next.preminor)}`
			},
			{
				value: "premajor",
				title: `${"pre-major".padStart(PADDING, " ")} ${styleText("bold", next.premajor)}`
			},
			{
				value: "none",
				title: `${"as-is".padStart(PADDING, " ")} ${styleText("bold", currentVersion)}`
			},
			{
				value: "custom",
				title: "custom ...".padStart(PADDING + 4, " ")
			}
		]
	}, {
		type: (prev) => prev === "custom" ? "text" : null,
		name: "custom",
		message: "Enter the new version number:",
		initial: currentVersion,
		validate: (custom) => {
			return valid(custom) ? true : "That's not a valid version number";
		}
	}]);
	const newVersion = answers.release === "none" ? currentVersion : answers.release === "custom" ? clean(answers.custom) : answers.release === "config" ? clean(configCustomVersion) : next[answers.release];
	if (!newVersion) process$1.exit(1);
	switch (answers.release) {
		case "custom":
		case "config":
		case "next":
		case "conventional":
		case "none": return operation.update({ newVersion });
		default: return operation.update({
			release: answers.release,
			newVersion
		});
	}
}
//#endregion
//#region src/types/version-bump-progress.ts
/**
* Progress events that indicate the progress of the `versionBump()` function.
*/
let ProgressEvent = /* @__PURE__ */ function(ProgressEvent) {
	ProgressEvent["FileUpdated"] = "file updated";
	ProgressEvent["FileSkipped"] = "file skipped";
	ProgressEvent["GitCommit"] = "git commit";
	ProgressEvent["GitTag"] = "git tag";
	ProgressEvent["GitPush"] = "git push";
	ProgressEvent["NpmScript"] = "npm script";
	return ProgressEvent;
}({});
/**
* The NPM version scripts
*
* @see https://docs.npmjs.com/cli/version.html
*/
let NpmScript = /* @__PURE__ */ function(NpmScript) {
	NpmScript["PreVersion"] = "preversion";
	NpmScript["Version"] = "version";
	NpmScript["PostVersion"] = "postversion";
	return NpmScript;
}({});
//#endregion
//#region src/git.ts
/**
* Commits the modififed files to Git, if the `commit` option is enabled.
*/
async function gitCommit(operation) {
	if (!operation.options.commit) return operation;
	const { all, noVerify, message } = operation.options.commit;
	const { updatedFiles, newVersion } = operation.state;
	let args = ["--allow-empty"];
	if (all) args.push("--all");
	if (noVerify) args.push("--no-verify");
	if (operation.options.sign) args.push("--gpg-sign");
	const commitMessage = formatVersionString(message, newVersion);
	args.push("--message", commitMessage);
	if (!all) args = [...args, ...updatedFiles];
	await x("git", ["commit", ...args], { throwOnError: true });
	return operation.update({
		event: ProgressEvent.GitCommit,
		commitMessage
	});
}
/**
* Tags the Git commit, if the `tag` option is enabled.
*/
async function gitTag(operation) {
	if (!operation.options.tag) return operation;
	const { commit, tag } = operation.options;
	const { newVersion } = operation.state;
	const args = [
		"--annotate",
		"--message",
		formatVersionString(commit.message, newVersion)
	];
	const tagName = formatVersionString(tag.name, newVersion);
	args.push(tagName);
	if (operation.options.sign) args.push("--sign");
	await x("git", ["tag", ...args], { throwOnError: true });
	return operation.update({
		event: ProgressEvent.GitTag,
		tagName
	});
}
/**
* Pushes the Git commit and tag, if the `push` option is enabled.
*/
async function gitPush(operation) {
	if (!operation.options.push) return operation;
	await x("git", ["push"], { throwOnError: true });
	if (operation.options.tag) await x("git", ["push", "--tags"], { throwOnError: true });
	return operation.update({ event: ProgressEvent.GitPush });
}
/**
* Accepts a version string template (e.g. "release v" or "This is the %s release").
* If the template contains any "%s" placeholders, then they are replaced with the version number;
* otherwise, the version number is appended to the string.
*/
function formatVersionString(template, newVersion) {
	if (template.includes("%s")) return template.replaceAll("%s", newVersion);
	else return template + newVersion;
}
//#endregion
//#region src/normalize-options.ts
/**
* Converts raw VersionBumpOptions to a normalized and sanitized Options object.
*/
async function normalizeOptions(raw) {
	const preid = typeof raw.preid === "string" ? raw.preid : "beta";
	const sign = Boolean(raw.sign);
	const push = Boolean(raw.push);
	const all = Boolean(raw.all);
	const install = Boolean(raw.install);
	const noVerify = Boolean(raw.noVerify);
	const cwd = raw.cwd || process$1.cwd();
	const ignoreScripts = Boolean(raw.ignoreScripts);
	const execute = raw.execute;
	const recursive = Boolean(raw.recursive);
	let release;
	if (!raw.release || raw.release === "prompt") release = {
		type: "prompt",
		preid
	};
	else if (isReleaseType(raw.release) || raw.release === "next") release = {
		type: raw.release,
		preid
	};
	else release = {
		type: "version",
		version: raw.release
	};
	let tag;
	if (typeof raw.tag === "string") tag = { name: raw.tag };
	else if (raw.tag) tag = { name: "v" };
	let commit;
	if (typeof raw.commit === "string") commit = {
		all,
		noVerify,
		message: raw.commit
	};
	else if (raw.commit || tag || push) commit = {
		all,
		noVerify,
		message: "chore: release v"
	};
	if (recursive && !raw.files?.length) {
		raw.files = [
			"package.json",
			"package-lock.json",
			"packages/**/package.json",
			"jsr.json",
			"jsr.jsonc",
			"deno.json",
			"deno.jsonc"
		];
		/** package.json defined in workspace */
		const workspaces = [];
		if (fsSync.existsSync("pnpm-workspace.yaml")) {
			const pnpmWorkspace = await fs.readFile("pnpm-workspace.yaml", "utf8").then(yaml.parse);
			workspaces.push(...pnpmWorkspace.packages ?? []);
		}
		if (fsSync.existsSync("package.json")) {
			const packageJson = await fs.readFile("package.json", "utf8").then(JSON.parse);
			const _workspaces = Array.isArray(packageJson.workspaces) ? packageJson.workspaces : packageJson.workspaces && Array.isArray(packageJson.workspaces.packages) ? packageJson.workspaces.packages : [];
			workspaces.push(..._workspaces);
		}
		const withoutExcludedWorkspaces = workspaces.map((workspace) => `${workspace}/package.json`).filter((workspace) => !workspace.startsWith("!") && !raw.files?.includes(workspace));
		raw.files = [...raw.files, ...withoutExcludedWorkspaces];
	} else raw.files = raw.files?.length ? raw.files : [
		"package.json",
		"package-lock.json",
		"jsr.json",
		"jsr.jsonc",
		"deno.json",
		"deno.jsonc"
	];
	const files = await glob(raw.files, {
		cwd,
		onlyFiles: true,
		expandDirectories: false,
		ignore: ["**/{.git,node_modules,bower_components,__tests__,fixtures,fixture}/**"]
	});
	let ui;
	if (raw.interface === false) ui = {
		input: false,
		output: false
	};
	else if (raw.interface === true || !raw.interface) ui = {
		input: process$1.stdin,
		output: process$1.stdout
	};
	else {
		let { input, output, ...other } = raw.interface;
		if (input === true || input !== false && !input) input = process$1.stdin;
		if (output === true || output !== false && !output) output = process$1.stdout;
		ui = {
			input,
			output,
			...other
		};
	}
	if (release.type === "prompt" && !(ui.input && ui.output)) throw new Error("Cannot prompt for the version number because input or output has been disabled.");
	return {
		release,
		commit,
		tag,
		sign,
		push,
		files,
		cwd,
		install,
		interface: ui,
		ignoreScripts,
		execute,
		printCommits: raw.printCommits ?? true,
		customVersion: raw.customVersion,
		currentVersion: raw.currentVersion
	};
}
//#endregion
//#region src/operation.ts
/**
* All of the inputs, outputs, and state of a single `versionBump()` call.
*/
var Operation = class Operation {
	/**
	* The options for this operation.
	*/
	options;
	/**
	* The current state of the operation.
	*/
	state = {
		release: void 0,
		currentVersion: "",
		currentVersionSource: "",
		newVersion: "",
		commitMessage: "",
		tagName: "",
		updatedFiles: [],
		skippedFiles: []
	};
	/**
	* The results of the operation.
	*/
	get results() {
		const options = this.options;
		const state = this.state;
		return {
			release: state.release,
			currentVersion: state.currentVersion,
			newVersion: state.newVersion,
			commit: options.commit ? state.commitMessage : false,
			tag: options.tag ? state.tagName : false,
			updatedFiles: state.updatedFiles.slice(),
			skippedFiles: state.skippedFiles.slice()
		};
	}
	/**
	* The callback that's used to report the progress of the operation.
	*/
	_progress;
	/**
	* Private constructor.  Use the `Operation.start()` static method instead.
	*/
	constructor(options, progress) {
		this.options = options;
		this._progress = progress;
		if (options.currentVersion) this.update({
			currentVersion: options.currentVersion,
			currentVersionSource: "user"
		});
	}
	/**
	* Starts a new `versionBump()` operation.
	*/
	static async start(input) {
		return new Operation(await normalizeOptions(input), input.progress);
	}
	/**
	* Updates the operation state and results, and reports the updated progress to the user.
	*/
	update({ event, script, ...newState }) {
		Object.assign(this.state, newState);
		if (event && this._progress) this._progress({
			event,
			script,
			...this.results
		});
		return this;
	}
};
//#endregion
//#region src/print-commits.ts
const colorFn = (color) => (s) => styleText(color, s);
const gray = colorFn("gray");
const green = colorFn("green");
const cyan = colorFn("cyan");
const blue = colorFn("blue");
const yellow = colorFn("yellow");
const magenta = colorFn("magenta");
const red = colorFn("red");
const messageColorMap = {
	feat: green,
	feature: green,
	refactor: cyan,
	style: cyan,
	docs: blue,
	doc: blue,
	types: blue,
	type: blue,
	chore: gray,
	ci: gray,
	build: gray,
	deps: gray,
	dev: gray,
	fix: yellow,
	test: yellow,
	perf: magenta,
	revert: red,
	breaking: red
};
function formatParsedCommits(commits) {
	const typeLength = commits.map(({ type }) => type.length).reduce((a, b) => Math.max(a, b), 0);
	const scopeLength = commits.map(({ scope }) => scope.length).reduce((a, b) => Math.max(a, b), 0);
	return commits.map((commit) => {
		let color = messageColorMap[commit.type] || ((s) => s);
		if (commit.isBreaking) color = (s) => styleText(["inverse", "red"], s);
		const paddedType = commit.type.padStart(typeLength + 1, " ");
		const paddedScope = !commit.scope ? " ".repeat(scopeLength ? scopeLength + 2 : 0) : styleText("dim", "(") + commit.scope + styleText("dim", ")") + " ".repeat(scopeLength - commit.scope.length);
		return [
			styleText("dim", commit.shortHash),
			" ",
			color === gray ? color(paddedType) : styleText("bold", color(paddedType)),
			" ",
			paddedScope,
			styleText("dim", ":"),
			" ",
			color === gray ? color(commit.description) : commit.description
		].join("");
	});
}
function printRecentCommits(commits) {
	if (!commits.length) {
		console.log();
		console.log(styleText("blue", "i") + styleText("gray", " No commits since the last version"));
		console.log();
		return;
	}
	const prettified = formatParsedCommits(commits);
	console.log();
	console.log(styleText("bold", `${styleText("green", String(commits.length))} Commits since the last version:`));
	console.log();
	console.log(prettified.join("\n"));
	console.log();
}
//#endregion
//#region src/run-npm-script.ts
/**
* Runs the specified NPM script in the package.json file.
*/
async function runNpmScript(script, operation) {
	const { cwd, ignoreScripts } = operation.options;
	if (!ignoreScripts) {
		const { data: manifest } = await readJsoncFile("package.json", cwd);
		if (isManifest(manifest) && hasScript(manifest, script)) {
			await x("npm", [
				"run",
				script,
				"--silent"
			], { nodeOptions: { stdio: "inherit" } });
			operation.update({
				event: ProgressEvent.NpmScript,
				script
			});
		}
	}
	return operation;
}
/**
* Determines whether the specified NPM script exists in the given manifest.
*/
function hasScript(manifest, script) {
	const scripts = manifest.scripts;
	if (scripts && typeof scripts === "object") return Boolean(scripts[script]);
	return false;
}
//#endregion
//#region src/update-files.ts
/**
* Updates the version number in the specified files.
*/
async function updateFiles(operation) {
	const { files, cwd } = operation.options;
	for (const relPath of files) {
		const modified = await updateFile(relPath, operation);
		const absPath = path$1.resolve(cwd, relPath);
		if (modified) operation.update({
			event: ProgressEvent.FileUpdated,
			updatedFiles: [...operation.state.updatedFiles, absPath]
		});
		else operation.update({
			event: ProgressEvent.FileSkipped,
			skippedFiles: [...operation.state.skippedFiles, absPath]
		});
	}
	return operation;
}
/**
* Updates the version number in the specified file.
*
* @returns - `true` if the file was actually modified
*/
async function updateFile(relPath, operation) {
	if (!existsSync(path$1.join(operation.options.cwd, relPath))) return false;
	switch (path$1.basename(relPath).trim().toLowerCase()) {
		case "package.json":
		case "package-lock.json":
		case "bower.json":
		case "component.json":
		case "jsr.json":
		case "jsr.jsonc":
		case "deno.json":
		case "deno.jsonc": return updateManifestFile(relPath, operation);
		default: return updateTextFile(relPath, operation);
	}
}
/**
* Updates the version number in the specified JSON manifest file.
*
* NOTE: Unlike text files, this is NOT a global find-and-replace.  It _specifically_ sets
* the top-level `version` property.
*
* @returns - `true` if the file was actually modified
*/
async function updateManifestFile(relPath, operation) {
	const { cwd } = operation.options;
	const { newVersion } = operation.state;
	let modified = false;
	const file = await readJsoncFile(relPath, cwd);
	if (!isManifest(file.data)) return modified;
	if (file.data.version == null) return modified;
	if (file.data.version !== newVersion) {
		file.modified.push([["version"], newVersion]);
		if (isPackageLockManifest(file.data)) file.modified.push([[
			"packages",
			"",
			"version"
		], newVersion]);
		await writeJsoncFile(file);
		modified = true;
	}
	return modified;
}
/**
* Updates all occurrences of the version number in the specified text file.
*
* @returns - `true` if the file was actually modified
*/
async function updateTextFile(relPath, operation) {
	const { cwd } = operation.options;
	const { currentVersion, newVersion } = operation.state;
	const modified = false;
	const file = await readTextFile(relPath, cwd);
	if (file.data.includes(currentVersion)) {
		const sanitizedVersion = currentVersion.replace(/(\W)/g, "\\$1");
		const replacePattern = new RegExp(`(\\b|v)${sanitizedVersion}\\b`, "g");
		file.data = file.data.replace(replacePattern, `$1${newVersion}`);
		await writeTextFile(file);
		return true;
	}
	return modified;
}
//#endregion
//#region src/version-bump.ts
/**
* Bumps the version number in one or more files, prompting the user if necessary.
* Optionally also commits, tags, and pushes to git.
*/
async function versionBump(arg = {}) {
	if (typeof arg === "string") arg = { release: arg };
	const operation = await Operation.start(arg);
	const commits = getRecentCommits();
	if (operation.options.printCommits) printRecentCommits(commits);
	await getCurrentVersion(operation);
	await getNewVersion(operation, commits);
	if (arg.confirm) {
		printSummary(operation);
		if (!await (0, import_prompts.default)({
			name: "yes",
			type: "confirm",
			message: "Bump?",
			initial: true
		}).then((r) => r.yes)) process$1.exit(1);
	}
	await runNpmScript(NpmScript.PreVersion, operation);
	await updateFiles(operation);
	if (operation.options.install) {
		const { detect } = await import("package-manager-detector/detect");
		const pm = await detect();
		if (!pm?.name) throw new Error("Could not detect package manager, failed to run npm install");
		const { COMMANDS, constructCommand } = await import("package-manager-detector/commands");
		const command = constructCommand(COMMANDS[pm.name].install, []);
		if (!command) throw new Error("Could not find install command for package manager");
		console.log(symbols.info, "Installing dependencies with", `${command.command} ${command.args.join(" ")}`);
		await x(command.command, command.args, {
			throwOnError: true,
			nodeOptions: {
				stdio: "inherit",
				cwd: operation.options.cwd
			}
		});
		console.log(symbols.success, "Dependencies installed");
	}
	if (operation.options.execute) if (typeof operation.options.execute === "function") await operation.options.execute(operation);
	else {
		const [command, ...args] = tokenizeArgs(operation.options.execute);
		console.log(symbols.info, "Executing script", command, ...args);
		await x(command, args, {
			throwOnError: true,
			nodeOptions: {
				stdio: "inherit",
				cwd: operation.options.cwd
			}
		});
		console.log(symbols.success, "Script finished");
	}
	await runNpmScript(NpmScript.Version, operation);
	await gitCommit(operation);
	await gitTag(operation);
	await runNpmScript(NpmScript.PostVersion, operation);
	await gitPush(operation);
	return operation.results;
}
function printSummary(operation) {
	console.log();
	console.log(`   files ${operation.options.files.map((i) => styleText("bold", i)).join("\n         ")}`);
	if (operation.options.commit) console.log(`  commit ${styleText("bold", formatVersionString(operation.options.commit.message, operation.state.newVersion))}`);
	if (operation.options.tag) console.log(`     tag ${styleText("bold", formatVersionString(operation.options.tag.name, operation.state.newVersion))}`);
	if (operation.options.execute) console.log(` execute ${styleText("bold", typeof operation.options.execute === "function" ? "function" : operation.options.execute)}`);
	if (operation.options.push) console.log(`    push ${styleText(["cyan", "bold"], "yes")}`);
	if (operation.options.install) console.log(` install ${styleText(["cyan", "bold"], "yes")}`);
	console.log();
	console.log(`    from ${styleText("bold", operation.state.currentVersion)}`);
	console.log(`      to ${styleText(["green", "bold"], operation.state.newVersion)}`);
	console.log();
}
/**
* Bumps the version number in one or more files, prompting users if necessary.
*/
async function versionBumpInfo(arg = {}) {
	if (typeof arg === "string") arg = { release: arg };
	const operation = await Operation.start(arg);
	const commits = getRecentCommits();
	await getCurrentVersion(operation);
	await getNewVersion(operation, commits);
	return operation;
}
//#endregion
//#region src/config.ts
const bumpConfigDefaults = {
	commit: true,
	push: true,
	tag: true,
	sign: false,
	install: false,
	recursive: false,
	noVerify: false,
	confirm: true,
	ignoreScripts: false,
	all: false,
	noGitCheck: true,
	files: [],
	configFilePath: void 0
};
async function loadBumpConfig(overrides, cwd = process$1.cwd()) {
	const name = "bump";
	const customPath = overrides?.configFilePath;
	const { config } = await loadConfig({
		sources: [customPath ? {
			files: [customPath],
			extensions: []
		} : {
			files: `${name}.config`,
			extensions: [
				"ts",
				"mts",
				"cts",
				"js",
				"mjs",
				"cjs",
				"json"
			]
		}],
		defaults: bumpConfigDefaults,
		cwd
	});
	const definedOverrides = overrides ? Object.fromEntries(Object.entries(overrides).filter(([, v]) => v !== void 0)) : {};
	return {
		...bumpConfigDefaults,
		...config,
		...definedOverrides
	};
}
function defineConfig(config) {
	return config;
}
//#endregion
export { versionBumpInfo as a, isReleaseType as c, versionBump as i, symbols as l, defineConfig as n, NpmScript as o, loadBumpConfig as r, ProgressEvent as s, bumpConfigDefaults as t };
