const CONTROLS = {
    moveUp:     73, // i
    moveLeft:   74, // j
    moveDown:   75, // k
    moveRight:  76, // l
    dashLeft:   83, // s
    dashRight:  70, // f
    dashUp:     68, // d
    restart:    81  // q
};

/* 
 * 37 left arrow
 * 39 right arrow
 * 38 up arrow
 * 40 down arrow
 *
 */

const COLOURS = {
    yellow: '#FCC21C',
    white:  '#EEEEEE',
    red:    '#D33F49',
    black:  '#2C2B2B',
    blue:   '#7180AC',
    green:  '#15B097'
};

const BLOCKS = {
    ground: 0,
    wall:   1,
    win:    2,
    boost:  3,
    death:  4
};

const LEVELS = {
    1: {
        spawnpoint: [40, 740],
        blocks: [
            [BLOCKS.ground, 400, 820, 1800, 60],
            [BLOCKS.ground, 0, 700, 200, 10],
            [BLOCKS.ground, 0, 500, 200, 10],
            [BLOCKS.ground, 250, 600, 100, 10],
            [BLOCKS.wall, 0, 800, 10, 4000],
            [BLOCKS.wall, 1200, 800, 10, 4000],
			//[BLOCKS.tutorial, 240, 120, 200, 300],
            [BLOCKS.wall, 300, 800, 10, 800],
            [BLOCKS.wall, 600, 200, 10, 700],
			[BLOCKS.tutorial, 1000, 200, 200, 300],
            [BLOCKS.death, 1505, 800, 2400, 60],
            [BLOCKS.win, 1250, 765, 800, 10]
        ]
    },
    2: {
        spawnpoint: [50, 500],
        blocks: [
            [BLOCKS.ground, 0, 600, 300, 20],
            
            [BLOCKS.ground, 1200, 600, 300, 20],
            [BLOCKS.win, 1250, 585, 200, 10],
            
            //[BLOCKS.ground, 900, 350, 150, 20],
            
            //[BLOCKS.ground, 0, 350, 350, 20],
            
            [BLOCKS.ground, 400, 600, 10, 500],
            
            //[BLOCKS.ground, 0, 350, 350, 20],
            
            [BLOCKS.ground, 0, 200, 2400, 20],

            //[BLOCKS.win, 800, 300, 200, 20],
            
            [BLOCKS.death, 0, 800, 2400, 60],
            [BLOCKS.wall, 0, 800, 10, 4000],
            [BLOCKS.wall, 1200, 800, 10, 4000],
        ]
    },
    3: {
        spawnpoint: [50, 500],
        blocks: [
            [BLOCKS.ground, 50, 600, 700, 20],

            [BLOCKS.win, -10, 785, 700, 30],
            
            //[BLOCKS.ground, 1200, 600, 300, 20],
            
            //[BLOCKS.ground, 900, 350, 150, 20],
            
            //[BLOCKS.ground, 0, 350, 350, 20],
            
            [BLOCKS.ground, 400, 460, 10, 300],
            
            //[BLOCKS.ground, 0, 350, 350, 20],
            
            [BLOCKS.ground, 0, 200, 2400, 20],

            //[BLOCKS.win, 800, 300, 200, 20],
            
            [BLOCKS.death, 1535, 800, 2400, 60],
            [BLOCKS.wall, 0, 800, 10, 4000],
            [BLOCKS.wall, 1200, 800, 10, 4000],
        ]
    },
    4: {
        spawnpoint: [50, 600],
        blocks: [
            [BLOCKS.ground, 0, 800, 300, 60],
            [BLOCKS.ground, 170, 670, 10, 20],
            [BLOCKS.death, 170, 660, 10, 3],

            [BLOCKS.ground, 560, 390, 10, 20],
            [BLOCKS.death, 560, 380, 10, 3],
            //[BLOCKS.wallj, 170, 650, 10, 3],
            
            [BLOCKS.ground, 390, 520, 200, 20],

            [BLOCKS.win, 800, 300, 200, 20],
            
            [BLOCKS.death, 750, 800, 1200, 60],
            [BLOCKS.wall, 0, 800, 10, 4000],
            [BLOCKS.wall, 140, 770, 10, 30]
        ]
    },
    5: {
        spawnpoint: [50, 500],
        blocks: [
            [BLOCKS.ground, 50, 600, 300, 20],
            
            [BLOCKS.ground, 300, 600, 20, 20],
            [BLOCKS.ground, 400, 600, 20, 20],
            [BLOCKS.ground, 500, 600, 20, 20],
            [BLOCKS.ground, 600, 600, 20, 20],
            [BLOCKS.ground, 700, 600, 20, 20],
            [BLOCKS.ground, 800, 600, 20, 20],
            [BLOCKS.ground, 900, 600, 20, 20],
            [BLOCKS.ground, 1000, 600, 20, 20],
    
            [BLOCKS.ground, 1200, 600, 200, 20],
            [BLOCKS.win, 1250, 585, 200, 10],

            //[BLOCKS.win, -10, 785, 700, 30],
            
            //[BLOCKS.ground, 1200, 600, 300, 20],
            
            //[BLOCKS.ground, 900, 350, 150, 20],
            
            //[BLOCKS.ground, 0, 350, 350, 20],
            
            //[BLOCKS.ground, 400, 460, 10, 300],
            
            //[BLOCKS.ground, 0, 350, 350, 20],
            
            [BLOCKS.ground, 0, 500, 2400, 20],

            //[BLOCKS.win, 800, 300, 200, 20],
            
            [BLOCKS.death, 1005, 800, 2400, 60],
            [BLOCKS.wall, 0, 800, 10, 4000],
            [BLOCKS.wall, 1200, 800, 10, 4000],
        ]
    },
    6: {
        spawnpoint: [700, 0],
        blocks: [
            //[BLOCKS.win, -10, 785, 700, 30],
            
            //[BLOCKS.ground, 1200, 600, 300, 20],
            
            //[BLOCKS.ground, 900, 350, 150, 20],
            
            //[BLOCKS.ground, 0, 350, 350, 20],
            
            //[BLOCKS.ground, 400, 460, 10, 300],
            
            //[BLOCKS.ground, 0, 350, 350, 20],
            
            //[BLOCKS.ground, 0, 500, 2400, 20],

            //[BLOCKS.win, 800, 300, 200, 20],
            
            [BLOCKS.death, 900, 500, 1200, 20],
            [BLOCKS.win, 0, 800, 2400, 20],
            [BLOCKS.death, 0, 500, 300, 20],
            [BLOCKS.death, 0, 700, 1200, 20],
            [BLOCKS.death, 1400, 700, 1200, 20],
            [BLOCKS.wall, 0, 800, 10, 4000],
            [BLOCKS.wall, 1200, 800, 10, 4000],
        ]
    },
    7: { // WIP
        spawnpoint: [155, 600],
        blocks: [
            [BLOCKS.wall, 0, 0, 80, 2000],
            [BLOCKS.ground, 36, 780, 395, 40],
            [BLOCKS.wall, 250, 730, 40, 800],
            [BLOCKS.ground, 303, 320, 146, 40],
            [BLOCKS.ground, 40, 400, 40, 40],
            [BLOCKS.death, 510, 270, 220, 30],
            [BLOCKS.death, 560, 100, 1000, 40],
            [BLOCKS.ground, 720, 320, 146, 40],
            [BLOCKS.death, 560, 100, 1000, 40],
            [BLOCKS.win, 600, 500, 40, 40], 
            [BLOCKS.death, 1200, 500, 40, 1000], 
            [BLOCKS.death, 800, 800, 1000, 40],
        ]
    },

    8: {
        spawnpoint: [400, 400],
        blocks: [
            [BLOCKS.wall, 0, 0, 40, 3000],
            [BLOCKS.ground, 0, 800, 4000, 40],
            [BLOCKS.wall, 1200, 0, 40, 3000],
            [BLOCKS.wall, 0, 0, 4000, 40]
        ]
    }
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
    constructor(spawnpoint) {
        this.body = Matter.Bodies.rectangle(spawnpoint[0], spawnpoint[1], 50, 50, {
            mass: 100,
            label: 'blob',
            inertia: 99999999999, // disable rotation (Infinity does not work)
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
        var ySpeed = speed/2;
        if (speed <= this.moveSpeed) {
            var ySpeed = -1;
        }
        Matter.Body.setVelocity(this.body, {x:-speed, y:-ySpeed});
    }
    dashRight() {
        var speed = Math.abs(this.body.velocity.y);
        var ySpeed = speed/2;
        if (speed <= this.moveSpeed) {
            var ySpeed = -1;
        }
        Matter.Body.setVelocity(this.body, {x:speed, y:-ySpeed});
    }
    dashUp() {
        if (this.usedUpDash) return;
        Matter.Body.setVelocity(this.body, {x:this.body.velocity.x, y:-this.dashUpSpeed});
        this.usedUpDash = true;
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

        this.blob = new Blob(LEVELS[this.level].spawnpoint);

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
            },
			[BLOCKS.tutorial]: block =>{
				blocks.push(Matter.Bodies.rectangle(block[1], block[2], block[3], block[4], {
                    isStatic: true,
                    label: 'tutorial',
                    render: {
                        fillStyle: COLOURS.blue,
						sprite:{
							texture: "img/Movement.png"
						}
                    }
                }));
			}
        }

        for (const block of LEVELS[this.level].blocks) {
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

        this.handleKeyDownWrapper = e => {t.handleKeyDown(e)}
        this.handleKeyUpWrapper = e => {t.handleKeyUp(e)}

        document.addEventListener('keydown', this.handleKeyDownWrapper, false);
        document.addEventListener('keyup', this.handleKeyUpWrapper, false);
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
            if (
                (pairs.bodyA.label === 'blob' && pairs.bodyB.label === 'death') ||
                (pairs.bodyB.label === 'death' && pairs.bodyA.label === 'blob')
            ) {
				//Matter.World.add(this.engine.world, [gameOver]);	
				//this.blob.isFrozen = true;	
				//this.blob.body.render.sprite.texture = "img/sadblob.png";	
				//this.blob.isLost = true;	
                this.displayLoss();
			}	
            if (
                (pairs.bodyA.label === 'blob' && pairs.bodyB.label === 'win') ||
                (pairs.bodyB.label === 'win' && pairs.bodyA.label === 'blob')
            ) {
                this.displayWin();
				window.timer = true;
				//Matter.World.add(this.engine.world, [winGame]);	
				//window.timer = true;	
				//this.blob.isFrozen = true;	
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

    displayLoss() {
        this.blob.fixInPlace();
        document.getElementById('losediv').style.display = 'block';
    }

    displayWin() {
        this.blob.fixInPlace();
        document.getElementById('windiv').style.display = 'block';
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
        clearInterval(this.loop);

        document.removeEventListener('keydown', this.handleKeyDownWrapper, false);
        document.removeEventListener('keyup', this.handleKeyUpWrapper, false);

        Matter.Render.stop(this.render);
        Matter.World.clear(this.engine.world);
        Matter.Engine.clear(this.engine);
        
        this.render.canvas.parentNode.removeChild(this.render.canvas);

        this.render.canvas.remove();
        this.render.canvas = null;
        this.render.context = null;
        this.render.textures = {};
    }
}

//window.timer = false;
//var now = new Date().getTime();

//function formatTime(ms) {
  //var format = "mm:ss:SS";
  //if (ms > 3600000) {
    //format = "HH:mm:ss:SS";
  //}
  //return moment().startOf('day').add(ms, 'milliseconds').format(format);
//}
//setInterval(function(){
    //if(!window.timer)
    //document.getElementById("timer").innerHTML = formatTime(new Date().getTime()-now);
//}, 1);

var game;

function startGame(level) {
    if (typeof game !== 'undefined') {
        game.stop();
        var button = document.getElementById("levelbutton" + game.level.toString());
        button.className = "levelbutton";
    }
    document.getElementById('windiv').style.display = 'none';
    document.getElementById('losediv').style.display = 'none';
    game = new Game(level);
    game.start();
    var button = document.getElementById("levelbutton" + level.toString());
    button.className = "currentlevelbutton";
    document.getElementById('wintext').innerHTML = 'Level ' + level.toString() + ' clear!';
    document.getElementById('losetext').innerHTML = 'Level ' + level.toString() + ' failed!';
}

var pressingRestart = false;
document.addEventListener('keydown', e => {
    if (pressingRestart || e.keyCode != CONTROLS.restart) return;
    pressingRestart = true;
    const lvl = game.level;
    startGame(lvl);
}, false);
document.addEventListener('keyup', e => {
    if (e.keyCode == CONTROLS.restart) {
        pressingRestart = false;
    }
}, false);

var leveldiv = document.getElementById("leveldiv");
const levellength = Object.keys(LEVELS).length;

for (let i = 1; i <= levellength; ++i) {
    var button = document.createElement('button');
    button.innerHTML = i.toString();
    button.id = "levelbutton" + i.toString();
    button.className = "levelbutton";
    button.onclick = function() {startGame(i); window.timer = false;		window.now = new Date().getTime();};
    leveldiv.appendChild(button);
}

startGame(1);
