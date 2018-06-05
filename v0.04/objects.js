var UI = function(name, verb, event, callback) {
	// this.tag = tag;
	this.name = name;
	this.verb = verb;
	this.event = event || 'click';
	this.callback = callback;
}

UI.prototype.generateElement = function(tag, query, flag, output) {
	output = output || this.name
	var el = document.createElement(tag);
	el.value = this.verb;
	el.id = this.id + '-' + flag || this.id;
	el.innerHTML = output;
	if (this.event !== undefined) {
		el.addEventListener(this.event, this.callback);
	};

	var template = document.body.querySelector(query);
	template.append(el);
}

// UI.prototype.generateButton = function(query) {
// 	var element = this.generateElement('button');

// }

// UI.prototype.updateInv = function() {
// 	var element = document.body.querySelector('#' + this.id);
// 	console.log(element);
// }

function extend(ChildClass, ParentClass) {
	var parent = new ParentClass();
	ChildClass.prototype = parent;
	ChildClass.prototype.super = parent.constructor;
	ChildClass.prototype.constructor = ChildClass;
}

var Player = function() {
	this.hit_points_max = 100;
	this.hit_points = this.hit_points_max;
}

var Resource = function(name, verb) {
	this.name = name;
	this.verb = verb;
	this.id = verb + '-' + name;
	this.event = 'click';
	this.multiplier = 1;
	this.quantity = 0;
	this.quantity_max = 100;
	this.callback = function() { };
	this.super(name, verb, this.event, () => { this.harvest() });

	this.generateElement('button', '#build');
	this.inv();
}
extend(Resource, UI);

Resource.prototype.inv = function() {
	resource_count = (this.name + ': ' + this.quantity + '/' + this.quantity_max);
	var invElement = document.body.querySelector('#' + this.id + '-inv');

	if (invElement) {
		invElement.innerHTML = resource_count;
	}
	else {
		var element = this.generateElement('p', '#inv', 'inv', resource_count);
	}
}

Resource.prototype.harvest = function() {
	if (this.quantity < this.quantity_max) {
		this.quantity += this.multiplier;
	}
	this.inv();
}

var Building = function(name, cost) {
	this.name = name;
	this.cost = cost;
	this.super(name, 'build', this.event, () => { console.log('click') });

	this.generateElement('button', '#build');
}
extend(Building, UI);
