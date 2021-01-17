const CONTROLS = {
    moveLeft: 37,   // left arrow
    moveRight: 39,  // right arrow
    moveUp: 38,     // up arrow
    moveDown: 40,   // down arrow
    dash: 68        // d
}

const BLOB_HEIGHT = 98;
const BLOB_WIDTH = 80
const BLOB_DEFAULT_SCALE = 0.7

var gameOver = Matter.Bodies.rectangle(450, 250, 500, 300, {isStatic:true, label:'gameOver', render:{fillStyle:'red'}});	
gameOver.render.sprite.texture = "img/gameover.png";	


var winGame = Matter.Bodies.rectangle(450, 250, 500, 300, {isStatic:true, label:'winGame', render:{fillStyle:'red'}});	
winGame.render.sprite.texture = "img/youwon.png";

function getCompScale(duration, frame, scaleTo) {
    // duration is how many frames the animation has
    // frame is the current frame of the animation
    // minScale is in the range [0,1] (lower means more intense)
    var h = duration/2;
    return ((BLOB_DEFAULT_SCALE-scaleTo)/(h*h)) * (frame-h)*(frame-h) + scaleTo;
}

function getYTCompOffset(scale) {
    // note: broken (but unnoticeable if scale > 0.4)
    return (BLOB_DEFAULT_SCALE-scale)*BLOB_HEIGHT * 1/(BLOB_HEIGHT) + 0.4;
}

function getYBCompOffset(scale) {
    // note: broken (but unnoticeable if scale > 0.4)
    return (scale-BLOB_DEFAULT_SCALE)*BLOB_HEIGHT * 1/BLOB_HEIGHT + 0.4;

}

function getXCompOffset(scale) { // does not work i think
    return (BLOB_DEFAULT_SCALE-scale)*BLOB_WIDTH * 1/BLOB_WIDTH;
}

class Blob {
    constructor() {
        this.body = Matter.Bodies.rectangle(400, 0, 50, 50, {
            mass: 100,
            label: 'blob',
            inertia: 99999999999, // disable rotation
            render: {
                sprite: {
                    texture: 'img/blob.png',
                    xScale: 0.7,
                    yScale: 0.7,
                    yOffset: -0.1
                }
            }
        });
        this.jumpSpeed = 9;
        this.jumpShortSpeed = 4;
        this.jumpLargeSpeed = 15;
        this.moveSpeed = 5;

        this.isMovingLeft = false;
        this.isMovingRight = false;
        this.isHoldingJump = false;
		this.isHoldingDash = false;
        this.isMovingUp = false;
		this.isBounce = false;
		this.usedDash = false;
		this.isLost = false;
		this.isShortBounce =false;
        this.isMovingDown = false;

        this.isFrozen = false;

        this.isChargingJump = false;
        this.chargingJumpSpeed = 0;
        
        this.isOnGround = false;
        this.isOnWall = false;

        this.boostTimer = -1;

        this.touchWall = {
            start : false,
            x:0,
            y:0,
            keys:[false,false,false,false],
            timer : 0 //in frames
        };

        this.aXDuration = 0;
        this.aXFrame = 0;
        this.aXScale = 0;

        this.aYDuration = 0;
        this.aYFrame = 0;
        this.aYScale = 0;
    }

    playAnimation(aXDuration, aXScale, aYDuration, aYScale) {
        this.aXDuration = aXDuration;
        this.aXFrame = 1;
        this.aXScale = aXScale;
        this.aYDuration = aYDuration;
        this.aYFrame = 1;
        this.aYScale = aYScale;
    }
    checkIfAnimationActive() {
        return this.aXFrame < this.aXDuration || this.aYFrame < this.aYDuration;
    }

    fixInPlace() {
        this.body.isStatic = true;
    }
    unFixInPlace() {
        this.body.isStatic = false;
    }

    startMoveLeft() { 
		if(this.isLost) return;
        if (this.isMovingRight) this.stopMoveRight();
        this.isMovingLeft = true;
        this.body.render.sprite.texture = 'img/blob.png';
    }
    doMoveLeft() {
        if (this.isFrozen) return;
        Matter.Body.setVelocity(this.body, {x:Math.min(this.body.velocity.x, -this.moveSpeed), y:this.body.velocity.y});
    }
    stopMoveLeft() {
        this.isMovingLeft = false;
    }
	startMoveDash() { 
        this.isHoldingDash = true;
    }
	stopMoveDash() {
        this.isHoldingDash = false;
    }
    startMoveRight() { // same here
		if(this.isLost) return;	
        if (this.isMovingLeft) this.stopMoveLeft();
        this.isMovingRight = true;
        this.body.render.sprite.texture = 'img/blobflipped.png';
    }
    doMoveRight() {
        if (this.isFrozen) return;
        Matter.Body.setVelocity(this.body, {x:Math.max(this.moveSpeed+0.0, this.body.velocity.x), y:this.body.velocity.y});
    }
    stopMoveRight() {
        this.isMovingRight = false;
    }

    startMoveUp() { // same here
        if (this.isMovingDown) this.stopMoveDown();
        this.isMovingUp = true;
        //this.body.render.sprite.texture = 'img/blobflipped.png';
    }
    doMoveUp() {
        if (this.isFrozen) return;
        Matter.Body.setVelocity(this.body, {y:-15, x:this.body.velocity.x});
    }
    stopMoveUp() {
        this.isMovingUp = false;
    }

    startMoveDown() { // same here
        if (this.isMovingUp) this.stopMoveUp();
        this.isMovingDown = true;
        //this.body.render.sprite.texture = 'img/blobflipped.png';
    }
    doMoveDown() {
        if (this.isOnGround || this.isFrozen) return;
        Matter.Body.setVelocity(this.body, {y:15, x:this.body.velocity.x});
    }
    stopMoveDown() {
        this.isMovingDown = false;
    }

    holdJump() {
        this.isHoldingJump = true;
    }
    unHoldJump() {
        this.isHoldingJump = false;
        this.jumpShort();
    }

    jump() {
        if (!this.isOnGround || this.isFrozen) return;
        
        Matter.Body.setVelocity(this.body, {x:this.body.velocity.x, y:-this.jumpSpeed});
        //this.isOnGround = false;
    }

    jumpLarge() {
        if (!this.isOnGround || this.isFrozen || !this.isChargingJump) return;
        var speed = Math.min(-this.chargingJumpSpeed, -this.jumpSpeed);
        Matter.Body.setVelocity(this.body, {x:this.body.velocity.x, y:speed});
        console.log(this.chargingJumpSpeed);
        this.isChargingJump = false;
        this.chargingJumpSpeed = 0;
        this.isOnGround = false; // so jump() doesnt override this
    }


    jumpShort() { //also resets x velocity
        if (this.body.velocity.y < -this.jumpShortSpeed) {
            Matter.Body.setVelocity(this.body, {x:this.body.velocity.x, y:-this.jumpShortSpeed});
        }       
    }
	//bounce(){ //outdated
		//for(var i = 0; i < 300 && this.body.render.sprite.yScale < 0.70; i++){
			//setTimeout(function(blobbody){
				//blobbody.render.sprite.yScale += 0.0001;
				
				//blobbody.render.sprite.xScale -= 0.0001;
				//blobbody.render.sprite.yOffset += 0.0001;
			//}, i, this.body);
		//}
	//}
		
}

class Game {
    start() {
        this.engine = Matter.Engine.create();
        this.render = Matter.Render.create({
            element: document.body,
            engine: this.engine,
            options: {
                width: 900,
                height: 600,
                wireframes: false
            }
        });

        this.blob = new Blob();
        var ground = Matter.Bodies.rectangle(400, 600, 2010, 60, {isStatic:true, label:'ground'});
		var wall = Matter.Bodies.rectangle(0, 900, 10, 4000, {isStatic:true, label:'wall'});
		var wall1 = Matter.Bodies.rectangle(900, 900, 10, 4000, {isStatic:true, label:'wall'});
        var ceiling = Matter.Bodies.rectangle(400, -50, 2010, 10, {isStatic:true, label:'wall'});

		var plat1 = Matter.Bodies.rectangle(300, 470, 900, 10, {isStatic:true, label:'ground'});
		var plat2 = Matter.Bodies.rectangle(1200, 380, 2100, 10, {isStatic:true, label:'ground'});


		wall.restitution = 1.7;
		wall1.restitution = 1.7;

		
		var dieBlock = Matter.Bodies.rectangle(450, 300, 30, 80, {isStatic:true, label:'die', render:{fillStyle:'red'}});
		var winBlock = Matter.Bodies.rectangle(470, 300, 30, 80, {isStatic:true, label:'win', render:{fillStyle:'green'}});

        Matter.World.add(this.engine.world, [ground, wall, wall1,ceiling, plat1, plat2,this.blob.body, dieBlock, winBlock]);

        Matter.Engine.run(this.engine);
        Matter.Render.run(this.render);

        this.keys = {};

        this.keyFuncs = {
            [CONTROLS.moveLeft]: { //left
                up: () => {
                    this.blob.startMoveLeft();
                },
                down: () => {
                    this.blob.stopMoveLeft();
                }
            },
            [CONTROLS.moveUp]: { // up
                up: () => {
                    this.blob.holdJump();
                },
                down: () => {
                    this.blob.unHoldJump();
                }
            },
            [CONTROLS.moveRight]: { // right
                up: () => {
                    this.blob.startMoveRight();
                },
                down: () => {
                    this.blob.stopMoveRight();
                }
            },
            67: { // c, debug
                up: () => {
                    this.blob.startMoveUp();
                },
                down: () => {
                    this.blob.stopMoveUp();
                }
            },
            [CONTROLS.moveDown]: { //down
                up: () => {
					this.blob.startMoveDown();
				},
                down: () => {
					this.blob.stopMoveDown();
				}
            },
            68: { // d
                up: () => {
					this.blob.startMoveDash();
				},
                down: () => {
					this.blob.stopMoveDash();
				}
            },
            90: { // z, debug
                up: () => {
                    this.blob.body.render.sprite.yScale += 0.1;
                    this.blob.body.render.sprite.xScale -= 0.1;
                    this.blob.body.render.sprite.yOffset += 0.1;
                },
                down: () => {}
            },
            88: { // x, debug
                up: () => {
                    this.blob.body.render.sprite.yScale -= 0.1;
                    this.blob.body.render.sprite.xScale += 0.1;
                    this.blob.body.render.sprite.yOffset -= 0.1;
                },
                down: () => {}
            },
			20: { //Caps lock
				up: () =>{
					this.blob.isFrozen = true;
				},
				down: () => {
					this.blob.isFrozen = false;
				}
			}
        };
        
        var t = this; 
        //this.bob = 0;
        document.addEventListener('keydown', e => {t.handleKeyDown(e)}, false);
        document.addEventListener('keyup', e => {t.handleKeyUp(e)}, false);
        setInterval(function() {t.loop()}, 16.666666);

        Matter.Events.on(this.engine, 'collisionEnd', e => {
            var pairs = e.pairs[0];
            if (
                (pairs.bodyA.label == 'blob' && pairs.bodyB.label == 'ground') ||
                (pairs.bodyB.label == 'blob' && pairs.bodyA.label == 'ground')
            ) {
                if (this.blob.isOnGround) {
                    this.blob.isOnGround = false;
                }
            }
            
            if (
                (pairs.bodyA.label == 'blob' && pairs.bodyB.label == 'wall') ||
                (pairs.bodyB.label == 'blob' && pairs.bodyA.label == 'wall')
            ) {
                if (this.blob.isOnWall) {
                    this.blob.isOnWall = false;
                }
            }
        });
		

        Matter.Events.on(this.engine, 'collisionStart', e => {
            var pairs = e.pairs[0];
            if (
                (pairs.bodyA.label == 'blob' && pairs.bodyB.label == 'ground') ||
                (pairs.bodyB.label == 'blob' && pairs.bodyA.label == 'ground')
            ) {
                if (!this.blob.isOnGround) {

                    this.blob.isOnGround = true;

                    var intensity = 3/(Math.abs(this.blob.body.velocity.y)+5)+0.3;
                    console.log(intensity);

                    this.blob.boostTimer = 0;
                    this.blob.chargingJumpSpeed = this.blob.body.velocity.y;

                    this.blob.playAnimation(25, 0.85, 25, intensity);
                }
            }

			this.blob.isBounce = true;
			this.blob.usedDash = false;
            if (
                (pairs.bodyA.label == 'blob' && pairs.bodyB.label == 'wall') ||
                (pairs.bodyB.label == 'blob' && pairs.bodyA.label == 'wall')
            ) {

                if (!this.blob.isOnWall) {
                    this.blob.isOnWall = true;

                    var intensity = 3/(Math.abs(this.blob.body.velocity.x)+5)+0.3;
                    console.log(intensity);

                    this.blob.playAnimation(25, intensity, 25, 0.85);

                }

                //this.blob.touchWall.keys[0] = this.keys[38] //wasd its actually ijkl but this is easier to undrestand
                //this.blob.touchWall.keys[1] = this.keys[37] //wasd
                //this.blob.touchWall.keys[2] = this.keys[40] //wasd
                //this.blob.touchWall.keys[3] = this.keys[39] //wasd
                //this.blob.touchWall.start = true;
            }
			if(pairs.bodyA.label ==="die" || pairs.bodyB.label === "die"){	
				Matter.World.add(this.engine.world, [gameOver]);	
				this.blob.isFrozen = true;	
				this.blob.body.render.sprite.texture = "img/sadblob.png";	
				this.blob.isLost = true;	
			}	
			if(pairs.bodyA.label ==="win" || pairs.bodyB.label === "win"){	
				Matter.World.add(this.engine.world, [winGame]);	
				window.timer = true;	
				this.blob.isFrozen = true;	


			}
        });
    }

    loop() {
        // Start walking animation if walking
        if (this.blob.isOnGround && (this.blob.isMovingLeft || this.blob.isMovingRight)) {
            if (!this.blob.checkIfAnimationActive()) {
                this.blob.playAnimation(40, 0.75, 40, 0.6);
            }
        }

        // boost off of ground
        if (this.blob.boostTimer != -1) {
            if (!this.blob.isOnGround && !this.blob.isOnWall) {
                this.blob.boostTimer = -1;
            } else if (this.blob.isOnGround) {
                if (this.blob.boostTimer <= 35) {
                    if (this.blob.isHoldingJump) {
                        this.blob.isChargingJump = true;
                        this.blob.jumpLarge();
                        this.blob.boostTimer = -1;
                    }
                }
            }
            if (this.blob.boostTimer != -1) {
                if (this.blob.boostTimer > 35) {
                    this.blob.boostTimer = -1;
                } else {
                    this.blob.boostTimer++;
                }       
            }       
        }

        // Play animations
        if (this.blob.aYFrame < this.blob.aYDuration) {
            var scale = getCompScale(this.blob.aYDuration, this.blob.aYFrame, this.blob.aYScale);
            this.blob.body.render.sprite.yScale = scale;
            this.blob.body.render.sprite.yOffset = getYBCompOffset(scale);
            this.blob.aYFrame++;
        }
        if (this.blob.aXFrame < this.blob.aXDuration) {
            this.blob.aXFrame++;
            var scale = getCompScale(this.blob.aXDuration, this.blob.aXFrame, this.blob.aXScale);
            this.blob.body.render.sprite.xScale = scale;
            //this.blob.body.render.sprite.xOffset = getXBCompOffset(scale); //TODO: implement
        }

        if (this.blob.isMovingLeft) {
            this.blob.doMoveLeft();
        }
		
        if (this.blob.isMovingRight) {
            this.blob.doMoveRight();
        }
        
		if(this.blob.isMovingDown){
			this.blob.doMoveDown();
        }
        
        if(this.blob.isMovingUp){
			
			this.blob.doMoveUp();
		}

		if (this.blob.isHoldingJump) {
			//this.blob.bounce();
            this.blob.jump();
        }
		if(this.blob.isHoldingDash){
			if(!this.blob.usedDash || this.blob.onGround)
				Matter.Body.setVelocity(this.blob.body, {x:2.5*this.blob.body.velocity.x, y:2*this.blob.body.velocity.y});
			this.blob.usedDash = true;
		}
    }

    handleKeyDown(e) {
        if (this.keys[e.keyCode]) return;
        this.keys[e.keyCode] = true;

        if (e.keyCode in this.keyFuncs) {
            this.keyFuncs[e.keyCode].up();
        }

        //console.log(e.keyCode);
    }

    handleKeyUp(e) {
        this.keys[e.keyCode] = false;
        
        if (e.keyCode in this.keyFuncs) {
            this.keyFuncs[e.keyCode].down();
        }
    }
}

var game = new Game();

game.start();
