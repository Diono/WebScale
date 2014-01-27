/**
 * WebScale v0.1
 *
 * @author Diono CORBEL
 * http://www.diono.fr/
 * http://www.dionofolio.com/
 * http://www.dionoportfolio.com/
 */

;
// use strict mode to improve performance of javascript
"use strict";
(function(win, undefined) {

	// ==================================================
	//
	//                    PRIVATE API
	//
	// ==================================================

	// accelerate access to the document
	var doc = win.document,

		// retrieve the type of functions for validation
		tyFunc = typeof

		function() {},

		// retrieve the type of string for validations
		tyStr = typeof "a",

		// retrieve the type of objects for validations
		tyObj = typeof {},

		// retrieve the type of number for validations
		tyNum = typeof 1,

		//
		// ==================================================
		// CSS3 DETECTION
		// ==================================================
		//

		// list of prefixes for compatibility css3 properties
		compatibility = ["", "-khtml-", "-moz-", "-ms-", "-o-", "-webkit-"],

		// backup number of items in the list to accelerate the execution of loops
		compatibilityLength = compatibility.length,

		// recovery compatible version of the css3 property "transform" to initialize WebScale
		transform = null,

		// recovery compatible version of the css3 property "transform-origin" to initialize WebScale
		transformOrigin = null,

		//
		// seeks compatible version for css3 "transform" and "transform-origin" properties
		// -------------------------------------------------------------------------------
		//
		detect = function() {

			transform = availableCss('transform');
			transformOrigin = availableCss('transform-origin');

			if (win.console && typeof win.console.log === tyFunc) win.console.log('[WebScale] available css3 properties : "' + transform + '" and "' + transformOrigin + '"');
		},

		//
		// compare all existing same css3 property to determine which versions are available
		// ---------------------------------------------------------------------------------
		//
		// @param  String      css  name of the css3 property
		// @param  Boolean     loop if the function is called by itself
		// @param  Number      ext  selection prefix combined with the css3 property
		// @return String/Null      version of the css3 property available
		//
		availableCss = function(css, loop, ext) {

			ext = ext ? ext : 0;

			// defines the returned value
			var compaCss = compatibility[ext] + css,
				value = undefined;

			if (doc.body.style) value = doc.body.style[compaCss];


			// try to convert css name to find value example : font-family <> fontFamily
			if (value === undefined) {
				compaCss = null;

				if (!loop) {

					var compaCss = compatibility[ext].replace('-', '') + "-" + css,
						splitCss = compaCss.split('-'),
						splitLength = splitCss.length;

					if (splitLength > 0) {
						compaCss = splitLength[0].toLowerCase();

						for (var i = 1; i < splitLength; i++) {
							compaCss += splitCss[i].charAt(0).toUpperCase();
							compaCss += splitCss[i].slice(1);
						}

						compaCss = availableCss(compaCss, true, ext);
					}
				}

				ext++;
				if (!compaCss && ext < compatibilityLength) compaCss = availableCss(css, false, ext);

			}

			return compaCss;
		},

		//
		// ==================================================
		// LISTENER
		// ==================================================
		//

		//
		// listens for events of a DOM element
		// -----------------------------------
		//
		// @param Object/String target    the DOM object selected (NOT JQuery selector) or the id of the element
		// @param String        eventName the name of the event to listen
		// @param Function      callback  function to execute once the detected event
		//
		ON = function(target, eventName, callback) {
			if (target && typeof callback === tyFunc) {
				(function(self, $target, evtName, called) {

					var run = function(evt) {
						called.call(self, evt);
					};

					if ($target.addEventListener) $target.addEventListener(evtName, run, false);
					else if ($target.attachEvent) $target.attachEvent('on' + evtName, run);
					else {
						var lowerName = evtName.toLowerCase(),
							capitalizeName = evtName.charAt(0)
								.toUpperCase() + evtName.slice(1)
								.toLowerCase();
						switch (lowerName) {
							case "keydown":
								$target.setAttribute('onKeydown', "return " + called.toString());
								if (doc.all) $target.onkeydown = run;
								else $target.onKeydown = run;
								break;
							case "keypress":
								$target.setAttribute('onKeypress', "return " + called.toString());
								if (doc.all) $target.onkeypress = run;
								else $target.onKeypress = run;
								break;
							case "keyup":
								$target.setAttribute('onKeyup', "return " + called.toString());
								if (doc.all) $target.onkeyup = run;
								else $target.onKeyup = run;
								break;
							case "unload":
								$target.setAttribute('unload', "return " + called.toString());
								$target.unload = run;
								break;
							default:
								if ($target['on' + lowerName] !== undefined) $target['on' + lowerName] = run;
								else if ($target['on' + evtName] !== undefined) $target['on' + evtName] = run;
								else if ($target['on' + capitalizeName] !== undefined) $target['on' + capitalizeName] = run;
								break;
						}
					}
				})(this, $(target), eventName, callback);
			}
			return this;
		},

		//
		// ==================================================
		// PIXEL CONVERSION
		// ==================================================
		//

		//
		// calculating a pixel value with a reference (for example use of percentages)
		// ---------------------------------------------------------------------------
		//
		// @param  String/Number value     value to calculate
		// @param  Number        reference the reference for the calculation
		// @return Number                  the calculated pixel value
		//
		convert = function(value, reference) {

			var result = 0;

			if (typeof value === tyNum) result = value;
			else if (typeof value === tyStr) {

				if (/^[0-9]+([\.,][0-9]+)?%$/.test(value) && typeof reference === tyNum) result = (((reference * parseFloat(value.replace(',', '.'))) / 100) << 0) + 1;
				else if (/^[0-9]+(px)?$/.test(value)) result = ((parseFloat(value)) << 0) + 1;
			}
			return result;
		},

		//
		// ==================================================
		// TARGET IN THE DOM
		// ==================================================
		//

		//
		// find the target in the DOM
		// --------------------------
		//
		// @param  String/Object target the target
		// @return Object               the target in the DOM
		//
		$ = function(target) {

			var converted = null;

			switch (typeof(target)) {
				case tyStr:
					converted = doc.getElementById(target);
					break;
				case tyObj:
					var nodeName = target.nodeName;
					if ((nodeName && (!nodeName.match(/#/gi) || nodeName.match(/#document/gi))) || target.document) converted = target;
					break;
			}
			return converted;
		},

		//
		// ==================================================
		// WEBSCALE
		// ==================================================
		//

		// list of configurable options
		optionsList = ['reduce', 'enlarge', 'unlockWidth', 'unlockHeight', 'unlockTop', 'unlockLeft', 'bodyOffsetWidth', 'bodyOffsetHeight', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight', 'top', 'offsetTop', 'left', 'offsetLeft'],

		// backup number of items in the list to accelerate the execution of loops
		optionsLength = optionsList.length,

		//
		// instance initialization
		// -----------------------
		//
		// @param String/Object DOM     target area requiring a permanently visible (NOT JQuery selector)
		// @param Object        options list of configurable options : {
		//
		// 									body:             [Object/String] reference for the display dimensions (by default, the body of the page)
		//
		// 									bodyOffsetWidth:  [Number]        total fixed width margins of the referent
		// 									bodyOffsetHeight: [Number]        total fixed height margins of the referent
		//
		// 									minWidth:         [Number]        minimum width of the visible zone (0 to disable)
		// 									minHeight:        [Number]        minimum height of the visible zone (0 to disable)
		// 									maxWidth:         [Number]        maximum width of the visible zone (0 to disable)
		// 									maxHeight:        [Number]        maximum height of the visible zone (0 to disable)
		//
		// 									top:              [String/Number] vertical positioning of the visible area within its container (either in pixels or as a percentage or text: "top", "center", "bottom")
		// 									left:             [String/Number] horizontal positioning of the visible area within its container (either in pixels or as a percentage or text: "right", "center", "left")
		//
		// 									offsetTop:        [Number]        vertical offset of the visible area compared to the whole area
		// 									offsetLeft:       [Number]        horizontal offset of the visible area compared to the whole area
		//
		// 									unlockWidth:      [Boolean]       authorization resize the width to fit the refrence
		// 									unlockHeight:     [Boolean]       authorization resize the height to fit the refrence
		// 									unlockTop:        [Boolean]       authorization to correct the vertical position of the visible area
		// 									unlockLeft:       [Boolean]       authorization to correct the horizontal position of the visible area
		//
		// 									reduce:           [Boolean]       reduces visible if the reference area is too small
		// 									enlarge:          [Boolean]       increase the area visible if the reference is too high
		//
		// 									auto:             [Boolean]       if the reference listening for the event "resize", WebScale puts to automatically update the visible area (note only works on window or document or body)
		// 								}
		// @return Object               the new instance of WebScale
		//
		WEBSCALE = function(DOM, options) {

			options = options ? options : {};

			this.$content = $(DOM);
			this.$body = options.body ? $(options.body) : doc.body;

			for (var i = 0; i < optionsLength; i++) {
				this[optionsList[i]] = options[optionsList[i]] !== undefined ? options[optionsList[i]] : this[optionsList[i]];
			}

			if (options.auto) ON.call(this, this.$body, 'resize', this.responsive);

			this.available = this.responsive();

			return this;
		},

		// ==================================================
		//
		//                    PUBLIC API
		//
		// ==================================================

		//
		// generating an instance of the library WebScale and applies the resizing
		// -----------------------------------------------------------------------
		//
		// @param String/Object DOM     target area requiring a permanently visible (NOT JQuery selector)
		// @param Object        options list of configurable options : {
		//
		// 									body:             [Object/String] reference for the display dimensions (by default, the body of the page)
		//
		// 									bodyOffsetWidth:  [Number]        total fixed width margins of the referent
		// 									bodyOffsetHeight: [Number]        total fixed height margins of the referent
		//
		// 									minWidth:         [Number]        minimum width of the visible zone (0 to disable)
		// 									minHeight:        [Number]        minimum height of the visible zone (0 to disable)
		// 									maxWidth:         [Number]        maximum width of the visible zone (0 to disable)
		// 									maxHeight:        [Number]        maximum height of the visible zone (0 to disable)
		//
		// 									top:              [String/Number] vertical positioning of the visible area within its container (either in pixels or as a percentage or text: "top", "center", "bottom")
		// 									left:             [String/Number] horizontal positioning of the visible area within its container (either in pixels or as a percentage or text: "right", "center", "left")
		//
		// 									offsetTop:        [Number]        vertical offset of the visible area compared to the whole area
		// 									offsetLeft:       [Number]        horizontal offset of the visible area compared to the whole area
		//
		// 									unlockWidth:      [Boolean]       authorization resize the width to fit the refrence
		// 									unlockHeight:     [Boolean]       authorization resize the height to fit the refrence
		// 									unlockTop:        [Boolean]       authorization to correct the vertical position of the visible area
		// 									unlockLeft:       [Boolean]       authorization to correct the horizontal position of the visible area
		//
		// 									reduce:           [Boolean]       reduces visible if the reference area is too small
		// 									enlarge:          [Boolean]       increase the area visible if the reference is too high
		//
		// 									auto:             [Boolean]       if the reference listening for the event "resize", WebScale puts to automatically update the visible area (note only works on window or document or body)
		// 								}
		// @return Object               the new instance of WebScale
		//
		webscale = function(DOM, options) {
			return new WEBSCALE(DOM, options);
		};

	// public properties of an instance of WebScale
	WEBSCALE.prototype = {

		// if WebScale is available for the web browser used
		available: false,

		// the target DOM reference
		$body: null,

		// the width of the reference
		bodyWidth: 0,

		// the height of the reference
		bodyHeight: 0,

		// total fixed width margins of the referent
		bodyOffsetWidth: 0,

		// total fixed height margins of the referent
		bodyOffsetHeight: 0,

		// the target DOM must adapt its visible area
		$content: null,

		// minimum width of the visible zone (0 to disable)
		minWidth: 0,

		// minimum height of the visible zone (0 to disable)
		minHeight: 0,

		// maximum width of the visible zone (0 to disable)
		maxWidth: 0,

		// maximum height of the visible zone (0 to disable)
		maxHeight: 0,

		// vertical positioning of the visible area within its container (either in pixels or as a percentage or text: "top", "center", "bottom")
		top: 0,

		// horizontal positioning of the visible area within its container (either in pixels or as a percentage or text: "right", "center", "left")
		left: 0,

		// vertical offset of the visible area compared to the whole area
		offsetTop: 0,

		// horizontal offset of the visible area compared to the whole area
		offsetLeft: 0,

		// authorization resize the width to fit the refrence
		unlockWidth: false,

		// authorization resize the height to fit the refrence
		unlockHeight: false,

		// authorization to correct the vertical position of the visible area
		unlockTop: true,

		// authorization to correct the horizontal position of the visible area
		unlockLeft: true,

		// reduces visible if the reference area is too small
		reduce: true,

		// increase the area visible if the reference is too high
		enlarge: true,

		//
		// apply scaling taking into account all the options configured
		// ------------------------------------------------------------
		//
		// @return Boolean if the resizing has been done
		//
		responsive: function() {
			if (this.$content) {

				var bodyWidth = 0,
					bodyHeight = 0,
					available = false;

				if (this.$body) {
					bodyWidth = this.$body.offsetWidth || this.$body.clientWidth;
					bodyHeight = this.$body.offsetHeight || this.$body.offsetHeight;

					bodyWidth -= this.bodyOffsetWidth;
					bodyHeight -= this.bodyOffsetHeight;
				}

				if (bodyWidth !== this.bodyWidth || bodyHeight !== this.bodyHeight) {

					this.bodyWidth = bodyWidth;
					this.bodyHeight = bodyHeight;

					var minWidth = convert(this.minWidth, bodyWidth),
						minHeight = convert(this.minHeight, bodyHeight),
						maxWidth = convert(this.maxWidth, bodyWidth),
						maxHeight = convert(this.maxHeight, bodyHeight);

					minWidth = minWidth > 0 ? minWidth : (maxWidth > 0 ? maxWidth : bodyWidth);
					minHeight = minHeight > 0 ? minHeight : (maxHeight > 0 ? maxHeight : bodyHeight);
					maxWidth = maxWidth > 0 ? maxWidth : (minWidth > 0 ? minWidth : bodyWidth);
					maxHeight = maxHeight > 0 ? maxHeight : (minHeight > 0 ? minHeight : bodyHeight);

					var ratio_w = bodyWidth < minWidth ? (bodyWidth / minWidth) : (bodyWidth > maxWidth ? (bodyWidth / maxWidth) : 1),
						ratio_h = bodyHeight < minHeight ? (bodyHeight / minHeight) : (bodyHeight > maxHeight ? (bodyHeight / maxHeight) : 1),
						ratio = Math.min(ratio_w, ratio_h);

					ratio = (ratio < 1 && this.reduce) || (ratio > 1 && this.enlarge) ? ratio : 1;

					var width = Math.max(Math.min(bodyWidth, maxWidth), minWidth),
						height = Math.max(Math.min(bodyHeight, maxHeight), minHeight);

					if (transform) {
						this.$content.style[transform] = 'scale(' + ratio + ')';
						if (transformOrigin) this.$content.style[transformOrigin] = '0 0';
						available = true;
					}

					if (this.unlockWidth) this.$content.style.width = (bodyWidth < minWidth ? Math.ceil(bodyWidth / ratio) : Math.ceil(width / ratio)) + "px";

					if (this.unlockHeight) this.$content.style.height = (bodyHeight < minHeight ? Math.ceil(bodyHeight / ratio) : Math.ceil(height / ratio)) + "px";

					if (this.unlockTop) {

						var top = 0;

						if (/^(top|center|bottom)$/.test(this.top)) {

							top = this.top == 'top' ? 0 : (this.top == 'center' ? (bodyHeight - (height * ratio)) / 2 : bodyHeight - (height * ratio));

						} else {

							top = convert(this.top);
						}

						this.$content.style.top = (((top - (this.offsetTop * ratio)) << 0) + 1) + "px";

					}
					if (this.unlockLeft) {

						var left = 0;

						if (/^(left|center|right)$/.test(this.left)) {

							left = this.left == 'left' ? 0 : (this.left == 'center' ? (bodyWidth - (width * ratio)) / 2 : bodyWidth - (width * ratio));

						} else {

							left = convert(this.left);
						}

						this.$content.style.left = (((left - (this.offsetLeft * ratio)) << 0) + 1) + "px";
					}
				}
			}

			return available;
		}
	};

	// detects whether resizing is possible (if css3 properties exist on the web browser)
	detect();

	// attaches the WebScale library windows
	win.WebScale = webscale;
})(window);