const CONTROLS = {
    moveUp: 73,     // i
    moveLeft: 74,   // j
    moveDown: 75,   // k
    moveRight: 76,  // l
    dashLeft: 83,   // s
    dashRight: 70,  // f
    dashUp: 68      // d
};

/* 37 left arrow
 * 39 right arrow
 * 38 up arrow
 * 40 down arrow
 */

const COLOURS = {
    yellow: '#FCC21C',
    white: '#EEEEEE',
    red: '#D33F49',
    black: '#2C2B2B',
    blue: '#7180AC',
    green: '#15B097'
};

const BLOCKS = {
    ground: 0,
    wall: 1,
    win: 2,
    boost: 3,
    death: 4
};

const LEVELS = {
    1: [
        [BLOCKS.ground, 400, 600, 2010, 60],
        [BLOCKS.wall, 0, 900, 10, 4000],
        [BLOCKS.wall, 400, -50, 2010, 10],
        [BLOCKS.ground, 300, 470, 900, 10],
        [BLOCKS.ground, 1200, 380, 2100, 10],
        [BLOCKS.death, 450, 300, 30, 80],
        [BLOCKS.win, 470, 300, 30, 80]
    ]
};

const BLOB_HEIGHT = 98;
const BLOB_WIDTH = 80;
const BLOB_DEFAULT_SCALE = 0.7;

var gameOver = Matter.Bodies.rectangle(450, 250, 500, 300, {isStatic:true, label:'gameOver', render:{fillStyle:COLOURS.red}});	
gameOver.render.sprite.texture = "img/gameover.png";	


var winGame = Matter.Bodies.rectangle(450, 250, 500, 300, {isStatic:true, label:'winGame', render:{fillStyle:COLOURS.red}});	
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
        this.moveSpeed = 5;
        this.moveDownSpeed = 12;
        this.dashUpSpeed = 8;
        this.airMoveRate = 0.5;

        this.isMovingLeft = false;
        this.isMovingRight = false;
        this.isHoldingJump = false;
		this.isHoldingDash = false;
        this.isMovingUp = false;
		this.isLost = false;
        this.isMovingDown = false;

        this.isFrozen = false;

        this.isChargingJump = false;
        this.chargingJumpSpeed = 0;

        this.usedDownDash = true;
        this.usedUpDash = true;
        
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

        if (this.isOnGround) {
            Matter.Body.setVelocity(this.body, {x:-this.moveSpeed,y:this.body.velocity.y});
        } else {
            var speed = Math.max(this.body.velocity.x-this.airMoveRate, -this.moveSpeed);
            if (speed < this.body.velocity.x) {
                Matter.Body.setVelocity(this.body, {x:speed, y:this.body.velocity.y});
            }
        }
    }
    stopMoveLeft() {
        this.isMovingLeft = false;
    }

    startMoveRight() { // same here
		if(this.isLost) return;	
        if (this.isMovingLeft) this.stopMoveLeft();
        this.isMovingRight = true;
        this.body.render.sprite.texture = 'img/blobflipped.png';
    }
    doMoveRight() {
        if (this.isFrozen) return;
        //Matter.Body.setVelocity(this.body, {x:Math.max(this.moveSpeed+0.0, this.body.velocity.x), y:this.body.velocity.y});
        if (this.isOnGround) {
            Matter.Body.setVelocity(this.body, {x:this.moveSpeed,y:this.body.velocity.y});
        } else {
            var speed = Math.min(this.body.velocity.x+this.airMoveRate, this.moveSpeed);
            if (speed > this.body.velocity.x) {
                Matter.Body.setVelocity(this.body, {x:speed, y:this.body.velocity.y});
            }
        }
    }
    stopMoveRight() {
        this.isMovingRight = false;
    }

    startMoveDown() {
        if (this.isMovingUp) this.stopMoveUp();
        this.isMovingDown = true;
    }
    doMoveDown() {
        if (this.isOnGround || this.isFrozen || this.usedDownDash) return;
        Matter.Body.setVelocity(this.body, {y:this.moveDownSpeed, x:this.body.velocity.x});
        this.usedDownDash = true;
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

    dashLeft() {
        var speed = Math.abs(this.body.velocity.y);
        Matter.Body.setVelocity(this.body, {x:-speed, y:-speed/2});
    }
    dashRight() {
        var speed = Math.abs(this.body.velocity.y);
        Matter.Body.setVelocity(this.body, {x:speed, y:-speed/2});
    }
    dashUp() {
        if (this.usedUpDash) return;
        Matter.Body.setVelocity(this.body, {x:this.body.velocity.x, y:-this.dashUpSpeed});
        this.usedDashUp = true;
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
        this.isChargingJump = false;
        this.chargingJumpSpeed = 0;
        this.isOnGround = false; // so jump() doesnt override this
    }


    jumpShort() {
        if (this.body.velocity.y < -this.jumpShortSpeed) {
            Matter.Body.setVelocity(this.body, {x:this.body.velocity.x, y:-this.jumpShortSpeed});
        }       
    }
		
}

class Game {
    constructor(level) {
        this.level = level;
    }
    start() {
        this.engine = Matter.Engine.create();
        this.render = Matter.Render.create({
            element: document.getElementById("maindiv"),
            engine: this.engine,
            options: {
                background: COLOURS.white,
                width: 1200,
                height: 800,
                wireframes: false
            }
        });

        this.blob = new Blob();

        var blocks = [];

        const blockFuncs = {
            [BLOCKS.ground]: block => {
                blocks.push(Matter.Bodies.rectangle(block[1], block[2], block[3], block[4], {
                    isStatic: true,
                    label: 'ground',
                    render: {
                        fillStyle: COLOURS.black
                    }
                }));
            },
            [BLOCKS.wall]: block => {
                blocks.push(Matter.Bodies.rectangle(block[1], block[2], block[3], block[4], {
                    isStatic: true,
                    label: 'wall',
                    render: {
                        fillStyle: COLOURS.black
                    }
                })); 
            },
            [BLOCKS.boost]: block => { // boost blocks have no functionality right now
                blocks.push(Matter.Bodies.rectangle(block[1], block[2], block[3], block[4], {
                    isStatic: true,
                    label: 'boost',
                    render: {
                        fillStyle: COLOURS.blue
                    }
                })); 
            },
            [BLOCKS.win]: block => {
                blocks.push(Matter.Bodies.rectangle(block[1], block[2], block[3], block[4], {
                    isStatic: true,
                    label: 'win',
                    render: {
                        fillStyle: COLOURS.green
                    }
                }));
            },
            [BLOCKS.death]: block => {
                blocks.push(Matter.Bodies.rectangle(block[1], block[2], block[3], block[4], {
                    isStatic: true,
                    label: 'death',
                    render: {
                        fillStyle: COLOURS.red
                    }
                }));
            }
        }

        for (const block of LEVELS[this.level]) {
            blockFuncs[block[0]](block);
        }

        blocks.push(this.blob.body);

        Matter.World.add(this.engine.world, blocks);

        Matter.Engine.run(this.engine);
        Matter.Render.run(this.render);

        this.keys = {};

        this.keyFuncs = {
            [CONTROLS.moveLeft]: {
                up: () => {
                    this.blob.startMoveLeft();
                },
                down: () => {
                    this.blob.stopMoveLeft();
                }
            },
            [CONTROLS.moveUp]: {
                up: () => {
                    this.blob.holdJump();
                },
                down: () => {
                    this.blob.unHoldJump();
                }
            },
            [CONTROLS.moveRight]: {
                up: () => {
                    this.blob.startMoveRight();
                },
                down: () => {
                    this.blob.stopMoveRight();
                }
            },
            [CONTROLS.moveDown]: {
                up: () => {
					this.blob.startMoveDown();
				},
                down: () => {
					this.blob.stopMoveDown();
				}
            },
            [CONTROLS.dashLeft]: {
                up: () => {
					this.blob.dashLeft();
				},
                down: () => {}
            },
            [CONTROLS.dashRight]: {
                up: () => {
                    this.blob.dashRight();
                },
                down: () => {}
            },
            [CONTROLS.dashUp]: {
                up: () => {
                    this.blob.dashUp();
                },
                down: () => {}
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
                (pairs.bodyA.label === 'blob' && pairs.bodyB.label === 'ground') ||
                (pairs.bodyB.label === 'blob' && pairs.bodyA.label === 'ground')
            ) {
                if (this.blob.isOnGround) {
                    this.blob.isOnGround = false;
                }
                this.blob.usedDownDash = false;
                this.blob.usedUpDash = false;
            }
            
            if (
                (pairs.bodyA.label === 'blob' && pairs.bodyB.label === 'wall') ||
                (pairs.bodyB.label === 'blob' && pairs.bodyA.label === 'wall')
            ) {
                if (this.blob.isOnWall) {
                    this.blob.isOnWall = false;
                }
            }
        });
		

        Matter.Events.on(this.engine, 'collisionStart', e => {
            var pairs = e.pairs[0];
            if (
                (pairs.bodyA.label === 'blob' && pairs.bodyB.label === 'ground') ||
                (pairs.bodyB.label === 'blob' && pairs.bodyA.label === 'ground')
            ) {
                if (!this.blob.isOnGround) {

                    this.blob.isOnGround = true;

                    var intensity = 3/(Math.abs(this.blob.body.velocity.y)+5)+0.3;

                    this.blob.boostTimer = 0;
                    this.blob.chargingJumpSpeed = this.blob.body.velocity.y;

                    this.blob.playAnimation(25, 0.85, 25, intensity);
                }
            }

			this.blob.isBounce = true;
			this.blob.usedDash = false;
            if (
                (pairs.bodyA.label === 'blob' && pairs.bodyB.label === 'wall') ||
                (pairs.bodyB.label === 'blob' && pairs.bodyA.label === 'wall')
            ) {

                if (!this.blob.isOnWall) {
                    this.blob.isOnWall = true;

                    var intensity = 3/(Math.abs(this.blob.body.velocity.x)+5)+0.3;

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
    }

    handleKeyUp(e) {
        this.keys[e.keyCode] = false;
        
        if (e.keyCode in this.keyFuncs) {
            this.keyFuncs[e.keyCode].down();
        }
    }

    stop() {
        Matter.Render.stop(this.render);
        Matter.World.clear(this.engine.world);
        Matter.Engine.clear(this.engine);
        this.render.canvas.remove();
        this.render.canvas = null;
        this.render.context = null;
        this.render.textures = {};
    }
}

var game = new Game(1);

game.start();
