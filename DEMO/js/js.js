;
// use strict mode to improve performance of javascript
"use strict";
(function(win, undefined) {
	/**
	 * ==================================================
	 *
	 * PRIVATE API
	 *
	 * ==================================================
	 */

	var doc = win.document,
		tyFunc = typeof

		function() {},
		tyStr = typeof "a",
		tyObj = typeof {},
		JS = {

			/**
			 * ==================================================
			 * INITIALIZE
			 * ==================================================
			 */

			/**
			 * sauvegarde la capture de l 'overlay
			 * @type {[type]}
			 */
			$overlay: null,
			WebScale: null,
			init: function() {
				this.$overlay = doc.getElementById('overlay');
				this.$sizing = doc.getElementById('sizing');

				if (win.WebScale) {
					this.WebScale = win.WebScale('demo', {
						body: 'sizing',
						minWidth: 450,
						minHeight: 450,
						offsetTop: 450,
						offsetLeft: 450,
						top: 'center',
						left: 'center'
					});
					if (this.WebScale.available) doc.getElementById('unable').style.display = "none";
				}
			},

			/**
			 * ==================================================
			 * LOCK TARGET
			 * ==================================================
			 */


			/**
			 * verrouille la cible pour le traitement
			 * @type élément DOM
			 */
			$target: null,

			/**
			 * récupère l'accès à la cible et la verrouille sur $target pour les traitements
			 *
			 * @param  {String/Object} l’objet à récupérer sur le DOM
			 * @return l’objet JS
			 */
			$: function(target) {

				switch (typeof(target)) {
					case tyStr:
						this.$target = doc.getElementById(target);
						break;
					case tyObj:
						var nodeName = target.nodeName;
						if ((nodeName && (!nodeName.match(/#/gi) || nodeName.match(/#document/gi))) || target.document) this.$target = target;
						break;
				}
				return this;
			},

			/**
			 * ==================================================
			 * LISTENER
			 * ==================================================
			 */

			/**
			 * écoute les événements du DOM
			 * @param {String}   nom de l’événement DOM
			 * @param {Function} fonction à lancé dès l’événement détecté
			 */
			ON: function(eventName, callback) {
				if (this.$target && typeof callback === tyFunc) {
					(function(self, evtName, called) {
						var run = function(evt) {
							called.call(self, evt);
						};
						if (self.$target.addEventListener) self.$target.addEventListener(evtName, run, false);
						else if (self.$target.attachEvent) self.$target.attachEvent('on' + evtName, run);
						else {
							var lowerName = evtName.toLowerCase(),
								capitalizeName = evtName.charAt(0)
									.toUpperCase() + evtName.slice(1)
									.toLowerCase();
							switch (lowerName) {
								case "keydown":
									self.$target.setAttribute('onKeydown', "return " + called.toString());
									if (doc.all) self.$target.onkeydown = run;
									else self.$target.onKeydown = run;
									break;
								case "keypress":
									self.$target.setAttribute('onKeypress', "return " + called.toString());
									if (doc.all) self.$target.onkeypress = run;
									else self.$target.onKeypress = run;
									break;
								case "keyup":
									self.$target.setAttribute('onKeyup', "return " + called.toString());
									if (doc.all) self.$target.onkeyup = run;
									else self.$target.onKeyup = run;
									break;
								case "unload":
									self.$target.setAttribute('unload', "return " + called.toString());
									self.$target.unload = run;
									break;
								default:
									if (self.$target['on' + lowerName] !== undefined) self.$target['on' + lowerName] = run;
									else if (self.$target['on' + evtName] !== undefined) self.$target['on' + evtName] = run;
									else if (self.$target['on' + capitalizeName] !== undefined) self.$target['on' + capitalizeName] = run;
									break;
							}
						}
					})(this, eventName, callback);
				}
				return this;
			},

			/**
			 * ==================================================
			 * WINDOW RESIZE
			 * ==================================================
			 */

			/**
			 * dimension du document : width, height
			 * @type {Array}
			 */
			size: [0, 0],

			/**
			 * redimensionne les éléments de la page qui doivent d’adaptés à la résolution de la fenêtre
			 * @return {l’objet JS}
			 */
			resize: function() {

				var detect = [doc.body.offsetWidth, doc.body.offsetHeight];
				if (detect[0] !== this.size[0] || detect[1] !== this.size[1]) {
					this.size = detect;

					var wrapperSize = Math.max(detect[0] - 192, 1000),
						infoSize = Math.round((wrapperSize / 2) - 96);

					doc.getElementById('wrapper').style.width = wrapperSize + "px";
					doc.getElementById('informations').style.width = Math.max(infoSize, 0) + "px";
					doc.getElementById('description').style.width = Math.max(infoSize - 255, 0) + "px";


				}
				return this;
			},

			/**
			 * ==================================================
			 * MOUSE RESIZING
			 * ==================================================
			 */

			/**
			 * écoute les mouvements de la souris ou pas
			 * @type {Boolean}
			 */
			listen: false,

			/**
			 * position de départ de la souris avant le déplacement
			 * @type {Array}
			 */
			offsets: [0, 0],

			dimentions: [550, 550, 550, 550],

			$sizing: null,

			sizing: function(evt) {
				var type = evt ? evt.type.toLowerCase() : null;

				if (type) {
					if (/mousedown/.test(type)) {
						this.listen = true;
						this.offsets = [evt.x, evt.y];
						this.$overlay.style.display = "block";
					} else if (/mousemove/.test(type) && this.listen) {

						this.dimentions[2] = Math.max(Math.min(this.dimentions[0] + (evt.x - this.offsets[0]), 550), 100);
						this.dimentions[3] = Math.max(Math.min(this.dimentions[1] + (evt.y - this.offsets[1]), 550), 100);

						this.$sizing.style.width = this.dimentions[2] + "px";
						this.$sizing.style.height = this.dimentions[3] + "px";

						this.WebScale.responsive();

					} else {
						this.listen = false;
						this.$overlay.style.display = "none";
						this.dimentions[0] = this.dimentions[2];
						this.dimentions[1] = this.dimentions[3];
					}
				}
				return this;
			}
		},

		/**
		 * ==================================================
		 *
		 * PUBLIC API
		 *
		 * ==================================================
		 */

		js = {
			/**
			 * met en forme la page une fois chargée
			 * @return l’objet js
			 */
			init: function() {

				JS.$(win)
					.ON('resize', JS.resize)
					.ON('mousemove', JS.sizing)
					.ON('mouseup', JS.sizing)
					.$(doc)
					.ON('resize', JS.resize)
					.$(doc.body)
					.ON('resize', JS.resize)
					.resize()
					.$('sizeTool')
					.ON('mousedown', JS.sizing)
					.init();

				return this;
			}
		};

	win.JS = js.init();

})(window);