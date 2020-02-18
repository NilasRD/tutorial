// We create our only state, called 'mainState'
var playState = {
          
create: function() {
    // This function is called after the preload function
    // Here we set up the game, display sprites, etc.
    this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
    this.player.anchor.setTo(0.5, 0.5);
    // Create the 'right' animation by looping the frames 1 and 2
this.player.animations.add('right', [1, 2], 8, true);
// Create the 'left' animation by looping the frames 3 and 4
this.player.animations.add('left', [3, 4], 8, true);
    
    // Tell Phaser that the player will use the Arcade physics engine
    game.physics.arcade.enable(this.player);
    // Add vertical gravity to the player
    this.player.body.gravity.y = 500;
    
    // Create the emitter with 15 particles. We don't need to set the x and y
// Since we don't know where to do the explosion yet
this.emitter = game.add.emitter(0, 0, 15);
// Set the 'pixel' image for the particles
this.emitter.makeParticles('pixel');
// Set the y speed of the particles between -150 and 150
// The speed will be randomly picked between -150 and 150 for each particle
this.emitter.setYSpeed(-150, 150);
// Do the same for the x speed
this.emitter.setXSpeed(-150, 150);
// Use no gravity for the particles
this.emitter.gravity = 0;
    
    //UI
    game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);
    
    //controls
    this.cursor = game.input.keyboard.createCursorKeys();
    this.wasd = {
up: game.input.keyboard.addKey(Phaser.Keyboard.W),
left: game.input.keyboard.addKey(Phaser.Keyboard.A),
right: game.input.keyboard.addKey(Phaser.Keyboard.D)
};
    
    //world
    this.createWorld();
    
    //enemies
    // Create an enemy group with Arcade physics
    this.enemies = game.add.group();
    this.enemies.enableBody = true;
    // Create 10 enemies with the 'enemy' image in the group
    // The enemies are "dead" by default, so they are not visible in the game
    this.enemies.createMultiple(10, 'enemy');
    
    // Contains the time of the next enemy creation
    this.nextEnemy = 0;
    
    // Display the coin
        this.coin = game.add.sprite(60, 140, 'coin');
    // Add Arcade physics to the coin
        game.physics.arcade.enable(this.coin);
    // Set the anchor point of the coin to its center
        this.coin.anchor.setTo(0.5, 0.5);
    
    // Display the score
        this.scoreLabel = game.add.text(30, 30, 'score: 0', { font: '18px Arial', fill: '#ffffff' });
    // Initialise the score variable
        game.global.score = 0;
    
    //SOUND
    this.jumpSound = game.add.audio('jump');
    this.coinSound = game.add.audio('coin');
    this.deadSound = game.add.audio('dead');
    
    
},
update: function() {
    // This function is called 60 times per second
    // It contains the game's logic
    // Make the enemies and walls collide
    game.physics.arcade.collide(this.enemies, this.walls);
    game.physics.arcade.collide(this.player, this.walls);
    game.physics.arcade.overlap(this.player, this.enemies, this.playerDie,null, this);
    game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);
    this.movePlayer();
   
    
            // If the 'nextEnemy' time has passed
if (this.nextEnemy < game.time.now) {
// We add a new enemy
this.addEnemy();
// And we update 'nextEnemy' to have a new enemy in 2.2 seconds
this.nextEnemy = game.time.now + 2200;
}
        
if (this.nextEnemy < game.time.now) {
// Define our variables
var start = 4000, end = 1000, score = 100;
// Formula to decrease the delay between enemies over time
// At first it's 4000ms, then slowly goes to 1000ms
var delay = Math.max(start - (start-end)*game.global.score/score, end);
// Create a new enemy, and update the 'nextEnemy' time
this.addEnemy();
this.nextEnemy = game.time.now + delay;
}
    if (!this.player.inWorld) {
        this.playerDie();
 }
        
},
    
// And here we will later add some of our own functions
movePlayer: function() {
 // If the left arrow or the A key is pressed
if (this.cursor.left.isDown || this.wasd.left.isDown) {
this.player.body.velocity.x = -200;
this.player.animations.play('left');
}
// If the right arrow or the D key is pressed
else if (this.cursor.right.isDown || this.wasd.right.isDown) {
this.player.body.velocity.x = 200;
this.player.animations.play('right');
}
// If nothing is pressed
else {
this.player.body.velocity.x = 0;
this.player.animations.stop();
this.player.frame = 0;
}
// If the up arrow or the W key is pressed
if ((this.cursor.up.isDown || this.wasd.up.isDown)
&& this.player.body.touching.down) {
this.jumpSound.play();
this.player.body.velocity.y = -320;
}
    
},

createWorld: function() {
    // Create our wall group with Arcade physics
    this.walls = game.add.group();
    this.walls.enableBody = true;
    // Create the 10 walls
    game.add.sprite(0, 0, 'wallV', 0, this.walls); // Left
    game.add.sprite(480, 0, 'wallV', 0, this.walls); // Right
    game.add.sprite(0, 0, 'wallH', 0, this.walls); // Top left
    game.add.sprite(300, 0, 'wallH', 0, this.walls); // Top right
    game.add.sprite(0, 320, 'wallH', 0, this.walls); // Bottom left
    game.add.sprite(300, 320, 'wallH', 0, this.walls); // Bottom right
    game.add.sprite(-100, 160, 'wallH', 0, this.walls); // Middle left
    game.add.sprite(400, 160, 'wallH', 0, this.walls); // Middle right
    var middleTop = game.add.sprite(100, 80, 'wallH', 0, this.walls);
    middleTop.scale.setTo(1.5, 1);
    var middleBottom = game.add.sprite(100, 240, 'wallH', 0, this.walls);
    middleBottom.scale.setTo(1.5, 1);
    // Set all the walls to be immovable
    this.walls.setAll('body.immovable', true);
},
    
playerDie: function() {
    if (!this.player.alive) {
return;
}
    this.deadSound.play();
    // Kill the player to make it disappear from the screen
this.player.kill();
    // Set the position of the emitter on the player
this.emitter.x = this.player.x;
this.emitter.y = this.player.y;
// Start the emitter, by exploding 15 particles that will live for 600ms
this.emitter.start(true, 600, null, 15);
    // Call the 'startMenu' function in 1000ms
game.time.events.add(1000, this.startMenu, this);
},

takeCoin: function(player, coin) {
    this.coinSound.play();
// Increase the score by 5
game.global.score += 5;
// Update the score label
this.scoreLabel.text = 'score: ' + game.global.score;
this.updateCoinPosition();
    // Scale the coin to 0 to make it invisible
this.coin.scale.setTo(0, 0);
// Grow the coin back to its original scale in 300ms
game.add.tween(this.coin.scale).to({x: 1, y: 1}, 300).start();
    game.add.tween(this.player.scale).to({x: 1.3, y: 1.3}, 50).to({x: 1, y: 1}, 150).start();
},

updateCoinPosition: function() {
// Store all the possible coin positions in an array
var coinPosition = [
{x: 140, y: 60}, {x: 360, y: 60}, // Top row
{x: 60, y: 140}, {x: 440, y: 140}, // Middle row
{x: 130, y: 300}, {x: 370, y: 300} // Bottom row
];
// Remove the current coin position from the array
// Otherwise the coin could appear at the same spot twice in a row
for (var i = 0; i < coinPosition.length; i++) {
if (coinPosition[i].x === this.coin.x) {
coinPosition.splice(i, 1);
}
}
// Randomly select a position from the array
var newPosition = coinPosition[
game.rnd.integerInRange(0, coinPosition.length-1)];
// Set the new position of the coin
this.coin.reset(newPosition.x, newPosition.y);
},
 
addEnemy: function() {
// Get the first dead enemy of the group
var enemy = this.enemies.getFirstDead();
// If there isn't any dead enemy, do nothing
if (!enemy) {
return;
}
// Initialise the enemy
enemy.anchor.setTo(0.5, 1);
enemy.reset(game.world.centerX, 0);
enemy.body.gravity.y = 500;
enemy.body.velocity.x = 100 * Phaser.Math.sign(Phaser.Math.random(-1,1));
enemy.body.bounce.x = 1;
enemy.checkWorldBounds = true;
enemy.outOfBoundsKill = true;
},
startMenu: function() {
game.state.start('menu');
}, 
};