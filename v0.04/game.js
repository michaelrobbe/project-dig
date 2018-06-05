var Game = function() {
	this.version = 0;

	this.load_game();
}

Game.prototype.load_game = function() {
	var loadGame = localStorage.getItem('game');
	if (loadGame) {
		// Convert localStorage game into objects
	}
	else {
		this.new_game();
	}
}

Game.prototype.new_game = function() {
	this.player = new Player();
	this.resources = [];
	this.buildings = [];
	this.technology = [];
	this.story = [];

	this.resources.push(new Resource('wood', 'chop'));
	this.resources.push(new Resource('stone', 'mine'));
	this.resources.push(new Resource('fiber', 'gather'));
	this.resources.push(new Resource('dirt', 'dig'));

	var torchCost = {
		'wood': '5',
		'fiber':'2'
	};
	this.buildings.push(new Building('torch', torchCost));
}

Game.prototype.purchase = function(object, buy) {
	buy = buy || false;

	// for (var resource of game.resources) {
	// 	console.log(resource.quantity);
	// }
	// return;
	// for (var price of this.cost) {
		this.resources.forEach(function(resource, i) {
			if(object.type == resource.name && resource.quantity > object.price) {
				console.log('purchase Pending');
				if(buy) {
					this.resources[i].quantity -= price;
					console.log(type + price + " spent");
				};
			} else {
				console.log('Insufficent stuff');
				return false;
			};
		}, this);
	// };

	return true;
}
