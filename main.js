class Blob {
    constructor() {
        var blobimg = document.getElementById("blobimg");
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
        
        this.isOnGround = false;
    }

    startMoveLeft() { 
        if (this.isMovingRight) this.stopMoveRight();
        this.isMovingLeft = true;
        this.body.render.sprite.texture = 'img/blob.png';
    }
    doMoveLeft() {
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
        Matter.Body.setVelocity(this.body, {x:this.moveSpeed, y:this.body.velocity.y});
    }
    stopMoveRight() {
        this.isMovingRight = false;
    }

    holdJump() {
        this.isHoldingJump = true;
    }
    unHoldJump() {
        this.isHoldingJump = false;
        this.jumpShort();
    }

    jump() { // this resets x velocity (should not reset)
        if (!this.isOnGround) return;
        
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
            40: { //down
                up: () => {},
                down: () => {}
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
        });
    }

    loop() {
        if (this.blob.isMovingLeft) {
            this.blob.doMoveLeft();
        }
        if (this.blob.isMovingRight) {
            this.blob.doMoveRight();
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

        console.log(e.keyCode);
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
