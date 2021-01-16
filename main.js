class Blob {
    constructor() {
        this.body = Matter.Bodies.rectangle(400, 0, 50, 50, {
            mass: 100,
            label: 'blob'
        });
        this.jumpSpeed = 10;
        this.jumpShortSpeed = 4;
        this.moveSpeed = 8;
        
        this.onGround = false;
    }

    moveLeft() { // this causes lag (and resets y vel...)
        Matter.Body.setVelocity(this.body, {x:-this.moveSpeed, y:0});
    }

    moveRight() { // same here
        Matter.Body.setVelocity(this.body, {x:this.moveSpeed, y:0});
    }

    jump() { // this resets x velocity (should not reset)
        if (!this.onGround) return;
        
        Matter.Body.setVelocity(this.body, {x:0, y:-this.jumpSpeed});
        this.onGround = false;
    }

    jumpShort() { //also resets x velocity
        if (this.body.velocity.y < -this.jumpShortSpeed) {
            Matter.Body.setVelocity(this.body, {x:0, y:-this.jumpShortSpeed});
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
                width: 800,
                height: 600,
                wireframes: false
            }
        });

        this.blob = new Blob();
        var ground = Matter.Bodies.rectangle(400, 500, 810, 60, {isStatic:true, label:'ground'});

        Matter.World.add(this.engine.world, [this.blob.body, ground]);

        Matter.Engine.run(this.engine);
        Matter.Render.run(this.render);

        this.keys = {};

        this.keyFuncs = {
            37: { //left
                up: () => {},
                down: () => {}
            },
            38: { // up
                up: () => {
                    this.blob.jump();
                },
                down: () => {
                    this.blob.jumpShort();
                }
            },
            39: { // right
                up: () => {},
                down: () => {}
            },
            40: { //down
                up: () => {},
                down: () => {}
            },
            68: { // d
                up: () => {},
                down: () => {}
            }
        };
        
        var t = this;
        document.addEventListener('keydown', e => {t.handleKeyDown(e)}, false);
        document.addEventListener('keyup', e => {t.handleKeyUp(e)}, false);
        setInterval(function() {t.loop()}, 16.666666);

        Matter.Events.on(this.engine, 'collisionStart', e => {
            var pairs = e.pairs[0];
            if (pairs.bodyA.label == 'blob' && pairs.bodyB.label == 'ground') {
                this.blob.onGround = true;
            }
        });
    }

    loop() {
        if (this.keys[37]) {
            this.blob.moveLeft();
        }
        if (this.keys[39]) {
            this.blob.moveRight();
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
