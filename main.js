class Blob {
    constructor() {
        this.x = 0;
        this.y = 0;
        
        this.dx = 0;
        this.dy = 0;
    }
}

class Game {
    constructor() {
        this.canvas = document.getElementById("display");
        this.ctx = canvas.getContext("2d");
        this.blob = new Blob();
        setInterval(this.loop, 100);
    }

    function drawBlob() {
        this.ctx.beginPath();
        this.ctx.rect(this.blob.x, this.blob.y, 50, 50);
        this.ctx.fillStyle = "#000000";
        this.ctx.fill();
        this.ctx.closePath();
    }

    function loop() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        drawBlob();
        
        this.blob.x += this.blob.dx;
        this.blob.y += this.blob.dy;
    }
}

const game = new Game();
