class Game {
	constructor() {
		console.log('hello world');
	};

	save() {
		console.log('game saved', JSON.stringify(game.inv));
		localStorage.setItem('inv', JSON.stringify(game.inv));
	};

	load() {
		var loadInv = localStorage.getItem('inv');
		console.log(loadInv);
		if (loadInv) {
			console.log('game saved', JSON.stringify(this.inv));
			this.inv = JSON.parse(loadInv);
		} else {
			console.log('new game');
			this.inv = {};
		}
	};
}

class Ui {
	constructor() {
		console.log('Ui', this);

		var dirtinv = this.buildInv(0, 50, 'dirt');
		document.body.appendChild(dirtinv);
	};

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
	};

	buildButton(label, verb, callback) {
		return this.generate('button', label, verb, 'click', callback);
	}
	buildInv(minValue, maxValue, type) {
		var min = this.generate('span', minValue, type);
		var max = this.generate('span', maxValue, type);
		// var spacer = " / ";

		var output = this.generate('div', output, type);
		// output.innerHTML = (min + max);// + "/" + max
		output.appendChild(min);// + "/" + max
		output.appendChild(max);// + "/" + max

		return output;
	};
	updateInv() {};
	checkCost(cost, callback) {};
}

class Action extends Ui {
	constructor(label) {
		super();
		console.log('actions', this);

		var el = this.buildButton(label, label, () => {
			console.log(label + ' clicked');
		});

		document.body.appendChild(el);
	};
}