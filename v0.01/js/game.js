class Game {

	constructor() {
		console.log('Game Class Contructed');
		// this.ui = new UI();
	};

	save() {
		console.log('game saved', JSON.stringify(game.inv));
		localStorage.setItem('inv', JSON.stringify(game.inv));
	};

	load() {
		var loadInv = localStorage.getItem('inv');
		if (loadInv) {
			game.inv = JSON.parse(loadInv);
			// console.log('game loaded', loadInv);
		} else {
			console.log('new game');
			game.inv.wood.count = 0;
			game.inv.wood.countMax = 50;
		}
	};
}

	class UI {
		constructor() {
			// super();
			console.log('UI constructor');

			this.initializeDOMIds();
			// this.invDirt = document.querySelector("#dirt");
			// this.invWood = document.querySelector("#wood");
			// this.invStone = document.querySelector("#stone");
			// this.invFlint = document.querySelector("#flint");
			// this.updateUI();
		}

		initializeDOMIds() {
			console.log('initializeIds');

			var domelements = ['div', 'button'];

			var divs = document.querySelectorAll('div');
			for (var div of divs) {
				this[(div.id + 'UI')] = div.id;
				// console.log(div.id);
			}
			var buttons = document.querySelectorAll('button');
			for (var button of buttons) {
				this[(button.id + 'button')] = button.id;
			}
			// console.log(this);
		}

		updateUI() {
			// this.invDirt.innerHTML = this.inv.dirt + " dirt";
			// this.invWood.innerHTML = this.inv.wood + " wood";
			// this.invStone.innerHTML = this.inv.stone + " stone";
			// this.invFlint.innerHTML = this.inv.flint + " flint";
		}

		generate(tag, label, verb, event, callback) {
			var el = document.createElement(tag);
			el.value = verb;
			el.id = verb + tag;
			el.innerHTML = label;
			if (event !== undefined) {
				el.addEventListener(event, () => {
					callback()
				});
			};

			return el;
		}

		generateButton(label, verb, callback) {
			return this.generate('button', label, verb, 'click', callback);
		}

		generateInv(verb, value) {
			var el = this.generate('p', value, verb);
		}

		updateElement(id) {
			var el = document.getElementById(id);
			console.log(id, 'el');
			console.log(this.value, 'updateElement.value');
			el.innerHTML = this.value;
		}
	}

	class Resource {
		constructor(label, dict, options) {
			// super();
			this.UI = new UI;

			console.log(this, 'resourceX');
			// this.id = ;
			this.label = label;

			this.verb = (dict.verb) ? dict.verb : '';
			this.noun = (dict.noun) ? dict.noun : '';
			// this.noun = dict.noun;
			// this.value = options.value;
			// this.step = options.step;
			// this.max = options.max;


			this.UI.generateButton(this.label, this.verb, () => {
				this.gather();
			});

			this.UI.generateInv(this.label, this.value);
			console.log('Resource constructor', this);
		};

		gather() {
			this.value += this.step;
			console.log(this.label, '+1');
			// console.log(game);
			this.updateElement(this.label + 'p');
		};
	}

	class Structure extends UI {
		constructor(label, basecost) {
			super();

			this.label = label;
			this.basecost = basecost;
			this.generateButton(this.label, this.verb, () => {
				this.purchase();
			})
		};

		purchase() {
			console.log('Purchased ' + this.label, this.basecost);
		}
	}

	// class Player {
	// 	constructor() {
	// 		game.inv = {},
	// 		game.upgrades = {},
	// 		game.structures = {},
	// 		game.friendlies = {},

	// 		console.log('Player constructed');
	// 	}
	// };

	// class Resource {
	// 	constructor(label, verb) {
	// 		this.label = label;
	// 		this.verb = verb;
	// 		this.value = 0;
	// 		this.max = 50;
	// 		this.step = 1;

	// 		this.generateButton();
	// 		this.generateUI();
	// 		console.log(this.label);
	// 	};

	// 	gather() {
	// 		console.log(this);
	// 		if (this.value < this.max) {
	// 			this.value += this.step;
	// 			this.updateUI();
	// 		} else {
	// 			console.log('error:', this.label + " is full!")
	// 		}
	// 	};

	// 	generateUI() {
	// 		var p = document.createElement('p');
	// 		p.id = this.label + 'Inv';
	// 		var resourceInv = document.createTextNode(this.value + '/' + this.max);
	// 		document.body.appendChild(p);
	// 		p.appendChild(resourceInv);
	// 	}

	// 	updateUI() {
	// 		var d = document.getElementById(this.label + 'Inv');
	// 		d.innerHTML = this.value + '/' + this.max;
	// 	};

	// 	generateButton() {
	// 		var button = document.createElement('button');
	// 		button.value = this.verb;
	// 		button.innerHTML = this.verb + ' [' + this.step + ']';
	// 		button.id = this.label + "Button";
	// 		button.addEventListener('click', () => {
	// 			this.gather();
	// 		});

	// 		document.body.appendChild(button);
	// 	};
	// }

	// game.player = new Player;

	// game.ticker = function() {
	// 	setInterval(tickerCallback, 1000);

	// 	function tickerCallback() {
	// 		console.log('X potato');
	// 	}
	// };

	// class Structure {
	// 	constructor(label, baseCost, mod) {
	// 		this.label = label,
	// 		this.cost = baseCost,
	// 		this.modifier = mod,
	// 		this.value = 0;

	// 		// this.generateButton() {
	// 		// }
	// 	};

	// 	// Create Game functions for UI Generation/Update that these classes can inherit/extend
	// 	generateUI() {
	// 		var p = document.createElement('p');
	// 		p.id = this.label + 'Inv';
	// 		var structureCount = document.createTextNode(this.value);
	// 		document.body.appendChild(p);
	// 		p.appendChild(structureCount);
	// 	}

	// 	updateUI() {
	// 		var d = document.getElementById(this.label + 'Inv');
	// 		d.innerHTML = this.value + '/' + this.max;
	// 	};

	// 	generateButton() {
	// 		var button = document.createElement('button');
	// 		button.value = this.label;
	// 		button.innerHTML = 'buy' + this.label + ' [' + this.cost + ']';
	// 		button.id = this.label + "Button";
	// 		button.addEventListener('click', () => {
	// 			this.purchase();
	// 		});

	// 		document.body.appendChild(button);
	// 	};

	// 	purchase() {
	// 		for (var i = this.cost.length - 1; i >= 0; i--) {
	// 			console.log(this.cost[i]);
	// 		}
	// 	}
	// }

	// class Structure {
	// 	constructor(label, dictionary, cost) {
	// 		// console.log(super);
	// 		this.game = Game;

	// 		this.label = label;
	// 		this.dictionary = dictionary;
	// 		this.cost = cost;

	// 		this.button = document.getElementById(this.label);
	// 		this.button.innerHTML = this.dictionary.verb + " " + this.dictionary.noun;
	// 		this.button.addEventListener('click', () => {
	// 			this.purchase();
	// 		});

	// 		console.log('New Structure', this);
	// 	};

	// 	purchase() {
	// 		this.canAfford(this.cost);
	// 		console.log('deducted from:', this.cost);
	// 	};

	// 	canAfford(cost) {
	// 		// console.log('this', this.game);
	// 		// console.log('canAfford', this.inv);
	// 		// console.log('canAfford', cost.keys.length);

	// 		for (var resource in cost) {
	// 			console.log('canAfford', resource);
	// 		}
	// 	}
	// }