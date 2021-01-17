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
        this.jumpSpeed = 8;
        this.jumpShortSpeed = 4;
        this.moveSpeed = 6;

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
	bounce(){
		this.bounceDown();
	}
	bounceDown(){
		for(var i = 0; i < 300; i+=3){
			if(i>=150){
				setTimeout(function(blobbody){
					blobbody.render.sprite.yScale += 0.005;
					blobbody.render.sprite.xScale -= 0.005;
					blobbody.render.sprite.yOffset += 0.005;
				}, i, this.body);
			} else {
				setTimeout(function(blobbody){
					blobbody.render.sprite.yScale -= 0.005;
					blobbody.render.sprite.xScale += 0.005;
					blobbody.render.sprite.yOffset -= 0.005;
				}, i, this.body);
			}
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
                wireframes: false
            }
        });

        this.blob = new Blob();
        var ground = Matter.Bodies.rectangle(400, 600, 2010, 60, {isStatic:true, label:'ground'});
		var wall = Matter.Bodies.rectangle(0, 900, 10, 4000, {isStatic:true, label:'wall'});
		
		
        Matter.World.add(this.engine.world, [ground, wall, this.blob.body]);

        Matter.Engine.run(this.engine);
        Matter.Render.run(this.render);

        this.keys = {};

        this.keyFuncs = {
            37: { //left
                up: () => {
                    this.blob.startMoveLeft();
                },
                down: () => {
                    this.blob.stopMoveLeft();
                }
            },
            38: { // up
                up: () => {
                    this.blob.holdJump();
                },
                down: () => {
                    this.blob.unHoldJump();
                }
            },
            39: { // right
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
            40: { //down
                up: () => {
					this.blob.startMoveDown();
				},
                down: () => {
					this.blob.stopMoveDown();
				}
            },
            68: { // d
                up: () => {},
                down: () => {}
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
			this.blob.bounce();
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
		/*Matter.Events.on(this.engine, 'collisionEnd', e=> {
			this.blob.body.render.sprite.yScale += 0.1;
			this.blob.body.render.sprite.xScale -= 0.1;
			this.blob.body.render.sprite.yOffset += 0.1;
        });*/
    }

    loop() {

        if (this.blob.touchWall.start && 0==1) {
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
