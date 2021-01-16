class Blob {
    constructor() {
        this.body = Matter.Bodies.rectangle(400, 0, 50, 50, {
            mass: 100
        });
        this.onGround = true;
    }

    jump() {
        if (!this.onGround) return;
        //Matter.Body.applyForce(this.body, this.body.position, {x:0, y:-2});
        Matter.Body.setVelocity(this.body, {x:0, y:-8});
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
        var ground = Matter.Bodies.rectangle(400, 500, 810, 60, {isStatic:true});
        //ground.type = 'floor';

        Matter.World.add(this.engine.world, [this.blob.body, ground]);

        Matter.Engine.run(this.engine);
        Matter.Render.run(this.render);

        this.keys = {};

        this.keyFuncs = {
            38: { // up
                up: () => {
                    this.blob.jump();
                },
                down: () => {}
            }
        };
        
        var t = this;

        document.addEventListener('keydown', e => {
            t.handleKeyDown(e);
        }, false);
        
        document.addEventListener('keyup', e => {
            t.handleKeyUp(e);
        }, false);

        Matter.Events.on(this.engine, 'collisionStart', e => {
            console.log(e.name);
        });
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

        console.log(e.keyCode);
    }
}

var game = new Game();

game.start();
