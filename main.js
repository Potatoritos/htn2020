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

function getHCompScale(duration, frame) {
    return Math.min(BLOB_DEFAULT_SCALE, 0.00092*Math.pow(30/duration, 2)*Math.pow(frame - duration/2, 2) + 0.5);
}

function getYUCompOffset(scale) {
    return (BLOB_DEFAULT_SCALE-scale)*BLOB_HEIGHT * 1/BLOB_HEIGHT + 0.4;
}

function getVCompScale(duration, frame) {
    return scale = Math.max(BLOB_DEFAULT_SCALE, -0.0007*Math.pow(30/duration, 2)*Math.pow(frame - duration/2, 2) + 0.85);
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

        this.isMovingLeft = false;
        this.isMovingRight = false;
        this.isHoldingJump = false;
        this.isMovingUp = false;
        this.isMovingDown = false;

        this.isFrozen = false;
        
        this.isOnGround = false;

        this.touchWall = {
            start : false,
            x:0,
            y:0,
            keys:[false,false,false,false],
            timer : 0 //in frames
        };
    }

    fixInPlace() {
        this.body.isStatic = true;
    }
    unFixInPlace() {
        this.body.isStatic = false;
    }

    startMoveLeft() { 
        if (this.isMovingRight) this.stopMoveRight();
        this.isMovingLeft = true;
        this.body.render.sprite.texture = 'img/blob.png';
    }
    doMoveLeft() {
        if (this.isFrozen) return;
        Matter.Body.setVelocity(this.body, {x:-this.moveSpeed, y:this.body.velocity.y});
    }
    stopMoveLeft() {
        this.isMovingLeft = false;
    }

    startMoveRight() { // same here
        if (this.isMovingLeft) this.stopMoveLeft();
        this.isMovingRight = true;
        this.body.render.sprite.texture = 'img/blobflipped.png';
    }
    doMoveRight() {
        if (this.isFrozen) return;
        Matter.Body.setVelocity(this.body, {x:this.moveSpeed, y:this.body.velocity.y});
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

    jump() { // this resets x velocity (should not reset)
        if (!this.isOnGround || this.isFrozen) return;
        
        Matter.Body.setVelocity(this.body, {x:this.body.velocity.x, y:-this.jumpSpeed});
        this.isOnGround = false;
    }

    jumpShort() { //also resets x velocity
        if (this.body.velocity.y < -this.jumpShortSpeed) {
            Matter.Body.setVelocity(this.body, {x:this.body.velocity.x, y:-this.jumpShortSpeed});
        }       
    }
}

class Game {
    start() {
        this.engine = Matter.Engine.create();
        this.render = Matter.Render.create({
            element: document.body,
            engine: this.engine,
            options: {
                width: document.body.clientWidth,
                height: document.body.clientHeight,
                wireframes: false,
                background: "#cccccc"
            }
        });

        this.blob = new Blob();
        var ground = Matter.Bodies.rectangle(400, 600, 2010, 60, {
            isStatic:true,
            label:'ground',
            render: {
                fillStyle: "#000000"
            }
        });
		var wall = Matter.Bodies.rectangle(0, 900, 10, 4000, {isStatic:true, label:'wall'});

        Matter.World.add(this.engine.world, [ground, wall, this.blob.body]);

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
            67: { // c, debug
                up: () => {
                    //this.blob.startMoveUp();
                    this.blob.body.render.sprite.yOffset = getYUCompOffset(this.blob.body.render.sprite.yScale);
                },
                down: () => {
                    //this.blob.stopMoveUp();
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
            [CONTROLS.dash]: { // d
                up: () => {},
                down: () => {}
            },
            90: { // z, debug
                up: () => {
                    this.blob.body.render.sprite.yScale -= 0.1;
                    //this.blob.body.render.sprite.xScale -= 0.1;
                    //this.blob.body.render.sprite.yOffset += 0.1;
                },
                down: () => {}
            },
            88: { // x, debug
                up: () => {
                    //this.blob.body.render.sprite.yScale -= 0.1;
                    //this.blob.body.render.sprite.xScale += 0.1;
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
        document.addEventListener('keydown', e => {t.handleKeyDown(e)}, false);
        document.addEventListener('keyup', e => {t.handleKeyUp(e)}, false);
        setInterval(function() {t.loop()}, 16.666666);

        Matter.Events.on(this.engine, 'collisionStart', e => {
            var pairs = e.pairs[0];
            if (
                (pairs.bodyA.label == 'blob' && pairs.bodyB.label == 'ground') ||
                (pairs.bodyB.label == 'blob' && pairs.bodyA.label == 'ground')
            ) {
                this.blob.isOnGround = true;
				
            }

            if (
                (pairs.bodyA.label == 'blob' && pairs.bodyB.label == 'wall') ||
                (pairs.bodyB.label == 'blob' && pairs.bodyA.label == 'wall')
            ) {
                this.blob.touchWall.keys[0] = this.keys[38] //wasd its actually ijkl but this is easier to undrestand
                this.blob.touchWall.keys[1] = this.keys[37] //wasd
                this.blob.touchWall.keys[2] = this.keys[40] //wasd
                this.blob.touchWall.keys[3] = this.keys[39] //wasd
                this.blob.touchWall.start = true;
            }
        });

        this.bob = 0;
    }

    loop() {
        this.bob++;
        this.bob %= 41;
        if (this.bob == 0) this.bob++;

        var yScale = getHCompScale(40, this.bob);
        var yOffset = getYUCompOffset(yScale);

        var xScale = getVCompScale(40, this.bob);

        this.blob.body.render.sprite.yScale = yScale;
        this.blob.body.render.sprite.yOffset = -yOffset;

        this.blob.body.render.sprite.xScale = xScale;

        if (this.blob.touchWall.start) {
            this.blob.fixInPlace()
            console.log(this.blob.touchWall.timer)
            this.blob.touchWall.timer++

            if (this.keys[37]!=true && this.blob.touchWall.keys[1]){
                this.blob.touchWall.x = -1
            }
            if (this.keys[38]!=true && this.blob.touchWall.keys[0]){
                this.blob.touchWall.y = 1
            }
            if (this.keys[40]!=true && this.blob.touchWall.keys[2]){
                this.blob.touchWall.y = -1
            }
            if (this.keys[39]!=true && this.blob.touchWall.keys[3]){
                this.blob.touchWall.x = 1
            }

            this.blob.touchWall.keys[0] = this.keys[38] //wasd its actually ijkl but this is easier to undrestand
            this.blob.touchWall.keys[1] = this.keys[37] //wasd
            this.blob.touchWall.keys[2] = this.keys[40] //wasd
            this.blob.touchWall.keys[3] = this.keys[39] //wasd

            if (this.blob.touchWall.timer == 31){
                this.blob.unFixInPlace()
                this.blob.touchWall.timer = 0
                this.blob.touchWall.start = false
                console.log(this.blob.touchWall.x)
                if (this.blob.touchWall.x==1){
                    this.blob.startMoveRight();
                }
                if (this.blob.touchWall.x==-1){
                    this.blob.startMoveLeft();
                }
                if (this.blob.touchWall.y==1){
                    this.blob.doMoveUp()
                }
                if (this.blob.touchWall.y==-1){
                    this.blob.doMoveDown()
                }

                //console.log(this.blob.touchWall.keys)
                //console.log(this.blob.touchWall.x)
                //console.log(this.blob.touchWall.y)
            }
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
            this.blob.jump();
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
