class Blob {
    constructor() {
        this.x = 0;
        this.y = 0;
        
        this.dx = 20;
        this.dy = 5;
    }

    move() {
        this.x += this.dx;
        this.y += this.dy;
    }
}

class Game {
    start() {
        this.canvas = document.getElementById("display");
        this.ctx = this.canvas.getContext("2d");
        this.blob = new Blob();

        var t = this;

        setInterval(function() {
            t.loop();
        }, 1000);
    }

    drawBlob() {
        this.ctx.beginPath();
        this.ctx.rect(this.blob.x, this.blob.y, 50, 50);
        this.ctx.fillStyle = "#000000";
        this.ctx.fill();
        this.ctx.closePath();
    }

    loop() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.blob.move();

        this.drawBlob();
    }       
}

var game = new Game();

game.start();
