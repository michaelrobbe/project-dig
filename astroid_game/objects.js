function Mass(x, y, mass, radius, angle, x_speed, y_speed, rotation_speed) {
  this.x = x;
  this.y = y;
  this.mass = mass || 1;
  this.radius = radius || 50;
  this.angle = angle || 0;
  this.x_speed = x_speed || 0;
  this.y_speed = y_speed || 0;
  this.rotation_speed = rotation_speed || 0;
}

Mass.prototype.update = function(elapsed, ctx) {
  this.x += this.x_speed * elapsed;
  this.y += this.y_speed * elapsed;
  this.angle += this.rotation_speed * elapsed;
  this.angle %= (2 * Math.PI);
  if(this.x - this.radius > ctx.canvas.width) {
    this.x = -this.radius;
  }
  if(this.x + this.radius < 0) {
    this.x = ctx.canvas.width + this.radius;
  }
  if(this.y - this.radius > ctx.canvas.height) {
    this.y = -this.radius;
  }
  if(this.y + this.radius < 0) {
    this.y = ctx.canvas.height + this.radius;
  }
}

Mass.prototype.push = function(angle, force, elapsed) {
  this.x_speed += elapsed * (Math.cos(angle) * force) / this.mass;
  this.y_speed += elapsed * (Math.sin(angle) * force) / this.mass;
}

Mass.prototype.twist = function(force, elapsed) {
  this.rotation_speed += elapsed * force / this.mass;
}

Mass.prototype.speed = function() {
  return Math.sqrt(Math.pow(this.x_speed, 2) + Math.pow(this.y_speed, 2));
}
Mass.prototype.movement_angle = function() {
  return Math.atan2(this.y_speed, this.x_speed);
}

Mass.prototype.draw = function(c) {
  c.save();
  c.translate(this.x, this.y);
  c.rotate(this.angle);
  c.beginPath();
  c.arc(0, 0, this.radius, 0, 2 * Math.PI);
  c.lineTo(0, 0);
  c.strokeStyle = "#FFFFFF";
  c.stroke();
  c.restore();
}

function extend(ChildClass, ParentClass) {
  var parent = new ParentClass();
  ChildClass.prototype = parent;
  ChildClass.prototype.super = parent.constructor;
  ChildClass.prototype.constructor = ChildClass;
}

function Asteroid(x, y, mass, x_speed, y_speed, rotation_speed) {
  var density = 1; // kg per square pixel
  var radius = Math.sqrt((mass / density) / Math.PI);
  this.super(x, y, mass, radius, 0, x_speed, y_speed, rotation_speed);
  this.circumference = 2 * Math.PI * this.radius;
  this.segments = Math.ceil(this.circumference / 15);
  this.segments = Math.min(25, Math.max(5, this.segments));
  this.noise = 0.2;
  this.shape = [];
  for(var i = 0; i < this.segments; i++) {
    this.shape.push(2 * (Math.random() - 0.5));
  }
}
extend(Asteroid, Mass);

Asteroid.prototype.draw = function(ctx, guide) {
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.rotate(this.angle);
  draw_asteroid(ctx, this.radius, this.shape, {
    noise: this.noise,
    guide: guide
  });
  ctx.restore();
}

Asteroid.prototype.child = function(mass) {
  return new Asteroid(
    this.x, this.y, mass,
    this.x_speed, this.y_speed,
    this.rotation_speed
  )
}

function Ship(x, y, power, mass, radius, weapon_power) {
  //x, y, mass, radius, angle, x_speed, y_speed, rotation_speed
  this.super(x, y, mass, radius, 1.5 * Math.PI);
  this.thruster_power = power;
  this.steering_power = power / 20;
  this.right_thruster = false;
  this.left_thruster = false;
  this.thruster_on = false;
  this.retro_on = false;
  this.weapon_power = weapon_power || 200;
  this.loaded = false;
  this.weapon_reload_time = 0.25; //seconds
  this.time_until_reloaded = this.weapon_reload_time;
  this.compromised = false;
  this.max_health = 2.0;
  this.health = this.max_health;
}
extend(Ship, Mass);

Ship.prototype.draw = function(c, guide) {
  c.save();
  c.translate(this.x, this.y);
  c.rotate(this.angle);
  if(guide && this.compromised) {
    c.save();
    c.fillStyle = "red";
    c.beginPath();
    c.arc(0, 0, this.radius, 0, 2 * Math.PI);
    c.fill();
    c.restore();
  }
  draw_ship(c, this.radius, {
    guide: guide,
    thruster: this.thruster_on
  });
  c.restore();
}

Ship.prototype.update = function(elapsed, c) {
  this.push(this.angle,
    ( this.thruster_on - this.retro_on) * this.thruster_power, elapsed
  );
  this.twist(
    ( this.right_thruster - this.left_thruster) * this.steering_power, elapsed
  );
  // reload as necessary
  this.loaded = this.time_until_reloaded === 0;
  if(!this.loaded) {
    this.time_until_reloaded -= Math.min(elapsed, this.time_until_reloaded);
  }
  if(this.compromised) {
    this.health -= Math.min(elapsed, this.health);
  }
  Mass.prototype.update.apply(this, arguments);
}

Ship.prototype.projectile = function(elapsed) {
  var p = new Projectile(0.025, 1,
    this.x + Math.cos(this.angle) * this.radius,
    this.y + Math.sin(this.angle) * this.radius,
    this.x_speed,
    this.y_speed,
    this.rotation_speed
  );
  p.push(this.angle, this.weapon_power, elapsed);
  this.push(this.angle + Math.PI, this.weapon_power, elapsed);
  this.time_until_reloaded = this.weapon_reload_time;
  return p;
}

function Projectile(mass, lifetime, x, y, x_speed, y_speed, rotation_speed) {
  var density = 0.001; // low density means we can see very light projectiles
  var radius = Math.sqrt((mass / density) / Math.PI);
  //x, y, mass, radius, angle, x_speed, y_speed, rotation_speed
  this.super(x, y, mass, radius, 0, x_speed, y_speed, rotation_speed);
  this.lifetime = lifetime;
  this.life = 1.0;
}
extend(Projectile, Mass);

Projectile.prototype.update = function(elapsed, c) {
  this.life -= (elapsed / this.lifetime);
  Mass.prototype.update.apply(this, arguments);
}

Projectile.prototype.draw = function(c, guide) {
  c.save();
  c.translate(this.x, this.y);
  c.rotate(this.angle);
  draw_projectile(c, this.radius, this.life, guide);
  c.restore();
}

function Indicator(label, x, y, width, height) {
  this.label = label + ": ";
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
}

Indicator.prototype.draw = function(c, max, level) {
  c.save();
  c.strokeStyle = "white";
  c.fillStyle = "white";
  c.font = this.height + "pt Arial";
  var offset = c.measureText(this.label).width;
  c.fillText(this.label, this.x, this.y + this.height - 1);
  c.beginPath();
  c.rect(offset + this.x, this.y, this.width, this.height);
  c.stroke();
  c.beginPath();
  c.rect(offset + this.x, this.y, this.width * (max / level), this.height);
  c.fill();
  c.restore()
}

function NumberIndicator(label, x, y, options) {
  options = options || {}
  this.label = label + ": ";
  this.x = x;
  this.y = y;
  this.digits = options.digits || 0;
  this.pt = options.pt || 10;
  this.align = options.align || 'end';
}

NumberIndicator.prototype.draw = function(c, value) {
  c.save();
  c.fillStyle = "white";
  c.font = this.pt + "pt Arial";
  c.textAlign = this.align;
  c.fillText(
    this.label + value.toFixed(this. digits),
    this.x, this.y + this.pt - 1
  );
  c.restore();
}

function Message(x, y, options) {
  options = options || {};
  this.x = x;
  this.y = y;
  this.main_pt = options.main_pt || 28;
  this.sub_pt = options.sub_pt || 18;
  this.fill = options.fill || "white";
  this.textAlign = options.align || 'center';
}
Message.prototype.draw = function(c, main, sub) {
  c.save();
  c.fillStyle = this.fill;
  c.textAlign = this.textAlign;
  c.font = this.main_pt + "pt Arial";
  c.fillText(main, this.x, this.y);
  c.font = this.sub_pt + "pt Arial";
  c.fillText(sub, this.x, this.y + this.main_pt);
  c.restore();
}

/** Pac-mans **/

function PacMan(x, y, radius, speed) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.speed = speed;
  this.angle = 0;
  this.x_speed = speed;
  this.y_speed = 0;
  this.time = 0;
  this.mouth = 0;
}

PacMan.prototype.draw = function(ctx) {
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.rotate(this.angle);
  draw_pacman(ctx, this.radius, this.mouth);
  ctx.restore();
}

PacMan.prototype.turn = function(direction) {
  if(this.y_speed) {
    // if we are travelling vertically
    // set the horizontal speed and apply the direction
    this.x_speed = -direction * this.y_speed;
    // clear the vertical speed and rotate
    this.y_speed = 0;
    this.angle = this.x_speed > 0 ? 0 : Math.PI;
  } else {
    // if we are travelling horizontally
    // set the vertical speed and apply the direction
    this.y_speed = direction * this.x_speed;
    // clear the horizontal speed and rotate
    this.x_speed = 0;
    this.angle = this.y_speed > 0 ? 0.5 * Math.PI : 1.5 * Math.PI;
  }
}

PacMan.prototype.turn_left = function() {
  this.turn(-1);
}
PacMan.prototype.turn_right = function() {
  this.turn(1);
}

PacMan.prototype.move_right = function() {
  this.x_speed = this.speed;
  this.y_speed = 0;
  this.angle = 0;
}
PacMan.prototype.move_down = function() {
  this.x_speed = 0;
  this.y_speed = this.speed;
  this.angle = 0.5 * Math.PI;
}
PacMan.prototype.move_left = function() {
  this.x_speed = -this.speed;
  this.y_speed = 0;
  this.angle = Math.PI;
}
PacMan.prototype.move_up = function() {
  this.x_speed = 0;
  this.y_speed = -this.speed;
  this.angle = 1.5 * Math.PI;
}

PacMan.prototype.update = function(elapsed, width, height) {
  // an average of once per 100 frames
  // if(Math.random() <= 0.01) {
  //   if(Math.random() < 0.5) {
  //     this.turn_left();
  //   } else {
  //     this.turn_right();
  //   }
  // }
  if(this.x - this.radius + elapsed * this.x_speed > width) {
    this.x = -this.radius;
  }
  if(this.x + this.radius + elapsed * this.x_speed < 0) {
    this.x = width + this.radius;
  }
  if(this.y - this.radius + elapsed * this.y_speed > height) {
    this.y = -this.radius;
  }
  if(this.y + this.radius + elapsed * this.y_speed < 0) {
    this.y = height + this.radius;
  }
  this.x += this.x_speed * elapsed;
  this.y += this.y_speed * elapsed;
  this.time += elapsed;
  this.mouth = Math.abs(Math.sin(2 * Math.PI * this.time));
}

function Ghost(x, y, radius, speed, colour) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.speed = speed;
  this.colour = colour;
}

Ghost.prototype.draw = function(ctx) {
  ctx.save();
  ctx.translate(this.x, this.y);
  draw_ghost(ctx, this.radius, {
    fill: this.colour
  });
  ctx.restore();
}

Ghost.prototype.update = function(target, elapsed) {
  var angle = Math.atan2(target.y - this.y, target.x - this.x);
  var x_speed = Math.cos(angle) * this.speed;
  var y_speed = Math.sin(angle) * this.speed;
  this.x += x_speed * elapsed;
  this.y += y_speed * elapsed;
}